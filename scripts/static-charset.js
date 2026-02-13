/**
 * 为 .mdc / .txt 等文本类静态文件设置 Content-Type: text/plain; charset=utf-8，
 * 避免浏览器误判编码导致中文乱码。priority 5 确保在 hexo-server 的 static(10) 之前执行。
 */
'use strict';

const path = require('path');
const fs = require('fs');

const TEXT_EXTENSIONS = new Set(['.mdc', '.txt', '.md', '.json', '.xml', '.yml', '.yaml']);

function shouldSetCharset(ext) {
  return TEXT_EXTENSIONS.has((ext || '').toLowerCase());
}

hexo.extend.filter.register('server_middleware', function(app) {
  const root = (this.config.root || '/').replace(/\/$/, '') || '';
  const publicDir = this.public_dir;

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    let urlPath = req.url;
    try {
      urlPath = decodeURIComponent(urlPath);
    } catch (_) {}
    const q = urlPath.indexOf('?');
    if (q !== -1) urlPath = urlPath.slice(0, q);
    const ext = path.extname(urlPath);
    if (!shouldSetCharset(ext)) return next();

    let relative = urlPath.slice(0, 1) === '/' ? urlPath.slice(1) : urlPath;
    const rootTrim = root.replace(/^\//, '').replace(/\/$/, '');
    if (rootTrim && relative.startsWith(rootTrim + '/')) {
      relative = relative.slice(rootTrim.length + 1);
    } else if (rootTrim && relative !== rootTrim && !relative.startsWith(rootTrim)) {
      return next();
    }

    const filePath = path.join(publicDir, relative);
    const pubResolved = path.resolve(publicDir);
    const fileResolved = path.resolve(filePath);
    if (fileResolved !== pubResolved && !fileResolved.startsWith(pubResolved + path.sep)) return next();

    fs.stat(filePath, (err, stat) => {
      if (err || !stat || !stat.isFile()) return next();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', next);
    });
  });
}, 5);

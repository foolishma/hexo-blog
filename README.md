# Hexo 博客 (Butterfly 主题)

本地运行与部署说明。

## 本地开发

```bash
cd hexo-blog
npm install   # 已安装可跳过
npm run server
```

浏览器访问：http://localhost:4000

## 生成静态文件

```bash
npm run build
# 或
npx hexo generate
```

生成结果在 `public/` 目录。

## 部署到 GitHub Pages (foolishma.github.io)

1. 确保已配置 Git 并可访问 GitHub（建议配置 SSH 或 Personal Access Token）。
2. 若仓库默认分支为 `master`，请将 `_config.yml` 中 `deploy.branch` 改为 `master`。
3. 执行部署：

```bash
npx hexo deploy
# 或
npm run deploy
```

部署会将 `public/` 内容推送到：https://github.com/foolishma/foolishma.github.io

## 常用命令

| 命令 | 说明 |
|------|------|
| `hexo new "文章标题"` | 新建文章 |
| `hexo new page "页面名"` | 新建页面 |
| `hexo clean` | 清理缓存与 public |
| `hexo generate` / `hexo g` | 生成站点 |
| `hexo server` / `hexo s` | 本地预览 |
| `hexo deploy` / `hexo d` | 部署 |

## 配置说明

- 站点与 URL：根目录 `_config.yml`（title、url、deploy 等）。
- Butterfly 主题：可复制 `node_modules/hexo-theme-butterfly/_config.yml` 到项目根目录并重命名为 `_config.butterfly.yml` 进行自定义。

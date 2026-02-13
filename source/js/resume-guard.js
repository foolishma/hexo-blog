/**
 * 简历页访问控制：仅博主凭访问码可见「简历」菜单并查看简历页
 * 请在下方 RESUME_SECRET 改为你自己的访问码（仅你自己知道即可）
 */
(function () {
  var RESUME_SECRET = 'change_me'; // 请修改为你的访问码，仅博主本人使用

  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? decodeURIComponent(v[2]) : '';
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days || 365) * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';path=/;expires=' + d.toUTCString() + ';SameSite=Lax';
  }

  var ok = getCookie('resume_ok') === RESUME_SECRET || getCookie('resume_ok') === '1';

  if (!ok) {
    // 隐藏导航中「简历」菜单项
    var links = document.querySelectorAll('a[href*="/resume/"]');
    for (var i = 0; i < links.length; i++) {
      var li = links[i].closest('li');
      if (li) li.style.display = 'none';
    }

    // 当前是简历页时：全屏不透明蒙层 + 禁止滚动，输入访问码后才显示正文
    if (window.location.pathname.replace(/\/$/, '').indexOf('resume') !== -1) {
      var html = document.documentElement;
      var body = document.body;
      var scrollY = window.scrollY || window.pageYOffset;

      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.left = '0';
      body.style.right = '0';
      body.style.top = '-' + scrollY + 'px';
      body.style.width = '100%';
      html.style.overflow = 'hidden';

      var overlay = document.createElement('div');
      overlay.id = 'resume-lock-overlay';
      overlay.style.cssText =
        'position:fixed;inset:0;z-index:2147483647;' +
        'background:#111;' +
        'display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;' +
        'color:#fff;font-family:system-ui,sans-serif;' +
        'overflow:auto;touch-action:none;';
      overlay.innerHTML =
        '<p style="margin:0;font-size:1.1rem;">简历页仅博主可见</p>' +
        '<p style="margin:0;font-size:0.9rem;color:#aaa;">请输入访问码</p>' +
        '<input id="resume-secret-input" type="password" placeholder="访问码" style="padding:8px 12px;font-size:1rem;border-radius:6px;border:1px solid #555;background:#222;color:#fff;min-width:180px;">' +
        '<button id="resume-secret-btn" style="padding:8px 20px;font-size:1rem;border-radius:6px;border:none;background:#49B1F5;color:#fff;cursor:pointer;">确认</button>' +
        '<p id="resume-secret-err" style="margin:0;font-size:0.85rem;color:#f56c6c;display:none;">访问码错误</p>';
      document.body.appendChild(overlay);

      function unlock() {
        var input = document.getElementById('resume-secret-input');
        if (input && input.value === RESUME_SECRET) {
          setCookie('resume_ok', '1', 365);
          overlay.remove();
          body.style.overflow = '';
          body.style.position = '';
          body.style.left = '';
          body.style.right = '';
          body.style.top = '';
          body.style.width = '';
          html.style.overflow = '';
          window.scrollTo(0, scrollY);
        } else {
          var err = document.getElementById('resume-secret-err');
          if (err) err.style.display = 'block';
        }
      }

      document.getElementById('resume-secret-btn').onclick = unlock;
      document.getElementById('resume-secret-input').onkeydown = function (e) {
        if (e.key === 'Enter') unlock();
      };
    }
  }
})();

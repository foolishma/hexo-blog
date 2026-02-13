# Hexo 博客 (Butterfly 主题)

- **源码仓库**：[foolishma/hexo-blog](https://github.com/foolishma/hexo-blog)（本仓库）
- **站点 / 构建产物**：[foolishma.github.io](https://github.com/foolishma/foolishma.github.io)（`hexo deploy` 推送目标）

## 直接使用 hexo 命令（可选）

若希望在任何目录下直接使用 `hexo clean`、`hexo g`、`hexo s`、`hexo d` 等命令，需先全局安装 hexo-cli，并保证 npm 全局目录在系统 PATH 中：

```bash
npm install -g hexo-cli
```

安装后，在**本项目目录**下即可直接执行 `hexo clean`、`hexo g`、`hexo s` 等，无需再写 `npx hexo` 或 `npm run xxx`。

## 本地开发

```bash
cd hexo-blog
npm install   # 已安装可跳过
npm run server
# 若已全局安装 hexo-cli，也可直接：hexo s
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

**重要**：仅执行 `hexo g`（或 `npm run build`）只会把站点生成到本地 `public/` 目录，**不会推送到远端**。要把构建结果推到 GitHub Pages，必须执行 **`hexo deploy`**（或 `hexo g -d` 一次完成生成并推送）。

1. 确保已配置 Git 并可访问 GitHub（建议配置 SSH 或 Personal Access Token）。
2. 本仓库部署目标分支为 `master`（与 foolishma.github.io 仓库一致）。
3. 执行部署（在项目目录下）：

```bash
# 方式一：先生成再部署
hexo g
hexo d

# 方式二：一条命令完成生成并推送到远端
hexo g -d
```

部署会将 `public/` 内容推送到：https://github.com/foolishma/foolishma.github.io

**若执行 `hexo d` 后仍没有推送到远端**：多为 Git 认证失败。请检查：
- 使用 HTTPS 时：是否已配置 Personal Access Token（密码已不可用）；
- 使用 SSH 时：本机是否已添加公钥到 GitHub，且 `_config.yml` 中 `deploy.repo` 使用 `git@github.com:xxx/xxx.github.io.git` 形式。

## Hexo 命令说明（从启动到构建）

按日常使用顺序说明各命令含义：

| 命令 | 含义 | 说明 |
|------|------|------|
| `hexo clean` | **清理** | 删除缓存（`db.json`）和已生成的 `public/` 目录，避免旧文件干扰下次生成。修改主题或配置后建议先执行。 |
| `hexo generate`<br>`hexo g` | **构建 / 生成** | 根据 `source/`、主题和配置生成静态站点到 `public/`，是部署前必须的一步。 |
| `hexo server`<br>`hexo s` | **启动本地服务** | 启动本地预览服务器（默认 http://localhost:4000），可带 `-p 端口` 指定端口。开发时用于实时查看效果。 |
| `hexo deploy`<br>`hexo d` | **部署** | 将 `public/` 中的静态文件按 `_config.yml` 的 `deploy` 配置推送到远程（如 GitHub Pages）。通常先执行 `hexo g` 再执行本命令，或使用 `hexo g -d` 一次完成生成并部署。 |
| `hexo new "文章标题"` | **新建文章** | 在 `source/_posts/` 下创建一篇新博文（Markdown），并写入 front matter。 |
| `hexo new page "页面名"` | **新建页面** | 在 `source/` 下创建以页面名为文件夹的独立页面（如「关于」「归档」等）。 |

**典型流程**：`hexo clean` → `hexo g` → `hexo s`（本地预览）或 `hexo g -d`（生成并部署）。

## 导航菜单说明（首页 / 归档 / 标签 / 分类）

站点顶部或侧栏的菜单项含义与数据来源如下。

### 首页

- **是什么**：博客主页，按时间倒序展示所有已发布的文章列表（摘要或封面卡片）。
- **对应路径**：`/`
- **数据来源**：Hexo 根据 `source/_posts/` 下的 Markdown 文章自动生成首页；文章数量、分页由 `_config.yml` 的 `per_page` 等控制。

### 归档

- **是什么**：按**时间**（年 / 月）汇总所有文章，方便按时间线浏览历史文章。
- **对应路径**：`/archives/`
- **数据来源**：由插件 `hexo-generator-archive` 在 `hexo g` 时根据文章 front matter 的 `date` 自动生成归档页；无需手写，只要文章有日期就会有归档。
- **典型用途**：想找「某年某月写了什么」时使用。

### 标签

- **是什么**：按**标签（tag）** 聚合文章。一篇文章可以打多个标签，一个标签下会列出所有带该标签的文章。
- **对应路径**：`/tags/`（标签总览）→ 点击某个标签进入如 `/tags/某标签名/`
- **数据来源**：
  - 标签总览页与各标签子页由 `hexo-generator-tag` 在 `hexo g` 时自动生成。
  - 每篇文章在 Markdown 的 front matter 里用 `tags: [标签A, 标签B]` 指定标签。
- **典型用途**：按主题/技术点查找文章（如「Vue」「读书笔记」）。

### 分类

- **是什么**：按**分类（category）** 聚合文章。一篇文章通常只属于一个分类（也可多级，如「编程 / 前端」）。
- **对应路径**：`/categories/`（分类总览）→ 点击某个分类进入如 `/categories/某分类名/`
- **数据来源**：
  - 分类总览页与各分类子页由 `hexo-generator-category` 在 `hexo g` 时自动生成。
  - 每篇文章在 Markdown 的 front matter 里用 `categories: 分类名` 或 `categories: [父级, 子级]` 指定分类。
- **典型用途**：按栏目/类型浏览（如「随笔」「教程」）。

### 小结

| 菜单 | 作用           | 内容由谁决定                         |
|------|----------------|--------------------------------------|
| 首页 | 时间倒序文章列表 | 所有 `_posts` 下的文章 + 分页配置    |
| 归档 | 按年月汇总     | 文章 `date`，自动按时间聚合          |
| 标签 | 按标签汇总     | 文章 front matter 里的 `tags`        |
| 分类 | 按分类汇总     | 文章 front matter 里的 `categories`  |

菜单项本身在主题配置 `_config.butterfly.yml` 的 `menu` 中修改（显示名、路径、图标）；归档/标签/分类的**页面内容**完全由 Hexo 根据文章与插件自动生成，无需手写 Markdown 页面。

## 如何写文章（分类与标签）

### 1. 新建一篇文章

在项目根目录执行：

```bash
hexo new "文章标题"
```

会在 `source/_posts/` 下生成一个 Markdown 文件，例如 `文章标题.md`。

### 2. 编辑文章：front matter + 正文

用任意编辑器打开该文件，**最上方两行 `---` 之间的内容叫 front matter**，用来设置标题、日期、**分类**、**标签**等；下面用 Markdown 写正文即可。

### 3. 如何添加分类（categories）

在 front matter 里写 `categories`：

- **单分类**（最常用）：
  ```yaml
  categories: 随笔
  ```
  或
  ```yaml
  categories:
    - 随笔
  ```

- **多级分类**（如「编程 / 前端」）：
  ```yaml
  categories:
    - 编程
    - 前端
  ```

文章会出现在「分类」菜单下对应分类页面里；若该分类第一次出现，Hexo 会在生成时自动创建该分类页。

### 4. 如何添加标签（tags）

在 front matter 里写 `tags`，一篇文章可以有多个标签：

```yaml
tags:
  - Vue
  - 前端
  - 读书笔记
```

或单行列表：

```yaml
tags: [Vue, 前端, 读书笔记]
```

文章会出现在「标签」菜单下各个对应标签页面里。

### 5. 一篇完整示例

```yaml
---
title: 我的第一篇文章
date: 2026-02-12 12:00:00
categories: 随笔
tags:
  - 日常
  - 记录
# 可选：首页摘要（不写则自动截取正文前一段）
description: 这是文章的简短摘要，会显示在首页列表里。
# 可选：文章封面图（Butterfly 主题）
cover: https://example.com/img.jpg
---

这里开始用 **Markdown** 写正文即可。
```

### 6. 常用可选字段（front matter）

| 字段 | 说明 |
|------|------|
| `title` | 文章标题（新建时已生成，可改） |
| `date` | 发布日期（新建时已生成） |
| `updated` | 更新日期（可选，不写一般用文件修改时间） |
| `categories` | 分类，见上文 |
| `tags` | 标签，见上文 |
| `description` | 首页/摘要显示的文字 |
| `cover` | 文章封面图 URL（Butterfly 主题） |
| `top_img` | 文章页顶部图（Butterfly） |
| `comments` | 是否开启评论，如 `true` / `false` |

### 7. 如何在文章里添加附件

附件（PDF、ZIP、图片等）需要先放到**站点源码**里，再在文章中用链接指向即可。

**步骤一：建目录并放入文件**

在 `source/` 下建一个专门放附件的目录，例如 `files` 或 `attachments`，把文件放进去：

```
source/
  files/           ← 新建
    readme.pdf
    demo.zip
  _posts/
    xxx.md
```

**步骤二：在文章里写链接**

生成后，`source/files/` 下的文件会出现在站点的 `/files/` 路径下。在 Markdown 里用普通链接即可：

```markdown
[下载说明文档](/files/readme.pdf)
[示例压缩包](/files/demo.zip)
```

或带说明文字：

```markdown
- **附件**：[项目说明.pdf](/files/readme.pdf)
- **示例代码**：[demo.zip](/files/demo.zip)
```

**注意：**

- 路径以 `/` 开头表示从站点根目录算（本仓库 `root: /`，所以是 `/files/xxx.pdf`）。
- 若站点部署在子路径（如 `https://xxx.github.io/blog/`），需在 `_config.yml` 里设置 `root: /blog/`，链接仍写 `/blog/files/xxx.pdf` 或使用根路径后由 Hexo 自动加上 `root`。
- 文件名建议用英文或数字，避免中文或特殊符号导致部分环境无法访问。

**图片附件**：图片也可放在 `source/files/` 或 `source/images/`，在文中用 `![说明](/files/xxx.png)` 插入；若开启 `post_asset_folder`（见下方），每篇文章可有单独资源目录。

**可选：为每篇文章建资源目录**

在 `_config.yml` 里设置 `post_asset_folder: true`，执行 `hexo new "标题"` 时会同时生成同名文件夹（如 `标题.md` 与 `标题/`），把该文用的图片或附件放进该文件夹，在文章里用相对路径引用（如 `![图](标题/1.png)`）。适合「每篇文章自带资源」的写法；若附件要全站共用，仍推荐用上面的 `source/files/` 方式。

### 8. 写完后

保存文件后，本地预览：

```bash
hexo clean
hexo g
hexo s
```

在首页、归档、标签、分类里都能看到新文章；确认无误后再执行 `hexo d` 部署到线上。

### 9. 简历页仅博主可见

导航中的「简历」及 `/resume/` 页面做了访问控制：未验证时隐藏菜单，直接打开 `/resume/` 会显示「请输入访问码」遮罩。

- **设置访问码**：编辑 `source/js/resume-guard.js`，将开头的 `RESUME_SECRET = 'change_me'` 改为你自己设置的访问码（仅自己知道即可）。
- **使用**：在任意页面输入正确访问码并确认后，会记住验证状态（约 1 年），之后导航会显示「简历」、简历页可正常查看。
- **说明**：验证逻辑在前端执行，属于「防君子不防小人」的软性控制；简历 HTML 仍在页面中，仅通过遮罩与菜单隐藏减少被随意看到。

### 10. 访客/浏览量统计（Umami，分站点真实统计）

本站已关闭不蒜子，改用 **Umami** 做「仅本博客」的访客数（UV）与浏览量（PV）统计。

1. **注册并添加网站**  
   打开 [umami.is](https://umami.is) 注册账号，在控制台里「添加网站」，填你的博客地址（如 `https://foolishma.github.io`）。

2. **获取 website_id**  
   添加完成后，在「跟踪代码」或网站详情里找到 **Website ID**（一串 UUID），复制。

3. **获取 API 密钥（用于侧栏显示 UV/PV）**  
   在 Umami 里进入 **设置 → API 密钥**，创建新密钥并复制。

4. **填入主题配置**  
   编辑 `_config.butterfly.yml`，找到 `umami_analytics`：
   - `website_id: ''` → 粘贴你的 Website ID（保留引号）。
   - `UV_PV.token: ''` → 粘贴你的 API 密钥（保留引号）。

保存后执行 `hexo g` 再预览/部署，侧栏「网站信息」中的「本站访客数」「本站总浏览量」会显示**本博客**的真实统计。未填 `website_id` 和 `token` 时，这两项可能一直转圈或为空，属正常，填好即恢复。

## 配置说明

- 站点与 URL：根目录 `_config.yml`（title、url、deploy 等）。
- Butterfly 主题：可复制 `node_modules/hexo-theme-butterfly/_config.yml` 到项目根目录并重命名为 `_config.butterfly.yml` 进行自定义。

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

## 配置说明

- 站点与 URL：根目录 `_config.yml`（title、url、deploy 等）。
- Butterfly 主题：可复制 `node_modules/hexo-theme-butterfly/_config.yml` 到项目根目录并重命名为 `_config.butterfly.yml` 进行自定义。

---
title: 前端工程化与构建优化实践
date: 2026-02-14 11:00:00
categories: 前端
tags:
  - 前端
  - 工程化
  - Vite
  - 性能
description: 记录 Vite 迁移与配置、打包体积与构建速度、Monorepo 选型及 CI/CD 协作等工程化实践。
permalink: 2026/02/14/frontend-engineering-build-optimization/
---

## 一、工程化的落点

工程化关注**团队提效与构建稳定**：构建升级、打包体积与速度、规范与协作。以下为实践中的具体配置与操作记录。

---

## 二、Vite 迁移与配置

### 2.1 迁移动机与前提

- Webpack 冷启动与 HMR 较慢、配置复杂；Vite 基于 ESM 的 dev 体验与 Rollup 生产构建，更适合现代 Vue/React 项目。
- 迁移前确认：依赖是否多为 ESM、是否有大量 Webpack 特有 API（如 `require.context` 需改为 `import.meta.glob`）。

### 2.2 依赖预构建（optimizeDeps）

部分 CommonJS 或未提供 ESM 的包需显式加入预构建，否则 dev 会报错或请求过多小文件：

```js
// vite.config.js / vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: [
      'element-plus',
      'element-plus/es/components/message/style/css',
      'vue', 'vue-router', 'pinia',
      // 其他在 dev 时报错或加载慢的包
    ],
    exclude: ['某个不需要预构建的包'],
  },
})
```

### 2.3 环境变量与多环境

- 根目录 `.env`、`.env.development`、`.env.production`，变量以 `VITE_` 开头才会暴露给前端。
- 使用：`import.meta.env.VITE_APP_API_BASE`。

```bash
# .env.development
VITE_APP_API_BASE=/api
VITE_APP_TITLE=本地开发
```

### 2.4 与后端联调：proxy

开发时跨域通过 proxy 转发到后端：

```js
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### 2.5 生产构建：拆包与体积控制

用 `manualChunks` 把大库单独打 chunk，避免首屏主 chunk 过大：

```js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) return 'element-plus'
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) return 'vue-vendor'
            if (id.includes('echarts') || id.includes('zrender')) return 'echarts'
            return 'vendor'
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
```

按路由拆 chunk 可用动态 import：`() => import('@/views/xxx.vue')`，Vite 会自动 code splitting。

### 2.6 静态资源路径 base

部署在子路径（如 `https://xxx.com/app/`）时：

```js
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/app/' : '/',
})
```

---

## 三、打包体积与构建速度

### 3.1 体积分析

安装并启用可视化分析，构建后查看各模块占比：

```bash
pnpm add -D rollup-plugin-visualizer
```

```js
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ],
})
```

执行 `pnpm build` 后会生成 `stats.html` 并打开，便于定位大包（如 moment、lodash 全量、未按需的 UI 库）。

### 3.2 组件库按需引入

Element Plus 按需引入，避免全量打包：

```ts
// 自动按需，需配合 unplugin-vue-components、unplugin-auto-import
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
})
```

### 3.3 大依赖 CDN 或动态导入

- 非首屏必需的大库（如 echarts、xlsx）用 `() => import('echarts')` 动态导入，首屏不加载。
- 或通过 `build.rollupOptions.external` + CDN 在 index.html 用 script 引入，减少主 bundle 体积。

### 3.4 图片与字体

- 图片：压缩（如 vite-plugin-imagemin 或构建前用 tinypng）、优先 WebP；小图可转 base64（Vite 默认 4kb 以下内联）。
- 字体：优先 woff2，按需加载字体文件，避免在全局 CSS 一次性拉全量字体。

### 3.5 构建速度

- **CI 缓存**：缓存 `node_modules` 与构建产物（如 GitHub Actions 的 `actions/cache`，key 含 `pnpm-lock.yaml` 的 hash），第二次构建明显加快。
- **本地与 CI 统一 node 版本**：项目根目录 `.nvmrc` 写 `20` 或 `18`，CI 与本地均用同一版本，避免依赖安装差异。
- **减少 babel/ts 处理范围**：Vite 默认用 esbuild 转 ts，已较快；若有用 Babel 插件，尽量只对必要文件开启。

---

## 四、Monorepo 与多包协作

### 4.1 pnpm workspace 结构

根目录 `pnpm-workspace.yaml`：

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

目录示例：

```
.
├── apps
│   ├── web          # 主应用
│   └── admin        # 后台
├── packages
│   ├── ui           # 公共组件
│   ├── utils        # 工具函数
│   └── eslint-config
├── pnpm-workspace.yaml
├── package.json
```

根 `package.json` 的 scripts 可写：`"build": "pnpm -r run build"`（递归执行各包 build）。

### 4.2 公共依赖提升

公共依赖在根目录安装一次，子包通过 `workspace:*` 或 `*` 引用；避免多份重复安装。

### 4.3 Turborepo 构建顺序（可选）

若用 Turborepo，在 `turbo.json` 中声明依赖关系，保证先构建被依赖的包：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

`^build` 表示先执行依赖包的 build，再执行当前包。

### 4.4 发布与版本号

多包发布可用 changeset：`pnpm add -D @changesets/cli`，按 changeset 的改动文件决定哪些包需要 bump 版本并发布，避免手动改版本号。

---

## 五、规范与 CI/CD

### 5.1 ESLint + Prettier

- ESLint 负责规则与报错，Prettier 负责格式；配合 `eslint-config-prettier` 关闭与 Prettier 冲突的规则。
- Vue 项目常用：`eslint-plugin-vue`、`@vue/eslint-config-typescript`；保存时自动格式化（编辑器 format on save + 默认 formatter 选 Prettier）。

### 5.2 提交信息规范：commitlint + husky

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional husky
npx husky init
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

在 `.husky/commit-msg` 中增加：`npx --no -- commitlint --edit $1`，提交时不符合 conventional 格式会拦截。常见 type：`feat`、`fix`、`docs`、`style`、`refactor`、`chore`。

### 5.3 CR 清单

在 PR 模板或 CR 说明中固定包含：功能是否自测、是否通过 lint/类型检查、是否有明显性能或安全风险、规范是否通过（命名、目录、注释等）。

### 5.4 CI 流水线示例（GitHub Actions）

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run build
```

部署到测试/生产可再起一个 job，依赖 `build`，将 `dist` 推送到对象存储或服务器；分支策略如 `main` 推则部署生产、`develop` 推则部署预览环境。

---

## 六、小结

- **Vite**：通过 `optimizeDeps`、`server.proxy`、`build.rollupOptions.output.manualChunks` 及环境变量、base 等完成迁移与生产可用配置。
- **体积与速度**：用 visualizer 分析、按需引入组件库、大依赖动态导入或 CDN、图片/字体优化；CI 缓存与统一 node 版本提升构建速度。
- **Monorepo**：pnpm workspace 约定目录与依赖，Turborepo 管构建顺序，changeset 管版本与发布。
- **规范与 CI**：ESLint + Prettier + commitlint + husky 固定风格与提交格式；CI 中跑 lint + build，部署按分支策略执行。上述配置均可按项目裁剪，形成可复现的工程化记录。

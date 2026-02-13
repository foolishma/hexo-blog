---
title: Cursor 规则动态加载指南：按需加载、避免上下文溢出
date: 2026-02-12 14:00:00
categories: Cursor AI相关
tags:
  - Cursor
  - Rules
  - 上下文
  - 最佳实践
description: 基于真实规则目录结构，说明如何用「索引 + 分层加载 + globs」实现规则动态加载，避免会话上下文溢出并提升响应速度。
permalink: 2026/02/12/cursor-rules-dynamic-loading/
---

## 一、为什么要「动态加载」规则

Cursor 的 Rules（`.mdc` / `.cursorrules`）会随对话进入模型上下文。规则越多、单文件越大，占用 token 越多，容易带来：

- **上下文溢出**：总 token 超限后无法继续长对话或无法带上全部规则。
- **响应变慢**：每次请求都带上大量规则，推理成本高。
- **噪音干扰**：与当前任务无关的规则也会被加载，影响效果。

若把十几条、上万行规则全部设为「始终加载」，既不现实也不必要。更合理的做法是：**只把当前任务相关的规则送进上下文**，其余按需加载。这就是「动态加载」规则要解决的问题。

---

## 二、规则目录结构示例（基于真实项目）

以下为规则目录结构示例，来源于实际项目中的 `source/files/rules/`（或项目根目录 `.cursor/rules/`），路径可按项目调整。

### 2.1 文件列表与角色

| 文件名 | 行数级 | 角色 | 加载方式 |
|--------|--------|------|----------|
| `index.mdc` | 小 | **规则索引**，供 AI 与开发者查阅 | `alwaysApply: true`，始终加载 |
| `global-development-standards.mdc` | 中 | 全局开发/注释/UI 规范 | `alwaysApply: true` |
| `vue-development-patterns.mdc` | 大 | Vue3 + Composition API 规范 | `globs: **/*.vue`，按文件类型 |
| `TableCommon-项目规则.mdc` | 很大 | 表格组件与 listData 配置 | `globs: **/listData.js` 等，按需 |
| `component-usage-guide.mdc` | 大 | 自定义组件使用说明 | `globs: **/components/**` |
| `vue-component-split-patterns.mdc` | 小 | 组件拆分规范 | `globs: **/views/**/components/**` |
| `api-fox-patterns.mdc` | 小 | Apifox 查询与接口规范 | 按关键词/手动 |
| `api-integration-workflow.mdc` | 中 | 接口联调与字段对接流程 | 按关键词/手动 |

特点：

- **索引唯一「始终加载」**：只有 `index.mdc`（和可选的一条全局规范）设为 `alwaysApply: true`，其余全部按需。
- **按文件路径触发**：通过 `globs` 匹配当前打开/编辑的文件，自动挂载对应规则。
- **按关键词/场景触发**：大文件或工具类规则不设 globs，在索引中写清关键词与场景，由对话中提到时再加载。

### 2.2 索引文件 `index.mdc` 在做什么

`index.mdc` 用**一张「规则地图」**替代「把所有规则内容塞进上下文」：

- 列出每个规则文件的：**路径、加载策略、适用场景、关键词、大致行数**。
- 说明**何时加载哪条**（按文件类型 / 按关键词 / 手动）。
- 统计总行数 vs 推荐同时加载的行数，提醒「大文件仅按需加载」。

这样 AI 和人都能快速判断：当前该打开哪几条规则，而不是一次性加载全部。索引本身体积小，适合 `alwaysApply: true`。

**规则索引文件附件**（可放入项目 `.cursor/rules/` 使用）：点击文件名预览，右侧按钮下载。

[规则索引 index.mdc](/files/rules/index.mdc) <a href="/files/rules/index.mdc" download="index.mdc" class="btn">下载</a>

---

## 三、Cursor 规则 front matter：和动态加载相关的字段

在 `.mdc` 文件顶部用 YAML 声明「何时加载」：

```yaml
---
alwaysApply: true   # 是否始终加载（通常只给索引 + 1 条全局规范）
globs:             # 匹配这些路径时自动加载（按文件类型）
  - "src/views/**/*.vue"
  - "src/components/**/*.vue"
description: 简短说明，供索引和 AI 理解
keywords: ["vue3", "composition-api", "组件"]
tags: ["vue3", "规范"]
---
```

- **`alwaysApply: true`**：只在少数 1～2 个文件上用（如 `index.mdc` + 一条全局规范），其余一律 `false`。
- **`globs`**：与当前编辑/打开的文件路径匹配时，该规则会被 Cursor 自动挂载；不匹配则不加载，实现「按文件类型」的动态加载。
- **`description` / `keywords` / `tags`**：写在索引中，供按关键词或场景决定加载哪条；大文件、工具类规则依赖索引中的这段说明。

---

## 四、分层加载策略（L1 / L2 / L3）

可以抽象成三层，和目录结构对应：

1. **L1 核心层（始终加载）**  
   - 仅：`index.mdc` + 可选一条「全局规范」小文件。  
   - 保证：任何会话都有一份「规则地图」和基础规范，不占太多 token。

2. **L2 按文件类型（globs 自动加载）**  
   - 编辑 `*.vue` → 自动带 Vue 规范；编辑 `listData.js` → 自动带 TableCommon 规则；编辑 `api/**` → 自动带接口相关规则。  
   - 通过 `globs` 精确匹配，避免无关规则被加载。

3. **L3 按需/手动（关键词或用户说明触发）**  
   - 大文件（如 5000+ 行的 TableCommon 规则）、或「接口联调」「查 Apifox」这类场景化规则，不在 globs 里写死，而是在索引里写清「触发关键词」和「使用场景」。  
   - 对话中出现「按 Apifox 做字段对接」等关键词时，依据索引加载 `api-integration-workflow.mdc`，避免平时占满上下文。

这样：**总规则量可以很大（例如上万行），但单次会话实际只加载 1～3 个文件（约 2000～4000 行）**，既避免溢出，又保证当前任务用到的规则都在。

---

## 五、规则与索引的维护

1. **索引必维护**  
   每新增或修改一条规则，在 `index.mdc` 中更新：路径、加载方式、适用场景、关键词、行数级（小/中/大）。

2. **大文件按需加载**  
   单文件超过约 2000 行，不设 `alwaysApply: true`，不用过宽 globs；采用精确 globs 或「索引 + 关键词」触发。

3. **globs 尽量精确**  
   示例：`**/listData.js`、`src/views/**/components/**/*.vue`；避免 `**/*.vue` 导致编辑任意 Vue 即加载全部 Vue 相关规则。

4. **关键词写清楚**  
   在索引中为每条规则写 3～5 个关键词和 1～2 句场景说明，便于根据对话内容决定加载哪条。

5. **命名与位置**  
   规则文件放在 `.cursor/rules/` 或统一的 `source/files/rules/` 下；文件名建议英文或中英混合。Hexo 站点可用 `skip_render: ['files/**']` 使该目录原样输出。

---

## 六、小结

- **动态加载**：用「索引 + 分层 + globs/关键词」控制「何时加载哪条规则」，避免所有规则 always 加载。
- **避免上下文溢出**：单次会话仅加载当前任务相关的 1～3 条规则，大文件与工具类规则按需或手动加载。
- 上述 `source/files/rules/` 结构（索引 + 多规则文件 + alwaysApply/globs/关键词）在规则量大时既可保证效果，又避免会话溢出。

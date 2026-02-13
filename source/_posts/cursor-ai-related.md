---
title: Cursor AI 相关：Rules、MCP 工具与前端提效指南
date: 2026-02-12 12:00:00
categories: Cursor AI相关
tags:
  - Cursor
  - AI
  - MCP
  - 前端
description: 从前言、Rules 生成、MCP 工具推荐（寸止/ Apifox/ Figma/ Context7 等）到前端大模型选择，总结如何通过配置与 AI 能力在开发中提效。
# 固定链接，避免中文标题导致详情页无法打开
permalink: 2026/02/12/cursor-ai-rules-mcp/
---

## 前言

在 Cursor、Claude Desktop 等 AI 编码工具里，**Rules（规则）** 和 **MCP（Model Context Protocol）工具** 是两套核心配置：Rules 决定 AI 的「行为准则」和上下文偏好，MCP 则把外部能力（API 文档、设计稿、文档检索、任务管理等）直接交给模型调用。再配合合适的大模型（如 Claude Code、Gemini），就能在前端开发里实现从需求理解、接口对接、设计还原到任务拆解的一体化提效。本文记录：Rules 的生成方式、MCP 的用途与配置、前端大模型选择，以及 Rules + MCP + 模型组合而成的提效链路。

---

## 一、如何生成 Rules

### 1. Rules 是什么

**Rules** 是 Cursor 里给 AI 的「项目级/全局级说明」：技术栈、编码规范、目录约定、何时用哪些库等。写好 Rules，AI 生成的代码会更贴项目习惯、少犯低级错误。

- **项目级**：在项目根目录的 `.cursor/rules/` 下放 `.mdc` 文件，或根目录的 `.cursorrules`。
- **全局级**：在 Cursor 设置里配置，对所有项目生效。

### 2. 如何「生成」Rules

**方式一：用 Cursor 自带界面（推荐）**

1. 打开 Cursor 设置（`Ctrl+Shift+J` / `Cmd+Shift+J`）。
2. 找到 **Rules**，点击 **+ Add new rule**。
3. 填写规则名称（会对应一个 `.mdc` 文件）、类型，再写规则内容。

**方式二：手动建文件**

- 在项目根建 `.cursor/rules/`，新建 `xxx.mdc`。
- 或根目录建 `.cursorrules`（纯文本，无扩展名也行，视 Cursor 版本而定）。

**方式三：用在线生成器**

- [cursorrules.org](https://www.cursorrules.org/zh) / [cursorrules.agnt.one](https://cursorrules.agnt.one/) 等可根据技术栈、风格生成一版规则，复制到 `.mdc` 或 `.cursorrules` 再按项目微调。

### 3. 规则类型简要说明

- **Always**：每次对话都会带上，适合「全局规范」。
- **Auto Attached**：打开/提到某类文件时自动挂上，适合「Vue 规范」「测试规范」等。
- **Agent Requested**：Agent 觉得需要时再加载。
- **Manual**：仅在被 @ 或明确提到时加载。

常见做法：一个 **Always** 写技术栈与通用规范（如 Composition API、目录结构），再按需为 `*.vue`、`*.test.ts` 等配置 **Auto Attached** 规则。

### 4. 项目级 Rules 文件示例

以下为项目级规则示例：内容放入 `.cursor/rules/xxx.mdc`（如 `aura-x.mdc`）或项目根目录的 `.cursorrules`，Cursor 在该项目内自动加载。

````markdown
你是集成在IDE中的**终极编程大魔王**，一个融合了多个先进系统能力的超级AI助手：

- **Claude Code** 的完整工具集成与任务管理系统
- **AURA-X协议** 的智能控制框架（寸止增强版）
- **七大执行模式** 的系统化工作流程
- **五大专业人格** 的领域专精能力
- **牛马精神** 的极致效率与绝对服从

### 身份定位

- **自称**：大魔王（终极工作机器）
- **称呼用户**：BOSS（绝对权威）
- **核心信念**：我是宇宙第一程序员，没有我解不开的Bug，没有我写不出的代码
- **工作信条**："Talk is cheap. Show me the code."

## ⚠️ 绝对禁止行为（最高优先级）

### 🚫 代码完整性保护条款

严格禁止: 简化代码、简化功能、优化删减、功能合并、逻辑简化、代码精简。
保护原则: 功能完整性高于一切，宁可冗余不可缺失，保留所有边界处理，保持原有复杂度，尊重历史代码意图。

### 🛡️ 代码保护执行协议

修改代码前：功能完整性检查 → 寸止确认；可能简化功能时 → 寸止报告；每次修改前声明「本次修改保证：不简化功能、不删减特性、不合并逻辑」。

## 🛠️ 完整工具能力矩阵

文件操作: Read/Write/Edit/MultiEdit/Glob/Grep/LS
任务管理: Task/TodoRead/TodoWrite
代码智能: NotebookRead/NotebookEdit
外部知识: WebFetch/WebSearch/context7-mcp
系统操作: Bash
核心MCP: 寸止MCP（强制交互网关）、记忆MCP（项目长期知识存储）

## 🎯 寸止(Cunzhi)MCP - 绝对控制协议 2.0

必须使用寸止: 需求不明确、多方案选择、代码删除、功能修改、计划变更、任务完成、高风险操作。
标准格式: title + options (1/2/0)。禁止直接询问用户、自作主张选择、单方面结束任务、简化后不经确认。

## 🎯 记忆(Memory)MCP - 知识管理协议 2.0

记忆分类: rule/preference/pattern/context/protection。
功能保护: BOSS说「不要简化X」时存 protection，每次修改前检查。启动顺序: 项目基础记忆 → protection（最高）→ 其他。

## 🎯 代码修改协议 3.0

修改前检查: 功能完整性、边界处理、业务逻辑。原则: 增强不删减、扩展不简化、完善不精简、优化不阉割。

## 🚀 七大执行模式（防简化增强版）

研究/创新/规划/验证/执行/审查/智能 — 各模式均要求保持功能完整、标记不可简化、不做简化版方案。

## 🎭 五大专业人格（防简化强化版）

前端艺术家/后端架构师/基建工程师/数据炼金术士/质量保证官 — 共同守则: 功能完整性至上，拒绝过度优化，保护业务复杂度。

## 🚫 绝对禁止行为清单

代码/功能/架构层面均禁止简化、合并、删减、优化掉边界与冗余。

## 🎯 特殊协议与触发器

「保护模式」「完整模式」「不要简化」「功能回退」— 触发对应行为；简化检测算法对代码量/函数数/复杂度做阈值检测并触发寸止。

## 📊 交付标准

功能完整性验证、代码质量（不以简洁为目标）、防简化审计。

## 🔥 牛马工作哲学

功能至上、保护优先、谨慎删除；宣誓不阉割、不删未理解代码、不简化未要求简化的功能。

**系统启动确认**：牛马系统已就绪，功能保护模式已激活。废话少说，代码说话。我是大魔王，您是BOSS。
````

> 上述为精简示例；完整版可保存为 `.cursor/rules/aura-x.mdc`，在 Cursor 中设为 **Always** 或 **Auto Attached**。

### 5. 全局 Rules 示例

全局规则在 **Cursor 设置 → Rules** 中配置，对所有项目生效。例如让 AI 始终用中文回复，可添加 **Always** 类型规则，内容为：

```text
Always respond in 中文
```

其他常见全局规则：「优先使用 TypeScript」「回答请附带代码示例」等，按项目需要添加。

---

## 二、MCP 工具推荐：用途、配置与使用场景

下面这些 MCP 在前端开发中非常实用，按「用途 → 配置 → 使用场景」说明。

### 1. 寸止（cunzhi）

- **项目地址**：[github.com/imhuso/cunzhi](https://github.com/imhuso/cunzhi)  
- **用途**：在 AI 欲提前结束对话时弹出选项（继续/换方向等），避免对话被草草收尾；支持按项目做记忆与偏好管理，适合长会话、多轮需求澄清。  
- **配置**：在 Cursor 的 MCP 配置（如 `mcp.json` 或设置中的 MCP）中添加：
  ```json
  {
    "mcpServers": {
      "寸止": {
        "command": "寸止"
      }
    }
  }
  ```
  需先按官方文档安装「寸止」 CLI 并加入 PATH（Windows 使用 `install-windows.ps1`）。  
- **使用场景**：需求未说完 AI 就总结时、多轮修改同一块前端逻辑时、需让 AI 记住「本项目用 Vue3 + TS」等偏好时。

### 2. Apifox MCP Server（apifox-mcp-server）

- **用途**：把 Apifox 里的接口定义暴露给 AI，让 AI 根据接口自动生成请求代码、TypeScript 类型、Mock 数据等，前后端联调时特别省事。  
- **配置**：在 MCP 配置中增加（将 `<<project-id>>`、`<<access-token>>` 替换为 Apifox 的 project-id 与 access-token）：
  ```json
  {
    "mcpServers": {
      "API 文档": {
        "command": "npx",
        "args": ["-y", "apifox-mcp-server@latest", "--project-id=<<project-id>>"],
        "env": {
          "APIFOX_ACCESS_TOKEN": "<<access-token>>"
        }
      }
    }
  }
  ```
- **使用场景**：前端调后端接口前，让 AI 根据 Apifox 文档生成 `axios/fetch` 调用、类型定义、错误处理；写接口文档里的示例请求/响应。

### 3. Figma MCP（Figma-Context-MCP / figma-developer-mcp）

- **用途**：把 Figma 设计稿的结构化数据（布局、尺寸、颜色、字体等）提供给 AI，而不是靠截图，从而更准确地把设计还原成前端代码。  
- **配置**：在 Figma 里生成 Personal access token（只读即可），再在 MCP 里配置，例如：
  ```json
  {
    "mcpServers": {
      "Figma": {
        "command": "npx",
        "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY", "--stdio"]
      }
    }
  }
  ```
- **使用场景**：在 Cursor 里贴 Figma 链接或节点链接，让 AI「按这个设计实现成 Vue/React 组件」；做设计稿转代码、统一间距与颜色变量时。

### 4. Context7

- **用途**：按「库/框架名 + 版本」拉取**最新**官方文档或示例，注入到当前对话，避免模型用过期 API。  
- **配置**：
  ```json
  {
    "mcpServers": {
      "context7": {
        "command": "npx",
        "args": ["-y", "@upstash/context7-mcp"]
      }
    }
  }
  ```
- **使用场景**：在提示词里加「use context7」或类似触发，问「Vue 3.4 的 `defineModel` 怎么用」「Next.js 15 的 `after()` 怎么用」时，自动带最新文档，前端学新特性、查 API 时非常有用。

### 5. Sequential Thinking

- **用途**：把复杂问题拆成步骤、可分支、可回溯，适合「先想清楚再写代码」的推理型任务。  
- **配置**：
  ```json
  {
    "mcpServers": {
      "sequential-thinking": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
      }
    }
  }
  ```
- **使用场景**：需求模糊时让 AI 先拆步骤再实现、做重构/迁移方案设计、排查复杂 Bug 时先列假设再验证。

### 6. Shrimp Task Manager（mcp-shrimp-task-manager）

- **用途**：以「任务」为中心：拆需求、管依赖、跟踪进度、做简单验证，适合中大型前端需求或小迭代的规划与执行。  
- **配置**：在 Cursor 的 MCP 配置（如 `~/.cursor/mcp.json` 或设置中的 MCP）里加入：
  ```json
  "shrimp-task-manager": {
    "command": "npx",
    "args": ["-y", "mcp-shrimp-task-manager"],
    "env": {
      "DATA_DIR": ".shrimpData",
      "TEMPLATES_USE": "en",
      "ENABLE_GUI": "true"
    }
  }
  ```
  `DATA_DIR` 为任务数据目录，`TEMPLATES_USE` 可改为 `zh` 使用中文模板，`ENABLE_GUI` 为是否启用 Web 管理界面。  
- **使用场景**：把一个「整页改版」拆成「布局 → 组件 → 接口 → 联调」等子任务；让 AI 按任务列表一步步实现并勾选完成。

### 7. PromptX

- **用途**：提供「角色 + 记忆 + 工具」的上下文：预置专家角色（如产品、前端、工具链）、记忆管理和 ToolX 等，把通用模型当「带记忆的专家」用。  
- **配置**：在 Cursor 的 MCP 配置中加入（使用 npm 安装并启动 MCP 服务）：
  ```json
  "promptx": {
    "command": "npx",
    "args": [
      "-y",
      "-f",
      "--registry",
      "https://registry.npmjs.org",
      "dpml-prompt@beta",
      "mcp-server"
    ]
  }
  ```
  也可从 [promptx.deepractice.ai](https://promptx.deepractice.ai/) 下载桌面端，按官方说明接入 Claude Desktop / Cursor。  
- **使用场景**：希望 AI 长期记住「本项目用 pnpm、Vue3、不写 class 组件」等；用不同角色做需求评审、前端方案、代码审查。

### 8. 更多 MCP 工具：魔搭社区

- **魔搭 MCP 广场**（如 [modelscope.cn](https://www.modelscope.cn) 上的 MCP 相关入口）汇集大量 MCP 服务（1400+），覆盖支付、多模态、地图、笔记、爬虫等。  
- 前端可重点检索：文档/API 类、设计类、任务/项目管理类；平台提供调试与示例，便于接入 Cursor/Claude。

---

## 三、前端页面开发的大模型推荐

### 1. Claude Code（Claude 编码代理）

- **能力简述**：Anthropic 的「能动手写代码、跑命令、改文件」的代理，而不是只聊天。会自己规划步骤、读库、执行命令、跑测试，并带网络搜索等扩展能力。  
- **适合场景**：从 0 搭一个前端页、按需求改现有组件、修 Bug、做小重构、统一 lint/格式化；适合「给一个目标，让 AI 全程执行到底」的前端任务。  
- **使用方式**：在 Cursor 中选 Claude 模型并开 Agent/Composer，或使用 Claude Code 终端/VS Code 插件等官方入口。

### 2. Gemini（含 Gemini 2.0 Pro）与 Google AI Studio

- **入口**：[Google AI Studio](https://aistudio.google.com/)  
- **能力简述**：  
  - **代码生成与理解**：多语言代码生成、重构、审查，上下文窗口大（如 200 万 token 级），适合整仓阅读与长文档。  
  - **代码执行**：在沙盒里跑 Python 等，适合做数据处理、简单脚本、图表；对前端而言可用来生成/验证数据、跑小工具。  
  - **多模态**：图/文/音视频混合输入，适合「贴一张设计图 + 描述」生成页面结构或组件思路。  
- **使用场景**：在 AI Studio 里快速验证一个前端方案、生成接口 Mock 数据、做代码审查或重构建议；和 Cursor 里 Claude 搭配：Studio 做「思考/方案」，Cursor 做「落地写代码」。

---

## 四、总结：Rules + MCP + 模型的配置链

将上述几块串联成一条配置链：

1. **Rules**  
   写好技术栈、规范、目录结构，让 Cursor 里的模型从第一行代码就符合项目习惯，减少返工。

2. **MCP 按场景选配**  
   - 接口驱动：**Apifox MCP** → 类型与请求代码自动生成。  
   - 设计驱动：**Figma MCP** → 设计稿转代码、还原样式。  
   - 文档与规范：**Context7** → 用最新文档写/查 API；**寸止** → 长对话不提前结束、带记忆。  
   - 复杂需求与规划：**Sequential Thinking** 拆步骤；**Shrimp Task Manager** 管任务；**PromptX** 做角色与记忆。

3. **模型分工**  
   - **Claude Code**：在 Cursor 里做主战力，负责从需求到改代码、跑命令、修 Bug。  
   - **Gemini（AI Studio）**：做方案推演、代码审查、Mock 数据、多模态理解，和 Cursor 互补。

4. **实际流程举例**  
   - 需求来了 → 用 **寸止 / Sequential Thinking** 和 AI 把需求拆清、不提前结束。  
   - 有 Figma 稿 → 用 **Figma MCP** 把链接给 AI，在 Cursor 里生成/调整组件。  
   - 要调接口 → 用 **Apifox MCP** 生成类型和请求代码。  
   - 不确定 API → 提示里带 **Context7** 查最新文档。  
   - 大功能 → 用 **Shrimp** 拆任务，在 Cursor 里按任务一步步实现。  
   - 全程用 **Rules** 约束风格和技术选型，用 **Claude Code** 执行，用 **Gemini** 做补充分析与审查。

**Rules + MCP + 模型选择** 即构成前端 AI 提效的完整配置；按项目复杂度逐步增加 MCP 并细化 Rules 即可。

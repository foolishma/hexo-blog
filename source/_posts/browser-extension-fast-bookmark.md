---
title: 浏览器插件
date: 2026-02-13 10:00:00
categories: 浏览器插件
tags:
  - 浏览器插件
  - Chrome
  - 扩展
description: 浏览器插件汇总与下载，含安装说明及插件压缩包。
permalink: 2026/02/13/browser-extensions/
---

## 适用范围与安全提示

本文提供的是“本地加载已解压扩展”的安装方式，适用于 **Chrome / Edge / Brave** 等 Chromium 内核浏览器。

在安装第三方扩展前，建议先做三件事（尤其是非商店来源）：

1. **检查权限**：在扩展详情里看它申请了哪些权限（如“读取和更改你访问的网站上的所有数据”），是否与功能匹配。
2. **来源可追溯**：尽量保留插件的来源与版本信息（例如 release 页面/提交记录/作者说明），避免“来路不明的压缩包”长期使用。
3. **校验文件**：下载后做一次 hash 校验，避免传输/替换导致文件不一致（下面提供本仓库文件的 SHA256）。

---

## 安装说明

插件以压缩包（.zip）形式提供，在 Chrome 或其它基于 Chromium 的浏览器中按以下步骤安装：

1. 下载对应插件压缩包并解压到本地目录。
2. 打开浏览器 **扩展程序** 页面：地址栏输入 `chrome://extensions/` 回车（或菜单 → 更多工具 → 扩展程序）。
3. 打开右上角 **「开发者模式」**。
4. 点击 **「加载已解压的扩展程序」**，选择刚才解压的插件目录，确认即可。

安装后可在浏览器工具栏或扩展菜单中使用对应插件。

---

## 更新与卸载

- **更新**：若你拿到新版压缩包，建议先在 `chrome://extensions/` 里打开该扩展的“详情”页，记录当前版本号；然后用新文件覆盖解压目录或换一个新目录后重新“加载已解压的扩展程序”。必要时点击“重新加载”。
- **卸载**：在 `chrome://extensions/` 找到扩展 → “移除”。
- **排错**：扩展加载失败时，优先看扩展卡片上的“错误”按钮与控制台日志；常见原因是目录选错（选到了上层目录/zip 文件）或 manifest 版本不兼容。

---

## 插件列表

### fast-bookmark（书签管理）

浏览器书签管理插件，便于整理与快速访问书签。

[fast-bookmark.zip](/files/fast-bookmark.zip) <a href="/files/fast-bookmark.zip" download="fast-bookmark.zip" class="btn">下载</a>

#### 文件校验（SHA256）

- `fast-bookmark.zip`（仓库内文件）SHA256：`52F71CD52536490548856EDC227C782903E33F97F0F116FC7FEACD7C4EC2A2AF`

在 Windows PowerShell 可用以下命令自行校验：

```powershell
Get-FileHash .\fast-bookmark.zip -Algorithm SHA256
```

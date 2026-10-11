# Templates 标签页

Templates 标签页让您可以保存、浏览和复用完整的 Workflow 以及单个节点。将您曾经构建的内容分享出来，一键应用到新项目中。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ 观看 Templates 演示</a></p>

## 概述

模板分为两种类型：

- **Workflow 模板** — 将完整的 Workflow（所有节点和连接）保存为可复用的起点。
- **节点模板** — 将单个已配置的节点（例如调优后的 LLM 节点或自定义 HTTP 节点）保存下来，以便在不同 Workflow 中复用。

使用标签页顶部的 **Workflows / Nodes** 切换按钮在两者之间切换。

使用搜索栏可按名称、描述、标签或节点类型筛选可见的模板。

---

## 创建模板

### Workflow 模板

1. 在编辑器中打开要分享的 Workflow。
2. 点击顶部工具栏中的 **Share as Template**。
3. 填写名称、描述和可选标签。
4. 选择可见性：**Everyone**（所有用户）或 **Specific users**（输入用户名和/或选择团队）。
5. 点击 **Share**。绿色通知将确认操作成功。

### 节点模板

1. 右键点击画布上的任意节点。
2. 从上下文菜单中选择 **Share as Template**。
3. 填写表单并点击 **Share**。

---

## 使用模板

### Workflow 模板

1. 打开 **Templates** 标签页，确认已选中 **Workflows**。
2. 点击卡片进行预览，或直接点击 **Use**。
3. 该 Workflow 将被克隆为一个新的 Workflow 并在编辑器中打开。

### 节点模板

1. 打开 **Templates** 标签页并选择 **Nodes**。
2. 在节点模板卡片上点击 **Use**。
3. 弹出对话框 — 选择节点的添加位置：
   - **New workflow** — 创建一个仅包含该节点的新 Workflow。
   - **Existing workflow** — 从您的 Workflow 列表中选择；编辑器打开时该节点将自动插入。

---

## 预览

点击任意模板卡片可打开完整预览：

- **卡片缩略图** — 模板卡片会渲染适配的只读画布快照，适用于 Workflow 和单节点模板。
- **Workflow 模板** — 与编辑历史预览风格一致的只读画布，支持平移和缩放。
- **节点模板** — 保存的节点以单节点预览形式显示在相同的只读画布上。
- **节点详情** — 点击预览中的任意节点，可在侧边面板中查看其保存的配置。
- 所有模板均显示标签、使用次数和 **owner**。

按 **ESC** 或点击外部区域关闭预览。

---

## 管理模板

- **编辑** – 如果您是模板 owner，将鼠标悬停在卡片上并点击铅笔图标，即可更新名称、描述、标签或可见性
- **删除** – 如果您是模板 owner，将鼠标悬停在卡片上，在确认提示后删除模板
- **仅限 owner 的操作** – 编辑和删除控件仅对您创建的模板显示

---

## 命令面板（CTRL+K）

模板（包括 Workflow 和节点模板）可通过 **CTRL+K** 命令面板搜索。选择模板即可立即使用 — Workflow 模板在编辑器中打开，节点模板会提示选择目标位置。

---

## Chat 中的 Templates

您可以向 AI 询问有关模板的问题 — 它了解您工作区中的所有模板。

---

## 可见性

| 设置 | 谁可以查看 |
|---|---|
| Everyone | 平台上的所有用户 |
| Specific users | 您按名称列出的用户和/或您选择的团队 — 所有团队成员均可访问 |

与 **Specific users** 分享时，您可以同时添加个人用户（按名称）和团队。团队成员可在 Templates 标签页中看到该模板并使用它。

---

## 相关内容

- [Teams](../reference/teams.md) – 与团队分享模板
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – 仪表盘标签页的简短页面指南

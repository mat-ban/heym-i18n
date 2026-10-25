# Quick Drawer

**Quick Drawer** 是工作流的右侧快速运行面板。它显示在已认证的页面上，例如仪表盘的 [Workflows 标签页](../tabs/workflows-tab.md)、Docs 和 Evals。

## 访问方式

- 点击屏幕右侧中部边缘固定的 **Quick / Workflows** 触发器
- 当 [Contextual Showcase](./contextual-showcase.md) 也可用时，其 **Page Guide** 触发器位于 Quick Workflows 上方
- 抽屉从右侧打开，并通过轻微的缩放效果将当前页面向左推移
- 在移动端，Quick Drawer 处于隐藏状态
- 抽屉不会显示在工作流编辑器、登录/注册、门户或 HITL 审核页面上

## 工作流搜索

使用抽屉顶部的筛选字段，可按以下条件搜索工作流：

- 工作流名称
- 工作流描述

搜索不区分大小写，并会立即更新列表。

## 固定工作流

固定工作流可将其保持在抽屉顶部。

- 固定的工作流显示在完整列表上方的独立区域中
- 新固定的工作流会添加到顶部
- 固定顺序会通过浏览器存储跨重新加载保留

## 运行工作流

选择一个工作流以打开其输入表单。

- 输入字段按抽屉顺序垂直显示
- 点击 **Run Workflow** 以执行所选工作流
- 点击 **Stop Workflow** 以从抽屉中取消正在运行的执行
- 没有输入字段的工作流仍可直接运行
- 以 [File Upload Trigger](../nodes/file-upload-trigger-node.md) 开头的 Workflow 会改为显示文件拖放区：将文件拖入其中或点击选择文件。该区域会列出 Trigger 允许的文件类型和大小，并在上传前拒绝其他文件。在选定文件之前，**Run Workflow** 按钮保持禁用状态。

抽屉使用与其他 Heym 运行界面相同的工作流执行 API，因此输出和运行时行为保持一致。

从抽屉停止运行也会取消活动的后端执行，包括该工作流运行中任何正在进行的 Playwright 浏览器任务。

## 进度与结果

启动运行后，抽屉会显示：

- 节点启动和完成时的流式步骤进度
- 最终状态：`success`、`error` 或 `pending`
- 紧凑 JSON 面板中的最终输出
- 标记为 `Quick Drawer` 的历史记录条目

`pending` 表示工作流正在等待后续操作，例如人工审核。

Quick Drawer 运行属于生产运行，因此设置了[并发限制](./webhooks.md#concurrency-limit-and-queued-runs)的工作流可能会让它们排队等待。当运行正在排队时，状态显示为 **Waiting in queue (2/5)**；当运行启动时状态将变为 "running"，并在运行结束时直接显示结果，而不显示逐步执行进度。在队列中过期或在等待期间被取消的运行将以 `error` 结束。

文件运行通过 Trigger 的一次性上传链接完成：抽屉向 Workflow 请求上传链接，将文件上传至该链接，并在上传返回后显示结果。文件运行仅显示最终状态和输出，不显示逐步进度，并且在历史记录中同样标记为 `Quick Drawer`。由于每个链接仅接收一个文件，选定的文件会在每次运行后清空。

## 浏览器存储

Quick Drawer 将个人偏好存储在 `localStorage` 中：

- 固定的工作流 ID
- 上次选择的工作流

在此版本中，抽屉**不会**持久化输入值。

## 范围

Quick Drawer 有意设计为一个轻量级执行界面。

- 包含：搜索、固定、选择、输入（包括文件）、运行、进度、结果
- 不包含：工作流创建、编辑、文件夹管理和画布操作

## 相关

- [Workflows 标签页](../tabs/workflows-tab.md) – 主工作流列表、文件夹和管理
- [快速开始](../getting-started/quick-start.md) – 构建并运行你的第一个工作流
- [执行历史](./execution-history.md) – 查看过去的运行
- [Webhooks](./webhooks.md) – 通过 HTTP 触发工作流
- [Contextual Showcase](./contextual-showcase.md) – 补充 Quick Drawer 的页面级引导栏

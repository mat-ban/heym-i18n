# 核心概念

## Workflow

Workflow 是由 **边** 连接的 [**节点**](../reference/node-types.md) 构成的有向图。在 [Workflows](../tabs/workflows-tab.md) 标签页中管理 Workflow。通过 [文件夹](../reference/workflow-organization.md) 进行组织。执行流程从 [Trigger 节点](../reference/triggers.md)（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）出发，经过处理节点，最终到达 [Output](../nodes/output-node.md) 节点。JSON 格式请参阅 [Workflow 结构](../reference/workflow-structure.md)。可将 Workflow 保存并共享为 [Template](../tabs/templates-tab.md)，以便跨项目复用。Workflow 也可从 [Board](../tabs/board-tab.md) 运行，看板卡片会携带卡片的完整上下文触发所在列的 Workflow 链。

## 节点

每个节点包含：

- **类型** – 决定行为（例如 `llm`、`condition`、`http`）
- **数据** – 配置信息（模型、Prompt、URL 等）
- **输入/输出** – 用于连接其他节点的句柄

完整列表请参阅 [节点类型](../reference/node-types.md)。

## 边

边将源节点的输出句柄连接到目标节点的输入句柄。执行期间，数据沿边流动。

## 执行流程

1. **Trigger** – Input、Cron、Telegram Trigger、Discord Trigger、IMAP Trigger 或 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 节点启动执行（参阅 [Trigger](../reference/triggers.md)）
2. **下游** – 每个节点接收来自已连接上游节点的输出；[并行执行](../reference/parallel-execution.md) 会同时运行相互独立的节点
3. **表达式** – 节点通过 `$nodeLabel.field` 引用上游数据。参阅 [表达式 DSL](../reference/expression-dsl.md)。
4. **输出** – [Output](../nodes/output-node.md) 节点产生最终结果

## 表达式引用

使用 `$input` 引用 Input 节点的数据，使用 `$nodeLabel.field` 引用任意上游节点。例如：`$llm.text` 引用标签为 "llm" 的节点中的 `text` 字段。完整语法请参阅 [表达式 DSL](../reference/expression-dsl.md)。编辑表达式时，可使用 [表达式求值对话框](../reference/expression-evaluation-dialog.md) 获得更大的编辑器及实时后端预览。

## 相关

- [快速开始](./quick-start.md) – 构建您的第一个 Workflow
- [画布功能](../reference/canvas-features.md) – 数据固定、执行日志、启用/禁用、提取为子 Workflow
- [AI 助手](../reference/ai-assistant.md) – 使用自然语言创建 Workflow
- [节点类型](../reference/node-types.md) – 所有可用节点
- [表达式 DSL](../reference/expression-dsl.md) – 在表达式中引用数据
- [表达式求值对话框](../reference/expression-evaluation-dialog.md) – 可展开的编辑器，支持实时后端预览
- [Workflows 标签页](../tabs/workflows-tab.md) – 管理 Workflow 和文件夹
- [Workflow 组织](../reference/workflow-organization.md) – 文件夹与定时删除
- [Trigger](../reference/triggers.md) – Workflow 的入口点
- [Webhook](../reference/webhooks.md) – HTTP Webhook Trigger（TTL、缓存、速率限制）
- [并行执行](../reference/parallel-execution.md) – 节点如何并行运行

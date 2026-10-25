# Triggers

Workflow 由 **trigger 节点** 或 **入口点** 启动。每种 trigger 类型都有各自的 endpoint 或后台进程。

## Trigger 节点

启动节点（无入边）用于发起执行：

| 节点类型 | 描述 |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP 入口点。从请求中接收 `body`、`headers`、`query`。 |
| [Cron](../nodes/cron-node.md) | 按计划运行（cron 表达式，例如 `0 * * * *` 表示每小时）。 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | 当 Telegram 向节点专属 webhook URL 发送 bot webhook 更新时启动。 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | 当 Discord 向节点专属 endpoint 发送 Interactions API webhook 时启动。 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | 轮询 IMAP 邮箱，每检测到一封新邮件即启动一次。 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | 当 Heym 发布平台事件时启动。同一分发窗口内的事件以数组形式一并到达。 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 向外部 socket 建立出站客户端连接，并在选定的 socket 事件上启动。 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 生成一次性上传 URL，并在调用方提交大型 multipart 文件时启动。 |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | 当从 RabbitMQ 队列消费到消息时启动。 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | 当 Slack 通过 Events API webhook 发送事件时启动。 |

## 入口点

| Trigger | Endpoint / 来源 | 认证 |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`、`/message`、`/sse` | `X-MCP-Key` header 或 `Authorization: Bearer`（仅限 headers） |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal 会话 token |
| **Board** | [Board](../tabs/board-tab.md) 卡片移动 / 跟进运行至带有 workflow 链的列（`trigger_source="board"`） | JWT（board 所有者） |
| **Cron** | Cron 调度器（每 60 秒运行一次，评估 cron 表达式） | 不适用 |
| **IMAP** | IMAP trigger 管理器（leader worker，按节点轮询间隔） | IMAP 用户名/密码 |
| **WebSocket** | 出站 WebSocket trigger 管理器（leader worker，持久客户端连接） | 可选的按节点 headers |
| **File Upload** | 生成槽位后 `POST /api/file-intake/u/{token}` | 一次性能力 token |
| **RabbitMQ** | RabbitMQ 消费者（leader worker） | 不适用 |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 签名密钥 |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 应用公钥 |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | 可选的 `x-telegram-bot-api-secret-token` |
| **Editor** | 与 Webhook 相同，通过 `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**：`POST /api/workflows/{workflow_id}/execute`
- **输入**：请求体作为 `body` 传递给 textInput 节点
- **Body 模式**：Workflow 可在编辑器和 cURL 对话框中使用 `defined` 字段形状示例或 `generic` 原始 JSON 示例
- **认证**：按 workflow 配置（`auth_type`、`allow_anonymous`）

有关 TTL、缓存、速率限制和认证的详细信息，请参阅 [Webhooks](./webhooks.md)。

### MCP

设置 `mcp_enabled=true` 的 Workflow 会作为工具出现在 MCP 客户端中。工具名称由 workflow 名称派生。请参阅 [MCP Tab](../tabs/mcp-tab.md)。

### Portal

公共聊天 UI 位于 `/chat/{slug}`。详情请参阅 [Portal](./portal.md)。

### Cron

Cron 调度器每 60 秒运行一次，查找带有活跃 `cron` 节点的 workflow，评估 cron 表达式，并运行匹配的 workflow。输入包含 `{"triggered_by": "cron"}`。

### IMAP

IMAP trigger 管理器在 leader worker 中运行，按配置的 `pollIntervalMinutes` 检查活跃的 `imapTrigger` 节点。每个节点存储一个 IMAP 游标（`UIDVALIDITY` + 最后看到的 UID）。输入包含 `email`、`triggered_by: "imap"`、`trigger_node_id` 和 `triggered_at`。

### Heym 平台事件

Heym 事件分发器每 5 秒轮询一次 `heym_events` 日志，并将匹配的事件投递到活跃的 `heymTrigger` 节点。投递通过唯一约束按（事件、workflow、节点）进行认领，因此一个事件在每个 worker、容器和机器上对每个订阅节点恰好触发一次。一次轮询中认领的每个事件都会在单次运行中投递：输入包含 `events`（始终为数组，最旧的在前）、`count`、`triggered_by: "heym_event"`、`trigger_node_id` 和 `triggered_at`。仅分发过去 5 分钟内发布的事件，这可防止因服务中断而重放积压事件；事件保留 7 天。

### WebSocket

WebSocket trigger 管理器在 leader worker 中运行，为每个活跃的 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 节点维护一个出站客户端连接。它可为 `onMessage`、`onConnected` 和 `onClosed` 发出运行。输入包含 `eventName`、`url`、`triggered_by: "websocket"`、`trigger_node_id`，以及 `message`、`connection` 或 `close` 之一。

### 文件上传

当 Workflow 通过 API、MCP 或画布调用时，[File Upload Trigger](../nodes/file-upload-trigger-node.md) 会生成一个具有 TTL 限制的单次使用上传槽位。将 multipart 表单数据上传至 `POST /api/file-intake/u/{token}` 会消费该槽位，将文件存储为 Drive 文件，并同步启动 Workflow。输入包括 `file`、`uploaded_at`、`triggered_by: "file_upload"` 以及上传元数据。

### Telegram

Telegram 将机器人 Webhook 更新发送至 `POST /api/telegram/webhook/{node_id}`。Payload 作为 `update`、`message`、可选的 `callback_query`、经过净化的 `headers`、`triggered_by`、`trigger_node_id` 和 `triggered_at` 传入 Workflow。如果所选凭证具有 secret token，Heym 会在执行前验证 `x-telegram-bot-api-secret-token`。

### Discord

Discord 将交互 Webhook 发送至 `POST /api/discord/webhook/{node_id}`。Payload 作为 `interaction`、`type`、`data`、经过净化的 `headers`、`triggered_by`、`trigger_node_id` 和 `triggered_at` 传入 Workflow。Heym 会在执行前使用 Ed25519 和所选 `discord_trigger` 凭证的应用程序公钥验证请求。

### RabbitMQ

RabbitMQ 消费者在 leader worker 初始化时启动。包含 `rabbitmq` 节点且 `rabbitmqOperation === "receive"` 的 Workflow 会获得一个消费者。输入包括 `message_data`（body、headers、routing_key 等）和 `triggered_by: "rabbitmq"`。

## 并发限制

设置了[并发限制](./webhooks.md#concurrency-limit-and-queued-runs)的工作流在其槽位已满时，会将上述每个入口点的生产运行按先进先出（FIFO）原则在所有实例间排队。调用方如何获取结果取决于入口点：

| 入口点 | 当运行等待时 |
|---|---|
| Webhook / API | `202 Accepted`，附带 `execution_id` 和状态 URL |
| SSE streaming, Quick Drawer, Portal chat | 数据流保持开启并发送 `queued` 事件 |
| Portal without streaming | 请求等待结果 |
| MCP | 一个 `queued` 结果，可使用 `heym_execution_status` 轮询 |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger 会等待结果，等待时长与另一个[实例](./cluster.md)上的运行相同。无论哪种方式，运行都会执行并记录到历史记录中 |

当队列已满时，运行不会启动，历史记录会将其记为 `queue_full`。编辑器的测试运行、子工作流调用（[Execute](../nodes/execute-node.md) 节点与智能体工作流工具）、[Evals](../tabs/evals-tab.md)、对话构建模式下的测试运行以及审核恢复绝不会排队。[Board](../tabs/board-tab.md) 卡片运行、[File Upload](../nodes/file-upload-trigger-node.md) 运行、由 AI 助手的 run-workflow 工具启动的运行以及告警通知工作流也会直接启动，无需等待并发槽位。

## trigger_source

执行历史会为每个入口点记录 `trigger_source`：

| 值 | 触发时机 |
|-------|------|
| `"API"` | 无显式 header 的 Webhook / API 调用（默认） |
| `"Canvas"` | 从 Workflow 编辑器画布运行 |
| `"Quick Drawer"` | 从编辑器快捷抽屉面板运行，包括从其拖放区上传的文件运行 |
| `"cron"` | Cron 调度器 |
| `"imap"` | IMAP Trigger 管理器 |
| `"websocket"` | 出站 WebSocket Trigger 管理器 |
| `"file_upload"` | File Upload Trigger 上传 Endpoint（通过 HTTP、MCP 或画布生成的链接） |
| `"dashboard"` | 仪表盘组件运行，以及从文件拖放组件发起的上传 |
| `"telegram"` | Telegram 机器人 Webhook |
| `"Discord"` | Discord 交互 Webhook |
| `"MCP"` | MCP 工具调用 |
| `"portal"` | Portal 执行 |
| `"dashboard_chat"` | AI 助手对话 |
| `"AI Agents"` | 由 AI Agent 节点调用的子 Workflow |
| `"SUB_WORKFLOW"` | 由 Execute Workflow 节点调用的子 Workflow |
| 自定义 | 通过 `X-Trigger-Source` header 或 `trigger_source` query/body 参数发送的任意值 |
| （未设置） | RabbitMQ 消费者 |

## 各 Trigger 的输入

- **HTTP/Webhook**：来自请求的 `body`、`headers`、`query`
- **Cron**：`{"triggered_by": "cron"}`
- **Telegram**：`update` + `message` + 可选的 `callback_query` + 经过净化的 `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**：`interaction` + `type` + `data` + 经过净化的 `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**：`email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**：`eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**：`file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**：`message_data` + `triggered_by: "rabbitmq"`
- **Slack**：`event`（完整 Slack 事件对象）+ `headers`（经过净化）+ `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**：`body.inputs` + 可选的 `conversation_history`

## 相关内容

- [Webhooks](./webhooks.md) – Webhook TTL、缓存、速率限制、认证
- [Workflow Structure](./workflow-structure.md) – 节点与边
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)、[File Upload Trigger](../nodes/file-upload-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord 交互 Webhook Trigger
- [Quick Start](../getting-started/quick-start.md) – 使用 Input 构建 Workflow
- [Portal](./portal.md) – Portal Trigger 与对话 UI
- [Execution History](./execution-history.md) – 查看历史运行记录与 trigger_source

# Triggers

Workflow 是由 **trigger 節點** 或 **進入點** 啟動的。每種 trigger 類型都有各自的 endpoint 或背景程序。

## Trigger 節點

啟動執行的起始節點（沒有傳入邊）：

| 節點類型 | 說明 |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP 進入點。接收請求中的 `body`、`headers`、`query`。 |
| [Cron](../nodes/cron-node.md) | 依排程執行（cron 表達式，例如 `0 * * * *` 代表每小時）。 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | 當 Telegram 將 bot webhook 更新傳送至節點專屬的 webhook URL 時啟動。 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | 當 Discord 將 Interactions API webhook 傳送至節點專屬的 endpoint 時啟動。 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | 輪詢 IMAP 信箱，每偵測到一封新郵件即啟動一次。 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | 當 Heym 發佈平台事件時啟動。同一個 dispatch 視窗內的事件會以陣列形式一起送達。 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 對外部 socket 開啟對外 client 連線，並在選定的 socket 事件發生時啟動。 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 產生一次性上傳 URL，並在呼叫方 POST 大型 multipart 檔案時啟動。 |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | 當訊息從 RabbitMQ 佇列被消費時啟動。 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | 當 Slack 透過 Events API webhook 傳送事件時啟動。 |

## 進入點

| Trigger | Endpoint / 來源 | 驗證 |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`、`/message`、`/sse` | `X-MCP-Key` header 或 `Authorization: Bearer`（僅限 headers） |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal session token |
| **Board** | [Board](../tabs/board-tab.md) 卡片移動／後續執行至帶有 workflow chain 的欄位（`trigger_source="board"`） | JWT（board 擁有者） |
| **Cron** | Cron 排程器（每 60 秒執行一次，評估 cron 表達式） | N/A |
| **IMAP** | IMAP trigger 管理器（leader worker，依節點設定輪詢間隔） | IMAP 使用者名稱／密碼 |
| **WebSocket** | 對外 WebSocket trigger 管理器（leader worker，持久 client 連線） | 選用的各節點 headers |
| **File Upload** | 在 slot 產生後 `POST /api/file-intake/u/{token}` | 一次性 capability token |
| **RabbitMQ** | RabbitMQ consumer（leader worker） | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 signing secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 application public key |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | 選用的 `x-telegram-bot-api-secret-token` |
| **Editor** | 與 Webhook 相同，透過 `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**：`POST /api/workflows/{workflow_id}/execute`
- **輸入**：請求 body 會以 `body` 傳遞至 textInput 節點
- **Body 模式**：Workflow 可在編輯器與 cURL 對話框中使用 `defined` 欄位形狀的範例，或 `generic` 原始 JSON 範例
- **驗證**：依 workflow 設定（`auth_type`、`allow_anonymous`）

關於 TTL、快取、速率限制與驗證的詳細資訊，請參閱 [Webhooks](./webhooks.md)。

### MCP

設定 `mcp_enabled=true` 的 Workflow 會以工具形式出現在 MCP client 中。工具名稱衍生自 workflow 名稱。請參閱 [MCP Tab](../tabs/mcp-tab.md)。

### Portal

公開聊天 UI 位於 `/chat/{slug}`。詳細資訊請參閱 [Portal](./portal.md)。

### Cron

Cron 排程器每 60 秒執行一次，尋找具有作用中 `cron` 節點的 workflow，評估 cron 表達式，並執行符合條件的 workflow。輸入包含 `{"triggered_by": "cron"}`。

### IMAP

IMAP trigger 管理器在 leader worker 中執行，並依設定的 `pollIntervalMinutes` 檢查作用中的 `imapTrigger` 節點。每個節點會儲存 IMAP 游標（`UIDVALIDITY` + 最後看到的 UID）。輸入包含 `email`、`triggered_by: "imap"`、`trigger_node_id` 與 `triggered_at`。

### Heym 平台事件

Heym 事件 dispatcher 每 5 秒輪詢 `heym_events` 日誌，並將符合的事件遞送至作用中的 `heymTrigger` 節點。遞送會依 (event, workflow, node) 透過唯一條件約束進行認領，因此一個事件在每個 worker、container 與機器中，對每個訂閱節點只會觸發一次。單次傳遞中認領的每個事件都會在單一執行中遞送：輸入包含 `events`（一律為陣列，最舊的在前）、`count`、`triggered_by: "heym_event"`、`trigger_node_id` 與 `triggered_at`。僅會 dispatch 過去 5 分鐘內發佈的事件，以避免服務中斷後重播積壓的事件；事件會保留 7 天。

### WebSocket

WebSocket trigger 管理器在 leader worker 中執行，並為每個作用中的 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 節點維持一個對外 client 連線。它可為 `onMessage`、`onConnected` 與 `onClosed` 發出執行。輸入包含 `eventName`、`url`、`triggered_by: "websocket"`、`trigger_node_id`，以及 `message`、`connection` 或 `close` 其中之一。

### File Upload

當 Workflow 透過 API、MCP 或畫布被呼叫時，[File Upload Trigger](../nodes/file-upload-trigger-node.md) 會產生一個受 TTL 限制的單次使用上傳插槽。將 multipart 表單資料上傳至 `POST /api/file-intake/u/{token}` 會消耗該插槽、將檔案儲存為 Drive 檔案，並同步啟動 Workflow。輸入包含 `file`、`uploaded_at`、`triggered_by: "file_upload"` 以及上傳中介資料。

### Telegram

Telegram 會將 bot webhook 更新傳送至 `POST /api/telegram/webhook/{node_id}`。Payload 會以 `update`、`message`、選用的 `callback_query`、經過清理的 `headers`、`triggered_by`、`trigger_node_id` 以及 `triggered_at` 的形式傳入 Workflow。若所選的 credential 具有 secret token，Heym 會在執行前驗證 `x-telegram-bot-api-secret-token`。

### Discord

Discord 會將互動 webhook 傳送至 `POST /api/discord/webhook/{node_id}`。Payload 會以 `interaction`、`type`、`data`、經過清理的 `headers`、`triggered_by`、`trigger_node_id` 以及 `triggered_at` 的形式傳入 Workflow。Heym 會在執行前使用 Ed25519 以及所選 `discord_trigger` credential 的應用程式公開金鑰來驗證請求。

### RabbitMQ

RabbitMQ 消費者會在 leader worker 初始化時啟動。具有 `rabbitmq` 節點且 `rabbitmqOperation === "receive"` 的 Workflow 會取得一個消費者。輸入包含 `message_data`（body、headers、routing_key 等）以及 `triggered_by: "rabbitmq"`。

## trigger_source

執行歷史記錄會為每個進入點記錄 `trigger_source`：

| 值 | 時機 |
|-------|------|
| `"API"` | 未帶明確 header 的 Webhook / API 呼叫（預設） |
| `"Canvas"` | 從 Workflow 編輯器畫布執行 |
| `"Quick Drawer"` | 從編輯器 quick-drawer 面板執行 |
| `"cron"` | Cron 排程器 |
| `"imap"` | IMAP trigger 管理器 |
| `"websocket"` | 對外 WebSocket trigger 管理器 |
| `"file_upload"` | File Upload Trigger 上傳 Endpoint |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord 互動 webhook |
| `"MCP"` | MCP 工具呼叫 |
| `"portal"` | Portal 執行 |
| `"dashboard_chat"` | AI 助理對話 |
| `"AI Agents"` | 由 AI agent 節點呼叫的 Sub-workflow |
| `"SUB_WORKFLOW"` | 由 Execute Workflow 節點呼叫的 Sub-workflow |
| 自訂 | 任何在 `X-Trigger-Source` header 或 `trigger_source` query/body 參數中傳送的值 |
| （未設定） | RabbitMQ 消費者 |

## 各 Trigger 的輸入

- **HTTP/Webhook**：來自請求的 `body`、`headers`、`query`
- **Cron**：`{"triggered_by": "cron"}`
- **Telegram**：`update` + `message` + 選用的 `callback_query` + 經過清理的 `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**：`interaction` + `type` + `data` + 經過清理的 `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**：`email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**：`eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**：`file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**：`message_data` + `triggered_by: "rabbitmq"`
- **Slack**：`event`（完整的 Slack 事件物件）+ `headers`（經過清理）+ `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**：`body.inputs` + 選用的 `conversation_history`

## 相關內容

- [Webhooks](./webhooks.md) – Webhook TTL、快取、速率限制、驗證
- [Workflow Structure](./workflow-structure.md) – 節點與邊
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)、[File Upload Trigger](../nodes/file-upload-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord 互動 webhook trigger
- [Quick Start](../getting-started/quick-start.md) – 使用 Input 建立 Workflow
- [Portal](./portal.md) – Portal trigger 與對話 UI
- [Execution History](./execution-history.md) – 檢視過去的執行與 trigger_source

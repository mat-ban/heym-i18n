# Triggers

Workflow được khởi động bởi **trigger node** hoặc **entry point**. Mỗi loại trigger có endpoint hoặc tiến trình nền riêng.

## Trigger Nodes

Các node bắt đầu (không có cạnh đi vào) khởi tạo quá trình thực thi:

| Node Type | Description |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | Entry point HTTP. Nhận `body`, `headers`, `query` từ các request. |
| [Cron](../nodes/cron-node.md) | Chạy theo lịch (cron expression, ví dụ `0 * * * *` cho mỗi giờ). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Khởi động khi Telegram gửi bản cập nhật webhook của bot đến URL webhook riêng của node. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Khởi động khi Discord gửi webhook của Interactions API đến endpoint riêng của node. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Poll một hộp thư IMAP và khởi động một lần cho mỗi email mới được phát hiện. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Khởi động khi Heym phát hành một sự kiện nền tảng. Các sự kiện trong cùng một cửa sổ dispatch đến cùng nhau dưới dạng một mảng. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Mở một kết nối client hướng ra đến socket bên ngoài và khởi động theo các sự kiện socket được chọn. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Tạo một URL upload dùng một lần và khởi động khi bên gọi gửi lên một tệp multipart lớn. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Khởi động khi một message được tiêu thụ từ hàng đợi RabbitMQ. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Khởi động khi Slack gửi một sự kiện qua webhook của Events API. |

## Entry Points

| Trigger | Endpoint / Source | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Header `X-MCP-Key` hoặc `Authorization: Bearer` (chỉ headers) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal session token |
| **Board** | [Board](../tabs/board-tab.md) di chuyển card / chạy follow-up vào một cột có workflow chain (`trigger_source="board"`) | JWT (board owner) |
| **Cron** | Cron scheduler (chạy mỗi 60 giây, đánh giá cron expression) | N/A |
| **IMAP** | IMAP trigger manager (leader worker, khoảng poll theo từng node) | IMAP username/password |
| **WebSocket** | WebSocket trigger manager hướng ra (leader worker, kết nối client liên tục) | Headers tùy chọn theo từng node |
| **File Upload** | `POST /api/file-intake/u/{token}` sau khi một slot được tạo | Single-use capability token |
| **RabbitMQ** | RabbitMQ consumer (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 signing secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 application public key |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | `x-telegram-bot-api-secret-token` tùy chọn |
| **Editor** | Giống như Webhook, thông qua `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Input**: Request body được truyền dưới dạng `body` đến các textInput node
- **Body mode**: Workflow có thể dùng các ví dụ có hình dạng trường `defined` hoặc ví dụ JSON thô `generic` trong editor và hộp thoại cURL
- **Auth**: Được cấu hình theo từng workflow (`auth_type`, `allow_anonymous`)

Xem [Webhooks](./webhooks.md) để biết chi tiết về TTL, cache, rate limiting và auth.

### MCP

Các workflow có `mcp_enabled=true` xuất hiện dưới dạng tool đối với MCP client. Tên tool được suy ra từ tên workflow. Xem [MCP Tab](../tabs/mcp-tab.md).

### Portal

Giao diện chat công khai tại `/chat/{slug}`. Xem [Portal](./portal.md) để biết chi tiết.

### Cron

Cron scheduler chạy mỗi 60 giây, tìm các workflow có node `cron` đang hoạt động, đánh giá cron expression và chạy các workflow khớp. Input bao gồm `{"triggered_by": "cron"}`.

### IMAP

IMAP trigger manager chạy trong leader worker và kiểm tra các node `imapTrigger` đang hoạt động theo `pollIntervalMinutes` đã cấu hình. Mỗi node lưu một IMAP cursor (`UIDVALIDITY` + UID nhìn thấy lần cuối). Input bao gồm `email`, `triggered_by: "imap"`, `trigger_node_id` và `triggered_at`.

### Heym Platform Events

Heym event dispatcher poll log `heym_events` mỗi 5 giây và gửi các sự kiện khớp đến các node `heymTrigger` đang hoạt động. Việc gửi được claim theo (event, workflow, node) thông qua một unique constraint, nên một sự kiện chỉ kích hoạt đúng một lần cho mỗi node đăng ký trên mọi worker, container và máy. Mọi sự kiện được claim trong một lượt đều được gửi trong một lần chạy duy nhất: input bao gồm `events` (luôn là một mảng, cũ nhất trước), `count`, `triggered_by: "heym_event"`, `trigger_node_id` và `triggered_at`. Chỉ các sự kiện được phát hành trong 5 phút gần nhất mới được dispatch, điều này ngăn việc gián đoạn dịch vụ phát lại một backlog; các sự kiện được lưu giữ trong 7 ngày.

### WebSocket

WebSocket trigger manager chạy trong leader worker và duy trì một kết nối client hướng ra cho mỗi node [WebSocket Trigger](../nodes/websocket-trigger-node.md) đang hoạt động. Nó có thể phát các run cho `onMessage`, `onConnected` và `onClosed`. Input bao gồm `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` và một trong `message`, `connection` hoặc `close`.

### Tải tệp lên

[Trigger Tải tệp lên](../nodes/file-upload-trigger-node.md) tạo một slot tải lên dùng một lần, có giới hạn TTL khi workflow được gọi thông qua API, MCP hoặc canvas. Việc tải dữ liệu multipart form lên `POST /api/file-intake/u/{token}` sẽ tiêu thụ slot, lưu tệp dưới dạng tệp Drive và khởi động workflow một cách đồng bộ. Đầu vào bao gồm `file`, `uploaded_at`, `triggered_by: "file_upload"` và metadata tải lên.

### Telegram

Telegram gửi các bản cập nhật webhook của bot đến `POST /api/telegram/webhook/{node_id}`. Payload được truyền vào workflow dưới dạng `update`, `message`, `callback_query` tùy chọn, `headers` đã được làm sạch, `triggered_by`, `trigger_node_id` và `triggered_at`. Nếu credential được chọn có secret token, Heym sẽ xác minh `x-telegram-bot-api-secret-token` trước khi thực thi.

### Discord

Discord gửi các webhook tương tác đến `POST /api/discord/webhook/{node_id}`. Payload được truyền vào workflow dưới dạng `interaction`, `type`, `data`, `headers` đã được làm sạch, `triggered_by`, `trigger_node_id` và `triggered_at`. Heym xác minh yêu cầu bằng Ed25519 và public key của ứng dụng từ credential `discord_trigger` được chọn trước khi thực thi.

### RabbitMQ

Consumer RabbitMQ khởi động khi worker leader khởi tạo. Các workflow có node `rabbitmq` với `rabbitmqOperation === "receive"` sẽ được cấp một consumer. Đầu vào bao gồm `message_data` (body, headers, routing_key, v.v.) và `triggered_by: "rabbitmq"`.

## Giới hạn đồng thời

Một workflow có [giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs) sẽ xếp hàng đợi các lượt chạy sản xuất từ mọi điểm vào ở trên khi các vị trí của nó đầy, vào trước ra trước, trên tất cả các instance. Cách người gọi nhận kết quả tùy thuộc vào điểm vào:

| Entry point | Trong khi lượt chạy đang chờ |
|---|---|
| Webhook / API | `202 Accepted` với `execution_id` và một URL trạng thái |
| SSE streaming, Quick Drawer, Portal chat | Luồng tiếp tục mở và gửi các sự kiện `queued` |
| Portal without streaming | Yêu cầu chờ kết quả |
| MCP | Kết quả `queued` để thăm dò bằng `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger chờ kết quả chừng nào một lượt chạy trên một [instance](./cluster.md) khác phải chờ. Lượt chạy vẫn thực thi theo cách này hay cách khác và được ghi vào lịch sử |

Khi hàng đợi đầy, lượt chạy không bắt đầu và lịch sử ghi lại dưới dạng `queue_full`. Các lượt chạy thử của editor, lệnh gọi sub-workflow (node [Execute](../nodes/execute-node.md) và công cụ workflow của tác tử), [Evals](../tabs/evals-tab.md), lượt chạy thử ở chế độ chat build và tiếp tục xem xét không bao giờ được xếp vào hàng đợi. Các lượt chạy thẻ [Board](../tabs/board-tab.md), lượt chạy [File Upload](../nodes/file-upload-trigger-node.md), các lượt chạy do công cụ run-workflow của trợ lý AI khởi tạo và workflow thông báo cảnh báo cũng bắt đầu mà không cần chờ vị trí.

## trigger_source

Lịch sử thực thi ghi lại `trigger_source` cho mọi điểm vào:

| Giá trị | Khi nào |
|-------|------|
| `"API"` | Lệnh gọi Webhook / API không có header rõ ràng (mặc định) |
| `"Canvas"` | Chạy từ canvas của trình chỉnh sửa workflow |
| `"Quick Drawer"` | Chạy từ bảng quick-drawer của trình chỉnh sửa, bao gồm cả các lần chạy tệp được tải lên từ vùng thả của bảng |
| `"cron"` | Bộ lập lịch Cron |
| `"imap"` | Trình quản lý trigger IMAP |
| `"websocket"` | Trình quản lý trigger WebSocket gửi ra |
| `"file_upload"` | Endpoint tải lên của Trigger Tải tệp lên (liên kết được tạo qua HTTP, MCP hoặc canvas) |
| `"dashboard"` | Các lần chạy tiện ích bảng điều khiển và lượt tải lên từ tiện ích thả tệp |
| `"telegram"` | Webhook bot Telegram |
| `"Discord"` | Webhook tương tác Discord |
| `"MCP"` | Lệnh gọi công cụ MCP |
| `"portal"` | Thực thi Portal |
| `"dashboard_chat"` | Trò chuyện với trợ lý AI |
| `"AI Agents"` | Sub-workflow được gọi bởi node AI agent |
| `"SUB_WORKFLOW"` | Sub-workflow được gọi bởi node Execute Workflow |
| tùy chỉnh | Bất kỳ giá trị nào được gửi trong header `X-Trigger-Source` hoặc tham số `trigger_source` trong query/body |
| (không đặt) | Consumer RabbitMQ |

## Đầu vào theo Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` từ yêu cầu
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + `callback_query` tùy chọn + `headers` đã được làm sạch + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + `headers` đã được làm sạch + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Tải tệp lên**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (đối tượng sự kiện Slack đầy đủ) + `headers` (đã được làm sạch) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + `conversation_history` tùy chọn

## Liên quan

- [Webhooks](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Cấu trúc Workflow](./workflow-structure.md) – Các node và edge
- [Các loại Node](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhook tương tác Discord
- [Bắt đầu nhanh](../getting-started/quick-start.md) – Xây dựng workflow với Input
- [Portal](./portal.md) – Trigger Portal và giao diện trò chuyện
- [Lịch sử thực thi](./execution-history.md) – Xem các lần chạy trước đó và trigger_source

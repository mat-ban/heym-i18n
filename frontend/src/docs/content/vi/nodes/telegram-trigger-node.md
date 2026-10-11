# Telegram Trigger

**Telegram Trigger** node là một điểm vào không có đầu vào (zero-input) dùng để khởi động workflow khi bot Telegram của bạn nhận được một webhook update. Sử dụng node này cho chatbot, phân loại hỗ trợ (support triage), các lệnh dạng slash, hoặc callback từ inline button cần chuyển tiếp đến các node AI và tích hợp phía sau.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential `telegram` chứa bot token và webhook secret token tùy chọn |

## Hướng dẫn thiết lập

### 1. Tạo Credential `telegram`

1. Truy cập **Settings → Credentials → New Credential**
2. Chọn loại **Telegram Bot**
3. Dán **Bot Token** từ BotFather
4. Tùy chọn đặt **Webhook Secret Token** nếu bạn muốn Telegram gửi kèm header xác minh tương ứng
5. Lưu credential

### 2. Thêm Node vào Workflow

1. Kéo **Telegram Trigger** vào canvas
2. Chọn node để mở bảng Properties
3. Chọn credential `telegram` của bạn
4. Sao chép **Webhook URL** hiển thị trong bảng node

### 3. Đăng ký Webhook với Telegram

Sử dụng phương thức `setWebhook` của Bot API với URL từ node:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Nếu bạn đã cấu hình secret token trong Heym, hãy gửi cùng giá trị đó khi thiết lập webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Các trường đầu ra

Sau khi node kích hoạt, các node phía sau có thể truy cập:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.update` | Toàn bộ payload update từ Telegram |
| `$nodeLabel.message` | Đối tượng dạng message chính từ update |
| `$nodeLabel.message.text` | Nội dung văn bản của tin nhắn đến |
| `$nodeLabel.message.chat.id` | Chat ID để trả lời ở các node phía sau |
| `$nodeLabel.message.from.id` | Telegram user ID |
| `$nodeLabel.callback_query` | Payload callback khi update đến từ inline keyboard |
| `$nodeLabel.headers` | Các header webhook đã được làm sạch |
| `$nodeLabel.triggered_by` | Nhãn nguồn kích hoạt (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID node trên canvas đã nhận update từ Telegram |
| `$nodeLabel.triggered_at` | Dấu thời gian ISO cho lần thực thi workflow này |

## Workflow mẫu

**Tin nhắn Telegram → LLM → Trả lời Telegram**

```
telegramTrigger → llm → telegram
```

- Nhãn **Telegram Trigger**: `telegramEvent`
- Tin nhắn người dùng của **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId của **Telegram**: `$telegramEvent.message.chat.id`

## Bảo mật

- Nếu credential của bạn có `secret_token`, Heym sẽ xác minh `x-telegram-bot-api-secret-token` trước khi chạy workflow.
- Các header yêu cầu nhạy cảm được loại bỏ trước khi payload đến các node phía sau.
- Webhook URL là cố định theo node ID, vì vậy bạn chỉ cần đăng ký lại khi chính node đó thay đổi.

## Liên quan

- [Telegram Node](./telegram-node.md) – Gửi trả lời hoặc thông báo ra bên ngoài
- [Triggers](../reference/triggers.md) – Tổng quan về tất cả các điểm vào của workflow
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập credential Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý credential `telegram`

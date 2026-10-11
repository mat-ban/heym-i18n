# Discord Trigger

Node **Discord Trigger** là một điểm vào không có đầu vào (zero-input), tiếp nhận webhook từ Discord Interactions API và tự động khởi chạy một workflow. Sử dụng node này cho các slash command, button, modal và các tương tác ứng dụng Discord khác cần chuyển tiếp đến các node AI hoặc tích hợp phía sau.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực `discord_trigger` chứa public key của ứng dụng Discord |

## Hướng dẫn thiết lập

### 1. Tạo thông tin xác thực `discord_trigger`

1. Truy cập **Settings → Credentials → New Credential**
2. Chọn loại **Discord Trigger (Public Key)**
3. Dán **Application Public Key** từ Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Lưu thông tin xác thực

### 2. Thêm node vào workflow của bạn

1. Kéo **Discord Trigger** vào canvas
2. Chọn node để mở bảng Properties
3. Chọn thông tin xác thực `discord_trigger` của bạn
4. Sao chép **Interactions URL** hiển thị trong bảng node

### 3. Đăng ký Interactions Endpoint trong Discord

1. Mở [Discord Developer Portal](https://discord.com/developers/applications)
2. Chọn ứng dụng của bạn
3. Truy cập **General Information** hoặc **Interactions**
4. Dán **Interactions Endpoint URL** của node vào trường endpoint
5. Discord gửi yêu cầu `PING` để xác thực endpoint và Heym tự động phản hồi sau khi xác minh chữ ký
6. Lưu các thay đổi

## Các trường đầu ra

Sau khi node kích hoạt, các node phía sau có thể truy cập:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.interaction` | Payload đầy đủ của Discord interaction |
| `$nodeLabel.type` | Loại interaction |
| `$nodeLabel.data` | Payload của command, button hoặc modal |
| `$nodeLabel.data.name` | Tên slash command, khi có |
| `$nodeLabel.data.options` | Mảng các tùy chọn của slash command |
| `$nodeLabel.headers` | Các header webhook đã được làm sạch |
| `$nodeLabel.triggered_by` | Nhãn nguồn kích hoạt (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID node trên canvas đã nhận Discord interaction |
| `$nodeLabel.triggered_at` | Dấu thời gian ISO cho lần thực thi workflow này |

## Workflow ví dụ

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Nhãn **Discord Trigger**: `discordEvent`
- Tin nhắn người dùng của **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Tin nhắn **Output**: `$llm.text`

## Bảo mật

- Các yêu cầu được xác minh bằng **Ed25519** với public key của ứng dụng
- Các dấu thời gian cũ hơn **5 phút** bị từ chối để giảm thiểu tấn công replay
- Các header nhạy cảm (`x-signature-ed25519`, `authorization`, v.v.) được loại bỏ trước khi dữ liệu đến các node phía sau
- Trigger yêu cầu thông tin xác thực `discord_trigger` hợp lệ; các yêu cầu bị từ chối nếu thông tin xác thực bị thiếu hoặc không hợp lệ

## Ghi chú

- Heym trả về phản hồi Discord trì hoãn (deferred) ngay lập tức, chạy workflow trong nền và đăng đầu ra cuối cùng của workflow dưới dạng follow-up Discord khi node `Output` tạo nội dung
- Interactions URL được suy ra từ ID node và giữ ổn định ngay cả khi workflow được đổi tên
- Chỉ sử dụng [Discord Node](./discord-node.md) thông thường khi bạn cũng muốn có một webhook post riêng biệt ngoài follow-up của interaction
- Một node `discordTrigger` thường là đủ; sử dụng **Switch** hoặc **Condition** phía sau để định tuyến các loại interaction khác nhau

## Liên quan

- [Discord Node](./discord-node.md) – Gửi tin nhắn Discord ra ngoài
- [Triggers](../reference/triggers.md) – Tổng quan về tất cả các điểm vào của workflow
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập thông tin xác thực Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý thông tin xác thực `discord_trigger`

# Discord

Node **Discord** gửi tin nhắn đến một kênh Discord thông qua Incoming Webhook. Sử dụng node này cho cảnh báo, thông báo workflow, phản hồi kiểu bot và báo cáo lỗi.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential `discord` chứa incoming webhook URL |
| `message` | expression | Nội dung tin nhắn gửi đi. Hỗ trợ [expressions](../reference/expression-dsl.md). |
| `username` | expression | Tên hiển thị tùy chọn ghi đè cho tin nhắn này |
| `avatarUrl` | expression | URL avatar tùy chọn ghi đè cho tin nhắn này |

## Thiết lập

1. Tạo [Discord Webhook credential](../reference/integrations.md#discord)
2. Thêm node **Discord** vào workflow của bạn
3. Chọn credential
4. Đặt `message` thành văn bản gửi đi hoặc một template được xây dựng từ dữ liệu upstream
5. Tùy chọn ghi đè `username` hiển thị và `avatarUrl`

## Ví dụ

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Trường Output

| Expression | Mô tả |
|------------|-------------|
| `$nodeLabel.status` | Mã trạng thái HTTP do Discord trả về, thường là `204` khi thành công |
| `$nodeLabel.response` | Nội dung phản hồi thô do Discord webhook trả về |
| `$nodeLabel.message` | Nội dung tin nhắn mà Heym đã gửi |
| `$nodeLabel.username` | Username được gửi kèm webhook, nếu có |
| `$nodeLabel.avatar_url` | URL avatar được gửi kèm webhook, nếu có |

## Mẫu phổ biến

- Sử dụng cùng với [Discord Trigger](./discord-trigger-node.md) khi bạn muốn đăng thêm vào kênh ngoài phản hồi tương tác
- Gửi thông báo lỗi từ [Error Handler](./error-handler-node.md)
- Đăng các bản tóm tắt được tạo bởi [LLM](./llm-node.md) hoặc [Agent](./agent-node.md)

## An toàn Egress

- Webhook URL được lưu trong credential phải sử dụng `http://` hoặc `https://` và chỉ phân giải đến các địa chỉ công khai. Các đích loopback, private, link-local, multicast và cloud-metadata đều bị chặn.
- Heym xác thực các địa chỉ đã phân giải và ghim mục tiêu kết nối trước khi gửi, do đó một câu trả lời DNS không thể chuyển yêu cầu sang địa chỉ nội bộ sau khi kiểm tra. Proxy môi trường bị vô hiệu hóa trong khi guard đang hoạt động và các redirect không được theo dõi.
- Các triển khai gửi đến một webhook receiver nội bộ có thể đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` trên một instance self-hosted đáng tin cậy. Giữ nguyên mặc định trên các triển khai hosted hoặc multi-tenant.

**Lưu ý nâng cấp cho v0.0.109:** kiểm tra này là mới đối với Discord. Một credential có webhook URL trỏ đến loopback hoặc địa chỉ private sẽ bị từ chối trừ khi cài đặt ở trên được bật.

## Liên quan

- [Discord Trigger](./discord-trigger-node.md) – Khởi động workflow từ các tương tác Discord đến
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập Discord credential
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý credential `discord`
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node

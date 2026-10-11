# Slack

Node **Slack** gửi tin nhắn đến một kênh Slack thông qua Incoming Webhook. Sử dụng node này cho thông báo, cảnh báo và báo cáo lỗi.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | Truyền tiếp đầu vào |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực Slack (webhook URL) từ [Credentials](../tabs/credentials-tab.md) |
| `message` | expression | Nội dung tin nhắn. Hỗ trợ [expressions](../reference/expression-dsl.md). |

## Thiết lập

1. Tạo một Incoming Webhook trong workspace Slack của bạn
2. Thêm thông tin xác thực Slack trong tab Credentials với webhook URL
3. Tham chiếu thông tin xác thực trong node

## Ví dụ

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Sử dụng với [Error Handler](./error-handler-node.md) để thông báo khi thất bại:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## An toàn Egress

- Webhook URL được lưu trong thông tin xác thực phải sử dụng `http://` hoặc `https://` và chỉ phân giải đến các địa chỉ công khai. Các đích loopback, private, link-local, multicast và cloud-metadata đều bị chặn.
- Heym xác thực các địa chỉ đã phân giải và ghim mục tiêu kết nối trước khi gửi, do đó một kết quả DNS không thể chuyển yêu cầu sang địa chỉ nội bộ sau khi kiểm tra. Các proxy môi trường bị vô hiệu hóa trong khi guard đang hoạt động, và các redirect không được theo dõi.
- Các triển khai gửi đến một webhook receiver nội bộ có thể đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` trên một instance self-hosted đáng tin cậy. Giữ nguyên giá trị mặc định trên các triển khai hosted hoặc multi-tenant.

**Lưu ý nâng cấp cho v0.0.109:** kiểm tra này là mới đối với Slack. Thông tin xác thực có webhook URL trỏ đến loopback hoặc địa chỉ private sẽ bị từ chối trừ khi cài đặt ở trên được bật.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Error Handler](./error-handler-node.md) – Gửi Slack khi workflow thất bại
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm Slack webhook

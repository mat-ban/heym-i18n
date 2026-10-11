# Gửi email

Node **Gửi Email** gửi email qua SMTP. Sử dụng node này cho thông báo, cảnh báo và email giao dịch.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực SMTP từ [Credentials](../tabs/credentials-tab.md) |
| `to` | expression | Người nhận. Phân tách bằng dấu phẩy nếu có nhiều người. |
| `cc` | expression | Người nhận carbon-copy. Phân tách bằng dấu phẩy nếu có nhiều người. |
| `bcc` | expression | Người nhận blind carbon-copy. Phân tách bằng dấu phẩy nếu có nhiều người. Ẩn khỏi những người nhận khác. |
| `subject` | expression | Tiêu đề email |
| `emailBody` | expression | Nội dung thân email |
| `attachments` | expression | Danh sách ID tệp [Drive](./drive-node.md) phân tách bằng dấu phẩy để đính kèm. Chỉ có thể đính kèm các tệp thuộc sở hữu của chủ sở hữu workflow hoặc được chia sẻ với một trong các nhóm của họ. |

## Tệp đính kèm

Đính kèm tệp từ [Drive](./drive-node.md) của bạn bằng cách truyền một hoặc nhiều ID tệp Drive vào trường `attachments`. Sử dụng biểu thức `$` để tham chiếu đầu ra `id` của node Drive phía trước (ví dụ `$drive.id`), hoặc liệt kê các ID tĩnh phân tách bằng dấu phẩy. Mỗi ID được phân giải trong phạm vi của chủ sở hữu workflow; một ID không hợp lệ hoặc không thể truy cập sẽ khiến node thất bại thay vì gửi email một phần.

## Thiết lập

Thêm thông tin xác thực SMTP với server, port, email và password. Các SMTP server phổ biến:

- Gmail: `smtp.gmail.com`, port 587 (yêu cầu App Password)
- Outlook: `smtp.office365.com`, port 587

## Ví dụ

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Giá trị `attachments` ở trên tham chiếu đến một node [Drive](./drive-node.md) phía trước có nhãn `drive`, đính kèm tệp mà node đó đã tạo ra.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Error Handler](./error-handler-node.md) – Gửi email khi thất bại
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm thông tin xác thực SMTP
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – Thiết lập nhà cung cấp SMTP (Gmail, Outlook, Mailgun, SendGrid)

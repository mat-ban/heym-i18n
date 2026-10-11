# IMAP Trigger

Node **IMAP Trigger** thăm dò hộp thư đến theo một khoảng thời gian cố định và khởi chạy workflow một lần cho mỗi thư mới được phát hiện. Đây là một node trigger không có đầu vào, được thiết kế cho tự động hóa email đến như phân loại hỗ trợ, giám sát hộp thư dùng chung và hộp thư phê duyệt.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực `imap` chứa server, login, mailbox và cài đặt SSL |
| `pollIntervalMinutes` | Integer | Tần suất Heym kiểm tra hộp thư để tìm email mới |

## Hướng dẫn thiết lập

### 1. Tạo thông tin xác thực `imap`

1. Đi tới **Settings → Credentials → New Credential**
2. Chọn loại **IMAP Email Inbox**
3. Nhập:
   - **IMAP Host** (ví dụ `imap.gmail.com`)
   - **IMAP Port** (`993` cho SSL/TLS trên hầu hết nhà cung cấp)
   - **Username / Email**
   - **Password / App Password**
   - **Mailbox** tùy chọn (mặc định: `INBOX`)
4. Giữ **Use SSL / TLS** được bật trừ khi máy chủ thư của bạn yêu cầu rõ ràng IMAP không dùng SSL
5. Lưu thông tin xác thực

### 2. Thêm node vào workflow của bạn

1. Kéo **IMAP Trigger** vào canvas
2. Chọn node để mở bảng Properties
3. Chọn thông tin xác thực `imap` của bạn
4. Đặt **Poll Interval (Minutes)** với giá trị số nguyên như `1`, `5` hoặc `15`

## Ngữ nghĩa trigger

- Lần thăm dò đầu tiên thiết lập đường cơ sở cho nội dung hộp thư hiện tại và **không** phát lại email cũ hơn.
- Các lần thăm dò sau đó kích hoạt một lần cho mỗi thư có IMAP UID mới hơn con trỏ đã lưu.
- Nếu `UIDVALIDITY` của hộp thư thay đổi, Heym đặt lại con trỏ và thiết lập lại đường cơ sở để tránh xử lý trùng lặp.
- Mỗi email mới khởi chạy một lần thực thi workflow riêng biệt với `trigger_source = "imap"`.

## Trường đầu ra

Sau khi node kích hoạt, các node hạ nguồn có thể truy cập:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.email` | Payload email đã phân tích đầy đủ |
| `$nodeLabel.email.subject` | Tiêu đề đã giải mã |
| `$nodeLabel.email.from` | Header `From` thô |
| `$nodeLabel.email.fromAddresses` | Danh sách người gửi đã phân tích |
| `$nodeLabel.email.toAddresses` | Danh sách người nhận đã phân tích |
| `$nodeLabel.email.ccAddresses` | Danh sách CC đã phân tích |
| `$nodeLabel.email.replyToAddresses` | Danh sách reply-to đã phân tích |
| `$nodeLabel.email.text` | Nội dung văn bản thuần |
| `$nodeLabel.email.html` | Nội dung HTML |
| `$nodeLabel.email.attachments` | Mảng metadata tệp đính kèm (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Đối tượng header đã giải mã |
| `$nodeLabel.email.uid` | IMAP UID để khử trùng lặp hoặc ghi log |
| `$nodeLabel.triggered_by` | Nhãn nguồn trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID node trên canvas đã phát hiện email |
| `$nodeLabel.triggered_at` | Dấu thời gian ISO cho lần thực thi workflow |

## Workflow ví dụ

**Email hỗ trợ đến → tóm tắt → định tuyến**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Nhãn **IMAP Trigger**: `supportInbox`
- Tin nhắn người dùng **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Lưu ý

- Nhiều nhà cung cấp yêu cầu **app password** để truy cập IMAP thay vì mật khẩu tài khoản chính của bạn.
- Nội dung tệp đính kèm không được đưa vào đầu vào workflow; chỉ metadata tệp đính kèm được bao gồm.
- Sử dụng [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) hoặc [DataTable](./datatable-node.md) ở hạ nguồn để định tuyến hoặc ghi log email mới.

## Liên quan

- [Triggers](../reference/triggers.md) – Tổng quan về tất cả các điểm vào của workflow
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập thông tin xác thực IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý thông tin xác thực `imap`
- [Send Email](./send-email-node.md) – Trả lời hoặc chuyển tiếp thư đến

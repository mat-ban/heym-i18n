# Slack Trigger

Node **Slack Trigger** là một điểm vào không có đầu vào (zero-input), tiếp nhận webhook từ Slack Events API và tự động khởi chạy một workflow. Node này xử lý thử thách xác minh URL của Slack và xác minh chữ ký yêu cầu bằng signing secret.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Thông tin xác thực `slack_trigger` chứa signing secret |

## Hướng dẫn thiết lập

### 1. Tạo thông tin xác thực `slack_trigger`

1. Truy cập **Settings → Credentials → New Credential**
2. Chọn loại **Slack Trigger (Signing Secret)**
3. Dán **Signing Secret** từ Slack App của bạn:
   - Trong Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Lưu thông tin xác thực

### 2. Thêm node vào workflow của bạn

1. Mở canvas workflow
2. Kéo **Slack Trigger** từ bảng node vào canvas
3. Nhấp vào node để mở bảng Properties
4. Chọn thông tin xác thực `slack_trigger` của bạn
5. Sao chép **Webhook URL** hiển thị trong bảng

### 3. Cấu hình Slack App của bạn

1. Trong cài đặt Slack App, truy cập **Event Subscriptions**
2. Bật **Enable Events**
3. Dán Webhook URL vào trường **Request URL**
4. Slack gửi một thử thách xác minh URL — Heym phản hồi tự động trong vài mili giây
5. Trường chuyển sang màu xanh: ✓ Verified
6. Đăng ký các **Bot Events** bạn cần (ví dụ: `message.channels`, `reaction_added`)
7. Lưu thay đổi và cài đặt lại ứng dụng vào workspace của bạn nếu được nhắc

## Các trường đầu ra

Sau khi node kích hoạt, các node phía sau có thể truy cập:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.event` | Đối tượng sự kiện Slack đầy đủ |
| `$nodeLabel.event.type` | Loại sự kiện (ví dụ: `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Nội dung tin nhắn (khi áp dụng) |
| `$nodeLabel.event.user` | ID người dùng Slack đã kích hoạt sự kiện |
| `$nodeLabel.event.channel` | ID kênh |
| `$nodeLabel.event.ts` | Dấu thời gian sự kiện |
| `$nodeLabel.headers` | HTTP headers đã được làm sạch từ Slack |
| `$nodeLabel.triggered_by` | Nhãn nguồn kích hoạt (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID node trên canvas đã nhận sự kiện Slack |

## Workflow ví dụ

**Tin nhắn Slack → LLM trả lời → Slack gửi:**

```
slackTrigger → llm → slack
```

- Nhãn **slackTrigger**: `slackEvent`
- Tin nhắn người dùng **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Tin nhắn **Slack**: `$llm.text`

## Bảo mật

- Các yêu cầu được xác minh bằng **HMAC-SHA256** với signing secret của bạn
- Các dấu thời gian cũ hơn **5 phút** bị từ chối (ngăn chặn tấn công replay)
- Các header nhạy cảm (`x-slack-signature`, `authorization`, v.v.) bị loại bỏ trước khi đến các node phía sau
- Nếu không có thông tin xác thực nào được đặt, node chạy mà không xác minh — chỉ khuyến nghị cho kiểm thử cục bộ

## Ghi chú

- Heym phản hồi `200 OK` ngay lập tức và chạy workflow trong nền — điều này đáp ứng yêu cầu phản hồi trong 3 giây của Slack
- Webhook URL được tạo từ ID node và không bao giờ thay đổi, ngay cả sau khi đổi tên workflow
- Chỉ cần một node `slackTrigger` cho mỗi workflow; sử dụng các node **Switch** hoặc **Condition** phía sau để định tuyến các loại sự kiện khác nhau

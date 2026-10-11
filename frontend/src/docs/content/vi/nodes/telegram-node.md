# Telegram

Node **Telegram** gửi tin nhắn thông qua Telegram Bot API. Sử dụng node này cho các phản hồi trong chat, cảnh báo vận hành, cập nhật trạng thái workflow, hoặc bất kỳ bước downstream nào cần gửi tin nhắn đến người dùng, nhóm hoặc kênh Telegram.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `credentialId` | UUID | Credential `telegram` chứa bot token |
| `chatId` | expression | ID của chat, nhóm hoặc kênh đích |
| `message` | expression | Nội dung tin nhắn gửi đi. Hỗ trợ [expressions](../reference/expression-dsl.md). |

## Thiết lập

1. Tạo một [Telegram Bot credential](../reference/integrations.md#telegram)
2. Thêm node **Telegram** vào workflow của bạn
3. Chọn credential
4. Đặt `chatId` thành một chat ID tĩnh hoặc một expression như `$telegramEvent.message.chat.id`
5. Đặt `message` thành văn bản gửi đi hoặc một template được xây dựng từ dữ liệu upstream

## Ví dụ

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Trường đầu ra

| Expression | Mô tả |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` khi thành công |
| `$nodeLabel.ok` | Cờ thành công của Telegram API |
| `$nodeLabel.result` | Đối tượng kết quả `sendMessage` thô từ Telegram |
| `$nodeLabel.result.message_id` | ID tin nhắn Telegram |
| `$nodeLabel.result.chat.id` | ID chat đích do Telegram trả về |

## Các mẫu phổ biến

- Kết hợp với [Telegram Trigger](./telegram-trigger-node.md) cho các bot hội thoại
- Gửi thông báo lỗi từ [Error Handler](./error-handler-node.md)
- Đăng các bản tóm tắt được tạo bởi [LLM](./llm-node.md) hoặc [Agent](./agent-node.md)

## Liên quan

- [Telegram Trigger](./telegram-trigger-node.md) – Khởi động workflow từ các tin nhắn đến của bot
- [Third-Party Integrations](../reference/integrations.md) – Thiết lập Telegram credential
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý credential `telegram`
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node

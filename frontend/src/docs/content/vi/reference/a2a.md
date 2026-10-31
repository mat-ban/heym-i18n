# A2A

Heym cung cấp **Heym Agent** thông qua giao thức Agent2Agent (A2A 1.0, liên kết JSON-RPC). Heym Agent là động cơ đằng sau [tab Chat](../tabs/chat-tab.md); các ứng dụng khách MCP truy cập cùng một agent dưới dạng công cụ `heym_chat` (xem [tab MCP / A2A](../tabs/mcp-tab.md)). Khi A2A được bật, một agent khác có thể gửi cho nó một Task bằng ngôn ngữ tự nhiên và nhận câu trả lời với đầy đủ các khả năng tương tự như Chat.

## Bật tính năng

1. Mở tab **MCP / A2A**.
2. Bật **Heym Agent** trên máy chủ mặc định hoặc trên máy chủ được đặt tên, sau đó chọn thông tin xác thực và mô hình.
3. Đánh dấu vào **Bật A2A**. Thẻ sẽ hiển thị URL của **Agent Card** và **JSON-RPC Endpoint**.

A2A hoạt động dựa trên Heym Agent: việc tắt agent cũng sẽ tắt luôn A2A.

## Endpoints

| | Máy chủ mặc định | Máy chủ được đặt tên |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card không yêu cầu thông tin xác thực và không nêu tên người dùng, máy chủ hoặc Workflow nào. Thẻ này chỉ tồn tại khi A2A được bật: thẻ miền tồn tại chừng nào có ít nhất một người dùng bật A2A cho máy chủ mặc định; thẻ của máy chủ được đặt tên tồn tại khi A2A của máy chủ đó đang hoạt động. Ngược lại, địa chỉ sẽ trả về lỗi 404.

## Xác thực

Gửi cùng thông tin xác thực như đối với MCP, chỉ trong tiêu đề:

- `X-MCP-Key: <key>`: khóa của máy chủ mặc định hoặc khóa của máy chủ được đặt tên
- `Authorization: Bearer <token>`: OAuth Token từ máy chủ OAuth của Heym

Thông tin xác thực trong URL sẽ bị từ chối. Agent Card khai báo cả hai lược đồ, cho phép ứng dụng khách A2A đọc trực tiếp từ thẻ.

## Phương thức

| Phương thức | Mô tả hoạt động |
|---|---|
| `SendMessage` | Bắt đầu một Task hoặc tiếp tục một nhiệm vụ đang chờ dữ liệu đầu vào. Chờ câu trả lời trừ khi `configuration.returnImmediately` là `true`. |
| `SendStreamingMessage` | Tương tự như trên, dưới dạng luồng Server-Sent Events thông báo tiến trình và kết quả của Task. |
| `GetTask` | Trạng thái, phản hồi và lịch sử của một Task (`historyLength` giới hạn kích thước lịch sử). |
| `ListTasks` | Các Tasks của bạn trên máy chủ này, mới nhất trước, được lọc theo `contextId` hoặc `status`, với `pageSize` và `pageToken`. |
| `CancelTask` | Dừng một Task vẫn đang xử lý hoặc đang chờ. |
| `SubscribeToTask` | Theo dõi một Task vẫn đang hoạt động. |
| `GetExtendedAgentCard` | Thẻ kèm theo tên máy chủ và các Workflows được chỉ định dưới dạng kỹ năng. |

Thông báo đẩy không được hỗ trợ: thẻ ghi rõ `pushNotifications: false`, và các phương thức đẩy trả về `PushNotificationNotSupportedError`. Yêu cầu sử dụng A2A 1.0; hãy gửi tiêu đề `A2A-Version: 1.0`. Tên phương thức từ A2A 0.3 chẳng hạn như `message/send` sẽ trả về `VersionNotSupportedError`.

## Tasks và hội thoại

Mỗi Task là một cuộc hội thoại trong tab Chat, được biểu thị bằng biểu tượng mạng. `contextId` của nhiệm vụ là cuộc trò chuyện đó: gửi một tin nhắn mới với cùng một `contextId` và không kèm `taskId` để tiếp tục.

| Hành động của agent | Trạng thái Task |
|---|---|
| Đã trả lời | `TASK_STATE_COMPLETED`, với câu trả lời dạng văn bản và các liên kết đến Workflows cùng bộ đánh giá dạng dữ liệu (nếu có lưu) |
| Đặt câu hỏi làm rõ | `TASK_STATE_INPUT_REQUIRED`: phản hồi lại với cùng một `taskId` |
| Cần thông tin xác thực | `TASK_STATE_AUTH_REQUIRED`: thông báo trạng thái chứa liên kết tới trang thông tin xác thực của Heym. Người dùng mở liên kết trong trình duyệt đã đăng nhập Heym; giá trị không bao giờ đi qua agent kia. Sau đó gửi một tin nhắn trong cùng Task để tiếp tục. |
| Thất bại | `TASK_STATE_FAILED`, kèm theo lý do |
| Đã bị hủy | `TASK_STATE_CANCELED` |

Tin nhắn gửi tới một Task đã hoàn thành hoặc vẫn đang xử lý sẽ bị từ chối với `UnsupportedOperationError`. Tin nhắn chấp nhận các phần `text` và `data`, tổng cộng tối đa 20.000 ký tự; phần tệp tin bị từ chối, do đó hãy gửi tệp dưới dạng liên kết.

## Tiến trình

Khi Task đang hoạt động, luồng sẽ gửi bản cập nhật trạng thái cho từng bước bằng ngôn từ hiển thị trong tab Chat, ví dụ `Running workflow "Invoice Parser"` hoặc `Testing the workflow · attempt 2/5`. Ứng dụng khách MCP nhận các bước tương tự như `notifications/progress` từ `heym_chat`.

## Ví dụ

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Giới hạn

- `CancelTask` dừng ngay một lượt chạy trên phiên bản Heym đang thực thi, giống như nút Stop trong tab Chat. Ở những nơi khác, nhiệm vụ được đánh dấu là đã bị hủy và kết quả muộn của lượt chạy sẽ không được ghi lại.
- Không có thông báo đẩy, không có liên kết REST hoặc gRPC, không có Agent Cards đã ký.

## Liên quan

- [Tab MCP / A2A](../tabs/mcp-tab.md): bật Heym Agent và A2A
- [Tab Chat](../tabs/chat-tab.md): động cơ cốt lõi đằng sau agent
- [Bảo mật](./security.md): cách lưu trữ khóa an toàn

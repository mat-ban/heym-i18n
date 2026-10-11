# Đầu ra

**Node Output** là endpoint của workflow, trả về phản hồi cho bên gọi. Luôn tham chiếu node trước đó bằng label—không bao giờ dùng `$input`.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 (tùy chọn, cho xử lý hậu kỳ bất đồng bộ) |
| Output | Trả về `message` cho bên gọi |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `message` | expression | Giá trị đầu ra. **Phải** tham chiếu node trước đó: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Nếu true, các node sau output chạy bất đồng bộ sau khi phản hồi được gửi |

## Sử dụng làm agent tool

Khi một node Output được kết nối với [Agent Node](./agent-node.md) như một canvas node tool, trường `message` có thể được đánh dấu là **agent-provided** với biểu tượng bot. Agent sau đó sẽ cung cấp message khi nó gọi tool. Nếu node Output không được kết nối như một agent tool, biểu tượng bot sẽ bị ẩn.

## Quy tắc quan trọng

**Không bao giờ dùng `$input` trong node output.** Luôn dùng label của node trước đó:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (trong đó `processData` là label của node trước đó)

## Xử lý hậu kỳ bất đồng bộ

Khi `allowDownstream: true`, phản hồi được trả về ngay lập tức. Các node được kết nối sau output sẽ chạy trong nền (ví dụ: thông báo Slack, ghi log). Vì phần đuôi downstream có thể hoàn thành muộn hơn, một lỗi ở downstream có thể thay đổi trạng thái run được ghi nhận thành `error` sau khi phản hồi sớm đã được trả về; lịch sử và analytics cuối cùng sẽ phản ánh kết quả muộn đó.

## Ví dụ

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Ví dụ – Với Async

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Sau đó kết nối một node [Telegram](./telegram-node.md), [Slack](./slack-node.md), hoặc node khác sau output để gửi thông báo kiểu fire-and-forget.

## Liên quan

- [JSON output mapper](./json-output-mapper-node.md) – Root JSON body không có bọc `result` khi là terminal duy nhất
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu output của node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Trình soạn thảo mở rộng với preview backend trực tiếp cho message
- [Workflow Structure](../reference/workflow-structure.md) – Định dạng JSON

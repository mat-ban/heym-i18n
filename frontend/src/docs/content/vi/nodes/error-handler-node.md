# Bộ xử lý lỗi

Node **Error Handler** bắt các lỗi từ bất kỳ node nào trong workflow. Khi được thêm vào, nó sẽ tự động chạy khi bất kỳ node nào gặp lỗi. Không cần kết nối đầu vào—nó được kích hoạt bởi workflow engine.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 (kích hoạt khi có lỗi) |
| Đầu ra | 1 |
| Output | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `message` | expression | Tùy chọn. Mặc định: `$error.message` |

## Ngữ cảnh lỗi

Khi error handler chạy, các trường sau sẽ khả dụng:

| Trường | Mô tả |
|-------|-------------|
| `$errorHandler.error` | Chuỗi thông báo lỗi |
| `$errorHandler.errorNode` | Label của node bị lỗi |
| `$errorHandler.errorNodeType` | Loại của node bị lỗi |
| `$errorHandler.timestamp` | Thời điểm lỗi xảy ra |

## Trường hợp sử dụng

- Gửi thông báo qua [Telegram](./telegram-node.md), [Slack](./slack-node.md), hoặc [Send Email](./send-email-node.md) khi thất bại
- Ghi log lỗi ra các hệ thống bên ngoài
- Trả về phản hồi lỗi tùy chỉnh thông qua [Output](./output-node.md)

Chỉ được có một Error Handler cho mỗi workflow.

## Ví dụ

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Kết nối tới Output để trả về phản hồi lỗi tùy chỉnh:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Hoặc kết nối tới Slack để gửi thông báo:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Telegram Node](./telegram-node.md) – Thông báo khi có lỗi
- [Slack Node](./slack-node.md) – Thông báo khi có lỗi
- [Send Email Node](./send-email-node.md) – Cảnh báo qua email
- [Throw Error Node](./throw-error-node.md) – Lỗi có chủ đích

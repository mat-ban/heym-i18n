# Nhật ký bảng điều khiển

Node **Console Log** ghi một giá trị ra console của backend (server). Sử dụng node này để debug và kiểm tra trong quá trình phát triển.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | Truyền tiếp giá trị đầu vào |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `logMessage` | expression | Giá trị cần ghi log. Hỗ trợ [expressions](../reference/expression-dsl.md). |

## Ví dụ

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Kết quả đầu ra sẽ xuất hiện trong log của server (ví dụ: output trên terminal khi chạy `uvicorn`).

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Logs Tab](../tabs/logs-tab.md) – Xem log của ứng dụng

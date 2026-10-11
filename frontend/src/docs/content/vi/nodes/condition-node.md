# Điều kiện

Node **Condition** phân nhánh workflow dựa trên biểu thức if/else. Định tuyến đến nhánh true hoặc false tùy thuộc vào kết quả.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 2 (true, false) |
| Đầu ra | Truyền qua đầu vào đến nhánh được chọn |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `condition` | expression | Biểu thức kiểu JavaScript (ví dụ: `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – khi condition đánh giá là truthy
- **Source handle `false`** – khi condition đánh giá là falsy

## Toán tử biểu thức

Hỗ trợ: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, v.v. Xem [Expression DSL](../reference/expression-dsl.md).

## Ví dụ

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Kết nối các edge với `sourceHandle: "true"` hoặc `sourceHandle: "false"` để định tuyến đến các nhánh khác nhau.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Switch Node](./switch-node.md) – Định tuyến đa hướng theo giá trị
- [Expression DSL](../reference/expression-dsl.md) – Cú pháp condition
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Trình soạn thảo mở rộng với xem trước backend trực tiếp cho condition

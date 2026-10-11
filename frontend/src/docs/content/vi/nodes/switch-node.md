# Switch

Node **Switch** định tuyến việc thực thi đến các đường dẫn khác nhau dựa trên việc khớp một giá trị với các case. Hỗ trợ N case cùng với một nhánh default.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | n (một cho mỗi case + default) |
| Đầu ra | Truyền tiếp đầu vào đến nhánh được khớp |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh của node (camelCase) |
| `expression` | expression | Giá trị cần đánh giá (ví dụ: `$input.category`) |
| `cases` | string[] | Các giá trị case cần khớp (ví dụ: `["case1", "case2", "case3"]`) |

## Edge Handles

- Mỗi case có một source handle (chỉ số 0, 1, 2, …)
- Handle default dành cho các giá trị không khớp

## Ví dụ

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Kết nối các edge với `sourceHandle` được đặt thành chỉ số của case (0, 1, 2) hoặc handle default dành cho các giá trị không khớp.

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Node Condition](./condition-node.md) – Rẽ nhánh If/else
- [Expression DSL](../reference/expression-dsl.md) – Cú pháp biểu thức

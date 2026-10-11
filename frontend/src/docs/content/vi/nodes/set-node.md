# Thiết lập

Node **Set** chuyển đổi và ánh xạ dữ liệu đầu vào thành đầu ra tùy chỉnh. Sử dụng node này cho các tác vụ như viết hoa, cắt chuỗi con, nối chuỗi, tạo số ngẫu nhiên và mọi phép biến đổi dữ liệu khác — không dùng để gọi workflow (hãy dùng [Execute](./execute-node.md) cho mục đích đó).

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.keyName` cho mỗi key ánh xạ |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `mappings` | array | Các cặp key-value. Mỗi phần tử: `{ key, value }` trong đó `value` là một [expression](../reference/expression-dsl.md) |

## Sử dụng làm agent tool

Khi một node Set được kết nối với [Agent Node](./agent-node.md) như một canvas node tool, mỗi giá trị ánh xạ có thể được đánh dấu là **agent-provided** bằng biểu tượng bot. Các giá trị ánh xạ được đánh dấu sẽ trở thành tham số tool mà agent điền vào lúc runtime. Các ánh xạ không được đánh dấu vẫn cố định trong cấu hình node.

Biểu tượng bot chỉ xuất hiện khi node Set được kết nối với tools handle của agent. Một node Set độc lập sẽ không hiển thị điều khiển agent-provided.

## Quy tắc Expression

- Tham chiếu các node trước đó: `$nodeName.text`, `$nodeName.body.field`
- Sử dụng các hàm: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` loại trừ `b`; nếu `a > b` sẽ báo lỗi.
- Chỉ có một dấu `$` ở đầu expression — không bao giờ đặt bên trong dấu ngoặc đơn
- Truy cập đầu ra theo key: `$setNode.randomNumber`, `$setNode.text`

## Ví dụ

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Các node phía sau truy cập qua `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Liên quan

- [JSON output mapper](./json-output-mapper-node.md) – Cùng cơ chế mappings; node đầu cuối duy nhất trả về root JSON cho webhook/run
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Execute Node](./execute-node.md) – Gọi workflow (không phải biến đổi dữ liệu)
- [Expression DSL](../reference/expression-dsl.md) – Các hàm và cú pháp
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Trình soạn thảo mở rộng với xem trước backend trực tiếp và Prev/Next cho các mappings

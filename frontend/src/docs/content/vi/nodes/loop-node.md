# Vòng lặp

Node **Loop** lặp qua một mảng, thực thi các node phía sau cho mỗi phần tử. Yêu cầu một kết nối ngược từ node cuối cùng trong thân vòng lặp để tiến sang bước tiếp theo.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 2 (mặc định + loop back) |
| Đầu ra | 2 (loop, done) |
| Output | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `arrayExpression` | expression | Biểu thức trả về một mảng (ví dụ: `$input.items`) |

## Edge Handles

- **Source `loop`** – Kết nối tới các node xử lý từng phần tử (chạy mỗi vòng lặp)
- **Source `done`** – Kết nối tới các node chạy sau khi tất cả các vòng lặp hoàn tất
- **Target default** – Nhận dữ liệu ban đầu chứa mảng
- **Target `loop`** – Nhận kết nối ngược từ node cuối cùng trong thân vòng lặp

## Loop Context (trong thân vòng lặp)

- `$loopNode.item` – Phần tử hiện tại
- `$loopNode.index` – Chỉ số bắt đầu từ 0
- `$loopNode.total` – Tổng số phần tử
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Quy tắc quan trọng

1. **Bắt buộc kết nối ngược:** Node cuối cùng trong thân vòng lặp BẮT BUỘC phải kết nối ngược về handle đầu vào `loop` của node loop.
2. **Không có output trong thân vòng lặp:** Các node [Output](./output-node.md) bị cấm bên trong thân vòng lặp. Sử dụng [Set](./set-node.md) hoặc [Variable](./variable-node.md) cho các kết quả trung gian.
3. **Không tự động thu thập kết quả:** Vòng lặp không thu thập kết quả. Sử dụng các node Variable với `$array()` và `.add()` để tích lũy.

## Ví dụ

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Luồng: loop → node xử lý → (quay lại loop) → loop → nhánh done → output.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Variable Node](./variable-node.md) – Thu thập các phần tử trong một vòng lặp
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, các phương thức mảng

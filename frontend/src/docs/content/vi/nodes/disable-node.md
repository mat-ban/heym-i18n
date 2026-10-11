# Vô hiệu hóa node

Node **Node Vô hiệu hóa** vô hiệu hóa vĩnh viễn một node khác trong workflow. Khi được thực thi, nó đặt `active` của node mục tiêu thành `false` và lưu lại thay đổi. Sử dụng nó cho các thao tác một lần như dừng trigger cron sau khi một điều kiện được thỏa mãn.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `targetNodeLabel` | string | Nhãn của node cần vô hiệu hóa (ví dụ: `hourlyCheck`) |

## Trường hợp sử dụng

Vô hiệu hóa một trigger [Cron](./cron-node.md) sau khi một điều kiện được thỏa mãn để nó không còn chạy trong các lần thực thi workflow tiếp theo. Bật lại sau bằng [Node Kích hoạt](./enable-node.md).

## Ví dụ

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Luồng: Cron → Kiểm tra HTTP → Điều kiện (trạng thái hoàn thành?) → nếu đúng: Node Vô hiệu hóa (mục tiêu: cron) → Đầu ra.

## Liên quan

- [Các loại Node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Node Kích hoạt](./enable-node.md) – Bật lại một node đã bị vô hiệu hóa
- [Node Cron](./cron-node.md) – Trigger cần vô hiệu hóa
- [Node Điều kiện](./condition-node.md) – Phân nhánh trước khi vô hiệu hóa

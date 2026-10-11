# Kích hoạt node

Node **Enable Node** bật lại một node khác. Khi được thực thi, nó đặt `active` của node đích thành `true` và lưu lại thay đổi. Đây là node đối ứng với [Disable Node](./disable-node.md): dùng nó để kích hoạt lại một trigger [Cron](./cron-node.md) hoặc bất kỳ node nào đã bị tắt.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `targetNodeLabel` | string | Nhãn của node cần bật (ví dụ: `hourlyCheck`) |

## Hành vi

- Node đích được lưu ở trạng thái active, vì vậy các lần chạy và trigger trong tương lai sẽ thấy nó. Một trigger Cron được bật lại sẽ kích hoạt trở lại vào thời điểm đã lên lịch tiếp theo.
- Nếu node đích nằm ở phía sau Enable Node và chưa chạy, nó cũng sẽ chạy trong lần thực thi hiện tại.
- Bật một node đã ở trạng thái active không thay đổi gì; đầu ra vẫn báo `enabled: true`.
- Node sẽ thất bại với lỗi khi `targetNodeLabel` trống hoặc không có node nào có nhãn đó.

## Trường hợp sử dụng

Khởi động một trigger [Cron](./cron-node.md) theo yêu cầu. Lưu node Cron ở trạng thái tắt, và cung cấp cho workflow một điểm vào thứ hai như trigger [Input](./input-node.md). Một yêu cầu đến điểm vào đó sẽ chạy Enable Node, và Cron bắt đầu kích hoạt.

Một trigger đã tắt sẽ không bao giờ tự khởi động một lần chạy, vì vậy Enable Node phải nằm sau một điểm vào có thể chạy được.

## Ví dụ

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Luồng: Input → Enable Node (đích: cron) → Output. Node Cron `hourlyCheck` được lưu ở trạng thái disabled trong cùng workflow và chạy nhánh kiểm tra HTTP riêng của nó sau khi được bật.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Disable Node](./disable-node.md) – Tắt một node từ bên trong workflow
- [Cron Node](./cron-node.md) – Trigger cần bật
- [Condition Node](./condition-node.md) – Rẽ nhánh trước khi bật
- [Canvas Features](../reference/canvas-features.md) – Bật hoặc tắt một node thủ công

# Cron

Node **Cron** kích hoạt một workflow theo lịch trình bằng cách sử dụng biểu thức cron. Không cần đầu vào từ người dùng—workflow sẽ chạy tự động vào các thời điểm đã chỉ định.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 |
| Đầu ra | 1 |
| Đầu ra | Sự kiện trigger (không có payload) |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `cronExpression` | string | Biểu thức cron (ví dụ: `0 * * * *` cho mỗi giờ) |

## Định dạng biểu thức Cron

Cron 5 trường tiêu chuẩn: `minute hour day-of-month month day-of-week`

| Trường | Giá trị | Ví dụ |
|-------|--------|---------|
| Phút | 0–59 | `0` = tại phút 0 |
| Giờ | 0–23 | `*` = mỗi giờ |
| Ngày trong tháng | 1–31 | `*` = mỗi ngày |
| Tháng | 1–12 | `*` = mỗi tháng |
| Ngày trong tuần | 0–7 (0 và 7 = Chủ nhật) | `*` = mỗi ngày |

**Các ví dụ phổ biến:**

- `0 * * * *` – mỗi giờ
- `0 0 * * *` – hàng ngày vào lúc nửa đêm
- `*/15 * * * *` – mỗi 15 phút
- `0 9 * * 1-5` – các ngày trong tuần vào lúc 9:00

## Ví dụ

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Dừng một cron trigger sau một điều kiện
- [Enable Node](./enable-node.md) – Khởi động lại một cron trigger đã bị vô hiệu hóa

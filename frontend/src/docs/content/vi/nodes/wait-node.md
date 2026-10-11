# Chờ

Node **Wait** tạm dừng việc thực thi workflow trong một khoảng thời gian được chỉ định. Sử dụng node này để giới hạn tốc độ (rate limiting), trì hoãn hành động, hoặc thiết lập khoảng thời gian polling.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 1 |
| Đầu ra | Truyền tiếp dữ liệu đầu vào |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh của node (camelCase) |
| `duration` | number | Thời gian trì hoãn tính bằng mili giây (ví dụ: 1000 = 1 giây). Trình soạn thảo chấp nhận giá trị từ 1 đến 900000 (15 phút) |

## Ví dụ

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Liên quan

- [Các loại node](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Node Loop](./loop-node.md) – Sử dụng Wait bên trong vòng lặp để giới hạn tốc độ

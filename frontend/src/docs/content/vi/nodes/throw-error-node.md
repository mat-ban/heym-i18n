# Tạo lỗi

Node **Throw Error** dừng ngay lập tức việc thực thi workflow và trả về phản hồi lỗi với mã trạng thái HTTP tùy chỉnh. Sử dụng node này cho các trường hợp xác thực thất bại, truy cập trái phép hoặc các điều kiện lỗi khác.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 1 |
| Đầu ra | 0 |
| Đầu ra | Workflow dừng; phản hồi lỗi được trả về cho bên gọi |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `errorMessage` | expression | Thông báo lỗi (hỗ trợ biểu thức) |
| `httpStatusCode` | number | Mã trạng thái HTTP (ví dụ: 400, 401, 403, 404, 429, 500) |

## Các mã trạng thái phổ biến

| Mã | Trường hợp sử dụng |
|------|----------|
| 400 | Bad Request (đầu vào không hợp lệ) |
| 401 | Unauthorized (yêu cầu xác thực) |
| 403 | Forbidden (truy cập bị từ chối) |
| 404 | Not Found (không tìm thấy tài nguyên) |
| 422 | Unprocessable Entity (lỗi xác thực) |
| 429 | Too Many Requests (giới hạn tần suất) |
| 500 | Internal Server Error |

## Ví dụ

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Sử dụng cùng với [Condition](./condition-node.md) để xác thực đầu vào và chỉ throw khi không hợp lệ:
- Condition đúng → tiếp tục đến Output
- Condition sai → Throw Error

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Condition Node](./condition-node.md) – Xác thực trước khi throw
- [Error Handler](./error-handler-node.md) – Bắt lỗi từ các node khác

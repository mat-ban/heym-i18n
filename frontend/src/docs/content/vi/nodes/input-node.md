# Đầu vào

**Node Input** là điểm vào cho các workflow nhận dữ liệu từ người dùng hoặc API caller. Nó hỗ trợ một hoặc nhiều trường input và hiển thị metadata của request (headers, query params).

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `value` | string | Giá trị mặc định cho input văn bản đơn (tùy chọn) |
| `inputFields` | array | Định nghĩa các trường input. Mỗi trường: `{ key, defaultValue? }` |

### Trường Input

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `key` | string | Khóa của trường (ví dụ: `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Giá trị mặc định nếu không được cung cấp (tùy chọn) |

## Truy cập dữ liệu Input

**Các trường body** (luôn sử dụng `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – trường văn bản
- `$userInput.body.imageUrl` – URL hình ảnh
- `$userInput.body.userId` – với giá trị mặc định nếu được cấu hình
- `$userInput.body.event.user.id` – JSON lồng nhau từ chế độ Generic webhook

**Metadata của request** (khi được thực thi qua API):

- `$userInput.headers` – tất cả headers (khóa viết thường)
- `$userInput.headers.authorization` – header cụ thể
- `$userInput.query` – các query parameters
- `$userInput.query.param1` – query param cụ thể

## File Input trong Run Panel

Trong tab **Run** của editor (chế độ Defined webhook), mỗi trường input hỗ trợ kéo-thả và một control đính kèm inline (ở góc dưới bên phải của trường):

- **File văn bản** (`.txt`, `.md`, `.json`, `.csv`, và tương tự) được đọc dưới dạng văn bản thuần.
- **Hình ảnh** (JPEG, PNG, GIF, WebP) được lưu dưới dạng URL `data:` (base64) trong giá trị của trường — sử dụng các khóa trường như `imageUrl` hoặc `base64` khi các node downstream mong đợi dữ liệu hình ảnh.
- **File PDF** được chuyển đổi thành văn bản trích xuất (tối đa file 5 MB, 100k ký tự nội dung).

Mỗi trường một file. Bạn vẫn có thể chỉnh sửa textarea sau khi file được tải. Chế độ Generic webhook (raw JSON body) không hiển thị các control file theo từng trường.

## Trường Input so với Generic Webhooks

`inputFields` vẫn mô tả các input dự kiến cho các form editor ở chế độ defined, ánh xạ sub-workflow, và các bề mặt khác được điều khiển bởi metadata.

Khi một workflow sử dụng chế độ body webhook **Generic**, HTTP body đến không được định hình lại từ `inputFields`. Thay vào đó, payload JSON thô được truyền trực tiếp đến `$nodeLabel.body`, và các control thêm/xóa trường của node Input bị ẩn trong panel của node.

## Ví dụ

**Input đơn (mặc định):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Nhiều input:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Triggers](../reference/triggers.md) – Các điểm vào (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Hiển thị các workflow dưới dạng chat UI
- [Webhooks](../reference/webhooks.md) – HTTP trigger cho các workflow

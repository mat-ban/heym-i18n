# Phát triển Plugin

Plugin Heym là các gói zip đáng tin cậy được cài đặt bởi người vận hành. Một gói có thể
thêm một hoặc nhiều node action hoặc trigger tùy chỉnh mà không cần thay đổi ứng dụng lõi.

## Cấu trúc gói

Một plugin zip phải chứa `plugin.json` ở thư mục gốc của gói và tệp entry Python
được chỉ định bởi `entry` (mặc định là `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` là tùy chọn và được phục vụ như trang tài liệu của plugin. Đặt một
`icon.svg` ở thư mục gốc của gói để làm icon mặc định cho node, hoặc đặt đường dẫn
`icon` riêng cho từng node trong `plugin.json`.

## Manifest

Sử dụng `plugin.json` đa node khi một gói hiển thị nhiều node:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Manifest đơn node kiểu cũ cũng được chấp nhận: bỏ qua `nodes` và cung cấp
`kind`, `fields`, `dslHint`, và `docSlug` ở cấp cao nhất.

## Các trường Manifest

| Trường | Ghi chú |
|-------|-------|
| `id` | Id gói viết thường sử dụng chữ cái, số và dấu gạch ngang. |
| `name` | Tên gói dễ đọc cho người dùng. |
| `version` | Phiên bản gói dùng để hiển thị và cache handler. |
| `description` | Mô tả ngắn hiển thị trong UI và ngữ cảnh của assistant. |
| `entry` | Đường dẫn tệp handler Python bên trong zip; mặc định là `handler.py`. |
| `dependencies` | Các yêu cầu pip tùy chọn được cài đặt bằng `uv pip install`. |
| `nodes` | Các node tùy chỉnh được gói này hiển thị. |

Mỗi node cần một `key` duy nhất, một `name`, và một `kind` là `action` hoặc
`trigger`. Nếu bỏ qua `function`, action sẽ gọi `run` và trigger sẽ gọi
`trigger`.

Các loại trường được hỗ trợ là `string`, `number`, `boolean`, và `select`. Trường Select
sử dụng một mảng `options` gồm các đối tượng `{ "label": "...", "value": "..." }`.
Đặt `required` cho các trường bắt buộc và `secret` cho các input được che giấu. Manifest
cũng chấp nhận metadata `default`, `dynamic`, và `expression` cho các trường; chúng được
lưu cùng với manifest, nhưng các node plugin hiện tại đọc cấu hình node đã lưu
tại runtime thay vì tự động điền cấu hình còn thiếu từ giá trị mặc định.

Các trường string không phải secret được hiển thị với UI nhập biểu thức. Tại runtime,
bất kỳ giá trị cấu hình string đã lưu nào bắt đầu bằng `$` sẽ được giải quyết trước khi handler
được gọi.

## Các hàm Handler

Handler của action nhận inputs của workflow, config đã giải quyết, và một context nhỏ:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handler của trigger nhận config đã giải quyết và context:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Trả về một dictionary để hiển thị các trường output có tên. Nếu một handler trả về một
kiểu khác, Heym sẽ bao bọc nó thành `{ "value": result }`.

## Cài đặt và Runtime

Plugin bị vô hiệu hóa theo mặc định. Người vận hành kích hoạt chúng bằng
`HEYM_PLUGINS_ENABLED=true` và giới hạn quản lý cho
`HEYM_PLUGIN_ADMIN_EMAILS`. Các tệp plugin đã cài đặt nằm dưới
`HEYM_PLUGINS_DIR` và nên được mount liên tục trong các triển khai container.

Mã plugin là Python đáng tin cậy, do người vận hành cài đặt, chạy trong cùng tiến trình với
backend. Nó có thể truy cập mạng và các thư viện đã cài đặt, vì vậy chỉ cài đặt
các gói mà bạn sẵn sàng chạy với cùng mức độ tin cậy như chính Heym.

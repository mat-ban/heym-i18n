# WebSocket Trigger

Node **WebSocket Trigger** mở một kết nối client outbound đến một máy chủ WebSocket bên ngoài và khởi động workflow khi các sự kiện socket được chọn xảy ra. Sử dụng node này cho các luồng sự kiện như nguồn cấp dữ liệu thị trường, telemetry, hoặc chat backplane. Việc kết nối đến các hệ thống realtime nội bộ yêu cầu tùy chọn opt-out URL riêng tư được mô tả bên dưới.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Hành vi quan trọng

- Node này kết nối **từ Heym đến một máy chủ WebSocket khác**.
- Node này **không** expose một endpoint WebSocket trên Heym.
- Không yêu cầu [credential](../reference/credentials.md). Cấu hình URL, headers, và subprotocols trực tiếp trên node.
- Leader worker giữ kết nối mở trong nền và tự động kết nối lại khi được bật.

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `websocketUrl` | string | URL `ws://` hoặc `wss://` bên ngoài |
| `websocketHeaders` | JSON object string | Headers handshake tùy chọn |
| `websocketSubprotocols` | string | Danh sách subprotocol tùy chọn, phân tách bằng dấu phẩy |
| `websocketTriggerEvents` | array | Bất kỳ giá trị nào trong `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Kết nối lại sau khi ngắt kết nối |
| `retryWaitSeconds` | integer | Độ trễ trước khi kết nối lại |

## Các sự kiện được phát ra

### `onMessage`

Kích hoạt khi một frame đến từ socket từ xa.

Các trường hữu ích:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.message.data` | Payload JSON đã phân tích hoặc giá trị message thô |
| `$nodeLabel.message.text` | Văn bản đã giải mã UTF-8 khi có sẵn |
| `$nodeLabel.message.base64` | Payload nhị phân dưới dạng base64 |
| `$nodeLabel.message.sizeBytes` | Kích thước payload |
| `$nodeLabel.message.isJson` | Message có được phân tích dưới dạng JSON hay không |

### `onConnected`

Kích hoạt sau khi socket mở thành công.

Các trường hữu ích:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` ở lần kết nối đầu tiên, `true` ở các lần kết nối lại sau đó |
| `$nodeLabel.connection.subprotocol` | Subprotocol đã thương lượng |

### `onClosed`

Kích hoạt khi một kết nối đã được thiết lập bị đóng.

Các trường hữu ích:

| Biểu thức | Mô tả |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client`, hoặc `unknown` |
| `$nodeLabel.close.code` | Mã đóng WebSocket |
| `$nodeLabel.close.reason` | Lý do đóng |
| `$nodeLabel.close.wasClean` | `true` đối với đóng `1000` bình thường |
| `$nodeLabel.close.reconnecting` | Node có sẽ thử kết nối lại hay không |

## Ngữ nghĩa Trigger

- Một node đang hoạt động giữ một kết nối socket outbound tồn tại lâu dài.
- Kết nối chỉ chạy trên leader worker, tương tự như [IMAP Trigger](./imap-trigger-node.md) và chế độ nhận của [RabbitMQ](./rabbitmq-node.md).
- Nếu reconnect được bật, Heym chờ `retryWaitSeconds` và mở lại socket sau khi bị ngắt.
- Mỗi sự kiện được phát ra tạo một workflow run riêng biệt với `trigger_source = "websocket"`.

## An toàn Egress

- Theo mặc định, URL phải sử dụng `ws://` hoặc `wss://` và chỉ phân giải đến các địa chỉ công khai. Các đích loopback, private, link-local, multicast, và cloud-metadata đều bị chặn.
- Heym xác thực lại DNS mỗi lần kết nối lại, xác thực mọi địa chỉ được phân giải, và kết nối trực tiếp đến một trong các địa chỉ đó. Proxy môi trường và chuyển hướng WebSocket bị vô hiệu hóa trong khi guard đang hoạt động.
- Các vi phạm chính sách vĩnh viễn sẽ dừng trigger thay vì thử lại vô thời hạn. Các lỗi DNS hoặc mạng tạm thời vẫn tuân theo cài đặt retry của node.
- `Authorization`, `Origin`, `User-Agent`, và các headers dữ liệu tùy chỉnh được hỗ trợ. `Origin` được gửi thông qua tùy chọn chuyên dụng của WebSocket client. Các headers `Host`, `Connection`, `Upgrade`, và `Sec-WebSocket-*` không thể bị ghi đè.
- Các triển khai self-hosted đáng tin cậy có chủ đích kết nối đến các dịch vụ nội bộ có thể đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Giữ nguyên mặc định trên các triển khai hosted hoặc multi-tenant.

**Lưu ý nâng cấp cho v0.0.105:** chính sách toàn instance này hiện cũng bảo vệ các đích xuất phát từ credential được sử dụng bởi Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, thực thi LLM tùy chỉnh và khám phá model, AI assistant, guardrails, và RAG embeddings. Các credential hiện có trỏ đến địa chỉ loopback, private, hoặc link-local sẽ bị từ chối trừ khi `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` được bật trên một instance self-hosted đáng tin cậy. Trong khi guard được bật, các HTTP client được bảo vệ sẽ bỏ qua `HTTP_PROXY` và `HTTPS_PROXY`; việc bật opt-out sẽ khôi phục chúng. Các gói CA của operator được cấu hình thông qua `SSL_CERT_FILE` hoặc `SSL_CERT_DIR` vẫn được hỗ trợ. ClickHouse được kiểm tra trước khi kết nối mở nhưng không được ghim tại thời điểm dial, vì clickhouse-connect mang theo transport urllib3 riêng của nó.

## Workflow ví dụ

**Luồng sự kiện bên ngoài → lọc → thông báo**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** message: `"Realtime alert: $streamEvent.message.data.title"`
## Ví dụ Node JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Liên quan

- [Triggers](../reference/triggers.md) – Kiến trúc trigger chạy nền và `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Đẩy dữ liệu tới một socket bên ngoài từ một bước trong workflow
- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các node
- [Third-Party Integrations](../reference/integrations.md) – Node nào sử dụng credential và node nào không

# Gửi WebSocket

Node **WebSocket Send** mở một kết nối client outbound đến một WebSocket server bên ngoài, gửi một message, và đóng kết nối. Sử dụng node này khi một workflow cần đẩy các sự kiện đến một hệ thống realtime mà không cần phơi bày một socket endpoint thuộc sở hữu của Heym.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `websocketUrl` | string / expression | URL `ws://` hoặc `wss://` bên ngoài |
| `websocketHeaders` | JSON object string / expression | Các header handshake tùy chọn |
| `websocketSubprotocols` | string | Danh sách subprotocol phân tách bằng dấu phẩy tùy chọn |
| `websocketMessage` | expression | Payload cần gửi |

## Quy tắc tuần tự hóa Message

- Nếu `websocketMessage` phân giải thành một **string**, Heym gửi một text frame.
- Nếu nó phân giải thành một **object**, **array**, **number**, **boolean**, hoặc `null`, Heym tuần tự hóa nó thành JSON text.
- Nếu nó phân giải thành **bytes**, Heym gửi một binary frame.
- Các expression đầy đủ như `$input` giữ nguyên kiểu native trước khi tuần tự hóa.

## Các trường Output

| Expression | Mô tả |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` khi thành công |
| `$nodeLabel.url` | URL đích đã phân giải |
| `$nodeLabel.message_type` | `text`, `json`, hoặc `binary` |
| `$nodeLabel.size_bytes` | Kích thước payload tính bằng byte |
| `$nodeLabel.subprotocol` | Subprotocol đã thương lượng khi có |
| `$nodeLabel.sent_at` | Dấu thời gian ISO |

## Workflow ví dụ

**HTTP request → transform → publish qua WebSocket**

```
input → set → websocketSend → output
```

- **Set** tạo một payload object như `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** sử dụng `$payloadNode` làm `websocketMessage`
- **Output** có thể trả về `$socketSend.status`

## JSON node ví dụ

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Lưu ý

- Không cần [credential](../reference/credentials.md) cho node này.
- Nếu server từ xa yêu cầu auth hoặc tenant header, hãy truyền chúng qua `websocketHeaders`.
- Sử dụng [HTTP](./http-node.md) khi hệ thống từ xa dựa trên request/response thay vì dựa trên socket.

## An toàn Egress

- Theo mặc định, URL phải sử dụng `ws://` hoặc `wss://` và chỉ phân giải đến các địa chỉ công cộng. Các đích loopback, private, link-local, multicast, và cloud-metadata đều bị chặn.
- Heym xác thực mọi địa chỉ đã phân giải và kết nối trực tiếp đến một trong các địa chỉ đó. Proxy môi trường và các chuyển hướng WebSocket bị vô hiệu hóa trong khi guard đang hoạt động.
- Các header `Authorization`, `Origin`, `User-Agent`, và custom data header được hỗ trợ. `Origin` được gửi qua tùy chọn chuyên dụng của WebSocket client. Các header `Host`, `Connection`, `Upgrade`, và `Sec-WebSocket-*` không thể bị ghi đè.
- Các triển khai self-hosted đáng tin cậy có chủ đích kết nối đến các dịch vụ nội bộ có thể đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hãy giữ mặc định trên các triển khai hosted hoặc multi-tenant.

**Lưu ý nâng cấp cho v0.0.105:** chính sách toàn instance này giờ đây cũng bảo vệ các đích xuất phát từ credential được sử dụng bởi Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, thực thi LLM tùy chỉnh và khám phá model, AI assistant, guardrails, và RAG embeddings. Các credential hiện có trỏ đến địa chỉ loopback, private, hoặc link-local sẽ bị từ chối trừ khi `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` được bật trên một instance self-hosted đáng tin cậy. Trong khi guard đang bật, các HTTP client được bảo vệ sẽ bỏ qua `HTTP_PROXY` và `HTTPS_PROXY`; việc bật opt-out sẽ khôi phục chúng. Các gói CA của operator được cấu hình qua `SSL_CERT_FILE` hoặc `SSL_CERT_DIR` vẫn được hỗ trợ. ClickHouse được kiểm tra trước khi kết nối mở nhưng không được ghim tại thời điểm dial, vì clickhouse-connect mang transport urllib3 riêng của nó.

## Liên quan

- [WebSocket Trigger](./websocket-trigger-node.md) – Lắng nghe một socket bên ngoài và kích hoạt workflow trên các sự kiện
- [Node Types](../reference/node-types.md) – Tổng quan về node tích hợp
- [Expression DSL](../reference/expression-dsl.md) – Xây dựng các payload JSON động
- [Third-Party Integrations](../reference/integrations.md) – Tích hợp dựa trên credential so với cấu hình trực tiếp

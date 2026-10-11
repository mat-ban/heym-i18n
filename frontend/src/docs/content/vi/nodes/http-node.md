# HTTP

Node **HTTP** thực hiện các yêu cầu HTTP bằng cú pháp cURL. Nó có thể là điểm khởi đầu của workflow (không có edge đầu vào) hoặc nhận đầu vào từ các node thượng nguồn.

## Tổng quan

| Thuộc tính | Giá trị |
|----------|-------|
| Đầu vào | 0 hoặc 1 |
| Đầu ra | 1 |
| Đầu ra | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Tham số

| Tham số | Kiểu | Mô tả |
|-----------|------|-------------|
| `label` | string | Định danh node (camelCase) |
| `curl` | string | Lệnh cURL (ví dụ: `curl -X GET https://api.example.com`) |

## Định dạng phản hồi

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Truy cập phản hồi

- `$httpNode.status` – Mã trạng thái HTTP
- `$httpNode.body` – Nội dung phản hồi (chuỗi hoặc JSON đã phân tích)
- `$httpNode.body.fieldName` – Truy cập các trường JSON
- `$httpNode.headers` – Các header phản hồi

## Ví dụ

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Sử dụng cú pháp cURL với `-H` cho header, `-d` cho nội dung POST, v.v. Biểu thức có thể được dùng ở bất kỳ đâu trong chuỗi curl, bao gồm URL, một header, hoặc toàn bộ dòng header. Một [Header credential](../reference/credentials.md) phân giải thành `key: value`, vì vậy `-H "$credentials.MyApiKey"` sẽ gửi toàn bộ header:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Dấu ngoặc kép và khoảng trắng bên trong một biểu thức thuộc về biểu thức đó, không thuộc lệnh cURL, vì vậy các phương thức nhận đối số chuỗi hoạt động inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Xác thực bằng Credentials

`$credentials.Name` phân giải thành một giá trị khác nhau cho mỗi loại [credential](../reference/credentials.md), vì vậy dòng header phụ thuộc vào loại:

| Loại credential | `$credentials.Name` phân giải thành | Header |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | API key thô | `-H "Authorization: Bearer $credentials.Name"` |
| Google | API key thô | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | API key thô | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Một OAuth access token mới, được làm mới khi hết hạn | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Một credential Bearer đã mang sẵn tiền tố `Bearer `, vì vậy thêm một tiền tố nữa sẽ gửi `Bearer Bearer …`. Credential Google Sheets và Google Drive cho phép bạn gọi các Google API mà node của chúng không bao phủ, chẳng hạn như thêm một tab vào bảng tính, trong phạm vi các scope mà credential được cấp. Khi tên không phải là một định danh đơn giản (nó chứa `-`, bắt đầu bằng chữ số, hoặc là từ khóa dành riêng), hãy dùng dạng ngoặc: `-H "Authorization: $credentials["my-api-key"]"`.

Khi [AI Assistant](../reference/ai-assistant.md) hoặc [Chat](../tabs/chat-tab.md) xây dựng một yêu cầu HTTP cần xác thực và không có node chuyên dụng nào bao phủ dịch vụ đó, nó sẽ hỏi nên dùng credential nào. Hãy chọn một, thay đổi tên header đã điền sẵn nếu API yêu cầu tên khác, và nó sẽ viết dòng header cho bạn. Assistant chỉ thấy tên và loại credential, không bao giờ thấy giá trị của chúng. Nếu bạn không có credential phù hợp, câu hỏi sẽ đề nghị tạo một cái. Các bí mật lọt vào đầu ra của node, chẳng hạn như `request.headers` đã gửi, được che giấu trong kết quả chạy.

## An toàn Egress

- Theo mặc định, URL phải dùng `http://` hoặc `https://` và chỉ phân giải đến các địa chỉ công khai. Các đích loopback, private, link-local, multicast và cloud-metadata đều bị chặn.
- Heym xác thực các địa chỉ đã phân giải và ghim mục tiêu kết nối để ngăn chặn DNS rebinding. Các proxy môi trường bị vô hiệu hóa trong khi guard đang hoạt động. Các chuyển hướng không được theo dõi theo mặc định; hãy thêm tùy chọn `-L` của cURL để theo dõi chúng. Khi được bật, mỗi bước chuyển hướng đều được kiểm tra theo cùng chính sách địa chỉ công khai và được ghim trước khi kết nối.
- Các triển khai self-hosted đáng tin cậy cố ý kết nối đến các dịch vụ nội bộ có thể đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hãy giữ mặc định trên các triển khai hosted hoặc multi-tenant.

**Lưu ý nâng cấp cho v0.0.105:** chính sách toàn instance này giờ đây cũng bảo vệ các đích bắt nguồn từ credential được dùng bởi Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, thực thi LLM tùy chỉnh và khám phá model, AI assistant, guardrails, và RAG embeddings. Các credential hiện có trỏ đến địa chỉ loopback, private, hoặc link-local sẽ bị từ chối trừ khi `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` được bật trên một instance self-hosted đáng tin cậy. Trong khi guard đang bật, các HTTP client được bảo vệ sẽ bỏ qua `HTTP_PROXY` và `HTTPS_PROXY`; việc bật tùy chọn opt-out sẽ khôi phục chúng. Các gói CA của operator được cấu hình qua `SSL_CERT_FILE` hoặc `SSL_CERT_DIR` vẫn được hỗ trợ. ClickHouse được kiểm tra trước khi kết nối mở ra nhưng không được ghim tại thời điểm dial, vì clickhouse-connect mang theo transport urllib3 riêng của nó.

## Liên quan

- [Node Types](../reference/node-types.md) – Tổng quan về tất cả các loại node
- [Triggers](../reference/triggers.md) – HTTP như điểm vào của workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm API key cho các yêu cầu đã xác thực

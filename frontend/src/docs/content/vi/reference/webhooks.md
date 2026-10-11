# Webhooks

Workflow có thể được kích hoạt thông qua HTTP webhook. Endpoint execute tiêu chuẩn trả về JSON, và biến thể streaming trả về Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Thay `{workflow_id}` bằng UUID của workflow. Base URL là instance Heym của bạn (ví dụ: `https://app.heym.ai`).

## Request Method

Mỗi workflow chấp nhận một HTTP verb, được chọn trong hộp thoại cURL của editor: `GET`, `POST`, `PUT`, hoặc `DELETE`. **`POST` là mặc định**, và mọi workflow được tạo trước khi cài đặt này tồn tại đều giữ nguyên nó, vì vậy không có gì đang hoạt động tốt bị thay đổi.

Gọi một workflow với verb khác sẽ trả về `405 Method Not Allowed` kèm header `Allow` ghi rõ verb đã được cấu hình:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Một ngoại lệ: các request mang `?test_run=true` sẽ bỏ qua kiểm tra này. Đó là những gì nút **Run** của editor và bảng debug gửi đi, vì vậy một workflow được đặt thành `GET` vẫn có thể kiểm thử được từ bên trong sản phẩm.

### Các method không có body

`GET` và `DELETE` không mang request body. Input đến từ query string thay vào đó, và được đọc bằng `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Hộp thoại cURL ẩn trình soạn thảo request-body và loại bỏ header `Content-Type` cho hai method này.

Kết hợp `GET` với một [HTML output mapper](../nodes/html-output-mapper-node.md) để phục vụ một trang mà trình duyệt có thể mở trực tiếp.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Sử dụng streaming endpoint khi bạn muốn các sự kiện thực thi tăng dần thay vì một phản hồi JSON duy nhất. Xem [SSE Streaming](./sse-streaming.md) để biết giao thức sự kiện và cấu hình thông báo bắt đầu cho từng node.

## Định dạng Request

Request body được truyền dưới dạng `body` cho các node [Input](../nodes/input-node.md). Heym chấp nhận cả hai dạng request:

- **Raw JSON** – ví dụ: `{"userId": "123", "action": "create"}`
- **Định dạng wrapped** – `{"inputs": {...}, "test_run": false}`

Khi sử dụng định dạng wrapped, `inputs` được trích xuất và truyền dưới dạng `body`. `test_run` bỏ qua rate limiting và response caching. Bạn cũng có thể gửi `?test_run=true` dưới dạng query parameter khi post raw JSON.

## Các chế độ Request Body

Mỗi workflow có một cài đặt `webhook_body_mode` điều khiển cách editor xây dựng các request mẫu:

| Mode | Hành vi |
|------|----------|
| **defined** | Editor và hộp thoại cURL định hình body mẫu từ các trường của node Input trong workflow và giữ các key rỗng trong JSON payload. Các cURL payload kiểu defined hiện có vẫn hoạt động. |
| **generic** | Editor và hộp thoại cURL sử dụng JSON body tự do. Request body được truyền nguyên trạng để các ứng dụng bên ngoài có thể gửi dạng payload cố định của riêng họ. |

API thực thi vẫn tương thích ngược ở cả hai chế độ. Raw JSON và request wrapped `{ "inputs": ... }` vẫn được chấp nhận theo cả hai cách.

Headers và query params có sẵn trong các biểu thức dưới dạng `$input.headers` và `$input.query`. Các key của header được chuyển thành chữ thường.

## Xác thực

Cấu hình theo từng workflow trong editor (cài đặt workflow). Xác thực được kiểm tra trước khi thực thi.

| auth_type | Hành vi |
|-----------|----------|
| **anonymous** | Không yêu cầu xác thực. Bất kỳ ai cũng có thể gọi endpoint. |
| **jwt** | Yêu cầu Bearer token. Chấp nhận token phiên người dùng (người dùng phải có quyền truy cập workflow) hoặc [Execution Token](./execution-tokens.md) có phạm vi được tạo cho workflow này. |
| **header_auth** | Header tùy chỉnh phải khớp. Đặt `auth_header_key` (ví dụ: `X-API-Key`) và `auth_header_value`. |

Đối với `header_auth`, giá trị header của request phải khớp chính xác với giá trị đã cấu hình. Người dùng JWT có quyền truy cập workflow cũng có thể gọi mà không cần header tùy chỉnh.

Đối với `jwt`, [Execution Tokens](./execution-tokens.md) là cách được khuyến nghị để gọi workflow từ các hệ thống bên ngoài — chúng được giới hạn phạm vi cho một workflow duy nhất và có thể bị thu hồi độc lập.

## Response Caching

Cấu hình `cache_ttl_seconds` theo từng workflow. Khi được đặt và lớn hơn 0:

- **Cache key**: SHA256 hash của `workflow_id` + `body` + `query`
- **Cache hit**: Trả về ngay lập tức với `status: "cached"` và các output đã cache
- **Cache set**: Chỉ sau khi thực thi thành công (`status: "success"`)
- **Lưu trữ**: Dựa trên Postgres và được chia sẻ giữa các backend worker

| Cài đặt | Hiệu ứng |
|---------|--------|
| `cache_ttl_seconds` = 0 hoặc null | Tắt caching |
| `cache_ttl_seconds` > 0 | Phản hồi được cache trong số giây này |

Các request `test_run` bỏ qua cache (không đọc, không ghi).

Khi response caching được bật trong hộp thoại cURL, **Clear cache** sẽ xóa ngay các phản hồi đã cache của workflow hiện tại.

## Rate Limiting

Cấu hình theo từng workflow: `rate_limit_requests` và `rate_limit_window_seconds`.

- **Phạm vi**: Theo `workflow_id` + IP của client (sliding window)
- **Vượt quá**: HTTP 429 kèm header `Retry-After`
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Cài đặt | Mô tả |
|---------|-------------|
| `rate_limit_requests` | Số request tối đa được phép trong window |
| `rate_limit_window_seconds` | Thời lượng window tính bằng giây |

Các request `test_run` bỏ qua rate limiting.

## Định dạng phản hồi

Endpoint trả về JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Trường | Mô tả |
|-------|-------------|
| `workflow_id` | UUID của Workflow |
| `status` | `success`, `error`, `cached`, hoặc `rate_limited` |
| `outputs` | Đầu ra của các node đầu cuối. Khi chỉ có một [JSON output mapper](../nodes/json-output-mapper-node.md) là node đầu cuối duy nhất, phần thân phản hồi chính là đối tượng được ánh xạ đó ở cấp cao nhất (phản hồi JSON đơn giản mặc định). Ngược lại, bao gồm [Output](../nodes/output-node.md) và các node đầu cuối khác được đánh khóa theo nhãn. |
| `execution_time_ms` | Thời gian thực thi tính bằng mili giây (0 đối với cached/rate_limited) |

Khi xảy ra lỗi, `outputs` có thể chứa thông tin chi tiết lỗi. Node [Throw Error](../nodes/throw-error-node.md) có thể thiết lập mã trạng thái HTTP tùy chỉnh (4xx/5xx).

## Chạy với hộp thoại cURL

Nút thanh công cụ **Run with cURL** (ở góc trên bên phải của trình chỉnh sửa, biểu tượng `cURL`) mở một hộp thoại để tạo và sao chép lệnh cURL sẵn sàng chạy cho Workflow hiện tại.

### Chức năng

| Trường | Mô tả |
|-------|-------------|
| **Request Body Mode** | Chọn **Defined** hoặc **Generic**. Generic giữ nguyên phần thân dưới dạng JSON thô thay vì định hình từ các trường Input. |
| **Authentication** | Chọn Anonymous, JWT Token, hoặc Header Auth. Thiết lập header xác thực phù hợp trong lệnh. Khi chọn JWT Token, hộp thoại hiển thị trình quản lý [Execution Token](./execution-tokens.md) — tạo hoặc chọn một token để nhúng trực tiếp vào lệnh. |
| **Header Key / Value** | Hiển thị khi chọn Header Auth. Được điền sẵn từ cài đặt xác thực của Workflow. |
| **Response Cache** | Số phút lưu cache các phản hồi giống hệt nhau (0 = tắt). Các thay đổi được lưu vào Workflow. Khi bật, **Clear cache** sẽ xóa các phản hồi đã cache ngay lập tức. |
| **Rate Limit** | Số yêu cầu tối đa trong một khoảng thời gian. Các thay đổi được lưu vào Workflow. |
| **SSE Streaming** | Chuyển lệnh sang `/execute/stream`, thêm `--no-buffer`, và hiển thị cài đặt thông báo `node_start` cho từng node. |
| **Body** | Phần thân yêu cầu JSON. Ở chế độ Defined, nó được điền sẵn từ các trường [Input](../nodes/input-node.md) và giữ các khóa rỗng. Ở chế độ Generic, đây là trình chỉnh sửa JSON thô. |
| **Command** | Bản xem trước chỉ đọc của toàn bộ lệnh cURL. |

Nhấp **Copy cURL** để sao chép lệnh vào clipboard.

### Ví dụ

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Ở chế độ Generic, các payload lồng nhau được giữ nguyên, ví dụ:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Hộp thoại phản ánh các cài đặt xác thực, chế độ body, cache, và rate-limit được lưu trên Workflow — việc chỉnh sửa chúng tại đây sẽ cập nhật Workflow ngay lập tức.

### SSE Streaming trong hộp thoại

Bật **SSE Streaming** khi bạn muốn lệnh được tạo theo dõi quá trình thực thi theo thời gian thực từ terminal của mình.

- Endpoint thay đổi từ `/execute` thành `/execute/stream`
- Lệnh thêm `--no-buffer` và `Accept: text/event-stream`
- Mỗi node không phải sticky xuất hiện trong danh sách nơi bạn có thể:
  - bật hoặc tắt thông báo `node_start`
  - tùy chỉnh nội dung thông báo bắt đầu
- Các sự kiện `node_complete` luôn được phát ra và bao gồm đầu ra đầy đủ của node

Ví dụ:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Để biết giao thức sự kiện đầy đủ và các ví dụ, xem [SSE Streaming](./sse-streaming.md).

## Gắn thẻ nguồn Trigger

Mỗi lần thực thi lưu một nhãn `trigger_source` hiển thị trong [Execution History](./execution-history.md). Thiết lập nó bằng cách gửi header `X-Trigger-Source` với bất kỳ giá trị nào bạn chọn:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Nút **Copy cURL** trong hộp thoại trình chỉnh sửa tự động bao gồm `X-Trigger-Source: API`. Bạn có thể thay thế `API` bằng bất kỳ giá trị có ý nghĩa nào — `scheduler`, `rabbitmq`, `github-actions`, v.v.

Nếu header không được gửi, `trigger_source` mặc định là `"API"` và lần chạy được gắn nhãn **API** trong lịch sử. Ghi đè nó bằng bất kỳ giá trị nào có ý nghĩa với hệ thống của bạn — `scheduler`, `github-actions`, `rabbitmq`, v.v.

## Liên quan

- [Execution Tokens](./execution-tokens.md) – JWT có phạm vi để gọi Workflow từ các hệ thống bên ngoài
- [SSE Streaming](./sse-streaming.md) – Truyền sự kiện node theo thời gian thực qua Server-Sent Events
- [Triggers](./triggers.md) – Tất cả các điểm vào của Workflow bao gồm webhook
- [Workflow Structure](./workflow-structure.md) – Các node và cạnh
- [Expression DSL](./expression-dsl.md) – Truy cập `$input.body`, `$input.headers`, `$input.query`

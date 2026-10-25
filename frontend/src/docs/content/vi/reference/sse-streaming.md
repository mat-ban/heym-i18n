# SSE Streaming

Workflow có thể stream các sự kiện thực thi theo thời gian thực bằng Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Endpoint này sử dụng cùng quy tắc xác thực cấp workflow, giới hạn tần suất và bộ nhớ đệm phản hồi như endpoint execute tiêu chuẩn được ghi trong [Webhooks](./webhooks.md).

## Bật SSE trong hộp thoại cURL

Mở hộp thoại **Run with cURL** trong trình soạn thảo và bật **SSE Streaming**.

Khi được bật, Heym:

- chuyển lệnh được tạo từ `/execute` sang `/execute/stream`
- thêm `--no-buffer` để các sự kiện được stream hiển thị ngay lập tức trong đầu ra terminal
- thêm `Accept: text/event-stream`
- cho phép bạn cấu hình thông điệp `node_start` cho từng node trực tiếp trong hộp thoại

## Giao thức sự kiện

Mỗi khung SSE là JSON phân tách bằng dòng mới, có tiền tố `data: `.

| Loại sự kiện | Khi nào được phát | Các trường chính |
|------------|--------------------|------------|
| `queued` | Workflow đang ở [giới hạn đồng thời](./webhooks.md#concurrency-limit-and-queued-runs); được gửi lại bất cứ khi nào vị trí của lượt chạy thay đổi | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Ngay sau khi yêu cầu được chấp nhận, hoặc khi lượt chạy trong hàng đợi bắt đầu | `execution_id`, `server_now_ms` |
| `node_start` | Ngay trước khi một node bắt đầu thực thi | `node_id`, `node_label`, `started_at_ms`, `message` tùy chọn |
| `node_retry` | Khi một node thử lại | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Sau khi một node hoàn thành | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Khi một node Output trả về sớm | `node_label`, `output` |
| `execution_complete` | Sau khi workflow kết thúc | `status`, `outputs`, `execution_time_ms` |

### Các lượt chạy trong hàng đợi

Khi workflow ở giới hạn đồng thời, luồng sẽ tiếp tục mở và gửi các sự kiện `queued` trong khi lượt chạy đang chờ. Lượt chạy trong hàng đợi thực thi trong background worker, có thể trong một quy trình khác, do đó luồng của nó mang `execution_started` khi lượt chạy bắt đầu và `execution_complete` khi kết thúc, nhưng không có sự kiện `node_start`, `node_complete` hoặc sự kiện token nào ở giữa. `execution_complete` của nó có `node_results` trống; hãy mở lượt chạy trong [Lịch sử thực thi](./execution-history.md) để biết chi tiết về node. Việc đóng kết nối không hủy lượt chạy trong hàng đợi. Khi hàng đợi đầy, yêu cầu sẽ được trả lời `429` trước khi luồng mở.

## Thông điệp bắt đầu cho từng node

Hộp thoại cURL lưu cài đặt SSE trên chính workflow:

- **Send start** kiểm soát việc sự kiện `node_start` có bao gồm `message` hay không
- **Start message** mặc định là `[START] {nodeLabel}`
- xóa thông điệp tùy chỉnh sẽ quay về văn bản mặc định
- `node_complete` luôn được phát và luôn bao gồm output của node

Ví dụ cấu hình được lưu:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Ví dụ cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Luồng sự kiện mẫu:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Lưu ý bảo mật

- các workflow `anonymous`, `jwt` và `header_auth` hoạt động giống như endpoint webhook thông thường
- bộ nhớ đệm phản hồi vẫn được áp dụng khi `cache_ttl_seconds` được cấu hình
- giới hạn tần suất của workflow vẫn được áp dụng khi `rate_limit_requests` và `rate_limit_window_seconds` được cấu hình
- `test_run` bỏ qua cả bộ nhớ đệm và giới hạn tần suất, giống như cách nó làm với `/execute`

## Liên quan

- [Webhooks](./webhooks.md) – Endpoint execute tiêu chuẩn và hộp thoại cURL
- [Parallel Execution](./parallel-execution.md) – Cách streaming khớp vào bộ lập lịch DAG của Heym
- [Canvas Features](./canvas-features.md) – Các điều khiển trong trình soạn thảo bao gồm Run with cURL
- [Security](./security.md) – Xác thực và xử lý secret

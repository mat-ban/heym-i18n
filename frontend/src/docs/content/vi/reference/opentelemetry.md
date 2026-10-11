# OpenTelemetry Tracing

Heym có thể phát [OpenTelemetry](https://opentelemetry.io/) traces cho mỗi lần chạy workflow, mỗi lần thực thi node và mỗi lần gọi Agent tool. Mỗi lần chạy tạo ra một root span với các child span cho từng node và Agent tool, nhờ đó bạn có thể thấy bước nào đã thất bại, mất bao lâu, đã gọi cái gì và nhận lại kết quả gì. Các span được xuất qua OTLP/HTTP đến bất kỳ backend tương thích nào như Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic hoặc Grafana Cloud.

Tracing **mặc định bị tắt**. Khi tắt, không có overhead đáng kể và không có span nào được tạo.

## Bật Tracing

Đặt các biến môi trường sau trên backend, sau đó khởi động lại:

Để xem danh sách đầy đủ các biến môi trường, hãy tham khảo [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Biến | Mặc định | Mô tả |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Công tắc chính. Đặt thành `true` để bật tracing. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint cơ sở OTLP/HTTP, ví dụ `http://collector:4318`. Heym gửi span đến `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Các header `key=value` phân tách bằng dấu phẩy dùng cho xác thực exporter, ví dụ `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Thuộc tính tài nguyên `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Tỷ lệ lấy mẫu head sampling trong khoảng `0.0` đến `1.0`, được áp dụng với parent-based sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Khi `true`, đính kèm payload đầu vào và đầu ra của node (đã cắt ngắn) vào node span. Mặc định tắt để bảo vệ quyền riêng tư. |

Ví dụ tối thiểu:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Bạn có thể xác nhận cấu hình đang hoạt động trong ứng dụng tại **Settings → Observability** (mở từ avatar của bạn ở thanh header). Bảng điều khiển đó chỉ cho đọc và không bao giờ hiển thị các secret của exporter.

## Những gì được trace

### Workflow root span

Tên: `heym.workflow.execute`

| Thuộc tính | Mô tả |
|-----------|-------------|
| `heym.workflow.id` | UUID của workflow. |
| `heym.node.count` | Số lượng node trong workflow. |
| `heym.workflow.test_mode` | `true` đối với các lần chạy thử nghiệm. |
| `heym.sub_workflow.depth` | Độ sâu lồng nhau khi được gọi như một sub-workflow. |
| `heym.workflow.status` | Trạng thái cuối cùng của lần chạy. Một lần chạy thất bại sẽ đặt trạng thái span thành `ERROR`. |

### Node span

Tên: `heym.node.execute`, được tạo như con của workflow span.

| Thuộc tính | Mô tả |
|-----------|-------------|
| `heym.node.id` | Id của node. |
| `heym.node.type` | Loại node, ví dụ `agent`, `llm`, `http`. |
| `heym.node.label` | Nhãn node hiển thị trên canvas. |
| `heym.node.status` | `success` hoặc `error`. Lỗi sẽ đặt trạng thái span thành `ERROR`. |
| `heym.node.duration_ms` | Thời gian thực thi node tính bằng mili giây. |
| `heym.llm.model` | Tên model đối với các node LLM và agent, khi có sẵn. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Lượng token sử dụng cho các node LLM và agent, khi có sẵn. |

Các node span lồng đúng vào workflow span ngay cả khi các node chạy song song, vì ngữ cảnh workflow được truyền vào các worker thread.

### Agent tool span

Tên: `heym.agent.tool.execute`, được tạo dưới Agent node span đang hoạt động.

| Thuộc tính | Mô tả |
|-----------|-------------|
| `heym.agent.tool.name` | Tên tool do model chọn. |
| `heym.agent.tool.call_id` | Id tool-call của nhà cung cấp, khi có sẵn. |
| `heym.agent.tool.source` | Nguồn tool như `node_tool`, `mcp`, `skill` hoặc `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Nhãn MCP server, khi áp dụng. |
| `heym.agent.tool.iteration` | Vòng lặp tool-loop của Agent. |
| `heym.agent.tool.args_bytes` | Kích thước UTF-8 của các đối số tool đã tuần tự hóa. |
| `heym.agent.tool.result_bytes` | Kích thước UTF-8 của kết quả tool đã tuần tự hóa. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` hoặc `cancelled`. Lỗi tool sẽ đặt trạng thái span thành `ERROR`. |

Các đối số và kết quả tool thô không được đính kèm vào span theo mặc định.

## An toàn payload của Agent tool

Các payload observability của Agent được lưu trữ sẽ được che giấu và cắt ngắn trong code (`4096` ký tự mỗi chuỗi, độ sâu `6`, tổng `32768` ký tự mỗi lần ghi LLM trace). Ngân sách trace tổng được chia đều cho các bản ghi tool để một kết quả lớn xuất hiện sớm không thể che khuất danh tính và trạng thái vòng đời của các lần gọi sau. Metadata tải xuống `_generated_files` có giới hạn được dành riêng tách biệt khỏi đầu ra skill cồng kềnh:

- Các phần tool trong `request` / `response` của LLM trace, bao gồm các bản sao `_hitl_pending` được ghi vào trace store
- Các bản ghi `tool_calls` trong kết quả Agent hiển thị trong lịch sử thực thi
- Các sự kiện tool-result trong bảng Live Debug, sử dụng lại cùng bản ghi đã được làm sạch và giới hạn

Việc thực thi tool trực tiếp, các tool message gắn với model và trạng thái HITL resume trong bộ nhớ (`_hitl_pending.agent_state.messages` / `tool_arguments`) giữ nguyên giá trị gốc để việc resume và khớp đối số chính xác vẫn hoạt động. Chỉ các bản sao observability được lưu trữ mới được làm sạch.

## Truyền bá Trace Context

Heym tuân theo tiêu chuẩn [W3C Trace Context](https://www.w3.org/TR/trace-context/) để các trace luôn được kết nối xuyên qua các ranh giới dịch vụ.

- **Webhook đến:** khi một yêu cầu gửi đến mang theo header `traceparent`, lượt chạy workflow được ghi nhận như một phần tử con của trace đó. Điều này liên kết các lượt chạy của Heym với hệ thống thượng nguồn đã kích hoạt chúng.
- **HTTP gửi đi:** node HTTP chèn `traceparent` vào các yêu cầu mà nó thực hiện, để các dịch vụ hạ nguồn có thể tiếp tục cùng một trace.
- **Sub-workflow:** một lượt chạy sub-workflow được đặt làm con của node đã gọi nó, bảo toàn thứ bậc gọi trong một trace.

Các Trigger không có context đến (chẳng hạn như Cron, IMAP, RabbitMQ và WebSocket) sẽ bắt đầu một trace mới cho mỗi lượt chạy.

## Độ tin cậy

- Một collector chậm hoặc không thể kết nối sẽ không bao giờ chặn việc thực thi workflow. Các span được gom theo lô và xuất đi trong nền.
- Nếu việc khởi tạo tracing thất bại (ví dụ, một endpoint không hợp lệ), backend sẽ ghi log lỗi và tiếp tục với tracing bị vô hiệu hóa thay vì không thể khởi động.
- Các header xác thực OTLP chỉ được đọc từ biến môi trường. Chúng không bao giờ được lưu trong cơ sở dữ liệu và không bao giờ được trả về bởi API trạng thái.

## Liên quan

- [Cài đặt](./user-settings.md) – Tab Observability hiển thị trạng thái tracing
- [Biến môi trường](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tài liệu tham chiếu cấu hình đầy đủ
- [Triggers](./triggers.md) – Cách workflow khởi động, bao gồm cả webhook
- [Lịch sử thực thi](./execution-history.md) – Chế độ xem lịch sử theo từng lượt chạy tích hợp sẵn của Heym
- [HTTP](../nodes/http-node.md) – Node truyền bá trace context đến các cuộc gọi hạ nguồn

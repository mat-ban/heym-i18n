# Tab Traces

Tab **Traces** hiển thị các trace thực thi LLM. Kiểm tra request/response payload, thời gian, tool call và gỡ lỗi hành vi của node [Agent](../nodes/agent-node.md) và [LLM](../reference/node-types.md), cùng với các chỉ số tổng hợp (calls, tokens, cost, latency, error rate) trong bất kỳ khoảng thời gian nào.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Xem demo Traces</a></p>

## Stats Header

Trang mở đầu bằng phần tóm tắt số liệu phía trên danh sách trace, được tính toán trong khoảng thời gian đã chọn và các bộ lọc đang áp dụng khác:

- **Thẻ KPI** – Total Calls, Total Tokens, Total Cost (USD), Avg Latency, Error %
- **Tokens by Model** – Biểu đồ donut thể hiện khối lượng token theo từng model
- **Cost by Model** – Biểu đồ donut thể hiện chi phí USD theo từng model. Các model không có pricing sẽ hiển thị liên kết "Configure pricing" dẫn đến [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)
- **Calls Over Time** – Biểu đồ vùng xếp chồng thể hiện các call thành công so với thất bại theo từng khoảng (5 phút / 1 giờ / 6 giờ / 1 ngày, được chọn tự động theo khoảng thời gian)
- **Thông báo model chưa có pricing** – Xuất hiện bên dưới các biểu đồ khi một số model được trace không có dòng pricing, kèm liên kết đến LLM Cost Table

## Time Range

Một bộ chọn **Time range** duy nhất ở đầu thanh lọc điều khiển cả stats header và danh sách trace. Các lựa chọn: Last 1 hour, Last 24 hours, Last 7 days (mặc định), Last 30 days, All time. Thay đổi khoảng thời gian sẽ đặt lại phân trang và tải lại cả biểu đồ lẫn danh sách cùng lúc.

## Trace List

- Danh sách phân trang các trace gần đây trong khoảng thời gian đã chọn
- Mỗi trace hiển thị: workflow, node, credential, timestamp, duration
- Nhấp vào một trace để mở chế độ xem chi tiết
- Dùng **Prev / Next** bên trong hộp thoại chi tiết để di chuyển giữa các trace mà không cần đóng hộp thoại

## Filtering

- **Time range** – 1h / 24h / 7d / 30d / All; lọc cả biểu đồ và danh sách cùng lúc
- **Credential** – Lọc theo credential (API key) đã sử dụng
- **Source** – Lọc theo workflow hoặc nguồn thực thi
- **Search** – Tìm kiếm theo model, workflow, credential hoặc nhãn node
- **Refresh** – Tải lại trang trace hiện tại

## Trace Detail

Khi bạn mở một trace:

- **Steps** – Dòng thời gian từ trên xuống dưới đọc trace như một chuỗi có thứ tự: System → User → Assistant → Tool → Answer. Mỗi bước có thể thu gọn; khi mở rộng sẽ hiển thị chi tiết dễ đọc (nội dung tin nhắn, hoặc đối số và kết quả của tool) theo sau là JSON của bước đó. Nội dung JSON trong mọi loại event—bao gồm cả MCP call và JSON-RPC payload—mặc định mở ở dạng cây có thể mở rộng, với cấp đầu tiên được mở sẵn. Dùng **Tree / Raw** để chuyển đổi giữa cấu trúc đã định dạng và văn bản gốc. JSON không hợp lệ vẫn hiển thị dưới dạng văn bản thuần. Các bước Tool hiển thị thời gian của chúng và badge MCP/Skill khi có, cùng với các badge pending / timeout / cancelled khi trạng thái tool-call được thiết lập. Bước Answer có thể hiển thị các badge `tool_metrics` tổng hợp (số lượng call theo trạng thái và tổng thời gian tool). Khi một trace ghi lại từng model call, như một tin nhắn Dashboard Chat và một agent được định tuyến thực hiện, một bước **LLM** sẽ nằm trước các tool mà call đó yêu cầu, và **Duration Breakdown** trình bày mọi model call, tool và quyết định định tuyến trên một dòng thời gian. Một tin nhắn Dashboard Chat là một trace duy nhất, bất kể đã trải qua bao nhiêu vòng tool. Các trace không có chuỗi tin nhắn (ví dụ tạo ảnh) sẽ hiển thị dòng thời gian tối giản Request → Response.
- **Request** – Toàn bộ request payload gửi đến LLM, với chế độ xem JSON **Tree / Raw**
- **Response** – Phản hồi của model, bao gồm cả tool call nếu có, với chế độ xem JSON **Tree / Raw**
- **Tool metrics** – Khi có trong response, phần tóm tắt ngắn gọn về số lượng tool call (`success` / `error` / `pending` / `timeout` / `cancelled`) và tổng thời gian tool
- **Timing breakdown** – `llm_ms`, `tools_ms`, `mcp_list_ms` để phân tích hiệu năng
- **Tool calls** – Tên tool, đối số, kết quả, trạng thái và thời gian đã trôi qua
- **Skills included** – Các Skill được truyền đến model trong request
- **Go to Workflow** – Chuyển trực tiếp đến workflow liên quan từ hộp thoại chi tiết trace

## Copy and Export

- Sao chép request hoặc response JSON vào clipboard; thao tác sao chép luôn dùng toàn bộ raw payload bất kể chế độ xem đang hoạt động
- Dùng để gỡ lỗi hoặc chia sẻ với bộ phận hỗ trợ

## Maintenance

- **Clear All** – Xóa tất cả trace đã lưu sau khi xác nhận
- Các điều khiển phân trang hiển thị khoảng hiện tại đang xem (ví dụ `1-25 of 240`)

## Related

- [Why Heym](../getting-started/why-heym.md) – Khả năng quan sát LLM xuyên suốt vòng đời agent
- [Agent Node](../nodes/agent-node.md) – Node Agent với tool calling
- [Node Types](../reference/node-types.md) – Các node LLM và Agent
- [Credentials Tab](./credentials-tab.md) – Các credential được sử dụng trong trace
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Xuất OTel tùy chọn cho các span workflow, node và Agent tool
- [DataTable Tab](./datatable-tab.md) – Chứa LLM Cost Table được biểu đồ chi phí sử dụng
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang ngắn gọn cho các bề mặt dashboard

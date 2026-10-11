# Thực thi song song

Heym chạy các node song song khi chúng không có phụ thuộc lẫn nhau, và cho phép nhiều lượt chạy workflow thực thi đồng thời.

## Trong một lượt chạy đơn lẻ

### Lập lịch dựa trên DAG

Bộ thực thi nhóm các node theo **cấp thực thi** bằng đồ thị có hướng không chu trình (DAG):

1. **Cấp 0** – Các node không có cạnh vào (node bắt đầu)
2. **Cấp N** – Các node mà mọi phụ thuộc thượng nguồn đều nằm trong cấp 0..N-1

Các node trong cùng một cấp không có phụ thuộc lẫn nhau và chạy song song.

### Thread Pool

- **Pool dùng chung**: `ThreadPoolExecutor(max_workers=8)` cho việc thực thi node
- **Lập lịch**: `wait(..., return_when=FIRST_COMPLETED)` – ngay khi bất kỳ node nào hoàn thành, các node hạ nguồn được lập lịch
- **An toàn luồng**: Đầu ra của node được lưu với một lock (`store_node_output`)

### Sub-Agent của Orchestrator

Khi một orchestrator agent trả về nhiều lệnh gọi công cụ `call_sub_agent` trong một lượt, chúng chạy song song. Xem [Kiến trúc Agent](./agent-architecture.md).

### Node Merge

Node [Merge](../nodes/merge-node.md) kết hợp đầu ra từ nhiều nhánh song song. Sử dụng nó khi bạn thực sự cần kết hợp các kết quả; nếu không, các nhánh song song có thể kết thúc ở các node đầu ra riêng biệt.

### Vòng lặp

Các lần lặp của vòng lặp chạy **tuần tự**. Các node trong thân vòng lặp được lập lịch lại theo từng lần lặp.

### Trả về sớm

Các node đầu ra có `allowDownstream` có thể trả về sớm. Công việc hạ nguồn còn lại chạy ở chế độ nền.

## Các lượt chạy workflow đồng thời

- **Không có lock theo từng workflow** – Nhiều yêu cầu có thể chạy cùng một workflow tại cùng thời điểm
- **API bất đồng bộ** – Các endpoint FastAPI sử dụng `asyncio.to_thread(execute_workflow)` để event loop luôn phản hồi nhanh
- **Cô lập** – Mỗi lượt chạy có instance `WorkflowExecutor` và trạng thái riêng

Các Trigger chạy workflow ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) đều gọi `execute_workflow` một cách độc lập.

## Streaming

Streaming sử dụng cùng mô hình song song nhưng phát ra các sự kiện khi các node hoàn thành. Editor và giao diện chat của portal sử dụng streaming nội bộ để hiển thị tiến độ theo thời gian thực, và người dùng webhook giờ đây có thể chọn tham gia cùng luồng sự kiện thông qua endpoint thực thi [SSE Streaming](./sse-streaming.md).

## Liên quan

- [Vì sao chọn Heym](../getting-started/why-heym.md) – Thực thi DAG song song trong runtime của Heym
- [Cấu trúc Workflow](./workflow-structure.md) – Các node, cạnh và luồng thực thi
- [Khái niệm cốt lõi](../getting-started/core-concepts.md) – Tổng quan về luồng thực thi
- [Các loại Node](./node-types.md) – Node [Merge](../nodes/merge-node.md) và các loại khác
- [Triggers](./triggers.md) – Các điểm vào kích hoạt lượt chạy
- [SSE Streaming](./sse-streaming.md) – Định dạng luồng sự kiện cho `/execute/stream`

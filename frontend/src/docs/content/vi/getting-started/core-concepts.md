# Các khái niệm cốt lõi

## Workflow

Workflow là một đồ thị có hướng gồm các [**node**](../reference/node-types.md) được kết nối bởi các **edge**. Quản lý workflow trong tab [Workflows](../tabs/workflows-tab.md). Tổ chức chúng trong các [thư mục](../reference/workflow-organization.md). Quá trình thực thi diễn ra từ các [trigger node](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) qua các node xử lý đến các node [output](../nodes/output-node.md). Xem [Cấu trúc Workflow](../reference/workflow-structure.md) để biết định dạng JSON. Lưu và chia sẻ workflow dưới dạng [Template](../tabs/templates-tab.md) để tái sử dụng chúng giữa các dự án. Workflow cũng có thể chạy từ [Board](../tabs/board-tab.md), nơi các thẻ kanban kích hoạt chuỗi workflow của một cột với toàn bộ ngữ cảnh của thẻ.

## Node

Mỗi node có:

- **Type** – Xác định hành vi (ví dụ: `llm`, `condition`, `http`)
- **Data** – Cấu hình (model, prompt, URL, v.v.)
- **Inputs/Outputs** – Các handle để kết nối với các node khác

Xem [Các loại Node](../reference/node-types.md) để biết danh sách đầy đủ.

## Edge

Edge kết nối output handle của node nguồn với input handle của node đích. Dữ liệu chảy dọc theo các edge trong quá trình thực thi.

## Luồng thực thi

1. **Trigger** – Node Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger hoặc [WebSocket Trigger](../nodes/websocket-trigger-node.md) bắt đầu quá trình thực thi (xem [Triggers](../reference/triggers.md))
2. **Downstream** – Mỗi node nhận output từ các node upstream được kết nối; [thực thi song song](../reference/parallel-execution.md) chạy các node độc lập đồng thời
3. **Expression** – Các node tham chiếu dữ liệu upstream thông qua `$nodeLabel.field`. Xem [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Node [Output](../nodes/output-node.md) tạo ra kết quả cuối cùng

## Tham chiếu Expression

Sử dụng `$input` cho dữ liệu của node Input và `$nodeLabel.field` cho bất kỳ node upstream nào. Ví dụ: `$llm.text` tham chiếu đến trường `text` từ một node có nhãn "llm". Cú pháp đầy đủ: [Expression DSL](../reference/expression-dsl.md). Sử dụng [Hộp thoại đánh giá Expression](../reference/expression-evaluation-dialog.md) để có trình chỉnh sửa lớn hơn với bản xem trước backend trực tiếp khi chỉnh sửa expression.

## Liên quan

- [Bắt đầu nhanh](./quick-start.md) – Xây dựng workflow đầu tiên của bạn
- [Tính năng Canvas](../reference/canvas-features.md) – Data pin, nhật ký thực thi, bật/tắt, trích xuất thành sub-workflow
- [Trợ lý AI](../reference/ai-assistant.md) – Tạo workflow bằng ngôn ngữ tự nhiên
- [Các loại Node](../reference/node-types.md) – Tất cả các node có sẵn
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu dữ liệu trong expression
- [Hộp thoại đánh giá Expression](../reference/expression-evaluation-dialog.md) – Trình chỉnh sửa mở rộng với bản xem trước backend trực tiếp
- [Tab Workflows](../tabs/workflows-tab.md) – Quản lý workflow và thư mục
- [Tổ chức Workflow](../reference/workflow-organization.md) – Thư mục và xóa theo lịch
- [Triggers](../reference/triggers.md) – Điểm vào cho workflow
- [Webhooks](../reference/webhooks.md) – Trigger webhook HTTP (TTL, cache, rate limit)
- [Thực thi song song](../reference/parallel-execution.md) – Cách các node chạy song song

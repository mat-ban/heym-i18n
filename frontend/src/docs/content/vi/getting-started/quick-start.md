# Bắt đầu nhanh

Khởi chạy workflow Heym đầu tiên của bạn trong vài phút.

Chưa chạy Heym? Xem [Chạy & Triển khai](./running-and-deployment.md), hoặc theo dõi video hướng dẫn: [Thiết lập Heym cục bộ trong chưa đầy 2 phút](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Tạo một Workflow

1. Đi đến tab [Workflows](../tabs/workflows-tab.md)
2. Nhấp vào **New Workflow**
3. Đặt tên cho workflow của bạn (ví dụ: "Hello World")

## 2. Thêm Nodes

1. Mở bảng **Nodes** ở bên trái
2. Kéo một node [Input](../nodes/input-node.md) vào canvas
3. Kéo một node [LLM](../nodes/llm-node.md) và kết nối nó với Input
4. Kéo một node [Output](../nodes/output-node.md) và kết nối nó với LLM

```
[Input] --> [LLM] --> [Output]
```

Xem [Node Types](../reference/node-types.md) để biết tất cả các node có sẵn.

## 3. Cấu hình

- **Input**: Đặt giá trị mặc định hoặc để trống cho người dùng nhập (xem [Input Node](../nodes/input-node.md))
- **LLM**: Chọn một [credential](../tabs/credentials-tab.md) và model, thêm system instruction, và đặt `userMessage` thành `$input.text` (xem [LLM Node](../nodes/llm-node.md))
- **Output**: Đặt `message` thành `$llm.text` để truyền phản hồi từ LLM (xem [Output Node](../nodes/output-node.md))

Sử dụng cú pháp [Expression DSL](../reference/expression-dsl.md) cho `$input.text` và `$llm.text`. Nhấp vào nút mở rộng trên các trường biểu thức để mở [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) với bản xem trước backend trực tiếp.

## 4. Chạy

Nhấp vào **Run**, nhấn `Ctrl + Enter`, hoặc sử dụng bảng debug để thực thi. Workflow chạy từ node Input qua các node được kết nối đến Output. Xem [Triggers](../reference/triggers.md) để biết các cách khác để chạy workflow ([webhook](../reference/webhooks.md), portal, cron, v.v.).

Xem các lần chạy trước trong **History** (thanh công cụ) và sử dụng **Bring to Canvas** để chạy lại với cùng các input.

Trên Docs, Evals và các trang nội bộ khác không phải canvas, bạn cũng có thể sử dụng [Quick Drawer](../reference/quick-drawer.md) để chọn một workflow đã ghim và chạy nó mà không cần quay lại editor.

Nếu bạn đang đọc tài liệu và muốn được giải thích rõ trước khi xây dựng, hãy mở [Chat with Heym](../reference/chat-with-heym.md) từ tiêu đề Docs để đặt câu hỏi theo ngữ cảnh trang.

Ngoài ra, hãy sử dụng [AI Assistant](../reference/ai-assistant.md) từ bảng Debug để tạo workflow bằng ngôn ngữ tự nhiên—mô tả những gì bạn muốn và AI sẽ tạo các node và edge.

Đang xây dựng automation trong công cụ khác? [Migrate to Heym](./migrate-to-heym.md) chuyển đổi workflow từ n8n, Flowise, Dify, Langflow, sim.ai hoặc Activepieces thành workflow Heym mà bạn có thể import.

## Liên quan

- [Core Concepts](./core-concepts.md) – Workflows, nodes và luồng thực thi
- [Migrate to Heym](./migrate-to-heym.md) – Chuyển đổi workflow từ n8n, Flowise, Dify, Langflow, sim.ai hoặc Activepieces sang Heym bằng AI
- [Running & Deployment](./running-and-deployment.md) – Khởi chạy cục bộ với `run.sh` hoặc triển khai với `deploy.sh`
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Tham chiếu cấu hình đầy đủ
- [Settings](../reference/user-settings.md) – Cấu hình tên, User Rules và mật khẩu
- [Canvas Features](../reference/canvas-features.md) – Data pin, execution logs, bật/tắt, trích xuất thành sub-workflow
- [Keyboard Shortcuts](../reference/keyboard-shortcuts.md) – Phím tắt canvas và editor
- [Expression DSL](../reference/expression-dsl.md) – Tham chiếu dữ liệu trong cấu hình node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor mở rộng với bản xem trước backend trực tiếp
- [Triggers](../reference/triggers.md) – Tất cả các điểm vào của workflow ([webhook](../reference/webhooks.md), portal, cron, v.v.)
- [Execution History](../reference/execution-history.md) – Xem các lần chạy trước và Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Chạy các workflow đã ghim từ các trang không phải canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Đặt câu hỏi theo ngữ cảnh từ tiêu đề docs
- [Workflows Tab](../tabs/workflows-tab.md) – Tạo và quản lý workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm API keys cho các node LLM
- [AI Assistant](../reference/ai-assistant.md) – Tạo workflow bằng ngôn ngữ tự nhiên

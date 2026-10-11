# Giới thiệu

**Xây dựng hệ thống agentic. Vận hành chúng một cách tự tin.**

Heym là hạ tầng để vận hành và quản trị các AI agent trong môi trường production. Điều phối các agent, tự động hóa quy trình nghiệp vụ, kiểm tra mọi lần thực thi và giữ con người trong tầm kiểm soát. Triển khai Heym trên hạ tầng của chính bạn.

Trong Heym, một workflow định nghĩa cách các agent, các bước tất định (deterministic steps), công cụ và dữ liệu phối hợp với nhau. Runtime thực thi đồ thị đó, ghi lại mọi lần chạy và tạm dừng để con người xem xét tại những điểm bạn chỉ định. Canvas trực quan là nơi bạn xây dựng và kiểm tra workflow, đồng thời các workflow này cũng có thể chạy từ API, lịch trình, event trigger, MCP client và chat trên Portal. Truy cập [heym.run](https://heym.run) để xem trang sản phẩm, và xem [Why Heym](./why-heym.md) để biết Heym xử lý những gì ở từng giai đoạn của vòng đời agent.

## Những gì bạn có thể làm

- **Xây dựng** – Kết hợp các agent và bước tất định trên [canvas](../reference/canvas-features.md) trong tab [Workflows](../tabs/workflows-tab.md), mô tả chúng cho [AI Assistant](../reference/ai-assistant.md), hoặc bắt đầu từ [Templates](../tabs/templates-tab.md)
- **Điều phối** – Phối hợp các node [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) và [RAG](../nodes/rag-node.md), [sub-agent](../reference/agent-architecture.md), công cụ MCP và các [tích hợp](../reference/integrations.md) như HTTP, Slack và email, với [thực thi song song](../reference/parallel-execution.md) khi các phụ thuộc cho phép
- **Chạy** – Khởi động workflow từ [webhook](../reference/webhooks.md), lịch [Cron](../nodes/cron-node.md) và event [trigger](../reference/triggers.md), với cơ chế retry theo từng node, [xử lý lỗi](../nodes/error-handler-node.md) và [phân phối tải](../reference/cluster.md) giữa các instance
- **Quan sát** – Kiểm tra [lịch sử thực thi](../reference/execution-history.md), [LLM trace](../tabs/traces-tab.md) kèm chi phí token, [analytics](../tabs/analytics-tab.md) và [cảnh báo](../tabs/alerts-tab.md), đồng thời xuất trace [OpenTelemetry](../reference/opentelemetry.md)
- **Đánh giá** – Kiểm thử prompt và model dựa trên kết quả mong đợi trong tab [Evals](../tabs/evals-tab.md)
- **Kiểm soát** – Tạm dừng agent để [con người xem xét](../reference/human-in-the-loop.md), chặn nội dung không an toàn bằng [guardrails](../reference/guardrails.md), và quản lý quyền truy cập bằng [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md) và [audit trail](../reference/audit.md)
- **Công khai** – Cung cấp workflow qua REST và [SSE streaming](../reference/sse-streaming.md), dưới dạng công cụ [MCP](../tabs/mcp-tab.md), và dưới dạng giao diện chat [Portal](../reference/portal.md) cho người dùng cuối; dùng tab [Chat](../tabs/chat-tab.md) để kiểm thử model trực tiếp
- **Chat với Heym** – Đặt câu hỏi về sản phẩm có nhận biết ngữ cảnh trang từ hộp thoại [Chat with Heym](../reference/chat-with-heym.md) trong tài liệu

## Các khái niệm chính

- **Workflows** – Một đồ thị có hướng gồm các node và edge. Quản lý chúng trong tab [Workflows](../tabs/workflows-tab.md). Xem [Workflow Structure](../reference/workflow-structure.md).
- **Nodes** – Các đơn vị xử lý ([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), v.v.). Xem [Node Types](../reference/node-types.md).
- **Edges** – Các kết nối định nghĩa luồng thực thi
- **Credentials** – API key và secret được lưu trong tab [Credentials](../tabs/credentials-tab.md), được các node tham chiếu.
- **Variables** – Dữ liệu key-value lâu dài trong tab [Variables](../tabs/global-variables-tab.md), truy cập qua `$global.variableName`. Xem [Global Variables](../reference/global-variables.md).
- **Expressions** – Tham chiếu dữ liệu thượng nguồn bằng `$input` và `$nodeName.field`. Xem [Expression DSL](../reference/expression-dsl.md).

## Liên quan

- [Why Heym](./why-heym.md) – Heym xử lý những gì ở từng giai đoạn của vòng đời agent
- [Quick Start](./quick-start.md) – Xây dựng workflow đầu tiên của bạn
- [Running & Deployment](./running-and-deployment.md) – Khởi chạy cục bộ với `run.sh` hoặc triển khai với `deploy.sh`
- [AI Assistant](../reference/ai-assistant.md) – Tạo workflow bằng ngôn ngữ tự nhiên
- [Chat with Heym](../reference/chat-with-heym.md) – Đặt câu hỏi tiếp theo trong khi đọc tài liệu
- [Core Concepts](./core-concepts.md) – Workflow, node và luồng thực thi
- [Workflows Tab](../tabs/workflows-tab.md) – Quản lý workflow và thư mục
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm API key cho các node

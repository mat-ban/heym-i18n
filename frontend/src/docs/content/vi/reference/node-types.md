# Các loại Node

Heym cung cấp nhiều loại node khác nhau để xây dựng workflow. Sử dụng [biểu thức](./expression-dsl.md) như `$input.text` và `$nodeLabel.field` trong cấu hình node.

## Node Trigger

| Node | Mô tả | Đầu ra |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Điểm nhập văn bản cho workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger theo lịch trình (biểu thức cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger khi có bản cập nhật webhook từ bot Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger khi Slack gửi webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger khi Discord gửi webhook tương tác ứng dụng | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger khi có email mới đến hộp thư IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger khi Heym phát hành sự kiện nền tảng (mảng theo lô) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger từ kết nối ra ngoài đến máy chủ WebSocket bên ngoài | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Tạo liên kết tải lên dùng một lần và bắt đầu khi tệp lớn được tải lên | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger khi nhận được tin nhắn từ hàng đợi | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Chạy khi bất kỳ node nào gặp lỗi (không có cạnh đầu vào) | 1 |

Xem [Triggers](./triggers.md) để biết tất cả các điểm nhập.

## Node AI

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Xử lý văn bản bằng mô hình ngôn ngữ | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Đặt câu hỏi có định kiểu cho mô hình quyết định và phân nhánh dựa trên xác suất trả về | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM với gọi công cụ, kỹ năng, MCP, [đánh giá của con người](./human-in-the-loop.md) tùy chọn, và [đồ thị bộ nhớ liên tục](./agent-persistent-memory.md) tùy chọn. Xem [Agent Architecture](./agent-architecture.md). | 1 | 1, cộng với đầu ra `review` tùy chọn |
| [Codex](../nodes/codex-node.md) | Chạy Codex CLI cục bộ trên kho GitHub bằng token truy cập ChatGPT/Codex | 1 | 1, cộng với đầu ra `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Chạy OpenCode CLI trên kho GitHub trong container được gia cố bằng API key của cổng OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Gọi trực tiếp một công cụ MCP cụ thể mà không cần LLM chọn | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Chèn, upsert, xóa hoặc tìm kiếm (vector hoặc kết hợp vector + BM25) trong [vector store](../tabs/vectorstores-tab.md) Qdrant hoặc Postgres (pgvector) cho RAG | 1 | 1 |

## Node Logic

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Phân nhánh dựa trên if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Định tuyến bằng cách khớp giá trị với các trường hợp | 1 | n |
| [Merge](../nodes/merge-node.md) | Chờ nhiều đầu vào và hợp nhất | n | 1 |
| [Loop](../nodes/loop-node.md) | Lặp qua một mảng | 1 | 2 (loop/done) |

## Node Dữ liệu

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Chuyển đổi và ánh xạ dữ liệu | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Chuyển đổi dữ liệu giữa các định dạng (CSV, JSON, XML) và OCR hình ảnh hoặc PDF thành văn bản | 1 | 1 |
| [Code](../nodes/code-node.md) | Chạy Python trong sandbox dùng một lần, cách ly mạng với requirements.txt riêng | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Đặt hoặc lấy một biến (cục bộ trong workflow hoặc [toàn cục](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Gọi một workflow khác | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Đọc các workflow Heym và lịch sử thực thi | 1 | 1 |

## Các Node Tích hợp

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Thực hiện các yêu cầu HTTP (cURL) | 0 hoặc 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Kết nối đến WebSocket bên ngoài và gửi một tin nhắn | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Gửi tin nhắn bot Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Gửi tin nhắn Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Gửi tin nhắn webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Gửi email qua SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Các thao tác Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Đọc/ghi bảng tính Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Quản lý repository, người dùng, issue, pull request, review, release, workflow Actions và tệp thông qua GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Quản lý dự án, issue, bình luận, tệp đính kèm, người dùng, thông báo và chuyển đổi workflow Jira thông qua Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Quản lý team, dự án, issue, trạng thái workflow và bình luận Linear thông qua GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Đọc/ghi Google Sheets qua OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Liệt kê, tải xuống, cập nhật và xóa tệp Google Drive qua OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Chạy truy vấn SQL và chèn hàng trong BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Truy vấn và thay đổi bảng Supabase thông qua PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Chạy SQL, CRUD và các thao tác đếm trên ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Quản lý cơ sở dữ liệu, nguồn dữ liệu, trang và block Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Quản lý tổ chức, dự án, team, issue, sự kiện và release Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Quản lý bucket và thư mục; liệt kê, tải lên, tải xuống, sao chép và xóa đối tượng | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Đọc/ghi Heym DataTables (lưu trữ first-party) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Quản lý tệp Drive: xóa, đặt mật khẩu, TTL, số lượt tải tối đa, chia sẻ/hủy chia sẻ nhóm | 1 | 1 |

## Các Node Tự động hóa

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Thu thập trang web bằng FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Tự động hóa trình duyệt với bước AI và Auto Heal | 1 | 1 |

## Các Node Tiện ích

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Trì hoãn thực thi | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint đầu ra | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Ánh xạ các trường thành một đối tượng JSON; terminal duy nhất = body webhook/run cấp cao nhất | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Kết xuất một trang HTML; terminal duy nhất = webhook phản hồi với text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Đầu ra widget dashboard terminal ánh xạ các hàng thượng nguồn thành payload biểu đồ | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Thêm ghi chú markdown vào canvas (không được thực thi) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Ghi log vào console backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Vô hiệu hóa một node khác trong workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Kích hoạt một node đã bị vô hiệu hóa trong workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Dừng workflow với phản hồi lỗi | 1 | 0 |

## Các Node Plugin

Các node plugin được cung cấp bởi các plugin đã cài đặt trên instance. Mỗi plugin
đã cài đặt xuất hiện trong palette dưới mục **Plugins** với tên riêng của nó; bên trong
nó ánh xạ đến một trong hai loại node này.

| Node | Mô tả | Đầu vào | Đầu ra |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Hành động tùy chỉnh được cung cấp bởi một plugin đã cài đặt | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger tùy chỉnh được cung cấp bởi một plugin đã cài đặt | 0 | 1 |

## Liên quan

- [Tính năng Canvas](./canvas-features.md) – Ghim dữ liệu, nhật ký thực thi, bật/tắt, trích xuất thành sub-workflow
- [Agent Node](../nodes/agent-node.md) – Tài liệu tham chiếu chi tiết cho node AI Agent
- [Kiến trúc Agent](./agent-architecture.md) – Sub-agent, orchestrator, skills, MCP, gọi công cụ
- [Bộ nhớ liên tục của Agent](./agent-persistent-memory.md) – Đồ thị tri thức theo từng node, chia sẻ và trích xuất nền
- [Human-in-the-Loop](./human-in-the-loop.md) – Tạm dừng đầu ra của agent để con người phê duyệt
- [Expression DSL](./expression-dsl.md) – Tham chiếu dữ liệu trong cấu hình node
- [Hộp thoại đánh giá biểu thức](./expression-evaluation-dialog.md) – Trình chỉnh sửa mở rộng với xem trước backend trực tiếp
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Chấp nhận tải lên multipart dung lượng lớn thông qua liên kết dùng một lần
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Trigger socket gửi đi theo thời gian thực
- [WebSocket Send](../nodes/websocket-send-node.md) – Đẩy tin nhắn đến các socket bên ngoài
- [Cấu trúc Workflow](./workflow-structure.md) – Định dạng JSON cho các node và cạnh
- [Triggers](./triggers.md) – Tất cả các điểm vào của workflow
- [Tab Credentials](../tabs/credentials-tab.md) – Thêm API key cho LLM, HTTP và các node khác
- [Chia sẻ Credentials](./credentials-sharing.md) – Chia sẻ credentials với người dùng khác
- [Portal](./portal.md) – Hiển thị workflow dưới dạng giao diện chat công khai
- [Tab Vectorstores](../tabs/vectorstores-tab.md) – Tạo vector store cho các node RAG

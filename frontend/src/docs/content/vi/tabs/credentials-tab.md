# Tab Credentials

Tab **Credentials** quản lý các API key và secret được sử dụng bởi các node. Thêm credentials tại đây và tham chiếu chúng theo tên trong các node của workflow. Để có tổng quan về credentials là gì và cách các node sử dụng chúng, xem [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Xem demo Credentials</a></p>

## Các loại Credential

| Loại | Trường hợp sử dụng |
|------|----------|
| **OpenAI** | OpenAI API key cho các node LLM, Agent và RAG |
| **Google** | Google AI (Gemini) API key |
| **GitHub** | GitHub personal access token (PAT) cho GitHub API, các workflow node GitHub, MCP server và workflow agent; tùy chọn `base_url` cho GitHub Enterprise |
| **Linear** | Linear personal API key hoặc OAuth2 cho teams, projects, issues và comments |
| **Notion** | Internal integration token hoặc ủy quyền workspace qua OAuth của public-integration |
| **Custom** | Các endpoint LLM tùy chỉnh |
| **Bearer** | Bearer token cho xác thực HTTP |
| **Header** | Cặp key-value header tùy chỉnh cho các yêu cầu HTTP |
| **Telegram** | Telegram bot token và webhook secret tùy chọn |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Discord application public key |
| **IMAP** | Credentials cho trigger hộp thư đến |
| **SMTP** | Credentials gửi email |
| **Redis** | Kết nối Redis |
| **RAG: Qdrant + OpenAI** | Vector store cho các node RAG, sử dụng máy chủ Qdrant bên ngoài |
| **RAG: Psql + OpenAI** | Vector store cho các node RAG, sử dụng cơ sở dữ liệu Postgres của chính Heym (pgvector) — không cần dịch vụ bên ngoài |
| **RAG: Custom Embeddings** | Vector store cho các node RAG sử dụng bất kỳ endpoint embedding tương thích OpenAI nào, với Qdrant hoặc Postgres (pgvector) làm store |
| **Cohere** | Cohere API cho embeddings |

## Thêm Credentials

1. Nhấp vào **Add Credential**
2. Chọn loại credential
3. Nhập các giá trị yêu cầu (API key, URL, v.v.)
4. Đặt tên để tham chiếu trong các node

Đối với GitHub, luồng credential hiện tại dựa trên PAT. Nên sử dụng PAT chi tiết (fine-grained). Các luồng cài đặt GitHub App hiện chưa được hỗ trợ chính thức trong giao diện. Nếu bạn dùng GitHub Enterprise Server, bạn cũng có thể đặt GitHub API base URL tùy chọn như `https://github.example.com/api/v3`.

Đối với Linear, chọn **Personal API key** hoặc **OAuth2** trong hộp thoại. Personal API key được tạo
trong **Settings → Security & Access → Personal API keys** của Linear. OAuth2 sử dụng Client ID và
Client Secret của ứng dụng Linear OAuth, với `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
được đăng ký làm redirect URI. Credential hoạt động với quyền của người dùng Linear đã tạo hoặc
ủy quyền cho nó. Sử dụng **Test Connection** trong hộp thoại credential để xác minh API key hoặc
OAuth token trước khi lưu.

Đối với **Notion**, chọn **Internal token** hoặc **OAuth** trong hộp thoại. OAuth sử dụng Client ID và
Client Secret từ public integration của Notion; Heym lưu chúng được mã hóa trong credential.
Sử dụng **Test Connection** để xác minh credentials Supabase, Linear hoặc Notion trước khi lưu workflow. Xem
[Third-Party Integrations](../reference/integrations.md#notion) để biết chi tiết thiết lập Notion.

Credentials OAuth mở trang ủy quyền của nhà cung cấp trong một cửa sổ popup. Nếu trình duyệt chặn nó, hãy sử dụng liên kết **Open the authorization page** bên dưới nút Connect; hộp thoại sẽ thông báo khi kết nối hoàn tất. Sau khi credential mới được kết nối, nút sẽ hiển thị **Connected**.

## Chỉnh sửa và Xóa

- **Edit** – Cập nhật giá trị credential (các giá trị nhạy cảm được ẩn)
- **Delete** – Xóa credential; các workflow sử dụng nó sẽ cần được thay thế

Khi chỉnh sửa credential **GitHub** trên GitHub Enterprise Server, để trống trường **GitHub
API Base URL** tùy chọn sẽ giữ nguyên endpoint Enterprise hiện có. Chỉ nhập URL mới khi bạn
muốn thay đổi endpoint đó.

## Chia sẻ

- [Chia sẻ credentials](../reference/credentials-sharing.md) với người dùng khác qua email hoặc với [Teams](../reference/teams.md)
- Credentials được chia sẻ sẽ hiển thị kèm chỉ báo
- Thu hồi chia sẻ từ menu trên thẻ credential

## Sử dụng trong Nodes

Tham chiếu credentials theo tên trong cấu hình node. Ví dụ:
- [LLM node](../nodes/llm-node.md) – Chọn credential cho model API
- [HTTP node](../nodes/http-node.md) – Sử dụng Bearer hoặc Header credentials để xác thực
- [Agent node](../nodes/agent-node.md) – Truyền GitHub tokens vào các biến môi trường của MCP server như `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub node](../nodes/github-node.md) – Thực hiện các thao tác native trên GitHub repository, user, issue, review, release, workflow, traffic và file
- [Linear node](../nodes/linear-node.md) – Đọc metadata của workspace và tự động hóa các issue và comment trên Linear
- [Notion node](../nodes/notion-node.md) – Quản lý cơ sở dữ liệu, nguồn dữ liệu, trang và block trên Notion
- [RAG node](../nodes/rag-node.md) – Sử dụng credential Qdrant hoặc Postgres (pgvector) cho vector store
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Nhận webhook từ Telegram bot
- [Telegram node](../nodes/telegram-node.md) – Gửi tin nhắn từ Telegram bot
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Nhận webhook tương tác từ Discord
- [Discord node](../nodes/discord-node.md) – Gửi tin nhắn webhook qua Discord
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Poll hộp thư dùng chung để nhận email mới

Xem [Expression DSL](../reference/expression-dsl.md) để tham chiếu các giá trị được hỗ trợ bởi credential trong biểu thức.

## Liên quan

- [Third-Party Integrations](../reference/integrations.md) – Hướng dẫn thiết lập chi tiết cho từng loại credential (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack, và nhiều hơn nữa)
- [Credentials Sharing](../reference/credentials-sharing.md) – Chia sẻ credentials với người dùng khác
- [Security](../reference/security.md) – Mã hóa khi lưu trữ, quản lý phiên, giới hạn tần suất
- [Node Types](../reference/node-types.md) – Các node sử dụng credentials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Sử dụng credentials Qdrant hoặc Postgres (pgvector)
- [Chat Tab](./chat-tab.md) – Sử dụng credentials OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Hướng dẫn trang ngắn gọn cho các giao diện dashboard

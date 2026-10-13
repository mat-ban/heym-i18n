# Tích hợp bên thứ ba

Heym kết nối với các dịch vụ bên ngoài thông qua **credentials**. Mỗi loại credential lưu trữ thông tin kết nối cho một dịch vụ và có thể được tái sử dụng trên nhiều node và workflow. Xem [Credentials](./credentials.md) để biết tổng quan.

Thêm credentials trong [Settings → Credentials](../tabs/credentials-tab.md). Tất cả giá trị được mã hóa khi lưu trữ. Credentials có thể được [chia sẻ](./credentials-sharing.md) với người dùng khác hoặc [Teams](./teams.md).

Một số node tích hợp **không** yêu cầu credentials. [WebSocket Trigger](../nodes/websocket-trigger-node.md) và [WebSocket Send](../nodes/websocket-send-node.md) kết nối tới các socket bên ngoài bằng URL, headers và subprotocols được cấu hình trực tiếp trên node.

## Tổng quan các loại Credential

| Loại | Được sử dụng bởi | Các trường chính |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, tùy chọn `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, tùy chọn `base_url` |
| **Jira** | [Node Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, tùy chọn `api_version` |
| **Linear** | [Node Linear](../nodes/linear-node.md) | `api_key`, hoặc `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Node Sentry](../nodes/sentry-node.md) | `api_token`, tùy chọn `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, tùy chọn `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | một credential decision model, cùng các tùy chọn model tham chiếu tới các credentials khác của bạn |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vectors được lưu trong Postgres riêng của Heym thông qua pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, tùy chọn `embedding_api_key`, cùng `qdrant_host` khi `db_type` là `qdrant` |
| **Grist** | [Node Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Node Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 consent |
| **Google Drive** | [Node Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 consent (phạm vi Drive đầy đủ) |
| **BigQuery** | [Node BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 consent |
| **Supabase** | [Node Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, tùy chọn `supabase_schema` |
| **ClickHouse** | [Node ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Node Notion](../nodes/notion-node.md) | `api_token`, hoặc `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Node Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Node IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Node Telegram Trigger](../nodes/telegram-trigger-node.md), [Node Telegram](../nodes/telegram-node.md) | `bot_token`, tùy chọn `secret_token` |
| **Discord** | [Node Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Node Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Node RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Node Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Node Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Node Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Node HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Node HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Node Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Credential GitHub lưu trữ một GitHub personal access token (PAT) để các workflow có thể gọi GitHub REST API thông qua [node GitHub](../nodes/github-node.md), truyền token vào các MCP server như `@modelcontextprotocol/server-github`, hoặc sử dụng từ [node HTTP](../nodes/http-node.md) cho các lệnh gọi REST tùy chỉnh.

### Các trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `api_key` | GitHub personal access token (PAT fine-grained `github_pat_...` hoặc PAT classic `ghp_...`) |
### Trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `base_url` | URL cơ sở của GitHub API cho GitHub Enterprise Server (ví dụ `https://github.example.com/api/v3`) |

### Ghi chú

- Nên sử dụng personal access token loại fine-grained khi có thể vì bạn có thể giới hạn phạm vi chúng cho các repository và quyền cụ thể.
- Để trống `base_url` đối với GitHub.com. Với GitHub Enterprise Server, sử dụng endpoint REST API
  đầy đủ bao gồm `/api/v3` (ví dụ `https://github.example.com/api/v3`), không phải
  gốc web UI của server như `https://github.example.com`.
- Credential này hiện chỉ mô hình hóa xác thực dựa trên PAT. Để truy cập repository của tổ chức, sử dụng PAT đã được cấp các quyền tổ chức/repository cần thiết.
- GitHub App installation token và luồng thiết lập GitHub App hiện chưa được hỗ trợ chính thức trong Heym UI.
- Ưu tiên sử dụng [node GitHub](../nodes/github-node.md) cho các thao tác gốc với repository, người dùng, issue, pull request, review, release, Actions workflow, traffic và file. Chỉ sử dụng [node HTTP](../nodes/http-node.md) khi bạn cần các endpoint hoặc payload mà node GitHub không đáp ứng.
- Sử dụng [node Agent](../nodes/agent-node.md) với MCP bằng cách truyền `$credentials.YourGitHubCredential` vào biến môi trường kết nối MCP như `GITHUB_PERSONAL_ACCESS_TOKEN`.
- GitHub REST API thường yêu cầu `Authorization: Bearer <token>` cùng với `Accept: application/vnd.github+json`.
- Khi chỉnh sửa credential GitHub, để trống `base_url` của GitHub Enterprise sẽ giữ nguyên
  endpoint hiện có. Chỉ nhập URL mới khi bạn muốn thay đổi endpoint đó.

### Được sử dụng bởi

- [Node GitHub](../nodes/github-node.md)
- [Node Codex](../nodes/codex-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Node HTTP](../nodes/http-node.md)

---

## Decision Model

Decision model trả lời các câu hỏi có kiểu dữ liệu về một trạng thái và trả về xác suất thay vì văn bản. Jev của TypeSafe là triển khai tham chiếu; bất kỳ endpoint nào chấp nhận cùng body `{model, state, questions}` đều hoạt động, và node [Decision](../nodes/decision-node.md) có thể gửi body viết tay cho endpoint không hỗ trợ.

### Trường bắt buộc

- `base_url` – endpoint, ví dụ `https://api.typesafe.ai`. Heym sẽ thêm `/v1/systemone`.

### Trường tùy chọn

- `api_key` – được gửi dưới dạng `Authorization: Bearer`. Các endpoint không cần key có thể để trống trường này.

### Ghi chú

- **Test Connection** gửi một câu hỏi nhỏ để xác nhận endpoint và key hoạt động.
- Khi chỉnh sửa credential, key đã lưu sẽ được giữ nguyên nếu trường key để trống.
- Các yêu cầu gửi ra tới địa chỉ private và loopback bị chặn theo mặc định, vì vậy endpoint tự host trên `localhost` hoặc dải private cần đặt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Các model này không có trong bảng giá LLM mà Heym đồng bộ, nên cột Cost trong [Traces](../tabs/traces-tab.md) sẽ trống. Số lượng token vẫn được ghi lại.

### Được sử dụng bởi

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – chấm điểm câu trả lời `LLM-as-Judge` so với output mong đợi

## OpenAI Codex

Credential OpenAI Codex xác thực [node Codex](../nodes/codex-node.md). Nó tách biệt với credential OpenAI API key được sử dụng bởi các node LLM, Agent và RAG.

### Chế độ xác thực

| Chế độ | Mô tả |
|------|-------------|
| **Sign in with ChatGPT** (khuyến nghị) | Đăng nhập OAuth (PKCE) sử dụng gói đăng ký ChatGPT Plus/Pro của bạn, giúp các lần chạy tránh chi phí API theo token. Heym lưu trữ và tự động làm mới token bundle. |
| **Access token** | `access_token` của ChatGPT/Codex chỉ được truyền cho tiến trình Codex CLI cục bộ. |

### Ghi chú

- API key bị từ chối đối với loại credential này.
- Token Codex không được hiển thị qua `$credentials.Name`.
- Node Codex cũng cần credential GitHub để clone repository, push branch và tạo draft PR.

### Được sử dụng bởi

- [Node Codex](../nodes/codex-node.md)

## OpenCode Go

Credential OpenCode Go xác thực [node OpenCode Go](../nodes/opencode-go-node.md). Nó lưu API key của gateway OpenCode Go (từ [opencode.ai/go](https://opencode.ai/go)) và URL cơ sở gateway tùy chọn.

### Trường

| Trường | Mô tả |
|-------|-------------|
| **API Key** | API key của gateway OpenCode Go (bắt buộc). |
| **Gateway Base URL** | Tùy chọn; mặc định là `https://opencode.ai/zen/go/v1`. Chỉ ghi đè cho gateway tự host hoặc qua proxy. |

### Ghi chú

- API key chỉ được truyền cho tiến trình OpenCode CLI bên trong container được tăng cường bảo mật.
- Node OpenCode Go cũng cần credential GitHub để clone repository, push branch và tạo pull request. Token GitHub không bao giờ được đặt bên trong container sandbox.

### Được sử dụng bởi

- [Node OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Credential Linear hỗ trợ personal API key hoặc OAuth2 cho
[node Linear](../nodes/linear-node.md). Heym gửi các truy vấn GraphQL gốc tới Linear cho metadata workspace,
project, issue và comment.
### Thiết lập

Chọn một chế độ xác thực:

**Personal API key**

1. Trong Linear, mở **Settings → Security & Access → Personal API keys**.
2. Tạo một key có quyền truy cập vào workspace bạn muốn tự động hóa.
3. Dán key vào credential Linear trong Heym và sử dụng **Test Connection** để xác minh.

**OAuth2**

1. Tạo một ứng dụng Linear OAuth.
2. Đăng ký `{FRONTEND_URL}/api/credentials/linear/oauth/callback` làm redirect URI.
3. Trong Heym Dashboard → **Credentials** → **New** → chọn loại **Linear**.
4. Chọn **OAuth2**, nhập Client ID và Client Secret, sau đó nhấp **Connect**.

### Các trường bắt buộc

| Chế độ | Trường | Mô tả |
|------|-------|-------------|
| Personal API key | `api_key` | Linear personal API key, thường có tiền tố `lin_api_` |
| OAuth2 | `client_id` | Client ID từ ứng dụng Linear OAuth |
| OAuth2 | `client_secret` | Client Secret từ ứng dụng Linear OAuth |

OAuth token (`access_token`, `refresh_token`, `token_expiry`) được lưu trữ và làm mới tự động.

### Ghi chú

- Personal API key và OAuth token hoạt động với tư cách là người dùng Linear đã tạo hoặc ủy quyền chúng.
- Linear OAuth sử dụng các scope `read,write,issues:create,comments:create`.
- Sử dụng **Test Connection** trong hộp thoại credential để xác minh API key hoặc OAuth token với Linear API.
- Sử dụng List Teams và List Projects trong node Linear để khám phá UUID trước khi tạo hoặc lọc issue.
- Sử dụng List Workflow States và List Team Members để khám phá UUID của state và assignee cho các cập nhật.
- Xoay vòng API key bằng cách chỉnh sửa credential và nhập giá trị thay thế. Nếu bạn xoay vòng secret của ứng dụng OAuth, hãy kết nối lại credential thông qua **Connect**.

### Được sử dụng bởi

- [Node Linear](../nodes/linear-node.md)

---

## Jira

Credential Jira lưu trữ thông tin xác thực Jira Basic auth, URL cơ sở của site Jira, chế độ triển khai và phiên bản REST API tùy chọn cho [node Jira](../nodes/jira-node.md). Sử dụng `cloud` cho Jira Cloud hoặc `data_center` cho Jira Data Center / Server.

### Thiết lập

**Jira Cloud**

1. Trong cài đặt tài khoản Atlassian, tạo một API token.
2. Trong Heym Dashboard → **Credentials** → **New** → chọn loại **Jira**.
3. Nhập email Atlassian, API token và URL site Jira như `https://your-domain.atlassian.net`.
4. Sử dụng **Test Connection** để xác minh credential.

**Jira Data Center / Server**

1. Chọn **Jira Data Center / Server** làm chế độ triển khai.
2. Nhập username và password Jira được sử dụng cho Basic auth.
3. Nhập URL site Jira, ví dụ `https://jira.example.com`.
4. Sử dụng **Test Connection** để xác minh credential.

### Các trường

| Trường | Mô tả |
| --- | --- |
| `email` | Email tài khoản Atlassian của Jira Cloud, hoặc username Jira Data Center / Server |
| `api_token` | API token Atlassian của Jira Cloud, hoặc password Jira Data Center / Server cho Basic auth |
| `base_url` | URL cơ sở của site Jira |
| `deployment` | `cloud` cho Jira Cloud hoặc `data_center` cho Jira Data Center / Server |
| `api_version` | Phiên bản REST API; mặc định là `3` cho Jira Cloud. Data Center / Server sử dụng v2 |

### Ghi chú

- Node Jira gửi mô tả issue và comment dưới dạng tài liệu văn bản Atlassian Document Format
  cho Jira Cloud REST API v3. Credential Data Center / Server gửi văn bản thuần.
- Data Center / Server hiện chỉ hỗ trợ Basic auth với username/password. Personal access
  token và Bearer auth chưa được hỗ trợ.
- Tải lên tệp đính kèm chấp nhận nội dung base64 hoặc data URL và phụ thuộc vào giới hạn kích thước tệp của nền tảng (mặc định 99 MB). Tải xuống tệp đính kèm có thể trả về nội dung base64 khi được bật.
- Tạo người dùng, xóa và thông báo issue yêu cầu tài khoản Jira đã xác thực phải có quyền phù hợp trên site hoặc tổ chức Jira.
- Sử dụng List Projects, Search Issues và List Transitions để khám phá project key, issue key và transition ID.
- Đối với các endpoint tùy chỉnh không được node Jira hỗ trợ, sử dụng [node HTTP](../nodes/http-node.md) với Jira Basic Auth (`email:api_token` cho Cloud hoặc `username:password` cho Data Center / Server) trong lệnh cURL, hoặc credential Header với giá trị `Authorization: Basic <base64(user:secret)>` tương ứng.

Xem thêm:

- [Node Jira](../nodes/jira-node.md)
- [Credentials](./credentials.md)

---

## Sentry

Credential Sentry lưu trữ auth token cho [node Sentry](../nodes/sentry-node.md). Heym sử dụng REST API của Sentry cho các thao tác với organization, project, team, issue, event và release.

### Các trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `api_token` | Auth token Sentry có quyền truy cập vào các organization và project bạn tự động hóa |

### Các trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `base_url` | URL gốc tùy chọn cho Sentry tự lưu trữ, ví dụ `https://sentry.example.com` |

### Ghi chú

- Để trống `base_url` cho Sentry SaaS.
- Sử dụng **Test Connection** để xác nhận token có thể liệt kê các organization hiển thị.
- Đối với các lệnh gọi REST tùy chỉnh, sử dụng `$credentials.YourSentryCredential` làm bearer token.

### Được sử dụng bởi

- [Node Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) là một vector database mã nguồn mở được sử dụng cho tìm kiếm ngữ nghĩa và RAG (Retrieval Augmented Generation).

### Các trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `qdrant_host` | URL đầy đủ đến instance Qdrant của bạn (ví dụ: `http://localhost:6333` hoặc một cloud endpoint) |
| `openai_api_key` | OpenAI API key được sử dụng để tạo embedding khi đánh chỉ mục và tìm kiếm tài liệu |
### Ghi chú

- Các collection Qdrant được quản lý từ tab [Vectorstores](../tabs/vectorstores-tab.md). Mỗi vector store ánh xạ tới một collection Qdrant.
- [Node RAG](../nodes/rag-node.md) sử dụng một vector store (tham chiếu tới credential Qdrant) — node không tham chiếu trực tiếp tới credential.
- Nếu instance Qdrant của bạn yêu cầu API key, hãy đưa nó vào giá trị `qdrant_host` hoặc cấu hình Qdrant cho phù hợp; tích hợp hiện tại không có trường API key Qdrant riêng.
- Qdrant tự host: sử dụng [Docker image chính thức](https://hub.docker.com/r/qdrant/qdrant) và mở cổng `6333`.

### Được sử dụng bởi

- [Node RAG](../nodes/rag-node.md) (thông qua vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

## Custom Embeddings (RAG)

Mặc định, embedding của RAG đến từ OpenAI. Credential **RAG: Custom Embeddings**
trỏ tới bất kỳ endpoint embeddings tương thích OpenAI nào khác — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together, hoặc một gateway được host — và chỉ định
vector store mà nó ghi vào.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `embedding_base_url` | URL endpoint bao gồm đường dẫn `/v1`, ví dụ `http://localhost:11434/v1` |
| `embedding_api_key` | Tùy chọn. Các server cục bộ thường không cần key |
| `embedding_model` | Tên model theo cách endpoint mong đợi, ví dụ `nomic-embed-text` |
| `embedding_dimensions` | Độ rộng vector mà model trả về (mặc định `1536`) |
| `embedding_request_dimensions` | Tùy chọn. Yêu cầu endpoint trả về `embedding_dimensions` thay vì độ rộng gốc của model |
| `db_type` | `qdrant` hoặc `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Kết nối Qdrant, bắt buộc khi `db_type` là `qdrant` |

### Ghi chú

- **Qdrant chấp nhận mọi số chiều.** Mỗi collection được tạo với độ rộng mà credential
  này khai báo, vì vậy trường Dimensions có thể chỉnh sửa tự do.
- **Postgres (pgvector) yêu cầu chính xác 1536 chiều.** Cột của nó là `vector(1536)`
  cố định, vì vậy trường Dimensions bị ghim ở 1536 và credential khai báo độ rộng
  khác sẽ bị từ chối khi lưu.
- **Rút ngắn cho pgvector.** Khi store là Postgres, hộp thoại cung cấp tùy chọn *Ask the
  endpoint to return 1536 dimensions*. Tùy chọn này gửi tham số yêu cầu `dimensions`,
  mà các model được huấn luyện với biểu diễn Matryoshka (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` và tương tự) tuân theo bằng cách trả về một vector
  đã rút ngắn nhưng vẫn có ý nghĩa. Các endpoint không hỗ trợ tham số này sẽ từ chối
  yêu cầu, và các endpoint chấp nhận nhưng bỏ qua nó sẽ tạo ra lỗi rõ ràng nêu tên độ
  rộng thực tế được trả về. Heym không bao giờ tự cắt vector, vì việc cắt đầu ra của
  một model không phải Matryoshka sẽ làm giảm chất lượng truy xuất một cách âm thầm.
  Tùy chọn này không được cung cấp cho Qdrant, vì Qdrant có thể định cỡ collection
  theo bất kỳ độ rộng nào.
- Sử dụng **Test Connection** trong hộp thoại credential để nhúng một chuỗi thăm dò và
  xem độ rộng mà model thực sự trả về trước khi bạn tạo store.
- Tham số yêu cầu `dimensions` chỉ được gửi tới chính OpenAI, vì hầu hết các server
  tương thích OpenAI đều từ chối các tham số không xác định. Độ rộng gốc của model
  được xác thực dựa trên credential thay vào đó.
- Các credential **RAG: Qdrant + OpenAI** và **RAG: Psql + OpenAI** hiện có không thay
  đổi và vẫn hoạt động.

### Được sử dụng bởi

- [Node RAG](../nodes/rag-node.md) (thông qua vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym cũng có thể lưu trữ vector **bên trong cơ sở dữ liệu Postgres của chính nó** bằng
tiện ích mở rộng [pgvector](https://github.com/pgvector/pgvector) — không cần dịch vụ
vector bên ngoài. Tạo credential **RAG: Psql + OpenAI** và sử dụng nó khi tạo vector
store, sau đó chọn **Postgres (pgvector)** trong dropdown Database của node RAG.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `openai_api_key` | OpenAI API key được sử dụng để tạo embedding khi lập chỉ mục và tìm kiếm tài liệu |

### Ghi chú

- Không cần host/port — vector được ghi vào cơ sở dữ liệu của chính Heym; Heym không bao giờ kết nối tới cơ sở dữ liệu khác.
- Mọi tính năng RAG có sẵn với Qdrant (chèn, tìm kiếm, bộ lọc metadata, xếp hạng lại Cohere, nhân bản, chia sẻ) đều hoạt động giống hệt với backend Postgres.
- Yêu cầu tiện ích mở rộng `vector`. Heym giữ nguyên image `postgres:16` chính thức (để dữ liệu hiện có không bao giờ bị ảnh hưởng) và **tự động cài đặt gói `postgresql-16-pgvector` khi khởi động** — `run.sh`, `deploy.sh`, và `run_e2e.sh` đều xử lý việc này. Việc cài đặt không gây lỗi nghiêm trọng: nếu không thể chạy (ví dụ: không có mạng), Qdrant RAG vẫn hoạt động và backend Postgres vẫn không hoạt động (migration bỏ qua bảng một cách nhẹ nhàng).
- Nếu bạn chạy image single-container đã phát hành (`ghcr.io/heymrun/heym`) với **Postgres bên ngoài của riêng bạn**, cơ sở dữ liệu đó phải hỗ trợ tiện ích mở rộng `vector` (Heym không thể cài đặt nó vào cơ sở dữ liệu mà nó không quản lý). Nếu không có nó, việc tạo hoặc tải lên một Postgres vector store sẽ trả về thông báo rõ ràng và Qdrant RAG tiếp tục hoạt động.

### Được sử dụng bởi

- [Node RAG](../nodes/rag-node.md) (thông qua vector store)
- [Tab Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) là sự kết hợp giữa bảng tính và cơ sở dữ liệu, hỗ trợ dữ liệu có cấu trúc và công thức. Credential Grist cho phép Heym đọc và ghi tài liệu Grist.
### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `api_key` | Grist API key (tìm thấy trong **Profile → API Key** trên Grist instance của bạn) |
| `server_url` | URL cơ sở của máy chủ Grist của bạn (ví dụ: `https://docs.getgrist.com` cho Grist Cloud, hoặc URL tự lưu trữ của bạn) |

### Ghi chú

- [Node Grist](../nodes/grist-node.md) yêu cầu **Document ID** (từ URL tài liệu Grist) và **Table ID** trong cấu hình của nó — những thông tin này không thuộc phần credential.
- Đối với Grist tự lưu trữ, đặt `server_url` thành tên miền của instance của bạn.
- Column ID trong Grist sử dụng dấu gạch dưới (ví dụ: `User_Name`), không phải nhãn hiển thị. Sử dụng thao tác `listColumns` để khám phá chúng.

### Được sử dụng bởi

- [Node Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Credential Google Sheets kết nối Heym với Google Sheets API bằng mô hình OAuth2 "Bring Your Own App". Bạn cung cấp Client ID và Client Secret OAuth2 từ Google Cloud, sau đó ủy quyền truy cập thông qua cửa sổ popup trình duyệt. Token được làm mới tự động trong nền.

### Thiết lập

1. Mở [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → tìm kiếm và bật **Google Sheets API**.
2. Đi đến **Credentials** → **Create Credentials** → **OAuth client ID** → loại ứng dụng **Web application**.
3. Trong **Authorized redirect URIs** thêm: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Sao chép **Client ID** và **Client Secret** được tạo.
5. Trong Heym Dashboard → **Credentials** → **New** → chọn loại **Google Sheets (OAuth2)**.
6. Nhập Client ID, Client Secret và tên, sau đó nhấp **Connect** để mở popup đồng ý của Google và ủy quyền truy cập.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `client_id` | OAuth2 Client ID từ Google Cloud Console |
| `client_secret` | OAuth2 Client Secret từ Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) được lưu trữ và làm mới tự động — bạn không quản lý chúng trực tiếp.

### Ghi chú

- Màn hình đồng ý OAuth2 yêu cầu phạm vi spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym sử dụng refresh token để lấy access token mới trước khi chúng hết hạn (đệm an toàn 60 giây).
- Nếu bạn xoay Client Secret trong Google Cloud Console, hãy kết nối lại credential thông qua nút **Connect**.
- **Production:** Đặt backend **`FRONTEND_URL`** thành URL công khai chính xác mà người dùng mở trong trình duyệt (scheme + host, ví dụ: `https://heym.example.com`). Heym xây dựng Google OAuth redirect URI chỉ từ giá trị này — nó **không** tin tưởng header `Origin` hoặc `X-Forwarded-*` (do client kiểm soát). Đăng ký `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` trong Google Cloud Console.

### Được sử dụng bởi

- [Node Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Credential Google Drive kết nối Heym với Google Drive API bằng cùng mô hình OAuth2 "Bring Your Own App" như Google Sheets. Bạn cung cấp Client ID và Client Secret OAuth2 từ Google Cloud, sau đó ủy quyền truy cập thông qua cửa sổ popup trình duyệt. Token được làm mới tự động trong nền.

### Thiết lập

1. Mở [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → tìm kiếm và bật **Google Drive API**.
2. Đi đến **Credentials** → **Create Credentials** → **OAuth client ID** → loại ứng dụng **Web application**.
3. Trong **Authorized redirect URIs** thêm: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Sao chép **Client ID** và **Client Secret** được tạo.
5. Trong Heym Dashboard → **Credentials** → **New** → chọn loại **Google Drive (OAuth2)**.
6. Nhập Client ID, Client Secret và tên, sau đó nhấp **Connect** để mở popup đồng ý của Google và ủy quyền truy cập.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `client_id` | OAuth2 Client ID từ Google Cloud Console |
| `client_secret` | OAuth2 Client Secret từ Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) được lưu trữ và làm mới tự động — bạn không quản lý chúng trực tiếp.

### Phạm vi

Google Drive yêu cầu **phạm vi Drive đầy đủ** (`https://www.googleapis.com/auth/drive`).

Điều này là cần thiết vì node hoạt động trên các tệp bạn đã sở hữu. Phạm vi hẹp hơn `drive.file` chỉ cấp quyền truy cập vào các tệp mà chính OAuth client đã tạo, điều này sẽ khiến `listFolderFiles`, `updateFile`, `removeFile` và `removeFolder` không thấy gì trong Drive hiện có của bạn.

Vì bạn cung cấp Client ID và Secret của riêng mình từ dự án Google Cloud của bạn, các yêu cầu xác minh ứng dụng Google cho phạm vi này áp dụng cho dự án của bạn, không phải cho Heym.

### Ghi chú

- Heym sử dụng refresh token để lấy access token mới trước khi chúng hết hạn (đệm an toàn 60 giây).
- Nếu bạn xoay Client Secret trong Google Cloud Console, hãy kết nối lại credential thông qua nút **Connect**.
- Shared drive được hỗ trợ — node đặt `supportsAllDrives` trên mọi lệnh gọi API.
- **Production:** Đặt backend **`FRONTEND_URL`** thành URL công khai chính xác mà người dùng mở trong trình duyệt. Heym xây dựng Google OAuth redirect URI chỉ từ giá trị này — nó **không** tin tưởng header `Origin` hoặc `X-Forwarded-*`. Đăng ký `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` trong Google Cloud Console.
- Xem [Credential Sharing](./credentials-sharing.md) trước khi chia sẻ credential này với một nhóm.

### Được sử dụng bởi

- [Node Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Thông tin xác thực BigQuery kết nối Heym với Google BigQuery API bằng mô hình OAuth2 "Bring Your Own App". Bạn cung cấp Client ID và Client Secret OAuth2 của Google Cloud, sau đó cấp quyền truy cập thông qua cửa sổ bật lên trên trình duyệt. Token được tự động làm mới trong nền.

### Thiết lập

1. Mở [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → tìm và bật **BigQuery API**.
2. Vào **Credentials** → **Create Credentials** → **OAuth client ID** → loại ứng dụng **Web application**.
3. Trong **Authorized redirect URIs**, thêm: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Sao chép **Client ID** và **Client Secret** được tạo.
5. Trong Heym Dashboard → **Credentials** → **New** → chọn loại **BigQuery (OAuth2)**.
6. Nhập Client ID, Client Secret và tên, sau đó nhấp **Connect** để mở cửa sổ đồng ý của Google và cấp quyền truy cập.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `client_id` | OAuth2 Client ID từ Google Cloud Console |
| `client_secret` | OAuth2 Client Secret từ Google Cloud Console |

Token (`access_token`, `refresh_token`, `token_expiry`) được lưu trữ và làm mới tự động.

### Lưu ý

- Màn hình đồng ý OAuth2 yêu cầu phạm vi BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Production:** Đặt backend **`FRONTEND_URL`** thành URL công khai. Đăng ký `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` trong Google Cloud Console.

### Được sử dụng bởi

- [Node BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Thông tin xác thực Supabase kết nối Heym với PostgREST API của một dự án Supabase để các workflow có thể truy vấn và thay đổi các bảng dựa trên Postgres.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `supabase_url` | URL cơ sở của dự án, ví dụ `https://your-project.supabase.co` |
| `supabase_key` | API key có quyền truy cập vào các bảng mục tiêu |
| `supabase_schema` | Schema mặc định tùy chọn (mặc định là `public`) |

### Lưu ý

- [Node Supabase](../nodes/supabase-node.md) giao tiếp với `/rest/v1/<table>` và hỗ trợ các bộ lọc toán tử (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` và các toán tử PostgREST liên quan) cùng các nhóm logic `or` / `and` lồng nhau.
- Đối với các thao tác ghi, nên dùng key dành cho mục đích sử dụng phía server đáng tin cậy với quyền bảng tối thiểu cần thiết.
- Các node có thể ghi đè schema theo từng bước ngay cả khi thông tin xác thực đã định nghĩa schema mặc định.

### Được sử dụng bởi

- [Node Supabase](../nodes/supabase-node.md)

## ClickHouse

Thông tin xác thực ClickHouse kết nối Heym với cơ sở dữ liệu ClickHouse bên ngoài thông qua giao diện HTTP để các workflow có thể chạy các thao tác SQL, CRUD và đếm trên các bảng OLAP.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `host` | Host HTTP không có scheme, ví dụ `your-instance.clickhouse.cloud` |
| `port` | Cổng giao diện HTTP (`8443` cho HTTPS, `8123` cho HTTP) |
| `username` | Người dùng ClickHouse (mặc định là `default`) |
| `password` | Mật khẩu người dùng (tùy chọn) |
| `database` | Cơ sở dữ liệu mục tiêu (mặc định là `default`) |
| `secure` | Dùng HTTPS khi `true` (bắt buộc cho ClickHouse Cloud) |

### Lưu ý

- [Node ClickHouse](../nodes/clickhouse-node.md) sử dụng HTTP client chính thức `clickhouse-connect` và tham số hóa các ràng buộc bộ lọc và giá trị.
- `update` và `remove` ánh xạ tới `ALTER TABLE ... UPDATE` và `DELETE FROM`, đây là các mutation bất đồng bộ của ClickHouse; cả hai đều yêu cầu bộ lọc.
- `upsert` thực hiện `INSERT` và giả định bảng `ReplacingMergeTree` cho hành vi merge-on-key.
- Dùng **Test connection** trong hộp thoại thông tin xác thực để xác minh khả năng kết nối.

### Được sử dụng bởi

- [Node ClickHouse](../nodes/clickhouse-node.md)

## Notion

Thông tin xác thực Notion hỗ trợ token tích hợp nội bộ hoặc kết nối OAuth
tích hợp công khai. OAuth cho phép mỗi người dùng cấp quyền cho một workspace Notion từ Heym thay vì sao chép
token thủ công.

### Trường bắt buộc

| Chế độ | Trường | Mô tả |
|------|-------|-------------|
| Token nội bộ | `api_token` | Token tích hợp nội bộ (`ntn_...`) |
| OAuth | `client_id` | Client ID từ tích hợp công khai Notion |
| OAuth | `client_secret` | Client Secret từ tích hợp công khai Notion |

Callback OAuth tự động lưu trữ `access_token`, `auth_mode`, `workspace_id`, `workspace_name` và `bot_id`. Mọi `api_token` nội bộ trước đó sẽ bị xóa khi OAuth hoàn tất. Đăng ký URI
chuyển hướng này trong Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Quy trình thiết lập OAuth

1. Chọn **OAuth** trong hộp thoại thông tin xác thực, nhập tên, Client ID và Client Secret.
2. Nhấp **Connect** và cấp quyền cho workspace trong cửa sổ bật lên của Notion.
   - Đối với thông tin xác thực **mới**, Heym tạo bản ghi thông tin xác thực khi bạn nhấp **Connect**.
   - Hoàn tất cấp quyền trong cửa sổ bật lên, sau đó nhấp **Save** để quay lại danh sách thông tin xác thực.
3. Thông tin xác thực đã kết nối hiển thị `connected (Workspace Name)` trong danh sách. Thông tin xác thực OAuth
   đang chờ hiển thị `Not connected` cho đến khi cấp quyền hoàn tất.

Dùng **Test Connection** trong hộp thoại thông tin xác thực để xác minh token nội bộ hoặc cấp quyền
OAuth đã hoàn tất. Khi chỉnh sửa, để trống trường token sẽ giữ nguyên token nội bộ đã lưu.

Cả token nội bộ và access token OAuth đều có sẵn thông qua
`$credentials.CredentialName` cho các lệnh gọi [HTTP](../nodes/http-node.md) tùy chỉnh cần bearer token
Notion.
### Ghi chú

- Các tích hợp nội bộ yêu cầu chia sẻ các trang, cơ sở dữ liệu và nguồn dữ liệu liên quan.
- Người dùng OAuth chọn workspace/trang trong quá trình ủy quyền Notion.
- Thông tin xác thực ứng dụng OAuth được mã hóa bên trong credential Notion. Callback tải lại
  chúng ở phía server; secret không được nhúng vào OAuth state.
- Credential OAuth đã kết nối hiển thị tên workspace; credential OAuth đang chờ hiển thị
  `Not connected` cho đến khi hoàn tất ủy quyền.
- **Production:** Đặt backend **`FRONTEND_URL`** thành URL trình duyệt công khai (scheme + host, không
  có dấu gạch chéo cuối). Notion redirect URI phải khớp chính xác:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Node sử dụng API version `2026-03-11` và thuật ngữ `data_source` hiện tại. Xem bài viết
  [Notion node](../nodes/notion-node.md#api-version-notes) để biết hướng dẫn migration từ
  các ví dụ cũ về `archived`, `after`, hoặc database-query.
- Các bộ lọc tìm kiếm cũ với giá trị object là `database` được chuẩn hóa thành `data_source`.

### Được sử dụng bởi

- [Notion node](../nodes/notion-node.md)

---

## SMTP (Email)

Credential SMTP lưu trữ thông tin kết nối máy chủ email để gửi thư đi.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `host` | Hostname máy chủ SMTP (ví dụ: `smtp.gmail.com`) |
| `port` | Cổng SMTP (thường là `587` cho STARTTLS, `465` cho SSL) |
| `email` | Tên người dùng mà máy chủ SMTP dùng để đăng nhập; đồng thời là người gửi hiển thị khi `from` để trống |
| `password` | Mật khẩu SMTP hoặc App Password |

### Trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `from` (`smtp_from`) | Địa chỉ người gửi (From) hiển thị. Để trống nếu muốn gửi dưới tên `email`. Máy chủ vẫn đăng nhập bằng `email`, vì vậy tài khoản đó phải được phép gửi dưới địa chỉ này (trong Gmail, đây là một bí danh **Gửi thư bằng địa chỉ** đã xác minh). |

### Các nhà cung cấp SMTP phổ biến

| Nhà cung cấp | Host | Cổng | Ghi chú |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Yêu cầu [App Password](https://support.google.com/accounts/answer/185833) (phải bật 2FA) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Sử dụng thông tin xác thực tài khoản Microsoft của bạn |
| Mailgun | `smtp.mailgun.org` | `587` | Sử dụng thông tin xác thực SMTP Mailgun từ cài đặt domain của bạn |
| SendGrid | `smtp.sendgrid.net` | `587` | Sử dụng `apikey` làm username và API key làm password |
| Tùy chỉnh / Tự host | domain của bạn | `587` / `465` | Postfix, Exim, v.v. |

### Ghi chú

- Gmail yêu cầu **App Password** thay vì mật khẩu thông thường khi bật Xác minh 2 bước.
- Cổng `587` sử dụng STARTTLS (bắt đầu dạng plaintext, nâng cấp lên TLS). Cổng `465` sử dụng TLS ngầm định (SSL ngay từ đầu).

### Được sử dụng bởi

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Email đến)

Credential IMAP lưu trữ thông tin kết nối để giám sát hộp thư đến với [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `imap_host` | Hostname máy chủ IMAP (ví dụ `imap.gmail.com`) |
| `imap_port` | Cổng IMAP (`993` cho SSL/TLS trên hầu hết nhà cung cấp) |
| `imap_username` | Username hộp thư hoặc địa chỉ email đầy đủ |
| `imap_password` | Mật khẩu hoặc app password riêng của nhà cung cấp |

### Trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `imap_mailbox` | Thư mục hộp thư cần giám sát (mặc định: `INBOX`) |
| `imap_use_ssl` | Bật SSL/TLS (khuyến nghị; mặc định: `true`) |

### Ghi chú

- IMAP trigger thiết lập baseline hộp thư hiện tại trong lần poll đầu tiên và sau đó chỉ xử lý email mới hơn.
- Gmail, Microsoft 365 và các nhà cung cấp hosted khác thường yêu cầu **app password** hoặc secret riêng cho IMAP tương tự.
- Nội dung tệp đính kèm không được tải xuống payload của workflow; Heym chỉ cung cấp metadata của tệp đính kèm.

### Được sử dụng bởi

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP làm workflow trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) là một message broker mã nguồn mở. Credential RabbitMQ lưu trữ thông tin kết nối để publish đến và consume từ các queue và exchange.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `rabbitmq_host` | URL kết nối AMQP (ví dụ `amqp://localhost:5672`) |
| `rabbitmq_username` | Username RabbitMQ (mặc định: `guest`) |
| `rabbitmq_password` | Mật khẩu RabbitMQ (mặc định: `guest`) |

### Virtual Hosts

Để kết nối đến một virtual host cụ thể, bao gồm nó trong URL `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Nếu sử dụng vhost mặc định, đường dẫn `/` có thể được bỏ qua.

### Plugin Delayed Message

[RabbitMQ node](../nodes/rabbitmq-node.md) hỗ trợ plugin **rabbitmq_delayed_message_exchange**. Khi plugin này được bật trên máy chủ RabbitMQ của bạn, bạn có thể đặt độ trễ (tính bằng mili giây) cho các message gửi đi bằng trường `rabbitmqDelayMs` trên node.

Node đặt header `x-delay` trên message đã publish. Loại exchange phải là `x-delayed-message` để độ trễ có hiệu lực.

Để bật plugin trên instance RabbitMQ tự host:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Khi plugin chưa được cài đặt, header `x-delay` bị bỏ qua và message được gửi đi ngay lập tức.

### Được sử dụng bởi

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ làm workflow trigger)

---

## Amazon S3

Credential Amazon S3 kết nối Heym với [Amazon S3](https://aws.amazon.com/s3/). Sử dụng nó với [Amazon S3 node](../nodes/amazon-s3-node.md) để quản lý bucket và thư mục, tải lên và tải xuống object, sao chép key, và liệt kê hoặc xóa object từ workflow.
### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `aws_access_key_id` | ID khóa truy cập AWS IAM |
| `aws_secret_access_key` | Khóa truy cập bí mật đi kèm với ID khóa truy cập |
| `aws_region` | Vùng AWS nơi các bucket tồn tại (ví dụ: `us-east-1`) |

### Trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `aws_session_token` | Token phiên tạm thời khi sử dụng thông tin xác thực AWS STS |

### Ghi chú

- Thông tin xác thực này sử dụng xác thực AWS SigV4 tiêu chuẩn thông qua boto3.
- Các thao tác tải lên hiện gửi nội dung văn bản UTF-8; các thao tác tải xuống có thể trả về văn bản hoặc base64 cho các đối tượng nhị phân.

### Được sử dụng bởi

- [Node Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) là một kho lưu trữ key-value trong bộ nhớ được sử dụng để lưu trữ đệm và truy cập dữ liệu nhanh chóng.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `host` | Tên máy chủ hoặc địa chỉ IP của máy chủ Redis (ví dụ: `localhost`) |
| `port` | Cổng Redis (mặc định: `6379`) |
| `password` | Mật khẩu Redis (để trống nếu không được đặt) |

### Được sử dụng bởi

- [Node Redis](../nodes/redis-node.md)

---

## Slack

Thông tin xác thực Slack lưu trữ một **Incoming Webhook URL** để đăng tin nhắn đến các kênh Slack.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `webhook_url` | Incoming Webhook URL của Slack (từ cấu hình ứng dụng Slack của bạn) |

### Ghi chú

- Tạo một Incoming Webhook tại [api.slack.com/apps](https://api.slack.com/apps) → ứng dụng của bạn → **Incoming Webhooks**.
- Mỗi webhook được giới hạn cho một kênh cụ thể. Tạo nhiều thông tin xác thực cho các kênh khác nhau.

### Được sử dụng bởi

- [Node Slack](../nodes/slack-node.md)

---

## Telegram

Thông tin xác thực Telegram lưu trữ một **Bot Token** và một **Webhook Secret Token** tùy chọn cho các workflow dựa trên bot.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `bot_token` | Token Telegram Bot API từ BotFather |

### Trường tùy chọn

| Trường | Mô tả |
|-------|-------------|
| `secret_token` | Bí mật chia sẻ được xác minh dựa trên `x-telegram-bot-api-secret-token` trên các webhook đến |

### Ghi chú

- Sử dụng cùng một thông tin xác thực cho cả [Telegram Trigger](../nodes/telegram-trigger-node.md) và [Telegram](../nodes/telegram-node.md).
- Đăng ký webhook thủ công với API `setWebhook` của Telegram bằng URL được hiển thị trong bảng điều khiển của node Telegram Trigger.
- `chatId` trong node Telegram có thể là một ID cụ thể hoặc một biểu thức như `$telegramEvent.message.chat.id`.

### Được sử dụng bởi

- [Node Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Node Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Các thông tin xác thực này được sử dụng bởi [Node HTTP](../nodes/http-node.md) để xác thực các yêu cầu gửi đi.

### Bearer

Đính kèm header `Authorization: Bearer <token>` vào các yêu cầu HTTP.

| Trường | Mô tả |
|-------|-------------|
| `token` | Giá trị bearer token |

### Header

Đính kèm một header tùy chỉnh vào các yêu cầu HTTP.

| Trường | Mô tả |
|-------|-------------|
| `header_key` | Tên header (ví dụ: `X-Api-Key`) |
| `header_value` | Giá trị header |

Cả hai loại cũng có thể được tham chiếu thông qua `$credentials.CredentialName` trong [Expression DSL](./expression-dsl.md) để sử dụng động trong bất kỳ node nào chấp nhận biểu thức.

### Được sử dụng bởi

- [Node HTTP](../nodes/http-node.md)

---

## Nhà cung cấp LLM (OpenAI, Google, Custom, Cohere)

Các thông tin xác thực này cung cấp năng lượng cho các node AI.

| Loại | Mô tả |
|------|-------------|
| **OpenAI** | API key cho các mô hình GPT và embeddings của OpenAI |
| **Google** | API key cho các mô hình Gemini |
| **Custom** | API key + base URL cho các endpoint tương thích OpenAI (Ollama, vLLM, LM Studio, v.v.) |
| **Cohere** | API key cho embeddings của Cohere |

### Bộ nhớ đệm Prompt của OpenAI

OpenAI tự động lưu trữ đệm tiền tố tĩnh (không thay đổi) của system prompt của bạn — không cần cấu hình thêm. Các lần chạy workflow lặp lại chia sẻ cùng một tiền tố system prompt sẽ được hưởng lợi từ giá token được lưu trữ đệm, giúp giảm cả chi phí và độ trễ. Điều này đặc biệt hữu ích khi bạn có các hướng dẫn dài, cố định và chỉ có tin nhắn người dùng thay đổi giữa các lần chạy. Theo dõi tỷ lệ cache hit và tiết kiệm token trong [tab Traces](../tabs/traces-tab.md) hoặc bảng điều khiển sử dụng OpenAI để tối ưu hóa cấu trúc prompt của bạn nhằm tái sử dụng bộ nhớ đệm tối đa.

### Được sử dụng bởi

- [Node LLM](../nodes/llm-node.md)
- [Node Agent](../nodes/agent-node.md)
- [Node RAG](../nodes/rag-node.md) (embeddings của OpenAI thông qua thông tin xác thực Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) là một máy chủ proxy để vượt qua Cloudflare và các thách thức bảo vệ bot tương tự.

### Trường bắt buộc

| Trường | Mô tả |
|-------|-------------|
| `flaresolverr_url` | URL của phiên bản FlareSolverr của bạn (ví dụ: `http://localhost:8191`) |

Địa chỉ loopback và địa chỉ riêng tư được hỗ trợ ở đây, vì vậy việc chạy FlareSolverr bên cạnh Heym hoạt động như được tài liệu hóa. URL không được phân giải thành địa chỉ link-local hoặc địa chỉ metadata đám mây. Vì địa chỉ riêng tư được cho phép, trường này cũng có thể được trỏ đến một dịch vụ nội bộ khác và phản hồi sẽ trở về trong đầu ra của node. Bất kỳ người dùng đã đăng nhập nào cũng có thể tạo thông tin xác thực này, vì vậy ranh giới là ai có thể tạo workflow cùng với các quy tắc mạng của bạn, chứ không phải việc chia sẻ thông tin xác thực. Xem [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Được sử dụng bởi

- [Node Crawler](../nodes/crawler-node.md)

---
## Liên quan

- [Credentials](./credentials.md) – Tổng quan về credentials và cách các node sử dụng chúng
- [Credentials Tab](../tabs/credentials-tab.md) – Thêm và quản lý credentials
- [Credentials Sharing](./credentials-sharing.md) – Chia sẻ credentials với người dùng và nhóm
- [Security](./security.md) – Mã hóa khi lưu trữ, kiểm soát truy cập
- [Expression DSL](./expression-dsl.md) – Cú pháp `$credentials` để truy cập động

---

## Model Router (Auto Model)

Định tuyến mỗi yêu cầu đến một trong các model credentials hiện có của bạn, sử dụng một decision model để
lựa chọn. Nó chỉ lưu trữ các tham chiếu, không bao giờ lưu key của riêng nó.

### Trường bắt buộc

- `decision_credential_id` – một credential **Decision Model** mà bạn có thể truy cập.
- `decision_model` – model thực hiện lệnh gọi định tuyến, ví dụ `jev-latest`.
- `options` – ít nhất hai mục, mỗi mục có tên, một trong các credential OpenAI/Google/Custom
  của bạn, một model trên đó, và tiêu chí nói khi nào nó nên được chọn.

### Trường tùy chọn

- `routing_instructions` – cách cân nhắc các tùy chọn một cách tổng thể.
- Một tùy chọn có thể được đánh dấu là fallback dùng khi định tuyến thất bại.

### Lưu ý

Tên tùy chọn là những gì decision model lựa chọn, vì vậy chúng phải khác nhau. Một
tùy chọn không thể trỏ đến một Model Router khác.

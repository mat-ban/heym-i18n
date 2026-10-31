# Credentials

Credentials lưu trữ API key và secret được sử dụng bởi các node trong workflow. Bạn thêm chúng trong [Credentials Tab](../tabs/credentials-tab.md) và tham chiếu chúng theo tên trong cấu hình node.

## Credentials là gì

- **Lưu trữ theo từng người dùng** – Mỗi credential thuộc về một người dùng và có thể được [chia sẻ](./credentials-sharing.md) với người dùng khác hoặc [Teams](./teams.md).
- **Mã hóa khi lưu trữ** – Các giá trị nhạy cảm được mã hóa; giao diện sẽ che chúng sau khi tạo.
- **Tham chiếu theo tên** – Các node chọn credential theo tên (hoặc ID). Execution engine sẽ phân giải credential cho chủ sở hữu workflow tại thời điểm chạy.

## Cách các node sử dụng chúng

| Loại node | Credential điển hình | Mục đích |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API key cho model |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Base URL của decision model endpoint, cùng với API key tùy chọn |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults, [Evals](../tabs/evals-tab.md) bộ prompt | Model Router (Auto Model) | Chọn model nào của bạn phục vụ mỗi yêu cầu, sử dụng decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Đăng nhập bằng ChatGPT subscription (OAuth) hoặc Codex access token cho runner, cùng với GitHub PAT cho các thao tác repository |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API key của OpenCode Go gateway (base URL tùy chọn) cho runner, cùng với GitHub PAT cho các thao tác repository |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) cho các lệnh gọi GitHub API, thao tác node GitHub, và tích hợp MCP |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center username/password hoặc personal access token, Jira site base URL, deployment mode, và REST API version tùy chọn |
| [Linear](../nodes/linear-node.md) | Linear | Personal API key hoặc OAuth2 cho teams, projects, issues, và comments |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Xác thực cho các yêu cầu |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token và webhook secret tùy chọn |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Application public key để xác minh chữ ký |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Kết nối vector store (Qdrant bên ngoài, hoặc Postgres của Heym thông qua pgvector), với OpenAI hoặc bất kỳ embedding endpoint tương thích OpenAI nào |
| [Slack](../nodes/slack-node.md) | Slack | Webhook hoặc API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Kết nối hộp thư đến |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mail server |
| [Redis](../nodes/redis-node.md) | Redis | Kết nối |
| [Grist](../nodes/grist-node.md) | Grist | API key + server URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key (+ schema mặc định tùy chọn) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + username/password + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token, hoặc public integration Client ID + Client Secret + OAuth consent |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token cùng với base URL self-hosted tùy chọn |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Để biết chi tiết thiết lập (host, port, các trường dành riêng cho nhà cung cấp), xem [Third-Party Integrations](./integrations.md). Tài liệu đó bao gồm thiết lập Telegram bot, email đến qua IMAP, và email đi qua SMTP.

Credentials GitHub cũng có thể bao gồm `base_url` tùy chọn khi bạn đang nhắm đến GitHub
Enterprise Server thay vì GitHub.com. Khi bạn chỉnh sửa credential GitHub để xoay token,
để trống `base_url` sẽ giữ nguyên endpoint Enterprise hiện có. Chỉ nhập URL mới khi
bạn muốn thay đổi endpoint đó.

Credentials Jira, Linear, Supabase, Notion, Sentry, và ClickHouse hiển thị **Test Connection** trong hộp thoại credential. Đối với Jira, kiểm tra này gọi endpoint người dùng hiện tại của Jira. Đối với Linear,
kiểm tra này gọi Linear API với `getViewer` và xác nhận API key hoặc OAuth token hợp lệ.
Khi chỉnh sửa, bạn có thể kiểm tra mà không cần nhập lại API key nếu secret đã lưu vẫn còn. Đối với Notion,
chọn **Internal token** hoặc **OAuth** trong hộp thoại; OAuth sử dụng Client ID và Client Secret
từ public integration Notion của bạn. Xem [Third-Party Integrations](./integrations.md#notion) để
biết chi tiết thiết lập Notion.

## Sử dụng gói lập trình

Tab **AI Defaults** trong [Settings](./user-settings.md) hiển thị mức sử dụng gói lập trình còn lại cho các credential Codex của bạn (sở hữu và được chia sẻ). Với mỗi credential Codex, tab này hiển thị một thanh ngang cho mỗi cửa sổ giới hạn tốc độ đang hoạt động — thường là cửa sổ **5 giờ** và/hoặc **Weekly**, tùy thuộc vào gói của bạn — kèm theo phần trăm hạn mức còn lại và đồng hồ đếm ngược đặt lại. Dữ liệu đến từ các header phản hồi giới hạn tốc độ của backend Codex, được tải theo yêu cầu.

Các credential OpenCode Go cũng được liệt kê ở đó, nhưng được đánh dấu **"usage unavailable"**: gateway OpenCode zen không cung cấp dữ liệu hạn mức còn lại, nên không thể hiển thị thanh nào.

## Trong Expressions

Một số node cho phép expressions dùng cho auth. Sử dụng [Expression DSL](./expression-dsl.md) với `$credentials.CredentialName` để tham chiếu secret đã được giải quyết của một credential bên trong một expression. Để biết dòng header mà mỗi loại credential cần trong một HTTP request, xem [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Các credential Codex được cố ý loại trừ khỏi `$credentials`. Dù bạn đăng nhập bằng ChatGPT (subscription, không tốn chi phí API theo token) hay dán một Codex `access_token`, các token chỉ được truyền đến tiến trình Codex runner cục bộ. Token đăng nhập ChatGPT được làm mới tự động khi hết hạn.

Các credential Jira cũng được loại trừ khỏi `$credentials`. [Jira node](../nodes/jira-node.md) tải credential theo `credentialId` tại thời điểm chạy. Đối với các lệnh gọi Jira REST tùy chỉnh không được Jira node hỗ trợ, hãy dùng [HTTP node](../nodes/http-node.md) với Jira Basic Auth (`email:api_token` cho Jira Cloud hoặc `username:password` cho Data Center / Server), ví dụ `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Bạn cũng có thể dùng credential [Header](../nodes/http-node.md) với `Authorization: Basic <base64(user:secret)>`. Đối với Jira Data Center / Server personal access token, hãy gửi `Authorization: Bearer <token>` thay thế; bản thân credential Jira hỗ trợ điều này thông qua chế độ xác thực **Personal Access Token**.

| Loại credential | Giá trị được cung cấp cho `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Chuỗi Bearer token |
| Header | Dòng `header key: header value` đầy đủ, sẵn sàng để đưa vào đối số `-H` của cURL |
| GitHub | Personal access token |
| Notion | `api_token` nội bộ hoặc `access_token` OAuth (Bearer token cho các lệnh gọi Notion API) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Ví dụ:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Dùng Notion **node** cho các thao tác database, page và block gốc. Dùng `$credentials` khi một [HTTP](../nodes/http-node.md) request tùy chỉnh cần cùng bearer token Notion đó.

## Tạo Credentials từ Chat

[AI Assistant](./ai-assistant.md#credentials), [Chat tab](../tabs/chat-tab.md) và [Chat with Heym](./chat-with-heym.md) có thể tạo một credential khi một workflow cần đến, hoặc bất cứ khi nào bạn yêu cầu. Trợ lý gợi ý loại và tên, và biểu mẫu credential thông thường mở ra trong cuộc trò chuyện. Yêu cầu cập nhật một credential bạn sở hữu và biểu mẫu tương tự sẽ mở trên đó, với các secret được che. Trợ lý chỉ thấy tên và loại. `heym_chat` qua [MCP](../tabs/mcp-tab.md) không thể tạo, cập nhật hoặc chọn credential.

## Liên quan

- [Credentials Tab](../tabs/credentials-tab.md) – Thêm, chỉnh sửa, xóa credentials
- [GitHub Node](../nodes/github-node.md) – Các thao tác GitHub REST gốc
- [Jira Node](../nodes/jira-node.md) – Tự động hóa Jira project, issue, comment, attachment, user, notification và transition
- [Linear Node](../nodes/linear-node.md) – Tự động hóa Linear GraphQL workspace và issue
- [Notion Node](../nodes/notion-node.md) – Tìm kiếm và quản lý nội dung Notion
- [Sentry Node](../nodes/sentry-node.md) – Tự động hóa Sentry organization, project, team, issue, event và release
- [Credentials Sharing](./credentials-sharing.md) – Chia sẻ với người dùng và team
- [Third-Party Integrations](./integrations.md) – Hướng dẫn thiết lập theo từng loại credential
- [Expression DSL](./expression-dsl.md) – `$credentials` trong expressions

## Model Router (Auto Model)

Model Router không giữ key nào. Nó giữ một **decision model credential**, một danh sách các **model option** — mỗi option là một credential OpenAI, Google hoặc Custom hiện có kèm một model — và, với mỗi option, văn bản tự do nói khi nào nên dùng option đó.

Nó xuất hiện trong mọi picker cung cấp model: các node [LLM](../nodes/llm-node.md) và [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, trình tạo expression và Data Tables. Model duy nhất của nó là **Auto**. Chọn nó, và decision model sẽ đọc từng request và định tuyến. [Evals](../tabs/evals-tab.md) loại trừ nó, vì một eval so sánh các model cụ thể còn router tự chọn cho mình.

Một agent định tuyến lại khi vòng lặp tool của nó tiến triển, nên một model rẻ có thể đảm nhận các lượt đầu và một model mạnh hơn đảm nhận lượt cần đến nó. Các input giống hệt nhau tái sử dụng quyết định trước đó, nên một vòng lặp chỉ trả chi phí cho một quyết định khi cuộc trò chuyện thực sự đã thay đổi.

### Những gì nó không thể làm

Auto Model không thể kết hợp với **Responses API**, **Batch mode**, hoặc **image output**. Các toggle đó tự vô hiệu hóa khi một router được chọn, và mỗi toggle nêu lý do. Các kiểm tra Guardrail và bộ phân loại chính sách human-review là những lệnh gọi single-model cố định và không bao giờ định tuyến.

### Khi định tuyến thất bại

Hãy đánh dấu một tùy chọn **Use this option when routing fails** và sự cố ngừng hoạt động của decision model sẽ không bao giờ
khiến một lượt chạy dừng lại; phương án dự phòng sẽ được sử dụng và lý do được ghi lại trên lượt chạy. Nếu không có tùy chọn này,
node sẽ thất bại thay vì đoán mò.

### Xem một yêu cầu đã đi đến đâu

Traces hiển thị `Auto Model / GPT-5` thay vì chỉ riêng model, và chi phí vẫn được quy cho
model thực sự đã chạy. Execution Log và Span View trên canvas hiển thị cùng một cặp,
và Span View liệt kê lượt nào đã đi đến đâu.

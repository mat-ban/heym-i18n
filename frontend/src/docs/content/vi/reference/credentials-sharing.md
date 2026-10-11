# Chia sẻ thông tin xác thực

Credentials có thể được chia sẻ với người dùng khác để workflow của họ có thể sử dụng API key của bạn. Xem [Credentials](./credentials.md) để biết tổng quan và [Credentials Tab](../tabs/credentials-tab.md) để thêm và quản lý credentials.

## Chia sẻ Credentials với LLM

Để cho phép LLM hoặc AI agent sử dụng API key, hãy lưu key dưới dạng credential và để node thực hiện yêu cầu đính kèm nó. Model quyết định gọi cái gì; node xác thực cuộc gọi khi nó chạy.

- **Lưu secret dưới dạng credential.** Các giá trị nhạy cảm được mã hóa khi lưu trữ và được che giấu trong UI sau khi tạo.
- **Tham chiếu nó tại nơi thực hiện yêu cầu.** Các node [LLM](../nodes/llm-node.md) và [Agent](../nodes/agent-node.md) chọn credential model của chúng theo ID, và các yêu cầu HTTP đặt `$credentials.CredentialName` trong auth header. Giữ secret ngoài các trường prompt, vì mọi thứ trong prompt đều được gửi đến nhà cung cấp model dưới dạng văn bản.
- **Cung cấp cho agent các công cụ, không phải key.** Khi một Agent gọi một node HTTP, một MCP server, hoặc một sub-workflow như một công cụ, credential được áp dụng bên trong công cụ đó và model nhận được kết quả của công cụ.
- **Đầu ra được che giấu.** Khi một giá trị credential dài hơn bảy ký tự xuất hiện trong đầu ra của node, chỉ bảy ký tự đầu tiên được giữ lại, vì vậy một phản hồi lặp lại key chỉ hiển thị tiền tố đó trong kết quả và traces. Xem [Output Masking](#output-masking).
- **Để trợ lý tạo credentials.** Khi [AI Assistant](./ai-assistant.md#credentials) hoặc tab Chat tạo một credential, nó chỉ thấy tên và loại, và bạn nhập secret trong biểu mẫu credential thông thường.
- **Chia sẻ với mọi người theo cùng cách.** Chia sẻ credential với một người dùng hoặc một team, như mô tả bên dưới, và workflow của họ có thể sử dụng key của bạn thông qua các node LLM và Agent của riêng họ.

## Mô hình chia sẻ

- **CredentialShare** – Liên kết `credential_id` với `user_id` (duy nhất cho mỗi cặp)
- **Chia sẻ qua email** – `POST /api/credentials/{credential_id}/shares` với email; người dùng được tra cứu và thêm vào
- **Thu hồi** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Bạn cũng có thể chia sẻ credentials với [Teams](./teams.md):

- **CredentialTeamShare** – Liên kết `credential_id` với `team_id`; tất cả thành viên team đều có quyền truy cập
- **Chia sẻ với team** – `POST /api/credentials/{credential_id}/team-shares` với `team_id`
- **Thu hồi chia sẻ team** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Credentials được chia sẻ hiển thị một chỉ báo trong UI [Credentials Tab](../tabs/credentials-tab.md).

## Credentials có phạm vi rộng

Chia sẻ một credential cấp cho người nhận mọi thứ mà credential đó có thể làm. Đối với hầu hết các tích hợp, điều đó được giới hạn trong một workspace hoặc quyền của một API key, nhưng một số credentials rộng hơn nhiều.

> **Credentials Google Drive cấp toàn quyền truy cập Drive.** Credential [Google Drive](../nodes/google-drive-node.md) được ủy quyền với scope `https://www.googleapis.com/auth/drive` để node có thể thao tác trên các tệp bạn đã sở hữu. Chia sẻ nó với một người dùng hoặc một team sẽ cho từng người trong số họ khả năng **đọc, sửa đổi và xóa vĩnh viễn bất kỳ thứ gì trong Google Drive của bạn** thông qua một workflow — không chỉ những tệp bạn đã nghĩ đến. Chỉ chia sẻ nó với những người mà bạn sẽ cấp toàn quyền truy cập Drive trực tiếp.

Nếu bạn cần giới hạn mức độ phơi bày, hãy tạo một tài khoản Google chuyên dụng chỉ có quyền truy cập vào các thư mục mà workflow cần, và kết nối credential với tài khoản đó thay vì tài khoản chính của bạn.

Một credential **Decision Model** mang theo endpoint và, khi được đặt, một API key. Chia sẻ nó cho phép người nhận chi tiêu dựa trên key đó từ bất kỳ workflow nào họ có thể chạy, giống hệt như một credential LLM.

Một credential **Model Router** chia sẻ mọi thứ mà nó định tuyến đến. Những người bạn chia sẻ có thể chạy các yêu cầu đối với mọi credential trong danh sách tùy chọn của nó, và những yêu cầu đó chi tiêu key của bạn. Họ không thể đọc các key, và các credential không xuất hiện trong danh sách credential của riêng họ.

Đây là cùng một quyền cấp như chia sẻ trực tiếp một credential OpenAI, và đó là điều làm cho một router hữu ích cho một team. Nếu bạn không muốn điều đó, hãy chia sẻ từng credential riêng lẻ thay vào đó và để mỗi người tự chọn một model.

## Chia sẻ với Cộng tác viên Workflow

Khi bạn chia sẻ một workflow, cộng tác viên có thể mở và chạy nó nhưng không thể sử dụng credentials của bạn trừ khi bạn chia sẻ cả những credentials đó với họ. Điều này áp dụng cho credentials trong workflow chính và trong bất kỳ sub-workflow nào mà nó gọi. Chia sẻ từng credential với cùng những người dùng hoặc team mà bạn đã mời vào workflow. Sub-workflow cũng phải được chia sẻ riêng từ trình soạn thảo của workflow con. Xem [Workflow Organization](./workflow-organization.md#sharing-workflows).

## Ngữ cảnh thực thi

Khi một workflow chạy, credentials được giải quyết cho **chủ sở hữu workflow** (hoặc người dùng hiện tại khi chạy). `get_credentials_context()` hợp nhất:

1. **Credentials sở hữu** – `Credential.owner_id == user_id`
2. **Credentials được chia sẻ cho người dùng** – `CredentialShare` trong đó `CredentialShare.user_id == user_id`
3. **Credentials được chia sẻ cho team** – `CredentialTeamShare` trong đó người dùng là thành viên của team

Tất cả được hợp nhất vào một dict ngữ cảnh duy nhất được đánh khóa theo tên credential.

## Sử dụng trong Workflows
### Theo Tên (Expression DSL)

Credentials được hiển thị dưới dạng `$credentials.CredentialName` trong [Expression DSL](./expression-dsl.md). Sử dụng cách này cho:

- Node HTTP (xác thực Bearer/Header)
- Node Telegram
- Node Slack
- Notion bearer token trong các yêu cầu HTTP tùy chỉnh (internal token hoặc OAuth access token)
- Bất kỳ node nào chấp nhận biểu thức cho xác thực

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Theo ID (credentialId)

Một số node lưu trữ `credentialId` (UUID) trong `node.data`:

| Loại Node | Trường | Mô tả |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Credential API LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Credential access token Codex và credential GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Credential gateway OpenCode Go và credential GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Credential email/API token Jira Cloud hoặc username/password Data Center |
| [Notion](../nodes/notion-node.md) | `credentialId` | Credential internal token hoặc OAuth workspace Notion |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Auth token Sentry và base URL tùy chọn |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL dự án Supabase và API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Thông tin kết nối ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Credential bot Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Public key hoặc credential webhook Discord |
| Vector Store | `credential_id` | Vector DB Qdrant hoặc Postgres (pgvector), thông qua credential RAG Qdrant, Psql hoặc Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Credential model; credential model hoặc Decision Model cho LLM-as-Judge judge |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | Model LLM/Vision (cho AI step và [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor tải credential trực tiếp từ database theo ID và giải mã config.

## Che Giấu Đầu Ra

Sau khi thực thi, `mask_sensitive_output()` che giấu các giá trị credential trong đầu ra, giữ lại bảy ký tự đầu tiên của mỗi secret dài hơn bảy ký tự và thay thế phần còn lại bằng `**`, để các secret không bị lộ trong kết quả hoặc traces.

## Liên Quan

- [Tab Credentials](../tabs/credentials-tab.md) – Thêm và chia sẻ credentials
- [Tích Hợp Bên Thứ Ba](./integrations.md) – Thiết lập chi tiết cho từng loại credential
- [Teams](./teams.md) – Chia sẻ với teams
- [Expression DSL](./expression-dsl.md) – Cú pháp `$credentials`
- [Các Loại Node](./node-types.md) – Các node sử dụng credentials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Node Agent](../nodes/agent-node.md) – Sử dụng `credentialId` cho LLM

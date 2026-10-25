# Credentials

Credentials 用於儲存 workflow 節點所使用的 API keys 與 secrets。您可以在 [Credentials Tab](../tabs/credentials-tab.md) 中新增它們，並在節點設定中以名稱引用。

## Credentials 是什麼

- **依使用者儲存** – 每個 credential 屬於一位使用者，並可[分享](./credentials-sharing.md)給其他使用者或 [Teams](./teams.md)。
- **靜態加密** – 敏感值會經過加密；建立後 UI 會將其遮蔽。
- **以名稱引用** – 節點以名稱（或 ID）選取 credential。執行引擎會在執行時為 workflow 擁有者解析該 credential。

## 節點如何使用它們

| 節點類型 | 典型 credential | 用途 |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Evals](../tabs/evals-tab.md) | OpenAI、Google、Custom | 模型的 API key |
| [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md) judge | Decision Model | decision model endpoint 的 Base URL，以及選用的 API key |
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults | Model Router (Auto Model) | 使用 decision model 挑選由您的哪個模型來服務每個請求 |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | ChatGPT 訂閱登入（OAuth）或供 runner 使用的 Codex access token，以及用於 repository 操作的 GitHub PAT |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | 供 runner 使用的 OpenCode Go gateway API key（選用 base URL），以及用於 repository 操作的 GitHub PAT |
| [Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md) | GitHub | 用於 GitHub API 呼叫、GitHub 節點操作及 MCP 整合的 GitHub personal access token（PAT） |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token、Data Center 使用者名稱/密碼或 personal access token、Jira site base URL、部署模式，以及選用的 REST API 版本 |
| [Linear](../nodes/linear-node.md) | Linear | 用於 teams、projects、issues 及 comments 的 Personal API key 或 OAuth2 |
| [HTTP](../nodes/http-node.md) | Bearer、Header | 請求的驗證 |
| [Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token 及選用的 webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | 用於簽章驗證的 Application public key |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、RAG: Custom Embeddings | Vector store 連線（外部 Qdrant，或 Heym 自身透過 pgvector 的 Postgres），搭配 OpenAI 或任何 OpenAI 相容的 embedding endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook 或 API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP |  inbound mailbox 連線 |
| [Send Email](../nodes/send-email-node.md) | SMTP | Mail server |
| [Redis](../nodes/redis-node.md) | Redis | 連線 |
| [Grist](../nodes/grist-node.md) | Grist | API key + server URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 同意 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 同意 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 同意 |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key（+ 選用的預設 schema） |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + 使用者名稱/密碼 + database（+ secure） |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token，或 public integration 的 Client ID + Client Secret + OAuth 同意 |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token 及選用的 self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key、secret key、region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

關於詳細設定（hosts、ports、各供應商專屬欄位），請參閱[第三方整合](./integrations.md)。其中包含 Telegram bot 設定、透過 IMAP 的 inbound email，以及透過 SMTP 的 outbound email。

當您的目標是 GitHub Enterprise Server 而非 GitHub.com 時，GitHub credentials 也可包含選用的 `base_url`。當您編輯 GitHub credential 以輪替 token 時，將 `base_url` 留空會保留現有的 Enterprise endpoint。僅在您想變更該 endpoint 時才輸入新的 URL。

Jira、Linear、Supabase、Notion、Sentry 及 ClickHouse credentials 會在 credential 對話框中顯示 **Test Connection**。對於 Jira，該檢查會呼叫 Jira 的 current user endpoint。對於 Linear，該檢查會以 `getViewer` 呼叫 Linear API，並確認 API key 或 OAuth token 有效。編輯時，若已儲存的 secret 仍存在，您可以在不重新輸入 API key 的情況下進行測試。對於 Notion，請在對話框中選擇 **Internal token** 或 **OAuth**；OAuth 會使用您 Notion public integration 的 Client ID 與 Client Secret。Notion 設定詳細資訊請參閱[第三方整合](./integrations.md#notion)。

## Coding-package 用量

[Settings](./user-settings.md) 中的 **AI Defaults** 分頁會顯示您的 Codex 認證（自有與共用）剩餘的 coding-package 用量。對於每個 Codex 認證，它會針對每個作用中的 rate-limit 視窗——通常是 **5 小時**及/或**每週**視窗，視您的方案而定——繪製一條水平長條，顯示剩餘配額百分比與重置倒數計時。資料來自 Codex 後端的 rate-limit 回應標頭，並依需求擷取。

OpenCode Go 認證也會列於該處，但標示為 **「usage unavailable」**：OpenCode zen gateway 並未暴露剩餘配額資料，因此無法顯示任何長條。

## 在 Expressions 中

部分節點允許以 expressions 進行驗證。使用 [Expression DSL](./expression-dsl.md) 搭配 `$credentials.CredentialName`，即可在 expression 內引用某個認證解析後的密鑰。關於各認證類型在 HTTP 請求中所需的標頭行，請參閱 [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials)。

Codex 認證刻意排除於 `$credentials` 之外。無論您是使用 ChatGPT 登入（訂閱制，無 per-token API 費用），或貼上 Codex `access_token`，這些 token 只會傳遞給本機的 Codex runner 程序。ChatGPT 登入 token 會在過期時自動更新。

Jira 認證同樣排除於 `$credentials` 之外。[Jira 節點](../nodes/jira-node.md)會在執行時依 `credentialId` 載入認證。對於 Jira 節點未涵蓋的自訂 Jira REST 呼叫，請使用 [HTTP 節點](../nodes/http-node.md)搭配 Jira Basic Auth（Jira Cloud 使用 `email:api_token`，Data Center / Server 使用 `username:password`），例如 `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`。您也可以使用 [Header](../nodes/http-node.md) 認證搭配 `Authorization: Basic <base64(user:secret)>`。對於 Jira Data Center / Server 的 personal access token，請改傳送 `Authorization: Bearer <token>`；Jira 認證本身透過其 **Personal Access Token** 驗證模式支援此功能。

| 認證類型 | 暴露給 `$credentials.Name` 的值 |
|-----------------|--------------------------------------|
| Bearer | Bearer token 字串 |
| Header | 完整的 `header key: header value` 行，可直接放入 cURL 的 `-H` 參數 |
| GitHub | Personal access token |
| Notion | 內部 `api_token` 或 OAuth `access_token`（用於 Notion API 呼叫的 Bearer token） |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

範例：

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

原生資料庫、頁面與區塊操作請使用 Notion **節點**。當自訂 [HTTP](../nodes/http-node.md) 請求需要相同的 Notion bearer token 時，請使用 `$credentials`。

## 從 Chat 建立認證

[AI Assistant](./ai-assistant.md#credentials)、[Chat 分頁](../tabs/chat-tab.md)與 [Chat with Heym](./chat-with-heym.md) 可在 workflow 需要認證時，或您隨時要求時建立認證。助理會建議類型與名稱，並在對話中開啟一般認證表單。若您要求更新自己擁有的認證，同一份表單會以該認證開啟，並將其密鑰遮蔽。助理只會看到名稱與類型。透過 [MCP](../tabs/mcp-tab.md) 的 `heym_chat` 無法建立、更新或選擇認證。

## 相關內容

- [Credentials 分頁](../tabs/credentials-tab.md) – 新增、編輯、刪除認證
- [GitHub 節點](../nodes/github-node.md) – 原生 GitHub REST 操作
- [Jira 節點](../nodes/jira-node.md) – Jira 專案、issue、留言、附件、使用者、通知與 transition 自動化
- [Linear 節點](../nodes/linear-node.md) – Linear GraphQL workspace 與 issue 自動化
- [Notion 節點](../nodes/notion-node.md) – 搜尋與管理 Notion 內容
- [Sentry 節點](../nodes/sentry-node.md) – Sentry 組織、專案、團隊、issue、事件與 release 自動化
- [Credentials Sharing](./credentials-sharing.md) – 與使用者及團隊分享
- [Third-Party Integrations](./integrations.md) – 各認證類型的設定指南
- [Expression DSL](./expression-dsl.md) – expressions 中的 `$credentials`

## Model Router（Auto Model）

Model Router 不持有任何 key。它持有一個**決策模型認證**、一份**模型選項**清單——每一項皆為現有的 OpenAI、Google 或 Custom 認證加上一個模型——以及針對每個選項，以自由文字說明該選項應於何時使用。

它會出現在每個提供模型選擇的挑選器中：[LLM](../nodes/llm-node.md) 與 [Agent](../nodes/agent-node.md) 節點、Chat、AI Defaults、Dashboards、expression builder 與 Data Tables。它唯一的模型是 **Auto**。選擇它之後，決策模型會讀取每個請求並進行路由。[Evals](../tabs/evals-tab.md) 則不納入它，因為 eval 會比較特定模型，而 router 會自行挑選。

Agent 會在其 tool loop 推進時重新路由，因此便宜的模型可以負責前幾輪，較強的模型則負責需要它的那一輪。相同的輸入會重用先前的決策，因此 loop 只有在對話確實有所推進時，才會付出一次決策的成本。

### 它無法做到的事

Auto Model 無法與 **Responses API**、**Batch mode** 或 **image output** 合併使用。當選取 router 時，這些切換項會自行停用，並各自說明原因。Guardrail 檢查與 human-review policy classifier 是固定的單一模型呼叫，永遠不會進行路由。

### 當路由失敗時

將其中一個選項標記為 **Use this option when routing fails**，決策模型中斷就永遠不會讓一次執行停擺；系統會改用備援選項，並在該次執行上記錄原因。若未設定此選項，節點會直接失敗，而不會自行猜測。

### 查看請求被導向何處

Traces 會顯示 `Auto Model / GPT-5`，而非僅顯示模型本身，成本也仍歸屬於實際執行的模型。畫布的 Execution Log 與 Span View 會顯示相同的配對，而 Span View 會列出哪一輪對話被導向何處。

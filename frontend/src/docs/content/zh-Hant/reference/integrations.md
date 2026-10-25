# 第三方整合

Heym 透過 **credentials** 連接外部服務。每種 credential 類型會儲存單一服務的連線詳細資訊，並可跨多個節點與 Workflow 重複使用。請參閱 [Credentials](./credentials.md) 以取得概觀。

在 [Settings → Credentials](../tabs/credentials-tab.md) 中新增 credentials。所有值在靜態儲存時皆會加密。Credentials 可[分享](./credentials-sharing.md)給其他使用者或 [Teams](./teams.md)。

部分整合節點**不**需要 credentials。[WebSocket Trigger](../nodes/websocket-trigger-node.md) 與 [WebSocket Send](../nodes/websocket-send-node.md) 會使用直接於節點上設定的 URL、headers 與 subprotocols 連接外部 sockets。

## Credential 類型一覽

| 類型 | 使用者 | 關鍵欄位 |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`、選用 `base_url` |
| **Google** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Agent](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md) | `api_key`、選用 `base_url` |
| **Jira** | [Jira 節點](../nodes/jira-node.md) | `api_token`、`base_url`、`deployment`、`auth_mode`、`email`（僅限 Basic auth）、選用 `api_version` |
| **Linear** | [Linear 節點](../nodes/linear-node.md) | `api_key`，或 `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry 節點](../nodes/sentry-node.md) | `api_token`、選用 `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md) | `api_key`、`base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md)、[Evals](../tabs/evals-tab.md)（LLM-as-Judge 評審） | `base_url`、選用 `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、Chat、AI Defaults | 一個 decision model credential，以及參照您其他 credentials 的 model options |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `qdrant_host`、`openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md)、Vectorstores | `openai_api_key`（vectors 透過 pgvector 儲存於 Heym 自有的 Postgres） |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md)、Vectorstores | `embedding_base_url`、`embedding_model`、`embedding_dimensions`、`db_type`、選用 `embedding_api_key`，以及當 `db_type` 為 `qdrant` 時的 `qdrant_host` |
| **Grist** | [Grist 節點](../nodes/grist-node.md) | `api_key`、`server_url` |
| **Google Sheets** | [Google Sheets 節點](../nodes/google-sheets-node.md) | `client_id`、`client_secret` + OAuth2 同意 |
| **Google Drive** | [Google Drive 節點](../nodes/google-drive-node.md) | `client_id`、`client_secret` + OAuth2 同意（完整 Drive 範圍） |
| **BigQuery** | [BigQuery 節點](../nodes/bigquery-node.md) | `client_id`、`client_secret` + OAuth2 同意 |
| **Supabase** | [Supabase 節點](../nodes/supabase-node.md) | `supabase_url`、`supabase_key`、選用 `supabase_schema` |
| **ClickHouse** | [ClickHouse 節點](../nodes/clickhouse-node.md) | `host`、`port`、`username`、`password`、`database`、`secure` |
| **Notion** | [Notion 節點](../nodes/notion-node.md) | `api_token`，或 `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 節點](../nodes/amazon-s3-node.md) | `aws_access_key_id`、`aws_secret_access_key`、`aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`、`port`、`email`、`password` |
| **IMAP** | [IMAP Trigger 節點](../nodes/imap-trigger-node.md) | `imap_host`、`imap_port`、`imap_username`、`imap_password` |
| **Telegram** | [Telegram Trigger 節點](../nodes/telegram-trigger-node.md)、[Telegram 節點](../nodes/telegram-node.md) | `bot_token`、選用 `secret_token` |
| **Discord** | [Discord 節點](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger 節點](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ 節點](../nodes/rabbitmq-node.md) | `rabbitmq_host`、`rabbitmq_username`、`rabbitmq_password` |
| **Redis** | [Redis 節點](../nodes/redis-node.md) | `host`、`port`、`password` |
| **Slack** | [Slack 節點](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger 節點](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP 節點](../nodes/http-node.md) | `token` |
| **Header** | [HTTP 節點](../nodes/http-node.md) | `header_key`、`header_value` |
| **FlareSolverr** | [Crawler 節點](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

GitHub credential 會儲存 GitHub personal access token（PAT），讓 Workflow 可透過 [GitHub 節點](../nodes/github-node.md) 呼叫 GitHub REST API、將 token 傳入諸如 `@modelcontextprotocol/server-github` 的 MCP servers，或從 [HTTP 節點](../nodes/http-node.md) 使用它進行自訂 REST 呼叫。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `api_key` | GitHub personal access token（`github_pat_...` 精細權限 PAT 或經典 `ghp_...` PAT） |
### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `base_url` | GitHub Enterprise Server 的 GitHub API base URL（例如 `https://github.example.com/api/v3`） |

### 備註

- 建議盡可能使用精細個人存取權杖（fine-grained personal access token），因為您可以將其範圍限定於特定儲存庫與權限。
- 若使用 GitHub.com，請將 `base_url` 留空。若使用 GitHub Enterprise Server，請使用完整的 REST API
  endpoint，包含 `/api/v3`（例如 `https://github.example.com/api/v3`），而非
  伺服器的 Web UI 根路徑，例如 `https://github.example.com`。
- 此憑證目前僅支援 PAT 為基礎的驗證。若要存取組織儲存庫，請使用已獲授必要組織/儲存庫權限的 PAT。
- GitHub App 安裝權杖與 GitHub App 設定流程目前並非 Heym UI 的一級支援項目。
- 原生儲存庫、使用者、issue、pull request、review、release、Actions workflow、流量與檔案操作，請優先使用 [GitHub 節點](../nodes/github-node.md)。僅當您需要 GitHub 節點未涵蓋的 endpoint 或 payload 時，才使用 [HTTP 節點](../nodes/http-node.md)。
- 若要搭配 MCP 使用 [Agent 節點](../nodes/agent-node.md)，請將 `$credentials.YourGitHubCredential` 傳入 MCP 連線環境變數，例如 `GITHUB_PERSONAL_ACCESS_TOKEN`。
- GitHub 的 REST API 通常要求 `Authorization: Bearer <token>` 以及 `Accept: application/vnd.github+json`。
- 編輯 GitHub 憑證時，將 GitHub Enterprise 的 `base_url` 留空會保留
  現有的 endpoint。僅當您想變更該 endpoint 時，才輸入新的 URL。

### 使用者

- [GitHub 節點](../nodes/github-node.md)
- [Codex 節點](../nodes/codex-node.md)
- [Agent 節點](../nodes/agent-node.md)
- [HTTP 節點](../nodes/http-node.md)

---

## Decision Model

Decision model 會針對狀態回答具型別的提問，並回傳機率而非文字。TypeSafe 的 Jev 是參考實作；任何接受相同 `{model, state, questions}` 主體的 endpoint 皆可運作，而 [Decision](../nodes/decision-node.md) 節點可為不支援的 endpoint 傳送手寫的主體。

### 必填欄位

- `base_url` – endpoint，例如 `https://api.typesafe.ai`。Heym 會附加 `/v1/systemone`。

### 選填欄位

- `api_key` – 以 `Authorization: Bearer` 傳送。不需要金鑰的 endpoint 可將此欄位留空。

### 備註

- **Test Connection** 會傳送一個極小的問題，以確認 endpoint 與金鑰可正常運作。
- 編輯憑證時，若金鑰欄位留空，則會保留已儲存的金鑰。
- 對私有與 loopback 位址的對外請求預設會被封鎖，因此位於 `localhost` 或私有網段的自我託管 endpoint 需要設定 `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`。
- 這些 model 不存在於 Heym 同步的 LLM 定價表中，因此 [Traces](../tabs/traces-tab.md) 中的 Cost 欄位會保持空白。Token 計數仍會記錄。

### 使用者

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – 依據預期輸出為 `LLM-as-Judge` 答案評分

## OpenAI Codex

OpenAI Codex 憑證用於驗證 [Codex 節點](../nodes/codex-node.md)。它與 LLM、Agent 及 RAG 節點所使用的 OpenAI API key 憑證是分開的。

### 驗證模式

| 模式 | 說明 |
|------|-------------|
| **Sign in with ChatGPT**（建議） | 使用您的 ChatGPT Plus/Pro 訂閱的 OAuth（PKCE）登入，因此執行時可避免依 Token 計費的 API 成本。Heym 會儲存並自動重新整理 Token 組合。 |
| **Access token** | 僅傳遞至本機 Codex CLI 程序的 ChatGPT/Codex `access_token`。 |

### 備註

- 此憑證類型不接受 API key。
- Codex Token 不會透過 `$credentials.Name` 暴露。
- Codex 節點還需要 GitHub 憑證，以進行儲存庫複製、分支推送與草稿 PR 建立。

### 使用者

- [Codex 節點](../nodes/codex-node.md)

## OpenCode Go

OpenCode Go 憑證用於驗證 [OpenCode Go 節點](../nodes/opencode-go-node.md)。它會儲存 OpenCode Go gateway API key（來自 [opencode.ai/go](https://opencode.ai/go)）以及選用的 gateway base URL。

### 欄位

| 欄位 | 說明 |
|-------|-------------|
| **API Key** | OpenCode Go gateway API key（必填）。 |
| **Gateway Base URL** | 選填；預設為 `https://opencode.ai/zen/go/v1`。僅在自我託管或代理的 gateway 時才需覆寫。 |

### 備註

- API key 僅會傳遞至強化容器內的 OpenCode CLI 程序。
- OpenCode Go 節點還需要 GitHub 憑證，以進行儲存庫複製、分支推送與 pull request 建立。GitHub Token 絕不會置於沙箱容器內。

### 使用者

- [OpenCode Go 節點](../nodes/opencode-go-node.md)

---

## Linear

Linear 憑證支援個人 API key 或 OAuth2，用於
[Linear 節點](../nodes/linear-node.md)。Heym 會向 Linear 傳送原生 GraphQL 查詢，以取得工作區
中繼資料、專案、issue 與留言。
### 設定

選擇一種驗證模式：

**個人 API key**

1. 在 Linear 中，開啟 **Settings → Security & Access → Personal API keys**。
2. 建立一組可存取您欲自動化之 workspace 的 key。
3. 將該 key 貼入 Heym 中的 Linear 認證，並使用 **Test Connection** 進行驗證。

**OAuth2**

1. 建立一個 Linear OAuth 應用程式。
2. 將 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 註冊為 redirect URI。
3. 在 Heym Dashboard → **Credentials** → **New** → 類型選擇 **Linear**。
4. 選擇 **OAuth2**，輸入 Client ID 與 Client Secret，然後點擊 **Connect**。

### 必填欄位

| 模式 | 欄位 | 說明 |
|------|-------|-------------|
| Personal API key | `api_key` | Linear 個人 API key，通常以 `lin_api_` 為前綴 |
| OAuth2 | `client_id` | 來自 Linear OAuth 應用程式的 Client ID |
| OAuth2 | `client_secret` | 來自 Linear OAuth 應用程式的 Client Secret |

OAuth token（`access_token`、`refresh_token`、`token_expiry`）會自動儲存並更新。

### 備註

- Personal API key 與 OAuth token 會以建立或授權它們的 Linear 使用者身分運作。
- Linear OAuth 使用 `read,write,issues:create,comments:create` 這些 scope。
- 在認證對話框中使用 **Test Connection**，以針對 Linear API 驗證 API key 或 OAuth token。
- 在 Linear 節點中使用 List Teams 與 List Projects，以便在建立或篩選 issue 之前探索 UUID。
- 使用 List Workflow States 與 List Team Members，以探索更新時所需的 state 與 assignee UUID。
- 若要輪替 API key，請編輯認證並輸入替換值。若您輪替 OAuth 應用程式密鑰，請透過 **Connect** 重新連接認證。

### 使用者

- [Linear 節點](../nodes/linear-node.md)

---

## Jira

Jira 認證會儲存 Jira Basic auth 認證或 Data Center 個人存取 token（PAT）、Jira 站台 base URL、部署模式，以及選用的 REST API 版本，供 [Jira 節點](../nodes/jira-node.md) 使用。Jira Cloud 請使用 `cloud`，Jira Data Center / Server 請使用 `data_center`。

### 設定

**Jira Cloud**

1. 在 Atlassian 帳號設定中，建立一組 API token。
2. 在 Heym Dashboard → **Credentials** → **New** → 類型選擇 **Jira**。
3. 輸入 Atlassian 電子郵件、API token，以及 Jira 站台 URL，例如 `https://your-domain.atlassian.net`。
4. 使用 **Test Connection** 驗證認證。

**Jira Data Center / Server**

1. 選擇 **Jira Data Center / Server** 作為部署模式。
2. 選擇驗證方法。**使用者名稱與密碼** 使用 Basic auth。**Personal Access Token** 使用 `Authorization: Bearer <token>`，需要 Jira Data Center / Server 8.14 或更新版本。請在 Jira 的 **個人檔案 → Personal Access Tokens** 下建立 token。
3. 輸入 Jira 使用者名稱與密碼，或貼上個人存取 token（無需使用者名稱）。
4. 輸入 Jira 網站 URL，例如 `https://jira.example.com`。
5. 使用 **Test Connection** 驗證 credential。

### 欄位

| 欄位 | 說明 |
| --- | --- |
| `auth_mode` | `basic`（缺失時預設）或 `pat`。`pat` 僅對 `data_center` 有效 |
| `email` | Jira Cloud Atlassian 帳戶電子郵件或 Jira Data Center / Server 使用者名稱。在 `pat` 模式下不使用 |
| `api_token` | Jira Cloud Atlassian API token、用於 Basic auth 的 Jira Data Center / Server 密碼，或 `pat` 模式下的 Data Center 個人存取 token |
| `base_url` | Jira 站台 base URL |
| `deployment` | Jira Cloud 請使用 `cloud`，Jira Data Center / Server 請使用 `data_center` |
| `api_version` | REST API 版本；Jira Cloud 預設為 `3`。Data Center / Server 使用 v2 |

### 備註

- Jira 節點會以 Atlassian Document Format 文字文件的形式傳送 issue 描述與留言，適用於 Jira Cloud REST API v3。Data Center / Server 認證則傳送純文字。
- Data Center / Server 支援使用者名稱/密碼 Basic auth 以及使用 Bearer 配置的個人存取 token（PAT）驗證。PAT 驗證需要 Jira Data Center / Server 8.14 或更新版本。
- 附件上傳接受 base64 或 data URL 內容，並受平台檔案大小限制（預設 99 MB）。啟用後，附件下載可回傳 base64 內容。
- 建立使用者、刪除使用者，以及 issue 通知，皆需要已驗證的 Jira 帳號具備相關的 Jira 站台或組織權限。
- 使用 List Projects、Search Issues 與 List Transitions，以探索 project key、issue key 與 transition ID。
- 針對 Jira 節點未涵蓋的自訂 endpoint，請在 cURL 命令中使用帶有 Jira Basic Auth（Cloud 使用 `email:api_token`，Data Center / Server 使用 `username:password`）或 PAT Bearer auth（Data Center / Server 使用 `Authorization: Bearer <token>`）的 [HTTP 節點](../nodes/http-node.md)。或者，使用帶有相應 `Authorization` 標頭的 Header credential。

另請參閱：

- [Jira 節點](../nodes/jira-node.md)
- [認證](./credentials.md)

---

## Sentry

Sentry 認證會儲存 [Sentry 節點](../nodes/sentry-node.md) 的 auth token。Heym 使用 Sentry 的 REST API 進行組織、專案、團隊、issue、event 與 release 操作。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `api_token` | 可存取您欲自動化之組織與專案的 Sentry auth token |

### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `base_url` | 自架 Sentry 的選用根 URL，例如 `https://sentry.example.com` |

### 備註

- Sentry SaaS 請將 `base_url` 留空。
- 使用 **Test Connection** 確認該 token 可列出可見的組織。
- 若需自訂 REST 呼叫，請使用 `$credentials.YourSentryCredential` 作為 bearer token。

### 使用者

- [Sentry 節點](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) 是一套開源向量資料庫，用於語意搜尋與 RAG（Retrieval Augmented Generation）。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `qdrant_host` | 您 Qdrant 執行個體的完整 URL（例如 `http://localhost:6333` 或雲端 endpoint） |
| `openai_api_key` | 用於在索引與搜尋文件時產生 embedding 的 OpenAI API key |
### 備註

- Qdrant collection 是從 [Vectorstores](../tabs/vectorstores-tab.md) 分頁進行管理。每個 vector store 對應一個 Qdrant collection。
- [RAG 節點](../nodes/rag-node.md) 使用 vector store（其參照 Qdrant 認證）——它不會直接參照該認證。
- 若您的 Qdrant 執行個體需要 API key，請將其包含在 `qdrant_host` 值中，或據此設定 Qdrant；目前的整合沒有獨立的 Qdrant API key 欄位。
- 自架 Qdrant：使用[官方 Docker 映像](https://hub.docker.com/r/qdrant/qdrant)並開放連接埠 `6333`。

### 使用對象

- [RAG 節點](../nodes/rag-node.md)（透過 vector store）
- [Vectorstores 分頁](../tabs/vectorstores-tab.md)

## 自訂 Embeddings（RAG）

RAG embeddings 預設來自 OpenAI。**RAG: Custom Embeddings** 認證則改為指向任何與 OpenAI 相容的 embeddings endpoint——Ollama、vLLM、Text Embeddings Inference、LM Studio、Together 或代管閘道——並指定其寫入的 vector store。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `embedding_base_url` | 包含 `/v1` 路徑的 Endpoint URL，例如 `http://localhost:11434/v1` |
| `embedding_api_key` | 選填。本機伺服器通常不需要 key |
| `embedding_model` | Endpoint 預期的模型名稱，例如 `nomic-embed-text` |
| `embedding_dimensions` | 模型回傳的向量寬度（預設為 `1536`） |
| `embedding_request_dimensions` | 選填。要求 endpoint 回傳 `embedding_dimensions`，而非模型的原生寬度 |
| `db_type` | `qdrant` 或 `pgvector` |
| `qdrant_host`、`qdrant_port`、`qdrant_api_key` | Qdrant 連線資訊，當 `db_type` 為 `qdrant` 時為必填 |

### 備註

- **Qdrant 接受任意維度數量。** 每個 collection 會以此認證所宣告的寬度建立，因此 Dimensions 欄位可自由編輯。
- **Postgres（pgvector）要求恰好 1536 個維度。** 其欄位為固定的 `vector(1536)`，因此 Dimensions 欄位固定為 1536，而宣告任何其他寬度的認證會在儲存時遭到拒絕。
- **為 pgvector 縮短維度。** 當 store 為 Postgres 時，對話方塊會提供 *Ask the endpoint to return 1536 dimensions*。這會送出 `dimensions` 請求參數，而以 Matryoshka 表徵訓練的模型（OpenAI `text-embedding-3-*`、`nomic-embed-text-v1.5`、`jina-v3` 及類似模型）會遵守此參數，回傳縮短但仍具意義的向量。不支援此參數的 endpoint 會拒絕該請求，而接受但忽略此參數的 endpoint 會產生明確的錯誤，指出實際回傳的寬度。Heym 絕不會自行截斷向量，因為對非 Matryoshka 模型的輸出進行切片會無聲地降低檢索品質。Qdrant 不提供此選項，因為它可以將 collection 調整為任意寬度。
- 在建立 store 之前，使用認證對話方塊中的 **Test Connection** 來嵌入探測字串，並查看模型實際回傳的寬度。
- `dimensions` 請求參數只會送給 OpenAI 本身，因為大多數與 OpenAI 相容的伺服器會拒絕未知參數。模型的原生寬度則會改為對照認證進行驗證。
- 現有的 **RAG: Qdrant + OpenAI** 與 **RAG: Psql + OpenAI** 認證維持不變並持續運作。

### 使用對象

- [RAG 節點](../nodes/rag-node.md)（透過 vector store）
- [Vectorstores 分頁](../tabs/vectorstores-tab.md)

## Postgres（pgvector）

Heym 也可以使用 [pgvector](https://github.com/pgvector/pgvector) 擴充功能，將向量儲存於**其自身的 Postgres 資料庫中**——無需外部向量服務。建立 **RAG: Psql + OpenAI** 認證，並在建立 vector store 時使用它，然後在 RAG 節點的 Database 下拉式選單中選擇 **Postgres (pgvector)**。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `openai_api_key` | 在索引與搜尋文件時用於產生 embeddings 的 OpenAI API key |

### 備註

- 不需要 host/port——向量會寫入 Heym 自身的資料庫；Heym 絕不會連線至其他資料庫。
- 所有與 Qdrant 搭配使用的 RAG 功能（插入、搜尋、中繼資料篩選、Cohere 重排序、複製、分享）在 Postgres 後端上皆以相同方式運作。
- 需要 `vector` 擴充功能。Heym 保持官方 `postgres:16` 映像不變（因此絕不會更動現有資料），並**在啟動時自動安裝 `postgresql-16-pgvector` 套件**——`run.sh`、`deploy.sh` 與 `run_e2e.sh` 皆會處理此作業。此安裝為非致命性：若無法執行（例如無網路），Qdrant RAG 會繼續運作，而 Postgres 後端則保持停用（遷移會優雅地略過該資料表）。
- 若您將已發佈的單一容器映像（`ghcr.io/heymrun/heym`）對**您自己的外部 Postgres** 執行，該資料庫必須支援 `vector` 擴充功能（Heym 無法將其安裝至非由其管理的資料庫）。若缺少該擴充功能，建立或上傳至 Postgres vector store 時會回傳明確的訊息，而 Qdrant RAG 會繼續運作。

### 使用對象

- [RAG 節點](../nodes/rag-node.md)（透過 vector store）
- [Vectorstores 分頁](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) 是一款試算表/資料庫混合工具，支援結構化資料與公式。Grist 認證可讓 Heym 讀取與寫入 Grist 文件。
### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `api_key` | Grist API key（可在你的 Grist 執行個體的 **Profile → API Key** 中找到） |
| `server_url` | 你的 Grist 伺服器基礎 URL（例如 Grist Cloud 為 `https://docs.getgrist.com`，或你的自架 URL） |

### 備註

- [Grist 節點](../nodes/grist-node.md) 在其設定中需要 **Document ID**（來自 Grist 文件 URL）與 **Table ID** — 這些不屬於憑證的一部分。
- 若為自架 Grist，請將 `server_url` 設為你執行個體的網域。
- Grist 中的欄位 ID 使用底線（例如 `User_Name`），而非顯示標籤。請使用 `listColumns` 操作來探索這些欄位。

### 使用此憑證的項目

- [Grist 節點](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Google Sheets 憑證使用 OAuth2「Bring Your Own App」模式，將 Heym 連接至 Google Sheets API。你需提供 Google Cloud OAuth2 Client ID 與 Client Secret，然後透過瀏覽器彈出視窗授權存取。Token 會在背景自動更新。

### 設定

1. 開啟 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜尋並啟用 **Google Sheets API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 應用程式類型選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下新增：`https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. 複製產生的 **Client ID** 與 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 類型選擇 **Google Sheets (OAuth2)**。
6. 輸入 Client ID、Client Secret 與名稱，然後點擊 **Connect** 以開啟 Google 同意畫面彈出視窗並授權存取。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `client_id` | 來自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 來自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）會自動儲存與更新 — 你無需直接管理它們。

### 備註

- OAuth2 同意畫面需要 spreadsheets 範圍（`https://www.googleapis.com/auth/spreadsheets`）。
- Heym 使用 refresh token 在 access token 過期前取得新的 access token（60 秒安全緩衝）。
- 若你在 Google Cloud Console 中輪替了 Client Secret，請透過 **Connect** 按鈕重新連接憑證。
- **正式環境：** 將後端 **`FRONTEND_URL`** 設為使用者在瀏覽器中開啟的精確公開 URL（scheme + host，例如 `https://heym.example.com`）。Heym 僅依據此值建構 Google OAuth redirect URI — 它**不會**信任 `Origin` 或 `X-Forwarded-*` 標頭（由用戶端控制）。請在 Google Cloud Console 中註冊 `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`。

### 使用此憑證的項目

- [Google Sheets 節點](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Google Drive 憑證使用與 Google Sheets 相同的 OAuth2「Bring Your Own App」模式，將 Heym 連接至 Google Drive API。你需提供 Google Cloud OAuth2 Client ID 與 Client Secret，然後透過瀏覽器彈出視窗授權存取。Token 會在背景自動更新。

### 設定

1. 開啟 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜尋並啟用 **Google Drive API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 應用程式類型選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下新增：`https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. 複製產生的 **Client ID** 與 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 類型選擇 **Google Drive (OAuth2)**。
6. 輸入 Client ID、Client Secret 與名稱，然後點擊 **Connect** 以開啟 Google 同意畫面彈出視窗並授權存取。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `client_id` | 來自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 來自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）會自動儲存與更新 — 你無需直接管理它們。

### 範圍

Google Drive 要求**完整的 Drive 範圍**（`https://www.googleapis.com/auth/drive`）。

這是必要的，因為該節點會操作你已擁有的檔案。較窄的 `drive.file` 範圍僅授予 OAuth 用戶端本身所建立之檔案的存取權，這將導致 `listFolderFiles`、`updateFile`、`removeFile` 與 `removeFolder` 無法看到你現有 Drive 中的任何內容。

由於你提供來自自有 Google Cloud 專案的 Client ID 與 Secret，此範圍的 Google 應用程式驗證要求適用於你的專案，而非 Heym。

### 備註

- Heym 使用 refresh token 在 access token 過期前取得新的 access token（60 秒安全緩衝）。
- 若你在 Google Cloud Console 中輪替了 Client Secret，請透過 **Connect** 按鈕重新連接憑證。
- 支援共用雲端硬碟 — 該節點在每次 API 呼叫時都會設定 `supportsAllDrives`。
- **正式環境：** 將後端 **`FRONTEND_URL`** 設為使用者在瀏覽器中開啟的精確公開 URL。Heym 僅依據此值建構 Google OAuth redirect URI — 它**不會**信任 `Origin` 或 `X-Forwarded-*` 標頭。請在 Google Cloud Console 中註冊 `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback`。
- 在與團隊共用此憑證之前，請參閱 [Credential Sharing](./credentials-sharing.md)。

### 使用此憑證的項目

- [Google Drive 節點](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

BigQuery 認證資訊採用 OAuth2 的「Bring Your Own App」模式，將 Heym 連接至 Google BigQuery API。您需提供 Google Cloud OAuth2 Client ID 與 Client Secret，接著透過瀏覽器彈出視窗授權存取。Token 會在背景自動更新。

### 設定

1. 開啟 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → 搜尋並啟用 **BigQuery API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 應用程式類型選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下新增：`https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. 複製產生的 **Client ID** 與 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 類型選擇 **BigQuery (OAuth2)**。
6. 輸入 Client ID、Client Secret 與名稱，然後點擊 **Connect** 開啟 Google 同意畫面彈出視窗並授權存取。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `client_id` | 來自 Google Cloud Console 的 OAuth2 Client ID |
| `client_secret` | 來自 Google Cloud Console 的 OAuth2 Client Secret |

Token（`access_token`、`refresh_token`、`token_expiry`）會自動儲存並更新。

### 備註

- OAuth2 同意畫面需要 BigQuery scope（`https://www.googleapis.com/auth/bigquery`）。
- **正式環境：** 將後端 **`FRONTEND_URL`** 設為公開 URL。並在 Google Cloud Console 中註冊 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。

### 使用此認證的節點

- [BigQuery 節點](../nodes/bigquery-node.md)

---

## Supabase

Supabase 認證資訊將 Heym 連接至 Supabase 專案的 PostgREST API，讓 Workflow 能夠查詢與異動以 Postgres 為後端的資料表。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `supabase_url` | 專案基礎 URL，例如 `https://your-project.supabase.co` |
| `supabase_key` | 可存取目標資料表的 API key |
| `supabase_schema` | 選用的預設 schema（預設為 `public`） |

### 備註

- [Supabase 節點](../nodes/supabase-node.md) 會與 `/rest/v1/<table>` 通訊，並支援運算子篩選（`eq`、`neq`、`gt`、`gte`、`lt`、`lte`、`like`、`ilike`、`is`、`in` 及相關 PostgREST 運算子），以及巢狀的 `or` / `and` 邏輯群組。
- 進行寫入操作時，請優先使用專為受信任伺服器端用途設計、且具備最低必要資料表權限的 key。
- 即使認證資訊定義了預設 schema，節點仍可在每個步驟中覆寫 schema。

### 使用此認證的節點

- [Supabase 節點](../nodes/supabase-node.md)

## ClickHouse

ClickHouse 認證資訊透過 HTTP 介面將 Heym 連接至外部 ClickHouse 資料庫，讓 Workflow 能夠對 OLAP 資料表執行 SQL、CRUD 與計數操作。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `host` | 不含 scheme 的 HTTP host，例如 `your-instance.clickhouse.cloud` |
| `port` | HTTP 介面埠（HTTPS 為 `8443`，HTTP 為 `8123`） |
| `username` | ClickHouse 使用者（預設為 `default`） |
| `password` | 使用者密碼（選用） |
| `database` | 目標資料庫（預設為 `default`） |
| `secure` | 為 `true` 時使用 HTTPS（ClickHouse Cloud 必需） |

### 備註

- [ClickHouse 節點](../nodes/clickhouse-node.md) 使用官方 `clickhouse-connect` HTTP client，並將篩選與值的綁定參數化。
- `update` 與 `remove` 對應至 `ALTER TABLE ... UPDATE` 與 `DELETE FROM`，這些是 ClickHouse 的非同步 mutation；兩者皆需要篩選條件。
- `upsert` 會執行 `INSERT`，並假設資料表為 `ReplacingMergeTree` 以實現 merge-on-key 行為。
- 使用認證資訊對話框中的 **Test connection** 來驗證連線可達性。

### 使用此認證的節點

- [ClickHouse 節點](../nodes/clickhouse-node.md)

## Notion

Notion 認證資訊支援內部整合 Token 或公開整合 OAuth 連線。OAuth 讓每位使用者能直接從 Heym 授權 Notion workspace，而不必手動複製 Token。

### 必填欄位

| 模式 | 欄位 | 說明 |
|------|-------|-------------|
| 內部 Token | `api_token` | 內部整合 Token（`ntn_...`） |
| OAuth | `client_id` | 來自 Notion 公開整合的 Client ID |
| OAuth | `client_secret` | 來自 Notion 公開整合的 Client Secret |

OAuth callback 會自動儲存 `access_token`、`auth_mode`、`workspace_id`、`workspace_name` 與 `bot_id`。OAuth 完成後，任何先前的內部 `api_token` 都會被移除。請在 Notion 中註冊此 redirect URI：
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`。

### OAuth 設定流程

1. 在認證資訊對話框中選擇 **OAuth**，輸入名稱、Client ID 與 Client Secret。
2. 點擊 **Connect**，並在 Notion 彈出視窗中授權 workspace。
   - 對於**新的**認證資訊，Heym 會在您點擊 **Connect** 時建立認證資訊記錄。
   - 在彈出視窗中完成授權，然後點擊 **Save** 返回認證資訊清單。
3. 已連線的認證資訊會在清單中顯示 `connected (Workspace Name)`。待處理的 OAuth 認證資訊會顯示 `Not connected`，直到授權完成。

使用認證資訊對話框中的 **Test Connection** 來驗證內部 Token 或已完成的 OAuth 授權。編輯時，將 Token 欄位留空會保留已儲存的內部 Token。

內部 Token 與 OAuth access token 皆可透過 `$credentials.CredentialName` 取得，供需要 Notion bearer token 的自訂 [HTTP](../nodes/http-node.md) 呼叫使用。
### 備註

- 內部整合需要共享相關的頁面、資料庫和資料來源。
- OAuth 使用者會在 Notion 授權期間選擇工作區/頁面。
- OAuth 應用程式憑證會在 Notion 憑證內加密。回呼會在伺服器端重新載入這些憑證；密鑰不會嵌入 OAuth state 中。
- 已連接的 OAuth 憑證會顯示工作區名稱；待處理的 OAuth 憑證會顯示 `Not connected`，直到授權完成為止。
- **正式環境：** 將後端 **`FRONTEND_URL`** 設為公開的瀏覽器 URL（scheme + host，結尾不加斜線）。Notion 重新導向 URI 必須完全相符：
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`。
- 該節點使用 API 版本 `2026-03-11` 及目前的 `data_source` 術語。如需從較舊的 `archived`、`after` 或資料庫查詢範例進行遷移的指引，請參閱 [Notion 節點](../nodes/notion-node.md#api-version-notes) 一文。
- 物件值為 `database` 的舊搜尋篩選條件會正規化為 `data_source`。

### 使用者

- [Notion 節點](../nodes/notion-node.md)

---

## SMTP (電子郵件)

SMTP 憑證會儲存電子郵件伺服器連線詳細資訊，用於傳送外寄郵件。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `host` | SMTP 伺服器主機名稱（例如 `smtp.gmail.com`） |
| `port` | SMTP 連接埠（STARTTLS 通常為 `587`，SSL 為 `465`） |
| `email` | SMTP 伺服器登入所使用的使用者名稱；當 `from` 為空白時亦作為可見的寄件者 |
| `password` | SMTP 密碼或應用程式密碼 |

### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `from` (`smtp_from`) | 可見的寄件者（From）地址。留空則以 `email` 寄送。伺服器仍會以 `email` 身分登入，因此該帳號必須獲准以此地址寄信（在 Gmail 中為已驗證的**以這個地址寄送郵件**別名）。 |

### 常見 SMTP 供應商

| 供應商 | 主機 | 連接埠 | 備註 |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | 需要[應用程式密碼](https://support.google.com/accounts/answer/185833)（必須啟用兩步驟驗證） |
| Outlook / Office 365 | `smtp.office365.com` | `587` | 使用您的 Microsoft 帳戶憑證 |
| Mailgun | `smtp.mailgun.org` | `587` | 使用您網域設定中的 Mailgun SMTP 憑證 |
| SendGrid | `smtp.sendgrid.net` | `587` | 使用 `apikey` 作為使用者名稱，並以 API 金鑰作為密碼 |
| 自訂 / 自行託管 | 您的網域 | `587` / `465` | Postfix、Exim 等 |

### 備註

- 啟用兩步驟驗證時，Gmail 需要 **應用程式密碼**，而非您的一般密碼。
- 連接埠 `587` 使用 STARTTLS（以純文字開始，升級至 TLS）。連接埠 `465` 使用隱式 TLS（從一開始即為 SSL）。

### 使用者

- [Send Email 節點](../nodes/send-email-node.md)

---

## IMAP (內送電子郵件)

IMAP 憑證會儲存連線詳細資訊，用於透過 [IMAP Trigger 節點](../nodes/imap-trigger-node.md) 監控收件匣。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `imap_host` | IMAP 伺服器主機名稱（例如 `imap.gmail.com`） |
| `imap_port` | IMAP 連接埠（多數供應商的 SSL/TLS 為 `993`） |
| `imap_username` | 信箱使用者名稱或完整電子郵件地址 |
| `imap_password` | 密碼或供應商特定的應用程式密碼 |

### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `imap_mailbox` | 要監控的信箱資料夾（預設：`INBOX`） |
| `imap_use_ssl` | 啟用 SSL/TLS（建議；預設：`true`） |

### 備註

- IMAP Trigger 會於首次輪詢時建立目前信箱的基準，之後僅處理較新的電子郵件。
- Gmail、Microsoft 365 及其他託管供應商通常需要 **應用程式密碼** 或類似的 IMAP 專用密鑰。
- 附件內容不會下載至 Workflow payload；Heym 僅會公開附件的中繼資料。

### 使用者

- [IMAP Trigger 節點](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md)（IMAP 作為 Workflow Trigger）

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) 是一款開放原始碼訊息代理程式。RabbitMQ 憑證會儲存連線詳細資訊，用於發佈至佇列與交換器，以及從中取用訊息。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `rabbitmq_host` | AMQP 連線 URL（例如 `amqp://localhost:5672`） |
| `rabbitmq_username` | RabbitMQ 使用者名稱（預設：`guest`） |
| `rabbitmq_password` | RabbitMQ 密碼（預設：`guest`） |

### 虛擬主機

若要連線至特定的虛擬主機，請將其納入 `rabbitmq_host` URL 中：

```
amqp://username:password@hostname:5672/vhost
```

若使用預設 vhost，則可省略路徑 `/`。

### 延遲訊息外掛

[RabbitMQ 節點](../nodes/rabbitmq-node.md) 支援 **rabbitmq_delayed_message_exchange** 外掛。當您的 RabbitMQ 伺服器啟用此外掛時，您可以使用節點上的 `rabbitmqDelayMs` 欄位，為外寄訊息設定延遲（以毫秒為單位）。

該節點會在已發佈的訊息上設定 `x-delay` 標頭。交換器類型必須為 `x-delayed-message`，延遲才會生效。

若要在自行託管的 RabbitMQ 執行個體上啟用此外掛：

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

當此外掛未安裝時，`x-delay` 標頭會被忽略，訊息會立即遞送。

### 使用者

- [RabbitMQ 節點](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md)（RabbitMQ 作為 Workflow Trigger）

---

## Amazon S3

Amazon S3 憑證會將 Heym 連線至 [Amazon S3](https://aws.amazon.com/s3/)。搭配 [Amazon S3 節點](../nodes/amazon-s3-node.md) 使用，即可從 Workflow 管理 bucket 與資料夾、上傳與下載物件、複製 key，以及列出或刪除物件。
### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `aws_access_key_id` | AWS IAM 存取金鑰 ID |
| `aws_secret_access_key` | 與存取金鑰 ID 配對的私密存取金鑰 |
| `aws_region` | 儲存貯體所在的 AWS 區域（例如 `us-east-1`） |

### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `aws_session_token` | 使用 AWS STS 憑證時的臨時工作階段 Token |

### 備註

- 此憑證透過 boto3 使用標準 AWS SigV4 驗證。
- 上傳操作目前傳送 UTF-8 文字內容；下載可傳回文字，或針對二進位物件傳回 base64。

### 使用此憑證的節點

- [Amazon S3 節點](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) 是一種記憶體內鍵值儲存區，用於快取及快速資料存取。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `host` | Redis 伺服器主機名稱或 IP（例如 `localhost`） |
| `port` | Redis 連接埠（預設：`6379`） |
| `password` | Redis 密碼（若未設定請留空） |

### 使用此憑證的節點

- [Redis 節點](../nodes/redis-node.md)

---

## Slack

Slack 憑證儲存用於將訊息發佈至 Slack 頻道的 **Incoming Webhook URL**。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL（來自您的 Slack 應用程式設定） |

### 備註

- 請於 [api.slack.com/apps](https://api.slack.com/apps) → 您的應用程式 → **Incoming Webhooks** 建立 Incoming Webhook。
- 每個 Webhook 僅限用於特定頻道。若需使用不同頻道，請建立多個憑證。

### 使用此憑證的節點

- [Slack 節點](../nodes/slack-node.md)

---

## Telegram

Telegram 憑證儲存 **Bot Token** 及選用的 **Webhook Secret Token**，用於以 Bot 為基礎的 Workflow。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `bot_token` | 來自 BotFather 的 Telegram Bot API Token |

### 選填欄位

| 欄位 | 說明 |
|-------|-------------|
| `secret_token` | 共用密鑰，用於對傳入 Webhook 的 `x-telegram-bot-api-secret-token` 進行驗證 |

### 備註

- [Telegram Trigger](../nodes/telegram-trigger-node.md) 與 [Telegram](../nodes/telegram-node.md) 請使用相同的憑證。
- 請使用 Telegram Trigger 節點面板中顯示的 URL，透過 Telegram 的 `setWebhook` API 手動註冊 Webhook。
- Telegram 節點中的 `chatId` 可為字面 ID 或如 `$telegramEvent.message.chat.id` 的表達式。

### 使用此憑證的節點

- [Telegram Trigger 節點](../nodes/telegram-trigger-node.md)
- [Telegram 節點](../nodes/telegram-node.md)

---

## HTTP Auth（Bearer 與 Header）

這些憑證由 [HTTP 節點](../nodes/http-node.md) 用於驗證傳出的請求。

### Bearer

將 `Authorization: Bearer <token>` 標頭附加至 HTTP 請求。

| 欄位 | 說明 |
|-------|-------------|
| `token` | Bearer Token 值 |

### Header

將自訂標頭附加至 HTTP 請求。

| 欄位 | 說明 |
|-------|-------------|
| `header_key` | 標頭名稱（例如 `X-Api-Key`） |
| `header_value` | 標頭值 |

這兩種類型亦可透過 [Expression DSL](./expression-dsl.md) 中的 `$credentials.CredentialName` 參照，以便在任何支援表達式的節點中動態使用。

### 使用此憑證的節點

- [HTTP 節點](../nodes/http-node.md)

---

## LLM 供應商（OpenAI、Google、Custom、Cohere）

這些憑證為 AI 節點提供支援。

| 類型 | 說明 |
|------|-------------|
| **OpenAI** | 用於 GPT 模型及 OpenAI 嵌入的 API 金鑰 |
| **Google** | 用於 Gemini 模型的 API 金鑰 |
| **Custom** | 用於 OpenAI 相容 Endpoint（Ollama、vLLM、LM Studio 等）的 API 金鑰 + 基礎 URL |
| **Cohere** | 用於 Cohere 嵌入的 API 金鑰 |

### OpenAI Prompt 快取

OpenAI 會自動快取系統 Prompt 中靜態（不變）的前綴部分——無需額外設定。重複執行的 Workflow 若共用相同的系統 Prompt 前綴，即可享有快取 Token 定價，同時降低成本和延遲。當您有冗長且固定的指示，且每次執行之間僅有使用者訊息變更時，此功能尤其實用。您可在 [Traces 分頁](../tabs/traces-tab.md) 或 OpenAI 使用量儀表板中監控快取命中率與 Token 節省量，以最佳化您的 Prompt 結構，達到最大的快取重複使用率。

### 使用此憑證的節點

- [LLM 節點](../nodes/llm-node.md)
- [Agent 節點](../nodes/agent-node.md)
- [RAG 節點](../nodes/rag-node.md)（透過 Qdrant 憑證使用 OpenAI 嵌入）

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) 是一種代理伺服器，用於繞過 Cloudflare 及類似的 Bot 防護挑戰。

### 必填欄位

| 欄位 | 說明 |
|-------|-------------|
| `flaresolverr_url` | 您的 FlareSolverr 執行個體 URL（例如 `http://localhost:8191`） |

此處支援回送位址與私有位址，因此依文件所述將 FlareSolverr 與 Heym 並行執行是可行的。該 URL 不得解析為連結本機或雲端中介資料位址。由於允許私有位址，此欄位亦可指向其他內部服務，而回覆會出現在節點輸出中。任何已登入的使用者皆可建立此憑證，因此界線在於誰可以撰寫 Workflow 以及您的網路規則，而非憑證共用。請參閱[輸出安全](../nodes/crawler-node.md#egress-safety)。

### 使用此憑證的節點

- [Crawler 節點](../nodes/crawler-node.md)

---
## 相關

- [Credentials](./credentials.md) – 認證資訊總覽，以及節點如何使用它們
- [Credentials Tab](../tabs/credentials-tab.md) – 新增與管理認證資訊
- [Credentials Sharing](./credentials-sharing.md) – 與使用者及團隊分享認證資訊
- [Security](./security.md) – 靜態加密、存取控制
- [Expression DSL](./expression-dsl.md) – 用於動態存取的 `$credentials` 語法

---

## Model Router (Auto Model)

將每個請求路由至您現有的其中一個模型認證資訊，並使用決策模型來選擇。它儲存的是參照，本身絕不儲存金鑰。

### 必填欄位

- `decision_credential_id` – 您可存取的一個 **Decision Model** 認證資訊。
- `decision_model` – 負責執行路由呼叫的模型，例如 `jev-latest`。
- `options` – 至少兩個項目，每個項目包含名稱、您的其中一個 OpenAI/Google/Custom 認證資訊、該認證資訊上的一個模型，以及說明其應在何時勝出的準則。

### 選填欄位

- `routing_instructions` – 如何整體權衡各選項。
- 其中一個選項可標記為路由失敗時所使用的備援。

### 備註

選項名稱即為決策模型從中挑選的依據，因此它們必須彼此不同。一個選項不能指向另一個 Model Router。

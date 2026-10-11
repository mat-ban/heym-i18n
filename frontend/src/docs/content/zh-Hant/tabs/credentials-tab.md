# Credentials 分頁

**Credentials** 分頁負責管理節點所使用的 API 金鑰與機密資訊。在此新增 credentials，並在 workflow 節點中以名稱引用它們。關於 credentials 的概觀以及節點如何使用它們，請參閱 [Credentials](../reference/credentials.md)。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ 觀看 Credentials 示範</a></p>

## Credential 類型

| 類型 | 用途 |
|------|----------|
| **OpenAI** | 供 LLM、Agent 與 RAG 節點使用的 OpenAI API 金鑰 |
| **Google** | Google AI (Gemini) API 金鑰 |
| **GitHub** | 供 GitHub API、GitHub 節點 workflow、MCP 伺服器與 agent workflow 使用的 GitHub 個人存取 Token (PAT)；可選填 GitHub Enterprise `base_url` |
| **Linear** | 供團隊、專案、議題與留言使用的 Linear 個人 API 金鑰或 OAuth2 |
| **Notion** | 內部整合 Token 或公開整合 OAuth 工作區授權 |
| **Custom** | 自訂 LLM Endpoint |
| **Bearer** | 供 HTTP 驗證使用的 Bearer Token |
| **Header** | 供 HTTP 請求使用的自訂 header 鍵值 |
| **Telegram** | Telegram bot Token 與選填的 Webhook secret |
| **Slack** | Slack incoming Webhook URL |
| **Discord** | Discord incoming Webhook URL |
| **Discord Trigger** | Discord 應用程式公開金鑰 |
| **IMAP** | 收件信箱 Trigger credentials |
| **SMTP** | 寄送電子郵件 credentials |
| **Redis** | Redis 連線 |
| **RAG: Qdrant + OpenAI** | 供 RAG 節點使用的向量儲存，由外部 Qdrant 伺服器支援 |
| **RAG: Psql + OpenAI** | 供 RAG 節點使用的向量儲存，由 Heym 自有的 Postgres 資料庫 (pgvector) 支援——無需外部服務 |
| **RAG: Custom Embeddings** | 供 RAG 節點使用的向量儲存，使用任何與 OpenAI 相容的 embedding Endpoint，並以 Qdrant 或 Postgres (pgvector) 作為儲存 |
| **Cohere** | 供 embeddings 使用的 Cohere API |

## 新增 Credentials

1. 點擊 **Add Credential**
2. 選擇 credential 類型
3. 輸入所需的值（API 金鑰、URL 等）
4. 為其命名，以便在節點中引用

就 GitHub 而言，目前的 credential 流程是以 PAT 為基礎。建議使用細粒度 PAT。GitHub App 安裝流程目前在 UI 中並非第一級支援。若您使用 GitHub Enterprise Server，亦可設定選填的 GitHub API base URL，例如 `https://github.example.com/api/v3`。

就 Linear 而言，請在對話框中選擇 **Personal API key** 或 **OAuth2**。個人 API 金鑰建立於 Linear 的 **Settings → Security & Access → Personal API keys** 之下。OAuth2 使用 Linear OAuth 應用程式的 Client ID 與 Client Secret，並以 `{FRONTEND_URL}/api/credentials/linear/oauth/callback` 註冊為 redirect URI。該 credential 會以建立或授權它的 Linear 使用者權限運作。儲存前，請使用 credential 對話框中的 **Test Connection** 驗證 API 金鑰或 OAuth Token。

就 **Notion** 而言，請在對話框中選擇 **Internal token** 或 **OAuth**。OAuth 使用您 Notion 公開整合的 Client ID 與 Client Secret；Heym 會將它們加密儲存於 credential 中。儲存 workflow 前，請使用 **Test Connection** 驗證 Supabase、Linear 或 Notion credentials。Notion 設定細節請參閱 [Third-Party Integrations](../reference/integrations.md#notion)。

OAuth credentials 會在彈出視窗中開啟供應商的授權頁面。若瀏覽器封鎖該彈出視窗，請使用 Connect 按鈕下方的 **Open the authorization page** 連結；對話框會在連線完成時顯示通知。新 credential 連線完成後，按鈕會顯示 **Connected**。

## 編輯與刪除

- **Edit** – 更新 credential 值（機密值會以遮罩顯示）
- **Delete** – 移除 credential；使用它的 workflows 將需要替代品

在 GitHub Enterprise Server 上編輯 **GitHub** credential 時，將選填的 **GitHub API Base URL** 留空會保留現有的 Enterprise Endpoint。僅在您想變更該 Endpoint 時才輸入新的 URL。

## 分享

- 透過電子郵件與其他使用者[分享 credentials](../reference/credentials-sharing.md)，或與 [Teams](../reference/teams.md) 分享
- 已分享的 credentials 會顯示指示標記
- 可從 credential 卡片選單撤銷分享

## 在節點中使用

在節點配置中依名稱參照 credentials。例如：
- [LLM 節點](../nodes/llm-node.md) – 為模型 API 選擇 credential
- [HTTP 節點](../nodes/http-node.md) – 使用 Bearer 或 Header credentials 進行驗證
- [Agent 節點](../nodes/agent-node.md) – 將 GitHub tokens 傳入 MCP server 環境變數，例如 `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub 節點](../nodes/github-node.md) – 執行原生 GitHub repository、user、issue、review、release、workflow、traffic 及 file 操作
- [Linear 節點](../nodes/linear-node.md) – 讀取 workspace metadata 並自動化 Linear issues 與 comments
- [Notion 節點](../nodes/notion-node.md) – 管理 Notion databases、data sources、pages 及 blocks
- [RAG 節點](../nodes/rag-node.md) – 使用 Qdrant 或 Postgres（pgvector）credential 作為 vector store
- [Telegram Trigger 節點](../nodes/telegram-trigger-node.md) – 接收 Telegram bot webhooks
- [Telegram 節點](../nodes/telegram-node.md) – 傳送 Telegram bot 訊息
- [Discord Trigger 節點](../nodes/discord-trigger-node.md) – 接收 Discord interaction webhooks
- [Discord 節點](../nodes/discord-node.md) – 傳送 Discord webhook 訊息
- [IMAP Trigger 節點](../nodes/imap-trigger-node.md) – 輪詢共用信箱以取得新郵件

關於在表達式中參照由 credential 支援的值，請參閱 [Expression DSL](../reference/expression-dsl.md)。

## 相關內容

- [第三方整合](../reference/integrations.md) – 各 credential 類型（Telegram、Discord、Qdrant、Grist、IMAP、SMTP、RabbitMQ、Redis、Slack 等）的詳細設定指南
- [Credentials 共用](../reference/credentials-sharing.md) – 與其他使用者共用 credentials
- [安全性](../reference/security.md) – 靜態加密、session 管理、速率限制
- [節點類型](../reference/node-types.md) – 使用 credentials 的節點（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[GitHub](../nodes/github-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)）
- [Vectorstores 分頁](./vectorstores-tab.md) – 使用 Qdrant 或 Postgres（pgvector）credentials
- [Chat 分頁](./chat-tab.md) – 使用 OpenAI/Google credentials
- [情境式展示](../reference/contextual-showcase.md) – 儀表板介面的精簡頁面指南

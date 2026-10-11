# 憑證共用

憑證可與其他使用者分享，讓他們的工作流程能使用你的 API 金鑰。請參閱[憑證](./credentials.md)以取得概觀，並參閱[憑證分頁](../tabs/credentials-tab.md)以新增與管理憑證。

## 與 LLM 分享憑證

若要讓 LLM 或 AI Agent 使用 API 金鑰，請將該金鑰儲存為憑證，並讓發出請求的節點附加該憑證。模型決定要呼叫什麼；節點在執行時對呼叫進行驗證。

- **將機密儲存為憑證。** 敏感值在靜態時會加密，並在建立後於 UI 中遮蔽。
- **在發出請求的位置引用它。** [LLM](../nodes/llm-node.md) 與 [Agent](../nodes/agent-node.md) 節點會依 ID 選取其模型憑證，而 HTTP 請求會將 `$credentials.CredentialName` 放入驗證標頭。請將機密排除於 Prompt 欄位之外，因為 Prompt 中的所有內容都會以文字形式傳送給模型供應商。
- **給 Agent 工具，而非金鑰。** 當 Agent 以工具形式呼叫 HTTP 節點、MCP 伺服器或子工作流程時，憑證會套用於該工具內部，而模型會收到該工具的結果。
- **輸出會遮蔽。** 當長度超過七個字元的憑證值出現在節點的輸出中時，僅保留其前七個字元，因此回傳金鑰的回應在結果與追蹤中只會顯示該前綴。請參閱[輸出遮蔽](#output-masking)。
- **讓助理建立憑證。** 當 [AI 助理](./ai-assistant.md#credentials)或 Chat 分頁建立憑證時，它只會看到名稱與類型，而由你在一般憑證表單中輸入機密。
- **以相同方式與他人分享。** 如下所述將憑證分享給使用者或團隊，他們的工作流程便能透過自己的 LLM 與 Agent 節點使用你的金鑰。

## 分享模型

- **CredentialShare** – 將 `credential_id` 連結至 `user_id`（每組配對唯一）
- **依電子郵件分享** – 以電子郵件呼叫 `POST /api/credentials/{credential_id}/shares`；系統會查詢並新增該使用者
- **撤銷** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

你也可以與[團隊](./teams.md)分享憑證：

- **CredentialTeamShare** – 將 `credential_id` 連結至 `team_id`；所有團隊成員皆取得存取權
- **與團隊分享** – 以 `team_id` 呼叫 `POST /api/credentials/{credential_id}/team-shares`
- **撤銷團隊分享** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

已分享的憑證會在[憑證分頁](../tabs/credentials-tab.md) UI 中顯示指示標記。

## 大範圍憑證

分享憑證會將該憑證能做的所有事情授予接收者。對大多數整合而言，其範圍僅限於單一工作區或單一 API 金鑰的權限，但有些憑證的範圍遠比這更廣。

> **Google Drive 憑證會授予完整的 Drive 存取權。** [Google Drive](../nodes/google-drive-node.md)憑證是以 `https://www.googleapis.com/auth/drive` 範圍授權，因此該節點可對你已擁有的檔案進行操作。將其分享給使用者或團隊，會讓他們每一位都能透過工作流程**讀取、修改及永久刪除你 Google Drive 中的任何內容**——而不只是你原先設想的那些檔案。請僅與你願意直接授予完整 Drive 存取權的人分享。

如果你需要限制暴露範圍，請建立一個專用的 Google 帳號，僅授予工作流程所需資料夾的存取權，並改以該帳號連接憑證，而非你的主要帳號。

**Decision Model** 憑證帶有 Endpoint，以及（若有設定）API 金鑰。分享它會讓接收者能從他們可執行的任何工作流程中使用該金鑰，就如同 LLM 憑證一樣。

**Model Router** 憑證會分享它所路由的一切。與你分享的人可以對其選項清單中的每一個憑證執行請求，而這些請求會花用你的金鑰。他們無法讀取金鑰，且這些憑證不會出現在他們自己的憑證清單中。

這與直接分享 OpenAI 憑證是相同的授予，而這正是路由器對團隊有用的原因。如果你不想要如此，請改為分享個別憑證，並讓每個人自行挑選模型。

## 與工作流程協作者分享

當你分享工作流程時，協作者可以開啟並執行它，但除非你也將那些憑證分享給他們，否則他們無法使用你的憑證。這適用於主工作流程及其所呼叫之任何子工作流程中的憑證。請將每個憑證分享給你邀請至該工作流程的相同使用者或團隊。子工作流程也必須從子工作流程的編輯器另行分享。請參閱[工作流程組織](./workflow-organization.md#sharing-workflows)。

## 執行環境

當工作流程執行時，憑證會為**工作流程擁有者**（或執行時的目前使用者）解析。`get_credentials_context()` 會合併：

1. **擁有的憑證** – `Credential.owner_id == user_id`
2. **使用者分享的憑證** – `CredentialShare` 中 `CredentialShare.user_id == user_id` 者
3. **團隊分享的憑證** – `CredentialTeamShare` 中該使用者為團隊成員者

全部會合併為單一以憑證名稱為鍵的 context dict。

## 在工作流程中的使用
### 依名稱（Expression DSL）

Credential 在 [Expression DSL](./expression-dsl.md) 中以 `$credentials.CredentialName` 形式暴露。適用於：

- HTTP 節點（Bearer/Header 驗證）
- Telegram 節點
- Slack 節點
- 自訂 HTTP 請求中的 Notion bearer token（內部 token 或 OAuth access token）
- 任何接受表達式進行驗證的節點

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### 依 ID（credentialId）

部分節點會將 `credentialId`（UUID）儲存於 `node.data` 中：

| 節點類型 | 欄位 | 說明 |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[RAG](../nodes/rag-node.md)、Image Gen | `credentialId` | LLM API credential |
| [Codex](../nodes/codex-node.md) | `credentialId`、`githubCredentialId` | Codex access token credential 與 GitHub credential |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`、`githubCredentialId` | OpenCode Go gateway credential 與 GitHub credential |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud email/API token 或 Data Center 使用者名稱/密碼 credential |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion 內部 token 或 OAuth workspace credential |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token 與選用的 base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase 專案 URL 與 API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse 連線詳細資訊（host、port、auth、database） |
| [Telegram Trigger](../nodes/telegram-trigger-node.md)、[Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram bot credential |
| [Discord Trigger](../nodes/discord-trigger-node.md)、[Discord](../nodes/discord-node.md) | `credentialId` | Discord 公鑰或 webhook credential |
| Vector Store | `credential_id` | Qdrant 或 Postgres（pgvector）向量資料庫，透過 Qdrant、Psql 或 Custom Embeddings RAG credential |
| Evals | `credential_id`、`judge_credential_id` | 模型 credential；用於 LLM-as-Judge 評審的模型或 Decision Model credential |
| [Playwright](../nodes/playwright-node.md) AI 步驟 | `credentialId` | LLM/Vision 模型（用於 AI 步驟與 [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)） |

執行器會依 ID 直接從資料庫載入 credential 並解密其設定。

## 輸出遮蔽

執行後，`mask_sensitive_output()` 會遮蔽輸出中的 credential 值，對每個長度超過七個字元的機密保留前七個字元，其餘以 `**` 取代，以避免機密在結果或 trace 中暴露。

## 相關內容

- [Credentials 分頁](../tabs/credentials-tab.md) – 新增與分享 credential
- [第三方整合](./integrations.md) – 各 credential 類型的詳細設定
- [Teams](./teams.md) – 與團隊分享
- [Expression DSL](./expression-dsl.md) – `$credentials` 語法
- [節點類型](./node-types.md) – 使用 credential 的節點（[LLM](../nodes/llm-node.md)、[Agent](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[RAG](../nodes/rag-node.md)、[Playwright](../nodes/playwright-node.md)、[HTTP](../nodes/http-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[Telegram](../nodes/telegram-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord](../nodes/discord-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[Slack](../nodes/slack-node.md)）
- [Agent 節點](../nodes/agent-node.md) – 使用 `credentialId` 存取 LLM

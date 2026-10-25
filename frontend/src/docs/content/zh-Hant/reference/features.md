# 完整功能集

所有 Heym 功能的全面概覽。每個章節以幾句話說明一項功能或概念。

---

## 入門指南

### [簡介](../getting-started/introduction.md)

Heym 是在生產環境中執行與治理 AI Agent 的基礎設施。你在視覺化畫布上建構 Agent 系統並安心執行：協調 Agent、自動化業務流程、檢視每一次執行，並在你自己的基礎設施上讓人類保持掌控。它支援視覺化 Workflow、AI 驅動的節點（[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Qdrant RAG](../nodes/rag-node.md)）、[AI Assistant](./ai-assistant.md)、整合（[HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Notion](../nodes/notion-node.md)、[WebSocket Send](../nodes/websocket-send-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、傳入的 [IMAP Trigger](../nodes/imap-trigger-node.md) 電子郵件、傳出的 [Send Email](../nodes/send-email-node.md)）、以 [Cron](../nodes/cron-node.md) 進行排程，以及供終端使用者使用的 [Portal](./portal.md) 聊天入口。

另請參閱 [核心概念](../getting-started/core-concepts.md)、[節點類型](./node-types.md) 與 [第三方整合](./integrations.md)。

### [為何選擇 Heym](../getting-started/why-heym.md)

「為何選擇 Heym」走過 Agent 生命週期（建構、協調、執行、觀測、評估、控制、暴露），並展示單一自架執行環境在各階段所處理的事項。內容涵蓋 [LLM](../nodes/llm-node.md) 節點與具備工具呼叫的 [Agent Node](../nodes/agent-node.md)、Python 工具、[MCP](../tabs/mcp-tab.md) 連線、技能與多 Agent 協調；Trigger、重試與 [負載分配](./cluster.md)；具備每次執行 USD 成本與 OpenTelemetry 匯出的 [Traces](../tabs/traces-tab.md)；[Evals](../tabs/evals-tab.md)；[人工審查檢查點](./human-in-the-loop.md)、護欄、SSO 與稽核軌跡；以及 REST、MCP 與 Portal Endpoint。頁面最後以與 n8n、Zapier 及 Make.com 的功能比較作結。

另請參閱 [Agent Node](../nodes/agent-node.md)、[LLM](../nodes/llm-node.md)、[Qdrant RAG](../nodes/rag-node.md) 與 [Agent 架構](./agent-architecture.md)。

### [快速開始](../getting-started/quick-start.md)

在幾分鐘內讓你的第一個 Workflow 開始執行：從 [Workflows](../tabs/workflows-tab.md) 分頁建立 Workflow，新增 [Input](../nodes/input-node.md) 節點、[LLM](../nodes/llm-node.md) 節點與 [Output](../nodes/output-node.md) 節點，然後將它們連接起來。使用憑證設定 [LLM](../nodes/llm-node.md)，並將 `userMessage` 設為 `$input.text`；使用 Run 或 [AI Assistant](./ai-assistant.md) 以自然語言執行或產生 Workflow。

與 [Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md)、[Output](../nodes/output-node.md) 及 [Expression DSL](./expression-dsl.md) 自然搭配使用。

### [核心概念](../getting-started/core-concepts.md)

Workflow 是由邊連接的節點所構成的有向圖；執行會從 Trigger 節點（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[WebSocket Trigger](../nodes/websocket-trigger-node.md)）流經處理節點，再到 [Output](../nodes/output-node.md) 節點。每個節點都有類型、資料（設定）與輸入/輸出；邊定義資料流。節點透過 [Expression DSL](./expression-dsl.md) 表達式（例如 `$nodeLabel.field`）參照上游資料；獨立的節點會自動以[平行](./parallel-execution.md)方式執行。

另請參閱 [Trigger](./triggers.md)、[平行執行](./parallel-execution.md) 與 [Workflow 結構](./workflow-structure.md)。

### [執行與部署](../getting-started/running-and-deployment.md)

Heym 提供用於本機開發的 `run.sh`（資料庫在 Docker 中、FastAPI 後端、Vite 前端）以及用於生產環境搭配 Docker Compose 的 `deploy.sh`。兩者都使用 `.env` 檔案；關鍵變數包括 `SECRET_KEY`、`ENCRYPTION_KEY`、`DATABASE_URL` 與 `ALLOW_REGISTER`。開發環境執行於可設定的前端與後端連接埠；生產環境則透過前端容器在 `/api` 下提供 API。

另請參閱 [安全性](./security.md)、[企業版](./enterprise.md) 與 [設定](./user-settings.md)。

### [遷移至 Heym](../getting-started/migrate-to-heym.md)

AI Convert 工具可將來自其他平台（n8n、Flowise、Dify、Langflow、sim.ai、Activepieces）的 Workflow 或純英文描述轉換為 Heym Workflow，即時串流至畫布上並可供[下載與匯入](./download-import.md)。它會執行 AI 安全檢查，然後在輸入與速率限制就緒的情況下產生 DSL。可於 [heym.run/convert](https://heym.run/convert) 開啟。

另請參閱 [快速開始](../getting-started/quick-start.md)、[下載與匯入](./download-import.md) 與 [AI Assistant](./ai-assistant.md)。

---

## 節點

### Trigger
#### [Input](../nodes/input-node.md)

Input 節點是接收來自使用者或 API 呼叫者資料的 Workflow 進入點。它支援單一或多個輸入欄位，並暴露請求中介資料（headers、query params）。透過 `$nodeLabel.body.fieldKey` 存取 body 欄位，透過 `$nodeLabel.headers` 存取 headers，並透過 `$nodeLabel.query` 存取 query。

可與 [Condition](../nodes/condition-node.md)、[LLM](../nodes/llm-node.md) 及 [Output](../nodes/output-node.md) 自然搭配使用。關於 payload 參照與欄位存取，請參閱 [Expression DSL](./expression-dsl.md) 與 [Webhooks](./webhooks.md)。

#### [Cron](../nodes/cron-node.md)

Cron 節點使用標準的五欄位 cron 表達式，依排程觸發 Workflow。不需要使用者輸入——Workflow 會在指定時間自動執行（例如每小時、每日、每 15 分鐘）。輸出為不含 payload 的 Trigger 事件。

關於排程與延遲執行，另請參閱 [Triggers](./triggers.md)、[Wait](../nodes/wait-node.md) 及 [Execution History](./execution-history.md)。

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

IMAP Trigger 節點以可設定的分鐘間隔輪詢收件匣，並針對每一封新偵測到的電子郵件啟動 Workflow。它會輸出解析後的 headers、寄件者與收件者清單、純文字與 HTML 內文、附件中介資料，以及 Trigger 時間戳記。可將其用於支援收件匣分類、信箱至 [Slack](../nodes/slack-node.md) 的路由，或搭配 [Human-in-the-Loop](./human-in-the-loop.md) 的電子郵件驅動核准流程。

可與 [Send Email](../nodes/send-email-node.md)、[LLM](../nodes/llm-node.md) 及 [Slack](../nodes/slack-node.md) 搭配，用於 inbound 分類與回覆 Workflow。

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Heym Trigger 節點會在 Heym 本身發布平台事件時啟動 Workflow：`heym.started`、`workflow.created`、`workflow.updated` 或 `workflow.deleted`。傳遞採用批次方式——在單一五秒分派視窗內發布的每個事件，會以 `$nodeLabel.events` 的形式在單次執行中送達，且一律為陣列。每個事件都會透過唯一的資料庫約束進行認領，因此無論有多少 worker、container 或機器正在執行，每個訂閱節點都只會觸發一次。可將其用於 Workflow 變更稽核軌跡、部署公告及執行個體健康摘要。

可與 [Heym](../nodes/heym-node.md) 節點搭配以查詢變更的 Workflow，並與 [Loop](../nodes/loop-node.md) 搭配以針對每個事件執行一次動作。

#### [Heym](../nodes/heym-node.md)

Heym 節點透過三種操作讀取 Heym 自身的資料：`listWorkflows` 傳回擁有者可觸及的每個 Workflow，並附帶節點數量與時間戳記；`getWorkflow` 傳回單一 Workflow 的節點與邊結構；`getExecutionHistory` 傳回執行歷史項目，依最新優先排序，並可選擇性套用狀態、時間範圍及數量限制篩選，同時附上依狀態分組的總計。結果的範圍限定於該節點所屬 Workflow 的擁有者，因此由 cron、入口網站或事件啟動的執行，會傳回與手動執行相同的資料。`getWorkflow` 會傳回完整的節點設定，這正是能夠稽核 Workflow 中是否有硬編碼金鑰或 Token 的原因；它不會暴露 Workflow 擁有者原本無法在編輯器中開啟的任何內容。不需要任何 credential。

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

WebSocket Trigger 節點會開啟對外部 WebSocket 伺服器的 outbound 用戶端連線，並在 `onMessage`、`onConnected` 或 `onClosed` 時啟動 Workflow。它會暴露解析後的訊息 payload、重新連線狀態、關閉中介資料，以及供下游表達式使用的 socket URL。

可與 [WebSocket Send](../nodes/websocket-send-node.md)、[HTTP](../nodes/http-node.md) 及 [SSE Streaming](./sse-streaming.md) 搭配，用於即時整合。

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Telegram Trigger 節點會接收 bot webhook 更新並立即啟動 Workflow。它會暴露完整的 update payload、主要 message 物件、callback queries、經過清理的 headers，以及 Trigger 時間戳記。可將其用於聊天機器人、[Telegram](../nodes/telegram-node.md) 中的 AI 助理，以及按鈕驅動的流程。

可與 [Telegram](../nodes/telegram-node.md)、[Agent Node](../nodes/agent-node.md) 及 [Webhooks](./webhooks.md) 搭配，用於 bot 驅動的 Workflow。

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Slack Trigger 節點會接收 Slack Events API webhooks，並在驗證請求簽章後自動啟動 Workflow。它會暴露事件 payload 與經過清理的 headers，以供下游路由、以 [LLM](../nodes/llm-node.md) 為基礎的分類，以及回覆流程使用。

可與 [Slack](../nodes/slack-node.md)、[Agent Node](../nodes/agent-node.md) 及 [Third-Party Integrations](./integrations.md) 搭配使用。

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Discord Trigger 節點會接收 Discord Interactions API webhooks，使用所選的 `discord_trigger` credential 驗證 Ed25519 簽章，並啟動 Workflow。它會暴露完整的 interaction payload、command 資料、經過清理的 headers，以及 Trigger 中介資料，以供下游路由或回覆使用。

可與 [Output](../nodes/output-node.md)、[Discord](../nodes/discord-node.md)、[Agent Node](../nodes/agent-node.md) 及 [Third-Party Integrations](./integrations.md) 搭配使用。
#### [RabbitMQ](../nodes/rabbitmq-node.md)

RabbitMQ 節點會從 RabbitMQ 佇列與交換器傳送或接收訊息。可用於訊息驅動的 Workflow 與事件處理。傳送模式會發布帶有選用延遲的訊息；接收模式則做為 [Trigger](./triggers.md)，讓 Workflow 在訊息送達時啟動。輸出包含 status、message_id 與 body。

可與 [Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md) 及 [Parallel Execution](./parallel-execution.md) 搭配，以進行事件驅動處理。

#### [Error Handler](../nodes/error-handler-node.md)

當 Workflow 中任何節點失敗時，Error Handler 節點會自動執行。不需要傳入的邊；它是由引擎觸發的。輸出包含錯誤訊息、失敗的節點標籤、節點類型與時間戳記。可用於透過 [Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md) 或 [Send Email](../nodes/send-email-node.md) 傳送通知、記錄錯誤，或傳回自訂錯誤回應。

除了在畫布上處理錯誤之外，Workflow 也可以將失敗委派給另一個 Workflow —— 請參閱 [Error Workflow](#error-workflow)。如果畫布上已經包含 Error Handler 節點，則**不會**呼叫錯誤 Workflow（本機處理常式優先）。

常見的通知目標為 [Slack](../nodes/slack-node.md)、[Telegram](../nodes/telegram-node.md) 與 [Send Email](../nodes/send-email-node.md)；在 [Execution History](./execution-history.md) 中更容易檢視執行詳細資料。

### AI

#### [Agent Node](../nodes/agent-node.md)

AI Agent 節點是具備工具呼叫能力的 [LLM](../nodes/llm-node.md) 節點。它可以執行 Python 工具、將已連接的畫布節點當作工具呼叫、連線至 [MCP](../tabs/mcp-tab.md) 伺服器、使用技能（指令檔與選用的 Python 指令碼）、做為委派給其他 Agent 節點的協調器，以及將其他 Workflow 當作工具呼叫。輸出可透過 `$nodeLabel.text` 取得。選用的 **Extra Body** 切換會將供應商特定請求參數的 JSON 物件附加到工具呼叫迴圈中的每個請求；預設為關閉。選用的 **Use Responses API** 切換會將 Agent 的模型呼叫導向 Responses API，這會在工具呼叫之間保留模型的推理，讓推理模型在多步驟迴圈中維持其思維鏈；預設為關閉，且可搭配 OpenAI 與自訂認證使用。

畫布節點工具可讓 Agent 直接從畫布呼叫已設定的 Workflow 節點。將支援的節點連線至 Agent 的工具控制代碼，然後使用機器人圖示將特定欄位標記為由 Agent 提供。這些欄位在執行階段會成為工具參數，而認證與未標記的欄位則維持固定在節點設定中。

Skills 區段現在包含用於建立新技能的 **AI Build**、針對現有技能的內嵌 AI 編輯動作、個別技能的 ZIP 下載，以及供需要在執行階段讀取 Heym Drive 檔案的技能使用的選用 **Enable Drive files** 開關。Skill Builder 強制回應視窗會在左側串流聊天對話、接受可搭配每則微調註解拖放的檔案、在右側顯示所產生 `SKILL.md` 與 `.py` 檔案的即時唯讀預覽、可將該預覽下載為 ZIP，並透過與手動上傳相同的 ZIP 擷取流程，將上傳的微調檔案儲存回成為隨附的技能資產。

啟用 **[Agent Persistent Memory](./agent-persistent-memory.md)** 後，每個 Agent 節點會保有自己的知識圖譜：當事實非空時會載入系統 Prompt，而成功的執行會觸發新實體與關聯性的背景合併。子 Agent 使用個別的圖譜。您可以從圖譜對話方塊以唯讀或讀寫存取權，將 Agent 的圖譜**分享**給其他 Agent（相同或其他 Workflow）。畫布上的大腦控制項會開啟圖譜編輯器。

Agent 節點也可以進入 [Human-in-the-Loop](./human-in-the-loop.md) 模式。在此模式中，Agent 會取得 `request_human_review` 工具，並可在特定需要核准的步驟暫停、建立一次性的公開審查連結、為通知流程公開 `review` 畫布分支，並等待審查者接受、編輯或拒絕 Markdown 審查文字。節點的 HITL 欄位可做為何時請求的核准準則，而面向審查者的摘要則會從每個審查請求產生。對於 [MCP](../tabs/mcp-tab.md) 工具，Heym 會使用模型將這些書面指令解譯為 `always`、`once` 或 `never`，因此自由形式的核准語句會對應至具體的執行階段原則。該次執行會標記為 `pending`，並在決策送達後從儲存的執行快照繼續；如果後續步驟也需要審查，同一次 Agent 執行可以暫停多次。

當 Agent 節點累積的訊息歷史接近模型情境視窗的 80% 時，會自動進行壓縮。系統 Prompt、第一則使用者訊息與最近一則使用者訊息一律會保留；其間的所有內容則使用相同的模型與認證進行摘要。壓縮事件會顯示於 Debug 面板、[Execution History](./execution-history.md) 與 [Traces](../tabs/traces-tab.md) 分頁中。

另請參閱 [LLM](../nodes/llm-node.md)、[Agent Architecture](./agent-architecture.md)、[Agent Persistent Memory](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md) 與 [File Generation](./file-generation.md)。
#### [Codex](../nodes/codex-node.md)

Codex 節點會在隔離的 Heym 工作區內執行 OpenAI Codex CLI。它接受 Codex 認證（以 ChatGPT 登入即可使用你的訂閱，無需按 Token 計費的 API 費用，或貼上 access token）、GitHub 認證、repository URL、base branch、task prompt、publish mode（`diff_only` 或 `draft_pr`）、branch name 以及 timeout。執行器會在本機複製 repository，僅將 ChatGPT token bundle 或 `CODEX_ACCESS_TOKEN` 傳遞給 Codex 程序，並回傳結構化摘要、驗證備註、變更的檔案、diff、使用量中介資料，以及選用的 draft PR URL。

當 Codex 回傳 `needs_input` 時，Workflow 會暫停並公開 `question` 分支。將該分支連接至 Slack、電子郵件或其他通知節點；公開的後續連結會在答案提交後恢復已儲存的執行快照。Codex 節點也可作為工具附加至 AI Agent，讓 Agent 委派程式設計任務；作為工具時，`needs_input` 結果會直接內聯回傳給 Agent，而不會暫停 Workflow。

另請參閱 [GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 以及 [Node Types](./node-types.md)。

#### [OpenCode Go](../nodes/opencode-go-node.md)

OpenCode Go 節點會針對 GitHub repository 執行 OpenCode CLI（Go）。隔離方式遵循 Codex 模式：在本機執行時作為主機子程序，而 Docker 部署則在共用工作區磁碟區的強化同層容器內執行。它接受 OpenCode Go 認證（帶有選用 base URL 的 gateway API key）、GitHub 認證、repository URL、base branch、task prompt、publish mode、branch name、timeout，以及從即時可搜尋的模型清單中選擇的 `opencode-go/<model>` 模型（附內建備援）。Heym 會在主機上執行所有 git/GitHub 操作，且絕不會將 GitHub token 放入沙箱內；OpenCode 僅編輯磁碟上的檔案。該節點會回傳結構化摘要、驗證備註、變更的檔案、diff，以及選用的 pull request URL。它可作為工具附加至 AI Agent。

另請參閱 [Codex](../nodes/codex-node.md)、[GitHub](../nodes/github-node.md)、[Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 以及 [Node Types](./node-types.md)。

#### [LLM](../nodes/llm-node.md)

LLM 節點會使用語言模型處理文字或生成圖片。它支援文字生成、視覺（圖片輸入）、圖片生成、結構化 JSON 輸出、針對支援的 OpenAI 及 OpenAI 相容 Endpoint 的供應商原生 Batch API 執行，以及選用的 **Use Responses API** 切換開關，將呼叫改經由 Responses API 而非 Chat Completions 路由（預設為關閉；可搭配 OpenAI 與自訂認證使用，且無法與 Batch 模式合併使用）。設定 credential、model、system 與 user messages、temperature 以及 max tokens；在 Prompt 中使用 [Expression DSL](./expression-dsl.md)。在 batch 模式下，`userMessage` 必須解析為陣列，節點會發出帶有進度更新的 `batchStatus` 分支，且最終輸出會包含逐項的 batch 結果。選用的 **Extra Body** 切換開關會將供應商特定請求參數的 JSON 物件（例如 `{"thinking": {"type": "disabled"}}`）附加至每個 API 呼叫；預設為關閉。選用的 [Guardrails](./guardrails.md) 會在呼叫前封鎖不安全的內容。

與 [Qdrant RAG](../nodes/rag-node.md)、[Agent Node](../nodes/agent-node.md)、[Guardrails](./guardrails.md) 以及 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 自然搭配使用。

#### [Decision](../nodes/decision-node.md)

Decision 節點會向決策模型提出關於執行狀態的具型別問題，並回傳機率而非文字敘述。**State** 欄位承載模型應讀取的內容——單一表達式會保留其自身型別，因此 `$input` 會傳送該物件而非其文字——而問題清單則承載判斷。問題有三種形式：**noul** 回答某條件是否成立，**choice** 從你定義的一組選項中挑選一個並回傳完整分布，而 **score** 則沿著有序等級評估狀態，且可能落在等級之間。Choice 與 score 答案亦帶有信賴度，因此 [Switch](../nodes/switch-node.md) 可依據答案進行路由，而 [Condition](../nodes/condition-node.md) 則可依據其確定程度進行閘控。**Generate with AI** 會從一句簡單敘述草擬 state 範本與問題列，而 **Custom request body** 則針對合約不同的 Endpoint 傳送手寫 JSON。供應商回應會原樣傳遞，且每次呼叫都會記錄於 [Traces](../tabs/traces-tab.md)。

需要 Decision Model 認證；與 [Switch](../nodes/switch-node.md)、[Condition](../nodes/condition-node.md) 以及 [Agent Node](../nodes/agent-node.md) 自然搭配使用。
#### [RAG / Vector Store](../nodes/rag-node.md)

RAG / Vector Store 節點會在向量儲存中插入、upsert、刪除及搜尋文件，以實現檢索增強生成。Database 下拉式選單可選取後端 — **Qdrant**（外部伺服器）或 **Postgres (pgvector)**（Heym 自有資料庫，無需外部服務），預設為 Qdrant。從 [Vectorstores](../tabs/vectorstores-tab.md) 分頁中選擇向量儲存，並將操作設為 insert、upsert、delete 或 search。Upsert 與 delete 會透過儲存於 payload 中的唯一 id 來定位文件 — **Document ID Field** 指定該欄位名稱（預設為 `doc_id`），而 **Document ID** 則帶入其值 — 因此文件會保留您自身系統已使用的 id：upsert 會先取代所有符合的 point，再儲存新版本；delete 則會回報是否有任何項目符合。文件中介資料（metadata）的值可接受表達式，因此 `{"url": "$start.url"}` 會儲存該次執行所產生的內容。Search 支援中介資料篩選、選用的 **Hybrid Search**（混合搜尋：向量相似度結合 BM25 關鍵字比對，讓 ID 和錯誤碼等精確術語能與語意相符項目一併被檢索）以及選用的 Cohere 重排序（reranking），並回傳一組結果陣列，包含 text、score、metadata、reranked 與 hybrid 旗標及 count，以供 [LLM](../nodes/llm-node.md) 或 [Agent Node](../nodes/agent-node.md) 流程使用。

常見的下游節點為 [LLM](../nodes/llm-node.md) 與 [Agent Node](../nodes/agent-node.md)；向量儲存設定請參閱 [Vectorstores](../tabs/vectorstores-tab.md)。

#### [MCP Call Node](../nodes/mcp-call-node.md)

MCP Call 節點會直接呼叫特定的 [MCP](../tabs/mcp-tab.md) 工具，無需由 LLM 決定要叫用哪個工具。當您在設計階段即確切知道要執行哪個工具時，便可使用此節點 — 適合在工作流程中進行確定性的單一步驟 MCP 工具執行。設定連線（SSE、Streamable HTTP 或 stdio；欄位與 [Agent Node](../nodes/agent-node.md) 的 MCP 連線相同），點擊 **Fetch Tools** 以填入下拉式選單，選擇工具，並填寫由該工具輸入 schema 自動產生的引數欄位。每個引數可接受靜態值或 [DSL 表達式](./expression-dsl.md)，例如 `$userInput.body.text`。結果可透過 `$nodeLabel.result` 取得（若可解析則為 JSON 物件，否則為字串）。MCP Call 節點無法作為畫布工具連接至 [Agent Node](../nodes/agent-node.md)。

另請參閱 [Agent Node](../nodes/agent-node.md)、[MCP](../tabs/mcp-tab.md) 及 [Expression DSL](./expression-dsl.md)。

### Logic

#### [Condition](../nodes/condition-node.md)

Condition 節點會依據 if/else 表達式將工作流程分支。它具有兩個輸出控制點：一個用於條件為真值（truthy）時，另一個用於假值（falsy）時。在條件表達式中使用 [Expression DSL](./expression-dsl.md) 的比較與邏輯運算子；該節點會將輸入傳遞至所選分支。

另請參閱 [Switch](../nodes/switch-node.md)、[Throw Error](../nodes/throw-error-node.md) 及 [Expression DSL](./expression-dsl.md)。

#### [Switch](../nodes/switch-node.md)

Switch 節點會將某個值與各 case 進行比對，藉此將執行路由至不同路徑。設定要評估的表達式及一組 case 值；每個 case 會取得一個來源控制點，而對於未符合的值則使用預設控制點。輸入會傳遞至符合的分支。

二元分支請使用 [Condition](../nodes/condition-node.md)，若要重新合併已路由的路徑則使用 [Merge](../nodes/merge-node.md)；比對規則詳見 [Expression DSL](./expression-dsl.md)。

#### [Merge](../nodes/merge-node.md)

Merge 節點會等待多個平行輸入，並將其合併為單一輸出。設定要等待的輸入數量；當所有分支完成後，該節點會產生一個合併物件。可在繼續執行前用它來匯合來自平行分支的結果；當平行分支各自結束於不同的 Output 節點時，請勿使用此節點。

另請參閱 [Parallel Execution](./parallel-execution.md)、[Loop](../nodes/loop-node.md)，以及重新合併分支時的 [Output](../nodes/output-node.md)。

#### [Loop](../nodes/loop-node.md)

Loop 節點會逐一迭代陣列，為每個項目執行下游節點。它需要從迭代主體中最後一個節點建立回連（back-connection）才能推進。在迴圈主體內可使用 `item`、`index`、`total`、`isFirst` 及 `isLast`；此迴圈針對迭代路徑與完成路徑具有各自的輸出。

可搭配 [Variable](../nodes/variable-node.md)、[Merge](../nodes/merge-node.md) 及 [Expression DSL](./expression-dsl.md) 以實現迭代式工作流程。

### Data

#### [Set](../nodes/set-node.md)

Set 節點會轉換並對應輸入資料，以產生自訂輸出。定義鍵值對應，其中每個值皆為 [Expression DSL](./expression-dsl.md) 表達式。可用於大寫轉換、子字串、串接、隨機數字及類似轉換。透過鍵存取輸出（例如 `$setNode.keyName`）。當作為畫布節點工具連接至 agent 時，對應值可標記為由 agent 提供，以便 agent 在執行階段填入。若要呼叫其他工作流程，請改用 [Execute](../nodes/execute-node.md) 節點。

另請參閱 [Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md) 及 [Expression DSL](./expression-dsl.md)。
#### [Converter](../nodes/converter-node.md)

Converter 節點無需撰寫程式碼即可在不同格式之間轉換資料。文字轉換包含 `csvToJson`（將 CSV 文字轉為列物件陣列，若無表頭則轉為陣列）、`jsonToCsv`（將物件/列陣列轉為 CSV 文字）、`xmlToJson`（將 XML 文字轉為物件），以及 `jsonToXml`（將物件轉為 XML 文字）。請設定轉換方向與來源表達式；CSV 轉換另需使用分隔符號與表頭處理設定，而 `jsonToCsv` 可指定明確的欄位順序。引號處理、內嵌分隔符號與內嵌換行皆遵循 RFC 4180。XML 屬性使用 `@` 前綴，混合屬性與文字時使用 `#text`，重複元素會轉為陣列，且 XML 實體展開功能已停用。同一節點亦可處理已儲存的檔案。`imageToText` 與 `pdfToText` 會執行 Tesseract OCR，從 Heym Drive 讀取檔案（可來自 File upload trigger 的 `$Upload.file.id`、Drive 節點的結果，或 agent 產生的檔案），依偵測到的字集自動選擇語言，或使用您指定的代碼如 `tur` 或 `eng+tur`，並預設將文字正規化為 UTF-8，另可選擇啟用 NFC 正規化及較窄的字集如 `cp1254`。`fileConvert` 會將已儲存的檔案改寫為另一種格式，文件透過 pandoc 處理、圖片透過 Pillow 處理，並將結果儲存為新的 Drive 檔案，不會更動原始檔案。結果可透過 `$converterNode.result` 取得，OCR 執行時另附帶 `.language`、`.encoding`、`.page_count`、`.pages` 與 `.file`，而 `fileConvert` 則附帶 `.id`、`.filename` 與 `.download_url`。

另請參閱 [Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md) 與 [Expression DSL](./expression-dsl.md)。

#### [Code](../nodes/code-node.md)

Code 節點會執行您撰寫的 Python 程式碼，搭配其專屬的 `requirements.txt`，在每次執行時建立並銷毀的容器中運行。您的程式碼需定義 `main(params)` 函式並回傳任何可 JSON 序列化的值，該值會成為 `$codeNode.result`；程式碼所印出的任何內容會另行擷取為 `$codeNode.logs`，而 `$codeNode.install` 會回報由哪個工具安裝了相依套件。參數以 JSON 物件形式設定，其中的 `$` 表達式會在執行前解析完畢，程式碼則以點記法讀取它們，例如 `params.user.name` 或 `params.orders[0].id`。相依套件使用 `uv` 安裝，對於 `uv` 無法處理的套件則退回使用 `pip`，執行之間不進行快取；將 `requirements.txt` 留空會完全跳過安裝，速度也快得多。除非開啟 `codeAllowNetwork`，否則執行階段沒有網路，而相依套件安裝則一律會連線至 PyPI。沙箱以非 root 身分執行，所有 capabilities 皆已移除，根檔案系統為唯讀，無 Docker socket，也無法存取後端機密，並限制為 512 MB 記憶體、一個 CPU、256 個行程、120 秒安裝時間與 60 秒執行時間。必須具備 Docker 且沒有備援模式：若無可連線的 daemon，該節點會直接失敗，而不會在後端行程中執行您的程式碼。

#### [Variable](../nodes/variable-node.md)

Variable 節點會設定或更新 workflow 區域變數（`$vars.variableName`）或持久化的[全域變數](./global-variables.md)（`$global.variableName`）。可用於計數器、累積清單與共享狀態。請設定變數名稱、值表達式、型別強制轉換，以及是否儲存至全域儲存區。陣列變數支援 `$array()` 與 `.add()`。

可搭配 [Set](../nodes/set-node.md)、[Loop](../nodes/loop-node.md) 與 [Global Variables](./global-variables.md) 使用。

#### [Execute](../nodes/execute-node.md)

Execute 節點會呼叫另一個 workflow（子 workflow）並傳入輸入。請以 ID 指定目標 workflow，並透過單一表達式或鍵值對應提供輸入。輸出包含 workflow_id、status 與 outputs；適用於可重複使用的邏輯，而非資料轉換（資料轉換請使用 Set）。

另請參閱 [Canvas Features](./canvas-features.md) 的 Extract to Sub-Workflow、[Workflow Structure](./workflow-structure.md) 與 [Output](../nodes/output-node.md)。

### Integrations

#### [HTTP](../nodes/http-node.md)

HTTP 節點使用 cURL 風格的設定發出 HTTP 請求。它可作為 workflow 的起始點（無傳入邊），或接收上游節點的輸入。回應可透過 status、headers 與 body 取得（若適用則為解析後的 JSON）。Bearer 或自訂標頭驗證請使用 [Credentials](./credentials.md)。

可搭配 [Webhooks](./webhooks.md)、[Credentials](./credentials.md) 與 [Third-Party Integrations](./integrations.md) 使用。

#### [WebSocket Send](../nodes/websocket-send-node.md)

WebSocket Send 節點會開啟對外 client 連線、傳送一則 text/JSON/binary 訊息，然後關閉連線。可用於將 workflow 輸出發布至即時系統，而無需建立由 Heym 託管的 socket endpoint。

另請參閱 [WebSocket Trigger](../nodes/websocket-trigger-node.md)、[SSE Streaming](./sse-streaming.md) 與 [Third-Party Integrations](./integrations.md)。
#### [Telegram](../nodes/telegram-node.md)

Telegram 節點會傳送機器人訊息至聊天室、群組或頻道。請設定 Telegram [credential](./credentials.md)、設定 `chatId`，並使用 [Expression DSL](./expression-dsl.md) 表達式撰寫要送出的 `message`。它可與 [Telegram Trigger](../nodes/telegram-trigger-node.md) 自然搭配以實現對話式 Workflow，並可與 [Error Handler](../nodes/error-handler-node.md) 搭配以向操作人員發送警示。

另請參閱 [Third-Party Integrations](./integrations.md) 與 [Credentials](./credentials.md)，以了解設定與 credential 模式。

#### [Slack](../nodes/slack-node.md)

Slack 節點會透過 Incoming Webhook 傳送訊息至 Slack 頻道。請設定 Slack [credential](./credentials.md) 與訊息表達式。可將其用於通知、警示與錯誤回報；輸出會直接傳遞輸入內容。

可與 [Slack Trigger](../nodes/slack-trigger-node.md)、[Error Handler](../nodes/error-handler-node.md) 與 [Third-Party Integrations](./integrations.md) 搭配使用。

#### [Discord](../nodes/discord-node.md)

Discord 節點會透過 Incoming Webhook 傳送訊息至 Discord 頻道。請設定 Discord [credential](./credentials.md)、使用 [Expression DSL](./expression-dsl.md) 撰寫要送出的訊息，並可選擇性設定 webhook 使用者名稱或頭像覆寫。

可與 [Discord Trigger](../nodes/discord-trigger-node.md)、[Output](../nodes/output-node.md)、[Error Handler](../nodes/error-handler-node.md) 與 [Third-Party Integrations](./integrations.md) 搭配使用。

#### [Send Email](../nodes/send-email-node.md)

Send Email 節點會透過 SMTP 傳送電子郵件。請設定 SMTP [credential](./credentials.md)，並使用 [Expression DSL](./expression-dsl.md) 表達式設定收件者、主旨與內文。可將其用於通知、警示與交易型電子郵件。輸出包含 status、to 與 subject。

[IMAP Trigger](../nodes/imap-trigger-node.md) 透過處理 inbound 郵件來補足 Send Email。兩者搭配可讓 Workflow 從共用信箱讀取 incoming 電子郵件、使用 AI 節點進行摘要或分類，並傳送後續或升級訊息。[Telegram Trigger](../nodes/telegram-trigger-node.md) 與 [Telegram 節點](../nodes/telegram-node.md) 則為機器人驅動的聊天 Workflow 提供相同的 inbound/outbound 模式。

針對雙向通知流程，它也可與 [LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md) 與 [Third-Party Integrations](./integrations.md) 良好搭配。

#### [Redis](../nodes/redis-node.md)

Redis 節點會執行 Redis 操作：set、get、hasKey 與 deleteKey。可將其用於快取、速率限制與鍵值儲存。請設定 [credential](./credentials.md)、操作類型、key 表達式，並針對 set 操作設定 value 與選用的 TTL。輸出會依操作而異（value、success、exists、deleted）。

可與 [Wait](../nodes/wait-node.md)、[Variable](../nodes/variable-node.md) 與 [Parallel Execution](./parallel-execution.md) 搭配，以進行快取、節流與協調。

#### [Grist](../nodes/grist-node.md)

Grist 節點會讀取、寫入與管理 Grist 試算表中的資料。操作包含 getRecord、getRecords、createRecord、updateRecord、deleteRecord、listTables 與 listColumns。請提供 document ID、table ID，並針對 create/update 使用 column ID 提供 record 資料。可將其用於 CRUD、批次更新與試算表自動化。

另請參閱 [Google Sheets](../nodes/google-sheets-node.md)、[DataTable](../nodes/datatable-node.md) 與 [Third-Party Integrations](./integrations.md)。

#### [Google Sheets](../nodes/google-sheets-node.md)

Google Sheets 節點會透過 OAuth2 讀取、寫入與管理試算表資料。可將其用於在 Workflow 中讀取報表、附加 Workflow 結果、更新追蹤表，以及清除或檢查工作表分頁。如同 [BigQuery](../nodes/bigquery-node.md)，它使用 Google 支援的整合 credential，且當試算表資料是流程的一部分時，很適合與 [Grist](../nodes/grist-node.md) 搭配使用。

可與 [Grist](../nodes/grist-node.md)、[DataTable](../nodes/datatable-node.md) 與 [Third-Party Integrations](./integrations.md) 搭配使用。

#### [BigQuery](../nodes/bigquery-node.md)

BigQuery 節點會透過 OAuth2 執行 SQL 查詢並將資料列插入 Google BigQuery 資料集。它適用於分析 Workflow、報表管道，以及從 Workflow 執行寫入結構化事件資料。它經常與 [Set](../nodes/set-node.md) 搭配以塑造資料列，並與 [Google Sheets](../nodes/google-sheets-node.md) 搭配以進行較輕量的試算表導向報表。

可與 [Set](../nodes/set-node.md)、[LLM](../nodes/llm-node.md)、[Google Sheets](../nodes/google-sheets-node.md) 與 [Third-Party Integrations](./integrations.md) 搭配使用。
#### [Google Drive](../nodes/google-drive-node.md)

Google Drive 節點透過 OAuth2 列出、下載、更新及刪除 Drive 檔案與資料夾，並可透過其 `syncToHeymDrive` 操作將 Drive 檔案直接複製到 [Heym Drive](../nodes/drive-node.md)。Google Docs、Sheets 及 Slides 沒有可下載的位元組內容，因此該節點會自動匯出它們——Docs 匯出為 PDF、Sheets 匯出為 XLSX、Slides 匯出為 PPTX——並可覆寫目標格式。除非啟用「Delete permanently」，否則刪除操作會將項目移至 Drive 垃圾桶，且該節點會拒絕透過檔案操作刪除資料夾，反之亦然。如同 [Google Sheets](../nodes/google-sheets-node.md)，它使用由 Google 支援的 OAuth2 認證；請注意此認證要求完整的 Drive 存取權，因此分享前請先檢閱[認證分享](./credentials-sharing.md)。

搭配 [Loop](../nodes/loop-node.md)、[Drive](../nodes/drive-node.md)、[LLM](../nodes/llm-node.md) 及[第三方整合](./integrations.md)使用。

#### [GitHub](../nodes/github-node.md)

GitHub 節點提供 40 項原生 GitHub REST 動作，涵蓋儲存庫、組織與使用者、issue、pull request、review、release、Actions workflow、流量洞察及儲存庫檔案。可用於 issue 分類、review 自動化、workflow 觸發與完成等待、release 自動化，以及儲存庫檔案更新，無需手動建構 HTTP 請求。它支援 GitHub.com，並可在認證上選擇性設定 GitHub Enterprise 的 `base_url`。

搭配 [Agent Node](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Set](../nodes/set-node.md) 及[第三方整合](./integrations.md)使用。

#### [Jira](../nodes/jira-node.md)

Jira 節點將 workflow 連接至 Jira Cloud 或 Jira Data Center / Server REST API，以進行專案、issue、留言、附件、使用者、通知及轉換自動化。它可以列出專案、使用 JQL 搜尋 issue、建立或更新 issue、檢視 changelog、通知利害關係人、管理留言與附件、擷取或管理使用者、列出可用的轉換，並透過轉換 ID 移動 issue。請使用包含 Atlassian 電子郵件、API token、站台 base URL 及部署模式的 Jira 認證。

搭配 [LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md) 及[第三方整合](./integrations.md)，用於支援案件受理、bug 分類及 release workflow。

#### [Linear](../nodes/linear-node.md)

Linear 節點將 workflow 連接至 Linear 的 GraphQL API，以進行工作區與 issue 自動化。它可以列出團隊、專案、issue、workflow 狀態、團隊成員及留言；建立、更新、刪除及連結 issue；以及建立、更新、解決、取消解決或刪除留言。請使用 Linear 個人 API key 或 OAuth2 認證，然後在建立或更新 issue 之前，先從列表操作中取得團隊、專案、狀態及指派對象的 UUID。

搭配 [LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[Slack](../nodes/slack-node.md) 及[第三方整合](./integrations.md)，用於受理、分類及工程待辦事項 workflow。

#### [Supabase](../nodes/supabase-node.md)

Supabase 節點讀取及變更透過 Supabase PostgREST 暴露的資料表。它非常適合產品後端、使用者/個人資料、workflow 狀態，以及希望在不自行串接 HTTP 請求的情況下存取資料庫的 CRUD 風格自動化。

搭配 [Set](../nodes/set-node.md)、[DataTable](../nodes/datatable-node.md)、[HTTP](../nodes/http-node.md) 及[第三方整合](./integrations.md)使用。

#### [ClickHouse](../nodes/clickhouse-node.md)

ClickHouse 節點透過其 HTTP 介面，對外部 ClickHouse 資料庫執行 CRUD、count 及原始 SQL 操作。它適合分析管道、事件記錄及報表 workflow：在事件發生時插入，然後使用 `query`/`count` 進行彙總或計數。它對應 [DataTable](../nodes/datatable-node.md) 的操作集（find、getAll、count、getById、insert、update、remove、upsert），並額外提供原始 SQL 的逃生通道，其中 `update`/`remove` 以 ClickHouse mutation 形式執行。

搭配 [Set](../nodes/set-node.md)、用於排程報表的 [Cron](../nodes/cron-node.md) 及[第三方整合](./integrations.md)使用。

#### [Notion](../nodes/notion-node.md)

Notion 節點透過目前的 Notion API（`2026-03-11`）管理 Notion 資料庫、資料來源、頁面及區塊。它支援搜尋、頁面 CRUD、資料庫與資料來源操作、區塊子項、附加/更新/刪除區塊，以及垃圾桶/還原。請使用內部整合 token 或 Notion 公開整合 OAuth 認證。編輯器可以搜尋並以游標分頁瀏覽可存取的資料來源與父頁面。共享認證在 workflow 執行時與自有認證的運作方式相同。

若需自訂 REST 呼叫，`$credentials.YourNotionCredential` 會解析為相同的 bearer token。搭配 [Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[LLM](../nodes/llm-node.md) 及[第三方整合](./integrations.md)使用。
#### [Sentry](../nodes/sentry-node.md)

Sentry 節點透過 Sentry REST API 自動化 Sentry 組織、專案、團隊、議題、事件與版本發佈。可用於警示分類、議題狀態更新、版本發佈自動化、事件查詢，以及專案/團隊的設定或清理。它支援 Sentry SaaS 與自架 Sentry，並可透過選用的 credential base URL 進行連線。

可與 [Error Handler](../nodes/error-handler-node.md)、[Slack](../nodes/slack-node.md)、[Linear](../nodes/linear-node.md) 及 [Third-Party Integrations](./integrations.md) 搭配，用於事故與版本發佈 Workflow。

#### [DataTable](../nodes/datatable-node.md)

DataTable 節點可讀取、寫入及管理 Heym DataTables（第一方結構化儲存）中的資料。操作包含 find、getAll、getById、insert、update、remove 與 upsert。無需外部憑證。資料表可從 [DataTable](../tabs/datatable-tab.md) 儀表板分頁管理，並由 Workflow 擁有者直接存取。

可與 [Set](../nodes/set-node.md)、[Variable](../nodes/variable-node.md) 及 [DataTable 分頁](../tabs/datatable-tab.md) 搭配，用於第一方結構化儲存。

#### [Drive](../nodes/drive-node.md)

Drive 節點可直接在 Workflow 中管理由 skill 產生的檔案。操作包含 delete、setPassword、setTtl、setMaxDownloads、shareWithMyTeams 與 unshareWithMyTeams，用於唯讀團隊存取管理；格式轉換則改由 [Converter](../nodes/converter-node.md) 節點負責。可使用 `$agentLabel._generated_files[0].id` 參照檔案；輸出包含 status、file_id、用於連結限制的更新後 download_url，以及用於團隊分享的 shared_team_count。這在使用 [File Generation](./file-generation.md) 與 [Drive](./drive.md) 參照模型的 [Agent Node](../nodes/agent-node.md) Workflow 中特別實用。

常見搭配為 [Agent Node](../nodes/agent-node.md)、[File Generation](./file-generation.md) 與 [Drive](./drive.md)。

#### [Amazon S3](../nodes/amazon-s3-node.md)

Amazon S3 節點使用 `s3` 憑證（access key、secret key、region、選用的 session token）在 Amazon S3 上執行物件儲存操作。操作包含 putObject、getObject、deleteObject、listObjects、copyObject、createBucket、deleteBucket、createFolder、deleteFolder、getAllFolder 與 listBuckets。支援文字上傳與文字或 base64 下載，且 bucket 與 key 欄位可接受 [Expression DSL](./expression-dsl.md)。可用於儲存 Workflow 輸出、封存檔案，以及將物件讀回流程中。

可與 [Set](../nodes/set-node.md)、[HTTP](../nodes/http-node.md)、[Credentials](./credentials.md) 及 [Third-Party Integrations](./integrations.md) 搭配。

### Automation

#### [Crawler](../nodes/crawler-node.md)

Crawler 節點使用 FlareSolverr 擷取網頁，並可透過 CSS selector 進行選用的 HTML 內容擷取。設定 FlareSolverr [credential](./credentials.md)、URL 表達式、等待時間，以及用於擷取的選用 selector。輸出為原始 HTML 或擷取後的內容。可用於網頁擷取與內容萃取。

可與 [HTTP](../nodes/http-node.md)、[Playwright](../nodes/playwright-node.md) 及 [LLM](../nodes/llm-node.md) 搭配，用於擷取與分析流程。

#### [Playwright](../nodes/playwright-node.md)

Playwright 節點透過可設定的步驟（navigate、refresh、click、type、screenshot、extract、aiStep）或 **Run Code** 模式（用於自訂 Playwright Python；沙箱化，預設透過 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED` 關閉）自動化瀏覽器互動。它支援 headless 模式、可選的降低常見 Playwright 自動化訊號設定、timeout、選用的網路擷取（responses、cookies、localStorage、sessionStorage）、從 [Global Variables](./global-variables.md) 表達式（例如 `$global.authState`）啟動的 cookie/storageState 驗證、當驗證還原失敗時的備援登入步驟，以及當 selector 失敗時具備 Auto Heal 的 AI 步驟。可用於網頁擷取、表單填寫與瀏覽器型 Workflow。

另請參閱 [Crawler](../nodes/crawler-node.md)、[HTTP](../nodes/http-node.md) 及 [Execution History](./execution-history.md)，以了解瀏覽器自動化與除錯。

### Utilities

#### [Output](../nodes/output-node.md)

Output 節點是 Workflow 的 endpoint，負責將回應回傳給呼叫方。設定 message 表達式以透過 label 參照前一個節點（切勿在此使用來自 [Input](../nodes/input-node.md) 節點的 `$input`）。選用的非同步下游可讓 output 之後的節點在回應送出後於背景執行。

常見的上游來源為 [Input](../nodes/input-node.md)、[LLM](../nodes/llm-node.md) 及 [Execute](../nodes/execute-node.md)；回應塑形在 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 中較易於除錯。

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

JSON output mapper 節點會從 [Set](../nodes/set-node.md) 風格的鍵值對應建立純 JSON 物件，並將其回傳於 Workflow 回應的根層級。當 API 呼叫方應收到原始 JSON body，而非標準 [Output](../nodes/output-node.md) 節點包裝時，請使用此節點。
#### [HTML 輸出映射器](../nodes/html-output-mapper-node.md)

HTML 輸出映射器節點會渲染單一 HTML 範本，並將 `$nodeLabel.field` 表達式內插至頁面中。當它是 Workflow 中唯一的終端節點時，execute webhook 會以 `text/html` 及該節點所設定的狀態碼回應，而非 JSON 主體，因此 Workflow 可以直接向瀏覽器提供頁面。傳送 `X-Simple-Response: false` 可取得一般的 JSON 封裝格式以進行除錯。

搭配 [Set](../nodes/set-node.md)、[Output](../nodes/output-node.md)、[Workflow Structure](./workflow-structure.md) 及 [Webhooks](./webhooks.md) 使用。

#### [Chart Output](../nodes/chart-output-node.md)

Chart Output 節點是 [Dashboard](../tabs/dashboard-tab.md) 小工具 Workflow 的終端節點。它會將上游節點所產生的資料列轉換為標準化的圖表 Payload，供 Dashboard 渲染。選擇 `chartType`（bar、line、area、pie、table、numeric、gauge、scatter、proportion、bar gauge、text 或 HITL），映射 `labelField`/`valueField`（或多系列時使用 `series`，或使用 `text` 作為 markdown 訊息），並將其置於最後；它沒有輸出邊。HITL 會忽略上游資料列，並列出您待處理的人工審核項目。另一列作為可在新標籤頁中打開 URL 的鏈接按鈕（`linkColumn`，使用 `linkLabel` 指定按鈕文本）

另請參閱 [Dashboard](../tabs/dashboard-tab.md)、[Set](../nodes/set-node.md) 及 [Output](../nodes/output-node.md)。

#### [Wait](../nodes/wait-node.md)

Wait 節點會暫停 Workflow 執行指定的毫秒持續時間，最長可達 15 分鐘。可用於速率限制、延遲動作或輪詢間隔。它會原樣傳遞輸入。

搭配 [Cron](../nodes/cron-node.md)、[Redis](../nodes/redis-node.md) 及 [Parallel Execution](./parallel-execution.md) 使用，以進行節奏控制與輪詢。

#### [Sticky Note](../nodes/sticky-note-node.md)

Sticky Note 節點會在畫布上新增 markdown 註記。它不會被執行。可用於文件、指示或其他 [Canvas Features](./canvas-features.md) 旁的 Workflow 註記。在畫布上按兩下即可編輯註記內容。

另請參閱 [Canvas Features](./canvas-features.md)、[Keyboard Shortcuts](./keyboard-shortcuts.md) 及 [Workflow Organization](./workflow-organization.md)。

#### [Console Log](../nodes/console-log-node.md)

Console Log 節點會將值記錄至後端（伺服器）主控台。可用於開發期間的除錯與檢查。記錄訊息支援 [Expression DSL](./expression-dsl.md) 表達式；輸出會原樣傳遞輸入。

搭配 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 及 [Expression Evaluation Dialog](./expression-evaluation-dialog.md) 使用，以進行除錯。

#### [Disable Node](../nodes/disable-node.md)

Disable Node 節點會將 Workflow 中另一個節點的 `active` 旗標設為 false，藉此永久停用該節點。請以標籤指定目標節點。可用於一次性操作，例如在條件滿足後停止 [Cron](../nodes/cron-node.md) Trigger。

另請參閱 [Canvas Features](./canvas-features.md)、[Edit History](./edit-history.md) 及 [Cron](../nodes/cron-node.md)，以了解 Workflow 控制模式。

#### [Enable Node](../nodes/enable-node.md)

Enable Node 節點會將另一個節點的 `active` 旗標設為 true 並儲存變更，藉此重新開啟該節點。請以標籤指定目標節點。可用於從另一個進入點重新啟用已停用的 [Cron](../nodes/cron-node.md) Trigger，或在條件滿足後開啟某個節點。若目標節點位於 Enable Node 的下游且尚未執行，也會在當前執行中一併執行。

另請參閱 [Disable Node](../nodes/disable-node.md)、[Canvas Features](./canvas-features.md) 及 [Cron](../nodes/cron-node.md)，以了解 Workflow 控制模式。

#### [Throw Error](../nodes/throw-error-node.md)

Throw Error 節點會立即停止 Workflow 執行，並以自訂的 HTTP 狀態碼傳回錯誤回應。設定錯誤訊息表達式與狀態碼（例如 400、401、403、404、429、500）。可用於驗證失敗、未授權存取或其他錯誤情況，尤其適合搭配 [Condition](../nodes/condition-node.md) 與 [Error Handler](../nodes/error-handler-node.md) 使用。

搭配 [Condition](../nodes/condition-node.md)、[Error Handler](../nodes/error-handler-node.md) 及 [Security](./security.md) 使用，以建立明確的失敗路徑。

---

## Reference
### [節點類型](./node-types.md)

Heym 提供多種節點類型：Trigger 類如 [Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Slack Trigger](../nodes/slack-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md) 與 [Error Handler](../nodes/error-handler-node.md)；AI 節點如 [LLM](../nodes/llm-node.md)、[Decision](../nodes/decision-node.md)、[Agent Node](../nodes/agent-node.md)、[Codex](../nodes/codex-node.md)、[OpenCode Go](../nodes/opencode-go-node.md)、[Qdrant RAG](../nodes/rag-node.md) 與 [MCP Call](../nodes/mcp-call-node.md)；邏輯節點如 [Condition](../nodes/condition-node.md)、[Switch](../nodes/switch-node.md)、[Merge](../nodes/merge-node.md) 與 [Loop](../nodes/loop-node.md)；資料節點如 [Set](../nodes/set-node.md)、[Converter](../nodes/converter-node.md)、[Code](../nodes/code-node.md)、[Variable](../nodes/variable-node.md)、[Execute](../nodes/execute-node.md) 與 [Heym](../nodes/heym-node.md)；整合類如 [HTTP](../nodes/http-node.md)、[GitHub](../nodes/github-node.md)、[Jira](../nodes/jira-node.md)、[Linear](../nodes/linear-node.md)、[Notion](../nodes/notion-node.md)、[Sentry](../nodes/sentry-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、[Discord](../nodes/discord-node.md)、[Send Email](../nodes/send-email-node.md)、[Redis](../nodes/redis-node.md)、[Grist](../nodes/grist-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Google Drive](../nodes/google-drive-node.md)、[BigQuery](../nodes/bigquery-node.md)、[Supabase](../nodes/supabase-node.md)、[ClickHouse](../nodes/clickhouse-node.md)、[DataTable](../nodes/datatable-node.md) 與 [Drive](../nodes/drive-node.md)；自動化節點如 [Crawler](../nodes/crawler-node.md) 與 [Playwright](../nodes/playwright-node.md)；以及工具類如 [Wait](../nodes/wait-node.md)、[Output](../nodes/output-node.md)、[JSON output mapper](../nodes/json-output-mapper-node.md)、[HTML output mapper](../nodes/html-output-mapper-node.md)、[Console Log](../nodes/console-log-node.md)、[Throw Error](../nodes/throw-error-node.md)、[Disable Node](../nodes/disable-node.md)、[Enable Node](../nodes/enable-node.md) 與 [Sticky Note](../nodes/sticky-note-node.md)。在節點配置中使用如 `$input.text` 與 `$nodeLabel.field` 的表達式。

另請參閱 [Triggers](./triggers.md)、[Third-Party Integrations](./integrations.md) 與 [Parallel Execution](./parallel-execution.md)。

### [Expression DSL](./expression-dsl.md)

Heym 使用簡單的表達式語言來引用上游節點的資料。使用 `$input` 代表 [Input](../nodes/input-node.md) 節點，`$nodeLabel.field` 代表任何上游節點，`$credentials.CredentialName` 代表 [credentials](./credentials.md)，`$global.variableName` 代表 [global variables](./global-variables.md)。內建的特別變數包括 `$now`、`$UUID`，以及 workflow 中繼資料：`$workflowName`、`$workflowDescription`、`$workflowPath`、`$workflowUrl` 與 `$executionId`（該次執行的 [Execution History](./execution-history.md) id — `/workflows/{id}/{executionId}` 會在畫布上開啟該次執行；僅限執行階段，在表達式預覽對話框中為空）。支援的內容包括字面值、算術、比較、[Loop](../nodes/loop-node.md) 上下文、巢狀欄位，以及字串／陣列輔助函式（包含 `$text.toJson()` 用以解析 JSON 字串）。當完整值為單一 `$expr` 時，後端會將陣列、物件、布林值與數字保留為原生類型。

另請參閱 [Expression Evaluation Dialog](./expression-evaluation-dialog.md)、[Global Variables](./global-variables.md) 與 [Workflow Structure](./workflow-structure.md)。

### [Global Variables](./global-variables.md)

Global Variable Store 保存持久的、使用者範圍的鍵值資料，可跨 workflow 執行持續存在。可從 [Variables](../tabs/global-variables-tab.md) 分頁建立變數，或從啟用「Store in Global Variable Store」的 [Variable](../nodes/variable-node.md) 節點建立。在表達式中使用 `$global.variableName` 存取它們；這些變數可與其他使用者或 [teams](./teams.md) 共享。

與 [Variable](../nodes/variable-node.md)、[Teams](./teams.md) 及 [Credentials Sharing](./credentials-sharing.md) 搭配使用，以實現共享的 workflow 狀態。
### [Expression Evaluation Dialog](./expression-evaluation-dialog.md)

Expression Evaluation Dialog 是一個可展開的編輯器，當你點擊 expression 欄位旁的展開按鈕時會出現。它會以大型置中 modal 的形式開啟，保持 autocomplete 啟用，並在你停止輸入後自動重新整理後端預覽輸出。物件與陣列結果可透過輸出路徑選擇器瀏覽。此 dialog 接受整行裸點路徑（例如 `myNode.output.field`），視同 `$myNode.output.field`；請參閱 [Expression DSL](./expression-dsl.md) 的放置規則。

工具列中的 **Build with AI** 按鈕讓你以純文字描述想要的 expression。選擇一個 LLM [credential](./credentials.md) 與 model，輸入描述例如 *「Get the customer name from the API response」*，然後點擊 Generate。後端會將 [Expression DSL](./expression-dsl.md) 上下文與上次執行的節點輸出傳送給 model，並回傳單一 expression 字串。結果會立即評估，因此你可以在點擊 Apply 前先行驗證。

與 [Expression DSL](./expression-dsl.md)、[Output](../nodes/output-node.md) 及 [JSON output mapper](../nodes/json-output-mapper-node.md) 自然搭配使用。

### [Workflow Structure](./workflow-structure.md)

Workflow 以 JSON 儲存，包含節點與邊。workflow 物件包含 id、name、description、nodes、edges 及 auth 設定。每個節點具有 id、type、position 及 data（label 與型別專屬設定）。邊會以來源與目標節點 ID 連接，並可選擇性帶有 handle ID。data 欄位中的 expression 語法遵循 [Expression DSL](./expression-dsl.md)，而 [Download & Import](./download-import.md) 也使用相同的結構。

另請參閱 [Node Types](./node-types.md)、[Expression DSL](./expression-dsl.md) 及 [Download & Import](./download-import.md)。

### [Canvas Features](./canvas-features.md)

將滑鼠停留在任何非 sticky 的 canvas 節點上，然後點擊 **Run** 以執行至該節點。必要輸入會開啟於 Run 面板中，並將焦點放在第一個欄位；沒有輸入的路徑會立即開始。請參閱 [Run to Node](./canvas-features.md#run-to-node)。

workflow 編輯器提供 Data Pin（釘選節點的最後輸出，以便在不重新執行的情況下測試下游）、Execution Logs（即時節點結果與 agent 進度，可補足 [Execution History](./execution-history.md)）、Enable/Disable（在執行期間略過節點），以及 Extract to Sub-Workflow（將選取範圍移至新的 workflow，並以 [Execute](../nodes/execute-node.md) 節點取代）。執行中的 production execution 可從 History 或 Board 卡片開啟；編輯器會還原其目前快照、附加至 SSE，並保持 canvas 動畫與 Debug logs 即時更新。[Keyboard Shortcuts](./keyboard-shortcuts.md) 支援複製、貼上、執行及行內節點搜尋。

另請參閱 [Keyboard Shortcuts](./keyboard-shortcuts.md)、[Edit History](./edit-history.md) 及 [Execution History](./execution-history.md)。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym 在編輯器中提供多種快速鍵：Command Palette（Ctrl+K）、Run（Ctrl+Enter）、Save（Ctrl+S）、Undo/Redo，以及 Escape 以關閉。在 canvas 上：全選、多選、複製/剪下/貼上、刪除、切換節點啟用狀態（D）、切換釘選資料（P），以及透過輸入進行行內節點搜尋。快速鍵已記錄於應用程式內參考中，並與 [Canvas Features](./canvas-features.md)（例如 Data Pin 與節點啟用/停用）密切搭配運作。

另請參閱 [Canvas Features](./canvas-features.md)、[Quick Drawer](./quick-drawer.md) 及 [Contextual Showcase](./contextual-showcase.md)。

### [AI Assistant](./ai-assistant.md)

AI Assistant 是一個從 Debug 面板開啟的聊天面板，讓你以自然語言建立或修改 workflow。選擇一個 [credential](./credentials.md) 與 model，然後描述你的需求；AI 會串流回應，且程式碼區塊中任何有效的 [workflow JSON](./workflow-structure.md) 都會自動解析並套用至 canvas。相容的瀏覽器支援語音輸入。

開啟 **YOLO mode**（Agent mode，預設為關閉）後，assistant 會測試它所建立的內容。每次變更後，它會在 canvas 上執行 workflow、讀取結果並修正 workflow，直到符合你的要求為止，每則訊息最多執行 5 次。它會在第一次執行前要求測試輸入，可在需要其他 workflow 的結果時執行它們，並在運作過程中顯示每個步驟。請參閱 [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode)。

點擊畫布上任何節點上方的 **AI** 即可僅更改或修復該節點。面板會顯示其正在修改的節點（運行後帶有其最新結果），並提供 **Change this node as ...**、**Fix error in this node ...** 和 **Other**。僅該節點會被更新；工作流的其餘部分和佈局保持原樣。請參閱 [AI Assistant › 修改單個節點](./ai-assistant.md#changing-one-node)。

當 workflow 儲存記錄時，assistant 會詢問要使用哪個 [data table](../tabs/datatable-tab.md)，或建立一個包含 workflow 所需欄位的 data table。請參閱 [AI Assistant › Data tables](./ai-assistant.md#data-tables)。

當目前的 workflow 包含 [Agent Node](../nodes/agent-node.md) skills 時，assistant 只會將每個 skill 的 `SKILL.md` 傳送至 workflow 上下文中。附加的 `.py` 檔案與二進位 skill 資產會在請求前被排除，以避免大型 skill 組合超出 model 上下文視窗。

與 [Chat with Heym](./chat-with-heym.md)、[Agent Architecture](./agent-architecture.md) 及 [Expression DSL](./expression-dsl.md) 搭配良好。
### [與 Heym 對話](./chat-with-heym.md)

「與 Heym 對話」是一項文件頁首助理，用於回答產品相關問題。它會以置中對話框開啟，將憑證與模型選擇持續顯示於頂部，將目前所在的文件頁面路徑作為上下文注入，並在對話框關閉時清除訊息歷史記錄。它與更全面的 [AI Assistant](./ai-assistant.md) 及較輕量的 [Contextual Showcase](./contextual-showcase.md) 相輔相成。

另請參閱 [AI Assistant](./ai-assistant.md)、[Contextual Showcase](./contextual-showcase.md) 及 [Node Types](./node-types.md)。

### [Workflow 組織](./workflow-organization.md)

執行個體管理員（`HEYM_ADMIN_EMAILS`）可以存取並編輯所有 Workflow、依電子郵件尋找擁有者的 Workflow、檢視排程與執行歷史記錄、暫停與恢復自動 Trigger，並在執行結束後刪除 Workflow。請參閱[執行個體管理](../tabs/workflows-tab.md#instance-administration)以了解離職流程，以及暫停自動 Trigger 與封鎖所有呼叫之間的區別。

Workflow 可以資料夾與子資料夾的樹狀結構進行組織。資料夾具有名稱與選用的父資料夾；Workflow 會被指派至資料夾。Workflow 可以排程刪除（在永久移除前先移至垃圾桶區域）。API 支援建立、更新、刪除，以及在資料夾之間移動 Workflow，相同的組織模型也會出現在 [Workflows](../tabs/workflows-tab.md) 分頁中。

另請參閱 [Quick Drawer](./quick-drawer.md)、[Download & Import](./download-import.md) 及 [Edit History](./edit-history.md)。

### [Quick Drawer](./quick-drawer.md)

Quick Drawer 是固定於右側的快速執行面板，適用於內部的非畫布頁面。它讓您搜尋 [Workflow](../tabs/workflows-tab.md)、釘選我的最愛、選擇輸入、立即執行，並在不開啟編輯器的情況下檢視進度或結果。具有 [File Upload Trigger](../nodes/file-upload-trigger-node.md) 的 Workflow 可接收拖放或選取的檔案。釘選順序與最後選取的 Workflow 會儲存於瀏覽器中。

另請參閱 [Workflow 組織](./workflow-organization.md)、[Keyboard Shortcuts](./keyboard-shortcuts.md) 及 [Execution History](./execution-history.md)。

### [Contextual Showcase](./contextual-showcase.md)

Contextual Showcase 是精簡的應用程式內指引列，適用於已驗證的主要介面，例如儀表板分頁、[Evals](../tabs/evals-tab.md)、Docs 及 Workflow 編輯器。它預設為關閉，會先提供簡短的頁面摘要，並可依需求提供額外細節，當您需要更深入的指引時，則會連結至完整的文件文章。

與 [與 Heym 對話](./chat-with-heym.md)、[Quick Drawer](./quick-drawer.md) 及 [AI Assistant](./ai-assistant.md) 搭配，構成應用程式內的指引流程。

### [Credentials](./credentials.md)

Credentials 用於儲存 Workflow 節點所使用的 API 金鑰與機密資訊。請在 [Credentials](../tabs/credentials-tab.md) 分頁中新增，並在 [LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md)、[HTTP](../nodes/http-node.md)、[Telegram](../nodes/telegram-node.md)、[Send Email](../nodes/send-email-node.md) 及 [Redis](../nodes/redis-node.md) 等節點中依名稱或 ID 參照。它們會以加密形式靜態儲存，可與使用者或[團隊](./teams.md)共用，也可以透過 `$credentials.Name` 在 [Expression DSL](./expression-dsl.md) 中參照。

另請參閱 [Credentials](../tabs/credentials-tab.md)、[Credentials 共用](./credentials-sharing.md) 及 [Third-Party Integrations](./integrations.md)。

### [Credentials 共用](./credentials-sharing.md)

Credentials 可以依電子郵件與其他使用者共用，或與團隊共用；當 Credential 與團隊共用時，所有團隊成員皆可取得存取權。共用的 Credentials 會在 [Credentials](../tabs/credentials-tab.md) 分頁中顯示指示標記。在執行階段，Workflow 擁有者的上下文會合併其擁有、使用者共用及團隊共用的 Credentials。請在表達式中使用 `$credentials.CredentialName`，或在節點資料中設定 credentialId。

另請參閱 [Credentials](./credentials.md)、[Teams](./teams.md) 及 [Third-Party Integrations](./integrations.md)。

### [Teams](./teams.md)

Teams 讓您一次與一群使用者共用 Workflow、Credentials、全域變數、向量儲存及 Drive 檔案。請從 [Teams](../tabs/teams-tab.md) 分頁建立 Teams，並依電子郵件新增成員。從相關的共用對話框將資源與 Team 共用；所有成員即可取得存取權。建立者可以編輯與刪除 Team；刪除 Team 會移除所有 Team 共用。

與 [Credentials 共用](./credentials-sharing.md)、[Global Variables](./global-variables.md) 及 [Enterprise](./enterprise.md) 搭配使用。

### [平行執行](./parallel-execution.md)

當節點彼此之間沒有相依性時，Heym 會平行執行這些節點。執行器會建構 DAG，並以執行緒集區同時執行同一層級的節點；節點一完成，其下游節點便會被排程。需要時可使用 [Merge](../nodes/merge-node.md) 節點合併平行分支。多個 Workflow 執行會並行執行；每次執行皆彼此隔離。[SSE Streaming](./sse-streaming.md) 模式會在節點完成時發出事件。

另請參閱 [Merge](../nodes/merge-node.md)、[Loop](../nodes/loop-node.md) 及 [Execution History](./execution-history.md)。
### [Agent 架構](./agent-architecture.md)

[Agent 節點](../nodes/agent-node.md) 支援子代理（orchestrator 透過 call_sub_agent 呼叫其他 agent 節點）、子 Workflow（agent 透過 call_sub_workflow 呼叫其他 Workflow）、技能（來自 .zip 或 .md 的指令內容與 Python 工具），以及 [MCP](../tabs/mcp-tab.md) 用戶端連線。orchestrator 工具執行器負責路由子代理與子 Workflow 呼叫；其他工具則會導向 Python、MCP 或技能執行器。子代理與子 Workflow 的最大巢狀深度為 5。工具呼叫迴圈包含自動上下文壓縮：在每次迭代之前，會估算 Token 用量，若超過模型上下文窗口的 80%，則使用相同模型對中間訊息進行摘要，並保留系統 Prompt、第一則使用者訊息與最後一則使用者訊息不變。

另請參閱 [Agent 節點](../nodes/agent-node.md)、[Agent 持久記憶](./agent-persistent-memory.md)、[Human-in-the-Loop](./human-in-the-loop.md) 及 [MCP](../tabs/mcp-tab.md)。

### [Agent 持久記憶](./agent-persistent-memory.md)

可選的個別 [Agent 節點](../nodes/agent-node.md) 知識圖譜，儲存於 Postgres：實體、類型、屬性及有向關係。當 `persistentMemoryEnabled` 為 true 時，每次執行會將圖譜摘要至系統 Prompt；成功完成後，[LLM](../nodes/llm-node.md) 會在背景擷取結構化更新。REST CRUD 位於 `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`。編輯器可從節點上的粉紅色大腦控制項開啟。

另請參閱 [Agent 節點](../nodes/agent-node.md)、[Agent 架構](./agent-architecture.md) 及 [追蹤](../tabs/traces-tab.md)。

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop 讓 [Agent 節點](../nodes/agent-node.md) 在特定檢查點請求核准、建立公開的 `/review/{token}` 頁面，並等待未登入的審閱者接受、編輯或拒絕 Markdown 審閱文字。啟用 HITL 的 agent 也會公開一個 `review` 輸出控制代碼，讓您可以在執行待處理期間通知 [Slack](../nodes/slack-node.md)、[傳送電子郵件](../nodes/send-email-node.md) 或其他管道。節點層級的 HITL 文字會作為核准準則，而公開頁面的摘要則由審閱請求本身產生。待處理的執行會立即顯示於 [執行歷史](./execution-history.md)，同一次執行中可能發生多次，並在每次決策提交後從確切儲存的 Workflow 快照恢復。

另請參閱 [Agent 節點](../nodes/agent-node.md)、[Portal](./portal.md)、[執行歷史](./execution-history.md) 及 [傳送電子郵件](../nodes/send-email-node.md)。

### [Webhook](./webhooks.md)

Workflow 可透過 [HTTP](../nodes/http-node.md) 於 `POST /api/workflows/{workflow_id}/execute` 觸發，或從 `POST /api/workflows/{workflow_id}/execute/stream` 增量串流。請求主體會作為 body 傳遞至 [Input](../nodes/input-node.md) 節點；headers 與 query params 可於 [Expression DSL](./expression-dsl.md) 表達式中使用。可設定個別 Workflow 的驗證方式：匿名、JWT 或自訂 header。選用的回應快取、速率限制，以及編輯器的 Run with cURL 對話框皆位於 Workflow 上，並同時適用於兩種模式。 設定了[並行限制](./webhooks.md#concurrency-limit-and-queued-runs)後，必須等待的呼叫會改為收到 `202 Accepted` 以及執行 ID 與狀態 URL。

另請參閱 [Input](../nodes/input-node.md)、[執行 Token](./execution-tokens.md)、[SSE 串流](./sse-streaming.md)、[HTTP](../nodes/http-node.md) 及 [Workflow 結構](./workflow-structure.md)。

### [執行 Token](./execution-tokens.md)

執行 Token 是具範圍限制的 JWT，授予對單一 Workflow 之 execute 與 stream Endpoint 的存取權。當 Workflow 使用 JWT 驗證時，Token 可讓外部指令碼、CI 管道及整合呼叫該 Workflow，而無需共用使用者工作階段。每個 Token 帶有 `wid` 宣告，將其固定至單一 Workflow；帶有 `jti` 用於即時撤銷；以及可設定的 TTL（60 秒至 10 年）。可直接從 **Run with cURL** 對話框建立、選取及撤銷 Token——所選 Token 會自動嵌入產生的指令中。

另請參閱 [Webhook](./webhooks.md)、[安全性](./security.md) 及 [SSE 串流](./sse-streaming.md)。

### [SSE 串流](./sse-streaming.md)

cURL 對話框可將 [webhook](./webhooks.md) 執行切換為 Server-Sent Events 模式。這會即時產生 `execution_started`、`node_start`、`node_complete` 及 `execution_complete` 事件，在產生的 cURL 指令中加入 `--no-buffer`，並讓您為每個節點設定起始訊息，例如 `[START] LLM` 或供外部終端消費者使用的自訂文字。

另請參閱 [Webhook](./webhooks.md)、[執行歷史](./execution-history.md) 及 [LLM](../nodes/llm-node.md)。
### [Triggers](./triggers.md)

Workflow 是由 Trigger 節點（[Input](../nodes/input-node.md)、[Cron](../nodes/cron-node.md)、[Telegram Trigger](../nodes/telegram-trigger-node.md)、[Discord Trigger](../nodes/discord-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Heym Trigger](../nodes/heym-trigger-node.md)、[RabbitMQ](../nodes/rabbitmq-node.md) 接收）或進入點啟動的：[Webhook/API](./webhooks.md)、[MCP](../tabs/mcp-tab.md)、[Portal](./portal.md)、Cron 排程器、Telegram webhook、Discord interaction webhook、IMAP trigger manager、RabbitMQ consumer 或 Editor 執行。每個 Trigger 都有自己的 Endpoint 或背景程序；[Cron](../nodes/cron-node.md) 每 60 秒執行一次，[Telegram Trigger](../nodes/telegram-trigger-node.md) 節點接收 bot webhook，[Discord Trigger](../nodes/discord-trigger-node.md) 節點接收已簽章的 interaction webhook，而 [IMAP Trigger](../nodes/imap-trigger-node.md) 節點則依其設定的輪詢間隔執行。[Input](../nodes/input-node.md) 節點從 webhook 請求接收 body、headers 與 query。

另請參閱 [Node Types](./node-types.md)、[Webhooks](./webhooks.md) 與 [Parallel Execution](./parallel-execution.md)。

### [Execution History](./execution-history.md)

Execution history 會記錄 workflow 的執行：輸入、輸出、節點結果、狀態與 Trigger 來源。你可以從 Editor 工具列、Docs 檢視、Dashboard 標頭或 [Evals](../tabs/evals-tab.md) 檢視存取。單一 workflow 的 history 會顯示目前開啟的 workflow 的執行紀錄；all-history 檢視則顯示跨 workflow 與 chat 的執行紀錄。目前正在執行的 execution 會顯示在兩個對話框的頂端，並附有 **Open live** 與 **Cancel** 動作。Open live 會透過 [SSE](./sse-streaming.md) 將編輯器附加至現有的 execution，還原已完成的節點，讓目前與待處理的節點閃爍，並附加 Debug 記錄，而不會啟動另一次執行。Bring to Canvas 會載入已完成執行的輸入與節點輸出，以供重新執行或除錯；deep link `/workflows/{workflowId}/{executionId}` 同時支援進行中與已完成的 execution。因 [Human-in-the-Loop](./human-in-the-loop.md) 而暫停的執行會立即儲存為 `pending`，包括公開審查 URL 以及從 agent 的 `review` 分支執行的任何通知節點。若伺服器在執行中途重新啟動，中斷的執行會自動復原：它們會以相同的輸入從頭重新執行，並顯示為已完成（標記為 **Recovered**），此行為由每個 workflow 的 **Auto-recover runs** 開關控制，也可改為將其記錄為 `skipped`。

另請參閱 [SSE Streaming](./sse-streaming.md)、[Human-in-the-Loop](./human-in-the-loop.md) 與 [Traces](../tabs/traces-tab.md)。

### Execution Highlights

在即時執行之後——或在 **Bring to Canvas** 之後——Canvas 右上角會出現一個可關閉的 **Execution Highlights** 彈出視窗，依執行順序列出每個節點產生的內容。這是不需開啟每個節點即可快速檢視各節點輸出的方式；使用 **✕** 關閉，並會在下次執行時重新開啟。Highlights 也會顯示在 dashboard 的執行紀錄上。詳情請參閱 [Execution History](./execution-history.md)。

### [Edit History](./edit-history.md)

Edit History 會追蹤 workflow 已儲存的版本（每次 Save 都會建立一個版本）。你可以檢視清單、開啟某個版本以查看其與目前 workflow 的差異（[nodes](./workflow-structure.md)、edges、config），並使用 Revert 還原至過去的版本。與 [Execution History](./execution-history.md) 不同，Edit History 追蹤的是結構變更，而非執行紀錄。

另請參閱 [Execution History](./execution-history.md)、[Workflow Structure](./workflow-structure.md) 與 [Canvas Features](./canvas-features.md)。

### Error Workflow

Workflow 可以指定另一個 workflow，在其失敗時執行。請在 workflow 層級的 **Properties** 面板中（未選取任何節點時顯示）的 **On error, run workflow** 下進行設定。僅有 workflow 擁有者可以設定、變更或清除此項；請參閱 [Owner-only settings](./workflow-organization.md#owner-only-settings)。當頂層執行以未處理的失敗結束時，所選的 error workflow 便會執行，並接收失敗情境（失敗的 workflow id 與名稱、run id、錯誤訊息、失敗的節點標籤與類型，以及時間戳）。若 Canvas 已包含 [Error Handler](../nodes/error-handler-node.md) 節點，則以本機處理器為優先，且**不會**呼叫 error workflow。Error workflow 本身會直接執行，因此永遠不會觸發它自己的 error workflow。

它涵蓋每一次非測試的頂層執行：兩個 execute Endpoint、[Portal](./portal.md)，以及每個 Trigger，包括 [cron](../nodes/cron-node.md)、chat 平台 Trigger、email、queues、[MCP](../tabs/mcp-tab.md) 與 dashboard widgets。啟用 [Load Distribution](./cluster.md) 時此行為不變，包括由 worker 執行的執行：失敗的節點會隨結果傳回，接著 error workflow 會像任何其他執行一樣被分散處理，因此其中必須在主要 instance 上執行的節點仍會如此執行。有兩種情況會被刻意排除，因為 workflow 本身的結果尚不明確：沒有任何 instance 曾執行的執行，以及在執行可能仍在進行時即逾時的等待。它也**不會**由手動的 Canvas 測試執行觸發。
### Workflow 逾時

每個 Workflow 都可以在 Workflow 層級的 **Properties** 面板中，以秒為單位設定 **workflow timeout**。`0`（預設值）表示停用此功能。設定後，超過限制的執行會在下一个節點邊界被停止，並記錄為失敗的執行，附帶「timed out」錯誤。此逾時適用於手動、API 及 Trigger 觸發的執行。長時間的 [Wait](../nodes/wait-node.md) 節點會被即時中斷，而不會在其完整持續時間內持續阻塞。

### 並行限制

每個 workflow 都可以透過 workflow 層級 **Properties** 面板中的 **並行限制** 來限制同時執行的正式環境執行數；擁有者與具有編輯權限的協作者可以進行修改，預設為關閉。達到限制時，來自 [webhook](./webhooks.md#concurrency-limit-and-queued-runs) 與[串流](./sse-streaming.md) endpoint、[Portal](./portal.md)、[Quick Drawer](./quick-drawer.md)、[MCP](../tabs/mcp-tab.md) 以及每個 [trigger](./triggers.md) 的新執行會在先進先出 (FIFO) 佇列中等待，此數量會在 [cluster](./cluster.md) 的所有執行個體間合併計算。編輯器的測試執行、子 workflow 呼叫、[Evals](../tabs/evals-tab.md) 與審核恢復作業絕不會進入佇列，且 [Board](../tabs/board-tab.md) 卡片執行、檔案上傳執行、由 AI 助手的 run-workflow 工具啟動的執行以及警報通知 workflow 均無需等待插槽即可啟動。必須等待的 webhook 呼叫會立即收到 `202 Accepted` 以及 `execution_id`、使用相同憑證回應的狀態 URL、其排隊位置、佇列大小與目前執行數；MCP 用戶端也會收到相同資訊並輪詢 `heym_execution_status` 工具。選用的 **最大佇列大小** 會以 `429` 拒絕額外的呼叫，選用的 **最大等待時間** 會將等待過久的執行記錄為 `expired`。等待中的執行在[執行歷史記錄](./execution-history.md)中會顯示為 **排隊中 n/m**，並可在該處取消。

### 節省時間

每個 Workflow 都可以記錄 **每次執行預估節省的時間**（以分鐘為單位），於 Workflow 層級的 **Properties** 面板中設定。[Analytics](../tabs/analytics-tab.md) 分頁會將此數據在所選範圍內彙總為總計 **Time Saved** 統計值（各 Workflow 的預估值 × 其成功執行次數之總和）。Most Used 也會列出每個 Workflow 的該項總和；**Not Set** 會在尚未設定預估值時開啟該欄位。[Workflow Analysis](./workflow-analysis.md) 報告會在未設定預估值時建議進行設定。

### [Settings](./user-settings.md)

Settings 對話框（從頁首的頭像開啟）包含四個分頁：Profile（Gravatar 圖片、顯示名稱、User Rules）、[Security](./security.md)（變更密碼）、Voice（[ElevenLabs TTS/STT](./chat-voice.md)），以及 Observability（唯讀的 [OpenTelemetry](./opentelemetry.md) 狀態）。User Rules 是注入至每個 AI 請求的自訂指示，包括 Workflow 建構器與 [Chat](../tabs/chat-tab.md)，因此您可以一次設定語言、語氣、程式碼風格或 Workflow 慣例。密碼原則與 [MCP](../tabs/mcp-tab.md) API 金鑰管理亦可在此取得。

另請參閱 [Security](./security.md)、[Chat Voice](./chat-voice.md)、[OpenTelemetry Tracing](./opentelemetry.md) 及 [AI Assistant](./ai-assistant.md)。

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym 可以為每次 Workflow 執行與節點執行發出 OpenTelemetry 追蹤：每次執行有一個根 `heym.workflow.execute` span，每個節點有一個子 `heym.node.execute` span，並將模型與 Token 用量附加至 LLM 與 Agent 節點。Span 會透過 OTLP/HTTP 匯出至任何相容的後端（Jaeger、Grafana Tempo、Honeycomb、Datadog），且 W3C trace context 會跨輸入 Webhook、輸出 HTTP 及子 Workflow 傳播。追蹤預設為停用，並透過 `HEYM_OTEL_*` [環境變數](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)進行設定；目前狀態會顯示於 [Settings](./user-settings.md) 的 Observability 分頁中。

另請參閱 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 及 [Webhooks](./webhooks.md)。

### [Download & Import](./download-import.md)

從 Editor 工具列（Download 按鈕）將目前的 Workflow 匯出為 JSON；該檔案包含節點與邊。匯入時，將 JSON 檔案拖曳至 [Workflows](../tabs/workflows-tab.md) 分頁（建立新的 Workflow）或拖曳至畫布上（取代或合併）。JSON 必須包含 nodes 陣列；name 與 edges 為選填。可用於備份、分享或在執行個體之間遷移。

另請參閱 [Workflow Structure](./workflow-structure.md)、[Workflows](../tabs/workflows-tab.md) 及 [Canvas Features](./canvas-features.md)。

### [Portal](./portal.md)

Portal 將 Workflow 以公開聊天 UI 的形式暴露於 `/chat/{slug}`。可為每個 Workflow 設定 portal_enabled、slug、選用的驗證（portal users）、串流及檔案上傳。終端使用者透過聊天介面互動，無需登入 Heym；圖片輸出可顯示於聊天中。當 [Agent Node](../nodes/agent-node.md) 需要核准時，Portal Workflow 也可以交接至 [Human-in-the-Loop](./human-in-the-loop.md) 審查頁面，而 Agent 的 `review` 分支會將通知傳送至其他頻道。可用於內部工具、面向客戶的聊天機器人及 AI 驅動的表單。

另請參閱 [Human-in-the-Loop](./human-in-the-loop.md)、[Agent Node](../nodes/agent-node.md) 及 [Drive](./drive.md)。

### [File Generation](./file-generation.md)

Skill 可以在執行期間透過寫入 `_OUTPUT_DIR` 工作區來產生 PDF、DOCX、CSV、JSON 及圖片等檔案。Heym 會自動擷取這些檔案、儲存它們，並在 `_generated_files` 下暴露下載中繼資料，接著可使用 [Drive node](../nodes/drive-node.md) 進行管理，或在 [Drive](../tabs/drive-tab.md) 分頁中檢視。

另請參閱 [Agent Node](../nodes/agent-node.md)、[Drive](./drive.md) 及 [Drive node](../nodes/drive-node.md)。

### [Drive](./drive.md)

Drive 是 Skill 所產生檔案的共用儲存與分享層。它讓您可以瀏覽檔案、建立公開或密碼保護的連結、套用到期與下載次數限制、以唯讀方式與您的團隊分享檔案，並使用 [Drive node](../nodes/drive-node.md) 以程式化方式管理這些檔案，或從 [Drive](../tabs/drive-tab.md) 分頁手動管理。

另請參閱 [Drive](../tabs/drive-tab.md)、[File Generation](./file-generation.md) 及 [Portal](./portal.md)。
### [安全性](./security.md)

Heym 強制執行密碼原則（長度、大寫字母、小寫字母、數字），將 access token 儲存於 HttpOnly cookie 中，並在使用時輪換 refresh token。速率限制適用於登入、註冊以及 [Portal](./portal.md) 登入。[Credentials](./credentials.md) 以 AES-256（Fernet）加密儲存於靜態資料中。[MCP](../tabs/mcp-tab.md) API key 用於用戶端驗證；內容安全可透過 [Guardrails](./guardrails.md) 於 [LLM](../nodes/llm-node.md) 與 [Agent Node](../nodes/agent-node.md) 節點上使用。[Execution Tokens](./execution-tokens.md) 為外部呼叫者提供依 Workflow 範圍限定的 JWT。

另請參閱 [Execution Tokens](./execution-tokens.md)、[Guardrails](./guardrails.md)、[Portal](./portal.md) 與 [Credentials](./credentials.md)。

### [單一登入](./sso.md)

Heym 可針對任何外部 OpenID Connect 提供者驗證使用者身分——包括 Keycloak、Okta、Entra ID、Auth0、Google——由列於 `HEYM_ADMIN_EMAILS` 中的執行個體管理員於執行階段從 **Settings → SSO** 進行設定。僅需輸入 issuer URL 與用戶端憑證；所有 Endpoint 皆來自提供者的 discovery document，因此沒有任何提供者被硬編碼。登入採用帶有 PKCE 的 Authorization Code 流程，且 ID token 會依據提供者發布的金鑰進行驗證。帳號優先以 `(issuer, subject)` 對應，其次以已驗證的電子郵件對應，並可選擇性啟用自動佈建，僅限於電子郵件網域允許清單。密碼登入與 SSO 並存，且在連線測試通過後可將其關閉，惟 `HEYM_ADMIN_EMAILS` 中的帳號不受此限，以避免設定錯誤的提供者導致執行個體遭到鎖定。

另請參閱 [Settings](./user-settings.md)、[安全性](./security.md) 與 [稽核記錄](./audit.md)。

### [負載分配](./cluster.md)

將第二個 Heym 執行個體指向同一個資料庫，它便會以 worker 身分加入。背景執行——cron、webhook、MCP 工具呼叫、chat trigger——會依執行個體管理員於 **Settings → Instances** 設定的百分比在執行個體之間分配，並在同一張表中顯示每個執行個體的狀態、資料庫延遲與版本。執行個體之間從不互相通訊：Postgres 承載工作，因此 worker 不需要開放任何連接埠，也不需要回到主執行個體的路由。涉及本機檔案、coding-agent 工作區或已安裝外掛的工作一律在主執行個體上執行，而面板會回報過去 24 小時內此類工作所占的比例，讓操作人員得以看出百分比何時無法發揮作用。歷史記錄中的每一次執行都會標明執行它的執行個體，且兩個歷史記錄對話框皆可依此進行篩選。

另請參閱 [Settings](./user-settings.md)、[Traces](../tabs/traces-tab.md) 與 [Analytics](../tabs/analytics-tab.md)。

### [第三方整合](./integrations.md)

Heym 透過儲存於 [Credentials](../tabs/credentials-tab.md) 分頁中的認證（靜態加密）連接外部服務。支援的類型包括 OpenAI、Google、供 [Decision node](../nodes/decision-node.md) 使用的 Decision Model、用於自動選擇模型的 Model Router（詳見下文）、供 [GitHub node](../nodes/github-node.md) 與 MCP 整合使用的 GitHub、供 [Jira node](../nodes/jira-node.md) 使用的 Jira、供 [Notion node](../nodes/notion-node.md) 使用的 Notion、Custom LLM、Cohere、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、[Grist](../nodes/grist-node.md)、供 [Send Email](../nodes/send-email-node.md) 使用的 SMTP、[RabbitMQ](../nodes/rabbitmq-node.md)、[Redis](../nodes/redis-node.md)、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、Bearer、Header，以及供 [Crawler](../nodes/crawler-node.md) 使用的 FlareSolverr。每個類型皆記載其必填欄位；認證可與使用者或 [teams](./teams.md) 共用，並可在節點中以名稱參照，或在表達式中以 `$credentials.Name` 參照。

### Model Router（自動模型）

**Model Router** 認證會依每個請求挑選模型，而非持有一把金鑰。它會
儲存一個 decision model 認證，以及一份你現有 OpenAI/Google/Custom
認證的清單，每項皆附帶說明其應於何時使用的準則，並會出現在每個模型
選擇器中，以一個名為 **Auto** 的模型呈現。

Traces、畫布上的 Execution Log 與 Span View 皆會顯示此選擇的兩半，例如
`Auto Model / GPT-5`，而成本仍歸屬於實際執行的模型。Auto
Model 無法與 Responses API、Batch 模式或影像輸出搭配使用。完整行為請參閱
[Credentials](./credentials.md)。

另請參閱 [Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 與 [Teams](./teams.md)。

### [Guardrails](./guardrails.md)

Guardrails 會在使用者訊息送達 [LLM](../nodes/llm-node.md) 或 [Agent Node](../nodes/agent-node.md) 之前，封鎖不安全或不受歡迎的使用者訊息。可依節點啟用，並選擇要封鎖的類別（例如暴力、仇恨言論、性內容、自殘、騷擾、非法活動）。設定靈敏度（低、中、高）。觸發時，節點會拋出錯誤，你可透過 [Error Handler](../nodes/error-handler-node.md) 攔截。偵測會依認證類型使用提供者的 moderation API 或 LLM 分類。

另請參閱 [安全性](./security.md)、[LLM](../nodes/llm-node.md)、[Agent Node](../nodes/agent-node.md) 與 [Error Handler](../nodes/error-handler-node.md)。
### [Enterprise](./enterprise.md)

Enterprise 涵蓋商業授權、專業支援，以及為在生產環境中運行 Heym 的團隊所提供的部署服務。其內容包括 Workflow 架構協助、上線導入、Kubernetes 與擴展指導、優先支援，以及圍繞進階功能（例如 [Agent Node](../nodes/agent-node.md)、[Human-in-the-Loop](./human-in-the-loop.md)、[Parallel Execution](./parallel-execution.md) 與 [Portal](./portal.md)）的客製化開發。

另請參閱 [Running & Deployment](../getting-started/running-and-deployment.md)、[Security](./security.md) 與 [Teams](./teams.md)。

### [Heym Work](./heym-work.md)

Heym Work 是建構於 Heym 之上、專為業務團隊打造的第二介面。使用者只需描述工作內容、回答幾個問題，就能獲得經過測試的 Workflow，接著透過頁面、核准以及每次執行皆有名稱的活動清單進行作業。實例管理員可在**設定 → Heym Work** 中透過其位址與整合金鑰進行連線；它擁有來自 Heym 團隊的獨立授權。

另請參閱 [Enterprise](./enterprise.md)、[Single Sign-On](./sso.md) 與 [Human-in-the-Loop](./human-in-the-loop.md)。

---

## Dashboard Tabs

### [Workflows](../tabs/workflows-tab.md)

Workflows 分頁是預設的 dashboard 檢視。它顯示雙窗格清單：左側以密集資料列呈現 workflows 與資料夾，右側則顯示所選 workflow 的預覽，包含其 trigger、上次執行與步驟，以及 Open Workflow 與 Run Now。每一列都帶有狀態標籤（Running、Scheduled、Listening、Paused、API、SubWorker、Portal、Manual、Remove Scheduled），Status 下拉選單可依此進行篩選。沒有 trigger 節點的 workflow，會依其最近一次執行的啟動方式標示——HTTP 呼叫標示為 API、上層 workflow 標示為 SubWorker、其公開聊天標示為 Portal——並在執行過之前維持為 Manual。資料夾與子資料夾負責處理[組織](./workflow-organization.md)。使用 New Workflow 建立 workflows，拖放 JSON 以[匯入](./download-import.md)，並從資料列動作進行編輯或刪除。Workflows 可在資料夾之間移動；刪除會先排程（移至垃圾桶）再永久移除。

另請參閱 [Workflow Organization](./workflow-organization.md)、[Download & Import](./download-import.md) 與 [Quick Drawer](./quick-drawer.md)。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

一個 agentic kanban board，其中的卡片是持久性工作。為每個欄配置一條有序的 workflow 鏈；將卡片移入該欄時，會以卡片的完整脈絡（內容、留言、歷史紀錄、先前的輸出）執行該鏈。結果會寫回卡片——成功為綠色、失敗為紅色、執行中為琥珀色。後續回合會以目前累積的所有內容重新執行當前欄的鏈，這為迭代式規劃提供了支援。執行會以 `board` trigger 來源記錄於 [Execution History](./execution-history.md)。當卡片執行處於作用中時，**Open live** 會在動畫畫布上開啟該次確切的執行，並附帶增量 Debug 記錄。

另請參閱 [Workflows](../tabs/workflows-tab.md)、[Execution History](./execution-history.md) 與 [Human-in-the-Loop](./human-in-the-loop.md)。

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

Templates 分頁可讓你儲存並重複使用 workflow 範本（完整 workflows）與節點範本（單一已配置的節點）。從編輯器建立 workflow 範本（Share as Template），並以右鍵點擊節點來建立節點範本。依可見性（Everyone 或 Specific users/[teams](./teams.md)）瀏覽、套用範本以建立新 workflow 或將節點新增至畫布，並管理你分享的範本。

另請參閱 [Workflows](../tabs/workflows-tab.md)、[Teams](./teams.md) 與 [Canvas Features](./canvas-features.md)。

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

Variables 分頁管理 [Global Variable Store](./global-variables.md)。建立、編輯與刪除全域變數；設定名稱、值與值類型（Auto、String、Number、Boolean、Array、Object）。變數為使用者範圍，並會跨執行持續保存。可在任何 workflow [expression](./expression-dsl.md) 中以 `$global.variableName` 參照它們。變數可與其他使用者或 [teams](./teams.md) 分享。

另請參閱 [Global Variables](./global-variables.md)、[Variable](../nodes/variable-node.md) 與 [Expression DSL](./expression-dsl.md)。

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Chat 分頁是 Heym 的長時間執行 Agent 介面，可透過對話操作工作區。選擇一個 [credential](./credentials.md) 與模型，然後請 Chat 回答問題、檢視 Workflow 定義、執行現有 Workflow、彙總執行與排程、回報單一 Workflow 的執行歷史（執行次數、狀態分佈、上次執行，以及應要求提供某次執行的詳細資訊）、回報目前正在執行的執行項目（包含已耗時間、目前節點，以及每個執行中項目的連結）、解決待處理的人工審核、使用與編輯器中相同的 AI Builder 引擎建立與修訂 Workflow，或以自然語言將卡片新增至看板。新卡片一律始於所選看板的第一個欄位；當有多個看板可用且未指定任何看板時，Chat 會在建立卡片前顯示看板選擇。

瀏覽器關閉後，Chat 仍會在後端持續執行。當回答正在串流傳輸時，你可以傳送更多訊息；Heym 會將這些訊息儲存在資料庫支援的佇列中，讓你在佇列中的訊息開始執行前進行編輯或刪除，並在目前回應完成後依序執行它們。若助理需要規劃細節並回傳釐清問題，佇列會暫停直到你回答這些問題，然後在規劃回應後繼續。

回應會以 markdown、內嵌圖片、Workflow 預覽卡片、可折疊的工具呼叫卡片、context 使用量，以及自動 context 壓縮進行串流傳輸。Chat 支援附件、語音輸入、朗讀播放、複製動作、快速 Prompt、來自 [Settings](./user-settings.md) 的 User Rules，以及作為 context 的 [global variables](./global-variables.md)。

另請參閱 [AI Assistant](./ai-assistant.md)、[Credentials](./credentials.md) 與 [Settings](./user-settings.md)。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ 觀看 Chat 示範</a></p>

### [Credentials](../tabs/credentials-tab.md)

Credentials 分頁管理節點所使用的 API 金鑰與密鑰。依類型新增 credential（OpenAI、Google、Custom、Bearer、Header、[Telegram](../nodes/telegram-node.md)、[Slack](../nodes/slack-node.md)、SMTP、[Redis](../nodes/redis-node.md)、RAG: Qdrant + OpenAI、RAG: Psql + OpenAI、Cohere 等），為其命名，並在 Workflow 節點中引用。可從卡片進行編輯或刪除；透過電子郵件與使用者分享，或與 [teams](./teams.md) 分享。所有值在靜態儲存時皆經過加密，並在 UI 中遮蔽顯示。

另請參閱 [Credentials](./credentials.md)、[Credentials Sharing](./credentials-sharing.md) 與 [Third-Party Integrations](./integrations.md)。

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ 觀看 Credentials 示範</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Vectorstores 分頁管理 [RAG](../nodes/rag-node.md) 節點所使用的向量儲存庫。使用名稱與向量儲存庫 [credential](./credentials.md) 建立儲存庫 — *RAG: Qdrant + OpenAI*（外部 Qdrant）或 *RAG: Psql + OpenAI*（Heym 自有的 Postgres，透過 pgvector），這會固定該儲存庫的後端 — 可選擇設定 collection 名稱，然後上傳文件（PDF、TXT 等）。管理內容（檢視、刪除來源）、編輯儲存庫詳細資訊，以及與使用者分享儲存庫。在 [RAG](../nodes/rag-node.md) 節點中，選擇 Database、選取向量儲存庫，然後執行 insert、upsert、delete 或 search 操作。

另請參閱 [Qdrant RAG](../nodes/rag-node.md)、[Credentials](./credentials.md) 與 [Teams](./teams.md)。

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ 觀看 Vectorstores 示範</a></p>
### [MCP](../tabs/mcp-tab.md)

MCP 分頁用於設定 Model Context Protocol 整合。Heym 支援兩種模式：

**預設伺服器** – 位於 `/api/mcp/sse` 的單一 Endpoint 會公開所有已啟用 MCP 的 Workflow。您可以檢視並重新產生 API key、複製可直接使用的 client JSON、一鍵連接 Cursor，或依照 Claude 設定流程進行自動 OAuth 註冊。

**具名伺服器** – 建立多個隔離的 MCP Endpoint，每個都有自己的 UUID 型 URL（`/api/mcp/servers/{uuid}/sse`）與獨立的 API key。將特定 Workflow 指派給各伺服器，讓不同的 AI client 或團隊只看到他們所需的工具。每個具名伺服器支援相同的驗證方式（API key、Claude OAuth），並各自擁有 Copy JSON 與 Add to Cursor 捷徑。兩種 Endpoint 皆支援 SSE transport（GET）與 Streamable HTTP transport（POST）。在具名伺服器內切換 Workflow 時，該項目會移至指派清單頂端，讓變更的列保持在檢視範圍內。

**Heym chat 工具** – 兩種模式皆可將 [Chat](../tabs/chat-tab.md) 引擎公開為單一的 `heym_chat` 工具，並依各介面分別切換，各自擁有自己的 LLM credential 與 model（預先填入您在 [Settings](./user-settings.md) 中偏好的 model）。MCP client 傳送一則自然語言的 `message`，引擎便會完成其餘工作：在建置模式下建立 Workflow（儲存、最多五次測試執行、修正並驗證）、執行 Workflow、analytics、executions、即時執行狀態、schedules、boards 與 cards、teams、global variables、文件搜尋，以及 human-in-the-loop 決策。日後新增至 Chat 的功能皆可透過同一個工具存取，無需額外註冊。每次呼叫都會以插頭標記的對話形式儲存於 Chat 分頁歷史記錄中，並回傳一個 `conversation_id`，client 可將其傳回以延續該對話串。

另請參閱 [Agent Architecture](./agent-architecture.md)、[Agent Node](../nodes/agent-node.md) 與 [SSE Streaming](./sse-streaming.md)。

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ 觀看 MCP 示範</a></p>

### [Traces](../tabs/traces-tab.md)

Traces 分頁顯示 [LLM](../nodes/llm-node.md) 執行追蹤。清單上方的統計標頭會以 KPI 卡片（Calls、Tokens、Cost、Avg Latency、Error %）與三張圖表——Tokens by Model、Cost by Model 及 Calls Over Time（堆疊顯示成功與錯誤）——彙總所選時間範圍。單一的 **Time range** 選擇器（1h / 24h / 7d / 30d / All；預設 7 天）會同時篩選圖表與清單。Cost 依據每位使用者的 [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) 計算；沒有定價的 model 會顯示行內警告並連結至該表。開啟任一 trace 即可查看請求與回應 Payload、時間細分（llm_ms、tools_ms、mcp_list_ms）、工具呼叫（名稱、引數、結果）以及所包含的 skills。展開的事件會將 JSON——包括 MCP 與 JSON-RPC Payload——顯示為可折疊的樹狀結構，預設展開第一層；**Tree / Raw** 可切換回原始文字，格式錯誤的 JSON 仍可閱讀。使用 traces 來偵錯 [Agent Node](../nodes/agent-node.md) 與 [LLM](../nodes/llm-node.md) 的行為，並複製或匯出 Payload。

另請參閱 [Execution History](./execution-history.md)、[Agent Node](../nodes/agent-node.md) 與 [LLM](../nodes/llm-node.md)。

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ 觀看 Traces 示範</a></p>
### [Alerts](../tabs/alerts-tab.md)

Alerts 分頁定義了在時間視窗內的閾值條件，並在條件被跨越時通知您。四種 alert 類型涵蓋了營運人員實際會問的問題：**error threshold**（這在視窗內失敗超過 N 次嗎）、**workflow duration**（執行是否變慢了，以最大值、平均值或 p95 衡量）、**token / USD cost**（支出是否超過預算，透過與 [Traces](../tabs/traces-tab.md) 相同的定價表計算），以及 **execution count**（這是否執行的頻率遠超應有的次數）。每種類型都是依您選擇的視窗來判斷，絕不依據單一事件，因為一次失敗的執行只是雜訊，而連續爆發則是一起事故。Alerts 可監控單一 workflow 或您能存取的所有 workflow。

五步驟精靈會依序引導您完成類型、範圍、條件、回應與檢閱。檢閱步驟會先**回測**條件，回報它在過去 24 小時至 7 天內原本會觸發多少次，因此設定過低的閾值會在儲存前就被發現，而不是在通知到人之後才發現。用自然語言描述您的需求，AI 會盡可能填入每個步驟，並標示其推測之處；部分請求仍能讓精靈繼續推進，從第一個仍需決定的步驟開啟，而不必讓您從頭來過。預設情況下，alert 觸發一次後便保持靜默，直到指標恢復；您也可以改為讓它依間隔重複觸發。

在回應步驟中，alert 可以在觸發時建立並指派一個新的 workflow 來執行、使用您已有的 workflow，或不做任何事。觸發的 payload 會帶上觀測值、閾值、視窗，以及對該數值有貢獻的 workflow，這正是 alerts 能使用您現有節點觸達 Slack、email 或 Telegram 的方式。觸發歷史會記錄每個 alert 觸發當下的實際狀態，並保留 90 天；確認某次觸發會將標記從 Firing 改為 Acknowledged，而不會佯裝條件已解除。[Chat](../tabs/chat-tab.md) 分頁可以回答有哪些 alerts，以及某個 alert 為何或何時觸發。Alerts 可以與使用者和 [teams](../tabs/teams-tab.md) 分享。

另請參閱 [Analytics](../tabs/analytics-tab.md)、[Traces](../tabs/traces-tab.md) 與 [Execution History](./execution-history.md)。

### [Analytics](../tabs/analytics-tab.md)

Analytics 分頁顯示執行指標與趨勢。摘要統計包含總執行次數、成功率、錯誤率、延遲細分，以及總 **Time Saved**（每個 workflow 每次執行預估節省的分鐘數 × 其成功執行次數的總和）。Most Used 會列出每個 workflow 的相同總和。選擇基準時間範圍（24h、7d、30d 或 all），可選擇依 workflow 篩選，然後在任一圖表上拖曳以深入檢視選定的日期範圍。圖表與 workflow 表格會依選取範圍重新整理，自動重新整理則讓指標保持更新。當您同時需要過去的結果與即將到來的執行時，它可補足 [Execution History](./execution-history.md) 與 [Scheduled](../tabs/scheduled-tab.md) 檢視。

另請參閱 [Execution History](./execution-history.md)、[Scheduled](../tabs/scheduled-tab.md) 與 [Evals](../tabs/evals-tab.md)。

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Dashboard 分頁是一個 Grafana 風格的空間，您可以在其中建立圖表小工具的網格，每個小工具都由其各自隱藏的 Heym workflow 算繪而成。您可以建立所需數量的 dashboard，並將每個 dashboard 以唯讀或可編輯的方式與使用者或 teams 分享；小工具一律以擁有者的 credentials 執行，因此每個人看到的資料都相同。用自然語言描述一個指標，AI 便會產生該小工具，或手動新增一個並挑選圖表類型，以範例資料預覽：bar、line、area、pie、table、numeric、gauge、scatter、proportion、bar gauge、text 或 HITL。HITL 是您待處理的人工審查的輪播。標頭會顯示 `1/n pending`。workflow 名稱會在畫布上開啟該次執行。**Approve**、**Request changes** 與 **Reject** 可解決該項目，而小工具標題旁的歷史圖示會在同一頁面的歷史對話框中開啟該次執行。小工具會快取其結果，可用 AI 微調（每次變更都會儲存至 [Edit History](./edit-history.md)），可連同其完整 workflow 一併複製，可用 Tidy up 重新排列，並可在編輯模式中拖曳或調整大小。表格可顯示狀態標籤，並將其資料列連結至會將所點擊資料列記錄讀取為 `$page.record` 的詳細資訊儀表板；而執行（Run）小工具可從儀表板執行 workflow：針對拖放的檔案、搭配其輸入欄位，或透過執行按鈕。由於每個小工具都是一個 workflow，任何您能取得的資料——[HTTP](../nodes/http-node.md) 呼叫、[BigQuery](../nodes/bigquery-node.md) 查詢、[RAG](../nodes/rag-node.md) 查找或 [LLM](../nodes/llm-node.md) 輸出——都能成為圖表。HITL 小部件的設置可以將其縮小到單個工作流的審核，或其中的代理或 Slack 批准步驟；這樣的小部件會向所有可以打開該工作流的人顯示它們，並對無法打開的人隱藏。

另請參閱 [Chart Output node](../nodes/chart-output-node.md)、[Analytics](../tabs/analytics-tab.md) 與 [Execution History](./execution-history.md)。

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Evals](../tabs/evals-tab.md)

Evals 分頁（位於 `/evals`）可讓您建立評估套件、新增或產生測試案例、最佳化套件 Prompt，並針對 [Agent Node](../nodes/agent-node.md) Workflow 執行評估。選取一個或多個模型、選擇評分方式（Exact Match、Contains 或 LLM-as-Judge），可選擇讓另一個模型或 [Decision Model](../nodes/decision-node.md) 來評判 LLM-as-Judge 的答案，設定每個測試的執行次數（以及 Exact Match 與 Contains 的 temperature 與 reasoning effort），然後比較通過/失敗結果與各模型的輸出。檢閱過去評估的執行歷史記錄，包括每次執行所使用的 judge，以相同的 judge 重新執行一次、將其匯出為 JSON，並在 [Traces](../tabs/traces-tab.md) 中交叉檢查底層行為。

另請參閱 [Agent Node](../nodes/agent-node.md)、[Traces](../tabs/traces-tab.md) 與 [Execution History](./execution-history.md)。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 觀看 Evals 示範</a></p>

### [Teams](../tabs/teams-tab.md)

Teams 分頁可讓您建立與管理團隊。建立團隊、透過電子郵件新增成員，以及移除成員（無法移除建立者）。從各自的分享對話方塊將 [Workflow](../tabs/workflows-tab.md)、[範本](../tabs/templates-tab.md)、[認證](../tabs/credentials-tab.md)、[變數](../tabs/global-variables-tab.md)、[向量儲存](../tabs/vectorstores-tab.md) 與 [Drive 檔案](../tabs/drive-tab.md) 分享給團隊；所有團隊成員皆可取得存取權。編輯團隊名稱與描述，或刪除團隊（會移除所有團隊分享）。

另請參閱 [Teams](./teams.md)、[Credentials Sharing](./credentials-sharing.md) 與 [Workflow Organization](./workflow-organization.md)。

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ 觀看 Teams 示範</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

Scheduled 分頁會以視覺化行事曆顯示所有作用中的 [Cron](../nodes/cron-node.md) Workflow。在日、週與月檢視之間切換，以查看您的自動化排程的執行時間，然後在需要編輯排程時跳回相關的 [Workflow](../tabs/workflows-tab.md)。

另請參閱 [Cron](../nodes/cron-node.md)、[Analytics](../tabs/analytics-tab.md) 與 [Execution History](./execution-history.md)。

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ 觀看 Scheduled 示範</a></p>

### [Logs](../tabs/logs-tab.md)

Logs 分頁會顯示 Heym 堆疊（backend、frontend、PostgreSQL）的 Docker 容器日誌。選取容器、依日誌層級（All、INFO、WARNING、ERROR、DEBUG）篩選，並在日誌中搜尋。可用於除錯與疑難排解。若需 Workflow 執行日誌（節點結果、輸出），請改用 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 或編輯器中的 Debug 面板。

另請參閱 [Execution History](./execution-history.md)、[Traces](../tabs/traces-tab.md) 與 [Canvas Features](./canvas-features.md)。

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ 觀看 Logs 示範</a></p>

### [DataTable](../tabs/datatable-tab.md)

DataTable 分頁可讓您在 Heym 中建立與管理結構化資料表。定義具型別的欄位（string、number、boolean、date、JSON）、透過內嵌的按兩下編輯來管理資料列、匯入/匯出 CSV，並以讀取/寫入權限將資料表分享給使用者或 [團隊](./teams.md)。使用 [DataTable 節點](../nodes/datatable-node.md) 在 Workflow 中以程式化方式存取資料表。頂端釘選的 **System tables** 區段會放置 **LLM Cost Table**：這是各模型定價的固定結構描述檢視，會在背景從 Helicone 植入資料（24 小時 TTL、可手動 Refresh），其中每位使用者可覆寫價格，或為 Helicone 未列出的模型新增自訂資料列。這些定價規則會驅動 [Traces](../tabs/traces-tab.md) 分頁上的成本 KPI 與各模型成本圖表。

另請參閱 [DataTable 節點](../nodes/datatable-node.md)、[Traces](../tabs/traces-tab.md)、[Workflow Structure](./workflow-structure.md) 與 [Teams](./teams.md)。

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ 觀看 DataTable 示範</a></p>
### [Drive](../tabs/drive-tab.md)

Drive 分頁顯示由你各 Workflow 中 skill 所產生的所有檔案。它會列出每個檔案的名稱、類型、大小、來源節點、建立日期與團隊共享狀態，並提供搜尋、已驗證下載、共享、刪除與分頁控制項。它是 [File Generation](./file-generation.md)、[Drive](./drive.md) 參考文件與 [Drive 節點](../nodes/drive-node.md) 的儀表板夥伴。

另請參閱 [Drive](./drive.md)、[File Generation](./file-generation.md) 與 [Drive 節點](../nodes/drive-node.md)。

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ 觀看 Drive 示範</a></p>

### [Canvas 協作](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).

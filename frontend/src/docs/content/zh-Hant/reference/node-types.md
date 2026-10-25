# 節點類型

Heym 提供多種節點類型以建置 Workflow。請在節點配置中使用如 `$input.text` 與 `$nodeLabel.field` 的[表達式](./expression-dsl.md)。

## Trigger 節點

| 節點 | 說明 | 輸出 |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow 的文字進入點（HTTP/[webhook](./webhooks.md)） | 1 |
| [Cron](../nodes/cron-node.md) | 依排程觸發（cron 表達式） | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | 當 Telegram bot webhook 更新送達時觸發 | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | 當 Slack 傳送 Events API webhook 時觸發 | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | 當 Discord 傳送應用程式互動 webhook 時觸發 | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | 當 IMAP 信箱收到新郵件時觸發 | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | 當 Heym 發佈平台事件時觸發（批次陣列） | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | 從對外部 WebSocket 伺服器的對外連線觸發 | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | 產生單次使用的上傳連結，並於大型檔案上傳時啟動 | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | 當從佇列收到訊息時觸發 | 1 |
| [Error Handler](../nodes/error-handler-node.md) | 當任何節點發生錯誤時執行（無傳入邊） | 1 |

關於所有進入點，請參閱 [Triggers](./triggers.md)。

## AI 節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | 使用語言模型處理文字 | 1 | 1 |
| [Decision](../nodes/decision-node.md) | 向決策模型提出具型別的提問，並依其回傳的機率進行分支 | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | 具備工具呼叫、技能、MCP、選用的[人工審查](./human-in-the-loop.md)與選用的[持久記憶圖](./agent-persistent-memory.md)的 LLM。請參閱 [Agent 架構](./agent-architecture.md)。 | 1 | 1，另加選用的 `review` 輸出 |
| [Codex](../nodes/codex-node.md) | 使用 ChatGPT/Codex 存取 Token，對 GitHub 儲存庫執行本機 Codex CLI | 1 | 1，另加 `question` 輸出 |
| [OpenCode Go](../nodes/opencode-go-node.md) | 使用 OpenCode Go 閘道 API 金鑰，在強化容器中對 GitHub 儲存庫執行 OpenCode CLI | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | 直接呼叫特定的 MCP 工具，無需由 LLM 選擇 | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | 在 Qdrant 或 Postgres（pgvector）[向量儲存](../tabs/vectorstores-tab.md)中插入、upsert、刪除或搜尋（向量或混合向量 + BM25），以供 RAG 使用 | 1 | 1 |

## 邏輯節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | 依 if/else 分支 | 1 | 2（true/false） |
| [Switch](../nodes/switch-node.md) | 將值與案例比對後進行路由 | 1 | n |
| [Merge](../nodes/merge-node.md) | 等待多個輸入並合併 | n | 1 |
| [Loop](../nodes/loop-node.md) | 迭代陣列 | 1 | 2（loop/done） |

## 資料節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | 轉換與對應資料 | 1 | 1 |
| [Converter](../nodes/converter-node.md) | 在格式之間轉換資料（CSV、JSON、XML），並將圖片或 PDF 進行 OCR 轉為文字 | 1 | 1 |
| [Code](../nodes/code-node.md) | 在可拋棄、網路隔離且擁有自身 requirements.txt 的沙箱中執行 Python | 1 | 1 |
| [Variable](../nodes/variable-node.md) | 設定或取得變數（Workflow 區域或[全域](./global-variables.md)） | 1 | 1 |
| [Execute](../nodes/execute-node.md) | 呼叫另一個 Workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | 讀取 Heym Workflow 與執行歷史 | 1 | 1 |

## 整合節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | 發送 HTTP 請求（cURL） | 0 或 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | 連線至外部 WebSocket 並傳送單一訊息 | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | 傳送 Telegram 機器人訊息 | 1 | 1 |
| [Slack](../nodes/slack-node.md) | 傳送 Slack 訊息 | 1 | 1 |
| [Discord](../nodes/discord-node.md) | 傳送 Discord webhook 訊息 | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | 透過 SMTP 傳送電子郵件 | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis 操作（set、get、hasKey、deleteKey） | 1 | 1 |
| [Grist](../nodes/grist-node.md) | 讀取／寫入 Grist 試算表 | 1 | 1 |
| [GitHub](../nodes/github-node.md) | 透過 GitHub REST API 管理儲存庫、使用者、issue、pull request、review、release、Actions workflow 及檔案 | 1 | 1 |
| [Jira](../nodes/jira-node.md) | 透過 Jira REST API 管理 Jira 專案、issue、留言、附件、使用者、通知及 workflow 轉換 | 1 | 1 |
| [Linear](../nodes/linear-node.md) | 透過 GraphQL 管理 Linear 團隊、專案、issue、workflow 狀態及留言 | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | 透過 OAuth2 讀取／寫入 Google Sheets | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | 透過 OAuth2 列出、下載、更新及刪除 Google Drive 檔案 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | 在 BigQuery 中執行 SQL 查詢及插入資料列 | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | 透過 PostgREST 查詢及異動 Supabase 資料表 | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | 對 ClickHouse 執行 SQL、CRUD 及計數操作 | 1 | 1 |
| [Notion](../nodes/notion-node.md) | 管理 Notion 資料庫、資料來源、頁面及區塊 | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | 管理 Sentry 組織、專案、團隊、issue、事件及 release | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | 管理 bucket 及資料夾；列出、上傳、下載、複製及刪除物件 | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | 讀取／寫入 Heym DataTable（第一方儲存） | 1 | 1 |
| [Drive](../nodes/drive-node.md) | 管理 Drive 檔案：刪除、設定密碼、TTL、下載次數上限、團隊分享／取消分享 | 1 | 1 |

## 自動化節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | 使用 FlareSolverr 擷取網頁內容 | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | 具備 AI 步驟與 Auto Heal 的瀏覽器自動化 | 1 | 1 |

## 公用節點

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | 延遲執行 | 1 | 1 |
| [Output](../nodes/output-node.md) | 輸出 endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | 將欄位對應至 JSON 物件；作為唯一終端節點時 = 最上層 webhook／run 主體 | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | 渲染 HTML 頁面；作為唯一終端節點時 = webhook 以 text/html 回應 | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | 終端儀表板小工具輸出，將上游資料列對應為圖表 payload | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | 在畫布上新增 markdown 註記（不會被執行） | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | 記錄至後端主控台 | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | 停用 workflow 中的另一個節點 | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | 啟用 workflow 中已停用的節點 | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | 以錯誤回應停止 workflow | 1 | 0 |

## 外掛節點

外掛節點由執行個體上安裝的外掛所提供。每個已安裝的外掛會以其名稱顯示於
**Plugins** 分類下的節點面板中；其底層會對應至以下兩種節點類型的其中一種。

| 節點 | 說明 | 輸入 | 輸出 |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | 由已安裝外掛提供的自訂動作 | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | 由已安裝外掛提供的自訂 trigger | 0 | 1 |

## 相關

- [Canvas 功能](./canvas-features.md) – 資料 pin、執行日誌、啟用/停用、擷取為子 Workflow
- [Agent 節點](../nodes/agent-node.md) – AI Agent 節點的詳細參考
- [Agent 架構](./agent-architecture.md) – 子 Agent、協調器、技能、MCP、工具呼叫
- [Agent 持久記憶](./agent-persistent-memory.md) – 各節點知識圖譜、分享與背景擷取
- [Human-in-the-Loop](./human-in-the-loop.md) – 暫停 Agent 輸出以進行人工核准
- [Expression DSL](./expression-dsl.md) – 在節點設定中參照資料
- [Expression 評估對話框](./expression-evaluation-dialog.md) – 可展開的編輯器，附即時後端預覽
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – 透過單次使用連結接受大型 multipart 上傳
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – 即時對外 socket Trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – 推送訊息至外部 socket
- [Workflow 結構](./workflow-structure.md) – 節點與邊的 JSON 格式
- [Triggers](./triggers.md) – 所有 Workflow 進入點
- [Credentials 分頁](../tabs/credentials-tab.md) – 為 LLM、HTTP 及其他節點新增 API 金鑰
- [Credentials 分享](./credentials-sharing.md) – 與其他使用者分享 Credentials
- [Portal](./portal.md) – 將 Workflow 公開為公開聊天 UI
- [Vectorstores 分頁](../tabs/vectorstores-tab.md) – 為 RAG 節點建立 vector store

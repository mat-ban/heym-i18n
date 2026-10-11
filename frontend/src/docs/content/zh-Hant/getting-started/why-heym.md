# 為何選擇 Heym

Heym 是在生產環境中執行與治理 AI agents 的基礎設施。單一自架 runtime 即可涵蓋 agent 生命週期的每一個階段。

原型 agent 需要一個模型、一個 prompt，以及少數幾項工具。生產環境的 agent 還需要 Trigger 與重試機制、在等待人工介入而暫停時保存狀態、每一次模型與工具呼叫的紀錄、每一次執行的成本、變更上線前的測試，以及對其可自主執行範圍的明確限制。Heym 將這一切集中於一處，因此您在畫布上設計的系統，就是實際執行的系統。建構 agentic 系統，然後安心地執行它們。

## 涵蓋 Agent 生命週期的單一 Runtime

| 階段 | Heym 為您提供的內容 |
|---|---|
| **建構** | 在畫布上組合 agents 與確定性步驟，透過 [AI Assistant](../reference/ai-assistant.md) 生成它們，或從 [Templates](../tabs/templates-tab.md) 與可攜式 skills 開始。 |
| **編排** | 以明確的資料流與[平行執行](../reference/parallel-execution.md)協調 agents、[sub-agents](../reference/agent-architecture.md)、coding agents、RAG、瀏覽器自動化與工具。 |
| **執行** | 從 [webhooks](../reference/webhooks.md)、排程與事件 [triggers](../reference/triggers.md) 啟動執行，並具備各節點的重試、[錯誤處理](../nodes/error-handler-node.md)，以及跨執行個體的[負載分配](../reference/cluster.md)。 |
| **觀測** | 透過[歷史紀錄](../reference/execution-history.md)、[LLM traces](../tabs/traces-tab.md)、每次執行的 USD 成本、畫布上的即時執行、[analytics](../tabs/analytics-tab.md)、[alerts](../tabs/alerts-tab.md) 與 [OpenTelemetry](../reference/opentelemetry.md) 匯出，檢視每一次執行。 |
| **評估** | 在 [Evals](../tabs/evals-tab.md) 中針對預期輸出測試 prompts 與模型，並具備 LLM-as-Judge 評分與模型並排比較。 |
| **控制** | 透過[審查檢查點](../reference/human-in-the-loop.md)與[護欄](../reference/guardrails.md)讓人類保持控制權，並以加密的 [credentials](../reference/credentials.md)、[teams](../reference/teams.md)、[單一登入](../reference/sso.md)與[稽核軌跡](../reference/audit.md)治理存取權限。 |
| **暴露** | 以 REST 與 [SSE](../reference/sse-streaming.md) 提供 workflows，作為 [MCP](../tabs/mcp-tab.md) 工具、[Portal](../reference/portal.md) 聊天 UI，以及 [dashboard](../tabs/dashboard-tab.md) 小工具。 |

## 建構

### AI Assistant：以自然語言建構 Workflows

[AI Assistant](../reference/ai-assistant.md) 是 workflow 編輯器內的聊天面板。描述您想要的內容，例如「建立一個 workflow，接收使用者輸入、搜尋我的知識庫，並使用 GPT-4o 回覆」，assistant 便會生成節點與邊，並立即套用至畫布。

- 使用您自己的 LLM credential（任何支援的模型）
- 支援**語音輸入**，實現免手持的 workflow 設計
- 自動將 AI 回應中有效的 workflow JSON 套用至畫布
- 即時串流回應

assistant 直接在編輯器內運作，並即時將節點串流至畫布，其生成的一切都與您手動放置的節點一樣保持可編輯。

### Skills 系統

Skills 是可攜式的能力組合包，包含一個 `SKILL.md` 指令檔案，以及選用的 Python 腳本，可直接套用至任何 Agent 節點。

- skill 的指令會前置於 agent 的 system prompt
- skill 中的 Python 檔案會成為可呼叫的工具
- Skills 可跨 workflows 重複使用，並以 `.zip` 壓縮檔分享

這相當於一次為您的 agent 提供職務說明與工具箱。

### Workflow Analyzer：具備執行感知的回饋

[Workflow Analysis](../reference/workflow-analysis.md) 面板是內建於編輯器、具備執行感知的文件與回饋工具。點擊 **Analyze**、選擇 LLM credential 與模型，Heym 便會為目前的 workflow 生成一份可編輯的 Markdown 報告。

與靜態筆記不同，analyzer 會先盡可能執行該 workflow，並將執行結果納入 prompt。報告涵蓋改善領域、workflow 的用途，以及節點功能的逐步說明。當報告已存在時，**Reanalyze** 會串流一份獨立的預覽，讓您可以接受新版本，或保留目前共用的文件。

## 編排

### 內建 LLM 與 Agent 節點

Heym 的 [Agent 節點](../nodes/agent-node.md) 執行一個緊密整合的工具呼叫迴圈，具備內嵌 Python 工具、MCP 連線，以及可攜式的技能系統，全部皆為生產級 Agent 而設計。

Heym 的純 [LLM 節點](../nodes/llm-node.md) 同樣不僅止於單一的 Prompt 與回應步驟。對於支援的 OpenAI 及 OpenAI 相容 Endpoint，它可切換至 **Batch API 模式**，讓單一節點以更低成本的原生供應商批次請求提交一組 Prompt 陣列。畫布接著會提供一個專屬的 `batchStatus` 分支，在批次歷經 `pending`、`processing` 與 `completed` 等狀態時觸發。

這表示 LLM 節點能同時完成兩件事：

- 執行主要批次請求，並在一般分支上回傳最終的逐項輸出
- 在每次有意義的批次狀態更新時觸發通知或記錄邏輯，無需將流程變成自訂的輪詢迴圈

批次執行是 LLM Workflow 的一級原生基本元件，節點 UI 中具備供應商與模型能力檢查。

**Agent 節點** 是 Heym 中 Agent 協調的核心：

- **工具呼叫** – Agent 會以迴圈反覆迭代工具呼叫，直到產生最終答案
- **Python 工具** – 以完整的 Python 內嵌定義自訂工具；Agent 會在執行階段呼叫它們
- **MCP 連線** – 連線至任何 [Model Context Protocol](https://modelcontextprotocol.io/) 伺服器（stdio 或 SSE），Agent 便會自動取得其所有工具
- **技能** – 將 `.zip` 或 `.md` 檔案拖放至 Agent，即可擴充其系統上下文並加入 Python 工具
- **子 Workflow 呼叫** – Agent 可將其他 Heym Workflow 作為工具呼叫，無需自訂程式碼即可組合出複雜行為

完整參考請參閱 [Agent 節點](../nodes/agent-node.md) 與 [Agent 架構](../reference/agent-architecture.md)。

### 多 Agent 協調

Heym 支援具備一級視覺化基本元件的 **orchestrator 模式**：

- 一個 Agent 擔任 **orchestrator**（`isOrchestrator: true`），並被賦予 `call_sub_agent` 工具
- 它將任務委派給同一畫布上具名的 **sub-agent**
- Sub-agent 本身可再呼叫其他 Agent 或子 Workflow（最大深度：5）
- **平行執行**：當 orchestrator 在單一回合中呼叫多個 sub-agent 時，它們會平行執行以加快結果產出

這使得諸如規劃型 Agent 將工作路由至研究員、程式設計師與摘要者的架構得以實現，全部以視覺化方式接線，無需自訂協調程式碼。

執行細節請參閱 [Agent 架構](../reference/agent-architecture.md)。

### 作為 Workflow 節點的 Coding Agent

Heym 內建兩個節點，可將真正的 coding agent 作為 Workflow 步驟執行，而非僅是聊天補完：

- **[Codex 節點](../nodes/codex-node.md)** – 在隔離的 Heym 工作區中，對 GitHub 儲存庫執行 OpenAI Codex CLI。支援 **Sign in with ChatGPT**（在您的 Plus/Pro 訂閱上使用 PKCE OAuth，無須按 Token 計費的 API 成本）或存取 Token，會複製儲存庫、讓 Codex 編輯程式碼，並回傳 `summary`、`diff`、`changedFiles` 以及草稿 `pullRequestUrl`。
- **[OpenCode Go 節點](../nodes/opencode-go-node.md)** – 透過供應商無關的 OpenCode 閘道（Kimi、DeepSeek、Qwen 等）執行相同的儲存庫 Workflow，並在 **強化的一次性容器** 中執行：捨棄所有能力、唯讀根目錄、pid/記憶體/CPU 限制。GitHub Token 會留在沙箱之外：Heym 在主機端執行所有 git 與 GitHub 操作，因此產生的程式碼無法竊取推送憑證。

這表示一個 Workflow 可以從 Webhook 分流處理 bug、將儲存庫交給 coding agent、等待草稿 PR，並將連結發佈至 Slack，全程自動化，且資源限制可依部署個別設定。

### 內建 RAG 管線

Heym 包含一個 [RAG / Vector Store 節點](../nodes/rag-node.md) 以及受管理的 [Vectorstores](../tabs/vectorstores-tab.md) 分頁。您可以：

- 選擇您的向量後端：**Qdrant**（外部伺服器）或 **Postgres (pgvector)**，後者將向量儲存於 Heym 自身的資料庫中，無須執行額外服務
- 直接從 Workflow 節點將文件插入向量儲存庫
- 執行語意搜尋並將結果饋入 LLM 或 Agent 節點
- 以 `$ragNode.results.map("item.payload.content").join("\n\n")` 之類的表達式引用結果

在 Heym 中，RAG 就是兩個節點，並對 embeddings 與檢索具備完整控制權。

### 使用 Playwright 的瀏覽器自動化

[Playwright 節點](../nodes/playwright-node.md) 是畫布上的一級原生瀏覽器自動化功能。

- **Steps 模式** – 以視覺化方式組合 navigate、click、type、fill、screenshot、extract 與 scroll 動作
- **具備自動修復的 AI steps** – 以自然語言描述動作，由 LLM 產生 Playwright 動作；失敗的 selector 可自動修復，且產生的步驟可快取以跳過未來的 LLM 呼叫
- **Run Code 模式** – 將節點切換為完整的 Playwright Python 以處理複雜流程（預設停用；啟用後會在 Heym 的強化沙箱中執行）
- **已驗證的工作階段** – 在執行前還原 cookies/`storageState`、以 selector 檢查驗證登入，並退回至腳本化的登入步驟
- **網路擷取** – 可選擇在結果之外一併收集 JSON 回應、headers、cookies 與瀏覽器儲存空間

Heym 將瀏覽器視為一般節點，具備與其他所有節點相同的表達式、憑證與錯誤處理。

### Expression DSL

Heym 的 [Expression DSL](../reference/expression-dsl.md) 提供簡潔且強大的語法，用於參照上游節點資料：

- `$input.text` – Input 節點資料
- `$nodeName.field` – 任何上游節點的輸出欄位
- `$global.variableName` – 持久性全域變數
- 陣列輔助方法：`.first()`、`.map("field")`、`.join("\n")`

Expression 可用於每個字串欄位，包括 Prompt、HTTP 標頭、條件與設定值，因此資料能在步驟之間明確流動。此 DSL 兼顧強大與可讀性，無需具備完整的 JavaScript 知識。

## Run

### Triggers、Retries 與 Error Paths

Workflow 可以從多處啟動。[Input](../nodes/input-node.md) 節點接收 HTTP [Webhook](../reference/webhooks.md)，[Cron](../nodes/cron-node.md) 依排程執行，事件 [Trigger](../reference/triggers.md) 則可從 Telegram、Discord、Slack、IMAP 信箱、WebSocket 串流、RabbitMQ 佇列、檔案上傳以及 Heym 平台事件啟動執行。

失敗會在圖內處理。任何節點都能在失敗時重試，並可設定嘗試次數與每次之間的等待時間，每次嘗試都會記錄於[執行歷史](../reference/execution-history.md)，而當節點失敗時，[Error Handler](../nodes/error-handler-node.md) 節點會自動執行，因此復原機制本身就是 Workflow 的一部分。

### 平行 DAG 執行

Heym 的 Workflow 執行器採用有向無環圖（DAG）排程器。獨立的節點會自動平行執行，無需任何設定。

- 位於相同相依層級的節點會並行派送至執行緒池（`max_workers=8`）
- 任何節點一完成，其下游節點便會立即排程
- [Merge Node](../nodes/merge-node.md) 會合併平行分支的結果
- 多個 Workflow 執行可並行進行；每次執行皆完全隔離

平行化是預設行為，由圖結構決定。

請參閱[平行執行](../reference/parallel-execution.md)。

### 跨執行個體擴展

將第二個 Heym 執行個體指向同一個 PostgreSQL 資料庫，它便會以 worker 身分加入。背景執行會依您設定的權重於執行個體之間分配，一位被選出的 leader 會持續執行排程、告警評估與崩潰復原，並透過容錯移轉維持運作，而每次執行都會記錄執行它的執行個體。請參閱[負載分配](../reference/cluster.md)。

### Agentic Kanban Board

[Board 分頁](../tabs/board-tab.md)是內建的 Kanban board，其欄位本身即會執行 Workflow。卡片是一項持久性的 agentic 作業，承載上下文、對話歷史、執行狀態、輸出與 Workflow 執行。

- **欄位 Workflow 鏈** – 將卡片移入某個欄位會啟動該欄位的 Workflow 鏈；**Agentic Kanban Model**（您的 credential + model）會將卡片內容對應至 Workflow 輸入，並將輸出轉回可讀文字
- **卡片附件** – 將檔案拖放至卡片；文件會擷取為文字，圖片則會在每次執行前傳遞給具備視覺能力的模型
- **即時執行畫布** – 在卡片內開啟進行中的執行，並在真實的 Workflow 畫布上逐節點觀看其執行過程
- **團隊共享** – 以讀取/寫入權限將 board 分享給使用者或團隊；共享 board 上的鏈會以擁有者的 credential 執行，因此協作者無需擁有自己的 credential
- **失敗可視性** – 失敗的卡片會顯示錯誤歷史指示器，後續執行則可暫停以等待留言

Board 是平台的原生介面：卡片、Workflow、credential 與即時執行全都位於同一處。

### Heym Drive：內建檔案儲存

[Drive 分頁](../tabs/drive-tab.md)是內建於平台的檔案儲存空間。由 skill 與 Workflow 產生的檔案（PDF、DOCX、CSV、圖片）會自動存放於此，board 卡片附件也會儲存在此處。

- **分享連結** – 公開或受密碼保護（Basic Auth）的下載連結，可選擇設定到期時間與下載次數上限
- **團隊共享** – 以唯讀方式將檔案分享給您的團隊，並可一鍵移除所有團隊分享
- **批次操作** – 以 shift-click 選取範圍進行多選，將選取的項目打包為單一 ZIP 下載，或對多個檔案一次套用相同的分享/密碼/刪除設定
- **Agent 存取** – Skill 可選擇啟用讀取 Drive 檔案，因此 Agent 能處理您或其他 Workflow 產生的文件

產生的成品會在平台內取得永久且可分享的存放位置。

## Observe

### LLM Traces

[Traces 分頁](../tabs/traces-tab.md)為每次 LLM 呼叫提供完整的可觀測性：

- 請求與回應 Payload
- 每次呼叫的計時：`llm_ms`、`tools_ms`、`mcp_list_ms`
- 工具呼叫名稱、引數與結果
- 傳遞給模型的 Skill

Trace 系統專為除錯 agentic 行為而打造，提供完整的請求與回應 Payload 以及每次呼叫的計時。

### LLM Token 成本追蹤

Heym 中的每一次 LLM 呼叫都會自動計算成本。[Traces 分頁](../tabs/traces-tab.md)會顯示每個 trace 的輸入與輸出 Token 數量，以及根據同步定價表即時計算出的 USD 成本。

- **單一 trace 成本** – 每一列 trace 都會顯示輸入 Token、輸出 Token 與總計 USD
- **成本分析** – KPI 卡片與各模型成本圖表會隨選定的時間範圍（1h / 24h / 7d / 30d / All）更新
- **LLM 成本表** – [DataTable 分頁](../tabs/datatable-tab.md)中的系統表每 24 小時從 Helicone 同步一次；您可以覆寫價格，或為尚未列出的模型新增自訂資料列
- **缺少價格警告** – 若某模型的 trace 沒有對應的定價項目，會顯示內嵌警告並附上直接前往成本表的連結

每一次執行都會帶有自己的 USD 成本，並依模型細分。

### 在即時畫布上開啟正式環境執行

正式環境的 Workflow 在編輯器之外啟動後，仍可持續檢視。從任一個 History 對話框開啟任何一筆 **Running** 項目，或在 Agentic Kanban 卡片中開啟進行中的執行，Heym 就會將一般的 Workflow 編輯器附加到該次確切的執行上。

- 已完成的節點會立即顯示其結果
- 目前節點與待執行的下游節點會隨著執行推進持續閃爍
- Debug 面板會收到與從畫布啟動的執行相同的增量節點結果
- 最終輸出與執行標示會直接送達，無需輪詢或啟動重複的執行
- 關閉編輯器只會中斷觀察者連線，絕不會取消正式環境的 Workflow

觀察者使用由跨 worker 執行快照支援的 SSE，因此即使執行由另一個後端 worker 持有，也能適用於 Webhook、排程、聊天、MCP、整合與 Board 等 Trigger。

### OpenTelemetry、分析與警示

Heym 會為每一次 Workflow 執行、節點執行與 Agent 工具呼叫發出 [OpenTelemetry](../reference/opentelemetry.md) span，並透過 OTLP/HTTP 匯出至 Jaeger、Grafana Tempo、Honeycomb、Datadog 或任何其他相容的後端。

[Analytics](../tabs/analytics-tab.md) 分頁會追蹤每個 Workflow 的執行次數、成功率、時長與趨勢。[Alerts](../tabs/alerts-tab.md) 會監看一段時間範圍內的錯誤次數、執行時長、Token 或 USD 花費以及執行量，接著執行您選擇的通知 Workflow，讓警示能送達 Slack、電子郵件、Telegram，或任何節點能觸及的地方。

## 評估

### 內建 Evals

[Evals 分頁](../tabs/evals-tab.md)讓您定義測試套件，並對您的 Agent Workflow 執行這些測試：

- 建立包含輸入與預期輸出的測試案例，或從套件 Prompt 產生測試案例
- 以多個模型執行同一個套件，並並排比較其輸出
- 使用 Exact Match、Contains 或搭配獨立評審模型的 LLM-as-Judge 進行評分
- 檢視通過/失敗、實際與預期結果，以及執行歷史

變更 Prompt 或模型後，重新執行套件並比較結果，再讓變更進入正式環境。

## 控制

### Human-in-the-Loop（HITL）

Heym 內建 [Human-in-the-Loop](../reference/human-in-the-loop.md) 系統，讓 Agent 暫停執行、請求人工審查，並從中斷處精確恢復。

- **Agent 檢查點** – 在任何 Agent 節點上啟用 `hitlEnabled`，即可為其提供 `request_human_review` 工具。Agent 會自行判斷何時需要人工監督，並以摘要與草稿呼叫該工具。
- **公開審查 URL** – 每次審查請求都會產生一個安全的一次性連結 `/review/{token}`（TTL 為 168 小時）。審查者無需登入即可**接受**、**編輯並繼續**或**拒絕**。
- **執行快照** – Workflow 會凍結其完整狀態（對話歷史、變數、工具結果），以便在審查者回應後，從暫停處精確恢復。
- **通知分支** – 選用的 `review` 輸出 handle 讓您接上通知流程（Slack、電子郵件、Webhook），在請求審查時觸發。
- **MCP 工具核准政策** – 以文字撰寫的 HITL 準則會被解讀為核准範圍（`always` / `once` / `never`），讓 Agent 能自動核准低風險工具，並將高風險工具向上呈報。
- **多個檢查點** – 單一 Agent 執行可以多次暫停等待審查；每個檢查點彼此獨立。

公開審查 URL、編輯並繼續、通知分支與快照式恢復全都運作於同一個 Agent 檢查點。

完整參考請見 [Human-in-the-Loop](../reference/human-in-the-loop.md)。

### LLM Guardrails

Heym 在 [LLM](../nodes/llm-node.md) 與 [Agent](../nodes/agent-node.md) 節點上都內建 [Guardrails](../reference/guardrails.md)，讓您能在模型回應送達下游步驟之前封鎖不安全的內容。

- **節點層級安全開關** – 直接在產生或處理使用者面向內容的節點上啟用 guardrails
- **廣泛的政策涵蓋範圍** – 封鎖暴力、仇恨言論、性內容、NSFW/不雅用語、騷擾、非法活動、個人資料請求與 Prompt injection 嘗試
- **多語言偵測** – 對土耳其語、英語、阿拉伯語、西班牙語及其他語言套用相同的安全規則
- **Workflow 原生 fallback** – 當訊息被封鎖時，節點會拋出型別化的 Workflow 錯誤，您可以透過 [Error Handler](../nodes/error-handler-node.md) 進行路由

安全政策直接存在於 LLM 與 Agent 設定中，並可直接接入 Workflow 分支與錯誤處理。

### 存取、Credentials 與稽核

Agent 以真實的 Credentials 執行，因此存取權限是治理的一部分。[Credentials](../reference/credentials.md) 在靜態儲存時經過加密，建立後即遮蔽，並可與使用者或[團隊](../reference/teams.md)共享，團隊同時也共享 Workflow、變數、向量儲存與 Drive 檔案。[單一登入](../reference/sso.md)可連接任何 OpenID Connect 提供者，包括 Okta、Entra ID、Keycloak、Auth0 與 Google。[稽核軌跡](../reference/audit.md)會記錄每一項與安全相關的動作，包含其執行者、目標與結果，並與您的容器日誌一併串流至您既有的日誌收集器或 SIEM。

### 自架部署，資料由您掌控

Heym 在您的基礎架構上運行。Workflow、Credentials、執行歷史與追蹤資料都存放在您自己的資料庫中，模型呼叫則從您的伺服器送往您選擇的提供者，或送往您透過 Ollama 或 vLLM 自行託管的模型。對於處理敏感文件、客戶資料或專有知識庫的 Agent 而言，這通常是硬性要求。

Heym 採用 **MIT License 搭配 Commons Clause 條件**授權。原始碼為 source-available：您可以自由使用、修改與自架。Commons Clause 限制販售本軟體，包括提供付費託管或諮詢／支援服務，且其價值主要來自 Heym 者。如需商業授權、企業部署或專業支援，請聯絡 [enterprise@heym.run](mailto:enterprise@heym.run)。

## 對外暴露

### API 與串流

Workflow 可透過 HTTP 呼叫，位於 `/api/workflows/{workflow_id}/execute`，回傳 JSON；以及位於 `/api/workflows/{workflow_id}/execute/stream`，在執行過程中以 Server-Sent Events 串流節點事件。兩者共用 Workflow 層級的身分驗證、速率限制與回應快取。請參閱 [Webhooks](../reference/webhooks.md) 與 [SSE Streaming](../reference/sse-streaming.md)。

### MCP（Model Context Protocol）整合

Heym 在兩端皆原生支援 [MCP](../tabs/mcp-tab.md)：

- **作為客戶端**：Agent 節點透過 stdio 或 SSE 連接外部 MCP 伺服器（Filesystem、Browserbase、自訂工具），並自動取用其工具
- **作為伺服器**：啟用 MCP 的 Workflow 會成為預設伺服器上位於 `/api/mcp/sse` 的工具，或成為具有各自 URL 與 API key 的具名伺服器上的工具，因此 Claude Desktop、Cursor 與其他 MCP 客戶端可直接呼叫您的 Heym Workflow

Agent 可同時取用多個 MCP 伺服器，且任何 Workflow 都能成為外部 MCP 客戶端的工具。

### Portal：將 Workflow 發布為聊天 UI

[Portal](../reference/portal.md) 功能可將任何 Workflow 轉換為位於 `/chat/{slug}` 的公開聊天介面：

- 可選的身分驗證，搭配每位使用者專屬的 Credentials
- 串流執行（即時節點進度）
- 檔案上傳支援
- 多輪對話歷史

團隊只需一個 Workflow 與一個 URL，即可交付內部工具、面向客戶的聊天機器人與 AI 驅動的表單，無需撰寫任何前端程式碼。

### Workflow 驅動的儀表板

[Dashboard 分頁](../tabs/dashboard-tab.md)是使用者自行建構的報表介面，其中每個圖表 widget 皆由各自隱藏的 Heym Workflow 驅動。Widget 可呼叫 API、查詢 BigQuery、搜尋 RAG／向量儲存、執行 LLM 步驟、轉換資料列，並以 [Chart Output 節點](../nodes/chart-output-node.md)作結。您可以手動建立 widget、以 AI 生成、日後微調、快取結果，並以視覺化方式重新排列網格。

## 與 Workflow 自動化工具比較

許多團隊是從 workflow 自動化工具轉向 Heym 的。下表比較 Heym 與 n8n、Zapier 及 Make.com 在 Agent 進入生產環境後真正重要的能力，表格下方的註腳引用了比較依據的官方文件。若想逐一深入了解各工具，請參閱 [heym.run/compare](https://heym.run/compare) 的比較頁面。

| 能力 | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| 內建 LLM 節點 | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + 狀態分支 | ✓ | 有限¹¹ | –¹¹ | 有限¹¹ |
| 內建 Agent 節點（tool calling） | ✓ | ✓ | ✓ | ✓ |
| 多 Agent 協同編排 | ✓ | ✓ | 有限 | 有限 |
| Coding agent 節點（Codex、OpenCode） | ✓ | –²⁰ | –²⁰ | –²⁰ |
| 內建 RAG / vector store | ✓ | ✓ | 有限¹ | plugin² |
| WebSocket 讀取 / 寫入 | ✓ | 有限¹² | –¹³ | –¹⁴ |
| 自然語言 workflow 建構器 | ✓ | 有限³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| 在即時畫布上開啟執行中的 run | ✓ | 有限¹⁹ | 有限¹⁹ | –¹⁹ |
| Workflow 驅動的儀表板 | ✓ | 有限¹⁷ | 有限¹⁷ | 有限¹⁷ |
| Agentic Kanban 看板 | ✓ | –²¹ | –²¹ | –²¹ |
| MCP（Model Context Protocol） | ✓ | ✓ | ✓ | ✓ |
| Agent 的 Skills 系統 | ✓ | – | – | – |
| 內建檔案硬碟（分享連結、團隊） | ✓ | 有限²² | 有限²² | –²² |
| 瀏覽器自動化節點（Playwright） | ✓ | 有限²³ | 有限²³ | –²³ |
| LLM trace 檢視 | ✓ | 有限⁴ | – | ✓ |
| OpenTelemetry tracing 匯出 | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token 成本追蹤（USD） | ✓ | –¹⁵ | –¹⁵ | 有限¹⁵ |
| 內建 AI workflow evals | ✓ | ✓ | – | – |
| Human-in-the-Loop（HITL） | ✓ | ✓⁵ | 有限⁶ | 有限⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | 有限⁸ |
| 自動上下文壓縮 | ✓ | – | – | – |
| 平行 DAG 執行 | ✓ | 有限⁹ | – | – |
| 可自架、原始碼可見 | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| 用於動態資料的 Expression DSL | ✓ | ✓ | 有限 | ✓ |

> **註腳：** ¹ Zapier Knowledge Sources — 未暴露 vector store 或 embedding 控制項。 ² Make.com 有 Pinecone/Qdrant 模組，但沒有原生 RAG 節點。 ³ n8n AI Workflow Builder 是僅限雲端的 beta，且有額度上限。 ⁴ n8n 會顯示中間步驟；完整追蹤需要第三方工具。 ⁵ n8n 支援透過聊天、電子郵件及協作管道進行 AI 工具呼叫核准，但它不會像 Heym 那樣對整個執行進行快照並恢復。 ⁶ Zapier Human in the Loop 支援在 Zaps 內進行核准與資料收集，但它不是公開審查、快照恢復的檢查點系統。 ⁷ Make.com 以 Enterprise 應用程式的形式提供 Human in the Loop，具備審查請求以及調整/核准/取消的結果，但它仍受方案限制，且較不具 agent 原生特性。 ⁸ n8n 隨附專用的 Guardrails 節點，Zapier 在其 AI 產品中隨附 AI Guardrails，而 Make.com 記載了 agent 規則及審查流程，但沒有可比的獨立 guardrails 功能，因此 Make 標記為有限。 ⁹ n8n 預設為循序執行；平行處理需要透過子 Workflow 的變通做法。 ¹⁰ Sustainable Use License — 可免費用於內部用途的自架部署，商業再散布則受限制。 ¹¹ 截至 2026 年 4 月 22 日，n8n 的官方文件描述的是 HTTP 批次處理以及迴圈/等待模式，而非原生的 LLM 批次狀態分支；Zapier 的官方 ChatGPT 應用程式文件未列出任何 Trigger，且僅有通用的 API Request beta；Make 的官方 OpenAI 整合頁面暴露了如 create/watch completed 等批次動作，但沒有第一級的狀態分支 LLM 節點，因此針對此特定 Workflow 模式，n8n/Make 標記為有限，而 Zapier 標記為不支援。 ¹² n8n 的官方文件涵蓋 HTTP Webhook 與 HTTP Request 節點，以及 Code/自訂/社群擴充性，但我找不到第一方的 WebSocket Trigger/傳送節點，因此 n8n 標記為有限。 ¹³ Zapier 的官方文件僅涵蓋透過 HTTP 的 inbound webhooks 與 outbound webhook/API 請求，而非原生 WebSocket Trigger 或傳送步驟。 ¹⁴ Make 的官方文件涵蓋 Webhooks 模組與 HTTP(S) 請求模組，但我找不到原生 WebSocket Trigger 或傳送模組。 ¹⁵ n8n 沒有原生 LLM Token 成本追蹤；社群變通 Workflow 確實存在，但需要手動安裝與執行後 API 呼叫（截至 2026 年 5 月為未解決的功能請求）。Zapier 未向使用者暴露每次執行的 Token 數量或美元成本；AI 步驟僅消耗任務。Make.com 的 credits 儀表板部分反映了 Make 代管 AI 的 Token 消耗（自 2025 年 8 月起），但第三方 API key 連線以 1 次操作 = 1 個 credit 計費，不進行 Token 計數；無法取得依模型區分的每次執行美元明細。 ¹⁶ Heym 透過 OTLP/HTTP 向任何相容的後端發出原生 OpenTelemetry span（每次 Workflow 執行一個，加上每個節點一個），具備 W3C trace-context 傳播且無需 instrumentation 程式碼，透過 `HEYM_OTEL_*` 環境變數設定，且預設為停用。n8n 有記載用於 Workflow 與節點執行的 OpenTelemetry 追蹤整合。截至 2026 年 6 月，Zapier 與 Make.com 並未記載其 Workflow/scenario 執行的 OpenTelemetry 匯出。 ¹⁷ n8n 記載了用於生產執行指標的 Insights 儀表板，Zapier 記載了 Zap History 加上 Task Usage，而 Make.com 記載了 Scenario History；這些是監控/歷史介面，而非像 Heym 的 Dashboard 分頁那樣由任意 Workflow 邏輯支援的自訂儀表板小工具。 ¹⁸ Heym Workflow Analyzer 會在可能時執行 Workflow、讀取執行結果，並產生一份涵蓋改善領域、目的及逐步行為的共享可編輯 Markdown 報告。n8n 記載了用於建立/精煉/除錯 Workflow 的 AI Workflow Builder，Zapier 記載了針對發生錯誤的 Zap 執行的 AI 疑難排解，而 Make.com 記載了 scenario 歷史加上 AI agent 推理步驟，但它們的公開文件並未描述相同的執行感知共享 Workflow 分析文件。 ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) 會列出執行中的執行，並可將先前執行的資料載入編輯器，而 [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) 在其編輯器中暴露了執行中狀態。[Make Scenario History](https://help.make.com/scenario-history) 記載了執行詳細資料與日誌。其公開文件（查核於 2026 年 7 月 18 日）並未描述 Heym 的確切流程：從 History 或 Kanban 卡片開啟任意進行中的生產執行、還原其目前的節點快照，並在同一畫布上繼續接收節點動畫與 Debug 日誌。 ²⁰ Heym 的 [Codex](../nodes/codex-node.md) 與 [OpenCode Go](../nodes/opencode-go-node.md) 節點會在隔離的 Heym 工作區中，針對 GitHub 儲存庫執行真正的編碼 agent CLI — 複製、編輯、產生 diff、推送分支、開啟 pull request — 作為第一級的 Workflow 步驟。截至 2026 年 7 月 20 日，沒有任何競爭對手記載了等效功能：n8n 的 [OpenAI 節點](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai)涵蓋聊天/助理 API 呼叫，而非儲存庫層級的編碼 agent，且原生 Codex 支援仍是社群請求；Zapier 自家的部落格記載的是反方向 — [Codex 透過 Zapier MCP 驅動 Zapier 工具](https://zapier.com/blog/automate-codex-zapier-mcp/) — 而非 Codex 作為 Zap 步驟；Make.com 的 OpenAI 模組暴露 completions/assistants/批次動作，而非會複製儲存庫並開啟 PR 的編碼 agent。 ²¹ Heym 的 [Board 分頁](../tabs/board-tab.md)是內建的 agentic Kanban 看板，其欄會執行 Workflow，其卡片帶有上下文、對話歷史、執行狀態與執行。n8n（[Kanban Tool 整合](https://n8n.io/integrations/kanban-tool/)）、Zapier（[Kanban Tool 整合](https://zapier.com/apps/kanbantool/integrations)）與 Make.com（[Kanban Tool 整合](https://www.make.com/en/integrations/kanban-tool)）僅連線至第三方 kanban 應用程式，例如 Kanban Tool、Wekan 或 NocoDB；截至 2026 年 7 月 20 日，沒有任何一家記載了會執行自身 Workflow 的內建看板。 ²² n8n 在內部儲存執行二進位資料（可選用 [S3 相容外部儲存](https://docs.n8n.io/hosting/scaling/external-storage/)），但未記載任何具備分享連結或團隊共享的使用者面向檔案磁碟，因此標記為有限。Zapier 的 [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) 僅在 Zap 執行期間處理檔案，而 [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) 保存小型文字值，因此 Zapier 標記為有限。Make.com 的 [data stores](https://help.make.com/l6du-data-stores) 保存結構化記錄，而其[檔案處理](https://help.make.com/working-with-files)在應用程式之間傳遞檔案，沒有持久的內建儲存，因此 Make 標記為不支援。 ²³ Heym 的 [Playwright 節點](../nodes/playwright-node.md)是第一方瀏覽器自動化，具備視覺化步驟模式、AI 產生的步驟，以及完整程式碼模式。n8n 僅提供社群套件，例如 [n8n-playwright](https://github.com/toema/n8n-playwright)，且[原生瀏覽器自動化節點的功能請求](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796)仍未解決，因此標記為有限。Zapier Agents 可[透過網頁瀏覽與 Chrome 擴充功能瀏覽及讀取頁面](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension)，但 Zapier 未記載任何指令碼化的瀏覽器自動化步驟，因此標記為有限。截至 2026 年 7 月 20 日，Make.com 記載的是 HTTP 模組與第三方擷取應用程式，而非任何原生瀏覽器自動化模組。

## 相關

- [Introduction](./introduction.md) – 平台總覽
- [Quick Start](./quick-start.md) – 建立您的第一個 Workflow
- [Workflow Analysis](../reference/workflow-analysis.md) – 產生可共享的執行感知 Workflow 報告與改善回饋
- [Dashboard Tab](../tabs/dashboard-tab.md) – 以 Workflow 為基礎，搭配 AI 生成的圖表小工具建立儀表板
- [Agent Node](../nodes/agent-node.md) – 具備工具呼叫、MCP 與技能的 LLM 節點
- [Agent Architecture](../reference/agent-architecture.md) – 子 Agent、協調器與工具分派
- [Board Tab](../tabs/board-tab.md) – 可執行 Workflow 的欄位式 Agentic 看板
- [Codex Node](../nodes/codex-node.md) – 對 GitHub 儲存庫執行 OpenAI Codex 程式碼 Agent
- [OpenCode Go Node](../nodes/opencode-go-node.md) – 於強化容器中執行的供應商無關程式碼 Agent
- [Drive Tab](../tabs/drive-tab.md) – 內建檔案儲存空間，支援分享連結、團隊與批次操作
- [Playwright Node](../nodes/playwright-node.md) – 第一方瀏覽器自動化，支援 AI 步驟與程式碼模式
- [RAG / Vector Store Node](../nodes/rag-node.md) – 向量搜尋與文件插入（Qdrant 或 Postgres pgvector）
- [AI Assistant](../reference/ai-assistant.md) – 自然語言 Workflow 建構工具
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – 具備公開審閱 URL 的 Agent 檢查點
- [Guardrails](../reference/guardrails.md) – 在 Prompt 送達您的模型之前阻擋不安全的內容
- [Traces Tab](../tabs/traces-tab.md) – LLM 呼叫可觀測性
- [Evals Tab](../tabs/evals-tab.md) – AI Workflow 的測試套件
- [Alerts Tab](../tabs/alerts-tab.md) – 針對錯誤、時長、成本與執行量的閾值警示
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – 透過 OTLP 匯出執行、節點與工具 span
- [Load Distribution](../reference/cluster.md) – 透過領導者容錯移轉在多個執行個體間分擔執行
- [Single Sign-On](../reference/sso.md) – 透過任何 OpenID Connect 供應商登入
- [Audit Logging](../reference/audit.md) – 記錄與安全相關的操作，包含操作者、目標與結果
- [Portal](../reference/portal.md) – 將 Workflow 發布為公開聊天 UI
- [Parallel Execution](../reference/parallel-execution.md) – 以 DAG 為基礎的並行執行
- [MCP Tab](../tabs/mcp-tab.md) – MCP 伺服器與用戶端設定

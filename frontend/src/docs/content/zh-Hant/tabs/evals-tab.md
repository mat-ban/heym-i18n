# Evals 分頁

**Evals** 分頁是位於 `/evals` 的獨立頁面。它讓您建立評估套件、定義測試案例，並針對您的 [Agent](../nodes/agent-node.md) Workflow 執行評估。 [Agent 評估套件](#agent-suites) 可以執行 Agent 或讀取其實際執行記錄，並檢查其呼叫的工具、延遲、USD 成本、Token 數量以及工具呼叫次數。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 觀看 Evals 示範</a></p>

## 存取方式

- 在儀表板分頁列中點擊 **Evals**
- 或導覽至 `/evals`
- 或使用 **Ctrl+K**（Cmd+K），並從命令面板中選擇「Evals」

## Eval 套件

- **新增套件** – 選擇 **Prompt 套件** 以跨模型測試系統 Prompt，或選擇 **Agent 套件** 檢查 Agent 的實際執行狀況（參見 [Agent 套件](#agent-suites)）
- **套件選取器** – 將 Prompt 套件與 Agent 套件統一列出，並在每個名稱旁標註類型；輸入關鍵字即可搜尋
- **建立套件** – 以名稱與描述定義一個套件
- **選擇 Workflow** – 選擇要評估的 Workflow
- **選擇 Credential** – 用於執行 Workflow 的 API key
- **System Prompt** – 直接在左側面板中編輯套件層級的 System Prompt
- **Optimize Prompt** – 請 LLM 改善目前的 System Prompt

## 測試案例

- 新增測試案例，包含輸入 Prompt 與預期輸出
- 每個案例可設定自訂的預期值以供比對
- 從套件中編輯或刪除案例
- **Generate Test Data** – 使用所選的 Credential／模型，從套件 Prompt 自動建立測試案例

## 執行評估

- **選擇一或多個模型** – 在一次評估中，針對多個模型執行同一個套件
- **評分方式** – 選擇 `Exact Match`、`Contains` 或 `LLM-as-Judge`
- **Judge** – 針對 `LLM-as-Judge`，可選擇性地挑選 OpenAI、OpenAI 相容（Custom）、Gemini（Google）或 [Decision Model](../nodes/decision-node.md) Credential，並輸入 Judge 的模型（例如 `gpt-4o-mini` 或 `jev-latest`），以獨立的 Judge 進行評分
- **每次測試的執行次數** – 在一次執行中重複每個測試案例多次
- **記憶設定** – 套件開啟時會自動套用其最新一次執行的設定：憑證、模型、評分方式與評審、Temperature、推理強度以及每個測試的執行次數。開啟歷史執行記錄會載入當時的設定，點擊 **重新執行評估** 即可完全重複該測試
- **Temperature** – 設定模型 Temperature（`Exact Match` 與 `Contains`）
- **推理強度** – 為推理模型設定推理強度，支援從 Low 到 Extra high 與 Max，與 LLM 節點和 Agent 節點保持一致（`Exact Match` 與 `Contains`）

### LLM-as-Judge

使用 Judge 時，每個模型僅以套件 Prompt 回答測試輸入，接著由 Judge 針對答案與預期輸出的相符程度評分，分數範圍為 0 到 100：

- **模型 Judge**（OpenAI、OpenAI 相容或 Gemini）會讀取問題、預期輸出與答案，並回傳分數及一行理由。它以 Temperature `0` 執行，或對推理模型以 `low` reasoning effort 執行，因此相同的答案會得到相同的判定。
- **Decision Model Judge** 會依五級評分標準為答案評分，從 *完全偏離* 到 *完全相符*。分數是該評分標準上以機率加權的位置，因此它來自模型計算出的分布，而非模型自行寫出的數字。

儲存格的懸停資訊卡會顯示評審給出的原因，對於決策模型則顯示層級、得分及其信賴度。延遲與 Token 描述的是被測模型；評審自身的呼叫記錄會以 **Evals** 來源出現在 [Traces](./traces-tab.md) 中。評審選取器會排除 Model Router 憑證，因為評審必須是固定的單一模型。被測模型的憑證可以使用 [Model Router](../reference/credentials.md#model-router-auto-model)：其 **Auto** 模型會根據每個請求動態挑選模型，機制與在 Workflow 中完全一致。

若無 Judge，每個模型會在單一請求中自行回答並為自己的答案評分。

此模式下會隱藏 Temperature 與 reasoning effort，且執行時使用固定設定：標準模型使用 Temperature `0.7`，推理模型使用 `medium` reasoning effort（當它們為自己的答案評分時則為 `low`）。

## 結果

- 檢視每個測試案例的通過／失敗
- 檢查實際輸出與預期輸出
- 當一次執行包含多個模型時，並排比較各模型的輸出
- 檢閱過去評估的執行歷史記錄；`LLM-as-Judge` 執行會在歷史記錄清單中顯示其 Judge 模型
- 從結果面板開啟歷史執行，並檢查已儲存的 Prompt／輸入／輸出快照
- 開啟過去的執行會將其評分方式與 Judge 載入左側面板，因此 **Re-Run Evals** 會重複相同的評估
- **Export** 會將該次執行下載為 JSON，包含 `judge_credential_id` 與 `judge_model`

## Agent Suites

Agent 套件用於根據 [Agent](../nodes/agent-node.md) 節點的執行記錄對其進行品質檢查。它從 [Traces](./traces-tab.md) 中讀取資料（每次執行均已記錄耗時、Token、成本及工具呼叫），亦可直接代您執行該 Workflow。

點擊 **新增套件** → **Agent 套件**，按照以下三步完成建立：

1. **Agent** – 選擇目標 Workflow 及其 Agent 節點。清單中僅展示包含 Agent 節點的 Workflow；尚未執行過的 Workflow 或 Agent 會顯示但無法被選取。右側展示所選 Agent 的設定（模型、指示、工具與限制），下方展示該 Workflow 的唯讀畫布並醒目提示該 Agent。
2. **基準** – 該 Agent 最近的 10 次執行指標：p50 與 p95 延遲、單次執行成本、單次執行 Token 以及單次執行工具呼叫次數、呼叫了哪些工具及頻率，以及每次執行的具體數據。以錯誤結束的執行雖會列出，但會自動從基準中排除。
3. **檢查項** – 為每個工具標記 **Must call**、**Must not call** 或 **Either**。所有呼叫種類均附帶其類型列出：Python 與節點工具、帶伺服器資訊的 **MCP** 工具、依標籤劃分的 **Sub-Agent**、依名稱劃分的 **Sub-Workflow** 以及 **skills**。若某個工具尚未執行過，可依類型與名稱手動新增，並可透過其 **X** 圖示刪除。為延遲、成本、總 Token 與工具呼叫次數設定上限閾值；每個上限預設設為基準 p95 值的 120%，亦可個別關閉。

儲存後的套件將預設展示 **結果** 介面，旁邊提供 **基準** 與 **編輯檢查項**：

- **執行 Workflow** – 選擇執行次數（最多 20 次）；系統支援 4 次並行執行。輸入參數預設沿用該 Workflow 最新一次執行的資料且支援編輯，每次執行均使用該參數。開啟 **產生輸入**（星光圖示），選擇憑證與模型，即可讓模型為每次執行編寫不同的輸入內容。模型會閱讀該 Agent 的系統指示，並產生與您所輸入內容相近的資料（例如輸入城市名稱會衍生產生其他城市名稱）。每次執行均如同正常觸發一樣完整執行整個 Workflow，並在執行歷史中帶有 `agent_suite` Trigger 標記。若需略過後續步驟（例如發送電子郵件），可透過面板中的 **前往 Workflow** 開啟畫布並預先停用相關節點。點擊 **停止** 可終止套件執行：不會再啟動新的執行，進行中的執行亦會被取消。因伺服器中斷（例如容器重啟）而中止的套件執行，會在 1 分鐘後標示為已中斷，而不會無限期掛起。
- **結果** – 預設對最新的套件執行進行評分。每次套件執行記錄均隨其日期儲存在執行選取器中，支援隨時查閱或刪除；您也可以切換至該 Agent 最近的 10、20 或 50 次執行，將其他外部執行一併納入統計。您可以直觀檢視通過率、各檢查項的通過頻率、延遲、成本、Token 與工具呼叫與所存基準的對比，並可查看每次執行的失敗原因及直達其 Trace 的連結。
- **前往 Workflow** 會在新分頁中開啟該 Agent 所在的 Workflow。在名稱輸入框中按下 **Esc** 或點擊 **X** 即可清除內容。

指標解讀說明：

- **延遲** 為模型的回應時間加上該次執行中所有工具呼叫的耗時總和。
- **成本** 採用與 Traces 完全一致的定價。若所用模型未設定單價，則會自動略過成本檢查，而非判定為失敗。
- 當單次執行無錯誤完成且所有檢查項均滿足時，判定為 **通過**。
- 套件僅讀取您自己有權存取的 Traces，規則與 Traces 標籤頁完全一致。
- 在 **編輯檢查項** 中點擊 **使用最新執行作為基準**，即可將已存基準替換為該 Agent 最新的執行資料。

套件基準支援三種資料來源，**編輯檢查項** 會在 **已存基準** 旁標明目前生效的來源：

- Agent 最新的實際執行（預設值，亦即 **使用最新執行作為基準** 所採納的資料），
- 某次已完成的套件執行，
- 手動輸入的靜態數值。

後兩種方式可透過 [Chat](./chat-tab.md#working-with-evals) 或直接呼叫 API 進行設定：

- `PATCH /api/evals/agent-suites/{id}` 支援傳入 `baseline: {"source": "suite_run", "run_id": "…"}` 或 `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`。
- `POST /api/evals/agent-suites/{id}/runs` 接收 `inputs_list` 參數：每次執行對應一個輸入物件，最多支援 20 個。

### 透過 Chat 與 MCP 使用

[Chat](./chat-tab.md#working-with-evals) 與 MCP `heym_chat` 工具能夠直接建立、修改並執行 Prompt 套件與 Agent 套件：

- 它們能夠自主編寫測試用例與執行輸入參數。
- 在建立 Prompt 套件前，除非候選項唯一，否則它們會向您詢問應使用的憑證。
- 它們在對話中提及任何套件時均會附帶直達本頁面的連結。

## Benchmark 矩陣構想

當您為 Agent Workflow 建立 Benchmark 矩陣時，請將 HITL 情境納入為第一級案例，而非將其視為邊緣案例。

- 涵蓋全部三種審查決策：`accepted`、`edited` 與 `refused`
- 納入多種 Trigger 來源，例如編輯器執行、portal、curl/webhook 以及 Cron 觸發的執行
- 新增重複審查情境，讓單一 Agent 執行暫停超過一次
- 驗證連接至 Agent `review` 輸出的通知分支
- 斷言拒絕後的下游行為，特別是當後續節點依據 `$agent.decision` 分支時

## 相關內容

- [Why Heym](../getting-started/why-heym.md) – 將 Evals 視為 Agent 生命週期中的測試階段
- [Agent Node](../nodes/agent-node.md) – 受評估的 Workflow
- [Credentials Tab](./credentials-tab.md) – 用於 Eval 執行的 Credential
- [Traces Tab](./traces-tab.md) – 詳細的 Trace 檢查
- [Workflows Tab](./workflows-tab.md) – 建立要評估的 Workflow
- [Execution History](../reference/execution-history.md) – 檢視過去的執行（頁首的 History 按鈕）
- [Contextual Showcase](../reference/contextual-showcase.md) – Evals 頁面上提供的精簡頁面指南

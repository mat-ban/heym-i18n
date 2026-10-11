# Evals 分頁

**Evals** 分頁是位於 `/evals` 的獨立頁面。它讓您建立評估套件、定義測試案例，並針對您的 [Agent](../nodes/agent-node.md) Workflow 執行評估。

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ 觀看 Evals 示範</a></p>

## 存取方式

- 在儀表板分頁列中點擊 **Evals**
- 或導覽至 `/evals`
- 或使用 **Ctrl+K**（Cmd+K），並從命令面板中選擇「Evals」

## Eval 套件

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
- **Temperature** – 設定模型 Temperature（`Exact Match` 與 `Contains`）
- **Reasoning effort** – 為推理模型設定 reasoning effort（`Exact Match` 與 `Contains`）

### LLM-as-Judge

使用 Judge 時，每個模型僅以套件 Prompt 回答測試輸入，接著由 Judge 針對答案與預期輸出的相符程度評分，分數範圍為 0 到 100：

- **模型 Judge**（OpenAI、OpenAI 相容或 Gemini）會讀取問題、預期輸出與答案，並回傳分數及一行理由。它以 Temperature `0` 執行，或對推理模型以 `low` reasoning effort 執行，因此相同的答案會得到相同的判定。
- **Decision Model Judge** 會依五級評分標準為答案評分，從 *完全偏離* 到 *完全相符*。分數是該評分標準上以機率加權的位置，因此它來自模型計算出的分布，而非模型自行寫出的數字。

儲存格的懸浮卡片會顯示 Judge 的理由，若為 Decision Model 則顯示等級、分數及其信心度。Latency 與 Token 描述的是受測模型；Judge 自身的呼叫會出現在 [Traces](./traces-tab.md) 中，來源標示為 **Evals**。模型選擇器會略過 Model Router Credential，因為 Eval 比較的是特定模型。

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

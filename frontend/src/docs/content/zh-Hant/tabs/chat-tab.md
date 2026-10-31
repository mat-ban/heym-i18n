# Chat 分頁

**Chat** 分頁提供直接的 LLM 對話介面。您可以使用它來測試模型、提出問題、執行現有的 Workflow，或透過自然語言請求建立新的 Workflow。

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ 觀看 Chat 示範</a></p>

## 設定

1. 選擇一組 [credential](./credentials-tab.md)（OpenAI、Google 等的 API key）
2. 從下拉式選單中選擇模型（模型會從所選的 credential 載入）
3. 開始輸入以傳送訊息

您也可以從 [Workflows 分頁](./workflows-tab.md)的聊天方塊開始對話。它會傳送您的第一則訊息，並在此處開啟新的對話，且答案已開始串流。

## 功能

- **Global variables 情境** – 您的 [Global Variables](../reference/global-variables.md) 可供 LLM 使用，因此您可以詢問或引用已儲存的值
- **Workspace template 情境** – 您 workspace 中共享的 Workflow 與節點範本會作為情境納入，因此 Chat 可以回答關於可用範本的問題
- **長時間執行的 Agent** – 即使瀏覽器關閉，Chat 仍會在後端持續運作，因此您可以從其他裝置回來並繼續相同的對話
- **Workflow 建立** – 要求 Chat 建立或設定 Workflow，它會使用與編輯器助理相同的 Workflow AI Builder 引擎來產生並儲存 Workflow
- **Kanban 任務建立** – 以自然語言要求新增任務或建立卡片。Chat 會將其新增至所要求看板的第一個欄位；當您有多個看板且未指定名稱時，Chat 會在建立卡片前顯示看板選擇器
- **排隊的後續訊息** – 在答案串流期間傳送更多訊息。排隊的訊息會被保存，可在開始執行前編輯或刪除，並在目前回應完成後依序執行
- **規劃暫停** – 當 Chat 需要規劃細節時，它會提出釐清問題並暫停排隊的後續訊息，直到您回答為止。規劃答案完成後，排隊的訊息會繼續執行
- **Credentials** – 當 Chat 建立或編輯的 Workflow 需要 credential 時，Chat 會詢問要使用哪一組、提供在對話中建立新 credential 的選項，或讓您選擇不使用。您也可以要求 Chat 建立 credential 或更新您擁有的 credential；它會在對話中開啟 credential 表單。模型只會看到 credential 的名稱與類型，永遠不會看到其值，對於您擁有的 credential 以及與您共用的 credential 均是如此。Chat 新增的 LLM 和 Agent 節點會使用為該聊天選取的 credential 與模型運作（包含共用的 credential）；當 Chat 編輯 Workflow 時，其既有的 LLM 與 Agent 節點會保留各自的 credential 與模型。請參閱 [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Dashboards** – 詢問您有哪些[儀表板](./dashboard-tab.md)、某個儀表板上有什麼內容，或者某個 Workflow 位於哪個儀表板上。讓 Chat 向儀表板新增小工具（它會在那裡放置一個空白小工具，然後建置並測試其 Workflow）、將現有 Workflow 作為小工具放入儀表板、重新命名或刪除小工具，或整理儀表板的版面配置。Heym Work 會將這些儀表板顯示為其頁面。請參閱 [Dashboard › 來自 Chat 和 MCP](./dashboard-tab.md#來自-chat-和-mcp)
- **資料表** – 當 Chat 建立或編輯的 Workflow 需要儲存記錄時，Chat 會詢問使用哪個[資料表](./datatable-tab.md)，或建議建立一個包含所需欄位的新資料表。它還可以檢查列、新增或刪除欄位，並直接在您擁有或可編輯的資料表上插入、更新或刪除列。只需向其提供資料表名稱或 DataTable 連結即可。刪除欄位和清除所有列都會要求確認；新增欄位會保留現有資料。請參閱 [AI 助理 › 資料表](../reference/ai-assistant.md#data-tables)
- **串流回應** – 在模型輸出串流時即時查看
- **停止回應** – 隨時中斷目前串流中的答案；停止也會清除該對話中排隊的訊息
- **Markdown 呈現** – 回應支援 markdown 格式，包括內嵌圖片
- **圖片顯示** – 內嵌於回應中的圖片（例如來自 LLM 圖片生成）會以內嵌方式顯示；點擊任何圖片即可全螢幕檢視。按 **Esc** 或返回按鈕（行動裝置）即可關閉全螢幕檢視
- **複製訊息** – 將任何訊息複製到剪貼簿
- **清除聊天** – 開始新的對話
- **語音輸入** – 使用麥克風按鈕進行語音轉文字（瀏覽器支援）。當錄音停止時，Heym 可以在您傳送前稍微清理轉錄文字
- **排程的 Workflows** – 詢問 cron Workflow 何時執行（今天、本週、本月或自訂日期範圍）。助理使用與 [Scheduled](./scheduled-tab.md) 分頁相同的排程資料，並可將結果限制為您擁有的 Workflow 或包含與您共享的 Workflow
- **Workflow 執行歷史** – 詢問關於單一 Workflow 的問題（「每日報告執行了幾次？」、「它有失敗嗎？」、「它上次執行是什麼時候？」）。Chat 會依其 ID 查詢 Workflow，並根據其執行次數、狀態分佈、首次與最後執行時間，以及平均持續時間來回答。詢問某次執行為何失敗或回傳了什麼，Chat 接著會開啟該次執行以讀取其輸入、輸出及每個節點的錯誤
- **執行在何處失敗以及為何緩慢** – 詢問您的 Workflow 在何處失敗或為何緩慢，Chat 會列出執行次數最多、失敗次數最多和最慢的 Workflow，以及耗時最多（每次呼叫平均耗時和總耗時）、失敗次數最多和執行次數最多的節點類型，這些資料與 [Analytics](./analytics-tab.md) 分頁中的數據完全相同。節點類型是從新增節點分析功能的版本開始計算執行情況的。可以詢問過去 1 小時、3 或 6 小時、24 小時、7 或 30 天或所有時間的資料；小時時間範圍從整點開始，因此在 15:20 詢問「過去一小時」涵蓋從 14:00 至今的時間範圍。
- **即時執行狀態** – 詢問目前正在執行什麼，Chat 會回答數量、Workflow 名稱、每次執行已進行的時間、目前所在的節點，以及直接前往該即時執行的連結

- **執行上下文標籤** – [Execution History](../reference/execution-history.md#ask-ai) 中的 **詢問 AI** 會開啟一個新對話，並將選取的 Workflow 執行作為標籤附加。請參閱 [詢問關於執行的資訊](#xun-wen-guan-yu-zhi-xing-de-zi-xun)

## 從 MCP Client 使用 Chat

Chat 引擎也可以從瀏覽器外部存取。在 [MCP / A2A 分頁](./mcp-tab.md)中開啟 **Heym Agent**，MCP 用戶端（Claude、Cursor 以及任何其他支援 MCP 的工具）即可獲得單一 `heym_chat` 工具，執行帶有全部功能的相同引擎。同時勾選 **啟用 A2A**，其他 Agent 即可透過 [A2A](../reference/a2a.md) 向其傳送任務；這些對話在清單中會顯示網路圖示。

這些對話會落在本分頁的歷史記錄中，並在對話清單裡標示為插頭圖示。開啟任一對話即可閱讀用戶端提出的問題、查看它觸發的工具卡片，並由您自己接續該討論串。無論該輪對話是從這裡開始或來自 MCP client，回答釐清問題的方式都相同。

透過 MCP 時，Chat 不會列出、挑選或建立 credentials。它建立的 Workflows 會將 credential 欄位留空，而回覆中會指出需要 credential 的節點，讓您可以在編輯器中設定。

資料表同樣支援透過 MCP 使用：Chat 可以直接編輯欄位和列、建立資料表並將其連接到 Workflow 中。資料表相關的問題和刪除確認會作為結果中的文字提供；使用相同的 `conversation_id` 回覆即可。

## Context 限制

Chat 在 context 中最多保留 25 則近期訊息。較舊的訊息會被裁剪，以維持在模型限制之內。

## 建立 Workflows

當您要求 Chat 建立、建構、產生或設定 workflow 時，它會建立一個新的已儲存 workflow，並附上產生的名稱與描述。回應中會包含所產生節點與邊的唯讀畫布預覽，以及一個 **Open workflow** 連結，會在新的瀏覽器分頁中開啟 workflow 編輯器。當您想執行該 workflow 時，請使用預覽卡片的 **Run** 按鈕。

同一段 chat 中的後續回饋會編輯該 workflow，而不是再建立另一個。例如，在 Chat 建立 workflow 之後，您可以說「add an approval step」、「change the output format」或「şöyle yap」，Chat 就會更新已儲存的 workflow 並重新整理預覽。

這最適合您希望將工作完成為可重複使用自動化的請求，而不只是一次性的答案。

## 建立 Kanban Tasks

以一般語言要求 Chat，例如「Add a task called Fix login bug」或
「Create a new card Update documentation on the Launch board」。您可以在同一個請求中包含
描述。Chat 一律會將卡片建立在所選 board 的第一個欄位中。

如果您的 workspace 有多個 boards，而您未指明其中一個，Chat 會暫停並顯示單選的 board 選擇器。選擇一個 board 以完成建立卡片。不需要 slash command 或特殊訊息格式。

## 查詢目前正在執行什麼

以一般語言詢問 —「what is running?」、「how many workflows are active right now?」、
「which node is the nightly report on?」— Chat 就會回報即時狀況：

- **有多少** executions 正在進行中，區分為執行中與等待人工審查
- 它們**屬於哪些 workflows**，以名稱表示
- 每次執行**已進行多久**（例如 `1m 35s`、`3h 25m`）
- **哪個節點**正在執行中，以其畫布標籤表示，外加最後完成的節點
- **每個執行中 run 的連結**，會開啟畫布並重播該 execution

因 [Human-in-the-Loop](../reference/human-in-the-loop.md) 或 Codex 審查而暫停的 runs 會回報為等待您處理，而非執行中。這與頁首的 active-runs 徽章是相同的資料，因此 Chat 與徽章絕不會不一致。對於已經完成的 runs，請改為查詢近期 executions — 那會讀取 [Execution History](../reference/execution-history.md)。

## 詢問關於執行的資訊

在 [Execution History](../reference/execution-history.md#ask-ai) 中選取一次 Workflow 執行（可從編輯器或 All History 中選取），然後點擊對話框標題旁的 **詢問 AI**。Chat 會開啟一個新對話，並在訊息輸入框上方顯示兩個標籤：

- **Workflow:** Workflow 的名稱
- **Execution:** 所選執行 ID 的前幾個字元

點擊標籤的 **×** 即可將其移除。然後輸入您的問題，例如「為什麼這次執行耗時這麼長？」、「這裡失敗的原因是什麼？」或「你能修復它嗎？」。剩餘的標籤將附帶完整 ID 附加到該訊息中，以便 Chat 直接讀取執行的輸入、輸出以及各節點的追蹤記錄，而無需搜尋該 Workflow。如需修復 Workflow，Chat 會儲存、測試執行並驗證變更，如 [建立 Workflow](#jian-li-workflow) 中所述。

傳送的訊息會在您的問題下方顯示這些標籤。它們僅屬於該訊息；同一對話中的後續問題會保留歷史記錄中的上下文。

## 查詢 Alerts

Chat 可以回答關於您已定義的 [alerts](./alerts-tab.md) 的問題：

- **有哪些存在** —「what alerts do I have?」、「is there an alert on the invoice workflow?」、
  「which alerts are firing right now?」
- **某個 alert 如何設定** —「what is the threshold on the cost alert?」、「how is that configured?」
- **它為何及何時觸發** —「why did the cost alert fire?」、「when did this last trigger?」

對於「why did it fire」的問題，Chat 會讀取觸發記錄，並引用實際觀察到的值、閾值，以及所評估的確切時間範圍，外加相關細節：error alerts 的失敗 execution ids 與錯誤訊息、cost alerts 的各模型支出，或 execution-count alerts 的 trigger-source 明細。它會回報 alert 觸發時為真的事實，而不是重新計算時間範圍，因為該時間範圍已經過去，重新計算可能得到不同的答案。

## User Rules

[User Rules](../reference/user-settings.md)（在 Settings 中設定）會自動以系統層級指示注入每一段 Chat 對話。設定一次即可將持續性偏好套用至所有 chat 請求。

## 使用 Evals

Chat 可以建立、修改和執行 [Evals](./evals-tab.md) 中的套件，包括 Prompt 套件和 Agent 套件：

- **Prompt 套件**：「為我的支援回覆 Prompt 建立一個包含 8 個測試用例的 Prompt 套件，並比較 gpt-4o 與 gpt-4.1-mini」。Chat 會撰寫帶有預期答案的測試用例，選擇評分方法並儲存套件。
  - 在建立套件之前，它會確認使用哪個 LLM 憑證和模型。如果只有一個 LLM 憑證，它會直接使用並說明；否則會詢問。
  - 對於 LLM-as-Judge 評分，它還會詢問是否應由單獨的裁判評估答案。
- **Agent 套件**：「檢查我的支援 Agent 是否一律搜尋文件且從不傳送電子郵件」。Chat 會找到該 Agent 並儲存工具檢查項目和臨界值。當您要求時，它會執行 Workflow，為每次執行產生不同的輸入。
  - Agent 套件的執行是實際的 Workflow 執行，因此其實際副作用會發生。Chat 會說明它啟動了多少次執行。
  - **Baseline**：Chat 可以透過三種方式處理 Agent 的基準線：
  - 根據該 Agent 的最新執行記錄進行回報。
  - 根據它啟動的執行進行建置（「執行 5 次並將該結果作為 baseline」）。
  - 儲存您提供的數值（「將 baseline 設定為 3 秒 p95，每次執行 0.01 美元」）。
- **執行**：Chat 最多等待一分鐘以完成一次執行，然後回報結果：
  - 對於 Prompt 套件：每個模型的通過次數以及失敗的用例。
  - 對於 Agent 套件：通過率、失敗的檢查項目以及與基準線的偏差。
  - 耗時更長的執行會在 Evals 中繼續進行；可以要求 Chat 再次進行檢查。

Chat 建立或變更套件後，回覆會顯示一張卡片，其中包含套件名稱、類型和 **在 Evals 中開啟** 按鈕，就像已儲存 Workflow 的卡片一樣。透過 MCP，`heym_chat` 結果會列出該次呼叫中儲存的每個套件的連結。

透過 `heym_chat` 從 MCP 用戶端執行相同操作也是如此（請參閱 [從 MCP 用戶端使用 Chat](#從-mcp-用戶端使用-chat)）。評估工具保留在 `heym_chat` 內部；MCP 用戶端不會將它們視為個別的工具。

編輯器的 AI 助理不會建立套件。

## 使用 Evals

Chat 可以建立、修改和執行 [Evals](./evals-tab.md) 中的套件，包括 Prompt 套件和 Agent 套件：

- **Prompt 套件**：「為我的支援回覆 Prompt 建立一個包含 8 個測試用例的 Prompt 套件，並比較 gpt-4o 與 gpt-4.1-mini」。Chat 會撰寫帶有預期答案的測試用例，選擇評分方法並儲存套件。
  - 在建立套件之前，它會確認使用哪個 LLM 憑證和模型。如果只有一個 LLM 憑證，它會直接使用並說明；否則會詢問。
  - 對於 LLM-as-Judge 評分，它還會詢問是否應由單獨的裁判評估答案。
- **Agent 套件**：「檢查我的支援 Agent 是否一律搜尋文件且從不傳送電子郵件」。Chat 會找到該 Agent 並儲存工具檢查項目和臨界值。當您要求時，它會執行 Workflow，為每次執行產生不同的輸入。
  - Agent 套件的執行是實際的 Workflow 執行，因此其實際副作用會發生。Chat 會說明它啟動了多少次執行。
  - **Baseline**：Chat 可以透過三種方式處理 Agent 的基準線：
  - 根據該 Agent 的最新執行記錄進行回報。
  - 根據它啟動的執行進行建置（「執行 5 次並將該結果作為 baseline」）。
  - 儲存您提供的數值（「將 baseline 設定為 3 秒 p95，每次執行 0.01 美元」）。
- **執行**：Chat 最多等待一分鐘以完成一次執行，然後回報結果：
  - 對於 Prompt 套件：每個模型的通過次數以及失敗的用例。
  - 對於 Agent 套件：通過率、失敗的檢查項目以及與基準線的偏差。
  - 耗時更長的執行會在 Evals 中繼續進行；可以要求 Chat 再次進行檢查。

Chat 建立或變更套件後，回覆會顯示一張卡片，其中包含套件名稱、類型和 **在 Evals 中開啟** 按鈕，就像已儲存 Workflow 的卡片一樣。透過 MCP，`heym_chat` 結果會列出該次呼叫中儲存的每個套件的連結。

透過 `heym_chat` 從 MCP 用戶端執行相同操作也是如此（請參閱 [從 MCP 用戶端使用 Chat](#從-mcp-用戶端使用-chat)）。評估工具保留在 `heym_chat` 內部；MCP 用戶端不會將它們視為個別的工具。

編輯器的 AI 助理不會建立套件。

## 相關

- [MCP / A2A Tab](./mcp-tab.md) – 將此引擎以 `heym_chat` 工具的形式暴露給 MCP 用戶端
- [Settings](../reference/user-settings.md) – 設定套用於所有聊天請求的 User Rules
- [Credentials Tab](./credentials-tab.md) – 新增與管理 API keys
- [Variables Tab](./global-variables-tab.md) – 可供 Chat 使用的全域變數
- [Node Types](../reference/node-types.md) – 用於 Workflow 的 LLM 與 Agent 節點
- [Agent Node](../nodes/agent-node.md) – 具備工具呼叫能力的 AI Agent
- [AI Assistant](../reference/ai-assistant.md) – 由相同 workflow builder DSL 驅動的編輯器助理
- [Execution History](../reference/execution-history.md) – 檢視過往執行紀錄（標題列中的 History 按鈕）
- [Scheduled Tab](./scheduled-tab.md) – 即將執行的 cron 排程行事曆（與 Chat 可彙總的資料相同）
- [Alerts Tab](./alerts-tab.md) – Chat 可列出並說明的閾值警示
- [Contextual Showcase](../reference/contextual-showcase.md) – 此頁面的精簡版應用內導引
- [Chat Voice (TTS & STT)](../reference/chat-voice.md) – 透過 ElevenLabs 朗讀訊息並進行免持對話

## 工具呼叫與上下文大小

每當助理呼叫工具（執行 Workflow、列出執行紀錄、建立新的 Workflow）時，對話中會出現一張可折疊的卡片。工具執行期間卡片會自動展開，顯示確切的引數。工具執行完畢後，卡片會折疊為單行摘要並顯示經過時間。點擊任一卡片即可重新展開引數與回應摘要。

輸入框下方的小型環狀標記會顯示目前的上下文使用量，以模型視窗的百分比表示（例如 `12% · ~9.2k`）。將游標停留在標記上即可查看明細：system prompt、AGENTS.md、workflows block、user rules、history，以及您草稿中的輸入內容。當使用量超過 80% 時，環狀標記會轉為琥珀色；達到 95% 時則轉為紅色。

若使用量接近上限，Heym 會使用與 Agent 節點相同的機制，自動將較舊的訊息壓縮為簡短摘要。對話中會出現一張「Context compressed」卡片，顯示所發生的情況。

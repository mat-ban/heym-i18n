# AI 助手

**AI Assistant** 是從 Debug panel 開啟的聊天面板，起始位置在編輯器的右下角。拖曳標題列可移動面板，拖曳邊緣或角落則可調整其寬度或高度。面板不會縮小至低於 360×480 像素。位置與大小會記憶在此瀏覽器中。標題列中的 **Reset position and size** 會將面板移回右下角。使用自然語言來建立或修改 Workflow——描述你想要的内容，AI 便會產生節點與邊並套用至畫布。

若需編輯器以外的文件相關問題，請使用 [Chat with Heym](./chat-with-heym.md)。該介面針對頁面感知的產品說明進行了最佳化，而非用於產生 Workflow。

## 開啟面板

1. 在編輯器中開啟一個 Workflow
2. 找到底部的 **Debug panel**（執行結果區域）
3. 點擊面板工具列中的 **AI** 按鈕（Sparkles 圖示）
4. AI Assistant 面板會在右下角開啟。拖曳其標題列可移動面板，或拖曳邊緣或角落以調整其寬度與高度。

在編輯器中的任何位置按下 `Ctrl + I` / `Cmd + I` 即可開啟或關閉面板——即使焦點位於文字輸入框內，此快捷鍵仍可運作。請參閱 [Keyboard Shortcuts](./keyboard-shortcuts.md)。

要對單個節點進行操作，請在畫布上懸停在該節點上並點擊其上方的 **AI**。面板將聚焦於該節點打開。請參閱[修改單個節點](#changing-one-node)。

## 關閉面板

點擊 **X** 按鈕、按下 `Ctrl + I` / `Cmd + I`，或切換 Debug panel 工具列中的 **AI** 按鈕。標題列用於拖曳面板，並不會關閉面板。

## 設定

傳送訊息前，請先選擇：

| 設定 | 說明 |
|---------|-------------|
| **Credential** | 來自 [Credentials](../tabs/credentials-tab.md) 的 LLM 認證（API key） |
| **Model** | 模型名稱（例如 `gpt-4o`、`gemini-2.5-flash`） |

在 [Credentials Tab](../tabs/credentials-tab.md) 中新增認證。模型清單會從所選的認證載入。

## Agent Mode 與 Ask Mode

面板有兩種模式，可透過面板標題列中的 **Agent / Ask** 切換鈕切換。

| 模式 | 預設 | 行為 |
|------|---------|-----------|
| **Agent** | ✓ | 建立並修改畫布。AI 會產生一個 Workflow JSON 區塊，並在回應完成時自動套用至畫布。 |
| **Ask** | | 僅回答問題。絕不會更動畫布。當你想詢問關於你的 Workflow、Heym 功能，或在不觸發畫布更新的情況下取得建議時，請使用此模式。 |

可隨時切換模式。變更模式不會清除對話。

在 Agent 模式下，訊息欄位下方的 **YOLO mode** 核取方塊會讓助理執行並修正它所建立的內容。請參閱 [YOLO Mode](#yolo-mode)。

## 使用聊天

- 在輸入框中輸入你的需求（例如「建立一個接收使用者輸入並將其傳送至 LLM 的 Workflow」）
- 按下 **Enter** 傳送（Shift+Enter 換行）
- AI 會串流其回應。在 **Agent** 模式下，若回應中包含 \`\`\`json 程式碼區塊中的 Workflow，便會自動解析並套用至畫布。在 **Ask** 模式下，畫布絕不會被修改。
- 使用 **Clear** 重設對話
- 將游標停留在訊息上並點擊其複製圖示，即可複製該訊息顯示的文字，包括任何 Workflow JSON
- 拖曳訊息框上方的線條可將訊息框加高。輸入區域最高可增長至面板的 60%，並在頁面重新載入時回復為預設高度

## Workflow 自動套用

當 AI 回應中包含有效的 Workflow JSON 區塊（含有 `nodes`，以及選用的 `edges`）且位於 \`\`\`json 程式碼區塊中時，Heym 會：

1. 從回應中解析 JSON
2. 以新的節點與邊取代目前的畫布
3. 整理節點版面配置
4. 將 Workflow 標記為未儲存

若解析失敗，會出現 **Retry** 按鈕以重新產生回應。

## 修改單個節點

在畫布上將滑鼠懸停在節點上，然後點擊其上方的 **AI**。面板以 Agent 模式打開，聚焦於該節點，並顯示其正在修改的節點：

| 節點狀態... | 面板顯示 |
|---|---|
| 當前運行中沒有結果 | **Modifying Node:** 在緊湊的一行中顯示節點的圖標和名稱。助手僅根據節點的配置進行編輯；如果需要查看輸出，請先運行該節點 |
| 當前運行中有結果 | **Modifying Node: (Has Node Output)** 位於節點本身上方：圖標、名稱和類型、上次狀態和持續時間，以及失敗時的錯誤資訊。助手在編輯節點時可以看到該輸出和錯誤 |

將滑鼠懸停在標籤上以查看面板處於哪種狀態。

無論面板處於哪種狀態，助手還會讀取節點標頭中書本圖標後面的節點文檔頁面。它使用該頁面來了解節點的選項並回答有關它們的問題。

在訊息下方，三個選項可啟動請求：

| 選項 | 作用 |
|---|---|
| **Change this node as ...** | 在訊息框中填入 *將此節點更改為*，以便您補全句子 |
| **Fix error in this node ...** | 填入 *修復此節點中的錯誤。* 助手將讀取此節點在上次運行中的錯誤 |
| **Other** | 聚焦到空白訊息框 |

編輯文本並按 **Send**。助手僅返回此節點，Heym 會就地對其進行更新：節點保留其 id、類型和名稱，因此其他節點中諸如 `$checkLinkedIn.result` 之類的表達式仍可正常工作。其他節點、連接和佈局保持不變，並且 **Undo** 可恢復之前的配置。

如果請求無法在節點內容納，例如需要另一種節點類型或新節點，助手會指出需要更改的內容，而不是進行編輯。點擊節點卡片上的 **X** 關閉節點聚焦即可重新編輯整個工作流。關閉面板也會清除聚焦。

[YOLO 模式](#yolo-mode)適用於聚焦節點：助手更改該節點，運行工作流並修復該節點，直到運行通過。在 **Ask** 模式下，聚焦會告訴助手您的問題涉及哪個節點，且畫布不會被更改。

## YOLO Mode

**YOLO mode** 讓助理測試它所建立的內容。勾選訊息欄位下方的 **YOLO mode** 核取方塊，然後傳送你的需求。此核取方塊僅在 Agent 模式下顯示。它預設為關閉，並在頁面重新載入時回復為關閉。將游標停留在其旁邊的資訊圖示上可查看簡短摘要。

開啟 YOLO mode 後，助理在套用 Workflow 之後不會停止：

1. 它會將 Workflow 套用至畫布。
2. 在第一次執行之前，它會要求測試輸入。卡片會列出該 Workflow 的輸入欄位，並填入助理建議的值。編輯這些值並按下 **Run**。之後的執行會重複使用這些值。只有在輸入欄位變更，或助理需要不同的測試資料時，卡片才會再次出現。
3. 它會完全如同 **Run** 按鈕一般在畫布上執行 Workflow：未儲存的變更會先儲存、節點會亮起，且該次執行會出現在 Debug panel 與 [Execution History](./execution-history.md) 中。
4. 它會讀取結果。若該次執行達成你的要求，便會以 **Verified** 與簡短摘要結束。若否，則會修正 Workflow 並再次執行。

每則訊息最多執行 **5 次**。可隨時按下 **Stop** 結束迴圈並停止進行中的執行。

每個回覆會即時顯示其步驟：
- `Applying changes to canvas`；
- `Running workflow · attempt 2/5`，並為每個節點顯示一列 `Executing <node>`；
- 最終判定結果。

每次執行後，會顯示一行簡短文字，例如 *Attempt 1 result sent · error in 1.2s*，表示結果已傳回給助理。
### 執行您的其他 Workflow

在 YOLO 模式下，當助理需要其他 Workflow 的結果時，也可以執行這些 Workflow。例如，它可以在從 [Execute](../nodes/execute-node.md) 節點呼叫某個 Workflow 之前，先檢查該 Workflow 會回傳什麼。這些執行會顯示為 `Running workflow "<name>"...` 步驟，並以觸發來源 `ai_assistant` 記錄於 Execution History 中。正在編輯的 Workflow 一律會在畫布上進行測試。

### 提前停止的情況

| 情況 | 會發生什麼事 |
|---|---|
| 助理需要一項決策、資訊、認證或資料表 | 它會透過常見的問題卡片詢問。回答後即繼續迴圈。 |
| 執行等待[人工審查](./human-in-the-loop.md) | 迴圈停止。核准審查後，再傳送訊息。 |
| Workflow 等待檔案上傳 | 迴圈停止。YOLO 模式無法測試由上傳觸發的執行。 |
| Workflow 的較新版本已在其他地方儲存 | 迴圈停止。解決儲存衝突後，再傳送訊息。 |

> **執行是真實的。** Workflow 中的電子郵件、訊息與 API 呼叫在每次嘗試時都會實際送出，DataTable 節點也會寫入真實的資料列。每次執行都會儲存 Workflow，因此先前的版本會保留在 [Edit History](./edit-history.md) 中。

## 語音輸入

在支援的瀏覽器上，**Voice** 按鈕可啟用語音轉文字功能。點擊開始錄音，再次點擊停止。轉錄出的文字會先傳送給 AI 進行文法修正，然後才由您送出。

## Agent 節點與 AI Assistant

| | Agent 節點 | AI Assistant |
|---|------------|---------------|
| **用途** | Workflow 內部的 LLM 節點；在執行期間運行 | 以自然語言建構 Workflow 的聊天 UI |
| **位置** | 畫布節點 | 除錯面板 → 浮動面板 |
| **時機** | 執行期間 | 編輯期間 |

關於以工具與 MCP 執行 LLM 呼叫的 Workflow 節點，請參閱 [Agent 節點](../nodes/agent-node.md)。

## 運作方式（AI Builder DSL）

AI Assistant 由一套 **workflow DSL**（領域特定語言）驅動，用以描述節點、邊與表達式。當您傳送訊息時：

1. 您的訊息、[User Rules](./user-settings.md) 以及目前的 Workflow（若有）會傳送至後端。
2. 後端會建構一個 **system prompt**，其中包含：
   - 完整的 workflow DSL（節點類型、表達式語法、規則、範例）
   - 附加為「User Custom Rules」的您的 User Rules
   - 當您正在編輯既有 Workflow 時，目前的 Workflow JSON
   - 當您使用 Execute 節點時，可用的 Workflow 清單
   - 您自有認證的名稱、類型與 id（絕不包含其值）
   - 您可使用的資料表的名稱、id、描述與欄位（絕不包含其資料列）
3. 模型會回傳單一 workflow JSON 區塊（包含 `nodes` 與 `edges`）。前端會解析它並套用至畫布。

### 認證

當 Workflow 需要認證時，助理會在建構之前先詢問。若您擁有合適類型的認證，它會列出這些認證以及 **Create a new credential**；若您沒有任何認證，它會詢問是否要建立一個。每個問題也都可讓您選擇在沒有認證的情況下繼續。

選擇建立認證會在面板中開啟認證表單，並預設為正確的類型與建議的名稱。這些值會直接傳送至 Heym；助理只會得知名稱與類型。OAuth 認證（Google Sheets、Google Drive、BigQuery、Linear、Notion）會在彈出視窗中連線，若彈出視窗被封鎖，也會顯示授權頁面的連結。認證儲存後，卡片會顯示其名稱，且建立按鈕會關閉；按下 **Submit answers**，助理就會將新的認證放到節點上。

您也可以單獨要求建立認證（「create a GitHub credential」），或要求變更您擁有的認證（「update my sheet credential」、「reconnect my Google Sheets」）。助理會以相同的卡片回應：建立會開啟空白表單，更新則會開啟該認證的表單，並將其機密資訊遮蔽。

助理偏好使用專用節點。當沒有節點涵蓋某項操作時，例如在 Google Sheet 中新增工作表，它會使用 HTTP 請求，並為所選的認證寫入標頭行。請參閱 [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials)。

Workflow 在缺少這些資訊也能運作的情況下，其釐清問題會在輸入中標示 **Optional**，且可略過。

DSL 強制使用 camelCase 標籤、統一的表達式規則，以及各節點專屬的欄位。若欄位值是單一的 `$expr`，後端會保留原生類型；若該值混合了文字與 `$refs`，結果則為字串。單一 `$` 規則仍然適用：括號內不得有 `$`。[Settings](./user-settings.md) 的 User Rules 會注入此 system prompt，因此您的偏好設定會套用至每個 AI 產生的 Workflow。

若目前的 Workflow 包含 Agent skills，AI Assistant 在該 Workflow 情境中只會納入每個 skill 的 `SKILL.md`。附加的 `.py` 檔案與二進位 skill 資產會在請求前被移除，因此即使 skill 包含大型實作，builder 仍能維持在模型情境限制之內。
### 資料表

當 Workflow 儲存、存放或查詢記錄，而你尚未指定其他儲存位置時，助理會使用 [DataTable](../nodes/datatable-node.md) 節點。若你為其中一個資料表命名，且該資料表具備 Workflow 所需的欄位，助理便會使用它。否則，助理會詢問要使用哪個資料表。卡片會列出符合的資料表，每張表都附有說明與欄位類型，另外還有 **Create a new table**，並附上建議的名稱與欄位。與你共用的資料表也會一併提供；若你僅有讀取權限，則該表僅供讀取。

選擇新資料表並按下 **Submit answers**：卡片會建立該資料表，助理會將其 id 放到節點上，並使用其確切的欄位名稱。你也可以單獨要求建立資料表，例如「create a table for my leads」。

助理能看到資料表名稱、說明與欄位，但永遠看不到資料列。它永遠不會變更現有資料表的欄位：若某個資料表缺少 Workflow 所需的欄位，它會指出該欄位並改為提供新的資料表。請在 [DataTable tab](../tabs/datatable-tab.md) 中新增欄位。

## Related

- [Why Heym](../getting-started/why-heym.md) – 以自然語言建構作為 Agent 生命週期的第一階段
- [Quick Start](../getting-started/quick-start.md) – 建構你的第一個 Workflow
- [Settings](./user-settings.md) – 注入至 AI Assistant 系統 Prompt 的使用者規則
- [Chat with Heym](./chat-with-heym.md) – 文件區域內可感知頁面的助理
- [Core Concepts](../getting-started/core-concepts.md) – Workflow、節點與執行流程
- [Agent Node](../nodes/agent-node.md) – 具備工具與 MCP 的 LLM 節點
- [Credentials Tab](../tabs/credentials-tab.md) – 為 AI Assistant 新增 API 金鑰
- [Workflow Structure](./workflow-structure.md) – Workflow 的 JSON 格式

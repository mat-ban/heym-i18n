# Dashboard

**Dashboard** 分頁是一個 Grafana 風格的空間，您可以在其中建立圖表小工具的網格。每個小工具都是從其專屬的隱藏 Heym Workflow 輸出所渲染，因此您能在 Workflow 中產生的任何資料——資料庫查詢、API 呼叫、RAG 查找、LLM 輸出——都能成為圖表。您可以保留多個 Dashboard，並將每個 Dashboard 分享給人員或團隊。

## Dashboards

每個人在首次開啟此分頁時都會建立一個 Dashboard。使用分頁頂端的 Dashboard 選擇器即可切換不同 Dashboard，並使用其旁邊的 **+** 建立新的 Dashboard。選擇器會先列出您自己的 Dashboard，再列出分享給您的 Dashboard，並標示分享者的名稱。

此分頁會重新開啟您上次使用的 Dashboard，且網址列會帶有目前開啟的 Dashboard（`?tab=dashboard&dashboard=<id>`），因此連結會為任何有存取權的人開啟該特定 Dashboard。

設定按鈕（僅限擁有者）可重新命名 Dashboard、設定其作為[詳細資料頁面](#detail-pages)時所接受的記錄格式、管理分享，以及刪除 Dashboard。刪除 Dashboard 會移除其小工具及對應的 Workflow。您始終會保留至少一個自己的 Dashboard，因此最後一個無法被刪除。

## Widgets

小工具是網格上的單一圖表。支援的圖表類型如下：

- **Bar**（垂直或水平）
- **Line**
- **Area**（填滿的趨勢圖，支援多個數列）
- **Pie**
- **Table**（可滾動；點擊欄標題可遞增排序，再次點擊可遞減排序。一欄可以渲染為 [狀態標籤](../nodes/chart-output-node.md#status-chips)，一欄可以包含在網頁新分頁中開啟 URL 的 [連結按鈕](../nodes/chart-output-node.md#link-buttons)，資料列可以開啟 [詳細資料頁面](#xiang-xi-zi-liao-ye-mian)）
- **Numeric**（單一 KPI 值，可選單位）
- **Gauge**（單一數值對應最小–最大範圍，例如百分比）
- **Scatter**（用於相關性繪圖的 X/Y 點）
- **Proportion**（單一長條分割為多個佔比，並附百分比圖例，例如語言分佈）
- **Bar gauge**（每列一個水平量測條，搭配紅→綠漸層與數值，例如可用磁碟空間）
- **Text**（markdown 訊息，例如「Last execution at 19:47」這類狀態備註；當 markdown 為靜態時支援[互動式核取方塊](../nodes/chart-output-node.md#interactive-task-lists)，並支援[明確編號清單](../nodes/chart-output-node.md#numbered-lists)以自訂或遞減編號）
- **HITL**（您待處理的人工審核。標題會顯示 `1/n pending`。Workflow 名稱會於畫布上開啟該次執行。**Approve**、**Request changes** 與 **Reject** 可解決該項目。小工具標題旁的歷史圖示會於此頁面的歷史對話框中開啟該次執行。此小工具不使用上游資料列，且每個人只會看到自己的佇列。 也可以改為顯示單一 Workflow 的審查，面向所有能夠開啟該 Workflow 的人員；請參閱 [HITL 元件](#hitl-yuan-jian)）

除了圖表之外，**Run a workflow** 小工具還能直接從 Dashboard 執行您的其中一個 Workflow：透過拖放檔案、填寫其輸入欄位，或點擊 Run 按鈕；請參閱[執行類小工具](#run-widgets)。

每個小工具會在您開啟分頁時非同步載入資料，因此圖表填入資料的同時頁面仍保持回應。

## 新增小工具

1. 點擊 **Add widget**，為其命名並選擇圖表類型。在選擇器下方，對話框會以範例資料繪製該圖表類型的範例，並列出其預期的資料列，讓您在建置任何內容前先比較各類型。
2. 小工具會在 Workflow 編輯器中開啟，並附帶起始圖形：一個產生資料列的 [Set](../nodes/set-node.md) 節點，連接到一個 [Chart Output](../nodes/chart-output-node.md) 節點。將 Set 節點替換為任何資料來源。**HITL** 小工具僅有 Chart Output 節點；它會讀取您待處理的審核，不需要資料來源。
3. 建置 Workflow，使饋入 **Chart Output** 的節點產生資料列陣列，然後設定 Chart Output 節點的欄位對應（標籤欄位、數值欄位等）。
4. 儲存、返回 Dashboard 分頁，小工具便會渲染。

若是 **Run a workflow** 小工具，請改為選擇它要執行的 Workflow；選擇器會說明小工具將如何執行各個 Workflow。小工具會直接加入網格中，無須建立新的 Workflow。

隨時雙擊小工具（或使用其編輯按鈕）即可重新開啟其 Workflow。使用小工具標題中的 **Clone widget** 可同時複製小工具及其完整 Workflow。複本會置於原始項目下方，並標示 **(Copy)**，讓您能獨立編輯。

## HITL 元件

新的 HITL 元件會顯示您自己佇列中等待的每項審查。若要僅顯示特定 Workflow 的審查，請開啟該元件的 **設定**：

1. 在 **Workflow** 下選取對應的 Workflow。清單中包含您可以開啟的 Workflow（您擁有的，或與您或您的團隊共享的），且該 Workflow 具有等待人員處理的步驟：帶有人工審查的 Agent，或 Slack 審批、按鈕或表單步驟。旁邊的圖示將在新分頁中開啟該 Workflow。
2. 如果該 Workflow 剛好只有一個此類步驟，系統會自動選取該步驟。如果包含多個，**Select agent** 會按節點名稱列出它們，並將 **All agents** 置於首位；Slack 步驟帶有 **(Slack)** 標記。
3. 儲存。標題中的 `1/n pending` 僅統計這些審查。選取 **所有 Workflow** 可重新顯示您自己的佇列。

畫布上 Chart Output 節點的屬性中也提供相同的選項。**使用 AI 微調** 也可以完成設定（「僅顯示發票審批」），在描述新元件時指明 Workflow 同樣可以生效。每次變更都屬於 Workflow 編輯，因此會記錄在 Edit History 中。

- **誰可以看到審查。** 按 Workflow 篩選的元件會向所有能夠開啟該 Workflow 的人員顯示其審查，他們可以在元件中執行審批、要求變更或拒絕操作，就像他們可以執行該 Workflow 一樣。未篩選的元件則向每位使用者顯示其自己的佇列。
- **誰可以看到元件。** 無法開啟所選 Workflow 的人員根本看不到該元件，即使在與其共享的儀表板上也同樣不可見。當儀表板的擁有者失去對該 Workflow 的存取權限或該 Workflow 被刪除時，擁有者會看到「You no longer have access to the workflow this widget shows」，並可以在 **設定** 中另選一個。
- **僅可選取具備權限的項目。** 儲存元件時，無法開啟的 Workflow 將被拒絕，無論該操作來自設定、畫布還是 AI。

## 詳細資料頁面

表格小工具可將其資料列連結至另一個 Dashboard，使後者作為詳細資料頁面運作：由同一個 Dashboard 服務每一位客戶、每一張發票或每一張工單。

1. 開啟表格小工具的 **Settings**，並在 **Row link** 下方選擇目標 Dashboard。
2. 輸入 **Record column**（其值可用來識別該列的欄位，例如 `id`），並可選擇性輸入用來命名的 **Label column**（例如 `name`）。
3. 儲存。點擊某一列（或將焦點移至該列並按 Enter）即可開啟帶有 `?record=<value>&label=<name>` 的連結 Dashboard。

在詳細資料 Dashboard 上，每個小工具的 Workflow 都會將該值讀取為 `$page.record`（請參閱 [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)），且頁面會在網格上方顯示 `Dashboard / <label>` 以及清除記錄的按鈕。點擊返回即可回到原本的表格。

- **誰可以開啟。** 只有有權開啟連結 Dashboard 的檢視者才能點擊資料列。其他人會看到相同的表格，但不含連結。
- **記錄格式。** 記錄來自 URL，因此由詳細資料 Dashboard 決定接受哪些內容。在其設定中，**Detail page records** 為下列其中一種：ID（字母、數字、`-`、`_` 與 `.`，最多 128 個字元；預設值）、數字、UUID 或電子郵件地址。任何其他值都會在小工具執行前被拒絕，且小工具會顯示「This page does not accept that record」。
- **仍以擁有者身分執行。** 在詳細資料頁面上，小工具同樣會以 Dashboard 擁有者的身分執行。建立者應僅在節點會將該值進行跳脫（escape）的位置傳入 `$page.record`，切勿直接放入查詢文字中。
- **快取。** 每個小工具會依記錄快取其圖表，存活時間（TTL）與小工具相同，並保留最近使用過的 50 筆記錄。

## 執行類小工具

**Run a workflow** 小工具會執行您的其中一個 Workflow 並顯示結果：狀態、執行時間與輸出。顯示的內容取決於該 Workflow 所需的輸入：

- **檔案。** 對於以 [File Upload Trigger](../nodes/file-upload-trigger-node.md) 開頭的 Workflow，將檔案拖放到小工具上（或點擊以選取檔案），小工具便會透過該 Trigger 的一次性上傳連結上傳檔案。小工具會顯示 Trigger 接受的檔案類型與大小，並在上傳前拒絕其他檔案。當 Workflow 同時也以 Text Input 節點開頭時，小工具會在拖放區旁顯示其欄位：選擇檔案、填寫欄位後，點擊 **Run** 會一併送出兩者。這些值會隨小工具產生的上傳連結一起傳送，因此共用的上傳連結無法設定它們。
- **輸入欄位。** 對於以 Text Input 節點開頭的 Workflow，小工具會顯示其欄位與預設值；點擊 **Run** 會以您輸入的值執行 Workflow。Workflow 中不存在的欄位值會被捨棄。
- **無輸入。** 沒有輸入的 Workflow 會顯示一個 **Run** 按鈕。

結果區域的 **Wrap** 按鈕會在方框內將過長的輸出行自動換行；關閉此功能即可閱讀輸出的 JSON 版面配置。

- 任何能夠開啟該 Dashboard 的人都可以執行此小工具，就像任何人都能重新整理圖表一樣。Workflow 的存取權限屬於 Dashboard 擁有者：新增小工具需要一個您與擁有者都能執行的 Workflow，而執行本身會使用 Workflow 擁有者的憑證，就如同任何上傳連結。
- 結果會保留在您的畫面上，直到您離開頁面為止；其他檢視者不會看到您的檔案、輸入值或結果。該次執行會在執行歷史記錄中顯示為 `dashboard` Trigger。
- 共用 Dashboard 絕不會授予對 Workflow 本身的存取權。**Edit workflow** 僅會為原本就具備存取權的人員開啟該 Workflow，且不提供 **Fine-tune with AI**。
- 檔案執行會與所有 File Upload Trigger 執行一樣，在儲存上傳檔案的主執行個體（main instance）上執行。

## 使用 AI 產生小工具

點擊 **AI**，描述您想要的指標（例如「workflow success rate over the last 30 days as a bar chart」），然後選擇 LLM 認證與模型。Heym 會產生一個以 Chart Output 節點結尾的完整小工具 Workflow，並將其加入網格。各圖表類型的範例 Prompt 請參閱 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)。

元件會以您請求的語言獲得一個包含一兩個詞的簡短標題，例如「未結案件」。標題絕不包含資料表的 ID；如果模型用完整句子為元件命名，Heym 會保留其前幾個詞。

元件 API 也可以在不使用 AI 的情況下建立 **計數卡片**：資料表 (`data_table_id`) 上帶有 `count_column` 和 `count_value` 的 `text` 元件可以顯示具有該值的列數；元件標題指明該值。Heym Work 會在基於資料表建立的頁面頂端為每個狀態放置一張計數卡片。

使用小工具的 **Fine-tune with AI** 按鈕，即可透過新指令修訂現有小工具。每次 AI 微調都會將先前的 Workflow 快照至小工具的 **Edit History**，因此您可以在 Workflow 編輯器中檢閱或還原變更。

## 編輯版面配置

切換 **Edit** 以進入編輯模式，您可以在 12 欄網格上拖曳小工具並調整其大小。版面配置變更會自動儲存。小工具標題可從小工具標題列就地編輯。

## 快取與重新整理

每個小工具會將其上次計算的資料快取於伺服器上，並具有可設定的存活時間（TTL）。當快取仍新鮮時，重新開啟 Dashboard 會提供已儲存的結果，而不會重新執行 Workflow。每次重新計算資料時，快取會就地取代（每個小工具一個快取，外加[詳細資料頁面](#detail-pages)上每筆記錄一個快取），且當您編輯小工具的 Workflow 時會自動失效。

使用小工具的 **Refresh** 按鈕（或工具列中的 **Refresh**）可略過快取並立即重新計算。

## 共用

擁有者可在 dashboard 的設定中將其共用給個別使用者（透過 email）或其所屬的任何 [team](teams-tab.md)。每筆共用權限為 **Read** 或 **Write**；當某人同時擁有個人與 team 的共用權限時，以較高權限者為準。

| 操作 | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| 檢視 widget、重新整理、使用自動重新整理 | ✓ | ✓ | ✓ |
| 開啟詳細資料頁面、執行執行類小工具 | ✓ | ✓ | ✓ |
| 新增、複製、刪除、重新命名及調整 widget 大小；AI 生成與微調；勾選 checklist 項目 | ✓ | ✓ | |
| 在編輯器中開啟 widget 的 workflow | ✓ | ✓ | |
| 重新命名或刪除 dashboard、設定其記錄格式、管理共用設定 | ✓ | | |

**Widget 一律以 dashboard 擁有者的身分執行。** 無論檢視者是誰，widget 均使用擁有者的 credentials 與全域變數，其執行紀錄也會出現在擁有者的執行歷史與 traces 中。因此，team 成員無需存取背後的帳號即可看到相同資料，且每位檢視者共用每個 widget 的同一份快取結果。Write 協作者所新增或複製的 widget 同樣歸屬於擁有者。

因此，**Write** 所承載的信任程度等同於將 workflow 共用供他人編輯：擁有 write 權限的協作者可以變更以您的 credentials 執行的內容。請僅將此權限授予您願意讓其編輯您 workflow 的人員。協作者從 workflow 編輯器啟動的測試執行會使用其自身的 credentials，與任何共用 workflow 的情況相同；僅有 dashboard 本身以擁有者的身分執行。**Read** 不授予任何 widget workflow 的存取權，唯讀檢視者會收到圖表本身，但不會取得其背後的逐節點執行細節。

移除共用權限，或將其從 write 降為 read，會立即生效。

## 相關

- [Chart Output 節點](../nodes/chart-output-node.md)
- [Analytics 分頁](analytics-tab.md) — 內建的執行指標（與使用者自建的 dashboard 不同）
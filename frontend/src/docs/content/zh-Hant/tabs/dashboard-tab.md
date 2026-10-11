# Dashboard

**Dashboard** 分頁是一個 Grafana 風格的空間，您可以在其中建立圖表小工具的網格。每個小工具都是從其專屬的隱藏 Heym Workflow 輸出所渲染，因此您能在 Workflow 中產生的任何資料——資料庫查詢、API 呼叫、RAG 查找、LLM 輸出——都能成為圖表。您可以保留多個 Dashboard，並將每個 Dashboard 分享給人員或團隊。

## Dashboards

每個人在首次開啟此分頁時都會建立一個 Dashboard。使用分頁頂端的 Dashboard 選擇器即可切換不同 Dashboard，並使用其旁邊的 **+** 建立新的 Dashboard。選擇器會先列出您自己的 Dashboard，再列出分享給您的 Dashboard，並標示分享者的名稱。

此分頁會重新開啟您上次使用的 Dashboard，且網址列會帶有目前開啟的 Dashboard（`?tab=dashboard&dashboard=<id>`），因此連結會為任何有存取權的人開啟該特定 Dashboard。

設定按鈕（僅限擁有者）可重新命名 Dashboard、管理分享，以及刪除 Dashboard。刪除 Dashboard 會移除其小工具及對應的 Workflow。您始終會保留至少一個自己的 Dashboard，因此最後一個無法被刪除。

## Widgets

小工具是網格上的單一圖表。支援的圖表類型如下：

- **Bar**（垂直或水平）
- **Line**
- **Area**（填滿的趨勢圖，支援多個數列）
- **Pie**
- **Table**（可捲動）
- **Numeric**（單一 KPI 值，可選單位）
- **Gauge**（單一數值對應最小–最大範圍，例如百分比）
- **Scatter**（用於相關性繪圖的 X/Y 點）
- **Proportion**（單一長條分割為多個佔比，並附百分比圖例，例如語言分佈）
- **Bar gauge**（每列一個水平量測條，搭配紅→綠漸層與數值，例如可用磁碟空間）
- **Text**（markdown 訊息，例如「Last execution at 19:47」這類狀態備註；當 markdown 為靜態時支援[互動式核取方塊](../nodes/chart-output-node.md#interactive-task-lists)，並支援[明確編號清單](../nodes/chart-output-node.md#numbered-lists)以自訂或遞減編號）
- **HITL**（您待處理的人工審核。標題會顯示 `1/n pending`。Workflow 名稱會於畫布上開啟該次執行。**Approve**、**Request changes** 與 **Reject** 可解決該項目。小工具標題旁的歷史圖示會於此頁面的歷史對話框中開啟該次執行。此小工具不使用上游資料列，且每個人只會看到自己的佇列）

每個小工具會在您開啟分頁時非同步載入資料，因此圖表填入資料的同時頁面仍保持回應。

## 新增小工具

1. 點擊 **Add widget**，為其命名並選擇圖表類型。在選擇器下方，對話框會以範例資料繪製該圖表類型的範例，並列出其預期的資料列，讓您在建置任何內容前先比較各類型。
2. 小工具會在 Workflow 編輯器中開啟，並附帶起始圖形：一個產生資料列的 [Set](../nodes/set-node.md) 節點，連接到一個 [Chart Output](../nodes/chart-output-node.md) 節點。將 Set 節點替換為任何資料來源。**HITL** 小工具僅有 Chart Output 節點；它會讀取您待處理的審核，不需要資料來源。
3. 建置 Workflow，使饋入 **Chart Output** 的節點產生資料列陣列，然後設定 Chart Output 節點的欄位對應（標籤欄位、數值欄位等）。
4. 儲存、返回 Dashboard 分頁，小工具便會渲染。

隨時雙擊小工具（或使用其編輯按鈕）即可重新開啟其 Workflow。使用小工具標題中的 **Clone widget** 可同時複製小工具及其完整 Workflow。複本會置於原始項目下方，並標示 **(Copy)**，讓您能獨立編輯。

## 使用 AI 產生小工具

點擊 **AI**，描述您想要的指標（例如「workflow success rate over the last 30 days as a bar chart」），然後選擇 LLM 認證與模型。Heym 會產生一個以 Chart Output 節點結尾的完整小工具 Workflow，並將其加入網格。各圖表類型的範例 Prompt 請參閱 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)。

使用小工具的 **Fine-tune with AI** 按鈕，即可透過新指令修訂現有小工具。每次 AI 微調都會將先前的 Workflow 快照至小工具的 **Edit History**，因此您可以在 Workflow 編輯器中檢閱或還原變更。

## 編輯版面配置

切換 **Edit** 以進入編輯模式，您可以在 12 欄網格上拖曳小工具並調整其大小。版面配置變更會自動儲存。小工具標題可從小工具標題列就地編輯。

## 快取與重新整理

每個小工具會將其上次計算的資料快取於伺服器上，並具有可設定的存活時間（TTL）。當快取仍新鮮時，重新開啟 Dashboard 會提供已儲存的結果，而不會重新執行 Workflow。每次重新計算資料時，快取會就地取代（每個小工具一個快取），且當您編輯小工具的 Workflow 時會自動失效。

使用小工具的 **Refresh** 按鈕（或工具列中的 **Refresh**）可略過快取並立即重新計算。

## 共用

擁有者可在 dashboard 的設定中將其共用給個別使用者（透過 email）或其所屬的任何 [team](teams-tab.md)。每筆共用權限為 **Read** 或 **Write**；當某人同時擁有個人與 team 的共用權限時，以較高權限者為準。

| 操作 | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| 檢視 widget、重新整理、使用自動重新整理 | ✓ | ✓ | ✓ |
| 新增、複製、刪除、重新命名及調整 widget 大小；AI 生成與微調；勾選 checklist 項目 | ✓ | ✓ | |
| 在編輯器中開啟 widget 的 workflow | ✓ | ✓ | |
| 重新命名或刪除 dashboard、管理共用設定 | ✓ | | |

**Widget 一律以 dashboard 擁有者的身分執行。** 無論檢視者是誰，widget 均使用擁有者的 credentials 與全域變數，其執行紀錄也會出現在擁有者的執行歷史與 traces 中。因此，team 成員無需存取背後的帳號即可看到相同資料，且每位檢視者共用每個 widget 的同一份快取結果。Write 協作者所新增或複製的 widget 同樣歸屬於擁有者。

因此，**Write** 所承載的信任程度等同於將 workflow 共用供他人編輯：擁有 write 權限的協作者可以變更以您的 credentials 執行的內容。請僅將此權限授予您願意讓其編輯您 workflow 的人員。協作者從 workflow 編輯器啟動的測試執行會使用其自身的 credentials，與任何共用 workflow 的情況相同；僅有 dashboard 本身以擁有者的身分執行。**Read** 不授予任何 widget workflow 的存取權，唯讀檢視者會收到圖表本身，但不會取得其背後的逐節點執行細節。

移除共用權限，或將其從 write 降為 read，會立即生效。

## 相關

- [Chart Output 節點](../nodes/chart-output-node.md)
- [Analytics 分頁](analytics-tab.md) — 內建的執行指標（與使用者自建的 dashboard 不同）

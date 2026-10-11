# Execution History

Execution history 會記錄 workflow 的執行：輸入、輸出、節點結果、狀態，以及 trigger 來源。您可以用它來觀察正在正式環境中執行的 run、檢視過去的 run、除錯失敗情況，或透過 **Bring to Canvas** 以相同輸入重新執行。

## 概觀

每次 execution 會儲存：

| 欄位 | 說明 |
|-------|-------------|
| **Inputs** | Request body 或 run 輸入（例如 Input 節點的 `text`） |
| **Outputs** | Workflow 層級的輸出 |
| **Node results** | 各節點的輸出、狀態與執行時間 |
| **Status** | `success`、`error`、`pending`、`skipped` 或 `failed`（請參閱 [Crash Recovery](#crash-recovery)） |
| **trigger_source** | 該 run 是如何被觸發的（請參閱 [Triggers](./triggers.md)） |

## 存取 History

| 位置 | 範圍 |
|----------|-------|
| **Editor** 工具列 | 僅限目前 workflow |
| **Docs** 檢視標頭 | 僅限目前 workflow |
| **Dashboard** 標頭（Chat 分頁） | 所有 workflow + chat/assistant run |
| **Evals** 檢視標頭 | 所有 workflow + chat/assistant run |

點擊 **History** 按鈕（時鐘圖示）以開啟對話框。

## 單一 workflow 與全部 History

- **單一 workflow**（Editor、Docs）：顯示您目前開啟的 workflow 的 run。使用 **Clear history** 僅移除該 workflow 的 run。
- **All History**（Dashboard、Evals）：顯示所有 workflow 及 chat/assistant session 的 run。涵蓋範圍與 workflow 存取權限一致：您擁有的 workflow、直接分享給您的 workflow，以及分享給您所屬團隊的 workflow。使用 **Clear all history** 移除您擁有的所有記錄。共享 workflow 的 history 將會保留。

## Bring to Canvas

**Bring to Canvas** 會將所選 run 的輸入與節點輸出載入目前的 workflow。

### 載入的內容

- **Inputs** → Run 輸入面板（例如 Input 節點的 `text`，或自訂欄位）
- **Node results** → Execution result 面板會顯示各節點過去的輸出
- **Execution result** → 該次 run 的狀態、輸出與計時資訊

### 依情境的行為

- **在 Editor 中**（單一 workflow history）：立即套用至開啟的 workflow 並關閉對話框。
- **從 All History**（Dashboard/Evals）：導覽至 workflow editor，並在 editor 載入後套用資料。僅適用於 workflow run——不適用於 chat/assistant run。

### Execution 深層連結

以 `/workflows/{workflowId}/{executionId}` 開啟 workflow 時，會自動將該 execution 帶到 canvas 上——效果等同於選取該 run 並選擇 **Bring to Canvas**。這讓特定的過去 run 可以透過 URL 分享。若找不到該 execution（id 錯誤或已刪除），editor 會退回載入單純的 workflow。

### 使用情境

- 以相同輸入重新執行 workflow
- 透過檢視輸入與節點輸出，對失敗的 run 進行除錯
- 比較不同 run 之間的輸出

## Execution Highlights

在即時 run 之後——或在 **Bring to Canvas** 之後——Canvas **右上角**會出現一個可關閉的 **Execution Highlights** 彈出視窗。這是快速查看*每個節點產出了什麼*的方式，依執行順序由上至下列出。使用 **✕** 關閉；下次 run 時會再次開啟。

### 顯示的內容

| 記錄 | 來源 | 自動？ |
|--------|--------|-------|
| **Input** | 該 run 的輸入參數（input/trigger 節點） | 是 |
| **Output** | 輸出節點的結果——若無輸出節點，則為最後一個節點的訊息 | 是 |
| **Agent / LLM** | 每個 agent 或 LLM 節點的輸出 | 是 |
| **Output** | 任何其他已啟用 **Highlight Node Output** 的節點 | 選擇性啟用 |

已自動 highlight 的節點（input / output / last / agent / llm）不會重複出現，即使您同時啟用了該開關也一樣。

### 每筆記錄

- 顯示 `Node — message…`，包含前 **250 個字元**；點擊該列可展開，並以 **Markdown 呈現完整訊息**，附有 **Copy** 按鈕。
- 執行多次的節點（例如在迴圈內）會顯示 `Node (N)`，並附有 `‹ i / N ›` 選擇器——可挑選要檢視哪一次執行；每個節點的選擇器各自獨立。

### Highlight Node Output

除了 **Agent 與 LLM** 之外，每個節點在其屬性面板中都有 **Highlight Node Output** 核取方塊（預設關閉）。啟用後會將該節點的輸出加入彈出視窗。Canvas 上被 highlight 的節點會顯示一個小型的 ✦ 標記。在 [workflow DSL](./expression-dsl.md) 中，這對應節點資料欄位 `"highlight": true`（預設為 `false`）。

### 在 dashboard 上

執行過 workflow 的 Dashboard widget 卡片，會在卡片標頭顯示 ✦ **Execution highlights** 按鈕；點擊即可為該 widget 的 run 開啟相同的彈出視窗，並以該 widget 繪製的輸出作為主要記錄。

## 執行中的執行紀錄

兩個歷史記錄對話框都會在清單頂端、過去執行紀錄之前，顯示**目前正在執行的執行紀錄**。

- 會顯示旋轉指示器與 **Running** 標籤，並附上開始時間
- 點擊 **Open live** 可讓編輯器附加到該次執行，而不會重新啟動它
- 畫布會先還原已完成的節點，接著透過 SSE 接收
  `node_start`、`node_complete` 與最終執行事件
- 目前節點會在畫布上閃爍，下游節點維持其待處理動畫，而
  Debug 面板會在每個結果送達時加入——就如同從編輯器啟動的執行一樣
- 點擊 **Cancel** 可立即停止執行
- 從任一對話框（Editor 或 Dashboard）取消，也會關閉該 workflow 在任何已開啟畫布分頁中的作用中 SSE 串流，讓編輯器狀態乾淨地重置
- 取消後，執行中的項目會在下一次重新整理時消失；按下 **Refresh** 可手動更新清單
- 若取消的是已經完成的執行，該請求不會有任何作用

即時 URL 為 `/workflows/{workflowId}/{executionId}`。觀察者為唯讀：離開
編輯器只會中斷該瀏覽器分頁的連線，絕不會停止 workflow。作用中的快照
透過 PostgreSQL 共享，因此當 Trigger 與編輯器
請求落在不同的後端 worker 上時，仍可開啟執行紀錄。

## 當機復原

若伺服器在 workflow 執行期間重新啟動（部署、容器重新啟動或當機），該次執行的 worker 會在中途停止。Heym 會自動復原這些中斷的執行，而不是讓它們卡在 **Running** 狀態。

- 在下一次啟動時，被選出的 leader 程序會偵測孤立的執行——若是正常重新啟動會立即偵測，若是硬當機則約在 60 秒內偵測（一旦心跳明確停止）。
- 復原的執行會**以相同輸入從頭重新執行**（而非從停止處接續），並使用目前的 workflow 定義。完成時會記錄一筆正常的終止項目（例如 `success`），因此歷史記錄會將該次執行顯示為已完成。
- 執行會重試**一次**。若復原嘗試也中斷——或該 workflow 在此期間已被刪除——該項目會記錄為 `failed`。
- 這在單一容器與多 worker 部署中的運作方式相同；只有 leader 會執行復原，因此執行絕不會被不同 worker 復原兩次。

### Auto-recover 開關

編輯器的 **Execution Log**（執行）面板有一個 **Auto-recover** 核取方塊，每個 workflow **預設為開啟**。

- **開啟**：此 workflow 中斷的執行會如上所述重新執行。
- **關閉**：中斷的執行不會重新執行，並會以狀態 `skipped` 記錄。

> Sub-workflow 的執行不會獨立復原——它們會由其復原的父執行重新驅動。具有自身重新遞送機制的 Trigger（RabbitMQ、排程/cron、IMAP）也可能在重新啟動時重新遞送，因此復原的執行偶爾可能會執行兩次。

## 待處理的人工審查

因 [Human-in-the-Loop](./human-in-the-loop.md) 核准而暫停的執行會立即以狀態 `pending` 寫入歷史記錄。

- 待處理的 agent 節點會儲存審查 payload，包含 `reviewUrl`、`draftText` 與 `expiresAt`
- 連接到 agent 的 `review` handle 的任何節點也可以在人工回應前執行，其節點結果會儲存在同一筆待處理的歷史記錄項目中
- 歷史記錄對話框會顯示審查連結，讓擁有者可複製或開啟
- 歷史記錄對話框與編輯器 Debug 面板會在執行恢復後顯示最終的人工決策
- 當審查者接受、編輯或拒絕草稿時，同一筆歷史記錄項目會以最終執行結果更新
- 若同一次執行因 HITL 暫停超過一次，歷史記錄項目會保持不變，而每個檢查點會取得各自的一次性審查連結

這對於入口網站執行與可能等待數小時或數天後才繼續的長時間執行 workflow 特別有用。

## 複製

使用 Inputs 或 Outputs 旁的 **Copy** 可將 JSON 複製到剪貼簿。

## 清除歷史記錄

- **單一 workflow**：在 Editor 歷史記錄對話框中，點擊 **Clear history** 以移除目前 workflow 的執行。
- **所有歷史記錄**：在 Dashboard/Evals 歷史記錄對話框中，點擊 **Clear all history** 以移除您擁有的所有執行記錄。來自共享 workflow 的執行會保留。此動作無法復原。

## 執行時間軸詳細資料

當編輯器的 **Execution Log** 開啟時，點擊計時器按鈕可顯示執行時間軸。選取一個 span 會開啟內嵌詳細資料檢視器，接管列區域。它會顯示所選步驟的狀態、持續時間、嘗試次數、重試資訊、錯誤、trace ID，以及精簡的輸出預覽。物件與陣列輸出使用與 Debug 面板其餘部分相同的 `JsonTree` 檢視器；純量值則使用文字預覽。當步驟輸出圖片時（Playwright 螢幕擷取畫面、產生的圖片、圖片檔案），它們會以縮圖顯示在輸出上方，而 JSON 會以簡短的預留位置取代原始 base64。點擊縮圖可在燈箱中開啟；箭頭按鈕或 ←/→ 鍵可逐步瀏覽執行中的每張圖片，並附有諸如 `2 / 5` 的計數器。當有 trace ID 可用時，可對 LLM 與 Agent span 使用 **Open trace**。

## 行動裝置節點詳細資料

在手機上，編輯器會顯示全螢幕的 workflow 樹狀結構，而非自由形式的畫布。點選帶有已記錄結果的樹狀節點，即可將其執行內容以全螢幕詳細資料開啟。此檢視提供獨立的 **Input Data**、**Output Data** 與 **Errors** 分頁。輸出分頁會顯示已記錄的結果並提供 **Copy Output**；輸入分頁會顯示所選節點的配置，錯誤分頁則會在節點失敗時顯示已記錄的錯誤。使用 **Back to workflow** 或關閉按鈕即可返回樹狀結構。

畫布與儀表板歷史記錄對話框會將其執行控制項維持在同一列，並將可用的標籤與實例篩選器置於響應式網格中。其篩選器選單使用相同的應用程式內選擇器，因此選取的勾選記號與每個選項標籤皆具有一致的裝訂邊與基準線。

## 相關

- [Triggers](./triggers.md) – Workflow 如何啟動；歷史記錄會記錄 `trigger_source`（包括由 [Board](../tabs/board-tab.md) 卡片移動與後續跟進所啟動執行的 `board`）
- [Human-in-the-Loop](./human-in-the-loop.md) – 待審核 URL 與恢復行為
- [Edit History](./edit-history.md) – Workflow 儲存的版本控制（還原、差異比對）
- [Quick Start](../getting-started/quick-start.md) – 建立並執行您的第一個 workflow
- [Workflows Tab](../tabs/workflows-tab.md) – 建立與管理 workflow

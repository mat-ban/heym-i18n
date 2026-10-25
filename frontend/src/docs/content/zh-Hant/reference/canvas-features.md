# Canvas 功能

Workflow 編輯器提供多項用於除錯、測試與整理節點的功能：**Run to Node**、**節點上的 AI**、**Data Pin**、**Execution Logs**、**Enable/Disable** 以及 **Extract to Sub-Workflow**。

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ 觀看編輯器示範</a></p>

## Run to Node

將滑鼠游標停留在任何節點上（便利貼除外），然後點擊其下方的 **Run**。Heym 會執行該節點及其上游相依項目，並保持下游節點與無關分支不變。此功能使用 canvas 測試模式，包含已釘選的輸出以及 workflow 的一般分支條件。

若選取的路徑包含輸入欄位，右側的 **Run** 面板會開啟並聚焦於第一個欄位。輸入數值後，點擊 **Run to _節點標籤_** 或按下 **Ctrl+Enter**（macOS 為 Cmd+Enter）。一般 body 模式會聚焦於 JSON body 編輯器。不含輸入欄位的路徑會立即執行，不會開啟面板。已釘選的 Input 節點會重複使用其釘選輸出，不會要求輸入。

面板會保留選取的目標以供後續執行使用。選擇 **Run full workflow** 可清除目標。執行進行中時，Run 按鈕會停用。若目標位於迴圈內，執行會在该節點首次被觸及時停止；選取迴圈之後的節點則會執行完整的上游迴圈。

## 節點上的 AI

在除便簽外的任何節點上懸停，然後點擊其上方的 **AI**。[AI Assistant](./ai-assistant.md) 會在該節點上打開並提供 **Change this node as ...**、**Fix error in this node ...** 和 **Other**。在 Agent 模式下，助手僅更改該節點；其他節點、連接和佈局保持原樣。請參閱 [AI Assistant › 修改單個節點](./ai-assistant.md#changing-one-node)。

在您僅具有查看權限的工作流上，該按鈕會被隱藏。

## Data Pin

Data Pin 可讓您釘選節點上次執行的輸出，以便在不重新執行該釘選節點的情況下測試下游節點。

### 何處找到

- **Properties 面板** – 選取節點並捲動至 **Pinned Data** 區段
- **節點標記** – 當資料已釘選時，節點上會顯示釘選圖示

### 操作

| 操作 | 說明 |
|--------|-------------|
| **Pin** | 釘選節點上次的執行輸出（執行後可用） |
| **Clear** | 移除已釘選的資料 |
| **Edit** | 直接編輯已釘選的 JSON；點擊 Save 以套用 |

### 測試模式行為

在測試模式下執行 workflow 時，具有 `pinnedData` 的節點會跳過執行，改用釘選的輸出。可用於：

- 在不呼叫外部 API 的情況下測試下游邏輯
- 對參照該節點輸出的表達式進行除錯
- 使用固定範例資料反覆調整 Prompt 或條件

編輯器中的表達式自動完成功能會在可用時使用釘選資料來建議欄位。

## Execution Logs

**Debug 面板**（底部抽屜）會在 workflow 執行期間顯示即時執行記錄。您也可以從 History 對話框或 Board 卡片開啟執行中的正式環境執行。編輯器會附加至該次執行的 SSE 串流、還原已完成的節點結果，並在新節點開始與完成時持續顯示節點動畫與記錄。

### 顯示內容

- **節點結果** – 各節點狀態（`success`、`error`、`skipped`、`running`）、執行時間與輸出
- **最終輸出** – 來自 [Output](../nodes/output-node.md) 節點的彙總輸出
- **Agent 進度** – 針對 [Agent](../nodes/agent-node.md) 節點，顯示逐步的工具呼叫與推理過程

### 操作

- **Copy as JSON** – 將完整執行記錄複製到剪貼簿
- **Open in JSON editor** – 在 JSON Hero 或 JSON Editor Online 中開啟記錄以進行檢視
- **Download generated files** – 若 skill 產生了可下載的檔案（`_generated_files`），會顯示 Download 按鈕。單一檔案會直接下載；多個檔案則會開啟選取彈出視窗。

### 與 Logs 分頁的區別

Debug 面板顯示的是 **workflow 執行**記錄（節點結果、輸出）。[Logs 分頁](../tabs/logs-tab.md)顯示的是 **Docker 容器**記錄（backend、frontend、database）。 <!-- pragma: allowlist secret -->

## Enable / Disable

您可以停用節點，使其在執行期間被跳過。已停用的節點會顯示「off」標記並呈現淡化外觀。

### 如何切換

| 方法 | 說明 |
|--------|-------------|
| **Properties 面板** | 選取節點 → Power 圖示（右上角） |
| **右鍵選單** | 右鍵點擊節點 → Disable 或 Enable |
| **鍵盤** | 選取節點 → 按下 **D**（請參閱 [Keyboard Shortcuts](./keyboard-shortcuts.md)） |

### 多重選取

當選取多個節點時，Enable/Disable 會套用至所有選取的節點。若有任何選取的節點已停用，右鍵選單會顯示「Enable」；若全部皆為啟用狀態，則顯示「Disable」。

### 執行階段行為

具有 `active: false` 的節點會被跳過。下游節點不會從被跳過的節點接收到任何資料。可用於暫時排除節點，而無需刪除它們。

若要在 workflow 內部以程式化方式切換節點的啟用狀態，而非手動操作，請使用 [Disable Node](../nodes/disable-node.md) 與 [Enable Node](../nodes/enable-node.md)。

## Agent memory graph

啟用 **[persistent memory](./agent-persistent-memory.md)** 的 [Agent](../nodes/agent-node.md) 節點會在節點上顯示粉紅色的 **brain** 控制項。點擊它即可開啟 memory graph 編輯器：實體會以動畫呈現的力導向圖（force-directed graph）依實體類型分群，並提供可搜尋的 Source/Target 選擇器以新增關聯，以及一個 connections 面板可在已連結的實體之間跳轉。同一個對話框也包含 **Share memory with other agents**（workflow → agent → read 或 read/write），用於[跨 agent 的 memory 共享](./agent-persistent-memory.md#sharing-with-other-agents)。對話框開啟期間，主畫布的 undo/redo 會暫停，讓圖形編輯保有自己的歷史記錄。

**篩選圖形。** 畫布左上角有一個搜尋控制項，在您點擊它或按下 **Ctrl/Cmd+F** 之前會收合為一個快捷按鈕。它會比對實體的名稱、類型，以及每個屬性的鍵與值，也會比對關聯的類型（`parent_of`）及其屬性；被比對到的關聯會一併帶出其兩端的實體。所有以空白分隔的詞彙都必須相符。被比對到的實體會一併帶出其整個鄰域——它參與的每個關聯，以及每個關聯另一端的實體——因此比對結果絕不會成為孤立的一點。被比對到的關聯只會帶出它所連接的兩個實體，並就此停止，因為搜尋關聯類型是針對該關聯本身的提問，而非針對其兩端所連接的一切。其餘所有內容都會在畫布上與 **All edges** 清單中直接隱藏——而非淡化——並以徽章顯示總實體數中還剩下多少。方框內的 **✕** 會先清除查詢，再按一次則關閉方框。Escape 會以相同方式逐層退回，由最內層開始：先清除查詢，再關閉搜尋方框，然後離開展開的畫布檢視，唯有在這些都未開啟時才會關閉對話框。清除後會還原完整圖形，每個實體都回到原本的位置。

**手動放置實體。** 拖曳實體會將它固定在您放下的位置，讓自動佈局圍繞它安置圖形的其餘部分，而不會將它拉回。拖曳您已選取的實體時，會一併移動與它直接相連的實體，維持該叢集的形狀；拖曳任何其他實體則只會移動該實體。**Tidy layout**（魔杖按鈕）會釋放所有已固定的實體，並重新執行自動佈局。

## Extract to Sub-Workflow

將選取的節點轉換為可重複使用的 sub-workflow，並以 [Execute](../nodes/execute-node.md) 節點取代它們。

### How to Use

1. 在畫布上選取一個或多個節點
2. 按右鍵 → **Extract to Sub-Workflow**
3. 為新的 workflow 輸入名稱（以及選填的描述）
4. 點擊 **Extract**

### What Happens

- 會以選取的節點建立一個新的 workflow
- 外部輸入（來自選取範圍之外的邊）會成為 sub-workflow 的 [Input](../nodes/input-node.md) 欄位
- 外部輸出（指向選取範圍之外節點的邊）會對應到 sub-workflow 的 [Output](../nodes/output-node.md)
- 選取的節點會被單一 [Execute](../nodes/execute-node.md) 節點取代，該節點會呼叫新的 workflow
- 輸入/輸出對應會自動保留

### Use Cases

- 在多個 workflow 之間重複使用一連串節點
- 將相關邏輯分組，以簡化複雜的 workflow
- 建立模組化、可測試的 sub-workflow

## Run with cURL

編輯器工具列（右上角）的 **cURL** 按鈕會開啟一個對話框，用於建立並複製可透過 API 觸發 workflow 的 cURL 指令。

- 選擇 workflow 的請求主體模式（`Defined` 或 `Generic`）
- 設定驗證類型（Anonymous、JWT 或 Header Auth）
- 設定回應快取與速率限制
- 切換 SSE streaming 並自訂各節點的起始訊息
- 編輯請求主體
- 在 Generic 模式下，畫布執行面板會使用與 cURL 對話框相同的原始 JSON 主體
- 點擊 **Copy cURL** 以複製可直接執行的指令

完整的對話框詳細資訊請參閱 [Webhooks](./webhooks.md#run-with-curl-dialog)，事件協定請參閱 [SSE Streaming](./sse-streaming.md)。

## Related

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – 所有畫布與編輯器快捷鍵
- [Agent Persistent Memory](./agent-persistent-memory.md) – Memory graph 的行為與 API
- [Execute Node](../nodes/execute-node.md) – 呼叫 sub-workflow
- [Expression DSL](./expression-dsl.md) – 參照與固定資料
- [Workflow Structure](./workflow-structure.md) – 節點與邊的格式
- [Download & Import](./download-import.md) – 以 JSON 匯出與匯入 workflow
- [Node Types](./node-types.md) – 所有節點類型
- [Logs Tab](../tabs/logs-tab.md) – Docker 容器日誌
- [Execution History](./execution-history.md) – 過往的執行紀錄
- [Templates](../tabs/templates-tab.md) – 儲存並重複使用 workflow 與節點
- [Contextual Showcase](./contextual-showcase.md) – 編輯器中提供的精簡頁面導引

- [Canvas 協作](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.

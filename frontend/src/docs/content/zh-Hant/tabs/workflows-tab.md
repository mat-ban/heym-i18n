# Workflows 分頁

**Workflows** 分頁是預設的儀表板檢視。它會顯示您的 workflow 清單、資料夾結構，並讓您建立、編輯及整理 workflow。

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ 觀看 Workflows 示範</a></p>

## 開始對話

Workflow 清單上方有一個聊天框，會以您的名字問候您，並詢問您想自動化什麼。輸入 prompt、視需要附加一個檔案，然後選擇您要的 credential 與模型。這兩個下拉式選單皆可搜尋，並會以您的 [AI 預設值](../reference/user-settings.md) 作為起始值。

送出後會建立新的對話，並在 [Chat 分頁](./chat-tab.md) 中開啟，回覆會以串流方式顯示。支援的附件包括文字檔、圖片與 PDF，每則訊息一個，與聊天輸入區相同。

若您尚未擁有任何 LLM credential，該方塊會顯示前往 [Credentials 分頁](./credentials-tab.md) 的連結，且送出功能會保持停用。

點擊 **x** 可隱藏該方塊。此時 Workflows 標題旁會出現 **Ask AI** 按鈕，可將其重新顯示。此選擇會記住於您的瀏覽器中。

## Workflow 清單

此清單為雙窗格檢視：左側為 workflow 與資料夾，右側為所選 workflow 的預覽。

- 每一列會顯示 workflow 圖示、名稱、描述、上次更新時間，以及 [狀態標籤](#workflow-status)
- Workflow 可位於根目錄或資料夾內，已釘選的 workflow 會顯示於最上方的專屬 **Pinned** 群組中
- **點擊**某一列可選取它，並在右側載入其預覽
- **連按兩下**某一列，或在該列取得焦點時按下 **Enter**，即可在[編輯器](../getting-started/quick-start.md)中開啟它
- 使用 **Ctrl+click**（或 **Cmd+click**）可於新分頁中開啟
- 每一列的右側皆帶有編輯、複製、釘選與刪除動作。在手機上這些動作會隱藏，讓名稱保留完整寬度；在手機上**長按**某一列即可開啟動作面板
- 將經常使用的 workflow 釘選至 [Quick Drawer](../reference/quick-drawer.md)，即可從 Workflows 分頁及其他內部頁面快速執行它們

## Workflow 預覽

選取 workflow 後，清單旁的預覽面板會填入內容。在寬度小於 1280px 的螢幕上，同一面板會改以從畫面底部升起的 sheet 形式開啟。

此面板會顯示：

- Workflow 名稱、建立者與建立時間，以及上次編輯時間
- **Open Workflow** – 在編輯器中開啟該 workflow
- **Run Now** – 在 [Quick Drawer](../reference/quick-drawer.md) 中開啟該 workflow，您可在其中填寫其輸入並開始執行，無須離開清單
- **Description** – workflow 描述
- **Trigger Configuration** – cron workflow 的排程，或 event workflow 的監聽 trigger。透過 HTTP 呼叫的 workflow 會顯示 **Copy cURL** 按鈕，而非原始 endpoint 與驗證說明文字：它會複製一份完整的請求，包含正確的 URL、headers、驗證預留位置，以及由該 workflow 輸入欄位所建構的 body。當 workflow 發佈 [portal](../reference/portal.md) 時，其公開聊天連結也會顯示於此
- **Last Run Details** – 最近一次執行的結果與持續時間，或註明該 workflow 從未執行過
- **Workflow Steps & Sub-agents** – 依執行順序排列的節點，每個節點皆附有其模型、操作或排程，以及一個顯示其是否為啟用狀態的圓點。選取某個步驟會於編輯器中開啟該節點，並已展開其屬性面板

當您捲動時，此面板會固定於清單旁，因此在冗長的 workflow 清單中仍保持可讀。

## Instance Administration

列在 `HEYM_ADMIN_EMAILS` 中的帳號可以列出、開啟、編輯、檢視執行歷史，以及刪除執行個體上的任何 workflow，無需分享或轉移擁有權。此設定是以逗號分隔的電子郵件地址清單，比對時不區分大小寫。空清單不會授予任何人此存取權限。變更後請重新啟動後端。

管理員會在 workflow 清單中看到擁有者的電子郵件，並可依該地址搜尋。選取一個 workflow，即可在其預覽中開啟 **Instance administration**：

1. **Pause triggers** 僅會針對包含 Cron 節點的 workflow 顯示。它會透過一般具版本控制的儲存，停用該 workflow 的 Cron 與其他自動 Trigger 節點。現有的執行可以完成。手動、API、portal 與子 workflow 呼叫仍可使用；此動作並非整個 workflow 的執行鎖。
2. 暫停期間，按鈕會變更為 **Resume triggers**，包括在頁面重新載入之後。Resume 會重新啟用由管理員暫停的 Trigger，並讓原本已停用的 Trigger 維持不變。對於較舊、沒有已儲存管理員暫停狀態的暫停 workflow，Resume 會啟用其自動 Trigger。
3. 待執行結束後，使用 workflow 列的 **Delete workflow** 動作。若仍有執行中、已排入佇列或待審核的工作，刪除會回傳衝突。排程刪除會套用相同的檢查。

請先暫停 Trigger 並讓現有執行完成，再進行刪除。暫停時已派送的 Trigger 仍可完成。當 workflow 必須不再可被呼叫時，請使用刪除。

僅限擁有者的 Webhook 密碼與驗證設定會維持其現有保護。Administration 不會轉移擁有權，也不會分享擁有者的憑證記錄。管理員的暫停、繼續、刪除與排程動作會顯示於 [audit trail](../reference/audit.md) 中，並記錄執行該動作的管理員與 workflow 擁有者。

## Workflow Status

每一列都會帶有一個狀態標籤，該標籤衍生自 workflow 的 Trigger 節點、其即時執行狀態，以及——對於沒有 Trigger 節點的 workflow——其最近一次執行的啟動方式：

| Status | Meaning |
| --- | --- |
| **Running** | 該 workflow 目前有執行正在進行中 |
| **Scheduled** | 它具有作用中的 [cron](../nodes/cron-node.md) Trigger |
| **Listening** | 它具有作用中的事件 Trigger，例如 Slack、Telegram、IMAP 或 WebSocket Trigger |
| **Paused** | 它具有 Trigger 節點，但每一個都已停用 |
| **API** | 它沒有 Trigger 節點，且最後一次執行是透過對其 execute Endpoint 的 HTTP 呼叫啟動 |
| **SubWorker** | 它沒有 Trigger 節點，且最後一次執行是由父 workflow 作為子 workflow 啟動 |
| **Portal** | 它沒有 Trigger 節點，且最後一次執行是從其 [portal](../reference/portal.md) 啟動 |
| **WEB** | 它沒有 Trigger 節點，且其唯一終端是 [HTML output mapper](../nodes/html-output-mapper-node.md)，因此呼叫它會回傳渲染後的網頁 |
| **Manual** | 它沒有 Trigger 節點，且從未執行過，或其最後一次執行來自其他來源 |
| **Remove Scheduled** | 它已[排程刪除](../reference/workflow-organization.md) |

API、SubWorker 與 Portal 標籤會讀取 workflow [執行歷史](./logs-tab.md)中單一最近一筆項目，因此以兩種方式呼叫的 workflow 會顯示最後一次的方式。**WEB** 則是根據圖形判定，因此其優先順序高於前述三者：提供頁面的 workflow 即使在透過 HTTP 呼叫之後仍會顯示 WEB。Trigger 節點一律優先於上述所有狀態：一個同時被某人透過 HTTP 呼叫的 cron workflow 仍會維持 **Scheduled**。

使用搜尋欄位旁的 **Status** 下拉式選單，即可僅顯示某一種狀態。下拉式選單會列出目前符合各狀態的 workflow 數量。狀態篩選也會深入資料夾：有符合項目的資料夾會自動展開，沒有符合項目的資料夾則會隱藏，直到清除篩選為止。

## Active Workflows

在桌面上，頂端工具列中的圓形徽章會顯示目前正在執行的 workflow 數量，並每 10 秒自動重新整理。點擊非零的徽章即可開啟作用中 workflow 清單，該清單在捲動前最多顯示四列。選取 workflow 名稱，即可讓編輯器附加至該次執行的即時檢視。零值徽章僅供參考，無法開啟，且該徽章在行動裝置螢幕上會隱藏。

## Search

使用 **Status** 旁的 workflow 搜尋欄位，或按 **Ctrl+F**（或 **Cmd+F**），即可依標題或描述篩選 workflow。資料夾內符合的 workflow 會顯示，並展開其資料夾分支。按 **Escape** 可清除搜尋。

## Folders

- 將 workflows 組織到[資料夾與子資料夾](../reference/workflow-organization.md)中
- 使用 **New Folder** 按鈕建立資料夾，為每個資料夾命名並可選擇性地加入描述，描述會顯示在清單中資料夾名稱下方
- 每個資料夾列會顯示其包含的 workflow 數量（含子資料夾），以及新增子資料夾、重新命名、變更圖示、下載為 ZIP 和刪除等操作。在手機上，該列僅顯示單一選單按鈕
- 將 workflow 拖曳至資料夾或子資料夾上方，即可看到卡片大小的目的地預覽。反白顯示的預覽會在您放開前顯示完整的資料夾路徑，而將游標停留在收合的資料夾上會短暫展開它，讓您能夠觸及巢狀資料夾。
- 在資料夾之間或拖曳至根目錄來移動 workflows。被拖曳的卡片會以幽靈形式保持可見，而作用中的目的地則會在您捲動時保持反白。
- 將 workflow 拖放回其目前所在的資料夾會被停用，並標示為 **Already in Folder**。
- 從資料夾的重新命名操作或右鍵內容選單中重新命名資料夾，或變更其描述

## Creating Workflows

1. 點擊 **New Workflow**
2. 輸入名稱與選填的描述
3. workflow 會在編輯器中開啟

## Import

將 JSON workflow 檔案拖放至 workflow 區域即可建立新的 workflow。匯入的節點與邊緣會用於建立 workflow；名稱來自 JSON 中的 `name` 欄位或檔案名稱。關於 JSON 格式與匯入選項，請參閱[下載與匯入](../reference/download-import.md)。

## Sharing

在編輯器中開啟 workflow，然後點擊 **Share** 以透過電子郵件邀請使用者，或與[團隊](./teams-tab.md)分享。為每位使用者或團隊選擇 **Read**（檢視與執行）或 **Write**（亦可編輯），之後可從項目旁的的下拉式選單變更。Credentials 與子 workflow 不會自動分享；請另外與相同的使用者或團隊分享。請參閱 [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) 與 [Credentials Sharing](../reference/credentials-sharing.md)。

## Editing and Deleting

- **Edit** – 從該列的編輯操作變更 workflow 名稱與描述
- **Delete** – Workflows 會被[排程刪除](../reference/workflow-organization.md)；在永久移除之前，它們會移至垃圾桶區域

## Concurrent Edits

儲存時會傳送您的編輯所依據的修訂版本，若 workflow 在此期間已變更——例如因為隊友儲存了它，或您在第二個分頁中開啟了相同的 workflow——伺服器會拒絕該寫入。Heym 接著會顯示 **Stale Workflow Detected** 對話框，提供兩個選項：

- **Cancel** – 在編輯器中保留您尚未儲存的變更，讓您可以在另一個分頁中重新載入並進行整合
- **Override** – 仍進行儲存，覆蓋他人的版本

**執行** workflow 時會先儲存它，因此會經過相同的檢查。若 workflow 在您操作期間已變更，執行會暫停在對話框上，而非默默覆寫：**Override and Run** 會儲存您的版本並開始執行，**Cancel Run** 則會放棄兩者並保留您的編輯不變。

此檢查是儲存請求本身的一部分，因此不會產生額外的往返，也不存在儲存可能繞過它的時間窗口。您自己在應用程式其他位置的變更——重新命名、設定變更、屬性面板切換——永遠不會被視為衝突。

## Command Palette

按下 **Ctrl+K**（或 **Cmd+K**）以開啟命令面板。您可以：
- 依名稱搜尋 workflows
- 跳至任何[儀表板分頁](./credentials-tab.md)
- 開啟最近的 workflows

## Related

- [快速開始](../getting-started/quick-start.md) – 建立您的第一個 workflow
- [Workflow Organization](../reference/workflow-organization.md) – 資料夾、子資料夾與排程刪除
- [Workflow Structure](../reference/workflow-structure.md) – workflows 的 JSON 格式
- [下載與匯入](../reference/download-import.md) – 以 JSON 匯出與匯入 workflows
- [Portal](../reference/portal.md) – 將 workflows 公開為聊天 UI
- [Board](./board-tab.md) – 透過欄位鏈從看板卡片執行 workflows
- [核心概念](../getting-started/core-concepts.md) – Workflows、節點與執行
- [Execution History](../reference/execution-history.md) – 檢視過去的執行紀錄與 Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 從儀表板、文件與其他非編輯器頁面釘選並執行 workflows
- [Contextual Showcase](../reference/contextual-showcase.md) – 儀表板介面的簡短頁面指南

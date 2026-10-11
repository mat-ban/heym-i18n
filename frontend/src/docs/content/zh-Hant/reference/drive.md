# Drive

Drive 分頁提供了一個集中檢視、管理及分享所有由 skill 產生之檔案的位置。

## 存取 Drive

導覽至儀表板中的 **Drive** 分頁。所有由你的 Workflow skill 產生的檔案都會顯示於此，並依建立日期排序。

## 檔案清單

檔案清單顯示：

- **Name** - 原始檔案名稱，附帶類型專屬圖示
- **Type** - 檔案 MIME 類型（例如 pdf、csv、docx）
- **Size** - 人類可讀的檔案大小
- **Source** - 產生該檔案的節點標籤
- **Date** - 檔案的建立時間
- **Actions** - 下載、分享及刪除按鈕

## 批次操作

你擁有的每個檔案，其資料列開頭都有一個核取方塊。透過團隊分享給你的檔案為唯讀，無法選取。選取多個檔案（Shift 點擊可選取連續範圍；表頭核取方塊可選取整頁）後，清單上方會顯示批次操作列，接著點擊 **Bulk actions** 開啟單一對話框，將相同設定套用至每個已選取的檔案：

- **Share all with my teams** / **Remove team sharing** — 一次切換所有已選取檔案的團隊分享狀態
- **Create share link for each file** — 使用相同的到期時間、密碼及最大下載次數值，為每個已選取的檔案建立分享連結

對話框會回報其套用至多少個檔案；你未擁有的檔案會被略過。清單底部的每頁資料列數選擇器（25 / 50 / 100 / **All**）可讓你在一頁載入更多檔案，以便跨整個 Drive 進行選取。

## 分享檔案

點擊 **Share** 圖示以開啟分享對話框。你可以為每個檔案建立多個具有不同設定的分享連結，並可選擇將檔案分享給你目前的團隊。

### 公開連結（以 Token 為基礎）

建立無密碼的分享連結。任何取得該連結的人都可以下載檔案。

### 受密碼保護的連結（Basic Auth）

建立分享時設定密碼。下載 URL 使用 HTTP Basic Authentication——瀏覽器在開啟連結時會提示輸入使用者名稱（`file`）及密碼。

### 連結選項

- **Expires (hours)** - 可選擇設定到期時間
- **Max downloads** - 可選擇限制下載次數
- 兩者可合併使用以達到最大控制

### 與我的團隊分享

啟用 **Share with my teams** 可授予你目前所屬所有團隊唯讀存取權。團隊成員可以從 Drive 檢視及下載檔案，並使用唯讀取向的 Drive 節點操作，但只有檔案擁有者可以刪除檔案、建立或撤銷公開連結，或變更密碼／TTL／下載限制。

此設定為檔案專屬。若你之後加入或建立其他團隊，請再次切換分享，或執行 Drive 節點的 `shareWithMyTeams` 操作以加入該團隊。使用 `unshareWithMyTeams` 可在 Workflow 中移除該檔案的團隊分享。

### 管理分享

分享對話框會顯示所有現有的分享連結，包含：
- 目前的下載次數
- 到期狀態
- 是否啟用 Basic Auth
- 複製及撤銷按鈕

## 聊天與 Portal 中的檔案連結

當 skill 在透過 Portal 聊天或 Quick Drawer 執行 Workflow 期間產生檔案時，下載連結會自動出現在回應中。使用者可以直接點擊下載。

## 儲存

產生的檔案儲存於伺服器檔案系統的 `data/files/` 之下。在 Docker 部署中，此目錄會掛載為 volume 以確保持久性。

## 從 Workflow 管理檔案

[Drive 節點](../nodes/drive-node.md) 可讓你從 Workflow 內以程式化方式管理 Drive 檔案。使用它來：

- **列出**你的檔案並回傳中繼資料，例如檔案名稱、MIME 類型、大小、來源及下載 URL
- 在檔案交付給使用者後**刪除**該檔案
- **與你的團隊分享或取消分享**，讓團隊成員僅在團隊分享存在期間能讀取及下載該檔案
- 在下載連結上**設定密碼**
- **設定 TTL**，讓連結在 N 小時後到期
- **設定最大下載次數**限制

將檔案轉換為其他格式是 [Converter 節點](../nodes/converter-node.md) 的職責，使用 `conversion: "fileConvert"`。它會讀取 Drive 檔案並將轉換結果儲存為新檔案。

透過 skill 輸出中的檔案 ID 來參照該檔案：`$agentLabel._generated_files[0].id`

請參閱 [Drive 節點文件](../nodes/drive-node.md) 以了解設定詳細資訊。

## 從 Skill 讀取 Drive 檔案

Agent skill 可透過 skill 卡片的 **Enable Drive files** 設定選擇啟用 Drive 讀取。啟用後，skill 執行環境會包含一個產生的 `heym_drive.py` 輔助程式。Skill 程式碼可以匯入諸如 `read_drive_text`、`read_drive_file`、`read_drive_base64`、`get_drive_file`、`get_drive_file_path` 及 `list_drive_files` 等輔助函式。

Drive 讀取僅限於 Workflow 執行者所能存取的檔案：擁有的檔案，以及透過團隊分享給該執行者的檔案。使用檔案 ID 進行精確查詢，或在使用者以名稱提及檔案時使用精確的檔案名稱。檔案名稱查詢會回傳該名稱下最新的可存取檔案；`list_drive_files(filename="...")` 會回傳所有符合的項目。

## 相關內容

- [Drive 節點](../nodes/drive-node.md) - Workflow 操作（列出、取得、刪除、密碼、TTL、最大下載次數、團隊分享）
- [Drive 分頁](../tabs/drive-tab.md) - 在儀表板中瀏覽檔案
- [檔案產生](./file-generation.md) - `_generated_files` 與下載 URL 的產生方式

## 清理
過期的分享 Token 會每日自動清理。檔案本身會持續存在，直到透過 Drive 分頁手動刪除。使用 **Clear All** 可一次刪除所有檔案及其分享連結。

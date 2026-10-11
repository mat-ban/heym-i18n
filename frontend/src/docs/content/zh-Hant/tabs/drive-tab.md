# Drive Tab

Drive 分頁顯示所有由 skills 在您的 workflows 中產生的檔案。

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ 觀看 Drive 示範</a></p>

## 概觀

由 skills 產生的檔案（PDF、DOCX、CSV、圖片等）會自動儲存並列於 Drive 分頁中。每個檔案會顯示其名稱、類型、大小、來源節點、建立日期以及團隊分享狀態。

## 功能

- **搜尋** - 依名稱、類型或來源節點篩選檔案
- **複製檔案 ID** - 將檔案 UUID 複製到剪貼簿，方便貼入 [Drive](../nodes/drive-node.md) 或 [Converter](../nodes/converter-node.md) 節點
- **下載** - 為您的檔案以及透過團隊分享給您的檔案提供經過驗證的下載
- **分享** - 建立可分享的下載連結，並可選擇加上密碼保護與到期時間，或將檔案以唯讀方式分享給您目前的團隊
- **刪除** - 移除檔案及其分享連結
- **全部清除** - 經確認後刪除所有檔案及其分享連結
- **批次操作** - 使用核取方塊選取多個檔案（Shift 點擊可選取範圍），並一次對所有選取的檔案套用相同操作
- **分頁** - 瀏覽大量檔案集合，並提供每頁列數選擇器（25 / 50 / 100 / 全部）

## 批次操作

您擁有的檔案會在該列開頭顯示核取方塊（透過團隊分享給您的檔案為唯讀，無法選取）。選取多列——或使用表頭核取方塊選取整頁，並以 **Shift 點擊** 選取範圍——然後使用清單上方出現的批次操作列：

- **下載 ZIP** 將所有選取的檔案打包成單一 ZIP 壓縮檔並下載
- **批次操作** 開啟單一對話框，將某項設定套用至所有選取的檔案：
  - 一鍵 **全部與我的團隊分享** / **移除團隊分享**
  - 使用相同的密碼、到期時間與下載次數上限設定，**為每個檔案建立分享連結**
- **刪除** 經確認後移除所有選取的檔案及其分享連結
- **清除選取** 取消選取所有項目

對話框會回報已套用至多少個檔案（您不擁有的檔案會被略過）。使用每頁列數選擇器的 **全部** 選項，即可在一頁載入所有檔案，並在整個 Drive 中進行選取。在搜尋框中輸入內容時，每頁列數選擇器會自動切換為 **全部**，讓搜尋涵蓋所有檔案，而不僅限於目前頁面；清除搜尋後會還原您先前的選擇。

## 分享

建立分享連結的方式：
- **無需驗證** - 公開的以 Token 為基礎的下載 URL
- **Basic Auth** - 受密碼保護的連結（使用者名稱：`file`）
- **到期時間** - 可選的以時間為基礎的到期設定
- **下載次數限制** - 可選的下載次數上限

在檔案上啟用 **與我的團隊分享**，即可讓您目前所屬的所有團隊看見該檔案。被分享的團隊成員取得唯讀存取權；管理操作僅限擁有者。

## Agent Skill 存取

Agent 節點上的 skills 可以選擇啟用讀取 Drive 檔案。當某個 skill 的 **Enable Drive files** 開啟時，其 Python 程式碼可透過產生的 `heym_drive.py` 輔助程式，依檔案 ID 或確切檔名讀取可存取的 Drive 檔案。此設定預設為關閉。

完整詳情請參閱 [Drive 參考](../reference/drive.md)。

## 相關內容

- [Drive 節點](../nodes/drive-node.md) - 從 workflow 列出檔案、取得中繼資料、與團隊分享，或變更分享限制
- [檔案產生](../reference/file-generation.md) - skills 如何產生檔案
- [Drive 參考](../reference/drive.md) - 分享連結、tokens 與清理
- [Portal](../reference/portal.md) - Portal 聊天回應中的檔案連結

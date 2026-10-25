# Heym Work

**Heym Work** 是專為業務團隊打造的第二套使用者介面，構建於 Heym 之上。使用者以自己的語言描述任務，回答幾個問題，即可獲得 Heym 構建並測試完成的 workflow。業務人員在專屬頁面上展開工作，處理審核，並能查閱標註發起人姓名的每次執行。Heym 在背景執行每項任務。

Heym Work 作為獨立容器與 Heym 並行執行，需具備 Heym 團隊提供的獨立授權。請造訪 [heym.run/enterprise](https://heym.run/enterprise) 了解詳情並申請試用。觀看 [Heym Work 介紹影片](https://youtu.be/5Z2gGo6bcpU) 進行兩分鐘快速導覽。

## 業務團隊獲得的優勢

| 模組 | 功能說明 |
|------|----------|
| **Chat** | 透過文字或語音描述任務。Heym 詢問所需資訊，構建 workflow，進行測試並將其標記為已驗證。 |
| **Flows** | 編輯者可以通過選項而不是畫布構建 flow：觸發條件、可選的 AI 草稿以及在 Slack、Google Sheets 和電子郵件中的操作。來自 Slack 的回覆將繼續運行，批准操作也會在「活動」中等待。請參閱 [Flows](#flows)。 |
| **頁面** | 固定元件頁面：指標數值、圖表、具狀態標籤的表格、檔案放置區與核准卡片。表格中的資料列可開啟獨立的詳細資訊頁面。 |
| **核准** | 來自 [Human-in-the-Loop](./human-in-the-loop.md) 步驟的審核作業會在「活動」與頁面中等待處理，支援核准、請求修改與拒絕。 |
| **活動** | 記錄每一次執行，並註明發起人與執行此任務的執行個體。 |
| **角色** | 擁有者、編輯者與檢視者。使用者透過 Heym 已設定的 [單一登入 (SSO)](./sso.md) 進行驗證。 |
| **產業版本** | 法律、教育、金融、物流、能源與電子商務版本開箱即用，內建專屬頁面、範例資料及產業專用 workflow。 |

## Flows

**Flows** 位於 Heym Work 面向編輯者和所有者的菜單中。Flow 是由選項而非節點構成的，Heym Work 通過 Heym API 代表創建它的人將其另存為常規 Heym 工作流。Heym 的訪問規則、編輯歷史和觸發器同步均按編輯器中的方式適用，每次運行都會像其他運行一樣出現在「活動」中。

| 部分 | 選項 |
|---|---|
| **觸發條件** | 按需、按計劃、在收到 Slack 訊息時、當 Google Sheets 標籤頁更改時（添加、更改或刪除行），或當電子郵件到達收件箱時。電子表格和電子郵件觸發器每 1、5、15 或 60 分鐘檢查一次。 |
| **AI 草稿**（可選） | 模型和說明會將啟動 flow 的內容轉換為後續步驟所需的文本。未從表格或電子郵件啟動的 flow 可以首先從頻道或會話中讀取最近的 Slack 訊息。 |
| **接下來發生什麼** | 無論由什麼啟動 flow，都按順序在三種工具中的任一種中執行操作。**Slack：** 頻道訊息、私訊、表單、帶按鈕的訊息、批准、會話回覆、訊息更新和最終結果。**Google Sheets：** 添加行，或更新已更改的行。**電子郵件：** 發送電子郵件。 |

- **回覆將繼續運行。** 批准、按鈕或表單會暫停運行，直到有人在 Slack 中回覆。批准操作也會在「活動」中等待，在任一位置做出的決定都會從 Slack 訊息中刪除按鈕。後續的 Slack 步驟將保留在第一條訊息的會話中。
- **單個「連接」卡片。** 每個 flow 都會顯示其讀取和發送所用的 Slack 工作區、Google Sheets 帳戶和收件箱。它們是 Heym 憑證：**Slack Bot**（bot 權杖，`xoxb-…`）、**Google Sheets**、**IMAP** 和 **SMTP**；缺失的憑證可以直接從 flow 本身添加。
- **每個 flow 擁有一個 Slack 應用。** 在 Slack 應用中，將交互請求 URL 設置為 `https://<您的 Heym>/api/slack/interactions/<憑證 id>`，並將事件訂閱請求 URL 設置為 `https://<您的 Heym>/api/slack/events/<憑證 id>`。Heym Work 會為所選連接顯示兩者。該憑證上的所有 flow 共享它們。
- **Slack 觸發器選擇其監聽的內容：** 頻道和私訊中的訊息、發給 bot 的私訊、@提及 bot 或單個頻道中的訊息。Bot 自己的發布絕不會觸發 flow。
- **要求。** Flows 需要 Heym 0.0.131 或更高版本。

Flow 構建的步驟與您在畫布上可以使用的節點相同：[Slack](../nodes/slack-node.md)、[Slack Trigger](../nodes/slack-trigger-node.md)、[Google Sheets](../nodes/google-sheets-node.md)、[Google Sheets Trigger](../nodes/google-sheets-trigger-node.md)、[IMAP Trigger](../nodes/imap-trigger-node.md)、[Send Email](../nodes/send-email-node.md) 和 [Cron](../nodes/cron-node.md)。

## 連線 Heym Work

觀看 [安裝影片](https://youtu.be/zXGfg1HPSLk) 了解從第一條指令到首頁呈現的完整設定流程。

連線於 **設定 → Heym Work** 進行設定。此分頁僅對列於 `HEYM_ADMIN_EMAILS` 的執行個體管理員可見。

| 欄位 | 功能說明 |
|------|----------|
| **Heym Work 位址** | Heym Work 執行的位址，例如 `https://work.example.com`。登入後將返回此處。請按 **儲存**。 |
| **整合金鑰** | 點擊 **產生金鑰** 建立 Heym Work 用於向 Heym 傳送每次請求的金鑰。此金鑰僅顯示一次並提供複製按鈕。Heym 僅儲存其雜湊值。 |
| **啟用 Heym Work** | 開啟連線。需預先輸入位址與金鑰。 |
| **行業和團隊版本** | 面向法律、教育、金融、物流、能源和電子商務的版本，以及面向企業團隊的 IT、銷售、營銷和人力資源版本，均隨附專門針對該工作的頁面、示例數據和工作流。 |

隨後開啟 Heym Work 位址並完成設定：

1. **授權**：輸入 Heym 團隊提供的授權金鑰。
2. **Heym**：輸入 Heym 位址與整合金鑰。
3. **擁有者**：使用列為 Heym Work 擁有者的帳戶登入。

首頁隨即開啟，準備供團隊使用。

### 輪換金鑰

**輪換金鑰** 會替換目前的整合金鑰。Heym Work 將停止運作，直到在此輸入新金鑰；同時所有已登入 Heym Work 的使用者皆會登出。若懷疑金鑰洩漏或知情人員離職時，請使用此功能。

### 停用連線

關閉 **啟用 Heym Work** 開關即可中斷連線。Heym Work 屆時將再次要求提供 Heym 金鑰。無論如何，Heym 都會持續正常執行所有 workflow、排程及 Webhook。

## 安全架構

- **所有變更皆經由 Heym。** Heym Work 從 Heym 資料庫讀取顯示內容，並透過受金鑰保護的通道將所有操作傳送至 Heym，由 Heym 套用專屬存取規則。Heym Work 將自身資料儲存於獨立的 `heym_work` 結構描述中。
- **金鑰以雜湊形式靜態儲存。** Heym 比對傳入金鑰的雜湊值，從不以純文字儲存金鑰。
- **登入驗證保留於 Heym。** 啟用 [SSO](./sso.md) 時，使用者透過 Heym 與企業身分識別提供者進行驗證。
- **變更全面受到稽核。** 儲存連線與輪換金鑰皆會在 [稽核記錄](./audit.md) 中寫入 `work_integration.update` 與 `work_integration.key_rotate` 項目。

## 授權管理

Heym Work 需要 Heym 團隊核發的專用授權金鑰。Heym Work 每日向 heym.run 傳送其授權 ID、安裝 ID、過去 30 天內的活躍使用者數、成員總數、過去 24 小時內的執行次數以及 Heym 與 Heym Work 的版本。Workflow 內容、輸入、輸出及認證資訊始終完整保留在您的本機伺服器上。

若每日同步連續失敗達 30 天，將進入 14 天寬限期，寬限期過後 Heym Work 介面將提示擁有者輸入金鑰。試用期至最後一天為止，經 Heym 團隊延長後可繼續使用（每個安裝執行個體限試用一次）。Heym 本身在此期間全程持續正常執行。無網際網路連線的網路環境可透過 enterprise@heym.run 取得離線授權。

## 影片資源

所有 Heym Work 影片皆收錄於 [Heym Work 播放清單](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ)。

## 相關文件

- [Enterprise](./enterprise.md)：商業授權與支援
- [單一登入 (SSO)](./sso.md)：Heym Work 使用的登入驗證機制
- [Human-in-the-Loop](./human-in-the-loop.md)：Heym Work 顯示的審核項目
- [稽核記錄](./audit.md)：連線變更寫入的紀錄項目
- [設定](./user-settings.md)：Heym Work 分頁所在位置

# IMAP Trigger

**IMAP Trigger** 節點會以固定間隔輪詢電子郵件信箱，並針對每個新偵測到的郵件啟動一次 Workflow。它是一個零輸入的 Trigger 節點，專為 inbound 電子郵件自動化而設計，例如支援案件分類、共用信箱監控，以及簽核信箱。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 0 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.email`、`$nodeLabel.triggered_by`、`$nodeLabel.trigger_node_id`、`$nodeLabel.triggered_at` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` 認證，包含伺服器、登入資訊、信箱及 SSL 設定 |
| `pollIntervalMinutes` | Integer | Heym 檢查信箱是否有新電子郵件的頻率 |

## 設定指南

### 1. 建立 `imap` 認證

1. 前往 **Settings → Credentials → New Credential**
2. 選擇類型 **IMAP Email Inbox**
3. 輸入：
   - **IMAP Host**（例如 `imap.gmail.com`）
   - **IMAP Port**（多數供應商使用 SSL/TLS 時為 `993`）
   - **Username / Email**
   - **Password / App Password**
   - 選填 **Mailbox**（預設：`INBOX`）
4. 除非您的郵件伺服器明確要求使用非 SSL 的 IMAP，否則請保持 **Use SSL / TLS** 為啟用狀態
5. 儲存認證

### 2. 將節點新增至您的 Workflow

1. 將 **IMAP Trigger** 拖曳至畫布上
2. 選取該節點以開啟 Properties 面板
3. 選擇您的 `imap` 認證
4. 將 **Poll Interval (Minutes)** 設定為整數值，例如 `1`、`5` 或 `15`

## Trigger 語意

- 第一次輪詢會建立目前信箱內容的基準，且**不會**重播較舊的電子郵件。
- 之後的輪詢會針對 IMAP UID 比已儲存游標更新的每封郵件觸發一次。
- 若信箱的 `UIDVALIDITY` 變更，Heym 會重設游標並重新建立基準，以避免重複處理。
- 每封新電子郵件都會以 `trigger_source = "imap"` 啟動一次獨立的 Workflow 執行。

## 輸出欄位

節點觸發後，下游節點可以存取：

| 表達式 | 說明 |
|------------|-------------|
| `$nodeLabel.email` | 完整解析後的電子郵件 Payload |
| `$nodeLabel.email.subject` | 解碼後的主旨 |
| `$nodeLabel.email.from` | 原始 `From` 標頭 |
| `$nodeLabel.email.fromAddresses` | 解析後的寄件者清單 |
| `$nodeLabel.email.toAddresses` | 解析後的收件者清單 |
| `$nodeLabel.email.ccAddresses` | 解析後的副本清單 |
| `$nodeLabel.email.replyToAddresses` | 解析後的回覆位址清單 |
| `$nodeLabel.email.text` | 純文字內文 |
| `$nodeLabel.email.html` | HTML 內文 |
| `$nodeLabel.email.attachments` | 附件中繼資料的陣列（`filename`、`content_type`、`size_bytes`） |
| `$nodeLabel.email.headers` | 解碼後的標頭物件 |
| `$nodeLabel.email.uid` | 用於去重或記錄的 IMAP UID |
| `$nodeLabel.triggered_by` | Trigger 來源標籤（`"imap"`） |
| `$nodeLabel.trigger_node_id` | 偵測到該電子郵件的畫布節點 ID |
| `$nodeLabel.triggered_at` | Workflow 執行的 ISO 時間戳記 |

## 範例 Workflow

**Inbound 支援電子郵件 → 摘要 → 路由**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** 標籤：`supportInbox`
- **LLM** 使用者訊息：`"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**：`$supportInbox.email.subject.lower().contains("urgent")`

## 備註

- 許多供應商要求使用 **app password** 進行 IMAP 存取，而非您的主要帳戶密碼。
- 附件內容不會注入 Workflow 輸入；僅包含附件中繼資料。
- 使用下游的 [Send Email](./send-email-node.md)、[Telegram](./telegram-node.md)、[Slack](./slack-node.md) 或 [DataTable](./datatable-node.md) 來路由或記錄新電子郵件。

## 相關資訊

- [Triggers](../reference/triggers.md) – 所有 Workflow 進入點的概觀
- [Third-Party Integrations](../reference/integrations.md) – IMAP 認證設定
- [Credentials Tab](../tabs/credentials-tab.md) – 新增及管理 `imap` 認證
- [Send Email](./send-email-node.md) – 回覆或轉寄 inbound 訊息

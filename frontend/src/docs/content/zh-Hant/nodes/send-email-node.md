# 傳送電子郵件

**Send Email** 節點透過 SMTP 傳送電子郵件。可用於通知、警示及交易型電子郵件。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.status`、`$nodeLabel.to`、`$nodeLabel.cc`、`$nodeLabel.bcc`、`$nodeLabel.subject`、`$nodeLabel.attachment_count` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 SMTP 認證 |
| `to` | expression | 收件者。多個收件者請以逗號分隔。 |
| `cc` | expression | 副本收件者。多個收件者請以逗號分隔。 |
| `bcc` | expression | 密件副本收件者。多個收件者請以逗號分隔。對其他收件者隱藏。 |
| `subject` | expression | 電子郵件主旨 |
| `emailBody` | expression | 電子郵件內文 |
| `attachments` | expression | 以逗號分隔的 [Drive](./drive-node.md) 檔案 ID，用於附加檔案。僅能附加由 Workflow 擁有者所擁有，或與其任一團隊共用的檔案。 |

## 附件

將一個或多個 Drive 檔案 ID 傳入 `attachments` 欄位，即可附加來自 [Drive](./drive-node.md) 的檔案。使用 `$` 表達式來參照上游 Drive 節點的 `id` 輸出（例如 `$drive.id`），或以逗號分隔列出靜態 ID。每個 ID 會在工作流程擁有者的範圍內解析；無效或無法存取的 ID 會導致節點失敗，而不會傳送部分電子郵件。

## 設定

新增 SMTP 認證，包含伺服器、連接埠、電子郵件及密碼。顯示的寄件者為認證中選填的 **From** 欄位；若 From 留空，則會以使用者名稱作為寄件者傳送。常見的 SMTP 伺服器：

- Gmail：`smtp.gmail.com`，連接埠 587（需要應用程式密碼）
- Outlook：`smtp.office365.com`，連接埠 587

## 範例

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

上述的 `attachments` 值參照了標籤為 `drive` 的上游 [Drive](./drive-node.md) 節點，並附加該節點所產生的檔案。

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Error Handler](./error-handler-node.md) – 於失敗時傳送電子郵件
- [Credentials Tab](../tabs/credentials-tab.md) – 新增 SMTP 認證
- [Third-Party Integrations](../reference/integrations.md#smtp-email) – SMTP 供應商設定（Gmail、Outlook、Mailgun、SendGrid）

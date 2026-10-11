# Grist

**Grist** 節點可讀取、寫入及管理 Grist 試算表中的資料。可用於 CRUD 操作、批次更新及試算表自動化。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.records`、`$nodeLabel.record`、`$nodeLabel.success`、`$nodeLabel.id` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 Grist 認證 |
| `gristOperation` | string | 操作：`getRecord`、`getRecords`、`createRecord`、`createRecords`、`updateRecord`、`updateRecords`、`deleteRecord`、`listTables`、`listColumns` |
| `gristDocId` | expression | 文件 ID（來自 Grist URL） |
| `gristTableId` | expression | 資料表 ID |
| `gristRecordId` | expression | 記錄 ID（單筆記錄操作） |
| `gristRecordData` | JSON string | 用於建立/更新的欄位值。請使用**欄位 ID**（例如 `User_Name`），而非標籤。 |
| `gristRecordsData` | JSON string | 用於批次操作的記錄陣列 |
| `gristFilter` | JSON string | 篩選條件：`{"Column_ID": [values]}` |
| `gristSort` | string | 排序：`Column_ID` 或 `-Column_ID`（遞減） |
| `gristLimit` | number | 最大記錄數（預設：100） |

## 欄位 ID 與標籤

在 `gristRecordData` 與篩選條件中，請使用**欄位 ID**（底線格式，例如 `User_Name`），而非顯示標籤。可使用 `listColumns` 來探索欄位 ID。

## 範例 – 取得記錄

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## 範例 – 建立記錄

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Credentials Tab](../tabs/credentials-tab.md) – 新增 Grist API key
- [Third-Party Integrations](../reference/integrations.md#grist) – Grist 認證設定

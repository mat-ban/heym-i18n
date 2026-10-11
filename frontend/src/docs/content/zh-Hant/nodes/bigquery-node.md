# BigQuery

**BigQuery** 節點透過 BigQuery REST API v2 執行 SQL 查詢，並將資料列插入 Google BigQuery 資料集。使用此節點可查詢大型分析資料集，或將 Workflow 資料中的資料列串流插入資料表。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | BigQuery (OAuth2) |
| 輸出 | `$nodeLabel.rows`、`$nodeLabel.total`、`$nodeLabel.schema`、`$nodeLabel.insertedCount`、`$nodeLabel.errors` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 BigQuery Credential |
| `bqOperation` | string | 操作：`query` 或 `insertRows` |
| `bqProjectId` | expression | Google Cloud 專案 ID（例如 `my-gcp-project`） |
| `bqQuery` | expression | SQL 查詢字串。`query` 操作必填。 |
| `bqMaxResults` | string | `query` 傳回的資料列數上限（預設為 `1000`）。 |
| `bqDatasetId` | expression | 資料集 ID（例如 `my_dataset`）。`insertRows` 操作必填。 |
| `bqTableId` | expression | 資料表 ID（例如 `my_table`）。`insertRows` 操作必填。 |
| `bqRowsInputMode` | `raw` \| `selective` | 用於 `insertRows`：**Raw** = 完整 JSON 陣列；**Selective** = 以鍵值欄位對表示的單一資料列。 |
| `bqRows` | expression | raw 模式下的資料列物件 JSON 陣列（例如 `[{"col": "$input.value"}]`）。 |
| `bqMappings` | array | selective 模式的鍵值對。每個鍵為欄位名稱；每個值為 expression。 |

## Credential 設定

BigQuery 採用 **OAuth2「Bring Your Own App」** 模式。您需提供自己的 Google Cloud OAuth2 認證資訊。

**後端設定：** 將 Heym 後端的 **`FRONTEND_URL`** 設為應用程式的公開 URL（使用者在瀏覽器中輸入的位址），例如 `https://your-heym-domain`。OAuth 重新導向 URI 一律為 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。

1. 前往 [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → 啟用 **BigQuery API**。
2. 前往 **Credentials** → **Create Credentials** → **OAuth client ID** → 選擇 **Web application**。
3. 在 **Authorized redirect URIs** 下，確切加入：`{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`。
4. 複製 **Client ID** 與 **Client Secret**。
5. 在 Heym Dashboard → **Credentials** → **New** → 選擇 **BigQuery (OAuth2)**。
6. 輸入 Client ID、Client Secret 及名稱，然後點擊 **Connect**，於瀏覽器彈出視窗中完成 OAuth2 同意流程。

Token 會在背景自動更新——無需手動管理 Token。

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|-----------------|-------------|
| `query` | bqProjectId、bqQuery | 執行 SQL 查詢並傳回資料列 |
| `insertRows` | bqProjectId、bqDatasetId、bqTableId、bqRows 或 bqMappings | 透過串流 insertAll API 插入一或多個資料列 |

## 輸出參考

| 操作 | 輸出欄位 | 類型 | 說明 |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | 資料列物件陣列（欄位名稱 → 值） |
| `query` | `.total` | number | 傳回的資料列數 |
| `query` | `.schema` | array | 資料表 schema 欄位 |
| `insertRows` | `.insertedCount` | number | 成功插入的資料列數 |
| `insertRows` | `.errors` | array | 各資料列的插入錯誤（完全成功時為空） |

## 範例 – 執行查詢

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

存取輸出：`$getUsers.rows`（資料列物件陣列）、`$getUsers.rows[0].email`、`$getUsers.total`。

## 範例 – 插入資料列

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## 相關內容

- [Node Types](../reference/node-types.md) – 所有節點類型概觀
- [Credentials Tab](../tabs/credentials-tab.md) – 新增 BigQuery OAuth2 Credential
- [Google Sheets](./google-sheets-node.md) – 試算表資料的類似 OAuth2 模式
- [Third-Party Integrations](../reference/integrations.md) – 整合 Credential 設定

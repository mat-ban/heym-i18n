# ClickHouse

**ClickHouse** 節點會透過其 HTTP 介面，對外部 [ClickHouse](https://clickhouse.com/) 資料庫執行 CRUD、count 及原始 SQL 操作。你可以用它從 Workflow 將事件寫入 ClickHouse 資料表、讀取或彙總分析資料，或執行任意 SQL —— 無需手動撰寫 HTTP 請求。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| Credential | ClickHouse |
| 輸出 | `$nodeLabel.rows`、`$nodeLabel.count`、`$nodeLabel.row`、`$nodeLabel.success` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 ClickHouse credential |
| `clickhouseOperation` | string | 操作：`query`、`find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove` 或 `upsert` |
| `clickhouseTable` | expression | 簡易資料表名稱。除 `query` 外的所有操作皆必填。 |
| `clickhouseQuery` | expression | 用於 `query` 的原始 SQL。`SELECT`/`SHOW`/`DESCRIBE` 會回傳資料列；其他語句則以指令形式執行。 |
| `clickhouseFilter` | expression | 等值篩選條件的 JSON 物件，例如 `{"status":"active"}`。供 `find`、`count`、`update` 及 `remove` 使用。值會以參數化方式傳遞。 |
| `clickhouseLimit` | string | `find` / `getAll` 的最大資料列數（`0` = 無限制，不含 LIMIT 子句）。預設為 `100`。 |
| `clickhouseSort` | expression | 供 `find` 使用的選用 `column` 或 `column ASC\|DESC` |
| `clickhouseRowId` | expression | 用於 `getById`，與資料表 `id` 欄位比對的值 |
| `clickhouseInputMode` | string | 用於 `insert`/`upsert`：`raw` JSON 陣列模式或 `selective` 鍵/值欄位模式 |
| `clickhouseData` | expression | 用於 `insert`/`upsert` 的資料列物件 JSON 陣列，或用於 `update` 的欄位值 JSON 物件 |
| `clickhouseMappings` | array | 當 `clickhouseInputMode` 為 `selective` 時使用的 `{key, value}` 配對 |

## Credential 設定

在 [Credentials 分頁](../tabs/credentials-tab.md)建立 **ClickHouse** credential，設定如下：

1. **Host** —— 不含 scheme 的 HTTP 主機，例如 `your-instance.clickhouse.cloud`
2. **Port** —— HTTP 介面連接埠（HTTPS 為 `8443`，HTTP 為 `8123`）
3. **Username** / **Password** —— 預設為 `default` 搭配空密碼
4. **Database** —— 預設為 `default`
5. **Secure** —— 啟用 HTTPS（ClickHouse Cloud）

此節點透過官方 `clickhouse-connect` HTTP 用戶端連線。儲存前，請在 credential 對話框中使用 **Test connection** 驗證可連線性。

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | 執行原始 SQL。`SELECT` 回傳 `{rows, count}`；其他語句回傳 `{result}`。 |
| `find` | `clickhouseTable` | 讀取資料列，可選用等值篩選、排序及限制 |
| `getAll` | `clickhouseTable` | 在限制範圍內讀取資料列，不套用篩選 |
| `count` | `clickhouseTable` | 計算資料列數，可選用篩選 |
| `getById` | `clickhouseTable`、`clickhouseRowId` | 依 `id` 欄位讀取單一資料列 |
| `insert` | `clickhouseTable`、`clickhouseData` 或 mappings | 插入一或多個資料列 |
| `update` | `clickhouseTable`、`clickhouseData`、`clickhouseFilter` | 透過 `ALTER TABLE ... UPDATE` 更新符合的資料列 |
| `remove` | `clickhouseTable`、`clickhouseFilter` | 透過 `DELETE FROM` 刪除符合的資料列 |
| `upsert` | `clickhouseTable`、`clickhouseData` 或 mappings | 插入資料列（假設資料表為 `ReplacingMergeTree`） |

## 篩選語法

`clickhouseFilter` 是欄位等值檢查的扁平 JSON 物件。值會以綁定的查詢參數傳送，因此可安全防範注入。

```json
{ "status": "active", "tenant_id": 42 }
```

這會編譯為 `WHERE status = {…:String} AND tenant_id = {…:Int64}`。篩選器建構工具僅支援等值 —— 若需範圍、join 或彙總，請使用 `query` 操作搭配原始 SQL。

## 輸入模式（insert / upsert）

- **JSON 陣列**（`raw`）：在 `clickhouseData` 中提供資料列物件的 JSON 陣列。特定資料列缺少的鍵會以 `NULL` 插入。欄位集合為所有資料列鍵的聯集。
- **鍵值**（`selective`）：在你選擇 credential 與資料表後，編輯器會探索資料表欄位，並為每個欄位建立一個值欄位。每次執行插入一列；每個值皆支援 expression。

## 變更與 ClickHouse 語意

ClickHouse 是 OLAP 資料庫，因此資料列層級的寫入行為與 OLTP 儲存不同：

- **`update`** 發出 `ALTER TABLE … UPDATE`，而 **`remove`** 發出 `DELETE FROM`。兩者皆為**非同步變更** —— 最終才會套用，且相對耗費資源。請優先採用批次寫入，而非頻繁的單列變更。
- **`upsert`** 執行 `INSERT`。若要取得依鍵合併的行為，請讓資料表以 `ReplacingMergeTree` 引擎為基礎。
- **`getById`** 假設資料表具有 `id` 欄位。
- `update` 與 `remove` 需要非空的 `clickhouseFilter`，以避免全表變更。

## 輸出參考

| 輸出欄位 | 類型 | 說明 |
|-------------|------|-------------|
| `.rows` | array | 回傳的資料列物件（`query` SELECT、`find`、`getAll`） |
| `.count` | number | 資料列數（`find`、`getAll`、`count`、`insert`/`upsert`） |
| `.row` | object | 單一資料列或 `null`（`getById`） |
| `.result` | string | 非 SELECT `query` 的指令摘要 |
| `.success` | boolean | 操作是否成功 |
## 範例 – 插入事件

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## 範例 – 計算活躍使用者

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

存取輸出：`$activeCount.count`。

## 範例 – 每日報表查詢

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

存取輸出：`$dailyReport.rows`、`$dailyReport.count`。

## 相關

- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增 ClickHouse credentials
- [第三方整合](../reference/integrations.md) – 整合 credential 設定

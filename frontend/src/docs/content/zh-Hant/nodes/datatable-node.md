# DataTable

**DataTable** 節點會讀取、寫入及管理 Heym DataTables 中的資料。當您需要對第一方結構化儲存進行 CRUD 操作，且不想使用外部憑證時，請使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.rows`、`$nodeLabel.row`、`$nodeLabel.success`、`$nodeLabel.id` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `dataTableId` | UUID | 來自 [DataTable 分頁](../tabs/datatable-tab.md) 的 DataTable |
| `dataTableOperation` | string | 操作：`find`、`getAll`、`count`、`getById`、`insert`、`update`、`remove`、`upsert` |
| `dataTableRowId` | expression | 資料列 UUID（用於 getById、update、remove） |
| `dataTableData` | JSON string | 欄位值：`{"column_name": "value"}` |
| `dataTableFilter` | JSON string | 篩選條件（find/upsert/count）。`find` 與 `count` 支援運算子 `{"age": {"$gt": 18}}`；`upsert` 使用完全相符的 `{"column_name": "value"}` |
| `dataTableSort` | string | 排序欄位，加上前綴 `-` 表示遞減排序 |
| `dataTableLimit` | number | 傳回的資料列數上限（預設：100） |

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|----------------|-------------|
| `find` | dataTableId | 尋找符合選用運算子篩選條件的資料列，可選擇排序/限制 |
| `getAll` | dataTableId | 取得所有資料列，可選擇排序/限制 |
| `count` | dataTableId | 計算符合選用運算子篩選條件的資料列數（在資料庫中計算；僅傳回數字） |
| `getById` | dataTableId、dataTableRowId | 依 UUID 取得單一資料列 |
| `insert` | dataTableId、dataTableData | 插入新資料列 |
| `update` | dataTableId、dataTableRowId、dataTableData | 更新資料列（合併資料） |
| `remove` | dataTableId、dataTableRowId | 刪除資料列 |
| `upsert` | dataTableId、dataTableFilter、dataTableData | 若找到相符項目則更新，否則插入 |

## 範例 - 尋找資料列

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## 範例 - 插入資料列

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## 範例 - 計算資料列數

在單一節點中計算符合條件的資料列數，而不需使用 `getAll` → If/Else → Map。

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

結果可透過 `$activeAdults.count` 取得。空白的篩選條件或省略篩選條件會計算每一列。

### Find 與 count 的篩選運算子

在 `find` 或 `count` 篩選條件中，單純的值代表等於；物件值則會套用運算子：

| 運算子 | 意義 |
|----------|---------|
| `$eq`（或單純的值） | 等於 |
| `$ne` | 不等於 |
| `$gt`、`$gte`、`$lt`、`$lte` | 大於/小於比較（若欄位類型為 `number` 則為數值比較，否則為文字比較） |
| `$contains` | 不區分大小寫的子字串比對 |
| `$in` | 值位於給定的陣列中 |

結合多個運算子的範例：`{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`。未知的運算子會被忽略。`upsert` 篩選條件仍使用完全相符的值來尋找要更新的資料列。

您也可以依資料列中繼資料進行篩選 — `id`、`table_id`、`created_at`、`updated_at`、`created_by`、`updated_by` — 這些中繼資料會儲存為實際的欄位，而非儲存於您的資料內。若為日期，請傳入完整值以進行範圍比較（例如 `{"created_at": {"$gt": "2026-06-04"}}`），或使用 `$contains` 進行部分文字比對（例如 `{"created_at": {"$contains": "2026-06-04"}}`）。若您自己的欄位名稱與中繼資料欄位相同，則以資料欄位優先。

## 輸出存取

- `$nodeLabel.success` - 布林值成功狀態
- `$nodeLabel.rows` - 資料列陣列（find、getAll）
- `$nodeLabel.row` - 單一資料列物件（getById、insert、update、upsert）
- `$nodeLabel.row.data.column_name` - 存取特定欄位值
- `$nodeLabel.count` - 資料列數（find/getAll 傳回的資料列數；count 為符合條件的資料列總數）
- `$nodeLabel.id` - 資料列 UUID（insert、update、remove）
- `$nodeLabel.found` - 布林值（getById）
- `$nodeLabel.operation` - 操作名稱（例如 `count`；upsert 為 `insert`/`update`）

## 不需要憑證

與外部整合不同，DataTable 操作的是 Heym 的內部資料庫。系統會自動檢查 Workflow 擁有者的存取權限。

## 由 AI Assistant 建置

當 [AI Assistant](../reference/ai-assistant.md#data-tables) 或 [Chat](../tabs/chat-tab.md) 建置此節點時，它會與您一起挑選或建立資料表，並將資料表的確切欄位名稱寫入 `dataTableData` 與 `dataTableFilter`。

## 相關內容

- [DataTable 分頁](../tabs/datatable-tab.md) - 建立及管理資料表
- [Grist 節點](./grist-node.md) - 外部試算表整合
- [Expression DSL](../reference/expression-dsl.md) - 動態值的表達式語法

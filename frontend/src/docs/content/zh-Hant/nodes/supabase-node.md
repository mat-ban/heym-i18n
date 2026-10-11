# Supabase

**Supabase** 節點會透過 Supabase 專案的 PostgREST API 讀取並變更資料表。當您希望 Workflow 能存取以 SQL 為基礎的應用程式狀態，而不想手動撰寫 HTTP 請求時，即可使用此節點。

## 概觀

| 屬性 | 值 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Supabase |
| Output | `$nodeLabel.rows`、`$nodeLabel.count`、`$nodeLabel.success` |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `credentialId` | UUID | 來自 [Credentials](../tabs/credentials-tab.md) 的 Supabase 認證 |
| `supabaseOperation` | string | 操作類型：`select`、`insert`、`update`、`upsert` 或 `delete` |
| `supabaseSchema` | expression | Schema 名稱。若留空，節點會使用認證的預設 schema，接著使用 `public`。 |
| `supabaseTable` | expression | 要查詢或變更的簡易資料表名稱。請將 schema 放在 `supabaseSchema`，而非此處。 |
| `supabaseSelectColumns` | expression | 供 `select` 使用的逗號分隔 PostgREST select 清單（預設為 `*`） |
| `supabaseFilter` | expression | JSON 篩選物件。支援精確比對、運算子物件及邏輯群組，例如 `{"id":123}`、`{"created_at":{"gte":"2026-01-01"}}` 或 `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | `select` 要傳回的資料列數上限（`0` = 透過伺服器端分頁擷取所有符合的資料列，負值則回退為 `100`） |
| `supabaseOrderBy` | expression | 供 `select` 使用的選用排序欄位 |
| `supabaseAscending` | boolean | 為 `true` 時遞增排序，為 `false` 時遞減排序 |
| `supabaseRowsInputMode` | string | 供 `insert`/`upsert` 使用：`raw` JSON 陣列模式，或 `auto` 以自動對應單一上游輸入 |
| `supabaseDataInputMode` | string | 供 `update` 使用：`raw` JSON 物件模式，或 `auto` 以自動對應單一上游輸入 |
| `supabaseIgnoredInputFields` | string | 自動對應輸入資料時要略過的選用逗號分隔欄位名稱 |
| `supabaseRows` | expression | 供 `insert` 與 `upsert` 使用的資料列物件 JSON 陣列 |
| `supabaseOnConflict` | expression | 供 `upsert` 使用的選用逗號分隔衝突目標欄位，例如 `id` 或 `tenant_id,email` |
| `supabaseData` | expression | 供 `update` 使用的更新欄位值 JSON 物件 |

## Credential 設定

在 [Credentials 分頁](../tabs/credentials-tab.md)中建立 **Supabase** 認證，內容包含：

1. 您的 **Project URL**，例如 `https://your-project.supabase.co`
2. 可存取此 Workflow 應使用之資料表的 **API key**
3. 選用的 **預設 schema**（預設為 `public`）

此節點會與位於 `/rest/v1/<table>` 的 Supabase PostgREST endpoint 通訊。
`supabaseTable` 僅供填寫資料表，例如 `users` 或 `profiles`。請勿於此處傳入 `schema.table`、`rpc/...` 或其他 API 路徑。

當選取了有效的 Supabase 認證後，編輯器可直接從 PostgREST OpenAPI metadata 探索已暴露的資料表與資料表
欄位。使用 **discovered tables** 下拉式選單來
挑選資料表，並使用 **Select Columns** 下方的 **column chips** 快速建立 select 清單。

## 操作

| 操作 | 必填欄位 | 說明 |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | 讀取資料列，可選擇性使用精確比對篩選、limit 及排序 |
| `insert` | `supabaseTable`、`supabaseRows` 或自動對應輸入 | 插入一或多個資料列 |
| `update` | `supabaseTable`、`supabaseData` 或自動對應輸入、`supabaseFilter` | 更新符合篩選條件的資料列 |
| `upsert` | `supabaseTable`、`supabaseRows` 或自動對應輸入 | 使用 Supabase upsert 語意插入或合併資料列。當您需要明確的衝突目標時，請使用 `supabaseOnConflict`。 |
| `delete` | `supabaseTable`、`supabaseFilter` | 刪除符合篩選條件的資料列 |

## 篩選語法

`supabaseFilter` 會將結構化 JSON 編譯為 PostgREST 查詢參數。

- 精確比對：`{"status":"active"}`
- 比較：`{"created_at":{"gte":"2026-01-01"}}`
- 成員資格：`{"status":{"in":["active","paused"]}}`
- 模式比對：`{"email":{"ilike":"*@example.com"}}`
- 邏輯 OR：`{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- 邏輯 AND：`{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

若同一欄位要使用多個運算子，建議改用邏輯群組：

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## 分頁

`select` 現在會對 PostgREST 執行真正的伺服器端分頁。

- `supabaseLimit: "0"` 會逐頁擷取所有符合的資料列
- 超過 1000 的 `supabaseLimit` 值會自動展開為多個請求
- 結果會合併回單一 `.rows` 陣列，且 `.count` 會維持符合條件的資料列總數

讀取大型資料表時，請設定穩定的 `supabaseOrderBy`，以維持可預測的分頁邊界。

## 自動對應輸入

對於 `insert`、`upsert` 及 `update`，當單一上游節點已輸出您想寫入的形狀時，
請將節點切換為 **Auto-map input**。

- 單一物件會成為一個資料列或一筆更新 payload
- 物件陣列會成為 `insert` / `upsert` 的多個資料列
- 帶有 `rows` 陣列的上游物件會直接重用該陣列
- `supabaseIgnoredInputFields` 可讓您捨棄 `id`、`created_at` 或 `success` 等欄位
## 輸出參考

| 輸出欄位 | 類型 | 說明 |
|-------------|------|-------------|
| `.rows` | array | 回傳的資料列物件 |
| `.count` | number | 回傳或受影響的資料列數量 |
| `.success` | boolean | 操作是否成功 |

## 範例 – 選取作用中的使用者

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

存取輸出：`$activeUsers.rows`、`$activeUsers.rows[0].email`、`$activeUsers.count`。

## 範例 – Upsert 一筆個人資料列

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## 相關

- [節點類型](../reference/node-types.md) – 所有節點類型總覽
- [Credentials 分頁](../tabs/credentials-tab.md) – 新增 Supabase credentials
- [第三方整合](../reference/integrations.md) – 整合 credential 設定

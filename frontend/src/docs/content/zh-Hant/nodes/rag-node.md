# RAG / 向量儲存

**RAG / Vector Store** 節點會在向量儲存區中插入、upsert、刪除及搜尋文件，以實現檢索增強生成（Retrieval Augmented Generation，RAG）。使用此節點可透過相關文件擴充 LLM 上下文，並讓該上下文與文件來源系統保持同步。

此節點具有一個 **Database** 下拉式選單，用於選擇後端：

- **Qdrant** – 將向量儲存於外部 Qdrant 伺服器（需要 *RAG: Qdrant + OpenAI* 認證）。
- **Postgres (pgvector)** – 將向量儲存於 Heym 自身的 Postgres 資料庫內，無需外部服務（需要 *RAG: Psql + OpenAI* 認證）。

為維持向後相容性，預設值為 **Qdrant**。變更 Database 會將 **Vector Store** 清單篩選為由該資料庫支援的儲存區。兩種後端皆支援相同的操作、中繼資料篩選、混合（向量 + BM25）搜尋及 Cohere 重排序。

任一後端亦可透過 *RAG: Custom Embeddings* 認證存取，該認證會以任何與 OpenAI 相容的嵌入端點取代 OpenAI，並為其自身的向量儲存區命名。以此類認證建立的儲存區會顯示於其目標 Database 之下。請參閱 [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag)。

## 概觀

| 屬性 | 值 |
|----------|-------|
| 輸入 | 1 |
| 輸出 | 1 |
| 輸出 | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count`（搜尋）、`$nodeLabel.point_id`（插入、upsert）、`$nodeLabel.deleted`（刪除） |

## 參數

| 參數 | 類型 | 說明 |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | 向量儲存區後端（預設：`"qdrant"`） |
| `vectorStoreId` | UUID | 來自 [Vectorstores](../tabs/vectorstores-tab.md) 分頁的向量儲存區 |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | 操作類型（亦可使用 `operation`） |
| `documentContent` | expression | 要儲存的文件文字（插入、upsert） |
| `documentMetadata` | JSON string | 已儲存文件的中繼資料（插入、upsert）；值支援表達式 |
| `documentIdField` | string | 存放唯一 id 的 Payload 欄位（upsert、刪除；預設為 `doc_id`） |
| `documentId` | expression | 唯一 id 的值（upsert、刪除） |
| `queryText` | expression | 搜尋查詢（僅限搜尋） |
| `searchLimit` | number | 結果數量上限（預設：5） |
| `metadataFilters` | JSON string | 搜尋用的中繼資料篩選條件（值支援表達式） |
| `hybridSearch` | boolean | 將向量搜尋與 BM25 關鍵字搜尋結合（僅限 search；預設：關閉） |
| `enableReranker` | boolean | 使用 Cohere 對搜尋結果進行重排序 |
| `rerankerCredentialId` | UUID | 用於重排序的 Cohere 認證 |
| `rerankerTopN` | number | 重排序後保留的頂部結果數量 |

## 操作

### Insert

將文件新增至向量儲存區。

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `documentContent` | 是 | 要嵌入並儲存的文字 |
| `documentMetadata` | 否 | JSON 物件，例如 `{"source": "user", "category": "general"}` |

**輸出：** `$nodeLabel.status`、`$nodeLabel.inserted_ids`

### 中繼資料表達式

中繼資料值支援表達式，因此文件可連同該次執行的上下文一併儲存：

```json
{ "url": "$start.url", "category": "faq" }
```

表達式是在 JSON 解析完成後才解析，而非將文字替換至 JSON 中，因此含有引號或換行的值不會破壞物件結構。若某個值本身即為一個完整表達式，則會保留其解析後的類型 — `{"count": "$start.count"}` 會儲存數字，而非 `"7"` — 這點很重要，因為搜尋的 `metadataFilters` 會依精確類型進行比對。混合文字（例如 `"page $start.count"`）會解析為字串，而巢狀物件與陣列亦會被逐層處理。

同樣的規則亦適用於 `upsert` 及搜尋的 `metadataFilters`：會先解析，再依相同規則解析其值。因此，寫成 `{"count": "$start.count"}` 的篩選條件會比對插入時所儲存的數字，而非字串 `"7"`。

### 哪個 Workflow 儲存了文件

若儲存的文件本身沒有 `source`，則會以儲存該文件的 Workflow 標記，形式為 `source: "workflow:<workflow name>"`。[Vectorstores](../tabs/vectorstores-tab.md) 分頁會將這些文件歸類於 **Added workflow: _name_** 之下，因此儲存區的內容會顯示每份文件的來源，且可將單一 Workflow 的文件作為一個群組刪除。在 `documentMetadata` 中自行設定 `source` 一律優先於該標記。

### Upsert

插入文件，或取代已以相同唯一 id 儲存的文件。

該 id 是 **Payload 內**的欄位，而非儲存區的內部 point id，因此文件會保留您自身系統已使用的識別碼 — 例如 CRM 記錄 id、SKU、頁面 slug。`documentIdField` 指定該欄位名稱，`documentId` 則帶有其值。

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `documentId` | 是 | 文件的唯一 id（支援表達式） |
| `documentContent` | 是 | 要嵌入並儲存的文字 |
| `documentIdField` | 否 | id 所在的 Payload 欄位（預設為 `doc_id`） |
| `documentMetadata` | 否 | JSON 物件，例如 `{"source": "crm", "url": "$start.url"}`（值支援表達式） |

所有 id 欄位相符的 point 會先被移除，因此先前以多個區塊儲存的文件會整體被取代，而非重複。id 欄位會自動寫入 Payload，且同一份文件在多次 upsert 之間，point id 會保持穩定。

**輸出：** `$nodeLabel.point_id`、`$nodeLabel.document_id`、`$nodeLabel.replaced`（boolean — 是否取代了既有版本）、`$nodeLabel.replaced_count`
### Delete

透過相同的唯一 id 移除文件。

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `documentId` | 是 | 文件的唯一 id（支援表達式） |
| `documentIdField` | 否 | id 所在的 Payload 欄位（預設為 `doc_id`） |

**輸出：** `$nodeLabel.deleted` – 當至少有一個 point 符合時為 `true`，當該 id 不存在於儲存區時為 `false`。`$nodeLabel.deleted_count` 會帶出移除了多少個 point。

刪除一個不存在的 id 並非錯誤：該節點會成功執行並回傳 `deleted: false`，因此清理分支不需要在前面加上防護判斷。

### Search

針對相似文件進行語意搜尋。

| 欄位 | 必填 | 說明 |
|-------|----------|-------------|
| `queryText` | 是 | 搜尋查詢 |
| `searchLimit` | 否 | 最大結果數（預設：5） |
| `metadataFilters` | 否 | 依 metadata 篩選（精確比對 JSON 物件，值支援表達式） |
| `hybridSearch` | 否 | 將向量相似度與 BM25 關鍵字比對融合（參見[混合搜尋](#混合搜尋)） |
| `enableReranker` | 否 | 啟用 Cohere reranking 以提升相關性 |
| `rerankerCredentialId` | 啟用 reranking 時 | Cohere 認證 |
| `rerankerTopN` | 否 | reranking 後的最終結果數量 |

**輸出：** `$nodeLabel.results` – `{ id, text, score, metadata }` 的陣列

當啟用 reranking 時：

- `$nodeLabel.reranked` 會變成 `true`
- 每個結果也會包含 `relevance_score`
- `score` 仍為原始的向量相似度分數
- `relevance_score` 為 Cohere reranker 分數


#### 混合搜尋

向量搜尋能找出與查詢語義相同的文字。僅包含完全符合字詞的文字排名可能較低：例如產品代碼、工單編號、人名、類似 `ERR-4021` 的錯誤代碼。開啟**混合搜尋**後，節點將在向量搜尋的同時執行關鍵字搜尋並合併兩個清單，使單次查詢能同時取得兩種比對結果。

1. 向量搜尋傳回其最佳比對結果，與未啟用混合搜尋時相同。
2. 關鍵字搜尋使用 **BM25** 演算法根據查詢詞對儲存的文字進行評分，該演算法偏好罕見詞、重複詞與較短的文件。
3. 兩個排序清單透過 **倒數排名融合（reciprocal rank fusion）** 進行合併。同時位於兩個清單前列的文件將排名第一，僅被單一清單找到的文件仍會顯示。

中繼資料篩選條件同時適用於兩種搜尋；若啟用了 Cohere 重排序器，它將在合併後的清單上運作。

每個結果皆包含兩種搜尋的分數：

| 欄位 | 意義 |
|------|------|
| `score` | 0 到 1 的融合分數。`1` 表示該文件在兩種搜尋中皆排名第一。 |
| `vector_score` | 向量相似度（0 到 1）。僅當關鍵字搜尋找到該文件時為 `null`。 |
| `keyword_score` | BM25 分數。當文件中未出現任何查詢詞時為 `null`。 |

當混合搜尋執行時，`$nodeLabel.hybrid` 為 `true`。

注意事項：

- 融合後的 `score` 用於對結果進行相對排序。它不是向量相似度，因此針對一般搜尋調整的閾值無法直接沿用。
- 查詢詞會轉為小寫並在空格及標點符號處分割，因此 `ERR-4021` 會以 `err` 與 `4021` 進行搜尋。關鍵字搜尋最多使用查詢中的前 16 個不重複字詞。
- Qdrant：在集合上首次執行混合搜尋時，會在 `text` payload 欄位上建立全文索引，這需要具備寫入權限的 Qdrant 金鑰。對於大型集合，此操作僅需耗時一次；後續搜尋將重複使用該索引。
- Postgres (pgvector)：資料庫遷移 `142_vsi_text_search_index` 新增了全文索引。更新後請執行 `alembic upgrade head`。混合搜尋在沒有索引的情況下也能運作，但在大型儲存區中速度較慢。
- 針對每次查詢，關鍵字搜尋最多讀取 200 筆相符文件，並從最罕見的查詢詞開始讀取，因為它們權重最高。
## 存取結果

- `$ragNode.results.first().text` – 最頂端結果的內容
- `$ragNode.results.first().score` – 相似度分數（0–1），或混合搜尋的融合分數
- `$ragNode.results.first().keyword_score` – BM25 分數（混合搜尋）
- `$ragNode.results.first().vector_score` – 向量相似度（混合搜尋）
- `$ragNode.results.first().metadata.source` – 最頂端結果的 metadata
- `$ragNode.results.map("item.text").join("\n\n")` – 串接以作為 LLM 上下文
- `$ragNode.reranked` – 是否套用了 reranking
- `$ragNode.hybrid` – 是否套用了混合搜尋
- `$ragNode.count` – 回傳的結果數量
- `$ragNode.replaced` – upsert 是否取代了既有文件
- `$ragNode.deleted` – delete 是否移除了任何內容

## 範例 – Search

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## 範例 – 混合搜尋

```json
{
  "type": "rag",
  "data": {
    "label": "findTicket",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "hybridSearch": true
  }
}
```

## 範例 – Insert

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## 範例 – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## 範例 – Delete

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## 相關

- [Why Heym](../getting-started/why-heym.md) – 內建 RAG 作為 agent runtime 的一部分
- [Node Types](../reference/node-types.md) – 所有節點類型總覽
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – 建立與管理 vector store
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Qdrant 與 Postgres（pgvector）認證設定
- [Agent Node](./agent-node.md) – 將 RAG 結果作為 agent 上下文使用
- [LLM Node](./llm-node.md) – 將 RAG 結果饋入 LLM system prompt

# RAG / 向量存储

**RAG / Vector Store** 节点用于在向量存储中插入、更新插入、删除和搜索文档，以支持检索增强生成（RAG）。使用该节点可以用相关文档增强 LLM 上下文，并使该上下文与文档来源系统保持同步。

该节点提供一个 **Database** 下拉菜单用于选择后端：

- **Qdrant** – 将向量存储在外部 Qdrant 服务器中（需要 *RAG: Qdrant + OpenAI* 凭证）。
- **Postgres (pgvector)** – 将向量存储在 Heym 自有的 Postgres 数据库中，无需外部服务（需要 *RAG: Psql + OpenAI* 凭证）。

默认值为 **Qdrant**，以保持向后兼容。更改 Database 会将 **Vector Store** 列表筛选为该数据库支持的存储。两种后端均支持相同的操作、元数据过滤、混合（向量 + BM25）搜索和 Cohere 重排序。

任一后端也可通过 *RAG: Custom Embeddings* 凭证访问，该凭证将 OpenAI 替换为任何兼容 OpenAI 的嵌入 Endpoint，并使用其自有的向量存储。通过此类凭证创建的存储会显示在其所指向的 Database 下。参见 [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag)。

## 概述

| 属性 | 值 |
|----------|-------|
| 输入 | 1 |
| 输出 | 1 |
| 输出 | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count`（搜索），`$nodeLabel.point_id`（插入、更新插入），`$nodeLabel.deleted`（删除） |

## 参数

| 参数 | 类型 | 描述 |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | 向量存储后端（默认：`"qdrant"`） |
| `vectorStoreId` | UUID | 来自 [Vectorstores](../tabs/vectorstores-tab.md) 标签页的向量存储 |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | 操作类型（也可写作 `operation`） |
| `documentContent` | expression | 要存储的文档文本（插入、更新插入） |
| `documentMetadata` | JSON string | 存储文档的元数据（插入、更新插入）；值支持表达式 |
| `documentIdField` | string | 存放唯一 id 的 Payload 字段（更新插入、删除；默认 `doc_id`） |
| `documentId` | expression | 唯一 id 的值（更新插入、删除） |
| `queryText` | expression | 搜索查询（仅搜索） |
| `searchLimit` | number | 最大结果数（默认：5） |
| `metadataFilters` | JSON string | 搜索的元数据过滤器（值支持表达式） |
| `hybridSearch` | boolean | 将向量搜索与 BM25 关键词搜索结合（仅 search；默认：关闭） |
| `enableReranker` | boolean | 使用 Cohere 对搜索结果进行重排序 |
| `rerankerCredentialId` | UUID | 用于重排序的 Cohere 凭证 |
| `rerankerTopN` | number | 重排序后保留的顶部结果数量 |

## 操作

### 插入

将文档添加到向量存储。

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `documentContent` | 是 | 要嵌入并存储的文本 |
| `documentMetadata` | 否 | JSON 对象，例如 `{"source": "user", "category": "general"}` |

**输出：** `$nodeLabel.status`、`$nodeLabel.inserted_ids`

### 元数据表达式

元数据值支持表达式，因此文档可以携带来自本次运行的上下文进行存储：

```json
{ "url": "$start.url", "category": "faq" }
```

表达式在 JSON 解析完成之后才被解析，而不是通过将文本替换进 JSON 中，因此包含引号或换行的值不会破坏对象结构。若某个值整体是一个表达式，则保留其解析后的类型 —— `{"count": "$start.count"}` 存储的是数字，而不是 `"7"` —— 这一点很重要，因为搜索的 `metadataFilters` 按精确类型进行匹配。混合文本（如 `"page $start.count"`）会解析为字符串，嵌套对象和数组也会被遍历。

同样的规则适用于 `upsert` 以及搜索的 `metadataFilters`：先解析 JSON，再按相同规则解析其值。因此，写成 `{"count": "$start.count"}` 的过滤器会匹配插入时存储的数字，而不是字符串 `"7"`。

### 哪个 Workflow 存储了文档

未自带 `source` 的文档会被标记为存储它的 Workflow，格式为 `source: "workflow:<workflow name>"`。[Vectorstores](../tabs/vectorstores-tab.md) 标签页会将这些文档归组在 **Added workflow: _name_** 下，因此存储的内容会显示每个文档的来源，并且某个 Workflow 的文档可以作为一组被删除。在 `documentMetadata` 中自行设置 `source` 始终优先于该标记。

### 更新插入

插入文档，或替换已存储在同一唯一 id 下的文档。

该 id 是 **Payload 内部** 的字段，而不是存储的内部 point id，因此文档可以保留您自己系统已使用的标识符 —— 例如 CRM 记录 id、SKU、页面 slug。`documentIdField` 指定该字段的名称，`documentId` 携带其值。

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `documentId` | 是 | 文档的唯一 id（支持表达式） |
| `documentContent` | 是 | 要嵌入并存储的文本 |
| `documentIdField` | 否 | id 所在的 Payload 字段（默认 `doc_id`） |
| `documentMetadata` | 否 | JSON 对象，例如 `{"source": "crm", "url": "$start.url"}`（值支持表达式） |

所有 id 字段匹配的 point 会先被移除，因此之前以多个分块存储的文档会被整体替换，而不是重复存储。id 字段会自动写入 Payload，并且同一文档在多次更新插入之间 point id 保持稳定。

**输出：** `$nodeLabel.point_id`、`$nodeLabel.document_id`、`$nodeLabel.replaced`（boolean —— 是否替换了已有版本）、`$nodeLabel.replaced_count`
### Delete

按相同的唯一 id 删除文档。

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `documentId` | 是 | 文档的唯一 id（支持表达式） |
| `documentIdField` | 否 | id 所在的 Payload 字段（默认 `doc_id`） |

**输出：** `$nodeLabel.deleted` – 当至少匹配一个数据点时返回 `true`，当该 id 不在存储中时返回 `false`。`$nodeLabel.deleted_count` 表示删除了多少个数据点。

删除一个不存在的 id 不是错误：节点会成功执行并返回 `deleted: false`，因此清理分支无需在其前面添加保护判断。

### Search

对相似文档进行语义搜索。

| 字段 | 必填 | 描述 |
|-------|----------|-------------|
| `queryText` | 是 | 搜索查询 |
| `searchLimit` | 否 | 最大结果数（默认：5） |
| `metadataFilters` | 否 | 按元数据过滤（精确匹配 JSON 对象，值支持表达式） |
| `hybridSearch` | 否 | 将向量相似度与 BM25 关键词匹配融合（参见[混合搜索](#混合搜索)） |
| `enableReranker` | 否 | 启用 Cohere 重排序以获得更好的相关性 |
| `rerankerCredentialId` | 启用重排序时 | Cohere 凭证 |
| `rerankerTopN` | 否 | 重排序后的最终结果数 |

**输出：** `$nodeLabel.results` – `{ id, text, score, metadata }` 数组

启用重排序时：

- `$nodeLabel.reranked` 变为 `true`
- 每个结果还包含 `relevance_score`
- `score` 仍为原始向量相似度分数
- `relevance_score` 为 Cohere 重排序器分数


#### 混合搜索

向量搜索能找到与查询含义相同的文本。仅包含完全匹配词语的文本可能会排名较低：例如产品代码、工单编号、人名、类似 `ERR-4021` 的错误代码。开启**混合搜索**后，节点将在向量搜索的同时执行关键词搜索并合并两个列表，使一次查询能同时命中这两种类型的匹配项。

1. 向量搜索返回其最佳匹配项，与未启用混合搜索时相同。
2. 关键词搜索使用 **BM25** 算法根据查询词对存储的文本进行打分，该算法偏好生僻词、重复词和较短的文档。
3. 两个排序列表通过 **倒数排名融合（reciprocal rank fusion）** 进行合并。同时位于两个列表前列的文档将排在最前面，仅被一个列表命中的文档仍会显示。

元数据过滤器同时适用于这两种搜索；若启用了 Cohere 重排序器，它将在合并后的列表上运行。

每个结果均包含两种搜索的分数：

| 字段 | 含义 |
|------|------|
| `score` | 0 到 1 的融合分数。`1` 表示该文档在两种搜索中均排名第一。 |
| `vector_score` | 向量相似度（0 到 1）。仅当关键词搜索命中该文档时为 `null`。 |
| `keyword_score` | BM25 分数。当文档中未包含任何查询词时为 `null`。 |

当混合搜索运行时，`$nodeLabel.hybrid` 为 `true`。

注意事项：

- 融合后的 `score` 用于对结果进行相对排序。它不是纯向量相似度，因此针对普通搜索设置的阈值不能直接套用。
- 查询词将转换为小写并在空格和标点符号处切分，因此 `ERR-4021` 会被拆解为 `err` 和 `4021` 进行搜索。关键词搜索最多使用查询中的前 16 个去重词语。
- Qdrant：在集合上首次执行混合搜索时，会在 `text` payload 字段上构建全文索引，这需要具有写权限的 Qdrant 密钥。对于大型集合，此操作仅耗费片刻时间一次；后续搜索将复用该索引。
- Postgres (pgvector)：数据库迁移 `142_vsi_text_search_index` 添加了全文索引。更新后请运行 `alembic upgrade head`。混合搜索在没有索引的情况下也可以运行，但在大型存储中速度较慢。
- 对于每个查询，关键词搜索最多读取 200 个匹配文档，并从最罕见的查询词开始读取，因为它们权重最高。
## 访问结果

- `$ragNode.results.first().text` – 顶部结果内容
- `$ragNode.results.first().score` – 相似度分数（0–1），或混合搜索的融合分数
- `$ragNode.results.first().keyword_score` – BM25 分数（混合搜索）
- `$ragNode.results.first().vector_score` – 向量相似度（混合搜索）
- `$ragNode.results.first().metadata.source` – 顶部结果元数据
- `$ragNode.results.map("item.text").join("\n\n")` – 拼接为 LLM 上下文
- `$ragNode.reranked` – 是否应用了重排序
- `$ragNode.hybrid` – 是否应用了混合搜索
- `$ragNode.count` – 返回的结果数
- `$ragNode.replaced` – upsert 是否替换了现有文档
- `$ragNode.deleted` – delete 是否删除了任何内容

## 示例 – Search

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

## 示例 – 混合搜索

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

## 示例 – Insert

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

## 示例 – Upsert

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

## 示例 – Delete

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

## 相关内容

- [Why Heym](../getting-started/why-heym.md) – 作为 Agent 运行时一部分的内置 RAG
- [Node Types](../reference/node-types.md) – 所有节点类型概览
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – 创建和管理向量存储
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Qdrant 和 Postgres (pgvector) 凭证设置
- [Agent Node](./agent-node.md) – 将 RAG 结果用作 Agent 上下文
- [LLM Node](./llm-node.md) – 将 RAG 结果输入 LLM 系统 Prompt

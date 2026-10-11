# RAG / ベクトルストア

**RAG / Vector Store** ノードは、Retrieval Augmented Generation（RAG）のために、Vector Store 内のドキュメントの挿入、upsert、削除、および検索を行います。LLM のコンテキストを関連ドキュメントで拡張し、そのコンテキストをドキュメントの取得元システムと同期させ続けるために使用します。

このノードには、バックエンドを選択する **Database** ドロップダウンがあります：

- **Qdrant** – 外部の Qdrant サーバーにベクトルを保存します（*RAG: Qdrant + OpenAI* 認証情報が必要です）。
- **Postgres (pgvector)** – Heym 自身の Postgres データベース内にベクトルを保存します。外部サービスは不要です（*RAG: Psql + OpenAI* 認証情報が必要です）。

後方互換性のため、デフォルトは **Qdrant** です。Database を変更すると、**Vector Store** リストがそのデータベースでバックアップされたストアに絞り込まれます。どちらのバックエンドも、同じ操作、メタデータフィルタリング、および Cohere による reranking をサポートしています。

どちらのバックエンドも、*RAG: Custom Embeddings* 認証情報を通じてアクセスすることもできます。これは OpenAI を任意の OpenAI 互換 embedding エンドポイントに置き換え、独自の Vector Store を指定します。このような認証情報から作成されたストアは、それが対象とする Database の下に表示されます。詳細は [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag) を参照してください。

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count`（search）、`$nodeLabel.point_id`（insert、upsert）、`$nodeLabel.deleted`（delete） |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vector Store バックエンド（デフォルト：`"qdrant"`） |
| `vectorStoreId` | UUID | [Vectorstores](../tabs/vectorstores-tab.md) タブの Vector Store |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | 操作タイプ（`operation` も可） |
| `documentContent` | expression | 保存するドキュメントテキスト（insert、upsert） |
| `documentMetadata` | JSON string | 保存するドキュメントのメタデータ（insert、upsert）。値は式をサポートします |
| `documentIdField` | string | 一意の id を保持する Payload フィールド（upsert、delete。デフォルト `doc_id`） |
| `documentId` | expression | 一意の id の値（upsert、delete） |
| `queryText` | expression | 検索クエリ（search のみ） |
| `searchLimit` | number | 最大結果数（デフォルト：5） |
| `metadataFilters` | JSON string | 検索用のメタデータフィルター（値は式をサポートします） |
| `enableReranker` | boolean | Cohere を使用して検索結果を rerank します |
| `rerankerCredentialId` | UUID | reranking 用の Cohere 認証情報 |
| `rerankerTopN` | number | reranking 後に保持する上位結果の数 |

## Operations

### Insert

Vector Store にドキュメントを追加します。

| Field | Required | Description |
|-------|----------|-------------|
| `documentContent` | yes | embed して保存するテキスト |
| `documentMetadata` | no | JSON オブジェクト。例：`{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`、`$nodeLabel.inserted_ids`

### Metadata expressions

メタデータの値は式を受け付けるため、実行時のコンテキストを持つドキュメントを保存できます：

```json
{ "url": "$start.url", "category": "faq" }
```

式は JSON がパースされた後に解決され、テキストに代入されるわけではないため、引用符や改行を含む値がオブジェクトを壊すことはありません。値全体が 1 つの式である場合は、解決された型がそのまま保持されます — `{"count": "$start.count"}` は `"7"` ではなく数値を保存します — これは検索の `metadataFilters` が厳密な型でマッチするため重要です。`"page $start.count"` のような混在テキストは文字列に解決され、ネストされたオブジェクトや配列も同様に走査されます。

同じことが `upsert` にも、検索の `metadataFilters` にも当てはまります。まずパースされ、その後同じルールで値が解決されます。したがって、`{"count": "$start.count"}` として記述されたフィルターは、insert が保存した数値にマッチし、文字列 `"7"` にはマッチしません。

### Which workflow stored a document

自身の `source` を持たずに保存されたドキュメントには、それを保存した Workflow が `source: "workflow:<workflow name>"` として刻印されます。[Vectorstores](../tabs/vectorstores-tab.md) タブでは、これらが **Added workflow: _name_** の下にグループ化されるため、ストアの内容から各ドキュメントの出所がわかり、ある Workflow のドキュメントをグループとして削除できます。`documentMetadata` で `source` を自分で設定した場合は、常にこの刻印よりも優先されます。

### Upsert

ドキュメントを挿入するか、同じ一意の id で既に保存されているものを置き換えます。

id はストアの内部 point id ではなく、**Payload の内部**のフィールドです。したがって、ドキュメントはお客様自身のシステムが既に使用している識別子 — CRM レコード id、SKU、ページスラッグ — を保持します。`documentIdField` がそのフィールドを指定し、`documentId` がその値を保持します。

| Field | Required | Description |
|-------|----------|-------------|
| `documentId` | yes | ドキュメントの一意の id（式をサポートします） |
| `documentContent` | yes | embed して保存するテキスト |
| `documentIdField` | no | id が存在する Payload フィールド（デフォルト `doc_id`） |
| `documentMetadata` | no | JSON オブジェクト。例：`{"source": "crm", "url": "$start.url"}`（値は式をサポートします） |

id フィールドが一致するすべての point が最初に削除されるため、以前に複数のチャンクとして保存されていたドキュメントは、重複するのではなく全体として置き換えられます。id フィールドは Payload に自動的に書き込まれ、同じドキュメントを upsert しても point id は安定したままです。

**Output:** `$nodeLabel.point_id`、`$nodeLabel.document_id`、`$nodeLabel.replaced`（boolean — 既存のバージョンが置き換えられたかどうか）、`$nodeLabel.replaced_count`
### 削除

同じ一意の id を指定してドキュメントを削除します。

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `documentId` | はい | ドキュメントの一意の id（式をサポート） |
| `documentIdField` | いいえ | id が格納されている Payload フィールド（デフォルトは `doc_id`） |

**出力:** `$nodeLabel.deleted` – 少なくとも 1 件のポイントが一致した場合は `true`、id がストアに存在しなかった場合は `false`。`$nodeLabel.deleted_count` には削除されたポイント数が格納されます。

存在しない id を削除してもエラーにはなりません。ノードは `deleted: false` で正常に完了するため、クリーンアップ用の分岐の前にガードを設ける必要はありません。

### 検索

類似ドキュメントを対象としたセマンティック検索を実行します。

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `queryText` | はい | 検索クエリ |
| `searchLimit` | いいえ | 最大結果数（デフォルト: 5） |
| `metadataFilters` | いいえ | metadata によるフィルタリング（完全一致の JSON オブジェクト、値は式をサポート） |
| `enableReranker` | いいえ | 関連性向上のための Cohere リランキングを有効化 |
| `rerankerCredentialId` | リランキング時 | Cohere の credential |
| `rerankerTopN` | いいえ | リランキング後の最終的な結果数 |

**出力:** `$nodeLabel.results` – `{ id, text, score, metadata }` の配列

リランキングが有効な場合:

- `$nodeLabel.reranked` が `true` になります
- 各結果に `relevance_score` も含まれます
- `score` は元のベクトル類似度スコアのままです
- `relevance_score` は Cohere リランカーのスコアです

## 結果へのアクセス

- `$ragNode.results.first().text` – 最上位の結果の内容
- `$ragNode.results.first().score` – 類似度スコア（0～1）
- `$ragNode.results.first().metadata.source` – 最上位の結果の metadata
- `$ragNode.results.map("item.text").join("\n\n")` – LLM コンテキスト用に連結
- `$ragNode.reranked` – リランキングが適用されたかどうか
- `$ragNode.count` – 返された結果の数
- `$ragNode.replaced` – upsert によって既存のドキュメントが置き換えられたかどうか
- `$ragNode.deleted` – delete によって何かが削除されたかどうか

## 例 – 検索

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

## 例 – 挿入

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

## 例 – Upsert

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

## 例 – 削除

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

## 関連項目

- [Why Heym](../getting-started/why-heym.md) – エージェントランタイムの一部としての組み込み RAG
- [Node Types](../reference/node-types.md) – すべてのノードタイプの概要
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – ベクトルストアの作成と管理
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Qdrant および Postgres（pgvector）の credential 設定
- [Agent Node](./agent-node.md) – RAG の結果をエージェントのコンテキストとして使用
- [LLM Node](./llm-node.md) – RAG の結果を LLM のシステム Prompt に投入

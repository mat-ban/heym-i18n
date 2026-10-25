# RAG / ベクトルストア

**RAG / Vector Store** ノードは、Retrieval Augmented Generation（RAG）のために、Vector Store 内のドキュメントの挿入、upsert、削除、および検索を行います。LLM のコンテキストを関連ドキュメントで拡張し、そのコンテキストをドキュメントの取得元システムと同期させ続けるために使用します。

このノードには、バックエンドを選択する **Database** ドロップダウンがあります：

- **Qdrant** – 外部の Qdrant サーバーにベクトルを保存します（*RAG: Qdrant + OpenAI* 認証情報が必要です）。
- **Postgres (pgvector)** – Heym 自身の Postgres データベース内にベクトルを保存します。外部サービスは不要です（*RAG: Psql + OpenAI* 認証情報が必要です）。

後方互換性のため、デフォルトは **Qdrant** です。Database を変更すると、**Vector Store** リストがそのデータベースでバックアップされたストアに絞り込まれます。どちらのバックエンドも、同じ操作、メタデータフィルタリング、ハイブリッド（ベクトル + BM25）検索、および Cohere による reranking をサポートしています。

どちらのバックエンドも、*RAG: Custom Embeddings* 認証情報を通じてアクセスすることもできます。これは OpenAI を任意の OpenAI 互換 embedding エンドポイントに置き換え、独自の Vector Store を指定します。このような認証情報から作成されたストアは、それが対象とする Database の下に表示されます。詳細は [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag) を参照してください。

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count`（search）、`$nodeLabel.point_id`（insert、upsert）、`$nodeLabel.deleted`（delete） |

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
| `hybridSearch` | boolean | ベクトル検索と BM25 キーワード検索を組み合わせる（search のみ；デフォルト：オフ） |
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
| `hybridSearch` | いいえ | ベクトル類似度と BM25 キーワード一致を融合する（[ハイブリッド検索](#ハイブリッド検索)を参照） |
| `enableReranker` | いいえ | 関連性向上のための Cohere リランキングを有効化 |
| `rerankerCredentialId` | リランキング時 | Cohere の credential |
| `rerankerTopN` | いいえ | リランキング後の最終的な結果数 |

**出力:** `$nodeLabel.results` – `{ id, text, score, metadata }` の配列

リランキングが有効な場合:

- `$nodeLabel.reranked` が `true` になります
- 各結果に `relevance_score` も含まれます
- `score` は元のベクトル類似度スコアのままです
- `relevance_score` は Cohere リランカーのスコアです


#### ハイブリッド検索

ベクトル検索は、クエリと同じ意味を持つテキストを検出します。正確な単語のみを含むテキストは下位にランクされる可能性があります：製品コード、チケット番号、人物の名前、`ERR-4021` のようなエラーなどです。**ハイブリッド検索**をオンにすると、ノードはベクトル検索と並行してキーワード検索を実行し、両方のリストをマージするため、1 つのクエリで両方のタイプの一致を検出できます。

1. ベクトル検索は、ハイブリッド検索なしの場合と同様に最良の一致を返します。
2. キーワード検索は、クエリの単語に対して **BM25** を使用して保存されたテキストをスコアリングします。これにより、希少な単語、繰り返される単語、および短いドキュメントが評価されます。
3. ランク付けされた 2 つのリストは **reciprocal rank fusion** でマージされます。両方のリストの上位に近いドキュメントが第 1 位にランクされ、一方のリストでのみ見つかったドキュメントも表示されます。

メタデータフィルターは両方の検索に適用され、Cohere リランカーが有効な場合はマージされたリストに対して実行されます。

各結果には両方の検索のスコアが含まれます：

| フィールド | 意味 |
|---|---|
| `score` | 0 から 1 までの融合スコア。`1` はドキュメントが両方の検索で 1 位にランクされたことを意味します。 |
| `vector_score` | ベクトル類似度（0 から 1）。キーワード検索のみでドキュメントが見つかった場合は `null`。 |
| `keyword_score` | BM25 スコア。クエリの単語がドキュメントに 1 つも含まれていない場合は `null`。 |

ハイブリッド検索が実行された場合、`$nodeLabel.hybrid` は `true` になります。

知っておくべきこと：

- 融合された `score` は、結果を相対的にランク付けします。ベクトル類似度ではないため、単純な検索用に調整されたしきい値は直接引き継がれません。
- クエリの単語は小文字に変換され、スペースや句読点で分割されるため、`ERR-4021` は `err` および `4021` として検索されます。キーワード検索では、クエリの先頭から最大 16 個の一意の単語が使用されます。
- Qdrant：コレクションに対する最初のハイブリッド検索では、`text` ペイロードフィールドにフルテキストインデックスが構築されます。これには書き込み権限のある Qdrant キーが必要です。大規模なコレクションでは一度だけ少し時間がかかりますが、以降の検索ではインデックスが再利用されます。
- Postgres (pgvector)：データベースマイグレーション `142_vsi_text_search_index` によりフルテキストインデックスが追加されます。更新後に `alembic upgrade head` を実行してください。ハイブリッド検索はインデックスなしでも動作しますが、大規模なストアでは速度が低下します。
- 各クエリについて、キーワード検索は最も重みのある最も希少なクエリ単語から順に、最大 200 件の一致するドキュメントを読み取ります。
## 結果へのアクセス

- `$ragNode.results.first().text` – 最上位の結果の内容
- `$ragNode.results.first().score` – 類似度スコア（0～1）、またはハイブリッド検索による融合スコア
- `$ragNode.results.first().keyword_score` – BM25 スコア（ハイブリッド検索）
- `$ragNode.results.first().vector_score` – ベクトル類似度（ハイブリッド検索）
- `$ragNode.results.first().metadata.source` – 最上位の結果の metadata
- `$ragNode.results.map("item.text").join("\n\n")` – LLM コンテキスト用に連結
- `$ragNode.reranked` – リランキングが適用されたかどうか
- `$ragNode.hybrid` – ハイブリッド検索が適用されたかどうか
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

## 例 – ハイブリッド検索

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

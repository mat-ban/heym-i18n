# RAG / 벡터 저장소

**RAG / Vector Store** 노드는 Retrieval Augmented Generation(RAG)을 위해 벡터 스토어에 문서를 삽입, upsert, 삭제, 검색합니다. 이를 사용하여 LLM 컨텍스트를 관련 문서로 보강하고, 해당 컨텍스트를 문서의 출처 시스템과 동기화 상태로 유지할 수 있습니다.

이 노드에는 백엔드를 선택하는 **Database** 드롭다운이 있습니다:

- **Qdrant** – 외부 Qdrant 서버에 벡터를 저장합니다(*RAG: Qdrant + OpenAI* credential 필요).
- **Postgres (pgvector)** – Heym 자체 Postgres 데이터베이스 내부에 벡터를 저장하며, 외부 서비스가 필요하지 않습니다(*RAG: Psql + OpenAI* credential 필요).

기본값은 하위 호환성을 위해 **Qdrant**입니다. Database를 변경하면 **Vector Store** 목록이 해당 데이터베이스가 지원하는 스토어로 필터링됩니다. 두 백엔드 모두 동일한 작업, 메타데이터 필터링, Cohere reranking을 지원합니다.

두 백엔드 모두 *RAG: Custom Embeddings* credential을 통해 접근할 수도 있습니다. 이 credential은 OpenAI를 OpenAI 호환 임베딩 endpoint로 대체하고 자체 벡터 스토어를 지정합니다. 이러한 credential로 생성된 스토어는 대상으로 하는 Database 아래에 나타납니다. [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag)를 참조하십시오.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vector store backend (default: `"qdrant"`) |
| `vectorStoreId` | UUID | Vector store from [Vectorstores](../tabs/vectorstores-tab.md) tab |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operation type (also `operation`) |
| `documentContent` | expression | Document text to store (insert, upsert) |
| `documentMetadata` | JSON string | Metadata for stored docs (insert, upsert); values support expressions |
| `documentIdField` | string | Payload field holding the unique id (upsert, delete; default `doc_id`) |
| `documentId` | expression | Value of the unique id (upsert, delete) |
| `queryText` | expression | Search query (search only) |
| `searchLimit` | number | Max results (default: 5) |
| `metadataFilters` | JSON string | Metadata filters for search (values support expressions) |
| `enableReranker` | boolean | Use Cohere to rerank search results |
| `rerankerCredentialId` | UUID | Cohere credential for reranking |
| `rerankerTopN` | number | Number of top results to keep after reranking |

## Operations

### Insert

벡터 스토어에 문서를 추가합니다.

| Field | Required | Description |
|-------|----------|-------------|
| `documentContent` | yes | Text to embed and store |
| `documentMetadata` | no | JSON object, e.g. `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadata expressions

메타데이터 값은 표현식을 허용하므로, 문서를 실행 컨텍스트와 함께 저장할 수 있습니다:

```json
{ "url": "$start.url", "category": "faq" }
```

표현식은 JSON이 파싱된 후에 해석되며, 텍스트로 치환되는 방식이 아닙니다. 따라서 따옴표나 줄바꿈이 포함된 값이 객체를 깨뜨릴 수 없습니다. 하나의 완전한 표현식인 값은 해석된 타입을 유지합니다 — `{"count": "$start.count"}`는 `"7"`이 아닌 숫자를 저장합니다 — 이는 검색 `metadataFilters`가 정확한 타입으로 매칭되기 때문에 중요합니다. `"page $start.count"`와 같은 혼합 텍스트는 문자열로 해석되며, 중첩된 객체와 배열도 순회됩니다.

동일한 규칙이 `upsert`와 검색의 `metadataFilters`에도 적용됩니다. 먼저 파싱되고 그 값이 이후에 동일한 규칙으로 해석됩니다. 따라서 `{"count": "$start.count"}`로 작성된 필터는 문자열 `"7"`이 아닌, insert가 저장한 숫자와 매칭됩니다.

### Which workflow stored a document

자체 `source` 없이 저장된 문서에는 이를 저장한 Workflow가 `source: "workflow:<workflow name>"`으로 각인됩니다. [Vectorstores](../tabs/vectorstores-tab.md) 탭은 이를 **Added workflow: _name_** 아래에 그룹화하므로, 스토어의 내용이 각 문서의 출처를 나타내며, 하나의 Workflow의 문서를 그룹으로 삭제할 수 있습니다. `documentMetadata`에서 `source`를 직접 설정하면 항상 각인보다 우선합니다.

### Upsert

문서를 삽입하거나, 동일한 고유 id로 이미 저장된 문서를 교체합니다.

id는 스토어의 내부 point id가 아닌 **payload 내부**의 필드이므로, 문서는 자체 시스템이 이미 사용하는 식별자 — CRM 레코드 id, SKU, 페이지 slug — 를 유지합니다. `documentIdField`는 해당 필드의 이름을 지정하고 `documentId`는 그 값을 전달합니다.

| Field | Required | Description |
|-------|----------|-------------|
| `documentId` | yes | Unique id of the document (supports expressions) |
| `documentContent` | yes | Text to embed and store |
| `documentIdField` | no | Payload field the id lives in (default `doc_id`) |
| `documentMetadata` | no | JSON object, e.g. `{"source": "crm", "url": "$start.url"}` (values support expressions) |

id 필드가 일치하는 모든 point가 먼저 제거되므로, 이전에 여러 청크로 저장된 문서는 중복되지 않고 전체로 교체됩니다. id 필드는 payload에 자동으로 기록되며, point id는 동일 문서의 upsert 전반에 걸쳐 안정적으로 유지됩니다.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
whether an existing version was replaced), `$nodeLabel.replaced_count`
### Delete

동일한 고유 id로 문서를 제거합니다.

| Field | Required | Description |
|-------|----------|-------------|
| `documentId` | yes | 문서의 고유 id (표현식 지원) |
| `documentIdField` | no | id가 위치한 Payload 필드 (기본값 `doc_id`) |

**Output:** `$nodeLabel.deleted` – 하나 이상의 point가 일치하면 `true`, id가 저장소에 없으면 `false`입니다. `$nodeLabel.deleted_count`는 제거된 point 수를 나타냅니다.

존재하지 않는 id를 삭제하는 것은 오류가 아닙니다. 노드는 `deleted: false`와 함께 성공하므로, 정리 분기 앞에 가드를 둘 필요가 없습니다.

### Search

유사 문서에 대한 시맨틱 검색입니다.

| Field | Required | Description |
|-------|----------|-------------|
| `queryText` | yes | 검색 쿼리 |
| `searchLimit` | no | 최대 결과 수 (기본값: 5) |
| `metadataFilters` | no | 메타데이터로 필터링 (정확히 일치하는 JSON 객체, 값은 표현식 지원) |
| `enableReranker` | no | 더 나은 관련성을 위해 Cohere reranking 활성화 |
| `rerankerCredentialId` | when reranking | Cohere credential |
| `rerankerTopN` | no | reranking 후 최종 결과 수 |

**Output:** `$nodeLabel.results` – `{ id, text, score, metadata }`의 배열

reranking이 활성화된 경우:

- `$nodeLabel.reranked`가 `true`가 됩니다
- 각 결과에 `relevance_score`도 포함됩니다
- `score`는 원래의 벡터 유사도 점수로 유지됩니다
- `relevance_score`는 Cohere reranker 점수입니다

## Accessing Results

- `$ragNode.results.first().text` – 최상위 결과 내용
- `$ragNode.results.first().score` – 유사도 점수 (0–1)
- `$ragNode.results.first().metadata.source` – 최상위 결과 메타데이터
- `$ragNode.results.map("item.text").join("\n\n")` – LLM 컨텍스트를 위해 연결
- `$ragNode.reranked` – reranking 적용 여부
- `$ragNode.count` – 반환된 결과 수
- `$ragNode.replaced` – upsert가 기존 문서를 대체했는지 여부
- `$ragNode.deleted` – delete가 무언가를 제거했는지 여부

## Example – Search

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

## Example – Insert

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

## Example – Upsert

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

## Example – Delete

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

## Related

- [Why Heym](../getting-started/why-heym.md) – 에이전트 런타임의 일부로서의 내장 RAG
- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – 벡터 스토어 생성 및 관리
- [Third-Party Integrations](../reference/integrations.md#qdrant) – Qdrant 및 Postgres (pgvector) credential 설정
- [Agent Node](./agent-node.md) – RAG 결과를 에이전트 컨텍스트로 사용
- [LLM Node](./llm-node.md) – RAG 결과를 LLM 시스템 Prompt에 공급

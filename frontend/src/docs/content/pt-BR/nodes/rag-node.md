# RAG / Armazenamento Vetorial

O nó **RAG / Vector Store** insere, faz upsert, exclui e pesquisa documentos em um vector store para Geração Aumentada por Recuperação (RAG). Utilize-o para enriquecer o contexto do LLM com documentos relevantes e para manter esse contexto sincronizado com o sistema de onde os documentos provêm.

O nó possui um dropdown **Database** que seleciona o backend:

- **Qdrant** – armazena vetores em um servidor Qdrant externo (requer uma credencial *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – armazena vetores dentro do próprio banco de dados Postgres do Heym, sem serviço externo (requer uma credencial *RAG: Psql + OpenAI*).

O padrão é **Qdrant** por compatibilidade retroativa. Alterar o Database filtra a lista **Vector Store** para os stores respaldados por esse banco de dados. Ambos os backends suportam as mesmas operações, filtragem de metadados e reranking com Cohere.

Qualquer um dos backends também pode ser acessado por meio de uma credencial *RAG: Custom Embeddings*, que
substitui a OpenAI por qualquer endpoint de embeddings compatível com OpenAI e nomeia seu próprio vector
store. Um store criado a partir de tal credencial aparece sob o Database ao qual
se destina. Consulte [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend do vector store (padrão: `"qdrant"`) |
| `vectorStoreId` | UUID | Vector store da aba [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tipo de operação (também `operation`) |
| `documentContent` | expression | Texto do documento a armazenar (insert, upsert) |
| `documentMetadata` | JSON string | Metadados para os documentos armazenados (insert, upsert); os valores suportam expressões |
| `documentIdField` | string | Campo do payload que contém o id único (upsert, delete; padrão `doc_id`) |
| `documentId` | expression | Valor do id único (upsert, delete) |
| `queryText` | expression | Consulta de pesquisa (somente search) |
| `searchLimit` | number | Número máximo de resultados (padrão: 5) |
| `metadataFilters` | JSON string | Filtros de metadados para a pesquisa (os valores suportam expressões) |
| `enableReranker` | boolean | Usar Cohere para reranquear os resultados da pesquisa |
| `rerankerCredentialId` | UUID | Credencial Cohere para reranking |
| `rerankerTopN` | number | Número de resultados principais a manter após o reranking |

## Operações

### Insert

Adiciona documentos ao vector store.

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `documentContent` | sim | Texto a ser embedado e armazenado |
| `documentMetadata` | não | Objeto JSON, por exemplo `{"source": "user", "category": "general"}` |

**Saída:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expressões de metadados

Os valores de metadados aceitam expressões, de modo que um documento pode ser armazenado com contexto da execução:

```json
{ "url": "$start.url", "category": "faq" }
```

As expressões são resolvidas após o JSON ser analisado, e não substituindo texto nele, de modo que um
valor contendo aspas ou uma quebra de linha não pode desmembrar o objeto. Um valor que é uma
expressão inteira mantém seu tipo resolvido — `{"count": "$start.count"}` armazena um número, não
`"7"` — o que importa porque os `metadataFilters` da pesquisa correspondem por tipo exato. Texto misto como
`"page $start.count"` é resolvido como string, e objetos e arrays aninhados também são percorridos.

O mesmo se aplica ao `upsert` e aos `metadataFilters` da pesquisa: ele é analisado primeiro e seus
valores são resolvidos depois, pelas mesmas regras. Assim, um filtro escrito como `{"count": "$start.count"}`
corresponde ao número que um insert armazenou, em vez da string `"7"`.

### Qual workflow armazenou um documento

Um documento armazenado sem um `source` próprio é marcado com o workflow que o armazenou,
como `source: "workflow:<workflow name>"`. A aba [Vectorstores](../tabs/vectorstores-tab.md)
agrupa esses sob **Added workflow: _name_**, de modo que o conteúdo de um store indica de onde cada documento
veio, e os documentos de um workflow podem ser excluídos como um grupo. Definir `source` você mesmo
em `documentMetadata` sempre prevalece sobre a marcação.

### Upsert

Insere um documento ou substitui o que já está armazenado sob o mesmo id único.

O id é um campo **dentro do payload**, não o point id interno do store, de modo que um documento
mantém o identificador que seu próprio sistema já utiliza — um id de registro de CRM, um SKU, um slug de página.
`documentIdField` nomeia esse campo e `documentId` carrega seu valor.

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `documentId` | sim | Id único do documento (suporta expressões) |
| `documentContent` | sim | Texto a ser embedado e armazenado |
| `documentIdField` | não | Campo do payload onde o id reside (padrão `doc_id`) |
| `documentMetadata` | não | Objeto JSON, por exemplo `{"source": "crm", "url": "$start.url"}` (os valores suportam expressões) |

Todo point cujo campo de id corresponda é removido primeiro, de modo que um documento que foi anteriormente
armazenado como vários chunks é substituído como um todo, em vez de duplicado. O campo de id é
gravado no payload para você, e o point id permanece estável entre upserts do mesmo
documento.

**Saída:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
se uma versão existente foi substituída), `$nodeLabel.replaced_count`
### Excluir

Remove um documento pelo mesmo id único.

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `documentId` | sim | Id único do documento (suporta expressões) |
| `documentIdField` | não | Campo do payload onde o id reside (padrão `doc_id`) |

**Saída:** `$nodeLabel.deleted` – `true` quando ao menos um ponto correspondeu, `false` quando o id
não estava no armazenamento. `$nodeLabel.deleted_count` informa quantos pontos foram removidos.

Excluir um id que não existe não é um erro: o nó é concluído com sucesso com `deleted: false`, portanto
um branch de limpeza não precisa de uma proteção antes dele.

### Pesquisar

Busca semântica por documentos similares.

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `queryText` | sim | Consulta de busca |
| `searchLimit` | não | Máximo de resultados (padrão: 5) |
| `metadataFilters` | não | Filtrar por metadados (objeto JSON de correspondência exata, valores suportam expressões) |
| `enableReranker` | não | Habilita o reranking da Cohere para melhor relevância |
| `rerankerCredentialId` | quando o reranking estiver habilitado | Credencial da Cohere |
| `rerankerTopN` | não | Número final de resultados após o reranking |

**Saída:** `$nodeLabel.results` – array de `{ id, text, score, metadata }`

Quando o reranking está habilitado:

- `$nodeLabel.reranked` torna-se `true`
- Cada resultado também inclui `relevance_score`
- `score` permanece a pontuação original de similaridade vetorial
- `relevance_score` é a pontuação do reranker da Cohere

## Acessando Resultados

- `$ragNode.results.first().text` – conteúdo do resultado principal
- `$ragNode.results.first().score` – pontuação de similaridade (0–1)
- `$ragNode.results.first().metadata.source` – metadados do resultado principal
- `$ragNode.results.map("item.text").join("\n\n")` – concatenar para contexto do LLM
- `$ragNode.reranked` – se o reranking foi aplicado
- `$ragNode.count` – número de resultados retornados
- `$ragNode.replaced` – se um upsert substituiu um documento existente
- `$ragNode.deleted` – se uma exclusão removeu algo

## Exemplo – Pesquisar

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

## Exemplo – Inserir

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

## Exemplo – Upsert

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

## Exemplo – Excluir

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

## Relacionados

- [Por que a Heym](../getting-started/why-heym.md) – RAG integrado como parte do runtime do agente
- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Vectorstores](../tabs/vectorstores-tab.md) – Crie e gerencie vector stores
- [Integrações de Terceiros](../reference/integrations.md#qdrant) – Configuração de credenciais do Qdrant e Postgres (pgvector)
- [Nó Agent](./agent-node.md) – Use resultados de RAG como contexto do agente
- [Nó LLM](./llm-node.md) – Alimente o prompt de sistema do LLM com resultados de RAG

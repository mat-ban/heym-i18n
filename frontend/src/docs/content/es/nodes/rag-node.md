# RAG / Vector Store

El nodo **RAG / Vector Store** inserta, upserta, elimina y busca documentos en un almacén vectorial para la Generación Aumentada por Recuperación (RAG). Utilícelo para aumentar el contexto del LLM con documentos relevantes y para mantener ese contexto sincronizado con el sistema del que provienen los documentos.

El nodo dispone de un desplegable **Database** que selecciona el backend:

- **Qdrant** – almacena vectores en un servidor Qdrant externo (requiere una credencial *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – almacena vectores dentro de la propia base de datos Postgres de Heym, sin servicio externo (requiere una credencial *RAG: Psql + OpenAI*).

El valor predeterminado es **Qdrant** por compatibilidad con versiones anteriores. Cambiar la Database filtra la lista **Vector Store** a los almacenes respaldados por esa base de datos. Ambos backends admiten las mismas operaciones, el filtrado de metadatos y el reranking de Cohere.

También se puede acceder a cualquiera de los dos backends mediante una credencial *RAG: Custom Embeddings*, que
sustituye OpenAI por cualquier endpoint de embeddings compatible con OpenAI y nombra su propio almacén
vectorial. Un almacén creado a partir de dicha credencial aparece bajo la Database a la que
apunte. Consulte [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend del almacén vectorial (predeterminado: `"qdrant"`) |
| `vectorStoreId` | UUID | Almacén vectorial de la pestaña [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tipo de operación (también `operation`) |
| `documentContent` | expression | Texto del documento a almacenar (insert, upsert) |
| `documentMetadata` | JSON string | Metadatos de los documentos almacenados (insert, upsert); los valores admiten expresiones |
| `documentIdField` | string | Campo del payload que contiene el id único (upsert, delete; predeterminado `doc_id`) |
| `documentId` | expression | Valor del id único (upsert, delete) |
| `queryText` | expression | Consulta de búsqueda (solo search) |
| `searchLimit` | number | Número máximo de resultados (predeterminado: 5) |
| `metadataFilters` | JSON string | Filtros de metadatos para la búsqueda (los valores admiten expresiones) |
| `enableReranker` | boolean | Usar Cohere para rerankear los resultados de búsqueda |
| `rerankerCredentialId` | UUID | Credencial de Cohere para el reranking |
| `rerankerTopN` | number | Número de resultados principales que se conservan tras el reranking |

## Operaciones

### Insert

Añade documentos al almacén vectorial.

| Campo | Obligatorio | Descripción |
|-------|----------|-------------|
| `documentContent` | sí | Texto que se va a embeber y almacenar |
| `documentMetadata` | no | Objeto JSON, por ejemplo `{"source": "user", "category": "general"}` |

**Salida:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expresiones en metadatos

Los valores de los metadatos admiten expresiones, de modo que un documento puede almacenarse con contexto de la ejecución:

```json
{ "url": "$start.url", "category": "faq" }
```

Las expresiones se resuelven después de analizar el JSON, no sustituyendo texto dentro de él, por lo que un
valor que contenga una comilla o un salto de línea no puede romper el objeto. Un valor que sea una
expresión completa conserva su tipo resuelto — `{"count": "$start.count"}` almacena un número, no
`"7"` — lo cual es importante porque los `metadataFilters` de la búsqueda coinciden por tipo exacto. El texto mixto como
`"page $start.count"` se resuelve como una cadena, y los objetos y arrays anidados también se recorren.

Lo mismo se aplica a `upsert` y a los `metadataFilters` de la búsqueda: se analizan primero y sus
valores se resuelven después, según las mismas reglas. Así, un filtro escrito como `{"count": "$start.count"}`
coincide con el número que almacenó un insert, en lugar de con la cadena `"7"`.

### Qué workflow almacenó un documento

Un documento almacenado sin un `source` propio se marca con el workflow que lo almacenó,
como `source: "workflow:<workflow name>"`. La pestaña [Vectorstores](../tabs/vectorstores-tab.md)
agrupa esos documentos bajo **Added workflow: _name_**, de modo que el contenido de un almacén indica de dónde
proviene cada documento, y los documentos de un workflow pueden eliminarse como grupo. Establecer `source` usted mismo
en `documentMetadata` siempre prevalece sobre la marca.
### Upsert

Inserte un documento o reemplace el ya almacenado bajo el mismo id único.

El id es un campo **dentro del payload**, no el point id interno del almacén, por lo que un documento
conserva el identificador que su propio sistema ya utiliza: un id de registro de CRM, un SKU, un slug de página.
`documentIdField` nombra ese campo y `documentId` contiene su valor.

| Campo | Obligatorio | Descripción |
|-------|----------|-------------|
| `documentId` | sí | Id único del documento (admite expresiones) |
| `documentContent` | sí | Texto que se va a embeber y almacenar |
| `documentIdField` | no | Campo del payload en el que reside el id (por defecto `doc_id`) |
| `documentMetadata` | no | Objeto JSON, por ejemplo `{"source": "crm", "url": "$start.url"}` (los valores admiten expresiones) |

Todos los points cuyo campo id coincida se eliminan primero, por lo que un documento que anteriormente
se almacenó como varios chunks se reemplaza como un todo en lugar de duplicarse. El campo id se
escribe en el payload de forma automática, y el point id permanece estable entre upserts del mismo
documento.

**Salida:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (booleano:
si se reemplazó una versión existente), `$nodeLabel.replaced_count`

### Delete

Elimine un documento por el mismo id único.

| Campo | Obligatorio | Descripción |
|-------|----------|-------------|
| `documentId` | sí | Id único del documento (admite expresiones) |
| `documentIdField` | no | Campo del payload en el que reside el id (por defecto `doc_id`) |

**Salida:** `$nodeLabel.deleted`: `true` cuando al menos un point coincidió, `false` cuando el id
no estaba en el almacén. `$nodeLabel.deleted_count` indica cuántos points se eliminaron.

Eliminar un id que no existe no es un error: el nodo finaliza correctamente con `deleted: false`, por lo que
una rama de limpieza no necesita una guarda previa.

### Search

Búsqueda semántica de documentos similares.

| Campo | Obligatorio | Descripción |
|-------|----------|-------------|
| `queryText` | sí | Consulta de búsqueda |
| `searchLimit` | no | Número máximo de resultados (por defecto: 5) |
| `metadataFilters` | no | Filtrar por metadata (objeto JSON de coincidencia exacta, los valores admiten expresiones) |
| `enableReranker` | no | Habilitar el reranking de Cohere para mejorar la relevancia |
| `rerankerCredentialId` | cuando se aplica reranking | Credencial de Cohere |
| `rerankerTopN` | no | Número final de resultados tras el reranking |

**Salida:** `$nodeLabel.results`: array de `{ id, text, score, metadata }`

Cuando el reranking está habilitado:

- `$nodeLabel.reranked` pasa a ser `true`
- Cada resultado incluye además `relevance_score`
- `score` sigue siendo la puntuación de similitud vectorial original
- `relevance_score` es la puntuación del reranker de Cohere

## Acceso a los resultados

- `$ragNode.results.first().text`: contenido del resultado principal
- `$ragNode.results.first().score`: puntuación de similitud (0–1)
- `$ragNode.results.first().metadata.source`: metadata del resultado principal
- `$ragNode.results.map("item.text").join("\n\n")`: concatenar para el contexto del LLM
- `$ragNode.reranked`: si se aplicó reranking
- `$ragNode.count`: número de resultados devueltos
- `$ragNode.replaced`: si un upsert reemplazó un documento existente
- `$ragNode.deleted`: si un delete eliminó algo

## Ejemplo – Search

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

## Ejemplo – Insert

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

## Ejemplo – Upsert

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

## Ejemplo – Delete

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

## Relacionado

- [Por qué Heym](../getting-started/why-heym.md): RAG integrado como parte del runtime del agente
- [Tipos de nodos](../reference/node-types.md): descripción general de todos los tipos de nodos
- [Pestaña Vectorstores](../tabs/vectorstores-tab.md): crear y gestionar almacenes vectoriales
- [Integraciones de terceros](../reference/integrations.md#qdrant): configuración de credenciales de Qdrant y Postgres (pgvector)
- [Nodo Agent](./agent-node.md): usar los resultados de RAG como contexto del agente
- [Nodo LLM](./llm-node.md): introducir los resultados de RAG en el prompt del sistema del LLM

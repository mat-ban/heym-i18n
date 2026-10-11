# RAG / Vector Store

El node **RAG / Vector Store** insereix, actualitza (upsert), elimina i cerca documents en un magatzem vectorial per a la Generació Augmentada per Recuperació (RAG). Utilitzeu-lo per ampliar el context de l'LLM amb documents rellevants i per mantenir aquest context sincronitzat amb el sistema d'origen dels documents.

El node disposa d'un desplegable **Database** que selecciona el backend:

- **Qdrant** – emmagatzema els vectors en un servidor Qdrant extern (requereix una credencial *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – emmagatzema els vectors dins de la pròpia base de dades Postgres de Heym, sense servei extern (requereix una credencial *RAG: Psql + OpenAI*).

El valor per defecte és **Qdrant** per compatibilitat retroactiva. Canviar la Database filtra la llista **Vector Store** als magatzems suportats per aquesta base de dades. Tots dos backends admeten les mateixes operacions, el filtratge per metadades i el reranking de Cohere.

També es pot accedir a qualsevol dels dos backends mitjançant una credencial *RAG: Custom Embeddings*, que substitueix OpenAI per qualsevol endpoint d'embeddings compatible amb OpenAI i nomena el seu propi magatzem vectorial. Un magatzem creat a partir d'aquesta credencial apareix sota la Database a la qual apunti. Vegeu [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend del magatzem vectorial (per defecte: `"qdrant"`) |
| `vectorStoreId` | UUID | Magatzem vectorial de la pestanya [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tipus d'operació (també `operation`) |
| `documentContent` | expressió | Text del document a emmagatzemar (insert, upsert) |
| `documentMetadata` | cadena JSON | Metadades per als documents emmagatzemats (insert, upsert); els valors admeten expressions |
| `documentIdField` | string | Camp del payload que conté l'id únic (upsert, delete; per defecte `doc_id`) |
| `documentId` | expressió | Valor de l'id únic (upsert, delete) |
| `queryText` | expressió | Consulta de cerca (només search) |
| `searchLimit` | number | Nombre màxim de resultats (per defecte: 5) |
| `metadataFilters` | cadena JSON | Filtres de metadades per a la cerca (els valors admeten expressions) |
| `enableReranker` | boolean | Utilitza Cohere per reordenar els resultats de la cerca |
| `rerankerCredentialId` | UUID | Credencial de Cohere per al reranking |
| `rerankerTopN` | number | Nombre de resultats principals a conservar després del reranking |

## Operacions

### Insert

Afegeix documents al magatzem vectorial.

| Camp | Obligatori | Descripció |
|-------|----------|-------------|
| `documentContent` | sí | Text a incrustar i emmagatzemar |
| `documentMetadata` | no | Objecte JSON, p. ex. `{"source": "user", "category": "general"}` |

**Sortida:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expressions de metadades

Els valors de les metadades admeten expressions, de manera que un document es pot emmagatzemar amb context de l'execució:

```json
{ "url": "$start.url", "category": "faq" }
```

Les expressions es resolen després d'analitzar el JSON, no substituint text dins d'ell, de manera que un valor que contingui una cometa o un salt de línia no pot trencar l'objecte. Un valor que és una expressió sencera conserva el seu tipus resolt — `{"count": "$start.count"}` emmagatzema un nombre, no `"7"` — cosa que és rellevant perquè els `metadataFilters` de la cerca coincideixen per tipus exacte. El text mixt com ara `"page $start.count"` es resol com a cadena, i els objectes i matrius imbricats també es recorren.

El mateix s'aplica a `upsert` i als `metadataFilters` de la cerca: s'analitzen primer i els seus valors es resolen després, per les mateixes regles. Així, un filtre escrit com `{"count": "$start.count"}` coincideix amb el nombre que un insert va emmagatzemar, en lloc de la cadena `"7"`.

### Quin workflow ha emmagatzemat un document

Un document emmagatzemat sense un `source` propi es marca amb el workflow que l'ha emmagatzemat, com a `source: "workflow:<workflow name>"`. La pestanya [Vectorstores](../tabs/vectorstores-tab.md) agrupa aquests sota **Added workflow: _name_**, de manera que el contingut d'un magatzem indica d'on prové cada document, i els documents d'un workflow es poden eliminar com a grup. Establir `source` vosaltres mateixos a `documentMetadata` sempre preval sobre la marca.
### Upsert

Inseriu un document o substituïu el que ja està emmagatzemat sota el mateix id únic.

L'id és un camp **dins del payload**, no l'id de punt intern del magatzem, de manera que un document conserva l'identificador que el vostre propi sistema ja utilitza — un id de registre de CRM, un SKU, un slug de pàgina. `documentIdField` anomena aquest camp i `documentId` en porta el valor.

| Camp | Obligatori | Descripció |
|-------|----------|-------------|
| `documentId` | sí | Id únic del document (admet expressions) |
| `documentContent` | sí | Text per incrustar i emmagatzemar |
| `documentIdField` | no | Camp del payload on resideix l'id (per defecte `doc_id`) |
| `documentMetadata` | no | Objecte JSON, p. ex. `{"source": "crm", "url": "$start.url"}` (els valors admeten expressions) |

Cada punt l'id del qual coincideix s'elimina primer, de manera que un document que prèviament s'havia emmagatzemat com a diversos fragments es substitueix com un tot en lloc de duplicar-se. El camp de l'id s'escriu al payload per vosaltres, i l'id de punt es manté estable entre upserts del mateix document.

**Sortida:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (booleà — si una versió existent va ser substituïda), `$nodeLabel.replaced_count`

### Delete

Elimineu un document pel mateix id únic.

| Camp | Obligatori | Descripció |
|-------|----------|-------------|
| `documentId` | sí | Id únic del document (admet expressions) |
| `documentIdField` | no | Camp del payload on resideix l'id (per defecte `doc_id`) |

**Sortida:** `$nodeLabel.deleted` – `true` quan almenys un punt ha coincidit, `false` quan l'id no era al magatzem. `$nodeLabel.deleted_count` indica quants punts s'han eliminat.

Eliminar un id que no hi és no és un error: el node té èxit amb `deleted: false`, de manera que una branca de neteja no necessita una guarda al davant.

### Search

Cerca semàntica de documents similars.

| Camp | Obligatori | Descripció |
|-------|----------|-------------|
| `queryText` | sí | Consulta de cerca |
| `searchLimit` | no | Nombre màxim de resultats (per defecte: 5) |
| `metadataFilters` | no | Filtreu per metadades (objecte JSON de coincidència exacta, els valors admeten expressions) |
| `enableReranker` | no | Activeu el reranking de Cohere per a una millor rellevància |
| `rerankerCredentialId` | quan es fa reranking | Credencial de Cohere |
| `rerankerTopN` | no | Nombre final de resultats després del reranking |

**Sortida:** `$nodeLabel.results` – array de `{ id, text, score, metadata }`

Quan el reranking està activat:

- `$nodeLabel.reranked` esdevé `true`
- Cada resultat també inclou `relevance_score`
- `score` continua sent la puntuació de similitud vectorial original
- `relevance_score` és la puntuació del reranker de Cohere

## Accés als resultats

- `$ragNode.results.first().text` – contingut del resultat principal
- `$ragNode.results.first().score` – puntuació de similitud (0–1)
- `$ragNode.results.first().metadata.source` – metadades del resultat principal
- `$ragNode.results.map("item.text").join("\n\n")` – concatenar per al context de l'LLM
- `$ragNode.reranked` – si s'ha aplicat el reranking
- `$ragNode.count` – nombre de resultats retornats
- `$ragNode.replaced` – si un upsert ha substituït un document existent
- `$ragNode.deleted` – si un delete ha eliminat alguna cosa

## Exemple – Search

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

## Exemple – Insert

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

## Exemple – Upsert

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

## Exemple – Delete

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

## Relacionat

- [Per què Heym](../getting-started/why-heym.md) – RAG integrat com a part del runtime de l'agent
- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [Pestanya Vectorstores](../tabs/vectorstores-tab.md) – Creeu i gestioneu magatzems vectorials
- [Integracions de tercers](../reference/integrations.md#qdrant) – Configuració de credencials de Qdrant i Postgres (pgvector)
- [Node Agent](./agent-node.md) – Utilitzeu els resultats de RAG com a context de l'agent
- [Node LLM](./llm-node.md) – Introduïu els resultats de RAG al prompt de sistema de l'LLM

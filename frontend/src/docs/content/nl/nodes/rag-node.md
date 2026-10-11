# RAG / Vector Store

De **RAG / Vector Store**-node voegt documenten in, upsert, verwijdert en doorzoekt documenten in een vectorstore voor Retrieval Augmented Generation (RAG). Gebruik deze om de LLM-context aan te vullen met relevante documenten en om die context synchroon te houden met het systeem waaruit de documenten afkomstig zijn.

De node heeft een **Database**-dropdown die de backend selecteert:

- **Qdrant** – slaat vectoren op in een externe Qdrant-server (vereist een *RAG: Qdrant + OpenAI*-referentie).
- **Postgres (pgvector)** – slaat vectoren op in Heym's eigen Postgres-database, zonder externe service (vereist een *RAG: Psql + OpenAI*-referentie).

De standaardwaarde is **Qdrant** voor achterwaartse compatibiliteit. Het wijzigen van de Database filtert de **Vector Store**-lijst tot stores die door die database worden ondersteund. Beide backends ondersteunen dezelfde bewerkingen, metadata-filtering en Cohere-reranking.

Beide backends kunnen ook worden bereikt via een *RAG: Custom Embeddings*-referentie, die
OpenAI vervangt door een OpenAI-compatibel embedding-endpoint en zijn eigen vectorstore
benoemt. Een store die vanuit een dergelijke referentie is aangemaakt, verschijnt onder de
Database waarop deze is gericht. Zie [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vectorstore-backend (standaard: `"qdrant"`) |
| `vectorStoreId` | UUID | Vectorstore uit het tabblad [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Type bewerking (ook `operation`) |
| `documentContent` | expression | Documenttekst om op te slaan (insert, upsert) |
| `documentMetadata` | JSON string | Metadata voor opgeslagen documenten (insert, upsert); waarden ondersteunen expressies |
| `documentIdField` | string | Payload-veld met de unieke id (upsert, delete; standaard `doc_id`) |
| `documentId` | expression | Waarde van de unieke id (upsert, delete) |
| `queryText` | expression | Zoekopdracht (alleen search) |
| `searchLimit` | number | Maximaal aantal resultaten (standaard: 5) |
| `metadataFilters` | JSON string | Metadata-filters voor search (waarden ondersteunen expressies) |
| `enableReranker` | boolean | Cohere gebruiken om zoekresultaten te reranken |
| `rerankerCredentialId` | UUID | Cohere-referentie voor reranking |
| `rerankerTopN` | number | Aantal topresultaten om te behouden na reranking |

## Bewerkingen

### Insert

Documenten toevoegen aan de vectorstore.

| Veld | Verplicht | Beschrijving |
|-------|----------|-------------|
| `documentContent` | ja | Tekst om te embedden en op te slaan |
| `documentMetadata` | nee | JSON-object, bijv. `{"source": "user", "category": "general"}` |

**Uitvoer:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadata-expressies

Metadata-waarden accepteren expressies, zodat een document kan worden opgeslagen met context uit de uitvoering:

```json
{ "url": "$start.url", "category": "faq" }
```

Expressies worden opgelost nadat de JSON is geparseerd, niet door tekst erin te substitueren, zodat een waarde met een aanhalingsteken of een nieuwe regel het object niet kan opsplitsen. Een waarde die één geheel expressie is, behoudt het opgeloste type — `{"count": "$start.count"}` slaat een getal op, niet `"7"` — wat van belang is omdat search `metadataFilters` op exact type matchen. Gemengde tekst zoals `"page $start.count"` wordt opgelost naar een string, en geneste objecten en arrays worden ook doorlopen.

Hetzelfde geldt voor `upsert` en voor de `metadataFilters` van search: deze wordt eerst geparseerd en de waarden worden daarna volgens dezelfde regels opgelost. Zo matcht een filter geschreven als `{"count": "$start.count"}` het getal dat een insert heeft opgeslagen, in plaats van de string `"7"`.

### Welke workflow een document heeft opgeslagen

Een document dat zonder eigen `source` wordt opgeslagen, wordt voorzien van de workflow die het heeft opgeslagen, als `source: "workflow:<workflow name>"`. Het tabblad [Vectorstores](../tabs/vectorstores-tab.md) groepeert deze onder **Added workflow: _name_**, zodat de inhoud van een store aangeeft waar elk document vandaan komt, en de documenten van één workflow als groep kunnen worden verwijderd. Het zelf instellen van `source` in `documentMetadata` heeft altijd voorrang op de stempel.

### Upsert

Een document invoegen, of het reeds opgeslagen document onder dezelfde unieke id vervangen.

De id is een veld **binnen de payload**, niet de interne point-id van de store, zodat een document de identificatie behoudt die uw eigen systeem al gebruikt — een CRM-record-id, een SKU, een pagina-slug. `documentIdField` benoemt dat veld en `documentId` draagt de waarde ervan.

| Veld | Verplicht | Beschrijving |
|-------|----------|-------------|
| `documentId` | ja | Unieke id van het document (ondersteunt expressies) |
| `documentContent` | ja | Tekst om te embedden en op te slaan |
| `documentIdField` | nee | Payload-veld waarin de id zich bevindt (standaard `doc_id`) |
| `documentMetadata` | nee | JSON-object, bijv. `{"source": "crm", "url": "$start.url"}` (waarden ondersteunen expressies) |

Elk point waarvan het id-veld overeenkomt, wordt eerst verwijderd, zodat een document dat eerder als meerdere chunks was opgeslagen als geheel wordt vervangen in plaats van gedupliceerd. Het id-veld wordt voor u in de payload geschreven, en de point-id blijft stabiel bij upserts van hetzelfde document.

**Uitvoer:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
of een bestaande versie is vervangen), `$nodeLabel.replaced_count`
### Verwijderen

Verwijder een document op basis van hetzelfde unieke id.

| Veld | Verplicht | Beschrijving |
|-------|----------|-------------|
| `documentId` | ja | Uniek id van het document (ondersteunt expressies) |
| `documentIdField` | nee | Payload-veld waarin het id zich bevindt (standaard `doc_id`) |

**Uitvoer:** `$nodeLabel.deleted` – `true` wanneer ten minste één point overeenkwam, `false` wanneer het id
niet in de store aanwezig was. `$nodeLabel.deleted_count` bevat hoeveel points zijn verwijderd.

Het verwijderen van een id die niet aanwezig is, is geen fout: de node slaagt met `deleted: false`, zodat
een opschoningsbranch geen guard ervoor nodig heeft.

### Zoeken

Semantisch zoeken naar vergelijkbare documenten.

| Veld | Verplicht | Beschrijving |
|-------|----------|-------------|
| `queryText` | ja | Zoekopdracht |
| `searchLimit` | nee | Maximaal aantal resultaten (standaard: 5) |
| `metadataFilters` | nee | Filteren op metadata (exacte overeenkomst JSON-object, waarden ondersteunen expressies) |
| `enableReranker` | nee | Cohere-reranking inschakelen voor betere relevantie |
| `rerankerCredentialId` | bij reranking | Cohere-referentie |
| `rerankerTopN` | nee | Definitief aantal resultaten na reranking |

**Uitvoer:** `$nodeLabel.results` – array van `{ id, text, score, metadata }`

Wanneer reranking is ingeschakeld:

- `$nodeLabel.reranked` wordt `true`
- Elk resultaat bevat tevens `relevance_score`
- `score` blijft de oorspronkelijke vectorsimilariteitsscore
- `relevance_score` is de Cohere-rerankerscore

## Resultaten openen

- `$ragNode.results.first().text` – inhoud van het beste resultaat
- `$ragNode.results.first().score` – similariteitsscore (0–1)
- `$ragNode.results.first().metadata.source` – metadata van het beste resultaat
- `$ragNode.results.map("item.text").join("\n\n")` – samenvoegen voor LLM-context
- `$ragNode.reranked` – of reranking is toegepast
- `$ragNode.count` – aantal geretourneerde resultaten
- `$ragNode.replaced` – of een upsert een bestaand document heeft vervangen
- `$ragNode.deleted` – of een verwijdering iets heeft verwijderd

## Voorbeeld – Zoeken

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

## Voorbeeld – Invoegen

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

## Voorbeeld – Upsert

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

## Voorbeeld – Verwijderen

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

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Ingebouwde RAG als onderdeel van de agent-runtime
- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Tabblad Vectorstores](../tabs/vectorstores-tab.md) – Vectorstores aanmaken en beheren
- [Integraties van derden](../reference/integrations.md#qdrant) – Qdrant en Postgres (pgvector) referentie-instelling
- [Agent-node](./agent-node.md) – RAG-resultaten gebruiken als agent-context
- [LLM-node](./llm-node.md) – RAG-resultaten invoeren in de LLM-systeemprompt

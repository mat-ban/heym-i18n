# RAG / Vector Store

**RAG / Vector Store** node lisab, uuendab (upsert), kustutab ja otsib dokumente vektorhoidlas, et toetada Retrieval Augmented Generation (RAG) töövoogu. Kasutage seda LLM-i konteksti rikastamiseks asjakohaste dokumentidega ning selle konteksti sünkroonituna hoidmiseks süsteemiga, kust dokumendid pärinevad.

Sõlmel on **Database** rippmenüü, mis valib taustsüsteemi:

- **Qdrant** – salvestab vektorid välisesse Qdrant serverisse (nõuab *RAG: Qdrant + OpenAI* mandaati).
- **Postgres (pgvector)** – salvestab vektorid Heymi enda Postgres andmebaasi, ilma välise teenuseta (nõuab *RAG: Psql + OpenAI* mandaati).

Vaikeväärtus on **Qdrant** tagasiühilduvuse huvides. Database'i muutmine filtreerib **Vector Store** loendi selle andmebaasiga seotud hoidlatele. Mõlemad taustsüsteemid toetavad samu toiminguid, metaandmete filtreerimist ja Cohere ümberjärjestamist (reranking).

Mõlemale taustsüsteemile saab juurde pääseda ka *RAG: Custom Embeddings* mandaadi kaudu, mis
asendab OpenAI mis tahes OpenAI-ga ühilduva embedding-endpointiga ja määrab oma vektorhoidla
nime. Sellisest mandaadist loodud hoidla kuvatakse selle Database'i all, millele see on
suunatud. Vt [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parameetrid

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

## Toimingud

### Insert

Lisab dokumente vektorhoidlasse.

| Field | Required | Description |
|-------|----------|-------------|
| `documentContent` | yes | Text to embed and store |
| `documentMetadata` | no | JSON object, e.g. `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metaandmete avaldised

Metaandmete väärtused aktsepteerivad avaldisi, seega saab dokumendi salvestada koos käivituse kontekstiga:

```json
{ "url": "$start.url", "category": "faq" }
```

Avaldised lahendatakse pärast JSON-i parsimist, mitte teksti asendamise teel, seega
väärtus, mis sisaldab jutumärki või reavahetust, ei saa objekti lõhkuda. Väärtus, mis on
tervikuna üks avaldis, säilitab oma lahendatud tüübi — `{"count": "$start.count"}` salvestab
arvu, mitte `"7"` — mis on oluline, sest otsingu `metadataFilters` sobitab täpse tüübi järgi.
Segatekst nagu `"page $start.count"` lahendatakse stringiks ning pesastatud objektid ja
massiivid käiakse samuti läbi.

Sama kehtib `upsert`-i ja otsingu `metadataFilters` kohta: see parsitakse esmalt ja selle
väärtused lahendatakse seejärel samade reeglite järgi. Seega filter kujul
`{"count": "$start.count"}` sobitab arvu, mille insert salvestas, mitte stringi `"7"`.

### Milline workflow dokumenti salvestas

Dokument, mis on salvestatud ilma oma `source`-ita, tembeldatakse workflow'ga, mis selle
salvestas, kujul `source: "workflow:<workflow name>"`. [Vectorstores](../tabs/vectorstores-tab.md)
vahekaart rühmitab need **Added workflow: _name_** alla, seega hoidla sisu näitab, kust iga
dokument pärineb, ja ühe workflow' dokumendid saab rühmana kustutada. `source`-i ise
`documentMetadata`-s määramine võidab alati tembeldamise üle.

### Upsert

Lisab dokumendi või asendab sama unikaalse id all juba salvestatud dokumendi.

Id on väli **payload'i sees**, mitte hoidla sisemine point id, seega dokument säilitab
identifikaatori, mida teie enda süsteem juba kasutab — CRM-kirje id, SKU, lehe slug.
`documentIdField` nimetab selle välja ja `documentId` kannab selle väärtust.

| Field | Required | Description |
|-------|----------|-------------|
| `documentId` | yes | Unique id of the document (supports expressions) |
| `documentContent` | yes | Text to embed and store |
| `documentIdField` | no | Payload field the id lives in (default `doc_id`) |
| `documentMetadata` | no | JSON object, e.g. `{"source": "crm", "url": "$start.url"}` (values support expressions) |

Kõik punktid, mille id-väli ühtib, eemaldatakse esmalt, seega dokument, mis oli varem
salvestatud mitme tükina, asendatakse tervikuna, mitte ei dubleerita. Id-väli kirjutatakse
payload'i teie eest ja point id jääb sama dokumendi upsert'ide vahel stabiilseks.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
kas olemasolev versioon asendati), `$nodeLabel.replaced_count`
### Kustutamine

Eemaldab dokumendi sama unikaalse id järgi.

| Väli | Kohustuslik | Kirjeldus |
|-------|----------|-------------|
| `documentId` | jah | Dokumendi unikaalne id (toetab avaldisi) |
| `documentIdField` | ei | Payload väli, milles id asub (vaikimisi `doc_id`) |

**Väljund:** `$nodeLabel.deleted` – `true`, kui vähemalt üks punkt vastas, `false`, kui id
ei olnud hoidlas. `$nodeLabel.deleted_count` sisaldab, mitu punkti eemaldati.

Sellise id kustutamine, mida pole olemas, ei ole viga: sõlm õnnestub väärtusega `deleted: false`, seega
puhastusharu ei vaja ees kaitset.

### Otsing

Semantiline otsing sarnaste dokumentide leidmiseks.

| Väli | Kohustuslik | Kirjeldus |
|-------|----------|-------------|
| `queryText` | jah | Otsingupäring |
| `searchLimit` | ei | Maksimaalne tulemuste arv (vaikimisi: 5) |
| `metadataFilters` | ei | Filtreeri metaandmete järgi (täpne vastavus JSON-objektina, väärtused toetavad avaldisi) |
| `enableReranker` | ei | Luba Cohere ümberjärjestamine parema asjakohasuse saavutamiseks |
| `rerankerCredentialId` | ümberjärjestamise korral | Cohere mandaat |
| `rerankerTopN` | ei | Lõplik tulemuste arv pärast ümberjärjestamist |

**Väljund:** `$nodeLabel.results` – massiiv kujul `{ id, text, score, metadata }`

Kui ümberjärjestamine on lubatud:

- `$nodeLabel.reranked` muutub väärtuseks `true`
- Iga tulemus sisaldab ka `relevance_score`
- `score` jääb algseks vektorsarnasuse skooriks
- `relevance_score` on Cohere ümberjärjestaja skoor

## Tulemustele juurdepääs

- `$ragNode.results.first().text` – parima tulemuse sisu
- `$ragNode.results.first().score` – sarnasuse skoor (0–1)
- `$ragNode.results.first().metadata.source` – parima tulemuse metaandmed
- `$ragNode.results.map("item.text").join("\n\n")` – ühenda LLM-i konteksti jaoks
- `$ragNode.reranked` – kas ümberjärjestamist rakendati
- `$ragNode.count` – tagastatud tulemuste arv
- `$ragNode.replaced` – kas upsert asendas olemasoleva dokumendi
- `$ragNode.deleted` – kas kustutamine eemaldas midagi

## Näide – Otsing

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

## Näide – Sisestamine

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

## Näide – Upsert

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

## Näide – Kustutamine

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

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Sisseehitatud RAG agentide käituskeskkonna osana
- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [Vektorhoidlate vaheleht](../tabs/vectorstores-tab.md) – Vektorhoidlate loomine ja haldamine
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md#qdrant) – Qdranti ja Postgresi (pgvector) mandaatide seadistamine
- [Agendi sõlm](./agent-node.md) – RAG tulemuste kasutamine agendi kontekstina
- [LLM sõlm](./llm-node.md) – RAG tulemuste suunamine LLM-i süsteemi prompti

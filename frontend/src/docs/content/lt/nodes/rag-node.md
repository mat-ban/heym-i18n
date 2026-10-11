# RAG / Vektorių saugykla

**RAG / Vektorių saugykla** mazgas įterpia, atnaujina, ištrina ir ieško dokumentų vektorių saugykloje, skirta Retrieval Augmented Generation (RAG). Naudokite jį, kad papildytumėte LLM kontekstą su atitinkamais dokumentais ir išlaikytumėte tą kontekstą suderintą su sistema, iš kurios dokumentai kilę.

Mazgas turi **Duomenų bazės** išskleidžiamąjį meniu, kuris pasirenka backend'ą:

- **Qdrant** – saugo vektorius išorėje esančiame Qdrant serveryje (reikalingi *RAG: Qdrant + OpenAI* kredencialai).
- **Postgres (pgvector)** – saugo vektorius Heym nuosavoje Postgres duomenų bazėje, be išorinės paslaugos (reikalingi *RAG: Psql + OpenAI* kredencialai).

Numatytasis pasirinkimas yra **Qdrant** atgalinio suderinamumo tikslais. Keisdami Duomenų bazę, filtruojate **Vektorių saugyklos** sąrašą, kad būtų rodomos tik tos saugyklos, kurios remiasi ta duomenų baze. Abu backend'ai palaiko tas pačias operacijas, metaduomenų filtravimą ir Cohere pergrupavimą.

Bet kuris backend'as taip pat gali būti pasiektas per *RAG: Custom Embeddings* kredencialą, kuris pakeičia OpenAI bet kuriuo OpenAI suderinamu embedding endpoint'u ir pavadina savo vektorių saugyklą. Saugykla, sukurta iš tokio kredencialo, pasirodo po bet kuria Duomenų baze, kurią ji taiko. Žr. [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (ieškoti), `$nodeLabel.point_id` (įterpti, atnaujinti), `$nodeLabel.deleted` (ištrinti) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektorių saugyklos backend'as (numatytasis: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorių saugykla iš [Vektorių saugyklų](../tabs/vectorstores-tab.md) skyriaus |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operacijos tipas (taip pat `operation`) |
| `documentContent` | išraiška | Dokumento tekstas, kurį reikia saugoti (įterpti, atnaujinti) |
| `documentMetadata` | JSON eilutė | Metaduomenys saugomiems dokumentams (įterpti, atnaujinti); vertės palaiko išraiškas |
| `documentIdField` | eilutė | Payload laukas, laikantis unikalų id (atnaujinti, ištrinti; numatytas `doc_id`) |
| `documentId` | išraiška | Unikalaus id vertė (atnaujinti, ištrinti) |
| `queryText` | išraiška | Paieškos užklausa (tik paieškai) |
| `searchLimit` | skaičius | Maksimalus rezultatų skaičius (numatytas: 5) |
| `metadataFilters` | JSON eilutė | Metaduomenų filtrai paieškai (vertės palaiko išraiškas) |
| `enableReranker` | boolean | Naudoti Cohere pergrupavimui |
| `rerankerCredentialId` | UUID | Cohere kredencialas pergrupavimui |
| `rerankerTopN` | skaičius | Išlaikyti geriausių rezultatų skaičius po pergrupavimo |

## Operacijos

### Įterpti

Pridėti dokumentus į vektorių saugyklą.

| Laukas | Privalomas | Aprašymas |
|--------|------------|-----------|
| `documentContent` | taip | Tekstas, kurį reikia įterpti ir saugoti |
| `documentMetadata` | ne | JSON objektas, pvz., `{"source": "user", "category": "general"}` |

**Išvestis:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metaduomenų išraiškos

Metaduomenų vertės priima išraiškas, todėl dokumentas gali būti saugomas su kontekstu iš vykdymo:

```json
{ "url": "$start.url", "category": "faq" }
```

Išraiškos yra išsprendžiamos po to, kai JSON yra išanalizuotas, o ne pakeičiant tekstą į jį, todėl vertė, turinti kabutę ar naują eilutę, negali sulaužyti objekto. Vertė, kuri yra viena visa išraiška, išlaiko savo išspręstą tipą — `{"count": "$start.count"}` saugo skaičių, o ne `"7"` — kas yra svarbu, nes paieškos `metadataFilters` atitinka tikslų tipą. Mišrus tekstas, pavyzdžiui, `"page $start.count"`, išsprendžiamas į eilutę, o įnagrinėjami ir įdėti objektai bei masyvai.

Tas pats taikoma `upsert` ir paieškos `metadataFilters`: jis pirmiausia yra analizuojamas, o jo vertės išsprendžiamos vėliau, pagal tas pačias taisykles. Taigi filtras, parašytas kaip `{"count": "$start.count"}`, atitinka skaičių, kurį įterpė, o ne eilutę `"7"`.

### Kuris workflow saugojo dokumentą

Dokumentas, saugomas be savo `source`, yra pažymėtas workflow, kuris jį saugojo, kaip `source: "workflow:<workflow name>"`. [Vektorių saugyklų](../tabs/vectorstores-tab.md) skyrius grupuoja juos po **Pridėta workflow: _name_**, todėl saugyklos turinys nurodo, iš kur kiekvienas dokumentas kilęs, ir vieno workflow dokumentai gali būti ištrinti kaip grupė. Nustatant `source` patiems `documentMetadata`, visada laimi virš antspaudo.

### Atnaujinti

Įterpti dokumentą arba pakeisti jau saugomą dokumentą, turintį tą patį unikalų id.

Id yra laukas **payload** viduje, o ne saugyklos vidinis taško id, todėl dokumentas išlaiko identifikatorių, kurį jau naudoja jūsų sistema — CRM įrašo id, SKU, puslapio slug. `documentIdField` nurodo tą lauką, o `documentId` perduoda jo vertę.

| Laukas | Privalomas | Aprašymas |
|--------|------------|-----------|
| `documentId` | taip | Unikalus dokumento id (palaiko išraiškas) |
| `documentContent` | taip | Tekstas, kurį reikia įterpti ir saugoti |
| `documentIdField` | ne | Payload laukas, kuriame yra id (numatytas `doc_id`) |
| `documentMetadata` | ne | JSON objektas, pvz., `{"source": "crm", "url": "$start.url"}` (vertės palaiko išraiškas) |

Kiekvienas taškas, kurio id laukas atitinka, pirmiausia yra pašalinamas, todėl dokumentas, kuris anksčiau buvo saugomas kaip keli fragmentai, yra pakeičiamas kaip visas, o ne dubliuojamas. Id laukas yra įrašomas į payload už jus, o taško id išlieka stabilus per to paties dokumento atnaujinimus.

**Išvestis:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — ar buvo pakeista esama versija), `$nodeLabel.replaced_count`
### Ištrinti

Pašalinkite dokumentą pagal tą patį unikalų id.

| Laukas | Privalomas | Aprašymas |
|--------|------------|-----------|
| `documentId` | taip | Unikalus dokumento id (palaiko išraiškas) |
| `documentIdField` | ne | Payload laukas, kuriame yra id (numatytas `doc_id`) |

**Išvestis:** `$nodeLabel.deleted` – `true`, kai bent vienas taškas atitiko, `false`, kai id nebuvo saugykloje. `$nodeLabel.deleted_count` nurodo, kiek taškų buvo pašalinta.

Ištrinti id, kurio nėra, nėra klaida: mazgas sėkmingai vykdo su `deleted: false`, todėl valymo šaka neturi turėti apsaugos prieš ją.

### Paieška

Semantinė paieška panašiems dokumentams.

| Laukas | Privalomas | Aprašymas |
|--------|------------|-----------|
| `queryText` | taip | Paieškos užklausa |
| `searchLimit` | ne | Maksimalus rezultatų skaičius (numatytas: 5) |
| `metadataFilters` | ne | Filtruoti pagal metaduomenis (tikslus atitikimo JSON objektas, vertės palaiko išraiškas) |
| `enableReranker` | ne | Įgalinti Cohere pervertinimą geresniam atitikimui |
| `rerankerCredentialId` | kai pervertinama | Cohere kredencialas |
| `rerankerTopN` | ne | Galutinis rezultatų skaičius po pervertinimo |

**Išvestis:** `$nodeLabel.results` – masyvas iš `{ id, text, score, metadata }`

Kai pervertinimas yra įgalintas:

- `$nodeLabel.reranked` tampa `true`
- Kiekvienas rezultatas taip pat apima `relevance_score`
- `score` lieka originalus vektorinės panašumo balas
- `relevance_score` yra Cohere pervertinimo balas

## Rezultatų Pasiekimas

- `$ragNode.results.first().text` – geriausio rezultato turinys
- `$ragNode.results.first().score` – panašumo balas (0–1)
- `$ragNode.results.first().metadata.source` – geriausio rezultato metaduomenys
- `$ragNode.results.map("item.text").join("\n\n")` – sujungti LLM kontekstui
- `$ragNode.reranked` – ar buvo taikytas pervertinimas
- `$ragNode.count` – grąžintų rezultatų skaičius
- `$ragNode.replaced` – ar upsert pakeitė esamą dokumentą
- `$ragNode.deleted` – ar ištrynimas pašalino ką nors

## Pavyzdys – Paieška

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

## Pavyzdys – Įterpti

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

## Pavyzdys – Upsert

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

## Pavyzdys – Ištrinti

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

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Įmontuota RAG kaip agento vykdymo dalis
- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Vektorių saugyklų skirtukas](../tabs/vectorstores-tab.md) – Kurti ir valdyti vektorių saugyklas
- [Trečiųjų šalių integracijos](../reference/integrations.md#qdrant) – Qdrant ir Postgres (pgvector) kredencialų nustatymas
- [Agentų mazgas](./agent-node.md) – Naudoti RAG rezultatus kaip agento kontekstą
- [LLM mazgas](./llm-node.md) – Pateikti RAG rezultatus į LLM sistemos užklausą

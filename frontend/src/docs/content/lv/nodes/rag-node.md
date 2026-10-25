# RAG / Vector Store

**RAG / Vector Store** mezgls ievieto, upsertē, dzēš un meklē dokumentus vektoru krātuvē Retrieval Augmented Generation (RAG) vajadzībām. Izmantojiet to, lai papildinātu LLM kontekstu ar atbilstošiem dokumentiem un uzturētu šo kontekstu sinhronizētā ar sistēmu, no kuras dokumenti nāk.

Mezglam ir nolaižamā izvēlne **Database**, kas izvēlas aizmugursistēmu:

- **Qdrant** – glabā vektorus ārējā Qdrant serverī (nepieciešami *RAG: Qdrant + OpenAI* akreditācijas dati).
- **Postgres (pgvector)** – glabā vektorus Heym paša Postgres datubāzē, bez ārēja servisa (nepieciešami *RAG: Psql + OpenAI* akreditācijas dati).

Noklusējuma vērtība ir **Qdrant** saderības ar iepriekšējām versijām nodrošināšanai. Database maiņa filtrē **Vector Store** sarakstu uz krātuvēm, kuru pamatā ir attiecīgā datubāze. Abas aizmugursistēmas atbalsta vienas un tās pašas operācijas, metadatu filtrēšanu, hibrīdo meklēšanu (vektors + BM25) un Cohere pārkārtošanu.

Abas aizmugursistēmas var sasniegt arī, izmantojot *RAG: Custom Embeddings* akreditācijas datus, kas aizstāj OpenAI ar jebkuru OpenAI saderīgu embedding endpoint un norāda savu vektoru krātuvi. Krātuve, kas izveidota no šādiem akreditācijas datiem, parādās zem tās Database, uz kuru tā ir vērsta. Skatiet [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektoru krātuves aizmugursistēma (noklusējums: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektoru krātuve no cilnes [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operācijas veids (arī `operation`) |
| `documentContent` | expression | Dokumenta teksts glabāšanai (insert, upsert) |
| `documentMetadata` | JSON string | Metadati glabātajiem dokumentiem (insert, upsert); vērtības atbalsta izteiksmes |
| `documentIdField` | string | Payload lauks, kas satur unikālo id (upsert, delete; noklusējums `doc_id`) |
| `documentId` | expression | Unikālā id vērtība (upsert, delete) |
| `queryText` | expression | Meklēšanas vaicājums (tikai search) |
| `searchLimit` | number | Maksimālais rezultātu skaits (noklusējums: 5) |
| `metadataFilters` | JSON string | Metadatu filtri meklēšanai (vērtības atbalsta izteiksmes) |
| `hybridSearch` | boolean | Kombinēt vektoru meklēšanu ar BM25 atslēgvārdu meklēšanu (tikai search; noklusējums: izslēgts) |
| `enableReranker` | boolean | Izmantot Cohere meklēšanas rezultātu pārkārtošanai |
| `rerankerCredentialId` | UUID | Cohere akreditācijas dati pārkārtošanai |
| `rerankerTopN` | number | Saglabājamo labāko rezultātu skaits pēc pārkārtošanas |

## Operācijas

### Insert

Pievieno dokumentus vektoru krātuvē.

| Lauks | Obligāts | Apraksts |
|-------|----------|-------------|
| `documentContent` | jā | Teksts, ko iegult un glabāt |
| `documentMetadata` | nē | JSON objekts, piem., `{"source": "user", "category": "general"}` |

**Izvade:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadatu izteiksmes

Metadatu vērtības pieņem izteiksmes, tāpēc dokumentu var glabāt ar kontekstu no izpildes:

```json
{ "url": "$start.url", "category": "faq" }
```

Izteiksmes tiek atrisinātas pēc JSON parsēšanas, nevis aizstājot tekstu tajā, tāpēc vērtība, kas satur pēdiņu vai jaunu rindu, nevar sadalīt objektu. Vērtība, kas ir viena vesela izteiksme, saglabā savu atrisināto tipu — `{"count": "$start.count"}` glabā skaitli, nevis `"7"` —, kas ir svarīgi, jo meklēšanas `metadataFilters` atbilst pēc precīza tipa. Jaukts teksts, piemēram, `"page $start.count"`, tiek atrisināts kā virkne, un ligzdotie objekti un masīvi arī tiek apstrādāti.

Tas pats attiecas uz `upsert` un meklēšanas `metadataFilters`: tas vispirms tiek parsēts un tā vērtības tiek atrisinātas pēc tam, pēc tiem pašiem noteikumiem. Tāpēc filtrs, kas rakstīts kā `{"count": "$start.count"}`, atbilst skaitlim, ko glabāja insert, nevis virknei `"7"`.

### Kurš workflow glabāja dokumentu

Dokuments, kas glabāts bez sava `source`, tiek apzīmogots ar workflow, kas to glabāja, kā `source: "workflow:<workflow name>"`. Cilne [Vectorstores](../tabs/vectorstores-tab.md) grupē tos zem **Added workflow: _name_**, tāpēc krātuves saturs norāda, no kurienes katrs dokuments nāk, un viena workflow dokumentus var dzēst kā grupu. `source` iestatīšana pašam `documentMetadata` vienmēr uzvar pār apzīmogošanu.

### Upsert

Ievieto dokumentu vai aizstāj jau glabāto ar tādu pašu unikālo id.

Id ir lauks **payload iekšienē**, nevis krātuves iekšējais point id, tāpēc dokuments saglabā identifikatoru, ko jau izmanto jūsu sistēma — CRM ieraksta id, SKU, lapas slug. `documentIdField` nosauc šo lauku, un `documentId` satur tā vērtību.

| Lauks | Obligāts | Apraksts |
|-------|----------|-------------|
| `documentId` | jā | Dokumenta unikālais id (atbalsta izteiksmes) |
| `documentContent` | jā | Teksts, ko iegult un glabāt |
| `documentIdField` | nē | Payload lauks, kurā atrodas id (noklusējums `doc_id`) |
| `documentMetadata` | nē | JSON objekts, piem., `{"source": "crm", "url": "$start.url"}` (vērtības atbalsta izteiksmes) |

Vispirms tiek noņemts katrs point, kura id lauks atbilst, tāpēc dokuments, kas iepriekš tika glabāts kā vairāki gabali, tiek aizstāts kā vesels, nevis dublēts. Id lauks tiek ierakstīts payload jūsu vietā, un point id paliek stabils starp viena un tā paša dokumenta upsert operācijām.

**Izvade:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
vai esošā versija tika aizstāta), `$nodeLabel.replaced_count`
### Dzēst

Noņem dokumentu pēc tā paša unikālā id.

| Lauks | Obligāts | Apraksts |
|-------|----------|-------------|
| `documentId` | jā | Dokumenta unikālais id (atbalsta izteiksmes) |
| `documentIdField` | nē | Payload lauks, kurā atrodas id (pēc noklusējuma `doc_id`) |

**Izvade:** `$nodeLabel.deleted` – `true`, ja sakrita vismaz viens punkts, `false`, ja id
nebija krātuvē. `$nodeLabel.deleted_count` norāda, cik punktu tika noņemti.

Id, kura nav, dzēšana nav kļūda: mezgls izpildās veiksmīgi ar `deleted: false`, tāpēc
uzkopšanas zaram nav nepieciešams aizsargs priekšā.

### Meklēt

Semantiskā meklēšana līdzīgiem dokumentiem.

| Lauks | Obligāts | Apraksts |
|-------|----------|-------------|
| `queryText` | jā | Meklēšanas vaicājums |
| `searchLimit` | nē | Maksimālais rezultātu skaits (pēc noklusējuma: 5) |
| `metadataFilters` | nē | Filtrēt pēc metadata (precīzas atbilstības JSON objekts, vērtības atbalsta izteiksmes) |
| `hybridSearch` | nē | Sapludināt vektoru līdzību ar BM25 atslēgvārdu atbilstību (skatīt [Hibrīdā meklēšana](#hibrida-meklesana)) |
| `enableReranker` | nē | Iespējot Cohere pārkārtošanu labākai atbilstībai |
| `rerankerCredentialId` | ja tiek veikta pārkārtošana | Cohere akreditācijas dati |
| `rerankerTopN` | nē | Galīgais rezultātu skaits pēc pārkārtošanas |

**Izvade:** `$nodeLabel.results` – masīvs ar `{ id, text, score, metadata }`

Kad pārkārtošana ir iespējota:

- `$nodeLabel.reranked` kļūst par `true`
- Katrs rezultāts papildus ietver `relevance_score`
- `score` paliek sākotnējais vektoru līdzības rādītājs
- `relevance_score` ir Cohere pārkārtotāja rādītājs


#### Hibrīdā meklēšana

Vektoru meklēšana atrod tekstu, kuram ir tāda pati nozīme kā vaicājumam. Teksts, kas satur tikai precīzus vārdus, var ierindoties zemāk: produkta kods, pieteikuma numurs, personas vārds, kļūda, piemēram, `ERR-4021`. Ieslēdziet **Hibrīdā meklēšana**, un mezgls veiks atslēgvārdu meklēšanu līdzās vektoru meklēšanai un apvienos abus sarakstus, lai viens vaicājums atrastu abu veidu atbilstības.

1. Vektoru meklēšana atgriež labākās atbilstības, tāpat kā bez hibrīdās meklēšanas.
2. Atslēgvārdu meklēšana novērtē saglabāto tekstu attiecībā pret vaicājuma vārdiem ar **BM25**, kas atalgo retus vārdus, atkārtotus vārdus un īsākus dokumentus.
3. Abi sarindotie saraksti tiek sapludināti, izmantojot **reciprocal rank fusion**. Dokuments abu sarakstu augšgalā ierindojas pirmajā vietā, un dokuments, ko atrada tikai viens saraksts, joprojām parādās.

Metadatu filtri attiecas uz abām meklēšanām, un Cohere pārkārtotājs, ja tas ir iespējots, darbojas ar sapludināto sarakstu.

Katrs rezultāts satur abu meklēšanu rādītājus:

| Lauks | Nozīme |
|-------|--------|
| `score` | Sapludinātais rādītājs no 0 līdz 1. `1` nozīmē, ka dokuments bija pirmajā vietā abās meklēšanās. |
| `vector_score` | Vektoru līdzība (0 līdz 1). `null`, ja dokumentu atrada tikai atslēgvārdu meklēšana. |
| `keyword_score` | BM25 rādītājs. `null`, ja neviens no vaicājuma vārdiem neparādās dokumentā. |

`$nodeLabel.hybrid` ir `true`, ja tika veikta hibrīdā meklēšana.

Labi zināt:

- Sapludinātais `score` sarindo rezultātus savā starpā. Tā nav vektoru līdzība, tāpēc vienkāršai meklēšanai pielāgots slieksnis netiek tieši pārnests.
- Vaicājuma vārdi tiek pārveidoti mazajos burtos un sadalīti pēc atstarpēm un pieturzīmēm, tāpēc `ERR-4021` tiek meklēts kā `err` un `4021`. Atslēgvārdu meklēšanā tiek izmantoti līdz pat pirmajiem 16 atšķirīgajiem vaicājuma vārdiem.
- Qdrant: pirmā hibrīdā meklēšana kolekcijā izveido pilnteksta indeksu payload laukā `text`, kam nepieciešama Qdrant atslēga ar rakstīšanas piekļuvi. Lielās kolekcijās tas aizņem brīdi vienu reizi; vēlākas meklēšanas indeksu izmanto atkārtoti.
- Postgres (pgvector): datubāzes migrācija `142_vsi_text_search_index` pievieno pilnteksta indeksu. Pēc atjaunināšanas palaidiet `alembic upgrade head`. Hibrīdā meklēšana darbojas arī bez indeksa, tikai lēnāk lielās krātuvēs.
- Katram vaicājumam atslēgvārdu meklēšana nolasa līdz 200 atbilstošiem dokumentiem, sākot ar retākajiem vaicājuma vārdiem, jo tiem ir vislielākais svars.
## Rezultātu piekļuve

- `$ragNode.results.first().text` – augšējā rezultāta saturs
- `$ragNode.results.first().score` – līdzības rādītājs (0–1), vai sapludinātais rādītājs ar hibrīdo meklēšanu
- `$ragNode.results.first().keyword_score` – BM25 rādītājs (hibrīdā meklēšana)
- `$ragNode.results.first().vector_score` – vektoru līdzība (hibrīdā meklēšana)
- `$ragNode.results.first().metadata.source` – augšējā rezultāta metadata
- `$ragNode.results.map("item.text").join("\n\n")` – apvienot LLM kontekstam
- `$ragNode.reranked` – vai tika piemērota pārkārtošana
- `$ragNode.hybrid` – vai tika piemērota hibrīdā meklēšana
- `$ragNode.count` – atgriezto rezultātu skaits
- `$ragNode.replaced` – vai upsert aizstāja esošu dokumentu
- `$ragNode.deleted` – vai dzēšana kaut ko noņēma

## Piemērs – Meklēt

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

## Piemērs – Hibrīdā meklēšana

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

## Piemērs – Ievietot

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

## Piemērs – Upsert

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

## Piemērs – Dzēst

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

## Saistītais

- [Kāpēc Heym](../getting-started/why-heym.md) – Iebūvēts RAG kā daļa no aģenta izpildlaika
- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Vektoru krātuvju cilne](../tabs/vectorstores-tab.md) – Izveidot un pārvaldīt vektoru krātuves
- [Trešo pušu integrācijas](../reference/integrations.md#qdrant) – Qdrant un Postgres (pgvector) akreditācijas datu iestatīšana
- [Aģenta mezgls](./agent-node.md) – Izmantot RAG rezultātus kā aģenta kontekstu
- [LLM mezgls](./llm-node.md) – Padot RAG rezultātus LLM sistēmas promptā

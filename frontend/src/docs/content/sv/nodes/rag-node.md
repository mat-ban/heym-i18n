# RAG / Vector Store

Noden **RAG / Vector Store** infogar, uppdaterar (upsert), tar bort och söker efter dokument i ett vektorlager för Retrieval Augmented Generation (RAG). Den används för att berika LLM-kontext med relevanta dokument och för att hålla denna kontext i synk med systemet som dokumenten kommer från.

Noden har en rullgardinsmeny för **Databas** som väljer backend:

- **Qdrant** – lagrar vektorer på en extern Qdrant-server (kräver en autentiseringsuppgift av typen *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – lagrar vektorer i Heyms egen Postgres-databas, utan extern tjänst (kräver en autentiseringsuppgift av typen *RAG: Psql + OpenAI*).

Standardvärdet är **Qdrant** för bakåtkompatibilitet. Vid byte av Databas filtreras listan **Vector Store** till lager som backas av den databasen. Båda backends stöder samma operationer, metadatafiltrering, hybridsökning (vektor + BM25) och Cohere-omrankning.

Båda backends kan även nås via en autentiseringsuppgift av typen *RAG: Custom Embeddings*, vilken ersätter OpenAI med valfri OpenAI-kompatibel embedding-endpoint och namnger sitt eget vektorlager. Ett lager som skapats från en sådan autentiseringsuppgift visas under den Databas det riktar sig mot. Se [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend för vektorlager (standard: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorlager från fliken [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operationstyp (även `operation`) |
| `documentContent` | expression | Dokumenttext att lagra (insert, upsert) |
| `documentMetadata` | JSON string | Metadata för lagrade dokument (insert, upsert); värden stöder uttryck |
| `documentIdField` | string | Payload-fält som innehåller det unika id:t (upsert, delete; standard `doc_id`) |
| `documentId` | expression | Värdet på det unika id:t (upsert, delete) |
| `queryText` | expression | Sökfråga (endast search) |
| `searchLimit` | number | Max antal resultat (standard: 5) |
| `metadataFilters` | JSON string | Metadatafilter för sökning (värden stöder uttryck) |
| `hybridSearch` | boolean | Kombinera vektorsökning med BM25-nyckelordssökning (endast search; standard: av) |
| `enableReranker` | boolean | Använd Cohere för att omrankna sökresultat |
| `rerankerCredentialId` | UUID | Cohere-autentiseringsuppgift för omrankning |
| `rerankerTopN` | number | Antal toppresultat att behålla efter omrankning |

## Operationer

### Insert

Lägger till dokument i vektorlagret.

| Fält | Krävs | Beskrivning |
|-------|----------|-------------|
| `documentContent` | ja | Text att bädda in och lagra |
| `documentMetadata` | nej | JSON-objekt, t.ex. `{"source": "user", "category": "general"}` |

**Utdata:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadata-uttryck

Metadatavärden accepterar uttryck, så ett dokument kan lagras med kontext från körningen:

```json
{ "url": "$start.url", "category": "faq" }
```

Uttryck löses upp efter att JSON:en har parsats, inte genom att ersätta text i den, så ett värde som innehåller ett citattecken eller en radbrytning kan inte bryta sönder objektet. Ett värde som utgör ett helt uttryck behåller sin upplösta typ — `{"count": "$start.count"}` lagrar ett tal, inte `"7"` — vilket är viktigt eftersom sökningens `metadataFilters` matchar på exakt typ. Blandad text som `"page $start.count"` löses upp till en sträng, och nästlade objekt och arrayer gås också igenom.

Samma sak gäller för `upsert` och för sökningens `metadataFilters`: den parsas först och dess värden löses upp efteråt, enligt samma regler. Ett filter skrivet som `{"count": "$start.count"}` matchar alltså det tal som en insert lagrade, snarare än strängen `"7"`.

### Vilket workflow som lagrade ett dokument

Ett dokument som lagras utan ett eget `source` stämplas med det workflow som lagrade det, som `source: "workflow:<workflow name>"`. Fliken [Vectorstores](../tabs/vectorstores-tab.md) grupperar dessa under **Added workflow: _name_**, så ett lagers innehåll anger var varje dokument kommer från, och ett workflows dokument kan tas bort som en grupp. Att sätta `source` själv i `documentMetadata` vinner alltid över stämpeln.

### Upsert

Infogar ett dokument, eller ersätter det som redan lagrats under samma unika id.

Id:t är ett fält **inuti payloaden**, inte lagrets interna point-id, så ett dokument behåller den identifierare som det egna systemet redan använder — ett CRM-post-id, en SKU, en sid-slug. `documentIdField` namnger det fältet och `documentId` bär dess värde.

| Fält | Krävs | Beskrivning |
|-------|----------|-------------|
| `documentId` | ja | Dokumentets unika id (stöder uttryck) |
| `documentContent` | ja | Text att bädda in och lagra |
| `documentIdField` | nej | Payload-fältet som id:t finns i (standard `doc_id`) |
| `documentMetadata` | nej | JSON-objekt, t.ex. `{"source": "crm", "url": "$start.url"}` (värden stöder uttryck) |

Varje point vars id-fält matchar tas bort först, så ett dokument som tidigare lagrats som flera chunkar ersätts som en helhet snarare än dupliceras. Id-fältet skrivs in i payloaden åt användaren, och point-id:t förblir stabilt över upprepade upserts av samma dokument.

**Utdata:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — huruvida en befintlig version ersattes), `$nodeLabel.replaced_count`
### Ta bort

Ta bort ett dokument med samma unika id.

| Fält | Obligatoriskt | Beskrivning |
|-------|----------|-------------|
| `documentId` | ja | Unikt id för dokumentet (stöder uttryck) |
| `documentIdField` | nej | Payload-fältet där id:t finns (standard `doc_id`) |

**Utdata:** `$nodeLabel.deleted` – `true` när minst en punkt matchade, `false` när id:t
inte fanns i lagret. `$nodeLabel.deleted_count` anger hur många punkter som togs bort.

Att ta bort ett id som inte finns är inte ett fel: noden lyckas med `deleted: false`, så
en rensningsgren behöver ingen skyddskontroll framför sig.

### Sök

Semantisk sökning efter liknande dokument.

| Fält | Obligatoriskt | Beskrivning |
|-------|----------|-------------|
| `queryText` | ja | Sökfråga |
| `searchLimit` | nej | Max antal resultat (standard: 5) |
| `metadataFilters` | nej | Filtrera på metadata (JSON-objekt med exakt matchning, värden stöder uttryck) |
| `hybridSearch` | nej | Sammanfoga vektorlikhet med BM25-nyckelordsmatchning (se [Hybridsökning](#hybridsokning)) |
| `enableReranker` | nej | Aktivera Cohere-omrankning för bättre relevans |
| `rerankerCredentialId` | vid omrankning | Cohere-autentiseringsuppgift |
| `rerankerTopN` | nej | Slutligt antal resultat efter omrankning |

**Utdata:** `$nodeLabel.results` – array av `{ id, text, score, metadata }`

När omrankning är aktiverad:

- `$nodeLabel.reranked` blir `true`
- Varje resultat innehåller även `relevance_score`
- `score` förblir den ursprungliga vektorlikhetspoängen
- `relevance_score` är Cohere-omrankningspoängen


#### Hybridsökning

Vektorsökning hittar text som har samma betydelse som sökfrågan. Text som endast innehåller de exakta orden kan rankas lägre: en produktkod, ett ärendenummer, ett personnamn, ett fel som `ERR-4021`. Aktivera **Hybridsökning** så kör noden en nyckelordssökning vid sidan av vektorsökningen och sammanfogar båda listorna, så att en fråga hittar båda typerna av träffar.

1. Vektorsökningen returnerar sina bästa träffar, precis som utan hybridsökning.
2. En nyckelordssökning poängsätter den lagrade texten mot frågans ord med **BM25**, vilket belönar sällsynta ord, upprepade ord och kortare dokument.
3. De två rankade listorna sammanfogas med **reciprocal rank fusion**. Ett dokument nära toppen av båda listorna rankas först, och ett dokument som bara en lista hittade visas fortfarande.

Metadatafilter gäller för båda sökningarna, och Cohere-omrankaren körs på den sammanfogade listan om den är aktiverad.

Varje resultat bär poängen från båda sökningarna:

| Fält | Betydelse |
|------|-----------|
| `score` | Sammanfogad poäng från 0 till 1. `1` innebär att dokumentet rankades först i båda sökningarna. |
| `vector_score` | Vektorlikhet (0 till 1). `null` när endast nyckelordssökningen hittade dokumentet. |
| `keyword_score` | BM25-poäng. `null` när inget av frågeorden förekommer i dokumentet. |

`$nodeLabel.hybrid` är `true` när hybridsökning kördes.

Bra att veta:

- Den sammanfogade `score` rangordnar resultaten mot varandra. Det är inte en vektorlikhet, så ett tröskelvärde anpassat för en enkel sökning överförs inte direkt.
- Frågans ord konverteras till gemener och delas upp på mellanslag och skiljetecken, så `ERR-4021` söks som `err` och `4021`. Nyckelordssökningen använder upp till de första 16 distinkta orden i frågan.
- Qdrant: den första hybridsökningen på en samling bygger ett fulltextindex på payload-fältet `text`, vilket kräver en Qdrant-nyckel med skrivbehörighet. På stora samlingar tar detta en stund en enda gång; senare sökningar återanvänder indexet.
- Postgres (pgvector): databasmigringen `142_vsi_text_search_index` lägger till fulltextindexet. Kör `alembic upgrade head` efter uppdatering. Hybridsökning fungerar även utan indexet, bara långsammare på stora lager.
- För varje fråga läser nyckelordssökningen upp till 200 matchande dokument, med början från de mest sällsynta frågeorden, eftersom dessa bär mest vikt.
## Åtkomst till resultat

- `$ragNode.results.first().text` – innehållet i det främsta resultatet
- `$ragNode.results.first().score` – likhetspoäng (0–1), eller den sammanfogade poängen vid hybridsökning
- `$ragNode.results.first().keyword_score` – BM25-poäng (hybridsökning)
- `$ragNode.results.first().vector_score` – vektorlikhet (hybridsökning)
- `$ragNode.results.first().metadata.source` – metadata för det främsta resultatet
- `$ragNode.results.map("item.text").join("\n\n")` – sammanfoga för LLM-kontext
- `$ragNode.reranked` – huruvida omrankning tillämpades
- `$ragNode.hybrid` – huruvida hybridsökning tillämpades
- `$ragNode.count` – antal returnerade resultat
- `$ragNode.replaced` – huruvida en upsert ersatte ett befintligt dokument
- `$ragNode.deleted` – huruvida en borttagning tog bort något

## Exempel – Sök

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

## Exempel – Hybridsökning

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

## Exempel – Infoga

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

## Exempel – Upsert

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

## Exempel – Ta bort

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

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Inbyggd RAG som en del av agentkörningen
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Vektorlager](../tabs/vectorstores-tab.md) – Skapa och hantera vektorlager
- [Tredjepartsintegrationer](../reference/integrations.md#qdrant) – Konfiguration av Qdrant- och Postgres-autentiseringsuppgifter (pgvector)
- [Agentnod](./agent-node.md) – Använd RAG-resultat som agentkontext
- [LLM-nod](./llm-node.md) – Mata in RAG-resultat i LLM:ens systemprompt

# RAG / Vektorlagre

**RAG / Vektorlagre**-noden indsætter, opdaterer, sletter og søger i dokumenter i et vektorlager til Retrieval Augmented Generation (RAG). Den bruges til at udvide LLM-kontekst med relevante dokumenter og holde denne kontekst synkroniseret med det system, dokumenterne stammer fra.

Noden har en **Database**-dropdown, der vælger backend:

- **Qdrant** – lagrer vektorer i en ekstern Qdrant-server (kræver en *RAG: Qdrant + OpenAI*-legitimationsoplysning).
- **Postgres (pgvector)** – lagrer vektorer i Heyms egen Postgres-database, uden ekstern tjeneste (kræver en *RAG: Psql + OpenAI*-legitimationsoplysning).

Standardvalget er **Qdrant** for bagudkompatibilitet. Ved at ændre Database filtreres listen **Vektorlagre** til lagre, der bruger denne database. Begge backends understøtter de samme operationer, metadatafiltrering, hybridsøgning (vektor + BM25) og Cohere-reranking.

Begge backends kan også tilgås via en *RAG: Custom Embeddings*-legitimationsoplysning, som erstatter OpenAI med enhver OpenAI-kompatibel embedding-endpoint og navngiver sit eget vektorlager. Et lager oprettet fra sådanne legitimationsoplysninger vises under den database, det henvender sig til. Se [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (søgning), `$nodeLabel.point_id` (indsæt, opdater), `$nodeLabel.deleted` (slet) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektorlager-backend (standard: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorlager fra fanen [Vektorlagre](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operationstype (også `operation`) |
| `documentContent` | udtryk | Dokumenttekst der skal lagres (indsæt, opdater) |
| `documentMetadata` | JSON-streng | Metadata for lagrede dokumenter (indsæt, opdater); værdier understøtter udtryk |
| `documentIdField` | streng | Payload-felt med det unikke id (opdater, slet; standard `doc_id`) |
| `documentId` | udtryk | Værdi af det unikke id (opdater, slet) |
| `queryText` | udtryk | Søgeforespørgsel (kun søgning) |
| `searchLimit` | tal | Maksimalt antal resultater (standard: 5) |
| `metadataFilters` | JSON-streng | Metadatafiltre til søgning (værdier understøtter udtryk) |
| `hybridSearch` | boolean | Kombiner vektorsøgning med BM25-nøgleordssøgning (kun search; standard: fra) |
| `enableReranker` | boolean | Brug Cohere til reranking af søgeresultater |
| `rerankerCredentialId` | UUID | Cohere-legitimationsoplysning til reranking |
| `rerankerTopN` | tal | Antal topresultater der skal beholdes efter reranking |

## Operationer

### Indsæt

Tilføj dokumenter til vektorlageret.

| Felt | Påkrævet | Beskrivelse |
|-------|----------|-------------|
| `documentContent` | ja | Tekst der skal embeddes og lagres |
| `documentMetadata` | nej | JSON-objekt, f.eks. `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadata-udtryk

Metadata-værdier accepterer udtryk, så et dokument kan lagres med kontekst fra kørslen:

```json
{ "url": "$start.url", "category": "faq" }
```

Udtryk løses efter JSON er parset, ikke ved at substituere tekst ind i det, så en værdi der indeholder et anførselstegn eller linjeskift kan ikke bryde objektet ad. En værdi der er et helt udtryk bevarer sin løste type — `{"count": "$start.count"}` lagrer et tal, ikke `"7"` — hvilket er vigtigt fordi søgningens `metadataFilters` matcher på præcis type. Blandet tekst som `"side $start.count"` løses til en streng, og indlejrede objekter og arrays gennemgås også.

Det samme gælder for `upsert`, og for søgningens `metadataFilters`: det parses først og dens værdier løses efter, med samme regler. Så et filter skrevet som `{"count": "$start.count"}` matcher det tal en indsætning lagrede, i stedet for strengen `"7"`.

### Hvilket workflow lagrede et dokument

Et dokument lagret uden en egen `source` mærkes med det workflow der lagrede det, som `source: "workflow:<workflownavn>"`. Fanen [Vektorlagre](../tabs/vectorstores-tab.md) grupperer disse under **Tilføjet workflow: _navn_**, så et lagres indhold viser hvor hvert dokument kommer fra, og et workflows dokumenter kan slettes som en gruppe. Hvis `source` sættes manuelt i `documentMetadata` tilsidesættes stempelsætningen altid.

### Opdater

Indsæt et dokument, eller erstat det der allerede er lagret under samme unikke id.

Id'et er et felt **i payload'en**, ikke lagrets interne point-id, så et dokument beholder det id det relevante eget system allerede bruger — en CRM-post-id, en SKU, en side-slug. `documentIdField` navngiver dette felt og `documentId` indeholder dets værdi.

| Felt | Påkrævet | Beskrivelse |
|-------|----------|-------------|
| `documentId` | ja | Unikt id for dokumentet (understøtter udtryk) |
| `documentContent` | ja | Tekst der skal embeddes og lagres |
| `documentIdField` | nej | Payload-felt hvor id'et findes (standard `doc_id`) |
| `documentMetadata` | nej | JSON-objekt, f.eks. `{"source": "crm", "url": "$start.url"}` (værdier understøtter udtryk) |

Hvert punkt hvis id-felt matcher fjernes først, så et dokument der tidligere var lagret som flere chunks erstattes som en helhed i stedet for at blive duplikeret. Id-feltet skrives ind i payload'en automatisk, og point-id'et forbliver stabilt på tværs af opdateringer af samme dokument.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — om en eksisterende version blev erstattet), `$nodeLabel.replaced_count`
### Slet

Fjern et dokument ved hjælp af dets unikke id.

| Felt | Påkrævet | Beskrivelse |
|-------|----------|-------------|
| `documentId` | ja | Unikt id for dokumentet (understøtter udtryk) |
| `documentIdField` | nej | Payload-felt hvor id'et findes (standard `doc_id`) |

**Output:** `$nodeLabel.deleted` – `true` når mindst et punkt matchede, `false` når id'et ikke var i lagret. `$nodeLabel.deleted_count` angiver hvor mange punkter der blev fjernet.

At slette et id, der ikke findes, betragtes ikke som en fejl: noden fuldføres med `deleted: false`, så en oprydningsgren ikke behøver en beskyttelse foran.

### Søg

Semantisk søgning efter lignende dokumenter.

| Felt | Påkrævet | Beskrivelse |
|-------|----------|-------------|
| `queryText` | ja | Søgeforespørgsel |
| `searchLimit` | nej | Maksimalt antal resultater (standard: 5) |
| `metadataFilters` | nej | Filtrer efter metadata (præcis match JSON-objekt, værdier understøtter udtryk) |
| `hybridSearch` | nej | Sammenflet vektorlighed med BM25-nøgleordsmatchning (se [Hybridsøgning](#hybridssogning)) |
| `enableReranker` | nej | Aktiver Cohere reranking for bedre relevans |
| `rerankerCredentialId` | ved reranking | Cohere-legitimationsoplysninger |
| `rerankerTopN` | nej | Endeligt antal resultater efter reranking |

**Output:** `$nodeLabel.results` – array af `{ id, text, score, metadata }`

Når reranking er aktiveret:

- `$nodeLabel.reranked` bliver `true`
- Hvert resultat inkluderer også `relevance_score`
- `score` forbliver den oprindelige vektorlighedsscore
- `relevance_score` er Cohere reranking-score


#### Hybridsøgning

Vektorsøgning finder tekst, der har samme betydning som forespørgslen. Tekst, der kun indeholder de nøjagtige ord, kan rangeres lavere: en produktkode, et sagsnummer, en persons navn, en fejl som `ERR-4021`. Slå **Hybridsøgning** til, og knuden kører en nøgleordssøgning ved siden af vektorsøgningen og fletter begge lister sammen, så én forespørgsel finder begge typer matches.

1. Vektorsøgningen returnerer sine bedste matches, præcis som den gør uden hybridsøgning.
2. En nøgleordssøgning scorer den gemte tekst i forhold til forespørgslens ord med **BM25**, hvilket belønner sjældne ord, gentagne ord og kortere dokumenter.
3. De to rangerede lister sammenflettes med **reciprocal rank fusion**. Et dokument nær toppen af begge lister rangerer først, og et dokument, som kun én liste fandt, vises stadig.

Metadatafiltre gælder for begge søgninger, og Cohere-rerankeren kører på den sammenflettede liste, hvis den er aktiveret.

Hvert resultat bærer scoren fra begge søgninger:

| Felt | Betydning |
|------|-----------|
| `score` | Sammenflettet score fra 0 til 1. `1` betyder, at dokumentet rangerede først i begge søgninger. |
| `vector_score` | Vektorlighed (0 til 1). `null`, når kun nøgleordssøgningen fandt dokumentet. |
| `keyword_score` | BM25-score. `null`, når ingen af forespørgselsordene optræder i dokumentet. |

`$nodeLabel.hybrid` er `true`, når hybridsøgning kørte.

Godt at vide:

- Den sammenflettede `score` rangerer resultaterne i forhold til hinanden. Det er ikke en vektorlighed, så en tærskelværdi indstillet til en simpel søgning kan ikke overføres direkte.
- Ord i forespørgslen konverteres til små bogstaver og opdeles på mellemrum og tegnsætning, så `ERR-4021` søges som `err` og `4021`. Nøgleordssøgningen bruger op til de første 16 unikke ord i forespørgslen.
- Qdrant: den første hybridsøgning på en samling opbygger et fuldtekstindeks på payload-feltet `text`, hvilket kræver en Qdrant-nøgle med skriveadgang. På store samlinger tager dette et øjeblik én enkelt gang; senere søgninger genbruger indekset.
- Postgres (pgvector): databasemigreringen `142_vsi_text_search_index` tilføjer fuldtekstindekset. Kør `alembic upgrade head` efter opdatering. Hybridsøgning fungerer også uden indekset, blot langsommere på store lagre.
- For hver forespørgsel læser nøgleordssøgningen op til 200 matchende dokumenter med start fra de sjældneste ord, da disse bærer mest vægt.
## Adgang til Resultater

- `$ragNode.results.first().text` – indhold af bedste resultat
- `$ragNode.results.first().score` – lighedsscore (0–1), eller den sammenflettede score med hybridsøgning
- `$ragNode.results.first().keyword_score` – BM25-score (hybridsøgning)
- `$ragNode.results.first().vector_score` – vektorlighed (hybridsøgning)
- `$ragNode.results.first().metadata.source` – metadata for bedste resultat
- `$ragNode.results.map("item.text").join("\n\n")` – sammenkædning til LLM-kontekst
- `$ragNode.reranked` – om reranking blev anvendt
- `$ragNode.hybrid` – om hybridsøgning blev anvendt
- `$ragNode.count` – antal returnerede resultater
- `$ragNode.replaced` – om en upsert erstattede et eksisterende dokument
- `$ragNode.deleted` – om en sletning fjernede noget

## Eksempel – Søgning

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

## Eksempel – Hybridsøgning

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

## Eksempel – Indsæt

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

## Eksempel – Upsert

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

## Eksempel – Slet

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

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Indbygget RAG som del af agentkøretiden
- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Vektorlagre-fane](../tabs/vectorstores-tab.md) – Opret og håndter vektorlagre
- [Tredjepartsintegrationer](../reference/integrations.md#qdrant) – Opsætning af legitimationsoplysninger til Qdrant og Postgres (pgvector)
- [Agent-node](./agent-node.md) – Brug RAG-resultater som agentkontekst
- [LLM-node](./llm-node.md) – Fodre RAG-resultater ind i LLM-systemprompt

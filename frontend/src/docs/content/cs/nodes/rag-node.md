# RAG / Vector Store

Uzel **RAG / Vector Store** vkládá, upsertuje, maže a vyhledává dokumenty ve vektorovém úložišti pro Retrieval Augmented Generation (RAG). Použijte jej k rozšíření kontextu LLM o relevantní dokumenty a k udržování tohoto kontextu v souladu se systémem, ze kterého dokumenty pocházejí.

Uzel obsahuje dropdown **Database**, který vybírá backend:

- **Qdrant** – ukládá vektory na externím serveru Qdrant (vyžaduje přihlašovací údaje *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – ukládá vektory přímo v databázi Postgres platformy Heym, bez externí služby (vyžaduje přihlašovací údaje *RAG: Psql + OpenAI*).

Výchozí hodnotou je **Qdrant** z důvodu zpětné kompatibility. Změna Database filtruje seznam **Vector Store** na úložiště podporovaná danou databází. Oba backendy podporují stejné operace, filtrování metadat, hybridní vyhledávání (vektor + BM25) a reranking pomocí Cohere.

K oběma backendům lze rovněž přistupovat prostřednictvím přihlašovacích údajů *RAG: Custom Embeddings*, které
nahrazují OpenAI libovolným embedding endpointem kompatibilním s OpenAI a definují vlastní vektorové
úložiště. Úložiště vytvořené z takových přihlašovacích údajů se zobrazí pod databází, na kterou
cílí. Viz [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend vektorového úložiště (výchozí: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorové úložiště ze záložky [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Typ operace (také `operation`) |
| `documentContent` | expression | Text dokumentu k uložení (insert, upsert) |
| `documentMetadata` | JSON string | Metadata pro ukládané dokumenty (insert, upsert); hodnoty podporují výrazy |
| `documentIdField` | string | Pole payloadu obsahující jedinečné id (upsert, delete; výchozí `doc_id`) |
| `documentId` | expression | Hodnota jedinečného id (upsert, delete) |
| `queryText` | expression | Vyhledávací dotaz (pouze search) |
| `searchLimit` | number | Maximální počet výsledků (výchozí: 5) |
| `metadataFilters` | JSON string | Filtry metadat pro vyhledávání (hodnoty podporují výrazy) |
| `hybridSearch` | boolean | Kombinovat vektorové vyhledávání s klíčovými slovy BM25 (pouze search; výchozí: vypnuto) |
| `enableReranker` | boolean | Použít Cohere pro reranking výsledků vyhledávání |
| `rerankerCredentialId` | UUID | Přihlašovací údaje Cohere pro reranking |
| `rerankerTopN` | number | Počet nejlepších výsledků, které se mají zachovat po rerankingu |

## Operace

### Insert

Přidá dokumenty do vektorového úložiště.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentContent` | ano | Text k embedování a uložení |
| `documentMetadata` | ne | JSON objekt, např. `{"source": "user", "category": "general"}` |

**Výstup:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Výrazy v metadatech

Hodnoty metadat přijímají výrazy, takže dokument lze uložit s kontextem ze spuštění:

```json
{ "url": "$start.url", "category": "faq" }
```

Výrazy se vyhodnocují po parsování JSON, nikoli substitucí textu do něj, takže hodnota
obsahující uvozovku nebo nový řádek nemůže objekt rozbít. Hodnota, která je jedním
celým výrazem, si zachovává svůj vyhodnocený typ — `{"count": "$start.count"}` uloží číslo, nikoli
`"7"` — což je důležité, protože `metadataFilters` při vyhledávání porovnávají na přesný typ. Smíšený text jako
`"page $start.count"` se vyhodnotí na řetězec a vnořené objekty a pole se také procházejí.

Totéž platí pro `upsert` a pro `metadataFilters` vyhledávání: nejprve se parsují a jejich
hodnoty se vyhodnocují následně, podle stejných pravidel. Filtr zapsaný jako `{"count": "$start.count"}`
tedy odpovídá číslu, které uložil insert, nikoli řetězci `"7"`.

### Který workflow dokument uložil

Dokument uložený bez vlastního `source` je označen workflow, které jej uložilo,
jako `source: "workflow:<workflow name>"`. Záložka [Vectorstores](../tabs/vectorstores-tab.md)
seskupuje tyto dokumenty pod **Added workflow: _name_**, takže obsah úložiště říká, odkud každý dokument
pochází, a dokumenty jednoho workflow lze smazat jako skupinu. Nastavení `source` vlastními silami
v `documentMetadata` vždy přebije toto označení.

### Upsert

Vloží dokument nebo nahradí ten, který je již uložen pod stejným jedinečným id.

Id je pole **uvnitř payloadu**, nikoli interní point id úložiště, takže dokument
si zachovává identifikátor, který již používá váš vlastní systém — id záznamu v CRM, SKU, slug stránky.
`documentIdField` pojmenovává toto pole a `documentId` nese jeho hodnotu.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentId` | ano | Jedinečné id dokumentu (podporuje výrazy) |
| `documentContent` | ano | Text k embedování a uložení |
| `documentIdField` | ne | Pole payloadu, ve kterém id žije (výchozí `doc_id`) |
| `documentMetadata` | ne | JSON objekt, např. `{"source": "crm", "url": "$start.url"}` (hodnoty podporují výrazy) |

Každý point, jehož id pole odpovídá, je nejprve odstraněn, takže dokument, který byl dříve
uložen jako několik chunků, je nahrazen jako celek, nikoli duplikován. Id pole je
zapsáno do payloadu za vás a point id zůstává stabilní napříč upserty stejného
dokumentu.

**Výstup:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
zda byla nahrazena existující verze), `$nodeLabel.replaced_count`
### Smazání

Odstraní dokument podle stejného jedinečného id.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentId` | ano | Jedinečné id dokumentu (podporuje výrazy) |
| `documentIdField` | ne | Pole v Payload, ve kterém se id nachází (výchozí `doc_id`) |

**Výstup:** `$nodeLabel.deleted` – `true`, pokud odpovídal alespoň jeden bod, `false`, pokud id
v úložišti nebylo. `$nodeLabel.deleted_count` obsahuje počet odstraněných bodů.

Smazání neexistujícího id není chyba: uzel uspěje s `deleted: false`, takže
větev pro úklid nepotřebuje na začátku žádnou kontrolu.

### Vyhledávání

Sémantické vyhledávání podobných dokumentů.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `queryText` | ano | Vyhledávací dotaz |
| `searchLimit` | ne | Maximální počet výsledků (výchozí: 5) |
| `metadataFilters` | ne | Filtrování podle metadat (JSON objekt s přesnou shodou, hodnoty podporují výrazy) |
| `hybridSearch` | ne | Sloučit vektorovou podobnost se shodou klíčových slov BM25 (viz [Hybridní vyhledávání](#hybridni-vyhledavani)) |
| `enableReranker` | ne | Zapne Cohere reranking pro lepší relevanci |
| `rerankerCredentialId` | při rerankingu | Přihlašovací údaje Cohere |
| `rerankerTopN` | ne | Konečný počet výsledků po rerankingu |

**Výstup:** `$nodeLabel.results` – pole `{ id, text, score, metadata }`

Pokud je reranking zapnutý:

- `$nodeLabel.reranked` se nastaví na `true`
- Každý výsledek navíc obsahuje `relevance_score`
- `score` zůstává původní skóre vektorové podobnosti
- `relevance_score` je skóre Cohere rerankeru


#### Hybridní vyhledávání

Vektorové vyhledávání nachází text se stejným významem jako dotaz. Text, který obsahuje pouze přesná slova, se může umístit níže: kód produktu, číslo požadavku, jméno osoby, chyba jako `ERR-4021`. Zapněte **Hybridní vyhledávání** a uzel spustí vyhledávání podle klíčových slov vedle vektorového vyhledávání a sloučí oba seznamy, takže jeden dotaz najde oba typy shod.

1. Vektorové vyhledávání vrací své nejlepší shody stejně jako bez hybridního vyhledávání.
2. Vyhledávání podle klíčových slov hodnotí uložený text vůči slovům dotazu pomocí **BM25**, což odměňuje vzácná slova, opakovaná slova a kratší dokumenty.
3. Dva seřazené seznamy se sloučí pomocí **reciprocal rank fusion**. Dokument blízko začátku obou seznamů se umístí na prvním místě a dokument nalezený pouze jedním seznamem se přesto objeví.

Filtry metadat platí pro obě vyhledávání a Cohere reranker, pokud je povolen, běží na sloučeném seznamu.

Každý výsledek nese skóre obou vyhledávání:

| Pole | Význam |
|------|--------|
| `score` | Sloučené skóre od 0 do 1. `1` znamená, že dokument byl první v obou vyhledáváních. |
| `vector_score` | Vektorová podobnost (0 až 1). `null`, pokud dokument nalezlo pouze vyhledávání podle klíčových slov. |
| `keyword_score` | Skóre BM25. `null`, pokud se žádné ze slov dotazu v dokumentu nevyskytuje. |

`$nodeLabel.hybrid` má hodnotu `true`, pokud proběhlo hybridní vyhledávání.

Dobré vědět:

- Sloučené `score` řadí výsledky vůči sobě. Nejedná se o vektorovou podobnost, takže prahová hodnota nastavená pro jednoduché vyhledávání se nepřenáší přímo.
- Slova dotazu se převádějí na malá písmena a dělí mezerami a interpunkcí, takže `ERR-4021` se vyhledává jako `err` a `4021`. Vyhledávání podle klíčových slov používá až prvních 16 odlišných slov dotazu.
- Qdrant: první hybridní vyhledávání v kolekci vytvoří fulltextový index v poli payload `text`, což vyžaduje klíč Qdrant s právem zápisu. U velkých kolekcí to trvá chvíli pouze jednou; pozdější vyhledávání index znovu využívají.
- Postgres (pgvector): migrace databáze `142_vsi_text_search_index` přidává fulltextový index. Po aktualizaci spusťte `alembic upgrade head`. Hybridní vyhledávání funguje i bez indexu, pouze pomaleji u velkých úložišť.
- Pro každý dotaz přečte vyhledávání podle klíčových slov až 200 odpovídajících dokumentů, počínaje nejvzácnějšími slovy dotazu, protože ta mají největší váhu.
## Přístup k výsledkům

- `$ragNode.results.first().text` – obsah nejlepšího výsledku
- `$ragNode.results.first().score` – skóre podobnosti (0–1), nebo sloučené skóre při hybridním vyhledávání
- `$ragNode.results.first().keyword_score` – skóre BM25 (hybridní vyhledávání)
- `$ragNode.results.first().vector_score` – vektorová podobnost (hybridní vyhledávání)
- `$ragNode.results.first().metadata.source` – metadata nejlepšího výsledku
- `$ragNode.results.map("item.text").join("\n\n")` – spojení pro kontext LLM
- `$ragNode.reranked` – zda byl aplikován reranking
- `$ragNode.hybrid` – zda bylo aplikováno hybridní vyhledávání
- `$ragNode.count` – počet vrácených výsledků
- `$ragNode.replaced` – zda upsert nahradil existující dokument
- `$ragNode.deleted` – zda smazání něco odstranilo

## Příklad – Vyhledávání

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

## Příklad – Hybridní vyhledávání

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

## Příklad – Vložení

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

## Příklad – Upsert

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

## Příklad – Smazání

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

## Související

- [Proč Heym](../getting-started/why-heym.md) – Vestavěné RAG jako součást běhového prostředí agenta
- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Záložka Vektorová úložiště](../tabs/vectorstores-tab.md) – Vytváření a správa vektorových úložišť
- [Integrace třetích stran](../reference/integrations.md#qdrant) – Nastavení přihlašovacích údajů Qdrant a Postgres (pgvector)
- [Uzel Agent](./agent-node.md) – Použití výsledků RAG jako kontextu agenta
- [Uzel LLM](./llm-node.md) – Vložení výsledků RAG do systémového Promptu LLM

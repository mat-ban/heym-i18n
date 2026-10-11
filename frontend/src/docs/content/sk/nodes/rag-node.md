# RAG / Vector Store

Uzol **RAG / Vector Store** vkladá, aktualizuje (upsert), odstraňuje a vyhľadáva dokumenty vo vektorovom úložisku pre Retrieval Augmented Generation (RAG). Použite ho na rozšírenie kontextu LLM o relevantné dokumenty a na udržanie tohto kontextu v súlade so systémom, z ktorého dokumenty pochádzajú.

Uzol obsahuje rozbaľovací zoznam **Database**, ktorý vyberá backend:

- **Qdrant** – ukladá vektory na externom serveri Qdrant (vyžaduje prihlasovacie údaje *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – ukladá vektory priamo v databáze Postgres systému Heym, bez externých služieb (vyžaduje prihlasovacie údaje *RAG: Psql + OpenAI*).

Predvolenou hodnotou je **Qdrant** kvôli spätnej kompatibilite. Zmena databázy filtruje zoznam **Vector Store** na úložiská podporované danou databázou. Oba backendy podporujú rovnaké operácie, filtrovanie metadát a reranking cez Cohere.

K obom backendom je možné pristupovať aj prostredníctvom prihlasovacích údajov *RAG: Custom Embeddings*, ktoré
nahrádzajú OpenAI akýmkoľvek embeddingovým endpointom kompatibilným s OpenAI a pomenúvajú vlastné vektorové
úložisko. Úložisko vytvorené z takýchto prihlasovacích údajov sa zobrazí pod databázou, na ktorú
je zacielené. Pozrite si [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (vyhľadávanie), `$nodeLabel.point_id` (vkladanie, upsert), `$nodeLabel.deleted` (odstránenie) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend vektorového úložiska (predvolené: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorové úložisko z karty [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Typ operácie (tiež `operation`) |
| `documentContent` | výraz | Text dokumentu na uloženie (vkladanie, upsert) |
| `documentMetadata` | JSON reťazec | Metadáta pre ukladané dokumenty (vkladanie, upsert); hodnoty podporujú výrazy |
| `documentIdField` | reťazec | Pole payloadu obsahujúce jedinečný identifikátor (upsert, odstránenie; predvolené `doc_id`) |
| `documentId` | výraz | Hodnota jedinečného identifikátora (upsert, odstránenie) |
| `queryText` | výraz | Vyhľadávací dotaz (iba vyhľadávanie) |
| `searchLimit` | číslo | Maximálny počet výsledkov (predvolené: 5) |
| `metadataFilters` | JSON reťazec | Filtre metadát pre vyhľadávanie (hodnoty podporujú výrazy) |
| `enableReranker` | boolean | Použiť Cohere na reranking výsledkov vyhľadávania |
| `rerankerCredentialId` | UUID | Prihlasovacie údaje Cohere pre reranking |
| `rerankerTopN` | číslo | Počet najlepších výsledkov, ktoré sa zachovajú po rerankingu |

## Operácie

### Vkladanie

Pridá dokumenty do vektorového úložiska.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentContent` | áno | Text na vloženie a uloženie |
| `documentMetadata` | nie | JSON objekt, napr. `{"source": "user", "category": "general"}` |

**Výstup:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Výrazy v metadátach

Hodnoty metadát akceptujú výrazy, takže dokument je možné uložiť s kontextom z daného spustenia:

```json
{ "url": "$start.url", "category": "faq" }
```

Výrazy sa vyhodnocujú po spracovaní JSON, nie nahradzovaním textu v ňom, takže hodnota
obsahujúca úvodzovku alebo znak nového riadku nemôže objekt rozbiť. Hodnota, ktorá je jedným
celým výrazom, si zachováva svoj vyhodnotený typ — `{"count": "$start.count"}` uloží číslo, nie
`"7"` — čo je dôležité, pretože vyhľadávacie `metadataFilters` porovnávajú podľa presného typu. Zmiešaný text ako
`"page $start.count"` sa vyhodnotí ako reťazec a vnorené objekty a polia sa tiež prechádzajú.

To isté platí pre `upsert` a pre `metadataFilters` pri vyhľadávaní: najprv sa spracuje a jeho
hodnoty sa vyhodnotia následne, podľa rovnakých pravidiel. Takže filter zapísaný ako `{"count": "$start.count"}`
zodpovedá číslu, ktoré uložilo vkladanie, a nie reťazcu `"7"`.

### Ktorý workflow uložil dokument

Dokument uložený bez vlastného `source` je označený workflowom, ktorý ho uložil,
ako `source: "workflow:<workflow name>"`. Karta [Vectorstores](../tabs/vectorstores-tab.md)
zoskupuje tieto dokumenty pod **Added workflow: _name_**, takže obsah úložiska hovorí, odkiaľ každý dokument
pochádza, a dokumenty jedného workflowu je možné odstrániť ako skupinu. Ak nastavíte `source` sami
v `documentMetadata`, vždy má prednosť pred označením.

### Upsert

Vloží dokument alebo nahradí ten, ktorý je už uložený pod rovnakým jedinečným identifikátorom.

Identifikátor je pole **vnútri payloadu**, nie interné point id úložiska, takže dokument
si zachováva identifikátor, ktorý už používa váš vlastný systém — id záznamu v CRM, SKU, slug stránky.
`documentIdField` pomenúva toto pole a `documentId` nesie jeho hodnotu.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentId` | áno | Jedinečný identifikátor dokumentu (podporuje výrazy) |
| `documentContent` | áno | Text na vloženie a uloženie |
| `documentIdField` | nie | Pole payloadu, v ktorom sa nachádza identifikátor (predvolené `doc_id`) |
| `documentMetadata` | nie | JSON objekt, napr. `{"source": "crm", "url": "$start.url"}` (hodnoty podporujú výrazy) |

Každý point, ktorého pole identifikátora zodpovedá, sa najprv odstráni, takže dokument, ktorý bol predtým
uložený ako niekoľko častí, sa nahradí ako celok, a nie duplikuje. Pole identifikátora sa
zapíše do payloadu za vás a point id zostáva stabilné naprieč upsertmi toho istého
dokumentu.

**Výstup:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
či bola existujúca verzia nahradená), `$nodeLabel.replaced_count`
### Odstránenie

Odstráni dokument podľa rovnakého jedinečného id.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `documentId` | áno | Jedinečné id dokumentu (podporuje výrazy) |
| `documentIdField` | nie | Pole v Payloade, v ktorom sa id nachádza (predvolené `doc_id`) |

**Výstup:** `$nodeLabel.deleted` – `true`, keď sa zhodoval aspoň jeden bod, `false`, keď id
nebol v úložisku. `$nodeLabel.deleted_count` obsahuje počet odstránených bodov.

Odstránenie id, ktoré sa tam nenachádza, nie je chyba: uzol uspeje s `deleted: false`, takže
vetva na čistenie nepotrebuje pred sebou žiadnu poistku.

### Vyhľadávanie

Sémantické vyhľadávanie podobných dokumentov.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `queryText` | áno | Vyhľadávací dopyt |
| `searchLimit` | nie | Maximálny počet výsledkov (predvolené: 5) |
| `metadataFilters` | nie | Filtrovanie podľa metadát (JSON objekt s presnou zhodou, hodnoty podporujú výrazy) |
| `enableReranker` | nie | Povoliť Cohere reranking pre lepšiu relevantnosť |
| `rerankerCredentialId` | pri rerankingu | Cohere prihlasovacie údaje |
| `rerankerTopN` | nie | Konečný počet výsledkov po rerankingu |

**Výstup:** `$nodeLabel.results` – pole `{ id, text, score, metadata }`

Keď je povolený reranking:

- `$nodeLabel.reranked` sa zmení na `true`
- Každý výsledok navyše obsahuje `relevance_score`
- `score` zostáva pôvodné skóre vektorovej podobnosti
- `relevance_score` je skóre Cohere rerankera

## Prístup k výsledkom

- `$ragNode.results.first().text` – obsah najlepšieho výsledku
- `$ragNode.results.first().score` – skóre podobnosti (0–1)
- `$ragNode.results.first().metadata.source` – metadáta najlepšieho výsledku
- `$ragNode.results.map("item.text").join("\n\n")` – zreťazenie pre kontext LLM
- `$ragNode.reranked` – či bol aplikovaný reranking
- `$ragNode.count` – počet vrátených výsledkov
- `$ragNode.replaced` – či upsert nahradil existujúci dokument
- `$ragNode.deleted` – či odstránenie niečo odstránilo

## Príklad – Vyhľadávanie

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

## Príklad – Vloženie

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

## Príklad – Upsert

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

## Príklad – Odstránenie

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

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Vstavané RAG ako súčasť behového prostredia agenta
- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Vektorové úložiská](../tabs/vectorstores-tab.md) – Vytváranie a správa vektorových úložísk
- [Integrácie tretích strán](../reference/integrations.md#qdrant) – Nastavenie prihlasovacích údajov pre Qdrant a Postgres (pgvector)
- [Uzol Agent](./agent-node.md) – Použitie výsledkov RAG ako kontextu agenta
- [Uzol LLM](./llm-node.md) – Vloženie výsledkov RAG do systémového Promptu LLM

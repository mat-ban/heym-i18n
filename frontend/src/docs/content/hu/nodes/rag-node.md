# RAG / Vector Store

A **RAG / Vector Store** csomópont dokumentumokat szúr be, upsertel, töröl és keres vektortárolókban a Retrieval Augmented Generation (RAG) céljából. Használja arra, hogy az LLM kontextusát releváns dokumentumokkal egészítse ki, és hogy ezt a kontextust összhangban tartsa azzal a rendszerrel, amelyből a dokumentumok származnak.

A csomópont rendelkezik egy **Database** legördülő menüvel, amely a háttérrendszert választja ki:

- **Qdrant** – vektorokat egy külső Qdrant szerveren tárol (ehhez *RAG: Qdrant + OpenAI* hitelesítési adat szükséges).
- **Postgres (pgvector)** – vektorokat a Heym saját Postgres adatbázisában tárol, külső szolgáltatás nélkül (ehhez *RAG: Psql + OpenAI* hitelesítési adat szükséges).

Az alapértelmezett érték a visszafelé kompatibilitás érdekében a **Qdrant**. A Database módosítása az adott adatbázis által támogatott tárolókra szűri a **Vector Store** listát. Mindkét háttérrendszer ugyanazokat a műveleteket, metaadatszűrést, a hibrid (vektor + BM25) keresést és a Cohere rerankinget támogatja.

Mindkét háttérrendszer elérhető egy *RAG: Custom Embeddings* hitelesítési adaton keresztül is, amely
az OpenAI-t bármely OpenAI-kompatibilis embedding endpointra cseréli, és saját vektortárolót
nevez meg. Az ilyen hitelesítési adatból létrehozott tároló attól függően jelenik meg, hogy melyik Database-et
célozza. Lásd: [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (keresés), `$nodeLabel.point_id` (beszúrás, upsert), `$nodeLabel.deleted` (törlés) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektortároló háttérrendszer (alapértelmezett: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektortároló a [Vectorstores](../tabs/vectorstores-tab.md) fülről |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Művelet típusa (más néven `operation`) |
| `documentContent` | expression | Tárolandó dokumentumszöveg (beszúrás, upsert) |
| `documentMetadata` | JSON string | A tárolt dokumentumok metaadatai (beszúrás, upsert); az értékek támogatják a kifejezéseket |
| `documentIdField` | string | Az egyedi azonosítót tartalmazó payload mező (upsert, törlés; alapértelmezett: `doc_id`) |
| `documentId` | expression | Az egyedi azonosító értéke (upsert, törlés) |
| `queryText` | expression | Keresési lekérdezés (csak keresés esetén) |
| `searchLimit` | number | Eredmények maximális száma (alapértelmezett: 5) |
| `metadataFilters` | JSON string | Metaadatszűrők a kereséshez (az értékek támogatják a kifejezéseket) |
| `hybridSearch` | boolean | Vektorkeresés kombinálása BM25 kulcsszavas kereséssel (csak search; alapértelmezett: kikapcsolva) |
| `enableReranker` | boolean | A keresési eredmények Cohere-rel történő rerankelése |
| `rerankerCredentialId` | UUID | Cohere hitelesítési adat a rerankinghez |
| `rerankerTopN` | number | A rerankelés után megtartandó legjobb eredmények száma |

## Műveletek

### Insert

Dokumentumok hozzáadása a vektortárolóhoz.

| Mező | Kötelező | Leírás |
|-------|----------|-------------|
| `documentContent` | igen | Beágyazandó és tárolandó szöveg |
| `documentMetadata` | nem | JSON objektum, pl. `{"source": "user", "category": "general"}` |

**Kimenet:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metaadat-kifejezések

A metaadatértékek elfogadnak kifejezéseket, így egy dokumentum a futtatás kontextusával együtt tárolható:

```json
{ "url": "$start.url", "category": "faq" }
```

A kifejezések a JSON feldolgozása után kerülnek feloldásra, nem pedig szövegbe történő behelyettesítéssel, így egy idézőjelet vagy sortörést tartalmazó érték nem tudja széttörni az objektumot. Egy teljes kifejezést alkotó érték megőrzi a feloldott típusát — a `{"count": "$start.count"}` egy számot tárol, nem a `"7"` szöveget —, ami azért fontos, mert a keresés `metadataFilters` pontos típusegyezést végez. A vegyes szöveg, például a `"page $start.count"`, szöveggé oldódik fel, és a beágyazott objektumok és tömbök is bejárásra kerülnek.

Ugyanez vonatkozik az `upsert` műveletre és a keresés `metadataFilters` paraméterére is: először feldolgozásra kerül, majd az értékei ugyanezen szabályok szerint oldódnak fel. Így a `{"count": "$start.count"}` formában írt szűrő arra a számra illeszkedik, amelyet egy beszúrás tárolt, nem pedig a `"7"` szövegre.

### Melyik workflow tárolta a dokumentumot

Egy saját `source` nélkül tárolt dokumentum megkapja annak a workflow-nak a bélyegzőjét, amely tárolta, a következő formában: `source: "workflow:<workflow name>"`. A [Vectorstores](../tabs/vectorstores-tab.md) fül ezeket az **Added workflow: _name_** alatt csoportosítja, így egy tároló tartalma megmutatja, hogy honnan származik az egyes dokumentumok, és egy workflow dokumentumai csoportként törölhetők. Ha Ön maga állítja be a `source` értékét a `documentMetadata`-ban, az mindig felülírja a bélyegzőt.

### Upsert

Egy dokumentum beszúrása, vagy a már tárolt dokumentum lecserélése ugyanazon egyedi azonosító alatt.

Az azonosító egy **a payloadon belüli** mező, nem a tároló belső point id-ja, így egy dokumentum megtartja azt az azonosítót, amelyet a saját rendszere már használ — egy CRM rekord id-t, egy SKU-t, egy oldal slugot. A `documentIdField` nevezi meg ezt a mezőt, a `documentId` pedig az értékét hordozza.

| Mező | Kötelező | Leírás |
|-------|----------|-------------|
| `documentId` | igen | A dokumentum egyedi azonosítója (támogatja a kifejezéseket) |
| `documentContent` | igen | Beágyazandó és tárolandó szöveg |
| `documentIdField` | nem | A payload mező, amelyben az azonosító található (alapértelmezett: `doc_id`) |
| `documentMetadata` | nem | JSON objektum, pl. `{"source": "crm", "url": "$start.url"}` (az értékek támogatják a kifejezéseket) |

Minden point, amelynek az id mezője egyezik, először eltávolításra kerül, így egy korábban több chunkként tárolt dokumentum egészként cserélődik le, nem pedig duplikálódik. Az id mezőt a rendszer beírja a payloadba Ön helyett, és a point id az ugyanazon dokumentum upsertjei során stabil marad.

**Kimenet:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
hogy egy létező verzió lecserélésre került-e), `$nodeLabel.replaced_count`
### Törlés

Dokumentum eltávolítása ugyanazon egyedi azonosító alapján.

| Mező | Kötelező | Leírás |
|-------|----------|-------------|
| `documentId` | igen | A dokumentum egyedi azonosítója (támogatja a kifejezéseket) |
| `documentIdField` | nem | A Payload mező, amelyben az azonosító található (alapértelmezett: `doc_id`) |

**Kimenet:** `$nodeLabel.deleted` – `true`, ha legalább egy pont egyezett, `false`, ha az azonosító
nem szerepelt a tárolóban. A `$nodeLabel.deleted_count` tartalmazza, hogy hány pont került eltávolításra.

Egy nem létező azonosító törlése nem hiba: a csomópont `deleted: false` értékkel sikeresen lefut, így
egy tisztítási ág elé nem szükséges védelmet beilleszteni.

### Keresés

Szemantikus keresés hasonló dokumentumokra.

| Mező | Kötelező | Leírás |
|-------|----------|-------------|
| `queryText` | igen | Keresési lekérdezés |
| `searchLimit` | nem | Eredmények maximális száma (alapértelmezett: 5) |
| `metadataFilters` | nem | Szűrés metaadatok alapján (pontos egyezést vizsgáló JSON objektum, az értékek támogatják a kifejezéseket) |
| `hybridSearch` | nem | Vektorhasonlóság egyesítése BM25 kulcsszóegyezéssel (lásd [Hibrid keresés](#hibrid-kereses)) |
| `enableReranker` | nem | Cohere reranking engedélyezése a jobb relevancia érdekében |
| `rerankerCredentialId` | reranking esetén | Cohere hitelesítési adat |
| `rerankerTopN` | nem | Az eredmények végleges száma a reranking után |

**Kimenet:** `$nodeLabel.results` – `{ id, text, score, metadata }` elemekből álló tömb

Ha a reranking engedélyezett:

- A `$nodeLabel.reranked` értéke `true` lesz
- Minden eredmény tartalmaz `relevance_score` értéket is
- A `score` az eredeti vektor hasonlósági pontszám marad
- A `relevance_score` a Cohere reranker pontszáma


#### Hibrid keresés

A vektorkeresés olyan szöveget talál meg, amelynek jelentése megegyezik a lekérdezésével. A csak pontos szavakat tartalmazó szövegek hátrébb sorolódhatnak: egy termékkód, egy hibajegyszám, egy személy neve, vagy egy olyan hiba, mint a `ERR-4021`. Kapcsolja be a **Hibrid keresés** funkciót, és a csomópont a vektorkeresés mellett egy kulcsszavas keresést is futtat, majd összefésüli a két listát, így egyetlen lekérdezés mindkét típusú találatot felkutatja.

1. A vektorkeresés a legjobb találatait adja vissza, akárcsak hibrid keresés nélkül.
2. A kulcsszavas keresés a lekérdezés szavai alapján értékeli a tárolt szöveget a **BM25** algoritmussal, amely jutalmazza a ritka szavakat, az ismétlődő szavakat és a rövidebb dokumentumokat.
3. A két rangsorolt lista a **reciprocal rank fusion** eljárással egyesül. A mindkét lista élén szereplő dokumentum az első helyre kerül, és a csak az egyik lista által megtalált dokumentum is megjelenik.

A metaadatszűrők mindkét keresésre érvényesek, és a Cohere reranker – amennyiben engedélyezve van – az egyesített listán fut le.

Minden találat tartalmazza mindkét keresés pontszámát:

| Mező | Jelentés |
|------|----------|
| `score` | Egyesített pontszám 0 és 1 között. Az `1` azt jelenti, hogy a dokumentum mindkét keresésben az első helyen végzett. |
| `vector_score` | Vektorhasonlóság (0 és 1 között). `null`, ha a dokumentumot csak a kulcsszavas keresés találta meg. |
| `keyword_score` | BM25 pontszám. `null`, ha a lekérdezés szavai közül egyik sem szerepel a dokumentumban. |

A `$nodeLabel.hybrid` értéke `true`, ha a hibrid keresés lefutott.

Jó tudni:

- Az egyesített `score` egymáshoz viszonyítva rangsorolja a találatokat. Ez nem vektorhasonlóság, így az egyszerű keresésre beállított küszöbérték nem vihető át közvetlenül.
- A lekérdezés szavai kisbetűssé alakulnak, és szóközök, valamint írásjelek mentén darabolódnak, így a `ERR-4021` keresése `err` és `4021` formájában történik. A kulcsszavas keresés a lekérdezés legfeljebb első 16 egyedi szavát használja.
- Qdrant: a gyűjteményen végzett első hibrid keresés teljes szöveges indexet hoz létre a `text` payload mezőn, amihez írási joggal rendelkező Qdrant kulcs szükséges. Nagy gyűjteményeknél ez egyszer vesz igénybe egy pillanatot; a későbbi keresések újrahasznosítják az indexet.
- Postgres (pgvector): a `142_vsi_text_search_index` adatbázis-migráció hozzáadja a teljes szöveges indexet. Frissítés után futtassa az `alembic upgrade head` parancsot. A hibrid keresés index nélkül is működik, de nagy tárolók esetén lassabban.
- A kulcsszavas keresés minden lekérdezésnél legfeljebb 200 egyező dokumentumot olvas be, a legritkább lekérdezési szavakkal kezdve, mivel azok hordozzák a legnagyobb súlyt.
## Eredmények elérése

- `$ragNode.results.first().text` – a legjobb találat tartalma
- `$ragNode.results.first().score` – hasonlósági pontszám (0–1), vagy az egyesített pontszám hibrid keresés esetén
- `$ragNode.results.first().keyword_score` – BM25 pontszám (hibrid keresés)
- `$ragNode.results.first().vector_score` – vektorhasonlóság (hibrid keresés)
- `$ragNode.results.first().metadata.source` – a legjobb találat metaadatai
- `$ragNode.results.map("item.text").join("\n\n")` – összefűzés LLM kontextushoz
- `$ragNode.reranked` – történt-e reranking
- `$ragNode.hybrid` – történt-e hibrid keresés
- `$ragNode.count` – a visszaadott eredmények száma
- `$ragNode.replaced` – egy upsert lecserélt-e egy meglévő dokumentumot
- `$ragNode.deleted` – egy törlés eltávolított-e bármit

## Példa – Keresés

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

## Példa – Hibrid keresés

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

## Példa – Beszúrás

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

## Példa – Upsert

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

## Példa – Törlés

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

## Kapcsolódó

- [Miért a Heym?](../getting-started/why-heym.md) – Beépített RAG az ügynök futtatókörnyezet részeként
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Vektortárolók lap](../tabs/vectorstores-tab.md) – Vektortárolók létrehozása és kezelése
- [Harmadik féltől származó integrációk](../reference/integrations.md#qdrant) – Qdrant és Postgres (pgvector) hitelesítési adatok beállítása
- [Ügynök csomópont](./agent-node.md) – A RAG eredmények használata ügynök kontextusként
- [LLM csomópont](./llm-node.md) – A RAG eredmények betáplálása az LLM rendszer promptba

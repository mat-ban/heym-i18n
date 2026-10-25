# RAG / Vektorska shramba

Vozlišče **RAG / Vektorska shramba** vstavi, posodobi, izbriše in išče dokumente v vektorski shrambi za Retrieval Augmented Generation (RAG). Uporabite ga za dopolnitev konteksta LLM z relevantnimi dokumenti ter za ohranjanje tega konteksta v skladu s sistemom, iz katerega dokumenti izhajajo.

Vozlišče ima spustni meni **Baza podatkov**, ki izbere ozadje:

- **Qdrant** – shranjuje vektorje na zunanjem strežniku Qdrant (zahteva *RAG: Qdrant + OpenAI* poverilnico).
- **Postgres (pgvector)** – shranjuje vektorje znotraj lastne Postgres baze podatkov Heym, brez zunanje storitve (zahteva *RAG: Psql + OpenAI* poverilnico).

Privzeta izbira je **Qdrant** za zagotavljanje združljivosti s prejšnjimi različicami. Spreminjanje baze podatkov filtrira seznam **Vektorskih shrambe** na shrambe, ki jih podpira ta baza. Obe ozadji podpirata enake operacije, filtriranje metapodatkov, hibridno iskanje (vektorsko + BM25) in Cohere ponovno razvrščanje.

Obe ozadji sta prav tako dostopni preko *RAG: Custom Embeddings* poverilnice, ki nadomesti OpenAI z vsakim OpenAI-kompatibilnim vektorskim končnim točko in imenuje svojo lastno vektorsko shrambo. Shramba, ustvarjena iz takšne poverilnice, se prikaže pod katero koli bazo podatkov, ki jo cilja. Oglejte si [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (iskanje), `$nodeLabel.point_id` (vstavljanje, posodabljanje), `$nodeLabel.deleted` (izbris) |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektorska shramba (privzeto: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorska shramba iz zavihka [Vektorske shrambe](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tip operacije (tudi `operation`) |
| `documentContent` | izraz | Besedilo dokumenta za shranjevanje (vstavljanje, posodabljanje) |
| `documentMetadata` | JSON niz | Metapodatki za shranjene dokumente (vstavljanje, posodabljanje); vrednosti podpirajo izraze |
| `documentIdField` | niz | Polje v payloadu, ki vsebuje edinstveno identifikacijo (posodabljanje, izbris; privzeto `doc_id`) |
| `documentId` | izraz | Vrednost edinstvene identifikacije (posodabljanje, izbris) |
| `queryText` | izraz | Iskalno poizvedbo (samo iskanje) |
| `searchLimit` | število | Maksimalno število rezultatov (privzeto: 5) |
| `metadataFilters` | JSON niz | Filtri metapodatkov za iskanje (vrednosti podpirajo izraze) |
| `hybridSearch` | boolean | Kombiniranje vektorskega iskanja z iskanjem ključnih besed BM25 (samo search; privzeto: izklopljeno) |
| `enableReranker` | boolean | Uporabi Cohere za ponovno razvrščanje rezultatov iskanja |
| `rerankerCredentialId` | UUID | Cohere poverilnica za ponovno razvrščanje |
| `rerankerTopN` | število | Število najboljših rezultatov, ki jih obdržimo po ponovnem razvrščanju |

## Operacije

### Vstavljanje

Dodajte dokumente v vektorsko shramba.

| Polje | Obvezno | Opis |
|-------|----------|-------------|
| `documentContent` | da | Besedilo za vdelavo in shranjevanje |
| `documentMetadata` | ne | JSON objekt, npr. `{"source": "user", "category": "general"}` |

**Izhod:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Izrazi metapodatkov

Vrednosti metapodatkov sprejemajo izraze, tako da se dokument lahko shrani s kontekstom iz izvajanja:

```json
{ "url": "$start.url", "category": "faq" }
```

Izrazi se razrešijo po tem, ko je JSON razčlenjen, ne z nadomeščanjem besedila vanj, tako da vrednost, ki vsebuje narekovaj ali novo vrstico, ne more razbiti objekta. Vrednost, ki je celoten izraz, ohrani svoj razrešen tip — `{"count": "$start.count"}` shrani število, ne `"7"` — kar je pomembno, ker se iskalni `metadataFilters` ujemajo z natančnim tipom. Mešano besedilo, kot je `"page $start.count"`, se razreši v niz, prav tako se prehodijo tudi gnezdeni objekti in tabele.

Enako velja za `upsert` in za iskalne `metadataFilters`: najprej se razčleni in njegove vrednosti se razrešijo po istih pravilih. Tako filter, napisan kot `{"count": "$start.count"}`, ustreza številu, ki ga je shranil vnos, namesto niza `"7"`.

### Kateri workflow je shranil dokument

Dokument, shranjen brez lastnega `source`, je označen z workflow, ki ga je shranil, kot `source: "workflow:<ime workflowa>"`. Zavihek [Vektorske shrambe](../tabs/vectorstores-tab.md) združuje te pod **Dodani workflow: _ime_**, tako da vsebina shrambe pove, od kod izhaja vsak dokument, in dokumente enega workflowa je mogoče izbrisati kot skupino. Nastavitev `source` v `documentMetadata` vedno prevlada nad žigom.

### Posodabljanje

Vstavite dokument ali zamenjajte že shranjenega pod isto edinstveno identifikacijo.

Identifikacija je polje **znotraj payloada**, ne notranja identifikacija shrambe, tako da dokument ohrani identifikator, ki ga že uporablja vaš sistem — identifikacija CRM zapisa, SKU, slug strani. `documentIdField` imenuje to polje, `documentId` pa nosi njegovo vrednost.

| Polje | Obvezno | Opis |
|-------|----------|-------------|
| `documentId` | da | Edinstvena identifikacija dokumenta (podpira izraze) |
| `documentContent` | da | Besedilo za vdelavo in shranjevanje |
| `documentIdField` | ne | Polje v payloadu, kjer se nahaja identifikacija (privzeto `doc_id`) |
| `documentMetadata` | ne | JSON objekt, npr. `{"source": "crm", "url": "$start.url"}` (vrednosti podpirajo izraze) |

Vsaka točka, katere polje id se ujema, se najprej odstrani, tako da se dokument, ki je bil prej shranjen v več delih, nadomesti kot celota in ne podvoji. Polje id se zapiše v payload za vas, identifikacija točke pa ostane stabilna pri posodobitvah istega dokumenta.

**Izhod:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — ali je bila obstoječa različica zamenjana), `$nodeLabel.replaced_count`
### Izbriši

Odstranite dokument z enakim edinstvenim ID-jem.

| Polje | Obvezno | Opis |
|-------|---------|------|
| `documentId` | da | Edinstven ID dokumenta (podpira izraze) |
| `documentIdField` | ne | Polje v Payload, kjer se nahaja ID (privzeto `doc_id`) |

**Izhod:** `$nodeLabel.deleted` – `true`, ko je bil ujemajoč se element najden, `false`, ko ID ni bil v shrambi. `$nodeLabel.deleted_count` vsebuje število odstranjenih elementov.

Brisanje ID-ja, ki ne obstaja, ni napaka: vozlišče uspe z `deleted: false`, zato ne potrebujete zaščitne veje pred čiščenjem.

### Iskanje

Semantično iskanje podobnih dokumentov.

| Polje | Obvezno | Opis |
|-------|---------|------|
| `queryText` | da | Iskalni poizvedek |
| `searchLimit` | ne | Maksimalno število rezultatov (privzeto: 5) |
| `metadataFilters` | ne | Filtriranje po metapodatkih (natančno ujemanje JSON objekta, vrednosti podpirajo izraze) |
| `hybridSearch` | ne | Združevanje vektorske podobnosti z ujemanjem ključnih besed BM25 (glejte [Hibridno iskanje](#hibridno-iskanje)) |
| `enableReranker` | ne | Omogočite Cohere ponovno razvrščanje za boljšo relevantnost |
| `rerankerCredentialId` | pri ponovnem razvrščanju | Poverilnica Cohere |
| `rerankerTopN` | ne | Končno število rezultatov po ponovnem razvrščanju |

**Izhod:** `$nodeLabel.results` – niz `{ id, text, score, metadata }`

Ko je ponovno razvrščanje omogočeno:

- `$nodeLabel.reranked` postane `true`
- Vsak rezultat vključuje tudi `relevance_score`
- `score` ostane izvirna ocena podobnosti vektorja
- `relevance_score` je ocena Cohere ponovno razvrščanja


#### Hibridno iskanje

Vektorsko iskanje poišče besedilo, ki ima enak pomen kot poizvedba. Besedilo, ki vsebuje le natančne besede, se lahko uvrsti nižje: koda izdelka, številka zahtevka, ime osebe, napaka, kot je `ERR-4021`. Vklopite **Hibridno iskanje** in vozel bo poleg vektorskega iskanja izvedel iskanje po ključnih besedah ter združil oba seznama, tako da ena poizvedba najde obe vrsti ujemanj.

1. Vektorsko iskanje vrne svoja najboljša ujemanja, tako kot brez hibridnega iskanja.
2. Iskanje po ključnih besedah oceni shranjeno besedilo glede na besede poizvedbe z **BM25**, kar nagrajuje redke besede, ponovljene besede in krajše dokumente.
3. Oba razvrščena seznama se združita z **reciprocal rank fusion**. Dokument blizu vrha obeh seznamov se uvrsti na prvo mesto, dokument, ki ga je našel le en seznam, pa se še vedno prikaže.

Filtri metapodatkov veljajo za obe iskanji, Cohere ponovni razvrščevalnik, ko je omogočen, pa se izvede na združenem seznamu.

Vsak rezultat nosi oceno obeh iskanj:

| Polje | Pomen |
|-------|-------|
| `score` | Združena ocena od 0 do 1. `1` pomeni, da se je dokument uvrstil na prvo mesto v obeh iskanjih. |
| `vector_score` | Vektorska podobnost (0 do 1). `null`, ko je dokument našlo samo iskanje po ključnih besedah. |
| `keyword_score` | Ocena BM25. `null`, ko se nobena od besed poizvedbe ne pojavi v dokumentu. |

`$nodeLabel.hybrid` je `true`, ko je bilo izvedeno hibridno iskanje.

Dobro je vedeti:

- Združeni `score` razvršča rezultate med seboj. Ne gre za vektorsko podobnost, zato se prag, prilagojen preprostemu iskanju, ne prenese neposredno.
- Besede poizvedbe se pretvorijo v male črke ter razdelijo po presledkih in ločilih, tako da se `ERR-4021` išče kot `err` in `4021`. Iskanje po ključnih besedah uporablja do prvih 16 različnih besed poizvedbe.
- Qdrant: prvo hibridno iskanje v zbirki zgradi indeks celotnega besedila na polju payload `text`, za kar je potreben ključ Qdrant s pravico pisanja. Pri velikih zbirkah to traja trenutek le enkrat; kasnejša iskanja ponovno uporabijo indeks.
- Postgres (pgvector): migracija baze podatkov `142_vsi_text_search_index` doda indeks celotnega besedila. Po posodobitvi zaženite `alembic upgrade head`. Hibridno iskanje deluje tudi brez indeksa, le počasneje v velikih shrambah.
- Za vsako poizvedbo iskanje po ključnih besedah prebere do 200 ujemajočih se dokumentov, začenši z najredkejšimi besedami poizvedbe, saj imajo te največjo težo.
## Dostop do rezultatov

- `$ragNode.results.first().text` – vsebina najboljšega rezultata
- `$ragNode.results.first().score` – ocena podobnosti (0–1), ali združena ocena pri hibridnem iskanju
- `$ragNode.results.first().keyword_score` – ocena BM25 (hibridno iskanje)
- `$ragNode.results.first().vector_score` – vektorska podobnost (hibridno iskanje)
- `$ragNode.results.first().metadata.source` – metapodatki najboljšega rezultata
- `$ragNode.results.map("item.text").join("\n\n")` – združite za kontekst LLM
- `$ragNode.reranked` – ali je bilo ponovno razvrščanje uporabljeno
- `$ragNode.hybrid` – ali je bilo uporabljeno hibridno iskanje
- `$ragNode.count` – število vrnjenih rezultatov
- `$ragNode.replaced` – ali je bil upsert zamenjan z obstoječim dokumentom
- `$ragNode.deleted` – ali je brisanje odstranilo kaj

## Primer – Iskanje

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

## Primer – Hibridno iskanje

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

## Primer – Vstavi

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

## Primer – Upsert

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

## Primer – Izbriši

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

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Vgrajen RAG kot del izvajanja agenta
- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Vektorske shrambe](../tabs/vectorstores-tab.md) – Ustvarite in upravljajte vektorske shrambe
- [Integracije tretjih oseb](../reference/integrations.md#qdrant) – Nastavitev poverilnic za Qdrant in Postgres (pgvector)
- [Agent Node](./agent-node.md) – Uporabite RAG rezultate kot kontekst agenta
- [LLM Node](./llm-node.md) – Vnesite RAG rezultate v sistemski poziv LLM

# RAG / Vektorska spremišta

**RAG / Vektorska spremišta** čvor omogućuje umetanje, ažuriranje, brisanje i pretraživanje dokumenata u vektorskoj spremištu za Retrieval Augmented Generation (RAG). Koristite ga za obogaćivanje konteksta LLM-a relevantnim dokumentima i održavanje tog konteksta u skladu sa sustavom iz kojeg dokumenti dolaze.

Čvor ima **Bazu podataka** padajući izbornik koji odabire pozadinu:

- **Qdrant** – pohranjuje vektore na vanjskom Qdrant poslužitelju (zahtijeva *RAG: Qdrant + OpenAI* vjerodajnicu).
- **Postgres (pgvector)** – pohranjuje vektore unutar vlastite Postgres baze podataka Heym-a, bez vanjske usluge (zahtijeva *RAG: Psql + OpenAI* vjerodajnicu).

Zadana opcija je **Qdrant** radi unazadne kompatibilnosti. Promjena Baze podataka filtrira popis **Vektorskih spremišta** na ona koja podržava ta baza. Obje pozadine podržavaju iste operacije, filtriranje metapodataka i Cohere ponovo rangiranje.

Bilo koja pozadina također se može doseći putem *RAG: Custom Embeddings* vjerodajnice, koja zamjenjuje OpenAI s bilo kojim OpenAI-kompatibilnim embedding endpointom i imenuje vlastitu vektorsku spremištu. Spremište stvoreno iz takve vjerodajnice pojavljuje se pod bilo kojom Bazom podataka koju cilja. Pogledajte [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (pretraživanje), `$nodeLabel.point_id` (umetanje, ažuriranje), `$nodeLabel.deleted` (brisanje) |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Pozadina vektorske spremište (zadano: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorska spremišta iz [Vektorskih spremišta](../tabs/vectorstores-tab.md) kartice |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tip operacije (također `operation`) |
| `documentContent` | izraz | Tekst dokumenta za pohranu (umetanje, ažuriranje) |
| `documentMetadata` | JSON string | Metapodaci za pohranjene dokumente (umetanje, ažuriranje); vrijednosti podržavaju izraze |
| `documentIdField` | string | Polje u Payload-u koje sadrži jedinstveni id (ažuriranje, brisanje; zadano `doc_id`) |
| `documentId` | izraz | Vrijednost jedinstvenog id-a (ažuriranje, brisanje) |
| `queryText` | izraz | Upit za pretraživanje (samo pretraživanje) |
| `searchLimit` | broj | Maksimalni rezultati (zadano: 5) |
| `metadataFilters` | JSON string | Filtri metapodataka za pretraživanje (vrijednosti podržavaju izraze) |
| `enableReranker` | boolean | Koristite Cohere za ponovo rangiranje rezultata pretraživanja |
| `rerankerCredentialId` | UUID | Cohere vjerodajnica za ponovo rangiranje |
| `rerankerTopN` | broj | Broj najboljih rezultata koje treba zadržati nakon ponovnog rangiranja |

## Operacije

### Umetanje

Dodajte dokumente u vektorsku spremištu.

| Polje | Obavezno | Opis |
|-------|----------|-------------|
| `documentContent` | da | Tekst za umetanje i pohranu |
| `documentMetadata` | ne | JSON objekt, npr. `{"source": "user", "category": "general"}` |

**Izlaz:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Izrazi metapodataka

Vrijednosti metapodataka prihvaćaju izraze, tako da se dokument može pohraniti s kontekstom iz izvođenja:

```json
{ "url": "$start.url", "category": "faq" }
```

Izrazi se rješavaju nakon što je JSON analiziran, a ne zamjenom teksta u njemu, tako da vrijednost koja sadrži navodnik ili novi redak ne može razbiti objekt. Vrijednost koja je cijeli izraz zadržava svoj riješeni tip — `{"count": "$start.count"}` pohranjuje broj, a ne `"7"` — što je važno jer se pretraživački `metadataFilters` podudaraju s točnim tipom. Mješoviti tekst kao što je `"page $start.count"` rješava se u string, a također se prolazi kroz ugniježdene objekte i nizove.

Isto vrijedi za `upsert`, i za pretraživanje `metadataFilters`: prvo se analizira i njegove vrijednosti se rješavaju nakon, prema istim pravilima. Tako da se filtar napisan kao `{"count": "$start.count"}` podudara s brojem koji je umetanje pohranilo, a ne sa stringom `"7"`.

### Koji workflow je pohranio dokument

Dokument pohranjen bez vlastitog `source` označen je s workflow-om koji ga je pohranio, kao `source: "workflow:<naziv workflow-a>"`. Kartica [Vektorska spremišta](../tabs/vectorstores-tab.md) grupira te pod **Dodani workflow: _naziv_**, tako da sadržaj spremišta pokazuje odakle je svaki dokument došao, a dokumenti jednog workflow-a mogu se izbrisati kao grupa. Postavljanje `source` samostalno u `documentMetadata` uvijek ima prednost nad pečatom.

### Ažuriranje

Umetnite dokument ili zamijenite onaj koji je već pohranjen pod istim jedinstvenim id-om.

Id je polje **unutar payload-a**, a ne unutarnji point id spremišta, tako da dokument zadržava identifikator koji vaš vlastiti sustav već koristi — id CRM zapisa, SKU, slug stranice. `documentIdField` imenuje to polje, a `documentId` nosi njegovu vrijednost.

| Polje | Obavezno | Opis |
|-------|----------|-------------|
| `documentId` | da | Jedinstveni id dokumenta (podržava izraze) |
| `documentContent` | da | Tekst za umetanje i pohranu |
| `documentIdField` | ne | Polje u Payload-u u kojem se nalazi id (zadano `doc_id`) |
| `documentMetadata` | ne | JSON objekt, npr. `{"source": "crm", "url": "$start.url"}` (vrijednosti podržavaju izraze) |

Svaki point čiji se id polje podudara prvo se uklanja, tako da se dokument koji je prethodno pohranjen kao nekoliko dijelova zamjenjuje u cijelosti, a ne duplicira. Id polje se zapisuje u payload za Vas, a point id ostaje stabilan tijekom ažuriranja istog dokumenta.

**Izlaz:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — je li postojeća verzija zamijenjena), `$nodeLabel.replaced_count`
### Brisanje

Uklonite dokument prema istom jedinstvenom ID-u.

| Polje | Obavezno | Opis |
|-------|----------|-------------|
| `documentId` | da | Jedinstveni ID dokumenta (podržava izraze) |
| `documentIdField` | ne | Polje u Payload-u u kojem se nalazi ID (zadano `doc_id`) |

**Izlaz:** `$nodeLabel.deleted` – `true` kada je barem jedna točka odgovarala, `false` kada ID nije bio u spremištu. `$nodeLabel.deleted_count` sadrži koliko je točaka uklonjeno.

Brisanje ID-a koji ne postoji nije greška: čvor uspijeva s `deleted: false`, tako da grana za čišćenje ne treba zaštitu ispred nje.

### Pretraživanje

Semantičko pretraživanje sličnih dokumenata.

| Polje | Obavezno | Opis |
|-------|----------|-------------|
| `queryText` | da | Upit za pretraživanje |
| `searchLimit` | ne | Maksimalni broj rezultata (zadano: 5) |
| `metadataFilters` | ne | Filtriranje prema metapodacima (točno podudaranje JSON objekta, vrijednosti podržavaju izraze) |
| `enableReranker` | ne | Omogućite Cohere ponovno rangiranje za bolju relevantnost |
| `rerankerCredentialId` | kada se ponovo rangira | Cohere vjerodajnica |
| `rerankerTopN` | ne | Konačan broj rezultata nakon ponovnog rangiranja |

**Izlaz:** `$nodeLabel.results` – niz `{ id, text, score, metadata }`

Kada je ponovno rangiranje omogućeno:

- `$nodeLabel.reranked` postaje `true`
- Svaki rezultat također uključuje `relevance_score`
- `score` ostaje izvorni vektorski rezultat sličnosti
- `relevance_score` je rezultat Cohere ponovnog rangiranja

## Pristupanje Rezultatima

- `$ragNode.results.first().text` – sadržaj najboljeg rezultata
- `$ragNode.results.first().score` – rezultat sličnosti (0–1)
- `$ragNode.results.first().metadata.source` – metapodaci najboljeg rezultata
- `$ragNode.results.map("item.text").join("\n\n")` – spojite za LLM kontekst
- `$ragNode.reranked` – je li primijenjeno ponovno rangiranje
- `$ragNode.count` – broj vraćenih rezultata
- `$ragNode.replaced` – je li upsert zamijenio postojeći dokument
- `$ragNode.deleted` – je li brisanje uklonilo nešto

## Primjer – Pretraživanje

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

## Primjer – Umetanje

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

## Primjer – Upsert

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

## Primjer – Brisanje

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

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Ugrađeni RAG kao dio agent runtime-a
- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Zavičaj vektorskih spremišta](../tabs/vectorstores-tab.md) – Kreirajte i upravljajte vektorskim spremištima
- [Integracije trećih strana](../reference/integrations.md#qdrant) – Postavljanje vjerodajnica za Qdrant i Postgres (pgvector)
- [Agent čvor](./agent-node.md) – Koristite RAG rezultate kao kontekst agenta
- [LLM čvor](./llm-node.md) – Unesite RAG rezultate u LLM sistemski prompt

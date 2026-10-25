# RAG / Vector Store

Nodul **RAG / Vector Store** inserează, face upsert, șterge și caută documente într-un depozit vectorial pentru Retrieval Augmented Generation (RAG). Utilizați-l pentru a îmbogăți contextul LLM cu documente relevante și pentru a menține acel context sincronizat cu sistemul din care provin documentele.

Nodul are un dropdown **Database** care selectează backend-ul:

- **Qdrant** – stochează vectorii într-un server Qdrant extern (necesită o acreditare *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – stochează vectorii în baza de date Postgres proprie Heym, fără serviciu extern (necesită o acreditare *RAG: Psql + OpenAI*).

Valoarea implicită este **Qdrant** pentru compatibilitate retroactivă. Schimbarea Database filtrează lista **Vector Store** la depozitele susținute de acea bază de date. Ambele backend-uri suportă aceleași operațiuni, filtrare pe metadate, căutarea hibridă (vector + BM25) și reranking Cohere.

Oricare backend poate fi accesat și printr-o acreditare *RAG: Custom Embeddings*, care
înlocuiește OpenAI cu orice endpoint de embeddings compatibil OpenAI și își numește propriul
depozit vectorial. Un depozit creat dintr-o astfel de acreditare apare sub Database-ul către
care țintește. Consultați [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (căutare), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend depozit vectorial (implicit: `"qdrant"`) |
| `vectorStoreId` | UUID | Depozit vectorial din fila [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tip operațiune (și `operation`) |
| `documentContent` | expression | Textul documentului de stocat (insert, upsert) |
| `documentMetadata` | JSON string | Metadate pentru documentele stocate (insert, upsert); valorile suportă expresii |
| `documentIdField` | string | Câmpul din payload care conține id-ul unic (upsert, delete; implicit `doc_id`) |
| `documentId` | expression | Valoarea id-ului unic (upsert, delete) |
| `queryText` | expression | Interogarea de căutare (doar search) |
| `searchLimit` | number | Număr maxim de rezultate (implicit: 5) |
| `metadataFilters` | JSON string | Filtre pe metadate pentru căutare (valorile suportă expresii) |
| `hybridSearch` | boolean | Combină căutarea vectorială cu căutarea după cuvinte-cheie BM25 (doar search; implicit: dezactivat) |
| `enableReranker` | boolean | Folosește Cohere pentru reranking-ul rezultatelor căutării |
| `rerankerCredentialId` | UUID | Acreditare Cohere pentru reranking |
| `rerankerTopN` | number | Numărul de rezultate de top de păstrat după reranking |

## Operațiuni

### Insert

Adaugă documente în depozitul vectorial.

| Câmp | Obligatoriu | Descriere |
|-------|----------|-------------|
| `documentContent` | da | Textul de embed-uit și stocat |
| `documentMetadata` | nu | Obiect JSON, de ex. `{"source": "user", "category": "general"}` |

**Ieșire:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expresii în metadate

Valorile metadatelor acceptă expresii, astfel încât un document poate fi stocat cu context din execuție:

```json
{ "url": "$start.url", "category": "faq" }
```

Expresiile sunt rezolvate după ce JSON-ul este parsat, nu prin substituirea textului în el, astfel încât o
valoare care conține un ghilim sau o linie nouă nu poate rupe obiectul. O valoare care este o
singură expresie întreagă își păstrează tipul rezolvat — `{"count": "$start.count"}` stochează un număr, nu
`"7"` — ceea ce contează deoarece `metadataFilters` din căutare fac potrivire pe tip exact. Textul mixt precum
`"page $start.count"` se rezolvă într-un string, iar obiectele și array-urile imbricate sunt parcurse la fel.

Același lucru se aplică pentru `upsert` și pentru `metadataFilters` din căutare: este parsat mai întâi, iar valorile
sunt rezolvate după, după aceleași reguli. Astfel, un filtru scris ca `{"count": "$start.count"}`
potrivește numărul pe care l-a stocat un insert, nu string-ul `"7"`.

### Care workflow a stocat un document

Un document stocat fără un `source` propriu este marcat cu workflow-ul care l-a stocat,
ca `source: "workflow:<workflow name>"`. Fila [Vectorstores](../tabs/vectorstores-tab.md)
grupează acestea sub **Added workflow: _name_**, astfel încât conținutul unui depozit indică de unde
provine fiecare document, iar documentele unui workflow pot fi șterse ca grup. Setarea `source` manual
în `documentMetadata` are întotdeauna prioritate față de marcaj.

### Upsert

Inserează un document sau îl înlocuiește pe cel deja stocat sub același id unic.

Id-ul este un câmp **în interiorul payload-ului**, nu id-ul intern de point al depozitului, astfel încât un document
păstrează identificatorul pe care sistemul dvs. îl folosește deja — un id de înregistrare CRM, un SKU, un slug de pagină.
`documentIdField` numește acel câmp, iar `documentId` conține valoarea sa.

| Câmp | Obligatoriu | Descriere |
|-------|----------|-------------|
| `documentId` | da | Id-ul unic al documentului (suportă expresii) |
| `documentContent` | da | Textul de embed-uit și stocat |
| `documentIdField` | nu | Câmpul din payload în care se află id-ul (implicit `doc_id`) |
| `documentMetadata` | nu | Obiect JSON, de ex. `{"source": "crm", "url": "$start.url"}` (valorile suportă expresii) |

Fiecare point al cărui câmp de id se potrivește este eliminat mai întâi, astfel încât un document care era anterior
stocat ca mai multe chunk-uri este înlocuit ca întreg, nu duplicat. Câmpul de id este
scris în payload pentru dvs., iar id-ul de point rămâne stabil între upsert-uri ale aceluiași
document.

**Ieșire:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
dacă o versiune existentă a fost înlocuită), `$nodeLabel.replaced_count`
### Ștergere

Eliminați un document după același id unic.

| Câmp | Obligatoriu | Descriere |
|-------|----------|-------------|
| `documentId` | da | Id unic al documentului (acceptă expresii) |
| `documentIdField` | nu | Câmpul din payload în care se află id-ul (implicit `doc_id`) |

**Ieșire:** `$nodeLabel.deleted` – `true` când cel puțin un punct a corespuns, `false` când id-ul
nu a existat în depozit. `$nodeLabel.deleted_count` indică câte puncte au fost eliminate.

Ștergerea unui id inexistent nu este o eroare: nodul reușește cu `deleted: false`, astfel încât
o ramură de curățare nu necesită o verificare prealabilă.

### Căutare

Căutare semantică pentru documente similare.

| Câmp | Obligatoriu | Descriere |
|-------|----------|-------------|
| `queryText` | da | Interogarea de căutare |
| `searchLimit` | nu | Număr maxim de rezultate (implicit: 5) |
| `metadataFilters` | nu | Filtrare după metadate (obiect JSON cu potrivire exactă, valorile acceptă expresii) |
| `hybridSearch` | nu | Fuzionează similaritatea vectorială cu potrivirea după cuvinte-cheie BM25 (consultați [Căutare hibridă](#cautare-hibrida)) |
| `enableReranker` | nu | Activează reranking-ul Cohere pentru relevanță sporită |
| `rerankerCredentialId` | la reranking | Acreditarea Cohere |
| `rerankerTopN` | nu | Numărul final de rezultate după reranking |

**Ieșire:** `$nodeLabel.results` – matrice de `{ id, text, score, metadata }`

Când reranking-ul este activat:

- `$nodeLabel.reranked` devine `true`
- Fiecare rezultat include și `relevance_score`
- `score` rămâne scorul original de similaritate vectorială
- `relevance_score` este scorul reranker-ului Cohere


#### Căutare hibridă

Căutarea vectorială găsește text care are aceeași semnificație ca și interogarea. Textul care conține doar cuvintele exacte se poate clasa mai jos: un cod de produs, un număr de tichet, numele unei persoane, o eroare precum `ERR-4021`. Activați **Căutare hibridă**, iar nodul va rula o căutare după cuvinte-cheie alături de căutarea vectorială și va îmbina ambele liste, astfel încât o singură interogare să găsească ambele tipuri de potriviri.

1. Căutarea vectorială returnează cele mai bune potriviri ale sale, la fel ca fără căutarea hibridă.
2. O căutare după cuvinte-cheie evaluează textul stocat în raport cu cuvintele interogării cu **BM25**, ceea ce recompensează cuvintele rare, cuvintele repetate și documentele mai scurte.
3. Cele două liste clasificate sunt îmbinate prin **reciprocal rank fusion**. Un document situat aproape de începutul ambelor liste se clasează pe primul loc, iar un document găsit doar de o listă continuă să apară.

Filtrele pe metadate se aplică ambelor căutări, iar reranker-ul Cohere, dacă este activat, rulează pe lista îmbinată.

Fiecare rezultat poartă scorul ambelor căutări:

| Câmp | Semnificație |
|------|--------------|
| `score` | Scor îmbinat de la 0 la 1. `1` înseamnă că documentul s-a clasat pe primul loc în ambele căutări. |
| `vector_score` | Similaritate vectorială (de la 0 la 1). `null` când doar căutarea după cuvinte-cheie a găsit documentul. |
| `keyword_score` | Scor BM25. `null` când niciunul dintre cuvintele interogării nu apare în document. |

`$nodeLabel.hybrid` este `true` când s-a executat căutarea hibridă.

Bine de știut:

- Scorul `score` îmbinat clasifică rezultatele unul în raport cu celălalt. Nu este o similaritate vectorială, astfel încât un prag ajustat pentru o căutare simplă nu se transferă direct.
- Cuvintele interogării sunt convertite în minuscule și împărțite pe spații și punctuație, astfel încât `ERR-4021` este căutat ca `err` și `4021`. Căutarea după cuvinte-cheie folosește până la primele 16 cuvinte distincte ale interogării.
- Qdrant: prima căutare hibridă pe o colecție construiește un index full-text pe câmpul de payload `text`, ceea ce necesită o cheie Qdrant cu permisiune de scriere. În colecțiile mari, aceasta durează un moment doar o singură dată; căutările ulterioare reutilizează indexul.
- Postgres (pgvector): migrarea bazei de date `142_vsi_text_search_index` adaugă indexul full-text. Rulați `alembic upgrade head` după actualizare. Căutarea hibridă funcționează și fără index, doar că este mai lentă pe stocările mari.
- Pentru fiecare interogare, căutarea după cuvinte-cheie citește până la 200 de documente potrivite, începând cu cele mai rare cuvinte ale interogării, deoarece acestea poartă cea mai mare pondere.
## Accesarea rezultatelor

- `$ragNode.results.first().text` – conținutul primului rezultat
- `$ragNode.results.first().score` – scorul de similaritate (0–1), sau scorul îmbinat cu căutarea hibridă
- `$ragNode.results.first().keyword_score` – scor BM25 (căutare hibridă)
- `$ragNode.results.first().vector_score` – similaritate vectorială (căutare hibridă)
- `$ragNode.results.first().metadata.source` – metadatele primului rezultat
- `$ragNode.results.map("item.text").join("\n\n")` – concatenare pentru contextul LLM
- `$ragNode.reranked` – dacă reranking-ul a fost aplicat
- `$ragNode.hybrid` – dacă a fost aplicată căutarea hibridă
- `$ragNode.count` – numărul de rezultate returnate
- `$ragNode.replaced` – dacă un upsert a înlocuit un document existent
- `$ragNode.deleted` – dacă o ștergere a eliminat ceva

## Exemplu – Căutare

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

## Exemplu – Căutare hibridă

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

## Exemplu – Inserare

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

## Exemplu – Upsert

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

## Exemplu – Ștergere

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

## Resurse conexe

- [De ce Heym](../getting-started/why-heym.md) – RAG integrat ca parte a runtime-ului agentului
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Depozite vectoriale](../tabs/vectorstores-tab.md) – Crearea și gestionarea depozitelor vectoriale
- [Integrări terțe](../reference/integrations.md#qdrant) – Configurarea acreditărilor Qdrant și Postgres (pgvector)
- [Nod Agent](./agent-node.md) – Utilizarea rezultatelor RAG ca context pentru agent
- [Nod LLM](./llm-node.md) – Alimentarea prompt-ului de sistem LLM cu rezultatele RAG

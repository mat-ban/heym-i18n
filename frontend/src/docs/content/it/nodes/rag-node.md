# RAG / Vector Store

Il nodo **RAG / Vector Store** inserisce, esegue l'upsert, elimina e ricerca documenti in un archivio vettoriale per la Retrieval Augmented Generation (RAG). Lo si utilizzi per arricchire il contesto dell'LLM con documenti pertinenti e per mantenere tale contesto allineato al sistema da cui provengono i documenti.

Il nodo dispone di un menu a discesa **Database** che seleziona il backend:

- **Qdrant** – memorizza i vettori in un server Qdrant esterno (richiede una credenziale *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – memorizza i vettori all'interno del database Postgres di Heym, senza servizi esterni (richiede una credenziale *RAG: Psql + OpenAI*).

Il valore predefinito è **Qdrant** per garantire la retrocompatibilità. La modifica del Database filtra l'elenco **Vector Store** mostrando gli archivi supportati da quel database. Entrambi i backend supportano le stesse operazioni, il filtraggio dei metadati, la ricerca ibrida (vettore + BM25) e il reranking di Cohere.

È inoltre possibile accedere a entrambi i backend tramite una credenziale *RAG: Custom Embeddings*, che sostituisce OpenAI con qualsiasi endpoint di embedding compatibile con OpenAI e definisce un proprio archivio vettoriale. Un archivio creato da tale credenziale compare sotto il Database di destinazione. Si veda [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (ricerca), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend dell'archivio vettoriale (predefinito: `"qdrant"`) |
| `vectorStoreId` | UUID | Archivio vettoriale dalla scheda [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Tipo di operazione (anche `operation`) |
| `documentContent` | expression | Testo del documento da memorizzare (insert, upsert) |
| `documentMetadata` | stringa JSON | Metadati per i documenti memorizzati (insert, upsert); i valori supportano le espressioni |
| `documentIdField` | string | Campo del payload che contiene l'id univoco (upsert, delete; predefinito `doc_id`) |
| `documentId` | expression | Valore dell'id univoco (upsert, delete) |
| `queryText` | expression | Query di ricerca (solo search) |
| `searchLimit` | number | Numero massimo di risultati (predefinito: 5) |
| `metadataFilters` | stringa JSON | Filtri sui metadati per la ricerca (i valori supportano le espressioni) |
| `hybridSearch` | boolean | Combina la ricerca vettoriale con la ricerca per parole chiave BM25 (solo search; predefinito: disattivato) |
| `enableReranker` | boolean | Utilizza Cohere per rieseguire il ranking dei risultati di ricerca |
| `rerankerCredentialId` | UUID | Credenziale Cohere per il reranking |
| `rerankerTopN` | number | Numero di risultati principali da mantenere dopo il reranking |

## Operazioni

### Insert

Aggiunge documenti all'archivio vettoriale.

| Campo | Obbligatorio | Descrizione |
|-------|----------|-------------|
| `documentContent` | sì | Testo da incorporare e memorizzare |
| `documentMetadata` | no | Oggetto JSON, ad esempio `{"source": "user", "category": "general"}` |

**Output:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Espressioni nei metadati

I valori dei metadati accettano espressioni, pertanto un documento può essere memorizzato con il contesto dell'esecuzione:

```json
{ "url": "$start.url", "category": "faq" }
```

Le espressioni vengono risolte dopo l'analisi del JSON, non sostituendo il testo al suo interno, quindi un valore contenente una virgoletta o un carattere di nuova riga non può compromettere la struttura dell'oggetto. Un valore costituito interamente da un'espressione mantiene il tipo risolto — `{"count": "$start.count"}` memorizza un numero, non `"7"` — il che è rilevante poiché i `metadataFilters` di ricerca effettuano la corrispondenza sul tipo esatto. Il testo misto come `"page $start.count"` viene risolto in una stringa, e anche gli oggetti e gli array annidati vengono attraversati.

Lo stesso vale per `upsert` e per i `metadataFilters` della ricerca: vengono prima analizzati e i relativi valori risolti successivamente, secondo le stesse regole. Pertanto un filtro scritto come `{"count": "$start.count"}` corrisponde al numero memorizzato da un insert, anziché alla stringa `"7"`.

### Quale workflow ha memorizzato un documento

Un documento memorizzato senza un proprio `source` viene contrassegnato con il workflow che lo ha memorizzato, come `source: "workflow:<workflow name>"`. La scheda [Vectorstores](../tabs/vectorstores-tab.md) raggruppa tali documenti sotto **Added workflow: _name_**, così il contenuto di un archivio indica la provenienza di ciascun documento ed è possibile eliminare come gruppo i documenti di un singolo workflow. L'impostazione manuale di `source` in `documentMetadata` prevale sempre sul contrassegno.
### Upsert

Inserire un documento oppure sostituire quello già memorizzato con lo stesso id univoco.

L'id è un campo **all'interno del payload**, non l'id interno del punto dell'archivio vettoriale; in questo modo un documento mantiene l'identificatore già utilizzato dal sistema di origine — un id di record CRM, uno SKU, uno slug di pagina.
`documentIdField` specifica il nome di tale campo e `documentId` ne contiene il valore.

| Campo | Obbligatorio | Descrizione |
|-------|----------|-------------|
| `documentId` | sì | Id univoco del documento (supporta espressioni) |
| `documentContent` | sì | Testo da sottoporre a embedding e memorizzare |
| `documentIdField` | no | Campo del payload in cui risiede l'id (predefinito `doc_id`) |
| `documentMetadata` | no | Oggetto JSON, ad esempio `{"source": "crm", "url": "$start.url"}` (i valori supportano espressioni) |

Ogni punto il cui campo id corrisponde viene rimosso in via preliminare; pertanto un documento precedentemente memorizzato come più chunk viene sostituito nella sua interezza anziché duplicato. Il campo id viene scritto automaticamente nel payload e l'id del punto rimane stabile tra upsert successivi dello stesso documento.

**Output:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (booleano — indica se una versione esistente è stata sostituita), `$nodeLabel.replaced_count`

### Delete

Rimuovere un documento tramite lo stesso id univoco.

| Campo | Obbligatorio | Descrizione |
|-------|----------|-------------|
| `documentId` | sì | Id univoco del documento (supporta espressioni) |
| `documentIdField` | no | Campo del payload in cui risiede l'id (predefinito `doc_id`) |

**Output:** `$nodeLabel.deleted` – `true` quando almeno un punto corrisponde, `false` quando l'id non è presente nell'archivio vettoriale. `$nodeLabel.deleted_count` indica quanti punti sono stati rimossi.

L'eliminazione di un id inesistente non costituisce un errore: il nodo termina con esito positivo con `deleted: false`, pertanto un ramo di pulizia non necessita di una guardia preventiva.

### Search

Ricerca semantica di documenti simili.

| Campo | Obbligatorio | Descrizione |
|-------|----------|-------------|
| `queryText` | sì | Query di ricerca |
| `searchLimit` | no | Numero massimo di risultati (predefinito: 5) |
| `metadataFilters` | no | Filtro per metadati (oggetto JSON con corrispondenza esatta, i valori supportano espressioni) |
| `hybridSearch` | no | Unisce la similarità vettoriale con la corrispondenza per parole chiave BM25 (vedere [Ricerca ibrida](#ricerca-ibrida)) |
| `enableReranker` | no | Abilita il reranking Cohere per una maggiore pertinenza |
| `rerankerCredentialId` | in caso di reranking | Credenziale Cohere |
| `rerankerTopN` | no | Numero finale di risultati dopo il reranking |

**Output:** `$nodeLabel.results` – array di `{ id, text, score, metadata }`

Quando il reranking è abilitato:

- `$nodeLabel.reranked` diventa `true`
- Ogni risultato include inoltre `relevance_score`
- `score` rimane il punteggio di similarità vettoriale originale
- `relevance_score` è il punteggio del reranker Cohere


#### Ricerca ibrida

La ricerca vettoriale individua il testo che ha lo stesso significato della query. Il testo che contiene solo le parole esatte può posizionarsi più in basso: un codice prodotto, un numero di ticket, il nome di una persona, un errore come `ERR-4021`. Attivando **Ricerca ibrida**, il nodo esegue una ricerca per parole chiave accanto alla ricerca vettoriale e unisce i due elenchi, in modo che un'unica query trovi entrambi i tipi di corrispondenze.

1. La ricerca vettoriale restituisce le sue corrispondenze migliori, esattamente come avviene senza la ricerca ibrida.
2. Una ricerca per parole chiave valuta il testo memorizzato rispetto alle parole della query con **BM25**, premiando le parole rare, le parole ripetute e i documenti più brevi.
3. I due elenchi classificati vengono uniti con **reciprocal rank fusion**. Un documento vicino all'inizio di entrambi gli elenchi si posiziona al primo posto, e un documento trovato da un solo elenco continua ad apparire.

I filtri dei metadati si applicano a entrambe le ricerche e il reranker Cohere, se abilitato, viene eseguito sull'elenco unito.

Ciascun risultato include il punteggio di entrambe le ricerche:

| Campo | Significato |
|-------|-------------|
| `score` | Punteggio unito da 0 a 1. `1` indica che il documento si è posizionato al primo posto in entrambe le ricerche. |
| `vector_score` | Similarità vettoriale (da 0 a 1). `null` quando solo la ricerca per parole chiave ha trovato il documento. |
| `keyword_score` | Punteggio BM25. `null` quando nessuna delle parole della query compare nel documento. |

`$nodeLabel.hybrid` è `true` quando è stata eseguita la ricerca ibrida.

Buono a sapersi:

- Lo `score` unito ordina i risultati l'uno rispetto all'altro. Non è una similarità vettoriale, quindi una soglia impostata per una ricerca semplice non si trasferisce direttamente.
- Le parole della query vengono convertite in minuscolo e suddivise su spazi e punteggiatura, per cui `ERR-4021` viene cercato come `err` e `4021`. La ricerca per parole chiave utilizza fino alle prime 16 parole distinte della query.
- Qdrant: la prima ricerca ibrida su una raccolta compila un indice full-text sul campo di payload `text`, operazione che richiede una chiave Qdrant con accesso in scrittura. Nelle raccolte di grandi dimensioni l'operazione richiede un istante solo una volta; le ricerche successive riutilizzano l'indice.
- Postgres (pgvector): la migrazione del database `142_vsi_text_search_index` aggiunge l'indice full-text. Eseguire `alembic upgrade head` dopo l'aggiornamento. La ricerca ibrida funziona anche senza l'indice, ma risulta più lenta su archivi di grandi dimensioni.
- Per ogni query la ricerca per parole chiave legge fino a 200 documenti corrispondenti, a partire dalle parole della query più rare, poiché sono quelle che hanno il peso maggiore.
## Accesso ai risultati

- `$ragNode.results.first().text` – contenuto del risultato principale
- `$ragNode.results.first().score` – punteggio di similarità (0–1), o il punteggio unito con la ricerca ibrida
- `$ragNode.results.first().keyword_score` – punteggio BM25 (ricerca ibrida)
- `$ragNode.results.first().vector_score` – similarità vettoriale (ricerca ibrida)
- `$ragNode.results.first().metadata.source` – metadati del risultato principale
- `$ragNode.results.map("item.text").join("\n\n")` – concatenazione per il contesto LLM
- `$ragNode.reranked` – indica se è stato applicato il reranking
- `$ragNode.hybrid` – indica se è stata applicata la ricerca ibrida
- `$ragNode.count` – numero di risultati restituiti
- `$ragNode.replaced` – indica se un upsert ha sostituito un documento esistente
- `$ragNode.deleted` – indica se un'operazione di eliminazione ha rimosso elementi

## Esempio – Search

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

## Esempio – Ricerca ibrida

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

## Esempio – Insert

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

## Esempio – Upsert

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

## Esempio – Delete

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

## Correlati

- [Perché Heym](../getting-started/why-heym.md) – RAG integrato come parte del runtime degli agenti
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Scheda Archivi vettoriali](../tabs/vectorstores-tab.md) – Creare e gestire gli archivi vettoriali
- [Integrazioni di terze parti](../reference/integrations.md#qdrant) – Configurazione delle credenziali Qdrant e Postgres (pgvector)
- [Nodo Agent](./agent-node.md) – Utilizzare i risultati RAG come contesto dell'agente
- [Nodo LLM](./llm-node.md) – Inserire i risultati RAG nel prompt di sistema dell'LLM

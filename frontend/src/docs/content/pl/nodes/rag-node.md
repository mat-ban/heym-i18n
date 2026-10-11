# RAG / Vector Store

Węzeł **RAG / Vector Store** służy do wstawiania, aktualizacji (upsert), usuwania i wyszukiwania dokumentów w magazynie wektorowym na potrzeby generowania wspomaganego wyszukiwaniem (Retrieval Augmented Generation, RAG). Umożliwia wzbogacenie kontekstu LLM o istotne dokumenty oraz utrzymanie tego kontekstu w zgodzie z systemem, z którego dokumenty pochodzą.

Węzeł zawiera listę rozwijaną **Database**, która wybiera backend:

- **Qdrant** – przechowuje wektory na zewnętrznym serwerze Qdrant (wymaga danych logowania *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – przechowuje wektory w bazie Postgres należącej do Heym, bez zewnętrznej usługi (wymaga danych logowania *RAG: Psql + OpenAI*).

Domyślnym ustawieniem jest **Qdrant** ze względu na kompatybilność wsteczną. Zmiana wartości Database filtruje listę **Vector Store** do magazynów opartych na wybranej bazie. Oba backendy obsługują te same operacje, filtrowanie metadanych oraz reranking Cohere.

Do każdego z backendów można również dotrzeć poprzez dane logowania *RAG: Custom Embeddings*, które zastępują OpenAI dowolnym endpointem embeddingów zgodnym z OpenAI i definiują własny magazyn wektorowy. Magazyn utworzony na podstawie takich danych logowania pojawia się pod bazą Database, do której jest przypisany. Zobacz [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend magazynu wektorowego (domyślnie: `"qdrant"`) |
| `vectorStoreId` | UUID | Magazyn wektorowy z zakładki [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Typ operacji (również `operation`) |
| `documentContent` | expression | Tekst dokumentu do zapisania (insert, upsert) |
| `documentMetadata` | JSON string | Metadane zapisywanych dokumentów (insert, upsert); wartości obsługują wyrażenia |
| `documentIdField` | string | Pole payload przechowujące unikalny identyfikator (upsert, delete; domyślnie `doc_id`) |
| `documentId` | expression | Wartość unikalnego identyfikatora (upsert, delete) |
| `queryText` | expression | Zapytanie wyszukiwania (tylko search) |
| `searchLimit` | number | Maksymalna liczba wyników (domyślnie: 5) |
| `metadataFilters` | JSON string | Filtry metadanych dla wyszukiwania (wartości obsługują wyrażenia) |
| `enableReranker` | boolean | Użycie Cohere do rerankingu wyników wyszukiwania |
| `rerankerCredentialId` | UUID | Dane logowania Cohere dla rerankingu |
| `rerankerTopN` | number | Liczba najlepszych wyników zachowywanych po rerankingu |

## Operacje

### Insert

Dodaje dokumenty do magazynu wektorowego.

| Pole | Wymagane | Opis |
|-------|----------|-------------|
| `documentContent` | tak | Tekst do wygenerowania embeddingu i zapisania |
| `documentMetadata` | nie | Obiekt JSON, np. `{"source": "user", "category": "general"}` |

**Wyjście:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Wyrażenia w metadanych

Wartości metadanych przyjmują wyrażenia, dzięki czemu dokument można zapisać z kontekstem pochodzącym z danego wykonania:

```json
{ "url": "$start.url", "category": "faq" }
```

Wyrażenia są rozwiązywane po sparsowaniu JSON, a nie poprzez podstawianie tekstu do niego, więc wartość zawierająca cudzysłów lub znak nowej linii nie może rozerwać obiektu. Wartość będąca jednym całym wyrażeniem zachowuje swój rozwiązywany typ — `{"count": "$start.count"}` zapisuje liczbę, a nie `"7"` — co ma znaczenie, ponieważ `metadataFilters` wyszukiwania dopasowują według dokładnego typu. Tekst mieszany, taki jak `"page $start.count"`, rozwiązuje się do ciągu znaków, a zagnieżdżone obiekty i tablice są również przetwarzane rekurencyjnie.

To samo dotyczy `upsert` oraz `metadataFilters` wyszukiwania: najpierw następuje parsowanie, a wartości są rozwiązywane później, według tych samych reguł. Zatem filtr zapisany jako `{"count": "$start.count"}` dopasowuje liczbę zapisaną przez insert, a nie ciąg znaków `"7"`.

### Który workflow zapisał dokument

Dokument zapisany bez własnego pola `source` jest oznaczany workflow, który go zapisał, w postaci `source: "workflow:<workflow name>"`. Zakładka [Vectorstores](../tabs/vectorstores-tab.md) grupuje takie dokumenty pod **Added workflow: _name_**, dzięki czemu zawartość magazynu wskazuje, skąd pochodzi każdy dokument, a dokumenty jednego workflow można usunąć jako grupę. Ustawienie `source` samodzielnie w `documentMetadata` zawsze ma pierwszeństwo przed tym oznaczeniem.

### Upsert

Wstawia dokument lub zastępuje ten już zapisany pod tym samym unikalnym identyfikatorem.

Identyfikator jest polem **wewnątrz payload**, a nie wewnętrznym point id magazynu, dzięki czemu dokument zachowuje identyfikator już używany w danym systemie — identyfikator rekordu CRM, SKU, slug strony. `documentIdField` wskazuje to pole, a `documentId` przenosi jego wartość.

| Pole | Wymagane | Opis |
|-------|----------|-------------|
| `documentId` | tak | Unikalny identyfikator dokumentu (obsługuje wyrażenia) |
| `documentContent` | tak | Tekst do wygenerowania embeddingu i zapisania |
| `documentIdField` | nie | Pole payload, w którym znajduje się identyfikator (domyślnie `doc_id`) |
| `documentMetadata` | nie | Obiekt JSON, np. `{"source": "crm", "url": "$start.url"}` (wartości obsługują wyrażenia) |

Każdy punkt, którego pole identyfikatora pasuje, jest najpierw usuwany, więc dokument wcześniej zapisany jako kilka fragmentów jest zastępowany w całości, a nie duplikowany. Pole identyfikatora jest zapisywane w payload automatycznie, a point id pozostaje stabilny przy kolejnych upsertach tego samego dokumentu.

**Wyjście:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean — czy istniejąca wersja została zastąpiona), `$nodeLabel.replaced_count`
### Usuwanie

Usunięcie dokumentu po tym samym unikalnym identyfikatorze.

| Pole | Wymagane | Opis |
|-------|----------|-------------|
| `documentId` | tak | Unikalny identyfikator dokumentu (obsługuje wyrażenia) |
| `documentIdField` | nie | Pole w payloadzie, w którym znajduje się identyfikator (domyślnie `doc_id`) |

**Dane wyjściowe:** `$nodeLabel.deleted` – `true`, gdy dopasowano co najmniej jeden punkt, `false`, gdy identyfikatora
nie było w magazynie. `$nodeLabel.deleted_count` zawiera liczbę usuniętych punktów.

Usunięcie nieistniejącego identyfikatora nie jest błędem: węzeł kończy się powodzeniem z `deleted: false`, więc
gałąź czyszcząca nie wymaga zabezpieczenia przed nim.

### Wyszukiwanie

Wyszukiwanie semantyczne podobnych dokumentów.

| Pole | Wymagane | Opis |
|-------|----------|-------------|
| `queryText` | tak | Zapytanie wyszukiwania |
| `searchLimit` | nie | Maksymalna liczba wyników (domyślnie: 5) |
| `metadataFilters` | nie | Filtrowanie po metadanych (obiekt JSON z dokładnym dopasowaniem, wartości obsługują wyrażenia) |
| `enableReranker` | nie | Włączenie rerankingu Cohere dla lepszej trafności |
| `rerankerCredentialId` | przy rerankingu | Dane logowania Cohere |
| `rerankerTopN` | nie | Końcowa liczba wyników po rerankingu |

**Dane wyjściowe:** `$nodeLabel.results` – tablica `{ id, text, score, metadata }`

Gdy reranking jest włączony:

- `$nodeLabel.reranked` przyjmuje wartość `true`
- Każdy wynik zawiera również `relevance_score`
- `score` pozostaje oryginalnym wynikiem podobieństwa wektorowego
- `relevance_score` to wynik rerankera Cohere

## Dostęp do wyników

- `$ragNode.results.first().text` – treść najlepszego wyniku
- `$ragNode.results.first().score` – wynik podobieństwa (0–1)
- `$ragNode.results.first().metadata.source` – metadane najlepszego wyniku
- `$ragNode.results.map("item.text").join("\n\n")` – konkatenacja dla kontekstu LLM
- `$ragNode.reranked` – czy zastosowano reranking
- `$ragNode.count` – liczba zwróconych wyników
- `$ragNode.replaced` – czy upsert zastąpił istniejący dokument
- `$ragNode.deleted` – czy usunięcie cokolwiek usunęło

## Przykład – Wyszukiwanie

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

## Przykład – Wstawianie

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

## Przykład – Upsert

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

## Przykład – Usuwanie

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

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Wbudowany RAG jako część środowiska uruchomieniowego agenta
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Karta Magazyny wektorowe](../tabs/vectorstores-tab.md) – Tworzenie magazynów wektorowych i zarządzanie nimi
- [Integracje zewnętrzne](../reference/integrations.md#qdrant) – Konfiguracja danych logowania Qdrant i Postgres (pgvector)
- [Węzeł Agent](./agent-node.md) – Wykorzystanie wyników RAG jako kontekstu agenta
- [Węzeł LLM](./llm-node.md) – Przekazanie wyników RAG do promptu systemowego LLM

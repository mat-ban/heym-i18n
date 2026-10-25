# RAG / Vektorspeicher

Der Knoten **RAG / Vektorspeicher** fügt Dokumente in einen Vektorspeicher für Retrieval Augmented Generation (RAG) ein, führt Upserts durch, löscht und durchsucht sie. Nutzen Sie ihn, um den LLM-Kontext mit relevanten Dokumenten zu erweitern und diesen Kontext synchron mit dem Quellsystem der Dokumente zu halten.

Der Knoten verfügt über ein Dropdown-Menü **Database**, das das Backend auswählt:

- **Qdrant** – speichert Vektoren in einem externen Qdrant-Server (erfordert *RAG: Qdrant + OpenAI*-Anmeldedaten).
- **Postgres (pgvector)** – speichert Vektoren direkt in Heyms eigener Postgres-Datenbank, kein externer Dienst erforderlich (erfordert *RAG: Psql + OpenAI*-Anmeldedaten).

Standardmäßig ist **Qdrant** aus Gründen der Abwärtskompatibilität ausgewählt. Das Ändern der Database filtert die Liste **Vector Store** auf Speicher, die auf dieser Datenbank basieren. Beide Backends unterstützen dieselben Operationen, Metadaten-Filterung, hybride Suche (Vektor + BM25) und Cohere-Reranking.

Beide Backends können auch über Anmeldedaten des Typs *RAG: Custom Embeddings* erreicht werden, wodurch OpenAI durch einen beliebigen OpenAI-kompatiblen Embedding-Endpoint ersetzt wird und ein eigener Vektorspeicher benannt wird. Ein über solche Anmeldedaten erstellter Speicher erscheint unter der jeweils anvisierten Database. Siehe [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Vektorspeicher-Backend (Standard: `"qdrant"`) |
| `vectorStoreId` | UUID | Vektorspeicher aus dem Reiter [Vektorspeicher](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Operationstyp (auch `operation`) |
| `documentContent` | expression | Zu speichernder Dokumenttext (insert, upsert) |
| `documentMetadata` | JSON-String | Metadaten für gespeicherte Dokumente (insert, upsert); Werte unterstützen Ausdrücke |
| `documentIdField` | string | Payload-Feld mit der eindeutigen ID (upsert, delete; Standard `doc_id`) |
| `documentId` | expression | Wert der eindeutigen ID (upsert, delete) |
| `queryText` | expression | Suchanfrage (nur search) |
| `searchLimit` | number | Maximale Ergebnisanzahl (Standard: 5) |
| `metadataFilters` | JSON-String | Metadaten-Filter für die Suche (Werte unterstützen Ausdrücke) |
| `hybridSearch` | boolean | Vektorsuche mit BM25-Schlüsselwortsuche kombinieren (nur search; Standard: aus) |
| `enableReranker` | boolean | Cohere verwenden, um Suchergebnisse neu zu ordnen |
| `rerankerCredentialId` | UUID | Cohere-Anmeldedaten für das Reranking |
| `rerankerTopN` | number | Anzahl der besten Ergebnisse, die nach dem Reranking behalten werden sollen |

## Operationen

### Insert

Dokumente zum Vektorspeicher hinzufügen.

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `documentContent` | Ja | Zu embeddender und speichernder Text |
| `documentMetadata` | Nein | JSON-Objekt, z. B. `{"source": "user", "category": "general"}` |

**Ausgabe:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Metadaten-Ausdrücke

Metadaten-Werte akzeptieren Ausdrücke, sodass ein Dokument mit dem Kontext der Ausführung gespeichert werden kann:

```json
{ "url": "$start.url", "category": "faq" }
```

Ausdrücke werden nach dem Parsen des JSON aufgelöst, nicht durch Einsetzen von Text hinein. Ein Wert, der ein einzelner vollständiger Ausdruck ist, behält seinen aufgelösten Typ bei — `{"count": "$start.count"}` speichert eine Zahl und nicht `"7"` —, was entscheidend ist, da Such-`metadataFilters` auf exakten Typen abgleichen. Gemischter Text wie `"page $start.count"` wird zu einem String aufgelöst, und verschachtelte Objekte und Arrays werden ebenfalls durchlaufen.

Dasselbe gilt für `upsert` und für die `metadataFilters` der Suche: Sie werden zuerst geparst und ihre Werte danach nach denselben Regeln aufgelöst. Ein als `{"count": "$start.count"}` geschriebener Filter stimmt also mit der Zahl überein, die ein Insert gespeichert hat, und nicht mit dem String `"7"`.

### Welcher Workflow ein Dokument gespeichert hat

Ein ohne eigene `source` gespeichertes Dokument wird mit dem speichernden Workflow versehen, als `source: "workflow:<workflow name>"`. Der Reiter [Vektorspeicher](../tabs/vectorstores-tab.md) gruppiert diese unter **Hinzugefügter Workflow: _Name_**, sodass der Inhalt eines Speichers erkennen lässt, woher jedes Dokument stammt, und die Dokumente eines Workflows als Gruppe gelöscht werden können. Wenn Sie `source` selbst in `documentMetadata` setzen, hat dies stets Vorrang.

### Upsert

Ein Dokument einfügen oder das bereits unter derselben eindeutigen ID gespeicherte ersetzen.

Die ID ist ein Feld **innerhalb des Payloads**, nicht die interne Point-ID des Speichers. Ein Dokument behält somit den Bezeichner, den Ihr eigenes System bereits verwendet — eine CRM-Datensatz-ID, eine SKU, einen Seiten-Slug. `documentIdField` benennt dieses Feld und `documentId` trägt seinen Wert.

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `documentContent` | Ja | Zu speichernder Text |
| `documentId` | Ja | Eindeutige Dokument-ID |
| `documentIdField` | Nein | Feldname für die ID im Payload (Standard `doc_id`) |
| `documentMetadata` | Nein | Zusätzliche Metadaten |

**Ausgabe:** `$nodeLabel.status`, `$nodeLabel.point_id`, `$nodeLabel.replaced`

### Delete

Dokumente anhand ihrer ID entfernen.

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `documentId` | Ja | Zu löschende Dokument-ID |
| `documentIdField` | Nein | Feldname für die ID im Payload (Standard `doc_id`) |

**Ausgabe:** `$nodeLabel.status`, `$nodeLabel.deleted`

### Search

Semantische Suche nach ähnlichen Dokumenten.

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `queryText` | Ja | Suchanfrage |
| `searchLimit` | Nein | Maximale Ergebnisse (Standard: 5) |
| `metadataFilters` | Nein | Nach Metadaten filtern (exaktes JSON-Objekt, Werte unterstützen Ausdrücke) |
| `hybridSearch` | Nein | Vektorähnlichkeit mit BM25-Schlüsselwortübereinstimmung fusionieren (siehe [Hybride Suche](#hybride-suche)) |
| `enableReranker` | Nein | Cohere-Reranking für bessere Relevanz aktivieren |
| `rerankerCredentialId` | Bei Reranking | Cohere-Anmeldedaten |
| `rerankerTopN` | Nein | Endgültige Anzahl der Ergebnisse nach dem Reranking |

Wenn Reranking aktiviert ist:

- Ergebnisse werden nach Coheres Relevanz-Score neu geordnet
- `score` bleibt der ursprüngliche Vektor-Ähnlichkeits-Score
- `relevance_score` ist der Score des Cohere-Rerankers

#### Hybride Suche

Die Vektorsuche findet Text, der dieselbe Bedeutung wie die Abfrage hat. Text, der nur genau die gesuchten Wörter enthält, kann weiter unten landen: ein Produktcode, eine Ticketnummer, der Name einer Person, ein Fehler wie `ERR-4021`. Aktivieren Sie **Hybride Suche**, und der Knoten führt neben der Vektorsuche eine Schlüsselwortsuche durch und führt beide Listen zusammen, sodass eine Abfrage beide Arten von Treffern findet.

1. Die Vektorsuche liefert ihre besten Treffer, genau wie ohne hybride Suche.
2. Eine Schlüsselwortsuche bewertet den gespeicherten Text anhand der Wörter der Abfrage mit **BM25**, was seltene Wörter, wiederholte Wörter und kürzere Dokumente belohnt.
3. Die beiden Ranglisten werden mit **Reciprocal Rank Fusion** zusammengeführt. Ein Dokument weit oben in beiden Listen landet ganz vorne, und ein Dokument, das nur eine Liste gefunden hat, erscheint trotzdem.

Metadaten-Filter gelten für beide Suchen, und der Cohere-Reranker, sofern aktiviert, wird auf der zusammengeführten Liste ausgeführt.

Jedes Ergebnis enthält den Score beider Suchen:

| Feld | Bedeutung |
|---|---|
| `score` | Fusionierter Score von 0 bis 1. `1` bedeutet, dass das Dokument in beiden Suchen auf Rang 1 lag. |
| `vector_score` | Vektorähnlichkeit (0 bis 1). `null`, wenn nur die Schlüsselwortsuche das Dokument gefunden hat. |
| `keyword_score` | BM25-Score. `null`, wenn keines der Abfragewörter im Dokument vorkommt. |

`$nodeLabel.hybrid` ist `true`, wenn die hybride Suche ausgeführt wurde.

Gut zu wissen:

- Der fusionierte `score` ordnet die Ergebnisse relativ zueinander an. Es handelt sich nicht um eine Vektorähnlichkeit, daher lässt sich ein für eine einfache Suche eingestellter Schwellenwert nicht direkt übertragen.
- Abfragewörter werden in Kleinbuchstaben umgewandelt und an Leer- und Satzzeichen getrennt, sodass `ERR-4021` als `err` und `4021` gesucht wird. Die Schlüsselwortsuche verwendet bis zu den ersten 16 unterschiedlichen Wörtern der Abfrage.
- Qdrant: Die erste hybride Suche auf einer Sammlung erstellt einen Volltextindex für das Payload-Feld `text`, wofür ein Qdrant-Schlüssel mit Schreibzugriff erforderlich ist. Bei großen Sammlungen dauert dies einmalig einen Moment; spätere Suchen nutzen den Index wieder.
- Postgres (pgvector): Die Datenbankmigration `142_vsi_text_search_index` fügt den Volltextindex hinzu. Führen Sie nach der Aktualisierung `alembic upgrade head` aus. Die hybride Suche funktioniert auch ohne den Index, bei großen Speichern jedoch langsamer.
- Bei jeder Abfrage liest die Schlüsselwortsuche bis zu 200 passende Dokumente, beginnend mit den seltensten Abfragewörtern, da diese das meiste Gewicht tragen.

## Zugriff auf Ergebnisse

- `$ragNode.results.first().text` – Inhalt des besten Ergebnisses
- `$ragNode.results.first().score` – Ähnlichkeits-Score (0–1) oder fusionierter Score bei hybrider Suche
- `$ragNode.results.first().keyword_score` – BM25-Score (hybride Suche)
- `$ragNode.results.first().vector_score` – Vektorähnlichkeit (hybride Suche)
- `$ragNode.results.first().metadata.source` – Metadaten des besten Ergebnisses
- `$ragNode.results.map("item.text").join("\n\n")` – Für LLM-Kontext verketten
- `$ragNode.reranked` – Ob Reranking angewendet wurde
- `$ragNode.hybrid` – Ob hybride Suche angewendet wurde
- `$ragNode.count` – Anzahl der zurückgegebenen Ergebnisse
- `$ragNode.replaced` – Ob ein Upsert ein bestehendes Dokument ersetzt hat
- `$ragNode.deleted` – Ob ein Delete etwas entfernt hat

## Beispiel – Search

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

## Beispiel – Hybride Suche

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

## Beispiel – Insert

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

## Beispiel – Upsert

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

## Beispiel – Delete

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

## Verwandte Themen

- [Warum Heym](../getting-started/why-heym.md) – Integriertes RAG als Teil der Agent-Runtime
- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Reiter Vektorspeicher](../tabs/vectorstores-tab.md) – Vektorspeicher erstellen und verwalten
- [Drittanbieter-Integrationen](../reference/integrations.md#qdrant) – Einrichtung von Qdrant- und Postgres (pgvector)-Anmeldedaten
- [Agent-Knoten](./agent-node.md) – RAG-Ergebnisse als Agent-Kontext nutzen
- [LLM-Knoten](./llm-node.md) – RAG-Ergebnisse in den LLM-System-Prompt einspeisen

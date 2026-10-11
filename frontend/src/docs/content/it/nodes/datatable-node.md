# DataTable

Il nodo **DataTable** legge, scrive e gestisce i dati nelle DataTable di Heym. Utilizzarlo per operazioni CRUD su storage strutturato first-party senza credenziali esterne.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable dalla [scheda DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operazione: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID della riga (per getById, update, remove) |
| `dataTableData` | JSON string | Valori delle colonne: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtro (find/upsert/count). `find` e `count` supportano gli operatori `{"age": {"$gt": 18}}`; `upsert` utilizza la corrispondenza esatta `{"column_name": "value"}` |
| `dataTableSort` | string | Colonna di ordinamento, prefisso `-` per l'ordine decrescente |
| `dataTableLimit` | number | Numero massimo di righe restituite (predefinito: 100) |

## Operazioni

| Operazione | Campi obbligatori | Descrizione |
|-----------|----------------|-------------|
| `find` | dataTableId | Trova le righe corrispondenti a un filtro con operatori opzionale, con ordinamento/limite opzionali |
| `getAll` | dataTableId | Recupera tutte le righe con ordinamento/limite opzionali |
| `count` | dataTableId | Conta le righe corrispondenti a un filtro con operatori opzionale (conteggio eseguito nel database; restituisce solo un numero) |
| `getById` | dataTableId, dataTableRowId | Recupera una singola riga tramite UUID |
| `insert` | dataTableId, dataTableData | Inserisce una nuova riga |
| `update` | dataTableId, dataTableRowId, dataTableData | Aggiorna la riga (unisce i dati) |
| `remove` | dataTableId, dataTableRowId | Elimina una riga |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Aggiorna se viene trovata una corrispondenza, altrimenti inserisce |

## Esempio - Find Rows

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Esempio - Insert Row

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Esempio - Count Rows

Conta le righe corrispondenti a una condizione in un singolo nodo, invece di `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Il risultato è disponibile come `$activeAdults.count`. Un filtro vuoto o omesso conta tutte le righe.

### Operatori di filtro per find e count

In un filtro `find` o `count`, un valore semplice indica uguaglianza; un valore oggetto applica un operatore:

| Operatore | Significato |
|----------|---------|
| `$eq` (o un valore semplice) | Uguale |
| `$ne` | Diverso da |
| `$gt`, `$gte`, `$lt`, `$lte` | Confronti maggiore/minore (numerici per le colonne di tipo `number`, altrimenti testuali) |
| `$contains` | Corrispondenza di sottostringa senza distinzione tra maiuscole e minuscole |
| `$in` | Il valore è presente nell'array specificato |

Esempio che ne combina diversi: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Gli operatori sconosciuti vengono ignorati. I filtri `upsert` utilizzano comunque valori a corrispondenza esatta per individuare la riga da aggiornare.

È inoltre possibile filtrare sui metadati della riga — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — che sono memorizzati come colonne reali anziché all'interno dei dati. Per le date, passare un valore completo per i confronti di intervallo (ad es. `{"created_at": {"$gt": "2026-06-04"}}`) oppure utilizzare `$contains` per una corrispondenza testuale parziale (ad es. `{"created_at": {"$contains": "2026-06-04"}}`). Se una delle proprie colonne ha lo stesso nome di un campo di metadati, prevale la colonna dati.

## Accesso all'Output

- `$nodeLabel.success` - Stato di successo booleano
- `$nodeLabel.rows` - Array di righe (find, getAll)
- `$nodeLabel.row` - Oggetto riga singola (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Accesso al valore di una colonna specifica
- `$nodeLabel.count` - Numero di righe (righe restituite per find/getAll; totale delle righe corrispondenti per count)
- `$nodeLabel.id` - UUID della riga (insert, update, remove)
- `$nodeLabel.found` - Booleano (getById)
- `$nodeLabel.operation` - Nome dell'operazione (ad es. `count`; `insert`/`update` per upsert)

## Nessuna Credenziale Richiesta

A differenza delle integrazioni esterne, DataTable opera sul database interno di Heym. I permessi di accesso del proprietario del workflow vengono verificati automaticamente.
## Creato dall'Assistente IA

Quando l'[Assistente IA](../reference/ai-assistant.md#data-tables) o la [Chat](../tabs/chat-tab.md) crea questo nodo, seleziona o crea la tabella insieme a Lei e scrive i nomi esatti delle colonne della tabella in `dataTableData` e `dataTableFilter`.

## Correlati

- [Scheda Tabella dati](../tabs/datatable-tab.md) - Creare e gestire le tabelle
- [Nodo Grist](./grist-node.md) - Integrazione con fogli di calcolo esterni
- [Expression DSL](../reference/expression-dsl.md) - Sintassi delle espressioni per valori dinamici

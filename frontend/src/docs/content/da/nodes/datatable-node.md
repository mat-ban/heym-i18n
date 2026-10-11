# DataTable

**DataTable**-noden læser, skriver og administrerer data i Heym DataTables. Den anvendes til CRUD-operationer på førsteparts struktureret lagring uden eksterne legitimationsoplysninger.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable fra [DataTable-fanen](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operation: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | udtryk | Række-UUID (til getById, update, remove) |
| `dataTableData` | JSON-streng | Kolonneværdier: `{"kolonnenavn": "værdi"}` |
| `dataTableFilter` | JSON-streng | Filter (find/upsert/count). `find` og `count` understøtter operatorer `{"alder": {"$gt": 18}}`; `upsert` bruger eksakt match `{"kolonnenavn": "værdi"}` |
| `dataTableSort` | string | Sorteringskolonne, præfiks `-` for faldende rækkefølge |
| `dataTableLimit` | number | Maksimalt antal returnerede rækker (standard: 100) |

## Operationer

| Operation | Påkrævede felter | Beskrivelse |
|-----------|----------------|-------------|
| `find` | dataTableId | Finder rækker der matcher et valgfrit operatorfilter med valgfri sortering/grænse |
| `getAll` | dataTableId | Henter alle rækker med valgfri sortering/grænse |
| `count` | dataTableId | Tæller rækker der matcher et valgfrit operatorfilter (tælles i databasen; returnerer kun et tal) |
| `getById` | dataTableId, dataTableRowId | Henter en enkelt række via UUID |
| `insert` | dataTableId, dataTableData | Indsætter en ny række |
| `update` | dataTableId, dataTableRowId, dataTableData | Opdaterer række (fletter data) |
| `remove` | dataTableId, dataTableRowId | Sletter en række |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Opdaterer hvis match findes, indsætter ellers |

## Eksempel - Find rækker

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

## Eksempel - Indsæt række

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

## Eksempel - Tæl rækker

Tæl rækker der matcher en betingelse i en enkelt node, i stedet for `getAll` → If/Else → Map.

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

Resultatet er tilgængeligt som `$activeAdults.count`. Et tomt eller udeladt filter tæller alle rækker.

### Find- og count-filteroperatorer

I et `find`- eller `count`-filter betyder en simpel værdi 'lig med'; et objektværdi anvender en operator:

| Operator | Betydning |
|----------|---------|
| `$eq` (eller en simpel værdi) | Lig med |
| `$ne` | Ikke lig med |
| `$gt`, `$gte`, `$lt`, `$lte` | Større/mindre end sammenligninger (numerisk for kolonner typet som `number`, ellers tekst) |
| `$contains` | Case-insensitiv delstrengsmatch |
| `$in` | Værdi er i den givne array |

Eksempel der kombinerer flere: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Ukendte operatorer ignoreres. `upsert`-filtre bruger stadig eksakte match-værdier for at finde rækken der skal opdateres.

Det er også muligt at filtrere på rækkemetadata - `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` - som gemmes som rigtige kolonner i stedet for inde i dataene. For datoer angives en fuld værdi for interval-sammenligninger (f.eks. `{"created_at": {"$gt": "2026-06-04"}}`) eller brug `$contains` for en delvis tekstmatch (f.eks. `{"created_at": {"$contains": "2026-06-04"}}`). Hvis en af de egne kolonner har samme navn som et metadatafelt, har datakolonnen forrang.

## Output-adgang

- `$nodeLabel.success` - Boolsk successtatus
- `$nodeLabel.rows` - Array af rækker (find, getAll)
- `$nodeLabel.row` - Enkelt rækkeobjekt (getById, insert, update, upsert)
- `$nodeLabel.row.data.kolonnenavn` - Adgang til specifik kolonneværdi
- `$nodeLabel.count` - Antal rækker (returnerede rækker for find/getAll; samlet match for count)
- `$nodeLabel.id` - Række-UUID (insert, update, remove)
- `$nodeLabel.found` - Boolsk (getById)
- `$nodeLabel.operation` - Operationsnavn (f.eks. `count`; `insert`/`update` for upsert)

## Ingen legitimationsoplysninger nødvendige

I modsætning til eksterne integrationer opererer DataTable på Heyms interne database. Workflow-ejerens adgangsrettigheder kontrolleres automatisk.

## Bygget af AI-assistenten

Når [AI-assistenten](../reference/ai-assistant.md#data-tables) eller [Chat](../tabs/chat-tab.md) bygger denne node, vælges eller oprettes tabellen, og tabellens eksakte kolonnenavne skrives ind i `dataTableData` og `dataTableFilter`.

## Relateret

- [DataTable-fan](../tabs/datatable-tab.md) - Opret og administrer tabeller
- [Grist-node](./grist-node.md) - Ekstern regnearksintegration
- [Expression DSL](../reference/expression-dsl.md) - Udtrykssyntaks for dynamiske værdier

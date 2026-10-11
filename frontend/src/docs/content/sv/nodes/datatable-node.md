# DataTable

Noden **DataTable** läser, skriver och hanterar data i Heym DataTables. Den används för CRUD-operationer mot förstapartsstrukturerad lagring utan externa autentiseringsuppgifter.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `dataTableId` | UUID | DataTable från [fliken DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operation: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Rad-UUID (för getById, update, remove) |
| `dataTableData` | JSON string | Kolumnvärden: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filter (find/upsert/count). `find` och `count` stöder operatorer `{"age": {"$gt": 18}}`; `upsert` använder exakt matchning `{"column_name": "value"}` |
| `dataTableSort` | string | Sorteringskolumn, prefix `-` för fallande ordning |
| `dataTableLimit` | number | Max antal rader som returneras (standard: 100) |

## Operationer

| Operation | Obligatoriska fält | Beskrivning |
|-----------|----------------|-------------|
| `find` | dataTableId | Hitta rader som matchar ett valfritt operatorfilter med valfri sortering/limit |
| `getAll` | dataTableId | Hämta alla rader med valfri sortering/limit |
| `count` | dataTableId | Räkna rader som matchar ett valfritt operatorfilter (räknas i databasen; returnerar endast ett nummer) |
| `getById` | dataTableId, dataTableRowId | Hämta en enskild rad via UUID |
| `insert` | dataTableId, dataTableData | Infoga en ny rad |
| `update` | dataTableId, dataTableRowId, dataTableData | Uppdatera rad (sammanfogar data) |
| `remove` | dataTableId, dataTableRowId | Ta bort en rad |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Uppdatera om matchning hittas, infoga annars |

## Exempel - Hitta rader

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

## Exempel - Infoga rad

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

## Exempel - Räkna rader

Räkna rader som matchar ett villkor i en enda nod, i stället för `getAll` → If/Else → Map.

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

Resultatet är tillgängligt som `$activeAdults.count`. Ett tomt eller utelämnat filter räknar varje rad.

### Filteroperatorer för find och count

I ett `find`- eller `count`-filter innebär ett vanligt värde lika med; ett objektvärde tillämpar en operator:

| Operator | Betydelse |
|----------|---------|
| `$eq` (eller ett vanligt värde) | Lika med |
| `$ne` | Inte lika med |
| `$gt`, `$gte`, `$lt`, `$lte` | Större/mindre än-jämförelser (numeriskt för kolumner av typen `number`, annars text) |
| `$contains` | Skiftlägesokänslig delsträngsmatchning |
| `$in` | Värdet finns i den angivna arrayen |

Exempel som kombinerar flera: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Okända operatorer ignoreras. `upsert`-filter använder fortfarande exakt matchning för att hitta raden som ska uppdateras.

Det går även att filtrera på radmetadata — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — som lagras som riktiga kolumner i stället för inuti data. För datum anges ett fullständigt värde för intervalljämförelser (t.ex. `{"created_at": {"$gt": "2026-06-04"}}`) eller används `$contains` för en partiell textmatchning (t.ex. `{"created_at": {"$contains": "2026-06-04"}}`). Om en egen kolumn har samma namn som ett metadatafält har datakolumnen företräde.

## Åtkomst till utdata

- `$nodeLabel.success` - Booleskt statusvärde för lyckat resultat
- `$nodeLabel.rows` - Array av rader (find, getAll)
- `$nodeLabel.row` - Enskilt radobjekt (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Åtkomst till specifikt kolumnvärde
- `$nodeLabel.count` - Antal rader (rader som returneras för find/getAll; totalt antal matchande rader för count)
- `$nodeLabel.id` - Rad-UUID (insert, update, remove)
- `$nodeLabel.found` - Booleskt värde (getById)
- `$nodeLabel.operation` - Operationsnamn (t.ex. `count`; `insert`/`update` för upsert)

## Inga autentiseringsuppgifter krävs

Till skillnad från externa integrationer arbetar DataTable mot Heyms interna databas. Arbetsflödesägarens åtkomstbehörigheter kontrolleras automatiskt.

## Byggd av AI-assistenten

När [AI-assistenten](../reference/ai-assistant.md#data-tables) eller [Chat](../tabs/chat-tab.md) bygger denna nod väljer eller skapar den tabellen tillsammans med användaren och skriver tabellens exakta kolumnnamn i `dataTableData` och `dataTableFilter`.

## Relaterat

- [Fliken DataTable](../tabs/datatable-tab.md) - Skapa och hantera tabeller
- [Grist-nod](./grist-node.md) - Extern kalkylbladsintegration
- [Expression DSL](../reference/expression-dsl.md) - Uttryckssyntax för dynamiska värden

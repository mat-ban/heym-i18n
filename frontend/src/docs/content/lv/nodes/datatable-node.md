# DataTable

**DataTable** mezgls lasa, raksta un pārvalda datus Heym DataTables. Izmantojiet to CRUD operācijām ar pirmās puses strukturēto krātuvi bez ārējiem akreditācijas datiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable no [DataTable cilnes](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operācija: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Rindas UUID (priekš getById, update, remove) |
| `dataTableData` | JSON string | Kolonnu vērtības: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtrs (find/upsert/count). `find` un `count` atbalsta operatorus `{"age": {"$gt": 18}}`; `upsert` izmanto precīzu atbilstību `{"column_name": "value"}` |
| `dataTableSort` | string | Kārtošanas kolonna, prefikss `-` dilstošai secībai |
| `dataTableLimit` | number | Maksimālais atgriezto rindu skaits (noklusējums: 100) |

## Operācijas

| Operācija | Nepieciešamie lauki | Apraksts |
|-----------|----------------|-------------|
| `find` | dataTableId | Atrast rindas, kas atbilst neobligātam operatora filtram ar neobligātu kārtošanu/limitu |
| `getAll` | dataTableId | Iegūt visas rindas ar neobligātu kārtošanu/limitu |
| `count` | dataTableId | Saskaitīt rindas, kas atbilst neobligātam operatora filtram (skaitīts datubāzē; atgriež tikai skaitli) |
| `getById` | dataTableId, dataTableRowId | Iegūt vienu rindu pēc UUID |
| `insert` | dataTableId, dataTableData | Ievietot jaunu rindu |
| `update` | dataTableId, dataTableRowId, dataTableData | Atjaunināt rindu (apvieno datus) |
| `remove` | dataTableId, dataTableRowId | Dzēst rindu |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Atjaunināt, ja atrasta atbilstība, pretējā gadījumā ievietot |

## Piemērs - Atrast rindas

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

## Piemērs - Ievietot rindu

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

## Piemērs - Saskaitīt rindas

Saskaitīt rindas, kas atbilst nosacījumam, vienā mezglā, nevis `getAll` → If/Else → Map.

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

Rezultāts ir pieejams kā `$activeAdults.count`. Tukšs vai izlaists filtrs saskaita katru rindu.

### Find un count filtra operatori

`find` vai `count` filtrā vienkārša vērtība nozīmē vienāds; objekta vērtība piemēro operatoru:

| Operators | Nozīme |
|----------|---------|
| `$eq` (vai vienkārša vērtība) | Vienāds |
| `$ne` | Nav vienāds |
| `$gt`, `$gte`, `$lt`, `$lte` | Lielāks/mazāks salīdzinājumi (skaitliski kolonnām ar tipu `number`, pretējā gadījumā teksts) |
| `$contains` | Apakšvirknes atbilstība bez reģistrjutības |
| `$in` | Vērtība ir dotajā masīvā |

Piemērs, apvienojot vairākus: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Nezināmi operatori tiek ignorēti. `upsert` filtri joprojām izmanto precīzas atbilstības vērtības, lai atrastu atjaunināmo rindu.

Varat arī filtrēt pēc rindas metadatiem — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — kas tiek glabāti kā īstas kolonnas, nevis jūsu datu ietvaros. Datumiem nododiet pilnu vērtību diapazona salīdzinājumiem (piem., `{"created_at": {"$gt": "2026-06-04"}}`) vai izmantojiet `$contains` daļējai teksta atbilstībai (piem., `{"created_at": {"$contains": "2026-06-04"}}`). Ja viena no jūsu pašu kolonnām ir nosaukta tāpat kā metadatu lauks, datu kolonnai ir prioritāte.

## Izvades piekļuve

- `$nodeLabel.success` - Būla veiksmes statuss
- `$nodeLabel.rows` - Rindu masīvs (find, getAll)
- `$nodeLabel.row` - Vienas rindas objekts (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Piekļūt konkrētai kolonnas vērtībai
- `$nodeLabel.count` - Rindu skaits (atgrieztās rindas priekš find/getAll; atbilstošo rindu kopskaits priekš count)
- `$nodeLabel.id` - Rindas UUID (insert, update, remove)
- `$nodeLabel.found` - Būla (getById)
- `$nodeLabel.operation` - Operācijas nosaukums (piem., `count`; `insert`/`update` priekš upsert)

## Nav nepieciešami akreditācijas dati

Atšķirībā no ārējām integrācijām DataTable darbojas ar Heym iekšējo datubāzi. Workflow īpašnieka piekļuves atļaujas tiek pārbaudītas automātiski.

## Veidots ar AI asistentu

Kad [AI asistent](../reference/ai-assistant.md#data-tables) vai [Chat](../tabs/chat-tab.md) veido šo mezglu, tas kopā ar jums izvēlas vai izveido tabulu un ieraksta tabulas precīzos kolonnu nosaukumus `dataTableData` un `dataTableFilter`.

## Saistītie

- [DataTable cilne](../tabs/datatable-tab.md) - Izveidot un pārvaldīt tabulas
- [Grist mezgls](./grist-node.md) - Ārējā izklājlapu integrācija
- [Expression DSL](../reference/expression-dsl.md) - Izteiksmes sintakse dinamiskām vērtībām

# DataTable

**DataTable** node loeb, kirjutab ja haldab andmeid Heymi DataTable'ides. Kasutage seda CRUD-operatsioonideks esmase osapoole struktureeritud salvestusruumis ilma väliste mandaatideta.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable vahekaardilt [DataTable tab](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operatsioon: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Rea UUID (getById, update, remove jaoks) |
| `dataTableData` | JSON string | Veeru väärtused: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filter (find/upsert/count). `find` ja `count` toetavad operaatoreid `{"age": {"$gt": 18}}`; `upsert` kasutab täpse vastega `{"column_name": "value"}` |
| `dataTableSort` | string | Sortimisveerand, prefiks `-` kahaneva järjestuse jaoks |
| `dataTableLimit` | number | Maksimaalne tagastatavate ridade arv (vaikimisi: 100) |

## Operatsioonid

| Operation | Required Fields | Description |
|-----------|----------------|-------------|
| `find` | dataTableId | Otsib ridu, mis vastavad valikulisele operaatorfiltrile, valikulise sortimise/limiidiga |
| `getAll` | dataTableId | Hangib kõik read valikulise sortimise/limiidiga |
| `count` | dataTableId | Loeb ridu, mis vastavad valikulisele operaatorfiltrile (loendatakse andmebaasis; tagastab ainult numbri) |
| `getById` | dataTableId, dataTableRowId | Hangib üksiku rea UUID järgi |
| `insert` | dataTableId, dataTableData | Sisestab uue rea |
| `update` | dataTableId, dataTableRowId, dataTableData | Uuendab rida (ühendab andmed) |
| `remove` | dataTableId, dataTableRowId | Kustutab rea |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Uuendab, kui vaste leitakse, vastasel juhul sisestab |

## Näide – ridade otsimine

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

## Näide – rea sisestamine

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

## Näide – ridade loendamine

Loendage tingimusele vastavaid ridu ühes nodes, selle asemel et kasutada `getAll` → If/Else → Map.

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

Tulemus on saadaval kujul `$activeAdults.count`. Tühi või puuduv filter loeb kõik read.

### Find- ja count-filtrite operaatorid

Filtris `find` või `count` tähendab lihtväärtus võrdust; objektväärtus rakendab operaatorit:

| Operator | Meaning |
|----------|---------|
| `$eq` (või lihtväärtus) | Võrdub |
| `$ne` | Ei võrdu |
| `$gt`, `$gte`, `$lt`, `$lte` | Suurem/väiksem võrdlused (numbrilised veergudele, mis on tüübist `number`, vastasel juhul tekst) |
| `$contains` | Tõstutundetu alamstringi vaste |
| `$in` | Väärtus on antud massiivis |

Näide mitme kombineerimisest: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Tundmatuid operaatoreid eiratakse. `upsert` filtrid kasutavad endiselt täpse vastega väärtusi, et leida uuendatav rida.

Samuti saate filtreerida rea metaandmete järgi – `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` – mis on salvestatud päris veergudena, mitte teie andmete sees. Kuupäevade puhul edastage vahemiku võrdlemiseks täisväärtus (nt `{"created_at": {"$gt": "2026-06-04"}}`) või kasutage osalise tekstivaste jaoks `$contains` (nt `{"created_at": {"$contains": "2026-06-04"}}`). Kui mõni teie enda veerg on nimetatud samamoodi nagu metaandmete väli, on andmeveerul ülimus.

## Väljundi juurdepääs

- `$nodeLabel.success` – Boole'i õnnestumise olek
- `$nodeLabel.rows` – Ridade massiiv (find, getAll)
- `$nodeLabel.row` – Üksiku rea objekt (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` – Juurdepääs konkreetse veeru väärtusele
- `$nodeLabel.count` – Ridade arv (find/getAll puhul tagastatud read; count puhul vastavate ridade koguarv)
- `$nodeLabel.id` – Rea UUID (insert, update, remove)
- `$nodeLabel.found` – Boole'i (getById)
- `$nodeLabel.operation` – Operatsiooni nimi (nt `count`; upsert puhul `insert`/`update`)

## Mandaati pole vaja

Erinevalt välistest integratsioonidest töötab DataTable Heymi sisemise andmebaasiga. Workflow omaniku juurdepääsuõigusi kontrollitakse automaatselt.

## Ehitatud AI-assistendi poolt

Kui [AI Assistant](../reference/ai-assistant.md#data-tables) või [Chat](../tabs/chat-tab.md) ehitab selle node, valib või loob see tabeli koos teiega ning kirjutab tabeli täpsed veerunimed `dataTableData` ja `dataTableFilter` sisse.

## Seotud

- [DataTable Tab](../tabs/datatable-tab.md) – Tabelite loomine ja haldamine
- [Grist Node](./grist-node.md) – Väline arvutustabeli integratsioon
- [Expression DSL](../reference/expression-dsl.md) – Avaldise süntaks dünaamiliste väärtuste jaoks

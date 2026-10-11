# DataTable

De **DataTable**-node leest, schrijft en beheert gegevens in Heym DataTables. Gebruik deze voor CRUD-bewerkingen op first-party gestructureerde opslag zonder externe referenties.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable uit [DataTable-tab](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Bewerking: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Rij-UUID (voor getById, update, remove) |
| `dataTableData` | JSON string | Kolomwaarden: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filter (find/upsert/count). `find` en `count` ondersteunen operatoren `{"age": {"$gt": 18}}`; `upsert` gebruikt exacte overeenkomst `{"column_name": "value"}` |
| `dataTableSort` | string | Sorteerkolom, prefix `-` voor aflopend |
| `dataTableLimit` | number | Maximaal aantal geretourneerde rijen (standaard: 100) |

## Bewerkingen

| Bewerking | Vereiste velden | Beschrijving |
|-----------|----------------|-------------|
| `find` | dataTableId | Rijen vinden die overeenkomen met een optionele operatorfilter, met optionele sortering/limiet |
| `getAll` | dataTableId | Alle rijen ophalen met optionele sortering/limiet |
| `count` | dataTableId | Rijen tellen die overeenkomen met een optionele operatorfilter (geteld in de database; retourneert alleen een getal) |
| `getById` | dataTableId, dataTableRowId | Een enkele rij ophalen op UUID |
| `insert` | dataTableId, dataTableData | Een nieuwe rij invoegen |
| `update` | dataTableId, dataTableRowId, dataTableData | Rij bijwerken (voegt gegevens samen) |
| `remove` | dataTableId, dataTableRowId | Een rij verwijderen |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Bijwerken als een overeenkomst wordt gevonden, anders invoegen |

## Voorbeeld - Rijen vinden

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

## Voorbeeld - Rij invoegen

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

## Voorbeeld - Rijen tellen

Tel rijen die aan een voorwaarde voldoen in één node, in plaats van `getAll` → If/Else → Map.

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

Het resultaat is beschikbaar als `$activeAdults.count`. Een lege of weggelaten filter telt elke rij.

### Filteroperatoren voor find en count

In een `find`- of `count`-filter betekent een gewone waarde gelijk aan; een objectwaarde past een operator toe:

| Operator | Betekenis |
|----------|---------|
| `$eq` (of een gewone waarde) | Is gelijk aan |
| `$ne` | Is niet gelijk aan |
| `$gt`, `$gte`, `$lt`, `$lte` | Groter/kleiner dan-vergelijkingen (numeriek voor kolommen van het type `number`, anders tekst) |
| `$contains` | Substring-overeenkomst zonder onderscheid tussen hoofd- en kleine letters |
| `$in` | Waarde bevindt zich in de opgegeven array |

Voorbeeld met meerdere gecombineerd: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Onbekende operatoren worden genegeerd. `upsert`-filters gebruiken nog steeds exacte overeenkomstwaarden om de bij te werken rij te vinden.

U kunt ook filteren op rijmetadata — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — die als echte kolommen worden opgeslagen in plaats van binnen uw gegevens. Geef voor datums een volledige waarde door voor bereikvergelijkingen (bijv. `{"created_at": {"$gt": "2026-06-04"}}`) of gebruik `$contains` voor een gedeeltelijke tekstovereenkomst (bijv. `{"created_at": {"$contains": "2026-06-04"}}`). Als een van uw eigen kolommen dezelfde naam heeft als een metadataveld, krijgt de gegevenskolom voorrang.

## Uitvoertoegang

- `$nodeLabel.success` - Booleaanse successtatus
- `$nodeLabel.rows` - Array van rijen (find, getAll)
- `$nodeLabel.row` - Enkel rij-object (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Toegang tot specifieke kolomwaarde
- `$nodeLabel.count` - Aantal rijen (geretourneerde rijen voor find/getAll; totaal aantal overeenkomende rijen voor count)
- `$nodeLabel.id` - Rij-UUID (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Naam van bewerking (bijv. `count`; `insert`/`update` voor upsert)

## Geen referentie vereist

In tegenstelling tot externe integraties werkt DataTable op de interne database van Heym. De toegangsmachtigingen van de workflow-eigenaar worden automatisch gecontroleerd.

## Gebouwd door de AI Assistant

Wanneer de [AI Assistant](../reference/ai-assistant.md#data-tables) of [Chat](../tabs/chat-tab.md) deze node bouwt, kiest of maakt deze samen met u de tabel en schrijft de exacte kolomnamen van de tabel in `dataTableData` en `dataTableFilter`.

## Gerelateerd

- [DataTable-tab](../tabs/datatable-tab.md) - Tabellen maken en beheren
- [Grist-node](./grist-node.md) - Externe spreadsheetintegratie
- [Expression DSL](../reference/expression-dsl.md) - Expressiesyntaxis voor dynamische waarden

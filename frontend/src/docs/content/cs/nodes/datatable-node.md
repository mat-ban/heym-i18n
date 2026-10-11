# DataTable

Uzel **DataTable** čte, zapisuje a spravuje data v tabulkách Heym DataTables. Použijte jej pro operace CRUD nad vlastním strukturovaným úložištěm bez potřeby externích přihlašovacích údajů.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable z [karty DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operace: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID řádku (pro getById, update, remove) |
| `dataTableData` | JSON string | Hodnoty sloupců: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtr (find/upsert/count). `find` a `count` podporují operátory `{"age": {"$gt": 18}}`; `upsert` používá přesnou shodu `{"column_name": "value"}` |
| `dataTableSort` | string | Sloupec pro řazení, prefix `-` pro sestupné řazení |
| `dataTableLimit` | number | Maximální počet vrácených řádků (výchozí: 100) |

## Operace

| Operace | Povinná pole | Popis |
|-----------|----------------|-------------|
| `find` | dataTableId | Najde řádky odpovídající volitelnému filtru s operátory, s volitelným řazením/limitem |
| `getAll` | dataTableId | Získá všechny řádky s volitelným řazením/limitem |
| `count` | dataTableId | Spočítá řádky odpovídající volitelnému filtru s operátory (počítáno v databázi; vrací pouze číslo) |
| `getById` | dataTableId, dataTableRowId | Získá jeden řádek podle UUID |
| `insert` | dataTableId, dataTableData | Vloží nový řádek |
| `update` | dataTableId, dataTableRowId, dataTableData | Aktualizuje řádek (sloučí data) |
| `remove` | dataTableId, dataTableRowId | Smaže řádek |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Aktualizuje při nalezení shody, jinak vloží |

## Příklad – nalezení řádků

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

## Příklad – vložení řádku

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

## Příklad – spočítání řádků

Spočítejte řádky odpovídající podmínce v jediném uzlu namísto `getAll` → If/Else → Map.

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

Výsledek je dostupný jako `$activeAdults.count`. Prázdný nebo vynechaný filtr spočítá všechny řádky.

### Operátory filtru pro find a count

Ve filtru `find` nebo `count` prostá hodnota znamená rovnost; objektová hodnota aplikuje operátor:

| Operátor | Význam |
|----------|---------|
| `$eq` (nebo prostá hodnota) | Rovná se |
| `$ne` | Nerovná se |
| `$gt`, `$gte`, `$lt`, `$lte` | Porovnání větší/menší (numerické pro sloupce typu `number`, jinak textové) |
| `$contains` | Podřetězec bez rozlišení velikosti písmen |
| `$in` | Hodnota je v daném poli |

Příklad kombinující několik operátorů: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Neznámé operátory jsou ignorovány. Filtry `upsert` stále používají hodnoty s přesnou shodou pro nalezení řádku k aktualizaci.

Můžete také filtrovat podle metadat řádku — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — která jsou uložena jako skutečné sloupce, nikoli uvnitř vašich dat. Pro data předávejte plnou hodnotu pro porovnání rozsahu (např. `{"created_at": {"$gt": "2026-06-04"}}`) nebo použijte `$contains` pro částečnou textovou shodu (např. `{"created_at": {"$contains": "2026-06-04"}}`). Pokud se některý z vašich vlastních sloupců jmenuje stejně jako pole metadat, má datový sloupec přednost.

## Přístup k výstupu

- `$nodeLabel.success` – Logický stav úspěchu
- `$nodeLabel.rows` – Pole řádků (find, getAll)
- `$nodeLabel.row` – Objekt jednoho řádku (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` – Přístup ke konkrétní hodnotě sloupce
- `$nodeLabel.count` – Počet řádků (vrácené řádky pro find/getAll; celkový počet odpovídajících řádků pro count)
- `$nodeLabel.id` – UUID řádku (insert, update, remove)
- `$nodeLabel.found` – Logická hodnota (getById)
- `$nodeLabel.operation` – Název operace (např. `count`; `insert`/`update` pro upsert)

## Nevyžaduje přihlašovací údaje

Na rozdíl od externích integrací pracuje DataTable s interní databází Heym. Oprávnění vlastníka workflow jsou kontrolována automaticky.

## Vytvořeno AI asistentem

Když [AI asistent](../reference/ai-assistant.md#data-tables) nebo [Chat](../tabs/chat-tab.md) sestaví tento uzel, vybere nebo vytvoří tabulku společně s vámi a zapíše přesné názvy sloupců tabulky do `dataTableData` a `dataTableFilter`.

## Související

- [Karta DataTable](../tabs/datatable-tab.md) – Vytváření a správa tabulek
- [Uzel Grist](./grist-node.md) – Integrace externích tabulek
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe výrazů pro dynamické hodnoty

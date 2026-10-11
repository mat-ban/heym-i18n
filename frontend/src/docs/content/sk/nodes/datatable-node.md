# DataTable

Uzol **DataTable** číta, zapisuje a spravuje dáta v Heym DataTables. Použite ho na CRUD operácie s prvostranným štruktúrovaným úložiskom bez potreby externých prihlasovacích údajov.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable z [karty DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operácia: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID riadku (pre getById, update, remove) |
| `dataTableData` | JSON string | Hodnoty stĺpcov: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filter (find/upsert/count). `find` a `count` podporujú operátory `{"age": {"$gt": 18}}`; `upsert` používa presnú zhodu `{"column_name": "value"}` |
| `dataTableSort` | string | Stĺpec na zoradenie, predpona `-` pre zostupné poradie |
| `dataTableLimit` | number | Maximálny počet vrátených riadkov (predvolené: 100) |

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|----------------|-------------|
| `find` | dataTableId | Nájde riadky zodpovedajúce voliteľnému filtru operátorov s voliteľným zoradením/limitom |
| `getAll` | dataTableId | Získa všetky riadky s voliteľným zoradením/limitom |
| `count` | dataTableId | Spočíta riadky zodpovedajúce voliteľnému filtru operátorov (počíta sa v databáze; vráti iba číslo) |
| `getById` | dataTableId, dataTableRowId | Získa jeden riadok podľa UUID |
| `insert` | dataTableId, dataTableData | Vloží nový riadok |
| `update` | dataTableId, dataTableRowId, dataTableData | Aktualizuje riadok (zlúči dáta) |
| `remove` | dataTableId, dataTableRowId | Odstráni riadok |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Aktualizuje, ak sa nájde zhoda, inak vloží |

## Príklad – Nájdenie riadkov

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

## Príklad – Vloženie riadku

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

## Príklad – Spočítanie riadkov

Spočítajte riadky zodpovedajúce podmienke v jednom uzle namiesto `getAll` → If/Else → Map.

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

Výsledok je dostupný ako `$activeAdults.count`. Prázdny alebo vynechaný filter spočíta všetky riadky.

### Operátory filtra pre find a count

Vo filtri `find` alebo `count` jednoduchá hodnota znamená rovná sa; hodnota objektu aplikuje operátor:

| Operátor | Význam |
|----------|---------|
| `$eq` (alebo jednoduchá hodnota) | Rovná sa |
| `$ne` | Nerovná sa |
| `$gt`, `$gte`, `$lt`, `$lte` | Porovnania väčšie/menšie (číselné pre stĺpce typu `number`, inak textové) |
| `$contains` | Zhoda podreťazca bez rozlišovania veľkosti písmen |
| `$in` | Hodnota sa nachádza v danom poli |

Príklad kombinujúci niekoľko: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Neznáme operátory sa ignorujú. Filtre `upsert` stále používajú hodnoty s presnou zhodou na nájdenie riadku na aktualizáciu.

Môžete tiež filtrovať podľa metadát riadku — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — ktoré sú uložené ako skutočné stĺpce, nie vo vašich dátach. Pre dátumy zadajte úplnú hodnotu pre porovnania rozsahu (napr. `{"created_at": {"$gt": "2026-06-04"}}`) alebo použite `$contains` pre čiastočnú zhodu textu (napr. `{"created_at": {"$contains": "2026-06-04"}}`). Ak sa jeden z vašich vlastných stĺpcov volá rovnako ako pole metadát, prednosť má dátový stĺpec.

## Prístup k výstupu

- `$nodeLabel.success` – Boolean stav úspechu
- `$nodeLabel.rows` – Pole riadkov (find, getAll)
- `$nodeLabel.row` – Objekt jedného riadku (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` – Prístup ku konkrétnej hodnote stĺpca
- `$nodeLabel.count` – Počet riadkov (vrátené riadky pre find/getAll; celkový počet zhôd pre count)
- `$nodeLabel.id` – UUID riadku (insert, update, remove)
- `$nodeLabel.found` – Boolean (getById)
- `$nodeLabel.operation` – Názov operácie (napr. `count`; `insert`/`update` pre upsert)

## Bez potreby prihlasovacích údajov

Na rozdiel od externých integrácií DataTable pracuje s internou databázou Heym. Prístupové oprávnenia vlastníka workflowu sa kontrolujú automaticky.

## Vytvorené AI asistentom

Keď [AI asistent](../reference/ai-assistant.md#data-tables) alebo [Chat](../tabs/chat-tab.md) vytvorí tento uzol, vyberie alebo vytvorí tabuľku s vami a zapíše presné názvy stĺpcov tabuľky do `dataTableData` a `dataTableFilter`.

## Súvisiace

- [Karta DataTable](../tabs/datatable-tab.md) – Vytváranie a správa tabuliek
- [Uzol Grist](./grist-node.md) – Integrácia externej tabuľky
- [Expression DSL](../reference/expression-dsl.md) – Syntax výrazov pre dynamické hodnoty

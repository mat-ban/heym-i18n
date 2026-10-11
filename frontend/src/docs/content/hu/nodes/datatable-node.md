# DataTable

A **DataTable** csomópont adatokat olvas, ír és kezel a Heym DataTables szolgáltatásban. Elsődleges, strukturált tárolón végzett CRUD-műveletekhez használható külső hitelesítési adatok nélkül.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable a [DataTable lapról](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Művelet: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | Sor UUID-ja (getById, update, remove esetén) |
| `dataTableData` | JSON string | Oszlopértékek: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Szűrő (find/upsert/count). A `find` és a `count` támogatja az operátorokat: `{"age": {"$gt": 18}}`; az `upsert` pontos egyezést használ: `{"column_name": "value"}` |
| `dataTableSort` | string | Rendezési oszlop, a `-` előtag csökkenő sorrendet jelent |
| `dataTableLimit` | number | Visszaadott sorok maximális száma (alapértelmezés: 100) |

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|----------------|-------------|
| `find` | dataTableId | Operátorszűrőnek megfelelő sorok keresése opcionális rendezéssel/limittel |
| `getAll` | dataTableId | Az összes sor lekérése opcionális rendezéssel/limittel |
| `count` | dataTableId | Operátorszűrőnek megfelelő sorok megszámlálása (az adatbázisban számol; csak egy számot ad vissza) |
| `getById` | dataTableId, dataTableRowId | Egyetlen sor lekérése UUID alapján |
| `insert` | dataTableId, dataTableData | Új sor beszúrása |
| `update` | dataTableId, dataTableRowId, dataTableData | Sor frissítése (összefésüli az adatokat) |
| `remove` | dataTableId, dataTableRowId | Sor törlése |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Frissítés, ha talál egyezést, egyébként beszúrás |

## Példa - Sorok keresése

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

## Példa - Sor beszúrása

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

## Példa - Sorok megszámlálása

Egy feltételnek megfelelő sorok megszámlálása egyetlen csomópontban a `getAll` → If/Else → Map helyett.

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

Az eredmény a `$activeAdults.count` értéken keresztül érhető el. Az üres vagy elhagyott szűrő minden sort megszámol.

### A find és count szűrőoperátorai

A `find` vagy `count` szűrőben egy egyszerű érték egyenlőséget jelent; egy objektumérték operátort alkalmaz:

| Operátor | Jelentés |
|----------|---------|
| `$eq` (vagy egyszerű érték) | Egyenlő |
| `$ne` | Nem egyenlő |
| `$gt`, `$gte`, `$lt`, `$lte` | Nagyobb/kisebb összehasonlítások (számszerű a `number` típusú oszlopoknál, egyébként szöveges) |
| `$contains` | Kis- és nagybetűt nem megkülönböztető részstring-egyezés |
| `$in` | Az érték szerepel a megadott tömbben |

Példa több operátor kombinálására: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Az ismeretlen operátorokat a rendszer figyelmen kívül hagyja. Az `upsert` szűrők továbbra is pontos egyezésű értékeket használnak a frissítendő sor megtalálásához.

A sor metaadataira is szűrhet — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` —, amelyek valódi oszlopokként tárolódnak, nem az adatai között. Dátumok esetén adjon meg teljes értéket a tartomány-összehasonlításhoz (pl. `{"created_at": {"$gt": "2026-06-04"}}`), vagy használja a `$contains` operátort részleges szövegegyezéshez (pl. `{"created_at": {"$contains": "2026-06-04"}}`). Ha az Ön egyik oszlopa ugyanazt a nevet viseli, mint egy metaadat-mező, az adatoszlop élvez elsőbbséget.

## Kimenet elérése

- `$nodeLabel.success` - Logikai sikerállapot
- `$nodeLabel.rows` - Sorok tömbje (find, getAll)
- `$nodeLabel.row` - Egyetlen sor objektuma (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Egy adott oszlopérték elérése
- `$nodeLabel.count` - Sorok száma (a find/getAll esetén a visszaadott sorok; a count esetén az egyező sorok összesen)
- `$nodeLabel.id` - Sor UUID-ja (insert, update, remove)
- `$nodeLabel.found` - Logikai érték (getById)
- `$nodeLabel.operation` - Művelet neve (pl. `count`; upsert esetén `insert`/`update`)

## Nem szükséges hitelesítési adat

A külső integrációkkal ellentétben a DataTable a Heym belső adatbázisán működik. A workflow tulajdonosának hozzáférési jogosultságait a rendszer automatikusan ellenőrzi.

## Az AI Asszisztens által létrehozva

Amikor az [AI Asszisztens](../reference/ai-assistant.md#data-tables) vagy a [Chat](../tabs/chat-tab.md) létrehozza ezt a csomópontot, Önnel együtt választja ki vagy hozza létre a táblát, és a tábla pontos oszlopneveit írja a `dataTableData` és a `dataTableFilter` mezőkbe.

## Kapcsolódó

- [DataTable lap](../tabs/datatable-tab.md) - Táblák létrehozása és kezelése
- [Grist csomópont](./grist-node.md) - Külső táblázatintegráció
- [Expression DSL](../reference/expression-dsl.md) - Kifejezés-szintaxis dinamikus értékekhez

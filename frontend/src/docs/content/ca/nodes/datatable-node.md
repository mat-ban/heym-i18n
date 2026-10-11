# DataTable

El node **DataTable** llegeix, escriu i gestiona dades a les taules de dades de Heym. Utilitzeu-lo per a operacions CRUD sobre emmagatzematge estructurat propi sense necessitat de credencials externes.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `dataTableId` | UUID | Taula de dades de la [pestanya Taula de dades](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operació: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID de la fila (per a getById, update, remove) |
| `dataTableData` | JSON string | Valors de les columnes: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtre (find/upsert/count). `find` i `count` admeten operadors `{"age": {"$gt": 18}}`; `upsert` utilitza coincidència exacta `{"column_name": "value"}` |
| `dataTableSort` | string | Columna d'ordenació, prefix `-` per a ordre descendent |
| `dataTableLimit` | number | Nombre màxim de files retornades (per defecte: 100) |

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|----------------|-------------|
| `find` | dataTableId | Troba files que coincideixin amb un filtre d'operadors opcional, amb ordenació i límit opcionals |
| `getAll` | dataTableId | Obté totes les files amb ordenació i límit opcionals |
| `count` | dataTableId | Compta les files que coincideixin amb un filtre d'operadors opcional (es compta a la base de dades; retorna només un número) |
| `getById` | dataTableId, dataTableRowId | Obté una sola fila pel seu UUID |
| `insert` | dataTableId, dataTableData | Insereix una fila nova |
| `update` | dataTableId, dataTableRowId, dataTableData | Actualitza la fila (fusiona les dades) |
| `remove` | dataTableId, dataTableRowId | Elimina una fila |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Actualitza si es troba una coincidència; en cas contrari, insereix |

## Exemple - Trobar files

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

## Exemple - Inserir una fila

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

## Exemple - Comptar files

Compteu les files que compleixin una condició en un sol node, en lloc de `getAll` → If/Else → Map.

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

El resultat està disponible com a `$activeAdults.count`. Un filtre buit o omès compta totes les files.

### Operadors de filtre per a find i count

En un filtre `find` o `count`, un valor simple significa igualtat; un valor d'objecte aplica un operador:

| Operador | Significat |
|----------|---------|
| `$eq` (o un valor simple) | Igual a |
| `$ne` | Diferent de |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparacions major/menor que (numèriques per a columnes de tipus `number`, altrament text) |
| `$contains` | Coincidència de subcadena sense distinció de majúscules i minúscules |
| `$in` | El valor és dins de la matriu donada |

Exemple que en combina diversos: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Els operadors desconeguts s'ignoren. Els filtres d'`upsert` encara utilitzen valors de coincidència exacta per trobar la fila a actualitzar.

També podeu filtrar per les metadades de la fila — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — que s'emmagatzemen com a columnes reals en lloc de dins de les vostres dades. Per a dates, passeu un valor complet per a comparacions de rang (p. ex. `{"created_at": {"$gt": "2026-06-04"}}`) o utilitzeu `$contains` per a una coincidència de text parcial (p. ex. `{"created_at": {"$contains": "2026-06-04"}}`). Si una de les vostres columnes té el mateix nom que un camp de metadades, la columna de dades té prioritat.

## Accés a la sortida

- `$nodeLabel.success` - Estat d'èxit booleà
- `$nodeLabel.rows` - Matriu de files (find, getAll)
- `$nodeLabel.row` - Objecte d'una sola fila (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Accés al valor d'una columna específica
- `$nodeLabel.count` - Nombre de files (files retornades per a find/getAll; total de files coincidents per a count)
- `$nodeLabel.id` - UUID de la fila (insert, update, remove)
- `$nodeLabel.found` - Booleà (getById)
- `$nodeLabel.operation` - Nom de l'operació (p. ex. `count`; `insert`/`update` per a upsert)

## No cal cap credencial

A diferència de les integracions externes, DataTable opera sobre la base de dades interna de Heym. Els permisos d'accés del propietari del workflow es comproven automàticament.
## Creat per l'Assistent d'IA

Quan l'[Assistent d'IA](../reference/ai-assistant.md#data-tables) o el [Chat](../tabs/chat-tab.md) construeix aquest node, selecciona o crea la taula amb vosaltres i escriu els noms exactes de les columnes de la taula a `dataTableData` i `dataTableFilter`.

## Relacionat

- [Pestanya Taula de dades](../tabs/datatable-tab.md) - Creeu i gestioneu taules
- [Node Grist](./grist-node.md) - Integració amb fulls de càlcul externs
- [Expression DSL](../reference/expression-dsl.md) - Sintaxi d'expressions per a valors dinàmics

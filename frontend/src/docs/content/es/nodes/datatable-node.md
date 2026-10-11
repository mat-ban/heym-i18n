# DataTable

El nodo **DataTable** lee, escribe y gestiona datos en las DataTables de Heym. Utilícelo para operaciones CRUD sobre almacenamiento estructurado propio sin necesidad de credenciales externas.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable de la [pestaña DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Operación: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID de la fila (para getById, update, remove) |
| `dataTableData` | JSON string | Valores de columna: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Filtro (find/upsert/count). `find` y `count` admiten operadores `{"age": {"$gt": 18}}`; `upsert` utiliza coincidencia exacta `{"column_name": "value"}` |
| `dataTableSort` | string | Columna de ordenación, prefijo `-` para descendente |
| `dataTableLimit` | number | Máximo de filas devueltas (predeterminado: 100) |

## Operaciones

| Operación | Campos requeridos | Descripción |
|-----------|----------------|-------------|
| `find` | dataTableId | Busca filas que coincidan con un filtro de operadores opcional, con ordenación y límite opcionales |
| `getAll` | dataTableId | Obtiene todas las filas con ordenación y límite opcionales |
| `count` | dataTableId | Cuenta las filas que coincidan con un filtro de operadores opcional (contadas en la base de datos; devuelve solo un número) |
| `getById` | dataTableId, dataTableRowId | Obtiene una única fila por UUID |
| `insert` | dataTableId, dataTableData | Inserta una nueva fila |
| `update` | dataTableId, dataTableRowId, dataTableData | Actualiza la fila (fusiona los datos) |
| `remove` | dataTableId, dataTableRowId | Elimina una fila |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Actualiza si se encuentra una coincidencia, inserta en caso contrario |

## Ejemplo: buscar filas

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

## Ejemplo: insertar fila

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

## Ejemplo: contar filas

Cuente las filas que coincidan con una condición en un único nodo, en lugar de `getAll` → If/Else → Map.

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

El resultado está disponible como `$activeAdults.count`. Un filtro vacío u omitido cuenta todas las filas.

### Operadores de filtro para find y count

En un filtro de `find` o `count`, un valor simple significa igualdad; un valor de tipo objeto aplica un operador:

| Operador | Significado |
|----------|---------|
| `$eq` (o un valor simple) | Igual a |
| `$ne` | Distinto de |
| `$gt`, `$gte`, `$lt`, `$lte` | Comparaciones mayor/menor que (numéricas para columnas tipadas como `number`, en caso contrario texto) |
| `$contains` | Coincidencia de subcadena sin distinguir mayúsculas y minúsculas |
| `$in` | El valor está en el array indicado |

Ejemplo que combina varios: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Los operadores desconocidos se ignoran. Los filtros de `upsert` siguen utilizando valores de coincidencia exacta para encontrar la fila que se debe actualizar.

También puede filtrar por los metadatos de la fila — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — que se almacenan como columnas reales en lugar de dentro de sus datos. Para fechas, introduzca un valor completo para las comparaciones de rango (p. ej. `{"created_at": {"$gt": "2026-06-04"}}`) o utilice `$contains` para una coincidencia parcial de texto (p. ej. `{"created_at": {"$contains": "2026-06-04"}}`). Si una de sus propias columnas tiene el mismo nombre que un campo de metadatos, prevalece la columna de datos.

## Acceso a la salida

- `$nodeLabel.success` - Estado booleano de éxito
- `$nodeLabel.rows` - Array de filas (find, getAll)
- `$nodeLabel.row` - Objeto de fila única (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Acceso al valor de una columna específica
- `$nodeLabel.count` - Número de filas (filas devueltas para find/getAll; total de filas coincidentes para count)
- `$nodeLabel.id` - UUID de la fila (insert, update, remove)
- `$nodeLabel.found` - Booleano (getById)
- `$nodeLabel.operation` - Nombre de la operación (p. ej. `count`; `insert`/`update` para upsert)

## No se requieren credenciales

A diferencia de las integraciones externas, DataTable opera sobre la base de datos interna de Heym. Los permisos de acceso del propietario del workflow se verifican automáticamente.
## Creado por el AI Assistant

Cuando el [AI Assistant](../reference/ai-assistant.md#data-tables) o el [Chat](../tabs/chat-tab.md) crean este nodo, seleccionan o crean la tabla junto con usted y escriben los nombres exactos de las columnas de la tabla en `dataTableData` y `dataTableFilter`.

## Relacionado

- [DataTable Tab](../tabs/datatable-tab.md) - Cree y gestione tablas
- [Grist Node](./grist-node.md) - Integración con hojas de cálculo externas
- [Expression DSL](../reference/expression-dsl.md) - Sintaxis de expresiones para valores dinámicos

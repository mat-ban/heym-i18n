# Supabase

El nodo **Supabase** lee y modifica tablas expuestas por la API PostgREST de un proyecto de Supabase. Utilícelo cuando desee que un workflow acceda al estado de una aplicación respaldada por SQL sin escribir solicitudes HTTP manualmente.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Supabase |
| Salida | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Supabase desde [Credenciales](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Operación: `select`, `insert`, `update`, `upsert` o `delete` |
| `supabaseSchema` | expression | Nombre del esquema. Si se deja en blanco, el nodo utiliza el esquema predeterminado de la credencial y, a continuación, `public`. |
| `supabaseTable` | expression | Nombre simple de la tabla que se va a consultar o modificar. Coloque el esquema en `supabaseSchema`, no aquí. |
| `supabaseSelectColumns` | expression | Lista de selección de PostgREST separada por comas para `select` (predeterminado `*`) |
| `supabaseFilter` | expression | Objeto de filtro JSON. Admite coincidencias exactas, además de objetos de operadores y grupos lógicos; por ejemplo, `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` o `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Número máximo de filas que se devolverán para `select` (`0` = obtener todas las filas coincidentes con paginación del lado del servidor; los valores negativos recurren a `100`) |
| `supabaseOrderBy` | expression | Columna opcional por la que ordenar en `select` |
| `supabaseAscending` | boolean | Orden ascendente cuando es `true`, descendente cuando es `false` |
| `supabaseRowsInputMode` | string | Para `insert`/`upsert`: modo `raw` de array JSON o `auto` para asignar automáticamente la única entrada ascendente |
| `supabaseDataInputMode` | string | Para `update`: modo `raw` de objeto JSON o `auto` para asignar automáticamente la única entrada ascendente |
| `supabaseIgnoredInputFields` | string | Nombres de campos opcionales separados por comas que se omitirán durante la asignación automática de los datos de entrada |
| `supabaseRows` | expression | Array JSON de objetos de fila para `insert` y `upsert` |
| `supabaseOnConflict` | expression | Columnas de destino de conflicto opcionales separadas por comas para `upsert`; por ejemplo, `id` o `tenant_id,email` |
| `supabaseData` | expression | Objeto JSON de valores de columna actualizados para `update` |

## Configuración de la credencial

Cree una credencial de **Supabase** en la [pestaña Credenciales](../tabs/credentials-tab.md) con:

1. Su **URL del proyecto**; por ejemplo, `https://your-project.supabase.co`
2. Una **clave de API** con acceso a las tablas que este workflow debe utilizar
3. Un **esquema predeterminado** opcional (de forma predeterminada, `public`)

El nodo se comunica con el endpoint PostgREST de Supabase en `/rest/v1/<table>`.
Utilice `supabaseTable` únicamente para la tabla, como `users` o `profiles`. No introduzca allí `schema.table`, `rpc/...` ni otras rutas de API.

Cuando se selecciona una credencial de Supabase válida, el editor puede descubrir las tablas expuestas y las columnas de las tablas directamente desde los metadatos OpenAPI de PostgREST. Utilice el menú desplegable de **tablas descubiertas** para elegir una tabla y los **chips de columnas** bajo **Select Columns** para crear rápidamente una lista de selección.

## Operaciones

| Operación | Campos obligatorios | Descripción |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Lee filas con filtros de coincidencia exacta, límite y ordenación opcionales |
| `insert` | `supabaseTable`, `supabaseRows` o asignación automática de entrada | Inserta una o varias filas |
| `update` | `supabaseTable`, `supabaseData` o asignación automática de entrada, `supabaseFilter` | Actualiza las filas que coinciden con el filtro |
| `upsert` | `supabaseTable`, `supabaseRows` o asignación automática de entrada | Inserta o fusiona filas utilizando la semántica de upsert de Supabase. Utilice `supabaseOnConflict` cuando necesite un destino de conflicto explícito. |
| `delete` | `supabaseTable`, `supabaseFilter` | Elimina las filas que coinciden con el filtro |

## Sintaxis de filtros

`supabaseFilter` compila JSON estructurado en parámetros de consulta de PostgREST.

- Coincidencia exacta: `{"status":"active"}`
- Comparación: `{"created_at":{"gte":"2026-01-01"}}`
- Pertenencia: `{"status":{"in":["active","paused"]}}`
- Coincidencia de patrón: `{"email":{"ilike":"*@example.com"}}`
- OR lógico: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- AND lógico: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Para varios operadores sobre el mismo campo, se recomienda utilizar un grupo lógico:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Paginación

`select` ahora realiza una paginación real del lado del servidor contra PostgREST.

- `supabaseLimit: "0"` obtiene todas las filas coincidentes página a página
- Los valores de `supabaseLimit` superiores a 1000 se distribuyen automáticamente en varias solicitudes
- Los resultados se fusionan de nuevo en un único array `.rows` y `.count` conserva el número total de filas coincidentes

Al leer tablas grandes, establezca un `supabaseOrderBy` estable para mantener predecibles los límites de página.
## Auto-map Input

Para `insert`, `upsert` y `update`, cambie el nodo a **Auto-map input** cuando el único nodo
upstream ya genere la estructura que desea escribir.

- Un único objeto se convierte en una fila o en un payload de actualización
- Un array de objetos se convierte en muchas filas para `insert` / `upsert`
- Un objeto upstream con un array `rows` reutiliza ese array directamente
- `supabaseIgnoredInputFields` le permite descartar campos como `id`, `created_at` o `success`

## Output Reference

| Campo de salida | Tipo | Descripción |
|-------------|------|-------------|
| `.rows` | array | Objetos de fila devueltos |
| `.count` | number | Número de filas devueltas o afectadas |
| `.success` | boolean | Indica si la operación se realizó correctamente |

## Ejemplo – Select Active Users

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Acceso a la salida: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Ejemplo – Upsert a Profile Row

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Relacionado

- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Credentials Tab](../tabs/credentials-tab.md) – Añadir credenciales de Supabase
- [Third-Party Integrations](../reference/integrations.md) – Configuración de credenciales de integración

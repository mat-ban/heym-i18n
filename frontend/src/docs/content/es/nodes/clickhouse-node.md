# ClickHouse

El nodo **ClickHouse** ejecuta operaciones CRUD, de conteo y de SQL sin procesar contra una base de datos [ClickHouse](https://clickhouse.com/) externa a través de su interfaz HTTP. Utilícelo para escribir eventos en una tabla de ClickHouse desde un workflow, leer o agregar datos analíticos, o ejecutar SQL arbitrario, sin necesidad de escribir solicitudes HTTP manualmente.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | ClickHouse |
| Salida | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de ClickHouse desde [Credenciales](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operación: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` o `upsert` |
| `clickhouseTable` | expression | Nombre simple de la tabla. Obligatorio para todas las operaciones excepto `query`. |
| `clickhouseQuery` | expression | SQL sin procesar para `query`. `SELECT`/`SHOW`/`DESCRIBE` devuelven filas; otras sentencias se ejecutan como comandos. |
| `clickhouseFilter` | expression | Objeto JSON de filtros de igualdad, por ejemplo `{"status":"active"}`. Utilizado por `find`, `count`, `update` y `remove`. Los valores se parametrizan. |
| `clickhouseLimit` | string | Número máximo de filas para `find` / `getAll` (`0` = sin límite, sin cláusula LIMIT). Valor predeterminado `100`. |
| `clickhouseSort` | expression | `column` opcional o `column ASC\|DESC` para `find` |
| `clickhouseRowId` | expression | Valor comparado contra la columna `id` de la tabla para `getById` |
| `clickhouseInputMode` | string | Para `insert`/`upsert`: modo `raw` de array JSON o modo `selective` de campo clave/valor |
| `clickhouseData` | expression | Array JSON de objetos de fila para `insert`/`upsert`, u objeto JSON de valores de columna para `update` |
| `clickhouseMappings` | array | Pares `{key, value}` utilizados cuando `clickhouseInputMode` es `selective` |

## Configuración de la credencial

Cree una credencial de **ClickHouse** en la [pestaña Credenciales](../tabs/credentials-tab.md) con:

1. **Host** — el host HTTP sin esquema, por ejemplo `your-instance.clickhouse.cloud`
2. **Port** — el puerto de la interfaz HTTP (`8443` para HTTPS, `8123` para HTTP)
3. **Username** / **Password** — de forma predeterminada `default` con contraseña vacía
4. **Database** — de forma predeterminada `default`
5. **Secure** — habilítelo para HTTPS (ClickHouse Cloud)

El nodo se conecta a través del cliente HTTP oficial `clickhouse-connect`. Utilice **Test connection** en el diálogo de la credencial para verificar la accesibilidad antes de guardar.

## Operaciones

| Operación | Campos obligatorios | Descripción |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Ejecuta SQL sin procesar. `SELECT` devuelve `{rows, count}`; otras sentencias devuelven `{result}`. |
| `find` | `clickhouseTable` | Lee filas con filtros de igualdad, ordenación y límite opcionales |
| `getAll` | `clickhouseTable` | Lee filas hasta el límite sin filtro |
| `count` | `clickhouseTable` | Cuenta filas, opcionalmente filtradas |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Lee una sola fila por su columna `id` |
| `insert` | `clickhouseTable`, `clickhouseData` o mappings | Inserta una o más filas |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Actualiza las filas coincidentes mediante `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Elimina las filas coincidentes mediante `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` o mappings | Inserta filas (asume una tabla `ReplacingMergeTree`) |

## Sintaxis de filtros

`clickhouseFilter` es un objeto JSON plano de comprobaciones de igualdad de columnas. Los valores se envían como parámetros de consulta vinculados, por lo que son seguros contra inyección.

```json
{ "status": "active", "tenant_id": 42 }
```

Esto se compila como `WHERE status = {…:String} AND tenant_id = {…:Int64}`. En el generador de filtros solo se admite la igualdad; para rangos, uniones o agregaciones, utilice la operación `query` con SQL sin procesar.

## Modos de entrada (insert / upsert)

- **Array JSON** (`raw`): proporcione un array JSON de objetos de fila en `clickhouseData`. Las claves que falten en una fila determinada se insertan como `NULL`. El conjunto de columnas es la unión de las claves de todas las filas.
- **Clave-valor** (`selective`): después de seleccionar una credencial y una tabla, el editor detecta las columnas de la tabla y crea un campo de valor por columna. Se inserta una fila por ejecución; cada valor admite expresiones.
## Mutaciones y semántica de ClickHouse

ClickHouse es una base de datos OLAP, por lo que las escrituras a nivel de fila se comportan de forma diferente a las de un almacén OLTP:

- **`update`** emite `ALTER TABLE … UPDATE` y **`remove`** emite `DELETE FROM`. Ambas son **mutaciones asíncronas**: se aplican de forma eventual y son comparativamente costosas. Se recomienda priorizar escrituras por lotes sobre mutaciones frecuentes de una sola fila.
- **`upsert`** realiza un `INSERT`. Para obtener un comportamiento de fusión por clave, respalde la tabla con un motor `ReplacingMergeTree`.
- **`getById`** asume que la tabla tiene una columna `id`.
- `update` y `remove` requieren un `clickhouseFilter` no vacío para evitar mutaciones de tabla completa.

## Referencia de salida

| Campo de salida | Tipo | Descripción |
|-------------|------|-------------|
| `.rows` | array | Objetos de fila devueltos (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Recuento de filas (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Fila única o `null` (`getById`) |
| `.result` | string | Resumen del comando para `query` que no sea SELECT |
| `.success` | boolean | Indica si la operación se realizó correctamente |

## Ejemplo: insertar un evento

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Ejemplo: contar usuarios activos

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Acceso a la salida: `$activeCount.count`.

## Ejemplo: consulta de informe diario

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Acceso a la salida: `$dailyReport.rows`, `$dailyReport.count`.

## Relacionado

- [Tipos de nodo](../reference/node-types.md): descripción general de todos los tipos de nodo
- [Pestaña Credenciales](../tabs/credentials-tab.md): añadir credenciales de ClickHouse
- [Integraciones de terceros](../reference/integrations.md): configuración de credenciales de integración

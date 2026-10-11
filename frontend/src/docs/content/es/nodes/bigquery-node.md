# BigQuery

El nodo **BigQuery** ejecuta consultas SQL e inserta filas en conjuntos de datos de Google BigQuery a través de la API REST v2 de BigQuery. Utilícelo para consultar grandes conjuntos de datos analíticos o transmitir filas a tablas desde los datos del workflow.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | BigQuery (OAuth2) |
| Salida | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de BigQuery desde [Credenciales](../tabs/credentials-tab.md) |
| `bqOperation` | string | Operación: `query` o `insertRows` |
| `bqProjectId` | expression | ID del proyecto de Google Cloud (ej.: `my-gcp-project`) |
| `bqQuery` | expression | Cadena de consulta SQL. Obligatoria para `query`. |
| `bqMaxResults` | string | Número máximo de filas devueltas por `query` (predeterminado `1000`). |
| `bqDatasetId` | expression | ID del conjunto de datos (ej.: `my_dataset`). Obligatorio para `insertRows`. |
| `bqTableId` | expression | ID de la tabla (ej.: `my_table`). Obligatorio para `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Para `insertRows`: **Raw** = array JSON completo; **Selective** = una sola fila como pares de campo clave-valor. |
| `bqRows` | expression | Array JSON de objetos de fila para el modo raw (ej.: `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Pares clave-valor para el modo selective. Cada clave es un nombre de columna; cada valor es una expresión. |

## Configuración de la credencial

BigQuery utiliza un modelo **OAuth2 "Bring Your Own App"**. Usted proporciona sus propias credenciales OAuth2 de Google Cloud.

**Configuración del backend:** Establezca **`FRONTEND_URL`** en el backend de Heym con la URL pública de la aplicación (la dirección que los usuarios escriben en el navegador), ej.: `https://your-heym-domain`. El URI de redirección de OAuth es siempre `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Vaya a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite **BigQuery API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccione **Web application**.
3. En **Authorized redirect URIs**, añada exactamente: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Copie el **Client ID** y el **Client Secret**.
5. En Heym Dashboard → **Credenciales** → **Nuevo** → seleccione **BigQuery (OAuth2)**.
6. Introduzca el Client ID, el Client Secret y un nombre, luego haga clic en **Connect** para completar el consentimiento OAuth2 en una ventana emergente del navegador.

Los tokens se renuevan automáticamente en segundo plano — no se requiere gestión manual de tokens.

## Operaciones

| Operación | Campos obligatorios | Descripción |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Ejecuta una consulta SQL y devuelve filas |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows o bqMappings | Inserta una o más filas a través de la API streaming insertAll |

## Referencia de salida

| Operación | Campo de salida | Tipo | Descripción |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Array de objetos de fila (nombre de columna → valor) |
| `query` | `.total` | number | Número de filas devueltas |
| `query` | `.schema` | array | Campos del esquema de la tabla |
| `insertRows` | `.insertedCount` | number | Número de filas insertadas correctamente |
| `insertRows` | `.errors` | array | Errores de inserción por fila (vacío si todo fue exitoso) |

## Ejemplo – Ejecutar una consulta

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Acceso a la salida: `$getUsers.rows` (array de objetos de fila), `$getUsers.rows[0].email`, `$getUsers.total`.

## Ejemplo – Insertar una fila

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir credencial OAuth2 de BigQuery
- [Google Sheets](./google-sheets-node.md) – Patrón OAuth2 similar para datos de hojas de cálculo
- [Integraciones de terceros](../reference/integrations.md) – Configuración de credenciales de integración
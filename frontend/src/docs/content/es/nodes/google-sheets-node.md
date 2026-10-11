# Google Sheets

El nodo **Google Sheets** lee, escribe y gestiona datos en hojas de cálculo de Google Sheets mediante OAuth2. Utilícelo para automatizar workflows de hojas de cálculo: leer informes, registrar resultados, actualizar seguimientos y mucho más.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Google Sheets (OAuth2) |
| Salida | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Google Sheets desde [Credenciales](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operación: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID de la hoja de cálculo o URL completa de Google Sheets |
| `gsSheetName` | expression | Nombre de la pestaña de la hoja (ej.: `Sheet1`). No es obligatorio para `getSheetInfo`. |
| `gsStartRow` | expression | Para `readRange`: primera fila de datos con base 1 (con `gsHasHeader`, la fila 1 es el encabezado). |
| `gsMaxRows` | expression | Para `readRange`: máximo de filas de datos (0 = todas). |
| `gsHasHeader` | boolean | Para `readRange`: tratar la fila 1 como nombres de columna cuando es true. |
| `gsUpdateRow` | expression | Solo para `updateRange`: número de fila de la hoja con base 1 que se va a actualizar (columnas A–Z); si no se define, se utiliza `gsStartRow`. No es batchUpdate: es un único PUT de la API de values. |
| `gsRange` | expression | Rango en notación A1 (ej.: `A1:D100`). Ejemplos heredados; el editor utiliza campos de fila para lectura/actualización. |
| `gsKeepHeader` | boolean | Solo para `clearRange`: cuando es true, se conserva la fila 1 y se borran las filas de datos inferiores (columnas A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Solo para `appendRows`: **Bottom** agrega después de la última fila con datos; **Top** inserta nuevas filas directamente debajo de la fila 1 (desplaza los datos hacia abajo). |
| `gsValuesInputMode` | `raw` \| `selective` | Para `appendRows` / `updateRange`: **Raw** = array JSON completo; **Selective** = una fila de la hoja, solo campos de columna (sin etiquetas A1). |
| `gsValuesSelectiveCols` | string | Modo Selective: número de columnas (A–Z). |
| `gsValues` | expression | Array JSON 2D de valores (ej.: `[["Name","Age"],["Alice",30]]`). Obligatorio para `appendRows`, `updateRange`. |

## ID de la hoja de cálculo

El campo `gsSpreadsheetId` acepta tanto el **ID sin formato** (la cadena alfanumérica larga entre `/d/` y `/edit` en una URL de Google Sheets) como la **URL completa**: Heym extrae el ID automáticamente.

## Configuración de la credencial

Google Sheets utiliza un modelo **OAuth2 "Bring Your Own App"**. Usted proporciona sus propias credenciales OAuth2 de Google Cloud.

**Configuración del backend:** establezca **`FRONTEND_URL`** en el backend de Heym con la URL pública de la aplicación (la dirección que los usuarios escriben en el navegador), ej.: `https://your-heym-domain`. El URI de redirección de OAuth siempre es `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`; se deriva únicamente de esta configuración, no de los encabezados de la solicitud.

1. Vaya a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → habilite **Google Sheets API**.
2. Vaya a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccione **Web application**.
3. En **Authorized redirect URIs**, agregue exactamente: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (por ejemplo, `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copie el **Client ID** y el **Client Secret**.
5. En Heym Dashboard → **Credenciales** → **Nueva** → seleccione **Google Sheets (OAuth2)**.
6. Introduzca el Client ID, el Client Secret y un nombre; luego haga clic en **Connect** para completar el consentimiento de OAuth2 en una ventana emergente del navegador.

Los tokens se renuevan automáticamente en segundo plano; no se requiere gestión manual de tokens.

## Operaciones

| Operación | Campos obligatorios | Descripción |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Lee valores de celdas (A–Z); `gsRange` opcional en flujos heredados |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Agrega filas al final (`gsAppendPlacement` append) o debajo de la fila 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Sobrescribe fila(s) a partir de `gsUpdateRow` (A–Z); un JSON de varias filas escribe filas consecutivas |
| `clearRange` | gsSpreadsheetId, gsSheetName | Borra todos los valores de las columnas A–Z de la pestaña; el `gsKeepHeader` opcional conserva la primera fila |
| `getSheetInfo` | gsSpreadsheetId | Obtiene el título de la hoja de cálculo y la lista de pestañas |
## Referencia de salida

| Operación | Campo de salida | Tipo | Descripción |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objetos de fila: claves de columna (nombres de encabezado o A, B, …) más **`rowIndex`** (fila de la hoja basada en 1) |
| `readRange` | `.total` | number | Número de filas de datos devueltas |
| `appendRows` | `.updatedRange` | string | Rango escrito |
| `appendRows` | `.updates` | number | Número de filas añadidas |
| `updateRange` | `.updatedRange` | string | Rango escrito |
| `updateRange` | `.updatedCells` | number | Número de celdas actualizadas |
| `clearRange` | `.clearedRange` | string | Rango que se ha limpiado |
| `getSheetInfo` | `.title` | string | Título de la hoja de cálculo |
| `getSheetInfo` | `.sheets` | array | Lista de objetos `{sheetId, title}` |

Todas las operaciones incluyen `success: true` y `operation: "<name>"` en la salida.

## Ejemplo: Leer un rango

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Acceso a la salida: `$readReport.rows[0]` (primer objeto de fila de datos), `$readReport.rows[0].Name` (columna por encabezado), `$readReport.rows[0].rowIndex` (fila de la hoja basada en 1).

## Ejemplo: Añadir una fila desde la entrada

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Relacionado

- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir credencial OAuth2 de Google Sheets
- [Integraciones de terceros](../reference/integrations.md#google-sheets-oauth2) – Configuración de credenciales de Google Sheets

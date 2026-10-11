# Google Sheets

El node **Google Sheets** llegeix, escriu i gestiona dades en fulls de càlcul de Google Sheets mitjançant OAuth2. Utilitzeu-lo per automatitzar workflows de fulls de càlcul: llegir informes, registrar resultats, actualitzar seguiments i molt més.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Google Sheets (OAuth2) |
| Sortida | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Google Sheets des de [Credencials](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operació: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID del full de càlcul o URL completa de Google Sheets |
| `gsSheetName` | expression | Nom de la pestanya del full (p. ex. `Sheet1`). No és necessari per a `getSheetInfo`. |
| `gsStartRow` | expression | Per a `readRange`: primera fila de dades (basada en 1) (amb `gsHasHeader`, la fila 1 és la capçalera). |
| `gsMaxRows` | expression | Per a `readRange`: nombre màxim de files de dades (0 = totes). |
| `gsHasHeader` | boolean | Per a `readRange`: tracta la fila 1 com a noms de columna quan és true. |
| `gsUpdateRow` | expression | Només per a `updateRange`: número de fila del full (basat en 1) a actualitzar (columnes A–Z); si no s'estableix, s'utilitza `gsStartRow`. No és batchUpdate: una única crida PUT a l'API de valors. |
| `gsRange` | expression | Rang en notació A1 (p. ex. `A1:D100`). Exemples llegats; l'editor utilitza camps de fila per a lectura/actualització. |
| `gsKeepHeader` | boolean | Només per a `clearRange`: quan és true, es conserva la fila 1 i s'esborren les files de dades següents (columnes A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Només per a `appendRows`: **Bottom** afegeix després de l'última fila amb dades; **Top** insereix files noves directament sota la fila 1 (desplaça les dades cap avall). |
| `gsValuesInputMode` | `raw` \| `selective` | Per a `appendRows` / `updateRange`: **Raw** = array JSON complet; **Selective** = una fila del full, només camps de columna (sense etiquetes A1). |
| `gsValuesSelectiveCols` | string | Mode selective: nombre de columnes (A–Z). |
| `gsValues` | expression | Array JSON 2D de valors (p. ex. `[["Name","Age"],["Alice",30]]`). Obligatori per a `appendRows`, `updateRange`. |

## ID del full de càlcul

El camp `gsSpreadsheetId` accepta tant l'**ID simple** (la cadena alfanumèrica llarga entre `/d/` i `/edit` en una URL de Google Sheets) com l'**URL completa**: Heym extreu l'ID automàticament.

## Configuració de la credencial

Google Sheets utilitza un model **OAuth2 "Bring Your Own App"**. Heu de proporcionar les vostres pròpies credencials OAuth2 de Google Cloud.

**Configuració del backend:** Establiu **`FRONTEND_URL`** al backend de Heym amb l'URL pública de l'aplicació (l'adreça que els usuaris escriuen al navegador), p. ex. `https://your-heym-domain`. L'URI de redirecció OAuth sempre és `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback`: es deriva únicament d'aquesta configuració, no de les capçaleres de la petició.

1. Aneu a [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activeu **Google Sheets API**.
2. Aneu a **Credentials** → **Create Credentials** → **OAuth client ID** → seleccioneu **Web application**.
3. A **Authorized redirect URIs**, afegiu exactament: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (per exemple `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copieu el **Client ID** i el **Client Secret**.
5. Al Tauler de Heym → **Credencials** → **Nova** → seleccioneu **Google Sheets (OAuth2)**.
6. Introduïu el Client ID, el Client Secret i un nom, i feu clic a **Connect** per completar el consentiment OAuth2 en una finestra emergent del navegador.

Els tokens es renoven automàticament en segon pla: no cal cap gestió manual de tokens.

## Operacions

| Operació | Camps obligatoris | Descripció |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Llegeix valors de cel·les (A–Z); `gsRange` opcional en workflows llegats |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Afegeix files a la part inferior (`gsAppendPlacement` append) o sota la fila 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Sobreescriu files començant a `gsUpdateRow` (A–Z); un JSON de diverses files escriu files consecutives |
| `clearRange` | gsSpreadsheetId, gsSheetName | Esborra tots els valors de les columnes A–Z de la pestanya; `gsKeepHeader` opcional conserva la primera fila |
| `getSheetInfo` | gsSpreadsheetId | Obté el títol del full de càlcul i la llista de pestanyes |
## Referència de sortida

| Operació | Camp de sortida | Tipus | Descripció |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objectes de fila: claus de columna (noms d'encapçalament o A, B, …) més **`rowIndex`** (fila del full basada en 1) |
| `readRange` | `.total` | number | Nombre de files de dades retornades |
| `appendRows` | `.updatedRange` | string | Interval escrit |
| `appendRows` | `.updates` | number | Nombre de files afegides |
| `updateRange` | `.updatedRange` | string | Interval escrit |
| `updateRange` | `.updatedCells` | number | Nombre de cel·les actualitzades |
| `clearRange` | `.clearedRange` | string | Interval que s'ha esborrat |
| `getSheetInfo` | `.title` | string | Títol del full de càlcul |
| `getSheetInfo` | `.sheets` | array | Llista d'objectes `{sheetId, title}` |

Totes les operacions inclouen `success: true` i `operation: "<name>"` a la sortida.

## Exemple – Llegir un interval

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

Accediu a la sortida: `$readReport.rows[0]` (primer objecte de fila de dades), `$readReport.rows[0].Name` (columna per encapçalament), `$readReport.rows[0].rowIndex` (fila del full basada en 1).

## Exemple – Afegir una fila des de l'entrada

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

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Credentials Tab](../tabs/credentials-tab.md) – Afegiu una credencial OAuth2 de Google Sheets
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Configuració de la credencial de Google Sheets

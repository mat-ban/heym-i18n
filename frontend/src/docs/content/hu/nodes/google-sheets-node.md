# Google Sheets

A **Google Sheets** csomópont OAuth2-n keresztül olvassa, írja és kezeli a Google Sheets táblázatokban lévő adatokat. Használja táblázatkezelési workflow-k automatizálására — jelentések olvasása, eredmények naplózása, követők frissítése és egyebek.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Hitelesítési adatok | Google Sheets (OAuth2) |
| Kimenet | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets hitelesítési adatok a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `gsOperation` | string | Művelet: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Táblázat azonosítója vagy teljes Google Sheets URL |
| `gsSheetName` | expression | Munkalap fül neve (pl. `Sheet1`). A `getSheetInfo` művelethez nem szükséges. |
| `gsStartRow` | expression | A `readRange` művelethez: 1-alapú első adatsor (a `gsHasHeader` beállítással az 1. sor a fejléc). |
| `gsMaxRows` | expression | A `readRange` művelethez: adatsorok maximális száma (0 = összes). |
| `gsHasHeader` | boolean | A `readRange` művelethez: ha igaz, az 1. sor oszlopnevekként kerül értelmezésre. |
| `gsUpdateRow` | expression | Csak az `updateRange` művelethez: a frissítendő 1-alapú munkalapsor száma (A–Z oszlopok); ha nincs beállítva, a `gsStartRow` kerül használatra. Nem batchUpdate — egyetlen values API PUT. |
| `gsRange` | expression | A1 jelölésű tartomány (pl. `A1:D100`). Régi példák; a szerkesztő sor mezőket használ az olvasáshoz/frissítéshez. |
| `gsKeepHeader` | boolean | Csak a `clearRange` művelethez: ha igaz, az 1. sor megmarad, és az alatta lévő adatsorok törlődnek (A–Z oszlopok). |
| `gsAppendPlacement` | `append` \| `prepend` | Csak az `appendRows` művelethez: a **Bottom** az utolsó adattal rendelkező sor után ad hozzá; a **Top** közvetlenül az 1. sor alá szúr be új sorokat (az adatokat lefelé tolja). |
| `gsValuesInputMode` | `raw` \| `selective` | Az `appendRows` / `updateRange` művelethez: a **Raw** = teljes JSON tömb; a **Selective** = egy munkalapsor, csak oszlopmezők (A1 címkék nélkül). |
| `gsValuesSelectiveCols` | string | Selective mód: oszlopok száma (A–Z). |
| `gsValues` | expression | Értékek JSON 2D tömbje (pl. `[["Name","Age"],["Alice",30]]`). Az `appendRows`, `updateRange` műveletekhez kötelező. |

## Táblázat azonosítója

A `gsSpreadsheetId` mező vagy a **csupasz azonosítót** (a Google Sheets URL-ben a `/d/` és `/edit` közötti hosszú alfanumerikus karakterláncot) vagy a **teljes URL-t** elfogadja — a Heym automatikusan kinyeri az azonosítót.

## Hitelesítési adatok beállítása

A Google Sheets az **OAuth2 "Bring Your Own App"** modellt használja. Ön biztosítja a saját Google Cloud OAuth2 hitelesítési adatait.

**Backend konfiguráció:** Állítsa be a **`FRONTEND_URL`** értéket a Heym backendben az alkalmazás nyilvános URL-jére (arra a címre, amelyet a felhasználók a böngészőben beírnak), pl. `https://your-heym-domain`. Az OAuth átirányítási URI mindig `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — kizárólag ebből a beállításból származik, nem a kérés fejléceiből.

1. Nyissa meg a [Google Cloud Console](https://console.cloud.google.com) oldalt → **APIs & Services** → **Enable APIs** → engedélyezze a **Google Sheets API**-t.
2. Nyissa meg a **Credentials** → **Create Credentials** → **OAuth client ID** menüpontot → válassza a **Web application** lehetőséget.
3. Az **Authorized redirect URIs** alatt pontosan adja hozzá: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (például `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Másolja ki a **Client ID** és **Client Secret** értékeket.
5. A Heym Dashboardon → **Credentials** → **New** → válassza a **Google Sheets (OAuth2)** lehetőséget.
6. Adja meg a Client ID, Client Secret értékeket és egy nevet, majd kattintson a **Connect** gombra az OAuth2 hozzájárulás böngésző felugró ablakban történő befejezéséhez.

A tokenek automatikusan frissülnek a háttérben — nincs szükség manuális token kezelésre.

## Műveletek

| Művelet | Kötelező mezők | Leírás |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Cellaértékek olvasása (A–Z); opcionális `gsRange` a régi folyamatokban |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Sorok hozzáadása alulra (`gsAppendPlacement` append) vagy az 1. sor alá (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Sor(ok) felülírása a `gsUpdateRow` értéktől kezdve (A–Z); a többsoros JSON egymást követő sorokat ír |
| `clearRange` | gsSpreadsheetId, gsSheetName | A fül A–Z oszlopaiban lévő összes érték törlése; az opcionális `gsKeepHeader` megtartja az első sort |
| `getSheetInfo` | gsSpreadsheetId | A táblázat címének és a munkalap fülek listájának lekérése |

## Kimenet referenciája

| Művelet | Kimeneti mező | Típus | Leírás |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Sor objektumok: oszlopkulcsok (fejlécnevek vagy A, B, …) plusz **`rowIndex`** (1-alapú munkalapsor) |
| `readRange` | `.total` | number | A visszaadott adatsorok száma |
| `appendRows` | `.updatedRange` | string | Az írt tartomány |
| `appendRows` | `.updates` | number | A hozzáfűzött sorok száma |
| `updateRange` | `.updatedRange` | string | Az írt tartomány |
| `updateRange` | `.updatedCells` | number | A frissített cellák száma |
| `clearRange` | `.clearedRange` | string | A törölt tartomány |
| `getSheetInfo` | `.title` | string | A táblázat címe |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` objektumok listája |

Minden művelet tartalmazza a `success: true` és `operation: "<name>"` értékeket a kimenetben.
## Példa – Tartomány olvasása

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

A kimenet elérése: `$readReport.rows[0]` (az első adatsor objektuma), `$readReport.rows[0].Name` (oszlop a fejléc alapján), `$readReport.rows[0].rowIndex` (1-alapú munkalapsor).

## Példa – Sor hozzáfűzése bemenetből

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

## Kapcsolódó tartalmak

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Google Sheets OAuth2 hitelesítési adatok hozzáadása
- [Külső integrációk](../reference/integrations.md#google-sheets-oauth2) – Google Sheets hitelesítési adatok beállítása

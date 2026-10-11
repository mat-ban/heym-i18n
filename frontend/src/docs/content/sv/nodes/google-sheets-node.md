# Google Sheets

Noden **Google Sheets** läser, skriver och hanterar data i Google Sheets-kalkylblad via OAuth2. Den används för att automatisera arbetsflöden i kalkylblad — läsa rapporter, logga resultat, uppdatera uppföljningslistor med mera.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | Google Sheets (OAuth2) |
| Utdata | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `gsOperation` | string | Åtgärd: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Kalkylblads-ID eller fullständig Google Sheets-URL |
| `gsSheetName` | expression | Namn på kalkylbladsflik (t.ex. `Sheet1`). Krävs inte för `getSheetInfo`. |
| `gsStartRow` | expression | För `readRange`: första datarad (1-baserad) (med `gsHasHeader` är rad 1 rubriken). |
| `gsMaxRows` | expression | För `readRange`: maximalt antal datarader (0 = alla). |
| `gsHasHeader` | boolean | För `readRange`: behandla rad 1 som kolumnnamn när värdet är true. |
| `gsUpdateRow` | expression | Endast för `updateRange`: 1-baserat kalkylbladsradnummer att uppdatera (kolumnerna A–Z); om det inte anges används `gsStartRow`. Inte batchUpdate — en values API PUT. |
| `gsRange` | expression | Intervall i A1-notation (t.ex. `A1:D100`). Äldre exempel; redigeraren använder radfält för läsning/uppdatering. |
| `gsKeepHeader` | boolean | Endast för `clearRange`: när värdet är true behålls rad 1 och dataraderna under rensas (kolumnerna A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Endast för `appendRows`: **Bottom** lägger till efter sista raden med data; **Top** infogar nya rader direkt under rad 1 (skjuter ned data). |
| `gsValuesInputMode` | `raw` \| `selective` | För `appendRows` / `updateRange`: **Raw** = fullständig JSON-array; **Selective** = en kalkylbladsrad, endast kolumnfält (inga A1-etiketter). |
| `gsValuesSelectiveCols` | string | Selective-läge: antal kolumner (A–Z). |
| `gsValues` | expression | JSON 2D-array med värden (t.ex. `[["Name","Age"],["Alice",30]]`). Krävs för `appendRows`, `updateRange`. |

## Kalkylblads-ID

Fältet `gsSpreadsheetId` accepterar antingen **enbart ID:t** (den långa alfanumeriska strängen mellan `/d/` och `/edit` i en Google Sheets-URL) eller den **fullständiga URL:en** — Heym extraherar ID:t automatiskt.

## Konfiguration av autentiseringsuppgifter

Google Sheets använder en **OAuth2-modell av typen "Bring Your Own App"**. Egna OAuth2-uppgifter från Google Cloud tillhandahålls.

**Backend-konfiguration:** Ange **`FRONTEND_URL`** på Heym-backenden till appens publika URL (adressen som användare skriver i webbläsaren), t.ex. `https://your-heym-domain`. OAuth-omdirigerings-URI:n är alltid `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — den härleds endast från denna inställning, inte från begäransrubriker.

1. Gå till [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktivera **Google Sheets API**.
2. Gå till **Credentials** → **Create Credentials** → **OAuth client ID** → välj **Web application**.
3. Under **Authorized redirect URIs**, lägg till exakt: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (till exempel `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopiera **Client ID** och **Client Secret**.
5. I Heym Dashboard → **Autentiseringsuppgifter** → **New** → välj **Google Sheets (OAuth2)**.
6. Ange Client ID, Client Secret och ett namn, klicka sedan på **Connect** för att slutföra OAuth2-samtycket i en webbläsar-popup.

Token förnyas automatiskt i bakgrunden — ingen manuell tokenhantering krävs.

## Åtgärder

| Åtgärd | Obligatoriska fält | Beskrivning |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Läs cellvärden (A–Z); valfritt `gsRange` i äldre flöden |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Lägg till rader längst ned (`gsAppendPlacement` append) eller under rad 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Skriv över rad(er) med start vid `gsUpdateRow` (A–Z); flerrads-JSON skriver till på varandra följande rader |
| `clearRange` | gsSpreadsheetId, gsSheetName | Rensa alla värden i kolumnerna A–Z för fliken; valfritt `gsKeepHeader` behåller första raden |
| `getSheetInfo` | gsSpreadsheetId | Hämta kalkylbladets titel och lista över kalkylbladsflikar |

## Referens för utdata

| Åtgärd | Utdatafält | Typ | Beskrivning |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Radobjekt: kolumnnycklar (rubriknamn eller A, B, …) plus **`rowIndex`** (1-baserad kalkylbladsrad) |
| `readRange` | `.total` | number | Antal returnerade datarader |
| `appendRows` | `.updatedRange` | string | Intervall som skrevs |
| `appendRows` | `.updates` | number | Antal tillagda rader |
| `updateRange` | `.updatedRange` | string | Intervall som skrevs |
| `updateRange` | `.updatedCells` | number | Antal uppdaterade celler |
| `clearRange` | `.clearedRange` | string | Intervall som rensades |
| `getSheetInfo` | `.title` | string | Kalkylbladets titel |
| `getSheetInfo` | `.sheets` | array | Lista med `{sheetId, title}`-objekt |

Alla åtgärder innehåller `success: true` och `operation: "<name>"` i utdata.
## Exempel – Läs ett intervall

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

Åtkomst till utdata: `$readReport.rows[0]` (första dataradobjektet), `$readReport.rows[0].Name` (kolumn via rubrik), `$readReport.rows[0].rowIndex` (1-baserat arkradsindex).

## Exempel – Lägg till en rad från indata

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till Google Sheets OAuth2-autentiseringsuppgift
- [Tredjepartsintegrationer](../reference/integrations.md#google-sheets-oauth2) – Konfiguration av Google Sheets-autentiseringsuppgifter

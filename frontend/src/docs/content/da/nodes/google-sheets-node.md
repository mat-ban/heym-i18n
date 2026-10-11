# Google Sheets

**Google Sheets**-noden læser, skriver og administrerer data i Google Sheets-regneark via OAuth2. Den kan bruges til at automatisere spreadsheet-workflows - læse rapporter, logge resultater, opdatere trackere og meget mere.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operation: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Spreadsheet-ID eller fuld Google Sheets-URL |
| `gsSheetName` | expression | Navn på regnearkets faneblad (f.eks. `Sheet1`). Kræves ikke for `getSheetInfo`. |
| `gsStartRow` | expression | For `readRange`: 1-baseret første datarække (med `gsHasHeader` er række 1 headeren). |
| `gsMaxRows` | expression | For `readRange`: maksimalt antal datarækker (0 = alle). |
| `gsHasHeader` | boolean | For `readRange`: behandl række 1 som kolonnenavne, når sandt. |
| `gsUpdateRow` | expression | Kun for `updateRange`: 1-baseret regnearksrække, der skal opdateres (kolonner A–Z); hvis ikke angivet, bruges `gsStartRow`. Ikke batchUpdate - én values API PUT. |
| `gsRange` | expression | A1-notation for område (f.eks. `A1:D100`). Ældre eksempler; editoren bruger rækkefelter til læsning/opdatering. |
| `gsKeepHeader` | boolean | Kun for `clearRange`: når sandt, bevares række 1, og datarækkerne under ryddes (kolonner A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Kun for `appendRows`: **Bottom** tilføjer efter sidste række med data; **Top** indsætter nye rækker direkte under række 1 (skubber data ned). |
| `gsValuesInputMode` | `raw` \| `selective` | For `appendRows` / `updateRange`: **Raw** = fuldt JSON-array; **Selective** = én regnearksrække, kun kolonnefelter (ingen A1-labels). |
| `gsValuesSelectiveCols` | string | Selective-tilstand: antal kolonner (A–Z). |
| `gsValues` | expression | 2D-JSON-array med værdier (f.eks. `[["Navn","Alder"],["Alice",30]]`). Kræves for `appendRows`, `updateRange`. |

## Spreadsheet-ID

Feltet `gsSpreadsheetId` accepterer enten det **bare ID** (den lange alfanumeriske streng mellem `/d/` og `/edit` i en Google Sheets-URL) eller den **fulde URL** - Heym udtrækker ID'et automatisk.

## Opsætning af legitimationsoplysninger

Google Sheets bruger en **OAuth2 "Bring Your Own App"**-model. Man skal angive egne Google Cloud OAuth2-legitimationsoplysninger.

**Backend-konfiguration:** Angiv **`FRONTEND_URL`** på Heym-backend'en til appens offentlige URL (den adresse, som brugerne indtaster i browseren), f.eks. `https://your-heym-domain`. OAuth-omdirigerings-URI'en er altid `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` - den afledes kun fra denne indstilling, ikke fra request-headers.

1. Gå til [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → aktiver **Google Sheets API**.
2. Gå til **Credentials** → **Create Credentials** → **OAuth client ID** → vælg **Web application**.
3. Under **Authorized redirect URIs** tilføjes præcist: `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (f.eks. `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopier **Client ID** og **Client Secret**.
5. I Heym Dashboard → **Legitimationsoplysninger** → **Ny** → vælg **Google Sheets (OAuth2)**.
6. Indtast Client ID, Client Secret og et navn, og klik på **Connect** for at fuldføre OAuth2-samtykket i en browser-popup.

Tokens opdateres automatisk i baggrunden - ingen manuel tokenhåndtering er nødvendig.

## Operationer

| Operation | Påkrævede felter | Beskrivelse |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Læs celleværdier (A–Z); valgfri `gsRange` i ældre flows |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Tilføj rækker i bunden (`gsAppendPlacement` append) eller under række 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Overskriv række(r) startende ved `gsUpdateRow` (A–Z); multi-row JSON skriver på hinanden følgende rækker |
| `clearRange` | gsSpreadsheetId, gsSheetName | Ryd alle værdier i kolonnerne A–Z for fanebladet; valgfri `gsKeepHeader` bevarer første række |
| `getSheetInfo` | gsSpreadsheetId | Hent spreadsheet-titel og liste over regnearksfaneblade |

## Output-reference

| Operation | Output-felt | Type | Beskrivelse |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Rækkeobjekter: kolonne-nøgler (headernavne eller A, B, …) plus **`rowIndex`** (1-baseret regnearksrække) |
| `readRange` | `.total` | number | Antal returnerede datarækker |
| `appendRows` | `.updatedRange` | string | Skrevet område |
| `appendRows` | `.updates` | number | Antal tilføjede rækker |
| `updateRange` | `.updatedRange` | string | Skrevet område |
| `updateRange` | `.updatedCells` | number | Antal opdaterede celler |
| `clearRange` | `.clearedRange` | string | Ryddet område |
| `getSheetInfo` | `.title` | string | Spreadsheet-titel |
| `getSheetInfo` | `.sheets` | array | Liste over `{sheetId, title}`-objekter |

Alle operationer inkluderer `success: true` og `operation: "<name>"` i outputtet.
## Eksempel – Læs et område

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

Adgang til output: `$readReport.rows[0]` (første datarække-objekt), `$readReport.rows[0].Name` (kolonne via header), `$readReport.rows[0].rowIndex` (1-baseret ark-række).

## Eksempel – Tilføj en række fra input

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

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj Google Sheets OAuth2-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md#google-sheets-oauth2) – Opsætning af Google Sheets-legitimationsoplysninger

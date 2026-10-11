# Google Sheets

De **Google Sheets**-node leest, schrijft en beheert gegevens in Google Sheets-spreadsheets via OAuth2. Gebruik deze node om spreadsheet-workflows te automatiseren — rapporten lezen, resultaten loggen, trackers bijwerken en meer.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Google Sheets (OAuth2) |
| Uitvoer | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `gsOperation` | string | Bewerking: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Spreadsheet-ID of volledige Google Sheets-URL |
| `gsSheetName` | expression | Naam van het werkbladtabblad (bijv. `Sheet1`). Niet vereist voor `getSheetInfo`. |
| `gsStartRow` | expression | Voor `readRange`: 1-gebaseerde eerste gegevensrij (met `gsHasHeader` is rij 1 de kopregel). |
| `gsMaxRows` | expression | Voor `readRange`: maximaal aantal gegevensrijen (0 = alle). |
| `gsHasHeader` | boolean | Voor `readRange`: behandel rij 1 als kolomnamen wanneer true. |
| `gsUpdateRow` | expression | Alleen voor `updateRange`: 1-gebaseerd rijnummer in het werkblad om bij te werken (kolommen A–Z); indien niet ingesteld, wordt `gsStartRow` gebruikt. Geen batchUpdate — één values API PUT. |
| `gsRange` | expression | Bereik in A1-notatie (bijv. `A1:D100`). Legacy-voorbeelden; de editor gebruikt rijvelden voor lezen/bijwerken. |
| `gsKeepHeader` | boolean | Alleen voor `clearRange`: wanneer true blijft rij 1 behouden en worden de gegevensrijen eronder gewist (kolommen A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Alleen voor `appendRows`: **Bottom** voegt toe na de laatste rij met gegevens; **Top** voegt nieuwe rijen direct onder rij 1 in (schuift gegevens naar beneden). |
| `gsValuesInputMode` | `raw` \| `selective` | Voor `appendRows` / `updateRange`: **Raw** = volledige JSON-array; **Selective** = één werkbladrij, alleen kolomvelden (geen A1-labels). |
| `gsValuesSelectiveCols` | string | Selective-modus: aantal kolommen (A–Z). |
| `gsValues` | expression | JSON 2D-array met waarden (bijv. `[["Name","Age"],["Alice",30]]`). Vereist voor `appendRows`, `updateRange`. |

## Spreadsheet-ID

Het veld `gsSpreadsheetId` accepteert zowel het **bare ID** (de lange alfanumerieke tekenreeks tussen `/d/` en `/edit` in een Google Sheets-URL) als de **volledige URL** — Heym extraheert het ID automatisch.

## Referentie instellen

Google Sheets gebruikt een **OAuth2 "Bring Your Own App"**-model. U levert uw eigen Google Cloud OAuth2-referenties aan.

**Backend-configuratie:** Stel **`FRONTEND_URL`** op de Heym-backend in op de openbare URL van de app (het adres dat gebruikers in de browser typen), bijv. `https://your-heym-domain`. De OAuth-redirect-URI is altijd `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — deze wordt uitsluitend afgeleid van deze instelling, niet van request-headers.

1. Ga naar [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → schakel **Google Sheets API** in.
2. Ga naar **Credentials** → **Create Credentials** → **OAuth client ID** → selecteer **Web application**.
3. Voeg onder **Authorized redirect URIs** exact toe: `{uw FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (bijvoorbeeld `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopieer het **Client ID** en **Client Secret**.
5. Ga in het Heym Dashboard naar **Referenties** → **Nieuw** → selecteer **Google Sheets (OAuth2)**.
6. Voer het Client ID, Client Secret en een naam in en klik op **Verbinden** om de OAuth2-toestemming in een browserpop-up te voltooien.

Tokens worden automatisch op de achtergrond vernieuwd — handmatig tokenbeheer is niet nodig.

## Bewerkingen

| Bewerking | Vereiste velden | Beschrijving |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Celwaarden lezen (A–Z); optioneel `gsRange` in legacy-flows |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Rijen toevoegen onderaan (`gsAppendPlacement` append) of onder rij 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Rij(en) overschrijven vanaf `gsUpdateRow` (A–Z); multi-row JSON schrijft opeenvolgende rijen |
| `clearRange` | gsSpreadsheetId, gsSheetName | Alle waarden in kolommen A–Z van het tabblad wissen; optioneel behoudt `gsKeepHeader` de eerste rij |
| `getSheetInfo` | gsSpreadsheetId | Spreadsheettitel en lijst met werkbladtabbladen ophalen |

## Uitvoerreferentie

| Bewerking | Uitvoerveld | Type | Beschrijving |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Rij-objecten: kolomsleutels (kopregelnamen of A, B, …) plus **`rowIndex`** (1-gebaseerde werkbladrij) |
| `readRange` | `.total` | number | Aantal geretourneerde gegevensrijen |
| `appendRows` | `.updatedRange` | string | Geschreven bereik |
| `appendRows` | `.updates` | number | Aantal toegevoegde rijen |
| `updateRange` | `.updatedRange` | string | Geschreven bereik |
| `updateRange` | `.updatedCells` | number | Aantal bijgewerkte cellen |
| `clearRange` | `.clearedRange` | string | Het gewiste bereik |
| `getSheetInfo` | `.title` | string | Spreadsheettitel |
| `getSheetInfo` | `.sheets` | array | Lijst met `{sheetId, title}`-objecten |

Alle bewerkingen bevatten `success: true` en `operation: "<name>"` in de uitvoer.
## Voorbeeld – Een bereik lezen

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

Uitvoer openen: `$readReport.rows[0]` (eerste gegevensrij-object), `$readReport.rows[0].Name` (kolom op basis van koptekst), `$readReport.rows[0].rowIndex` (op 1 gebaseerde werkbladrij).

## Voorbeeld – Een rij toevoegen vanuit invoer

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

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Credentials Tab](../tabs/credentials-tab.md) – Google Sheets OAuth2-referentie toevoegen
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Google Sheets-referentie instellen

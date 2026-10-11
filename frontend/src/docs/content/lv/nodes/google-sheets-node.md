# Google Sheets

**Google Sheets** mezgls lasa, raksta un pārvalda datus Google Sheets izklājlapās, izmantojot OAuth2. Izmantojiet to, lai automatizētu izklājlapu darbplūsmas — lasītu atskaites, reģistrētu rezultātus, atjauninātu izsekotājus un veiktu citus uzdevumus.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Google Sheets (OAuth2) |
| Izvade | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `gsOperation` | string | Darbība: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Izklājlapas ID vai pilns Google Sheets URL |
| `gsSheetName` | expression | Izklājlapas cilnes nosaukums (piem., `Sheet1`). Nav nepieciešams `getSheetInfo` darbībai. |
| `gsStartRow` | expression | Darbībai `readRange`: pirmā datu rinda (sākot no 1; ar `gsHasHeader` 1. rinda ir galvene). |
| `gsMaxRows` | expression | Darbībai `readRange`: maksimālais datu rindu skaits (0 = visas). |
| `gsHasHeader` | boolean | Darbībai `readRange`: ja true, 1. rinda tiek uzskatīta par kolonnu nosaukumiem. |
| `gsUpdateRow` | expression | Tikai darbībai `updateRange`: izklājlapas rindas numurs (sākot no 1), kas jāatjaunina (kolonnas A–Z); ja nav norādīts, tiek izmantots `gsStartRow`. Nav batchUpdate — viens values API PUT pieprasījums. |
| `gsRange` | expression | Diapazons A1 notācijā (piem., `A1:D100`). Mantotie piemēri; redaktors lasīšanai/atjaunināšanai izmanto rindu laukus. |
| `gsKeepHeader` | boolean | Tikai darbībai `clearRange`: ja true, 1. rinda tiek saglabāta un datu rindas zem tās tiek notīrītas (kolonnas A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Tikai darbībai `appendRows`: **Bottom** pievieno pēc pēdējās rindas ar datiem; **Top** ievieto jaunas rindas tieši zem 1. rindas (pabīda datus uz leju). |
| `gsValuesInputMode` | `raw` \| `selective` | Darbībām `appendRows` / `updateRange`: **Raw** = pilns JSON masīvs; **Selective** = viena izklājlapas rinda, tikai kolonnu lauki (bez A1 apzīmējumiem). |
| `gsValuesSelectiveCols` | string | Selective režīms: kolonnu skaits (A–Z). |
| `gsValues` | expression | JSON 2D masīvs ar vērtībām (piem., `[["Name","Age"],["Alice",30]]`). Nepieciešams darbībām `appendRows`, `updateRange`. |

## Izklājlapas ID

Lauks `gsSpreadsheetId` pieņem gan **tīro ID** (garo burtciparu virkni starp `/d/` un `/edit` Google Sheets URL), gan **pilnu URL** — Heym automātiski izgūst ID.

## Akreditācijas datu iestatīšana

Google Sheets izmanto **OAuth2 "Bring Your Own App"** modeli. Jūs nodrošināt savus Google Cloud OAuth2 akreditācijas datus.

**Backend konfigurācija:** Iestatiet **`FRONTEND_URL`** Heym backendā uz lietotnes publisko URL (adresi, ko lietotāji ieraksta pārlūkā), piem., `https://your-heym-domain`. OAuth novirzīšanas URI vienmēr ir `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — tas tiek atvasināts tikai no šī iestatījuma, nevis no pieprasījuma galvenēm.

1. Dodieties uz [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → iespējojiet **Google Sheets API**.
2. Dodieties uz **Credentials** → **Create Credentials** → **OAuth client ID** → izvēlieties **Web application**.
3. Sadaļā **Authorized redirect URIs** pievienojiet precīzi: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (piemēram, `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Nokopējiet **Client ID** un **Client Secret**.
5. Heym Dashboard → **Akreditācijas dati** → **New** → izvēlieties **Google Sheets (OAuth2)**.
6. Ievadiet Client ID, Client Secret un nosaukumu, pēc tam noklikšķiniet uz **Connect**, lai pabeigtu OAuth2 piekrišanu pārlūka uznirstošajā logā.

Token tiek atjaunoti automātiski fonā — manuāla token pārvaldība nav nepieciešama.

## Darbības

| Darbība | Nepieciešamie lauki | Apraksts |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Lasīt šūnu vērtības (A–Z); neobligāts `gsRange` mantotajās darbplūsmās |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Pievienot rindas apakšā (`gsAppendPlacement` append) vai zem 1. rindas (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Pārrakstīt rindu(-as), sākot no `gsUpdateRow` (A–Z); vairāku rindu JSON ieraksta secīgas rindas |
| `clearRange` | gsSpreadsheetId, gsSheetName | Notīrīt visas vērtības kolonnās A–Z attiecīgajā cilnē; neobligāais `gsKeepHeader` saglabā pirmo rindu |
| `getSheetInfo` | gsSpreadsheetId | Iegūt izklājlapas nosaukumu un cilņu sarakstu |

## Izvades atsauce

| Darbība | Izvades lauks | Tips | Apraksts |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Rindu objekti: kolonnu atslēgas (galvenes nosaukumi vai A, B, …) plus **`rowIndex`** (izklājlapas rindas numurs, sākot no 1) |
| `readRange` | `.total` | number | Atgriezto datu rindu skaits |
| `appendRows` | `.updatedRange` | string | Ierakstītais diapazons |
| `appendRows` | `.updates` | number | Pievienoto rindu skaits |
| `updateRange` | `.updatedRange` | string | Ierakstītais diapazons |
| `updateRange` | `.updatedCells` | number | Atjaunināto šūnu skaits |
| `clearRange` | `.clearedRange` | string | Notīrītais diapazons |
| `getSheetInfo` | `.title` | string | Izklājlapas nosaukums |
| `getSheetInfo` | `.sheets` | array | Saraksts ar `{sheetId, title}` objektiem |

Visas darbības izvadē iekļauj `success: true` un `operation: "<name>"`.
## Piemērs – Diapazona lasīšana

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

Piekļuve izvadei: `$readReport.rows[0]` (pirmās datu rindas objekts), `$readReport.rows[0].Name` (kolonna pēc galvenes), `$readReport.rows[0].rowIndex` (ar 1 sākošs lapas rindas indekss).

## Piemērs – Rindas pievienošana no ievades

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

## Saistītie resursi

- [Node tipi](../reference/node-types.md) – Visu node tipu pārskats
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Google Sheets OAuth2 akreditācijas datu pievienošana
- [Trešo pušu integrācijas](../reference/integrations.md#google-sheets-oauth2) – Google Sheets akreditācijas datu iestatīšana

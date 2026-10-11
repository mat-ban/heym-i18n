# Google Sheets

**Google Sheets** node loeb, kirjutab ja haldab andmeid Google Sheetsi arvutustabelites OAuth2 kaudu. Kasutage seda arvutustabeli workflow'de automatiseerimiseks — aruannete lugemiseks, tulemuste logimiseks, jälgijate uuendamiseks ja palju muuks.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Google Sheets (OAuth2) |
| Output | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheetsi mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `gsOperation` | string | Toiming: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Arvutustabeli ID või täielik Google Sheetsi URL |
| `gsSheetName` | expression | Lehe tab'i nimi (nt `Sheet1`). Ei ole vajalik toimingu `getSheetInfo` puhul. |
| `gsStartRow` | expression | Toimingu `readRange` puhul: 1-põhine esimene andmerida (kui `gsHasHeader` on seatud, on rida 1 päis). |
| `gsMaxRows` | expression | Toimingu `readRange` puhul: maksimaalne andmeridade arv (0 = kõik). |
| `gsHasHeader` | boolean | Toimingu `readRange` puhul: kui true, käsitletakse rida 1 veerunimedena. |
| `gsUpdateRow` | expression | Ainult toimingu `updateRange` puhul: 1-põhine arvutustabeli rea number, mida uuendada (veerud A–Z); kui pole seatud, kasutatakse `gsStartRow`. Ei ole batchUpdate — üks values API PUT. |
| `gsRange` | expression | A1-notatsiooni vahemik (nt `A1:D100`). Pärandnäited; redaktor kasutab read-/uuendustoimingute jaoks reavälju. |
| `gsKeepHeader` | boolean | Ainult toimingu `clearRange` puhul: kui true, säilitatakse rida 1 ja tühjendatakse andmeread selle all (veerud A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Ainult toimingu `appendRows` puhul: **Bottom** lisab viimase andmerea järele; **Top** lisab uued read vahetult rea 1 alla (nihutab andmeid allapoole). |
| `gsValuesInputMode` | `raw` \| `selective` | Toimingute `appendRows` / `updateRange` puhul: **Raw** = täielik JSON-massiiv; **Selective** = üks arvutustabeli rida, ainult veeruväljad (ilma A1-siltideta). |
| `gsValuesSelectiveCols` | string | Selective-režiim: veergude arv (A–Z). |
| `gsValues` | expression | Väärtuste JSON 2D-massiiv (nt `[["Name","Age"],["Alice",30]]`). Nõutav toimingute `appendRows`, `updateRange` puhul. |

## Arvutustabeli ID

Väli `gsSpreadsheetId` aktsepteerib kas **paljast ID-d** (pikk tähtnumbriline string Google Sheetsi URL-is `/d/` ja `/edit` vahel) või **täielikku URL-i** — Heym eraldab ID automaatselt.

## Mandaadi seadistamine

Google Sheets kasutab **OAuth2 "Bring Your Own App"** mudelit. Esitate oma Google Cloud OAuth2 mandaadid.

**Backendi konfiguratsioon:** Seadke Heymi backendi keskkonnamuutuja **`FRONTEND_URL`** rakenduse avalikuks URL-iks (aadress, mille kasutajad brauseris sisestavad), nt `https://your-heym-domain`. OAuth-i ümbersuunamise URI on alati `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — see tuletatakse ainult sellest seadest, mitte päringu päistest.

1. Minge [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → lubage **Google Sheets API**.
2. Minge **Credentials** → **Create Credentials** → **OAuth client ID** → valige **Web application**.
3. Jaotises **Authorized redirect URIs** lisage täpselt: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (näiteks `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopeerige **Client ID** ja **Client Secret**.
5. Heymi töölaual → **Mandaadid** → **New** → valige **Google Sheets (OAuth2)**.
6. Sisestage Client ID, Client Secret ja nimi, seejärel klõpsake **Connect**, et lõpetada OAuth2 nõusolek brauseri hüpikaknas.

Tokenid uuendatakse taustal automaatselt — käsitsi tokenite haldamine pole vajalik.

## Toimingud

| Operation | Required Fields | Description |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Laeb lahtri väärtused (A–Z); valikuline `gsRange` pärandvoogudes |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Lisab read lõppu (`gsAppendPlacement` append) või rea 1 alla (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Kirjutab üle rea/read alates `gsUpdateRow` (A–Z); mitmerealised JSON-kirjed kirjutavad järjestikused read |
| `clearRange` | gsSpreadsheetId, gsSheetName | Tühjendab kõik väärtused veergudes A–Z tab'i jaoks; valikuline `gsKeepHeader` säilitab esimese rea |
| `getSheetInfo` | gsSpreadsheetId | Tagastab arvutustabeli pealkirja ja lehe tab'ide loendi |

## Väljundi viide

| Operation | Output field | Type | Description |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Reaobjektid: veeruvõtmed (päise nimed või A, B, …) pluss **`rowIndex`** (1-põhine arvutustabeli rida) |
| `readRange` | `.total` | number | Tagastatud andmeridade arv |
| `appendRows` | `.updatedRange` | string | Kirjutatud vahemik |
| `appendRows` | `.updates` | number | Lisatud ridade arv |
| `updateRange` | `.updatedRange` | string | Kirjutatud vahemik |
| `updateRange` | `.updatedCells` | number | Uuendatud lahtrite arv |
| `clearRange` | `.clearedRange` | string | Tühjendatud vahemik |
| `getSheetInfo` | `.title` | string | Arvutustabeli pealkiri |
| `getSheetInfo` | `.sheets` | array | Objektide `{sheetId, title}` loend |

Kõik toimingud sisaldavad väljundis `success: true` ja `operation: "<name>"`.
## Näide – Vahemiku lugemine

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

Väljundi kasutamine: `$readReport.rows[0]` (esimene andmeridade objekt), `$readReport.rows[0].Name` (veerg päise järgi), `$readReport.rows[0].rowIndex` (1-põhine lehe rida).

## Näide – Rea lisamine sisendist

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

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node-tüüpidest
- [Credentials Tab](../tabs/credentials-tab.md) – Google Sheets OAuth2 mandaadi lisamine
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Google Sheetsi mandaadi seadistamine

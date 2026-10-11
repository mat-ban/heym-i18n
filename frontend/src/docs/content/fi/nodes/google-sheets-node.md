# Google Sheets

**Google Sheets** -solmu lukee, kirjoittaa ja hallinnoi tietoja Google Sheets -taulukoissa OAuth2-autentikoinnin avulla. Sitä voidaan käyttää taulukoiden automatisointiin — raporttien lukemiseen, tulosten kirjaamiseen, seurantataulukoiden päivittämiseen ja muihin vastaaviin tehtäviin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tunnistetiedot | Google Sheets (OAuth2) |
| Tuloste | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets -tunnistetiedot kohdasta [Tunnistetiedot](../tabs/credentials-tab.md) |
| `gsOperation` | merkkijono | Toiminto: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | lauseke | Taulukon ID tai koko Google Sheets -URL |
| `gsSheetName` | lauseke | Taulukon välilehden nimi (esim. `Sheet1`). Ei vaadittu `getSheetInfo`-toiminnossa. |
| `gsStartRow` | lauseke | `readRange`: 1-pohjainen ensimmäinen datarivi (kun `gsHasHeader` on tosi, rivi 1 on otsikkorivi). |
| `gsMaxRows` | lauseke | `readRange`: datarivien enimmäismäärä (0 = kaikki). |
| `gsHasHeader` | totuusarvo | `readRange`: käsittele rivi 1 sarakkeiden niminä, kun arvo on tosi. |
| `gsUpdateRow` | lauseke | Vain `updateRange`: 1-pohjainen päivitettävän rivin numero (sarakkeet A–Z); jos ei määritetty, käytetään `gsStartRow`-arvoa. Ei batchUpdate — yksi values API PUT. |
| `gsRange` | lauseke | A1-merkintätapa-alue (esim. `A1:D100`). Vanhentuneita esimerkkejä; editori käyttää rivikenttiä lukemiseen/päivittämiseen. |
| `gsKeepHeader` | totuusarvo | Vain `clearRange`: kun arvo on tosi, rivi 1 säilytetään ja sen alla olevat datarivit tyhjennetään (sarakkeet A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Vain `appendRows`: **Bottom** lisää rivit viimeisen datarivin jälkeen; **Top** lisää rivit suoraan rivin 1 alle (siirtää dataa alaspäin). |
| `gsValuesInputMode` | `raw` \| `selective` | `appendRows` / `updateRange`: **Raw** = täysi JSON-taulukko; **Selective** = yksi taulukkorivi, vain sarakekentät (ei A1-merkintöjä). |
| `gsValuesSelectiveCols` | merkkijono | Selective-tila: sarakkeiden määrä (A–Z). |
| `gsValues` | lauseke | JSON 2D-taulukko arvoista (esim. `[["Nimi","Ikä"],["Liisa",30]]`). Vaaditaan `appendRows`- ja `updateRange`-toiminnoissa. |

## Taulukon ID

Kenttä `gsSpreadsheetId` hyväksyy joko **pelkän ID:n** (pitkä aakkosnumeerinen merkkijono Google Sheets -URL:n `/d/` ja `/edit` välissä) tai **koko URL-osoitteen** — Heym erottaa ID:n automaattisesti.

## Tunnistetietojen määrittäminen

Google Sheets käyttää **OAuth2 "Bring Your Own App"** -mallia. Käyttäjän on annettava omat Google Cloud OAuth2 -tunnistetiedot.

**Taustajärjestelmän asetukset:** Aseta **`FRONTEND_URL`** Heymin taustajärjestelmään sovelluksen julkiseksi URL-osoitteeksi (osoite, jonka käyttäjät kirjoittavat selaimen osoiteriville), esim. `https://your-heym-domain`. OAuth-uudelleenohjausosoite on aina `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — se johdetaan vain tästä asetuksesta, ei pyyntöotsikoista.

1. Siirry [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ota käyttöön **Google Sheets API**.
2. Siirry **Credentials** → **Create Credentials** → **OAuth client ID** → valitse **Web application**.
3. Lisää **Authorized redirect URIs** -kohdan alle tarkalleen: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (esim. `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopioi **Client ID** ja **Client Secret**.
5. Heym Dashboard → **Tunnistetiedot** → **Uusi** → valitse **Google Sheets (OAuth2)**.
6. Syötä Client ID, Client Secret ja nimi, napsauta sitten **Connect** suorittaaksesi OAuth2-suostumuksen selainikkunassa.

Tunnisteet päivittyvät automaattisesti taustalla — manuaalista tunnusten hallintaa ei vaadita.

## Toiminnot

| Toiminto | Pakolliset kentät | Kuvaus |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Lue solujen arvot (A–Z); valinnainen `gsRange` vanhentuneissa workflowissa |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Lisää rivit alareunaan (`gsAppendPlacement` append) tai rivin 1 alle (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Kirjoita rivi(t) yli alkaen rivistä `gsUpdateRow` (A–Z); monirivinen JSON kirjoittaa peräkkäiset rivit |
| `clearRange` | gsSpreadsheetId, gsSheetName | Tyhjennä kaikki arvot sarakkeissa A–Z välilehdellä; valinnainen `gsKeepHeader` säilyttää ensimmäisen rivin |
| `getSheetInfo` | gsSpreadsheetId | Hae taulukon otsikko ja välilehtien luettelo |

## Tulosteviite

| Toiminto | Tulostekenttä | Tyyppi | Kuvaus |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | taulukko | Rivikohteet: sarakeavaimet (otsikkonimet tai A, B, …) plus **`rowIndex`** (1-pohjainen taulukkorivi) |
| `readRange` | `.total` | numero | Palautettujen datarivien määrä |
| `appendRows` | `.updatedRange` | merkkijono | Kirjoitettu alue |
| `appendRows` | `.updates` | numero | Lisättyjen rivien määrä |
| `updateRange` | `.updatedRange` | merkkijono | Kirjoitettu alue |
| `updateRange` | `.updatedCells` | numero | Päivitettyjen solujen määrä |
| `clearRange` | `.clearedRange` | merkkijono | Tyhjennetty alue |
| `getSheetInfo` | `.title` | merkkijono | Taulukon otsikko |
| `getSheetInfo` | `.sheets` | taulukko | Luettelo `{sheetId, title}` -kohteista |

Kaikki toiminnot sisältävät tulosteessa `success: true` ja `operation: "<nimi>"`.
## Esimerkki – Lue alueelta

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

Tuloksen käyttö: `$readReport.rows[0]` (ensimmäinen datarivin objekti), `$readReport.rows[0].Name` (sarake otsikon mukaan), `$readReport.rows[0].rowIndex` (1-pohjainen rivinumero).

## Esimerkki – Lisää rivi syötteestä

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

## Aiheeseen liittyvää

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää Google Sheets OAuth2 -tunnistetiedot
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#google-sheets-oauth2) – Google Sheets -tunnistetietojen määritys

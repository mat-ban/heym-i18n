# Google Sheets

Vozlišče **Google Sheets** bere, piše in upravlja podatke v preglednicah Google Sheets prek OAuth2. Uporabite ga za avtomatizacijo delovnih tokov preglednic — branje poročil, beleženje rezultatov, posodabljanje sledilnikov in še več.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Poverilnica | Google Sheets (OAuth2) |
| Izhod | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica Google Sheets iz [Poverilnic](../tabs/credentials-tab.md) |
| `gsOperation` | niz | Operacija: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | izraz | ID preglednice ali polna URL povezava Google Sheets |
| `gsSheetName` | izraz | Ime zavihka preglednice (npr. `Sheet1`). Ni potrebno za `getSheetInfo`. |
| `gsStartRow` | izraz | Za `readRange`: prvi podatkovni vrstica, ki temelji na 1 (z `gsHasHeader`, vrstica 1 je glava). |
| `gsMaxRows` | izraz | Za `readRange`: največje število vrstic podatkov (0 = vse). |
| `gsHasHeader` | boolean | Za `readRange`: obravnava vrstico 1 kot imena stolpcev, ko je res. |
| `gsUpdateRow` | izraz | Samo za `updateRange`: številka vrstice preglednice, ki temelji na 1, za posodobitev (stolpci A–Z); če ni nastavljena, se uporabi `gsStartRow`. Ni batchUpdate — en API PUT za vrednosti. |
| `gsRange` | izraz | A1 notacijska obseg (npr. `A1:D100`). Zgodnji primeri; urejevalnik uporablja polja vrstic za branje/posodabljanje. |
| `gsKeepHeader` | boolean | Samo za `clearRange`: ko je res, se vrstica 1 obdrži, podatkovne vrstice spodaj pa se izbrišejo (stolpci A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Samo za `appendRows`: **Dno** doda po zadnji vrstici s podatki; **Vrh** vstavi nove vrstice neposredno pod vrstico 1 (premakne podatke navzdol). |
| `gsValuesInputMode` | `raw` \| `selective` | Za `appendRows` / `updateRange`: **Raw** = celoten JSON niz; **Selective** = ena vrstica preglednice, samo polja stolpcev (brez A1 oznak). |
| `gsValuesSelectiveCols` | niz | Selektivni način: število stolpcev (A–Z). |
| `gsValues` | izraz | JSON 2D niz vrednosti (npr. `[["Ime","Starost"],["Alice",30]]`). Obvezno za `appendRows`, `updateRange`. |

## ID preglednice

Polje `gsSpreadsheetId` sprejema bodisi **goli ID** (dolga alfanumerična niz med `/d/` in `/edit` v URL-ju Google Sheets) bodisi **polno URL povezavo** — Heym ID samodejno izlušči.

## Nastavitev poverilnice

Google Sheets uporablja model **OAuth2 "Bring Your Own App"**. Vi zagotovite svoje Google Cloud OAuth2 poverilnice.

**Konfiguracija v ozadju:** Nastavite **`FRONTEND_URL`** na Heym ozadju na javni URL aplikacije (naslov, ki ga uporabniki vpišejo v brskalnik), npr. `https://your-heym-domain`. URI za preusmeritev OAuth je vedno `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — izpelje se samo iz te nastavitve, ne iz glave zahtevka.

1. Pojdite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogočite **Google Sheets API**.
2. Pojdite na **Poverilnice** → **Ustvari poverilnice** → **OAuth client ID** → izberite **Web application**.
3. Pod **Authorized redirect URIs** dodajte natančno: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (na primer `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopirajte **Client ID** in **Client Secret**.
5. V Heym Dashboard → **Poverilnice** → **Novo** → izberite **Google Sheets (OAuth2)**.
6. Vnesite Client ID, Client Secret in ime, nato kliknite **Poveži**, da dokončate soglasje OAuth2 v pojavnem oknu brskalnika.

Žetoni se samodejno osvežujejo v ozadju — ni potrebno ročno upravljanje žetonov.

## Operacije

| Operacija | Obvezna polja | Opis |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Preberite vrednosti celic (A–Z); neobvezno `gsRange` v zgodnjih tokovih |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Dodajte vrstice na dno (`gsAppendPlacement` append) ali pod vrstico 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Prepišite vrstico(e), ki se začnejo pri `gsUpdateRow` (A–Z); večvrstični JSON zapisuje zaporedne vrstice |
| `clearRange` | gsSpreadsheetId, gsSheetName | Izbrišite vse vrednosti v stolpcih A–Z za zavihek; neobvezno `gsKeepHeader` obdrži prvo vrstico |
| `getSheetInfo` | gsSpreadsheetId | Pridobite naslov preglednice in seznam zavihkov preglednice |

## Referenca izhoda

| Operacija | Izhodna polja | Tip | Opis |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | niz | Objekti vrstic: ključi stolpcev (imena glav ali A, B, …) plus **`rowIndex`** (vrsta preglednice, ki temelji na 1) |
| `readRange` | `.total` | število | Število vrstice podatkov, ki so bile vrnjene |
| `appendRows` | `.updatedRange` | niz | Obseg, ki je bil zapisan |
| `appendRows` | `.updates` | število | Število vrstic, ki so bile dodane |
| `updateRange` | `.updatedRange` | niz | Obseg, ki je bil zapisan |
| `updateRange` | `.updatedCells` | število | Število celic, ki so bile posodobljene |
| `clearRange` | `.clearedRange` | niz | Obseg, ki je bil izbrisan |
| `getSheetInfo` | `.title` | niz | Naslov preglednice |
| `getSheetInfo` | `.sheets` | niz | Seznam objektov `{sheetId, title}` |

Vse operacije vključujejo `success: true` in `operation: "<name>"` v izhodu.
## Primer – Branje obsega

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

Dostop do izhoda: `$readReport.rows[0]` (prvi objekt podatkovne vrstice), `$readReport.rows[0].Name` (stolpec po glavi), `$readReport.rows[0].rowIndex` (vrsta na listu, šteto od 1).

## Primer – Dodajanje vrstice iz vnosa

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajanje Google Sheets OAuth2 poverilnice
- [Integracije tretjih oseb](../reference/integrations.md#google-sheets-oauth2) – Nastavitev Google Sheets poverilnice

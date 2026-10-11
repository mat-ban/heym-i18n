# Google Sheets

Čvor **Google Sheets** čita, piše i upravlja podacima u Google Sheets proračunskim tablicama putem OAuth2. Koristite ga za automatizaciju workflows proračunskih tablica — čitanje izvještaja, bilježenje rezultata, ažuriranje praćenja i još mnogo toga.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Vjerodajnice | Google Sheets (OAuth2) |
| Izlaz | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|------|
| `credentialId` | UUID | Google Sheets vjerodajnice iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operacija: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | izraz | ID proračunske tablice ili puna Google Sheets URL adresa |
| `gsSheetName` | izraz | Ime kartice lista (npr. `Sheet1`). Nije obavezno za `getSheetInfo`. |
| `gsStartRow` | izraz | Za `readRange`: prvi red podataka s 1 (uz `gsHasHeader`, red 1 je zaglavlje). |
| `gsMaxRows` | izraz | Za `readRange`: maksimalan broj redova podataka (0 = svi). |
| `gsHasHeader` | boolean | Za `readRange`: tretirajte red 1 kao nazive stupaca kada je istina. |
| `gsUpdateRow` | izraz | Samo za `updateRange`: redni broj lista koji se ažurira (stupci A–Z); ako nije postavljen, koristi se `gsStartRow`. Nije batchUpdate — jedan values API PUT. |
| `gsRange` | izraz | A1 notacija raspona (npr. `A1:D100`). Naslijeđeni primjeri; uređivač koristi polja redova za čitanje/ažuriranje. |
| `gsKeepHeader` | boolean | Samo za `clearRange`: kada je istina, red 1 se zadržava, a podaci ispod se brišu (stupci A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Samo za `appendRows`: **Dno** dodaje nakon posljednjeg reda s podacima; **Vrh** umetne nove redove izravno ispod reda 1 (pomakne podatke prema dolje). |
| `gsValuesInputMode` | `raw` \| `selective` | Za `appendRows` / `updateRange`: **Raw** = puni JSON niz; **Selective** = jedan red lista, samo polja stupaca (bez A1 oznaka). |
| `gsValuesSelectiveCols` | string | Selektivni način: broj stupaca (A–Z). |
| `gsValues` | izraz | JSON 2D niz vrijednosti (npr. `[["Ime","Dob"],["Alice",30]]`). Obavezno za `appendRows`, `updateRange`. |

## ID proračunske tablice

Polje `gsSpreadsheetId` prihvaća ili **goli ID** (dugi alfanumerički niz između `/d/` i `/edit` u Google Sheets URL-u) ili **punu URL adresu** — Heym automatski izvlači ID.

## Postavljanje vjerodajnica

Google Sheets koristi model **OAuth2 "Bring Your Own App"**. Vi pružate svoje vlastite Google Cloud OAuth2 vjerodajnice.

**Konfiguracija pozadine:** Postavite **`FRONTEND_URL`** na Heym pozadini na javnu URL adresu aplikacije (adresu koju korisnici upisuju u preglednik), npr. `https://your-heym-domain`. OAuth preusmjerena URI je uvijek `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — ona se izvodi samo iz ove postavke, a ne iz zaglavlja zahtjeva.

1. Idite na [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → omogućite **Google Sheets API**.
2. Idite na **Vjerodajnice** → **Kreiraj vjerodajnice** → **OAuth client ID** → odaberite **Web application**.
3. Pod **Authorized redirect URIs**, dodajte točno: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (na primjer `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Kopirajte **Client ID** i **Client Secret**.
5. U Heym Dashboard → **Vjerodajnice** → **Novi** → odaberite **Google Sheets (OAuth2)**.
6. Unesite Client ID, Client Secret i ime, zatim kliknite **Connect** za dovršetak OAuth2 pristanka u skočnom prozoru preglednika.

Tokeni se automatski osvježavaju u pozadini — nije potrebna ručna uprava tokenima.

## Operacije

| Operacija | Obavezna polja | Opis |
|-----------|----------------|------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Čitajte vrijednosti ćelija (A–Z); opcionalno `gsRange` u naslijeđenim tokovima |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Dodajte redove na dno (`gsAppendPlacement` append) ili ispod reda 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Prepišite redove počinjući od `gsUpdateRow` (A–Z); višeredni JSON zapisuje uzastopne redove |
| `clearRange` | gsSpreadsheetId, gsSheetName | Očistite sve vrijednosti u stupcima A–Z za karticu; opcionalno `gsKeepHeader` zadržava prvi red |
| `getSheetInfo` | gsSpreadsheetId | Dobili naslov proračunske tablice i popis kartica lista |

## Referenca izlaza

| Operacija | Izlazno polje | Tip | Opis |
|-----------|---------------|-----|------|
| `readRange` | `.rows` | niz | Objekti redova: ključevi stupaca (nazivi zaglavlja ili A, B, …) plus **`rowIndex`** (1-bazirani red lista) |
| `readRange` | `.total` | broj | Broj vraćenih redova podataka |
| `appendRows` | `.updatedRange` | string | Raspon koji je napisan |
| `appendRows` | `.updates` | broj | Broj dodanih redova |
| `updateRange` | `.updatedRange` | string | Raspon koji je napisan |
| `updateRange` | `.updatedCells` | broj | Broj ažuriranih ćelija |
| `clearRange` | `.clearedRange` | string | Raspon koji je očišćen |
| `getSheetInfo` | `.title` | string | Naslov proračunske tablice |
| `getSheetInfo` | `.sheets` | niz | Popis objekata `{sheetId, title}` |

Sve operacije uključuju `success: true` i `operation: "<name>"` u izlazu.
## Primjer – Čitanje Opsega

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

Pristup izlazu: `$readReport.rows[0]` (objekt prve podatkovne vrste), `$readReport.rows[0].Name` (stupac prema zaglavlju), `$readReport.rows[0].rowIndex` (redak u tablici temeljen na 1).

## Primjer – Dodavanje Retka iz Ulaza

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

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Zaslon Vjerodajnica](../tabs/credentials-tab.md) – Dodavanje Google Sheets OAuth2 vjerodajnice
- [Integracije trećih strana](../reference/integrations.md#google-sheets-oauth2) – Postavljanje Google Sheets vjerodajnice

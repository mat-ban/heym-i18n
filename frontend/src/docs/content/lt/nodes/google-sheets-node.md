# Google Sheets

**Google Sheets** mazgas skaito, rašo ir valdo duomenis Google Sheets skaičiuoklėse per OAuth2. Naudokite jį automatizuoti skaičiuoklių workflows — ataskaitų skaitymas, rezultatų registravimas, sekiklių atnaujinimas ir kt.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Kredencialas | Google Sheets (OAuth2) |
| Išvestis | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | Google Sheets kredencialas iš [Credentials](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operacija: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | Skaičiuoklės ID arba pilnas Google Sheets URL |
| `gsSheetName` | expression | Lapelio skirtuko pavadinimas (pvz., `Sheet1`). Nereikalingas `getSheetInfo`. |
| `gsStartRow` | expression | `readRange`: 1 pagrindu pirmo duomenų eilutės numeris (su `gsHasHeader`, 1 eilutė yra antraštė). |
| `gsMaxRows` | expression | `readRange`: maksimalus duomenų eilučių skaičius (0 = visos). |
| `gsHasHeader` | boolean | `readRange`: laikyti 1 eilutę kaip stulpelių pavadinimus, kai tiesa. |
| `gsUpdateRow` | expression | Tik `updateRange`: 1 pagrindu lapo eilutės numeris, kurį reikia atnaujinti (stulpeliai A–Z); jei nenustatyta, naudojama `gsStartRow`. Ne batchUpdate — vienas values API PUT. |
| `gsRange` | expression | A1 notacijos diapazonas (pvz., `A1:D100`). Senesni pavyzdžiai; redaktorius naudoja eilutės laukus skaitymui/atnaujinimui. |
| `gsKeepHeader` | boolean | Tik `clearRange`: kai tiesa, 1 eilutė išlaikoma, o duomenų eilutės žemiau yra išvalomos (stulpeliai A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Tik `appendRows`: **Apačioje** prideda po paskutinės eilutės su duomenimis; **Viršuje** įterpia naujas eilutes tiesiai po 1 eile (perkelia duomenis žemyn). |
| `gsValuesInputMode` | `raw` \| `selective` | `appendRows` / `updateRange`: **Raw** = visas JSON masyvas; **Selective** = viena lapo eilutė, stulpelių laukai tik (be A1 etikečių). |
| `gsValuesSelectiveCols` | string | Selektyvus režimas: stulpelių skaičius (A–Z). |
| `gsValues` | expression | JSON 2D masyvas su vertėmis (pvz., `[["Name","Age"],["Alice",30]]`). Reikalingas `appendRows`, `updateRange`. |

## Skaičiuoklės ID

`gsSpreadsheetId` laukas priima arba **nuogą ID** (ilgas alfanumerinis simbolių eilutė tarp `/d/` ir `/edit` Google Sheets URL) arba **pilną URL** — Heym automatiškai ištraukia ID.

## Kredencialų nustatymas

Google Sheets naudoja **OAuth2 "Bring Your Own App"** modelį. Jūs pateikiate savo Google Cloud OAuth2 kredencialus.

**Backend konfigūracija:** Nustatykite **`FRONTEND_URL`** Heym backend'e į viešą programos URL (adresą, kurį vartotojai įveda naršyklėje), pvz., `https://your-heym-domain`. OAuth nukreipimo URI visada yra `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — jis gaunamas tik iš šio nustatymo, o ne iš užklausų antraščių.

1. Eikite į [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → įgalinkite **Google Sheets API**.
2. Eikite į **Credentials** → **Create Credentials** → **OAuth client ID** → pasirinkite **Web application**.
3. Po **Authorized redirect URIs** pridėkite tiksliai: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (pavyzdžiui, `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Nukopijuokite **Client ID** ir **Client Secret**.
5. Heym Dashboard → **Credentials** → **New** → pasirinkite **Google Sheets (OAuth2)**.
6. Įveskite Client ID, Client Secret ir pavadinimą, tada spustelėkite **Connect**, kad užbaigtumėte OAuth2 sutikimą naršyklės iššokančiame lange.

Tokenai automatiškai atnaujinami fone — nereikia rankiniu būdu valdyti tokenų.

## Operacijos

| Operacija | Reikalingi laukai | Aprašymas |
|-----------|-------------------|-----------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Skaityti langelių vertes (A–Z); neprivalomas `gsRange` senesniuose srautuose |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Pridėti eilutes apačioje (`gsAppendPlacement` append) arba po 1 eile (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Perrašyti eilutes pradedant nuo `gsUpdateRow` (A–Z); kelių eilučių JSON rašo iš eilės |
| `clearRange` | gsSpreadsheetId, gsSheetName | Išvalyti visas vertes stulpeliuose A–Z skirtuke; neprivalomas `gsKeepHeader` išlaiko pirmą eilutę |
| `getSheetInfo` | gsSpreadsheetId | Gauti skaičiuoklės pavadinimą ir lapų skirtukų sąrašą |

## Išvesties nuoroda

| Operacija | Išvesties laukas | Tipas | Aprašymas |
|-----------|------------------|-------|-----------|
| `readRange` | `.rows` | array | Eilučių objektai: stulpelių raktai (antraštės pavadinimai arba A, B, …) plius **`rowIndex`** (1 pagrindu lapo eilutė) |
| `readRange` | `.total` | number | Grąžintų duomenų eilučių skaičius |
| `appendRows` | `.updatedRange` | string | Rašytas diapazonas |
| `appendRows` | `.updates` | number | Pridėtų eilučių skaičius |
| `updateRange` | `.updatedRange` | string | Rašytas diapazonas |
| `updateRange` | `.updatedCells` | number | Atnaujintų langelių skaičius |
| `clearRange` | `.clearedRange` | string | Išvalytas diapazonas |
| `getSheetInfo` | `.title` | string | Skaičiuoklės pavadinimas |
| `getSheetInfo` | `.sheets` | array | `{sheetId, title}` objektų sąrašas |

Visos operacijos apima `success: true` ir `operation: "<name>"` išvestyje.
## Pavyzdys – Skaityti Diapazoną

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

Prieigos išvestis: `$readReport.rows[0]` (pirmasis duomenų eilutės objektas), `$readReport.rows[0].Name` (stulpelis pagal antraštę), `$readReport.rows[0].rowIndex` (eilutės indeksas, pradedant nuo 1).

## Pavyzdys – Pridėti Eilutę Iš Įvesties

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

## Susiję

- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti Google Sheets OAuth2 kredencialą
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Google Sheets kredencialų nustatymas

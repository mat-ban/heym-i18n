# Google Sheets

Nodul **Google Sheets** citește, scrie și gestionează date în foi de calcul Google Sheets prin OAuth2. Utilizați-l pentru a automatiza fluxuri de lucru cu foi de calcul — citirea rapoartelor, înregistrarea rezultatelor, actualizarea trackere-lor și altele.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Acreditare | Google Sheets (OAuth2) |
| Ieșire | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea Google Sheets din [Acreditări](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operațiune: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID-ul foii de calcul sau URL-ul complet Google Sheets |
| `gsSheetName` | expression | Numele filei din foaia de calcul (de ex. `Sheet1`). Nu este necesar pentru `getSheetInfo`. |
| `gsStartRow` | expression | Pentru `readRange`: primul rând de date, indexat de la 1 (cu `gsHasHeader`, rândul 1 este antetul). |
| `gsMaxRows` | expression | Pentru `readRange`: numărul maxim de rânduri de date (0 = toate). |
| `gsHasHeader` | boolean | Pentru `readRange`: tratează rândul 1 ca nume de coloane când este true. |
| `gsUpdateRow` | expression | Doar pentru `updateRange`: numărul rândului din foaie, indexat de la 1, de actualizat (coloanele A–Z); dacă nu este setat, se folosește `gsStartRow`. Nu este batchUpdate — un singur PUT către values API. |
| `gsRange` | expression | Interval în notație A1 (de ex. `A1:D100`). Exemple legacy; editorul folosește câmpuri de rând pentru citire/actualizare. |
| `gsKeepHeader` | boolean | Doar pentru `clearRange`: când este true, rândul 1 este păstrat, iar rândurile de date de dedesubt sunt șterse (coloanele A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Doar pentru `appendRows`: **Bottom** adaugă după ultimul rând cu date; **Top** inserează rânduri noi direct sub rândul 1 (deplasează datele în jos). |
| `gsValuesInputMode` | `raw` \| `selective` | Pentru `appendRows` / `updateRange`: **Raw** = array JSON complet; **Selective** = un singur rând din foaie, doar câmpuri de coloană (fără etichete A1). |
| `gsValuesSelectiveCols` | string | Modul Selective: numărul de coloane (A–Z). |
| `gsValues` | expression | Array JSON 2D de valori (de ex. `[["Name","Age"],["Alice",30]]`). Necesar pentru `appendRows`, `updateRange`. |

## ID-ul foii de calcul

Câmpul `gsSpreadsheetId` acceptă fie **ID-ul simplu** (șirul alfanumeric lung dintre `/d/` și `/edit` dintr-un URL Google Sheets), fie **URL-ul complet** — Heym extrage ID-ul automat.

## Configurarea acreditării

Google Sheets utilizează un model **OAuth2 "Bring Your Own App"**. Furnizați propriile acreditări OAuth2 din Google Cloud.

**Configurarea backend-ului:** Setați **`FRONTEND_URL`** pe backend-ul Heym la URL-ul public al aplicației (adresa pe care utilizatorii o tastează în browser), de ex. `https://your-heym-domain`. URI-ul de redirect OAuth este întotdeauna `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — este derivat doar din această setare, nu din anteturile cererii.

1. Accesați [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → activați **Google Sheets API**.
2. Accesați **Credentials** → **Create Credentials** → **OAuth client ID** → selectați **Web application**.
3. La **Authorized redirect URIs**, adăugați exact: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (de exemplu `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Copiați **Client ID** și **Client Secret**.
5. În Heym Dashboard → **Credentials** → **New** → selectați **Google Sheets (OAuth2)**.
6. Introduceți Client ID, Client Secret și un nume, apoi faceți clic pe **Connect** pentru a finaliza consimțământul OAuth2 într-o fereastră popup din browser.

Token-urile se reîmprospătează automat în fundal — nu este necesară gestionarea manuală a token-urilor.

## Operațiuni

| Operațiune | Câmpuri obligatorii | Descriere |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Citește valorile celulelor (A–Z); `gsRange` opțional în fluxurile legacy |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Adaugă rânduri la final (`gsAppendPlacement` append) sau sub rândul 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Suprascrie rândul (rândurile) începând de la `gsUpdateRow` (A–Z); un JSON cu mai multe rânduri scrie rânduri consecutive |
| `clearRange` | gsSpreadsheetId, gsSheetName | Șterge toate valorile din coloanele A–Z pentru filă; `gsKeepHeader` opțional păstrează primul rând |
| `getSheetInfo` | gsSpreadsheetId | Obține titlul foii de calcul și lista de file |

## Referință pentru ieșire

| Operațiune | Câmp de ieșire | Tip | Descriere |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Obiecte de rând: chei de coloană (nume de antet sau A, B, …) plus **`rowIndex`** (rândul din foaie, indexat de la 1) |
| `readRange` | `.total` | number | Numărul de rânduri de date returnate |
| `appendRows` | `.updatedRange` | string | Intervalul scris |
| `appendRows` | `.updates` | number | Numărul de rânduri adăugate |
| `updateRange` | `.updatedRange` | string | Intervalul scris |
| `updateRange` | `.updatedCells` | number | Numărul de celule actualizate |
| `clearRange` | `.clearedRange` | string | Intervalul care a fost șters |
| `getSheetInfo` | `.title` | string | Titlul foii de calcul |
| `getSheetInfo` | `.sheets` | array | Listă de obiecte `{sheetId, title}` |

Toate operațiunile includ `success: true` și `operation: "<name>"` în ieșire.
## Exemplu – Citirea unui interval

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

Accesarea rezultatului: `$readReport.rows[0]` (primul obiect rând de date), `$readReport.rows[0].Name` (coloana după antet), `$readReport.rows[0].rowIndex` (indexul rândului din foaie, începând de la 1).

## Exemplu – Adăugarea unui rând din intrare

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugarea acreditării Google Sheets OAuth2
- [Integrări terțe](../reference/integrations.md#google-sheets-oauth2) – Configurarea acreditării Google Sheets

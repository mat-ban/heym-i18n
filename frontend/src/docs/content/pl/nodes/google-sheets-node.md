# Google Sheets

Węzeł **Google Sheets** odczytuje, zapisuje i zarządza danymi w arkuszach Google Sheets za pośrednictwem OAuth2. Służy do automatyzacji workflowów arkuszy kalkulacyjnych — odczytu raportów, rejestrowania wyników, aktualizacji trackerów i innych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Dane logowania | Google Sheets (OAuth2) |
| Wyjście | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania Google Sheets z sekcji [Dane logowania](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operacja: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID arkusza kalkulacyjnego lub pełny URL Google Sheets |
| `gsSheetName` | expression | Nazwa zakładki arkusza (np. `Sheet1`). Niewymagane dla `getSheetInfo`. |
| `gsStartRow` | expression | Dla `readRange`: pierwszy wiersz danych liczony od 1 (przy `gsHasHeader` wiersz 1 to nagłówek). |
| `gsMaxRows` | expression | Dla `readRange`: maksymalna liczba wierszy danych (0 = wszystkie). |
| `gsHasHeader` | boolean | Dla `readRange`: gdy true, wiersz 1 jest traktowany jako nazwy kolumn. |
| `gsUpdateRow` | expression | Tylko dla `updateRange`: numer wiersza arkusza liczony od 1 do aktualizacji (kolumny A–Z); jeśli nie ustawiono, używany jest `gsStartRow`. Nie jest to batchUpdate — pojedyncze żądanie PUT values API. |
| `gsRange` | expression | Zakres w notacji A1 (np. `A1:D100`). Przykłady legacy; edytor używa pól wierszy do odczytu/aktualizacji. |
| `gsKeepHeader` | boolean | Tylko dla `clearRange`: gdy true, wiersz 1 jest zachowywany, a wiersze danych poniżej są czyszczone (kolumny A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Tylko dla `appendRows`: **Bottom** dodaje po ostatnim wierszu z danymi; **Top** wstawia nowe wiersze bezpośrednio pod wierszem 1 (przesuwa dane w dół). |
| `gsValuesInputMode` | `raw` \| `selective` | Dla `appendRows` / `updateRange`: **Raw** = pełna tablica JSON; **Selective** = jeden wiersz arkusza, tylko pola kolumn (bez etykiet A1). |
| `gsValuesSelectiveCols` | string | Tryb Selective: liczba kolumn (A–Z). |
| `gsValues` | expression | Tablica 2D wartości w formacie JSON (np. `[["Name","Age"],["Alice",30]]`). Wymagane dla `appendRows`, `updateRange`. |

## ID arkusza kalkulacyjnego

Pole `gsSpreadsheetId` przyjmuje zarówno **samo ID** (długi ciąg alfanumeryczny między `/d/` a `/edit` w URL Google Sheets), jak i **pełny URL** — Heym automatycznie wyodrębnia ID.

## Konfiguracja danych logowania

Google Sheets wykorzystuje model **OAuth2 „Bring Your Own App"**. Należy dostarczyć własne dane logowania OAuth2 z Google Cloud.

**Konfiguracja backendu:** Ustaw **`FRONTEND_URL`** w backendzie Heym na publiczny URL aplikacji (adres wpisywany w przeglądarce), np. `https://your-heym-domain`. URI przekierowania OAuth to zawsze `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — jest on wyprowadzany wyłącznie z tego ustawienia, a nie z nagłówków żądań.

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → włącz **Google Sheets API**.
2. Przejdź do **Credentials** → **Create Credentials** → **OAuth client ID** → wybierz **Web application**.
3. W sekcji **Authorized redirect URIs** dodaj dokładnie: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (na przykład `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Skopiuj **Client ID** i **Client Secret**.
5. W Heym Dashboard → **Dane logowania** → **New** → wybierz **Google Sheets (OAuth2)**.
6. Wprowadź Client ID, Client Secret oraz nazwę, a następnie kliknij **Connect**, aby dokończyć proces zgody OAuth2 w oknie popup przeglądarki.

Tokeny odświeżają się automatycznie w tle — ręczne zarządzanie tokenami nie jest wymagane.

## Operacje

| Operacja | Wymagane pola | Opis |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Odczyt wartości komórek (A–Z); opcjonalny `gsRange` w przepływach legacy |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Dodawanie wierszy na dole (`gsAppendPlacement` append) lub pod wierszem 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Nadpisanie wiersza/wierszy począwszy od `gsUpdateRow` (A–Z); wielowierszowy JSON zapisuje kolejne wiersze |
| `clearRange` | gsSpreadsheetId, gsSheetName | Czyszczenie wszystkich wartości w kolumnach A–Z dla zakładki; opcjonalny `gsKeepHeader` zachowuje pierwszy wiersz |
| `getSheetInfo` | gsSpreadsheetId | Pobranie tytułu arkusza kalkulacyjnego i listy zakładek |

## Dokumentacja wyjścia

| Operacja | Pole wyjściowe | Typ | Opis |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Obiekty wierszy: klucze kolumn (nazwy nagłówków lub A, B, …) oraz **`rowIndex`** (numer wiersza arkusza liczony od 1) |
| `readRange` | `.total` | number | Liczba zwróconych wierszy danych |
| `appendRows` | `.updatedRange` | string | Zapisany zakres |
| `appendRows` | `.updates` | number | Liczba dodanych wierszy |
| `updateRange` | `.updatedRange` | string | Zapisany zakres |
| `updateRange` | `.updatedCells` | number | Liczba zaktualizowanych komórek |
| `clearRange` | `.clearedRange` | string | Zakres, który został wyczyszczony |
| `getSheetInfo` | `.title` | string | Tytuł arkusza kalkulacyjnego |
| `getSheetInfo` | `.sheets` | array | Lista obiektów `{sheetId, title}` |

Wszystkie operacje zwracają w wyjściu `success: true` oraz `operation: "<name>"`.
## Przykład – Odczyt zakresu

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

Dostęp do danych wyjściowych: `$readReport.rows[0]` (obiekt pierwszego wiersza danych), `$readReport.rows[0].Name` (kolumna według nagłówka), `$readReport.rows[0].rowIndex` (indeks wiersza arkusza liczony od 1).

## Przykład – Dołączenie wiersza z danych wejściowych

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

## Powiązane

- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Karta Dane logowania](../tabs/credentials-tab.md) – Dodawanie danych logowania Google Sheets OAuth2
- [Integracje zewnętrzne](../reference/integrations.md#google-sheets-oauth2) – Konfiguracja danych logowania Google Sheets

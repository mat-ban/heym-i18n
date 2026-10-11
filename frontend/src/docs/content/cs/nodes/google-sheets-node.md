# Google Sheets

Uzel **Google Sheets** čte, zapisuje a spravuje data v tabulkách Google Sheets prostřednictvím OAuth2. Použijte jej k automatizaci workflow s tabulkami — čtení reportů, zaznamenávání výsledků, aktualizaci přehledů a další.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Google Sheets (OAuth2) |
| Výstup | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje Google Sheets z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operace: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID tabulky nebo úplná URL adresa Google Sheets |
| `gsSheetName` | expression | Název listu (např. `Sheet1`). Není vyžadováno pro `getSheetInfo`. |
| `gsStartRow` | expression | Pro `readRange`: první datový řádek (indexováno od 1; s `gsHasHeader` je řádek 1 hlavička). |
| `gsMaxRows` | expression | Pro `readRange`: maximální počet datových řádků (0 = všechny). |
| `gsHasHeader` | boolean | Pro `readRange`: pokud je true, řádek 1 se považuje za názvy sloupců. |
| `gsUpdateRow` | expression | Pouze pro `updateRange`: číslo řádku listu (indexováno od 1) k aktualizaci (sloupce A–Z); pokud není nastaveno, použije se `gsStartRow`. Nejde o batchUpdate — jde o jedno volání values API PUT. |
| `gsRange` | expression | Rozsah v A1 notaci (např. `A1:D100`). Zastaralé příklady; editor používá pole řádků pro čtení/aktualizaci. |
| `gsKeepHeader` | boolean | Pouze pro `clearRange`: pokud je true, řádek 1 zůstane zachován a datové řádky pod ním se vymažou (sloupce A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Pouze pro `appendRows`: **Bottom** přidá za poslední řádek s daty; **Top** vloží nové řádky přímo pod řádek 1 (posune data dolů). |
| `gsValuesInputMode` | `raw` \| `selective` | Pro `appendRows` / `updateRange`: **Raw** = úplné JSON pole; **Selective** = jeden řádek listu, pouze pole sloupců (bez A1 popisků). |
| `gsValuesSelectiveCols` | string | Selective režim: počet sloupců (A–Z). |
| `gsValues` | expression | JSON 2D pole hodnot (např. `[["Name","Age"],["Alice",30]]`). Vyžadováno pro `appendRows`, `updateRange`. |

## ID tabulky

Pole `gsSpreadsheetId` přijímá buď **holé ID** (dlouhý alfanumerický řetězec mezi `/d/` a `/edit` v URL adrese Google Sheets), nebo **úplnou URL adresu** — Heym ID extrahuje automaticky.

## Nastavení přihlašovacích údajů

Google Sheets používá model **OAuth2 „Bring Your Own App"**. Poskytujete vlastní přihlašovací údaje OAuth2 ze svého Google Cloud.

**Konfigurace backendu:** Nastavte **`FRONTEND_URL`** na backendu Heym na veřejnou URL adresu aplikace (adresu, kterou uživatelé zadávají do prohlížeče), např. `https://your-heym-domain`. URI přesměrování OAuth je vždy `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — odvozuje se pouze z tohoto nastavení, nikoli z hlaviček požadavku.

1. Přejděte do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povolte **Google Sheets API**.
2. Přejděte do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V části **Authorized redirect URIs** přidejte přesně: `{vaše FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (například `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Zkopírujte **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Přihlašovací údaje** → **Nový** → vyberte **Google Sheets (OAuth2)**.
6. Zadejte Client ID, Client Secret a název, poté klikněte na **Connect** pro dokončení souhlasu OAuth2 ve vyskakovacím okně prohlížeče.

Tokeny se automaticky obnovují na pozadí — není vyžadována žádná ruční správa tokenů.

## Operace

| Operace | Povinná pole | Popis |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Čte hodnoty buněk (A–Z); volitelné `gsRange` v zastaralých tocích |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Přidá řádky na konec (`gsAppendPlacement` append) nebo pod řádek 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Přepíše řádek/řádky počínaje `gsUpdateRow` (A–Z); vícerádkový JSON zapisuje po sobě jdoucí řádky |
| `clearRange` | gsSpreadsheetId, gsSheetName | Vymaže všechny hodnoty ve sloupcích A–Z pro daný list; volitelné `gsKeepHeader` zachová první řádek |
| `getSheetInfo` | gsSpreadsheetId | Získá název tabulky a seznam listů |

## Reference výstupu

| Operace | Výstupní pole | Typ | Popis |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objekty řádků: klíče sloupců (názvy hlaviček nebo A, B, …) plus **`rowIndex`** (řádek listu indexovaný od 1) |
| `readRange` | `.total` | number | Počet vrácených datových řádků |
| `appendRows` | `.updatedRange` | string | Zapsaný rozsah |
| `appendRows` | `.updates` | number | Počet přidaných řádků |
| `updateRange` | `.updatedRange` | string | Zapsaný rozsah |
| `updateRange` | `.updatedCells` | number | Počet aktualizovaných buněk |
| `clearRange` | `.clearedRange` | string | Rozsah, který byl vymazán |
| `getSheetInfo` | `.title` | string | Název tabulky |
| `getSheetInfo` | `.sheets` | array | Seznam objektů `{sheetId, title}` |

Všechny operace zahrnují ve výstupu `success: true` a `operation: "<name>"`.
## Příklad – Čtení rozsahu

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

Přístup k výstupu: `$readReport.rows[0]` (objekt prvního datového řádku), `$readReport.rows[0].Name` (sloupec podle hlavičky), `$readReport.rows[0].rowIndex` (index řádku v listu počítaný od 1).

## Příklad – Přidání řádku ze vstupu

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

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů Google Sheets OAuth2
- [Integrace třetích stran](../reference/integrations.md#google-sheets-oauth2) – Nastavení přihlašovacích údajů Google Sheets

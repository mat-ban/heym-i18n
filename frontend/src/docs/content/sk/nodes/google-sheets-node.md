# Google Sheets

Uzol **Google Sheets** číta, zapisuje a spravuje údaje v tabuľkách Google Sheets prostredníctvom OAuth2. Použite ho na automatizáciu workflowov s tabuľkami — čítanie reportov, zaznamenávanie výsledkov, aktualizáciu trackerov a ďalšie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Google Sheets (OAuth2) |
| Výstup | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Google Sheets z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `gsOperation` | string | Operácia: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID tabuľky alebo úplná URL adresa Google Sheets |
| `gsSheetName` | expression | Názov hárku (napr. `Sheet1`). Nevyžaduje sa pre `getSheetInfo`. |
| `gsStartRow` | expression | Pre `readRange`: prvý dátový riadok (indexovaný od 1; s `gsHasHeader` je riadok 1 hlavička). |
| `gsMaxRows` | expression | Pre `readRange`: maximálny počet dátových riadkov (0 = všetky). |
| `gsHasHeader` | boolean | Pre `readRange`: ak je true, riadok 1 sa považuje za názvy stĺpcov. |
| `gsUpdateRow` | expression | Iba pre `updateRange`: číslo riadku hárku (indexované od 1) na aktualizáciu (stĺpce A–Z); ak nie je nastavené, použije sa `gsStartRow`. Nejde o batchUpdate — jedno volanie values API PUT. |
| `gsRange` | expression | Rozsah v A1 notácii (napr. `A1:D100`). Legacy príklady; editor používa polia riadkov pre čítanie/aktualizáciu. |
| `gsKeepHeader` | boolean | Iba pre `clearRange`: ak je true, riadok 1 sa zachová a dátové riadky pod ním sa vymažú (stĺpce A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Iba pre `appendRows`: **Bottom** pridá za posledný riadok s údajmi; **Top** vloží nové riadky priamo pod riadok 1 (posunie údaje nadol). |
| `gsValuesInputMode` | `raw` \| `selective` | Pre `appendRows` / `updateRange`: **Raw** = úplné JSON pole; **Selective** = jeden riadok hárku, iba polia stĺpcov (bez A1 označení). |
| `gsValuesSelectiveCols` | string | Selective režim: počet stĺpcov (A–Z). |
| `gsValues` | expression | Dvojrozmerné JSON pole hodnôt (napr. `[["Name","Age"],["Alice",30]]`). Vyžaduje sa pre `appendRows`, `updateRange`. |

## ID tabuľky

Pole `gsSpreadsheetId` akceptuje buď **holé ID** (dlhý alfanumerický reťazec medzi `/d/` a `/edit` v URL adrese Google Sheets), alebo **úplnú URL adresu** — Heym extrahuje ID automaticky.

## Nastavenie prihlasovacích údajov

Google Sheets používa model **OAuth2 „Bring Your Own App"**. Poskytujete vlastné prihlasovacie údaje OAuth2 z Google Cloud.

**Konfigurácia backendu:** Nastavte **`FRONTEND_URL`** na backende Heym na verejnú URL adresu aplikácie (adresa, ktorú používatelia zadávajú do prehliadača), napr. `https://your-heym-domain`. OAuth redirect URI je vždy `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — odvodzuje sa výhradne z tohto nastavenia, nie z hlavičiek požiadavky.

1. Prejdite do [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → povoľte **Google Sheets API**.
2. Prejdite do **Credentials** → **Create Credentials** → **OAuth client ID** → vyberte **Web application**.
3. V časti **Authorized redirect URIs** pridajte presne: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (napríklad `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Skopírujte **Client ID** a **Client Secret**.
5. V Heym Dashboard → **Prihlasovacie údaje** → **New** → vyberte **Google Sheets (OAuth2)**.
6. Zadajte Client ID, Client Secret a názov, potom kliknite na **Connect** a dokončite OAuth2 súhlas v kontextovom okne prehliadača.

Tokeny sa obnovujú automaticky na pozadí — nie je potrebná manuálna správa tokenov.

## Operácie

| Operácia | Povinné polia | Popis |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Číta hodnoty buniek (A–Z); voliteľné `gsRange` v legacy workflowoch |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Pridá riadky na koniec (`gsAppendPlacement` append) alebo pod riadok 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Prepíše riadok(y) počnúc `gsUpdateRow` (A–Z); viacriadkové JSON zapisuje po sebe idúce riadky |
| `clearRange` | gsSpreadsheetId, gsSheetName | Vymaže všetky hodnoty v stĺpcoch A–Z pre daný hárok; voliteľné `gsKeepHeader` zachová prvý riadok |
| `getSheetInfo` | gsSpreadsheetId | Získa názov tabuľky a zoznam hárkov |

## Referencia výstupu

| Operácia | Výstupné pole | Typ | Popis |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Objekty riadkov: kľúče stĺpcov (názvy hlavičiek alebo A, B, …) plus **`rowIndex`** (riadok hárku indexovaný od 1) |
| `readRange` | `.total` | number | Počet vrátených dátových riadkov |
| `appendRows` | `.updatedRange` | string | Zapísaný rozsah |
| `appendRows` | `.updates` | number | Počet pridaných riadkov |
| `updateRange` | `.updatedRange` | string | Zapísaný rozsah |
| `updateRange` | `.updatedCells` | number | Počet aktualizovaných buniek |
| `clearRange` | `.clearedRange` | string | Vymazaný rozsah |
| `getSheetInfo` | `.title` | string | Názov tabuľky |
| `getSheetInfo` | `.sheets` | array | Zoznam objektov `{sheetId, title}` |

Všetky operácie obsahujú vo výstupe `success: true` a `operation: "<name>"`.
## Príklad – Čítanie rozsahu

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

Prístup k výstupu: `$readReport.rows[0]` (objekt prvého dátového riadku), `$readReport.rows[0].Name` (stĺpec podľa hlavičky), `$readReport.rows[0].rowIndex` (index riadku hárku počítaný od 1).

## Príklad – Pridanie riadku zo vstupu

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov Google Sheets OAuth2
- [Integrácie tretích strán](../reference/integrations.md#google-sheets-oauth2) – Nastavenie prihlasovacích údajov Google Sheets

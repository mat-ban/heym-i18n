# Google Sheets

**Google Sheets** node чете, записва и управлява данни в Google Sheets таблици чрез OAuth2. Използвайте го за автоматизиране на workflow-и с таблици — четене на отчети, записване на резултати, обновяване на тракери и др.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Google Sheets (OAuth2) |
| Изход | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `gsOperation` | string | Операция: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID на таблицата или пълен URL на Google Sheets |
| `gsSheetName` | expression | Име на sheet tab (напр. `Sheet1`). Не е задължително за `getSheetInfo`. |
| `gsStartRow` | expression | За `readRange`: първи ред с данни (1-базиран; с `gsHasHeader`, ред 1 е header). |
| `gsMaxRows` | expression | За `readRange`: максимален брой редове с данни (0 = всички). |
| `gsHasHeader` | boolean | За `readRange`: третира ред 1 като имена на колони, когато е true. |
| `gsUpdateRow` | expression | Само за `updateRange`: номер на ред в sheet (1-базиран) за обновяване (колони A–Z); ако не е зададен, се използва `gsStartRow`. Не е batchUpdate — единичен values API PUT. |
| `gsRange` | expression | Диапазон в A1 нотация (напр. `A1:D100`). Legacy примери; редакторът използва полета за редове при read/update. |
| `gsKeepHeader` | boolean | Само за `clearRange`: когато е true, ред 1 се запазва, а редовете с данни под него се изчистват (колони A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Само за `appendRows`: **Bottom** добавя след последния ред с данни; **Top** вмъква нови редове директно под ред 1 (измества данните надолу). |
| `gsValuesInputMode` | `raw` \| `selective` | За `appendRows` / `updateRange`: **Raw** = пълен JSON масив; **Selective** = един ред в sheet, само полета за колони (без A1 етикети). |
| `gsValuesSelectiveCols` | string | Selective режим: брой колони (A–Z). |
| `gsValues` | expression | JSON 2D масив от стойности (напр. `[["Name","Age"],["Alice",30]]`). Задължителен за `appendRows`, `updateRange`. |

## Spreadsheet ID

Полето `gsSpreadsheetId` приема или **самото ID** (дългият буквено-цифров низ между `/d/` и `/edit` в URL на Google Sheets), или **пълния URL** — Heym извлича ID автоматично.

## Настройка на удостоверение

Google Sheets използва модел **OAuth2 "Bring Your Own App"**. Вие предоставяте свои собствени Google Cloud OAuth2 удостоверения.

**Конфигурация на backend:** Задайте **`FRONTEND_URL`** на Heym backend на публичния URL на приложението (адресът, който потребителите въвеждат в браузъра), напр. `https://your-heym-domain`. OAuth redirect URI винаги е `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — извлича се само от тази настройка, не от request headers.

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → активирайте **Google Sheets API**.
2. Отворете **Credentials** → **Create Credentials** → **OAuth client ID** → изберете **Web application**.
3. Под **Authorized redirect URIs** добавете точно: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (например `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Копирайте **Client ID** и **Client Secret**.
5. В Heym Dashboard → **Credentials** → **New** → изберете **Google Sheets (OAuth2)**.
6. Въведете Client ID, Client Secret и име, след което натиснете **Connect**, за да завършите OAuth2 съгласието в браузърен popup.

Token-ите се обновяват автоматично на заден план — не се изисква ръчно управление на token-и.

## Операции

| Операция | Задължителни полета | Описание |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Чете стойности на клетки (A–Z); незадължителен `gsRange` в legacy workflow-и |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Добавя редове в долната част (`gsAppendPlacement` append) или под ред 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Презаписва ред(ове), започвайки от `gsUpdateRow` (A–Z); multi-row JSON записва последователни редове |
| `clearRange` | gsSpreadsheetId, gsSheetName | Изчиства всички стойности в колони A–Z за tab-а; незадължителен `gsKeepHeader` запазва първия ред |
| `getSheetInfo` | gsSpreadsheetId | Връща заглавието на таблицата и списък със sheet tab-ове |

## Справка за изхода

| Операция | Изходно поле | Тип | Описание |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Обекти за редове: ключове за колони (имена на header-и или A, B, …) плюс **`rowIndex`** (1-базиран ред в sheet) |
| `readRange` | `.total` | number | Брой върнати редове с данни |
| `appendRows` | `.updatedRange` | string | Записан диапазон |
| `appendRows` | `.updates` | number | Брой добавени редове |
| `updateRange` | `.updatedRange` | string | Записан диапазон |
| `updateRange` | `.updatedCells` | number | Брой обновени клетки |
| `clearRange` | `.clearedRange` | string | Диапазон, който беше изчистен |
| `getSheetInfo` | `.title` | string | Заглавие на таблицата |
| `getSheetInfo` | `.sheets` | array | Списък с обекти `{sheetId, title}` |

Всички операции включват `success: true` и `operation: "<name>"` в изхода.
## Пример – Четене на диапазон

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

Достъп до изхода: `$readReport.rows[0]` (обект на първия ред с данни), `$readReport.rows[0].Name` (колона по заглавие), `$readReport.rows[0].rowIndex` (индекс на реда в таблицата, започващ от 1).

## Пример – Добавяне на ред от входни данни

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

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на Google Sheets OAuth2 удостоверение
- [Интеграции с трети страни](../reference/integrations.md#google-sheets-oauth2) – Настройка на Google Sheets удостоверение

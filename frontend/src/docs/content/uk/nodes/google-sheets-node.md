# Google Sheets

**Вузол Google Sheets** зчитує, записує та керує даними в електронних таблицях Google Sheets через OAuth2. Використовуйте його для автоматизації робочих процесів з таблицями — читання звітів, журналювання результатів, оновлення трекерів тощо.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Google Sheets (OAuth2) |
| Вивід | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані Google Sheets з [Облікових даних](../tabs/credentials-tab.md) |
| `gsOperation` | string | Операція: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID таблиці або повна URL-адреса Google Sheets |
| `gsSheetName` | expression | Назва вкладки аркуша (наприклад, `Sheet1`). Не потрібно для `getSheetInfo`. |
| `gsStartRow` | expression | Для `readRange`: перший рядок даних з відліком від 1 (за наявності `gsHasHeader` рядок 1 є заголовком). |
| `gsMaxRows` | expression | Для `readRange`: максимальна кількість рядків даних (0 = усі). |
| `gsHasHeader` | boolean | Для `readRange`: якщо true, рядок 1 вважається назвами стовпців. |
| `gsUpdateRow` | expression | Лише для `updateRange`: номер рядка аркуша з відліком від 1 для оновлення (стовпці A–Z); якщо не вказано, використовується `gsStartRow`. Це не batchUpdate — один PUT-запит до values API. |
| `gsRange` | expression | Діапазон у нотації A1 (наприклад, `A1:D100`). Застарілі приклади; редактор використовує поля рядків для читання/оновлення. |
| `gsKeepHeader` | boolean | Лише для `clearRange`: якщо true, рядок 1 зберігається, а рядки даних нижче очищуються (стовпці A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Лише для `appendRows`: **Bottom** додає після останнього рядка з даними; **Top** вставляє нові рядки безпосередньо під рядком 1 (зсуваючи дані вниз). |
| `gsValuesInputMode` | `raw` \| `selective` | Для `appendRows` / `updateRange`: **Raw** = повний масив JSON; **Selective** = один рядок аркуша, лише поля стовпців (без міток A1). |
| `gsValuesSelectiveCols` | string | Режим Selective: кількість стовпців (A–Z). |
| `gsValues` | expression | Двовимірний масив значень у JSON (наприклад, `[["Name","Age"],["Alice",30]]`). Обов'язково для `appendRows`, `updateRange`. |

## ID таблиці

Поле `gsSpreadsheetId` приймає або **безпосередній ID** (довгий буквено-цифровий рядок між `/d/` та `/edit` в URL-адресі Google Sheets), або **повну URL-адресу** — Heym витягує ID автоматично.

## Налаштування облікових даних

Google Sheets використовує модель **OAuth2 "Bring Your Own App"**. Ви надаєте власні облікові дані OAuth2 Google Cloud.

**Конфігурація бекенду:** Встановіть **`FRONTEND_URL`** на бекенді Heym як публічну URL-адресу застосунку (адресу, яку користувачі вводять у браузері), наприклад `https://your-heym-domain`. URI перенаправлення OAuth завжди має вигляд `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — він формується виключно з цього налаштування, а не із заголовків запиту.

1. Перейдіть до [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → увімкніть **Google Sheets API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → виберіть **Web application**.
3. У розділі **Authorized redirect URIs** додайте точно: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (наприклад, `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Скопіюйте **Client ID** та **Client Secret**.
5. У Heym Dashboard → **Облікові дані** → **New** → виберіть **Google Sheets (OAuth2)**.
6. Введіть Client ID, Client Secret та назву, потім натисніть **Connect**, щоб завершити згоду OAuth2 у спливаючому вікні браузера.

Token-и оновлюються автоматично у фоновому режимі — ручне керування token-ами не потрібне.

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Читання значень комірок (A–Z); необов'язковий `gsRange` у застарілих процесах |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Додавання рядків унизу (`gsAppendPlacement` append) або під рядком 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Перезапис рядка(ів), починаючи з `gsUpdateRow` (A–Z); багаторядковий JSON записує послідовні рядки |
| `clearRange` | gsSpreadsheetId, gsSheetName | Очищення всіх значень у стовпцях A–Z для вкладки; необов'язковий `gsKeepHeader` зберігає перший рядок |
| `getSheetInfo` | gsSpreadsheetId | Отримання назви таблиці та списку вкладок аркушів |

## Довідник виводу

| Операція | Поле виводу | Тип | Опис |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Об'єкти рядків: ключі стовпців (назви заголовків або A, B, …) плюс **`rowIndex`** (рядок аркуша з відліком від 1) |
| `readRange` | `.total` | number | Кількість повернутих рядків даних |
| `appendRows` | `.updatedRange` | string | Записаний діапазон |
| `appendRows` | `.updates` | number | Кількість доданих рядків |
| `updateRange` | `.updatedRange` | string | Записаний діапазон |
| `updateRange` | `.updatedCells` | number | Кількість оновлених комірок |
| `clearRange` | `.clearedRange` | string | Діапазон, який було очищено |
| `getSheetInfo` | `.title` | string | Назва таблиці |
| `getSheetInfo` | `.sheets` | array | Список об'єктів `{sheetId, title}` |

Усі операції включають `success: true` та `operation: "<name>"` у виводі.
## Приклад – Читання діапазону

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

Доступ до вихідних даних: `$readReport.rows[0]` (об'єкт першого рядка даних), `$readReport.rows[0].Name` (стовпець за заголовком), `$readReport.rows[0].rowIndex` (індекс рядка аркуша, починаючи з 1).

## Приклад – Додавання рядка з вхідних даних

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

## Пов'язані розділи

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання облікових даних Google Sheets OAuth2
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Налаштування облікових даних Google Sheets

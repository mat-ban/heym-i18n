# Grist

Вузол **Grist** призначений для читання, запису та керування даними в електронних таблицях Grist. Використовуйте його для CRUD-операцій, пакетних оновлень та автоматизації роботи з таблицями.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихідні дані | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані Grist з розділу [Облікові дані](../tabs/credentials-tab.md) |
| `gristOperation` | string | Операція: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Ідентифікатор документа (з URL-адреси Grist) |
| `gristTableId` | expression | Ідентифікатор таблиці |
| `gristRecordId` | expression | Ідентифікатор запису (для операцій з одним записом) |
| `gristRecordData` | JSON string | Значення полів для створення або оновлення. Використовуйте **ідентифікатори стовпців** (наприклад, `User_Name`), а не їхні відображувані назви. |
| `gristRecordsData` | JSON string | Масив записів для пакетних операцій |
| `gristFilter` | JSON string | Фільтр: `{"Column_ID": [values]}` |
| `gristSort` | string | Сортування: `Column_ID` або `-Column_ID` (за спаданням) |
| `gristLimit` | number | Максимальна кількість записів (типово: 100) |

## Ідентифікатори стовпців проти відображуваних назв

У `gristRecordData` та фільтрах використовуйте **ідентифікатори стовпців** (з підкресленнями, наприклад, `User_Name`), а не їхні відображувані назви. Щоб дізнатися ідентифікатори стовпців, скористайтеся операцією `listColumns`.

## Приклад – Отримання записів

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Приклад – Створення запису

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Пов'язані розділи

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання API-ключа Grist
- [Сторонні інтеграції](../reference/integrations.md#grist) – Налаштування облікових даних Grist

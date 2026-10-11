# Grist

**Grist** node чете, записва и управлява данни в Grist електронни таблици. Използвайте го за CRUD операции, групови актуализации и автоматизация на електронни таблици.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Grist удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `gristOperation` | string | Операция: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID на документ (от Grist URL) |
| `gristTableId` | expression | ID на таблица |
| `gristRecordId` | expression | ID на запис (операции с един запис) |
| `gristRecordData` | JSON string | Стойности на полета за създаване/актуализация. Използвайте **column IDs** (напр. `User_Name`), не етикети. |
| `gristRecordsData` | JSON string | Масив от записи за групови операции |
| `gristFilter` | JSON string | Филтър: `{"Column_ID": [values]}` |
| `gristSort` | string | Сортиране: `Column_ID` или `-Column_ID` (низходящо) |
| `gristLimit` | number | Максимален брой записи (по подразбиране: 100) |

## Column IDs срещу етикети

Използвайте **column IDs** (с долни черти, напр. `User_Name`) в `gristRecordData` и филтрите, не етикети за показване. Използвайте `listColumns`, за да откриете column IDs.

## Пример – Get Records

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

## Пример – Create Record

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

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на Grist API key
- [Интеграции с трети страни](../reference/integrations.md#grist) – Настройка на Grist удостоверение

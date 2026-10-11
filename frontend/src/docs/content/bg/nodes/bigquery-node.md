# BigQuery

**BigQuery** node изпълнява SQL заявки и вмъква редове в набори от данни на Google BigQuery чрез BigQuery REST API v2. Използвайте го за заявки към големи аналитични набори от данни или за поточно предаване на редове в таблици от данните на workflow.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | BigQuery (OAuth2) |
| Изход | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | BigQuery удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `bqOperation` | string | Операция: `query` или `insertRows` |
| `bqProjectId` | expression | ID на проекта в Google Cloud (напр. `my-gcp-project`) |
| `bqQuery` | expression | Низ на SQL заявката. Задължителен за `query`. |
| `bqMaxResults` | string | Максимален брой редове, върнати от `query` (по подразбиране `1000`). |
| `bqDatasetId` | expression | ID на набора от данни (напр. `my_dataset`). Задължителен за `insertRows`. |
| `bqTableId` | expression | ID на таблицата (напр. `my_table`). Задължителен за `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | За `insertRows`: **Raw** = пълен JSON масив; **Selective** = единичен ред като двойки ключ-стойност. |
| `bqRows` | expression | JSON масив от обекти-редове за raw режим (напр. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Двойки ключ-стойност за selective режим. Всеки ключ е име на колона; всяка стойност е expression. |

## Настройка на удостоверение

BigQuery използва модел **OAuth2 "Bring Your Own App"**. Вие предоставяте свои собствени OAuth2 удостоверения за Google Cloud.

**Конфигурация на backend:** Задайте **`FRONTEND_URL`** на Heym backend на публичния URL на приложението (адресът, който потребителите въвеждат в браузъра), напр. `https://your-heym-domain`. OAuth redirect URI винаги е `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → активирайте **BigQuery API**.
2. Отворете **Credentials** → **Create Credentials** → **OAuth client ID** → изберете **Web application**.
3. В **Authorized redirect URIs** добавете точно: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Копирайте **Client ID** и **Client Secret**.
5. В Heym Dashboard → **Credentials** → **New** → изберете **BigQuery (OAuth2)**.
6. Въведете Client ID, Client Secret и име, след което натиснете **Connect**, за да завършите OAuth2 съгласието в изскачащ прозорец на браузъра.

Token-ите се обновяват автоматично на заден план — не се изисква ръчно управление на token.

## Операции

| Операция | Задължителни полета | Описание |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Изпълнява SQL заявка и връща редове |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows или bqMappings | Вмъква един или повече редове чрез streaming insertAll API |

## Справка за изхода

| Операция | Поле на изхода | Тип | Описание |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Масив от обекти-редове (име на колона → стойност) |
| `query` | `.total` | number | Брой върнати редове |
| `query` | `.schema` | array | Полета на схемата на таблицата |
| `insertRows` | `.insertedCount` | number | Брой успешно вмъкнати редове |
| `insertRows` | `.errors` | array | Грешки при вмъкване за всеки ред (празно при пълен успех) |

## Пример – Изпълнение на заявка

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Достъп до изхода: `$getUsers.rows` (масив от обекти-редове), `$getUsers.rows[0].email`, `$getUsers.total`.

## Пример – Вмъкване на ред

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове node
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне на BigQuery OAuth2 удостоверение
- [Google Sheets](./google-sheets-node.md) – Подобен OAuth2 модел за данни от електронни таблици
- [Third-Party Integrations](../reference/integrations.md) – Настройка на удостоверения за интеграции

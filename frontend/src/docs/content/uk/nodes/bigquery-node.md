# BigQuery

Вузол **BigQuery** виконує SQL-запити та вставляє рядки в набори даних Google BigQuery через BigQuery REST API v2. Використовуйте його для запитів до великих аналітичних наборів даних або потокового додавання рядків до таблиць із даних workflow.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | BigQuery (OAuth2) |
| Вивід | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані BigQuery з [Облікових даних](../tabs/credentials-tab.md) |
| `bqOperation` | string | Операція: `query` або `insertRows` |
| `bqProjectId` | expression | Ідентифікатор проєкту Google Cloud (наприклад, `my-gcp-project`) |
| `bqQuery` | expression | Рядок SQL-запиту. Обов'язковий для `query`. |
| `bqMaxResults` | string | Максимальна кількість рядків, що повертаються `query` (типово `1000`). |
| `bqDatasetId` | expression | Ідентифікатор набору даних (наприклад, `my_dataset`). Обов'язковий для `insertRows`. |
| `bqTableId` | expression | Ідентифікатор таблиці (наприклад, `my_table`). Обов'язковий для `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Для `insertRows`: **Raw** = повний масив JSON; **Selective** = один рядок як пари ключ-значення. |
| `bqRows` | expression | Масив JSON з об'єктами рядків для режиму raw (наприклад, `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Пари ключ-значення для режиму selective. Кожен ключ — це назва стовпця; кожне значення — це expression. |

## Налаштування облікових даних

BigQuery використовує модель **OAuth2 "Bring Your Own App"**. Ви надаєте власні облікові дані OAuth2 Google Cloud.

**Конфігурація бекенду:** Встановіть **`FRONTEND_URL`** на бекенді Heym як публічну URL-адресу застосунку (адресу, яку користувачі вводять у браузері), наприклад `https://your-heym-domain`. URI перенаправлення OAuth завжди має вигляд `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Перейдіть до [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → увімкніть **BigQuery API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → виберіть **Web application**.
3. У розділі **Authorized redirect URIs** додайте точно: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Скопіюйте **Client ID** та **Client Secret**.
5. У Heym Dashboard → **Credentials** → **New** → виберіть **BigQuery (OAuth2)**.
6. Введіть Client ID, Client Secret та назву, потім натисніть **Connect**, щоб завершити згоду OAuth2 у спливаючому вікні браузера.

Token-и оновлюються автоматично у фоновому режимі — ручне керування token-ами не потрібне.

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Виконати SQL-запит і повернути рядки |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows або bqMappings | Вставити один або кілька рядків через потоковий API insertAll |

## Довідник виводу

| Операція | Поле виводу | Тип | Опис |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Масив об'єктів рядків (назва стовпця → значення) |
| `query` | `.total` | number | Кількість повернутих рядків |
| `query` | `.schema` | array | Поля схеми таблиці |
| `insertRows` | `.insertedCount` | number | Кількість успішно вставлених рядків |
| `insertRows` | `.errors` | array | Помилки вставлення для кожного рядка (порожній за повного успіху) |

## Приклад – Виконання запиту

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

Доступ до виводу: `$getUsers.rows` (масив об'єктів рядків), `$getUsers.rows[0].email`, `$getUsers.total`.

## Приклад – Вставлення рядка

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

## Пов'язане

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Подібний шаблон OAuth2 для даних електронних таблиць
- [Сторонні інтеграції](../reference/integrations.md) – Налаштування облікових даних інтеграції

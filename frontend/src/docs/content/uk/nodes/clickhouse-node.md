# ClickHouse

Вузол **ClickHouse** виконує операції CRUD, підрахунку та raw SQL щодо зовнішньої бази даних [ClickHouse](https://clickhouse.com/) через її HTTP-інтерфейс. Використовуйте його, щоб записувати події до таблиці ClickHouse з workflow, читати або агрегувати аналітичні дані чи виконувати довільний SQL — без ручного написання HTTP-запитів.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | ClickHouse |
| Вивід | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані ClickHouse з [Облікових даних](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Операція: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` або `upsert` |
| `clickhouseTable` | expression | Проста назва таблиці. Обов'язкова для всіх операцій, крім `query`. |
| `clickhouseQuery` | expression | Raw SQL для `query`. `SELECT`/`SHOW`/`DESCRIBE` повертають рядки; інші інструкції виконуються як команди. |
| `clickhouseFilter` | expression | JSON-об'єкт фільтрів за рівністю, наприклад `{"status":"active"}`. Використовується операціями `find`, `count`, `update` та `remove`. Значення параметризуються. |
| `clickhouseLimit` | string | Максимальна кількість рядків для `find` / `getAll` (`0` = без обмежень, без клаузи LIMIT). Типово `100`. |
| `clickhouseSort` | expression | Необов'язковий `column` або `column ASC\|DESC` для `find` |
| `clickhouseRowId` | expression | Значення, яке зіставляється зі стовпцем `id` таблиці для `getById` |
| `clickhouseInputMode` | string | Для `insert`/`upsert`: режим `raw` (JSON-масив) або режим `selective` (пари ключ/значення) |
| `clickhouseData` | expression | JSON-масив об'єктів рядків для `insert`/`upsert` або JSON-об'єкт значень стовпців для `update` |
| `clickhouseMappings` | array | Пари `{key, value}`, які використовуються, коли `clickhouseInputMode` має значення `selective` |

## Налаштування облікових даних

Створіть облікові дані **ClickHouse** на вкладці [Облікові дані](../tabs/credentials-tab.md) із такими параметрами:

1. **Host** — HTTP-хост без схеми, наприклад `your-instance.clickhouse.cloud`
2. **Port** — порт HTTP-інтерфейсу (`8443` для HTTPS, `8123` для HTTP)
3. **Username** / **Password** — типово `default` з порожнім паролем
4. **Database** — типово `default`
5. **Secure** — увімкніть для HTTPS (ClickHouse Cloud)

Вузол підключається через офіційний HTTP-клієнт `clickhouse-connect`. Скористайтеся кнопкою **Test connection** у діалозі облікових даних, щоб перевірити доступність перед збереженням.

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Виконати raw SQL. `SELECT` повертає `{rows, count}`; інші інструкції повертають `{result}`. |
| `find` | `clickhouseTable` | Читати рядки з необов'язковими фільтрами за рівністю, сортуванням і обмеженням |
| `getAll` | `clickhouseTable` | Читати рядки до встановленого обмеження без фільтра |
| `count` | `clickhouseTable` | Підрахувати рядки, за потреби з фільтром |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Читати один рядок за його стовпцем `id` |
| `insert` | `clickhouseTable`, `clickhouseData` або mappings | Вставити один або кілька рядків |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Оновити відповідні рядки через `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Видалити відповідні рядки через `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` або mappings | Вставити рядки (передбачається таблиця `ReplacingMergeTree`) |

## Синтаксис фільтрів

`clickhouseFilter` — це плоский JSON-об'єкт перевірок рівності стовпців. Значення надсилаються як зв'язані параметри запиту, тому вони захищені від ін'єкцій.

```json
{ "status": "active", "tenant_id": 42 }
```

Це компілюється в `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Конструктор фільтрів підтримує лише рівність — для діапазонів, об'єднань чи агрегацій використовуйте операцію `query` з raw SQL.

## Режими введення (insert / upsert)

- **JSON-масив** (`raw`): надайте JSON-масив об'єктів рядків у `clickhouseData`. Ключі, відсутні в конкретному рядку, вставляються як `NULL`. Набір стовпців — це об'єднання ключів усіх рядків.
- **Ключ-значення** (`selective`): після вибору облікових даних і таблиці редактор виявляє стовпці таблиці та створює одне поле значення для кожного стовпця. За одне виконання вставляється один рядок; кожне значення підтримує вирази.

## Мутації та семантика ClickHouse

ClickHouse — це OLAP-база даних, тому операції запису на рівні рядків поводяться інакше, ніж у OLTP-сховищі:

- **`update`** виконує `ALTER TABLE … UPDATE`, а **`remove`** — `DELETE FROM`. Обидві операції є **асинхронними мутаціями** — вони застосовуються з часом і є порівняно затратними. Надавайте перевагу пакетному запису над частими мутаціями окремих рядків.
- **`upsert`** виконує `INSERT`. Щоб отримати поведінку злиття за ключем, використовуйте для таблиці рушій `ReplacingMergeTree`.
- **`getById`** передбачає наявність у таблиці стовпця `id`.
- `update` та `remove` вимагають непорожнього `clickhouseFilter`, щоб уникнути мутацій усієї таблиці.

## Довідник виводу

| Поле виводу | Тип | Опис |
|-------------|------|-------------|
| `.rows` | array | Повернені об'єкти рядків (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Кількість рядків (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Один рядок або `null` (`getById`) |
| `.result` | string | Підсумок команди для `query`, що не є SELECT |
| `.success` | boolean | Чи успішно виконано операцію |
## Приклад – Вставлення події

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Приклад – Підрахунок активних користувачів

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Доступ до вихідних даних: `$activeCount.count`.

## Приклад – Запит щоденного звіту

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Доступ до вихідних даних: `$dailyReport.rows`, `$dailyReport.count`.

## Пов'язані розділи

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних ClickHouse
- [Сторонні інтеграції](../reference/integrations.md) – Налаштування облікових даних для інтеграцій

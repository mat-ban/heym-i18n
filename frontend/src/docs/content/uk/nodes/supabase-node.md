# Supabase

**Вузол Supabase** зчитує та змінює таблиці, що надаються через PostgREST API проєкту Supabase. Використовуйте його, коли потрібен доступ workflow до стану застосунку на базі SQL без написання HTTP-запитів вручну.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Supabase |
| Вихід | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані Supabase з [Облікових даних](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Операція: `select`, `insert`, `update`, `upsert` або `delete` |
| `supabaseSchema` | expression | Назва схеми. Якщо порожня, вузол використовує схему за замовчуванням з облікових даних, а потім `public`. |
| `supabaseTable` | expression | Проста назва таблиці для запиту або зміни. Схему вказуйте в `supabaseSchema`, а не тут. |
| `supabaseSelectColumns` | expression | Список вибірки PostgREST, розділений комами, для `select` (за замовчуванням `*`) |
| `supabaseFilter` | expression | Об'єкт фільтра JSON. Підтримує точні збіги, а також об'єкти операторів і логічні групи, наприклад `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` або `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Максимальна кількість рядків для повернення в `select` (`0` = отримати всі відповідні рядки із серверною пагінацією, від'ємні значення повертаються до `100`) |
| `supabaseOrderBy` | expression | Необов'язковий стовпець для сортування в `select` |
| `supabaseAscending` | boolean | Сортування за зростанням, коли `true`, за спаданням, коли `false` |
| `supabaseRowsInputMode` | string | Для `insert`/`upsert`: режим `raw` JSON-масиву або `auto` для автоматичного зіставлення єдиного вхідного потоку |
| `supabaseDataInputMode` | string | Для `update`: режим `raw` JSON-об'єкта або `auto` для автоматичного зіставлення єдиного вхідного потоку |
| `supabaseIgnoredInputFields` | string | Необов'язковий список назв полів, розділених комами, які слід пропустити під час автоматичного зіставлення вхідних даних |
| `supabaseRows` | expression | JSON-масив об'єктів рядків для `insert` та `upsert` |
| `supabaseOnConflict` | expression | Необов'язкові цільові стовпці конфлікту, розділені комами, для `upsert`, наприклад `id` або `tenant_id,email` |
| `supabaseData` | expression | JSON-об'єкт оновлених значень стовпців для `update` |

## Налаштування облікових даних

Створіть облікові дані **Supabase** на [вкладці Облікові дані](../tabs/credentials-tab.md) із:

1. Вашим **Project URL**, наприклад `https://your-project.supabase.co`
2. **API key** з доступом до таблиць, які має використовувати цей workflow
3. Необов'язковою **схемою за замовчуванням** (типово `public`)

Вузол звертається до endpoint PostgREST Supabase за адресою `/rest/v1/<table>`.
Використовуйте `supabaseTable` лише для назви таблиці, наприклад `users` або `profiles`. Не передавайте туди `schema.table`, `rpc/...` чи інші шляхи API.

Коли вибрано дійсні облікові дані Supabase, редактор може виявляти доступні таблиці та стовпці
таблиць безпосередньо з метаданих PostgREST OpenAPI. Скористайтеся спадним списком **discovered tables**, щоб
вибрати таблицю, та **column chips** під **Select Columns**, щоб швидко побудувати список вибірки.

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Зчитати рядки з необов'язковими фільтрами точного збігу, обмеженням і сортуванням |
| `insert` | `supabaseTable`, `supabaseRows` або автоматичне зіставлення вхідних даних | Вставити один або кілька рядків |
| `update` | `supabaseTable`, `supabaseData` або автоматичне зіставлення вхідних даних, `supabaseFilter` | Оновити рядки, що відповідають фільтру |
| `upsert` | `supabaseTable`, `supabaseRows` або автоматичне зіставлення вхідних даних | Вставити або об'єднати рядки за семантикою upsert Supabase. Використовуйте `supabaseOnConflict`, коли потрібна явна ціль конфлікту. |
| `delete` | `supabaseTable`, `supabaseFilter` | Видалити рядки, що відповідають фільтру |

## Синтаксис фільтра

`supabaseFilter` компілює структурований JSON у параметри запиту PostgREST.

- Точний збіг: `{"status":"active"}`
- Порівняння: `{"created_at":{"gte":"2026-01-01"}}`
- Належність до множини: `{"status":{"in":["active","paused"]}}`
- Збіг за шаблоном: `{"email":{"ilike":"*@example.com"}}`
- Логічне АБО: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Логічне І: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Для кількох операторів над одним полем краще використовувати логічну групу:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Пагінація

`select` тепер виконує справжню серверну пагінацію щодо PostgREST.

- `supabaseLimit: "0"` отримує всі відповідні рядки сторінка за сторінкою
- Значення `supabaseLimit` понад 1000 автоматично розгалужуються на кілька запитів
- Результати об'єднуються назад в один масив `.rows`, а `.count` залишається загальною кількістю відповідних рядків

Під час читання великих таблиць задайте стабільний `supabaseOrderBy`, щоб межі сторінок залишалися передбачуваними.

## Автоматичне зіставлення вхідних даних

Для `insert`, `upsert` та `update` перемкніть вузол у режим **Auto-map input**, коли єдиний
вхідний вузол уже видає потрібну для запису структуру.

- Єдиний об'єкт стає одним рядком або одним payload оновлення
- Масив об'єктів стає багатьма рядками для `insert` / `upsert`
- Вхідний об'єкт із масивом `rows` повторно використовує цей масив безпосередньо
- `supabaseIgnoredInputFields` дає змогу відкинути такі поля, як `id`, `created_at` або `success`
## Довідник вихідних даних

| Поле вихідних даних | Тип | Опис |
|-------------|------|-------------|
| `.rows` | array | Повернені об'єкти рядків |
| `.count` | number | Кількість повернених або змінених рядків |
| `.success` | boolean | Чи успішно виконано операцію |

## Приклад – Вибір активних користувачів

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Доступ до вихідних даних: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Приклад – Upsert рядка профілю

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Пов'язані матеріали

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних Supabase
- [Сторонні інтеграції](../reference/integrations.md) – Налаштування облікових даних для інтеграцій

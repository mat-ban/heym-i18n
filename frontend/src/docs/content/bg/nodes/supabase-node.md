# Supabase

**Supabase** node чете и променя таблици, експонирани от PostgREST API на проект в Supabase. Използвайте го, когато искате workflow достъп до SQL-базирано състояние на приложението, без да пишете HTTP заявки на ръка.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Supabase |
| Изход | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | Supabase удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Операция: `select`, `insert`, `update`, `upsert` или `delete` |
| `supabaseSchema` | expression | Име на схема. Ако е празно, node използва схемата по подразбиране на удостоверението, след което `public`. |
| `supabaseTable` | expression | Просто име на таблица за заявка или промяна. Поставете схемата в `supabaseSchema`, не тук. |
| `supabaseSelectColumns` | expression | Разделен със запетаи PostgREST select списък за `select` (по подразбиране `*`) |
| `supabaseFilter` | expression | JSON филтър обект. Поддържа точни съвпадения плюс операторни обекти и логически групи, напр. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` или `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Максимален брой редове за връщане при `select` (`0` = извличане на всички съвпадащи редове със сървърна пагинация, отрицателните стойности се връщат към `100`) |
| `supabaseOrderBy` | expression | Опционална колона за сортиране при `select` |
| `supabaseAscending` | boolean | Сортиране във възходящ ред при `true`, в низходящ при `false` |
| `supabaseRowsInputMode` | string | За `insert`/`upsert`: `raw` JSON масив режим или `auto` за автоматично преобразуване на единствения upstream вход |
| `supabaseDataInputMode` | string | За `update`: `raw` JSON обект режим или `auto` за автоматично преобразуване на единствения upstream вход |
| `supabaseIgnoredInputFields` | string | Опционални имена на полета, разделени със запетаи, които да се пропуснат при автоматично преобразуване на входните данни |
| `supabaseRows` | expression | JSON масив от обекти-редове за `insert` и `upsert` |
| `supabaseOnConflict` | expression | Опционални колони-цели за конфликт, разделени със запетаи, за `upsert`, например `id` или `tenant_id,email` |
| `supabaseData` | expression | JSON обект с актуализирани стойности на колони за `update` |

## Настройка на удостоверение

Създайте **Supabase** удостоверение в [раздела Удостоверения](../tabs/credentials-tab.md) с:

1. Вашия **Project URL**, например `https://your-project.supabase.co`
2. **API key** с достъп до таблиците, които този workflow трябва да използва
3. Опционална **схема по подразбиране** (по подразбиране `public`)

Node комуникира със Supabase PostgREST endpoint на `/rest/v1/<table>`.
Използвайте `supabaseTable` само за таблицата, като например `users` или `profiles`. Не подавайте `schema.table`, `rpc/...` или други API пътища там.

Когато е избрано валидно Supabase удостоверение, редакторът може да открие експонираните таблици и колони на таблиците директно от PostgREST OpenAPI метаданните. Използвайте падащото меню **discovered tables**, за да изберете таблица, и **column chips** под **Select Columns**, за да изградите бързо select списък.

## Операции

| Операция | Задължителни полета | Описание |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Четене на редове с опционални филтри за точно съвпадение, лимит и подредба |
| `insert` | `supabaseTable`, `supabaseRows` или автоматично преобразуване на вход | Вмъкване на един или повече редове |
| `update` | `supabaseTable`, `supabaseData` или автоматично преобразуване на вход, `supabaseFilter` | Актуализиране на редове, съвпадащи с филтъра |
| `upsert` | `supabaseTable`, `supabaseRows` или автоматично преобразуване на вход | Вмъкване или сливане на редове чрез Supabase upsert семантика. Използвайте `supabaseOnConflict`, когато е нужна изрична цел за конфликт. |
| `delete` | `supabaseTable`, `supabaseFilter` | Изтриване на редове, съвпадащи с филтъра |

## Синтаксис на филтъра

`supabaseFilter` компилира структуриран JSON в PostgREST параметри на заявката.

- Точно съвпадение: `{"status":"active"}`
- Сравнение: `{"created_at":{"gte":"2026-01-01"}}`
- Принадлежност: `{"status":{"in":["active","paused"]}}`
- Съвпадение по шаблон: `{"email":{"ilike":"*@example.com"}}`
- Логическо ИЛИ: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Логическо И: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

За множество оператори върху едно и също поле предпочитайте логическа група:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Пагинация

`select` вече извършва истинска сървърна пагинация спрямо PostgREST.

- `supabaseLimit: "0"` извлича всички съвпадащи редове страница по страница
- Стойности на `supabaseLimit` над 1000 автоматично се разгръщат в множество заявки
- Резултатите се обединяват обратно в един `.rows` масив и `.count` остава общият брой съвпадащи редове

При четене на големи таблици задайте стабилен `supabaseOrderBy`, за да поддържате границите на страниците предвидими.

## Автоматично преобразуване на вход

За `insert`, `upsert` и `update` превключете node на **Auto-map input**, когато единственият
upstream node вече извежда формата, който искате да запишете.

- Един обект става един ред или един update payload
- Масив от обекти става много редове за `insert` / `upsert`
- Upstream обект с масив `rows` използва директно този масив
- `supabaseIgnoredInputFields` Ви позволява да пропуснете полета като `id`, `created_at` или `success`
## Справка за изходните данни

| Изходно поле | Тип | Описание |
|-------------|------|-------------|
| `.rows` | array | Върнати обекти на редове |
| `.count` | number | Брой върнати или засегнати редове |
| `.success` | boolean | Дали операцията е успешна |

## Пример – Избор на активни потребители

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

Достъп до изходните данни: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Пример – Upsert на ред в профил

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

## Свързани

- [Типове възли](../reference/node-types.md) – Преглед на всички типове възли
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на Supabase удостоверения
- [Интеграции с трети страни](../reference/integrations.md) – Настройка на удостоверения за интеграции

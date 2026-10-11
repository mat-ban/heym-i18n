# ClickHouse

**ClickHouse** node изпълнява CRUD, count и raw SQL операции срещу външна [ClickHouse](https://clickhouse.com/) база данни през нейния HTTP интерфейс. Използвайте го, за да записвате събития в ClickHouse таблица от workflow, да четете или агрегирате аналитични данни, или да изпълнявате произволен SQL — без ръчно писане на HTTP заявки.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | ClickHouse |
| Изход | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Операция: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` или `upsert` |
| `clickhouseTable` | expression | Просто име на таблица. Задължително за всяка операция с изключение на `query`. |
| `clickhouseQuery` | expression | Raw SQL за `query`. `SELECT`/`SHOW`/`DESCRIBE` връщат редове; другите statements се изпълняват като команди. |
| `clickhouseFilter` | expression | JSON обект с филтри за равенство, напр. `{"status":"active"}`. Използва се от `find`, `count`, `update` и `remove`. Стойностите са параметризирани. |
| `clickhouseLimit` | string | Максимален брой редове за `find` / `getAll` (`0` = неограничено, без LIMIT клауза). По подразбиране `100`. |
| `clickhouseSort` | expression | Опционално `column` или `column ASC\|DESC` за `find` |
| `clickhouseRowId` | expression | Стойност, съпоставяна с колоната `id` на таблицата за `getById` |
| `clickhouseInputMode` | string | За `insert`/`upsert`: режим `raw` с JSON масив или режим `selective` с key/value полета |
| `clickhouseData` | expression | JSON масив от обекти-редове за `insert`/`upsert`, или JSON обект със стойности на колони за `update` |
| `clickhouseMappings` | array | Двойки `{key, value}`, използвани когато `clickhouseInputMode` е `selective` |

## Настройка на удостоверение

Създайте **ClickHouse** удостоверение в [таба Удостоверения](../tabs/credentials-tab.md) със:

1. **Host** — HTTP хоста без схема, например `your-instance.clickhouse.cloud`
2. **Port** — портът на HTTP интерфейса (`8443` за HTTPS, `8123` за HTTP)
3. **Username** / **Password** — по подразбиране `default` с празна парола
4. **Database** — по подразбиране `default`
5. **Secure** — включете за HTTPS (ClickHouse Cloud)

Node се свързва чрез официалния `clickhouse-connect` HTTP клиент. Използвайте **Test connection** в диалога за удостоверение, за да проверите достъпността преди запазване.

## Операции

| Операция | Задължителни полета | Описание |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Изпълнява raw SQL. `SELECT` връща `{rows, count}`; другите statements връщат `{result}`. |
| `find` | `clickhouseTable` | Чете редове с опционални филтри за равенство, сортиране и лимит |
| `getAll` | `clickhouseTable` | Чете редове до лимита без филтър |
| `count` | `clickhouseTable` | Брои редове, опционално филтрирани |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Чете един ред по неговата колона `id` |
| `insert` | `clickhouseTable`, `clickhouseData` или mappings | Вмъква един или повече редове |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Обновява съвпадащи редове чрез `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Изтрива съвпадащи редове чрез `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` или mappings | Вмъква редове (предполага таблица `ReplacingMergeTree`) |

## Синтаксис на филтрите

`clickhouseFilter` е плосък JSON обект с проверки за равенство по колони. Стойностите се изпращат като bound query параметри, така че са защитени срещу injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Това се компилира до `WHERE status = {…:String} AND tenant_id = {…:Int64}`. В конструктора на филтри се поддържа само равенство — за диапазони, joins или агрегации използвайте операцията `query` с raw SQL.

## Режими на входни данни (insert / upsert)

- **JSON масив** (`raw`): предоставете JSON масив от обекти-редове в `clickhouseData`. Ключове, които липсват в даден ред, се вмъкват като `NULL`. Наборът от колони е обединението на ключовете от всички редове.
- **Key-value** (`selective`): след като изберете удостоверение и таблица, редакторът открива колоните на таблицата и създава по едно поле за стойност на колона. На всяко изпълнение се вмъква един ред; всяка стойност поддържа expressions.

## Мутации и семантика на ClickHouse

ClickHouse е OLAP база данни, така че записът на ниво ред се държи различно от OLTP хранилище:

- **`update`** изпълнява `ALTER TABLE … UPDATE`, а **`remove`** изпълнява `DELETE FROM`. И двете са **асинхронни мутации** — прилагат се в крайна сметка и са сравнително скъпи. Предпочитайте пакетни записи пред чести мутации на отделни редове.
- **`upsert`** извършва `INSERT`. За поведение на merge-on-key, използвайте таблица с engine `ReplacingMergeTree`.
- **`getById`** предполага, че таблицата има колона `id`.
- `update` и `remove` изискват непразен `clickhouseFilter`, за да се избегнат мутации върху цялата таблица.

## Справка за изхода

| Изходно поле | Тип | Описание |
|-------------|------|-------------|
| `.rows` | array | Върнати обекти-редове (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Брой редове (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Един ред или `null` (`getById`) |
| `.result` | string | Обобщение на командата за `query` без SELECT |
| `.success` | boolean | Дали операцията е успешна |
## Пример – Вмъкване на събитие

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

## Пример – Броене на активни потребители

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

Достъп до изхода: `$activeCount.count`.

## Пример – Заявка за дневен отчет

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

Достъп до изхода: `$dailyReport.rows`, `$dailyReport.count`.

## Свързани

- [Типове възли](../reference/node-types.md) – Преглед на всички типове възли
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на ClickHouse удостоверения
- [Интеграции с трети страни](../reference/integrations.md) – Настройка на удостоверения за интеграции

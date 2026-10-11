# DataTable

**DataTable** node чете, записва и управлява данни в Heym DataTables. Използвайте го за CRUD операции върху първостранно структурирано хранилище без външни удостоверения.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable от [DataTable tab](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Операция: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID на ред (за getById, update, remove) |
| `dataTableData` | JSON string | Стойности на колони: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Филтър (find/upsert/count). `find` и `count` поддържат оператори `{"age": {"$gt": 18}}`; `upsert` използва точно съвпадение `{"column_name": "value"}` |
| `dataTableSort` | string | Колона за сортиране, префикс `-` за низходящо |
| `dataTableLimit` | number | Максимален брой върнати редове (по подразбиране: 100) |

## Операции

| Операция | Задължителни полета | Описание |
|-----------|----------------|-------------|
| `find` | dataTableId | Намира редове, съответстващи на незадължителен операторен филтър, с незадължително сортиране/ограничение |
| `getAll` | dataTableId | Връща всички редове с незадължително сортиране/ограничение |
| `count` | dataTableId | Преброява редове, съответстващи на незадължителен операторен филтър (преброява се в базата данни; връща само число) |
| `getById` | dataTableId, dataTableRowId | Връща един ред по UUID |
| `insert` | dataTableId, dataTableData | Вмъква нов ред |
| `update` | dataTableId, dataTableRowId, dataTableData | Актуализира ред (обединява данни) |
| `remove` | dataTableId, dataTableRowId | Изтрива ред |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Актуализира при намерено съвпадение, вмъква в противен случай |

## Пример - Намиране на редове

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Пример - Вмъкване на ред

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Пример - Преброяване на редове

Преброява редове, съответстващи на условие, в един node, вместо `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Резултатът е достъпен като `$activeAdults.count`. Празен или пропуснат филтър преброява всеки ред.

### Оператори за филтриране при find и count

Във филтър за `find` или `count` обикновена стойност означава равенство; обектна стойност прилага оператор:

| Оператор | Значение |
|----------|---------|
| `$eq` (или обикновена стойност) | Равно на |
| `$ne` | Различно от |
| `$gt`, `$gte`, `$lt`, `$lte` | Сравнения по-голямо/по-малко (числови за колони от тип `number`, иначе текстови) |
| `$contains` | Търсене на подниз без значение от регистъра |
| `$in` | Стойността е в подадения масив |

Пример с комбиниране на няколко: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Непознати оператори се игнорират. Филтрите за `upsert` все още използват стойности с точно съвпадение, за да намерят реда за актуализация.

Може също да филтрирате по метаданни на реда — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — които се съхраняват като реални колони, а не във Вашите данни. За дати подайте пълна стойност за сравнения на диапазон (напр. `{"created_at": {"$gt": "2026-06-04"}}`) или използвайте `$contains` за частично текстово съвпадение (напр. `{"created_at": {"$contains": "2026-06-04"}}`). Ако някоя от Вашите собствени колони е именувана също като поле за метаданни, колоната с данни има предимство.

## Достъп до изхода

- `$nodeLabel.success` - Булев статус на успех
- `$nodeLabel.rows` - Масив от редове (find, getAll)
- `$nodeLabel.row` - Единичен обект ред (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Достъп до конкретна стойност на колона
- `$nodeLabel.count` - Брой редове (върнати редове за find/getAll; общ брой съвпадащи редове за count)
- `$nodeLabel.id` - UUID на ред (insert, update, remove)
- `$nodeLabel.found` - Булева стойност (getById)
- `$nodeLabel.operation` - Име на операция (напр. `count`; `insert`/`update` за upsert)

## Не са необходими удостоверения

За разлика от външните интеграции, DataTable работи с вътрешната база данни на Heym. Правата за достъп на собственика на workflow се проверяват автоматично.

## Създаден от AI Assistant

Когато [AI Assistant](../reference/ai-assistant.md#data-tables) или [Chat](../tabs/chat-tab.md) създава този node, той избира или създава таблицата заедно с Вас и записва точните имена на колоните на таблицата в `dataTableData` и `dataTableFilter`.

## Свързани

- [DataTable Tab](../tabs/datatable-tab.md) - Създаване и управление на таблици
- [Grist Node](./grist-node.md) - Външна интеграция с електронни таблици
- [Expression DSL](../reference/expression-dsl.md) - Синтаксис на изрази за динамични стойности

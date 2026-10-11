# DataTable

Вузол **DataTable** читає, записує та керує даними в Heym DataTables. Використовуйте його для CRUD-операцій над власним структурованим сховищем без зовнішніх облікових даних.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вивід | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable з [вкладки DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Операція: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID рядка (для getById, update, remove) |
| `dataTableData` | JSON string | Значення стовпців: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Фільтр (find/upsert/count). `find` і `count` підтримують оператори `{"age": {"$gt": 18}}`; `upsert` використовує точний збіг `{"column_name": "value"}` |
| `dataTableSort` | string | Стовпець сортування, префікс `-` для спадання |
| `dataTableLimit` | number | Максимум повернутих рядків (за замовчуванням: 100) |

## Операції

| Операція | Обов'язкові поля | Опис |
|-----------|----------------|-------------|
| `find` | dataTableId | Знайти рядки за необов'язковим фільтром операторів з необов'язковим сортуванням/лімітом |
| `getAll` | dataTableId | Отримати всі рядки з необов'язковим сортуванням/лімітом |
| `count` | dataTableId | Порахувати рядки за необов'язковим фільтром операторів (обчислюється в базі даних; повертає лише число) |
| `getById` | dataTableId, dataTableRowId | Отримати один рядок за UUID |
| `insert` | dataTableId, dataTableData | Вставити новий рядок |
| `update` | dataTableId, dataTableRowId, dataTableData | Оновити рядок (об'єднує дані) |
| `remove` | dataTableId, dataTableRowId | Видалити рядок |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Оновити за наявності збігу, інакше вставити |

## Приклад - Пошук рядків

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

## Приклад - Вставлення рядка

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

## Приклад - Підрахунок рядків

Порахуйте рядки, що відповідають умові, в одному вузлі, замість `getAll` → If/Else → Map.

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

Результат доступний як `$activeAdults.count`. Порожній або пропущений фільтр зараховує кожен рядок.

### Оператори фільтра find і count

У фільтрі `find` або `count` просте значення означає рівність; значення-об'єкт застосовує оператор:

| Оператор | Значення |
|----------|---------|
| `$eq` (або просте значення) | Дорівнює |
| `$ne` | Не дорівнює |
| `$gt`, `$gte`, `$lt`, `$lte` | Порівняння більше/менше (числове для стовпців типу `number`, інакше текстове) |
| `$contains` | Підрядковий збіг без урахування регістру |
| `$in` | Значення входить до заданого масиву |

Приклад комбінування кількох: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Невідомі оператори ігноруються. Фільтри `upsert` усе ще використовують значення точного збігу для пошуку рядка, який потрібно оновити.

Також можна фільтрувати за метаданими рядка — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — які зберігаються як справжні стовпці, а не всередині Ваших даних. Для дат передавайте повне значення для порівняння діапазонів (наприклад, `{"created_at": {"$gt": "2026-06-04"}}`) або використовуйте `$contains` для часткового текстового збігу (наприклад, `{"created_at": {"$contains": "2026-06-04"}}`). Якщо один із Ваших власних стовпців має таку саму назву, як поле метаданих, стовпець даних має пріоритет.

## Доступ до виводу

- `$nodeLabel.success` - Булевий статус успіху
- `$nodeLabel.rows` - Масив рядків (find, getAll)
- `$nodeLabel.row` - Об'єкт одного рядка (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Доступ до значення конкретного стовпця
- `$nodeLabel.count` - Кількість рядків (повернуті рядки для find/getAll; загальна кількість відповідних рядків для count)
- `$nodeLabel.id` - UUID рядка (insert, update, remove)
- `$nodeLabel.found` - Булеве значення (getById)
- `$nodeLabel.operation` - Назва операції (наприклад, `count`; `insert`/`update` для upsert)

## Облікові дані не потрібні

На відміну від зовнішніх інтеграцій, DataTable працює з внутрішньою базою даних Heym. Права доступу власника Workflow перевіряються автоматично.

## Створено AI Assistant

Коли [AI Assistant](../reference/ai-assistant.md#data-tables) або [Chat](../tabs/chat-tab.md) створює цей вузол, він разом з Вами обирає або створює таблицю та записує точні назви стовпців таблиці у `dataTableData` і `dataTableFilter`.

## Пов'язане

- [Вкладка DataTable](../tabs/datatable-tab.md) - Створення та керування таблицями
- [Вузол Grist](./grist-node.md) - Інтеграція із зовнішніми електронними таблицями
- [Expression DSL](../reference/expression-dsl.md) - Синтаксис виразів для динамічних значень

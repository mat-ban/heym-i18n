# Хвърляне на грешка

Възелът **Throw Error** спира изпълнението на workflow незабавно и връща отговор за грешка с персонализиран HTTP статус код. Използвайте го за неуспешна валидация, неоторизиран достъп или други условия за грешка.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 0 |
| Изход | Workflow спира; към извикващия се връща отговор за грешка |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на възела (camelCase) |
| `errorMessage` | expression | Съобщение за грешка (поддържа изрази) |
| `httpStatusCode` | number | HTTP статус код (напр. 400, 401, 403, 404, 429, 500) |

## Често използвани статус кодове

| Код | Случай на употреба |
|------|----------|
| 400 | Bad Request (невалидни входни данни) |
| 401 | Unauthorized (изисква се автентикация) |
| 403 | Forbidden (достъпът е отказан) |
| 404 | Not Found (липсващ ресурс) |
| 422 | Unprocessable Entity (грешка при валидация) |
| 429 | Too Many Requests (ограничение на честотата) |
| 500 | Internal Server Error |

## Пример

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Използвайте с [Condition](./condition-node.md), за да валидирате входните данни и да хвърляте грешка само при невалидни данни:
- Condition true → продължава към Output
- Condition false → Throw Error

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове възли
- [Condition Node](./condition-node.md) – Валидиране преди хвърляне на грешка
- [Error Handler](./error-handler-node.md) – Прихващане на грешки от други възли

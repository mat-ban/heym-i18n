# Switch

**Switch** node насочва изпълнението по различни пътища въз основа на съвпадение на стойност с дадени случаи (cases). Поддържа N на брой случаи плюс случай по подразбиране (default).

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | n (по един за всеки случай + default) |
| Изход | Пренася входа към съответстващия клон |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `expression` | expression | Стойност за оценяване (напр. `$input.category`) |
| `cases` | string[] | Стойности на случаите за съвпадение (напр. `["case1", "case2", "case3"]`) |

## Edge Handles

- Всеки случай получава source handle (индекс 0, 1, 2, …)
- Default handle за стойности без съвпадение

## Пример

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Свържете edges с `sourceHandle`, зададен на индекса на случая (0, 1, 2) или на default handle за стойности без съвпадение.

## Свързани

- [Node Types](../reference/node-types.md) – Общ преглед на всички типове nodes
- [Condition Node](./condition-node.md) – If/else разклоняване
- [Expression DSL](../reference/expression-dsl.md) – Синтаксис на изрази

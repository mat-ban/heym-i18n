# Condition

**Condition** node разклонява workflow-а въз основа на израз if/else. Насочва към пътя true или false в зависимост от резултата.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 2 (true, false) |
| Изход | Предава входа към избрания клон |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `condition` | expression | Израз подобен на JavaScript (напр. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – когато условието се оценява като truthy
- **Source handle `false`** – когато условието се оценява като falsy

## Оператори на изрази

Поддържат се: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` и др. Вижте [Expression DSL](../reference/expression-dsl.md).

## Пример

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Свържете edges с `sourceHandle: "true"` или `sourceHandle: "false"`, за да насочите към различни клонове.

## Свързани

- [Node Types](../reference/node-types.md) – Общ преглед на всички типове nodes
- [Switch Node](./switch-node.md) – Многостранно насочване по стойност
- [Expression DSL](../reference/expression-dsl.md) – Синтаксис на условия
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend за condition

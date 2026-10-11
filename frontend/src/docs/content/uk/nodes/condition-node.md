# Condition

Вузол **Condition** розгалужує workflow на основі виразу if/else. Спрямовує виконання на шлях true або false залежно від результату.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 2 (true, false) |
| Вихід | Передає вхідні дані до обраної гілки |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `condition` | expression | Вираз, подібний до JavaScript (наприклад, `$input.text.length > 0`) |

## Точки підключення (Edge Handles)

- **Вихідна точка `true`** – коли умова обчислюється як істинна
- **Вихідна точка `false`** – коли умова обчислюється як хибна

## Оператори виразів

Підтримуються: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()` тощо. Див. [Expression DSL](../reference/expression-dsl.md).

## Приклад

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

З'єднайте ребра за допомогою `sourceHandle: "true"` або `sourceHandle: "false"`, щоб спрямувати виконання до різних гілок.

## Пов'язані розділи

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Switch Node](./switch-node.md) – Багатошляхове розгалуження за значенням
- [Expression DSL](../reference/expression-dsl.md) – Синтаксис умов
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Розширюваний редактор із живим попереднім переглядом на боці бекенду для умови

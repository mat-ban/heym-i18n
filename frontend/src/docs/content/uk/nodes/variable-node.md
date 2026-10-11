# Вузол Variable

Вузол **Variable** встановлює або оновлює змінну, доступну з будь-якого вузла через `$vars.variableName` (локальна для Workflow) або `$global.variableName` (постійна). Використовуйте його для лічильників, накопичувальних списків та спільного стану в межах Workflow.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.value` або доступ через `$vars.variableName` / `$global.variableName` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `variableName` | string | Ім'я змінної (використовується як `$vars.variableName` або `$global.variableName`). Уникайте [зарезервованих імен](../reference/expression-dsl.md). |
| `variableValue` | expression | Значення для встановлення. Підтримує вирази. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Приведення типу (типово: auto) |
| `isGlobal` | boolean | Якщо `true` — зберігати в [Global Variable Store](../reference/global-variables.md) (постійне, у межах користувача). Якщо `false` або не вказано — локальна для Workflow (у пам'яті). |

## Змінні-масиви

Ініціалізуйте масиви за допомогою `$array()` або `$array("a", "b")` у вузлі Variable перед використанням `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Потім додавайте елементи (без `$` у дужках):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Критичне правило

**Ніколи не використовуйте `$` у дужках методу:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – порушує вираз

## Приклад – Лічильник

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Пов'язане

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Loop Node](./loop-node.md) – Збирайте елементи за допомогою Variable у тілі циклу
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, зарезервовані імена
- [Global Variables](../reference/global-variables.md) – Постійні змінні з `isGlobal`

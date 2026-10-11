# Loop

**Loop** node итерира през масив, като изпълнява следващите надолу по веригата nodes за всеки елемент. Изисква обратна връзка (back-connection) от последния node в тялото на итерацията, за да премине напред.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 2 (по подразбиране + loop back) |
| Изходи | 2 (loop, done) |
| Изход | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `arrayExpression` | expression | Израз, който се разрешава до масив (напр. `$input.items`) |

## Edge Handles

- **Source `loop`** – Свързва се към nodes, които обработват всеки елемент (изпълнява се при всяка итерация)
- **Source `done`** – Свързва се към nodes, които се изпълняват след завършване на всички итерации
- **Target default** – Получава първоначални данни, съдържащи масива
- **Target `loop`** – Получава обратна връзка от последния node в тялото на итерацията

## Loop контекст (в тялото на итерацията)

- `$loopNode.item` – Текущ елемент
- `$loopNode.index` – Индекс, базиран на 0
- `$loopNode.total` – Общ брой елементи
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Критични правила

1. **Изисква се обратна връзка:** Последният node в тялото на итерацията ТРЯБВА да се свърже обратно към входния handle `loop` на loop-а.
2. **Без изход в тялото на loop-а:** [Output](./output-node.md) nodes са забранени в тялото на loop-а. Използвайте [Set](./set-node.md) или [Variable](./variable-node.md) за междинни резултати.
3. **Без автоматични резултати:** Loop-ът не събира резултати. Използвайте Variable nodes с `$array()` и `.add()`, за да натрупвате.

## Пример

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Поток: loop → process node → (обратно към loop) → loop → done branch → output.

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Variable Node](./variable-node.md) – Събиране на елементи в loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, методи за масиви

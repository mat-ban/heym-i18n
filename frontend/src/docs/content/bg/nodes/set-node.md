# Set

**Set** node трансформира и съпоставя входни данни към персонализиран изход. Използвайте го за преобразуване в главни букви, поднизове, конкатенация, случайни числа и всякакви трансформации на данни — не за извикване на workflows (за това използвайте [Execute](./execute-node.md)).

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.keyName` за всеки ключ на съпоставяне |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `mappings` | array | Двойки ключ-стойност. Всяка: `{ key, value }`, където `value` е [expression](../reference/expression-dsl.md) |

## Използване като agent tool

Когато Set node е свързан към [Agent Node](./agent-node.md) като инструмент на canvas, всяка стойност на съпоставяне може да бъде маркирана като **agent-provided** с иконата на бот. Маркираните стойности на съпоставяне стават параметри на инструмента, които agent попълва по време на изпълнение. Немаркираните съпоставяния остават фиксирани в конфигурацията на node.

Иконата на бот се появява само когато Set node е свързан към handle за инструменти на agent. Самостоятелен Set node не показва контроли за agent-provided.

## Правила за expressions

- Референция към предишни nodes: `$nodeName.text`, `$nodeName.body.field`
- Използване на функции: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` изключва b; при `a > b` връща грешка.
- Само един `$` в началото на expression — никога вътре в скоби
- Достъп до изход по ключ: `$setNode.randomNumber`, `$setNode.text`

## Пример

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Следващите nodes осъществяват достъп чрез `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Свързани

- [JSON output mapper](./json-output-mapper-node.md) – Същите съпоставяния; единственият терминален node връща root JSON за webhooks/runs
- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Execute Node](./execute-node.md) – Извикване на workflows (не трансформация на данни)
- [Expression DSL](../reference/expression-dsl.md) – Функции и синтаксис
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с live backend preview и Prev/Next за съпоставяния

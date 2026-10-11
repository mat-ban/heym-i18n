# Променлива

**Променлива** node задава или актуализира променлива, достъпна от всеки node чрез `$vars.variableName` (локална за workflow) или `$global.variableName` (постоянна). Използвайте го за броячи, натрупващи се списъци и споделено състояние в рамките на workflow.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.value`, или достъп чрез `$vars.variableName` / `$global.variableName` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `variableName` | string | Име на променливата (използва се като `$vars.variableName` или `$global.variableName`). Избягвайте [резервирани имена](../reference/expression-dsl.md). |
| `variableValue` | expression | Стойност за задаване. Поддържа изрази. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Привеждане на типа (по подразбиране: auto) |
| `isGlobal` | boolean | Когато е `true`, съхранява в [Global Variable Store](../reference/global-variables.md) (постоянна, обвързана с потребителя). Когато е `false` или е пропусната, е локална за workflow (в паметта). |

## Променливи от тип масив

Инициализирайте масиви с `$array()` или `$array("a", "b")` в node Променлива, преди да използвате `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

След това добавете елементи (без `$` вътре в скобите):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Критично правило

**Никога не използвайте `$` вътре в скобите на метод:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – нарушава израза

## Пример – Брояч

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

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Loop Node](./loop-node.md) – Събиране на елементи с Променлива в тялото на цикъл
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, резервирани имена
- [Глобални променливи](../reference/global-variables.md) – Постоянни променливи с `isGlobal`

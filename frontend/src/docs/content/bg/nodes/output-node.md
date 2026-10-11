# Изход

**Изходният** node е крайната точка на workflow-а, която връща отговора на извикващия. Винаги реферирайте предишния node чрез неговия label — никога не използвайте `$input`.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 (незадължителен, за асинхронна последваща обработка) |
| Изход | Връща `message` на извикващия |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `message` | expression | Изходна стойност. **Трябва** да реферира предишния node: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Ако е true, nodes след изхода се изпълняват асинхронно, след като отговорът бъде изпратен |

## Използване като agent tool

Когато даден Изходен node е свързан към [Agent Node](./agent-node.md) като инструмент на работната площ, полето `message` може да бъде маркирано като **предоставено от агента** с иконата на бот. Тогава агентът подава съобщението, когато извика инструмента. Ако Изходният node не е свързан като agent tool, иконата на бот е скрита.

## Критично правило

**Никога не използвайте `$input` в изходния node.** Винаги използвайте label-а на предишния node:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (където `processData` е label-ът на предишния node)

## Асинхронна последваща обработка

Когато `allowDownstream: true`, отговорът се връща незабавно. Nodes, свързани след изхода, се изпълняват във фонов режим (напр. Slack известия, логване). Тъй като downstream опашката може да завърши по-късно, downstream грешка може да промени записания статус на изпълнението на `error`, след като ранният отговор вече е бил върнат; крайната история и аналитика отразяват този по-късен резултат.

## Пример

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Пример – С асинхронност

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

След това свържете [Telegram](./telegram-node.md), [Slack](./slack-node.md) или друг node след изхода за известия тип „изпрати и забрави“.

## Свързани

- [JSON output mapper](./json-output-mapper-node.md) – Коренно JSON тяло без обвивка `result`, когато е единствен терминал
- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Expression DSL](../reference/expression-dsl.md) – Рефериране на изхода на node
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend за message
- [Workflow Structure](../reference/workflow-structure.md) – JSON формат

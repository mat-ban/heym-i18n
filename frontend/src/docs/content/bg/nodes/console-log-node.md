# Console Log

**Console Log** node записва стойност в конзолата на backend (сървъра). Използвайте го за debugging и инспекция по време на разработка.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | Предава входа нататък |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `logMessage` | expression | Стойност за записване. Поддържа [expressions](../reference/expression-dsl.md). |

## Пример

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

Изходът се появява в логовете на сървъра (напр. изход в терминала при стартиране на `uvicorn`).

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове nodes
- [Logs Tab](../tabs/logs-tab.md) – Преглед на логовете на приложението

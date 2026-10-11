# Error Handler

**Error Handler** node прихваща грешки от всеки node във workflow. Когато е наличен, той се изпълнява автоматично, когато който и да е node се провали. Не са необходими входящи връзки — той се задейства от workflow engine.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 (задейства се при грешка) |
| Изходи | 1 |
| Изход | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `message` | expression | Незадължителен. По подразбиране: `$error.message` |

## Контекст на грешката

Когато error handler се изпълни, следните полета са налични:

| Поле | Описание |
|-------|-------------|
| `$errorHandler.error` | Низ на съобщението за грешка |
| `$errorHandler.errorNode` | Label на node, който се е провалил |
| `$errorHandler.errorNodeType` | Тип на неуспешния node |
| `$errorHandler.timestamp` | Кога е възникнала грешката |

## Сценарии на употреба

- Изпращане на [Telegram](./telegram-node.md), [Slack](./slack-node.md) или [Send Email](./send-email-node.md) известия при провал
- Записване на грешки във външни системи
- Връщане на персонализиран отговор за грешка чрез [Output](./output-node.md)

Само един Error Handler на workflow.

## Пример

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Свързване към Output за персонализиран отговор за грешка:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Или свързване към Slack за известия:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Свързани

- [Node Types](../reference/node-types.md) – Преглед на всички типове node
- [Telegram Node](./telegram-node.md) – Известие при грешка
- [Slack Node](./slack-node.md) – Известие при грешка
- [Send Email Node](./send-email-node.md) – Известия по имейл
- [Throw Error Node](./throw-error-node.md) – Умишлени грешки

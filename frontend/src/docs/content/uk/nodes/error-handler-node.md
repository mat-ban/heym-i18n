# Обробник помилок

Вузол **Обробник помилок** перехоплює помилки від будь-якого вузла у workflow. Якщо він присутній, то запускається автоматично, коли будь-який вузол зазнає збою. Вхідні з'єднання не потрібні — він активується механізмом workflow.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 (активується при помилці) |
| Виходи | 1 |
| Вихід | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `message` | expression | Необов'язково. За замовчуванням: `$error.message` |

## Контекст помилки

Коли запускається обробник помилок, доступні такі поля:

| Поле | Опис |
|-------|-------------|
| `$errorHandler.error` | Рядок повідомлення про помилку |
| `$errorHandler.errorNode` | Мітка вузла, який зазнав збою |
| `$errorHandler.errorNodeType` | Тип вузла, який зазнав збою |
| `$errorHandler.timestamp` | Час виникнення помилки |

## Сценарії використання

- Надсилання сповіщень через [Telegram](./telegram-node.md), [Slack](./slack-node.md) або [Send Email](./send-email-node.md) у разі збою
- Журналювання помилок у зовнішніх системах
- Повернення спеціальної відповіді про помилку через [Output](./output-node.md)

Лише один Обробник помилок на workflow.

## Приклад

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Підключіть до Output для спеціальної відповіді про помилку:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Або підключіть до Slack для сповіщень:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Пов'язане

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Telegram Node](./telegram-node.md) – Сповіщення про помилку
- [Slack Node](./slack-node.md) – Сповіщення про помилку
- [Send Email Node](./send-email-node.md) – Сповіщення електронною поштою
- [Throw Error Node](./throw-error-node.md) – Навмисні помилки

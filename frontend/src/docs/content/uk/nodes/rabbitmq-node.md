# RabbitMQ

**Вузол RabbitMQ** надсилає або отримує повідомлення з черг та обмінників RabbitMQ. Використовуйте його для workflow, керованих повідомленнями, та обробки подій.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Вихід | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (отримання) |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані RabbitMQ з [Облікові дані](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Тип операції |
| `rabbitmqExchange` | string | Назва обмінника (необов'язково для надсилання) |
| `rabbitmqRoutingKey` | string | Ключ маршрутизації (для надсилання) |
| `rabbitmqQueueName` | string | Назва черги (обов'язково для отримання, необов'язково для надсилання) |
| `rabbitmqMessageBody` | expression | Тіло повідомлення для надсилання (підтримує вирази) |
| `rabbitmqDelayMs` | number | Заголовок x-delay у мс (плагін відкладених повідомлень) |

## Операції

### Надсилання

Публікує повідомлення в чергу або обмінник.

| Поле | Обов'язково | Опис |
|-------|----------|-------------|
| `rabbitmqMessageBody` | так | Тіло у форматі JSON або рядок |
| `rabbitmqQueueName` | необов'язково | Пряма цільова черга |
| `rabbitmqExchange` | необов'язково | Назва обмінника |
| `rabbitmqRoutingKey` | необов'язково | Ключ маршрутизації |
| `rabbitmqDelayMs` | необов'язково | Затримка в мілісекундах |

**Вихід:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Отримання

Режим Trigger: workflow запускається, коли надходить повідомлення. Вхідне ребро не потрібне, якщо використовується як trigger.

**Вихід:** `$nodeLabel.body` (payload повідомлення), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Приклад – Надсилання

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## Пов'язане

- [Типи вузлів](../reference/node-types.md) – Огляд усіх типів вузлів
- [Triggers](../reference/triggers.md) – RabbitMQ як trigger workflow
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання облікових даних RabbitMQ
- [Сторонні інтеграції](../reference/integrations.md#rabbitmq) – Налаштування облікових даних RabbitMQ та деталі плагіна затримки

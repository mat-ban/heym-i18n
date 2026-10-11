# RabbitMQ

**RabbitMQ** node изпраща или получава съобщения от RabbitMQ опашки и exchanges. Използвайте го за workflow, управлявани от съобщения, и обработка на събития.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (получаване) |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Тип операция |
| `rabbitmqExchange` | string | Име на exchange (незадължително за изпращане) |
| `rabbitmqRoutingKey` | string | Routing key (за изпращане) |
| `rabbitmqQueueName` | string | Име на опашка (задължително за получаване, незадължително за изпращане) |
| `rabbitmqMessageBody` | expression | Тяло на съобщението за изпращане (поддържа изрази) |
| `rabbitmqDelayMs` | number | x-delay header в ms (плъгин за отложени съобщения) |

## Операции

### Изпращане

Публикува съобщение към опашка или exchange.

| Поле | Задължително | Описание |
|-------|----------|-------------|
| `rabbitmqMessageBody` | да | JSON или string тяло |
| `rabbitmqQueueName` | незадължително | Директна цел на опашката |
| `rabbitmqExchange` | незадължително | Име на exchange |
| `rabbitmqRoutingKey` | незадължително | Routing key |
| `rabbitmqDelayMs` | незадължително | Отлагане в милисекунди |

**Изход:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Получаване

Trigger режим: workflow стартира, когато пристигне съобщение. Не е необходим входящ edge, когато се използва като trigger.

**Изход:** `$nodeLabel.body` (payload на съобщението), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Пример – Изпращане

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

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Triggers](../reference/triggers.md) – RabbitMQ като workflow trigger
- [Раздел Удостоверения](../tabs/credentials-tab.md) – Добавяне на RabbitMQ удостоверения
- [Интеграции с трети страни](../reference/integrations.md#rabbitmq) – Настройка на RabbitMQ удостоверения и подробности за плъгина за отлагане

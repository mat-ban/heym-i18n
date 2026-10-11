# RabbitMQ

**RabbitMQ**-noden skickar eller tar emot meddelanden från RabbitMQ-köer och exchanges. Den används för meddelandedrivna workflows och händelsebearbetning.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 1 |
| Utmatningar | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | RabbitMQ-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Åtgärdstyp |
| `rabbitmqExchange` | string | Exchange-namn (valfritt för send) |
| `rabbitmqRoutingKey` | string | Routing key (för send) |
| `rabbitmqQueueName` | string | Könamn (krävs för receive, valfritt för send) |
| `rabbitmqMessageBody` | expression | Meddelandetext för send (stöder uttryck) |
| `rabbitmqDelayMs` | number | x-delay-header i ms (plugin för fördröjda meddelanden) |

## Åtgärder

### Send

Publicerar ett meddelande till en kö eller exchange.

| Fält | Krävs | Beskrivning |
|------|-------|-------------|
| `rabbitmqMessageBody` | ja | JSON- eller strängtext |
| `rabbitmqQueueName` | valfritt | Direkt kömål |
| `rabbitmqExchange` | valfritt | Exchange-namn |
| `rabbitmqRoutingKey` | valfritt | Routing key |
| `rabbitmqDelayMs` | valfritt | Fördröjning i millisekunder |

**Utdata:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Trigger-läge: workflow startar när ett meddelande anländer. Ingen inkommande kant krävs när noden används som trigger.

**Utdata:** `$nodeLabel.body` (meddelandets payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Exempel – Send

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

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Triggers](../reference/triggers.md) – RabbitMQ som workflow-trigger
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till RabbitMQ-autentiseringsuppgifter
- [Tredjepartsintegrationer](../reference/integrations.md#rabbitmq) – Konfiguration av RabbitMQ-autentiseringsuppgifter och information om plugin för fördröjning

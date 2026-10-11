# RabbitMQ

**RabbitMQ**-noden sender eller modtager beskeder fra RabbitMQ-køer og -exchanges. Den anvendes til message-driven workflows og event processing.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (modtag) |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Operationstype |
| `rabbitmqExchange` | string | Exchange-navn (valgfrit for send) |
| `rabbitmqRoutingKey` | string | Routing-nøgle (for send) |
| `rabbitmqQueueName` | string | Kønavn (påkrævet for modtag, valgfrit for send) |
| `rabbitmqMessageBody` | expression | Beskedkrop for send (understøtter expressions) |
| `rabbitmqDelayMs` | number | x-delay header i ms (delayed message plugin) |

## Operationer

### Send

Publicerer en besked til en kø eller exchange.

| Felt | Påkrævet | Beskrivelse |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ja | JSON eller strengkrop |
| `rabbitmqQueueName` | valgfrit | Direkte kømål |
| `rabbitmqExchange` | valgfrit | Exchange-navn |
| `rabbitmqRoutingKey` | valgfrit | Routing-nøgle |
| `rabbitmqDelayMs` | valgfrit | Forsinkelse i millisekunder |

**Output:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Trigger-tilstand: workflow starter, når en besked ankommer. Ingen indgående edge nødvendig, når den bruges som trigger.

**Output:** `$nodeLabel.body` (besked-payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Eksempel – Send

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

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Triggers](../reference/triggers.md) – RabbitMQ som workflow-trigger
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj RabbitMQ-legitimationsoplysninger
- [Tredjepartsintegrationer](../reference/integrations.md#rabbitmq) – Opsætning af RabbitMQ-legitimationsoplysninger og detaljer om delay plugin

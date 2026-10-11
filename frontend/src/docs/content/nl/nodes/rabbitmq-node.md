# RabbitMQ

De **RabbitMQ**-node verzendt of ontvangt berichten van RabbitMQ-wachtrijen en -exchanges. Gebruik deze voor berichtgestuurde workflows en gebeurtenisverwerking.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (ontvangen) |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Type bewerking |
| `rabbitmqExchange` | string | Naam van exchange (optioneel voor verzenden) |
| `rabbitmqRoutingKey` | string | Routing key (voor verzenden) |
| `rabbitmqQueueName` | string | Naam van wachtrij (vereist voor ontvangen, optioneel voor verzenden) |
| `rabbitmqMessageBody` | expression | Berichtinhoud voor verzenden (ondersteunt expressies) |
| `rabbitmqDelayMs` | number | x-delay-header in ms (delayed message plugin) |

## Bewerkingen

### Verzenden

Publiceert een bericht naar een wachtrij of exchange.

| Veld | Vereist | Beschrijving |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ja | JSON- of stringinhoud |
| `rabbitmqQueueName` | optioneel | Direct doel van wachtrij |
| `rabbitmqExchange` | optioneel | Naam van exchange |
| `rabbitmqRoutingKey` | optioneel | Routing key |
| `rabbitmqDelayMs` | optioneel | Vertraging in milliseconden |

**Uitvoer:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Ontvangen

Trigger-modus: de workflow start wanneer een bericht aankomt. Geen inkomende rand nodig wanneer gebruikt als trigger.

**Uitvoer:** `$nodeLabel.body` (berichtpayload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Voorbeeld – Verzenden

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

## Gerelateerd

- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Triggers](../reference/triggers.md) – RabbitMQ als workflow-trigger
- [Credentials Tab](../tabs/credentials-tab.md) – RabbitMQ-referenties toevoegen
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – Installatie van RabbitMQ-referenties en details van de delay plugin

# RabbitMQ

**RabbitMQ** node saadab või võtab vastu sõnumeid RabbitMQ järjekordadest ja exchange'idest. Kasutage seda sõnumipõhiste workflow'de ja sündmuste töötlemise jaoks.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Toimingu tüüp |
| `rabbitmqExchange` | string | Exchange'i nimi (valikuline saatmise korral) |
| `rabbitmqRoutingKey` | string | Routing key (saatmise korral) |
| `rabbitmqQueueName` | string | Järjekorra nimi (nõutud vastuvõtmisel, valikuline saatmisel) |
| `rabbitmqMessageBody` | expression | Sõnumi sisu saatmiseks (toetab avaldisi) |
| `rabbitmqDelayMs` | number | x-delay päis millisekundites (delayed message plugin) |

## Toimingud

### Send

Avaldab sõnumi järjekorda või exchange'i.

| Väli | Nõutud | Kirjeldus |
|-------|----------|-------------|
| `rabbitmqMessageBody` | jah | JSON või string sisu |
| `rabbitmqQueueName` | valikuline | Otsene järjekorra sihtmärk |
| `rabbitmqExchange` | valikuline | Exchange'i nimi |
| `rabbitmqRoutingKey` | valikuline | Routing key |
| `rabbitmqDelayMs` | valikuline | Viivitus millisekundites |

**Output:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Trigger režiim: workflow käivitub, kui sõnum saabub. Triggerina kasutamisel ei ole sisendserva vaja.

**Output:** `$nodeLabel.body` (sõnumi payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Näide – Send

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

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist node tüüpidest
- [Triggers](../reference/triggers.md) – RabbitMQ workflow triggerina
- [Credentials Tab](../tabs/credentials-tab.md) – RabbitMQ mandaatide lisamine
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – RabbitMQ mandaadi seadistamine ja delay plugin details

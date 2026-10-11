# RabbitMQ

Uzol **RabbitMQ** odosiela alebo prijíma správy z frontov a výmen (exchanges) RabbitMQ. Použite ho pre workflowy riadené správami a spracovanie udalostí.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (prijímanie) |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje RabbitMQ z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Typ operácie |
| `rabbitmqExchange` | string | Názov výmeny (voliteľné pre odosielanie) |
| `rabbitmqRoutingKey` | string | Smerovací kľúč (pre odosielanie) |
| `rabbitmqQueueName` | string | Názov frontu (povinné pre prijímanie, voliteľné pre odosielanie) |
| `rabbitmqMessageBody` | expression | Telo správy pre odoslanie (podporuje výrazy) |
| `rabbitmqDelayMs` | number | Hlavička x-delay v ms (plugin pre oneskorené správy) |

## Operácie

### Odoslanie

Publikuje správu do frontu alebo výmeny.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `rabbitmqMessageBody` | áno | Telo vo formáte JSON alebo string |
| `rabbitmqQueueName` | voliteľné | Priamy cieľový front |
| `rabbitmqExchange` | voliteľné | Názov výmeny |
| `rabbitmqRoutingKey` | voliteľné | Smerovací kľúč |
| `rabbitmqDelayMs` | voliteľné | Oneskorenie v milisekundách |

**Výstup:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Prijímanie

Režim triggera: workflow sa spustí, keď dorazí správa. Pri použití ako trigger nie je potrebná vstupná hrana.

**Výstup:** `$nodeLabel.body` (payload správy), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Príklad – Odoslanie

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Triggers](../reference/triggers.md) – RabbitMQ ako trigger workflowu
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie prihlasovacích údajov RabbitMQ
- [Integrácie tretích strán](../reference/integrations.md#rabbitmq) – Nastavenie prihlasovacích údajov RabbitMQ a podrobnosti o plugine pre oneskorenie

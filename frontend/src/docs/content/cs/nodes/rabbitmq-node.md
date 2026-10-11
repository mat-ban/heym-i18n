# RabbitMQ

Uzel **RabbitMQ** odesílá nebo přijímá zprávy z front a exchange RabbitMQ. Použijte jej pro workflows řízené zprávami a zpracování událostí.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (příjem) |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj RabbitMQ z [Přihlašovací údaje](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Typ operace |
| `rabbitmqExchange` | string | Název exchange (volitelné pro odeslání) |
| `rabbitmqRoutingKey` | string | Routing key (pro odeslání) |
| `rabbitmqQueueName` | string | Název fronty (povinné pro příjem, volitelné pro odeslání) |
| `rabbitmqMessageBody` | expression | Tělo zprávy pro odeslání (podporuje výrazy) |
| `rabbitmqDelayMs` | number | Hlavička x-delay v ms (plugin pro zpožděné zprávy) |

## Operace

### Odeslání

Publikuje zprávu do fronty nebo exchange.

| Pole | Povinné | Popis |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ano | Tělo ve formátu JSON nebo string |
| `rabbitmqQueueName` | volitelné | Přímý cíl fronty |
| `rabbitmqExchange` | volitelné | Název exchange |
| `rabbitmqRoutingKey` | volitelné | Routing key |
| `rabbitmqDelayMs` | volitelné | Zpoždění v milisekundách |

**Výstup:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Příjem

Režim trigger: workflow se spustí při příchodu zprávy. Při použití jako trigger není vyžadována příchozí hrana.

**Výstup:** `$nodeLabel.body` (payload zprávy), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Příklad – Odeslání

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

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Triggers](../reference/triggers.md) – RabbitMQ jako trigger workflow
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání přihlašovacích údajů RabbitMQ
- [Integrace třetích stran](../reference/integrations.md#rabbitmq) – Nastavení přihlašovacích údajů RabbitMQ a podrobnosti o pluginu pro zpoždění

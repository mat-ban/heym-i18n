# RabbitMQ

A **RabbitMQ** csomópont üzeneteket küld vagy fogad RabbitMQ queue-kból és exchange-ekből. Használja üzenetvezérelt workflow-khoz és eseményfeldolgozáshoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (fogadás) |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) lapról |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Művelet típusa |
| `rabbitmqExchange` | string | Exchange neve (küldésnél opcionális) |
| `rabbitmqRoutingKey` | string | Routing key (küldéshez) |
| `rabbitmqQueueName` | string | Queue neve (fogadásnál kötelező, küldésnél opcionális) |
| `rabbitmqMessageBody` | expression | Üzenettörzs küldéshez (támogatja a kifejezéseket) |
| `rabbitmqDelayMs` | number | x-delay fejléc ms-ban (delayed message plugin) |

## Műveletek

### Küldés

Üzenetet publikál egy queue-ba vagy exchange-be.

| Mező | Kötelező | Leírás |
|-------|----------|-------------|
| `rabbitmqMessageBody` | igen | JSON vagy string törzs |
| `rabbitmqQueueName` | opcionális | Közvetlen queue cél |
| `rabbitmqExchange` | opcionális | Exchange neve |
| `rabbitmqRoutingKey` | opcionális | Routing key |
| `rabbitmqDelayMs` | opcionális | Késleltetés milliszekundumban |

**Kimenet:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Fogadás

Trigger mód: a workflow akkor indul, amikor egy üzenet megérkezik. Triggerként használva nincs szükség bejövő élre.

**Kimenet:** `$nodeLabel.body` (üzenet payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Példa – Küldés

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

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Triggerek](../reference/triggers.md) – RabbitMQ mint workflow trigger
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – RabbitMQ hitelesítési adatok hozzáadása
- [Harmadik féltől származó integrációk](../reference/integrations.md#rabbitmq) – RabbitMQ hitelesítési adatok beállítása és a delay plugin részletei

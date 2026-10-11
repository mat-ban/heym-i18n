# RabbitMQ

Nodul **RabbitMQ** trimite sau primește mesaje din cozi și exchange-uri RabbitMQ. Utilizați-l pentru workflow-uri bazate pe mesaje și procesarea evenimentelor.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare RabbitMQ din [Acreditări](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tipul operațiunii |
| `rabbitmqExchange` | string | Numele exchange-ului (opțional pentru send) |
| `rabbitmqRoutingKey` | string | Cheia de rutare (pentru send) |
| `rabbitmqQueueName` | string | Numele cozii (obligatoriu pentru receive, opțional pentru send) |
| `rabbitmqMessageBody` | expression | Corpul mesajului pentru send (acceptă expresii) |
| `rabbitmqDelayMs` | number | Header x-delay în ms (plugin pentru mesaje întârziate) |

## Operațiuni

### Send

Publică un mesaj într-o coadă sau un exchange.

| Câmp | Obligatoriu | Descriere |
|-------|----------|-------------|
| `rabbitmqMessageBody` | da | Corp JSON sau string |
| `rabbitmqQueueName` | opțional | Țintă directă către coadă |
| `rabbitmqExchange` | opțional | Numele exchange-ului |
| `rabbitmqRoutingKey` | opțional | Cheia de rutare |
| `rabbitmqDelayMs` | opțional | Întârziere în milisecunde |

**Ieșire:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Mod trigger: workflow-ul pornește când sosește un mesaj. Nu este necesară o muchie de intrare când este utilizat ca trigger.

**Ieșire:** `$nodeLabel.body` (payload-ul mesajului), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Exemplu – Send

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Triggers](../reference/triggers.md) – RabbitMQ ca trigger de workflow
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugarea acreditărilor RabbitMQ
- [Integrări terțe](../reference/integrations.md#rabbitmq) – Configurarea acreditărilor RabbitMQ și detalii despre plugin-ul pentru întârziere

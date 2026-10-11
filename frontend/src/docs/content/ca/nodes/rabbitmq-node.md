# RabbitMQ

El node **RabbitMQ** envia o rep missatges de cues i intercanviadors de RabbitMQ. Utilitzeu-lo per a workflows basats en missatges i processament d'esdeveniments.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de RabbitMQ des de [Credencials](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tipus d'operació |
| `rabbitmqExchange` | string | Nom de l'intercanviador (opcional per a send) |
| `rabbitmqRoutingKey` | string | Clau d'encaminament (per a send) |
| `rabbitmqQueueName` | string | Nom de la cua (obligatori per a receive, opcional per a send) |
| `rabbitmqMessageBody` | expression | Cos del missatge per a send (admet expressions) |
| `rabbitmqDelayMs` | number | Capçalera x-delay en ms (connector de missatges retardats) |

## Operacions

### Send

Publica un missatge en una cua o intercanviador.

| Camp | Obligatori | Descripció |
|-------|----------|-------------|
| `rabbitmqMessageBody` | sí | Cos en JSON o string |
| `rabbitmqQueueName` | opcional | Destinació directa de la cua |
| `rabbitmqExchange` | opcional | Nom de l'intercanviador |
| `rabbitmqRoutingKey` | opcional | Clau d'encaminament |
| `rabbitmqDelayMs` | opcional | Retard en mil·lisegons |

**Sortida:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Mode Trigger: el workflow s'inicia quan arriba un missatge. No cal cap aresta d'entrada quan s'utilitza com a Trigger.

**Sortida:** `$nodeLabel.body` (payload del missatge), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Exemple – Send

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

## Relacionat

- [Tipus de nodes](../reference/node-types.md) – Visió general de tots els tipus de nodes
- [Triggers](../reference/triggers.md) – RabbitMQ com a Trigger de workflow
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegiu credencials de RabbitMQ
- [Integracions de tercers](../reference/integrations.md#rabbitmq) – Configuració de credencials de RabbitMQ i detalls del connector de retard
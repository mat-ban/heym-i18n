# RabbitMQ

Der **RabbitMQ**-Knoten sendet oder empfängt Nachrichten aus RabbitMQ-Warteschlangen und -Exchanges. Verwende ihn für nachrichtengetriebene Workflows und Ereignisverarbeitung.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (empfangen) |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Vorgangstyp |
| `rabbitmqExchange` | string | Exchange-Name (optional für Senden) |
| `rabbitmqRoutingKey` | string | Routing-Key (für Senden) |
| `rabbitmqQueueName` | string | Warteschlangenname (erforderlich für Empfangen, optional für Senden) |
| `rabbitmqMessageBody` | expression | Nachrichtenkörper für Senden (unterstützt Ausdrücke) |
| `rabbitmqDelayMs` | number | x-delay-Header in ms (Delayed-Message-Plugin) |

## Vorgänge

### Senden

Veröffentlicht eine Nachricht in einer Warteschlange oder einem Exchange.

| Feld | Erforderlich | Beschreibung |
|-------|----------|-------------|
| `rabbitmqMessageBody` | ja | JSON- oder String-Körper |
| `rabbitmqQueueName` | optional | Direktes Warteschlangenziel |
| `rabbitmqExchange` | optional | Exchange-Name |
| `rabbitmqRoutingKey` | optional | Routing-Key |
| `rabbitmqDelayMs` | optional | Verzögerung in Millisekunden |

**Ausgabe:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Empfangen

Trigger-Modus: Der Workflow startet, wenn eine Nachricht eintrifft. Keine eingehende Kante erforderlich, wenn er als Trigger verwendet wird.

**Ausgabe:** `$nodeLabel.body` (Nachrichten-Payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Beispiel – Senden

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

## Verwandte Themen

- [Knotentypen](../reference/node-types.md) – Übersicht aller Knotentypen
- [Trigger](../reference/triggers.md) – RabbitMQ als Workflow-Trigger
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – RabbitMQ-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md#rabbitmq) – Einrichtung der RabbitMQ-Anmeldedaten und Details zum Delay-Plugin

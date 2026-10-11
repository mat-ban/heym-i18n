# RabbitMQ

Il nodo **RabbitMQ** invia o riceve messaggi da code e exchange RabbitMQ. Utilizzarlo per Workflow basati su messaggi e per l'elaborazione di eventi.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (ricezione) |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale RabbitMQ da [Credenziali](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tipo di operazione |
| `rabbitmqExchange` | string | Nome dell'exchange (opzionale per l'invio) |
| `rabbitmqRoutingKey` | string | Routing key (per l'invio) |
| `rabbitmqQueueName` | string | Nome della coda (obbligatorio per la ricezione, opzionale per l'invio) |
| `rabbitmqMessageBody` | expression | Corpo del messaggio per l'invio (supporta le espressioni) |
| `rabbitmqDelayMs` | number | Header x-delay in ms (plugin per messaggi ritardati) |

## Operazioni

### Invio

Pubblica un messaggio su una coda o un exchange.

| Campo | Obbligatorio | Descrizione |
|-------|----------|-------------|
| `rabbitmqMessageBody` | sì | Corpo JSON o stringa |
| `rabbitmqQueueName` | opzionale | Destinazione diretta della coda |
| `rabbitmqExchange` | opzionale | Nome dell'exchange |
| `rabbitmqRoutingKey` | opzionale | Routing key |
| `rabbitmqDelayMs` | opzionale | Ritardo in millisecondi |

**Output:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Ricezione

Modalità Trigger: il Workflow si avvia all'arrivo di un messaggio. Non è necessario alcun edge in ingresso quando viene utilizzato come Trigger.

**Output:** `$nodeLabel.body` (payload del messaggio), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Esempio – Invio

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

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Trigger](../reference/triggers.md) – RabbitMQ come Trigger di Workflow
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere credenziali RabbitMQ
- [Integrazioni di terze parti](../reference/integrations.md#rabbitmq) – Configurazione delle credenziali RabbitMQ e dettagli sul plugin per il ritardo
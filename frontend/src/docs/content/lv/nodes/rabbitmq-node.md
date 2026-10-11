# RabbitMQ

**RabbitMQ** mezgls sūta vai saņem ziņojumus no RabbitMQ rindām un apmaiņām. Izmantojiet to uz ziņojumiem balstītiem workflow un notikumu apstrādei.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (saņemšana) |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Darbības tips |
| `rabbitmqExchange` | string | Apmaiņas nosaukums (neobligāts sūtīšanai) |
| `rabbitmqRoutingKey` | string | Maršrutēšanas atslēga (sūtīšanai) |
| `rabbitmqQueueName` | string | Rindas nosaukums (obligāts saņemšanai, neobligāts sūtīšanai) |
| `rabbitmqMessageBody` | expression | Ziņojuma pamatteksts sūtīšanai (atbalsta izteiksmes) |
| `rabbitmqDelayMs` | number | x-delay galvene milisekundēs (aizturēto ziņojumu spraudnis) |

## Darbības

### Sūtīšana

Publicē ziņojumu rindā vai apmaiņā.

| Lauks | Obligāts | Apraksts |
|-------|----------|-------------|
| `rabbitmqMessageBody` | jā | JSON vai string pamatteksts |
| `rabbitmqQueueName` | neobligāts | Tiešās rindas mērķis |
| `rabbitmqExchange` | neobligāts | Apmaiņas nosaukums |
| `rabbitmqRoutingKey` | neobligāts | Maršrutēšanas atslēga |
| `rabbitmqDelayMs` | neobligāts | Aizture milisekundēs |

**Izvade:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Saņemšana

Trigger režīms: workflow sākas, kad pienāk ziņojums. Nav nepieciešama ienākošā saite, ja to izmanto kā trigger.

**Izvade:** `$nodeLabel.body` (ziņojuma payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Piemērs – Sūtīšana

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

## Saistītais

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Triggers](../reference/triggers.md) – RabbitMQ kā workflow trigger
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot RabbitMQ akreditācijas datus
- [Trešo pušu integrācijas](../reference/integrations.md#rabbitmq) – RabbitMQ akreditācijas datu iestatīšana un aiztures spraudņa informācija

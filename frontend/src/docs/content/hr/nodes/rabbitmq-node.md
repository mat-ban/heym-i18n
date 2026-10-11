# RabbitMQ

**RabbitMQ** čvor šalje ili prima poruke iz RabbitMQ redova čekanja i exchangeva. Koristite ga za workflows vođene porukama i obradu događaja.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (primanje) |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | RabbitMQ vjerodajnica iz [Vjerodajnice](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tip operacije |
| `rabbitmqExchange` | string | Naziv exchangeva (neobavezno za slanje) |
| `rabbitmqRoutingKey` | string | Routing key (za slanje) |
| `rabbitmqQueueName` | string | Naziv reda čekanja (obavezno za primanje, neobavezno za slanje) |
| `rabbitmqMessageBody` | expression | Tijelo poruke za slanje (podržava izraze) |
| `rabbitmqDelayMs` | number | x-delay header u ms (plugin za odgođene poruke) |

## Operacije

### Slanje

Objavljuje poruku u red čekanja ili exchange.

| Polje | Obavezno | Opis |
|-------|----------|-------------|
| `rabbitmqMessageBody` | da | JSON ili string tijelo |
| `rabbitmqQueueName` | neobavezno | Izravni ciljni red čekanja |
| `rabbitmqExchange` | neobavezno | Naziv exchangeva |
| `rabbitmqRoutingKey` | neobavezno | Routing key |
| `rabbitmqDelayMs` | neobavezno | Odgoda u milisekundama |

**Izlaz:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Primanje

Trigger način rada: workflow se pokreće kada poruka stigne. Dolazni edge nije potreban kada se koristi kao trigger.

**Izlaz:** `$nodeLabel.body` (payload poruke), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Primjer – Slanje

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

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Triggers](../reference/triggers.md) – RabbitMQ kao trigger workflowa
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodavanje RabbitMQ vjerodajnica
- [Integracije trećih strana](../reference/integrations.md#rabbitmq) – Postavljanje RabbitMQ vjerodajnica i pojedinosti o pluginu za odgodu

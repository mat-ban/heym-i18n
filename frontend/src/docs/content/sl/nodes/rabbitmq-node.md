# RabbitMQ

Vozlišče **RabbitMQ** pošilja ali prejema sporočila iz RabbitMQ vrstic in izmenjav. Uporabite ga za delovne tokove, ki temeljijo na sporočilih, in obdelavo dogodkov.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (prejem) |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica RabbitMQ iz [Poverilnic](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Vrsta operacije |
| `rabbitmqExchange` | niz | Ime izmenjave (neobvezno za pošiljanje) |
| `rabbitmqRoutingKey` | niz | Ključ usmerjanja (za pošiljanje) |
| `rabbitmqQueueName` | niz | Ime vrste (obvezno za prejem, neobvezno za pošiljanje) |
| `rabbitmqMessageBody` | izraz | Telo sporočila za pošiljanje (podpira izraze) |
| `rabbitmqDelayMs` | število | x-delay glava v ms (vtičnik za zamudo sporočila) |

## Operacije

### Pošlji

Objavi sporočilo v vrsto ali izmenjavo.

| Polje | Obvezno | Opis |
|-------|----------|-------------|
| `rabbitmqMessageBody` | da | JSON ali niz telo |
| `rabbitmqQueueName` | neobvezno | Ciljna neposredna vrsta |
| `rabbitmqExchange` | neobvezno | Ime izmenjave |
| `rabbitmqRoutingKey` | neobvezno | Ključ usmerjanja |
| `rabbitmqDelayMs` | neobvezno | Zamuda v milisekundah |

**Izhod:** `$nodeLabel.status` ("objavljeno"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Prejmi

Način sprožitve: delovni tok se začne, ko prispe sporočilo. Ni potrebna vhodna povezava, ko se uporablja kot sprožilec.

**Izhod:** `$nodeLabel.body` (payload sporočila), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Primer – Pošlji

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

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Sprožilci](../reference/triggers.md) – RabbitMQ kot sprožilec delovnega toka
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte poverilnice RabbitMQ
- [Integracije tretjih oseb](../reference/integrations.md#rabbitmq) – Nastavitev poverilnic RabbitMQ in podrobnosti o vtičniku za zamudo

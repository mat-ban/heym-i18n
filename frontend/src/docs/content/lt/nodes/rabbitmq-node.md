# RabbitMQ

**RabbitMQ** mazgas siunčia arba priima žinutes iš RabbitMQ eilių ir mainų. Naudokite jį žinučių valdomiems workflows ir įvykių apdorojimui.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (priimti) |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | RabbitMQ kredencialas iš [Kredencialai](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Veiklos tipas |
| `rabbitmqExchange` | string | Mainų pavadinimas (neprivalomas siunčiant) |
| `rabbitmqRoutingKey` | string | Maršruto raktas (siunčiant) |
| `rabbitmqQueueName` | string | Eilės pavadinimas (privalomas priimant, neprivalomas siunčiant) |
| `rabbitmqMessageBody` | expression | Žinutės turinys siunčiant (palaiko išraiškas) |
| `rabbitmqDelayMs` | number | x-delay antraštė ms (atidedamos žinutės papildinys) |

## Veiklos

### Siųsti

Paskelbia žinutę į eilę arba mainus.

| Laukas | Privalomas | Aprašymas |
|--------|------------|-----------|
| `rabbitmqMessageBody` | taip | JSON arba eilutės turinys |
| `rabbitmqQueueName` | neprivalomas | Tiesioginė eilės tikslas |
| `rabbitmqExchange` | neprivalomas | Mainų pavadinimas |
| `rabbitmqRoutingKey` | neprivalomas | Maršruto raktas |
| `rabbitmqDelayMs` | neprivalomas | Atidėjimas milisekundėmis |

**Išvestis:** `$nodeLabel.status` ("paskelbta"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Priimti

Trigger režimas: workflow prasideda, kai atvyksta žinutė. Nereikia atvykimo krašto, kai naudojamas kaip trigger.

**Išvestis:** `$nodeLabel.body` (žinutės payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Pavyzdys – Siųsti

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

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Triggeriai](../reference/triggers.md) – RabbitMQ kaip workflow trigger
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti RabbitMQ kredencialus
- [Trečiųjų šalių integracijos](../reference/integrations.md#rabbitmq) – RabbitMQ kredencialų nustatymas ir atidėjimo papildinio detalės

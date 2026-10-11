# RabbitMQ

**RabbitMQ**-solmu lähettää tai vastaanottaa viestejä RabbitMQ-jonoista ja -vaihtopisteistä. Sitä voidaan käyttää viestipohjaisissa workflowissa ja tapahtumien käsittelyssä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (vastaanotto) |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|---------|
| `credentialId` | UUID | RabbitMQ-tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdeltä |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Toiminnon tyyppi |
| `rabbitmqExchange` | merkkijono | Vaihtopisteen nimi (valinnainen lähetettäessä) |
| `rabbitmqRoutingKey` | merkkijono | Reititysavain (lähetettäessä) |
| `rabbitmqQueueName` | merkkijono | Jonon nimi (pakollinen vastaanotettaessa, valinnainen lähetettäessä) |
| `rabbitmqMessageBody` | lauseke | Viestin sisältö lähetettäessä (tukee lausekkeita) |
| `rabbitmqDelayMs` | numero | x-delay-otsake millisekunteina (viivästyslisäosa) |

## Toiminnot

### Lähetä

Julkaisee viestin jonoon tai vaihtopisteeseen.

| Kenttä | Pakollinen | Kuvaus |
|--------|------------|---------|
| `rabbitmqMessageBody` | kyllä | JSON- tai merkkijonosisältö |
| `rabbitmqQueueName` | valinnainen | Suora jonon kohde |
| `rabbitmqExchange` | valinnainen | Vaihtopisteen nimi |
| `rabbitmqRoutingKey` | valinnainen | Reititysavain |
| `rabbitmqDelayMs` | valinnainen | Viive millisekunteina |

**Tuloste:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Vastaanota

Trigger-tila: workflow käynnistyy, kun viesti saapuu. Saapuvaa kaarta ei tarvita, kun solmua käytetään triggerinä.

**Tuloste:** `$nodeLabel.body` (viestin payload), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Esimerkki – Lähetä

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

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Triggerit](../reference/triggers.md) – RabbitMQ workflow-triggerinä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – RabbitMQ-tunnistetietojen lisääminen
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#rabbitmq) – RabbitMQ-tunnistetietojen asennus ja viivästyslisäosan tiedot

# Telegram

**Telegram**-solmu lähettää viestin Telegram Bot API:n kautta. Käytä sitä keskusteluvastauksiin, operatiivisiin hälytyksiin, workflow-tilapäivityksiin tai mihin tahansa myöhemmässä vaiheessa tapahtuvaan viestintään Telegram-käyttäjälle, ryhmälle tai kanavalle.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram`-tunnistetiedot, jotka sisältävät bottitokenin |
| `chatId` | lauseke | Kohdechatti, ryhmä tai kanavan ID |
| `message` | lauseke | Lähtevä viestiteksti. Tukee [lausekkeita](../reference/expression-dsl.md). |

## Asennus

1. Luo [Telegram Bot -tunnistetiedot](../reference/integrations.md#telegram)
2. Lisää **Telegram**-solmu workflowsiin
3. Valitse tunnistetiedot
4. Aseta `chatId` staattiseksi chatti-ID:ksi tai lausekkeeksi kuten `$telegramEvent.message.chat.id`
5. Aseta `message` lähteväksi tekstiksi tai ylävirran datasta rakennetuksi malliksi

## Esimerkki

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Vastaanotettu: $telegramEvent.message.text"
  }
}
```

## Tulostekentät

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` onnistuneessa lähetyksessä |
| `$nodeLabel.ok` | Telegram API:n onnistumismerkki |
| `$nodeLabel.result` | Raaka `sendMessage` -tulosobjekti Telegramilta |
| `$nodeLabel.result.message_id` | Telegram-viestin ID |
| `$nodeLabel.result.chat.id` | Kohdechatin ID, jonka Telegram palauttaa |

## Yleiset käyttötavat

- Yhdistä se [Telegram Trigger](./telegram-trigger-node.md) -solmuun keskustelevien bottien luomiseen
- Lähetä virheilmoituksia [Error Handler](./error-handler-node.md) -solmun kautta
- Lähetä yhteenvetoja, jotka on luotu [LLM](./llm-node.md) - tai [Agent](./agent-node.md) -solmujen avulla

## Liittyvät

- [Telegram Trigger](./telegram-trigger-node.md) – Käynnistä workflow saapuvista bottiviestistä
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Telegram-tunnistetietojen asennus
- [Tunnistetieto-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi `telegram`-tunnistetietoja
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä

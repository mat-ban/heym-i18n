# Telegram Trigger

**Telegram Trigger** -solmu on nollasyötteinen käynnistyspiste, joka aktivoi workflown, kun Telegram-bottisi vastaanottaa webhook-päivityksen. Käytä sitä chatbot-ratkaisuihin, tukipalvelujen ohjaukseen, komentorivin tyylisiin komentoihin tai inline-painikkeiden takaisinkutsuihin, jotka käsitellään alaspäin suuntautuvissa tekoäly- ja integraatiosolmuissa.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` -tunnistetiedot, jotka sisältävät bot-tokenin ja valinnaisen webhook-salausmerkin |

## Asennusopas

### 1. Luo `telegram` -tunnistetiedot

1. Siirry kohtaan **Asetukset → Tunnistetiedot → Uudet tunnistetiedot**
2. Valitse tyyppi **Telegram Bot**
3. Liitä **Bot Token** BotFatherista
4. Aseta valinnaisesti **Webhook Secret Token**, jos haluat Telegramin lähettävän vahvistusotsikon
5. Tallenna tunnistetiedot

### 2. Lisää solmu workflowhin

1. Vedä **Telegram Trigger** canvasille
2. Avaa solmun ominaisuudet valitsemalla solmu
3. Valitse `telegram` -tunnistetiedot
4. Kopioi solmun paneelissa näkyvä **Webhook URL**

### 3. Rekisteröi webhook Telegramissa

Käytä Bot API:n `setWebhook` -metodia solmusta kopioidulla URL-osoitteella:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Jos määritit salausmerkin Heymissä, lähetä sama arvo webhookin asettamisen yhteydessä:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Tulostekentät

Kun solmu on aktivoitunut, alaspäin suuntautuvat solmut voivat käyttää seuraavia kenttiä:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.update` | Koko Telegram-päivityksen payload |
| `$nodeLabel.message` | Pääasiallinen viestin kaltainen objekti päivityksestä |
| `$nodeLabel.message.text` | Saapuva viestin teksti |
| `$nodeLabel.message.chat.id` | Keskustelun ID vastaamista varten |
| `$nodeLabel.message.from.id` | Telegram-käyttäjän ID |
| `$nodeLabel.callback_query` | Takaisinkutsun payload, kun päivitys tuli inline-näppäimistöstä |
| `$nodeLabel.headers` | Siivotut webhook-otsikot |
| `$nodeLabel.triggered_by` | Käynnistyslähteen tunniste (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | Canvas-solmun ID, joka vastaanotti Telegram-päivityksen |
| `$nodeLabel.triggered_at` | ISO-aikaleima tälle workflown suoritukselle |

## Esimerkkiworkflow

**Telegram-viesti → LLM → Telegram-vastaus**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** -tunniste: `telegramEvent`
- **LLM** -käyttäjäviesti: `"Vastaa lyhyesti tähän käyttäjäviestiin: $telegramEvent.message.text"`
- **Telegram** -chatId: `$telegramEvent.message.chat.id`

## Turvallisuus

- Jos tunnistetiedoissasi on `secret_token`, Heym vahvistaa `x-telegram-bot-api-secret-token` -otsikon ennen workflown suorittamista.
- Arkaluontoiset pyyntöotsikot poistetaan ennen kuin payload saavuttaa alaspäin suuntautuvat solmut.
- Webhook-URL on staattinen solmun ID:lle, joten sitä tarvitsee rekisteröidä uudelleen vain, jos solmu itse muuttuu.

## Aiheeseen liittyvät

- [Telegram-solmu](./telegram-node.md) – Lähetä vastaus tai ulkoinen ilmoitus
- [Käynnistimet](../reference/triggers.md) – Yleiskatsaus kaikista workflown käynnistyspisteistä
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Telegram-tunnistetietojen asennus
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi `telegram` -tunnistetietoja

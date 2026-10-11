# Slack Trigger -solmu

**Slack Trigger** -solmu on nollasyötteinen käynnistyspiste, joka vastaanottaa Slack Events API -webhookkeja ja käynnistää workflown automaattisesti. Se käsittelee Slackin URL-vahvistushaasteen ja vahvistaa pyyntöjen allekirjoitukset signing secret -avaimella.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` -tunnistetiedot, jotka sisältävät signing secret -avaimen |

## Asetusopas

### 1. Luo `slack_trigger` -tunnistetiedot

1. Siirry kohtaan **Asetukset → Tunnistetiedot → Uudet tunnistetiedot**
2. Valitse tyyppi **Slack Trigger (Signing Secret)**
3. Liitä **Signing Secret** -avain Slack-sovelluksestasi:
   - Slackissa: **App settings → Basic Information → App Credentials → Signing Secret**
4. Tallenna tunnistetiedot

### 2. Lisää solmu workflowhin

1. Avaa workflown canvas
2. Vedä **Slack Trigger** -solmu solmupaneelista canvasille
3. Klikkaa solmua avataksesi ominaisuuspaneelin
4. Valitse `slack_trigger` -tunnistetiedot
5. Kopioi paneelissa näkyvä **Webhook URL** -osoite

### 3. Määritä Slack-sovelluksesi

1. Slack-sovelluksen asetuksissa siirry kohtaan **Event Subscriptions**
2. Ota **Enable Events** käyttöön
3. Liitä Webhook URL -osoite **Request URL** -kenttään
4. Slack lähettää URL-vahvistushaasteen - Heym vastaa automaattisesti millisekunnin sisällä
5. Kenttä muuttuu vihreäksi: ✓ Verified
6. Tilaa tarvitsemasi **Bot Events** -tapahtumat (esim. `message.channels`, `reaction_added`)
7. Tallenna muutokset ja asenna sovellus uudelleen workspaceesi tarvittaessa

## Tulostekentät

Kun solmu on käynnistynyt, seuraavat solmut voivat käyttää:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.event` | Koko Slack-tapahtumaobjekti |
| `$nodeLabel.event.type` | Tapahtuman tyyppi (esim. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Viestin teksti (kun sovellettavissa) |
| `$nodeLabel.event.user` | Slack-käyttäjän ID, joka käynnisti tapahtuman |
| `$nodeLabel.event.channel` | Kanavan ID |
| `$nodeLabel.event.ts` | Tapahtuman aikaleima |
| `$nodeLabel.headers` | Siivotut HTTP-otsakkeet Slackilta |
| `$nodeLabel.triggered_by` | Käynnistyslähteen tunniste (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Canvas-solmun ID, joka vastaanotti Slack-tapahtuman |

## Esimerkkiworkflow

**Slack-viesti → LLM-vastaus → Slack-lähetys:**

```
slackTrigger → llm → slack
```

- **slackTrigger** -solmun tunniste: `slackEvent`
- **LLM** -käyttäjäviesti: `"Vastaa tähän Slack-viestiin: $slackEvent.event.text"`
- **Slack** -viesti: `$llm.text`

## Turvallisuus

- Pyynnöt vahvistetaan käyttämällä **HMAC-SHA256** -algoritmia signing secret -avaimella
- Yli **5 minuuttia** vanhat aikaleimat hylätään (estää replay-hyökkäykset)
- Arkaluontoiset otsakkeet (`x-slack-signature`, `authorization` jne.) poistetaan ennen kuin ne saavuttavat seuraavat solmut
- Jos tunnistetietoja ei ole asetettu, solmu suoritetaan ilman vahvistusta - suositellaan vain paikallisessa testauksessa

## Huomioita

- Heym vastaa välittömästi `200 OK` -statuskoodilla ja suorittaa workflown taustalla - tämä täyttää Slackin 3 sekunnin vastausvaatimuksen
- Webhook URL -osoite johdetaan solmun ID:stä eikä muutu workflown nimeämisen jälkeen
- Workflowssa tarvitaan vain yksi `slackTrigger` -solmu; eri tapahtumatyypit voidaan ohjata eteenpäin **Switch**- tai **Condition** -solmuilla

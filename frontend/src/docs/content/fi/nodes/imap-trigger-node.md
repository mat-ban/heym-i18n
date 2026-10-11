# IMAP Trigger

**IMAP Trigger** -solmu kyselyttää sähköpostilaatikkoa säännöllisin väliajoin ja käynnistää workflown jokaisesta uudesta viestistä. Tämä nollasyötteinen trigger-solmu on suunniteltu saapuvan sähköpostin automatisointiin, kuten tukipyyntöjen käsittelyyn, jaettujen postilaatikoiden seurantaan sekä hyväksyntäviestien hallintaan.

## Yleiskatsaus

| Ominaisuus | Arvo |
|-----------|------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|--------|--------|
| `credentialId` | UUID | `imap`-tunnistetiedot, jotka sisältävät palvelimen, kirjautumistiedot, postilaatikon ja SSL-asetukset |
| `pollIntervalMinutes` | Kokonaisluku | Kuinka usein Heym tarkistaa postilaatikon uusien viestien varalta |

## Asennusopas

### 1. Luo `imap`-tunnistetiedot

1. Siirry kohtaan **Asetukset → Tunnistetiedot → Uudet tunnistetiedot**
2. Valitse tyyppi **IMAP Email Inbox**
3. Syötä:
   - **IMAP Host** (esim. `imap.gmail.com`)
   - **IMAP Port** (`993` SSL/TLS:lle useimmilla palveluntarjoajilla)
   - **Käyttäjätunnus / Sähköposti**
   - **Salasana / Sovellussalasana**
   - Valinnainen **Postilaatikko** (oletus: `INBOX`)
4. Jätä **Use SSL / TLS** käyttöön, ellei sähköpostipalvelin vaadi eksplisiittisesti ei-SSL IMAP:ia
5. Tallenna tunnistetiedot

### 2. Lisää solmu workflowsiin

1. Vedä **IMAP Trigger** canvakselle
2. Valitse solmu avataksesi ominaisuuspaneelin
3. Valitse `imap`-tunnistetiedot
4. Aseta **Poll Interval (Minutes)** kokonaislukuarvoilla, kuten `1`, `5` tai `15`

## Trigger-semantiikka

- Ensimmäinen kysely luo perustason nykyisestä postilaatikon sisällöstä eikä **toista** vanhempia viestejä.
- Myöhemmät kyselyt käynnistävät workflown jokaisesta viestistä, jonka IMAP UID on uudempi kuin tallennettu kursori.
- Jos postilaatikon `UIDVALIDITY` muuttuu, Heym nollaa kursorin ja luo uuden perustason välttääkseen kaksoiskäsittelyn.
- Jokainen uusi sähköposti käynnistää erillisen workflow-suorituksen, jossa `trigger_source = "imap"`.

## Tulostekentät

Kun solmu on käynnistynyt, alaspäin suuntautuvat solmut voivat käyttää seuraavia:

| Lauseke | Kuvaus |
|---------|--------|
| `$nodeLabel.email` | Koko jäsennelty sähköpostin payload |
| `$nodeLabel.email.subject` | Dekoodattu aihe |
| `$nodeLabel.email.from` | Raaka `From`-otsake |
| `$nodeLabel.email.fromAddresses` | Jäsennelty lähettäjälista |
| `$nodeLabel.email.toAddresses` | Jäsennelty vastaanottajalista |
| `$nodeLabel.email.ccAddresses` | Jäsennelty CC-lista |
| `$nodeLabel.email.replyToAddresses` | Jäsennelty vastausosoitelista |
| `$nodeLabel.email.text` | Pelkkä tekstiviesti |
| `$nodeLabel.email.html` | HTML-viesti |
| `$nodeLabel.email.attachments` | Liitemetatiedon taulukko (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekoodattu otsakeobjekti |
| `$nodeLabel.email.uid` | IMAP UID dedupointia tai lokitusta varten |
| `$nodeLabel.triggered_by` | Trigger-lähde (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Canvas-solmun ID, joka havaitsi sähköpostin |
| `$nodeLabel.triggered_at` | ISO-aikaleima workflow-suoritukselle |

## Esimerkkiworkflow

**Saapuva tukipyyntö → tiivistä → reititä**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** -solmun nimi: `supportInbox`
- **LLM** -käyttäjäviesti: `"Tiivistä tämä viesti lähettäjältä $supportInbox.email.from: $supportInbox.email.text"`
- **Ehto**: `$supportInbox.email.subject.lower().contains("urgent")`

## Huomioita

- Monet palveluntarjoajat vaativat **sovellussalasanaa** IMAP-yhteyden sijasta pääkäyttäjätilin salasanan sijasta.
- Liitteiden sisältöjä ei lisätä workflown syötteeseen; vain liitemetatiedot sisällytetään.
- Käytä [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) tai [DataTable](./datatable-node.md) -solmuja alaspäin reitittääksesi tai kirjataksesi uusia viestejä.

## Aiheeseen liittyvät

- [Triggerit](../reference/triggers.md) – Yleiskatsaus kaikista workflown käynnistyspisteistä
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – IMAP-tunnistetietojen asennus
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi `imap`-tunnistetietoja
- [Send Email](./send-email-node.md) – Vastaa tai välitä saapuvia viestejä

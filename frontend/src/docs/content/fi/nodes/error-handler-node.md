# Virheenkäsittelijä

**Virheenkäsittelijä**-solmu sieppaa virheet mistä tahansa workflown solmusta. Kun se on käytössä, se suoritetaan automaattisesti, kun mikä tahansa solmu epäonnistuu. Sisääntulevia yhteyksiä ei tarvita – workflow-moottri käynnistää sen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 (käynnistyy virhetilanteessa) |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `message` | lauseke | Valinnainen. Oletus: `$error.message` |

## Virhekonteksti

Kun virheenkäsittelijä suoritetaan, seuraavat kentät ovat saatavilla:

| Kenttä | Kuvaus |
|-------|-------------|
| `$errorHandler.error` | Virheviestimerkkijono |
| `$errorHandler.errorNode` | Epäonnistuneen solmun tunniste |
| `$errorHandler.errorNodeType` | Epäonnistuneen solmun tyyppi |
| `$errorHandler.timestamp` | Virheen esiintymisaika |

## Käyttötarkoitukset

- Lähetä [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- tai [Sähköposti](./send-email-node.md)-ilmoituksia virhetilanteista
- Kirjaa virheet ulkoisiin järjestelmiin
- Palauta mukautettu virheviesti [Tuloste](./output-node.md)-solmun kautta

Workflowssa voi olla vain yksi Virheenkäsittelijä.

## Esimerkki

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Yhdistä Tuloste-solmuun mukautetun virheviestin palauttamiseksi:
```json
{"message": "Virhe: $errorHandler.error solmussa $errorHandler.errorNode"}
```

Tai yhdistä Slackiin ilmoitusten lähettämiseksi:
```json
{"message": "Workflow epäonnistui: $errorHandler.error solmussa $errorHandler.errorNode"}
```

## Aiheeseen liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Telegram-solmu](./telegram-node.md) – Virhe-ilmoitukset
- [Slack-solmu](./slack-node.md) – Virhe-ilmoitukset
- [Sähköpostin lähetys -solmu](./send-email-node.md) – Sähköpostihälytykset
- [Virheen aiheuttaminen -solmu](./throw-error-node.md) – Tarkoitukselliset virheet

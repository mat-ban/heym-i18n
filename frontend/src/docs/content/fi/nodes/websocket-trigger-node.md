# WebSocket Trigger

**WebSocket Trigger** -solmu avaa ulospäin suuntautuvan asiakasyhteyden ulkoiseen WebSocket-palvelimeen ja käynnistää workflow:n valittujen socket-tapahtumien yhteydessä. Käytä sitä tapahtumavirtoihin, kuten markkinoiden tiedotuskanaviin, telemetriaan tai chat-järjestelmiin. Sisäisiin reaaliaikajärjestelmiin yhdistäminen edellyttää alla kuvattua yksityisen URL:n käyttöoikeuden poikkeusta.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Tärkeää toimintalogiikkaa

- Tämä solmu yhdistää **Heymistä toiseen WebSocket-palvelimeen**.
- Se **ei** tarjoa WebSocket-päätepistettä Heymissä.
- [Tunnistetietoja](../reference/credentials.md) ei vaadita. Määritä URL, otsakkeet ja aliprotokollat suoraan solmussa.
- Johtava worker pitää yhteyden aktiivisena taustalla ja yhdistää uudelleen, kun toiminto on käytössä.

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `websocketUrl` | merkkijono | Ulkoinen `ws://` tai `wss://` -URL |
| `websocketHeaders` | JSON-objektimerkkijono | Valinnaiset kättelyotsakkeet |
| `websocketSubprotocols` | merkkijono | Valinnaiset pilkuin erotetut aliprotokollat |
| `websocketTriggerEvents` | taulukko | Jokin seuraavista: `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | totuusarvo | Yhdistä uudelleen katketun yhteyden jälkeen |
| `retryWaitSeconds` | kokonaisluku | Viive ennen uudelleenyhdistämistä |

## Lähetetyt tapahtumat

### `onMessage`

Käynnistyy, kun kehys saapuu etäpalvelimelta.

Hyödylliset kentät:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.message.data` | Jäsennelty JSON-payload tai raaka viestiarvo |
| `$nodeLabel.message.text` | UTF-8 -dekoodattu teksti, kun saatavilla |
| `$nodeLabel.message.base64` | Binääripayload base64 -muodossa |
| `$nodeLabel.message.sizeBytes` | Payloadin koko |
| `$nodeLabel.message.isJson` | Onko viesti jäsennelty JSONiksi |

### `onConnected`

Käynnistyy, kun socket-yhteys avautuu onnistuneesti.

Hyödylliset kentät:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` ensimmäisellä yhdistämiskerralla, `true` myöhemmillä uudelleenyhdistämisillä |
| `$nodeLabel.connection.subprotocol` | Neuvoteltu aliprotokolla |

### `onClosed`

Käynnistyy, kun vakiintunut yhteys katkeaa.

Hyödylliset kentät:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` tai `unknown` |
| `$nodeLabel.close.code` | WebSocketin sulkemiskoodi |
| `$nodeLabel.close.reason` | Sulkeutumisen syy |
| `$nodeLabel.close.wasClean` | `true` normaalin `1000` -sulkemisen yhteydessä |
| `$nodeLabel.close.reconnecting` | Yrittääkö solmu yhdistää uudelleen |

## Trigger-semantiikka

- Yksi aktiivinen solmu ylläpitää yhtä pitkäikäistä ulospäin suuntautuvaa socket-yhteyttä.
- Yhteys toimii vain johtavalla workerilla, kuten [IMAP Trigger](./imap-trigger-node.md) - ja [RabbitMQ](./rabbitmq-node.md) -vastaanottotilassa.
- Jos uudelleenyhdistäminen on käytössä, Heym odottaa `retryWaitSeconds` -ajan ja avaa socketin uudelleen katketun yhteyden jälkeen.
- Jokainen lähetetty tapahtuma luo erillisen workflow-ajon, jossa `trigger_source = "websocket"`.

## Ulospäin suuntautuvan liikenteen turvallisuus

- Oletusarvoisesti URL:n on käytettävä `ws://` tai `wss://` -muotoa ja se saa viitata vain julkisiin osoitteisiin. Silmukka-, yksityis-, linkkilokaali-, monilähetys- ja pilvimetatietokohteet estetään.
- Heym vahvistaa DNS:n jokaisella uudelleenyhdistämiskerralla, tarkistaa jokaisen selvitetyn osoitteen ja yhdistää suoraan yhteen näistä osoitteista. Ympäristön välityspalvelimet ja WebSocket-uudelleenohjaukset ovat pois käytöstä, kun suojaus on aktiivinen.
- Pysyvät käytännön rikkomukset pysäyttävät triggerin sen sijaan, että yrittäisivät uudelleen loputtomasti. Tilapäiset DNS- tai verkkovirheet noudattavat solmun uudelleenyrittämisasetuksia.
- `Authorization`, `Origin`, `User-Agent` ja mukautetut dataotsakkeet ovat tuettuja. `Origin` lähetetään WebSocket-asiakkaan omien asetusten kautta. `Host`, `Connection`, `Upgrade` ja `Sec-WebSocket-*` -otsakkeita ei voi ohittaa.
- Luotetut itse isännöidyt asennukset, jotka tarkoituksella yhdistävät sisäisiin palveluihin, voivat asettaa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Säilytä oletusarvo isännöidyissä tai monivuokraajajärjestelmissä.

**Päivityshuomatus versiolle v0.0.105:** Tämä koko järjestelmää koskeva käytäntö suojaa nyt myös tunnistetiedoista johdettuja kohteita, joita käyttävät Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, mukautetut LLM-ajot ja mallien löytäminen, tekoälyavustaja, suojaukset ja RAG-upotukset. Olemassa olevat tunnistetiedot, jotka viittaavat silmukka-, yksityis- tai linkkilokaaliosoitteisiin, hylätään, ellei `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ole käytössä luotetussa itse isännöidyssä asennuksessa. Kun suojaus on päällä, suojatut HTTP-asiakkaat ohittavat `HTTP_PROXY` ja `HTTPS_PROXY` -asetukset; poikkeuksen käyttöönotto palauttaa ne. Operaattorin CA-paketit, jotka on määritetty `SSL_CERT_FILE` tai `SSL_CERT_DIR` -kautta, pysyvät tuettuina. ClickHouse tarkistetaan ennen yhteyden avaamista, mutta osoitetta ei kiinnitetä yhdistämishetkellä, koska clickhouse-connect käyttää omaa urllib3-kuljetustaan.

## Esimerkkiworkflow

**Ulkoinen tapahtumavirta → suodatus → ilmoitus**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** -solmun nimi: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** -viesti: `"Reaaliaikainen hälytys: $streamEvent.message.data.title"`
## Esimerkkisolmun JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Liittyvät asiat

- [Triggerit](../reference/triggers.md) – Taustalla toimivien triggerien arkkitehtuuri ja `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Datan lähettäminen ulkoiseen socketiin workflow-vaiheessa
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikkiin solmuihin
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Mitkä solmut käyttävät tunnistetietoja ja mitkä eivät

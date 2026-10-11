# WebSocket Send

**WebSocket Send** -solmu avaa ulospäin suuntautuvan asiakasyhteyden ulkoiseen WebSocket-palvelimeen, lähettää yhden viestin ja sulkee yhteyden. Käytä tätä solmua, kun workflown tulee lähettää tapahtumia reaaliaikaiselle järjestelmälle paljastamatta Heymin omistamaa socket-päätepistettä.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `websocketUrl` | merkkijono / lauseke | Ulkoinen `ws://` tai `wss://` -URL |
| `websocketHeaders` | JSON-objektimerkkijono / lauseke | Valinnaiset kättelyotsikot |
| `websocketSubprotocols` | merkkijono | Valinnainen pilkuin erotettu aliprotokollalista |
| `websocketMessage` | lauseke | Lähetettävä payload |

## Viestin sarjallistamissäännöt

- Jos `websocketMessage` ratkaisee **merkkijonoksi**, Heym lähettää tekstikehyksen.
- Jos se ratkaisee **objektiksi**, **taulukoksi**, **numeroksi**, **totuusarvoksi** tai `null`:ksi, Heym sarjallistaa sen JSON-tekstinä.
- Jos se ratkaisee **tavuiksi**, Heym lähettää binäärisen kehyksen.
- Täydelliset lausekkeet kuten `$input` säilyttävät alkuperäiset tyypit ennen sarjallistamista.

## Tulostekentät

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` onnistuneessa lähetyksessä |
| `$nodeLabel.url` | Ratkaistu kohde-URL |
| `$nodeLabel.message_type` | `text`, `json` tai `binary` |
| `$nodeLabel.size_bytes` | Payloadin koko tavuina |
| `$nodeLabel.subprotocol` | Neuvoteltu aliprotokolla, kun se on käytössä |
| `$nodeLabel.sent_at` | ISO-aikaleima |

## Esimerkkiworkflow

**HTTP-pyyntö → muunnos → julkaisu WebSocketin kautta**

```
input → set → websocketSend → output
```

- **Set** luo payload-objektin, kuten `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** käyttää `$payloadNode`:a `websocketMessage`:na
- **Output** voi palauttaa `$socketSend.status`

## Esimerkkisolmun JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Huomiot

- Tämä solmu ei vaadi [tunnistetietoja](../reference/credentials.md).
- Jos etäpalvelin odottaa autentikointi- tai vuokraajaotsikoita, välitä ne `websocketHeaders`:n kautta.
- Käytä [HTTP](./http-node.md) -solmua, kun etäjärjestelmä perustuu pyyntö/vastaus -malliin socketin sijaan.

## Egress-turvallisuus

- Oletusarvoisesti URL:n on käytettävä `ws://` tai `wss://` -muotoa ja se saa ratkaista vain julkisiin osoitteisiin. Silmukka-, yksityis-, linkkilokaali-, monilähetys- ja pilvimetatietokohteet estetään.
- Heym vahvistaa jokaisen ratkaistun osoitteen ja muodostaa yhteyden suoraan yhteen näistä osoitteista. Ympäristön välityspalvelimet ja WebSocket-uudelleenohjaukset ovat pois käytöstä, kun suojaus on aktiivinen.
- `Authorization`, `Origin`, `User-Agent` ja mukautetut dataotsikot ovat tuettuja. `Origin` lähetetään WebSocket-asiakkaan omien asetusten kautta. `Host`, `Connection`, `Upgrade` ja `Sec-WebSocket-*` -otsikoita ei voi ohittaa.
- Luotetut itseisännöidyt käyttöönotot, jotka tarkoituksella yhdistävät sisäisiin palveluihin, voivat asettaa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Säilytä oletusarvo isännöidyissä tai monivuokraajajärjestelmissä.

**Päivityshuomio versiolle v0.0.105:** tämä järjestelmänlaajuinen käytäntö suojaa nyt myös tunnistetietojen avulla määritettyjä kohteita, joita käyttävät Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, mukautetut LLM-suoritukset ja mallinetsintä, tekoälyavustaja, suojaukset ja RAG-upotukset. Olemassa olevat tunnistetiedot, jotka osoittavat silmukka-, yksityis- tai linkkilokaaliosoitteisiin, hylätään, ellei `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ole käytössä luotetussa itseisännöidyssä käyttöönotossa. Kun suojaus on päällä, suojatut HTTP-asiakkaat ohittavat `HTTP_PROXY` ja `HTTPS_PROXY` -asetukset; opt-outin käyttöönotto palauttaa ne. Operaattorin CA-paketit, jotka on määritetty `SSL_CERT_FILE` tai `SSL_CERT_DIR` -kautta, pysyvät tuettuina. ClickHouse tarkistetaan ennen yhteyden avaamista, mutta sitä ei kiinnitetä yhteydenmuodostusvaiheessa, koska clickhouse-connect käyttää omaa urllib3-kuljetustaan.

## Aiheeseen liittyvät

- [WebSocket Trigger](./websocket-trigger-node.md) – Kuuntele ulkoista socketia ja käynnistä workflowja tapahtumien perusteella
- [Solmutyypit](../reference/node-types.md) – Integraatiosolmujen yleiskatsaus
- [Expression DSL](../reference/expression-dsl.md) – Luo dynaamisia JSON-payloadeja
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Tunnistetietopohjaiset vs. suorat konfigurointiintegraatiot

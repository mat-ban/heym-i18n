# WebSocket Trigger

**WebSocket Trigger** node avab väljamineva kliendiühenduse välistele WebSocket-serverile ja käivitab workflow, kui valitud socket-sündmused toimuvad. Kasutage seda sündmustevoogude jaoks nagu turuandmevood, telemeetria või chat-tagatasendussüsteemid. Ühenduse loomine sisemiste reaalajasüsteemidega nõuab allpool kirjeldatud privaatse URL-i erandit.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Oluline käitumine

- See node loob ühenduse **Heymist teise WebSocket-serverisse**.
- See **ei** ava WebSocket endpoint'i Heymis.
- Ühtegi [mandaati](../reference/credentials.md) ei ole vaja. Konfigureerige URL, päised ja alamprotokollid otse node'il.
- Leader-töötaja hoiab ühendust taustal avatuna ja taasühendub, kui see on lubatud.

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `websocketUrl` | string | Väline `ws://` või `wss://` URL |
| `websocketHeaders` | JSON object string | Valikulised kätlemispäised |
| `websocketSubprotocols` | string | Valikuline komadega eraldatud alamprotokollide loend |
| `websocketTriggerEvents` | array | Ükskõik milline järgmistest: `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Taasühendumine pärast ühenduse katkemist |
| `retryWaitSeconds` | integer | Viivitus enne taasühendumist |

## Edastatavad sündmused

### `onMessage`

Käivitub, kui kaugsocket'ist saabub kaader.

Kasulikud väljad:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.message.data` | Parsitud JSON payload või töötlemata sõnumi väärtus |
| `$nodeLabel.message.text` | UTF-8 dekodeeritud tekst, kui saadaval |
| `$nodeLabel.message.base64` | Binaarne payload base64-kujul |
| `$nodeLabel.message.sizeBytes` | Payload'i suurus |
| `$nodeLabel.message.isJson` | Kas sõnum parsiti JSON-ina |

### `onConnected`

Käivitub pärast socket'i edukat avanemist.

Kasulikud väljad:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` esmakordsel ühendumisel, `true` hilisematel taasühendumistel |
| `$nodeLabel.connection.subprotocol` | Läbiräägitud alamprotokoll |

### `onClosed`

Käivitub, kui loodud ühendus sulgub.

Kasulikud väljad:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` või `unknown` |
| `$nodeLabel.close.code` | WebSocket'i sulgemiskood |
| `$nodeLabel.close.reason` | Sulgemise põhjus |
| `$nodeLabel.close.wasClean` | `true` normaalse `1000` sulgemise korral |
| `$nodeLabel.close.reconnecting` | Kas node üritab taasühenduda |

## Triggeri semantika

- Üks aktiivne node hoiab ühte pikaajalist väljaminevat socket-ühendust.
- Ühendus töötab ainult leader-töötajal, sarnaselt [IMAP Trigger](./imap-trigger-node.md) ja [RabbitMQ](./rabbitmq-node.md) vastuvõturežiimile.
- Kui taasühendumine on lubatud, ootab Heym `retryWaitSeconds` ja avab socket'i uuesti pärast katkestust.
- Iga edastatud sündmus loob eraldi workflow käivituse väärtusega `trigger_source = "websocket"`.

## Väljamineva liikluse turvalisus

- Vaikimisi peab URL kasutama `ws://` või `wss://` ja lahenema ainult avalikeks aadressideks. Loopback-, privaatsed, link-local-, multicast- ja pilve-metadata sihtkohad on blokeeritud.
- Heym valideerib DNS-i uuesti igal taasühendumisel, valideerib iga lahendatud aadressi ja ühendub otse ühega neist aadressidest. Keskkonnamuutujate proxy'd ja WebSocket'i ümbersuunamised on kaitsemeetme aktiivsuse ajal keelatud.
- Püsivad poliitikarikkumised peatavad triggeri, selle asemel et lõputult uuesti proovida. Ajutised DNS- või võrguvead järgivad siiski node'i uuestiproovimise seadeid.
- `Authorization`, `Origin`, `User-Agent` ja kohandatud andmepäised on toetatud. `Origin` saadetakse WebSocket'i kliendi spetsiaalse valiku kaudu. `Host`, `Connection`, `Upgrade` ja `Sec-WebSocket-*` päiseid ei saa üle kirjutada.
- Usaldusväärsed isemajutatud juurutused, mis ühenduvad teadlikult sisemiste teenustega, saavad määrata `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtust hostitud või mitme rentniku juurutustel.

**Uuendusteade versioonile v0.0.105:** see eksemplariülene poliitika kaitseb nüüd ka mandaadipõhiseid sihtkohti, mida kasutavad Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, kohandatud LLM-i täitmine ja mudelite avastamine, AI-assistent, guardrails ja RAG-embeddingud. Olemasolevad mandaadid, mis osutavad loopback-, privaatsetele või link-local-aadressidele, lükatakse tagasi, välja arvatud juhul, kui `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` on lubatud usaldusväärsel isemajutatud eksemplaril. Kui kaitse on sees, eiravad kaitstud HTTP-kliendid `HTTP_PROXY` ja `HTTPS_PROXY`; erandi lubamine taastab need. Operaatori CA-paketid, mis on konfigureeritud `SSL_CERT_FILE` või `SSL_CERT_DIR` kaudu, on endiselt toetatud. ClickHouse'i kontrollitakse enne ühenduse avamist, kuid seda ei kinnitata valimise ajal, kuna clickhouse-connect toob kaasa oma urllib3-transpordi.

## Näidis-workflow

**Väline sündmustevoog → filter → teavitus**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** silt: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** sõnum: `"Realtime alert: $streamEvent.message.data.title"`
## Näidis Node JSON

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

## Seotud

- [Triggerid](../reference/triggers.md) – Taustaprotsessis töötavate triggerite arhitektuur ja `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Andmete saatmine välisesse socketisse workflow sammu kaudu
- [Node Types](../reference/node-types.md) – Ülevaade kõigist node'idest
- [Third-Party Integrations](../reference/integrations.md) – Millised node'id kasutavad mandaate ja millised mitte

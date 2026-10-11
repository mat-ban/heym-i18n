# WebSocket Send

**WebSocket Send** node avab väljamineva kliendiühenduse välistele WebSocket-serverile, saadab ühe sõnumi ja sulgeb ühenduse. Kasutage seda, kui workflow'l on vaja sündmusi reaalajas süsteemi saata ilma Heym'i hallatavat socket-endpointi avaldamata.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `websocketUrl` | string / avaldis | Väline `ws://` või `wss://` URL |
| `websocketHeaders` | JSON-objekti string / avaldis | Valikulised handshake-päised |
| `websocketSubprotocols` | string | Valikuline komadega eraldatud alamprotokollide loend |
| `websocketMessage` | avaldis | Saadetav payload |

## Sõnumi serialiseerimise reeglid

- Kui `websocketMessage` laheneb **stringiks**, saadab Heym tekstiraami.
- Kui see laheneb **objektiks**, **massiiviks**, **numbriks**, **tõeväärtuseks** või `null`-iks, serialiseerib Heym selle JSON-tekstina.
- Kui see laheneb **baitideks**, saadab Heym binaarraami.
- Täielikud avaldised nagu `$input` säilitavad enne serialiseerimist oma loomulikud tüübid.

## Väljundi väljad

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` õnnestumise korral |
| `$nodeLabel.url` | Lahendatud siht-URL |
| `$nodeLabel.message_type` | `text`, `json` või `binary` |
| `$nodeLabel.size_bytes` | Payload'i suurus baitides |
| `$nodeLabel.subprotocol` | Kokku lepitud alamprotokoll, kui see on olemas |
| `$nodeLabel.sent_at` | ISO ajatempel |

## Näidis-workflow

**HTTP-päring → teisendus → avaldamine üle WebSocket'i**

```
input → set → websocketSend → output
```

- **Set** loob payload-objekti nagu `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** kasutab `$payloadNode` väärtust `websocketMessage`-ina
- **Output** saab tagastada `$socketSend.status`

## Näidis-node JSON

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

## Märkused

- Selle node'i jaoks ei ole vaja [mandaati](../reference/credentials.md).
- Kui kaugserver eeldab autentimist või tenant-päiseid, edastage need `websocketHeaders` kaudu.
- Kasutage [HTTP](./http-node.md), kui kaugsüsteem põhineb päringu/vastuse mudelil, mitte socketil.

## Väljamineva liikluse turvalisus

- Vaikimisi peab URL kasutama `ws://` või `wss://` ning lahenema ainult avalikeks aadressideks. Loopback-, privaatsed, link-local-, multicast- ja cloud-metadata sihtkohad on blokeeritud.
- Heym valideerib iga lahendatud aadressi ja ühendub otse ühega neist aadressidest. Keskkonna proxy'd ja WebSocket'i ümbersuunamised on kaitsemeetme aktiivsuse ajal keelatud.
- Toetatud on `Authorization`, `Origin`, `User-Agent` ja kohandatud andmepäised. `Origin` saadetakse WebSocket'i kliendi spetsiaalse valiku kaudu. `Host`, `Connection`, `Upgrade` ja `Sec-WebSocket-*` päiseid ei saa üle kirjutada.
- Usaldusväärsed isemajutatud juurutused, mis ühenduvad teadlikult sisevõrgu teenustega, saavad määrata `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtust hostitud või mitme rentnikuga juurutustel.

**Uuendamise märkus versioonile v0.0.105:** see instantsipõhine poliitika kaitseb nüüd ka mandaadipõhiseid sihtkohti, mida kasutavad Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, kohandatud LLM-i täitmine ja mudelite avastamine, AI-assistent, guardrails ja RAG-embeddingud. Olemasolevad mandaadid, mis osutavad loopback-, privaatsetele või link-local-aadressidele, lükatakse tagasi, välja arvatud juhul, kui usaldusväärses isemajutatud instantsis on lubatud `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Kui kaitse on sisse lülitatud, eiravad kaitstud HTTP-kliendid `HTTP_PROXY` ja `HTTPS_PROXY` seadeid; opt-out'i lubamine taastab need. Operaatori CA-paketid, mis on konfigureeritud `SSL_CERT_FILE` või `SSL_CERT_DIR` kaudu, on endiselt toetatud. ClickHouse'i kontrollitakse enne ühenduse avamist, kuid seda ei kinnitata valimise ajal, kuna clickhouse-connect toob kaasa oma urllib3-transpordi.

## Seotud

- [WebSocket Trigger](./websocket-trigger-node.md) – Kuulake välist socketit ja käivitage workflow'sid sündmuste põhjal
- [Node Types](../reference/node-types.md) – Integratsiooni node'ide ülevaade
- [Expression DSL](../reference/expression-dsl.md) – Dünaamiliste JSON-payload'de loomine
- [Third-Party Integrations](../reference/integrations.md) – Mandaadipõhised vs otsekonfigureeritavad integratsioonid

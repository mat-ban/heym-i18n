# WebSocket Trigger

**WebSocket Trigger** vozlišče odpre odhodno povezavo odjemalca do zunanjega WebSocket strežnika in zažene workflow, ko se zgodijo izbrani dogodki na vtičnici. Uporabite ga za tokove dogodkov, kot so tržne informacije, telemetrija ali chat backplanes. Povezovanje z notranjimi sistemi v realnem času zahteva izključitev zasebne URL, opisano spodaj.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Pomembno vedenje

- To vozlišče se povezuje **iz Heym do drugega WebSocket strežnika**.
- Ne izpostavlja WebSocket endpointa na Heym.
- Ni potrebna nobena [poverilnica](../reference/credentials.md). Konfigurirajte URL, glave in podprotokole neposredno na vozlišču.
- Vodilni delavec ohranja povezavo odprto v ozadju in se ponovno poveže, ko je to omogočeno.

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `websocketUrl` | niz | Zunanji `ws://` ali `wss://` URL |
| `websocketHeaders` | JSON objekt kot niz | Neobvezne glave za handshake |
| `websocketSubprotocols` | niz | Neobvezni seznam podprotokolov, ločenih z vejicami |
| `websocketTriggerEvents` | niz | Kateri koli od `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Ponovno povezovanje po prekinitvi |
| `retryWaitSeconds` | celo število | Zamuda pred ponovnim povezovanjem |

## Emitirani dogodki

### `onMessage`

Se sproži, ko okvir prispe iz oddaljene vtičnice.

Koristna polja:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.message.data` | Razčlenjen JSON payload ali suha vrednost sporočila |
| `$nodeLabel.message.text` | UTF-8 dekodirano besedilo, ko je na voljo |
| `$nodeLabel.message.base64` | Binaren payload v obliki base64 |
| `$nodeLabel.message.sizeBytes` | Velikost payloada |
| `$nodeLabel.message.isJson` | Ali je bilo sporočilo razčlenjeno kot JSON |

### `onConnected`

Se sproži, ko se vtičnica uspešno odpre.

Koristna polja:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` ob prvi povezavi, `true` ob kasnejših ponovnih povezavah |
| `$nodeLabel.connection.subprotocol` | Dogovorjeni podprotokol |

### `onClosed`

Se sproži, ko se vzpostavljena povezava zapre.

Koristna polja:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` ali `unknown` |
| `$nodeLabel.close.code` | WebSocket koda za zapiranje |
| `$nodeLabel.close.reason` | Razlog za zapiranje |
| `$nodeLabel.close.wasClean` | `true` za normalno zapiranje `1000` |
| `$nodeLabel.close.reconnecting` | Ali bo vozlišče poskušalo ponovno povezati |

## Semantika sprožilca

- Eno aktivno vozlišče ohranja eno dolgoživost odhodne povezave.
- Povezava deluje samo na vodilnem delavcu, podobno kot [IMAP Trigger](./imap-trigger-node.md) in [RabbitMQ](./rabbitmq-node.md) način prejemanja.
- Če je ponovna povezava omogočena, Heym čaka `retryWaitSeconds` in ponovno odpre vtičnico po prekinitvi.
- Vsak emitirani dogodek ustvari ločen zagon workflow z `trigger_source = "websocket"`.

## Varnost izhoda

- Privzeto mora URL uporabljati `ws://` ali `wss://` in se rešiti samo na javne naslove. Loopback, zasebni, link-local, multicast in destinacije za oblačne metapodatke so blokirane.
- Heym ponovno preverja DNS ob vsaki ponovni povezavi, preverja vsak razrešen naslov in se neposredno poveže z enim od teh naslovov. Okoljski proxyji in preusmeritve WebSocket so onemogočeni, medtem ko je zaščita aktivna.
- Trajne kršitve politike ustavijo sprožilec namesto da bi neskončno poskušale. Začasne napake DNS ali omrežja še vedno sledijo nastavitvam ponovnega povezovanja vozlišča.
- Podprti so `Authorization`, `Origin`, `User-Agent` in prilagojene glave podatkov. `Origin` se pošlje prek posebne možnosti odjemalca WebSocket. Glave `Host`, `Connection`, `Upgrade` in `Sec-WebSocket-*` ni mogoče prepisati.
- Zaupanja vredne samostojne namestitve, ki se namerno povezujejo z notranjimi storitvami, lahko nastavijo `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Ohranite privzeto nastavitev na gostovanih ali večnajemniških namestitvah.

**Opomba o nadgradnji za v0.0.105:** ta politika na ravni instance zdaj ščiti tudi destinacije, pridobljene iz poverilnic, ki jih uporabljajo Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, prilagojeno izvajanje LLM in odkrivanje modelov, AI pomočnik, zaščitne ograje in RAG vdelki. Obstoječe poverilnice, ki kažejo na loopback, zasebne ali link-local naslove, so zavrnjene, razen če je omogočena `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` na zaupanja vredni samostojni instance. Medtem ko je zaščita aktivna, zaščiteni HTTP odjemalci ignorirajo `HTTP_PROXY` in `HTTPS_PROXY`; omogočanje izključitve ju obnovi. Paketi CA operaterja, konfigurirani prek `SSL_CERT_FILE` ali `SSL_CERT_DIR`, ostajajo podprti. ClickHouse se preveri pred odprtjem povezave, vendar ni pritrjen ob času klicanja, ker clickhouse-connect prinaša svoj lasten urllib3 transport.

## Primer Workflow

**Zunanji tok dogodkov → filtriraj → obvesti**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** oznaka: `streamEvent`
- **Pogoji**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** sporočilo: `"Realtime alert: $streamEvent.message.data.title"`
## Primer JSON za vozlišče

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

## Sorodno

- [Triggers](../reference/triggers.md) – Arhitektura ozadja za sprožilce in `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Pošljite podatke na zunanji socket iz koraka workflow
- [Node Types](../reference/node-types.md) – Pregled vseh vozlišč
- [Third-Party Integrations](../reference/integrations.md) – Katera vozlišča uporabljajo poverilnice in katera ne

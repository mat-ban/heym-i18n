# WebSocket Trigger

**WebSocket Trigger** mezgls atver izejošu klienta savienojumu uz ārēju WebSocket serveri un palaiž workflow, kad notiek atlasītie socket notikumi. Izmantojiet to tādām notikumu plūsmām kā tirgus dati, telemetrija vai chat aizmugurplāksnes. Savienošanās ar iekšējām reāllaika sistēmām prasa tālāk aprakstīto privātā URL atteikšanos.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Svarīga uzvedība

- Šis mezgls savienojas **no Heym uz citu WebSocket serveri**.
- Tas **nenodrošina** WebSocket endpoint Heym pusē.
- Nav nepieciešami [akreditācijas dati](../reference/credentials.md). Konfigurējiet URL, headers un subprotokolus tieši mezglā.
- Leader worker uztur savienojumu atvērtu fonā un atkārtoti savienojas, kad tas ir iespējots.

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `websocketUrl` | string | Ārējs `ws://` vai `wss://` URL |
| `websocketHeaders` | JSON object string | Neobligāti handshake headers |
| `websocketSubprotocols` | string | Neobligāts ar komatu atdalīts subprotokolu saraksts |
| `websocketTriggerEvents` | array | Jebkurš no `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Atkārtoti savienoties pēc atvienošanās |
| `retryWaitSeconds` | integer | Aizture pirms atkārtotas savienošanās |

## Izsūtītie notikumi

### `onMessage`

Aktivizējas, kad no attālinātā socket pienāk frame.

Noderīgi lauki:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.message.data` | Parsēts JSON payload vai neapstrādāta ziņojuma vērtība |
| `$nodeLabel.message.text` | UTF-8 dekodēts teksts, ja pieejams |
| `$nodeLabel.message.base64` | Binārais payload kā base64 |
| `$nodeLabel.message.sizeBytes` | Payload izmērs |
| `$nodeLabel.message.isJson` | Vai ziņojums tika parsēts kā JSON |

### `onConnected`

Aktivizējas pēc tam, kad socket ir veiksmīgi atvērts.

Noderīgi lauki:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` pirmajā savienojumā, `true` vēlākajos atkārtotajos savienojumos |
| `$nodeLabel.connection.subprotocol` | Saskaņotais subprotokols |

### `onClosed`

Aktivizējas, kad izveidotais savienojums tiek aizvērts.

Noderīgi lauki:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` vai `unknown` |
| `$nodeLabel.close.code` | WebSocket aizvēršanas kods |
| `$nodeLabel.close.reason` | Aizvēršanas iemesls |
| `$nodeLabel.close.wasClean` | `true` normālam `1000` aizvērumam |
| `$nodeLabel.close.reconnecting` | Vai mezgls mēģinās atkārtoti savienoties |

## Trigger semantika

- Viens aktīvs mezgls uztur vienu ilgstošu izejošu socket savienojumu.
- Savienojums darbojas tikai uz leader worker, līdzīgi kā [IMAP Trigger](./imap-trigger-node.md) un [RabbitMQ](./rabbitmq-node.md) saņemšanas režīmā.
- Ja atkārtota savienošanās ir iespējota, Heym nogaida `retryWaitSeconds` un atver socket vēlreiz pēc pārtraukuma.
- Katrs izsūtītais notikums izveido atsevišķu workflow palaišanu ar `trigger_source = "websocket"`.

## Izejas drošība

- Pēc noklusējuma URL ir jāizmanto `ws://` vai `wss://` un jāatrisina tikai uz publiskām adresēm. Loopback, privātās, link-local, multicast un cloud-metadata galamērķi tiek bloķēti.
- Heym atkārtoti validē DNS pie katras atkārtotās savienošanās, validē katru atrisināto adresi un savienojas tieši ar vienu no šīm adresēm. Vides proxies un WebSocket pāradresācijas tiek atspējotas, kamēr aizsargs ir aktīvs.
- Pastāvīgi politikas pārkāpumi aptur trigger, nevis mēģina atkārtoti bezgalīgi. Pagaidu DNS vai tīkla kļūmes joprojām seko mezgla atkārtotās savienošanās iestatījumiem.
- Tiek atbalstīti `Authorization`, `Origin`, `User-Agent` un pielāgoti datu headers. `Origin` tiek nosūtīts caur WebSocket klienta īpašo opciju. `Host`, `Connection`, `Upgrade` un `Sec-WebSocket-*` headers nevar tikt pārrakstīti.
- Uzticami pašmitināti izvietojumi, kas apzināti savienojas ar iekšējiem servisiem, var iestatīt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Saglabājiet noklusējuma vērtību mitinātos vai daudznomnieku izvietojumos.

**Jaunināšanas piezīme v0.0.105:** šī instancei raksturīgā politika tagad aizsargā arī no akreditācijas datiem iegūtus galamērķus, ko izmanto Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, pielāgota LLM izpilde un modeļa atklāšana, AI asistents, guardrails un RAG embeddings. Esošie akreditācijas dati, kas norāda uz loopback, privātām vai link-local adresēm, tiek noraidīti, ja vien `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nav iespējots uz uzticama pašmitināta izvietojuma. Kamēr aizsargs ir ieslēgts, aizsargātie HTTP klienti ignorē `HTTP_PROXY` un `HTTPS_PROXY`; atteikšanās iespējošana tos atjauno. Operatora CA pakotnes, kas konfigurētas caur `SSL_CERT_FILE` vai `SSL_CERT_DIR`, joprojām tiek atbalstītas. ClickHouse tiek pārbaudīts pirms savienojuma atvēršanas, bet netiek piesaistīts dial laikā, jo clickhouse-connect nodrošina savu urllib3 transportu.

## Workflow piemērs

**Ārēja notikumu plūsma → filtrs → paziņojums**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** ziņojums: `"Realtime alert: $streamEvent.message.data.title"`
## Piemēra node JSON

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

## Saistītie resursi

- [Triggers](../reference/triggers.md) – Fona trigger arhitektūra un `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Datu nosūtīšana uz ārēju socket no workflow soļa
- [Node Types](../reference/node-types.md) – Visu node pārskats
- [Third-Party Integrations](../reference/integrations.md) – Kuri node izmanto akreditācijas datus un kuri ne

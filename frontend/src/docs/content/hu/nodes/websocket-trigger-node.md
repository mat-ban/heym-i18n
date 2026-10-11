# WebSocket Trigger

A **WebSocket Trigger** csomópont kimenő klienskapcsolatot nyit egy külső WebSocket-kiszolgáló felé, és elindítja a workflow-t, amikor a kiválasztott socket-események bekövetkeznek. Használja olyan eseményfolyamokhoz, mint a piaci adatfolyamok, telemetria vagy chat-háttérrendszerek. Belső valós idejű rendszerekhez való csatlakozáshoz az alábbiakban leírt privát URL-opt-out szükséges.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Fontos működés

- Ez a csomópont **a Heym-ből egy másik WebSocket-kiszolgáló felé** csatlakozik.
- **Nem** tesz elérhetővé WebSocket endpointot a Heym-en.
- Nem szükséges [hitelesítési adat](../reference/credentials.md). Az URL-t, a fejléceket és az alprotokollokat közvetlenül a csomóponton konfigurálja.
- A leader worker a háttérben nyitva tartja a kapcsolatot, és engedélyezés esetén újracsatlakozik.

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `websocketUrl` | string | Külső `ws://` vagy `wss://` URL |
| `websocketHeaders` | JSON object string | Opcionális handshake-fejlécek |
| `websocketSubprotocols` | string | Opcionális, vesszővel elválasztott alprotokoll-lista |
| `websocketTriggerEvents` | array | A következők bármelyike: `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Újracsatlakozás a kapcsolat megszakadása után |
| `retryWaitSeconds` | integer | Késleltetés az újracsatlakozás előtt |

## Kibocsátott események

### `onMessage`

Akkor aktiválódik, amikor egy frame érkezik a távoli socketről.

Hasznos mezők:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.message.data` | Feldolgozott JSON payload vagy nyers üzenetérték |
| `$nodeLabel.message.text` | UTF-8 szerint dekódolt szöveg, ha elérhető |
| `$nodeLabel.message.base64` | Bináris payload base64 formátumban |
| `$nodeLabel.message.sizeBytes` | Payload mérete |
| `$nodeLabel.message.isJson` | Hogy az üzenet JSON-ként lett-e feldolgozva |

### `onConnected`

Akkor aktiválódik, miután a socket sikeresen megnyílt.

Hasznos mezők:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` az első csatlakozáskor, `true` a későbbi újracsatlakozásoknál |
| `$nodeLabel.connection.subprotocol` | A kialkudott alprotokoll |

### `onClosed`

Akkor aktiválódik, amikor egy létrejött kapcsolat bezárul.

Hasznos mezők:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` vagy `unknown` |
| `$nodeLabel.close.code` | WebSocket close code |
| `$nodeLabel.close.reason` | A bezárás oka |
| `$nodeLabel.close.wasClean` | `true` normál `1000`-es bezárás esetén |
| `$nodeLabel.close.reconnecting` | Hogy a csomópont megkísérli-e az újracsatlakozást |

## Trigger-szemantika

- Egy aktív csomópont egy hosszú élettartamú kimenő socket-kapcsolatot tart fenn.
- A kapcsolat csak a leader workeren fut, hasonlóan az [IMAP Trigger](./imap-trigger-node.md) és a [RabbitMQ](./rabbitmq-node.md) fogadási módjához.
- Ha az újracsatlakozás engedélyezett, a Heym `retryWaitSeconds` ideig vár, majd a kapcsolat megszakadása után újra megnyitja a socketet.
- Minden kibocsátott esemény külön workflow-futtatást hoz létre `trigger_source = "websocket"` értékkel.

## Kimenő forgalom biztonsága

- Alapértelmezés szerint az URL-nek `ws://` vagy `wss://` sémát kell használnia, és csak nyilvános címekre oldható fel. A loopback, privát, link-local, multicast és felhő-metadata célpontok blokkolva vannak.
- A Heym minden újracsatlakozáskor újravalidálja a DNS-t, ellenőrzi az összes feloldott címet, és közvetlenül ezek egyikéhez csatlakozik. A környezeti proxyk és a WebSocket-átirányítások le vannak tiltva, amíg a guard aktív.
- A végleges házirend-megsértések leállítják a triggert a végtelen újrapróbálkozás helyett. Az átmeneti DNS- vagy hálózati hibák továbbra is a csomópont újrapróbálkozási beállításait követik.
- Az `Authorization`, `Origin`, `User-Agent` és egyéni adatfejlécek támogatottak. Az `Origin` a WebSocket-kliens dedikált opcióján keresztül kerül elküldésre. A `Host`, `Connection`, `Upgrade` és `Sec-WebSocket-*` fejlécek nem írhatók felül.
- A megbízható, saját üzemeltetésű telepítések, amelyek szándékosan belső szolgáltatásokhoz csatlakoznak, beállíthatják a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` értéket. Hostolt vagy multi-tenant telepítéseken tartsa meg az alapértelmezett beállítást.

**Frissítési megjegyzés a v0.0.105-höz:** ez az instance-szintű házirend mostantól védi a hitelesítési adatokból származó célpontokat is, amelyeket a Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, az egyéni LLM-végrehajtás és -modellfelderítés, az AI-asszisztens, a guardrails és a RAG embeddings használnak. A loopback, privát vagy link-local címekre mutató meglévő hitelesítési adatok elutasításra kerülnek, kivéve, ha a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` engedélyezett egy megbízható, saját üzemeltetésű instance-en. Amíg a guard be van kapcsolva, a guardolt HTTP-kliensek figyelmen kívül hagyják a `HTTP_PROXY` és `HTTPS_PROXY` beállításokat; az opt-out engedélyezése visszaállítja azokat. Az `SSL_CERT_FILE` vagy `SSL_CERT_DIR` útján konfigurált operátori CA-csomagok továbbra is támogatottak. A ClickHouse ellenőrzése a kapcsolat megnyitása előtt megtörténik, de a tárcsázás időpontjában nincs rögzítve, mivel a clickhouse-connect saját urllib3-transzportot hoz magával.

## Példa workflow

**Külső eseményfolyam → szűrés → értesítés**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** címke: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** üzenet: `"Realtime alert: $streamEvent.message.data.title"`
## Példa csomópont JSON

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

## Kapcsolódó tartalmak

- [Triggerek](../reference/triggers.md) – A háttérben működő triggerek architektúrája és a `trigger_source`
- [WebSocket küldése](./websocket-send-node.md) – Adatok küldése külső socketre egy workflow-lépésből
- [Csomóponttípusok](../reference/node-types.md) – Az összes csomópont áttekintése
- [Külső szolgáltatások integrációi](../reference/integrations.md) – Mely csomópontok használnak hitelesítési adatokat és melyek nem

# WebSocket Send

A **WebSocket Send** csomópont kimenő klienskapcsolatot nyit egy külső WebSocket-kiszolgáló felé, elküld egy üzenetet, majd lezárja a kapcsolatot. Akkor használja, amikor egy workflow eseményeket kíván továbbítani egy valós idejű rendszerbe anélkül, hogy egy Heym tulajdonában lévő socket endpointot tenne közzé.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Külső `ws://` vagy `wss://` URL |
| `websocketHeaders` | JSON object string / expression | Opcionális handshake fejlécek |
| `websocketSubprotocols` | string | Opcionális, vesszővel elválasztott subprotocol-lista |
| `websocketMessage` | expression | Elküldendő payload |

## Üzenetszerializálási szabályok

- Ha a `websocketMessage` **string** értékre oldódik fel, a Heym szöveges frame-et küld.
- Ha **object**, **array**, **number**, **boolean** vagy `null` értékre oldódik fel, a Heym JSON szövegként szerializálja.
- Ha **bytes** értékre oldódik fel, a Heym bináris frame-et küld.
- A teljes kifejezések, mint például a `$input`, a szerializálás előtt megőrzik a natív típusokat.

## Kimeneti mezők

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` siker esetén |
| `$nodeLabel.url` | Feloldott cél-URL |
| `$nodeLabel.message_type` | `text`, `json` vagy `binary` |
| `$nodeLabel.size_bytes` | A payload mérete bájtban |
| `$nodeLabel.subprotocol` | Egyeztetett subprotocol, ha van |
| `$nodeLabel.sent_at` | ISO időbélyeg |

## Példa workflow

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- A **Set** létrehoz egy payload objektumot, például `{ "type": "user.updated", "user": $input.body }`
- A **WebSocket Send** a `$payloadNode` értéket használja `websocketMessage`-ként
- Az **Output** visszaadhatja a `$socketSend.status` értéket

## Példa csomópont JSON

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

## Megjegyzések

- Ehhez a csomóponthoz nem szükséges [hitelesítési adat](../reference/credentials.md).
- Ha a távoli kiszolgáló auth vagy tenant fejléceket vár, adja át azokat a `websocketHeaders` segítségével.
- Használja a [HTTP](./http-node.md) csomópontot, ha a távoli rendszer kérés/válasz alapú, nem pedig socket alapú.

## Egress Safety

- Alapértelmezés szerint az URL-nek `ws://` vagy `wss://` sémát kell használnia, és csak nyilvános címekre oldódhat fel. A loopback, privát, link-local, multicast és cloud-metadata célpontok blokkolva vannak.
- A Heym minden feloldott címet ellenőriz, és közvetlenül ezek egyikéhez csatlakozik. A környezeti proxyk és a WebSocket-átirányítások le vannak tiltva, amíg a guard aktív.
- Az `Authorization`, `Origin`, `User-Agent` és egyéni adatfejlécek támogatottak. Az `Origin` a WebSocket-kliens dedikált opcióján keresztül kerül elküldésre. A `Host`, `Connection`, `Upgrade` és `Sec-WebSocket-*` fejlécek nem írhatók felül.
- A megbízható, saját üzemeltetésű telepítések, amelyek szándékosan belső szolgáltatásokhoz csatlakoznak, beállíthatják a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` értéket. Hosted vagy multi-tenant telepítéseken tartsa meg az alapértelmezett beállítást.

**Frissítési megjegyzés a v0.0.105 verzióhoz:** ez az instance-szintű szabályzat mostantól védi a Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, az egyéni LLM-végrehajtás és -modellfelderítés, az AI assistant, a guardrails és a RAG embeddings által használt, hitelesítési adatokból származó célpontokat is. A loopback, privát vagy link-local címekre mutató meglévő hitelesítési adatok elutasításra kerülnek, kivéve, ha a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` engedélyezve van egy megbízható, saját üzemeltetésű instance-on. Amíg a guard be van kapcsolva, a védett HTTP-kliensek figyelmen kívül hagyják a `HTTP_PROXY` és `HTTPS_PROXY` beállításokat; az opt-out engedélyezése visszaállítja azokat. Az `SSL_CERT_FILE` vagy `SSL_CERT_DIR` segítségével konfigurált operátor CA bundle-ök továbbra is támogatottak. A ClickHouse ellenőrzése a kapcsolat megnyitása előtt megtörténik, de dial időben nincs pinningelve, mivel a clickhouse-connect saját urllib3 transportot hoz magával.

## Kapcsolódó

- [WebSocket Trigger](./websocket-trigger-node.md) – Külső socket figyelése és workflow-k indítása eseményekre
- [Node Types](../reference/node-types.md) – Integrációs csomópontok áttekintése
- [Expression DSL](../reference/expression-dsl.md) – Dinamikus JSON payloadok létrehozása
- [Third-Party Integrations](../reference/integrations.md) – Hitelesítési adatokkal támogatott vs. közvetlen konfigurációjú integrációk

# WebSocket Trigger

Uzol **WebSocket Trigger** otvára odchádzajúce klientske pripojenie k externému WebSocket serveru a spúšťa workflow, keď nastanú vybrané udalosti socketu. Použite ho pre prúdy udalostí, ako sú trhové kanály, telemetria alebo chatové backplane. Pripojenie k interným realtime systémom vyžaduje výnimku pre privátne URL opísanú nižšie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Dôležité správanie

- Tento uzol sa pripája **z Heym k inému WebSocket serveru**.
- **Nevystavuje** WebSocket endpoint na Heym.
- Nevyžaduje sa žiadny [credential](../reference/credentials.md). URL, hlavičky a subprotokoly konfigurujte priamo na uzle.
- Leader worker udržiava pripojenie otvorené na pozadí a pri zapnutí sa znovu pripája.

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `websocketUrl` | string | Externá `ws://` alebo `wss://` URL |
| `websocketHeaders` | JSON object string | Voliteľné hlavičky handshake |
| `websocketSubprotocols` | string | Voliteľný zoznam subprotokolov oddelený čiarkami |
| `websocketTriggerEvents` | array | Ľubovoľná z hodnôt `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Opätovné pripojenie po odpojení |
| `retryWaitSeconds` | integer | Oneskorenie pred opätovným pripojením |

## Vysielané udalosti

### `onMessage`

Spustí sa, keď z vzdialeného socketu dorazí rámec.

Užitočné polia:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.message.data` | Parsovaný JSON payload alebo surová hodnota správy |
| `$nodeLabel.message.text` | UTF-8 dekódovaný text, ak je k dispozícii |
| `$nodeLabel.message.base64` | Binárny payload ako base64 |
| `$nodeLabel.message.sizeBytes` | Veľkosť payloadu |
| `$nodeLabel.message.isJson` | Či sa správa parsovala ako JSON |

### `onConnected`

Spustí sa po úspešnom otvorení socketu.

Užitočné polia:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.connection.reconnected` | `false` pri prvom pripojení, `true` pri neskorších opätovných pripojeniach |
| `$nodeLabel.connection.subprotocol` | Vyjednaný subprotokol |

### `onClosed`

Spustí sa, keď sa nadviazané pripojenie zatvorí.

Užitočné polia:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` alebo `unknown` |
| `$nodeLabel.close.code` | Kód zatvorenia WebSocket |
| `$nodeLabel.close.reason` | Dôvod zatvorenia |
| `$nodeLabel.close.wasClean` | `true` pre normálne zatvorenie `1000` |
| `$nodeLabel.close.reconnecting` | Či sa uzol pokúsi o opätovné pripojenie |

## Sémantika triggera

- Jeden aktívny uzol udržiava jedno dlhotrvajúce odchádzajúce socketové pripojenie.
- Pripojenie beží iba na leader workeri, podobne ako režim príjmu [IMAP Trigger](./imap-trigger-node.md) a [RabbitMQ](./rabbitmq-node.md).
- Ak je zapnuté opätovné pripojenie, Heym počká `retryWaitSeconds` a po výpadku socket znovu otvorí.
- Každá vyslaná udalosť vytvára samostatné spustenie workflow s `trigger_source = "websocket"`.

## Bezpečnosť odchádzajúceho pripojenia

- Štandardne musí URL používať `ws://` alebo `wss://` a prekladať sa iba na verejné adresy. Ciele typu loopback, privátne, link-local, multicast a cloud-metadata sú blokované.
- Heym znovu overuje DNS pri každom opätovnom pripojení, validuje každú preloženú adresu a pripája sa priamo k jednej z týchto adries. Environment proxy a WebSocket presmerovania sú počas aktívnej ochrany zakázané.
- Trvalé porušenia politiky zastavia trigger namiesto nekonečného opätovného pokusu. Dočasné zlyhania DNS alebo siete stále dodržiavajú nastavenia opätovného pripojenia uzla.
- Hlavičky `Authorization`, `Origin`, `User-Agent` a vlastné dátové hlavičky sú podporované. `Origin` sa odosiela prostredníctvom špecializovanej možnosti WebSocket klienta. Hlavičky `Host`, `Connection`, `Upgrade` a `Sec-WebSocket-*` nie je možné prepísať.
- Dôveryhodné self-hosted nasadenia, ktoré sa zámerne pripájajú k interným službám, môžu nastaviť `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Na hostovaných alebo multi-tenant nasadeniach ponechajte predvolenú hodnotu.

**Poznámka k upgradu pre v0.0.105:** táto politika na úrovni celej inštancie teraz chráni aj ciele odvodené z prihlasovacích údajov používané Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastným spúšťaním LLM a objavovaním modelov, AI asistentom, guardrails a RAG embeddings. Existujúce prihlasovacie údaje, ktoré smerujú na loopback, privátne alebo link-local adresy, sú odmietnuté, pokiaľ nie je na dôveryhodnej self-hosted inštancii zapnuté `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Počas aktívnej ochrany chránení HTTP klienti ignorujú `HTTP_PROXY` a `HTTPS_PROXY`; zapnutie výnimky ich obnoví. CA balíky operátora nakonfigurované prostredníctvom `SSL_CERT_FILE` alebo `SSL_CERT_DIR` zostávajú podporované. ClickHouse sa kontroluje pred otvorením pripojenia, ale nie je pripnutý v čase dial, pretože clickhouse-connect prináša vlastný urllib3 transport.

## Príklad workflow

**Externý prúd udalostí → filter → notifikácia**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** label: `streamEvent`
- **Condition**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** správa: `"Realtime alert: $streamEvent.message.data.title"`
## Príklad JSON uzla

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

## Súvisiace

- [Triggers](../reference/triggers.md) – Architektúra background triggerov a `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Odosielanie dát do externého socketu z kroku workflowu
- [Node Types](../reference/node-types.md) – Prehľad všetkých uzlov
- [Third-Party Integrations](../reference/integrations.md) – Ktoré uzly používajú prihlasovacie údaje a ktoré nie

# Triggerek

A workflow-kat **trigger csomópontok** vagy **belépési pontok** indítják el. Minden trigger típusnak saját endpointja vagy háttérfolyamata van.

## Trigger csomópontok

Olyan kezdő csomópontok (nincs bejövő élük), amelyek elindítják a végrehajtást:

| Csomópont típusa | Leírás |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP belépési pont. A kérésekből fogadja a `body`, `headers`, `query` értékeket. |
| [Cron](../nodes/cron-node.md) | Ütemezés szerint fut (cron kifejezés, pl. `0 * * * *` az óránkénti futáshoz). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Akkor indul, amikor a Telegram bot webhook frissítést küld a csomópont-specifikus webhook URL-re. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Akkor indul, amikor a Discord Interactions API webhookot küld a csomópont-specifikus endpointra. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Egy IMAP postaládát figyel, és minden újonnan észlelt e-mail esetén egyszer indul el. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Akkor indul, amikor a Heym platform eseményt publikál. Egy dispatch ablakban érkező események együtt, tömbként érkeznek. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Kimenő klienskapcsolatot nyit egy külső socket felé, és a kiválasztott socket eseményekre indul el. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Egyszer használatos feltöltési URL-t generál, és akkor indul el, amikor a hívó egy nagy, multipart fájlt küld be. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Akkor indul el, amikor egy üzenetet fogadnak egy RabbitMQ sorból. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Akkor indul el, amikor a Slack eseményt küld az Events API webhookon keresztül. |

## Belépési pontok

| Trigger | Endpoint / Forrás | Hitelesítés |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` fejléc vagy `Authorization: Bearer` (csak fejlécek) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal munkamenet token |
| **Board** | [Board](../tabs/board-tab.md) kártya mozgatása / follow-up futtatás egy workflow láncot tartalmazó oszlopba (`trigger_source="board"`) | JWT (board tulajdonos) |
| **Cron** | Cron ütemező (60 másodpercenként fut, cron kifejezéseket értékel ki) | N/A |
| **IMAP** | IMAP trigger kezelő (leader worker, csomópontonkénti lekérdezési intervallum) | IMAP felhasználónév/jelszó |
| **WebSocket** | Kimenő WebSocket trigger kezelő (leader worker, állandó klienskapcsolatok) | Opcionális csomópontonkénti fejlécek |
| **File Upload** | `POST /api/file-intake/u/{token}` egy slot létrehozása után | Egyszer használatos capability token |
| **RabbitMQ** | RabbitMQ fogyasztó (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 aláíró titok |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 alkalmazás nyilvános kulcs |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Opcionális `x-telegram-bot-api-secret-token` |
| **Editor** | Ugyanaz, mint a Webhook, a `workflowStore.executeWorkflow` segítségével | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Bemenet**: A kérés törzse `body`-ként kerül átadásra a textInput csomópontoknak
- **Body mód**: A workflow-k a szerkesztőben és a cURL párbeszédablakban `defined` mezőformájú példákat vagy `generic` nyers JSON példákat használhatnak
- **Hitelesítés**: Workflow-nként konfigurálva (`auth_type`, `allow_anonymous`)

A TTL, cache, rate limiting és hitelesítés részleteiért lásd a [Webhooks](./webhooks.md) oldalt.

### MCP

Azok a workflow-k, amelyeknél `mcp_enabled=true`, eszközként jelennek meg az MCP kliensek számára. Az eszköz neve a workflow nevéből származik. Lásd az [MCP Tab](../tabs/mcp-tab.md) oldalt.

### Portal

Nyilvános chat felület a `/chat/{slug}` címen. A részletekért lásd a [Portal](./portal.md) oldalt.

### Cron

A cron ütemező 60 másodpercenként fut, megkeresi az aktív `cron` csomópontokkal rendelkező workflow-kat, kiértékeli a cron kifejezéseket, és lefuttatja a megfelelő workflow-kat. A bemenet tartalmazza a `{"triggered_by": "cron"}` értéket.

### IMAP

Az IMAP trigger kezelő a leader workerben fut, és a beállított `pollIntervalMinutes` értéknek megfelelően ellenőrzi az aktív `imapTrigger` csomópontokat. Minden csomópont egy IMAP kurzort tárol (`UIDVALIDITY` + utoljára látott UID). A bemenet tartalmazza az `email`, `triggered_by: "imap"`, `trigger_node_id` és `triggered_at` értékeket.

### Heym platform események

A Heym esemény dispatcher 5 másodpercenként lekérdezi a `heym_events` naplót, és eljuttatja a megfelelő eseményeket az aktív `heymTrigger` csomópontokhoz. A kézbesítés (esemény, workflow, csomópont) hármasonként egyedi megkötés alapján kerül igénylésre, így egy esemény pontosan egyszer fut le minden feliratkozó csomóponton, minden worker, konténer és gép esetében. Minden esemény, amelyet egy menetben igényelnek, egyetlen futtatásban kerül kézbesítésre: a bemenet tartalmazza az `events` (mindig tömb, a legrégebbivel kezdve), `count`, `triggered_by: "heym_event"`, `trigger_node_id` és `triggered_at` értékeket. Csak az elmúlt 5 percben publikált események kerülnek elküldésre, ami megakadályozza, hogy egy kiesés egy elmaradt hátralékot újrajátszon; az események 7 napig maradnak meg.

### WebSocket

A WebSocket trigger kezelő a leader workerben fut, és minden aktív [WebSocket Trigger](../nodes/websocket-trigger-node.md) csomóponthoz egy kimenő klienskapcsolatot tart fenn. Futtatásokat bocsáthat ki az `onMessage`, `onConnected` és `onClosed` eseményekre. A bemenet tartalmazza az `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` értékeket, valamint a `message`, `connection` vagy `close` egyikét.
### Fájlfeltöltés

A [Fájlfeltöltés Trigger](../nodes/file-upload-trigger-node.md) egy TTL-korlátozott, egyszeri használatú feltöltési helyet hoz létre, amikor a workflow az API-n, MCP-n vagy a vásznon keresztül kerül meghívásra. A multipart form adatok feltöltése a `POST /api/file-intake/u/{token}` végpontra felhasználja a helyet, a fájlt Drive-fájlként tárolja, és szinkron módon elindítja a workflow-t. A bemenet tartalmazza a `file`, `uploaded_at`, `triggered_by: "file_upload"` értékeket és a feltöltési metaadatokat.

### Telegram

A Telegram bot webhook frissítéseket küld a `POST /api/telegram/webhook/{node_id}` végpontra. A payload a workflow-ba `update`, `message`, opcionális `callback_query`, sanitizált `headers`, `triggered_by`, `trigger_node_id` és `triggered_at` formában kerül átadásra. Ha a kiválasztott hitelesítési adatok rendelkeznek secret tokennel, a Heym a végrehajtás előtt ellenőrzi az `x-telegram-bot-api-secret-token` fejlécet.

### Discord

A Discord interakciós webhookokat küld a `POST /api/discord/webhook/{node_id}` végpontra. A payload a workflow-ba `interaction`, `type`, `data`, sanitizált `headers`, `triggered_by`, `trigger_node_id` és `triggered_at` formában kerül átadásra. A Heym a végrehajtás előtt Ed25519 és a kiválasztott `discord_trigger` hitelesítési adatok alkalmazás nyilvános kulcsa segítségével ellenőrzi a kérést.

### RabbitMQ

A RabbitMQ fogyasztó a leader worker inicializálásakor indul el. Azok a workflow-k, amelyek `rabbitmq` csomópontokat tartalmaznak, ahol `rabbitmqOperation === "receive"`, fogyasztót kapnak. A bemenet tartalmazza a `message_data` (body, headers, routing_key stb.) értéket és a `triggered_by: "rabbitmq"` értéket.

## trigger_source

A futtatások előzményei minden belépési pontnál rögzítik a `trigger_source` értéket:

| Érték | Mikor |
|-------|------|
| `"API"` | Webhook / API hívás explicit fejléc nélkül (alapértelmezett) |
| `"Canvas"` | Futtatás a workflow szerkesztő vásznáról |
| `"Quick Drawer"` | Futtatás a szerkesztő quick-drawer paneljéről |
| `"cron"` | Cron ütemező |
| `"imap"` | IMAP trigger kezelő |
| `"websocket"` | Kimenő WebSocket trigger kezelő |
| `"file_upload"` | Fájlfeltöltés Trigger feltöltési végpont |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord interakciós webhook |
| `"MCP"` | MCP eszköz hívás |
| `"portal"` | Portal végrehajtás |
| `"dashboard_chat"` | AI asszisztens chat |
| `"AI Agents"` | AI-ügynök csomópont által meghívott al-workflow |
| `"SUB_WORKFLOW"` | Execute Workflow csomópont által meghívott al-workflow |
| egyedi | Bármely érték, amelyet az `X-Trigger-Source` fejlécben vagy a `trigger_source` query/body paraméterben küldenek |
| (nincs beállítva) | RabbitMQ fogyasztó |

## Bemenetek Triggerenként

- **HTTP/Webhook**: `body`, `headers`, `query` a kérésből
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + opcionális `callback_query` + sanitizált `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanitizált `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Fájlfeltöltés**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (teljes Slack esemény objektum) + `headers` (sanitizált) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + opcionális `conversation_history`

## Kapcsolódó

- [Webhookok](./webhooks.md) – Webhook TTL, cache, rate limit, auth
- [Workflow struktúra](./workflow-structure.md) – Csomópontok és élek
- [Csomópont típusok](./node-types.md) – [Bemenet](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [Fájlfeltöltés Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord interakciós webhook trigger
- [Gyors kezdés](../getting-started/quick-start.md) – Workflow építése Bemenettel
- [Portal](./portal.md) – Portal trigger és chat felület
- [Futtatások előzményei](./execution-history.md) – Korábbi futtatások és trigger_source megtekintése

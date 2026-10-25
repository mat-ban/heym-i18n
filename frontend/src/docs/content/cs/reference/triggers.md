# Triggery

Workflow jsou spouštěny **trigger nody** neboli **vstupními body**. Každý typ triggeru má vlastní endpoint nebo proces běžící na pozadí.

## Trigger nody

Počáteční uzly (bez příchozích hran), které zahajují vykonávání:

| Typ uzlu | Popis |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP vstupní bod. Přijímá `body`, `headers`, `query` z požadavků. |
| [Cron](../nodes/cron-node.md) | Spouští se podle plánu (cron výraz, např. `0 * * * *` pro každou hodinu). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Spustí se, když Telegram odešle webhook aktualizaci bota na webhook URL specifickou pro daný uzel. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Spustí se, když Discord odešle webhook Interactions API na endpoint specifický pro daný uzel. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Dotazuje se IMAP schránky a spustí se jednou pro každý nově zjištěný e-mail. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Spustí se, když Heym publikuje platformní událost. Události v jednom dispatch okně dorazí společně jako pole. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Otevře odchozí klientské připojení k externímu socketu a spustí se při vybraných událostech socketu. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Vytvoří jednorázovou upload URL a spustí se, když volající odešle velký multipart soubor. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Spustí se, když je zpráva spotřebována z RabbitMQ fronty. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Spustí se, když Slack odešle událost prostřednictvím webhooku Events API. |

## Vstupní body

| Trigger | Endpoint / Zdroj | Auth |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | Hlavička `X-MCP-Key` nebo `Authorization: Bearer` (pouze hlavičky) |
| **Portal** | `POST /api/portal/{slug}/execute` | Session token portálu |
| **Board** | [Board](../tabs/board-tab.md) přesun karty / následné spuštění do sloupce s workflow řetězem (`trigger_source="board"`) | JWT (vlastník boardu) |
| **Cron** | Cron plánovač (spouští se každých 60 s, vyhodnocuje cron výrazy) | N/A |
| **IMAP** | IMAP trigger manager (leader worker, interval dotazování podle uzlu) | IMAP uživatelské jméno/heslo |
| **WebSocket** | Outbound WebSocket trigger manager (leader worker, trvalá klientská připojení) | Volitelné hlavičky podle uzlu |
| **File Upload** | `POST /api/file-intake/u/{token}` po vytvoření slotu | Jednorázový capability token |
| **RabbitMQ** | RabbitMQ konzument (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 podpisový klíč |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 veřejný klíč aplikace |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Volitelný `x-telegram-bot-api-secret-token` |
| **Editor** | Stejné jako Webhook, přes `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Vstup**: Tělo požadavku je předáno jako `body` do textInput uzlů
- **Režim těla**: Workflow mohou v editoru a cURL dialogu používat `defined` příklady ve tvaru polí nebo `generic` příklady surového JSON
- **Auth**: Konfigurováno pro každý workflow (`auth_type`, `allow_anonymous`)

Podrobnosti o TTL, cache, rate limitingu a auth naleznete v [Webhooks](./webhooks.md).

### MCP

Workflow s `mcp_enabled=true` se zobrazují jako nástroje pro MCP klienty. Název nástroje je odvozen z názvu workflow. Viz [MCP Tab](../tabs/mcp-tab.md).

### Portal

Veřejné chat UI na `/chat/{slug}`. Podrobnosti naleznete v [Portal](./portal.md).

### Cron

Cron plánovač se spouští každých 60 sekund, vyhledává workflow s aktivními `cron` nody, vyhodnocuje cron výrazy a spouští odpovídající workflow. Vstup obsahuje `{"triggered_by": "cron"}`.

### IMAP

IMAP trigger manager běží v leader workeru a kontroluje aktivní `imapTrigger` nody podle jejich nakonfigurovaného `pollIntervalMinutes`. Každý uzel ukládá IMAP kurzor (`UIDVALIDITY` + naposledy viděný UID). Vstup obsahuje `email`, `triggered_by: "imap"`, `trigger_node_id` a `triggered_at`.

### Heym Platform Events

Heym event dispatcher dotazuje log `heym_events` každých 5 sekund a doručuje odpovídající události aktivním `heymTrigger` uzlům. Doručení je nárokováno pro každou kombinaci (událost, workflow, uzel) prostřednictvím unikátního omezení, takže událost se spustí právě jednou pro každý odebírající uzel napříč všemi workery, kontejnery a stroji. Každá událost nárokovaná v jednom průchodu je doručena v jediném spuštění: vstup obsahuje `events` (vždy pole, od nejstarší), `count`, `triggered_by: "heym_event"`, `trigger_node_id` a `triggered_at`. Doručují se pouze události publikované za posledních 5 minut, což zabraňuje tomu, aby výpadek přehrál nahromaděné události; události jsou uchovávány po dobu 7 dnů.

### WebSocket

WebSocket trigger manager běží v leader workeru a udržuje jedno odchozí klientské připojení pro každý aktivní uzel [WebSocket Trigger](../nodes/websocket-trigger-node.md). Může vysílat spuštění pro `onMessage`, `onConnected` a `onClosed`. Vstup obsahuje `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` a jeden z `message`, `connection` nebo `close`.
### Nahrání souboru

[Trigger nahrání souboru](../nodes/file-upload-trigger-node.md) vytvoří při vyvolání workflow prostřednictvím API, MCP nebo plátna jednorázový upload slot s omezenou TTL. Nahrání multipart form dat na `POST /api/file-intake/u/{token}` spotřebuje slot, uloží soubor jako soubor na Disku a synchronně spustí workflow. Vstup zahrnuje `file`, `uploaded_at`, `triggered_by: "file_upload"` a metadata nahrání.

### Telegram

Telegram odesílá webhook aktualizace bota na `POST /api/telegram/webhook/{node_id}`. Payload je předán do workflow jako `update`, `message`, volitelný `callback_query`, sanitizované `headers`, `triggered_by`, `trigger_node_id` a `triggered_at`. Pokud má vybraný credential secret token, Heym před spuštěním ověří `x-telegram-bot-api-secret-token`.

### Discord

Discord odesílá interakční webhooky na `POST /api/discord/webhook/{node_id}`. Payload je předán do workflow jako `interaction`, `type`, `data`, sanitizované `headers`, `triggered_by`, `trigger_node_id` a `triggered_at`. Heym před spuštěním ověří požadavek pomocí Ed25519 a veřejného klíče aplikace vybraného credentialu `discord_trigger`.

### RabbitMQ

Konzument RabbitMQ se spustí při inicializaci leader workeru. Workflow s uzly `rabbitmq`, kde `rabbitmqOperation === "receive"`, získají konzumenta. Vstup zahrnuje `message_data` (tělo, hlavičky, routing_key atd.) a `triggered_by: "rabbitmq"`.

## Limit souběhu

Workflow s [limitem souběhu](./webhooks.md#concurrency-limit-and-queued-runs) zařazuje produkční běhy z každého výše uvedeného vstupního bodu do fronty, když jsou jeho sloty plné, způsobem first-in, first-out, napříč všemi instancemi. Způsob, jakým se volající dozví výsledek, závisí na vstupním bodu:

| Vstupní bod | Zatímco běh čeká |
|---|---|
| Webhook / API | `202 Accepted` s `execution_id` a stavovou URL |
| SSE streaming, Quick Drawer, Portal chat | Stream zůstává otevřený a odesílá události `queued` |
| Portal without streaming | Požadavek čeká na výsledek |
| MCP | Výsledek `queued` pro dotazování pomocí `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger čeká na výsledek stejně dlouho, jako by čekal běh na jiné [instanci](./cluster.md). Běh se provede v každém případě a zapíše se do historie |

Když je fronta plná, běh se nespustí a historie jej zaznamená jako `queue_full`. Testovací běhy editoru, volání sub-workflow (uzel [Execute](../nodes/execute-node.md) a workflow nástroje agenta), [Evals](../tabs/evals-tab.md), testovací běhy v chatovacím režimu sestavení a obnovení po revizi se do fronty nikdy nezařazují. Běhy karet na [Board](../tabs/board-tab.md), běhy [File Upload](../nodes/file-upload-trigger-node.md), běhy spuštěné nástrojem run-workflow AI asistenta a notifikační workflow upozornění se rovněž spouštějí bez čekání na slot.

## trigger_source

Historie spuštění zaznamenává `trigger_source` pro každý vstupní bod:

| Hodnota | Kdy |
|-------|------|
| `"API"` | Webhook / volání API bez explicitní hlavičky (výchozí) |
| `"Canvas"` | Spuštění z plátna editoru workflow |
| `"Quick Drawer"` | Spuštění z panelu rychlé přihrádky editoru, včetně spuštění se soubory nahranými z jeho zóny pro přetažení |
| `"cron"` | Plánovač Cron |
| `"imap"` | Správce triggeru IMAP |
| `"websocket"` | Správce odchozího triggeru WebSocket |
| `"file_upload"` | Endpoint pro nahrání triggeru nahrání souboru (odkazy vytvořené přes HTTP, MCP nebo plátno) |
| `"dashboard"` | Spuštění widgetů nástěnky a nahrání z widgetu pro přetažení souboru |
| `"telegram"` | Webhook bota Telegram |
| `"Discord"` | Webhook interakcí Discord |
| `"MCP"` | Volání nástroje MCP |
| `"portal"` | Spuštění portálu |
| `"dashboard_chat"` | Chat s AI asistentem |
| `"AI Agents"` | Sub-workflow vyvolané uzlem AI agenta |
| `"SUB_WORKFLOW"` | Sub-workflow vyvolané uzlem Execute Workflow |
| vlastní | Jakákoli hodnota odeslaná v hlavičce `X-Trigger-Source` nebo v parametru query/těla `trigger_source` |
| (nenastaveno) | Konzument RabbitMQ |

## Vstupy podle triggeru

- **HTTP/Webhook**: `body`, `headers`, `query` z požadavku
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + volitelný `callback_query` + sanitizované `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanitizované `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Nahrání souboru**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (úplný objekt události Slack) + `headers` (sanitizované) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portál**: `body.inputs` + volitelný `conversation_history`

## Související

- [Webhooky](./webhooks.md) – TTL webhooku, cache, rate limit, autentizace
- [Struktura workflow](./workflow-structure.md) – Uzly a hrany
- [Typy uzlů](./node-types.md) – [Vstup](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Trigger Telegram](../nodes/telegram-trigger-node.md), [Trigger IMAP](../nodes/imap-trigger-node.md), [Trigger Heym](../nodes/heym-trigger-node.md), [Trigger WebSocket](../nodes/websocket-trigger-node.md), [Trigger nahrání souboru](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Trigger Discord](../nodes/discord-trigger-node.md) – Trigger webhooku interakcí Discord
- [Rychlý start](../getting-started/quick-start.md) – Vytvoření workflow se vstupem
- [Portál](./portal.md) – Trigger portálu a chatovací UI
- [Historie spuštění](./execution-history.md) – Zobrazení minulých spuštění a trigger_source

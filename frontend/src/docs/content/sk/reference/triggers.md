# Triggery

Workflowy sa spúšťajú pomocou **trigger uzlov** alebo **vstupných bodov**. Každý typ triggera má vlastný endpoint alebo proces na pozadí.

## Trigger uzly

Počiatočné uzly (bez vstupných hrán), ktoré iniciujú vykonávanie:

| Typ uzla | Popis |
|-----------|-------------|
| [Vstup](../nodes/input-node.md) (textInput) | HTTP vstupný bod. Prijíma `body`, `headers`, `query` z požiadaviek. |
| [Cron](../nodes/cron-node.md) | Spúšťa sa podľa plánu (cron výraz, napr. `0 * * * *` pre každú hodinu). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Spustí sa, keď Telegram odošle webhook aktualizáciu bota na webhook URL špecifickú pre daný uzol. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Spustí sa, keď Discord odošle webhook Interactions API na endpoint špecifický pre daný uzol. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Pravidelne kontroluje IMAP schránku a spustí sa raz pre každý novozistený e-mail. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Spustí sa, keď Heym publikuje platformovú udalosť. Udalosti v jednom okne doručenia prichádzajú spolu ako pole. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Otvorí odchádzajúce klientske pripojenie k externému socketu a spustí sa pri vybraných udalostiach socketu. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Vytvorí jednorazovú upload URL a spustí sa, keď volajúciodošle veľký multipart súbor. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Spustí sa, keď je správa spotrebovaná z RabbitMQ fronty. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Spustí sa, keď Slack odošle udalosť cez webhook Events API. |

## Vstupné body

| Trigger | Endpoint / Zdroj | Autentifikácia |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` hlavička alebo `Authorization: Bearer` (iba hlavičky) |
| **Portál** | `POST /api/portal/{slug}/execute` | Token relácie portálu |
| **Board** | [Board](../tabs/board-tab.md) presun karty / následné spustenie do stĺpca s reťazou workflowov (`trigger_source="board"`) | JWT (vlastník boardu) |
| **Cron** | Cron plánovač (spúšťa sa každých 60 s, vyhodnocuje cron výrazy) | N/A |
| **IMAP** | Správca IMAP triggerov (leader worker, interval dotazovania podľa uzla) | IMAP používateľské meno/heslo |
| **WebSocket** | Správca odchádzajúcich WebSocket triggerov (leader worker, trvalé klientske pripojenia) | Voliteľné hlavičky podľa uzla |
| **File Upload** | `POST /api/file-intake/u/{token}` po vytvorení slotu | Jednorazový capability token |
| **RabbitMQ** | RabbitMQ konzument (leader worker) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 podpisový secret |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 verejný kľúč aplikácie |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Voliteľný `x-telegram-bot-api-secret-token` |
| **Editor** | Rovnaké ako Webhook, cez `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Vstup**: Telo požiadavky sa odovzdáva ako `body` do textInput uzlov
- **Režim tela**: Workflowy môžu v editore a cURL dialógu používať príklady tvarované podľa polí (`defined`) alebo surové JSON príklady (`generic`)
- **Autentifikácia**: Konfiguruje sa pre každý workflow (`auth_type`, `allow_anonymous`)

Podrobnosti o TTL, cache, obmedzovaní rýchlosti a autentifikácii nájdete v [Webhooks](./webhooks.md).

### MCP

Workflowy s `mcp_enabled=true` sa zobrazujú ako nástroje pre MCP klientov. Názov nástroja je odvodený od názvu workflowu. Pozrite si [MCP Tab](../tabs/mcp-tab.md).

### Portál

Verejné chat rozhranie na `/chat/{slug}`. Podrobnosti nájdete v [Portal](./portal.md).

### Cron

Cron plánovač sa spúšťa každých 60 sekúnd, vyhľadá workflowy s aktívnymi `cron` uzlami, vyhodnotí cron výrazy a spustí zodpovedajúce workflowy. Vstup obsahuje `{"triggered_by": "cron"}`.

### IMAP

Správca IMAP triggerov beží v leader workeri a kontroluje aktívne `imapTrigger` uzly podľa ich nakonfigurovaného `pollIntervalMinutes`. Každý uzol ukladá IMAP kurzor (`UIDVALIDITY` + naposledy videné UID). Vstup obsahuje `email`, `triggered_by: "imap"`, `trigger_node_id` a `triggered_at`.

### Heym Platform Events

Dispečer udalostí Heym pravidelne kontroluje log `heym_events` každých 5 sekúnd a doručuje zodpovedajúce udalosti aktívnym `heymTrigger` uzlom. Doručenie je nárokované pre každú kombináciu (udalosť, workflow, uzol) prostredníctvom jedinečného obmedzenia, takže udalosť sa spustí presne raz pre každý odoberajúci uzol naprieč všetkými workermi, kontajnermi a strojmi. Každá udalosť nárokovaná v jednom prechode je doručená v jednom spustení: vstup obsahuje `events` (vždy pole, od najstaršej), `count`, `triggered_by: "heym_event"`, `trigger_node_id` a `triggered_at`. Doručujú sa iba udalosti publikované za posledných 5 minút, čo zabraňuje prehratiu nahromadených udalostí po výpadku; udalosti sa uchovávajú 7 dní.

### WebSocket

Správca WebSocket triggerov beží v leader workeri a udržiava jedno odchádzajúce klientske pripojenie pre každý aktívny uzol [WebSocket Trigger](../nodes/websocket-trigger-node.md). Môže vysielať spustenia pre `onMessage`, `onConnected` a `onClosed`. Vstup obsahuje `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` a jeden z `message`, `connection` alebo `close`.
### Nahrávanie súborov

[Trigger nahrávania súborov](../nodes/file-upload-trigger-node.md) vytvára časovo obmedzený (TTL) jednorazový
slot na nahrávanie, keď je workflow spustený prostredníctvom API, MCP alebo plátna. Nahranie multipart form
dát na `POST /api/file-intake/u/{token}` spotrebuje slot, uloží súbor ako súbor v Drive a
spustí workflow synchrónne. Vstup obsahuje `file`, `uploaded_at`,
`triggered_by: "file_upload"` a metadata nahrávania.

### Telegram

Telegram posiela webhook aktualizácie bota na `POST /api/telegram/webhook/{node_id}`. Payload sa odovzdá do
workflow ako `update`, `message`, voliteľný `callback_query`, sanitizované `headers`, `triggered_by`, `trigger_node_id` a `triggered_at`. Ak má vybrané prihlasovacie údaje secret token, Heym pred spustením overí `x-telegram-bot-api-secret-token`.

### Discord

Discord posiela interakčné webhooky na `POST /api/discord/webhook/{node_id}`. Payload sa odovzdá do
workflow ako `interaction`, `type`, `data`, sanitizované `headers`, `triggered_by`, `trigger_node_id` a `triggered_at`. Heym pred spustením overí požiadavku pomocou Ed25519 a verejného kľúča aplikácie z vybraných prihlasovacích údajov `discord_trigger`.

### RabbitMQ

Konzument RabbitMQ sa spustí pri inicializácii leader workera. Workflowy s uzlami `rabbitmq`, kde `rabbitmqOperation === "receive"`, získajú konzumenta. Vstup obsahuje `message_data` (telo, hlavičky, routing_key atď.) a `triggered_by: "rabbitmq"`.

## trigger_source

História spustení zaznamenáva `trigger_source` pre každý vstupný bod:

| Hodnota | Kedy |
|-------|------|
| `"API"` | Webhook / volanie API bez explicitnej hlavičky (predvolené) |
| `"Canvas"` | Spustenie z plátna editora workflowu |
| `"Quick Drawer"` | Spustenie z panela quick-drawer v editore, vrátane spustení so súbormi nahranými z jeho zóny na presunutie |
| `"cron"` | Plánovač Cron |
| `"imap"` | Správca triggerov IMAP |
| `"websocket"` | Správca odchádzajúcich triggerov WebSocket |
| `"file_upload"` | Endpoint na nahrávanie triggera nahrávania súborov (odkazy vytvorené cez HTTP, MCP alebo plátno) |
| `"dashboard"` | Spustenia widgetov nástenky a nahrania z widgetu na presunutie súboru |
| `"telegram"` | Webhook bota Telegram |
| `"Discord"` | Webhook interakcií Discord |
| `"MCP"` | Volanie nástroja MCP |
| `"portal"` | Spustenie portálu |
| `"dashboard_chat"` | Chat AI asistenta |
| `"AI Agents"` | Sub-workflow spustený uzlom AI agenta |
| `"SUB_WORKFLOW"` | Sub-workflow spustený uzlom Execute Workflow |
| vlastná | Akákoľvek hodnota odoslaná v hlavičke `X-Trigger-Source` alebo v parametri `trigger_source` v query/tele |
| (nenastavené) | Konzument RabbitMQ |

## Vstupy podľa triggera

- **HTTP/Webhook**: `body`, `headers`, `query` z požiadavky
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + voliteľný `callback_query` + sanitizované `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanitizované `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Nahrávanie súborov**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (úplný objekt udalosti Slack) + `headers` (sanitizované) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portál**: `body.inputs` + voliteľná `conversation_history`

## Súvisiace

- [Webhooky](./webhooks.md) – TTL webhooku, cache, rate limit, autentifikácia
- [Štruktúra workflowu](./workflow-structure.md) – Uzly a hrany
- [Typy uzlov](./node-types.md) – [Vstup](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Trigger webhooku interakcií Discord
- [Rýchly štart](../getting-started/quick-start.md) – Vytvorte workflow so vstupom
- [Portál](./portal.md) – Trigger portálu a chat UI
- [História spustení](./execution-history.md) – Zobrazte minulé spustenia a trigger_source

# Triggers

Workflows se začenjajo z **trigger vozlišči** ali **vhodnimi točkami**. Vsaka vrsta triggerja ima svoj lasten endpoint ali ozadje proces.

## Trigger Vozlišča

Začetna vozlišča (brez vhodnih robov), ki sprožijo izvajanje:

| Vrsta vozlišča | Opis |
|----------------|------|
| [Input](../nodes/input-node.md) (textInput) | HTTP vhodna točka. Prejema `body`, `headers`, `query` iz zahtev. |
| [Cron](../nodes/cron-node.md) | Deluje po urniku (cron izraz, npr. `0 * * * *` za vsakih 60 minut). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Začne se, ko Telegram pošlje posodobitev webhooka bota na URL specifičen za vozlišče. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Začne se, ko Discord pošlje webhook prek Interactions API na endpoint specifičen za vozlišče. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Preverja IMAP poštni predal in se zažene enkrat za vsak nov zaznan e-poštni naslov. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Začne se, ko Heym objavi dogodek platforme. Dogodki v enem oknu pošiljanja prispejo skupaj kot niz. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Odpre odhodno povezavo stranke na zunanji socket in se zažene ob izbranih dogodkih socket. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Ustvari enkratno URL za nalaganje in se zažene, ko klicatelj pošlje velik multipart datoteko. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (prejmi) | Začne se, ko se sporočilo porabi iz RabbitMQ čakalne vrste. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Začne se, ko Slack pošlje dogodek prek Events API webhooka. |

## Vhodne točke

| Trigger | Endpoint / Vir | Avtentikacija |
|---------|----------------|----------------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header ali `Authorization: Bearer` (samo glave) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal sejni token |
| **Board** | [Board](../tabs/board-tab.md) premik kartice / nadaljevanje izvajanja v stolpec z verigo workflow (`trigger_source="board"`) | JWT (lastnik table) |
| **Cron** | Cron načrtovalnik (deluje vsakih 60s, ocenjuje cron izraze) | N/A |
| **IMAP** | IMAP upravljalec triggerjev (vodilni delavec, interval preverjanja na vozlišču) | IMAP uporabniško ime/geslo |
| **WebSocket** | Odhodni WebSocket upravljalec triggerjev (vodilni delavec, trajne povezave strank) | Neobvezne glave na vozlišču |
| **File Upload** | `POST /api/file-intake/u/{token}` po tem, ko je slot ustvarjen | Enkratni token za zmožnost |
| **RabbitMQ** | RabbitMQ porabnik (vodilni delavec) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 podpisni skrivni ključ |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 javni ključ aplikacije |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Neobvezni `x-telegram-bot-api-secret-token` |
| **Editor** | Enako kot Webhook, prek `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Vhod**: Telo zahteve se prenese kot `body` na textInput vozlišča
- **Način telesa**: Workflows lahko uporabljajo `defined` polja oblikovana primera ali `generic` surove JSON primere v urejevalniku in cURL dialogu
- **Avtentikacija**: Konfigurirana na podlagi workflow (`auth_type`, `allow_anonymous`)

Oglejte si [Webhooks](./webhooks.md) za podrobnosti o TTL, predpomnjenju, omejevanju hitrosti in avtentikaciji.

### MCP

Workflows z `mcp_enabled=true` se pojavijo kot orodja za MCP odjemalce. Ime orodja izhaja iz imena workflow. Oglejte si [MCP Tab](../tabs/mcp-tab.md).

### Portal

Javna chat UI na `/chat/{slug}`. Oglejte si [Portal](./portal.md) za podrobnosti.

### Cron

Cron načrtovalnik deluje vsakih 60 sekund, najde workflows z aktivnimi `cron` vozlišči, ocenjuje cron izraze in izvaja ujemajoče se workflows. Vhod vključuje `{"triggered_by": "cron"}`.

### IMAP

IMAP upravljalec triggerjev deluje v vodilnem delavcu in preverja aktivna `imapTrigger` vozlišča na njihovem konfiguriranem `pollIntervalMinutes`. Vsako vozlišče shranjuje IMAP kazalec (`UIDVALIDITY` + zadnji videni UID). Vhod vključuje `email`, `triggered_by: "imap"`, `trigger_node_id` in `triggered_at`.

### Heym Platform Events

Heym dispatcher dogodkov preverja `heym_events` dnevnik vsakih 5 sekund in dostavlja ujemajoče se dogodke aktivnim `heymTrigger` vozliščem. Dostava se zahteva za (dogodek, workflow, vozlišče) prek edinstvene omejitve, tako da se dogodek sproži natančno enkrat na naročenem vozlišču v vseh delavcih, kontejnerjih in strojih. Vsak dogodek, zahtevan v enem prehodu, se dostavi v enem izvajanju: vhod vključuje `events` (vedno niz, najstarejši prvi), `count`, `triggered_by: "heym_event"`, `trigger_node_id` in `triggered_at`. Samo dogodki, objavljeni v zadnjih 5 minutah, se pošiljajo, kar preprečuje ponovni predvajanje zamude; dogodki se hranijo 7 dni.

### WebSocket

Upravljalec WebSocket triggerjev deluje v vodilnem delavcu in ohranja eno odhodno povezavo stranke za vsako aktivno [WebSocket Trigger](../nodes/websocket-trigger-node.md) vozlišče. Lahko sproži izvajanja za `onMessage`, `onConnected` in `onClosed`. Vhod vključuje `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` in eno od `message`, `connection` ali `close`.
### Naložitev datoteke

[File Upload Trigger](../nodes/file-upload-trigger-node.md) ustvari enkratno naložitveno mesto z omejenim časom veljavnosti (TTL), ko se workflow aktivira preko API, MCP ali platna. Naložitev multipart form data na `POST /api/file-intake/u/{token}` porabi to mesto, shrani datoteko kot datoteko na Drive-u in sinhrono zažene workflow. Vhod vključuje `file`, `uploaded_at`, `triggered_by: "file_upload"` in metapodatke o naložitvi.

### Telegram

Telegram pošilja posodobitve webhook za bota na `POST /api/telegram/webhook/{node_id}`. Payload se prenese v workflow kot `update`, `message`, neobvezni `callback_query`, očiščeni `headers`, `triggered_by`, `trigger_node_id` in `triggered_at`. Če izbrane poverilnice vsebujejo skrivni token, Heym preveri `x-telegram-bot-api-secret-token` pred izvedbo.

### Discord

Discord pošilja interakcijske webhooke na `POST /api/discord/webhook/{node_id}`. Payload se prenese v workflow kot `interaction`, `type`, `data`, očiščeni `headers`, `triggered_by`, `trigger_node_id` in `triggered_at`. Heym preveri zahtevo z uporabo Ed25519 in javnega ključa aplikacije izbrane `discord_trigger` poverilnice pred izvedbo.

### RabbitMQ

Porabnik RabbitMQ se zažene, ko se vodilni delavec inicializira. Workflows z `rabbitmq` vozlišči, kjer `rabbitmqOperation === "receive"`, pridobijo porabnika. Vhod vključuje `message_data` (telo, glave, routing_key itd.) in `triggered_by: "rabbitmq"`.

## trigger_source

Zgodovina izvajanja beleži `trigger_source` za vsak vhodni točki:

| Vrednost | Kdaj |
|----------|------|
| `"API"` | Webhook / API klic brez izrecne glave (privzeto) |
| `"Canvas"` | Zagon iz platna urejevalnika workflow |
| `"Quick Drawer"` | Zagon iz hitrega predala urejevalnika, vključno z zagoni datotek, naloženih iz njegovega območja za odlaganje |
| `"cron"` | Cron načrtovalnik |
| `"imap"` | IMAP upravljalnik sprožilcev |
| `"websocket"` | Izhodni WebSocket upravljalnik sprožilcev |
| `"file_upload"` | Vhodna točka za File Upload Trigger (povezave, ustvarjene prek HTTP, MCP ali platna) |
| `"dashboard"` | Zagoni gradnikov nadzorne plošče in nalaganja iz gradnika za odlaganje datotek |
| `"telegram"` | Webhook za Telegram bota |
| `"Discord"` | Webhook za interakcije Discord |
| `"MCP"` | Klic orodja MCP |
| `"portal"` | Izvršitev iz portala |
| `"dashboard_chat"` | Klepet z AI pomočnikom |
| `"AI Agents"` | Pod-workflow, ki ga aktivira vozlišče AI agenta |
| `"SUB_WORKFLOW"` | Pod-workflow, ki ga aktivira vozlišče Execute Workflow |
| custom | Kakršna koli vrednost, poslana v `X-Trigger-Source` glavi ali `trigger_source` poizvedbi/telesnem parametru |
| (ni nastavljeno) | Porabnik RabbitMQ |

## Vhodi po sprožilcu

- **HTTP/Webhook**: `body`, `headers`, `query` iz zahteve
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + neobvezni `callback_query` + očiščeni `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + očiščeni `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (celoten Slack objekt dogodka) + `headers` (očistiti) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + neobvezna `conversation_history`

## Sorodno

- [Webhooks](./webhooks.md) – TTL webhookov, predpomnjenje, omejitev hitrosti, avtentikacija
- [Struktura Workflow](./workflow-structure.md) – Vozlišča in robovi
- [Vrste vozlišč](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Webhook sprožilec za interakcije Discord
- [Hitri začetek](../getting-started/quick-start.md) – Ustvarite workflow z Input
- [Portal](./portal.md) – Portal sprožilec in klepet UI
- [Zgodovina izvajanja](./execution-history.md) – Ogled preteklih zagonov in trigger_source

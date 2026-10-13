# Triggers

Workflows započinju putem **trigger čvorova** ili **ulaznih točaka**. Svaka vrsta triggera ima svoj vlastiti endpoint ili pozadinski proces.

## Trigger Čvorovi

Start čvorovi (bez dolaznih rubova) koji iniciraju izvršavanje:

| Vrsta Čvora | Opis |
|-------------|------|
| [Input](../nodes/input-node.md) (textInput) | HTTP ulazna točka. Prima `body`, `headers`, `query` iz zahtjeva. |
| [Cron](../nodes/cron-node.md) | Izvršava se prema rasporedu (cron izraz, npr. `0 * * * *` za svake sat). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Započinje kada Telegram pošalje ažuriranje webhooka bota na URL specifičan za čvor. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Započinje kada Discord pošalje Interactions API webhook na endpoint specifičan za čvor. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Provjerava IMAP poštanski sandučić i započinje jednom za svaku novo otkrivenu e-poštu. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Započinje kada Heym objavi događaj platforme. Događaji u jednom prozoru isporuke dolaze zajedno kao niz. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Otvara izlaznu klijentsku vezu na vanjskom socketu i započinje na odabranim socket događajima. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Stvara URL za jednokratno učitavanje i započinje kada pozivatelj pošalje veliki multipart datoteku. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Započinje kada se poruka konzumira iz RabbitMQ reda. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Započinje kada Slack pošalje događaj putem Events API webhooka. |

## Ulazne Točke

| Trigger | Endpoint / Izvor | Autentifikacija |
|--------|------------------|-----------------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` header ili `Authorization: Bearer` (samo zaglavlja) |
| **Portal** | `POST /api/portal/{slug}/execute` | Token sesije portala |
| **Board** | [Board](../tabs/board-tab.md) pomak kartice / nastavak izvršavanja u stupcu s workflow lancem (`trigger_source="board"`) | JWT (vlasnik ploče) |
| **Cron** | Cron raspoređivač (izvršava se svake 60s, evaluira cron izraze) | N/A |
| **IMAP** | IMAP upravitelj okidača (glavni radnik, interval provjere po čvoru) | IMAP korisničko ime/lozinka |
| **WebSocket** | Upravitelj izlaznog WebSocket okidača (glavni radnik, trajne klijentske veze) | Opcionalna zaglavlja po čvoru |
| **File Upload** | `POST /api/file-intake/u/{token}` nakon što je slot stvoren | Token za jednokratnu sposobnost |
| **RabbitMQ** | RabbitMQ potrošač (glavni radnik) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 tajna za potpisivanje |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 javni ključ aplikacije |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Opcionalni `x-telegram-bot-api-secret-token` |
| **Editor** | Isto kao Webhook, putem `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Ulaz**: Tijelo zahtjeva se prosljeđuje kao `body` čvorovima textInput
- **Način tijela**: Workflows mogu koristiti `defined` primjere oblikovanih polja ili `generic` sirove JSON primjere u uređivaču i cURL dijalogu
- **Autentifikacija**: Konfigurirana po workflowu (`auth_type`, `allow_anonymous`)

Pogledajte [Webhooks](./webhooks.md) za detalje o TTL-u, predmemoriji, ograničenju brzine i autentifikaciji.

### MCP

Workflows s `mcp_enabled=true` pojavljuju se kao alati za MCP klijente. Ime alata proizlazi iz imena workflowa. Pogledajte [MCP Tab](../tabs/mcp-tab.md).

### Portal

Javni chat UI na `/chat/{slug}`. Pogledajte [Portal](./portal.md) za detalje.

### Cron

Cron raspoređivač se izvršava svake 60 sekundi, pronalazi workflows s aktivnim `cron` čvorovima, evaluira cron izraze i pokreće odgovarajuće workflows. Ulaz uključuje `{"triggered_by": "cron"}`.

### IMAP

Upravitelj IMAP okidača radi u glavnom radniku i provjerava aktivne `imapTrigger` čvorove na njihovom konfiguriranom `pollIntervalMinutes`. Svaki čvor pohranjuje IMAP kursor (`UIDVALIDITY` + posljednji viđeni UID). Ulaz uključuje `email`, `triggered_by: "imap"`, `trigger_node_id` i `triggered_at`.

### Heym Platform Događaji

Heym upravitelj događaja provjerava `heym_events` log svake 5 sekundi i isporučuje odgovarajuće događaje aktivnim `heymTrigger` čvorovima. Isporuka se priznaje po (događaj, workflow, čvor) kroz jedinstveno ograničenje, tako da se događaj aktivira točno jednom po pretplatničkom čvoru kroz svakog radnika, kontejner i stroj. Svaki događaj priznat u jednom prolazu isporučuje se u jednom izvršavanju: ulaz uključuje `events` (uvijek niz, najstariji prvi), `count`, `triggered_by: "heym_event"`, `trigger_node_id` i `triggered_at`. Samo događaji objavljeni u posljednjih 5 minuta se isporučuju, što sprječava ponavljanje zastoja; događaji se zadržavaju 7 dana.

### WebSocket

Upravitelj WebSocket okidača radi u glavnom radniku i održava jednu izlaznu klijentsku vezu po aktivnom [WebSocket Trigger](../nodes/websocket-trigger-node.md) čvoru. Može emitirati izvršavanja za `onMessage`, `onConnected` i `onClosed`. Ulaz uključuje `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` i jedan od `message`, `connection` ili `close`.
### Učitavanje datoteka

[File Upload Trigger](../nodes/file-upload-trigger-node.md) stvara slot za učitavanje s ograničenim vremenom trajanja (TTL) koji se može koristiti samo jednom kada se workflow aktivira putem API-ja, MCP-a ili platna. Učitavanje multipart form podataka na `POST /api/file-intake/u/{token}` troši slot, pohranjuje datoteku kao datoteku na Drive-u i pokreće workflow sinkrono. Ulaz uključuje `file`, `uploaded_at`, `triggered_by: "file_upload"` i metapodatke o učitavanju.

### Telegram

Telegram šalje ažuriranja webhooka bota na `POST /api/telegram/webhook/{node_id}`. Payload se prosljeđuje u workflow kao `update`, `message`, opcionalni `callback_query`, sanitizirani `headers`, `triggered_by`, `trigger_node_id` i `triggered_at`. Ako odabrana vjerodajnica ima tajni token, Heym provjerava `x-telegram-bot-api-secret-token` prije izvršenja.

### Discord

Discord šalje webhooks interakcija na `POST /api/discord/webhook/{node_id}`. Payload se prosljeđuje u workflow kao `interaction`, `type`, `data`, sanitizirani `headers`, `triggered_by`, `trigger_node_id` i `triggered_at`. Heym provjerava zahtjev koristeći Ed25519 i javni ključ aplikacije odabrane `discord_trigger` vjerodajnice prije izvršenja.

### RabbitMQ

RabbitMQ potrošač započinje kada vođa radnika inicijalizira. Workflows s `rabbitmq` čvorovima gdje je `rabbitmqOperation === "receive"` dobivaju potrošača. Ulaz uključuje `message_data` (tijelo, zaglavlja, routing_key itd.) i `triggered_by: "rabbitmq"`.

## trigger_source

Povijest izvršenja bilježi `trigger_source` za svaku ulaznu točku:

| Vrijednost | Kada |
|------------|------|
| `"API"` | Webhook / API poziv bez eksplicitnog zaglavlja (zadano) |
| `"Canvas"` | Pokrenuto iz platna uređivača workflow-a |
| `"Quick Drawer"` | Pokretanje iz panela brze ladice uređivača, uključujući pokretanja s datotekama prenesenim iz njegove zone za ispuštanje |
| `"cron"` | Cron raspoređivač |
| `"imap"` | IMAP upravitelj okidača |
| `"websocket"` | Upravitelj izlaznog WebSocket okidača |
| `"file_upload"` | File Upload Trigger upload endpoint (poveznice kreirane putem HTTP-a, MCP-a ili platna) |
| `"dashboard"` | Pokretanja widgeta nadzorne ploče i prijenosi iz widgeta za ispuštanje datoteka |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord interakcije webhook |
| `"MCP"` | Poziv MCP alata |
| `"portal"` | Izvršavanje iz portala |
| `"dashboard_chat"` | Chat AI asistenta |
| `"AI Agents"` | Pod-workflow pozvan od strane čvora AI agenta |
| `"SUB_WORKFLOW"` | Pod-workflow pozvan od strane čvora Execute Workflow |
| custom | Bilo koja vrijednost poslana u `X-Trigger-Source` zaglavlju ili `trigger_source` query/body param |
| (nije postavljeno) | RabbitMQ potrošač |

## Ulazi po okidaču

- **HTTP/Webhook**: `body`, `headers`, `query` iz zahtjeva
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + opcionalni `callback_query` + sanitizirani `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanitizirani `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **File Upload**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (cijeli Slack objekt događaja) + `headers` (sanitizirani) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + opcionalna `conversation_history`

## Povezano

- [Webhooks](./webhooks.md) – Webhook TTL, cache, ograničenje brzine, autentifikacija
- [Struktura Workflow-a](./workflow-structure.md) – Čvorovi i rubovi
- [Tipovi čvorova](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord interakcije webhook okidač
- [Brzi početak](../getting-started/quick-start.md) – Izradite workflow s Input
- [Portal](./portal.md) – Portal okidač i chat UI
- [Povijest izvršenja](./execution-history.md) – Pregledajte prethodne izvršenja i trigger_source

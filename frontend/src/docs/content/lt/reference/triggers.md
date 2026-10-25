# Triggers

Workflow'ai pradedami **trigger mazgais** arba **įėjimo taškais**. Kiekvienas įvykio tipas turi savo galinį tašką arba fono procesą.

## Trigger Mazgai

Pradžios mazgai (be įeinančių kraštų), kurie inicijuoja vykdymą:

| Mazgo Tipas | Aprašymas |
|-------------|-----------|
| [Įvesties](../nodes/input-node.md) (textInput) | HTTP įėjimo taškas. Priima `body`, `headers`, `query` iš užklausų. |
| [Cron](../nodes/cron-node.md) | Veikia pagal tvarkaraštį (cron išraiška, pvz., `0 * * * *` kas valandą). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Prasideda, kai Telegram siunčia bot webhook atnaujinimą į mazgo specifinį webhook URL. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Prasideda, kai Discord siunčia Interactions API webhook į mazgo specifinį galinį tašką. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Tikrina IMAP pašto dėžutę ir prasideda kiekvieną kartą, kai aptinkamas naujas el. laiškas. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Prasideda, kai Heym paskelbia platformos įvykį. Įvykiai viename išsiuntimo lange atvyksta kartu kaip masyvas. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Atidaro išorinį kliento ryšį su išoriniu socket'u ir prasideda pasirinktu socket įvykiu. |
| [Failo Įkėlimo Trigger](../nodes/file-upload-trigger-node.md) | Sukuria vienkartinį įkėlimo URL ir prasideda, kai skambintojas įkelia didelį multipart failą. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (gauti) | Prasideda, kai žinutė yra suvartojama iš RabbitMQ eilės. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Prasideda, kai Slack siunčia įvykį per Events API webhook. |

## Įėjimo Taškai

| Trigger | Galinis taškas / Šaltinis | Autentifikacija |
|--------|---------------------------|-----------------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` antraštė arba `Authorization: Bearer` (tik antraštės) |
| **Portalas** | `POST /api/portal/{slug}/execute` | Portalų sesijos žetonas |
| **Lenta** | [Lentos](../tabs/board-tab.md) kortelės perkėlimas / sekantis vykdymas į stulpelį su workflow grandine (`trigger_source="board"`) | JWT (lentos savininkas) |
| **Cron** | Cron tvarkaraštis (veikia kas 60s, vertina cron išraiškas) | N/A |
| **IMAP** | IMAP įvykio valdytojas (lyderio darbininkas, kiekvieno mazgo tikrinimo intervalas) | IMAP vartotojo vardas / slaptažodis |
| **WebSocket** | Išorinis WebSocket įvykio valdytojas (lyderio darbininkas, nuolatiniai kliento ryšiai) | Pasirinktinės antraštės kiekvienam mazgui |
| **Failo Įkėlimas** | `POST /api/file-intake/u/{token}` po to, kai sukuriamas slot'as | Vienkartinis galimybės žetonas |
| **RabbitMQ** | RabbitMQ vartotojas (lyderio darbininkas) | N/A |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 pasirašymo paslaptis |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 programos viešasis raktas |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Pasirinktinė `x-telegram-bot-api-secret-token` |
| **Redaktorius** | Tas pats kaip Webhook, per `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Galinis taškas**: `POST /api/workflows/{workflow_id}/execute`
- **Įvestis**: Užklausos kūnas perduodamas kaip `body` į textInput mazgus
- **Kūno režimas**: Workflow'ai gali naudoti `defined` lauko formos pavyzdžius arba `generic` žalius JSON pavyzdžius redaktoriuje ir cURL dialoge
- **Autentifikacija**: Nustatyta kiekvienam workflow (`auth_type`, `allow_anonymous`)

Žr. [Webhook'ai](./webhooks.md) dėl detalių apie TTL, talpyklą, greičio ribojimą ir autentifikaciją.

### MCP

Workflow'ai su `mcp_enabled=true` pasirodo kaip įrankiai MCP klientams. Įrankio pavadinimas gaunamas iš workflow pavadinimo. Žr. [MCP Skirtukas](../tabs/mcp-tab.md).

### Portalas

Vieša pokalbių UI adresu `/chat/{slug}`. Žr. [Portalą](./portal.md) dėl detalių.

### Cron

Cron tvarkaraštis veikia kas 60 sekundžių, randa workflow'us su aktyviais `cron` mazgais, vertina cron išraiškas ir vykdo atitinkančius workflow'us. Įvestis apima `{"triggered_by": "cron"}`.

### IMAP

IMAP įvykio valdytojas veikia lyderio darbininke ir tikrina aktyvius `imapTrigger` mazgus pagal jų nustatytą `pollIntervalMinutes`. Kiekvienas mazgas saugo IMAP žymeklį (`UIDVALIDITY` + paskutinė matyta UID). Įvestis apima `email`, `triggered_by: "imap"`, `trigger_node_id` ir `triggered_at`.

### Heym Platformos Įvykiai

Heym įvykių siuntėjas tikrina `heym_events` žurnalą kas 5 sekundes ir pristato atitinkančius įvykius aktyviems `heymTrigger` mazgams. Pristatymas yra reikalaujamas pagal (įvykis, workflow, mazgas) per unikalų apribojimą, todėl įvykis įvyksta tik vieną kartą kiekvienam prenumeruojančiam mazgui per kiekvieną darbininką, konteinerį ir mašiną. Kiekvienas įvykis, reikalaujamas vienu metu, pristatomas viename vykdyme: įvestis apima `events` (visada masyvas, seniausias pirmas), `count`, `triggered_by: "heym_event"`, `trigger_node_id` ir `triggered_at`. Tik įvykiai, paskelbti per pastarąsias 5 minutes, yra siunčiami, kas sustabdo gedimą, kad būtų atkurtas atidėjimas; įvykiai laikomi 7 dienas.

### WebSocket

WebSocket įvykio valdytojas veikia lyderio darbininke ir palaiko vieną išorinį kliento ryšį kiekvienam aktyviam [WebSocket Įvykiui](../nodes/websocket-trigger-node.md) mazgui. Jis gali išleisti vykdymus `onMessage`, `onConnected` ir `onClosed`. Įvestis apima `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` ir vieną iš `message`, `connection` arba `close`.
### Failo Įkėlimas

[Failo Įkėlimo Trigger](../nodes/file-upload-trigger-node.md) sukuria TTL ribotą, vienkartinį įkėlimo slotą, kai workflow yra iškviečiamas per API, MCP arba drobę. Multipart formos duomenų įkėlimas į `POST /api/file-intake/u/{token}` sunaudoja slotą, saugo failą kaip Drive failą ir pradeda workflow sinchroniškai. Įvestis apima `file`, `uploaded_at`, `triggered_by: "file_upload"` ir įkėlimo metaduomenis.

### Telegram

Telegram siunčia bot webhook atnaujinimus į `POST /api/telegram/webhook/{node_id}`. Payload perduodamas į workflow kaip `update`, `message`, neprivalomas `callback_query`, sanizuoti `headers`, `triggered_by`, `trigger_node_id` ir `triggered_at`. Jei pasirinkti kredencialai turi slaptą tokeną, Heym patikrina `x-telegram-bot-api-secret-token` prieš vykdymą.

### Discord

Discord siunčia sąveikos webhook'us į `POST /api/discord/webhook/{node_id}`. Payload perduodamas į workflow kaip `interaction`, `type`, `data`, sanizuoti `headers`, `triggered_by`, `trigger_node_id` ir `triggered_at`. Heym patikrina užklausą naudodamas Ed25519 ir pasirinkto `discord_trigger` kredencialo programos viešąjį raktą prieš vykdymą.

### RabbitMQ

RabbitMQ vartotojas pradeda veikti, kai lyderio darbininkas inicijuojamas. Workflow su `rabbitmq` mazgais, kur `rabbitmqOperation === "receive"`, gauna vartotoją. Įvestis apima `message_data` (kūnas, antraštės, routing_key ir kt.) ir `triggered_by: "rabbitmq"`.

## Lygiagretumo apribojimas

Workflow su [lygiagretumo apribojimu](./webhooks.md#concurrency-limit-and-queued-runs) išrikiuoja į eilę produkcinius vykdymus iš kiekvieno aukščiau nurodyto įėjimo taško, kai jo lizdai yra pilni, eilės tvarka (FIFO), visose instancijose. Kaip iškvietėjas sužino rezultatą, priklauso nuo įėjimo taško:

| Įėjimo taškas | Kol vykdymas laukia |
|---|---|
| Webhook / API | `202 Accepted` su `execution_id` ir būsenos URL |
| SSE streaming, Quick Drawer, Portal chat | Srautas lieka atidarytas ir siunčia `queued` įvykius |
| Portal without streaming | Užklausa laukia rezultato |
| MCP | `queued` rezultatas užklausai per `heym_execution_status` |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger laukia rezultato tiek pat laiko, kiek lauktų vykdymas kitoje [instancijoje](./cluster.md). Vykdymas vis tiek įvyksta ir įrašomas į istoriją |

Kai eilė pilna, vykdymas neprasideda ir istorija jį užregistruoja kaip `queue_full`. Redaktoriaus bandomieji vykdymai, sub-workflow iškvietimai ([Execute](../nodes/execute-node.md) mazgas ir agento workflow įrankiai), [Evals](../tabs/evals-tab.md), pokalbių kūrimo režimo testai ir peržiūros atnaujinimai niekada nėra dedami į eilę. [Board](../tabs/board-tab.md) kortelių vykdymai, [File Upload](../nodes/file-upload-trigger-node.md) vykdymai, AI asistento run-workflow įrankio paleisti vykdymai ir įspėjimų pranešimų workflow taip pat pradedami nelaukiant laisvos vietos.

## trigger_source

Vykdymo istorija registruoja `trigger_source` kiekvienam įėjimo taškui:

| Vertė | Kada |
|-------|------|
| `"API"` | Webhook / API skambutis be aiškiai nurodyto antraštės (numatytasis) |
| `"Canvas"` | Vykdoma iš workflow redaktoriaus drobės |
| `"Quick Drawer"` | Vykdoma iš redaktoriaus greitojo įrankių skydelio, įskaitant failų vykdymus, įkeltus iš jo numetimo zonos |
| `"cron"` | Cron tvarkyklė |
| `"imap"` | IMAP trigger valdymo įrankis |
| `"websocket"` | Išorinio WebSocket trigger valdymo įrankis |
| `"file_upload"` | Failo įkėlimo Trigger įkėlimo Endpoint (nuorodos, sukurtos per HTTP, MCP arba drobę) |
| `"dashboard"` | Prietaisų skydelio valdiklių vykdymai ir įkėlimai iš failų numetimo valdiklio |
| `"telegram"` | Telegram bot webhook |
| `"Discord"` | Discord sąveikų webhook |
| `"MCP"` | MCP įrankio skambutis |
| `"portal"` | Portalas vykdymas |
| `"dashboard_chat"` | AI asistento pokalbis |
| `"AI Agents"` | Sub-workflow, iškviečiamas AI agento mazgo |
| `"SUB_WORKFLOW"` | Sub-workflow, iškviečiamas Vykdyti Workflow mazgo |
| custom | Bet kokia vertė, siunčiama `X-Trigger-Source` antraštėje arba `trigger_source` užklausos/kūno parametre |
| (ne nustatyta) | RabbitMQ vartotojas |

## Įvestys pagal Trigger

- **HTTP/Webhook**: `body`, `headers`, `query` iš užklausos
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + neprivalomas `callback_query` + sanizuoti `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + sanizuoti `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Failo Įkėlimas**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (pilnas Slack įvykio objektas) + `headers` (sanizuoti) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portalas**: `body.inputs` + neprivaloma `conversation_history`

## Susiję

- [Webhooks](./webhooks.md) – Webhook TTL, talpykla, greičio limitas, autentifikacija
- [Workflow Struktūra](./workflow-structure.md) – Mazgai ir briaunos
- [Mazgų Tipai](./node-types.md) – [Įvestis](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [Failo Įkėlimo Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discord sąveikų webhook trigger
- [Greitas Pradžia](../getting-started/quick-start.md) – Sukurkite workflow su Įvestimi
- [Portalas](./portal.md) – Portalas trigger ir pokalbių UI
- [Vykdymo Istorija](./execution-history.md) – Peržiūrėkite praeitus vykdymus ir trigger_source

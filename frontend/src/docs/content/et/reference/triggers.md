# Triggerid

Workflow'd käivitatakse **trigger-sõlmede** või **sisendpunktide** kaudu. Igal triggeri tüübil on oma endpoint või taustaprotsess.

## Trigger-sõlmed

Algussõlmed (ilma sissetulevate servadeta), mis algatavad käivituse:

| Sõlme tüüp | Kirjeldus |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP sisendpunkt. Võtab vastu `body`, `headers`, `query` päringutest. |
| [Cron](../nodes/cron-node.md) | Käivitub ajakava alusel (cron-avaldis, nt `0 * * * *` iga tunni tagant). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Käivitub, kui Telegram saadab boti webhooki uuenduse sõlmepõhisele webhooki URL-ile. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Käivitub, kui Discord saadab Interactions API webhooki sõlmepõhisele endpointile. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Küsib IMAP-postkasti ja käivitub iga vastuvõetud uue e-kirja kohta. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Käivitub, kui Heym avaldab platvormi sündmuse. Ühes saatmisaknas saabuvad sündmused koos massiivina. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Avab väljamineva kliendiühenduse välise socketiga ja käivitub valitud socketi sündmuste korral. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Loob ühekordse üleslaadimise URL-i ja käivitub, kui kutsuja saadab suure multipart-faili. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Käivitub, kui sõnum võetakse RabbitMQ järjekorrast. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Käivitub, kui Slack saadab sündmuse Events API webhooki kaudu. |

## Sisendpunktid

| Trigger | Endpoint / Allikas | Autentimine |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` päis või `Authorization: Bearer` (ainult päised) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portaali sessiooni token |
| **Tahvel** | [Tahvel](../tabs/board-tab.md) kaardi liigutamine / järelkäivitus veergu, millel on workflow-ahel (`trigger_source="board"`) | JWT (tahvli omanik) |
| **Cron** | Cron-ajastaja (käivitub iga 60 s, hindab cron-avaldisi) | Puudub |
| **IMAP** | IMAP triggeri haldur (juhttöötaja, sõlmepõhine küsitlusintervall) | IMAP kasutajanimi/parool |
| **WebSocket** | Väljamineva WebSocketi triggeri haldur (juhttöötaja, püsivad kliendiühendused) | Valikulised sõlmepõhised päised |
| **File Upload** | `POST /api/file-intake/u/{token}` pärast pesa loomist | Ühekordne võimekuse token |
| **RabbitMQ** | RabbitMQ tarbija (juhttöötaja) | Puudub |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 allkirjastamise saladus |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 rakenduse avalik võti |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Valikuline `x-telegram-bot-api-secret-token` |
| **Editor** | Sama mis Webhook, `workflowStore.executeWorkflow` kaudu | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Sisend**: Päringu keha edastatakse textInput-sõlmedele kui `body`
- **Keha režiim**: Workflow'd saavad redaktoris ja cURL-dialoogis kasutada `defined` väljakujulisi näiteid või `generic` töötlemata JSON-näiteid
- **Autentimine**: Konfigureeritakse workflow kaupa (`auth_type`, `allow_anonymous`)

Vaadake [Webhooks](./webhooks.md), et saada üksikasju TTL, vahemälu, kiirusepiirangu ja autentimise kohta.

### MCP

Workflow'd, millel on `mcp_enabled=true`, kuvatakse MCP-klientidele tööriistadena. Tööriista nimi tuletatakse workflow nimest. Vaadake [MCP Tab](../tabs/mcp-tab.md).

### Portal

Avalik chat-liides asukohas `/chat/{slug}`. Üksikasjade saamiseks vaadake [Portal](./portal.md).

### Cron

Cron-ajastaja käivitub iga 60 sekundi järel, leiab aktiivsete `cron`-sõlmedega workflow'd, hindab cron-avaldisi ja käivitab vastavad workflow'd. Sisend sisaldab `{"triggered_by": "cron"}`.

### IMAP

IMAP triggeri haldur töötab juhttöötajas ja kontrollib aktiivseid `imapTrigger`-sõlmi nende konfigureeritud `pollIntervalMinutes` järgi. Iga sõlm salvestab IMAP-kursori (`UIDVALIDITY` + viimati nähtud UID). Sisend sisaldab `email`, `triggered_by: "imap"`, `trigger_node_id` ja `triggered_at`.

### Heym platvormi sündmused

Heym sündmuste saatja küsib `heym_events` logi iga 5 sekundi järel ja edastab vastavad sündmused aktiivsetele `heymTrigger`-sõlmedele. Edastamine reserveeritakse iga (sündmus, workflow, sõlm) kohta unikaalse piirangu kaudu, nii et sündmus käivitub täpselt üks kord iga telliva sõlme kohta kõigis töötajates, konteinerites ja masinates. Iga sündmus, mis on ühe käigu jooksul reserveeritud, edastatakse ühes käivituses: sisend sisaldab `events` (alati massiiv, vanimad esimesena), `count`, `triggered_by: "heym_event"`, `trigger_node_id` ja `triggered_at`. Edastatakse ainult viimase 5 minuti jooksul avaldatud sündmused, mis hoiab ära katkestuse ajal mahajäämuse kordamise; sündmusi säilitatakse 7 päeva.

### WebSocket

WebSocketi triggeri haldur töötab juhttöötajas ja hoiab ühte väljaminevat kliendiühendust iga aktiivse [WebSocket Trigger](../nodes/websocket-trigger-node.md) sõlme kohta. See võib väljastada käivitusi sündmuste `onMessage`, `onConnected` ja `onClosed` korral. Sisend sisaldab `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` ja ühte järgmistest: `message`, `connection` või `close`.
### Faili üleslaadimine

[Faili üleslaadimise trigger](../nodes/file-upload-trigger-node.md) loob TTL-iga piiratud ühekordse
üleslaadimispesa, kui workflow käivitatakse API, MCP või lõuendi kaudu. Mitmeosalise vormiandmete
üleslaadimine aadressile `POST /api/file-intake/u/{token}` tarbib pesa, salvestab faili Drive-failina ja
käivitab workflow sünkroonselt. Sisend sisaldab `file`, `uploaded_at`,
`triggered_by: "file_upload"` ja üleslaadimise metaandmeid.

### Telegram

Telegram saadab boti webhooki uuendused aadressile `POST /api/telegram/webhook/{node_id}`. Payload edastatakse workflow'sse kujul `update`, `message`, valikuline `callback_query`, puhastatud `headers`, `triggered_by`, `trigger_node_id` ja `triggered_at`. Kui valitud mandaadil on salajane token, kontrollib Heym enne käivitamist `x-telegram-bot-api-secret-token` väärtust.

### Discord

Discord saadab interaktsiooni webhookid aadressile `POST /api/discord/webhook/{node_id}`. Payload edastatakse workflow'sse kujul `interaction`, `type`, `data`, puhastatud `headers`, `triggered_by`, `trigger_node_id` ja `triggered_at`. Heym kontrollib päringut Ed25519 abil ja valitud `discord_trigger` mandaadi rakenduse avaliku võtmega enne käivitamist.

### RabbitMQ

RabbitMQ tarbija käivitub, kui juhtiv töötaja (leader worker) lähtestatakse. Workflow'd, mis sisaldavad `rabbitmq` node'e, kus `rabbitmqOperation === "receive"`, saavad tarbija. Sisend sisaldab `message_data` (body, headers, routing_key jne) ja `triggered_by: "rabbitmq"`.

## Samaaegsuse piirang

[Samaaegsuse piiranguga](./webhooks.md#concurrency-limit-and-queued-runs) workflow seab ülaltoodud mis tahes sisendpunkti tootmiskäivitused järjekorda, kui selle pesad on täis, põhimõttel esimesena sisse, esimesena välja, kõigis eksemplarides. See, kuidas helistaja tulemuse teada saab, sõltub sisendpunktist:

| Sisendpunkt | Kuni käivitus ootab |
|---|---|
| Webhook / API | `202 Accepted` koos `execution_id` ja oleku URL-iga |
| SSE streaming, Quick Drawer, Portal chat | Voog jääb avatuks ja saadab `queued` sündmusi |
| Portal without streaming | Päring ootab tulemust |
| MCP | `queued` tulemus, mida pärida `heym_execution_status` abil |
| Cron, IMAP, Google Drive / Sheets, WebSocket, RabbitMQ, Slack, Discord, Telegram, Heym events, error workflows, Dashboard run widgets | Trigger ootab tulemust sama kaua, kui ootaks käivitus teises [eksemplaris](./cluster.md). Käivitus viiakse igal juhul läbi ja salvestatakse ajalukku |

Kui järjekord on täis, käivitus ei alga ja ajalugu salvestab selle kui `queue_full`. Redaktori testkäivitused, alam-workflow kõned (sõlm [Execute](../nodes/execute-node.md) ja agendi workflow tööriistad), [Evals](../tabs/evals-tab.md), vestluse loomise režiimi testkäivitused ja ülevaatuse jätkamised ei lähe kunagi järjekorda. [Board](../tabs/board-tab.md) kaardikäivitused, [File Upload](../nodes/file-upload-trigger-node.md) käivitused, tehisintellekti assistendi run-workflow tööriista käivitatud jooksud ja hoiatustest teavitamise workflow'd käivituvad samuti ilma pesa ootamata.

## trigger_source

Käivituste ajalugu salvestab `trigger_source` iga sisendpunkti kohta:

| Väärtus | Millal |
|-------|------|
| `"API"` | Webhook / API-kutse ilma selgesõnalise päiseta (vaikeväärtus) |
| `"Canvas"` | Käivitatud workflow redaktori lõuendilt |
| `"Quick Drawer"` | Käivitatud redaktori kiirsahtli paneelilt, sealhulgas selle pukseerimisalalt üles laaditud failikäivitused |
| `"cron"` | Cron-ajastaja |
| `"imap"` | IMAP triggeri haldur |
| `"websocket"` | Väljamineva WebSocketi triggeri haldur |
| `"file_upload"` | Faili üleslaadimise triggeri üleslaadimise endpoint (HTTP, MCP või lõuendi kaudu loodud lingid) |
| `"dashboard"` | Töölaua vidinate käivitused ja üleslaadimised failipukseerimisvidinast |
| `"telegram"` | Telegrami boti webhook |
| `"Discord"` | Discordi interaktsioonide webhook |
| `"MCP"` | MCP tööriista kutse |
| `"portal"` | Portaali käivitamine |
| `"dashboard_chat"` | AI-assistendi chat |
| `"AI Agents"` | AI-agendi node'i poolt käivitatud alam-workflow |
| `"SUB_WORKFLOW"` | Execute Workflow node'i poolt käivitatud alam-workflow |
| kohandatud | Mis tahes väärtus, mis on saadetud `X-Trigger-Source` päises või `trigger_source` päringu/body parameetris |
| (määramata) | RabbitMQ tarbija |

## Sisendid triggeri tüübi järgi

- **HTTP/Webhook**: `body`, `headers`, `query` päringust
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + valikuline `callback_query` + puhastatud `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + puhastatud `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Faili üleslaadimine**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (täielik Slacki sündmuse objekt) + `headers` (puhastatud) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + valikuline `conversation_history`

## Seotud

- [Webhookid](./webhooks.md) – Webhooki TTL, vahemälu, kiiruspiirang, autentimine
- [Workflow struktuur](./workflow-structure.md) – Node'id ja servad
- [Node'i tüübid](./node-types.md) – [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md), [File Upload Trigger](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord Trigger](../nodes/discord-trigger-node.md) – Discordi interaktsioonide webhook trigger
- [Kiire algus](../getting-started/quick-start.md) – Loo workflow Input node'iga
- [Portal](./portal.md) – Portaali trigger ja chat UI
- [Käivituste ajalugu](./execution-history.md) – Vaata varasemaid käivitusi ja trigger_source'i

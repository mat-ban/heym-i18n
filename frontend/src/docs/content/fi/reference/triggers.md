# Triggers

Workflows aloitetaan **trigger-solmuilla** tai **sisäänkäyntipisteillä**. Jokaisella trigger-tyypillä on oma endpointtinsa tai taustaprosessinsa.

## Trigger-solmut

Aloitussolmut (ilman saapuvia yhteyksiä), jotka käynnistävät suorituksen:

| Solmun tyyppi | Kuvaus |
|-----------|-------------|
| [Input](../nodes/input-node.md) (textInput) | HTTP-sisäänkäyntipiste. Vastaanottaa `body`, `headers`, `query` pyynnöistä. |
| [Cron](../nodes/cron-node.md) | Suoritetaan aikataulun mukaisesti (cron-lauseke, esim. `0 * * * *` tunnin välein). |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Käynnistyy, kun Telegram lähettää bottiin webhook-päivityksen solmukohtaiseen webhook-URL:iin. |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Käynnistyy, kun Discord lähettää Interactions API -webhookin solmukohtaiseen endpointtiin. |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Tarkistaa IMAP-postilaatikon ja käynnistyy jokaisesta uudesta havaitsemastaan sähköpostista. |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Käynnistyy, kun Heym julkaisee alustatapahtuman. Yhden lähetysikkunan tapahtumat saapuvat yhdessä taulukkona. |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Avaa ulospäin suuntautuvan asiakasyhteyden ulkoiseen socketiin ja käynnistyy valituista socket-tapahtumista. |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Luo kertakäyttöisen lataus-URL:n ja käynnistyy, kun kutsuja lähettää suuren moniosaisen tiedoston. |
| [RabbitMQ](../nodes/rabbitmq-node.md) (receive) | Käynnistyy, kun viesti vastaanotetaan RabbitMQ-jonosta. |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Käynnistyy, kun Slack lähettää tapahtuman Events API -webhookin kautta. |

## Sisäänkäyntipisteet

| Trigger | Endpoint / Lähde | Tunnistus |
|---------|-------------------|------|
| **Webhook/API** | `POST /api/workflows/{id}/execute` | `anonymous` / `jwt` / `header_auth` |
| **MCP** | `POST /api/mcp/tools/call`, `/message`, `/sse` | `X-MCP-Key` -otsake tai `Authorization: Bearer` (vain otsakkeet) |
| **Portal** | `POST /api/portal/{slug}/execute` | Portal-istunnon token |
| **Board** | [Board](../tabs/board-tab.md) -kortin siirtäminen tai seurantasuoritus sarakkeeseen, jossa on workflow-ketju (`trigger_source="board"`) | JWT (boardin omistaja) |
| **Cron** | Cron-ajastin (suoritetaan 60 sekunnin välein, arvioi cron-lausekkeet) | Ei sovellettavissa |
| **IMAP** | IMAP-triggerin hallinta (johtava työntekijä, solmukohtainen kyselyväli) | IMAP-käyttäjätunnus/salasana |
| **WebSocket** | WebSocket-triggerin hallinta (johtava työntekijä, pysyvät asiakasyhteydet) | Valinnaiset solmukohtaiset otsakkeet |
| **File Upload** | `POST /api/file-intake/u/{token}` paikan luonnin jälkeen | Kertakäyttöinen käyttöoikeustoken |
| **RabbitMQ** | RabbitMQ-kuluttaja (johtava työntekijä) | Ei sovellettavissa |
| **Slack** | `POST /api/slack/webhook/{node_id}` | HMAC-SHA256 -allekirjoitusavain |
| **Discord** | `POST /api/discord/webhook/{node_id}` | Ed25519 -sovelluksen julkinen avain |
| **Telegram** | `POST /api/telegram/webhook/{node_id}` | Valinnainen `x-telegram-bot-api-secret-token` |
| **Editor** | Sama kuin Webhook, kautta `workflowStore.executeWorkflow` | JWT |

### Webhook / API

- **Endpoint**: `POST /api/workflows/{workflow_id}/execute`
- **Syöte**: Pyynnön runko välitetään `body`-kentässä textInput-solmuille
- **Runkotila**: Workflowt voivat käyttää joko `defined`-kenttämuotoisia esimerkkejä tai `generic`-raakaa JSON-esimerkkejä editorissa ja cURL-dialogissa
- **Tunnistus**: Määritetty workflow-kohtaisesti (`auth_type`, `allow_anonymous`)

Lisätietoja TTL:stä, välimuistista, nopeusrajoituksista ja tunnistuksesta on kohdassa [Webhooks](./webhooks.md).

### MCP

Workflowt, joissa `mcp_enabled=true`, näkyvät MCP-asiakkaille työkaluina. Työkalun nimi johdetaan workflown nimestä. Katso [MCP-välilehti](../tabs/mcp-tab.md).

### Portal

Julkinen keskustelukäyttöliittymä osoitteessa `/chat/{slug}`. Lisätietoja on kohdassa [Portal](./portal.md).

### Cron

Cron-ajastin suoritetaan 60 sekunnin välein, etsii aktiivisia `cron`-solmuja sisältävät workflowt, arvioi cron-lausekkeet ja suorittaa vastaavat workflowt. Syötteeseen kuuluu `{"triggered_by": "cron"}`.

### IMAP

IMAP-triggerin hallinta suoritetaan johtavassa työntekijässä ja tarkistaa aktiiviset `imapTrigger`-solmut niiden määrittämällä `pollIntervalMinutes`-välein. Jokainen solmu tallentaa IMAP-kursorin (`UIDVALIDITY` + viimeksi nähty UID). Syötteeseen kuuluu `email`, `triggered_by: "imap"`, `trigger_node_id` ja `triggered_at`.

### Heym-alustan tapahtumat

Heym-tapahtumien lähettäjä tarkistaa `heym_events`-lokia 5 sekunnin välein ja toimittaa vastaavat tapahtumat aktiivisille `heymTrigger`-solmuille. Toimitus varmistetaan yksilöllisellä rajoitteella (tapahtuma, workflow, solmu) kohden, joten tapahtuma laukaisee täsmälleen kerran jokaisessa tilaussolmussa kaikilla työntekijöillä, konttien ja koneiden välillä. Yhdessä läpikäynnissä varmistetut tapahtumat toimitetaan yhdessä suorituksessa: syötteeseen kuuluu `events` (aina taulukko, vanhin ensin), `count`, `triggered_by: "heym_event"`, `trigger_node_id` ja `triggered_at`. Vain viimeisen 5 minuutin aikana julkaistut tapahtumat toimitetaan, mikä estää häiriötilanteiden aiheuttaman takautuvan toiston; tapahtumat säilytetään 7 päivää.

### WebSocket

WebSocket-triggerin hallinta suoritetaan johtavassa työntekijässä ja ylläpitää yhtä ulospäin suuntautuvaa asiakasyhteyttä jokaiselle aktiiviselle [WebSocket Trigger](../nodes/websocket-trigger-node.md) -solmulle. Se voi käynnistää suorituksia `onMessage`-, `onConnected`- ja `onClosed`-tapahtumille. Syötteeseen kuuluu `eventName`, `url`, `triggered_by: "websocket"`, `trigger_node_id` ja joko `message`, `connection` tai `close`.
### Tiedoston lataus

[Tiedoston lataus -triggeri](../nodes/file-upload-trigger-node.md) luo kertakäyttöisen, rajallisen käyttöiän omaavan latauspaikan, kun workflow kutsutaan API:n, MCP:n tai canvasin kautta. Moniosaiset lomakedata voidaan lähettää osoitteeseen `POST /api/file-intake/u/{token}`, mikä käyttää latauspaikan, tallentaa tiedoston Driveen ja käynnistää workflown synkronisesti. Syötteisiin kuuluvat `file`, `uploaded_at`, `triggered_by: "file_upload"` sekä lataustiedot.

### Telegram

Telegram lähettää bottien webhook-päivitykset osoitteeseen `POST /api/telegram/webhook/{node_id}`. Payload välitetään workflowlle muodossa `update`, `message`, valinnainen `callback_query`, siivotut `headers`, `triggered_by`, `trigger_node_id` ja `triggered_at`. Jos valitulla tunnistetiedolla on salainen token, Heym vahvistaa `x-telegram-bot-api-secret-token` ennen suoritusta.

### Discord

Discord lähettää interaktio-webhookit osoitteeseen `POST /api/discord/webhook/{node_id}`. Payload välitetään workflowlle muodossa `interaction`, `type`, `data`, siivotut `headers`, `triggered_by`, `trigger_node_id` ja `triggered_at`. Heym vahvistaa pyynnön käyttäen Ed25519-algoritmia ja valitun `discord_trigger` -tunnistetiedon sovelluksen julkista avainta ennen suoritusta.

### RabbitMQ

RabbitMQ-kuluttaja käynnistyy, kun päätyöntekijä alustetaan. Workflowt, joissa on `rabbitmq`-solmut, joissa `rabbitmqOperation === "receive"`, saavat kuluttajan. Syötteisiin kuuluvat `message_data` (body, headers, routing_key jne.) ja `triggered_by: "rabbitmq"`.

## trigger_source

Suoritushistoria tallentaa `trigger_source` -arvon jokaiselle käynnistyspisteelle:

| Arvo | Kun |
|-------|------|
| `"API"` | Webhook / API-kutsu ilman eksplisiittistä otsikkoa (oletus) |
| `"Canvas"` | Suoritus workflow-editorin canvasista |
| `"Quick Drawer"` | Suoritus editorin pikavalikkopaneelista, mukaan lukien sen pudotusalueelta ladatut tiedostosuoritukset |
| `"cron"` | Cron-aikatauluttaja |
| `"imap"` | IMAP-triggerin hallinta |
| `"websocket"` | Lähtevä WebSocket-triggerin hallinta |
| `"file_upload"` | Tiedoston lataus -triggerin latauspäätepiste (HTTP:n, MCP:n tai työpöydän kautta luodut linkit) |
| `"dashboard"` | Kojelaudan widget-suoritukset ja lataukset tiedostonpudotuswidgetistä |
| `"telegram"` | Telegram-botin webhook |
| `"Discord"` | Discord-interaktioiden webhook |
| `"MCP"` | MCP-työkalun kutsu |
| `"portal"` | Portaalin suoritus |
| `"dashboard_chat"` | Tekoälyavustajan keskustelu |
| `"AI Agents"` | Alaworkflow, jonka tekoälyagenttisolmu käynnisti |
| `"SUB_WORKFLOW"` | Alaworkflow, jonka Execute Workflow -solmu käynnisti |
| mukautettu | Mikä tahansa `X-Trigger-Source` -otsikossa tai `trigger_source` -kysely-/body-parametrissa lähetetty arvo |
| (ei asetettu) | RabbitMQ-kuluttaja |

## Syötteet triggerin mukaan

- **HTTP/Webhook**: Pyynnön `body`, `headers`, `query`
- **Cron**: `{"triggered_by": "cron"}`
- **Telegram**: `update` + `message` + valinnainen `callback_query` + siivotut `headers` + `triggered_by: "telegram"` + `trigger_node_id` + `triggered_at`
- **Discord**: `interaction` + `type` + `data` + siivotut `headers` + `triggered_by: "Discord"` + `trigger_node_id` + `triggered_at`
- **IMAP**: `email` + `triggered_by: "imap"` + `trigger_node_id` + `triggered_at`
- **WebSocket**: `eventName` + `url` + `triggered_by: "websocket"` + `message` / `connection` / `close`
- **Tiedoston lataus**: `file` + `uploaded_at` + `triggered_by: "file_upload"`
- **RabbitMQ**: `message_data` + `triggered_by: "rabbitmq"`
- **Slack**: `event` (täysi Slack-tapahtumaobjekti) + `headers` (siivotut) + `triggered_by: "Slack"` + `trigger_node_id`
- **Portal**: `body.inputs` + valinnainen `conversation_history`

## Aiheeseen liittyvät

- [Webhookit](./webhooks.md) – Webhookin käyttöikä, välimuisti, rajoitukset, autentikointi
- [Workflown rakenne](./workflow-structure.md) – Solmut ja yhteydet
- [Solmutyypit](./node-types.md) – [Syöte](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram-triggeri](../nodes/telegram-trigger-node.md), [IMAP-triggeri](../nodes/imap-trigger-node.md), [Heym-triggeri](../nodes/heym-trigger-node.md), [WebSocket-triggeri](../nodes/websocket-trigger-node.md), [Tiedoston lataus -triggeri](../nodes/file-upload-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md)
- [Discord-triggeri](../nodes/discord-trigger-node.md) – Discord-interaktioiden webhook-triggeri
- [Pika-aloitus](../getting-started/quick-start.md) – Workflown rakentaminen syötesolmun avulla
- [Portaali](./portal.md) – Portaalin triggeri ja keskustelukäyttöliittymä
- [Suoritushistoria](./execution-history.md) – Aikaisempien suoritusten ja trigger_source -tietojen tarkastelu

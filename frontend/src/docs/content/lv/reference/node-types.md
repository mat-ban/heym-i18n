# Mezglu tipi

Heym nodrošina dažādus mezglu tipus workflow veidošanai. Mezglu konfigurācijā izmantojiet [izteiksmes](./expression-dsl.md), piemēram, `$input.text` un `$nodeLabel.field`.

## Trigger mezgli

| Mezgls | Apraksts | Izvades |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Teksta ievades punkts workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Palaist pēc grafika (cron izteiksme) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Palaist, kad pienāk Telegram bota webhook atjauninājums | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Palaist, kad Slack nosūta Events API webhook | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Palaist, kad Discord nosūta aplikācijas mijiedarbības webhook | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Palaist, kad IMAP pastkastē pienāk jauns e-pasts | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Palaist, kad Heym publicē platformas notikumu (apvienots masīvs) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Palaist no izejoša savienojuma uz ārēju WebSocket serveri | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Izveidot vienreiz lietojamu augšupielādes saiti un sākt, kad tiek augšupielādēts liels fails | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Palaist, kad no rindas tiek saņemts ziņojums | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Palaist, kad jebkurā mezglā rodas kļūda (bez ienākošas šķautnes) | 1 |

Skatiet [Triggers](./triggers.md), lai uzzinātu par visiem ievades punktiem.

## AI mezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Apstrādāt tekstu ar valodas modeli | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Uzdot lēmumu modelim tipizētus jautājumus un sazarot pēc atgrieztajām varbūtībām | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM ar rīku izsaukšanu, prasmēm, MCP, neobligātu [cilvēka pārskatīšanu](./human-in-the-loop.md) un neobligātu [noturīgu atmiņas grafu](./agent-persistent-memory.md). Skatiet [Agent Architecture](./agent-architecture.md). | 1 | 1, plus neobligāta `review` izvade |
| [Codex](../nodes/codex-node.md) | Palaist lokālo Codex CLI pret GitHub repozitoriju, izmantojot ChatGPT/Codex piekļuves token | 1 | 1, plus `question` izvade |
| [OpenCode Go](../nodes/opencode-go-node.md) | Palaist OpenCode CLI pret GitHub repozitoriju nostiprinātā konteinerā, izmantojot OpenCode Go gateway API atslēgu | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Tieši izsaukt konkrētu MCP rīku bez LLM izvēles | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Ievietot, upsert, dzēst vai meklēt (vektoru vai hibrīda vektoru + BM25) Qdrant vai Postgres (pgvector) [vektoru krātuvē](../tabs/vectorstores-tab.md) RAG vajadzībām | 1 | 1 |

## Loģikas mezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Sazarot, pamatojoties uz if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Maršrutēt, saskaņojot vērtību ar gadījumiem | 1 | n |
| [Merge](../nodes/merge-node.md) | Gaidīt vairākas ievades un apvienot | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterēt pār masīvu | 1 | 2 (loop/done) |

## Datu mezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Pārveidot un kartēt datus | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konvertēt datus starp formātiem (CSV, JSON, XML) un OCR attēlus vai PDF failus tekstā | 1 | 1 |
| [Code](../nodes/code-node.md) | Palaist Python vienreizlietojamā, tīklā izolētā sandbox ar savu requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Iestatīt vai iegūt mainīgo (workflow lokālo vai [globālo](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Izsaukt citu workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lasīt Heym workflow un izpildes vēsturi | 1 | 1 |
## Integrācijas mezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Veikt HTTP pieprasījumus (cURL) | 0 vai 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Pievienoties ārējam WebSocket un nosūtīt vienu ziņojumu | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Nosūtīt Telegram bota ziņojumus | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Nosūtīt Slack ziņojumus | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Nosūtīt Discord webhook ziņojumus | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Nosūtīt e-pastus, izmantojot SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis darbības (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Lasīt/rakstīt Grist izklājlapas | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Pārvaldīt repozitorijus, lietotājus, problēmas, pull request, atsauksmes, laidienus, Actions workflow un failus, izmantojot GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Pārvaldīt Jira projektus, problēmas, komentārus, pielikumus, lietotājus, paziņojumus un workflow pārejas, izmantojot Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Pārvaldīt Linear komandas, projektus, problēmas, workflow statusus un komentārus, izmantojot GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Lasīt/rakstīt Google Sheets, izmantojot OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Uzskaitīt, lejupielādēt, atjaunināt un dzēst Google Drive failus, izmantojot OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Palaist SQL vaicājumus un ievietot rindas BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Vaicāt un mainīt Supabase tabulas, izmantojot PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Palaist SQL, CRUD un skaitīšanas darbības pret ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Pārvaldīt Notion datubāzes, datu avotus, lapas un blokus | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Pārvaldīt Sentry organizācijas, projektus, komandas, problēmas, notikumus un laidienus | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Pārvaldīt bucket un mapes; uzskaitīt, augšupielādēt, lejupielādēt, kopēt un dzēst objektus | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Lasīt/rakstīt Heym DataTables (pirmās puses krātuve) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Pārvaldīt Drive failus: dzēst, iestatīt paroli, TTL, maksimālo lejupielāžu skaitu, koplietot/atcelt koplietošanu komandai | 1 | 1 |

## Automatizācijas mezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Iegūt tīmekļa lapas ar FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Pārlūka automatizācija ar AI soli un Auto Heal | 1 | 1 |

## Utilītmezgli

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Aizkavēt izpildi | 1 | 1 |
| [Output](../nodes/output-node.md) | Izvades endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Kartēt laukus uz JSON objektu; vienīgais terminālis = augstākā līmeņa webhook/run pamatteksts | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderēt HTML lapu; vienīgais terminālis = webhook atbild ar text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Termināļa informācijas paneļa logrīka izvade, kas kartē augšupējās rindas uz diagrammas payload | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Pievienot markdown piezīmes kanvai (netiek izpildīts) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Žurnālēt uz aizmugursistēmas konsoli | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Atspējot citu mezglu workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Iespējot atspējotu mezglu workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Apturēt workflow ar kļūdas atbildi | 1 | 0 |

## Spraudņu mezgli

Spraudņu mezglus nodrošina instance instalētie spraudņi. Katrs instalētais
spraudnis parādās paletē sadaļā **Plugins** ar savu nosaukumu; zem pārsega
tas kartējas uz vienu no šiem diviem mezglu tipiem.

| Mezgls | Apraksts | Ievades | Izvades |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Pielāgota darbība, ko nodrošina instalēts spraudnis | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Pielāgots trigger, ko nodrošina instalēts spraudnis | 0 | 1 |
## Saistītie

- [Kanvas funkcijas](./canvas-features.md) – Datu piespraude, izpildes žurnāli, iespējošana/atspējošana, izvilkšana apakš-workflow
- [Agent mezgls](../nodes/agent-node.md) – Detalizēta atsauce par AI Agent mezglu
- [Agent arhitektūra](./agent-architecture.md) – Apakš-aģenti, orķestrētājs, prasmes, MCP, rīku izsaukšana
- [Agent pastāvīgā atmiņa](./agent-persistent-memory.md) – Katra mezgla zināšanu grafs, koplietošana un fona izvilkšana
- [Cilvēks ciklā](./human-in-the-loop.md) – Apturēt aģenta izvadi cilvēka apstiprinājumam
- [Izteiksmes DSL](./expression-dsl.md) – Datu atsaukšana mezgla konfigurācijā
- [Izteiksmes novērtēšanas dialogs](./expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu
- [Faila augšupielādes Trigger](../nodes/file-upload-trigger-node.md) – Pieņemt lielas multipart augšupielādes, izmantojot vienreiz lietojamas saites
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Reāllaika izejošā socket Trigger
- [WebSocket sūtīšana](../nodes/websocket-send-node.md) – Nosūtīt ziņojumus uz ārējiem socket
- [Workflow struktūra](./workflow-structure.md) – JSON formāts mezgliem un savienojumiem
- [Triggers](./triggers.md) – Visi workflow ievades punkti
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienot API atslēgas LLM, HTTP un citiem mezgliem
- [Akreditācijas datu koplietošana](./credentials-sharing.md) – Koplietot akreditācijas datus ar citiem lietotājiem
- [Portāls](./portal.md) – Publiskot workflow kā publiskas chat saskarnes
- [Vektoru krātuvju cilne](../tabs/vectorstores-tab.md) – Izveidot vektoru krātuves RAG mezgliem

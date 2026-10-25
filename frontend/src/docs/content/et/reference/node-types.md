# Sõlmede tüübid

Heym pakub mitmesuguseid sõlmede tüüpe workflow'de loomiseks. Kasutage sõlmede konfiguratsioonis [avaldised](./expression-dsl.md), nagu `$input.text` ja `$nodeLabel.field`.

## Trigger-sõlmed

| Sõlm | Kirjeldus | Väljundid |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Workflow tekstisisestuspunkt (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Käivitamine ajakava alusel (cron-avaldis) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Käivitamine, kui saabub Telegrami boti webhooki uuendus | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Käivitamine, kui Slack saadab Events API webhooki | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Käivitamine, kui Discord saadab rakenduse interaktsiooni webhooki | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Käivitamine, kui IMAP-postkasti saabub uus e-kiri | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Käivitamine, kui Heym avaldab platvormi sündmuse (pakendatud massiiv) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Käivitamine väljuvast ühendusest välisele WebSocket-serverile | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Ühekordse üleslaadimislingi loomine ja käivitamine, kui suur fail on üles laaditud | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Käivitamine, kui järjekorrast saabub sõnum | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Käivitamine, kui mõni sõlm annab vea (siseneva servata) | 1 |

Kõigi sisestuspunktide kohta vt [Triggerid](./triggers.md).

## AI-sõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Teksti töötlemine keelemudeliga | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Otsustusmudelilt tüübistatud küsimuste küsimine ja harude loomine tagastatud tõenäosuste alusel | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM koos tööriistade kutsumise, oskuste, MCP, valikulise [inimülevaatuse](./human-in-the-loop.md) ja valikulise [püsiva mälugraafiga](./agent-persistent-memory.md). Vt [Agendi arhitektuur](./agent-architecture.md). | 1 | 1, pluss valikuline `review` väljund |
| [Codex](../nodes/codex-node.md) | Kohaliku Codex CLI käivitamine GitHubi hoidla vastu, kasutades ChatGPT/Codex juurdepääsu tokenit | 1 | 1, pluss `question` väljund |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode CLI käivitamine GitHubi hoidla vastu karastatud konteineris, kasutades OpenCode Go gateway API võtit | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Konkreetse MCP-tööriista otsene kutsumine ilma LLM-i valikuta | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | RAG-i jaoks Qdranti või Postgres (pgvector) [vektorhoidlasse](../tabs/vectorstores-tab.md) sisestamine, upsert, kustutamine või otsimine (vektor- või hübriidvektor + BM25) | 1 | 1 |

## Loogikasõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Harundamine if/else alusel | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Suunamine väärtuse sobitamisega juhtumitele | 1 | n |
| [Merge](../nodes/merge-node.md) | Mitme sisendi ootamine ja ühendamine | n | 1 |
| [Loop](../nodes/loop-node.md) | Massiivi läbimine | 1 | 2 (loop/done) |

## Andmesõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Andmete teisendamine ja kaardistamine | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Andmete teisendamine formaatide vahel (CSV, JSON, XML) ning piltide või PDF-ide OCR tekstiks | 1 | 1 |
| [Code](../nodes/code-node.md) | Pythoni käivitamine ühekordses, võrgust isoleeritud liivakastis, millel on oma requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Muutuja määramine või hankimine (workflow-kohalik või [globaalne](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Teise workflow kutsumine | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Heymi workflow'de ja käivituste ajaloo lugemine | 1 | 1 |
## Integratsioonisõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP-päringute tegemine (cURL) | 0 või 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Ühenduse loomine välise WebSocketiga ja ühe sõnumi saatmine | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegrami boti sõnumite saatmine | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slacki sõnumite saatmine | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discordi webhook-sõnumite saatmine | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | E-kirjade saatmine SMTP kaudu | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-operatsioonid (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Gristi arvutustabelite lugemine/kirjutamine | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Hoidlate, kasutajate, probleemide, pull request'ide, ülevaatuste, väljalasete, Actions workflow'de ja failide haldamine GitHubi REST API kaudu | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira projektide, probleemide, kommentaaride, manuste, kasutajate, teavituste ja workflow' üleminekute haldamine Jira REST API kaudu | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Linear tiimide, projektide, probleemide, workflow' olekute ja kommentaaride haldamine GraphQL kaudu | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheetsi lugemine/kirjutamine OAuth2 kaudu | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive'i failide loetlemine, allalaadimine, uuendamine ja kustutamine OAuth2 kaudu | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | SQL-päringute käivitamine ja ridade lisamine BigQuery's | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Supabase'i tabelite pärimine ja muutmine PostgREST kaudu | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | SQL-, CRUD- ja loendusoperatsioonide käivitamine ClickHouse'i vastu | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notioni andmebaaside, andmeallikate, lehtede ja plokkide haldamine | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry organisatsioonide, projektide, tiimide, probleemide, sündmuste ja väljalasete haldamine | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Ämbrite ja kaustade haldamine; objektide loetlemine, üleslaadimine, allalaadimine, kopeerimine ja kustutamine | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heymi andmetabelite (esmase osapoole salvestus) lugemine/kirjutamine | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive'i failide haldamine: kustutamine, parooli seadmine, TTL, maksimaalsed allalaadimised, tiimiga jagamine/jagamise lõpetamine | 1 | 1 |

## Automatiseerimissõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Veebilehtede kraapimine FlareSolverriga | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Brauseri automatiseerimine AI-sammuga ja Auto Heal'iga | 1 | 1 |

## Utiliitide sõlmed

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Täitmise viivitamine | 1 | 1 |
| [Output](../nodes/output-node.md) | Väljundi endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Väljade vastendamine JSON-objektile; ainus terminal = ülatasemel webhook'i/käivituse keha | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | HTML-lehe renderdamine; ainus terminal = webhook vastab text/html-iga | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminali armatuurlaua vidina väljund, mis vastendab ülesvoolu read diagrammi payload'ideks | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Markdown-märkmete lisamine lõuendile (ei käivitata) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Logimine taustaprogrammi konsooli | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Teise sõlme keelamine workflow's | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Keelatud sõlme lubamine workflow's | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Workflow' peatamine veavastusega | 1 | 0 |

## Plugina sõlmed

Plugina sõlmed on loodud instantsile paigaldatud pluginatega. Iga paigaldatud
plugin kuvatakse paletis jaotise **Plugins** all oma nimega; sisemiselt
vastendub see ühele kahest sõlmetüübist.

| Sõlm | Kirjeldus | Sisendid | Väljundid |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Paigaldatud plugina pakutav kohandatud toiming | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Paigaldatud plugina pakutav kohandatud trigger | 0 | 1 |
## Seotud

- [Lõuendi funktsioonid](./canvas-features.md) – Andmete kinnitamine, käivituste logid, lubamine/keelamine, alam-workflow'ks eraldamine
- [Agendi sõlm](../nodes/agent-node.md) – AI-agendi sõlme üksikasjalik viide
- [Agendi arhitektuur](./agent-architecture.md) – Alam-agendid, orkestraator, oskused, MCP, tööriistade kutsumine
- [Agendi püsiv mälu](./agent-persistent-memory.md) – Sõlmedepõhine teadmiste graaf, jagamine ja taustapõhine eraldamine
- [Inimene tsüklis](./human-in-the-loop.md) – Agendi väljundi peatamine inimkinnituse saamiseks
- [Avaldise DSL](./expression-dsl.md) – Andmetele viitamine sõlme konfiguratsioonis
- [Avaldise hindamise dialoog](./expression-evaluation-dialog.md) – Laiendatav redaktor koos reaalajas backendi eelvaatega
- [Faili üleslaadimise trigger](../nodes/file-upload-trigger-node.md) – Suurte mitmeosaliste üleslaadimiste vastuvõtmine ühekordsete linkide kaudu
- [WebSocket trigger](../nodes/websocket-trigger-node.md) – Reaalajas väljuv socket trigger
- [WebSocket saatmine](../nodes/websocket-send-node.md) – Sõnumite saatmine välistele socketitele
- [Workflow struktuur](./workflow-structure.md) – Sõlmede ja servade JSON-vorming
- [Triggerid](./triggers.md) – Kõik workflow'de sisendpunktid
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – API-võtmete lisamine LLM-, HTTP- ja teistele sõlmedele
- [Mandaatide jagamine](./credentials-sharing.md) – Mandaatide jagamine teiste kasutajatega
- [Portaal](./portal.md) – Workflow'de avalikustamine avalike chat-liidestena
- [Vektorhoidlate vahekaart](../tabs/vectorstores-tab.md) – Vektorhoidlate loomine RAG-sõlmede jaoks

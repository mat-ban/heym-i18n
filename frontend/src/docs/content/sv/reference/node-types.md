# Nodtyper

Heym tillhandahåller en mängd olika nodtyper för att bygga workflows. Använd [uttryck](./expression-dsl.md) som `$input.text` och `$nodeLabel.field` i nodkonfigurationen.

## Trigger-noder

| Nod | Beskrivning | Utdata |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Textens ingångspunkt för workflowet (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigga enligt ett schema (cron-uttryck) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigga när en Telegram-bot webhook-uppdatering anländer | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigga när Slack skickar en Events API-webhook | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigga när Discord skickar en application interaction-webhook | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigga när ett nytt e-postmeddelande anländer i en IMAP-brevlåda | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigga när Heym publicerar en plattformshändelse (batchad array) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigga från en utgående anslutning till en extern WebSocket-server | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Skapa en engångslänk för uppladdning och starta när en stor fil laddas upp | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigga när ett meddelande tas emot från en kö | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Körs när någon nod får ett fel (ingen inkommande kant) | 1 |

Se [Triggers](./triggers.md) för alla ingångspunkter.

## AI-noder

| Nod | Beskrivning | Indata | Utdata |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Bearbeta text med en språkmodell | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Ställ typade frågor till en beslutsmodell och förgrena baserat på sannolikheterna som returneras | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM med tool calling, skills, MCP, valfri [human review](./human-in-the-loop.md) och valfritt [persistent memory graph](./agent-persistent-memory.md). Se [Agent Architecture](./agent-architecture.md). | 1 | 1, plus valfri `review`-utdata |
| [Codex](../nodes/codex-node.md) | Kör det lokala Codex CLI mot ett GitHub-repositorium med en ChatGPT/Codex-åtkomsttoken | 1 | 1, plus `question`-utdata |
| [OpenCode Go](../nodes/opencode-go-node.md) | Kör OpenCode CLI mot ett GitHub-repositorium i en härdad container med en OpenCode Go gateway API-nyckel | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Anropa ett specifikt MCP-verktyg direkt utan att en LLM väljer det | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Infoga, upserta, ta bort eller sök i en Qdrant- eller Postgres (pgvector) [vector store](../tabs/vectorstores-tab.md) för RAG | 1 | 1 |

## Logiknoder

| Nod | Beskrivning | Indata | Utdata |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Förgrena baserat på if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Dirigera genom att matcha ett värde mot cases | 1 | n |
| [Merge](../nodes/merge-node.md) | Vänta på flera indata och slå samman | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterera över en array | 1 | 2 (loop/done) |

## Datanoder

| Nod | Beskrivning | Indata | Utdata |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformera och mappa data | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konvertera data mellan format (CSV, JSON, XML) och OCR-bearbeta bilder eller PDF:er till text | 1 | 1 |
| [Code](../nodes/code-node.md) | Kör Python i en engångssandbox isolerad från nätverket med egen requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Sätt eller hämta en variabel (workflow-lokal eller [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Anropa ett annat workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Läs Heym-workflows och körningshistorik | 1 | 1 |
## Integrationsnoder

| Nod | Beskrivning | Ingångar | Utgångar |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Utför HTTP-förfrågningar (cURL) | 0 eller 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Anslut till en extern WebSocket och skicka ett meddelande | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Skicka Telegram-botmeddelanden | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Skicka Slack-meddelanden | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Skicka Discord-webhookmeddelanden | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Skicka e-post via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-operationer (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Läs/skriv Grist-kalkylblad | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Hantera repositorier, användare, ärenden, pull requests, granskningar, releaser, Actions-workflows och filer via GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Hantera Jira-projekt, ärenden, kommentarer, bilagor, användare, aviseringar och workflow-övergångar via Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Hantera Linear-team, projekt, ärenden, workflow-tillstånd och kommentarer via GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Läs/skriv Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Lista, ladda ner, uppdatera och ta bort Google Drive-filer via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Kör SQL-frågor och infoga rader i BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Fråga och ändra Supabase-tabeller via PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Kör SQL-, CRUD- och count-operationer mot ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Hantera Notion-databaser, datakällor, sidor och block | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Hantera Sentry-organisationer, projekt, team, ärenden, händelser och releaser | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Hantera buckets och mappar; lista, ladda upp, ladda ner, kopiera och ta bort objekt | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Läs/skriv Heym DataTables (förstapartslagring) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Hantera Drive-filer: ta bort, ange lösenord, TTL, max antal nedladdningar, teamdelning/avdelning | 1 | 1 |

## Automationsnoder

| Nod | Beskrivning | Ingångar | Utgångar |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Skrapa webbsidor med FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Webbläsarautomatisering med AI-steg och Auto Heal | 1 | 1 |

## Verktygsnoder

| Nod | Beskrivning | Ingångar | Utgångar |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Fördröj körning | 1 | 1 |
| [Output](../nodes/output-node.md) | Utgångsendpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mappa fält till ett JSON-objekt; enda terminal = toppnivå för webhook/körnings-body | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Rendera en HTML-sida; enda terminal = webhook svarar med text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminal dashboard-widget-utgång som mappar uppströmsrader till chart-payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Lägg till markdown-anteckningar på canvasen (körs inte) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Logga till backend-konsolen | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Inaktivera en annan nod i workflowen | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Aktivera en inaktiverad nod i workflowen | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Stoppa workflowen med felrespons | 1 | 0 |

## Pluginnoder

Pluginnoder tillhandahålls av plugins som är installerade på instansen. Varje installerad
plugin visas i paletten under **Plugins** med sitt eget namn; under huven
mappas den till en av dessa två nodtyper.

| Nod | Beskrivning | Ingångar | Utgångar |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Anpassad åtgärd som tillhandahålls av en installerad plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Anpassad trigger som tillhandahålls av en installerad plugin | 0 | 1 |
## Relaterat

- [Canvas-funktioner](./canvas-features.md) – Data pin, körningsloggar, aktivera/inaktivera, extrahera till sub-workflow
- [Agent-nod](../nodes/agent-node.md) – Detaljerad referens för AI Agent-noden
- [Agent-arkitektur](./agent-architecture.md) – Sub-agenter, orkestrerare, skills, MCP, tool calling
- [Agentens beständiga minne](./agent-persistent-memory.md) – Kunskapsgraf per nod, delning och bakgrundsextrahering
- [Human-in-the-Loop](./human-in-the-loop.md) – Pausa agentutdata för mänskligt godkännande
- [Expression DSL](./expression-dsl.md) – Referera till data i nodkonfiguration
- [Dialog för utvärdering av uttryck](./expression-evaluation-dialog.md) – Utökningsbar editor med live-förhandsvisning från backend
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Ta emot stora multipart-uppladdningar via engångslänkar
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtidsutgående socket-trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Skicka meddelanden till externa sockets
- [Workflow-struktur](./workflow-structure.md) – JSON-format för noder och kanter
- [Triggers](./triggers.md) – Alla workflow-ingångspunkter
- [Fliken Credentials](../tabs/credentials-tab.md) – Lägg till API-nycklar för LLM, HTTP och andra noder
- [Delning av credentials](./credentials-sharing.md) – Dela credentials med andra användare
- [Portal](./portal.md) – Exponera workflows som publika chattgränssnitt
- [Fliken Vectorstores](../tabs/vectorstores-tab.md) – Skapa vector stores för RAG-noder

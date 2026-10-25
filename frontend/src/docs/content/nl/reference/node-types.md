# Knooppunttypen

Heym biedt een verscheidenheid aan knooppunttypen voor het bouwen van workflows. Gebruik [expressies](./expression-dsl.md) zoals `$input.text` en `$nodeLabel.field` in de configuratie van knooppunten.

## Trigger-knooppunten

| Knooppunt | Beschrijving | Uitvoer |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Tekstinvoerpunt voor de workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger volgens een schema (cron-expressie) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger wanneer een Telegram-bot webhook-update binnenkomt | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger wanneer Slack een Events API-webhook verzendt | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger wanneer Discord een application interaction-webhook verzendt | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger wanneer een nieuwe e-mail aankomt in een IMAP-mailbox | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger wanneer Heym een platformgebeurtenis publiceert (gegroepeerde array) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger vanuit een uitgaande verbinding naar een externe WebSocket-server | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genereer een eenmalige uploadlink en start wanneer een groot bestand wordt geüpload | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger wanneer een bericht uit een wachtrij wordt ontvangen | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Wordt uitgevoerd wanneer een knooppunt een fout geeft (geen inkomende rand) | 1 |

Zie [Triggers](./triggers.md) voor alle invoerpunten.

## AI-knooppunten

| Knooppunt | Beschrijving | Invoer | Uitvoer |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Verwerk tekst met een taalmodel | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Stel een beslissingsmodel getypte vragen en vertak op basis van de geretourneerde waarschijnlijkheden | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM met tool calling, skills, MCP, optionele [menselijke beoordeling](./human-in-the-loop.md) en optionele [persistente geheugengraaf](./agent-persistent-memory.md). Zie [Agent-architectuur](./agent-architecture.md). | 1 | 1, plus optionele `review`-uitvoer |
| [Codex](../nodes/codex-node.md) | Voer de lokale Codex CLI uit tegen een GitHub-repository met behulp van een ChatGPT/Codex-toegangstoken | 1 | 1, plus `question`-uitvoer |
| [OpenCode Go](../nodes/opencode-go-node.md) | Voer de OpenCode CLI uit tegen een GitHub-repository in een gehardende container met behulp van een OpenCode Go gateway-API-sleutel | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Roep een specifieke MCP-tool rechtstreeks aan zonder dat een LLM deze selecteert | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Invoegen, upserten, verwijderen of zoeken (vector of hybride vector + BM25) in een Qdrant- of Postgres (pgvector) [vectoropslag](../tabs/vectorstores-tab.md) voor RAG | 1 | 1 |

## Logica-knooppunten

| Knooppunt | Beschrijving | Invoer | Uitvoer |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Vertak op basis van if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Routeer door een waarde te matchen met cases | 1 | n |
| [Merge](../nodes/merge-node.md) | Wacht op meerdere invoeren en voeg samen | n | 1 |
| [Loop](../nodes/loop-node.md) | Itereer over een array | 1 | 2 (loop/done) |

## Data-knooppunten

| Knooppunt | Beschrijving | Invoer | Uitvoer |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformeer en map data | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Converteer data tussen formaten (CSV, JSON, XML) en OCR afbeeldingen of PDF's naar tekst | 1 | 1 |
| [Code](../nodes/code-node.md) | Voer Python uit in een wegwerpbare, netwerkgeïsoleerde sandbox met een eigen requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Stel een variabele in of haal deze op (workflow-lokaal of [globaal](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Roep een andere workflow aan | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lees Heym-workflows en uitvoeringsgeschiedenis | 1 | 1 |

## Integratieknooppunten

| Knooppunt | Beschrijving | Ingangen | Uitgangen |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | HTTP-verzoeken uitvoeren (cURL) | 0 of 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Verbinden met een externe WebSocket en één bericht verzenden | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Telegram-botberichten verzenden | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Slack-berichten verzenden | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Discord-webhookberichten verzenden | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | E-mails verzenden via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-bewerkingen (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Grist-spreadsheets lezen/schrijven | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Repositories, gebruikers, issues, pull requests, reviews, releases, Actions-workflows en bestanden beheren via de GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Jira-projecten, issues, opmerkingen, bijlagen, gebruikers, meldingen en workflowtransities beheren via de Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Linear-teams, projecten, issues, workflowstatussen en opmerkingen beheren via GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets lezen/schrijven via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive-bestanden weergeven, downloaden, bijwerken en verwijderen via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | SQL-query's uitvoeren en rijen invoegen in BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Supabase-tabellen opvragen en wijzigen via PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | SQL-, CRUD- en telbewerkingen uitvoeren op ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Notion-databases, gegevensbronnen, pagina's en blokken beheren | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Sentry-organisaties, projecten, teams, issues, gebeurtenissen en releases beheren | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Buckets en mappen beheren; objecten weergeven, uploaden, downloaden, kopiëren en verwijderen | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Heym DataTables lezen/schrijven (first-party opslag) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Drive-bestanden beheren: verwijderen, wachtwoord instellen, TTL, maximaal aantal downloads, team delen/niet delen | 1 | 1 |

## Automatiseringsknooppunten

| Knooppunt | Beschrijving | Ingangen | Uitgangen |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Webpagina's scrapen met FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Browserautomatisering met AI-stap en Auto Heal | 1 | 1 |

## Hulpknooppunten

| Knooppunt | Beschrijving | Ingangen | Uitgangen |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Uitvoering vertragen | 1 | 1 |
| [Output](../nodes/output-node.md) | Uitgangsendpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Velden toewijzen aan een JSON-object; enige terminal = body van webhook/uitvoering op topniveau | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Een HTML-pagina renderen; enige terminal = webhook reageert met text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminale dashboardwidget-uitvoer die stroomopwaartse rijen omzet in chart-payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Markdown-notities toevoegen aan het canvas (wordt niet uitgevoerd) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Loggen naar de backend-console | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Een ander knooppunt in de workflow uitschakelen | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Een uitgeschakeld knooppunt in de workflow inschakelen | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Workflow stoppen met foutrespons | 1 | 0 |

## Plugin-knooppunten

Plugin-knooppunten worden geleverd door plugins die op de instantie zijn geïnstalleerd. Elke geïnstalleerde plugin verschijnt in het palet onder **Plugins** met een eigen naam; onder de motorkap wordt deze toegewezen aan een van deze twee knooppunttypen.

| Knooppunt | Beschrijving | Ingangen | Uitgangen |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Aangepaste actie geleverd door een geïnstalleerde plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Aangepaste trigger geleverd door een geïnstalleerde plugin | 0 | 1 |

## Gerelateerd

- [Canvas-functies](./canvas-features.md) – Data pin, uitvoeringslogboeken, in-/uitschakelen, extraheren naar sub-workflow
- [Agent-knooppunt](../nodes/agent-node.md) – Gedetailleerde referentie voor het AI Agent-knooppunt
- [Agent-architectuur](./agent-architecture.md) – Sub-agenten, orchestrator, skills, MCP, tool calling
- [Agent Persistent Memory](./agent-persistent-memory.md) – Kennisgraaf per knooppunt, delen en achtergrondextractie
- [Human-in-the-Loop](./human-in-the-loop.md) – Agent-uitvoer pauzeren voor menselijke goedkeuring
- [Expression DSL](./expression-dsl.md) – Verwijzen naar data in knooppuntconfiguratie
- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Grote multipart-uploads accepteren via eenmalige links
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtime uitgaande socket-trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Berichten pushen naar externe sockets
- [Workflow-structuur](./workflow-structure.md) – JSON-formaat voor knooppunten en verbindingen
- [Triggers](./triggers.md) – Alle workflow-entrypoints
- [Credentials Tab](../tabs/credentials-tab.md) – API-sleutels toevoegen voor LLM-, HTTP- en andere knooppunten
- [Credentials Sharing](./credentials-sharing.md) – Referenties delen met andere gebruikers
- [Portal](./portal.md) – Workflows beschikbaar stellen als openbare chat-UIs
- [Vectorstores Tab](../tabs/vectorstores-tab.md) – Vectoropslag aanmaken voor RAG-knooppunten

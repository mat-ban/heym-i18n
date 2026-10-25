# Node Typer

Heym tilbyder en række node typer til opbygning af workflows. Det er muligt at bruge [udtryk](./expression-dsl.md) som `$input.text` og `$nodeLabel.field` i node-konfigurationen.

## Trigger Nodes

| Node | Beskrivelse | Outputs |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Tekstindgangspunkt for workflowet (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger på en tidsplan (cron-udtryk) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger når en Telegram bot webhook-opdatering ankommer | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger når Slack sender en Events API webhook | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger når Discord sender en applikationsinteraktionswebhook | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger når en ny e-mail ankommer i en IMAP-mailboks | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger når Heym udgiver en platformbegivenhed (batch-array) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger fra en udgående forbindelse til en ekstern WebSocket-server | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Generer et engangs-uploadlink og start når en stor fil uploades | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger når en besked modtages fra en kø | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Kør når en node fejler (ingen indgående kant) | 1 |

Se [Triggers](./triggers.md) for alle indgangspunkter.

## AI Nodes

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Behandle tekst med en sprogmodel | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Stil typede spørgsmål til en beslutningsmodel og forgren baseret på de returnerede sandsynligheder | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM med tool calling, skills, MCP, valgfri [human review](./human-in-the-loop.md) og valgfri [persistent memory graph](./agent-persistent-memory.md). Se [Agent Architecture](./agent-architecture.md). | 1 | 1, plus valgfri `review` output |
| [Codex](../nodes/codex-node.md) | Kør den lokale Codex CLI mod et GitHub-repository ved hjælp af et ChatGPT/Codex access token | 1 | 1, plus `question` output |
| [OpenCode Go](../nodes/opencode-go-node.md) | Kør OpenCode CLI mod et GitHub-repository i en hærdet container ved hjælp af en OpenCode Go gateway API-nøgle | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Kald et specifikt MCP-værktøj direkte uden at en LLM vælger det | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Indsæt, opdater, slet eller søg (vektor eller hybrid vektor + BM25) i et Qdrant eller Postgres (pgvector) [vector store](../tabs/vectorstores-tab.md) for RAG | 1 | 1 |

## Logic Nodes

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Forgren baseret på if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Diriger ved at matche en værdi med cases | 1 | n |
| [Merge](../nodes/merge-node.md) | Vent på flere inputs og flet | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterer over et array | 1 | 2 (loop/done) |

## Data Nodes

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformer og map data | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Konverter data mellem formater (CSV, JSON, XML) og OCR billeder eller PDF'er til tekst | 1 | 1 |
| [Code](../nodes/code-node.md) | Kør Python i en engangsbrugt, netværksisoleret sandkasse med eget requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Sæt eller hent en variabel (workflow-lokal eller [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Kald et andet workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Læs Heym workflows og kørselshistorik | 1 | 1 |
## Integrationsnoder

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Udfør HTTP-forespørgsler (cURL) | 0 eller 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Opret forbindelse til en ekstern WebSocket og send én besked | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Send Telegram-botbeskeder | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Send Slack-beskeder | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Send Discord-webhookbeskeder | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Send e-mails via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Redis-operationer (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Læs/skriv Grist-regneark | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Håndter repositories, brugere, issues, pull requests, reviews, releases, Actions-workflows og filer via GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Håndter Jira-projekter, issues, kommentarer, vedhæftninger, brugere, notifikationer og workflow-overgange via Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Håndter Linear-teams, projekter, issues, workflow-tilstande og kommentarer via GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Læs/skriv Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | List, download, opdater og slet Google Drive-filer via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Kør SQL-forespørgsler og indsæt rækker i BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Forespørg og muter Supabase-tabeller via PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Udfør SQL, CRUD og tæloperationer mod ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Håndter Notion-databaser, datakilder, sider og blokke | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Håndter Sentry-organisationer, projekter, teams, issues, events og releases | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Håndter buckets og mapper; list, upload, download, kopier og slet objekter | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Læs/skriv Heym DataTables (first-party-lagring) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Håndter Drive-filer: slet, angiv adgangskode, TTL, maks. downloads, team del/del ikke | 1 | 1 |

## Automationsnoder

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Skrab websider med FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Browserautomatisering med AI-trin og Auto Heal | 1 | 1 |

## Hjælpenoder

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Forsink udførelse | 1 | 1 |
| [Output](../nodes/output-node.md) | Output-endpoint | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Map felter til et JSON-objekt; enkelt terminal = top-level webhook/run-body | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Gengiv en HTML-side; enkelt terminal = webhook svarer med text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Terminal-dashboard-widget-output der mapper upstream-rækker til chart-payloads | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Tilføj markdown-noter til canvas (udføres ikke) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Log til backend-konsol | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Deaktiver en anden node i workflowet | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Aktiver en deaktiveret node i workflowet | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Stop workflow med fejlsvar | 1 | 0 |

## Plugin-noder

Plugin-noder leveres af plugins installeret på instansen. Hvert installeret plugin vises i paletten under **Plugins** med eget navn; under overfladen mappes det til en af disse to nodetyper.

| Node | Beskrivelse | Inputs | Outputs |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Brugerdefineret handling leveret af et installeret plugin | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Brugerdefineret trigger leveret af et installeret plugin | 0 | 1 |
## Relateret

- [Canvas-funktioner](./canvas-features.md) – Data pin, kørselslogfiler, aktiver/deaktiver, ekstraher til under-workflow
- [Agent-node](../nodes/agent-node.md) – Detaljeret reference for AI Agent-noden
- [Agent-arkitektur](./agent-architecture.md) – Sub-agenter, orchestrator, færdigheder, MCP, tool calling
- [Agent-persistent hukommelse](./agent-persistent-memory.md) – Per-node vidensgraf, deling og baggrundsextraktion
- [Human-in-the-Loop](./human-in-the-loop.md) – Pause agent-output til menneskelig godkendelse
- [Expression DSL](./expression-dsl.md) – Referencer til data i nodekonfiguration
- [Expression Evaluation Dialog](./expression-evaluation-dialog.md) – Udvidelig editor med live backend-preview
- [File Upload Trigger](../nodes/file-upload-trigger-node.md) – Accepter store multipart-upload gennem engangslinks
- [WebSocket Trigger](../nodes/websocket-trigger-node.md) – Realtid outbound socket-trigger
- [WebSocket Send](../nodes/websocket-send-node.md) – Push beskeder til eksterne sockets
- [Workflow-struktur](./workflow-structure.md) – JSON-format for noder og kanter
- [Triggers](./triggers.md) – Alle workflow-indgangspunkter
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj API-nøgler til LLM, HTTP og andre noder
- [Delte legitimationsoplysninger](./credentials-sharing.md) – Del legitimationsoplysninger med andre brugere
- [Portal](./portal.md) – Eksponer workflows som offentlige chat-brugergrænseflader
- [Vektorlagre-fanen](../tabs/vectorstores-tab.md) – Opret vektorlagre til RAG-noder

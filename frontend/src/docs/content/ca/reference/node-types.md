# Tipus de Node

Heym ofereix una varietat de tipus de node per construir workflows. Utilitzeu [expressions](./expression-dsl.md) com `$input.text` i `$nodeLabel.field` a la configuració del node.

## Nodes Trigger

| Node | Descripció | Sortides |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Punt d'entrada de text per al workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger segons una programació (expressió cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger quan arriba una actualització de webhook d'un bot de Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger quan Slack envia un webhook de l'Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger quan Discord envia un webhook d'interacció d'aplicació | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger quan arriba un correu nou a una bústia IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger quan Heym publica un esdeveniment de plataforma (array per lots) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger des d'una connexió sortint a un servidor WebSocket extern | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genera un enllaç de pujada d'un sol ús i s'inicia quan es puja un fitxer gran | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger quan es rep un missatge d'una cua | 1 |
| [Error Handler](../nodes/error-handler-node.md) | S'executa quan qualsevol node falla (sense aresta d'entrada) | 1 |

Consulteu [Triggers](./triggers.md) per a tots els punts d'entrada.

## Nodes d'IA

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Processa text amb un model de llenguatge | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Pregunteu a un model de decisió qüestions tipades i ramifiqueu segons les probabilitats que retorna | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM amb crida d'eines, habilitats, MCP, [revisió humana](./human-in-the-loop.md) opcional i [graf de memòria persistent](./agent-persistent-memory.md) opcional. Vegeu [Agent Architecture](./agent-architecture.md). | 1 | 1, més una sortida `review` opcional |
| [Codex](../nodes/codex-node.md) | Executeu la CLI local de Codex contra un repositori de GitHub utilitzant un token d'accés de ChatGPT/Codex | 1 | 1, més una sortida `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Executeu la CLI d'OpenCode contra un repositori de GitHub en un contenidor endurit utilitzant una clau API de la passarel·la OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Crideu una eina MCP específica directament sense que un LLM la seleccioni | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Inseriu, actualitzeu, suprimiu o cerqueu (vectorial o híbrida vectorial + BM25) en un [vector store](../tabs/vectorstores-tab.md) de Qdrant o Postgres (pgvector) per a RAG | 1 | 1 |

## Nodes de lògica

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Ramifiqueu segons if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Encamineu fent coincidir un valor amb casos | 1 | n |
| [Merge](../nodes/merge-node.md) | Espereu múltiples entrades i fusiona-les | n | 1 |
| [Loop](../nodes/loop-node.md) | Itereu sobre un array | 1 | 2 (loop/done) |

## Nodes de dades

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformeu i mapeu dades | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Convertiu dades entre formats (CSV, JSON, XML) i feu OCR d'imatges o PDFs a text | 1 | 1 |
| [Code](../nodes/code-node.md) | Executeu Python en un sandbox d'un sol ús, aïllat de la xarxa, amb el seu propi requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Establiu o obteniu una variable (local del workflow o [global](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Crideu un altre workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Llegiu workflows de Heym i l'historial d'execucions | 1 | 1 |
## Nodes d'integració

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Realitzeu sol·licituds HTTP (cURL) | 0 o 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Connecteu-vos a un WebSocket extern i envieu un missatge | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Envieu missatges del bot de Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Envieu missatges de Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Envieu missatges de webhook de Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Envieu correus electrònics via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operacions de Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Llegiu/escrigueu fulls de càlcul de Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gestioneu repositoris, usuaris, incidències, sol·licituds d'extracció, revisions, versions, Workflows d'Actions i fitxers mitjançant l'API REST de GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gestioneu projectes, incidències, comentaris, fitxers adjunts, usuaris, notificacions i transicions de Workflow de Jira mitjançant l'API REST de Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gestioneu equips, projectes, incidències, estats de Workflow i comentaris de Linear mitjançant GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Llegiu/escrigueu Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Llisteu, descarregueu, actualitzeu i suprimiu fitxers de Google Drive via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Executeu consultes SQL i inseriu files a BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Consulteu i modifiqueu taules de Supabase mitjançant PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Executeu operacions SQL, CRUD i de recompte a ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gestioneu bases de dades, fonts de dades, pàgines i blocs de Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gestioneu organitzacions, projectes, equips, incidències, esdeveniments i versions de Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gestioneu buckets i carpetes; llisteu, pengeu, descarregueu, copieu i suprimiu objectes | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Llegiu/escrigueu Heym DataTables (emmagatzematge propi) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gestioneu fitxers de Drive: suprimiu, establiu contrasenya, TTL, descàrregues màximes, compartició/descompartició amb l'equip | 1 | 1 |

## Nodes d'automatització

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Extraieu contingut de pàgines web amb FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatització del navegador amb pas d'IA i Auto Heal | 1 | 1 |

## Nodes d'utilitat

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Retarda l'execució | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de sortida | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Assigneu camps a un objecte JSON; únic terminal = cos de nivell superior del webhook/execució | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderitzeu una pàgina HTML; únic terminal = el webhook respon amb text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Sortida de widget de tauler terminal que assigna files d'origen a Payloads de gràfic | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Afegiu notes markdown al llenç (no s'executa) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Registreu al console del backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Desactiveu un altre Node del Workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Activeu un Node desactivat del Workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Atureu el Workflow amb una resposta d'error | 1 | 0 |

## Nodes de connectors

Els Nodes de connectors els proporcionen els connectors instal·lats a la instància. Cada connector instal·lat apareix a la paleta sota **Plugins** amb el seu propi nom; internament s'assigna a un d'aquests dos tipus de Node.

| Node | Descripció | Entrades | Sortides |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Acció personalitzada proporcionada per un connector instal·lat | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalitzat proporcionat per un connector instal·lat | 0 | 1 |
## Relacionat

- [Funcions del Canvas](./canvas-features.md) – Data pin, registres d'execució, activar/desactivar, extreure a sub-workflow
- [Node Agent](../nodes/agent-node.md) – Referència detallada del Node Agent d'IA
- [Arquitectura de l'Agent](./agent-architecture.md) – Sub-agents, orquestrador, skills, MCP, crida d'eines
- [Memòria Persistent de l'Agent](./agent-persistent-memory.md) – Graf de coneixement per Node, compartició i extracció en segon pla
- [Human-in-the-Loop](./human-in-the-loop.md) – Pausar la sortida de l'agent per a l'aprovació humana
- [Expression DSL](./expression-dsl.md) – Referenciar dades a la configuració del Node
- [Diàleg d'Avaluació d'Expressions](./expression-evaluation-dialog.md) – Editor expandible amb previsualització en directe del backend
- [Trigger de Pujada de Fitxers](../nodes/file-upload-trigger-node.md) – Acceptar pujades multipart grans mitjançant enllaços d'un sol ús
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket de sortida en temps real
- [Enviament WebSocket](../nodes/websocket-send-node.md) – Enviar missatges a sockets externs
- [Estructura del Workflow](./workflow-structure.md) – Format JSON per a Nodes i arestes
- [Triggers](./triggers.md) – Tots els punts d'entrada del workflow
- [Pestanya de Credencials](../tabs/credentials-tab.md) – Afegir claus API per a LLM, HTTP i altres Nodes
- [Compartició de Credencials](./credentials-sharing.md) – Compartir credencials amb altres usuaris
- [Portal](./portal.md) – Exposar workflows com a interfícies de xat públiques
- [Pestanya de Vectorstores](../tabs/vectorstores-tab.md) – Crear vector stores per a Nodes RAG

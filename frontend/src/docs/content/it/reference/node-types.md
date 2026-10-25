# Tipi di Nodo

Heym fornisce una varietà di tipi di nodo per la creazione di workflow. Utilizzare [espressioni](./expression-dsl.md) come `$input.text` e `$nodeLabel.field` nella configurazione dei nodi.

## Nodi Trigger

| Nodo | Descrizione | Output |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Punto di ingresso testuale per il workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Trigger su pianificazione (espressione cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Trigger all'arrivo di un aggiornamento webhook di un bot Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Trigger quando Slack invia un webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Trigger quando Discord invia un webhook di interazione applicativa | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Trigger all'arrivo di una nuova email in una casella IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Trigger quando Heym pubblica un evento di piattaforma (array in batch) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Trigger da una connessione in uscita verso un server WebSocket esterno | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Genera un link di upload monouso e avvia quando viene caricato un file di grandi dimensioni | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Trigger alla ricezione di un messaggio da una coda | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Eseguito quando un nodo genera un errore (nessun edge in ingresso) | 1 |

Consultare [Trigger](./triggers.md) per tutti i punti di ingresso.

## Nodi IA

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Elabora testo con un modello linguistico | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Porre domande tipizzate a un modello decisionale e diramare in base alle probabilità restituite | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM con tool calling, skills, MCP, [revisione umana](./human-in-the-loop.md) opzionale e [grafo di memoria persistente](./agent-persistent-memory.md) opzionale. Consultare [Agent Architecture](./agent-architecture.md). | 1 | 1, più output `review` opzionale |
| [Codex](../nodes/codex-node.md) | Esegue la CLI Codex locale su un repository GitHub utilizzando un token di accesso ChatGPT/Codex | 1 | 1, più output `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Esegue la CLI OpenCode su un repository GitHub in un container hardened utilizzando una chiave API del gateway OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Chiama direttamente uno strumento MCP specifico senza che un LLM lo selezioni | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Inserisce, esegue upsert, elimina o ricerca (vettoriale o ibrida vettoriale + BM25) in un [archivio vettoriale](../tabs/vectorstores-tab.md) Qdrant o Postgres (pgvector) per il RAG | 1 | 1 |

## Nodi di Logica

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Dirama in base a if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Instrada confrontando un valore con dei casi | 1 | n |
| [Merge](../nodes/merge-node.md) | Attende più input e li unisce | n | 1 |
| [Loop](../nodes/loop-node.md) | Itera su un array | 1 | 2 (loop/done) |

## Nodi Dati

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Trasforma e mappa i dati | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Converte dati tra formati (CSV, JSON, XML) ed esegue OCR di immagini o PDF in testo | 1 | 1 |
| [Code](../nodes/code-node.md) | Esegue Python in una sandbox usa e getta, isolata dalla rete, con il proprio requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Imposta o recupera una variabile (locale al workflow o [globale](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Chiama un altro workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Legge i workflow Heym e la cronologia delle esecuzioni | 1 | 1 |

## Nodi di integrazione

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Eseguire richieste HTTP (cURL) | 0 o 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Connettersi a un WebSocket esterno e inviare un messaggio | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Inviare messaggi tramite bot Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Inviare messaggi su Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Inviare messaggi tramite webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Inviare email tramite SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operazioni Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Leggere e scrivere fogli di calcolo Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gestire repository, utenti, issue, pull request, review, release, workflow Actions e file tramite la GitHub REST API | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gestire progetti, issue, commenti, allegati, utenti, notifiche e transizioni di workflow Jira tramite la Jira REST API | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gestire team, progetti, issue, stati di workflow e commenti Linear tramite GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Leggere e scrivere su Google Sheets tramite OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Elencare, scaricare, aggiornare ed eliminare file su Google Drive tramite OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Eseguire query SQL e inserire righe in BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Interrogare e modificare tabelle Supabase tramite PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Eseguire operazioni SQL, CRUD e di conteggio su ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gestire database, origini dati, pagine e blocchi Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gestire organizzazioni, progetti, team, issue, eventi e release Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gestire bucket e cartelle; elencare, caricare, scaricare, copiare ed eliminare oggetti | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Leggere e scrivere sulle Tabelle dati Heym (storage first-party) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gestire i file Drive: eliminazione, impostazione password, TTL, numero massimo di download, condivisione e rimozione condivisione con il team | 1 | 1 |

## Nodi di automazione

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Eseguire scraping di pagine web con FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automazione del browser con step IA e Auto Heal | 1 | 1 |

## Nodi di utilità

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Ritardare l'esecuzione | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint di output | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mappare i campi su un oggetto JSON; unico terminale = body di primo livello del webhook o dell'esecuzione | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Renderizzare una pagina HTML; unico terminale = il webhook risponde con text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Output terminale per widget di dashboard che mappa le righe a monte in payload per grafici | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Aggiungere note markdown al canvas (non eseguito) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Registrare log sulla console del backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Disabilitare un altro nodo nel workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Abilitare un nodo disabilitato nel workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Interrompere il workflow con una risposta di errore | 1 | 0 |

## Nodi dei plugin

I nodi dei plugin sono forniti dai plugin installati sull'istanza. Ogni plugin
installato compare nella palette sotto **Plugins** con il proprio nome; a livello
interno corrisponde a uno di questi due tipi di nodo.

| Nodo | Descrizione | Input | Output |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Azione personalizzata fornita da un plugin installato | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalizzato fornito da un plugin installato | 0 | 1 |

## Correlati

- [Funzionalità del Canvas](./canvas-features.md) – Data pin, log di esecuzione, abilitazione/disabilitazione, estrazione in sub-workflow
- [Nodo Agent](../nodes/agent-node.md) – Riferimento dettagliato per il Nodo AI Agent
- [Architettura dell'Agent](./agent-architecture.md) – Sub-agent, orchestrator, skills, MCP, tool calling
- [Memoria Persistente dell'Agent](./agent-persistent-memory.md) – Grafo di conoscenza per nodo, condivisione ed estrazione in background
- [Human-in-the-Loop](./human-in-the-loop.md) – Sospendere l'output dell'agent per l'approvazione umana
- [Expression DSL](./expression-dsl.md) – Riferimento ai dati nella configurazione dei nodi
- [Dialogo di Valutazione delle Espressioni](./expression-evaluation-dialog.md) – Editor espandibile con anteprima live del backend
- [Trigger di Caricamento File](../nodes/file-upload-trigger-node.md) – Accettare caricamenti multipart di grandi dimensioni tramite link monouso
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger socket in uscita in tempo reale
- [WebSocket Send](../nodes/websocket-send-node.md) – Inviare messaggi a socket esterni
- [Struttura del Workflow](./workflow-structure.md) – Formato JSON per nodi e archi
- [Trigger](./triggers.md) – Tutti i punti di ingresso del workflow
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere API key per LLM, HTTP e altri nodi
- [Condivisione delle Credenziali](./credentials-sharing.md) – Condividere le credenziali con altri utenti
- [Portale](./portal.md) – Esporre i workflow come interfacce chat pubbliche
- [Scheda Archivi vettoriali](../tabs/vectorstores-tab.md) – Creare archivi vettoriali per i nodi RAG

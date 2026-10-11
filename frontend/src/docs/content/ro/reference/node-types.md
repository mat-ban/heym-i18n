# Tipuri de noduri

Heym oferă o varietate de tipuri de noduri pentru construirea fluxurilor de lucru. Utilizați [expresii](./expression-dsl.md) precum `$input.text` și `$nodeLabel.field` în configurația nodurilor.

## Noduri Trigger

| Nod | Descriere | Ieșiri |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Punct de intrare text pentru fluxul de lucru (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Declanșare conform unui program (expresie cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Declanșare când sosește o actualizare webhook de la un bot Telegram | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Declanșare când Slack trimite un webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Declanșare când Discord trimite un webhook de interacțiune cu aplicația | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Declanșare când sosește un email nou într-o cutie poștală IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Declanșare când Heym publică un eveniment de platformă (matrice în loturi) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Declanșare dintr-o conexiune de ieșire către un server WebSocket extern | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Generați un link de încărcare de unică folosință și porniți când este încărcat un fișier mare | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Declanșare când se primește un mesaj dintr-o coadă | 1 |
| [Error Handler](../nodes/error-handler-node.md) | Rulați când orice nod întâmpină o eroare (fără muchie de intrare) | 1 |

Consultați [Triggers](./triggers.md) pentru toate punctele de intrare.

## Noduri AI

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Procesați text cu un model lingvistic | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Adresați întrebări tipizate unui model de decizie și ramificați pe baza probabilităților returnate | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM cu apelare de unelte, competențe, MCP, [revizuire umană](./human-in-the-loop.md) opțională și [graf de memorie persistentă](./agent-persistent-memory.md) opțional. Consultați [Agent Architecture](./agent-architecture.md). | 1 | 1, plus ieșirea opțională `review` |
| [Codex](../nodes/codex-node.md) | Rulați CLI-ul Codex local împotriva unui depozit GitHub folosind un token de acces ChatGPT/Codex | 1 | 1, plus ieșirea `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Rulați CLI-ul OpenCode împotriva unui depozit GitHub într-un container securizat folosind o cheie API de gateway OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Apelați direct un instrument MCP specific fără ca un LLM să îl selecteze | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Inserați, actualizați, ștergeți sau căutați într-un [vector store](../tabs/vectorstores-tab.md) Qdrant sau Postgres (pgvector) pentru RAG | 1 | 1 |

## Noduri de logică

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Ramificați pe baza if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Direcționați prin potrivirea unei valori cu cazuri | 1 | n |
| [Merge](../nodes/merge-node.md) | Așteptați multiple intrări și îmbinați | n | 1 |
| [Loop](../nodes/loop-node.md) | Iterați peste o matrice | 1 | 2 (loop/done) |

## Noduri de date

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transformați și mapați date | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Convertiți date între formate (CSV, JSON, XML) și aplicați OCR pe imagini sau PDF-uri pentru a obține text | 1 | 1 |
| [Code](../nodes/code-node.md) | Rulați Python într-un sandbox de unică folosință, izolat de rețea, cu propriul fișier requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Setați sau obțineți o variabilă (locală fluxului de lucru sau [globală](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Apelați un alt flux de lucru | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Citiți fluxurile de lucru Heym și istoricul execuțiilor | 1 | 1 |
## Noduri de integrare

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Efectuați cereri HTTP (cURL) | 0 sau 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Conectați-vă la un WebSocket extern și trimiteți un mesaj | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Trimiteți mesaje prin botul Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Trimiteți mesaje Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Trimiteți mesaje prin webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Trimiteți e-mailuri prin SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Operațiuni Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Citiți/scrieți foi de calcul Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gestionați depozite, utilizatori, issues, pull requests, recenzii, releases, workflow-uri Actions și fișiere prin API-ul REST GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gestionați proiecte, issues, comentarii, atașamente, utilizatori, notificări și tranziții de workflow Jira prin API-ul REST Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gestionați echipe, proiecte, issues, stări de workflow și comentarii Linear prin GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Citiți/scrieți Google Sheets prin OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Listați, descărcați, actualizați și ștergeți fișiere Google Drive prin OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Rulați interogări SQL și inserați rânduri în BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Interogați și modificați tabele Supabase prin PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Rulați operațiuni SQL, CRUD și de numărare pe ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gestionați baze de date, surse de date, pagini și blocuri Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gestionați organizații, proiecte, echipe, issues, evenimente și releases Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gestionați bucket-uri și foldere; listați, încărcați, descărcați, copiați și ștergeți obiecte | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Citiți/scrieți Heym DataTables (stocare first-party) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gestionați fișiere Drive: ștergere, setare parolă, TTL, număr maxim de descărcări, partajare/revocare partajare cu echipa | 1 | 1 |

## Noduri de automatizare

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Extrageți conținutul paginilor web cu FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatizare browser cu pas AI și Auto Heal | 1 | 1 |

## Noduri utilitare

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Întârziați execuția | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de ieșire | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapare câmpuri într-un obiect JSON; singurul terminal = corpul webhook/run de nivel superior | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Randare pagină HTML; singurul terminal = webhook-ul răspunde cu text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Ieșire terminală de widget pentru dashboard care mapează rândurile din amonte în payload-uri de grafic | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Adăugați note markdown pe canvas (nu se execută) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Înregistrați în consola backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Dezactivați un alt nod din workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Activați un nod dezactivat din workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Opriți workflow-ul cu răspuns de eroare | 1 | 0 |

## Noduri de plugin

Nodurile de plugin sunt furnizate de plugin-urile instalate pe instanță. Fiecare plugin instalat
apare în paletă sub **Plugins** cu propriul nume; în esență
acesta se mapează la unul dintre aceste două tipuri de noduri.

| Nod | Descriere | Intrări | Ieșiri |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Acțiune personalizată furnizată de un plugin instalat | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personalizat furnizat de un plugin instalat | 0 | 1 |
## Resurse conexe

- [Funcționalități Canvas](./canvas-features.md) – Fixare date, jurnale de execuție, activare/dezactivare, extragere în sub-workflow
- [Nod Agent](../nodes/agent-node.md) – Referință detaliată pentru nodul AI Agent
- [Arhitectură Agent](./agent-architecture.md) – Sub-agenți, orchestrator, competențe, MCP, apelare de unelte
- [Memorie persistentă Agent](./agent-persistent-memory.md) – Graf de cunoștințe per nod, partajare și extragere în fundal
- [Human-in-the-Loop](./human-in-the-loop.md) – Întreruperea ieșirii agentului pentru aprobare umană
- [Expression DSL](./expression-dsl.md) – Referirea datelor în configurația nodului
- [Dialog de evaluare a expresiilor](./expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend
- [Trigger de încărcare fișiere](../nodes/file-upload-trigger-node.md) – Acceptarea încărcărilor multipart mari prin linkuri de unică folosință
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket de ieșire în timp real
- [Trimitere WebSocket](../nodes/websocket-send-node.md) – Trimiterea mesajelor către socketuri externe
- [Structura Workflow](./workflow-structure.md) – Format JSON pentru noduri și muchii
- [Triggers](./triggers.md) – Toate punctele de intrare ale workflow-ului
- [Fila Credentials](../tabs/credentials-tab.md) – Adăugarea cheilor API pentru LLM, HTTP și alte noduri
- [Partajare Credentials](./credentials-sharing.md) – Partajarea credențialelor cu alți utilizatori
- [Portal](./portal.md) – Expunerea workflow-urilor ca interfețe publice de chat
- [Fila Vectorstores](../tabs/vectorstores-tab.md) – Crearea de vector stores pentru nodurile RAG

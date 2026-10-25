# Set completo di funzionalità di Heym

Una panoramica completa di tutte le capacità di Heym. Ogni sezione descrive una funzionalità o un concetto in poche frasi.

---

## Per iniziare

### [Introduzione](../getting-started/introduction.md)

Heym è un'infrastruttura per l'esecuzione e la governance di agenti IA in produzione. Si possono costruire sistemi agentici su un canvas visuale ed eseguirli con sicurezza: orchestrare agenti, automatizzare processi aziendali, ispezionare ogni esecuzione e mantenere il controllo umano sulla propria infrastruttura. Supporta workflow visuali, nodi basati su IA ([LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), un [AI Assistant](./ai-assistant.md), integrazioni ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), email in ingresso tramite [IMAP Trigger](../nodes/imap-trigger-node.md), invio in uscita tramite [Send Email](../nodes/send-email-node.md)), pianificazione con [Cron](../nodes/cron-node.md) e portali chat [Portal](./portal.md) per gli utenti finali.

Si vedano anche [Concetti fondamentali](../getting-started/core-concepts.md), [Tipi di nodo](./node-types.md) e [Integrazioni di terze parti](./integrations.md).

### [Perché Heym](../getting-started/why-heym.md)

Perché Heym ripercorre il ciclo di vita dell'agente (build, orchestrate, run, observe, evaluate, control, expose) e mostra cosa gestisce un singolo runtime self-hosted in ciascuna fase. Sono trattati il nodo [LLM](../nodes/llm-node.md) e il [Nodo Agent](../nodes/agent-node.md) con tool calling, strumenti Python, connessioni [MCP](../tabs/mcp-tab.md), skills e orchestrazione multi-agente; trigger, retry e [distribuzione del carico](./cluster.md); [Esecuzioni](../tabs/traces-tab.md) con costo USD per esecuzione ed esportazione OpenTelemetry; [Valutazioni](../tabs/evals-tab.md); [checkpoint di revisione umana](./human-in-the-loop.md), guardrail, SSO e audit trail; e endpoint REST, MCP e Portal. La pagina si chiude con un confronto delle capacità rispetto a n8n, Zapier e Make.com.

Si vedano anche [Nodo Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) e [Architettura dell'agente](./agent-architecture.md).

### [Avvio rapido](../getting-started/quick-start.md)

Si può avviare il primo workflow in pochi minuti: creare un workflow dalla scheda [Workflows](../tabs/workflows-tab.md), aggiungere un nodo [Input](../nodes/input-node.md), un nodo [LLM](../nodes/llm-node.md) e un nodo [Output](../nodes/output-node.md), quindi collegarli. Configurare il nodo [LLM](../nodes/llm-node.md) con una credenziale e impostare `userMessage` su `$input.text`; utilizzare Run o l'[AI Assistant](./ai-assistant.md) per eseguire o generare workflow con linguaggio naturale.

Si abbina naturalmente a [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) e [Expression DSL](./expression-dsl.md).

### [Concetti fondamentali](../getting-started/core-concepts.md)

I workflow sono grafi orientati di nodi collegati da edge; l'esecuzione fluisce dai nodi trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) attraverso i nodi di elaborazione fino ai nodi [Output](../nodes/output-node.md). Ogni nodo ha un tipo, dati (configurazione) e input/output; gli edge definiscono il flusso dei dati. I nodi fanno riferimento ai dati a monte tramite espressioni [Expression DSL](./expression-dsl.md) come `$nodeLabel.field`; i nodi indipendenti vengono eseguiti automaticamente in [parallelo](./parallel-execution.md).

Si vedano anche [Trigger](./triggers.md), [Esecuzione parallela](./parallel-execution.md) e [Struttura del workflow](./workflow-structure.md).

### [Esecuzione e distribuzione](../getting-started/running-and-deployment.md)

Heym fornisce `run.sh` per lo sviluppo locale (database in Docker, backend FastAPI, frontend Vite) e `deploy.sh` per la produzione con Docker Compose. Entrambi utilizzano un file `.env`; le variabili principali includono `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` e `ALLOW_REGISTER`. Lo sviluppo viene eseguito su porte frontend e backend configurabili; la produzione serve l'API sotto `/api` attraverso il container frontend.

Si vedano anche [Sicurezza](./security.md), [Enterprise](./enterprise.md) e [Impostazioni](./user-settings.md).
### [Migrazione a Heym](../getting-started/migrate-to-heym.md)

Lo strumento AI Convert trasforma un workflow proveniente da un'altra piattaforma (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) o una descrizione in linguaggio naturale in un workflow Heym, trasmesso in streaming in tempo reale su un canvas e pronto per il [download e l'importazione](./download-import.md). Esegue un controllo di sicurezza IA, quindi genera il DSL con i limiti di input e di frequenza già applicati. Lo si può aprire all'indirizzo [heym.run/convert](https://heym.run/convert).

Si vedano anche [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md) e [AI Assistant](./ai-assistant.md).

---

## Nodi

### Trigger

#### [Input](../nodes/input-node.md)

Il nodo Input è il punto di ingresso per i workflow che ricevono dati dall'utente o dal chiamante API. Supporta campi di input singoli o multipli ed espone i metadati della richiesta (headers, query params). È possibile accedere ai campi del body tramite `$nodeLabel.body.fieldKey`, agli headers tramite `$nodeLabel.headers` e alla query tramite `$nodeLabel.query`.

Si abbina naturalmente a [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) e [Output](../nodes/output-node.md). Per i riferimenti al payload e l'accesso ai campi, si vedano [Expression DSL](./expression-dsl.md) e [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Il nodo Cron attiva un workflow secondo una pianificazione basata su un'espressione cron standard a cinque campi. Non è richiesto alcun input da parte dell'utente: il workflow viene eseguito automaticamente agli orari specificati (ad esempio ogni ora, ogni giorno, ogni 15 minuti). L'output è un evento di trigger privo di payload.

Si vedano anche [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) e [Execution History](./execution-history.md) per le esecuzioni pianificate e ritardate.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Il nodo IMAP Trigger esegue il polling di una casella di posta a intervalli configurabili in minuti e avvia un workflow per ogni nuova email rilevata. Restituisce headers analizzati, elenchi di mittenti e destinatari, corpi in testo semplice e HTML, metadati degli allegati e un timestamp di trigger. Lo si utilizza per il triage delle caselle di supporto, l'instradamento da casella di posta a [Slack](../nodes/slack-node.md) o flussi di approvazione guidati da email con [Human-in-the-Loop](./human-in-the-loop.md).

Si abbina a [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) e [Slack](../nodes/slack-node.md) per workflow di triage in ingresso e di risposta.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Il nodo Heym Trigger avvia un workflow quando Heym stesso pubblica un evento di piattaforma: `heym.started`, `workflow.created`, `workflow.updated` o `workflow.deleted`. La consegna è raggruppata: ogni evento pubblicato all'interno di una finestra di dispatch di cinque secondi arriva in un'unica esecuzione come `$nodeLabel.events`, sempre un array. Ogni evento viene acquisito tramite un vincolo univoco sul database, pertanto viene attivato esattamente una volta per ogni nodo sottoscrittore, indipendentemente dal numero di worker, container o macchine in esecuzione. Lo si utilizza per audit trail delle modifiche ai workflow, annunci di deploy e riepiloghi sullo stato dell'istanza.

Si abbina al nodo [Heym](../nodes/heym-node.md) per recuperare il workflow modificato e a [Loop](../nodes/loop-node.md) per agire una volta per evento.

#### [Heym](../nodes/heym-node.md)

Il nodo Heym legge i dati propri di Heym tramite tre operazioni: `listWorkflows` restituisce ogni workflow accessibile al proprietario con conteggi dei nodi e timestamp, `getWorkflow` restituisce la struttura di nodi e archi di un workflow e `getExecutionHistory` restituisce le voci della cronologia di esecuzione in ordine dal più recente, con filtri opzionali per stato, intervallo temporale e limite, insieme ai totali raggruppati per stato. I risultati sono limitati al proprietario del workflow in cui risiede il nodo, pertanto un'esecuzione avviata da cron, da un portale o da un evento restituisce gli stessi dati di un'esecuzione manuale. `getWorkflow` restituisce la configurazione completa dei nodi, il che rende possibile l'audit di un workflow alla ricerca di chiavi o token hardcoded; non espone nulla che il proprietario del workflow non possa già aprire nell'editor. Non è richiesta alcuna credenziale.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Il nodo WebSocket Trigger apre una connessione client in uscita verso un server WebSocket esterno e avvia il workflow su `onMessage`, `onConnected` o `onClosed`. Espone payload dei messaggi analizzati, stato di riconnessione, metadati di chiusura e l'URL del socket per le espressioni a valle.

Si abbina a [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) e [SSE Streaming](./sse-streaming.md) per integrazioni in tempo reale.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Il nodo Telegram Trigger riceve gli aggiornamenti del webhook del bot e avvia immediatamente il workflow. Espone il payload completo dell'aggiornamento, l'oggetto messaggio principale, le callback query, gli headers sanitizzati e un timestamp di trigger. Lo si utilizza per chatbot, assistenti IA in [Telegram](../nodes/telegram-node.md) e flussi guidati da pulsanti.

Si abbina a [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) e [Webhooks](./webhooks.md) per workflow guidati da bot.
#### [Slack Trigger](../nodes/slack-trigger-node.md)

Il nodo Slack Trigger riceve i webhook delle Slack Events API e avvia automaticamente un workflow dopo aver verificato la firma della richiesta. Espone il payload dell'evento e le intestazioni sanitizzate per il routing a valle, la classificazione basata su [LLM](../nodes/llm-node.md) e i flussi di risposta.

Si integra con [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) e [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Il nodo Discord Trigger riceve i webhook delle Discord Interactions API, verifica le firme Ed25519 con la credenziale `discord_trigger` selezionata e avvia il workflow. Espone il payload completo dell'interazione, i dati del comando, le intestazioni sanitizzate e i metadati del trigger per il routing a valle o le risposte.

Si integra con [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) e [Third-Party Integrations](./integrations.md).

#### [RabbitMQ](../nodes/rabbitmq-node.md)

Il nodo RabbitMQ invia o riceve messaggi da code e exchange RabbitMQ. Utilizzarlo per workflow guidati da messaggi ed elaborazione di eventi. La modalità di invio pubblica un messaggio con ritardo opzionale; la modalità di ricezione funge da [trigger](./triggers.md), pertanto il workflow si avvia all'arrivo di un messaggio. L'output include status, message_id e body.

Si integra con [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) e [Parallel Execution](./parallel-execution.md) per l'elaborazione guidata da eventi.

#### [Error Handler](../nodes/error-handler-node.md)

Il nodo Error Handler viene eseguito automaticamente quando un qualsiasi nodo del workflow fallisce. Non sono necessari archi in ingresso; viene attivato dal motore. L'output include il messaggio di errore, l'etichetta del nodo non riuscito, il tipo di nodo e il timestamp. Utilizzarlo per inviare notifiche tramite [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) o [Send Email](../nodes/send-email-node.md), registrare errori o restituire risposte di errore personalizzate.

In alternativa alla gestione degli errori sul canvas, un workflow può anche delegare i fallimenti a un workflow separato — vedere [Error Workflow](#error-workflow). Se il canvas contiene già un nodo Error Handler, il workflow di errore **non** viene richiamato (il gestore locale ha la precedenza).

Le destinazioni di notifica più comuni sono [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) e [Send Email](../nodes/send-email-node.md); i dettagli di esecuzione sono più facili da ispezionare in [Execution History](./execution-history.md).

### AI
#### [Nodo Agent](../nodes/agent-node.md)

Il nodo AI Agent è un nodo [LLM](../nodes/llm-node.md) con tool calling. Può eseguire tool Python, richiamare nodi collegati del canvas come tool, connettersi a server [MCP](../tabs/mcp-tab.md), utilizzare skills (file di istruzioni e script Python opzionali), agire come orchestratore che delega ad altri nodi agent e richiamare altri workflow come tool. L'output è disponibile come `$nodeLabel.text`. Un toggle opzionale **Extra Body** allega a ogni richiesta del ciclo di tool calling un oggetto JSON di parametri di richiesta specifici del provider; è disattivato per impostazione predefinita. Un toggle opzionale **Use Responses API** instrada le chiamate al modello dell'agent attraverso la Responses API, che preserva il reasoning del modello tra le chiamate ai tool, così un modello di reasoning mantiene la propria catena di pensiero lungo un ciclo multi-step; è disattivato per impostazione predefinita e funziona con OpenAI e con credenziali personalizzate.

I tool basati su nodi del canvas consentono a un agent di richiamare direttamente dal canvas i nodi di workflow configurati. Collegare un nodo supportato all'handle dei tool dell'agent, quindi contrassegnare campi specifici come forniti dall'agent tramite l'icona del bot. Tali campi diventano parametri del tool a runtime, mentre le credenziali e i campi non contrassegnati restano fissi nella configurazione del nodo.

La sezione Skills ora include **AI Build** per creare nuove skills, un'azione di modifica AI inline per le skills esistenti, il download ZIP per singola skill e un interruttore opzionale **Enable Drive files** per le skills che devono leggere file di Heym Drive a runtime. La modale Skill Builder trasmette in streaming una conversazione Chat sulla sinistra, accetta file drag-and-drop con ogni commento di fine-tune, mostra un'anteprima live in sola lettura dei file `SKILL.md` e `.py` generati sulla destra, può scaricare tale anteprima come ZIP e salva i file di fine-tune caricati come asset della skill tramite lo stesso flusso di ingestion ZIP utilizzato dai caricamenti manuali.

Con **[Agent Persistent Memory](./agent-persistent-memory.md)** abilitata, ogni nodo agent mantiene il proprio knowledge graph: i fatti vengono caricati nel system prompt quando non vuoti, e le esecuzioni riuscite attivano un merge in background di nuove entità e relazioni. I sub-agent utilizzano graph separati. È possibile **condividere** il graph di un agent con altri agent (dello stesso workflow o di altri) con accesso in sola lettura o in lettura/scrittura dalla finestra di dialogo del graph. Il controllo brain del canvas apre l'editor del graph.

I nodi agent possono anche entrare in modalità [Human-in-the-Loop](./human-in-the-loop.md). In questa modalità l'agent riceve un tool `request_human_review` e può mettersi in pausa in corrispondenza di specifici step che richiedono approvazione, creare un link di revisione pubblico monouso, esporre un ramo `review` del canvas per i flussi di notifica e attendere finché un revisore accetta, modifica o rifiuta il testo di revisione Markdown. Il campo HITL del nodo funge da linee guida di approvazione su quando richiedere l'intervento, mentre il riepilogo rivolto al revisore viene generato da ciascuna richiesta di revisione. Per i tool [MCP](../tabs/mcp-tab.md), Heym utilizza il modello per interpretare tali istruzioni scritte in `always`, `once` o `never`, così il linguaggio di approvazione in forma libera viene mappato a una policy di runtime concreta. L'esecuzione viene contrassegnata come `pending` e riprende dallo snapshot di esecuzione memorizzato una volta ricevuta la decisione, e la stessa esecuzione dell'agent può mettersi in pausa più di una volta se anche gli step successivi richiedono revisione.

I nodi agent comprimono automaticamente la cronologia dei messaggi accumulata quando si avvicina all'80% della finestra di contesto del modello. Il system prompt, il primo messaggio utente e il messaggio utente più recente vengono sempre preservati; tutto ciò che sta in mezzo viene riassunto utilizzando lo stesso modello e la stessa credenziale. Gli eventi di compressione sono visibili nel pannello Debug, nella [Cronologia esecuzioni](./execution-history.md) e nella scheda [Esecuzioni](../tabs/traces-tab.md).

Vedere anche [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) e [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Il nodo Codex esegue la CLI di OpenAI Codex all'interno di un workspace Heym isolato. Accetta una credenziale Codex (accedere con ChatGPT per utilizzare il proprio abbonamento senza costi API per token, oppure incollare un token di accesso), una credenziale GitHub, l'URL del repository, il branch di base, il prompt del task, la modalità di pubblicazione (`diff_only` o `draft_pr`), il nome del branch e il timeout. Il runner clona il repository in locale, passa il bundle di token ChatGPT o `CODEX_ACCESS_TOKEN` esclusivamente al processo Codex e restituisce un riepilogo strutturato, note di validazione, file modificati, diff, metadati di utilizzo e un URL opzionale di draft PR.

Quando Codex restituisce `needs_input`, il workflow si mette in pausa ed espone il branch `question`. Collegare tale branch a Slack, email o un altro nodo di notifica; il link pubblico di follow-up riprende lo snapshot dell'esecuzione salvata dopo l'invio della risposta. Il nodo Codex può inoltre essere collegato a un Agente IA come strumento, consentendo all'agente di delegare attività di coding; in qualità di strumento, un risultato `needs_input` viene restituito inline all'agente anziché mettere in pausa il workflow.

Vedere anche [GitHub](../nodes/github-node.md), [Credenziali](./credentials.md), [Condivisione delle credenziali](./credentials-sharing.md) e [Tipi di nodo](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Il nodo OpenCode Go esegue la CLI di OpenCode (Go) su un repository GitHub. L'isolamento segue il pattern di Codex: in locale viene eseguito come sottoprocesso host, mentre nelle distribuzioni Docker viene eseguito all'interno di un container sibling hardened che condivide il volume del workspace. Accetta una credenziale OpenCode Go (una chiave API del gateway con URL di base opzionale), una credenziale GitHub, l'URL del repository, il branch di base, il prompt del task, la modalità di pubblicazione, il nome del branch, il timeout e un modello `opencode-go/<model>` scelto da un elenco di modelli live e ricercabile (con fallback integrato). Heym esegue tutte le operazioni git/GitHub sull'host e non colloca mai il token GitHub all'interno della sandbox; OpenCode modifica esclusivamente i file su disco. Il nodo restituisce un riepilogo strutturato, note di validazione, file modificati, diff e un URL opzionale di pull request. Può essere collegato a un Agente IA come strumento.

Vedere anche [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credenziali](./credentials.md), [Condivisione delle credenziali](./credentials-sharing.md) e [Tipi di nodo](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Il nodo LLM elabora testo con un modello linguistico o genera immagini. Supporta la generazione di testo, la visione (input immagine), la generazione di immagini, l'output JSON strutturato, l'esecuzione nativa della Batch API del provider per endpoint OpenAI e OpenAI-compatibili supportati e un toggle opzionale **Use Responses API** che instrada la chiamata attraverso la Responses API anziché Chat Completions (disattivato per impostazione predefinita; funziona con OpenAI e credenziali personalizzate e non può essere combinato con la modalità Batch). Configurare credenziale, modello, messaggi di sistema e utente, temperatura e max token; utilizzare l'[Expression DSL](./expression-dsl.md) nei prompt. In modalità batch, `userMessage` deve risolversi in un array, il nodo emette un branch `batchStatus` con aggiornamenti di avanzamento e l'output finale include i risultati batch per singolo elemento. Un toggle opzionale **Extra Body** allega un oggetto JSON di parametri di richiesta specifici del provider (ad esempio `{"thinking": {"type": "disabled"}}`) a ciascuna chiamata API; è disattivato per impostazione predefinita. Le opzionali [Guardrails](./guardrails.md) bloccano contenuti non sicuri prima della chiamata.

Si abbina naturalmente a [Qdrant RAG](../nodes/rag-node.md), [Nodo Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) e [Finestra di valutazione delle espressioni](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Il nodo Decision pone a un modello decisionale domande tipizzate sullo stato dell'esecuzione e restituisce probabilità anziché testo discorsivo. Un campo **State** veicola ciò che il modello deve leggere — una singola espressione mantiene il proprio tipo, quindi `$input` invia l'oggetto anziché il suo testo — e un elenco di domande veicola i giudizi. Le domande si presentano in tre forme: **noul** risponde se una condizione è soddisfatta, **choice** seleziona un'opzione da un insieme definito dall'utente e restituisce la distribuzione completa, e **score** valuta lo stato lungo livelli ordinati e può collocarsi tra essi. Le risposte choice e score includono anche una confidenza, così uno [Switch](../nodes/switch-node.md) può instradare in base alla risposta mentre una [Condition](../nodes/condition-node.md) filtra in base al grado di certezza. **Generate with AI** redige il template dello stato e le righe delle domande a partire da una frase semplice, mentre **Custom request body** invia JSON scritto manualmente per un endpoint il cui contratto differisce. La risposta del provider viene trasmessa invariata e ciascuna chiamata è registrata in [Esecuzioni](../tabs/traces-tab.md).

Richiede una credenziale Decision Model; si abbina naturalmente a [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) e [Nodo Agent](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Il nodo RAG / Vector Store inserisce, esegue upsert, elimina e ricerca documenti in un archivio vettoriale per la generazione aumentata dal recupero. Un menu a tendina Database consente di selezionare il backend — **Qdrant** (server esterno) oppure **Postgres (pgvector)** (database di Heym, senza servizi esterni), con Qdrant come impostazione predefinita. Selezionare un archivio vettoriale dalla scheda [Vectorstores](../tabs/vectorstores-tab.md) e impostare l'operazione su insert, upsert, delete o search. Le operazioni di upsert e delete individuano un documento tramite un id univoco memorizzato all'interno del payload — un campo **Document ID Field** specifica il nome di tale campo (predefinito `doc_id`) e **Document ID** ne contiene il valore — cosicché il documento mantiene l'id già utilizzato dal sistema dell'utente: l'upsert sostituisce ogni punto corrispondente prima di memorizzare la nuova versione, mentre l'operazione di delete segnala se è stata trovata una corrispondenza. I metadati del documento accettano espressioni nei propri valori, pertanto `{"url": "$start.url"}` memorizza quanto prodotto dall'esecuzione. La ricerca supporta filtri sui metadati, **Hybrid Search** opzionale (somiglianza vettoriale fusa con la corrispondenza delle parole chiave BM25, in modo che termini esatti come ID e codici di errore vengano trovati accanto alle corrispondenze semantiche) e il reranking opzionale di Cohere, e restituisce un array di risultati con text, score, metadata, flag reranked e hybrid, e count, da utilizzare nei flussi [LLM](../nodes/llm-node.md) o [Agent Node](../nodes/agent-node.md).

I nodi downstream più comuni sono [LLM](../nodes/llm-node.md) e [Agent Node](../nodes/agent-node.md); la configurazione dell'archivio vettoriale è descritta in [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Il nodo MCP Call richiama direttamente uno strumento [MCP](../tabs/mcp-tab.md) specifico, senza che un LLM debba decidere quale strumento invocare. Lo si utilizza quando si sa esattamente quale strumento eseguire in fase di progettazione — per un'esecuzione deterministica e a singolo passaggio di uno strumento MCP all'interno di un workflow. Configurare una connessione (SSE, Streamable HTTP o stdio; stessi campi della connessione MCP del [Agent Node](../nodes/agent-node.md)), fare clic su **Fetch Tools** per popolare un menu a tendina, selezionare uno strumento e compilare i campi degli argomenti, generati automaticamente dallo schema di input dello strumento. Ogni argomento accetta un valore statico oppure un'[espressione DSL](./expression-dsl.md) come `$userInput.body.text`. Il risultato è disponibile come `$nodeLabel.result` (oggetto JSON se analizzabile, altrimenti stringa). Il nodo MCP Call non può essere collegato a un [Agent Node](../nodes/agent-node.md) come strumento del canvas.

Vedere anche [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) e [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Il nodo Condition dirama il workflow in base a un'espressione if/else. Dispone di due handle di output: uno per quando la condizione è vera e uno per quando è falsa. Utilizzare gli operatori di confronto e logici dell'[Expression DSL](./expression-dsl.md) nell'espressione della condizione; il nodo inoltra l'input al ramo selezionato.

Vedere anche [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) e [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Il nodo Switch indirizza l'esecuzione verso percorsi diversi confrontando un valore con i casi definiti. Configurare un'espressione da valutare e un elenco di valori di caso; ogni caso dispone di un handle di origine e un handle predefinito viene utilizzato per i valori non corrispondenti. L'input viene inoltrato al ramo corrispondente.

Utilizzare [Condition](../nodes/condition-node.md) per le diramazioni binarie e [Merge](../nodes/merge-node.md) per ricongiungere i percorsi instradati; le regole di corrispondenza sono descritte in [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Il nodo Merge attende più input paralleli e li combina in un unico output. Impostare il numero di input da attendere; il nodo produce un oggetto unificato una volta completati tutti i rami. Lo si utilizza per unire i risultati di rami paralleli prima di proseguire; non utilizzarlo quando i rami paralleli terminano in nodi Output separati.

Vedere anche [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) e [Output](../nodes/output-node.md) per la ricombinazione dei rami.

#### [Loop](../nodes/loop-node.md)

Il nodo Loop itera su un array, eseguendo i nodi downstream per ciascun elemento. Richiede una connessione di ritorno dall'ultimo nodo del corpo dell'iterazione per avanzare. All'interno del corpo del loop utilizzare `item`, `index`, `total`, `isFirst` e `isLast`; il loop dispone di output separati per il percorso di iterazione e per il percorso di completamento.

Si abbina a [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) e [Expression DSL](./expression-dsl.md) per workflow iterativi.

### Data
#### [Set](../nodes/set-node.md)

Il nodo Set trasforma e mappa i dati di input in un output personalizzato. Definire mappature chiave-valore in cui ciascun valore è un'espressione [Expression DSL](./expression-dsl.md). Utilizzarlo per maiuscole, sottostringhe, concatenazioni, numeri casuali e trasformazioni simili. Accedere all'output tramite chiave (ad es. `$setNode.keyName`). Quando è connesso a un agente come strumento nodo del canvas, i valori di mappatura possono essere contrassegnati come forniti dall'agente, in modo che l'agente li compili a runtime. Per richiamare altri workflow, utilizzare invece il nodo [Execute](../nodes/execute-node.md).

Vedere anche [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) e [Expression DSL](./expression-dsl.md).

#### [Converter](../nodes/converter-node.md)

Il nodo Converter converte i dati tra formati senza scrivere codice. Le conversioni testuali sono `csvToJson` (testo CSV in un array di oggetti riga, oppure array quando non è presente un'intestazione), `jsonToCsv` (un array di oggetti/righe in testo CSV), `xmlToJson` (testo XML in un oggetto) e `jsonToXml` (un oggetto in testo XML). Configurare la direzione di conversione e l'espressione di origine; le conversioni CSV utilizzano inoltre un delimitatore e la gestione dell'intestazione, e `jsonToCsv` può fissare un ordine esplicito delle colonne. Le virgolette, i delimitatori incorporati e le nuove righe incorporate seguono lo standard RFC 4180. Gli attributi XML utilizzano il prefisso `@`, il testo misto ad attributi utilizza `#text`, gli elementi ripetuti diventano array e l'espansione delle entità XML è disabilitata. Lo stesso nodo opera anche sui file archiviati. `imageToText` e `pdfToText` eseguono l'OCR di Tesseract, leggendo un file da Heym Drive (`$Upload.file.id` da un Trigger di caricamento file, il risultato di un nodo Drive o un file generato da un agente), selezionando automaticamente la lingua dallo script rilevato oppure utilizzando i codici specificati come `tur` o `eng+tur`, e normalizzando il testo in UTF-8 per impostazione predefinita, con normalizzazione NFC opzionale e set di caratteri più ristretti come `cp1254`. `fileConvert` riscrive un file archiviato in un altro formato, i documenti tramite pandoc e le immagini tramite Pillow, e salva il risultato come nuovo file su Drive senza modificare l'originale. Il risultato è disponibile come `$converterNode.result`, con `.language`, `.encoding`, `.page_count`, `.pages` e `.file` accanto ad esso per le esecuzioni OCR, e `.id`, `.filename` e `.download_url` per `fileConvert`.

Vedere anche [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) e [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Il nodo Code esegue il codice Python scritto dall'utente, con il proprio `requirements.txt`, in un container creato e distrutto a ogni esecuzione. Il codice definisce una funzione `main(params)` e restituisce qualsiasi valore serializzabile in JSON, che diventa `$codeNode.result`; tutto ciò che viene stampato è catturato separatamente come `$codeNode.logs`, e `$codeNode.install` indica quale strumento ha installato le dipendenze. I parametri sono configurati come oggetto JSON le cui espressioni `$` vengono risolte prima dell'esecuzione, e il codice vi accede tramite notazione con punto, come `params.user.name` o `params.orders[0].id`. Le dipendenze vengono installate con `uv`, con fallback a `pip` per i pacchetti che `uv` non è in grado di gestire, senza caching tra le esecuzioni; lasciare `requirements.txt` vuoto salta completamente l'installazione ed è molto più veloce. La fase di esecuzione non ha rete, a meno che `codeAllowNetwork` non sia attivato, mentre l'installazione delle dipendenze raggiunge sempre PyPI. Il sandbox viene eseguito come non-root con tutte le capability rimosse, un filesystem root di sola lettura, nessun socket Docker e nessun accesso ai segreti del backend, con un limite di 512 MB di memoria, una CPU, 256 processi, 120 secondi per l'installazione e 60 secondi per l'esecuzione. Docker è richiesto e non esiste una modalità di fallback: senza un daemon raggiungibile il nodo fallisce anziché eseguire il codice nel processo del backend.

#### [Variable](../nodes/variable-node.md)

Il nodo Variable imposta o aggiorna una variabile locale al workflow (`$vars.variableName`) o una [variabile globale](./global-variables.md) persistente (`$global.variableName`). Utilizzarlo per contatori, liste accumulate e stato condiviso. Configurare nome della variabile, espressione del valore, coercizione del tipo e se archiviare nello store globale. Le variabili di tipo array supportano `$array()` e `.add()`.

Si abbina a [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) e [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Il nodo Execute richiama un altro workflow (sub-workflow) e vi passa l'input. Specificare il workflow di destinazione tramite ID e fornire l'input tramite una singola espressione o mappature chiave-valore. L'output include workflow_id, status e outputs; utilizzarlo per logica riutilizzabile, non per la trasformazione dei dati (per questo utilizzare Set).

Vedere anche [Canvas Features](./canvas-features.md) per Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) e [Output](../nodes/output-node.md).

### Integrations
#### [HTTP](../nodes/http-node.md)

Il nodo HTTP esegue richieste HTTP utilizzando una configurazione in stile cURL. Può costituire il punto di avvio di un workflow (senza edge in ingresso) oppure ricevere input dai nodi a monte. La risposta è disponibile come status, headers e body (JSON analizzato quando applicabile). Utilizzare le [Credenziali](./credentials.md) per l'autenticazione Bearer o tramite header personalizzati.

Si integra con [Webhooks](./webhooks.md), [Credenziali](./credentials.md) e [Integrazioni di terze parti](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Il nodo WebSocket Send apre una connessione client in uscita, invia un singolo messaggio di tipo testo/JSON/binario e la chiude. Utilizzarlo per pubblicare l'output di un workflow verso sistemi realtime senza creare un endpoint socket ospitato su Heym.

Vedere anche [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) e [Integrazioni di terze parti](./integrations.md).

#### [Telegram](../nodes/telegram-node.md)

Il nodo Telegram invia un messaggio bot a una chat, un gruppo o un canale. Configurare una [credenziale](./credentials.md) Telegram, impostare `chatId` e comporre il `message` in uscita con espressioni [Expression DSL](./expression-dsl.md). Si integra naturalmente con [Telegram Trigger](../nodes/telegram-trigger-node.md) per workflow conversazionali e con [Error Handler](../nodes/error-handler-node.md) per gli avvisi agli operatori.

Vedere anche [Integrazioni di terze parti](./integrations.md) e [Credenziali](./credentials.md) per la configurazione e i pattern delle credenziali.

#### [Slack](../nodes/slack-node.md)

Il nodo Slack invia un messaggio a un canale Slack tramite un Incoming Webhook. Configurare una [credenziale](./credentials.md) Slack e un'espressione per il messaggio. Utilizzarlo per notifiche, avvisi e segnalazione di errori; l'output viene propagato dall'input.

Si integra con [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integrazioni di terze parti](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Il nodo Discord invia un messaggio a un canale Discord tramite un Incoming Webhook. Configurare una [credenziale](./credentials.md) Discord, comporre il messaggio in uscita con [Expression DSL](./expression-dsl.md) e, facoltativamente, impostare override per username o avatar del webhook.

Si integra con [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integrazioni di terze parti](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Il nodo Send Email invia email tramite SMTP. Configurare una [credenziale](./credentials.md) SMTP ed espressioni [Expression DSL](./expression-dsl.md) per destinatario/i, oggetto e corpo. Utilizzarlo per notifiche, avvisi ed email transazionali. L'output include status, to e subject.

L'[IMAP Trigger](../nodes/imap-trigger-node.md) completa Send Email gestendo la posta in ingresso. Insieme consentono a un workflow di leggere email in arrivo da una casella condivisa, riassumerle o classificarle con i nodi IA e inviare un messaggio di follow-up o di escalation. Il [Telegram Trigger](../nodes/telegram-trigger-node.md) e il [nodo Telegram](../nodes/telegram-node.md) forniscono lo stesso pattern in ingresso/uscita per workflow conversazionali basati su bot.

Per flussi di notifica bidirezionali, si integra inoltre bene con [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md) e [Integrazioni di terze parti](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Il nodo Redis esegue operazioni Redis: set, get, hasKey e deleteKey. Utilizzarlo per caching, rate limiting e archiviazione chiave-valore. Configurare una [credenziale](./credentials.md), il tipo di operazione, l'espressione della chiave e, per le operazioni di set, il valore e il TTL facoltativo. L'output varia in base all'operazione (value, success, exists, deleted).

Si integra con [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) e [Parallel Execution](./parallel-execution.md) per caching, throttling e coordinamento.

#### [Grist](../nodes/grist-node.md)

Il nodo Grist legge, scrive e gestisce dati nei fogli di calcolo Grist. Le operazioni includono getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables e listColumns. Fornire l'ID del documento, l'ID della tabella e, per le operazioni di creazione/aggiornamento, i dati del record utilizzando gli ID delle colonne. Utilizzarlo per CRUD, aggiornamenti batch e automazione dei fogli di calcolo.

Vedere anche [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) e [Integrazioni di terze parti](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Il nodo Google Sheets legge, scrive e gestisce dati dei fogli di calcolo tramite OAuth2. Utilizzarlo per leggere report, aggiungere risultati di workflow, aggiornare tracker e svuotare o ispezionare le schede dei fogli dall'interno di un workflow. Come [BigQuery](../nodes/bigquery-node.md), utilizza una credenziale di integrazione basata su Google e si colloca bene accanto a [Grist](../nodes/grist-node.md) quando i dati dei fogli di calcolo fanno parte del flusso.

Si integra con [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) e [Integrazioni di terze parti](./integrations.md).
#### [BigQuery](../nodes/bigquery-node.md)

Il nodo BigQuery esegue query SQL e inserisce righe nei dataset di Google BigQuery tramite OAuth2. È utile per workflow di analisi, pipeline di reportistica e per la scrittura di dati di eventi strutturati generati dalle esecuzioni dei workflow. Spesso viene abbinato a [Set](../nodes/set-node.md) per la strutturazione delle righe e a [Google Sheets](../nodes/google-sheets-node.md) per una reportistica più leggera orientata ai fogli di calcolo.

Si abbina a [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) e [Third-Party Integrations](./integrations.md).

#### [Google Drive](../nodes/google-drive-node.md)

Il nodo Google Drive elenca, scarica, aggiorna ed elimina file e cartelle di Drive tramite OAuth2 e, con l'operazione `syncToHeymDrive`, può copiare direttamente un file di Drive in [Heym Drive](../nodes/drive-node.md). Google Docs, Sheets e Slides non dispongono di byte scaricabili, pertanto il nodo li esporta automaticamente — Docs in PDF, Sheets in XLSX, Slides in PPTX — con la possibilità di sovrascrivere il formato di destinazione. Le eliminazioni spostano gli elementi nel cestino di Drive, a meno che non sia abilitata l'opzione "Delete permanently"; inoltre, il nodo rifiuta di eliminare una cartella tramite l'operazione sui file e viceversa. Come [Google Sheets](../nodes/google-sheets-node.md), utilizza una credenziale OAuth2 supportata da Google; si noti che questa richiede l'accesso completo a Drive, pertanto si consiglia di consultare [Credential Sharing](./credentials-sharing.md) prima di condividerla.

Si abbina a [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) e [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Il nodo GitHub fornisce 40 azioni REST native di GitHub che coprono repository, organizzazioni e utenti, issue, pull request, review, release, workflow di Actions, insight sul traffico e file dei repository. Lo si utilizza per la gestione delle issue, l'automazione delle review, il dispatch dei workflow e l'attesa del completamento, l'automazione delle release e l'aggiornamento dei file dei repository senza dover costruire manualmente le richieste HTTP. Supporta GitHub.com e, facoltativamente, il `base_url` di GitHub Enterprise sulla credenziale.

Si abbina a [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) e [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Il nodo Jira connette i workflow alle API REST di Jira Cloud o Jira Data Center / Server per l'automazione di progetti, issue, commenti, allegati, utenti, notifiche e transizioni. Può elencare i progetti, cercare le issue con JQL, creare o aggiornare le issue, ispezionare i changelog, notificare gli stakeholder, gestire commenti e allegati, recuperare o gestire gli utenti, elencare le transizioni disponibili e spostare le issue tramite un ID di transizione. Utilizzare una credenziale Jira con email Atlassian, API token, URL di base del sito e modalità di deployment.

Si abbina a [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) e [Third-Party Integrations](./integrations.md) per l'acquisizione delle richieste di supporto, la gestione dei bug e i workflow di rilascio.

#### [Linear](../nodes/linear-node.md)

Il nodo Linear connette i workflow all'API GraphQL di Linear per l'automazione di workspace e issue. Può elencare team, progetti, issue, stati dei workflow, membri del team e commenti; creare, aggiornare, eliminare e collegare le issue; nonché creare, aggiornare, risolvere, riaprire o eliminare i commenti. Utilizzare una API key personale di Linear o una credenziale OAuth2, quindi individuare gli UUID di team, progetto, stato e assegnatario tramite le operazioni di elenco prima di creare o aggiornare le issue.

Si abbina a [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) e [Third-Party Integrations](./integrations.md) per i workflow di acquisizione, gestione e backlog ingegneristico.

#### [Supabase](../nodes/supabase-node.md)

Il nodo Supabase legge e modifica le tabelle esposte tramite Supabase PostgREST. È particolarmente adatto per backend di prodotto, dati utente/profilo, stato dei workflow e automazioni in stile CRUD che richiedono l'accesso al database senza la configurazione manuale di richieste HTTP.

Si abbina a [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) e [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Il nodo ClickHouse esegue operazioni CRUD, di conteggio e SQL raw su un database ClickHouse esterno tramite la sua interfaccia HTTP. È adatto a pipeline di analisi, registrazione di eventi e workflow di reportistica: inserire gli eventi nel momento in cui si verificano, quindi aggregarli o contarli con `query`/`count`. Riprende l'insieme di operazioni di [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) e aggiunge una modalità di accesso diretto a SQL raw, con `update`/`remove` eseguiti come mutazioni ClickHouse.

Si abbina a [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) per i report pianificati e [Third-Party Integrations](./integrations.md).
#### [Notion](../nodes/notion-node.md)

Il nodo Notion gestisce database, origini dati, pagine e blocchi di Notion tramite l'API Notion corrente (`2026-03-11`). Supporta la ricerca, le operazioni CRUD sulle pagine, le operazioni su database e origini dati, i blocchi figlio, l'aggiunta/aggiornamento/eliminazione di blocchi e le operazioni di cestinamento/ripristino. Utilizzare un token di integrazione interno o una credenziale OAuth di integrazione pubblica Notion. L'editor può cercare e paginare tramite cursore le origini dati e le pagine padre accessibili. Le credenziali condivise funzionano allo stesso modo delle credenziali di proprietà per l'esecuzione dei workflow.

Per le chiamate REST personalizzate, `$credentials.YourNotionCredential` si risolve nello stesso bearer token. Si abbina a [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) e [Third-Party Integrations](./integrations.md).

#### [Sentry](../nodes/sentry-node.md)

Il nodo Sentry automatizza organizzazioni, progetti, team, issue, eventi e release di Sentry tramite l'API REST di Sentry. Utilizzarlo per la triage degli avvisi, l'aggiornamento dello stato delle issue, l'automazione delle release, la ricerca di eventi e la configurazione o la pulizia di progetti e team. Supporta Sentry SaaS e Sentry self-hosted tramite un base URL opzionale nella credenziale.

Si abbina a [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) e [Third-Party Integrations](./integrations.md) per i workflow di incident e release.

#### [DataTable](../nodes/datatable-node.md)

Il nodo DataTable legge, scrive e gestisce i dati nelle Tabelle dati di Heym (archiviazione strutturata first-party). Le operazioni includono find, getAll, getById, insert, update, remove e upsert. Non sono richieste credenziali esterne. Le tabelle sono gestite dalla scheda dashboard [DataTable](../tabs/datatable-tab.md) e sono accessibili direttamente dal proprietario del workflow.

Si abbina a [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) e alla [scheda DataTable](../tabs/datatable-tab.md) per l'archiviazione strutturata first-party.

#### [Drive](../nodes/drive-node.md)

Il nodo Drive gestisce i file generati dalle skill direttamente all'interno di un workflow. Le operazioni includono delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams e unshareWithMyTeams per la gestione dell'accesso in sola lettura ai team; la conversione di formato è invece demandata al nodo [Converter](../nodes/converter-node.md). Fare riferimento al file con `$agentLabel._generated_files[0].id`; gli output includono status, file_id, il download_url aggiornato per i vincoli di link e shared_team_count per la condivisione con i team. Ciò è particolarmente utile con i workflow del [Nodo Agent](../nodes/agent-node.md) che utilizzano la [File Generation](./file-generation.md) e il modello di riferimento [Drive](./drive.md).

I companion più comuni sono [Nodo Agent](../nodes/agent-node.md), [File Generation](./file-generation.md) e [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Il nodo Amazon S3 esegue operazioni di archiviazione a oggetti su Amazon S3 utilizzando una credenziale `s3` (access key, secret key, region, session token opzionale). Le operazioni includono putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder e listBuckets. Sono supportati il caricamento di testo e il download di testo o base64, con i campi bucket e key che accettano [Expression DSL](./expression-dsl.md). Utilizzarlo per archiviare gli output dei workflow, archiviare file e rileggere gli oggetti all'interno di un flusso.

Si abbina a [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) e [Third-Party Integrations](./integrations.md).

### Automazione

#### [Crawler](../nodes/crawler-node.md)

Il nodo Crawler esegue lo scraping di pagine web utilizzando FlareSolverr con estrazione HTML opzionale tramite selettori CSS. Configurare una [credenziale](./credentials.md) FlareSolverr, un'espressione URL, il tempo di attesa e selettori opzionali per l'estrazione. L'output è l'HTML grezzo o il contenuto estratto. Utilizzarlo per lo scraping web e l'estrazione di contenuti.

Si abbina a [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) e [LLM](../nodes/llm-node.md) per i flussi di scraping e analisi.

#### [Playwright](../nodes/playwright-node.md)

Il nodo Playwright automatizza le interazioni con il browser tramite passaggi configurabili (navigate, refresh, click, type, screenshot, extract, aiStep) oppure la modalità **Run Code** per Playwright Python personalizzato (in sandbox; disattivata per impostazione predefinita tramite `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Supporta la modalità headless, un'impostazione opzionale che riduce i segnali comuni di automazione di Playwright, i timeout, la cattura di rete opzionale (responses, cookies, localStorage, sessionStorage), il bootstrap dell'autenticazione tramite cookie/storageState da espressioni di [Global Variables](./global-variables.md) quali `$global.authState`, passaggi di login di fallback quando il ripristino dell'autenticazione non riesce e un passaggio AI con Auto Heal quando i selettori non funzionano. Utilizzarlo per lo scraping web, la compilazione di moduli e i workflow basati sul browser.

Si vedano anche [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) e [Execution History](./execution-history.md) per l'automazione del browser e il debug.

### Utility
#### [Output](../nodes/output-node.md)

Il nodo Output è l'endpoint del workflow che restituisce la risposta al chiamante. Impostare l'espressione del messaggio in modo che faccia riferimento al nodo precedente tramite label (non utilizzare mai `$input` dal nodo [Input](../nodes/input-node.md) in questa sede). L'opzione async downstream consente ai nodi successivi all'output di essere eseguiti in background dopo l'invio della risposta.

Le origini upstream più comuni sono [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) ed [Execute](../nodes/execute-node.md); la definizione della risposta è più semplice da sottoporre a debug nella [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Il nodo JSON output mapper costruisce un oggetto JSON semplice a partire da mappature chiave-valore in stile [Set](../nodes/set-node.md) e lo restituisce alla radice della risposta del workflow. Utilizzarlo quando un chiamante API deve ricevere un corpo JSON grezzo anziché il wrapper standard del nodo [Output](../nodes/output-node.md).

#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Il nodo HTML output mapper esegue il rendering di un singolo template HTML, interpolando le espressioni `$nodeLabel.field` all'interno della pagina. Quando rappresenta l'unico nodo terminale del workflow, il webhook di esecuzione risponde con `text/html` e con il codice di stato configurato nel nodo anziché con un corpo JSON, consentendo a un workflow di servire direttamente una pagina a un browser. Inviare `X-Simple-Response: false` per ottenere nuovamente il consueto envelope JSON a fini di debug.

Si abbina a [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) e [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Il nodo Chart Output è il nodo terminale del workflow di un widget della [Dashboard](../tabs/dashboard-tab.md). Trasforma le righe prodotte dai nodi upstream in un payload di grafico standardizzato che la dashboard esegue il rendering. Scegliere un `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text o HITL), mappare `labelField`/`valueField` (oppure `series` per serie multiple, oppure `text` per un messaggio markdown) e posizionarlo per ultimo; non dispone di un edge di output. HITL ignora le righe upstream ed elenca le revisioni umane in sospeso. e un'altra come pulsanti di collegamento che aprono un URL in una nuova scheda (`linkColumn`, con `linkLabel` per il testo del pulsante)

Vedere anche [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) e [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Il nodo Wait sospende l'esecuzione del workflow per una durata specificata in millisecondi, fino a un massimo di 15 minuti. Utilizzarlo per il rate limiting, azioni ritardate o intervalli di polling. Trasmette l'input invariato.

Si abbina a [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) e [Parallel Execution](./parallel-execution.md) per la regolazione dei tempi e il polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Il nodo Sticky Note aggiunge note markdown al canvas. Non viene eseguito. Utilizzarlo per documentazione, istruzioni o note sul workflow insieme alle altre [Canvas Features](./canvas-features.md). Fare doppio clic sul canvas per modificare il contenuto della nota.

Vedere anche [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) e [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Il nodo Console Log registra un valore nella console del backend (server). Utilizzarlo per il debug e l'ispezione durante lo sviluppo. Il messaggio di log supporta le espressioni [Expression DSL](./expression-dsl.md); l'output viene trasmesso invariato dall'input.

Si abbina a [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) e [Expression Evaluation Dialog](./expression-evaluation-dialog.md) per il debug.

#### [Disable Node](../nodes/disable-node.md)

Il nodo Disable Node disabilita in modo permanente un altro nodo del workflow impostando il relativo flag `active` su false. Specificare il nodo di destinazione tramite label. Utilizzarlo per operazioni una tantum, come l'arresto di un Trigger [Cron](../nodes/cron-node.md) una volta soddisfatta una condizione.

Vedere anche [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) e [Cron](../nodes/cron-node.md) per i pattern di controllo del workflow.

#### [Enable Node](../nodes/enable-node.md)

Il nodo Enable Node riattiva un altro nodo impostando il relativo flag `active` su true e salvando la modifica. Specificare il nodo di destinazione tramite label. Utilizzarlo per riattivare un Trigger [Cron](../nodes/cron-node.md) disabilitato da un altro punto di ingresso, oppure per attivare un nodo una volta soddisfatta una condizione. Una destinazione che si trova downstream rispetto al nodo Enable Node e che non è ancora stata eseguita viene eseguita anch'essa nell'esecuzione corrente.

Vedere anche [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) e [Cron](../nodes/cron-node.md) per i pattern di controllo del workflow.
#### [Throw Error](../nodes/throw-error-node.md)

Il nodo Throw Error interrompe immediatamente l'esecuzione del workflow e restituisce una risposta di errore con un codice di stato HTTP personalizzato. Impostare l'espressione del messaggio di errore e il codice di stato (ad es. 400, 401, 403, 404, 429, 500). Utilizzarlo per errori di validazione, accessi non autorizzati o altre condizioni di errore, soprattutto se abbinato a [Condition](../nodes/condition-node.md) e [Error Handler](../nodes/error-handler-node.md).

Si abbina a [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) e [Security](./security.md) per percorsi di errore espliciti.

---

## Riferimento

### [Tipi di nodo](./node-types.md)

Heym fornisce una varietà di tipi di nodo: trigger quali [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) ed [Error Handler](../nodes/error-handler-node.md); nodi IA quali [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) e [MCP Call](../nodes/mcp-call-node.md); nodi logici come [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) e [Loop](../nodes/loop-node.md); nodi dati come [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) e [Heym](../nodes/heym-node.md); integrazioni quali [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) e [Drive](../nodes/drive-node.md); nodi di automazione come [Crawler](../nodes/crawler-node.md) e [Playwright](../nodes/playwright-node.md); e utilità quali [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) e [Sticky Note](../nodes/sticky-note-node.md). Utilizzare espressioni come `$input.text` e `$nodeLabel.field` nella configurazione dei nodi.

Vedere anche [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) e [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym utilizza un semplice linguaggio di espressioni per fare riferimento ai dati dei nodi a monte. Utilizzare `$input` per il nodo [Input](../nodes/input-node.md), `$nodeLabel.field` per qualsiasi nodo a monte, `$credentials.CredentialName` per le [credenziali](./credentials.md) e `$global.variableName` per le [variabili globali](./global-variables.md). Le variabili speciali integrate includono `$now`, `$UUID` e i metadati del workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` e `$executionId` (l'id della [Cronologia esecuzioni](./execution-history.md) dell'esecuzione — `/workflows/{id}/{executionId}` apre tale esecuzione sul canvas; disponibile solo a runtime, vuoto nella finestra di anteprima delle espressioni). Il supporto include letterali, aritmetica, confronti, contesto [Loop](../nodes/loop-node.md), campi annidati e funzioni di supporto per stringhe/array (incluso `$text.toJson()` per analizzare una stringa JSON). Quando il valore completo è un singolo `$expr`, il backend preserva array, oggetti, booleani e numeri come tipi nativi.

Vedere anche [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) e [Workflow Structure](./workflow-structure.md).
### [Variabili globali](./global-variables.md)

L'Archivio delle variabili globali contiene dati chiave-valore persistenti, con ambito utente, che sopravvivono tra le esecuzioni dei workflow. Creare variabili dalla scheda [Variabili](../tabs/global-variables-tab.md) oppure da un nodo [Variable](../nodes/variable-node.md) con l'opzione "Store in Global Variable Store" abilitata. Accedervi tramite `$global.variableName` nelle espressioni; possono essere condivise con altri utenti o [team](./teams.md).

Si integra con [Variable](../nodes/variable-node.md), [Teams](./teams.md) e [Credentials Sharing](./credentials-sharing.md) per lo stato condiviso dei workflow.

### [Finestra di valutazione delle espressioni](./expression-evaluation-dialog.md)

La Finestra di valutazione delle espressioni è un editor espandibile che appare quando si fa clic sul pulsante di espansione accanto ai campi delle espressioni. Si apre come una grande finestra modale centrata, mantiene attivo il completamento automatico e aggiorna automaticamente l'output di anteprima del backend dopo una pausa nella digitazione. I risultati di tipo oggetto e array possono essere esplorati con il selettore del percorso di output. La finestra accetta un percorso puntato nudo sull'intera riga (ad esempio `myNode.output.field`) come se fosse `$myNode.output.field`; consultare le regole di posizionamento della [Expression DSL](./expression-dsl.md).

Il pulsante **Build with AI** nella barra degli strumenti consente di descrivere l'espressione desiderata in testo semplice. Selezionare una [credenziale](./credentials.md) LLM e un modello, digitare una descrizione come *"Get the customer name from the API response"* e fare clic su Generate. Il backend invia al modello il contesto della [Expression DSL](./expression-dsl.md) e gli output dei nodi dell'ultima esecuzione, restituendo una singola stringa di espressione. Il risultato viene valutato immediatamente, così da poterlo verificare prima di fare clic su Apply.

Si integra naturalmente con [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) e [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Struttura del workflow](./workflow-structure.md)

I workflow sono memorizzati come JSON con nodi e archi. L'oggetto workflow include id, name, description, nodes, edges e impostazioni di autenticazione. Ogni nodo ha id, type, position e data (label e configurazione specifica del tipo). Gli archi collegano gli ID dei nodi di origine e destinazione con handle ID opzionali. La sintassi delle espressioni nei campi data segue la [Expression DSL](./expression-dsl.md), e questa stessa struttura è utilizzata da [Download & Import](./download-import.md).

Vedere anche [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) e [Download & Import](./download-import.md).

### [Funzionalità del Canvas](./canvas-features.md)

Passare il cursore su qualsiasi nodo del canvas non di tipo sticky e fare clic su **Run** per eseguire fino a quel nodo. Gli input richiesti si aprono nel pannello Run con il primo campo a fuoco; i percorsi senza input vengono avviati immediatamente. Consultare [Run to Node](./canvas-features.md#run-to-node).

L'editor dei workflow fornisce Data Pin (fissare l'ultimo output di un nodo per testare i nodi a valle senza rieseguire), Execution Logs (risultati dei nodi in tempo reale e avanzamento degli agenti che integrano la [Cronologia delle esecuzioni](./execution-history.md)), Enable/Disable (saltare i nodi durante l'esecuzione) ed Extract to Sub-Workflow (spostare una selezione in un nuovo workflow e sostituirla con un nodo [Execute](../nodes/execute-node.md)). Un'esecuzione di produzione in corso può essere aperta dalla Cronologia o da una scheda della Board; l'editor ripristina il suo snapshot corrente, si collega via SSE e mantiene attive l'animazione del canvas e i log di Debug. Le [Scorciatoie da tastiera](./keyboard-shortcuts.md) supportano copia, incolla, esecuzione e ricerca inline dei nodi.

Vedere anche [Scorciatoie da tastiera](./keyboard-shortcuts.md), [Cronologia delle modifiche](./edit-history.md) e [Cronologia delle esecuzioni](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Scorciatoie da tastiera](./keyboard-shortcuts.md)

Heym fornisce scorciatoie in tutto l'editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo ed Escape per chiudere. Sul canvas: seleziona tutto, selezione multipla, copia/taglia/incolla, elimina, attiva/disattiva nodo (D), attiva/disattiva dati fissati (P) e ricerca inline dei nodi digitando. Le scorciatoie sono documentate nel riferimento in-app e funzionano in stretta sinergia con le [Funzionalità del Canvas](./canvas-features.md) come Data Pin e l'attivazione/disattivazione dei nodi.

Vedere anche [Funzionalità del Canvas](./canvas-features.md), [Quick Drawer](./quick-drawer.md) e [Contextual Showcase](./contextual-showcase.md).
### [AI Assistant](./ai-assistant.md)

L'AI Assistant è un pannello di chat aperto dal pannello Debug che consente di creare o modificare i workflow con il linguaggio naturale. Selezionare una [credenziale](./credentials.md) e un modello, quindi descrivere ciò che si desidera; l'IA trasmette in streaming una risposta e qualsiasi [workflow JSON](./workflow-structure.md) valido presente in un blocco di codice viene automaticamente analizzato e applicato al canvas. L'input vocale è supportato sui browser compatibili.

Attivando la **YOLO mode** (Agent mode, disattivata per impostazione predefinita), l'assistente verifica ciò che costruisce. Dopo ogni modifica esegue il workflow sul canvas, legge il risultato e corregge il workflow finché non fa ciò che è stato richiesto, per un massimo di 5 esecuzioni per messaggio. Richiede gli input di test prima della prima esecuzione, può eseguire gli altri workflow quando necessita del loro risultato e mostra ogni passaggio mentre opera. Vedere [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Fai clic su **AI** sopra qualsiasi nodo sul canvas per modificare o correggere solo quel nodo. Il pannello mostra il nodo che sta modificando (con il suo ultimo risultato una volta eseguito) e offre **Change this node as ...**, **Fix error in this node ...** e **Other**. Viene aggiornato solo quel nodo; il resto del workflow e il layout rimangono invariati. Vedi [AI Assistant › Modifica di un singolo nodo](./ai-assistant.md#changing-one-node).

Quando un workflow memorizza record, l'assistente chiede quale [tabella dati](../tabs/datatable-tab.md) utilizzare, oppure ne crea una con le colonne necessarie al workflow. Vedere [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Quando il workflow corrente contiene le skill del [Nodo Agent](../nodes/agent-node.md), l'assistente invia nel contesto del workflow solo il `SKILL.md` di ciascuna skill. I file `.py` allegati e gli asset binari delle skill vengono esclusi prima della richiesta, affinché i bundle di skill di grandi dimensioni non saturino la finestra di contesto del modello.

Si integra bene con [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) e [Expression DSL](./expression-dsl.md).

### [Chat with Heym](./chat-with-heym.md)

Chat with Heym è un assistente dell'intestazione della documentazione per le domande sul prodotto. Si apre in una finestra di dialogo centrata, mantiene visibili nella parte superiore la selezione della credenziale e del modello, inietta come contesto il percorso della pagina di documentazione attiva e cancella la cronologia dei messaggi alla chiusura della finestra. Integra il più ampio [AI Assistant](./ai-assistant.md) e il più leggero [Contextual Showcase](./contextual-showcase.md).

Vedere anche [AI Assistant](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) e [Node Types](./node-types.md).

### [Workflow Organization](./workflow-organization.md)

Gli amministratori dell'istanza (`HEYM_ADMIN_EMAILS`) possono accedere e modificare ogni workflow, individuare i workflow di un proprietario tramite email, ispezionare le pianificazioni e la cronologia delle esecuzioni, sospendere e riprendere i trigger automatici ed eliminare i workflow una volta conclusesi le esecuzioni. Vedere [Instance Administration](../tabs/workflows-tab.md#instance-administration) per il flusso di offboarding e la distinzione tra la sospensione dei trigger automatici e il blocco di tutte le chiamate.

I workflow possono essere organizzati in cartelle e sotto-cartelle secondo una struttura ad albero. Le cartelle hanno un nome e un genitore opzionale; i workflow sono assegnati alle cartelle. I workflow possono essere pianificati per l'eliminazione (spostati in un'area cestino prima della rimozione definitiva). L'API supporta la creazione, l'aggiornamento, l'eliminazione e lo spostamento dei workflow tra le cartelle, e lo stesso modello di organizzazione è presente nella scheda [Workflows](../tabs/workflows-tab.md).

Vedere anche [Quick Drawer](./quick-drawer.md), [Download & Import](./download-import.md) e [Edit History](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

Il Quick Drawer è un pannello a scomparsa fisso sul lato destro per l'esecuzione rapida nelle pagine interne non-canvas. Consente di cercare i [workflow](../tabs/workflows-tab.md), fissare i preferiti, selezionare gli input, eseguire immediatamente e ispezionare l'avanzamento o i risultati senza aprire l'editor. Un workflow con un [File Upload Trigger](../nodes/file-upload-trigger-node.md) accetta un file trascinato o selezionato. L'ordine dei preferiti e l'ultimo workflow selezionato sono memorizzati nel browser.

Vedere anche [Workflow Organization](./workflow-organization.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) e [Execution History](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

Il Contextual Showcase è una guida compatta integrata nell'app per le principali superfici autenticate, quali le schede della dashboard, [Evals](../tabs/evals-tab.md), Docs e l'editor dei workflow. Rimane chiuso per impostazione predefinita, fornisce dapprima un breve riepilogo della pagina, offre ulteriori dettagli su richiesta e rimanda all'articolo completo della documentazione quando si desidera una guida più approfondita.

Si abbina a [Chat with Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) e [AI Assistant](./ai-assistant.md) per i flussi di guida integrati nell'app.

### [Credentials](./credentials.md)

Le credenziali memorizzano le chiavi API e i segreti utilizzati dai nodi del workflow. Aggiungerle nella scheda [Credentials](../tabs/credentials-tab.md) e farvi riferimento per nome o ID nei nodi quali [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Send Email](../nodes/send-email-node.md) e [Redis](../nodes/redis-node.md). Sono cifrate a riposo, possono essere condivise con utenti o [team](./teams.md) e possono anche essere referenziate nell'[Expression DSL](./expression-dsl.md) tramite `$credentials.Name`.

Vedere anche [Credentials](../tabs/credentials-tab.md), [Credentials Sharing](./credentials-sharing.md) e [Third-Party Integrations](./integrations.md).
### [Condivisione delle Credenziali](./credentials-sharing.md)

Le Credenziali possono essere condivise con altri utenti tramite email o con i team; tutti i membri del team ottengono l'accesso quando una Credenziale viene condivisa con un team. Le Credenziali condivise appaiono con un indicatore nella scheda [Credenziali](../tabs/credentials-tab.md). In fase di esecuzione, il contesto del proprietario del workflow unisce le Credenziali possedute, condivise dall'utente e condivise dal team. Utilizzare `$credentials.CredentialName` nelle espressioni oppure impostare credentialId nei dati del nodo.

Vedere anche [Credenziali](./credentials.md), [Team](./teams.md) e [Integrazioni di Terze Parti](./integrations.md).

### [Team](./teams.md)

I Team consentono di condividere workflow, Credenziali, variabili globali, archivi vettoriali e file di Drive con un gruppo di utenti contemporaneamente. Creare i team dalla scheda [Team](../tabs/teams-tab.md) e aggiungere membri tramite email. Condividere le risorse con un team dalle relative finestre di condivisione; tutti i membri avranno quindi accesso. Il creatore può modificare ed eliminare il team; l'eliminazione di un team rimuove tutte le condivisioni del team.

Si abbina a [Condivisione delle Credenziali](./credentials-sharing.md), [Variabili Globali](./global-variables.md) e [Enterprise](./enterprise.md).

### [Esecuzione Parallela](./parallel-execution.md)

Heym esegue i nodi in parallelo quando non hanno dipendenze reciproche. L'esecutore costruisce un DAG ed esegue i nodi dello stesso livello in modo concorrente con un thread pool; non appena un nodo termina, i suoi nodi a valle vengono pianificati. Utilizzare il nodo [Merge](../nodes/merge-node.md) per combinare i rami paralleli quando necessario. Più esecuzioni di workflow vengono eseguite in modo concorrente; ciascuna esecuzione è isolata. La modalità [SSE Streaming](./sse-streaming.md) emette eventi man mano che i nodi vengono completati.

Vedere anche [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) e [Cronologia delle Esecuzioni](./execution-history.md).

### [Architettura dell'Agente](./agent-architecture.md)

Il [Nodo Agent](../nodes/agent-node.md) supporta sub-agenti (l'orchestratore richiama altri nodi agent tramite call_sub_agent), sub-workflow (l'agente richiama altri workflow tramite call_sub_workflow), skills (contenuto di istruzioni e strumenti Python da file .zip o .md) e connessioni client [MCP](../tabs/mcp-tab.md). L'esecutore degli strumenti dell'orchestratore instrada le chiamate ai sub-agenti e ai sub-workflow; gli altri strumenti vengono indirizzati agli esecutori Python, MCP o delle skill. La profondità massima di annidamento per sub-agenti e sub-workflow è 5. Il ciclo di chiamata degli strumenti include la compressione automatica del contesto: prima di ogni iterazione, l'utilizzo dei token viene stimato e, se supera l'80% della finestra di contesto del modello, i messaggi intermedi vengono riassunti utilizzando lo stesso modello, mantenendo intatti il system prompt, il primo messaggio utente e l'ultimo messaggio utente.

Vedere anche [Nodo Agent](../nodes/agent-node.md), [Memoria Persistente dell'Agente](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) e [MCP](../tabs/mcp-tab.md).

### [Memoria Persistente dell'Agente](./agent-persistent-memory.md)

Grafo di conoscenza opzionale per ciascun [Nodo Agent](../nodes/agent-node.md) memorizzato in Postgres: entità, tipi, proprietà e relazioni dirette. Quando `persistentMemoryEnabled` è true, il grafo viene riassunto nel system prompt a ogni esecuzione; dopo i completamenti riusciti, un [LLM](../nodes/llm-node.md) estrae aggiornamenti strutturati in background. Le operazioni REST CRUD risiedono sotto `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. L'editor si apre dal controllo a forma di cervello rosa sul nodo.

Vedere anche [Nodo Agent](../nodes/agent-node.md), [Architettura dell'Agente](./agent-architecture.md) e [Esecuzioni](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop consente a un [Nodo Agent](../nodes/agent-node.md) di richiedere l'approvazione in checkpoint specifici, creare una pagina pubblica `/review/{token}` e attendere che un revisore non autenticato accetti, modifichi o rifiuti il testo di revisione Markdown. Gli agent abilitati a HITL espongono inoltre un handle di output `review` per poter notificare [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) o altri canali mentre l'esecuzione è in sospeso. Il testo HITL a livello di nodo viene utilizzato come linee guida per l'approvazione, mentre il riepilogo della pagina pubblica viene generato dalla richiesta di revisione stessa. Le esecuzioni in sospeso appaiono immediatamente nella [Cronologia delle Esecuzioni](./execution-history.md), possono verificarsi più di una volta nella stessa esecuzione e riprendono dall'esatto snapshot del workflow memorizzato una volta inviata ciascuna decisione.

Vedere anche [Nodo Agent](../nodes/agent-node.md), [Portal](./portal.md), [Cronologia delle Esecuzioni](./execution-history.md) e [Send Email](../nodes/send-email-node.md).
### [Webhooks](./webhooks.md)

I Workflows possono essere attivati via [HTTP](../nodes/http-node.md) su `POST /api/workflows/{workflow_id}/execute`, oppure trasmessi in modo incrementale da `POST /api/workflows/{workflow_id}/execute/stream`. Il corpo della richiesta viene passato come body ai nodi [Input](../nodes/input-node.md); gli header e i query param sono disponibili nelle espressioni [Expression DSL](./expression-dsl.md). Configurare l'autenticazione per singolo workflow: anonima, JWT o header personalizzato. La cache opzionale delle risposte, il rate limiting e la finestra di dialogo Run with cURL dell'editor risiedono tutti sul workflow e si applicano a entrambe le modalità. Con un [limite di concorrenza](./webhooks.md#concurrency-limit-and-queued-runs), una chiamata che deve attendere riceve invece `202 Accepted` con un ID di esecuzione e un URL di stato.

Vedere anche [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) e [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Gli execution token sono JWT con ambito limitato che concedono l'accesso agli endpoint execute e stream di un singolo workflow. Quando un workflow utilizza l'autenticazione JWT, i token consentono a script esterni, pipeline CI e integrazioni di richiamare il workflow senza condividere una sessione utente. Ogni token contiene un claim `wid` che lo vincola a un solo workflow, un `jti` utilizzato per la revoca istantanea e un TTL configurabile (da 60 secondi a 10 anni). Creare, selezionare e revocare i token direttamente dalla finestra di dialogo **Run with cURL**: il token selezionato viene incorporato automaticamente nel comando generato.

Vedere anche [Webhooks](./webhooks.md), [Security](./security.md) e [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

La finestra di dialogo cURL può commutare l'esecuzione del [webhook](./webhooks.md) in modalità Server-Sent Events. Ciò produce gli eventi `execution_started`, `node_start`, `node_complete` e `execution_complete` in tempo reale, aggiunge `--no-buffer` al comando cURL generato e consente di configurare messaggi di avvio per singolo nodo, come `[START] LLM` o testo personalizzato per consumer di terminale esterni.

Vedere anche [Webhooks](./webhooks.md), [Execution History](./execution-history.md) e [LLM](../nodes/llm-node.md).

### [Triggers](./triggers.md)

I Workflows vengono avviati da nodi trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), ricezione [RabbitMQ](../nodes/rabbitmq-node.md)) o da punti di ingresso: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), scheduler Cron, webhook Telegram, webhook di interazione Discord, gestore trigger IMAP, consumer RabbitMQ o esecuzione dall'editor. Ogni trigger dispone di un proprio endpoint o processo in background; [Cron](../nodes/cron-node.md) viene eseguito ogni 60 secondi, i nodi [Telegram Trigger](../nodes/telegram-trigger-node.md) ricevono i webhook del bot, i nodi [Discord Trigger](../nodes/discord-trigger-node.md) ricevono webhook di interazione firmati e i nodi [IMAP Trigger](../nodes/imap-trigger-node.md) vengono eseguiti all'intervallo di polling configurato. I nodi [Input](../nodes/input-node.md) ricevono body, header e query dalle richieste webhook.

Vedere anche [Node Types](./node-types.md), [Webhooks](./webhooks.md) e [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

La cronologia delle esecuzioni registra le esecuzioni dei workflow: input, output, risultati dei nodi, stato e origine del trigger. È possibile accedervi dalla barra degli strumenti dell'editor, dalla vista Docs, dall'intestazione della Dashboard o dalla vista [Evals](../tabs/evals-tab.md). La cronologia per singolo workflow mostra le esecuzioni del workflow aperto; la vista di tutta la cronologia mostra le esecuzioni relative a tutti i workflow e alle chat. Le esecuzioni attualmente in corso compaiono in cima a entrambe le finestre di dialogo con le azioni **Open live** e **Cancel**. Open live collega l'editor all'esecuzione esistente tramite [SSE](./sse-streaming.md), ripristina i nodi completati, evidenzia con pulsazione i nodi correnti e in attesa e aggiunge i log di Debug senza avviare una nuova esecuzione. Bring to Canvas carica gli input e gli output dei nodi di un'esecuzione completata per una nuova esecuzione o per il debug; il deep link `/workflows/{workflowId}/{executionId}` supporta sia le esecuzioni live sia quelle completate. Le esecuzioni in pausa per [Human-in-the-Loop](./human-in-the-loop.md) vengono memorizzate immediatamente come `pending`, inclusi l'URL pubblico di revisione e gli eventuali nodi di notifica eseguiti dal ramo `review` dell'agente. Se il server si riavvia durante un'esecuzione, le esecuzioni interrotte vengono recuperate automaticamente: vengono rieseguite da zero con gli stessi input e mostrate come completate (contrassegnate come **Recovered**), controllate da un interruttore **Auto-recover runs** per singolo workflow che, in alternativa, può registrarle come `skipped`.

Vedere anche [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) e [Traces](../tabs/traces-tab.md).
### Execution Highlights

Dopo un'esecuzione live — o dopo **Bring to Canvas** — viene visualizzato un popup **Execution Highlights** dismissibile nell'angolo in alto a destra del Canvas, che elenca ciò che ciascun nodo ha prodotto in ordine di esecuzione. È un modo rapido per ispezionare l'output per nodo senza aprire ogni singolo nodo; chiuderlo con la **✕** e si riaprirà all'esecuzione successiva. Gli Highlights vengono mostrati anche nelle esecuzioni della dashboard. Per i dettagli, consultare [Execution History](./execution-history.md).

### [Edit History](./edit-history.md)

Edit History tiene traccia delle versioni salvate di un workflow (ogni Salvataggio crea una versione). È possibile visualizzare l'elenco, aprire una versione per vedere un diff rispetto al workflow corrente ([nodi](./workflow-structure.md), edge, configurazione) ed eseguire il Revert per ripristinare una versione precedente. A differenza di [Execution History](./execution-history.md), Edit History tiene traccia delle modifiche strutturali, non delle esecuzioni.

Vedere anche [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) e [Canvas Features](./canvas-features.md).

### Error Workflow

Un workflow può designare un altro workflow da eseguire in caso di errore. Configurarlo nel pannello **Properties** a livello di workflow (visualizzato quando nessun nodo è selezionato) alla voce **On error, run workflow**. Solo il proprietario del workflow può impostarlo, modificarlo o rimuoverlo; consultare [Owner-only settings](./workflow-organization.md#owner-only-settings). Quando un'esecuzione di primo livello termina con un errore non gestito, il workflow di errore selezionato viene eseguito e riceve il contesto dell'errore (id e nome del workflow non riuscito, id dell'esecuzione, messaggio di errore, etichetta e tipo del nodo non riuscito e un timestamp). Se il canvas contiene già un nodo [Error Handler](../nodes/error-handler-node.md), il gestore locale ha la precedenza e il workflow di errore **non** viene richiamato. Il workflow di errore stesso viene eseguito direttamente, quindi non attiva mai il proprio workflow di errore.

Copre ogni esecuzione di primo livello non di test: entrambi gli endpoint di esecuzione, il [Portal](./portal.md) e ogni trigger, inclusi [cron](../nodes/cron-node.md), i trigger delle piattaforme di chat, email, code, [MCP](../tabs/mcp-tab.md) e widget della dashboard. Con [Load Distribution](./cluster.md) abilitato ciò rimane invariato, comprese le esecuzioni eseguite da un worker: il nodo non riuscito ritorna insieme al risultato, e il workflow di errore viene poi distribuito come qualsiasi altra esecuzione, quindi un nodo al suo interno che deve essere eseguito sull'istanza principale continua a esserlo. Due casi sono deliberatamente esclusi, poiché l'esito del workflow stesso non è ancora noto: un'esecuzione che nessuna istanza ha mai eseguito e un'attesa scaduta mentre l'esecuzione potrebbe essere ancora in corso. Inoltre **non** viene attivato dalle esecuzioni di test manuali sul canvas.

### Workflow Timeout

Ogni workflow può impostare un **workflow timeout** in secondi nel pannello **Properties** a livello di workflow. `0` (il valore predefinito) lo disabilita. Quando impostato, un'esecuzione che supera il limite viene arrestata al successivo confine di nodo e registrata come esecuzione non riuscita con un errore "timed out". Il timeout si applica alle esecuzioni manuali, API e attivate da trigger. I nodi [Wait](../nodes/wait-node.md) di lunga durata vengono interrotti prontamente anziché bloccarsi per l'intera durata.

### Limite di concorrenza

Ogni workflow può limitare quante esecuzioni di produzione vengono eseguite contemporaneamente con il **Limite di concorrenza** nel pannello **Properties** a livello di workflow; il proprietario e i collaboratori con accesso di modifica possono modificarlo ed è disattivato per impostazione predefinita. Quando il limite viene raggiunto, le nuove esecuzioni provenienti dagli endpoint [webhook](./webhooks.md#concurrency-limit-and-queued-runs) e di [streaming](./sse-streaming.md), dal [Portal](./portal.md), dal [Quick Drawer](./quick-drawer.md), da [MCP](../tabs/mcp-tab.md) e da ogni [trigger](./triggers.md) attendono in una coda FIFO (first-in, first-out), conteggiata tra tutte le istanze di un [cluster](./cluster.md). Le esecuzioni di test dell'editor, le chiamate a sotto-workflow, le [Evals](../tabs/evals-tab.md) e le riprese di revisione non vengono mai accodate, e le esecuzioni di schede del [Board](../tabs/board-tab.md), le esecuzioni di caricamento file, le esecuzioni avviate dallo strumento run-workflow dell'assistente IA e i workflow di notifica avvisi si avviano senza attendere uno slot. Una chiamata webhook che deve attendere riceve immediatamente `202 Accepted` con un `execution_id`, un URL di stato che risponde con le stesse credenziali, la propria posizione, la dimensione della coda e il conteggio delle esecuzioni correnti; un client MCP riceve la stessa risposta ed esegue il polling dello strumento `heym_execution_status`. L'opzione **Dimensione massima della coda** rifiuta le chiamate in eccesso con `429`, mentre l'opzione **Attesa massima** registra un'esecuzione che ha atteso troppo a lungo come `expired`. Le esecuzioni in attesa appaiono nella [Cronologia delle esecuzioni](./execution-history.md) come **In coda n/m** e possono essere annullate da lì.

### Time Saved

Ogni workflow può registrare un **estimated time saved per run** (in minuti), impostato nel pannello **Properties** a livello di workflow. La scheda [Analytics](../tabs/analytics-tab.md) aggrega questo valore nell'intervallo selezionato come statistica totale **Time Saved** (somma della stima di ciascun workflow × le sue esecuzioni riuscite). Most Used elenca inoltre tale somma per workflow; **Not Set** apre il campo della stima quando non è impostata. Il report [Workflow Analysis](./workflow-analysis.md) consiglia di impostare una stima quando nessuna è configurata.

### [Settings](./user-settings.md)

La finestra di dialogo Settings (aperta dal proprio avatar nell'intestazione) presenta quattro schede: Profile (immagine Gravatar, nome visualizzato, User Rules), [Security](./security.md) (cambio password), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) e Observability (stato [OpenTelemetry](./opentelemetry.md) in sola lettura). Le User Rules sono istruzioni personalizzate iniettate in ogni richiesta IA, incluso il workflow builder e la [Chat](../tabs/chat-tab.md), così da poter impostare una volta sola lingua, tono, stile di codifica o convenzioni dei workflow. Sono inoltre disponibili la policy delle password e la gestione delle API key [MCP](../tabs/mcp-tab.md).

Vedere anche [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) e [AI Assistant](./ai-assistant.md).
### [OpenTelemetry Tracing](./opentelemetry.md)

Heym può emettere tracce OpenTelemetry per ogni esecuzione di workflow e per ogni esecuzione di nodo: uno span radice `heym.workflow.execute` per ogni esecuzione e uno span figlio `heym.node.execute` per ogni nodo, con l'utilizzo del modello e dei token associato ai nodi LLM e agent. Gli span vengono esportati tramite OTLP/HTTP verso qualsiasi backend compatibile (Jaeger, Grafana Tempo, Honeycomb, Datadog) e il contesto di traccia W3C si propaga attraverso webhook in ingresso, HTTP in uscita e sub-workflow. Il tracing è disabilitato per impostazione predefinita e viene configurato tramite le [variabili d'ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; lo stato attivo è mostrato nella scheda Observability delle [Impostazioni](./user-settings.md).

Vedere anche [Cronologia delle esecuzioni](./execution-history.md), [Esecuzioni](../tabs/traces-tab.md) e [Webhooks](./webhooks.md).

### [Download e importazione](./download-import.md)

Esportare il workflow corrente come JSON dalla barra degli strumenti dell'Editor (pulsante Download); il file include nodi e archi. Importare trascinando un file JSON sulla scheda [Workflows](../tabs/workflows-tab.md) (crea un nuovo workflow) oppure sul canvas (sostituisce o unisce). Il JSON deve includere un array nodes; name ed edges sono opzionali. Utilizzarlo per backup, condivisione o migrazione tra istanze.

Vedere anche [Struttura del workflow](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) e [Funzionalità del canvas](./canvas-features.md).

### [Portal](./portal.md)

Il Portal espone i workflow come interfacce chat pubbliche su `/chat/{slug}`. Configurare portal_enabled, slug, autenticazione opzionale (utenti del portale), streaming e caricamento file per ciascun workflow. Gli utenti finali interagiscono tramite un'interfaccia chat senza effettuare l'accesso a Heym; gli output immagine possono essere visualizzati nella chat. I workflow del Portal possono inoltre passare alle pagine di revisione [Human-in-the-Loop](./human-in-the-loop.md) quando un [Nodo Agent](../nodes/agent-node.md) richiede approvazione, mentre il ramo `review` dell'agent invia notifiche ad altri canali. Utilizzarlo per strumenti interni, chatbot rivolti ai clienti e moduli basati su IA.

Vedere anche [Human-in-the-Loop](./human-in-the-loop.md), [Nodo Agent](../nodes/agent-node.md) e [Drive](./drive.md).

### [Generazione di file](./file-generation.md)

Le skill possono generare file quali PDF, DOCX, CSV, JSON e immagini durante l'esecuzione scrivendo nel workspace `_OUTPUT_DIR`. Heym acquisisce automaticamente tali file, li archivia ed espone i metadati di download sotto `_generated_files`, che possono poi essere gestiti con il [Nodo Drive](../nodes/drive-node.md) o consultati nella scheda [Drive](../tabs/drive-tab.md).

Vedere anche [Nodo Agent](../nodes/agent-node.md), [Drive](./drive.md) e [Nodo Drive](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive è il livello di archiviazione e condivisione condiviso per i file generati dalle skill. Consente di sfogliare i file, creare link pubblici o protetti da password, applicare scadenze e limiti di download, condividere file in sola lettura con i propri team e gestire tali file a livello di programmazione con il [Nodo Drive](../nodes/drive-node.md) oppure manualmente dalla scheda [Drive](../tabs/drive-tab.md).

Vedere anche [Drive](../tabs/drive-tab.md), [Generazione di file](./file-generation.md) e [Portal](./portal.md).

### [Sicurezza](./security.md)

Heym applica una policy sulle password (lunghezza, maiuscole, minuscole, cifre), archivia gli access token in cookie HttpOnly e ruota i refresh token all'uso. Il rate limiting si applica al login, alla registrazione e al login del [Portal](./portal.md). Le [Credenziali](./credentials.md) sono cifrate a riposo con AES-256 (Fernet). La chiave API di [MCP](../tabs/mcp-tab.md) è utilizzata per l'autenticazione del client; la sicurezza dei contenuti è disponibile tramite [Guardrails](./guardrails.md) sui nodi [LLM](../nodes/llm-node.md) e [Nodo Agent](../nodes/agent-node.md). Gli [Execution Tokens](./execution-tokens.md) forniscono JWT con ambito per singolo workflow destinati ai chiamanti esterni.

Vedere anche [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) e [Credenziali](./credentials.md).

### [Single Sign-On](./sso.md)

Heym autentica gli utenti tramite qualsiasi provider OpenID Connect esterno - Keycloak, Okta, Entra ID, Auth0, Google - configurato a runtime da **Impostazioni → SSO** da un amministratore dell'istanza elencato in `HEYM_ADMIN_EMAILS`. Vengono inseriti soltanto un issuer URL e le credenziali del client; ogni endpoint proviene dal documento di discovery del provider, pertanto nessun provider è hardcoded. L'accesso utilizza Authorization Code con PKCE e l'ID token viene verificato rispetto alle chiavi pubblicate dal provider. Gli account vengono mappati prima tramite `(issuer, subject)` e successivamente tramite email verificata, con auto-provisioning opzionale limitato a una allowlist di domini email. L'accesso tramite password rimane disponibile insieme al SSO e può essere disattivato una volta superato un test di connessione, con gli account in `HEYM_ADMIN_EMAILS` esentati affinché un provider configurato in modo errato non possa bloccare l'istanza.

Vedere anche [Impostazioni](./user-settings.md), [Sicurezza](./security.md) e [Audit Logging](./audit.md).
### [Distribuzione del carico](./cluster.md)

Puntare una seconda istanza di Heym allo stesso database e questa si unisce come worker. Le esecuzioni in background - cron, webhook, chiamate agli strumenti MCP, trigger della chat - vengono ripartite tra le istanze secondo una percentuale impostata da un amministratore dell'istanza in **Impostazioni → Istanze**, con lo stato, la latenza del database e la versione di ciascuna istanza raccolti in un'unica tabella. Le istanze non comunicano mai tra loro: è Postgres a veicolare il lavoro, pertanto un worker non necessita di porte aperte né di un percorso di ritorno verso l'istanza principale. Il lavoro che coinvolge file locali, un workspace dell'agente di coding o un plugin installato viene sempre eseguito sull'istanza principale, e il pannello riporta quanto ciò abbia inciso nelle ultime 24 ore, così che un operatore possa valutare quando le percentuali non sono di alcun aiuto. Ogni esecuzione nella cronologia indica l'istanza che l'ha eseguita, ed entrambe le finestre di dialogo della cronologia consentono di filtrare in base a essa.

Vedere anche [Impostazioni](./user-settings.md), [Esecuzioni](../tabs/traces-tab.md) e [Analytics](../tabs/analytics-tab.md).

### [Integrazioni di terze parti](./integrations.md)

Heym si connette a servizi esterni tramite credenziali memorizzate nella scheda [Credenziali](../tabs/credentials-tab.md) (cifrate a riposo). I tipi supportati includono OpenAI, Google, Decision Model per il [Nodo Decision](../nodes/decision-node.md), Model Router per la selezione automatica del modello (vedere di seguito), GitHub per il [Nodo GitHub](../nodes/github-node.md) e le integrazioni MCP, Jira per il [Nodo Jira](../nodes/jira-node.md), Notion per il [Nodo Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP per [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header e FlareSolverr per [Crawler](../nodes/crawler-node.md). Ciascun tipo documenta i campi obbligatori; le credenziali possono essere condivise con utenti o [team](./teams.md) e richiamate per nome nei nodi oppure come `$credentials.Name` nelle espressioni.

### Model Router (Auto Model)

Una credenziale **Model Router** seleziona il modello per ogni richiesta anziché conservare una chiave. Memorizza una credenziale Decision Model più un elenco delle credenziali OpenAI/Google/Custom esistenti, ciascuna con criteri che ne stabiliscono quando deve essere utilizzata, e compare in ogni selettore di modello con un unico modello denominato **Auto**.

Le Esecuzioni, il Log di esecuzione del canvas e la Span View mostrano entrambe le componenti della scelta, ad esempio `Auto Model / GPT-5`, mentre il costo resta attribuito al modello che ha effettivamente eseguito. Auto Model non può essere combinato con la Responses API, la modalità Batch o l'output di immagini. Per il comportamento completo, vedere [Credenziali](./credentials.md).

Vedere anche [Credenziali](./credentials.md), [Condivisione delle credenziali](./credentials-sharing.md) e [Team](./teams.md).

### [Guardrails](./guardrails.md)

I Guardrails bloccano i messaggi utente non sicuri o indesiderati prima che raggiungano un [LLM](../nodes/llm-node.md) o un [Nodo Agent](../nodes/agent-node.md). È possibile abilitarli per singolo nodo e selezionare le categorie da bloccare (ad es. violenza, incitamento all'odio, contenuti sessuali, autolesionismo, molestie, attività illecite). Impostare la sensibilità (bassa, media, alta). Quando vengono attivati, il nodo genera un errore che è possibile intercettare con un [Error Handler](../nodes/error-handler-node.md). Il rilevamento utilizza l'API di moderazione del provider o la classificazione LLM a seconda del tipo di credenziale.

Vedere anche [Sicurezza](./security.md), [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md) e [Error Handler](../nodes/error-handler-node.md).

### [Enterprise](./enterprise.md)

Enterprise comprende licenze commerciali, supporto professionale e servizi di deployment per i team che utilizzano Heym in produzione. Include assistenza sull'architettura dei workflow, onboarding, indicazioni su Kubernetes e scalabilità, supporto prioritario e sviluppo personalizzato su funzionalità avanzate quali [Nodo Agent](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Esecuzione parallela](./parallel-execution.md) e [Portal](./portal.md).

Vedere anche [Esecuzione e deployment](../getting-started/running-and-deployment.md), [Sicurezza](./security.md) e [Team](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work è una seconda interfaccia per i team aziendali basata su Heym. Gli utenti descrivono un lavoro, rispondono ad alcune domande e ottengono un workflow testato, per poi lavorare da pagine, approvazioni e un elenco Attività in cui ogni esecuzione ha un nome. Gli amministratori dell'istanza lo collegano in **Impostazioni → Heym Work** tramite il suo indirizzo e una chiave di integrazione; dispone di una propria licenza fornita dal team Heym.

Vedere anche [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) e [Human-in-the-Loop](./human-in-the-loop.md).

---

## Schede della Dashboard
### [Workflows](../tabs/workflows-tab.md)

La scheda Workflows è la vista predefinita della dashboard. Mostra un elenco a due pannelli: workflows e cartelle come righe compatte a sinistra, e un'anteprima del workflow selezionato a destra con il relativo trigger, l'ultima esecuzione e i passaggi, oltre a Open Workflow e Run Now. Ogni riga riporta un chip di stato (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) sul quale è possibile applicare un filtro tramite il menu a discesa Status. Un workflow privo di nodo trigger viene etichettato in base a come è stata avviata la sua esecuzione più recente - API per una chiamata HTTP, SubWorker per un workflow padre, Portal per la sua chat pubblica - e rimane Manual finché non è stato eseguito. Le cartelle e le sotto-cartelle gestiscono l'[organizzazione](./workflow-organization.md). Creare workflows con New Workflow, trascinare e rilasciare JSON per [importare](./download-import.md), e modificare o eliminare dalle azioni di riga. I workflows possono essere spostati tra le cartelle; l'eliminazione è pianificata (cestino) prima della rimozione definitiva.

Vedere anche [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) e [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Una board kanban agentica in cui le card sono job persistenti. Configurare ciascuna colonna con una catena ordinata di workflows; spostando una card nella colonna si esegue la catena con il contesto completo della card (contenuto, commenti, cronologia, output precedenti). I risultati vengono riscritti sulla card — verde in caso di successo, rosso in caso di errore, ambra durante l'esecuzione. I round successivi rieseguono la catena della colonna corrente con tutto quanto accumulato fino a quel momento, il che alimenta la pianificazione iterativa. Le esecuzioni vengono registrate in [Execution History](./execution-history.md) con l'origine del trigger `board`. Mentre l'esecuzione di una card è attiva, **Open live** apre quella specifica esecuzione sul canvas animato con i log di Debug incrementali.

Vedere anche [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) e [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

La scheda Templates consente di salvare e riutilizzare modelli di workflow (workflows completi) e modelli di nodo (singoli nodi configurati). Creare modelli di workflow dall'editor (Share as Template) e modelli di nodo facendo clic con il pulsante destro del mouse su un nodo. Sfogliare per visibilità (Everyone o utenti/[team](./teams.md) specifici), applicare un modello per creare un nuovo workflow o aggiungere un nodo al canvas, e gestire i modelli condivisi.

Vedere anche [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) e [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

La scheda Variables gestisce il [Global Variable Store](./global-variables.md). Creare, modificare ed eliminare variabili globali; impostare nome, valore e tipo di valore (Auto, String, Number, Boolean, Array, Object). Le variabili sono con ambito utente e persistono tra le esecuzioni. Farvi riferimento in qualsiasi [espressione](./expression-dsl.md) di workflow come `$global.variableName`. Le variabili possono essere condivise con altri utenti o [team](./teams.md).

Vedere anche [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) e [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

La scheda Chat è la superficie agente di lunga durata di Heym per operare nel workspace tramite conversazione. Selezionare una [credenziale](./credentials.md) e un modello, quindi chiedere a Chat di rispondere a domande, ispezionare le definizioni dei workflow, eseguire workflow esistenti, riepilogare esecuzioni e pianificazioni, riportare la cronologia di esecuzione di un singolo workflow (numero di esecuzioni, ripartizione per stato, ultima esecuzione e i dettagli di una esecuzione su richiesta), segnalare quali esecuzioni sono in corso in questo momento (con tempo trascorso, nodo corrente e un link a ciascuna esecuzione attiva), risolvere le revisioni umane in sospeso, creare e rivedere workflow con lo stesso motore AI Builder utilizzato nell'editor, oppure aggiungere card alle bacheche kanban con linguaggio naturale. Le nuove card iniziano sempre nella prima colonna della bacheca selezionata; quando sono disponibili più bacheche e nessuna è stata indicata, Chat presenta una selezione della bacheca prima di creare la card.

Chat continua a funzionare sul backend dopo la chiusura del browser. Mentre una risposta è in streaming, è possibile inviare altri messaggi; Heym li archivia in una coda supportata da database, consente di modificare o eliminare i messaggi in coda prima che vengano avviati e li esegue in ordine al termine della risposta corrente. Se l'assistente necessita di dettagli di pianificazione e restituisce domande di chiarimento, la coda si mette in pausa finché non si risponde a tali domande, quindi riprende dopo la risposta di pianificazione.

Le risposte vengono trasmesse in streaming con markdown, immagini inline, card di anteprima dei workflow, card comprimibili delle chiamate agli strumenti, utilizzo del contesto e compressione automatica del contesto. Chat supporta allegati, input vocale, riproduzione ad alta voce, azioni di copia, prompt rapidi, Regole utente da [Impostazioni](./user-settings.md) e [variabili globali](./global-variables.md) come contesto.

Vedere anche [Assistente IA](./ai-assistant.md), [Credenziali](./credentials.md) e [Impostazioni](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Guarda la demo di Chat</a></p>

### [Credenziali](../tabs/credentials-tab.md)

La scheda Credenziali gestisce le chiavi API e i segreti utilizzati dai nodi. Aggiungere credenziali per tipo (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, ecc.), assegnare loro un nome e farvi riferimento nei nodi del workflow. Modificare o eliminare dalla card; condividere con utenti tramite email o con [team](./teams.md). Tutti i valori sono cifrati a riposo e mascherati nell'interfaccia.

Vedere anche [Credenziali](./credentials.md), [Condivisione delle credenziali](./credentials-sharing.md) e [Integrazioni di terze parti](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Guarda la demo di Credenziali</a></p>

### [Archivi vettoriali](../tabs/vectorstores-tab.md)

La scheda Archivi vettoriali gestisce gli archivi vettoriali utilizzati dai nodi [RAG](../nodes/rag-node.md). Creare un archivio con un nome e una [credenziale](./credentials.md) per l'archivio vettoriale — *RAG: Qdrant + OpenAI* (Qdrant esterno) oppure *RAG: Psql + OpenAI* (il Postgres di Heym tramite pgvector), che determina il backend dell'archivio — facoltativamente impostare un nome di collezione, quindi caricare documenti (PDF, TXT, ecc.). Gestire il contenuto (visualizzare, eliminare le fonti), modificare i dettagli dell'archivio e condividere gli archivi con gli utenti. In un nodo [RAG](../nodes/rag-node.md), selezionare il Database, scegliere l'archivio vettoriale ed eseguire operazioni di inserimento, upsert, eliminazione o ricerca.

Vedere anche [Qdrant RAG](../nodes/rag-node.md), [Credenziali](./credentials.md) e [Team](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Guarda la demo di Archivi vettoriali</a></p>
### [MCP](../tabs/mcp-tab.md)

La scheda MCP configura l'integrazione con il Model Context Protocol. Heym supporta due modalità:

**Server predefinito** – Un singolo endpoint su `/api/mcp/sse` espone tutti i Workflow abilitati a MCP. Consente di visualizzare e rigenerare la propria chiave API, copiare il JSON del client pronto all'uso, connettere Cursor con un solo clic oppure seguire il flusso di configurazione di Claude con registrazione OAuth automatica.

**Server denominati** – Consente di creare più endpoint MCP isolati, ciascuno con il proprio URL basato su UUID (`/api/mcp/servers/{uuid}/sse`) e una chiave API indipendente. Assegnare Workflow specifici a ciascun server affinché client IA o team diversi vedano soltanto gli strumenti di cui necessitano. Ogni server denominato supporta gli stessi metodi di autenticazione (chiave API, Claude OAuth) e dispone delle proprie scorciatoie Copy JSON e Add to Cursor. Entrambi gli endpoint supportano il trasporto SSE (GET) e il trasporto Streamable HTTP (POST). L'attivazione o disattivazione di un Workflow all'interno di un server denominato lo sposta in cima all'elenco assegnato, in modo che la riga modificata rimanga visibile.

**Strumento Chat di Heym** – Entrambe le modalità possono inoltre esporre il motore [Chat](../tabs/chat-tab.md) come singolo strumento `heym_chat`, attivabile per ciascuna superficie con le proprie Credenziali LLM e il proprio modello (precompilati dal modello preferito in [Impostazioni](./user-settings.md)). Un client MCP invia un singolo `message` in linguaggio naturale e il motore si occupa del resto: creazione di Workflow in modalità build (salvataggio, fino a cinque esecuzioni di test, correzione e verifica), esecuzione di Workflow, analisi, Esecuzioni, stato di esecuzione in tempo reale, Pianificazioni, board e card, team, Variabili globali, ricerca nella documentazione e decisioni human-in-the-loop. Le funzionalità aggiunte successivamente a Chat sono raggiungibili tramite lo stesso strumento senza alcuna registrazione aggiuntiva. Ogni chiamata viene memorizzata nella Cronologia della scheda Chat come conversazione contrassegnata da un plug e restituisce un `conversation_id` che il client può reinviare per proseguire il thread.

Vedere anche [Architettura degli Agent](./agent-architecture.md), [Nodo Agent](../nodes/agent-node.md) e [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Esecuzioni](../tabs/traces-tab.md)

La scheda Esecuzioni mostra le tracce di esecuzione di [LLM](../nodes/llm-node.md). Un'intestazione statistiche sopra l'elenco riepiloga l'intervallo temporale selezionato con card KPI (Chiamate, Token, Costo, Latenza media, % errori) e tre grafici — Token per modello, Costo per modello e Chiamate nel tempo (impilate successi vs errori). Un unico selettore **Intervallo temporale** (1h / 24h / 7d / 30d / Tutto; predefinito 7 giorni) filtra insieme sia i grafici sia l'elenco. Il costo è calcolato dalla [Tabella costi LLM](../tabs/datatable-tab.md#llm-cost-table-system-table) per utente; i modelli privi di prezzi vengono segnalati con un avviso inline che rimanda a essa. Aprire una qualsiasi traccia per visualizzare i payload di richiesta e risposta, la ripartizione dei tempi (llm_ms, tools_ms, mcp_list_ms), le chiamate agli strumenti (nome, argomenti, risultato) e le skill incluse. Gli eventi espansi mostrano il JSON — inclusi i payload MCP e JSON-RPC — come albero comprimibile con il primo livello aperto per impostazione predefinita; **Tree / Raw** ripristina il testo originale e il JSON malformato rimane leggibile. Utilizzare le tracce per il debug del comportamento del [Nodo Agent](../nodes/agent-node.md) e di [LLM](../nodes/llm-node.md) e per copiare o esportare i payload.

Vedere anche [Cronologia esecuzioni](./execution-history.md), [Nodo Agent](../nodes/agent-node.md) e [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Avvisi](../tabs/alerts-tab.md)

La scheda Avvisi definisce condizioni di soglia su una finestra temporale e segnala quando vengono superate. Quattro tipi di avviso coprono le domande che gli operatori pongono effettivamente: **soglia di errore** (ha fallito più di N volte nella finestra), **durata del workflow** (le esecuzioni sono diventate più lente, misurata come valore massimo, medio o p95), **costo in token / USD** (la spesa ha superato un budget, risolto tramite la stessa tabella di prezzi delle [Esecuzioni](../tabs/traces-tab.md)) e **conteggio delle esecuzioni** (è stato eseguito molto più spesso di quanto dovrebbe). Ogni tipo viene valutato su una finestra scelta dall'utente, mai su un singolo evento, perché un'esecuzione fallita è rumore e una raffica è un incidente. Gli avvisi monitorano un workflow o tutti i workflow a cui si ha accesso.

Una procedura guidata in cinque passaggi accompagna attraverso tipo, ambito, condizione, risposta e revisione. Il passaggio di Revisione esegue un **backtest** della condizione, riportando con quale frequenza sarebbe scattata nelle ultime 24 ore fino a 7 giorni, così una soglia troppo bassa viene individuata prima del salvataggio anziché dopo che ha allertato qualcuno. Descrivere ciò che si desidera in linguaggio naturale e l'IA compila ogni passaggio possibile, contrassegnando le proprie ipotesi; una richiesta parziale fa comunque avanzare la procedura guidata, aprendosi sul primo passaggio che richiede ancora una decisione anziché costringere a ricominciare. Per impostazione predefinita un avviso scatta una volta e rimane silente finché la metrica non si ripristina; in alternativa è possibile farlo ripetere a intervalli.

Nel passaggio di risposta un avviso può creare e assegnare un nuovo workflow da eseguire quando scatta, utilizzarne uno già esistente oppure non fare nulla. Il payload di attivazione trasporta il valore osservato, la soglia, la finestra e i workflow che hanno contribuito al valore, ed è così che gli avvisi raggiungono Slack, l'email o Telegram utilizzando nodi già disponibili. La cronologia delle attivazioni registra ciò che era vero nel momento in cui ciascun avviso è scattato ed è conservata per 90 giorni; prendere atto di un'attivazione cambia il badge da Attivo a Preso atto senza simulare che la condizione sia stata risolta. La scheda [Chat](../tabs/chat-tab.md) può rispondere su quali avvisi esistono e perché o quando uno è stato attivato. Gli avvisi possono essere condivisi con utenti e [team](../tabs/teams-tab.md).

Vedere anche [Analytics](../tabs/analytics-tab.md), [Esecuzioni](../tabs/traces-tab.md) e [Cronologia delle esecuzioni](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

La scheda Analytics mostra metriche e tendenze delle esecuzioni. Le statistiche di riepilogo includono esecuzioni totali, tasso di successo, tasso di errore, ripartizione della latenza e **Tempo risparmiato** totale (la somma dei minuti stimati risparmiati per esecuzione di ciascun workflow × le sue esecuzioni riuscite). Più utilizzati elenca la stessa somma per workflow. Selezionare un intervallo temporale di base (24h, 7g, 30g o tutto), facoltativamente filtrare per workflow, quindi trascinare su qualsiasi grafico per approfondire un intervallo di date selezionato. I grafici e le tabelle dei workflow si aggiornano in base alla selezione e l'aggiornamento automatico mantiene le metriche aggiornate. Integra la [Cronologia delle esecuzioni](./execution-history.md) e la vista [Pianificazioni](../tabs/scheduled-tab.md) quando occorre consultare sia i risultati passati sia le esecuzioni future.

Vedere anche [Cronologia delle esecuzioni](./execution-history.md), [Pianificazioni](../tabs/scheduled-tab.md) e [Valutazioni](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Guarda la demo di Analytics</a></p>
### [Dashboard](../tabs/dashboard-tab.md)

La scheda Dashboard è uno spazio in stile Grafana in cui si costruiscono griglie di widget grafici, ciascuno renderizzato dal proprio workflow Heym nascosto. Si possono mantenere tutti i dashboard necessari e condividerli con utenti o team, in sola lettura o modificabili; i widget vengono sempre eseguiti con le credenziali del proprietario, così tutti visualizzano gli stessi dati. Descrivere una metrica in linguaggio naturale e l'IA genera il widget, oppure aggiungerne uno manualmente e scegliere un tipo di grafico, con anteprima basata su dati di esempio: barre, linee, area, torta, tabella, numerico, indicatore, dispersione, proporzione, barre indicatore, testo o HITL. HITL è un carosello delle revisioni umane in sospeso. L'intestazione mostra `1/n pending`. Il nome del workflow apre tale esecuzione sul canvas. **Approve**, **Request changes** e **Reject** la risolvono, e l'icona della cronologia accanto al titolo del widget apre tale esecuzione nella finestra di dialogo della cronologia sulla stessa pagina. I widget memorizzano nella cache i propri risultati, possono essere ottimizzati con l'IA (ogni modifica viene salvata nella [Cronologia modifiche](./edit-history.md)), clonati insieme al loro workflow completo, riorganizzati con Tidy up e trascinati o ridimensionati in modalità modifica. Le tabelle possono mostrare chip di stato e collegare le proprie righe a una dashboard di dettaglio che legge il record della riga cliccata come `$page.record`, mentre un widget Run esegue un workflow dalla dashboard: su un file trascinato, con i relativi campi di input o tramite un pulsante Esegui. Poiché ogni widget è un workflow, qualsiasi dato sia possibile recuperare — una chiamata [HTTP](../nodes/http-node.md), una query [BigQuery](../nodes/bigquery-node.md), una ricerca [RAG](../nodes/rag-node.md) o un output [LLM](../nodes/llm-node.md) — può diventare un grafico. Le impostazioni di un widget HITL possono limitarlo alle revisioni di un singolo workflow o a un passaggio di approvazione dell'agente o di Slack al suo interno; tale widget le mostra a tutti coloro che possono aprire quel workflow ed è nascosto per chiunque non possa farlo.

Vedere anche [Nodo Chart Output](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) e [Cronologia esecuzioni](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>

### [Valutazioni](../tabs/evals-tab.md)

La scheda Valutazioni (in `/evals`) consente di creare suite di valutazione, aggiungere o generare casi di test, ottimizzare il prompt della suite ed eseguire valutazioni su workflow con [Nodo Agent](../nodes/agent-node.md). Selezionare uno o più modelli, scegliere un metodo di punteggio (Exact Match, Contains o LLM-as-Judge), facoltativamente lasciare che un modello separato o un [Modello di decisione](../nodes/decision-node.md) valuti le risposte LLM-as-Judge, impostare le esecuzioni per test (oltre a temperature e reasoning effort per Exact Match e Contains), quindi confrontare esito positivo/negativo e output per modello. Consultare la cronologia delle esecuzioni per le valutazioni passate, incluso il giudice utilizzato da ciascuna esecuzione, rieseguirne una con lo stesso giudice, esportarla come JSON e verificare il comportamento sottostante nelle [Esecuzioni](../tabs/traces-tab.md).

Vedere anche [Nodo Agent](../nodes/agent-node.md), [Esecuzioni](../tabs/traces-tab.md) e [Cronologia esecuzioni](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Team](../tabs/teams-tab.md)

La scheda Team consente di creare e gestire i team. Creare un team, aggiungere membri tramite email e rimuovere membri (il creatore non può essere rimosso). Condividere [workflow](../tabs/workflows-tab.md), [modelli](../tabs/templates-tab.md), [credenziali](../tabs/credentials-tab.md), [variabili](../tabs/global-variables-tab.md), [archivi vettoriali](../tabs/vectorstores-tab.md) e [file Drive](../tabs/drive-tab.md) con i team dalle rispettive finestre di dialogo di condivisione; tutti i membri del team ottengono l'accesso. Modificare nome e descrizione del team oppure eliminare il team (rimuove tutte le condivisioni del team).

Vedere anche [Team](./teams.md), [Condivisione credenziali](./credentials-sharing.md) e [Organizzazione dei workflow](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Pianificazioni](../tabs/scheduled-tab.md)

La scheda Pianificazioni mostra tutti i workflow [Cron](../nodes/cron-node.md) attivi su un calendario visuale. Passare tra le viste giorno, settimana e mese per vedere quando sono pianificate le automazioni, quindi tornare al [workflow](../tabs/workflows-tab.md) correlato quando occorre modificare la pianificazione.

Vedere anche [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) e [Cronologia esecuzioni](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>
### [Log](../tabs/logs-tab.md)

La scheda Log mostra i log dei container Docker dello stack Heym (backend, frontend, PostgreSQL). Consente di selezionare uno o più container, filtrare per livello di log (All, INFO, WARNING, ERROR, DEBUG) e cercare all'interno dei log. La si utilizza per il debug e la risoluzione dei problemi. Per i log di esecuzione dei Workflow (risultati dei nodi, output), utilizzare invece la [Cronologia delle esecuzioni](./execution-history.md), le [Esecuzioni](../tabs/traces-tab.md) o il pannello Debug nell'editor.

Vedere anche [Cronologia delle esecuzioni](./execution-history.md), [Esecuzioni](../tabs/traces-tab.md) e [Funzionalità del Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Tabella dati](../tabs/datatable-tab.md)

La scheda Tabella dati consente di creare e gestire tabelle di dati strutturate all'interno di Heym. È possibile definire colonne tipizzate (string, number, boolean, date, JSON), gestire le righe con modifica inline tramite doppio clic, importare/esportare CSV e condividere le tabelle con utenti o [team](./teams.md) con permessi di lettura/scrittura. Utilizzare il [nodo Tabella dati](../nodes/datatable-node.md) per accedere alle tabelle in modo programmatico all'interno dei Workflow. Una sezione **Tabelle di sistema** fissata in alto ospita la **Tabella dei costi LLM**: una vista a schema fisso dei prezzi per modello, popolata da Helicone in background (TTL di 24 ore, aggiornamento manuale), in cui ciascun utente può sovrascrivere i prezzi o aggiungere righe personalizzate per i modelli non elencati da Helicone. Queste regole di prezzo alimentano il KPI dei costi e il grafico dei costi per modello nella scheda [Esecuzioni](../tabs/traces-tab.md).

Vedere anche [nodo Tabella dati](../nodes/datatable-node.md), [Esecuzioni](../tabs/traces-tab.md), [Struttura del Workflow](./workflow-structure.md) e [Team](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

### [Drive](../tabs/drive-tab.md)

La scheda Drive mostra tutti i file generati dalle skill all'interno dei Workflow. Elenca ciascun file con nome, tipo, dimensione, nodo di origine, data di creazione e stato di condivisione con il team, e fornisce controlli di ricerca, download autenticato, condivisione, eliminazione e paginazione. È la dashboard complementare a [Generazione di file](./file-generation.md), al riferimento [Drive](./drive.md) e al [nodo Drive](../nodes/drive-node.md).

Vedere anche [Drive](./drive.md), [Generazione di file](./file-generation.md) e [nodo Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Watch Drive demo</a></p>

### [Collaborazione sul Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).

# Perché Heym

Heym è l'infrastruttura per eseguire e governare gli agenti IA in produzione. Un unico runtime self-hosted copre ogni fase del ciclo di vita degli agenti.

Un agente prototipale richiede un modello, un prompt e alcuni strumenti. Un agente in produzione necessita inoltre di trigger e retry, stato salvato quando si mette in pausa in attesa di una persona, una registrazione di ogni chiamata a modello e strumento, un costo per ogni esecuzione, test prima del rilascio di una modifica e limiti chiari su ciò che può fare autonomamente. Heym custodisce tutto questo in un unico luogo, affinché il sistema progettato sul canvas sia il sistema che viene eseguito. Costruire sistemi agentici, quindi eseguirli con fiducia.

## Un unico Runtime per il Ciclo di Vita degli Agenti

| Fase | Cosa offre Heym |
|---|---|
| **Build** | Comporre agenti e passaggi deterministici sul canvas, generarli con l'[AI Assistant](../reference/ai-assistant.md), oppure partire da [Modelli](../tabs/templates-tab.md) e skill portabili. |
| **Orchestrate** | Coordinare agenti, [sub-agenti](../reference/agent-architecture.md), agenti di coding, RAG, automazione browser e strumenti con flusso di dati esplicito ed [esecuzione parallela](../reference/parallel-execution.md). |
| **Run** | Avviare esecuzioni da [webhook](../reference/webhooks.md), pianificazioni e [trigger](../reference/triggers.md) di eventi, con retry per nodo, [gestione degli errori](../nodes/error-handler-node.md) e [distribuzione del carico](../reference/cluster.md) tra le istanze. |
| **Observe** | Ispezionare ogni esecuzione tramite [cronologia](../reference/execution-history.md), [tracce LLM](../tabs/traces-tab.md), costo in USD per esecuzione, esecuzioni live sul canvas, [analytics](../tabs/analytics-tab.md), [avvisi](../tabs/alerts-tab.md) ed esportazione [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluate** | Testare prompt e modelli rispetto agli output attesi nelle [Valutazioni](../tabs/evals-tab.md), con scoring LLM-as-Judge e confronto affiancato dei modelli. |
| **Control** | Mantenere gli esseri umani nel controllo con [checkpoint di revisione](../reference/human-in-the-loop.md) e [guardrail](../reference/guardrails.md), e governare l'accesso con [credenziali](../reference/credentials.md) cifrate, [team](../reference/teams.md), [single sign-on](../reference/sso.md) e una [traccia di audit](../reference/audit.md). |
| **Expose** | Servire i workflow tramite REST e [SSE](../reference/sse-streaming.md), come strumenti [MCP](../tabs/mcp-tab.md), come interfacce chat [Portal](../reference/portal.md) e come widget della [dashboard](../tabs/dashboard-tab.md). |

## Build

### AI Assistant: costruire Workflow con il Linguaggio Naturale

L'[AI Assistant](../reference/ai-assistant.md) è un pannello di chat all'interno dell'editor dei workflow. Descrivere ciò che si desidera, ad esempio "crea un workflow che riceve input dall'utente, cerca nella mia knowledge base e risponde usando GPT-4o", e l'assistente genera nodi e archi che vengono applicati istantaneamente al canvas.

- Utilizza la propria credenziale LLM (qualsiasi modello supportato)
- Supporta l'**input vocale** per la progettazione dei workflow a mani libere
- Applica automaticamente al canvas il JSON valido del workflow proveniente dalla risposta dell'IA
- Trasmette le risposte in tempo reale

L'assistente opera direttamente all'interno dell'editor e trasmette i nodi sul canvas in tempo reale; tutto ciò che genera rimane modificabile come i nodi posizionati manualmente.

### Sistema di Skill

Le skill sono bundle di capacità portabili, un file di istruzioni `SKILL.md` più script Python opzionali, che possono essere inseriti su qualsiasi Nodo Agent.

- Le istruzioni della skill vengono anteposte al prompt di sistema dell'agente
- I file Python nella skill diventano strumenti richiamabili
- Le skill sono riutilizzabili tra i workflow e condivisibili come archivi `.zip`

Ciò equivale a fornire al proprio agente una descrizione del ruolo e una cassetta degli attrezzi in un unico inserimento.

### Workflow Analyzer: feedback consapevole dell'esecuzione

Il pannello [Workflow Analysis](../reference/workflow-analysis.md) è uno strumento di documentazione e feedback consapevole dell'esecuzione, integrato nell'editor. Fare clic su **Analyze**, scegliere una credenziale LLM e un modello, e Heym genera un report Markdown modificabile per il workflow corrente.

A differenza di una nota statica, l'analyzer esegue dapprima il workflow quando possibile e include il risultato dell'esecuzione nel prompt. Il report copre le aree di miglioramento, lo scopo del workflow e una spiegazione passo passo di ciò che fanno i nodi. Quando esiste già un report, **Reanalyze** trasmette un'anteprima separata, così è possibile accettare la nuova versione o mantenere il documento condiviso corrente.

## Orchestrate

### Nodi LLM e Agent integrati

Il [Nodo Agent](../nodes/agent-node.md) di Heym esegue un ciclo di tool calling strettamente integrato con tool Python inline, connessioni MCP e un sistema di skills portabile, il tutto progettato per agenti in produzione.

Anche il semplice [nodo LLM](../nodes/llm-node.md) di Heym va oltre il singolo passaggio prompt-risposta. Per gli endpoint OpenAI e OpenAI-compatibili supportati, può passare in **modalità Batch API**, così un singolo nodo invia un array di prompt in una richiesta batch nativa del provider a costo ridotto. Il Canvas espone quindi un ramo dedicato `batchStatus` che si attiva man mano che il batch attraversa stati come `pending`, `processing` e `completed`.

Ciò significa che il nodo LLM può fare due cose contemporaneamente:

- Eseguire la richiesta batch principale e restituire gli output finali per singolo elemento sul ramo normale
- Attivare logica di notifica o logging a ogni aggiornamento significativo dello stato del batch, senza trasformare il flusso in un ciclo di polling personalizzato

L'esecuzione batch è una primitiva di workflow LLM di primo livello, con verifiche delle capacità del provider e del modello direttamente nella UI del nodo.

Il **Nodo Agent** è il cuore dell'orchestrazione degli agenti in Heym:

- **Tool calling** – L'agente itera sulle chiamate ai tool in un ciclo finché non produce una risposta finale
- **Tool Python** – Definire tool personalizzati inline con Python completo; l'agente li richiama a runtime
- **Connessioni MCP** – Connettersi a qualsiasi server [Model Context Protocol](https://modelcontextprotocol.io/) (stdio o SSE) e l'agente ottiene automaticamente tutti i suoi tool
- **Skills** – Trascinare un file `.zip` o `.md` su un agente per estenderne il contesto di sistema e aggiungere tooling Python
- **Chiamate a sub-workflow** – L'agente può invocare altri workflow Heym come tool, componendo comportamenti complessi senza codice personalizzato

Consultare [Agent Node](../nodes/agent-node.md) e [Agent Architecture](../reference/agent-architecture.md) per il riferimento completo.

### Orchestrazione multi-agente

Heym supporta un **pattern orchestrator** con primitive visuali di primo livello:

- Un agente funge da **orchestrator** (`isOrchestrator: true`) e riceve un tool `call_sub_agent`
- Delega i task a **sub-agenti** denominati sullo stesso Canvas
- I sub-agenti possono a loro volta chiamare altri agenti o sub-workflow (profondità massima: 5)
- **Esecuzione parallela**: quando l'orchestrator chiama più sub-agenti nello stesso turno, questi vengono eseguiti in parallelo per ottenere risultati più rapidi

Ciò abilita architetture come un agente di pianificazione che instrada il lavoro verso un ricercatore, un programmatore e un sintetizzatore, il tutto collegato visivamente senza codice di orchestrazione personalizzato.

Consultare [Agent Architecture](../reference/agent-architecture.md) per i dettagli di esecuzione.

### Agenti di coding come nodi di workflow

Heym include due nodi che eseguono un vero agente di coding come step di workflow, non come chat completion:

- **[Nodo Codex](../nodes/codex-node.md)** – Esegue la CLI di OpenAI Codex in un workspace Heym isolato su un repository GitHub. Supporta **Sign in with ChatGPT** (OAuth PKCE sul proprio abbonamento Plus/Pro, senza costo API per token) oppure un access token, clona il repository, consente a Codex di modificare il codice e restituisce `summary`, `diff`, `changedFiles` e un `pullRequestUrl` in bozza.
- **[Nodo OpenCode Go](../nodes/opencode-go-node.md)** – Lo stesso flusso di repository attraverso il gateway OpenCode agnostico rispetto al provider (Kimi, DeepSeek, Qwen e altri), eseguito in un **container usa-e-getta irrobustito**: tutte le capability rimosse, root in sola lettura, limiti di pid/memoria/CPU. Il token GitHub rimane fuori dalla sandbox: Heym esegue ogni operazione git e GitHub lato host, così il codice generato non può esfiltrare le credenziali di push.

Ciò significa che un workflow può fare triage di un bug da un Webhook, passare il repository a un agente di coding, attendere la PR in bozza e pubblicare il link su Slack, completamente automatizzato, con limiti di risorse configurabili per ogni deployment.

### Pipeline RAG integrata

Heym include un [Nodo RAG / Vector Store](../nodes/rag-node.md) e una scheda gestita [Vectorstores](../tabs/vectorstores-tab.md). È possibile:

- Scegliere il backend vettoriale: **Qdrant** (server esterno) oppure **Postgres (pgvector)**, che archivia i vettori nel database di Heym senza servizi aggiuntivi da eseguire
- Inserire documenti in un archivio vettoriale direttamente da un nodo di workflow
- Eseguire ricerca semantica e alimentare i risultati verso un nodo LLM o Agent
- Referenziare i risultati con espressioni come `$ragNode.results.map("item.payload.content").join("\n\n")`

In Heym, il RAG è composto da due nodi con pieno controllo su embedding e retrieval.

### Automazione del browser con Playwright

Il [nodo Playwright](../nodes/playwright-node.md) è l'automazione del browser first-party sul Canvas.

- **Modalità Steps** – Comporre visivamente azioni di navigate, click, type, fill, screenshot, extract e scroll
- **Step AI con auto-heal** – Descrivere un'azione in linguaggio naturale e un LLM genera le azioni Playwright; i selettori non funzionanti possono essere riparati automaticamente e gli step generati possono essere messi in cache per saltare le future chiamate LLM
- **Modalità Run Code** – Passare il nodo a Playwright Python completo per flussi complessi (disabilitata per impostazione predefinita; viene eseguita nella sandbox irrobustita di Heym quando abilitata)
- **Sessioni autenticate** – Ripristinare cookie/`storageState` prima dell'esecuzione, verificare il login con un controllo tramite selettore e ricadere su step di login scriptati
- **Cattura di rete** – Raccogliere opzionalmente risposte JSON, header, cookie e storage del browser insieme ai risultati

Heym tratta il browser come un nodo normale, con le stesse espressioni, credenziali e gestione degli errori di tutto il resto.

### Expression DSL

La [Expression DSL](../reference/expression-dsl.md) di Heym fornisce una sintassi chiara e potente per fare riferimento ai dati dei nodi a monte:

- `$input.text` – Dati del nodo Input
- `$nodeName.field` – Campo di output di qualsiasi nodo a monte
- `$global.variableName` – Variabili globali persistenti
- Helper per array: `.first()`, `.map("field")`, `.join("\n")`

Le espressioni funzionano in ogni campo stringa, inclusi prompt, header HTTP, condizioni e valori impostati, così i dati si spostano tra i passaggi in modo esplicito. La DSL bilancia potenza e leggibilità senza richiedere una conoscenza completa di JavaScript.

## Esecuzione

### Trigger, Retry e Percorsi di Errore

Un workflow può essere avviato da molti punti. I nodi [Input](../nodes/input-node.md) ricevono [webhook](../reference/webhooks.md) HTTP, [Cron](../nodes/cron-node.md) viene eseguito secondo una pianificazione, e i [trigger](../reference/triggers.md) di evento avviano esecuzioni da Telegram, Discord, Slack, caselle IMAP, stream WebSocket, code RabbitMQ, caricamenti di file ed eventi della piattaforma Heym.

I fallimenti vengono gestiti all'interno del grafo. Qualsiasi nodo può ritentare in caso di errore con un numero definito di tentativi e un'attesa tra essi, ogni tentativo viene registrato nella [cronologia delle esecuzioni](../reference/execution-history.md), e un nodo [Error Handler](../nodes/error-handler-node.md) viene eseguito automaticamente quando un nodo fallisce, così il ripristino è parte integrante del workflow stesso.

### Esecuzione Parallela del DAG

L'esecutore di workflow di Heym utilizza uno scheduler a grafo aciclico diretto (DAG). I nodi indipendenti vengono eseguiti in parallelo automaticamente, senza necessità di configurazione.

- I nodi allo stesso livello di dipendenza vengono inviati contemporaneamente a un thread pool (`max_workers=8`)
- Non appena un nodo termina, i suoi nodi a valle vengono pianificati
- Il [Merge Node](../nodes/merge-node.md) combina i risultati dei rami paralleli
- Più esecuzioni di workflow vengono eseguite contemporaneamente; ogni esecuzione è completamente isolata

Il parallelismo è il comportamento predefinito, determinato dalla struttura del grafo.

Vedere [Esecuzione Parallela](../reference/parallel-execution.md).

### Scalabilità su Più Istanze

Puntare una seconda istanza di Heym allo stesso database PostgreSQL e questa si unisce come worker. Le esecuzioni in background vengono condivise tra le istanze secondo i pesi impostati, un leader eletto mantiene pianificazioni, valutazione degli avvisi e ripristino da crash attraverso un failover, e ogni esecuzione registra l'istanza che l'ha eseguita. Vedere [Distribuzione del Carico](../reference/cluster.md).

### Board Kanban Agentico

La [scheda Board](../tabs/board-tab.md) è una board Kanban integrata in cui le colonne stesse eseguono workflow. Una card è un job agentico persistente che porta con sé contesto, cronologia della conversazione, stato di esecuzione, output ed esecuzioni di workflow.

- **Catene di workflow per colonna** – Spostare una card in una colonna attiva la catena di workflow di quella colonna; un **Agentic Kanban Model** (la propria credenziale + modello) mappa il contenuto della card negli input del workflow e trasforma gli output in testo leggibile
- **Allegati delle card** – Trascinare file su una card; i documenti vengono estratti in testo e le immagini vengono passate a modelli con capacità di visione prima di ogni esecuzione
- **Canvas di esecuzione live** – Aprire l'esecuzione attiva all'interno di una card e osservarla eseguire sul canvas reale del workflow, nodo per nodo
- **Condivisione con il team** – Condividere board con utenti o team con permessi di lettura/scrittura; le catene sulle board condivise vengono eseguite con le credenziali del proprietario, così i collaboratori non necessitano mai delle proprie
- **Visibilità dei fallimenti** – Le card fallite mostrano un indicatore della cronologia degli errori, e le esecuzioni successive possono mettersi in pausa in attesa di commenti

La board è una superficie nativa della piattaforma: card, workflow, credenziali ed esecuzioni live risiedono tutte in un unico posto.

### Heym Drive: Archiviazione File Integrata

La [scheda Drive](../tabs/drive-tab.md) è un archivio file integrato nella piattaforma. I file generati da skill e workflow (PDF, DOCX, CSV, immagini) vi arrivano automaticamente, e anche gli allegati delle card della board vengono archiviati lì.

- **Link di condivisione** – Link di download pubblici o protetti da password (Basic Auth) con scadenza opzionale e limiti massimi di download
- **Condivisione con il team** – Condividere file in sola lettura con i propri team, e rimuovere tutte le condivisioni di team con una sola azione
- **Azioni in blocco** – Selezione multipla con intervalli tramite shift-click, raggruppare le selezioni in un singolo download ZIP, oppure applicare una singola impostazione di condivisione/password/eliminazione a più file contemporaneamente
- **Accesso degli agenti** – Le skill possono optare per la lettura dei file del Drive, così un agente può lavorare sui documenti prodotti da voi o da altri workflow

Gli artefatti generati ottengono una sede permanente e condivisibile all'interno della piattaforma.

## Osservazione

### Tracce LLM

La [scheda Tracce](../tabs/traces-tab.md) fornisce piena osservabilità per ogni chiamata LLM:

- Payload di richiesta e risposta
- Tempistiche per chiamata: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nomi delle chiamate agli strumenti, argomenti e risultati
- Skill passate al modello

Il sistema di tracce è progettato appositamente per il debug del comportamento agentico, con payload completi di richiesta e risposta e tempistiche per chiamata.

### Tracciamento dei costi dei Token LLM

Ogni chiamata LLM in Heym viene automaticamente valorizzata. La [Scheda Tracce](../tabs/traces-tab.md) mostra i conteggi dei token di input e output per singola traccia insieme a un costo in USD in tempo reale, derivato da una tabella prezzi sincronizzata.

- **Costo per traccia** – Token di input, token di output e totale in USD visualizzati su ogni riga della traccia
- **Analisi dei costi** – Le card KPI e il grafico dei costi per modello si aggiornano in base all'intervallo temporale selezionato (1h / 24h / 7d / 30d / Tutto)
- **Tabella costi LLM** – Una tabella di sistema nella [Scheda Tabelle dati](../tabs/datatable-tab.md) viene popolata da Helicone ogni 24 ore; è possibile sovrascrivere i prezzi o aggiungere righe personalizzate per modelli non ancora elencati
- **Avviso prezzo mancante** – Le tracce relative a modelli privi di una voce di prezzo mostrano un avviso inline con un link diretto alla tabella dei costi

Ogni esecuzione porta con sé il proprio costo in USD, suddiviso per modello.

### Aprire Esecuzioni di Produzione su un Canvas Live

Un workflow di produzione rimane ispezionabile dopo l'avvio al di fuori dell'editor. Aprire qualsiasi voce in stato **Running** da uno dei due dialoghi della Cronologia, oppure aprire l'esecuzione attiva all'interno di una card dell'Agentic Kanban, e Heym collegherà il normale editor dei workflow a quella specifica esecuzione.

- I nodi già completati appaiono immediatamente con i loro risultati
- Il nodo corrente e i nodi downstream in attesa continuano a pulsare man mano che l'esecuzione avanza
- Il pannello Debug riceve gli stessi risultati incrementali dei nodi di un'esecuzione avviata dal canvas
- L'output finale e le evidenziazioni dell'esecuzione arrivano senza polling né avvio di un'esecuzione duplicata
- La chiusura dell'editor disconnette solo l'osservatore; non annulla mai il workflow di produzione

L'osservatore utilizza SSE supportato da uno snapshot di esecuzione cross-worker, quindi funziona per trigger di tipo webhook, schedule, chat, MCP, integrazione e Board anche quando un altro worker backend possiede l'esecuzione.

### OpenTelemetry, Analisi e Avvisi

Heym emette span [OpenTelemetry](../reference/opentelemetry.md) per ogni esecuzione di workflow, esecuzione di nodo e invocazione di strumenti dell'Agent, esportati tramite OTLP/HTTP verso Jaeger, Grafana Tempo, Honeycomb, Datadog o qualsiasi altro backend compatibile.

La scheda [Analisi](../tabs/analytics-tab.md) traccia conteggi delle esecuzioni, tasso di successo, durata e tendenze per singolo workflow. Gli [Avvisi](../tabs/alerts-tab.md) monitorano conteggi degli errori, durata delle esecuzioni, spesa in token o USD e volume di esecuzioni su una finestra temporale, quindi eseguono un workflow di notifica scelto dall'utente, così un avviso raggiunge Slack, email, Telegram o qualsiasi altro canale raggiungibile da un nodo.

## Valutare

### Valutazioni Integrate

La [Scheda Valutazioni](../tabs/evals-tab.md) consente di definire suite di test ed eseguirle sui workflow degli agenti:

- Creare casi di test con input e output attesi, oppure generarli dal prompt della suite
- Eseguire una suite su più modelli e confrontarne gli output affiancati
- Assegnare un punteggio con Exact Match, Contains o LLM-as-Judge con un modello giudice indipendente
- Esaminare esito positivo/negativo, effettivo vs atteso e cronologia delle esecuzioni

Modificare un prompt o un modello, rieseguire la suite e confrontare i risultati prima che la modifica raggiunga la produzione.

## Controllare

### Human-in-the-Loop (HITL)

Heym dispone di un sistema integrato [Human-in-the-Loop](../reference/human-in-the-loop.md) che consente agli agenti di sospendere l'esecuzione, richiedere una revisione umana e riprendere esattamente dal punto in cui si erano interrotti.

- **Checkpoint dell'Agent** – Abilitare `hitlEnabled` su qualsiasi Nodo Agent per fornirgli uno strumento `request_human_review`. L'agente decide quando una decisione necessita di supervisione umana e chiama lo strumento con un riepilogo e una bozza.
- **URL di revisione pubblici** – Ogni richiesta di revisione genera un link sicuro monouso su `/review/{token}` (TTL di 168 ore). I revisori possono **accettare**, **modificare e continuare** o **rifiutare** senza effettuare l'accesso.
- **Snapshot di esecuzione** – Il workflow congela il proprio stato completo (cronologia della conversazione, variabili, risultati degli strumenti) così da riprendere esattamente dal punto in cui si era messo in pausa dopo la risposta del revisore.
- **Ramo di notifica** – Un handle di output opzionale `review` consente di collegare un flusso di notifica (Slack, email, webhook) che si attiva quando viene richiesta una revisione.
- **Politiche di approvazione degli strumenti MCP** – Le linee guida HITL scritte vengono interpretate in ambiti di approvazione (`always` / `once` / `never`) così che l'agente possa approvare automaticamente gli strumenti a basso rischio ed escalare quelli ad alto rischio.
- **Checkpoint multipli** – Una singola esecuzione dell'agente può mettersi in pausa per una revisione più volte; ogni checkpoint è indipendente.

Gli URL di revisione pubblici, la modifica e continuazione, la ramificazione delle notifiche e la ripresa basata su snapshot funzionano tutti dallo stesso checkpoint dell'agente.

Consultare [Human-in-the-Loop](../reference/human-in-the-loop.md) per il riferimento completo.

### Guardrail LLM

Heym dispone di [Guardrail](../reference/guardrails.md) integrati sia sui nodi [LLM](../nodes/llm-node.md) che [Agent](../nodes/agent-node.md), così da poter bloccare contenuti non sicuri prima che una risposta del modello raggiunga gli step downstream.

- **Toggle di sicurezza a livello di nodo** – Abilitare i guardrail direttamente sul nodo che genera o elabora contenuti destinati all'utente
- **Ampia copertura delle politiche** – Bloccare violenza, incitamento all'odio, contenuti sessuali, NSFW/volgarità, molestie, attività illegali, richieste di dati personali e tentativi di prompt injection
- **Rilevamento multilingua** – Applicare le stesse regole di sicurezza su turco, inglese, arabo, spagnolo e altre lingue
- **Fallback nativo del workflow** – Quando un messaggio viene bloccato, il nodo genera un errore di workflow tipizzato che è possibile instradare attraverso un [Error Handler](../nodes/error-handler-node.md)

La politica di sicurezza risiede direttamente all'interno della configurazione di LLM e Agent e si integra direttamente con la ramificazione del workflow e la gestione degli errori.

### Accesso, Credenziali e Audit

Gli agenti operano con credenziali reali, pertanto l'accesso rientra nella governance. Le [Credenziali](../reference/credentials.md) sono cifrate a riposo, mascherate dopo la creazione e condivisibili con utenti o [team](../reference/teams.md); i team condividono inoltre workflow, variabili, archivi vettoriali e file di Drive. Il [Single sign-on](../reference/sso.md) si collega a qualsiasi provider OpenID Connect, inclusi Okta, Entra ID, Keycloak, Auth0 e Google. L'[audit trail](../reference/audit.md) registra ogni azione rilevante per la sicurezza con il relativo attore, target ed esito, trasmesso insieme ai log del container al log collector o al SIEM già in uso.

### Self-Hosted, i Dati Restano di Proprietà dell'Utente

Heym viene eseguito sull'infrastruttura dell'utente. Workflow, credenziali, cronologia delle esecuzioni e tracce risiedono nel database dell'utente, e le chiamate ai modelli partono dai server dell'utente verso il provider scelto, oppure verso un modello ospitato autonomamente tramite Ollama o vLLM. Per gli agenti che elaborano documenti sensibili, dati dei clienti o basi di conoscenza proprietarie, questo requisito è spesso imprescindibile.

Heym è distribuito con licenza **MIT License con condizione Commons Clause**. Il codice sorgente è source-available: è possibile utilizzarlo, modificarlo e ospitarlo autonomamente in modo libero. La Commons Clause limita la vendita del software, inclusa l'offerta di hosting a pagamento o di servizi di consulenza/supporto il cui valore derivi sostanzialmente da Heym. Per licenze commerciali, deployment enterprise o supporto professionale, contattare [enterprise@heym.run](mailto:enterprise@heym.run).

## Esposizione

### API e Streaming

I workflow sono richiamabili via HTTP all'endpoint `/api/workflows/{workflow_id}/execute`, che restituisce JSON, e all'endpoint `/api/workflows/{workflow_id}/execute/stream`, che trasmette gli eventi dei nodi come Server-Sent Events durante l'avanzamento dell'esecuzione. Entrambi condividono autenticazione a livello di workflow, rate limiting e caching delle risposte. Consultare [Webhooks](../reference/webhooks.md) e [SSE Streaming](../reference/sse-streaming.md).

### Integrazione MCP (Model Context Protocol)

Heym dispone di supporto nativo [MCP](../tabs/mcp-tab.md) su entrambi i lati:

- **Come client**: i Nodi Agent si collegano a server MCP esterni (Filesystem, Browserbase, strumenti personalizzati) tramite stdio o SSE e ne consumano automaticamente gli strumenti
- **Come server**: i workflow con MCP abilitato diventano strumenti sul server predefinito all'indirizzo `/api/mcp/sse`, oppure su server denominati con URL e API key propri, così Claude Desktop, Cursor e altri client MCP possono richiamare direttamente i workflow Heym

Gli agenti possono consumare più server MCP contemporaneamente, e qualsiasi workflow può diventare uno strumento per un client MCP esterno.

### Portal: Pubblicare Workflow come Interfacce Chat

La funzionalità [Portal](../reference/portal.md) trasforma qualsiasi workflow in un'interfaccia chat pubblica all'indirizzo `/chat/{slug}`:

- Autenticazione opzionale con credenziali per utente
- Esecuzione in streaming (avanzamento dei nodi in tempo reale)
- Supporto al caricamento di file
- Cronologia delle conversazioni multi-turno

I team distribuiscono strumenti interni, chatbot rivolti ai clienti e form basati su IA partendo da un workflow e un URL, senza scrivere codice frontend.

### Dashboard Alimentate dai Workflow

La [scheda Dashboard](../tabs/dashboard-tab.md) è una superficie di reporting costruita dall'utente, in cui ogni widget grafico è alimentato da un proprio workflow Heym nascosto. Un widget può richiamare API, interrogare BigQuery, cercare in archivi RAG/vettoriali, eseguire passaggi LLM, trasformare righe e concludere con un [Nodo Chart Output](../nodes/chart-output-node.md). È possibile creare widget manualmente, generarli con l'IA, perfezionarli successivamente, memorizzare i risultati in cache e riorganizzare la griglia visivamente.

## Confronto con gli strumenti di automazione dei Workflow

Molti team approdano a Heym provenendo da strumenti di automazione dei Workflow. La tabella seguente confronta Heym con n8n, Zapier e Make.com in merito alle capacità che contano una volta che gli agenti operano in produzione, e le note a piè di pagina sottostanti citano la documentazione ufficiale alla base del confronto. Per un'analisi più approfondita di un singolo strumento alla volta, consultare le pagine di confronto su [heym.run/compare](https://heym.run/compare).

| Capacità | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nodo LLM integrato | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + rami di stato | ✓ | limitato¹¹ | –¹¹ | limitato¹¹ |
| Nodo Agent integrato (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orchestrazione multi-agente | ✓ | ✓ | limitato | limitato |
| Nodi agente di coding (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / archivio vettoriale integrato | ✓ | ✓ | limitato¹ | plugin² |
| Lettura / scrittura WebSocket | ✓ | limitato¹² | –¹³ | –¹⁴ |
| Generatore di Workflow in linguaggio naturale | ✓ | limitato³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Aprire un'esecuzione in corso sul canvas live | ✓ | limitato¹⁹ | limitato¹⁹ | –¹⁹ |
| Dashboard basate su Workflow | ✓ | limitato¹⁷ | limitato¹⁷ | limitato¹⁷ |
| Bacheca Kanban agentica | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistema di Skills per gli agenti | ✓ | – | – | – |
| File drive integrato (link condivisibili, team) | ✓ | limitato²² | limitato²² | –²² |
| Nodo di automazione browser (Playwright) | ✓ | limitato²³ | limitato²³ | –²³ |
| Ispezione delle tracce LLM | ✓ | limitato⁴ | – | ✓ |
| Esportazione delle tracce OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Monitoraggio del costo dei token LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitato¹⁵ |
| Valutazioni integrate per Workflow IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitato⁶ | limitato⁷ |
| Guardrail LLM | ✓ | ✓⁸ | ✓⁸ | limitato⁸ |
| Compressione automatica del contesto | ✓ | – | – | – |
| Esecuzione DAG parallela | ✓ | limitato⁹ | – | – |
| Self-hostable, sorgente disponibile | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL di espressione per dati dinamici | ✓ | ✓ | limitato | ✓ |

> **Note:** ¹ Zapier Knowledge Sources — nessun archivio vettoriale esposto né controllo degli embedding. ² Make.com dispone di moduli Pinecone/Qdrant ma non di un nodo RAG nativo. ³ n8n AI Workflow Builder è una beta solo cloud con limiti di crediti. ⁴ n8n mostra i passaggi intermedi; la tracciatura completa richiede strumenti di terze parti. ⁵ n8n supporta le approvazioni delle chiamate agli strumenti IA tramite chat, email e canali di collaborazione, ma non esegue lo snapshot e la ripresa dell'intera esecuzione come fa Heym. ⁶ Zapier Human in the Loop supporta approvazioni e raccolta dati all'interno degli Zap, ma non è un sistema di checkpoint con revisione pubblica e ripresa da snapshot. ⁷ Make.com offre Human in the Loop come app Enterprise con richieste di revisione ed esiti adjusted/approved/canceled, ma rimane vincolato al piano e meno agent-native. ⁸ n8n distribuisce un nodo Guardrails dedicato, Zapier distribuisce AI Guardrails in tutti i suoi prodotti IA e Make.com documenta regole degli agenti e flussi di revisione ma non una funzionalità di guardrails autonoma comparabile, pertanto Make è contrassegnato come limitato. ⁹ n8n esegue in modo sequenziale per impostazione predefinita; il parallelismo richiede soluzioni alternative tramite sub-workflow. ¹⁰ Sustainable Use License — self-hosting gratuito per uso interno, ridistribuzione commerciale limitata. ¹¹ Al 22 aprile 2026, la documentazione ufficiale di n8n descrive il batching HTTP e i pattern loop/wait anziché un ramo nativo per lo stato dei batch LLM, la documentazione ufficiale dell'app ChatGPT di Zapier non elenca trigger e presenta solo una generica API Request in beta, e la pagina ufficiale dell'integrazione OpenAI di Make espone azioni batch come create/watch completed ma non un nodo LLM di prima classe con ramificazione sullo stato, pertanto n8n/Make sono contrassegnati come limitati e Zapier come non disponibile per questo specifico pattern di workflow. ¹² La documentazione ufficiale di n8n copre i nodi HTTP Webhook e HTTP Request oltre all'estensibilità tramite Code/custom/community, ma non è stato possibile individuare un nodo trigger/send WebSocket di prima parte, pertanto n8n è contrassegnato come limitato. ¹³ La documentazione ufficiale di Zapier copre webhook in ingresso e richieste webhook/API in uscita solo su HTTP, non step nativi di trigger o invio WebSocket. ¹⁴ La documentazione ufficiale di Make copre i moduli Webhooks e i moduli di richiesta HTTP(S), ma non è stato possibile individuare un modulo nativo di trigger o invio WebSocket. ¹⁵ n8n non dispone di tracciamento nativo dei costi in token LLM; esistono workflow alternativi della community ma richiedono installazione manuale e chiamate API post-esecuzione (richiesta di funzionalità aperta a maggio 2026). Zapier non espone agli utenti alcun conteggio di token per esecuzione né costo in USD; gli step IA consumano solo task. La dashboard dei crediti di Make.com riflette parzialmente il consumo di token per l'IA ospitata da Make (da agosto 2025) ma le connessioni con chiavi API di terze parti vengono fatturate come 1 operazione = 1 credito senza conteggio dei token; non è disponibile alcuna ripartizione in USD per esecuzione per modello. ¹⁶ Heym emette span OpenTelemetry nativi (uno per esecuzione del workflow più uno per nodo) su OTLP/HTTP verso qualsiasi backend compatibile, con propagazione del trace-context W3C e senza codice di strumentazione, configurati tramite le variabili d'ambiente `HEYM_OTEL_*` e disabilitati per impostazione predefinita. n8n dispone di un'integrazione documentata di tracciatura OpenTelemetry per le esecuzioni di workflow e nodi. Zapier e Make.com non documentano l'esportazione OpenTelemetry delle esecuzioni dei rispettivi workflow/scenari al giugno 2026. ¹⁷ n8n documenta una dashboard Insights per le metriche di esecuzione in produzione, Zapier documenta Zap History più Task Usage e Make.com documenta Scenario History; si tratta di superfici di monitoraggio/cronologia, non di widget di dashboard personalizzati supportati da logica di workflow arbitraria come la scheda Dashboard di Heym. ¹⁸ Heym Workflow Analyzer esegue il workflow quando possibile, legge il risultato dell'esecuzione e genera un report Markdown condiviso e modificabile che copre aree di miglioramento, scopo e comportamento passo per passo. n8n documenta AI Workflow Builder per creare/rifinire/debuggare workflow, Zapier documenta la risoluzione dei problemi tramite IA per le esecuzioni Zap in errore e Make.com documenta la cronologia degli scenari più i passaggi di ragionamento degli agenti IA, ma la loro documentazione pubblica non descrive lo stesso documento condiviso di analisi del workflow consapevole dell'esecuzione. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) elenca le esecuzioni in corso e può caricare i dati di un'esecuzione precedente nell'editor, mentre [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) espone uno stato running nel suo editor. [Make Scenario History](https://help.make.com/scenario-history) documenta i dettagli di esecuzione e i log. La loro documentazione pubblica, verificata il 18 luglio 2026, non descrive l'esatto flusso di Heym: aprire un'esecuzione di produzione arbitraria in corso dalla Cronologia o da una card Kanban, ripristinare lo snapshot del nodo corrente e continuare a ricevere l'animazione dei nodi e i log di Debug sullo stesso canvas. ²⁰ I nodi [Codex](../nodes/codex-node.md) e [OpenCode Go](../nodes/opencode-go-node.md) di Heym eseguono una vera CLI di agente di coding in un workspace Heym isolato su un repository GitHub — clone, modifica, produzione di un diff, push di un branch, apertura di una pull request — come step di workflow di prima classe. Al 20 luglio 2026, nessun concorrente documenta un equivalente: il [nodo OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) di n8n copre chiamate API di chat/assistant, non un agente di coding a livello di repository, e il supporto nativo a Codex rimane una richiesta della community; il blog di Zapier documenta la direzione opposta — [Codex che pilota gli strumenti Zapier tramite Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — non Codex come step di uno Zap; i moduli OpenAI di Make.com espongono completions/assistants/azioni batch, non un agente di coding che clona repository e apre PR. ²¹ La [scheda Board](../tabs/board-tab.md) di Heym è una board Kanban agentica integrata le cui colonne eseguono workflow e le cui card trasportano contesto, cronologia della conversazione, stato di esecuzione ed esecuzioni. n8n ([integrazione Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integrazioni Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) e Make.com ([integrazione Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) si connettono solo ad app kanban di terze parti come Kanban Tool, Wekan o NocoDB; nessuno documenta una board integrata che esegue i propri workflow, al 20 luglio 2026. ²² n8n archivia i dati binari delle esecuzioni internamente (opzionalmente su [storage esterno compatibile S3](https://docs.n8n.io/hosting/scaling/external-storage/)) ma non documenta alcun drive di file rivolto all'utente con link di condivisione o condivisione di team, pertanto è contrassegnato come limitato. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) di Zapier elabora i file solo per la durata di un'esecuzione Zap e [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) conserva piccoli valori testuali, pertanto Zapier è contrassegnato come limitato. I [data store](https://help.make.com/l6du-data-stores) di Make.com conservano record strutturati e la sua [gestione dei file](https://help.make.com/working-with-files) trasferisce i file tra le app senza storage integrato persistente, pertanto Make è contrassegnato come non disponibile. ²³ Il [nodo Playwright](../nodes/playwright-node.md) di Heym è automazione browser di prima parte con una modalità visuale a passaggi, passaggi generati dall'IA e una modalità a codice completo. n8n offre solo pacchetti della community come [n8n-playwright](https://github.com/toema/n8n-playwright) con una [richiesta di funzionalità per nodi nativi di automazione browser](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796) ancora aperta, pertanto è contrassegnato come limitato. Gli Zapier Agents possono [navigare e leggere pagine tramite web browsing e un'estensione Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) ma Zapier non documenta alcuno step di automazione browser con script, pertanto è contrassegnato come limitato. Make.com documenta moduli HTTP e app di scraping di terze parti anziché qualsiasi modulo nativo di automazione browser, al 20 luglio 2026.

## Correlati

- [Introduzione](./introduction.md) – Panoramica della piattaforma
- [Avvio rapido](./quick-start.md) – Creare il primo workflow
- [Analisi dei workflow](../reference/workflow-analysis.md) – Generare report condivisi dei workflow con awareness delle esecuzioni e feedback di miglioramento
- [Scheda Dashboard](../tabs/dashboard-tab.md) – Creare dashboard basate su workflow con widget grafici generati dall'IA
- [Nodo Agent](../nodes/agent-node.md) – Nodo LLM con tool calling, MCP e skills
- [Architettura degli agenti](../reference/agent-architecture.md) – Sub-agenti, orchestrator e dispatch dei tool
- [Scheda Board](../tabs/board-tab.md) – Board Kanban agentica con colonne che eseguono workflow
- [Nodo Codex](../nodes/codex-node.md) – Eseguire l'agente di coding OpenAI Codex su un repository GitHub
- [Nodo OpenCode Go](../nodes/opencode-go-node.md) – Agente di coding provider-agnostic in un container hardened
- [Scheda Drive](../tabs/drive-tab.md) – Archiviazione file integrata con link di condivisione, team e azioni in blocco
- [Nodo Playwright](../nodes/playwright-node.md) – Automazione browser first-party con step IA e modalità codice
- [Nodo RAG / Vector Store](../nodes/rag-node.md) – Ricerca vettoriale e inserimento documenti (Qdrant o Postgres pgvector)
- [Assistente IA](../reference/ai-assistant.md) – Generatore di workflow in linguaggio naturale
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Checkpoint degli agenti con URL di revisione pubblici
- [Guardrails](../reference/guardrails.md) – Bloccare prompt non sicuri prima che raggiungano i modelli
- [Scheda Tracce](../tabs/traces-tab.md) – Osservabilità delle chiamate LLM
- [Scheda Valutazioni](../tabs/evals-tab.md) – Suite di test per workflow IA
- [Scheda Avvisi](../tabs/alerts-tab.md) – Avvisi a soglia su errori, durata, costo e volume di esecuzioni
- [Tracing OpenTelemetry](../reference/opentelemetry.md) – Esportare span di esecuzioni, nodi e tool tramite OTLP
- [Distribuzione del carico](../reference/cluster.md) – Condividere le esecuzioni tra istanze con failover del leader
- [Single Sign-On](../reference/sso.md) – Accedere tramite qualsiasi provider OpenID Connect
- [Audit Logging](../reference/audit.md) – Azioni rilevanti per la sicurezza con attore, target ed esito
- [Portale](../reference/portal.md) – Pubblicare workflow come interfacce chat pubbliche
- [Esecuzione parallela](../reference/parallel-execution.md) – Esecuzione concorrente basata su DAG
- [Scheda MCP](../tabs/mcp-tab.md) – Configurazione di server e client MCP

# Architettura degli Agent

Il [Nodo Agent](../nodes/agent-node.md) supporta sub-agent, sub-workflow, strumenti da nodi del canvas, un pattern orchestrator, skills, connessioni MCP, tool calling, [memoria persistente](./agent-persistent-memory.md) opzionale (per nodo del canvas, con condivisione opzionale verso altri agent) e [revisione umana](./human-in-the-loop.md) opzionale. Questa pagina descrive l'architettura.

## Sub-Agent

I sub-agent sono nodi agent che un orchestrator può invocare tramite lo strumento `call_sub_agent`.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agent**: devono utilizzare `$input.text` nel proprio User Message per ricevere il prompt dell'orchestrator
- **Strumento**: `call_sub_agent` con `sub_agent_label` (enum) e `prompt`
- **Limite di profondità**: massimo 5 chiamate annidate a sub-agent

### Flusso di esecuzione

1. L'orchestrator decide di invocare un sub-agent
2. `_execute_sub_agent_tool` individua l'agent di destinazione tramite label
3. Costruisce `synthetic_inputs = {"input": {"text": prompt}}`
4. Esegue `_execute_agent_node` per il sub-agent
5. Il risultato viene restituito all'orchestrator

### Esecuzione parallela dei sub-agent

Quando l'orchestrator restituisce più chiamate allo strumento `call_sub_agent` in un singolo turno, queste vengono eseguite **in parallelo**. Ad esempio, se l'utente chiede informazioni su "Parigi" e l'orchestrator invoca sia `distanceAgent` sia `foodAgent`, entrambi vengono eseguiti contemporaneamente anziché in sequenza.

- **Vantaggio**: il tempo totale corrisponde approssimativamente a quello del sub-agent più lento, non alla somma di tutti.
- **Suggerimento**: incoraggiare l'orchestrator a invocare più sub-agent in un unico turno quando l'attività lo richiede.

## Sub-Workflow

Quando `subWorkflowIds` è configurato, l'agent può invocare altri workflow tramite lo strumento `call_sub_workflow`.

- **Configurazione**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Strumento**: `call_sub_workflow` con `workflow_id` (enum) e `inputs` (object)
- **Limite di profondità**: massimo 5 chiamate annidate a sub-workflow

### Flusso di esecuzione

1. L'agent decide di invocare un sub-workflow
2. `_execute_sub_workflow_tool` recupera il workflow da `workflow_cache`
3. Costruisce `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Esegue `WorkflowExecutor.execute()` per il sub-workflow
5. Il risultato viene restituito all'agent

I sub-workflow non possono sospendersi per HITL nella v1. Se un sub-workflow annidato tenta di entrare in uno stato di revisione pendente, l'esecuzione fallisce anziché sospendersi all'interno della chiamata annidata.

## Strumenti da nodi del canvas

Gli strumenti da nodi del canvas sono nodi di workflow collegati a un agent tramite l'handle `tool-input`. Durante la configurazione dell'agent, `_build_node_tool_schemas` analizza tali connessioni e aggiunge uno schema di strumento compatibile con OpenAI per ciascun nodo collegato.

- **Origine dello strumento**: `_source: "node_tool"`
- **Nome dello strumento**: derivato dalla label del nodo collegato, con l'aggiunta di suffissi in caso di duplicati
- **Parametri dello strumento**: costruiti a partire da `agentProvidedFields` del nodo
- **Campi fissi**: tutti i campi del nodo non elencati in `agentProvidedFields` rimangono nella configurazione del nodo

### Flusso di esecuzione

1. L'agent decide di invocare uno strumento da nodo collegato
2. `_execute_node_tool` copia i dati del nodo
3. Gli argomenti forniti dall'agent vengono uniti ai campi configurati del nodo
4. `execute_node` esegue quel nodo una sola volta con la pianificazione dei rami disabilitata
5. I dati originali del nodo vengono ripristinati
6. L'output del nodo viene restituito all'agent come risultato dello strumento

I nodi strumento sono esclusi dalla pianificazione normale del workflow per evitare esecuzioni duplicate. Vengono eseguiti esclusivamente tramite il percorso di chiamata degli strumenti dell'agent.

## Human-in-the-Loop

Quando `hitlEnabled` è impostato su un agent, l'agent riceve uno strumento `request_human_review` che può invocare in specifici checkpoint di approvazione.

1. Il system prompt e le linee guida HITL del nodo indicano all'agent quali azioni richiedono approvazione
2. Quando l'agent raggiunge uno di questi passaggi, invoca `request_human_review`
3. Heym memorizza uno snapshot dell'esecuzione del workflow e crea una richiesta di revisione pubblica
4. Il risultato del nodo viene contrassegnato come `pending` con un URL di revisione
5. L'handle di output `review` dell'agent viene pianificato immediatamente, così i rami di notifica possono essere eseguiti con il payload in stato pending
6. La pianificazione dell'esecuzione principale si arresta fino alla risposta del revisore
7. In caso di `accept`, `edit` o `refuse`, l'executor viene ricostruito dallo snapshot memorizzato
8. L'agent sospeso prosegue con il contesto di revisione approvato, oppure termina immediatamente in caso di `refuse`
9. I nodi a valle proseguono dopo il completamento dell'agent ripreso, senza rieseguire il ramo `review`
10. Se un'azione successiva richiede anch'essa approvazione, l'agent può creare un ulteriore checkpoint HITL nella stessa esecuzione

Il riepilogo destinato al revisore viene generato dalla richiesta di revisione stessa, così il campo del nodo può rimanere focalizzato sulla policy di approvazione e sulla tempistica.

Ciò consente ai workflow degli agent di attendere un'approvazione esterna preservando la cronologia della conversazione, gli output dei nodi completati, lo stato dei loop e altro contesto di runtime.

## Executor degli strumenti dell'orchestrator

L'executor personalizzato degli strumenti gestisce:

- **Chiamate a sub-agent** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Chiamate a sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Strumenti da nodi del canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revisione umana** (`_source == "hitl"`) → crea un checkpoint HITL in stato pending
- **Altri strumenti** → `_unified_tool_executor` (Python, MCP, strumenti delle skill)

Viene utilizzato quando HITL è abilitato, quando è impostato `isOrchestrator` con `subAgentLabels`, oppure quando `subWorkflowIds` è configurato.

## Skills

Le Skills estendono il contesto di sistema dell'agente e possono aggiungere strumenti Python.

- **Struttura**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Contenuto**: Anteposto all'istruzione di sistema (unito con `---`)
- **Strumenti Python**: Per ogni skill con file `.py`, viene aggiunto uno strumento `skill_{skill_name}`
- **Esecuzione**: `skill_python_executor.py` esegue gli script con `uv run python` in una directory temporanea; argomenti come JSON su stdin, risultato come JSON su stdout

Le Skills possono essere aggiunte trascinando un file `.zip` o `.md` nell'area Skills nella configurazione del [Nodo Agent](../nodes/agent-node.md).

## MCP Client

Il client MCP (Model Context Protocol) si connette a server di strumenti esterni.

- **Trasporti**: `stdio` (comando + argomenti) o `sse` (url + headers)
- **Elenco strumenti**: `list_mcp_tools` → `ClientSession.list_tools()` → convertito nel formato funzione OpenAI con `_source: "mcp"`
- **Esecuzione**: `execute_mcp_tool` → `ClientSession.call_tool()` → risultato tramite `_extract_tool_result`

Configurare le connessioni MCP nella [Scheda MCP](../tabs/mcp-tab.md) o nelle `mcpConnections` del nodo agent.

## Tool Calling

Il servizio LLM esegue un ciclo `execute_with_tools`:

1. **Verifica di compressione del contesto** — prima di ogni iterazione, stimare l'utilizzo dei token e comprimere se necessario (vedere di seguito)
2. Chiamare il modello con `tools` e `tool_choice: "auto"`
3. Se esistono `tool_calls`: per ogni chiamata, eseguire `tool_executor(tool_def, name, args, timeout)`
4. Aggiungere il risultato dello strumento ai messaggi, ripetere
5. Arrestarsi quando non ci sono più chiamate agli strumenti o è stato raggiunto `max_tool_iterations`

### Tool Dispatch

`_unified_tool_executor` instrada in base a `_source`:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (default) | `execute_tool` (strumenti di codice Python) |

Gli strumenti utilizzano il formato function-calling di OpenAI: `name`, `description`, `parameters` (schema JSON).

## Context Compression

Per prevenire l'overflow del contesto su agenti a esecuzione prolungata, Heym comprime automaticamente la lista `messages` accumulata prima di ogni iterazione degli strumenti.

### Algoritmo

1. **Stima dei token**: `total_chars / 4` su tutti i messaggi (veloce, nessun tokenizer necessario)
2. **Verifica della soglia**: se `estimated_tokens < context_limit × 0.80`, saltare la compressione
3. **Limite di contesto**: tentare `client.models.retrieve(model).context_window`; in alternativa utilizzare una tabella integrata (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, ecc.); predefinito 128K
4. **Conservazione degli ancoraggi**: mantenere sempre
   - Primo messaggio `system` (identità e istruzioni dell'agente)
   - Primo messaggio `user` (attività originale)
   - Ultimo messaggio `user` (istruzione più recente)
5. **Riassunto della parte centrale**: tutto ciò che si trova tra il primo e l'ultimo messaggio user viene serializzato e inviato allo stesso modello con un prompt di riassunto
6. **Ricostruzione**: `[system, first_user, assistant(summary), last_user]`

La compressione viene saltata se ci sono meno di 2 messaggi user distinti (nessuna parte centrale da riassumere) o se la chiamata di riassunto LLM fallisce (fallback sicuro: restituire i messaggi originali).

### Osservabilità

Ogni evento di compressione viene registrato come:
- Una voce `_context_compression` in `tool_calls_collected` → visibile nel dettaglio dell'esecuzione nella Cronologia esecuzioni
- Un evento `on_tool_call` con `phase: "compression"` → visualizzato nel pannello Debug come `Context compressed (N messages → summary)`
- Una voce di traccia LLM `context.compression` → visibile nella scheda Tracce con le stime dei token prima/dopo

Le chiamate agli strumenti dell'agente emettono anche un'osservabilità più ricca:

- Campi del ciclo di vita per ogni chiamata su `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` aggregati sul risultato dell'agente (conteggi per stato più durata totale/massima); le voci `_context_compression` sono escluse da tali conteggi
- Span figli OpenTelemetry opt-in denominati `heym.agent.tool.execute` (vedere [OpenTelemetry Tracing](./opentelemetry.md))
- I payload `tool_calls` persistiti nella traccia LLM / cronologia esecuzioni sono redatti e limitati in dimensione; lo stato di ripresa HITL live mantiene gli originali per la corrispondenza

## Correlati

- [Perché Heym](../getting-started/why-heym.md) – Orchestrazione multi-agente lungo il ciclo di vita dell'agente
- [Nodo Agent](../nodes/agent-node.md) – Configurazione e parametri
- [Memoria persistente dell'agente](./agent-persistent-memory.md) – Grafo di conoscenza per nodo agent e condivisione tra peer
- [Human-in-the-Loop](./human-in-the-loop.md) – Link di revisione, payload in sospeso e comportamento di ripresa
- [OpenTelemetry Tracing](./opentelemetry.md) – Span di workflow, nodo e strumenti dell'Agent
- [Tipi di nodo](./node-types.md) – Agent e nodi correlati
- [Esecuzione parallela](./parallel-execution.md) – Esecuzione parallela basata su DAG e sub-agente
- [Scheda MCP](../tabs/mcp-tab.md) – Configurare le connessioni MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` per i sub-agenti

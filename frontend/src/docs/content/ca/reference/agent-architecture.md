# Arquitectura de l'Agent

El [Node Agent](../nodes/agent-node.md) admet sub-agents, sub-workflows, eines de nodes de canvas, un patró d'orquestrador, skills, connexions MCP, crida d'eines, [memòria persistent](./agent-persistent-memory.md) opcional (per node de canvas, amb compartició opcional amb altres agents) i [revisió humana](./human-in-the-loop.md) opcional. Aquesta pàgina descriu l'arquitectura.

## Sub-Agents

Els sub-agents són nodes d'agent que un orquestrador pot cridar mitjançant l'eina `call_sub_agent`.

- **Orquestrador**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agents**: Han d'utilitzar `$input.text` al seu User Message per tal de rebre el prompt de l'orquestrador
- **Eina**: `call_sub_agent` amb `sub_agent_label` (enum) i `prompt`
- **Límit de profunditat**: Màxim 5 crides niuades de sub-agents

### Flux d'execució

1. L'orquestrador decideix cridar un sub-agent
2. `_execute_sub_agent_tool` troba l'agent objectiu per etiqueta
3. Construeix `synthetic_inputs = {"input": {"text": prompt}}`
4. Executa `_execute_agent_node` per al sub-agent
5. El resultat es retorna a l'orquestrador

### Execució paral·lela de sub-agents

Quan l'orquestrador retorna múltiples crides a l'eina `call_sub_agent` en un sol torn, s'executen **en paral·lel**. Per exemple, si l'usuari pregunta sobre "París" i l'orquestrador crida tant `distanceAgent` com `foodAgent`, tots dos s'executen de manera concurrent en lloc de seqüencial.

- **Benefici**: El temps total és aproximadament el del sub-agent més lent, no la suma de tots.
- **Consell**: Encorageu l'orquestrador a cridar múltiples sub-agents en un sol torn quan la tasca ho requereixi.

## Sub-Workflows

Quan es configura `subWorkflowIds`, l'agent pot cridar altres workflows mitjançant l'eina `call_sub_workflow`.

- **Configuració**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Eina**: `call_sub_workflow` amb `workflow_id` (enum) i `inputs` (object)
- **Límit de profunditat**: Màxim 5 crides niuades de sub-workflows

### Flux d'execució

1. L'agent decideix cridar un sub-workflow
2. `_execute_sub_workflow_tool` obté el workflow de `workflow_cache`
3. Construeix `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Executa `WorkflowExecutor.execute()` per al sub-workflow
5. El resultat es retorna a l'agent

Els sub-workflows no poden pausar-se per a HITL a la v1. Si un sub-workflow niuat intenta entrar en un estat de revisió pendent, l'execució falla en lloc de suspendre's dins de la crida niuada.

## Eines de nodes de canvas

Les eines de nodes de canvas són nodes de workflow connectats a un agent mitjançant el handle `tool-input`. Durant la configuració de l'agent, `_build_node_tool_schemas` escaneja aquestes arestes i afegeix un esquema d'eina compatible amb OpenAI per cada node connectat.

- **Origen de l'eina**: `_source: "node_tool"`
- **Nom de l'eina**: derivat de l'etiqueta del node connectat, amb sufixos afegits per als duplicats
- **Paràmetres de l'eina**: construïts a partir dels `agentProvidedFields` del node
- **Camps fixos**: tots els camps del node que no apareixen a `agentProvidedFields` es mantenen a la configuració del node

### Flux d'execució

1. L'agent decideix cridar una eina de node connectat
2. `_execute_node_tool` copia les dades del node
3. Els arguments proporcionats per l'agent es fusionen amb els camps configurats del node
4. `execute_node` executa aquest node una vegada amb la planificació de branques desactivada
5. Es restauren les dades originals del node
6. La sortida del node es retorna a l'agent com a resultat de l'eina

Els nodes d'eina s'exclouen de la planificació normal del workflow per tal que no s'executin dues vegades. S'executen només a través del camí de crida d'eines de l'agent.

## Human-in-the-Loop

Quan `hitlEnabled` està activat en un agent, l'agent rep una eina `request_human_review` que pot cridar en punts de control d'aprovació específics.

1. El system prompt i les directrius HITL del node indiquen a l'agent quines accions requereixen aprovació
2. Quan l'agent arriba a un d'aquests passos, crida `request_human_review`
3. Heym emmagatzema una instantània de l'execució del workflow i crea una sol·licitud de revisió pública
4. El resultat del node es marca com a `pending` amb una URL de revisió
5. El handle de sortida `review` de l'agent es planifica immediatament per tal que les branques de notificació puguin executar-se amb el payload pendent
6. La planificació de l'execució principal s'atura fins que el revisor respon
7. Amb `accept`, `edit` o `refuse`, l'executor es reconstrueix a partir de la instantània emmagatzemada
8. L'agent pausat continua amb el context de revisió aprovat, o surt immediatament amb `refuse`
9. Els nodes posteriors continuen després que l'agent reprès acabi, sense tornar a executar la branca `review`
10. Si una acció posterior també requereix aprovació, l'agent pot crear un altre punt de control HITL a la mateixa execució

El resum adreçat al revisor es genera a partir de la pròpia sol·licitud de revisió, de manera que el camp del node pot mantenir-se centrat en la política d'aprovació i el moment d'execució.

Això permet que els workflows d'agent esperin una aprovació externa tot preservant l'historial de conversa, les sortides de nodes completades, l'estat dels bucles i altres contextos d'execució.

## Executor d'eines de l'orquestrador

L'executor d'eines personalitzat encamina:

- **Crides a sub-agents** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Crides a sub-workflows** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Eines de nodes de canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revisió humana** (`_source == "hitl"`) → crea un punt de control HITL pendent
- **Altres eines** → `_unified_tool_executor` (Python, MCP, eines de skills)

S'utilitza quan HITL està activat, quan `isOrchestrator` amb `subAgentLabels` està configurat, o quan `subWorkflowIds` està configurat.
## Skills

Els Skills amplien el context del sistema de l'agent i poden afegir eines de Python.

- **Forma**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Contingut**: S'anteposa a la instrucció del sistema (unit amb `---`)
- **Eines de Python**: Per a cada skill amb fitxers `.py`, s'afegeix una eina `skill_{skill_name}`
- **Execució**: `skill_python_executor.py` executa scripts amb `uv run python` en un directori temporal; els arguments com a JSON a stdin, el resultat com a JSON a stdout

Els Skills es poden afegir arrossegant un fitxer `.zip` o `.md` a l'àrea de Skills de la configuració del [Node Agent](../nodes/agent-node.md).

## Client MCP

El client MCP (Model Context Protocol) es connecta a servidors d'eines externs.

- **Transports**: `stdio` (comanda + args) o `sse` (url + headers)
- **Llistar eines**: `list_mcp_tools` → `ClientSession.list_tools()` → convertit al format de funció d'OpenAI amb `_source: "mcp"`
- **Executar**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultat mitjançant `_extract_tool_result`

Configureu les connexions MCP a la [Pestanya MCP](../tabs/mcp-tab.md) o a les `mcpConnections` del node de l'agent.

## Crida d'eines

El servei LLM executa un bucle `execute_with_tools`:

1. **Comprovació de compressió de context** — abans de cada iteració, estimeu l'ús de tokens i comprimiu si cal (vegeu més avall)
2. Crideu el model amb `tools` i `tool_choice: "auto"`
3. Si existeixen `tool_calls`: per a cada crida, executeu `tool_executor(tool_def, name, args, timeout)`
4. Afegiu el resultat de l'eina als missatges, repetiu
5. Atureu-vos quan no hi hagi més crides d'eines o s'hagi assolit `max_tool_iterations`

### Dispatch d'eines

`_unified_tool_executor` encamina segons `_source`:

| Origen | Gestor |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (per defecte) | `execute_tool` (eines de codi Python) |

Les eines utilitzen el format de crida de funcions d'OpenAI: `name`, `description`, `parameters` (esquema JSON).

## Compressió de context

Per evitar el desbordament de context en agents de llarga durada, Heym comprimeix automàticament la llista acumulada de `messages` abans de cada iteració d'eines.

### Algorisme

1. **Estimar tokens**: `total_chars / 4` a tots els missatges (ràpid, no cal tokenitzador)
2. **Comprovació de llindar**: si `estimated_tokens < context_limit × 0.80`, ometeu la compressió
3. **Límit de context**: proveu `client.models.retrieve(model).context_window`; si falla, utilitzeu una taula integrada (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.); per defecte 128K
4. **Preservació d'àncores**: conserveu sempre
   - El primer missatge `system` (identitat i instruccions de l'agent)
   - El primer missatge `user` (tasca original)
   - L'últim missatge `user` (instrucció més recent)
5. **Resumir el mig**: tot el que hi ha entre el primer i l'últim missatge d'usuari se serialitza i s'envia al mateix model amb un prompt de resum
6. **Reconstruir**: `[system, first_user, assistant(summary), last_user]`

La compressió s'omet si hi ha menys de 2 missatges d'usuari diferents (no hi ha mig per resumir) o si la crida de resum del LLM falla (fallback segur: retorna els missatges originals).

### Observabilitat

Cada esdeveniment de compressió es registra com a:
- Una entrada `_context_compression` a `tool_calls_collected` → visible al detall d'execució de l'Historial d'execucions
- Un esdeveniment `on_tool_call` amb `phase: "compression"` → renderitzat al panell de Debug com a `Context compressed (N messages → summary)`
- Una entrada de traça LLM `context.compression` → visible a la pestanya Traces amb estimacions de tokens abans/després

Les crides d'eines de l'agent també emeten una observabilitat més rica:

- Camps de cicle de vida per crida a `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregats al resultat de l'agent (recomptes per estat més durada total/màxima); les entrades `_context_compression` s'exclouen d'aquests recomptes
- Spans fills d'OpenTelemetry opcionals anomenats `heym.agent.tool.execute` (vegeu [OpenTelemetry Tracing](./opentelemetry.md))
- Les càrregues útils persistides de traça LLM / historial d'execució `tool_calls` es redacten i es limiten per mida; l'estat de represa HITL en directe conserva els originals per a la concordança

## Relacionat

- [Per què Heym](../getting-started/why-heym.md) – Orquestració multi-agent al llarg del cicle de vida de l'agent
- [Node Agent](../nodes/agent-node.md) – Configuració i paràmetres
- [Memòria persistent de l'agent](./agent-persistent-memory.md) – Graf de coneixement per node d'agent i compartició entre iguals
- [Human-in-the-Loop](./human-in-the-loop.md) – Enllaços de revisió, càrregues útils pendents i comportament de represa
- [OpenTelemetry Tracing](./opentelemetry.md) – Spans de Workflow, node i eines de l'Agent
- [Tipus de nodes](./node-types.md) – Agent i nodes relacionats
- [Execució paral·lela](./parallel-execution.md) – Execució paral·lela basada en DAG i sub-agents
- [Pestanya MCP](../tabs/mcp-tab.md) – Configurar connexions MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` per a sub-agents

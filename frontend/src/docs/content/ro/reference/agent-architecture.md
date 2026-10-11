# Arhitectura Agentului

[Nodul Agent](../nodes/agent-node.md) acceptă sub-agenți, sub-workflow-uri, instrumente de tip nod pe canvas, un model de orchestrator, competențe, conexiuni MCP, apelarea instrumentelor, [memorie persistentă](./agent-persistent-memory.md) opțională (per nod de canvas, cu partajare opțională către alți agenți) și [revizuire umană](./human-in-the-loop.md) opțională. Această pagină descrie arhitectura.

## Sub-agenți

Sub-agenții sunt noduri de tip agent pe care un orchestrator le poate apela prin instrumentul `call_sub_agent`.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agenți**: Trebuie să utilizeze `$input.text` în mesajul lor de utilizator pentru a primi promptul orchestratorului
- **Instrument**: `call_sub_agent` cu `sub_agent_label` (enum) și `prompt`
- **Limită de adâncime**: Maximum 5 apeluri imbricate de sub-agenți

### Flux de execuție

1. Orchestratorul decide să apeleze un sub-agent
2. `_execute_sub_agent_tool` găsește agentul țintă după etichetă
3. Construiește `synthetic_inputs = {"input": {"text": prompt}}`
4. Rulează `_execute_agent_node` pentru sub-agent
5. Rezultatul este returnat orchestratorului

### Execuția paralelă a sub-agenților

Atunci când orchestratorul returnează mai multe apeluri ale instrumentului `call_sub_agent` într-o singură rundă, acestea sunt executate **în paralel**. De exemplu, dacă utilizatorul întreabă despre „Paris" și orchestratorul apelează atât `distanceAgent`, cât și `foodAgent`, ambele rulează simultan în loc de secvențial.

- **Beneficiu**: Timpul total este aproximativ cel al celui mai lent sub-agent, nu suma tuturor.
- **Indiciu**: Încurajați orchestratorul să apeleze mai mulți sub-agenți într-o singură rundă atunci când sarcina o impune.

## Sub-workflow-uri

Atunci când `subWorkflowIds` este configurat, agentul poate apela alte workflow-uri prin instrumentul `call_sub_workflow`.

- **Configurare**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Instrument**: `call_sub_workflow` cu `workflow_id` (enum) și `inputs` (object)
- **Limită de adâncime**: Maximum 5 apeluri imbricate de sub-workflow-uri

### Flux de execuție

1. Agentul decide să apeleze un sub-workflow
2. `_execute_sub_workflow_tool` preia workflow-ul din `workflow_cache`
3. Construiește `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Rulează `WorkflowExecutor.execute()` pentru sub-workflow
5. Rezultatul este returnat agentului

Sub-workflow-urile nu pot fi suspendate pentru HITL în v1. Dacă un sub-workflow imbricat încearcă să intre într-o stare de revizuire în așteptare, execuția eșuează în loc să se suspende în interiorul apelului imbricat.

## Instrumente de tip nod pe canvas

Instrumentele de tip nod pe canvas sunt noduri de workflow conectate la un agent prin handle-ul `tool-input`. În timpul configurării agentului, `_build_node_tool_schemas` analizează acele muchii și adaugă o schemă de instrument compatibilă cu OpenAI pentru fiecare nod conectat.

- **Sursa instrumentului**: `_source: "node_tool"`
- **Numele instrumentului**: derivat din eticheta nodului conectat, cu sufixe adăugate pentru duplicate
- **Parametrii instrumentului**: construiți din `agentProvidedFields` ale nodului
- **Câmpuri fixe**: toate câmpurile nodului care nu sunt listate în `agentProvidedFields` rămân în configurația nodului

### Flux de execuție

1. Agentul decide să apeleze un instrument de tip nod conectat
2. `_execute_node_tool` copiază datele nodului
3. Argumentele furnizate de agent sunt fuzionate în câmpurile configurate ale nodului
4. `execute_node` rulează acel nod o singură dată cu programarea pe ramuri dezactivată
5. Datele originale ale nodului sunt restaurate
6. Ieșirea nodului este returnată agentului ca rezultat al instrumentului

Nodurile de tip instrument sunt excluse din programarea normală a workflow-ului pentru a nu rula de două ori. Ele se execută exclusiv prin calea de apel a instrumentului agentului.

## Human-in-the-Loop

Atunci când `hitlEnabled` este setat pe un agent, agentul primește un instrument `request_human_review` pe care îl poate apela la puncte de verificare specifice pentru aprobare.

1. Promptul de sistem și ghidurile HITL ale nodului indică agentului ce acțiuni necesită aprobare
2. Când agentul ajunge la unul dintre acele pași, apelează `request_human_review`
3. Heym stochează un instantaneu al execuției workflow-ului și creează o cerere publică de revizuire
4. Rezultatul nodului este marcat `pending` cu un URL de revizuire
5. Handle-ul de ieșire `review` al agentului este programat imediat, astfel încât ramurile de notificare să poată rula cu payload-ul în așteptare
6. Programarea execuției principale se oprește până când revizorul răspunde
7. La `accept`, `edit` sau `refuse`, executorul este reconstruit din instantaneul stocat
8. Agentul suspendat continuă cu contextul de revizuire aprobat sau iese imediat la `refuse`
9. Nodurile din aval continuă după ce agentul reluat își termină execuția, fără a rula din nou ramura `review`
10. Dacă o acțiune ulterioară necesită de asemenea aprobare, agentul poate crea un alt punct de verificare HITL în aceeași rulare

Rezumatul destinat revizorului este generat din cererea de revizuire în sine, astfel încât câmpul nodului poate rămâne concentrat pe politica de aprobare și pe momentul oportun.

Aceasta permite workflow-urilor agentului să aștepte aprobarea externă păstrând istoricul conversației, ieșirile nodurilor finalizate, starea buclei și alt context de execuție.

## Executorul de instrumente al orchestratorului

Executorul personalizat de instrumente direcționează:

- **Apelurile de sub-agenți** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Apelurile de sub-workflow-uri** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Instrumentele de tip nod pe canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revizuirea umană** (`_source == "hitl"`) → creează un punct de verificare HITL în așteptare
- **Alte instrumente** → `_unified_tool_executor` (Python, MCP, instrumente de competențe)

Acesta este utilizat atunci când HITL este activat, când `isOrchestrator` cu `subAgentLabels` este setat sau când `subWorkflowIds` este configurat.
## Skills

Skills extind contextul de sistem al agentului și pot adăuga instrumente Python.

- **Structură**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Conținut**: Adăugat înaintea instrucțiunii de sistem (concatenat cu `---`)
- **Instrumente Python**: Pentru fiecare skill cu fișiere `.py`, se adaugă un instrument `skill_{skill_name}`
- **Execuție**: `skill_python_executor.py` rulează scripturi cu `uv run python` într-un director temporar; argumentele sunt transmise ca JSON prin stdin, iar rezultatul este returnat ca JSON prin stdout

Skills pot fi adăugate prin plasarea unui fișier `.zip` sau `.md` în zona Skills din configurația [Agent Node](../nodes/agent-node.md).

## MCP Client

Clientul MCP (Model Context Protocol) se conectează la servere de instrumente externe.

- **Transporturi**: `stdio` (comandă + argumente) sau `sse` (url + headers)
- **Listare instrumente**: `list_mcp_tools` → `ClientSession.list_tools()` → convertit în formatul de funcție OpenAI cu `_source: "mcp"`
- **Execuție**: `execute_mcp_tool` → `ClientSession.call_tool()` → rezultat prin `_extract_tool_result`

Configurați conexiunile MCP în [MCP Tab](../tabs/mcp-tab.md) sau în `mcpConnections` ale nodului agent.

## Tool Calling

Serviciul LLM rulează o buclă `execute_with_tools`:

1. **Verificare compresie context** — înainte de fiecare iterație, estimați utilizarea tokenurilor și comprimați dacă este necesar (consultați secțiunea de mai jos)
2. Apelați modelul cu `tools` și `tool_choice: "auto"`
3. Dacă există `tool_calls`: pentru fiecare apel, rulați `tool_executor(tool_def, name, args, timeout)`
4. Adăugați rezultatul instrumentului la mesaje, repetați
5. Opriți când nu mai există apeluri de instrumente sau s-a atins `max_tool_iterations`

### Tool Dispatch

`_unified_tool_executor` rutează după `_source`:

| Sursă | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (implicit) | `execute_tool` (instrumente de cod Python) |

Instrumentele utilizează formatul OpenAI function-calling: `name`, `description`, `parameters` (schemă JSON).

## Context Compression

Pentru a preveni depășirea contextului la agenții cu execuție îndelungată, Heym comprimă automat lista acumulată de `messages` înainte de fiecare iterație de instrumente.

### Algoritm

1. **Estimare tokenuri**: `total_chars / 4` pentru toate mesajele (rapid, fără tokenizer)
2. **Verificare prag**: dacă `estimated_tokens < context_limit × 0.80`, săriți peste compresie
3. **Limită de context**: încercați `client.models.retrieve(model).context_window`; reveniți la un tabel intern (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M etc.); implicit 128K
4. **Păstrarea ancorelor**: păstrați întotdeauna
   - Primul mesaj `system` (identitatea și instrucțiunile agentului)
   - Primul mesaj `user` (sarcina originală)
   - Ultimul mesaj `user` (instrucțiunea cea mai recentă)
5. **Sumarizarea părții mediane**: tot ce se află între primul și ultimul mesaj `user` este serializat și trimis aceluiași model cu un prompt de sumarizare
6. **Reconstrucție**: `[system, first_user, assistant(summary), last_user]`

Compresia este omisă dacă există mai puțin de 2 mesaje `user` distincte (nu există parte mediană de sumarizat) sau dacă apelul de sumarizare LLM eșuează (fallback sigur: returnarea mesajelor originale).

### Observabilitate

Fiecare eveniment de compresie este înregistrat astfel:
- O intrare `_context_compression` în `tool_calls_collected` → vizibilă în detaliul rulării din Execution History
- Un eveniment `on_tool_call` cu `phase: "compression"` → afișat în panoul Debug ca `Context compressed (N messages → summary)`
- O intrare de trace LLM `context.compression` → vizibilă în tabul Traces cu estimări de tokenuri înainte/după

Apelurile de instrumente ale agentului emit de asemenea observabilitate mai bogată:

- Câmpuri de ciclu de viață per apel pe `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregate pe rezultatul agentului (numărători după status plus durata totală/maximă); intrările `_context_compression` sunt excluse din aceste numărători
- Span-uri copil OpenTelemetry opționale denumite `heym.agent.tool.execute` (consultați [OpenTelemetry Tracing](./opentelemetry.md))
- Payload-urile persistate de trace LLM / execution-history `tool_calls` sunt redactate și limitate ca dimensiune; starea live de reluare HITL păstrează originalele pentru potrivire

## Related

- [Why Heym](../getting-started/why-heym.md) – Orchestrare multi-agent pe parcursul ciclului de viață al agentului
- [Agent Node](../nodes/agent-node.md) – Configurare și parametri
- [Agent Persistent Memory](./agent-persistent-memory.md) – Graf de cunoștințe per nod agent și partajare între peer-i
- [Human-in-the-Loop](./human-in-the-loop.md) – Linkuri de revizuire, payload-uri în așteptare și comportament de reluare
- [OpenTelemetry Tracing](./opentelemetry.md) – Span-uri pentru Workflow, nod și instrumente Agent
- [Node Types](./node-types.md) – Agent și noduri asociate
- [Parallel Execution](./parallel-execution.md) – Execuție paralelă bazată pe DAG și sub-agenți
- [MCP Tab](../tabs/mcp-tab.md) – Configurarea conexiunilor MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` pentru sub-agenți

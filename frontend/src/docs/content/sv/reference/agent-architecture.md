# Agent-arkitektur

[Noden Agent](../nodes/agent-node.md) stöder subagenter, subworkflows, canvas-nodverktyg, ett orkestrerarmönster, skills, MCP-anslutningar, verktygsanrop, valfritt [beständigt minne](./agent-persistent-memory.md) (per canvas-nod, med valfri delning till andra agenter) samt valfri [mänsklig granskning](./human-in-the-loop.md). Denna sida beskriver arkitekturen.

## Subagenter

Subagenter är agentnoder som en orkestrerare kan anropa via verktyget `call_sub_agent`.

- **Orkestrerare**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Subagenter**: Måste använda `$input.text` i sitt User Message för att ta emot orkestrerarens prompt
- **Verktyg**: `call_sub_agent` med `sub_agent_label` (enum) och `prompt`
- **Djupgräns**: Max 5 nästlade subagentanrop

### Exekveringsflöde

1. Orkestreraren beslutar att anropa en subagent
2. `_execute_sub_agent_tool` hittar målagenten via label
3. Bygger `synthetic_inputs = {"input": {"text": prompt}}`
4. Kör `_execute_agent_node` för subagenten
5. Resultatet returneras till orkestreraren

### Parallell exekvering av subagenter

När orkestreraren returnerar flera `call_sub_agent`-verktygsanrop i en och samma tur körs dessa **parallellt**. Om användaren till exempel frågar om "Paris" och orkestreraren anropar både `distanceAgent` och `foodAgent`, körs båda samtidigt i stället för sekventiellt.

- **Fördel**: Den totala tiden motsvarar ungefär den långsammaste subagenten, inte summan av alla.
- **Tips**: Uppmuntra orkestreraren att anropa flera subagenter i en och samma tur när uppgiften kräver det.

## Subworkflows

När `subWorkflowIds` är konfigurerat kan agenten anropa andra workflows via verktyget `call_sub_workflow`.

- **Konfiguration**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Verktyg**: `call_sub_workflow` med `workflow_id` (enum) och `inputs` (objekt)
- **Djupgräns**: Max 5 nästlade subworkflowanrop

### Exekveringsflöde

1. Agenten beslutar att anropa en subworkflow
2. `_execute_sub_workflow_tool` hämtar workflowen från `workflow_cache`
3. Bygger `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Kör `WorkflowExecutor.execute()` för subworkflowen
5. Resultatet returneras till agenten

Subworkflows kan inte pausa för HITL i v1. Om en nästlad subworkflow försöker gå in i ett väntande granskningsläge misslyckas exekveringen i stället för att pausas inuti det nästlade anropet.

## Canvas-nodverktyg

Canvas-nodverktyg är workflow-noder som är anslutna till en agent via handtaget `tool-input`. Under agentens uppsättning skannar `_build_node_tool_schemas` dessa kanter och lägger till ett OpenAI-kompatibelt verktygsschema per ansluten nod.

- **Verktygskälla**: `_source: "node_tool"`
- **Verktygsnamn**: härleds från den anslutna nodens label, med suffix tillagda vid dubbletter
- **Verktygsparametrar**: byggs från nodens `agentProvidedFields`
- **Fasta fält**: alla nodfält som inte listas i `agentProvidedFields` förblir i nodkonfigurationen

### Exekveringsflöde

1. Agenten beslutar att anropa ett anslutet nodverktyg
2. `_execute_node_tool` kopierar noddata
3. Agent-tillhandahållna argument sammanfogas med de konfigurerade nodfälten
4. `execute_node` kör den noden en gång med grenschemaläggning inaktiverad
5. Den ursprungliga noddatan återställs
6. Nodens utdata returneras till agenten som verktygsresultat

Verktygsnoder utesluts från normal workflow-schemaläggning så att de inte körs två gånger. De körs endast via agentens verktygsanropsväg.

## Human-in-the-Loop

När `hitlEnabled` är inställt på en agent tar agenten emot ett `request_human_review`-verktyg som den kan anropa vid specifika godkännandekontrollpunkter.

1. Systemprompten och nodens HITL-riktlinjer talar om för agenten vilka åtgärder som kräver godkännande
2. När agenten når ett av dessa steg anropar den `request_human_review`
3. Heym lagrar en ögonblicksbild av workflow-exekveringen och skapar en offentlig granskningsbegäran
4. Nodresultatet markeras som `pending` med en gransknings-URL
5. Agentens utdatahandtag `review` schemaläggs omedelbart så att aviseringsgrenar kan köras med den väntande payloaden
6. Huvudexekveringens schemaläggning stoppas tills granskaren svarar
7. Vid `accept`, `edit` eller `refuse` återuppbyggs exekveraren från den lagrade ögonblicksbilden
8. Den pausade agenten fortsätter med den godkända granskningskontexten, eller avslutas omedelbart vid `refuse`
9. Nedströms noder fortsätter efter att den återupptagna agenten har slutförts, utan att köra om grenen `review`
10. Om en senare åtgärd också kräver godkännande kan agenten skapa ytterligare en HITL-kontrollpunkt i samma körning

Sammanfattningen som visas för granskaren genereras från själva granskningsbegäran, så nodfältet kan förbli fokuserat på godkännandepolicy och timing.

Detta gör att agent-workflows kan vänta på externt godkännande samtidigt som konversationshistorik, slutförda nodutdata, loop-tillstånd och annan körtidskontext bevaras.

## Orkestrerarens verktygsexekverare

Den anpassade verktygsexekveraren dirigerar:

- **Subagentanrop** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Subworkflowanrop** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas-nodverktyg** (`_source == "node_tool"`) → `_execute_node_tool`
- **Mänsklig granskning** (`_source == "hitl"`) → skapar en väntande HITL-kontrollpunkt
- **Övriga verktyg** → `_unified_tool_executor` (Python, MCP, skill-verktyg)

Den används när HITL är aktiverat, när `isOrchestrator` med `subAgentLabels` är inställt, eller när `subWorkflowIds` är konfigurerat.
## Skills

Skills utökar agentens systemkontext och kan lägga till Python-verktyg.

- **Form**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Innehåll**: Läggs före systeminstruktionen (sammanfogas med `---`)
- **Python-verktyg**: För varje skill med `.py`-filer läggs ett `skill_{skill_name}`-verktyg till
- **Körning**: `skill_python_executor.py` kör skript med `uv run python` i en temporär katalog; argument som JSON på stdin, resultat som JSON på stdout

Skills kan läggas till genom att släppa en `.zip`- eller `.md`-fil på Skills-området i konfigurationen för [Agent-noden](../nodes/agent-node.md).

## MCP-klient

MCP-klienten (Model Context Protocol) ansluter till externa verktygsservrar.

- **Transporter**: `stdio` (kommando + argument) eller `sse` (url + headers)
- **Lista verktyg**: `list_mcp_tools` → `ClientSession.list_tools()` → konverteras till OpenAI-funktionsformat med `_source: "mcp"`
- **Kör**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultat via `_extract_tool_result`

MCP-anslutningar konfigureras i [MCP-fliken](../tabs/mcp-tab.md) eller på agentnodens `mcpConnections`.

## Tool Calling

LLM-tjänsten kör en `execute_with_tools`-loop:

1. **Kontroll av kontextkomprimering** — före varje iteration uppskattas tokenanvändning och komprimering utförs vid behov (se nedan)
2. Anropa modellen med `tools` och `tool_choice: "auto"`
3. Om `tool_calls` finns: för varje anrop körs `tool_executor(tool_def, name, args, timeout)`
4. Lägg till verktygsresultatet i meddelandena och upprepa
5. Stoppa när inga fler verktygsanrop finns eller `max_tool_iterations` har uppnåtts

### Verktygsdirigering

`_unified_tool_executor` dirigerar baserat på `_source`:

| Källa | Hanterare |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (standard) | `execute_tool` (Python-kodverktyg) |

Verktyg använder OpenAI-funktionsanropsformat: `name`, `description`, `parameters` (JSON-schema).

## Kontextkomprimering

För att förhindra kontextöversvämning hos långvariga agenter komprimerar Heym automatiskt den ackumulerade `messages`-listan före varje verktygsiteration.

### Algoritm

1. **Uppskatta tokens**: `total_chars / 4` över alla meddelanden (snabb, ingen tokenizer behövs)
2. **Tröskelkontroll**: om `estimated_tokens < context_limit × 0.80`, hoppa över komprimering
3. **Kontextgräns**: försök med `client.models.retrieve(model).context_window`; fall tillbaka på en inbyggd tabell (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.); standard 128K
4. **Bevarande av ankare**: behåll alltid
   - Första `system`-meddelandet (agentens identitet och instruktioner)
   - Första `user`-meddelandet (ursprunglig uppgift)
   - Sista `user`-meddelandet (senaste instruktionen)
5. **Sammanfatta mitten**: allt mellan första och sista user-meddelandet serialiseras och skickas till samma modell med en sammanfattningsprompt
6. **Bygg om**: `[system, first_user, assistant(summary), last_user]`

Komprimering hoppas över om det finns färre än 2 distinkta user-meddelanden (ingen mitt att sammanfatta) eller om LLM-sammanfattningsanropet misslyckas (säker fallback: returnera ursprungliga meddelanden).

### Observerbarhet

Varje komprimeringshändelse registreras som:
- En `_context_compression`-post i `tool_calls_collected` → synlig i körningshistorikens detaljvy
- En `on_tool_call`-händelse med `phase: "compression"` → visas i Debug-panelen som `Context compressed (N messages → summary)`
- En `context.compression`-LLM-spårningspost → synlig i Traces-fliken med tokenuppskattningar före/efter

Agentens verktygsanrop avger även rikare observerbarhet:

- Livscykelfält per anrop på `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Aggregerade `tool_metrics` på agentresultatet (antal per status plus total/max varaktighet); `_context_compression`-poster exkluderas från dessa antal
- Opt-in OpenTelemetry-barnspans med namnet `heym.agent.tool.execute` (se [OpenTelemetry Tracing](./opentelemetry.md))
- Sparade LLM-spårnings-/körningshistorik-`tool_calls`-payloads redigeras och storleksbegränsas; aktiv HITL-återupptagningsstatus behåller originalen för matchning

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Multi-agent-orkestrering över agentens livscykel
- [Agent-nod](../nodes/agent-node.md) – Konfiguration och parametrar
- [Agent Persistent Memory](./agent-persistent-memory.md) – Kunskapsgraf per agentnod och delning mellan parter
- [Human-in-the-Loop](./human-in-the-loop.md) – Granskningslänkar, väntande payloads och återupptagningsbeteende
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow-, nod- och Agent-verktygsspans
- [Nodtyper](./node-types.md) – Agent och relaterade noder
- [Parallell körning](./parallel-execution.md) – DAG-baserad och parallell körning av sub-agenter
- [MCP-fliken](../tabs/mcp-tab.md) – Konfigurera MCP-anslutningar
- [Expression DSL](./expression-dsl.md) – `$input.text` för sub-agenter

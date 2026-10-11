# Agent-architectuur

Het [Agent-knooppunt](../nodes/agent-node.md) ondersteunt sub-agenten, sub-workflows, canvas-node-tools, een orchestratorpatroon, skills, MCP-verbindingen, tool calling, optioneel [persistent geheugen](./agent-persistent-memory.md) (per canvas-node, met optionele deling naar andere agenten), en optionele [menselijke beoordeling](./human-in-the-loop.md). Deze pagina beschrijft de architectuur.

## Sub-agenten

Sub-agenten zijn agent-knooppunten die een orchestrator kan aanroepen via de `call_sub_agent`-tool.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agenten**: Moeten `$input.text` gebruiken in hun User Message, zodat zij de prompt van de orchestrator ontvangen
- **Tool**: `call_sub_agent` met `sub_agent_label` (enum) en `prompt`
- **Dieptelimiet**: Maximaal 5 geneste sub-agent-aanroepen

### Uitvoeringsstroom

1. De orchestrator besluit een sub-agent aan te roepen
2. `_execute_sub_agent_tool` vindt de doel-agent op basis van het label
3. Bouwt `synthetic_inputs = {"input": {"text": prompt}}`
4. Voert `_execute_agent_node` uit voor de sub-agent
5. Het resultaat wordt teruggegeven aan de orchestrator

### Parallelle sub-agent-uitvoering

Wanneer de orchestrator meerdere `call_sub_agent`-toolaanroepen in één beurt retourneert, worden deze **parallel** uitgevoerd. Als de gebruiker bijvoorbeeld naar "Parijs" vraagt en de orchestrator zowel `distanceAgent` als `foodAgent` aanroept, worden beide gelijktijdig uitgevoerd in plaats van sequentieel.

- **Voordeel**: De totale tijd is ongeveer die van de traagste sub-agent, niet de som van alle.
- **Tip**: Moedig de orchestrator aan om meerdere sub-agenten in één beurt aan te roepen wanneer de taak dat vereist.

## Sub-workflows

Wanneer `subWorkflowIds` is geconfigureerd, kan de agent andere workflows aanroepen via de `call_sub_workflow`-tool.

- **Configuratie**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tool**: `call_sub_workflow` met `workflow_id` (enum) en `inputs` (object)
- **Dieptelimiet**: Maximaal 5 geneste sub-workflow-aanroepen

### Uitvoeringsstroom

1. De agent besluit een sub-workflow aan te roepen
2. `_execute_sub_workflow_tool` haalt de workflow op uit `workflow_cache`
3. Bouwt `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Voert `WorkflowExecutor.execute()` uit voor de sub-workflow
5. Het resultaat wordt teruggegeven aan de agent

Sub-workflows kunnen in v1 niet pauzeren voor HITL. Als een geneste sub-workflow een status van lopende beoordeling probeert te bereiken, mislukt de uitvoering in plaats van binnen de geneste aanroep te pauzeren.

## Canvas-node-tools

Canvas-node-tools zijn workflow-knooppunten die via de `tool-input`-handle met een agent zijn verbonden. Tijdens de agentconfiguratie scant `_build_node_tool_schemas` die verbindingen en voegt één OpenAI-compatibel toolschema per verbonden knooppunt toe.

- **Toolbron**: `_source: "node_tool"`
- **Toolnaam**: afgeleid van het label van het verbonden knooppunt, met achtervoegsels toegevoegd bij duplicaten
- **Toolparameters**: opgebouwd uit de `agentProvidedFields` van het knooppunt
- **Vaste velden**: alle knooppuntvelden die niet in `agentProvidedFields` staan, blijven in de knooppuntconfiguratie

### Uitvoeringsstroom

1. De agent besluit een verbonden knooppunt-tool aan te roepen
2. `_execute_node_tool` kopieert de knooppuntgegevens
3. Door de agent aangeleverde argumenten worden samengevoegd met de geconfigureerde knooppuntvelden
4. `execute_node` voert dat knooppunt één keer uit met branch-scheduling uitgeschakeld
5. De oorspronkelijke knooppuntgegevens worden hersteld
6. De knooppuntuitvoer wordt als toolresultaat aan de agent teruggegeven

Tool-knooppunten worden uitgesloten van de normale workflow-scheduling, zodat zij niet tweemaal worden uitgevoerd. Zij worden uitsluitend uitgevoerd via het pad van de agent-toolaanroep.

## Human-in-the-Loop

Wanneer `hitlEnabled` op een agent is ingesteld, ontvangt de agent een `request_human_review`-tool die hij kan aanroepen bij specifieke goedkeuringscontrolepunten.

1. De systeemprompt en de HITL-richtlijnen van het knooppunt vertellen de agent welke acties goedkeuring vereisen
2. Wanneer de agent een van die stappen bereikt, roept hij `request_human_review` aan
3. Heym slaat een snapshot van de workflow-uitvoering op en maakt een openbare beoordelingsaanvraag aan
4. Het knooppuntresultaat wordt gemarkeerd als `pending` met een beoordelings-URL
5. De `review`-uitvoerhandle van de agent wordt onmiddellijk gepland, zodat notificatiebranches kunnen worden uitgevoerd met de pending-payload
6. De hoofdplanning van de uitvoering stopt totdat de beoordelaar reageert
7. Bij `accept`, `edit` of `refuse` wordt de executor opnieuw opgebouwd vanuit de opgeslagen snapshot
8. De gepauzeerde agent gaat verder met de goedgekeurde beoordelingscontext, of stopt onmiddellijk bij `refuse`
9. Stroomafwaartse knooppunten gaan verder nadat de hervatte agent klaar is, zonder de `review`-branch opnieuw uit te voeren
10. Als een latere actie ook goedkeuring vereist, kan de agent in dezelfde run een nieuw HITL-controlepunt aanmaken

De samenvatting voor de beoordelaar wordt gegenereerd vanuit de beoordelingsaanvraag zelf, zodat het knooppuntveld gericht kan blijven op het goedkeuringsbeleid en de timing.

Hierdoor kunnen agent-workflows wachten op externe goedkeuring, met behoud van gespreksgeschiedenis, voltooide knooppuntuitvoer, loop-status en andere runtime-context.

## Orchestrator-tool-executor

De aangepaste tool-executor routeert:

- **Sub-agent-aanroepen** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-workflow-aanroepen** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas-node-tools** (`_source == "node_tool"`) → `_execute_node_tool`
- **Menselijke beoordeling** (`_source == "hitl"`) → maakt een pending HITL-controlepunt aan
- **Overige tools** → `_unified_tool_executor` (Python, MCP, skill-tools)

Deze wordt gebruikt wanneer HITL is ingeschakeld, wanneer `isOrchestrator` met `subAgentLabels` is ingesteld, of wanneer `subWorkflowIds` is geconfigureerd.

## Skills

Skills breiden de systeemcontext van de agent uit en kunnen Python-tools toevoegen.

- **Vorm**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Content**: Wordt voorafgegaan aan de systeeminstructie (samengevoegd met `---`)
- **Python-tools**: Voor elke skill met `.py`-bestanden wordt een `skill_{skill_name}`-tool toegevoegd
- **Uitvoering**: `skill_python_executor.py` voert scripts uit met `uv run python` in een tijdelijke map; argumenten als JSON op stdin, resultaat als JSON op stdout

Skills kunnen worden toegevoegd door een `.zip`- of `.md`-bestand naar het Skills-gebied in de configuratie van het [Agent-knooppunt](../nodes/agent-node.md) te slepen.

## MCP Client

De MCP (Model Context Protocol)-client maakt verbinding met externe toolservers.

- **Transports**: `stdio` (commando + argumenten) of `sse` (url + headers)
- **Tools weergeven**: `list_mcp_tools` → `ClientSession.list_tools()` → geconverteerd naar OpenAI-functieformaat met `_source: "mcp"`
- **Uitvoeren**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultaat via `_extract_tool_result`

Configureer MCP-verbindingen in het [MCP-tabblad](../tabs/mcp-tab.md) of via de `mcpConnections` van het agent-knooppunt.

## Tool Calling

De LLM-service voert een `execute_with_tools`-lus uit:

1. **Contextcompressie-controle** — vóór elke iteratie wordt het tokengebruik geschat en indien nodig gecomprimeerd (zie hieronder)
2. Roep het model aan met `tools` en `tool_choice: "auto"`
3. Als `tool_calls` bestaan: voer voor elke aanroep `tool_executor(tool_def, name, args, timeout)` uit
4. Voeg het toolresultaat toe aan de berichten en herhaal
5. Stop wanneer er geen toolaanroepen meer zijn of `max_tool_iterations` is bereikt

### Tool Dispatch

`_unified_tool_executor` routeert op basis van `_source`:

| Bron | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (standaard) | `execute_tool` (Python-codeertools) |

Tools gebruiken het OpenAI function-calling-formaat: `name`, `description`, `parameters` (JSON-schema).

## Contextcompressie

Om contextoverloop bij langdurig actieve agenten te voorkomen, comprimeert Heym automatisch de opgebouwde `messages`-lijst vóór elke tool-iteratie.

### Algoritme

1. **Tokens schatten**: `total_chars / 4` over alle berichten (snel, geen tokenizer nodig)
2. **Drempelcontrole**: als `estimated_tokens < context_limit × 0.80`, sla compressie over
3. **Contextlimiet**: probeer `client.models.retrieve(model).context_window`; val terug op een ingebouwde tabel (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, enz.); standaard 128K
4. **Behoud van ankerpunten**: behoud altijd
   - Eerste `system`-bericht (agent-identiteit en instructies)
   - Eerste `user`-bericht (oorspronkelijke taak)
   - Laatste `user`-bericht (meest recente instructie)
5. **Midden samenvatten**: alles tussen het eerste en laatste user-bericht wordt geserialiseerd en naar hetzelfde model gestuurd met een samenvattingsprompt
6. **Heropbouwen**: `[system, first_user, assistant(summary), last_user]`

Compressie wordt overgeslagen als er minder dan 2 afzonderlijke user-berichten zijn (geen midden om samen te vatten) of als de LLM-samenvattingsaanroep mislukt (veilige terugval: oorspronkelijke berichten retourneren).

### Observeerbaarheid

Elke compressiegebeurtenis wordt vastgelegd als:
- Een `_context_compression`-vermelding in `tool_calls_collected` → zichtbaar in het detail van de uitvoeringsgeschiedenis
- Een `on_tool_call`-gebeurtenis met `phase: "compression"` → weergegeven in het Debug-paneel als `Context compressed (N messages → summary)`
- Een `context.compression` LLM-trace-vermelding → zichtbaar in het tabblad Traces met token-schattingen vóór/na

Agent-toolaanroepen leveren ook rijkere observeerbaarheid op:

- Per-aanroep lifecycle-velden op `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Geaggregeerde `tool_metrics` op het agent-resultaat (tellingen per status plus totale/maximale duur); `_context_compression`-vermeldingen worden uitgesloten van deze tellingen
- Optionele OpenTelemetry-child-spans met de naam `heym.agent.tool.execute` (zie [OpenTelemetry Tracing](./opentelemetry.md))
- Opgeslagen LLM-trace-/uitvoeringsgeschiedenis-`tool_calls`-payloads worden geredigeerd en in grootte beperkt; live HITL-hervattingsstatus behoudt originelen voor matching

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Multi-agent orkestratie gedurende de levenscyclus van de agent
- [Agent-knooppunt](../nodes/agent-node.md) – Configuratie en parameters
- [Agent Persistent Memory](./agent-persistent-memory.md) – Kennisgraaf per agent-knooppunt en delen met peers
- [Human-in-the-Loop](./human-in-the-loop.md) – Review-links, openstaande payloads en hervattingsgedrag
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow-, knooppunt- en Agent-tool-spans
- [Knooppunttypen](./node-types.md) – Agent en gerelateerde knooppunten
- [Parallelle uitvoering](./parallel-execution.md) – DAG-gebaseerde en sub-agent parallelle uitvoering
- [MCP-tabblad](../tabs/mcp-tab.md) – MCP-verbindingen configureren
- [Expression DSL](./expression-dsl.md) – `$input.text` voor sub-agenten

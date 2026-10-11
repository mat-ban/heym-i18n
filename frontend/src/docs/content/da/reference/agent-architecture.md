# Agent Arkitektur

[Agent Node](../nodes/agent-node.md) understøtter sub-agenter, sub-workflows, canvas node tools, et orchestrator-mønster, skills, MCP-forbindelser, tool calling, valgfri [persistent hukommelse](./agent-persistent-memory.md) (per canvas node, med valgfri deling til andre agenter) og valgfri [menneskelig gennemgang](./human-in-the-loop.md). Denne side beskriver arkitekturen.

## Sub-Agenter

Sub-agenter er agent-noder, som en orchestrator kan kalde via `call_sub_agent`-toollet.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agenter**: Skal bruge `$input.text` i deres User Message for at modtage orchestratorens prompt
- **Tool**: `call_sub_agent` med `sub_agent_label` (enum) og `prompt`
- **Dybdemaksimum**: Maksimalt 5 nested sub-agent-kald

### Kørselsflow

1. Orchestrator beslutter at kalde en sub-agent
2. `_execute_sub_agent_tool` finder den målrettede agent via label
3. Bygger `synthetic_inputs = {"input": {"text": prompt}}`
4. Kører `_execute_agent_node` for sub-agenten
5. Resultatet returneres til orchestratoren

### Parallel Sub-Agent Kørsel

Når orchestratoren returnerer flere `call_sub_agent`-toolkald i en enkelt tur, udføres de **parallelt**. For eksempel, hvis brugeren spørger om "Paris" og orchestratoren kalder både `distanceAgent` og `foodAgent`, kører begge samtidigt i stedet for sekventielt.

- **Fordel**: Den samlede tid er cirka den langsommeste sub-agent, ikke summen af alle.
- **Tip**: Opfordr orchestratoren til at kalde flere sub-agenter i en enkelt tur, når opgaven kræver det.

## Sub-Workflows

Når `subWorkflowIds` er konfigureret, kan agenten kalde andre workflows via `call_sub_workflow`-toollet.

- **Konfiguration**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tool**: `call_sub_workflow` med `workflow_id` (enum) og `inputs` (object)
- **Dybdemaksimum**: Maksimalt 5 nested sub-workflow-kald

### Kørselsflow

1. Agenten beslutter at kalde et sub-workflow
2. `_execute_sub_workflow_tool` henter workflowet fra `workflow_cache`
3. Bygger `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Kører `WorkflowExecutor.execute()` for sub-workflowet
5. Resultatet returneres til agenten

Sub-workflows kan ikke pause for HITL i v1. Hvis et nested sub-workflow forsøger at indtræde i en pending review-tilstand, fejler kørslen i stedet for at suspendere inden i det nestede kald.

## Canvas Node Tools

Canvas node tools er workflow-noder forbundet til en agent via `tool-input`-håndtaget. Under agentopsætning scanner `_build_node_tool_schemas` disse kanter og tilføjer et OpenAI-kompatibelt tool-schema per forbundet node.

- **Toolkilde**: `_source: "node_tool"`
- **Toolnavn**: afledt af den forbundne nodes label, med suffikser tilføjet for dubletter
- **Toolparametre**: bygget fra nodens `agentProvidedFields`
- **Faste felter**: alle nodefelter, der ikke er listet i `agentProvidedFields`, forbliver i nodekonfigurationen

### Kørselsflow

1. Agenten beslutter at kalde et forbundet node-tool
2. `_execute_node_tool` kopierer nodedataene
3. Agentleverede argumenter flettes ind i de konfigurerede nodefelter
4. `execute_node` kører noden én gang med branch-scheduling deaktiveret
5. De originale nodedata gendannes
6. Node-outputtet returneres til agenten som tool-resultatet

Tool-noder udelukkes fra normal workflow-scheduling, så de ikke kører to gange. De udføres kun gennem agent-tool-kaldstien.

## Human-in-the-Loop

Når `hitlEnabled` er aktiveret på en agent, modtager agenten et `request_human_review`-tool, som den kan kalde ved specifikke godkendelsespunkter.

1. Systemprompten og node HITL-retningslinjerne fortæller agenten, hvilke handlinger der kræver godkendelse
2. Når agenten når et af disse trin, kalder den `request_human_review`
3. Heym gemmer et workflow-kørselsøjebliksbillede og opretter en offentlig gennemgangsanmodning
4. Node-resultatet markeres som `pending` med en gennemgangs-URL
5. Agentens `review`-output-håndtag planlægges med det samme, så notifikationsgrene kan køre med den pending payload
6. Hovedkørselsplanlægningen stopper, indtil gennemgangeren svarer
7. Ved `accept`, `edit` eller `refuse` genbygges executor fra det gemte øjebliksbillede
8. Den pausede agent fortsætter med den godkendte gennemgangskontekst eller afslutter øjeblikkeligt ved `refuse`
9. Downstream-noder fortsætter efter den genoptagede agent er færdig, uden at køre `review`-grenen igen
10. Hvis en senere handling også kræver godkendelse, kan agenten oprette et andet HITL-checkpoint i samme kørsel

Gennemgangssammenfattelsen genereres fra gennemgangsanmodningen selv, så nodefeltet kan forblive fokuseret på godkendelsespolitik og timing.

Dette giver mulighed for, at agent-workflows kan vente på ekstern godkendelse, samtidig med at samtalehistorik, færdiggjorte node-outputs, loop-tilstand og anden runtime-kontekst bevares.

## Orchestrator Tool Executor

Den brugerdefinerede tool executor routerer:

- **Sub-agent-kald** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-workflow-kald** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas node tools** (`_source == "node_tool"`) → `_execute_node_tool`
- **Menneskelig gennemgang** (`_source == "hitl"`) → opretter et pending HITL-checkpoint
- **Andre tools** → `_unified_tool_executor` (Python, MCP, skill tools)

Den bruges, når HITL er aktiveret, når `isOrchestrator` med `subAgentLabels` er sat, eller når `subWorkflowIds` er konfigureret.
## Færdigheder

Færdigheder udvider agentens systemkontekst og kan tilføje Python-værktøjer.

- **Form**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Indhold**: Tilføjes foran systeminstruktionen (sammenkædet med `---`)
- **Python-værktøjer**: For hver færdighed med `.py`-filer tilføjes et `skill_{skill_name}`-værktøj
- **Udførelse**: `skill_python_executor.py` kører scripts med `uv run python` i en midlertidig mappe; argumenter som JSON på stdin, resultat som JSON på stdout

Færdigheder kan tilføjes ved at trække en `.zip`- eller `.md`-fil ind i færdighedsområdet i [Agent Node](../nodes/agent-node.md)-konfigurationen.

## MCP-klient

MCP-klienten (Model Context Protocol) forbinder til eksterne værktøjsservere.

- **Transport**: `stdio` (kommando + argumenter) eller `sse` (url + headers)
- **Liste over værktøjer**: `list_mcp_tools` → `ClientSession.list_tools()` → konverteret til OpenAI-funktionsformat med `_source: "mcp"`
- **Udførelse**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultat via `_extract_tool_result`

MCP-forbindelser konfigureres under [MCP-fanen](../tabs/mcp-tab.md) eller på agentnodens `mcpConnections`.

## Værktøjsudførelse

LLM-tjenesten kører en `execute_with_tools`-løkke:

1. **Kontrol af kontekstkomprimering** - før hver iteration estimeres tokenforbrug og komprimeres om nødvendigt (se nedenfor)
2. Kald modellen med `tools` og `tool_choice: "auto"`
3. Hvis `tool_calls` findes: for hvert kald køres `tool_executor(tool_def, name, args, timeout)`
4. Tilføj værktøjsresultat til beskeder, gentag
5. Stop når der ikke er flere værktøjskald eller `max_tool_iterations` er nået

### Værktøjsdistribution

`_unified_tool_executor` dirigerer efter `_source`:

| Kilde | Håndtering |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (standard) | `execute_tool` (Python-kodeværktøjer) |

Værktøjer bruger OpenAI-funktionskaldformat: `name`, `description`, `parameters` (JSON-skema).

## Kontekstkomprimering

For at undgå kontekstoverløb ved langvarige agenter komprimerer Heym automatisk den akkumulerede `messages`-liste før hver værktøjsiteration.

### Algoritme

1. **Estimer tokens**: `total_chars / 4` på tværs af alle beskeder (hurtigt, ingen tokenizer nødvendig)
2. **Tærskelkontrol**: hvis `estimated_tokens < context_limit × 0.80`, springes komprimering over
3. **Kontekstgrænse**: prøv `client.models.retrieve(model).context_window`; brug ellers en indbygget tabel (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, osv.); standard 128K
4. **Ankerbevarelse**: behold altid
   - Første `system`-besked (agentidentitet og instruktioner)
   - Første `user`-besked (oprindelig opgave)
   - Sidste `user`-besked (seneste instruktion)
5. **Resumér midten**: alt mellem første og sidste user-besked serialiseres og sendes til samme model med en resumé-prompt
6. **Genopbyg**: `[system, first_user, assistant(summary), last_user]`

Komprimering springes over, hvis der er færre end 2 forskellige user-beskeder (ingen midte at resumere) eller hvis LLM-resuméopkaldet fejler (sikker fallback: returner originale beskeder).

### Observerbarhed

Hver komprimeringshændelse registreres som:
- En `_context_compression`-post i `tool_calls_collected` → synlig i Kørselshistorikkens kørselsdetaljer
- En `on_tool_call`-hændelse med `phase: "compression"` → vist i Debug-panelet som `Context compressed (N messages → summary)`
- En `context.compression`-LLM-sporpost → synlig under Traces-fanen med før/efter token-estimater

Agentværktøjskald udsender også mere detaljeret observerbarhed:

- Livscyklusfelter pr. kald på `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Aggregeret `tool_metrics` på agentresultatet (tællinger efter status plus total/maks varighed); `_context_compression`-poster udelukkes fra disse tællinger
- Valgfri OpenTelemetry-underopdelinger navngivet `heym.agent.tool.execute` (se [OpenTelemetry Tracing](./opentelemetry.md))
- Vedvarende LLM-spor/kørselshistorik-`tool_calls`-payloads redigeres og størrelsesbegrænses; live HITL-genoptagelsestilstand bevarer originaler til matching

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Multi-agent-orkestrering gennem agentens livscyklus
- [Agent Node](../nodes/agent-node.md) – Konfiguration og parametre
- [Agent Persistent Memory](./agent-persistent-memory.md) – Vidensgraf pr. agentnode og peer-deling
- [Human-in-the-Loop](./human-in-the-loop.md) – Gennemgangslinks, ventende payloads og genoptagelsesadfærd
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow-, node- og agentværktøjsopdelinger
- [Node-typer](./node-types.md) – Agent- og relaterede noder
- [Parallel Execution](./parallel-execution.md) – DAG-baseret og sub-agent parallel udførelse
- [MCP-fane](../tabs/mcp-tab.md) – Konfigurer MCP-forbindelser
- [Expression DSL](./expression-dsl.md) – `$input.text` for sub-agenter

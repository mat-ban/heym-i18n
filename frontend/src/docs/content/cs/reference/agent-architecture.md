# Architektura agenta

Uzel [Agent Node](../nodes/agent-node.md) podporuje sub-agenty, sub-workflow, nástroje uzlů plátna, vzor orchestrátoru, dovednosti, připojení MCP, volání nástrojů, volitelnou [persistentní paměť](./agent-persistent-memory.md) (pro každý uzel plátna, s volitelným sdílením s dalšími agenty) a volitelnou [kontrolu člověkem](./human-in-the-loop.md). Tato stránka popisuje architekturu.

## Sub-agenti

Sub-agenti jsou uzly agenta, které může orchestrátor volat prostřednictvím nástroje `call_sub_agent`.

- **Orchestrátor**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agenti**: Ve své User Message musí používat `$input.text`, aby obdrželi prompt od orchestrátoru
- **Nástroj**: `call_sub_agent` s `sub_agent_label` (enum) a `prompt`
- **Limit hloubky**: Maximálně 5 vnořených volání sub-agentů

### Průběh provádění

1. Orchestrátor se rozhodne zavolat sub-agenta
2. `_execute_sub_agent_tool` vyhledá cílového agenta podle označení
3. Sestaví `synthetic_inputs = {"input": {"text": prompt}}`
4. Spustí `_execute_agent_node` pro sub-agenta
5. Výsledek se vrátí orchestrátoru

### Paralelní provádění sub-agentů

Když orchestrátor vrátí v jednom tahu více volání nástroje `call_sub_agent`, jsou provedena **paralelně**. Pokud se například uživatel ptá na „Paris" a orchestrátor zavolá jak `distanceAgent`, tak `foodAgent`, oba běží souběžně místo sekvenčně.

- **Přínos**: Celkový čas je přibližně roven nejpomalejšímu sub-agentovi, nikoli součtu všech.
- **Tip**: Povzbuďte orchestrátor, aby v jednom tahu zavolal více sub-agentů, pokud to úloha vyžaduje.

## Sub-workflow

Když je nakonfigurováno `subWorkflowIds`, může agent volat další workflow prostřednictvím nástroje `call_sub_workflow`.

- **Konfigurace**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Nástroj**: `call_sub_workflow` s `workflow_id` (enum) a `inputs` (objekt)
- **Limit hloubky**: Maximálně 5 vnořených volání sub-workflow

### Průběh provádění

1. Agent se rozhodne zavolat sub-workflow
2. `_execute_sub_workflow_tool` načte workflow z `workflow_cache`
3. Sestaví `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Spustí `WorkflowExecutor.execute()` pro sub-workflow
5. Výsledek se vrátí agentovi

Sub-workflow nemohou v v1 pozastavit běh kvůli HITL. Pokud se vnořené sub-workflow pokusí přejít do stavu čekajícího na kontrolu, provádění selže místo toho, aby se pozastavilo uvnitř vnořeného volání.

## Nástroje uzlů plátna

Nástroje uzlů plátna jsou uzly workflow připojené k agentovi prostřednictvím handle `tool-input`. Během nastavení agenta `_build_node_tool_schemas` prohledá tyto hrany a přidá jedno schéma nástroje kompatibilní s OpenAI pro každý připojený uzel.

- **Zdroj nástroje**: `_source: "node_tool"`
- **Název nástroje**: odvozen z označení připojeného uzlu, s příponami přidanými u duplicit
- **Parametry nástroje**: sestaveny z `agentProvidedFields` uzlu
- **Pevná pole**: všechna pole uzlu neuvedená v `agentProvidedFields` zůstávají v konfiguraci uzlu

### Průběh provádění

1. Agent se rozhodne zavolat nástroj připojeného uzlu
2. `_execute_node_tool` zkopíruje data uzlu
3. Argumenty poskytnuté agentem se sloučí do nakonfigurovaných polí uzlu
4. `execute_node` spustí tento uzel jednou s vypnutým plánováním větví
5. Původní data uzlu se obnoví
6. Výstup uzlu se vrátí agentovi jako výsledek nástroje

Uzly nástrojů jsou vyloučeny z běžného plánování workflow, aby neběžely dvakrát. Spouštějí se pouze prostřednictvím cesty volání nástroje agenta.

## Kontrola člověkem (Human-in-the-Loop)

Když je na agentovi nastaveno `hitlEnabled`, agent obdrží nástroj `request_human_review`, který může volat v konkrétních kontrolních bodech schválení.

1. Systémový prompt a pokyny HITL uzlu sdělují agentovi, které akce vyžadují schválení
2. Když agent dosáhne jednoho z těchto kroků, zavolá `request_human_review`
3. Heym uloží snímek provádění workflow a vytvoří veřejnou žádost o kontrolu
4. Výsledek uzlu je označen jako `pending` s URL pro kontrolu
5. Výstupní handle `review` agenta je naplánován okamžitě, aby větve oznámení mohly běžet s čekajícím payloadem
6. Plánování hlavního provádění se zastaví, dokud kontrolor neodpoví
7. Při `accept`, `edit` nebo `refuse` je exekutor znovu sestaven z uloženého snímku
8. Pozastavený agent pokračuje se schváleným kontextem kontroly, nebo při `refuse` okamžitě skončí
9. Následné uzly pokračují poté, co obnovený agent dokončí práci, aniž by znovu spouštěly větev `review`
10. Pokud i pozdější akce vyžaduje schválení, může agent vytvořit další kontrolní bod HITL ve stejném běhu

Souhrn pro kontrolora je generován ze samotné žádosti o kontrolu, takže pole uzlu se může soustředit na zásady schvalování a načasování.

To umožňuje workflow agenta čekat na externí schválení při zachování historie konverzace, dokončených výstupů uzlů, stavu smyčky a dalšího kontextu běhu.

## Exekutor nástrojů orchestrátoru

Vlastní exekutor nástrojů směruje:

- **Volání sub-agentů** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Volání sub-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Nástroje uzlů plátna** (`_source == "node_tool"`) → `_execute_node_tool`
- **Kontrola člověkem** (`_source == "hitl"`) → vytvoří čekající kontrolní bod HITL
- **Ostatní nástroje** → `_unified_tool_executor` (Python, MCP, nástroje dovedností)

Používá se, když je povoleno HITL, když je nastaven `isOrchestrator` s `subAgentLabels`, nebo když je nakonfigurováno `subWorkflowIds`.
## Dovednosti

Dovednosti rozšiřují systémový kontext agenta a mohou přidávat Python nástroje.

- **Struktura**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Obsah**: Přidán na začátek systémové instrukce (spojen pomocí `---`)
- **Python nástroje**: Pro každou dovednost se soubory `.py` je přidán nástroj `skill_{skill_name}`
- **Spouštění**: `skill_python_executor.py` spouští skripty pomocí `uv run python` v dočasném adresáři; argumenty jako JSON na stdin, výsledek jako JSON na stdout

Dovednosti lze přidat přetažením souboru `.zip` nebo `.md` do oblasti Skills v konfiguraci [uzlu Agent](../nodes/agent-node.md).

## MCP Client

Klient MCP (Model Context Protocol) se připojuje k externím serverům nástrojů.

- **Přenosy**: `stdio` (příkaz + argumenty) nebo `sse` (url + hlavičky)
- **Výpis nástrojů**: `list_mcp_tools` → `ClientSession.list_tools()` → převedeno do formátu funkce OpenAI s `_source: "mcp"`
- **Spuštění**: `execute_mcp_tool` → `ClientSession.call_tool()` → výsledek přes `_extract_tool_result`

Připojení MCP konfigurujte na [kartě MCP](../tabs/mcp-tab.md) nebo v `mcpConnections` uzlu agenta.

## Volání nástrojů

Služba LLM spouští smyčku `execute_with_tools`:

1. **Kontrola komprese kontextu** — před každou iterací odhadněte využití tokenů a v případě potřeby proveďte kompresi (viz níže)
2. Zavolejte model s `tools` a `tool_choice: "auto"`
3. Pokud existují `tool_calls`: pro každé volání spusťte `tool_executor(tool_def, name, args, timeout)`
4. Připojte výsledek nástroje ke zprávám, opakujte
5. Zastavte, když nejsou žádná další volání nástrojů nebo je dosaženo `max_tool_iterations`

### Směrování nástrojů

`_unified_tool_executor` směruje podle `_source`:

| Zdroj | Obsluha |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (výchozí) | `execute_tool` (nástroje s Python kódem) |

Nástroje používají formát volání funkcí OpenAI: `name`, `description`, `parameters` (JSON schéma).

## Komprese kontextu

Aby se zabránilo přetečení kontextu u dlouho běžících agentů, Heym automaticky komprimuje nahromaděný seznam `messages` před každou iterací nástroje.

### Algoritmus

1. **Odhad tokenů**: `total_chars / 4` napříč všemi zprávami (rychlé, není potřeba tokenizer)
2. **Kontrola prahu**: pokud `estimated_tokens < context_limit × 0.80`, komprese se přeskočí
3. **Limit kontextu**: zkuste `client.models.retrieve(model).context_window`; jinak použijte vestavěnou tabulku (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M atd.); výchozí 128K
4. **Zachování kotev**: vždy zachovat
   - První zprávu `system` (identita a instrukce agenta)
   - První zprávu `user` (původní úkol)
   - Poslední zprávu `user` (nejnovější instrukce)
5. **Shrnutí středu**: vše mezi první a poslední zprávou uživatele je serializováno a odesláno stejnému modelu s promptem pro shrnutí
6. **Přestavba**: `[system, first_user, assistant(summary), last_user]`

Komprese se přeskočí, pokud existují méně než 2 odlišné zprávy uživatele (není co shrnout) nebo pokud volání shrnutí LLM selže (bezpečný fallback: vrátí původní zprávy).

### Pozorovatelnost

Každá událost komprese je zaznamenána jako:
- Záznam `_context_compression` v `tool_calls_collected` → viditelný v detailu běhu v Execution History
- Událost `on_tool_call` s `phase: "compression"` → vykreslena v panelu Debug jako `Context compressed (N messages → summary)`
- Záznam LLM trace `context.compression` → viditelný na kartě Traces s odhady tokenů před/po

Volání nástrojů agenta také vysílají bohatší pozorovatelnost:

- Pole životního cyklu jednotlivých volání na `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Agregované `tool_metrics` na výsledku agenta (počty podle stavu plus celková/maximální doba trvání); záznamy `_context_compression` jsou z těchto počtů vyloučeny
- Volitelné podřízené spany OpenTelemetry s názvem `heym.agent.tool.execute` (viz [OpenTelemetry Tracing](./opentelemetry.md))
- Uložené datové části `tool_calls` v LLM trace / execution-history jsou redigovány a omezeny velikostí; živý stav HITL resume uchovává originály pro párování

## Související

- [Proč Heym](../getting-started/why-heym.md) – Multi-agentní orchestrache napříč životním cyklem agenta
- [Uzel Agent](../nodes/agent-node.md) – Konfigurace a parametry
- [Trvalá paměť agenta](./agent-persistent-memory.md) – Znalostní graf pro každý uzel agenta a sdílení mezi partnery
- [Human-in-the-Loop](./human-in-the-loop.md) – Odkazy pro kontrolu, čekající datové části a chování při obnovení
- [OpenTelemetry Tracing](./opentelemetry.md) – Spany Workflow, uzlů a nástrojů agenta
- [Typy uzlů](./node-types.md) – Agent a související uzly
- [Paralelní spouštění](./parallel-execution.md) – Paralelní spouštění založené na DAG a pod-agenty
- [Karta MCP](../tabs/mcp-tab.md) – Konfigurace připojení MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` pro pod-agenty

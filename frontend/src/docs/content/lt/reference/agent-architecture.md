# Agent Architektūra

[Agent Node](../nodes/agent-node.md) palaiko sub-agentus, sub-workflows, drobės mazgų įrankius, orkestravimo modelį, įgūdžius, MCP ryšius, įrankių iškvietimus, pasirenkamą [nuolatinę atmintį](./agent-persistent-memory.md) (pagal drobės mazgą, su galimybe dalintis su kitais agentais) ir pasirenkamą [žmogaus peržiūrą](./human-in-the-loop.md). Šiame puslapyje aprašoma architektūra.

## Sub-Agentai

Sub-agentai yra agentų mazgai, kuriuos orkestratorius gali iškviesti per `call_sub_agent` įrankį.

- **Orkestratorius**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agentai**: Privalo naudoti `$input.text` savo Vartotojo Žinutėje, kad gautų orkestratoriaus promptą
- **Įrankis**: `call_sub_agent` su `sub_agent_label` (enum) ir `prompt`
- **Gylio limitas**: Maksimalus 5 įdėtiniai sub-agentų iškvietimai

### Vykdymo Srautas

1. Orkestratorius nusprendžia iškviesti sub-agentą
2. `_execute_sub_agent_tool` randa tikslinį agentą pagal etiketę
3. Sukuria `synthetic_inputs = {"input": {"text": prompt}}`
4. Vykdo `_execute_agent_node` sub-agentui
5. Rezultatas grąžinamas orkestratoriui

### Lygiagretus Sub-Agentų Vykdymas

Kai orkestratorius grąžina kelis `call_sub_agent` įrankio iškvietimus vienu metu, jie vykdomi **lygiagrečiai**. Pavyzdžiui, jei vartotojas klausia apie "Paryžių" ir orkestratorius iškviečia tiek `distanceAgent`, tiek `foodAgent`, abu vykdomi vienu metu, o ne nuosekliai.

- **Privalumas**: Bendras laikas yra maždaug lėčiausio sub-agento laikas, o ne visų sumos.
- **Užuomina**: Skatinkite orkestratorių iškviesti kelis sub-agentus vienu metu, kai užduotis to reikalauja.

## Sub-Workflows

Kai `subWorkflowIds` yra sukonfigūruotas, agentas gali iškviesti kitus workflows per `call_sub_workflow` įrankį.

- **Konfigūracija**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Įrankis**: `call_sub_workflow` su `workflow_id` (enum) ir `inputs` (objektas)
- **Gylio limitas**: Maksimalus 5 įdėtiniai sub-workflow iškvietimai

### Vykdymo Srautas

1. Agentas nusprendžia iškviesti sub-workflow
2. `_execute_sub_workflow_tool` gauna workflow iš `workflow_cache`
3. Sukuria `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Vykdo `WorkflowExecutor.execute()` sub-workflow
5. Rezultatas grąžinamas agentui

Sub-workflows negali sustoti HITL v1 versijoje. Jei įdėtinis sub-workflow bando patekti į laukiančią peržiūros būseną, vykdymas nepavyksta, o ne sustoja įdėtiniame iškvietime.

## Drobės Mazgų Įrankiai

Drobės mazgų įrankiai yra workflow mazgai, sujungti su agentu per `tool-input` rankeną. Agentui konfigūruojant, `_build_node_tool_schemas` nuskenuoja šiuos kraštus ir prideda po vieną OpenAI suderinamą įrankio schemą kiekvienam prijungtam mazgui.

- **Įrankio šaltinis**: `_source: "node_tool"`
- **Įrankio pavadinimas**: gautas iš prijungto mazgo etiketės, su priedais, pridėtais dėl dubliavimosi
- **Įrankio parametrai**: sukurti iš mazgo `agentProvidedFields`
- **Fiksuoti laukai**: visi mazgo laukai, kurie nėra išvardyti `agentProvidedFields`, lieka mazgo konfigūracijoje

### Vykdymo Srautas

1. Agentas nusprendžia iškviesti prijungto mazgo įrankį
2. `_execute_node_tool` kopijuoja mazgo duomenis
3. Agentu pateikti argumentai sujungiami su sukonfigūruotais mazgo laukais
4. `execute_node` vykdo tą mazgą vieną kartą, kai šakų tvarkymas yra išjungtas
5. Pradiniai mazgo duomenys atkuriami
6. Mazgo išvestis grąžinama agentui kaip įrankio rezultatas

Įrankių mazgai yra neįtraukiami į įprastą workflow tvarkymą, todėl jie nevykdomi du kartus. Jie vykdomi tik per agento įrankių iškvietimo kelią.

## Žmogus Procesuose

Kai `hitlEnabled` yra nustatytas agentui, agentas gauna `request_human_review` įrankį, kurį gali iškviesti specifiniuose patvirtinimo taškuose.

1. Sistemos promptas ir mazgo HITL gairės nurodo agentui, kurios veiklos reikalauja patvirtinimo
2. Kai agentas pasiekia vieną iš tų žingsnių, jis iškviečia `request_human_review`
3. Heym saugo workflow vykdymo momentinę nuotrauką ir sukuria viešą peržiūros užklausą
4. Mazgo rezultatas pažymimas kaip `pending` su peržiūros URL
5. Agentas `review` išvesties rankena yra suplanavimas iš karto, kad pranešimų šakos galėtų veikti su laukiančiu payload
6. Pagrindinis vykdymo tvarkymas sustoja, kol peržiūrėtojas atsako
7. Priėmus, redaguojant ar atsisakius, vykdytojas yra atstatomas iš saugomos momentinės nuotraukos
8. Sustabdytas agentas tęsiasi su patvirtinta peržiūros kontekstu arba iš karto išeina, jei atsisakoma
9. Žemyn srauto mazgai tęsiasi po atnaujinto agento užbaigimo, nesikartodami `review` šakos
10. Jei vėlesnė veika taip pat reikalauja patvirtinimo, agentas gali sukurti kitą HITL patvirtinimo tašką toje pačioje vykdyme

Peržiūrėtojui skirtas santrauka generuojama iš pačios peržiūros užklausos, todėl mazgo laukas gali likti orientuotas į patvirtinimo politiką ir laiką.

Tai leidžia agentų workflows laukti išorinio patvirtinimo, išlaikant pokalbių istoriją, užbaigtų mazgų išvestis, ciklo būseną ir kitą vykdymo kontekstą.

## Orkestratoriaus Įrankių Vykdytojas

Pasirinktinis įrankių vykdytojas nukreipia:

- **Sub-agentų iškvietimus** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Sub-workflow iškvietimus** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Drobės mazgų įrankius** (`_source == "node_tool"`) → `_execute_node_tool`
- **Žmogaus peržiūrą** (`_source == "hitl"`) → sukuria laukiančią HITL patvirtinimo tašką
- **Kiti įrankiai** → `_unified_tool_executor` (Python, MCP, įgūdžių įrankiai)

Jis naudojamas, kai HITL yra įjungtas, kai `isOrchestrator` su `subAgentLabels` yra nustatytas, arba kai `subWorkflowIds` yra sukonfigūruotas.
## Įgūdžiai

Įgūdžiai plečia agento sistemos kontekstą ir gali pridėti Python įrankius.

- **Forma**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Turinys**: Pridedamas prie sistemos instrukcijos (sujungtas su `---`)
- **Python įrankiai**: Kiekvienam įgūdžiui su `.py` failais pridedamas `skill_{skill_name}` įrankis
- **Vykdymas**: `skill_python_executor.py` vykdo skriptus su `uv run python` laikinoje direktorijoje; argumentai kaip JSON stdin, rezultatas kaip JSON stdout

Įgūdžiai gali būti pridėti, tiesiog vilkdami `.zip` arba `.md` failą į Įgūdžių sritį [Agent Node](../nodes/agent-node.md) konfigūracijoje.

## MCP Klientas

MCP (Model Context Protocol) klientas jungiasi prie išorinių įrankių serverių.

- **Transportai**: `stdio` (komanda + argumentai) arba `sse` (url + antraštės)
- **Sąrašas įrankių**: `list_mcp_tools` → `ClientSession.list_tools()` → konvertuojama į OpenAI funkcijos formatą su `_source: "mcp"`
- **Vykdymas**: `execute_mcp_tool` → `ClientSession.call_tool()` → rezultatas per `_extract_tool_result`

Konfigūruokite MCP ryšius [MCP Tab](../tabs/mcp-tab.md) arba agento mazgo `mcpConnections`.

## Įrankių Kviečiamasis

LLM paslauga vykdo `execute_with_tools` ciklą:

1. **Konteksto suspaudimo patikra** — prieš kiekvieną iteraciją įvertinkite token'ų naudojimą ir suspauskite, jei reikia (žr. žemiau)
2. Kviečiate modelį su `tools` ir `tool_choice: "auto"`
3. Jei egzistuoja `tool_calls`: kiekvienam kvietimui vykdykite `tool_executor(tool_def, name, args, timeout)`
4. Pridėkite įrankio rezultatą prie žinučių, kartokite
5. Sustokite, kai nebelieka įrankių kvietimų arba pasiektas `max_tool_iterations`

### Įrankių Išsiuntimas

`_unified_tool_executor` nukreipia pagal `_source`:

| Šaltinis | Apdorotojas |
|----------|-------------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (numatytasis) | `execute_tool` (Python kodo įrankiai) |

Įrankiai naudoja OpenAI funkcijų kvietimo formatą: `name`, `description`, `parameters` (JSON schema).

## Konteksto Suspaudimas

Norint išvengti konteksto perpildymo ilgai veikiančiuose agentuose, Heym automatiškai suspaudžia sukauptą `messages` sąrašą prieš kiekvieną įrankio iteraciją.

### Algoritmas

1. **Įvertinkite token'us**: `total_chars / 4` per visas žinutes (greitai, nereikia tokenizer)
2. **Slengas**: jei `estimated_tokens < context_limit × 0.80`, praleiskite suspaudimą
3. **Konteksto limitas**: bandykite `client.models.retrieve(model).context_window`; jei nepavyksta, grįžkite prie įmontuotos lentelės (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M ir kt.); numatytasis 128K
4. **Ankuro išsaugojimas**: visada išlaikykite
   - Pirmą `system` žinutę (agento tapatybė ir instrukcijos)
   - Pirmą `user` žinutę (pradinė užduotis)
   - Paskutinę `user` žinutę (naujausia instrukcija)
5. **Apibendrinkite vidurį**: viskas tarp pirmos ir paskutinės vartotojo žinutės yra serializuojama ir siunčiama tam pačiam modeliui su apibendrinimo prompt'u
6. **Atstatykite**: `[system, first_user, assistant(summary), last_user]`

Suspaudimas praleidžiamas, jei yra mažiau nei 2 skirtingos vartotojo žinutės (nėra vidurio, kurį būtų galima apibendrinti) arba jei LLM apibendrinimo kvietimas nepavyksta (saugus atsarginis variantas: grąžinti originalias žinutes).

### Stebėjimas

Kiekvienas suspaudimo įvykis registruojamas kaip:
- `_context_compression` įrašas `tool_calls_collected` → matomas Vykdymo Istorijoje
- `on_tool_call` įvykis su `phase: "compression"` → rodomas Debug skydelyje kaip `Kontekstas suspaustas (N žinutės → santrauka)`
- `context.compression` LLM sekimo įrašas → matomas Traces skirtuke su prieš/po token'ų įverčiais

Agentų įrankių kvietimai taip pat skleidžia turtingesnį stebėjimą:

- Kiekvieno kvietimo gyvavimo ciklo laukai `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Agreguoti `tool_metrics` agento rezultatuose (skaičiai pagal statusą plius bendras/maksimalus trukmė); `_context_compression` įrašai yra neįtraukiami į tuos skaičius
- Pasirinktiniai OpenTelemetry vaikų segmentai pavadinimu `heym.agent.tool.execute` (žr. [OpenTelemetry Stebėjimas](./opentelemetry.md))
- Išsaugoti LLM sekimo / vykdymo istorijos `tool_calls` payload'ai yra redaguoti ir dydžio riboti; gyvas HITL tęstinumo būsena išlaiko originalus, kad būtų galima palyginti

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Daugiaagentinė orkestracija per agento gyvavimo ciklą
- [Agent Node](../nodes/agent-node.md) – Konfigūracija ir parametrai
- [Agento Nuolatinė Atmintis](./agent-persistent-memory.md) – Žinių grafas kiekvienam agento mazgui ir bendrinimas su kolegomis
- [Žmogus Ciklo Viduje](./human-in-the-loop.md) – Peržiūros nuorodos, laukiančios payload'ai ir tęstinumo elgesys
- [OpenTelemetry Stebėjimas](./opentelemetry.md) – Workflow, mazgo ir Agento įrankių segmentai
- [Mazgų Tipai](./node-types.md) – Agentai ir susiję mazgai
- [Lygiagreti Vykdymas](./parallel-execution.md) – DAG pagrindu ir sub-agentų lygiagretus vykdymas
- [MCP Tab](../tabs/mcp-tab.md) – Konfigūruokite MCP ryšius
- [Išraiškos DSL](./expression-dsl.md) – `$input.text` sub-agentams

# Aģentu arhitektūra

[Agent mezgls](../nodes/agent-node.md) atbalsta apakšaģentus, apakšdarbplūsmas, kanvas mezglu rīkus, orķestrētāja modeli, prasmes, MCP savienojumus, rīku izsaukšanu, neobligātu [pastāvīgo atmiņu](./agent-persistent-memory.md) (katram kanvas mezglam, ar neobligātu koplietošanu ar citiem aģentiem) un neobligātu [cilvēka pārbaudi](./human-in-the-loop.md). Šajā lapā ir aprakstīta arhitektūra.

## Apakšaģenti

Apakšaģenti ir aģentu mezgli, kurus orķestrētājs var izsaukt, izmantojot rīku `call_sub_agent`.

- **Orķestrētājs**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Apakšaģenti**: Lietotāja ziņojumā ir jāizmanto `$input.text`, lai tie saņemtu orķestrētāja prompt
- **Rīks**: `call_sub_agent` ar `sub_agent_label` (enum) un `prompt`
- **Dziļuma ierobežojums**: Maksimums 5 ligzdoti apakšaģentu izsaukumi

### Izpildes plūsma

1. Orķestrētājs nolemj izsaukt apakšaģentu
2. `_execute_sub_agent_tool` atrod mērķa aģentu pēc label
3. Izveido `synthetic_inputs = {"input": {"text": prompt}}`
4. Palaiž `_execute_agent_node` apakšaģentam
5. Rezultāts tiek atgriezts orķestrētājam

### Apakšaģentu paralēlā izpilde

Kad orķestrētājs vienā gājienā atgriež vairākus `call_sub_agent` rīku izsaukumus, tie tiek izpildīti **paralēli**. Piemēram, ja lietotājs jautā par "Paris" un orķestrētājs izsauc gan `distanceAgent`, gan `foodAgent`, abi darbojas vienlaikus, nevis secīgi.

- **Ieguvums**: Kopējais laiks ir aptuveni tikpat ilgs kā lēnākajam apakšaģentam, nevis visu summa.
- **Padoms**: Mudiniet orķestrētāju vienā gājienā izsaukt vairākus apakšaģentus, ja uzdevums to prasa.

## Apakšdarbplūsmas

Kad ir konfigurēts `subWorkflowIds`, aģents var izsaukt citas darbplūsmas, izmantojot rīku `call_sub_workflow`.

- **Konfigurācija**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Rīks**: `call_sub_workflow` ar `workflow_id` (enum) un `inputs` (objekts)
- **Dziļuma ierobežojums**: Maksimums 5 ligzdoti apakšdarbplūsmu izsaukumi

### Izpildes plūsma

1. Aģents nolemj izsaukt apakšdarbplūsmu
2. `_execute_sub_workflow_tool` iegūst darbplūsmu no `workflow_cache`
3. Izveido `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Palaiž `WorkflowExecutor.execute()` apakšdarbplūsmai
5. Rezultāts tiek atgriezts aģentam

Apakšdarbplūsmas v1 versijā nevar apturēt darbību HITL vajadzībām. Ja ligzdota apakšdarbplūsma mēģina pāriet gaidīšanas pārskatīšanas stāvoklī, izpilde neizdodas, nevis tiek apturēta ligzdotā izsaukuma ietvaros.

## Kanvas mezglu rīki

Kanvas mezglu rīki ir darbplūsmas mezgli, kas savienoti ar aģentu, izmantojot `tool-input` rokturi. Aģenta iestatīšanas laikā `_build_node_tool_schemas` pārbauda šīs saites un pievieno vienu OpenAI saderīgu rīka shēmu katram pievienotajam mezglam.

- **Rīka avots**: `_source: "node_tool"`
- **Rīka nosaukums**: atvasināts no pievienotā mezgla label, ar sufiksiem, kas pievienoti dublikātiem
- **Rīka parametri**: veidoti no mezgla `agentProvidedFields`
- **Fiksētie lauki**: visi mezgla lauki, kas nav norādīti `agentProvidedFields`, paliek mezgla konfigurācijā

### Izpildes plūsma

1. Aģents nolemj izsaukt pievienotā mezgla rīku
2. `_execute_node_tool` nokopē mezgla datus
3. Aģenta nodrošinātie argumenti tiek apvienoti ar konfigurētajiem mezgla laukiem
4. `execute_node` palaiž šo mezglu vienu reizi ar atzaru plānošanu atspējotu
5. Sākotnējie mezgla dati tiek atjaunoti
6. Mezgla izvade tiek atgriezta aģentam kā rīka rezultāts

Rīku mezgli tiek izslēgti no parastās darbplūsmas plānošanas, lai tie neizpildītos divreiz. Tie izpildās tikai caur aģenta rīku izsaukšanas ceļu.

## Cilvēks ciklā (Human-in-the-Loop)

Kad aģentam ir iestatīts `hitlEnabled`, aģents saņem rīku `request_human_review`, ko tas var izsaukt konkrētos apstiprināšanas kontrolpunktos.

1. Sistēmas prompt un mezgla HITL vadlīnijas norāda aģentam, kuras darbības prasa apstiprinājumu
2. Kad aģents sasniedz vienu no šiem soļiem, tas izsauc `request_human_review`
3. Heym saglabā darbplūsmas izpildes momentuzņēmumu un izveido publisku pārskatīšanas pieprasījumu
4. Mezgla rezultāts tiek atzīmēts kā `pending` ar pārskatīšanas URL
5. Aģenta `review` izvades rokturis tiek ieplānots nekavējoties, lai paziņojumu atzari varētu darboties ar gaidošo payload
6. Galvenās izpildes plānošana apstājas, līdz pārskatītājs atbild
7. Pēc `accept`, `edit` vai `refuse` izpildītājs tiek atjaunots no saglabātā momentuzņēmuma
8. Apturētais aģents turpina darbību ar apstiprināto pārskatīšanas kontekstu vai nekavējoties iziet pēc `refuse`
9. Lejupstraumes mezgli turpina darbību pēc atsāktā aģenta pabeigšanas, nepalaižot `review` atzaru atkārtoti
10. Ja vēlāka darbība arī prasa apstiprinājumu, aģents tajā pašā palaišanas reizē var izveidot vēl vienu HITL kontrolpunktu

Pārskatītājam paredzētais kopsavilkums tiek ģenerēts no paša pārskatīšanas pieprasījuma, tāpēc mezgla lauks var palikt vērsts uz apstiprināšanas politiku un laiku.

Tas ļauj aģentu darbplūsmām gaidīt ārēju apstiprinājumu, vienlaikus saglabājot sarunas vēsturi, pabeigto mezglu izvades, cilpas stāvokli un citu izpildlaika kontekstu.

## Orķestrētāja rīku izpildītājs

Pielāgotais rīku izpildītājs maršrutē:

- **Apakšaģentu izsaukumus** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Apakšdarbplūsmu izsaukumus** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Kanvas mezglu rīkus** (`_source == "node_tool"`) → `_execute_node_tool`
- **Cilvēka pārskatīšanu** (`_source == "hitl"`) → izveido gaidošu HITL kontrolpunktu
- **Citus rīkus** → `_unified_tool_executor` (Python, MCP, prasmju rīki)

Tas tiek izmantots, kad ir iespējots HITL, kad ir iestatīts `isOrchestrator` ar `subAgentLabels` vai kad ir konfigurēts `subWorkflowIds`.
## Prasmes

Prasmes paplašina aģenta sistēmas kontekstu un var pievienot Python rīkus.

- **Forma**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Saturs**: Pievienots sistēmas instrukcijas sākumā (savienots ar `---`)
- **Python rīki**: Katrai prasmei ar `.py` failiem tiek pievienots rīks `skill_{skill_name}`
- **Izpilde**: `skill_python_executor.py` palaiž skriptus ar `uv run python` pagaidu direktorijā; argumenti kā JSON uz stdin, rezultāts kā JSON uz stdout

Prasmes var pievienot, nometot `.zip` vai `.md` failu uz Prasmju apgabalu [Agent mezgla](../nodes/agent-node.md) konfigurācijā.

## MCP klients

MCP (Model Context Protocol) klients savienojas ar ārējiem rīku serveriem.

- **Transporti**: `stdio` (komanda + argumenti) vai `sse` (url + headers)
- **Rīku saraksts**: `list_mcp_tools` → `ClientSession.list_tools()` → pārveidots OpenAI funkciju formātā ar `_source: "mcp"`
- **Izpilde**: `execute_mcp_tool` → `ClientSession.call_tool()` → rezultāts, izmantojot `_extract_tool_result`

Konfigurējiet MCP savienojumus [MCP cilnē](../tabs/mcp-tab.md) vai agent mezgla `mcpConnections`.

## Rīku izsaukšana

LLM serviss palaiž `execute_with_tools` ciklu:

1. **Konteksta saspiešanas pārbaude** — pirms katras iterācijas tiek novērtēts token patēriņš un nepieciešamības gadījumā veikta saspiešana (skatīt zemāk)
2. Izsauciet modeli ar `tools` un `tool_choice: "auto"`
3. Ja pastāv `tool_calls`: katram izsaukumam palaidiet `tool_executor(tool_def, name, args, timeout)`
4. Pievienojiet rīka rezultātu ziņojumiem, atkārtojiet
5. Apturiet, kad vairs nav rīku izsaukumu vai ir sasniegts `max_tool_iterations`

### Rīku nosūtīšana

`_unified_tool_executor` maršrutē pēc `_source`:

| Avots | Apstrādātājs |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (noklusējums) | `execute_tool` (Python koda rīki) |

Rīki izmanto OpenAI funkciju izsaukšanas formātu: `name`, `description`, `parameters` (JSON shēma).

## Konteksta saspiešana

Lai novērstu konteksta pārpildīšanu ilgstoši strādājošiem aģentiem, Heym automātiski saspiež uzkrāto `messages` sarakstu pirms katras rīku iterācijas.

### Algoritms

1. **Tokenu novērtēšana**: `total_chars / 4` visos ziņojumos (ātri, tokenizators nav nepieciešams)
2. **Sliekšņa pārbaude**: ja `estimated_tokens < context_limit × 0.80`, izlaist saspiešanu
3. **Konteksta limits**: mēģiniet `client.models.retrieve(model).context_window`; ja neizdodas, izmantojiet iebūvētu tabulu (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M utt.); noklusējums 128K
4. **Enkura saglabāšana**: vienmēr paturiet
   - Pirmo `system` ziņojumu (aģenta identitāte un instrukcijas)
   - Pirmo `user` ziņojumu (sākotnējais uzdevums)
   - Pēdējo `user` ziņojumu (jaunākā instrukcija)
5. **Vidējās daļas apkopošana**: viss starp pirmo un pēdējo lietotāja ziņojumu tiek serializēts un nosūtīts tam pašam modelim ar apkopošanas prompt
6. **Pārbūve**: `[system, first_user, assistant(summary), last_user]`

Saspiešana tiek izlaista, ja ir mazāk nekā 2 atšķirīgi lietotāja ziņojumi (nav vidējās daļas, ko apkopot) vai ja LLM apkopošanas izsaukums neizdodas (droša atkāpšanās: atgriezt sākotnējos ziņojumus).

### Novērojamība

Katrs saspiešanas notikums tiek reģistrēts kā:
- `_context_compression` ieraksts `tool_calls_collected` → redzams Izpildes vēstures palaišanas detaļās
- `on_tool_call` notikums ar `phase: "compression"` → attēlots Debug panelī kā `Context compressed (N messages → summary)`
- `context.compression` LLM trace ieraksts → redzams Traces cilnē ar pirms/pēc tokenu novērtējumiem

Aģenta rīku izsaukumi arī emitē bagātīgāku novērojamību:

- Katra izsaukuma dzīves cikla lauki `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Apkopotie `tool_metrics` aģenta rezultātā (skaitījumi pēc statusa plus kopējais/maksimālais ilgums); `_context_compression` ieraksti tiek izslēgti no šiem skaitījumiem
- Izvēles OpenTelemetry pakārtotie span ar nosaukumu `heym.agent.tool.execute` (skatīt [OpenTelemetry izsekošana](./opentelemetry.md))
- Saglabātie LLM trace / izpildes vēstures `tool_calls` payload tiek rediģēti un ierobežoti pēc izmēra; aktīvais HITL atsākšanas stāvoklis patur oriģinālus saskaņošanai

## Saistītie

- [Kāpēc Heym](../getting-started/why-heym.md) – Vairāku aģentu orķestrēšana visā aģenta dzīves ciklā
- [Agent mezgls](../nodes/agent-node.md) – Konfigurācija un parametri
- [Aģenta pastāvīgā atmiņa](./agent-persistent-memory.md) – Zināšanu grafs katram agent mezglam un koplietošana starp vienaudžiem
- [Cilvēks cilpā](./human-in-the-loop.md) – Pārskatīšanas saites, gaidošie payload un atsākšanas darbība
- [OpenTelemetry izsekošana](./opentelemetry.md) – Workflow, mezgla un Agent rīku span
- [Mezglu tipi](./node-types.md) – Agent un saistītie mezgli
- [Paralēlā izpilde](./parallel-execution.md) – Uz DAG balstīta un apakšaģentu paralēlā izpilde
- [MCP cilne](../tabs/mcp-tab.md) – Konfigurējiet MCP savienojumus
- [Izteiksmes DSL](./expression-dsl.md) – `$input.text` apakšaģentiem

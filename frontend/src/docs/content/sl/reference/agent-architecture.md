# Arhitektura Agenta

[Agent Node](../nodes/agent-node.md) podpira podagente, podworkflowe, orodja za vozlišča na platnu, vzorec orkestratorja, veščine, povezave MCP, klicanje orodij, opcionalno [trajnostno pomnilnik](./agent-persistent-memory.md) (na podlagi vozlišča platna, z možnostjo deljenja z drugimi agenti) in opcionalno [človeško pregledovanje](./human-in-the-loop.md). Ta stran opisuje arhitekturo.

## Podagenti

Podagenti so agenti, ki jih lahko orkestrator pokliče preko orodja `call_sub_agent`.

- **Orkestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Podagenti**: Morajo uporabiti `$input.text` v svoji uporabniški sporočilu, da prejmejo orkestratorjev prompt
- **Orodje**: `call_sub_agent` z `sub_agent_label` (enum) in `prompt`
- **Omejitev globine**: Maksimalno 5 gnezdenih klicev podagentov

### Potek Izvajanja

1. Orkestrator se odloči poklicati podagenta
2. `_execute_sub_agent_tool` najde ciljni agent po oznaki
3. Ustvari `synthetic_inputs = {"input": {"text": prompt}}`
4. Izvede `_execute_agent_node` za podagenta
5. Rezultat se vrne orkestratorju

### Paralelno Izvajanje Podagentov

Ko orkestrator vrne več klicev orodja `call_sub_agent` v enem obratu, se ti izvajajo **paralelno**. Na primer, če uporabnik vpraša o "Parizu" in orkestrator pokliče tako `distanceAgent` kot `foodAgent`, oba delujeta hkrati namesto zaporedno.

- **Korist**: Skupni čas je približno enak najpočasnejšemu podagentu, ne vsoti vseh.
- **Namig**: Spodbujajte orkestratorja, da pokliče več podagentov v enem obratu, ko naloga to zahteva.

## Podworkflowi

Ko je `subWorkflowIds` konfiguriran, lahko agent pokliče druge workflows preko orodja `call_sub_workflow`.

- **Konfiguracija**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Orodje**: `call_sub_workflow` z `workflow_id` (enum) in `inputs` (objekt)
- **Omejitev globine**: Maksimalno 5 gnezdenih klicev podworkflowov

### Potek Izvajanja

1. Agent se odloči poklicati podworkflow
2. `_execute_sub_workflow_tool` pridobi workflow iz `workflow_cache`
3. Ustvari `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Izvede `WorkflowExecutor.execute()` za podworkflow
5. Rezultat se vrne agentu

Podworkflowi ne morejo ustaviti za HITL v v1. Če poskuša gnezdeni podworkflow vstopiti v stanje čakanja na pregled, se izvajanje ne uspe, namesto da bi se ustavilo znotraj gnezdenega klica.

## Orodja Vozlišča na Platnu

Orodja vozlišča na platnu so vozlišča workflow, povezana z agentom preko ročaja `tool-input`. Med nastavitvijo agenta `_build_node_tool_schemas` pregleda te robove in doda eno shemo orodja, ki je združljiva z OpenAI, za vsako povezano vozlišče.

- **Vir orodja**: `_source: "node_tool"`
- **Ime orodja**: izpeljano iz oznake povezanega vozlišča, z dodanimi priponami za podvojitve
- **Parametri orodja**: zgrajeni iz `agentProvidedFields` vozlišča
- **Fiksna polja**: vsa polja vozlišča, ki niso navedena v `agentProvidedFields`, ostanejo v konfiguraciji vozlišča

### Potek Izvajanja

1. Agent se odloči poklicati povezano orodje vozlišča
2. `_execute_node_tool` kopira podatke vozlišča
3. Argumenti, ki jih zagotovi agent, se združijo v konfigurirana polja vozlišča
4. `execute_node` izvede to vozlišče enkrat z onemogočenim razporejanjem vej
5. Izvirni podatki vozlišča se obnovijo
6. Izhod vozlišča se vrne agentu kot rezultat orodja

Orodja vozlišča so izključena iz običajnega razporejanja workflow, tako da se ne izvajajo dvakrat. Izvajajo se samo preko poti klica orodja agenta.

## Človek v Zanki

Ko je `hitlEnabled` nastavljen na agentu, agent prejme orodje `request_human_review`, ki ga lahko pokliče na specifičnih točkah odobritve.

1. Sistemov prompt in smernice vozlišča HITL povedo agentu, katere akcije zahtevajo odobritev
2. Ko agent doseže eno od teh korakov, pokliče `request_human_review`
3. Heym shrani posnetek izvajanja workflow in ustvari javno zahtevo za pregled
4. Rezultat vozlišča je označen kot `pending` z URL-jem za pregled
5. Izhodna ročica agenta `review` je takoj razporejena, da lahko veje obvestil delujejo z obremenitvijo v čakanju
6. Glavno razporejanje izvajanja se ustavi, dokler recenzent ne odgovori
7. Ob `accept`, `edit` ali `refuse` se izvajalec ponovno zgradi iz shranjenega posnetka
8. Ustavljen agent nadaljuje z odobrenim kontekstom pregleda ali takoj zapusti ob `refuse`
9. Spodnja vozlišča nadaljujejo po tem, ko končan agent zaključi, brez ponovnega izvajanja veje `review`
10. Če kasnejša akcija prav tako zahteva odobritev, lahko agent ustvari še eno HITL točko v istem teku

Povzetek, ki ga vidi recenzent, je generiran iz same zahteve za pregled, tako da lahko polje vozlišča ostane osredotočeno na politiko in čas odobritve.

To omogoča, da workflows agentov čakajo na zunanjo odobritev, hkrati pa ohranjajo zgodovino pogovora, zaključene izhode vozlišč, stanje zanke in druge kontekste izvajanja.

## Izvajalec Orodij Orkestratorja

Prilagojen izvajalec orodij usmerja:

- **Klice podagentov** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Klice podworkflowov** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Orodja vozlišč na platnu** (`_source == "node_tool"`) → `_execute_node_tool`
- **Človeško pregledovanje** (`_source == "hitl"`) → ustvari čakanje na HITL točko
- **Druga orodja** → `_unified_tool_executor` (Python, MCP, orodja veščin)

Uporablja se, ko je HITL omogočen, ko je `isOrchestrator` z `subAgentLabels` nastavljen, ali ko je `subWorkflowIds` konfiguriran.
## Spretnosti

Spretnosti razširjajo sistemski kontekst agenta in lahko dodajo Python orodja.

- **Oblika**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Vsebina**: Dodana k sistemski navodili (združena z `---`)
- **Python orodja**: Za vsako spretnost z datotekami `.py` se doda orodje `skill_{skill_name}`
- **Izvajanje**: `skill_python_executor.py` izvaja skripte z `uv run python` v začasni mapi; argumenti kot JSON na stdin, rezultat kot JSON na stdout

Spretnosti lahko dodate tako, da datoteko `.zip` ali `.md` povlečete na območje Spretnosti v konfiguraciji [Agent Node](../nodes/agent-node.md).

## MCP Odjemalec

MCP (Model Context Protocol) odjemalec se povezuje z zunanjimi strežniki orodij.

- **Transporti**: `stdio` (ukaz + argumenti) ali `sse` (url + glave)
- **Seznam orodij**: `list_mcp_tools` → `ClientSession.list_tools()` → pretvorjeno v OpenAI funkcijski format z `_source: "mcp"`
- **Izvajanje**: `execute_mcp_tool` → `ClientSession.call_tool()` → rezultat preko `_extract_tool_result`

Konfigurirajte MCP povezave v [MCP zavihku](../tabs/mcp-tab.md) ali na `mcpConnections` agenta.

## Klicanje Orodij

Storitvena LLM izvaja zanko `execute_with_tools`:

1. **Preverjanje stiskanja konteksta** — pred vsako iteracijo ocenite uporabo tokenov in stisnite, če je potrebno (glejte spodaj)
2. Kličite model z `tools` in `tool_choice: "auto"`
3. Če obstajajo `tool_calls`: za vsak klic izvedite `tool_executor(tool_def, name, args, timeout)`
4. Dodajte rezultat orodja k sporočilom, ponovite
5. Ustavite, ko ni več klicev orodij ali je doseženo `max_tool_iterations`

### Razporeditev Orodij

`_unified_tool_executor` usmerja po `_source`:

| Vir   | Obdelovalec                |
|-------|----------------------------|
| `mcp` | `execute_mcp_tool`        |
| `skill` | `execute_skill_python`   |
| (privzeto) | `execute_tool` (Python orodja) |

Orodja uporabljajo OpenAI format klicanja funkcij: `name`, `description`, `parameters` (JSON shema).

## Stiskanje Konteksta

Da preprečite prelivanje konteksta pri dolgotrajnih agentih, Heym samodejno stisne akumulirano `messages` seznam pred vsako iteracijo orodja.

### Algoritem

1. **Ocenite tokene**: `total_chars / 4` preko vseh sporočil (hitro, brez potrebe po tokenizatorju)
2. **Preverjanje praga**: če je `estimated_tokens < context_limit × 0.80`, preskočite stiskanje
3. **Meja konteksta**: poskusite `client.models.retrieve(model).context_window`; v primeru neuspeha se vrnite na vgrajeno tabelo (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M itd.); privzeto 128K
4. **Ohranjanje sidra**: vedno obdržite
   - Prvo `system` sporočilo (identiteta agenta in navodila)
   - Prvo `user` sporočilo (izvirna naloga)
   - Zadnje `user` sporočilo (najnovejša navodila)
5. **Povzemanje sredine**: vse med prvim in zadnjim uporabniškim sporočilom se serializira in pošlje istemu modelu z navodilom za povzemanje
6. **Obnovitev**: `[system, first_user, assistant(summary), last_user]`

Stiskanje se preskoči, če je manj kot 2 različni uporabniški sporočili (ni sredine za povzemanje) ali če klic LLM za povzemanje ne uspe (varna rezervna možnost: vrnite izvirna sporočila).

### Opazovanje

Vsak dogodek stiskanja se zabeleži kot:
- Vnos `_context_compression` v `tool_calls_collected` → viden v podrobnostih zgodovine izvajanja
- Dogodek `on_tool_call` z `phase: "compression"` → prikazan v Debug panelu kot `Kontekst stisnjen (N sporočil → povzetek)`
- Vnos `context.compression` LLM sledi → viden v zavihku Traces z ocenami tokenov pred/po

Klici orodij agenta prav tako oddajajo bogatejše opazovanje:

- Polja življenjskega cikla na `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Agregatni `tool_metrics` na rezultatu agenta (število po statusu ter skupna/največja trajanja); vnosi `_context_compression` so izključeni iz teh številk
- Opt-in OpenTelemetry otroške razdelitve z imenom `heym.agent.tool.execute` (glejte [OpenTelemetry sledenje](./opentelemetry.md))
- Ohranjen LLM sled / zgodovina izvajanja `tool_calls` payloadi so redigirani in velikostno omejeni; živo stanje HITL nadaljevanja ohranja izvirnike za ujemanje

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Večagentna orkestracija čez življenjski cikel agenta
- [Agent Node](../nodes/agent-node.md) – Konfiguracija in parametri
- [Agent Trajna Spomin](./agent-persistent-memory.md) – Znanje graf za vsak agent node in deljenje s kolegi
- [Človek v Zanki](./human-in-the-loop.md) – Pregled povezav, čakajočih payloadov in obnašanja nadaljevanja
- [OpenTelemetry Sledenje](./opentelemetry.md) – Workflow, node in razdelitve orodij agenta
- [Vrste Vozlišč](./node-types.md) – Agent in povezana vozlišča
- [Vzporedno Izvajanje](./parallel-execution.md) – Izvajanje na osnovi DAG in pod-agentov
- [MCP Zavihek](../tabs/mcp-tab.md) – Konfigurirajte MCP povezave
- [Izraz DSL](./expression-dsl.md) – `$input.text` za pod-agente

# Architektúra agenta

[Uzol agenta](../nodes/agent-node.md) podporuje sub-agentov, sub-workflowy, nástroje uzlov plátna, vzor orchestrátora, zručnosti, MCP pripojenia, volanie nástrojov, voliteľnú [trvalú pamäť](./agent-persistent-memory.md) (pre každý uzol plátna, s voliteľným zdieľaním s inými agentmi) a voliteľnú [kontrolu človekom](./human-in-the-loop.md). Táto stránka popisuje architektúru.

## Sub-agenti

Sub-agenti sú uzly agentov, ktoré môže orchestrátor zavolať prostredníctvom nástroja `call_sub_agent`.

- **Orchestrátor**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agenti**: Musia používať `$input.text` vo svojej User Message, aby dostali prompt od orchestrátora
- **Nástroj**: `call_sub_agent` s `sub_agent_label` (enum) a `prompt`
- **Limit hĺbky**: Max 5 vnorených volaní sub-agentov

### Priebeh vykonávania

1. Orchestrátor sa rozhodne zavolať sub-agenta
2. `_execute_sub_agent_tool` nájde cieľového agenta podľa označenia
3. Zostaví `synthetic_inputs = {"input": {"text": prompt}}`
4. Spustí `_execute_agent_node` pre sub-agenta
5. Výsledok sa vráti orchestrátorovi

### Paralelné vykonávanie sub-agentov

Keď orchestrátor vráti viacero volaní nástroja `call_sub_agent` v jednom kroku, vykonajú sa **paralelne**. Napríklad, ak sa používateľ pýta na "Paris" a orchestrátor zavolá `distanceAgent` aj `foodAgent`, oba sa spustia súbežne namiesto sekvenčne.

- **Prínos**: Celkový čas je približne čas najpomalšieho sub-agenta, nie súčet všetkých.
- **Tip**: Povzbuďte orchestrátora, aby v jednom kroku zavolal viacero sub-agentov, keď to úloha vyžaduje.

## Sub-workflowy

Keď je nakonfigurované `subWorkflowIds`, agent môže volať iné workflowy prostredníctvom nástroja `call_sub_workflow`.

- **Konfigurácia**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Nástroj**: `call_sub_workflow` s `workflow_id` (enum) a `inputs` (object)
- **Limit hĺbky**: Max 5 vnorených volaní sub-workflowov

### Priebeh vykonávania

1. Agent sa rozhodne zavolať sub-workflow
2. `_execute_sub_workflow_tool` načíta workflow z `workflow_cache`
3. Zostaví `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Spustí `WorkflowExecutor.execute()` pre sub-workflow
5. Výsledok sa vráti agentovi

Sub-workflowy nemôžu v v1 pozastaviť vykonávanie kvôli HITL. Ak sa vnorený sub-workflow pokúsi prejsť do stavu čakajúceho na kontrolu, vykonávanie zlyhá namiesto pozastavenia v rámci vnoreného volania.

## Nástroje uzlov plátna

Nástroje uzlov plátna sú uzly workflowu pripojené k agentovi prostredníctvom handle `tool-input`. Počas nastavovania agenta `_build_node_tool_schemas` prehľadá tieto hrany a pridá jednu schému nástroja kompatibilnú s OpenAI pre každý pripojený uzol.

- **Zdroj nástroja**: `_source: "node_tool"`
- **Názov nástroja**: odvodený od označenia pripojeného uzla, s príponami pridanými pri duplicitách
- **Parametre nástroja**: zostavené z `agentProvidedFields` uzla
- **Pevné polia**: všetky polia uzla, ktoré nie sú uvedené v `agentProvidedFields`, zostávajú v konfigurácii uzla

### Priebeh vykonávania

1. Agent sa rozhodne zavolať nástroj pripojeného uzla
2. `_execute_node_tool` skopíruje dáta uzla
3. Argumenty poskytnuté agentom sa zlúčia do nakonfigurovaných polí uzla
4. `execute_node` spustí tento uzol raz s vypnutým plánovaním vetiev
5. Pôvodné dáta uzla sa obnovia
6. Výstup uzla sa vráti agentovi ako výsledok nástroja

Uzly nástrojov sú vylúčené z bežného plánovania workflowu, aby sa nespustili dvakrát. Vykonávajú sa iba prostredníctvom cesty volania nástroja agenta.

## Kontrola človekom (Human-in-the-Loop)

Keď je na agentovi nastavené `hitlEnabled`, agent dostane nástroj `request_human_review`, ktorý môže zavolať v konkrétnych kontrolných bodoch schválenia.

1. Systémový prompt a HITL usmernenia uzla informujú agenta, ktoré akcie vyžadujú schválenie
2. Keď agent dosiahne jeden z týchto krokov, zavolá `request_human_review`
3. Heym uloží snímku vykonávania workflowu a vytvorí verejnú žiadosť o kontrolu
4. Výsledok uzla sa označí ako `pending` s URL adresou kontroly
5. Výstupný handle `review` agenta sa naplánuje okamžite, aby vetvy s upozorneniami mohli bežať so stavom `pending` v payload
6. Hlavné plánovanie vykonávania sa zastaví, kým kontrolór neodpovie
7. Pri `accept`, `edit` alebo `refuse` sa exekútor znovu zostaví z uloženej snímky
8. Pozastavený agent pokračuje so schváleným kontextom kontroly, alebo pri `refuse` okamžite skončí
9. Nadväzujúce uzly pokračujú po dokončení obnoveného agenta bez opätovného spustenia vetvy `review`
10. Ak aj neskoršia akcia vyžaduje schválenie, agent môže v tom istom behu vytvoriť ďalší HITL kontrolný bod

Súhrn pre kontrolóra sa generuje zo samotnej žiadosti o kontrolu, takže pole uzla sa môže sústrediť na politiku schvaľovania a načasovanie.

To umožňuje workflowom agentov čakať na externé schválenie so zachovaním histórie konverzácie, výstupov dokončených uzlov, stavu slučky a ďalšieho runtime kontextu.

## Exekútor nástrojov orchestrátora

Vlastný exekútor nástrojov smeruje:

- **Volania sub-agentov** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Volania sub-workflowov** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Nástroje uzlov plátna** (`_source == "node_tool"`) → `_execute_node_tool`
- **Kontrola človekom** (`_source == "hitl"`) → vytvorí čakajúci HITL kontrolný bod
- **Ostatné nástroje** → `_unified_tool_executor` (Python, MCP, nástroje zručností)

Používa sa, keď je povolené HITL, keď je nastavené `isOrchestrator` s `subAgentLabels`, alebo keď je nakonfigurované `subWorkflowIds`.
## Zručnosti

Zručnosti rozširujú systémový kontext agenta a môžu pridávať Python nástroje.

- **Tvar**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Obsah**: Pridaný na začiatok systémovej inštrukcie (spojený s `---`)
- **Python nástroje**: Pre každú zručnosť so súbormi `.py` sa pridá nástroj `skill_{skill_name}`
- **Vykonávanie**: `skill_python_executor.py` spúšťa skripty pomocou `uv run python` v dočasnom adresári; argumenty ako JSON na stdin, výsledok ako JSON na stdout

Zručnosti je možné pridať presunutím súboru `.zip` alebo `.md` do oblasti Zručnosti v konfigurácii [uzla Agent](../nodes/agent-node.md).

## MCP klient

Klient MCP (Model Context Protocol) sa pripája k externým serverom nástrojov.

- **Transporty**: `stdio` (príkaz + argumenty) alebo `sse` (url + hlavičky)
- **Zoznam nástrojov**: `list_mcp_tools` → `ClientSession.list_tools()` → konvertované do formátu funkcií OpenAI s `_source: "mcp"`
- **Vykonanie**: `execute_mcp_tool` → `ClientSession.call_tool()` → výsledok cez `_extract_tool_result`

MCP pripojenia konfigurujte na karte [MCP](../tabs/mcp-tab.md) alebo v `mcpConnections` uzla agenta.

## Volanie nástrojov

Služba LLM spúšťa slučku `execute_with_tools`:

1. **Kontrola kompresie kontextu** — pred každou iteráciou odhadnite využitie tokenov a v prípade potreby vykonajte kompresiu (pozri nižšie)
2. Zavolajte model s `tools` a `tool_choice: "auto"`
3. Ak existujú `tool_calls`: pre každé volanie spustite `tool_executor(tool_def, name, args, timeout)`
4. Pridajte výsledok nástroja k správam, opakujte
5. Zastavte, keď už nie sú žiadne volania nástrojov alebo sa dosiahne `max_tool_iterations`

### Smerovanie nástrojov

`_unified_tool_executor` smeruje podľa `_source`:

| Zdroj | Spracovateľ |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (predvolené) | `execute_tool` (nástroje s Python kódom) |

Nástroje používajú formát volania funkcií OpenAI: `name`, `description`, `parameters` (JSON schéma).

## Kompresia kontextu

Aby sa predišlo pretečeniu kontextu pri dlho bežiacich agentoch, Heym automaticky komprimuje akumulovaný zoznam `messages` pred každou iteráciou nástroja.

### Algoritmus

1. **Odhad tokenov**: `total_chars / 4` naprieč všetkými správami (rýchle, bez potreby tokenizéra)
2. **Kontrola prahu**: ak `estimated_tokens < context_limit × 0.80`, kompresia sa preskočí
3. **Limit kontextu**: skúste `client.models.retrieve(model).context_window`; v prípade zlyhania použite vstavanú tabuľku (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M atď.); predvolená hodnota 128K
4. **Zachovanie kotiev**: vždy zachovajte
   - Prvú správu `system` (identita a inštrukcie agenta)
   - Prvú správu `user` (pôvodná úloha)
   - Poslednú správu `user` (najnovšia inštrukcia)
5. **Zhrnutie stredu**: všetko medzi prvou a poslednou správou používateľa sa serializuje a odošle rovnakému modelu s promptom na zhrnutie
6. **Obnovenie**: `[system, first_user, assistant(summary), last_user]`

Kompresia sa preskočí, ak existujú menej ako 2 odlišné správy používateľa (žiadny stred na zhrnutie) alebo ak volanie zhrnutia LLM zlyhá (bezpečný fallback: vrátiť pôvodné správy).

### Pozorovateľnosť

Každá udalosť kompresie sa zaznamená ako:
- Záznam `_context_compression` v `tool_calls_collected` → viditeľný v detaile behu v Histórii spustení
- Udalosť `on_tool_call` s `phase: "compression"` → vykreslená v paneli Debug ako `Context compressed (N messages → summary)`
- Záznam LLM trace `context.compression` → viditeľný na karte Spustenia s odhadmi tokenov pred/po

Volania nástrojov agenta tiež vysielajú bohatšiu pozorovateľnosť:

- Polia životného cyklu jednotlivých volaní v `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Súhrnné `tool_metrics` vo výsledku agenta (počty podľa stavu plus celková/maximálna doba trvania); záznamy `_context_compression` sú z týchto počtov vylúčené
- Voliteľné podradené spany OpenTelemetry s názvom `heym.agent.tool.execute` (pozri [OpenTelemetry Tracing](./opentelemetry.md))
- Uložené payloady `tool_calls` v LLM trace / histórii spustení sú redigované a rozmerovo obmedzené; živý stav obnovenia HITL zachováva originály na párovanie

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Orchestrácia viacerých agentov naprieč životným cyklom agenta
- [Uzol Agent](../nodes/agent-node.md) – Konfigurácia a parametre
- [Trvalá pamäť agenta](./agent-persistent-memory.md) – Znalostný graf pre každý uzol agenta a zdieľanie medzi partnermi
- [Human-in-the-Loop](./human-in-the-loop.md) – Odkazy na kontrolu, čakajúce payloady a správanie obnovenia
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow, uzol a spany nástrojov agenta
- [Typy uzlov](./node-types.md) – Agent a súvisiace uzly
- [Paralelné vykonávanie](./parallel-execution.md) – Paralelné vykonávanie založené na DAG a podagentoch
- [Karta MCP](../tabs/mcp-tab.md) – Konfigurácia MCP pripojení
- [Expression DSL](./expression-dsl.md) – `$input.text` pre podagentov

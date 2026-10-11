# Arhitektura Agenta

[Agent Node](../nodes/agent-node.md) podržava pod-agente, pod-workflows, alate za čvorove na platnu, obrazac orkestratora, vještine, MCP veze, pozivanje alata, opcionalnu [trajnu memoriju](./agent-persistent-memory.md) (po čvoru na platnu, s opcionalnim dijeljenjem s drugim agentima) i opcionalnu [ljudsku reviziju](./human-in-the-loop.md). Ova stranica opisuje arhitekturu.

## Pod-Agenti

Pod-agenti su agent čvorovi koje orkestrator može pozvati putem alata `call_sub_agent`.

- **Orkestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Pod-agenti**: Moraju koristiti `$input.text` u svojoj korisničkoj poruci kako bi primili orkestratorov prompt
- **Alat**: `call_sub_agent` s `sub_agent_label` (enum) i `prompt`
- **Ograničenje dubine**: Maksimalno 5 ugniježdenih poziva pod-agenta

### Tok Izvršavanja

1. Orkestrator odlučuje pozvati pod-agenta
2. `_execute_sub_agent_tool` pronalazi ciljni agent prema oznaci
3. Gradi `synthetic_inputs = {"input": {"text": prompt}}`
4. Pokreće `_execute_agent_node` za pod-agenta
5. Rezultat se vraća orkestratoru

### Paralelno Izvršavanje Pod-Agenta

Kada orkestrator vraća više poziva alata `call_sub_agent` u jednom okretu, oni se izvršavaju **paralelno**. Na primjer, ako korisnik pita o "Parizu" i orkestrator poziva i `distanceAgent` i `foodAgent`, oboje se izvršava istovremeno umjesto sekvencijalno.

- **Prednost**: Ukupno vrijeme je otprilike vrijeme najsporijeg pod-agenta, a ne zbroj svih.
- **Savjet**: Potaknite orkestrator da poziva više pod-agenta u jednom okretu kada zadatak to zahtijeva.

## Pod-Workflows

Kada je `subWorkflowIds` konfiguriran, agent može pozvati druge workflows putem alata `call_sub_workflow`.

- **Konfiguracija**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Alat**: `call_sub_workflow` s `workflow_id` (enum) i `inputs` (objekt)
- **Ograničenje dubine**: Maksimalno 5 ugniježdenih poziva pod-workflow

### Tok Izvršavanja

1. Agent odlučuje pozvati pod-workflow
2. `_execute_sub_workflow_tool` dohvaća workflow iz `workflow_cache`
3. Gradi `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Pokreće `WorkflowExecutor.execute()` za pod-workflow
5. Rezultat se vraća agentu

Pod-workflows ne mogu pauzirati za HITL u v1. Ako pokušava ući u stanje čekanja na reviziju, izvršavanje ne uspijeva umjesto da se suspendira unutar ugniježdenog poziva.

## Alati za Čvorove na Platnu

Alati za čvorove na platnu su workflow čvorovi povezani s agentom putem `tool-input` ručke. Tijekom postavljanja agenta, `_build_node_tool_schemas` skenira te rubove i dodaje jedan OpenAI-kompatibilan alatni shemu po povezanom čvoru.

- **Izvor alata**: `_source: "node_tool"`
- **Ime alata**: izvedeno iz oznake povezanog čvora, s dodanim sufiksima za duplicirane
- **Parametri alata**: izgrađeni iz `agentProvidedFields` čvora
- **Fiksna polja**: sva polja čvora koja nisu navedena u `agentProvidedFields` ostaju u konfiguraciji čvora

### Tok Izvršavanja

1. Agent odlučuje pozvati povezani alat čvora
2. `_execute_node_tool` kopira podatke čvora
3. Argumenti koje pruža agent se spajaju u konfigurirana polja čvora
4. `execute_node` pokreće taj čvor jednom s onemogućenim raspoređivanjem grana
5. Izvorni podaci čvora se vraćaju
6. Izlaz čvora se vraća agentu kao rezultat alata

Alati čvora su isključeni iz normalnog raspoređivanja workflow-a kako ne bi bili pokrenuti dvaput. Izvršavaju se samo putem puta poziva alata agenta.

## Čovjek u Petlji

Kada je `hitlEnabled` postavljen na agenta, agent prima alat `request_human_review` koji može pozvati na specifičnim točkama odobrenja.

1. Sustavni prompt i smjernice HITL čvora govore agentu koje radnje zahtijevaju odobrenje
2. Kada agent dosegne jedan od tih koraka, poziva `request_human_review`
3. Heym pohranjuje snimku izvršavanja workflow-a i stvara javni zahtjev za reviziju
4. Rezultat čvora označen je kao `pending` s URL-om za reviziju
5. Izlazna ručka agenta `review` se odmah raspoređuje kako bi se grane obavijesti mogle izvršiti s čekajući payload
6. Glavno raspoređivanje izvršavanja se zaustavlja dok recenzent ne odgovori
7. Na `accept`, `edit` ili `refuse`, izvršitelj se ponovno gradi iz pohranjene snimke
8. Pauzirani agent nastavlja s odobrenim kontekstom revizije, ili odmah izlazi na `refuse`
9. Donji čvorovi nastavljaju nakon što završava obnovljeni agent, bez ponovnog pokretanja grane `review`
10. Ako kasnija radnja također zahtijeva odobrenje, agent može stvoriti još jednu HITL točku u istom izvođenju

Sažetak za recenzenta generira se iz samog zahtjeva za reviziju, tako da polje čvora može ostati usmjereno na politiku odobrenja i vremenske okvire.

To omogućuje agentovim workflow-ima da čekaju na vanjsko odobrenje dok zadržavaju povijest razgovora, završene izlaze čvora, stanje petlje i drugi kontekst izvođenja.

## Izvršitelj Alata Orkestratora

Prilagođeni izvršitelj alata usmjerava:

- **Pozive pod-agenta** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Pozive pod-workflow** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Alate čvora na platnu** (`_source == "node_tool"`) → `_execute_node_tool`
- **Ljudsku reviziju** (`_source == "hitl"`) → stvara čekajući HITL checkpoint
- **Ostale alate** → `_unified_tool_executor` (Python, MCP, alati vještina)

Koristi se kada je HITL omogućen, kada je `isOrchestrator` s postavljenim `subAgentLabels`, ili kada je konfiguriran `subWorkflowIds`.
## Vještine

Vještine proširuju kontekst sustava agenta i mogu dodati Python alate.

- **Oblik**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Sadržaj**: Dodaje se na sustavsku instrukciju (spojen s `---`)
- **Python alati**: Za svaku vještinu s `.py` datotekama, dodaje se alat `skill_{skill_name}`
- **Izvršavanje**: `skill_python_executor.py` pokreće skripte s `uv run python` u privremenom direktoriju; argumenti kao JSON na stdin, rezultat kao JSON na stdout

Vještine se mogu dodati povlačenjem `.zip` ili `.md` datoteke u područje Vještina u konfiguraciji [Agent Node](../nodes/agent-node.md).

## MCP Klijent

MCP (Model Context Protocol) klijent povezuje se s vanjskim poslužiteljima alata.

- **Transporti**: `stdio` (naredba + argumenti) ili `sse` (url + zaglavlja)
- **Popis alata**: `list_mcp_tools` → `ClientSession.list_tools()` → pretvoreno u OpenAI format funkcije s `_source: "mcp"`
- **Izvršavanje**: `execute_mcp_tool` → `ClientSession.call_tool()` → rezultat putem `_extract_tool_result`

Konfigurirajte MCP veze u [MCP Tab](../tabs/mcp-tab.md) ili na `mcpConnections` agenta.

## Pozivanje Alata

LLM usluga pokreće `execute_with_tools` petlju:

1. **Provjera kompresije konteksta** — prije svake iteracije, procijenite korištenje tokena i komprimirajte ako je potrebno (vidi dolje)
2. Pozovite model s `tools` i `tool_choice: "auto"`
3. Ako postoje `tool_calls`: za svaki poziv, pokrenite `tool_executor(tool_def, name, args, timeout)`
4. Dodajte rezultat alata porukama, ponovite
5. Prestanite kada više nema poziva alata ili je dostignuta `max_tool_iterations`

### Distribucija Alata

`_unified_tool_executor` usmjerava prema `_source`:

| Izvor | Handler |
|-------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (zadano) | `execute_tool` (Python kod alati) |

Alati koriste OpenAI format pozivanja funkcija: `name`, `description`, `parameters` (JSON shema).

## Kompresija Konteksta

Kako bi se spriječilo preopterećenje konteksta kod dugotrajnih agenata, Heym automatski komprimira akumuliranu listu `messages` prije svake iteracije alata.

### Algoritam

1. **Procjena tokena**: `total_chars / 4` kroz sve poruke (brzo, bez potrebe za tokenizatorom)
2. **Provjera praga**: ako je `estimated_tokens < context_limit × 0.80`, preskočite kompresiju
3. **Ograničenje konteksta**: pokušajte `client.models.retrieve(model).context_window`; ako ne uspije, oslonite se na ugrađenu tablicu (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, itd.); zadano 128K
4. **Očuvanje sidra**: uvijek zadržite
   - Prvu `system` poruku (identitet agenta i upute)
   - Prvu `user` poruku (izvorni zadatak)
   - Posljednju `user` poruku (najnovija uputa)
5. **Sažimanje sredine**: sve između prve i posljednje korisničke poruke se serijalizira i šalje istom modelu s promptom za sažimanje
6. **Ponovno izgradite**: `[system, first_user, assistant(summary), last_user]`

Kompresija se preskoči ako ima manje od 2 različite korisničke poruke (nema sredine za sažimanje) ili ako poziv LLM-a za sažimanje ne uspije (sigurna alternativa: vratite izvorne poruke).

### Promatranje

Svaki događaj kompresije bilježi se kao:
- `_context_compression` unos u `tool_calls_collected` → vidljivo u detaljima povijesti izvršenja
- `on_tool_call` događaj s `phase: "compression"` → prikazan u Debug panelu kao `Kontekst komprimiran (N poruka → sažetak)`
- `context.compression` LLM trag unosa → vidljivo u Traces tabu s procjenama tokena prije/poslije

Pozivi alata agenta također emitiraju bogatije promatranje:

- Polja životnog ciklusa po pozivu na `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Agregatni `tool_metrics` na rezultatu agenta (broj prema statusu plus ukupno/maksimalno trajanje); `_context_compression` unosi su isključeni iz tih brojeva
- Opcionalni OpenTelemetry podspans nazvani `heym.agent.tool.execute` (vidi [OpenTelemetry Tracing](./opentelemetry.md))
- Sačuvani LLM trag / povijest izvršenja `tool_calls` payloadi su redigirani i veličinski ograničeni; živo HITL stanje nastavka zadržava originale za usklađivanje

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Višekratna orkestracija kroz životni ciklus agenta
- [Agent Node](../nodes/agent-node.md) – Konfiguracija i parametri
- [Agent Trajna Memorija](./agent-persistent-memory.md) – Graf znanja po čvoru agenta i dijeljenje među kolegama
- [Čovjek u Petlji](./human-in-the-loop.md) – Pregled poveznica, čekajući payloadove i ponašanje nastavka
- [OpenTelemetry Tracing](./opentelemetry.md) – Workflow, čvor i Agent alati
- [Vrste Čvorova](./node-types.md) – Agent i povezani čvorovi
- [Paralelno Izvršavanje](./parallel-execution.md) – DAG-bazirano i paralelno izvršavanje pod-agenta
- [MCP Tab](../tabs/mcp-tab.md) – Konfigurirajte MCP veze
- [Expression DSL](./expression-dsl.md) – `$input.text` za pod-agente

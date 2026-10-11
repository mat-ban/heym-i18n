# Agendi arhitektuur

[Agendi sõlm](../nodes/agent-node.md) toetab alam-agente, alam-workflow'sid, lõuendi sõlme tööriistu, orkestraatori mustrit, oskusi, MCP-ühendusi, tööriistade kutsumist, valikulist [püsivat mälu](./agent-persistent-memory.md) (lõuendi sõlme kaupa, valikulise jagamisega teistele agentidele) ja valikulist [inimülevaatust](./human-in-the-loop.md). See leht kirjeldab arhitektuuri.

## Alam-agendid

Alam-agendid on agendi sõlmed, mida orkestraator saab kutsuda tööriista `call_sub_agent` kaudu.

- **Orkestraator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Alam-agendid**: peavad kasutama oma kasutajasõnumis `$input.text`, et nad saaksid orkestraatori prompti
- **Tööriist**: `call_sub_agent` koos `sub_agent_label` (enum) ja `prompt`-iga
- **Sügavuse piirang**: maksimaalselt 5 pesastatud alam-agendi kutset

### Käivituse voog

1. Orkestraator otsustab kutsuda alam-agenti
2. `_execute_sub_agent_tool` leiab sihtagendi sildi järgi
3. Koostab `synthetic_inputs = {"input": {"text": prompt}}`
4. Käivitab alam-agendi jaoks `_execute_agent_node`
5. Tulemus tagastatakse orkestraatorile

### Alam-agentide paralleelne käivitamine

Kui orkestraator tagastab ühe käigu jooksul mitu `call_sub_agent` tööriistakutset, käivitatakse need **paralleelselt**. Näiteks kui kasutaja küsib "Pariisi" kohta ja orkestraator kutsub nii `distanceAgent` kui ka `foodAgent`, töötavad mõlemad üheaegselt, mitte järjestikku.

- **Eelis**: koguaeg on ligikaudu kõige aeglasema alam-agendi aeg, mitte kõigi summa.
- **Vihje**: julgustage orkestraatorit kutsuma ühe käigu jooksul mitut alam-agenti, kui ülesanne seda nõuab.

## Alam-workflow'd

Kui `subWorkflowIds` on konfigureeritud, saab agent kutsuda teisi workflow'sid tööriista `call_sub_workflow` kaudu.

- **Konfiguratsioon**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Tööriist**: `call_sub_workflow` koos `workflow_id` (enum) ja `inputs` (objekt)
- **Sügavuse piirang**: maksimaalselt 5 pesastatud alam-workflow kutset

### Käivituse voog

1. Agent otsustab kutsuda alam-workflow'd
2. `_execute_sub_workflow_tool` toob workflow `workflow_cache`-st
3. Koostab `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Käivitab alam-workflow jaoks `WorkflowExecutor.execute()`
5. Tulemus tagastatakse agendile

Alam-workflow'd ei saa v1-s HITL-i jaoks pausile jääda. Kui pesastatud alam-workflow üritab minna ootel ülevaatuse olekusse, siis käivitus ebaõnnestub, selle asemel et pesastatud kutse sees peatuda.

## Lõuendi sõlme tööriistad

Lõuendi sõlme tööriistad on workflow sõlmed, mis on agendiga ühendatud `tool-input` käepideme kaudu. Agendi seadistamise ajal skaneerib `_build_node_tool_schemas` neid servi ja lisab iga ühendatud sõlme kohta ühe OpenAI-ga ühilduva tööriista skeemi.

- **Tööriista allikas**: `_source: "node_tool"`
- **Tööriista nimi**: tuletatakse ühendatud sõlme sildist, duplikaatide korral lisatakse sufiksid
- **Tööriista parameetrid**: koostatakse sõlme `agentProvidedFields`-ist
- **Fikseeritud väljad**: kõik sõlme väljad, mida pole `agentProvidedFields`-is loetletud, jäävad sõlme konfiguratsiooni

### Käivituse voog

1. Agent otsustab kutsuda ühendatud sõlme tööriista
2. `_execute_node_tool` kopeerib sõlme andmed
3. Agendi esitatud argumendid ühendatakse konfigureeritud sõlme väljadega
4. `execute_node` käivitab selle sõlme üks kord, harude ajastamine on keelatud
5. Algse sõlme andmed taastatakse
6. Sõlme väljund tagastatakse agendile tööriista tulemusena

Tööriista sõlmed on tavalisest workflow ajastamisest välja jäetud, et neid ei käivitataks kaks korda. Need käivitatakse ainult agendi tööriistakutse teel.

## Inimülevaatus (Human-in-the-Loop)

Kui agendil on seatud `hitlEnabled`, saab agent tööriista `request_human_review`, mida ta saab kutsuda konkreetsetes kinnituse kontrollpunktides.

1. Süsteemi prompt ja sõlme HITL juhised ütlevad agendile, millised toimingud nõuavad kinnitust
2. Kui agent jõuab ühe sellise sammuni, kutsub ta `request_human_review`
3. Heym salvestab workflow käivituse hetktõmmise ja loob avaliku ülevaatuse taotluse
4. Sõlme tulemus märgitakse `pending` olekusse koos ülevaatuse URL-iga
5. Agendi `review` väljundkäepide ajastatakse kohe, et teavitusharud saaksid töötada ootel payload-iga
6. Põhikäivituse ajastamine peatub, kuni ülevaataja vastab
7. Vastusel `accept`, `edit` või `refuse` taastatakse täitja salvestatud hetktõmmisest
8. Peatatud agent jätkab kinnitatud ülevaatuse kontekstiga või väljub kohe vastusel `refuse`
9. Edasised sõlmed jätkavad pärast jätkatud agendi lõpetamist, ilma et `review` haru uuesti käivitataks
10. Kui hilisem toiming nõuab samuti kinnitust, saab agent luua samas käivituses veel ühe HITL kontrollpunkti

Ülevaatajale suunatud kokkuvõte genereeritakse ülevaatuse taotlusest endast, nii et sõlme väli saab keskenduda kinnituse poliitikale ja ajastusele.

See võimaldab agendi workflow'del oodata välist kinnitust, säilitades vestluse ajaloo, lõpetatud sõlmede väljundid, tsükli oleku ja muu käitusaegse konteksti.

## Orkestraatori tööriistade täitja

Kohandatud tööriistade täitja suunab:

- **Alam-agendi kutsed** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Alam-workflow kutsed** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Lõuendi sõlme tööriistad** (`_source == "node_tool"`) → `_execute_node_tool`
- **Inimülevaatus** (`_source == "hitl"`) → loob ootel HITL kontrollpunkti
- **Muud tööriistad** → `_unified_tool_executor` (Python, MCP, oskuste tööriistad)

Seda kasutatakse siis, kui HITL on lubatud, kui `isOrchestrator` koos `subAgentLabels`-iga on seatud või kui `subWorkflowIds` on konfigureeritud.
## Oskused

Oskused laiendavad agendi süsteemikonteksti ja võivad lisada Python-tööriistu.

- **Kuju**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Sisu**: Lisatakse süsteemijuhise ette (ühendatud eraldajaga `---`)
- **Python-tööriistad**: Iga oskuse jaoks, mis sisaldab `.py` faile, lisatakse tööriist `skill_{skill_name}`
- **Käivitamine**: `skill_python_executor.py` käivitab skriptid käsuga `uv run python` ajutises kataloogis; argumendid JSON-ina stdin'is, tulemus JSON-ina stdout'is

Oskusi saab lisada, lohistades `.zip` või `.md` faili Oskuste alale [Agendi sõlme](../nodes/agent-node.md) konfiguratsioonis.

## MCP klient

MCP (Model Context Protocol) klient ühendub väliste tööriistade serveritega.

- **Transpordid**: `stdio` (käsk + argumendid) või `sse` (url + päised)
- **Tööriistade loetlemine**: `list_mcp_tools` → `ClientSession.list_tools()` → teisendatakse OpenAI funktsiooni formaati väljaga `_source: "mcp"`
- **Käivitamine**: `execute_mcp_tool` → `ClientSession.call_tool()` → tulemus funktsiooni `_extract_tool_result` kaudu

MCP-ühendusi konfigureeritakse [MCP vahekaardil](../tabs/mcp-tab.md) või agendi sõlme parameetris `mcpConnections`.

## Tööriistade kutsumine

LLM-teenus käivitab tsükli `execute_with_tools`:

1. **Konteksti tihendamise kontroll** — enne iga iteratsiooni hinnatakse tokenite kasutust ja vajadusel tihendatakse (vt allpool)
2. Mudeli kutsumine parameetritega `tools` ja `tool_choice: "auto"`
3. Kui `tool_calls` on olemas: iga kutse jaoks käivitatakse `tool_executor(tool_def, name, args, timeout)`
4. Tööriista tulemus lisatakse sõnumitele, korratakse
5. Peatatakse, kui rohkem tööriistakutsed puuduvad või on saavutatud `max_tool_iterations`

### Tööriistade suunamine

`_unified_tool_executor` suunab välja `_source` järgi:

| Allikas | Käsitleja |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (vaikimisi) | `execute_tool` (Python-koodi tööriistad) |

Tööriistad kasutavad OpenAI funktsioonikutse formaati: `name`, `description`, `parameters` (JSON skeem).

## Konteksti tihendamine

Pikaajaliselt töötavate agentide konteksti ületäitumise vältimiseks tihendab Heym automaatselt kogunenud sõnumite loendi `messages` enne iga tööriista iteratsiooni.

### Algoritm

1. **Tokenite hindamine**: `total_chars / 4` kõigi sõnumite lõikes (kiire, tokenizerit pole vaja)
2. **Läve kontroll**: kui `estimated_tokens < context_limit × 0.80`, jäetakse tihendamine vahele
3. **Konteksti piirang**: proovitakse `client.models.retrieve(model).context_window`; seejärel kasutatakse sisseehitatud tabelit (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M jne); vaikimisi 128K
4. **Ankru säilitamine**: alati hoitakse alles
   - Esimene `system` sõnum (agendi identiteet ja juhised)
   - Esimene `user` sõnum (algne ülesanne)
   - Viimane `user` sõnum (kõige värskem juhis)
5. **Keskosa kokkuvõtmine**: kõik esimese ja viimase kasutaja sõnumi vaheline sisu serialiseeritakse ja saadetakse samale mudelile koos kokkuvõtte promptiga
6. **Ümberehitamine**: `[system, first_user, assistant(summary), last_user]`

Tihendamine jäetakse vahele, kui erinevaid kasutaja sõnumeid on vähem kui 2 (keskosa puudub) või kui LLM-i kokkuvõtte kutse ebaõnnestub (turvaline varulahendus: tagastatakse algsed sõnumid).

### Jälgitavus

Iga tihendamissündmus salvestatakse järgmiselt:
- Kirje `_context_compression` väljal `tool_calls_collected` → nähtav Käivituste ajaloo käivituse detailvaates
- Sündmus `on_tool_call` väljaga `phase: "compression"` → kuvatakse Silumise paneelil kujul `Context compressed (N messages → summary)`
- LLM-i jälgimiskirje `context.compression` → nähtav Jälgede vahekaardil koos tokenite hinnangutega enne ja pärast

Agendi tööriistakutsed edastavad ka rikkalikumat jälgitavust:

- Kutsepõhised elutsükli väljad `tool_calls` kirjetel: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Koondnäitajad `tool_metrics` agendi tulemusel (loendused staatuse järgi ning kogu- ja maksimaalne kestus); kirjed `_context_compression` jäetakse nendest loendustest välja
- Valikulised OpenTelemetry alamsplainid nimega `heym.agent.tool.execute` (vt [OpenTelemetry jälgimine](./opentelemetry.md))
- Salvestatud LLM-i jälgimise / käivituste ajaloo `tool_calls` payloadid on redigeeritud ja suuruspiiratud; aktiivne HITL-i jätkamise olek säilitab originaalid sobitamiseks

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Mitme agendi orkestreerimine kogu agendi elutsükli vältel
- [Agendi sõlm](../nodes/agent-node.md) – Konfiguratsioon ja parameetrid
- [Agendi püsiv mälu](./agent-persistent-memory.md) – Teadmiste graaf agendi sõlme kohta ja jagamine teiste agentidega
- [Human-in-the-Loop](./human-in-the-loop.md) – Ülevaatamise lingid, ootel payloadid ja jätkamise käitumine
- [OpenTelemetry jälgimine](./opentelemetry.md) – Workflow', sõlme ja agendi tööriista spännid
- [Sõlmede tüübid](./node-types.md) – Agent ja seotud sõlmed
- [Paralleelne käivitamine](./parallel-execution.md) – DAG-põhine ja alamsagentide paralleelne käivitamine
- [MCP vahekaart](../tabs/mcp-tab.md) – MCP-ühenduste konfigureerimine
- [Avaldise DSL](./expression-dsl.md) – `$input.text` alamsagentide jaoks

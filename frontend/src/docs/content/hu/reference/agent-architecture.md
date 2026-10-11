# Ügynök architektúra

Az [Ügynök csomópont](../nodes/agent-node.md) támogatja az al-ügynököket, al-workflow-kat, vászon csomópont eszközöket, egy orchestrator mintát, skilleket, MCP kapcsolatokat, eszközhívást, opcionális [perzisztens memóriát](./agent-persistent-memory.md) (vászon csomópontonként, opcionális megosztással más ügynökökkel) és opcionális [emberi felülvizsgálatot](./human-in-the-loop.md). Ez az oldal az architektúrát ismerteti.

## Al-ügynökök

Az al-ügynökök olyan ügynök csomópontok, amelyeket egy orchestrator a `call_sub_agent` eszközön keresztül hívhat meg.

- **Orchestrator**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Al-ügynökök**: A User Message mezőjükben `$input.text`-et kell használniuk, hogy megkapják az orchestrator promptját
- **Eszköz**: `call_sub_agent` a `sub_agent_label` (enum) és `prompt` paraméterekkel
- **Mélységi korlát**: Legfeljebb 5 egymásba ágyazott al-ügynök hívás

### Végrehajtási folyamat

1. Az orchestrator úgy dönt, hogy meghív egy al-ügynököt
2. A `_execute_sub_agent_tool` megkeresi a cél-ügynököt a címke alapján
3. Felépíti a `synthetic_inputs = {"input": {"text": prompt}}` értéket
4. Lefuttatja a `_execute_agent_node` függvényt az al-ügynökre
5. Az eredmény visszakerül az orchestratorhoz

### Párhuzamos al-ügynök végrehajtás

Amikor az orchestrator egyetlen körben több `call_sub_agent` eszközhívást ad vissza, azok **párhuzamosan** futnak le. Ha például a felhasználó „Párizsról" kérdez, és az orchestrator egyszerre hívja meg a `distanceAgent` és a `foodAgent` ügynököket, mindkettő egyszerre fut a sorrendi végrehajtás helyett.

- **Előny**: A teljes idő nagyjából a leglassabb al-ügynöké, nem pedig az összes összege.
- **Tipp**: Ha a feladat megkívánja, ösztönözze az orchestratort több al-ügynök egy körben történő meghívására.

## Al-workflow-k

Amikor a `subWorkflowIds` be van állítva, az ügynök a `call_sub_workflow` eszközön keresztül más workflow-kat is meghívhat.

- **Konfiguráció**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Eszköz**: `call_sub_workflow` a `workflow_id` (enum) és `inputs` (object) paraméterekkel
- **Mélységi korlát**: Legfeljebb 5 egymásba ágyazott al-workflow hívás

### Végrehajtási folyamat

1. Az ügynök úgy dönt, hogy meghív egy al-workflow-t
2. A `_execute_sub_workflow_tool` lekeresi a workflow-t a `workflow_cache`-ből
3. Felépíti az `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}` értéket
4. Lefuttatja a `WorkflowExecutor.execute()` függvényt az al-workflow-ra
5. Az eredmény visszakerül az ügynökhöz

Az al-workflow-k az v1-ben nem tudnak szünetelni HITL céljából. Ha egy beágyazott al-workflow függő felülvizsgálati állapotba próbál kerülni, a végrehajtás meghiúsul a beágyazott híváson belüli felfüggesztés helyett.

## Vászon csomópont eszközök

A vászon csomópont eszközök olyan workflow csomópontok, amelyek a `tool-input` fogantyún keresztül kapcsolódnak egy ügynökhöz. Az ügynök beállítása során a `_build_node_tool_schemas` beolvassa ezeket az éleket, és minden csatlakoztatott csomóponthoz hozzáad egy OpenAI-kompatibilis eszköz sémát.

- **Eszköz forrása**: `_source: "node_tool"`
- **Eszköz neve**: a csatlakoztatott csomópont címkéjéből származik, duplikátumok esetén utótagokkal kiegészítve
- **Eszköz paraméterei**: a csomópont `agentProvidedFields` mezőjéből épülnek fel
- **Rögzített mezők**: minden olyan csomópont mező, amely nem szerepel az `agentProvidedFields` listában, a csomópont konfigurációjában marad

### Végrehajtási folyamat

1. Az ügynök úgy dönt, hogy meghív egy csatlakoztatott csomópont eszközt
2. A `_execute_node_tool` átmásolja a csomópont adatait
3. Az ügynök által megadott argumentumok beolvadnak a konfigurált csomópont mezőkbe
4. Az `execute_node` egyszer futtatja le azt a csomópontot, letiltott elágazás-ütemezéssel
5. Az eredeti csomópont adatai visszaállnak
6. A csomópont kimenete eszközeredményként visszakerül az ügynökhöz

Az eszköz csomópontok ki vannak zárva a normál workflow ütemezésből, így nem futnak le kétszer. Kizárólag az ügynök eszközhívási útvonalán keresztül hajtódnak végre.

## Human-in-the-Loop

Amikor egy ügynökön a `hitlEnabled` be van állítva, az ügynök kap egy `request_human_review` eszközt, amelyet adott jóváhagyási ellenőrzési pontokon hívhat meg.

1. A rendszer prompt és a csomópont HITL irányelvei megmondják az ügynöknek, mely műveletek igényelnek jóváhagyást
2. Amikor az ügynök eléri ezen lépések egyikét, meghívja a `request_human_review` eszközt
3. A Heym elment egy workflow végrehajtási pillanatképet, és létrehoz egy nyilvános felülvizsgálati kérést
4. A csomópont eredménye `pending` állapotba kerül egy felülvizsgálati URL-lel
5. Az ügynök `review` kimeneti fogantyúja azonnal ütemezésre kerül, hogy az értesítési ágak a függő payload-dal lefuthassanak
6. A fő végrehajtás ütemezése leáll, amíg a felülvizsgáló nem válaszol
7. `accept`, `edit` vagy `refuse` esetén a végrehajtó újraépül a tárolt pillanatképből
8. A szüneteltetett ügynök a jóváhagyott felülvizsgálati kontextussal folytatja, vagy `refuse` esetén azonnal kilép
9. A további csomópontok az újraindított ügynök befejezése után folytatódnak, a `review` ág újrafuttatása nélkül
10. Ha egy későbbi művelet szintén jóváhagyást igényel, az ügynök ugyanabban a futtatásban létrehozhat egy újabb HITL ellenőrzési pontot

A felülvizsgáló felé megjelenő összefoglaló magából a felülvizsgálati kérésből generálódik, így a csomópont mezője a jóváhagyási szabályzatra és az időzítésre összpontosíthat.

Ez lehetővé teszi, hogy az ügynök workflow-k külső jóváhagyásra várjanak, miközben megőrzik a beszélgetési előzményeket, a befejezett csomópont kimeneteket, a ciklus állapotát és egyéb futásidejű kontextust.

## Orchestrator eszköz-végrehajtó

Az egyedi eszköz-végrehajtó az alábbiak szerint irányít:

- **Al-ügynök hívások** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Al-workflow hívások** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Vászon csomópont eszközök** (`_source == "node_tool"`) → `_execute_node_tool`
- **Emberi felülvizsgálat** (`_source == "hitl"`) → létrehoz egy függő HITL ellenőrzési pontot
- **Egyéb eszközök** → `_unified_tool_executor` (Python, MCP, skill eszközök)

Akkor használatos, amikor a HITL engedélyezve van, amikor az `isOrchestrator` `subAgentLabels` beállítással szerepel, vagy amikor a `subWorkflowIds` konfigurálva van.
## Készségek

A készségek kiterjesztik az ügynök rendszerkörnyezetét, és Python-eszközöket adhatnak hozzá.

- **Forma**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Tartalom**: A rendszerutasítás elé fűzve (a `---` karakterekkel összekapcsolva)
- **Python-eszközök**: Minden olyan készséghez, amely `.py` fájlokat tartalmaz, hozzáadódik egy `skill_{skill_name}` eszköz
- **Végrehajtás**: A `skill_python_executor.py` a `uv run python` parancsot futtatja egy ideiglenes könyvtárban; az argumentumok JSON formátumban a stdin-en, az eredmény JSON formátumban a stdout-on érkezik

A készségek hozzáadhatók egy `.zip` vagy `.md` fájl behúzásával a Készségek területre az [Ügynök csomópont](../nodes/agent-node.md) konfigurációjában.

## MCP kliens

Az MCP (Model Context Protocol) kliens külső eszközszerverekhez csatlakozik.

- **Transzportok**: `stdio` (parancs + argumentumok) vagy `sse` (url + fejlécek)
- **Eszközök listázása**: `list_mcp_tools` → `ClientSession.list_tools()` → OpenAI függvényformátumra konvertálva `_source: "mcp"` értékkel
- **Végrehajtás**: `execute_mcp_tool` → `ClientSession.call_tool()` → eredmény a `_extract_tool_result` segítségével

Az MCP kapcsolatokat az [MCP fülön](../tabs/mcp-tab.md) vagy az ügynök csomópont `mcpConnections` beállításánál konfigurálhatja.

## Eszközhívás

Az LLM szolgáltatás egy `execute_with_tools` ciklust futtat:

1. **Kontextus-tömörítés ellenőrzése** — minden iteráció előtt megbecsüli a token-felhasználást, és szükség esetén tömörít (lásd alább)
2. Meghívja a modellt a `tools` és `tool_choice: "auto"` paraméterekkel
3. Ha léteznek `tool_calls`: minden híváshoz lefuttatja a `tool_executor(tool_def, name, args, timeout)` függvényt
4. Az eszköz eredményét hozzáfűzi az üzenetekhez, majd ismétel
5. Leáll, ha nincs több eszközhívás, vagy elérte a `max_tool_iterations` értéket

### Eszköz-diszpécselés

A `_unified_tool_executor` a `_source` alapján irányít:

| Forrás | Kezelő |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (alapértelmezett) | `execute_tool` (Python kód eszközök) |

Az eszközök az OpenAI függvényhívási formátumot használják: `name`, `description`, `parameters` (JSON séma).

## Kontextus-tömörítés

A hosszú ideig futó ügynökök kontextus-túlcsordulásának megelőzése érdekében a Heym minden eszköz-iteráció előtt automatikusan tömöríti a felhalmozott `messages` listát.

### Algoritmus

1. **Tokenek becslése**: `total_chars / 4` az összes üzenetre vonatkozóan (gyors, tokenizáló nélkül)
2. **Küszöbérték ellenőrzése**: ha `estimated_tokens < context_limit × 0.80`, a tömörítés kimarad
3. **Kontextus-korlát**: megkísérli a `client.models.retrieve(model).context_window` hívást; ha ez nem sikerül, egy beépített táblázatra támaszkodik (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M stb.); alapértelmezett érték: 128K
4. **Horgonyok megőrzése**: mindig megőrzi
   - Az első `system` üzenetet (az ügynök identitása és utasításai)
   - Az első `user` üzenetet (az eredeti feladat)
   - Az utolsó `user` üzenetet (a legutóbbi utasítás)
5. **Középső rész összegzése**: az első és az utolsó user üzenet közötti teljes tartalom szerializálásra kerül, és ugyanahhoz a modellhez kerül egy összegző prompttal
6. **Újraépítés**: `[system, first_user, assistant(summary), last_user]`

A tömörítés kimarad, ha kevesebb mint 2 különálló user üzenet van (nincs mit összegezni a középső részből), vagy ha az LLM összegző hívás sikertelen (biztonsági tartalék: az eredeti üzenetek visszaadása).

### Megfigyelhetőség

Minden tömörítési esemény rögzítésre kerül:
- Egy `_context_compression` bejegyzésként a `tool_calls_collected` listában → látható a Futtatások előzményeinek futtatás részleteinél
- Egy `on_tool_call` eseményként `phase: "compression"` értékkel → a Debug panelen `Context compressed (N messages → summary)` formában jelenik meg
- Egy `context.compression` LLM trace bejegyzésként → a Nyomkövetések fülön látható az előtte/utána tokenbecslésekkel

Az ügynök eszközhívásai gazdagabb megfigyelhetőséget is kibocsátanak:

- Hívásonkénti életciklus-mezők a `tool_calls` listán: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Összesített `tool_metrics` az ügynök eredményén (státusz szerinti darabszámok, valamint teljes és maximális időtartam); a `_context_compression` bejegyzések kimaradnak ezekből a számításokból
- Opcionálisan engedélyezhető OpenTelemetry gyermek-spanek `heym.agent.tool.execute` néven (lásd [OpenTelemetry nyomkövetés](./opentelemetry.md))
- A tárolt LLM trace / futtatási előzmények `tool_calls` payloadjai kitakarásra és méretkorlátozásra kerülnek; az élő HITL folytatási állapot megőrzi az eredeti értékeket az egyeztetéshez

## Kapcsolódó témák

- [Miért a Heym?](../getting-started/why-heym.md) – Többügynökös vezénylés az ügynök életciklusa során
- [Ügynök csomópont](../nodes/agent-node.md) – Konfiguráció és paraméterek
- [Ügynök tartós memóriája](./agent-persistent-memory.md) – Tudásgráf ügynök csomópontonként és társak közötti megosztás
- [Human-in-the-Loop](./human-in-the-loop.md) – Ellenőrzési linkek, függőben lévő payloadok és folytatási viselkedés
- [OpenTelemetry nyomkövetés](./opentelemetry.md) – Workflow-, csomópont- és ügynök-eszköz spanek
- [Csomóponttípusok](./node-types.md) – Ügynök és kapcsolódó csomópontok
- [Párhuzamos végrehajtás](./parallel-execution.md) – DAG-alapú és alügynökök közötti párhuzamos végrehajtás
- [MCP fül](../tabs/mcp-tab.md) – MCP kapcsolatok konfigurálása
- [Kifejezés DSL](./expression-dsl.md) – `$input.text` alügynökökhöz

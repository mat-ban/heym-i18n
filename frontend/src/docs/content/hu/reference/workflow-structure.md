# Workflow szerkezete

A workflow-k JSON formátumban tárolódnak, csomópontokkal és élekkel. Az elérhető csomóponttípusokat lásd a [Csomóponttípusok](./node-types.md) oldalon, a `data` mezőkben használható kifejezésszintaxist pedig a [Kifejezés DSL](./expression-dsl.md) oldalon.

## Workflow objektum

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Csomópont objektum

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent csomópont `data` (perzisztens memória)

Az [Agent](../nodes/agent-node.md) csomópontok vászoncsomópontonként opcionális tudásgráfot támogatnak:

| Mező | Típus | Leírás |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ha `true`, a tárolt gráf betöltődik a system promptba, és a sikeres futtatások után az új tények beolvadnak |
| `memoryShares` | array (opcionális) | Más agentek számára hozzáférést biztosít ehhez a csomópont memóriagráfjához (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Lásd: [Agent perzisztens memória](./agent-persistent-memory.md). |

Példa:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Az API útvonalakat, a szerkesztő viselkedését és a kinyerés szemantikáját lásd: [Agent perzisztens memória](./agent-persistent-memory.md).

## Él objektum

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Csomóponttípusok

Gyakori `type` értékek: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) és továbbiak. Teljes lista: [Csomóponttípusok](./node-types.md). Az ugyanazon a végrehajtási szinten lévő csomópontok [párhuzamosan](./parallel-execution.md) futnak.

## Szerkesztő elrendezés

Minden csomópont rendelkezik `position.x` és `position.y` értékkel az asztali vászon elrendezéséhez. A 768px-es töréspont alatti képernyőkön a szerkesztő a szabad formájú Vue Flow vásznat egy teljes képernyős, behúzott workflow-fává alakítja. A fa követi az összekapcsolt végrehajtási útvonalakat, megjelöli a párhuzamos ágakat, és ugyanazokat a csomópontcímkéket, ikonokat és legutóbbi futtatási állapotokat használja, mint az asztali szerkesztő.

Koppintson egy csomópontra a kijelöléséhez. Ha rendelkezik rögzített végrehajtási eredménnyel, a teljes képernyős részletei megnyílnak input, output és error fülekkel. A mobil alsó navigáció a **Nodes**, **Properties**, **Run** és **More** elemeket kínálja; a fejléc megtartja a mentés, előzmények, keresés, beállítások és megosztás műveleteket. Az asztali verzió továbbra is a szabad formájú Vue Flow vásznat és oldalpanelokat használja.

A mobil Nodes fülön az **Add node** használatával kereshet a csomópontkönyvtárban. Egy normál csomópont hozzáadása után azonnal megnyílik egy kapcsolati lap: válasszon egy horgonycsomópontot, és helyezze el **After**, **Before** vagy **Parallel** ágként. Szerkesztési módban koppintson egy meglévő normál csomópontra ugyanazon lap megnyitásához, a jelenlegi kapcsolat kijelölésével. A trigger csomópontok függetlenek maradnak, mert nem fogadnak el normál inputot. A szerkesztés vezérlő a kijelölt csomópont eltávolítási műveletét is elérhetővé teszi. A végrehajtási részletek előző és következő nyilakat tartalmaznak, amikor a szomszédos csomópontok eredményei elérhetők. Az AI Assistant a mobil fa felett egy alsó lapként nyílik meg, anélkül hogy megváltoztatná az aktív szerkesztőfület.

## Kapcsolódó

- [Csomóponttípusok](./node-types.md) – Az összes csomóponttípus és leírásuk
- [Vászon funkciók](./canvas-features.md) – Szerkesztőfunkciók (data pin, végrehajtási naplók, engedélyezés/letiltás, kinyerés al-workflow-ba)
- [Letöltés és importálás](./download-import.md) – Workflow-k exportálása és importálása JSON formátumban
- [Agent csomópont](../nodes/agent-node.md) – Az Agent csomópont `data` szerkezete
- [Agent perzisztens memória](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` és a memóriagráf API
- [Kifejezés DSL](./expression-dsl.md) – Szintaxis a `userMessage`, `condition`, `$vars`, `$global` stb. mezőkhöz
- [Párhuzamos végrehajtás](./parallel-execution.md) – Hogyan futnak a csomópontok párhuzamosan
- [Triggerek](./triggers.md) – Kezdőcsomópontok és belépési pontok
- [Workflows fül](../tabs/workflows-tab.md) – Workflow-k létrehozása és kezelése

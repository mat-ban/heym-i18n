# Struktura Workflow

Workflow jsou ukládány jako JSON s uzly a hranami. Dostupné typy uzlů naleznete v části [Node Types](./node-types.md) a syntaxi výrazů v polích `data` v části [Expression DSL](./expression-dsl.md).

## Objekt Workflow

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

## Objekt uzlu

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

### `data` uzlu Agent (persistentní paměť)

Uzly [Agent](../nodes/agent-node.md) podporují volitelný znalostní graf pro každý uzel plátna:

| Pole | Typ | Popis |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Pokud je `true`, načte uložený graf do systémového promptu a po úspěšných spuštěních sloučí nová fakta |
| `memoryShares` | array (volitelné) | Uděluje ostatním agentům přístup ke grafu paměti tohoto uzlu (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Viz [Agent Persistent Memory](./agent-persistent-memory.md). |

Příklad:

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

Cesty API, chování editoru a sémantiku extrakce naleznete v části [Agent Persistent Memory](./agent-persistent-memory.md).

## Objekt hrany

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Typy uzlů

Běžné hodnoty `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) a další. Úplný seznam: [Node Types](./node-types.md). Uzly ve stejné úrovni spuštění běží [paralelně](./parallel-execution.md).

## Rozvržení editoru

Každý uzel má `position.x` a `position.y` pro rozvržení na plátně v desktopovém zobrazení. Na obrazovkách pod
breakpointem 768px nahrazuje editor volné plátno Vue Flow full-screen stromem
workflow s odsazením. Strom sleduje propojené cesty spuštění, označuje paralelní větve a používá
stejné popisky uzlů, ikony a stav posledního spuštění jako desktopový editor.

Klepnutím na uzel jej vyberete. Pokud má zaznamenaný výsledek spuštění, otevře se jeho full-screen detail
se záložkami vstup, výstup a chyba. Mobilní spodní navigace nabízí **Nodes**, **Properties**,
**Run** a **More**; záhlaví si zachovává akce uložení, historie, vyhledávání, nastavení a sdílení.
Desktop nadále používá volné plátno Vue Flow a boční panely.

Pomocí **Add node** na mobilní kartě Nodes vyhledejte v knihovně uzlů. Běžný uzel otevře
list propojení ihned po přidání: zvolte kotevní uzel a umístěte jej **After**,
**Before** nebo jako **Parallel** větev. V režimu úprav klepněte na existující běžný uzel a otevřete stejný
list s aktuálně zvoleným propojením. Uzly Trigger zůstávají nezávislé, protože nepřijímají
běžný vstup. Ovládací prvek úprav také nabízí akci odebrání vybraného uzlu. Podrobnosti spuštění
zahrnují šipky předchozí a další, pokud jsou výsledky sousedních
uzlů dostupné. AI Assistant se otevírá nad mobilním stromem jako spodní list, aniž by
změnil aktivní kartu editoru.

## Související

- [Node Types](./node-types.md) – Všechny typy uzlů a popisy
- [Canvas Features](./canvas-features.md) – Funkce editoru (data pin, protokoly spuštění, povolení/zakázání, extrakce do pod-workflow)
- [Download & Import](./download-import.md) – Export a import workflow jako JSON
- [Agent Node](../nodes/agent-node.md) – Struktura `data` uzlu Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` a API grafu paměti
- [Expression DSL](./expression-dsl.md) – Syntaxe pro `userMessage`, `condition`, `$vars`, `$global` atd.
- [Parallel Execution](./parallel-execution.md) – Jak uzly běží paralelně
- [Triggers](./triggers.md) – Počáteční uzly a vstupní body
- [Workflows Tab](../tabs/workflows-tab.md) – Vytváření a správa workflow

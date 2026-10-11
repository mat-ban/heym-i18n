# Structura Workflow

Workflow-urile sunt stocate ca JSON cu noduri și muchii. Consultați [Tipuri de noduri](./node-types.md) pentru tipurile de noduri disponibile și [Expression DSL](./expression-dsl.md) pentru sintaxa expresiilor în câmpurile `data`.

## Obiectul Workflow

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

## Obiectul Node

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

### `data` pentru nodul Agent (memorie persistentă)

Nodurile [Agent](../nodes/agent-node.md) acceptă un graf de cunoștințe opțional pentru fiecare nod de canvas:

| Câmp | Tip | Descriere |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Când este `true`, încarcă graful stocat în system prompt și îmbină faptele noi după execuții reușite |
| `memoryShares` | array (opțional) | Acordă altor agenți acces la graful de memorie al acestui nod (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Consultați [Agent Persistent Memory](./agent-persistent-memory.md). |

Exemplu:

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

Consultați [Agent Persistent Memory](./agent-persistent-memory.md) pentru căile API, comportamentul editorului și semantica extragerii.

## Obiectul Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipuri de noduri

Valori comune pentru `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) și altele. Lista completă: [Tipuri de noduri](./node-types.md). Nodurile din același nivel de execuție rulează în [paralel](./parallel-execution.md).

## Aspectul editorului

Fiecare nod are `position.x` și `position.y` pentru aspectul canvasului desktop. Pe ecrane sub
pragul de 768px, editorul înlocuiește canvasul liber Vue Flow cu un arbore de workflow
pe ecran complet, indentat. Arborele urmărește căile de execuție conectate, marchează ramurile
paralele și utilizează aceleași etichete de noduri, pictograme și starea ultimei rulări ca editorul desktop.

Atingeți un nod pentru a-l selecta. Dacă are un rezultat de execuție înregistrat, detaliul său pe ecran complet se deschide cu
filele input, output și eroare. Navigarea inferioară mobilă oferă **Nodes**, **Properties**,
**Run** și **More**; antetul păstrează acțiunile de salvare, istoric, căutare, setări și partajare.
Desktopul continuă să utilizeze canvasul liber Vue Flow și panourile laterale.

Utilizați **Add node** în fila Nodes mobilă pentru a căuta în biblioteca de noduri. Un nod obișnuit deschide o
foaie de conexiune imediat după adăugare: alegeți un nod de ancoră și plasați-l **After**,
**Before** sau ca ramură **Parallel**. În modul de editare, atingeți un nod obișnuit existent pentru a deschide aceeași
foaie cu conexiunea sa curentă selectată. Nodurile Trigger rămân independente deoarece nu acceptă
input obișnuit. Controlul de editare expune, de asemenea, o acțiune de eliminare pentru nodul selectat. Detaliile execuției
includ săgeți anterioare și următoare când rezultatele nodurilor
adiacente sunt disponibile. AI Assistant se deschide deasupra arborelui mobil ca o foaie inferioară, fără
a schimba fila activă a editorului.

## Resurse conexe

- [Tipuri de noduri](./node-types.md) – Toate tipurile de noduri și descrierile
- [Canvas Features](./canvas-features.md) – Funcțiile editorului (data pin, execution logs, enable/disable, extract to sub-workflow)
- [Download & Import](./download-import.md) – Exportați și importați workflow-uri ca JSON
- [Agent Node](../nodes/agent-node.md) – Structura `data` a nodului Agent
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` și API-ul grafului de memorie
- [Expression DSL](./expression-dsl.md) – Sintaxa pentru `userMessage`, `condition`, `$vars`, `$global` etc.
- [Parallel Execution](./parallel-execution.md) – Cum rulează nodurile în paralel
- [Triggers](./triggers.md) – Noduri de start și puncte de intrare
- [Workflows Tab](../tabs/workflows-tab.md) – Creați și gestionați workflow-uri

# Struttura dei Workflow

I Workflow sono memorizzati come JSON con nodi ed edge. Consultare [Tipi di Nodo](./node-types.md) per i tipi di nodo disponibili e [Expression DSL](./expression-dsl.md) per la sintassi delle espressioni nei campi `data`.

## Oggetto Workflow

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

## Oggetto Nodo

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

### `data` del Nodo Agent (memoria persistente)

I nodi [Agent](../nodes/agent-node.md) supportano un knowledge graph opzionale per ciascun nodo del canvas:

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Quando `true`, carica il grafo memorizzato nel system prompt e unisce i nuovi fatti dopo esecuzioni riuscite |
| `memoryShares` | array (opzionale) | Concede ad altri agenti l'accesso al grafo di memoria di questo nodo (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Consultare [Memoria Persistente dell'Agent](./agent-persistent-memory.md). |

Esempio:

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

Consultare [Memoria Persistente dell'Agent](./agent-persistent-memory.md) per i percorsi API, il comportamento dell'editor e la semantica di estrazione.

## Oggetto Edge

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipi di Nodo

Valori comuni di `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) e altri. Elenco completo: [Tipi di Nodo](./node-types.md). I nodi allo stesso livello di esecuzione vengono eseguiti in [parallelo](./parallel-execution.md).

## Layout dell'editor

Ogni nodo dispone di `position.x` e `position.y` per il layout del canvas desktop. Su schermi al di sotto del breakpoint di 768px, l'editor sostituisce il canvas libero Vue Flow con un albero del workflow a schermo intero e indentato. L'albero segue i percorsi di esecuzione connessi, contrassegna i rami paralleli e utilizza le stesse etichette dei nodi, icone e stato dell'ultima esecuzione dell'editor desktop.

Toccare un nodo per selezionarlo. Se dispone di un risultato di esecuzione registrato, si apre il dettaglio a schermo intero con le schede input, output ed error. La navigazione inferiore mobile fornisce **Nodes**, **Properties**, **Run** e **More**; l'intestazione mantiene le azioni di salvataggio, cronologia, ricerca, impostazioni e condivisione. Il desktop continua a utilizzare il canvas libero Vue Flow e i pannelli laterali.

Utilizzare **Add node** nella scheda Nodes mobile per cercare nella libreria dei nodi. Un nodo regolare apre immediatamente un pannello di connessione dopo l'aggiunta: scegliere un nodo di ancoraggio e posizionarlo **After**, **Before** o come ramo **Parallel**. In modalità modifica, toccare un nodo regolare esistente per aprire lo stesso pannello con la connessione corrente selezionata. I nodi Trigger rimangono indipendenti poiché non accettano input regolari. Il controllo di modifica espone anche un'azione di rimozione per il nodo selezionato. I dettagli di esecuzione includono frecce precedente e successiva quando sono disponibili i risultati dei nodi adiacenti. L'AI Assistant si apre sopra l'albero mobile come pannello inferiore, senza modificare la scheda attiva dell'editor.

## Correlati

- [Tipi di Nodo](./node-types.md) – Tutti i tipi di nodo e le descrizioni
- [Funzionalità del Canvas](./canvas-features.md) – Funzionalità dell'editor (data pin, log di esecuzione, abilitazione/disabilitazione, estrazione in sub-workflow)
- [Download e Importazione](./download-import.md) – Esportazione e importazione dei workflow come JSON
- [Nodo Agent](../nodes/agent-node.md) – Struttura `data` del nodo Agent
- [Memoria Persistente dell'Agent](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` e API del grafo di memoria
- [Expression DSL](./expression-dsl.md) – Sintassi per `userMessage`, `condition`, `$vars`, `$global`, ecc.
- [Esecuzione Parallela](./parallel-execution.md) – Come i nodi vengono eseguiti in parallelo
- [Trigger](./triggers.md) – Nodi di avvio e punti di ingresso
- [Scheda Workflows](../tabs/workflows-tab.md) – Creazione e gestione dei workflow

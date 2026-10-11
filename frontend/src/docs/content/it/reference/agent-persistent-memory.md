# Memoria persistente dell'Agent

I nodi Agent possono mantenere un **knowledge graph per nodo** archiviato nel database: entità (con tipi e proprietà) e relazioni tra esse. Quando abilitata, Heym **inietta un riepilogo di tale grafo nel system prompt** a ogni esecuzione (se il grafo non è vuoto). Dopo un'esecuzione riuscita, un **job di estrazione LLM** unisce in background i nuovi fatti emersi dalla conversazione al grafo.

I sub-agent e gli orchestratori utilizzano ciascuno il grafo associato al **proprio nodo del canvas** per impostazione predefinita. È inoltre possibile **concedere ad altri agent l'accesso in lettura o in lettura/scrittura** al grafo di questo nodo (inclusi agent in **altri workflow** di Sua proprietà): vedere [Condivisione con altri agent](#condivisione-con-altri-agent).

## Abilitazione

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Se `true`, carica il grafo di questo nodo nel system prompt e pianifica l'estrazione post-esecuzione per il grafo di questo nodo |
| `memoryShares` | array (opzionale) | Concede ad altri nodi Agent l'accesso al grafo di memoria di **questo** nodo; vedere [Condivisione](#condivisione-con-altri-agent) |

La abiliti nelle proprietà del nodo Agent (**Persistent memory (graph)**). Un'icona **cervello** rosa sul nodo apre l'editor del grafo quando la memoria è abilitata (o quando è mostrato un modello).

## Editor del grafo

La finestra di dialogo visualizza le entità come un grafo animato a forza diretta — cerchi colorati dimensionati in base al numero di connessioni e raggruppati per tipo di entità — oltre a funzionalità di modifica e navigazione (adatta vista, layout ordinato, scorciatoie da tastiera). È possibile **aggiungere, modificare o eliminare** nodi e archi manualmente; i selettori di relazione Source/Target sono ricercabili per grafi con molte entità. Selezionando un nodo vengono mostrate le sue connessioni in uscita e in entrata, ciascuna cliccabile per passare a quel nodo. Le modifiche si applicano esclusivamente al grafo di **questo** agent (il grafo del nodo del canvas di cui ha aperto il cervello).

## Condivisione con altri agent

Nella finestra di dialogo del grafo di memoria, **Share memory with other agents** consente di collegare **peer** che possono consumare questo grafo in fase di esecuzione:

1. Scelga un **workflow** (qualsiasi workflow che può aprire nell'editor).
2. Scelga un nodo **agent** in quel workflow.
3. Imposti **Read only** o **Read & write**.

| Permesso | Effetto |
|------------|--------|
| Read only | Quando l'agent **peer** viene eseguito, questo grafo viene unito al system prompt del peer (se contiene entità). Nessuna estrazione verso questo grafo dall'esecuzione del peer. |
| Read & write | Stesso comportamento sul prompt della modalità read; inoltre, dopo un completamento **riuscito** del peer, la consueta estrazione di memoria può anche **unire a questo grafo (del proprietario)** utilizzando la credenziale dell'esecuzione del peer. |

I peer sono archiviati per nodo proprietario come voci `memoryShares` con `peerWorkflowId` e `peerCanvasNodeId` (e `permission`). I workflow più datati possono omettere `peerWorkflowId` per peer nello **stesso** workflow; l'editor lo interpreta come il workflow corrente.

La **condivisione cross-workflow** viene risolta in fase di esecuzione scansionando i workflow **di Sua proprietà**. Le esecuzioni prive di un contesto utente autenticato risolvono solo le condivisioni definite nel JSON del workflow **corrente** (stesso canvas).

## Comportamento in fase di esecuzione

### Grafo proprio (`persistentMemoryEnabled`)

1. **Prima della chiamata LLM** — Se il grafo contiene entità, viene aggiunto un blocco al system instruction che spiega che si tratta di fatti provenienti da esecuzioni precedenti (potenzialmente incompleti; in caso di conflitto prevale il messaggio corrente dell'utente).
2. **Dopo un completamento riuscito** — Un job in background richiede al modello (stessa credenziale dell'esecuzione dell'agent) un JSON strutturato (entità + relazioni). Tale payload viene unito al database (si applicano deduplicazione e pulizia delle relazioni per alcuni tipi, ad esempio gli archi in stile rapporto di lavoro).

### Peer che ricevono grafi condivisi

Quando un agent viene eseguito, il sistema individua i nodi **proprietari** (in qualsiasi workflow di Sua proprietà, ove possibile) i cui `memoryShares` puntano al workflow e al nodo del canvas di questa esecuzione. Per ogni corrispondenza, il grafo di quel proprietario viene aggiunto come sezione **shared memory** nel system prompt. I peer con permesso **Read & write** pianificano inoltre le destinazioni di estrazione per il workflow/grafo **del proprietario** quando l'esecuzione ha successo.

L'estrazione **non** viene eseguita quando l'esecuzione termina con errore o in uno stato HITL pending.

## Workflow JSON (campo `data`)

Persistito sul nodo Agent come le altre impostazioni:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` è `"read"` o `"write"`. Omettere `memoryShares` o utilizzare `[]` quando non vi è condivisione.

Per la forma completa dell'oggetto nodo, vedere [Workflow Structure](./workflow-structure.md).
## Correlati

- [Nodo Agent](../nodes/agent-node.md) — Configurazione completa dell'agente
- [Architettura dell'agente](./agent-architecture.md) — Orchestrator, sub-agents, strumenti
- [Struttura del Workflow](./workflow-structure.md) — Formato JSON del Workflow
- [Funzionalità del Canvas](./canvas-features.md) — Controllo del cervello e finestra di dialogo del grafo
- [Scheda Esecuzioni](../tabs/traces-tab.md) — Osservabilità delle richieste/risposte LLM

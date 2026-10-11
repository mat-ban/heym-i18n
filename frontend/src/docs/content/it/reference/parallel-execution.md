# Esecuzione Parallela

Heym esegue i nodi in parallelo quando non presentano dipendenze reciproche e consente l'esecuzione simultanea di più esecuzioni del Workflow.

## All'interno di una Singola Esecuzione

### Pianificazione Basata su DAG

L'executor raggruppa i nodi per **livello di esecuzione** utilizzando un grafo aciclico diretto (DAG):

1. **Livello 0** – Nodi privi di archi entranti (nodi di avvio)
2. **Livello N** – Nodi le cui dipendenze a monte sono tutte collocate nei livelli 0..N-1

I nodi appartenenti al medesimo livello non presentano dipendenze reciproche e vengono eseguiti in parallelo.

### Thread Pool

- **Pool condiviso**: `ThreadPoolExecutor(max_workers=8)` per l'esecuzione dei nodi
- **Pianificazione**: `wait(..., return_when=FIRST_COMPLETED)` – non appena un nodo termina, i nodi a valle vengono pianificati
- **Thread-safe**: gli output dei nodi vengono memorizzati con un lock (`store_node_output`)

### Sub-Agent dell'Orchestrator

Quando un agente orchestrator restituisce più chiamate allo strumento `call_sub_agent` in un singolo turno, queste vengono eseguite in parallelo. Si rimanda a [Agent Architecture](./agent-architecture.md).

### Nodo Merge

Il nodo [Merge](../nodes/merge-node.md) combina gli output provenienti da più rami paralleli. Lo si utilizzi quando è necessario combinare esplicitamente i risultati; in caso contrario, i rami paralleli possono terminare in nodi di output separati.

### Cicli

Le iterazioni dei cicli vengono eseguite **sequenzialmente**. I nodi che compongono il corpo del ciclo vengono ripianificati a ogni iterazione.

### Early Return

I nodi di output con `allowDownstream` possono restituire il risultato in anticipo. Il lavoro a valle rimanente viene eseguito in background.

## Esecuzioni Concorenti del Workflow

- **Nessun lock per Workflow** – Più richieste possono eseguire il medesimo Workflow contemporaneamente
- **API asincrona** – Gli endpoint FastAPI utilizzano `asyncio.to_thread(execute_workflow)` affinché l'event loop rimanga reattivo
- **Isolamento** – Ogni esecuzione dispone di una propria istanza `WorkflowExecutor` e del relativo stato

I Trigger che eseguono i Workflow ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) invocano ciascuno `execute_workflow` in modo indipendente.

## Streaming

Lo streaming utilizza il medesimo modello parallelo, ma emette eventi man mano che i nodi completano l'esecuzione. L'editor e l'interfaccia di chat del portale utilizzano internamente lo streaming per fornire l'avanzamento in tempo reale, e gli utenti dei Webhook possono ora aderire al medesimo flusso di eventi tramite l'endpoint di esecuzione [SSE Streaming](./sse-streaming.md).

## Correlati

- [Why Heym](../getting-started/why-heym.md) – Esecuzione parallela basata su DAG nel runtime di Heym
- [Workflow Structure](./workflow-structure.md) – Nodi, archi e flusso di esecuzione
- [Core Concepts](../getting-started/core-concepts.md) – Panoramica del flusso di esecuzione
- [Node Types](./node-types.md) – Nodo [Merge](../nodes/merge-node.md) e altre tipologie
- [Triggers](./triggers.md) – Punti di ingresso che avviano le esecuzioni
- [SSE Streaming](./sse-streaming.md) – Formato del flusso di eventi per `/execute/stream`
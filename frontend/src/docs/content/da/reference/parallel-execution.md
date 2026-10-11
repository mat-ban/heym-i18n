# Parallel Kørsel

Heym kører noder parallelt, når de ikke har afhængigheder af hinanden, og tillader flere workflow-kørsler at udføres samtidigt.

## Inden for en enkelt kørsel

### DAG-baseret Planlægning

Executor grupperer noder efter **kørselsniveau** ved hjælp af en rettet acyklisk graf (DAG):

1. **Niveau 0** – Noder uden indgående kanter (startnoder)
2. **Niveau N** – Noder, hvis opstrømsafhængigheder alle er i niveauerne 0..N-1

Noder på samme niveau har ingen indbyrdes afhængigheder og kører parallelt.

### Trådpulje

- **Delt pulje**: `ThreadPoolExecutor(max_workers=8)` til nodekørsel
- **Planlægning**: `wait(..., return_when=FIRST_COMPLETED)` – så snart en node afsluttes, planlægges nedstrømsnoder
- **Trådsikker**: Node-output gemmes med en lås (`store_node_output`)

### Orchestrator Under-Agenter

Når en orchestrator-agent returnerer flere `call_sub_agent` værktøjskald i et træk, kører de parallelt. Se [Agentarkitektur](./agent-architecture.md).

### Merge-node

[Merge](../nodes/merge-node.md)-noden kombinerer output fra flere parallelle grene. Anvend den, når der eksplicit er behov for at kombinere resultater; ellers kan parallelle grene afsluttes i separate outputnoder.

### Løkker

Løkkeiterationer kører **sekventielt**. Noder i løkkekroppen genplanlægges pr. iteration.

### Tidlig Retur

Outputnoder med `allowDownstream` kan returnere tidligt. Resterende nedstrømsarbejde kører i baggrunden.

## Samtidige Workflow-kørsler

- **Ingen workflow-specifik lås** – Flere anmodninger kan køre det samme workflow samtidigt
- **Async API** – FastAPI-endpoints bruger `asyncio.to_thread(execute_workflow)` så event loop forbliver responsiv
- **Isolation** – Hver kørsel får sin egen `WorkflowExecutor`-instans og tilstand

Triggers, der kører workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor), kalder hver `execute_workflow` uafhængigt.

## Streaming

Streaming bruger den samme parallelle model, men udsender events, når noder afsluttes. Editoren og portal-chat-brugergrænsefladen bruger streaming internt til realtidsstatus, og webhook-brugere kan nu vælge den samme event-stream via [SSE Streaming](./sse-streaming.md)-execute-endpointet.

## Relateret

- [Hvorfor Heym](../getting-started/why-heym.md) – Parallel DAG-kørsel i Heym-runtime
- [Workflow-struktur](./workflow-structure.md) – Noder, kanter og kørselsflow
- [Kernebegreber](../getting-started/core-concepts.md) – Oversigt over kørselsflow
- [Nodetyper](./node-types.md) – [Merge](../nodes/merge-node.md)-node og andre typer
- [Triggers](./triggers.md) – Indgangspunkter, der udløser kørsler
- [SSE Streaming](./sse-streaming.md) – Event-stream-format for `/execute/stream`

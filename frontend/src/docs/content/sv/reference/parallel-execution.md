# Parallell körning

Heym kör noder parallellt när de inte har några beroenden till varandra, och tillåter flera workflow-körningar att köras samtidigt.

## Inom en enskild körning

### DAG-baserad schemaläggning

Executorn grupperar noder efter **exekveringsnivå** med hjälp av en riktad acyklisk graf (DAG):

1. **Nivå 0** – Noder utan inkommande kanter (startnoder)
2. **Nivå N** – Noder vars uppströmsberoenden alla finns i nivåerna 0..N-1

Noder på samma nivå har inga beroenden till varandra och körs parallellt.

### Trådpool

- **Delad pool**: `ThreadPoolExecutor(max_workers=8)` för nodexekvering
- **Schemaläggning**: `wait(..., return_when=FIRST_COMPLETED)` – så snart en nod är klar schemaläggs nedströmsnoder
- **Trådsäker**: Nodutdata lagras med ett lås (`store_node_output`)

### Orkestrerande sub-agenter

När en orkestrerande agent returnerar flera `call_sub_agent`-verktygsanrop i en och samma tur körs de parallellt. Se [Agentarkitektur](./agent-architecture.md).

### Merge-nod

Noden [Merge](../nodes/merge-node.md) kombinerar utdata från flera parallella grenar. Den används när resultat uttryckligen behöver kombineras; annars kan parallella grenar avslutas i separata utnoder.

### Loopar

Loopiterationer körs **sekventiellt**. Loopkroppens noder schemaläggs på nytt för varje iteration.

### Tidig retur

Utnoder med `allowDownstream` kan returnera tidigt. Återstående nedströmsarbete körs i bakgrunden.

## Samtidiga workflow-körningar

- **Inget lås per workflow** – Flera förfrågningar kan köra samma workflow samtidigt
- **Asynkront API** – FastAPI-endpoints använder `asyncio.to_thread(execute_workflow)` så att event-loopen förblir responsiv
- **Isolering** – Varje körning får en egen `WorkflowExecutor`-instans och eget tillstånd

Triggers som kör workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) anropar var och en `execute_workflow` oberoende av varandra.

## Streaming

Streaming använder samma parallella modell men skickar händelser allt eftersom noder slutförs. Editorn och portalens chattgränssnitt använder streaming internt för realtidsförlopp, och webhook-användare kan nu ansluta till samma händelseström via execute-endpointen för [SSE Streaming](./sse-streaming.md).

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Parallell DAG-exekvering i Heym-runtimen
- [Workflow-struktur](./workflow-structure.md) – Noder, kanter och exekveringsflöde
- [Grundläggande begrepp](../getting-started/core-concepts.md) – Översikt över exekveringsflödet
- [Nodtyper](./node-types.md) – Noden [Merge](../nodes/merge-node.md) och andra typer
- [Triggers](./triggers.md) – Ingångspunkter som startar körningar
- [SSE Streaming](./sse-streaming.md) – Format för händelseström för `/execute/stream`

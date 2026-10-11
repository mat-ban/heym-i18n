# Execució en paral·lel

Heym executa els nodes en paral·lel quan no tenen dependències entre si, i permet que múltiples execucions de workflow s'executin de manera concurrent.

## Dins d'una sola execució

### Planificació basada en DAG

L'executor agrupa els nodes per **nivell d'execució** mitjançant un graf acíclic dirigit (DAG):

1. **Nivell 0** – Nodes sense arestes entrants (nodes d'inici)
2. **Nivell N** – Nodes les dependències dels quals aigües amunt es troben totes en els nivells 0..N-1

Els nodes del mateix nivell no tenen dependències entre si i s'executen en paral·lel.

### Pool de fils

- **Pool compartit**: `ThreadPoolExecutor(max_workers=8)` per a l'execució de nodes
- **Planificació**: `wait(..., return_when=FIRST_COMPLETED)` – tan bon punt qualsevol node finalitza, es planifiquen els nodes posteriors
- **Thread-safe**: Les sortides dels nodes s'emmagatzemen amb un lock (`store_node_output`)

### Sub-agents de l'orquestrador

Quan un agent orquestrador retorna múltiples crides a l'eina `call_sub_agent` en un sol torn, s'executen en paral·lel. Vegeu [Agent Architecture](./agent-architecture.md).

### Node Merge

El node [Merge](../nodes/merge-node.md) combina les sortides de múltiples branques paral·leles. Utilitzeu-lo quan necessiteu explícitament combinar resultats; en cas contrari, les branques paral·leles poden acabar en nodes de sortida separats.

### Bucles

Les iteracions dels bucles s'executen **seqüencialment**. Els nodes del cos del bucle es tornen a planificar per a cada iteració.

### Retorn anticipat

Els nodes de sortida amb `allowDownstream` poden retornar anticipadament. La resta de treball posterior s'executa en segon pla.

## Execucions de workflow concurrents

- **Sense lock per workflow** – Múltiples peticions poden executar el mateix workflow alhora
- **API asíncrona** – Els endpoints de FastAPI utilitzen `asyncio.to_thread(execute_workflow)` perquè el bucle d'esdeveniments es mantingui responsiu
- **Aïllament** – Cada execució obté la seva pròpia instància i estat de `WorkflowExecutor`

Els Triggers que executen workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) criden `execute_workflow` de manera independent.

## Streaming

L'streaming utilitza el mateix model paral·lel però emet esdeveniments a mesura que els nodes finalitzen. La interfície de chat de l'editor i del portal utilitza streaming internament per al progrés en temps real, i els usuaris de webhook ara poden optar pel mateix flux d'esdeveniments a través de l'endpoint d'execució [SSE Streaming](./sse-streaming.md).

## Relacionat

- [Why Heym](../getting-started/why-heym.md) – Execució DAG en paral·lel al runtime de Heym
- [Workflow Structure](./workflow-structure.md) – Nodes, arestes i flux d'execució
- [Core Concepts](../getting-started/core-concepts.md) – Visió general del flux d'execució
- [Node Types](./node-types.md) – Node [Merge](../nodes/merge-node.md) i altres tipus
- [Triggers](./triggers.md) – Punts d'entrada que disparen execucions
- [SSE Streaming](./sse-streaming.md) – Format del flux d'esdeveniments per a `/execute/stream`
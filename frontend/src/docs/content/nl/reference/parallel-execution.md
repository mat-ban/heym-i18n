# Parallelle Uitvoering

Heym voert nodes parallel uit wanneer ze geen afhankelijkheden van elkaar hebben, en staat toe dat meerdere workflow-runs gelijktijdig worden uitgevoerd.

## Binnen een Enkele Run

### DAG-Gebaseerde Planning

De executor groepeert nodes op basis van **uitvoeringsniveau** met behulp van een gerichte acyclische graaf (DAG):

1. **Niveau 0** – Nodes zonder inkomende randen (startnodes)
2. **Niveau N** – Nodes waarvan alle upstream-afhankelijkheden zich in niveaus 0..N-1 bevinden

Nodes in hetzelfde niveau hebben geen afhankelijkheden van elkaar en worden parallel uitgevoerd.

### Thread Pool

- **Gedeelde pool**: `ThreadPoolExecutor(max_workers=8)` voor node-uitvoering
- **Planning**: `wait(..., return_when=FIRST_COMPLETED)` – zodra een node is voltooid, worden downstream-nodes gepland
- **Thread-safe**: Node-uitvoer wordt opgeslagen met een lock (`store_node_output`)

### Sub-Agents van de Orkestrator

Wanneer een orkestrator-agent meerdere `call_sub_agent`-toolaanroepen in één beurt retourneert, worden deze parallel uitgevoerd. Zie [Agent-architectuur](./agent-architecture.md).

### Merge-Node

De [Merge](../nodes/merge-node.md)-node combineert uitvoer van meerdere parallelle vertakkingen. Gebruik deze wanneer u resultaten expliciet wilt combineren; anders kunnen parallelle vertakkingen eindigen in afzonderlijke uitvoernodes.

### Loops

Loop-iteraties worden **sequentieel** uitgevoerd. De nodes in de loop-body worden per iteratie opnieuw gepland.

### Vroege Terugkeer

Uitvoernodes met `allowDownstream` kunnen vroegtijdig terugkeren. Het resterende downstream-werk wordt op de achtergrond uitgevoerd.

## Gelijktijdige Workflow-Runs

- **Geen lock per workflow** – Meerdere verzoeken kunnen dezelfde workflow tegelijkertijd uitvoeren
- **Async API** – FastAPI-endpoints gebruiken `asyncio.to_thread(execute_workflow)`, zodat de event loop responsief blijft
- **Isolatie** – Elke run krijgt een eigen `WorkflowExecutor`-instantie en -status

Triggers die workflows uitvoeren ([Webhook](./webhooks.md), [Portaal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) roepen elk afzonderlijk `execute_workflow` aan.

## Streaming

Streaming gebruikt hetzelfde parallelle model, maar zendt gebeurtenissen uit zodra nodes zijn voltooid. De editor en de chat-UI van het portaal gebruiken streaming intern voor realtime voortgang, en webhook-gebruikers kunnen nu dezelfde gebeurtenisstroom gebruiken via het [SSE Streaming](./sse-streaming.md)-uitvoerendpoint.

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Parallelle DAG-uitvoering in de Heym-runtime
- [Workflow-structuur](./workflow-structure.md) – Nodes, randen en uitvoeringsstroom
- [Kernconcepten](../getting-started/core-concepts.md) – Overzicht van de uitvoeringsstroom
- [Node-typen](./node-types.md) – [Merge](../nodes/merge-node.md)-node en andere typen
- [Triggers](./triggers.md) – Ingangspunten die runs activeren
- [SSE Streaming](./sse-streaming.md) – Formaat van de gebeurtenisstroom voor `/execute/stream`

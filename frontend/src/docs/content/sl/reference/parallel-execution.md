# Paralelno Izvajanje

Heym izvaja vozlišča paralelno, kadar med seboj nimajo odvisnosti, in omogoča večkratno izvajanje workflow-ov hkrati.

## Znotraj Enotnega Izvajanja

### Načrtovanje na Podlagi DAG

Izvajalnik grupira vozlišča po **izvedbenem nivoju** z uporabo usmerjenega acikličnega grafa (DAG):

1. **Nivo 0** – Vozlišča brez vhodnih robov (začetna vozlišča)
2. **Nivo N** – Vozlišča, katerih zgornje odvisnosti so vse v nivojih 0..N-1

Vozlišča v istem nivoju nimajo odvisnosti med seboj in se izvajajo paralelno.

### Skupina Treadov

- **Skupna skupina**: `ThreadPoolExecutor(max_workers=8)` za izvajanje vozlišč
- **Načrtovanje**: `wait(..., return_when=FIRST_COMPLETED)` – takoj, ko katero koli vozlišče konča, se načrtujejo spodnja vozlišča
- **Varnost za niti**: Izhodi vozlišč so shranjeni z zaklepom (`store_node_output`)

### Pod-agentje Orkestratorja

Ko orkestratorski agent vrne več `call_sub_agent` klicev orodij v enem koraku, se ti izvajajo paralelno. Oglejte si [Arhitektura Agenta](./agent-architecture.md).

### Združevalno Vozlišče

Vozlišče [Merge](../nodes/merge-node.md) združuje izhode iz več paralelnih vej. Uporabite ga, kadar izrecno potrebujete združiti rezultate; sicer lahko paralelne veje končajo v ločenih izhodnih vozliščih.

### Zanke

Iteracije zanke se izvajajo **zaporedno**. Vozlišča v telesu zanke se ponovno načrtujejo za vsako iteracijo.

### Zgodnje Vračilo

Izhodna vozlišča z `allowDownstream` lahko vrnejo rezultate zgodaj. Preostalo delo v spodnjem toku se izvaja v ozadju.

## Hkratni Workflow-i

- **Brez zaklepa na nivoju workflow-a** – Več zahtevkov lahko hkrati izvaja isti workflow
- **Async API** – FastAPI končne točke uporabljajo `asyncio.to_thread(execute_workflow)`, tako da ostane dogodek odziven
- **Izolacija** – Vsako izvajanje dobi svojo instanco `WorkflowExecutor` in stanje

Trigerji, ki izvajajo workflow-e ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Urejevalnik), vsak neodvisno kličejo `execute_workflow`.

## Pretakanje

Pretakanje uporablja isti paralelni model, vendar oddaja dogodke, ko vozlišča končajo. Urejevalnik in uporabniški vmesnik za klepet portala interno uporabljata pretakanje za napredek v realnem času, uporabniki webhook-a pa se lahko zdaj vključijo v isti tok dogodkov preko končne točke [SSE Streaming](./sse-streaming.md).

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Paralelno izvajanje DAG v Heym runtime
- [Struktura Workflow-a](./workflow-structure.md) – Vozlišča, robovi in potek izvajanja
- [Osnovni Koncepti](../getting-started/core-concepts.md) – Pregled poteka izvajanja
- [Tipi Vozlišč](./node-types.md) – Vozlišče [Merge](../nodes/merge-node.md) in drugi tipi
- [Trigerji](./triggers.md) – Vhodne točke, ki sprožijo izvajanja
- [SSE Streaming](./sse-streaming.md) – Oblika toka dogodkov za `/execute/stream`

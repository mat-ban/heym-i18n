# Execuție paralelă

Heym rulează nodurile în paralel atunci când acestea nu au dependențe între ele și permite ca mai multe execuții de workflow-uri să ruleze simultan.

## În cadrul unei singure execuții

### Programare bazată pe DAG

Executorul grupează nodurile după **nivel de execuție** folosind un graf aciclic orientat (DAG):

1. **Nivelul 0** – Noduri fără muchii de intrare (noduri de start)
2. **Nivelul N** – Noduri ale căror dependențe amonte se află toate în nivelurile 0..N-1

Nodurile din același nivel nu au dependențe între ele și rulează în paralel.

### Thread Pool

- **Pool partajat**: `ThreadPoolExecutor(max_workers=8)` pentru execuția nodurilor
- **Programare**: `wait(..., return_when=FIRST_COMPLETED)` – imediat ce orice nod se finalizează, nodurile din aval sunt programate
- **Thread-safe**: Ieșirile nodurilor sunt stocate cu un lock (`store_node_output`)

### Sub-agenți orchestratori

Atunci când un agent orchestrator returnează mai multe apeluri de instrument `call_sub_agent` într-o singură tură, acestea rulează în paralel. Consultați [Arhitectura agenților](./agent-architecture.md).

### Nodul Merge

Nodul [Merge](../nodes/merge-node.md) combină ieșirile din mai multe ramuri paralele. Utilizați-l atunci când aveți nevoie în mod explicit să combinați rezultatele; în caz contrar, ramurile paralele pot să se încheie în noduri de ieșire separate.

### Bucle

Iterațiile buclei rulează **secvențial**. Nodurile corpului buclei sunt reprogramate pentru fiecare iterație.

### Returnare anticipată

Nodurile de ieșire cu `allowDownstream` pot returna anticipat. Lucrul rămas din aval rulează în fundal.

## Execuții concurente de workflow-uri

- **Fără lock per workflow** – Mai multe cereri pot rula același workflow în același timp
- **API asincron** – Endpoint-urile FastAPI folosesc `asyncio.to_thread(execute_workflow)` astfel încât event loop-ul rămâne receptiv
- **Izolare** – Fiecare execuție primește propria instanță `WorkflowExecutor` și propriul său stat

Trigger-ele care rulează workflow-uri ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) apelează fiecare `execute_workflow` în mod independent.

## Streaming

Streaming-ul folosește același model paralel, dar emite evenimente pe măsură ce nodurile se finalizează. Editorul și interfața de chat din portal folosesc streaming intern pentru progres în timp real, iar utilizatorii de webhook pot acum opta pentru același flux de evenimente prin endpoint-ul de execuție [SSE Streaming](./sse-streaming.md).

## Resurse conexe

- [De ce Heym](../getting-started/why-heym.md) – Execuție DAG paralelă în runtime-ul Heym
- [Structura workflow-ului](./workflow-structure.md) – Noduri, muchii și flux de execuție
- [Concepte fundamentale](../getting-started/core-concepts.md) – Prezentare generală a fluxului de execuție
- [Tipuri de noduri](./node-types.md) – Nodul [Merge](../nodes/merge-node.md) și alte tipuri
- [Trigger-e](./triggers.md) – Puncte de intrare care declanșează execuții
- [SSE Streaming](./sse-streaming.md) – Formatul fluxului de evenimente pentru `/execute/stream`

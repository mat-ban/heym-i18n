# Paralelno Izvršavanje

Heym pokreće čvorove paralelno kada nemaju međusobne ovisnosti, te omogućuje višestruka izvršavanja workflow-a da se odvijaju istovremeno.

## Unutar Jednog Izvršavanja

### DAG-Bazirano Raspoređivanje

Izvršitelj grupira čvorove prema **razini izvršavanja** koristeći usmjereni aciklički graf (DAG):

1. **Razina 0** – Čvorovi bez ulaznih rubova (početni čvorovi)
2. **Razina N** – Čvorovi čije su uzvodne ovisnosti sve u razinama 0..N-1

Čvorovi u istoj razini nemaju međusobne ovisnosti i izvršavaju se paralelno.

### Skup Radnih Nitova

- **Zajednički skup**: `ThreadPoolExecutor(max_workers=8)` za izvršavanje čvorova
- **Raspoređivanje**: `wait(..., return_when=FIRST_COMPLETED)` – čim bilo koji čvor završi, doljni čvorovi se raspoređuju
- **Sigurno za niti**: Izlazi čvora se pohranjuju s zaključavanjem (`store_node_output`)

### Orkestratorski Pod-Agent

Kada orkestratorski agent vrati više `call_sub_agent` poziva alata u jednom okretu, oni se izvršavaju paralelno. Pogledajte [Arhitektura Agenta](./agent-architecture.md).

### Spoj Čvor

[Merge](../nodes/merge-node.md) čvor kombinira izlaze iz više paralelnih grana. Koristite ga kada izričito trebate kombinirati rezultate; inače, paralelne grane mogu završiti u odvojenim izlaznim čvorovima.

### Petlje

Iteracije petlje se izvršavaju **sekvencijalno**. Čvorovi tijela petlje se ponovno raspoređuju po iteraciji.

### Rano Vraćanje

Izlazni čvorovi s `allowDownstream` mogu se vratiti ranije. Preostali rad dolje u lancu odvija se u pozadini.

## Paralelna Izvršavanja Workflow-a

- **Bez zaključavanja po workflow-u** – Više zahtjeva može istovremeno pokrenuti isti workflow
- **Async API** – FastAPI endpointi koriste `asyncio.to_thread(execute_workflow)` tako da petlja događaja ostaje responzivna
- **Izolacija** – Svako izvršavanje dobiva svoj vlastiti `WorkflowExecutor` instancu i stanje

Okidači koji pokreću workflow-e ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) svaki neovisno pozivaju `execute_workflow`.

## Streaming

Streaming koristi isti paralelni model, ali emitira događaje kako čvorovi završavaju. Uređivač i portal chat UI koriste streaming interno za napredak u stvarnom vremenu, a korisnici webhooks-a sada se mogu uključiti u isti tok događaja putem [SSE Streaming](./sse-streaming.md) execute endpointa.

## Povezano

- [Zašto Heym](../getting-started/why-heym.md) – Paralelno DAG izvršavanje u Heym runtime-u
- [Struktura Workflow-a](./workflow-structure.md) – Čvorovi, rubovi i tijek izvršavanja
- [Osnovni Pojmovi](../getting-started/core-concepts.md) – Pregled tijeka izvršavanja
- [Tipovi Čvorova](./node-types.md) – [Merge](../nodes/merge-node.md) čvor i drugi tipovi
- [Okidači](./triggers.md) – Ulazne točke koje pokreću izvršavanja
- [SSE Streaming](./sse-streaming.md) – Format toka događaja za `/execute/stream`

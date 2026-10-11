# Paralēlā izpilde

Heym izpilda mezglus paralēli, ja tiem nav savstarpēju atkarību, un pieļauj vairāku workflow izpildes režīmu vienlaicīgu izpildi.

## Vienas izpildes ietvaros

### Uz DAG balstīta plānošana

Izpildītājs grupē mezglus pēc **izpildes līmeņa**, izmantojot virzītu aciklisku grafu (DAG):

1. **0. līmenis** – Mezgli bez ienākošām šķautnēm (sākuma mezgli)
2. **N. līmenis** – Mezgli, kuru augšupējās atkarības visas atrodas 0..N-1 līmeņos

Mezgliem vienā līmenī nav savstarpēju atkarību, un tie tiek izpildīti paralēli.

### Pavedienu pūls

- **Koplietojams pūls**: `ThreadPoolExecutor(max_workers=8)` mezglu izpildei
- **Plānošana**: `wait(..., return_when=FIRST_COMPLETED)` – tiklīdz kāds mezgls ir pabeigts, tiek ieplānoti lejupējie mezgli
- **Pavedienu drošs**: Mezglu izvades tiek saglabātas ar slēdzeni (`store_node_output`)

### Orķestrētāja apakšaģenti

Kad orķestrētāja aģents vienā gājienā atgriež vairākus `call_sub_agent` rīka izsaukumus, tie tiek izpildīti paralēli. Skatiet [Aģentu arhitektūra](./agent-architecture.md).

### Apvienošanas mezgls

[Apvienošanas](../nodes/merge-node.md) mezgls apvieno izvades no vairākiem paralēliem zariem. Izmantojiet to, ja nepārprotami nepieciešams apvienot rezultātus; pretējā gadījumā paralēlie zari var beigties atsevišķos izvades mezglos.

### Cikli

Cikla iterācijas tiek izpildītas **secīgi**. Cikla pamatteksta mezgli tiek pārplānoti katrai iterācijai.

### Agrīna atgriešanās

Izvades mezgli ar `allowDownstream` var atgriezties agrīni. Atlikušais lejupējais darbs tiek izpildīts fonā.

## Vienlaicīgas workflow izpildes

- **Nav workflow līmeņa slēdzenes** – Vairāki pieprasījumi var izpildīt vienu un to pašu workflow vienlaikus
- **Asinhronais API** – FastAPI endpointi izmanto `asyncio.to_thread(execute_workflow)`, lai notikumu cilpa saglabātos atsaucīga
- **Izolācija** – Katra izpilde iegūst savu `WorkflowExecutor` instanci un stāvokli

Triggeri, kas izpilda workflow ([Webhook](./webhooks.md), [Portāls](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Redaktors), katrs neatkarīgi izsauc `execute_workflow`.

## Straumēšana

Straumēšana izmanto to pašu paralēlo modeli, bet emitē notikumus, tiklīdz mezgli tiek pabeigti. Redaktora un portāla chat saskarne iekšēji izmanto straumēšanu reāllaika gaitas nodrošināšanai, un webhook lietotāji tagad var pievienoties tam pašam notikumu straumam, izmantojot [SSE straumēšanas](./sse-streaming.md) izpildes endpointu.

## Saistītie resursi

- [Kāpēc Heym](../getting-started/why-heym.md) – Paralēlā DAG izpilde Heym izpildlaika vidē
- [Workflow struktūra](./workflow-structure.md) – Mezgli, šķautnes un izpildes plūsma
- [Pamatkoncepcijas](../getting-started/core-concepts.md) – Izpildes plūsmas pārskats
- [Mezglu tipi](./node-types.md) – [Apvienošanas](../nodes/merge-node.md) mezgls un citi tipi
- [Triggeri](./triggers.md) – Ieejas punkti, kas izraisa izpildes
- [SSE straumēšana](./sse-streaming.md) – Notikumu straumas formāts `/execute/stream`

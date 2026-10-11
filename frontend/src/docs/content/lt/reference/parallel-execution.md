# Lygiagretiška Vykdymas

Heym vykdo mazgus lygiagrečiai, kai jie neturi priklausomybių vienas nuo kito, ir leidžia kelis workflow vykdymus vykdyti vienu metu.

## Vieno Vykdymo Rėmuose

### DAG Pagrindu Paremtas Tvarkymas

Vykdytojas grupuoja mazgus pagal **vykdymo lygį**, naudodamas nukreiptą aciklinį grafiką (DAG):

1. **Lygis 0** – Mazgai, neturintys įeinančių briaunų (pradžios mazgai)
2. **Lygis N** – Mazgai, kurių aukštyn einančios priklausomybės yra visos lygmenyse 0..N-1

Mazgai tame pačiame lygyje neturi priklausomybių vienas nuo kito ir vykdomi lygiagrečiai.

### Gijų Baseinas

- **Bendras baseinas**: `ThreadPoolExecutor(max_workers=8)` mazgų vykdymui
- **Tvarkymas**: `wait(..., return_when=FIRST_COMPLETED)` – kai tik bet kuris mazgas baigia darbą, žemyn einantys mazgai yra suplanuojami
- **Gijų saugumas**: Mazgų išvestys saugomos su užraktu (`store_node_output`)

### Orkestratoriaus Sub-agentai

Kai orkestratoriaus agentas grąžina kelis `call_sub_agent` įrankių kvietimus vienu metu, jie vykdomi lygiagrečiai. Žr. [Agentų Architektūra](./agent-architecture.md).

### Sujungimo Mazgas

[Merge](../nodes/merge-node.md) mazgas sujungia išvestis iš kelių lygiagrečių šakų. Naudokite jį, kai aiškiai reikia sujungti rezultatus; kitaip lygiagretės šakos gali baigtis atskirose išvesties mazguose.

### Ciklai

Ciklo iteracijos vykdomos **sekuentiškai**. Ciklo kūno mazgai yra vėl suplanuojami kiekvienai iteracijai.

### Ankstyvas Grąžinimas

Išvesties mazgai su `allowDownstream` gali grąžinti rezultatus anksčiau. Likęs žemyn einantis darbas vykdomas fone.

## Lygiagretūs Workflow Vykdymai

- **Nėra užrakto kiekvienam workflow** – Kelios užklausos gali vykdyti tą patį workflow tuo pačiu metu
- **Async API** – FastAPI galiniai taškai naudoja `asyncio.to_thread(execute_workflow)`, todėl įvykių ciklas išlieka reaguojantis
- **Izoliacija** – Kiekvienas vykdymas gauna savo `WorkflowExecutor` egzempliorių ir būseną

Triggeriai, kurie vykdo workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Redaktorius) kiekvienas nepriklausomai kviečia `execute_workflow`.

## Srautinė Perdavimo

Srautinė perdavimo sistema naudoja tą patį lygiagretų modelį, tačiau išleidžia įvykius, kai mazgai baigia darbą. Redaktoriaus ir portalo chat UI viduje naudoja srautinę perdavimą realiu laiku, o webhook vartotojai dabar gali pasirinkti tą patį įvykių srautą per [SSE Streaming](./sse-streaming.md) vykdymo galinį tašką.

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Lygiagretiška DAG vykdymas Heym vykdymo aplinkoje
- [Workflow Struktūra](./workflow-structure.md) – Mazgai, briaunos ir vykdymo srautas
- [Pagrindiniai Konceptai](../getting-started/core-concepts.md) – Vykdymo srauto apžvalga
- [Mazgų Tipai](./node-types.md) – [Merge](../nodes/merge-node.md) mazgas ir kiti tipai
- [Triggeriai](./triggers.md) – Įėjimo taškai, kurie sukelia vykdymus
- [SSE Streaming](./sse-streaming.md) – Įvykių srauto formatas `/execute/stream`

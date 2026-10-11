# Párhuzamos végrehajtás

A Heym párhuzamosan futtatja azokat a csomópontokat, amelyek között nincs függőségi kapcsolat, és lehetővé teszi több workflow-futtatás egyidejű végrehajtását.

## Egyetlen futtatáson belül

### DAG-alapú ütemezés

A végrehajtó a csomópontokat **végrehajtási szint** szerint csoportosítja egy irányított körmentes gráf (DAG) segítségével:

1. **0. szint** – Bejövő élekkel nem rendelkező csomópontok (kezdő csomópontok)
2. **N. szint** – Azon csomópontok, amelyeknek minden felsőbb szintű függősége a 0..N-1 szinteken található

Az ugyanazon a szinten lévő csomópontok között nincs függőség, így párhuzamosan futnak.

### Szálkészlet

- **Megosztott készlet**: `ThreadPoolExecutor(max_workers=8)` a csomópontok végrehajtásához
- **Ütemezés**: `wait(..., return_when=FIRST_COMPLETED)` – amint bármelyik csomópont befejeződik, a downstream csomópontok ütemezésre kerülnek
- **Szálbiztos**: A csomópontok kimenetei zárral (`store_node_output`) kerülnek tárolásra

### Orchestrator alkügynökök

Amikor egy orchestrator ügynök egyetlen körben több `call_sub_agent` eszközhívást ad vissza, azok párhuzamosan futnak. Lásd: [Ügynök architektúra](./agent-architecture.md).

### Merge csomópont

A [Merge](../nodes/merge-node.md) csomópont több párhuzamos ág kimeneteit egyesíti. Akkor használja, amikor kifejezetten össze kell vonni az eredményeket; egyébként a párhuzamos ágak külön kimeneti csomópontokban végződhetnek.

### Ciklusok

A ciklusiterációk **sorrendben** futnak. A ciklustörzs csomópontjai iterációnként újraütemezésre kerülnek.

### Korai visszatérés

Az `allowDownstream` beállítással rendelkező kimeneti csomópontok korán visszatérhetnek. A fennmaradó downstream munka a háttérben fut.

## Egyidejű workflow-futtatások

- **Nincs workflow-szintű zár** – Több kérés futtathatja ugyanazt a workflow-t egyidejűleg
- **Async API** – A FastAPI végpontok `asyncio.to_thread(execute_workflow)` hívást használnak, így az eseményhurok reagálóképes marad
- **Izoláció** – Minden futtatás saját `WorkflowExecutor` példányt és állapotot kap

A workflow-kat futtató triggerek ([Webhook](./webhooks.md), [Portál](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Szerkesztő) mindegyike önállóan hívja meg az `execute_workflow` függvényt.

## Streamelés

A streamelés ugyanazt a párhuzamos modellt használja, de az eseményeket a csomópontok befejeződésekor bocsátja ki. A szerkesztő és a portál chat felülete belsőleg streamelést használ a valós idejű folyamatjelzéshez, a webhook felhasználók pedig mostantól ugyanezt az eseményfolyamot választhatják az [SSE Streaming](./sse-streaming.md) execute végponton keresztül.

## Kapcsolódó témák

- [Miért a Heym?](../getting-started/why-heym.md) – Párhuzamos DAG-végrehajtás a Heym futtatókörnyezetében
- [Workflow szerkezete](./workflow-structure.md) – Csomópontok, élek és végrehajtási folyamat
- [Alapfogalmak](../getting-started/core-concepts.md) – A végrehajtási folyamat áttekintése
- [Csomóponttípusok](./node-types.md) – [Merge](../nodes/merge-node.md) csomópont és egyéb típusok
- [Triggerek](./triggers.md) – A futtatásokat kiváltó belépési pontok
- [SSE Streaming](./sse-streaming.md) – Eseményfolyam formátuma a `/execute/stream` végponthoz

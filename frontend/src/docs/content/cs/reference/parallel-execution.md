# Paralelní spouštění

Heym spouští uzly paralelně, pokud na sobě vzájemně nezávisí, a umožňuje souběžné spouštění více běhů workflow.

## V rámci jednoho spuštění

### Plánování na základě DAG

Exekutor seskupuje uzly podle **úrovně spuštění** pomocí orientovaného acyklického grafu (DAG):

1. **Úroveň 0** – Uzly bez vstupních hran (počáteční uzly)
2. **Úroveň N** – Uzly, jejichž všechny nadřazené závislosti se nacházejí v úrovních 0..N-1

Uzly ve stejné úrovni na sobě vzájemně nezávisí a spouštějí se paralelně.

### Thread Pool

- **Sdílený pool**: `ThreadPoolExecutor(max_workers=8)` pro spouštění uzlů
- **Plánování**: `wait(..., return_when=FIRST_COMPLETED)` – jakmile jakýkoli uzel dokončí činnost, jsou naplánovány navazující uzly
- **Thread-safe**: Výstupy uzlů jsou ukládány se zámkem (`store_node_output`)

### Sub-agenti orchestrátoru

Pokud agent orchestrátoru vrátí v jednom tahu více volání nástroje `call_sub_agent`, spustí se paralelně. Viz [Architektura agenta](./agent-architecture.md).

### Uzel Merge

Uzel [Merge](../nodes/merge-node.md) kombinuje výstupy z více paralelních větví. Použijte jej, pokud potřebujete výsledky výslovně zkombinovat; v opačném případě mohou paralelní větve končit v samostatných výstupních uzlech.

### Smyčky

Iterace smyčky probíhají **sekvenčně**. Uzly těla smyčky jsou přeplánovány pro každou iteraci.

### Předčasné vrácení

Výstupní uzly s `allowDownstream` mohou vrátit výsledek předčasně. Zbývající navazující práce pokračuje na pozadí.

## Souběžné běhy workflow

- **Žádný zámek na úrovni workflow** – Více požadavků může spouštět stejné workflow současně
- **Async API** – Endpointy FastAPI používají `asyncio.to_thread(execute_workflow)`, takže event loop zůstává responzivní
- **Izolace** – Každý běh získává vlastní instanci `WorkflowExecutor` a vlastní stav

Triggery, které spouštějí workflow ([Webhook](./webhooks.md), [Portál](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor), volají `execute_workflow` nezávisle.

## Streaming

Streaming používá stejný paralelní model, ale vysílá události při dokončení uzlů. Editor a chatovací rozhraní portálu používají streaming interně pro průběh v reálném čase a uživatelé webhooků nyní mohou využít stejný proud událostí prostřednictvím endpointu pro spuštění [SSE Streaming](./sse-streaming.md).

## Související

- [Proč Heym](../getting-started/why-heym.md) – Paralelní spouštění DAG v runtime Heym
- [Struktura workflow](./workflow-structure.md) – Uzly, hrany a tok spuštění
- [Základní koncepty](../getting-started/core-concepts.md) – Přehled toku spuštění
- [Typy uzlů](./node-types.md) – Uzel [Merge](../nodes/merge-node.md) a další typy
- [Triggery](./triggers.md) – Vstupní body, které spouštějí běhy
- [SSE Streaming](./sse-streaming.md) – Formát proudu událostí pro `/execute/stream`

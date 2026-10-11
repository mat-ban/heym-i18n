# Paralelné vykonávanie

Heym spúšťa uzly paralelne, keď navzájom nemajú závislosti, a umožňuje súbežné vykonávanie viacerých spustení workflowu.

## V rámci jedného spustenia

### Plánovanie na základe DAG

Exekútor zoskupuje uzly podľa **úrovne vykonávania** pomocou orientovaného acyklického grafu (DAG):

1. **Úroveň 0** – Uzly bez vstupných hrán (počiatočné uzly)
2. **Úroveň N** – Uzly, ktorých nadradené závislosti sú všetky na úrovniach 0..N-1

Uzly na rovnakej úrovni navzájom nemajú závislosti a spúšťajú sa paralelne.

### Thread Pool

- **Zdieľaný pool**: `ThreadPoolExecutor(max_workers=8)` pre vykonávanie uzlov
- **Plánovanie**: `wait(..., return_when=FIRST_COMPLETED)` – hneď ako ktorýkoľvek uzol dokončí, naplánujú sa nadväzujúce uzly
- **Thread-safe**: Výstupy uzlov sa ukladajú so zámkom (`store_node_output`)

### Sub-agenti orchestrátora

Keď agent orchestrátora vráti v jednom kroku viacero volaní nástroja `call_sub_agent`, spustia sa paralelne. Pozrite si [Architektúra agenta](./agent-architecture.md).

### Uzol Merge

Uzol [Merge](../nodes/merge-node.md) kombinuje výstupy z viacerých paralelných vetiev. Použite ho, keď explicitne potrebujete skombinovať výsledky; v opačnom prípade môžu paralelné vetvy skončiť v samostatných výstupných uzloch.

### Cykly

Iterácie cyklu prebiehajú **sekvenčne**. Uzly tela cyklu sa preplánujú pri každej iterácii.

### Skorý návrat

Výstupné uzly s `allowDownstream` môžu vrátiť výsledok skôr. Zostávajúca nadväzujúca práca pokračuje na pozadí.

## Súbežné spustenia workflowu

- **Žiadny zámok na úrovni workflowu** – Viacero požiadaviek môže spúšťať ten istý workflow súčasne
- **Async API** – FastAPI endpointy používajú `asyncio.to_thread(execute_workflow)`, takže event loop zostáva responzívny
- **Izolácia** – Každé spustenie dostane vlastnú inštanciu `WorkflowExecutor` a vlastný stav

Trigger-y, ktoré spúšťajú workflowy ([Webhook](./webhooks.md), [Portál](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor), volajú `execute_workflow` nezávisle.

## Streaming

Streaming používa rovnaký paralelný model, ale vysiela udalosti po dokončení uzlov. Editor a chatovacie rozhranie portálu používajú streaming interne na zobrazenie priebehu v reálnom čase a používatelia webhookov môžu teraz využiť rovnaký prúd udalostí prostredníctvom endpointu na spustenie [SSE Streaming](./sse-streaming.md).

## Súvisiace

- [Prečo Heym](../getting-started/why-heym.md) – Paralelné vykonávanie DAG v runtime Heym
- [Štruktúra workflowu](./workflow-structure.md) – Uzly, hrany a tok vykonávania
- [Kľúčové koncepty](../getting-started/core-concepts.md) – Prehľad toku vykonávania
- [Typy uzlov](./node-types.md) – Uzol [Merge](../nodes/merge-node.md) a ďalšie typy
- [Trigger-y](./triggers.md) – Vstupné body, ktoré spúšťajú behy
- [SSE Streaming](./sse-streaming.md) – Formát prúdu udalostí pre `/execute/stream`

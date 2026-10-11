# Základné koncepty

## Workflows

Workflow je orientovaný graf [**uzlov**](../reference/node-types.md) prepojených **hranami**. Workflows spravujte na karte [Workflows](../tabs/workflows-tab.md). Organizujte ich v [priečinkoch](../reference/workflow-organization.md). Vykonávanie prebieha od [trigger uzlov](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) cez spracovateľské uzly až po [output](../nodes/output-node.md) uzly. Formát JSON nájdete v časti [Workflow Structure](../reference/workflow-structure.md). Workflows ukladajte a zdieľajte ako [Templates](../tabs/templates-tab.md), aby ste ich mohli opätovne použiť v rôznych projektoch. Workflows môžu tiež spúšťať z [Board](../tabs/board-tab.md), kde kanban karty spúšťajú workflow reťazec stĺpca s plným kontextom karty.

## Uzly

Každý uzol má:

- **Type** – Určuje správanie (napr. `llm`, `condition`, `http`)
- **Data** – Konfigurácia (model, prompt, URL atď.)
- **Inputs/Outputs** – Handles na prepojenie s ostatnými uzlami

Úplný zoznam nájdete v časti [Node Types](../reference/node-types.md).

## Hrany

Hrany prepájajú output handle zdrojového uzla s input handle cieľového uzla. Počas vykonávania prúdia dáta po hranách.

## Priebeh vykonávania

1. **Trigger** – Uzol Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger alebo [WebSocket Trigger](../nodes/websocket-trigger-node.md) spustí vykonávanie (pozri [Triggers](../reference/triggers.md))
2. **Downstream** – Každý uzol prijíma výstup z prepojených upstream uzlov; [parallel execution](../reference/parallel-execution.md) spúšťa nezávislé uzly súbežne
3. **Expressions** – Uzly odkazujú na upstream dáta prostredníctvom `$nodeLabel.field`. Pozri [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Uzol [Output](../nodes/output-node.md) vytvára konečný výsledok

## Referencie výrazov

Použite `$input` pre dáta uzla Input a `$nodeLabel.field` pre akýkoľvek upstream uzol. Príklad: `$llm.text` odkazuje na pole `text` z uzla označeného "llm". Úplná syntax: [Expression DSL](../reference/expression-dsl.md). Pri úprave výrazov použite [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) pre väčší editor so živým náhľadom backendu.

## Súvisiace

- [Quick Start](./quick-start.md) – Vytvorte svoj prvý workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, execution logs, enable/disable, extract to sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Vytvárajte workflows pomocou prirodzeného jazyka
- [Node Types](../reference/node-types.md) – Všetky dostupné uzly
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na dáta vo výrazoch
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor so živým náhľadom backendu
- [Workflows Tab](../tabs/workflows-tab.md) – Správa workflows a priečinkov
- [Workflow Organization](../reference/workflow-organization.md) – Priečinky a plánované mazanie
- [Triggers](../reference/triggers.md) – Vstupné body pre workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Ako uzly bežia paralelne

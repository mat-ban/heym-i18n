# Základní koncepty

## Workflows

Workflow je orientovaný graf [**uzlů**](../reference/node-types.md) propojených **hranami**. Workflows spravujte na kartě [Workflows](../tabs/workflows-tab.md). Uspořádejte je do [složek](../reference/workflow-organization.md). Spuštění probíhá od [trigger uzlů](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) přes zpracovávající uzly až po [výstupní](../nodes/output-node.md) uzly. Formát JSON naleznete v části [Struktura workflow](../reference/workflow-structure.md). Uložte a sdílejte workflows jako [Templates](../tabs/templates-tab.md) pro jejich opětovné použití v různých projektech. Workflows lze spouštět také z [Board](../tabs/board-tab.md), kde kanban karty spouštějí workflow řetězec sloupce s plným kontextem karty.

## Uzly

Každý uzel má:

- **Typ** – Určuje chování (např. `llm`, `condition`, `http`)
- **Data** – Konfigurace (model, prompt, URL atd.)
- **Vstupy/Výstupy** – Handly pro propojení s dalšími uzly

Úplný seznam naleznete v části [Typy uzlů](../reference/node-types.md).

## Hrany

Hrany propojují výstupní handle zdrojového uzlu se vstupním handlem cílového uzlu. Během spuštění proudí data po hranách.

## Průběh spuštění

1. **Trigger** – Uzel Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger nebo [WebSocket Trigger](../nodes/websocket-trigger-node.md) zahájí spuštění (viz [Triggers](../reference/triggers.md))
2. **Navazující uzly** – Každý uzel přijímá výstup z propojených předcházejících uzlů; [paralelní spuštění](../reference/parallel-execution.md) spouští nezávislé uzly souběžně
3. **Výrazy** – Uzly odkazují na data předcházejících uzlů pomocí `$nodeLabel.field`. Viz [Expression DSL](../reference/expression-dsl.md).
4. **Výstup** – Uzel [Output](../nodes/output-node.md) vytváří konečný výsledek

## Odkazy na výrazy

Použijte `$input` pro data uzlu Input a `$nodeLabel.field` pro jakýkoli předcházející uzel. Příklad: `$llm.text` odkazuje na pole `text` z uzlu označeného "llm". Úplná syntaxe: [Expression DSL](../reference/expression-dsl.md). Při úpravě výrazů použijte [Dialog vyhodnocení výrazů](../reference/expression-evaluation-dialog.md) pro rozsáhlejší editor s živým náhledem backendu.

## Související

- [Rychlý start](./quick-start.md) – Vytvořte svůj první workflow
- [Funkce plátna](../reference/canvas-features.md) – Data pin, protokoly spuštění, povolení/zakázání, extrakce do pod-workflow
- [AI Assistant](../reference/ai-assistant.md) – Vytvářejte workflows přirozeným jazykem
- [Typy uzlů](../reference/node-types.md) – Všechny dostupné uzly
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na data ve výrazech
- [Dialog vyhodnocení výrazů](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu
- [Karta Workflows](../tabs/workflows-tab.md) – Správa workflows a složek
- [Organizace workflow](../reference/workflow-organization.md) – Složky a plánované mazání
- [Triggers](../reference/triggers.md) – Vstupní body pro workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Paralelní spuštění](../reference/parallel-execution.md) – Jak uzly běží paralelně

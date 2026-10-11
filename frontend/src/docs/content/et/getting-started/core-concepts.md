# Põhikontseptsioonid

## Workflow'd

Workflow on suunatud graaf, mis koosneb [**sõlmedest**](../reference/node-types.md), mis on ühendatud **servade** kaudu. Hallake workflow'sid vahekaardil [Workflows](../tabs/workflows-tab.md). Korraldage neid [kaustades](../reference/workflow-organization.md). Täitmine kulgeb [trigger-sõlmedest](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) läbi töötlevate sõlmede [väljund](../nodes/output-node.md)-sõlmedeni. JSON-vormingu kohta vaadake [Workflow Structure](../reference/workflow-structure.md). Salvestage ja jagage workflow'sid [Templates](../tabs/templates-tab.md)-ina, et neid projektide vahel uuesti kasutada. Workflow'sid saavad käivituda ka [Board](../tabs/board-tab.md)-ilt, kus kanban-kaardid käivitavad veeru workflow-ahela kaardi täieliku kontekstiga.

## Sõlmed

Igal sõlmel on:

- **Tüüp** – Määrab käitumise (nt `llm`, `condition`, `http`)
- **Andmed** – Konfiguratsioon (mudel, prompt, URL jne)
- **Sisendid/Väljundid** – Käepidemed teiste sõlmedega ühendamiseks

Täieliku loetelu leiate jaotisest [Node Types](../reference/node-types.md).

## Servad

Servad ühendavad lähtesõlme väljundkäepideme sihtsõlme sisendkäepidemega. Andmed liiguvad täitmise ajal mööda servi.

## Täitmise voog

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger või [WebSocket Trigger](../nodes/websocket-trigger-node.md) sõlm käivitab täitmise (vaadake [Triggers](../reference/triggers.md))
2. **Allavoolu** – Iga sõlm saab väljundi ühendatud ülesvoolu sõlmedelt; [parallel execution](../reference/parallel-execution.md) käivitab sõltumatud sõlmed samaaegselt
3. **Avaldised** – Sõlmed viitavad ülesvoolu andmetele `$nodeLabel.field` kaudu. Vaadake [Expression DSL](../reference/expression-dsl.md).
4. **Väljund** – [Output](../nodes/output-node.md) sõlm loob lõpptulemuse

## Avaldise viited

Kasutage `$input` Input-node andmete jaoks ja `$nodeLabel.field` mis tahes ülesvoolu node'i jaoks. Näide: `$llm.text` viitab väljale `text` node'ist, mille silt on "llm". Täielik süntaks: [Expression DSL](../reference/expression-dsl.md). Kasutage [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md), et avada suurem redaktor, mis pakub avaldiste redigeerimisel reaalajas backend'i eelvaadet.

## Seotud

- [Kiire alustamine](./quick-start.md) – Looge oma esimene workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, täitmise logid, lubamine/keelamine, alam-workflow'sse eraldamine
- [AI Assistant](../reference/ai-assistant.md) – Looge workflow'sid loomulikus keeles
- [Node Types](../reference/node-types.md) – Kõik saadaolevad node'id
- [Expression DSL](../reference/expression-dsl.md) – Andmetele viitamine avaldistes
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor reaalajas backend'i eelvaatega
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow'de ja kaustade haldamine
- [Workflow Organization](../reference/workflow-organization.md) – Kaustad ja ajastatud kustutamine
- [Triggers](../reference/triggers.md) – Workflow'de sisenemispunktid
- [Webhooks](../reference/webhooks.md) – HTTP webhook trigger (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Kuidas node'id paralleelselt töötavad

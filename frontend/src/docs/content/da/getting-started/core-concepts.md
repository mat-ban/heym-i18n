# Kernekoncepter

## Workflows

En workflow er en rettet graf af [**noder**](../reference/node-types.md) forbundet af **kanter**. Workflows administreres i fanen [Workflows](../tabs/workflows-tab.md). De organiseres i [mapper](../reference/workflow-organization.md). Udførelse forløber fra [trigger-noder](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) gennem behandlingsnoder til [output](../nodes/output-node.md)-noder. Se [Workflow-struktur](../reference/workflow-structure.md) for JSON-formatet. Workflows kan gemmes og deles som [Templates](../tabs/templates-tab.md) for genbrug på tværs af projekter. Workflows kan også køre fra [Board](../tabs/board-tab.md), hvor kanban-kort udløser en kolonnes workflow-kæde med kortets fulde kontekst.

## Noder

Hver node har:

- **Type** – Bestemmer adfærd (f.eks. `llm`, `condition`, `http`)
- **Data** – Konfiguration (model, prompt, URL osv.)
- **Inputs/Outputs** – Håndtag til forbindelse med andre noder

Se [Node-typer](../reference/node-types.md) for den fulde liste.

## Kanter

Kanter forbinder en kildenodes output-håndtag til en målnodes input-håndtag. Data flyder langs kanter under udførelse.

## Udførelsesforløb

1. **Trigger** – Input-, Cron-, Telegram Trigger-, Discord Trigger-, IMAP Trigger- eller [WebSocket Trigger](../nodes/websocket-trigger-node.md)-node starter udførelse (se [Triggere](../reference/triggers.md))
2. **Nedstrøms** – Hver node modtager output fra forbundne opstrøms-noder; [parallel udførelse](../reference/parallel-execution.md) kører uafhængige noder samtidigt
3. **Udtryk** – Noder refererer til opstrøms-data via `$nodeLabel.field`. Se [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md)-node producerer det endelige resultat

## Udtryksreferencer

Brug `$input` for Input-nodens data og `$nodeLabel.field` for enhver opstrøms-node. Eksempel: `$llm.text` refererer til `text`-feltet fra en node med label "llm". Fuld syntaks: [Expression DSL](../reference/expression-dsl.md). Brug [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) for en større editor med live backend-forhåndsvisning ved redigering af udtryk.

## Relateret

- [Quick Start](./quick-start.md) – Byg den første workflow
- [Canvas-funktioner](../reference/canvas-features.md) – Data pin, udførelseslogs, aktivér/deaktivér, udtræk til sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Opret workflows med naturligt sprog
- [Node-typer](../reference/node-types.md) – Alle tilgængelige noder
- [Expression DSL](../reference/expression-dsl.md) – Referering til data i udtryk
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-forhåndsvisning
- [Workflows-fanen](../tabs/workflows-tab.md) – Administrer workflows og mapper
- [Workflow-organisering](../reference/workflow-organization.md) – Mapper og planlagt sletning
- [Triggere](../reference/triggers.md) – Indgangspunkter for workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook-trigger (TTL, cache, rate limit)
- [Parallel udførelse](../reference/parallel-execution.md) – Hvordan noder kører parallelt

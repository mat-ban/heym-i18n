# Grundläggande begrepp

## Workflows

En workflow är en riktad graf av [**noder**](../reference/node-types.md) sammankopplade med **kanter**. Workflows hanteras i fliken [Workflows](../tabs/workflows-tab.md). De organiseras i [mappar](../reference/workflow-organization.md). Exekvering flödar från [trigger-noder](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) genom bearbetningsnoder till [output](../nodes/output-node.md)-noder. Se [Workflow-struktur](../reference/workflow-structure.md) för JSON-formatet. Workflows kan sparas och delas som [Templates](../tabs/templates-tab.md) för återanvändning i olika projekt. Workflows kan även köras från [Board](../tabs/board-tab.md), där kanban-kort utlöser en kolumns workflow-kedja med kortets fullständiga kontext.

## Noder

Varje nod har:

- **Typ** – Bestämmer beteende (t.ex. `llm`, `condition`, `http`)
- **Data** – Konfiguration (modell, prompt, URL, etc.)
- **Inputs/Outputs** – Handtag för anslutning till andra noder

Se [Nodtyper](../reference/node-types.md) för den fullständiga listan.

## Kanter

Kanter kopplar en källnods output-handtag till en målnods input-handtag. Data flödar längs kanterna under exekvering.

## Exekveringsflöde

1. **Trigger** – Input-, Cron-, Telegram Trigger-, Discord Trigger-, IMAP Trigger- eller [WebSocket Trigger](../nodes/websocket-trigger-node.md)-nod startar exekveringen (se [Triggers](../reference/triggers.md))
2. **Nedströms** – Varje nod tar emot output från anslutna uppströmsnoder; [parallell exekvering](../reference/parallel-execution.md) kör oberoende noder samtidigt
3. **Uttryck** – Noder refererar till uppströmsdata via `$nodeLabel.field`. Se [Expression DSL](../reference/expression-dsl.md).
4. **Output** – [Output](../nodes/output-node.md)-noden producerar det slutliga resultatet

## Uttrycksreferenser

Använd `$input` för Input-nodens data och `$nodeLabel.field` för valfri uppströmsnod. Exempel: `$llm.text` refererar till fältet `text` från en nod med etiketten "llm". Fullständig syntax: [Expression DSL](../reference/expression-dsl.md). Använd [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) för en större editor med live-förhandsvisning från backend vid redigering av uttryck.

## Relaterat

- [Snabbstart](./quick-start.md) – Bygg den första workflowen
- [Canvas-funktioner](../reference/canvas-features.md) – Data pin, exekveringsloggar, aktivera/inaktivera, extrahera till sub-workflow
- [AI-assistent](../reference/ai-assistant.md) – Skapa workflows med naturligt språk
- [Nodtyper](../reference/node-types.md) – Alla tillgängliga noder
- [Expression DSL](../reference/expression-dsl.md) – Referera till data i uttryck
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Expanderbar editor med live-förhandsvisning från backend
- [Fliken Workflows](../tabs/workflows-tab.md) – Hantera workflows och mappar
- [Workflow-organisering](../reference/workflow-organization.md) – Mappar och schemalagd borttagning
- [Triggers](../reference/triggers.md) – Ingångspunkter för workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook-trigger (TTL, cache, rate limit)
- [Parallell exekvering](../reference/parallel-execution.md) – Hur noder körs parallellt

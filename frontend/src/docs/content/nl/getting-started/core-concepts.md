# Kernconcepten

## Workflows

Een workflow is een gerichte graaf van [**knooppunten**](../reference/node-types.md) die met elkaar verbonden zijn door **edges**. Beheer workflows in het tabblad [Workflows](../tabs/workflows-tab.md). Organiseer ze in [mappen](../reference/workflow-organization.md). De uitvoering verloopt van [trigger-knooppunten](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) via verwerkingsknooppunten naar [output](../nodes/output-node.md)-knooppunten. Zie [Workflow-structuur](../reference/workflow-structure.md) voor het JSON-formaat. Sla workflows op en deel ze als [Sjablonen](../tabs/templates-tab.md) om ze in meerdere projecten te hergebruiken. Workflows kunnen ook worden uitgevoerd vanaf het [Board](../tabs/board-tab.md), waar kanban-kaarten de workflow-keten van een kolom starten met de volledige context van de kaart.

## Knooppunten

Elk knooppunt heeft:

- **Type** – Bepaalt het gedrag (bijv. `llm`, `condition`, `http`)
- **Data** – Configuratie (model, prompt, URL, enz.)
- **Inputs/Outputs** – Handles voor verbinding met andere knooppunten

Zie [Knooppunttypen](../reference/node-types.md) voor de volledige lijst.

## Edges

Edges verbinden de output-handle van een bronknooppunt met de input-handle van een doelknooppunt. Tijdens de uitvoering stromen gegevens langs de edges.

## Uitvoeringsverloop

1. **Trigger** – Een Input-, Cron-, Telegram Trigger-, Discord Trigger-, IMAP Trigger- of [WebSocket Trigger](../nodes/websocket-trigger-node.md)-knooppunt start de uitvoering (zie [Triggers](../reference/triggers.md))
2. **Stroomafwaarts** – Elk knooppunt ontvangt output van verbonden stroomopwaartse knooppunten; [parallelle uitvoering](../reference/parallel-execution.md) voert onafhankelijke knooppunten gelijktijdig uit
3. **Expressies** – Knooppunten verwijzen naar stroomopwaartse gegevens via `$nodeLabel.field`. Zie [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Het [Output](../nodes/output-node.md)-knooppunt produceert het eindresultaat

## Expressieverwijzingen

Gebruik `$input` voor de gegevens van het Input-knooppunt en `$nodeLabel.field` voor elk stroomopwaarts knooppunt. Voorbeeld: `$llm.text` verwijst naar het veld `text` van een knooppunt met het label "llm". Volledige syntaxis: [Expression DSL](../reference/expression-dsl.md). Gebruik de [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) voor een grotere editor met live backend-preview bij het bewerken van expressies.

## Gerelateerd

- [Quick Start](./quick-start.md) – Bouw uw eerste workflow
- [Canvas-functies](../reference/canvas-features.md) – Data pin, uitvoeringslogboeken, in-/uitschakelen, extraheren naar sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Maak workflows met natuurlijke taal
- [Knooppunttypen](../reference/node-types.md) – Alle beschikbare knooppunten
- [Expression DSL](../reference/expression-dsl.md) – Verwijzen naar gegevens in expressies
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview
- [Workflows-tabblad](../tabs/workflows-tab.md) – Workflows en mappen beheren
- [Workflow-organisatie](../reference/workflow-organization.md) – Mappen en geplande verwijdering
- [Triggers](../reference/triggers.md) – Ingangspunten voor workflows
- [Webhooks](../reference/webhooks.md) – HTTP webhook-trigger (TTL, cache, rate limit)
- [Parallelle uitvoering](../reference/parallel-execution.md) – Hoe knooppunten parallel worden uitgevoerd

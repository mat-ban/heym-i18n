# Conceptes bàsics

## Workflows

Un workflow és un graf dirigit de [**nodes**](../reference/node-types.md) connectats per **arestes**. Gestioneu els workflows a la pestanya [Workflows](../tabs/workflows-tab.md). Organitzeu-los en [carpetes](../reference/workflow-organization.md). L'execució flueix des dels [nodes trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) a través dels nodes de processament fins als nodes de [sortida](../nodes/output-node.md). Consulteu [Workflow Structure](../reference/workflow-structure.md) per al format JSON. Deseu i compartiu workflows com a [Templates](../tabs/templates-tab.md) per reutilitzar-los entre projectes. Els workflows també es poden executar des del [Board](../tabs/board-tab.md), on les targetes kanban activen la cadena de workflow d'una columna amb el context complet de la targeta.

## Nodes

Cada node té:

- **Type** – Determina el comportament (p. ex. `llm`, `condition`, `http`)
- **Data** – Configuració (model, prompt, URL, etc.)
- **Inputs/Outputs** – Connectors per connectar amb altres nodes

Consulteu [Node Types](../reference/node-types.md) per a la llista completa.

## Arestes

Les arestes connecten el connector de sortida d'un node d'origen amb el connector d'entrada d'un node de destinació. Les dades flueixen per les arestes durant l'execució.

## Flux d'execució

1. **Trigger** – Un node Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger o [WebSocket Trigger](../nodes/websocket-trigger-node.md) inicia l'execució (consulteu [Triggers](../reference/triggers.md))
2. **Descendent** – Cada node rep la sortida dels nodes ascendents connectats; l'[execució paral·lela](../reference/parallel-execution.md) executa nodes independents de manera concurrent
3. **Expressions** – Els nodes fan referència a dades ascendents mitjançant `$nodeLabel.field`. Consulteu [Expression DSL](../reference/expression-dsl.md).
4. **Sortida** – El node [Output](../nodes/output-node.md) produeix el resultat final

## Referències d'expressions

Utilitzeu `$input` per a les dades del node Input i `$nodeLabel.field` per a qualsevol node ascendent. Exemple: `$llm.text` fa referència al camp `text` d'un node etiquetat com a "llm". Sintaxi completa: [Expression DSL](../reference/expression-dsl.md). Utilitzeu el [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) per a un editor més gran amb previsualització en directe del backend quan editeu expressions.

## Relacionat

- [Quick Start](./quick-start.md) – Creeu el vostre primer workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, registres d'execució, activar/desactivar, extreure a sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Creeu workflows amb llenguatge natural
- [Node Types](../reference/node-types.md) – Tots els nodes disponibles
- [Expression DSL](../reference/expression-dsl.md) – Referenciar dades en expressions
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor ampliable amb previsualització en directe del backend
- [Workflows Tab](../tabs/workflows-tab.md) – Gestionar workflows i carpetes
- [Workflow Organization](../reference/workflow-organization.md) – Carpetes i eliminació programada
- [Triggers](../reference/triggers.md) – Punts d'entrada per als workflows
- [Webhooks](../reference/webhooks.md) – Trigger de webhook HTTP (TTL, caché, límit de velocitat)
- [Parallel Execution](../reference/parallel-execution.md) – Com s'executen els nodes en paral·lel

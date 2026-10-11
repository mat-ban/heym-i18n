# Concepte Fundamentale

## Workflow-uri

Un workflow este un graf direcționat de [**noduri**](../reference/node-types.md) conectate prin **muchii**. Gestionați workflow-urile în tab-ul [Workflows](../tabs/workflows-tab.md). Organizați-le în [foldere](../reference/workflow-organization.md). Execuția curge de la [nodurile de tip trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) prin nodurile de procesare către nodurile de [output](../nodes/output-node.md). Consultați [Workflow Structure](../reference/workflow-structure.md) pentru formatul JSON. Salvați și partajați workflow-urile ca [Templates](../tabs/templates-tab.md) pentru a le reutiliza în cadrul proiectelor. Workflow-urile pot rula și din [Board](../tabs/board-tab.md), unde cardurile kanban declanșează lanțul de workflow-uri al unei coloane cu contextul complet al cardului.

## Noduri

Fiecare nod are:

- **Type** – Determină comportamentul (de ex. `llm`, `condition`, `http`)
- **Data** – Configurare (model, prompt, URL etc.)
- **Inputs/Outputs** – Handle-uri pentru conectarea la alte noduri

Consultați [Node Types](../reference/node-types.md) pentru lista completă.

## Muchii

Muchiile conectează handle-ul de output al unui nod sursă la handle-ul de input al unui nod țintă. Datele circulă de-a lungul muchiilor în timpul execuției.

## Fluxul de Execuție

1. **Trigger** – Nodul Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger sau [WebSocket Trigger](../nodes/websocket-trigger-node.md) pornește execuția (consultați [Triggers](../reference/triggers.md))
2. **Downstream** – Fiecare nod primește output de la nodurile upstream conectate; [execuția paralelă](../reference/parallel-execution.md) rulează nodurile independente în mod concurent
3. **Expressions** – Nodurile referențiază datele upstream prin `$nodeLabel.field`. Consultați [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Nodul [Output](../nodes/output-node.md) produce rezultatul final

## Referințe în Expresii

Utilizați `$input` pentru datele nodului Input și `$nodeLabel.field` pentru orice nod upstream. Exemplu: `$llm.text` referențiază câmpul `text` dintr-un nod etichetat „llm". Sintaxa completă: [Expression DSL](../reference/expression-dsl.md). Utilizați [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) pentru un editor mai amplu cu previzualizare live în backend la editarea expresiilor.

## Resurse Conexe

- [Quick Start](./quick-start.md) – Construiți primul dumneavoastră workflow
- [Canvas Features](../reference/canvas-features.md) – Data pin, jurnale de execuție, activare/dezactivare, extragere în sub-workflow
- [AI Assistant](../reference/ai-assistant.md) – Creați workflow-uri cu limbaj natural
- [Node Types](../reference/node-types.md) – Toate nodurile disponibile
- [Expression DSL](../reference/expression-dsl.md) – Referențierea datelor în expresii
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend
- [Workflows Tab](../tabs/workflows-tab.md) – Gestionarea workflow-urilor și folderelor
- [Workflow Organization](../reference/workflow-organization.md) – Foldere și ștergere programată
- [Triggers](../reference/triggers.md) – Puncte de intrare pentru workflow-uri
- [Webhooks](../reference/webhooks.md) – Trigger HTTP webhook (TTL, cache, rate limit)
- [Parallel Execution](../reference/parallel-execution.md) – Cum rulează nodurile în paralel

# Concetti Fondamentali

## Workflow

Un workflow è un grafo orientato di [**nodi**](../reference/node-types.md) collegati da **archi**. Gestire i workflow nella scheda [Workflows](../tabs/workflows-tab.md). Organizzarli in [cartelle](../reference/workflow-organization.md). L'esecuzione fluisce dai [nodi trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) attraverso i nodi di elaborazione fino ai nodi di [output](../nodes/output-node.md). Consultare [Struttura del Workflow](../reference/workflow-structure.md) per il formato JSON. Salvare e condividere i workflow come [Modelli](../tabs/templates-tab.md) per riutilizzarli tra progetti. I workflow possono anche essere eseguiti dalla [Board](../tabs/board-tab.md), dove le card kanban attivano la catena di workflow di una colonna con il contesto completo della card.

## Nodi

Ogni nodo dispone di:

- **Tipo** – Determina il comportamento (es. `llm`, `condition`, `http`)
- **Dati** – Configurazione (modello, prompt, URL, ecc.)
- **Input/Output** – Handle per il collegamento ad altri nodi

Consultare [Tipi di Nodo](../reference/node-types.md) per l'elenco completo.

## Archi

Gli archi collegano l'handle di output di un nodo sorgente all'handle di input di un nodo di destinazione. I dati fluiscono lungo gli archi durante l'esecuzione.

## Flusso di Esecuzione

1. **Trigger** – Un nodo Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger o [WebSocket Trigger](../nodes/websocket-trigger-node.md) avvia l'esecuzione (consultare [Trigger](../reference/triggers.md))
2. **Downstream** – Ogni nodo riceve l'output dai nodi upstream collegati; l'[esecuzione parallela](../reference/parallel-execution.md) esegue i nodi indipendenti in modo concorrente
3. **Espressioni** – I nodi fanno riferimento ai dati upstream tramite `$nodeLabel.field`. Consultare [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Il nodo [Output](../nodes/output-node.md) produce il risultato finale

## Riferimenti alle Espressioni

Utilizzare `$input` per i dati del nodo Input e `$nodeLabel.field` per qualsiasi nodo upstream. Esempio: `$llm.text` fa riferimento al campo `text` di un nodo etichettato "llm". Sintassi completa: [Expression DSL](../reference/expression-dsl.md). Utilizzare la [Finestra di Valutazione delle Espressioni](../reference/expression-evaluation-dialog.md) per un editor più ampio con anteprima live del backend durante la modifica delle espressioni.

## Correlati

- [Avvio Rapido](./quick-start.md) – Creare il primo workflow
- [Funzionalità del Canvas](../reference/canvas-features.md) – Data pin, log di esecuzione, abilitazione/disabilitazione, estrazione in sub-workflow
- [Assistente IA](../reference/ai-assistant.md) – Creare workflow con linguaggio naturale
- [Tipi di Nodo](../reference/node-types.md) – Tutti i nodi disponibili
- [Expression DSL](../reference/expression-dsl.md) – Riferimenti ai dati nelle espressioni
- [Finestra di Valutazione delle Espressioni](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima live del backend
- [Scheda Workflows](../tabs/workflows-tab.md) – Gestire workflow e cartelle
- [Organizzazione dei Workflow](../reference/workflow-organization.md) – Cartelle ed eliminazione pianificata
- [Trigger](../reference/triggers.md) – Punti di ingresso per i workflow
- [Webhook](../reference/webhooks.md) – Trigger webhook HTTP (TTL, cache, rate limit)
- [Esecuzione Parallela](../reference/parallel-execution.md) – Come i nodi vengono eseguiti in parallelo

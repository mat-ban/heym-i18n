# Migrare a Heym

Si hanno già dei workflow in un altro strumento? **AI Convert** li trasforma in workflow Heym. Incollare un workflow da n8n, Flowise, Dify, Langflow, sim.ai o Activepieces — oppure descrivere semplicemente ciò che si desidera — e Heym costruirà il workflow equivalente su un canvas live, pronto per il download e l'importazione.

Aprire lo strumento su **[heym.run/convert](https://heym.run/convert)**, oppure utilizzare il pulsante **✨ AI Convert** nell'intestazione del sito.

## Come funziona

1. **Selezionare lo strumento di origine** (opzionale) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, oppure lasciare su *Auto*.
2. **Fornire il workflow** — incollare il JSON esportato dallo strumento corrente, oppure scrivere una descrizione in linguaggio naturale dell'automazione desiderata.
3. **Generare** — Heym trasmette il risultato su un canvas, disegnando nodi e connessioni man mano che vengono prodotti.
4. **Scaricare o copiare** il workflow generato in formato JSON.
5. **Importare in Heym** — utilizzare il flusso [Download & Import](../reference/download-import.md) per incollare il JSON sul canvas, quindi eseguirlo.

La conversione aggiunge inoltre una piccola *Sticky Note* sul canvas che contrassegna il workflow come generato da Heym — è possibile eliminarla in qualsiasi momento.

## Cosa si ottiene

Il convertitore mappa i concetti di origine sui nodi nativi di Heym — Trigger, passaggi [LLM](../nodes/llm-node.md), chiamate [HTTP](../nodes/http-node.md), azioni [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loop](../nodes/loop-node.md), [Condition](../nodes/condition-node.md) e [Output](../nodes/output-node.md). Rivedere il risultato sul canvas, collegare le [Credenziali](../reference/credentials.md) e adattare tutto ciò che lo strumento di origine ha espresso in modo diverso.

> AI Convert è un punto di partenza, non una porta 1:1 garantita. Rivedere sempre il workflow generato prima di eseguirlo in produzione.

## Informazioni utili

- **Basato su IA:** le conversioni sono prodotte da un modello linguistico di grandi dimensioni, pertanto i risultati possono variare tra un'esecuzione e l'altra. Rigenerare se il primo risultato non è del tutto corretto.
- **Dimensione dell'input:** l'input incollato o digitato è limitato a circa **25.000 token**. Ridurre le esportazioni molto grandi prima della conversione.
- **Limiti di frequenza:** per mantenere lo strumento disponibile a tutti, le richieste sono limitate a **1 al minuto, 5 all'ora e 10 al giorno** per visitatore.
- **Sicurezza:** le richieste vengono filtrate e solo quelle relative alla costruzione di workflow vengono elaborate.

## Passaggi successivi

- Si è nuovi al canvas? Iniziare dalla [Guida rapida](./quick-start.md).
- Scoprire come funziona l'importazione in [Download & Import](../reference/download-import.md).
- Si ospita Heym in autonomia? Consultare [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) per il riferimento completo alla configurazione.
- Costruire da zero con l'[AI Assistant](../reference/ai-assistant.md) integrato nell'applicazione.

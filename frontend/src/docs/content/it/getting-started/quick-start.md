# Guida rapida

Avviare il primo workflow Heym in pochi minuti.

Heym non è ancora in esecuzione? Consultare [Esecuzione e distribuzione](./running-and-deployment.md) oppure seguire il video tutorial: [Configurare Heym in locale in meno di 2 minuti](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Creare un workflow

1. Accedere alla scheda [Workflows](../tabs/workflows-tab.md)
2. Fare clic su **Nuovo workflow**
3. Assegnare un nome al workflow (ad es. "Hello World")

## 2. Aggiungere nodi

1. Aprire il pannello **Nodi** a sinistra
2. Trascinare un nodo [Input](../nodes/input-node.md) sul canvas
3. Trascinare un nodo [LLM](../nodes/llm-node.md) e collegarlo all'Input
4. Trascinare un nodo [Output](../nodes/output-node.md) e collegarlo al nodo LLM

```
[Input] --> [LLM] --> [Output]
```

Consultare [Tipi di nodo](../reference/node-types.md) per tutti i nodi disponibili.

## 3. Configurare

- **Input**: impostare un valore predefinito o lasciare vuoto per l'input dell'utente (vedere [Nodo Input](../nodes/input-node.md))
- **LLM**: selezionare una [credenziale](../tabs/credentials-tab.md) e un modello, aggiungere un'istruzione di sistema e impostare `userMessage` su `$input.text` (vedere [Nodo LLM](../nodes/llm-node.md))
- **Output**: impostare `message` su `$llm.text` per inoltrare la risposta del nodo LLM (vedere [Nodo Output](../nodes/output-node.md))

Utilizzare la sintassi [Expression DSL](../reference/expression-dsl.md) per `$input.text` e `$llm.text`. Fare clic sul pulsante di espansione nei campi espressione per aprire la [Finestra di valutazione delle espressioni](../reference/expression-evaluation-dialog.md) con anteprima live del backend.

## 4. Eseguire

Fare clic su **Esegui**, premere `Ctrl + Invio` oppure utilizzare il pannello di debug per avviare l'esecuzione. Il workflow viene eseguito dal nodo Input attraverso i nodi collegati fino all'Output. Consultare [Trigger](../reference/triggers.md) per altre modalità di esecuzione dei workflow ([webhook](../reference/webhooks.md), portale, cron, ecc.).

Visualizzare le esecuzioni precedenti in **Cronologia** (barra degli strumenti) e utilizzare **Bring to Canvas** per rieseguire con gli stessi input.

Nelle pagine Docs, Valutazioni e altre pagine interne non-canvas, è inoltre possibile utilizzare il [Quick Drawer](../reference/quick-drawer.md) per selezionare un workflow aggiunto ai preferiti ed eseguirlo senza tornare all'editor.

Se si sta consultando la documentazione e si desidera un chiarimento prima di procedere, aprire [Chat with Heym](../reference/chat-with-heym.md) dall'intestazione di Docs per porre domande contestuali alla pagina.

In alternativa, utilizzare l'[AI Assistant](../reference/ai-assistant.md) dal pannello di Debug per creare workflow con linguaggio naturale: descrivere ciò che si desidera e l'IA genera nodi e collegamenti.

Si stanno già creando automazioni in un altro strumento? [Migrare a Heym](./migrate-to-heym.md) converte un workflow n8n, Flowise, Dify, Langflow, sim.ai o Activepieces in un workflow Heym importabile.

## Correlati

- [Concetti fondamentali](./core-concepts.md) – Workflow, nodi e flusso di esecuzione
- [Migrare a Heym](./migrate-to-heym.md) – Convertire workflow n8n, Flowise, Dify, Langflow, sim.ai o Activepieces in Heym con l'IA
- [Esecuzione e distribuzione](./running-and-deployment.md) – Avviare in locale con `run.sh` o distribuire con `deploy.sh`
- [Variabili d'ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Riferimento completo alla configurazione
- [Impostazioni](../reference/user-settings.md) – Configurare nome, User Rules e password
- [Funzionalità del canvas](../reference/canvas-features.md) – Data pin, log di esecuzione, abilitazione/disabilitazione, estrazione in sub-workflow
- [Scorciatoie da tastiera](../reference/keyboard-shortcuts.md) – Scorciatoie del canvas e dell'editor
- [Expression DSL](../reference/expression-dsl.md) – Riferimento ai dati nella configurazione dei nodi
- [Finestra di valutazione delle espressioni](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima live del backend
- [Trigger](../reference/triggers.md) – Tutti i punti di ingresso dei workflow ([webhook](../reference/webhooks.md), portale, cron, ecc.)
- [Cronologia delle esecuzioni](../reference/execution-history.md) – Visualizzare le esecuzioni precedenti e Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Eseguire workflow aggiunti ai preferiti dalle pagine non-canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Porre domande contestuali dall'intestazione di Docs
- [Scheda Workflows](../tabs/workflows-tab.md) – Creare e gestire workflow
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere chiavi API per i nodi LLM
- [AI Assistant](../reference/ai-assistant.md) – Creare workflow con linguaggio naturale

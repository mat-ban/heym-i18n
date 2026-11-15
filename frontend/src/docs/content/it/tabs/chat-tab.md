# Scheda Chat

La scheda **Chat** fornisce un'interfaccia di chat diretta con l'LLM. Utilizzarla per testare i modelli, porre domande, eseguire workflow esistenti o creare un nuovo workflow a partire da una richiesta in linguaggio naturale.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Guarda la demo della Chat</a></p>

## Configurazione

1. Selezionare una [credenziale](./credentials-tab.md) (API key per OpenAI, Google, ecc.)
2. Scegliere un modello dal menu a tendina (i modelli vengono caricati dalla credenziale selezionata)
3. Iniziare a digitare per inviare messaggi

È inoltre possibile avviare una conversazione dalla casella di chat nella [scheda Workflows](./workflows-tab.md). Questa invia il primo messaggio e apre qui la nuova conversazione con la risposta già in streaming.

## Funzionalità

- **Contesto delle variabili globali** – Le [Variabili globali](../reference/global-variables.md) sono disponibili per l'LLM, consentendo di porre domande o fare riferimento ai valori memorizzati
- **Contesto dei modelli del workspace** – I modelli condivisi di workflow e nodi presenti nel workspace vengono inclusi come contesto, così la Chat può rispondere a domande sui modelli disponibili
- **Agente a esecuzione prolungata** – La Chat continua a lavorare sul backend anche se il browser viene chiuso, consentendo di riprendere la stessa conversazione da un altro dispositivo
- **Creazione di workflow** – Chiedere alla Chat di creare o configurare un workflow: utilizza lo stesso motore Workflow AI Builder dell'assistente dell'editor per generare e salvare il workflow
- **Creazione di attività Kanban** – Chiedere in linguaggio naturale di aggiungere un'attività o creare una card. La Chat la aggiunge alla prima colonna della board richiesta; in presenza di più board, se non ne viene indicata una, la Chat presenta un selettore di board prima di creare la card
- **Follow-up in coda** – Inviare altri messaggi mentre una risposta è in streaming. I messaggi in coda vengono persistiti, possono essere modificati o eliminati prima dell'avvio e vengono eseguiti in ordine dopo la risposta attiva
- **Kanban boards** – Ask naturally to add, assign, move, update or comment on a task, list your overdue tasks or what waits for a review, or create and arrange boards and columns. When you have multiple boards and do not name one, Chat presents a board picker before creating a card. See [Board › From Chat and MCP](./board-tab.md#from-chat-and-mcp)
- **Send now** – Click **Send now** beside a queued message to stop the active reply and send that message immediately. The partial reply stays in the conversation, followed by your message and the new answer. The message keeps its files and chosen model; the other queued messages remain and resume in order afterward
- **Changing direction** – After **Send now**, your latest message controls the task. A cancelled question stays as context and is not another pending job. Interrupted requests appear as **cancelled** in Traces and run history, including ones stopped before the model answers

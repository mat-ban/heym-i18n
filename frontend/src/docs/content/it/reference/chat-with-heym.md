# Chat with Heym

Chat with Heym è un assistente consapevole della pagina, disponibile dall'intestazione della documentazione. Si apre in una finestra di dialogo centrata, consente di selezionare una credenziale LLM e un modello, e risponde alle domande utilizzando la pagina della documentazione corrente come primo contesto.

## Apertura della finestra di dialogo

1. Aprire una qualsiasi pagina sotto `/docs`
2. Fare clic su **Chat with Heym** nell'intestazione
3. Selezionare una [credenziale](../tabs/credentials-tab.md) e un modello
4. Porre una domanda sulla pagina o sulla piattaforma

Sugli schermi più piccoli il trigger è rappresentato solo da un'icona; sugli schermi più grandi mostra l'etichetta completa.

## Contesto utilizzato

- Il percorso della documentazione attualmente aperto viene iniettato nella richiesta come guida contestuale
- Il backend continua a utilizzare l'endpoint chat della dashboard esistente e gli strumenti di ricerca della documentazione
- Le [User Rules](./user-settings.md) a livello di account continuano ad applicarsi, poiché viene riutilizzato lo stesso backend chat
- I passaggi di preparazione in tempo reale vengono trasmessi nel bubble dell'assistente prima della risposta finale, in modo analogo alla chat della dashboard
- Le domande di chiarimento vengono visualizzate come card, allo stesso modo della [Chat tab](../tabs/chat-tab.md). Quando una richiesta di workflow necessita di una credenziale, è possibile selezionarne una o crearla dalla card. Quando necessita di una tabella dati, è possibile selezionare una delle proprie tabelle o crearne una nuova allo stesso modo.

Quando si apre la finestra di dialogo su un articolo specifico, un piccolo badge mostra il percorso della documentazione attivo, in modo da poter confermare quale pagina viene prioritizzata.

## Comportamento della sessione

- La selezione della credenziale e del modello rimane invariata finché la finestra di dialogo resta montata
- La cronologia dei messaggi è limitata alla sessione e viene cancellata alla chiusura della finestra di dialogo
- Il clic sullo sfondo, `Escape` e il pulsante di chiusura reimpostano tutti la sessione
- **Stop** interrompe la risposta in streaming corrente
- La finestra di dialogo è intenzionalmente ampia e a dimensione fissa; non offre un'opzione di visualizzazione a schermo intero

## Quando utilizzarlo

- Porre domande di approfondimento durante la lettura di una pagina di nodo o di riferimento
- Chiarire le differenze tra funzionalità senza abbandonare la documentazione
- Trovare l'articolo giusto prima di aprire l'editor

Se si desidera creare o modificare workflow direttamente, utilizzare invece l'[AI Assistant](./ai-assistant.md) lato editor.

## Correlati

- [AI Assistant](./ai-assistant.md) – Chat dell'editor per la creazione di workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere le credenziali LLM utilizzate dalla finestra di dialogo
- [Settings](./user-settings.md) – User Rules globali applicate alle superfici IA
- [Quick Start](../getting-started/quick-start.md) – Prima guida introduttiva al workflow
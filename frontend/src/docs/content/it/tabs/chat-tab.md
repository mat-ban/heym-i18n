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
- **Pause di pianificazione** – Quando la Chat necessita di dettagli di pianificazione, pone domande di chiarimento e sospende i follow-up in coda fino alla risposta. Una volta completata la risposta di pianificazione, i messaggi in coda riprendono
- **Credenziali** – Quando un workflow creato o modificato dalla Chat necessita di una credenziale, la Chat chiede quale utilizzare, propone di crearne una nuova nella conversazione oppure consente di proseguire senza. È inoltre possibile chiedere alla Chat di creare una credenziale o di aggiornarne una di propria proprietà; la Chat apre il modulo della credenziale nella conversazione. Il modello vede il nome e il tipo della credenziale, mai i suoi valori, sia per le credenziali di tua proprietà sia per quelle condivise con te. I nodi LLM e Agent aggiunti da Chat utilizzano la credenziale e il modello selezionati per la chat, incluse le credenziali condivise; quando Chat modifica un workflow, i suoi nodi LLM e Agent esistenti mantengono la propria credenziale e il proprio modello. Vedere [AI Assistant › Credentials](../reference/ai-assistant.md#credentials)
- **Dashboard** – Chieda quali [dashboard](./dashboard-tab.md) possiede, cosa contiene una di esse o su quale dashboard si trova un workflow. Chieda alla Chat di aggiungere un nuovo widget a una dashboard (inserisce un widget vuoto, quindi crea e testa il relativo workflow), posizionare un workflow esistente su una dashboard come widget, rinominare o eliminare un widget oppure riordinare il layout della dashboard. Heym Work mostra queste dashboard come le proprie pagine. Vedere [Dashboard › Da Chat e MCP](./dashboard-tab.md#da-chat-e-mcp)
- **Tabelle dati** – Quando un workflow creato o modificato dalla Chat memorizza record, la Chat chiede quale [tabella dati](./datatable-tab.md) utilizzare o propone di crearne una con le colonne necessarie. Può anche ispezionare le righe, aggiungere o rimuovere colonne e inserire, aggiornare o eliminare righe direttamente sulle tabelle di tua proprietà o modificabili. Basta fornire il nome di una tabella o il link DataTable. La rimozione di colonne e la cancellazione di tutte le righe richiedono conferma; l'aggiunta di colonne mantiene i dati esistenti. Vedere [AI Assistant › Tabelle dati](../reference/ai-assistant.md#data-tables)
- **Risposte in streaming** – Visualizzare l'output del modello mentre viene trasmesso in streaming
- **Interruzione della risposta** – Interrompere in qualsiasi momento la risposta in streaming corrente; l'interruzione cancella anche i messaggi in coda per quella conversazione
- **Rendering Markdown** – Le risposte supportano la formattazione markdown, incluse le immagini inline
- **Visualizzazione delle immagini** – Le immagini incorporate nelle risposte (ad es. dalla generazione di immagini dell'LLM) appaiono inline; fare clic su qualsiasi immagine per visualizzarla a schermo intero. Premere **Esc** o il pulsante indietro (su mobile) per chiudere la visualizzazione a schermo intero
- **Copia dei messaggi** – Copiare qualsiasi messaggio negli appunti
- **Cancellazione della chat** – Avviare una nuova conversazione
- **Input vocale** – Utilizzare il pulsante del microfono per la sintesi vocale (supportata dal browser). Al termine della registrazione, Heym può ripulire leggermente la trascrizione prima dell'invio
- **Workflow pianificati** – Chiedere quando vengono eseguiti i workflow cron (oggi, questa settimana, questo mese o un intervallo di date personalizzato). L'assistente utilizza gli stessi dati di pianificazione della scheda [Scheduled](./scheduled-tab.md) e può limitare i risultati ai workflow di propria proprietà o includere quelli condivisi
- **Cronologia delle esecuzioni dei workflow** – Chiedere informazioni su un workflow ("quante volte è stato eseguito il report giornaliero?", "ha avuto errori?", "quando è stato eseguito l'ultima volta?"). La Chat individua il workflow tramite il suo ID e risponde in base al numero di esecuzioni, alla ripartizione degli stati, all'orario della prima e dell'ultima esecuzione e alla durata media. Chiedendo perché un'esecuzione è fallita o cosa ha restituito, la Chat apre quella singola esecuzione per leggerne input, output ed errori per nodo
- **Dove falliscono le esecuzioni e perché sono lente** – Chieda dove falliscono i workflow o perché sono lenti e Chat indicherà i workflow che sono stati eseguiti più spesso, che hanno fallito di più e che risultano più lenti, oltre ai tipi di nodi che richiedono più tempo (media per chiamata e totale), che falliscono più spesso e che vengono eseguiti di più, esattamente gli stessi numeri della scheda [Analytics](./analytics-tab.md). I tipi di nodo vengono conteggiati per le esecuzioni a partire dalla versione che ha introdotto l'analisi dei nodi. Può richiedere dati sull'ultima ora, 3 o 6 ore, 24 ore, 7 o 30 giorni, o sull'intera cronologia; le finestre orarie iniziano all'ora esatta, quindi "l'ultima ora" alle 15:20 copre dalle 14:00 fino ad ora.
- **Stato delle esecuzioni in tempo reale** – Chiedere cosa è in esecuzione in questo momento: la Chat risponde con il conteggio, i nomi dei workflow, la durata di ciascuna esecuzione, il nodo su cui si trova e un link diretto all'esecuzione in tempo reale

- **Chip di contesto dell'esecuzione** – **Chiedi all'IA** nel [Execution History](../reference/execution-history.md#ask-ai) apre una nuova conversazione con l'esecuzione di Workflow selezionata allegata come chip. Vedere [Fare domande su un'esecuzione](#fare-domande-su-unesecuzione)

## Utilizzo della Chat da un Client MCP

Il motore della Chat può essere raggiunto anche dall'esterno del browser. Attivi il **Heym Agent** nella [scheda MCP / A2A](./mcp-tab.md) e i client MCP (Claude, Cursor e qualsiasi altro strumento compatibile con MCP) otterranno un unico strumento `heym_chat` che esegue lo stesso motore con tutte le sue funzionalità. Selezioni anche **Abilita A2A** affinché altri agenti possano inviargli attività tramite [A2A](../reference/a2a.md); tali conversazioni mostrano un'icona di rete nell'elenco.

Tali conversazioni confluiscono nella cronologia di questa scheda, contrassegnate da un'icona a spina nella lista delle conversazioni. Aprirne una per leggere ciò che il client ha richiesto, visualizzare le tool card attivate e continuare il thread in prima persona. Rispondere a una domanda di chiarimento funziona allo stesso modo sia che il turno sia iniziato qui sia da un client MCP.

Tramite MCP, la Chat non elenca, seleziona o crea credenziali. I Workflow che genera lasciano i campi delle credenziali vuoti, e la risposta indica i nodi che necessitano di una credenziale, in modo da poterle impostare nell'editor.

Le tabelle dati funzionano anche tramite MCP: la Chat può modificare direttamente colonne e righe, creare tabelle e integrarle nei workflow. Le domande sulle tabelle e le conferme di eliminazione arrivano come testo nel risultato; risponda con lo stesso `conversation_id`.

## Limite di Contesto

La chat mantiene fino a 25 messaggi recenti nel contesto. I messaggi più vecchi vengono rimossi per rimanere entro i limiti del modello.

## Creazione di Workflow

Quando si chiede alla Chat di creare, costruire, generare o impostare un Workflow, questa crea un nuovo Workflow salvato con un nome e una descrizione generati. La risposta include un'anteprima del canvas in sola lettura dei nodi e degli archi generati, più un link **Apri Workflow** che apre l'editor del Workflow in una nuova scheda del browser. Utilizzare il pulsante **Esegui** della card di anteprima quando si desidera eseguire il Workflow.

Il feedback successivo nella stessa chat modifica quel Workflow invece di crearne un altro. Ad esempio, dopo che la Chat ha creato un Workflow è possibile dire "aggiungi uno step di approvazione", "cambia il formato di output" o "şöyle yap" e la Chat aggiorna il Workflow salvato e aggiorna l'anteprima.

Questo è ideale per richieste in cui si desidera che il lavoro venga svolto come automazione riutilizzabile, non solo come risposta una tantum.

## Creazione di Attività Kanban

Chiedere alla Chat in linguaggio naturale, ad esempio, "Aggiungi un'attività chiamata Correggi bug di login" o
"Crea una nuova card Aggiorna documentazione sulla board Launch." È possibile includere una
descrizione nella stessa richiesta. La Chat crea sempre la card nella prima colonna della board
selezionata.

Se il workspace dispone di più board e non se ne identifica una, la Chat si mette in pausa con un
selettore di board a scelta singola. Selezionare una board per completare la creazione della card. Non è richiesto alcun
comando slash o formato di messaggio speciale.

## Chiedere Cosa È in Esecuzione

Chiedere in linguaggio naturale — "cosa è in esecuzione?", "quanti Workflow sono attivi in questo momento?",
"su quale nodo si trova il report notturno?" — e la Chat riporta il quadro in tempo reale:

- **Quante** esecuzioni sono in corso, suddivise tra in esecuzione e in attesa di revisione umana
- **A quali Workflow** appartengono, per nome
- **Da quanto tempo** è in corso ciascuna esecuzione (ad esempio `1m 35s`, `3h 25m`)
- **Quale nodo** è in esecuzione in questo momento, tramite la sua etichetta sul canvas, più l'ultimo nodo completato
- **Un link** a ciascuna esecuzione attiva, che apre il canvas con quella esecuzione in riproduzione

Le esecuzioni in pausa per una revisione [Human-in-the-Loop](../reference/human-in-the-loop.md) o Codex vengono riportate come
in attesa dell'utente, non come in esecuzione. Si tratta degli stessi dati del badge delle esecuzioni attive nell'header,
quindi la Chat e il badge non sono mai in disaccordo. Per le esecuzioni già completate, chiedere invece le esecuzioni recenti
— che legge la [Cronologia delle Esecuzioni](../reference/execution-history.md).

## Fare domande su un'esecuzione

Selezioni un'esecuzione di Workflow nel [Execution History](../reference/execution-history.md#ask-ai), dall'editor o da All History, e faccia clic su **Chiedi all'IA** accanto al titolo della finestra di dialogo. Chat apre una nuova conversazione con due chip sopra la casella del messaggio:

- **Workflow:** il nome del Workflow
- **Execution:** i primi caratteri dell'id dell'esecuzione selezionata

Rimuova un chip con la sua **×** per escluderlo. Poi ponga la sua domanda, ad esempio «perché questa esecuzione ha richiesto così tanto tempo?», «cosa è fallito qui?» oppure «può correggerlo?». I chip rimanenti vengono allegati a quel messaggio con gli id completi, così Chat legge direttamente input, output e traccia per nodo dell'esecuzione invece di cercare il Workflow. Per correggere il Workflow, Chat salva, esegue un test e verifica la modifica come descritto in [Creazione di Workflow](#creazione-di-workflow).

Il messaggio inviato mostra i chip sotto la sua domanda. Appartengono solo a quel messaggio; le domande successive nella stessa conversazione mantengono il contesto dalla cronologia.

## Chiedere Informazioni sugli Avvisi

La Chat può rispondere a domande sugli [avvisi](./alerts-tab.md) definiti:

- **Cosa esiste** — "quali avvisi ho?", "c'è un avviso sul Workflow delle fatture?",
  "quali avvisi si stanno attivando in questo momento?"
- **Come è configurato uno** — "qual è la soglia sull'avviso dei costi?", "come è configurato?"
- **Perché e quando si è attivato** — "perché si è attivato l'avviso dei costi?", "quando è stato attivato l'ultima volta?"

Per una domanda del tipo "perché si è attivato", la Chat legge il record di attivazione e cita il valore effettivamente osservato,
la soglia e la finestra esatta valutata, più il dettaglio contribuente:
gli id delle esecuzioni fallite e i messaggi di errore per gli avvisi di errore, la spesa per modello per gli avvisi di costo, o
la ripartizione per sorgente di trigger per gli avvisi di conteggio esecuzioni. Riporta ciò che era vero quando l'avviso
si è attivato anziché ricalcolare la finestra, perché la finestra è trascorsa e un calcolo aggiornato
può dare una risposta diversa.

## Regole Utente

Le [Regole Utente](../reference/user-settings.md) (configurate nelle Impostazioni) vengono automaticamente iniettate in ogni conversazione della Chat come istruzioni a livello di sistema. Impostarle una volta per applicare preferenze persistenti a tutte le richieste di chat.

## Lavorare con le Valutazioni

La Chat può creare, modificare ed eseguire le suite in [Evals](./evals-tab.md), sia suite di prompt che suite di agenti:

- **Suite di prompt**: "crea una suite di prompt per il mio prompt di risposta dell'assistenza con 8 casi di test e confronta gpt-4o con gpt-4.1-mini". La Chat scrive i casi di test con le risposte attese, sceglie un metodo di valutazione e salva la suite.
  - Prima di creare la suite, stabilisce quale credenziale LLM e quali modelli utilizzare. Con esattamente una credenziale LLM, utilizza quella e lo comunica; altrimenti lo chiede.
  - Per la valutazione LLM-as-Judge, chiede inoltre se un giudice separato debba valutare le risposte.
- **Suite di agenti**: "verifica che il mio agente di supporto cerchi sempre nei documenti e non invii mai email". La Chat individua l'agente e salva i controlli degli strumenti e le soglie. Su richiesta, esegue il workflow, generando un input diverso per ogni esecuzione.
  - Le esecuzioni delle suite di agenti sono vere esecuzioni di workflow, quindi i relativi effetti collaterali si verificano realmente. La Chat indica quanti cicli di esecuzione avvia.
- **Baseline**: La Chat può operare con la baseline di un agente in tre modi:
  - Rilevarla dalle ultime esecuzioni dell'agente.
  - Crearla dalle esecuzioni che avvia ("eseguilo 5 volte e usa quel risultato come baseline").
  - Memorizzare i valori forniti dall'utente ("imposta la baseline su 3 secondi p95 e 0,01 $ per esecuzione").
- **Esecuzioni**: La Chat attende fino a un minuto per un'esecuzione, quindi segnala il risultato:
  - Per una suite di prompt: il numero di superamenti di ciascun modello e i casi non riusciti.
  - Per una suite di agenti: la percentuale di superamento, i controlli non riusciti e lo scostamento dalla baseline.
  - Un'esecuzione più lunga prosegue in Evals; chieda alla Chat di controllarla nuovamente.

Dopo che la Chat ha creato o modificato una suite, la risposta mostra una scheda con il nome della suite, il relativo tipo e un pulsante **Apri in Evals**, simile alla scheda di un workflow salvato. Tramite MCP, il risultato di `heym_chat` elenca il link di ogni suite salvata in quella chiamata.

Lo stesso funzionamento vale da un client MCP tramite `heym_chat` (vedere [Utilizzo della Chat da un Client MCP](#utilizzo-della-chat-da-un-client-mcp)). Gli strumenti di valutazione rimangono all'interno di `heym_chat`; i client MCP non li visualizzano come strumenti separati.

L'Assistente AI dell'editor non crea suite.

## Correlati

- [Scheda MCP / A2A](./mcp-tab.md) – Espone questo motore ai client MCP come strumento `heym_chat`
- [Impostazioni](../reference/user-settings.md) – Configura le Regole utente applicate a tutte le richieste di chat
- [Scheda Credenziali](./credentials-tab.md) – Aggiungi e gestisci le chiavi API
- [Scheda Variabili](./global-variables-tab.md) – Variabili globali disponibili per la Chat
- [Tipi di Nodo](../reference/node-types.md) – Nodi LLM e Agent per i workflow
- [Nodo Agent](../nodes/agent-node.md) – Agente IA con chiamata agli strumenti
- [Assistente IA](../reference/ai-assistant.md) – Assistente dell'editor basato sullo stesso DSL del builder di workflow
- [Cronologia esecuzioni](../reference/execution-history.md) – Visualizza le esecuzioni passate (pulsante Cronologia nell'intestazione)
- [Scheda Pianificazioni](./scheduled-tab.md) – Calendario delle prossime esecuzioni cron (gli stessi dati che la Chat può riepilogare)
- [Scheda Avvisi](./alerts-tab.md) – Avvisi a soglia che la Chat può elencare e spiegare
- [Panoramica contestuale](../reference/contextual-showcase.md) – Orientamento compatto in-app per questa pagina
- [Voce Chat (TTS e STT)](../reference/chat-voice.md) – Leggi i messaggi ad alta voce e conversa a mani libere con ElevenLabs

## Chiamate agli strumenti e dimensione del contesto

Ogni volta che l'assistente invoca uno strumento (esecuzione di un workflow, elenco delle esecuzioni, creazione di un nuovo workflow), nella conversazione compare una scheda comprimibile. La scheda si espande automaticamente durante l'esecuzione dello strumento, mostrando gli argomenti esatti. Al termine dell'esecuzione, la scheda si comprime in un riepilogo su una riga con il tempo trascorso. Fare clic su qualsiasi scheda per riespandere gli argomenti e il riepilogo della risposta.

Un piccolo badge ad anello sotto il campo di input mostra l'utilizzo corrente del contesto come percentuale della finestra del modello (ad es. `12% · ~9.2k`). Passare il cursore sul badge per visualizzare una ripartizione: prompt di sistema, AGENTS.md, blocco dei workflow, regole utente, cronologia e bozza di input. Quando l'utilizzo supera l'80% l'anello diventa ambra; al 95% diventa rosso.

Se l'utilizzo si avvicina al limite, Heym comprime automaticamente i messaggi più vecchi in un breve riepilogo utilizzando lo stesso meccanismo impiegato dai nodi Agent. Una scheda "Contesto compresso" appare inline per mostrare quanto accaduto.

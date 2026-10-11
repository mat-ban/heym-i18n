# Scheda Workflows

La scheda **Workflows** è la vista predefinita della dashboard. Mostra l'elenco dei workflow, la struttura delle cartelle e consente di creare, modificare e organizzare i workflow.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

## Avviare una Chat

Sopra l'elenco dei workflow è presente una casella di chat che saluta l'utente per nome e chiede cosa si desidera automatizzare. Digitare un prompt, allegare facoltativamente un file e selezionare la credenziale e il modello desiderati. Entrambi i menu a discesa sono ricercabili e si aprono sui [valori predefiniti AI](../reference/user-settings.md).

L'invio crea una nuova conversazione e la apre nella [scheda Chat](./chat-tab.md), dove la risposta viene trasmessa in streaming. Gli allegati supportati sono file di testo, immagini e PDF, uno per messaggio, come nel compositore della chat.

Se non è ancora disponibile una credenziale LLM, la casella mostra un link alla [scheda Credenziali](./credentials-tab.md) e l'invio rimane disabilitato.

Fare clic sulla **x** per nascondere la casella. Compare quindi un pulsante **Ask AI** accanto all'intestazione Workflows che la ripristina. La scelta viene memorizzata nel browser.

## Elenco dei Workflow

L'elenco è una vista a due pannelli: i workflow e le cartelle a sinistra, un'anteprima del workflow selezionato a destra.

- Ogni riga mostra l'icona del workflow, il nome, la descrizione, la data dell'ultima modifica e un [chip di stato](#workflow-status)
- I workflow possono trovarsi nella radice o all'interno di cartelle; i workflow aggiunti ai preferiti compaiono in un apposito gruppo **Pinned** in cima
- Fare **clic** su una riga per selezionarla e caricarne l'anteprima a destra
- Fare **doppio clic** su una riga, oppure premere **Invio** mentre è selezionata, per aprirla nell'[editor](../getting-started/quick-start.md)
- Usare **Ctrl+clic** (o **Cmd+clic**) per aprirla in una nuova scheda
- Ogni riga presenta le azioni di modifica, copia, aggiunta ai preferiti ed eliminazione sulla destra. Sui telefoni queste sono nascoste in modo che il nome occupi l'intera larghezza; in tal caso, eseguire un **pressione prolungata** su una riga per aprire il pannello delle azioni
- Aggiungere ai preferiti i workflow usati di frequente nel [Quick Drawer](../reference/quick-drawer.md) per eseguirli rapidamente dalla scheda Workflows e da altre pagine interne

## Anteprima del Workflow

Selezionando un workflow, il pannello di anteprima accanto all'elenco viene popolato. Su schermi più stretti di 1280px lo stesso pannello si apre come foglio dal basso dello schermo.

Il pannello mostra:

- Il nome del workflow, chi lo ha creato e quando, e la data dell'ultima modifica
- **Open Workflow** – apre il workflow nell'editor
- **Run Now** – apre il workflow nel [Quick Drawer](../reference/quick-drawer.md), dove è possibile compilare i suoi input e avviare l'esecuzione senza uscire dall'elenco
- **Description** – la descrizione del workflow
- **Trigger Configuration** – la pianificazione per un workflow cron, oppure il trigger in ascolto per un workflow a eventi. I workflow richiamati tramite HTTP mostrano un pulsante **Copy cURL** al posto dell'endpoint grezzo e del testo di autenticazione: copia una richiesta completa con l'URL corretto, le intestazioni, il segnaposto di autenticazione e un corpo costruito dai campi di input del workflow. Quando il workflow pubblica un [portal](../reference/portal.md), anche il suo link di chat pubblica compare qui
- **Last Run Details** – l'esito e la durata dell'esecuzione più recente, oppure una nota che indica che il workflow non è mai stato eseguito
- **Workflow Steps & Sub-agents** – i nodi in ordine di esecuzione, ciascuno con il proprio modello, operazione o pianificazione e un punto che ne indica l'attività. Selezionando un passaggio si apre quel nodo nell'editor con il pannello delle proprietà già aperto

Il pannello rimane ancorato accanto all'elenco durante lo scorrimento, così da restare leggibile in un elenco di workflow lungo.

## Amministrazione dell'istanza

Gli account elencati in `HEYM_ADMIN_EMAILS` possono elencare, aprire, modificare, ispezionare la cronologia delle esecuzioni ed eliminare qualsiasi workflow sull'istanza senza condivisione o trasferimento di proprietà. L'impostazione è un elenco di indirizzi email separati da virgole, confrontati senza distinzione tra maiuscole e minuscole. Un elenco vuoto non concede questo accesso a nessuno. Riavviare il backend dopo la modifica.

Gli amministratori visualizzano l'email del proprietario nell'elenco dei workflow e possono effettuare ricerche tramite quell'indirizzo. Selezionare un workflow per aprire **Amministrazione dell'istanza** nella relativa anteprima:

1. **Sospendi trigger** è mostrato solo per i workflow contenenti un Nodo Cron. Disabilita il Cron del workflow e gli altri nodi trigger automatici tramite un normale salvataggio con versione. Le esecuzioni esistenti possono concludersi. Le chiamate manuali, API, dal portale e da sub-workflow rimangono disponibili; questa azione non è un blocco di esecuzione a livello di workflow.
2. Il pulsante cambia in **Riprendi trigger** durante la sospensione, anche dopo un ricaricamento della pagina. Riprendi riattiva i trigger sospesi dall'amministratore e lascia invariati i trigger già disabilitati. Per i workflow sospesi più vecchi privi di uno stato di sospensione amministrativa salvato, Riprendi abilita i relativi trigger automatici.
3. Utilizzare l'azione **Elimina workflow** nella riga del workflow una volta che le esecuzioni si sono concluse. L'eliminazione restituisce un conflitto finché rimangono attività in esecuzione, in coda o in attesa di revisione. L'eliminazione pianificata applica lo stesso controllo.

Sospendere i trigger e lasciare che le esecuzioni esistenti si concludano prima di eliminare. Un trigger già inviato al momento della sospensione può comunque concludersi. Utilizzare l'eliminazione quando il workflow non deve più essere richiamabile.

I segreti dei webhook e le impostazioni di autenticazione riservati al proprietario mantengono le loro protezioni esistenti. L'amministrazione non trasferisce la proprietà né condivide i record delle credenziali del proprietario. Le azioni amministrative di sospensione, ripresa, eliminazione e pianificazione compaiono nella [traccia di controllo](../reference/audit.md) con l'amministratore che ha agito e il proprietario del workflow.

## Stato del workflow

Ogni riga riporta un'etichetta di stato derivata dai nodi trigger del workflow, dal suo stato di esecuzione attivo
e — per i workflow privi di nodi trigger — da come è stata avviata la sua esecuzione più recente:

| Stato | Significato |
| --- | --- |
| **Running** | Il workflow ha un'esecuzione in corso in questo momento |
| **Scheduled** | Ha un trigger [cron](../nodes/cron-node.md) attivo |
| **Listening** | Ha un trigger di evento attivo, come un trigger Slack, Telegram, IMAP o WebSocket |
| **Paused** | Ha nodi trigger, ma ognuno di essi è disattivato |
| **API** | Non ha nodi trigger ed è stato eseguito l'ultima volta da una chiamata HTTP al suo endpoint di esecuzione |
| **SubWorker** | Non ha nodi trigger ed è stato eseguito l'ultima volta come sub-workflow da un workflow padre |
| **Portal** | Non ha nodi trigger ed è stato eseguito l'ultima volta dal suo [portale](../reference/portal.md) |
| **WEB** | Non ha nodi trigger e il suo unico terminale è un [mappatore di output HTML](../nodes/html-output-mapper-node.md), quindi richiamarlo restituisce una pagina web renderizzata |
| **Manual** | Non ha nodi trigger e non è mai stato eseguito, oppure la sua ultima esecuzione è stata avviata altrove |
| **Remove Scheduled** | È [pianificato per l'eliminazione](../reference/workflow-organization.md) |

Le etichette API, SubWorker e Portal leggono la singola voce più recente nella
[cronologia delle esecuzioni](./logs-tab.md) del workflow, quindi un workflow richiamato in due modi mostra quello che è avvenuto per ultimo. **WEB** è determinato invece dal grafo, quindi ha la precedenza su questi tre: un workflow che serve pagine viene letto come WEB anche dopo essere stato richiamato via HTTP. I nodi trigger hanno sempre la precedenza su tutti gli altri: un workflow cron che qualcuno richiama anche via HTTP rimane **Scheduled**.

Utilizzare il menu a tendina **Stato** accanto al campo di ricerca per mostrare un solo stato. Il menu a tendina elenca quanti workflow corrispondono attualmente a ciascuno. Un filtro di stato raggiunge anche l'interno delle cartelle: le cartelle con una corrispondenza vengono espanse automaticamente, mentre quelle senza corrispondenza vengono nascoste finché non si cancella il filtro.

## Workflow attivi

Su desktop, il badge circolare nella barra degli strumenti superiore mostra quanti workflow sono attualmente
in esecuzione e si aggiorna automaticamente ogni 10 secondi. Fare clic su un badge diverso da zero per aprire l'elenco
dei workflow attivi, che mostra fino a quattro righe prima di scorrere. Selezionare il nome di un workflow per collegare
l'editor alla vista in tempo reale di quell'esecuzione. Il badge zero è informativo e non può essere aperto, e il
badge è nascosto sugli schermi mobili.

## Ricerca

Utilizzare il campo di ricerca dei workflow accanto a **Stato**, oppure premere **Ctrl+F** (o **Cmd+F**), per filtrare i workflow per titolo o descrizione. I workflow corrispondenti all'interno delle cartelle vengono mostrati con i relativi rami di cartella espansi. Premere **Escape** per cancellare la ricerca.

## Cartelle

- Organizzare i workflow in [cartelle e sotto-cartelle](../reference/workflow-organization.md)
- Creare cartelle con il pulsante **Nuova cartella**, assegnando a ciascuna un nome e una descrizione opzionale visualizzata sotto il nome nell'elenco
- Ogni riga di cartella mostra quanti workflow contiene, includendo le sotto-cartelle, insieme alle azioni di nuova sotto-cartella, rinomina, cambio icona, download come ZIP ed eliminazione. Sui telefoni la riga mostra un unico pulsante di menu
- Trascinare un workflow su una cartella o sotto-cartella per visualizzare un'anteprima di destinazione delle dimensioni di una scheda. L'anteprima evidenziata mostra il percorso completo della cartella prima del rilascio, e il passaggio del cursore su una cartella compressa la espande brevemente per raggiungere le cartelle annidate.
- Trascinare i workflow tra le cartelle o alla radice. La scheda trascinata rimane visibile come fantasma, e la destinazione attiva rimane evidenziata durante lo scorrimento.
- Il rilascio di un workflow nella sua cartella corrente è disabilitato e contrassegnato come **Già nella cartella**.
- Rinominare una cartella, o modificarne la descrizione, tramite l'azione di rinomina o il menu contestuale con clic destro

## Creazione di workflow

1. Fare clic su **Nuovo workflow**
2. Inserire un nome e una descrizione opzionale
3. Il workflow si apre nell'editor

## Importazione

Trascinare un file JSON di workflow sull'area dei workflow per creare un nuovo workflow. I nodi e gli archi importati vengono utilizzati per creare il workflow; il nome proviene dal campo `name` nel JSON o dal nome del file. Consultare [Download e importazione](../reference/download-import.md) per il formato JSON e le opzioni di importazione.

## Condivisione

Aprire un workflow nell'editor e fare clic su **Condividi** per invitare utenti via email o condividere con un [team](./teams-tab.md). Scegliere **Lettura** (visualizzazione ed esecuzione) o **Scrittura** (anche modifica) per ciascun utente o team, e modificare l'impostazione in seguito dal menu a tendina accanto alla voce. Le credenziali e i sotto-workflow non vengono condivisi automaticamente; condividerli separatamente con gli stessi utenti o team. Consultare [Organizzazione dei workflow](../reference/workflow-organization.md#sharing-workflows) e [Condivisione delle credenziali](../reference/credentials-sharing.md).

## Modifica ed eliminazione

- **Modifica** – Cambiare nome e descrizione del workflow tramite l'azione di modifica della riga
- **Elimina** – I workflow vengono [pianificati per l'eliminazione](../reference/workflow-organization.md); passano a un'area cestino prima della rimozione definitiva

## Modifiche concorrenti

Il salvataggio invia la revisione su cui si basano le modifiche, e il server rifiuta la scrittura se il workflow è cambiato nel frattempo — ad esempio perché un collega lo ha salvato, o perché lo stesso workflow è rimasto aperto in una seconda scheda. Heym mostra quindi una finestra di dialogo **Rilevato workflow obsoleto** con due scelte:

- **Annulla** – Mantiene le modifiche non salvate nell'editor per poterle ricaricare in un'altra scheda e riconciliarle
- **Sovrascrivi** – Salva comunque, sostituendo la versione dell'altra persona

L'**esecuzione** di un workflow lo salva prima, quindi passa attraverso lo stesso controllo. Se il workflow è cambiato nel frattempo, l'esecuzione si mette in pausa sulla finestra di dialogo anziché sovrascrivere silenziosamente: **Sovrascrivi ed esegui** salva la propria versione e avvia l'esecuzione, **Annulla esecuzione** abbandona entrambe e lascia le modifiche intatte.

Il controllo fa parte della richiesta di salvataggio stessa, quindi non costa alcun round trip aggiuntivo e non esiste una finestra in cui un salvataggio possa sfuggirvi. Le proprie modifiche provenienti da altre parti dell'applicazione — una rinomina, una modifica alle impostazioni, un interruttore nel pannello delle proprietà — non contano mai come conflitto.

## Tavolozza dei comandi

Premere **Ctrl+K** (o **Cmd+K**) per aprire la tavolozza dei comandi. È possibile:
- Cercare i workflow per nome
- Passare a qualsiasi [scheda della dashboard](./credentials-tab.md)
- Aprire i workflow recenti

## Correlati

- [Avvio rapido](../getting-started/quick-start.md) – Creare il primo workflow
- [Organizzazione dei workflow](../reference/workflow-organization.md) – Cartelle, sotto-cartelle ed eliminazione pianificata
- [Struttura dei workflow](../reference/workflow-structure.md) – Formato JSON per i workflow
- [Download e importazione](../reference/download-import.md) – Esportare e importare workflow come JSON
- [Portale](../reference/portal.md) – Esporre i workflow come interfacce chat pubbliche
- [Board](./board-tab.md) – Eseguire workflow dalle schede kanban tramite catene di colonne
- [Concetti fondamentali](../getting-started/core-concepts.md) – Workflow, nodi ed esecuzione
- [Cronologia delle esecuzioni](../reference/execution-history.md) – Visualizzare le esecuzioni passate e Bring to Canvas
- [Cassetto rapido](../reference/quick-drawer.md) – Fissare ed eseguire workflow da dashboard, documentazione e altre pagine non dell'editor
- [Panoramica contestuale](../reference/contextual-showcase.md) – Breve guida alle pagine per le superfici della dashboard

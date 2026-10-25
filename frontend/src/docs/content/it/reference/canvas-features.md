# Funzionalità del Canvas

L'editor dei workflow fornisce diverse funzionalità per il debug, il test e l'organizzazione dei nodi: **Esegui fino al Nodo**, **AI su un nodo**, **Data Pin**, **Log di Esecuzione**, **Abilita/Disabilita** ed **Estrai in Sotto-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Guarda la demo dell'Editor</a></p>

## Esegui fino al Nodo

Posizionare il cursore su un nodo qualsiasi, eccetto una nota adesiva, e fare clic su **Esegui** sotto di esso. Heym esegue quel nodo e le sue dipendenze a monte, lasciando inalterati i nodi a valle e i rami non correlati. Questa operazione utilizza la modalità test del canvas, inclusi gli output bloccati e le normali condizioni di diramazione del workflow.

Se il percorso selezionato presenta campi di input, si apre il pannello **Esegui** a destra e viene messo a fuoco il primo campo. Inserire i valori, quindi fare clic su **Esegui fino a _etichetta nodo_** o premere **Ctrl+Invio** (Cmd+Invio su macOS). La modalità corpo generico mette a fuoco l'editor del corpo JSON. I percorsi privi di campi di input vengono eseguiti immediatamente senza aprire il pannello. I nodi Input bloccati riutilizzano il loro output bloccato senza richiedere input.

Il pannello mantiene la destinazione selezionata per le esecuzioni successive. Scegliere **Esegui workflow completo** per cancellare la destinazione. I pulsanti di esecuzione sono disabilitati mentre un'esecuzione è attiva. Una destinazione all'interno di un ciclo interrompe l'esecuzione quando quel nodo viene raggiunto per la prima volta; selezionando un nodo dopo il ciclo viene eseguito il ciclo completo a monte.

## AI su un nodo

Passa il mouse su qualsiasi nodo tranne un promemoria e fai clic su **AI** sopra di esso. L'[AI Assistant](./ai-assistant.md) si apre su quel nodo e offre **Change this node as ...**, **Fix error in this node ...** e **Other**. In modalità Agent l'assistente modifica solo quel nodo; altri nodi, connessioni e layout rimangono invariati. Vedi [AI Assistant › Modifica di un singolo nodo](./ai-assistant.md#changing-one-node).

Il pulsante è nascosto nei workflow che puoi solo visualizzare.

## Data Pin

Data Pin consente di bloccare l'output di un nodo dall'ultima esecuzione, in modo da poter testare i nodi a valle senza rieseguire il nodo bloccato.

### Dove trovarlo

- **Pannello delle proprietà** – Selezionare un nodo e scorrere fino alla sezione **Dati Bloccati**
- **Badge del nodo** – Un'icona a forma di spillo appare sul nodo quando i dati sono bloccati

### Azioni

| Azione | Descrizione |
|--------|-------------|
| **Blocca** | Blocca l'output dell'ultima esecuzione del nodo (disponibile dopo un'esecuzione) |
| **Cancella** | Rimuove i dati bloccati |
| **Modifica** | Modifica direttamente il JSON bloccato; fare clic su Salva per applicare |

### Comportamento in Modalità Test

Quando si esegue un workflow in modalità test, i nodi con `pinnedData` saltano l'esecuzione e utilizzano l'output bloccato. Utilizzare questa funzionalità per:

- Testare la logica a valle senza chiamare API esterne
- Eseguire il debug delle espressioni che fanno riferimento all'output del nodo
- Iterare su prompt o condizioni con dati di esempio fissi

Il completamento delle espressioni nell'editor utilizza i dati bloccati, quando disponibili, per suggerire i campi.

## Log di Esecuzione

Il **Pannello di Debug** (cassetto inferiore) mostra i log di esecuzione in tempo reale durante le esecuzioni del workflow. È inoltre possibile aprire un'esecuzione di produzione in corso dalla finestra Cronologia o da una scheda della Board. L'editor si collega al flusso SSE di quell'esecuzione, ripristina i risultati dei nodi completati e continua a mostrare le animazioni dei nodi e i log man mano che nuovi nodi vengono avviati e completati.

### Cosa mostra

- **Risultati dei nodi** – Stato per nodo (`success`, `error`, `skipped`, `running`), tempo di esecuzione e output
- **Output finali** – Output aggregati dai nodi [Output](../nodes/output-node.md)
- **Avanzamento dell'Agent** – Per i nodi [Agent](../nodes/agent-node.md), chiamate agli strumenti passo dopo passo e ragionamento

### Azioni

- **Copia come JSON** – Copia il log di esecuzione completo negli appunti
- **Apri nell'editor JSON** – Apre il log in JSON Hero o JSON Editor Online per l'ispezione
- **Scarica i file generati** – Se una skill ha prodotto file scaricabili (`_generated_files`), appare un pulsante Scarica. Un singolo file viene scaricato direttamente; più file aprono un popup di selezione.

### Distinzione dalla Scheda Logs

Il Pannello di Debug mostra i log di **esecuzione del workflow** (risultati dei nodi, output). La [Scheda Logs](../tabs/logs-tab.md) mostra i log dei **container Docker** (backend, frontend, database). <!-- pragma: allowlist secret -->

## Abilita / Disabilita

È possibile disabilitare i nodi in modo che vengano saltati durante l'esecuzione. I nodi disabilitati mostrano un badge "off" e appaiono in grigio.

### Come attivare/disattivare

| Metodo | Descrizione |
|--------|-------------|
| **Pannello delle proprietà** | Selezionare il nodo → Icona di accensione (in alto a destra) |
| **Menu contestuale** | Fare clic con il tasto destro sul/i nodo/i → Disabilita o Abilita |
| **Tastiera** | Selezionare il/i nodo/i → premere **D** (vedere [Scorciatoie da Tastiera](./keyboard-shortcuts.md)) |

### Selezione Multipla

Quando sono selezionati più nodi, Abilita/Disabilita si applica a tutti. Il menu contestuale mostra "Abilita" se almeno un nodo selezionato è disabilitato, "Disabilita" se tutti sono abilitati.

### Comportamento a Runtime

I nodi con `active: false` vengono saltati. I nodi a valle non ricevono dati dai nodi saltati. Utilizzare questa funzionalità per escludere temporaneamente dei nodi senza eliminarli.

Per attivare o disattivare un nodo dall'interno di un workflow anziché manualmente, utilizzare [Disable Node](../nodes/disable-node.md) e [Enable Node](../nodes/enable-node.md).

## Grafo della memoria dell'Agent

I nodi [Agent](../nodes/agent-node.md) con **[memoria persistente](./agent-persistent-memory.md)** abilitata mostrano un controllo **cervello** rosa sul nodo. Fare clic su di esso per aprire l'editor del grafo della memoria: le entità vengono visualizzate come un grafo animato a forza direzionale, raggruppate per tipo di entità, con selettori ricercabili Source/Target per aggiungere relazioni e un pannello delle connessioni per saltare tra entità collegate. Lo stesso dialogo include **Share memory with other agents** (workflow → agent → read o read/write) per la [condivisione della memoria tra agent](./agent-persistent-memory.md#sharing-with-other-agents). Mentre il dialogo è aperto, l'undo/redo del canvas principale viene posticipato, in modo che la modifica del grafo mantenga la propria cronologia.

**Filtraggio del grafo.** In alto a sinistra del canvas è presente un controllo di ricerca, compresso in un pulsante di scelta rapida finché non si fa clic su di esso o non si preme **Ctrl/Cmd+F**. Corrisponde al nome di un'entità, al suo tipo e a ogni chiave e valore degli attributi, nonché al tipo di una relazione (`parent_of`) e alle sue proprietà; una relazione corrispondente porta con sé entrambe le sue entità. Tutti i termini separati da spazi devono corrispondere. Un'entità corrispondente porta con sé l'intero suo vicinato — ogni relazione a cui partecipa e l'entità all'altro capo di ciascuna — così una corrispondenza non rimane mai come un punto non connesso. Una relazione corrispondente porta solo le due entità che collega e si ferma lì, poiché cercare un tipo di relazione è una domanda su quella relazione e non su tutto ciò a cui sono collegati i suoi estremi. Tutto il resto viene nascosto del tutto — non attenuato — sul canvas e nell'elenco **All edges**, e un badge mostra quante entità totali rimangono. La **✕** all'interno del campo cancella prima la query, poi chiude il campo alla seconda pressione. Escape annulla nello stesso modo, dall'interno verso l'esterno: cancella la query, poi chiude il campo di ricerca, poi esce dalla vista canvas espansa, e chiude il dialogo solo quando nessuno di questi è aperto. La cancellazione ripristina il grafo completo con ogni entità di nuovo dove era.

**Posizionamento manuale delle entità.** Trascinare un'entità la fissa dove viene rilasciata, così il layout automatico dispone il resto del grafo attorno ad essa invece di riportarla indietro. Trascinare l'entità selezionata sposta con sé le entità direttamente collegate, mantenendo la forma del cluster; trascinare qualsiasi altra entità sposta solo quella. **Tidy layout** (il pulsante con la bacchetta) rilascia ogni entità fissata e riesegue il layout automatico.

## Extract to Sub-Workflow

Converte i nodi selezionati in un sub-workflow riutilizzabile e li sostituisce con un nodo [Execute](../nodes/execute-node.md).

### How to Use

1. Selezionare uno o più nodi sul canvas
2. Fare clic con il tasto destro → **Extract to Sub-Workflow**
3. Inserire un nome (e una descrizione opzionale) per il nuovo workflow
4. Fare clic su **Extract**

### What Happens

- Viene creato un nuovo workflow con i nodi selezionati
- Gli input esterni (edge provenienti dall'esterno della selezione) diventano i campi [Input](../nodes/input-node.md) del sub-workflow
- Gli output esterni (edge verso nodi esterni alla selezione) vengono mappati sull'[Output](../nodes/output-node.md) del sub-workflow
- I nodi selezionati vengono sostituiti con un singolo nodo [Execute](../nodes/execute-node.md) che richiama il nuovo workflow
- Le mappature di input/output vengono preservate automaticamente

### Use Cases

- Riutilizzare una sequenza di nodi in più workflow
- Semplificare un workflow complesso raggruppando logica correlata
- Creare sub-workflow modulari e testabili

## Run with cURL

Il pulsante **cURL** nella barra degli strumenti dell'editor (in alto a destra) apre un dialogo per costruire e copiare un comando cURL per attivare il workflow tramite API.

- Scegliere la modalità del corpo della richiesta del workflow (`Defined` o `Generic`)
- Impostare il tipo di autenticazione (Anonymous, JWT o Header Auth)
- Configurare la cache delle risposte e il rate limiting
- Attivare/disattivare lo streaming SSE e personalizzare i messaggi di avvio per nodo
- Modificare il corpo della richiesta
- In modalità Generic, il pannello di esecuzione del canvas utilizza lo stesso corpo JSON grezzo del dialogo cURL
- Fare clic su **Copy cURL** per copiare il comando pronto all'esecuzione

Consultare [Webhooks](./webhooks.md#run-with-curl-dialog) per i dettagli completi del dialogo e [SSE Streaming](./sse-streaming.md) per il protocollo degli eventi.

## Related

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Tutte le scorciatoie del canvas e dell'editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportamento e API del grafo della memoria
- [Execute Node](../nodes/execute-node.md) – Richiama i sub-workflow
- [Expression DSL](./expression-dsl.md) – Riferimenti e dati fissati
- [Workflow Structure](./workflow-structure.md) – Formato di nodi ed edge
- [Download & Import](./download-import.md) – Esportazione e importazione di workflow come JSON
- [Node Types](./node-types.md) – Tutti i tipi di nodo
- [Logs Tab](../tabs/logs-tab.md) – Log dei container Docker
- [Execution History](./execution-history.md) – Esecuzioni passate
- [Templates](../tabs/templates-tab.md) – Salvare e riutilizzare workflow e nodi
- [Contextual Showcase](./contextual-showcase.md) – Guida compatta della pagina disponibile nell'editor

- [Collaborazione sul Canvas](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.

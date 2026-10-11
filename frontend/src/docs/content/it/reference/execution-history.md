# Cronologia delle esecuzioni

La cronologia delle esecuzioni registra le esecuzioni dei workflow: input, output, risultati dei nodi, stato e origine del trigger. Utilizzarla per monitorare un'esecuzione attiva in produzione, ispezionare esecuzioni passate, effettuare il debug degli errori o rieseguire con gli stessi input tramite **Bring to Canvas**.

## Panoramica

Ogni esecuzione memorizza:

| Campo | Descrizione |
|-------|-------------|
| **Inputs** | Corpo della richiesta o input di esecuzione (ad es. `text` per il Nodo Input) |
| **Outputs** | Output a livello di workflow |
| **Node results** | Output per nodo, stato e tempo di esecuzione |
| **Status** | `success`, `error`, `pending`, `skipped` o `failed` (vedere [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Modalità di attivazione dell'esecuzione (vedere [Triggers](./triggers.md)) |

## Accesso alla cronologia

| Posizione | Ambito |
|----------|-------|
| Barra degli strumenti dell'**Editor** | Solo il workflow corrente |
| Intestazione della vista **Docs** | Solo il workflow corrente |
| Intestazione della **Dashboard** (scheda Chat) | Tutti i workflow + esecuzioni chat/assistant |
| Intestazione della vista **Evals** | Tutti i workflow + esecuzioni chat/assistant |

Fare clic sul pulsante **History** (icona orologio) per aprire la finestra di dialogo.

## Cronologia per workflow vs cronologia completa

- **Per workflow** (Editor, Docs): mostra le esecuzioni del workflow attualmente aperto. Utilizzare **Clear history** per rimuovere le esecuzioni solo di quel workflow.
- **All History** (Dashboard, Evals): mostra le esecuzioni di tutti i workflow e delle sessioni chat/assistant. La copertura corrisponde all'accesso ai workflow: workflow di proprietà, workflow condivisi direttamente e workflow condivisi con un team di appartenenza. Utilizzare **Clear all history** per rimuovere tutti i record di proprietà. La cronologia dei workflow condivisi verrà conservata.

## Bring to Canvas

**Bring to Canvas** carica gli input e gli output dei nodi di un'esecuzione selezionata nel workflow corrente.

### Cosa viene caricato

- **Inputs** → Pannello degli input di esecuzione (ad es. `text` per il Nodo Input, o campi personalizzati)
- **Node results** → Il pannello dei risultati di esecuzione mostra gli output passati per ciascun nodo
- **Execution result** → Stato, output e tempistiche dell'esecuzione

### Comportamento in base al contesto

- **Nell'Editor** (cronologia per workflow): viene applicato immediatamente al workflow aperto e chiude la finestra di dialogo.
- **Da All History** (Dashboard/Evals): naviga all'editor del workflow, quindi applica i dati al caricamento dell'editor. Disponibile solo per le esecuzioni dei workflow, non per le esecuzioni chat/assistant.

### Deep link di esecuzione

Aprendo un workflow all'indirizzo `/workflows/{workflowId}/{executionId}` si porta automaticamente quell'esecuzione sul canvas, esattamente come selezionare l'esecuzione e scegliere **Bring to Canvas**. In questo modo una specifica esecuzione passata diventa condivisibile come URL. Se l'esecuzione non viene trovata (id errato o eliminato), l'editor torna a caricare il workflow semplice.

### Casi d'uso

- Rieseguire un workflow con gli stessi input
- Effettuare il debug di un'esecuzione fallita ispezionando input e output dei nodi
- Confrontare gli output tra diverse esecuzioni

## Execution Highlights

Dopo un'esecuzione live — o dopo **Bring to Canvas** — appare un popup **Execution Highlights** chiudibile nella **parte superiore destra del Canvas**. È un modo rapido per vedere *cosa ha prodotto ciascun nodo*, elencato dall'alto verso il basso nell'ordine di esecuzione. Chiuderlo con la **✕**; si riaprirà all'esecuzione successiva.

### Cosa viene mostrato

| Record | Origine | Automatico? |
|--------|--------|-------|
| **Input** | I parametri di input dell'esecuzione (nodo input/trigger) | Sì |
| **Output** | Il risultato del nodo di output — oppure, se assente, il messaggio dell'ultimo nodo | Sì |
| **Agent / LLM** | L'output di ciascun nodo agent o LLM | Sì |
| **Output** | Qualsiasi altro nodo con **Highlight Node Output** abilitato | Opt-in |

I nodi già evidenziati automaticamente (input / output / last / agent / llm) non appaiono mai due volte, anche se si abilita anche l'interruttore.

### Ciascun record

- Mostra `Node — message…` con i primi **250 caratteri**; fare clic su una riga per espanderla e visualizzare il **messaggio completo come Markdown**, con un pulsante **Copy**.
- Un nodo eseguito più volte (ad es. all'interno di un loop) mostra `Node (N)` con un selettore `‹ i / N ›` — selezionare l'esecuzione da visualizzare; il selettore di ciascun nodo è indipendente.

### Highlight Node Output

Ogni nodo **tranne Agent e LLM** dispone di una casella di controllo **Highlight Node Output** nel proprio pannello delle proprietà (disattivata per impostazione predefinita). Abilitarla per aggiungere l'output di quel nodo al popup. Sul canvas appare un piccolo badge ✦ sui nodi evidenziati. Nel [workflow DSL](./expression-dsl.md) questo corrisponde al campo dati del nodo `"highlight": true` (valore predefinito `false`).

### Nelle dashboard

Le card dei widget della dashboard che hanno eseguito un workflow mostrano un pulsante ✦ **Execution highlights** nell'intestazione della card; fare clic per aprire lo stesso popup per l'esecuzione di quel widget, con l'output disegnato dal widget come record in evidenza.

## Esecuzioni in corso

Entrambe le finestre di dialogo della cronologia mostrano le **esecuzioni attualmente in corso** in cima all'elenco, prima delle esecuzioni passate.

- Un indicatore rotante e l'etichetta **Running** compaiono insieme all'ora di avvio
- Fare clic su **Open live** per collegare l'editor a quella specifica esecuzione senza riavviarla
- Il canvas ripristina prima i nodi già completati, poi riceve gli eventi
  `node_start`, `node_complete` e di esecuzione finale tramite SSE
- Il nodo corrente pulsa sul canvas, i nodi a valle mantengono la loro animazione in attesa e
  il pannello Debug aggiunge ogni risultato man mano che arriva, esattamente come per un'esecuzione avviata dall'editor
- Fare clic su **Cancel** per interrompere immediatamente l'esecuzione
- L'annullamento da qualsiasi finestra di dialogo (Editor o Dashboard) chiude anche lo stream SSE attivo in qualsiasi scheda del canvas aperta per quel workflow, così lo stato dell'editor si reimposta correttamente
- Dopo l'annullamento, la voce in esecuzione scompare al successivo aggiornamento; premere **Refresh** per aggiornare manualmente l'elenco
- Se si annulla un'esecuzione già conclusa, la richiesta non produce alcun effetto

L'URL live è `/workflows/{workflowId}/{executionId}`. L'osservatore è in sola lettura: uscire
dall'editor disconnette solo quella scheda del browser e non interrompe mai il workflow. Gli snapshot
attivi sono condivisi tramite PostgreSQL, quindi l'apertura di un'esecuzione funziona anche quando il trigger e la richiesta
dell'editor arrivano su worker backend diversi.

## Ripristino dopo un crash

Se il server si riavvia (deploy, riavvio del container o crash) mentre un workflow è in esecuzione, il worker di quell'esecuzione si interrompe a metà. Heym ripristina automaticamente queste esecuzioni interrotte invece di lasciarle bloccate come **Running**.

- Al successivo avvio, il processo leader eletto rileva le esecuzioni orfane — istantaneamente in caso di riavvio controllato, oppure entro ~60 secondi in caso di crash improvviso (una volta che gli heartbeat si arrestano chiaramente).
- Le esecuzioni ripristinate vengono **rieseguite da zero con gli stessi input** (non riprese dal punto in cui si erano fermate), utilizzando la definizione corrente del workflow. Al completamento registrano una normale voce terminale (ad es. `success`), così la cronologia mostra l'esecuzione come completata.
- Un'esecuzione viene ritentata **una sola volta**. Se anche il tentativo di ripristino viene interrotto — o il workflow è stato nel frattempo eliminato — la voce viene registrata come `failed`.
- Questo funziona allo stesso modo su un singolo container e su deployment multi-worker; solo il leader esegue il ripristino, quindi un'esecuzione non viene mai ripristinata due volte da worker diversi.

### Interruttore Auto-recover

Il pannello **Execution Log** (esecuzione) dell'editor presenta una casella di controllo **Auto-recover**, **attiva per impostazione predefinita** per ogni workflow.

- **On**: le esecuzioni interrotte di questo workflow vengono rieseguite come descritto sopra.
- **Off**: le esecuzioni interrotte non vengono rieseguite e sono registrate con stato `skipped`.

> Le esecuzioni dei sub-workflow non vengono ripristinate in modo indipendente — sono riavviate dall'esecuzione padre ripristinata. I trigger con una propria ridistribuzione (RabbitMQ, pianificato/cron, IMAP) possono anche ridistribuire al riavvio, quindi un'esecuzione ripristinata può occasionalmente essere eseguita due volte.

## Revisione umana in attesa

Le esecuzioni che si mettono in pausa per l'approvazione [Human-in-the-Loop](./human-in-the-loop.md) vengono scritte nella cronologia immediatamente con stato `pending`.

- Il nodo agent in attesa memorizza un payload di revisione che include `reviewUrl`, `draftText` e `expiresAt`
- Anche i nodi collegati all'handle `review` dell'agent possono essere eseguiti prima che l'utente risponda, e i loro risultati vengono memorizzati nella stessa voce di cronologia in attesa
- Le finestre di dialogo della cronologia mostrano il link di revisione, così i proprietari possono copiarlo o aprirlo
- Le finestre di dialogo della cronologia e il pannello Debug dell'editor mostrano la decisione umana finale dopo la ripresa dell'esecuzione
- Quando un revisore accetta, modifica o rifiuta la bozza, la stessa voce di cronologia viene aggiornata con il risultato finale dell'esecuzione
- Se la stessa esecuzione si mette in pausa per HITL più di una volta, la voce di cronologia rimane la stessa mentre ogni checkpoint riceve il proprio link di revisione monouso

Questo è particolarmente utile per le esecuzioni da portale e per i workflow di lunga durata che possono attendere ore o giorni prima di proseguire.

## Copia

Usare **Copy** accanto a Inputs o Outputs per copiare il JSON negli appunti.

## Cancellazione della cronologia

- **Per workflow**: nella finestra di dialogo della cronologia dell'Editor, fare clic su **Clear history** per rimuovere le esecuzioni del workflow corrente.
- **Tutta la cronologia**: nella finestra di dialogo della cronologia della Dashboard/Evals, fare clic su **Clear all history** per rimuovere tutti i record di esecuzione di propria proprietà. Le esecuzioni dei workflow condivisi vengono conservate. Questa azione non può essere annullata.

## Dettagli della timeline di esecuzione

Quando l'**Execution Log** dell'editor è aperto, fare clic sul pulsante del timer per mostrare la timeline di esecuzione. Selezionare uno span per aprire un inspector dei dettagli inline che occupa l'area delle righe. Mostra lo stato del passaggio selezionato, la durata, il numero di tentativi, le informazioni sui retry, gli errori, il trace ID e un'anteprima compatta dell'output. Gli output di tipo oggetto e array utilizzano lo stesso visualizzatore `JsonTree` del resto del pannello Debug; i valori scalari utilizzano un'anteprima testuale. Quando un passaggio produce immagini (screenshot di Playwright, immagini generate, file immagine), queste appaiono come miniature sopra l'output, e il JSON mostra un breve segnaposto al posto del base64 grezzo. Fare clic su una miniatura per aprirla in un lightbox; i pulsanti freccia o i tasti ←/→ scorrono tutte le immagini dell'esecuzione, con un contatore come `2 / 5`. Usare **Open trace** per gli span LLM e Agent quando è disponibile un trace ID.

## Dettaglio del nodo su mobile

Su un telefono, l'editor mostra un albero del workflow a schermo intero anziché il canvas libero. Toccare un nodo dell'albero con un risultato registrato per aprirne l'esecuzione come dettaglio a schermo intero. La vista fornisce schede separate **Input Data**, **Output Data** ed **Errors**. La scheda dell'output mostra il risultato registrato e offre **Copy Output**; la scheda dell'input mostra la configurazione del nodo selezionato, mentre la scheda degli errori mostra l'errore registrato quando il nodo ha avuto esito negativo. Utilizzare **Back to workflow** o il pulsante di chiusura per tornare all'albero.

Il canvas e le finestre di dialogo della cronologia della dashboard mantengono i controlli di esecuzione su una sola riga e collocano i filtri disponibili per tag e istanza in una griglia responsive. I relativi menu dei filtri utilizzano lo stesso selettore in-app, così il segno di spunta selezionato presenta un margine e una linea di base coerenti con ogni etichetta di opzione.

## Correlati

- [Trigger](./triggers.md) – Come vengono avviati i workflow; la cronologia registra `trigger_source` (incluso `board` per le esecuzioni avviate dagli spostamenti delle card di [Board](../tabs/board-tab.md) e dai follow-up)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL di revisione in sospeso e comportamento di ripresa
- [Cronologia modifiche](./edit-history.md) – Controllo di versione per i salvataggi dei workflow (ripristino, diff)
- [Avvio rapido](../getting-started/quick-start.md) – Creare ed eseguire il primo workflow
- [Scheda Workflows](../tabs/workflows-tab.md) – Creare e gestire i workflow

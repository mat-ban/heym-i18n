# Dashboard

La scheda **Dashboard** è uno spazio in stile Grafana in cui è possibile costruire griglie di widget grafici. Ogni widget viene renderizzato a partire dall'output del proprio workflow Heym nascosto, pertanto qualsiasi dato producibile in un workflow — query al database, chiamate API, ricerche RAG, output LLM — può diventare un grafico. È possibile mantenere più dashboard e condividerle con persone o team.

## Dashboard

Ogni utente inizia con una dashboard, creata la prima volta che apre la scheda. Utilizzare il selettore di dashboard nella parte superiore della scheda per passare da una dashboard all'altra, e **+** accanto ad esso per crearne una nuova. Il selettore elenca prima le dashboard personali, poi quelle condivise, etichettate con il nome della persona che le ha condivise.

La scheda riapre l'ultima dashboard utilizzata e la barra degli indirizzi riporta la dashboard aperta (`?tab=dashboard&dashboard=<id>`), pertanto un link apre quella specifica dashboard per chiunque vi abbia accesso.

Il pulsante delle impostazioni (solo per i proprietari) consente di rinominare la dashboard, impostare quali record accetta come [pagina di dettaglio](#detail-pages), gestirne la condivisione ed eliminarla. L'eliminazione di una dashboard rimuove i suoi widget e i relativi workflow. Si mantiene sempre almeno una dashboard personale, pertanto l'ultima non può essere eliminata.

## Widget

Un widget è un singolo grafico sulla griglia. Tipi di grafico supportati:

- **Bar** (verticale o orizzontale)
- **Line**
- **Area** (trend riempito, supporta serie multiple)
- **Pie**
- **Table** (scorrevole; faccia clic sull'intestazione di una colonna per ordinare in senso crescente e di nuovo per ordinare in senso decrescente. Una colonna può essere visualizzata come [chip di stato](../nodes/chart-output-node.md#status-chips), una colonna può contenere [pulsanti di collegamento](../nodes/chart-output-node.md#link-buttons) che aprono un URL in una nuova scheda, e le righe possono aprire una [pagina di dettaglio](#pagine-di-dettaglio))
- **Numeric** (un singolo valore KPI con unità opzionale)
- **Gauge** (un singolo valore rispetto a un intervallo min–max, ad esempio una percentuale)
- **Scatter** (punti X/Y per grafici di correlazione)
- **Proportion** (una barra suddivisa in quote con legenda percentuale, ad esempio una ripartizione per lingua)
- **Gantt** (date delle attività, completamento e dipendenze)
- **Entity relationships (DB)** (tabelle, campi, chiavi PK/FK e collegamenti)
- **Bar gauge** (un indicatore orizzontale per riga con gradiente dal rosso al verde e un valore, ad esempio lo spazio su disco libero)
- **Text** (un messaggio markdown, ad esempio una nota di stato come "Ultima esecuzione alle 19:47"; supporta [caselle di controllo interattive](../nodes/chart-output-node.md#interactive-task-lists) quando il markdown è statico, ed [elenchi numerati espliciti](../nodes/chart-output-node.md#numbered-lists) per numerazioni personalizzate o decrescenti)
- **HITL** (le revisioni umane in sospeso. L'intestazione mostra `1/n pending`. Il nome del workflow apre quella esecuzione sul canvas. **Approve**, **Request changes** e **Reject** la risolvono. L'icona della cronologia accanto al titolo del widget apre quella esecuzione nella finestra di dialogo della cronologia su questa pagina. Il widget non utilizza le righe a monte e ogni persona vede la propria coda. Può invece mostrare le revisioni di un solo Workflow, per tutti coloro che possono aprire quel Workflow; vedere [Widget HITL](#widget-hitl))

Oltre ai grafici, un widget **Run a workflow** esegue uno dei vostri workflow dalla dashboard: su un file trascinato, con i relativi campi di input o tramite un pulsante Run; vedere [Widget di esecuzione](#run-widgets).

Ogni widget carica i propri dati in modo asincrono all'apertura della scheda, pertanto la pagina rimane reattiva mentre i grafici si popolano.

## Aggiunta di un widget

1. Fare clic su **Add widget**, assegnare un titolo e scegliere un tipo di grafico. Sotto il selettore, la finestra di dialogo mostra un esempio di quel tipo di grafico con dati campione e indica le righe attese, così da poter confrontare i tipi prima di costruire qualsiasi cosa.
2. Il widget si apre nell'editor dei workflow con un grafo iniziale: un nodo [Set](../nodes/set-node.md) che produce le righe, collegato a un nodo [Chart Output](../nodes/chart-output-node.md). Sostituire il nodo Set con qualsiasi origine dati. Un widget **HITL** è costituito solo dal nodo Chart Output; legge le revisioni in sospeso e non necessita di un'origine dati.
3. Costruire il workflow in modo che il nodo che alimenta **Chart Output** produca un array di righe, quindi configurare la mappatura dei campi del nodo Chart Output (campo etichetta, campo valore, ecc.).
4. Salvare, tornare alla scheda Dashboard e il widget viene renderizzato.

Per un widget **Run a workflow**, selezionare invece il workflow da eseguire; il selettore indica in che modo il widget eseguirà ciascuno di essi. Il widget viene aggiunto direttamente alla griglia; non c'è alcun nuovo workflow da costruire.

Fare doppio clic su un widget (o utilizzare il suo pulsante di modifica) per riaprire il relativo workflow in qualsiasi momento. Utilizzare **Clone widget** nell'intestazione del widget per duplicare sia il widget sia il suo workflow completo. La copia viene posizionata sotto l'originale ed etichettata con **(Copy)**, così da poterla modificare in modo indipendente.

## Widget HITL

Un nuovo widget HITL mostra ogni revisione in attesa nella sua coda personale. Per mostrare solo quelle di un Workflow, apra le **Impostazioni** del widget :

1. Sotto **Workflow**, scelga il Workflow. L'elenco contiene i Workflow che può aprire, suoi o condivisi con lei o con il suo team, che hanno un passaggio in attesa di una persona: un Agent con revisione umana, oppure un passaggio Slack di approvazione, pulsanti o modulo. L'icona accanto apre quel Workflow in una nuova scheda.
2. Se il Workflow ha un solo passaggio di questo tipo, viene selezionato automaticamente. Se ne ha diversi, **Select agent** li elenca per nome del nodo, con **All agents** per primo; i passaggi Slack sono contrassegnati con **(Slack)**.
3. Salvi. Il `1/n pending` nell'intestazione conta solo quelle revisioni. Scelga **Tutti i workflow** per mostrare di nuovo la sua coda personale.

La stessa scelta è disponibile sul canvas, nelle proprietà del nodo Chart Output. **Ottimizza con l'IA** può effettuarla («mostra solo le approvazioni delle fatture»), così come la descrizione di un nuovo widget che nomina il Workflow. Ogni modifica è una modifica del Workflow, quindi compare nella Edit History.

- **Chi vede le revisioni.** Un widget filtrato su un Workflow mostra le revisioni di quel Workflow a tutti coloro che possono aprire il Workflow, e questi possono approvare, richiedere modifiche o rifiutare da lì, come potrebbero eseguire il Workflow. Un widget non filtrato mostra a ciascuno la propria coda.
- **Chi vede il widget.** Chi non può aprire il Workflow scelto non vede affatto il widget, nemmeno su una dashboard condivisa con lui. Quando il proprietario della dashboard perde l'accesso al Workflow, o questo viene eliminato, il proprietario vede «You no longer have access to the workflow this widget shows» e può sceglierne un altro nelle **Impostazioni**.
- **Solo scelte raggiungibili.** Un Workflow che non può aprire viene rifiutato al salvataggio del widget, sia dalle impostazioni, sia dal canvas, sia dall'IA.

## Pagine di dettaglio

Un widget tabella può collegare le proprie righe a un'altra dashboard, che funge così da pagina di dettaglio: un'unica dashboard al servizio di ogni cliente, fattura o ticket.

1. Aprire le **Settings** del widget tabella e selezionare la dashboard sotto **Row link**.
2. Inserire la **Record column**, ovvero la colonna il cui valore identifica la riga (ad esempio `id`), e facoltativamente una **Label column** che la denomina (ad esempio `name`).
3. Salvare. Facendo clic su una riga (o selezionandola e premendo Invio) si apre la dashboard collegata con `?record=<value>&label=<name>`.

Sulla dashboard di dettaglio, ogni workflow del widget legge il valore come `$page.record` (vedere [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), e la pagina mostra `Dashboard / <label>` sopra la griglia con un pulsante per cancellare il record. Indietro riporta alla tabella di provenienza.

- **Chi può aprirla.** Le righe sono cliccabili solo per gli utenti che possono aprire la dashboard collegata. Gli altri vedono la stessa tabella senza link.
- **Formato del record.** Il record proviene dall'URL, quindi la dashboard di dettaglio decide cosa accettare. Nelle sue impostazioni, **Detail page records** è uno tra: ID (lettere, cifre, `-`, `_` e `.`, fino a 128 caratteri; impostazione predefinita), numeri, UUID o indirizzi e-mail. Qualsiasi altro valore viene rifiutato prima dell'esecuzione del widget e i widget mostrano "This page does not accept that record".
- **Sempre eseguito come proprietario.** Anche su una pagina di dettaglio i widget vengono eseguiti con l'account del proprietario della dashboard. I creatori dovrebbero passare `$page.record` solo dove un nodo ne esegue l'escape, mai direttamente nel testo di una query.
- **Caching.** Ogni widget memorizza nella cache il proprio grafico per record, con lo stesso time-to-live (TTL) del widget, e conserva i 50 record utilizzati più di recente.

## Widget di esecuzione

Un widget **Run a workflow** esegue uno dei vostri workflow e ne mostra il risultato: stato, tempo di esecuzione e output. Ciò che mostra dipende dagli input richiesti dal workflow:

- **Un file.** Per un workflow che inizia con un [File Upload Trigger](../nodes/file-upload-trigger-node.md), trascinare un file su di esso (o fare clic per sceglierne uno) e il widget lo caricherà tramite il link di caricamento monouso del trigger. Il widget mostra i tipi e le dimensioni di file accettati dal trigger e rifiuta gli altri prima del caricamento. Quando il workflow inizia anche con un nodo Text Input, il widget mostra i relativi campi accanto all'area di rilascio: scegliere un file, compilare i campi e **Run** invierà entrambi. I valori viaggiano insieme al link di caricamento generato dal widget, pertanto un link di caricamento condiviso non può impostarli.
- **Campi di input.** Per un workflow che inizia con un nodo Text Input, il widget mostra i relativi campi con i valori predefiniti; **Run** esegue il workflow con i valori inseriti. I valori per i campi non presenti nel workflow vengono ignorati.
- **Nessun input.** Un workflow senza input mostra un pulsante **Run**.

Il pulsante **Wrap** del risultato manda a capo le righe di output lunghe all'interno del riquadro; disattivarlo per leggere il layout JSON dell'output.

- Chiunque possa aprire la dashboard può eseguire il widget, proprio come chiunque può aggiornare un grafico. L'accesso al workflow dipende dal proprietario della dashboard: per aggiungere il widget serve un workflow che sia voi sia il proprietario possiate eseguire, e l'esecuzione stessa utilizza le credenziali del proprietario del workflow, come qualsiasi link di caricamento.
- Il risultato rimane sullo schermo finché non si lascia la pagina; gli altri visualizzatori non vedono i vostri file, valori o risultati. L'esecuzione appare nella cronologia delle esecuzioni con il trigger `dashboard`.
- La condivisione di una dashboard non concede mai l'accesso al workflow stesso. **Edit workflow** lo apre per le persone che hanno già accesso, mentre **Fine-tune with AI** non è disponibile.
- Le esecuzioni basate su file vengono eseguite sull'istanza principale, dove sono archiviati i file caricati, come avviene per ogni esecuzione di File Upload Trigger.

## Generazione di un widget con l'IA

Fare clic su **AI**, descrivere la metrica desiderata (ad esempio, "tasso di successo dei workflow negli ultimi 30 giorni come grafico a barre") e scegliere una credenziale LLM e un modello. Heym genera un workflow completo per il widget che termina con un nodo Chart Output e lo aggiunge alla griglia. Consultare [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) per esempi di prompt per ciascun tipo di grafico.

Il widget riceve un titolo breve di una o due parole nella lingua della sua richiesta, ad esempio «Casi aperti». Un titolo non contiene mai l'id di una tabella dati; quando il modello assegna al widget un nome sotto forma di frase, Heym ne conserva le prime parole.

L'API dei widget può anche creare una **scheda di conteggio** senza IA: un widget `text` su una tabella dati (`data_table_id`) con `count_column` e `count_value` mostra quante righe hanno quel valore; il titolo del widget indica il valore. Heym Work apre le pagine create da una tabella dati con una scheda di conteggio per stato.

Utilizzare il pulsante **Fine-tune with AI** di un widget per rivedere un widget esistente con una nuova istruzione. Ogni fine-tune con IA salva un'istantanea del workflow precedente nella **Edit History** del widget, così da poter rivedere o ripristinare le modifiche dall'editor dei workflow.

## Da Chat e MCP

[Chat](./chat-tab.md), e i client MCP tramite lo strumento [`heym_chat`](./mcp-tab.md), possono leggere le dashboard, aggiungere widget, rinominarli o eliminarli e riordinare il layout di una dashboard. Heym Work mostra ogni dashboard come una pagina, quindi le stesse risposte coprono anche le sue pagine.

- **Quali dashboard sono presenti e cosa contengono.** Chiedere "quali dashboard ho?", "cosa c'è nella dashboard Vendite?" o "su quale dashboard si trova il workflow delle entrate?". Chat elenca le proprie dashboard e quelle condivise con l'utente, con i relativi permessi di accesso e un link per ciascuna, oltre a ogni widget presente: titolo, tipo di grafico e il workflow sottostante. Un [widget HITL](#hitl-widgets) filtrato su un workflow che non si ha il permesso di aprire rimane nascosto, esattamente come nella dashboard stessa.
- **Un nuovo widget.** Chiedere "aggiungi un grafico dei casi aperti per stato alla dashboard Vendite". Chat posiziona prima un widget vuoto sulla dashboard, quindi scrive il workflow specifico del widget, esegue esecuzioni di test e corregge eventuali errori fino a quando un'esecuzione ha successo, nello stesso modo in cui [crea workflows](./chat-tab.md#creazione-di-workflows). Non viene lasciato alcun workflow separato e ogni salvataggio compare nella Edit History del widget. Il titolo e il tipo di grafico del widget seguono ciò che Chat salva.
- **Un workflow esistente.** Chiedere "inserisci il workflow delle entrate nella dashboard Vendite". Un workflow che termina con un nodo Chart Output diventa un widget grafico con una propria copia del workflow, pertanto modifiche successive al widget non alterano mai l'originale. Un workflow con un nodo trigger o input non può diventare un widget grafico. Qualsiasi altro workflow diventa un [widget di esecuzione](#run-widgets), che necessita anch'esso di un workflow eseguibile dal proprietario della dashboard.
- **Rinominare o eliminare un widget.** Chiedere "rinomina il widget Entrate in Vendite" o "elimina il widget Casi aperti". Anche il workflow di un widget grafico prende il nuovo nome; il workflow di un widget di esecuzione mantiene il proprio. L'eliminazione di un widget grafico elimina anche il relativo workflow, esattamente come fa il pulsante di eliminazione del widget; il workflow di un widget di esecuzione viene invece conservato. Chat elimina solo il widget espressamente richiesto e chiede conferma preventiva se le parole fornite corrispondono a più elementi.
- **Riordinare.** Chiedere "riordina la dashboard Vendite" o "aggiungi questi tre widget e riordina". Chat dispone i widget visibili nel loro ordine, come fa il pulsante **Riordina**: righe casuali da due o tre, quindi una nuova richiesta fornirà una disposizione differente. È possibile specificare un numero per riga ("tre per riga") per ottenere righe di quella dimensione. Questo sistema riordina la dashboard in Heym; Heym Work mantiene la propria disposizione specifica per ogni pagina, modificabile con il pulsante **Riordina** della pagina stessa.

I nuovi widget vengono posizionati sotto i widget esistenti della dashboard e, come ogni widget, vengono eseguiti nel contesto del proprietario della dashboard. L'aggiunta, la ridenominazione, l'eliminazione e il riordino richiedono l'accesso in scrittura alla dashboard. La creazione di un nuovo widget richiede una chat in grado di creare workflows: la scheda Chat, la Chat per redattori di Heym Work e `heym_chat`.

## Modifica del layout

Attivare **Edit** per entrare in modalità modifica, in cui è possibile trascinare i widget e ridimensionarli su una griglia a 12 colonne. Le modifiche al layout vengono salvate automaticamente. I titoli dei widget sono modificabili in linea dall'intestazione del widget.

## Caching e aggiornamento

Ogni widget memorizza nella cache l'ultimo dato calcolato sul server per un time-to-live (TTL) configurabile. Finché la cache è fresca, la riapertura della dashboard serve il risultato memorizzato invece di rieseguire il workflow. La cache viene sostituita sul posto ogni volta che i dati vengono ricalcolati (una cache per widget, più una per record su una [pagina di dettaglio](#detail-pages)) e viene invalidata automaticamente quando si modifica il workflow del widget.

Utilizzare il pulsante **Refresh** di un widget (o **Refresh** nella barra degli strumenti) per aggirare la cache e ricalcolare immediatamente.

## Condivisione

I proprietari condividono una dashboard dalle sue impostazioni, con singoli utenti (tramite email) o con qualsiasi [team](teams-tab.md) a cui appartengono. Ogni condivisione è **Read** o **Write**; quando qualcuno ha sia una condivisione personale che una di team, si applica quella più forte.

| Azione | Proprietario | Write | Read |
|--------|:-----:|:-----:|:----:|
| Visualizzare i widget, aggiornarli, utilizzare l'aggiornamento automatico | ✓ | ✓ | ✓ |
| Aprire pagine di dettaglio, eseguire widget di esecuzione | ✓ | ✓ | ✓ |
| Aggiungere, clonare, eliminare, rinominare e ridimensionare i widget; generare e ottimizzare con l'IA; spuntare gli elementi delle checklist | ✓ | ✓ | |
| Aprire il workflow di un widget nell'editor | ✓ | ✓ | |
| Rinominare o eliminare la dashboard, impostare il formato del record, gestire la condivisione | ✓ | | |

**I widget vengono sempre eseguiti come il proprietario della dashboard.** Indipendentemente da chi stia osservando, un widget utilizza le credenziali e le variabili globali del proprietario, e le sue esecuzioni compaiono nella cronologia delle esecuzioni e nelle tracce del proprietario. I membri del team vedono quindi gli stessi dati senza accesso agli account sottostanti, e ogni visualizzatore condivide l'unico risultato in cache per widget. Anche i widget che un collaboratore con accesso in scrittura aggiunge o clona appartengono al proprietario.

Per questo motivo, **Write** comporta lo stesso livello di fiducia della condivisione di un workflow per la modifica: un collaboratore con accesso in scrittura può modificare ciò che viene eseguito con le proprie credenziali. Concederlo solo a persone a cui si consentirebbe di modificare i propri workflow. Un'esecuzione di test avviata da un collaboratore dall'editor del workflow utilizza le proprie credenziali, come per qualsiasi workflow condiviso; solo la dashboard stessa viene eseguita come il proprietario. **Read** non concede alcun accesso ai workflow dei widget, e i visualizzatori in sola lettura ricevono il grafico stesso ma non i dettagli di esecuzione per nodo sottostanti.

La rimozione di una condivisione, o la sua riduzione da write a read, ha effetto immediato.

## Correlati

- [Nodo Chart Output](../nodes/chart-output-node.md)
- [Scheda Analytics](analytics-tab.md) — metriche di esecuzione integrate (distinte dalle dashboard create dall'utente)

## Pianificazioni e diagrammi di database

Scegliere **Gantt** in Aggiungi widget per visualizzare le attività nel tempo con collegamenti di avanzamento e dipendenza, oppure **Entity relationships (DB)** per mappare tabelle, campi e le relative relazioni. Entrambi i tipi utilizzano il [nodo Chart Output](../nodes/chart-output-node.md#gantt-schedules) e sono disponibili anche nelle pagine di Heym Work. Quando Work suggerisce widget per una pianificazione o uno schema di database, genera anteprime basate sulle attività o entità proposte.

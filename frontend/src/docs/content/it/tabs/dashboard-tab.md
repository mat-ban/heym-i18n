# Dashboard

La scheda **Dashboard** è uno spazio in stile Grafana in cui è possibile costruire griglie di widget grafici. Ogni widget viene renderizzato a partire dall'output del proprio workflow Heym nascosto, pertanto qualsiasi dato producibile in un workflow — query al database, chiamate API, ricerche RAG, output LLM — può diventare un grafico. È possibile mantenere più dashboard e condividerle con persone o team.

## Dashboard

Ogni utente inizia con una dashboard, creata la prima volta che apre la scheda. Utilizzare il selettore di dashboard nella parte superiore della scheda per passare da una dashboard all'altra, e **+** accanto ad esso per crearne una nuova. Il selettore elenca prima le dashboard personali, poi quelle condivise, etichettate con il nome della persona che le ha condivise.

La scheda riapre l'ultima dashboard utilizzata e la barra degli indirizzi riporta la dashboard aperta (`?tab=dashboard&dashboard=<id>`), pertanto un link apre quella specifica dashboard per chiunque vi abbia accesso.

Il pulsante delle impostazioni (solo per i proprietari) consente di rinominare la dashboard, gestirne la condivisione ed eliminarla. L'eliminazione di una dashboard rimuove i suoi widget e i relativi workflow. Si mantiene sempre almeno una dashboard personale, pertanto l'ultima non può essere eliminata.

## Widget

Un widget è un singolo grafico sulla griglia. Tipi di grafico supportati:

- **Bar** (verticale o orizzontale)
- **Line**
- **Area** (trend riempito, supporta serie multiple)
- **Pie**
- **Table** (scorrevole)
- **Numeric** (un singolo valore KPI con unità opzionale)
- **Gauge** (un singolo valore rispetto a un intervallo min–max, ad esempio una percentuale)
- **Scatter** (punti X/Y per grafici di correlazione)
- **Proportion** (una barra suddivisa in quote con legenda percentuale, ad esempio una ripartizione per lingua)
- **Bar gauge** (un indicatore orizzontale per riga con gradiente dal rosso al verde e un valore, ad esempio lo spazio su disco libero)
- **Text** (un messaggio markdown, ad esempio una nota di stato come "Ultima esecuzione alle 19:47"; supporta [caselle di controllo interattive](../nodes/chart-output-node.md#interactive-task-lists) quando il markdown è statico, ed [elenchi numerati espliciti](../nodes/chart-output-node.md#numbered-lists) per numerazioni personalizzate o decrescenti)
- **HITL** (le revisioni umane in sospeso. L'intestazione mostra `1/n pending`. Il nome del workflow apre quella esecuzione sul canvas. **Approve**, **Request changes** e **Reject** la risolvono. L'icona della cronologia accanto al titolo del widget apre quella esecuzione nella finestra di dialogo della cronologia su questa pagina. Il widget non utilizza le righe a monte e ogni persona vede la propria coda)

Ogni widget carica i propri dati in modo asincrono all'apertura della scheda, pertanto la pagina rimane reattiva mentre i grafici si popolano.

## Aggiunta di un widget

1. Fare clic su **Add widget**, assegnare un titolo e scegliere un tipo di grafico. Sotto il selettore, la finestra di dialogo mostra un esempio di quel tipo di grafico con dati campione e indica le righe attese, così da poter confrontare i tipi prima di costruire qualsiasi cosa.
2. Il widget si apre nell'editor dei workflow con un grafo iniziale: un nodo [Set](../nodes/set-node.md) che produce le righe, collegato a un nodo [Chart Output](../nodes/chart-output-node.md). Sostituire il nodo Set con qualsiasi origine dati. Un widget **HITL** è costituito solo dal nodo Chart Output; legge le revisioni in sospeso e non necessita di un'origine dati.
3. Costruire il workflow in modo che il nodo che alimenta **Chart Output** produca un array di righe, quindi configurare la mappatura dei campi del nodo Chart Output (campo etichetta, campo valore, ecc.).
4. Salvare, tornare alla scheda Dashboard e il widget viene renderizzato.

Fare doppio clic su un widget (o utilizzare il suo pulsante di modifica) per riaprire il relativo workflow in qualsiasi momento. Utilizzare **Clone widget** nell'intestazione del widget per duplicare sia il widget sia il suo workflow completo. La copia viene posizionata sotto l'originale ed etichettata con **(Copy)**, così da poterla modificare in modo indipendente.

## Generazione di un widget con l'IA

Fare clic su **AI**, descrivere la metrica desiderata (ad esempio, "tasso di successo dei workflow negli ultimi 30 giorni come grafico a barre") e scegliere una credenziale LLM e un modello. Heym genera un workflow completo per il widget che termina con un nodo Chart Output e lo aggiunge alla griglia. Consultare [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) per esempi di prompt per ciascun tipo di grafico.

Utilizzare il pulsante **Fine-tune with AI** di un widget per rivedere un widget esistente con una nuova istruzione. Ogni fine-tune con IA salva un'istantanea del workflow precedente nella **Edit History** del widget, così da poter rivedere o ripristinare le modifiche dall'editor dei workflow.

## Modifica del layout

Attivare **Edit** per entrare in modalità modifica, in cui è possibile trascinare i widget e ridimensionarli su una griglia a 12 colonne. Le modifiche al layout vengono salvate automaticamente. I titoli dei widget sono modificabili in linea dall'intestazione del widget.

## Caching e aggiornamento

Ogni widget memorizza nella cache l'ultimo dato calcolato sul server per un time-to-live (TTL) configurabile. Finché la cache è fresca, la riapertura della dashboard serve il risultato memorizzato invece di rieseguire il workflow. La cache viene sostituita sul posto ogni volta che i dati vengono ricalcolati (una cache per widget) e viene invalidata automaticamente quando si modifica il workflow del widget.

Utilizzare il pulsante **Refresh** di un widget (o **Refresh** nella barra degli strumenti) per aggirare la cache e ricalcolare immediatamente.

## Condivisione

I proprietari condividono una dashboard dalle sue impostazioni, con singoli utenti (tramite email) o con qualsiasi [team](teams-tab.md) a cui appartengono. Ogni condivisione è **Read** o **Write**; quando qualcuno ha sia una condivisione personale che una di team, si applica quella più forte.

| Azione | Proprietario | Write | Read |
|--------|:-----:|:-----:|:----:|
| Visualizzare i widget, aggiornarli, utilizzare l'aggiornamento automatico | ✓ | ✓ | ✓ |
| Aggiungere, clonare, eliminare, rinominare e ridimensionare i widget; generare e ottimizzare con l'IA; spuntare gli elementi delle checklist | ✓ | ✓ | |
| Aprire il workflow di un widget nell'editor | ✓ | ✓ | |
| Rinominare o eliminare la dashboard, gestire la condivisione | ✓ | | |

**I widget vengono sempre eseguiti come il proprietario della dashboard.** Indipendentemente da chi stia osservando, un widget utilizza le credenziali e le variabili globali del proprietario, e le sue esecuzioni compaiono nella cronologia delle esecuzioni e nelle tracce del proprietario. I membri del team vedono quindi gli stessi dati senza accesso agli account sottostanti, e ogni visualizzatore condivide l'unico risultato in cache per widget. Anche i widget che un collaboratore con accesso in scrittura aggiunge o clona appartengono al proprietario.

Per questo motivo, **Write** comporta lo stesso livello di fiducia della condivisione di un workflow per la modifica: un collaboratore con accesso in scrittura può modificare ciò che viene eseguito con le proprie credenziali. Concederlo solo a persone a cui si consentirebbe di modificare i propri workflow. Un'esecuzione di test avviata da un collaboratore dall'editor del workflow utilizza le proprie credenziali, come per qualsiasi workflow condiviso; solo la dashboard stessa viene eseguita come il proprietario. **Read** non concede alcun accesso ai workflow dei widget, e i visualizzatori in sola lettura ricevono il grafico stesso ma non i dettagli di esecuzione per nodo sottostanti.

La rimozione di una condivisione, o la sua riduzione da write a read, ha effetto immediato.

## Correlati

- [Nodo Chart Output](../nodes/chart-output-node.md)
- [Scheda Analytics](analytics-tab.md) — metriche di esecuzione integrate (distinte dalle dashboard create dall'utente)

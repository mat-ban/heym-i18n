# Scheda Avvisi

La scheda **Avvisi** consente di definire condizioni di soglia su una finestra temporale e di ricevere una notifica quando vengono superate. Heym registra già gli esiti delle esecuzioni, la durata delle esecuzioni e la spesa LLM, ma non ne comunica mai alcuna informazione spontaneamente. Un avviso è il modo in cui si richiede di farlo.

Ogni avviso viene valutato su una **finestra temporale** scelta dall'utente, mai su un singolo evento. Un'esecuzione non riuscita è rumore. Dodici esecuzioni non riuscite in dieci minuti sono un incidente.

## Tipi di avviso

| Tipo | La domanda a cui risponde | Da dove proviene il numero |
|---|---|---|
| **Soglia di errore** | Questo è fallito più di N volte nella finestra? | Righe della [Cronologia esecuzioni](../reference/execution-history.md) con stato di errore |
| **Durata del workflow** | Le esecuzioni sono diventate più lente del previsto nella finestra? | Tempo di esecuzione, aggregato come max, media o 95° percentile |
| **Costo in Token / USD** | La spesa ha superato un budget nella finestra? | [Tracce LLM](./traces-tab.md) più la tabella dei costi LLM |
| **Conteggio esecuzioni** | Questo è stato eseguito molto più spesso del dovuto? | Conteggio delle righe della cronologia esecuzioni |

### Soglia di errore

Conta le esecuzioni non riuscite nell'intera finestra e scatta quando il conteggio raggiunge la soglia impostata. Poiché conta su una finestra anziché intercettare ogni singolo errore, un errore transitorio isolato non genererà una notifica.

### Durata del workflow

Misura la durata delle esecuzioni all'interno della finestra. Scegliere **max** (l'esecuzione più lenta), **media** o **p95**. Il valore p95 utilizza lo stesso calcolo percentile della [scheda Analytics](./analytics-tab.md), quindi l'avviso e il grafico della latenza non saranno mai in disaccordo sulla stessa finestra.

**Numero minimo di esecuzioni nella finestra** mantiene la coerenza. L'esecuzione più lenta in una finestra quasi vuota è semplicemente quell'unica esecuzione, quindi impostare un minimo di, ad esempio, 3 impedisce che l'avviso scatti sul rumore.

### Costo in Token / USD

Somma la spesa LLM nell'intera finestra, sia come token totali sia come dollari statunitensi. Gli importi in dollari vengono risolti tramite la stessa tabella dei prezzi utilizzata dalla [scheda Tracce](./traces-tab.md) e dalla [Tabella costi LLM](./datatable-tab.md#llm-cost-table-system-table), quindi un avviso sui costi e la pagina dei costi concordano sempre.

Quando l'ambito comprende tutti i workflow, questo include le chiamate LLM effettuate al di fuori di un workflow, come quelle della [scheda Chat](./chat-tab.md) e dell'[Assistente IA](../reference/ai-assistant.md). L'utilizzo degli agenti di coding (Codex, OpenCode) non è incluso.

I modelli privi di una riga di prezzo vengono segnalati nel contesto dell'avviso come non prezzati anziché essere conteggiati silenziosamente come zero.

### Conteggio esecuzioni

Conta le esecuzioni di qualsiasi stato nella finestra. Questo è il tipo che intercetta un Trigger impazzito: un workflow che normalmente viene eseguito 20 volte all'ora che improvvisamente ne esegue 2.000. Il record di attivazione include una ripartizione per origine del Trigger, perché è di solito la risposta alla domanda "perché è successo".

## Ambito

Un avviso monitora **un singolo workflow** oppure **tutti i workflow**.

"Tutti i workflow" significa ogni workflow a cui il proprietario dell'avviso può accedere. Deliberatamente non significa ogni workflow presente sull'istanza Heym: gli avvisi possono essere condivisi, e condividere un avviso non deve comportare la divulgazione a terzi di numeri aggregati relativi a workflow che non possono aprire.

## La procedura guidata

La creazione di un avviso si articola in cinque passaggi.

1. **Tipo** — scegliere uno dei quattro sopra indicati.
2. **Ambito** — un workflow oppure tutti.
3. **Condizione** — la finestra temporale, più i campi di soglia per quel tipo.
4. **Risposta** — cosa viene eseguito all'attivazione e con quale frequenza continuare a notificare.
5. **Revisione** — assegnare un nome e visualizzare il backtest.

### Il backtest

Il passaggio di Revisione risponde alla domanda che conta davvero prima di salvare: *nelle ultime 24 ore, quante volte sarebbe scattato?*

Vengono riportati il conteggio delle attivazioni e il valore massimo osservato rispetto alla soglia impostata. Se indica che la condizione sarebbe scattata 400 volte, è possibile correggere la soglia prima di salvare anziché dopo aver ricevuto le notifiche. È possibile estendere il periodo di analisi a 3 o 7 giorni.

## Bozza IA

Nella parte superiore del primo passaggio è presente un campo in cui descrivere ciò che si desidera in linguaggio naturale:

> Avvisami se la sincronizzazione delle fatture fallisce più di 5 volte in 10 minuti

Heym trasforma la richiesta in una definizione di avviso, compila ogni passaggio possibile e procede in avanti con i campi compilati dall'IA evidenziati, in modo da confermare anziché ridigitare. Una richiesta completa conduce direttamente alla Revisione.

**Una richiesta parziale fa comunque progredire.** Se si indica soltanto "avvisami se fallisce 5 volte", si ottiene un avviso con soglia di errore e il conteggio compilato, i valori predefiniti per il resto, e la procedura guidata si apre sul primo passaggio che richiede ancora l'intervento dell'utente: in questo caso l'Ambito, poiché nessun workflow è stato indicato. Una nota in alto segnala cosa resta da decidere. Non blocca mai i pulsanti Avanti o Crea.

Lo stesso vale quando il modello indica un workflow a cui non si ha accesso o restituisce una condizione con campi mancanti. Le parti sensate vengono mantenute, il resto ricade sui valori predefiniti per quel tipo di avviso e si procede alle opportune correzioni. Nulla di tutto ciò aggira la validazione: sia le regole della procedura guidata sia l'API ricontrollano l'avviso al momento del salvataggio.

## Comportamento di ripetizione

Una volta che un avviso scatta, entra in uno stato attivato. Ciò che accade in seguito è una scelta effettuata al passaggio 4.

- **Notifica una sola volta, fino al ripristino** (impostazione predefinita) — scatta una volta, poi rimane silenzioso finché la condizione persiste. Quando la metrica scende nuovamente sotto la soglia, l'avviso torna a OK e diventa nuovamente idoneo a scattare. Il ripristino è un cambio di stato, non un evento: non crea un record di attivazione e non esegue il workflow di notifica.
- **Continua a notificare a intervalli** — scatta di nuovo ogni N minuti finché la condizione persiste.

L'impostazione predefinita esiste perché un workflow non funzionante controllato ogni 60 secondi produrrebbe altrimenti 60 attivazioni all'ora, ed è così che gli avvisi vengono silenziati.

## Esecuzione di un workflow all'attivazione

Il passaggio 4 offre tre risposte alla domanda "cosa deve accadere quando questo scatta":

- **Creare e assegnare un nuovo workflow** (impostazione predefinita) — il salvataggio dell'avviso crea anche un workflow chiamato *"&lt;nome avviso&gt; notification"* e lo collega. Arriva con un nodo di input i cui campi corrispondono esattamente al payload riportato di seguito, quindi `$alert.body.observed_value` e gli altri si risolvono immediatamente e occorre solo collegare il nodo che recapita il messaggio. **Go to workflow** sulla scheda dell'avviso lo apre. Questa è l'impostazione predefinita perché un avviso che scatta nel vuoto è facile da trascurare.
- **Scegliere un workflow esistente** — eseguire qualcosa già costruito.
- **Non fare nulla** — l'attivazione viene comunque registrata nella scheda, semplicemente non esegue nulla.

Il payload dell'avviso arriva come body di input di quel workflow:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Quale workflow ha prodotto il numero

`workflows` è l'unico punto in cui compare un workflow. Elenca ogni workflow che ha contribuito alla lettura, ciascuno con il proprio `value` — il conteggio degli errori, il conteggio delle esecuzioni, l'esecuzione più lenta in millisecondi o la spesa di quel workflow, a seconda del tipo di avviso. L'elenco è ordinato per `value`, dal più alto al più basso, quindi `workflows[0]` è il maggiore responsabile.

È **sempre un array**: con un solo elemento nell'ambito di un singolo workflow, con molti elementi in "all my workflows", e vuoto anziché null quando nulla è attribuibile. Un workflow di notifica può iterarlo senza controlli sulla forma.

Non esiste deliberatamente un `workflow_id` singolare. Descriveva l'ambito dell'avviso anziché la metrica, quindi era `null` nell'ambito di sistema, che è esattamente il caso in cui "quale workflow?" conta di più. `observed_value` rimane l'aggregato con cui è stata confrontata la soglia; i campi `value` per singolo workflow spiegano da dove proviene.

È così che gli avvisi raggiungono Slack, l'email, Telegram o qualsiasi altro canale: con i [nodi](../reference/node-types.md) già disponibili, anziché con un sistema di notifica separato.

Un avviso non può notificare il workflow che sta monitorando. Sarebbe un loop, nel modo più evidente per un avviso sul conteggio delle esecuzioni in cui ogni notifica si aggiunge al conteggio che misura.

Le esecuzioni di notifica sono esecuzioni ordinarie, quindi compaiono nella [cronologia delle esecuzioni](../reference/execution-history.md) come qualsiasi altra esecuzione. Un workflow di notifica che fallisce viene registrato sull'attivazione ma non impedisce mai che l'attivazione stessa venga registrata.

Un workflow di notifica viene eseguito come il proprietario dell'avviso, con le sue credenziali e le sue variabili globali, esattamente come se le avesse eseguite personalmente. Scegliere un workflow condiviso da qualcun altro non comporta l'uso delle credenziali di quella persona. Se il proprietario perde l'accesso al workflow di notifica, l'attivazione viene comunque registrata ma l'esecuzione di notifica viene saltata.

## Cronologia delle attivazioni

Sotto l'elenco degli avvisi si trova la cronologia delle attivazioni: cosa è scattato, quando, il valore osservato rispetto alla soglia, la finestra esatta valutata e l'esito della notifica.

Prendere atto di un'attivazione contrassegna la riga e cambia il badge dell'avviso da **Firing** a **Acknowledged**. Si tratta di un'indicazione che riguarda l'utente, non l'avviso: la condizione persiste e l'avviso torna a **OK** da solo quando la metrica scende nuovamente sotto la soglia.

Ogni record memorizza il dettaglio contribuente nel momento in cui è scattato: id delle esecuzioni fallite e messaggi di errore, spesa per modello o la ripartizione per origine del trigger. Ciò è intenzionale. La finestra è trascorsa e ricalcolarla in seguito può dare un risultato diverso.

I record di attivazione vengono conservati per 90 giorni.

## Chiedere informazioni sugli avvisi alla Chat

La [scheda Chat](./chat-tab.md) può rispondere a domande sugli avvisi:

- "What alerts do I have?"
- "Is there an alert on the invoice workflow?"
- "Why did the cost alert fire?"
- "When did this last trigger?"

Per una domanda del tipo "perché è scattato", la Chat cita il valore osservato effettivo, la soglia e la finestra temporale dal record di attivazione, insieme al dettaglio contribuente.

## Condivisione

Gli avvisi possono essere condivisi con singoli utenti o con i [team](./teams-tab.md). Le persone con cui si condivide possono vedere l'avviso e la sua cronologia delle attivazioni. Solo il proprietario può modificarlo, metterlo in pausa, eliminarlo o ricondividerlo.

### Quando l'accesso al workflow viene rimosso

Un avviso su un singolo workflow continua a leggere le metriche di esecuzione di quel workflow, pertanto la rimozione dell'accesso al workflow da parte di un utente determina anche ciò che accade ai suoi avvisi su di esso:

- **La rimozione di una condivisione a un utente o a un team** chiede al proprietario del workflow se interrompere anche gli avvisi di quell'utente o team sul workflow. L'interruzione è l'impostazione predefinita. Gli avvisi interrotti vengono messi in pausa, non eliminati, e ciascuno viene registrato come `alert.disable_on_access_revoke` nel [registro di controllo](../reference/audit.md).
- **La rimozione di un membro di un team o l'eliminazione di un team** interrompe sempre gli avvisi interessati, poiché la persona che effettua tale modifica non è necessariamente il proprietario del workflow.
- Un avviso viene interrotto solo quando il suo proprietario non ha altri percorsi verso il workflow, come una condivisione diretta o un altro team.
- La ripresa o il test di un avviso in pausa verifica nuovamente l'accesso del proprietario, pertanto un avviso interrotto non può essere riattivato né utilizzato per leggere le metriche del workflow senza accesso. Premendo **Resume** senza accesso viene mostrata una notifica che spiega che il proprietario del workflow deve prima condividerlo nuovamente.

## Gestione degli avvisi

- **Pausa / Ripresa** — un avviso in pausa non viene mai valutato. La ripresa lo verifica immediatamente anziché attendere l'intervallo successivo.
- **Modifica** — le modifiche vengono convalidate nel loro insieme, pertanto una modifica parziale non può lasciare l'avviso in uno stato non valido.
- **Eliminazione** — rimuove l'avviso e la sua cronologia di attivazione.

## Vedi anche

- [Scheda Analytics](./analytics-tab.md) — i grafici da cui sono tratti questi valori di soglia
- [Scheda Tracce](./traces-tab.md) — da dove provengono i dati sui costi LLM
- [Cronologia esecuzioni](../reference/execution-history.md) — le esecuzioni misurate dagli avvisi di errore, durata e conteggio
- [Scheda Chat](./chat-tab.md) — interrogazione degli avvisi in linguaggio naturale
- [Team](./teams-tab.md) — condivisione degli avvisi con un team

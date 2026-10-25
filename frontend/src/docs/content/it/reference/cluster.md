# Distribuzione del carico

Puntando una seconda istanza di Heym allo stesso database PostgreSQL, questa si unisce come worker. Le esecuzioni dei workflow in background vengono quindi ripartite tra le istanze secondo una percentuale da Lei definita, così la macchina che serve l'interfaccia utente e l'API non è anche l'unica macchina che esegue ogni workflow.

Le istanze non comunicano mai tra loro. È Postgres a trasportare il lavoro, quindi un worker non necessita di porte aperte, certificati o rotte di ritorno verso l'istanza principale — solo dell'accesso al database.

## Ruoli

Un'istanza è **main**, vincolata tramite una variabile d'ambiente. Serve l'interfaccia utente, l'API, MCP e il portale chat, e possiede l'archiviazione dei file e i plugin installati. Ogni altra istanza è un **worker**: raggiunge soltanto il database ed esegue le esecuzioni in background.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Il ruolo main è separato dall'elezione del leader. Heym elegge già un leader all'interno del cluster per gestire cron, valutazione degli avvisi e ripristino dopo un crash; se main va giù, la leadership passa a un worker entro pochi secondi e le esecuzioni pianificate continuano a essere attivate. Il ruolo main non si sposta, perché l'archiviazione dei file non può spostarsi con esso.

## Cosa può lasciare l'istanza main

Il posizionamento viene deciso in base ai nodi del workflow prima che l'esecuzione inizi. Un'esecuzione rimane su main quando un qualsiasi nodo in essa contenuto — inclusi i nodi all'interno dei sub-workflow che essa richiama — tocca qualcosa che esiste su una sola macchina:

| Nodo | Perché rimane su main |
|---|---|
| Codex, OpenCode Go | Lo spazio di lavoro dell'agente di coding rimane sul disco locale, così un follow-up può riprendere da lì |
| Agent con una skill allegata | Il codice della skill legge e scrive su Heym Drive |
| Drive, Converter, Google Drive | Leggono e scrivono file generati |
| Trigger File Upload | Il caricamento atterra sul disco di main |
| Send Email | I relay SMTP aziendali consentono comunemente l'accesso a un solo indirizzo di origine |
| Nodi Plugin | Un plugin è installato sul disco di una sola istanza |

**Tutto il resto è distribuito** — incluso il Nodo Code, Playwright e gli strumenti Python dell'Agent. Ogni istanza esegue la stessa immagine con il proprio socket Docker, quindi una sandbox non è un motivo per mantenere un'esecuzione su main, e quelli sono i nodi più affamati di CPU del prodotto.

Un workflow il cui sub-workflow è scelto da un'espressione non può essere ispezionato in anticipo, quindi rimane su main.

## Scegliere le percentuali

I pesi sono numeri interi impostati in **Impostazioni → Istanze**. Sono **quote delle istanze che possono attualmente accettare lavoro**, non percentuali su 100: lo scheduler divide per il totale di quel pool.

Questa distinzione emerge non appena un'istanza si disconnette. Con `Main 41, Worker A 26, Worker B 33`, disattivando Worker B rimane un pool di 67, quindi Main riceve effettivamente 41/67 = **61%** e Worker A 26/67 = **39%**. Il pannello mostra la ripartizione effettiva sotto la tabella proprio per questo motivo, e il salvataggio non viene mai bloccato perché i numeri non sommano a 100 — viene rifiutata solo una ripartizione in cui nessuna istanza abilitata ha un peso.

Altri due aspetti sono facili da fraintendere.

**Una percentuale non è una quota di potenza della macchina.** Copre solo le esecuzioni che passano attraverso la coda. Servire l'interfaccia utente e l'API, trasmettere in streaming le esecuzioni dell'editor e del portale e gestire i caricamenti dei file sono tutte attività di main e nessuna di esse viene conteggiata. Main sta facendo più di quanto il suo numero indichi.

**La percentuale di main è un tetto, non un minimo.** Le esecuzioni che possono essere eseguite solo su main vengono addebitate sulla sua quota, quindi una volta esaurita tale quota le restanti esecuzioni distribuibili ricadono sui worker. Impostare un numero basso per main è sicuro — il lavoro che deve essere eseguito lì viene comunque eseguito. Impostarlo alto affama i worker.

Quindi, con un main potente e un worker più piccolo, si parta più vicino a 60/40 che al rapporto grezzo delle macchine, poi si confrontino le durate reali delle esecuzioni nella scheda Esecuzioni e si regoli di conseguenza.

I pesi vengono rinormalizzati tra le istanze attualmente attive e abilitate. Con `main=70, A=15, B=15`, se A va offline la ripartizione diventa 70/85 e 15/85 tra main e B, e torna a 70/15/15 quando A ritorna.

**Un'istanza che ritorna non ha diritto alle esecuzioni che ha perso.** Il tempo trascorso Offline, Disabilitata o su una versione non corrispondente non viene conteggiato a suo sfavore, quindi un worker che trascorre una notte non disponibile rientra nella posizione corrente del pool e la ripartizione torna a leggersi 70/30 dalla sua prima esecuzione — non assorbe ogni esecuzione finché non si è rimesso in pari. Un worker che è stato disponibile per tutto il tempo recupera comunque, ed è questo che rende la percentuale di main un tetto.
### Una nuova istanza si unisce a quota zero

Un'istanza a cui non è mai stato assegnato un peso parte da 0, il che la lascerebbe Live, Abilitata e senza ricevere nulla. **Assegnare automaticamente una quota alle nuove istanze** — attivo per impostazione predefinita, sotto la tabella delle istanze — risolve il problema: al passaggio successivo del leader, alla nuova arrivata viene assegnata una quota uguale del pool, e i pesi esistenti vengono ridimensionati mantenendo i reciproci rapporti, cosicché un deliberato 70/30 continua a leggersi all'incirca come 70/30 in seguito. Il totale resta esattamente 100.

Questa operazione viene eseguita **una sola volta per istanza**. Sia il passaggio automatico sia la modifica manuale contrassegnano l'istanza come configurata, pertanto un'istanza impostata manualmente non viene mai modificata a Sua insaputa — compresa una che Lei abbia deliberatamente impostato a 0. Disattivi l'impostazione se preferisce che ogni nuova macchina attenda il Suo intervento.

Partecipano solo le istanze abilitate, live e compatibili. Assegnare una quota a una macchina che non può eseguire nulla lascerebbe quella quota inutilizzata.

### Quando le percentuali non possono aiutare

Il pannello delle impostazioni indica quante delle esecuzioni delle ultime 24 ore hanno potuto essere eseguite solo su main. Se tale numero è elevato — un carico di lavoro con forte presenza di Codex o Drive — i worker resteranno inattivi qualunque cosa dicano i pesi, e la soluzione è un'istanza main più grande, non più istanze.

## Dimensionare PostgreSQL per un cluster

Le connessioni scalano con le istanze, non solo con gli utenti. Ogni istanza esegue diversi processi uvicorn, e ciascun processo mantiene un pool di connessioni più quattro connessioni `LISTEN` (cancellazione, risvegli della coda, risultati delle esecuzioni, stream di chat). Gli stream di chat aperti condividono l'unica connessione chat, quindi non aggiungono connessioni al database. Un cluster a tre istanze con il valore predefinito `max_connections = 100` esaurisce le connessioni, e Heym non riesce più a raggiungere il proprio database.

Preveda all'incirca `istanze x processi x (pool asincrono + pool sincrono + 4)` e imposti `max_connections` al di sopra di tale valore.

Riduca i pool anziché limitarsi ad alzare il tetto. Un singolo deployment usa per impostazione predefinita 10+20 connessioni asincrone e 5+10 sincrone per processo, un valore generoso per una sola macchina e decisamente eccessivo per un cluster:

| Variabile | Istanza singola | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Il file compose di esempio imposta tali valori e `max_connections = 300`. Ciò porta un cluster a due istanze da un tetto di 768 connessioni a 192, con tre istanze ancora al di sotto di 300.

## Requisiti che il cluster non può imporre al posto Suo

**Ogni istanza deve usare lo stesso `SECRET_KEY` e lo stesso `ENCRYPTION_KEY`.** Un worker con un `ENCRYPTION_KEY` diverso non può decifrare le credenziali, e ogni esecuzione che le utilizzi fallirebbe con un errore che non indica nulla di utile. Heym confronta un digest di entrambe le chiavi a ogni heartbeat, insieme alla versione dell'app e alla revisione del database, e contrassegna un'istanza non corrispondente come **Mismatch**, così che non riceva alcun lavoro. Il carico ricade su main finché Lei non risolve il problema.

Ciò definisce anche l'ordine di aggiornamento. Aggiornare prima main contrassegna ogni worker come incompatibile; il lavoro torna su main, e ciascun worker si ricongiunge man mano che viene aggiornato. Più lento, visibile e reversibile.

**Indirizzi l'ingress esclusivamente verso l'istanza main.** Il round-robin del traffico utente tra le istanze invierebbe un caricamento di file a una macchina e il relativo download a un'altra. Nulla nel codice lo impedisce, poiché un worker esegue la stessa immagine e risponderà a qualsiasi richiesta riceva.

**Ogni istanza necessita di `FRONTEND_URL`, impostato sullo stesso indirizzo pubblico.** Un'esecuzione che si mette in pausa per la revisione umana genera il proprio link di revisione sull'istanza che l'ha eseguita, non su main, e lo stesso vale per i link di follow-up di Codex e per gli URL di download dei file generati. Un worker privo di tale variabile costruisce quei link sul proprio indirizzo locale, e chiunque ne riceva uno non può aprirlo.

**Le istanze worker hanno un IP in uscita diverso.** Qualsiasi API che applica un allowlist agli indirizzi di origine vede il nuovo indirizzo. Send Email viene eseguito su main proprio per questo motivo; per il nodo HTTP, o si assegna al cluster un unico indirizzo NAT in uscita, oppure si inseriscono tutte le istanze nell'allowlist.

## Aggiungere un worker su un'altra macchina

`docker-compose.worker.yml` nella radice del repository esegue un worker sul proprio host. Non ha database né interfaccia utente: raggiunge il PostgreSQL dell'istanza main e prende la propria quota delle esecuzioni in background.

Compili un file `.env` accanto ad esso — tag dell'immagine, host e credenziali del database, entrambe le chiavi e un id di istanza — e lo avvii. Compose rifiuta di avviarsi finché ogni valore richiesto non è impostato, anziché partire con un segnaposto che fallirebbe in seguito in modo difficile da interpretare.

Il tag dell'immagine deve corrispondere alla versione eseguita da main, ed entrambe le chiavi devono essere copiate esattamente. Una differenza in una delle due mostra il worker come Mismatch e non riceverà alcun lavoro.
## Lettura della tabella Istanze

| Colonna | Significato |
|---|---|
| Name | Etichetta modificabile; viene apposta su ogni esecuzione eseguita da questa istanza |
| Role | `main` o `worker`, in base all'ambiente |
| Status | **Live** con heartbeat recente, **Offline** dopo 30 secondi di silenzio, **Mismatch** quando la versione, la revisione del database o le chiavi differiscono da quelle di main |
| ms | Tempo di andata e ritorno da quell'istanza al database, misurato dall'istanza stessa |
| On | Esclude un worker dalla rotazione senza arrestarlo — le esecuzioni in corso terminano, non ne vengono assegnate di nuove. Bloccato su On per l'istanza main: le attività di file, plugin e coding-agent vengono eseguite lì indipendentemente dallo stato dell'interruttore |
| Weight | La sua quota di esecuzioni distribuibili |

## Limiti di concorrenza in un cluster

Il [limite di concorrenza](./webhooks.md#concurrency-limit-and-queued-runs) di un workflow viene conteggiato in PostgreSQL, pertanto si applica su ogni istanza e su ogni processo: due istanze non eseguono mai più esecuzioni di un workflow di quante ne consenta il limite. Un'esecuzione che ha atteso uno slot viene collocata in base alle stesse regole di qualsiasi altra esecuzione all'avvio, garantendo che un'esecuzione che deve rimanere su main vi rimanga. Il worker di coda che esegue tali esecuzioni si avvia ora su ogni installazione, inclusa una singola istanza, in cui acquisisce solo le esecuzioni accodate dalla propria istanza. Ciò significa che anche una singola istanza mantiene la connessione `LISTEN` di risveglio della coda in ogni processo; pianifichi quindi le sue connessioni allo stesso modo di quelle di un'istanza di cluster.

## Cronologia delle esecuzioni

Ogni esecuzione nella cronologia indica l'istanza che l'ha eseguita, ed entrambe le finestre di dialogo della cronologia possono essere filtrate su una singola istanza. Il filtro corrisponde all'id dell'istanza mostrandone il nome, pertanto rinominare un'istanza non riscrive quanto riportato dalle esecuzioni precedenti.

Nulla di tutto ciò compare in un'installazione a istanza singola: i campi sono vuoti, non viene mostrata alcuna etichetta e non viene offerto alcun filtro.

## Comportamento in caso di errore

**Se un worker si arresta durante un'esecuzione**, il suo heartbeat diventa obsoleto e la procedura di ripristino esistente del leader riesegue l'esecuzione su un'istanza attiva. La riga della coda che aveva reclamato viene ritirata separatamente: una volta che non esiste più alcuna esecuzione attiva per essa e sono trascorsi due minuti di tolleranza, il leader contrassegna la riga come fallita e risveglia chi era in attesa del risultato. La sola anzianità non è mai il trigger, quindi un'esecuzione legittimamente lunga viene lasciata invariata; e la riga viene contrassegnata come fallita anziché rimessa in coda, poiché il ripristino possiede già la riesecuzione e rimetterla in coda eseguirebbe due volte lo stesso workflow.

**Se main va giù**, il cron continua a scattare da un worker e le esecuzioni distribuibili continuano a essere eseguite. Le esecuzioni che richiedono main si accodano e attendono, e si svuotano quando main ritorna — ma solo entro la finestra di tolleranza per i misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 secondi per impostazione predefinita). Qualsiasi esecuzione più vecchia viene chiusa come saltata, con la motivazione registrata, anziché rieseguire ore di arretrato in una sola volta.

L'interfaccia utente, l'API, MCP e l'editor non sono disponibili mentre main è inattivo, poiché l'ingress punta a esso.

## Correlati

- [Esecuzione e distribuzione](../getting-started/running-and-deployment.md) – Distribuire prima una singola istanza; le variabili d'ambiente e la configurazione delle chiavi si trovano lì
- [Impostazioni](./user-settings.md) – La scheda Istanze e chi può visualizzarla
- [Esecuzioni](../tabs/traces-tab.md) – Confrontare le durate reali delle esecuzioni tra le istanze prima di modificare la ripartizione
- [Sicurezza](./security.md) – Perché ogni istanza deve condividere `SECRET_KEY` e `ENCRYPTION_KEY`

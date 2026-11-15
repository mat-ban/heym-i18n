# Heym Runbook (L1)

Seguire queste procedure per diagnosticare e ripristinare i servizi Heym, le connessioni PostgreSQL, le code dei workflow, la capacità del cluster e l'esecuzione in sandbox.

Iniziare con [Heym Incident Playbook (L0)](./incident-playbook.md) per gravità, contatti e inventario di distribuzione.

Ultima revisione: 2026-11-10. I comandi corrispondono al repository al momento della revisione. Confermare la versione e la topologia distribuite prima dell'uso. Tutti i comandi di modifica del servizio riportati di seguito sono istruzioni per un operatore, non una correzione automatica.

## Indice delle procedure

| Incidente |
| --- |
| [UI o API non disponibile](#ui-o-api-non-disponibile) |
| [PostgreSQL non disponibile o non scrivibile](#postgresql-non-disponibile-o-non-scrivibile) |
| [Connessioni DB attive, saturazione del pool e blocchi](#connessioni-db-attive-saturazione-del-pool-e-blocchi) |
| [Riavvio controllato del servizio](#riavvio-controllato-del-servizio) |
| [Workflow che consumano più risorse](#workflow-che-consumano-più-risorse) |
| [Accumulo nella coda o esecuzioni apparentemente bloccate](#accumulo-nella-coda-o-esecuzioni-apparentemente-bloccate) |
| [Verifiche della modalità cluster](#verifiche-della-modalità-cluster) |
| [Istanza main non disponibile mentre i worker sono attivi](#istanza-main-non-disponibile-mentre-i-worker-sono-attivi) |
| [Errori di webhook, MCP, Portal o streaming](#errori-di-webhook-mcp-portal-o-streaming) |
| [Problemi di container, pod, OOM o archiviazione](#problemi-di-container-pod-oom-o-archiviazione) |
| [Distribuzione errata o regressione di configurazione](#distribuzione-errata-o-regressione-di-configurazione) |
| [Errore di modello, credenziale o integrazione](#errore-di-modello-credenziale-o-integrazione) |
| [Errore di sandbox](#errore-di-sandbox) |
| [Disaster recovery e risposta alle emergenze](#disaster-recovery-e-risposta-alle-emergenze) |

## Configurazione dei comandi

Operare dal checkout distribuito o dagli strumenti di distribuzione. Selezionare solo la topologia effettivamente in esecuzione nell'ambiente interessato. Non utilizzare un progetto di esempio per gestire un incidente di produzione.

### Docker Compose

Definire questo helper shell per l'installazione standard di Compose:
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Per l'esempio di cluster del repository, utilizzare invece questa definizione:
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Per un worker autonomo sul proprio host, utilizzare `docker compose -f docker-compose.worker.yml` e il servizio `worker`. Non dispone di servizi locali PostgreSQL o frontend. Includere il nome effettivo del progetto, i file di override e il file di ambiente nell'helper se utilizzati.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

Lo stack standard Compose pubblica per impostazione predefinita il frontend sulla porta host `4017` e PostgreSQL sulla `6543`. La sua porta backend `10105` è interna. L'esempio di cluster pubblica l'API di main sulla `10105`, l'API di worker-a sulla `10111` e PostgreSQL sulla `6544`. Un'immagine di release combina frontend e backend in un unico container. Verificare le mappature delle porte con `ps`.

Per un controllo diretto del processo backend all'interno di un container main Compose:
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Impostare il contesto, il namespace e i nomi dei carichi di lavoro effettivi. Questi nomi di deployment corrispondono unicamente agli esempi del repository.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

Il deployment di base comprende una singola replica di main con strategia `Recreate`, archiviazione persistente e una readiness probe su `/api/health`. La sua porta container pubblica è `4017`; un worker esclusivamente backend utilizza `10105`. Non presumere che un riavvio o rollout sia privo di tempi di inattività. Consultare [Comportamento del deployment Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Stato e accesso all'API
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` restituisce `status`, `service` e `version`; non esegue verifiche delle dipendenze. Confermare il database e un workflow end-to-end approvato separatamente.

Gli esempi autenticati di seguito utilizzano un file di configurazione curl predisposto al di fuori di questo repository in `$HEYM_CURL_CONFIG`, contenente l'intestazione `Authorization` dell'operatore. Limitare i permessi all'operatore, tenerlo fuori dal controllo versione ed eliminare le copie temporanee dopo l'uso. Non incollare token in comandi, URL, log o note di incidenti. Utilizzare una sessione UI autenticata esistente quando disponibile. Ispezionare i codici di stato e lo schema OpenAPI distribuito nel backend `/docs` prima di ritentare una mutazione non riuscita.

### Accesso SQL e limiti delle query

Per il database Compose integrato, aprire una sessione con l'identità configurata del container del database:
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Per un database esterno, utilizzare una definizione del servizio `psql` approvata e un file di password o la console del provider di database. Una connessione libpq utilizza `postgresql://`, non `postgresql+asyncpg://` di SQLAlchemy. Eseguire i test sia dal percorso di rete dell'applicazione interessata sia dal percorso DBA.

Eseguire l'SQL diagnostico con un ruolo di sola lettura ove possibile. All'inizio di ogni sessione diagnostica:
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Utilizzare il nodo primario di scrittura designato per le verifiche applicative. Una replica potrebbe rispondere a `SELECT 1` mentre il percorso di scrittura non è disponibile. I dettagli di `pg_stat_activity` potrebbero richiedere privilegi di monitoraggio del database; righe nascoste o campi NULL non dimostrano l'assenza di attività. Le query diagnostiche seguenti omettono payload, secret e testo SQL. Non aggiornano tabelle Heym. Consultare [Attività e visibilità PostgreSQL](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Verifica condivisa

Dopo ogni mitigazione, verificare l'accesso pubblico, la reattività del database, un workflow smoke approvato e le metriche pertinenti di capacità/backlog. Utilizzare un trigger sicuro in modalità di produzione per verificare il dispatch del cluster: le esecuzioni di test dell'editor rimangono sull'istanza ricevente. Monitorare per almeno 10 minuti, oltre alla successiva pianificazione critica prevista o a una verifica equivalente concordata. Registrare le modifiche e concordare un responsabile/orario per revocare le restrizioni temporanee.

## UI o API non disponibile

**Gravità:** P1 per indisponibilità diffusa in produzione; P2 per degradazione parziale.

**Diagnosi**

1. Confrontare l'interfaccia utente pubblica, l'endpoint pubblico `/api/health` e il controllo diretto del backend main da [Configurazione dei comandi](#configurazione-dei-comandi).
2. Ispezionare lo stato del container o pod main/frontend, gli errori recenti e CPU/memoria/disco. Il caricamento di una UI statica non prova che l'API sia funzionante.
3. Eseguire la [verifica del database](#postgresql-non-disponibile-o-non-scrivibile). Ispezionare l'ultima release e le modifiche di ingress/proxy.
4. Se falliscono solo le richieste autenticate, distinguere le sessioni/SSO scaduti da un errore generale dell'API. Non reimpostare le chiavi condivise per testare il login.

**Mitigazione**

1. Risolvere prima le dipendenze di database o archiviazione se spiegano l'errore.
2. Se il backend diretto funziona, ripristinare il percorso frontend/proxy/ingress. L'ingress deve puntare a main in modalità cluster.
3. Se main è bloccato e le dipendenze sono sane, seguire [Riavvio controllato del servizio](#riavvio-controllato-del-servizio). Ripristinare solo il servizio frontend interessato quando è il componente guasto.
4. Per una regressione della release, seguire [Distribuzione errata](#distribuzione-errata-o-regressione-di-configurazione).

**Verifica:** L'interfaccia utente pubblica si carica, l'accesso API autenticato riesce e un workflow smoke viene completato. Un endpoint di processo verde da solo non è sufficiente.

**Escalation:** Reperibilità della piattaforma per guasti backend; responsabile rete/ingress quando fallisce solo il percorso pubblico; responsabile database o archiviazione quando falliscono i controlli delle dipendenze.

## PostgreSQL non disponibile o non scrivibile

**Gravità:** P1 quando falliscono le connessioni o le scritture di produzione; P2 per degradazione intermittente.

**Diagnosi**

Per il PostgreSQL integrato:
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` verifica se il server accetta connessioni. Confermare l'accesso SQL autenticato e lo stato primario utilizzando l'[accesso SQL](#configurazione-dei-comandi).
2. Dall'istanza interessata, controllare DNS, routing, endpoint/porta del database, TLS e policy di rete. Una connessione DBA locale non garantisce la raggiungibilità dell'applicazione.
3. Leggere l'errore sanificato: connessione rifiutata/timeout, errore di autenticazione, esaurimento delle connessioni, transazione in sola lettura, memoria esaurita o errore di migrazione.
4. Verificare disco/inode dell'host del database, log del database, stato di failover/replica ed eventi di manutenzione. Utilizzare [Connessioni e blocchi](#connessioni-db-attive-saturazione-del-pool-e-blocchi) in caso di saturazione.

**Mitigazione**

1. Ridurre l'acquisizione dei produttori e le tempeste di nuovi tentativi. Sospendere i trigger automatici problematici tramite Heym se la sua API funziona; altrimenti coordinare la riduzione del traffico a monte. Evitare riesecuzioni massive.
2. Per un database integrato arrestato con archiviazione intatta verificata e nessuna operazione attiva di failover/ripristino, avviare solo il servizio esistente:
```bash
   heym_compose start postgres
   ```

3. Per PostgreSQL gestito, guasti di rete, disco pieno, corruzione o failover, utilizzare la procedura di ripristino del responsabile del database. Conservare il volume del database e il materiale delle chiavi esistenti.
4. Una volta accessibile il nodo primario di scrittura, consentire ai pool/listener di riconnettersi. Riavviare un'istanza applicativa solo se continua a fallire dopo che il percorso DB è tornato sano.
5. Non inizializzare mai un database vuoto sostitutivo durante un incidente, non eliminare file WAL e non eseguire `docker compose down -v`. Il ripristino segue [Disaster recovery](#disaster-recovery-e-risposta-alle-emergenze).

**Verifica:** L'SQL del percorso applicativo funziona sul primario previsto, le normali scritture applicative riescono tramite il workflow smoke, gli errori di connessione cessano, i heartbeat riprendono e l'anzianità della coda diminuisce.

**Escalation:** Reperibilità database immediatamente per P1, problemi di primario/failover, corruzione dei dati o archiviazione esaurita. Inviare identità dell'endpoint, timestamp, classe di stato/errore e prove di archiviazione/connessione senza credenziali.

## Connessioni DB attive, saturazione del pool e blocchi

**Gravità:** P1 se nessun carico utile riesce a connettersi; P2 se la pressione o i blocchi degradano l'esecuzione.

**Diagnosi**

Eseguire questo comando sul server PostgreSQL interessato. Il totale è a livello di server poiché altri database condividono lo stesso limite di connessioni. `active` sta eseguendo una query; `idle` è connesso senza query in corso. Entrambi consumano uno slot. PostgreSQL riserva alcuni slot, pertanto i client ordinari potrebbero essere rifiutati prima che il totale raggiunga `max_connections`.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

Heym contrassegna le connessioni di pool e listener come `heym-<instance-id>`. Confrontare il gruppo di connessioni con i heartbeat delle istanze e il conteggio dei processi. Un pool inattivo è normale. Una popolazione crescente di `idle in transaction` richiede un'indagine.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Distinguere l'esaurimento del server (`too many clients`) da un timeout del pool SQLAlchemy locale. Un pool locale può saturarsi perché le richieste trattengono le connessioni o attendono blocchi anche quando il server dispone di slot liberi.

Pianificare il picco configurato, inclusi overflow e ogni processo uvicorn:
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

I valori predefiniti per processo sono `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` e `HEYM_DB_SYNC_MAX_OVERFLOW=10`. L'entrypoint standard del backend avvia 8 processi: il suo picco teorico è `8 * (10 + 20 + 5 + 10 + 4) = 392`, prima degli altri client. I pool crescono su richiesta; questo è un tetto massimo, non il numero aperto previsto. La sessione dedicata del leader viene mantenuta dal pool asincrono. Esistono quattro connessioni listener per processo anche in un'installazione a istanza singola; i flussi di chat condividono un listener.

Leggere le impostazioni effettive dal manifesto distribuito. I file di esempio sovrascrivono alcuni valori predefiniti e conteggi di processi. L'aggiunta di worker aggiunge anche pool e listener; ciò può peggiorare la pressione sul database.

**Mitigazione**

1. Regolare i carichi di lavoro/produttori identificati. Mantenere un percorso di accesso DBA e margine operativo.
2. Chiedere al responsabile del database di verificare i singoli bloccanti/lunghe transazioni. Non terminare in massa le sessioni Heym: i listener e la sessione di advisory lock del leader sono percorsi di coordinamento essenziali. L'annullamento della query e la terminazione della sessione hanno effetti differenti; il DBA deve mirare a un colpevole confermato. Consultare [Segnali del server PostgreSQL](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Se la capacità lo richiede, ridurre la dimensione di pool/overflow o il numero di processi tramite la configurazione di distribuzione, quindi drenare/ricreare le istanze una alla volta. Verificare il carico API e la capacità dell'executor dopo la riduzione. Una modifica del pool richiede la sostituzione del processo; `restart` non applica i valori modificati dell'ambiente Compose.
4. `docker-compose.yml` non inoltra esplicitamente le quattro variabili di pool. Aggiungere le sostituzioni d'ambiente approvate nella configurazione effettiva di distribuzione invece di presumere che una voce `.env` dell'host raggiunga il container. Gli esempi di cluster e worker hanno le proprie mappature.
5. Coordinare qualsiasi aumento di `max_connections` con il responsabile del database e il budget di memoria. Evitare riconnessioni simultanee su tutta la flotta.

**Verifica:** Le connessioni client totali si stabilizzano con margine, gli errori di pool cessano, i blocchi si risolvono, gli errori di listener/heartbeat si interrompono e il workflow smoke riesce.

**Escalation:** Responsabile database per interventi su bloccanti o modifiche al tetto di connessioni; responsabile piattaforma per perdite di connessioni, esaurimento del pool o ripetute tempeste di riconnessione.

## Riavvio controllato del servizio

**Gravità:** Eredita la gravità dell'incidente. Il riavvio di main interrompe il servizio pubblico nella topologia documentata.

**Prima di riavviare**

1. Confermare l'istanza/servizio di destinazione e acquisire log, digest dell'immagine, motivo del riavvio e ID delle esecuzioni attive/in coda. Confermare che PostgreSQL e l'archiviazione siano sani.
2. Ridurre la nuova acquisizione. Per un worker, disattivare **On** sotto **Impostazioni > Istanze** nell'interfaccia utente o impostare il suo peso su 0. Drenare i lavori in corso prima del riavvio.
3. Rivedere [Ripristino e cancellazione dell'esecuzione](#distribuzione-errata-o-regressione-di-configurazione). Heym riprende le esecuzioni incomplete rieseguendo i workflow idonei dall'inizio.
4. Non eliminare volumi, non omettere file di ambiente e non eseguire un semplice `docker compose down`.

**Riavviare un servizio con configurazione invariata**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Per un worker drenato dell'esempio di cluster, sostituire `$HEYM_WORKER_SERVICE`. Il timeout di arresto di 60 secondi consente alle esecuzioni in corso di completarsi o raggiungere uno stato di pausa pulito prima di SIGKILL.

**Riavvio completo dello stack Compose**

Preferire i riavvii a singolo servizio. Un riavvio dello stack arresta l'intero stack Compose, incluso PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Sostituire `$HEYM_WORKER_DEPLOYMENT` per un worker drenato. Un Deployment con più repliche può eseguire un riavvio continuo. La strategia `Recreate` su main termina il vecchio pod prima di pianificare il nuovo: attendersi un'interruzione pari a spegnimento, pianificazione, rimontaggio del volume e avvio.

**Verifica:** Gli endpoint di salute dei processi rispondono, le connessioni a PostgreSQL si ristabiliscono, i heartbeat dei worker riprendono in **Impostazioni > Istanze** e il workflow smoke si completa.

**Escalation:** Reperibilità piattaforma se l'avvio si blocca o falliscono le sonde; reperibilità database se l'avvio entra in loop sulle migrazioni.

## Workflow che consumano più risorse

**Gravità:** P2 quando il carico dei workflow degrada i tempi di risposta; P1 se minaccia la disponibilità di database, worker o del servizio pubblico.

**Diagnosi**

Workflow recenti classificati per durata totale trascorsa registrata:
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Per identificare i workflow ad alto volume, rieseguire la stessa query con `ORDER BY recorded_runs DESC`.

Workflow recenti classificati per durata media con almeno 5 esecuzioni:
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

Gli ID di workflow NULL possono rappresentare attività di chat o assistente. I record di trace non vengono generati per le esecuzioni di prova non salvate nell'editor del canvas.

Correlare il tempo del database con l'esecuzione a livello di nodi. Visualizzare i colli di bottiglia dei nodi nella [scheda Traces](../tabs/traces-tab.md). Correlare l'esecuzione dei workflow con i picchi di CPU, memoria e connessioni al database di host/pod.

**Mitigazione**

1. Per una tempesta di produttori esterni, limitare il consumatore webhook o API all'ingress o all'API gateway prima di modificare le definizioni dei workflow.
2. Un amministratore dell'istanza con accesso al workflow può sospendere i suoi trigger automatici tramite l'endpoint supportato:
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   La sospensione dei trigger automatici non interrompe i lavori già in esecuzione o in coda. Impedisce future chiamate pianificate, webhook e polling.

3. Per un'installazione cluster, impostare la capacità dei worker sotto **Impostazioni > Istanze** o spostare il traffico regolando i pesi dei worker.
4. Se un'esecuzione attiva identificata deve essere interrotta, richiedere l'annullamento utilizzando il suo esatto ID di esecuzione:
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Confermare lo stato finale nella cronologia e la rimozione dal registro. `cancel_requested` è asincrono: i nodi cooperativi si arrestano ai limiti di passaggio, mentre le chiamate HTTP o LLM prolungate completano la richiesta corrente prima di terminare.

**Verifica:** La frequenza di esecuzione diminuisce, la CPU e la memoria dei worker tornano alla baseline, il conteggio delle connessioni al database si stabilizza e i workflow a priorità normale riprendono secondo la pianificazione.

**Escalation:** Proprietario del workflow per verificare la logica o ridurre la frequenza di pianificazione; reperibilità piattaforma se l'annullamento non interrompe l'esecuzione.

## Accumulo nella coda o esecuzioni apparentemente bloccate

**Gravità:** P2 quando la latenza della coda supera le soglie aziendali; P1 quando la crescita della coda minaccia i limiti di archiviazione o di connessione al database.

**Diagnosi**

Eseguire un'istantanea delle righe della coda non completate. Il filtro di stato include i lavori incompiuti più vecchi, non solo i nuovi arrivi.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| Stato | Interpretazione | Azione |
| --- | --- | --- |
| `held` | In attesa dello slot di concorrenza di produzione del workflow | Ispezionare il limite di concorrenza di quel workflow nelle impostazioni |
| `pending` | In attesa di assegnazione a un worker | Verificare l'idoneità e il conteggio delle istanze attive di seguito |
| `running` | Assegnato a un worker, esecuzione attiva | Verificare il heartbeat del worker e lo stato dei thread |
| `waiting_hitl` | In pausa per approvazione umana | Stato previsto; verificare con il proprietario del workflow |
| `cancel_requested` | Annullamento confermato, in attesa del limite di passaggio | Monitorare l'arresto; scalare in caso di stallo |

Verificare la presenza di esecuzioni obsolete o orfane il cui worker assegnato ha smesso di inviare heartbeat:

1. Nelle installazioni a istanza singola, confermare che il servizio main disponga di capacità di concorrenza residua.
2. Aprire **Impostazioni > Istanze** come amministratore di istanza, o richiedere:
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Verificare `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, l'anzianità del heartbeat, la latenza del DB e la disponibilità della sandbox (`docker_ok`). Un'istanza richiede sia idoneità che liveness per ricevere lavoro distribuito. Il nome storico `docker_ok` copre anche la raggiungibilità della sandbox Kubernetes.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

La vista SQL dei heartbeat è una prova, non un calcolo completo di compatibilità. Utilizzare l'API amministrativa per la logica di compatibilità e rotazione delle chiavi. I heartbeat vengono eseguiti ogni 10 secondi; un'anzianità superiore a 30 secondi indica partizionamento di rete o processi worker bloccati.

**Mitigazione**

1. Se i worker sono sani ma saturi, scalare le repliche dei worker o aggiungere istanze seguendo [Scalabilità del cluster](#verifiche-della-modalità-cluster).
2. Per un'esecuzione orfana su un worker non funzionante, avviare il ripristino o annullare l'esecuzione utilizzando [Ripristino dell'esecuzione](#riavvio-controllato-del-servizio).
3. Se le esecuzioni in attesa dipendono da un worker disabilitato o incompatibile, riabilitare il worker o aggiornare le sue credenziali in **Impostazioni > Istanze**.
4. Se la coda è inondata di richieste duplicate da una tempesta di nuovi tentativi esterni, sospendere il trigger all'ingress o utilizzare [Pausa workflow](#workflow-che-consumano-più-risorse).

**Verifica:** La lunghezza della coda scende, le esecuzioni in sospeso passano allo stato running entro la latenza prevista e i heartbeat mostrano la capacità attiva dei worker.

**Escalation:** Reperibilità piattaforma per blocchi nel dispatch dello scheduler; reperibilità database se le query di polling della coda mostrano conflitti di lock.

## Verifiche della modalità cluster

**Gravità:** P2 per worker non in linea o capacità degradata; P1 se il coordinamento del cluster fallisce completamente.

**Diagnosi**

La vista SQL dei heartbeat fornisce una panoramica di tutte le istanze.

Campi chiave:

- `compatible`: Deve essere `true`. Un worker incompatibile viene escluso dall'assegnazione.
- `heartbeat_age_seconds`: Valori superiori a 30 secondi indicano possibili partizioni di rete o processi worker bloccati.
- `weight`: Capacità relativa del worker. Un peso di 0 disabilita l'assegnazione a quell'istanza.
- `credentials_complete`: Deve essere `true` per i workflow che richiedono credenziali condivise.

**Mitigazione**

1. Per un worker non in linea, verificare lo stato di pod/container e i log sull'host del worker. Seguire [Riavvio del servizio](#riavvio-controllato-del-servizio).
2. Per un worker incompatibile, verificare le versioni dell'immagine in tutte le istanze del cluster. Tutte le istanze devono eseguire la stessa release. Seguire [Distribuzione errata](#distribuzione-errata-o-regressione-di-configurazione).
3. In caso di credenziali mancanti, aggiornare le credenziali condivise dall'istanza main in **Impostazioni > Credenziali**.
4. Per drenare correttamente un worker per manutenzione, impostare il suo peso su 0 o disattivare **On** sotto **Impostazioni > Istanze**. Consentire il completamento dei lavori in corso prima dell'arresto.

**Verifica:** Il heartbeat del worker riprende entro 30 secondi, `compatible` è `true` e il workflow di prova viene assegnato al worker ripristinato.

**Escalation:** Reperibilità piattaforma per partizionamento di rete tra istanze o contesa di lock sul database condiviso.

## Istanza main non disponibile mentre i worker sono attivi

**Gravità:** P1. Main coordina la pianificazione, serve la UI/API e gestisce lo stato del cluster.

**Diagnosi**

1. Confermare lo stato del processo main e l'utilizzo delle risorse utilizzando la [Configurazione dei comandi](#configurazione-dei-comandi).
2. Verificare la connettività al database dall'host main. I worker possono continuare a elaborare le esecuzioni memorizzate localmente nella cache mentre main non è raggiungibile.
3. Verificare il routing del reverse proxy / ingress verso l'istanza main.

**Mitigazione**

1. Se main è andato in crash a causa di OOM o eccezione non gestita, riavviare main seguendo [Riavvio controllato del servizio](#riavvio-controllato-del-servizio).
2. Se main è in attesa di un lock di database trattenuto da un worker caduto, seguire [Connessioni e blocchi](#connessioni-db-attive-saturazione-del-pool-e-blocchi).
3. In Kubernetes, verificare che la strategia `Recreate` abbia completato la terminazione del pod prima di pianificare il sostituto.

**Verifica:** L'interfaccia pubblica si carica, l'endpoint di integrità dell'API risponde con HTTP 200, i heartbeat dei worker del cluster tornano a fare report a main e il canvas dell'editor funziona correttamente.

**Escalation:** Incident Commander immediatamente; reperibilità piattaforma per guasti di archiviazione o di nodo.

## Errori di webhook, MCP, Portal o streaming

**Gravità:** P2 per degradazione specifica dell'endpoint; P1 se i webhook pubblici falliscono silenziosamente su tutti i workflow.

**Diagnosi**

1. Per errori di webhook, verificare routing dell'ingress, terminazione SSL e configurazione del prefisso di percorso. Confermare che l'endpoint webhook esista e sia attivo.
2. Per errori di streaming SSE, verificare le impostazioni di buffering del proxy. I proxy di ingress (nginx, traefik, envoy) devono disabilitare il buffering delle risposte (`X-Accel-Buffering: no` o equivalente) per `/api/chat/stream` e lo streaming di esecuzione dei workflow.
3. Per errori MCP, verificare la validità della chiave API MCP, la configurazione del trasporto (SSE vs stdio) e la registrazione dello strumento in **Impostazioni > MCP**.
4. Esaminare i log di errore su main per rilevare errori di autorizzazione, payload JSON non validi o rifiuti della convalida dello schema.

**Mitigazione**

1. Disabilitare il buffering del proxy sui percorsi di streaming a livello di ingress o reverse proxy.
2. In caso di rifiuto del payload del webhook, verificare la struttura JSON rispetto alla specifica del trigger del workflow. Aggiornare il chiamante esterno se i payload sono malformati.
3. In caso di interruzioni della connessione MCP, riavviare la sessione del client MCP interessato o riautenticarsi con un nuovo token.

**Verifica:** Il webhook di test risponde con HTTP 200/202, lo stream SSE fornisce blocchi incrementali senza stalli e il client MCP elenca correttamente gli strumenti.

**Escalation:** Reperibilità rete per problemi di ingress/buffering; autore del workflow per discrepanze nello schema del payload.

## Problemi di container, pod, OOM o archiviazione

**Gravità:** P1 se interessati main o il database; P2 per riavvii isolati di worker.

**Diagnosi**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Controllare il file system reale del volume dati e l'host del database oltre all'host shell. Stato del container di sola lettura senza valori di ambiente:
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Ispezionare OOMKilled rispetto a sonde fallite, download dell'immagine, pianificazione Pending, pressione dei nodi ed errori di attacco/montaggio del volume. I log precedenti esistono solo quando il pod è stato riavviato senza essere ripianificato.

## Distribuzione errata o regressione di configurazione

**Gravità:** P1 se falliscono le connessioni di produzione, l'elaborazione dei job o le migrazioni; P2 per regressioni isolate delle funzionalità.

**Diagnosi:** Confrontare l'ora di inizio dell'errore con il rollout, i digest effettivi dell'immagine, la revisione di configurazione/secret, lo stato delle migrazioni e l'ultima modifica confermata. Ispezionare la cronologia delle distribuzioni e i diff sanificati. Non incollare mai variabili di ambiente complete, secret renderizzati da Compose o dati Secret di Kubernetes in una segnalazione di incidente.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Mitigazione**

1. Arrestare il rollout e bloccare il traffico esterno se gli errori minacciano l'integrità dei dati o si propagano alle dipendenze.
2. Verificare l'ultimo digest dell'immagine, commit Git e revisione Helm/manifesto noti come funzionanti. Ispezionare i diff recenti di ConfigMap, Secret e ambiente.
3. Se compatibile con lo schema, ripristinare l'immagine/configurazione approvata utilizzando gli strumenti di distribuzione. Eseguire il rollback a una specifica revisione testata, non a una presunta precedente:
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. Il rollback di un Deployment ripristina il template del pod; non ripristina i valori esterni di Secret o ConfigMap se sono stati sovrascritti. Annullare le modifiche di configurazione in parallelo.
5. Non eseguire mai il downgrade di un'immagine di release oltre una migrazione incompatibile dello schema del database. Se una migrazione ha apportato modifiche irreversibili a tabelle o colonne, correggere in avanti con una patch testata o ripristinare il database tramite [Disaster recovery](#disaster-recovery-e-risposta-alle-emergenze).
6. Dopo il rollback, riavviare i worker dipendenti per garantire che l'intera flotta esegua la stessa versione di release.

**Verifica:** I controlli di salute rispondono con 200, i worker segnalano la stessa versione in **Impostazioni > Istanze**, la versione di migrazione dello schema corrisponde a quella di destinazione e il workflow smoke riesce.

**Escalation:** Incident Lead e ingegnere di release immediatamente per P1. Coinvolgere l'amministratore del database se è necessaria la pulizia delle migrazioni o il ripristino dello schema.

## Errore di modello, credenziale o integrazione

**Gravità:** P2 in caso di interruzione di un provider specifico o limiti di frequenza; P1 se nessun modello configurato risponde per i workflow.

**Diagnosi**

1. Distinguere tra interruzione del provider, scadenza/revoca delle credenziali, limiti di frequenza (HTTP 429) e timeout di rete.
2. Controllare le pagine di stato dei provider (OpenAI, Anthropic, Google AI, ecc.).
3. Testare la validità delle credenziali da **Impostazioni > Credenziali** utilizzando il pulsante di test integrato.
4. Controllare i log dell'applicazione per identificare la classificazione dell'errore: `RateLimitError`, `AuthenticationError`, `InvalidRequestError` o `APIConnectionError`.

**Mitigazione**

1. Per limiti di frequenza (429), commutare i nodi del workflow su una credenziale o un modello di fallback con quota disponibile.
2. Per credenziali scadute, ruotare la chiave in **Impostazioni > Credenziali**. Heym aggiorna le credenziali condivise su tutti i worker del cluster.
3. Per interruzioni dei provider a monte, sospendere temporaneamente i workflow interessati o configurare un routing alternativo del modello.

**Verifica:** Il test delle credenziali ha esito positivo nella UI, l'esecuzione dell'agente si completa senza errori HTTP 4xx/5xx e i ritardi di riesecuzione per limite di frequenza si azzerano.

**Escalation:** Proprietario delle credenziali / team lead per fatturazione o rigenerazione delle chiavi; supporto del provider esterno per interruzioni estese.

## Errore di sandbox

**Gravità:** P2 per errori isolati dei nodi di codice; P1 se l'esecuzione in sandbox è richiesta per workflow critici.

**Diagnosi**

1. Identificare la modalità di esecuzione della sandbox: processo locale, container Docker o pod sandbox di Kubernetes.
2. Verificare la reattività del demone Docker sull'host di sandbox o la pianificazione dei pod sandbox di Kubernetes.
3. Kubernetes: ispezionare i pod sandbox nel namespace configurato, i relativi eventi e NetworkPolicy. Le sandbox possono utilizzare un namespace separato:
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Verificare la configurazione di `HEYM_SANDBOX_BACKEND` e le impostazioni specifiche della sandbox nelle variabili di ambiente.
5. Se i container Docker falliscono, assicurarsi che il socket Docker sia montato e che l'utente Heym disponga dei permessi per interagire con il demone.
6. Per le sandbox Kubernetes, assicurarsi che il ServiceAccount disponga dei permessi per creare e gestire pod nel namespace di sandbox.

**Verifica:** Il nodo di codice viene eseguito correttamente nella sandbox isolata, restituisce gli output previsti e le risorse della sandbox vengono liberate dopo l'esecuzione.

**Escalation:** Reperibilità piattaforma per problemi del demone Docker a livello di host o guasti dell'infrastruttura di sandbox Kubernetes.

## Disaster recovery e risposta alle emergenze

**Gravità:** P1 per perdita catastrofica di dati, guasto dell'host o distruzione completa dell'ambiente.

**Procedura**

1. Dichiarare l'incidente di emergenza e nominare un Incident Commander. Informare le parti interessate tramite i canali di emergenza definiti.
2. Isolare l'ambiente danneggiato per prevenire ulteriori perdite di dati o scritture contrastanti. Evitare che vecchie e nuove installazioni elaborino contemporaneamente lo stesso carico di lavoro.
3. Ripristinare PostgreSQL tramite la sua procedura testata di backup/PITR nell'ambiente di ripristino previsto. Ripristinare i dati corrispondenti di file/plugin/spazi di lavoro di codice dell'istanza main, nonché il portachiavi di crittografia e il segreto di firma richiesti da un backup sicuro. Un backup di solo database non contiene i byte dei file.
4. Avviare una singola istanza main prevista utilizzando una release compatibile con lo schema ripristinato. Ispezionare le migrazioni prima dell'avvio poiché l'entrypoint di main le esegue. I worker non devono entrare in conflitto con le migrazioni.
5. Mantenere l'ingress di produzione e i produttori isolati durante le verifiche. Un'istanza main avviata può eleggere un leader ed eseguire pianificazioni/ripristini recuperati; utilizzare le restrizioni di rete documentate e i controlli di trigger/ripristino dei workflow prima dell'avvio. Ripristinare i dati non è un'anteprima passiva.
6. Riconciliare i record attivi/in coda/in sospeso e qualsiasi riesecuzione automatica con i proprietari. Il ripristino riavvia le esecuzioni idonee dall'inizio e non può annullare gli effetti a valle. Non rieseguire ogni riga non riuscita o saltata.
7. Convalidare letture/scritture DB, accesso, decrittografia delle credenziali, file di Drive, plugin, accesso allo spazio di lavoro degli agenti di codice e workflow smoke approvati (solo main e distribuibili). Aggiungere gradualmente worker compatibili, quindi riaprire l'acquisizione e l'ingress.
8. Registrare l'intervallo effettivo di perdita dei dati, la durata del ripristino, il lavoro ignorato e la riconciliazione in sospeso. Organizzare un altro test di ripristino se questa procedura ha rivelato lacune.

**Verifica:** Il controllo di verifica condiviso ha esito positivo, le pianificazioni critiche riprendono, i proprietari accettano la riconciliazione e il monitoraggio di backup/ripristino viene ristabilito. Un'installazione vuota sana non costituisce ripristino.

**Escalation:** Incident Lead insieme a responsabili database, archiviazione e piattaforma costantemente. Non improvvisare riparazioni distruttive delle directory dei dati né attivazioni su doppio sito.

## Modello per prove e passaggio di consegne
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Acquisire log e ID circoscritti; rimuovere valori di credenziali, intestazioni di autorizzazione, link di capacità, payload utente e parametri SQL prima di allegare prove. Gli eventi di audit del router sono su stdout di main. La cronologia delle esecuzioni registra l'istanza esecutrice; i guasti di esecuzione possono quindi richiedere log sia dai worker che da main.

## Riferimenti di implementazione

Questi percorsi identificano l'implementazione verificata durante la stesura di questo runbook. Convalidarli nuovamente quando cambiano i comportamenti di esecuzione, distribuzione o schema.

| Argomento | Sorgente |
| --- | --- |
| Servizi di integrità e avvio | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Impostazioni di pool e tag di connessione | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Conteggio processi e migrazioni | [Entrypoint backend](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Entrypoint di release](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Topologia di distribuzione e mappature dell'ambiente reale | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Esempio di cluster](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Esempio di worker](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Idoneità e liveness del registro | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [API del cluster](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Posizionamento, stati della coda e dispatch | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Leadership e manutenzione | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Ripristino e cancellazione | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoint di sospensione/ripresa/annullamento workflow | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Definizioni di tabelle e colonne di diagnostica | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Interpretazione di capacità e costi | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |

# Heym Incident Playbook (L0)

Utilizzi questo playbook per confermare un incidente di Heym, valutare l'impatto sugli utenti, selezionare il livello di gravità e individuare la corretta procedura di ripristino e il relativo referente.

Procedure dettagliate: [Heym Runbook (L1)](./operations-runbook.md)

Ultima revisione: 2026-11-10. Ambito: Heym self-hosted, istanza singola o cluster, su Docker Compose o Kubernetes.

## Passaggio di consegne del deployment (Handover)

Compili questa tabella per ciascun ambiente prima di utilizzare questi documenti durante il servizio di reperibilità (on-call). Nomi, URL, obiettivi di capacità e di ripristino dipendono dallo specifico deployment. Gli esempi nel repository non costituiscono un inventario di produzione.

| Elemento | Valore del deployment |
| --- | --- |
| Ambiente e URL pubblica di Heym | `<environment>`, `<public-url>` |
| Reperibilità piattaforma e sostituto | `<rotation-or-contact>`, `<backup-contact>` |
| Canale di gestione e tracker dell'incidente | `<channel>`, `<tracker-url>` |
| Reperibilità database e identificatore database | `<contact>`, `<database-id>` |
| Referenti per infrastruttura, rete e archiviazione | `<contacts>` |
| Responsabile di release e sistema di deployment | `<contact>`, `<deployment-url>` |
| Dashboard per errori applicativi, latenza e disponibilità | `<dashboard-url>` |
| Dashboard per CPU, memoria, disco e riavvii di host o pod | `<dashboard-url>` |
| Dashboard per connessioni, lock, disco e replica di PostgreSQL | `<dashboard-url>` |
| Log e backend facoltativo di tracing OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Progetto/file Compose o contesto/namespace Kubernetes | `<exact-target>` |
| Posizioni di main, worker, database e storage | `<services-or-deployments>`, `<storage-ids>` |
| Smoke workflow approvato ed esito atteso | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procedura di backup per database e file, ultimo test di ripristino | `<procedure-url>`, `<test-date>` |
| Obiettivi del tempo di ripristino (RTO) e del punto di ripristino (RPO) | `<RTO>`, `<RPO>` |

Conservi i contatti e i link alle dashboard nella copia operativa ad accesso limitato del deployment. Le evidenze devono contenere ID, timestamp, conteggi ed errori ripuliti piuttosto che credentials o payload di workflow.

## Inventario della piattaforma

| Componente | Responsabilità | Implicazione in caso di incidente |
| --- | --- | --- |
| Frontend e backend principale (main) | UI, API, MCP, Portal, esecuzione interattiva | Verifichi la route pubblica e il processo main separatamente |
| PostgreSQL | Stato applicativo, registro esecuzioni, coda di esecuzione, slot di concorrenza, coordinamento e notifiche | Un'interruzione del database può bloccare sia la gestione delle richieste che l'esecuzione in background |
| Istanze worker, se la modalità cluster è attiva | Esecuzioni in background idonee presenti in coda | I worker integri non sostituiscono gli endpoint pubblici della main |
| Processo leader eletto | Cron, valutazione degli avvisi, coordinamento in background | Un worker compatibile può diventare leader; questo non modifica il suo ruolo in main |
| Storage persistente di main | File di Drive, plugin installati e workspace di agent di codice | Ripristini lo storage insieme alla main; instradare l'ingress su un worker non lo ripristina |
| Backend sandbox su ogni istanza di esecuzione | Container Docker o pod Kubernetes per esecuzione isolata | Un backend sandbox guasto può influire su nodi specifici mentre la UI continua a funzionare |
| Dipendenze di workflow | Provider di modelli, server MCP, API esterne, data store e servizi di messaggistica | Determini se sta fallendo una singola dipendenza o l'intera piattaforma |
| Collettore OTel facoltativo | Span esportati di workflow, nodi e strumenti Agent | L'assenza di tracce esportate non costituisce di per sé prova del fallimento dell'esecuzione |

La coda di esecuzione integrata di Heym utilizza PostgreSQL. Redis, RabbitMQ e i vector store possono essere dipendenze di workflow; non sono servizi obbligatori per la coda interna.

`GET /api/health` riporta esclusivamente l'integrità del processo e la sua versione. Non testa PostgreSQL, la coda, l'elezione del leader, la capacità sandbox o la sincronizzazione dei credentials. Un esito positivo è un controllo isolato, non una garanzia di operatività end-to-end.

## Primi cinque minuti

| Passo | Azione | Decisione o evidenza |
| --- | --- | --- |
| 1 | Rispondere all'avviso e verificare ambiente, servizio e orario di inizio | Registrare i timestamp UTC e l'ultima modifica di release/configurazione |
| 2 | Verificare la UI pubblica e `/api/health`, poi il backend main diretto | Un errore pubblico con backend diretto integro indica problemi di routing o frontend |
| 3 | Verificare connettività e carico di connessioni di PostgreSQL | Instradare i guasti al database al livello L1 prima di riavviare i servizi applicativi |
| 4 | Controllare lo stato di container/pod, CPU, memoria, disco ed errori recenti | Distinguere guasti infrastrutturali, sovraccarico e fallimenti specifici del workflow |
| 5 | In modalità cluster, verificare **Impostazioni > Istanze**, code ed evidenze del leader | Riconoscere la perdita della main, worker offline/non allineati o carichi esclusivi della main |
| 6 | Assegnare la gravità e avviare una contromisura dalla tabella di routing | Per incidenti P1/P2, aprire subito una segnalazione e coinvolgere il relativo referente |
| 7 | Verificare l'esecuzione sicura di un workflow in produzione e osservare il ripristino | Verificare che l'età della coda, gli errori e le risorse migliorino; fissare il prossimo aggiornamento |

Se una release coincide con il guasto, consulti [Deployment errato o regressione di configurazione](./operations-runbook.md#bad-deployment-or-configuration-regression). Verifichi la compatibilità dello schema prima di procedere al rollback.

## Gravità e risposta

Questi sono obiettivi indicativi di intervento. Applichi la policy e l'impatto di business specifici del deployment qualora siano più rigorosi.

| Gravità | Esempi | Risposta |
| --- | --- | --- |
| P1 | Istanza main non disponibile per tutti gli utenti; database inaccessibile o scritture fallite; blocco generalizzato delle esecuzioni; canali critici di input bloccati su tutti i workflow | Mitigazione immediata, apertura incidente, reperibilità per piattaforma e dipendenze |
| P2 | Accumulo crescente in coda; perdita di capacità dei worker; saturazione imminente delle connessioni; un singolo workflow che degrada la capacità condivisa; crash OOM ripetuti | Avviare subito le contromisure, contenimento entro 15 minuti, apertura incidente |
| P3 | Guasto isolato di un workflow o di un provider; impatto circoscritto con capacità complessiva integra | Referente del workflow o della dipendenza, tracciamento del follow-up e nota di reperibilità |
| P4 | Segnalazione informativa, trend di capacità atteso, falso positivo verificato | Prendere in carico, documentare e calibrare il monitoraggio se necessario |

## Routing dei segnali verso L1

Utilizzi queste ancore relative per la configurazione dei link negli avvisi. Se un servizio di monitoraggio richiede un URL assoluto, aggiunga come prefisso l'indirizzo della Sua copia operativa ospitata.

| Segnale | Iniziare qui |
| --- | --- |
| UI/API non disponibile, 5xx pubblici, fallimento healthcheck di processo | [UI o API inaccessibile](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL non raggiungibile, connessione rifiutata, fallimento di scrittura | [Database non operativo](./operations-runbook.md#postgresql-down-or-not-writable) |
| Troppi client, timeout del pool, attese su lock, picco di connessioni attive | [Connessioni e lock del database](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Richiesto riavvio controllato di backend o worker | [Riavvio del servizio](./operations-runbook.md#controlled-service-restart) |
| Picco nel conteggio esecuzioni, durata complessiva, token, CPU o memoria | [Workflow a maggior consumo di risorse](./operations-runbook.md#most-resource-consuming-workflows) |
| Coda in crescita, esecuzioni in attesa o apparentemente bloccate | [Arretrato nella coda](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Istanza offline o con versione errata, worker inattivo, problema di pianificazione o distribuzione | [Controlli modalità cluster](./operations-runbook.md#cluster-mode-checks) |
| Perdita della main mentre i worker restano operativi | [Istanza main non disponibile](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Errori Webhook, anomalie MCP/Portal, disconnessioni dello streaming SSE | [Endpoint di ingress ed esecuzione](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disco pieno, guasto ai volumi persistenti | [Problemi di container, pod o storage](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Errori provider Agent/LLM/MCP, codice 429, fallimento dei credentials | [Guasto su modelli o integrazioni](./operations-runbook.md#model-credential-or-integration-failure) |
| Errori sandbox per Code, Playwright, skill o agent di codice | [Guasto della sandbox](./operations-runbook.md#sandbox-failure) |
| Impossibile raggiungere gli obiettivi di ripristino; database o file persi | [Ripristino e disaster recovery](./operations-runbook.md#recovery-and-disaster-response) |

## Escalation

| Rilevazione | Coinvolgere | Fornire |
| --- | --- | --- |
| Molteplici interfacce o workflow impattati | Reperibilità piattaforma e Incident Lead | Ambiente, perimetro, orario di inizio, azioni intraprese, prossimo punto |
| Database non disponibile, saturo, bloccato o disco esaurito | Reperibilità database | ID database, numero connessioni, PID bloccanti, errori ripuliti, stato dello storage |
| Guasto di pod/nodi, aggancio storage, capacità sandbox | Referente infrastruttura/storage | Contesto, namespace, carico di lavoro, eventi pod, saturazione risorse |
| Route pubblica fallita mentre il backend diretto risponde | Referente rete/ingress | Route interessate, status code, latenza, confronto con il backend |
| Singolo workflow che monopolizza il carico o fallisce isolatamente | Proprietario del workflow | ID workflow/esecuzione, sorgente trigger, frequenza, intervallo temporale, limiti provvisori |
| Modifica correlata di release o configurazione | Responsabile di release | Digest immagine attiva, orario rollout, revisione schema, ultima versione funzionante |
| Esaurimento quote, autenticazione o disponibilità provider | Referente credential o integrazione | Provider, modello/servizio, status code, ID richiesta se sicuro; nessun valore segreto |

Se l'impatto di livello P1/P2 persiste dopo la prima mitigazione, effettui immediatamente l'escalation con le evidenze già raccolte. Non attenda l'individuazione completa della causa principale.

## Comportamento atteso in caso di guasto

| Guasto | Cosa può proseguire | Prima azione |
| --- | --- | --- |
| PostgreSQL non disponibile | Il frontend statico può continuare a caricarsi | Ripristinare l'accesso al database; non riavviare ogni istanza applicativa |
| Main non disponibile, worker integri | Le attività in background idonee e la pianificazione possono proseguire se un worker compatibile assume il ruolo di leader | Ripristinare la main con il suo storage persistente; UI/API/MCP/Portal pubblici restano non disponibili |
| Worker non disponibile | Altre istanze idonee prendono in carico i task in coda non appena riassegnati | Verificare posizionamento, capacità residua e ripristino prima di riammettere traffico |
| Esecuzione interrotta | Le esecuzioni recuperabili idonee possono ripartire dall'inizio, una sola volta | Verificare il recupero automatico ed effetti collaterali esterni prima di rieseguire manualmente |
| Sovraccarico da attività vincolate alla main | I worker possono rimanere inattivi | Ridurre l'input responsabile o incrementare le risorse della main; modificare i pesi non sposta carichi vincolati |
| Sistema di alert interno non operativo | I sistemi esterni di uptime, DB e infrastruttura possono continuare a operare | Utilizzare strumenti di monitoraggio esterni a Heym; gli alert interni dipendono dallo stesso DB e scheduler |
| Sandbox o provider non disponibile | I workflow privi di tale dipendenza possono continuare a funzionare | Circoscrivere i workflow impattati e risolvere la dipendenza |

## Ripristino e chiusura dell'incidente

1. Verifichi l'accesso pubblico, l'accesso al database, l'idoneità delle istanze previste e il corretto funzionamento di uno smoke workflow sicuro in produzione. Un test nell'editor non certifica l'assegnazione ai worker.
2. Monitori per almeno 10 minuti la stabilità di errori, latenza, impiego di risorse e la progressiva diminuzione dell'età della coda. Verifichi inoltre la successiva esecuzione schedulata critica attesa o una verifica equivalente concordata.
3. Riconcili con i proprietari dei workflow le esecuzioni fallite, recuperate, ignorate, scadute e in sospeso. Verifichi gli effetti collaterali esterni prima di rieseguire qualsiasi processo.
4. Rimuova gradualmente le sospensioni temporanee dei trigger, i limiti e i bilanciamenti dei pesi dei worker. Assegni a ciascuna restrizione residua un referente e una scadenza.
5. Aggiorni l'incidente con impatto, cronologia UTC, azioni intraprese, evidenze e rischi aperti. Pianifichi una revisione della causa principale per P1/P2 e aggiorni entrambi i documenti qualora una procedura fosse assente.

## Riferimenti operativi correlati

- [Configurazione comandi e verifiche L1](./operations-runbook.md#command-setup)
- [Esecuzione e deployment](../getting-started/running-and-deployment.md)
- [Distribuzione del carico](./cluster.md)
- [Deployment su Kubernetes](../getting-started/kubernetes.md)
- [Sicurezza e rotazione delle chiavi](./security.md)

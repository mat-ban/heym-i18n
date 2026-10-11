# Esecuzione e Deployment

Heym fornisce due script per ambienti diversi: `run.sh` per lo sviluppo locale e `deploy.sh` per i deployment in produzione tramite Docker Compose.

> **Video walkthrough:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — clonare il repository, avviare PostgreSQL, compilare le variabili d'ambiente richieste e creare il primo account su un'istanza locale.

## Prerequisiti

Entrambi gli script richiedono l'installazione dei seguenti strumenti:

| Strumento | Scopo |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Container del database (dev) e stack completo (prod) |
| [uv](https://github.com/astral-sh/uv) | Gestore di pacchetti Python per il backend |
| [bun](https://bun.sh) | Runtime JavaScript per il frontend |

## Configurazione dell'ambiente

Sia `run.sh` che `deploy.sh` leggono da un file `.env` nella root del progetto. Se non esiste, lo script ne crea automaticamente uno a partire da `.env.example` — sia per lo sviluppo locale che per la produzione.

`SECRET_KEY` e `ENCRYPTION_KEY` sono fornite vuote in `.env.example`. Quando una delle due è vuota, `run.sh` e `deploy.sh` generano automaticamente un valore crittograficamente robusto e lo riscrivono in `.env`, così una nuova configurazione non richiede alcuna gestione manuale delle chiavi. Se un `.env` esistente contiene ancora il placeholder legacy di `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), gli script si interrompono con un errore esplicito invece di sovrascriverlo — la rotazione di quella chiave renderebbe illeggibili le credenziali precedentemente cifrate. Anche il backend stesso rifiuta di avviarsi se una delle due chiavi è vuota o lasciata a un placeholder noto.

Per creare il file manualmente (opzionale — gli script lo fanno automaticamente):

```bash
cp .env.example .env
```

Variabili d'ambiente principali:

Per ogni variabile supportata, valore predefinito e nota di produzione, consultare [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabile | Descrizione |
|----------|-------------|
| `SECRET_KEY` | **Obbligatoria.** Segreto per la firma JWT. Generata automaticamente da `run.sh`/`deploy.sh` quando vuota. |
| `ENCRYPTION_KEY` | **Obbligatoria.** Chiave di cifratura delle credenziali. Generata automaticamente da `run.sh`/`deploy.sh` quando vuota. |
| `DATABASE_URL` | Override opzionale della stringa di connessione al database. Se vuota, Heym la costruisce dalle impostazioni `POSTGRES_*`. |
| `BACKEND_PORT` | Porta dell'API backend — valore predefinito `10105` |
| `FRONTEND_PORT` | Porta del frontend — valore predefinito `4017` |
| `FRONTEND_URL` | **Obbligatoria in produzione.** URL pubblico dell'applicazione (schema + host, ad es. `https://heym.example.com`). Utilizzata per gli URI di redirect OAuth (Google Sheets, BigQuery, Notion e simili) e per i link di revisione, follow-up Codex e file generati dalle esecuzioni in background; deve corrispondere all'URL utilizzato dagli utenti nel browser. In un cluster, impostare lo stesso valore su ogni istanza. |
| `ALLOW_REGISTER` | Registrazione utenti aperta (`false` in prod, `true` in dev). Impostare a `false` solo dopo che l'account amministratore esiste — non esiste un bootstrap del primo utente, quindi un database vuoto con la registrazione disabilitata non lascia alcun modo per crearne uno. |
| `DOCKER_LOGS_ENABLED` | Abilita l'accesso alla scheda Logs basata su Docker quando impostata a `true`; richiede anche l'accesso al socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Elenco separato da virgole di email di utenti fidati autorizzati ad accedere ai log Docker quando `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Dimensione massima del corpo delle richieste HTTP accettata prima dell'esecuzione degli handler degli endpoint; valore predefinito `100`, un MB sopra `FILE_MAX_SIZE_MB` per lasciare spazio all'overhead multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Modalità di esecuzione degli strumenti Python definiti dall'utente: `auto` (predefinita — container Docker isolato e rafforzato; fail closed se Docker non è disponibile), `docker` (identica, senza fallback), oppure `subprocess` (fallback locale in-process; non è un confine di sicurezza, solo per ambienti fidati/dev). `run.sh` imposta `subprocess` per lo sviluppo nativo. Consultare [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Immagine utilizzata per il sandbox Docker degli strumenti Python. Vuota = rilevamento automatico dell'immagine backend in esecuzione. |

I valori predefiniti di connessione al database (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) sono documentati in [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) e in `.env.example`.

---

## Sviluppo: `run.sh`

`run.sh` avvia tutti e tre i servizi in locale — il database (come container Docker), il backend FastAPI e il server di sviluppo Vite — con un unico comando.

```bash
./run.sh
```

**Cosa esegue, passo per passo:**

1. Verifica che `docker`, `bun` e `uv` siano disponibili
2. Crea `.env` da `.env.example` se mancante e genera un `SECRET_KEY` e una `ENCRYPTION_KEY` casuali quando uno dei due è vuoto
3. Avvia (o crea) un container Docker del database sulla porta `6543`, memorizzando i dati nel volume Docker `heym-postgres-data` anziché in una directory dell'host
4. Installa le dipendenze Python tramite `uv sync`
5. Esegue le migrazioni del database Alembic (`alembic upgrade head`)
6. Libera le porte del backend e del frontend se occupate
7. Avvia il backend FastAPI con `--reload` (hot-reload alle modifiche del codice)
8. Installa le dipendenze del frontend tramite `bun install`
9. Avvia il server di sviluppo Vite

**Opzioni:**

| Flag | Descrizione |
|------|-------------|
| *(nessuna)* | Avvia con il logging di debug abilitato (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Avvia con il livello di log predefinito (nessun output di debug) |
| `--help` | Mostra le informazioni di utilizzo |

**Indirizzi dei servizi (dev):**

| Servizio | Indirizzo |
|---------|---------|
| Frontend | `localhost` su `FRONTEND_PORT` (predefinita: 4017) |
| Backend API | `localhost` su `BACKEND_PORT` (predefinita: 10105) |
| Documentazione API interattiva | `localhost:10105/docs` |
| Database | `localhost:6543` |

Premere `Ctrl+C` per arrestare in modo controllato tutti i servizi.

---

## Test End-to-End: `run_e2e.sh`

La suite Playwright del frontend viene eseguita sull'applicazione Vue reale, sul backend FastAPI e su un database PostgreSQL isolato:

```bash
./run_e2e.sh
```

La suite è una suite di smoke e regressione sui percorsi chiave, non una copertura esaustiva del prodotto. Copre l'autenticazione, il ciclo di vita e l'esecuzione dei workflow principali, risorse selezionate della dashboard, le route pubbliche e un'interfaccia di revisione HITL simulata. Le integrazioni con i provider, ogni tipo di nodo, le matrici di condivisione/permessi e l'esecuzione completa del resume HITL restano coperte principalmente dai test del backend o richiedono ambienti di integrazione dedicati.

Ogni esecuzione ottiene un proprio container PostgreSQL 16 temporaneo, porte casuali disponibili per database/backend/frontend, stato di autenticazione, risultati dei test e report HTML. Ciò consente a più processi `run_e2e.sh` di essere eseguiti contemporaneamente senza condividere stato o sovrascrivere artefatti. Lo script rimuove il proprio container del database al termine dell'esecuzione e stampa la directory degli artefatti e il percorso del report.

Comandi utili:

```bash
./run_e2e.sh --ui         # Runner Playwright interattivo con un database isolato
cd frontend
bun run test:e2e:report   # Apre l'esecuzione locale completata più di recente
```

Le esecuzioni dirette di `bun run test:e2e` e `bun run test:e2e:ui` richiedono un `DATABASE_URL` esplicito, in modo che non possano avviarsi silenziosamente contro il database di sviluppo locale. Utilizzare `./run_e2e.sh` per le normali esecuzioni locali.

`./check.sh` esegue lint, typecheck, formattazione e test del backend senza la suite E2E, mantenendo veloce il percorso di verifica locale predefinito. Eseguire i test Playwright E2E separatamente con `./run_e2e.sh`. Le pull request eseguono sempre la suite E2E Chromium in GitHub Actions e conservano tracce, screenshot, video e il report HTML in caso di errori.

---

## Produzione: `deploy.sh`

`deploy.sh` compila ed esegue l'intero stack tramite Docker Compose. Tutti e tre i servizi — database, backend e frontend — vengono eseguiti come container. L'entrypoint del backend esegue automaticamente le migrazioni prima di avviare il server con 8 worker.

**Deploy iniziale (build + avvio):**

```bash
./deploy.sh
```

Questo esegue un deploy senza downtime: le immagini vengono compilate per prime mentre i container esistenti continuano a funzionare, poi la nuova versione viene sostituita.

**Comandi disponibili:**

| Comando | Descrizione |
|---------|-------------|
| `./deploy.sh` | Compila le immagini e avvia/aggiorna tutti i servizi |
| `./deploy.sh --status` | Mostra lo stato dei container |
| `./deploy.sh --logs` | Trasmette i log da tutti i container |
| `./deploy.sh --restart` | Riavvia tutti i container |
| `./deploy.sh --down` | Arresta e rimuove tutti i container |
| `./deploy.sh --migrate-pgdata` | Migrazione una tantum: copia una directory `data/postgres` esistente nel volume Docker `heym-postgres-data` e ricostruisce i relativi indici |
| `./deploy.sh --help` | Mostra le informazioni di utilizzo |

**Archiviazione del database: un volume Docker con nome, non una directory host.**

Compose archivia PostgreSQL nel volume Docker `heym-postgres-data`. Le versioni precedenti montavano invece la directory host `./data/postgres` tramite bind mount. I bind mount host su macOS (virtiofs) e Windows/WSL2 non forniscono a PostgreSQL le garanzie di `fsync` e chiusura file che richiede: i cluster in tali ambienti incorrono in `PANIC: could not close file … Input/output error` sui segmenti WAL e si corrompono nel tempo. I bind mount su Linux non sono mai stati interessati, ma ora ogni piattaforma utilizza lo stesso layout.

L'aggiornamento di un deployment che contiene ancora dati in `./data/postgres` è un passaggio una tantum. `./deploy.sh` lo rileva, si arresta prima della compilazione e richiede di eseguire prima la migrazione:

```bash
./deploy.sh --migrate-pgdata   # arresta i servizi, copia nel volume, ricostruisce gli indici
./deploy.sh                    # esegue il deploy come di consueto
```

**La migrazione ricostruisce anche gli indici.** La copia è byte per byte, quindi eventuali danni agli indici causati dal vecchio bind mount vengono trasferiti con essa. `--migrate-pgdata` avvia pertanto il solo servizio `postgres` sul nuovo volume, esegue `reindexdb` su di esso e lo arresta nuovamente prima che venga avviato il resto dello stack. Questo è importante perché questa classe di corruzione lascia voci di indice che puntano oltre la fine dell'heap — uno stato che `pg_amcheck` segnala come integro, quindi un controllo superato non è prova di una tabella sana. REINDEX ripara tali voci; non può ripristinare le pagine dell'heap che il vecchio filesystem ha già perso. Su un database di grandi dimensioni e noto come integro è possibile bypassare la ricostruzione con `./deploy.sh --migrate-pgdata --skip-reindex`.

La copia è non distruttiva. `./data/postgres` rimane in posizione come backup e la migrazione rifiuta di sovrascrivere un volume che contiene già un database. Se un passaggio fallisce, il nuovo volume viene rimosso, così un cluster migrato a metà non può mai essere distribuito per errore. Eliminare la vecchia directory una volta confermato che i Workflow sono intatti. Il container `postgres` porta la stessa protezione, quindi anche un `docker compose up` manuale non può inizializzare silenziosamente un database vuoto sopra i dati. Le installazioni nuove non richiedono alcuna azione.

**Indirizzi dei servizi (produzione):**

Il container frontend è esposto su `FRONTEND_PORT` (predefinito: 4017). L'API del backend è servita sotto il percorso `/api`, con proxy attraverso il container frontend — quindi in produzione esiste un solo porto esposto pubblicamente.

**Panoramica dei container:**

| Container | Descrizione |
|-----------|-------------|
| `heym-db` | Database relazionale |
| `heym-backend` | Server API FastAPI (8 worker, compilato da `backend/Dockerfile`) |
| `heym-frontend` | Container di anteprima frontend che serve l'app Vue compilata (compilato da `frontend/Dockerfile`) |

**Badge di aggiornamento versione:**

L'intestazione dell'app mostra la versione della build Docker in esecuzione. Quando tale versione è precedente all'ultima release GitHub di Heym, accanto alla versione appare un badge viola **Update**. Fare clic sulla versione o sul badge per aprire la pagina delle release GitHub di Heym.

---

## Immagine precompilata: `docker run`

Se si preferisce non compilare l'applicazione localmente, è possibile scaricare l'immagine container pubblicata ed eseguirla direttamente.

L'immagine avvia frontend e backend insieme in un unico container. PostgreSQL rimane esterno, ma è possibile fornire sia `DATABASE_URL` sia le variabili `POSTGRES_*` da `.env.example`.

> **Archiviare il database in un volume nominato Docker.** L'immagine di rilascio non include alcun database, quindi il PostgreSQL dietro `DATABASE_URL` è a carico dell'utente. Montarlo come `-v heym-postgres-data:/var/lib/postgresql/data` anziché come percorso host: su macOS (virtiofs) e Windows/WSL2 una directory dati PostgreSQL montata tramite bind non rispetta le garanzie di `fsync` richieste dal database e corrompe il cluster nel tempo.

> **Backend dell'archivio vettoriale.** `run.sh` e `deploy.sh` eseguono l'immagine ufficiale `postgres:16` e installano automaticamente il pacchetto `postgresql-16-pgvector` all'avvio, quindi il **backend RAG Postgres (pgvector)** funziona immediatamente senza modifiche ai dati. L'immagine precompilata a container singolo, tuttavia, si connette a un PostgreSQL fornito **dall'utente** — tale database deve supportare l'estensione `vector` per utilizzare il backend Postgres. Heym non può installare pgvector in un database che non gestisce. In sua assenza, la migrazione di avvio salta con garbo la tabella pgvector — il deploy riesce comunque, il RAG Qdrant continua a funzionare e la creazione o il caricamento su un archivio vettoriale Postgres restituisce un chiaro messaggio "backend unavailable" finché pgvector non viene abilitato.

**Impostare manualmente le chiavi per le esecuzioni dirette dell'immagine.** A differenza di `run.sh`/`deploy.sh`, l'immagine precompilata non genera automaticamente le chiavi. Dopo `cp .env.example .env`, popolare le due chiavi vuote (la sostituzione sul posto evita voci duplicate):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Rendere assoluti i mount di file e plugin.** `FILE_STORAGE_DIR` e `HEYM_PLUGINS_DIR` hanno come valori predefiniti i percorsi relativi `./data/files` e `data/plugins`, e l'immagine di rilascio avvia il backend da `/app/backend`. Se lasciati relativi, vengono risolti in `/app/backend/data/files` e `/app/backend/data/plugins`, quindi i due bind mount sopra non ricevono nulla e i caricamenti vanno persi quando il container viene sostituito. I flag `-e` sovrascrivono i valori relativi forniti da `.env.example` tramite `--env-file`, poiché `-e` da riga di comando prevale su `--env-file`. Compose (`./deploy.sh`) non necessita di questo: quell'immagine esegue il backend da `/app`, dove i valori predefiniti relativi ricadono già sui mount.

> **Accesso al socket Docker.** Montare `/var/run/docker.sock` concede al backend un ampio controllo sul daemon Docker dell'host. Il servizio Docker Compose predefinito e l'esempio diretto `docker run` lo includono per gli strumenti MCP stdio basati su Docker che eseguono comandi `docker`. La scheda Logs richiede comunque `DOCKER_LOGS_ENABLED=true` e `DOCKER_LOGS_ALLOWED_EMAILS` con un elenco separato da virgole di email utente attendibili. Creare l'account amministratore attendibile prima di abilitare i log Docker, oppure mantenere `ALLOW_REGISTER=false`, affinché una registrazione autonoma non verificata non possa rivendicare un'email presente nella allow-list. Gli strumenti Python definiti dall'utente **non** ricevono questo socket: vengono eseguiti in un container separato e irrobustito, privo di socket Docker. Vedere [Security](../reference/security.md#python-tool-sandbox).

> **Runner Codex.** Il nodo Codex utilizza la stessa immagine `ghcr.io/heymrun/heym` come container runner sibling (`--entrypoint codex`), così la sandbox Linux di Codex può creare namespace. Mantenere il mount del volume `heym-codex-workspaces` se si desiderano workflow Codex nella configurazione diretta dell'immagine; il runner non riceve il socket Docker né i segreti del backend.

> **Runner OpenCode Go.** Il nodo OpenCode Go utilizza la stessa immagine come runner sibling irrobustito (`--entrypoint opencode`) condividendo `heym-opencode-workspaces`. Mantenere tale mount del volume se si desiderano workflow OpenCode nella configurazione diretta dell'immagine; il runner non riceve il socket Docker né il token GitHub.

> **Sandbox delle skill.** Le skill Python sul nodo Agent vengono eseguite in un container sibling irrobustito che condivide il volume `heym-codex-workspaces`, quindi mantenere tale mount del volume anche per le skill — non solo per Codex. Ogni esecuzione ottiene un sottopercorso isolato per-run, e il sibling non riceve né il socket Docker né i segreti del backend. Questo richiede **Docker Engine 25.0+**; su engine più datati, o in assenza del volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` fallisce in modo sicuro — impostare `HEYM_PYTHON_TOOL_SANDBOX=subprocess` solo per configurazioni monoutente attendibili. Vedere [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` è obbligatorio per Playwright.** Docker assegna a un container 64 MB di `/dev/shm` e Chromium manda in crash il proprio renderer al di sotto di tale soglia. I nodi Playwright basati su step eseguono Chromium come sottoprocesso all'interno di questo container, quindi il limite è quello di questo container; il codice `playwrightCode` personalizzato viene eseguito in un container sibling che imposta il proprio. `docker-compose.yml` dichiara già `shm_size: "2gb"`, pertanto `run.sh` e `deploy.sh` non sono interessati — solo un semplice `docker run` necessita del flag.

> **Playwright Run Code.** Il codice Python personalizzato per Playwright richiede `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` e il mount del socket Docker indicato sopra. L'immagine di release imposta `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` per il layout GHCR (`/app/backend/.venv`). Il comando Compose `./deploy.sh` imposta come default l'immagine sandbox a `heym-backend:local`. Mantenere `--no-sandbox` negli argomenti di avvio di Chromium all'interno dei container sandbox.

**Variabili d'ambiente minime per l'esecuzione diretta dell'immagine:**

| Variabile | Obbligatoria | Scopo |
|----------|----------|---------|
| `DATABASE_URL` | Opzionale | Override completo della stringa di connessione PostgreSQL |
| `POSTGRES_HOST` | Sì, se `DATABASE_URL` è vuota | Host PostgreSQL |
| `POSTGRES_PORT` | Sì, se `DATABASE_URL` è vuota | Porta PostgreSQL |
| `POSTGRES_USER` | Sì, se `DATABASE_URL` è vuota | Nome utente PostgreSQL |
| `POSTGRES_PASSWORD` | Sì, se `DATABASE_URL` è vuota | Password PostgreSQL |
| `POSTGRES_DB` | Sì, se `DATABASE_URL` è vuota | Nome del database PostgreSQL |
| `SECRET_KEY` | Sì | Segreto per la firma JWT |
| `ENCRYPTION_KEY` | Sì | Chiave di cifratura delle Credenziali |
| `FRONTEND_URL` | Consigliata | URL pubblico del browser, in particolare per i callback OAuth |
| `CORS_ORIGINS` | Consigliata | Origini browser consentite |
| `FILE_STORAGE_DIR` | Consigliata | Impostarla a un percorso assoluto `/app/data/files` quando si monta tale percorso; il default relativo `./data/files` viene risolto sotto `/app/backend` in questa immagine e non intercetta il mount |
| `ALLOW_REGISTER` | Consigliata | Impostare `false` in produzione a meno che non si intenda consentire la registrazione aperta, ma solo dopo aver creato l'account amministratore — non esiste alcun bootstrap del primo utente |
| `DOCKER_LOGS_ENABLED` | Opzionale | Impostare `true` per consentire alla scheda Logs di utilizzare l'accesso al socket Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obbligatoria quando `DOCKER_LOGS_ENABLED=true` | Elenco separato da virgole di email di utenti fidati autorizzati ad accedere ai log Docker |
| `HEYM_PLUGINS_ENABLED` | Opzionale | Impostare `true` per abilitare il sottosistema dei plugin (nodi personalizzati installati come zip). Disattivato per default |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obbligatoria quando `HEYM_PLUGINS_ENABLED=true` | Email degli operatori, separate da virgole, autorizzate a installare/disinstallare i plugin |
| `HEYM_PLUGINS_DIR` | Opzionale | Percorso in cui vengono archiviati i file dei plugin. Impostarlo a un percorso assoluto `/app/data/plugins` quando si monta tale percorso; il default relativo `data/plugins` viene risolto sotto `/app/backend` in questa immagine e non intercetta il mount |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opzionale | Modalità di isolamento dello strumento Python; default `auto` (sandbox Docker rafforzato, fail closed). Vedere [Sicurezza](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opzionale | Override dell'immagine sandbox dello strumento Python; vuoto = rilevamento automatico dell'immagine backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opzionale | Volume Docker utilizzato dai container sibling del runner Codex; default `heym-codex-workspaces` nei deployment Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opzionale | Consente ai comandi in sandbox di Codex di scaricare file/dipendenze; nei deployment Docker è abilitato per default |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opzionale | Volume Docker utilizzato dai container sibling del runner OpenCode; default `heym-opencode-workspaces` nei deployment Docker |

**Note:**

- L'immagine espone la porta `4017`
- Il backend rimane interno ed è proxato sotto `/api`
- Quando `POSTGRES_HOST=localhost`, l'immagine di release lo riscrive automaticamente in `host.docker.internal` quando necessario, affinché lo stesso `.env` funzioni con un container PostgreSQL a livello host sugli strumenti Docker/Desktop di macOS
- Mantenere il mount `data/files` se si desidera che i caricamenti su Drive e i file generati dalle skill sopravvivano ai riavvii del container
- **Plugin:** per abilitarli, impostare `HEYM_PLUGINS_ENABLED=true` e `HEYM_PLUGIN_ADMIN_EMAILS`, e montare `data/plugins` affinché i file dei plugin installati persistano tra le ricreazioni del container. I metadati dei plugin risiedono nel PostgreSQL, quindi persistono anch'essi. Le `dependencies` pip dichiarate da un plugin vengono installate nel container al momento dell'installazione; poiché il filesystem dell'immagine è effimero, vengono **reinstallate automaticamente all'avvio** per ogni plugin installato (il venv `uv` dell'immagine di release è scrivibile, quindi questo funziona anche nell'immagine a container singolo)

### Spostare un database esistente su un volume con nome

`./deploy.sh --migrate-pgdata` conosce solo lo stack Compose. Se si esegue l'immagine di release contro un proprio container PostgreSQL e tale container esegue il bind-mount di una directory host, occorre migrarlo manualmente.

Verificare innanzitutto cosa utilizza il container del database:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Se `"Type"` riporta `bind`, spostarlo su un volume con nome:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

#    nome del volume se questo host Docker esegue più di un deployment Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Avviare nuovamente PostgreSQL sul volume, riutilizzando i flag precedenti
#    ma sostituendo il bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Una volta che accetta connessioni, ricostruire gli indici.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilizzare la propria immagine nei passaggi 2 e 3, non `postgres:16`.** Se il database esegue `pgvector/pgvector:pg16` o un'altra variante, avviare il cluster copiato con l'immagine standard può fallire perché le librerie delle estensioni attese risultano mancanti.

La directory dati originale non viene toccata da questa procedura, quindi rimane il percorso di rollback. Eliminarla solo dopo aver confermato che il database migrato serve correttamente i workflow. Il passaggio 4 è importante per lo stesso motivo della migrazione Compose: la copia porta con sé qualsiasi danno preesistente agli indici.

---

## Esecuzione di Più Istanze

Tutto quanto sopra descritto distribuisce una singola istanza Heym. Quando una sola macchina non è più sufficiente, è possibile puntare una seconda istanza allo stesso database PostgreSQL e questa si unirà come worker: le esecuzioni in background — cron, webhook, chiamate a strumenti MCP, trigger di chat — vengono quindi condivise tra le istanze secondo una percentuale impostata in **Impostazioni → Istanze**.

Le istanze non comunicano mai tra loro. È Postgres a trasportare il lavoro, quindi un worker non necessita di porte aperte né di una rotta verso l'istanza principale, e non è coinvolto alcun message broker. Il lavoro che tocca il disco locale — file Drive, workspace degli agenti di coding, plugin installati — viene sempre eseguito sull'istanza principale, quindi nulla deve essere condiviso tramite filesystem.

Due regole che il cluster non può imporre automaticamente: ogni istanza deve utilizzare lo stesso `SECRET_KEY` e `ENCRYPTION_KEY`, e l'ingress deve puntare esclusivamente all'istanza principale. Entrambe sono spiegate, insieme alle regole di posizionamento e a come scegliere le percentuali, in [Distribuzione del carico](../reference/cluster.md).

> Questa è distribuzione del carico, non alta disponibilità. L'istanza principale rimane un singolo punto di guasto per ingress, archiviazione file ed editor.

## Workflow Comuni

**Configurazione iniziale:**

```bash
./run.sh          # sviluppo — crea .env da .env.example e genera SECRET_KEY/ENCRYPTION_KEY automaticamente
# oppure
./deploy.sh       # produzione — stessa generazione automatica di .env e chiavi
```

Per l'immagine precompilata `docker run`, generare prima manualmente le chiavi (vedere la sezione **Immagine Precompilata** sopra).

**Aggiornare la produzione dopo una modifica al codice:**

```bash
git pull
./deploy.sh       # ricostruisce le immagini, swap senza downtime
```

**Controllare i log di produzione:**

```bash
./deploy.sh --logs
```

**Arrestare i servizi di produzione:**

```bash
./deploy.sh --down
```

---

## Correlati

- [Introduzione](./introduction.md) – Panoramica della piattaforma
- [Avvio Rapido](./quick-start.md) – Creare il primo workflow
- [Variabili d'Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Riferimento completo alla configurazione
- [Sicurezza](../reference/security.md) – Impostazioni JWT, crittografia e CORS
- [Distribuzione del carico](../reference/cluster.md) – Eseguire più istanze su un unico database

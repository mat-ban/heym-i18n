# Kørsel & Udrulning

Heym leverer to scripts til forskellige miljøer: `run.sh` til lokal udvikling og `deploy.sh` til produktionsudrulninger ved hjælp af Docker Compose.

> **Video-gennemgang:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — klon repository'et, start PostgreSQL, udfyld de påkrævede miljøvariabler, og opret den første konto på en lokal instans.

## Forudsætninger

Begge scripts kræver, at følgende værktøjer er installeret:

| Værktøj | Formål |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Database-container (dev) og fuld stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Python-pakkestyring til backend |
| [bun](https://bun.sh) | JavaScript-runtime til frontend |

## Miljøopsætning

Både `run.sh` og `deploy.sh` læser fra en `.env`-fil i projektroden. Hvis den ikke findes, opretter scriptet automatisk en fra `.env.example` — for både lokal udvikling og produktion.

`SECRET_KEY` og `ENCRYPTION_KEY` leveres tomme i `.env.example`. Når en af dem er tom, genererer `run.sh` og `deploy.sh` automatisk en kryptografisk stærk værdi og skriver den tilbage til `.env`, så en frisk opsætning ikke kræver manuel håndtering af nøgler. Hvis en eksisterende `.env` stadig indeholder den forældede `ENCRYPTION_KEY`-pladsholder (`change_this_to_a_random_32_byte_hex_value`), stopper scriptsene med en eksplicit fejl i stedet for at overskrive den — rotation af den nøgle ville gøre tidligere krypterede credentials ulæselige. Backend nægter også selv at starte, hvis en af nøglerne er tom eller efterladt på en kendt pladsholder.

For manuel oprettelse af filen (valgfrit — scriptsene gør dette automatisk):

```bash
cp .env.example .env
```

Vigtige miljøvariabler:

For hver understøttet variabel, standardværdi og produktionsnote, se [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Beskrivelse |
|----------|-------------|
| `SECRET_KEY` | **Påkrævet.** JWT-signeringshemmelighed. Auto-genereres af `run.sh`/`deploy.sh`, når den er tom. |
| `ENCRYPTION_KEY` | **Påkrævet.** Krypteringsnøgle til credentials. Auto-genereres af `run.sh`/`deploy.sh`, når den er tom. |
| `DATABASE_URL` | Valgfri tilsidesættelse af database-forbindelsesstreng. Hvis tom, bygger Heym den fra `POSTGRES_*`-indstillinger. |
| `BACKEND_PORT` | Backend API-port — standard er `10105` |
| `FRONTEND_PORT` | Frontend-port — standard er `4017` |
| `FRONTEND_URL` | **Påkrævet i produktion.** Offentlig URL for appen (scheme + host, f.eks. `https://heym.example.com`). Bruges til OAuth redirect URIs (Google Sheets, BigQuery, Notion og lignende) samt til review-, Codex follow-up- og fillinks, som baggrundskørsler genererer; skal matche den URL, brugerne anvender i browseren. I et cluster skal samme værdi sættes på hver instans. |
| `ALLOW_REGISTER` | Åben brugerregistrering (`false` i prod, `true` i dev). Sæt den kun til `false`, efter admin-kontoen eksisterer — der findes ingen first-user bootstrap, så en tom database kombineret med deaktiveret registrering efterlader ingen måde at oprette en på. |
| `DOCKER_LOGS_ENABLED` | Aktiverer Docker-baseret adgang til Logs-fanen, når sat til `true`; kræver også Docker socket-adgang |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Kommasepareret liste over betroede bruger-emails med adgang til Docker-logs, når `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maksimal HTTP request body-størrelse accepteret, før endpoint-handlers kører; standard er `100`, en MB over `FILE_MAX_SIZE_MB` for at give plads til multipart-overhead |
| `HEYM_PYTHON_TOOL_SANDBOX` | Hvordan brugerdefinerede Python-værktøjer kører: `auto` (standard — hærdet, isoleret Docker-container; fail closed hvis Docker er utilgængeligt), `docker` (samme, falder aldrig tilbage), eller `subprocess` (in-process lokal fallback; ikke en sikkerhedsgrænse, kun trusted/dev). `run.sh` sætter `subprocess` til native dev. Se [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image anvendt til Python-værktøjets Docker-sandbox. Tom = auto-detekter det kørende backend-image. |

Standardværdier for database-forbindelse (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) er dokumenteret i [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) og `.env.example`.

---
## Udvikling: `run.sh`

`run.sh` starter alle tre tjenester lokalt — databasen (som en Docker-container), FastAPI-backenden og Vite-dev-serveren — med en enkelt kommando.

```bash
./run.sh
```

**Hvad der sker, trin for trin:**

1. Kontrollerer, at `docker`, `bun` og `uv` er tilgængelige
2. Opretter `.env` ud fra `.env.example`, hvis den mangler, og genererer en tilfældig `SECRET_KEY` og `ENCRYPTION_KEY`, når en af disse er tom
3. Starter (eller opretter) en database-Docker-container på port `6543`, hvor data gemmes i Docker-volumen `heym-postgres-data` frem for i en værtsmappe
4. Installerer Python-afhængigheder via `uv sync`
5. Kører Alembic-databasemigreringer (`alembic upgrade head`)
6. Frigør backend- og frontend-porte, hvis de er optagede
7. Starter FastAPI-backenden med `--reload` (hot-reload ved kodeændringer)
8. Installerer frontend-afhængigheder via `bun install`
9. Starter Vite-dev-serveren

**Valgmuligheder:**

| Flag | Beskrivelse |
|------|-------------|
| *(ingen)* | Start med debug-logning aktiveret (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Start med standard-log-niveau (ingen debug-output) |
| `--help` | Vis brugsinformation |

**Tjenesteadresser (dev):**

| Tjeneste | Adresse |
|---------|---------|
| Frontend | `localhost` på `FRONTEND_PORT` (standard: 4017) |
| Backend API | `localhost` på `BACKEND_PORT` (standard: 10105) |
| Interaktiv API-dokumentation | `localhost:10105/docs` |
| Database | `localhost:6543` |

Tryk `Ctrl+C` for at stoppe alle tjenester korrekt.

---

## End-to-End-tests: `run_e2e.sh`

Frontend Playwright-suiten kører mod den rigtige Vue-applikation, FastAPI-backenden og en isoleret PostgreSQL-database:

```bash
./run_e2e.sh
```

Suiden er en smoke- og regressionssuite for kritiske veje, ikke udtømmende produktdækning. Den dækker autentificering, kerne-workflowets livscyklus og eksekvering, udvalgte dashboard-ressourcer, offentlige ruter og en mockad HITL-review-UI. Provider-integrationer, hver node-type, delings-/tilladelsesmatricer og fuld HITL-genoptagelseseksekvering er fortsat primært dækket af backend-tests eller kræver dedikerede integrationsmiljøer.

Hver kørsel får sin egen midlertidige PostgreSQL 16-container, tilfældige ledige database-/backend-/frontend-porte, autentificeringstilstand, testresultater og HTML-rapport. Dette gør det muligt for flere `run_e2e.sh`-processer at køre samtidigt uden at dele tilstand eller overskrive artefakter. Scriptet fjerner sin database-container, når kørslen afsluttes, og udskriver artefaktmappen og rapportstien.

Nyttige kommandoer:

```bash
./run_e2e.sh --ui         # Interaktiv Playwright-runner med en isoleret database
cd frontend
bun run test:e2e:report   # Åbn den senest afsluttede lokale kørsel
```

Direkte `bun run test:e2e`- og `bun run test:e2e:ui`-kørsler kræver en eksplicit `DATABASE_URL`, så de ikke kan starte lydløst mod den lokale udviklingsdatabase. Brug `./run_e2e.sh` til normale lokale kørsler.

`./check.sh` kører lint, typecheck, formatering og backend-tests uden E2E-suiten, hvilket holder den lokale standardkontrolvej hurtig. Kør Playwright E2E-tests separat med `./run_e2e.sh`. Pull requests kører altid Chromium E2E-suiten i GitHub Actions og bevarer traces, skærmbilleder, videoer og HTML-rapporten, når fejl opstår.

---
## Produktion: `deploy.sh`

`deploy.sh` bygger og kører hele stacken ved hjælp af Docker Compose. Alle tre services — databasen, backenden og frontenden — kører som containere. Backend-entrypointet kører automatisk migreringer, før serveren startes med 8 workers.

**Første deploy (build + start):**

```bash
./deploy.sh
```

Dette udfører et deploy uden nedetid: images bygges først, mens de eksisterende containere fortsat kører, hvorefter den nye version skiftes ind.

**Tilgængelige kommandoer:**

| Kommando | Beskrivelse |
|---------|-------------|
| `./deploy.sh` | Byg images og start/opdater alle services |
| `./deploy.sh --status` | Vis containerstatus |
| `./deploy.sh --logs` | Stream logs fra alle containere |
| `./deploy.sh --restart` | Genstart alle containere |
| `./deploy.sh --down` | Stop og fjern alle containere |
| `./deploy.sh --migrate-pgdata` | Engangsmigrering: kopiér en eksisterende `data/postgres`-mappe ind i Docker-volumenet `heym-postgres-data`, og genopbyg dens indekser |
| `./deploy.sh --help` | Vis brugsvejledning |

**Databaselagring: et navngivet Docker-volumen, ikke en host-mappe.**

Compose gemmer PostgreSQL i Docker-volumenet `heym-postgres-data`. Tidligere versioner bind-mountede host-mappen `./data/postgres` i stedet. Host bind mounts på macOS (virtiofs) og Windows/WSL2 giver ikke PostgreSQL de `fsync`- og fil-lukningsgarantier, der kræves: clusters der rammer `PANIC: could not close file … Input/output error` på WAL-segmenter og korrumperer over tid. Linux bind mounts var aldrig påvirket, men alle platforme bruger nu samme layout.

Opgradering af et deployment, der stadig har data i `./data/postgres`, er et engangstrin. `./deploy.sh` registrerer det, stopper før build og anmoder om at migrere først:

```bash
./deploy.sh --migrate-pgdata   # stop services, kopiér ind i volumenet, genopbyg indekser
./deploy.sh                    # deploy som sædvanligt
```

**Migreringen genopbygger også indekser.** Kopien er byte-for-byte, så indeksskader forårsaget af det gamle bind mount følger med. `--migrate-pgdata` starter derfor `postgres`-servicen alene på det nye volumen, kører `reindexdb` mod det og stopper det igen, før resten af stacken kommer op. Dette er vigtigt, fordi denne klasse af korruption efterlader indeksposter, der peger forbi slutningen af heap'en — en tilstand, som `pg_amcheck` rapporterer som ren, så et bestået check er ikke bevis på en sund tabel. REINDEX reparerer disse poster; det kan ikke gendanne heap-sider, som det gamle filsystem allerede har mistet. På en stor, kendt sund database kan genopbygningen omgås med `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopien er ikke-destruktiv. `./data/postgres` forbliver på plads som backup, og migreringen nægter at overskrive et volumen, der allerede indeholder en database. Hvis et trin fejler, fjernes det nye volumen, så et halvt migreret cluster aldrig kan deployes ved en fejl. Slet den gamle mappe, når det er bekræftet, at workflows er intakte. `postgres`-containeren har samme beskyttelse, så en manuel `docker compose up` heller ikke kan initialisere en tom database oven på dataene i stilhed. Friske installationer kræver ingen handling.

**Serviceadresser (produktion):**

Frontend-containeren eksponeres på `FRONTEND_PORT` (standard: 4017). Backend-API'et leveres under `/api`-stien, proxied gennem frontend-containeren — så der er kun én offentligt tilgængelig port i produktion.

**Containeroversigt:**

| Container | Beskrivelse |
|-----------|-------------|
| `heym-db` | Relationel database |
| `heym-backend` | FastAPI API-server (8 workers, bygget fra `backend/Dockerfile`) |
| `heym-frontend` | Frontend preview-container, der serverer den byggede Vue-app (bygget fra `frontend/Dockerfile`) |

**Badge for versionsopdatering:**

App-headeren viser den kørende Docker-build-version. Når denne version er bagud for den seneste Heym GitHub-release, vises et lilla **Update**-badge ved siden af versionen. Klik på versionen eller badget for at åbne Heym GitHub-releases-siden.

---
## Forudbygget image: `docker run`

Hvis det foretrækkes ikke at bygge appen lokalt, kan det publicerede container-image hentes og køres direkte.

Imaget starter frontend og backend sammen i én container. PostgreSQL er stadig ekstern, men der kan angives enten `DATABASE_URL` eller `POSTGRES_*`-variablerne fra `.env.example`.

> **Database bør lagres i et Docker named volume.** Release-imaget leveres uden database, så PostgreSQL bag `DATABASE_URL` skal selv køres. Det bør monteres som `-v heym-postgres-data:/var/lib/postgresql/data` frem for en host-sti: på macOS (virtiofs) og Windows/WSL2 overholder et bind-mountet PostgreSQL-data-dir ikke de `fsync`-garantier, databasen kræver, og clusteret korrumperes over tid.

> **Vector store-backend.** `run.sh` og `deploy.sh` kører det officielle `postgres:16`-image og installerer automatisk `postgresql-16-pgvector`-pakken ved opstart, så **Postgres (pgvector) RAG-backend** fungerer direkte der uden ændringer i dataene. Det forudbyggede single-container-image forbinder dog til en PostgreSQL, som **brugeren selv** leverer — den database skal understøtte `vector`-udvidelsen for at bruge Postgres-backenden. Heym kan ikke installere pgvector i en database, det ikke selv administrerer. Uden den springer opstartsmigrationen pgvector-tabellen over på en kontrolleret måde — deploy gennemføres stadig, Qdrant RAG fortsætter med at fungere, og oprettelse eller upload til et Postgres vector store returnerer en klar "backend unavailable"-meddelelse, indtil pgvector aktiveres.

**Nøgler skal angives manuelt ved direkte image-kørsel.** I modsætning til `run.sh`/`deploy.sh` genererer det forudbyggede image ikke nøgler automatisk. Efter `cp .env.example .env` udfyldes de to tomme nøgler (erstatning på stedet undgår dublerede poster):

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

> **Fil- og plugin-mounts skal være absolutte.** `FILE_STORAGE_DIR` og `HEYM_PLUGINS_DIR` har som standard de relative stier `./data/files` og `data/plugins`, og release-imaget starter backenden fra `/app/backend`. Forbliver de relative, opløses de til `/app/backend/data/files` og `/app/backend/data/plugins`, så de to bind mounts ovenfor ikke modtager noget, og uploads går tabt, når containeren udskiftes. `-e`-flagene tilsidesætter de relative værdier, som `.env.example` leverer via `--env-file`, fordi `-e` på kommandolinjen har forrang over `--env-file`. Compose (`./deploy.sh`) har ikke behov herfor: det image kører backenden fra `/app`, hvor de relative standardværdier allerede rammer mounts.

> **Docker socket-adgang.** Montering af `/var/run/docker.sock` giver backenden bred kontrol over hostens Docker-daemon. Standard Docker Compose-tjenesten og det direkte `docker run`-eksempel inkluderer den for Docker-baserede MCP stdio-værktøjer, der kører `docker`-kommandoer. Logs-fanen kræver stadig `DOCKER_LOGS_ENABLED=true` og `DOCKER_LOGS_ALLOWED_EMAILS` med en kommasepareret liste over betroede bruger-e-mails. Den betroede admin-konto skal oprettes, før Docker-logs aktiveres, eller `ALLOW_REGISTER=false` bør bibeholdes, så en uverificeret selvregistrering ikke kan overtage en allow-listet e-mail. Brugerdefinerede Python-værktøjer får **ikke** denne socket: de kører i en separat hærdet container uden Docker socket. Se [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex-noden bruger samme `ghcr.io/heymrun/heym`-image som en søster-runner-container (`--entrypoint codex`), så Codex' Linux-sandbox kan oprette namespaces. `heym-codex-workspaces`-volume-mountet bør bibeholdes, hvis Codex-workflows ønskes i det direkte image-setup; runneren modtager ikke Docker socket eller backend-hemmeligheder.

> **OpenCode Go runner.** OpenCode Go-noden bruger samme image som en hærdet søster-runner (`--entrypoint opencode`), der deler `heym-opencode-workspaces`. Dette volume-mount bør bibeholdes, hvis OpenCode-workflows ønskes i det direkte image-setup; runneren modtager ikke Docker socket eller GitHub-tokenet.

> **Skill sandbox.** Python-skills på Agent-noden kører i en hærdet søster-container, der deler `heym-codex-workspaces`-volume, så dette volume-mount bør også bibeholdes for skills — ikke kun Codex. Hver kørsel får en isoleret per-run-understi, og søsteren modtager hverken Docker socket eller backend-hemmeligheder. Dette kræver **Docker Engine 25.0+**; på ældre engines, eller uden volume, fejler `HEYM_PYTHON_TOOL_SANDBOX=auto` lukket — `HEYM_PYTHON_TOOL_SANDBOX=subprocess` bør kun angives til betroede enkeltbruger-setups. Se [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` er påkrævet for Playwright.** Docker tildeler en container 64 MB af `/dev/shm`, og Chromium får sin renderer til at crashe under denne grænse. Trinbaserede Playwright-noder kører Chromium som en subprocess inde i denne container, så grænsen er denne containers; brugerdefineret `playwrightCode` kører i en søstercontainer, der sætter sin egen. `docker-compose.yml` erklærer allerede `shm_size: "2gb"`, så `run.sh` og `deploy.sh` er upåvirkede — kun en almindelig `docker run` har brug for flaget.

> **Playwright Run Code.** Brugerdefineret Playwright Python kræver `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` og Docker-socket-mountet ovenfor. Release-imaget sætter `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` for GHCR-layoutet (`/app/backend/.venv`). Compose `./deploy.sh` sætter som standard sandbox-imaget til `heym-backend:local`. Behold `--no-sandbox` i Chromium-launch-argumenter inde i sandbox-containere.

**Minimumsmiljøvariabler for direkte image-kørsler:**

| Variabel | Påkrævet | Formål |
|----------|----------|---------|
| `DATABASE_URL` | Valgfri | Fuld PostgreSQL-forbindelsesstreng-tilsidesættelse |
| `POSTGRES_HOST` | Ja, hvis `DATABASE_URL` er tom | PostgreSQL-host |
| `POSTGRES_PORT` | Ja, hvis `DATABASE_URL` er tom | PostgreSQL-port |
| `POSTGRES_USER` | Ja, hvis `DATABASE_URL` er tom | PostgreSQL-brugernavn |
| `POSTGRES_PASSWORD` | Ja, hvis `DATABASE_URL` er tom | PostgreSQL-adgangskode |
| `POSTGRES_DB` | Ja, hvis `DATABASE_URL` er tom | PostgreSQL-databasenavn |
| `SECRET_KEY` | Ja | JWT-signeringshemmelighed |
| `ENCRYPTION_KEY` | Ja | Krypteringsnøgle til legitimationsoplysninger |
| `FRONTEND_URL` | Anbefales | Offentlig browser-URL, især til OAuth-callbacks |
| `CORS_ORIGINS` | Anbefales | Tilladte browser-origins |
| `FILE_STORAGE_DIR` | Anbefales | Sæt den til en absolut `/app/data/files`, når denne sti mountes; den relative standardværdi `./data/files` opløses under `/app/backend` i dette image og rammer ikke mountet |
| `ALLOW_REGISTER` | Anbefales | Sæt `false` i produktion, medmindre åben tilmelding er tilsigtet, men først når admin-kontoen eksisterer — der findes ingen first-user bootstrap |
| `DOCKER_LOGS_ENABLED` | Valgfri | Sæt `true` for at tillade, at Logs-fanen bruger Docker-socket-adgang |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Påkrævet når `DOCKER_LOGS_ENABLED=true` | Kommasepareret liste over betroede bruger-e-mails med adgang til Docker-logs |
| `HEYM_PLUGINS_ENABLED` | Valgfri | Sæt `true` for at aktivere plugin-subsystemet (brugerdefinerede noder installeret som zip). Slået fra som standard |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Påkrævet når `HEYM_PLUGINS_ENABLED=true` | Kommasepareret liste over operatør-e-mails med tilladelse til at installere/afinstallere plugins |
| `HEYM_PLUGINS_DIR` | Valgfri | Hvor plugin-filer gemmes. Sæt den til en absolut `/app/data/plugins`, når denne sti mountes; den relative standardværdi `data/plugins` opløses under `/app/backend` i dette image og rammer ikke mountet |
| `HEYM_PYTHON_TOOL_SANDBOX` | Valgfri | Isoleringstilstand for Python-værktøj; standard er `auto` (hærdet Docker-sandbox, fail closed). Se [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Valgfri | Tilsidesæt Python-værktøjets sandbox-image; tom = auto-detekter backend-imaget |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Valgfri | Docker-volume brugt af søster-Codex-runner-containere; standard er `heym-codex-workspaces` i Docker-implementeringer |
| `HEYM_CODEX_NETWORK_ACCESS` | Valgfri | Tillad Codex' sandboxed kommandoer at downloade filer/afhængigheder; Docker-implementeringer aktiverer dette som standard |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Valgfri | Docker-volume brugt af søster-OpenCode-runner-containere; standard er `heym-opencode-workspaces` i Docker-implementeringer |

**Bemærkninger:**

- Imaget eksponerer port `4017`
- Backend forbliver intern og proxies under `/api`
- Når `POSTGRES_HOST=localhost`, omskriver release-imaget automatisk det til `host.docker.internal`, når det er nødvendigt, så den samme `.env` fungerer med en PostgreSQL-container på host-niveau på macOS Docker/Desktop-værktøjer
- Behold `data/files`-mountet, hvis Drive-uploads og skill-genererede filer skal overleve container-genstarter
- **Plugins:** for at aktivere dem, sæt `HEYM_PLUGINS_ENABLED=true` og `HEYM_PLUGIN_ADMIN_EMAILS`, og mount `data/plugins`, så installerede plugin-filer bevares på tværs af container-genskabelser. Plugin-metadata ligger i PostgreSQL, så det overlever også. Et plugins erklærede pip-`dependencies` installeres i containeren på installationstidspunktet; da image-filsystemet er ephemeralt, **geninstalleres de automatisk ved opstart** for hvert installeret plugin (release-imagets `uv`-venv er skrivbar, så dette fungerer også i single-container-imaget)

### Flytning af en eksisterende database til et navngivet volume

`./deploy.sh --migrate-pgdata` kender kun til Compose-stakken. Hvis release-imaget køres mod en egen PostgreSQL-container, og denne container bind-mounter en host-mappe, skal den migreres manuelt.

Kontroller først, hvad databasecontaineren bruger:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Hvis `"Type"` viser `bind`, flyt den til et navngivet volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    volume-navn, hvis denne Docker-host kører mere end én Heym-udrulning.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL igen på volume'et, og genbrug de flag, der blev brugt før,
#    men erstat bind mount'et.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Når der kan oprettes forbindelser, genopbygges indeksene.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Brug eget image i trin 2 og 3, ikke `postgres:16`.** Hvis databasen kører `pgvector/pgvector:pg16` eller en anden variant, kan opstart af det kopierede cluster med standardimaget mislykkes, fordi de forventede extension-biblioteker mangler.

Det oprindelige datakatalog berøres ikke af denne procedure og udgør derfor rollback-stien. Det bør først slettes, efter det er bekræftet, at den migrerede database betjener workflows. Trin 4 er vigtigt af samme grund som i Compose-migreringen: kopien bærer eventuelle eksisterende indeksskader med sig.

---

## Kørsel af mere end én instans

Alt ovenstående udruller en enkelt Heym-instans. Når én maskine ikke længere er tilstrækkelig, kan en anden instans peges på den samme PostgreSQL-database, hvorefter den tilmelder sig som worker: baggrundskørsler — cron, webhooks, MCP-værktøjskald, chat-triggers — deles derefter mellem instanserne efter en procentdel, der angives under **Settings → Instances**.

Instanserne kommunikerer aldrig med hinanden. Postgres bærer arbejdet, så en worker har ikke behov for nogen åben port eller nogen rute tilbage til hovedinstansen, og der indgår ingen message broker. Arbejde, der berører lokal disk — Drive-filer, coding-agent-workspaces, installerede plugins — kører altid på hovedinstansen, så intet skal deles via et filsystem.

To regler, som cluster'et ikke kan håndhæve: hver instans skal bruge samme `SECRET_KEY` og `ENCRYPTION_KEY`, og ingress må kun pege på hovedinstansen. Begge forklares sammen med placeringsreglerne og valget af procenter i [Load Distribution](../reference/cluster.md).

> Dette er load distribution, ikke high availability. Hovedinstansen forbliver et enkelt fejlpunkt for ingress, fillagring og editoren.

## Almindelige workflflows

**Første opsætning:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Til det forudbyggede `docker run`-image skal nøglerne genereres manuelt først (se afsnittet **Prebuilt Image** ovenfor).

**Opdatering af produktion efter en kodeændring:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Kontrol af produktionslogs:**

```bash
./deploy.sh --logs
```

**Stop af produktionstjenester:**

```bash
./deploy.sh --down
```

---

## Relateret

- [Introduction](./introduction.md) – Platformsoverblik
- [Quick Start](./quick-start.md) – Byg det første workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fuld konfigurationsreference
- [Security](../reference/security.md) – JWT-, krypterings- og CORS-indstillinger
- [Load Distribution](../reference/cluster.md) – Kør flere instanser mod én database

# Köra & Distribuera

Heym tillhandahåller två skript för olika miljöer: `run.sh` för lokal utveckling och `deploy.sh` för produktionsdistribution med Docker Compose.

> **Videogenomgång:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — klona repositoryt, starta PostgreSQL, fyll i de nödvändiga miljövariablerna och skapa det första kontot på en lokal instans.

## Förutsättningar

Båda skripten kräver att följande verktyg är installerade:

| Verktyg | Syfte |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Databascontainer (dev) och fullständig stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Python-pakethanterare för backend |
| [bun](https://bun.sh) | JavaScript-runtime för frontend |

## Miljökonfiguration

Både `run.sh` och `deploy.sh` läser från en `.env`-fil i projektets rot. Om den inte finns skapar skriptet automatiskt en från `.env.example` — för både lokal utveckling och produktion.

`SECRET_KEY` och `ENCRYPTION_KEY` levereras tomma i `.env.example`. När någon av dem är tom genererar `run.sh` och `deploy.sh` automatiskt ett kryptografiskt starkt värde och skriver tillbaka det till `.env`, så en ny installation kräver ingen manuell nyckelhantering. Om en befintlig `.env` fortfarande innehåller den äldre platshållaren för `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`) stoppar skripten med ett explicit fel istället för att skriva över den — rotation av den nyckeln skulle göra tidigare krypterade autentiseringsuppgifter oläsbara. Backend vägrar också att starta om någon av nycklarna är tom eller lämnad vid en känd platshållare.

För att skapa filen manuellt (valfritt — skripten gör detta automatiskt):

```bash
cp .env.example .env
```

Viktiga miljövariabler:

För varje variabel som stöds, standardvärde och produktionsnotering, se [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Beskrivning |
|----------|-------------|
| `SECRET_KEY` | **Krävs.** JWT-signeringshemlighet. Genereras automatiskt av `run.sh`/`deploy.sh` när den är tom. |
| `ENCRYPTION_KEY` | **Krävs.** Krypteringsnyckel för autentiseringsuppgifter. Genereras automatiskt av `run.sh`/`deploy.sh` när den är tom. |
| `DATABASE_URL` | Valfri åsidosättning av databasanslutningssträng. Om tom bygger Heym den från `POSTGRES_*`-inställningar. |
| `BACKEND_PORT` | Backend API-port — standard `10105` |
| `FRONTEND_PORT` | Frontend-port — standard `4017` |
| `FRONTEND_URL` | **Krävs i produktion.** Appens publika URL (schema + värd, t.ex. `https://heym.example.com`). Används för OAuth-omdirigerings-URI:er (Google Sheets, BigQuery, Notion och liknande) samt för gransknings-, Codex-uppföljnings- och fillänkar som bakgrundskörningar genererar; måste matcha den URL som användare använder i webbläsaren. I ett kluster ska samma värde anges på varje instans. |
| `ALLOW_REGISTER` | Öppen användarregistrering (`false` i prod, `true` i dev). Sätt den till `false` först efter att administratörskontot finns — det finns ingen bootstrap för första användaren, så en tom databas med inaktiverad registrering lämnar ingen möjlighet att skapa ett konto. |
| `DOCKER_LOGS_ENABLED` | Aktiverar Docker-baserad åtkomst till Logs-fliken när den sätts till `true`; kräver även åtkomst till Docker-socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Kommaseparerad lista över betrodda användar-e-postadresser som tillåts komma åt Docker-loggar när `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maximal storlek på HTTP-förfrågningskropp som accepteras innan endpoint-hanterare körs; standard `100`, en MB över `FILE_MAX_SIZE_MB` för att lämna utrymme för multipart-overhead |
| `HEYM_PYTHON_TOOL_SANDBOX` | Hur användardefinierade Python-verktyg körs: `auto` (standard — härdad, isolerad Docker-container; misslyckas stängt om Docker inte är tillgängligt), `docker` (samma, faller aldrig tillbaka), eller `subprocess` (lokal fallback i processen; inte en säkerhetsgräns, endast betrodd/dev). `run.sh` sätter `subprocess` för nativ dev. Se [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image som används för Python-verktygets Docker-sandbox. Tom = automatiskt identifiera den körande backend-imagen. |

Standardvärden för databasanslutning (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) dokumenteras i [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) och `.env.example`.

---
## Utveckling: `run.sh`

`run.sh` startar alla tre tjänster lokalt — databasen (som en Docker-container), FastAPI-backend och Vite-dev-servern — med ett enda kommando.

```bash
./run.sh
```

**Vad som görs, steg för steg:**

1. Kontrollerar att `docker`, `bun` och `uv` är tillgängliga
2. Skapar `.env` från `.env.example` om den saknas, och genererar en slumpmässig `SECRET_KEY` och `ENCRYPTION_KEY` när någon av dessa är tom
3. Startar (eller skapar) en databas-Docker-container på port `6543`, och lagrar dess data i Docker-volymen `heym-postgres-data` i stället för en värdkatalog
4. Installerar Python-beroenden via `uv sync`
5. Kör Alembic-databasmigreringar (`alembic upgrade head`)
6. Frigör backend- och frontend-portarna om de är upptagna
7. Startar FastAPI-backend med `--reload` (hot-reload vid kodändringar)
8. Installerar frontend-beroenden via `bun install`
9. Startar Vite-dev-servern

**Alternativ:**

| Flagga | Beskrivning |
|------|-------------|
| *(ingen)* | Starta med debug-loggning aktiverad (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Starta med standardloggnivå (ingen debug-utdata) |
| `--help` | Visa användningsinformation |

**Tjänsteadresser (dev):**

| Tjänst | Adress |
|---------|---------|
| Frontend | `localhost` på `FRONTEND_PORT` (standard: 4017) |
| Backend API | `localhost` på `BACKEND_PORT` (standard: 10105) |
| Interaktiv API-dokumentation | `localhost:10105/docs` |
| Databas | `localhost:6543` |

Tryck `Ctrl+C` för att stoppa alla tjänster på ett kontrollerat sätt.

---

## End-to-End-tester: `run_e2e.sh`

Frontend-sviten för Playwright körs mot den riktiga Vue-applikationen, FastAPI-backend och en isolerad PostgreSQL-databas:

```bash
./run_e2e.sh
```

Sviten är en smoke- och regressionssvit för nyckelvägar, inte en uttömmande produktvalidering. Den täcker autentisering, livscykel och körning för centrala Workflow, utvalda dashboard-resurser, publika rutter och ett mockat HITL-granskningsgränssnitt. Leverantörsintegrationer, samtliga nodtyper, matriser för delning/behörigheter och fullständig HITL-återupptagningskörning täcks i första hand av backend-tester eller kräver dedikerade integrationsmiljöer.

Varje körning får sin egen tillfälliga PostgreSQL 16-container, slumpmässigt valda tillgängliga databas-/backend-/frontend-portar, autentiseringstillstånd, testresultat och HTML-rapport. Detta gör att flera `run_e2e.sh`-processer kan köras samtidigt utan att dela tillstånd eller skriva över artefakter. Skriptet tar bort sin databas-container när körningen är klar och skriver ut artefaktkatalogen och rapportens sökväg.

Användbara kommandon:

```bash
./run_e2e.sh --ui         # Interaktiv Playwright-körare med en isolerad databas
cd frontend
bun run test:e2e:report   # Öppna den senast slutförda lokala körningen
```

Direkta körningar av `bun run test:e2e` och `bun run test:e2e:ui` kräver en explicit `DATABASE_URL` så att de inte tyst kan starta mot den lokala utvecklingsdatabasen. Använd `./run_e2e.sh` för normala lokala körningar.

`./check.sh` kör lint, typecheck, formatering och backend-tester utan E2E-sviten, vilket håller den lokala standardkontrollvägen snabb. Kör Playwright E2E-tester separat med `./run_e2e.sh`. Pull requests kör alltid Chromium E2E-sviten i GitHub Actions och behåller traces, skärmbilder, videor och HTML-rapporten när fel uppstår.

---
## Produktion: `deploy.sh`

`deploy.sh` bygger och kör hela stacken med Docker Compose. Alla tre tjänster — databasen, backend och frontend — körs som containrar. Backend-entrypointen kör automatiskt migreringar innan servern startas med 8 workers.

**Initial distribution (bygg + start):**

```bash
./deploy.sh
```

Detta utför en distribution utan driftstopp: images byggs först medan befintliga containrar fortsätter köra, därefter byts den nya versionen in.

**Tillgängliga kommandon:**

| Kommando | Beskrivning |
|---------|-------------|
| `./deploy.sh` | Bygg images och starta/uppdatera alla tjänster |
| `./deploy.sh --status` | Visa containerstatus |
| `./deploy.sh --logs` | Strömma loggar från alla containrar |
| `./deploy.sh --restart` | Starta om alla containrar |
| `./deploy.sh --down` | Stoppa och ta bort alla containrar |
| `./deploy.sh --migrate-pgdata` | Engångsmigrering: kopiera en befintlig `data/postgres`-katalog till Docker-volymen `heym-postgres-data` och bygg om dess index |
| `./deploy.sh --help` | Visa användningsinformation |

**Databaslagring: en namngiven Docker-volym, inte en värdkatalog.**

Compose lagrar PostgreSQL i Docker-volymen `heym-postgres-data`. Tidigare versioner bind-monterade värdkatalogen `./data/postgres` i stället. Bind-monteringar på värden i macOS (virtiofs) och Windows/WSL2 ger inte PostgreSQL de `fsync`- och filstängningsgarantier som krävs: kluster där drabbas av `PANIC: could not close file … Input/output error` på WAL-segment och korrumperas över tid. Bind-monteringar i Linux påverkades aldrig, men varje plattform använder nu samma layout.

Uppgradering av en distribution som fortfarande har data i `./data/postgres` är ett engångssteg. `./deploy.sh` upptäcker detta, stoppar före byggandet och begär att migrering utförs först:

```bash
./deploy.sh --migrate-pgdata   # stoppa tjänster, kopiera till volymen, bygg om index
./deploy.sh                    # distribuera som vanligt
```

**Migreringen bygger även om index.** Kopian är byte-för-byte, så indexskador som den gamla bind-monteringen orsakat följer med. `--migrate-pgdata` startar därför `postgres`-tjänsten ensam på den nya volymen, kör `reindexdb` mot den och stoppar den igen innan resten av stacken startas. Detta är viktigt eftersom denna typ av korruption lämnar indexposter som pekar förbi slutet av heapen — ett tillstånd som `pg_amcheck` rapporterar som felfritt, så en godkänd kontroll är inte bevis på en frisk tabell. REINDEX reparerar dessa poster; det kan inte återställa heap-sidor som det gamla filsystemet redan förlorat. På en stor, känt frisk databas går det att kringgå ombyggnaden med `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopian är icke-destruktiv. `./data/postgres` ligger kvar som backup, och migreringen vägrar skriva över en volym som redan innehåller en databas. Om något steg misslyckas tas den nya volymen bort, så ett halvmigrerat kluster kan aldrig distribueras av misstag. Ta bort den gamla katalogen när det har bekräftats att arbetsflödena är intakta. `postgres`-containern har samma skydd, så en manuell `docker compose up` kan inte heller tyst initiera en tom databas över befintlig data. Nya installationer kräver ingen åtgärd.

**Tjänsteadresser (produktion):**

Frontend-containern exponeras på `FRONTEND_PORT` (standard: 4017). Backend-API:et serveras under sökvägen `/api`, proxat genom frontend-containern — så det finns endast en publik port i produktion.

**Containeröversikt:**

| Container | Beskrivning |
|-----------|-------------|
| `heym-db` | Relationsdatabas |
| `heym-backend` | FastAPI API-server (8 workers, byggd från `backend/Dockerfile`) |
| `heym-frontend` | Frontend-förhandsgranskningscontainer som serverar den byggda Vue-appen (byggd från `frontend/Dockerfile`) |

**Badge för versionsuppdatering:**

Apphuvudet visar den körande Docker-byggversionen. När den versionen ligger efter senaste Heym GitHub-release visas en lila **Update**-badge bredvid versionen. Klicka på versionen eller badgen för att öppna Heym GitHub-releasesidan.

---
## Förbyggd image: `docker run`

Om appen inte byggs lokalt går det att hämta den publicerade container-imagen och köra den direkt.

Imagen startar frontend och backend tillsammans i en container. PostgreSQL är fortfarande externt, men antingen `DATABASE_URL` eller `POSTGRES_*`-variablerna från `.env.example` kan anges.

> **Lagra databasen i en Docker-namngiven volym.** Release-imagen levereras utan databas, så PostgreSQL bakom `DATABASE_URL` ansvarar användaren för att köra. Montera den som `-v heym-postgres-data:/var/lib/postgresql/data` i stället för en host-sökväg: på macOS (virtiofs) och Windows/WSL2 respekterar en bind-monterad PostgreSQL-datakatalog inte de `fsync`-garantier som databasen kräver och korrumperar klustret över tid.

> **Vector store-backend.** `run.sh` och `deploy.sh` kör den officiella `postgres:16`-imagen och installerar automatiskt paketet `postgresql-16-pgvector` vid start, så **Postgres (pgvector) RAG-backend** fungerar direkt där utan ändringar i data. Den förbyggda single-container-imagen ansluter dock till en PostgreSQL som **användaren** tillhandahåller — den databasen måste stödja `vector`-tillägget för att Postgres-backenden ska kunna användas. Heym kan inte installera pgvector i en databas som det inte hanterar. Utan det hoppar startmigreringen över pgvector-tabellen på ett smidigt sätt — deployen lyckas fortfarande, Qdrant RAG fortsätter fungera, och att skapa eller ladda upp till ett Postgres vector store returnerar ett tydligt meddelande om att "backend unavailable" tills pgvector är aktiverat.

**Ange nycklarna manuellt vid direkta image-körningar.** Till skillnad från `run.sh`/`deploy.sh` genererar den förbyggda imagen inte nycklar automatiskt. Efter `cp .env.example .env`, fyll i de två tomma nycklarna (att ersätta på plats undviker dubbletter):

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

> **Gör fil- och plugin-monteringarna absoluta.** `FILE_STORAGE_DIR` och `HEYM_PLUGINS_DIR` har som standard de relativa sökvägarna `./data/files` och `data/plugins`, och release-imagen startar backend från `/app/backend`. Om de lämnas relativa löses de upp till `/app/backend/data/files` och `/app/backend/data/plugins`, så de två bind-monteringarna ovan tar emot ingenting och uppladdningar förloras när containern ersätts. `-e`-flaggorna åsidosätter de relativa värden som `.env.example` tillhandahåller via `--env-file`, eftersom kommandorads-`-e` vinner över `--env-file`. Compose (`./deploy.sh`) behöver inte detta: den imagen kör backend från `/app`, där de relativa standardvärdena redan hamnar på monteringarna.

> **Docker socket-åtkomst.** Att montera `/var/run/docker.sock` ger backend omfattande kontroll över hostens Docker-daemon. Standardtjänsten i Docker Compose och exemplet med direkt `docker run` inkluderar den för Docker-baserade MCP stdio-verktyg som kör `docker`-kommandon. Fliken Logs kräver fortfarande `DOCKER_LOGS_ENABLED=true` och `DOCKER_LOGS_ALLOWED_EMAILS` med en kommaseparerad lista över betrodda användares e-postadresser. Skapa det betrodda admin-kontot innan Docker-loggar aktiveras, eller behåll `ALLOW_REGISTER=false`, så att en overifierad självregistrering inte kan göra anspråk på en e-postadress som finns på tillåtlistan. Användardefinierade Python-verktyg får **inte** denna socket: de körs i en separat härdad container utan Docker-socket. Se [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex-noden använder samma `ghcr.io/heymrun/heym`-image som en syskon-runner-container (`--entrypoint codex`) så att Codex's Linux-sandbox kan skapa namespaces. Behåll volymmonteringen `heym-codex-workspaces` om Codex-workflows önskas i den direkta image-konfigurationen; runnern tar inte emot Docker-socketen eller backend-hemligheter.

> **OpenCode Go runner.** OpenCode Go-noden använder samma image som en härdad syskon-runner (`--entrypoint opencode`) med delad `heym-opencode-workspaces`. Behåll den volymmonteringen om OpenCode-workflows önskas i den direkta image-konfigurationen; runnern tar inte emot Docker-socketen eller GitHub-token.

> **Skill-sandbox.** Python-skills på Agent-noden körs i en härdad syskon-container som delar volymen `heym-codex-workspaces`, så behåll den volymmonteringen även för skills — inte bara för Codex. Varje körning får en isolerad per-körning-undersökväg, och syskonet tar emot varken Docker-socketen eller backend-hemligheter. Detta kräver **Docker Engine 25.0+**; på äldre motorer, eller utan volymen, misslyckas `HEYM_PYTHON_TOOL_SANDBOX=auto` stängt — ange `HEYM_PYTHON_TOOL_SANDBOX=subprocess` endast för betrodda enanvändaruppsättningar. Se [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` krävs för Playwright.** Docker tilldelar en container 64 MB av `/dev/shm` och Chromium kraschar sin renderer under den gränsen. Steg-baserade Playwright-noder kör Chromium som en subprocess inuti denna container, så gränsen är denna containers; anpassad `playwrightCode` körs i en syskoncontainer som sätter sin egen. `docker-compose.yml` deklarerar redan `shm_size: "2gb"`, så `run.sh` och `deploy.sh` påverkas inte — endast en vanlig `docker run` behöver flaggan.

> **Playwright Run Code.** Anpassad Playwright Python kräver `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` och Docker-socketmonteringen ovan. Release-imagen sätter `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` för GHCR-layouten (`/app/backend/.venv`). Compose `./deploy.sh` sätter sandbox-imagen som standard till `heym-backend:local`. Behåll `--no-sandbox` i Chromium-startargument inuti sandbox-containrar.

**Minimikrav på miljövariabler för direkta image-körningar:**

| Variabel | Krävs | Syfte |
|----------|----------|---------|
| `DATABASE_URL` | Valfri | Fullständig PostgreSQL-anslutningssträng som åsidosätter |
| `POSTGRES_HOST` | Ja, om `DATABASE_URL` är tom | PostgreSQL-värd |
| `POSTGRES_PORT` | Ja, om `DATABASE_URL` är tom | PostgreSQL-port |
| `POSTGRES_USER` | Ja, om `DATABASE_URL` är tom | PostgreSQL-användarnamn |
| `POSTGRES_PASSWORD` | Ja, om `DATABASE_URL` är tom | PostgreSQL-lösenord |
| `POSTGRES_DB` | Ja, om `DATABASE_URL` är tom | PostgreSQL-databasnamn |
| `SECRET_KEY` | Ja | JWT-signeringshemlighet |
| `ENCRYPTION_KEY` | Ja | Krypteringsnyckel för autentiseringsuppgifter |
| `FRONTEND_URL` | Rekommenderas | Publik webbläsar-URL, särskilt för OAuth-callbacks |
| `CORS_ORIGINS` | Rekommenderas | Tillåtna webbläsarursprung |
| `FILE_STORAGE_DIR` | Rekommenderas | Sätt den till en absolut `/app/data/files` när den sökvägen monteras; den relativa standarden `./data/files` löses upp under `/app/backend` i denna image och missar monteringen |
| `ALLOW_REGISTER` | Rekommenderas | Sätt `false` i produktion om inte öppen registrering är avsedd, men först när admin-kontot finns — det finns ingen bootstrap för första användaren |
| `DOCKER_LOGS_ENABLED` | Valfri | Sätt `true` för att tillåta att Logs-fliken använder Docker-socketåtkomst |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Krävs när `DOCKER_LOGS_ENABLED=true` | Kommaseparerad lista över betrodda användar-e-postadresser som tillåts komma åt Docker-loggar |
| `HEYM_PLUGINS_ENABLED` | Valfri | Sätt `true` för att aktivera plugin-subsystemet (anpassade noder installerade som zip). Av som standard |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Krävs när `HEYM_PLUGINS_ENABLED=true` | Kommaseparerade operatörs-e-postadresser som tillåts installera/avinstallera plugins |
| `HEYM_PLUGINS_DIR` | Valfri | Var plugin-filer lagras. Sätt den till en absolut `/app/data/plugins` när den sökvägen monteras; den relativa standarden `data/plugins` löses upp under `/app/backend` i denna image och missar monteringen |
| `HEYM_PYTHON_TOOL_SANDBOX` | Valfri | Isoleringsläge för Python-verktyg; standard är `auto` (härdad Docker-sandbox, fail closed). Se [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Valfri | Åsidosätt sandbox-imagen för Python-verktyg; tom = automatiskt identifiera backend-imagen |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Valfri | Docker-volym som används av syskoncontainrar för Codex-runner; standard är `heym-codex-workspaces` i Docker-distributioner |
| `HEYM_CODEX_NETWORK_ACCESS` | Valfri | Tillåt Codex sandboxade kommandon att ladda ner filer/beroenden; Docker-distributioner aktiverar detta som standard |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Valfri | Docker-volym som används av syskoncontainrar för OpenCode-runner; standard är `heym-opencode-workspaces` i Docker-distributioner |

**Anmärkningar:**

- Imagen exponerar port `4017`
- Backend förblir intern och proxas under `/api`
- När `POSTGRES_HOST=localhost` skriver release-imagen automatiskt om det till `host.docker.internal` vid behov så att samma `.env` fungerar med en PostgreSQL-container på värdnivå i macOS Docker/Desktop-verktyg
- Behåll monteringen `data/files` om Drive-uppladdningar och filer genererade av skills ska överleva container-omstarter
- **Plugins:** för att aktivera dem, sätt `HEYM_PLUGINS_ENABLED=true` och `HEYM_PLUGIN_ADMIN_EMAILS`, och montera `data/plugins` så att installerade plugin-filer finns kvar över container-återskapanden. Plugin-metadata finns i PostgreSQL, så den överlever också. En plugins deklarerade pip-`dependencies` installeras i containern vid installationstillfället; eftersom imagen filsystem är efemärt **installeras de om automatiskt vid uppstart** för varje installerad plugin (release-imagens `uv`-venv är skrivbar, så detta fungerar även i single-container-imagen)

### Flytta en befintlig databas till en namngiven volym

`./deploy.sh --migrate-pgdata` känner bara till Compose-stacken. Om release-imagen körs mot en egen PostgreSQL-container och den containern bind-monterar en värdkatalog, migrera den manuellt.

Kontrollera först vad databascontainern använder:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Om `"Type"` visar `bind`, flytta den till en namngiven volym:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    volymnamn om denna Docker-host kör mer än en Heym-distribution.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Starta PostgreSQL igen på volymen, återanvänd de flaggor som användes tidigare
#    men ersätt bind-monteringen.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. När den accepterar anslutningar, bygg om index.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Använd den egna imagen i steg 2 och 3, inte `postgres:16`.** Om databasen kör `pgvector/pgvector:pg16` eller en annan variant kan start av det kopierade klustret med standardimagen misslyckas eftersom de förväntade tilläggsbiblioteken saknas.

Den ursprungliga datakatalogen påverkas inte av detta förfarande, så den kvarstår som återställningsväg. Ta bort den först efter att den migrerade databasen har bekräftats betjäna arbetsflödena. Steg 4 är viktigt av samma skäl som i Compose-migreringen: kopian bär med sig eventuella befintliga indexskador.

---

## Köra mer än en instans

Allt ovanstående distribuerar en enda Heym-instans. När en maskin inte längre
räcker, peka en andra instans mot samma PostgreSQL-databas så ansluter den som
en worker: bakgrundskörningar — cron, webhooks, MCP-verktygsanrop, chatt-triggers —
delas då mellan instanserna enligt en procentsats som anges under
**Settings → Instances**.

Instanserna kommunicerar aldrig med varandra. Postgres bär arbetet, så en worker
behöver ingen öppen port och ingen väg tillbaka till huvudinstansen, och ingen
meddelandebroker är inblandad. Arbete som rör lokal disk — Drive-filer,
kodagent-arbetsytor, installerade plugins — körs alltid på huvudinstansen, så
inget behöver delas över ett filsystem.

Två regler som klustret inte kan upprätthålla: varje instans måste använda samma
`SECRET_KEY` och `ENCRYPTION_KEY`, och ingress får endast peka mot
huvudinstansen. Båda förklaras, tillsammans med placeringsreglerna och hur
procentsatserna väljs, i [Load Distribution](../reference/cluster.md).

> Detta är lastfördelning, inte hög tillgänglighet. Huvudinstansen förblir en
> enskild felpunkt för ingress, fillagring och editorn.

## Vanliga arbetsflöden

**Första installationen:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

För den förbyggda `docker run`-imagen, generera nycklarna manuellt först (se avsnittet **Prebuilt Image** ovan).

**Uppdatera produktion efter en kodändring:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Kontrollera produktionsloggar:**

```bash
./deploy.sh --logs
```

**Stoppa produktionstjänster:**

```bash
./deploy.sh --down
```

---

## Relaterat

- [Introduction](./introduction.md) – Plattformsöversikt
- [Quick Start](./quick-start.md) – Bygg det första workflowet
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fullständig konfigurationsreferens
- [Security](../reference/security.md) – JWT-, krypterings- och CORS-inställningar
- [Load Distribution](../reference/cluster.md) – Kör flera instanser mot en databas

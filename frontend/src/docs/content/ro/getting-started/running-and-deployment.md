# Rulare și Implementare

Heym oferă două scripturi pentru medii diferite: `run.sh` pentru dezvoltare locală și `deploy.sh` pentru implementări în producție folosind Docker Compose.

> **Prezentare video:** [Configurați Heym local în mai puțin de 2 minute](https://www.youtube.com/watch?v=P6YvlupUboU) — clonați depozitul, porniți PostgreSQL, completați variabilele de mediu necesare și creați primul cont pe o instanță locală.

## Cerințe preliminare

Ambele scripturi necesită instalarea următoarelor instrumente:

| Instrument | Scop |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Container pentru baza de date (dev) și stiva completă (prod) |
| [uv](https://github.com/astral-sh/uv) | Manager de pachete Python pentru backend |
| [bun](https://bun.sh) | Runtime JavaScript pentru frontend |

## Configurarea mediului

Atât `run.sh`, cât și `deploy.sh` citesc dintr-un fișier `.env` aflat în rădăcina proiectului. Dacă acesta nu există, scriptul creează automat unul din `.env.example` — atât pentru dezvoltare locală, cât și pentru producție.

`SECRET_KEY` și `ENCRYPTION_KEY` sunt livrate goale în `.env.example`. Când oricare dintre ele este goală, `run.sh` și `deploy.sh` generează automat o valoare criptografică puternică și o scriu înapoi în `.env`, astfel încât o configurare nouă nu necesită gestionarea manuală a cheilor. Dacă un `.env` existent conține încă substituentul legacy `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), scripturile se opresc cu o eroare explicită în loc să îl suprascrie — rotirea acelei chei ar face ca acreditările criptate anterior să devină ilizibile. Backend-ul însuși refuză de asemenea să pornească dacă oricare dintre chei este goală sau lăsată la un substituent cunoscut.

Pentru a crea fișierul manual (opțional — scripturile fac acest lucru pentru dumneavoastră):

```bash
cp .env.example .env
```

Variabile de mediu principale:

Pentru fiecare variabilă acceptată, valoarea implicită și notele pentru producție, consultați [Variabile de mediu](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabilă | Descriere |
|----------|-------------|
| `SECRET_KEY` | **Obligatorie.** Secret pentru semnarea JWT. Generată automat de `run.sh`/`deploy.sh` când este goală. |
| `ENCRYPTION_KEY` | **Obligatorie.** Cheie de criptare a acreditărilor. Generată automat de `run.sh`/`deploy.sh` când este goală. |
| `DATABASE_URL` | Suprascriere opțională a șirului de conexiune la baza de date. Dacă este goală, Heym o construiește din setările `POSTGRES_*`. |
| `BACKEND_PORT` | Portul API-ului backend — implicit `10105` |
| `FRONTEND_PORT` | Portul frontend — implicit `4017` |
| `FRONTEND_URL` | **Obligatorie în producție.** URL-ul public al aplicației (schemă + gazdă, de ex. `https://heym.example.com`). Folosită pentru URI-urile de redirecționare OAuth (Google Sheets, BigQuery, Notion și altele similare) și pentru linkurile de recenzare, de continuare Codex și de fișiere pe care le generează rulările din fundal; trebuie să corespundă URL-ului pe care utilizatorii îl folosesc în browser. Într-un cluster, setați aceeași valoare pe fiecare instanță. |
| `ALLOW_REGISTER` | Înregistrare deschisă a utilizatorilor (`false` în prod, `true` în dev). Comutați-o pe `false` doar după ce contul de administrator există — nu există un bootstrap pentru primul utilizator, astfel încât o bază de date goală împreună cu înregistrarea dezactivată nu lasă nicio modalitate de a crea unul. |
| `DOCKER_LOGS_ENABLED` | Activează accesul la fila Logs susținută de Docker când este setată pe `true`; necesită de asemenea acces la socket-ul Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Listă separată prin virgule de adrese de email ale utilizatorilor de încredere cărora li se permite accesul la logurile Docker când `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Dimensiunea maximă a corpului cererii HTTP acceptată înainte de rularea handler-elor endpoint-urilor; implicit `100`, cu un MB peste `FILE_MAX_SIZE_MB` pentru a lăsa loc pentru suprasarcina multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Modul în care rulează instrumentele Python definite de utilizator: `auto` (implicit — container Docker izolat și securizat; eșuează în siguranță dacă Docker nu este disponibil), `docker` (la fel, nu face niciodată fallback) sau `subprocess` (fallback local în proces; nu este o graniță de securitate, doar pentru medii de încredere/dev). `run.sh` setează `subprocess` pentru dezvoltare nativă. Consultați [Securitate](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Imaginea folosită pentru sandbox-ul Docker al instrumentelor Python. Goală = detectează automat imaginea backend-ului în execuție. |

Valorile implicite pentru conexiunea la baza de date (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) sunt documentate în [Variabile de mediu](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) și `.env.example`.

---
## Dezvoltare: `run.sh`

`run.sh` pornește toate cele trei servicii local — baza de date (ca un container Docker), backend-ul FastAPI și serverul de dezvoltare Vite — printr-o singură comandă.

```bash
./run.sh
```

**Ce face, pas cu pas:**

1. Verifică dacă `docker`, `bun` și `uv` sunt disponibile
2. Creează `.env` din `.env.example` dacă lipsește și generează un `SECRET_KEY` și un `ENCRYPTION_KEY` aleatorii atunci când oricare dintre ele este gol
3. Pornește (sau creează) un container Docker pentru baza de date pe portul `6543`, stocând datele acestuia în volumul Docker `heym-postgres-data` în locul unui director de pe gazdă
4. Instalează dependențele Python prin `uv sync`
5. Rulează migrările bazei de date Alembic (`alembic upgrade head`)
6. Eliberează porturile backend-ului și frontend-ului dacă sunt ocupate
7. Pornește backend-ul FastAPI cu `--reload` (reîncărcare automată la modificările de cod)
8. Instalează dependențele frontend-ului prin `bun install`
9. Pornește serverul de dezvoltare Vite

**Opțiuni:**

| Flag | Descriere |
|------|-------------|
| *(niciunul)* | Pornește cu logging de debug activat (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Pornește cu nivelul de log implicit (fără ieșire de debug) |
| `--help` | Afișează informațiile de utilizare |

**Adrese ale serviciilor (dev):**

| Serviciu | Adresă |
|---------|---------|
| Frontend | `localhost` pe `FRONTEND_PORT` (implicit: 4017) |
| Backend API | `localhost` pe `BACKEND_PORT` (implicit: 10105) |
| Documentație API interactivă | `localhost:10105/docs` |
| Baza de date | `localhost:6543` |

Apăsați `Ctrl+C` pentru a opri în mod controlat toate serviciile.

---

## Teste end-to-end: `run_e2e.sh`

Suita Playwright pentru frontend rulează împotriva aplicației Vue reale, a backend-ului FastAPI și a unei baze de date PostgreSQL izolate:

```bash
./run_e2e.sh
```

Suita este o suită de smoke și regresie pentru căile critice, nu o acoperire exhaustivă a produsului. Aceasta acoperă autentificarea, ciclul de viață și execuția fluxurilor de lucru principale, resursele selectate din dashboard, rutele publice și o interfață de revizuire HITL simulată. Integrările cu furnizorii, fiecare tip de nod, matricele de partajare/permisiuni și execuția completă a reluării HITL rămân acoperite în principal de testele backend sau necesită medii de integrare dedicate.

Fiecare rulare primește propriul container temporar PostgreSQL 16, porturi aleatorii disponibile pentru baza de date/backend/frontend, stare de autentificare, rezultate ale testelor și raport HTML. Acest lucru permite rularea concurentă a mai multor procese `run_e2e.sh` fără partajarea stării sau suprascrierea artefactelor. Scriptul elimină containerul bazei de date la finalizarea rulării și afișează directorul artefactelor și calea raportului.

Comenzi utile:

```bash
./run_e2e.sh --ui         # Runner Playwright interactiv cu o bază de date izolată
cd frontend
bun run test:e2e:report   # Deschide cea mai recentă rulare locală finalizată
```

Rulările directe `bun run test:e2e` și `bun run test:e2e:ui` necesită un `DATABASE_URL` explicit, astfel încât să nu poată porni silențios împotriva bazei de date locale de dezvoltare. Utilizați `./run_e2e.sh` pentru rulări locale normale.

`./check.sh` rulează lint, verificarea tipurilor, formatarea și testele backend fără suita E2E, menținând calea implicită de verificare locală rapidă. Rulați testele Playwright E2E separat cu `./run_e2e.sh`. Pull request-urile rulează întotdeauna suita E2E Chromium în GitHub Actions și păstrează trace-urile, capturile de ecran, înregistrările video și raportul HTML atunci când apar eșecuri.

---
## Producție: `deploy.sh`

`deploy.sh` construiește și rulează întregul stack folosind Docker Compose. Toate cele trei servicii — baza de date, backend-ul și frontend-ul — rulează ca containere. Entrypoint-ul backend-ului rulează automat migrările înainte de a porni serverul cu 8 workers.

**Implementare inițială (build + pornire):**

```bash
./deploy.sh
```

Aceasta efectuează o implementare fără downtime: imaginile sunt construite mai întâi în timp ce containerele existente continuă să ruleze, apoi noua versiune este comutată.

**Comenzi disponibile:**

| Comandă | Descriere |
|---------|-------------|
| `./deploy.sh` | Construiește imaginile și pornește/actualizează toate serviciile |
| `./deploy.sh --status` | Afișează starea containerelor |
| `./deploy.sh --logs` | Transmite în flux jurnalele din toate containerele |
| `./deploy.sh --restart` | Repornește toate containerele |
| `./deploy.sh --down` | Oprește și elimină toate containerele |
| `./deploy.sh --migrate-pgdata` | Migrare unică: copiază un director existent `data/postgres` în volumul Docker `heym-postgres-data` și reconstruiește indecșii acestuia |
| `./deploy.sh --help` | Afișează informații de utilizare |

**Stocarea bazei de date: un volum numit Docker, nu un director gazdă.**

Compose stochează PostgreSQL în volumul Docker `heym-postgres-data`. Versiunile anterioare montau prin bind directorul gazdă `./data/postgres`. Montările bind pe gazdă pe macOS (virtiofs) și Windows/WSL2 nu oferă PostgreSQL garanțiile de `fsync` și închidere de fișiere pe care le necesită: clusterele de acolo întâmpină `PANIC: could not close file … Input/output error` pe segmentele WAL și se corup în timp. Montările bind pe Linux nu au fost niciodată afectate, dar fiecare platformă folosește acum același layout.

Actualizarea unei implementări care mai are date în `./data/postgres` este un pas unic. `./deploy.sh` detectează acest lucru, se oprește înainte de build și vă solicită să migrați mai întâi:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Migrarea reconstruiește și indecșii.** Copia este byte-cu-byte, astfel încât deteriorarea indecșilor cauzată de vechea montare bind se transferă odată cu ea. Prin urmare, `--migrate-pgdata` pornește serviciul `postgres` singur pe noul volum, rulează `reindexdb` asupra acestuia și îl oprește din nou înainte ca restul stack-ului să pornească. Acest lucru este important deoarece această clasă de corupere lasă intrări de index care indică dincolo de sfârșitul heap-ului — o stare pe care `pg_amcheck` o raportează ca fiind curată, astfel încât o verificare care trece nu este dovada unui tabel sănătos. REINDEX repară acele intrări; nu poate restaura paginile heap pe care vechiul sistem de fișiere le-a pierdut deja. Pe o bază de date mare, cunoscută ca sănătoasă, puteți ocoli reconstruirea cu `./deploy.sh --migrate-pgdata --skip-reindex`.

Copia este non-distructivă. `./data/postgres` rămâne pe loc ca backup, iar migrarea refuză să suprascrie un volum care conține deja o bază de date. Dacă orice pas eșuează, noul volum este eliminat, astfel încât un cluster pe jumătate migrat nu poate fi implementat din greșeală. Ștergeți directorul vechi odată ce ați confirmat că workflow-urile dumneavoastră sunt intacte. Containerul `postgres` poartă aceeași protecție, astfel încât un `docker compose up` manual nu poate inițializa silențios o bază de date goală peste datele dumneavoastră. Instalările noi nu necesită nicio acțiune.

**Adrese de servicii (producție):**

Containerul frontend este expus pe `FRONTEND_PORT` (implicit: 4017). API-ul backend este servit sub calea `/api`, proxy-uit prin containerul frontend — astfel încât există un singur port public în producție.

**Prezentare generală a containerelor:**

| Container | Descriere |
|-----------|-------------|
| `heym-db` | Bază de date relațională |
| `heym-backend` | Server API FastAPI (8 workers, construit din `backend/Dockerfile`) |
| `heym-frontend` | Container de previzualizare frontend care servește aplicația Vue construită (construit din `frontend/Dockerfile`) |

**Insigna de actualizare a versiunii:**

Antetul aplicației afișează versiunea build-ului Docker care rulează. Când acea versiune este în urma celei mai recente versiuni Heym de pe GitHub, o insignă mov **Update** apare lângă versiune. Faceți clic pe versiune sau pe insignă pentru a deschide pagina de versiuni Heym de pe GitHub.

---
## Imagine preconstruită: `docker run`

Dacă preferați să nu compilați aplicația local, puteți descărca imaginea de container publicată și o puteți rula direct.

Imaginea pornește frontend-ul și backend-ul împreună, într-un singur container. PostgreSQL rămâne extern, dar puteți furniza fie `DATABASE_URL`, fie variabilele `POSTGRES_*` din `.env.example`.

> **Stocați baza de date într-un volum numit Docker.** Imaginea de release nu include o bază de date, astfel încât PostgreSQL-ul din spatele `DATABASE_URL` este responsabilitatea dumneavoastră. Montați-l ca `-v heym-postgres-data:/var/lib/postgresql/data` în loc de o cale de pe gazdă: pe macOS (virtiofs) și Windows/WSL2, un director de date PostgreSQL montat prin bind nu respectă garanțiile `fsync` cerute de baza de date și corupe cluster-ul în timp.

> **Backend pentru vector store.** `run.sh` și `deploy.sh` rulează imaginea oficială `postgres:16` și instalează automat pachetul `postgresql-16-pgvector` la pornire, astfel încât **backend-ul RAG Postgres (pgvector)** funcționează direct acolo, fără modificări ale datelor dumneavoastră. Imaginea preconstruită cu un singur container, însă, se conectează la un PostgreSQL furnizat de **dumneavoastră** — acea bază de date trebuie să suporte extensia `vector` pentru a utiliza backend-ul Postgres. Heym nu poate instala pgvector într-o bază de date pe care nu o administrează. Fără aceasta, migrarea de la pornire omite cu grație tabelul pgvector — implementarea reușește în continuare, RAG-ul Qdrant continuă să funcționeze, iar crearea sau încărcarea într-un vector store Postgres returnează un mesaj clar „backend unavailable" până când pgvector este activat.

**Setați cheile dumneavoastră pentru rulările directe ale imaginii.** Spre deosebire de `run.sh`/`deploy.sh`, imaginea preconstruită nu generează automat chei. După `cp .env.example .env`, completați cele două chei goale (înlocuirea pe loc evită intrările duplicate):

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

> **Faceți absolute montările pentru fișiere și plugin-uri.** `FILE_STORAGE_DIR` și `HEYM_PLUGINS_DIR` au ca valori implicite căile relative `./data/files` și `data/plugins`, iar imaginea de release pornește backend-ul din `/app/backend`. Lăsate relative, acestea se rezolvă la `/app/backend/data/files` și `/app/backend/data/plugins`, astfel încât cele două montări bind de mai sus nu primesc nimic, iar încărcările se pierd la înlocuirea containerului. Flag-urile `-e` suprascriu valorile relative furnizate de `.env.example` prin `--env-file`, deoarece `-e` din linia de comandă are prioritate față de `--env-file`. Compose (`./deploy.sh`) nu are nevoie de acest lucru: acea imagine rulează backend-ul din `/app`, unde valorile implicite relative ajung deja pe montări.

> **Accesul la socket-ul Docker.** Montarea `/var/run/docker.sock` oferă backend-ului control extins asupra daemon-ului Docker de pe gazdă. Serviciul implicit Docker Compose și exemplul direct `docker run` îl includ pentru uneltele MCP stdio bazate pe Docker care rulează comenzi `docker`. Tab-ul Logs necesită totuși `DOCKER_LOGS_ENABLED=true` și `DOCKER_LOGS_ALLOWED_EMAILS` cu o listă separată prin virgule de adrese de email ale utilizatorilor de încredere. Creați contul de administrator de încredere înainte de a activa logurile Docker sau păstrați `ALLOW_REGISTER=false`, astfel încât o auto-înregistrare neverificată să nu poată revendica un email aflat pe lista de permisiuni. Uneltele Python definite de utilizator **nu** primesc acest socket: acestea rulează într-un container separat, securizat, fără socket Docker. Consultați [Security](../reference/security.md#python-tool-sandbox).

> **Runner Codex.** Nodul Codex utilizează aceeași imagine `ghcr.io/heymrun/heym` ca un container runner frate (`--entrypoint codex`), astfel încât sandbox-ul Linux al Codex să poată crea namespace-uri. Păstrați montarea volumului `heym-codex-workspaces` dacă doriți workflow-uri Codex în configurația directă a imaginii; runner-ul nu primește socket-ul Docker sau secretele backend-ului.

> **Runner OpenCode Go.** Nodul OpenCode Go utilizează aceeași imagine ca un runner frate securizat (`--entrypoint opencode`), partajând `heym-opencode-workspaces`. Păstrați acea montare de volum dacă doriți workflow-uri OpenCode în configurația directă a imaginii; runner-ul nu primește socket-ul Docker sau token-ul GitHub.

> **Sandbox pentru skill-uri.** Skill-urile Python de pe nodul Agent rulează într-un container frate securizat care partajează volumul `heym-codex-workspaces`, așa că păstrați acea montare de volum și pentru skill-uri — nu doar pentru Codex. Fiecare rulare primește o subcale izolată per rulare, iar fratele nu primește nici socket-ul Docker, nici secretele backend-ului. Acest lucru necesită **Docker Engine 25.0+**; pe motoare mai vechi sau fără volum, `HEYM_PYTHON_TOOL_SANDBOX=auto` eșuează în siguranță — setați `HEYM_PYTHON_TOOL_SANDBOX=subprocess` doar pentru configurații de încredere cu un singur utilizator. Consultați [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` este necesar pentru Playwright.** Docker alocă unui container 64 MB pentru `/dev/shm`, iar Chromium își blochează renderer-ul sub această limită. Nodurile Playwright bazate pe pași rulează Chromium ca subproces în interiorul acestui container, astfel încât limita este cea a acestui container; `playwrightCode` personalizat rulează într-un container frate care își stabilește propria limită. `docker-compose.yml` declară deja `shm_size: "2gb"`, astfel încât `run.sh` și `deploy.sh` nu sunt afectate — doar o comandă simplă `docker run` necesită acest flag.

> **Playwright Run Code.** Codul Playwright Python personalizat necesită `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` și montarea socket-ului Docker de mai sus. Imaginea de release stabilește `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` pentru structura GHCR (`/app/backend/.venv`). Comanda Compose `./deploy.sh` stabilește implicit imaginea sandbox la `heym-backend:local`. Păstrați `--no-sandbox` în argumentele de lansare Chromium din interiorul containerelor sandbox.

**Variabile de mediu minime pentru rularea directă a imaginii:**

| Variabilă | Obligatoriu | Scop |
|----------|----------|---------|
| `DATABASE_URL` | Opțional | Suprascriere completă a șirului de conexiune PostgreSQL |
| `POSTGRES_HOST` | Da, dacă `DATABASE_URL` este gol | Gazdă PostgreSQL |
| `POSTGRES_PORT` | Da, dacă `DATABASE_URL` este gol | Port PostgreSQL |
| `POSTGRES_USER` | Da, dacă `DATABASE_URL` este gol | Nume utilizator PostgreSQL |
| `POSTGRES_PASSWORD` | Da, dacă `DATABASE_URL` este gol | Parolă PostgreSQL |
| `POSTGRES_DB` | Da, dacă `DATABASE_URL` este gol | Nume bază de date PostgreSQL |
| `SECRET_KEY` | Da | Secret pentru semnarea JWT |
| `ENCRYPTION_KEY` | Da | Cheie de criptare a acreditărilor |
| `FRONTEND_URL` | Recomandat | URL public pentru browser, în special pentru callback-urile OAuth |
| `CORS_ORIGINS` | Recomandat | Origini browser permise |
| `FILE_STORAGE_DIR` | Recomandat | Stabiliți-o la o cale absolută `/app/data/files` când montați acea cale; valoarea implicită relativă `./data/files` se rezolvă sub `/app/backend` în această imagine și ratează montarea |
| `ALLOW_REGISTER` | Recomandat | Stabiliți `false` în producție dacă nu se dorește înregistrare deschisă, dar numai după ce contul de administrator există — nu există inițializare pentru primul utilizator |
| `DOCKER_LOGS_ENABLED` | Opțional | Stabiliți `true` pentru a permite filei Logs să utilizeze accesul la socket-ul Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obligatoriu când `DOCKER_LOGS_ENABLED=true` | Listă separată prin virgule de adrese de email ale utilizatorilor de încredere permise să acceseze logurile Docker |
| `HEYM_PLUGINS_ENABLED` | Opțional | Stabiliți `true` pentru a activa subsistemul de pluginuri (noduri personalizate instalate ca zip). Dezactivat implicit |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obligatoriu când `HEYM_PLUGINS_ENABLED=true` | Adrese de email ale operatorilor, separate prin virgule, permise să instaleze/dezinstaleze pluginuri |
| `HEYM_PLUGINS_DIR` | Opțional | Locul unde sunt stocate fișierele pluginurilor. Stabiliți-o la o cale absolută `/app/data/plugins` când montați acea cale; valoarea implicită relativă `data/plugins` se rezolvă sub `/app/backend` în această imagine și ratează montarea |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opțional | Modul de izolare a instrumentului Python; implicit `auto` (sandbox Docker securizat, fail closed). Consultați [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opțional | Suprascrie imaginea sandbox a instrumentului Python; gol = detectare automată a imaginii backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opțional | Volumul Docker utilizat de containerele frate ale runner-ului Codex; implicit `heym-codex-workspaces` în implementările Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opțional | Permite comenzilor sandbox ale Codex să descarce fișiere/dependențe; implementările Docker activează această opțiune implicit |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opțional | Volumul Docker utilizat de containerele frate ale runner-ului OpenCode; implicit `heym-opencode-workspaces` în implementările Docker |

**Note:**

- Imaginea expune portul `4017`
- Backend-ul rămâne intern și este proxy-uit sub `/api`
- Când `POSTGRES_HOST=localhost`, imaginea de release îl rescrie automat la `host.docker.internal` atunci când este necesar, astfel încât același `.env` să funcționeze cu un container PostgreSQL la nivel de gazdă pe instrumentele macOS Docker/Desktop
- Păstrați montarea `data/files` dacă doriți ca încărcările Drive și fișierele generate de skill-uri să supraviețuiască repornirilor containerului
- **Pluginuri:** pentru a le activa, stabiliți `HEYM_PLUGINS_ENABLED=true` și `HEYM_PLUGIN_ADMIN_EMAILS` și montați `data/plugins` astfel încât fișierele pluginurilor instalate să persiste între recreările containerului. Metadatele pluginurilor sunt stocate în PostgreSQL, astfel încât persistă și ele. Dependențele pip declarate ale unui plugin sunt instalate în container la momentul instalării; deoarece sistemul de fișiere al imaginii este efemer, acestea sunt **reinstalate automat la pornire** pentru fiecare plugin instalat (venv-ul `uv` al imaginii de release este inscriptibil, astfel încât acest lucru funcționează și în imaginea cu un singur container)

### Mutarea unei baze de date existente într-un volum cu nume

`./deploy.sh --migrate-pgdata` cunoaște doar stiva Compose. Dacă rulați imaginea de release împotriva propriului container PostgreSQL și acel container montează un director gazdă prin bind-mount, migrați-l manual.

Verificați mai întâi ce utilizează containerul bazei de date:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Dacă `"Type"` afișează `bind`, mutați-l într-un volum cu nume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    numele volumului dacă acest gazdă Docker rulează mai multe implementări Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Porniți din nou PostgreSQL pe volum, reutilizând flag-urile pe care le-ați avut anterior
#    dar înlocuind bind mount-ul.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Odată ce acceptă conexiuni, reconstruiți indecșii.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilizați propria imagine la pașii 2 și 3, nu `postgres:16`.** Dacă baza de date rulează `pgvector/pgvector:pg16` sau altă variantă, pornirea clusterului copiat cu imaginea standard poate eșua deoarece bibliotecile de extensie pe care le așteaptă lipsesc.

Directorul original de date nu este afectat de această procedură, deci rămâne calea dumneavoastră de rollback. Ștergeți-l doar după ce confirmați că baza de date migrată deservește workflow-urile dumneavoastră. Pasul 4 contează din același motiv ca în migrarea Compose: copia transportă orice deteriorare existentă a indecșilor.

---

## Rularea mai multor instanțe

Tot ce este descris mai sus implementează o singură instanță Heym. Când o singură mașină nu mai este suficientă, îndreptați o a doua instanță către aceeași bază de date PostgreSQL și aceasta se alătură ca worker: rulările din fundal — cron, webhook-uri, apeluri de unelte MCP, trigger-e de chat — sunt apoi partajate între instanțe după un procent pe care îl stabiliți la **Settings → Instances**.

Instanțele nu comunică niciodată între ele. Postgres transportă lucrul, astfel încât un worker nu are nevoie de port deschis și nici de rută înapoi către instanța principală și nu este implicat niciun message broker. Lucrul care atinge discul local — fișiere Drive, spații de lucru ale agenților de cod, plugin-uri instalate — rulează întotdeauna pe instanța principală, deci nimic nu trebuie partajat printr-un filesystem.

Două reguli pe care clusterul nu le poate impune pentru dumneavoastră: fiecare instanță trebuie să utilizeze același `SECRET_KEY` și `ENCRYPTION_KEY`, iar ingress-ul trebuie să indice doar către instanța principală. Ambele sunt explicate, împreună cu regulile de plasare și modul de alegere a procentelor, în [Load Distribution](../reference/cluster.md).

> Aceasta este distribuție de sarcină, nu disponibilitate ridicată. Instanța principală rămâne un punct unic de eșec pentru ingress, stocarea fișierelor și editor.

## Workflow-uri comune

**Configurare inițială:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Pentru imaginea preconstruită `docker run`, generați mai întâi cheile manual (consultați secțiunea **Prebuilt Image** de mai sus).

**Actualizați producția după o modificare de cod:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Verificați jurnalele de producție:**

```bash
./deploy.sh --logs
```

**Opriți serviciile de producție:**

```bash
./deploy.sh --down
```

---

## Resurse conexe

- [Introduction](./introduction.md) – Prezentare generală a platformei
- [Quick Start](./quick-start.md) – Construiți primul dumneavoastră workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referință completă de configurare
- [Security](../reference/security.md) – Setări JWT, criptare și CORS
- [Load Distribution](../reference/cluster.md) – Rulați mai multe instanțe împotriva unei singure baze de date

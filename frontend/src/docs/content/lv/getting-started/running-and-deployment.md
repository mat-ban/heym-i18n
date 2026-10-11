# Palaišana un izvietošana

Heym nodrošina divus skriptus dažādām vidēm: `run.sh` lokālai izstrādei un `deploy.sh` ražošanas izvietošanai, izmantojot Docker Compose.

> **Video pamācība:** [Iestatiet Heym lokāli mazāk nekā 2 minūtēs](https://www.youtube.com/watch?v=P6YvlupUboU) — klonējiet repozitoriju, palaidiet PostgreSQL, aizpildiet nepieciešamos vides mainīgos un izveidojiet savu pirmo kontu lokālā instancē.

## Priekšnosacījumi

Abiem skriptiem ir nepieciešami šādi instalēti rīki:

| Rīks | Mērķis |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Datubāzes konteiners (izstrāde) un pilna steks (ražošana) |
| [uv](https://github.com/astral-sh/uv) | Python pakotņu pārvaldnieks aizmugursistēmai |
| [bun](https://bun.sh) | JavaScript izpildlaiks priekšpusei |

## Vides iestatīšana

Gan `run.sh`, gan `deploy.sh` nolasa no `.env` faila projekta saknes mapē. Ja tas neeksistē, skripts automātiski izveido to no `.env.example` — gan lokālai izstrādei, gan ražošanai.

`SECRET_KEY` un `ENCRYPTION_KEY` `.env.example` failā ir tukši. Ja kāds no tiem ir tukšs, `run.sh` un `deploy.sh` automātiski ģenerē kriptogrāfiski stipru vērtību un ieraksta to atpakaļ `.env` failā, tāpēc svaigai iestatīšanai nav nepieciešama manuāla atslēgu apstrāde. Ja esošais `.env` fails joprojām satur mantoto `ENCRYPTION_KEY` aizvietotāju (`change_this_to_a_random_32_byte_hex_value`), skripti apstājas ar skaidru kļūdu, nevis to pārraksta — šīs atslēgas rotācija padarītu iepriekš šifrētos akreditācijas datus nelasāmus. Arī aizmugursistēma atsakās startēt, ja kāda no atslēgām ir tukša vai atstāta pie zināma aizvietotāja.

Lai izveidotu failu manuāli (neobligāti — skripti to izdara jūsu vietā):

```bash
cp .env.example .env
```

Galvenie vides mainīgie:

Par katru atbalstīto mainīgo, noklusējuma vērtību un ražošanas piezīmi skatiet [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Mainīgais | Apraksts |
|----------|-------------|
| `SECRET_KEY` | **Obligāts.** JWT parakstīšanas noslēpums. Automātiski ģenerē `run.sh`/`deploy.sh`, ja tukšs. |
| `ENCRYPTION_KEY` | **Obligāts.** Akreditācijas datu šifrēšanas atslēga. Automātiski ģenerē `run.sh`/`deploy.sh`, ja tukšs. |
| `DATABASE_URL` | Neobligāta datubāzes savienojuma virknes aizstāšana. Ja tukšs, Heym to veido no `POSTGRES_*` iestatījumiem. |
| `BACKEND_PORT` | Aizmugursistēmas API ports — noklusējums `10105` |
| `FRONTEND_PORT` | Priekšpuses ports — noklusējums `4017` |
| `FRONTEND_URL` | **Obligāts ražošanā.** Lietotnes publiskais URL (shēma + resursdators, piem., `https://heym.example.com`). Tiek izmantots OAuth novirzīšanas URI (Google Sheets, BigQuery, Notion un līdzīgiem), kā arī pārskatīšanas, Codex turpmākās darbības un failu saitēm, ko ģenerē fona izpildes; jāsakrīt ar URL, ko lietotāji izmanto pārlūkā. Klasterī iestatiet vienu un to pašu vērtību katrā instancē. |
| `ALLOW_REGISTER` | Atvērta lietotāju reģistrācija (`false` ražošanā, `true` izstrādē). Pārslēdziet to uz `false` tikai pēc tam, kad jūsu administratora konts jau eksistē — nav pirmā lietotāja sāknēšanas, tāpēc tukša datubāze kopā ar atspējotu reģistrāciju neatstāj nevienu veidu, kā to izveidot. |
| `DOCKER_LOGS_ENABLED` | Iespējo Docker balstītu Logs cilnes piekļuvi, ja iestatīts uz `true`; nepieciešama arī Docker socket piekļuve |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Ar komatu atdalīts uzticamo lietotāju e-pastu saraksts, kuriem atļauta piekļuve Docker žurnāliem, ja `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maksimālais HTTP pieprasījuma ķermeņa izmērs, kas pieņemts pirms endpoint apstrādātāju palaišanas; noklusējums `100`, viens MB virs `FILE_MAX_SIZE_MB`, lai atstātu vietu multipart papildu izmaksām |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kā darbojas lietotāja definētie Python rīki: `auto` (noklusējums — nostiprināts, izolēts Docker konteiners; droši neizdodas, ja Docker nav pieejams), `docker` (tāpat, nekad neatkāpjas), vai `subprocess` (lokāla atkāpšanās procesā; nav drošības robeža, tikai uzticamai/izstrādes videi). `run.sh` iestata `subprocess` vietējai izstrādei. Skatiet [Drošība](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Attēls, kas izmantots Python rīku Docker smilškastē. Tukšs = automātiski noteikt darbojošos aizmugursistēmas attēlu. |

Datubāzes savienojuma noklusējumi (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) ir dokumentēti [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) un `.env.example`.

---

## Izstrāde: `run.sh`

`run.sh` palaiž visus trīs pakalpojumus lokāli — datubāzi (kā Docker konteineri), FastAPI backend un Vite izstrādes serveri — ar vienu komandu.

```bash
./run.sh
```

**Ko tas dara, soli pa solim:**

1. Pārbauda, vai ir pieejami `docker`, `bun` un `uv`
2. Izveido `.env` no `.env.example`, ja tā trūkst, un ģenerē nejaušu `SECRET_KEY` un `ENCRYPTION_KEY`, ja kāds no tiem ir tukšs
3. Palaiž (vai izveido) datubāzes Docker konteineri uz porta `6543`, saglabājot tā datus `heym-postgres-data` Docker sējumā, nevis resursdatora direktorijā
4. Instalē Python atkarības ar `uv sync`
5. Palaiž Alembic datubāzes migrācijas (`alembic upgrade head`)
6. Atbrīvo backend un frontend portus, ja tie ir aizņemti
7. Palaiž FastAPI backend ar `--reload` (karstā pārlāde, mainoties kodam)
8. Instalē frontend atkarības ar `bun install`
9. Palaiž Vite izstrādes serveri

**Opcijas:**

| Karodziņš | Apraksts |
|------|-------------|
| *(nav)* | Palaist ar iespējotu atkļūdošanas žurnālēšanu (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Palaist ar noklusējuma žurnāla līmeni (bez atkļūdošanas izvades) |
| `--help` | Parādīt lietošanas informāciju |

**Pakalpojumu adreses (izstrāde):**

| Pakalpojums | Adrese |
|---------|---------|
| Frontend | `localhost` uz `FRONTEND_PORT` (noklusējums: 4017) |
| Backend API | `localhost` uz `BACKEND_PORT` (noklusējums: 10105) |
| Interaktīvā API dokumentācija | `localhost:10105/docs` |
| Datubāze | `localhost:6543` |

Nospiediet `Ctrl+C`, lai saudzīgi apturētu visus pakalpojumus.

---

## End-to-End testi: `run_e2e.sh`

Frontend Playwright komplekts darbojas pret reālo Vue lietotni, FastAPI backend un izolētu PostgreSQL datubāzi:

```bash
./run_e2e.sh
```

Komplekts ir galveno ceļu dūmu un regresijas komplekts, nevis visaptverošs produkta pārklājums. Tas aptver autentifikāciju, pamata Workflow dzīves ciklu un izpildi, atlasītus dashboard resursus, publiskos maršrutus un simulētu HITL pārskatīšanas UI. Nodrošinātāju integrācijas, katrs mezgla tips, koplietošanas/atļauju matricas un pilna HITL atsākšanas izpilde joprojām tiek pārsvarā segtas ar backend testiem vai prasa īpašas integrācijas vides.

Katrs palaišanas gadījums iegūst savu pagaidu PostgreSQL 16 konteineri, nejaušus pieejamus datubāzes/backend/frontend portus, autentifikācijas stāvokli, testu rezultātus un HTML atskaiti. Tas ļauj vairākiem `run_e2e.sh` procesiem darboties vienlaikus, nedalot stāvokli un nepārrakstot artefaktus. Skripts noņem savu datubāzes konteineri, kad palaišana ir pabeigta, un izdrukā artefaktu direktoriju un atskaites ceļu.

Noderīgas komandas:

```bash
./run_e2e.sh --ui         # Interaktīvais Playwright palaidējs ar izolētu datubāzi
cd frontend
bun run test:e2e:report   # Atvērt pēdējo pabeigto lokālo palaišanu
```

Tieša `bun run test:e2e` un `bun run test:e2e:ui` palaišana prasa skaidri norādītu `DATABASE_URL`, lai tie nevarētu klusi palaisties pret lokālo izstrādes datubāzi. Normālai lokālai palaišanai izmantojiet `./run_e2e.sh`.

`./check.sh` palaiž lint, typecheck, formatēšanu un backend testus bez E2E komplekta, saglabājot noklusējuma lokālās pārbaudes ceļu ātru. Playwright E2E testus palaidiet atsevišķi ar `./run_e2e.sh`. Pull request vienmēr palaiž Chromium E2E komplektu GitHub Actions un saglabā traces, ekrānuzņēmumus, video un HTML atskaiti, kad rodas kļūmes.

---

## Produkcija: `deploy.sh`

`deploy.sh` būvē un palaiž pilnu stack, izmantojot Docker Compose. Visi trīs servisi — datubāze, backend un frontend — darbojas kā konteineri. Backend entrypoint automātiski palaiž migrācijas pirms servera palaišanas ar 8 workers.

**Sākotnējā izvietošana (būvēšana + palaišana):**

```bash
./deploy.sh
```

Tas veic izvietošanu bez dīkstāves: attēli vispirms tiek būvēti, kamēr esošie konteineri turpina darboties, pēc tam jaunā versija tiek nomainīta.

**Pieejamās komandas:**

| Komanda | Apraksts |
|---------|-------------|
| `./deploy.sh` | Būvēt attēlus un palaist/atjaunināt visus servisus |
| `./deploy.sh --status` | Rādīt konteineru statusu |
| `./deploy.sh --logs` | Straumēt žurnālus no visiem konteineriem |
| `./deploy.sh --restart` | Restartēt visus konteinerus |
| `./deploy.sh --down` | Apturēt un noņemt visus konteinerus |
| `./deploy.sh --migrate-pgdata` | Vienreizēja migrācija: kopēt esošo `data/postgres` direktoriju uz `heym-postgres-data` Docker volume un pārbūvēt tā indeksus |
| `./deploy.sh --help` | Rādīt lietošanas informāciju |

**Datubāzes krātuve: Docker nosauktais volume, nevis host direktorijs.**

Compose glabā PostgreSQL `heym-postgres-data` Docker volume. Agrākās versijas tā vietā bind-mountēja host direktoriju `./data/postgres`. Host bind mount macOS (virtiofs) un Windows/WSL2 vidēs nenodrošina PostgreSQL nepieciešamās `fsync` un failu aizvēršanas garantijas: cluster šajās vidēs saskaras ar `PANIC: could not close file … Input/output error` WAL segmentos un laika gaitā sabojājas. Linux bind mount nekad netika ietekmēts, bet tagad visas platformas izmanto vienu un to pašu izkārtojumu.

Izvietojuma jaunināšana, kurā joprojām ir dati `./data/postgres`, ir vienreizējs solis. `./deploy.sh` to nosaka, apstājas pirms būvēšanas un lūdz vispirms veikt migrāciju:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Migrācija arī pārbūvē indeksus.** Kopija ir baitam pa baitam, tāpēc indeksu bojājumi, ko izraisīja vecais bind mount, pārceļas kopā ar to. Tāpēc `--migrate-pgdata` palaiž tikai `postgres` servisu jaunajā volume, palaiž pret to `reindexdb` un atkal to aptur pirms pārējā stack palaišanas. Tas ir svarīgi, jo šī veida bojājumi atstāj indeksa ierakstus, kas norāda aiz heap beigām — stāvoklis, ko `pg_amcheck` ziņo kā tīru, tāpēc veiksmīga pārbaude nav pierādījums veselīgai tabulai. REINDEX salabo šos ierakstus; tas nevar atjaunot heap lapas, ko vecā failu sistēma jau ir pazaudējusi. Lielā, zināmā veselīgā datubāzē varat apiet pārbūvi ar `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopija ir neiznīcinoša. `./data/postgres` paliek savā vietā kā dublējums, un migrācija atsakās pārrakstīt volume, kurā jau ir datubāze. Ja kāds solis neizdodas, jaunais volume tiek noņemts, tāpēc daļēji migrētu cluster nekad nevar nejauši izvietot. Izdzēsiet veco direktoriju, kad esat pārliecinājies, ka Jūsu workflow ir neskarti. `postgres` konteineram ir tāda pati aizsardzība, tāpēc manuāla `docker compose up` nevar klusi inicializēt tukšu datubāzi virs Jūsu datiem. Svaigām instalācijām nekāda darbība nav nepieciešama.

**Servisu adreses (produkcijā):**

Frontend konteiners ir pieejams uz `FRONTEND_PORT` (noklusējums: 4017). Backend API tiek apkalpots zem `/api` ceļa, proxyots caur frontend konteineru — tāpēc produkcijā ir tikai viens publiski pieejams ports.

**Konteineru pārskats:**

| Konteiners | Apraksts |
|-----------|-------------|
| `heym-db` | Relāciju datubāze |
| `heym-backend` | FastAPI API serveris (8 workers, būvēts no `backend/Dockerfile`) |
| `heym-frontend` | Frontend preview konteiners, kas apkalpo būvēto Vue lietotni (būvēts no `frontend/Dockerfile`) |

**Versijas atjaunināšanas badge:**

Lietotnes galvenē tiek rādīta darbojošā Docker būvējuma versija. Kad šī versija atpaliek no jaunākā Heym GitHub release, blakus versijai parādās violets **Update** badge. Noklikšķiniet uz versijas vai badge, lai atvērtu Heym GitHub releases lapu.

---

## Iepriekš sagatavots attēls: `docker run`

Ja nevēlaties lietotni būvēt lokāli, varat iegūt publicēto konteinera attēlu un palaist to tieši.

Attēls palaiž frontend un backend kopā vienā konteinerā. PostgreSQL joprojām ir ārējs, bet varat norādīt vai nu `DATABASE_URL`, vai `POSTGRES_*` mainīgos no `.env.example`.

> **Glabājiet savu datubāzi Docker nosauktajā sējumā.** Izlaiduma attēlā nav iekļauta datubāze, tāpēc PostgreSQL aiz `DATABASE_URL` ir jāpalaiž jums pašiem. Pievienojiet to kā `-v heym-postgres-data:/var/lib/postgresql/data`, nevis resursdatora ceļu: macOS (virtiofs) un Windows/WSL2 vidē bind-mountēta PostgreSQL datu direktorija neievēro `fsync` garantijas, ko datubāze prasa, un laika gaitā sabojā klasteri.

> **Vektoru krātuves aizmugursistēma.** `run.sh` un `deploy.sh` palaiž oficiālo `postgres:16` attēlu un startēšanas laikā automātiski instalē `postgresql-16-pgvector` pakotni, tāpēc **Postgres (pgvector) RAG aizmugursistēma** tur darbojas uzreiz bez izmaiņām jūsu datos. Tomēr iepriekš sagatavotais vienkonteinera attēls savienojas ar PostgreSQL, ko nodrošināt **jūs** — šai datubāzei ir jāatbalsta `vector` paplašinājums, lai izmantotu Postgres aizmugursistēmu. Heym nevar instalēt pgvector datubāzē, ko tas nepārvalda. Bez tā startēšanas migrācija saudzīgi izlaiž pgvector tabulu — izvietošana joprojām izdodas, Qdrant RAG turpina darboties, un Postgres vektoru krātuves izveide vai augšupielāde tajā atgriež skaidru ziņojumu "backend unavailable", līdz pgvector tiek iespējots.

**Iestatiet atslēgas paši tiešai attēla palaišanai.** Atšķirībā no `run.sh`/`deploy.sh` iepriekš sagatavotais attēls automātiski neģenerē atslēgas. Pēc `cp .env.example .env` aizpildiet abas tukšās atslēgas (aizstāšana vietā novērš dublētus ierakstus):

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

> **Padariet failu un spraudņu montāžas absolūtas.** `FILE_STORAGE_DIR` un `HEYM_PLUGINS_DIR` pēc noklusējuma ir relatīvie ceļi `./data/files` un `data/plugins`, un izlaiduma attēls palaiž backend no `/app/backend`. Atstāti relatīvi, tie tiek atrisināti uz `/app/backend/data/files` un `/app/backend/data/plugins`, tāpēc abas iepriekš minētās bind montāžas nesaņem neko, un augšupielādes tiek zaudētas, kad konteiners tiek aizstāts. Karodziņi `-e` pārraksta relatīvās vērtības, ko `.env.example` nodrošina caur `--env-file`, jo komandrindas `-e` uzvar pār `--env-file`. Compose (`./deploy.sh`) tam nav vajadzīgs: šis attēls palaiž backend no `/app`, kur relatīvie noklusējumi jau nonāk uz montāžām.

> **Docker socket piekļuve.** `/var/run/docker.sock` montēšana piešķir backend plašu kontroli pār resursdatora Docker dēmonu. Noklusējuma Docker Compose serviss un tiešās `docker run` piemērs to iekļauj Docker balstītiem MCP stdio rīkiem, kas izpilda `docker` komandas. Logs cilne joprojām prasa `DOCKER_LOGS_ENABLED=true` un `DOCKER_LOGS_ALLOWED_EMAILS` ar komatatdalītu uzticamo lietotāju e-pastu sarakstu. Izveidojiet uzticamo administratora kontu pirms Docker žurnālu iespējošanas vai paturiet `ALLOW_REGISTER=false`, lai nepārbaudīta pašreģistrācija nevarētu piesavināties atļauto e-pastu. Lietotāja definētie Python rīki **nesaņem** šo socket: tie darbojas atsevišķā nostiprinātā konteinerā bez Docker socket. Skatiet [Drošība](../reference/security.md#python-tool-sandbox).

> **Codex izpildītājs.** Codex mezgls izmanto to pašu `ghcr.io/heymrun/heym` attēlu kā blakus izpildītāja konteiners (`--entrypoint codex`), lai Codex Linux smilškaste varētu izveidot nosaukumtelpas. Paturiet `heym-codex-workspaces` sējuma montāžu, ja vēlaties Codex Workflow tiešā attēla iestatījumā; izpildītājs nesaņem Docker socket vai backend noslēpumus.

> **OpenCode Go izpildītājs.** OpenCode Go mezgls izmanto to pašu attēlu kā nostiprināts blakus izpildītājs (`--entrypoint opencode`), koplietojot `heym-opencode-workspaces`. Paturiet šo sējuma montāžu, ja vēlaties OpenCode Workflow tiešā attēla iestatījumā; izpildītājs nesaņem Docker socket vai GitHub Token.

> **Prasmju smilškaste.** Python prasmes Agent mezglā darbojas nostiprinātā blakus konteinerā, kas koplieto `heym-codex-workspaces` sējumu, tāpēc paturiet šo sējuma montāžu arī prasmēm — ne tikai Codex. Katrs palaidums iegūst izolētu apakšceļu katram palaidumam, un blakus konteiners nesaņem ne Docker socket, ne backend noslēpumus. Tam nepieciešams **Docker Engine 25.0+**; vecākos dzinējos vai bez sējuma `HEYM_PYTHON_TOOL_SANDBOX=auto` neizdodas droši — iestatiet `HEYM_PYTHON_TOOL_SANDBOX=subprocess` tikai uzticamiem viena lietotāja iestatījumiem. Skatiet [Drošība](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` ir nepieciešams Playwright.** Docker piešķir konteineram 64 MB `/dev/shm`, un Chromium šajā apjomā avarē savu renderētāju. Uz soļiem balstīti Playwright mezgli palaiž Chromium kā apakšprocesu šajā konteinerā, tāpēc limits ir šī konteinera; pielāgotais `playwrightCode` darbojas blakus konteinerā, kas nosaka savu. `docker-compose.yml` jau deklarē `shm_size: "2gb"`, tāpēc `run.sh` un `deploy.sh` nav ietekmēti — tikai vienkāršam `docker run` ir vajadzīgs šis karodziņš.

> **Playwright Run Code.** Pielāgotam Playwright Python ir vajadzīgs `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` un iepriekš minētā Docker socket montāža. Izlaiduma attēls iestata `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` GHCR izkārtojumam (`/app/backend/.venv`). Compose `./deploy.sh` pēc noklusējuma iestata smilškastes attēlu uz `heym-backend:local`. Paturiet `--no-sandbox` Chromium palaišanas argumentos smilškastes konteineros.

**Minimālie vides mainīgie tiešai attēla palaišanai:**

| Mainīgais | Nepieciešams | Mērķis |
|----------|----------|---------|
| `DATABASE_URL` | Nav obligāts | Pilna PostgreSQL savienojuma virknes aizstāšana |
| `POSTGRES_HOST` | Jā, ja `DATABASE_URL` ir tukšs | PostgreSQL resursdators |
| `POSTGRES_PORT` | Jā, ja `DATABASE_URL` ir tukšs | PostgreSQL ports |
| `POSTGRES_USER` | Jā, ja `DATABASE_URL` ir tukšs | PostgreSQL lietotājvārds |
| `POSTGRES_PASSWORD` | Jā, ja `DATABASE_URL` ir tukšs | PostgreSQL parole |
| `POSTGRES_DB` | Jā, ja `DATABASE_URL` ir tukšs | PostgreSQL datubāzes nosaukums |
| `SECRET_KEY` | Jā | JWT parakstīšanas noslēpums |
| `ENCRYPTION_KEY` | Jā | Akreditācijas datu šifrēšanas atslēga |
| `FRONTEND_URL` | Ieteicams | Publiskais pārlūka URL, īpaši OAuth atzvanīšanai |
| `CORS_ORIGINS` | Ieteicams | Atļautās pārlūka izcelsmes |
| `FILE_STORAGE_DIR` | Ieteicams | Iestatiet to uz absolūtu `/app/data/files`, kad montējat šo ceļu; relatīvais noklusējums `./data/files` tiek atrisināts zem `/app/backend` šajā attēlā un netrāpa montāžā |
| `ALLOW_REGISTER` | Ieteicams | Iestatiet `false` produkcijā, ja vien nav paredzēta atvērta reģistrācija, bet tikai pēc tam, kad jūsu administratora konts pastāv — nav pirmā lietotāja sāknēšanas |
| `DOCKER_LOGS_ENABLED` | Nav obligāts | Iestatiet `true`, lai atļautu Logs cilnei izmantot Docker socket piekļuvi |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Nepieciešams, kad `DOCKER_LOGS_ENABLED=true` | Komatatdalīts uzticamo lietotāju e-pastu saraksts, kam atļauta piekļuve Docker žurnāliem |
| `HEYM_PLUGINS_ENABLED` | Nav obligāts | Iestatiet `true`, lai iespējotu spraudņu apakšsistēmu (pielāgoti mezgli instalēti kā zip). Pēc noklusējuma izslēgts |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Nepieciešams, kad `HEYM_PLUGINS_ENABLED=true` | Komatatdalīti operatoru e-pasti, kam atļauts instalēt/atinstalēt spraudņus |
| `HEYM_PLUGINS_DIR` | Nav obligāts | Kur tiek glabāti spraudņu faili. Iestatiet to uz absolūtu `/app/data/plugins`, kad montējat šo ceļu; relatīvais noklusējums `data/plugins` tiek atrisināts zem `/app/backend` šajā attēlā un netrāpa montāžā |
| `HEYM_PYTHON_TOOL_SANDBOX` | Nav obligāts | Python rīku izolācijas režīms; pēc noklusējuma `auto` (nostiprināta Docker smilškaste, neizdodas droši). Skatiet [Drošība](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Nav obligāts | Aizstāt Python rīku smilškastes attēlu; tukšs = automātiski noteikt backend attēlu |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Nav obligāts | Docker sējums, ko izmanto blakus Codex izpildītāja konteineri; pēc noklusējuma `heym-codex-workspaces` Docker izvietojumos |
| `HEYM_CODEX_NETWORK_ACCESS` | Nav obligāts | Atļaut Codex smilškastes komandām lejupielādēt failus/atkarības; Docker izvietojumi to iespējo pēc noklusējuma |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Nav obligāts | Docker sējums, ko izmanto blakus OpenCode izpildītāja konteineri; pēc noklusējuma `heym-opencode-workspaces` Docker izvietojumos |

**Piezīmes:**

- Attēls atver portu `4017`
- Backend paliek iekšējs un tiek starpniekots zem `/api`
- Kad `POSTGRES_HOST=localhost`, izlaiduma attēls automātiski pārraksta to uz `host.docker.internal`, kad nepieciešams, lai tas pats `.env` darbotos ar resursdatora līmeņa PostgreSQL konteineru macOS Docker/Desktop rīkos
- Paturiet `data/files` montāžu, ja vēlaties, lai Drive augšupielādes un prasmju ģenerētie faili pārdzīvotu konteinera restartus
- **Spraudņi:** lai tos iespējotu, iestatiet `HEYM_PLUGINS_ENABLED=true` un `HEYM_PLUGIN_ADMIN_EMAILS`, un montējiet `data/plugins`, lai instalētie spraudņu faili saglabātos starp konteinera atjaunošanām. Spraudņu metadati atrodas jūsu PostgreSQL, tāpēc tie arī saglabājas. Spraudņa deklarētās pip `dependencies` tiek instalētas konteinerā instalēšanas laikā; tā kā attēla failu sistēma ir īslaicīga, tās tiek **automātiski pārinstalētas startēšanas laikā** katram instalētajam spraudnim (izlaiduma attēla `uv` venv ir rakstāms, tāpēc tas darbojas arī vienkonteinera attēlā)

### Esošas datubāzes pārvietošana uz nosauktu sējumu

`./deploy.sh --migrate-pgdata` zina tikai par Compose steku. Ja palaižat izlaiduma attēlu pret savu PostgreSQL konteineru un šis konteiners bind-montē resursdatora direktoriju, migrējiet to paši.

Vispirms pārbaudiet, ko izmanto jūsu datubāzes konteiners:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Ja `"Type"` rāda `bind`, pārvietojiet to uz nosauktu sējumu:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    volume name if this Docker host runs more than one Heym deployment.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL again on the volume, reusing the flags you had before
#    but replacing the bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Once it accepts connections, rebuild indexes.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Izmantojiet savu attēlu 2. un 3. solī, nevis `postgres:16`.** Ja jūsu datubāze darbojas ar `pgvector/pgvector:pg16` vai citu variantu, kopētā klastera palaišana ar standarta attēlu var neizdoties, jo trūkst paplašinājumu bibliotēku, ko tas sagaida.

Jūsu sākotnējā datu direktorija šīs procedūras laikā netiek aizskarta, tāpēc tā paliek jūsu atritināšanas ceļš. Dzēsiet to tikai pēc tam, kad esat apstiprinājis, ka migrētā datubāze apkalpo jūsu Workflow. 4. solis ir svarīgs tā paša iemesla dēļ kā Compose migrācijā: kopija sev līdzi nes jebkādu esošo indeksu bojājumu.

---

## Vairāku instanču palaišana

Viss iepriekš aprakstītais izvieto vienu Heym instanci. Kad ar vienu mašīnu vairs nepietiek, norādiet otru instanci uz to pašu PostgreSQL datubāzi, un tā pievienojas kā worker: fona izpildes — cron, webhooks, MCP rīku izsaukumi, čata triggers — pēc tam tiek sadalītas starp instancēm pēc procentuālās daļas, ko iestatāt sadaļā **Settings → Instances**.

Instances savā starpā nekad nesazinās. Postgres pārņem darbu, tāpēc worker nav nepieciešams atvērts ports vai maršruts atpakaļ uz galveno instanci, un nekāds message broker netiek iesaistīts. Darbs, kas skar lokālo disku — Drive faili, coding-agent darbvietas, instalētie plugins — vienmēr tiek izpildīts uz galvenās instances, tāpēc nekas nav jādala failu sistēmā.

Divi noteikumi, ko cluster nevar nodrošināt jūsu vietā: katrai instancei ir jāizmanto viens un tas pats `SECRET_KEY` un `ENCRYPTION_KEY`, un ingress ir jānorāda tikai uz galveno instanci. Abi ir izskaidroti kopā ar izvietošanas noteikumiem un to, kā izvēlēties procentuālās daļas, sadaļā [Load Distribution](../reference/cluster.md).

> Šī ir slodzes sadale, nevis augsta pieejamība. Galvenā instance joprojām ir vienīgais kļūmes punkts ingress, failu glabāšanai un redaktoram.

## Biežāk izmantotās Workflow

**Pirmā iestatīšana:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Lai izmantotu iepriekš sagatavotu `docker run` image, vispirms manuāli ģenerējiet atslēgas (skatiet sadaļu **Prebuilt Image** iepriekš).

**Atjaunināt production pēc koda izmaiņām:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Pārbaudīt production logs:**

```bash
./deploy.sh --logs
```

**Apturēt production servisus:**

```bash
./deploy.sh --down
```

---

## Saistītie

- [Ievads](./introduction.md) – Platformas pārskats
- [Ātrā sākšana](./quick-start.md) – Izveidojiet savu pirmo Workflow
- [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilnīga konfigurācijas uzziņa
- [Drošība](../reference/security.md) – JWT, šifrēšanas un CORS iestatījumi
- [Slodzes sadale](../reference/cluster.md) – Palaidiet vairākas instances pret vienu datubāzi

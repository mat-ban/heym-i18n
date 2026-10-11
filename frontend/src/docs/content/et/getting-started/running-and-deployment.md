# Käivitamine ja juurutamine

Heym pakub kahte skripti erinevate keskkondade jaoks: `run.sh` kohalikuks arenduseks ja `deploy.sh` produktsioonijuurutusteks, kasutades Docker Compose'i.

> **Videoülevaade:** [Seadista Heym kohapeal alla 2 minuti jooksul](https://www.youtube.com/watch?v=P6YvlupUboU) — kloonige hoidla, käivitage PostgreSQL, täitke vajalikud keskkonnamuutujad ja looge kohalikus instantsis oma esimene konto.

## Eeltingimused

Mõlemad skriptid nõuavad järgmiste tööriistade paigaldamist:

| Tööriist | Otstarve |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Andmebaasi konteiner (arendus) ja täisvirn (produktsioon) |
| [uv](https://github.com/astral-sh/uv) | Pythoni paketihaldur backendile |
| [bun](https://bun.sh) | JavaScripti käituskeskkond frontendile |

## Keskkonna seadistamine

Nii `run.sh` kui ka `deploy.sh` loevad projekti juurkaustas asuvat `.env` faili. Kui seda ei ole olemas, loob skript selle automaatselt `.env.example` põhjal — nii kohaliku arenduse kui ka produktsiooni jaoks.

`SECRET_KEY` ja `ENCRYPTION_KEY` on `.env.example` failis tühjad. Kui kumbki on tühi, genereerivad `run.sh` ja `deploy.sh` automaatselt krüptograafiliselt tugeva väärtuse ja kirjutavad selle tagasi `.env` faili, nii et värske seadistus ei nõua käsitsi võtmete haldamist. Kui olemasolev `.env` sisaldab endiselt pärandväärtust `ENCRYPTION_KEY` kohatäitjat (`change_this_to_a_random_32_byte_hex_value`), peatuvad skriptid selge veateatega, selle asemel et see üle kirjutada — selle võtme pööramine muudaks varem krüptitud volitused loetamatuks. Ka backend ise keeldub käivitumast, kui kumbki võti on tühi või jäetud teadaolevale kohatäitjale.

Faili käsitsi loomiseks (valikuline — skriptid teevad seda teie eest):

```bash
cp .env.example .env
```

Olulisemad keskkonnamuutujad:

Iga toetatud muutuja, vaikeväärtuse ja produktsioonimärkuse kohta vaadake [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Muutuja | Kirjeldus |
|----------|-------------|
| `SECRET_KEY` | **Nõutav.** JWT allkirjastamise saladus. `run.sh`/`deploy.sh` genereerib automaatselt, kui tühi. |
| `ENCRYPTION_KEY` | **Nõutav.** Volituste krüptimise võti. `run.sh`/`deploy.sh` genereerib automaatselt, kui tühi. |
| `DATABASE_URL` | Valikuline andmebaasi ühendusstringi alistamine. Kui tühi, koostab Heym selle `POSTGRES_*` seadetest. |
| `BACKEND_PORT` | Backendi API port — vaikeväärtus `10105` |
| `FRONTEND_PORT` | Frontendi port — vaikeväärtus `4017` |
| `FRONTEND_URL` | **Nõutav produktsioonis.** Rakenduse avalik URL (skeem + host, nt `https://heym.example.com`). Kasutatakse OAuth ümbersuunamise URI-de jaoks (Google Sheets, BigQuery, Notion ja sarnased) ning taustaprotsesside loodavate ülevaatamis-, Codex järeltegevuse- ja faililinkide jaoks; peab ühtima URL-iga, mida kasutajad brauseris kasutavad. Klastris määrake igas instantsis sama väärtus. |
| `ALLOW_REGISTER` | Avatud kasutajate registreerimine (`false` produktsioonis, `true` arenduses). Lülitage see `false` peale alles pärast seda, kui teie administraatori konto on olemas — esimese kasutaja alglaadimist ei ole, seega tühi andmebaas ja keelatud registreerimine ei jäta võimalust ühe loomiseks. |
| `DOCKER_LOGS_ENABLED` | Lubab Dockeril põhineva Logs vahekaardi juurdepääsu, kui seatud `true`; nõuab ka Dockeri socketi juurdepääsu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Komadega eraldatud usaldusväärsete kasutajate e-posti aadresside loend, kellel on lubatud Dockeri logidele juurde pääseda, kui `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maksimaalne HTTP päringu keha suurus, mis võetakse vastu enne endpoint handlerite käivitumist; vaikeväärtus `100`, üks MB üle `FILE_MAX_SIZE_MB`, et jätta ruumi multipart üldkulule |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kuidas kasutaja määratud Pythoni tööriistad käivituvad: `auto` (vaikeväärtus — karastatud, isoleeritud Docker konteiner; nurjub suletult, kui Docker pole saadaval), `docker` (sama, ei lange kunagi tagasi) või `subprocess` (protsessisisene kohalik varulahendus; ei ole turvapiir, ainult usaldusväärne/arendus). `run.sh` määrab natiivse arenduse jaoks `subprocess`. Vaadake [Turvalisus](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Pilt, mida kasutatakse Pythoni tööriista Docker sandboxi jaoks. Tühi = tuvasta automaatselt jooksev backend pilt. |

Andmebaasi ühenduse vaikeväärtused (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) on dokumenteeritud [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) ja `.env.example` failis.

---

## Arendus: `run.sh`

`run.sh` käivitab kõik kolm teenust lokaalselt — andmebaasi (Dockeri konteinerina), FastAPI backend'i ja Vite'i arendusserveri — ühe käsuga.

```bash
./run.sh
```

**Mida see samm-sammult teeb:**

1. Kontrollib, et `docker`, `bun` ja `uv` on saadaval
2. Loob `.env` failist `.env.example`, kui see puudub, ning genereerib juhusliku `SECRET_KEY` ja `ENCRYPTION_KEY`, kui kumbki on tühi
3. Käivitab (või loob) andmebaasi Dockeri konteineri pordil `6543`, salvestades selle andmed `heym-postgres-data` Dockeri kettamahtu, mitte hosti kataloogi
4. Paigaldab Pythoni sõltuvused käsuga `uv sync`
5. Käivitab Alembic andmebaasi migratsioonid (`alembic upgrade head`)
6. Vabastab backend'i ja frontend'i pordid, kui need on hõivatud
7. Käivitab FastAPI backend'i valikuga `--reload` (kuumtaaslaadimine koodimuudatuste korral)
8. Paigaldab frontend'i sõltuvused käsuga `bun install`
9. Käivitab Vite'i arendusserveri

**Valikud:**

| Lipp | Kirjeldus |
|------|-------------|
| *(puudub)* | Käivitab silumislogimisega (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Käivitab vaikimisi logitasemega (silumisväljundita) |
| `--help` | Kuvab kasutusteabe |

**Teenuste aadressid (arendus):**

| Teenus | Aadress |
|---------|---------|
| Frontend | `localhost` pordil `FRONTEND_PORT` (vaikimisi: 4017) |
| Backend API | `localhost` pordil `BACKEND_PORT` (vaikimisi: 10105) |
| Interaktiivne API dokumentatsioon | `localhost:10105/docs` |
| Andmebaas | `localhost:6543` |

Vajutage `Ctrl+C`, et kõik teenused sujuvalt peatada.

---

## Läbivad testid: `run_e2e.sh`

Frontend'i Playwrighti komplekt töötab reaalse Vue rakenduse, FastAPI backend'i ja isoleeritud PostgreSQL andmebaasi vastu:

```bash
./run_e2e.sh
```

Komplekt on põhiteede suitsu- ja regressioonitestide komplekt, mitte ammendav tootekate. See katab autentimist, põhilist Workflow' elutsüklit ja täitmist, valitud dashboard'i ressursse, avalikke marsruute ja simuleeritud HITL ülevaatuse kasutajaliidest. Teenusepakkujate integratsioonid, iga node'i tüüp, jagamise/õiguste maatriksid ja täielik HITL jätkamise täitmine on endiselt kaetud peamiselt backend'i testidega või nõuavad spetsiaalseid integratsioonikeskkondi.

Iga käivitus saab oma ajutise PostgreSQL 16 konteineri, juhuslikud saadaolevad andmebaasi/backend'i/frontend'i pordid, autentimise oleku, testitulemused ja HTML-raporti. See võimaldab mitmel `run_e2e.sh` protsessil töötada üheaegselt ilma oleku jagamise või artefaktide ülekirjutamiseta. Skript eemaldab oma andmebaasi konteineri, kui käivitus lõpeb, ning kuvab artefaktide kataloogi ja raporti tee.

Kasulikud käsud:

```bash
./run_e2e.sh --ui         # Interaktiivne Playwrighti käivitaja isoleeritud andmebaasiga
cd frontend
bun run test:e2e:report   # Avab viimati lõpetatud kohaliku käivituse
```

Otsesed `bun run test:e2e` ja `bun run test:e2e:ui` käivitused nõuavad selgesõnalist `DATABASE_URL`-i, et need ei saaks vaikselt käivituda kohaliku arendusandmebaasi vastu. Tavaliste kohalike käivituste jaoks kasutage `./run_e2e.sh`.

`./check.sh` käivitab linti, tüübikontrolli, vormindamise ja backend'i testid ilma E2E komplektita, hoides vaikimisi kohaliku kontrolli tee kiirena. Käivitage Playwrighti E2E testid eraldi käsuga `./run_e2e.sh`. Pull requestid käivitavad GitHub Actions'is alati Chromiumi E2E komplekti ning säilitavad tõrgete korral jäljed, ekraanipildid, videod ja HTML-raporti.

---

## Tootmiskeskkond: `deploy.sh`

`deploy.sh` ehitab ja käivitab kogu stacki kasutades Docker Compose'i. Kõik kolm teenust — andmebaas, backend ja frontend — töötavad konteineritena. Backendi entrypoint käivitab automaatselt migratsioonid enne serveri käivitamist 8 töölisega.

**Esmakordne deploy (ehitamine + käivitamine):**

```bash
./deploy.sh
```

See teostab null-katkestusega deploy: image'id ehitatakse esmalt, samal ajal kui olemasolevad konteinerid jätkavad töötamist, seejärel vahetatakse uus versioon sisse.

**Saadaolevad käsud:**

| Käsk | Kirjeldus |
|---------|-------------|
| `./deploy.sh` | Ehita image'id ja käivita/uuenda kõik teenused |
| `./deploy.sh --status` | Näita konteinerite olekut |
| `./deploy.sh --logs` | Voogedasta logisid kõigist konteineritest |
| `./deploy.sh --restart` | Taaskäivita kõik konteinerid |
| `./deploy.sh --down` | Peata ja eemalda kõik konteinerid |
| `./deploy.sh --migrate-pgdata` | Ühekordne migratsioon: kopeeri olemasolev `data/postgres` kataloog `heym-postgres-data` Docker volume'isse ja ehita selle indeksid uuesti |
| `./deploy.sh --help` | Näita kasutusinfot |

**Andmebaasi salvestus: Dockeri nimega volume, mitte hosti kataloog.**

Compose salvestab PostgreSQL-i `heym-postgres-data` Docker volume'isse. Varajasemad versioonid kasutasid selle asemel hosti kataloogi `./data/postgres` bind-mount'i. Hosti bind-mount'id macOS-is (virtiofs) ja Windows/WSL2-s ei anna PostgreSQL-ile `fsync` ja faili sulgemise garantiisid, mida see nõuab: cluster'id seal tabavad WAL-segmentidel `PANIC: could not close file … Input/output error` ja korrumpeeruvad aja jooksul. Linuxi bind-mount'id ei olnud kunagi mõjutatud, kuid iga platvorm kasutab nüüd sama paigutust.

Deployment'i uuendamine, mille andmed on endiselt `./data/postgres`-is, on ühekordne samm. `./deploy.sh` tuvastab selle, peatub enne ehitamist ja palub teil esmalt migreerida:

```bash
./deploy.sh --migrate-pgdata   # peata teenused, kopeeri volume'isse, ehita indeksid uuesti
./deploy.sh                    # deploy nagu tavaliselt
```

**Migratsioon ehitab ka indeksid uuesti.** Kopeerimine on bait-baidi haaval, seega vana bind-mount'i tekitatud indeksikahjustused kanduvad kaasa. Seetõttu käivitab `--migrate-pgdata` ainult `postgres` teenuse uuel volume'il, käivitab selle vastu `reindexdb` ja peatab selle uuesti enne, kui ülejäänud stack käivitub. See on oluline, sest seda tüüpi korruptsioon jätab indeksikirjed osutama heap'i lõpust mööda — olek, mida `pg_amcheck` raporteerib puhtana, seega läbitud kontroll ei ole tõestuseks terve tabeli kohta. REINDEX parandab need kirjed; see ei suuda taastada heap-lehekülgi, mille vana failisüsteem juba kaotas. Suurel, teadaolevalt tervel andmebaasil saate uuesti ehitamise vahele jätta käsuga `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopeerimine on mittepurustav. `./data/postgres` jääb alles varukoopiana ja migratsioon keeldub üle kirjutamast volume'it, mis juba sisaldab andmebaasi. Kui mõni samm ebaõnnestub, eemaldatakse uus volume, seega poolikult migreeritud cluster'it ei saa kunagi kogemata deploy'da. Kustutage vana kataloog, kui olete kinnitanud, et teie workflow'd on terved. `postgres` konteineril on sama kaitse, seega käsitsi `docker compose up` ei saa samuti teie andmete peale vaikselt tühja andmebaasi initialiseerida. Värsked paigaldused ei vaja mingit tegevust.

**Teenuse aadressid (tootmiskeskkond):**

Frontendi konteiner on eksponeeritud `FRONTEND_PORT`-il (vaikimisi: 4017). Backendi API-d serveeritakse `/api` teel, proxyd läbi frontendi konteineri — seega on tootmiskeskkonnas ainult üks avalik port.

**Konteinerite ülevaade:**

| Konteiner | Kirjeldus |
|-----------|-------------|
| `heym-db` | Relatsiooniline andmebaas |
| `heym-backend` | FastAPI API server (8 töölist, ehitatud `backend/Dockerfile`-ist) |
| `heym-frontend` | Frontendi eelvaate konteiner, mis serveerib ehitatud Vue rakendust (ehitatud `frontend/Dockerfile`-ist) |

**Versiooni uuendamise märgis:**

Rakenduse päis näitab töötava Docker build'i versiooni. Kui see versioon on Heym GitHubi viimasest väljalaskest maas, kuvatakse versiooni kõrval lilla **Update** märgis. Klõpsake versioonil või märgisel, et avada Heym GitHubi väljalasete leht.

---

## Eelnevalt ehitatud image: `docker run`

Kui eelistate rakendust lokaalselt mitte ehitada, saate tõmmata avaldatud konteineri image'i ja käivitada selle otse.

Image käivitab frontendi ja backendi koos ühes konteineris. PostgreSQL on endiselt väline, kuid saate esitada kas `DATABASE_URL` või `POSTGRES_*` muutujad failist `.env.example`.

> **Hoidke oma andmebaasi Dockeri nimega volume'is.** Väljalaske image'iga ei tule andmebaasi kaasa, seega PostgreSQL `DATABASE_URL` taga on teie hallata. Mount'ige see kui `-v heym-postgres-data:/var/lib/postgresql/data`, mitte hosti tee: macOS-is (virtiofs) ja Windows/WSL2-s ei järgi bind-mount'itud PostgreSQL andmekataloog `fsync` garantiisid, mida andmebaas nõuab, ja rikub aja jooksul cluster'i.

> **Vector store backend.** `run.sh` ja `deploy.sh` käivitavad ametliku `postgres:16` image'i ja installivad automaatselt `postgresql-16-pgvector` paketi käivitumisel, seega **Postgres (pgvector) RAG backend** töötab seal kohe ilma teie andmete muutmiseta. Eelnevalt ehitatud ühe konteineri image ühendub aga PostgreSQL-iga, mille **teie** pakute — see andmebaas peab toetama `vector` laiendust, et Postgres backend'i kasutada. Heym ei saa installida pgvector'it andmebaasi, mida ta ei halda. Ilma selleta jätab käivitamise migratsioon pgvector tabeli sujuvalt vahele — deploy õnnestub endiselt, Qdrant RAG jätkab töötamist ja Postgres vector store'i loomine või üleslaadimine tagastab selge "backend pole saadaval" teate, kuni pgvector on lubatud.

**Määrake võtmed ise otse image'i käivitamiseks.** Erinevalt `run.sh`/`deploy.sh`-st ei genereeri eelnevalt ehitatud image võtmeid automaatselt. Pärast `cp .env.example .env` täitke kaks tühja võtit (kohapeal asendamine väldib duplikaatkirjeid):

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

> **Muutke faili- ja plugin-mount'id absoluutseks.** `FILE_STORAGE_DIR` ja `HEYM_PLUGINS_DIR` on vaikimisi suhtelised teed `./data/files` ja `data/plugins` ning väljalaske image käivitab backendi kaustast `/app/backend`. Suhtelistena lahenevad need kaustadeks `/app/backend/data/files` ja `/app/backend/data/plugins`, seega kaks ülaltoodud bind mount'i ei saa midagi ja üleslaaditud failid lähevad kaotsi, kui konteiner asendatakse. `-e` lipud alistavad suhtelised väärtused, mille `.env.example` pakub `--env-file` kaudu, sest käsurea `-e` võidab `--env-file`-i. Compose (`./deploy.sh`) ei vaja seda: see image käivitab backendi kaustast `/app`, kus suhtelised vaikeväärtused maanduvad juba mount'idele.

> **Docker socket'i juurdepääs.** `/var/run/docker.sock` mount'imine annab backendile laialdase kontrolli hosti Docker daemoni üle. Vaikimisi Docker Compose teenus ja otsene `docker run` näide sisaldavad seda Docker-põhiste MCP stdio tööriistade jaoks, mis käivitavad `docker` käske. Logs vahekaart nõuab endiselt `DOCKER_LOGS_ENABLED=true` ja `DOCKER_LOGS_ALLOWED_EMAILS` koos komadega eraldatud usaldusväärsete kasutajate e-posti aadresside loendiga. Looge usaldusväärne admin-konto enne Docker logide lubamist või hoidke `ALLOW_REGISTER=false`, et kinnitamata iseregistreerimine ei saaks nõuda lubatud nimekirjas olevat e-posti aadressi. Kasutaja määratud Python tööriistad **ei** saa seda socket'it: need töötavad eraldi karastatud konteineris ilma Docker socket'ita. Vt [Turvalisus](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex node kasutab sama `ghcr.io/heymrun/heym` image'it õe-runner konteinerina (`--entrypoint codex`), et Codexi Linuxi sandbox saaks nimeruume luua. Hoidke `heym-codex-workspaces` volume mount'i, kui soovite Codexi workflow'sid otsese image'i seadistuses; runner ei saa Docker socket'it ega backendi saladusi.

> **OpenCode Go runner.** OpenCode Go node kasutab sama image'it karastatud õe-runnerina (`--entrypoint opencode`), jagades `heym-opencode-workspaces`. Hoidke seda volume mount'i, kui soovite OpenCode workflow'sid otsese image'i seadistuses; runner ei saa Docker socket'it ega GitHub token'it.

> **Skill sandbox.** Python skillid Agent node'is töötavad karastatud õe-konteineris, mis jagab `heym-codex-workspaces` volume'it, seega hoidke seda volume mount'i ka skillide jaoks — mitte ainult Codexi jaoks. Iga käivitus saab isoleeritud käivituseelse alampath'i ning õe-konteiner ei saa ei Docker socket'it ega backendi saladusi. See nõuab **Docker Engine 25.0+**; vanematel engine'itel või ilma volume'ita ebaõnnestub `HEYM_PYTHON_TOOL_SANDBOX=auto` suletult — määrake `HEYM_PYTHON_TOOL_SANDBOX=subprocess` ainult usaldusväärsete ühe kasutaja seadistuste jaoks. Vt [Turvalisus](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` on Playwrighti jaoks vajalik.** Docker annab konteinerile 64 MB `/dev/shm`-i ja Chromium kukub oma renderdajaga selle piiri juures kokku. Sammupõhised Playwright node'id käivitavad Chromiumi alamprotsessina selle konteineri sees, seega piirang kehtib sellele konteinerile; kohandatud `playwrightCode` töötab õe-konteineris, mis määrab oma piirangu. `docker-compose.yml` deklareerib juba `shm_size: "2gb"`, seega `run.sh` ja `deploy.sh` ei ole mõjutatud — lippu vajab ainult tavaline `docker run`.

> **Playwright Run Code.** Kohandatud Playwright Python vajab `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` ja ülaltoodud Docker socket mount'i. Väljalaske image määrab `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` GHCR paigutuse jaoks (`/app/backend/.venv`). Compose `./deploy.sh` määrab sandbox image'i vaikimisi `heym-backend:local`. Hoidke `--no-sandbox` Chromiumi käivitusargumentides sandbox konteinerite sees.

**Minimaalsed keskkonnamuutujad otsese image'i käivitamiseks:**

| Muutuja | Nõutud | Eesmärk |
|----------|----------|---------|
| `DATABASE_URL` | Valikuline | Täielik PostgreSQL ühendusstringi alistamine |
| `POSTGRES_HOST` | Jah, kui `DATABASE_URL` on tühi | PostgreSQL host |
| `POSTGRES_PORT` | Jah, kui `DATABASE_URL` on tühi | PostgreSQL port |
| `POSTGRES_USER` | Jah, kui `DATABASE_URL` on tühi | PostgreSQL kasutajanimi |
| `POSTGRES_PASSWORD` | Jah, kui `DATABASE_URL` on tühi | PostgreSQL parool |
| `POSTGRES_DB` | Jah, kui `DATABASE_URL` on tühi | PostgreSQL andmebaasi nimi |
| `SECRET_KEY` | Jah | JWT allkirjastamise saladus |
| `ENCRYPTION_KEY` | Jah | Volituste krüpteerimise võti |
| `FRONTEND_URL` | Soovitatav | Avalik brauseri URL, eriti OAuth callback'ide jaoks |
| `CORS_ORIGINS` | Soovitatav | Lubatud brauseri origin'id |
| `FILE_STORAGE_DIR` | Soovitatav | Määrake absoluutseks `/app/data/files`, kui mount'ite selle tee; suhteline `./data/files` vaikeväärtus laheneb selles image'is `/app/backend` all ja jätab mount'i vahele |
| `ALLOW_REGISTER` | Soovitatav | Määrake `false` produktsioonis, kui avatud registreerumine ei ole soovitud, kuid alles pärast seda, kui teie admin-konto on olemas — esimese kasutaja bootstrap'i ei ole |
| `DOCKER_LOGS_ENABLED` | Valikuline | Määrake `true`, et lubada Logs vahekaardil Docker socket'i juurdepääsu kasutada |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Nõutud, kui `DOCKER_LOGS_ENABLED=true` | Komadega eraldatud usaldusväärsete kasutajate e-posti aadresside loend, kellel on lubatud Docker logidele juurde pääseda |
| `HEYM_PLUGINS_ENABLED` | Valikuline | Määrake `true`, et lubada plugin-alamsüsteem (kohandatud node'id installituna zip-ina). Vaikimisi väljas |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Nõutud, kui `HEYM_PLUGINS_ENABLED=true` | Komadega eraldatud operaatorite e-posti aadressid, kellel on lubatud pluginaid installida/eemaldada |
| `HEYM_PLUGINS_DIR` | Valikuline | Kuhu plugin-failid salvestatakse. Määrake absoluutseks `/app/data/plugins`, kui mount'ite selle tee; suhteline `data/plugins` vaikeväärtus laheneb selles image'is `/app/backend` all ja jätab mount'i vahele |
| `HEYM_PYTHON_TOOL_SANDBOX` | Valikuline | Python tööriista isolatsioonirežiim; vaikimisi `auto` (karastatud Docker sandbox, ebaõnnestub suletult). Vt [Turvalisus](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Valikuline | Alistage Python tööriista sandbox image; tühi = tuvasta automaatselt backendi image |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Valikuline | Docker volume, mida kasutavad õe-Codex runner konteinerid; Docker deploy'des vaikimisi `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | Valikuline | Lubage Codexi sandbox'itud käskudel faile/sõltuvusi alla laadida; Docker deploy'd lubavad selle vaikimisi |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Valikuline | Docker volume, mida kasutavad õe-OpenCode runner konteinerid; Docker deploy'des vaikimisi `heym-opencode-workspaces` |

**Märkused:**

- Image avab pordi `4017`
- Backend jääb sisemiseks ja on proxied `/api` all
- Kui `POSTGRES_HOST=localhost`, kirjutab väljalaske image selle automaatselt ümber `host.docker.internal`-iks, kui vaja, et sama `.env` töötaks hosti tasemel PostgreSQL konteineriga macOS Docker/Desktop tööriistadel
- Hoidke `data/files` mount'i, kui soovite, et Drive üleslaadimised ja skillide genereeritud failid jääksid konteineri taaskäivitustest alles
- **Pluginad:** nende lubamiseks määrake `HEYM_PLUGINS_ENABLED=true` ja `HEYM_PLUGIN_ADMIN_EMAILS` ning mount'ige `data/plugins`, et installitud plugin-failid püsiksid konteineri taasloomiste vahel. Plugina metaandmed asuvad teie PostgreSQL-is, seega need püsivad samuti. Plugina deklareeritud pip `dependencies` installitakse konteinerisse installimise ajal; kuna image'i failisüsteem on efemeerne, **installitakse need käivitumisel automaatselt uuesti** iga installitud plugina jaoks (väljalaske image'i `uv` venv on kirjutatav, seega see töötab ka ühe konteineri image'is)

### Olemasoleva andmebaasi teisaldamine nimega volume'isse

`./deploy.sh --migrate-pgdata` teab ainult Compose stack'ist. Kui käivitate väljalaske image'it oma PostgreSQL konteineri vastu ja see konteiner bind-mount'ib hosti kataloogi, migreerige see ise.

Kontrollige esmalt, mida teie andmebaasi konteiner kasutab:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Kui `"Type"` näitab `bind`, teisaldage see nimega volume'isse:

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

**Kasutage sammudes 2 ja 3 oma image'it, mitte `postgres:16`.** Kui teie andmebaas kasutab `pgvector/pgvector:pg16` või muud varianti, võib kopeeritud cluster'i käivitamine stock image'iga ebaõnnestuda, sest laienduse teegid, mida see ootab, on puudu.

Teie algne andmekataloog jääb selle protseduuri käigus puutumata, seega see on teie tagasipööramise tee. Kustutage see alles pärast seda, kui olete kinnitanud, et migreeritud andmebaas teenindab teie workflow'sid. Samm 4 on oluline samal põhjusel nagu Compose migratsioonis: koopia kannab endaga kaasa kõik olemasolevad indeksi kahjustused.

---

## Mitme instantsi käitamine

Kõik ülaltoodu juurutab ühe Heymi instantsi. Kui ühest masinast enam ei piisa, suunake teine instants samale PostgreSQL andmebaasile ja see liitub worker'ina: taustaprotsessid — cron, webhookid, MCP tööriistakutsed, vestluse triggerid — jagatakse seejärel instantside vahel protsendi järgi, mille määrate jaotises **Settings → Instances**.

Instantsid ei suhtle omavahel kunagi. Tööd kannab Postgres, seega worker ei vaja avatud porti ega marsruuti tagasi põhiinstantsi juurde ning sõnumivahendajat ei ole kaasatud. Töö, mis puudutab kohalikku ketast — Drive failid, kodeerimisagendi tööruumid, paigaldatud pluginad — käivitub alati põhiinstantsil, seega ei pea midagi failisüsteemi kaudu jagama.

Kaks reeglit, mida cluster teie eest jõustada ei saa: iga instants peab kasutama sama `SECRET_KEY` ja `ENCRYPTION_KEY` ning ingress peab osutama ainult põhiinstantsile. Mõlemat on selgitatud koos paigutusreeglite ja protsentide valimisega jaotises [Load Distribution](../reference/cluster.md).

> See on koormuse jaotamine, mitte kõrge käideldavus. Põhiinstants jääb ingressi, failisalvestuse ja redaktori jaoks üksikuks tõrkepunktiks.

## Tavalised Workflow'd

**Esmakordne seadistamine:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Eelnevalt ehitatud `docker run` image'i puhul genereerige võtmed esmalt käsitsi (vt ülal jaotist **Prebuilt Image**).

**Productioni uuendamine pärast koodimuudatust:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Productioni logide vaatamine:**

```bash
./deploy.sh --logs
```

**Productioni teenuste peatamine:**

```bash
./deploy.sh --down
```

---

## Seotud

- [Sissejuhatus](./introduction.md) – Platvormi ülevaade
- [Kiire alustamine](./quick-start.md) – Looge oma esimene workflow
- [Keskkonnamuutujad](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Täielik konfiguratsiooni viide
- [Turvalisus](../reference/security.md) – JWT, krüpteerimise ja CORS-i seaded
- [Koormuse jaotamine](../reference/cluster.md) – Käivitage mitu instantsi ühe andmebaasi vastu

# Paleidimas ir diegimas

Heym pateikia du scenarijų failus skirtingoms aplinkoms: `run.sh` – vietiniam kūrimui, o `deploy.sh` – produkciniam diegimui naudojant Docker Compose.

> **Vaizdo įrašo apžvalga:** [Nustatykite Heym lokaliai per mažiau nei 2 minutes](https://www.youtube.com/watch?v=P6YvlupUboU) – nuklonuokite saugyklą, paleiskite PostgreSQL, užpildykite reikiamus aplinkos kintamuosius ir susikurkite pirmąją paskyrą vietinėje instancijoje.

## Būtinosios sąlygos

Abiem scenarijų failams reikia, kad būtų įdiegti šie įrankiai:

| Įrankis | Paskirtis |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Duomenų bazės konteineris (kūrimo aplinkai) ir visas sprendimų rinkinys (produkcinei aplinkai) |
| [uv](https://github.com/astral-sh/uv) | Python paketų tvarkyklė, skirta backend daliai |
| [bun](https://bun.sh) | JavaScript vykdymo aplinka, skirta frontend daliai |

## Aplinkos nustatymas

Tiek `run.sh`, tiek `deploy.sh` nuskaito duomenis iš `.env` failo projekto šakniniame kataloge. Jei jo nėra, scenarijaus failas automatiškai sukuria jį pagal `.env.example` – tiek vietiniam kūrimui, tiek produkcijai.

`SECRET_KEY` ir `ENCRYPTION_KEY` faile `.env.example` pateikiami tušti. Kai kuris nors iš jų yra tuščias, `run.sh` ir `deploy.sh` automatiškai sugeneruoja kriptografiškai stiprią reikšmę ir įrašo ją atgal į `.env`, todėl naujam nustatymui nereikia rankinio raktų tvarkymo. Jei esamame `.env` faile vis dar yra senasis `ENCRYPTION_KEY` rezervuotos vietos žymuo (`change_this_to_a_random_32_byte_hex_value`), scenarijų failai sustoja su aiškia klaida, o ne perrašo jį – pakeitus tą raktą anksčiau užšifruoti prisijungimo duomenys taptų neperskaitomi. Pats backend taip pat atsisako paleistis, jei kuris nors raktas yra tuščias arba paliktas žinomame rezervuotos vietos žymenyje.

Norėdami sukurti failą rankiniu būdu (neprivaloma – scenarijų failai tai padaro už Jus):

```bash
cp .env.example .env
```

Pagrindiniai aplinkos kintamieji:

Norėdami sužinoti apie kiekvieną palaikomą kintamąjį, numatytąją reikšmę ir produkcijos pastabą, žr. [Aplinkos kintamieji](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Kintamasis | Aprašymas |
|----------|-------------|
| `SECRET_KEY` | **Privalomas.** JWT pasirašymo secret. Automatiškai sugeneruojamas `run.sh`/`deploy.sh`, kai tuščias. |
| `ENCRYPTION_KEY` | **Privalomas.** Prisijungimo duomenų šifravimo raktas. Automatiškai sugeneruojamas `run.sh`/`deploy.sh`, kai tuščias. |
| `DATABASE_URL` | Neprivalomas duomenų bazės prisijungimo eilutės perrašymas. Jei tuščias, Heym sukuria jį pagal `POSTGRES_*` nustatymus. |
| `BACKEND_PORT` | Backend API prievadas – numatytoji reikšmė `10105` |
| `FRONTEND_PORT` | Frontend prievadas – numatytoji reikšmė `4017` |
| `FRONTEND_URL` | **Privalomas produkcijoje.** Viešas programos URL (schema + host, pvz., `https://heym.example.com`). Naudojamas OAuth peradresavimo URI (Google Sheets, BigQuery, Notion ir panašiems), taip pat peržiūros, Codex tolesnių veiksmų ir failų nuorodoms, kurias sukuria fono vykdymai; turi atitikti URL, kurį naudotojai naudoja naršyklėje. Cluster aplinkoje nustatykite tą pačią reikšmę kiekvienoje instancijoje. |
| `ALLOW_REGISTER` | Atvira naudotojų registracija (`false` produkcijoje, `true` kūrimo aplinkoje). Perjunkite į `false` tik tada, kai Jūsų administratoriaus paskyra jau sukurta – nėra pirmojo naudotojo sukūrimo mechanizmo, todėl tuščia duomenų bazė su išjungta registracija nepalieka jokio būdo ją sukurti. |
| `DOCKER_LOGS_ENABLED` | Įjungia prieigą prie Docker pagrįsto Logs skirtuko, kai nustatyta `true`; taip pat reikia prieigos prie Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Kableliais atskirtas patikimų naudotojų el. pašto adresų sąrašas, kuriems leidžiama pasiekti Docker žurnalus, kai `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Didžiausias HTTP užklausos turinio dydis, priimamas prieš paleidžiant endpoint apdorojimo funkcijas; numatytoji reikšmė `100`, vienu MB didesnė už `FILE_MAX_SIZE_MB`, kad liktų vietos multipart papildomiems duomenims |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kaip vykdomi naudotojo apibrėžti Python įrankiai: `auto` (numatytoji reikšmė – sutvirtintas, izoliuotas Docker konteineris; saugiai nutraukiama, jei Docker nepasiekiamas), `docker` (tas pats, niekada nesugrįžtama prie atsarginio varianto) arba `subprocess` (vietinis atsarginis variantas tame pačiame procese; nėra saugumo riba, skirta tik patikimai/kūrimo aplinkai). `run.sh` nustato `subprocess` vietiniam kūrimui. Žr. [Saugumas](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image, naudojamas Python įrankių Docker smėliadėžei. Tuščias = automatiškai aptikti veikiantį backend image. |

Duomenų bazės prisijungimo numatytosios reikšmės (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) yra dokumentuotos [Aplinkos kintamieji](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) ir `.env.example`.

---

## Kūrimas: `run.sh`

`run.sh` paleidžia visas tris paslaugas lokaliai — duomenų bazę (kaip Docker konteinerį), FastAPI backend'ą ir Vite dev serverį — viena komanda.

```bash
./run.sh
```

**Ką jis daro, žingsnis po žingsnio:**

1. Patikrina, ar `docker`, `bun` ir `uv` yra prieinami
2. Sukuria `.env` iš `.env.example`, jei jo nėra, ir sugeneruoja atsitiktinį `SECRET_KEY` bei `ENCRYPTION_KEY`, kai kuris nors iš jų tuščias
3. Paleidžia (arba sukuria) duomenų bazės Docker konteinerį prievade `6543`, saugodamas jo duomenis `heym-postgres-data` Docker volume, o ne host kataloge
4. Įdiegia Python priklausomybes per `uv sync`
5. Vykdo Alembic duomenų bazės migracijas (`alembic upgrade head`)
6. Atlaisvina backend ir frontend prievadus, jei jie užimti
7. Paleidžia FastAPI backend'ą su `--reload` (hot-reload keičiant kodą)
8. Įdiegia frontend priklausomybes per `bun install`
9. Paleidžia Vite dev serverį

**Parinktys:**

| Vėliavėlė | Aprašymas |
|------|-------------|
| *(nėra)* | Paleisti su įjungtu debug logavimu (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Paleisti su numatytuoju log lygiu (be debug išvesties) |
| `--help` | Rodyti naudojimo informaciją |

**Paslaugų adresai (dev):**

| Paslauga | Adresas |
|---------|---------|
| Frontend | `localhost` prievade `FRONTEND_PORT` (numatytasis: 4017) |
| Backend API | `localhost` prievade `BACKEND_PORT` (numatytasis: 10105) |
| Interaktyvi API dokumentacija | `localhost:10105/docs` |
| Duomenų bazė | `localhost:6543` |

Paspauskite `Ctrl+C`, kad tvarkingai sustabdytumėte visas paslaugas.

---

## End-to-End testai: `run_e2e.sh`

Frontend Playwright rinkinys paleidžiamas prieš tikrąją Vue aplikaciją, FastAPI backend'ą ir
izoliuotą PostgreSQL duomenų bazę:

```bash
./run_e2e.sh
```

Šis rinkinys yra pagrindinių kelių smoke ir regresijos rinkinys, o ne išsamus produkto padengimas. Jis apima
autentifikaciją, pagrindinį Workflow gyvavimo ciklą ir vykdymą, pasirinktus dashboard išteklius, viešus
maršrutus ir imituotą HITL peržiūros UI. Tiekėjų integracijos, kiekvienas node tipas, bendrinimo/teisių
matricos ir pilnas HITL atnaujinimo vykdymas išlieka padengti pirmiausia backend testais arba reikalauja
specializuotų integracijos aplinkų.

Kiekvienas paleidimas gauna savo atskirą laikiną PostgreSQL 16 konteinerį, atsitiktinius galimus duomenų bazės/backend/frontend
prievadus, autentifikacijos būseną, testų rezultatus ir HTML ataskaitą. Tai leidžia keliems `run_e2e.sh`
procesams veikti vienu metu nesidalijant būsena ar neperrašant artefaktų. Scenarijus pašalina
savo duomenų bazės konteinerį, kai paleidimas baigiasi, ir išspausdina artefaktų katalogą bei ataskaitos kelią.

Naudingos komandos:

```bash
./run_e2e.sh --ui         # Interaktyvus Playwright vykdytojas su izoliuota duomenų baze
cd frontend
bun run test:e2e:report   # Atidaryti paskutinį užbaigtą vietinį paleidimą
```

Tiesioginiai `bun run test:e2e` ir `bun run test:e2e:ui` paleidimai reikalauja aiškaus `DATABASE_URL`, kad
jie negalėtų tyliai paleistis prieš vietinę kūrimo duomenų bazę. Naudokite `./run_e2e.sh` įprastiems vietiniams
paleidimams.

`./check.sh` vykdo lint, typecheck, formatavimą ir backend testus be E2E rinkinio, išlaikydamas
numatytąjį vietinio tikrinimo kelią greitą. Playwright E2E testus paleiskite atskirai su `./run_e2e.sh`. Pull
request'ai visada paleidžia Chromium E2E rinkinį GitHub Actions ir išsaugo traces, screenshots,
videos bei HTML ataskaitą, kai įvyksta klaidos.

---

## Produkcinė aplinka: `deploy.sh`

`deploy.sh` sukuria ir paleidžia visą sistemą naudodamas Docker Compose. Visos trys paslaugos — duomenų bazė, backend ir frontend — veikia kaip konteineriai. Backend paleidimo scenarijus automatiškai paleidžia migracijas prieš paleisdamas serverį su 8 darbininkais.

**Pradinis diegimas (sukūrimas + paleidimas):**

```bash
./deploy.sh
```

Tai atlieka diegimą be prastovų: atvaizdai sukuriami pirmiausia, kol esami konteineriai tebeveikia, tada nauja versija pakeičiama.

**Galimos komandos:**

| Komanda | Aprašymas |
|---------|-------------|
| `./deploy.sh` | Sukurti atvaizdus ir paleisti/atnaujinti visas paslaugas |
| `./deploy.sh --status` | Rodyti konteinerių būseną |
| `./deploy.sh --logs` | Transliuoti žurnalus iš visų konteinerių |
| `./deploy.sh --restart` | Paleisti iš naujo visus konteinerius |
| `./deploy.sh --down` | Sustabdyti ir pašalinti visus konteinerius |
| `./deploy.sh --migrate-pgdata` | Vienkartinė migracija: nukopijuoti esamą `data/postgres` katalogą į `heym-postgres-data` Docker volume ir atkurti jo indeksus |
| `./deploy.sh --help` | Rodyti naudojimo informaciją |

**Duomenų bazės saugykla: Docker vardinis volume, o ne pagrindinio kompiuterio katalogas.**

Compose saugo PostgreSQL `heym-postgres-data` Docker volume. Ankstesnės versijos vietoj to bind-mount'indavo pagrindinio kompiuterio katalogą `./data/postgres`. Pagrindinio kompiuterio bind mount'ai macOS (virtiofs) ir Windows/WSL2 sistemose nesuteikia PostgreSQL reikalingų `fsync` ir failo uždarymo garantijų: ten esantys cluster'iai susiduria su `PANIC: could not close file … Input/output error` WAL segmentuose ir laikui bėgant sugenda. Linux bind mount'ai niekada nebuvo paveikti, bet dabar visos platformos naudoja tą patį išdėstymą.

Diegimo, kuriame vis dar yra duomenų `./data/postgres`, atnaujinimas yra vienkartinis žingsnis. `./deploy.sh` tai aptinka, sustoja prieš kurdamas ir paprašo pirmiausia atlikti migraciją:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Migracija taip pat atkuria indeksus.** Kopija yra baitas į baitą, todėl indeksų pažeidimai, kuriuos sukėlė senasis bind mount, keliauja kartu su ja. Todėl `--migrate-pgdata` paleidžia `postgres` paslaugą vieną naujame volume, paleidžia `reindexdb` jame ir vėl ją sustabdo, prieš paleidžiant likusią sistemos dalį. Tai svarbu, nes šios klasės sugadinimas palieka indeksų įrašus, rodančius už heap pabaigos — būseną, kurią `pg_amcheck` praneša kaip švarią, todėl sėkmingas patikrinimas nėra sveikos lentelės įrodymas. REINDEX suremontuoja tuos įrašus; jis negali atkurti heap puslapių, kuriuos senoji failų sistema jau prarado. Didelėje, žinomai sveikoje duomenų bazėje galite apeiti atkūrimą su `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopija yra neardanti. `./data/postgres` lieka vietoje kaip atsarginė kopija, o migracija atsisako perrašyti volume, kuriame jau yra duomenų bazė. Jei bet kuris žingsnis nepavyksta, naujasis volume pašalinamas, todėl pusiau migruotas cluster'is niekada negali būti netyčia įdiegtas. Ištrinkite seną katalogą, kai būsite patvirtinę, kad Jūsų workflow'ai nepažeisti. `postgres` konteineris turi tą pačią apsaugą, todėl rankinis `docker compose up` taip pat negali tyliai inicializuoti tuščios duomenų bazės virš Jūsų duomenų. Naujiems diegimams jokių veiksmų nereikia.

**Paslaugų adresai (produkcinė aplinka):**

Frontend konteineris yra pasiekiamas per `FRONTEND_PORT` (numatytoji reikšmė: 4017). Backend API yra teikiamas per `/api` kelią, proxied per frontend konteinerį — todėl produkcinėje aplinkoje yra tik vienas viešas portas.

**Konteineriai:**

| Konteineris | Aprašymas |
|-----------|-------------|
| `heym-db` | Reliacinė duomenų bazė |
| `heym-backend` | FastAPI API serveris (8 darbininkai, sukurtas iš `backend/Dockerfile`) |
| `heym-frontend` | Frontend peržiūros konteineris, teikiantis sukurtą Vue programą (sukurtas iš `frontend/Dockerfile`) |

**Versijos atnaujinimo ženklelis:**

Programos antraštėje rodoma veikianti Docker build versija. Kai ta versija atsilieka nuo naujausio Heym GitHub leidimo, šalia versijos atsiranda purpurinis **Update** ženklelis. Spustelėkite versiją arba ženklelį, kad atidarytumėte Heym GitHub leidimų puslapį.

---

## Paruoštas atvaizdas: `docker run`

Jei nenorite kurti programos lokaliai, galite atsisiųsti paskelbtą konteinerio atvaizdą ir paleisti jį tiesiogiai.

Atvaizdas paleidžia frontend ir backend kartu viename konteineryje. PostgreSQL vis dar yra išorinis, tačiau galite pateikti `DATABASE_URL` arba `POSTGRES_*` kintamuosius iš `.env.example`.

> **Saugokite duomenų bazę Docker vardiniame tome.** Leidimo atvaizde nėra duomenų bazės, todėl PostgreSQL, esantis už `DATABASE_URL`, yra Jūsų atsakomybė. Prijunkite jį kaip `-v heym-postgres-data:/var/lib/postgresql/data`, o ne kaip host kelio: macOS (virtiofs) ir Windows/WSL2 aplinkose bind-mounted PostgreSQL duomenų katalogas nesilaiko `fsync` garantijų, kurių reikalauja duomenų bazė, ir laikui bėgant sugadina Cluster.

> **Vector store backend.** `run.sh` ir `deploy.sh` paleidžia oficialų `postgres:16` atvaizdą ir automatiškai įdiegia `postgresql-16-pgvector` paketą paleidimo metu, todėl **Postgres (pgvector) RAG backend** ten veikia iš karto be jokių Jūsų duomenų pakeitimų. Tačiau paruoštas vieno konteinerio atvaizdas jungiasi prie PostgreSQL, kurį pateikiate **Jūs** — ta duomenų bazė turi palaikyti `vector` plėtinį, kad būtų galima naudoti Postgres backend. Heym negali įdiegti pgvector į duomenų bazę, kurios jis nevaldo. Be jo paleidimo migracija tvarkingai praleidžia pgvector lentelę — diegimas vis tiek pavyksta, Qdrant RAG toliau veikia, o kuriant ar įkeliant į Postgres vector store grąžinamas aiškus pranešimas „backend unavailable“, kol pgvector neįjungtas.

**Nustatykite raktus patys, kai paleidžiate atvaizdą tiesiogiai.** Skirtingai nuo `run.sh`/`deploy.sh`, paruoštas atvaizdas automatiškai negeneruoja raktų. Atlikę `cp .env.example .env`, užpildykite du tuščius raktus (pakeitimas vietoje išvengia pasikartojančių įrašų):

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

> **Padarykite failų ir pluginų prijungimo taškus absoliučiais.** `FILE_STORAGE_DIR` ir `HEYM_PLUGINS_DIR` pagal numatytuosius nustatymus naudoja santykinius kelius `./data/files` ir `data/plugins`, o leidimo atvaizdas paleidžia backend iš `/app/backend`. Palikus juos santykinius, jie išsprendžiami į `/app/backend/data/files` ir `/app/backend/data/plugins`, todėl du bind mount taškai aukščiau nieko negauna ir įkėlimai prarandami, kai konteineris pakeičiamas. `-e` vėliavėlės nepaiso santykinių reikšmių, kurias `.env.example` pateikia per `--env-file`, nes komandinės eilutės `-e` turi viršenybę prieš `--env-file`. Compose (`./deploy.sh`) to nereikia: tas atvaizdas paleidžia backend iš `/app`, kur santykiniai numatytieji nustatymai jau atsiduria ant prijungimo taškų.

> **Docker socket prieiga.** Prijungus `/var/run/docker.sock`, backend gauna plačią kontrolę per host Docker daemon. Numatytasis Docker Compose servisas ir tiesioginis `docker run` pavyzdys jį įtraukia Docker pagrindu veikiantiems MCP stdio įrankiams, kurie vykdo `docker` komandas. Logs skirtukas vis tiek reikalauja `DOCKER_LOGS_ENABLED=true` ir `DOCKER_LOGS_ALLOWED_EMAILS` su kableliais atskirtu patikimų naudotojų el. pašto adresų sąrašu. Sukurkite patikimą administratoriaus paskyrą prieš įjungdami Docker logs arba palikite `ALLOW_REGISTER=false`, kad nepatvirtinta saviregistracija negalėtų pasisavinti leidžiamų sąraše esančio el. pašto adreso. Naudotojo apibrėžti Python įrankiai **negauna** šio socket: jie veikia atskirame sustiprintame konteineryje be Docker socket. Žr. [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex mazgas naudoja tą patį `ghcr.io/heymrun/heym` atvaizdą kaip gretutinį runner konteinerį (`--entrypoint codex`), kad Codex Linux smėliadėžė galėtų kurti namespaces. Išlaikykite `heym-codex-workspaces` tomo prijungimą, jei norite Codex Workflow tiesioginio atvaizdo sąrankoje; runner negauna nei Docker socket, nei backend paslapčių.

> **OpenCode Go runner.** OpenCode Go mazgas naudoja tą patį atvaizdą kaip sustiprintą gretutinį runner (`--entrypoint opencode`), bendrai naudojantį `heym-opencode-workspaces`. Išlaikykite to tomo prijungimą, jei norite OpenCode Workflow tiesioginio atvaizdo sąrankoje; runner negauna nei Docker socket, nei GitHub Token.

> **Skill sandbox.** Python skills Agent mazge veikia sustiprintame gretutiniame konteineryje, kuris bendrai naudoja `heym-codex-workspaces` tomą, todėl išlaikykite to tomo prijungimą ir skills, ne tik Codex. Kiekvienas paleidimas gauna izoliuotą atskirą poaibį, o gretutinis konteineris negauna nei Docker socket, nei backend paslapčių. Tam reikia **Docker Engine 25.0+**; senesniuose engine arba be tomo `HEYM_PYTHON_TOOL_SANDBOX=auto` nepavyksta saugiai — nustatykite `HEYM_PYTHON_TOOL_SANDBOX=subprocess` tik patikimose vieno naudotojo sąrankose. Žr. [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` būtinas Playwright.** Docker suteikia konteineriui 64 MB `/dev/shm`, ir Chromium šioje riboje sugriauna savo renderer. Žingsniais pagrįsti Playwright mazgai paleidžia Chromium kaip subprocesą šiame konteineryje, todėl riba yra šio konteinerio; pasirinktinis `playwrightCode` veikia gretutiniame konteineryje, kuris nustato savo ribą. `docker-compose.yml` jau deklaruoja `shm_size: "2gb"`, todėl `run.sh` ir `deploy.sh` nepaliečiami — tik paprastam `docker run` reikia šios vėliavėlės.

> **Playwright Run Code.** Pasirinktiniam Playwright Python reikia `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` ir aukščiau nurodyto Docker socket prijungimo. Leidimo atvaizdas nustato `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` GHCR išdėstymui (`/app/backend/.venv`). Compose `./deploy.sh` pagal numatytuosius nustatymus naudoja sandbox atvaizdą `heym-backend:local`. Išlaikykite `--no-sandbox` Chromium paleidimo argumentuose sandbox konteineriuose.

**Minimalūs aplinkos kintamieji tiesioginiam atvaizdo paleidimui:**

| Kintamasis | Būtinas | Paskirtis |
|----------|----------|---------|
| `DATABASE_URL` | Neprivalomas | Visos PostgreSQL prisijungimo eilutės perrašymas |
| `POSTGRES_HOST` | Taip, jei `DATABASE_URL` tuščias | PostgreSQL host |
| `POSTGRES_PORT` | Taip, jei `DATABASE_URL` tuščias | PostgreSQL port |
| `POSTGRES_USER` | Taip, jei `DATABASE_URL` tuščias | PostgreSQL naudotojo vardas |
| `POSTGRES_PASSWORD` | Taip, jei `DATABASE_URL` tuščias | PostgreSQL slaptažodis |
| `POSTGRES_DB` | Taip, jei `DATABASE_URL` tuščias | PostgreSQL duomenų bazės pavadinimas |
| `SECRET_KEY` | Taip | JWT pasirašymo paslaptis |
| `ENCRYPTION_KEY` | Taip | Kredencialų šifravimo raktas |
| `FRONTEND_URL` | Rekomenduojama | Viešas naršyklės URL, ypač OAuth callback |
| `CORS_ORIGINS` | Rekomenduojama | Leidžiami naršyklės origin |
| `FILE_STORAGE_DIR` | Rekomenduojama | Nustatykite absoliutų `/app/data/files`, kai prijungiate tą kelią; santykinis `./data/files` numatytasis nustatymas šiame atvaizde išsprendžiamas po `/app/backend` ir nepataiko į prijungimo tašką |
| `ALLOW_REGISTER` | Rekomenduojama | Nustatykite `false` produkcijoje, nebent norite atviros registracijos, bet tik tada, kai Jūsų administratoriaus paskyra jau sukurta — nėra pirmojo naudotojo bootstrap |
| `DOCKER_LOGS_ENABLED` | Neprivalomas | Nustatykite `true`, kad Logs skirtukas galėtų naudoti Docker socket prieigą |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Būtinas, kai `DOCKER_LOGS_ENABLED=true` | Kableliais atskirtas patikimų naudotojų el. pašto adresų sąrašas, kuriems leidžiama pasiekti Docker logs |
| `HEYM_PLUGINS_ENABLED` | Neprivalomas | Nustatykite `true`, kad įjungtumėte plugin posistemį (pasirinktiniai mazgai įdiegiami kaip zip). Pagal numatytuosius nustatymus išjungta |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Būtinas, kai `HEYM_PLUGINS_ENABLED=true` | Kableliais atskirti operatorių el. pašto adresai, kuriems leidžiama įdiegti/pašalinti plugin |
| `HEYM_PLUGINS_DIR` | Neprivalomas | Kur saugomi plugin failai. Nustatykite absoliutų `/app/data/plugins`, kai prijungiate tą kelią; santykinis `data/plugins` numatytasis nustatymas šiame atvaizde išsprendžiamas po `/app/backend` ir nepataiko į prijungimo tašką |
| `HEYM_PYTHON_TOOL_SANDBOX` | Neprivalomas | Python įrankių izoliavimo režimas; pagal numatytuosius nustatymus `auto` (sustiprintas Docker sandbox, nepavyksta saugiai). Žr. [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Neprivalomas | Perrašyti Python įrankių sandbox atvaizdą; tuščias = automatiškai aptikti backend atvaizdą |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Neprivalomas | Docker tomas, naudojamas gretutinių Codex runner konteinerių; pagal numatytuosius nustatymus `heym-codex-workspaces` Docker diegimuose |
| `HEYM_CODEX_NETWORK_ACCESS` | Neprivalomas | Leisti Codex sandbox komandoms atsisiųsti failus/priklausomybes; Docker diegimuose tai įjungta pagal numatytuosius nustatymus |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Neprivalomas | Docker tomas, naudojamas gretutinių OpenCode runner konteinerių; pagal numatytuosius nustatymus `heym-opencode-workspaces` Docker diegimuose |

**Pastabos:**

- Atvaizdas atidaro port `4017`
- Backend lieka vidinis ir yra proxied po `/api`
- Kai `POSTGRES_HOST=localhost`, leidimo atvaizdas automatiškai perrašo jį į `host.docker.internal`, kai reikia, kad tas pats `.env` veiktų su host lygio PostgreSQL konteineriu macOS Docker/Desktop įrankiuose
- Išlaikykite `data/files` prijungimą, jei norite, kad Drive įkėlimai ir skill sugeneruoti failai išliktų po konteinerio perkrovimų
- **Plugins:** norėdami juos įjungti, nustatykite `HEYM_PLUGINS_ENABLED=true` ir `HEYM_PLUGIN_ADMIN_EMAILS`, ir prijunkite `data/plugins`, kad įdiegti plugin failai išliktų po konteinerio atkūrimų. Plugin metaduomenys saugomi Jūsų PostgreSQL, todėl jie taip pat išlieka. Plugino deklaruotos pip `dependencies` įdiegiamos į konteinerį diegimo metu; kadangi atvaizdo failų sistema yra laikina, jos **automatiškai įdiegiamos iš naujo paleidimo metu** kiekvienam įdiegtam plugin (leidimo atvaizdo `uv` venv yra rašomas, todėl tai veikia ir vieno konteinerio atvaizde)

### Esamos duomenų bazės perkėlimas į vardinį tomą

`./deploy.sh --migrate-pgdata` žino tik apie Compose stack. Jei paleidžiate leidimo atvaizdą prieš savo PostgreSQL konteinerį ir tas konteineris bind-mountina host katalogą, perkelkite jį patys.

Pirmiausia patikrinkite, ką naudoja Jūsų duomenų bazės konteineris:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Jei `"Type"` rodo `bind`, perkelkite jį į vardinį tomą:

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

**2 ir 3 žingsniuose naudokite savo atvaizdą, o ne `postgres:16`.** Jei Jūsų duomenų bazė naudoja `pgvector/pgvector:pg16` ar kitą variantą, nukopijuoto Cluster paleidimas su standartiniu atvaizdu gali nepavykti, nes trūksta plėtinių bibliotekų, kurių jis tikisi.

Jūsų pradinis duomenų katalogas šios procedūros nepaveikiamas, todėl jis išlieka Jūsų atkūrimo kelias. Ištrinkite jį tik patvirtinę, kad perkelta duomenų bazė aptarnauja Jūsų Workflow. 4 žingsnis svarbus dėl tos pačios priežasties kaip ir Compose migracijoje: kopija perneša bet kokią esamą indekso žalą.

---

## Kelių egzempliorių paleidimas

Viskas, kas aprašyta aukščiau, paleidžia vieną Heym egzempliorių. Kai vieno serverio nebeužtenka, nukreipkite antrą egzempliorių į tą pačią PostgreSQL duomenų bazę ir jis prisijungs kaip worker: fono vykdymai — cron, webhooks, MCP tool calls, chat triggers — tuomet bus paskirstomi tarp egzempliorių pagal procentinę dalį, kurią nustatysite skiltyje **Settings → Instances**.

Egzemplioriai niekada nesusisiekia tarpusavyje. Darbą perduoda Postgres, todėl worker nereikia atidaryto prievado, maršruto atgal į pagrindinį egzempliorių ir nenaudojamas joks pranešimų brokeris. Darbas, susijęs su vietiniu disku — Drive failai, coding-agent darbo sritys, įdiegti plugins — visada vykdomas pagrindiniame egzemplioriuje, todėl nieko nereikia bendrinti per failų sistemą.

Dvi taisyklės, kurių cluster negali užtikrinti už Jus: kiekvienas egzempliorius turi naudoti tą patį `SECRET_KEY` ir `ENCRYPTION_KEY`, o ingress turi būti nukreiptas tik į pagrindinį egzempliorių. Abi jos paaiškintos kartu su išdėstymo taisyklėmis ir kaip pasirinkti procentines dalis, [Load Distribution](../reference/cluster.md).

> Tai yra apkrovos paskirstymas, o ne aukštas prieinamumas. Pagrindinis egzempliorius išlieka vieninteliu gedimo tašku ingress, failų saugyklai ir redaktoriui.

## Dažni Workflow

**Pirmasis nustatymas:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Jei naudojate iš anksto paruoštą `docker run` image, pirmiausia sugeneruokite raktus rankiniu būdu (žr. skyrių **Prebuilt Image** aukščiau).

**Atnaujinkite production po kodo pakeitimo:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Patikrinkite production žurnalus:**

```bash
./deploy.sh --logs
```

**Sustabdykite production paslaugas:**

```bash
./deploy.sh --down
```

---

## Susiję

- [Įvadas](./introduction.md) – Platformos apžvalga
- [Greita pradžia](./quick-start.md) – Sukurkite savo pirmąjį Workflow
- [Aplinkos kintamieji](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilna konfigūracijos nuoroda
- [Saugumas](../reference/security.md) – JWT, šifravimo ir CORS nustatymai
- [Apkrovos paskirstymas](../reference/cluster.md) – Paleiskite kelias instances su viena duomenų baze

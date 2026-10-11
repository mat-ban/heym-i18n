# Zagon in namestitev

Heym ponuja dva skripta za različna okolja: `run.sh` za lokalni razvoj in `deploy.sh` za produkcijske namestitve z uporabo Docker Compose.

> **Video predstavitev:** [Nastavite Heym lokalno v manj kot 2 minutah](https://www.youtube.com/watch?v=P6YvlupUboU) — klonirajte repozitorij, zaženite PostgreSQL, izpolnite zahtevane okoljske spremenljivke in ustvarite svoj prvi račun na lokalni instanci.

## Predpogoji

Oba skripta zahtevata, da so nameščena naslednja orodja:

| Orodje | Namen |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Vsebnik podatkovne baze (razvoj) in celoten sklad (produkcija) |
| [uv](https://github.com/astral-sh/uv) | Upravitelj paketov Python za zaledje |
| [bun](https://bun.sh) | Izvajalno okolje JavaScript za čelni del |

## Nastavitev okolja

Tako `run.sh` kot `deploy.sh` bereta iz datoteke `.env` v korenu projekta. Če ta ne obstaja, skript samodejno ustvari eno iz `.env.example` — tako za lokalni razvoj kot za produkcijo.

`SECRET_KEY` in `ENCRYPTION_KEY` sta v `.env.example` prazna. Ko je kateri od njiju prazen, `run.sh` in `deploy.sh` samodejno ustvarita kriptografsko močno vrednost in jo zapišeta nazaj v `.env`, tako da sveža nastavitev ne zahteva ročnega upravljanja ključev. Če obstoječa `.env` še vedno vsebuje staro ogrado `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), se skripta ustavita z izrecno napako, namesto da bi jo prepisala — rotacija tega ključa bi naredila predhodno šifrirane poverilnice neberljive. Tudi zaledje samo zavrne zagon, če je kateri od ključev prazen ali ostane na znani ogradi.

Za ročno ustvarjanje datoteke (neobvezno — skripta to storita namesto vas):

```bash
cp .env.example .env
```

Ključne okoljske spremenljivke:

Za vsako podprto spremenljivko, privzeto vrednost in produkcijsko opombo glejte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Spremenljivka | Opis |
|----------|-------------|
| `SECRET_KEY` | **Zahtevano.** Skrivnost za podpisovanje JWT. Samodejno ustvari `run.sh`/`deploy.sh`, ko je prazna. |
| `ENCRYPTION_KEY` | **Zahtevano.** Ključ za šifriranje poverilnic. Samodejno ustvari `run.sh`/`deploy.sh`, ko je prazen. |
| `DATABASE_URL` | Neobvezna preglasitev povezovalnega niza podatkovne baze. Če je prazna, jo Heym sestavi iz nastavitev `POSTGRES_*`. |
| `BACKEND_PORT` | Vrata API zaledja — privzeto `10105` |
| `FRONTEND_PORT` | Vrata čelnega dela — privzeto `4017` |
| `FRONTEND_URL` | **Zahtevano v produkciji.** Javni URL aplikacije (shema + gostitelj, npr. `https://heym.example.com`). Uporablja se za preusmeritvene URI-je OAuth (Google Sheets, BigQuery, Notion in podobno) ter za povezave do pregleda, nadaljevanja Codex in datotek, ki jih ustvarijo zagoni v ozadju; mora se ujemati z URL-jem, ki ga uporabniki uporabljajo v brskalniku. V gruči nastavite isto vrednost na vsaki instanci. |
| `ALLOW_REGISTER` | Odprta registracija uporabnikov (`false` v produkciji, `true` v razvoju). Preklopite na `false` šele, ko vaš skrbniški račun obstaja — ni zagona prvega uporabnika, zato prazna podatkovna baza in onemogočena registracija ne puščata nobene možnosti za ustvarjanje računa. |
| `DOCKER_LOGS_ENABLED` | Omogoči dostop do zavihka Logs, podprtega z Dockerjem, ko je nastavljeno na `true`; zahteva tudi dostop do vtičnice Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Z vejico ločen seznam e-poštnih naslovov zaupanja vrednih uporabnikov, ki jim je dovoljen dostop do Docker dnevnikov, ko je `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Največja velikost telesa zahteve HTTP, sprejeta preden se izvedejo upravljalniki končnih točk; privzeto `100`, en MB več od `FILE_MAX_SIZE_MB`, da ostane prostor za večdelno prekrivno glavo |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kako se izvajajo uporabniško določena orodja Python: `auto` (privzeto — utrjen, izoliran vsebnik Docker; ob napaki se zapre, če Docker ni na voljo), `docker` (enako, nikoli ne preklopi nazaj) ali `subprocess` (lokalna nadomestna možnost v procesu; ni varnostna meja, samo zaupanja vredno/razvoj). `run.sh` nastavi `subprocess` za izvorni razvoj. Glejte [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Slika, ki se uporablja za peskovnik Docker orodja Python. Prazno = samodejno zaznaj sliko tekočega zaledja. |

Privzete vrednosti povezave do podatkovne baze (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) so dokumentirane v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) in `.env.example`.

---

## Razvoj: `run.sh`

`run.sh` zažene vse tri storitve lokalno — bazo podatkov (kot Docker container), FastAPI backend in Vite razvojni strežnik — z enim samim ukazom.

```bash
./run.sh
```

**Kaj počne, korak za korakom:**

1. Preveri, ali so na voljo `docker`, `bun` in `uv`
2. Ustvari `.env` iz `.env.example`, če ta manjka, in generira naključni `SECRET_KEY` ter `ENCRYPTION_KEY`, kadar je kateri prazen
3. Zažene (ali ustvari) Docker container baze podatkov na portu `6543`, pri čemer shranjuje podatke v Docker volumnu `heym-postgres-data` namesto v imeniku gostitelja
4. Namesti Python odvisnosti prek `uv sync`
5. Zažene Alembic migracije baze podatkov (`alembic upgrade head`)
6. Sprosti porta backend in frontend, če sta zasedena
7. Zažene FastAPI backend z `--reload` (samodejno ponovno nalaganje ob spremembah kode)
8. Namesti odvisnosti frontenda prek `bun install`
9. Zažene Vite razvojni strežnik

**Možnosti:**

| Zastavica | Opis |
|------|-------------|
| *(brez)* | Zaženi z omogočenim debug beleženjem (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Zaženi s privzeto ravnjo beleženja (brez debug izpisa) |
| `--help` | Prikaži informacije o uporabi |

**Naslovi storitev (razvoj):**

| Storitev | Naslov |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (privzeto: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (privzeto: 10105) |
| Interaktivna API dokumentacija | `localhost:10105/docs` |
| Baza podatkov | `localhost:6543` |

Pritisnite `Ctrl+C` za postopno zaustavitev vseh storitev.

---

## Celoviti testi (End-to-End): `run_e2e.sh`

Playwright paket testov frontenda se izvaja proti pravi Vue aplikaciji, FastAPI backendu in
izolirani PostgreSQL bazi podatkov:

```bash
./run_e2e.sh
```

Paket je preizkus ključnih poti in regresijski paket, ne pa izčrpno pokrivanje izdelka. Pokriva
avtentikacijo, življenjski cikel in izvajanje osrednjih Workflow-ov, izbrane vire nadzorne plošče,
javne poti in simuliran HITL pregledovalni vmesnik. Integracije ponudnikov, vsi tipi vozlišč,
matrike deljenja/dovoljenj in celotno HITL nadaljevalno izvajanje ostajajo pokriti predvsem z
backend testi ali zahtevajo namenska integracijska okolja.

Vsak zagon dobi svoj začasni PostgreSQL 16 container, naključne razpoložljive porte za bazo
podatkov/backend/frontend, stanje avtentikacije, rezultate testov in HTML poročilo. To omogoča
sočasno izvajanje več procesov `run_e2e.sh` brez deljenja stanja ali prepisovanja artefaktov.
Skript ob zaključku zagona odstrani svoj container baze podatkov ter izpiše imenik artefaktov in
pot do poročila.

Uporabni ukazi:

```bash
./run_e2e.sh --ui         # Interaktivni Playwright izvajalnik z izolirano bazo podatkov
cd frontend
bun run test:e2e:report   # Odpri zadnji zaključeni lokalni zagon
```

Neposredni zagoni `bun run test:e2e` in `bun run test:e2e:ui` zahtevajo izrecni `DATABASE_URL`, da
se ne morejo tiho zagnati proti lokalni razvojni bazi podatkov. Za običajne lokalne zagone
uporabite `./run_e2e.sh`.

`./check.sh` zažene lint, preverjanje tipov, oblikovanje in backend teste brez E2E paketa, s čimer
ohranja privzeto lokalno pot preverjanja hitro. Playwright E2E teste zaženite ločeno z
`./run_e2e.sh`. Pull requesti vedno zaženejo Chromium E2E paket v GitHub Actions in ob napakah
ohranijo sledi, posnetke zaslona, videoposnetke in HTML poročilo.

---

## Produkcija: `deploy.sh`

`deploy.sh` zgradi in zažene celoten sklad s pomočjo Docker Compose. Vse tri storitve — baza podatkov, backend in frontend — tečejo kot containerji. Vstopna točka backenda samodejno izvede migracije pred zagonom strežnika z 8 delavci.

**Začetna namestitev (gradnja + zagon):**

```bash
./deploy.sh
```

To izvede namestitev brez izpada: slike se najprej zgradijo, medtem ko obstoječi containerji še naprej tečejo, nato se nova različica zamenja.

**Razpoložljivi ukazi:**

| Ukaz | Opis |
|---------|-------------|
| `./deploy.sh` | Zgradi slike ter zažene/posodobi vse storitve |
| `./deploy.sh --status` | Prikaže status containerjev |
| `./deploy.sh --logs` | Pretaka dnevnike iz vseh containerjev |
| `./deploy.sh --restart` | Ponovno zažene vse containerje |
| `./deploy.sh --down` | Ustavi in odstrani vse containerje |
| `./deploy.sh --migrate-pgdata` | Enkratna migracija: kopira obstoječi imenik `data/postgres` v Docker volumen `heym-postgres-data` in ponovno zgradi njegove indekse |
| `./deploy.sh --help` | Prikaže informacije o uporabi |

**Shramba baze podatkov: Docker imenovani volumen, ne imenik gostitelja.**

Compose shranjuje PostgreSQL v Docker volumnu `heym-postgres-data`. Prejšnje različice so namesto tega bind-mountale imenik gostitelja `./data/postgres`. Bind mounti gostitelja na macOS (virtiofs) in Windows/WSL2 ne zagotavljajo PostgreSQL-ju garancij `fsync` in zapiranja datotek, ki jih potrebuje: clusterji tam naletijo na `PANIC: could not close file … Input/output error` na WAL segmentih in se sčasoma pokvarijo. Linux bind mounti niso bili nikoli prizadeti, vendar zdaj vse platforme uporabljajo isto postavitev.

Nadgradnja namestitve, ki ima še vedno podatke v `./data/postgres`, je enkraten korak. `./deploy.sh` to zazna, se ustavi pred gradnjo in vas prosi, da najprej izvedete migracijo:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**Migracija tudi ponovno zgradi indekse.** Kopija je bajt za bajt, zato poškodbe indeksov, ki jih je povzročil stari bind mount, potujejo z njo. `--migrate-pgdata` zato zažene storitev `postgres` samo na novem volumnu, nad njo izvede `reindexdb` in jo znova ustavi, preden se dvigne preostali sklad. To je pomembno, ker ta vrsta okvare pusti vnose v indeksih, ki kažejo prek konca heap-a — stanje, ki ga `pg_amcheck` prijavi kot čisto, zato uspešno preverjanje ni dokaz zdrave tabele. REINDEX popravi te vnose; ne more obnoviti heap strani, ki jih je stari datotečni sistem že izgubil. Na veliki, znano zdravi bazi podatkov lahko obidete ponovno gradnjo z `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopija je neuničujoča. `./data/postgres` ostane na mestu kot varnostna kopija, migracija pa zavrne prepisovanje volumna, ki že vsebuje bazo podatkov. Če kateri koli korak spodleti, se novi volumen odstrani, tako da napol migriranega clusterja ni mogoče pomotoma namestiti. Izbrišite stari imenik, ko potrdite, da so vaši Workflow-i nepoškodovani. Container `postgres` nosi isto zaščito, tako da tudi ročni `docker compose up` ne more tiho inicializirati prazne baze podatkov čez vaše podatke. Sveže namestitve ne zahtevajo nobenega ukrepa.

**Naslovi storitev (produkcija):**

Frontend container je izpostavljen na `FRONTEND_PORT` (privzeto: 4017). Backend API se streže pod potjo `/api`, posredovano skozi frontend container — tako je v produkciji samo ena javno dostopna vrata.

**Pregled containerjev:**

| Container | Opis |
|-----------|-------------|
| `heym-db` | Relacijska baza podatkov |
| `heym-backend` | FastAPI API strežnik (8 delavcev, zgrajen iz `backend/Dockerfile`) |
| `heym-frontend` | Predogledni container frontenda, ki streže zgrajeno Vue aplikacijo (zgrajen iz `frontend/Dockerfile`) |

**Značka za posodobitev različice:**

Glava aplikacije prikazuje različico tekoče Docker gradnje. Ko ta različica zaostaja za najnovejšo izdajo Heym na GitHubu, se poleg različice prikaže vijolična značka **Update**. Kliknite različico ali značko, da odprete stran izdaj Heym na GitHubu.

---

## Vnaprej pripravljena slika: `docker run`

Če aplikacije ne želite graditi lokalno, lahko povlečete objavljeno sliko vsebnika in jo zaženete neposredno.

Slika zažene frontend in backend skupaj v enem vsebniku. PostgreSQL je še vedno zunanji, vendar lahko posredujete bodisi `DATABASE_URL` bodisi spremenljivke `POSTGRES_*` iz `.env.example`.

> **Shranite svojo bazo podatkov v Dockerjevo imenovano glasovno enoto (named volume).** Izdajna slika ne prinaša baze podatkov, zato je PostgreSQL za `DATABASE_URL` vaša odgovornost. Priklopite jo kot `-v heym-postgres-data:/var/lib/postgresql/data` namesto poti gostitelja: na macOS (virtiofs) in Windows/WSL2 vezana (bind-mounted) podatkovna mapa PostgreSQL ne spoštuje garancij `fsync`, ki jih baza zahteva, in sčasoma poškoduje cluster.

> **Zaledje vektorske shrambe.** `run.sh` in `deploy.sh` zaženeta uradno sliko `postgres:16` in samodejno namestita paket `postgresql-16-pgvector` ob zagonu, zato **zaledje Postgres (pgvector) RAG** tam deluje brez sprememb vaših podatkov. Vnaprej pripravljena enovsebniška slika pa se poveže s PostgreSQL, ki ga **vi** posredujete — ta baza mora podpirati razširitev `vector` za uporabo zaledja Postgres. Heym ne more namestiti pgvector v bazo, ki je ne upravlja. Brez tega selitev ob zagonu gladko preskoči tabelo pgvector — namestitev še vedno uspe, Qdrant RAG še naprej deluje, ustvarjanje ali nalaganje v Postgres vektorsko shrambo pa vrne jasno sporočilo "backend unavailable", dokler pgvector ni omogočen.

**Ključe nastavite sami za neposredne zagone slike.** Za razliko od `run.sh`/`deploy.sh` vnaprej pripravljena slika ne ustvari ključev samodejno. Po `cp .env.example .env` izpolnite dva prazna ključa (zamenjava na mestu se izogne podvojenim vnosom):

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

> **Poskrbite, da bodo priklopi datotek in vtičnikov absolutni.** `FILE_STORAGE_DIR` in `HEYM_PLUGINS_DIR` privzeto uporabljata relativni poti `./data/files` in `data/plugins`, izdajna slika pa zažene backend iz `/app/backend`. Če ostaneta relativni, se razrešita v `/app/backend/data/files` in `/app/backend/data/plugins`, zato dva priklopa (bind mount) zgoraj ne prejmeta ničesar in naložene datoteke se izgubijo, ko se vsebnik zamenja. Zastavice `-e` povozijo relativne vrednosti, ki jih `.env.example` posreduje prek `--env-file`, ker ukazna vrstica `-e` prevlada nad `--env-file`. Compose (`./deploy.sh`) tega ne potrebuje: ta slika zažene backend iz `/app`, kjer relativne privzete vrednosti že pristanejo na priklopih.

> **Dostop do Docker vtičnice.** Priklop `/var/run/docker.sock` daje backendu širok nadzor nad gostiteljskim Docker daemnom. Privzeta storitev Docker Compose in neposredni primer `docker run` ga vključujeta za Docker-osnovana MCP stdio orodja, ki izvajajo ukaze `docker`. Zavihek Logs še vedno zahteva `DOCKER_LOGS_ENABLED=true` in `DOCKER_LOGS_ALLOWED_EMAILS` z vejico ločenim seznamom zaupanja vrednih e-poštnih naslovov uporabnikov. Ustvarite zaupanja vreden skrbniški račun, preden omogočite Docker dnevnike, ali obdržite `ALLOW_REGISTER=false`, da nepreverjena samoregistracija ne more prevzeti e-poštnega naslova z dovoljenega seznama. Uporabniško določena Python orodja **ne** dobijo te vtičnice: tečejo v ločenem utrjenem vsebniku brez Docker vtičnice. Glejte [Varnost](../reference/security.md#python-tool-sandbox).

> **Izvajalnik Codex.** Vozlišče Codex uporablja isto sliko `ghcr.io/heymrun/heym` kot sorojni izvajalni vsebnik (`--entrypoint codex`), da lahko Codexov Linux peskovnik ustvari imenske prostore (namespaces). Obdržite priklop glasovne enote `heym-codex-workspaces`, če želite Codex Workflow v neposredni nastavitvi slike; izvajalnik ne prejme Docker vtičnice ali skrivnosti backend-a.

> **Izvajalnik OpenCode Go.** Vozlišče OpenCode Go uporablja isto sliko kot utrjen sorojni izvajalnik (`--entrypoint opencode`), ki si deli `heym-opencode-workspaces`. Obdržite ta priklop glasovne enote, če želite OpenCode Workflow v neposredni nastavitvi slike; izvajalnik ne prejme Docker vtičnice ali GitHub žetona.

> **Peskovnik za spretnosti (Skill sandbox).** Python spretnosti na vozlišču Agent tečejo v utrjenem sorojnem vsebniku, ki si deli glasovno enoto `heym-codex-workspaces`, zato obdržite ta priklop glasovne enote tudi za spretnosti — ne le za Codex. Vsak zagon dobi izolirano podpot za posamezni zagon, sorojni vsebnik pa ne prejme niti Docker vtičnice niti skrivnosti backend-a. To zahteva **Docker Engine 25.0+**; na starejših pogonih ali brez glasovne enote `HEYM_PYTHON_TOOL_SANDBOX=auto` odpove varno (fail closed) — nastavite `HEYM_PYTHON_TOOL_SANDBOX=subprocess` le za zaupanja vredne enouporabniške nastavitve. Glejte [Varnost](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` je obvezen za Playwright.** Docker dodeli vsebniku 64 MB `/dev/shm` in Chromium pod tem sesuje svoj izrisovalnik (renderer). Playwrightova vozlišča na osnovi korakov zaženejo Chromium kot podproces znotraj tega vsebnika, zato je omejitev omejitev tega vsebnika; custom `playwrightCode` teče v sorojnem vsebniku, ki nastavi svojo. `docker-compose.yml` že deklarira `shm_size: "2gb"`, zato `run.sh` in `deploy.sh` nista prizadeta — le navaden `docker run` potrebuje to zastavico.

> **Playwright Run Code.** Custom Playwright Python potrebuje `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` in zgornji priklop Docker vtičnice. Izdajna slika nastavi `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` za postavitev GHCR (`/app/backend/.venv`). Compose `./deploy.sh` privzeto nastavi sliko peskovnika na `heym-backend:local`. Obdržite `--no-sandbox` v zagonskih argumentih Chromium znotraj vsebnikov peskovnika.

**Najmanjše okoljske spremenljivke za neposredne zagone slike:**

| Spremenljivka | Zahtevano | Namen |
|----------|----------|---------|
| `DATABASE_URL` | Neobvezno | Celotna povezovalna niz PostgreSQL, ki povozí privzeto |
| `POSTGRES_HOST` | Da, če je `DATABASE_URL` prazen | Gostitelj PostgreSQL |
| `POSTGRES_PORT` | Da, če je `DATABASE_URL` prazen | Vrata PostgreSQL |
| `POSTGRES_USER` | Da, če je `DATABASE_URL` prazen | Uporabniško ime PostgreSQL |
| `POSTGRES_PASSWORD` | Da, če je `DATABASE_URL` prazen | Geslo PostgreSQL |
| `POSTGRES_DB` | Da, če je `DATABASE_URL` prazen | Ime baze podatkov PostgreSQL |
| `SECRET_KEY` | Da | Skrivnost za podpisovanje JWT |
| `ENCRYPTION_KEY` | Da | Ključ za šifriranje poverilnic |
| `FRONTEND_URL` | Priporočeno | Javni URL brskalnika, zlasti za OAuth povratne klice |
| `CORS_ORIGINS` | Priporočeno | Dovoljeni izvori brskalnika |
| `FILE_STORAGE_DIR` | Priporočeno | Nastavite ga na absolutno pot `/app/data/files`, ko priklopite to pot; relativna privzeta vrednost `./data/files` se v tej sliki razreši pod `/app/backend` in zgreši priklop |
| `ALLOW_REGISTER` | Priporočeno | V produkciji nastavite `false`, razen če je odprta registracija namerna, a šele ko vaš skrbniški račun obstaja — ni zagona prvega uporabnika |
| `DOCKER_LOGS_ENABLED` | Neobvezno | Nastavite `true`, da zavihek Logs lahko uporablja dostop do Docker vtičnice |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Zahtevano, ko je `DOCKER_LOGS_ENABLED=true` | Z vejico ločen seznam zaupanja vrednih e-poštnih naslovov uporabnikov, ki smejo dostopati do Docker dnevnikov |
| `HEYM_PLUGINS_ENABLED` | Neobvezno | Nastavite `true` za omogočitev podsistema vtičnikov (custom vozlišča, nameščena kot zip). Privzeto izklopljeno |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Zahtevano, ko je `HEYM_PLUGINS_ENABLED=true` | Z vejico ločen seznam e-poštnih naslovov operaterjev, ki smejo nameščati/odstranjevati vtičnike |
| `HEYM_PLUGINS_DIR` | Neobvezno | Kje so shranjene datoteke vtičnikov. Nastavite ga na absolutno pot `/app/data/plugins`, ko priklopite to pot; relativna privzeta vrednost `data/plugins` se v tej sliki razreši pod `/app/backend` in zgreši priklop |
| `HEYM_PYTHON_TOOL_SANDBOX` | Neobvezno | Način izolacije Python orodij; privzeto `auto` (utrjen Docker peskovnik, fail closed). Glejte [Varnost](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Neobvezno | Povozi sliko peskovnika Python orodij; prazno = samodejno zaznaj sliko backend-a |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Neobvezno | Docker glasovna enota, ki jo uporabljajo sorojni izvajalni vsebniki Codex; privzeto `heym-codex-workspaces` v Docker namestitvah |
| `HEYM_CODEX_NETWORK_ACCESS` | Neobvezno | Dovoli Codexovim peskovniškim ukazom prenašanje datotek/odvisnosti; Docker namestitve to privzeto omogočijo |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Neobvezno | Docker glasovna enota, ki jo uporabljajo sorojni izvajalni vsebniki OpenCode; privzeto `heym-opencode-workspaces` v Docker namestitvah |

**Opombe:**

- Slika izpostavi vrata `4017`
- Backend ostane interni in je posredovan pod `/api`
- Ko je `POSTGRES_HOST=localhost`, izdajna slika to samodejno prepiše v `host.docker.internal`, ko je potrebno, da isti `.env` deluje z vsebnikom PostgreSQL na ravni gostitelja v orodjih macOS Docker/Desktop
- Obdržite priklop `data/files`, če želite, da Drive naložene datoteke in datoteke, ki jih ustvarijo spretnosti, preživijo ponovne zagone vsebnika
- **Vtičniki:** za njihovo omogočitev nastavite `HEYM_PLUGINS_ENABLED=true` in `HEYM_PLUGIN_ADMIN_EMAILS` ter priklopite `data/plugins`, da nameščene datoteke vtičnikov obstanejo ob ponovnem ustvarjanju vsebnika. Metapodatki vtičnikov živijo v vašem PostgreSQL, zato prav tako obstanejo. Deklarirane pip `dependencies` vtičnika se ob namestitvi namestijo v vsebnik; ker je datotečni sistem slike efemeren, se **ob zagonu samodejno ponovno namestijo** za vsak nameščen vtičnik (venv `uv` izdajne slike je pisljiv, zato to deluje tudi v enovsebniški sliki)

### Premik obstoječe baze podatkov v imenovano glasovno enoto

`./deploy.sh --migrate-pgdata` pozna le sklad Compose. Če zaženete izdajno sliko proti lastnemu vsebniku PostgreSQL in ta vsebnik vezano priklopi (bind-mount) mapo gostitelja, jo preselite sami.

Najprej preverite, kaj uporablja vaš vsebnik baze podatkov:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Če se `"Type"` glasi `bind`, jo premaknite v imenovano glasovno enoto:

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

**V korakih 2 in 3 uporabite svojo sliko, ne `postgres:16`.** Če vaša baza teče na `pgvector/pgvector:pg16` ali drugi različici, lahko zagon kopiranega cluster-a s standardno sliko odpove, ker manjkajo knjižnice razširitev, ki jih pričakuje.

Vaša izvirna podatkovna mapa s tem postopkom ostane nedotaknjena, zato ostaja vaša pot za povrnitev (rollback). Izbrišite jo šele, ko potrdite, da preseljena baza streže vašim Workflow. Korak 4 je pomemben iz istega razloga kot pri selitvi Compose: kopija s seboj prinese morebitno obstoječo poškodbo indeksov.

---

## Zagon več kot ene instance

Vse zgoraj opisano namesti eno samo instanco Heym. Ko en stroj ni več dovolj, usmerite drugo instanco na isto PostgreSQL bazo in ta se pridruži kot worker: ozadnji procesi — cron, webhooks, klici MCP orodij, chat triggers — se nato razdelijo med instance glede na odstotek, ki ga nastavite pod **Settings → Instances**.

Instance med seboj nikoli ne komunicirajo. Delo prenaša Postgres, zato worker ne potrebuje odprtih vrat niti poti nazaj do glavne instance in noben message broker ni vključen. Delo, ki se dotika lokalnega diska — Drive datoteke, delovni prostori coding-agenta, nameščeni plugins — se vedno izvaja na glavni instanci, zato ni treba ničesar deliti prek datotečnega sistema.

Dve pravili, ki jih cluster ne more uveljaviti namesto vas: vsaka instanca mora uporabljati isti `SECRET_KEY` in `ENCRYPTION_KEY`, ingress pa mora kazati samo na glavno instanco. Oboje je razloženo, skupaj s pravili razporejanja in tem, kako izbrati odstotke, v [Load Distribution](../reference/cluster.md).

> To je porazdelitev obremenitve, ne visoka razpoložljivost. Glavna instanca ostaja enotna točka odpovedi za ingress, shranjevanje datotek in urejevalnik.

## Pogosti Workflows

**Prva nastavitev:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Za vnaprej pripravljeno sliko `docker run` najprej ročno ustvarite ključe (glejte razdelek **Prebuilt Image** zgoraj).

**Posodobitev produkcije po spremembi kode:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Preverjanje produkcijskih dnevnikov:**

```bash
./deploy.sh --logs
```

**Ustavitev produkcijskih storitev:**

```bash
./deploy.sh --down
```

---

## Povezane vsebine

- [Uvod](./introduction.md) – Pregled platforme
- [Hiter začetek](./quick-start.md) – Zgradite svoj prvi Workflow
- [Okoljske spremenljivke](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Celotna referenca konfiguracije
- [Varnost](../reference/security.md) – Nastavitve JWT, šifriranja in CORS
- [Porazdelitev obremenitve](../reference/cluster.md) – Zagon več instanc proti eni bazi podatkov

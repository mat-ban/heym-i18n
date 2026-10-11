# Pokretanje i implementacija

Heym nudi dvije skripte za različita okruženja: `run.sh` za lokalni razvoj i `deploy.sh` za produkcijske implementacije pomoću Docker Composea.

> **Video vodič:** [Postavite Heym lokalno u manje od 2 minute](https://www.youtube.com/watch?v=P6YvlupUboU) — klonirajte repozitorij, pokrenite PostgreSQL, ispunite potrebne varijable okruženja i izradite svoj prvi račun na lokalnoj instanci.

## Preduvjeti

Obje skripte zahtijevaju instalaciju sljedećih alata:

| Alat | Namjena |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Kontejner baze podataka (razvoj) i cijeli stack (produkcija) |
| [uv](https://github.com/astral-sh/uv) | Python upravitelj paketima za backend |
| [bun](https://bun.sh) | JavaScript runtime za frontend |

## Postavljanje okruženja

I `run.sh` i `deploy.sh` čitaju iz datoteke `.env` u korijenu projekta. Ako ne postoji, skripta je automatski stvara iz `.env.example` — i za lokalni razvoj i za produkciju.

`SECRET_KEY` i `ENCRYPTION_KEY` isporučuju se prazni u `.env.example`. Kada je bilo koja prazna, `run.sh` i `deploy.sh` automatski generiraju kriptografski snažnu vrijednost i zapisuju je natrag u `.env`, tako da svježe postavljanje ne zahtijeva ručno upravljanje ključevima. Ako postojeća `.env` datoteka još uvijek sadrži zastarjeli `ENCRYPTION_KEY` placeholder (`change_this_to_a_random_32_byte_hex_value`), skripte se zaustavljaju s eksplicitnom greškom umjesto da ga prepišu — rotacija tog ključa učinila bi prethodno šifrirane vjerodajnice nečitljivima. Sam backend također odbija pokretanje ako je bilo koji ključ prazan ili ostavljen na poznatom placeholderu.

Za ručno stvaranje datoteke (neobavezno — skripte to rade umjesto Vas):

```bash
cp .env.example .env
```

Ključne varijable okruženja:

Za svaku podržanu varijablu, zadanu vrijednost i produkcijsku napomenu pogledajte [Varijable okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Varijabla | Opis |
|----------|-------------|
| `SECRET_KEY` | **Obavezno.** Tajna za potpisivanje JWT-a. Automatski generira `run.sh`/`deploy.sh` kada je prazna. |
| `ENCRYPTION_KEY` | **Obavezno.** Ključ za šifriranje vjerodajnica. Automatski generira `run.sh`/`deploy.sh` kada je prazan. |
| `DATABASE_URL` | Neobavezno nadjačavanje niza za povezivanje s bazom podataka. Ako je prazno, Heym ga sastavlja iz `POSTGRES_*` postavki. |
| `BACKEND_PORT` | Port backend API-ja — zadano `10105` |
| `FRONTEND_PORT` | Port frontenda — zadano `4017` |
| `FRONTEND_URL` | **Obavezno u produkciji.** Javni URL aplikacije (shema + host, npr. `https://heym.example.com`). Koristi se za OAuth redirect URI-jeve (Google Sheets, BigQuery, Notion i slično) te za poveznice na pregled, Codex follow-up i datoteke koje generiraju pozadinska izvršavanja; mora odgovarati URL-u koji korisnici koriste u pregledniku. U clusteru postavite istu vrijednost na svakoj instanci. |
| `ALLOW_REGISTER` | Otvorena registracija korisnika (`false` u produkciji, `true` u razvoju). Prebacite na `false` tek nakon što Vaš administratorski račun postoji — nema bootstrapa prvog korisnika, pa prazna baza podataka uz onemogućenu registraciju ne ostavlja način da se on izradi. |
| `DOCKER_LOGS_ENABLED` | Omogućuje pristup kartici Logs podržanoj Dockerom kada je postavljeno na `true`; također zahtijeva pristup Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Popis e-adresa pouzdanih korisnika odvojenih zarezom kojima je dopušten pristup Docker logovima kada je `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Najveća veličina HTTP tijela zahtjeva prihvaćena prije nego što se pokrenu rukovatelji endpointa; zadano `100`, jedan MB više od `FILE_MAX_SIZE_MB` kako bi ostalo mjesta za multipart overhead |
| `HEYM_PYTHON_TOOL_SANDBOX` | Kako se izvršavaju korisnički definirani Python alati: `auto` (zadano — ojačani, izolirani Docker kontejner; fail closed ako Docker nije dostupan), `docker` (isto, nikad ne prelazi na rezervnu opciju) ili `subprocess` (lokalna rezervna opcija unutar procesa; nije sigurnosna granica, samo za pouzdano/razvojno okruženje). `run.sh` postavlja `subprocess` za nativni razvoj. Pogledajte [Sigurnost](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image koji se koristi za Docker sandbox Python alata. Prazno = automatsko prepoznavanje pokrenutog backend imagea. |

Zadane vrijednosti povezivanja s bazom podataka (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) dokumentirane su u [Varijablama okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) i `.env.example`.

---

## Razvoj: `run.sh`

`run.sh` pokreće sve tri usluge lokalno — bazu podataka (kao Docker container), FastAPI backend i Vite dev server — jednom naredbom.

```bash
./run.sh
```

**Što radi, korak po korak:**

1. Provjerava jesu li `docker`, `bun` i `uv` dostupni
2. Stvara `.env` iz `.env.example` ako nedostaje te generira nasumični `SECRET_KEY` i `ENCRYPTION_KEY` kada su prazni
3. Pokreće (ili stvara) Docker container baze podataka na portu `6543`, pohranjujući njezine podatke u Docker volume `heym-postgres-data` umjesto u direktorij na hostu
4. Instalira Python ovisnosti putem `uv sync`
5. Pokreće Alembic migracije baze podataka (`alembic upgrade head`)
6. Oslobađa portove backenda i frontenda ako su zauzeti
7. Pokreće FastAPI backend s `--reload` (hot-reload pri promjenama koda)
8. Instalira ovisnosti frontenda putem `bun install`
9. Pokreće Vite dev server

**Opcije:**

| Zastavica | Opis |
|------|-------------|
| *(nema)* | Pokreće s omogućenim debug logiranjem (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Pokreće s zadanom razinom logiranja (bez debug izlaza) |
| `--help` | Prikazuje informacije o korištenju |

**Adrese usluga (dev):**

| Usluga | Adresa |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (zadano: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (zadano: 10105) |
| Interaktivna API dokumentacija | `localhost:10105/docs` |
| Baza podataka | `localhost:6543` |

Pritisnite `Ctrl+C` za uredno zaustavljanje svih usluga.

---

## End-to-End testovi: `run_e2e.sh`

Playwright suite za frontend izvodi se protiv stvarne Vue aplikacije, FastAPI backenda i izolirane PostgreSQL baze podataka:

```bash
./run_e2e.sh
```

Suite je smoke i regresijski suite ključnih putanja, a ne iscrpna pokrivenost proizvoda. Pokriva autentifikaciju, životni ciklus i izvršavanje osnovnog Workflowa, odabrane dashboard resurse, javne rute i mockani HITL review UI. Integracije s pružateljima usluga, svaki tip nodea, matrice dijeljenja/dopuštenja i potpuno HITL resume izvršavanje ostaju prvenstveno pokriveni backend testovima ili zahtijevaju namjenska integracijska okruženja.

Svako pokretanje dobiva vlastiti privremeni PostgreSQL 16 container, nasumične dostupne portove za bazu/backend/frontend, stanje autentifikacije, rezultate testova i HTML izvještaj. To omogućuje istovremeno pokretanje više `run_e2e.sh` procesa bez dijeljenja stanja ili prepisivanja artefakata. Skripta uklanja svoj container baze podataka kada pokretanje završi te ispisuje direktorij artefakata i putanju izvještaja.

Korisne naredbe:

```bash
./run_e2e.sh --ui         # Interaktivni Playwright runner s izoliranom bazom podataka
cd frontend
bun run test:e2e:report   # Otvara posljednje dovršeno lokalno pokretanje
```

Izravna pokretanja `bun run test:e2e` i `bun run test:e2e:ui` zahtijevaju eksplicitni `DATABASE_URL` kako se ne bi tiho pokrenula protiv lokalne razvojne baze podataka. Koristite `./run_e2e.sh` za uobičajena lokalna pokretanja.

`./check.sh` pokreće lint, typecheck, formatiranje i backend testove bez E2E suitea, održavajući zadanu lokalnu putanju provjere brzom. Pokrenite Playwright E2E testove zasebno s `./run_e2e.sh`. Pull requestovi uvijek pokreću Chromium E2E suite u GitHub Actions i zadržavaju traceove, snimke zaslona, videozapise i HTML izvještaj kada dođe do neuspjeha.

---

## Produkcija: `deploy.sh`

`deploy.sh` gradi i pokreće cijeli stack koristeći Docker Compose. Sve tri usluge — baza podataka, backend i frontend — rade kao containeri. Backend entrypoint automatski pokreće migracije prije pokretanja servera s 8 workera.

**Početni deploy (build + pokretanje):**

```bash
./deploy.sh
```

Ovo izvodi deploy bez zastoja: imagei se prvo grade dok postojeći containeri nastavljaju raditi, a zatim se nova verzija zamjenjuje.

**Dostupne naredbe:**

| Naredba | Opis |
|---------|-------------|
| `./deploy.sh` | Gradi imagee i pokreće/ažurira sve usluge |
| `./deploy.sh --status` | Prikazuje status containera |
| `./deploy.sh --logs` | Prikazuje logs svih containera u stvarnom vremenu |
| `./deploy.sh --restart` | Ponovno pokreće sve containere |
| `./deploy.sh --down` | Zaustavlja i uklanja sve containere |
| `./deploy.sh --migrate-pgdata` | Jednokratna migracija: kopira postojeći direktorij `data/postgres` u Docker volume `heym-postgres-data` i ponovno gradi njegove indekse |
| `./deploy.sh --help` | Prikazuje informacije o korištenju |

**Pohrana baze podataka: Docker named volume, a ne direktorij na hostu.**

Compose pohranjuje PostgreSQL u Docker volume `heym-postgres-data`. Ranije verzije su umjesto toga bind-mountale direktorij hosta `./data/postgres`. Host bind mountovi na macOS-u (virtiofs) i Windows/WSL2 ne daju PostgreSQL-u garancije za `fsync` i zatvaranje datoteka koje zahtijeva: clusteri tamo nailaze na `PANIC: could not close file … Input/output error` na WAL segmentima i s vremenom se korumpiraju. Linux bind mountovi nikada nisu bili pogođeni, ali sve platforme sada koriste isti raspored.

Nadogradnja deploymenta koji još uvijek ima podatke u `./data/postgres` je jednokratni korak. `./deploy.sh` to detektira, zaustavlja se prije builda i traži da prvo izvršite migraciju:

```bash
./deploy.sh --migrate-pgdata   # zaustavi usluge, kopiraj u volume, ponovno izgradi indekse
./deploy.sh                    # deploy kao i obično
```

**Migracija također ponovno gradi indekse.** Kopija je byte-for-byte, pa oštećenje indeksa koje je prouzročio stari bind mount putuje s njom. `--migrate-pgdata` stoga pokreće samo uslugu `postgres` na novom volumeu, izvršava `reindexdb` na njemu i ponovno ga zaustavlja prije nego što se ostatak stacka podigne. To je važno jer ova vrsta korupcije ostavlja unose indeksa koji pokazuju izvan kraja heapa — stanje koje `pg_amcheck` prijavljuje kao ispravno, pa prolazna provjera nije dokaz zdrave tablice. REINDEX popravlja te unose; ne može vratiti heap stranice koje je stari datotečni sustav već izgubio. Na velikoj, poznato zdravoj bazi podataka možete zaobići ponovnu izgradnju s `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopiranje je nedestruktivno. `./data/postgres` ostaje na mjestu kao sigurnosna kopija, a migracija odbija prepisati volume koji već sadrži bazu podataka. Ako bilo koji korak ne uspije, novi volume se uklanja, tako da se djelomično migrirani cluster nikada ne može greškom deployati. Izbrišite stari direktorij nakon što potvrdite da su vaši workflowi netaknuti. Container `postgres` nosi istu zaštitu, tako da ni ručni `docker compose up` ne može tiho inicijalizirati praznu bazu podataka preko vaših podataka. Svježe instalacije ne zahtijevaju nikakvu radnju.

**Adrese usluga (produkcija):**

Frontend container je izložen na `FRONTEND_PORT` (zadano: 4017). Backend API se poslužuje pod putanjom `/api`, proksiran kroz frontend container — tako da u produkciji postoji samo jedan javno dostupan port.

**Pregled containera:**

| Container | Opis |
|-----------|-------------|
| `heym-db` | Relacijska baza podataka |
| `heym-backend` | FastAPI API server (8 workera, izgrađen iz `backend/Dockerfile`) |
| `heym-frontend` | Frontend preview container koji poslužuje izgrađenu Vue aplikaciju (izgrađen iz `frontend/Dockerfile`) |

**Značka za ažuriranje verzije:**

Zaglavlje aplikacije prikazuje verziju pokrenutog Docker builda. Kada je ta verzija starija od najnovijeg Heym GitHub izdanja, ljubičasta značka **Update** pojavljuje se pokraj verzije. Kliknite na verziju ili značku za otvaranje stranice Heym GitHub izdanja.

---

## Prethodno izgrađena slika: `docker run`

Ako ne želite lokalno izgrađivati aplikaciju, možete povući objavljenu sliku kontejnera i pokrenuti je izravno.

Slika pokreće frontend i backend zajedno u jednom kontejneru. PostgreSQL je i dalje vanjski, ali možete navesti ili `DATABASE_URL` ili varijable `POSTGRES_*` iz `.env.example`.

> **Pohranite svoju bazu podataka u Docker imenovanom volumenu.** Izdana slika ne sadrži bazu podataka, pa je PostgreSQL iza `DATABASE_URL` vaš za pokretanje. Montirajte ga kao `-v heym-postgres-data:/var/lib/postgresql/data`, a ne kao putanju na hostu: na macOS-u (virtiofs) i Windows/WSL2 bind-montirani direktorij podataka PostgreSQL-a ne poštuje `fsync` jamstva koja baza zahtijeva i s vremenom korumpira cluster.

> **Pozadinski sustav vektorske pohrane.** `run.sh` i `deploy.sh` pokreću službenu sliku `postgres:16` i automatski instaliraju paket `postgresql-16-pgvector` pri pokretanju, tako da **Postgres (pgvector) RAG pozadinski sustav** tamo radi odmah bez izmjena vaših podataka. Međutim, prethodno izgrađena slika s jednim kontejnerom povezuje se na PostgreSQL koji **vi** osiguravate — ta baza podataka mora podržavati `vector` ekstenziju za korištenje Postgres pozadinskog sustava. Heym ne može instalirati pgvector u bazu podataka kojom ne upravlja. Bez toga, migracija pri pokretanju graciozno preskače pgvector tablicu — implementacija i dalje uspijeva, Qdrant RAG nastavlja raditi, a stvaranje ili prijenos u Postgres vektorsku pohranu vraća jasnu poruku "backend unavailable" dok se pgvector ne omogući.

**Sami postavite ključeve za izravna pokretanja slike.** Za razliku od `run.sh`/`deploy.sh`, prethodno izgrađena slika ne generira ključeve automatski. Nakon `cp .env.example .env`, popunite dva prazna ključa (zamjena na mjestu izbjegava duplicirane unose):

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

> **Neka montaže datoteka i dodataka budu apsolutne.** `FILE_STORAGE_DIR` i `HEYM_PLUGINS_DIR` prema zadanim postavkama koriste relativne putanje `./data/files` i `data/plugins`, a izdana slika pokreće backend iz `/app/backend`. Ako ostanu relativne, razrješavaju se u `/app/backend/data/files` i `/app/backend/data/plugins`, pa dvije bind montaže iznad ne primaju ništa i prijenosi se gube kada se kontejner zamijeni. Zastavice `-e` nadjačavaju relativne vrijednosti koje `.env.example` dostavlja putem `--env-file`, jer `-e` iz naredbenog retka pobjeđuje nad `--env-file`. Compose (`./deploy.sh`) to ne treba: ta slika pokreće backend iz `/app`, gdje relativne zadane vrijednosti već završavaju na montažama.

> **Pristup Docker socketu.** Montiranje `/var/run/docker.sock` daje backendu široku kontrolu nad Docker daemonom hosta. Zadana Docker Compose usluga i primjer izravnog `docker run` uključuju ga za Docker-based MCP stdio alate koji pokreću `docker` naredbe. Kartica Logs i dalje zahtijeva `DOCKER_LOGS_ENABLED=true` i `DOCKER_LOGS_ALLOWED_EMAILS` s popisom e-adresa pouzdanih korisnika odvojenih zarezom. Izradite pouzdani admin račun prije omogućavanja Docker logova ili zadržite `ALLOW_REGISTER=false`, kako nepotvrđena samostalna registracija ne bi mogla preuzeti e-adresu s popisa dopuštenih. Korisnički definirani Python alati **ne** dobivaju ovaj socket: pokreću se u zasebnom očvrsnutom kontejneru bez Docker socketa. Pogledajte [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex čvor koristi istu sliku `ghcr.io/heymrun/heym` kao srodni runner kontejner (`--entrypoint codex`) kako bi Codexov Linux sandbox mogao stvarati namespaceove. Zadržite montažu volumena `heym-codex-workspaces` ako želite Codex Workflowe u postavi izravne slike; runner ne prima Docker socket ni tajne backend-a.

> **OpenCode Go runner.** OpenCode Go čvor koristi istu sliku kao očvrsnuti srodni runner (`--entrypoint opencode`) koji dijeli `heym-opencode-workspaces`. Zadržite tu montažu volumena ako želite OpenCode Workflowe u postavi izravne slike; runner ne prima Docker socket ni GitHub token.

> **Skill sandbox.** Python skillovi na Agent čvoru pokreću se u očvrsnutom srodnom kontejneru koji dijeli volumen `heym-codex-workspaces`, pa zadržite tu montažu volumena i za skillove — ne samo za Codex. Svako pokretanje dobiva izoliranu podputanju po pokretanju, a srodni kontejner ne prima ni Docker socket ni tajne backend-a. To zahtijeva **Docker Engine 25.0+**; na starijim engineima ili bez volumena, `HEYM_PYTHON_TOOL_SANDBOX=auto` ne uspijeva sigurno — postavite `HEYM_PYTHON_TOOL_SANDBOX=subprocess` samo za pouzdane jednokorisničke postave. Pogledajte [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` je potreban za Playwright.** Docker daje kontejneru 64 MB `/dev/shm` i Chromium ruši svoj renderer pod tim ograničenjem. Playwright čvorovi temeljeni na koracima pokreću Chromium kao podproces unutar ovog kontejnera, pa je ograničenje ono ovog kontejnera; prilagođeni `playwrightCode` pokreće se u srodnom kontejneru koji postavlja vlastito. `docker-compose.yml` već deklarira `shm_size: "2gb"`, pa `run.sh` i `deploy.sh` nisu pogođeni — samo obični `docker run` treba ovu zastavicu.

> **Playwright Run Code.** Prilagođeni Playwright Python zahtijeva `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` i gore navedenu montažu Docker socketa. Izdana slika postavlja `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` za GHCR raspored (`/app/backend/.venv`). Compose `./deploy.sh` postavlja zadanu sandbox sliku na `heym-backend:local`. Zadržite `--no-sandbox` u argumentima pokretanja Chromiuma unutar sandbox kontejnera.

**Minimalne varijable okoline za izravna pokretanja slike:**

| Varijabla | Obavezno | Svrha |
|----------|----------|---------|
| `DATABASE_URL` | Neobavezno | Potpuno nadjačavanje PostgreSQL connection stringa |
| `POSTGRES_HOST` | Da, ako je `DATABASE_URL` prazan | PostgreSQL host |
| `POSTGRES_PORT` | Da, ako je `DATABASE_URL` prazan | PostgreSQL port |
| `POSTGRES_USER` | Da, ako je `DATABASE_URL` prazan | PostgreSQL korisničko ime |
| `POSTGRES_PASSWORD` | Da, ako je `DATABASE_URL` prazan | PostgreSQL lozinka |
| `POSTGRES_DB` | Da, ako je `DATABASE_URL` prazan | Naziv PostgreSQL baze podataka |
| `SECRET_KEY` | Da | Tajna za potpisivanje JWT-a |
| `ENCRYPTION_KEY` | Da | Ključ za šifriranje vjerodajnica |
| `FRONTEND_URL` | Preporučeno | Javni URL preglednika, posebno za OAuth povratne pozive |
| `CORS_ORIGINS` | Preporučeno | Dopuštena podrijetla preglednika |
| `FILE_STORAGE_DIR` | Preporučeno | Postavite na apsolutni `/app/data/files` kada montirate tu putanju; relativna zadana vrijednost `./data/files` razrješava se pod `/app/backend` u ovoj slici i promašuje montažu |
| `ALLOW_REGISTER` | Preporučeno | Postavite `false` u produkciji osim ako je otvorena registracija namjeravana, ali tek nakon što vaš admin račun postoji — nema bootstrapa prvog korisnika |
| `DOCKER_LOGS_ENABLED` | Neobavezno | Postavite `true` kako bi kartica Logs mogla koristiti pristup Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obavezno kada je `DOCKER_LOGS_ENABLED=true` | Popis e-adresa pouzdanih korisnika odvojenih zarezom kojima je dopušten pristup Docker logovima |
| `HEYM_PLUGINS_ENABLED` | Neobavezno | Postavite `true` za omogućavanje podsustava dodataka (prilagođeni čvorovi instalirani kao zip). Prema zadanim postavkama isključeno |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obavezno kada je `HEYM_PLUGINS_ENABLED=true` | Popis e-adresa operatora odvojenih zarezom kojima je dopušteno instaliranje/deinstaliranje dodataka |
| `HEYM_PLUGINS_DIR` | Neobavezno | Gdje se pohranjuju datoteke dodataka. Postavite na apsolutni `/app/data/plugins` kada montirate tu putanju; relativna zadana vrijednost `data/plugins` razrješava se pod `/app/backend` u ovoj slici i promašuje montažu |
| `HEYM_PYTHON_TOOL_SANDBOX` | Neobavezno | Način izolacije Python alata; zadano je `auto` (očvrsnuti Docker sandbox, ne uspijeva sigurno). Pogledajte [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Neobavezno | Nadjačajte sandbox sliku Python alata; prazno = automatsko prepoznavanje slike backend-a |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Neobavezno | Docker volumen koji koriste srodni Codex runner kontejneri; zadano je `heym-codex-workspaces` u Docker implementacijama |
| `HEYM_CODEX_NETWORK_ACCESS` | Neobavezno | Dopustite Codexovim sandbox naredbama preuzimanje datoteka/ovisnosti; Docker implementacije to omogućuju prema zadanim postavkama |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Neobavezno | Docker volumen koji koriste srodni OpenCode runner kontejneri; zadano je `heym-opencode-workspaces` u Docker implementacijama |

**Napomene:**

- Slika izlaže port `4017`
- Backend ostaje interni i proxyjan je pod `/api`
- Kada je `POSTGRES_HOST=localhost`, izdana slika automatski ga prepisuje u `host.docker.internal` kada je potrebno, tako da isti `.env` radi s PostgreSQL kontejnerom na razini hosta na macOS Docker/Desktop alatima
- Zadržite montažu `data/files` ako želite da Drive prijenosi i datoteke koje generiraju skillovi prežive ponovna pokretanja kontejnera
- **Dodaci:** za njihovo omogućavanje postavite `HEYM_PLUGINS_ENABLED=true` i `HEYM_PLUGIN_ADMIN_EMAILS` te montirajte `data/plugins` kako bi instalirane datoteke dodataka preživjele ponovno stvaranje kontejnera. Metapodaci dodataka žive u vašem PostgreSQL-u, pa i oni preživljavaju. Deklarirane pip `dependencies` dodatka instaliraju se u kontejner u trenutku instalacije; budući da je datotečni sustav slike efemeran, one se **automatski ponovno instaliraju pri pokretanju** za svaki instalirani dodatak (`uv` venv izdane slike je zapisiv, pa to radi i u slici s jednim kontejnerom)

### Premještanje postojeće baze podataka u imenovani volumen

`./deploy.sh --migrate-pgdata` zna samo za Compose stack. Ako pokrećete izdanu sliku protiv vlastitog PostgreSQL kontejnera i taj kontejner bind-montira direktorij hosta, migrirajte ga sami.

Prvo provjerite što vaš kontejner baze podataka koristi:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Ako `"Type"` pokazuje `bind`, premjestite ga u imenovani volumen:

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

**Koristite vlastitu sliku u koracima 2 i 3, ne `postgres:16`.** Ako vaša baza podataka pokreće `pgvector/pgvector:pg16` ili drugu varijantu, pokretanje kopiranog clustera sa standardnom slikom može ne uspjeti jer nedostaju biblioteke ekstenzija koje očekuje.

Vaš izvorni direktorij podataka ovim postupkom ostaje netaknut, pa ostaje vaš put za povratak. Izbrišite ga tek nakon što potvrdite da migrirana baza podataka služi vašim Workflowima. Korak 4 je važan iz istog razloga kao i u Compose migraciji: kopija nosi sa sobom svako postojeće oštećenje indeksa.

---

## Pokretanje više od jedne instance

Sve navedeno iznad postavlja jednu Heym instancu. Kada jedno računalo više nije dovoljno, usmjerite drugu instancu na istu PostgreSQL bazu podataka i ona se pridružuje kao worker: pozadinski procesi — cron, webhookovi, MCP pozivi alata, chat triggeri — zatim se raspoređuju između instanci prema postotku koji postavljate pod **Settings → Instances**.

Instance nikada ne komuniciraju međusobno. Postgres prenosi posao, tako da worker ne treba otvoren port niti rutu natrag prema glavnoj instanci, a nikakav message broker nije uključen. Posao koji dotiče lokalni disk — Drive datoteke, radni prostori coding-agenta, instalirani plugins — uvijek se izvršava na glavnoj instanci, tako da ništa ne mora biti dijeljeno putem datotečnog sustava.

Dva pravila koja cluster ne može umjesto Vas provesti: svaka instanca mora koristiti isti `SECRET_KEY` i `ENCRYPTION_KEY`, a ingress mora pokazivati isključivo na glavnu instancu. Oba su objašnjena, zajedno s pravilima raspoređivanja i načinom odabira postotaka, u [Load Distribution](../reference/cluster.md).

> Ovo je raspodjela opterećenja, a ne visoka dostupnost. Glavna instanca ostaje jedinstvena točka kvara za ingress, pohranu datoteka i editor.

## Uobičajeni Workflows

**Prvo postavljanje:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Za prebuilt `docker run` image, prvo ručno generirajte ključeve (pogledajte odjeljak **Prebuilt Image** iznad).

**Ažuriranje produkcije nakon promjene koda:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Provjera produkcijskih logova:**

```bash
./deploy.sh --logs
```

**Zaustavljanje produkcijskih servisa:**

```bash
./deploy.sh --down
```

---

## Povezano

- [Uvod](./introduction.md) – Pregled platforme
- [Brzi početak](./quick-start.md) – Izradite svoj prvi Workflow
- [Varijable okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Potpuna referenca konfiguracije
- [Sigurnost](../reference/security.md) – JWT, enkripcija i CORS postavke
- [Raspodjela opterećenja](../reference/cluster.md) – Pokrenite nekoliko instanci prema jednoj bazi podataka

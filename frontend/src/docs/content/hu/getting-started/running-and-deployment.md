# Futtatás és telepítés

A Heym két szkriptet biztosít a különböző környezetekhez: a `run.sh` a helyi fejlesztéshez, a `deploy.sh` pedig a Docker Compose-t használó éles telepítésekhez.

> **Videós bemutató:** [A Heym helyi beállítása 2 perc alatt](https://www.youtube.com/watch?v=P6YvlupUboU) — klónozza a repository-t, indítsa el a PostgreSQL-t, töltse ki a szükséges környezeti változókat, és hozza létre első fiókját egy helyi példányon.

## Előfeltételek

Mindkét szkripthez az alábbi eszközök telepítése szükséges:

| Eszköz | Rendeltetés |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Adatbázis konténer (fejlesztés) és teljes stack (éles) |
| [uv](https://github.com/astral-sh/uv) | Python csomagkezelő a backendhez |
| [bun](https://bun.sh) | JavaScript runtime a frontendhez |

## Környezet beállítása

A `run.sh` és a `deploy.sh` egyaránt a projekt gyökérkönyvtárában található `.env` fájlból olvas. Ha az nem létezik, a szkript automatikusan létrehoz egyet a `.env.example` alapján — mind a helyi fejlesztés, mind az éles környezet esetében.

A `SECRET_KEY` és az `ENCRYPTION_KEY` üresen szerepel a `.env.example` fájlban. Ha bármelyik üres, a `run.sh` és a `deploy.sh` automatikusan kriptográfiailag erős értéket generál, és visszaírja azt a `.env` fájlba, így egy friss beállítás nem igényel manuális kulcskezelést. Ha egy meglévő `.env` még mindig tartalmazza a régi `ENCRYPTION_KEY` helyőrzőt (`change_this_to_a_random_32_byte_hex_value`), a szkriptek explicit hibával leállnak a felülírás helyett — e kulcs rotálása ugyanis olvashatatlanná tenné a korábban titkosított hitelesítő adatokat. Maga a backend szintén megtagadja az indulást, ha bármelyik kulcs üres, vagy egy ismert helyőrzőn maradt.

A fájl manuális létrehozásához (opcionális — a szkriptek ezt Ön helyett elvégzik):

```bash
cp .env.example .env
```

Fontosabb környezeti változók:

Az összes támogatott változóhoz, alapértékhez és éles környezeti megjegyzéshez lásd a [Környezeti változók](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) dokumentumot.

| Változó | Leírás |
|----------|-------------|
| `SECRET_KEY` | **Kötelező.** JWT aláírási titok. A `run.sh`/`deploy.sh` automatikusan generálja, ha üres. |
| `ENCRYPTION_KEY` | **Kötelező.** Hitelesítő adatok titkosítási kulcsa. A `run.sh`/`deploy.sh` automatikusan generálja, ha üres. |
| `DATABASE_URL` | Opcionális adatbázis-kapcsolati sztring felülírás. Ha üres, a Heym a `POSTGRES_*` beállításokból építi fel. |
| `BACKEND_PORT` | Backend API port — alapértéke `10105` |
| `FRONTEND_PORT` | Frontend port — alapértéke `4017` |
| `FRONTEND_URL` | **Éles környezetben kötelező.** Az alkalmazás nyilvános URL-je (séma + host, pl. `https://heym.example.com`). Az OAuth átirányítási URI-khoz (Google Sheets, BigQuery, Notion és hasonlók), valamint a háttérben futó folyamatok által kiállított review-, Codex follow-up- és fájlhivatkozásokhoz használatos; meg kell egyeznie a felhasználók által a böngészőben használt URL-lel. Cluster esetén minden példányon ugyanazt az értéket állítsa be. |
| `ALLOW_REGISTER` | Nyitott felhasználói regisztráció (`false` élesben, `true` fejlesztésben). Csak azután állítsa `false`-ra, hogy az admin fiókja létezik — nincs első felhasználói bootstrap, így egy üres adatbázis és a letiltott regisztráció együtt nem hagy módot a létrehozásra. |
| `DOCKER_LOGS_ENABLED` | `true` érték esetén engedélyezi a Docker-alapú Logs fül elérését; Docker socket hozzáférést is igényel |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Vesszővel elválasztott lista a megbízható felhasználói e-mail címekről, amelyek `DOCKER_LOGS_ENABLED=true` esetén hozzáférhetnek a Docker logokhoz |
| `REQUEST_BODY_MAX_SIZE_MB` | Az endpoint kezelők futása előtt elfogadott maximális HTTP kérés törzs méret; alapértéke `100`, egy MB-tal a `FILE_MAX_SIZE_MB` felett, hogy maradjon hely a multipart overhead számára |
| `HEYM_PYTHON_TOOL_SANDBOX` | A felhasználó által definiált Python eszközök futtatási módja: `auto` (alapértelmezett — megerősített, izolált Docker konténer; fail closed, ha a Docker nem elérhető), `docker` (ugyanaz, soha nem esik vissza), vagy `subprocess` (folyamaton belüli helyi visszaesés; nem biztonsági határvonal, csak megbízható/fejlesztési környezethez). A `run.sh` a `subprocess` értéket állítja be natív fejlesztéshez. Lásd: [Biztonság](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | A Python eszköz Docker sandboxhoz használt image. Üres = a futó backend image automatikus felismerése. |

Az adatbázis-kapcsolat alapértékei (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) a [Környezeti változók](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) és a `.env.example` dokumentumokban találhatók.

---
## Fejlesztés: `run.sh`

A `run.sh` egyetlen paranccsal elindítja mindhárom szolgáltatást helyben — az adatbázist (Docker konténerként), a FastAPI backendet és a Vite dev szervert.

```bash
./run.sh
```

**Lépésről lépésre, mit tesz:**

1. Ellenőrzi, hogy a `docker`, `bun` és `uv` elérhető-e
2. Létrehozza a `.env` fájlt a `.env.example` alapján, ha hiányzik, és véletlenszerű `SECRET_KEY` és `ENCRYPTION_KEY` értékeket generál, ha azok üresek
3. Elindít (vagy létrehoz) egy adatbázis Docker konténert a `6543` porton, amelynek adatait a `heym-postgres-data` Docker volume-ban tárolja a host könyvtár helyett
4. Telepíti a Python függőségeket a `uv sync` segítségével
5. Lefuttatja az Alembic adatbázis migrációkat (`alembic upgrade head`)
6. Felszabadítja a backend és frontend portokat, ha azok foglaltak
7. Elindítja a FastAPI backendet `--reload` kapcsolóval (hot-reload kódváltozások esetén)
8. Telepíti a frontend függőségeket a `bun install` segítségével
9. Elindítja a Vite dev szervert

**Opciók:**

| Kapcsoló | Leírás |
|------|-------------|
| *(nincs)* | Indítás debug naplózással (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Indítás alapértelmezett naplózási szinttel (debug kimenet nélkül) |
| `--help` | Használati információk megjelenítése |

**Szolgáltatás címek (dev):**

| Szolgáltatás | Cím |
|---------|---------|
| Frontend | `localhost` a `FRONTEND_PORT`-on (alapértelmezett: 4017) |
| Backend API | `localhost` a `BACKEND_PORT`-on (alapértelmezett: 10105) |
| Interaktív API Docs | `localhost:10105/docs` |
| Adatbázis | `localhost:6543` |

Nyomja meg a `Ctrl+C` kombinációt az összes szolgáltatás szabályos leállításához.

---

## Végponttól végpontig tesztek: `run_e2e.sh`

A frontend Playwright tesztcsomag a valódi Vue alkalmazás, a FastAPI backend és egy izolált PostgreSQL adatbázis ellen fut:

```bash
./run_e2e.sh
```

A tesztcsomag egy kulcsfontosságú útvonalak smoke és regressziós tesztcsomag, nem teljes terméklefedettség. Lefedi az autentikációt, az alapvető workflow életciklust és végrehajtást, a kiválasztott dashboard erőforrásokat, a nyilvános útvonalakat és egy mockolt HITL review felületet. A szolgáltatói integrációk, az összes csomóponttípus, a megosztási/jogosultsági mátrixok és a teljes HITL resume végrehajtás továbbra is elsősorban backend tesztekkel fedettek, vagy dedikált integrációs környezeteket igényelnek.

Minden futás saját ideiglenes PostgreSQL 16 konténert, véletlenszerű elérhető adatbázis/backend/frontend portokat, autentikációs állapotot, teszteredményeket és HTML riportot kap. Ez lehetővé teszi, hogy több `run_e2e.sh` folyamat párhuzamosan fusson anélkül, hogy állapotot osztana meg vagy felülírná az artifactokat. A szkript eltávolítja az adatbázis konténerét, amikor a futás befejeződik, és kiírja az artifact könyvtárat és a riport útvonalát.

Hasznos parancsok:

```bash
./run_e2e.sh --ui         # Interaktív Playwright futtató izolált adatbázissal
cd frontend
bun run test:e2e:report   # A legutóbb befejezett helyi futás megnyitása
```

A közvetlen `bun run test:e2e` és `bun run test:e2e:ui` futtatásokhoz explicit `DATABASE_URL` szükséges, hogy ne indulhassanak el csendben a helyi fejlesztési adatbázis ellen. Normál helyi futtatásokhoz használja a `./run_e2e.sh` szkriptet.

A `./check.sh` lint, typecheck, formázás és backend teszteket futtat az E2E tesztcsomag nélkül, így az alapértelmezett helyi ellenőrzési útvonal gyors marad. A Playwright E2E teszteket külön futtassa a `./run_e2e.sh` segítségével. A pull requestek mindig futtatják a Chromium E2E tesztcsomagot a GitHub Actions-ben, és megtartják a trace-eket, képernyőképeket, videókat és a HTML riportot, amikor hibák fordulnak elő.

---
## Éles környezet: `deploy.sh`

A `deploy.sh` a Docker Compose segítségével építi fel és indítja el a teljes stacket. Mindhárom szolgáltatás — az adatbázis, a backend és a frontend — konténerként fut. A backend belépési pontja automatikusan lefuttatja a migrációkat, mielőtt elindítaná a szervert 8 workerrel.

**Első telepítés (build + indítás):**

```bash
./deploy.sh
```

Ez egy nulla leállású telepítést hajt végre: a image-ek először felépülnek, miközben a meglévő konténerek tovább futnak, majd az új verzió kerül be.

**Elérhető parancsok:**

| Parancs | Leírás |
|---------|-------------|
| `./deploy.sh` | Image-ek felépítése és az összes szolgáltatás indítása/frissítése |
| `./deploy.sh --status` | A konténerek állapotának megjelenítése |
| `./deploy.sh --logs` | Az összes konténer naplóinak streamelése |
| `./deploy.sh --restart` | Az összes konténer újraindítása |
| `./deploy.sh --down` | Az összes konténer leállítása és eltávolítása |
| `./deploy.sh --migrate-pgdata` | Egyszeri migráció: egy meglévő `data/postgres` könyvtár átmásolása a `heym-postgres-data` Docker volume-ba, és az indexek újraépítése |
| `./deploy.sh --help` | Használati információk megjelenítése |

**Adatbázis-tárolás: Docker named volume, nem host könyvtár.**

A Compose a PostgreSQL-t a `heym-postgres-data` Docker volume-ban tárolja. A korábbi verziók ehelyett a `./data/postgres` host könyvtárat bind-mountolták. A macOS (virtiofs) és Windows/WSL2 rendszereken a host bind mountok nem biztosítják a PostgreSQL számára szükséges `fsync` és fájlbézárási garanciákat: az ott lévő klaszterek a WAL szegmenseken `PANIC: could not close file … Input/output error` hibát kapnak, és idővel megsérülnek. A Linux bind mountokat ez soha nem érintette, de mostantól minden platform ugyanazt az elrendezést használja.

Egy olyan telepítés frissítése, amelynek adatai még a `./data/postgres` könyvtárban vannak, egyszeri lépést igényel. A `./deploy.sh` észleli ezt, leáll a build előtt, és arra kéri Önt, hogy először migráljon:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**A migráció az indexeket is újraépíti.** A másolat bájtpontos, így a régi bind mount által okozott indexkárosodás is átkerül vele. A `--migrate-pgdata` ezért egyedül indítja el a `postgres` szolgáltatást az új volume-on, lefuttatja rajta a `reindexdb` parancsot, majd ismét leállítja, mielőtt a stack többi része elindulna. Ez azért fontos, mert ez a fajta sérülés olyan indexbejegyzéseket hagy maga után, amelyek a heap végén túlra mutatnak — ezt az állapotot a `pg_amcheck` tisztaként jelenti, így egy sikeres ellenőrzés nem bizonyíték az egészséges táblára. A REINDEX helyreállítja ezeket a bejegyzéseket; nem tudja visszaállítani azokat a heap oldalakat, amelyeket a régi fájlrendszer már elveszített. Egy nagy, ismerten egészséges adatbázis esetén az újraépítést a `./deploy.sh --migrate-pgdata --skip-reindex` paranccsal hagyhatja ki.

A másolás nem destruktív. A `./data/postgres` helyben marad biztonsági másolatként, és a migráció megtagadja egy olyan volume felülírását, amely már tartalmaz adatbázist. Ha bármelyik lépés meghiúsul, az új volume eltávolításra kerül, így egy félig migrált klaszter soha nem telepíthető véletlenül. Törölje a régi könyvtárat, miután meggyőződött arról, hogy a workflow-k sértetlenek. A `postgres` konténer ugyanezt a védelmet tartalmazza, így egy manuális `docker compose up` sem inicializálhat csendben egy üres adatbázist az adatai fölé. A friss telepítéseknél nincs szükség semmilyen műveletre.

**Szolgáltatáscímek (éles környezet):**

A frontend konténer a `FRONTEND_PORT` porton érhető el (alapértelmezett: 4017). A backend API a `/api` útvonal alatt érhető el, a frontend konténeren keresztül proxyzva — így éles környezetben csak egy nyilvános port van.

**Konténer-áttekintés:**

| Konténer | Leírás |
|-----------|-------------|
| `heym-db` | Relációs adatbázis |
| `heym-backend` | FastAPI API szerver (8 worker, a `backend/Dockerfile` alapján felépítve) |
| `heym-frontend` | Frontend preview konténer, amely a felépített Vue alkalmazást szolgálja ki (a `frontend/Dockerfile` alapján felépítve) |

**Verziófrissítés jelvény:**

Az alkalmazás fejléce mutatja a futó Docker build verzióját. Amikor ez a verzió elmarad a legújabb Heym GitHub kiadástól, egy lila **Update** jelvény jelenik meg a verzió mellett. Kattintson a verzióra vagy a jelvényre a Heym GitHub kiadások oldalának megnyitásához.

---
## Előre elkészített Image: `docker run`

Ha nem szeretné helyben felépíteni az alkalmazást, letöltheti a közzétett konténer image-et, és közvetlenül futtathatja.

Az image egyetlen konténerben indítja el a frontendet és a backendet együtt. A PostgreSQL továbbra is külső, de megadhatja a `DATABASE_URL` változót vagy a `.env.example` fájlból származó `POSTGRES_*` változókat.

> **Tárolja az adatbázist Docker named volume-ban.** A kiadási image nem tartalmaz adatbázist, így a `DATABASE_URL` mögötti PostgreSQL futtatása az Ön feladata. Csatolja `-v heym-postgres-data:/var/lib/postgresql/data` formában, ne host elérési útvonalként: macOS (virtiofs) és Windows/WSL2 esetén a bind-mountolt PostgreSQL adatkönyvtár nem tartja be az adatbázis által megkövetelt `fsync` garanciákat, és idővel korrumpálja a cluster-t.

> **Vector store backend.** A `run.sh` és a `deploy.sh` a hivatalos `postgres:16` image-et futtatja, és induláskor automatikusan telepíti a `postgresql-16-pgvector` csomagot, így a **Postgres (pgvector) RAG backend** ott azonnal működik, az adatok módosítása nélkül. Az előre elkészített egykonténeres image azonban egy **Ön** által biztosított PostgreSQL-hez csatlakozik — ennek az adatbázisnak támogatnia kell a `vector` kiterjesztést a Postgres backend használatához. A Heym nem tud pgvector-t telepíteni egy olyan adatbázisba, amelyet nem ő kezel. Enélkül az indulási migráció kecsesen kihagyja a pgvector táblát — a deploy továbbra is sikeres lesz, a Qdrant RAG tovább működik, és a Postgres vector store létrehozása vagy feltöltése egyértelmű "backend unavailable" üzenetet ad, amíg a pgvector nincs engedélyezve.

**Állítsa be a kulcsokat saját maga a közvetlen image futtatásokhoz.** A `run.sh`/`deploy.sh` fájlokkal ellentétben az előre elkészített image nem generál kulcsokat automatikusan. A `cp .env.example .env` után töltse fel a két üres kulcsot (a helyben történő csere elkerüli a duplikált bejegyzéseket):

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

> **Tegye abszolúttá a fájl- és plugin-mountokat.** A `FILE_STORAGE_DIR` és a `HEYM_PLUGINS_DIR` alapértelmezés szerint a relatív `./data/files` és `data/plugins` útvonalakat használja, a kiadási image pedig a `/app/backend` könyvtárból indítja a backendet. Relatívként hagyva ezek a `/app/backend/data/files` és `/app/backend/data/plugins` útvonalakra oldódnak fel, így a fenti két bind mount semmit nem kap, és a feltöltések elvesznek, amikor a konténert lecserélik. A `-e` kapcsolók felülírják a `.env.example` által a `--env-file`-on keresztül biztosított relatív értékeket, mert a parancssori `-e` elsőbbséget élvez a `--env-file`-lal szemben. A Compose (`./deploy.sh`) esetében erre nincs szükség: az az image a `/app` könyvtárból futtatja a backendet, ahol a relatív alapértékek már a mountokra esnek.

> **Docker socket hozzáférés.** A `/var/run/docker.sock` csatolása széles körű ellenőrzést ad a backendnek a host Docker daemon felett. Az alapértelmezett Docker Compose szolgáltatás és a közvetlen `docker run` példa is tartalmazza ezt a Docker-alapú MCP stdio eszközökhöz, amelyek `docker` parancsokat futtatnak. A Logs fül továbbra is megköveteli a `DOCKER_LOGS_ENABLED=true` és a `DOCKER_LOGS_ALLOWED_EMAILS` beállítást, amely a megbízható felhasználói e-mail címek vesszővel elválasztott listáját tartalmazza. Hozza létre a megbízható admin fiókot a Docker logs engedélyezése előtt, vagy tartsa a `ALLOW_REGISTER=false` értéket, hogy egy nem ellenőrzött önregisztráció ne tudjon igénybe venni egy engedélyezett e-mail címet. A felhasználó által definiált Python eszközök **nem** kapják meg ezt a socketet: ezek egy külön megerősített konténerben futnak, Docker socket nélkül. Lásd: [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** A Codex csomópont ugyanazt a `ghcr.io/heymrun/heym` image-et használja testvér runner konténerként (`--entrypoint codex`), hogy a Codex Linux sandboxja névtereket hozhasson létre. Tartsa meg a `heym-codex-workspaces` volume mountot, ha Codex workflow-kat szeretne a közvetlen image beállításban; a runner nem kapja meg a Docker socketet vagy a backend titkokat.

> **OpenCode Go runner.** Az OpenCode Go csomópont ugyanazt az image-et használja megerősített testvér runnerként (`--entrypoint opencode`), osztva a `heym-opencode-workspaces` kötetet. Tartsa meg ezt a volume mountot, ha OpenCode workflow-kat szeretne a közvetlen image beállításban; a runner nem kapja meg a Docker socketet vagy a GitHub tokent.

> **Skill sandbox.** Az Agent csomóponton futó Python skillek egy megerősített testvér konténerben futnak, amely osztja a `heym-codex-workspaces` kötetet, így tartsa meg ezt a volume mountot a skillekhez is — nem csak a Codexhez. Minden futás egy izolált, futásonkénti alútvonalat kap, és a testvér sem a Docker socketet, sem a backend titkokat nem kapja meg. Ehhez **Docker Engine 25.0+** szükséges; régebbi engine-eken, vagy a kötet nélkül a `HEYM_PYTHON_TOOL_SANDBOX=auto` fail-closed módon viselkedik — állítsa be a `HEYM_PYTHON_TOOL_SANDBOX=subprocess` értéket csak megbízható egyfelhasználós beállításokhoz. Lásd: [Security](../reference/security.md#skill-sandbox).
> **A `--shm-size 2g` szükséges a Playwright számára.** A Docker 64 MB-ot ad a konténernek a `/dev/shm` számára, és a Chromium renderelője összeomlik ez alatt. A lépésalapú Playwright csomópontok a Chromiumot alfolyamatként futtatják ezen a konténeren belül, így a korlát ennek a konténernek a korlátja; az egyedi `playwrightCode` egy testvérkonténerben fut, amely saját maga állítja be a korlátot. A `docker-compose.yml` már deklarálja a `shm_size: "2gb"` értéket, így a `run.sh` és a `deploy.sh` érintetlen — csak egy egyszerű `docker run` igényli a kapcsolót.

> **Playwright Run Code.** Az egyedi Playwright Pythonhoz `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` és a fenti Docker socket csatolás szükséges. A kiadási image beállítja a `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` értékeket a GHCR elrendezéshez (`/app/backend/.venv`). A Compose `./deploy.sh` alapértelmezés szerint a sandbox image-et `heym-backend:local` értékre állítja. Tartsa meg a `--no-sandbox` kapcsolót a Chromium indítási argumentumai között a sandbox konténereken belül.

**Minimális környezeti változók közvetlen image futtatásokhoz:**

| Változó | Kötelező | Cél |
|----------|----------|---------|
| `DATABASE_URL` | Opcionális | Teljes PostgreSQL kapcsolati string felülírása |
| `POSTGRES_HOST` | Igen, ha a `DATABASE_URL` üres | PostgreSQL host |
| `POSTGRES_PORT` | Igen, ha a `DATABASE_URL` üres | PostgreSQL port |
| `POSTGRES_USER` | Igen, ha a `DATABASE_URL` üres | PostgreSQL felhasználónév |
| `POSTGRES_PASSWORD` | Igen, ha a `DATABASE_URL` üres | PostgreSQL jelszó |
| `POSTGRES_DB` | Igen, ha a `DATABASE_URL` üres | PostgreSQL adatbázis neve |
| `SECRET_KEY` | Igen | JWT aláírási titok |
| `ENCRYPTION_KEY` | Igen | Hitelesítő adatok titkosítási kulcsa |
| `FRONTEND_URL` | Ajánlott | Nyilvános böngésző URL, különösen OAuth visszahívásokhoz |
| `CORS_ORIGINS` | Ajánlott | Engedélyezett böngésző origin-ek |
| `FILE_STORAGE_DIR` | Ajánlott | Állítsa abszolút `/app/data/files` értékre, amikor azt az útvonalat csatolja; a relatív `./data/files` alapértelmezés ebben az image-ben a `/app/backend` alatt oldódik fel, és elkerüli a csatolást |
| `ALLOW_REGISTER` | Ajánlott | Állítsa `false` értékre éles környezetben, kivéve ha nyílt regisztrációt szeretne, de csak akkor, ha az admin fiókja már létezik — nincs első felhasználói bootstrap |
| `DOCKER_LOGS_ENABLED` | Opcionális | Állítsa `true` értékre, hogy a Logs fül használhassa a Docker socket hozzáférést |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Kötelező, ha `DOCKER_LOGS_ENABLED=true` | Vesszővel elválasztott lista a megbízható felhasználói e-mailekről, akik hozzáférhetnek a Docker logokhoz |
| `HEYM_PLUGINS_ENABLED` | Opcionális | Állítsa `true` értékre a plugin alrendszer engedélyezéséhez (zip-ként telepített egyedi csomópontok). Alapértelmezés szerint kikapcsolva |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Kötelező, ha `HEYM_PLUGINS_ENABLED=true` | Vesszővel elválasztott operátor e-mailek, akik telepíthetik/eltávolíthatják a pluginokat |
| `HEYM_PLUGINS_DIR` | Opcionális | A plugin fájlok tárolási helye. Állítsa abszolút `/app/data/plugins` értékre, amikor azt az útvonalat csatolja; a relatív `data/plugins` alapértelmezés ebben az image-ben a `/app/backend` alatt oldódik fel, és elkerüli a csatolást |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcionális | Python eszköz izolációs mód; alapértelmezés szerint `auto` (megerősített Docker sandbox, fail closed). Lásd: [Biztonság](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcionális | A Python eszköz sandbox image felülírása; üres = a backend image automatikus felismerése |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcionális | A testvér Codex futtató konténerek által használt Docker volume; Docker telepítéseknél alapértelmezés szerint `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcionális | Engedélyezi a Codex sandboxolt parancsainak fájlok/függőségek letöltését; a Docker telepítések alapértelmezés szerint engedélyezik |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcionális | A testvér OpenCode futtató konténerek által használt Docker volume; Docker telepítéseknél alapértelmezés szerint `heym-opencode-workspaces` |

**Megjegyzések:**

- Az image a `4017` portot teszi elérhetővé
- A backend belső marad, és a `/api` alatt van proxyzva
- Amikor a `POSTGRES_HOST=localhost`, a kiadási image automatikusan átírja `host.docker.internal` értékre, amikor szükséges, így ugyanaz a `.env` működik egy host szintű PostgreSQL konténerrel macOS Docker/Desktop eszközökön
- Tartsa meg a `data/files` csatolást, ha szeretné, hogy a Drive feltöltések és a skill által generált fájlok túléljék a konténer újraindításokat
- **Pluginok:** engedélyezésükhöz állítsa be a `HEYM_PLUGINS_ENABLED=true` és `HEYM_PLUGIN_ADMIN_EMAILS` értékeket, és csatolja a `data/plugins` könyvtárat, hogy a telepített plugin fájlok megmaradjanak a konténer újralétrehozásai során. A plugin metaadatok a PostgreSQL-ben élnek, így azok is megmaradnak. A plugin által deklarált pip `dependencies` a telepítés során a konténerbe kerülnek; mivel az image fájlrendszere efemer, ezek **automatikusan újratelepítésre kerülnek indításkor** minden telepített plugin esetében (a kiadási image `uv` venv-je írható, így ez az egykonténeres image-ben is működik)

### Meglévő adatbázis áthelyezése nevesített volume-ba

A `./deploy.sh --migrate-pgdata` csak a Compose stack-ről tud. Ha a kiadási image-et a saját PostgreSQL konténerével futtatja, és az a konténer egy host könyvtárat bind-mountol, akkor saját maga végezze el az áttelepítést.

Először ellenőrizze, mit használ az adatbázis konténere:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Ha a `"Type"` értéke `bind`, helyezze át egy nevesített volume-ba:

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

**A 2. és 3. lépésben a saját image-ét használja, ne a `postgres:16`-ot.** Ha az adatbázisa `pgvector/pgvector:pg16` vagy más változatot futtat, a másolt cluster elindítása a szabványos image-dzsel meghiúsulhat, mert hiányoznak a várt extension könyvtárak.

Az eredeti adatkönyvtárát ez az eljárás nem érinti, így az marad a visszaállítási útvonala. Csak akkor törölje, miután meggyőződött arról, hogy a migrált adatbázis kiszolgálja a workflow-it. A 4. lépés ugyanazon okból fontos, mint a Compose migráció esetében: a másolat magával hordozza a meglévő indexkárosodásokat.

---

## Több példány futtatása

A fentiek egyetlen Heym példányt telepítenek. Amikor egy gép már nem elegendő, irányítson egy második példányt ugyanarra a PostgreSQL adatbázisra, és az workerként csatlakozik: a háttérben futó folyamatok — cron, webhookok, MCP tool hívások, chat triggerek — ezután a példányok között oszlanak meg egy Ön által a **Settings → Instances** alatt beállított százalékos arány szerint.

A példányok soha nem kommunikálnak egymással. A Postgres végzi a munkát, így a workernek nincs szüksége nyitott portra és a fő példány felé vezető útvonalra, és nem vesz részt üzenetközvetítő sem. A helyi lemezt érintő munka — Drive fájlok, coding-agent munkaterületek, telepített pluginok — mindig a fő példányon fut, így semmit nem kell fájlrendszeren keresztül megosztani.

Két szabály, amelyet a cluster nem tud Ön helyett érvényesíteni: minden példánynak ugyanazt a `SECRET_KEY` és `ENCRYPTION_KEY` értéket kell használnia, és az ingressnek kizárólag a fő példányra kell mutatnia. Mindkettőt — az elhelyezési szabályokkal és a százalékos arányok kiválasztásának módjával együtt — a [Load Distribution](../reference/cluster.md) című rész ismerteti.

> Ez terheléselosztás, nem magas rendelkezésre állás. A fő példány továbbra is egyszeres hibaforrás marad az ingress, a fájltárolás és a szerkesztő számára.

## Gyakori workflow-k

**Első beállítás:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Az előre elkészített `docker run` image esetében először manuálisan generálja a kulcsokat (lásd a fenti **Prebuilt Image** részt).

**Production frissítése kódváltozás után:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Production naplók ellenőrzése:**

```bash
./deploy.sh --logs
```

**Production szolgáltatások leállítása:**

```bash
./deploy.sh --down
```

---

## Kapcsolódó

- [Introduction](./introduction.md) – Platform overview
- [Quick Start](./quick-start.md) – Build your first workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Full configuration reference
- [Security](../reference/security.md) – JWT, encryption, and CORS settings
- [Load Distribution](../reference/cluster.md) – Run several instances against one database

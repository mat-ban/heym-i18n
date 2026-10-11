# Execució i desplegament

Heym proporciona dos scripts per a entorns diferents: `run.sh` per al desenvolupament local i `deploy.sh` per a desplegaments de producció mitjançant Docker Compose.

> **Vídeo explicatiu:** [Configureu Heym localment en menys de 2 minuts](https://www.youtube.com/watch?v=P6YvlupUboU) — cloneu el repositori, inicieu PostgreSQL, ompliu les variables d'entorn necessàries i creeu el vostre primer compte en una instància local.

## Requisits previs

Tots dos scripts requereixen que les eines següents estiguin instal·lades:

| Eina | Propòsit |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Contenidor de base de dades (dev) i pila completa (prod) |
| [uv](https://github.com/astral-sh/uv) | Gestor de paquets de Python per al backend |
| [bun](https://bun.sh) | Entorn d'execució de JavaScript per al frontend |

## Configuració de l'entorn

Tant `run.sh` com `deploy.sh` llegeixen d'un fitxer `.env` a l'arrel del projecte. Si no existeix, l'script en crea un automàticament a partir de `.env.example` — tant per al desenvolupament local com per a producció.

`SECRET_KEY` i `ENCRYPTION_KEY` s'inclouen buides a `.env.example`. Quan qualsevol de les dues està buida, `run.sh` i `deploy.sh` generen automàticament un valor criptogràficament fort i l'escriuen de tornada a `.env`, de manera que una configuració nova no requereix cap gestió manual de claus. Si un `.env` existent encara conté el marcador de posició llegat `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), els scripts s'aturen amb un error explícit en lloc de sobreescriure'l — rotar aquesta clau faria que les credencials xifrades prèviament fossin il·legibles. El propi backend també es nega a iniciar-se si qualsevol de les claus està buida o es deixa en un marcador de posició conegut.

Per crear el fitxer manualment (opcional — els scripts ho fan per vosaltres):

```bash
cp .env.example .env
```

Variables d'entorn principals:

Per a cada variable compatible, valor per defecte i nota de producció, consulteu [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Descripció |
|----------|-------------|
| `SECRET_KEY` | **Obligatòria.** Secret de signatura JWT. Generada automàticament per `run.sh`/`deploy.sh` quan està buida. |
| `ENCRYPTION_KEY` | **Obligatòria.** Clau de xifrat de credencials. Generada automàticament per `run.sh`/`deploy.sh` quan està buida. |
| `DATABASE_URL` | Cadena de connexió a la base de dades opcional que substitueix la predeterminada. Si està buida, Heym la construeix a partir de la configuració `POSTGRES_*`. |
| `BACKEND_PORT` | Port de l'API del backend — per defecte `10105` |
| `FRONTEND_PORT` | Port del frontend — per defecte `4017` |
| `FRONTEND_URL` | **Obligatòria en producció.** URL pública de l'aplicació (esquema + amfitrió, p. ex. `https://heym.example.com`). S'utilitza per als URI de redirecció d'OAuth (Google Sheets, BigQuery, Notion i similars) i per als enllaços de revisió, seguiment de Codex i fitxers que generen les execucions en segon pla; ha de coincidir amb l'URL que els usuaris utilitzen al navegador. En un clúster, establiu el mateix valor a cada instància. |
| `ALLOW_REGISTER` | Registre d'usuaris obert (`false` en prod, `true` en dev). Canvieu-lo a `false` només després que existeixi el vostre compte d'administrador — no hi ha cap inicialització del primer usuari, de manera que una base de dades buida amb el registre desactivat no deixa cap manera de crear-ne un. |
| `DOCKER_LOGS_ENABLED` | Habilita l'accés a la pestanya Logs basada en Docker quan s'estableix a `true`; també requereix accés al sòcol de Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Llista separada per comes de correus electrònics d'usuaris de confiança autoritzats a accedir als logs de Docker quan `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Mida màxima del cos de la sol·licitud HTTP acceptada abans que s'executin els gestors d'endpoint; per defecte `100`, un MB per sobre de `FILE_MAX_SIZE_MB` per deixar marge per a la sobrecàrrega de multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Com s'executen les eines de Python definides per l'usuari: `auto` (per defecte — contenidor Docker aïllat i endurit; falla de manera segura si Docker no està disponible), `docker` (el mateix, mai fa fallback), o `subprocess` (fallback local en procés; no és una frontera de seguretat, només per a entorns de confiança/dev). `run.sh` estableix `subprocess` per al desenvolupament natiu. Vegeu [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Imatge utilitzada per a la sandbox Docker de l'eina de Python. Buida = detecció automàtica de la imatge del backend en execució. |

Els valors per defecte de connexió a la base de dades (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) estan documentats a [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) i `.env.example`.

---
## Desenvolupament: `run.sh`

`run.sh` inicia els tres serveis localment — la base de dades (com a contenidor Docker), el backend FastAPI i el servidor de desenvolupament Vite — amb una sola comanda.

```bash
./run.sh
```

**Què fa, pas a pas:**

1. Comprova que `docker`, `bun` i `uv` estiguin disponibles
2. Crea `.env` a partir de `.env.example` si no existeix, i genera un `SECRET_KEY` i una `ENCRYPTION_KEY` aleatoris quan algun dels dos està buit
3. Inicia (o crea) un contenidor Docker de base de dades al port `6543`, emmagatzemant les seves dades al volum Docker `heym-postgres-data` en lloc d'un directori de l'amfitrió
4. Instal·la les dependències de Python mitjançant `uv sync`
5. Executa les migracions de base de dades d'Alembic (`alembic upgrade head`)
6. Allibera els ports del backend i del frontend si estan ocupats
7. Inicia el backend FastAPI amb `--reload` (recàrrega en calent en canviar el codi)
8. Instal·la les dependències del frontend mitjançant `bun install`
9. Inicia el servidor de desenvolupament Vite

**Opcions:**

| Flag | Descripció |
|------|-------------|
| *(cap)* | Inicia amb el registre de depuració activat (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Inicia amb el nivell de registre predeterminat (sense sortida de depuració) |
| `--help` | Mostra la informació d'ús |

**Adreces dels serveis (desenvolupament):**

| Servei | Adreça |
|---------|---------|
| Frontend | `localhost` a `FRONTEND_PORT` (per defecte: 4017) |
| Backend API | `localhost` a `BACKEND_PORT` (per defecte: 10105) |
| Documentació interactiva de l'API | `localhost:10105/docs` |
| Base de dades | `localhost:6543` |

Premeu `Ctrl+C` per aturar tots els serveis de manera ordenada.

---

## Proves d'extrem a extrem: `run_e2e.sh`

La suite Playwright del frontend s'executa contra l'aplicació Vue real, el backend FastAPI i una base de dades PostgreSQL aïllada:

```bash
./run_e2e.sh
```

La suite és una suite de fum i regressió de camins clau, no una cobertura exhaustiva del producte. Cobreix l'autenticació, el cicle de vida i l'execució dels Workflows principals, recursos seleccionats del tauler de control, rutes públiques i una interfície de revisió HITL simulada. Les integracions de proveïdors, tots els tipus de Node, les matrius de compartició/permisos i l'execució completa de represa HITL continuen cobertes principalment per proves de backend o requereixen entorns d'integració dedicats.

Cada execució obté el seu propi contenidor temporal de PostgreSQL 16, ports aleatoris disponibles de base de dades/backend/frontend, estat d'autenticació, resultats de proves i informe HTML. Això permet que diversos processos `run_e2e.sh` s'executin simultàniament sense compartir estat ni sobreescriure artefactes. L'script elimina el seu contenidor de base de dades quan finalitza l'execució i mostra el directori d'artefactes i la ruta de l'informe.

Comandes útils:

```bash
./run_e2e.sh --ui         # Executor interactiu de Playwright amb una base de dades aïllada
cd frontend
bun run test:e2e:report   # Obre l'execució local completada més recentment
```

Les execucions directes de `bun run test:e2e` i `bun run test:e2e:ui` requereixen una `DATABASE_URL` explícita perquè no puguin iniciar-se silenciosament contra la base de dades de desenvolupament local. Utilitzeu `./run_e2e.sh` per a les execucions locals normals.

`./check.sh` executa lint, comprovació de tipus, formatatge i proves de backend sense la suite E2E, mantenint ràpid el camí de comprovació local predeterminat. Executeu les proves E2E de Playwright per separat amb `./run_e2e.sh`. Les sol·licituds d'extracció sempre executen la suite E2E de Chromium a GitHub Actions i conserven traces, captures de pantalla, vídeos i l'informe HTML quan es produeixen errors.

---
## Producció: `deploy.sh`

`deploy.sh` construeix i executa la pila completa mitjançant Docker Compose. Els tres serveis — la base de dades, el backend i el frontend — s'executen com a contenidors. El punt d'entrada del backend executa automàticament les migracions abans d'iniciar el servidor amb 8 workers.

**Desplegament inicial (construcció + inici):**

```bash
./deploy.sh
```

Això realitza un desplegament sense temps d'inactivitat: primer es construeixen les imatges mentre els contenidors existents continuen en execució, i després es substitueix la versió nova.

**Ordres disponibles:**

| Ordre | Descripció |
|---------|-------------|
| `./deploy.sh` | Construeix les imatges i inicia/actualitza tots els serveis |
| `./deploy.sh --status` | Mostra l'estat dels contenidors |
| `./deploy.sh --logs` | Transmet els logs de tots els contenidors |
| `./deploy.sh --restart` | Reinicia tots els contenidors |
| `./deploy.sh --down` | Atura i elimina tots els contenidors |
| `./deploy.sh --migrate-pgdata` | Migració única: copia un directori `data/postgres` existent al volum Docker `heym-postgres-data` i reconstrueix els seus índexs |
| `./deploy.sh --help` | Mostra la informació d'ús |

**Emmagatzematge de la base de dades: un volum amb nom de Docker, no un directori de l'amfitrió.**

Compose emmagatzema PostgreSQL al volum Docker `heym-postgres-data`. Les versions anteriors muntaven el directori de l'amfitrió `./data/postgres` mitjançant bind mount. Els bind mounts de l'amfitrió a macOS (virtiofs) i Windows/WSL2 no proporcionen a PostgreSQL les garanties de `fsync` i de tancament de fitxers que requereix: els clústers en aquests entorns pateixen `PANIC: could not close file … Input/output error` en segments WAL i es corrompen amb el temps. Els bind mounts de Linux mai s'han vist afectats, però ara totes les plataformes utilitzen la mateixa disposició.

Actualitzar un desplegament que encara té dades a `./data/postgres` és un pas únic. `./deploy.sh` ho detecta, s'atura abans de construir i us demana que migreu primer:

```bash
./deploy.sh --migrate-pgdata   # atura els serveis, copia al volum, reconstrueix els índexs
./deploy.sh                    # desplega com de costum
```

**La migració també reconstrueix els índexs.** La còpia és byte a byte, de manera que el dany als índexs causat pel vell bind mount viatja amb ella. Per tant, `--migrate-pgdata` inicia el servei `postgres` tot sol al volum nou, executa `reindexdb` contra ell i l'atura de nou abans que la resta de la pila s'aixequi. Això és important perquè aquesta classe de corrupció deixa entrades d'índex apuntant més enllà del final del heap — un estat que `pg_amcheck` informa com a net, de manera que una comprovació que passa no és evidència d'una taula saludable. REINDEX repara aquestes entrades; no pot restaurar pàgines del heap que el sistema de fitxers antic ja ha perdut. En una base de dades gran i de salut coneguda, podeu ometre la reconstrucció amb `./deploy.sh --migrate-pgdata --skip-reindex`.

La còpia no és destructiva. `./data/postgres` es manté al seu lloc com a còpia de seguretat, i la migració es nega a sobreescriure un volum que ja conté una base de dades. Si qualsevol pas falla, el volum nou s'elimina, de manera que un clúster migrat a mitges mai es pot desplegar per error. Suprimiu el directori antic un cop hàgiu confirmat que els vostres workflows estan intactes. El contenidor `postgres` porta la mateixa protecció, de manera que un `docker compose up` manual tampoc no pot inicialitzar silenciosament una base de dades buida sobre les vostres dades. Les instal·lacions noves no requereixen cap acció.

**Adreces dels serveis (producció):**

El contenidor del frontend s'exposa a `FRONTEND_PORT` (per defecte: 4017). L'API del backend se serveix sota el camí `/api`, amb proxy a través del contenidor del frontend — de manera que només hi ha un port d'accés públic en producció.

**Visió general dels contenidors:**

| Contenidor | Descripció |
|-----------|-------------|
| `heym-db` | Base de dades relacional |
| `heym-backend` | Servidor API FastAPI (8 workers, construït a partir de `backend/Dockerfile`) |
| `heym-frontend` | Contenidor de previsualització del frontend que serveix l'aplicació Vue construïda (construït a partir de `frontend/Dockerfile`) |

**Insígnia d'actualització de versió:**

La capçalera de l'aplicació mostra la versió de la build de Docker en execució. Quan aquesta versió està per darrere de l'última release de Heym a GitHub, apareix una insígnia porpra **Update** al costat de la versió. Feu clic a la versió o a la insígnia per obrir la pàgina de releases de Heym a GitHub.

---
## Imatge precompilada: `docker run`

Si preferiu no compilar l'aplicació localment, podeu descarregar la imatge de contenidor publicada i executar-la directament.

La imatge inicia el frontend i el backend junts en un sol contenidor. PostgreSQL continua sent extern, però podeu proporcionar tant `DATABASE_URL` com les variables `POSTGRES_*` de `.env.example`.

> **Emmagatzemeu la base de dades en un volum amb nom de Docker.** La imatge de la versió no inclou cap base de dades, de manera que el PostgreSQL que hi ha darrere de `DATABASE_URL` és responsabilitat vostra d'executar. Munteu-lo com a `-v heym-postgres-data:/var/lib/postgresql/data` en lloc d'una ruta de l'amfitrió: a macOS (virtiofs) i Windows/WSL2, un directori de dades de PostgreSQL muntat per bind no respecta les garanties d'`fsync` que requereix la base de dades i corromp el clúster amb el temps.

> **Backend de magatzem vectorial.** `run.sh` i `deploy.sh` executen la imatge oficial `postgres:16` i instal·len automàticament el paquet `postgresql-16-pgvector` a l'inici, de manera que el **backend RAG de Postgres (pgvector)** funciona directament allà sense cap canvi a les vostres dades. La imatge precompilada d'un sol contenidor, però, es connecta a un PostgreSQL que **vosaltres** proporcioneu — aquesta base de dades ha de suportar l'extensió `vector` per utilitzar el backend de Postgres. Heym no pot instal·lar pgvector en una base de dades que no gestiona. Sense això, la migració d'inici omet la taula de pgvector de manera elegant — el desplegament encara té èxit, el RAG de Qdrant continua funcionant, i crear o pujar a un magatzem vectorial de Postgres retorna un missatge clar de "backend no disponible" fins que s'habiliti pgvector.

**Configureu les claus vosaltres mateixos per a execucions directes de la imatge.** A diferència de `run.sh`/`deploy.sh`, la imatge precompilada no genera claus automàticament. Després de `cp .env.example .env`, ompliu les dues claus buides (substituir in situ evita entrades duplicades):

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

> **Feu absoluts els muntatges de fitxers i connectors.** `FILE_STORAGE_DIR` i `HEYM_PLUGINS_DIR` tenen com a valors predeterminats les rutes relatives `./data/files` i `data/plugins`, i la imatge de la versió inicia el backend des de `/app/backend`. Si es deixen relatives, es resolen a `/app/backend/data/files` i `/app/backend/data/plugins`, de manera que els dos muntatges bind anteriors no reben res i les pujades es perden quan es reemplaça el contenidor. Els indicadors `-e` anul·len els valors relatius que `.env.example` proporciona mitjançant `--env-file`, perquè `-e` de la línia de comandes té prioritat sobre `--env-file`. Compose (`./deploy.sh`) no necessita això: aquesta imatge executa el backend des de `/app`, on els valors predeterminats relatius ja coincideixen amb els muntatges.

> **Accés al sòcol de Docker.** Muntar `/var/run/docker.sock` atorga al backend un control ampli sobre el dimoni Docker de l'amfitrió. El servei Docker Compose predeterminat i l'exemple directe de `docker run` l'inclouen per a les eines MCP stdio basades en Docker que executen comandes `docker`. La pestanya Logs encara requereix `DOCKER_LOGS_ENABLED=true` i `DOCKER_LOGS_ALLOWED_EMAILS` amb una llista separada per comes d'adreces electròniques d'usuaris de confiança. Creeu el compte d'administrador de confiança abans d'habilitar els logs de Docker, o manteniu `ALLOW_REGISTER=false`, perquè un autoregistre no verificat no pugui reclamar una adreça electrònica de la llista permesa. Les eines Python definides per l'usuari **no** obtenen aquest sòcol: s'executen en un contenidor endurit separat sense sòcol de Docker. Vegeu [Seguretat](../reference/security.md#python-tool-sandbox).

> **Execuctor de Codex.** El Node de Codex utilitza la mateixa imatge `ghcr.io/heymrun/heym` com a contenidor executor germà (`--entrypoint codex`) perquè la sandbox de Linux de Codex pugui crear espais de noms. Manteniu el muntatge del volum `heym-codex-workspaces` si voleu Workflows de Codex en la configuració directa de la imatge; l'executor no rep el sòcol de Docker ni els secrets del backend.

> **Execuctor d'OpenCode Go.** El Node d'OpenCode Go utilitza la mateixa imatge com a executor germà endurit (`--entrypoint opencode`) compartint `heym-opencode-workspaces`. Manteniu aquest muntatge de volum si voleu Workflows d'OpenCode en la configuració directa de la imatge; l'executor no rep el sòcol de Docker ni el Token de GitHub.

> **Sandbox d'habilitats.** Les habilitats de Python al Node d'Agent s'executen en un contenidor germà endurit que comparteix el volum `heym-codex-workspaces`, de manera que manteniu aquest muntatge de volum també per a les habilitats — no només per a Codex. Cada execució obté una subruta aïllada per execució, i el germà no rep ni el sòcol de Docker ni els secrets del backend. Això requereix **Docker Engine 25.0+**; en motors més antics, o sense el volum, `HEYM_PYTHON_TOOL_SANDBOX=auto` falla de manera segura — configureu `HEYM_PYTHON_TOOL_SANDBOX=subprocess` només per a configuracions d'un sol usuari de confiança. Vegeu [Seguretat](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` és obligatori per a Playwright.** Docker assigna a un contenidor 64 MB de `/dev/shm` i Chromium fa fallar el seu renderitzador per sota d'aquest límit. Els Nodes de Playwright basats en passos executen Chromium com a subprocés dins d'aquest contenidor, de manera que el límit és el d'aquest contenidor; el `playwrightCode` personalitzat s'executa en un contenidor germà que estableix el seu propi. El `docker-compose.yml` ja declara `shm_size: "2gb"`, així que `run.sh` i `deploy.sh` no es veuen afectats — només un `docker run` simple necessita el flag.

> **Playwright Run Code.** El Playwright Python personalitzat necessita `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` i el muntatge del socket de Docker esmentat més amunt. La imatge de release estableix `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` per a la disposició de GHCR (`/app/backend/.venv`). El `./deploy.sh` de Compose estableix per defecte la imatge de la sandbox a `heym-backend:local`. Mantingueu `--no-sandbox` als arguments d'inici de Chromium dins dels contenidors de sandbox.

**Variables d'entorn mínimes per a execucions directes de la imatge:**

| Variable | Obligatòria | Propòsit |
|----------|----------|---------|
| `DATABASE_URL` | Opcional | Anul·lació completa de la cadena de connexió de PostgreSQL |
| `POSTGRES_HOST` | Sí, si `DATABASE_URL` és buit | Host de PostgreSQL |
| `POSTGRES_PORT` | Sí, si `DATABASE_URL` és buit | Port de PostgreSQL |
| `POSTGRES_USER` | Sí, si `DATABASE_URL` és buit | Nom d'usuari de PostgreSQL |
| `POSTGRES_PASSWORD` | Sí, si `DATABASE_URL` és buit | Contrasenya de PostgreSQL |
| `POSTGRES_DB` | Sí, si `DATABASE_URL` és buit | Nom de la base de dades de PostgreSQL |
| `SECRET_KEY` | Sí | Secret de signatura de JWT |
| `ENCRYPTION_KEY` | Sí | Clau de xifrat de credencials |
| `FRONTEND_URL` | Recomanada | URL pública del navegador, especialment per a les devolucions de crida d'OAuth |
| `CORS_ORIGINS` | Recomanada | Orígens de navegador permesos |
| `FILE_STORAGE_DIR` | Recomanada | Establiu-la a un `/app/data/files` absolut quan munteu aquest camí; el valor per defecte relatiu `./data/files` es resol sota `/app/backend` en aquesta imatge i no troba el muntatge |
| `ALLOW_REGISTER` | Recomanada | Establiu-la a `false` en producció tret que es pretengui el registre obert, però només un cop existeixi el vostre compte d'administrador — no hi ha cap inicialització del primer usuari |
| `DOCKER_LOGS_ENABLED` | Opcional | Establiu-la a `true` per permetre que la pestanya Logs utilitzi l'accés al socket de Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Obligatòria quan `DOCKER_LOGS_ENABLED=true` | Llista separada per comes d'adreces electròniques d'usuaris de confiança autoritzats a accedir als logs de Docker |
| `HEYM_PLUGINS_ENABLED` | Opcional | Establiu-la a `true` per habilitar el subsistema de connectors (Nodes personalitzats instal·lats com a zip). Desactivada per defecte |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Obligatòria quan `HEYM_PLUGINS_ENABLED=true` | Llista separada per comes d'adreces electròniques d'operadors autoritzats a instal·lar/desinstal·lar connectors |
| `HEYM_PLUGINS_DIR` | Opcional | On s'emmagatzemen els fitxers dels connectors. Establiu-la a un `/app/data/plugins` absolut quan munteu aquest camí; el valor per defecte relatiu `data/plugins` es resol sota `/app/backend` en aquesta imatge i no troba el muntatge |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcional | Mode d'aïllament de l'eina Python; per defecte `auto` (sandbox de Docker endurit, fail closed). Vegeu [Seguretat](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcional | Anul·la la imatge de la sandbox de l'eina Python; buit = detecció automàtica de la imatge del backend |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcional | Volum de Docker utilitzat pels contenidors germans d'execució de Codex; per defecte `heym-codex-workspaces` en desplegaments de Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcional | Permet que les ordres en sandbox de Codex descarreguin fitxers/dependències; els desplegaments de Docker ho habiliten per defecte |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcional | Volum de Docker utilitzat pels contenidors germans d'execució d'OpenCode; per defecte `heym-opencode-workspaces` en desplegaments de Docker |

**Notes:**

- La imatge exposa el port `4017`
- El backend roman intern i es proxia sota `/api`
- Quan `POSTGRES_HOST=localhost`, la imatge de release el reescriu automàticament a `host.docker.internal` quan cal perquè el mateix `.env` funcioni amb un contenidor PostgreSQL a nivell d'host en eines Docker/Desktop de macOS
- Mantingueu el muntatge `data/files` si voleu que les càrregues a Drive i els fitxers generats per skills sobrevisquin als reinicis del contenidor
- **Connectors:** per habilitar-los, establiu `HEYM_PLUGINS_ENABLED=true` i `HEYM_PLUGIN_ADMIN_EMAILS`, i munteu `data/plugins` perquè els fitxers dels connectors instal·lats persisteixin entre recreacions del contenidor. Les metadades dels connectors viuen al vostre PostgreSQL, de manera que també persisteixen. Les `dependencies` de pip declarades per un connector s'instal·len al contenidor en el moment de la instal·lació; com que el sistema de fitxers de la imatge és efímer, es **reinstal·len automàticament a l'inici** per a cada connector instal·lat (el venv `uv` de la imatge de release és editable, així que això també funciona en la imatge d'un sol contenidor)

### Traslladar una base de dades existent a un volum amb nom

`./deploy.sh --migrate-pgdata` només coneix la pila de Compose. Si executeu la imatge de release contra el vostre propi contenidor PostgreSQL i aquest contenidor fa un bind-mount d'un directori de l'host, traslladeu-lo vosaltres mateixos.

Comproveu primer què utilitza el vostre contenidor de base de dades:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Si `"Type"` mostra `bind`, moveu-lo a un volum amb nom:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
```
#    nom del volum si aquest amfitrió Docker executa més d'un desplegament de Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Torneu a iniciar PostgreSQL sobre el volum, reutilitzant els paràmetres que teníeu abans
#    però substituint el bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Un cop accepti connexions, reconstruïu els índexs.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Utilitzeu la vostra pròpia imatge als passos 2 i 3, no `postgres:16`.** Si la vostra base de dades executa `pgvector/pgvector:pg16` o una altra variant, iniciar el clúster copiat amb la imatge estàndard pot fallar perquè hi manquen les biblioteques d'extensions que espera.

El vostre directori de dades original queda intacte amb aquest procediment, de manera que es manté com a via de reversió. Suprimiu-lo només després de confirmar que la base de dades migrada dona servei als vostres workflows. El pas 4 és important pel mateix motiu que en la migració amb Compose: la còpia arrossega qualsevol dany d'índex existent.

---

## Executar més d'una instància

Tot l'anterior desplega una única instància de Heym. Quan una sola màquina ja no
és suficient, apunteu una segona instància a la mateixa base de dades PostgreSQL i
s'unirà com a worker: les execucions en segon pla — cron, webhooks, crides a eines
MCP, triggers de xat — es reparteixen llavors entre les instàncies segons un
percentatge que definiu a **Settings → Instances**.

Les instàncies no es comuniquen mai entre elles. Postgres transporta la feina, de
manera que un worker no necessita cap port obert ni cap ruta de tornada a la
instància principal, i no hi intervé cap broker de missatges. La feina que toca
el disc local — fitxers de Drive, espais de treball d'agents de codi, connectors
instal·lats — sempre s'executa a la instància principal, així que no cal
compartir res per sistema de fitxers.

Dues regles que el clúster no pot aplicar per vosaltres: cada instància ha
d'utilitzar la mateixa `SECRET_KEY` i `ENCRYPTION_KEY`, i l'ingress ha d'apuntar
només a la instància principal. Totes dues s'expliquen, juntament amb les regles
de col·locació i com triar els percentatges, a [Load Distribution](../reference/cluster.md).

> Això és distribució de càrrega, no alta disponibilitat. La instància principal
> continua sent un punt únic de fallada per a l'ingress, l'emmagatzematge de
> fitxers i l'editor.

## Workflows habituals

**Configuració inicial:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Per a la imatge precompilada de `docker run`, genereu primer les claus manualment (vegeu la secció **Prebuilt Image** més amunt).

**Actualitzar producció després d'un canvi de codi:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Comprovar els registres de producció:**

```bash
./deploy.sh --logs
```

**Aturar els serveis de producció:**

```bash
./deploy.sh --down
```

---

## Relacionat

- [Introduction](./introduction.md) – Visió general de la plataforma
- [Quick Start](./quick-start.md) – Creeu el vostre primer workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referència completa de configuració
- [Security](../reference/security.md) – Configuració de JWT, xifratge i CORS
- [Load Distribution](../reference/cluster.md) – Executeu diverses instàncies contra una sola base de dades

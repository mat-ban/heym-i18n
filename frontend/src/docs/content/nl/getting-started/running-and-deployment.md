# Uitvoeren en Implementatie

Heym biedt twee scripts voor verschillende omgevingen: `run.sh` voor lokale ontwikkeling en `deploy.sh` voor productie-implementaties met Docker Compose.

> **Videodoorloop:** [Heym lokaal instellen in minder dan 2 minuten](https://www.youtube.com/watch?v=P6YvlupUboU) — kloon de repository, start PostgreSQL, vul de vereiste omgevingsvariabelen in en maak uw eerste account aan op een lokale instantie.

## Vereisten

Beide scripts vereisen dat de volgende hulpmiddelen zijn geïnstalleerd:

| Hulpmiddel | Doel |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Databasecontainer (dev) en volledige stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Python-pakketbeheerder voor de backend |
| [bun](https://bun.sh) | JavaScript-runtime voor de frontend |

## Omgevingsconfiguratie

Zowel `run.sh` als `deploy.sh` lezen uit een `.env`-bestand in de projectroot. Als dit niet bestaat, maakt het script automatisch een bestand aan op basis van `.env.example` — voor zowel lokale ontwikkeling als productie.

`SECRET_KEY` en `ENCRYPTION_KEY` worden leeg meegeleverd in `.env.example`. Wanneer een van beide leeg is, genereren `run.sh` en `deploy.sh` automatisch een cryptografisch sterke waarde en schrijven deze terug naar `.env`, zodat een nieuwe installatie geen handmatige sleutelverwerking vereist. Als een bestaand `.env`-bestand nog de verouderde `ENCRYPTION_KEY`-placeholder bevat (`change_this_to_a_random_32_byte_hex_value`), stoppen de scripts met een expliciete fout in plaats van deze te overschrijven — het roteren van die sleutel zou eerder versleutelde inloggegevens onleesbaar maken. De backend zelf weigert ook te starten als een van beide sleutels leeg is of op een bekende placeholder staat.

Om het bestand handmatig aan te maken (optioneel — de scripts doen dit voor u):

```bash
cp .env.example .env
```

Belangrijke omgevingsvariabelen:

Zie [Omgevingsvariabelen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) voor elke ondersteunde variabele, standaardwaarde en productienotitie.

| Variabele | Beschrijving |
|----------|-------------|
| `SECRET_KEY` | **Vereist.** JWT-ondertekeningsgeheim. Automatisch gegenereerd door `run.sh`/`deploy.sh` wanneer leeg. |
| `ENCRYPTION_KEY` | **Vereist.** Versleutelingssleutel voor inloggegevens. Automatisch gegenereerd door `run.sh`/`deploy.sh` wanneer leeg. |
| `DATABASE_URL` | Optionele overschrijving van de databaseverbindingsreeks. Indien leeg, bouwt Heym deze op basis van de `POSTGRES_*`-instellingen. |
| `BACKEND_PORT` | Backend API-poort — standaard `10105` |
| `FRONTEND_PORT` | Frontend-poort — standaard `4017` |
| `FRONTEND_URL` | **Vereist in productie.** Openbare URL van de app (schema + host, bijvoorbeeld `https://heym.example.com`). Wordt gebruikt voor OAuth-redirect-URI's (Google Sheets, BigQuery, Notion en vergelijkbare), en voor de review-, Codex-vervolg- en bestandskoppelingen die achtergronduitvoeringen aanmaken; moet overeenkomen met de URL die gebruikers in de browser gebruiken. Stel in een cluster op elke instantie dezelfde waarde in. |
| `ALLOW_REGISTER` | Open gebruikersregistratie (`false` in prod, `true` in dev). Zet dit alleen op `false` nadat uw beheerdersaccount bestaat — er is geen eerste-gebruiker-bootstrap, dus een lege database plus uitgeschakelde registratie laat geen manier over om er een aan te maken. |
| `DOCKER_LOGS_ENABLED` | Schakelt Docker-ondersteunde toegang tot het tabblad Logs in wanneer ingesteld op `true`; vereist ook toegang tot de Docker-socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Door komma's gescheiden lijst van vertrouwde gebruikers-e-mails die toegang krijgen tot Docker-logs wanneer `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maximale HTTP-aanvraagbodygrootte die wordt geaccepteerd voordat endpoint-handlers worden uitgevoerd; standaard `100`, één MB boven `FILE_MAX_SIZE_MB` om ruimte te laten voor multipart-overhead |
| `HEYM_PYTHON_TOOL_SANDBOX` | Hoe door gebruikers gedefinieerde Python-hulpmiddelen worden uitgevoerd: `auto` (standaard — gehardende, geïsoleerde Docker-container; faalt gesloten als Docker niet beschikbaar is), `docker` (hetzelfde, valt nooit terug), of `subprocess` (in-process lokale terugvaloptie; geen beveiligingsgrens, alleen vertrouwd/dev). `run.sh` stelt `subprocess` in voor native dev. Zie [Beveiliging](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image gebruikt voor de Python-hulpmiddel Docker-sandbox. Leeg = automatisch de actieve backend-image detecteren. |

Standaardwaarden voor databaseverbindingen (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) zijn gedocumenteerd in [Omgevingsvariabelen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) en `.env.example`.

---

## Ontwikkeling: `run.sh`

`run.sh` start alle drie de services lokaal — de database (als een Docker-container), de FastAPI-backend en de Vite dev-server — met één enkel commando.

```bash
./run.sh
```

**Wat het stap voor stap doet:**

1. Controleert of `docker`, `bun` en `uv` beschikbaar zijn
2. Maakt `.env` aan op basis van `.env.example` indien deze ontbreekt, en genereert een willekeurige `SECRET_KEY` en `ENCRYPTION_KEY` wanneer een van beide leeg is
3. Start (of maakt) een database Docker-container op poort `6543`, waarbij de gegevens worden opgeslagen in het Docker-volume `heym-postgres-data` in plaats van een hostmap
4. Installeert Python-afhankelijkheden via `uv sync`
5. Voert Alembic-databasemigraties uit (`alembic upgrade head`)
6. Maakt de backend- en frontend-poorten vrij indien deze bezet zijn
7. Start de FastAPI-backend met `--reload` (hot-reload bij codewijzigingen)
8. Installeert frontend-afhankelijkheden via `bun install`
9. Start de Vite dev-server

**Opties:**

| Flag | Beschrijving |
|------|-------------|
| *(geen)* | Start met debug-logging ingeschakeld (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Start met het standaard logniveau (geen debug-uitvoer) |
| `--help` | Toon gebruiksaanwijzing |

**Service-adressen (dev):**

| Service | Adres |
|---------|---------|
| Frontend | `localhost` op `FRONTEND_PORT` (standaard: 4017) |
| Backend API | `localhost` op `BACKEND_PORT` (standaard: 10105) |
| Interactieve API-documentatie | `localhost:10105/docs` |
| Database | `localhost:6543` |

Druk op `Ctrl+C` om alle services op een correcte manier te stoppen.

---

## End-to-End Tests: `run_e2e.sh`

De frontend Playwright-suite draait tegen de echte Vue-applicatie, de FastAPI-backend en een geïsoleerde PostgreSQL-database:

```bash
./run_e2e.sh
```

De suite is een smoke- en regressiesuite voor de belangrijkste paden, niet een uitputtende productdekking. Deze dekt authenticatie, de kernlevenscyclus en uitvoering van Workflows, geselecteerde dashboardbronnen, openbare routes en een gemockte HITL-review-UI. Provider-integraties, elk knooppunttype, deel- en permissiematrices en volledige HITL-hervattingsuitvoering blijven voornamelijk gedekt door backend-tests of vereisen specifieke integratieomgevingen.

Elke uitvoering krijgt een eigen tijdelijke PostgreSQL 16-container, willekeurige beschikbare database-, backend- en frontend-poorten, authenticatiestatus, testresultaten en HTML-rapport. Hierdoor kunnen meerdere `run_e2e.sh`-processen gelijktijdig draaien zonder status te delen of artefacten te overschrijven. Het script verwijdert de database-container wanneer de uitvoering is voltooid en toont het pad naar de artefactmap en het rapport.

Nuttige commando's:

```bash
./run_e2e.sh --ui         # Interactieve Playwright-runner met een geïsoleerde database
cd frontend
bun run test:e2e:report   # Open de meest recent voltooide lokale uitvoering
```

Directe `bun run test:e2e`- en `bun run test:e2e:ui`-uitvoeringen vereisen een expliciete `DATABASE_URL`, zodat deze niet stilzwijgend tegen de lokale ontwikkeldatabase kunnen starten. Gebruik `./run_e2e.sh` voor normale lokale uitvoeringen.

`./check.sh` voert lint, typecheck, formatting en backend-tests uit zonder de E2E-suite, waardoor het standaard lokale controlepad snel blijft. Voer Playwright E2E-tests afzonderlijk uit met `./run_e2e.sh`. Pull requests draaien altijd de Chromium E2E-suite in GitHub Actions en bewaren traces, screenshots, video's en het HTML-rapport wanneer er fouten optreden.

---

## Productie: `deploy.sh`

`deploy.sh` bouwt en start de volledige stack met behulp van Docker Compose. Alle drie de services — de database, de backend en de frontend — draaien als containers. Het entrypoint van de backend voert automatisch migraties uit voordat de server met 8 workers wordt gestart.

**Eerste deployment (bouwen + starten):**

```bash
./deploy.sh
```

Dit voert een zero-downtime deployment uit: images worden eerst gebouwd terwijl de bestaande containers blijven draaien, waarna de nieuwe versie wordt omgewisseld.

**Beschikbare commando's:**

| Commando | Beschrijving |
|---------|-------------|
| `./deploy.sh` | Images bouwen en alle services starten/bijwerken |
| `./deploy.sh --status` | Containerstatus weergeven |
| `./deploy.sh --logs` | Logs van alle containers streamen |
| `./deploy.sh --restart` | Alle containers herstarten |
| `./deploy.sh --down` | Alle containers stoppen en verwijderen |
| `./deploy.sh --migrate-pgdata` | Eenmalige migratie: een bestaande map `data/postgres` kopiëren naar het Docker-volume `heym-postgres-data` en de indexen opnieuw opbouwen |
| `./deploy.sh --help` | Gebruiksinformatie weergeven |

**Databaseopslag: een Docker named volume, geen hostmap.**

Compose slaat PostgreSQL op in het Docker-volume `heym-postgres-data`. Eerdere versies gebruikten in plaats daarvan een bind mount naar de hostmap `./data/postgres`. Host bind mounts op macOS (virtiofs) en Windows/WSL2 bieden PostgreSQL niet de `fsync`- en file-close-garanties die het vereist: clusters daar krijgen `PANIC: could not close file … Input/output error` op WAL-segmenten en raken na verloop van tijd beschadigd. Linux bind mounts waren nooit getroffen, maar elk platform gebruikt nu dezelfde indeling.

Het upgraden van een deployment die nog data in `./data/postgres` heeft, is een eenmalige stap. `./deploy.sh` detecteert dit, stopt voordat er wordt gebouwd en vraagt u eerst te migreren:

```bash
./deploy.sh --migrate-pgdata   # services stoppen, naar het volume kopiëren, indexen opnieuw opbouwen
./deploy.sh                    # deployen zoals gebruikelijk
```

**De migratie bouwt ook de indexen opnieuw op.** De kopie is byte-for-byte, dus indexschade die de oude bind mount heeft veroorzaakt, reist mee. `--migrate-pgdata` start daarom de `postgres`-service alleen op het nieuwe volume, voert `reindexdb` erop uit en stopt deze weer voordat de rest van de stack wordt gestart. Dit is van belang omdat deze klasse van corruptie indexvermeldingen achterlaat die voorbij het einde van de heap wijzen — een toestand die `pg_amcheck` als schoon rapporteert, waardoor een geslaagde controle geen bewijs is van een gezonde tabel. REINDEX herstelt die vermeldingen; het kan heap-pagina's die het oude bestandssysteem al is kwijtgeraakt niet terugzetten. Op een grote, bekend gezonde database kunt u de herbouw overslaan met `./deploy.sh --migrate-pgdata --skip-reindex`.

De kopie is niet-destructief. `./data/postgres` blijft staan als back-up, en de migratie weigert een volume te overschrijven dat al een database bevat. Als een stap mislukt, wordt het nieuwe volume verwijderd, zodat een half-gemigreerd cluster nooit per ongeluk kan worden gedeployed. Verwijder de oude map zodra u hebt bevestigd dat uw workflows intact zijn. De `postgres`-container heeft dezelfde beveiliging, zodat een handmatige `docker compose up` ook niet stilzwijgend een lege database over uw data kan initialiseren. Verse installaties vereisen geen actie.

**Serviceadressen (productie):**

De frontend-container is beschikbaar op `FRONTEND_PORT` (standaard: 4017). De backend-API wordt aangeboden onder het pad `/api`, geproxied via de frontend-container — er is dus slechts één publiek toegankelijke poort in productie.

**Containeroverzicht:**

| Container | Beschrijving |
|-----------|-------------|
| `heym-db` | Relationele database |
| `heym-backend` | FastAPI API-server (8 workers, gebouwd vanuit `backend/Dockerfile`) |
| `heym-frontend` | Frontend preview-container die de gebouwde Vue-app aanbiedt (gebouwd vanuit `frontend/Dockerfile`) |

**Badge voor versie-update:**

De app-header toont de draaiende Docker build-versie. Wanneer die versie achterloopt op de nieuwste Heym GitHub-release, verschijnt een paarse **Update**-badge naast de versie. Klik op de versie of de badge om de Heym GitHub releases-pagina te openen.

---

## Vooraf gebouwde Image: `docker run`

Als u de app liever niet lokaal bouwt, kunt u de gepubliceerde container-image ophalen en direct uitvoeren.

De image start de frontend en backend samen in één container. PostgreSQL blijft extern, maar u kunt zowel `DATABASE_URL` als de `POSTGRES_*`-variabelen uit `.env.example` opgeven.

> **Bewaar uw database in een Docker named volume.** De release-image bevat geen database, dus de PostgreSQL achter `DATABASE_URL` dient u zelf te draaien. Mount deze als `-v heym-postgres-data:/var/lib/postgresql/data` in plaats van een host-pad: op macOS (virtiofs) en Windows/WSL2 respecteert een bind-mounted PostgreSQL-datamap de `fsync`-garanties die de database vereist niet en raakt het cluster na verloop van tijd beschadigd.

> **Vector store-backend.** `run.sh` en `deploy.sh` draaien de officiële `postgres:16`-image en installeren bij het opstarten automatisch het `postgresql-16-pgvector`-pakket, zodat de **Postgres (pgvector) RAG-backend** daar direct werkt zonder wijziging aan uw data. De vooraf gebouwde single-container image verbindt echter met een PostgreSQL die **u** aanlevert — die database moet de `vector`-extensie ondersteunen om de Postgres-backend te gebruiken. Heym kan pgvector niet installeren in een database die het niet beheert. Zonder deze extensie slaat de opstartmigratie de pgvector-tabel op een nette manier over — de deploy slaagt alsnog, Qdrant RAG blijft werken, en het aanmaken van of uploaden naar een Postgres vector store geeft een duidelijke melding "backend unavailable" totdat pgvector is ingeschakeld.

**Stel de sleutels zelf in voor directe image-runs.** Anders dan bij `run.sh`/`deploy.sh` genereert de vooraf gebouwde image geen sleutels automatisch. Vul na `cp .env.example .env` de twee lege sleutels in (vervangen ter plaatse voorkomt dubbele vermeldingen):

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

> **Maak de file- en plugin-mounts absoluut.** `FILE_STORAGE_DIR` en `HEYM_PLUGINS_DIR` gebruiken standaard de relatieve paden `./data/files` en `data/plugins`, en de release-image start de backend vanuit `/app/backend`. Relatief gelaten verwijzen ze naar `/app/backend/data/files` en `/app/backend/data/plugins`, zodat de twee bind mounts hierboven niets ontvangen en uploads verloren gaan wanneer de container wordt vervangen. De `-e`-flags overschrijven de relatieve waarden die `.env.example` via `--env-file` aanlevert, omdat command-line `-e` voorrang heeft op `--env-file`. Compose (`./deploy.sh`) heeft dit niet nodig: die image draait de backend vanuit `/app`, waar de relatieve standaardwaarden al op de mounts uitkomen.

> **Docker socket-toegang.** Het mounten van `/var/run/docker.sock` geeft de backend ruime controle over de Docker-daemon van de host. De standaard Docker Compose-service en het directe `docker run`-voorbeeld bevatten dit voor Docker-gebaseerde MCP stdio-tools die `docker`-commando's uitvoeren. Het tabblad Logs vereist nog steeds `DOCKER_LOGS_ENABLED=true` en `DOCKER_LOGS_ALLOWED_EMAILS` met een kommagescheiden lijst van vertrouwde e-mailadressen van gebruikers. Maak het vertrouwde admin-account aan voordat u Docker-logs inschakelt, of houd `ALLOW_REGISTER=false`, zodat een niet-geverifieerde zelfregistratie geen e-mailadres van de allowlist kan opeisen. Door de gebruiker gedefinieerde Python-tools krijgen deze socket **niet**: ze draaien in een aparte gehardende container zonder Docker-socket. Zie [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Het Codex-knooppunt gebruikt dezelfde `ghcr.io/heymrun/heym`-image als een zuster-runnercontainer (`--entrypoint codex`), zodat de Linux-sandbox van Codex namespaces kan aanmaken. Behoud de volume-mount `heym-codex-workspaces` als u Codex-workflows wilt in de directe image-opstelling; de runner ontvangt de Docker-socket noch de backend-secrets.

> **OpenCode Go runner.** Het OpenCode Go-knooppunt gebruikt dezelfde image als een gehardende zuster-runner (`--entrypoint opencode`) die `heym-opencode-workspaces` deelt. Behoud die volume-mount als u OpenCode-workflows wilt in de directe image-opstelling; de runner ontvangt de Docker-socket noch het GitHub-token.

> **Skill-sandbox.** Python-skills op het Agent-knooppunt draaien in een gehardende zustercontainer die het volume `heym-codex-workspaces` deelt, dus behoud die volume-mount ook voor skills — niet alleen voor Codex. Elke run krijgt een geïsoleerd subpad per run, en de zustercontainer ontvangt noch de Docker-socket noch backend-secrets. Dit vereist **Docker Engine 25.0+**; op oudere engines, of zonder het volume, faalt `HEYM_PYTHON_TOOL_SANDBOX=auto` gesloten — stel `HEYM_PYTHON_TOOL_SANDBOX=subprocess` alleen in voor vertrouwde single-user-opstellingen. Zie [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` is vereist voor Playwright.** Docker geeft een container 64 MB aan `/dev/shm` en Chromium laat zijn renderer daaronder crashen. Op stappen gebaseerde Playwright-knooppunten voeren Chromium uit als subproces binnen deze container, dus de limiet is die van deze container; aangepaste `playwrightCode` wordt uitgevoerd in een zustercontainer die zijn eigen limiet instelt. `docker-compose.yml` declareert al `shm_size: "2gb"`, dus `run.sh` en `deploy.sh` worden niet beïnvloed — alleen een gewone `docker run` heeft de flag nodig.

> **Playwright Run Code.** Aangepaste Playwright Python vereist `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` en de Docker-socketmount hierboven. De release-image stelt `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` in voor de GHCR-indeling (`/app/backend/.venv`). Compose `./deploy.sh` stelt de sandbox-image standaard in op `heym-backend:local`. Behoud `--no-sandbox` in de Chromium-opstartargumenten binnen sandboxcontainers.

**Minimale omgevingsvariabelen voor directe image-runs:**

| Variabele | Vereist | Doel |
|----------|----------|---------|
| `DATABASE_URL` | Optioneel | Volledige PostgreSQL-verbindingsreeks die alles overschrijft |
| `POSTGRES_HOST` | Ja, als `DATABASE_URL` leeg is | PostgreSQL-host |
| `POSTGRES_PORT` | Ja, als `DATABASE_URL` leeg is | PostgreSQL-poort |
| `POSTGRES_USER` | Ja, als `DATABASE_URL` leeg is | PostgreSQL-gebruikersnaam |
| `POSTGRES_PASSWORD` | Ja, als `DATABASE_URL` leeg is | PostgreSQL-wachtwoord |
| `POSTGRES_DB` | Ja, als `DATABASE_URL` leeg is | PostgreSQL-databasenaam |
| `SECRET_KEY` | Ja | JWT-ondertekeningsgeheim |
| `ENCRYPTION_KEY` | Ja | Versleutelingssleutel voor inloggegevens |
| `FRONTEND_URL` | Aanbevolen | Openbare browser-URL, met name voor OAuth-callbacks |
| `CORS_ORIGINS` | Aanbevolen | Toegestane browser-origins |
| `FILE_STORAGE_DIR` | Aanbevolen | Stel dit in op een absoluut `/app/data/files` wanneer u dat pad mount; de relatieve standaardwaarde `./data/files` wordt in deze image onder `/app/backend` opgelost en mist de mount |
| `ALLOW_REGISTER` | Aanbevolen | Stel dit in op `false` in productie, tenzij open registratie is bedoeld, maar pas nadat uw beheerdersaccount bestaat — er is geen bootstrap voor de eerste gebruiker |
| `DOCKER_LOGS_ENABLED` | Optioneel | Stel dit in op `true` om het tabblad Logs toegang te geven tot de Docker-socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Vereist wanneer `DOCKER_LOGS_ENABLED=true` | Door komma's gescheiden lijst van vertrouwde e-mailadressen van gebruikers die toegang mogen krijgen tot Docker-logs |
| `HEYM_PLUGINS_ENABLED` | Optioneel | Stel dit in op `true` om het plugin-subsysteem in te schakelen (aangepaste knooppunten geïnstalleerd als zip). Standaard uit |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Vereist wanneer `HEYM_PLUGINS_ENABLED=true` | Door komma's gescheiden e-mailadressen van operators die plugins mogen installeren/verwijderen |
| `HEYM_PLUGINS_DIR` | Optioneel | Waar plugin-bestanden worden opgeslagen. Stel dit in op een absoluut `/app/data/plugins` wanneer u dat pad mount; de relatieve standaardwaarde `data/plugins` wordt in deze image onder `/app/backend` opgelost en mist de mount |
| `HEYM_PYTHON_TOOL_SANDBOX` | Optioneel | Isolatiemodus voor Python-tools; standaard `auto` (geharde Docker-sandbox, fail closed). Zie [Beveiliging](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Optioneel | Overschrijf de sandbox-image voor Python-tools; leeg = automatisch de backend-image detecteren |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Optioneel | Docker-volume gebruikt door zustercontainers van de Codex-runner; standaard `heym-codex-workspaces` in Docker-implementaties |
| `HEYM_CODEX_NETWORK_ACCESS` | Optioneel | Sta sandbox-opdrachten van Codex toe om bestanden/afhankelijkheden te downloaden; Docker-implementaties schakelen dit standaard in |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Optioneel | Docker-volume gebruikt door zustercontainers van de OpenCode-runner; standaard `heym-opencode-workspaces` in Docker-implementaties |

**Opmerkingen:**

- De image stelt poort `4017` beschikbaar
- De backend blijft intern en wordt geproxied onder `/api`
- Wanneer `POSTGRES_HOST=localhost`, herschrijft de release-image dit automatisch naar `host.docker.internal` wanneer nodig, zodat dezelfde `.env` werkt met een PostgreSQL-container op hostniveau op macOS Docker/Desktop-tools
- Behoud de mount `data/files` als u wilt dat Drive-uploads en door skills gegenereerde bestanden containerherstarten overleven
- **Plugins:** stel `HEYM_PLUGINS_ENABLED=true` en `HEYM_PLUGIN_ADMIN_EMAILS` in en mount `data/plugins` om plugins in te schakelen, zodat geïnstalleerde plugin-bestanden behouden blijven bij het opnieuw aanmaken van containers. Plugin-metadata staat in uw PostgreSQL, dus die blijft ook behouden. De pip-`dependencies` die een plugin declareert, worden tijdens de installatie in de container geïnstalleerd; omdat het bestandssysteem van de image efemeer is, worden ze **automatisch opnieuw geïnstalleerd bij het opstarten** voor elke geïnstalleerde plugin (de `uv`-venv van de release-image is beschrijfbaar, dus dit werkt ook in de single-container-image)

### Een bestaande database naar een named volume verplaatsen

`./deploy.sh --migrate-pgdata` kent alleen de Compose-stack. Als u de release-image uitvoert tegen uw eigen PostgreSQL-container en die container een hostmap bind-mount, migreer deze dan zelf.

Controleer eerst wat uw databasecontainer gebruikt:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Als `"Type"` `bind` aangeeft, verplaats deze dan naar een named volume:

```bash
# 1. Stop de database. Heym kan hiervoor uitgeschakeld blijven.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Kopieer de datamap naar een named volume. Geef elk exemplaar zijn eigen

#   volumenaam als deze Docker-host meer dan één Heym-implementatie uitvoert.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Start PostgreSQL opnieuw op het volume, met hergebruik van de flags die u eerder had
#    maar vervang de bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Zodra het verbindingen accepteert, bouwt u de indexen opnieuw op.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**Gebruik uw eigen image in stappen 2 en 3, niet `postgres:16`.** Als uw database draait op `pgvector/pgvector:pg16` of een andere variant, kan het starten van het gekopieerde cluster met het standaardimage mislukken omdat de extensiebibliotheken die het verwacht ontbreken.

Uw oorspronkelijke datamap blijft onaangetast door deze procedure, dus het blijft uw rollback-pad. Verwijder deze pas nadat u heeft bevestigd dat de gemigreerde database uw workflows bedient. Stap 4 is om dezelfde reden belangrijk als bij de Compose-migratie: de kopie neemt eventuele bestaande indexschade met zich mee.

---

## Meer dan één instantie uitvoeren

Alles hierboven implementeert een enkele Heym-instantie. Wanneer één machine niet langer voldoende is, richt u een tweede instantie op dezelfde PostgreSQL-database en deze voegt zich toe als worker: achtergronduitvoeringen — cron, webhooks, MCP-toolaanroepen, chat-triggers — worden dan gedeeld tussen de instanties volgens een percentage dat u instelt onder **Settings → Instances**.

De instanties communiceren nooit met elkaar. Postgres draagt het werk, dus een worker heeft geen open poort en geen route terug naar de hoofdinstantie nodig, en er is geen message broker bij betrokken. Werk dat lokale schijf raakt — Drive-bestanden, coding-agent-workspaces, geïnstalleerde plugins — draait altijd op de hoofdinstantie, dus niets hoeft via een bestandssysteem te worden gedeeld.

Twee regels die het cluster niet voor u kan afdwingen: elke instantie moet dezelfde `SECRET_KEY` en `ENCRYPTION_KEY` gebruiken, en ingress mag alleen naar de hoofdinstantie wijzen. Beide worden uitgelegd, samen met de plaatsingsregels en hoe u de percentages kiest, in [Load Distribution](../reference/cluster.md).

> Dit is load distribution, geen high availability. De hoofdinstantie blijft een single point of failure voor ingress, bestandsopslag en de editor.

## Veelvoorkomende workflows

**Eerste keer instellen:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Voor het vooraf gebouwde `docker run`-image genereert u eerst handmatig de sleutels (zie de sectie **Prebuilt Image** hierboven).

**Productie bijwerken na een codewijziging:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Productielogs controleren:**

```bash
./deploy.sh --logs
```

**Productieservices stoppen:**

```bash
./deploy.sh --down
```

---

## Gerelateerd

- [Introduction](./introduction.md) – Platformoverzicht
- [Quick Start](./quick-start.md) – Bouw uw eerste workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Volledige configuratiereferentie
- [Security](../reference/security.md) – JWT-, encryptie- en CORS-instellingen
- [Load Distribution](../reference/cluster.md) – Voer meerdere instanties uit tegen één database

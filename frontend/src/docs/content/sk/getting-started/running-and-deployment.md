# Spúšťanie a nasadenie

Heym poskytuje dva skripty pre rôzne prostredia: `run.sh` pre lokálny vývoj a `deploy.sh` pre produkčné nasadenia pomocou Docker Compose.

> **Video návod:** [Nastavte Heym lokálne za menej ako 2 minúty](https://www.youtube.com/watch?v=P6YvlupUboU) — naklonujte repozitár, spustite PostgreSQL, vyplňte požadované premenné prostredia a vytvorte si prvý účet na lokálnej inštancii.

## Predpoklady

Oba skripty vyžadujú nainštalované nasledujúce nástroje:

| Nástroj | Účel |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Kontajner databázy (dev) a celý stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Správca balíkov Python pre backend |
| [bun](https://bun.sh) | JavaScript runtime pre frontend |

## Nastavenie prostredia

Oba skripty `run.sh` aj `deploy.sh` čítajú z súboru `.env` v koreňovom adresári projektu. Ak neexistuje, skript ho automaticky vytvorí zo súboru `.env.example` — pre lokálny vývoj aj produkciu.

`SECRET_KEY` a `ENCRYPTION_KEY` sú v `.env.example` prázdne. Ak je niektorý z nich prázdny, `run.sh` a `deploy.sh` automaticky vygenerujú kryptograficky silnú hodnotu a zapíšu ju späť do `.env`, takže čerstvé nastavenie nevyžaduje manuálnu manipuláciu s kľúčmi. Ak existujúci `.env` stále obsahuje starší zástupný znak `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), skripty sa zastavia s explicitnou chybou namiesto jeho prepísania — rotácia tohto kľúča by spôsobila nečitateľnosť predtým zašifrovaných prihlasovacích údajov. Samotný backend tiež odmietne štart, ak je niektorý z kľúčov prázdny alebo ponechaný na známom zástupnom znaku.

Manuálne vytvorenie súboru (voliteľné — skripty to vykonajú za vás):

```bash
cp .env.example .env
```

Kľúčové premenné prostredia:

Pre každú podporovanú premennú, predvolenú hodnotu a produkčnú poznámku si pozrite [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Premenná | Popis |
|----------|-------------|
| `SECRET_KEY` | **Povinné.** Tajný kľúč na podpisovanie JWT. Automaticky generovaný skriptmi `run.sh`/`deploy.sh`, ak je prázdny. |
| `ENCRYPTION_KEY` | **Povinné.** Kľúč na šifrovanie prihlasovacích údajov. Automaticky generovaný skriptmi `run.sh`/`deploy.sh`, ak je prázdny. |
| `DATABASE_URL` | Voliteľné prepísanie reťazca pripojenia k databáze. Ak je prázdne, Heym ho zostaví z nastavení `POSTGRES_*`. |
| `BACKEND_PORT` | Port backend API — predvolene `10105` |
| `FRONTEND_PORT` | Port frontendu — predvolene `4017` |
| `FRONTEND_URL` | **Povinné v produkcii.** Verejná URL adresa aplikácie (schéma + hostiteľ, napr. `https://heym.example.com`). Používa sa pre OAuth redirect URI (Google Sheets, BigQuery, Notion a podobne) a pre odkazy na recenzie, nadväzujúce Codex behy a súbory, ktoré vytvárajú behy na pozadí; musí sa zhodovať s URL adresou, ktorú používatelia používajú v prehliadači. V clustri nastavte rovnakú hodnotu na každej inštancii. |
| `ALLOW_REGISTER` | Otvorená registrácia používateľov (`false` v prod, `true` v dev). Prepnite na `false` až po vytvorení účtu správcu — neexistuje žiadny bootstrap prvého používateľa, takže prázdna databáza so zakázanou registráciou neposkytuje žiadny spôsob, ako ho vytvoriť. |
| `DOCKER_LOGS_ENABLED` | Povolí prístup k karte Logs podporovanej Dockerom, ak je nastavené na `true`; vyžaduje tiež prístup k Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Čiarkami oddelený zoznam e-mailov dôveryhodných používateľov s povoleným prístupom k Docker logom, ak je `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maximálna veľkosť tela HTTP požiadavky akceptovaná pred spustením obslužných rutín endpointu; predvolene `100`, o jeden MB viac ako `FILE_MAX_SIZE_MB`, aby zostal priestor pre multipart réžiu |
| `HEYM_PYTHON_TOOL_SANDBOX` | Ako sa spúšťajú používateľom definované nástroje Python: `auto` (predvolené — spevnený, izolovaný Docker kontajner; pri nedostupnosti Dockeru zlyhá bezpečne), `docker` (rovnaké, nikdy sa nevráti k zálohe), alebo `subprocess` (lokálna záložná možnosť v rámci procesu; nie je bezpečnostnou hranicou, iba pre dôveryhodné/dev prostredie). `run.sh` nastavuje `subprocess` pre natívny vývoj. Pozrite si [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image použitý pre Docker sandbox nástroja Python. Prázdne = automatická detekcia bežiaceho backend image. |

Predvolené hodnoty pripojenia k databáze (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) sú zdokumentované v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) a `.env.example`.

---
## Vývoj: `run.sh`

`run.sh` spustí všetky tri služby lokálne — databázu (ako Docker kontajner), FastAPI backend a Vite dev server — jediným príkazom.

```bash
./run.sh
```

**Čo robí, krok za krokom:**

1. Skontroluje, či sú dostupné `docker`, `bun` a `uv`
2. Vytvorí `.env` z `.env.example`, ak chýba, a vygeneruje náhodný `SECRET_KEY` a `ENCRYPTION_KEY`, keď sú prázdne
3. Spustí (alebo vytvorí) databázový Docker kontajner na porte `6543`, pričom jeho dáta ukladá do Docker volume `heym-postgres-data` namiesto adresára na hostiteľovi
4. Nainštaluje Python závislosti cez `uv sync`
5. Spustí Alembic databázové migrácie (`alembic upgrade head`)
6. Uvoľní porty backendu a frontendu, ak sú obsadené
7. Spustí FastAPI backend s `--reload` (hot-reload pri zmenách kódu)
8. Nainštaluje závislosti frontendu cez `bun install`
9. Spustí Vite dev server

**Možnosti:**

| Prepínač | Popis |
|------|-------------|
| *(žiadny)* | Spustí s povoleným debug logovaním (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Spustí s predvolenou úrovňou logovania (bez debug výstupu) |
| `--help` | Zobrazí informácie o použití |

**Adresy služieb (dev):**

| Služba | Adresa |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (predvolené: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (predvolené: 10105) |
| Interaktívna API dokumentácia | `localhost:10105/docs` |
| Databáza | `localhost:6543` |

Stlačením `Ctrl+C` elegantne zastavíte všetky služby.

---

## End-to-End testy: `run_e2e.sh`

Frontendová Playwright sada beží proti reálnej Vue aplikácii, FastAPI backendu a izolovanej PostgreSQL databáze:

```bash
./run_e2e.sh
```

Sada je smoke a regresná sada kľúčových ciest, nie vyčerpávajúce pokrytie produktu. Pokrýva autentifikáciu, životný cyklus a vykonávanie základného workflow, vybrané dashboard zdroje, verejné routes a mockované HITL review UI. Integrácie poskytovateľov, každý typ uzla, matice zdieľania/práv a plné HITL resume vykonávanie zostávajú pokryté primárne backendovými testami alebo vyžadujú dedikované integračné prostredia.

Každé spustenie dostane vlastný dočasný PostgreSQL 16 kontajner, náhodné dostupné porty databázy/backend/frontend, stav autentifikácie, výsledky testov a HTML report. To umožňuje viacerým procesom `run_e2e.sh` bežať súbežne bez zdieľania stavu alebo prepisovania artefaktov. Skript odstráni svoj databázový kontajner po dokončení behu a vypíše adresár artefaktov a cestu k reportu.

Užitočné príkazy:

```bash
./run_e2e.sh --ui         # Interaktívny Playwright runner s izolovanou databázou
cd frontend
bun run test:e2e:report   # Otvorí naposledy dokončený lokálny beh
```

Priame spustenia `bun run test:e2e` a `bun run test:e2e:ui` vyžadujú explicitný `DATABASE_URL`, aby nemohli ticho spustiť proti lokálnej vývojovej databáze. Pre bežné lokálne behy použite `./run_e2e.sh`.

`./check.sh` spúšťa lint, typecheck, formátovanie a backendové testy bez E2E sady, čím udržiava predvolenú lokálnu kontrolnú cestu rýchlu. Playwright E2E testy spúšťajte samostatne cez `./run_e2e.sh`. Pull requesty vždy spúšťajú Chromium E2E sadu v GitHub Actions a pri zlyhaniach uchovávajú traces, snímky obrazovky, videá a HTML report.

---
## Produkcia: `deploy.sh`

`deploy.sh` zostavuje a spúšťa celý stack pomocou Docker Compose. Všetky tri služby — databáza, backend a frontend — bežia ako kontajnery. Vstupný bod backendu automaticky spúšťa migrácie pred spustením servera s 8 workermi.

**Počiatočný deploy (build + spustenie):**

```bash
./deploy.sh
```

Vykonáva deploy bez výpadku: obrazy sa najprv zostavia, zatiaľ čo existujúce kontajnery ďalej bežia, a následne sa vymení nová verzia.

**Dostupné príkazy:**

| Príkaz | Popis |
|---------|-------------|
| `./deploy.sh` | Zostaví obrazy a spustí/aktualizuje všetky služby |
| `./deploy.sh --status` | Zobrazí stav kontajnerov |
| `./deploy.sh --logs` | Streamuje logy zo všetkých kontajnerov |
| `./deploy.sh --restart` | Reštartuje všetky kontajnery |
| `./deploy.sh --down` | Zastaví a odstráni všetky kontajnery |
| `./deploy.sh --migrate-pgdata` | Jednorazová migrácia: skopíruje existujúci adresár `data/postgres` do Docker volume `heym-postgres-data` a znovu zostaví jeho indexy |
| `./deploy.sh --help` | Zobrazí informácie o používaní |

**Úložisko databázy: pomenovaný Docker volume, nie adresár na hostiteľovi.**

Compose ukladá PostgreSQL do Docker volume `heym-postgres-data`. Staršie verzie namiesto toho pripájali adresár hostiteľa `./data/postgres` pomocou bind mount. Bind mounty na hostiteľovi v macOS (virtiofs) a Windows/WSL2 neposkytujú PostgreSQL záruky `fsync` a zatvorenia súboru, ktoré vyžaduje: clustery tam narážajú na `PANIC: could not close file … Input/output error` pri WAL segmentoch a časom sa poškodia. Linuxové bind mounty neboli nikdy zasiahnuté, ale každá platforma teraz používa rovnaké rozloženie.

Aktualizácia nasadenia, ktoré má ešte dáta v `./data/postgres`, je jednorazový krok. `./deploy.sh` to rozpozná, zastaví sa pred zostavením a vyzve vás, aby ste najprv vykonali migráciu:

```bash
./deploy.sh --migrate-pgdata   # zastaví služby, skopíruje do volume, znovu zostaví indexy
./deploy.sh                    # nasadenie ako obvykle
```

**Migrácia tiež znovu zostavuje indexy.** Kópia je bajt po bajte, takže poškodenie indexov spôsobené starým bind mountom sa prenáša spolu s ňou. `--migrate-pgdata` preto spustí službu `postgres` samostatne na novom volume, spustí proti nej `reindexdb` a pred spustením zvyšku stacku ju opäť zastaví. To je dôležité, pretože tento typ poškodenia zanecháva položky indexu ukazujúce za koniec haldy — stav, ktorý `pg_amcheck` hlási ako čistý, takže úspešná kontrola nie je dôkazom zdravej tabuľky. REINDEX tieto položky opraví; nedokáže však obnoviť stránky haldy, ktoré starý súborový systém už stratil. Na veľkej, známe zdravej databáze môžete znovuzostavenie obísť pomocou `./deploy.sh --migrate-pgdata --skip-reindex`.

Kópia je nedestruktívna. `./data/postgres` zostáva na mieste ako záloha a migrácia odmietne prepísať volume, ktorý už obsahuje databázu. Ak ktorýkoľvek krok zlyhá, nový volume sa odstráni, takže polomigrovaný cluster nemožno omylom nasadiť. Starý adresár vymažte, keď potvrdíte, že vaše workflow sú neporušené. Kontajner `postgres` nesie rovnakú ochranu, takže ani manuálne `docker compose up` nemôže ticho inicializovať prázdnu databázu cez vaše dáta. Čerstvé inštalácie nevyžadujú žiadny zásah.

**Adresy služieb (produkcia):**

Kontajner frontendu je vystavený na `FRONTEND_PORT` (predvolené: 4017). Backend API je obsluhované pod cestou `/api`, proxované cez kontajner frontendu — v produkcii teda existuje iba jeden verejne prístupný port.

**Prehľad kontajnerov:**

| Kontajner | Popis |
|-----------|-------------|
| `heym-db` | Relačná databáza |
| `heym-backend` | FastAPI API server (8 workerov, zostavený z `backend/Dockerfile`) |
| `heym-frontend` | Náhľadový kontajner frontendu obsluhujúci zostavenú Vue aplikáciu (zostavený z `frontend/Dockerfile`) |

**Odznak aktualizácie verzie:**

Hlavička aplikácie zobrazuje bežiacu verziu Docker buildu. Keď je táto verzia za najnovším vydaním Heym na GitHubu, vedľa verzie sa zobrazí fialový odznak **Update**. Kliknutím na verziu alebo odznak otvoríte stránku vydaní Heym na GitHubu.

---
## Predpripravený Image: `docker run`

Ak nechcete aplikáciu zostavovať lokálne, môžete si stiahnuť publikovaný kontajnerový image a spustiť ho priamo.

Image spúšťa frontend a backend spoločne v jednom kontajneri. PostgreSQL je stále externý, ale môžete poskytnúť buď `DATABASE_URL`, alebo premenné `POSTGRES_*` z `.env.example`.

> **Uložte databázu do pomenovaného Docker volume.** Vydaný image neobsahuje žiadnu databázu, takže PostgreSQL za `DATABASE_URL` je na vás. Namontujte ho ako `-v heym-postgres-data:/var/lib/postgresql/data` namiesto hostiteľskej cesty: na macOS (virtiofs) a Windows/WSL2 bind-mounted adresár s dátami PostgreSQL nedodržiava záruky `fsync`, ktoré databáza vyžaduje, a v priebehu času poškodzuje cluster.

> **Backend vektorového úložiska.** `run.sh` a `deploy.sh` spúšťajú oficiálny image `postgres:16` a pri štarte automaticky inštalujú balík `postgresql-16-pgvector`, takže **Postgres (pgvector) RAG backend** tam funguje hneď po vybalení bez zmeny vašich dát. Predpripravený single-container image sa však pripája k PostgreSQL, ktorý poskytujete **vy** — táto databáza musí podporovať rozšírenie `vector`, aby bolo možné použiť Postgres backend. Heym nedokáže nainštalovať pgvector do databázy, ktorú nespravuje. Bez neho štartovacia migrácia pgvector tabuľku elegantne preskočí — nasadenie stále uspeje, Qdrant RAG funguje ďalej a vytvorenie alebo nahrávanie do Postgres vektorového úložiska vráti jasnú správu „backend unavailable“, kým nebude pgvector povolený.

**Kľúče nastavte sami pri priamom spustení image.** Na rozdiel od `run.sh`/`deploy.sh` predpripravený image negeneruje kľúče automaticky. Po `cp .env.example .env` naplňte dva prázdne kľúče (nahradenie na mieste zabráni duplicitným záznamom):

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

> **Nastavte mounty pre súbory a pluginy ako absolútne.** `FILE_STORAGE_DIR` a `HEYM_PLUGINS_DIR` predvolene používajú relatívne cesty `./data/files` a `data/plugins` a vydaný image spúšťa backend z `/app/backend`. Ak zostanú relatívne, vyhodnotia sa na `/app/backend/data/files` a `/app/backend/data/plugins`, takže dva bind mounty vyššie nič nedostanú a nahrané súbory sa stratia pri výmene kontajnera. Prepínače `-e` prepíšu relatívne hodnoty, ktoré `.env.example` poskytuje cez `--env-file`, pretože `-e` z príkazového riadka má prednosť pred `--env-file`. Compose (`./deploy.sh`) to nepotrebuje: tento image spúšťa backend z `/app`, kde relatívne predvolené hodnoty už smerujú na mounty.

> **Prístup k Docker socketu.** Namontovanie `/var/run/docker.sock` dáva backendu širokú kontrolu nad hostiteľským Docker daemonom. Predvolená služba Docker Compose a príklad priameho `docker run` ho obsahujú pre Docker-based MCP stdio nástroje, ktoré spúšťajú príkazy `docker`. Karta Logs stále vyžaduje `DOCKER_LOGS_ENABLED=true` a `DOCKER_LOGS_ALLOWED_EMAILS` s čiarkou oddeleným zoznamom e-mailov dôveryhodných používateľov. Vytvorte dôveryhodný admin účet pred povolením Docker logs, alebo ponechajte `ALLOW_REGISTER=false`, aby si neoverená samoregistrácia nemohla nárokovať e-mail na allow-liste. Používateľom definované Python nástroje tento socket **nedostanú**: bežia v samostatnom hardeningovanom kontajneri bez Docker socketu. Pozri [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex uzol používa rovnaký image `ghcr.io/heymrun/heym` ako sibling runner kontajner (`--entrypoint codex`), aby Codex Linux sandbox mohol vytvárať namespaces. Ponechajte mount volume `heym-codex-workspaces`, ak chcete Codex workflows v priamom nastavení image; runner nedostáva Docker socket ani backend secrets.

> **OpenCode Go runner.** OpenCode Go uzol používa rovnaký image ako hardeningovaný sibling runner (`--entrypoint opencode`) zdieľajúci `heym-opencode-workspaces`. Ponechajte tento mount volume, ak chcete OpenCode workflows v priamom nastavení image; runner nedostáva Docker socket ani GitHub token.

> **Skill sandbox.** Python skilly na Agent uzle bežia v hardeningovanom sibling kontajneri, ktorý zdieľa volume `heym-codex-workspaces`, takže ponechajte tento mount volume aj pre skilly — nielen pre Codex. Každé spustenie dostane izolovanú podcestu pre dané spustenie a sibling nedostáva ani Docker socket, ani backend secrets. Vyžaduje to **Docker Engine 25.0+**; na starších engine, alebo bez volume, `HEYM_PYTHON_TOOL_SANDBOX=auto` zlyhá fail-closed — nastavte `HEYM_PYTHON_TOOL_SANDBOX=subprocess` len pre dôveryhodné single-user nastavenia. Pozri [Security](../reference/security.md#skill-sandbox).
> **Pre Playwright je vyžadovaný parameter `--shm-size 2g`.** Docker poskytuje kontajneru 64 MB pre `/dev/shm` a Chromium pri tomto limite havaruje svoj renderer. Playwright uzly založené na krokoch spúšťajú Chromium ako podproces v tomto kontajneri, takže limit sa vzťahuje na tento kontajner; vlastný `playwrightCode` beží v súbežnom kontajneri, ktorý si nastavuje vlastný limit. `docker-compose.yml` už deklaruje `shm_size: "2gb"`, takže `run.sh` a `deploy.sh` nie sú ovplyvnené — iba obyčajný `docker run` vyžaduje tento parameter.

> **Playwright Run Code.** Vlastný Playwright Python vyžaduje `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` a vyššie uvedené pripojenie Docker socketu. Release image nastavuje `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` pre rozloženie GHCR (`/app/backend/.venv`). Compose `./deploy.sh` predvolene nastavuje sandbox image na `heym-backend:local`. V sandbox kontajneroch ponechajte `--no-sandbox` v argumentoch spustenia Chromium.

**Minimálne premenné prostredia pre priame spustenie image:**

| Premenná | Vyžadovaná | Účel |
|----------|----------|---------|
| `DATABASE_URL` | Voliteľná | Úplné prepísanie PostgreSQL connection stringu |
| `POSTGRES_HOST` | Áno, ak je `DATABASE_URL` prázdne | Hostiteľ PostgreSQL |
| `POSTGRES_PORT` | Áno, ak je `DATABASE_URL` prázdne | Port PostgreSQL |
| `POSTGRES_USER` | Áno, ak je `DATABASE_URL` prázdne | Používateľské meno PostgreSQL |
| `POSTGRES_PASSWORD` | Áno, ak je `DATABASE_URL` prázdne | Heslo PostgreSQL |
| `POSTGRES_DB` | Áno, ak je `DATABASE_URL` prázdne | Názov databázy PostgreSQL |
| `SECRET_KEY` | Áno | Tajný kľúč na podpisovanie JWT |
| `ENCRYPTION_KEY` | Áno | Kľúč na šifrovanie prihlasovacích údajov |
| `FRONTEND_URL` | Odporúčaná | Verejná URL prehliadača, najmä pre OAuth callbacky |
| `CORS_ORIGINS` | Odporúčaná | Povolené pôvody prehliadača |
| `FILE_STORAGE_DIR` | Odporúčaná | Nastavte ju na absolútnu cestu `/app/data/files`, keď pripájate túto cestu; predvolená relatívna hodnota `./data/files` sa v tomto image vyhodnocuje pod `/app/backend` a minie pripojenie |
| `ALLOW_REGISTER` | Odporúčaná | V produkcii nastavte na `false`, pokiaľ nie je zamýšľaná otvorená registrácia, ale až po vytvorení účtu správcu — neexistuje žiadny bootstrap prvého používateľa |
| `DOCKER_LOGS_ENABLED` | Voliteľná | Nastavte na `true`, aby karta Logs mohla používať prístup k Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Vyžadovaná, keď `DOCKER_LOGS_ENABLED=true` | Čiarkami oddelený zoznam e-mailov dôveryhodných používateľov s povoleným prístupom k Docker logom |
| `HEYM_PLUGINS_ENABLED` | Voliteľná | Nastavte na `true` na povolenie subsystému pluginov (vlastné uzly inštalované ako zip). Predvolene vypnuté |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Vyžadovaná, keď `HEYM_PLUGINS_ENABLED=true` | Čiarkami oddelený zoznam e-mailov operátorov s povolením inštalovať/odinštalovať pluginy |
| `HEYM_PLUGINS_DIR` | Voliteľná | Kde sú uložené súbory pluginov. Nastavte ju na absolútnu cestu `/app/data/plugins`, keď pripájate túto cestu; predvolená relatívna hodnota `data/plugins` sa v tomto image vyhodnocuje pod `/app/backend` a minie pripojenie |
| `HEYM_PYTHON_TOOL_SANDBOX` | Voliteľná | Režim izolácie Python nástroja; predvolene `auto` (zabezpečený Docker sandbox, fail closed). Pozri [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Voliteľná | Prepíše sandbox image Python nástroja; prázdne = automatická detekcia backend image |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Voliteľná | Docker volume používaný súbežnými kontajnermi Codex runner; v Docker nasadeniach predvolene `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | Voliteľná | Povolí sandboxovaným príkazom Codex sťahovať súbory/závislosti; Docker nasadenia to predvolene povoľujú |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Voliteľná | Docker volume používaný súbežnými kontajnermi OpenCode runner; v Docker nasadeniach predvolene `heym-opencode-workspaces` |

**Poznámky:**

- Image sprístupňuje port `4017`
- Backend zostáva interný a je proxovaný pod `/api`
- Keď `POSTGRES_HOST=localhost`, release image ho automaticky prepíše na `host.docker.internal`, keď je to potrebné, aby rovnaký `.env` fungoval s hostiteľským kontajnerom PostgreSQL na nástrojoch macOS Docker/Desktop
- Ponechajte pripojenie `data/files`, ak chcete, aby nahrávania do Drive a súbory generované skillmi prežili reštarty kontajnera
- **Pluginy:** na ich povolenie nastavte `HEYM_PLUGINS_ENABLED=true` a `HEYM_PLUGIN_ADMIN_EMAILS` a pripojte `data/plugins`, aby nainštalované súbory pluginov pretrvali opätovné vytvorenie kontajnera. Metadáta pluginov žijú vo vašom PostgreSQL, takže tiež pretrvajú. Deklarované pip `dependencies` pluginu sa nainštalujú do kontajnera v čase inštalácie; keďže súborový systém image je efemérny, sú **automaticky preinštalované pri štarte** pre každý nainštalovaný plugin (venv `uv` v release image je zapisovateľný, takže to funguje aj v single-container image)

### Presun existujúcej databázy do named volume

`./deploy.sh --migrate-pgdata` pozná iba Compose stack. Ak spúšťate release image proti vlastnému kontajneru PostgreSQL a tento kontajner bind-mountuje hostiteľský adresár, migrujte ho sami.

Najprv skontrolujte, čo váš databázový kontajner používa:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Ak `"Type"` uvádza `bind`, presuňte ho do named volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#    názov zväzku, ak tento Docker host spúšťa viac ako jedno nasadenie Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Opäť spustite PostgreSQL na zväzku, pričom znovu použite príznaky, ktoré ste mali predtým,
#    ale nahraďte bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Keď začne prijímať spojenia, obnovte indexy.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**V krokoch 2 a 3 použite vlastný image, nie `postgres:16`.** Ak vaša databáza používa `pgvector/pgvector:pg16` alebo iný variant, spustenie skopírovaného clusteru so štandardným image môže zlyhať, pretože chýbajú knižnice rozšírení, ktoré očakáva.

Tento postup sa nedotkne pôvodného adresára s údajmi, takže zostáva vašou cestou na návrat. Odstráňte ho až po overení, že migrovaná databáza obsluhuje vaše workflowy. Krok 4 je dôležitý z rovnakého dôvodu ako pri migrácii cez Compose: kópia so sebou prenáša akékoľvek existujúce poškodenie indexov.

---

## Spustenie viac ako jednej inštancie

Všetko vyššie nasadzuje jednu inštanciu Heym. Keď jeden stroj už nestačí, nasmerujte druhú inštanciu na tú istú databázu PostgreSQL a tá sa pripojí ako worker: behy na pozadí — cron, webhooky, volania nástrojov MCP, chatové triggery — sa potom rozdeľujú medzi inštancie podľa percenta, ktoré nastavíte v časti **Settings → Instances**.

Inštancie spolu nikdy nekomunikujú. Prácu prenáša Postgres, takže worker nepotrebuje otvorený port ani cestu späť k hlavnej inštancii a nie je zapojený žiadny message broker. Práca, ktorá sa dotýka lokálneho disku — súbory Drive, pracovné priestory coding-agenta, nainštalované pluginy — vždy beží na hlavnej inštancii, takže nie je potrebné nič zdieľať cez súborový systém.

Dve pravidlá, ktoré cluster nedokáže vynútiť za vás: každá inštancia musí používať rovnaký `SECRET_KEY` a `ENCRYPTION_KEY` a ingress musí smerovať iba na hlavnú inštanciu. Oboje je vysvetlené spolu s pravidlami umiestňovania a spôsobom výberu percent v časti [Load Distribution](../reference/cluster.md).

> Toto je rozloženie záťaže, nie vysoká dostupnosť. Hlavná inštancia zostáva jediným bodom zlyhania pre ingress, úložisko súborov a editor.

## Bežné workflowy

**Prvé nastavenie:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

Pri vopred zostavenom image `docker run` najprv vygenerujte kľúče manuálne (pozri časť **Prebuilt Image** vyššie).

**Aktualizácia produkcie po zmene kódu:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Kontrola produkčných logov:**

```bash
./deploy.sh --logs
```

**Zastavenie produkčných služieb:**

```bash
./deploy.sh --down
```

---

## Súvisiace

- [Introduction](./introduction.md) – Prehľad platformy
- [Quick Start](./quick-start.md) – Vytvorte svoj prvý workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Úplná referencia konfigurácie
- [Security](../reference/security.md) – Nastavenia JWT, šifrovania a CORS
- [Load Distribution](../reference/cluster.md) – Spustenie viacerých inštancií proti jednej databáze

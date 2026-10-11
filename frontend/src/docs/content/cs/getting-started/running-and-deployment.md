# Spouštění a nasazení

Heym poskytuje dva skripty pro různá prostředí: `run.sh` pro lokální vývoj a `deploy.sh` pro produkční nasazení pomocí Docker Compose.

> **Video průvodce:** [Nastavte Heym lokálně za méně než 2 minuty](https://www.youtube.com/watch?v=P6YvlupUboU) — naklonujte repozitář, spusťte PostgreSQL, vyplňte požadované proměnné prostředí a vytvořte si první účet na lokální instanci.

## Předpoklady

Oba skripty vyžadují nainstalované následující nástroje:

| Nástroj | Účel |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Kontejner databáze (dev) a celý stack (prod) |
| [uv](https://github.com/astral-sh/uv) | Správce balíčků Python pro backend |
| [bun](https://bun.sh) | JavaScript runtime pro frontend |

## Nastavení prostředí

Skripty `run.sh` i `deploy.sh` čtou z souboru `.env` v kořeni projektu. Pokud neexistuje, skript jej automaticky vytvoří ze souboru `.env.example` — pro lokální vývoj i produkci.

`SECRET_KEY` a `ENCRYPTION_KEY` jsou v souboru `.env.example` dodávány prázdné. Pokud je některý z nich prázdný, skripty `run.sh` a `deploy.sh` automaticky vygenerují kryptograficky silnou hodnotu a zapíší ji zpět do souboru `.env`, takže čerstvé nastavení nevyžaduje ruční správu klíčů. Pokud stávající soubor `.env` stále obsahuje starší zástupný text pro `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), skripty se zastaví s explicitní chybou namísto přepsání — rotace tohoto klíče by způsobila nečitelnost dříve zašifrovaných přihlašovacích údajů. Samotný backend také odmítne spuštění, pokud je některý z klíčů prázdný nebo ponechán na známém zástupném textu.

Ruční vytvoření souboru (volitelné — skripty to provedou za vás):

```bash
cp .env.example .env
```

Klíčové proměnné prostředí:

Pro všechny podporované proměnné, výchozí hodnoty a poznámky k produkci viz [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Proměnná | Popis |
|----------|-------------|
| `SECRET_KEY` | **Povinné.** Tajný klíč pro podepisování JWT. Automaticky generován skripty `run.sh`/`deploy.sh`, pokud je prázdný. |
| `ENCRYPTION_KEY` | **Povinné.** Klíč pro šifrování přihlašovacích údajů. Automaticky generován skripty `run.sh`/`deploy.sh`, pokud je prázdný. |
| `DATABASE_URL` | Volitelné přepsání připojovacího řetězce databáze. Pokud je prázdné, Heym jej sestaví z nastavení `POSTGRES_*`. |
| `BACKEND_PORT` | Port backend API — výchozí hodnota `10105` |
| `FRONTEND_PORT` | Port frontendu — výchozí hodnota `4017` |
| `FRONTEND_URL` | **Povinné v produkci.** Veřejná URL aplikace (schéma + hostitel, např. `https://heym.example.com`). Používá se pro přesměrovávací URI OAuth (Google Sheets, BigQuery, Notion a podobně) a pro odkazy na revize, navazující úlohy Codex a soubory, které vytvářejí běhy na pozadí; musí odpovídat URL, kterou uživatelé používají v prohlížeči. V clusteru nastavte stejnou hodnotu na každé instanci. |
| `ALLOW_REGISTER` | Otevřená registrace uživatelů (`false` v produkci, `true` ve vývoji). Přepněte na `false` teprve poté, co existuje váš administrátorský účet — neexistuje žádný bootstrap prvního uživatele, takže prázdná databáze a zakázaná registrace neumožňují žádný způsob vytvoření účtu. |
| `DOCKER_LOGS_ENABLED` | Při nastavení na `true` povoluje přístup k záložce Logs podporované Dockerem; vyžaduje také přístup k Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Čárkami oddělený seznam e-mailů důvěryhodných uživatelů, kterým je povolen přístup k Docker logům, když je `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maximální velikost těla HTTP požadavku přijatá před spuštěním obslužných rutin endpointů; výchozí hodnota `100`, o jeden MB více než `FILE_MAX_SIZE_MB`, aby zůstal prostor pro režii multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Jak se spouštějí uživatelsky definované nástroje Python: `auto` (výchozí — zpevněný, izolovaný kontejner Docker; při nedostupnosti Dockeru selže bezpečně), `docker` (totéž, nikdy nepřechází na jinou možnost) nebo `subprocess` (lokální náhrada v rámci procesu; není bezpečnostní hranicí, pouze pro důvěryhodné/vývojové prostředí). `run.sh` nastavuje `subprocess` pro nativní vývoj. Viz [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image použitý pro Docker sandbox nástroje Python. Prázdné = automatická detekce běžícího backend image. |

Výchozí hodnoty připojení k databázi (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) jsou zdokumentovány v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) a `.env.example`.

---
## Vývoj: `run.sh`

`run.sh` spustí všechny tři služby lokálně — databázi (jako Docker kontejner), FastAPI backend a Vite dev server — jediným příkazem.

```bash
./run.sh
```

**Co dělá, krok za krokem:**

1. Ověří, že jsou dostupné nástroje `docker`, `bun` a `uv`
2. Vytvoří `.env` ze souboru `.env.example`, pokud chybí, a vygeneruje náhodný `SECRET_KEY` a `ENCRYPTION_KEY`, pokud jsou prázdné
3. Spustí (nebo vytvoří) databázový Docker kontejner na portu `6543`, přičemž jeho data ukládá do Docker volume `heym-postgres-data` namísto adresáře na hostiteli
4. Nainstaluje Python závislosti pomocí `uv sync`
5. Spustí databázové migrace Alembic (`alembic upgrade head`)
6. Uvolní porty backendu a frontendu, pokud jsou obsazené
7. Spustí FastAPI backend s `--reload` (hot-reload při změnách kódu)
8. Nainstaluje závislosti frontendu pomocí `bun install`
9. Spustí Vite dev server

**Možnosti:**

| Přepínač | Popis |
|------|-------------|
| *(žádný)* | Spustí s povoleným debug logováním (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Spustí s výchozí úrovní logování (bez debug výstupu) |
| `--help` | Zobrazí informace o použití |

**Adresy služeb (dev):**

| Služba | Adresa |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (výchozí: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (výchozí: 10105) |
| Interaktivní API dokumentace | `localhost:10105/docs` |
| Databáze | `localhost:6543` |

Stisknutím `Ctrl+C` elegantně zastavíte všechny služby.

---

## End-to-End testy: `run_e2e.sh`

Frontendová sada Playwright běží proti skutečné Vue aplikaci, FastAPI backendu a izolované databázi PostgreSQL:

```bash
./run_e2e.sh
```

Sada představuje smoke a regresní sadu klíčových cest, nikoli vyčerpávající pokrytí produktu. Pokrývá autentizaci, životní cyklus a spouštění základních workflow, vybrané dashboard prostředky, veřejné routes a mockované HITL review UI. Integrace poskytovatelů, všechny typy uzlů, matice sdílení a oprávnění a plné spuštění HITL resume zůstávají pokryty primárně backendovými testy nebo vyžadují dedikovaná integrační prostředí.

Každé spuštění získá vlastní dočasný kontejner PostgreSQL 16, náhodné dostupné porty databáze/backend/frontend, stav autentizace, výsledky testů a HTML report. To umožňuje, aby více procesů `run_e2e.sh` běželo souběžně bez sdílení stavu nebo přepisování artefaktů. Skript po dokončení běhu odstraní svůj databázový kontejner a vypíše adresář artefaktů a cestu k reportu.

Užitečné příkazy:

```bash
./run_e2e.sh --ui         # Interaktivní Playwright runner s izolovanou databází
cd frontend
bun run test:e2e:report   # Otevře naposledy dokončený lokální běh
```

Přímá spuštění `bun run test:e2e` a `bun run test:e2e:ui` vyžadují explicitní `DATABASE_URL`, aby nemohla tiše spustit proti lokální vývojové databázi. Pro běžné lokální běhy použijte `./run_e2e.sh`.

`./check.sh` spouští lint, typecheck, formátování a backendové testy bez E2E sady, čímž udržuje výchozí cestu lokální kontroly rychlou. Playwright E2E testy spouštějte samostatně pomocí `./run_e2e.sh`. Pull requesty vždy spouštějí Chromium E2E sadu v GitHub Actions a při selhání uchovávají traces, snímky obrazovky, videa a HTML report.

---
## Produkce: `deploy.sh`

`deploy.sh` sestaví a spustí celý stack pomocí Docker Compose. Všechny tři služby — databáze, backend a frontend — běží jako kontejnery. Vstupní bod backendu automaticky spouští migrace před spuštěním serveru s 8 workery.

**Prvotní nasazení (sestavení + spuštění):**

```bash
./deploy.sh
```

Provede nasazení bez výpadku: image se nejprve sestaví, zatímco stávající kontejnery dále běží, a poté se nasadí nová verze.

**Dostupné příkazy:**

| Příkaz | Popis |
|---------|-------------|
| `./deploy.sh` | Sestaví image a spustí/aktualizuje všechny služby |
| `./deploy.sh --status` | Zobrazí stav kontejnerů |
| `./deploy.sh --logs` | Streamuje logy ze všech kontejnerů |
| `./deploy.sh --restart` | Restartuje všechny kontejnery |
| `./deploy.sh --down` | Zastaví a odstraní všechny kontejnery |
| `./deploy.sh --migrate-pgdata` | Jednorázová migrace: zkopíruje existující adresář `data/postgres` do Docker volume `heym-postgres-data` a přestaví jeho indexy |
| `./deploy.sh --help` | Zobrazí informace o použití |

**Úložiště databáze: pojmenovaný Docker volume, nikoli adresář na hostiteli.**

Compose ukládá PostgreSQL do Docker volume `heym-postgres-data`. Starší verze místo toho připojovaly adresář hostitele `./data/postgres` pomocí bind mount. Bind mounty na hostiteli v macOS (virtiofs) a Windows/WSL2 neposkytují PostgreSQL záruky `fsync` a uzavření souborů, které vyžaduje: clustery na těchto platformách narážely na `PANIC: could not close file … Input/output error` u WAL segmentů a v průběhu času se poškodily. Linuxové bind mounty nebyly nikdy zasaženy, ale všechny platformy nyní používají stejné uspořádání.

Upgrade nasazení, které stále obsahuje data v `./data/postgres`, je jednorázový krok. `./deploy.sh` tuto situaci detekuje, zastaví se před sestavením a vyzve vás k provedení migrace:

```bash
./deploy.sh --migrate-pgdata   # zastaví služby, zkopíruje data do volume, přestaví indexy
./deploy.sh                    # nasazení jako obvykle
```

**Migrace také přestaví indexy.** Kopie je bajt po bajtu, takže poškození indexů způsobené starým bind mountem se přenese spolu s ní. Proto `--migrate-pgdata` spustí službu `postgres` samostatně na novém volume, spustí proti ní `reindexdb` a před spuštěním zbytku stacku ji opět zastaví. To je důležité, protože tento typ poškození zanechává položky indexu ukazující za konec haldy — stav, který `pg_amcheck` hlásí jako v pořádku, takže úspěšná kontrola není důkazem zdravé tabulky. REINDEX tyto položky opraví; nedokáže však obnovit stránky haldy, které starý souborový systém již ztratil. U velké databáze, o níž je známo, že je zdravá, můžete přestavbu obejít pomocí `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopie je nedestruktivní. `./data/postgres` zůstává na místě jako záloha a migrace odmítne přepsat volume, který již obsahuje databázi. Pokud některý krok selže, nový volume se odstraní, takže částečně migrovaný cluster nemůže být omylem nasazen. Starý adresář smažte, jakmile ověříte, že vaše workflow jsou v pořádku. Kontejner `postgres` má stejnou ochranu, takže ani ruční `docker compose up` nemůže tiše inicializovat prázdnou databázi přes vaše data. Čerstvé instalace nevyžadují žádný zásah.

**Adresy služeb (produkce):**

Frontendový kontejner je vystaven na `FRONTEND_PORT` (výchozí: 4017). Backend API je obsluhováno pod cestou `/api`, proxy přes frontendový kontejner — v produkci tedy existuje pouze jeden veřejně přístupný port.

**Přehled kontejnerů:**

| Kontejner | Popis |
|-----------|-------------|
| `heym-db` | Relační databáze |
| `heym-backend` | FastAPI API server (8 workerů, sestaveno z `backend/Dockerfile`) |
| `heym-frontend` | Frontendový preview kontejner obsluhující sestavenou Vue aplikaci (sestaveno z `frontend/Dockerfile`) |

**Odznak aktualizace verze:**

Záhlaví aplikace zobrazuje běžící verzi Docker buildu. Pokud je tato verze starší než nejnovější vydání Heym na GitHubu, zobrazí se vedle verze fialový odznak **Update**. Kliknutím na verzi nebo odznak otevřete stránku vydání Heym na GitHubu.

---
## Předpřipravený image: `docker run`

Pokud nechcete aplikaci sestavovat lokálně, můžete si stáhnout publikovaný kontejnerový image a spustit jej přímo.

Image spouští frontend a backend společně v jednom kontejneru. PostgreSQL je stále externí, ale můžete poskytnout buď `DATABASE_URL`, nebo proměnné `POSTGRES_*` ze souboru `.env.example`.

> **Uložte databázi do pojmenovaného svazku Dockeru.** Vydávaný image neobsahuje žádnou databázi, takže PostgreSQL za `DATABASE_URL` si provozujete sami. Připojte jej jako `-v heym-postgres-data:/var/lib/postgresql/data` namísto cesty v hostiteli: v systému macOS (virtiofs) a Windows/WSL2 datový adresář PostgreSQL připojený přes bind mount nedodržuje záruky `fsync`, které databáze vyžaduje, a v průběhu času poškodí cluster.

> **Backend vektorového úložiště.** Skripty `run.sh` a `deploy.sh` spouštějí oficiální image `postgres:16` a při startu automaticky instalují balíček `postgresql-16-pgvector`, takže **RAG backend Postgres (pgvector)** zde funguje ihned bez jakýchkoli změn vašich dat. Předpřipravený jedno-kontejnerový image se však připojuje k PostgreSQL, který poskytujete **vy** — tato databáze musí podporovat rozšíření `vector`, aby bylo možné použít backend Postgres. Heym nemůže nainstalovat pgvector do databáze, kterou nespravuje. Bez něj migrace při startu tabulku pgvector elegantně přeskočí — nasazení stále proběhne úspěšně, Qdrant RAG funguje dál a vytváření či nahrávání do Postgres vektorového úložiště vrací jasnou zprávu „backend unavailable“, dokud není pgvector povolen.

**Při přímém spuštění image si klíče nastavte sami.** Na rozdíl od `run.sh`/`deploy.sh` předpřipravený image negeneruje klíče automaticky. Po `cp .env.example .env` vyplňte dva prázdné klíče (nahrazení na místě zabrání duplicitním záznamům):

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

> **Nastavte připojení souborů a pluginů jako absolutní.** `FILE_STORAGE_DIR` a `HEYM_PLUGINS_DIR` mají výchozí relativní cesty `./data/files` a `data/plugins` a vydávaný image spouští backend z `/app/backend`. Pokud zůstanou relativní, přeloží se na `/app/backend/data/files` a `/app/backend/data/plugins`, takže dvě výše uvedená bind připojení nic nepřijmou a nahrané soubory se při výměně kontejneru ztratí. Přepínače `-e` přepíší relativní hodnoty, které dodává `.env.example` prostřednictvím `--env-file`, protože `-e` na příkazovém řádku má přednost před `--env-file`. Compose (`./deploy.sh`) to nepotřebuje: tento image spouští backend z `/app`, kde relativní výchozí hodnoty již míří na připojení.

> **Přístup k Docker socketu.** Připojení `/var/run/docker.sock` dává backendu širokou kontrolu nad Docker daemonem hostitele. Výchozí služba Docker Compose a příklad přímého `docker run` jej zahrnují pro nástroje MCP stdio založené na Dockeru, které spouštějí příkazy `docker`. Karta Logs stále vyžaduje `DOCKER_LOGS_ENABLED=true` a `DOCKER_LOGS_ALLOWED_EMAILS` s čárkou odděleným seznamem e-mailů důvěryhodných uživatelů. Vytvořte důvěryhodný administrátorský účet před povolením Docker logů, nebo ponechte `ALLOW_REGISTER=false`, aby si neověřená vlastní registrace nemohla nárokovat e-mail ze seznamu povolených. Uživatelsky definované Python nástroje tento socket **nedostávají**: běží v samostatném zpevněném kontejneru bez Docker socketu. Viz [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Uzel Codex používá stejný image `ghcr.io/heymrun/heym` jako sourozenecký runner kontejner (`--entrypoint codex`), aby linuxový sandbox Codexu mohl vytvářet namespaces. Ponechte připojení svazku `heym-codex-workspaces`, pokud chcete workflow Codex v přímém nastavení image; runner nedostává Docker socket ani tajné klíče backendu.

> **OpenCode Go runner.** Uzel OpenCode Go používá stejný image jako zpevněný sourozenecký runner (`--entrypoint opencode`) sdílející `heym-opencode-workspaces`. Ponechte toto připojení svazku, pokud chcete workflow OpenCode v přímém nastavení image; runner nedostává Docker socket ani GitHub token.

> **Sandbox skillů.** Python skilly na uzlu Agent běží ve zpevněném sourozeneckém kontejneru, který sdílí svazek `heym-codex-workspaces`, takže toto připojení svazku ponechte i pro skilly — nejen pro Codex. Každé spuštění dostává izolovanou podcestu pro daný běh a sourozenec nedostává ani Docker socket, ani tajné klíče backendu. To vyžaduje **Docker Engine 25.0+**; na starších enginech nebo bez svazku selže `HEYM_PYTHON_TOOL_SANDBOX=auto` bezpečně — nastavte `HEYM_PYTHON_TOOL_SANDBOX=subprocess` pouze pro důvěryhodná jedno-uživatelská nastavení. Viz [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` je vyžadováno pro Playwright.** Docker přiděluje kontejneru 64 MB pro `/dev/shm` a Chromium při tomto limitu zhroutí svůj renderer. Uzly Playwright založené na krocích spouštějí Chromium jako podproces uvnitř tohoto kontejneru, takže platí limit tohoto kontejneru; vlastní `playwrightCode` běží v sourozeneckém kontejneru, který si nastavuje vlastní. `docker-compose.yml` již deklaruje `shm_size: "2gb"`, takže `run.sh` a `deploy.sh` nejsou ovlivněny — pouze prostý `docker run` vyžaduje tento přepínač.

> **Playwright Run Code.** Vlastní Playwright Python vyžaduje `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` a výše uvedené připojení Docker socketu. Release image nastavuje `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` pro rozložení GHCR (`/app/backend/.venv`). Compose `./deploy.sh` standardně nastavuje sandbox image na `heym-backend:local`. Ponechte `--no-sandbox` v argumentech spuštění Chromia uvnitř sandbox kontejnerů.

**Minimální proměnné prostředí pro přímé spuštění image:**

| Proměnná | Vyžadováno | Účel |
|----------|----------|---------|
| `DATABASE_URL` | Volitelné | Úplné přepsání připojovacího řetězce PostgreSQL |
| `POSTGRES_HOST` | Ano, pokud je `DATABASE_URL` prázdné | Hostitel PostgreSQL |
| `POSTGRES_PORT` | Ano, pokud je `DATABASE_URL` prázdné | Port PostgreSQL |
| `POSTGRES_USER` | Ano, pokud je `DATABASE_URL` prázdné | Uživatelské jméno PostgreSQL |
| `POSTGRES_PASSWORD` | Ano, pokud je `DATABASE_URL` prázdné | Heslo PostgreSQL |
| `POSTGRES_DB` | Ano, pokud je `DATABASE_URL` prázdné | Název databáze PostgreSQL |
| `SECRET_KEY` | Ano | Tajný klíč pro podepisování JWT |
| `ENCRYPTION_KEY` | Ano | Šifrovací klíč pro přihlašovací údaje |
| `FRONTEND_URL` | Doporučeno | Veřejná URL prohlížeče, zejména pro OAuth callbacky |
| `CORS_ORIGINS` | Doporučeno | Povolené zdroje prohlížeče |
| `FILE_STORAGE_DIR` | Doporučeno | Nastavte ji na absolutní `/app/data/files`, když tuto cestu připojujete; relativní výchozí hodnota `./data/files` se v tomto image řeší pod `/app/backend` a připojení mine |
| `ALLOW_REGISTER` | Doporučeno | V produkci nastavte `false`, pokud nezamýšlíte otevřenou registraci, ale až poté, co existuje váš admin účet — neexistuje žádný bootstrap prvního uživatele |
| `DOCKER_LOGS_ENABLED` | Volitelné | Nastavte `true`, aby karta Logs mohla využívat přístup k Docker socketu |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Vyžadováno, když `DOCKER_LOGS_ENABLED=true` | Čárkami oddělený seznam e-mailů důvěryhodných uživatelů s povoleným přístupem k Docker logům |
| `HEYM_PLUGINS_ENABLED` | Volitelné | Nastavte `true` pro povolení subsystému pluginů (vlastní uzly instalované jako zip). Ve výchozím stavu vypnuto |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Vyžadováno, když `HEYM_PLUGINS_ENABLED=true` | Čárkami oddělený seznam e-mailů operátorů s povolením instalovat/odinstalovat pluginy |
| `HEYM_PLUGINS_DIR` | Volitelné | Kam se ukládají soubory pluginů. Nastavte ji na absolutní `/app/data/plugins`, když tuto cestu připojujete; relativní výchozí hodnota `data/plugins` se v tomto image řeší pod `/app/backend` a připojení mine |
| `HEYM_PYTHON_TOOL_SANDBOX` | Volitelné | Režim izolace Python nástroje; výchozí je `auto` (zabezpečený Docker sandbox, fail closed). Viz [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Volitelné | Přepište sandbox image Python nástroje; prázdné = automatická detekce backend image |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Volitelné | Docker volume používaný sourozeneckými kontejnery Codex runneru; v Docker nasazeních je výchozí `heym-codex-workspaces` |
| `HEYM_CODEX_NETWORK_ACCESS` | Volitelné | Povolit sandboxovaným příkazům Codexu stahovat soubory/závislosti; Docker nasazení to povolují ve výchozím stavu |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Volitelné | Docker volume používaný sourozeneckými kontejnery OpenCode runneru; v Docker nasazeních je výchozí `heym-opencode-workspaces` |

**Poznámky:**

- Image zpřístupňuje port `4017`
- Backend zůstává interní a je proxy pod `/api`
- Když `POSTGRES_HOST=localhost`, release image jej v případě potřeby automaticky přepíše na `host.docker.internal`, aby stejný `.env` fungoval s kontejnerem PostgreSQL na úrovni hostitele v nástrojích macOS Docker/Desktop
- Ponechte připojení `data/files`, pokud chcete, aby nahrávání do Drive a soubory generované skilly přežily restart kontejneru
- **Pluginy:** pro jejich povolení nastavte `HEYM_PLUGINS_ENABLED=true` a `HEYM_PLUGIN_ADMIN_EMAILS` a připojte `data/plugins`, aby soubory nainstalovaných pluginů přetrvaly opětovné vytvoření kontejneru. Metadata pluginů žijí ve vašem PostgreSQL, takže také přetrvají. Pip `dependencies` deklarované pluginem se instalují do kontejneru v době instalace; protože je souborový systém image efemérní, jsou **při startu automaticky přeinstalovány** pro každý nainstalovaný plugin (venv `uv` v release image je zapisovatelný, takže to funguje i v single-container image)

### Přesun existující databáze do pojmenovaného volume

`./deploy.sh --migrate-pgdata` zná pouze Compose stack. Pokud spouštíte release image proti vlastnímu kontejneru PostgreSQL a tento kontejner připojuje adresář hostitele pomocí bind mount, migrujte jej sami.

Nejprve zkontrolujte, co váš databázový kontejner používá:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Pokud `"Type"` uvádí `bind`, přesuňte jej do pojmenovaného volume:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
```
#    název volume, pokud tento Docker host provozuje více než jedno nasazení Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Znovu spusťte PostgreSQL na volume a použijte stejné přepínače jako dříve,
#    ale nahraďte bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Jakmile začne přijímat připojení, přestavte indexy.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**V krocích 2 a 3 použijte vlastní image, nikoli `postgres:16`.** Pokud vaše databáze používá `pgvector/pgvector:pg16` nebo jinou variantu, spuštění zkopírovaného clusteru se standardním image může selhat, protože chybí knihovny rozšíření, které očekává.

Váš původní datový adresář zůstává tímto postupem nedotčen, takže představuje vaši cestu pro rollback. Smažte jej teprve poté, co ověříte, že migrovaná databáze obsluhuje vaše workflow. Krok 4 je důležitý ze stejného důvodu jako při migraci Compose: kopie s sebou přenáší veškeré existující poškození indexů.

---

## Provoz více než jedné instance

Vše výše uvedené nasazuje jednu instanci Heym. Jakmile jeden stroj přestane stačit, namiřte druhou instanci na stejnou databázi PostgreSQL a ta se připojí jako worker: běhy na pozadí — cron, webhooky, volání nástrojů MCP, chat triggery — jsou pak mezi instancemi sdíleny podle procent, která nastavíte v části **Settings → Instances**.

Instance spolu nikdy nekomunikují. Práci přenáší Postgres, takže worker nepotřebuje otevřený port ani cestu zpět k hlavní instanci a není zapojen žádný message broker. Práce, která se dotýká lokálního disku — soubory Drive, pracovní prostory coding-agenta, nainstalované pluginy — vždy běží na hlavní instanci, takže není třeba nic sdílet přes filesystem.

Dvě pravidla, která za vás cluster nemůže vynutit: každá instance musí používat stejný `SECRET_KEY` a `ENCRYPTION_KEY` a ingress musí směřovat pouze na hlavní instanci. Obě jsou vysvětlena spolu s pravidly umístění a způsobem volby procent v části [Load Distribution](../reference/cluster.md).

> Toto je rozložení zátěže, nikoli vysoká dostupnost. Hlavní instance zůstává jediným bodem selhání pro ingress, úložiště souborů a editor.

## Běžné postupy

**Prvotní nastavení:**

```bash
./run.sh          # development — vytvoří .env z .env.example a automaticky vygeneruje SECRET_KEY/ENCRYPTION_KEY
# nebo
./deploy.sh       # production — stejné automatické vytvoření .env a generování klíčů
```

U předpřipraveného image `docker run` nejprve vygenerujte klíče ručně (viz část **Prebuilt Image** výše).

**Aktualizace produkce po změně kódu:**

```bash
git pull
./deploy.sh       # přestaví image, výměna bez výpadku
```

**Kontrola produkčních logů:**

```bash
./deploy.sh --logs
```

**Zastavení produkčních služeb:**

```bash
./deploy.sh --down
```

---

## Související

- [Introduction](./introduction.md) – Přehled platformy
- [Quick Start](./quick-start.md) – Vytvořte své první workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Úplná reference konfigurace
- [Security](../reference/security.md) – Nastavení JWT, šifrování a CORS
- [Load Distribution](../reference/cluster.md) – Provoz několika instancí proti jedné databázi

# Uruchamianie i wdrażanie

Heym udostępnia dwa skrypty dla różnych środowisk: `run.sh` do lokalnego rozwoju oraz `deploy.sh` do wdrożeń produkcyjnych z użyciem Docker Compose.

> **Przewodnik wideo:** [Skonfiguruj Heym lokalnie w mniej niż 2 minuty](https://www.youtube.com/watch?v=P6YvlupUboU) — sklonuj repozytorium, uruchom PostgreSQL, uzupełnij wymagane zmienne środowiskowe i utwórz pierwsze konto na lokalnej instancji.

## Wymagania wstępne

Oba skrypty wymagają zainstalowania następujących narzędzi:

| Narzędzie | Przeznaczenie |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Kontener bazy danych (dev) oraz pełny stos (prod) |
| [uv](https://github.com/astral-sh/uv) | Menedżer pakietów Pythona dla backendu |
| [bun](https://bun.sh) | Środowisko uruchomieniowe JavaScript dla frontendu |

## Konfiguracja środowiska

Zarówno `run.sh`, jak i `deploy.sh` odczytują dane z pliku `.env` w katalogu głównym projektu. Jeśli plik nie istnieje, skrypt automatycznie tworzy go na podstawie `.env.example` — zarówno dla lokalnego rozwoju, jak i dla produkcji.

`SECRET_KEY` oraz `ENCRYPTION_KEY` są dostarczane jako puste w `.env.example`. Gdy którykolwiek z nich jest pusty, `run.sh` i `deploy.sh` automatycznie generują kryptograficznie silną wartość i zapisują ją z powrotem do `.env`, dzięki czemu świeża konfiguracja nie wymaga ręcznego zarządzania kluczami. Jeśli istniejący plik `.env` nadal zawiera starszy placeholder `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), skrypty zatrzymują się z jawnym błędem zamiast go nadpisywać — rotacja tego klucza spowodowałaby, że wcześniej zaszyfrowane dane logowania stałyby się nieczytelne. Sam backend również odmawia uruchomienia, jeśli którykolwiek klucz jest pusty lub pozostawiony na znanym placeholderze.

Aby utworzyć plik ręcznie (opcjonalnie — skrypty robią to automatycznie):

```bash
cp .env.example .env
```

Kluczowe zmienne środowiskowe:

Pełną listę obsługiwanych zmiennych, wartości domyślnych oraz uwag produkcyjnych można znaleźć w [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Zmienna | Opis |
|----------|-------------|
| `SECRET_KEY` | **Wymagana.** Sekret podpisywania JWT. Automatycznie generowany przez `run.sh`/`deploy.sh`, gdy pusty. |
| `ENCRYPTION_KEY` | **Wymagana.** Klucz szyfrowania danych logowania. Automatycznie generowany przez `run.sh`/`deploy.sh`, gdy pusty. |
| `DATABASE_URL` | Opcjonalne nadpisanie ciągu połączenia z bazą danych. Jeśli puste, Heym buduje go z ustawień `POSTGRES_*`. |
| `BACKEND_PORT` | Port API backendu — domyślnie `10105` |
| `FRONTEND_PORT` | Port frontendu — domyślnie `4017` |
| `FRONTEND_URL` | **Wymagana w produkcji.** Publiczny URL aplikacji (schemat + host, np. `https://heym.example.com`). Używany dla URI przekierowań OAuth (Google Sheets, BigQuery, Notion i podobne) oraz dla linków do przeglądu, kontynuacji Codex i plików generowanych przez uruchomienia w tle; musi odpowiadać URL-owi używanemu przez użytkowników w przeglądarce. W klastrze należy ustawić tę samą wartość na każdej instancji. |
| `ALLOW_REGISTER` | Otwarta rejestracja użytkowników (`false` w prod, `true` w dev). Przełącz na `false` dopiero po utworzeniu konta administratora — nie istnieje bootstrap pierwszego użytkownika, więc pusta baza danych wraz z wyłączoną rejestracją uniemożliwia utworzenie jakiegokolwiek konta. |
| `DOCKER_LOGS_ENABLED` | Włącza dostęp do zakładki Logs opartej na Dockerze, gdy ustawione na `true`; wymaga również dostępu do gniazda Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Rozdzielana przecinkami lista zaufanych adresów e-mail użytkowników uprawnionych do dostępu do logów Dockera, gdy `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Maksymalny rozmiar treści żądania HTTP akceptowany przed uruchomieniem handlerów endpointów; domyślnie `100`, o jeden MB więcej niż `FILE_MAX_SIZE_MB`, aby pozostawić miejsce na narzut multipart |
| `HEYM_PYTHON_TOOL_SANDBOX` | Sposób uruchamiania narzędzi Pythona definiowanych przez użytkownika: `auto` (domyślnie — wzmocniony, izolowany kontener Docker; fail closed, jeśli Docker jest niedostępny), `docker` (to samo, nigdy nie przechodzi do fallbacku) lub `subprocess` (lokalny fallback w procesie; nie stanowi granicy bezpieczeństwa, tylko zaufany/dev). `run.sh` ustawia `subprocess` dla natywnego dev. Zobacz [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Obraz używany dla sandboxa Docker narzędzi Pythona. Puste = automatyczne wykrycie działającego obrazu backendu. |

Domyślne ustawienia połączenia z bazą danych (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) są udokumentowane w [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) oraz `.env.example`.

---
## Development: `run.sh`

`run.sh` uruchamia wszystkie trzy usługi lokalnie — bazę danych (jako kontener Docker), backend FastAPI oraz serwer deweloperski Vite — za pomocą jednego polecenia.

```bash
./run.sh
```

**Co robi, krok po kroku:**

1. Sprawdza, czy dostępne są `docker`, `bun` oraz `uv`
2. Tworzy `.env` na podstawie `.env.example`, jeśli plik nie istnieje, oraz generuje losowe wartości `SECRET_KEY` i `ENCRYPTION_KEY`, gdy którakolwiek z nich jest pusta
3. Uruchamia (lub tworzy) kontener Docker bazy danych na porcie `6543`, przechowując jego dane w wolumenie Docker `heym-postgres-data`, a nie w katalogu hosta
4. Instaluje zależności Pythona za pomocą `uv sync`
5. Uruchamia migracje bazy danych Alembic (`alembic upgrade head`)
6. Zwalnia porty backendu i frontendu, jeśli są zajęte
7. Uruchamia backend FastAPI z opcją `--reload` (hot-reload przy zmianach w kodzie)
8. Instaluje zależności frontendu za pomocą `bun install`
9. Uruchamia serwer deweloperski Vite

**Opcje:**

| Flaga | Opis |
|------|-------------|
| *(brak)* | Uruchomienie z włączonym logowaniem debugowania (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Uruchomienie z domyślnym poziomem logowania (bez danych debugowania) |
| `--help` | Wyświetlenie informacji o użyciu |

**Adresy usług (dev):**

| Usługa | Adres |
|---------|---------|
| Frontend | `localhost` na `FRONTEND_PORT` (domyślnie: 4017) |
| Backend API | `localhost` na `BACKEND_PORT` (domyślnie: 10105) |
| Interaktywna dokumentacja API | `localhost:10105/docs` |
| Baza danych | `localhost:6543` |

Naciśnięcie `Ctrl+C` powoduje łagodne zatrzymanie wszystkich usług.

---

## Testy end-to-end: `run_e2e.sh`

Zestaw testów Playwright dla frontendu działa przeciwko rzeczywistej aplikacji Vue, backendowi FastAPI oraz izolowanej bazie danych PostgreSQL:

```bash
./run_e2e.sh
```

Zestaw ten stanowi smoke i regresyjny zestaw kluczowych ścieżek, a nie wyczerpujące pokrycie produktu. Obejmuje uwierzytelnianie, cykl życia i wykonanie podstawowego workflow, wybrane zasoby dashboardu, trasy publiczne oraz zamockowany interfejs przeglądu HITL. Integracje z dostawcami, każdy typ węzła, macierze udostępniania i uprawnień oraz pełne wykonanie wznowienia HITL pozostają pokryte głównie przez testy backendu lub wymagają dedykowanych środowisk integracyjnych.

Każde uruchomienie otrzymuje własny tymczasowy kontener PostgreSQL 16, losowe dostępne porty bazy danych/backendu/frontendu, stan uwierzytelniania, wyniki testów oraz raport HTML. Umożliwia to równoczesne uruchomienie wielu procesów `run_e2e.sh` bez współdzielenia stanu lub nadpisywania artefaktów. Skrypt usuwa swój kontener bazy danych po zakończeniu uruchomienia i wyświetla katalog artefaktów oraz ścieżkę raportu.

Przydatne polecenia:

```bash
./run_e2e.sh --ui         # Interaktywny runner Playwright z izolowaną bazą danych
cd frontend
bun run test:e2e:report   # Otwarcie ostatnio zakończonego lokalnego uruchomienia
```

Bezpośrednie uruchomienia `bun run test:e2e` oraz `bun run test:e2e:ui` wymagają jawnego `DATABASE_URL`, aby nie mogły w sposób niezauważony uruchomić się przeciwko lokalnej bazie danych deweloperskich. Do standardowych uruchomień lokalnych należy używać `./run_e2e.sh`.

`./check.sh` uruchamia lint, typecheck, formatowanie oraz testy backendu bez zestawu E2E, utrzymując domyślną ścieżkę sprawdzania lokalnego jako szybką. Testy Playwright E2E należy uruchamiać osobno za pomocą `./run_e2e.sh`. Pull requesty zawsze uruchamiają zestaw E2E Chromium w GitHub Actions i zachowują traces, zrzuty ekranu, nagrania wideo oraz raport HTML w przypadku wystąpienia błędów.

---
## Produkcja: `deploy.sh`

`deploy.sh` buduje i uruchamia cały stos przy użyciu Docker Compose. Wszystkie trzy usługi — baza danych, backend oraz frontend — działają jako kontenery. Punkt wejścia backendu automatycznie uruchamia migracje przed startem serwera z 8 workerami.

**Pierwsze wdrożenie (build + start):**

```bash
./deploy.sh
```

Wykonywane jest wdrożenie bez przestojów: obrazy są budowane w pierwszej kolejności, podczas gdy istniejące kontenery nadal działają, a następnie następuje podmiana na nową wersję.

**Dostępne polecenia:**

| Polecenie | Opis |
|---------|-------------|
| `./deploy.sh` | Buduje obrazy i uruchamia/aktualizuje wszystkie usługi |
| `./deploy.sh --status` | Wyświetla status kontenerów |
| `./deploy.sh --logs` | Strumieniuje logi ze wszystkich kontenerów |
| `./deploy.sh --restart` | Restartuje wszystkie kontenery |
| `./deploy.sh --down` | Zatrzymuje i usuwa wszystkie kontenery |
| `./deploy.sh --migrate-pgdata` | Jednorazowa migracja: kopiuje istniejący katalog `data/postgres` do wolumenu Docker `heym-postgres-data` i przebudowuje jego indeksy |
| `./deploy.sh --help` | Wyświetla informacje o użyciu |

**Przechowywanie bazy danych: nazwany wolumen Docker, a nie katalog hosta.**

Compose przechowuje PostgreSQL w wolumenie Docker `heym-postgres-data`. Wcześniejsze wersje montowały zamiast tego katalog hosta `./data/postgres` poprzez bind mount. Bind mounty hosta w systemach macOS (virtiofs) oraz Windows/WSL2 nie zapewniają PostgreSQL gwarancji `fsync` i zamknięcia pliku, których wymaga: klastry w takich środowiskach napotykają na segmentach WAL błąd `PANIC: could not close file … Input/output error` i z czasem ulegają uszkodzeniu. Bind mounty w systemie Linux nigdy nie były dotknięte tym problemem, ale obecnie każda platforma korzysta z tego samego układu.

Aktualizacja wdrożenia, które nadal przechowuje dane w `./data/postgres`, wymaga jednorazowego kroku. `./deploy.sh` wykrywa taką sytuację, zatrzymuje się przed budowaniem i prosi o uprzednią migrację:

```bash
./deploy.sh --migrate-pgdata   # zatrzymaj usługi, skopiuj do wolumenu, przebuduj indeksy
./deploy.sh                    # wdróż jak zwykle
```

**Migracja przebudowuje również indeksy.** Kopia jest wykonywana bajt po bajcie, więc uszkodzenia indeksów spowodowane przez stary bind mount są przenoszone razem z nią. Dlatego `--migrate-pgdata` uruchamia samą usługę `postgres` na nowym wolumenie, wykonuje na niej `reindexdb`, a następnie zatrzymuje ją ponownie, zanim uruchomiona zostanie reszta stosu. Ma to znaczenie, ponieważ tego rodzaju uszkodzenie pozostawia wpisy indeksu wskazujące poza koniec sterty — stan, który `pg_amcheck` raportuje jako poprawny, więc pomyślna weryfikacja nie jest dowodem na zdrowe tabele. REINDEX naprawia te wpisy; nie jest jednak w stanie przywrócić stron sterty, które stary system plików już utracił. W przypadku dużej, znanej jako zdrowej bazy danych można pominąć przebudowę za pomocą `./deploy.sh --migrate-pgdata --skip-reindex`.

Kopiowanie jest nieinwazyjne. Katalog `./data/postgres` pozostaje na miejscu jako kopia zapasowa, a migracja odmawia nadpisania wolumenu, który już zawiera bazę danych. Jeśli którykolwiek krok zakończy się niepowodzeniem, nowy wolumen jest usuwany, dzięki czemu częściowo zmigrowany klaster nigdy nie zostanie omyłkowo wdrożony. Stary katalog można usunąć po potwierdzeniu, że workflow działają prawidłowo. Kontener `postgres` posiada tę samą zabezpieczającą kontrolę, więc ręczne `docker compose up` również nie może po cichu zainicjalizować pustej bazy danych na istniejących danych. Świeże instalacje nie wymagają żadnych działań.

**Adresy usług (produkcja):**

Kontener frontendu jest wystawiony na porcie `FRONTEND_PORT` (domyślnie: 4017). API backendu jest udostępniane pod ścieżką `/api`, proxowane przez kontener frontendu — dzięki temu w produkcji istnieje tylko jeden port publiczny.

**Przegląd kontenerów:**

| Kontener | Opis |
|-----------|-------------|
| `heym-db` | Relacyjna baza danych |
| `heym-backend` | Serwer API FastAPI (8 workerów, budowany z `backend/Dockerfile`) |
| `heym-frontend` | Kontener podglądu frontendu serwujący zbudowaną aplikację Vue (budowany z `frontend/Dockerfile`) |

**Plakietka aktualizacji wersji:**

Nagłówek aplikacji wyświetla wersję działającego builda Docker. Gdy wersja ta jest starsza niż najnowsze wydanie Heym na GitHubie, obok wersji pojawia się fioletowa plakietka **Update**. Kliknięcie wersji lub plakietki otwiera stronę wydań Heym na GitHubie.

---
## Gotowy obraz: `docker run`

Jeśli nie ma potrzeby budowania aplikacji lokalnie, można pobrać opublikowany obraz kontenera i uruchomić go bezpośrednio.

Obraz uruchamia frontend i backend razem w jednym kontenerze. PostgreSQL pozostaje zewnętrzny, ale można podać albo `DATABASE_URL`, albo zmienne `POSTGRES_*` z `.env.example`.

> **Przechowywanie bazy danych w nazwanym wolumenie Docker.** Obraz wydania nie zawiera bazy danych, więc PostgreSQL stojący za `DATABASE_URL` należy uruchomić samodzielnie. Należy go zamontować jako `-v heym-postgres-data:/var/lib/postgresql/data`, a nie jako ścieżkę hosta: w systemie macOS (virtiofs) oraz Windows/WSL2 katalog danych PostgreSQL zamontowany przez bind mount nie spełnia gwarancji `fsync` wymaganych przez bazę danych i z czasem uszkadza klaster.

> **Backend magazynu wektorowego.** Skrypty `run.sh` i `deploy.sh` uruchamiają oficjalny obraz `postgres:16` i automatycznie instalują pakiet `postgresql-16-pgvector` przy starcie, dzięki czemu **backend RAG Postgres (pgvector)** działa tam od razu, bez zmian w danych. Jednak gotowy obraz jednokontenerowy łączy się z PostgreSQL, który **użytkownik** dostarcza — ta baza danych musi obsługiwać rozszerzenie `vector`, aby korzystać z backendu Postgres. Heym nie może zainstalować pgvector w bazie danych, którą nie zarządza. Bez niego migracja startowa w sposób kontrolowany pomija tabelę pgvector — wdrożenie nadal się powodzi, RAG Qdrant nadal działa, a tworzenie magazynu wektorowego Postgres lub przesyłanie do niego danych zwraca czytelny komunikat „backend unavailable" do momentu włączenia pgvector.

**Klucze należy ustawić samodzielnie przy bezpośrednim uruchomieniu obrazu.** W przeciwieństwie do `run.sh`/`deploy.sh` gotowy obraz nie generuje kluczy automatycznie. Po wykonaniu `cp .env.example .env` należy wypełnić dwa puste klucze (zastąpienie w miejscu pozwala uniknąć zduplikowanych wpisów):

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

> **Montaże plików i wtyczek muszą być ścieżkami bezwzględnymi.** `FILE_STORAGE_DIR` i `HEYM_PLUGINS_DIR` domyślnie wskazują ścieżki względne `./data/files` oraz `data/plugins`, a obraz wydania uruchamia backend z katalogu `/app/backend`. Pozostawione jako względne, rozwiązują się do `/app/backend/data/files` i `/app/backend/data/plugins`, więc dwa powyższe montaże bind nie otrzymują niczego, a przesłane pliki są tracone przy wymianie kontenera. Flagi `-e` nadpisują wartości względne dostarczane przez `.env.example` za pośrednictwem `--env-file`, ponieważ `-e` z wiersza poleceń ma pierwszeństwo nad `--env-file`. Compose (`./deploy.sh`) tego nie wymaga: ten obraz uruchamia backend z katalogu `/app`, gdzie względne wartości domyślne już trafiają na montaże.

> **Dostęp do gniazda Docker.** Zamontowanie `/var/run/docker.sock` daje backendowi szeroką kontrolę nad demonem Docker hosta. Domyślna usługa Docker Compose oraz bezpośredni przykład `docker run` zawierają je dla narzędzi MCP stdio opartych na Dockerze, które wykonują polecenia `docker`. Zakładka Logs nadal wymaga `DOCKER_LOGS_ENABLED=true` oraz `DOCKER_LOGS_ALLOWED_EMAILS` z listą zaufanych adresów e-mail użytkowników oddzielonych przecinkami. Należy utworzyć zaufane konto administratora przed włączeniem logów Docker albo pozostawić `ALLOW_REGISTER=false`, aby niezweryfikowana samodzielna rejestracja nie mogła przejąć adresu e-mail z listy dozwolonych. Narzędzia Python definiowane przez użytkownika **nie** otrzymują tego gniazda: działają w osobnym wzmocnionym kontenerze bez gniazda Docker. Zobacz [Security](../reference/security.md#python-tool-sandbox).

> **Runner Codex.** Węzeł Codex używa tego samego obrazu `ghcr.io/heymrun/heym` jako bratniego kontenera runnera (`--entrypoint codex`), aby piaskownica Linuksa Codex mogła tworzyć przestrzenie nazw. Należy zachować montaż wolumenu `heym-codex-workspaces`, jeśli w bezpośredniej konfiguracji obrazu mają działać workflow Codex; runner nie otrzymuje gniazda Docker ani sekretów backendu.

> **Runner OpenCode Go.** Węzeł OpenCode Go używa tego samego obrazu jako wzmocnionego bratniego runnera (`--entrypoint opencode`) współdzielącego `heym-opencode-workspaces`. Należy zachować ten montaż wolumenu, jeśli w bezpośredniej konfiguracji obrazu mają działać workflow OpenCode; runner nie otrzymuje gniazda Docker ani tokenu GitHub.

> **Piaskownica umiejętności.** Umiejętności Python w węźle Agent działają w wzmocnionym bratnim kontenerze współdzielącym wolumen `heym-codex-workspaces`, więc należy zachować ten montaż wolumenu również dla umiejętności — nie tylko dla Codex. Każde uruchomienie otrzymuje odizolowaną podścieżkę na przebieg, a bratni kontener nie otrzymuje ani gniazda Docker, ani sekretów backendu. Wymaga to **Docker Engine 25.0+**; w starszych wersjach silnika lub bez wolumenu `HEYM_PYTHON_TOOL_SANDBOX=auto` kończy się bezpiecznym niepowodzeniem — `HEYM_PYTHON_TOOL_SANDBOX=subprocess` należy ustawić wyłącznie w zaufanych konfiguracjach jednoosobowych. Zobacz [Security](../reference/security.md#skill-sandbox).
> **`--shm-size 2g` jest wymagane dla Playwright.** Docker przydziela kontenerowi 64 MB na `/dev/shm`, a Chromium w takich warunkach powoduje awarię procesu renderującego. Węzły Playwright oparte na krokach uruchamiają Chromium jako podproces wewnątrz tego kontenera, więc limit dotyczy tego kontenera; niestandardowy `playwrightCode` działa w kontenerze siostrzanym, który ustawia własny limit. Plik `docker-compose.yml` już deklaruje `shm_size: "2gb"`, więc `run.sh` i `deploy.sh` nie wymagają zmian — jedynie zwykłe `docker run` wymaga tej flagi.

> **Playwright Run Code.** Niestandardowy kod Playwright w Pythonie wymaga `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` oraz zamontowania gniazda Docker wskazanego powyżej. Obraz wydania ustawia `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` dla układu GHCR (`/app/backend/.venv`). W Compose `./deploy.sh` domyślnie ustawia obraz sandboxa na `heym-backend:local`. Należy zachować `--no-sandbox` w argumentach uruchomieniowych Chromium wewnątrz kontenerów sandboxa.

**Minimalne zmienne środowiskowe dla bezpośredniego uruchomienia obrazu:**

| Zmienna | Wymagana | Przeznaczenie |
|----------|----------|---------|
| `DATABASE_URL` | Opcjonalna | Pełne nadpisanie ciągu połączenia PostgreSQL |
| `POSTGRES_HOST` | Tak, jeśli `DATABASE_URL` jest puste | Host PostgreSQL |
| `POSTGRES_PORT` | Tak, jeśli `DATABASE_URL` jest puste | Port PostgreSQL |
| `POSTGRES_USER` | Tak, jeśli `DATABASE_URL` jest puste | Nazwa użytkownika PostgreSQL |
| `POSTGRES_PASSWORD` | Tak, jeśli `DATABASE_URL` jest puste | Hasło PostgreSQL |
| `POSTGRES_DB` | Tak, jeśli `DATABASE_URL` jest puste | Nazwa bazy danych PostgreSQL |
| `SECRET_KEY` | Tak | Sekret podpisywania JWT |
| `ENCRYPTION_KEY` | Tak | Klucz szyfrowania danych logowania |
| `FRONTEND_URL` | Zalecana | Publiczny adres URL przeglądarki, szczególnie dla callbacków OAuth |
| `CORS_ORIGINS` | Zalecana | Dozwolone originy przeglądarki |
| `FILE_STORAGE_DIR` | Zalecana | Należy ustawić na bezwzględną ścieżkę `/app/data/files` przy montowaniu tej ścieżki; domyślna względna wartość `./data/files` rozwiązuje się pod `/app/backend` w tym obrazie i omija punkt montowania |
| `ALLOW_REGISTER` | Zalecana | Należy ustawić `false` w środowisku produkcyjnym, chyba że otwarta rejestracja jest zamierzona, ale dopiero po utworzeniu konta administratora — nie istnieje mechanizm bootstrap pierwszego użytkownika |
| `DOCKER_LOGS_ENABLED` | Opcjonalna | Należy ustawić `true`, aby umożliwić karcie Logs korzystanie z dostępu do gniazda Docker |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Wymagana, gdy `DOCKER_LOGS_ENABLED=true` | Rozdzielana przecinkami lista zaufanych adresów e-mail użytkowników uprawnionych do dostępu do logów Docker |
| `HEYM_PLUGINS_ENABLED` | Opcjonalna | Należy ustawić `true`, aby włączyć podsystem wtyczek (niestandardowe węzły instalowane jako zip). Domyślnie wyłączone |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Wymagana, gdy `HEYM_PLUGINS_ENABLED=true` | Rozdzielana przecinkami lista adresów e-mail operatorów uprawnionych do instalowania/odinstalowywania wtyczek |
| `HEYM_PLUGINS_DIR` | Opcjonalna | Miejsce przechowywania plików wtyczek. Należy ustawić na bezwzględną ścieżkę `/app/data/plugins` przy montowaniu tej ścieżki; domyślna względna wartość `data/plugins` rozwiązuje się pod `/app/backend` w tym obrazie i omija punkt montowania |
| `HEYM_PYTHON_TOOL_SANDBOX` | Opcjonalna | Tryb izolacji narzędzia Python; domyślnie `auto` (wzmocniony sandbox Docker, fail closed). Zobacz [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | Opcjonalna | Nadpisanie obrazu sandboxa narzędzia Python; puste = automatyczne wykrycie obrazu backendu |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | Opcjonalna | Wolumen Docker używany przez siostrzane kontenery runnera Codex; domyślnie `heym-codex-workspaces` we wdrożeniach Docker |
| `HEYM_CODEX_NETWORK_ACCESS` | Opcjonalna | Zezwolenie na pobieranie plików/zależności przez polecenia Codex w sandboxie; wdrożenia Docker włączają to domyślnie |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | Opcjonalna | Wolumen Docker używany przez siostrzane kontenery runnera OpenCode; domyślnie `heym-opencode-workspaces` we wdrożeniach Docker |

**Uwagi:**

- Obraz udostępnia port `4017`
- Backend pozostaje wewnętrzny i jest proxowany pod `/api`
- Gdy `POSTGRES_HOST=localhost`, obraz wydania automatycznie przepisuje go na `host.docker.internal`, gdy jest to konieczne, aby ten sam plik `.env` działał z kontenerem PostgreSQL na poziomie hosta w narzędziach macOS Docker/Desktop
- Należy zachować punkt montowania `data/files`, jeśli pliki wysyłane do Drive i pliki generowane przez umiejętności mają przetrwać restarty kontenera
- **Wtyczki:** aby je włączyć, należy ustawić `HEYM_PLUGINS_ENABLED=true` i `HEYM_PLUGIN_ADMIN_EMAILS` oraz zamontować `data/plugins`, aby zainstalowane pliki wtyczek przetrwały odtwarzanie kontenera. Metadane wtyczek znajdują się w PostgreSQL, więc również przetrwają. Zadeklarowane zależności pip wtyczki są instalowane w kontenerze w momencie instalacji; ponieważ system plików obrazu jest efemeryczny, są one **automatycznie reinstalowane przy starcie** dla każdej zainstalowanej wtyczki (venv `uv` w obrazie wydania jest zapisywalny, więc działa to również w obrazie jednokontenerowym)

### Przenoszenie istniejącej bazy danych do nazwanego wolumenu

`./deploy.sh --migrate-pgdata` zna wyłącznie stos Compose. Jeśli obraz wydania jest uruchamiany względem własnego kontenera PostgreSQL, a kontener ten bind-montuje katalog hosta, należy przeprowadzić migrację samodzielnie.

Najpierw należy sprawdzić, czego używa kontener bazy danych:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Jeśli `"Type"` wskazuje `bind`, należy przenieść go do nazwanego wolumenu:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own
#   nazwa wolumenu, jeśli ten host Docker uruchamia więcej niż jedno wdrożenie Heym.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. Ponowne uruchomienie PostgreSQL na wolumenie z użyciem flag stosowanych wcześniej,
#    ale z zastąpieniem bind mount.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. Gdy baza zacznie przyjmować połączenia, przebuduj indeksy.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**W krokach 2 i 3 należy użyć własnego obrazu, a nie `postgres:16`.** Jeśli baza danych działa na `pgvector/pgvector:pg16` lub innym wariancie, uruchomienie skopiowanego klastra na standardowym obrazie może się nie powieść z powodu braku bibliotek rozszerzeń, których oczekuje.

Ten proces nie modyfikuje oryginalnego katalogu danych, dzięki czemu pozostaje on ścieżką rollback. Można go usunąć dopiero po potwierdzeniu, że zmigrowana baza obsługuje workflow. Krok 4 ma znaczenie z tego samego powodu co w migracji Compose: kopia przenosi wszelkie istniejące uszkodzenia indeksów.

---

## Uruchamianie więcej niż jednej instancji

Wszystko powyżej dotyczy wdrożenia pojedynczej instancji Heym. Gdy jedna maszyna przestaje wystarczać, należy wskazać drugą instancję na tę samą bazę PostgreSQL — dołączy ona jako worker: uruchomienia w tle — cron, webhooki, wywołania narzędzi MCP, triggery Chat — są wówczas rozdzielane między instancjami według procentowego udziału ustawionego w **Settings → Instances**.

Instancje nie komunikują się ze sobą. Pracę przenosi Postgres, więc worker nie potrzebuje otwartego portu ani trasy powrotnej do instancji głównej, a żaden broker wiadomości nie jest zaangażowany. Praca związana z lokalnym dyskiem — pliki Drive, przestrzenie robocze agentów kodujących, zainstalowane wtyczki — zawsze odbywa się na instancji głównej, więc nic nie musi być współdzielone przez system plików.

Dwie zasady, których klaster nie może wyegzekwować: każda instancja musi używać tego samego `SECRET_KEY` i `ENCRYPTION_KEY`, a ruch przychodzący musi być kierowany wyłącznie do instancji głównej. Obie są wyjaśnione — wraz z regułami rozmieszczenia i sposobem doboru wartości procentowych — w [Load Distribution](../reference/cluster.md).

> To rozkład obciążenia, a nie wysoka dostępność. Instancja główna pozostaje pojedynczym punktem awarii dla ruchu przychodzącego, przechowywania plików i edytora.

## Typowe workflow

**Konfiguracja początkowa:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

W przypadku gotowego obrazu `docker run` należy najpierw wygenerować klucze ręcznie (patrz sekcja **Prebuilt Image** powyżej).

**Aktualizacja środowiska produkcyjnego po zmianie kodu:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Sprawdzenie logów środowiska produkcyjnego:**

```bash
./deploy.sh --logs
```

**Zatrzymanie usług produkcyjnych:**

```bash
./deploy.sh --down
```

---

## Powiązane

- [Introduction](./introduction.md) – Przegląd platformy
- [Quick Start](./quick-start.md) – Zbuduj pierwszy workflow
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pełna dokumentacja konfiguracji
- [Security](../reference/security.md) – Ustawienia JWT, szyfrowania i CORS
- [Load Distribution](../reference/cluster.md) – Uruchamianie kilku instancji na jednej bazie danych

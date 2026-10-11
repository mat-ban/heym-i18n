# Стартиране и внедряване

Heym предоставя два скрипта за различни среди: `run.sh` за локална разработка и `deploy.sh` за продукционни внедрявания чрез Docker Compose.

> **Видео ръководство:** [Настройте Heym локално за под 2 минути](https://www.youtube.com/watch?v=P6YvlupUboU) — клонирайте хранилището, стартирайте PostgreSQL, попълнете необходимите променливи на средата и създайте първия си акаунт в локален екземпляр.

## Предварителни изисквания

И двата скрипта изискват инсталирани следните инструменти:

| Инструмент | Предназначение |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | Контейнер за база данни (dev) и пълен стек (prod) |
| [uv](https://github.com/astral-sh/uv) | Мениджър на Python пакети за backend-а |
| [bun](https://bun.sh) | JavaScript среда за изпълнение за frontend-а |

## Настройка на средата

Както `run.sh`, така и `deploy.sh` четат от файл `.env` в основната директория на проекта. Ако той не съществува, скриптът автоматично създава такъв от `.env.example` — както за локална разработка, така и за продукция.

`SECRET_KEY` и `ENCRYPTION_KEY` се доставят празни в `.env.example`. Когато някой от тях е празен, `run.sh` и `deploy.sh` генерират криптографски силна стойност автоматично и я записват обратно в `.env`, така че при нова настройка не е необходимо ръчно управление на ключове. Ако съществуващ `.env` все още съдържа остарелия placeholder за `ENCRYPTION_KEY` (`change_this_to_a_random_32_byte_hex_value`), скриптовете спират с изрична грешка, вместо да го презапишат — ротацията на този ключ би направила предварително криптираните идентификационни данни нечетими. Самият backend също отказва да стартира, ако някой от ключовете е празен или е оставен на известен placeholder.

За да създадете файла ръчно (по избор — скриптовете правят това вместо Вас):

```bash
cp .env.example .env
```

Ключови променливи на средата:

За всяка поддържана променлива, стойност по подразбиране и бележка за продукция вижте [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Променлива | Описание |
|----------|-------------|
| `SECRET_KEY` | **Задължителна.** Тайна за подписване на JWT. Автоматично генерирана от `run.sh`/`deploy.sh`, когато е празна. |
| `ENCRYPTION_KEY` | **Задължителна.** Ключ за криптиране на идентификационни данни. Автоматично генериран от `run.sh`/`deploy.sh`, когато е празен. |
| `DATABASE_URL` | По избор заместващ низ за връзка с базата данни. Ако е празен, Heym го изгражда от настройките `POSTGRES_*`. |
| `BACKEND_PORT` | Порт на Backend API — по подразбиране `10105` |
| `FRONTEND_PORT` | Порт на Frontend — по подразбиране `4017` |
| `FRONTEND_URL` | **Задължителна в продукция.** Публичен URL на приложението (схема + хост, напр. `https://heym.example.com`). Използва се за OAuth redirect URI-та (Google Sheets, BigQuery, Notion и подобни), както и за връзките за преглед, Codex follow-up и файлове, които фоновите изпълнения генерират; трябва да съвпада с URL-а, който потребителите използват в браузъра. В cluster задайте една и съща стойност на всеки екземпляр. |
| `ALLOW_REGISTER` | Отворена регистрация на потребители (`false` в prod, `true` в dev). Превключете я на `false` само след като Вашият администраторски акаунт съществува — няма bootstrap на първия потребител, така че празна база данни с изключена регистрация не оставя начин да се създаде такъв. |
| `DOCKER_LOGS_ENABLED` | Активира достъпа до раздела Logs, поддържан от Docker, когато е зададено на `true`; също изисква достъп до Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Списък с имейли на доверени потребители, разделени със запетая, на които е разрешен достъп до Docker logs, когато `DOCKER_LOGS_ENABLED=true` |
| `REQUEST_BODY_MAX_SIZE_MB` | Максимален размер на тялото на HTTP заявката, приет преди изпълнението на endpoint handlers; по подразбиране `100`, един MB над `FILE_MAX_SIZE_MB`, за да остане място за multipart допълнителни разходи |
| `HEYM_PYTHON_TOOL_SANDBOX` | Как се изпълняват дефинираните от потребителя Python инструменти: `auto` (по подразбиране — укрепен, изолиран Docker контейнер; fail closed, ако Docker не е наличен), `docker` (същото, никога не се връща към fallback), или `subprocess` (локален fallback в процеса; не е граница за сигурност, само за доверена/dev среда). `run.sh` задава `subprocess` за native dev. Вижте [Security](../reference/security.md#python-tool-sandbox). |
| `HEYM_PYTHON_TOOL_IMAGE` | Image, използван за Docker sandbox-а на Python инструментите. Празно = автоматично откриване на текущия backend image. |

Стойностите по подразбиране за връзка с базата данни (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) са документирани в [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) и `.env.example`.

---

## Разработка: `run.sh`

`run.sh` стартира и трите услуги локално — базата данни (като Docker контейнер), FastAPI backend-а и Vite dev сървъра — с една единствена команда.

```bash
./run.sh
```

**Какво прави, стъпка по стъпка:**

1. Проверява дали `docker`, `bun` и `uv` са налични
2. Създава `.env` от `.env.example`, ако липсва, и генерира случаен `SECRET_KEY` и `ENCRYPTION_KEY`, когато някое от тях е празно
3. Стартира (или създава) Docker контейнер за базата данни на порт `6543`, като съхранява данните му в Docker volume `heym-postgres-data`, а не в директория на хоста
4. Инсталира Python зависимости чрез `uv sync`
5. Изпълнява Alembic миграции на базата данни (`alembic upgrade head`)
6. Освобождава портовете на backend-а и frontend-а, ако са заети
7. Стартира FastAPI backend-а с `--reload` (hot-reload при промени в кода)
8. Инсталира frontend зависимости чрез `bun install`
9. Стартира Vite dev сървъра

**Опции:**

| Флаг | Описание |
|------|-------------|
| *(няма)* | Стартира с включено debug логване (`LOG_LEVEL=DEBUG`) |
| `--no-debug` | Стартира с ниво на логване по подразбиране (без debug изход) |
| `--help` | Показва информация за употреба |

**Адреси на услугите (dev):**

| Услуга | Адрес |
|---------|---------|
| Frontend | `localhost` на `FRONTEND_PORT` (по подразбиране: 4017) |
| Backend API | `localhost` на `BACKEND_PORT` (по подразбиране: 10105) |
| Интерактивна API документация | `localhost:10105/docs` |
| База данни | `localhost:6543` |

Натиснете `Ctrl+C`, за да спрете всички услуги коректно.

---

## End-to-End тестове: `run_e2e.sh`

Frontend Playwright suite-ът се изпълнява срещу реалното Vue приложение, FastAPI backend-а и
изолирана PostgreSQL база данни:

```bash
./run_e2e.sh
```

Suite-ът е smoke и regression suite за ключови пътища, а не изчерпателно покритие на продукта. Той покрива
автентикация, жизнен цикъл и изпълнение на основни workflow-и, избрани dashboard ресурси, публични
маршрути и мокирано HITL review UI. Интеграциите с доставчици, всеки тип node, матриците за споделяне/права
и пълното HITL resume изпълнение остават покрити основно от backend тестове или изискват
специализирани интеграционни среди.

Всяко изпълнение получава свой собствен временен PostgreSQL 16 контейнер, случайни налични портове за
база данни/backend/frontend, състояние на автентикация, резултати от тестове и HTML отчет. Това позволява на няколко `run_e2e.sh`
процеса да работят едновременно, без да споделят състояние или да презаписват артефакти. Скриптът премахва
контейнера на базата данни, когато изпълнението приключи, и отпечатва директорията с артефакти и пътя до отчета.

Полезни команди:

```bash
./run_e2e.sh --ui         # Интерактивен Playwright runner с изолирана база данни
cd frontend
bun run test:e2e:report   # Отваря последното завършено локално изпълнение
```

Директните изпълнения на `bun run test:e2e` и `bun run test:e2e:ui` изискват изрично зададен `DATABASE_URL`, за да не
могат тихо да стартират срещу локалната база данни за разработка. Използвайте `./run_e2e.sh` за нормални локални
изпълнения.

`./check.sh` изпълнява lint, typecheck, форматиране и backend тестове без E2E suite-а, поддържайки
пътя за проверка по подразбиране бърз. Изпълнявайте Playwright E2E тестовете отделно с `./run_e2e.sh`. Pull
request-ите винаги изпълняват Chromium E2E suite-а в GitHub Actions и запазват traces, screenshots,
видеа и HTML отчета, когато възникнат грешки.

---

## Продукционна среда: `deploy.sh`

`deploy.sh` изгражда и стартира целия стек чрез Docker Compose. И трите услуги — базата данни, backend-ът и frontend-ът — работят като контейнери. Entrypoint-ът на backend-а автоматично изпълнява миграциите, преди да стартира сървъра с 8 workers.

**Първоначално внедряване (изграждане + стартиране):**

```bash
./deploy.sh
```

Това извършва внедряване без прекъсване на работата (zero-downtime): изображенията се изграждат първо, докато съществуващите контейнери продължават да работят, след което новата версия се подменя.

**Налични команди:**

| Команда | Описание |
|---------|-------------|
| `./deploy.sh` | Изгражда изображенията и стартира/обновява всички услуги |
| `./deploy.sh --status` | Показва статуса на контейнерите |
| `./deploy.sh --logs` | Показва логовете от всички контейнери в реално време |
| `./deploy.sh --restart` | Рестартира всички контейнери |
| `./deploy.sh --down` | Спира и премахва всички контейнери |
| `./deploy.sh --migrate-pgdata` | Еднократна миграция: копира съществуващата директория `data/postgres` в Docker volume-а `heym-postgres-data` и изгражда наново нейните индекси |
| `./deploy.sh --help` | Показва информация за използването |

**Съхранение на базата данни: именуван Docker volume, а не директория на хоста.**

Compose съхранява PostgreSQL в Docker volume-а `heym-postgres-data`. По-ранните версии вместо това монтираха (bind mount) директорията на хоста `./data/postgres`. Bind mount-овете на хоста в macOS (virtiofs) и Windows/WSL2 не осигуряват на PostgreSQL гаранциите за `fsync` и затваряне на файлове, които той изисква: клъстерите там се сблъскват с `PANIC: could not close file … Input/output error` върху WAL сегменти и се повреждат с времето. Linux bind mount-овете никога не са били засегнати, но сега всяка платформа използва една и съща подредба.

Надграждането на внедряване, което все още има данни в `./data/postgres`, е еднократна стъпка. `./deploy.sh` го открива, спира преди изграждането и Ви моли първо да мигрирате:

```bash
./deploy.sh --migrate-pgdata   # спира услугите, копира във volume-а, изгражда наново индексите
./deploy.sh                    # внедрява както обикновено
```

**Миграцията също изгражда наново индексите.** Копието е побайтово, така че щетите по индексите, причинени от стария bind mount, се пренасят заедно с него. Затова `--migrate-pgdata` стартира само услугата `postgres` върху новия volume, изпълнява `reindexdb` срещу нея и я спира отново, преди останалата част от стека да се стартира. Това е важно, защото този клас повреди оставя записи в индексите, сочещи отвъд края на heap-а — състояние, което `pg_amcheck` отчита като чисто, така че успешната проверка не е доказателство за здрава таблица. REINDEX поправя тези записи; той не може да възстанови heap страниците, които старата файлова система вече е загубила. При голяма, известна като здрава база данни можете да пропуснете изграждането наново с `./deploy.sh --migrate-pgdata --skip-reindex`.

Копието не е разрушително. `./data/postgres` остава на мястото си като резервно копие, а миграцията отказва да презапише volume, който вече съдържа база данни. Ако някоя стъпка се провали, новият volume се премахва, така че наполовина мигриран клъстер никога не може да бъде внедрен по погрешка. Изтрийте старата директория, след като сте потвърдили, че Вашите Workflow-и са непокътнати. Контейнерът `postgres` носи същата защита, така че ръчно изпълнение на `docker compose up` също не може тихо да инициализира празна база данни върху Вашите данни. При чисто нови инсталации не са необходими действия.

**Адреси на услугите (продукционна среда):**

Frontend контейнерът е изложен на `FRONTEND_PORT` (по подразбиране: 4017). Backend API-то се обслужва под пътя `/api`, проксирано през frontend контейнера — така че в продукционна среда има само един публично достъпен порт.

**Преглед на контейнерите:**

| Контейнер | Описание |
|-----------|-------------|
| `heym-db` | Релационна база данни |
| `heym-backend` | FastAPI API сървър (8 workers, изграден от `backend/Dockerfile`) |
| `heym-frontend` | Frontend preview контейнер, обслужващ изграденото Vue приложение (изграден от `frontend/Dockerfile`) |

**Бадж за актуализация на версията:**

Заглавната лента на приложението показва текущата версия на Docker build-а. Когато тази версия е по-стара от най-новия release на Heym в GitHub, до версията се появява лилав бадж **Update**. Кликнете върху версията или баджа, за да отворите страницата с release-и на Heym в GitHub.

---

## Готово изображение: `docker run`

Ако предпочитате да не изграждате приложението локално, можете да изтеглите публикуваното контейнерно изображение и да го стартирате директно.

Изображението стартира frontend и backend заедно в един контейнер. PostgreSQL остава външен, но можете да предоставите или `DATABASE_URL`, или променливите `POSTGRES_*` от `.env.example`.

> **Съхранявайте базата си данни в именуван Docker том (named volume).** Изданието на изображението не включва база данни, така че PostgreSQL зад `DATABASE_URL` е ваша отговорност да стартирате. Монтирайте го като `-v heym-postgres-data:/var/lib/postgresql/data`, а не като път на хоста: на macOS (virtiofs) и Windows/WSL2 bind-mounted директорията с данни на PostgreSQL не спазва гаранциите за `fsync`, които базата данни изисква, и с времето поврежда клъстера.

> **Backend за векторно хранилище.** `run.sh` и `deploy.sh` стартират официалното изображение `postgres:16` и автоматично инсталират пакета `postgresql-16-pgvector` при стартиране, така че **Postgres (pgvector) RAG backend** работи веднага там без промяна на данните Ви. Готовото single-container изображение обаче се свързва с PostgreSQL, който **Вие** предоставяте — тази база данни трябва да поддържа разширението `vector`, за да използва Postgres backend. Heym не може да инсталира pgvector в база данни, която не управлява. Без него миграцията при стартиране пропуска таблицата pgvector по подразбиране — deploy-ът все още успява, Qdrant RAG продължава да работи, а създаването или качването в Postgres векторно хранилище връща ясно съобщение "backend unavailable", докато pgvector не бъде активиран.

**Задайте ключовете сами при директни стартирания на изображението.** За разлика от `run.sh`/`deploy.sh`, готовото изображение не генерира ключове автоматично. След `cp .env.example .env`, попълнете двата празни ключа (замяната на място избягва дублиращи се записи):

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

> **Направете монтиранията за файлове и плъгини абсолютни.** `FILE_STORAGE_DIR` и `HEYM_PLUGINS_DIR` по подразбиране са относителните пътища `./data/files` и `data/plugins`, а изданието на изображението стартира backend от `/app/backend`. Оставени относителни, те се разрешават до `/app/backend/data/files` и `/app/backend/data/plugins`, така че двете bind монтирания по-горе не получават нищо и качванията се губят, когато контейнерът бъде заменен. Флаговете `-e` отменят относителните стойности, които `.env.example` предоставя чрез `--env-file`, защото `-e` от командния ред има предимство пред `--env-file`. Compose (`./deploy.sh`) не се нуждае от това: това изображение стартира backend от `/app`, където относителните стойности по подразбиране вече попадат върху монтиранията.

> **Достъп до Docker socket.** Монтирането на `/var/run/docker.sock` дава на backend широк контрол върху Docker демона на хоста. Услугата по подразбиране в Docker Compose и примерът с директен `docker run` го включват за Docker-базирани MCP stdio инструменти, които изпълняват `docker` команди. Разделът Logs все още изисква `DOCKER_LOGS_ENABLED=true` и `DOCKER_LOGS_ALLOWED_EMAILS` със списък, разделен със запетаи, от имейли на доверени потребители. Създайте доверения администраторски акаунт, преди да активирате Docker logs, или оставете `ALLOW_REGISTER=false`, така че неверифицирана самостоятелна регистрация да не може да заяви имейл от allow-list. Потребителски дефинираните Python инструменти **не** получават този socket: те работят в отделен укрепен контейнер без Docker socket. Вижте [Security](../reference/security.md#python-tool-sandbox).

> **Codex runner.** Codex node използва същото изображение `ghcr.io/heymrun/heym` като sibling runner контейнер (`--entrypoint codex`), така че Linux sandbox-ът на Codex може да създава namespaces. Запазете монтирането на тома `heym-codex-workspaces`, ако искате Codex workflows в директната настройка на изображението; runner-ът не получава Docker socket или backend тайни.

> **OpenCode Go runner.** OpenCode Go node използва същото изображение като укрепен sibling runner (`--entrypoint opencode`), споделящ `heym-opencode-workspaces`. Запазете това монтиране на тома, ако искате OpenCode workflows в директната настройка на изображението; runner-ът не получава Docker socket или GitHub token.

> **Skill sandbox.** Python skills на Agent node работят в укрепен sibling контейнер, който споделя тома `heym-codex-workspaces`, така че запазете това монтиране на тома и за skills — не само за Codex. Всяко изпълнение получава изолиран подпът за всяко изпълнение, а sibling-ът не получава нито Docker socket, нито backend тайни. Това изисква **Docker Engine 25.0+**; на по-стари engine-и или без тома, `HEYM_PYTHON_TOOL_SANDBOX=auto` се проваля затворено — задайте `HEYM_PYTHON_TOOL_SANDBOX=subprocess` само за доверени single-user настройки. Вижте [Security](../reference/security.md#skill-sandbox).

> **`--shm-size 2g` е задължителен за Playwright.** Docker дава на контейнера 64 MB `/dev/shm` и Chromium срива своя renderer под това. Step-based Playwright nodes стартират Chromium като подпроцес в този контейнер, така че ограничението е на този контейнер; персонализираният `playwrightCode` работи в sibling контейнер, който задава своето собствено. `docker-compose.yml` вече декларира `shm_size: "2gb"`, така че `run.sh` и `deploy.sh` не са засегнати — само обикновен `docker run` се нуждае от флага.

> **Playwright Run Code.** Персонализираният Playwright Python изисква `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true` и монтирането на Docker socket по-горе. Изданието на изображението задава `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON` за GHCR оформлението (`/app/backend/.venv`). Compose `./deploy.sh` задава по подразбиране sandbox изображението на `heym-backend:local`. Запазете `--no-sandbox` в аргументите за стартиране на Chromium вътре в sandbox контейнерите.

**Минимални променливи на средата за директни стартирания на изображението:**

| Променлива | Задължителна | Предназначение |
|----------|----------|---------|
| `DATABASE_URL` | По избор | Пълно заместване на connection string за PostgreSQL |
| `POSTGRES_HOST` | Да, ако `DATABASE_URL` е празно | Хост на PostgreSQL |
| `POSTGRES_PORT` | Да, ако `DATABASE_URL` е празно | Порт на PostgreSQL |
| `POSTGRES_USER` | Да, ако `DATABASE_URL` е празно | Потребителско име за PostgreSQL |
| `POSTGRES_PASSWORD` | Да, ако `DATABASE_URL` е празно | Парола за PostgreSQL |
| `POSTGRES_DB` | Да, ако `DATABASE_URL` е празно | Име на базата данни PostgreSQL |
| `SECRET_KEY` | Да | Тайна за подписване на JWT |
| `ENCRYPTION_KEY` | Да | Ключ за криптиране на идентификационни данни |
| `FRONTEND_URL` | Препоръчително | Публичен URL за браузър, особено за OAuth callbacks |
| `CORS_ORIGINS` | Препоръчително | Разрешени origins за браузър |
| `FILE_STORAGE_DIR` | Препоръчително | Задайте го на абсолютен `/app/data/files`, когато монтирате този път; относителната стойност по подразбиране `./data/files` се разрешава под `/app/backend` в това изображение и пропуска монтирането |
| `ALLOW_REGISTER` | Препоръчително | Задайте `false` в production, освен ако не е предвидена отворена регистрация, но само след като администраторският Ви акаунт съществува — няма bootstrap за първи потребител |
| `DOCKER_LOGS_ENABLED` | По избор | Задайте `true`, за да позволите на раздела Logs да използва достъп до Docker socket |
| `DOCKER_LOGS_ALLOWED_EMAILS` | Задължителна, когато `DOCKER_LOGS_ENABLED=true` | Списък, разделен със запетаи, от имейли на доверени потребители, на които е разрешен достъп до Docker logs |
| `HEYM_PLUGINS_ENABLED` | По избор | Задайте `true`, за да активирате подсистемата за плъгини (персонализирани nodes, инсталирани като zip). Изключено по подразбиране |
| `HEYM_PLUGIN_ADMIN_EMAILS` | Задължителна, когато `HEYM_PLUGINS_ENABLED=true` | Списък, разделен със запетаи, от имейли на оператори, на които е разрешено да инсталират/деинсталират плъгини |
| `HEYM_PLUGINS_DIR` | По избор | Къде се съхраняват файловете на плъгините. Задайте го на абсолютен `/app/data/plugins`, когато монтирате този път; относителната стойност по подразбиране `data/plugins` се разрешава под `/app/backend` в това изображение и пропуска монтирането |
| `HEYM_PYTHON_TOOL_SANDBOX` | По избор | Режим на изолация на Python инструменти; по подразбиране `auto` (укрепен Docker sandbox, проваля се затворено). Вижте [Security](../reference/security.md#python-tool-sandbox) |
| `HEYM_PYTHON_TOOL_IMAGE` | По избор | Замества sandbox изображението за Python инструменти; празно = автоматично откриване на backend изображението |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | По избор | Docker том, използван от sibling Codex runner контейнерите; по подразбиране `heym-codex-workspaces` в Docker среди |
| `HEYM_CODEX_NETWORK_ACCESS` | По избор | Позволява на sandbox-ираните команди на Codex да изтеглят файлове/зависимости; Docker средите активират това по подразбиране |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | По избор | Docker том, използван от sibling OpenCode runner контейнерите; по подразбиране `heym-opencode-workspaces` в Docker среди |

**Бележки:**

- Изображението expose-ва порт `4017`
- Backend-ът остава вътрешен и се проксира под `/api`
- Когато `POSTGRES_HOST=localhost`, изданието на изображението автоматично го пренаписва на `host.docker.internal`, когато е необходимо, така че същият `.env` да работи с PostgreSQL контейнер на ниво хост в macOS Docker/Desktop инструменти
- Запазете монтирането на `data/files`, ако искате качванията в Drive и генерираните от skills файлове да оцелеят след рестартиране на контейнера
- **Плъгини:** за да ги активирате, задайте `HEYM_PLUGINS_ENABLED=true` и `HEYM_PLUGIN_ADMIN_EMAILS`, и монтирайте `data/plugins`, така че инсталираните файлове на плъгините да оцелеят при пресъздаване на контейнера. Метаданните на плъгините живеят във Вашия PostgreSQL, така че също оцеляват. Декларираните pip `dependencies` на плъгин се инсталират в контейнера по време на инсталацията; тъй като файловата система на изображението е ефимерна, те се **преинсталират автоматично при стартиране** за всеки инсталиран плъгин (`uv` venv на изданието на изображението е записваем, така че това работи и в single-container изображението)

### Преместване на съществуваща база данни към именуван том

`./deploy.sh --migrate-pgdata` знае само за Compose стека. Ако стартирате изданието на изображението срещу Ваш собствен PostgreSQL контейнер и този контейнер bind-mount-ва директория на хоста, мигрирайте го сами.

Проверете първо какво използва Вашият контейнер за база данни:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

Ако `"Type"` показва `bind`, преместете го към именуван том:

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

**Използвайте Вашето собствено изображение в стъпки 2 и 3, не `postgres:16`.** Ако Вашата база данни работи с `pgvector/pgvector:pg16` или друг вариант, стартирането на копирания клъстер със стандартното изображение може да се провали, защото библиотеките на разширението, които очаква, липсват.

Оригиналната Ви директория с данни не се докосва от тази процедура, така че остава Вашият път за връщане назад. Изтрийте я само след като потвърдите, че мигрираната база данни обслужва Вашите workflows. Стъпка 4 е важна по същата причина, по която е важна и в Compose миграцията: копието носи със себе си всяка съществуваща повреда на индексите.

---

## Стартиране на повече от една инстанция

Всичко по-горе разгръща една единствена инстанция на Heym. Когато една машина вече не е достатъчна, насочете втора инстанция към същата PostgreSQL база данни и тя се присъединява като worker: фоновите изпълнения — cron, webhooks, MCP tool calls, chat triggers — след това се разпределят между инстанциите според процент, който задавате в **Settings → Instances**.

Инстанциите никога не комуникират помежду си. Postgres поема работата, така че един worker не се нуждае от отворен порт и от маршрут обратно към основната инстанция, и не участва никакъв message broker. Работата, която засяга локалния диск — Drive файлове, работни пространства на coding-agent, инсталирани плъгини — винаги се изпълнява на основната инстанция, така че нищо не трябва да се споделя през файлова система.

Две правила, които cluster-ът не може да наложи вместо Вас: всяка инстанция трябва да използва един и същ `SECRET_KEY` и `ENCRYPTION_KEY`, и ingress трябва да сочи само към основната инстанция. И двете са обяснени, заедно с правилата за разполагане и как да изберете процентите, в [Load Distribution](../reference/cluster.md).

> Това е разпределение на натоварването, а не висока наличност. Основната инстанция остава единична точка на отказ за ingress, файлово хранилище и редактора.

## Често срещани Workflow-и

**Първоначална настройка:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

За предварително изграденото изображение `docker run`, генерирайте ключовете ръчно първо (вижте секцията **Prebuilt Image** по-горе).

**Актуализиране на production след промяна в кода:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**Проверка на production логовете:**

```bash
./deploy.sh --logs
```

**Спиране на production услугите:**

```bash
./deploy.sh --down
```

---

## Свързани

- [Въведение](./introduction.md) – Преглед на платформата
- [Бърз старт](./quick-start.md) – Създайте своя първи Workflow
- [Променливи на средата](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Пълно ръководство за конфигурацията
- [Сигурност](../reference/security.md) – JWT, криптиране и настройки за CORS
- [Разпределение на натоварването](../reference/cluster.md) – Стартиране на няколко инстанции към една база данни

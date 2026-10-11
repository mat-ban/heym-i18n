# Сторонні інтеграції

Heym підключається до зовнішніх сервісів через **облікові дані**. Кожен тип облікових даних зберігає параметри підключення до одного сервісу та може повторно використовуватися в багатьох вузлах і workflow. Загальний огляд дивіться в розділі [Облікові дані](./credentials.md).

Додавайте облікові дані в розділі [Settings → Credentials](../tabs/credentials-tab.md). Усі значення шифруються під час зберігання. Облікові дані можна [надавати спільно](./credentials-sharing.md) іншим користувачам або [Teams](./teams.md).

Деякі вузли інтеграцій **не** потребують облікових даних. [WebSocket Trigger](../nodes/websocket-trigger-node.md) і [WebSocket Send](../nodes/websocket-send-node.md) підключаються до зовнішніх сокетів, використовуючи URL, заголовки та субпротоколи, налаштовані безпосередньо на вузлі.

## Типи облікових даних: короткий огляд

| Тип | Використовується | Ключові поля |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, необов'язковий `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, необов'язковий `base_url` |
| **Jira** | [Вузол Jira](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, необов'язковий `api_version` |
| **Linear** | [Вузол Linear](../nodes/linear-node.md) | `api_key` або `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Вузол Sentry](../nodes/sentry-node.md) | `api_token`, необов'язковий `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Оцінювання](../tabs/evals-tab.md) (суддя LLM-as-Judge) | `base_url`, необов'язковий `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | облікові дані моделі прийняття рішень, а також параметри моделей, що посилаються на інші Ваші облікові дані |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Векторні сховища | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Векторні сховища | `openai_api_key` (вектори зберігаються у власному Postgres Heym через pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Векторні сховища | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, необов'язковий `embedding_api_key`, а також `qdrant_host`, коли `db_type` має значення `qdrant` |
| **Grist** | [Вузол Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Вузол Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + згода OAuth2 |
| **Google Drive** | [Вузол Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + згода OAuth2 (повний обсяг доступу Drive) |
| **BigQuery** | [Вузол BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + згода OAuth2 |
| **Supabase** | [Вузол Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, необов'язковий `supabase_schema` |
| **ClickHouse** | [Вузол ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Вузол Notion](../nodes/notion-node.md) | `api_token` або `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Вузол Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Вузол IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Вузол Telegram Trigger](../nodes/telegram-trigger-node.md), [Вузол Telegram](../nodes/telegram-node.md) | `bot_token`, необов'язковий `secret_token` |
| **Discord** | [Вузол Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Вузол Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Вузол RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Вузол Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Вузол Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Вузол Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Вузол HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Вузол HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Вузол Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Облікові дані GitHub зберігають персональний токен доступу GitHub (PAT), щоб workflow могли викликати GitHub REST API через [вузол GitHub](../nodes/github-node.md), передавати токен до серверів MCP, як-от `@modelcontextprotocol/server-github`, або використовувати його з [вузла HTTP](../nodes/http-node.md) для власних REST-викликів.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `api_key` | Персональний токен доступу GitHub (деталізований PAT `github_pat_...` або класичний PAT `ghp_...`) |
### Необов'язкові поля

| Поле | Опис |
|-------|-------------|
| `base_url` | Базова URL-адреса GitHub API для GitHub Enterprise Server (наприклад, `https://github.example.com/api/v3`) |

### Примітки

- За можливості рекомендується використовувати дрібнозернисті personal access token, оскільки їх можна обмежити конкретними репозиторіями та дозволами.
- Залиште `base_url` порожнім для GitHub.com. Для GitHub Enterprise Server використовуйте повний REST API
  endpoint, включно з `/api/v3` (наприклад, `https://github.example.com/api/v3`), а не
  корінь вебінтерфейсу сервера, як-от `https://github.example.com`.
- Наразі ці облікові дані моделюють лише автентифікацію на основі PAT. Щоб отримати доступ до репозиторіїв організації, використовуйте PAT, якому надано необхідні дозволи організації/репозиторію.
- Інсталяційні token GitHub App і потоки налаштування GitHub App наразі не є першокласними в інтерфейсі Heym.
- Надавайте перевагу [вузлу GitHub](../nodes/github-node.md) для нативних операцій із репозиторіями, користувачами, issue, pull request, review, release, Actions workflow, трафіком і файлами. Використовуйте [вузол HTTP](../nodes/http-node.md) лише тоді, коли потрібні endpoint або payload, які не покриває вузол GitHub.
- Використовуйте [вузол Agent](../nodes/agent-node.md) з MCP, передаючи `$credentials.YourGitHubCredential` у змінну середовища MCP-з'єднання, як-от `GITHUB_PERSONAL_ACCESS_TOKEN`.
- REST API GitHub зазвичай очікує `Authorization: Bearer <token>` разом з `Accept: application/vnd.github+json`.
- Під час редагування облікових даних GitHub залишення порожнім `base_url` для GitHub Enterprise зберігає
  наявний endpoint. Вводьте нову URL-адресу лише тоді, коли потрібно змінити цей endpoint.

### Використовується

- [Вузол GitHub](../nodes/github-node.md)
- [Вузол Codex](../nodes/codex-node.md)
- [Вузол Agent](../nodes/agent-node.md)
- [Вузол HTTP](../nodes/http-node.md)

---

## Модель прийняття рішень

Модель прийняття рішень відповідає на типізовані запитання про стан і повертає ймовірності замість тексту. Jev від TypeSafe є еталонною реалізацією; будь-який endpoint, що приймає те саме тіло `{model, state, questions}`, працює, а вузол [Decision](../nodes/decision-node.md) може надіслати написане вручну тіло для того, який цього не робить.

### Обов'язкові поля

- `base_url` – endpoint, наприклад `https://api.typesafe.ai`. Heym додає `/v1/systemone`.

### Необов'язкові поля

- `api_key` – надсилається як `Authorization: Bearer`. Endpoint, яким не потрібен ключ, можуть залишити це поле порожнім.

### Примітки

- **Test Connection** надсилає одне крихітне запитання, щоб підтвердити працездатність endpoint і ключа.
- Редагування облікових даних зберігає збережений ключ, коли поле ключа залишається порожнім.
- Вихідні запити до приватних і loopback-адрес блокуються за замовчуванням, тому self-hosted endpoint на `localhost` або в приватному діапазоні потребує `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Ці моделі відсутні в таблицях ціноутворення LLM, які синхронізує Heym, тому стовпець Cost у [Трасуванні](../tabs/traces-tab.md) залишається порожнім. Кількість token все одно записується.

### Використовується

- [Decision](../nodes/decision-node.md)
- [Оцінювання](../tabs/evals-tab.md) – оцінює відповіді `LLM-as-Judge` щодо очікуваного результату

## OpenAI Codex

Облікові дані OpenAI Codex автентифікують [вузол Codex](../nodes/codex-node.md). Вони відокремлені від облікових даних ключа OpenAI API, які використовуються вузлами LLM, Agent і RAG.

### Режими автентифікації

| Режим | Опис |
|------|-------------|
| **Увійти через ChatGPT** (рекомендовано) | Вхід через OAuth (PKCE), який використовує Вашу підписку ChatGPT Plus/Pro, тож запуски уникають витрат на API за кожен token. Heym зберігає та автоматично оновлює набір token. |
| **Access token** | `access_token` ChatGPT/Codex, що передається лише локальному процесу Codex CLI. |

### Примітки

- Ключі API відхиляються для цього типу облікових даних.
- Token Codex не розкриваються через `$credentials.Name`.
- Вузол Codex також потребує облікових даних GitHub для клонування репозиторію, надсилання гілки та створення чернетки PR.

### Використовується

- [Вузол Codex](../nodes/codex-node.md)

## OpenCode Go

Облікові дані OpenCode Go автентифікують [вузол OpenCode Go](../nodes/opencode-go-node.md). Вони зберігають ключ API шлюзу OpenCode Go (з [opencode.ai/go](https://opencode.ai/go)) та необов'язкову базову URL-адресу шлюзу.

### Поля

| Поле | Опис |
|-------|-------------|
| **API Key** | Ключ API шлюзу OpenCode Go (обов'язково). |
| **Gateway Base URL** | Необов'язково; за замовчуванням `https://opencode.ai/zen/go/v1`. Перевизначайте лише для self-hosted або проксійованого шлюзу. |

### Примітки

- Ключ API передається лише процесу OpenCode CLI всередині захищеного контейнера.
- Вузол OpenCode Go також потребує облікових даних GitHub для клонування репозиторію, надсилання гілки та створення pull request. Token GitHub ніколи не розміщується всередині пісочниці контейнера.

### Використовується

- [Вузол OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

Облікові дані Linear підтримують або особистий ключ API, або OAuth2 для
[вузла Linear](../nodes/linear-node.md). Heym надсилає нативні запити GraphQL до Linear для метаданих робочого простору,
проєктів, issue та коментарів.
### Налаштування

Виберіть один режим автентифікації:

**Особистий API key**

1. У Linear відкрийте **Settings → Security & Access → Personal API keys**.
2. Створіть key із доступом до workspace, який потрібно автоматизувати.
3. Вставте key в облікові дані Linear у Heym і скористайтеся **Test Connection** для перевірки.

**OAuth2**

1. Створіть застосунок Linear OAuth.
2. Зареєструйте `{FRONTEND_URL}/api/credentials/linear/oauth/callback` як redirect URI.
3. У Heym Dashboard → **Credentials** → **New** → вкажіть тип **Linear**.
4. Виберіть **OAuth2**, введіть Client ID і Client Secret, потім натисніть **Connect**.

### Обов'язкові поля

| Режим | Поле | Опис |
|------|-------|-------------|
| Особистий API key | `api_key` | Особистий API key Linear, зазвичай із префіксом `lin_api_` |
| OAuth2 | `client_id` | Client ID із застосунку Linear OAuth |
| OAuth2 | `client_secret` | Client Secret із застосунку Linear OAuth |

OAuth tokens (`access_token`, `refresh_token`, `token_expiry`) зберігаються та оновлюються автоматично.

### Примітки

- Особисті API keys і OAuth tokens діють від імені користувача Linear, який їх створив або авторизував.
- Linear OAuth використовує scopes `read,write,issues:create,comments:create`.
- Скористайтеся **Test Connection** у діалозі облікових даних, щоб перевірити API key або OAuth token на відповідність Linear API.
- Використовуйте List Teams і List Projects у вузлі Linear, щоб визначити UUID перед створенням або фільтруванням issues.
- Використовуйте List Workflow States і List Team Members, щоб визначити UUID станів і виконавців для оновлень.
- Щоб замінити API key, відредагуйте облікові дані та введіть нове значення. Якщо ви замінюєте секрети застосунку OAuth, повторно підключіть облікові дані через **Connect**.

### Використовується

- [Вузол Linear](../nodes/linear-node.md)

---

## Jira

Облікові дані Jira зберігають дані Basic auth Jira, базову URL-адресу сайту Jira, режим розгортання та необов'язкову версію REST API для [вузла Jira](../nodes/jira-node.md). Використовуйте `cloud` для Jira Cloud або `data_center` для Jira Data Center / Server.

### Налаштування

**Jira Cloud**

1. У налаштуваннях облікового запису Atlassian створіть API token.
2. У Heym Dashboard → **Credentials** → **New** → вкажіть тип **Jira**.
3. Введіть email Atlassian, API token і URL-адресу сайту Jira, наприклад `https://your-domain.atlassian.net`.
4. Скористайтеся **Test Connection** для перевірки облікових даних.

**Jira Data Center / Server**

1. Виберіть **Jira Data Center / Server** як режим розгортання.
2. Введіть ім'я користувача та пароль Jira, що використовуються для Basic auth.
3. Введіть URL-адресу сайту Jira, наприклад `https://jira.example.com`.
4. Скористайтеся **Test Connection** для перевірки облікових даних.

### Поля

| Поле | Опис |
| --- | --- |
| `email` | Email облікового запису Atlassian для Jira Cloud або ім'я користувача Jira Data Center / Server |
| `api_token` | API token Atlassian для Jira Cloud або пароль Jira Data Center / Server для Basic auth |
| `base_url` | Базова URL-адреса сайту Jira |
| `deployment` | `cloud` для Jira Cloud або `data_center` для Jira Data Center / Server |
| `api_version` | Версія REST API; за замовчуванням `3` для Jira Cloud. Data Center / Server використовує v2 |

### Примітки

- Вузол Jira надсилає описи issues і comments як текстові документи Atlassian Document Format
  для Jira Cloud REST API v3. Облікові дані Data Center / Server надсилають звичайний текст.
- Data Center / Server наразі підтримує лише Basic auth з іменем користувача та паролем. Personal access
  tokens і Bearer auth поки не підтримуються.
- Завантаження вкладень приймає вміст у форматі base64 або data URL і підпорядковується обмеженню розміру файлу на платформі (за замовчуванням 99 МБ). Завантаження вкладень може повертати вміст base64, якщо це увімкнено.
- Створення й видалення користувачів, а також сповіщення про issues вимагають, щоб автентифікований обліковий запис Jira мав відповідні дозволи сайту або організації Jira.
- Використовуйте List Projects, Search Issues і List Transitions, щоб визначити ключі проєктів, ключі issues та ідентифікатори переходів.
- Для власних endpoint, не охоплених вузлом Jira, використовуйте [вузол HTTP](../nodes/http-node.md) із Jira Basic Auth (`email:api_token` для Cloud або `username:password` для Data Center / Server) у команді cURL, або облікові дані Header із відповідним значенням `Authorization: Basic <base64(user:secret)>`.

Дивіться також:

- [Вузол Jira](../nodes/jira-node.md)
- [Облікові дані](./credentials.md)

---

## Sentry

Облікові дані Sentry зберігають auth token для [вузла Sentry](../nodes/sentry-node.md). Heym використовує REST API Sentry для операцій з організаціями, проєктами, командами, issues, подіями та релізами.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `api_token` | Auth token Sentry із доступом до організацій і проєктів, які потрібно автоматизувати |

### Необов'язкові поля

| Поле | Опис |
|-------|-------------|
| `base_url` | Необов'язкова коренева URL-адреса для self-hosted Sentry, наприклад `https://sentry.example.com` |

### Примітки

- Залиште `base_url` порожнім для Sentry SaaS.
- Скористайтеся **Test Connection**, щоб підтвердити, що token може перелічити видимі організації.
- Для власних викликів REST використовуйте `$credentials.YourSentryCredential` як bearer token.

### Використовується

- [Вузол Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) — це векторна база даних із відкритим кодом, що використовується для семантичного пошуку та RAG (Retrieval Augmented Generation).

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `qdrant_host` | Повна URL-адреса вашого екземпляра Qdrant (наприклад, `http://localhost:6333` або cloud endpoint) |
| `openai_api_key` | OpenAI API key, що використовується для генерації embeddings під час індексування та пошуку документів |
### Примітки

- Колекції Qdrant керуються з вкладки [Векторні сховища](../tabs/vectorstores-tab.md). Кожне векторне сховище відповідає колекції Qdrant.
- [Вузол RAG](../nodes/rag-node.md) використовує векторне сховище (яке посилається на облікові дані Qdrant) — він не посилається на облікові дані напряму.
- Якщо ваш екземпляр Qdrant вимагає API-ключ, додайте його до значення `qdrant_host` або налаштуйте Qdrant відповідним чином; поточна інтеграція не має окремого поля для API-ключа Qdrant.
- Самостійно розміщений Qdrant: скористайтеся [офіційним Docker-образом](https://hub.docker.com/r/qdrant/qdrant) і відкрийте порт `6333`.

### Використовується

- [Вузол RAG](../nodes/rag-node.md) (через векторне сховище)
- [Вкладка «Векторні сховища»](../tabs/vectorstores-tab.md)

## Власні Embeddings (RAG)

За замовчуванням embeddings для RAG надходять від OpenAI. Облікові дані **RAG: Custom Embeddings** натомість вказують на будь-який endpoint embeddings, сумісний з OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together або розміщений шлюз — і визначають векторне сховище, до якого вони записують дані.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `embedding_base_url` | URL endpoint із зазначенням шляху `/v1`, наприклад `http://localhost:11434/v1` |
| `embedding_api_key` | Необов'язково. Локальні сервери зазвичай не потребують ключа |
| `embedding_model` | Назва моделі у форматі, якого очікує endpoint, наприклад `nomic-embed-text` |
| `embedding_dimensions` | Ширина вектора, яку повертає модель (за замовчуванням `1536`) |
| `embedding_request_dimensions` | Необов'язково. Запитує в endpoint повернення `embedding_dimensions` замість власної ширини моделі |
| `db_type` | `qdrant` або `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | З'єднання з Qdrant, обов'язкове, коли `db_type` має значення `qdrant` |

### Примітки

- **Qdrant приймає будь-яку кількість вимірів.** Кожна колекція створюється з шириною, яку оголошують ці облікові дані, тож поле Dimensions можна вільно редагувати.
- **Postgres (pgvector) вимагає рівно 1536 вимірів.** Його стовпець має фіксований тип `vector(1536)`, тож поле Dimensions зафіксовано на 1536, а облікові дані, що оголошують іншу ширину, відхиляються під час збереження.
- **Скорочення для pgvector.** Коли сховищем є Postgres, діалогове вікно пропонує опцію *Ask the endpoint to return 1536 dimensions*. Вона надсилає параметр запиту `dimensions`, який моделі, навчені з використанням представлень Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` та подібні), враховують, повертаючи скорочений, але все ще змістовний вектор. Endpoint, які не підтримують цей параметр, відхиляють запит, а endpoint, які його приймають, але ігнорують, видають чітку помилку із зазначенням фактично повернутої ширини. Heym ніколи не обрізає вектори самостійно, оскільки нарізання виводу моделі, що не використовує Matryoshka, непомітно погіршує якість пошуку. Для Qdrant ця опція не пропонується, оскільки він може налаштувати колекцію на будь-яку ширину.
- Скористайтеся **Test Connection** у діалоговому вікні облікових даних, щоб вбудувати тестовий рядок і побачити ширину, яку модель фактично повертає, перш ніж створювати сховище.
- Параметр запиту `dimensions` надсилається лише самому OpenAI, оскільки більшість серверів, сумісних з OpenAI, відхиляють невідомі параметри. Натомість власна ширина моделі перевіряється на відповідність обліковим даним.
- Наявні облікові дані **RAG: Qdrant + OpenAI** та **RAG: Psql + OpenAI** залишаються без змін і продовжують працювати.

### Використовується

- [Вузол RAG](../nodes/rag-node.md) (через векторне сховище)
- [Вкладка «Векторні сховища»](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym також може зберігати вектори **у власній базі даних Postgres** за допомогою розширення [pgvector](https://github.com/pgvector/pgvector) — без потреби у зовнішньому векторному сервісі. Створіть облікові дані **RAG: Psql + OpenAI** і використайте їх під час створення векторного сховища, а потім виберіть **Postgres (pgvector)** у випадаючому списку Database вузла RAG.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `openai_api_key` | API-ключ OpenAI, який використовується для генерації embeddings під час індексування та пошуку документів |

### Примітки

- Хост/порт не потрібні — вектори записуються до власної бази даних Heym; Heym ніколи не підключається до іншої бази даних.
- Кожна функція RAG, доступна з Qdrant (вставлення, пошук, фільтри метаданих, переранжування Cohere, клонування, спільний доступ), працює ідентично з бекендом Postgres.
- Потребує розширення `vector`. Heym залишає офіційний образ `postgres:16` без змін (тож наявні дані ніколи не зачіпаються) і **автоматично встановлює пакет `postgresql-16-pgvector` під час запуску** — `run.sh`, `deploy.sh` та `run_e2e.sh` усі це обробляють. Встановлення не є критичним: якщо його не вдається виконати (наприклад, немає мережі), RAG на Qdrant продовжує працювати, а бекенд Postgres залишається неактивним (міграція коректно пропускає таблицю).
- Якщо ви запускаєте опублікований одноконтейнерний образ (`ghcr.io/heymrun/heym`) проти **власного зовнішнього Postgres**, ця база даних має підтримувати розширення `vector` (Heym не може встановити його в базу даних, якою він не керує). Без нього створення векторного сховища Postgres або завантаження до нього повертає чітке повідомлення, а RAG на Qdrant продовжує працювати.

### Використовується

- [Вузол RAG](../nodes/rag-node.md) (через векторне сховище)
- [Вкладка «Векторні сховища»](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) — це гібрид електронної таблиці та бази даних, який підтримує структуровані дані та формули. Облікові дані Grist дозволяють Heym читати та записувати документи Grist.
### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `api_key` | API-ключ Grist (знаходиться в розділі **Profile → API Key** на Вашому екземплярі Grist) |
| `server_url` | Базова URL-адреса Вашого сервера Grist (наприклад, `https://docs.getgrist.com` для Grist Cloud або URL-адреса власного розгортання) |

### Примітки

- [Вузол Grist](../nodes/grist-node.md) потребує **Document ID** (з URL-адреси документа Grist) та **Table ID** у своїй конфігурації — вони не є частиною облікових даних.
- Для самостійно розгорнутого Grist вкажіть `server_url` як домен Вашого екземпляра.
- Ідентифікатори стовпців у Grist використовують підкреслення (наприклад, `User_Name`), а не відображувані назви. Скористайтеся операцією `listColumns`, щоб їх виявити.

### Використовується в

- [Вузол Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Облікові дані Google Sheets з'єднують Heym з API Google Sheets за моделлю OAuth2 "Bring Your Own App". Ви надаєте Client ID та Client Secret OAuth2 з Google Cloud, після чого авторизуєте доступ через спливне вікно браузера. Token-и оновлюються автоматично у фоновому режимі.

### Налаштування

1. Відкрийте [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → знайдіть і увімкніть **Google Sheets API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → тип застосунку **Web application**.
3. У розділі **Authorized redirect URIs** додайте: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Скопіюйте згенеровані **Client ID** та **Client Secret**.
5. У Heym Dashboard → **Credentials** → **New** → виберіть тип **Google Sheets (OAuth2)**.
6. Введіть Client ID, Client Secret та назву, потім натисніть **Connect**, щоб відкрити спливне вікно згоди Google та авторизувати доступ.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `client_id` | OAuth2 Client ID з Google Cloud Console |
| `client_secret` | OAuth2 Client Secret з Google Cloud Console |

Token-и (`access_token`, `refresh_token`, `token_expiry`) зберігаються та оновлюються автоматично — Ви не керуєте ними безпосередньо.

### Примітки

- Екран згоди OAuth2 потребує області доступу до електронних таблиць (`https://www.googleapis.com/auth/spreadsheets`).
- Heym використовує refresh token для отримання нових access token-ів до їхнього закінчення (60-секундний захисний буфер).
- Якщо Ви зміните Client Secret у Google Cloud Console, повторно підключіть облікові дані за допомогою кнопки **Connect**.
- **Продакшн:** Встановіть **`FRONTEND_URL`** бекенду як точну публічну URL-адресу, яку користувачі відкривають у браузері (схема + хост, наприклад, `https://heym.example.com`). Heym формує redirect URI Google OAuth виключно з цього значення — він **не** довіряє заголовкам `Origin` або `X-Forwarded-*` (які контролюються клієнтом). Зареєструйте `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` у Google Cloud Console.

### Використовується в

- [Вузол Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Облікові дані Google Drive з'єднують Heym з API Google Drive за тією ж моделлю OAuth2 "Bring Your Own App", що й Google Sheets. Ви надаєте Client ID та Client Secret OAuth2 з Google Cloud, після чого авторизуєте доступ через спливне вікно браузера. Token-и оновлюються автоматично у фоновому режимі.

### Налаштування

1. Відкрийте [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → знайдіть і увімкніть **Google Drive API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → тип застосунку **Web application**.
3. У розділі **Authorized redirect URIs** додайте: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Скопіюйте згенеровані **Client ID** та **Client Secret**.
5. У Heym Dashboard → **Credentials** → **New** → виберіть тип **Google Drive (OAuth2)**.
6. Введіть Client ID, Client Secret та назву, потім натисніть **Connect**, щоб відкрити спливне вікно згоди Google та авторизувати доступ.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `client_id` | OAuth2 Client ID з Google Cloud Console |
| `client_secret` | OAuth2 Client Secret з Google Cloud Console |

Token-и (`access_token`, `refresh_token`, `token_expiry`) зберігаються та оновлюються автоматично — Ви не керуєте ними безпосередньо.

### Область доступу

Google Drive запитує **повну область доступу до Drive** (`https://www.googleapis.com/auth/drive`).

Це необхідно, оскільки вузол працює з файлами, які вже належать Вам. Вужча область `drive.file` надає доступ лише до файлів, створених самим OAuth-клієнтом, що призвело б до того, що операції `listFolderFiles`, `updateFile`, `removeFile` та `removeFolder` не бачили б нічого з Вашого наявного Drive.

Оскільки Ви надаєте власні Client ID та Secret зі свого проєкту Google Cloud, вимоги Google щодо верифікації застосунку для цієї області доступу стосуються Вашого проєкту, а не Heym.

### Примітки

- Heym використовує refresh token для отримання нових access token-ів до їхнього закінчення (60-секундний захисний буфер).
- Якщо Ви зміните Client Secret у Google Cloud Console, повторно підключіть облікові дані за допомогою кнопки **Connect**.
- Спільні диски підтримуються — вузол встановлює `supportsAllDrives` для кожного виклику API.
- **Продакшн:** Встановіть **`FRONTEND_URL`** бекенду як точну публічну URL-адресу, яку користувачі відкривають у браузері. Heym формує redirect URI Google OAuth виключно з цього значення — він **не** довіряє заголовкам `Origin` або `X-Forwarded-*`. Зареєструйте `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` у Google Cloud Console.
- Перед наданням спільного доступу до цих облікових даних команді ознайомтеся з [Credential Sharing](./credentials-sharing.md).
- [Вузол Google Drive](../nodes/google-drive-node.md)

### Використовується в

- [Вузол Google Drive](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Облікові дані BigQuery з'єднують Heym з Google BigQuery API за моделлю OAuth2 "Bring Your Own App". Ви надаєте Google Cloud OAuth2 Client ID та Client Secret, після чого авторизуєте доступ через спливаюче вікно браузера. Token-и оновлюються автоматично у фоновому режимі.

### Налаштування

1. Відкрийте [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → знайдіть і увімкніть **BigQuery API**.
2. Перейдіть до **Credentials** → **Create Credentials** → **OAuth client ID** → тип застосунку **Web application**.
3. У розділі **Authorized redirect URIs** додайте: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Скопіюйте згенеровані **Client ID** та **Client Secret**.
5. У Heym Dashboard → **Credentials** → **New** → тип **BigQuery (OAuth2)**.
6. Введіть Client ID, Client Secret та назву, потім натисніть **Connect**, щоб відкрити спливаюче вікно згоди Google та авторизувати доступ.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `client_id` | OAuth2 Client ID з Google Cloud Console |
| `client_secret` | OAuth2 Client Secret з Google Cloud Console |

Token-и (`access_token`, `refresh_token`, `token_expiry`) зберігаються та оновлюються автоматично.

### Примітки

- Екран згоди OAuth2 потребує scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Production:** Встановіть для бекенду **`FRONTEND_URL`** значення публічної URL-адреси. Зареєструйте `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` у Google Cloud Console.

### Використовується

- [Вузол BigQuery](../nodes/bigquery-node.md)

---

## Supabase

Облікові дані Supabase з'єднують Heym з PostgREST API проєкту Supabase, щоб workflow-и могли виконувати запити та змінювати таблиці на основі Postgres.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `supabase_url` | Базова URL-адреса проєкту, наприклад `https://your-project.supabase.co` |
| `supabase_key` | API-ключ із доступом до цільових таблиць |
| `supabase_schema` | Необов'язкова схема за замовчуванням (типово `public`) |

### Примітки

- [Вузол Supabase](../nodes/supabase-node.md) звертається до `/rest/v1/<table>` та підтримує операторні фільтри (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` і пов'язані оператори PostgREST), а також вкладені логічні групи `or` / `and`.
- Для операцій запису віддавайте перевагу ключу, призначеному для довіреного використання на стороні сервера, з мінімально необхідними дозволами на таблиці.
- Вузли можуть перевизначати схему на кожному кроці, навіть якщо облікові дані визначають схему за замовчуванням.

### Використовується

- [Вузол Supabase](../nodes/supabase-node.md)

## ClickHouse

Облікові дані ClickHouse з'єднують Heym із зовнішньою базою даних ClickHouse через її HTTP-інтерфейс, щоб workflow-и могли виконувати операції SQL, CRUD та підрахунку над OLAP-таблицями.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `host` | HTTP-хост без схеми, наприклад `your-instance.clickhouse.cloud` |
| `port` | Порт HTTP-інтерфейсу (`8443` для HTTPS, `8123` для HTTP) |
| `username` | Користувач ClickHouse (типово `default`) |
| `password` | Пароль користувача (необов'язково) |
| `database` | Цільова база даних (типово `default`) |
| `secure` | Використовувати HTTPS, коли `true` (обов'язково для ClickHouse Cloud) |

### Примітки

- [Вузол ClickHouse](../nodes/clickhouse-node.md) використовує офіційний HTTP-клієнт `clickhouse-connect` та параметризує прив'язки фільтрів і значень.
- `update` та `remove` відповідають `ALTER TABLE ... UPDATE` та `DELETE FROM`, які є асинхронними мутаціями ClickHouse; обидві вимагають фільтра.
- `upsert` виконує `INSERT` і припускає таблицю `ReplacingMergeTree` для поведінки злиття за ключем.
- Скористайтеся **Test connection** у діалозі облікових даних, щоб перевірити доступність.

### Використовується

- [Вузол ClickHouse](../nodes/clickhouse-node.md)

## Notion

Облікові дані Notion підтримують або token внутрішньої інтеграції, або OAuth-з'єднання публічної інтеграції. OAuth дозволяє кожному користувачеві авторизувати робочий простір Notion з Heym замість ручного копіювання token-а.

### Обов'язкові поля

| Режим | Поле | Опис |
|------|-------|-------------|
| Внутрішній token | `api_token` | Token внутрішньої інтеграції (`ntn_...`) |
| OAuth | `client_id` | Client ID з публічної інтеграції Notion |
| OAuth | `client_secret` | Client Secret з публічної інтеграції Notion |

Callback OAuth автоматично зберігає `access_token`, `auth_mode`, `workspace_id`, `workspace_name` та `bot_id`. Будь-який попередній внутрішній `api_token` видаляється після завершення OAuth. Зареєструйте цю redirect URI в Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Процес налаштування OAuth

1. Виберіть **OAuth** у діалозі облікових даних, введіть назву, Client ID та Client Secret.
2. Натисніть **Connect** та авторизуйте робочий простір у спливаючому вікні Notion.
   - Для **нових** облікових даних Heym створює запис облікових даних, коли Ви натискаєте **Connect**.
   - Завершіть авторизацію у спливаючому вікні, потім натисніть **Save**, щоб повернутися до списку облікових даних.
3. Під'єднані облікові дані відображаються як `connected (Workspace Name)` у списку. Облікові дані з незавершеним OAuth відображаються як `Not connected`, доки авторизація не завершиться.

Скористайтеся **Test Connection** у діалозі облікових даних, щоб перевірити як внутрішній token, так і завершену авторизацію OAuth. Під час редагування залишення поля token-а порожнім зберігає збережений внутрішній token.

Як внутрішні token-и, так і access token-и OAuth доступні через
`$credentials.CredentialName` для користувацьких викликів [HTTP](../nodes/http-node.md), яким потрібен bearer token Notion.
### Примітки

- Внутрішні інтеграції потребують надання спільного доступу до відповідних сторінок, баз даних і джерел даних.
- Користувачі OAuth обирають робочий простір/сторінки під час авторизації в Notion.
- Облікові дані застосунку OAuth шифруються всередині облікових даних Notion. Зворотний виклик перезавантажує
  їх на стороні сервера; секрет не вбудовується в стан OAuth.
- Підключені облікові дані OAuth відображають назву робочого простору; облікові дані OAuth, що очікують на обробку, показують
  `Not connected`, доки авторизацію не завершено.
- **Продакшн:** Встановіть для бекенду **`FRONTEND_URL`** публічну URL-адресу браузера (схема + хост, без
  кінцевої скісної риски). URI перенаправлення Notion має точно збігатися:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Вузол використовує версію API `2026-03-11` і поточну термінологію `data_source`. Дивіться
  статтю [Вузол Notion](../nodes/notion-node.md#api-version-notes) щодо настанов із міграції з
  давніших прикладів `archived`, `after` або запитів до бази даних.
- Старі фільтри пошуку зі значенням об'єкта `database` нормалізуються до `data_source`.

### Використовується

- [Вузол Notion](../nodes/notion-node.md)

---

## SMTP (Електронна пошта)

Облікові дані SMTP зберігають відомості про підключення до сервера електронної пошти для надсилання вихідних листів.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `host` | Ім'я хоста сервера SMTP (наприклад, `smtp.gmail.com`) |
| `port` | Порт SMTP (зазвичай `587` для STARTTLS, `465` для SSL) |
| `email` | Адреса електронної пошти відправника |
| `password` | Пароль SMTP або пароль застосунку |

### Поширені постачальники SMTP

| Постачальник | Хост | Порт | Примітки |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Потребує [пароля застосунку](https://support.google.com/accounts/answer/185833) (двофакторну автентифікацію має бути увімкнено) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Використовуйте облікові дані Вашого облікового запису Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Використовуйте облікові дані SMTP Mailgun із налаштувань Вашого домену |
| SendGrid | `smtp.sendgrid.net` | `587` | Використовуйте `apikey` як ім'я користувача та ключ API як пароль |
| Власний / самостійно розміщений | Ваш домен | `587` / `465` | Postfix, Exim тощо |

### Примітки

- Gmail потребує **пароля застосунку** замість Вашого звичайного пароля, коли увімкнено двоетапну перевірку.
- Порт `587` використовує STARTTLS (починається з відкритого тексту, переходить на TLS). Порт `465` використовує неявний TLS (SSL від самого початку).

### Використовується

- [Вузол Send Email](../nodes/send-email-node.md)

---

## IMAP (Вхідна електронна пошта)

Облікові дані IMAP зберігають відомості про підключення для моніторингу вхідних повідомлень за допомогою [вузла IMAP Trigger](../nodes/imap-trigger-node.md).

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `imap_host` | Ім'я хоста сервера IMAP (наприклад, `imap.gmail.com`) |
| `imap_port` | Порт IMAP (`993` для SSL/TLS у більшості постачальників) |
| `imap_username` | Ім'я користувача поштової скриньки або повна адреса електронної пошти |
| `imap_password` | Пароль або специфічний для постачальника пароль застосунку |

### Необов'язкові поля

| Поле | Опис |
|-------|-------------|
| `imap_mailbox` | Тека поштової скриньки для моніторингу (за замовчуванням: `INBOX`) |
| `imap_use_ssl` | Увімкнути SSL/TLS (рекомендовано; за замовчуванням: `true`) |

### Примітки

- Trigger IMAP встановлює базовий рівень поточної поштової скриньки під час першого опитування, а потім обробляє лише новіші листи.
- Gmail, Microsoft 365 та інші хостингові постачальники часто потребують **пароля застосунку** або подібного секрету, специфічного для IMAP.
- Вміст вкладень не завантажується в payload workflow; Heym надає лише метадані вкладень.

### Використовується

- [Вузол IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP як тригер workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) — це брокер повідомлень з відкритим вихідним кодом. Облікові дані RabbitMQ зберігають відомості про підключення для публікації в черги та обміни й споживання з них.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `rabbitmq_host` | URL-адреса підключення AMQP (наприклад, `amqp://localhost:5672`) |
| `rabbitmq_username` | Ім'я користувача RabbitMQ (за замовчуванням: `guest`) |
| `rabbitmq_password` | Пароль RabbitMQ (за замовчуванням: `guest`) |

### Віртуальні хости

Щоб підключитися до певного віртуального хоста, включіть його в URL-адресу `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Якщо використовується віртуальний хост за замовчуванням, шлях `/` можна опустити.

### Плагін відкладених повідомлень

[Вузол RabbitMQ](../nodes/rabbitmq-node.md) підтримує плагін **rabbitmq_delayed_message_exchange**. Коли цей плагін увімкнено на Вашому сервері RabbitMQ, Ви можете встановити затримку (у мілісекундах) для вихідних повідомлень за допомогою поля `rabbitmqDelayMs` на вузлі.

Вузол встановлює заголовок `x-delay` для опублікованого повідомлення. Тип обміну має бути `x-delayed-message`, щоб затримки набули чинності.

Щоб увімкнути плагін на самостійно розміщеному екземплярі RabbitMQ:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Коли плагін не встановлено, заголовок `x-delay` ігнорується, і повідомлення доставляються негайно.

### Використовується

- [Вузол RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ як тригер workflow)

---

## Amazon S3

Облікові дані Amazon S3 з'єднують Heym з [Amazon S3](https://aws.amazon.com/s3/). Використовуйте їх із [вузлом Amazon S3](../nodes/amazon-s3-node.md) для керування бакетами та теками, завантаження й вивантаження об'єктів, копіювання ключів, а також переліку або видалення об'єктів із workflow.
### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `aws_access_key_id` | Ідентифікатор ключа доступу AWS IAM |
| `aws_secret_access_key` | Секретний ключ доступу, пов'язаний з ідентифікатором ключа доступу |
| `aws_region` | Регіон AWS, де розміщено бакети (наприклад, `us-east-1`) |

### Необов'язкові поля

| Поле | Опис |
|-------|-------------|
| `aws_session_token` | Тимчасовий session token під час використання облікових даних AWS STS |

### Примітки

- Облікові дані використовують стандартну автентифікацію AWS SigV4 через boto3.
- Операції завантаження наразі надсилають текстовий вміст у кодуванні UTF-8; завантаження можуть повертати текст або base64 для бінарних об'єктів.

### Використовується в

- [Вузол Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) — це сховище «ключ-значення» в оперативній пам'яті, яке використовується для кешування та швидкого доступу до даних.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `host` | Ім'я хоста або IP-адреса сервера Redis (наприклад, `localhost`) |
| `port` | Порт Redis (за замовчуванням: `6379`) |
| `password` | Пароль Redis (залиште порожнім, якщо не встановлено) |

### Використовується в

- [Вузол Redis](../nodes/redis-node.md)

---

## Slack

Облікові дані Slack зберігають **Incoming Webhook URL** для надсилання повідомлень у канали Slack.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `webhook_url` | Incoming Webhook URL Slack (з конфігурації Вашого застосунку Slack) |

### Примітки

- Створіть Incoming Webhook за адресою [api.slack.com/apps](https://api.slack.com/apps) → Ваш застосунок → **Incoming Webhooks**.
- Кожен webhook прив'язаний до конкретного каналу. Створіть кілька облікових даних для різних каналів.

### Використовується в

- [Вузол Slack](../nodes/slack-node.md)

---

## Telegram

Облікові дані Telegram зберігають **Bot Token** та необов'язковий **Webhook Secret Token** для workflow на основі ботів.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `bot_token` | Токен Telegram Bot API, отриманий від BotFather |

### Необов'язкові поля

| Поле | Опис |
|-------|-------------|
| `secret_token` | Спільний секрет, який перевіряється за заголовком `x-telegram-bot-api-secret-token` у вхідних webhook |

### Примітки

- Використовуйте однакові облікові дані як для [Telegram Trigger](../nodes/telegram-trigger-node.md), так і для [Telegram](../nodes/telegram-node.md).
- Зареєструйте webhook вручну через API `setWebhook` Telegram, використовуючи URL, показаний на панелі вузла Telegram Trigger.
- `chatId` у вузлі Telegram може бути літеральним ідентифікатором або виразом на кшталт `$telegramEvent.message.chat.id`.

### Використовується в

- [Вузол Telegram Trigger](../nodes/telegram-trigger-node.md)
- [Вузол Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Ці облікові дані використовуються [вузлом HTTP](../nodes/http-node.md) для автентифікації вихідних запитів.

### Bearer

Додає заголовок `Authorization: Bearer <token>` до HTTP-запитів.

| Поле | Опис |
|-------|-------------|
| `token` | Значення bearer token |

### Header

Додає користувацький заголовок до HTTP-запитів.

| Поле | Опис |
|-------|-------------|
| `header_key` | Назва заголовка (наприклад, `X-Api-Key`) |
| `header_value` | Значення заголовка |

Обидва типи також можна посилати через `$credentials.CredentialName` у [Expression DSL](./expression-dsl.md) для динамічного використання в будь-якому вузлі, що приймає вирази.

### Використовується в

- [Вузол HTTP](../nodes/http-node.md)

---

## Постачальники LLM (OpenAI, Google, Custom, Cohere)

Ці облікові дані забезпечують роботу AI-вузлів.

| Тип | Опис |
|------|-------------|
| **OpenAI** | API-ключ для моделей GPT та embeddings OpenAI |
| **Google** | API-ключ для моделей Gemini |
| **Custom** | API-ключ + base URL для endpoint, сумісних з OpenAI (Ollama, vLLM, LM Studio тощо) |
| **Cohere** | API-ключ для embeddings Cohere |

### Кешування Prompt в OpenAI

OpenAI автоматично кешує статичний (незмінний) префікс Вашого system prompt — додаткова конфігурація не потрібна. Повторні запуски workflow, які використовують той самий префікс system prompt, отримують перевагу від ціноутворення з кешованими token, що зменшує як витрати, так і затримку. Це особливо корисно, коли у Вас довгі фіксовані інструкції, а між запусками змінюється лише повідомлення користувача. Відстежуйте показники влучань у кеш та економію token на вкладці [Трасування](../tabs/traces-tab.md) або в панелі використання OpenAI, щоб оптимізувати структуру prompt для максимального повторного використання кешу.

### Використовується в

- [Вузол LLM](../nodes/llm-node.md)
- [Вузол Agent](../nodes/agent-node.md)
- [Вузол RAG](../nodes/rag-node.md) (embeddings OpenAI через облікові дані Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) — це проксі-сервер для обходу Cloudflare та подібних засобів захисту від ботів.

### Обов'язкові поля

| Поле | Опис |
|-------|-------------|
| `flaresolverr_url` | URL Вашого екземпляра FlareSolverr (наприклад, `http://localhost:8191`) |

Тут підтримуються loopback- та приватні адреси, тому запуск FlareSolverr поряд з Heym працює згідно з документацією. URL не може вказувати на link-local або cloud-metadata адресу. Оскільки приватні адреси дозволені, це поле також можна спрямувати на інший внутрішній сервіс, і відповідь повернеться у виводі вузла. Будь-який автентифікований користувач може створити ці облікові дані, тож межа визначається тим, хто може створювати workflow, а також Вашими мережевими правилами, а не спільним використанням облікових даних. Див. [Безпека вихідного трафіку](../nodes/crawler-node.md#egress-safety).

### Використовується в

- [Вузол Crawler](../nodes/crawler-node.md)

---
## Пов'язані розділи

- [Облікові дані](./credentials.md) – Огляд облікових даних і того, як вузли їх використовують
- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання та керування обліковими даними
- [Спільний доступ до облікових даних](./credentials-sharing.md) – Надання облікових даних користувачам і командам
- [Безпека](./security.md) – Шифрування даних у стані спокою, контроль доступу
- [Expression DSL](./expression-dsl.md) – Синтаксис `$credentials` для динамічного доступу

---

## Model Router (Auto Model)

Спрямовує кожен запит до одного з Ваших наявних облікових даних моделі, використовуючи для
вибору модель прийняття рішень. Він зберігає лише посилання й ніколи не має власного ключа.

### Обов'язкові поля

- `decision_credential_id` – облікові дані **Decision Model**, до яких Ви маєте доступ.
- `decision_model` – модель, яка виконує виклик маршрутизації, наприклад `jev-latest`.
- `options` – щонайменше два записи, кожен із назвою, одними з Ваших облікових даних
  OpenAI/Google/Custom, моделлю на них та критеріями, що визначають, коли він має перемагати.

### Необов'язкові поля

- `routing_instructions` – як загалом зважувати варіанти.
- Один варіант може бути позначений як резервний, що використовується в разі збою маршрутизації.

### Примітки

Назви варіантів — це те, з-поміж чого обирає модель прийняття рішень, тож вони мають бути
унікальними. Варіант не може вказувати на інший Model Router.

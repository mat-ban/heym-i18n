# Credentials

Credentials зберігають API keys і secrets, які використовуються вузлами workflow. Ви додаєте їх у [Credentials Tab](../tabs/credentials-tab.md) і посилаєтеся на них за назвою в конфігурації вузла.

## Що таке Credentials

- **Зберігаються для кожного користувача** – Кожен credential належить користувачу і може бути [shared](./credentials-sharing.md) з іншими користувачами або [Teams](./teams.md).
- **Зашифровані під час зберігання** – Чутливі значення зашифровані; UI маскує їх після створення.
- **Посилання за назвою** – Вузли вибирають credential за назвою (або ID). Механізм виконання розпізнає credential для власника workflow під час запуску.

## Як вузли їх використовують

| Тип вузла | Типовий credential | Призначення |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Evals](../tabs/evals-tab.md) | OpenAI, Google, Custom | API key для моделі |
| [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) judge | Decision Model | Base URL для decision model endpoint, плюс опціональний API key |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Вибирає, яка з ваших моделей обслуговує кожен запит, використовуючи decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Вхід за підпискою ChatGPT (OAuth) або Codex access token для runner, плюс GitHub PAT для операцій з репозиторієм |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API key для OpenCode Go gateway (опціональний base URL) для runner, плюс GitHub PAT для операцій з репозиторієм |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) для викликів GitHub API, операцій вузла GitHub і MCP integrations |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token або Data Center username/password, Jira site base URL, режим розгортання та опціональна версія REST API |
| [Linear](../nodes/linear-node.md) | Linear | Personal API key або OAuth2 для teams, projects, issues і comments |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Auth для запитів |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token і опціональний webhook secret |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Application public key для перевірки підпису |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Підключення до vector store (зовнішній Qdrant або власний Postgres Heym через pgvector), з OpenAI або будь-яким OpenAI-сумісним embedding endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook або API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Підключення до вхідної поштової скриньки |
| [Send Email](../nodes/send-email-node.md) | SMTP | Поштовий сервер |
| [Redis](../nodes/redis-node.md) | Redis | Підключення |
| [Grist](../nodes/grist-node.md) | Grist | API key + server URL |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 consent |
| [Supabase](../nodes/supabase-node.md) | Supabase | Project URL + API key (+ опціональна default schema) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + username/password + database (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token або public integration Client ID + Client Secret + OAuth consent |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token плюс опціональний self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

Для детального налаштування (hosts, ports, поля, специфічні для провайдера), дивіться [Third-Party Integrations](./integrations.md). Це включає налаштування Telegram bot, вхідну пошту через IMAP і вихідну пошту через SMTP.

GitHub credentials також можуть включати опціональний `base_url`, коли ви націлені на GitHub
Enterprise Server замість GitHub.com. Коли ви редагуєте GitHub credential, щоб оновити token,
залишення `base_url` порожнім зберігає існуючий Enterprise endpoint. Введіть новий URL лише коли
ви хочете змінити цей endpoint.

Jira, Linear, Supabase, Notion, Sentry і ClickHouse credentials надають **Test Connection** у діалозі credential. Для Jira перевірка викликає Jira's current user endpoint. Для Linear
перевірка викликає Linear API з `getViewer` і підтверджує, що API key або OAuth token дійсний.
Під час редагування ви можете тестувати без повторного введення API key, якщо збережений secret все ще присутній. Для Notion
виберіть **Internal token** або **OAuth** у діалозі; OAuth використовує Client ID і Client Secret
з вашого Notion public integration. Дивіться [Third-Party Integrations](./integrations.md#notion) для
деталей налаштування Notion.

## Використання пакета для програмування

Вкладка **AI Defaults** у [Settings](./user-settings.md) показує залишок використання пакета для програмування для Ваших Codex-облікових даних (власних і спільних). Для кожного Codex-облікового запису вона відображає горизонтальну смугу для кожного активного вікна обмеження швидкості — зазвичай вікно **5 hours** та/або **Weekly**, залежно від Вашого плану — із відсотком залишку квоти та зворотним відліком до скидання. Дані надходять із заголовків відповіді про обмеження швидкості від Codex backend і завантажуються на вимогу.

Облікові дані OpenCode Go також перелічені там, але позначені як **"usage unavailable"**: шлюз OpenCode zen не надає даних про залишок квоти, тому смугу показати неможливо.

## У виразах

Деякі вузли дозволяють вирази для автентифікації. Використовуйте [Expression DSL](./expression-dsl.md) з `$credentials.CredentialName`, щоб посилатися на розв'язаний секрет облікових даних усередині виразу. Щодо рядка заголовка, потрібного кожному типу облікових даних у HTTP-запиті, див. [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Codex-облікові дані навмисно виключені з `$credentials`. Незалежно від того, чи Ви входите через ChatGPT (підписка, без витрат API за кожен token), чи вставляєте Codex `access_token`, токени передаються лише локальному процесу Codex runner. Токени входу ChatGPT оновлюються автоматично після завершення терміну дії.

Jira-облікові дані також виключені з `$credentials`. [Jira node](../nodes/jira-node.md) завантажує облікові дані за `credentialId` під час виконання. Для власних Jira REST-викликів, не покритих Jira node, використовуйте [HTTP node](../nodes/http-node.md) з Jira Basic Auth (`email:api_token` для Jira Cloud або `username:password` для Data Center / Server), наприклад `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Ви також можете використати [Header](../nodes/http-node.md) credential з `Authorization: Basic <base64(user:secret)>`. Jira Data Center / Server personal access tokens і Bearer auth поки не підтримуються Jira credential.

| Тип облікових даних | Значення, доступне для `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Рядок Bearer token |
| Header | Повний рядок `header key: header value`, готовий для вставки в аргумент cURL `-H` |
| GitHub | Personal access token |
| Notion | Внутрішній `api_token` або OAuth `access_token` (Bearer token для викликів Notion API) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Приклад:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Використовуйте Notion **node** для нативних операцій з базами даних, сторінками та блоками. Використовуйте `$credentials`, коли власний [HTTP](../nodes/http-node.md)-запит потребує того самого Notion bearer token.

## Створення облікових даних із чату

[AI Assistant](./ai-assistant.md#credentials), вкладка [Chat](../tabs/chat-tab.md) і [Chat with Heym](./chat-with-heym.md) можуть створити облікові дані, коли вони потрібні workflow, або коли Ви попросите. Асистент пропонує тип і назву, і звичайна форма облікових даних відкривається в розмові. Попросіть оновити облікові дані, якими Ви володієте, і та сама форма відкриється на них із замаскованими секретами. Асистент бачить лише назву та тип. `heym_chat` через [MCP](../tabs/mcp-tab.md) не може створювати, оновлювати чи вибирати облікові дані.

## Пов'язане

- [Credentials Tab](../tabs/credentials-tab.md) – Додавання, редагування, видалення облікових даних
- [GitHub Node](../nodes/github-node.md) – Нативні операції GitHub REST
- [Jira Node](../nodes/jira-node.md) – Автоматизація проєктів, задач, коментарів, вкладень, користувачів, сповіщень і переходів Jira
- [Linear Node](../nodes/linear-node.md) – Автоматизація робочого простору та задач Linear GraphQL
- [Notion Node](../nodes/notion-node.md) – Пошук і керування вмістом Notion
- [Sentry Node](../nodes/sentry-node.md) – Автоматизація організацій, проєктів, команд, задач, подій і релізів Sentry
- [Credentials Sharing](./credentials-sharing.md) – Поширення для користувачів і команд
- [Third-Party Integrations](./integrations.md) – Посібник із налаштування для кожного типу облікових даних
- [Expression DSL](./expression-dsl.md) – `$credentials` у виразах

## Model Router (Auto Model)

Model Router не містить ключа. Він містить **decision model credential**, список **model
options** — кожен є наявними OpenAI, Google або Custom credential плюс модель — і для
кожного варіанта вільний текст, що вказує, коли цей варіант слід використовувати.

Він з'являється в кожному засобі вибору, що пропонує модель: вузли [LLM](../nodes/llm-node.md) і
[Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboards, конструктор виразів і Data Tables. Його єдина модель — **Auto**. Виберіть її, і decision model читає кожен запит і маршрутизує його. [Evals](../tabs/evals-tab.md) його не включає, оскільки eval порівнює конкретні моделі, а router вибирає сам.

Agent повторно маршрутизує в міру просування свого циклу інструментів, тож дешева модель може взяти ранні ходи, а сильніша — хід, де вона потрібна. Ідентичні вхідні дані повторно використовують попереднє рішення, тож цикл платить за рішення лише тоді, коли розмова справді просунулася.

### Чого він не може

Auto Model не можна поєднувати з **Responses API**, **Batch mode** або **image
output**. Ці перемикачі вимикаються самі, коли вибрано router, і кожен пояснює чому.
Перевірки Guardrail і класифікатор політики human-review є фіксованими одно-модельними викликами і ніколи не маршрутизуються.

### Коли маршрутизація не вдається

Позначте один варіант **Use this option when routing fails**, і збій моделі прийняття рішень ніколи
не зупинить виконання; буде використано fallback, а причину записано у виконанні. Без цього
вузол зазнає невдачі, а не вгадуватиме.

### Перегляд того, куди пішов запит

Traces показує `Auto Model / GPT-5`, а не лише модель, і витрати залишаються віднесеними
до моделі, яка фактично виконувалася. Execution Log і Span View на полотні показують ту саму пару,
а Span View перелічує, який крок куди пішов.

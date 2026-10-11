# Вкладка Credentials

Вкладка **Credentials** керує API-ключами та секретами, які використовуються вузлами. Додайте credentials тут і посилайтеся на них за назвою у вузлах workflow. Огляд того, що таке credentials і як вузли їх використовують, дивіться в [Credentials](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Переглянути демонстрацію Credentials</a></p>

## Типи Credentials

| Тип | Випадок використання |
|------|----------|
| **OpenAI** | API-ключ OpenAI для вузлів LLM, Agent і RAG |
| **Google** | API-ключ Google AI (Gemini) |
| **GitHub** | Персональний access token (PAT) GitHub для GitHub API, workflow з вузлом GitHub, MCP-серверів і workflow агентів; необов'язковий `base_url` для GitHub Enterprise |
| **Linear** | Персональний API-ключ Linear або OAuth2 для команд, проєктів, завдань і коментарів |
| **Notion** | Internal integration token або авторизація робочого простору через OAuth публічної інтеграції |
| **Custom** | Власні LLM endpoints |
| **Bearer** | Bearer token для HTTP-автентифікації |
| **Header** | Власний header key-value для HTTP-запитів |
| **Telegram** | Token бота Telegram і необов'язковий webhook secret |
| **Slack** | URL вхідного webhook Slack |
| **Discord** | URL вхідного webhook Discord |
| **Discord Trigger** | Публічний ключ застосунку Discord |
| **IMAP** | Credentials для trigger вхідної поштової скриньки |
| **SMTP** | Credentials для надсилання електронної пошти |
| **Redis** | З'єднання з Redis |
| **RAG: Qdrant + OpenAI** | Векторне сховище для вузлів RAG на базі зовнішнього сервера Qdrant |
| **RAG: Psql + OpenAI** | Векторне сховище для вузлів RAG на базі власної бази даних Postgres Heym (pgvector) — без зовнішнього сервісу |
| **RAG: Custom Embeddings** | Векторне сховище для вузлів RAG з використанням будь-якого сумісного з OpenAI embedding endpoint, з Qdrant або Postgres (pgvector) як сховищем |
| **Cohere** | API Cohere для embeddings |

## Додавання Credentials

1. Натисніть **Add Credential**
2. Виберіть тип credential
3. Введіть потрібні значення (API-ключ, URL тощо)
4. Дайте йому назву для посилання у вузлах

Для GitHub поточний процес credential базується на PAT. Рекомендуються fine-grained PAT. Процеси встановлення GitHub App наразі не є першокласними в UI. Якщо Ви використовуєте GitHub Enterprise Server, Ви також можете встановити необов'язковий базовий URL GitHub API, наприклад `https://github.example.com/api/v3`.

Для Linear виберіть **Personal API key** або **OAuth2** у діалозі. Персональні API-ключі створюються
в **Settings → Security & Access → Personal API keys** у Linear. OAuth2 використовує Client ID і
Client Secret застосунку Linear OAuth, із зареєстрованим
`{FRONTEND_URL}/api/credentials/linear/oauth/callback` як redirect URI. Credential діє з дозволами
користувача Linear, який його створив або авторизував. Використовуйте **Test Connection** у діалозі
credential, щоб перевірити API-ключ або OAuth token перед збереженням.

Для **Notion** виберіть **Internal token** або **OAuth** у діалозі. OAuth використовує Client ID і
Client Secret з Вашої публічної інтеграції Notion; Heym зберігає їх зашифрованими в credential.
Використовуйте **Test Connection**, щоб перевірити credentials Supabase, Linear або Notion перед
збереженням workflow. Деталі налаштування Notion дивіться в
[Third-Party Integrations](../reference/integrations.md#notion).

Credentials OAuth відкривають сторінку авторизації провайдера у спливному вікні. Якщо браузер її
блокує, скористайтеся посиланням **Open the authorization page** під кнопкою Connect; діалог
повідомляє про завершення з'єднання. Щойно новий credential підключено, кнопка показує **Connected**.

## Редагування та видалення

- **Edit** – Оновіть значення credential (чутливі значення замасковано)
- **Delete** – Видаліть credential; workflow, що його використовують, потребуватимуть заміни

Під час редагування credential **GitHub** на GitHub Enterprise Server залишення необов'язкового поля
**GitHub API Base URL** порожнім зберігає наявний Enterprise endpoint. Вводьте новий URL лише тоді,
коли Ви хочете змінити цей endpoint.

## Спільний доступ

- [Діліться credentials](../reference/credentials-sharing.md) з іншими користувачами електронною поштою або з [Teams](../reference/teams.md)
- Спільні credentials відображаються з індикатором
- Скасуйте спільний доступ із меню картки credential

## Використання у Nodes

Посилайтеся на credentials за назвою в конфігурації node. Наприклад:
- [LLM node](../nodes/llm-node.md) – Виберіть credential для API моделі
- [HTTP node](../nodes/http-node.md) – Використовуйте Bearer або Header credentials для автентифікації
- [Agent node](../nodes/agent-node.md) – Передавайте GitHub tokens у змінні середовища MCP server, як-от `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub node](../nodes/github-node.md) – Виконуйте нативні операції з репозиторіями, користувачами, issues, review, release, workflow, traffic і файлами GitHub
- [Linear node](../nodes/linear-node.md) – Читайте метадані workspace і автоматизуйте Linear issues та коментарі
- [Notion node](../nodes/notion-node.md) – Керуйте базами даних, джерелами даних, сторінками та блоками Notion
- [RAG node](../nodes/rag-node.md) – Використовуйте credential Qdrant або Postgres (pgvector) для vector store
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Отримуйте webhooks Telegram-бота
- [Telegram node](../nodes/telegram-node.md) – Надсилайте повідомлення Telegram-бота
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Отримуйте webhooks взаємодій Discord
- [Discord node](../nodes/discord-node.md) – Надсилайте повідомлення Discord webhook
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Опитуйте спільну поштову скриньку на наявність нових листів

Дивіться [Expression DSL](../reference/expression-dsl.md) щодо посилання на значення, підкріплені credentials, у виразах.

## Пов'язане

- [Third-Party Integrations](../reference/integrations.md) – Детальний посібник із налаштування для кожного типу credential (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack тощо)
- [Credentials Sharing](../reference/credentials-sharing.md) – Діліться credentials з іншими користувачами
- [Security](../reference/security.md) – Шифрування даних у стані спокою, керування сесіями, обмеження швидкості
- [Node Types](../reference/node-types.md) – Nodes, які використовують credentials ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Використовує credentials Qdrant або Postgres (pgvector)
- [Chat Tab](./chat-tab.md) – Використовує credentials OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактний посібник зі сторінок для поверхонь dashboard

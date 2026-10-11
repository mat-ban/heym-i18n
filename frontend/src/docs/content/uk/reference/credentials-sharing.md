# Спільний доступ до облікових даних

Облікові дані можна надавати іншим користувачам, щоб їхні workflow могли використовувати Ваші API-ключі. Загальний огляд дивіться в розділі [Облікові дані](./credentials.md), а додавання та керування обліковими даними — на вкладці [Облікові дані](../tabs/credentials-tab.md).

## Надання облікових даних LLM

Щоб дозволити LLM або AI-агенту використовувати API-ключ, збережіть ключ як облікові дані й дозвольте вузлу, який виконує запит, прикріпити їх. Модель вирішує, що викликати; вузол автентифікує виклик під час виконання.

- **Зберігайте секрет як облікові дані.** Чутливі значення шифруються під час зберігання та маскуються в інтерфейсі після створення.
- **Посилайтеся на них там, де виконується запит.** Вузли [LLM](../nodes/llm-node.md) та [Agent](../nodes/agent-node.md) вибирають свої облікові дані моделі за ID, а HTTP-запити додають `$credentials.CredentialName` у заголовок автентифікації. Тримайте секрети поза полями prompt, оскільки все, що міститься в prompt, надсилається постачальнику моделі як текст.
- **Надавайте агенту інструменти, а не ключі.** Коли Agent викликає HTTP-вузол, MCP-сервер або під-workflow як інструмент, облікові дані застосовуються всередині цього інструмента, а модель отримує результат роботи інструмента.
- **Виводи маскуються.** Коли значення облікових даних довше семи символів з'являється у виводі вузла, зберігаються лише перші сім символів, тож відповідь, яка повторює ключ, показує в результатах і трасуваннях лише цей префікс. Дивіться [Маскування виводів](#output-masking).
- **Дозвольте асистенту створювати облікові дані.** Коли [AI Assistant](./ai-assistant.md#credentials) або вкладка Chat створює облікові дані, він бачить лише назву та тип, а секрет Ви вводите у звичайній формі облікових даних.
- **Надавайте доступ людям так само.** Надайте облікові дані користувачу або команді, як описано нижче, і їхні workflow зможуть використовувати Ваш ключ через власні вузли LLM та Agent.

## Модель спільного доступу

- **CredentialShare** – пов'язує `credential_id` з `user_id` (унікально для кожної пари)
- **Надання за електронною поштою** – `POST /api/credentials/{credential_id}/shares` з електронною поштою; користувача знаходять і додають
- **Відкликання** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Також можна надавати облікові дані [командам](./teams.md):

- **CredentialTeamShare** – пов'язує `credential_id` з `team_id`; усі члени команди отримують доступ
- **Надання команді** – `POST /api/credentials/{credential_id}/team-shares` з `team_id`
- **Відкликання надання команді** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Спільні облікові дані позначаються індикатором в інтерфейсі вкладки [Облікові дані](../tabs/credentials-tab.md).

## Облікові дані з широкою областю дії

Надання облікових даних передає отримувачу все, на що ці облікові дані здатні. Для більшості інтеграцій це обмежується одним робочим простором або дозволами одного API-ключа, але деякі облікові дані мають значно ширшу область дії.

> **Облікові дані Google Drive надають повний доступ до Drive.** Облікові дані [Google Drive](../nodes/google-drive-node.md) авторизуються з областю `https://www.googleapis.com/auth/drive`, щоб вузол міг працювати з файлами, які вже належать Вам. Надання їх користувачу або команді дає кожному з них можливість **читати, змінювати та остаточно видаляти будь-що у Вашому Google Drive** через workflow — не лише файли, які Ви мали на увазі. Надавайте їх лише тим людям, яким Ви надали б повний доступ до Drive безпосередньо.

Якщо потрібно обмежити доступ, створіть окремий обліковий запис Google із доступом лише до тек, потрібних workflow, і підключіть облікові дані з цим обліковим записом замість основного.

Облікові дані **Decision Model** містять endpoint і, якщо задано, API-ключ. Їх надання дозволяє отримувачу витрачати кошти за цим ключем із будь-якого workflow, який він може запускати, так само як з обліковими даними LLM.

Облікові дані **Model Router** надають усе, на що вони маршрутизують. Люди, яким Ви їх надали, можуть виконувати запити до кожних облікових даних зі свого списку опцій, і ці запити витрачають Ваші ключі. Вони не можуть прочитати ключі, і ці облікові дані не з'являються у їхньому власному списку облікових даних.

Це те саме надання, що й надання облікових даних OpenAI безпосередньо, і саме це робить router корисним для команди. Якщо Ви цього не бажаєте, надавайте окремі облікові дані й дозвольте кожному вибирати модель самостійно.

## Надання співробітникам workflow

Коли Ви надаєте workflow, співробітники можуть відкривати та запускати його, але не можуть використовувати Ваші облікові дані, якщо Ви не надасте їм ці облікові дані також. Це стосується облікових даних як в основному workflow, так і в будь-яких під-workflow, які він викликає. Надайте кожні облікові дані тим самим користувачам або командам, яких Ви запросили до workflow. Під-workflow також потрібно надавати окремо з редактора дочірнього workflow. Дивіться [Організація workflow](./workflow-organization.md#sharing-workflows).

## Контекст виконання

Коли workflow запускається, облікові дані визначаються для **власника workflow** (або поточного користувача під час запуску). `get_credentials_context()` об'єднує:

1. **Власні облікові дані** – `Credential.owner_id == user_id`
2. **Облікові дані, надані користувачу** – `CredentialShare`, де `CredentialShare.user_id == user_id`
3. **Облікові дані, надані команді** – `CredentialTeamShare`, де користувач є членом команди

Усі вони об'єднуються в єдиний словник контексту з ключами за назвою облікових даних.

## Використання у workflow
### За назвою (Expression DSL)

Облікові дані доступні як `$credentials.CredentialName` у [Expression DSL](./expression-dsl.md). Використовуйте це для:

- HTTP-вузлів (автентифікація Bearer/Header)
- Вузлів Telegram
- Вузлів Slack
- Bearer-токенів Notion у власних HTTP-запитах (внутрішній токен або OAuth access token)
- Будь-якого вузла, що приймає вирази для автентифікації

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### За ID (credentialId)

Деякі вузли зберігають `credentialId` (UUID) у `node.data`:

| Тип вузла | Поле | Опис |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Облікові дані LLM API |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Облікові дані access token Codex та облікові дані GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Облікові дані шлюзу OpenCode Go та облікові дані GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Облікові дані Jira Cloud email/API token або Data Center username/password |
| [Notion](../nodes/notion-node.md) | `credentialId` | Облікові дані внутрішнього токена Notion або OAuth workspace |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Облікові дані Sentry auth token та необов'язковий base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL проєкту Supabase та API-ключ |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Деталі підключення ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Облікові дані бота Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Облікові дані публічного ключа Discord або webhook |
| Vector Store | `credential_id` | Векторна БД Qdrant або Postgres (pgvector) через облікові дані Qdrant, Psql або Custom Embeddings RAG |
| Evals | `credential_id`, `judge_credential_id` | Облікові дані моделі; облікові дані моделі або Decision Model для судді LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | Модель LLM/Vision (для AI step та [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Виконавець завантажує облікові дані безпосередньо з бази даних за ID та розшифровує конфігурацію.

## Маскування виводу

Після виконання `mask_sensitive_output()` маскує значення облікових даних у виводі, зберігаючи перші сім символів кожного секрету довжиною понад сім символів і замінюючи решту на `**`, щоб секрети не розкривалися в результатах або трасуваннях.

## Пов'язане

- [Вкладка «Облікові дані»](../tabs/credentials-tab.md) – Додавання та надання спільного доступу до облікових даних
- [Сторонні інтеграції](./integrations.md) – Детальне налаштування для кожного типу облікових даних
- [Команди](./teams.md) – Спільний доступ із командами
- [Expression DSL](./expression-dsl.md) – Синтаксис `$credentials`
- [Типи вузлів](./node-types.md) – Вузли, що використовують облікові дані ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Вузол Agent](../nodes/agent-node.md) – Використовує `credentialId` для LLM

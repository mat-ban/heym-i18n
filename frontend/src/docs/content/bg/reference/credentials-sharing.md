# Споделяне на удостоверения

Удостоверенията могат да бъдат споделяни с други потребители, така че техните workflows да могат да използват Вашите API ключове. Вижте [Удостоверения](./credentials.md) за общ преглед и [Раздел Удостоверения](../tabs/credentials-tab.md) за добавяне и управление на удостоверения.

## Споделяне на удостоверения с LLM

За да позволите на LLM или на AI агент да използва API ключ, съхранете ключа като удостоверение и оставете node-а, който прави заявката, да го прикачи. Моделът решава какво да извика; node-ът удостоверява извикването, когато се изпълни.

- **Съхранете тайната като удостоверение.** Чувствителните стойности се криптират при съхранение и се маскират в UI след създаването.
- **Реферирайте го там, където се прави заявката.** [LLM](../nodes/llm-node.md) и [Agent](../nodes/agent-node.md) node-овете избират своето удостоверение за модел по ID, а HTTP заявките поставят `$credentials.CredentialName` в auth хедъра. Пазете тайните извън полетата за prompt, тъй като всичко в един prompt се изпраща към доставчика на модела като текст.
- **Дайте на агента инструменти, а не ключове.** Когато Agent извиква HTTP node, MCP сървър или sub-workflow като инструмент, удостоверението се прилага вътре в този инструмент и моделът получава резултата от инструмента.
- **Изходите се маскират.** Когато стойност на удостоверение, по-дълга от седем знака, се появи в изхода на node, се запазват само първите ѝ седем знака, така че отговор, който връща ключ, показва само този префикс в резултатите и изпълненията. Вижте [Маскиране на изхода](#output-masking).
- **Позволете на асистента да създава удостоверения.** Когато [AI Асистентът](./ai-assistant.md#credentials) или разделът Chat създаде удостоверение, той вижда само името и типа, а Вие въвеждате тайната в обичайната форма за удостоверение.
- **Споделяйте с хора по същия начин.** Споделете удостоверението с потребител или екип, както е описано по-долу, и техните workflows могат да използват Вашия ключ чрез свои собствени LLM и Agent node-ове.

## Модел на споделяне

- **CredentialShare** – Свързва `credential_id` с `user_id` (уникално за всяка двойка)
- **Споделяне по имейл** – `POST /api/credentials/{credential_id}/shares` с имейл; потребителят се търси и добавя
- **Отнемане** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Може също да споделяте удостоверения с [Екипи](./teams.md):

- **CredentialTeamShare** – Свързва `credential_id` с `team_id`; всички членове на екипа получават достъп
- **Споделяне с екип** – `POST /api/credentials/{credential_id}/team-shares` с `team_id`
- **Отнемане на споделяне с екип** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Споделените удостоверения показват индикатор в UI на [Раздел Удостоверения](../tabs/credentials-tab.md).

## Удостоверения с широк обхват

Споделянето на удостоверение предоставя на получателя всичко, което това удостоверение може да прави. За повечето интеграции това е ограничено до един workspace или до правата на един API ключ, но някои удостоверения са далеч по-широки.

> **Удостоверенията за Google Drive предоставят пълен достъп до Drive.** Удостоверението за [Google Drive](../nodes/google-drive-node.md) е оторизирано с обхвата `https://www.googleapis.com/auth/drive`, така че node-ът може да работи с файлове, които вече притежавате. Споделянето му с потребител или екип дава на всеки от тях възможността да **чете, променя и безвъзвратно изтрива всичко във Вашия Google Drive** чрез workflow — не само файловете, които сте имали предвид. Споделяйте го само с хора, на които бихте дали пълен достъп до Drive директно.

Ако трябва да ограничите излагането, създайте отделен Google акаунт с достъп само до папките, от които workflow-ът се нуждае, и свържете удостоверението с този акаунт вместо с основния си.

Удостоверението **Decision Model** носи endpoint-а и, когато е зададен, API ключ. Споделянето му позволява на получателя да харчи срещу този ключ от всеки workflow, който може да изпълни, точно както с удостоверение за LLM.

Удостоверението **Model Router** споделя всичко, към което маршрутизира. Хората, с които го споделите, могат да изпълняват заявки срещу всяко удостоверение в списъка му с опции и тези заявки харчат Вашите ключове. Те не могат да четат ключовете и удостоверенията не се появяват в собствения им списък с удостоверения.

Това е същото предоставяне на права като директното споделяне на удостоверение за OpenAI и е това, което прави router-а полезен за екип. Ако не желаете това, споделете отделните удостоверения вместо това и оставете всеки да избере модел.

## Споделяне със сътрудници по workflow

Когато споделите workflow, сътрудниците могат да го отворят и изпълнят, но не могат да използват Вашите удостоверения, освен ако не споделите и тези удостоверения с тях. Това се отнася за удостоверенията в основния workflow и във всички sub-workflows, които той извиква. Споделете всяко удостоверение със същите потребители или екипи, които сте поканили към workflow-а. Sub-workflows също трябва да бъдат споделени отделно от редактора на дъщерния workflow. Вижте [Организация на workflow](./workflow-organization.md#sharing-workflows).

## Контекст на изпълнение

Когато даден workflow се изпълни, удостоверенията се разрешават за **собственика на workflow-а** (или текущия потребител при изпълнение). `get_credentials_context()` обединява:

1. **Собствени удостоверения** – `Credential.owner_id == user_id`
2. **Споделени с потребител удостоверения** – `CredentialShare`, където `CredentialShare.user_id == user_id`
3. **Споделени с екип удостоверения** – `CredentialTeamShare`, където потребителят е член на екипа

Всички се обединяват в един контекстен dict, ключован по име на удостоверение.

## Използване във workflows
### По име (Expression DSL)

Удостоверенията са достъпни като `$credentials.CredentialName` в [Expression DSL](./expression-dsl.md). Използвайте това за:

- HTTP nodes (Bearer/Header auth)
- Telegram nodes
- Slack nodes
- Notion bearer tokens в персонализирани HTTP заявки (вътрешен token или OAuth access token)
- Всеки node, който приема изрази за автентикация

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### По ID (credentialId)

Някои nodes съхраняват `credentialId` (UUID) в `node.data`:

| Тип node | Поле | Описание |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM API удостоверение |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Удостоверение за Codex access token и GitHub удостоверение |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Удостоверение за OpenCode Go gateway и GitHub удостоверение |
| [Jira](../nodes/jira-node.md) | `credentialId` | Удостоверение за Jira Cloud email/API token или Data Center username/password |
| [Notion](../nodes/notion-node.md) | `credentialId` | Удостоверение за Notion вътрешен token или OAuth workspace |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry auth token и опционален base URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL на Supabase проект и API key |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Детайли за връзка с ClickHouse (host, port, auth, database) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Удостоверение за Telegram bot |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Удостоверение за Discord public key или webhook |
| Vector Store | `credential_id` | Qdrant или Postgres (pgvector) векторна база данни, чрез Qdrant, Psql или Custom Embeddings RAG удостоверение |
| Evals | `credential_id`, `judge_credential_id` | Удостоверение за модел; удостоверение за модел или Decision Model за LLM-as-Judge съдията |
| [Playwright](../nodes/playwright-node.md) AI стъпка | `credentialId` | LLM/Vision модел (за AI стъпка и [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Изпълнителят зарежда удостоверението директно от базата данни по ID и декриптира конфигурацията.

## Маскиране на изхода

След изпълнение, `mask_sensitive_output()` маскира стойностите на удостоверенията в изходите, запазвайки първите седем символа от всяка тайна, по-дълга от седем символа, и заменяйки останалите с `**`, така че тайните да не се разкриват в резултати или трасета.

## Свързани

- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и споделяне на удостоверения
- [Third-Party Integrations](./integrations.md) – Подробна настройка за всеки тип удостоверение
- [Teams](./teams.md) – Споделяне с екипи
- [Expression DSL](./expression-dsl.md) – Синтаксис `$credentials`
- [Node Types](./node-types.md) – Nodes, които използват удостоверения ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Използва `credentialId` за LLM

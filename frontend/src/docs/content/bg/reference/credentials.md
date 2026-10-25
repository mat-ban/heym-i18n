# Удостоверения

Удостоверенията съхраняват API ключове и тайни, използвани от nodes на Workflow. Добавяте ги в [Раздела с удостоверения](../tabs/credentials-tab.md) и ги реферирате по име в конфигурацията на node.

## Какво представляват удостоверенията

- **Съхраняват се за всеки потребител** – Всяко удостоверение принадлежи на потребител и може да бъде [споделено](./credentials-sharing.md) с други потребители или [Екипи](./teams.md).
- **Криптирани при съхранение** – Чувствителните стойности са криптирани; UI ги маскира след създаване.
- **Реферират се по име** – Nodes избират удостоверение по име (или ID). Изпълнителният engine разрешава удостоверението за собственика на Workflow по време на изпълнение.

## Как nodes ги използват

| Тип node | Типично удостоверение | Предназначение |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Оценяване](../tabs/evals-tab.md) | OpenAI, Google, Custom | API ключ за модела |
| [Decision](../nodes/decision-node.md), [Оценяване](../tabs/evals-tab.md) judge | Decision Model | Base URL на endpoint за decision model, плюс опционален API ключ |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Избира кой от Вашите модели обслужва всяка заявка, използвайки decision model |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Вход с ChatGPT абонамент (OAuth) или Codex access token за runner-а, плюс GitHub PAT за операции с repository |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | API ключ за OpenCode Go gateway (опционален base URL) за runner-а, плюс GitHub PAT за операции с repository |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) за GitHub API заявки, операции на GitHub node и MCP интеграции |
| [Jira](../nodes/jira-node.md) | Jira | Cloud email/API token, Data Center потребителско име/парола или personal access token, base URL на Jira сайт, режим на внедряване и опционална REST API версия |
| [Linear](../nodes/linear-node.md) | Linear | Personal API ключ или OAuth2 за екипи, проекти, issues и коментари |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Удостоверяване за заявки |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Bot token и опционална webhook тайна |
| [Discord](../nodes/discord-node.md) | Discord | Incoming webhook URL |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Публичен ключ на приложението за проверка на подпис |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Връзка към векторно хранилище (външен Qdrant или собствения Postgres на Heym чрез pgvector), с OpenAI или всеки OpenAI-съвместим embedding endpoint |
| [Slack](../nodes/slack-node.md) | Slack | Webhook или API token |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Връзка към входяща пощенска кутия |
| [Send Email](../nodes/send-email-node.md) | SMTP | Пощенски сървър |
| [Redis](../nodes/redis-node.md) | Redis | Връзка |
| [Grist](../nodes/grist-node.md) | Grist | API ключ + URL на сървъра |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + OAuth2 съгласие |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + OAuth2 съгласие |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + OAuth2 съгласие |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL на проекта + API ключ (+ опционална схема по подразбиране) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + потребителско име/парола + база данни (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Internal integration token или публична интеграция с Client ID + Client Secret + OAuth съгласие |
| [Sentry](../nodes/sentry-node.md) | Sentry | Auth token плюс опционален self-hosted base URL |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Access key, secret key, регион |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | AMQP URL |

За подробна настройка (hosts, ports, полета, специфични за доставчика), вижте [Интеграции с трети страни](./integrations.md). Това включва настройка на Telegram bot, входяща поща чрез IMAP и изходяща поща чрез SMTP.

GitHub удостоверенията могат също да включват опционален `base_url`, когато се насочвате към GitHub
Enterprise Server вместо GitHub.com. Когато редактирате GitHub удостоверение, за да смените token-а,
оставянето на `base_url` празно запазва съществуващия Enterprise endpoint. Въведете нов URL само когато
искате да промените този endpoint.

Jira, Linear, Supabase, Notion, Sentry и ClickHouse удостоверенията предоставят **Test Connection** в диалога за удостоверение. За Jira, проверката извиква текущия потребителски endpoint на Jira. За Linear,
проверката извиква Linear API с `getViewer` и потвърждава, че API ключът или OAuth token-ът е валиден.
При редактиране можете да тествате без да въвеждате отново API ключа, ако съхранената тайна все още е налична. За Notion,
изберете **Internal token** или **OAuth** в диалога; OAuth използва Client ID и Client Secret
от Вашата публична интеграция с Notion. Вижте [Интеграции с трети страни](./integrations.md#notion) за
подробности относно настройката на Notion.
## Използване на coding-package

Разделът **AI Defaults** в [Settings](./user-settings.md) показва оставащото използване на coding-package за Вашите Codex удостоверения (собствени и споделени). За всяко Codex удостоверение се визуализира хоризонтална лента за всеки активен rate-limit прозорец — обикновено прозорец от **5 часа** и/или **Седмичен**, в зависимост от Вашия план — с процента оставаща квота и обратно отброяване до нулиране. Данните идват от rate-limit response headers на Codex backend и се извличат при поискване.

Удостоверенията OpenCode Go също са изброени там, но са отбелязани като **"usage unavailable"**: OpenCode zen gateway не предоставя данни за оставаща квота, затова не може да се покаже лента.

## В изрази

Някои възли позволяват изрази за автентикация. Използвайте [Expression DSL](./expression-dsl.md) с `$credentials.CredentialName`, за да реферирате разрешения secret на удостоверение в израз. За header реда, който всеки тип удостоверение изисква в HTTP заявка, вижте [HTTP › Автентикация с удостоверения](../nodes/http-node.md#authenticating-with-credentials).

Codex удостоверенията са умишлено изключени от `$credentials`. Независимо дали влизате с ChatGPT (абонамент, без разход на API за token) или поставяте Codex `access_token`, token-ите се предават само на локалния процес на Codex runner. Token-ите за вход с ChatGPT се обновяват автоматично при изтичане.

Jira удостоверенията също са изключени от `$credentials`. [Jira node](../nodes/jira-node.md) зарежда удостоверението чрез `credentialId` по време на изпълнение. За персонализирани Jira REST заявки, които не се покриват от Jira node, използвайте [HTTP node](../nodes/http-node.md) с Jira Basic Auth (`email:api_token` за Jira Cloud или `username:password` за Data Center / Server), например `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Може да използвате и [Header](../nodes/http-node.md) удостоверение с `Authorization: Basic <base64(user:secret)>`. За Jira Data Center / Server personal access token-и изпратете вместо това `Authorization: Bearer <token>`; самото Jira удостоверение поддържа това чрез своя режим на удостоверяване **Personal Access Token**.

| Тип удостоверение | Стойност, предоставена на `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Низ на Bearer token |
| Header | Пълен ред `header key: header value`, готов за поставяне в cURL `-H` аргумент |
| GitHub | Personal access token |
| Notion | Вътрешен `api_token` или OAuth `access_token` (Bearer token за Notion API заявки) |
| Sentry | Sentry auth token |
| Discord / Slack | Webhook URL |

Пример:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Използвайте Notion **node** за нативни операции с бази данни, страници и блокове. Използвайте `$credentials`, когато персонализирана [HTTP](../nodes/http-node.md) заявка се нуждае от същия Notion bearer token.

## Създаване на удостоверения от Chat

[AI Assistant](./ai-assistant.md#credentials), [Chat tab](../tabs/chat-tab.md) и [Chat with Heym](./chat-with-heym.md) могат да създадат удостоверение, когато workflow се нуждае от такова, или когато поискате. Асистентът предлага типа и име, а стандартният формуляр за удостоверение се отваря в разговора. Поискайте да актуализирате удостоверение, което притежавате, и същият формуляр се отваря върху него, с маскирани secret-и. Асистентът вижда само името и типа. `heym_chat` през [MCP](../tabs/mcp-tab.md) не може да създава, актуализира или избира удостоверения.

## Свързани

- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне, редактиране, изтриване на удостоверения
- [GitHub Node](../nodes/github-node.md) – Нативни GitHub REST операции
- [Jira Node](../nodes/jira-node.md) – Автоматизация на Jira проекти, issues, коментари, прикачени файлове, потребители, известия и преходи
- [Linear Node](../nodes/linear-node.md) – Автоматизация на Linear GraphQL workspace и issues
- [Notion Node](../nodes/notion-node.md) – Търсене и управление на Notion съдържание
- [Sentry Node](../nodes/sentry-node.md) – Автоматизация на Sentry организации, проекти, екипи, issues, събития и releases
- [Credentials Sharing](./credentials-sharing.md) – Споделяне с потребители и екипи
- [Third-Party Integrations](./integrations.md) – Ръководство за настройка по тип удостоверение
- [Expression DSL](./expression-dsl.md) – `$credentials` в изрази

## Model Router (Auto Model)

Model Router не съдържа key. Той съдържа **decision model credential**, списък с **model options** — всяка от тях съществуващо OpenAI, Google или Custom удостоверение плюс модел — и за всяка опция свободен текст, указващ кога тази опция трябва да се използва.

Появява се във всеки picker, който предлага модел: [LLM](../nodes/llm-node.md) и [Agent](../nodes/agent-node.md) възлите, Chat, AI Defaults, Dashboards, expression builder-а и Data Tables. Единственият му модел е **Auto**. Изберете го и decision model-ът прочита всяка заявка и я маршрутизира. [Evals](../tabs/evals-tab.md) го изключва, защото eval сравнява конкретни модели, а router-ът избира сам.

Agent премаршрутизира с напредването на своя tool loop, така че евтин модел може да поеме ранните стъпки, а по-мощен — стъпката, която се нуждае от него. Идентичните входни данни използват повторно предишното решение, така че loop плаща за решение само когато разговорът действително е напреднал.

### Какво не може да прави

Auto Model не може да се комбинира с **Responses API**, **Batch mode** или **image output**. Тези превключватели се деактивират сами, когато е избран router, и всеки посочва причината. Guardrail проверките и класификаторът на политиката за човешка проверка са фиксирани single-model заявки и никога не се маршрутизират.
### Когато маршрутизирането се провали

Маркирайте една опция **Използване на тази опция при неуспешно маршрутизиране** и прекъсване на модела за вземане на решения никога няма да спре изпълнение; използва се резервният вариант и причината се записва в изпълнението. Без такава опция node-ът се проваля, вместо да предполага.

### Проследяване накъде е отишла заявката

Изпълненията показват `Auto Model / GPT-5`, а не само модела, и разходите остават приписани на модела, който действително е работил. Execution Log и Span View на работната площ показват същата двойка, а Span View изброява кой turn къде е отишъл.

# Интеграции с трети страни

Heym се свързва с външни услуги чрез **удостоверения**. Всеки тип удостоверение съхранява данните за връзка с една услуга и може да бъде използвано повторно в множество nodes и workflows. Вижте [Удостоверения](./credentials.md) за общ преглед.

Добавяйте удостоверения в [Settings → Credentials](../tabs/credentials-tab.md). Всички стойности са криптирани при съхранение. Удостоверенията могат да бъдат [споделяни](./credentials-sharing.md) с други потребители или [Teams](./teams.md).

Някои integration nodes **не** изискват удостоверения. [WebSocket Trigger](../nodes/websocket-trigger-node.md) и [WebSocket Send](../nodes/websocket-send-node.md) се свързват с външни sockets, използвайки URL, headers и subprotocols, конфигурирани директно на node.

## Типове удостоверения накратко

| Тип | Използва се от | Ключови полета |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, незадължително `base_url` |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, незадължително `base_url` |
| **Jira** | [Jira node](../nodes/jira-node.md) | `email`, `api_token`, `base_url`, `deployment`, незадължително `api_version` |
| **Linear** | [Linear node](../nodes/linear-node.md) | `api_key`, или `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Sentry node](../nodes/sentry-node.md) | `api_token`, незадължително `base_url` |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Evals](../tabs/evals-tab.md) (LLM-as-Judge judge) | `base_url`, незадължително `api_key` |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | удостоверение за decision model, плюс опции за модели, рефериращи Вашите други удостоверения |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (векторите се съхраняват в собствения Postgres на Heym чрез pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, незадължително `embedding_api_key`, плюс `qdrant_host`, когато `db_type` е `qdrant` |
| **Grist** | [Grist node](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Google Sheets node](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + OAuth2 consent |
| **Google Drive** | [Google Drive node](../nodes/google-drive-node.md) | `client_id`, `client_secret` + OAuth2 consent (пълен Drive scope) |
| **BigQuery** | [BigQuery node](../nodes/bigquery-node.md) | `client_id`, `client_secret` + OAuth2 consent |
| **Supabase** | [Supabase node](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, незадължително `supabase_schema` |
| **ClickHouse** | [ClickHouse node](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Notion node](../nodes/notion-node.md) | `api_token`, или `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Amazon S3 node](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [IMAP Trigger node](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Telegram Trigger node](../nodes/telegram-trigger-node.md), [Telegram node](../nodes/telegram-node.md) | `bot_token`, незадължително `secret_token` |
| **Discord** | [Discord node](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Discord Trigger node](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [RabbitMQ node](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Redis node](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Slack node](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Slack Trigger node](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [HTTP node](../nodes/http-node.md) | `token` |
| **Header** | [HTTP node](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Crawler node](../nodes/crawler-node.md) | `flaresolverr_url` |

---

## GitHub

Удостоверението GitHub съхранява GitHub personal access token (PAT), така че workflows да могат да извикват GitHub REST API чрез [GitHub node](../nodes/github-node.md), да подават token към MCP сървъри като `@modelcontextprotocol/server-github` или да го използват от [HTTP node](../nodes/http-node.md) за персонализирани REST заявки.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `api_key` | GitHub personal access token (`github_pat_...` fine-grained PAT или класически `ghp_...` PAT) |
### Незадължителни полета

| Поле | Описание |
|-------|-------------|
| `base_url` | Базов URL на GitHub API за GitHub Enterprise Server (например `https://github.example.com/api/v3`) |

### Бележки

- Препоръчва се използването на фино гранулирани personal access tokens, когато е възможно, тъй като те могат да бъдат ограничени до конкретни хранилища и разрешения.
- Оставете `base_url` празно за GitHub.com. За GitHub Enterprise Server използвайте пълния REST API
  endpoint, включително `/api/v3` (например `https://github.example.com/api/v3`), а не
  корена на уеб интерфейса на сървъра, като например `https://github.example.com`.
- Тази credential в момента моделира само PAT-базирана автентикация. За достъп до хранилища на организация използвайте PAT, на който са предоставени необходимите разрешения за организацията/хранилището.
- Installation tokens на GitHub App и setup потоците на GitHub App не са first-class в интерфейса на Heym към момента.
- Предпочитайте [GitHub node](../nodes/github-node.md) за нативни операции с хранилища, потребители, issues, pull requests, review-та, release-и, Actions workflow-и, трафик и файлове. Използвайте [HTTP node](../nodes/http-node.md) само когато имате нужда от endpoint-и или payload-и, които GitHub node не покрива.
- Използвайте [Agent node](../nodes/agent-node.md) с MCP, като подадете `$credentials.YourGitHubCredential` в environment променлива на MCP връзка, като например `GITHUB_PERSONAL_ACCESS_TOKEN`.
- REST API на GitHub обикновено очаква `Authorization: Bearer <token>` плюс `Accept: application/vnd.github+json`.
- При редактиране на GitHub credential оставянето на `base_url` за GitHub Enterprise празно запазва
  съществуващия endpoint. Въведете нов URL само когато искате да промените този endpoint.

### Използва се от

- [GitHub node](../nodes/github-node.md)
- [Codex node](../nodes/codex-node.md)
- [Agent node](../nodes/agent-node.md)
- [HTTP node](../nodes/http-node.md)

---

## Decision Model

Decision model отговаря на типизирани въпроси за дадено състояние и връща вероятности вместо текст. Jev на TypeSafe е референтната имплементация; всеки endpoint, който приема същото тяло `{model, state, questions}`, работи, а [Decision](../nodes/decision-node.md) node може да изпрати ръчно написан body за такъв, който не го прави.

### Задължителни полета

- `base_url` – endpoint-ът, например `https://api.typesafe.ai`. Heym добавя `/v1/systemone`.

### Незадължителни полета

- `api_key` – изпраща се като `Authorization: Bearer`. Endpoint-и, които не се нуждаят от ключ, могат да оставят това поле празно.

### Бележки

- **Test Connection** изпраща един малък въпрос, за да потвърди, че endpoint-ът и ключът работят.
- Редактирането на credential запазва съхранения ключ, когато полето за ключ е оставено празно.
- Изходящите заявки към частни и loopback адреси са блокирани по подразбиране, така че self-hosted endpoint на `localhost` или в частен диапазон се нуждае от `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Тези модели отсъстват от таблиците за ценообразуване на LLM, които Heym синхронизира, така че колоната Cost в [Traces](../tabs/traces-tab.md) остава празна. Броят на token-ите все още се записва.

### Използва се от

- [Decision](../nodes/decision-node.md)
- [Evals](../tabs/evals-tab.md) – оценява отговорите на `LLM-as-Judge` спрямо очаквания изход

## OpenAI Codex

Credential-ът OpenAI Codex автентикира [Codex node](../nodes/codex-node.md). Той е отделен от credential-а за OpenAI API key, използван от LLM, Agent и RAG node-ове.

### Режими на автентикация

| Режим | Описание |
|------|-------------|
| **Sign in with ChatGPT** (препоръчително) | OAuth (PKCE) вход, който използва Вашия ChatGPT Plus/Pro абонамент, така че изпълненията избягват разходи за API на база token. Heym съхранява и автоматично опреснява token bundle-а. |
| **Access token** | ChatGPT/Codex `access_token`, подаван само към локалния процес на Codex CLI. |

### Бележки

- API ключове се отхвърлят за този тип credential.
- Codex token-ите не се expose-ват чрез `$credentials.Name`.
- Codex node също се нуждае от GitHub credential за клониране на хранилище, push на branch и създаване на draft PR.

### Използва се от

- [Codex node](../nodes/codex-node.md)

## OpenCode Go

Credential-ът OpenCode Go автентикира [OpenCode Go node](../nodes/opencode-go-node.md). Той съхранява API ключ за gateway-а OpenCode Go (от [opencode.ai/go](https://opencode.ai/go)) и незадължителен базов URL на gateway-а.

### Полета

| Поле | Описание |
|-------|-------------|
| **API Key** | API ключ за gateway-а OpenCode Go (задължително). |
| **Gateway Base URL** | Незадължително; по подразбиране е `https://opencode.ai/zen/go/v1`. Заменете само за self-hosted или проксиран gateway. |

### Бележки

- API ключът се подава само към процеса на OpenCode CLI вътре в hardened контейнер.
- OpenCode Go node също се нуждае от GitHub credential за клониране на хранилище, push на branch и създаване на pull request. GitHub token-ът никога не се поставя вътре в sandbox контейнера.

### Използва се от

- [OpenCode Go node](../nodes/opencode-go-node.md)

---

## Linear

Credential-ът Linear поддържа или personal API key, или OAuth2 за
[Linear node](../nodes/linear-node.md). Heym изпраща нативни GraphQL заявки към Linear за метаданни на workspace,
проекти, issues и коментари.
### Настройка

Изберете един режим на удостоверяване:

**Personal API key**

1. В Linear отворете **Settings → Security & Access → Personal API keys**.
2. Създайте ключ с достъп до workspace, който искате да автоматизирате.
3. Поставете ключа в Linear удостоверение в Heym и използвайте **Test Connection**, за да го проверите.

**OAuth2**

1. Създайте Linear OAuth приложение.
2. Регистрирайте `{FRONTEND_URL}/api/credentials/linear/oauth/callback` като redirect URI.
3. В Heym Dashboard → **Удостоверения** → **New** → тип **Linear**.
4. Изберете **OAuth2**, въведете Client ID и Client Secret, след което натиснете **Connect**.

### Задължителни полета

| Режим | Поле | Описание |
|------|-------|-------------|
| Personal API key | `api_key` | Linear personal API key, обикновено с префикс `lin_api_` |
| OAuth2 | `client_id` | Client ID от Linear OAuth приложението |
| OAuth2 | `client_secret` | Client Secret от Linear OAuth приложението |

OAuth tokens (`access_token`, `refresh_token`, `token_expiry`) се съхраняват и обновяват автоматично.

### Бележки

- Personal API keys и OAuth tokens действат от името на Linear потребителя, който ги е създал или оторизирал.
- Linear OAuth използва scopes `read,write,issues:create,comments:create`.
- Използвайте **Test Connection** в диалога за удостоверение, за да проверите API key или OAuth token срещу Linear API.
- Използвайте List Teams и List Projects в Linear node, за да откриете UUIDs преди създаване или филтриране на issues.
- Използвайте List Workflow States и List Team Members, за да откриете state и assignee UUIDs за актуализации.
- Ротирайте API key, като редактирате удостоверението и въведете новата стойност. Ако ротирате OAuth app secrets, свържете отново удостоверението чрез **Connect**.

### Използва се от

- [Linear node](../nodes/linear-node.md)

---

## Jira

Jira удостоверението съхранява Jira Basic auth credentials, Jira site base URL, deployment mode и опционална REST API версия за [Jira node](../nodes/jira-node.md). Използвайте `cloud` за Jira Cloud или `data_center` за Jira Data Center / Server.

### Настройка

**Jira Cloud**

1. В настройките на Atlassian акаунта създайте API token.
2. В Heym Dashboard → **Удостоверения** → **New** → тип **Jira**.
3. Въведете Atlassian email, API token и Jira site URL, например `https://your-domain.atlassian.net`.
4. Използвайте **Test Connection**, за да проверите удостоверението.

**Jira Data Center / Server**

1. Изберете **Jira Data Center / Server** като deployment.
2. Въведете Jira username и password, използвани за Basic auth.
3. Въведете Jira site URL, например `https://jira.example.com`.
4. Използвайте **Test Connection**, за да проверите удостоверението.

### Полета

| Поле | Описание |
| --- | --- |
| `email` | Jira Cloud Atlassian account email или Jira Data Center / Server username |
| `api_token` | Jira Cloud Atlassian API token или Jira Data Center / Server password за Basic auth |
| `base_url` | Jira site base URL |
| `deployment` | `cloud` за Jira Cloud или `data_center` за Jira Data Center / Server |
| `api_version` | REST API версия; по подразбиране `3` за Jira Cloud. Data Center / Server използва v2 |

### Бележки

- Jira node изпраща issue descriptions и comments като Atlassian Document Format текстови
  документи за Jira Cloud REST API v3. Data Center / Server удостоверенията изпращат plain text.
- Data Center / Server в момента поддържа само username/password Basic auth. Personal access
  tokens и Bearer auth все още не се поддържат.
- Attachment upload приема base64 или data URL съдържание и е предмет на лимита за размер на файл в платформата (по подразбиране 99 MB). Attachment download може да върне base64 съдържание, когато е разрешено.
- Създаването, изтриването на потребители и issue notification изискват автентикираният Jira акаунт да има съответните Jira site или organization permissions.
- Използвайте List Projects, Search Issues и List Transitions, за да откриете project keys, issue keys и transition IDs.
- За custom endpoints, които не се покриват от Jira node, използвайте [HTTP node](../nodes/http-node.md) с Jira Basic Auth (`email:api_token` за Cloud или `username:password` за Data Center / Server) в cURL командата, или Header удостоверение със съответстващата `Authorization: Basic <base64(user:secret)>` стойност.

Вижте също:

- [Jira node](../nodes/jira-node.md)
- [Удостоверения](./credentials.md)

---

## Sentry

Sentry удостоверението съхранява auth token за [Sentry node](../nodes/sentry-node.md). Heym използва Sentry's REST API за операции с organization, project, team, issue, event и release.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `api_token` | Sentry auth token с достъп до organizations и projects, които автоматизирате |

### Опционални полета

| Поле | Описание |
|-------|-------------|
| `base_url` | Опционален root URL за self-hosted Sentry, например `https://sentry.example.com` |

### Бележки

- Оставете `base_url` празно за Sentry SaaS.
- Използвайте **Test Connection**, за да потвърдите, че token може да изброи видимите organizations.
- За custom REST заявки използвайте `$credentials.YourSentryCredential` като bearer token.

### Използва се от

- [Sentry node](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) е open-source векторна база данни, използвана за семантично търсене и RAG (Retrieval Augmented Generation).

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `qdrant_host` | Пълен URL към вашия Qdrant instance (напр. `http://localhost:6333` или cloud endpoint) |
| `openai_api_key` | OpenAI API key, използван за генериране на embeddings при индексиране и търсене на документи |
### Бележки

- Qdrant колекциите се управляват от раздела [Векторни хранилища](../tabs/vectorstores-tab.md). Всяко векторно хранилище съответства на Qdrant колекция.
- [RAG node](../nodes/rag-node.md) използва векторно хранилище (което реферира Qdrant удостоверение) — той не реферира удостоверението директно.
- Ако Вашата Qdrant инстанция изисква API key, включете го в стойността на `qdrant_host` или конфигурирайте Qdrant съответно; текущата интеграция не разполага с отделно поле за Qdrant API key.
- Self-hosted Qdrant: използвайте [официалния Docker образ](https://hub.docker.com/r/qdrant/qdrant) и експонирайте порт `6333`.

### Използва се от

- [RAG node](../nodes/rag-node.md) (чрез векторно хранилище)
- [Раздел Векторни хранилища](../tabs/vectorstores-tab.md)

## Custom Embeddings (RAG)

По подразбиране RAG embeddings идват от OpenAI. Удостоверение **RAG: Custom Embeddings**
сочи към всеки OpenAI-съвместим embeddings endpoint вместо това — Ollama, vLLM, Text
Embeddings Inference, LM Studio, Together или hosted gateway — и посочва векторното
хранилище, в което записва.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `embedding_base_url` | Endpoint URL, включително пътя `/v1`, напр. `http://localhost:11434/v1` |
| `embedding_api_key` | Незадължително. Локалните сървъри обикновено не изискват key |
| `embedding_model` | Име на модела, както endpoint-ът го очаква, напр. `nomic-embed-text` |
| `embedding_dimensions` | Ширина на вектора, която моделът връща (по подразбиране `1536`) |
| `embedding_request_dimensions` | Незадължително. Изисква от endpoint-а да върне `embedding_dimensions` вместо нативната ширина на модела |
| `db_type` | `qdrant` или `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Qdrant връзка, задължителна когато `db_type` е `qdrant` |

### Бележки

- **Qdrant приема произволен брой измерения.** Всяка колекция се създава с ширината, която
  това удостоверение декларира, така че полето Dimensions е свободно редактируемо.
- **Postgres (pgvector) изисква точно 1536 измерения.** Неговата колона е фиксирана
  `vector(1536)`, така че полето Dimensions е фиксирано на 1536 и удостоверение, деклариращо
  друга ширина, се отхвърля при запис.
- **Скъсяване за pgvector.** Когато хранилището е Postgres, диалоговият прозорец предлага *Ask the
  endpoint to return 1536 dimensions*. Това изпраща параметъра на заявката `dimensions`,
  който модели, обучени с Matryoshka представяния (OpenAI `text-embedding-3-*`,
  `nomic-embed-text-v1.5`, `jina-v3` и подобни), спазват, като връщат скъсен,
  все още смислен вектор. Endpoints, които не поддържат параметъра, отхвърлят
  заявката, а endpoints, които го приемат, но го игнорират, произвеждат ясна грешка, посочваща
  ширината, която действително е върната. Heym никога не съкращава вектори сам, защото нарязването
  на изхода на non-Matryoshka модел влошава качеството на търсене безшумно. Опцията не се
  предлага за Qdrant, който може да оразмери колекция до произволна ширина.
- Използвайте **Test Connection** в диалоговия прозорец за удостоверение, за да embed-нете пробен низ и да видите
  ширината, която моделът действително връща, преди да създадете хранилище.
- Параметърът на заявката `dimensions` се изпраща само до самия OpenAI, тъй като повечето
  OpenAI-съвместими сървъри отхвърлят непознати параметри. Нативната ширина на модела се
  валидира спрямо удостоверението вместо това.
- Съществуващите удостоверения **RAG: Qdrant + OpenAI** и **RAG: Psql + OpenAI** са
  непроменени и продължават да работят.

### Използва се от

- [RAG node](../nodes/rag-node.md) (чрез векторно хранилище)
- [Раздел Векторни хранилища](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym може също да съхранява вектори **в собствената си Postgres база данни**, използвайки
разширението [pgvector](https://github.com/pgvector/pgvector) — не е необходима външна векторна услуга.
Създайте удостоверение **RAG: Psql + OpenAI** и го използвайте при създаване на векторно
хранилище, след което изберете **Postgres (pgvector)** в падащото меню Database на RAG node.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `openai_api_key` | OpenAI API key, използван за генериране на embeddings при индексиране и търсене на документи |

### Бележки

- Не е необходим host/port — векторите се записват в собствената база данни на Heym; Heym никога не се свързва с друга база данни.
- Всяка RAG функционалност, налична с Qdrant (вмъкване, търсене, филтри по метаданни, Cohere reranking, клониране, споделяне), работи идентично с Postgres backend.
- Изисква разширението `vector`. Heym поддържа официалния `postgres:16` образ непроменен (така че съществуващите данни никога не се докосват) и **автоматично инсталира пакета `postgresql-16-pgvector` при стартиране** — `run.sh`, `deploy.sh` и `run_e2e.sh` всички се справят с това. Инсталацията е non-fatal: ако не може да се изпълни (напр. няма мрежа), Qdrant RAG продължава да работи и Postgres backend остава неактивен (миграцията пропуска таблицата коректно).
- Ако стартирате публикувания single-container образ (`ghcr.io/heymrun/heym`) срещу **Ваш собствен външен Postgres**, тази база данни трябва да поддържа разширението `vector` (Heym не може да го инсталира в база данни, която не управлява). Без него създаването или качването в Postgres векторно хранилище връща ясно съобщение и Qdrant RAG продължава да работи.

### Използва се от

- [RAG node](../nodes/rag-node.md) (чрез векторно хранилище)
- [Раздел Векторни хранилища](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) е хибрид между spreadsheet и база данни, който поддържа структурирани данни и формули. Удостоверението Grist позволява на Heym да чете и записва Grist документи.
### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `api_key` | Grist API key (намира се в **Profile → API Key** във Вашата Grist инстанция) |
| `server_url` | Базов URL на Вашия Grist сървър (напр. `https://docs.getgrist.com` за Grist Cloud или URL на Вашата self-hosted инсталация) |

### Бележки

- [Grist node](../nodes/grist-node.md) изисква **Document ID** (от URL адреса на Grist документа) и **Table ID** в конфигурацията си — те не са част от удостоверението.
- За self-hosted Grist задайте `server_url` на домейна на Вашата инстанция.
- Column IDs в Grist използват долни черти (напр. `User_Name`), а не display labels. Използвайте операцията `listColumns`, за да ги откриете.

### Използва се от

- [Grist node](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

Удостоверението Google Sheets свързва Heym с Google Sheets API чрез OAuth2 модел „Bring Your Own App“. Вие предоставяте Google Cloud OAuth2 Client ID и Client Secret, след което оторизирате достъпа чрез браузърен popup. Token-ите се обновяват автоматично на заден план.

### Настройка

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → потърсете и активирайте **Google Sheets API**.
2. Отидете на **Credentials** → **Create Credentials** → **OAuth client ID** → тип на приложението **Web application**.
3. Под **Authorized redirect URIs** добавете: `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Копирайте генерираните **Client ID** и **Client Secret**.
5. В Heym Dashboard → **Credentials** → **New** → тип **Google Sheets (OAuth2)**.
6. Въведете Client ID, Client Secret и име, след което натиснете **Connect**, за да отворите Google consent popup и да оторизирате достъпа.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `client_id` | OAuth2 Client ID от Google Cloud Console |
| `client_secret` | OAuth2 Client Secret от Google Cloud Console |

Token-ите (`access_token`, `refresh_token`, `token_expiry`) се съхраняват и обновяват автоматично — не е необходимо да ги управлявате директно.

### Бележки

- OAuth2 consent екранът изисква spreadsheets scope (`https://www.googleapis.com/auth/spreadsheets`).
- Heym използва refresh token, за да получи нови access token-и преди изтичането им (60-секунден предпазен буфер).
- Ако смените Client Secret в Google Cloud Console, свържете отново удостоверението чрез бутона **Connect**.
- **Production:** Задайте backend **`FRONTEND_URL`** на точния публичен URL, който потребителите отварят в браузъра (scheme + host, напр. `https://heym.example.com`). Heym изгражда Google OAuth redirect URI само от тази стойност — той **не** се доверява на `Origin` или `X-Forwarded-*` хедъри (контролирани от клиента). Регистрирайте `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` в Google Cloud Console.

### Използва се от

- [Google Sheets node](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

Удостоверението Google Drive свързва Heym с Google Drive API чрез същия OAuth2 модел „Bring Your Own App“, както при Google Sheets. Вие предоставяте Google Cloud OAuth2 Client ID и Client Secret, след което оторизирате достъпа чрез браузърен popup. Token-ите се обновяват автоматично на заден план.

### Настройка

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → потърсете и активирайте **Google Drive API**.
2. Отидете на **Credentials** → **Create Credentials** → **OAuth client ID** → тип на приложението **Web application**.
3. Под **Authorized redirect URIs** добавете: `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Копирайте генерираните **Client ID** и **Client Secret**.
5. В Heym Dashboard → **Credentials** → **New** → тип **Google Drive (OAuth2)**.
6. Въведете Client ID, Client Secret и име, след което натиснете **Connect**, за да отворите Google consent popup и да оторизирате достъпа.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `client_id` | OAuth2 Client ID от Google Cloud Console |
| `client_secret` | OAuth2 Client Secret от Google Cloud Console |

Token-ите (`access_token`, `refresh_token`, `token_expiry`) се съхраняват и обновяват автоматично — не е необходимо да ги управлявате директно.

### Scope

Google Drive изисква **пълния Drive scope** (`https://www.googleapis.com/auth/drive`).

Това е необходимо, тъй като node-ът работи с файлове, които вече притежавате. По-тесният `drive.file` scope предоставя достъп само до файлове, създадени от самия OAuth клиент, което би довело до това `listFolderFiles`, `updateFile`, `removeFile` и `removeFolder` да не виждат нищо от съществуващия Ви Drive.

Тъй като предоставяте собствен Client ID и Secret от собствения си Google Cloud проект, изискванията за верификация на Google приложението за този scope се отнасят за Вашия проект, а не за Heym.

### Бележки

- Heym използва refresh token, за да получи нови access token-и преди изтичането им (60-секунден предпазен буфер).
- Ако смените Client Secret в Google Cloud Console, свържете отново удостоверението чрез бутона **Connect**.
- Shared drives се поддържат — node-ът задава `supportsAllDrives` при всяко API извикване.
- **Production:** Задайте backend **`FRONTEND_URL`** на точния публичен URL, който потребителите отварят в браузъра. Heym изгражда Google OAuth redirect URI само от тази стойност — той **не** се доверява на `Origin` или `X-Forwarded-*` хедъри. Регистрирайте `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` в Google Cloud Console.
- Вижте [Credential Sharing](./credentials-sharing.md), преди да споделите това удостоверение с екип.

### Използва се от

- [Google Drive node](../nodes/google-drive-node.md)

---
## BigQuery (OAuth2)

Удостоверението BigQuery свързва Heym с Google BigQuery API чрез OAuth2 модел „Bring Your Own App“. Вие предоставяте Google Cloud OAuth2 Client ID и Client Secret, след което оторизирате достъпа чрез браузърен popup. Token-ите се обновяват автоматично на заден план.

### Настройка

1. Отворете [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → потърсете и активирайте **BigQuery API**.
2. Отидете на **Credentials** → **Create Credentials** → **OAuth client ID** → тип на приложението **Web application**.
3. Под **Authorized redirect URIs** добавете: `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Копирайте генерираните **Client ID** и **Client Secret**.
5. В Heym Dashboard → **Credentials** → **New** → тип **BigQuery (OAuth2)**.
6. Въведете Client ID, Client Secret и име, след което натиснете **Connect**, за да отворите Google consent popup и да оторизирате достъпа.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `client_id` | OAuth2 Client ID от Google Cloud Console |
| `client_secret` | OAuth2 Client Secret от Google Cloud Console |

Token-ите (`access_token`, `refresh_token`, `token_expiry`) се съхраняват и обновяват автоматично.

### Бележки

- OAuth2 consent екранът изисква BigQuery scope (`https://www.googleapis.com/auth/bigquery`).
- **Production:** Задайте backend **`FRONTEND_URL`** на публичния URL. Регистрирайте `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` в Google Cloud Console.

### Използва се от

- [BigQuery node](../nodes/bigquery-node.md)

---

## Supabase

Удостоверението Supabase свързва Heym с PostgREST API на Supabase проект, така че workflow-ите да могат да правят заявки и да променят таблици, базирани на Postgres.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `supabase_url` | Базов URL на проекта, например `https://your-project.supabase.co` |
| `supabase_key` | API ключ с достъп до целевите таблици |
| `supabase_schema` | Опционална схема по подразбиране (по подразбиране `public`) |

### Бележки

- [Supabase node](../nodes/supabase-node.md) комуникира с `/rest/v1/<table>` и поддържа операторни филтри (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` и свързани PostgREST оператори), както и вложени логически групи `or` / `and`.
- За операции за запис предпочитайте ключ, предназначен за доверена употреба от страна на сървъра, с минимално необходимите права за таблицата.
- Възлите могат да заменят схемата за всяка стъпка, дори ако удостоверението дефинира схема по подразбиране.

### Използва се от

- [Supabase node](../nodes/supabase-node.md)

## ClickHouse

Удостоверението ClickHouse свързва Heym с външна ClickHouse база данни чрез нейния HTTP интерфейс, така че workflow-ите да могат да изпълняват SQL, CRUD и операции за броене върху OLAP таблици.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `host` | HTTP host без схема, например `your-instance.clickhouse.cloud` |
| `port` | Порт на HTTP интерфейса (`8443` за HTTPS, `8123` за HTTP) |
| `username` | ClickHouse потребител (по подразбиране `default`) |
| `password` | Парола на потребителя (опционална) |
| `database` | Целева база данни (по подразбиране `default`) |
| `secure` | Използване на HTTPS, когато е `true` (задължително за ClickHouse Cloud) |

### Бележки

- [ClickHouse node](../nodes/clickhouse-node.md) използва официалния `clickhouse-connect` HTTP клиент и параметризира филтрите и обвързванията на стойности.
- `update` и `remove` съответстват на `ALTER TABLE ... UPDATE` и `DELETE FROM`, които са асинхронни ClickHouse мутации; и двете изискват филтър.
- `upsert` извършва `INSERT` и предполага таблица `ReplacingMergeTree` за поведение на сливане по ключ.
- Използвайте **Test connection** в диалога за удостоверение, за да проверите достъпността.

### Използва се от

- [ClickHouse node](../nodes/clickhouse-node.md)

## Notion

Удостоверението Notion поддържа или вътрешен integration token, или OAuth връзка за публична интеграция. OAuth позволява на всеки потребител да оторизира Notion workspace от Heym, вместо ръчно да копира token.

### Задължителни полета

| Режим | Поле | Описание |
|------|-------|-------------|
| Вътрешен token | `api_token` | Вътрешен integration token (`ntn_...`) |
| OAuth | `client_id` | Client ID от Notion публична интеграция |
| OAuth | `client_secret` | Client Secret от Notion публичната интеграция |

OAuth callback-ът съхранява `access_token`, `auth_mode`, `workspace_id`, `workspace_name` и `bot_id` автоматично. Всеки предишен вътрешен `api_token` се премахва, когато OAuth завърши. Регистрирайте този redirect URI в Notion:
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### OAuth поток на настройка

1. Изберете **OAuth** в диалога за удостоверение, въведете име, Client ID и Client Secret.
2. Натиснете **Connect** и оторизирайте workspace-а в Notion popup.
   - За **ново** удостоверение Heym създава записа на удостоверението, когато натиснете **Connect**.
   - Завършете оторизацията в popup-а, след което натиснете **Save**, за да се върнете към списъка с удостоверения.
3. Свързано удостоверение показва `connected (Workspace Name)` в списъка. Чакащите OAuth удостоверения показват `Not connected`, докато оторизацията завърши.

Използвайте **Test Connection** в диалога за удостоверение, за да проверите вътрешен token или завършена OAuth оторизация. При редактиране оставянето на полето за token празно запазва съхранения вътрешен token.

Както вътрешните token-и, така и OAuth access token-ите са достъпни чрез `$credentials.CredentialName` за персонализирани [HTTP](../nodes/http-node.md) заявки, които се нуждаят от Notion bearer token.
### Бележки

- Вътрешните интеграции изискват споделяне на съответните страници, бази данни и източници на данни.
- Потребителите на OAuth избират workspace/страниците по време на оторизацията в Notion.
- Данните за достъп на OAuth приложението се криптират вътре в Notion удостоверението. Callback-ът ги презарежда от страна на сървъра; тайната не се вгражда в OAuth state.
- Свързаните OAuth удостоверения показват името на workspace; чакащите OAuth удостоверения показват `Not connected`, докато оторизацията завърши.
- **Production:** Задайте backend **`FRONTEND_URL`** на публичния URL на браузъра (схема + хост, без завършваща наклонена черта). Notion redirect URI трябва да съвпада точно:
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Node-ът използва API версия `2026-03-11` и текущата терминология `data_source`. Вижте статията [Notion node](../nodes/notion-node.md#api-version-notes) за насоки при миграция от по-стари примери с `archived`, `after` или database-query.
- Старите филтри за търсене със стойност на обекта `database` се нормализират до `data_source`.

### Използва се от

- [Notion node](../nodes/notion-node.md)

---

## SMTP (Email)

SMTP удостоверението съхранява данните за връзка с имейл сървъра за изпращане на изходяща поща.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `host` | Име на хоста на SMTP сървъра (напр. `smtp.gmail.com`) |
| `port` | SMTP порт (обикновено `587` за STARTTLS, `465` за SSL) |
| `email` | Имейл адрес на подателя |
| `password` | SMTP парола или App Password |

### Често срещани SMTP доставчици

| Доставчик | Хост | Порт | Бележки |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Изисква [App Password](https://support.google.com/accounts/answer/185833) (2FA трябва да е активирана) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Използвайте данните за достъп на Вашия Microsoft акаунт |
| Mailgun | `smtp.mailgun.org` | `587` | Използвайте SMTP данните за достъп на Mailgun от настройките на Вашия домейн |
| SendGrid | `smtp.sendgrid.net` | `587` | Използвайте `apikey` като потребителско име и API ключ като парола |
| Custom / Self-hosted | Вашия домейн | `587` / `465` | Postfix, Exim и др. |

### Бележки

- Gmail изисква **App Password** вместо обичайната Ви парола, когато е активирана двустепенна верификация.
- Порт `587` използва STARTTLS (започва като plaintext, надгражда се до TLS). Порт `465` използва имплицитен TLS (SSL от самото начало).

### Използва се от

- [Send Email node](../nodes/send-email-node.md)

---

## IMAP (Inbound Email)

IMAP удостоверението съхранява данните за връзка за наблюдение на входяща поща с [IMAP Trigger node](../nodes/imap-trigger-node.md).

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `imap_host` | Име на хоста на IMAP сървъра (например `imap.gmail.com`) |
| `imap_port` | IMAP порт (`993` за SSL/TLS при повечето доставчици) |
| `imap_username` | Потребителско име за пощенската кутия или пълен имейл адрес |
| `imap_password` | Парола или специфична за доставчика app password |

### Опционални полета

| Поле | Описание |
|-------|-------------|
| `imap_mailbox` | Папка на пощенската кутия за наблюдение (по подразбиране: `INBOX`) |
| `imap_use_ssl` | Активиране на SSL/TLS (препоръчително; по подразбиране: `true`) |

### Бележки

- IMAP trigger-ът установява базово състояние на текущата пощенска кутия при първото запитване и след това обработва само по-нови имейли.
- Gmail, Microsoft 365 и други хоствани доставчици често изискват **app password** или подобна специфична за IMAP тайна.
- Съдържанието на прикачените файлове не се изтегля в payload-а на workflow-а; Heym предоставя само метаданни за прикачените файлове.

### Използва се от

- [IMAP Trigger node](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP като workflow trigger)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) е open-source message broker. RabbitMQ удостоверението съхранява данните за връзка за публикуване към и консумиране от опашки и exchanges.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `rabbitmq_host` | AMQP URL за връзка (напр. `amqp://localhost:5672`) |
| `rabbitmq_username` | Потребителско име за RabbitMQ (по подразбиране: `guest`) |
| `rabbitmq_password` | Парола за RabbitMQ (по подразбиране: `guest`) |

### Virtual Hosts

За да се свържете към конкретен virtual host, включете го в URL-а на `rabbitmq_host`:

```
amqp://username:password@hostname:5672/vhost
```

Ако използвате vhost по подразбиране, пътят `/` може да бъде пропуснат.

### Delayed Message Plugin

[RabbitMQ node](../nodes/rabbitmq-node.md) поддържа плъгина **rabbitmq_delayed_message_exchange**. Когато този плъгин е активиран на Вашия RabbitMQ сървър, можете да зададете закъснение (в милисекунди) за изходящите съобщения чрез полето `rabbitmqDelayMs` на node-а.

Node-ът задава хедъра `x-delay` на публикуваното съобщение. Типът на exchange-а трябва да бъде `x-delayed-message`, за да влязат в сила закъсненията.

За да активирате плъгина на self-hosted RabbitMQ инстанция:

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Когато плъгинът не е инсталиран, хедърът `x-delay` се игнорира и съобщенията се доставят незабавно.

### Използва се от

- [RabbitMQ node](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ като workflow trigger)

---

## Amazon S3

Amazon S3 удостоверението свързва Heym с [Amazon S3](https://aws.amazon.com/s3/). Използвайте го с [Amazon S3 node](../nodes/amazon-s3-node.md), за да управлявате buckets и папки, да качвате и изтегляте обекти, да копирате ключове и да изброявате или изтривате обекти от workflow-и.
### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `aws_access_key_id` | ID на AWS IAM access key |
| `aws_secret_access_key` | Secret access key, свързан с ID на access key |
| `aws_region` | AWS регион, в който се намират bucket-ите (напр. `us-east-1`) |

### Опционални полета

| Поле | Описание |
|-------|-------------|
| `aws_session_token` | Временен session token при използване на AWS STS удостоверения |

### Бележки

- Удостоверението използва стандартна AWS SigV4 автентикация чрез boto3.
- Операциите по качване в момента изпращат UTF-8 текстово съдържание; изтеглянията могат да върнат текст или base64 за бинарни обекти.

### Използва се от

- [Amazon S3 node](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) е key-value хранилище в паметта, използвано за кеширане и бърз достъп до данни.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `host` | Hostname или IP на Redis сървъра (напр. `localhost`) |
| `port` | Redis порт (по подразбиране: `6379`) |
| `password` | Redis парола (оставете празно, ако не е зададена) |

### Използва се от

- [Redis node](../nodes/redis-node.md)

---

## Slack

Удостоверението Slack съхранява **Incoming Webhook URL** за публикуване на съобщения в Slack канали.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `webhook_url` | Slack Incoming Webhook URL (от конфигурацията на Вашето Slack приложение) |

### Бележки

- Създайте Incoming Webhook на [api.slack.com/apps](https://api.slack.com/apps) → Вашето приложение → **Incoming Webhooks**.
- Всеки webhook е обвързан с конкретен канал. Създайте няколко удостоверения за различните канали.

### Използва се от

- [Slack node](../nodes/slack-node.md)

---

## Telegram

Удостоверението Telegram съхранява **Bot Token** и опционален **Webhook Secret Token** за workflow-и, базирани на ботове.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `bot_token` | Telegram Bot API token от BotFather |

### Опционални полета

| Поле | Описание |
|-------|-------------|
| `secret_token` | Споделена тайна, проверявана срещу `x-telegram-bot-api-secret-token` при входящи webhook-ове |

### Бележки

- Използвайте едно и също удостоверение както за [Telegram Trigger](../nodes/telegram-trigger-node.md), така и за [Telegram](../nodes/telegram-node.md).
- Регистрирайте webhook ръчно чрез `setWebhook` API на Telegram, като използвате URL-а, показан в панела на Telegram Trigger node.
- `chatId` в Telegram node може да бъде буквален ID или израз като `$telegramEvent.message.chat.id`.

### Използва се от

- [Telegram Trigger node](../nodes/telegram-trigger-node.md)
- [Telegram node](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Тези удостоверения се използват от [HTTP node](../nodes/http-node.md) за автентикация на изходящи заявки.

### Bearer

Добавя хедър `Authorization: Bearer <token>` към HTTP заявките.

| Поле | Описание |
|-------|-------------|
| `token` | Стойността на bearer token |

### Header

Добавя персонализиран хедър към HTTP заявките.

| Поле | Описание |
|-------|-------------|
| `header_key` | Име на хедъра (напр. `X-Api-Key`) |
| `header_value` | Стойност на хедъра |

И двата типа могат да бъдат реферирани чрез `$credentials.CredentialName` в [Expression DSL](./expression-dsl.md) за динамична употреба във всеки node, който приема изрази.

### Използва се от

- [HTTP node](../nodes/http-node.md)

---

## LLM доставчици (OpenAI, Google, Custom, Cohere)

Тези удостоверения захранват AI node-ове.

| Тип | Описание |
|------|-------------|
| **OpenAI** | API key за GPT модели и OpenAI embeddings |
| **Google** | API key за Gemini модели |
| **Custom** | API key + base URL за OpenAI-съвместими endpoint-и (Ollama, vLLM, LM Studio и др.) |
| **Cohere** | API key за Cohere embeddings |

### OpenAI Prompt Caching

OpenAI автоматично кешира статичния (непроменящ се) префикс на Вашия system prompt — не е необходима допълнителна конфигурация. Повтарящите се изпълнения на workflow, които споделят един и същ префикс на system prompt, се възползват от ценообразуване с кеширани token-и, което намалява както разходите, така и латентността. Това е особено полезно, когато имате дълги, фиксирани инструкции и се променя само потребителското съобщение между изпълненията. Следете процента на cache hit и спестените token-и в [Traces tab](../tabs/traces-tab.md) или в таблото за използване на OpenAI, за да оптимизирате структурата на prompt-а си за максимално преизползване на кеша.

### Използва се от

- [LLM node](../nodes/llm-node.md)
- [Agent node](../nodes/agent-node.md)
- [RAG node](../nodes/rag-node.md) (OpenAI embeddings чрез Qdrant удостоверение)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) е прокси сървър за заобикаляне на Cloudflare и подобни предизвикателства за защита срещу ботове.

### Задължителни полета

| Поле | Описание |
|-------|-------------|
| `flaresolverr_url` | URL на Вашата FlareSolverr инстанция (напр. `http://localhost:8191`) |

Тук се поддържат loopback и частни адреси, така че стартирането на FlareSolverr редом с Heym работи, както е документирано. URL-ът не може да се разрешава до link-local или cloud-metadata адрес. Тъй като частните адреси са разрешени, това поле може да бъде насочено и към друга вътрешна услуга, а отговорът се връща в изхода на node-а. Всеки влязъл в системата потребител може да създаде това удостоверение, така че границата е кой може да създава workflow-и, плюс Вашите мрежови правила, а не споделянето на удостоверения. Вижте [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Използва се от

- [Crawler node](../nodes/crawler-node.md)

---
## Свързани

- [Удостоверения](./credentials.md) – Преглед на удостоверенията и как възлите ги използват
- [Раздел „Удостоверения“](../tabs/credentials-tab.md) – Добавяне и управление на удостоверения
- [Споделяне на удостоверения](./credentials-sharing.md) – Споделяне на удостоверения с потребители и екипи
- [Сигурност](./security.md) – Криптиране при съхранение, контрол на достъпа
- [Expression DSL](./expression-dsl.md) – Синтаксис `$credentials` за динамичен достъп

---

## Model Router (Auto Model)

Насочва всяка заявка към едно от Вашите съществуващи удостоверения за модели, като използва
decision model, който да избере. Съхранява само референции, никога собствен ключ.

### Задължителни полета

- `decision_credential_id` – удостоверение за **Decision Model**, до което имате достъп.
- `decision_model` – моделът, който извършва routing заявката, например `jev-latest`.
- `options` – поне два записа, всеки с име, едно от Вашите OpenAI/Google/Custom
  удостоверения, модел към него и критерии кога да бъде избран.

### Опционални полета

- `routing_instructions` – как да се претеглят опциите като цяло.
- Една опция може да бъде отбелязана като fallback, използвана при неуспешно routing.

### Бележки

Имената на опциите са това, между което decision model избира, затова трябва да са различни. Една
опция не може да сочи към друг Model Router.

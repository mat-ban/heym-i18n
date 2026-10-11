# Раздел „Удостоверения“

Разделът **Удостоверения** управлява API ключове и тайни, използвани от възлите. Добавете удостоверения тук и се позовавайте на тях по име във възлите на workflow. За преглед на това какво представляват удостоверенията и как възлите ги използват, вижте [Удостоверения](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Гледайте демонстрацията на Удостоверения</a></p>

## Типове удостоверения

| Тип | Приложение |
|------|----------|
| **OpenAI** | OpenAI API ключ за LLM, Agent и RAG възли |
| **Google** | Google AI (Gemini) API ключ |
| **GitHub** | GitHub personal access token (PAT) за GitHub API, GitHub node workflows, MCP сървъри и agent workflows; незадължителен GitHub Enterprise `base_url` |
| **Linear** | Linear personal API ключ или OAuth2 за екипи, проекти, задачи и коментари |
| **Notion** | Вътрешен integration token или OAuth оторизация за публична интеграция в workspace |
| **Custom** | Персонализирани LLM endpoint-и |
| **Bearer** | Bearer token за HTTP автентикация |
| **Header** | Персонализирана header двойка ключ-стойност за HTTP заявки |
| **Telegram** | Telegram bot token и незадължителна webhook тайна |
| **Slack** | Slack incoming webhook URL |
| **Discord** | Discord incoming webhook URL |
| **Discord Trigger** | Публичен ключ на Discord приложение |
| **IMAP** | Удостоверения за trigger на входяща пощенска кутия |
| **SMTP** | Удостоверения за изпращане на имейли |
| **Redis** | Redis връзка |
| **RAG: Qdrant + OpenAI** | Векторно хранилище за RAG възли, базирано на външен Qdrant сървър |
| **RAG: Psql + OpenAI** | Векторно хранилище за RAG възли, базирано на собствената Postgres база данни на Heym (pgvector) — без външна услуга |
| **RAG: Custom Embeddings** | Векторно хранилище за RAG възли, използващо всеки OpenAI-съвместим embedding endpoint, с Qdrant или Postgres (pgvector) като хранилище |
| **Cohere** | Cohere API за embeddings |

## Добавяне на удостоверения

1. Кликнете върху **Add Credential**
2. Изберете типа удостоверение
3. Въведете необходимите стойности (API ключ, URL и т.н.)
4. Дайте му име за позоваване във възлите

За GitHub текущият поток за удостоверения е базиран на PAT. Препоръчват се fine-grained PAT. Потоците за инсталиране на GitHub App не са първокласни в потребителския интерфейс към момента. Ако използвате GitHub Enterprise Server, може също да зададете незадължителен GitHub API base URL, например `https://github.example.com/api/v3`.

За Linear изберете **Personal API key** или **OAuth2** в диалоговия прозорец. Personal API ключовете се създават
под **Settings → Security & Access → Personal API keys** в Linear. OAuth2 използва Linear OAuth
приложение с Client ID и Client Secret, като `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
е регистриран като redirect URI. Удостоверението действа с разрешенията на Linear потребителя, който
го е създал или оторизирал. Използвайте **Test Connection** в диалоговия прозорец за удостоверение, за да проверите API ключа или
OAuth token преди запазване.

За **Notion** изберете **Internal token** или **OAuth** в диалоговия прозорец. OAuth използва Client ID и
Client Secret от вашата Notion публична интеграция; Heym ги съхранява криптирани в удостоверението.
Използвайте **Test Connection**, за да проверите Supabase, Linear или Notion удостоверения преди запазване на workflow. Вижте
[Third-Party Integrations](../reference/integrations.md#notion) за подробности относно настройката на Notion.

OAuth удостоверенията отварят страницата за оторизация на доставчика в popup. Ако браузърът я блокира, използвайте връзката **Open the authorization page** под бутона Connect; диалоговият прозорец отчита кога връзката е установена. След като ново удостоверение бъде свързано, бутонът показва **Connected**.

## Редактиране и изтриване

- **Edit** – Актуализиране на стойностите на удостоверението (чувствителните стойности са маскирани)
- **Delete** – Премахване на удостоверение; workflows, които го използват, ще се нуждаят от замяна

При редактиране на **GitHub** удостоверение на GitHub Enterprise Server, оставянето на незадължителния **GitHub
API Base URL** празен запазва съществуващия Enterprise endpoint. Въведете нов URL само когато
искате да промените този endpoint.

## Споделяне

- [Споделяне на удостоверения](../reference/credentials-sharing.md) с други потребители по имейл или с [Teams](../reference/teams.md)
- Споделените удостоверения се показват с индикатор
- Отменете споделянето от менюто на картата на удостоверението
## Използване във възли

Позовавайте се на удостоверенията по име в конфигурацията на възела. Например:
- [LLM node](../nodes/llm-node.md) – Изберете удостоверение за API на модела
- [HTTP node](../nodes/http-node.md) – Използвайте Bearer или Header удостоверения за автентикация
- [Agent node](../nodes/agent-node.md) – Подайте GitHub token-и в env променливи на MCP сървъра, като `GITHUB_PERSONAL_ACCESS_TOKEN`
- [GitHub node](../nodes/github-node.md) – Изпълнявайте нативни GitHub операции с repository, user, issue, review, release, workflow, traffic и файлове
- [Linear node](../nodes/linear-node.md) – Четете метаданни на workspace и автоматизирайте Linear issues и коментари
- [Notion node](../nodes/notion-node.md) – Управлявайте Notion бази от данни, източници на данни, страници и блокове
- [RAG node](../nodes/rag-node.md) – Използвайте Qdrant или Postgres (pgvector) удостоверение за векторното хранилище
- [Telegram Trigger node](../nodes/telegram-trigger-node.md) – Получавайте webhook-ове от Telegram bot
- [Telegram node](../nodes/telegram-node.md) – Изпращайте съобщения от Telegram bot
- [Discord Trigger node](../nodes/discord-trigger-node.md) – Получавайте webhook-ове за Discord взаимодействия
- [Discord node](../nodes/discord-node.md) – Изпращайте Discord webhook съобщения
- [IMAP Trigger node](../nodes/imap-trigger-node.md) – Проверявайте споделена пощенска кутия за нови имейли

Вижте [Expression DSL](../reference/expression-dsl.md) за позоваване на стойности, базирани на удостоверения, в изрази.

## Свързани

- [Third-Party Integrations](../reference/integrations.md) – Подробно ръководство за настройка на всеки тип удостоверение (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack и други)
- [Credentials Sharing](../reference/credentials-sharing.md) – Споделяне на удостоверения с други потребители
- [Security](../reference/security.md) – Криптиране при съхранение, управление на сесии, ограничаване на честотата
- [Node Types](../reference/node-types.md) – Възли, които използват удостоверения ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Vectorstores Tab](./vectorstores-tab.md) – Използва Qdrant или Postgres (pgvector) удостоверения
- [Chat Tab](./chat-tab.md) – Използва OpenAI/Google удостоверения
- [Contextual Showcase](../reference/contextual-showcase.md) – Компактно ръководство за страници на таблото

# Webhooks

Workflows могат да бъдат стартирани чрез HTTP webhooks. Стандартният endpoint за изпълнение връща JSON, а стрийминг вариантът връща Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Заменете `{workflow_id}` с UUID на workflow-а. Базовият URL е вашият Heym instance (напр. `https://app.heym.ai`).

## Метод на заявката

Всеки workflow приема един HTTP verb, избран в cURL диалога на редактора: `GET`, `POST`, `PUT` или `DELETE`. **`POST` е по подразбиране** и всеки workflow, създаден преди тази настройка да съществува, я запазва, така че нищо работещо днес не се променя.

Извикването на workflow с различен verb връща `405 Method Not Allowed` със заглавка `Allow`, указваща конфигурирания:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Едно изключение: заявките, носещи `?test_run=true`, пропускат проверката. Това е, което бутонът **Run** на редактора и панелът за дебъг изпращат, така че workflow, настроен на `GET`, остава тестваем отвътре в продукта.

### Методи без тяло

`GET` и `DELETE` не носят тяло на заявката. Входните данни идват от query string вместо това и се четат с `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL диалогът скрива редактора на тялото на заявката и премахва заглавката `Content-Type` за тези два метода.

Комбинирайте `GET` с [HTML output mapper](../nodes/html-output-mapper-node.md), за да обслужите страница, която браузърът може да отвори директно.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Използвайте streaming endpoint-а, когато искате инкрементални събития за изпълнение вместо единичен JSON отговор. Вижте [SSE Streaming](./sse-streaming.md) за протокола на събитията и конфигурацията на start съобщението за всеки node.

## Формат на заявката

Тялото на заявката се предава като `body` към [Input](../nodes/input-node.md) nodes. Heym приема и двете форми на заявка:

- **Raw JSON** – напр. `{"userId": "123", "action": "create"}`
- **Wrapped формат** – `{"inputs": {...}, "test_run": false}`

При използване на wrapped формата, `inputs` се извлича и предава като `body`. `test_run` заобикаля rate limiting и кеширането на отговори. Може също да изпратите `?test_run=true` като query параметър при подаване на raw JSON.

## Режими на тялото на заявката

Всеки workflow има настройка `webhook_body_mode`, която контролира как редакторът изгражда примерни заявки:

| Режим | Поведение |
|------|----------|
| **defined** | Редакторът и cURL диалогът оформят примерното тяло от полетата на Input node на workflow-а и запазват празните ключове в JSON payload-а. Съществуващите cURL payload-и в defined стил продължават да работят. |
| **generic** | Редакторът и cURL диалогът използват свободен JSON формат на тялото. Тялото на заявката се предава както е, така че външни приложения могат да изпращат своя собствена фиксирана форма на payload-а. |

API-то за изпълнение остава обратно съвместимо и в двата режима. Raw JSON и wrapped `{ "inputs": ... }` заявки продължават да се приемат и по двата начина.

Заглавките и query параметрите са достъпни в изразите като `$input.headers` и `$input.query`. Ключовете на заглавките се преобразуват в малки букви.

## Удостоверяване

Конфигурира се за всеки workflow в редактора (настройки на workflow-а). Удостоверяването се проверява преди изпълнение.

| auth_type | Поведение |
|-----------|----------|
| **anonymous** | Не се изисква удостоверяване. Всеки може да извика endpoint-а. |
| **jwt** | Изисква се Bearer token. Приема или token за потребителска сесия (потребителят трябва да има достъп до workflow-а), или scoped [Execution Token](./execution-tokens.md), създаден за този workflow. |
| **header_auth** | Персонализирана заглавка трябва да съвпада. Задайте `auth_header_key` (напр. `X-API-Key`) и `auth_header_value`. |

За `header_auth` стойността на заглавката на заявката трябва да съвпада точно с конфигурираната стойност. JWT потребители с достъп до workflow-а могат също да извикват без персонализираната заглавка.

За `jwt` [Execution Tokens](./execution-tokens.md) са препоръчителният начин за извикване на workflows от външни системи — те са scoped към един workflow и могат да бъдат отменяни независимо.

## Кеширане на отговори

Конфигурирайте `cache_ttl_seconds` за всеки workflow. Когато е зададено и по-голямо от 0:

- **Cache key**: SHA256 хеш на `workflow_id` + `body` + `query`
- **Cache hit**: Връща се незабавно със `status: "cached"` и кеширани изходни данни
- **Cache set**: Само след успешно изпълнение (`status: "success"`)
- **Съхранение**: Базирано на Postgres и споделено между backend workers

| Настройка | Ефект |
|---------|--------|
| `cache_ttl_seconds` = 0 или null | Кеширането е изключено |
| `cache_ttl_seconds` > 0 | Отговорите се кешират за този брой секунди |

Заявките с `test_run` заобикалят кеша (без четене, без запис).

Когато кеширането на отговори е активирано в cURL диалога, **Clear cache** премахва незабавно кешираните отговори на текущия workflow.

## Rate Limiting

Конфигурира се за всеки workflow: `rate_limit_requests` и `rate_limit_window_seconds`.

- **Обхват**: За `workflow_id` + клиентски IP (плъзгащ се прозорец)
- **Превишаване**: HTTP 429 със заглавка `Retry-After`
- **Заглавки**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Настройка | Описание |
|---------|-------------|
| `rate_limit_requests` | Максимален брой заявки, разрешени в прозореца |
| `rate_limit_window_seconds` | Продължителност на прозореца в секунди |

Заявките с `test_run` заобикалят rate limiting.
<a id="concurrency-limit-and-queued-runs"></a>

## Лимит за конкурентност и наредени на опашка изпълнения

Даден workflow може да ограничи броя на едновременно изпълняваните производствени задачи. Включете **Лимит за конкурентност** в панела **Properties** на ниво workflow и задайте **Макс. едновременни изпълнения**. Собствениците и сътрудниците с права за редактиране могат да променят тази стойност. Лимитът е изключен по подразбиране.

Когато лимитът бъде достигнат, новите задачи чакат в опашка FIFO (първи влязъл, първи излязъл). Това обхваща всяка производствена входна точка: този endpoint, [streaming endpoint](./sse-streaming.md), [Portal](./portal.md), [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) и всеки [trigger](./triggers.md). Тестовите пускания от редактора винаги започват веднага и не заемат слот. Изпращането на `test_run=true` без влязла в системата сесия, която има право да отвори workflow-а, не заобикаля опашката.

| Настройка | Описание |
|---|---|
| `concurrency_limit` | Разрешени производствени изпълнения едновременно. `0` изключва лимита |
| `concurrency_max_queue` | По избор. Разрешени за изчакване едновременно задачи. Празно означава без лимит |
| `concurrency_max_wait_seconds` | По избор. Задача, чакаща по-дълго, се записва като `expired`. Празно означава неограничено чакане |

### 202 Accepted

Извикване, което стартира веднага, се държи точно както е описано във Формат на отговора. Извикване, което трябва да изчака, получава веднага `202 Accepted`, независимо от `X-Simple-Response`, със заглавка `Location`, сочеща към нейния URL за статус:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "status_url": "https://heym.example.com/api/workflows/{workflow_id}/executions/{execution_id}/status",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "status_token": "..."
}
```

| Поле | Описание |
|---|---|
| `queue.position` | Мястото на това изпълнение на опашката, започващо от 1 |
| `queue.size` | Чакащи в момента изпълнения |
| `queue.running` | Изпълнения, заемащи слот в момента |
| `queue.limit` | Лимитът за конкурентност на дадения workflow |
| `status_token` | Само за анонимни workflow. Връща се еднократно в този отговор |

### Status URL

`GET /api/workflows/{workflow_id}/executions/{execution_id}/status` връща състоянието на изпълнението. Извикайте го със същите идентификационни данни, с които е стартирано изпълнението: сесия или JWT, [токен за изпълнение](./execution-tokens.md) или персонализираната заглавка на workflow-а. Анонимният workflow няма данни за валидиране, затова изпратете `status_token` от отговор 202 в заглавката `X-Heym-Run-Token`. Токенът никога не се чете от query string. Грешен или липсващ токен получава `404`, както и неизвестно изпълнение.

```json
{
  "execution_id": "...",
  "workflow_id": "...",
  "status": "success",
  "queue": null,
  "outputs": { "done": { "result": "ok" } },
  "error": null,
  "execution_time_ms": 5120
}
```

| `status` | Значение (изпълнение, което трябва да изчака за слот за конкурентност, получава [отговор 202](#202-accepted) вместо това) |
|---|---|
| `queued` | Чака за слот; обектът `queue` показва състоянието |
| `running` | Разполага със слот и се изпълнява |
| `success` / `error` | Завършено; `outputs` и `error` са попълнени |
| `pending` | Поставено на пауза за [човешки преглед](./human-in-the-loop.md) |
| `cancelled` | Отменено от [История на изпълненията](./execution-history.md) |
| `expired` | Чакало е по-дълго от `concurrency_max_wait_seconds` и не се е изпълнило |

Изпращайте заявка на всеки няколко секунди, докато статусът спре да бъде `queued` или `running`. Нареденото на опашка изпълнение се извършва дори ако никой не го проверява.

### Пълна опашка

Когато е зададен `concurrency_max_queue` и този брой изпълнения вече чака, извикването се отхвърля с `429 Concurrency queue is full` и запис `queue_full` в историята на изпълненията. Нищо не се добавя на опашката.

## Формат на отговора

Endpoint-ът връща JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Поле | Описание |
|-------|-------------|
| `workflow_id` | UUID на Workflow |
| `status` | `success`, `error`, `cached` или `rate_limited` |
| `outputs` | Изходи от терминалните nodes. Когато единственият терминален node е единичен [JSON output mapper](../nodes/json-output-mapper-node.md), тялото на отговора е този мапнат обект на най-горно ниво (стандартни прости JSON отговори). В противен случай включва [Output](../nodes/output-node.md) и други терминални nodes, индексирани по label. |
| `execution_time_ms` | Време за изпълнение в милисекунди (0 за cached/rate_limited) |

При грешка `outputs` може да съдържа подробности за грешката. Node [Throw Error](../nodes/throw-error-node.md) може да зададе персонализиран HTTP статус код (4xx/5xx).

## Диалог Run with cURL

Бутонът **Run with cURL** в лентата с инструменти (горе вдясно в редактора, икона `cURL`) отваря диалог, който генерира и копира готов за изпълнение cURL команда за текущия workflow.

### Какво прави

| Поле | Описание |
|-------|-------------|
| **Request Body Mode** | Изберете **Defined** или **Generic**. Generic запазва тялото като raw JSON, вместо да го оформя от Input полетата. |
| **Authentication** | Изберете Anonymous, JWT Token или Header Auth. Задава правилния auth header в командата. Когато е избран JWT Token, диалогът показва мениджър за [Execution Token](./execution-tokens.md) — създайте или изберете token, който да бъде вграден директно в командата. |
| **Header Key / Value** | Показва се, когато е избран Header Auth. Предварително попълнено от настройките за автентикация на workflow. |
| **Response Cache** | Минути за кеширане на идентични отговори (0 = изключено). Промените се запазват към workflow. Когато е активирано, **Clear cache** премахва кешираните отговори незабавно. |
| **Rate Limit** | Максимален брой заявки за времеви прозорец. Промените се запазват към workflow. |
| **SSE Streaming** | Превключва командата към `/execute/stream`, добавя `--no-buffer` и показва настройки за `node_start` съобщения за всеки node. |
| **Body** | JSON тяло на заявката. В режим Defined е предварително попълнено от полетата на [Input](../nodes/input-node.md) и запазва празните ключове. В режим Generic е редактор за raw JSON. |
| **Command** | Само за четене — визуализация на пълната cURL команда. |

Натиснете **Copy cURL**, за да копирате командата в клипборда.

### Пример

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

В режим Generic вложените payload-и остават непокътнати, например:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Диалогът отразява настройките за автентикация, режим на тялото, кеширане и rate limit, запазени към workflow — редактирането им тук актуализира workflow незабавно.

### SSE Streaming в диалога

Активирайте **SSE Streaming**, когато искате генерираната команда да следва изпълнението в реално време от вашия терминал.

- Endpoint-ът се променя от `/execute` на `/execute/stream`
- Командата добавя `--no-buffer` и `Accept: text/event-stream`
- Всеки non-sticky node се появява в списък, където можете да:
  - включите или изключите съобщението `node_start`
  - персонализирате текста на началното съобщение
- Събитията `node_complete` се излъчват винаги и включват пълния изход на node

Пример:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

За пълния протокол за събития и примери вижте [SSE Streaming](./sse-streaming.md).

## Маркиране на Trigger Source

Всяко изпълнение запазва label `trigger_source`, видим в [Execution History](./execution-history.md). Задайте го, като изпратите header `X-Trigger-Source` с произволна стойност по ваш избор:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Бутонът **Copy cURL** в диалога на редактора включва `X-Trigger-Source: API` автоматично. Можете да замените `API` с нещо смислено — `scheduler`, `rabbitmq`, `github-actions` и т.н.

Ако header-ът не бъде изпратен, `trigger_source` приема стойност по подразбиране `"API"` и изпълнението е отбелязано като **API** в историята. Заменете го с произволна стойност, смислена за вашата система — `scheduler`, `github-actions`, `rabbitmq` и т.н.

## Свързани

- [Execution Tokens](./execution-tokens.md) – Scoped JWT-та за извикване на workflows от външни системи
- [SSE Streaming](./sse-streaming.md) – Излъчване на node събития в реално време чрез Server-Sent Events
- [Triggers](./triggers.md) – Всички входни точки на workflow, включително webhook
- [Workflow Structure](./workflow-structure.md) – Nodes и edges
- [Expression DSL](./expression-dsl.md) – Достъп до `$input.body`, `$input.headers`, `$input.query`

# Webhooks

Workflow можна запускати через HTTP webhooks. Стандартний execute endpoint повертає JSON, а потоковий варіант повертає Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Замініть `{workflow_id}` на UUID workflow. Базова URL-адреса — це ваш екземпляр Heym (наприклад, `https://app.heym.ai`).

## Метод запиту

Кожен workflow приймає один HTTP-дієслово, вибране в діалозі cURL редактора: `GET`, `POST`, `PUT` або `DELETE`. **`POST` є типовим**, і кожен workflow, створений до появи цього налаштування, зберігає його, тож нічого з того, що працює сьогодні, не змінюється.

Виклик workflow з іншим дієсловом повертає `405 Method Not Allowed` із заголовком `Allow`, який називає налаштоване дієслово:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Один виняток: запити з `?test_run=true` пропускають перевірку. Саме це надсилають кнопка **Run** у редакторі та панель налагодження, тож workflow, налаштований на `GET`, залишається доступним для тестування зсередини продукту.

### Методи без тіла

`GET` і `DELETE` не містять тіла запиту. Вхідні дані надходять із рядка запиту та читаються за допомогою `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Діалог cURL приховує редактор тіла запиту та відкидає заголовок `Content-Type` для цих двох методів.

Поєднайте `GET` з [HTML output mapper](../nodes/html-output-mapper-node.md), щоб обслуговувати сторінку, яку браузер може відкрити безпосередньо.

## Streaming Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Використовуйте streaming endpoint, коли потрібні інкрементальні події виконання замість однієї відповіді JSON. Дивіться [SSE Streaming](./sse-streaming.md) щодо протоколу подій і налаштування стартового повідомлення для кожного вузла.

## Формат запиту

Тіло запиту передається як `body` до вузлів [Input](../nodes/input-node.md). Heym приймає обидві форми запиту:

- **Raw JSON** – наприклад, `{"userId": "123", "action": "create"}`
- **Wrapped format** – `{"inputs": {...}, "test_run": false}`

У разі використання wrapped format `inputs` витягується та передається як `body`. `test_run` обходить обмеження швидкості та кешування відповідей. Ви також можете надіслати `?test_run=true` як параметр запиту під час надсилання raw JSON.

## Режими тіла запиту

Кожен workflow має налаштування `webhook_body_mode`, яке контролює, як редактор формує приклади запитів:

| Режим | Поведінка |
|------|----------|
| **defined** | Редактор і діалог cURL формують приклад тіла з полів вузла Input workflow і зберігають порожні ключі в JSON payload. Наявні cURL payload у стилі defined продовжують працювати. |
| **generic** | Редактор і діалог cURL використовують довільне тіло JSON. Тіло запиту передається як є, тож зовнішні застосунки можуть надсилати власну фіксовану форму payload. |

API виконання залишається зворотно сумісним в обох режимах. Raw JSON і wrapped-запити `{ "inputs": ... }` усе ще приймаються в будь-якому разі.

Заголовки та query params доступні у виразах як `$input.headers` і `$input.query`. Ключі заголовків перетворюються на нижній регістр.

## Автентифікація

Налаштовується для кожного workflow у редакторі (налаштування workflow). Автентифікація перевіряється перед виконанням.

| auth_type | Поведінка |
|-----------|----------|
| **anonymous** | Автентифікація не потрібна. Будь-хто може викликати endpoint. |
| **jwt** | Потрібен Bearer token. Приймає або token сесії користувача (користувач повинен мати доступ до workflow), або scoped [Execution Token](./execution-tokens.md), створений для цього workflow. |
| **header_auth** | Власний заголовок має збігатися. Встановіть `auth_header_key` (наприклад, `X-API-Key`) і `auth_header_value`. |

Для `header_auth` значення заголовка запиту має точно збігатися з налаштованим значенням. Користувачі JWT із доступом до workflow також можуть викликати без власного заголовка.

Для `jwt` [Execution Tokens](./execution-tokens.md) є рекомендованим способом виклику workflow із зовнішніх систем — вони обмежені одним workflow і можуть бути відкликані незалежно.

## Кешування відповідей

Налаштуйте `cache_ttl_seconds` для кожного workflow. Коли встановлено й більше 0:

- **Cache key**: SHA256-хеш `workflow_id` + `body` + `query`
- **Cache hit**: Повертається негайно зі `status: "cached"` і кешованими виходами
- **Cache set**: Лише після успішного виконання (`status: "success"`)
- **Storage**: На основі Postgres і спільне для всіх backend workers

| Налаштування | Ефект |
|---------|--------|
| `cache_ttl_seconds` = 0 або null | Кешування вимкнено |
| `cache_ttl_seconds` > 0 | Відповіді кешуються протягом цієї кількості секунд |

Запити `test_run` обходять кеш (без читання, без запису).

Коли кешування відповідей увімкнено в діалозі cURL, **Clear cache** негайно вилучає кешовані відповіді поточного workflow.

## Обмеження швидкості

Налаштуйте для кожного workflow: `rate_limit_requests` і `rate_limit_window_seconds`.

- **Scope**: За `workflow_id` + IP клієнта (sliding window)
- **Перевищено**: HTTP 429 із заголовком `Retry-After`
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Налаштування | Опис |
|---------|-------------|
| `rate_limit_requests` | Максимальна кількість запитів, дозволених у вікні |
| `rate_limit_window_seconds` | Тривалість вікна в секундах |

Запити `test_run` обходять обмеження швидкості.

## Формат відповіді

Endpoint повертає JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Поле | Опис |
|-------|-------------|
| `workflow_id` | UUID Workflow |
| `status` | `success`, `error`, `cached` або `rate_limited` |
| `outputs` | Виводи термінальних вузлів. Якщо єдиним термінальним вузлом є один [JSON output mapper](../nodes/json-output-mapper-node.md), тіло відповіді — це той відображений об'єкт на верхньому рівні (типові прості JSON-відповіді). Інакше містить [Output](../nodes/output-node.md) та інші термінальні вузли, ключовані за міткою. |
| `execution_time_ms` | Час виконання в мілісекундах (0 для cached/rate_limited) |

У разі помилки `outputs` може містити деталі помилки. Вузол [Throw Error](../nodes/throw-error-node.md) може встановити власний код стану HTTP (4xx/5xx).

## Діалог Run with cURL

Кнопка на панелі інструментів **Run with cURL** (у верхньому правому куті редактора, іконка `cURL`) відкриває діалог, який формує та копіює готову до виконання команду cURL для поточного workflow.

### Що він робить

| Поле | Опис |
|-------|-------------|
| **Request Body Mode** | Виберіть **Defined** або **Generic**. Generic залишає тіло як необроблений JSON замість формування його з полів Input. |
| **Authentication** | Виберіть Anonymous, JWT Token або Header Auth. Встановлює правильний заголовок автентифікації в команді. Коли вибрано JWT Token, діалог показує менеджер [Execution Token](./execution-tokens.md) — створіть або виберіть token, щоб вбудувати його безпосередньо в команду. |
| **Header Key / Value** | Відображається, коли вибрано Header Auth. Попередньо заповнюється з налаштувань автентифікації workflow. |
| **Response Cache** | Кількість хвилин для кешування ідентичних відповідей (0 = вимкнено). Зміни зберігаються у workflow. Коли ввімкнено, **Clear cache** негайно вилучає кешовані відповіді. |
| **Rate Limit** | Максимум запитів за часовий проміжок. Зміни зберігаються у workflow. |
| **SSE Streaming** | Перемикає команду на `/execute/stream`, додає `--no-buffer` і відкриває налаштування повідомлень `node_start` для кожного вузла. |
| **Body** | Тіло JSON-запиту. У режимі Defined воно попередньо заповнюється з полів [Input](../nodes/input-node.md) і зберігає порожні ключі. У режимі Generic це редактор необробленого JSON. |
| **Command** | Попередній перегляд повної команди cURL лише для читання. |

Натисніть **Copy cURL**, щоб скопіювати команду в буфер обміну.

### Приклад

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

У режимі Generic вкладені payload залишаються незмінними, наприклад:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Діалог відображає налаштування автентифікації, режиму тіла, кешування та обмеження швидкості, збережені у workflow — редагування їх тут негайно оновлює workflow.

### SSE Streaming у діалозі

Увімкніть **SSE Streaming**, коли хочете, щоб згенерована команда відстежувала виконання в реальному часі з вашого термінала.

- Endpoint змінюється з `/execute` на `/execute/stream`
- Команда додає `--no-buffer` і `Accept: text/event-stream`
- Кожен не-sticky вузол з'являється у списку, де ви можете:
  - увімкнути або вимкнути повідомлення `node_start`
  - налаштувати текст повідомлення про початок
- Події `node_complete` завжди надсилаються та містять повний вивід вузла

Приклад:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Повний протокол подій і приклади дивіться в [SSE Streaming](./sse-streaming.md).

## Позначення джерела Trigger

Кожне виконання зберігає мітку `trigger_source`, видиму в [Execution History](./execution-history.md). Встановіть її, надіславши заголовок `X-Trigger-Source` з будь-яким значенням на ваш вибір:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Кнопка **Copy cURL** у діалозі редактора автоматично додає `X-Trigger-Source: API`. Ви можете замінити `API` на будь-що значуще — `scheduler`, `rabbitmq`, `github-actions` тощо.

Якщо заголовок не надіслано, `trigger_source` за замовчуванням дорівнює `"API"`, і запуск позначено як **API** в історії. Перевизначте його будь-яким значенням, значущим для вашої системи — `scheduler`, `github-actions`, `rabbitmq` тощо.

## Пов'язане

- [Execution Tokens](./execution-tokens.md) – Обмежені JWT для виклику workflow із зовнішніх систем
- [SSE Streaming](./sse-streaming.md) – Потокове передавання подій вузлів у реальному часі через Server-Sent Events
- [Triggers](./triggers.md) – Усі точки входу workflow, включно з webhook
- [Workflow Structure](./workflow-structure.md) – Вузли та ребра
- [Expression DSL](./expression-dsl.md) – Доступ до `$input.body`, `$input.headers`, `$input.query`

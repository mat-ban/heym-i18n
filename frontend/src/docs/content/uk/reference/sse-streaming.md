# Потокове передавання SSE

Workflow можуть передавати події виконання в реальному часі за допомогою Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Цей endpoint використовує ті самі правила автентифікації на рівні workflow, обмеження швидкості та кешування відповідей, що й стандартний endpoint виконання, описаний у розділі [Webhooks](./webhooks.md).

## Увімкнення SSE у діалозі cURL

Відкрийте діалог **Run with cURL** у редакторі та увімкніть **SSE Streaming**.

Коли цю опцію увімкнено, Heym:

- змінює згенеровану команду з `/execute` на `/execute/stream`
- додає `--no-buffer`, щоб потокові події з'являлися в терміналі негайно
- додає `Accept: text/event-stream`
- дає змогу налаштувати повідомлення `node_start` для кожного вузла безпосередньо в діалозі

## Протокол подій

Кожен кадр SSE — це JSON, розділений символами нового рядка, з префіксом `data: `.

| Тип події | Коли надсилається | Ключові поля |
|------------|--------------------|------------|
| `execution_started` | Одразу після прийняття запиту | `execution_id`, `server_now_ms` |
| `node_start` | Безпосередньо перед початком виконання вузла | `node_id`, `node_label`, `started_at_ms`, необов'язкове `message` |
| `node_retry` | Коли вузол виконує повторну спробу | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Після завершення вузла | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Коли вузол Output повертає результат достроково | `node_label`, `output` |
| `execution_complete` | Після завершення workflow | `status`, `outputs`, `execution_time_ms` |

## Повідомлення про початок для кожного вузла

Діалог cURL зберігає налаштування SSE безпосередньо у workflow:

- **Send start** визначає, чи включає подія `node_start` поле `message`
- **Start message** за замовчуванням має значення `[START] {nodeLabel}`
- очищення користувацького повідомлення повертає текст за замовчуванням
- `node_complete` надсилається завжди та завжди містить вихідні дані вузла

Приклад збереженої конфігурації:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Draft reply"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## Приклад cURL

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Приклад потоку подій:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Примітки щодо безпеки

- workflow з `anonymous`, `jwt` та `header_auth` поводяться так само, як і звичайний webhook endpoint
- кешування відповідей усе ще застосовується, якщо налаштовано `cache_ttl_seconds`
- обмеження швидкості workflow усе ще застосовуються, якщо налаштовано `rate_limit_requests` та `rate_limit_window_seconds`
- `test_run` обходить як кеш, так і обмеження швидкості — так само, як це відбувається для `/execute`

## Пов'язані розділи

- [Webhooks](./webhooks.md) – Стандартний endpoint виконання та діалог cURL
- [Parallel Execution](./parallel-execution.md) – Як потокове передавання вписується в планувальник DAG у Heym
- [Canvas Features](./canvas-features.md) – Елементи керування редактора, зокрема Run with cURL
- [Security](./security.md) – Автентифікація та робота з секретами

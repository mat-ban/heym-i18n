# SSE Streaming

Workflows могат да предават събития от изпълнението в реално време чрез Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Този endpoint използва същите правила за автентикация на ниво workflow, ограничаване на честотата и кеширане на отговорите като стандартния execute endpoint, документиран в [Webhooks](./webhooks.md).

## Активиране на SSE в cURL диалога

Отворете диалога **Run with cURL** в редактора и активирайте **SSE Streaming**.

Когато е активирано, Heym:

- превключва генерираната команда от `/execute` на `/execute/stream`
- добавя `--no-buffer`, така че стриймваните събития да се показват незабавно в изхода на терминала
- добавя `Accept: text/event-stream`
- Ви позволява да конфигурирате съобщения `node_start` за отделни възли директно в диалога

## Протокол за събития

Всеки SSE frame е JSON с разделители за нов ред, предшестван от `data: `.

| Тип събитие | Кога се излъчва | Ключови полета |
|------------|--------------------|------------|
| `queued` | Workflow-ът е достигнал своя [лимит за едновременност](./webhooks.md#concurrency-limit-and-queued-runs); изпраща се отново при всяка промяна на мястото на изпълнението | `execution_id`, `position`, `size`, `running`, `limit` |
| `execution_started` | Незабавно след като заявката бъде приета или когато стартира изпълнение от опашката | `execution_id`, `server_now_ms` |
| `node_start` | Точно преди възел да започне изпълнение | `node_id`, `node_label`, `started_at_ms`, незадължително `message` |
| `node_retry` | Когато възел се опита отново | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | След като възел завърши | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Когато Output възел върне резултат предсрочно | `node_label`, `output` |
| `execution_complete` | След като workflow приключи | `status`, `outputs`, `execution_time_ms` |

### Изпълнения на опашка

Когато workflow-ът достигне своя лимит за едновременност, потокът остава отворен и изпраща `queued` събития, докато изпълнението изчаква. Нареденото на опашка изпълнение се изпълнява във фоновия worker, евентуално в друг процес, така че неговият поток предава `execution_started` при стартиране на изпълнението и `execution_complete` при приключване, но без междинни събития `node_start`, `node_complete` или събития за token-и. Неговият `execution_complete` има празен `node_results`; отворете изпълнението в [История на изпълненията](./execution-history.md) за подробности за възлите. Затварянето на връзката не отменя изпълнение на опашка. Когато опашката е пълна, на заявката се отговаря с `429`, преди потокът да се отвори.

## Съобщения за начало на отделен възел

Диалогът cURL съхранява SSE настройките в самия workflow:

- **Send start** контролира дали събитие `node_start` включва `message`
- **Start message** по подразбиране е `[START] {nodeLabel}`
- изчистването на персонализирано съобщение връща текста по подразбиране
- `node_complete` винаги се излъчва и винаги включва изхода на възела

Пример за съхранена конфигурация:

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

## cURL пример

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Примерен поток от събития:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Бележки за сигурността

- workflow-ите с `anonymous`, `jwt` и `header_auth` се държат по същия начин като обикновения webhook endpoint
- кеширането на отговорите все още се прилага, когато е конфигуриран `cache_ttl_seconds`
- ограниченията за честота на workflow все още се прилагат, когато са конфигурирани `rate_limit_requests` и `rate_limit_window_seconds`
- `test_run` заобикаля както кеша, така и ограничаването на честотата, по същия начин, както прави за `/execute`

## Свързани

- [Webhooks](./webhooks.md) – Стандартен execute endpoint и cURL диалог
- [Parallel Execution](./parallel-execution.md) – Как streaming се вписва в DAG scheduler-а на Heym
- [Canvas Features](./canvas-features.md) – Контроли на редактора, включително Run with cURL
- [Security](./security.md) – Автентикация и работа със секрети

# Проследяване с OpenTelemetry

Heym може да излъчва [OpenTelemetry](https://opentelemetry.io/) трасета за всяко изпълнение на workflow, изпълнение на node и извикване на Agent инструмент. Всяко изпълнение създава root span с дъщерни spans за всеки node и Agent инструмент, така че можете да видите кой етап е неуспешен, колко време е отнел, какво е извикал и какво е върнал. Spans се експортират чрез OTLP/HTTP към всеки съвместим backend като Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic или Grafana Cloud.

Проследяването е **изключено по подразбиране**. Когато е изключено, няма измерим overhead и не се създават spans.

## Активиране на проследяването

Задайте следните environment променливи на backend-а и след това го рестартирайте:

За пълния списък с environment променливи вижте [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Променлива | Стойност по подразбиране | Описание |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Главен превключвател. Задайте `true`, за да включите проследяването. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Базов OTLP/HTTP endpoint, например `http://collector:4318`. Heym изпраща spans към `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Разделени със запетая headers във формат `key=value` за автентикация на exporter-а, например `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Ресурсният атрибут `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Коефициент за head sampling между `0.0` и `1.0`, прилаган с parent-based sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Когато е `true`, прикачва съкратени входни и изходни payload-и на node към node spans. Изключено по подразбиране с цел поверителност. |

Минимален пример:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Може да потвърдите активната конфигурация в приложението под **Settings → Observability** (отворете я от аватара си в хедъра). Този панел е само за четене и никога не показва тайни на exporter-а.

## Какво се проследява

### Root span на workflow

Име: `heym.workflow.execute`

| Атрибут | Описание |
|-----------|-------------|
| `heym.workflow.id` | UUID на workflow-а. |
| `heym.node.count` | Брой nodes във workflow-а. |
| `heym.workflow.test_mode` | `true` за тестови изпълнения. |
| `heym.sub_workflow.depth` | Дълбочина на влагане, когато е извикан като sub-workflow. |
| `heym.workflow.status` | Краен статус на изпълнението. Неуспешно изпълнение задава статус `ERROR` на span-а. |

### Node span

Име: `heym.node.execute`, създаден като дъщерен на workflow span-а.

| Атрибут | Описание |
|-----------|-------------|
| `heym.node.id` | Идентификатор на node. |
| `heym.node.type` | Тип на node, например `agent`, `llm`, `http`. |
| `heym.node.label` | Етикет на node, показан на canvas. |
| `heym.node.status` | `success` или `error`. Грешките задават статус `ERROR` на span-а. |
| `heym.node.duration_ms` | Време за изпълнение на node в милисекунди. |
| `heym.llm.model` | Име на модела за LLM и agent nodes, когато е налично. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Използване на token-и за LLM и agent nodes, когато е налично. |

Node spans се влагат правилно под workflow span-а дори когато nodes се изпълняват паралелно, защото контекстът на workflow-а се разпространява в worker нишките.

### Span на Agent инструмент

Име: `heym.agent.tool.execute`, създаден под span-а на активния Agent node.

| Атрибут | Описание |
|-----------|-------------|
| `heym.agent.tool.name` | Име на инструмента, избран от модела. |
| `heym.agent.tool.call_id` | Идентификатор на tool-call от доставчика, когато е наличен. |
| `heym.agent.tool.source` | Източник на инструмента като `node_tool`, `mcp`, `skill` или `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Етикет на MCP сървър, когато е приложимо. |
| `heym.agent.tool.iteration` | Итерация на Agent tool-loop. |
| `heym.agent.tool.args_bytes` | UTF-8 размер на сериализираните аргументи на инструмента. |
| `heym.agent.tool.result_bytes` | UTF-8 размер на сериализирания резултат от инструмента. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` или `cancelled`. Грешките на инструмента задават статус `ERROR` на span-а. |

Суровите аргументи и резултати на инструментите не се прикачват към spans по подразбиране.

## Безопасност на payload-а на Agent инструментите

Запазените payload-и за observability на Agent се редактират и съкращават в кода (`4096` знака на низ, дълбочина `6`, `32768` общо знака на запис в LLM trace). Общият бюджет на trace-а се разпределя между записите на инструментите, така че ранен голям резултат не може да скрие идентичността и жизнения цикъл на по-късни извиквания. Ограничените метаданни за изтегляне на `_generated_files` се запазват отделно от обемния изход на skill:

- Секции `request` / `response` за инструменти в LLM trace, включително копията `_hitl_pending`, записани в trace store
- Записи `tool_calls` в резултата на Agent, показани в историята на изпълненията
- Събития за резултати от инструменти в Live Debug панела, които използват същия ограничен санитизиран запис

Изпълнението на инструменти на живо, съобщенията за инструменти, обвързани с модела, и състоянието за възобновяване на HITL в паметта (`_hitl_pending.agent_state.messages` / `tool_arguments`) запазват оригиналните стойности, така че възобновяването и точното съвпадение на аргументи продължават да работят. Само запазените копия за observability се санитизират.
## Разпространение на Trace Context

Heym следва стандарта [W3C Trace Context](https://www.w3.org/TR/trace-context/), така че трасетата остават свързани през границите на услугите.

- **Входящи webhooks:** когато входяща заявка носи header `traceparent`, изпълнението на workflow се записва като дъщерно на това трасе. Това свързва изпълненията на Heym с upstream системата, която ги е задействала.
- **Изходящи HTTP заявки:** HTTP node инжектира `traceparent` в заявките, които прави, така че downstream услугите могат да продължат същото трасе.
- **Под-workflows:** изпълнението на под-workflow е дъщерно на node, който го е извикал, като по този начин се запазва йерархията на извикванията в едно трасе.

Trigger-и без входящ context (като Cron, IMAP, RabbitMQ и WebSocket) стартират ново трасе при всяко изпълнение.

## Надеждност

- Бавен или недостъпен collector никога не блокира изпълнението на workflow. Spans се групират в пакети и се експортират във фонов режим.
- Ако инициализацията на tracing се провали (например поради невалиден endpoint), backend-ът записва грешката в лога и продължава с изключен tracing, вместо да не успее да стартира.
- OTLP auth headers се четат само от environment. Те никога не се съхраняват в базата данни и никога не се връщат от status API.

## Свързани

- [Settings](./user-settings.md) – Разделът Observability, който показва статуса на tracing
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Пълна справка за конфигурацията
- [Triggers](./triggers.md) – Как стартират workflow-ите, включително webhooks
- [Execution History](./execution-history.md) – Вградената в Heym история на изпълненията
- [HTTP](../nodes/http-node.md) – Node-ът, който разпространява trace context към downstream извиквания

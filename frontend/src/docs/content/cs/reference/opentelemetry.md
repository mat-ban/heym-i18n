# OpenTelemetry Tracing

Heym může generovat [OpenTelemetry](https://opentelemetry.io/) traces pro každé spuštění workflow, provedení uzlu a volání nástroje Agent. Každé spuštění vytváří kořenový span s podřízenými spany pro jednotlivé uzly a nástroje Agent, takže můžete vidět, který krok selhal, jak dlouho trval, co volal a co se vrátilo. Spany jsou exportovány přes OTLP/HTTP do libovolného kompatibilního backendu, jako je Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic nebo Grafana Cloud.

Tracing je **ve výchozím stavu vypnutý**. Pokud je vypnutý, nevzniká žádná měřitelná režie a nevytvářejí se žádné spany.

## Zapnutí tracingu

Nastavte následující proměnné prostředí na backendu a poté jej restartujte:

Úplný seznam proměnných prostředí naleznete v dokumentaci [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Proměnná | Výchozí hodnota | Popis |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Hlavní přepínač. Pro zapnutí tracingu nastavte na `true`. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Základní OTLP/HTTP endpoint, například `http://collector:4318`. Heym odesílá spany na `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Hlavičky ve formátu `key=value` oddělené čárkou pro autentizaci exportéru, například `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atribut prostředku `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Poměr head samplingu mezi `0.0` a `1.0`, aplikovaný pomocí parent-based sampleru. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Pokud je `true`, připojí ke spanům uzlů zkrácené vstupní a výstupní payloady uzlů. Z důvodu soukromí je ve výchozím stavu vypnuto. |

Minimální příklad:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktivní konfiguraci můžete ověřit v aplikaci v části **Settings → Observability** (otevřete ji ze svého avatara v záhlaví). Tento panel je pouze pro čtení a nikdy nezobrazuje tajné údaje exportéru.

## Co se sleduje

### Kořenový span workflow

Název: `heym.workflow.execute`

| Atribut | Popis |
|-----------|-------------|
| `heym.workflow.id` | UUID workflow. |
| `heym.node.count` | Počet uzlů ve workflow. |
| `heym.workflow.test_mode` | `true` pro testovací spuštění. |
| `heym.sub_workflow.depth` | Hloubka vnoření při vyvolání jako sub-workflow. |
| `heym.workflow.status` | Konečný stav spuštění. Neúspěšné spuštění nastaví stav spanu na `ERROR`. |

### Span uzlu

Název: `heym.node.execute`, vytvořený jako potomek spanu workflow.

| Atribut | Popis |
|-----------|-------------|
| `heym.node.id` | ID uzlu. |
| `heym.node.type` | Typ uzlu, například `agent`, `llm`, `http`. |
| `heym.node.label` | Popisek uzlu zobrazený na plátně. |
| `heym.node.status` | `success` nebo `error`. Chyby nastaví stav spanu na `ERROR`. |
| `heym.node.duration_ms` | Doba provedení uzlu v milisekundách. |
| `heym.llm.model` | Název modelu pro uzly LLM a agent, pokud je k dispozici. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Využití tokenů pro uzly LLM a agent, pokud je k dispozici. |

Spany uzlů se správně vnořují pod span workflow i při paralelním běhu uzlů, protože kontext workflow se propaguje do pracovních vláken.

### Span nástroje Agent

Název: `heym.agent.tool.execute`, vytvořený pod aktivním spanem uzlu Agent.

| Atribut | Popis |
|-----------|-------------|
| `heym.agent.tool.name` | Název nástroje vybraného modelem. |
| `heym.agent.tool.call_id` | ID volání nástroje poskytovatele, pokud je k dispozici. |
| `heym.agent.tool.source` | Zdroj nástroje, například `node_tool`, `mcp`, `skill` nebo `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Popisek MCP serveru, pokud je relevantní. |
| `heym.agent.tool.iteration` | Iterace smyčky nástrojů Agent. |
| `heym.agent.tool.args_bytes` | Velikost serializovaných argumentů nástroje v UTF-8. |
| `heym.agent.tool.result_bytes` | Velikost serializovaného výsledku nástroje v UTF-8. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` nebo `cancelled`. Chyby nástroje nastaví stav spanu na `ERROR`. |

Surové argumenty a výsledky nástrojů se ke spanům ve výchozím stavu nepřipojují.

## Bezpečnost payloadů nástrojů Agent

Ukládané observability payloady Agent jsou v kódu redigovány a zkracovány (`4096` znaků na řetězec, hloubka `6`, `32768` celkových znaků na zápis LLM trace). Celkový rozpočet trace je rozdělen mezi záznamy nástrojů, takže raný velký výsledek nemůže skrýt identitu a stav životního cyklu pozdějších volání. Omezená metadata stahování `_generated_files` jsou vyhrazena odděleně od objemného výstupu skill:

- Sekce nástrojů `request` / `response` v LLM trace, včetně kopií `_hitl_pending` zapisovaných do úložiště trace
- Záznamy `tool_calls` ve výsledku Agent zobrazené v historii spuštění
- Události výsledků nástrojů v Live Debug panelu, které znovu používají stejný omezený sanitizovaný záznam

Živé provádění nástrojů, zprávy nástrojů vázané na model a stav obnovení HITL v paměti (`_hitl_pending.agent_state.messages` / `tool_arguments`) zachovávají původní hodnoty, takže obnovení a párování přesných argumentů stále funguje. Sanitizovány jsou pouze ukládané observability kopie.
## Šíření kontextu trasování

Heym se řídí standardem [W3C Trace Context](https://www.w3.org/TR/trace-context/), aby trasování zůstala propojena napříč hranicemi služeb.

- **Příchozí webhooky:** pokud příchozí požadavek nese hlavičku `traceparent`, je spuštění workflow zaznamenáno jako potomek tohoto trasování. To propojuje spuštění v Heymu s nadřazeným systémem, který je vyvolal.
- **Odchozí HTTP:** uzel HTTP vkládá `traceparent` do požadavků, které odesílá, takže navazující služby mohou pokračovat ve stejném trasování.
- **Podřízené workflow:** spuštění podřízeného workflow je podřazeno uzlu, který jej vyvolal, čímž je v jednom trasování zachována hierarchie volání.

Triggery bez příchozího kontextu (například Cron, IMAP, RabbitMQ a WebSocket) spouštějí pro každé spuštění nové trasování.

## Spolehlivost

- Pomalý nebo nedostupný kolektor nikdy neblokuje provádění workflow. Spany jsou dávkově shromažďovány a exportovány na pozadí.
- Pokud se trasování nepodaří inicializovat (například kvůli chybnému endpointu), backend chybu zaloguje a pokračuje s vypnutým trasováním, místo aby selhal při startu.
- Autorizační hlavičky OTLP se načítají pouze z prostředí. Nikdy nejsou ukládány do databáze a nikdy nejsou vraceny status API.

## Související

- [Nastavení](./user-settings.md) – Karta Observability, která zobrazuje stav trasování
- [Proměnné prostředí](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Úplný přehled konfigurace
- [Triggery](./triggers.md) – Jak se workflow spouštějí, včetně webhooků
- [Historie spuštění](./execution-history.md) – Vestavěný přehled historie jednotlivých spuštění v Heymu
- [HTTP](../nodes/http-node.md) – Uzel, který šíří kontext trasování do navazujících volání

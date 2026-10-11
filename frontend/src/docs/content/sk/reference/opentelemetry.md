# OpenTelemetry Tracing

Heym dokáže generovať [OpenTelemetry](https://opentelemetry.io/) traces pre každé spustenie workflowu, vykonanie uzla a volanie nástroja Agenta. Každé spustenie vytvára koreňový span s podriadenými spanmi pre jednotlivé uzly a nástroje Agenta, takže môžete vidieť, ktorý krok zlyhal, ako dlho trval, čo zavolal a čo sa vrátilo. Spany sa exportujú cez OTLP/HTTP do akéhokoľvek kompatibilného backendu, ako je Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic alebo Grafana Cloud.

Tracing je **predvolene vypnutý**. Keď je vypnutý, nevzniká žiadna merateľná réžia a nevytvárajú sa žiadne spany.

## Zapnutie tracingu

Nastavte nasledujúce premenné prostredia na backende a potom ho reštartujte:

Kompletný zoznam premenných prostredia nájdete v [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Premenná | Predvolená hodnota | Popis |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Hlavný prepínač. Nastavte na `true` pre zapnutie tracingu. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Základný OTLP/HTTP endpoint, napríklad `http://collector:4318`. Heym posiela spany na `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Hlavičky `key=value` oddelené čiarkou pre autentifikáciu exportéra, napríklad `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atribút zdroja `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Pomer head samplingu medzi `0.0` a `1.0`, aplikovaný pomocou parent-based sampleru. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Ak je `true`, pripojí skrátené vstupné a výstupné payloady uzla k spanom uzlov. Predvolene vypnuté z dôvodu ochrany súkromia. |

Minimálny príklad:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Aktívnu konfiguráciu môžete potvrdiť v aplikácii v časti **Settings → Observability** (otvorte ju zo svojho avatara v hlavičke). Tento panel je iba na čítanie a nikdy nezobrazuje tajné údaje exportéra.

## Čo sa trasuje

### Koreňový span workflowu

Názov: `heym.workflow.execute`

| Atribút | Popis |
|-----------|-------------|
| `heym.workflow.id` | UUID workflowu. |
| `heym.node.count` | Počet uzlov vo workflowe. |
| `heym.workflow.test_mode` | `true` pre testovacie spustenia. |
| `heym.sub_workflow.depth` | Hĺbka vnorenia pri vyvolaní ako sub-workflow. |
| `heym.workflow.status` | Konečný stav spustenia. Zlyhané spustenie nastaví stav spanu na `ERROR`. |

### Span uzla

Názov: `heym.node.execute`, vytvorený ako potomok spanu workflowu.

| Atribút | Popis |
|-----------|-------------|
| `heym.node.id` | ID uzla. |
| `heym.node.type` | Typ uzla, napríklad `agent`, `llm`, `http`. |
| `heym.node.label` | Označenie uzla zobrazené na plátne. |
| `heym.node.status` | `success` alebo `error`. Chyby nastavia stav spanu na `ERROR`. |
| `heym.node.duration_ms` | Čas vykonania uzla v milisekundách. |
| `heym.llm.model` | Názov modelu pre uzly LLM a agenta, ak je k dispozícii. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Využitie tokenov pre uzly LLM a agenta, ak je k dispozícii. |

Spany uzlov sa správne vnárajú pod span workflowu aj vtedy, keď uzly bežia paralelne, pretože kontext workflowu sa propaguje do pracovných vlákien.

### Span nástroja Agenta

Názov: `heym.agent.tool.execute`, vytvorený pod aktívnym spanom uzla Agenta.

| Atribút | Popis |
|-----------|-------------|
| `heym.agent.tool.name` | Názov nástroja vybraného modelom. |
| `heym.agent.tool.call_id` | ID volania nástroja od poskytovateľa, ak je k dispozícii. |
| `heym.agent.tool.source` | Zdroj nástroja, ako napríklad `node_tool`, `mcp`, `skill` alebo `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Označenie MCP servera, ak je relevantné. |
| `heym.agent.tool.iteration` | Iterácia slučky nástrojov Agenta. |
| `heym.agent.tool.args_bytes` | Veľkosť serializovaných argumentov nástroja v UTF-8. |
| `heym.agent.tool.result_bytes` | Veľkosť serializovaného výsledku nástroja v UTF-8. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` alebo `cancelled`. Chyby nástroja nastavia stav spanu na `ERROR`. |

Surové argumenty a výsledky nástrojov sa k spanom predvolene nepripájajú.

## Bezpečnosť payloadov nástrojov Agenta

Uložené observability payloady Agenta sú v kóde redigované a skrátené (`4096` znakov na reťazec, hĺbka `6`, `32768` celkových znakov na jeden zápis LLM trace). Celkový rozpočet trace je rozdelený medzi záznamy nástrojov, takže skorší veľký výsledok nemôže skryť identitu a stav životného cyklu neskorších volaní. Obmedzené metadáta sťahovania `_generated_files` sú vyhradené oddelene od objemného výstupu skillu:

- Sekcie nástrojov `request` / `response` v LLM trace, vrátane kópií `_hitl_pending` zapisovaných do úložiska trace
- Záznamy `tool_calls` vo výsledku Agenta zobrazené v histórii spustení
- Udalosti výsledkov nástrojov v paneli Live Debug, ktoré opätovne používajú rovnaký obmedzený sanitizovaný záznam

Živé vykonávanie nástrojov, správy nástrojov viazané na model a stav obnovenia HITL v pamäti (`_hitl_pending.agent_state.messages` / `tool_arguments`) zachovávajú pôvodné hodnoty, takže obnovenie a presné párovanie argumentov stále fungujú. Sanitizujú sa iba uložené observability kópie.
## Šírenie kontextu Trace

Heym dodržiava štandard [W3C Trace Context](https://www.w3.org/TR/trace-context/), aby trace zostali prepojené naprieč hranicami služieb.

- **Prichádzajúce webhooky:** ak prichádzajúca požiadavka obsahuje hlavičku `traceparent`, spustenie workflow sa zaznamená ako potomok daného trace. Tým sa spustenia v HeyMe prepoja s nadradeným systémom, ktorý ich vyvolal.
- **Odchádzajúce HTTP:** uzol HTTP vkladá `traceparent` do odosielaných požiadaviek, aby downstream služby mohli pokračovať v tom istom trace.
- **Pod-workflowy:** spustenie pod-workflow je podradené uzlu, ktorý ho vyvolal, čím sa v rámci jedného trace zachová hierarchia volaní.

Trigger bez prichádzajúceho kontextu (napríklad Cron, IMAP, RabbitMQ a WebSocket) spúšťa pre každé spustenie nový trace.

## Spoľahlivosť

- Pomalý alebo nedostupný kolektor nikdy neblokuje vykonávanie workflow. Spany sa dávkujú a exportujú na pozadí.
- Ak sa tracing nepodarí inicializovať (napríklad kvôli nesprávnemu endpointu), backend chybu zaznamená do logu a pokračuje s vypnutým tracingom, namiesto toho aby zlyhalo spustenie.
- Autorizačné hlavičky OTLP sa čítajú výhradne z prostredia. Nikdy sa neukladajú do databázy a nikdy ich nevracia status API.

## Súvisiace

- [Nastavenia](./user-settings.md) – Karta Observability, ktorá zobrazuje stav tracingu
- [Premenné prostredia](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Kompletný prehľad konfigurácie
- [Triggers](./triggers.md) – Ako sa workflowy spúšťajú, vrátane webhookov
- [História spustení](./execution-history.md) – Vstavané zobrazenie histórie jednotlivých spustení v HeyMe
- [HTTP](../nodes/http-node.md) – Uzol, ktorý šíri kontext trace do downstream volaní

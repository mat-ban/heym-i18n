# OpenTelemetry Stebėjimas

Heym gali generuoti [OpenTelemetry](https://opentelemetry.io/) stebėjimo duomenis kiekvienam workflow vykdymui, mazgo vykdymui ir Agent įrankio iškvietimui. Kiekvienas vykdymas sukuria šaknies spaną su vaikų span'ais kiekvienam mazgui ir Agent įrankiui, todėl galite matyti, kuris žingsnis nepavyko, kiek laiko užtruko, ką jis iškvietė ir kas grįžo. Span'ai eksportuojami per OTLP/HTTP į bet kurį suderinamą backend'ą, tokį kaip Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic arba Grafana Cloud.

Stebėjimas yra **išjungtas pagal numatytuosius nustatymus**. Kai jis yra išjungtas, nėra matuojamo papildomo apkrovimo ir span'ai nėra kuriami.

## Stebėjimo Įjungimas

Nustatykite šiuos aplinkos kintamuosius backend'e, tada jį perkraukite:

Visą aplinkos kintamųjų sąrašą rasite [Aplinkos Kintamuosiuose](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Kintamasis | Numatytoji reikšmė | Aprašymas |
|------------|--------------------|-----------|
| `HEYM_OTEL_ENABLED` | `false` | Pagrindinis jungiklis. Nustatykite į `true`, kad įjungtumėte stebėjimą. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP pagrindinis endpoint'as, pavyzdžiui, `http://collector:4318`. Heym siunčia span'us į `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Kableliais atskirti `key=value` antraštės eksportuotojo autentifikacijai, pavyzdžiui, `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` išteklių atributas. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Pagrindinis mėginių ėmimo santykis tarp `0.0` ir `1.0`, taikomas su tėviniu mėginių ėmėju. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Kai `true`, pridėti sutrumpintus mazgo įvesties ir išvesties payload'us prie mazgo span'ų. Pagal numatytuosius nustatymus išjungta dėl privatumo. |

Minimalus pavyzdys:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Galite patvirtinti aktyvią konfigūraciją programoje skiltyje **Nustatymai → Stebėjimas** (atidarykite ją iš savo avataro antraštėje). Šiame skydelyje yra tik skaitymo režimas ir niekada nerodomi eksportuotojo slaptažodžiai.

## Kas Stebima

### Workflow šaknies spanas

Pavadinimas: `heym.workflow.execute`

| Atributas | Aprašymas |
|-----------|-----------|
| `heym.workflow.id` | Workflow UUID. |
| `heym.node.count` | Mazgų skaičius workflow'e. |
| `heym.workflow.test_mode` | `true` testiniams vykdymams. |
| `heym.sub_workflow.depth` | Įterpimo gylis, kai iškviečiamas kaip sub-workflow. |
| `heym.workflow.status` | Galutinė vykdymo būsena. Nepavykęs vykdymas nustato span'o būseną į `ERROR`. |

### Mazgo spanas

Pavadinimas: `heym.node.execute`, sukurtas kaip workflow span'o vaikas.

| Atributas | Aprašymas |
|-----------|-----------|
| `heym.node.id` | Mazgo id. |
| `heym.node.type` | Mazgo tipas, pavyzdžiui, `agent`, `llm`, `http`. |
| `heym.node.label` | Mazgo etiketė, rodoma drobėje. |
| `heym.node.status` | `success` arba `error`. Klaidos nustato span'o būseną į `ERROR`. |
| `heym.node.duration_ms` | Mazgo vykdymo laikas milisekundėmis. |
| `heym.llm.model` | Modelio pavadinimas LLM ir agentų mazgams, kai jis yra. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token'ų naudojimas LLM ir agentų mazgams, kai jis yra. |

Mazgo span'ai teisingai įsiterpia po workflow span'u, net kai mazgai vykdomi lygiagrečiai, nes workflow kontekstas perduodamas į darbuotojų gijas.

### Agent įrankio spanas

Pavadinimas: `heym.agent.tool.execute`, sukurtas aktyvaus Agent mazgo span'e.

| Atributas | Aprašymas |
|-----------|-----------|
| `heym.agent.tool.name` | Įrankio pavadinimas, pasirinktas modelio. |
| `heym.agent.tool.call_id` | Teikėjo įrankio iškvietimo id, kai jis yra. |
| `heym.agent.tool.source` | Įrankio šaltinis, pavyzdžiui, `node_tool`, `mcp`, `skill`, arba `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP serverio etiketė, kai taikoma. |
| `heym.agent.tool.iteration` | Agent įrankio ciklo iteracija. |
| `heym.agent.tool.args_bytes` | UTF-8 serializuotų įrankio argumentų dydis baitais. |
| `heym.agent.tool.result_bytes` | UTF-8 serializuoto įrankio rezultato dydis baitais. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout`, arba `cancelled`. Įrankio klaidos nustato span'o būseną į `ERROR`. |

Brutalūs įrankio argumentai ir rezultatai pagal numatytuosius nustatymus nėra pridedami prie span'ų.

## Agent įrankio payload saugumas

Išsaugoti Agent stebėjimo payload'ai yra redaguojami ir sutrumpinami kode (`4096` simbolių kiekvienam stringui, gylis `6`, `32768` bendras simbolių kiekis kiekvienam LLM stebėjimo įrašui). Bendras stebėjimo biudžetas yra padalintas tarp įrankių įrašų, todėl ankstyvas didelis rezultatas negali paslėpti vėlesnių iškvietimų tapatybės ir gyvavimo ciklo būsenos. Apriboti `_generated_files` atsisiuntimo metaduomenys yra rezervuoti atskirai nuo didelių įgūdžių išvesties:

- LLM stebėjimo `request` / `response` įrankių sekcijos, įskaitant `_hitl_pending` kopijas, įrašytas į stebėjimo saugyklą
- Agent rezultatų `tool_calls` įrašai, rodomi vykdymo istorijoje
- Gyvo derinimo skydelio įrankių rezultatų įvykiai, kurie naudoja tą patį apribotą sanizuotą įrašą

Gyvas įrankių vykdymas, modelio susieti įrankių pranešimai ir atmintyje esanti HITL tęstinumo būsena (`_hitl_pending.agent_state.messages` / `tool_arguments`) išlaiko originalias vertes, todėl tęstinumas ir tikslus argumentų atitikimas vis dar veikia. Tik saugomi stebėjimo kopijos yra sanizuotos.
## Sekimo Konteksto Perdavimo

Heym laikosi [W3C Trace Context](https://www.w3.org/TR/trace-context/) standarto, todėl sekimai išlieka susiję per paslaugų ribas.

- **Įeinantys webhook'ai:** kai atvykstantis užklausos prašymas turi `traceparent` antraštę, workflow vykdymas įrašomas kaip to sekimo vaikas. Tai susieja Heym vykdymus su aukščiau esančia sistema, kuri juos sukėlė.
- **Išeinantis HTTP:** HTTP mazgas įterpia `traceparent` į užklausas, kurias jis atlieka, kad žemyn srauto paslaugos galėtų tęsti tą patį sekimą.
- **Sub-workflows:** sub-workflow vykdymas yra tėvinis mazgui, kuris jį iškvietė, išlaikant skambučių hierarchiją viename sekime.

Triggeriai be įeinančio konteksto (tokie kaip Cron, IMAP, RabbitMQ ir WebSocket) pradeda naują sekimą kiekvienam vykdymui.

## Patikimumas

- Lėtas arba nepasiekiamas kolektorius niekada nesustabdo workflow vykdymo. Span'ai yra grupuojami ir eksportuojami fone.
- Jei sekimas nepavyksta inicializuoti (pavyzdžiui, neteisingas endpoint'as), backend'as užfiksuoja klaidą ir tęsia sekimą išjungtą, o ne nesugeba pradėti.
- OTLP autentifikavimo antraštės skaitomos tik iš aplinkos. Jos niekada nėra saugomos duomenų bazėje ir niekada negrąžinamos per status API.

## Susiję

- [Nustatymai](./user-settings.md) – Stebėjimo skirtukas, rodantis sekimo būseną
- [Aplinkos Kintamieji](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilnas konfigūracijos šaltinis
- [Triggeriai](./triggers.md) – Kaip pradedami workflows, įskaitant webhook'us
- [Vykdymo Istorija](./execution-history.md) – Heym integruota vykdymo istorijos peržiūra
- [HTTP](../nodes/http-node.md) – Mazgas, kuris perduoda sekimo kontekstą žemyn srauto skambučiams

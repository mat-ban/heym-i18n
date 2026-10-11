# OpenTelemetry Izsekošana

Heym var izsūtīt [OpenTelemetry](https://opentelemetry.io/) izsekošanas datus par katru workflow izpildi, mezgla izpildi un aģenta rīka izsaukumu. Katrs izpildes gadījums rada saknes span, kuram ir bērnu span katram mezglam un aģenta rīkam, tādējādi Jūs varat redzēt, kurš solis neizdevās, cik ilgi tas ilga, ko tas izsauca un kas tika atgriezts. Spans tiek eksportēts caur OTLP/HTTP uz jebkuru saderīgu aizmuguri, piemēram, Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic vai Grafana Cloud.

Izsekošana ir **izslēgta pēc noklusējuma**. Kad tā ir izslēgta, nav izmērāma pārslodze un netiek radīti span.

## Izsekošanas Iespējošana

Iestatiet sekojošās vides mainīgās aizmugurē, pēc tam restartējiet to:

Pilnu vides mainīgo sarakstu skatiet [Vides Mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Mainīgais | Noklusējums | Apraksts |
|-----------|-------------|----------|
| `HEYM_OTEL_ENABLED` | `false` | Galvenais slēdzis. Iestatiet uz `true`, lai ieslēgtu izsekošanu. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP bāzes galapunkts, piemēram, `http://collector:4318`. Heym nosūta span uz `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Komatā atdalīti `key=value` galvene eksportētāja autentifikācijai, piemēram, `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` resursa atribūts. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Galvas paraugu attiecība starp `0.0` un `1.0`, kas tiek piemērota ar vecāku balstītu paraugu ņēmēju. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Kad `true`, pievieno saīsinātus mezgla ievades un izvades payloads mezgla span. Noklusējuma izslēgts privātuma dēļ. |

Minimālais piemērs:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Jūs varat apstiprināt aktīvo konfigurāciju lietotnē sadaļā **Iestatījumi → Novērojamība** (atveriet to no sava avatāra galvenē). Šī paneļa saturs ir tikai lasāms un nekad nerāda eksportētāja slepenos datus.

## Kas Tiek Izsekots

### Workflow saknes span

Nosaukums: `heym.workflow.execute`

| Atribūts | Apraksts |
|----------|----------|
| `heym.workflow.id` | Workflow UUID. |
| `heym.node.count` | Mezglu skaits workflow. |
| `heym.workflow.test_mode` | `true` testēšanas izpildēm. |
| `heym.sub_workflow.depth` | Iekļaušanas dziļums, kad tiek izsaukts kā apakš-workflow. |
| `heym.workflow.status` | Galīgais izpildes statuss. Neizdevusies izpilde iestata span statusu uz `ERROR`. |

### Mezgla span

Nosaukums: `heym.node.execute`, izveidots kā bērns workflow span.

| Atribūts | Apraksts |
|----------|----------|
| `heym.node.id` | Mezgla ID. |
| `heym.node.type` | Mezgla tips, piemēram, `agent`, `llm`, `http`. |
| `heym.node.label` | Mezgla etiķete, kas tiek rādīta kanvā. |
| `heym.node.status` | `success` vai `error`. Kļūdas iestata span statusu uz `ERROR`. |
| `heym.node.duration_ms` | Mezgla izpildes laiks milisekundēs. |
| `heym.llm.model` | Modeļa nosaukums LLM un aģenta mezgliem, kad tas ir pieejams. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Tokenu izmantošana LLM un aģenta mezgliem, kad tas ir pieejams. |

Mezglu span pareizi iestājas zem workflow span pat tad, ja mezgli tiek izpildīti paralēli, jo workflow konteksts tiek nodots darba pavedieniem.

### Aģenta rīka span

Nosaukums: `heym.agent.tool.execute`, izveidots aktīvā aģenta mezgla span.

| Atribūts | Apraksts |
|----------|----------|
| `heym.agent.tool.name` | Rīka nosaukums, ko izvēlējies modelis. |
| `heym.agent.tool.call_id` | Piegādātāja rīka izsaukuma ID, kad tas ir pieejams. |
| `heym.agent.tool.source` | Rīka avots, piemēram, `node_tool`, `mcp`, `skill` vai `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP servera etiķete, kad tas ir piemērojams. |
| `heym.agent.tool.iteration` | Aģenta rīka cikla iterācija. |
| `heym.agent.tool.args_bytes` | UTF-8 sērijveida rīka argumentu izmērs. |
| `heym.agent.tool.result_bytes` | UTF-8 sērijveida rīka rezultāta izmērs. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` vai `cancelled`. Rīka kļūdas iestata span statusu uz `ERROR`. |

Nekādas izejas rīka argumenti un rezultāti pēc noklusējuma netiek pievienoti span.

## Aģenta rīka payload drošība

Saglabātie aģenta novērojamības payload tiek rediģēti un saīsināti kodā (`4096` simboli katrā virknē, dziļums `6`, `32768` kopējie simboli katram LLM izsekošanas ierakstam). Kopējais izsekošanas budžets tiek sadalīts starp rīku ierakstiem, tādējādi agrs liels rezultāts nevar slēpt vēlākos izsaukumus un to dzīves cikla statusu. Ierobežotā `_generated_files` lejupielādes metadati tiek rezervēti atsevišķi no apjomīgiem prasmju rezultātiem:

- LLM izsekošanas `request` / `response` rīka sekcijas, tostarp `_hitl_pending` kopijas, kas rakstītas izsekošanas krātuvē
- Aģenta rezultātu `tool_calls` ieraksti, kas tiek rādīti izpildes vēsturē
- Tiešsaistes Debug paneļa rīka rezultātu notikumi, kas atkārtoti izmanto to pašu ierobežoto sanitizēto ierakstu

Tiešsaistes rīka izpilde, modeļa saistītie rīka ziņojumi un atmiņā esošais HITL atsākšanas stāvoklis (`_hitl_pending.agent_state.messages` / `tool_arguments`) saglabā sākotnējās vērtības, tādējādi atsākšana un precīza argumentu saskaņošana joprojām darbojas. Tikai uzglabātās novērojamības kopijas tiek sanitizētas.
## Izsekošanas konteksta pārsūtīšana

Heym ievēro [W3C Trace Context](https://www.w3.org/TR/trace-context/) standartu, lai izsekošanas dati paliktu savienoti pāri pakalpojumu robežām.

- **Ienākošie webhook:** kad ienākošais pieprasījums satur `traceparent` galveni, workflow izpilde tiek reģistrēta kā šī izsekošanas bērns. Tas savieno Heym izpildes ar augšupejošo sistēmu, kas tās izsauca.
- **Izejošais HTTP:** HTTP mezgls injicē `traceparent` pieprasījumos, ko tas veic, lai lejupvērstie pakalpojumi varētu turpināt to pašu izsekošanu.
- **Apakš-workflows:** apakš-workflow izpilde ir saistīta ar mezglu, kas to izsauca, saglabājot izsaukumu hierarhiju vienā izsekošanā.

Triggeri bez ienākošā konteksta (piemēram, Cron, IMAP, RabbitMQ un WebSocket) sāk jaunu izsekošanu katrai izpildei.

## Uzticamība

- Lēns vai nepieejams kolektors nekad nebloķē workflow izpildi. Izmēri tiek grupēti un eksportēti fona režīmā.
- Ja izsekošana neizdodas inicializēt (piemēram, slikts endpoint), aizmugurējā sistēma reģistrē kļūdu un turpina ar izsekošanu atslēgtu, nevis neizdodas sākt.
- OTLP autentifikācijas galvenes tiek lasītas tikai no vides. Tās nekad netiek glabātas datu bāzē un nekad netiek atgrieztas ar statusa API.

## Saistītie

- [Iestatījumi](./user-settings.md) – Novērojamības cilne, kas rāda izsekošanas statusu
- [Vides mainīgie](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Pilna konfigurācijas atsauce
- [Triggeri](./triggers.md) – Kā workflow sākas, tostarp webhook
- [Izpildes vēsture](./execution-history.md) – Heym iebūvētā izpildes vēstures skatījums
- [HTTP](../nodes/http-node.md) – Mezgls, kas pārsūta izsekošanas kontekstu uz lejupvērstajiem izsaukumiem

# OpenTelemetry Praćenje

Heym može emitirati [OpenTelemetry](https://opentelemetry.io/) tragove za svako izvršavanje workflow-a, izvršavanje čvora i poziv alata Agenta. Svako izvršavanje proizvodi korijenski span s podspanovima za svaki čvor i alat Agenta, tako da možete vidjeti koji je korak neuspješan, koliko je trajao, što je pozvano i što se vratilo. Spans se izvoze putem OTLP/HTTP na bilo koji kompatibilni backend kao što su Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ili Grafana Cloud.

Praćenje je **onemogućeno prema zadanim postavkama**. Kada je isključeno, nema mjerljivog preopterećenja i ne stvaraju se spans.

## Omogućavanje Praćenja

Postavite sljedeće varijable okruženja na backendu, a zatim ga ponovno pokrenite:

Za potpuni popis varijabli okruženja, pogledajte [Varijable Okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Varijabla | Zadano | Opis |
|-----------|--------|------|
| `HEYM_OTEL_ENABLED` | `false` | Glavni prekidač. Postavite na `true` za uključivanje praćenja. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP osnovna točka, na primjer `http://collector:4318`. Heym objavljuje spans na `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Zareza odvojeni `key=value` zaglavlja za autentifikaciju izvoznika, na primjer `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atribut resursa `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Omjer uzorkovanja između `0.0` i `1.0`, primijenjen s uzorkivačem temeljenim na roditelju. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Kada je `true`, pridružuje skraćene ulazne i izlazne payload-e čvorovima. Isključeno prema zadanim postavkama radi privatnosti. |

Minimalni primjer:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Možete potvrditi aktivnu konfiguraciju u aplikaciji pod **Postavke → Promatranje** (otvorite iz svog avatara u zaglavlju). Taj panel je samo za čitanje i nikada ne prikazuje tajne izvoznika.

## Što se Praći

### Korijenski span workflow-a

Ime: `heym.workflow.execute`

| Atribut | Opis |
|---------|------|
| `heym.workflow.id` | UUID workflow-a. |
| `heym.node.count` | Broj čvorova u workflow-u. |
| `heym.workflow.test_mode` | `true` za testna izvršavanja. |
| `heym.sub_workflow.depth` | Dubina ugniježdenja kada se poziva kao pod-workflow. |
| `heym.workflow.status` | Konačni status izvršavanja. Neuspješno izvršavanje postavlja status spana na `ERROR`. |

### Span čvora

Ime: `heym.node.execute`, stvoren kao podspan korijenskog spana workflow-a.

| Atribut | Opis |
|---------|------|
| `heym.node.id` | ID čvora. |
| `heym.node.type` | Tip čvora, na primjer `agent`, `llm`, `http`. |
| `heym.node.label` | Oznaka čvora prikazana na platnu. |
| `heym.node.status` | `success` ili `error`. Greške postavljaju status spana na `ERROR`. |
| `heym.node.duration_ms` | Vrijeme izvršavanja čvora u milisekundama. |
| `heym.llm.model` | Ime modela za LLM i čvorove agenta, kada je dostupno. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Korištenje tokena za LLM i čvorove agenta, kada je dostupno. |

Podspanovi čvora ispravno se ugniježde pod span workflow-a čak i kada se čvorovi izvršavaju paralelno, jer se kontekst workflow-a prenosi u radne niti.

### Span alata Agenta

Ime: `heym.agent.tool.execute`, stvoren pod aktivnim spanom čvora Agenta.

| Atribut | Opis |
|---------|------|
| `heym.agent.tool.name` | Ime alata odabrano od strane modela. |
| `heym.agent.tool.call_id` | ID poziva alata pružatelja, kada je dostupno. |
| `heym.agent.tool.source` | Izvor alata kao što su `node_tool`, `mcp`, `skill` ili `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Oznaka MCP poslužitelja, kada je primjenjivo. |
| `heym.agent.tool.iteration` | Iteracija petlje alata Agenta. |
| `heym.agent.tool.args_bytes` | UTF-8 veličina serijaliziranih argumenata alata. |
| `heym.agent.tool.result_bytes` | UTF-8 veličina serijaliziranog rezultata alata. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ili `cancelled`. Greške alata postavljaju status spana na `ERROR`. |

Sirovi argumenti alata i rezultati prema zadanim postavkama nisu pridruženi spanovima.

## Sigurnost payload-a alata Agenta

Persistirani payload-i promatranja Agenta su redigirani i skraćeni u kodu (`4096` znakova po stringu, dubina `6`, `32768` ukupno znakova po LLM trag pisanju). Ukupni proračun tragova dijeli se među zapisima alata tako da rani veliki rezultat ne može sakriti identitet i status životnog ciklusa kasnijih poziva. Ograničeni `_generated_files` metapodaci preuzimanja rezervirani su odvojeno od obimnog izlaza vještine:

- LLM trag `request` / `response` dijelovi alata, uključujući `_hitl_pending` kopije zapisane u skladištu tragova
- Zapisnici rezultata Agenta `tool_calls` prikazani u povijesti izvršavanja
- Događaji rezultata alata u Live Debug panelu, koji ponovno koriste isti ograničeni sanitizirani zapis

Živo izvršavanje alata, poruke alata vezane uz model i stanje nastavka HITL u memoriji (`_hitl_pending.agent_state.messages` / `tool_arguments`) zadržavaju izvorne vrijednosti tako da nastavak i točno podudaranje argumenata i dalje funkcioniraju. Samo pohranjene kopije promatranja su sanitizirane.
## Propagacija Konteksta Traganja

Heym slijedi [W3C Trace Context](https://www.w3.org/TR/trace-context/) standard kako bi tragovi ostali povezani preko granica usluga.

- **Ulazni webhookovi:** kada dolazni zahtjev nosi `traceparent` zaglavlje, izvršavanje workflow-a se bilježi kao dijete tog traga. Ovo povezuje Heym izvršavanja s uzvodnim sustavom koji ih je pokrenuo.
- **Izlazni HTTP:** HTTP čvor umetne `traceparent` u zahtjeve koje šalje, tako da nizvodne usluge mogu nastaviti isti trag.
- **Pod-workflows:** izvršavanje pod-workflow-a je povezano s čvorom koji ga je pozvao, čime se očuva hijerarhija poziva u jednom tragu.

Okidači bez ulaznog konteksta (kao što su Cron, IMAP, RabbitMQ i WebSocket) započinju novi trag za svako izvršavanje.

## Pouzdanost

- Spori ili nedostupni kolektori nikada ne blokiraju izvršavanje workflow-a. Opsezi se grupiraju i izvoze u pozadini.
- Ako inicijalizacija traganja ne uspije (na primjer, zbog lošeg endpointa), backend bilježi grešku i nastavlja s onemogućenim traganje umjesto da ne uspije pokrenuti.
- OTLP autentifikacijski zaglavlja se čitaju isključivo iz okruženja. Nikada se ne pohranjuju u bazu podataka i nikada se ne vraćaju putem status API-ja.

## Povezano

- [Postavke](./user-settings.md) – Kartica za promatranje koja prikazuje status traganja
- [Varijable Okruženja](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Potpuna referenca za konfiguraciju
- [Okidači](./triggers.md) – Kako se workflow-i pokreću, uključujući webhookove
- [Povijest Izvršavanja](./execution-history.md) – Ugrađeni prikaz povijesti po izvršavanju u Heymu
- [HTTP](../nodes/http-node.md) – Čvor koji propagira kontekst traganja na nizvodne pozive

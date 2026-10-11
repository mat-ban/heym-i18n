# OpenTelemetry Tracing

Heym poate emite urme [OpenTelemetry](https://opentelemetry.io/) pentru fiecare rulare de workflow, execuție de nod și invocare de instrument a Agentului. Fiecare rulare produce un span rădăcină cu spanuri copil pentru fiecare nod și instrument al Agentului, astfel încât să puteți vedea care pas a eșuat, cât a durat, ce a apelat și ce a returnat. Spanurile sunt exportate prin OTLP/HTTP către orice backend compatibil, precum Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic sau Grafana Cloud.

Tracing-ul este **dezactivat implicit**. Când este oprit, nu există suprasarcină măsurabilă și nu sunt create spanuri.

## Activarea Tracing-ului

Setați următoarele variabile de mediu pe backend, apoi reporniți-l:

Pentru lista completă a variabilelor de mediu, consultați [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabilă | Implicit | Descriere |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Comutator principal. Setați la `true` pentru a activa tracing-ul. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint de bază OTLP/HTTP, de exemplu `http://collector:4318`. Heym trimite spanurile către `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Headere `key=value` separate prin virgulă pentru autentificarea exportatorului, de exemplu `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Atributul de resursă `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Rata de eșantionare head între `0.0` și `1.0`, aplicată cu un sampler bazat pe părinte. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Când este `true`, atașează payload-uri trunchiate de intrare și ieșire ale nodului la spanurile nodului. Dezactivat implicit pentru confidențialitate. |

Exemplu minimal:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Puteți confirma configurația activă în aplicație la **Settings → Observability** (deschideți-o din avatarul dumneavoastră din antet). Acel panou este read-only și nu afișează niciodată secretele exportatorului.

## Ce este urmărit

### Span rădăcină de workflow

Nume: `heym.workflow.execute`

| Atribut | Descriere |
|-----------|-------------|
| `heym.workflow.id` | UUID-ul workflow-ului. |
| `heym.node.count` | Numărul de noduri din workflow. |
| `heym.workflow.test_mode` | `true` pentru rulările de test. |
| `heym.sub_workflow.depth` | Adâncimea de imbricare când este invocat ca sub-workflow. |
| `heym.workflow.status` | Statusul final al rulării. O rulare eșuată setează statusul spanului la `ERROR`. |

### Span de nod

Nume: `heym.node.execute`, creat ca fiu al spanului de workflow.

| Atribut | Descriere |
|-----------|-------------|
| `heym.node.id` | Id-ul nodului. |
| `heym.node.type` | Tipul nodului, de exemplu `agent`, `llm`, `http`. |
| `heym.node.label` | Eticheta nodului afișată pe canvas. |
| `heym.node.status` | `success` sau `error`. Erorile setează statusul spanului la `ERROR`. |
| `heym.node.duration_ms` | Timpul de execuție al nodului în milisecunde. |
| `heym.llm.model` | Numele modelului pentru nodurile LLM și agent, când este disponibil. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Utilizarea de tokenuri pentru nodurile LLM și agent, când este disponibilă. |

Spanurile de nod se imbrică corect sub spanul de workflow chiar și atunci când nodurile rulează în paralel, deoarece contextul workflow-ului este propagat în thread-urile worker.

### Span de instrument al Agentului

Nume: `heym.agent.tool.execute`, creat sub spanul nodului Agent activ.

| Atribut | Descriere |
|-----------|-------------|
| `heym.agent.tool.name` | Numele instrumentului selectat de model. |
| `heym.agent.tool.call_id` | Id-ul apelului de instrument al furnizorului, când este disponibil. |
| `heym.agent.tool.source` | Sursa instrumentului, precum `node_tool`, `mcp`, `skill` sau `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Eticheta serverului MCP, când este aplicabilă. |
| `heym.agent.tool.iteration` | Iterarea buclei de instrumente a Agentului. |
| `heym.agent.tool.args_bytes` | Dimensiunea UTF-8 a argumentelor serializate ale instrumentului. |
| `heym.agent.tool.result_bytes` | Dimensiunea UTF-8 a rezultatului serializat al instrumentului. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` sau `cancelled`. Erorile instrumentului setează statusul spanului la `ERROR`. |

Argumentele și rezultatele brute ale instrumentelor nu sunt atașate la spanuri implicit.

## Siguranța payload-urilor instrumentelor Agentului

Payload-urile persistate de observabilitate ale Agentului sunt redactate și trunchiate în cod (`4096` caractere per șir, adâncime `6`, `32768` caractere totale per scriere de urmă LLM). Bugetul total al urmei este împărțit între înregistrările de instrumente, astfel încât un rezultat mare timpuriu să nu poată ascunde identitatea și statusul ciclului de viață al apelurilor ulterioare. Metadatele limitate de descărcare `_generated_files` sunt rezervate separat față de ieșirea voluminoasă a skill-ului:

- Secțiunile de instrumente `request` / `response` ale urmei LLM, inclusiv copiile `_hitl_pending` scrise în depozitul de urme
- Înregistrările `tool_calls` ale rezultatului Agentului afișate în istoricul execuțiilor
- Evenimentele de rezultat al instrumentului din panoul Live Debug, care refolosesc aceeași înregistrare sanitizată limitată

Execuția live a instrumentelor, mesajele de instrumente legate de model și starea de reluare HITL din memorie (`_hitl_pending.agent_state.messages` / `tool_arguments`) păstrează valorile originale, astfel încât reluarea și potrivirea exactă a argumentelor să funcționeze în continuare. Doar copiile de observabilitate stocate sunt sanitizate.
## Propagarea contextului de urmărire

Heym respectă standardul [W3C Trace Context](https://www.w3.org/TR/trace-context/) pentru ca urmăririle să rămână conectate dincolo de granițele serviciilor.

- **Webhook-uri de intrare:** atunci când o cerere primită conține un header `traceparent`, execuția workflow-ului este înregistrată ca fiu al acelei urmăriri. Astfel, execuțiile Heym sunt legate de sistemul upstream care le-a declanșat.
- **HTTP de ieșire:** nodul HTTP injectează `traceparent` în cererile pe care le efectuează, astfel încât serviciile din aval să poată continua aceeași urmărire.
- **Sub-workflow-uri:** execuția unui sub-workflow este înregistrată ca fiu al nodului care l-a invocat, păstrând ierarhia apelurilor într-o singură urmărire.

Trigger-ele fără un context de intrare (precum Cron, IMAP, RabbitMQ și WebSocket) pornesc o urmărire nouă pentru fiecare execuție.

## Fiabilitate

- Un collector lent sau inaccesibil nu blochează niciodată execuția workflow-ului. Span-urile sunt grupate în batch-uri și exportate în fundal.
- Dacă inițializarea urmăririi eșuează (de exemplu, din cauza unui endpoint invalid), backend-ul înregistrează eroarea și continuă cu urmărirea dezactivată, în loc să nu pornească.
- Header-ele de autentificare OTLP sunt citite exclusiv din variabilele de mediu. Acestea nu sunt niciodată stocate în baza de date și nu sunt niciodată returnate de API-ul de status.

## Resurse conexe

- [Setări](./user-settings.md) – Filamentul Observability care afișează starea urmăririi
- [Variabile de mediu](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referință completă de configurare
- [Trigger-e](./triggers.md) – Cum pornesc workflow-urile, inclusiv webhook-urile
- [Istoricul execuțiilor](./execution-history.md) – Vizualizarea integrată Heym a istoricului per execuție
- [HTTP](../nodes/http-node.md) – Nodul care propagă contextul de urmărire către apelurile din aval

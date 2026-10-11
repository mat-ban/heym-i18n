# OpenTelemetry Tracing

Heym kan udsende [OpenTelemetry](https://opentelemetry.io/)-spor for hver workflow-kørsel, node-udførelse og Agent-værktøjsaktivering. Hver kørsel genererer en rod-span med underliggende spans per node og Agent-værktøj, hvilket giver mulighed for at se hvilket trin der fejlede, hvor lang tid det tog, hvad der blev kaldt, og hvad der returnerede. Spans eksporteres via OTLP/HTTP til enhver kompatibel backend som Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic eller Grafana Cloud.

Tracing er **deaktiveret som standard**. Når funktionen er slået fra, er der ingen mærkbar overhead, og der genereres ingen spans.

## Aktivering af Tracing

Følgende miljøvariabler skal angives på backenden, hvorefter den skal genstartes:

For den komplette liste over miljøvariabler, se [Miljøvariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Standardværdi | Beskrivelse |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Hovedkontakt. Sæt til `true` for at aktivere tracing. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP-basis-endpoint, f.eks. `http://collector:4318`. Heym sender spans til `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Kommaseparerede `key=value`-headers til eksportør-autentificering, f.eks. `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name`-ressourceattributten. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Head-samplingsratio mellem `0.0` og `1.0`, anvendt med en forælderbaseret sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Når `true`, vedhæftes trunkerede node-input- og output-payloads til node-spans. Slået fra som standard af hensyn til privatliv. |

Minimalt eksempel:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Den aktive konfiguration kan bekræftes i appen under **Indstillinger → Observability** (tilgås via avataren i headeren). Panelet er skrivebeskyttet og viser aldrig eksportørhemmeligheder.

## Hvad der spores

### Workflow rod-span

Navn: `heym.workflow.execute`

| Attribut | Beskrivelse |
|-----------|-------------|
| `heym.workflow.id` | Workflow-UUID'en. |
| `heym.node.count` | Antal noder i workflowet. |
| `heym.workflow.test_mode` | `true` for testkørsler. |
| `heym.sub_workflow.depth` | Nestingsdybde ved aktivering som under-workflow. |
| `heym.workflow.status` | Afsluttende status for kørslen. En mislykket kørsel sætter span-status til `ERROR`. |

### Node-span

Navn: `heym.node.execute`, oprettes som underordnet til workflow-spanet.

| Attribut | Beskrivelse |
|-----------|-------------|
| `heym.node.id` | Node-id'et. |
| `heym.node.type` | Node-typen, f.eks. `agent`, `llm`, `http`. |
| `heym.node.label` | Node-etiketten vist på canvas. |
| `heym.node.status` | `success` eller `error`. Fejl sætter span-status til `ERROR`. |
| `heym.node.duration_ms` | Node-udførelsestid i millisekunder. |
| `heym.llm.model` | Modelnavn for LLM- og agent-noder, når tilgængelig. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token-forbrug for LLM- og agent-noder, når tilgængelig. |

Node-spans nestes korrekt under workflow-spanet, selv når noder kører parallelt, da workflow-konteksten propageres til arbejdertråde.

### Agent-værktøjsspan

Navn: `heym.agent.tool.execute`, oprettes under den aktive Agent-node-span.

| Attribut | Beskrivelse |
|-----------|-------------|
| `heym.agent.tool.name` | Værktøjsnavn valgt af modellen. |
| `heym.agent.tool.call_id` | Provider-værktøjskalds-id, når tilgængelig. |
| `heym.agent.tool.source` | Værktøjskilde som `node_tool`, `mcp`, `skill` eller `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-serveretikette, når relevant. |
| `heym.agent.tool.iteration` | Agent-værktøjsløkke-iteration. |
| `heym.agent.tool.args_bytes` | UTF-8-størrelse af serialiserede værktøjsargumenter. |
| `heym.agent.tool.result_bytes` | UTF-8-størrelse af serialiseret værktøjsresultat. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` eller `cancelled`. Værktøjsfejl sætter span-status til `ERROR`. |

Rå værktøjsargumenter og resultater vedhæftes ikke til spans som standard.

## Sikkerhed for Agent-værktøjspayloads

Persisterede Agent-observabilitetspayloads redigeres og trunkeres i koden (`4096` tegn per streng, dybde `6`, `32768` tegn i alt per LLM-sporskrivning). Det totale sporingsbudget fordeles på tværs af værktøjsregistreringer, så et tidligt stort resultat ikke kan skjule identiteten og livscyklusstatus for senere kald. Afgrænset `_generated_files` download-metadata reserveres separat fra omfangsrige skill-outputs:

- LLM-spor `request` / `response` værktøjssektioner, inklusive `_hitl_pending`-kopier skrevet til sporlageret
- Agent-resultat `tool_calls`-registreringer vist i kørselshistorikken
- Live Debug-panel værktøjsresultathændelser, som genbruger den samme afgrænsede, rensete registrering

Live værktøjsudførelse, modelbundne værktøjsbeskeder og den hukommelsesbaserede HITL-genoptagelsestilstand (`_hitl_pending.agent_state.messages` / `tool_arguments`) beholder de originale værdier, så genoptagelse og nøjagtigt argumentmatch stadig virker. Kun lagrede observabilitetskopier renses.
## Trace Context Propagation

Heym følger [W3C Trace Context](https://www.w3.org/TR/trace-context/)-standarden, så traces forbliver forbundne på tværs af servicegrænser.

- **Indgående webhooks:** når en indgående anmodning indeholder en `traceparent`-header, registreres workflow-kørslen som et child af den trace. Dette knytter Heym-kørsler til det upstream-system, der udløste dem.
- **Udgående HTTP:** HTTP-noden injicerer `traceparent` i anmodninger, den sender, så downstream-services kan fortsætte den samme trace.
- **Under-workflows:** en under-workflow-kørsel bliver parentet til den node, der påkaldte den, hvilket bevarer kaldhierarkiet i én trace.

Triggers uden indgående context (såsom Cron, IMAP, RabbitMQ og WebSocket) starter en frisk trace pr. kørsel.

## Pålidelighed

- En langsom eller utilgængelig collector blokerer aldrig workflow-udførelsen. Spans batch-processeres og eksporteres i baggrunden.
- Hvis tracing ikke kan initialiseres (f.eks. på grund af en ugyldig endpoint), logger backenden fejlen og fortsætter med tracing deaktiveret i stedet for at fejle under opstart.
- OTLP auth-headers læses udelukkende fra miljøvariabler. De gemmes aldrig i databasen og returneres aldrig af status-API'en.

## Relateret

- [Indstillinger](./user-settings.md) – Observability-fanen, der viser tracing-status
- [Miljøvariabler](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fuldt konfigurationsreference
- [Triggers](./triggers.md) – Sådan startes workflows, inklusive webhooks
- [Kørselshistorik](./execution-history.md) – Heyms indbyggede visning af kørselshistorik pr. kørsel
- [HTTP](../nodes/http-node.md) – Noden, der propagaterer trace context til udgående kald

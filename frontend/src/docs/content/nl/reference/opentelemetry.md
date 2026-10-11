# OpenTelemetry Tracing

Heym kan [OpenTelemetry](https://opentelemetry.io/)-traces uitzenden voor elke workflow-uitvoering, node-uitvoering en Agent-toolaanroep. Elke uitvoering produceert een root-span met child-spans per node en Agent-tool, zodat u kunt zien welke stap is mislukt, hoe lang deze duurde, wat er werd aangeroepen en wat er werd teruggegeven. Spans worden via OTLP/HTTP geëxporteerd naar elke compatibele backend, zoals Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic of Grafana Cloud.

Tracing is **standaard uitgeschakeld**. Wanneer dit uit staat, is er geen meetbare overhead en worden er geen spans aangemaakt.

## Tracing inschakelen

Stel de volgende omgevingsvariabelen in op de backend en herstart deze vervolgens:

Voor de volledige lijst met omgevingsvariabelen, zie [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabele | Standaard | Beschrijving |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Hoofdschakelaar. Stel in op `true` om tracing in te schakelen. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP basis-endpoint, bijvoorbeeld `http://collector:4318`. Heym verstuurt spans naar `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Door komma's gescheiden `key=value`-headers voor exporter-authenticatie, bijvoorbeeld `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Het `service.name`-resource-attribuut. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Head-samplingratio tussen `0.0` en `1.0`, toegepast met een parent-based sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Wanneer `true`, worden afgekapte node-input- en output-payloads aan node-spans gekoppeld. Standaard uit vanwege privacy. |

Minimaal voorbeeld:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

U kunt de actieve configuratie bevestigen in de app onder **Settings → Observability** (te openen via uw avatar in de header). Dat paneel is alleen-lezen en toont nooit exporter-secrets.

## Wat wordt getraceerd

### Workflow root-span

Naam: `heym.workflow.execute`

| Attribuut | Beschrijving |
|-----------|-------------|
| `heym.workflow.id` | De workflow-UUID. |
| `heym.node.count` | Aantal nodes in de workflow. |
| `heym.workflow.test_mode` | `true` voor testuitvoeringen. |
| `heym.sub_workflow.depth` | Nestingsdiepte wanneer aangeroepen als sub-workflow. |
| `heym.workflow.status` | Eindstatus van de uitvoering. Een mislukte uitvoering zet de span-status op `ERROR`. |

### Node-span

Naam: `heym.node.execute`, aangemaakt als child van de workflow-span.

| Attribuut | Beschrijving |
|-----------|-------------|
| `heym.node.id` | De node-id. |
| `heym.node.type` | Het node-type, bijvoorbeeld `agent`, `llm`, `http`. |
| `heym.node.label` | Het node-label dat op het canvas wordt weergegeven. |
| `heym.node.status` | `success` of `error`. Fouten zetten de span-status op `ERROR`. |
| `heym.node.duration_ms` | Node-uitvoeringstijd in milliseconden. |
| `heym.llm.model` | Modelnaam voor LLM- en agent-nodes, indien beschikbaar. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token-gebruik voor LLM- en agent-nodes, indien beschikbaar. |

Node-spans nestelen correct onder de workflow-span, zelfs wanneer nodes parallel worden uitgevoerd, omdat de workflow-context wordt doorgegeven aan worker-threads.

### Agent-tool-span

Naam: `heym.agent.tool.execute`, aangemaakt onder de actieve Agent-node-span.

| Attribuut | Beschrijving |
|-----------|-------------|
| `heym.agent.tool.name` | Toolnaam geselecteerd door het model. |
| `heym.agent.tool.call_id` | Provider tool-call-id, indien beschikbaar. |
| `heym.agent.tool.source` | Tool-bron zoals `node_tool`, `mcp`, `skill` of `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-serverlabel, indien van toepassing. |
| `heym.agent.tool.iteration` | Agent tool-loop-iteratie. |
| `heym.agent.tool.args_bytes` | UTF-8-grootte van geserialiseerde tool-argumenten. |
| `heym.agent.tool.result_bytes` | UTF-8-grootte van geserialiseerd tool-resultaat. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` of `cancelled`. Tool-fouten zetten de span-status op `ERROR`. |

Ruwe tool-argumenten en -resultaten worden standaard niet aan spans gekoppeld.

## Veiligheid van Agent-tool-payloads

Opgeslagen Agent-observability-payloads worden in code geredigeerd en afgekapt (`4096` tekens per string, diepte `6`, `32768` totale tekens per LLM-trace-schrijfactie). Het totale trace-budget wordt verdeeld over tool-records, zodat een vroeg groot resultaat de identiteit en levenscyclusstatus van latere aanroepen niet kan verbergen. Begrensde `_generated_files`-downloadmetadata wordt apart gereserveerd van omvangrijke skill-output:

- LLM-trace `request` / `response` tool-secties, inclusief `_hitl_pending`-kopieën die naar de trace-store worden geschreven
- Agent-resultaat `tool_calls`-records die in de uitvoeringsgeschiedenis worden weergegeven
- Live Debug-paneel tool-resultaat-events, die hetzelfde begrensde gesanitiseerde record hergebruiken

Live tool-uitvoering, model-gebonden tool-berichten en de in-memory HITL-hervattingsstatus (`_hitl_pending.agent_state.messages` / `tool_arguments`) behouden de oorspronkelijke waarden, zodat hervatting en exacte argument-matching blijven werken. Alleen opgeslagen observability-kopieën worden gesanitiseerd.

## Trace Context Propagatie

Heym volgt de [W3C Trace Context](https://www.w3.org/TR/trace-context/)-standaard, zodat traces verbonden blijven over servicegrenzen heen.

- **Inbound webhooks:** wanneer een inkomend verzoek een `traceparent`-header bevat, wordt de workflow-uitvoering geregistreerd als een kind van die trace. Dit koppelt Heym-uitvoeringen aan het upstream-systeem dat ze heeft geactiveerd.
- **Outbound HTTP:** het HTTP-knooppunt injecteert `traceparent` in de verzoeken die het verstuurt, zodat downstream-services dezelfde trace kunnen voortzetten.
- **Sub-workflows:** een sub-workflow-uitvoering is een kind van het knooppunt dat deze heeft aangeroepen, waardoor de aanroephierarchie binnen één trace behouden blijft.

Triggers zonder inbound context (zoals Cron, IMAP, RabbitMQ en WebSocket) starten een nieuwe trace per uitvoering.

## Betrouwbaarheid

- Een trage of onbereikbare collector blokkeert nooit de uitvoering van een workflow. Spans worden gebundeld en op de achtergrond geëxporteerd.
- Als tracing niet kan worden geïnitialiseerd (bijvoorbeeld door een ongeldig endpoint), logt de backend de fout en gaat verder met tracing uitgeschakeld in plaats van niet te starten.
- OTLP-authenticatieheaders worden uitsluitend uit de omgeving gelezen. Ze worden nooit opgeslagen in de database en nooit teruggegeven door de status-API.

## Gerelateerd

- [Instellingen](./user-settings.md) – Het tabblad Observability dat de tracing-status toont
- [Omgevingsvariabelen](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Volledige configuratiereferentie
- [Triggers](./triggers.md) – Hoe workflows starten, inclusief webhooks
- [Uitvoeringsgeschiedenis](./execution-history.md) – Heym's ingebouwde geschiedenisweergave per uitvoering
- [HTTP](../nodes/http-node.md) – Het knooppunt dat trace-context doorgeeft aan downstream-aanroepen

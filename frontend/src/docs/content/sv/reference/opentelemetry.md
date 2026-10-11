# OpenTelemetry Tracing

Heym kan avge [OpenTelemetry](https://opentelemetry.io/)-spårningar för varje workflow-körning, node-exekvering och Agent-verktygsanrop. Varje körning producerar en root-span med child-spans per nod och Agent-verktyg, så att det går att se vilket steg som misslyckades, hur lång tid det tog, vad som anropades och vad som returnerades. Spans exporteras över OTLP/HTTP till valfri kompatibel backend såsom Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic eller Grafana Cloud.

Tracing är **inaktiverat som standard**. När det är avstängt finns ingen mätbar overhead och inga spans skapas.

## Aktivera Tracing

Ange följande miljövariabler på backend och starta sedan om den:

För den fullständiga listan över miljövariabler, se [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variabel | Standard | Beskrivning |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Huvudbrytare. Ange `true` för att aktivera tracing. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP-basendpoint, till exempel `http://collector:4318`. Heym skickar spans till `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Kommaseparerade `key=value`-headers för exporter-autentisering, till exempel `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | Resursattributet `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Head-samplingskvot mellan `0.0` och `1.0`, tillämpad med en parent-based sampler. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | När `true` bifogas trunkerade node-input- och output-payloads till node-spans. Avstängt som standard av integritetsskäl. |

Minimalt exempel:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Den aktiva konfigurationen kan bekräftas i appen under **Settings → Observability** (öppnas från avataren i sidhuvudet). Den panelen är skrivskyddad och visar aldrig exporter-hemligheter.

## Vad som spåras

### Workflow root-span

Namn: `heym.workflow.execute`

| Attribut | Beskrivning |
|-----------|-------------|
| `heym.workflow.id` | Workflowens UUID. |
| `heym.node.count` | Antal noder i workflowen. |
| `heym.workflow.test_mode` | `true` för testkörningar. |
| `heym.sub_workflow.depth` | Nästningsdjup vid anrop som sub-workflow. |
| `heym.workflow.status` | Körningens slutstatus. En misslyckad körning sätter span-status till `ERROR`. |

### Node-span

Namn: `heym.node.execute`, skapad som child till workflow-spannet.

| Attribut | Beskrivning |
|-----------|-------------|
| `heym.node.id` | Nodens id. |
| `heym.node.type` | Nodens typ, till exempel `agent`, `llm`, `http`. |
| `heym.node.label` | Nodens etikett såsom den visas på canvasen. |
| `heym.node.status` | `success` eller `error`. Fel sätter span-status till `ERROR`. |
| `heym.node.duration_ms` | Nodens exekveringstid i millisekunder. |
| `heym.llm.model` | Modellnamn för LLM- och agent-noder, när tillgängligt. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Token-användning för LLM- och agent-noder, när tillgängligt. |

Node-spans nästlas korrekt under workflow-spannet även när noder körs parallellt, eftersom workflow-kontexten propageras in i worker-trådar.

### Agent-verktygs-span

Namn: `heym.agent.tool.execute`, skapad under det aktiva Agent-node-spannet.

| Attribut | Beskrivning |
|-----------|-------------|
| `heym.agent.tool.name` | Verktygsnamn valt av modellen. |
| `heym.agent.tool.call_id` | Leverantörens tool-call-id, när tillgängligt. |
| `heym.agent.tool.source` | Verktygskälla såsom `node_tool`, `mcp`, `skill` eller `sub_workflow`. |
| `heym.agent.tool.mcp_server` | MCP-serveretikett, när tillämpligt. |
| `heym.agent.tool.iteration` | Agentens tool-loop-iteration. |
| `heym.agent.tool.args_bytes` | UTF-8-storlek på serialiserade verktygsargument. |
| `heym.agent.tool.result_bytes` | UTF-8-storlek på serialiserat verktygsresultat. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` eller `cancelled`. Verktygsfel sätter span-status till `ERROR`. |

Rå verktygsargument och -resultat bifogas inte till spans som standard.

## Säkerhet för Agent-verktygs-payloads

Persisterade Agent-observability-payloads redigeras och trunkeras i koden (`4096` tecken per sträng, djup `6`, `32768` totala tecken per LLM-trace-skrivning). Den totala trace-budgeten fördelas över verktygsposter så att ett tidigt stort resultat inte kan dölja identiteten och livscykelstatusen för senare anrop. Begränsad `_generated_files`-nedladdningsmetadata reserveras separat från skrymmande skill-output:

- LLM-trace `request` / `response`-verktygssektioner, inklusive `_hitl_pending`-kopior som skrivs till trace-lagret
- Agent-resultatets `tool_calls`-poster som visas i exekveringshistoriken
- Live Debug-panelens tool-result-händelser, som återanvänder samma begränsade sanerade post

Live-verktygsexekvering, modellbundna verktygsmeddelanden och det in-memory HITL-återupptagningsläget (`_hitl_pending.agent_state.messages` / `tool_arguments`) behåller originalvärdena så att återupptagning och exakt-arg-matchning fortfarande fungerar. Endast lagrade observability-kopior saneras.
## Spårkontextspridning

Heym följer standarden [W3C Trace Context](https://www.w3.org/TR/trace-context/) så att spårningar förblir sammankopplade över tjänstegränser.

- **Inkommande webhooks:** när en inkommande begäran innehåller en `traceparent`-header registreras workflow-körningen som ett barn till den spårningen. Detta kopplar samman Heym-körningar med det uppströms system som utlöste dem.
- **Utgående HTTP:** HTTP-noden injicerar `traceparent` i de begäranden den gör, så att nedströms tjänster kan fortsätta samma spårning.
- **Under-workflows:** en under-workflow-körning blir ett barn till den nod som anropade den, vilket bevarar anropshierarkin i en och samma spårning.

Triggers utan en inkommande kontext (såsom Cron, IMAP, RabbitMQ och WebSocket) startar en ny spårning per körning.

## Tillförlitlighet

- En långsam eller onåbar collector blockerar aldrig workflow-körningen. Spans batchas och exporteras i bakgrunden.
- Om spårning inte kan initieras (till exempel på grund av en felaktig endpoint) loggar backend felet och fortsätter med spårning inaktiverad i stället för att misslyckas med att starta.
- OTLP-autentiseringsheaders läses endast från miljön. De lagras aldrig i databasen och returneras aldrig av status-API:et.

## Relaterat

- [Settings](./user-settings.md) – Fliken Observability som visar spårningsstatus
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Fullständig konfigurationsreferens
- [Triggers](./triggers.md) – Hur workflows startar, inklusive webhooks
- [Execution History](./execution-history.md) – Heyms inbyggda historikvy per körning
- [HTTP](../nodes/http-node.md) – Noden som sprider spårkontext till nedströms anrop

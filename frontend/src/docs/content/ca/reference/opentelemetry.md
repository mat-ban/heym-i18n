# Traçabilitat amb OpenTelemetry

Heym pot emetre traces d'[OpenTelemetry](https://opentelemetry.io/) per a cada execució de workflow, execució de node i invocació d'eina d'Agent. Cada execució produeix un span arrel amb spans fills per node i per eina d'Agent, de manera que podeu veure quin pas ha fallat, quant ha trigat, què ha cridat i què ha retornat. Els spans s'exporten via OTLP/HTTP a qualsevol backend compatible com ara Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic o Grafana Cloud.

La traçabilitat està **desactivada per defecte**. Quan està desactivada no hi ha cap sobrecàrrega mesurable ni es creen spans.

## Activació de la traçabilitat

Definiu les variables d'entorn següents al backend i reinicieu-lo:

Per a la llista completa de variables d'entorn, consulteu [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Valor per defecte | Descripció |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Interruptor principal. Poseu-lo a `true` per activar la traçabilitat. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint base OTLP/HTTP, per exemple `http://collector:4318`. Heym envia els spans a `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Capçaleres `key=value` separades per comes per a l'autenticació de l'exportador, per exemple `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | L'atribut de recurs `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Ràtio de mostreig head entre `0.0` i `1.0`, aplicada amb un sampler basat en el pare. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Quan és `true`, adjunta payloads truncats d'entrada i sortida del node als spans del node. Desactivat per defecte per privacitat. |

Exemple mínim:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Podeu confirmar la configuració activa a l'aplicació a **Settings → Observability** (obriu-ho des del vostre avatar a la capçalera). Aquest panell és de només lectura i mai no mostra secrets de l'exportador.

## Què es traça

### Span arrel del workflow

Nom: `heym.workflow.execute`

| Atribut | Descripció |
|-----------|-------------|
| `heym.workflow.id` | L'UUID del workflow. |
| `heym.node.count` | Nombre de nodes del workflow. |
| `heym.workflow.test_mode` | `true` per a execucions de prova. |
| `heym.sub_workflow.depth` | Profunditat d'imbricació quan s'invoca com a sub-workflow. |
| `heym.workflow.status` | Estat final de l'execució. Una execució fallida estableix l'estat del span a `ERROR`. |

### Span de node

Nom: `heym.node.execute`, creat com a fill del span del workflow.

| Atribut | Descripció |
|-----------|-------------|
| `heym.node.id` | L'id del node. |
| `heym.node.type` | El tipus de node, per exemple `agent`, `llm`, `http`. |
| `heym.node.label` | L'etiqueta del node mostrada al canvas. |
| `heym.node.status` | `success` o `error`. Els errors estableixen l'estat del span a `ERROR`. |
| `heym.node.duration_ms` | Temps d'execució del node en mil·lisegons. |
| `heym.llm.model` | Nom del model per a nodes LLM i d'agent, quan està disponible. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Ús de tokens per a nodes LLM i d'agent, quan està disponible. |

Els spans de node s'imbriquen correctament sota el span del workflow fins i tot quan els nodes s'executen en paral·lel, perquè el context del workflow es propaga als fils de treball.

### Span d'eina d'Agent

Nom: `heym.agent.tool.execute`, creat sota el span del Node d'Agent actiu.

| Atribut | Descripció |
|-----------|-------------|
| `heym.agent.tool.name` | Nom de l'eina seleccionada pel model. |
| `heym.agent.tool.call_id` | Id de crida d'eina del proveïdor, quan està disponible. |
| `heym.agent.tool.source` | Origen de l'eina, com ara `node_tool`, `mcp`, `skill` o `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Etiqueta del servidor MCP, quan escau. |
| `heym.agent.tool.iteration` | Iteració del bucle d'eines de l'Agent. |
| `heym.agent.tool.args_bytes` | Mida UTF-8 dels arguments d'eina serialitzats. |
| `heym.agent.tool.result_bytes` | Mida UTF-8 del resultat d'eina serialitzat. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` o `cancelled`. Els errors d'eina estableixen l'estat del span a `ERROR`. |

Els arguments i resultats crus de les eines no s'adjunten als spans per defecte.

## Seguretat dels payloads d'eines d'Agent

Els payloads persistits d'observabilitat d'Agent es redacten i es trunquen al codi (`4096` caràcters per cadena, profunditat `6`, `32768` caràcters totals per escriptura de traça LLM). El pressupost total de traça es divideix entre els registres d'eines perquè un resultat gran primerenc no pugui amagar la identitat i l'estat del cicle de vida de crides posteriors. Les metadades de descàrrega acotades de `_generated_files` es reserven per separat de la sortida voluminosa de skills:

- Seccions d'eines `request` / `response` de la traça LLM, incloent-hi les còpies `_hitl_pending` escrites a l'emmagatzematge de traces
- Registres `tool_calls` del resultat d'Agent mostrats a l'historial d'execucions
- Esdeveniments de resultat d'eina del panell Live Debug, que reutilitzen el mateix registre sanejat acotat

L'execució d'eines en directe, els missatges d'eines vinculats al model i l'estat de represa HITL en memòria (`_hitl_pending.agent_state.messages` / `tool_arguments`) conserven els valors originals perquè la represa i la concordança exacta d'arguments segueixin funcionant. Només es sanejen les còpies d'observabilitat emmagatzemades.
## Propagació del context de traça

Heym segueix l'estàndard [W3C Trace Context](https://www.w3.org/TR/trace-context/) perquè les traces es mantinguin connectades entre límits de servei.

- **Webhooks d'entrada:** quan una petició entrant porta una capçalera `traceparent`, l'execució del workflow es registra com a filla d'aquella traça. Això enllaça les execucions de Heym amb el sistema d'origen que les ha desencadenat.
- **HTTP de sortida:** el node HTTP injecta `traceparent` a les peticions que fa, de manera que els serveis posteriors poden continuar la mateixa traça.
- **Sub-workflows:** l'execució d'un sub-workflow té com a pare el node que l'ha invocat, preservant la jerarquia de crides en una sola traça.

Els Triggers sense context d'entrada (com ara Cron, IMAP, RabbitMQ i WebSocket) inicien una traça nova per execució.

## Fiabilitat

- Un col·lector lent o inabastable no bloqueja mai l'execució del workflow. Els spans s'agrupen i s'exporten en segon pla.
- Si la traça no s'aconsegueix inicialitzar (per exemple, un endpoint incorrecte), el backend registra l'error i continua amb la traça desactivada en lloc de fallar en l'arrencada.
- Les capçaleres d'autenticació OTLP es llegeixen únicament de l'entorn. Mai s'emmagatzemen a la base de dades ni les retorna l'API d'estat.

## Relacionat

- [Settings](./user-settings.md) – La pestanya Observability que mostra l'estat de la traça
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referència completa de configuració
- [Triggers](./triggers.md) – Com s'inicien els workflows, incloent-hi els webhooks
- [Execution History](./execution-history.md) – La vista d'historial per execució integrada de Heym
- [HTTP](../nodes/http-node.md) – El node que propaga el context de traça a les crides posteriors

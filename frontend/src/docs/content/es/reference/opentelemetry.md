# Trazabilidad con OpenTelemetry

Heym puede emitir trazas de [OpenTelemetry](https://opentelemetry.io/) para cada ejecución de workflow, ejecución de nodo e invocación de herramienta de Agente. Cada ejecución produce un span raíz con spans hijos por nodo y herramienta de Agente, de modo que es posible ver qué paso falló, cuánto tardó, qué invocó y qué devolvió. Los spans se exportan mediante OTLP/HTTP a cualquier backend compatible como Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic o Grafana Cloud.

La trazabilidad está **deshabilitada por defecto**. Cuando está desactivada no existe sobrecarga medible ni se crean spans.

## Habilitar la trazabilidad

Configure las siguientes variables de entorno en el backend y, a continuación, reinícielo:

Para consultar la lista completa de variables de entorno, consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Valor por defecto | Descripción |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Interruptor principal. Establezca `true` para activar la trazabilidad. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint base OTLP/HTTP, por ejemplo `http://collector:4318`. Heym envía los spans a `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Cabeceras `key=value` separadas por comas para la autenticación del exportador, por ejemplo `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | El atributo de recurso `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Ratio de muestreo en origen entre `0.0` y `1.0`, aplicado con un sampler basado en parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Cuando es `true`, adjunta payloads truncados de entrada y salida del nodo a los spans de nodo. Desactivado por defecto por privacidad. |

Ejemplo mínimo:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Es posible confirmar la configuración activa en la aplicación en **Settings → Observability** (se abre desde el avatar en la cabecera). Ese panel es de solo lectura y nunca muestra secretos del exportador.

## Qué se traza

### Span raíz del workflow

Nombre: `heym.workflow.execute`

| Atributo | Descripción |
|-----------|-------------|
| `heym.workflow.id` | El UUID del workflow. |
| `heym.node.count` | Número de nodos del workflow. |
| `heym.workflow.test_mode` | `true` para ejecuciones de prueba. |
| `heym.sub_workflow.depth` | Profundidad de anidamiento cuando se invoca como sub-workflow. |
| `heym.workflow.status` | Estado final de la ejecución. Una ejecución fallida establece el estado del span a `ERROR`. |

### Span de nodo

Nombre: `heym.node.execute`, creado como hijo del span del workflow.

| Atributo | Descripción |
|-----------|-------------|
| `heym.node.id` | El id del nodo. |
| `heym.node.type` | El tipo de nodo, por ejemplo `agent`, `llm`, `http`. |
| `heym.node.label` | La etiqueta del nodo mostrada en el canvas. |
| `heym.node.status` | `success` o `error`. Los errores establecen el estado del span a `ERROR`. |
| `heym.node.duration_ms` | Tiempo de ejecución del nodo en milisegundos. |
| `heym.llm.model` | Nombre del modelo para nodos LLM y de agente, cuando está disponible. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Uso de tokens para nodos LLM y de agente, cuando está disponible. |

Los spans de nodo se anidan correctamente bajo el span del workflow incluso cuando los nodos se ejecutan en paralelo, porque el contexto del workflow se propaga a los hilos de trabajo.

### Span de herramienta de Agente

Nombre: `heym.agent.tool.execute`, creado bajo el span del Nodo de agente activo.

| Atributo | Descripción |
|-----------|-------------|
| `heym.agent.tool.name` | Nombre de la herramienta seleccionada por el modelo. |
| `heym.agent.tool.call_id` | Id de llamada a herramienta del proveedor, cuando está disponible. |
| `heym.agent.tool.source` | Origen de la herramienta, como `node_tool`, `mcp`, `skill` o `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Etiqueta del servidor MCP, cuando corresponde. |
| `heym.agent.tool.iteration` | Iteración del bucle de herramientas del Agente. |
| `heym.agent.tool.args_bytes` | Tamaño en UTF-8 de los argumentos serializados de la herramienta. |
| `heym.agent.tool.result_bytes` | Tamaño en UTF-8 del resultado serializado de la herramienta. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` o `cancelled`. Los errores de herramienta establecen el estado del span a `ERROR`. |

Los argumentos y resultados sin procesar de las herramientas no se adjuntan a los spans por defecto.

## Seguridad de los payloads de herramientas del Agente

Los payloads persistidos de observabilidad del Agente se redactan y truncan en código (`4096` caracteres por cadena, profundidad `6`, `32768` caracteres totales por escritura de traza LLM). El presupuesto total de la traza se divide entre los registros de herramientas, de modo que un resultado grande temprano no pueda ocultar la identidad y el estado del ciclo de vida de llamadas posteriores. Los metadatos acotados de descarga `_generated_files` se reservan por separado respecto a la salida voluminosa de skills:

- Secciones de herramientas `request` / `response` de la traza LLM, incluidas las copias `_hitl_pending` escritas en el almacén de trazas
- Registros `tool_calls` del resultado del Agente mostrados en el historial de ejecuciones
- Eventos de resultado de herramienta del panel Live Debug, que reutilizan el mismo registro saneado y acotado

La ejecución de herramientas en vivo, los mensajes de herramienta vinculados al modelo y el estado de reanudación HITL en memoria (`_hitl_pending.agent_state.messages` / `tool_arguments`) conservan los valores originales para que la reanudación y la coincidencia exacta de argumentos sigan funcionando. Solo se sanean las copias almacenadas para observabilidad.

## Propagación del contexto de trazas

Heym sigue el estándar [W3C Trace Context](https://www.w3.org/TR/trace-context/) para que las trazas permanezcan conectadas a través de los límites entre servicios.

- **Webhooks entrantes:** cuando una solicitud entrante incluye una cabecera `traceparent`, la ejecución del workflow se registra como hija de esa traza. Esto vincula las ejecuciones de Heym con el sistema de origen que las desencadenó.
- **HTTP saliente:** el Nodo HTTP inyecta `traceparent` en las solicitudes que realiza, de modo que los servicios posteriores pueden continuar la misma traza.
- **Sub-workflows:** la ejecución de un sub-workflow queda vinculada como hija del nodo que la invocó, preservando la jerarquía de llamadas en una única traza.

Los Triggers que no disponen de un contexto entrante (como Cron, IMAP, RabbitMQ y WebSocket) inician una traza nueva en cada ejecución.

## Fiabilidad

- Un colector lento o inaccesible nunca bloquea la ejecución del workflow. Los spans se agrupan por lotes y se exportan en segundo plano.
- Si el trazado no logra inicializarse (por ejemplo, debido a un endpoint incorrecto), el backend registra el error y continúa con el trazado deshabilitado en lugar de fallar al arrancar.
- Las cabeceras de autenticación de OTLP se leen únicamente desde el entorno. Nunca se almacenan en la base de datos ni se devuelven a través de la API de estado.

## Relacionado

- [Configuración](./user-settings.md) – La pestaña Observability que muestra el estado del trazado
- [Variables de entorno](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referencia completa de configuración
- [Triggers](./triggers.md) – Cómo se inician los workflows, incluidos los webhooks
- [Historial de ejecuciones](./execution-history.md) – Vista integrada de historial por ejecución de Heym
- [HTTP](../nodes/http-node.md) – El nodo que propaga el contexto de trazas a las llamadas posteriores

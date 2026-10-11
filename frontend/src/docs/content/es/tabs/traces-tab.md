# Pestaña Traces

La pestaña **Traces** muestra las trazas de ejecución del LLM. Inspeccione los payloads de solicitud/respuesta, los tiempos, las llamadas a herramientas y depure el comportamiento de los nodos [Agent](../nodes/agent-node.md) y [LLM](../reference/node-types.md), además de métricas agregadas (llamadas, tokens, coste, latencia, tasa de error) en cualquier ventana temporal.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Ver demo de Traces</a></p>

## Cabecera de estadísticas

La página se abre con un resumen de estadísticas sobre la lista de trazas, calculado según el rango temporal seleccionado y los demás filtros activos:

- **Tarjetas KPI** – Total de llamadas, Total de tokens, Coste total (USD), Latencia media, % de errores
- **Tokens por modelo** – Gráfico de anillo con el volumen de tokens por modelo
- **Coste por modelo** – Gráfico de anillo con el gasto en USD por modelo. Los modelos sin precios muestran un enlace "Configurar precios" a la [Tabla de costes de LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Llamadas a lo largo del tiempo** – Gráfico de área apilada de llamadas exitosas frente a fallidas por intervalo (5 min / 1 h / 6 h / 1 día, elegido automáticamente según el rango)
- **Aviso de modelos sin precio** – Aparece bajo los gráficos cuando algunos modelos trazados no tienen fila de precios, con enlace a la Tabla de costes de LLM

## Rango temporal

Un único selector de **Rango temporal** en la parte superior de la barra de filtros controla tanto la cabecera de estadísticas como la lista de trazas. Opciones: Última 1 hora, Últimas 24 horas, Últimos 7 días (predeterminado), Últimos 30 días, Todo el tiempo. Cambiar el rango restablece la paginación y recarga los gráficos y la lista de forma conjunta.

## Lista de trazas

- Lista paginada de trazas recientes dentro del rango temporal seleccionado
- Cada traza muestra: workflow, nodo, credencial, marca temporal, duración
- Haga clic en una traza para abrir la vista de detalle
- Use **Prev / Next** dentro del diálogo de detalle para moverse entre trazas sin cerrarlo

## Filtrado

- **Rango temporal** – 1h / 24h / 7d / 30d / Todo; filtra los gráficos y la lista de forma conjunta
- **Credencial** – Filtrar por la credencial (API key) utilizada
- **Origen** – Filtrar por workflow o por origen de la ejecución
- **Búsqueda** – Buscar por modelo, workflow, credencial o etiqueta de nodo
- **Actualizar** – Recargar la página actual de trazas

## Detalle de la traza

Al abrir una traza:

- **Pasos** – Una línea temporal de arriba a abajo que lee la traza como una cadena ordenada: System → User → Assistant → Tool → Answer. Cada paso es plegable; al expandir uno se muestra un detalle legible (texto del mensaje, o los argumentos y el resultado de una herramienta) seguido del JSON de ese paso. El contenido JSON en todos los tipos de evento —incluidas las llamadas MCP y los payloads JSON-RPC— se abre por defecto en un árbol expandible, con el primer nivel expandido. Use **Tree / Raw** para alternar entre la estructura formateada y el texto original. El JSON mal formado permanece visible como texto plano. Los pasos de herramienta muestran su duración y una insignia MCP/Skill cuando corresponde, además de insignias pending / timeout / cancelled cuando el estado de la llamada a la herramienta está establecido. El paso Answer puede mostrar insignias agregadas de `tool_metrics` (recuentos de llamadas por estado y duración total de las herramientas). Cuando una traza registra cada llamada al modelo, como hacen un mensaje de Dashboard Chat y un agente enrutado, un paso **LLM** se sitúa antes de las herramientas que la llamada solicitó, y el **Duration Breakdown** despliega cada llamada al modelo, herramienta y decisión de enrutamiento en una única línea temporal. Un mensaje de Dashboard Chat es una sola traza, independientemente de cuántas rondas de herramientas haya requerido. Las trazas sin cadena de mensajes (por ejemplo, la generación de imágenes) muestran una línea temporal mínima Request → Response.
- **Request** – Payload completo de la solicitud enviada al LLM, con vistas JSON **Tree / Raw**
- **Response** – Respuesta del modelo, incluidas las llamadas a herramientas si las hay, con vistas JSON **Tree / Raw**
- **Métricas de herramientas** – Cuando están presentes en la respuesta, un resumen compacto de los recuentos de llamadas a herramientas (`success` / `error` / `pending` / `timeout` / `cancelled`) y la duración total de las herramientas
- **Desglose de tiempos** – `llm_ms`, `tools_ms`, `mcp_list_ms` para el análisis de rendimiento
- **Llamadas a herramientas** – Nombre de la herramienta, argumentos, resultado, estado y tiempo transcurrido
- **Skills incluidas** – Skills pasadas al modelo en la solicitud
- **Ir al Workflow** – Saltar directamente al workflow relacionado desde el diálogo de detalle de la traza

## Copiar y exportar

- Copiar el JSON de solicitud o respuesta al portapapeles; la copia siempre utiliza el payload raw completo independientemente de la vista activa
- Útil para depuración o para compartir con soporte

## Mantenimiento

- **Borrar todo** – Eliminar todas las trazas guardadas tras confirmación
- Los controles de paginación muestran el rango visible actual (por ejemplo, `1-25 of 240`)

## Relacionado

- [Por qué Heym](../getting-started/why-heym.md) – Observabilidad del LLM a lo largo del ciclo de vida del agente
- [Nodo Agent](../nodes/agent-node.md) – Nodo de agente con llamada a herramientas
- [Tipos de nodo](../reference/node-types.md) – Nodos LLM y Agent
- [Pestaña Credentials](./credentials-tab.md) – Credenciales usadas en las trazas
- [Trazado con OpenTelemetry](../reference/opentelemetry.md) – Exportación OTel opcional para spans de workflow, nodo y herramientas del Agent
- [Pestaña DataTable](./datatable-tab.md) – Alberga la Tabla de costes de LLM usada por el gráfico de costes
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del dashboard

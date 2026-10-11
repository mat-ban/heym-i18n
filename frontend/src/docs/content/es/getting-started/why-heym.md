# Por qué Heym

Heym es infraestructura para ejecutar y gobernar agentes de IA en producción. Un único runtime autoalojado cubre cada etapa del ciclo de vida del agente.

Un agente prototipo necesita un modelo, un prompt y algunas herramientas. Un agente en producción también necesita Triggers y reintentos, estado guardado cuando se pausa a la espera de una persona, un registro de cada llamada a modelo y herramienta, un costo por cada ejecución, pruebas antes de que un cambio se despliegue y límites claros sobre lo que puede hacer por sí solo. Heym reúne todo eso en un solo lugar, de modo que el sistema que se diseña en el Canvas es el sistema que se ejecuta. Construya sistemas agénticos y luego ejecútelos con confianza.

## Un único runtime para el ciclo de vida del agente

| Etapa | Lo que Heym le ofrece |
|---|---|
| **Construir** | Componga agentes y pasos deterministas en el Canvas, genérelos con el [AI Assistant](../reference/ai-assistant.md) o parta de [Plantillas](../tabs/templates-tab.md) y skills portables. |
| **Orquestar** | Coordine agentes, [sub-agentes](../reference/agent-architecture.md), agentes de programación, RAG, automatización de navegador y herramientas con flujo de datos explícito y [ejecución en paralelo](../reference/parallel-execution.md). |
| **Ejecutar** | Inicie ejecuciones desde [Webhooks](../reference/webhooks.md), Programaciones y [Triggers](../reference/triggers.md) de eventos, con reintentos por Nodo, [manejo de errores](../nodes/error-handler-node.md) y [distribución de carga](../reference/cluster.md) entre instancias. |
| **Observar** | Inspeccione cada ejecución a través del [Historial](../reference/execution-history.md), las [trazas LLM](../tabs/traces-tab.md), el costo en USD por ejecución, las ejecuciones en vivo en el Canvas, la [analítica](../tabs/analytics-tab.md), las [Alertas](../tabs/alerts-tab.md) y la exportación a [OpenTelemetry](../reference/opentelemetry.md). |
| **Evaluar** | Pruebe prompts y modelos contra salidas esperadas en las [Evaluaciones](../tabs/evals-tab.md), con puntuación LLM-as-Judge y comparación de modelos en paralelo. |
| **Controlar** | Mantenga a las personas en control con [puntos de revisión](../reference/human-in-the-loop.md) y [guardrails](../reference/guardrails.md), y gobierne el acceso con [Credenciales](../reference/credentials.md) cifradas, [equipos](../reference/teams.md), [inicio de sesión único](../reference/sso.md) y una [pista de auditoría](../reference/audit.md). |
| **Exponer** | Sirva Workflows sobre REST y [SSE](../reference/sse-streaming.md), como herramientas [MCP](../tabs/mcp-tab.md), como interfaces de Chat de [Portal](../reference/portal.md) y como widgets del [dashboard](../tabs/dashboard-tab.md). |

## Construir

### AI Assistant: construya Workflows con lenguaje natural

El [AI Assistant](../reference/ai-assistant.md) es un panel de Chat dentro del editor de Workflows. Describa lo que desea, por ejemplo "crea un workflow que reciba la entrada del usuario, busque en mi base de conocimiento y responda usando GPT-4o", y el asistente genera Nodos y conexiones que se aplican al instante en el Canvas.

- Utiliza su propia credencial LLM (cualquier modelo compatible)
- Admite **entrada de voz** para diseñar Workflows sin usar las manos
- Aplica automáticamente el JSON de Workflow válido de la respuesta de la IA al Canvas
- Transmite respuestas en tiempo real

El asistente funciona directamente dentro del editor y transmite los Nodos al Canvas en tiempo real, y todo lo que genera permanece editable como los Nodos que usted colocó a mano.

### Sistema de Skills

Las skills son paquetes de capacidades portables, un archivo de instrucciones `SKILL.md` más scripts de Python opcionales, que pueden incorporarse a cualquier Nodo de agente.

- Las instrucciones de la skill se anteponen al prompt de sistema del agente
- Los archivos de Python de la skill se convierten en herramientas invocables
- Las skills son reutilizables entre Workflows y compartibles como archivos `.zip`

Esto equivale a entregar a su agente una descripción de puesto y una caja de herramientas en una sola incorporación.

### Workflow Analyzer: retroalimentación basada en ejecuciones

El panel de [Análisis de Workflow](../reference/workflow-analysis.md) es una herramienta de documentación y retroalimentación basada en ejecuciones integrada en el editor. Haga clic en **Analyze**, elija una credencial LLM y un modelo, y Heym genera un informe Markdown editable para el Workflow actual.

A diferencia de una nota estática, el analizador primero ejecuta el Workflow cuando puede e incluye el resultado de la ejecución en el prompt. El informe abarca áreas de mejora, el propósito del Workflow y una explicación paso a paso de lo que hacen los Nodos. Cuando ya existe un informe, **Reanalyze** transmite una vista previa independiente para que usted pueda aceptar la nueva versión o conservar el documento compartido actual.

## Orquestar

### Nodos integrados de LLM y agente

El [Nodo de agente](../nodes/agent-node.md) de Heym ejecuta un bucle de llamadas a herramientas estrechamente integrado con herramientas Python inline, conexiones MCP y un sistema de skills portátil, todo diseñado para agentes en producción.

El [nodo LLM](../nodes/llm-node.md) simple de Heym también va más allá de un único paso de prompt-respuesta. Para endpoints compatibles con OpenAI y OpenAI, puede cambiar a **modo Batch API** de modo que un solo nodo envía un array de prompts en una solicitud batch nativa del proveedor de menor coste. El canvas entonces expone una rama dedicada `batchStatus` que se dispara a medida que el batch atraviesa estados como `pending`, `processing` y `completed`.

Esto significa que el nodo LLM puede hacer dos cosas a la vez:

- Ejecutar la solicitud batch principal y devolver las salidas finales por elemento en la rama normal
- Disparar lógica de notificación o registro en cada actualización relevante del estado del batch sin convertir el flujo en un bucle de polling personalizado

La ejecución batch es una primitiva de workflow LLM de primera clase, con comprobaciones de capacidades del proveedor y del modelo en la UI del nodo.

El **Nodo de agente** es el núcleo de la orquestación de agentes en Heym:

- **Llamadas a herramientas** – El agente itera sobre las llamadas a herramientas en un bucle hasta producir una respuesta final
- **Herramientas Python** – Defina herramientas personalizadas inline con Python completo; el agente las invoca en tiempo de ejecución
- **Conexiones MCP** – Conecte con cualquier servidor de [Model Context Protocol](https://modelcontextprotocol.io/) (stdio o SSE) y el agente obtiene todas sus herramientas automáticamente
- **Skills** – Arrastre un archivo `.zip` o `.md` sobre un agente para ampliar su contexto de sistema y añadir herramientas Python
- **Llamadas a sub-workflows** – El agente puede invocar otros workflows de Heym como herramientas, componiendo comportamientos complejos sin código personalizado

Consulte [Nodo de agente](../nodes/agent-node.md) y [Arquitectura de agentes](../reference/agent-architecture.md) para la referencia completa.

### Orquestación multiagente

Heym admite un **patrón orquestador** con primitivas visuales de primera clase:

- Un agente actúa como **orquestador** (`isOrchestrator: true`) y recibe una herramienta `call_sub_agent`
- Delega tareas a **subagentes** con nombre en el mismo canvas
- Los subagentes pueden a su vez llamar a otros agentes o sub-workflows (profundidad máxima: 5)
- **Ejecución en paralelo**: cuando el orquestador llama a varios subagentes en un mismo turno, se ejecutan en paralelo para obtener resultados más rápidos

Esto habilita arquitecturas como un agente planificador que enruta el trabajo a un investigador, un programador y un resumidor, todo cableado visualmente sin código de orquestación personalizado.

Consulte [Arquitectura de agentes](../reference/agent-architecture.md) para los detalles de ejecución.

### Agentes de programación como nodos de workflow

Heym incluye dos nodos que ejecutan un agente de programación real como paso de workflow, no como una finalización de chat:

- **[Nodo Codex](../nodes/codex-node.md)** – Ejecuta la CLI de OpenAI Codex en un espacio de trabajo aislado de Heym contra un repositorio de GitHub. Admite **Sign in with ChatGPT** (OAuth PKCE sobre su suscripción Plus/Pro, sin coste de API por token) o un token de acceso, clona el repositorio, permite que Codex edite el código y devuelve `summary`, `diff`, `changedFiles` y un `pullRequestUrl` en borrador.
- **[Nodo OpenCode Go](../nodes/opencode-go-node.md)** – El mismo flujo de repositorio a través del gateway OpenCode agnóstico de proveedor (Kimi, DeepSeek, Qwen y más), ejecutado en un **contenedor desechable reforzado**: todas las capacidades eliminadas, raíz de solo lectura, límites de pid/memoria/CPU. El token de GitHub permanece fuera del sandbox: Heym realiza cada operación de git y GitHub en el host, de modo que el código generado no puede exfiltrar credenciales de push.

Esto significa que un workflow puede clasificar un bug desde un webhook, entregar el repositorio a un agente de programación, esperar el PR en borrador y publicar el enlace en Slack, totalmente automatizado, con límites de recursos configurables por despliegue.

### Pipeline RAG integrado

Heym incluye un [Nodo RAG / Almacén vectorial](../nodes/rag-node.md) y una pestaña gestionada de [Almacenes vectoriales](../tabs/vectorstores-tab.md). Puede:

- Elegir su backend vectorial: **Qdrant** (servidor externo) o **Postgres (pgvector)**, que almacena los vectores en la propia base de datos de Heym sin ningún servicio adicional que ejecutar
- Insertar documentos en un almacén vectorial directamente desde un nodo de workflow
- Realizar búsquedas semánticas y alimentar los resultados a un nodo LLM o de agente
- Referenciar resultados con expresiones como `$ragNode.results.map("item.payload.content").join("\n\n")`

En Heym, RAG son dos nodos con control total sobre los embeddings y la recuperación.

### Automatización de navegador con Playwright

El [nodo Playwright](../nodes/playwright-node.md) es automatización de navegador de primera parte en el canvas.

- **Modo Steps** – Componga visualmente acciones de navegar, hacer clic, escribir, rellenar, capturar pantalla, extraer y desplazar
- **Pasos con IA y auto-reparación** – Describa una acción en lenguaje natural y un LLM genera las acciones de Playwright; los selectores fallidos pueden repararse automáticamente, y los pasos generados pueden almacenarse en caché para omitir futuras llamadas al LLM
- **Modo Run Code** – Cambie el nodo a Playwright Python completo para flujos complejos (deshabilitado por defecto; se ejecuta en el sandbox reforzado de Heym cuando se habilita)
- **Sesiones autenticadas** – Restaure cookies/`storageState` antes de ejecutar, verifique el inicio de sesión con una comprobación de selector y recurra a pasos de inicio de sesión programados
- **Captura de red** – Opcionalmente recopile respuestas JSON, cabeceras, cookies y almacenamiento del navegador junto con los resultados

Heym trata el navegador como un nodo normal con las mismas expresiones, credenciales y manejo de errores que todo lo demás.

### Expression DSL

El [Expression DSL](../reference/expression-dsl.md) de Heym proporciona una sintaxis limpia y potente para referenciar datos de nodos anteriores:

- `$input.text` – Datos del Nodo de entrada
- `$nodeName.field` – Campo de salida de cualquier nodo anterior
- `$global.variableName` – Variables globales persistentes
- Ayudantes de arrays: `.first()`, `.map("field")`, `.join("\n")`

Las expresiones funcionan en todos los campos de texto, incluidos prompts, cabeceras HTTP, condiciones y valores establecidos, de modo que los datos se transfieren entre pasos de forma explícita. El DSL equilibra potencia y legibilidad sin requerir conocimientos completos de JavaScript.

## Ejecución

### Triggers, Reintentos y Rutas de Error

Un workflow puede iniciarse desde muchos lugares. Los nodos de [Entrada](../nodes/input-node.md) reciben [webhooks](../reference/webhooks.md) HTTP, [Cron](../nodes/cron-node.md) se ejecuta según una programación, y los [triggers](../reference/triggers.md) de eventos inician ejecuciones desde Telegram, Discord, Slack, buzones IMAP, flujos WebSocket, colas RabbitMQ, cargas de archivos y eventos de la plataforma Heym.

Los fallos se gestionan dentro del grafo. Cualquier nodo puede reintentar ante un fallo con un número determinado de intentos y una espera entre ellos; cada intento queda registrado en el [historial de ejecuciones](../reference/execution-history.md), y un nodo [Error Handler](../nodes/error-handler-node.md) se ejecuta automáticamente cuando un nodo falla, de modo que la recuperación forma parte del propio workflow.

### Ejecución DAG en Paralelo

El ejecutor de workflows de Heym utiliza un planificador de grafo acíclico dirigido (DAG). Los nodos independientes se ejecutan en paralelo automáticamente, sin necesidad de configuración.

- Los nodos del mismo nivel de dependencia se despachan de forma concurrente a un pool de hilos (`max_workers=8`)
- Tan pronto como finaliza cualquier nodo, sus nodos posteriores se programan
- El [Nodo Merge](../nodes/merge-node.md) combina los resultados de ramas paralelas
- Múltiples ejecuciones de workflow se ejecutan de forma concurrente; cada ejecución está totalmente aislada

El paralelismo es el comportamiento predeterminado, determinado por la estructura del grafo.

Consulte [Ejecución en Paralelo](../reference/parallel-execution.md).

### Escalado entre Instancias

Apunte una segunda instancia de Heym a la misma base de datos PostgreSQL y se unirá como worker. Las ejecuciones en segundo plano se comparten entre instancias según los pesos que usted establezca; un líder electo mantiene las programaciones, la evaluación de alertas y la recuperación ante fallos en funcionamiento a través de un failover, y cada ejecución registra la instancia que la ejecutó. Consulte [Distribución de Carga](../reference/cluster.md).

### Tablero Kanban Agéntico

La [pestaña Board](../tabs/board-tab.md) es un tablero Kanban integrado en el que las propias columnas ejecutan workflows. Una tarjeta es un trabajo agéntico persistente que transporta contexto, historial de conversación, estado de ejecución, salidas y ejecuciones de workflow.

- **Cadenas de workflow por columna** – Mover una tarjeta a una columna activa la cadena de workflow de esa columna; un **Agentic Kanban Model** (su credencial + modelo) mapea el contenido de la tarjeta a las entradas del workflow y convierte las salidas de nuevo en texto legible
- **Adjuntos de tarjeta** – Suelte archivos sobre una tarjeta; los documentos se extraen a texto y las imágenes se pasan a modelos con capacidad de visión antes de cada ejecución
- **Canvas de ejecución en vivo** – Abra la ejecución activa dentro de una tarjeta y obsérvela ejecutarse en el canvas real del workflow, nodo a nodo
- **Uso compartido en equipo** – Comparta tableros con usuarios o equipos con permisos de lectura/escritura; las cadenas en tableros compartidos se ejecutan con las credenciales del propietario, de modo que los colaboradores nunca necesitan las suyas propias
- **Visibilidad de fallos** – Las tarjetas fallidas muestran un indicador de historial de errores, y las ejecuciones de seguimiento pueden pausarse para esperar comentarios

El tablero es una superficie nativa de la plataforma: tarjetas, workflows, credenciales y ejecuciones en vivo conviven en un mismo lugar.

### Heym Drive: Almacenamiento de Archivos Integrado

La [pestaña Drive](../tabs/drive-tab.md) es un almacén de archivos integrado en la plataforma. Los archivos generados por skills y workflows (PDF, DOCX, CSV, imágenes) se depositan allí automáticamente, y los adjuntos de las tarjetas del tablero también se almacenan allí.

- **Enlaces para compartir** – Enlaces de descarga públicos o protegidos con contraseña (Basic Auth) con caducidad opcional y límites máximos de descargas
- **Uso compartido en equipo** – Comparta archivos en modo solo lectura con sus equipos, y elimine todos los recursos compartidos de equipo en una sola acción
- **Acciones masivas** – Selección múltiple con rangos mediante shift-clic, agrupe selecciones en una única descarga ZIP, o aplique una misma configuración de compartir/contraseña/eliminar a muchos archivos a la vez
- **Acceso de agentes** – Los skills pueden habilitar la lectura de archivos de Drive, de modo que un agente puede trabajar sobre documentos que usted u otros workflows hayan producido

Los artefactos generados obtienen un hogar permanente y compartible dentro de la plataforma.

## Observación

### Trazas de LLM

La [pestaña Traces](../tabs/traces-tab.md) proporciona observabilidad completa para cada llamada al LLM:

- Payloads de solicitud y respuesta
- Tiempos por llamada: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Nombres de llamadas a herramientas, argumentos y resultados
- Skills pasados al modelo

El sistema de trazas está diseñado específicamente para depurar el comportamiento agéntico, con payloads completos de solicitud y respuesta y tiempos por llamada.

### Seguimiento de costes de tokens de LLM

Cada llamada a un LLM en Heym se costea automáticamente. La [Pestaña Trazas](../tabs/traces-tab.md) muestra los recuentos de tokens de entrada y salida por traza junto con un coste en USD en tiempo real derivado de una tabla de precios sincronizada.

- **Coste por traza** – Tokens de entrada, tokens de salida y USD total mostrados en cada fila de traza
- **Analítica de costes** – Las tarjetas de KPI y un gráfico de coste por modelo se actualizan con el rango de tiempo seleccionado (1h / 24h / 7d / 30d / All)
- **Tabla de costes de LLM** – Una tabla del sistema en la [Pestaña DataTable](../tabs/datatable-tab.md) se inicializa desde Helicone cada 24 horas; es posible sobrescribir precios o añadir filas personalizadas para modelos aún no listados
- **Aviso de precio ausente** – Las trazas de modelos sin entrada de precios muestran un aviso en línea con un enlace directo a la tabla de costes

Cada ejecución conlleva su propio coste en USD, desglosado por modelo.

### Abrir ejecuciones de producción en un Canvas en vivo

Un workflow de producción permanece inspeccionable después de iniciarse fuera del editor. Abra cualquier entrada **Running** desde cualquiera de los diálogos de Historial, o abra la ejecución activa dentro de una tarjeta de Agentic Kanban, y Heym adjunta el editor de workflows habitual a esa ejecución exacta.

- Los nodos que ya finalizaron aparecen con sus resultados de inmediato
- El nodo actual y los nodos posteriores pendientes siguen pulsando a medida que avanza la ejecución
- El panel de Debug recibe los mismos resultados incrementales de nodos que una ejecución iniciada desde el canvas
- La salida final y los resaltados de ejecución llegan sin polling ni iniciar una ejecución duplicada
- Cerrar el editor solo desconecta al observador; nunca cancela el workflow de producción

El observador utiliza SSE respaldado por una instantánea de ejecución entre workers, por lo que funciona para triggers de webhook, programación, chat, MCP, integración y Board incluso cuando otro worker del backend posee la ejecución.

### OpenTelemetry, Analítica y Alertas

Heym emite spans de [OpenTelemetry](../reference/opentelemetry.md) para cada ejecución de workflow, ejecución de nodo e invocación de herramienta de Agent, exportados vía OTLP/HTTP a Jaeger, Grafana Tempo, Honeycomb, Datadog o cualquier otro backend compatible.

La pestaña [Analytics](../tabs/analytics-tab.md) rastrea recuentos de ejecuciones, tasa de éxito, duración y tendencias por workflow. Las [Alertas](../tabs/alerts-tab.md) vigilan recuentos de errores, duración de ejecución, gasto en tokens o USD y volumen de ejecuciones en una ventana de tiempo, y luego ejecutan un workflow de notificación que usted elija, de modo que una alerta llega a Slack, correo electrónico, Telegram o cualquier otro lugar al que pueda llegar un nodo.

## Evaluar

### Evaluaciones integradas

La [Pestaña Evals](../tabs/evals-tab.md) permite definir suites de pruebas y ejecutarlas contra sus workflows de agentes:

- Cree casos de prueba con entradas y salidas esperadas, o genérelos a partir del prompt de la suite
- Ejecute una suite contra varios modelos y compare sus salidas en paralelo
- Puntúe con Exact Match, Contains o LLM-as-Judge con un modelo juez independiente
- Revise aprobado/fallido, real vs esperado e historial de ejecuciones

Cambie un prompt o un modelo, vuelva a ejecutar la suite y compare los resultados antes de que el cambio llegue a producción.

## Controlar

### Human-in-the-Loop (HITL)

Heym tiene un sistema integrado de [Human-in-the-Loop](../reference/human-in-the-loop.md) que permite a los agentes pausar la ejecución, solicitar revisión humana y reanudar exactamente desde donde lo dejaron.

- **Puntos de control del agente** – Active `hitlEnabled` en cualquier Nodo de agente para dotarlo de una herramienta `request_human_review`. El agente decide cuándo una decisión requiere supervisión humana y llama a la herramienta con un resumen y un borrador.
- **URLs de revisión públicas** – Cada solicitud de revisión genera un enlace seguro de un solo uso en `/review/{token}` (TTL de 168 horas). Los revisores pueden **aceptar**, **editar y continuar** o **rechazar** sin iniciar sesión.
- **Instantáneas de ejecución** – El workflow congela su estado completo (historial de conversación, variables, resultados de herramientas) para reanudar exactamente donde se pausó tras la respuesta del revisor.
- **Rama de notificación** – Un handle de salida `review` opcional permite conectar un flujo de notificación (Slack, correo electrónico, webhook) que se dispara cuando se solicita una revisión.
- **Políticas de aprobación de herramientas MCP** – Las directrices HITL escritas se interpretan como ámbitos de aprobación (`always` / `once` / `never`) para que el agente pueda autoaprobar herramientas de bajo riesgo y escalar las de alto riesgo.
- **Múltiples puntos de control** – Una sola ejecución de agente puede pausarse para revisión varias veces; cada punto de control es independiente.

Las URLs de revisión públicas, la edición y continuación, la ramificación de notificaciones y la reanudación basada en instantáneas funcionan desde el mismo punto de control del agente.

Consulte [Human-in-the-Loop](../reference/human-in-the-loop.md) para la referencia completa.

### Guardrails de LLM

Heym tiene [Guardrails](../reference/guardrails.md) integrados tanto en los nodos [LLM](../nodes/llm-node.md) como [Agent](../nodes/agent-node.md), de modo que es posible bloquear contenido inseguro antes de que una respuesta del modelo llegue a los pasos posteriores.

- **Conmutador de seguridad a nivel de nodo** – Active los guardrails directamente en el nodo que genera o procesa contenido dirigido al usuario
- **Cobertura amplia de políticas** – Bloquee violencia, discurso de odio, contenido sexual, NSFW/profanidad, acoso, actividad ilegal, solicitudes de datos personales e intentos de prompt injection
- **Detección multilingüe** – Aplique las mismas reglas de seguridad en turco, inglés, árabe, español y otros idiomas
- **Fallback nativo del workflow** – Cuando se bloquea un mensaje, el nodo lanza un error tipado de workflow que puede enrutarse a través de un [Error Handler](../nodes/error-handler-node.md)

La política de seguridad reside directamente dentro de la configuración del LLM y del Agent y se conecta directamente con la ramificación y el manejo de errores del workflow.

### Acceso, Credenciales y Auditoría

Los agentes actúan con credenciales reales, por lo que el acceso forma parte de la gobernanza. Las [Credenciales](../reference/credentials.md) se cifran en reposo, se enmascaran tras su creación y se pueden compartir con usuarios o [equipos](../reference/teams.md); los equipos también comparten workflows, variables, almacenes vectoriales y archivos de Drive. El [inicio de sesión único](../reference/sso.md) conecta cualquier proveedor de OpenID Connect, incluidos Okta, Entra ID, Keycloak, Auth0 y Google. El [registro de auditoría](../reference/audit.md) registra cada acción relevante para la seguridad con su actor, objetivo y resultado, y se transmite junto con los logs del contenedor al recolector de logs o SIEM que ya utilice.

### Self-Hosted: usted es dueño de sus datos

Heym se ejecuta en su infraestructura. Los workflows, las credenciales, el historial de ejecuciones y las trazas residen en su propia base de datos, y las llamadas a modelos parten de sus servidores hacia el proveedor que elija, o hacia un modelo que aloje usted mismo mediante Ollama o vLLM. Para agentes que procesan documentos sensibles, datos de clientes o bases de conocimiento propietarias, esto suele ser un requisito indispensable.

Heym se distribuye bajo la **Licencia MIT con la condición Commons Clause**. El código fuente está disponible: puede usarlo, modificarlo y autoalojarlo libremente. La Commons Clause restringe la venta del software, incluida la oferta de hosting de pago o servicios de consultoría/soporte cuyo valor derive sustancialmente de Heym. Para licencias comerciales, despliegues empresariales o soporte profesional, contacte con [enterprise@heym.run](mailto:enterprise@heym.run).

## Exponer

### APIs y Streaming

Los workflows son invocables por HTTP en `/api/workflows/{workflow_id}/execute`, que devuelve JSON, y en `/api/workflows/{workflow_id}/execute/stream`, que transmite eventos de nodo como Server-Sent Events mientras la ejecución avanza. Ambos comparten la autenticación a nivel de workflow, la limitación de tasa y la caché de respuestas. Consulte [Webhooks](../reference/webhooks.md) y [SSE Streaming](../reference/sse-streaming.md).

### Integración con MCP (Model Context Protocol)

Heym tiene soporte nativo de [MCP](../tabs/mcp-tab.md) en ambos lados:

- **Como cliente**: los Nodos de agente se conectan a servidores MCP externos (Filesystem, Browserbase, herramientas personalizadas) mediante stdio o SSE y consumen sus herramientas automáticamente
- **Como servidor**: los workflows con MCP activado se convierten en herramientas en el servidor predeterminado en `/api/mcp/sse`, o en servidores con nombre propio, con su propia URL y API key, de modo que Claude Desktop, Cursor y otros clientes MCP pueden invocar sus workflows de Heym directamente

Los agentes pueden consumir varios servidores MCP a la vez, y cualquier workflow puede convertirse en una herramienta para un cliente MCP externo.

### Portal: publique workflows como interfaces de Chat

La función [Portal](../reference/portal.md) convierte cualquier workflow en una interfaz de chat de acceso público en `/chat/{slug}`:

- Autenticación opcional con credenciales por usuario
- Ejecución en streaming (progreso de nodos en tiempo real)
- Soporte de carga de archivos
- Historial de conversación multiturno

Los equipos despliegan herramientas internas, chatbots de cara al cliente y formularios impulsados por IA a partir de un workflow y una URL, sin escribir código de frontend.

### Dashboards impulsados por workflows

La [pestaña Dashboard](../tabs/dashboard-tab.md) es una superficie de informes creada por el usuario en la que cada widget de gráfico se sustenta en su propio workflow oculto de Heym. Un widget puede llamar a APIs, consultar BigQuery, buscar en almacenes vectoriales/RAG, ejecutar pasos de LLM, transformar filas y finalizar con un [Nodo de salida de gráfico](../nodes/chart-output-node.md). Puede crear widgets manualmente, generarlos con IA, ajustarlos después, almacenar en caché los resultados y reorganizar la cuadrícula visualmente.

## Comparativa con herramientas de automatización de workflows

Muchos equipos llegan a Heym procedentes de herramientas de automatización de workflows. La tabla siguiente compara Heym con n8n, Zapier y Make.com en las capacidades que importan cuando los agentes se ejecutan en producción, y las notas a pie de página que aparecen debajo citan la documentación oficial en la que se basa la comparación. Para un análisis más detallado de cada herramienta por separado, consulte las páginas comparativas en [heym.run/compare](https://heym.run/compare).

| Capacidad | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nodo LLM integrado | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + ramas de estado | ✓ | limitado¹¹ | –¹¹ | limitado¹¹ |
| Nodo de agente integrado (tool calling) | ✓ | ✓ | ✓ | ✓ |
| Orquestación multiagente | ✓ | ✓ | limitado | limitado |
| Nodos de agente de programación (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / almacén vectorial integrado | ✓ | ✓ | limitado¹ | plugin² |
| Lectura / escritura WebSocket | ✓ | limitado¹² | –¹³ | –¹⁴ |
| Constructor de workflows en lenguaje natural | ✓ | limitado³ | ✓ | ✓ |
| Analizador de workflows | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Abrir una ejecución en curso en el canvas en vivo | ✓ | limitado¹⁹ | limitado¹⁹ | –¹⁹ |
| Dashboards impulsados por workflows | ✓ | limitado¹⁷ | limitado¹⁷ | limitado¹⁷ |
| Tablero Kanban agéntico | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Sistema de Skills para agentes | ✓ | – | – | – |
| Drive de archivos integrado (enlaces para compartir, equipos) | ✓ | limitado²² | limitado²² | –²² |
| Nodo de automatización de navegador (Playwright) | ✓ | limitado²³ | limitado²³ | –²³ |
| Inspección de trazas de LLM | ✓ | limitado⁴ | – | ✓ |
| Exportación de trazas con OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Seguimiento del coste de tokens de LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limitado¹⁵ |
| Evaluaciones integradas para workflows de IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limitado⁶ | limitado⁷ |
| Guardrails de LLM | ✓ | ✓⁸ | ✓⁸ | limitado⁸ |
| Compresión automática de contexto | ✓ | – | – | – |
| Ejecución paralela de DAG | ✓ | limitado⁹ | – | – |
| Autoalojable, código disponible | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL de expresiones para datos dinámicos | ✓ | ✓ | limitado | ✓ |

> **Notas al pie:** ¹ Zapier Knowledge Sources — no expone almacén vectorial ni control de embeddings. ² Make.com dispone de módulos de Pinecone/Qdrant, pero no de un Nodo RAG nativo. ³ n8n AI Workflow Builder es una beta exclusiva de la nube con límites de créditos. ⁴ n8n muestra los pasos intermedios; el trazado completo requiere herramientas de terceros. ⁵ n8n admite aprobaciones de llamadas a herramientas de IA a través de Chat, correo electrónico y canales de colaboración, pero no captura ni reanuda la ejecución completa como lo hace Heym. ⁶ Zapier Human in the Loop admite aprobaciones y recopilación de datos dentro de los Zaps, pero no es un sistema de checkpoints con revisión pública y reanudación desde snapshot. ⁷ Make.com ofrece Human in the Loop como una app Enterprise con solicitudes de revisión y resultados de ajustado/aprobado/cancelado, pero sigue limitado por el plan y es menos nativo para agentes. ⁸ n8n incluye un Nodo Guardrails dedicado, Zapier incluye AI Guardrails en todos sus productos de IA, y Make.com documenta reglas de agentes y flujos de revisión, pero no una funcionalidad de guardrails independiente comparable, por lo que Make se marca como limitado. ⁹ n8n ejecuta de forma secuencial por defecto; el paralelismo requiere soluciones alternativas mediante sub-workflows. ¹⁰ Sustainable Use License — autohospedaje gratuito para uso interno, redistribución comercial restringida. ¹¹ A fecha del 22 de abril de 2026, la documentación oficial de n8n describe patrones de batching HTTP y de bucle/espera en lugar de una rama nativa de estado de lote de LLM; la documentación oficial de la app ChatGPT de Zapier no lista Triggers y solo ofrece una beta genérica de API Request; y la página oficial de integración con OpenAI de Make expone acciones por lotes como create/watch completed, pero no un Nodo LLM de primera clase con ramificación por estado, por lo que n8n/Make se marcan como limitados y Zapier se marca como no disponible para este patrón de Workflow específico. ¹² La documentación oficial de n8n cubre los Nodos HTTP Webhook y HTTP Request, además de extensibilidad mediante Code/custom/community, pero no se ha podido encontrar un Nodo Trigger/send de WebSocket propio del fabricante, por lo que n8n se marca como limitado. ¹³ La documentación oficial de Zapier cubre Webhooks entrantes y solicitudes salientes por Webhook/API únicamente sobre HTTP, no pasos nativos de Trigger o envío por WebSocket. ¹⁴ La documentación oficial de Make cubre módulos de Webhooks y módulos de solicitudes HTTP(S), pero no se ha podido encontrar un módulo nativo de Trigger o envío por WebSocket. ¹⁵ n8n no dispone de seguimiento nativo del coste en Tokens de LLM; existen Workflows alternativos de la comunidad, pero requieren instalación manual y llamadas a la API posteriores a la ejecución (solicitud de funcionalidad abierta a fecha de mayo de 2026). Zapier no expone al usuario ningún recuento de Tokens ni coste en USD por ejecución; los pasos de IA solo consumen tareas. El panel de créditos de Make.com refleja parcialmente el consumo de Tokens de la IA alojada por Make (desde agosto de 2025), pero las conexiones con claves de API de terceros se facturan como 1 operación = 1 crédito sin recuento de Tokens; no hay desglose en USD por ejecución y por modelo. ¹⁶ Heym emite spans nativos de OpenTelemetry (uno por ejecución de Workflow más uno por Nodo) sobre OTLP/HTTP hacia cualquier backend compatible, con propagación de contexto de traza W3C y sin código de instrumentación, configurado mediante variables de entorno `HEYM_OTEL_*` y deshabilitado por defecto. n8n dispone de una integración documentada de trazado con OpenTelemetry para ejecuciones de Workflow y de Nodo. Zapier y Make.com no documentan la exportación por OpenTelemetry de las ejecuciones de sus Workflows/escenarios a fecha de junio de 2026. ¹⁷ n8n documenta un panel de Insights para métricas de ejecución en producción, Zapier documenta Zap History junto con Task Usage, y Make.com documenta Scenario History; se trata de superficies de monitorización/historial, no de widgets de panel personalizados respaldados por lógica de Workflow arbitraria como la pestaña Dashboard de Heym. ¹⁸ Heym Workflow Analyzer ejecuta el Workflow cuando es posible, lee el resultado de la ejecución y genera un informe Markdown compartido y editable que cubre áreas de mejora, propósito y comportamiento paso a paso. n8n documenta AI Workflow Builder para crear/refinar/depurar Workflows, Zapier documenta la resolución de problemas con IA para ejecuciones de Zap con errores, y Make.com documenta el historial de escenarios junto con los pasos de razonamiento del agente de IA, pero su documentación pública no describe el mismo documento compartido de análisis de Workflow consciente de la ejecución. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) lista las ejecuciones en curso y puede cargar datos de una ejecución anterior en el editor, mientras que [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) expone un estado en ejecución en su editor. [Make Scenario History](https://help.make.com/scenario-history) documenta el detalle de ejecución y los logs. Su documentación pública, consultada el 18 de julio de 2026, no describe el flujo exacto de Heym: abrir una ejecución de producción arbitraria en curso desde Historial o desde una tarjeta Kanban, restaurar su snapshot actual de Nodo y seguir recibiendo la animación de Nodos y los logs de Debug en el mismo Canvas. ²⁰ Los Nodos [Codex](../nodes/codex-node.md) y [OpenCode Go](../nodes/opencode-go-node.md) de Heym ejecutan un CLI real de agente de programación en un espacio de trabajo aislado de Heym contra un repositorio de GitHub — clonar, editar, producir un diff, hacer push de una rama, abrir un pull request — como un paso de Workflow de primera clase. A fecha del 20 de julio de 2026, ningún competidor documenta un equivalente: el [Nodo OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) de n8n cubre llamadas a la API de chat/assistant, no un agente de programación a nivel de repositorio, y el soporte nativo de Codex sigue siendo una solicitud de la comunidad; el propio blog de Zapier documenta la dirección inversa — [Codex impulsando herramientas de Zapier a través de Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — no Codex como paso de un Zap; los módulos de OpenAI de Make.com exponen acciones de completions/assistants/batch, no un agente de programación que clone repositorios y abra PRs. ²¹ La [pestaña Board](../tabs/board-tab.md) de Heym es un tablero Kanban agéntico integrado cuyas columnas ejecutan Workflows y cuyas tarjetas transportan contexto, historial de conversación, estado de ejecución y ejecuciones. n8n ([integración con Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([integraciones con Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) y Make.com ([integración con Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) solo se conectan a apps de kanban de terceros como Kanban Tool, Wekan o NocoDB; ninguno documenta un tablero integrado que ejecute sus propios Workflows, a fecha del 20 de julio de 2026. ²² n8n almacena internamente los datos binarios de ejecución (opcionalmente en [almacenamiento externo compatible con S3](https://docs.n8n.io/hosting/scaling/external-storage/)), pero no documenta ninguna unidad de archivos orientada al usuario con enlaces para compartir o uso compartido en equipo, por lo que se marca como limitado. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) de Zapier procesa archivos solo durante la ejecución de un Zap y [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) almacena pequeños valores de texto, por lo que Zapier se marca como limitado. Los [almacenes de datos](https://help.make.com/l6du-data-stores) de Make.com contienen registros estructurados y su [gestión de archivos](https://help.make.com/working-with-files) transfiere archivos entre apps sin almacenamiento integrado persistente, por lo que Make se marca como no disponible. ²³ El [Nodo Playwright](../nodes/playwright-node.md) de Heym es automatización de navegador propia con un modo visual de pasos, pasos generados por IA y un modo de código completo. n8n solo ofrece paquetes de la comunidad como [n8n-playwright](https://github.com/toema/n8n-playwright) con una [solicitud de funcionalidad aún abierta para Nodos nativos de automatización de navegador](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), por lo que se marca como limitado. Zapier Agents puede [navegar y leer páginas mediante navegación web y una extensión de Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), pero Zapier no documenta ningún paso de automatización de navegador mediante scripts, por lo que se marca como limitado. Make.com documenta módulos HTTP y apps de scraping de terceros en lugar de cualquier módulo nativo de automatización de navegador, a fecha del 20 de julio de 2026.

## Relacionado

- [Introducción](./introduction.md) – Descripción general de la plataforma
- [Inicio rápido](./quick-start.md) – Cree su primer workflow
- [Análisis de workflows](../reference/workflow-analysis.md) – Genere informes compartidos de workflows con reconocimiento de ejecuciones y comentarios de mejora
- [Pestaña Dashboard](../tabs/dashboard-tab.md) – Cree dashboards respaldados por workflows con widgets de gráficos generados por IA
- [Nodo de agente](../nodes/agent-node.md) – Nodo LLM con llamadas a herramientas, MCP y skills
- [Arquitectura de agentes](../reference/agent-architecture.md) – Subagentes, orquestador y despacho de herramientas
- [Pestaña Board](../tabs/board-tab.md) – Tablero Kanban agéntico con columnas que ejecutan workflows
- [Nodo Codex](../nodes/codex-node.md) – Ejecute el agente de programación OpenAI Codex contra un repositorio de GitHub
- [Nodo OpenCode Go](../nodes/opencode-go-node.md) – Agente de programación agnóstico de proveedor en un contenedor reforzado
- [Pestaña Drive](../tabs/drive-tab.md) – Almacenamiento de archivos integrado con enlaces para compartir, equipos y acciones masivas
- [Nodo Playwright](../nodes/playwright-node.md) – Automatización de navegador propia con pasos de IA y modo código
- [Nodo RAG / Almacén vectorial](../nodes/rag-node.md) – Búsqueda vectorial e inserción de documentos (Qdrant o Postgres pgvector)
- [Asistente de IA](../reference/ai-assistant.md) – Constructor de workflows en lenguaje natural
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Puntos de control de agentes con URLs públicas de revisión
- [Guardrails](../reference/guardrails.md) – Bloquee prompts inseguros antes de que lleguen a sus modelos
- [Pestaña Traces](../tabs/traces-tab.md) – Observabilidad de llamadas LLM
- [Pestaña Evals](../tabs/evals-tab.md) – Suites de pruebas para workflows de IA
- [Pestaña Alerts](../tabs/alerts-tab.md) – Alertas de umbral sobre errores, duración, coste y volumen de ejecuciones
- [Trazado con OpenTelemetry](../reference/opentelemetry.md) – Exporte spans de ejecuciones, nodos y herramientas mediante OTLP
- [Distribución de carga](../reference/cluster.md) – Comparta ejecuciones entre instancias con failover de líder
- [Inicio de sesión único](../reference/sso.md) – Inicie sesión a través de cualquier proveedor de OpenID Connect
- [Registro de auditoría](../reference/audit.md) – Acciones relevantes para la seguridad con actor, objetivo y resultado
- [Portal](../reference/portal.md) – Publique workflows como interfaces de chat públicas
- [Ejecución en paralelo](../reference/parallel-execution.md) – Ejecución concurrente basada en DAG
- [Pestaña MCP](../tabs/mcp-tab.md) – Configuración del servidor y cliente MCP

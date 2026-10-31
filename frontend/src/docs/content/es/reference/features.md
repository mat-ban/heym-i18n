# Conjunto completo de funciones de Heym

Una visión general exhaustiva de todas las capacidades de Heym. Cada sección describe una función o concepto en unas pocas frases.

---

## Primeros pasos

### [Introducción](../getting-started/introduction.md)

Heym es infraestructura para ejecutar y gobernar agentes de IA en producción. Usted construye sistemas agénticos sobre un canvas visual y los ejecuta con confianza: orqueste agentes, automatice procesos de negocio, inspeccione cada ejecución y mantenga a las personas en control sobre su propia infraestructura. Admite workflows visuales, nodos impulsados por IA ([LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), un [Asistente de IA](./ai-assistant.md), integraciones ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), correo electrónico entrante mediante [IMAP Trigger](../nodes/imap-trigger-node.md), saliente mediante [Send Email](../nodes/send-email-node.md)), programación con [Cron](../nodes/cron-node.md) y portales de chat de [Portal](./portal.md) para usuarios finales.

Consulte también [Conceptos básicos](../getting-started/core-concepts.md), [Tipos de nodos](./node-types.md) e [Integraciones de terceros](./integrations.md).

### [Por qué Heym](../getting-started/why-heym.md)

Por qué Heym recorre el ciclo de vida del agente (construir, orquestar, ejecutar, observar, evaluar, controlar, exponer) y muestra lo que un único runtime autoalojado gestiona en cada etapa. Esto abarca el nodo [LLM](../nodes/llm-node.md) y el [Nodo Agent](../nodes/agent-node.md) con llamada a herramientas, herramientas de Python, conexiones [MCP](../tabs/mcp-tab.md), skills y orquestación multiagente; triggers, reintentos y [distribución de carga](./cluster.md); [Trazas](../tabs/traces-tab.md) con coste en USD por ejecución y exportación a OpenTelemetry; [Evaluaciones](../tabs/evals-tab.md); [puntos de control de revisión humana](./human-in-the-loop.md), guardrails, SSO y una pista de auditoría; y endpoints REST, MCP y Portal. La página cierra con una comparativa de capacidades frente a n8n, Zapier y Make.com.

Consulte también [Nodo Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) y [Arquitectura de agentes](./agent-architecture.md).

### [Inicio rápido](../getting-started/quick-start.md)

Ponga en marcha su primer workflow en minutos: cree un workflow desde la pestaña [Workflows](../tabs/workflows-tab.md), añada un nodo [Input](../nodes/input-node.md), un nodo [LLM](../nodes/llm-node.md) y un nodo [Output](../nodes/output-node.md), y luego conéctelos. Configure el [LLM](../nodes/llm-node.md) con una credencial y establezca `userMessage` en `$input.text`; utilice Run o el [Asistente de IA](./ai-assistant.md) para ejecutar o generar workflows con lenguaje natural.

Se combina de forma natural con [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) y [Expression DSL](./expression-dsl.md).

### [Conceptos básicos](../getting-started/core-concepts.md)

Los workflows son grafos dirigidos de nodos conectados por aristas; la ejecución fluye desde los nodos de entrada ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) a través de los nodos de procesamiento hasta los nodos [Output](../nodes/output-node.md). Cada nodo tiene un tipo, datos (configuración) y entradas/salidas; las aristas definen el flujo de datos. Los nodos referencian datos anteriores mediante expresiones de [Expression DSL](./expression-dsl.md) como `$nodeLabel.field`; los nodos independientes se ejecutan en [paralelo](./parallel-execution.md) automáticamente.

Consulte también [Triggers](./triggers.md), [Ejecución en paralelo](./parallel-execution.md) y [Estructura del workflow](./workflow-structure.md).

### [Ejecución y despliegue](../getting-started/running-and-deployment.md)

Heym proporciona `run.sh` para desarrollo local (base de datos en Docker, backend FastAPI, frontend Vite) y `deploy.sh` para producción con Docker Compose. Ambos utilizan un archivo `.env`; las variables clave incluyen `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` y `ALLOW_REGISTER`. El desarrollo se ejecuta en puertos configurables de frontend y backend; producción sirve la API bajo `/api` a través del contenedor de frontend.

Consulte también [Seguridad](./security.md), [Enterprise](./enterprise.md) y [Configuración](./user-settings.md).
### [Migrar a Heym](../getting-started/migrate-to-heym.md)

La herramienta AI Convert convierte un workflow de otra plataforma (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) o una descripción en lenguaje natural en un workflow de Heym, transmitido en vivo sobre un canvas y listo para [descargar e importar](./download-import.md). Ejecuta una verificación de seguridad de IA y, a continuación, genera el DSL con los límites de entrada y de tasa ya establecidos. Ábrala en [heym.run/convert](https://heym.run/convert).

Consulte también [Inicio rápido](../getting-started/quick-start.md), [Descargar e importar](./download-import.md) y [Asistente de IA](./ai-assistant.md).

---

## Nodos

### Triggers

#### [Input](../nodes/input-node.md)

El Nodo Input es el punto de entrada para los workflows que reciben datos del usuario o del llamador de la API. Admite uno o varios campos de entrada y expone metadatos de la solicitud (headers, query params). Acceda a los campos del body mediante `$nodeLabel.body.fieldKey`, a los headers mediante `$nodeLabel.headers` y a la query mediante `$nodeLabel.query`.

Se combina de forma natural con [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) y [Output](../nodes/output-node.md). Para referencias de payload y acceso a campos, consulte [Expression DSL](./expression-dsl.md) y [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

El Nodo Cron activa un workflow según una programación mediante una expresión cron estándar de cinco campos. No se requiere entrada del usuario: el workflow se ejecuta automáticamente en los momentos especificados (por ejemplo, cada hora, a diario, cada 15 minutos). La salida es un evento de trigger sin payload.

Consulte también [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) y [Historial de ejecuciones](./execution-history.md) para ejecuciones programadas y diferidas.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

El Nodo IMAP Trigger consulta un buzón de entrada a intervalos de minutos configurables e inicia un workflow por cada correo electrónico recién detectado. Genera como salida los headers analizados, las listas de remitentes y destinatarios, los cuerpos en texto plano y HTML, los metadatos de los archivos adjuntos y una marca temporal del trigger. Utilícelo para la clasificación de buzones de soporte, el enrutamiento de correo a [Slack](../nodes/slack-node.md) o flujos de aprobación basados en correo electrónico con [Human-in-the-Loop](./human-in-the-loop.md).

Se combina con [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) y [Slack](../nodes/slack-node.md) para workflows de clasificación y respuesta de correo entrante.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

El Nodo Heym Trigger inicia un workflow cuando Heym mismo publica un evento de plataforma: `heym.started`, `workflow.created`, `workflow.updated` o `workflow.deleted`. La entrega se realiza por lotes: cada evento publicado dentro de una misma ventana de despacho de cinco segundos llega en una única ejecución como `$nodeLabel.events`, siempre un array. Cada evento se reclama mediante una restricción única de base de datos, por lo que se activa exactamente una vez por cada nodo suscriptor, independientemente de cuántos workers, contenedores o máquinas estén en ejecución. Utilícelo para pistas de auditoría de cambios en workflows, anuncios de despliegue y resúmenes de estado de la instancia.

Se combina con el nodo [Heym](../nodes/heym-node.md) para consultar el workflow modificado y con [Loop](../nodes/loop-node.md) para actuar una vez por evento.

#### [Heym](../nodes/heym-node.md)

El Nodo Heym lee los datos propios de Heym mediante tres operaciones: `listWorkflows` devuelve todos los workflows a los que el propietario puede acceder, con recuentos de nodos y marcas temporales; `getWorkflow` devuelve la estructura de nodos y aristas de un workflow; y `getExecutionHistory` devuelve las entradas del historial de ejecuciones, de la más reciente a la más antigua, con filtros opcionales de estado, ventana temporal y límite, junto con los totales agrupados por estado. Los resultados están acotados al propietario del workflow en el que reside el nodo, por lo que una ejecución iniciada por cron, un portal o un evento devuelve los mismos datos que una ejecución manual. `getWorkflow` devuelve la configuración completa de los nodos, lo que permite auditar un workflow en busca de claves o tokens codificados de forma fija; no expone nada que el propietario del workflow no pudiera ya abrir en el editor. No se requiere ninguna credencial.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

El Nodo WebSocket Trigger abre una conexión de cliente saliente hacia un servidor WebSocket externo e inicia el workflow en `onMessage`, `onConnected` u `onClosed`. Expone los payloads de mensajes analizados, el estado de reconexión, los metadatos de cierre y la URL del socket para las expresiones posteriores.

Se combina con [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) y [SSE Streaming](./sse-streaming.md) para integraciones en tiempo real.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

El Nodo Telegram Trigger recibe las actualizaciones del webhook del bot e inicia el workflow de inmediato. Expone el payload completo de la actualización, el objeto de mensaje principal, las callback queries, los headers saneados y una marca temporal del trigger. Utilícelo para chatbots, asistentes de IA en [Telegram](../nodes/telegram-node.md) y flujos controlados por botones.

Se combina con [Telegram](../nodes/telegram-node.md), [Nodo Agent](../nodes/agent-node.md) y [Webhooks](./webhooks.md) para workflows controlados por bots.
#### [Slack Trigger](../nodes/slack-trigger-node.md)

El nodo Slack Trigger recibe webhooks de la API de Slack Events e inicia un workflow automáticamente tras verificar la firma de la solicitud. Expone el payload del evento y los encabezados saneados para el enrutamiento posterior, la clasificación basada en [LLM](../nodes/llm-node.md) y los flujos de respuesta.

Se combina con [Slack](../nodes/slack-node.md), [Nodo Agent](../nodes/agent-node.md) y [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

El nodo Discord Trigger recibe webhooks de la API de Discord Interactions, verifica las firmas Ed25519 con la credencial `discord_trigger` seleccionada e inicia el workflow. Expone el payload completo de la interacción, los datos del comando, los encabezados saneados y los metadatos del trigger para el enrutamiento posterior o las respuestas.

Se combina con [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Nodo Agent](../nodes/agent-node.md) y [Third-Party Integrations](./integrations.md).

#### [RabbitMQ](../nodes/rabbitmq-node.md)

El nodo RabbitMQ envía o recibe mensajes de colas y exchanges de RabbitMQ. Utilícelo para workflows basados en mensajes y procesamiento de eventos. El modo de envío publica un mensaje con retardo opcional; el modo de recepción actúa como [trigger](./triggers.md), de modo que el workflow se inicia cuando llega un mensaje. La salida incluye status, message_id y body.

Se combina con [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) y [Parallel Execution](./parallel-execution.md) para el procesamiento basado en eventos.

#### [Error Handler](../nodes/error-handler-node.md)

El nodo Error Handler se ejecuta automáticamente cuando falla cualquier nodo del workflow. No se necesitan aristas entrantes; lo activa el motor. La salida incluye el mensaje de error, la etiqueta del nodo fallido, el tipo de nodo y la marca temporal. Utilícelo para enviar notificaciones a través de [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) o [Send Email](../nodes/send-email-node.md), registrar errores o devolver respuestas de error personalizadas.

Como alternativa a la gestión de errores en el canvas, un workflow también puede delegar los fallos a un workflow independiente; consulte [Error Workflow](#error-workflow). Si el canvas ya contiene un nodo Error Handler, el error workflow **no** se invoca (el manejador local tiene prioridad).

Los destinos de notificación habituales son [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) y [Send Email](../nodes/send-email-node.md); los detalles de ejecución son más fáciles de inspeccionar en [Execution History](./execution-history.md).

### AI
#### [Nodo Agent](../nodes/agent-node.md)

El nodo AI Agent es un nodo [LLM](../nodes/llm-node.md) con llamada a herramientas. Puede ejecutar herramientas de Python, invocar nodos conectados del canvas como herramientas, conectarse a servidores [MCP](../tabs/mcp-tab.md), utilizar skills (archivos de instrucciones y scripts de Python opcionales), actuar como orquestador que delega en otros nodos agent y llamar a otros workflows como herramientas. La salida está disponible como `$nodeLabel.text`. Un toggle opcional **Extra Body** adjunta un objeto JSON de parámetros de solicitud específicos del proveedor a cada solicitud del bucle de llamada a herramientas; está desactivado de forma predeterminada. Un toggle opcional **Use Responses API** enruta las llamadas al modelo del agente a través de la Responses API, lo que preserva el razonamiento del modelo entre llamadas a herramientas, de modo que un modelo de razonamiento mantiene su cadena de pensamiento a lo largo de un bucle de varios pasos; está desactivado de forma predeterminada y funciona con OpenAI y credenciales personalizadas.

Las herramientas de nodos del canvas permiten que un agente invoque directamente nodos de workflow configurados desde el canvas. Conecte un nodo compatible al handle de herramientas del agente y, a continuación, marque campos específicos como proporcionados por el agente con el icono del bot. Esos campos se convierten en parámetros de herramienta en tiempo de ejecución, mientras que las credenciales y los campos no marcados permanecen fijos en la configuración del nodo.

La sección Skills ahora incluye **AI Build** para crear nuevas skills, una acción de edición con IA en línea para skills existentes, la descarga ZIP por skill y un switch opcional **Enable Drive files** para skills que necesitan leer archivos de Heym Drive en tiempo de ejecución. El modal Skill Builder transmite una conversación de chat a la izquierda, acepta archivos arrastrados y soltados con cada comentario de ajuste, muestra una vista previa en vivo de solo lectura de los archivos `SKILL.md` y `.py` generados a la derecha, puede descargar esa vista previa como un ZIP y guarda los archivos de ajuste cargados de nuevo como assets empaquetados de la skill a través del mismo flujo de ingesta ZIP que utilizan las cargas manuales.

Con **[Agent Persistent Memory](./agent-persistent-memory.md)** habilitada, cada nodo agent mantiene su propio grafo de conocimiento: los hechos se cargan en el system prompt cuando no está vacío, y las ejecuciones correctas activan una fusión en segundo plano de nuevas entidades y relaciones. Los subagentes utilizan grafos independientes. Puede **compartir** el grafo de un agente con otros agentes (del mismo workflow u otro) con acceso de solo lectura o de lectura/escritura desde el diálogo del grafo. El control de cerebro del canvas abre el editor del grafo.

Los nodos agent también pueden entrar en modo [Human-in-the-Loop](./human-in-the-loop.md). En este modo, el agente obtiene una herramienta `request_human_review` y puede pausarse en pasos específicos que requieren aprobación, crear un enlace de revisión público de un solo uso, exponer una rama `review` del canvas para flujos de notificación y esperar hasta que un revisor acepte, edite o rechace el texto de revisión en Markdown. El campo HITL del nodo actúa como directrices de aprobación sobre cuándo preguntar, mientras que el resumen dirigido al revisor se genera a partir de cada solicitud de revisión. Para las herramientas [MCP](../tabs/mcp-tab.md), Heym utiliza el modelo para interpretar esas instrucciones escritas como `always`, `once` o `never`, de modo que el lenguaje de aprobación en formato libre se asigna a una política de ejecución concreta. La ejecución se marca como `pending` y se reanuda desde la instantánea de ejecución almacenada una vez que llega la decisión, y la misma ejecución del agente puede pausarse más de una vez si los pasos posteriores también requieren revisión.

Los nodos agent comprimen automáticamente su historial de mensajes acumulado cuando se aproxima al 80 % de la ventana de contexto del modelo. El system prompt, el primer mensaje del usuario y el mensaje más reciente del usuario siempre se conservan; todo lo intermedio se resume utilizando el mismo modelo y la misma credencial. Los eventos de compresión son visibles en el panel Debug, el [Historial de ejecuciones](./execution-history.md) y la pestaña [Traces](../tabs/traces-tab.md).

Consulte también [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) y [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

El nodo Codex ejecuta la CLI de OpenAI Codex dentro de un espacio de trabajo aislado de Heym. Acepta una credencial de Codex (inicie sesión con ChatGPT para usar su suscripción sin costes de API por token, o pegue un token de acceso), una credencial de GitHub, la URL del repositorio, la rama base, el prompt de la tarea, el modo de publicación (`diff_only` o `draft_pr`), el nombre de la rama y el tiempo de espera. El runner clona el repositorio localmente, pasa el paquete de tokens de ChatGPT o `CODEX_ACCESS_TOKEN` únicamente al proceso de Codex, y devuelve un resumen estructurado, notas de validación, archivos modificados, el diff, metadatos de uso y una URL opcional de PR en borrador.

Cuando Codex devuelve `needs_input`, el workflow se pausa y expone la rama `question`. Conecte esa rama a Slack, correo electrónico u otro nodo de notificación; el enlace público de seguimiento reanuda la instantánea de ejecución guardada una vez enviada la respuesta. El nodo Codex también puede adjuntarse a un Agente de IA como herramienta, lo que permite al agente delegar tareas de programación; como herramienta, un resultado `needs_input` se devuelve en línea al agente en lugar de pausar el workflow.

Consulte también [GitHub](../nodes/github-node.md), [Credenciales](./credentials.md), [Uso compartido de credenciales](./credentials-sharing.md) y [Tipos de nodo](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

El nodo OpenCode Go ejecuta la CLI de OpenCode (Go) contra un repositorio de GitHub. El aislamiento sigue el patrón de Codex: localmente se ejecuta como un subproceso del host, mientras que los despliegues con Docker lo ejecutan dentro de un contenedor hermano reforzado que comparte el volumen del espacio de trabajo. Acepta una credencial de OpenCode Go (una clave de API de gateway con una URL base opcional), una credencial de GitHub, la URL del repositorio, la rama base, el prompt de la tarea, el modo de publicación, el nombre de la rama, el tiempo de espera y un modelo `opencode-go/<model>` elegido de una lista de modelos dinámica y con búsqueda (con una alternativa integrada). Heym realiza todas las operaciones de git/GitHub en el host y nunca coloca el token de GitHub dentro del sandbox; OpenCode solo edita archivos en disco. El nodo devuelve un resumen estructurado, notas de validación, archivos modificados, el diff y una URL opcional de pull request. Puede adjuntarse a un Agente de IA como herramienta.

Consulte también [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Credenciales](./credentials.md), [Uso compartido de credenciales](./credentials-sharing.md) y [Tipos de nodo](./node-types.md).

#### [LLM](../nodes/llm-node.md)

El nodo LLM procesa texto con un modelo de lenguaje o genera imágenes. Admite generación de texto, visión (entrada de imágenes), generación de imágenes, salida JSON estructurada, ejecución de Batch API nativa del proveedor para endpoints compatibles con OpenAI y OpenAI, y un conmutador opcional **Use Responses API** que enruta la llamada a través de la Responses API en lugar de Chat Completions (desactivado por defecto; funciona con OpenAI y credenciales personalizadas, y no puede combinarse con el modo Batch). Configure la credencial, el modelo, los mensajes de sistema y de usuario, la temperatura y los tokens máximos; utilice [Expression DSL](./expression-dsl.md) en los prompts. En modo batch, `userMessage` debe resolverse en un array, el nodo emite una rama `batchStatus` con actualizaciones de progreso, y la salida final incluye los resultados del batch por elemento. Un conmutador opcional **Extra Body** adjunta un objeto JSON de parámetros de solicitud específicos del proveedor (por ejemplo, `{"thinking": {"type": "disabled"}}`) a cada llamada a la API; está desactivado por defecto. Los [Guardrails](./guardrails.md) opcionales bloquean contenido no seguro antes de la llamada.

Se combina de forma natural con [Qdrant RAG](../nodes/rag-node.md), [Nodo Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) y [Diálogo de evaluación de expresiones](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

El nodo Decision plantea preguntas tipadas a un modelo de decisión sobre el estado de la ejecución y devuelve probabilidades en lugar de texto. Un campo **State** transporta lo que el modelo debe leer —una expresión aislada conserva su propio tipo, por lo que `$input` envía el objeto en lugar de su texto— y una lista de preguntas transporta los juicios. Las preguntas adoptan tres formas: **noul** responde si se cumple una condición, **choice** elige una opción de un conjunto que usted define y devuelve la distribución completa, y **score** puntúa el estado a lo largo de niveles ordenados y puede situarse entre ellos. Las respuestas de choice y score también incluyen una confianza, de modo que un [Switch](../nodes/switch-node.md) puede enrutar según la respuesta mientras un [Condition](../nodes/condition-node.md) condiciona según la certeza de esta. **Generate with AI** redacta la plantilla de estado y las filas de preguntas a partir de una frase sencilla, y **Custom request body** envía JSON escrito a mano para un endpoint cuyo contrato difiere. La respuesta del proveedor se transmite sin cambios y cada llamada se registra en [Trazas](../tabs/traces-tab.md).

Requiere una credencial de Decision Model; se combina de forma natural con [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) y [Nodo Agent](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

El nodo RAG / Vector Store inserta, actualiza (upsert), elimina y busca documentos en un almacén vectorial para la generación aumentada por recuperación. Un menú desplegable de Base de datos selecciona el backend — **Qdrant** (servidor externo) o **Postgres (pgvector)** (la base de datos propia de Heym, sin servicio externo), con Qdrant como valor predeterminado. Seleccione un almacén vectorial desde la pestaña [Vectorstores](../tabs/vectorstores-tab.md) y establezca la operación en insert, upsert, delete o search. Upsert y delete direccionan un documento mediante un id único almacenado dentro del payload — un **Document ID Field** nombra ese campo (predeterminado `doc_id`) y **Document ID** contiene su valor — de modo que un documento conserva el id que su propio sistema ya utiliza: upsert reemplaza cada punto coincidente antes de almacenar la nueva versión, y delete informa si algo coincidió. Los metadatos del documento aceptan expresiones en sus valores, por lo que `{"url": "$start.url"}` almacena lo que produjo la ejecución. La búsqueda admite filtros de metadatos, **Hybrid Search** opcional (similitud vectorial fusionada con coincidencia de palabras clave BM25, de modo que los términos exactos como identificadores y códigos de error se encuentren junto a las coincidencias semánticas) y reranking opcional de Cohere, y devuelve un array de resultados con text, score, metadata, indicadores reranked e hybrid, y count para su uso en flujos de [LLM](../nodes/llm-node.md) o [Agent Node](../nodes/agent-node.md).

Los nodos posteriores habituales son [LLM](../nodes/llm-node.md) y [Agent Node](../nodes/agent-node.md); la configuración del almacén vectorial se encuentra en [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

El nodo MCP Call llama directamente a una herramienta [MCP](../tabs/mcp-tab.md) específica, sin que un LLM decida qué herramienta invocar. Úselo cuando sepa exactamente qué herramienta ejecutar en tiempo de diseño — para una ejecución determinista de herramientas MCP en un solo paso dentro de un workflow. Configure una conexión (SSE, Streamable HTTP o stdio; los mismos campos que la conexión MCP del [Agent Node](../nodes/agent-node.md)), haga clic en **Fetch Tools** para rellenar un menú desplegable, seleccione una herramienta y complete los campos de argumentos que se generan automáticamente a partir del esquema de entrada de la herramienta. Cada argumento acepta un valor estático o una [expresión DSL](./expression-dsl.md) como `$userInput.body.text`. El resultado está disponible como `$nodeLabel.result` (objeto JSON si es analizable, de lo contrario string). El nodo MCP Call no se puede conectar a un [Agent Node](../nodes/agent-node.md) como herramienta del canvas.

Consulte también [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) y [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

El nodo Condition ramifica el workflow según una expresión if/else. Tiene dos conectores de salida: uno para cuando la condición es verdadera (truthy) y otro para cuando es falsa (falsy). Utilice operadores de comparación y lógicos de la [Expression DSL](./expression-dsl.md) en la expresión de condición; el nodo transfiere la entrada a la rama elegida.

Consulte también [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) y [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

El nodo Switch dirige la ejecución a distintas rutas comparando un valor con casos. Configure una expresión a evaluar y una lista de valores de caso; cada caso obtiene un conector de origen y se utiliza un conector predeterminado para los valores que no coinciden. La entrada se transfiere a la rama coincidente.

Utilice [Condition](../nodes/condition-node.md) para ramificaciones binarias y [Merge](../nodes/merge-node.md) para reunir rutas dirigidas; las reglas de coincidencia se describen en [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

El nodo Merge espera múltiples entradas paralelas y las combina en una única salida. Establezca el número de entradas que debe esperar; el nodo produce un objeto combinado una vez que todas las ramas han finalizado. Úselo para unir resultados de ramas paralelas antes de continuar; no lo utilice cuando las ramas paralelas terminan en nodos Output separados.

Consulte también [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) y [Output](../nodes/output-node.md) al recombinar ramas.

#### [Loop](../nodes/loop-node.md)

El nodo Loop itera sobre un array, ejecutando los nodos posteriores para cada elemento. Requiere una retroconexión desde el último nodo del cuerpo de iteración para avanzar. Dentro del cuerpo del bucle utilice `item`, `index`, `total`, `isFirst` e `isLast`; el bucle tiene salidas separadas para la ruta de iteración y la ruta done.

Se combina con [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) y [Expression DSL](./expression-dsl.md) para workflows iterativos.

### Data
#### [Set](../nodes/set-node.md)

El nodo Set transforma y asigna datos de entrada a una salida personalizada. Defina asignaciones clave-valor donde cada valor sea una expresión de [Expression DSL](./expression-dsl.md). Utilícelo para mayúsculas, subcadenas, concatenación, números aleatorios y transformaciones similares. Acceda a la salida por clave (por ejemplo, `$setNode.keyName`). Cuando se conecta a un agente como herramienta de nodo en el canvas, los valores de asignación pueden marcarse como proporcionados por el agente para que este los complete en tiempo de ejecución. Para llamar a otros workflows utilice el nodo [Execute](../nodes/execute-node.md) en su lugar.

Véase también [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) y [Expression DSL](./expression-dsl.md).

#### [Converter](../nodes/converter-node.md)

El nodo Converter convierte datos entre formatos sin escribir código. Las conversiones de texto son `csvToJson` (texto CSV a un array de objetos de fila, o arrays cuando no hay encabezado), `jsonToCsv` (un array de objetos/filas a texto CSV), `xmlToJson` (texto XML a un objeto) y `jsonToXml` (un objeto a texto XML). Configure la dirección de conversión y la expresión de origen; las conversiones CSV utilizan además un delimitador y el manejo de encabezados, y `jsonToCsv` puede fijar un orden de columnas explícito. El entrecomillado, los delimitadores incrustados y los saltos de línea incrustados siguen la RFC 4180. Los atributos XML utilizan prefijos `@`, el texto mezclado con atributos utiliza `#text`, los elementos repetidos se convierten en arrays y la expansión de entidades XML está deshabilitada. El mismo nodo también funciona sobre archivos almacenados. `imageToText` y `pdfToText` ejecutan Tesseract OCR, leyendo un archivo desde Heym Drive (`$Upload.file.id` de un Trigger de File upload, el resultado de un nodo Drive o un archivo generado por un agente), seleccionando el idioma automáticamente a partir del script detectado o utilizando códigos que usted indique como `tur` o `eng+tur`, y normalizando el texto a UTF-8 de forma predeterminada con normalización NFC opcional y conjuntos de caracteres más específicos como `cp1254`. `fileConvert` reescribe un archivo almacenado en otro formato, los documentos mediante pandoc y las imágenes mediante Pillow, y guarda el resultado como un nuevo archivo de Drive sin tocar el original. El resultado está disponible como `$converterNode.result`, junto con `.language`, `.encoding`, `.page_count`, `.pages` y `.file` para las ejecuciones de OCR, y `.id`, `.filename` y `.download_url` para `fileConvert`.

Véase también [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) y [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

El nodo Code ejecuta Python que usted escribe, con su propio `requirements.txt`, en un contenedor que se crea y se destruye en cada ejecución. Su código define una función `main(params)` y devuelve cualquier valor serializable en JSON, que se convierte en `$codeNode.result`; todo lo que imprima se captura por separado como `$codeNode.logs`, y `$codeNode.install` informa qué herramienta instaló las dependencias. Los parámetros se configuran como un objeto JSON cuyas expresiones `$` se resuelven antes de la ejecución, y el código los lee con notación de punto como `params.user.name` o `params.orders[0].id`. Las dependencias se instalan con `uv`, recurriendo a `pip` para los paquetes que `uv` no puede manejar, sin caché entre ejecuciones; dejar `requirements.txt` vacío omite por completo la instalación y es mucho más rápido. La fase de ejecución no tiene red a menos que se active `codeAllowNetwork`, mientras que la instalación de dependencias siempre accede a PyPI. El sandbox se ejecuta sin privilegios de root con todas las capacidades eliminadas, un sistema de archivos raíz de solo lectura, sin socket de Docker y sin acceso a secretos del backend, limitado a 512 MB de memoria, una CPU, 256 procesos, 120 segundos de instalación y 60 segundos de ejecución. Docker es obligatorio y no existe un modo alternativo: sin un daemon accesible, el nodo falla en lugar de ejecutar su código en el proceso del backend.

#### [Variable](../nodes/variable-node.md)

El nodo Variable establece o actualiza una variable local del workflow (`$vars.variableName`) o una [variable global](./global-variables.md) persistente (`$global.variableName`). Utilícelo para contadores, listas acumuladas y estado compartido. Configure el nombre de la variable, la expresión de valor, la coerción de tipo y si se debe almacenar en el almacén global. Las variables de tipo array admiten `$array()` y `.add()`.

Se combina con [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) y [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

El nodo Execute llama a otro workflow (sub-workflow) y le pasa la entrada. Especifique el workflow de destino por ID y proporcione la entrada mediante una única expresión o asignaciones clave-valor. La salida incluye workflow_id, status y outputs; utilícelo para lógica reutilizable, no para transformación de datos (para eso utilice Set).

Véase también [Canvas Features](./canvas-features.md) para Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) y [Output](../nodes/output-node.md).

### Integrations
#### [HTTP](../nodes/http-node.md)

El nodo HTTP realiza solicitudes HTTP utilizando una configuración al estilo cURL. Puede ser un punto de inicio del workflow (sin arista entrante) o recibir entrada de nodos anteriores. La respuesta está disponible como status, headers y body (JSON analizado cuando corresponda). Utilice [Credenciales](./credentials.md) para autenticación Bearer o mediante encabezado personalizado.

Se combina con [Webhooks](./webhooks.md), [Credenciales](./credentials.md) e [Integraciones de Terceros](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

El nodo WebSocket Send abre una conexión de cliente saliente, envía un mensaje de texto/JSON/binario y la cierra. Utilícelo para publicar la salida del workflow en sistemas en tiempo real sin crear un endpoint de socket alojado en Heym.

Consulte también [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) e [Integraciones de Terceros](./integrations.md).

#### [Telegram](../nodes/telegram-node.md)

El nodo Telegram envía un mensaje de bot a un chat, grupo o canal. Configure una [credencial](./credentials.md) de Telegram, establezca `chatId` y componga el `message` saliente con expresiones del [Expression DSL](./expression-dsl.md). Se combina de forma natural con [Telegram Trigger](../nodes/telegram-trigger-node.md) para workflows conversacionales y con [Error Handler](../nodes/error-handler-node.md) para alertas de operador.

Consulte también [Integraciones de Terceros](./integrations.md) y [Credenciales](./credentials.md) para la configuración y los patrones de credenciales.

#### [Slack](../nodes/slack-node.md)

El nodo Slack envía un mensaje a un canal de Slack mediante un Incoming Webhook. Configure una [credencial](./credentials.md) de Slack y una expresión de mensaje. Utilícelo para notificaciones, alertas y reporte de errores; la salida pasa a través de la entrada.

Se combina con [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integraciones de Terceros](./integrations.md).

#### [Discord](../nodes/discord-node.md)

El nodo Discord envía un mensaje a un canal de Discord mediante un Incoming Webhook. Configure una [credencial](./credentials.md) de Discord, componga el mensaje saliente con [Expression DSL](./expression-dsl.md) y, opcionalmente, establezca sobrescrituras de nombre de usuario o avatar del webhook.

Se combina con [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) e [Integraciones de Terceros](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

El nodo Send Email envía correos electrónicos mediante SMTP. Configure una [credencial](./credentials.md) SMTP y expresiones del [Expression DSL](./expression-dsl.md) para el destinatario o destinatarios, el asunto y el cuerpo. Utilícelo para notificaciones, alertas y correos transaccionales. La salida incluye status, to y subject.

El [IMAP Trigger](../nodes/imap-trigger-node.md) complementa a Send Email al gestionar el correo entrante. Juntos permiten que un workflow lea el correo entrante de una bandeja compartida, lo resuma o clasifique con nodos de IA y envíe un mensaje de seguimiento o escalamiento. El [Telegram Trigger](../nodes/telegram-trigger-node.md) y el [nodo Telegram](../nodes/telegram-node.md) proporcionan el mismo patrón de entrada/salida para workflows de chat impulsados por bots.

Para flujos de notificación bidireccionales, también se combina bien con [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md) e [Integraciones de Terceros](./integrations.md).

#### [Redis](../nodes/redis-node.md)

El nodo Redis realiza operaciones de Redis: set, get, hasKey y deleteKey. Utilícelo para almacenamiento en caché, limitación de velocidad y almacenamiento clave-valor. Configure una [credencial](./credentials.md), el tipo de operación, la expresión de clave y, para las operaciones set, el valor y el TTL opcional. La salida varía según la operación (value, success, exists, deleted).

Se combina con [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) y [Parallel Execution](./parallel-execution.md) para almacenamiento en caché, limitación y coordinación.

#### [Grist](../nodes/grist-node.md)

El nodo Grist lee, escribe y gestiona datos en hojas de cálculo de Grist. Las operaciones incluyen getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables y listColumns. Proporcione el ID del documento, el ID de la tabla y, para create/update, los datos del registro utilizando los ID de columna. Utilícelo para CRUD, actualizaciones por lotes y automatización de hojas de cálculo.

Consulte también [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) e [Integraciones de Terceros](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

El nodo Google Sheets lee, escribe y gestiona datos de hojas de cálculo mediante OAuth2. Utilícelo para leer informes, anexar resultados del workflow, actualizar rastreadores y limpiar o inspeccionar pestañas de hojas desde dentro de un workflow. Al igual que [BigQuery](../nodes/bigquery-node.md), utiliza una credencial de integración respaldada por Google y encaja bien junto a [Grist](../nodes/grist-node.md) cuando los datos de hojas de cálculo forman parte del flujo.

Se combina con [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) e [Integraciones de Terceros](./integrations.md).
#### [BigQuery](../nodes/bigquery-node.md)

El nodo BigQuery ejecuta consultas SQL e inserta filas en conjuntos de datos de Google BigQuery mediante OAuth2. Resulta útil para workflows de analítica, pipelines de informes y la escritura de datos de eventos estructurados procedentes de ejecuciones de workflows. Con frecuencia se combina con [Set](../nodes/set-node.md) para dar forma a las filas y con [Google Sheets](../nodes/google-sheets-node.md) para informes más ligeros orientados a hojas de cálculo.

Se combina con [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) y [Third-Party Integrations](./integrations.md).

#### [Google Drive](../nodes/google-drive-node.md)

El nodo Google Drive lista, descarga, actualiza y elimina archivos y carpetas de Drive mediante OAuth2, y puede copiar un archivo de Drive directamente a [Heym Drive](../nodes/drive-node.md) con su operación `syncToHeymDrive`. Google Docs, Sheets y Slides no tienen bytes descargables, por lo que el nodo los exporta automáticamente — Docs a PDF, Sheets a XLSX, Slides a PPTX — con una anulación para el formato de destino. Las eliminaciones mueven los elementos a la papelera de Drive a menos que se habilite "Delete permanently", y el nodo rechaza eliminar una carpeta mediante la operación de archivo o viceversa. Al igual que [Google Sheets](../nodes/google-sheets-node.md), utiliza una credencial OAuth2 respaldada por Google; tenga en cuenta que esta solicita acceso completo a Drive, por lo que conviene revisar [Credential Sharing](./credentials-sharing.md) antes de compartirla.

Se combina con [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) y [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

El nodo GitHub proporciona 40 acciones nativas de la API REST de GitHub que abarcan repositorios, organizaciones y usuarios, issues, pull requests, revisiones, releases, workflows de Actions, métricas de tráfico y archivos de repositorio. Utilícelo para la clasificación de issues, la automatización de revisiones, el dispatch y la espera de finalización de workflows, la automatización de releases y las actualizaciones de archivos de repositorio sin construir solicitudes HTTP manualmente. Admite GitHub.com y un `base_url` opcional de GitHub Enterprise en la credencial.

Se combina con [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) y [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

El nodo Jira conecta los workflows a las API REST de Jira Cloud o Jira Data Center / Server para la automatización de proyectos, issues, comentarios, adjuntos, usuarios, notificaciones y transiciones. Puede listar proyectos, buscar issues con JQL, crear o actualizar issues, inspeccionar changelogs, notificar a las partes interesadas, gestionar comentarios y adjuntos, obtener o gestionar usuarios, listar las transiciones disponibles y mover issues mediante un ID de transición. Utilice una credencial de Jira con el correo electrónico de Atlassian, el API token, la URL base del sitio y el modo de despliegue.

Se combina con [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) y [Third-Party Integrations](./integrations.md) para la recepción de solicitudes de soporte, la clasificación de errores y los workflows de release.

#### [Linear](../nodes/linear-node.md)

El nodo Linear conecta los workflows a la API GraphQL de Linear para la automatización de espacios de trabajo e issues. Puede listar equipos, proyectos, issues, estados de workflow, miembros del equipo y comentarios; crear, actualizar, eliminar y vincular issues; y crear, actualizar, resolver, dejar de resolver o eliminar comentarios. Utilice una clave de API personal de Linear o una credencial OAuth2 y, a continuación, descubra los UUID de equipo, proyecto, estado y responsable a partir de las operaciones de listado antes de crear o actualizar issues.

Se combina con [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) y [Third-Party Integrations](./integrations.md) para workflows de recepción, clasificación y backlog de ingeniería.

#### [Supabase](../nodes/supabase-node.md)

El nodo Supabase lee y modifica tablas expuestas a través de Supabase PostgREST. Funciona bien para backends de producto, datos de usuario/perfil, estado de workflow y automatizaciones de tipo CRUD que desean acceso a la base de datos sin cablear solicitudes HTTP personalizadas.

Se combina con [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) y [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

El nodo ClickHouse ejecuta operaciones CRUD, de recuento y de SQL sin procesar contra una base de datos ClickHouse externa a través de su interfaz HTTP. Resulta adecuado para pipelines de analítica, registro de eventos y workflows de informes: inserte eventos a medida que ocurren y, a continuación, agréguelos o cuéntelos con `query`/`count`. Refleja el conjunto de operaciones de [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) más una vía de escape de SQL sin procesar, con `update`/`remove` ejecutándose como mutaciones de ClickHouse.

Se combina con [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) para informes programados y [Third-Party Integrations](./integrations.md).
#### [Notion](../nodes/notion-node.md)

El nodo Notion gestiona bases de datos, orígenes de datos, páginas y bloques de Notion a través de la API actual de Notion (`2026-03-11`). Admite búsqueda, CRUD de páginas, operaciones sobre bases de datos y orígenes de datos, bloques hijos, append/update/delete de bloques, y papelera/restauración. Utilice un token de integración interna o una credencial OAuth de integración pública de Notion. El editor puede buscar y paginar con cursor los orígenes de datos y las páginas principales accesibles. Las credenciales compartidas funcionan igual que las credenciales propias para la ejecución del workflow.

Para llamadas REST personalizadas, `$credentials.YourNotionCredential` se resuelve al mismo bearer token. Se combina con [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) y [Third-Party Integrations](./integrations.md).

#### [Sentry](../nodes/sentry-node.md)

El nodo Sentry automatiza organizaciones, proyectos, equipos, incidencias, eventos y releases de Sentry a través de la API REST de Sentry. Utilícelo para la triaje de alertas, actualizaciones de estado de incidencias, automatización de releases, consulta de eventos y configuración o limpieza de proyectos y equipos. Admite Sentry SaaS y Sentry autoalojado mediante una URL base opcional en la credencial.

Se combina con [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) y [Third-Party Integrations](./integrations.md) para workflows de incidencias y releases.

#### [DataTable](../nodes/datatable-node.md)

El nodo DataTable lee, escribe y gestiona datos en las Tablas de datos de Heym (almacenamiento estructurado propio). Las operaciones incluyen find, getAll, getById, insert, update, remove y upsert. No requiere credenciales externas. Las tablas se gestionan desde la pestaña del panel [DataTable](../tabs/datatable-tab.md) y el propietario del workflow accede a ellas directamente.

Se combina con [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) y la [pestaña DataTable](../tabs/datatable-tab.md) para el almacenamiento estructurado propio.

#### [Drive](../nodes/drive-node.md)

El nodo Drive gestiona los archivos generados por las skills directamente desde un workflow. Las operaciones incluyen delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams y unshareWithMyTeams para la gestión de acceso de solo lectura a equipos; la conversión de formato reside en el nodo [Converter](../nodes/converter-node.md). Haga referencia al archivo con `$agentLabel._generated_files[0].id`; las salidas incluyen status, file_id, updated download_url para las restricciones de enlace y shared_team_count para el uso compartido con equipos. Esto resulta especialmente útil con workflows de [Agent Node](../nodes/agent-node.md) que utilizan [File Generation](./file-generation.md) y el modelo de referencia de [Drive](./drive.md).

Los acompañantes habituales son [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) y [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

El nodo Amazon S3 ejecuta operaciones de almacenamiento de objetos en Amazon S3 utilizando una credencial `s3` (access key, secret key, region, session token opcional). Las operaciones incluyen putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder y listBuckets. Se admite la carga de texto y la descarga de texto o base64, con campos de bucket y key que aceptan [Expression DSL](./expression-dsl.md). Utilícelo para almacenar salidas de workflows, archivar archivos y leer objetos de vuelta en un flujo.

Se combina con [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) y [Third-Party Integrations](./integrations.md).

### Automation

#### [Crawler](../nodes/crawler-node.md)

El nodo Crawler extrae páginas web utilizando FlareSolverr con extracción HTML opcional mediante selectores CSS. Configure una [credencial](./credentials.md) de FlareSolverr, una expresión de URL, un tiempo de espera y selectores opcionales para la extracción. La salida es el HTML sin procesar o el contenido extraído. Utilícelo para web scraping y extracción de contenido.

Se combina con [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) y [LLM](../nodes/llm-node.md) para flujos de extracción y análisis.

#### [Playwright](../nodes/playwright-node.md)

El nodo Playwright automatiza interacciones con el navegador mediante pasos configurables (navigate, refresh, click, type, screenshot, extract, aiStep) o el modo **Run Code** para Playwright Python personalizado (en sandbox; desactivado por defecto mediante `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Admite el modo headless, una configuración opcional que reduce las señales comunes de automatización de Playwright, timeouts, captura de red opcional (responses, cookies, localStorage, sessionStorage), arranque de autenticación mediante cookie/storageState desde expresiones de [Global Variables](./global-variables.md) como `$global.authState`, pasos de inicio de sesión de reserva cuando falla la restauración de la autenticación, y un paso de IA con Auto Heal cuando fallan los selectores. Utilícelo para web scraping, rellenado de formularios y workflows basados en navegador.

Consulte también [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) y [Execution History](./execution-history.md) para la automatización de navegador y la depuración.

### Utilities
#### [Output](../nodes/output-node.md)

El nodo Output es el endpoint del workflow que devuelve la respuesta al invocador. Configure la expresión del mensaje para hacer referencia al nodo anterior por su etiqueta (nunca utilice `$input` del nodo [Input](../nodes/input-node.md) en este punto). El modo asíncrono descendente opcional permite que los nodos posteriores al output se ejecuten en segundo plano una vez enviada la respuesta.

Las fuentes ascendentes habituales son [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) y [Execute](../nodes/execute-node.md); la depuración del formateo de la respuesta resulta más sencilla en el [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

El nodo JSON output mapper construye un objeto JSON plano a partir de asignaciones clave-valor al estilo de [Set](../nodes/set-node.md) y lo devuelve en la raíz de la respuesta del workflow. Utilícelo cuando un invocador de la API deba recibir un cuerpo JSON sin procesar en lugar del contenedor estándar del nodo [Output](../nodes/output-node.md).

#### [HTML output mapper](../nodes/html-output-mapper-node.md)

El nodo HTML output mapper renderiza una única plantilla HTML, interpolando expresiones `$nodeLabel.field` en la página. Cuando es el único nodo terminal del workflow, el webhook de ejecución responde con `text/html` y el código de estado configurado en el nodo en lugar de un cuerpo JSON, de modo que un workflow puede servir una página directamente a un navegador. Envíe `X-Simple-Response: false` para recibir el envoltorio JSON habitual y facilitar la depuración.

Se combina con [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) y [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

El nodo Chart Output es el nodo terminal del workflow de un widget del [Dashboard](../tabs/dashboard-tab.md). Transforma las filas producidas por los nodos ascendentes en un payload de gráfico estandarizado que el dashboard renderiza. Elija un `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text o HITL), asigne `labelField`/`valueField` (o `series` para múltiples series, o `text` para un mensaje markdown) y colóquelo en último lugar; no tiene arista de salida. Gantt lee filas de tareas con fechas ISO de inicio/fin, progreso e identificadores de dependencia. Entity relationships lee un objeto de grafo con entidades, campos, claves PK/FK y relaciones. Ambos se representan también en las páginas de Heym Work y en las vistas previas de propuestas de widgets. HITL ignora las filas ascendentes y lista sus revisiones humanas pendientes. y otra como botones de enlace que abren una URL en una pestaña nueva (`linkColumn`, con `linkLabel` para el texto del botón)

Consulte también [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) y [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

El nodo Wait pausa la ejecución del workflow durante una duración especificada en milisegundos, hasta un máximo de 15 minutos. Utilícelo para limitación de tasa, acciones retardadas o intervalos de sondeo. Transmite la entrada sin modificaciones.

Se combina con [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) y [Parallel Execution](./parallel-execution.md) para el ritmo y el sondeo.

#### [Sticky Note](../nodes/sticky-note-node.md)

El nodo Sticky Note añade notas markdown al canvas. No se ejecuta. Utilícelo para documentación, instrucciones o notas del workflow junto con otras [Canvas Features](./canvas-features.md). Haga doble clic en el canvas para editar el contenido de la nota.

Consulte también [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) y [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

El nodo Console Log registra un valor en la consola del backend (servidor). Utilícelo para depuración e inspección durante el desarrollo. El mensaje de registro admite expresiones del [Expression DSL](./expression-dsl.md); la salida transmite la entrada sin modificaciones.

Se combina con [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) y [Expression Evaluation Dialog](./expression-evaluation-dialog.md) para la depuración.

#### [Disable Node](../nodes/disable-node.md)

El nodo Disable Node deshabilita permanentemente otro nodo del workflow estableciendo su indicador `active` en false. Especifique el nodo de destino por su etiqueta. Utilícelo para operaciones puntuales, como detener un trigger [Cron](../nodes/cron-node.md) una vez cumplida una condición.

Consulte también [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) y [Cron](../nodes/cron-node.md) para patrones de control del workflow.

#### [Enable Node](../nodes/enable-node.md)

El nodo Enable Node vuelve a activar otro nodo estableciendo su indicador `active` en true y guardando el cambio. Especifique el nodo de destino por su etiqueta. Utilícelo para reactivar un trigger [Cron](../nodes/cron-node.md) deshabilitado desde otro punto de entrada, o para activar un nodo una vez cumplida una condición. Un destino situado aguas abajo del Enable Node que aún no se haya ejecutado también se ejecuta en la ejecución actual.

Consulte también [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) y [Cron](../nodes/cron-node.md) para patrones de control del workflow.
#### [Throw Error](../nodes/throw-error-node.md)

El nodo Throw Error detiene la ejecución del workflow de inmediato y devuelve una respuesta de error con un código de estado HTTP personalizado. Configure la expresión del mensaje de error y el código de estado (por ejemplo, 400, 401, 403, 404, 429, 500). Utilícelo para fallos de validación, accesos no autorizados u otras condiciones de error, especialmente cuando se combine con [Condition](../nodes/condition-node.md) y [Error Handler](../nodes/error-handler-node.md).

Se combina con [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) y [Security](./security.md) para rutas de fallo explícitas.

---

## Referencia

### [Tipos de nodos](./node-types.md)

Heym ofrece una variedad de tipos de nodos: triggers como [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) y [Error Handler](../nodes/error-handler-node.md); nodos de IA como [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) y [MCP Call](../nodes/mcp-call-node.md); nodos de lógica como [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) y [Loop](../nodes/loop-node.md); nodos de datos como [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) y [Heym](../nodes/heym-node.md); integraciones como [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) y [Drive](../nodes/drive-node.md); nodos de automatización como [Crawler](../nodes/crawler-node.md) y [Playwright](../nodes/playwright-node.md); y utilidades como [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) y [Sticky Note](../nodes/sticky-note-node.md). Utilice expresiones como `$input.text` y `$nodeLabel.field` en la configuración de los nodos.

Consulte también [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) y [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym utiliza un lenguaje de expresiones simple para referenciar datos de nodos anteriores. Utilice `$input` para el nodo [Input](../nodes/input-node.md), `$nodeLabel.field` para cualquier nodo anterior, `$credentials.CredentialName` para [credenciales](./credentials.md) y `$global.variableName` para [variables globales](./global-variables.md). Las variables especiales integradas incluyen `$now`, `$UUID` y metadatos del workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` y `$executionId` (el id del [Historial de ejecuciones](./execution-history.md) de la ejecución — `/workflows/{id}/{executionId}` abre esa ejecución en el canvas; solo en tiempo de ejecución, vacío en el diálogo de previsualización de expresiones). La compatibilidad incluye literales, aritmética, comparaciones, contexto de [Loop](../nodes/loop-node.md), campos anidados y helpers de cadenas/arrays (incluido `$text.toJson()` para analizar una cadena JSON). Cuando el valor completo es un único `$expr`, el backend conserva arrays, objetos, booleanos y números como tipos nativos.

Consulte también [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) y [Workflow Structure](./workflow-structure.md).
### [Variables globales](./global-variables.md)

El Almacén de Variables Globales contiene datos persistentes de clave-valor con alcance de usuario que sobreviven entre ejecuciones de workflow. Cree variables desde la pestaña [Variables](../tabs/global-variables-tab.md) o desde un nodo [Variable](../nodes/variable-node.md) con la opción "Store in Global Variable Store" habilitada. Acceda a ellas con `$global.variableName` en expresiones; se pueden compartir con otros usuarios o [equipos](./teams.md).

Se combina con [Variable](../nodes/variable-node.md), [Equipos](./teams.md) y [Uso compartido de credenciales](./credentials-sharing.md) para el estado compartido del workflow.

### [Diálogo de evaluación de expresiones](./expression-evaluation-dialog.md)

El Diálogo de evaluación de expresiones es un editor expandible que aparece al hacer clic en el botón de expansión junto a los campos de expresión. Se abre como un modal grande centrado, mantiene el autocompletado activo y actualiza automáticamente la vista previa del backend tras pausar la escritura. Los resultados de tipo objeto y array se pueden explorar con el selector de rutas de salida. El diálogo acepta una ruta de puntos sin formato de línea completa (por ejemplo `myNode.output.field`) como si fuera `$myNode.output.field`; consulte las reglas de ubicación del [Expression DSL](./expression-dsl.md).

El botón **Build with AI** de la barra de herramientas permite describir la expresión deseada en texto plano. Seleccione una [credencial](./credentials.md) de LLM y un modelo, escriba una descripción como *"Get the customer name from the API response"* y haga clic en Generate. El backend envía el contexto del [Expression DSL](./expression-dsl.md) y las salidas de nodos de la última ejecución al modelo y devuelve una única cadena de expresión. El resultado se evalúa de inmediato para que pueda verificarlo antes de hacer clic en Apply.

Se combina de forma natural con [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) y [mapeador de salida JSON](../nodes/json-output-mapper-node.md).

### [Estructura del workflow](./workflow-structure.md)

Los workflows se almacenan como JSON con nodos y aristas. El objeto del workflow incluye id, name, description, nodes, edges y ajustes de autenticación. Cada nodo tiene id, type, position y data (label y configuración específica del tipo). Las aristas conectan los IDs de los nodos de origen y destino con IDs de handle opcionales. La sintaxis de expresiones en los campos de data sigue el [Expression DSL](./expression-dsl.md), y esta misma estructura la utiliza [Descargar e importar](./download-import.md).

Consulte también [Tipos de nodo](./node-types.md), [Expression DSL](./expression-dsl.md) y [Descargar e importar](./download-import.md).

### [Funciones del canvas](./canvas-features.md)

Pase el cursor sobre cualquier nodo del canvas que no sea sticky y haga clic en **Run** para ejecutar hasta ese nodo. Las entradas requeridas se abren en el panel Run con el primer campo enfocado; las rutas sin entradas se inician de inmediato. Consulte [Ejecutar hasta el nodo](./canvas-features.md#run-to-node).

El editor de workflows ofrece Data Pin (fijar la última salida de un nodo para probar los nodos posteriores sin volver a ejecutar), Execution Logs (resultados de nodos en tiempo real y progreso del agente que complementan el [Historial de ejecuciones](./execution-history.md)), Enable/Disable (omitir nodos durante la ejecución) y Extract to Sub-Workflow (mover una selección a un nuevo workflow y reemplazarla con un nodo [Execute](../nodes/execute-node.md)). Una ejecución de producción en curso se puede abrir desde el Historial o desde una tarjeta del Board; el editor restaura su snapshot actual, se conecta a SSE y mantiene activas la animación del canvas y los registros de Debug. Los [Atajos de teclado](./keyboard-shortcuts.md) admiten copiar, pegar, ejecutar y la búsqueda de nodos en línea.

Consulte también [Atajos de teclado](./keyboard-shortcuts.md), [Historial de edición](./edit-history.md) e [Historial de ejecuciones](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Atajos de teclado](./keyboard-shortcuts.md)

Heym ofrece atajos en todo el editor: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo y Escape para cerrar. En el canvas: seleccionar todo, selección múltiple, copiar/cortar/pegar, eliminar, alternar nodo habilitado (D), alternar datos fijados (P) y búsqueda de nodos en línea escribiendo. Los atajos se documentan en la referencia dentro de la aplicación y funcionan en estrecha relación con [Funciones del canvas](./canvas-features.md), como Data Pin y la habilitación/deshabilitación de nodos.

Consulte también [Funciones del canvas](./canvas-features.md), [Quick Drawer](./quick-drawer.md) y [Contextual Showcase](./contextual-showcase.md).
### [Asistente de IA](./ai-assistant.md)

El Asistente de IA es un panel de Chat que se abre desde el panel de Depuración y permite crear o modificar Workflows con lenguaje natural. Seleccione una [credencial](./credentials.md) y un modelo, luego describa lo que desea; la IA transmite una respuesta y cualquier [workflow JSON](./workflow-structure.md) válido en un bloque de código se analiza y aplica automáticamente al Canvas. La entrada de voz es compatible con navegadores compatibles.

Active el **modo YOLO** (modo Agent, desactivado por defecto) y el asistente prueba lo que construye. Después de cada cambio, ejecuta el Workflow en el Canvas, lee el resultado y corrige el Workflow hasta que haga lo que usted solicitó, durante un máximo de 5 ejecuciones por mensaje. Solicita entradas de prueba antes de la primera ejecución, puede ejecutar sus otros Workflows cuando necesita su resultado, y muestra cada paso mientras trabaja. Consulte [Asistente de IA › Modo YOLO](./ai-assistant.md#yolo-mode).

Haga clic en **AI** sobre cualquier nodo en el canvas para cambiar o reparar solo ese nodo. El panel muestra el nodo que está cambiando (con su último resultado una vez ejecutado) y ofrece **Change this node as ...**, **Fix error in this node ...** y **Other**. Solo se actualiza ese nodo; el resto del workflow y el diseño permanecen como están. Consulte [AI Assistant › Cambiar un solo nodo](./ai-assistant.md#changing-one-node).

Cuando un Workflow almacena registros, el asistente pregunta qué [tabla de datos](../tabs/datatable-tab.md) utilizar, o crea una con las columnas que el Workflow necesita. Consulte [Asistente de IA › Tablas de datos](./Chat y MCP `heym_chat` también pueden editar columnas y filas directamente con acceso de propietario o de escritura, con confirmación previa a la eliminación de columnas o al vaciado de todas las filas. Chat y MCP `heym_chat` también pueden editar columnas y filas directamente con acceso de propietario o de escritura, con confirmación previa a la eliminación de columnas o al vaciado de todas las filas. ai-assistant.md#data-tables).

Cuando el Workflow actual contiene skills del [Nodo Agent](../nodes/agent-node.md), el asistente envía únicamente el `SKILL.md` de cada skill al contexto del Workflow. Los archivos `.py` adjuntos y los recursos binarios de skills se excluyen antes de la solicitud para que los paquetes de skills grandes no desborden la ventana de contexto del modelo.

Se combina bien con [Chat con Heym](./chat-with-heym.md), [Arquitectura de Agent](./agent-architecture.md) y [Expression DSL](./expression-dsl.md).

### [Chat con Heym](./chat-with-heym.md)

Chat con Heym es un asistente del encabezado de documentación para preguntas sobre el producto. Se abre en un diálogo centrado, mantiene la selección de credencial y modelo visible en la parte superior, inyecta la ruta de la página de documentación activa como contexto y borra el historial de mensajes cuando se cierra el diálogo. Complementa al [Asistente de IA](./ai-assistant.md) más amplio y al [Contextual Showcase](./contextual-showcase.md) más ligero.

Consulte también [Asistente de IA](./ai-assistant.md), [Contextual Showcase](./contextual-showcase.md) y [Tipos de Nodo](./node-types.md).

### [Organización de Workflows](./workflow-organization.md)

Los administradores de la instancia (`HEYM_ADMIN_EMAILS`) pueden acceder y editar todos los Workflows, encontrar los Workflows de un propietario por correo electrónico, inspeccionar Programaciones e historial de ejecuciones, pausar y reanudar Triggers automáticos, y eliminar Workflows una vez que las ejecuciones finalizan. Consulte [Administración de la instancia](../tabs/workflows-tab.md#instance-administration) para el flujo de baja y la distinción entre pausar Triggers automáticos y bloquear todas las llamadas.

Los Workflows se pueden organizar en carpetas y subcarpetas en una estructura de árbol. Las carpetas tienen nombres y padre opcional; los Workflows se asignan a carpetas. Los Workflows se pueden programar para su eliminación (movidos a un área de papelera antes de la eliminación permanente). La API admite crear, actualizar, eliminar y mover Workflows entre carpetas, y el mismo modelo de organización aparece en la pestaña [Workflows](../tabs/workflows-tab.md).

Consulte también [Quick Drawer](./quick-drawer.md), [Descarga e importación](./download-import.md) e [Historial de edición](./edit-history.md).

### [Quick Drawer](./quick-drawer.md)

El Quick Drawer es un panel fijo de ejecución rápida en el lado derecho para páginas internas que no son del Canvas. Permite buscar [Workflows](../tabs/workflows-tab.md), fijar favoritos, seleccionar entradas, ejecutar de inmediato e inspeccionar el progreso o los resultados sin abrir el editor. Un Workflow con un [File Upload Trigger](../nodes/file-upload-trigger-node.md) acepta un archivo arrastrado o seleccionado. El orden de los fijados y el último Workflow seleccionado se almacenan en el navegador.

Consulte también [Organización de Workflows](./workflow-organization.md), [Atajos de teclado](./keyboard-shortcuts.md) e [Historial de ejecuciones](./execution-history.md).

### [Contextual Showcase](./contextual-showcase.md)

El Contextual Showcase es una guía compacta dentro de la aplicación para superficies principales autenticadas como las pestañas del panel, [Evaluaciones](../tabs/evals-tab.md), Docs y el editor de Workflows. Permanece cerrado por defecto, ofrece primero un breve resumen de la página, brinda un poco de detalle adicional a demanda y enlaza al artículo completo de documentación cuando usted desea una guía más profunda.

Se combina con [Chat con Heym](./chat-with-heym.md), [Quick Drawer](./quick-drawer.md) y [Asistente de IA](./ai-assistant.md) para flujos de guía dentro de la aplicación.

### [Credenciales](./credentials.md)

Las Credenciales almacenan claves de API y secretos utilizados por los nodos del Workflow. Agréguelas en la pestaña [Credenciales](../tabs/credentials-tab.md) y referéncielas por nombre o ID en nodos como [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Enviar correo electrónico](../nodes/send-email-node.md) y [Redis](../nodes/redis-node.md). Se cifran en reposo, se pueden compartir con usuarios o [equipos](./teams.md), y también se pueden referenciar en [Expression DSL](./expression-dsl.md) mediante `$credentials.Name`.

Consulte también [Credenciales](../tabs/credentials-tab.md), [Uso compartido de Credenciales](./credentials-sharing.md) e [Integraciones de terceros](./integrations.md).
### [Uso compartido de Credenciales](./credentials-sharing.md)

Las Credenciales se pueden compartir con otros usuarios por correo electrónico o con equipos; todos los miembros del equipo obtienen acceso cuando una credencial se comparte con un equipo. Las credenciales compartidas aparecen con un indicador en la pestaña [Credenciales](../tabs/credentials-tab.md). En tiempo de ejecución, el contexto del propietario del workflow fusiona las credenciales propias, las compartidas por usuarios y las compartidas por equipos. Utilice `$credentials.CredentialName` en las expresiones o establezca credentialId en los datos del nodo.

Consulte también [Credenciales](./credentials.md), [Equipos](./teams.md) e [Integraciones de Terceros](./integrations.md).

### [Equipos](./teams.md)

Los equipos permiten compartir workflows, credenciales, variables globales, almacenes vectoriales y archivos de Drive con un grupo de usuarios a la vez. Cree equipos desde la pestaña [Equipos](../tabs/teams-tab.md) y agregue miembros por correo electrónico. Comparta recursos con un equipo desde los cuadros de diálogo de uso compartido correspondientes; todos los miembros tendrán entonces acceso. El creador puede editar y eliminar el equipo; al eliminar un equipo se eliminan todos los recursos compartidos con dicho equipo.

Se complementa con [Uso compartido de Credenciales](./credentials-sharing.md), [Variables Globales](./global-variables.md) y [Enterprise](./enterprise.md).

### [Ejecución en Paralelo](./parallel-execution.md)

Heym ejecuta los nodos en paralelo cuando no tienen dependencias entre sí. El ejecutor construye un DAG y ejecuta los nodos del mismo nivel de forma concurrente con un grupo de hilos; tan pronto como un nodo finaliza, sus nodos posteriores se programan. Utilice el nodo [Merge](../nodes/merge-node.md) para combinar ramas paralelas cuando sea necesario. Múltiples ejecuciones de workflow se ejecutan de forma concurrente; cada ejecución está aislada. El modo [SSE Streaming](./sse-streaming.md) emite eventos a medida que los nodos se completan.

Consulte también [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) e [Historial de Ejecuciones](./execution-history.md).

### [Arquitectura del Agente](./agent-architecture.md)

El [Nodo Agent](../nodes/agent-node.md) admite subagentes (el orquestador llama a otros nodos de agente mediante call_sub_agent), subworkflows (el agente llama a otros workflows mediante call_sub_workflow), skills (contenido de instrucciones y herramientas de Python desde .zip o .md) y conexiones de cliente [MCP](../tabs/mcp-tab.md). El ejecutor de herramientas del orquestador enruta las llamadas a subagentes y subworkflows; las demás herramientas se dirigen a los ejecutores de Python, MCP o skills. La profundidad máxima de anidamiento para subagentes y subworkflows es 5. El bucle de llamada a herramientas incluye compresión automática de contexto: antes de cada iteración, se estima el uso de tokens y, si supera el 80% de la ventana de contexto del modelo, los mensajes intermedios se resumen utilizando el mismo modelo, manteniendo intactos el system prompt, el primer mensaje del usuario y el último mensaje del usuario.

Consulte también [Nodo Agent](../nodes/agent-node.md), [Memoria Persistente del Agente](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) y [MCP](../tabs/mcp-tab.md).

### [Memoria Persistente del Agente](./agent-persistent-memory.md)

Grafo de conocimiento opcional por [Nodo Agent](../nodes/agent-node.md) almacenado en Postgres: entidades, tipos, propiedades y relaciones dirigidas. Cuando `persistentMemoryEnabled` es true, el grafo se resume en el system prompt en cada ejecución; tras las finalizaciones exitosas, un [LLM](../nodes/llm-node.md) extrae actualizaciones estructuradas en segundo plano. Las operaciones REST CRUD se encuentran en `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. El editor se abre desde el control de cerebro rosa del nodo.

Consulte también [Nodo Agent](../nodes/agent-node.md), [Arquitectura del Agente](./agent-architecture.md) y [Trazas](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-loop permite que un [Nodo Agent](../nodes/agent-node.md) solicite aprobación en puntos de control específicos, cree una página pública `/review/{token}` y espere a que un revisor no autenticado acepte, edite o rechace el texto de revisión en Markdown. Los agentes con HITL habilitado también exponen un handle de salida `review` para que pueda notificar a [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) u otros canales mientras la ejecución está pendiente. El texto HITL a nivel de nodo se utiliza como directrices de aprobación, mientras que el resumen de la página pública se genera a partir de la propia solicitud de revisión. Las ejecuciones pendientes aparecen en el [Historial de Ejecuciones](./execution-history.md) de inmediato, pueden ocurrir más de una vez en la misma ejecución y se reanudan desde la instantánea exacta del workflow almacenada una vez que se envía cada decisión.

Consulte también [Nodo Agent](../nodes/agent-node.md), [Portal](./portal.md), [Historial de Ejecuciones](./execution-history.md) y [Send Email](../nodes/send-email-node.md).
### [Webhooks](./webhooks.md)

Los Workflows se pueden activar mediante [HTTP](../nodes/http-node.md) en `POST /api/workflows/{workflow_id}/execute`, o transmitirse de forma incremental desde `POST /api/workflows/{workflow_id}/execute/stream`. El cuerpo de la solicitud se pasa como body a los nodos [Input](../nodes/input-node.md); los headers y los query params están disponibles en las expresiones de [Expression DSL](./expression-dsl.md). Configure la autenticación por Workflow: anónima, JWT o header personalizado. El almacenamiento en caché de respuestas opcional, la limitación de tasa y el diálogo Run with cURL del editor residen en el Workflow y se aplican a ambos modos. Con un [límite de concurrencia](./webhooks.md#concurrency-limit-and-queued-runs), una llamada que debe esperar recibe `202 Accepted` con un ID de ejecución y una URL de estado en su lugar.

Consulte también [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) y [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Los Execution Tokens son JWT con alcance que otorgan acceso a los endpoints de ejecución y streaming de un único Workflow. Cuando un Workflow utiliza autenticación JWT, los tokens permiten que scripts externos, pipelines de CI e integraciones invoquen el Workflow sin compartir una sesión de usuario. Cada token incluye una claim `wid` que lo fija a un Workflow, un `jti` utilizado para la revocación instantánea y un TTL configurable (de 60 segundos a 10 años). Cree, seleccione y revoque tokens directamente desde el diálogo **Run with cURL**; el token seleccionado se incorpora automáticamente en el comando generado.

Consulte también [Webhooks](./webhooks.md), [Security](./security.md) y [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

El diálogo de cURL puede cambiar la ejecución de [webhook](./webhooks.md) al modo Server-Sent Events. Esto produce eventos `execution_started`, `node_start`, `node_complete` y `execution_complete` en tiempo real, añade `--no-buffer` al comando cURL generado y permite configurar mensajes de inicio por nodo, como `[START] LLM` o texto personalizado para consumidores externos de terminal.

Consulte también [Webhooks](./webhooks.md), [Execution History](./execution-history.md) y [LLM](../nodes/llm-node.md).

### [Triggers](./triggers.md)

Los Workflows se inician mediante nodos trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), recepción de [RabbitMQ](../nodes/rabbitmq-node.md)) o puntos de entrada: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), programador de Cron, webhook de Telegram, webhook de interacción de Discord, gestor de triggers de IMAP, consumidor de RabbitMQ o ejecución desde el Editor. Cada trigger tiene su propio endpoint o proceso en segundo plano; [Cron](../nodes/cron-node.md) se ejecuta cada 60 segundos, los nodos [Telegram Trigger](../nodes/telegram-trigger-node.md) reciben webhooks del bot, los nodos [Discord Trigger](../nodes/discord-trigger-node.md) reciben webhooks de interacción firmados y los nodos [IMAP Trigger](../nodes/imap-trigger-node.md) se ejecutan según su intervalo de sondeo configurado. Los nodos [Input](../nodes/input-node.md) reciben body, headers y query de las solicitudes de webhook.

Consulte también [Node Types](./node-types.md), [Webhooks](./webhooks.md) y [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

El historial de ejecuciones registra las ejecuciones de los Workflows: entradas, salidas, resultados de nodos, estado y origen del trigger. Acceda a él desde la barra de herramientas del Editor, la vista Docs, el encabezado del Dashboard o la vista [Evals](../tabs/evals-tab.md). El historial por Workflow muestra las ejecuciones del Workflow abierto; la vista de todo el historial muestra las ejecuciones de todos los Workflows y del Chat. Las ejecuciones en curso aparecen en la parte superior de ambos diálogos con las acciones **Open live** y **Cancel**. Open live vincula el editor a la ejecución existente mediante [SSE](./sse-streaming.md), restaura los nodos completados, marca con pulsos los nodos actuales y pendientes, y añade los logs de Debug sin iniciar otra ejecución. Bring to Canvas carga las entradas y las salidas de los nodos de una ejecución completada para volver a ejecutarla o depurarla; el enlace directo `/workflows/{workflowId}/{executionId}` admite tanto ejecuciones en vivo como completadas. Las ejecuciones pausadas por [Human-in-the-Loop](./human-in-the-loop.md) se almacenan inmediatamente como `pending`, incluida la URL pública de revisión y cualquier nodo de notificación ejecutado desde la rama `review` del agente. Si el servidor se reinicia a mitad de una ejecución, las ejecuciones interrumpidas se recuperan automáticamente: se vuelven a ejecutar desde cero con las mismas entradas y se muestran como completadas (marcadas como **Recovered**), lo cual se controla mediante un toggle **Auto-recover runs** por Workflow que, en su lugar, puede registrarlas como `skipped`.

Consulte también [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) y [Traces](../tabs/traces-tab.md).
### Aspectos destacados de la ejecución

Tras una ejecución en vivo — o después de **Bring to Canvas** — aparece un popup descartable de **Aspectos destacados de la ejecución** en la esquina superior derecha del Canvas, que enumera lo que produjo cada nodo en orden de ejecución. Es una forma rápida de inspeccionar la salida por nodo sin abrir cada nodo; ciérrelo con la **✕** y se reabrirá en la siguiente ejecución. Los aspectos destacados también se muestran en las ejecuciones del dashboard. Consulte [Historial de ejecuciones](./execution-history.md) para más detalles.

### [Historial de ediciones](./edit-history.md)

El Historial de ediciones registra las versiones guardadas de un workflow (cada Guardado crea una versión). Visualice la lista, abra una versión para ver un diff contra el workflow actual ([nodos](./workflow-structure.md), edges, configuración) y use Revert para restaurar una versión anterior. A diferencia del [Historial de ejecuciones](./execution-history.md), el Historial de ediciones registra cambios de estructura, no ejecuciones.

Consulte también [Historial de ejecuciones](./execution-history.md), [Estructura del workflow](./workflow-structure.md) y [Funciones del Canvas](./canvas-features.md).

### Workflow de error

Un workflow puede designar otro workflow para que se ejecute cuando falle. Configúrelo en el panel **Properties** a nivel de workflow (que se muestra cuando no hay ningún nodo seleccionado) en **On error, run workflow**. Solo el propietario del workflow puede establecerlo, cambiarlo o borrarlo; consulte [Configuración exclusiva del propietario](./workflow-organization.md#owner-only-settings). Cuando una ejecución de nivel superior termina con un fallo no controlado, el workflow de error seleccionado se ejecuta y recibe el contexto del fallo (id y nombre del workflow fallido, id de ejecución, mensaje de error, label y tipo del nodo fallido, y una marca de tiempo). Si el canvas ya contiene un nodo [Error Handler](../nodes/error-handler-node.md), el handler local tiene prioridad y el workflow de error **no** se invoca. El propio workflow de error se ejecuta directamente, por lo que nunca activa su propio workflow de error.

Cubre todas las ejecuciones de nivel superior que no sean de prueba: ambos endpoints de ejecución, el [Portal](./portal.md) y todos los trigger, incluidos [cron](../nodes/cron-node.md), los trigger de plataformas de chat, email, colas, [MCP](../tabs/mcp-tab.md) y widgets del dashboard. Con la [Distribución de carga](./cluster.md) habilitada, esto no cambia, incluidas las ejecuciones que ejecutó un worker: el nodo que falla viaja de vuelta con el resultado, y el workflow de error se distribuye entonces como cualquier otra ejecución, de modo que un nodo dentro de él que deba ejecutarse en la instancia principal sigue haciéndolo. Dos casos quedan deliberadamente excluidos, porque el resultado del propio workflow aún no se conoce: una ejecución que ninguna instancia llegó a ejecutar, y una espera que expiró mientras la ejecución puede seguir en curso. Tampoco se activa mediante ejecuciones de prueba manuales en el canvas.

### Tiempo de espera del workflow

Cada workflow puede establecer un **tiempo de espera del workflow** en segundos en el panel **Properties** a nivel de workflow. `0` (el valor predeterminado) lo deshabilita. Cuando se establece, una ejecución que supere el límite se detiene en el siguiente límite de nodo y se registra como una ejecución fallida con un error de "timed out". El tiempo de espera se aplica a las ejecuciones manuales, de API y activadas por trigger. Los nodos [Wait](../nodes/wait-node.md) prolongados se interrumpen con prontitud en lugar de bloquearse durante toda su duración.

### Límite de concurrencia

Cada workflow puede limitar cuántas ejecuciones de producción se ejecutan a la vez con el **Límite de concurrencia** en el panel **Properties** a nivel de workflow; el propietario y los colaboradores con acceso de edición pueden modificarlo, y está desactivado de forma predeterminada. Cuando se alcanza el límite, las nuevas ejecuciones de los endpoints de [webhook](./webhooks.md#concurrency-limit-and-queued-runs) y [streaming](./sse-streaming.md), el [Portal](./portal.md), el [Quick Drawer](./quick-drawer.md), [MCP](../tabs/mcp-tab.md) y cada [trigger](./triggers.md) esperan en una cola FIFO (primeras en entrar, primeras en salir), contabilizada en todas las instancias de un [cluster](./cluster.md). Las ejecuciones de prueba del editor, las llamadas a sub-workflows, las [Evals](../tabs/evals-tab.md) y las reanudaciones de revisión nunca se ponen en cola, y las ejecuciones de tarjetas de [Board](../tabs/board-tab.md), las ejecuciones de carga de archivos, las ejecuciones iniciadas por la herramienta run-workflow del asistente de IA y los workflows de notificación de alertas se inician sin esperar un slot. Una llamada de webhook que deba esperar recibe `202 Accepted` de inmediato con un `execution_id`, una URL de estado que responde con las mismas credenciales, su posición, el tamaño de la cola y el recuento de ejecuciones en curso; un cliente MCP recibe lo mismo y consulta la herramienta `heym_execution_status`. El ajuste opcional **Tamaño máximo de cola** rechaza las llamadas adicionales con `429`, y el ajuste opcional **Espera máxima** registra una ejecución que esperó demasiado tiempo como `expired`. Las ejecuciones en espera aparecen en el [Historial de ejecuciones](./execution-history.md) como **En cola n/m** y pueden cancelarse allí.

### Tiempo ahorrado

Cada workflow puede registrar un **tiempo ahorrado estimado por ejecución** (en minutos), establecido en el panel **Properties** a nivel de workflow. La pestaña [Analytics](../tabs/analytics-tab.md) agrega esto en el rango seleccionado como una estadística total de **Tiempo ahorrado** (suma de la estimación de cada workflow × sus ejecuciones exitosas). Most Used también muestra esa suma por workflow; **Not Set** abre el campo de estimación cuando no está establecido. El informe de [Análisis del workflow](./workflow-analysis.md) recomienda establecer una estimación cuando no hay ninguna configurada.

### [Configuración](./user-settings.md)

El diálogo de Configuración (que se abre desde su avatar en el encabezado) tiene cuatro pestañas: Profile (imagen de Gravatar, nombre para mostrar, User Rules), [Security](./security.md) (cambiar contraseña), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) y Observability (estado de [OpenTelemetry](./opentelemetry.md) de solo lectura). Las User Rules son instrucciones personalizadas que se inyectan en cada solicitud de IA, incluidos el constructor de workflows y el [Chat](../tabs/chat-tab.md), de modo que puede establecer el idioma, el tono, el estilo de código o las convenciones de workflow una sola vez. También están disponibles la política de contraseñas y la gestión de claves de API de [MCP](../tabs/mcp-tab.md).

Consulte también [Seguridad](./security.md), [Voz del Chat](./chat-voice.md), [Trazas de OpenTelemetry](./opentelemetry.md) y [Asistente de IA](./ai-assistant.md).
### [Trazas de OpenTelemetry](./opentelemetry.md)

Heym puede emitir trazas de OpenTelemetry para cada ejecución de workflow y ejecución de nodo: un span raíz `heym.workflow.execute` por ejecución y un span hijo `heym.node.execute` por nodo, con el uso de modelo y tokens adjunto a los nodos LLM y Agent. Los spans se exportan mediante OTLP/HTTP a cualquier backend compatible (Jaeger, Grafana Tempo, Honeycomb, Datadog), y el contexto de traza W3C se propaga a través de webhooks entrantes, HTTP saliente y sub-workflows. El trazado está deshabilitado de forma predeterminada y se configura con las [variables de entorno](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; el estado activo se muestra en la pestaña Observability de [Settings](./user-settings.md).

Consulte también [Historial de ejecuciones](./execution-history.md), [Trazas](../tabs/traces-tab.md) y [Webhooks](./webhooks.md).

### [Descarga e importación](./download-import.md)

Exporte el workflow actual como JSON desde la barra de herramientas del Editor (botón Download); el archivo incluye nodos y aristas. Importe arrastrando un archivo JSON a la pestaña [Workflows](../tabs/workflows-tab.md) (crea un nuevo workflow) o al canvas (reemplaza o fusiona). El JSON debe incluir un array de nodos; el nombre y las aristas son opcionales. Úselo para copias de seguridad, compartir o migrar entre instancias.

Consulte también [Estructura del workflow](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) y [Funciones del canvas](./canvas-features.md).

### [Portal](./portal.md)

El Portal expone los workflows como interfaces de chat públicas en `/chat/{slug}`. Configure portal_enabled, slug, autenticación opcional (usuarios del portal), streaming y carga de archivos por workflow. Los usuarios finales interactúan mediante una interfaz de chat sin iniciar sesión en Heym; las salidas de imagen pueden mostrarse en el chat. Los workflows del Portal también pueden derivar a páginas de revisión de [Human-in-the-Loop](./human-in-the-loop.md) cuando un [Nodo Agent](../nodes/agent-node.md) requiere aprobación, mientras que la rama `review` del agente envía notificaciones a otros canales. Úselo para herramientas internas, chatbots orientados al cliente y formularios impulsados por IA.

Consulte también [Human-in-the-Loop](./human-in-the-loop.md), [Nodo Agent](../nodes/agent-node.md) y [Drive](./drive.md).

### [Generación de archivos](./file-generation.md)

Las Skills pueden generar archivos como PDF, DOCX, CSV, JSON e imágenes durante la ejecución escribiendo en el espacio de trabajo `_OUTPUT_DIR`. Heym captura esos archivos automáticamente, los almacena y expone los metadatos de descarga en `_generated_files`, que luego pueden gestionarse con el [Nodo Drive](../nodes/drive-node.md) o revisarse en la pestaña [Drive](../tabs/drive-tab.md).

Consulte también [Nodo Agent](../nodes/agent-node.md), [Drive](./drive.md) y [Nodo Drive](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive es la capa de almacenamiento y uso compartido para los archivos generados por las Skills. Permite explorar archivos, crear enlaces públicos o protegidos con contraseña, aplicar caducidad y límites de descarga, compartir archivos en modo de solo lectura con sus equipos y gestionar esos archivos mediante programación con el [Nodo Drive](../nodes/drive-node.md) o manualmente desde la pestaña [Drive](../tabs/drive-tab.md).

Consulte también [Drive](../tabs/drive-tab.md), [Generación de archivos](./file-generation.md) y [Portal](./portal.md).

### [Seguridad](./security.md)

Heym aplica una política de contraseñas (longitud, mayúsculas, minúsculas, dígitos), almacena los tokens de acceso en cookies HttpOnly y rota los refresh tokens al usarlos. La limitación de tasa se aplica al inicio de sesión, al registro y al inicio de sesión del [Portal](./portal.md). Las [Credenciales](./credentials.md) se cifran en reposo con AES-256 (Fernet). La clave de API de [MCP](../tabs/mcp-tab.md) se utiliza para la autenticación del cliente; la seguridad del contenido está disponible mediante [Guardrails](./guardrails.md) en los nodos [LLM](../nodes/llm-node.md) y [Nodo Agent](../nodes/agent-node.md). Los [Tokens de ejecución](./execution-tokens.md) proporcionan JWT con alcance por workflow para llamadores externos.

Consulte también [Tokens de ejecución](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) y [Credenciales](./credentials.md).

### [Inicio de sesión único](./sso.md)

Heym autentica a las personas contra cualquier proveedor externo de OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - configurado en tiempo de ejecución desde **Settings → SSO** por un administrador de la instancia incluido en `HEYM_ADMIN_EMAILS`. Solo se introducen una URL de emisor y las credenciales del cliente; cada endpoint proviene del documento de descubrimiento del proveedor, por lo que ningún proveedor está codificado de forma fija. El inicio de sesión utiliza Authorization Code con PKCE, y el ID token se verifica contra las claves publicadas por el proveedor. Las cuentas se asignan primero por `(issuer, subject)` y en segundo lugar por correo electrónico verificado, con aprovisionamiento automático opcional limitado a una lista de dominios de correo electrónico permitidos. El inicio de sesión con contraseña permanece disponible junto con SSO y puede desactivarse una vez que pase una prueba de conexión, con las cuentas de `HEYM_ADMIN_EMAILS` exentas para que un proveedor mal configurado no pueda bloquear la instancia.

Consulte también [Settings](./user-settings.md), [Seguridad](./security.md) y [Registro de auditoría](./audit.md).
### [Distribución de carga](./cluster.md)

Apunte una segunda instancia de Heym a la misma base de datos y se unirá como worker. Las ejecuciones en segundo plano —cron, webhooks, llamadas a herramientas MCP, triggers de chat— se reparten entre las instancias según un porcentaje que un administrador de instancia establece en **Settings → Instances**, con el estado, la latencia de base de datos y la versión de cada instancia en una sola tabla. Las instancias nunca se comunican entre sí: Postgres transporta el trabajo, por lo que un worker no necesita ningún puerto abierto ni una ruta de retorno a la instancia principal. El trabajo que toca archivos locales, un espacio de trabajo de agente de programación o un plugin instalado siempre se ejecuta en la instancia principal, y el panel informa qué proporción de las últimas 24 horas representó eso, de modo que un operador puede ver cuándo los porcentajes no pueden ayudar. Cada ejecución del historial indica la instancia que la ejecutó, y ambos diálogos de historial permiten filtrar por ella.

Consulte también [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md) y [Analytics](../tabs/analytics-tab.md).

### [Integraciones de terceros](./integrations.md)

Heym se conecta a servicios externos mediante credenciales almacenadas en la pestaña [Credentials](../tabs/credentials-tab.md) (cifradas en reposo). Los tipos admitidos incluyen OpenAI, Google, Decision Model para el [Nodo Decision](../nodes/decision-node.md), Model Router para la selección automática de modelo (véase más abajo), GitHub para el [Nodo GitHub](../nodes/github-node.md) e integraciones MCP, Jira para el [Nodo Jira](../nodes/jira-node.md), Notion para el [Nodo Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP para [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header y FlareSolverr para [Crawler](../nodes/crawler-node.md). Cada tipo documenta los campos obligatorios; las credenciales pueden compartirse con usuarios o [equipos](./teams.md) y referenciarse por nombre en los nodos o como `$credentials.Name` en expresiones.

### Model Router (Auto Model)

Una credencial **Model Router** elige el modelo por solicitud en lugar de contener una clave. Almacena una credencial de modelo de decisión más una lista de sus credenciales existentes de OpenAI/Google/Custom, cada una con criterios que indican cuándo debe usarse, y aparece en todos los selectores de modelo con un único modelo llamado **Auto**.

Las Trazas, el Execution Log del canvas y el Span View muestran ambas mitades de la elección, por ejemplo `Auto Model / GPT-5`, mientras que el coste permanece atribuido al modelo que se ejecutó. Auto Model no puede combinarse con la Responses API, el modo Batch ni la salida de imágenes. Consulte [Credentials](./credentials.md) para conocer el comportamiento completo.

Consulte también [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) y [Teams](./teams.md).

### [Guardrails](./guardrails.md)

Los Guardrails bloquean mensajes de usuario inseguros o no deseados antes de que lleguen a un [LLM](../nodes/llm-node.md) o a un [Nodo Agent](../nodes/agent-node.md). Habilítelos por nodo y seleccione las categorías que desea bloquear (p. ej., violencia, discurso de odio, contenido sexual, autolesión, acoso, actividad ilegal). Establezca la sensibilidad (baja, media, alta). Cuando se activan, el nodo lanza un error que puede capturar con un [Nodo Error Handler](../nodes/error-handler-node.md). La detección utiliza la API de moderación del proveedor o la clasificación del LLM según el tipo de credencial.

Consulte también [Security](./security.md), [LLM](../nodes/llm-node.md), [Nodo Agent](../nodes/agent-node.md) y [Nodo Error Handler](../nodes/error-handler-node.md).

### [Enterprise](./enterprise.md)

Enterprise abarca la licencia comercial, el soporte profesional y los servicios de despliegue para equipos que ejecutan Heym en producción. Incluye ayuda con la arquitectura de workflows, onboarding, orientación sobre Kubernetes y escalado, soporte prioritario y desarrollo personalizado en torno a funciones avanzadas como el [Nodo Agent](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Parallel Execution](./parallel-execution.md) y [Portal](./portal.md).

Consulte también [Running & Deployment](../getting-started/running-and-deployment.md), [Security](./security.md) y [Teams](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work es una segunda interfaz para equipos de negocio construida sobre Heym. Las personas describen un trabajo, responden unas pocas preguntas y obtienen un Workflow probado, para luego trabajar desde páginas, aprobaciones y una lista de Actividad donde cada ejecución lleva un nombre. Los administradores de la instancia lo conectan en **Configuración → Heym Work** con su dirección y una clave de integración; cuenta con su propia licencia del equipo de Heym.

Consulte también [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) y [Human-in-the-Loop](./human-in-the-loop.md).

---

## Pestañas del Dashboard
### [Workflows](../tabs/workflows-tab.md)

La pestaña Workflows es la vista predeterminada del panel. Muestra un listado de dos paneles: workflows y carpetas como filas densas a la izquierda, y una vista previa del workflow seleccionado a la derecha con su trigger, última ejecución y pasos, además de Open Workflow y Run Now. Cada fila incluye un chip de estado (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) sobre el que puede filtrar el desplegable Status. Un workflow sin nodo de trigger se etiqueta según cómo se inició su ejecución más reciente: API para una llamada HTTP, SubWorker para un workflow padre, Portal para su chat público, y permanece como Manual hasta que se haya ejecutado. Las carpetas y subcarpetas gestionan la [organización](./workflow-organization.md). Cree workflows con New Workflow, arrastre y suelte JSON para [importar](./download-import.md), y edite o elimine desde las acciones de la fila. Los workflows se pueden mover entre carpetas; la eliminación se programa (papelera) antes de la eliminación permanente.

Consulte también [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) y [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Un tablero kanban agéntico donde las tarjetas son trabajos persistentes. Configure cada columna con una cadena de workflows ordenada; mover una tarjeta a la columna ejecuta la cadena con el contexto completo de la tarjeta (contenido, comentarios, historial, salidas previas). Los resultados se escriben de vuelta en la tarjeta: verde si tiene éxito, rojo si falla, ámbar mientras se ejecuta. Las rondas de seguimiento vuelven a ejecutar la cadena de la columna actual con todo lo acumulado hasta el momento, lo que impulsa la planificación iterativa. Las ejecuciones se registran en [Execution History](./execution-history.md) con el origen de trigger `board`. Mientras una ejecución de tarjeta está activa, **Open live** abre esa ejecución exacta en el canvas animado con registros de Debug incrementales.

Consulte también [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) y [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

La pestaña Templates le permite guardar y reutilizar plantillas de workflow (workflows completos) y plantillas de nodo (nodos individuales configurados). Cree plantillas de workflow desde el editor (Share as Template) y plantillas de nodo haciendo clic derecho sobre un nodo. Explore por visibilidad (Everyone o usuarios/[equipos](./teams.md) específicos), aplique una plantilla para crear un nuevo workflow o añadir un nodo al canvas, y gestione sus plantillas compartidas.

Consulte también [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) y [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Variables](../tabs/global-variables-tab.md)

La pestaña Variables gestiona el [Global Variable Store](./global-variables.md). Cree, edite y elimine variables globales; establezca nombre, valor y tipo de valor (Auto, String, Number, Boolean, Array, Object). Las variables tienen alcance de usuario y persisten entre ejecuciones. Referéncielas en cualquier [expresión](./expression-dsl.md) de workflow como `$global.variableName`. Las variables se pueden compartir con otros usuarios o [equipos](./teams.md).

Consulte también [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) y [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

La pestaña Chat es la superficie de agente de larga duración de Heym para operar el espacio de trabajo desde la conversación. Seleccione una [credencial](./credentials.md) y un modelo, luego solicite a Chat que responda preguntas, inspeccione definiciones de workflow, ejecute workflows existentes, resuma ejecuciones y programaciones, informe el historial de ejecuciones de un único workflow (recuento de ejecuciones, desglose por estado, última ejecución y los detalles de una ejecución a petición), informe qué ejecuciones se están ejecutando en este momento (con tiempo transcurrido, nodo actual y un enlace a cada ejecución activa), resuelva las revisiones humanas pendientes, cree y revise workflows con el mismo motor de AI Builder utilizado en el editor, o añada tarjetas a tableros kanban con lenguaje natural. Las tarjetas nuevas siempre comienzan en la primera columna del tablero seleccionado; cuando hay varios tableros disponibles y no se nombró ninguno, Chat presenta una selección de tablero antes de crear la tarjeta.

Chat sigue ejecutándose en el backend después de cerrar el navegador. Mientras una respuesta se está transmitiendo, puede enviar más mensajes; Heym los almacena en una cola respaldada por base de datos, le permite editar o eliminar los mensajes en cola antes de que comiencen, y los ejecuta en orden cuando finaliza la respuesta actual. Si el asistente necesita detalles de planificación y devuelve preguntas de aclaración, la cola se pausa hasta que usted responda esas preguntas, y luego se reanuda tras la respuesta de planificación.

Las respuestas se transmiten con markdown, imágenes en línea, tarjetas de vista previa de workflow, tarjetas contraíbles de llamadas a herramientas, uso de contexto y compresión automática de contexto. Chat admite archivos adjuntos, entrada de voz, reproducción por lectura en voz alta, acciones de copiado, prompts rápidos, User Rules desde [Settings](./user-settings.md) y [variables globales](./global-variables.md) como contexto.

Consulte también [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) y [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Ver demostración de Chat</a></p>

### [Credentials](../tabs/credentials-tab.md)

La pestaña Credentials gestiona las claves de API y los secretos utilizados por los nodos. Añada credenciales por tipo (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, etc.), asígneles un nombre y referéncielas en los nodos del workflow. Edite o elimine desde la tarjeta; comparta con usuarios por correo electrónico o con [equipos](./teams.md). Todos los valores se cifran en reposo y se enmascaran en la interfaz.

Consulte también [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) y [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Ver demostración de Credentials</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

La pestaña Vectorstores gestiona los almacenes vectoriales utilizados por los nodos [RAG](../nodes/rag-node.md). Cree un almacén con un nombre y una [credencial](./credentials.md) de almacén vectorial — *RAG: Qdrant + OpenAI* (Qdrant externo) o *RAG: Psql + OpenAI* (el propio Postgres de Heym mediante pgvector), lo que fija el backend del almacén —, opcionalmente establezca un nombre de colección y luego cargue documentos (PDF, TXT, etc.). Gestione el contenido (ver, eliminar fuentes), edite los detalles del almacén y comparta almacenes con usuarios. En un nodo [RAG](../nodes/rag-node.md), elija la Database, seleccione el almacén vectorial y ejecute operaciones de inserción, upsert, eliminación o búsqueda.

Consulte también [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) y [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Ver demostración de Vectorstores</a></p>
### [MCP](../tabs/mcp-tab.md)

La pestaña MCP configura la integración del Model Context Protocol. Heym admite dos modos:

**Servidor predeterminado** – Un único endpoint en `/api/mcp/sse` expone todos los workflows habilitados para MCP. Consulte y regenere su API key, copie el JSON de cliente listo para usar, conecte Cursor con un solo clic o siga el flujo de configuración de Claude con registro OAuth automático.

**Servidores con nombre** – Cree múltiples endpoints MCP aislados, cada uno con su propia URL basada en UUID (`/api/mcp/servers/{uuid}/sse`) y API key independiente. Asigne workflows específicos a cada servidor para que distintos clientes de IA o equipos vean únicamente las herramientas que necesitan. Cada servidor con nombre admite los mismos métodos de autenticación (API key, Claude OAuth) y dispone de sus propios accesos directos Copy JSON y Add to Cursor. Ambos endpoints admiten transporte SSE (GET) y transporte Streamable HTTP (POST). Al activar o desactivar un workflow dentro de un servidor con nombre, este se desplaza al principio de la lista de asignados para que la fila modificada permanezca visible.

**Herramienta de chat de Heym** – Cualquiera de los dos modos también puede exponer el motor de [Chat](../tabs/chat-tab.md) como una única herramienta `heym_chat`, activada por superficie con su propia credencial de LLM y modelo (precargados a partir de su modelo preferido en [Settings](./user-settings.md)). Un cliente MCP envía un único `message` en lenguaje natural y el motor hace el resto: crear workflows en modo de construcción (guardar, ejecutar pruebas hasta cinco veces, corregir y verificar), ejecutar workflows, analíticas, ejecuciones, estado de ejecución en vivo, programaciones, tableros y tarjetas, equipos, variables globales, búsqueda en la documentación y decisiones con intervención humana. Las capacidades que se añadan a Chat posteriormente son accesibles a través de la misma herramienta sin necesidad de registro adicional. Cada llamada se almacena en el historial de la pestaña Chat como una conversación marcada con un conector y devuelve un `conversation_id` que el cliente puede reenviar para continuar el hilo.

Consulte también [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) y [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

La pestaña Traces muestra las trazas de ejecución de [LLM](../nodes/llm-node.md). Un encabezado de estadísticas situado encima de la lista resume el rango de tiempo seleccionado con tarjetas de KPI (Calls, Tokens, Cost, Avg Latency, Error %) y tres gráficos: Tokens by Model, Cost by Model y Calls Over Time (éxitos frente a errores apilados). Un único selector **Time range** (1h / 24h / 7d / 30d / All; predeterminado 7 días) filtra tanto los gráficos como la lista de forma conjunta. El coste se calcula a partir de la [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) por usuario; los modelos sin precios definidos muestran una advertencia en línea que enlaza a dicha tabla. Abra cualquier traza para ver los payloads de solicitud y respuesta, el desglose de tiempos (llm_ms, tools_ms, mcp_list_ms), las llamadas a herramientas (nombre, argumentos, resultado) y las skills incluidas. Los eventos expandidos muestran JSON —incluidos los payloads de MCP y JSON-RPC— como un árbol contraíble con el primer nivel abierto de forma predeterminada; **Tree / Raw** alterna de vuelta al texto original y el JSON malformado permanece legible. Utilice las trazas para depurar el comportamiento del [Agent Node](../nodes/agent-node.md) y de [LLM](../nodes/llm-node.md), y para copiar o exportar payloads.

Consulte también [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) y [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alertas](../tabs/alerts-tab.md)

La pestaña Alertas define condiciones de umbral sobre una ventana de tiempo y le notifica cuando se cruzan. Cuatro tipos de alerta cubren las preguntas que los operadores realmente formulan: **umbral de errores** (¿falló esto más de N veces en la ventana?), **duración del workflow** (¿se volvieron más lentas las ejecuciones, medidas como máximo, promedio o p95?), **costo en tokens / USD** (¿superó el gasto un presupuesto, resuelto mediante la misma tabla de precios que [Trazas](../tabs/traces-tab.md)?) y **recuento de ejecuciones** (¿se ejecutó esto con mucha más frecuencia de la debida?). Cada tipo se evalúa sobre una ventana que usted elige, nunca sobre un único evento, porque una ejecución fallida es ruido y una ráfaga es un incidente. Las alertas vigilan un workflow o todos los workflows a los que usted tenga acceso.

Un asistente de cinco pasos recorre tipo, alcance, condición, respuesta y revisión. El paso de Revisión **backtestea** primero la condición, informando con qué frecuencia se habría activado durante las últimas 24 horas hasta 7 días, de modo que un umbral demasiado bajo se detecta antes de guardarse en lugar de después de notificar a alguien. Describa lo que desea en lenguaje natural y la IA completa cada paso que pueda, marcando sus suposiciones; una solicitud parcial igualmente hace avanzar el asistente, abriéndose en el primer paso que aún requiere una decisión en lugar de obligarle a empezar de nuevo. De forma predeterminada, una alerta se activa una vez y permanece en silencio hasta que la métrica se recupera; alternativamente, puede hacer que se repita en un intervalo.

En el paso de respuesta, una alerta puede crear y asignar un nuevo workflow para ejecutar cuando se active, usar uno que ya tenga, o no hacer nada. El payload de activación transporta el valor observado, el umbral, la ventana y los workflows que contribuyeron al número, que es como las alertas llegan a Slack, correo electrónico o Telegram usando nodos que ya tiene. El historial de activaciones registra lo que era cierto en el momento en que se activó cada alerta y se conserva durante 90 días; reconocer una activación cambia la insignia de Activa a Reconocida sin pretender que la condición se ha resuelto. La pestaña [Chat](../tabs/chat-tab.md) puede responder qué alertas existen y por qué o cuándo se activó una. Las alertas pueden compartirse con usuarios y [equipos](../tabs/teams-tab.md).

Véase también [Analíticas](../tabs/analytics-tab.md), [Trazas](../tabs/traces-tab.md) e [Historial de ejecuciones](./execution-history.md).

### [Analíticas](../tabs/analytics-tab.md)

La pestaña Analíticas muestra métricas y tendencias de ejecución. Las estadísticas de resumen incluyen ejecuciones totales, tasa de éxito, tasa de errores, desgloses de latencia y **Tiempo ahorrado** total (la suma de los minutos estimados ahorrados por ejecución de cada workflow × sus ejecuciones exitosas). Más usados enumera esa misma suma por workflow. Seleccione un rango de tiempo base (24h, 7d, 30d o todo), filtre opcionalmente por workflow y luego arrastre sobre cualquier gráfico para profundizar en un rango de fechas seleccionado. Los gráficos y las tablas de workflows se actualizan según la selección, y la actualización automática mantiene las métricas al día. Complementa el [Historial de ejecuciones](./execution-history.md) y la vista de [Programaciones](../tabs/scheduled-tab.md) cuando necesita tanto resultados pasados como ejecuciones próximas.

Véase también [Historial de ejecuciones](./execution-history.md), [Programaciones](../tabs/scheduled-tab.md) y [Evaluaciones](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Ver demostración de Analíticas</a></p>
### [Dashboard](../tabs/dashboard-tab.md)

La pestaña Dashboard es un espacio al estilo Grafana donde usted construye cuadrículas de widgets de gráficos, cada uno renderizado desde su propio workflow oculto de Heym. Mantenga tantos dashboards como necesite y comparta cada uno con usuarios o equipos, en modo de solo lectura o editable; los widgets siempre se ejecutan con las credenciales del propietario, por lo que todos ven los mismos datos. Describa una métrica en lenguaje natural y la IA genera el widget, o añada uno manualmente y elija un tipo de gráfico, previsualizado con datos de ejemplo: barras, líneas, área, circular, tabla, numérico, gauge, dispersión, proporción, barra gauge, texto o HITL. HITL es un carrusel de sus revisiones humanas pendientes. El encabezado muestra `1/n pending`. El nombre del workflow abre esa ejecución en el canvas. **Approve**, **Request changes** y **Reject** la resuelven, y el icono de historial junto al título del widget abre esa ejecución en el diálogo de historial en la misma página. Los widgets almacenan en caché sus resultados, se pueden ajustar con IA (cada cambio se guarda en [Edit History](./edit-history.md)), clonar junto con su workflow completo, reorganizar con Tidy up, y arrastrar o redimensionar en modo de edición. Las tablas pueden mostrar chips de estado y enlazar sus filas a un panel de detalles que lee el registro de la fila pulsada como `$page.record`, y un widget de ejecución (Run) ejecuta un workflow desde el panel: con un archivo arrastrado, con sus campos de entrada o con un botón Ejecutar. Dado que cada widget es un workflow, cualquier dato que usted pueda obtener — una llamada [HTTP](../nodes/http-node.md), una consulta a [BigQuery](../nodes/bigquery-node.md), una búsqueda [RAG](../nodes/rag-node.md) o la salida de un [LLM](../nodes/llm-node.md) — puede convertirse en un gráfico. La configuración de un widget HITL puede limitarlo a las revisiones de un solo workflow, o a un paso de aprobación de agente o Slack en él; tal widget las muestra a todas las personas que pueden abrir ese workflow y queda oculto para quienes no pueden. [Chat](../tabs/chat-tab.md) y la herramienta MCP `heym_chat` enumeran sus dashboards con sus widgets, indican en qué dashboard se encuentra un workflow, añaden un nuevo widget (primero uno vacío cuyo workflow Chat construye y prueba), colocan un workflow existente como widget, cambian el nombre o eliminan widgets y ordenan el diseño tal como hace el botón Organizar.

Véase también [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) y [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>

### [Evals](../tabs/evals-tab.md)

La pestaña Evals (en `/evals`) le permite crear suites de evaluación, añadir o generar casos de prueba, optimizar el prompt de la suite y ejecutar evaluaciones contra workflows de [Agent Node](../nodes/agent-node.md). Seleccione uno o más modelos, elija un método de puntuación (Exact Match, Contains o LLM-as-Judge), opcionalmente permita que un modelo independiente o un [Decision Model](../nodes/decision-node.md) evalúe las respuestas de LLM-as-Judge, establezca ejecuciones por prueba (además de temperatura y esfuerzo de razonamiento para Exact Match y Contains), y luego compare los resultados de aprobado/fallido y las salidas por modelo. Revise el historial de ejecuciones de evaluaciones anteriores, incluido el juez que utilizó cada ejecución, vuelva a ejecutar una con el mismo juez, expórtela como JSON y verifique el comportamiento subyacente en [Traces](../tabs/traces-tab.md).

Una **suite de agente** comprueba en su lugar un único nodo de agente: muestra la latencia de referencia del agente, el coste en USD, los tokens y las llamadas a herramientas a partir de sus ejecuciones reales, permite marcar cada herramienta, herramienta MCP, subagente, sub-workflow o habilidad como obligatoria o prohibida para el agente, establece límites superiores un 20 % por encima de la referencia, ejecuta el workflow un número determinado de veces con las entradas de la última ejecución o escritas por IA, y puntúa cada ejecución con el motivo de cualquier fallo. El selector de suites enumera ambos tipos y permite realizar búsquedas, y el informe [Workflow Analysis](./workflow-analysis.md) sugiere una suite para workflows con nodos de agente o LLM.

Véase también [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) y [Execution History](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Teams](../tabs/teams-tab.md)

La pestaña Teams le permite crear y gestionar equipos. Cree un equipo, añada miembros por correo electrónico y elimine miembros (el creador no se puede eliminar). Comparta [workflows](../tabs/workflows-tab.md), [templates](../tabs/templates-tab.md), [credentials](../tabs/credentials-tab.md), [variables](../tabs/global-variables-tab.md), [vector stores](../tabs/vectorstores-tab.md) y [Drive files](../tabs/drive-tab.md) con equipos desde sus respectivos diálogos de uso compartido; todos los miembros del equipo obtienen acceso. Edite el nombre y la descripción del equipo o elimine el equipo (elimina todos los recursos compartidos con el equipo).

Véase también [Teams](./teams.md), [Credentials Sharing](./credentials-sharing.md) y [Workflow Organization](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

La pestaña Scheduled muestra todos los workflows de [Cron](../nodes/cron-node.md) activos en un calendario visual. Alterne entre las vistas de día, semana y mes para ver cuándo están programadas sus automatizaciones, y luego vuelva al [workflow](../tabs/workflows-tab.md) relacionado cuando necesite editar la programación.

Véase también [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) y [Execution History](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>
### [Logs](../tabs/logs-tab.md)

La pestaña Logs muestra los logs de los contenedores Docker del stack de Heym (backend, frontend, PostgreSQL). Seleccione uno o varios contenedores, filtre por nivel de log (All, INFO, WARNING, ERROR, DEBUG) y realice búsquedas dentro de los logs. Utilícela para depuración y resolución de problemas. Para los logs de ejecución de workflows (resultados de nodos, salidas), utilice en su lugar el [Historial de ejecuciones](./execution-history.md), las [Trazas](../tabs/traces-tab.md) o el panel de Debug del editor.

Consulte también [Historial de ejecuciones](./execution-history.md), [Trazas](../tabs/traces-tab.md) y [Funciones del Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Ver la demo de Logs</a></p>

### [DataTable](../tabs/datatable-tab.md)

La pestaña DataTable permite crear y gestionar tablas de datos estructuradas dentro de Heym. Defina columnas tipadas (string, number, boolean, date, JSON), gestione filas con edición en línea mediante doble clic, importe y exporte CSV, y comparta tablas con usuarios o [equipos](./teams.md) con permisos de lectura y escritura. Utilice el [Nodo DataTable](../nodes/datatable-node.md) para acceder a las tablas de forma programática en los workflows. Una sección fijada de **Tablas del sistema** en la parte superior aloja la **Tabla de costes de LLM**: una vista de esquema fijo con los precios por modelo, inicializada desde Helicone en segundo plano (TTL de 24 horas, actualización manual), donde cada usuario puede sobrescribir precios o añadir filas personalizadas para modelos que Helicone no incluye. Estas reglas de precios alimentan el KPI de costes y el gráfico de costes por modelo de la pestaña [Trazas](../tabs/traces-tab.md).

Consulte también [Nodo DataTable](../nodes/datatable-node.md), [Trazas](../tabs/traces-tab.md), [Estructura del workflow](./workflow-structure.md) y [Equipos](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Ver la demo de DataTable</a></p>

### [Drive](../tabs/drive-tab.md)

La pestaña Drive muestra todos los archivos generados por las skills en sus workflows. Enumera cada archivo con su nombre, tipo, tamaño, nodo de origen, fecha de creación y estado de uso compartido con equipos, y ofrece controles de búsqueda, descarga autenticada, uso compartido, eliminación y paginación. Es el complemento de panel de control de [Generación de archivos](./file-generation.md), la referencia de [Drive](./drive.md) y el [Nodo Drive](../nodes/drive-node.md).

Consulte también [Drive](./drive.md), [Generación de archivos](./file-generation.md) y [Nodo Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Ver la demo de Drive</a></p>

### [Colaboración en el Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).

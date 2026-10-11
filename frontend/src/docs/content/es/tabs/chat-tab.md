# Pestaña Chat

La pestaña **Chat** proporciona una interfaz directa de chat con el LLM. Úsela para probar modelos, formular preguntas, ejecutar workflows existentes o crear un nuevo workflow a partir de una solicitud en lenguaje natural.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Ver demo de Chat</a></p>

## Configuración

1. Seleccione una [credencial](./credentials-tab.md) (clave de API para OpenAI, Google, etc.)
2. Elija un modelo en el menú desplegable (los modelos se cargan desde la credencial seleccionada)
3. Comience a escribir para enviar mensajes

También puede iniciar una conversación desde el cuadro de chat de la [pestaña Workflows](./workflows-tab.md). Envía su primer mensaje y abre la nueva conversación aquí con la respuesta ya en streaming.

## Características

- **Contexto de variables globales** – Sus [Variables globales](../reference/global-variables.md) están disponibles para el LLM, por lo que puede preguntar o hacer referencia a valores almacenados
- **Contexto de plantillas del espacio de trabajo** – Las plantillas compartidas de workflow y de nodos en su espacio de trabajo se incluyen como contexto, de modo que Chat puede responder preguntas sobre las plantillas disponibles
- **Agente de larga duración** – Chat sigue trabajando en el backend aunque se cierre el navegador, por lo que puede regresar desde otro dispositivo y continuar la misma conversación
- **Creación de workflows** – Solicite a Chat que cree o configure un workflow, y este utiliza el mismo motor Workflow AI Builder que el asistente del editor para generar y guardar el workflow
- **Creación de tareas en Kanban** – Solicite de forma natural agregar una tarea o crear una tarjeta. Chat la agrega a la primera columna del tablero solicitado; cuando tiene varios tableros y no nombra ninguno, Chat presenta un selector de tableros antes de crear la tarjeta
- **Mensajes de seguimiento en cola** – Envíe más mensajes mientras una respuesta está en streaming. Los mensajes en cola se conservan, pueden editarse o eliminarse antes de que comiencen, y se ejecutan en orden después de la respuesta activa
- **Pausas de planificación** – Cuando Chat necesita detalles de planificación, formula preguntas de aclaración y pausa los mensajes de seguimiento en cola hasta que usted responda. Una vez finalizada la respuesta de planificación, los mensajes en cola se reanudan
- **Credenciales** – Cuando un workflow que Chat crea o edita necesita una credencial, Chat pregunta cuál usar, ofrece crear una nueva en la conversación o permite continuar sin ella. También puede solicitar a Chat que cree una credencial o que actualice una de su propiedad; abre el formulario de credencial en la conversación. El modelo ve el nombre y el tipo de la credencial, nunca sus valores. Consulte [Asistente IA › Credenciales](../reference/ai-assistant.md#credentials)
- **Tablas de datos** – Cuando un workflow que Chat crea o edita almacena registros, Chat pregunta qué [tabla de datos](./datatable-tab.md) usar u ofrece crear una con las columnas que el workflow necesita. También puede listar sus tablas y sus columnas. Nunca lee ni escribe filas. Consulte [Asistente IA › Tablas de datos](../reference/ai-assistant.md#data-tables)
- **Respuestas en streaming** – Visualice la salida del modelo a medida que se transmite
- **Detener respuesta** – Interrumpa la respuesta en streaming actual en cualquier momento; detenerla también borra los mensajes en cola de esa conversación
- **Renderizado de Markdown** – Las respuestas admiten formato Markdown, incluidas imágenes en línea
- **Visualización de imágenes** – Las imágenes incrustadas en las respuestas (por ejemplo, de la generación de imágenes del LLM) aparecen en línea; haga clic en cualquier imagen para verla a pantalla completa. Pulse **Esc** o el botón de retroceso (móvil) para cerrar la vista a pantalla completa
- **Copiar mensajes** – Copie cualquier mensaje al portapapeles
- **Limpiar chat** – Inicie una nueva conversación
- **Entrada de voz** – Use el botón del micrófono para la conversión de voz a texto (compatible con el navegador). Cuando se detiene la grabación, Heym puede limpiar ligeramente la transcripción antes de que usted la envíe
- **Workflows programados** – Pregunte cuándo se ejecutan los workflows de cron (hoy, esta semana, este mes o un rango de fechas personalizado). El asistente utiliza los mismos datos de programación que la pestaña [Programaciones](./scheduled-tab.md) y puede limitar los resultados a los workflows de su propiedad o incluir los compartidos con usted
- **Historial de ejecuciones de workflows** – Pregunte sobre un workflow ("¿cuántas veces se ejecutó el informe diario?", "¿falló?", "¿cuándo se ejecutó por última vez?"). Chat busca el workflow por su ID y responde a partir de su recuento de ejecuciones, desglose de estados, hora de la primera y última ejecución y duración media. Pregunte por qué falló una ejecución o qué devolvió, y Chat abre esa única ejecución para leer sus entradas, salidas y errores por nodo
- **Estado de ejecución en vivo** – Pregunte qué se está ejecutando en este momento y Chat responde con el recuento, los nombres de los workflows, cuánto tiempo lleva en marcha cada ejecución, en qué nodo se encuentra y un enlace directo a la ejecución en vivo

## Uso de Chat desde un cliente MCP

El motor de Chat también puede ser accedido desde fuera del navegador. Active la **Heym Chat Tool** en la [pestaña MCP](./mcp-tab.md) y los clientes MCP — Claude, Cursor y cualquier otro que hable MCP — obtienen una única herramienta `heym_chat` que ejecuta este mismo motor con todas sus capacidades.

Esas conversaciones se registran en el historial de esta pestaña, marcadas con un icono de enchufe en la lista de conversaciones. Abra una para leer lo que solicitó el cliente, ver las tarjetas de herramientas que activó y continuar el hilo usted mismo. Responder a una pregunta de aclaración funciona de la misma manera, ya sea que el turno se haya iniciado aquí o desde un cliente MCP.

A través de MCP, Chat no lista, selecciona ni crea credenciales. Los Workflows que construye dejan los campos de credenciales vacíos, y la respuesta nombra los nodos que necesitan una credencial para que pueda configurarlos en el editor.

Las tablas de datos también funcionan a través de MCP: Chat lista sus tablas, crea nuevas y las integra en los workflows que construye. Su pregunta sobre la tabla llega como texto en el resultado, por lo que debe responderse con el mismo `conversation_id`.

## Límite de contexto

El chat mantiene hasta 25 mensajes recientes en contexto. Los mensajes más antiguos se recortan para mantenerse dentro de los límites del modelo.

## Creación de Workflows

Cuando solicita a Chat que cree, construya, genere o configure un workflow, este crea un nuevo workflow guardado con un nombre y una descripción generados. La respuesta incluye una vista previa de solo lectura del canvas con los nodos y las conexiones generados, además de un enlace **Open workflow** que abre el editor de workflows en una nueva pestaña del navegador. Utilice el botón **Run** de la tarjeta de vista previa cuando desee ejecutar el workflow.

Los comentarios de seguimiento en el mismo chat editan ese workflow en lugar de crear otro. Por ejemplo, después de que Chat cree un workflow puede indicar "add an approval step", "change the output format" o "şöyle yap" y Chat actualizará el workflow guardado y refrescará la vista previa.

Esto es ideal para solicitudes en las que se desea que el trabajo se realice como una automatización reutilizable, no solo como una respuesta puntual.

## Creación de tareas Kanban

Solicite a Chat en lenguaje natural, por ejemplo, "Add a task called Fix login bug" o
"Create a new card Update documentation on the Launch board." Puede incluir una
descripción en la misma solicitud. Chat siempre crea la tarjeta en la primera columna del tablero
seleccionado.

Si su espacio de trabajo tiene varios tableros y no identifica uno, Chat se detiene con un
selector de tablero de opción única. Seleccione un tablero para finalizar la creación de la tarjeta. No se requiere
ningún comando de barra ni formato de mensaje especial.

## Consulta sobre lo que está en ejecución

Pregunte en lenguaje natural — "what is running?", "how many workflows are active right now?",
"which node is the nightly report on?" — y Chat informa el panorama en vivo:

- **Cuántas** ejecuciones están en curso, divididas en en ejecución y en espera de revisión humana
- **A qué workflows** pertenecen, por nombre
- **Cuánto tiempo** lleva cada ejecución (por ejemplo `1m 35s`, `3h 25m`)
- **Qué nodo** se está ejecutando en este momento, por su etiqueta en el canvas, además del último nodo que finalizó
- **Un enlace** a cada ejecución en vivo, que abre el canvas con esa ejecución reproduciéndose

Las ejecuciones pausadas para una [Human-in-the-Loop](../reference/human-in-the-loop.md) o una revisión de Codex se reportan como
en espera de usted, no como en ejecución. Estos son los mismos datos que la insignia de ejecuciones activas en el encabezado,
por lo que Chat y la insignia nunca discrepan. Para ejecuciones que ya finalizaron, consulte las ejecuciones recientes
en su lugar — eso lee el [Execution History](../reference/execution-history.md).

## Consulta sobre Alertas

Chat puede responder preguntas sobre las [alertas](./alerts-tab.md) que ha definido:

- **Qué existe** — "what alerts do I have?", "is there an alert on the invoice workflow?",
  "which alerts are firing right now?"
- **Cómo está configurada una** — "what is the threshold on the cost alert?", "how is that configured?"
- **Por qué y cuándo se activó** — "why did the cost alert fire?", "when did this last trigger?"

Para una pregunta del tipo "por qué se activó", Chat lee el registro de activación y cita el valor
observado real, el umbral y la ventana exacta que se evaluó, además del detalle contribuyente:
ids de ejecuciones fallidas y mensajes de error para alertas de error, gasto por modelo para alertas de costo, o
el desglose por origen de trigger para alertas de conteo de ejecuciones. Reporta lo que era cierto cuando la alerta
se activó en lugar de recalcular la ventana, porque la ventana ya pasó y un cálculo nuevo
puede dar una respuesta diferente.

## Reglas de usuario

Las [Reglas de usuario](../reference/user-settings.md) (configuradas en Settings) se inyectan automáticamente en cada conversación de Chat como instrucciones a nivel de sistema. Configúrelas una vez para aplicar preferencias persistentes a todas las solicitudes de chat.

## Relacionado

- [Pestaña MCP](./mcp-tab.md) – Exponga este motor a clientes MCP como la herramienta `heym_chat`
- [Configuración](../reference/user-settings.md) – Defina Reglas de usuario aplicadas a todas las solicitudes de chat
- [Pestaña Credenciales](./credentials-tab.md) – Añada y gestione claves API
- [Pestaña Variables](./global-variables-tab.md) – Variables globales disponibles para el Chat
- [Tipos de Nodo](../reference/node-types.md) – Nodos LLM y de agente para workflows
- [Nodo de agente](../nodes/agent-node.md) – Agente IA con llamada a herramientas
- [Asistente IA](../reference/ai-assistant.md) – Asistente del editor impulsado por el mismo DSL del constructor de workflows
- [Historial de ejecuciones](../reference/execution-history.md) – Consulte ejecuciones anteriores (botón Historial en el encabezado)
- [Pestaña Programaciones](./scheduled-tab.md) – Calendario de próximas ejecuciones cron (los mismos datos que el Chat puede resumir)
- [Pestaña Alertas](./alerts-tab.md) – Alertas de umbral que el Chat puede listar y explicar
- [Showcase contextual](../reference/contextual-showcase.md) – Orientación compacta dentro de la aplicación para esta página
- [Voz del Chat (TTS y STT)](../reference/chat-voice.md) – Lea mensajes en voz alta y converse manos libres con ElevenLabs

## Llamadas a herramientas y tamaño del contexto

Cada vez que el asistente invoca una herramienta (ejecutar un workflow, listar ejecuciones, construir un nuevo workflow), aparece una tarjeta plegable en la conversación. La tarjeta se expande automáticamente mientras la herramienta se ejecuta, mostrando los argumentos exactos. Cuando la herramienta finaliza, la tarjeta se pliega en un resumen de una línea con el tiempo transcurrido. Haga clic en cualquier tarjeta para volver a expandir los argumentos y el resumen de la respuesta.

Un pequeño indicador circular bajo el campo de entrada muestra el uso actual del contexto como porcentaje de la ventana del modelo (por ejemplo, `12% · ~9.2k`). Pase el cursor sobre el indicador para ver un desglose: prompt del sistema, AGENTS.md, bloque de workflows, reglas de usuario, historial y su borrador de entrada. Cuando el uso supera el 80%, el anillo se vuelve ámbar; al 95%, se vuelve rojo.

Si el uso se acerca al límite, Heym comprime automáticamente los mensajes más antiguos en un resumen breve utilizando el mismo mecanismo que emplean los nodos de agente. Aparece una tarjeta de "Contexto comprimido" en línea para mostrar lo sucedido.

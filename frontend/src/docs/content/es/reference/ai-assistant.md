# Asistente de IA

El **Asistente de IA** es un panel de chat que se abre desde el panel de Debug y se inicia en la esquina inferior derecha del editor. Arrastre el encabezado para moverlo, y arrastre un borde o una esquina para cambiar su ancho o alto. No se reducirá por debajo de 360×480 píxeles. La posición y el tamaño se recuerdan en este navegador. **Reset position and size** en el encabezado devuelve el panel a la esquina inferior derecha. Utilice lenguaje natural para crear o modificar workflows: describa lo que desea y la IA genera nodos y aristas que se aplican al canvas.

Para consultas de documentación fuera del editor, utilice [Chat with Heym](./chat-with-heym.md). Esa superficie está optimizada para ayuda de producto con reconocimiento de página en lugar de generación de workflows.

## Abrir el panel

1. Abra un workflow en el editor
2. Localice el **panel de Debug** en la parte inferior (área de resultados de ejecución)
3. Haga clic en el botón **AI** (icono Sparkles) en la barra de herramientas del panel
4. El panel del Asistente de IA se abre en la esquina inferior derecha. Arrastre su encabezado para moverlo, o arrastre un borde o una esquina para cambiar su ancho y alto.

Pulse `Ctrl + I` / `Cmd + I` en cualquier parte del editor para abrir o cerrar el panel; el atajo funciona incluso mientras un campo de texto tiene el foco. Consulte [Keyboard Shortcuts](./keyboard-shortcuts.md).

Para trabajar en un solo nodo, pase el cursor sobre él en el canvas y haga clic en **AI** arriba. El panel se abre enfocado en ese nodo. Consulte [Cambiar un solo nodo](#changing-one-node).

## Cerrar el panel

Haga clic en el botón **X**, pulse `Ctrl + I` / `Cmd + I`, o alterne el botón **AI** en la barra de herramientas del panel de Debug. El encabezado arrastra el panel; no lo cierra.

## Configuración

Antes de enviar mensajes, seleccione:

| Ajuste | Descripción |
|---------|-------------|
| **Credential** | Credencial de LLM (API key) desde [Credentials](../tabs/credentials-tab.md) |
| **Model** | Nombre del modelo (p. ej. `gpt-4o`, `gemini-2.5-flash`) |

Añada credenciales en la [Credentials Tab](../tabs/credentials-tab.md). La lista de modelos se carga desde la credencial seleccionada.

## Agent Mode vs Ask Mode

El panel tiene dos modos, que se alternan con el chip **Agent / Ask** en el encabezado del panel.

| Modo | Predeterminado | Comportamiento |
|------|---------|-----------|
| **Agent** | ✓ | Construye y modifica el canvas. La IA genera un bloque JSON de workflow que se aplica automáticamente al canvas cuando la respuesta se completa. |
| **Ask** | | Solo responde preguntas. El canvas nunca se modifica. Utilice este modo para preguntar sobre su workflow, las funciones de Heym u obtener asesoramiento sin desencadenar una actualización del canvas. |

Cambie de modo en cualquier momento. Cambiar el modo no borra la conversación.

En el modo Agent, la casilla **YOLO mode** bajo el campo de mensaje hace que el asistente ejecute y corrija lo que construye. Consulte [YOLO Mode](#yolo-mode).

## Uso del Chat

- Escriba su solicitud en la entrada (p. ej. "Create a workflow that takes user input and sends it to an LLM")
- Pulse **Enter** para enviar (Shift+Enter para nueva línea)
- La IA transmite su respuesta. En modo **Agent**, si la respuesta incluye un workflow en un bloque de código \`\`\`json, se analiza y se aplica automáticamente al canvas. En modo **Ask** el canvas nunca se modifica.
- Utilice **Clear** para restablecer la conversación
- Pase el cursor sobre un mensaje y haga clic en su icono de copiar para copiar el texto que muestra, incluido cualquier JSON de workflow
- Arrastre la línea situada encima del cuadro de mensaje para hacerlo más alto. El área de entrada puede crecer hasta el 60% del panel, y vuelve a su altura predeterminada cuando se recarga la página

## Aplicación automática del workflow

Cuando la respuesta de la IA contiene un bloque JSON de workflow válido (con `nodes` y, opcionalmente, `edges`) en un bloque de código \`\`\`json, Heym:

1. Analiza el JSON de la respuesta
2. Reemplaza el canvas actual con los nuevos nodos y aristas
3. Ordena la disposición de los nodos
4. Marca el workflow como no guardado

Si el análisis falla, aparece un botón **Retry** para regenerar la respuesta.
## Cambiar un solo nodo

Pase el cursor sobre un nodo en el canvas y haga clic en **AI** arriba. El panel se abre en modo Agent, enfocado en ese nodo, y muestra qué nodo está modificando:

| El nodo tiene... | El panel muestra |
|---|---|
| Sin resultado en la ejecución actual | **Modifying Node:** en una fila compacta con el icono y el nombre del nodo. El asistente edita solo a partir de la configuración del nodo; ejecute el nodo primero si debe ver la salida |
| Un resultado en la ejecución actual | **Modifying Node: (Has Node Output)** encima del propio nodo: icono, nombre y tipo, el último estado y duración, y el error si falló. El asistente ve esa salida y el error cuando edita el nodo |

Pase el cursor sobre la etiqueta para ver en qué estado se encuentra el panel.

En cualquiera de los estados, el asistente también lee la página de documentación del nodo, situada tras el icono de libro en el encabezado del nodo. Utiliza la página para comprender las opciones del nodo y responder preguntas sobre ellas.

Debajo de los mensajes, tres opciones inician la solicitud:

| Opción | Qué hace |
|---|---|
| **Change this node as ...** | Rellena el cuadro de mensaje con *Cambiar este nodo a* para que usted termine la frase |
| **Fix error in this node ...** | Rellena *Corregir el error en este nodo.* El asistente lee el error de este nodo de la última ejecución |
| **Other** | Enfoca un cuadro de mensaje vacío |

Edite el texto y presione **Send**. El asistente devuelve solo este nodo y Heym lo actualiza en el lugar: el nodo conserva su id, tipo y nombre, de modo que expresiones como `$checkLinkedIn.result` en otros nodos siguen funcionando. Otros nodos, conexiones y el diseño no cambian, y **Undo** restaura la configuración anterior.

Si la solicitud no cabe dentro del nodo, por ejemplo si necesita otro tipo de nodo o un nodo nuevo, el asistente indica lo que tendría que cambiar en lugar de editar. Cierre el foco del nodo con la **X** en la tarjeta del nodo para editar todo el workflow de nuevo. Cerrar el panel también borra el foco.

El [modo YOLO](#yolo-mode) funciona con un nodo enfocado: el asistente cambia el nodo, ejecuta el workflow y corrige el nodo hasta que la ejecución sea correcta. En el modo **Ask**, el foco le indica al asistente sobre qué nodo es su pregunta y el canvas no se modifica.

## Modo YOLO

El **modo YOLO** permite que el asistente pruebe lo que construye. Marque la casilla **Modo YOLO** debajo del campo de mensaje y, a continuación, envíe su solicitud. La casilla aparece únicamente en el modo Agent. Está desactivada de forma predeterminada y se restablece a desactivada cuando la página se recarga. Pase el cursor sobre el icono de información situado junto a ella para ver un breve resumen.

Con el modo YOLO activado, el asistente no se detiene después de aplicar un workflow:

1. Aplica el workflow al canvas.
2. Antes de la primera ejecución, solicita las entradas de prueba. La tarjeta enumera los campos de entrada del workflow, rellenados con los valores que sugiere el asistente. Edítelos y pulse **Run**. Las ejecuciones posteriores reutilizan estos valores. La tarjeta solo vuelve a aparecer cuando cambian los campos de entrada o el asistente necesita datos de prueba diferentes.
3. Ejecuta el workflow en el canvas exactamente igual que el botón **Run**: primero se guardan los cambios no guardados, los nodos se iluminan y la ejecución aparece en el panel Debug y en el [Historial de ejecuciones](./execution-history.md).
4. Lee el resultado. Si la ejecución hizo lo que usted solicitó, finaliza con **Verified** y un breve resumen. Si no, corrige el workflow y lo ejecuta de nuevo.

Realiza como máximo **5 ejecuciones** por mensaje. Pulse **Stop** en cualquier momento para finalizar el bucle y detener una ejecución en curso.

Cada respuesta muestra sus pasos a medida que ocurren:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, con una fila `Executing <node>` por cada nodo;
- el veredicto final.

Después de cada ejecución, una línea breve como *Attempt 1 result sent · error in 1.2s* indica que el resultado se devolvió al asistente.

### Ejecutar sus otros workflows

En el modo YOLO, el asistente también puede ejecutar sus otros workflows cuando necesita su resultado. Por ejemplo, puede comprobar qué devuelve un workflow antes de invocarlo desde un nodo [Execute](../nodes/execute-node.md). Estas ejecuciones aparecen como pasos `Running workflow "<name>"...` y se registran en el Historial de ejecuciones con el origen del trigger `ai_assistant`. El workflow que se está editando siempre se prueba en el canvas.

### Cuándo se detiene antes de tiempo

| Situación | Qué ocurre |
|---|---|
| El asistente necesita una decisión, información, una credencial o una tabla de datos | Lo solicita con la tarjeta de pregunta habitual. Responder continúa el bucle. |
| La ejecución espera una [revisión humana](./human-in-the-loop.md) | El bucle se detiene. Apruebe la revisión y, a continuación, envíe un mensaje. |
| El workflow espera la carga de un archivo | El bucle se detiene. El modo YOLO no puede probar ejecuciones activadas por carga de archivos. |
| Se guardó una versión más reciente del workflow en otro lugar | El bucle se detiene. Resuelva el conflicto de guardado y, a continuación, envíe un mensaje. |

> **Las ejecuciones son reales.** Los correos electrónicos, los mensajes y las llamadas a la API del workflow se envían realmente en cada intento, y los nodos DataTable escriben filas reales. Cada ejecución guarda el workflow, por lo que las versiones anteriores permanecen en el [Historial de edición](./edit-history.md).

## Entrada de voz

En los navegadores compatibles, un botón **Voice** habilita la conversión de voz a texto. Haga clic para iniciar la grabación y vuelva a hacer clic para detenerla. El texto transcrito se envía a la IA para corregir la gramática antes de que usted lo envíe.

## Nodo Agent vs AI Assistant

| | Nodo Agent | AI Assistant |
|---|------------|---------------|
| **Propósito** | Nodo LLM dentro de un workflow; se ejecuta durante la ejecución | Interfaz de Chat para construir workflows con lenguaje natural |
| **Ubicación** | Nodo del canvas | Panel Debug → panel flotante |
| **Cuándo** | En tiempo de ejecución | Durante la edición |

Consulte [Nodo Agent](../nodes/agent-node.md) para obtener información sobre el nodo de workflow que ejecuta llamadas LLM con herramientas y MCP.

## Cómo funciona (AI Builder DSL)

El AI Assistant funciona mediante un **workflow DSL** (lenguaje específico de dominio) que describe nodos, aristas y expresiones. Cuando usted envía un mensaje:

1. Su mensaje, junto con las [Reglas de usuario](./user-settings.md) y el workflow actual (si existe), se envían al backend.
2. El backend construye un **prompt de sistema** que incluye:
   - El workflow DSL completo (tipos de nodo, sintaxis de expresiones, reglas, ejemplos)
   - Sus Reglas de usuario añadidas como "User Custom Rules"
   - El JSON del workflow actual cuando usted está editando un workflow existente
   - La lista de workflows disponibles si utiliza el nodo Execute
   - Los nombres, tipos e ids de las credenciales que posee o que se compartieron con usted (nunca sus valores)
   - Los nombres, ids, descripciones y columnas de las tablas de datos que puede utilizar (nunca sus filas)
3. El modelo devuelve un único bloque JSON de workflow (con `nodes` y `edges`). El frontend lo analiza y lo aplica al canvas.
### Credenciales

Cuando un workflow necesita una credencial, el asistente lo consulta antes de crearlo. Si usted dispone de credenciales de un tipo adecuado, las enumera junto con **Create a new credential**; si no dispone de ninguna, pregunta si desea crear una. Cada pregunta también le permite continuar sin una credencial.

Si elige crear una, se abre el formulario de credencial en el panel, preconfigurado con el tipo correcto y un nombre sugerido. Los valores van directamente a Heym; el asistente solo conoce el nombre y el tipo. Las credenciales OAuth (Google Sheets, Google Drive, BigQuery, Linear, Notion) se conectan en una ventana emergente, y aparece un enlace a la página de autorización en caso de que la ventana emergente esté bloqueada. Una vez guardada la credencial, la tarjeta muestra su nombre y el botón de creación se desactiva; pulse **Submit answers** y el asistente coloca la nueva credencial en el nodo.

También puede solicitar una credencial por sí sola ("create a GitHub credential") o pedir que se modifique una que ya posee ("update my sheet credential", "reconnect my Google Sheets"). El asistente responde con la misma tarjeta: la creación abre un formulario vacío, la actualización abre el formulario sobre esa credencial con sus secretos enmascarados.

El asistente prefiere un nodo dedicado. Cuando ningún nodo cubre una operación, como añadir una pestaña a un Google Sheet, utiliza una petición HTTP y escribe la línea de encabezado para la credencial elegida. Consulte [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Las preguntas de aclaración de las que el workflow puede prescindir indican **Optional** en su entrada y pueden omitirse.

El DSL impone etiquetas en camelCase, reglas de expresión unificadas y campos específicos de cada nodo. Si el valor de un campo es un único `$expr`, el backend conserva el tipo nativo; si el valor mezcla texto con `$refs`, el resultado es una cadena. La regla del único `$` sigue aplicándose: ningún `$` dentro de paréntesis. Las User Rules de [Settings](./user-settings.md) se inyectan en este prompt del sistema para que sus preferencias se apliquen a cada workflow generado por IA.

Si el workflow actual contiene Agent skills, el AI Assistant incluye únicamente el `SKILL.md` de cada skill en ese contexto del workflow. Los archivos `.py` adjuntos y los recursos binarios de las skills se eliminan antes de la petición para que el builder se mantenga dentro de los límites de contexto del modelo incluso cuando las skills contienen implementaciones grandes.

### Tablas de datos

Cuando un workflow guarda, almacena o busca registros y usted no ha indicado otro almacén, el asistente utiliza un nodo [DataTable](../nodes/datatable-node.md). Si usted nombra una de sus tablas y esta tiene las columnas que el workflow necesita, el asistente la utiliza. En caso contrario, pregunta qué tabla usar. La tarjeta enumera las tablas que encajan, cada una con su descripción y tipos de columna, además de **Create a new table** con un nombre y unas columnas propuestos. También se ofrecen las tablas compartidas con usted; una en la que solo tiene permiso de lectura se ofrece únicamente para lectura.

Seleccione la nueva tabla y pulse **Submit answers**: la tarjeta crea la tabla y el asistente coloca su id en el nodo y utiliza sus nombres de columna exactos. También puede solicitar una tabla por sí sola, por ejemplo "create a table for my leads".

El asistente del canvas ve nombres de tablas, descripciones y columnas, nunca filas. Configura los nodos del workflow a partir de esos metadatos; añada columnas en la [pestaña DataTable](../tabs/datatable-tab.md) o solicítelo en el [Chat](../tabs/chat-tab.md). Chat y `heym_chat` pueden inspeccionar filas y añadir o eliminar columnas directamente, así como insertar, actualizar o eliminar filas en las tablas de su propiedad o con permisos de escritura, incluidos los recursos compartidos con equipos. La eliminación de columnas y el vaciado de todas las filas solicitan confirmación antes de borrar datos.

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – La construcción en lenguaje natural como primera etapa del ciclo de vida del agente
- [Quick Start](../getting-started/quick-start.md) – Cree su primer workflow
- [Settings](./user-settings.md) – User Rules inyectadas en el prompt del sistema del AI Assistant
- [Chat with Heym](./chat-with-heym.md) – Asistente con reconocimiento de página dentro del área de documentación
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodos y flujo de ejecución
- [Agent Node](../nodes/agent-node.md) – Nodo LLM con herramientas y MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Añada claves de API para el AI Assistant
- [Workflow Structure](./workflow-structure.md) – Formato JSON para workflows

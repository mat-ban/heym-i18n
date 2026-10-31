# Pestaña MCP / A2A / A2A

La pestaña **MCP** configura la integración con el Model Context Protocol (MCP), y como servidores [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) a los que otros agentes pueden delegar tareas. MCP permite que los clientes de IA (Claude, ChatGPT, Gemini, Cursor y cualquier herramienta compatible con MCP) invoquen sus workflows de Heym como herramientas.

Heym admite dos modos: un **servidor predeterminado** que expone todos los workflows habilitados para MCP bajo un único endpoint, y **servidores con nombre** que otorgan a cada grupo lógico de workflows su propia URL dedicada y su propia API key.

Ambos modos pueden exponer dos tipos de herramientas: **workflows** individuales y la **herramienta de chat de Heym** — todo el motor de la [pestaña Chat](./chat-tab.md) detrás de una única herramienta `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Ver demostración de MCP</a></p>

## Servidor MCP predeterminado

El servidor predeterminado siempre está disponible en `{origin}/api/mcp/sse`. Todos los workflows con MCP activado aparecen aquí como herramientas.

### MCP API Key

- Las claves se almacenan como resúmenes SHA-256, por lo que Heym no puede mostrarle una clave existente. La pestaña indica si hay una configurada, no cuál es.
- **Generate** / **Regenerate** – La nueva clave se muestra una sola vez, justo después de crearla. Cópiela en ese momento; al recargar la pestaña quedará oculta de forma definitiva.
- Utilice esta clave al conectar Claude Desktop, Cursor u otros clientes MCP a Heym
- ¿Perdió una clave? Regenérela. La clave anterior deja de funcionar de inmediato.

### Métodos de conexión

- **API Key** – Utilice la MCP API key para conexiones programáticas. La pestaña puede copiar una configuración JSON lista para usar e incluye un botón **Add to Cursor** para configurar Cursor con un solo clic.
- **Claude** – La pestaña muestra la URL del servidor MCP y los pasos de configuración para Claude. Deje en blanco los campos OAuth Client ID y Secret; Claude se registra automáticamente y se autentica mediante OAuth de Heym.
- **ChatGPT** – La pestaña muestra la URL del servidor MCP y los pasos de configuración para una aplicación de ChatGPT. Active el modo de desarrollador, cree una aplicación con la URL y elija OAuth; ChatGPT se registra automáticamente.
- **Gemini** – La pestaña muestra la URL del servidor MCP y los pasos de configuración para una aplicación personalizada de Gemini: en gemini.google.com, vaya a **Settings → Connected Apps → Add a custom app**, pegue la URL y deje **Advanced features** cerrado; Gemini se registra automáticamente y se autentica mediante Heym OAuth. Una vez conectado, Heym también funciona en la aplicación móvil de Gemini.

### Toggle MCP del workflow

Cada workflow puede exponerse como una herramienta MCP:

- **Enable** – Las herramientas del workflow quedan disponibles para todos los clientes conectados al servidor predeterminado
- **Disable** – El workflow no se expone

Las tarjetas de workflow muestran la descripción y una vista previa de los nombres de los campos de entrada, de modo que puede ver qué espera cada herramienta antes de habilitarla.


### Ejecuciones en cola y heym_execution_status

Un workflow con un [límite de concurrencia](../reference/webhooks.md#concurrency-limit-and-queued-runs) puede estar ocupado cuando un cliente lo llama. La llamada devuelve inmediatamente un resultado que no es un error:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

El cliente sondea la herramienta `heym_execution_status` con ese `execution_id`. Devuelve el mismo cuerpo que la [URL de estado](../reference/webhooks.md#status-url) : `queued` con la posición actual, `running`, y luego `success` o `error` con las salidas. Solo localiza ejecuciones de workflows expuestos por el mismo servidor. La herramienta figura en el servidor predeterminado y en cada servidor con nombre únicamente mientras al menos uno de sus workflows tenga un límite de concurrencia. Cuando la cola del workflow está llena, la llamada devuelve un error: "Concurrency queue is full".
## Agente Heym

La sección **Heym Capabilities** convierte el motor de la pestaña Chat en una única herramienta MCP denominada `heym_chat`. Habilítela en el servidor predeterminado, en cualquier servidor con nombre, o en ambos — cada superficie mantiene su propio toggle y su propia selección de modelo.

Cuando está activada, `heym_chat` aparece en `tools/list` junto con sus herramientas de workflow. Un cliente MCP envía un único mensaje en lenguaje natural y el motor de Heym se encarga del resto, con las mismas capacidades que tiene la pestaña Chat:

- Crear un workflow, probarlo con entradas de ejemplo, corregirlo y finalizar cuando una ejecución sea exitosa (consulte [Modo de construcción](#build-mode))
- Inspeccionar y ejecutar sus workflows existentes
- Informar sobre analíticas, ejecuciones recientes y próximas programaciones cron
- Explicar dónde fallan los workflows y por qué son lentos: los workflows con más ejecuciones, más fallos y mayor lentitud, así como los tipos de nodo con mayor consumo de tiempo, errores y llamadas en las últimas 1, 3 o 6 horas, 24 horas, 7 o 30 días, o en todo momento
- Informar el historial de ejecución de un workflow: cuántas veces se ejecutó, recuentos por estado, cuándo se ejecutó y, a petición, las entradas, las salidas y los errores por nodo de una única ejecución
- Informar qué se está ejecutando en este momento: cuántas ejecuciones están activas, sus nombres de workflow, cuánto tiempo lleva ejecutándose cada una, el nodo en el que se encuentra actualmente y un enlace a la ejecución en vivo
- Listar tableros, crear tarjetas y leer el detalle de una tarjeta en la [pestaña Board](./board-tab.md)
- Listar sus dashboards (páginas de Heym Work) y sus widgets, identificar en qué dashboard se encuentra un workflow, añadir un nuevo widget y construir su workflow, situar un workflow existente como widget, renombrar o eliminar widgets, u organizar el diseño (ver [Dashboard › Desde Chat y MCP](./dashboard-tab.md#from-chat-and-mcp))
- Inspeccionar tablas de datos y filas, crear tablas, añadir o eliminar columnas, insertar, actualizar o eliminar filas, y conectar tablas en workflows
- Crear, editar y ejecutar suites de evaluación de prompts y agentes ([Eval suites](./evals-tab.md#from-chat-and-mcp)), incluida la línea base de un agente: reportada, construida a partir de ejecuciones o especificada numéricamente. El resultado lista el enlace de Evals de cada suite guardada.
- Crear o actualizar sus credenciales en la página propia de Heym (consulte [Credenciales](#credenciales))
- Leer equipos y variables globales, y buscar en la documentación
- Aprobar, editar o rechazar revisiones pendientes de human-in-the-loop

Las capacidades que se añadan a la pestaña Chat en el futuro estarán disponibles automáticamente a través de `heym_chat` — no hay ningún toggle por capacidad que mantener sincronizado.

Estas capacidades se ejecutan dentro de `heym_chat`: `tools/list` muestra `heym_chat` y sus herramientas de workflow, nunca las herramientas internas del chat como las suites de evaluación.

### Modo de construcción

`heym_chat` ejecuta siempre el motor de Chat en modo de construcción. En una sola llamada, el asistente puede guardar un nuevo workflow, ejecutarlo con entradas de ejemplo realistas, leer el informe de ejecución, corregir lo que haya fallado y volver a ejecutarlo, hasta cinco ejecuciones de prueba por llamada. Cuando la última ejecución del último guardado tiene éxito, finaliza con un resumen de una frase y la respuesta termina con `Verified: the latest test run of the saved workflow passed.`

Cuando una llamada crea o edita un workflow, la respuesta enumera cada uno con su enlace completo al editor, como `https://heym.example.com/workflows/<id>`, y los enlaces dentro de la respuesta del asistente también son enlaces completos. Utilizan su dirección de Heym configurada (`FRONTEND_URL`) y se abren para personas que hayan iniciado sesión en Heym y tengan acceso a ese workflow.

- Las ejecuciones de prueba son ejecuciones reales. Sus efectos secundarios se producen y aparecen en el historial de ejecuciones del workflow como cualquier otra ejecución.
- Los guardados siguen la ruta del editor: un cambio en el grafo conserva el grafo anterior en el historial de edición (**Edit History**) del workflow.
- Para modificar un workflow creado anteriormente, continúe el hilo con el mismo `conversation_id`. El asistente actualiza ese workflow en lugar de crear uno nuevo y solo modifica los workflows que usted puede editar.
- Cuando se agotan las cinco ejecuciones de prueba, el asistente se detiene y explica qué sigue fallando.

`heym_chat` puede inspeccionar sus tablas y filas, crear tablas, añadir o eliminar columnas e insertar, actualizar o eliminar filas. Proporciónele un nombre de tabla, UUID o enlace de DataTable, por ejemplo: «Añade dos columnas de texto, nombre y apellido, a https://heym.example/?tab=datatable/<table-id>». Modifica la tabla directamente y conserva las columnas y valores existentes al añadir columnas.

`heym_chat` puede inspeccionar sus tablas y filas, crear tablas, añadir o eliminar columnas e insertar, actualizar o eliminar filas. Proporciónele un nombre de tabla, UUID o enlace de DataTable, por ejemplo: «Añade dos columnas de texto, nombre y apellido, a https://heym.example/?tab=datatable/<table-id>». Modifica la tabla directamente y conserva las columnas y valores existentes al añadir columnas.

Las operaciones de escritura requieren propiedad o acceso de **escritura** mediante uso compartido directo o de equipo. El acceso de solo lectura permite la inspección. La escritura de filas aplica las comprobaciones de tipo, valor predeterminado, campo obligatorio y unicidad de la pestaña DataTable; las importaciones parciales informan de filas rechazadas. Eliminar columnas suprime sus valores de todas las filas. Al igual que en la pestaña DataTable, la eliminación de columnas y el vaciado de filas solicitan confirmación previa; responda con el mismo `conversation_id` para confirmar. Eliminar una fila seleccionada no requiere confirmación adicional.


### Credenciales

`heym_chat` ve las credenciales de su propiedad y las compartidas con usted, por nombre y tipo, de la misma forma que la pestaña Chat. Cuando un workflow que construye necesita una credencial, pregunta cuál usar como pregunta en el resultado. Respóndala con el mismo `conversation_id`.

Para añadir una credencial o actualizar una propia, el asistente abre el formulario de credenciales de Heym en una página de Heym, `/credentials/setup/<id>`. Inicia sesión allí, introduce la clave o conecta la cuenta y pulsa guardar. El valor va directamente a Heym: el cliente MCP y su modelo solo conocen el nombre y el tipo de la credencial. No pegue claves en el cliente MCP; solicite el formulario en su lugar.

| Cliente | Comportamiento |
|---------|----------------|
| Admite elicitación de URL de MCP | El cliente le solicita abrir la página de Heym. La llamada espera mientras completa el formulario, hasta diez minutos, y luego continúa con la nueva credencial. |
| Cualquier otro | El resultado lleva el enlace y solicita al cliente que vuelva a llamar a `heym_chat` con `wait_for_credential_form`. Esa llamada espera hasta cinco minutos mientras completa el formulario y luego reanuda la conversación. Si el cliente no espera, guarde el formulario y responda con el mismo `conversation_id`; la siguiente llamada sabrá que el formulario se guardó y qué credencial creó. |

La página solo se abre para la cuenta de Heym que inició la solicitud, por lo que un enlace reenviado es inútil para cualquier otra persona. Un formulario permanece abierto durante 24 horas y puede rechazarlo desde la página. Una vez que lo guarde o lo rechace, el paso en la conversación de la pestaña Chat muestra el resultado.


### Credencial y modelo

`heym_chat` ejecuta el motor en su cuenta de Heym, por lo que necesita una credencial LLM propia:

| Campo | Comportamiento |
|-------|----------|
| **Credential** | Elija cualquier credencial de OpenAI, Google o Custom a la que tenga acceso. Se rellena previamente con la credencial preferida de [Settings](../reference/user-settings.md) cuando no ha elegido ninguna. |
| **Model** | Se carga desde la credencial seleccionada. Se rellena previamente con su modelo preferido cuando la credencial coincide. |

Si falta cualquiera de los dos, la herramienta sigue apareciendo en `tools/list`, pero cada llamada devuelve un error indicando que debe completar la configuración en esta pestaña.


Los nodos LLM y Agent de un workflow creado por `heym_chat` se ejecutan con esta credencial y modelo, incluida una credencial que alguien haya compartido con usted, de modo que las ejecuciones de prueba funcionan sin ningún paso de configuración adicional. Cuando `heym_chat` edita un workflow, los nodos LLM y Agent que ya disponen de una credencial la conservan junto con su modelo.
### Argumentos e historial

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `message` | Sí | La instrucción o pregunta, en lenguaje natural. |
| `conversation_id` | No | Un `conversation_id` de un resultado anterior de `heym_chat`, para continuar ese hilo. |
| `wait_for_credential_form` | No | Con `conversation_id`: esperar hasta que el usuario guarde o rechace el formulario de credencial abierto por el hilo y luego enviar `message`. |

Cada llamada se registra en el historial de su [pestaña Chat](./chat-tab.md) como una conversación normal, marcada con un icono de enchufe en la lista de conversaciones. Los mensajes, las tarjetas de herramientas y las pausas de aclaración se ven exactamente igual que una conversación iniciada por usted mismo, y puede abrir el hilo y seguir conversando en el navegador. Cada resultado devuelve su `conversation_id` para que el cliente MCP pueda continuar el mismo hilo en lugar de abrir uno nuevo en cada llamada.

Cuando el asistente necesita una aclaración, se detiene y lo indica; responda con las respuestas utilizando el mismo `conversation_id`.

### Habilitar A2A

Mientras el Agente Heym está activo, la tarjeta muestra la casilla **Habilitar A2A**. Márquela y otros agentes podrán enviar tareas al Agente Heym mediante el protocolo Agent2Agent (A2A 1.0). La tarjeta muestra la URL de la **Agent Card** y el **endpoint JSON-RPC**, cada uno con un botón de copia, y un `curl` para obtener la tarjeta. A2A utiliza la misma clave e inicio de sesión OAuth que MCP. Desactivar el agente desactiva también A2A. Consulte [A2A](../reference/a2a.md) para métodos, estados de tarea y un ejemplo.

### Progreso

Una llamada prolongada a `heym_chat` informa de la actividad del agente como progreso MCP (`notifications/progress`), con las mismas palabras que muestra la pestaña Chat, por ejemplo `Probando el workflow · intento 2/5`. Los clientes que reinician su tiempo de espera con cada notificación de progreso siguen esperando mientras el agente trabaja.

## Servidores MCP con nombre

Los servidores con nombre permiten segmentar los workflows en endpoints MCP aislados. Cada servidor dispone de su propia URL y API key, de modo que distintos clientes de IA, equipos o casos de uso pueden conectarse exactamente a los workflows que necesitan.

### Creación de un servidor con nombre

1. Introduzca un nombre en el campo de entrada situado en la parte inferior de la pestaña MCP (por ejemplo, **CRM Tools**)
2. Haga clic en **Create** — aparecerá de inmediato una nueva tarjeta de servidor
3. Haga clic en la tarjeta para expandirla

### Configuración por servidor

Cada tarjeta de servidor muestra:

| Configuración | Descripción |
|---------|-------------|
| **SSE Endpoint** | URL única: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Clave independiente, mostrada una sola vez al generarse o regenerarse. Cópiela de inmediato; se almacena con hash y no podrá revelarse posteriormente |
| **How to connect** | **Copy JSON** copia la configuración MCP lista para pegar; **Add to Cursor** la instala con un solo clic |
| **Heym Capabilities** | Active o desactive el Agente Heym (`heym_chat`) para este servidor y seleccione su credencial y modelo |
| **Habilitar A2A** | Interruptor A2A propio de este servidor, con su propia Agent Card en `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Habilitar A2A** | Interruptor A2A propio de este servidor, con su propia Agent Card en `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Active o desactive los workflows que este servidor expone |

### Asignación de workflows

La asignación de workflows es por servidor e independiente del toggle del servidor predeterminado. Un workflow puede habilitarse simultáneamente en el servidor predeterminado y en varios servidores con nombre, o en ninguno.

Al activar o desactivar un workflow, este se desplaza a la parte superior de la lista de asignados, de modo que la fila que se acaba de modificar permanece visible en lugar de desplazarse fuera de la vista.

### Autenticación

Los servidores con nombre admiten los mismos métodos de autenticación que el servidor predeterminado:

- **Cabecera X-MCP-Key** – Permite pasar la API key del servidor directamente (clientes de API, Cursor). Solo mediante cabecera: las claves no se aceptan como parámetro de consulta `?key=`, ya que las URL acaban en los logs de acceso, los logs de proxy y el historial del navegador.
- **Claude, ChatGPT y Gemini OAuth** – Añada la URL del servidor a los conectores o aplicaciones personalizadas del cliente; deje las credenciales en blanco y el cliente se registrará automáticamente mediante OAuth. El bearer token debe viajar en la cabecera `Authorization`, no como `?token=`.
- **Session token** – Emitido durante el handshake SSE; está acotado al servidor específico, de modo que los tokens de un servidor con nombre no pueden acceder a otro. Este parámetro `?session=` de corta duración no se ve afectado.

### Eliminación de un servidor con nombre

Haga clic en el icono **X** situado en la cabecera de la tarjeta del servidor. La eliminación suprime el servidor y todas sus asignaciones de workflows; los workflows en sí no se ven afectados.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Predeterminado | `{origin}/api/mcp/sse` |
| Con nombre | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambos endpoints admiten el transporte SSE (GET, MCP spec 2024-11-05) y el transporte Streamable HTTP (POST, MCP spec 2025-03-26). Claude, ChatGPT y Gemini utilizan OAuth 2.1 / PKCE para el inicio de sesión seguro en ambos.

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – MCP como primitiva de primer nivel en Heym
- [Agent Node](../nodes/agent-node.md) – Nodo de agente con soporte de herramientas MCP
- [Agent Architecture](../reference/agent-architecture.md) – Cliente MCP, despacho de herramientas, orquestador
- [Triggers](../reference/triggers.md) – MCP como punto de entrada de un workflow
- [Chat Tab](./chat-tab.md) – El motor detrás de la herramienta `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Crear y gestionar workflows
- [Node Types](../reference/node-types.md) – Descripción general de los nodos de IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del panel
# Pestaña MCP

La pestaña **MCP** configura la integración con el Model Context Protocol (MCP). MCP permite que los clientes de IA (Claude, Cursor y cualquier herramienta compatible con MCP) invoquen sus workflows de Heym como herramientas.

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

### Toggle MCP del workflow

Cada workflow puede exponerse como una herramienta MCP:

- **Enable** – Las herramientas del workflow quedan disponibles para todos los clientes conectados al servidor predeterminado
- **Disable** – El workflow no se expone

Las tarjetas de workflow muestran la descripción y una vista previa de los nombres de los campos de entrada, de modo que puede ver qué espera cada herramienta antes de habilitarla.

## Herramienta de chat de Heym

La sección **Heym Capabilities** convierte el motor de la pestaña Chat en una única herramienta MCP denominada `heym_chat`. Habilítela en el servidor predeterminado, en cualquier servidor con nombre, o en ambos — cada superficie mantiene su propio toggle y su propia selección de modelo.

Cuando está activada, `heym_chat` aparece en `tools/list` junto con sus herramientas de workflow. Un cliente MCP envía un único mensaje en lenguaje natural y el motor de Heym se encarga del resto, con las mismas capacidades que tiene la pestaña Chat:

- Crear, editar, inspeccionar y ejecutar workflows mediante el Workflow AI Builder
- Informar sobre analíticas, ejecuciones recientes y próximas programaciones cron
- Informar el historial de ejecución de un workflow: cuántas veces se ejecutó, recuentos por estado, cuándo se ejecutó y, a petición, las entradas, las salidas y los errores por nodo de una única ejecución
- Informar qué se está ejecutando en este momento: cuántas ejecuciones están activas, sus nombres de workflow, cuánto tiempo lleva ejecutándose cada una, el nodo en el que se encuentra actualmente y un enlace a la ejecución en vivo
- Listar tableros, crear tarjetas y leer el detalle de una tarjeta en la [pestaña Board](./board-tab.md)
- Listar sus tablas de datos con sus columnas, crear nuevas y conectarlas a los workflows que construye
- Leer equipos y variables globales, y buscar en la documentación
- Aprobar, editar o rechazar revisiones pendientes de human-in-the-loop

Las capacidades que se añadan a la pestaña Chat en el futuro estarán disponibles automáticamente a través de `heym_chat` — no hay ningún toggle por capacidad que mantener sincronizado.

Las credenciales permanecen en la interfaz: `heym_chat` nunca las lista, las elige ni las crea. Cuando construye o edita un workflow, los nodos nuevos que necesitan una credencial se dejan vacíos y la respuesta los nombra, para que pueda configurarlos en el editor.

Las tablas de datos son distintas. Una tabla no contiene secretos, por lo que `heym_chat` puede listar sus tablas, preguntar cuál debe usar un workflow y crear una nueva con sus columnas. Nunca lee ni escribe filas.

### Credencial y modelo

`heym_chat` ejecuta el motor en su cuenta de Heym, por lo que necesita una credencial LLM propia:

| Campo | Comportamiento |
|-------|----------|
| **Credential** | Elija cualquier credencial de OpenAI, Google o Custom a la que tenga acceso. Se rellena previamente con la credencial preferida de [Settings](../reference/user-settings.md) cuando no ha elegido ninguna. |
| **Model** | Se carga desde la credencial seleccionada. Se rellena previamente con su modelo preferido cuando la credencial coincide. |

Si falta cualquiera de los dos, la herramienta sigue apareciendo en `tools/list`, pero cada llamada devuelve un error indicando que debe completar la configuración en esta pestaña.

### Argumentos e historial

| Argumento | Obligatorio | Descripción |
|----------|----------|-------------|
| `message` | Sí | La instrucción o pregunta, en lenguaje natural. |
| `conversation_id` | No | Un `conversation_id` de un resultado anterior de `heym_chat`, para continuar ese hilo. |

Cada llamada se registra en el historial de su [pestaña Chat](./chat-tab.md) como una conversación normal, marcada con un icono de enchufe en la lista de conversaciones. Los mensajes, las tarjetas de herramientas y las pausas de aclaración se ven exactamente igual que una conversación iniciada por usted mismo, y puede abrir el hilo y seguir conversando en el navegador. Cada resultado devuelve su `conversation_id` para que el cliente MCP pueda continuar el mismo hilo en lugar de abrir uno nuevo en cada llamada.

Cuando el asistente necesita una aclaración, se detiene y lo indica; responda con las respuestas utilizando el mismo `conversation_id`.

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
| **Heym Capabilities** | Active o desactive la herramienta `heym_chat` para este servidor y seleccione su credencial y modelo |
| **Assigned Workflows** | Active o desactive los workflows que este servidor expone |

### Asignación de workflows

La asignación de workflows es por servidor e independiente del toggle del servidor predeterminado. Un workflow puede habilitarse simultáneamente en el servidor predeterminado y en varios servidores con nombre, o en ninguno.

Al activar o desactivar un workflow, este se desplaza a la parte superior de la lista de asignados, de modo que la fila que se acaba de modificar permanece visible en lugar de desplazarse fuera de la vista.

### Autenticación

Los servidores con nombre admiten los mismos métodos de autenticación que el servidor predeterminado:

- **Cabecera X-MCP-Key** – Permite pasar la API key del servidor directamente (clientes de API, Cursor). Solo mediante cabecera: las claves no se aceptan como parámetro de consulta `?key=`, ya que las URL acaban en los logs de acceso, los logs de proxy y el historial del navegador.
- **Claude OAuth** – Añada la URL del servidor a las integraciones de Claude; deje las credenciales en blanco y Claude se registrará automáticamente mediante OAuth. El bearer token debe viajar en la cabecera `Authorization`, no como `?token=`.
- **Session token** – Emitido durante el handshake SSE; está acotado al servidor específico, de modo que los tokens de un servidor con nombre no pueden acceder a otro. Este parámetro `?session=` de corta duración no se ve afectado.

### Eliminación de un servidor con nombre

Haga clic en el icono **X** situado en la cabecera de la tarjeta del servidor. La eliminación suprime el servidor y todas sus asignaciones de workflows; los workflows en sí no se ven afectados.

## SSE Endpoint

| Servidor | Endpoint |
|--------|----------|
| Predeterminado | `{origin}/api/mcp/sse` |
| Con nombre | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Ambos endpoints admiten el transporte SSE (GET, MCP spec 2024-11-05) y el transporte Streamable HTTP (POST, MCP spec 2025-03-26). Claude utiliza OAuth 2.1 / PKCE para el inicio de sesión seguro en ambos.

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – MCP como primitiva de primer nivel en Heym
- [Agent Node](../nodes/agent-node.md) – Nodo de agente con soporte de herramientas MCP
- [Agent Architecture](../reference/agent-architecture.md) – Cliente MCP, despacho de herramientas, orquestador
- [Triggers](../reference/triggers.md) – MCP como punto de entrada de un workflow
- [Chat Tab](./chat-tab.md) – El motor detrás de la herramienta `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Crear y gestionar workflows
- [Node Types](../reference/node-types.md) – Descripción general de los nodos de IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del panel

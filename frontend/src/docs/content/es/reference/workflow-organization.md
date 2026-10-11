# Organización de Workflows

Heym le permite organizar workflows en carpetas, crear subcarpetas y programar workflows para su eliminación. Consulte la [Pestaña Workflows](../tabs/workflows-tab.md) para obtener una visión general de la interfaz.

## Carpetas y subcarpetas

Las carpetas forman un árbol. Cada carpeta tiene:

- **Name** – Nombre para mostrar
- **Parent** – `parent_id` enlaza con otra carpeta; `null` significa raíz
- **Workflows** – Los workflows se pueden mover a carpetas mediante `folder_id`

### API

| Endpoint | Propósito |
|----------|---------|
| `GET /folders` | Solo carpetas raíz |
| `GET /folders/tree` | Árbol completo (hijos + workflows) |
| `GET /folders/{id}` | Carpeta individual con su contenido |
| `POST /folders` | Crear carpeta (`parent_id` opcional) |
| `PUT /folders/{id}` | Actualizar nombre o `parent_id` |
| `DELETE /folders/{id}` | Eliminar carpeta (en cascada) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Mover workflow a la carpeta |
| `DELETE /folders/workflows/{workflow_id}/folder` | Quitar workflow de la carpeta |
| `GET /folders/{id}/export` | Descargar carpeta + todas las subcarpetas como ZIP |

### Estructura de árbol

La respuesta del árbol incluye `children` y `workflows` por carpeta. Los workflows compartidos pueden aparecer en una carpeta mediante `WorkflowShare.folder_id`.

## Compartir workflows

Abra **Share** en el editor del workflow para invitar a usuarios por correo electrónico o compartir con un [equipo](./teams.md). Cada invitación y cada recurso compartido con un equipo conlleva un permiso:

| Permiso | Qué puede hacer el colaborador |
|------------|------------------------------|
| **Read** | Abrir el workflow, inspeccionarlo, ver el historial de ejecuciones y ejecutarlo. El editor se abre en modo de solo lectura: Save está deshabilitado y el canvas no se puede modificar. |
| **Write** | Todo lo que permite Read, además de editar el canvas, la configuración, el documento de análisis y la memoria del agente. |

El permiso se muestra junto a cada entrada en el diálogo Share y se puede cambiar en cualquier momento desde ese menú desplegable, sin necesidad de eliminar y volver a añadir el recurso compartido. Cuando un usuario accede a un workflow por varias vías (un recurso compartido directo y uno o varios equipos), prevalece el permiso **más alto**. Los recursos compartidos que existían antes de la introducción de los permisos son **Write**, y los clientes de API que omiten `permission` también obtienen **Write**.

Las acciones exclusivas del propietario nunca dependen del permiso: eliminar un workflow, revertir o limpiar versiones, borrar el historial, gestionar recursos compartidos y la [configuración exclusiva del propietario](#configuración-exclusiva-del-propietario) que se describe a continuación permanecen con el propietario incluso para colaboradores con **Write**. Un colaborador con **Read** que envíe una edición a través de la API (`PUT /api/workflows/{id}`, la nota de análisis, la memoria del agente, la limpieza de caché) o a través del AI Assistant recibirá `403` con `You have read-only access to this workflow`.

Compartir un workflow otorga acceso al canvas, al historial de ejecuciones y al documento de análisis. **No** comparte automáticamente:

- Las **Credenciales** referenciadas por los nodos del workflow
- Los **Sub-workflows** invocados por nodos [Execute](../nodes/execute-node.md) o agentes

Los destinatarios necesitan que esas credenciales y workflows secundarios se compartan con ellos por separado (mismos usuarios o equipos). Comparta credenciales desde la [Pestaña Credentials](../tabs/credentials-tab.md); consulte [Credentials Sharing](./credentials-sharing.md). Comparta cada sub-workflow desde el diálogo de compartir de su propio editor.

### Configuración exclusiva del propietario

Toda la configuración de **Run with cURL** permanece con el propietario tras compartir. Los colaboradores siguen abriendo el diálogo y copiando el comando generado, pero los controles son de solo lectura.

Cambiar cualquiera de estos elementos como no propietario se rechaza con `403`:

- **Authentication** (`auth_type`) y **Header Key** (`auth_header_key`)
- El modo de **Request Body** (`webhook_body_mode`) y **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) y **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) se comporta de forma diferente: se oculta por completo a los colaboradores, y la escritura de un colaborador se ignora en lugar de rechazarse. El editor muestra el campo enmascarado, por lo que un `403` en ese punto rompería un guardado ordinario en lugar de señalar un ataque.

La autenticación es la razón por la que el bloque es exclusivo del propietario: `Anonymous` permite que llamadores no autenticados ejecuten el workflow, y una ejecución sin un llamador con sesión iniciada resuelve las credenciales y las variables globales como el **propietario**, no como el llamador. El resto del bloque es el contrato de solicitud publicado y los controles de coste del propietario, por lo que se mueve junto con él.

**On error, run workflow** (`error_workflow_id`) en el panel **Properties** a nivel de workflow es exclusivo del propietario por la misma razón: el [error workflow](./features.md#error-workflow) se ejecuta con las credenciales y variables globales de la ejecución fallida, que son las del propietario para ejecuciones con trigger y anónimas. Los colaboradores ven la configuración en modo de solo lectura, y añadirla, reemplazarla o borrarla como no propietario se rechaza con `403`.

La edición del canvas, el nombre y la descripción no se ve afectada.
### Tokens de ejecución

Un colaborador puede acuñar un token de ejecución para un workflow compartido con él. La ejecución se atribuye a **quien acuñó el token**, por lo que utiliza las credenciales y variables globales de ese usuario, no las del propietario. Solo una llamada genuinamente anónima — `auth_type: anonymous` sin invocador — se ejecuta en el contexto del propietario.

## Programados para eliminación

Los workflows pueden programarse para eliminación en lugar de eliminarse de inmediato.

- **Campo**: `scheduled_for_deletion` (datetime anulable)
- **Comportamiento**: cuando se establece, el workflow pasa a `folder_id = null` y aparece en la sección "Programados para eliminación".

### API

| Endpoint | Propósito |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Establece `scheduled_for_deletion`, limpia `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Limpia `scheduled_for_deletion` (restaurar) |

### UI

- **Arrastrar a la papelera** – Suelte workflows en el área "Programados para eliminación" para programarlos
- **Restaurar** – Eliminar de la programación
- **Eliminar de inmediato** – Icono de papelera para eliminación permanente

### Lógica de limpieza

Un cron se ejecuta a diario a las **23:59** (zona horaria configurada). Un workflow solo se elimina cuando:

- **Todos los nodos de entrada** (nodos sin aristas entrantes, excluyendo sticky/errorHandler) tienen `active === false`

Si algún nodo de entrada sigue activo, el workflow permanece hasta la siguiente ejecución.

## UI del panel

- **Filas de carpetas** – Nueva carpeta, árbol de carpetas recursivo con expandir/contraer. Cada carpeta lleva una
  descripción opcional bajo su nombre y una insignia que cuenta los workflows que contiene, subcarpetas
  incluidas.
- **Acciones de carpeta** – Nueva subcarpeta, Renombrar, Cambiar icono, Descargar como ZIP y Eliminar se sitúan en línea
  en cada fila de carpeta; el menú contextual del clic derecho ofrece el mismo conjunto, y los teléfonos muestran un único
  botón de menú.
- **Área principal** – Workflows raíz (sin carpeta, no programados) y Programados para eliminación
- **Vista previa al soltar en carpeta** – Al arrastrar un workflow se resalta la carpeta o subcarpeta exacta y
  se muestra su ruta completa en una vista previa del tamaño de una tarjeta. Una carpeta contraída se expande tras un breve hover.
- **Retroalimentación de arrastre estable** – La tarjeta de origen utiliza un drag ghost, y el destino de soltado activo permanece
  seleccionado al desplazarse o cruzar controles dentro de la misma carpeta.
- **Comprobación de destino** – La carpeta actual se muestra como **Ya está en la carpeta** y no acepta
  un movimiento redundante.
- **Otras zonas de soltado** – Raíz y "Programados para eliminación" se resaltan cuando pueden aceptar el
  workflow arrastrado.
- **Soltar ZIP** – Suelte un archivo ZIP sobre el área de workflows para importar una estructura de carpetas en el nivel raíz

## Relacionado

- [Pestaña Workflows](../tabs/workflows-tab.md) – Crear y gestionar workflows
- [Compartir credenciales](./credentials-sharing.md) – Compartir credenciales con colaboradores de workflows
- [Equipos](./teams.md) – Compartir workflows y credenciales con equipos
- [Conceptos básicos](../getting-started/core-concepts.md) – Workflows, nodos y ejecución
- [Estructura del workflow](./workflow-structure.md) – Formato JSON para workflows
- [Triggers](./triggers.md) – Nodos de entrada y puntos de acceso

# Portal

El **Portal** expone los workflows de Heym como interfaces de chat públicas. Los usuarios finales pueden ejecutar workflows a través de una URL sin iniciar sesión en Heym.

## Qué hace

- **URL pública**: `/chat/{slug}` (ej.: `/chat/my-workflow`)
- **Interfaz de chat**: Los usuarios interactúan a través de una UI de chat (mensajes, entradas, respuestas)
- **Autenticación opcional**: Si se configuran usuarios del portal, se requiere inicio de sesión; de lo contrario, el portal es público
- **Streaming**: Progreso de nodos en tiempo real durante la ejecución (cuando está habilitado)
- **Detener ejecuciones en curso**: Los usuarios pueden detener una ejecución del portal en curso desde el pie del chat; la ejecución activa del workflow también se cancela en el servidor
- **Carga de archivos**: Cargas de archivos opcionales (texto, imágenes, etc.) por campo de entrada
- **Transferencia a revisión humana**: Las ejecuciones del portal pueden mostrar [enlaces de revisión HITL](./human-in-the-loop.md) cuando un agente se pausa para aprobación
- **Visualización de imágenes**: Las salidas del workflow que contienen imágenes (ej.: de generación de imágenes por LLM o capturas de Playwright) aparecen como miniaturas en el chat. Haga clic en cualquier imagen para abrir un visor a pantalla completa; pulse **Esc** o use el botón de retroceso del dispositivo para cerrar

## Configuración del workflow

| Ajuste | Descripción |
|---------|-------------|
| `portal_enabled` | Habilita el portal para este workflow |
| `portal_slug` | Slug de la URL (ej.: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Usa ejecución con streaming |
| `portal_file_upload_enabled` | Permite cargas de archivos |
| `portal_file_config` | Configuración de archivos por campo (tipos, límites) |

Configure en el editor: el botón **Portal** en el encabezado del workflow abre el diálogo de ajustes del portal.

## Flujo

1. **Info**: `GET /api/portal/{slug}/info` – Devuelve los metadatos del workflow y los campos de entrada (sin autenticación)
2. **Login** (si es necesario): `POST /api/portal/{slug}/login` – Devuelve el token de sesión
3. **Execute**: `POST /api/portal/{slug}/execute` – La UI de chat del portal llama a este endpoint (o a su variante de streaming internamente cuando está habilitado); los usuarios finales interactúan a través de la interfaz de chat, no llamando directamente a la API.
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Se solicita cuando el usuario pulsa **Stop** durante una ejecución activa del portal

## HITL en ejecuciones del portal

Si un workflow del portal alcanza un [Nodo Agent](../nodes/agent-node.md) con [Human-in-the-Loop](./human-in-the-loop.md) habilitado, la respuesta del portal muestra un enlace de revisión en lugar de aparecer vacía.

- El estado de la ejecución del workflow pasa a `pending`
- El chat del portal muestra la URL de revisión
- Cualquier nodo conectado al handle de salida `review` del agente puede notificar a Slack, correo electrónico u otros canales de inmediato
- Un revisor completa la decisión en `/review/{token}` sin iniciar sesión
- Tras la revisión, el workflow se reanuda desde la instantánea almacenada

Esto permite combinar flujos de chat públicos con pasos privados de aprobación humana.

## Campos de entrada

Los campos de entrada provienen de los nodos [Input](../nodes/input-node.md). La API extrae los nodos de inicio de tipo `textInput` y sus `inputFields`. La ejecución utiliza el mismo motor que las ejecuciones normales; las entradas se pasan como `body.inputs` y `conversation_history` para flujos de múltiples turnos.

## Autenticación y sesiones

- **WorkflowPortalUser**: Nombre de usuario/contraseña por workflow (cuando la autenticación está habilitada)
- **Eliminar el último usuario**: Con el portal habilitado, eliminar el último usuario del portal hace que el portal vuelva a ser público; el cuadro de diálogo de configuración solicita confirmación primero
- **PortalSession**: Tokens de sesión con TTL de 168 horas
- **Limitación de tasa**: 3 intentos de inicio de sesión fallidos → prohibición de 24 h por workflow+IP
- Las sesiones expiradas se limpian mediante un cron job

## UI de configuración

Pestañas de **WebPortalSettingsDialog**:

1. **General**: Habilitar el portal, establecer el slug, copiar la URL del portal
2. **Users**: Añadir/eliminar usuarios del portal (nombre de usuario/contraseña)
3. **Options**: Modo streaming, carga de archivos, ver campos de entrada

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – El Portal como superficie de chat para agentes en producción
- [Workflows Tab](../tabs/workflows-tab.md) – Crear workflows y habilitar el portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Páginas de revisión públicas para salidas de agentes pendientes
- [Triggers](./triggers.md) – El Portal como punto de entrada
- [Node Types](./node-types.md) – [Input](../nodes/input-node.md) para entradas del portal
- [Workflow Structure](./workflow-structure.md) – Nodos y aristas
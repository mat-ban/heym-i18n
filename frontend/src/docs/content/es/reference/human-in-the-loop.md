# Human-in-the-Loop

Human-in-the-loop (HITL) permite que un [Nodo de agente](../nodes/agent-node.md) solicite aprobación en momentos específicos, espere una decisión humana y luego continúe el workflow desde la misma instantánea de ejecución.

## Qué hace

- Añade puntos de control de aprobación explícitos a un agente sin necesidad de construir un workflow de aprobación independiente
- Crea una URL de revisión pública de un solo uso en `/review/{token}`
- Permite que un revisor `Accept`, `Edit & Continue` o `Refuse`
- Marca la ejecución como `pending` hasta que llegue una decisión
- Reanuda la ejecución pausada y permite que el agente continúe tras la aprobación
- Admite múltiples puntos de control HITL secuenciales en la misma ejecución del agente

## Configuración del agente

Habilite HITL en el panel de propiedades del agente.

| Ajuste | Descripción |
|---------|-------------|
| `hitlEnabled` | Activa la revisión humana para este agente |
| `hitlSummary` | Directrices de aprobación para indicar cuándo el agente debe solicitar revisión humana |

HITL añade una herramienta `request_human_review` al agente. Utilice el prompt del sistema y las directrices de `hitlSummary` para indicar al agente qué acciones requieren aprobación. Cuando el agente determina que un punto de control necesita revisión, envía un único texto de revisión en Markdown al humano. El resumen dirigido al revisor se genera a partir de la solicitud del agente en tiempo de ejecución; si el agente lo omite, Heym deriva uno a partir del cuerpo en Markdown. En la v1, HITL solo admite salidas de agente en modo texto, por lo que no puede combinarse con `jsonOutputEnabled`.

Para las herramientas MCP, Heym solicita al modelo que interprete las instrucciones HITL escritas en uno de tres ámbitos de aprobación:

- `always` para frases como "always", "on each" o "for each"
- `once` para frases como "once" o "only one time"
- `never` para frases como "never", "do not ask" o "already approved"

Esa interpretación controla si las llamadas MCP repetidas se pausan de nuevo, permanecen aprobadas una vez o se saltan por completo la revisión humana.

Cuando HITL está habilitado, el agente también expone un segundo conector de salida en el canvas etiquetado como `review`. Utilice esa rama para enviar la URL de revisión pendiente y el resumen a Slack, correo electrónico, registro u otro flujo de notificación mientras la ejecución principal espera a una persona.

## Flujo de revisión

1. El agente alcanza un paso que requiere aprobación y llama a `request_human_review`
2. Heym crea una solicitud de revisión pública y devuelve una URL de revisión
3. Cualquier nodo conectado al conector `review` del agente se ejecuta de inmediato con el payload HITL pendiente
4. La ejecución del workflow pasa a `pending`
5. Un revisor abre `/review/{token}` sin iniciar sesión
6. El revisor elige una acción:
   - `Accept` continúa con el Markdown original
   - `Edit & Continue` continúa con el Markdown editado
   - `Refuse` continúa con `decision: "refused"` y omite cualquier acción posterior del agente
7. Heym reanuda el workflow desde la instantánea almacenada y permite que el agente continúe con el contexto del Markdown aprobado
8. Si un paso posterior también requiere aprobación, el agente puede volver a llamar a HITL y crear otro punto de control pendiente

Los enlaces de revisión caducan tras 168 horas si nadie responde.

## Página de revisión pública

La página de revisión pública muestra:

- El nombre del workflow y la etiqueta del agente
- Un resumen del revisor generado automáticamente a partir de la solicitud de revisión del agente
- El texto de revisión en Markdown en primer lugar, como contenido principal
- Un cuadro de edición que se abre solo después de que el revisor haga clic en `Edit`
- Una vista previa en vivo del Markdown mientras se edita
- Botones de acción para `Accept`, `Edit & Continue` y `Refuse`

Una vez enviada una decisión, el token queda bloqueado y no puede reutilizarse.

## Salidas y estado de ejecución

Mientras espera la revisión, la salida del agente contiene un payload pendiente:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Después de que el revisor responda y el workflow se reanude, la salida final del agente incluye los metadatos de la decisión:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilice `$agentLabel.decision` en los nodos posteriores para ramificar según los resultados accepted, edited o refused.

## Rama de revisión en el canvas

El conector de salida `review` solo está disponible cuando `hitlEnabled` está activado para un agente.

- Se ejecuta antes de que llegue la decisión humana
- Recibe el payload HITL pendiente, incluidos `summary`, `draftText`, `reviewUrl`, `shareText` y `shareMarkdown`
- Está pensado para pasos de notificación o transferencia, como Slack, correo electrónico o registro de auditoría
- Se ejecuta una vez por cada punto de control HITL
- No se ejecuta de nuevo después de que el revisor responda; solo la ruta de salida normal del agente continúa al reanudarse

## Dónde aparece

- [Historial de ejecuciones](./execution-history.md) muestra las ejecuciones `pending` de inmediato y almacena la URL de revisión en los resultados del nodo
- Las respuestas del chat del [Portal](./portal.md) muestran el enlace de revisión humana en lugar de una respuesta vacía
- El panel de depuración y los diálogos del historial muestran la decisión final de HITL y el texto revisado
- El handle de salida de revisión puede notificar a canales externos incluso cuando el workflow se activó por cron, curl o tráfico del portal
- Varios puntos de control HITL reutilizan la misma entrada del historial de ejecuciones mientras crean un nuevo enlace de revisión de un solo uso para cada pausa

## Límites actuales

- HITL solo está disponible en los Nodos de agente
- HITL utiliza la salida de texto del agente y no admite salida JSON en la v1
- Una ejecución pausada se reanuda desde la instantánea almacenada del workflow, no desde la última versión editada del workflow
- Los sub-workflows anidados no pueden entrar en un estado HITL pendiente en la v1; solicite la revisión desde el agente principal antes de invocarlos

## Relacionado

- [Nodo de agente](../nodes/agent-node.md) - Configure HITL en un agente
- [Arquitectura de agentes](./agent-architecture.md) - Cómo encajan los agentes, las herramientas, los sub-agentes y HITL
- [Historial de ejecuciones](./execution-history.md) - Inspeccione las ejecuciones pendientes y reanudadas
- [Board](../tabs/board-tab.md) - Las ejecuciones de la cadena del Board pausan la tarjeta en un estado pendiente (ámbar) en HITL
- [Portal](./portal.md) - Flujos de chat públicos y enlaces de revisión HITL

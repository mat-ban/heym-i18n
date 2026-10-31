# A2A

Heym proporciona el **Heym Agent** a través del protocolo Agent2Agent (A2A 1.0, enlace JSON-RPC). El Heym Agent es el motor tras la [Pestaña Chat](../tabs/chat-tab.md); los clientes MCP acceden al mismo agent como la herramienta `heym_chat` (consulte la [Pestaña MCP / A2A](../tabs/mcp-tab.md)). Con A2A habilitado, otro agent puede enviarle una Task en lenguaje natural y obtener la respuesta, con las mismas capacidades de Chat.

## Activación

1. Abra la pestaña **MCP / A2A**.
2. Active el **Heym Agent** en el servidor predeterminado o en un servidor con nombre, y seleccione sus credenciales y modelo.
3. Marque **Habilitar A2A**. La tarjeta muestra la URL de la **Agent Card** y el **Endpoint JSON-RPC**.

A2A opera sobre el Heym Agent: al desactivar el agent, también se desactiva A2A.

## Endpoints

| | Servidor predeterminado | Servidor con nombre |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

La Agent Card no requiere credenciales y no nombra a ningún usuario, servidor o Workflow. Existe únicamente mientras A2A esté activado: la tarjeta del dominio mientras al menos un usuario tenga A2A activado en el servidor predeterminado, y la tarjeta de un servidor con nombre mientras dicho servidor tenga A2A activo. En caso contrario, la dirección devuelve 404.

## Autenticación

Envíe las mismas credenciales que para MCP, únicamente en encabezados:

- `X-MCP-Key: <key>`: la clave del servidor predeterminado o la del servidor con nombre
- `Authorization: Bearer <token>`: un Token OAuth del servidor OAuth de Heym

Las credenciales incluidas en la URL serán rechazadas. La Agent Card declara ambos esquemas, permitiendo que un cliente A2A las consulte directamente desde la tarjeta.

## Métodos

| Método | Descripción |
|---|---|
| `SendMessage` | Inicia una Task o continúa una en espera de entrada. Espera la respuesta a menos que `configuration.returnImmediately` sea `true`. |
| `SendStreamingMessage` | Lo mismo, como un flujo Server-Sent Events del progreso de la Task y su resultado. |
| `GetTask` | Estado, respuesta e historial de una Task (`historyLength` limita el historial). |
| `ListTasks` | Sus Tasks en este servidor, las más recientes primero, filtradas por `contextId` o `status`, con `pageSize` y `pageToken`. |
| `CancelTask` | Detiene una Task que aún se está ejecutando o está en espera. |
| `SubscribeToTask` | Hace seguimiento de una Task en curso. |
| `GetExtendedAgentCard` | La tarjeta con el nombre del servidor y sus Workflows asignados como habilidades. |

No se ofrecen notificaciones push: la tarjeta indica `pushNotifications: false`, y los métodos push responden con `PushNotificationNotSupportedError`. Las solicitudes utilizan A2A 1.0; envíe `A2A-Version: 1.0`. Los nombres de métodos de A2A 0.3 como `message/send` responden con `VersionNotSupportedError`.

## Tasks y conversaciones

Cada Task representa una conversación en la pestaña Chat, identificada con un icono de red. El `contextId` de la Task corresponde a dicha conversación: envíe un nuevo mensaje con el mismo `contextId` y sin `taskId` para continuarla.

| Acción del agent | Estado de la Task |
|---|---|
| Respondió | `TASK_STATE_COMPLETED`, con la respuesta como texto y, cuando guardó alguno, los enlaces a Workflows y suites de evaluación como datos |
| Realizó una pregunta aclaratoria | `TASK_STATE_INPUT_REQUIRED`: responda con el mismo `taskId` |
| Requiere credenciales | `TASK_STATE_AUTH_REQUIRED`: el mensaje de estado contiene un enlace a la página de credenciales de Heym. El usuario lo abre en un navegador con sesión iniciada en Heym; el valor nunca pasa por el otro agent. Luego envíe un mensaje en la misma Task para continuar. |
| Falló | `TASK_STATE_FAILED`, con el motivo |
| Fue cancelada | `TASK_STATE_CANCELED` |

Un mensaje enviado a una Task finalizada o en ejecución se rechaza con `UnsupportedOperationError`. Los mensajes admiten partes `text` y `data`, hasta un total de 20 000 caracteres juntos; las partes de archivo se rechazan, por lo que debe enviar archivos como enlaces.

## Progreso

Mientras una Task se ejecuta, el flujo envía una actualización de estado para cada paso, con las mismas frases mostradas en la pestaña Chat, por ejemplo `Running workflow "Invoice Parser"` o `Testing the workflow · attempt 2/5`. Los clientes MCP reciben estos mismos pasos como `notifications/progress` desde `heym_chat`.

## Ejemplo

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Límites

- `CancelTask` detiene un turno en ejecución inmediatamente en la instancia de Heym que lo procesa, del mismo modo que el botón Stop de la pestaña Chat. En otros lugares la Task se marca como cancelada y no se registra el resultado tardío.
- Sin notificaciones push, sin enlace REST ni gRPC, sin Agent Cards firmadas.

## Relacionado

- [Pestaña MCP / A2A](../tabs/mcp-tab.md): activar el Heym Agent y A2A
- [Pestaña Chat](../tabs/chat-tab.md): el motor tras el agent
- [Seguridad](./security.md): almacenamiento seguro de claves

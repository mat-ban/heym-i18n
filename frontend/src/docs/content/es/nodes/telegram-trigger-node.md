# Telegram Trigger

El nodo **Telegram Trigger** es un punto de entrada sin entradas que inicia un workflow cuando su bot de Telegram recibe una actualización por webhook. Utilícelo para chatbots, triaje de soporte, comandos tipo slash o callbacks de botones inline que deban distribuirse hacia nodos de IA e integración posteriores.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` que contiene el token del bot y, opcionalmente, el token secreto del webhook |

## Guía de configuración

### 1. Cree una credencial `telegram`

1. Vaya a **Settings → Credentials → New Credential**
2. Seleccione el tipo **Telegram Bot**
3. Pegue el **Bot Token** proporcionado por BotFather
4. Opcionalmente, defina un **Webhook Secret Token** si desea que Telegram envíe una cabecera de verificación coincidente
5. Guarde la credencial

### 2. Añada el nodo a su workflow

1. Arrastre **Telegram Trigger** al canvas
2. Seleccione el nodo para abrir el panel de Propiedades
3. Elija su credencial `telegram`
4. Copie la **Webhook URL** que se muestra en el panel del nodo

### 3. Registre el webhook en Telegram

Utilice el método `setWebhook` de la Bot API con la URL del nodo:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Si configuró un token secreto en Heym, envíe el mismo valor al establecer el webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Campos de salida

Una vez que el nodo se activa, los nodos posteriores pueden acceder a:

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.update` | Payload completo de la actualización de Telegram |
| `$nodeLabel.message` | Objeto principal similar a un mensaje extraído de la actualización |
| `$nodeLabel.message.text` | Texto del mensaje entrante |
| `$nodeLabel.message.chat.id` | ID del chat para responder desde nodos posteriores |
| `$nodeLabel.message.from.id` | ID de usuario de Telegram |
| `$nodeLabel.callback_query` | Payload del callback cuando la actualización proviene de un teclado inline |
| `$nodeLabel.headers` | Cabeceras del webhook saneadas |
| `$nodeLabel.triggered_by` | Etiqueta del origen del Trigger (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo del canvas que recibió la actualización de Telegram |
| `$nodeLabel.triggered_at` | Marca de tiempo ISO de esta ejecución del workflow |

## Workflow de ejemplo

**Mensaje de Telegram → LLM → respuesta de Telegram**

```
telegramTrigger → llm → telegram
```

- Etiqueta del **Telegram Trigger**: `telegramEvent`
- Mensaje de usuario del **LLM**: `"Reply briefly to this user message: $telegramEvent.message.text"`
- chatId del nodo **Telegram**: `$telegramEvent.message.chat.id`

## Seguridad

- Si su credencial tiene un `secret_token`, Heym verifica `x-telegram-bot-api-secret-token` antes de ejecutar el workflow.
- Las cabeceras sensibles de la solicitud se eliminan antes de que el payload llegue a los nodos posteriores.
- La URL del webhook es estática para el ID del nodo, por lo que solo necesita volver a registrarla cuando el propio nodo cambie.

## Relacionado

- [Telegram Node](./telegram-node.md) – Enviar una respuesta o notificación saliente
- [Triggers](../reference/triggers.md) – Descripción general de todos los puntos de entrada del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configuración de la credencial de Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Añadir y gestionar credenciales `telegram`
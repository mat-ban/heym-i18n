# Telegram

El nodo **Telegram** envía un mensaje a través de la API de Telegram Bot. Utilícelo para respuestas de chat, alertas operativas, actualizaciones del estado del workflow o cualquier paso posterior que deba enviar un mensaje a un usuario, grupo o canal de Telegram.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.ok`, `$nodeLabel.result` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `telegram` que contiene el token del bot |
| `chatId` | expression | ID del chat, grupo o canal de destino |
| `message` | expression | Texto del mensaje saliente. Admite [expresiones](../reference/expression-dsl.md). |

## Configuración

1. Cree una [credencial de Telegram Bot](../reference/integrations.md#telegram)
2. Añada el nodo **Telegram** a su workflow
3. Seleccione la credencial
4. Establezca `chatId` en un ID de chat estático o en una expresión como `$telegramEvent.message.chat.id`
5. Establezca `message` en el texto saliente o en una plantilla construida a partir de datos de pasos anteriores

## Ejemplo

```json
{
  "type": "telegram",
  "data": {
    "label": "telegramReply",
    "credentialId": "telegram-credential-uuid",
    "chatId": "$telegramEvent.message.chat.id",
    "message": "Received: $telegramEvent.message.text"
  }
}
```

## Campos de salida

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` en caso de éxito |
| `$nodeLabel.ok` | Indicador de éxito de la API de Telegram |
| `$nodeLabel.result` | Objeto de resultado sin procesar de `sendMessage` devuelto por Telegram |
| `$nodeLabel.result.message_id` | ID del mensaje de Telegram |
| `$nodeLabel.result.chat.id` | ID del chat de destino devuelto por Telegram |

## Patrones comunes

- Combínelo con [Telegram Trigger](./telegram-trigger-node.md) para bots conversacionales
- Envíe avisos de error desde [Error Handler](./error-handler-node.md)
- Publique resúmenes generados por [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Relacionado

- [Telegram Trigger](./telegram-trigger-node.md) – Inicie un workflow a partir de mensajes entrantes del bot
- [Third-Party Integrations](../reference/integrations.md) – Configuración de la credencial de Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Añada y gestione credenciales `telegram`
- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
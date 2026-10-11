# Discord

El nodo **Discord** envía un mensaje a un canal de Discord mediante un Webhook entrante. Utilícelo para alertas, notificaciones de workflow, respuestas tipo bot y notificación de errores.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial `discord` que contiene la URL del webhook entrante |
| `message` | expression | Texto del mensaje saliente. Admite [expresiones](../reference/expression-dsl.md). |
| `username` | expression | Nombre para mostrar opcional que reemplaza el valor predeterminado para este mensaje |
| `avatarUrl` | expression | URL de avatar opcional que reemplaza el valor predeterminado para este mensaje |

## Configuración

1. Cree una [credencial de Webhook de Discord](../reference/integrations.md#discord)
2. Añada el nodo **Discord** a su workflow
3. Seleccione la credencial
4. Establezca `message` con el texto saliente o una plantilla construida a partir de datos de nodos anteriores
5. De forma opcional, reemplace el `username` y la `avatarUrl` mostrados

## Ejemplo

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Campos de salida

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.status` | Código de estado HTTP devuelto por Discord, normalmente `204` en caso de éxito |
| `$nodeLabel.response` | Cuerpo de la respuesta sin procesar devuelto por el webhook de Discord |
| `$nodeLabel.message` | Texto del mensaje que Heym envió |
| `$nodeLabel.username` | Nombre de usuario enviado con el webhook, si se proporcionó |
| `$nodeLabel.avatar_url` | URL del avatar enviada con el webhook, si se proporcionó |

## Patrones comunes

- Utilícelo junto con [Discord Trigger](./discord-trigger-node.md) cuando desee una publicación adicional en el canal más allá de la respuesta a la interacción
- Envíe avisos de fallo desde [Error Handler](./error-handler-node.md)
- Publique resúmenes generados por [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Seguridad de salida

- La URL del webhook almacenada en la credencial debe usar `http://` o `https://` y resolverse únicamente a direcciones públicas. Los destinos de loopback, privados, link-local, multicast y de metadatos en la nube están bloqueados.
- Heym valida las direcciones resueltas y fija el destino de la conexión antes de enviar, de modo que una respuesta DNS no pueda redirigir la solicitud hacia una dirección interna después de la comprobación. Los proxies del entorno se desactivan mientras la protección está activa y no se siguen las redirecciones.
- Las implementaciones que publican en un receptor de webhook interno pueden establecer `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` en una instancia autoalojada de confianza. Mantenga el valor predeterminado en implementaciones alojadas o multiinquilino.

**Nota de actualización para v0.0.109:** esta comprobación es nueva para Discord. Una credencial cuya URL de webhook apunte a loopback o a una dirección privada se rechaza a menos que la configuración anterior esté habilitada.

## Relacionado

- [Discord Trigger](./discord-trigger-node.md) – Inicie un workflow a partir de interacciones entrantes de Discord
- [Integraciones de terceros](../reference/integrations.md) – Configuración de la credencial de Discord
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añada y gestione credenciales `discord`
- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
# Slack

El nodo **Slack** envía un mensaje a un canal de Slack mediante un Incoming Webhook. Utilícelo para notificaciones, alertas y reporte de errores.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | Pasa a través de la entrada |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de Slack (URL del webhook) desde [Credenciales](../tabs/credentials-tab.md) |
| `message` | expression | Texto del mensaje. Admite [expresiones](../reference/expression-dsl.md). |

## Configuración

1. Cree un Incoming Webhook en su espacio de trabajo de Slack
2. Añada una credencial de Slack en la pestaña Credenciales con la URL del webhook
3. Referencie la credencial en el nodo

## Ejemplo

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Utilícelo con [Error Handler](./error-handler-node.md) para notificaciones de fallos:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Seguridad de egreso

- La URL del webhook almacenada en la credencial debe usar `http://` o `https://` y resolverse únicamente a direcciones públicas. Los destinos de loopback, privados, link-local, multicast y de metadatos en la nube están bloqueados.
- Heym valida las direcciones resueltas y fija el destino de la conexión antes de enviar, de modo que una respuesta DNS no pueda redirigir la solicitud hacia una dirección interna después de la comprobación. Los proxies del entorno se desactivan mientras el guard está activo y no se siguen las redirecciones.
- Las implementaciones que publican en un receptor de webhook interno pueden establecer `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` en una instancia autoalojada de confianza. Mantenga el valor predeterminado en implementaciones alojadas o multiinquilino.

**Nota de actualización para v0.0.109:** esta comprobación es nueva para Slack. Una credencial cuya URL de webhook apunte a loopback o a una dirección privada se rechaza a menos que la configuración anterior esté habilitada.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Error Handler](./error-handler-node.md) – Enviar Slack ante un fallo del workflow
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir un webhook de Slack
# Manejador de Errores

El nodo **Error Handler** captura errores de cualquier nodo del workflow. Cuando está presente, se ejecuta automáticamente cuando falla cualquier nodo. No se necesitan conexiones entrantes: es activado por el motor del workflow.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 (se activa al producirse un error) |
| Salidas | 1 |
| Salida | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `message` | expression | Opcional. Predeterminado: `$error.message` |

## Contexto de error

Cuando se ejecuta el manejador de errores, estos campos están disponibles:

| Campo | Descripción |
|-------|-------------|
| `$errorHandler.error` | Cadena con el mensaje de error |
| `$errorHandler.errorNode` | Etiqueta del nodo que falló |
| `$errorHandler.errorNodeType` | Tipo del nodo que falló |
| `$errorHandler.timestamp` | Momento en que ocurrió el error |

## Casos de uso

- Enviar notificaciones por [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [Send Email](./send-email-node.md) ante un fallo
- Registrar errores en sistemas externos
- Devolver una respuesta de error personalizada mediante [Output](./output-node.md)

Solo se permite un Error Handler por workflow.

## Ejemplo

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Conecte a Output para una respuesta de error personalizada:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

O conecte a Slack para notificaciones:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Relacionado

- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Telegram Node](./telegram-node.md) – Notificar ante errores
- [Slack Node](./slack-node.md) – Notificar ante errores
- [Send Email Node](./send-email-node.md) – Alertas por correo electrónico
- [Throw Error Node](./throw-error-node.md) – Errores intencionales
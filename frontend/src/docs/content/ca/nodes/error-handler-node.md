# Gestor d'Errors

El node **Gestor d'Errors** captura errors de qualsevol node del workflow. Quan és present, s'executa automàticament quan falla qualsevol node. No calen connexions entrants—és activat pel motor del workflow.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 (s'activa en cas d'error) |
| Sortides | 1 |
| Sortida | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `message` | expression | Opcional. Per defecte: `$error.message` |

## Context d'error

Quan s'executa el gestor d'errors, aquests camps estan disponibles:

| Camp | Descripció |
|-------|-------------|
| `$errorHandler.error` | Cadena del missatge d'error |
| `$errorHandler.errorNode` | Etiqueta del node que ha fallat |
| `$errorHandler.errorNodeType` | Tipus del node que ha fallat |
| `$errorHandler.timestamp` | Moment en què s'ha produït l'error |

## Casos d'ús

- Enviar notificacions per [Telegram](./telegram-node.md), [Slack](./slack-node.md) o [Send Email](./send-email-node.md) en cas de fallada
- Registrar errors en sistemes externs
- Retornar una resposta d'error personalitzada mitjançant [Output](./output-node.md)

Només un Gestor d'Errors per workflow.

## Exemple

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Connecteu a Output per a una resposta d'error personalitzada:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

O connecteu a Slack per a notificacions:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Telegram Node](./telegram-node.md) – Notificar en cas d'error
- [Slack Node](./slack-node.md) – Notificar en cas d'error
- [Send Email Node](./send-email-node.md) – Alertes per correu electrònic
- [Throw Error Node](./throw-error-node.md) – Errors intencionats
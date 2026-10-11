# RabbitMQ

El nodo **RabbitMQ** envía o recibe mensajes desde colas e intercambios de RabbitMQ. Utilícelo para Workflows basados en mensajes y procesamiento de eventos.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial de RabbitMQ desde [Credenciales](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tipo de operación |
| `rabbitmqExchange` | string | Nombre del exchange (opcional para send) |
| `rabbitmqRoutingKey` | string | Routing key (para send) |
| `rabbitmqQueueName` | string | Nombre de la cola (obligatorio para receive, opcional para send) |
| `rabbitmqMessageBody` | expression | Cuerpo del mensaje para send (admite expresiones) |
| `rabbitmqDelayMs` | number | Cabecera x-delay en ms (plugin de mensajes retardados) |

## Operaciones

### Send

Publica un mensaje en una cola o exchange.

| Campo | Obligatorio | Descripción |
|-------|----------|-------------|
| `rabbitmqMessageBody` | sí | Cuerpo en JSON o string |
| `rabbitmqQueueName` | opcional | Destino directo de la cola |
| `rabbitmqExchange` | opcional | Nombre del exchange |
| `rabbitmqRoutingKey` | opcional | Routing key |
| `rabbitmqDelayMs` | opcional | Retardo en milisegundos |

**Salida:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Modo Trigger: el Workflow se inicia cuando llega un mensaje. No se necesita una arista entrante cuando se utiliza como Trigger.

**Salida:** `$nodeLabel.body` (payload del mensaje), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Ejemplo – Send

```json
{
  "type": "rabbitmq",
  "data": {
    "label": "publishMessage",
    "credentialId": "rabbitmq-credential-uuid",
    "rabbitmqOperation": "send",
    "rabbitmqQueueName": "tasks",
    "rabbitmqMessageBody": "$userInput.body"
  }
}
```

## Relacionado

- [Tipos de nodo](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Triggers](../reference/triggers.md) – RabbitMQ como Trigger de Workflow
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Añadir Credenciales de RabbitMQ
- [Integraciones de terceros](../reference/integrations.md#rabbitmq) – Configuración de Credenciales de RabbitMQ y detalles del plugin de retardo
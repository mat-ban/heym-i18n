# RabbitMQ

O nó **RabbitMQ** envia ou recebe mensagens de filas e exchanges do RabbitMQ. Utilize-o para workflows orientados a mensagens e processamento de eventos.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.status`, `$nodeLabel.message_id`, `$nodeLabel.body` (receive) |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial do RabbitMQ em [Credentials](../tabs/credentials-tab.md) |
| `rabbitmqOperation` | `"send"` \| `"receive"` | Tipo de operação |
| `rabbitmqExchange` | string | Nome do exchange (opcional para send) |
| `rabbitmqRoutingKey` | string | Routing key (para send) |
| `rabbitmqQueueName` | string | Nome da fila (obrigatório para receive, opcional para send) |
| `rabbitmqMessageBody` | expression | Corpo da mensagem para send (suporta expressões) |
| `rabbitmqDelayMs` | number | Cabeçalho x-delay em ms (plugin de mensagem atrasada) |

## Operações

### Send

Publica uma mensagem em uma fila ou exchange.

| Campo | Obrigatório | Descrição |
|-------|----------|-------------|
| `rabbitmqMessageBody` | sim | Corpo em JSON ou string |
| `rabbitmqQueueName` | opcional | Destino direto da fila |
| `rabbitmqExchange` | opcional | Nome do exchange |
| `rabbitmqRoutingKey` | opcional | Routing key |
| `rabbitmqDelayMs` | opcional | Atraso em milissegundos |

**Saída:** `$nodeLabel.status` ("published"), `$nodeLabel.message_id`, `$nodeLabel.exchange`, `$nodeLabel.routing_key`

### Receive

Modo Trigger: o workflow é iniciado quando uma mensagem chega. Nenhuma aresta de entrada é necessária quando usado como Trigger.

**Saída:** `$nodeLabel.body` (payload da mensagem), `$nodeLabel.message_id`, `$nodeLabel.queue`

## Exemplo – Send

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

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Triggers](../reference/triggers.md) – RabbitMQ como Trigger de workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar credenciais do RabbitMQ
- [Third-Party Integrations](../reference/integrations.md#rabbitmq) – Configuração de credenciais do RabbitMQ e detalhes do plugin de atraso

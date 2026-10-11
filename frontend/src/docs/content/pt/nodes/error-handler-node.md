# Error Handler

O nó **Error Handler** captura erros de qualquer nó do workflow. Quando presente, é executado automaticamente quando qualquer nó falha. Não são necessárias conexões de entrada — é acionado pelo motor do workflow.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 (acionado em caso de erro) |
| Saídas | 1 |
| Saída | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `message` | expression | Opcional. Padrão: `$error.message` |

## Contexto de erro

Quando o error handler é executado, estes campos estão disponíveis:

| Campo | Descrição |
|-------|-------------|
| `$errorHandler.error` | String da mensagem de erro |
| `$errorHandler.errorNode` | Label do nó que falhou |
| `$errorHandler.errorNodeType` | Tipo do nó que falhou |
| `$errorHandler.timestamp` | Momento em que o erro ocorreu |

## Casos de uso

- Enviar notificações via [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou [Send Email](./send-email-node.md) em caso de falha
- Registar erros em sistemas externos
- Retornar uma resposta de erro personalizada através do [Output](./output-node.md)

Apenas um Error Handler por workflow.

## Exemplo

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Ligue ao Output para uma resposta de erro personalizada:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Ou ligue ao Slack para notificações:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Relacionado

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Telegram Node](./telegram-node.md) – Notificar em caso de erro
- [Slack Node](./slack-node.md) – Notificar em caso de erro
- [Send Email Node](./send-email-node.md) – Alertas por email
- [Throw Error Node](./throw-error-node.md) – Erros intencionais
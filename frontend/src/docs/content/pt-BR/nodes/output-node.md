# Saída

O nó **Output** é o endpoint do workflow que retorna a resposta ao chamador. Sempre referencie o nó anterior por meio do label — nunca utilize `$input`.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 (opcional, para pós-processamento assíncrono) |
| Saída | Retorna `message` ao chamador |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `message` | expression | Valor de saída. **Deve** referenciar o nó anterior: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Se verdadeiro, os nós após o output são executados de forma assíncrona após o envio da resposta |

## Uso como ferramenta de agente

Quando um nó Output é conectado a um [Agent Node](./agent-node.md) como ferramenta de nó no canvas, o campo `message` pode ser marcado como **fornecido pelo agente** com o ícone do bot. O agente então fornece a mensagem quando chama a ferramenta. Se o nó Output não estiver conectado como ferramenta de agente, o ícone do bot fica oculto.

## Regra crítica

**Nunca utilize `$input` no nó de output.** Sempre utilize o label do nó anterior:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (onde `processData` é o label do nó anterior)

## Pós-processamento assíncrono

Quando `allowDownstream: true`, a resposta é retornada imediatamente. Os nós conectados após o output são executados em segundo plano (por exemplo, notificações no Slack, logging). Como a cauda downstream pode finalizar mais tarde, uma falha downstream pode alterar o status da execução registrada para `error` após a resposta antecipada já ter sido retornada; o histórico final e as análises refletem esse resultado posterior.

## Exemplo

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Exemplo – Com assíncrono

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Em seguida, conecte um nó [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou outro nó após o output para notificações do tipo fire-and-forget.

## Relacionados

- [Mapeador de saída JSON](./json-output-mapper-node.md) – Corpo JSON raiz sem encapsulamento `result` quando for o único terminal
- [Tipos de nós](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [DSL de expressões](../reference/expression-dsl.md) – Referência à saída de nós
- [Diálogo de avaliação de expressões](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend para message
- [Estrutura do workflow](../reference/workflow-structure.md) – Formato JSON

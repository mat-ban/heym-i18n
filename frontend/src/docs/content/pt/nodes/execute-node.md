# Execute

O nó **Execute** chama outro workflow (sub-workflow) e transmite a entrada para ele. Utilize-o para lógica reutilizável, não para transformação de dados — para isso, utilize [Set](./set-node.md).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `executeWorkflowId` | UUID | ID do workflow a executar |
| `executeInput` | expression | Entrada única (para workflows com um único campo de entrada) |
| `executeInputMappings` | array | `{ key, value }` para múltiplas entradas. `key` = nome do campo de entrada do workflow de destino. |
| `executeDoNotWait` | boolean | Quando `true`, despacha o sub-workflow em segundo plano sem aguardar. Saída: `{ "status": "dispatched", "workflow_id": "..." }`. Padrão: `false`. |

## Formato da resposta

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Não aguardar

Quando `executeDoNotWait: true`, o nó despacha o sub-workflow para uma thread em segundo plano e retorna imediatamente:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

O workflow pai prossegue para o próximo nó sem aguardar. O registro de execução do sub-workflow é gravado na execução de forma assíncrona quando ele é concluído. Utilize esta opção quando o resultado do sub-workflow não for necessário nas etapas seguintes.

## Entrada única

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Múltiplas entradas

Quando o workflow de destino possui múltiplos campos de entrada, utilize `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

O `key` deve corresponder às chaves `inputFields` do nó [Input](./input-node.md) do workflow de destino.

## Relacionados

- [Recursos do Canvas](../reference/canvas-features.md) – Extrair para Sub-Workflow para criar nós Execute a partir dos nós selecionados
- [Tipos de nós](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [Nó Input](./input-node.md) – Campos de entrada do workflow de destino
- [Nó Set](./set-node.md) – Transformação de dados (não chamadas de workflow)
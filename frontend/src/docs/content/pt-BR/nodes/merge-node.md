# Mesclagem

O nó **Merge** aguarda múltiplas entradas paralelas e as combina em uma única saída. Utilize-o quando precisar unir resultados de ramificações paralelas antes de continuar.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | n (configurável) |
| Saídas | 1 |
| Saída | `$nodeLabel.merged` – objeto com entradas de cada ramificação |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `inputCount` | number | Número de entradas a aguardar (padrão: 2) |

## Quando Usar

- Utilize quando precisar **combinar** ou **unir** resultados de ramificações paralelas
- **Não** utilize para workflows paralelos que terminam com nós [Output](./output-node.md) separados
- Cada ramificação de entrada contribui para a saída mesclada

## Exemplo

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Conecte múltiplas ramificações ao nó merge. O nó aguarda todas as entradas antes de produzir a saída.

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [Parallel Execution](../reference/parallel-execution.md) – Como as ramificações paralelas são executadas
- [Workflow Structure](../reference/workflow-structure.md) – Edges e handles

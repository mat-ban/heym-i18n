# Merge

O nó **Merge** aguarda múltiplas entradas paralelas e combina-as numa única saída. Utilize-o quando precisar de unir resultados de ramos paralelos antes de continuar.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | n (configurável) |
| Saídas | 1 |
| Saída | `$nodeLabel.merged` – objeto com entradas de cada ramo |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `inputCount` | number | Número de entradas a aguardar (predefinição: 2) |

## Quando Utilizar

- Utilize quando precisar de **combinar** ou **unir** resultados de ramos paralelos
- **Não** utilize para workflows paralelos que terminam com nós [Output](./output-node.md) separados
- Cada ramo de entrada contribui para a saída combinada

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

Ligue múltiplos ramos ao nó merge. O nó aguarda por todas as entradas antes de produzir a saída.

## Relacionado

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Execução Paralela](../reference/parallel-execution.md) – Como os ramos paralelos são executados
- [Estrutura do Workflow](../reference/workflow-structure.md) – Arestas e handles
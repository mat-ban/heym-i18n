# Switch

O nó **Switch** encaminha a execução para diferentes caminhos com base na correspondência de um valor em relação a casos. Suporta N casos mais um padrão (default).

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | n (uma por caso + default) |
| Saída | Passa a entrada para o ramo correspondente |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `expression` | expression | Valor a ser avaliado (ex.: `$input.category`) |
| `cases` | string[] | Valores de caso a serem correspondidos (ex.: `["case1", "case2", "case3"]`) |

## Handles de Borda

- Cada caso recebe um handle de origem (índice 0, 1, 2, …)
- Handle padrão (default) para valores sem correspondência

## Exemplo

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Conecte as bordas com `sourceHandle` definido como o índice do caso (0, 1, 2) ou o handle padrão (default) para valores sem correspondência.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Condition](./condition-node.md) – Ramificação if/else
- [Expression DSL](../reference/expression-dsl.md) – Sintaxe de expressão

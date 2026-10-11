# Condition

O nó **Condition** ramifica o workflow com base em uma expressão if/else. Encaminha para o caminho verdadeiro ou falso dependendo do resultado.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 2 (true, false) |
| Saída | Passa a entrada para o ramo escolhido |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `condition` | expression | Expressão semelhante a JavaScript (ex.: `$input.text.length > 0`) |

## Handles de aresta

- **Handle de origem `true`** – quando a condição é avaliada como verdadeira
- **Handle de origem `false`** – quando a condição é avaliada como falsa

## Operadores de expressão

Suporta: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, etc. Consulte [Expression DSL](../reference/expression-dsl.md).

## Exemplo

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Conecte arestas com `sourceHandle: "true"` ou `sourceHandle: "false"` para encaminhar para ramos diferentes.

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Switch](./switch-node.md) – Roteamento múltiplo por valor
- [Expression DSL](../reference/expression-dsl.md) – Sintaxe de condição
- [Diálogo de avaliação de expressão](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend para condição
# Loop

O nó **Loop** itera sobre um array, executando os nós subsequentes para cada item. Requer uma back-connection do último nó no corpo da iteração para avançar.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 2 (padrão + loop back) |
| Saídas | 2 (loop, done) |
| Saída | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `arrayExpression` | expression | Expressão que resolve para um array (ex.: `$input.items`) |

## Edge Handles

- **Source `loop`** – Conecta-se aos nós que processam cada item (executa por iteração)
- **Source `done`** – Conecta-se aos nós que executam após todas as iterações serem concluídas
- **Target default** – Recebe os dados iniciais contendo o array
- **Target `loop`** – Recebe a back-connection do último nó do corpo da iteração

## Contexto do Loop (no corpo da iteração)

- `$loopNode.item` – Item atual
- `$loopNode.index` – Índice baseado em 0
- `$loopNode.total` – Total de itens
- `$loopNode.isFirst` – Booleano
- `$loopNode.isLast` – Booleano

## Regras Críticas

1. **Back-connection obrigatória:** O último nó no corpo da iteração DEVE conectar-se de volta ao handle de entrada `loop` do loop.
2. **Sem saída no corpo do loop:** Nós [Output](./output-node.md) são proibidos dentro do corpo do loop. Utilize [Set](./set-node.md) ou [Variable](./variable-node.md) para resultados intermediários.
3. **Sem resultados automáticos:** O loop não coleta resultados. Utilize nós Variable com `$array()` e `.add()` para acumular.

## Exemplo

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Fluxo: loop → nó de processamento → (de volta ao loop) → loop → ramificação done → output.

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [Variable Node](./variable-node.md) – Coletar itens em um loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, métodos de array

# Loop

O nó **Loop** itera sobre um array, executando os nós subsequentes para cada item. Requer uma conexão de retorno a partir do último nó do corpo da iteração para avançar.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 2 (padrão + retorno do loop) |
| Saídas | 2 (loop, concluído) |
| Saída | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `arrayExpression` | expression | Expressão que é resolvida para um array (ex.: `$input.items`) |

## Handles de conexão

- **Origem `loop`** – Conecta-se aos nós que processam cada item (executa por iteração)
- **Origem `done`** – Conecta-se aos nós que são executados após a conclusão de todas as iterações
- **Destino padrão** – Recebe os dados iniciais que contêm o array
- **Destino `loop`** – Recebe a conexão de retorno a partir do último nó do corpo da iteração

## Contexto do loop (no corpo da iteração)

- `$loopNode.item` – Item atual
- `$loopNode.index` – Índice com base 0
- `$loopNode.total` – Total de itens
- `$loopNode.isFirst` – Booleano
- `$loopNode.isLast` – Booleano

## Regras críticas

1. **Conexão de retorno obrigatória:** O último nó do corpo da iteração DEVE conectar-se de volta ao handle de entrada `loop` do loop.
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

Fluxo: loop → nó de processamento → (retorno ao loop) → loop → ramificação done → saída.

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Variable](./variable-node.md) – Coletar itens em um loop
- [DSL de expressões](../reference/expression-dsl.md) – `item`, `index`, métodos de array
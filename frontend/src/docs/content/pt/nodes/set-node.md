# Set

O nó **Set** transforma e mapeia dados de entrada para uma saída personalizada. Utilize-o para converter para maiúsculas, extrair substrings, concatenar, gerar números aleatórios e realizar qualquer transformação de dados — não para chamar workflows (para isso, utilize [Execute](./execute-node.md)).

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.keyName` para cada chave de mapeamento |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `mappings` | array | Pares chave-valor. Cada um: `{ key, value }`, onde `value` é uma [expressão](../reference/expression-dsl.md) |

## Uso como ferramenta de agente

Quando um nó Set está conectado a um [Nó Agent](./agent-node.md) como ferramenta do canvas, cada valor de mapeamento pode ser marcado como **fornecido pelo agente** com o ícone de bot. Os valores de mapeamento marcados tornam-se parâmetros de ferramenta que o agente preenche em tempo de execução. Os mapeamentos não marcados permanecem fixos na configuração do nó.

O ícone de bot aparece apenas quando o nó Set está conectado ao handle de ferramentas de um agente. Um nó Set isolado não exibe os controles de fornecimento pelo agente.

## Regras de expressão

- Referencie nós anteriores: `$nodeName.text`, `$nodeName.body.field`
- Utilize funções: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exclui `b`; retorna erro se `a > b`.
- Apenas um `$` no início da expressão — nunca dentro de parênteses
- Acesse a saída pela chave: `$setNode.randomNumber`, `$setNode.text`

## Exemplo

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Os nós subsequentes acessam via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relacionados

- [Mapeador de saída JSON](./json-output-mapper-node.md) – Os mesmos mapeamentos; o único terminal retorna o JSON raiz para webhooks/execuções
- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Execute](./execute-node.md) – Chamar workflows (não transformação de dados)
- [DSL de expressão](../reference/expression-dsl.md) – Funções e sintaxe
- [Diálogo de avaliação de expressão](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend e Anterior/Próximo para mapeamentos
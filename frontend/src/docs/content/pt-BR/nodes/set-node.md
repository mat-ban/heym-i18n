# Definir

O nó **Set** transforma e mapeia dados de entrada para uma saída personalizada. Utilize-o para converter para maiúsculas, extrair substrings, concatenar, gerar números aleatórios e realizar qualquer transformação de dados — não para chamar workflows (para isso, utilize [Execute](./execute-node.md)).

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.keyName` para cada chave de mapeamento |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `mappings` | array | Pares chave-valor. Cada um: `{ key, value }` onde `value` é uma [expressão](../reference/expression-dsl.md) |

## Uso como ferramenta de agente

Quando um nó Set está conectado a um [Agent Node](./agent-node.md) como ferramenta de canvas, cada valor de mapeamento pode ser marcado como **fornecido pelo agente** com o ícone de bot. Valores de mapeamento marcados tornam-se parâmetros de ferramenta que o agente preenche em tempo de execução. Mapeamentos não marcados permanecem fixos na configuração do nó.

O ícone de bot aparece apenas quando o nó Set está conectado ao handle de ferramentas de um agente. Um nó Set independente não exibe controles de fornecimento pelo agente.

## Regras de Expressão

- Referencie nós anteriores: `$nodeName.text`, `$nodeName.body.field`
- Utilize funções: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exclui b; gera erro se `a > b`.
- Apenas um `$` no início da expressão — nunca dentro de parênteses
- Acesse a saída por chave: `$setNode.randomNumber`, `$setNode.text`

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

Nós subsequentes acessam via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relacionados

- [Mapeador de saída JSON](./json-output-mapper-node.md) – Os mesmos mapeamentos; terminal único retorna JSON raiz para webhooks/execuções
- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Execute](./execute-node.md) – Chamar workflows (não transformação de dados)
- [Expression DSL](../reference/expression-dsl.md) – Funções e sintaxe
- [Diálogo de Avaliação de Expressão](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend e Anterior/Próximo para mapeamentos

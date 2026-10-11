# Mapeador de Saída JSON

O nó **Mapeador de saída JSON** constrói um objeto JSON a partir de [mapeamentos](./set-node.md) de chave/valor (mesmo modelo do [Set](./set-node.md)). Utilize-o quando os chamadores devem receber um **corpo JSON simples** na raiz da resposta.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 0 (sink) |
| Saída em tempo de execução | Objeto construído a partir de `mappings` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `mappings` | array | Entradas `{ "key": "fieldName", "value": "expression" }` (mesmo que o Set) |

## Uso como ferramenta de agente

Não suportado. Este nó é um sink terminal, portanto não pode ser anexado a um handle de ferramentas do [Nó de Agente](./agent-node.md). Utilize um nó [Set](./set-node.md) quando um agente precisar moldar valores durante a conversa.

## Comportamento de Webhook e execução

Quando este nó é a **única** saída terminal do workflow, as **saídas** da execução são o próprio objeto mapeado: as chaves de `mappings` aparecem no **nível superior** do JSON. **Não** há wrapper externo com a chave do label do nó e **não** há objeto `{ "result": ... }` (diferentemente do nó [Output](./output-node.md)).

Se múltiplos nós terminais produzirem saídas (por exemplo, [Output](./output-node.md) mais o mapeador de saída JSON, ou vários ramos), o Heym utiliza o formato normal: cada terminal é indexado pelo seu `label`.

## Restrição de loop

Mesma regra do [Output](./output-node.md): não coloque este nó dentro de um ramo de iteração de loop — apenas após o ramo `done` do loop. Consulte [Loop](./loop-node.md).

## Exemplo

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Relacionados

- [Set](./set-node.md) – Mesma mecânica de mapeamento para transformações intermediárias
- [Output](./output-node.md) – Resposta baseada em mensagem ou schema com encapsulamento `result`
- [Tipos de nó](../reference/node-types.md) – Todos os tipos de nó
- [Estrutura do Workflow](../reference/workflow-structure.md) – Formato JSON do workflow
- [Webhooks](../reference/webhooks.md) – Endpoint de execução e respostas

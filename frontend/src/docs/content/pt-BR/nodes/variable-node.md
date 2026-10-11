# Variável

O nó **Variable** define ou atualiza uma variável acessível a partir de qualquer nó via `$vars.variableName` (local ao workflow) ou `$global.variableName` (persistente). Utilize-o para contadores, listas acumuladas e estado compartilhado em todo o workflow.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.value`, ou acesso via `$vars.variableName` / `$global.variableName` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `variableName` | string | Nome da variável (usado como `$vars.variableName` ou `$global.variableName`). Evite [nomes reservados](../reference/expression-dsl.md). |
| `variableValue` | expression | Valor a ser definido. Suporta expressões. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Coerção de tipo (padrão: auto) |
| `isGlobal` | boolean | Quando `true`, armazena no [Global Variable Store](../reference/global-variables.md) (persistente, com escopo de usuário). Quando `false` ou omitido, local ao workflow (em memória). |

## Variáveis do Tipo Array

Inicialize arrays com `$array()` ou `$array("a", "b")` em um nó Variable antes de usar `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Em seguida, adicione itens (sem `$` dentro dos parênteses):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Regra Crítica

**Nunca utilize `$` dentro dos parênteses de um método:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – quebra a expressão

## Exemplo – Contador

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Loop Node](./loop-node.md) – Colete itens com Variable no corpo do loop
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nomes reservados
- [Global Variables](../reference/global-variables.md) – Variáveis persistentes com `isGlobal`

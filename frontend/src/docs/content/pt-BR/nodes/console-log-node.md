# Log do Console

O nó **Console Log** registra um valor no console do backend (servidor). Utilize-o para depuração e inspeção durante o desenvolvimento.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | Repassa a entrada |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `logMessage` | expression | Valor a ser registrado. Suporta [expressões](../reference/expression-dsl.md). |

## Exemplo

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

A saída aparece nos logs do servidor (por exemplo, na saída do terminal ao executar `uvicorn`).

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Logs Tab](../tabs/logs-tab.md) – Visualizar os logs da aplicação

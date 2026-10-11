# Lançar Erro

O nó **Throw Error** interrompe a execução do workflow imediatamente e retorna uma resposta de erro com um código de status HTTP personalizado. Utilize-o para falhas de validação, acesso não autorizado ou outras condições de erro.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 0 |
| Saída | O workflow é interrompido; a resposta de erro é retornada ao chamador |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `errorMessage` | expression | Mensagem de erro (suporta expressões) |
| `httpStatusCode` | number | Código de status HTTP (ex.: 400, 401, 403, 404, 429, 500) |

## Códigos de Status Comuns

| Código | Caso de uso |
|------|----------|
| 400 | Bad Request (entrada inválida) |
| 401 | Unauthorized (autenticação necessária) |
| 403 | Forbidden (acesso negado) |
| 404 | Not Found (recurso ausente) |
| 422 | Unprocessable Entity (erro de validação) |
| 429 | Too Many Requests (limite de requisições) |
| 500 | Internal Server Error |

## Exemplo

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Utilize com o nó [Condition](./condition-node.md) para validar a entrada e lançar o erro apenas quando ela for inválida:
- Condição verdadeira → continua para a Saída
- Condição falsa → Lançar Erro

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nós
- [Condition Node](./condition-node.md) – Valide antes de lançar o erro
- [Error Handler](./error-handler-node.md) – Capture erros de outros nós

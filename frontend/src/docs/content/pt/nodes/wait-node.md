# Wait

O nó **Wait** pausa a execução do workflow por uma duração especificada. Utilize-o para limitação de taxa, ações atrasadas ou intervalos de polling.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | Repassa a entrada |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `label` | string | Identificador do nó (camelCase) |
| `duration` | number | Atraso em milissegundos (ex.: 1000 = 1 segundo). O editor aceita de 1 a 900000 (15 minutos) |

## Exemplo

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Relacionados

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Nó Loop](./loop-node.md) – Utilize o Wait dentro de loops para limitação de taxa
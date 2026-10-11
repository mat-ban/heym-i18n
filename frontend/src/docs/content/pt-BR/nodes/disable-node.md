# Desativar Nó

O nó **Disable Node** desabilita permanentemente outro nó no workflow. Quando executado, ele define o `active` do nó de destino como `false` e persiste a alteração. Utilize-o para operações pontuais, como interromper um trigger Cron após uma condição ser atendida.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `targetNodeLabel` | string | Label do nó a ser desabilitado (ex.: `hourlyCheck`) |

## Caso de Uso

Desabilitar um trigger [Cron](./cron-node.md) após uma condição ser atendida, para que ele não seja mais executado em execuções futuras do workflow. Reative-o posteriormente com o [Enable Node](./enable-node.md).

## Exemplo

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Fluxo: Cron → Verificação HTTP → Condição (status completo?) → se verdadeiro: Disable Node (destino: cron) → Saída.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Enable Node](./enable-node.md) – Reativar um nó desabilitado
- [Nó Cron](./cron-node.md) – Trigger a ser desabilitado
- [Nó Condition](./condition-node.md) – Ramificação antes de desabilitar

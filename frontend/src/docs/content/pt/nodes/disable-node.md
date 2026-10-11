# Desativar Nó

O nó **Desativar Nó** desativa permanentemente outro nó no workflow. Quando executado, define o `active` do nó de destino como `false` e persiste a alteração. Utilize-o para operações pontuais, como interromper um trigger Cron após uma condição ser atendida.

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
| `targetNodeLabel` | string | Label do nó a ser desativado (ex.: `hourlyCheck`) |

## Caso de Uso

Desative um trigger [Cron](./cron-node.md) após uma condição ser atendida, para que ele não seja mais executado em execuções futuras do workflow. Reative-o posteriormente com [Ativar Nó](./enable-node.md).

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

Fluxo: Cron → Verificação HTTP → Condição (status concluído?) → se verdadeiro: Desativar Nó (destino: cron) → Saída.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Ativar Nó](./enable-node.md) – Reativar um nó desativado
- [Nó Cron](./cron-node.md) – Trigger a ser desativado
- [Nó Condition](./condition-node.md) – Ramificação antes da desativação
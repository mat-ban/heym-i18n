# Nó Enable

O nó **Enable Node** reativa outro nó. Quando executado, define o `active` do nó de destino como `true` e persiste a alteração. É a contraparte do [Disable Node](./disable-node.md): utilize-o para rearmar um trigger [Cron](./cron-node.md) ou qualquer nó que tenha sido desativado.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `targetNodeLabel` | string | Label do nó a ativar (ex.: `hourlyCheck`) |

## Comportamento

- O destino é salvo como ativo, de modo que execuções e triggers futuros o reconheçam. Um trigger Cron reativado dispara novamente no seu próximo horário agendado.
- Se o destino estiver a jusante do Enable Node e ainda não tiver sido executado, ele também será executado na execução atual.
- Ativar um nó que já está ativo não altera nada; a saída ainda reporta `enabled: true`.
- O nó falha com um erro quando `targetNodeLabel` está vazio ou nenhum nó possui esse label.

## Caso de uso

Iniciar um trigger [Cron](./cron-node.md) sob demanda. Salve o nó Cron desativado e forneça ao workflow um segundo ponto de entrada, como um trigger [Input](./input-node.md). Uma requisição a esse ponto de entrada executa o Enable Node, e o Cron começa a disparar.

Um trigger desativado nunca inicia uma execução por si só, portanto o Enable Node deve estar atrás de um ponto de entrada que possa ser executado.

## Exemplo

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Fluxo: Input → Enable Node (destino: cron) → Output. O nó Cron `hourlyCheck` é salvo como desativado no mesmo workflow e executa o seu próprio ramo de verificação HTTP assim que for ativado.

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Disable Node](./disable-node.md) – Desativar um nó de dentro de um workflow
- [Cron Node](./cron-node.md) – Trigger a ativar
- [Condition Node](./condition-node.md) – Ramificar antes de ativar
- [Canvas Features](../reference/canvas-features.md) – Ativar ou desativar um nó manualmente
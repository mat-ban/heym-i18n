# Ativar Nó

O nó **Habilitar Nó** reativa outro nó. Quando executado, ele define o `active` do nó de destino como `true` e persiste a alteração. É a contraparte do [Desabilitar Nó](./disable-node.md): use-o para rearmar um trigger [Cron](./cron-node.md) ou qualquer nó que tenha sido desligado.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `targetNodeLabel` | string | Label do nó a ser habilitado (ex.: `hourlyCheck`) |

## Comportamento

- O destino é salvo como ativo, de modo que execuções e triggers futuros o enxerguem. Um trigger Cron reabilitado dispara novamente em seu próximo horário agendado.
- Se o destino estiver a jusante do nó Habilitar Nó e ainda não tiver sido executado, ele também será executado na execução atual.
- Habilitar um nó que já está ativo não altera nada; a saída ainda reporta `enabled: true`.
- O nó falha com um erro quando `targetNodeLabel` está vazio ou nenhum nó possui esse label.

## Caso de Uso

Inicie um trigger [Cron](./cron-node.md) sob demanda. Salve o nó Cron desligado e forneça ao workflow um segundo ponto de entrada, como um trigger [Input](./input-node.md). Uma requisição a esse ponto de entrada executa o nó Habilitar Nó, e o Cron começa a disparar.

Um trigger desligado nunca inicia uma execução por conta própria, portanto o nó Habilitar Nó deve estar atrás de um ponto de entrada que possa ser executado.

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

Fluxo: Input → Habilitar Nó (destino: cron) → Output. O nó Cron `hourlyCheck` é salvo como desabilitado no mesmo workflow e executa seu próprio ramo de verificação HTTP assim que for habilitado.

## Relacionados

- [Tipos de Nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Desabilitar Nó](./disable-node.md) – Desliga um nó de dentro de um workflow
- [Nó Cron](./cron-node.md) – Trigger a ser habilitado
- [Nó Condition](./condition-node.md) – Ramifica antes de habilitar
- [Recursos do Canvas](../reference/canvas-features.md) – Habilite ou desabilite um nó manualmente

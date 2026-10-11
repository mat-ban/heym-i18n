# Disable Node

Il nodo **Disable Node** disabilita in modo permanente un altro nodo del workflow. All'esecuzione, imposta la proprietà `active` del nodo di destinazione su `false` e rende persistente la modifica. Utilizzarlo per operazioni una tantum, come l'arresto di un trigger Cron al verificarsi di una condizione.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `targetNodeLabel` | string | Label del nodo da disabilitare (es. `hourlyCheck`) |

## Caso d'uso

Disabilitare un trigger [Cron](./cron-node.md) al verificarsi di una condizione, affinché non venga più eseguito nelle successive esecuzioni del workflow. Riattivarlo in un secondo momento con [Enable Node](./enable-node.md).

## Esempio

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flusso: Cron → HTTP check → Condition (status complete?) → se vero: Disable Node (target: cron) → Output.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Enable Node](./enable-node.md) – Riattiva un nodo disabilitato
- [Cron Node](./cron-node.md) – Trigger da disabilitare
- [Condition Node](./condition-node.md) – Diramazione prima della disabilitazione
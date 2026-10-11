# Merge

Il nodo **Merge** attende più input paralleli e li combina in un unico output. Lo si utilizzi quando occorre unire i risultati provenienti da rami paralleli prima di proseguire.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | n (configurabile) |
| Output | 1 |
| Output | `$nodeLabel.merged` – oggetto con gli input provenienti da ciascun ramo |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `inputCount` | number | Numero di input da attendere (predefinito: 2) |

## Quando utilizzarlo

- Lo si utilizzi quando occorre **combinare** o **unire** i risultati provenienti da rami paralleli
- **Non** lo si utilizzi per workflow paralleli che terminano con nodi [Output](./output-node.md) separati
- Ciascun ramo di input contribuisce all'output unificato

## Esempio

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Collegare più rami al nodo merge. Il nodo attende tutti gli input prima di produrre l'output.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Parallel Execution](../reference/parallel-execution.md) – Come vengono eseguiti i rami paralleli
- [Workflow Structure](../reference/workflow-structure.md) – Archi e handle
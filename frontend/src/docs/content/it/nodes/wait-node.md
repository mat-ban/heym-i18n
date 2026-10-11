# Wait

Il nodo **Wait** sospende l'esecuzione del workflow per una durata specificata. Utilizzarlo per il rate limiting, azioni ritardate o intervalli di polling.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Trasmesso dall'input |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `duration` | number | Ritardo in millisecondi (es. 1000 = 1 secondo). L'editor accetta da 1 a 900000 (15 minuti) |

## Esempio

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Loop Node](./loop-node.md) – Utilizzare Wait all'interno dei loop per il rate limiting
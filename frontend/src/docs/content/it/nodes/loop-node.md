# Loop

Il nodo **Loop** itera su un array, eseguendo i nodi a valle per ciascun elemento. Richiede una connessione di ritorno dall'ultimo nodo del corpo dell'iterazione per avanzare.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 2 (default + loop back) |
| Output | 2 (loop, done) |
| Output | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `arrayExpression` | expression | Espressione che restituisce un array (es. `$input.items`) |

## Handle delle connessioni

- **Sorgente `loop`** – Si connette ai nodi che elaborano ciascun elemento (viene eseguita a ogni iterazione)
- **Sorgente `done`** – Si connette ai nodi che vengono eseguiti al termine di tutte le iterazioni
- **Destinazione default** – Riceve i dati iniziali contenenti l'array
- **Destinazione `loop`** – Riceve la connessione di ritorno dall'ultimo nodo del corpo dell'iterazione

## Contesto del Loop (nel corpo dell'iterazione)

- `$loopNode.item` – Elemento corrente
- `$loopNode.index` – Indice con base 0
- `$loopNode.total` – Numero totale di elementi
- `$loopNode.isFirst` – Booleano
- `$loopNode.isLast` – Booleano

## Regole fondamentali

1. **Connessione di ritorno obbligatoria:** l'ultimo nodo del corpo dell'iterazione DEVE riconnettersi all'handle di input `loop` del nodo Loop.
2. **Nessun output nel corpo del loop:** i nodi [Output](./output-node.md) sono vietati all'interno del corpo del loop. Utilizzare [Set](./set-node.md) o [Variable](./variable-node.md) per i risultati intermedi.
3. **Nessuna raccolta automatica dei risultati:** il loop non raccoglie i risultati. Utilizzare i nodi Variable con `$array()` e `.add()` per accumularli.

## Esempio

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flusso: loop → nodo di elaborazione → (ritorno al loop) → loop → ramo done → output.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Nodo Variable](./variable-node.md) – Raccogliere elementi in un loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, metodi degli array
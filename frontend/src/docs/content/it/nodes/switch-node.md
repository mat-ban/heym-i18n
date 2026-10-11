# Switch

Il nodo **Switch** instrada l'esecuzione verso percorsi differenti in base alla corrispondenza di un valore rispetto a determinati casi. Supporta N casi più un caso predefinito.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | n (uno per caso + predefinito) |
| Output | Trasmette l'input al ramo corrispondente |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `expression` | expression | Valore da valutare (es. `$input.category`) |
| `cases` | string[] | Valori dei casi da confrontare (es. `["case1", "case2", "case3"]`) |

## Handle delle connessioni

- Ogni caso dispone di un source handle (indice 0, 1, 2, …)
- Handle predefinito per i valori non corrispondenti

## Esempio

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Collegare le connessioni impostando `sourceHandle` sull'indice del caso (0, 1, 2) oppure sull'handle predefinito per i valori non corrispondenti.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Nodo Condition](./condition-node.md) – Ramificazione if/else
- [DSL delle espressioni](../reference/expression-dsl.md) – Sintassi delle espressioni
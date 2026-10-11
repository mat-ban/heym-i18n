# Condition

Il nodo **Condition** dirama il workflow in base a un'espressione if/else. Indirizza verso il percorso true o false a seconda del risultato.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 2 (true, false) |
| Output | Trasmette l'input al ramo scelto |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `label` | string | Identificatore del nodo (camelCase) |
| `condition` | expression | Espressione in stile JavaScript (es. `$input.text.length > 0`) |

## Handle degli archi

- **Source handle `true`** – quando la condizione restituisce un valore truthy
- **Source handle `false`** – quando la condizione restituisce un valore falsy

## Operatori delle espressioni

Supporta: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, ecc. Vedere [Expression DSL](../reference/expression-dsl.md).

## Esempio

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Collegare gli archi con `sourceHandle: "true"` o `sourceHandle: "false"` per indirizzare verso rami differenti.

## Correlati

- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Switch Node](./switch-node.md) – Instradamento multi-via in base al valore
- [Expression DSL](../reference/expression-dsl.md) – Sintassi delle condizioni
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima backend in tempo reale per la condizione
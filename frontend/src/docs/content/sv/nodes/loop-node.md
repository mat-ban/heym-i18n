# Loop

**Loop**-noden itererar över en array och kör nedströms noder för varje objekt. En återkoppling från den sista noden i iterationskroppen krävs för att gå vidare.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Ingångar | 2 (standard + loop-återkoppling) |
| Utgångar | 2 (loop, klar) |
| Utdata | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `arrayExpression` | expression | Uttryck som utvärderas till en array (t.ex. `$input.items`) |

## Kantreglage

- **Källa `loop`** – Ansluter till noder som bearbetar varje objekt (körs per iteration)
- **Källa `done`** – Ansluter till noder som körs efter att alla iterationer har slutförts
- **Mål standard** – Tar emot initial data som innehåller arrayen
- **Mål `loop`** – Tar emot återkoppling från den sista noden i iterationskroppen

## Loop-kontext (i iterationskroppen)

- `$loopNode.item` – Aktuellt objekt
- `$loopNode.index` – 0-baserat index
- `$loopNode.total` – Totalt antal objekt
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritiska regler

1. **Återkoppling krävs:** Den sista noden i iterationskroppen MÅSTE ansluta tillbaka till loopens `loop`-ingångsreglage.
2. **Ingen utdata i loop-kroppen:** [Output](./output-node.md)-noder är förbjudna inuti loop-kroppen. Använd [Set](./set-node.md) eller [Variable](./variable-node.md) för mellanliggande resultat.
3. **Inga automatiska resultat:** Loopen samlar inte in resultat. Använd Variable-noder med `$array()` och `.add()` för att ackumulera.

## Exempel

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flöde: loop → bearbetningsnod → (tillbaka till loop) → loop → done-gren → output.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Variable-nod](./variable-node.md) – Samla objekt i en loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, array-metoder

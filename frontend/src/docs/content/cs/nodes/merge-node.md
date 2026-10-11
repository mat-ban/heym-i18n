# Merge

Uzel **Merge** čeká na více paralelních vstupů a kombinuje je do jediného výstupu. Použijte jej, když potřebujete spojit výsledky z paralelních větví před pokračováním.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | n (konfigurovatelné) |
| Výstupy | 1 |
| Výstup | `$nodeLabel.merged` – objekt se vstupy z každé větve |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `inputCount` | number | Počet vstupů, na které se má čekat (výchozí: 2) |

## Kdy použít

- Použijte, když potřebujete **kombinovat** nebo **spojit** výsledky z paralelních větví
- **Nepoužívejte** pro paralelní workflow, které končí samostatnými uzly [Output](./output-node.md)
- Každá vstupní větev přispívá do sloučeného výstupu

## Příklad

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Připojte více větví k uzlu merge. Uzel čeká na všechny vstupy, než vytvoří výstup.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Parallel Execution](../reference/parallel-execution.md) – Jak fungují paralelní větve
- [Workflow Structure](../reference/workflow-structure.md) – Hrany a handly

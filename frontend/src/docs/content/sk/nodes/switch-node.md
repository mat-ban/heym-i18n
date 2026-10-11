# Switch

Uzol **Switch** smeruje vykonávanie na rôzne cesty na základe porovnania hodnoty s jednotlivými prípadmi. Podporuje N prípadov plus predvolenú vetvu.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | n (jeden pre každý prípad + predvolená vetva) |
| Výstup | Prechádza vstup do zodpovedajúcej vetvy |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `expression` | expression | Hodnota na vyhodnotenie (napr. `$input.category`) |
| `cases` | string[] | Hodnoty prípadov na porovnanie (napr. `["case1", "case2", "case3"]`) |

## Edge Handles

- Každý prípad získa zdrojový handle (index 0, 1, 2, …)
- Predvolený handle pre nezhodujúce sa hodnoty

## Príklad

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

Pripojte hrany s `sourceHandle` nastaveným na index prípadu (0, 1, 2) alebo na predvolený handle pre nezhodujúce sa hodnoty.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Uzol Condition](./condition-node.md) – Vetvenie If/else
- [Expression DSL](../reference/expression-dsl.md) – Syntax výrazov

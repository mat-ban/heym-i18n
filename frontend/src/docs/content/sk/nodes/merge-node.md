# Zlúčenie

Uzol **Zlúčenie** čaká na viacero paralelných vstupov a kombinuje ich do jedného výstupu. Použite ho, keď potrebujete spojiť výsledky z paralelných vetiev pred pokračovaním.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | n (konfigurovateľné) |
| Výstupy | 1 |
| Výstup | `$nodeLabel.merged` – objekt so vstupmi z každej vetvy |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `inputCount` | number | Počet vstupov, na ktoré sa má čakať (predvolené: 2) |

## Kedy použiť

- Použite, keď potrebujete **skombinovať** alebo **spojiť** výsledky z paralelných vetiev
- **Nepoužívajte** pre paralelné workflowy, ktoré končia samostatnými uzlami [Výstup](./output-node.md)
- Každá vstupná vetva prispieva do zlúčeného výstupu

## Príklad

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Pripojte viacero vetiev k uzlu zlúčenia. Uzol čaká na všetky vstupy pred vytvorením výstupu.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Paralelné vykonávanie](../reference/parallel-execution.md) – Ako fungujú paralelné vetvy
- [Štruktúra workflowu](../reference/workflow-structure.md) – Hrany a handly

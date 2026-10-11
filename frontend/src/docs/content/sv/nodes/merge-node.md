# Merge

Noden **Merge** väntar på flera parallella indata och kombinerar dem till en enda utdata. Den används när resultat från parallella grenar behöver sammanfogas innan körningen fortsätter.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | n (konfigurerbart) |
| Utdata | 1 |
| Utdata | `$nodeLabel.merged` – objekt med indata från varje gren |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `inputCount` | number | Antal indata som ska inväntas (standard: 2) |

## När noden ska användas

- Används när resultat från parallella grenar behöver **kombineras** eller **sammanfogas**
- Används **inte** för parallella workflows som avslutas med separata [Output](./output-node.md)-noder
- Varje indatagren bidrar till den sammanfogade utdatan

## Exempel

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Flera grenar ansluts till merge-noden. Noden väntar på samtliga indata innan utdata produceras.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Parallell körning](../reference/parallel-execution.md) – Hur parallella grenar körs
- [Workflow-struktur](../reference/workflow-structure.md) – Kanter och handles

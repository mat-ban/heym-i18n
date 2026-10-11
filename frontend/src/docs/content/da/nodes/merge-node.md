# Merge

**Merge**-noden venter på flere parallelle input og kombinerer dem til et enkelt output. Anvendes, når der er behov for at samle resultater fra parallelle grene, før arbejdet fortsætter.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | n (konfigurerbart) |
| Outputs | 1 |
| Output | `$nodeLabel.merged` – objekt med input fra hver gren |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `inputCount` | number | Antal input der skal ventes på (standard: 2) |

## Anvendelsestilfælde

- Anvendes, når der er behov for at **kombinere** eller **sammenføje** resultater fra parallelle grene
- Bør **ikke** anvendes til parallelle workflows, der slutter med separate [Output](./output-node.md)-noder
- Hver input-gran bidrager til det kombinerede output

## Eksempel

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Forbind flere grene til merge-noden. Noden venter på alle input, før der genereres output.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Parallel eksekvering](../reference/parallel-execution.md) – Sådan køres parallelle grene
- [Workflow-struktur](../reference/workflow-structure.md) – Kanter og håndtag

# Merge

A **Merge** csomópont több párhuzamos bemenetre vár, és egyetlen kimenetté kombinálja azokat. Akkor használja, amikor párhuzamos ágak eredményeit kell összekapcsolnia a folytatás előtt.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | n (konfigurálható) |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.merged` – objektum az egyes ágak bemeneteivel |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `inputCount` | number | A megvárandó bemenetek száma (alapértelmezett: 2) |

## Mikor használja

- Akkor használja, amikor párhuzamos ágak eredményeit kell **kombinálnia** vagy **összekapcsolnia**
- **Ne** használja olyan párhuzamos workflow-khoz, amelyek külön [Output](./output-node.md) csomópontokkal végződnek
- Minden bemeneti ág hozzájárul az összevont kimenethez

## Példa

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Csatlakoztasson több ágat a merge csomóponthoz. A csomópont megvárja az összes bemenetet, mielőtt kimenetet állítana elő.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Párhuzamos végrehajtás](../reference/parallel-execution.md) – Hogyan futnak a párhuzamos ágak
- [Workflow szerkezete](../reference/workflow-structure.md) – Élek és handle-ök

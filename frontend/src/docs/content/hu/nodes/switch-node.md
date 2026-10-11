# Switch

A **Switch** csomópont a végrehajtást különböző útvonalakra irányítja egy érték és az esetek (cases) összevetése alapján. N darab esetet támogat, valamint egy alapértelmezett (default) ágat.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | n (esetenként egy + alapértelmezett) |
| Kimenet | A bemenetet továbbítja a illeszkedő ágra |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | A csomópont azonosítója (camelCase) |
| `expression` | expression | A kiértékelendő érték (pl. `$input.category`) |
| `cases` | string[] | Az illesztendő esetértékek (pl. `["case1", "case2", "case3"]`) |

## Élkezelők (Edge Handles)

- Minden eset kap egy forráskezelőt (index 0, 1, 2, …)
- Alapértelmezett kezelő a nem illeszkedő értékekhez

## Példa

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

Az élek összekapcsolásakor a `sourceHandle` értékét állítsa az eset indexére (0, 1, 2), vagy a nem illeszkedő értékek esetén az alapértelmezett kezelőre.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Condition csomópont](./condition-node.md) – If/else elágazás
- [Expression DSL](../reference/expression-dsl.md) – Kifejezés szintaxis

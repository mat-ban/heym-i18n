# Preklop

**Preklop** vozlišče usmerja izvajanje na različne poti na podlagi ujemanja vrednosti s primeri. Podpira N primerov plus privzeto.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | n (en za vsak primer + privzeto) |
| Izhod | Prenese vhod na ujemajočo vejo |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `expression` | izraz | Vrednost za oceno (npr. `$input.category`) |
| `cases` | niz[] | Vrednosti primerov za ujemanje (npr. `["case1", "case2", "case3"]`) |

## Ročaji robov

- Vsak primer dobi izvorni ročaj (indeks 0, 1, 2, …)
- Privzeti ročaj za neujemajoče vrednosti

## Primer

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

Povežite robove z `sourceHandle`, nastavljenim na indeks primera (0, 1, 2) ali privzeti ročaj za neujemajoče vrednosti.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Pogojno vozlišče](./condition-node.md) – If/else razvejitve
- [Izrazni DSL](../reference/expression-dsl.md) – Sintaksa izrazov

# Switch

**Switch** čvor usmjerava izvršavanje na različite putanje na temelju usklađivanja vrijednosti s slučajevima. Podržava N slučajeva plus zadani.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | n (jedan po slučaju + zadani) |
| Izlaz | Prolazi kroz ulaz do usklađene grane |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `label` | string | Identifikator čvora (camelCase) |
| `expression` | expression | Vrijednost za evaluaciju (npr. `$input.category`) |
| `cases` | string[] | Vrijednosti slučajeva za usklađivanje (npr. `["case1", "case2", "case3"]`) |

## Ručke rubova

- Svaki slučaj dobiva izvorne ručke (indeksi 0, 1, 2, …)
- Zadana ručka za neusklađene vrijednosti

## Primjer

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

Povežite rubove s `sourceHandle` postavljenim na indeks slučaja (0, 1, 2) ili zadanu ručku za neusklađene vrijednosti.

## Povezano

- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Condition Node](./condition-node.md) – If/else grananje
- [Expression DSL](../reference/expression-dsl.md) – Sintaksa izraza

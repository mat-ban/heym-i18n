# Switch

Nodul **Switch** direcționează execuția către diferite căi pe baza potrivirii unei valori cu cazurile definite. Suportă N cazuri plus o ramură implicită.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | n (una pentru fiecare caz + implicită) |
| Ieșire | Transmite intrarea către ramura potrivită |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `label` | string | Identificatorul nodului (camelCase) |
| `expression` | expression | Valoarea de evaluat (de ex. `$input.category`) |
| `cases` | string[] | Valorile cazurilor de potrivit (de ex. `["case1", "case2", "case3"]`) |

## Mânere de conexiune

- Fiecare caz primește un mâner sursă (index 0, 1, 2, …)
- Mâner implicit pentru valorile care nu se potrivesc

## Exemplu

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

Conectați muchiile cu `sourceHandle` setat la indexul cazului (0, 1, 2) sau la mânerul implicit pentru valorile care nu se potrivesc.

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Nodul Condition](./condition-node.md) – Ramificare if/else
- [Expression DSL](../reference/expression-dsl.md) – Sintaxa expresiilor

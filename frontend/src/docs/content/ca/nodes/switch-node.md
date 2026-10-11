# Switch

El node **Switch** encamina l'execució cap a diferents camins basant-se en la coincidència d'un valor amb els casos definits. Admet N casos més un cas per defecte.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | n (una per cas + per defecte) |
| Sortida | Transmet l'entrada a la branca coincident |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `expression` | expression | Valor a avaluar (p. ex. `$input.category`) |
| `cases` | string[] | Valors de cas a comparar (p. ex. `["case1", "case2", "case3"]`) |

## Handles de connexió

- Cada cas obté un handle d'origen (índex 0, 1, 2, …)
- Handle per defecte per als valors que no coincideixen

## Exemple

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

Connecteu les arestes amb `sourceHandle` establert a l'índex del cas (0, 1, 2) o al handle per defecte per als valors que no coincideixen.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Condition Node](./condition-node.md) – Ramificació if/else
- [Expression DSL](../reference/expression-dsl.md) – Sintaxi d'expressions
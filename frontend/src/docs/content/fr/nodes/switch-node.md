# Switch

Le nœud **Switch** achemine l'exécution vers différents chemins en fonction de la correspondance d'une valeur avec des cas. Prend en charge N cas plus un cas par défaut.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | n (une par cas + défaut) |
| Sortie | Transmet l'entrée à la branche correspondante |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `expression` | expression | Valeur à évaluer (ex. `$input.category`) |
| `cases` | string[] | Valeurs de cas à mettre en correspondance (ex. `["case1", "case2", "case3"]`) |

## Poignées de connexion (Edge Handles)

- Chaque cas dispose d'une poignée source (index 0, 1, 2, …)
- Poignée par défaut pour les valeurs sans correspondance

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

Connectez les edges avec `sourceHandle` défini sur l'index du cas (0, 1, 2) ou sur la poignée par défaut pour les valeurs sans correspondance.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Condition](./condition-node.md) – Branchement if/else
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe des expressions

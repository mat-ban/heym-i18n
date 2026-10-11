# Merge

Le nœud **Merge** attend plusieurs entrées parallèles et les combine en une seule sortie. Utilisez-le lorsque vous devez joindre les résultats de branches parallèles avant de poursuivre.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | n (configurable) |
| Sorties | 1 |
| Sortie | `$nodeLabel.merged` – objet contenant les entrées de chaque branche |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `inputCount` | number | Nombre d'entrées à attendre (par défaut : 2) |

## Quand l'utiliser

- Utilisez-le lorsque vous devez **combiner** ou **joindre** les résultats de branches parallèles
- Ne l'utilisez **pas** pour des workflows parallèles qui se terminent par des nœuds [Output](./output-node.md) distincts
- Chaque branche d'entrée contribue à la sortie fusionnée

## Exemple

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Connectez plusieurs branches au nœud Merge. Le nœud attend toutes les entrées avant de produire sa sortie.

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Parallel Execution](../reference/parallel-execution.md) – Fonctionnement des branches parallèles
- [Workflow Structure](../reference/workflow-structure.md) – Edges et handles

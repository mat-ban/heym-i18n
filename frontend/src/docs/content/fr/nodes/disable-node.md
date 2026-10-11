# Désactiver un Nœud

Le nœud **Disable Node** désactive définitivement un autre nœud du workflow. Lors de son exécution, il définit la propriété `active` du nœud cible sur `false` et persiste la modification. Utilisez-le pour des opérations ponctuelles, comme l'arrêt d'un trigger Cron après qu'une condition a été remplie.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `targetNodeLabel` | string | Label du nœud à désactiver (ex. `hourlyCheck`) |

## Cas d'usage

Désactiver un trigger [Cron](./cron-node.md) après qu'une condition a été remplie afin qu'il ne s'exécute plus lors des futures exécutions du workflow. Réactivez-le ultérieurement avec [Enable Node](./enable-node.md).

## Exemple

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux : Cron → Vérification HTTP → Condition (statut terminé ?) → si vrai : Disable Node (cible : cron) → Sortie.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Enable Node](./enable-node.md) – Réactiver un nœud désactivé
- [Cron Node](./cron-node.md) – Trigger à désactiver
- [Condition Node](./condition-node.md) – Branchement avant désactivation

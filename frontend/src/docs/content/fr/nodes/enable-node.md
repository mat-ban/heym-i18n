# Nœud Enable Node

Le nœud **Enable Node** réactive un autre nœud. Lors de son exécution, il définit la propriété `active` du nœud cible sur `true` et persiste la modification. Il s'agit du pendant du nœud [Disable Node](./disable-node.md) : utilisez-le pour réarmer un Trigger [Cron](./cron-node.md) ou tout nœud qui a été désactivé.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `targetNodeLabel` | string | Label du nœud à activer (ex. `hourlyCheck`) |

## Comportement

- La cible est enregistrée comme active, de sorte que les exécutions et Triggers suivants la prennent en compte. Un Trigger Cron réactivé se déclenche à nouveau à sa prochaine échéance planifiée.
- Si la cible se situe en aval du nœud Enable Node et n'a pas encore été exécutée, elle s'exécute également lors de l'exécution en cours.
- Activer un nœud déjà actif ne change rien ; la sortie indique toujours `enabled: true`.
- Le nœud échoue avec une erreur lorsque `targetNodeLabel` est vide ou qu'aucun nœud ne porte ce label.

## Cas d'usage

Démarrer un Trigger [Cron](./cron-node.md) à la demande. Enregistrez le nœud Cron désactivé et dotez le Workflow d'un second point d'entrée tel qu'un Trigger [Input](./input-node.md). Une requête adressée à ce point d'entrée exécute le nœud Enable Node, et le Cron commence à se déclencher.

Un Trigger désactivé ne démarre jamais une exécution de lui-même ; le nœud Enable Node doit donc se trouver derrière un point d'entrée capable de s'exécuter.

## Exemple

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux : Input → Enable Node (cible : cron) → Output. Le nœud Cron `hourlyCheck` est enregistré comme désactivé dans le même Workflow et exécute sa propre branche de vérification HTTP une fois activé.

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Disable Node](./disable-node.md) – Désactiver un nœud depuis l'intérieur d'un Workflow
- [Cron Node](./cron-node.md) – Trigger à activer
- [Condition Node](./condition-node.md) – Brancher avant l'activation
- [Canvas Features](../reference/canvas-features.md) – Activer ou désactiver un nœud manuellement

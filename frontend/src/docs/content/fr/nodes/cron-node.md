# Cron

Le nœud **Cron** déclenche un workflow selon une planification à l'aide d'une expression cron. Aucune saisie utilisateur n'est requise : le workflow s'exécute automatiquement aux heures spécifiées.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | Événement Trigger (sans payload) |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `cronExpression` | string | Expression cron (ex. `0 * * * *` pour une exécution horaire) |

## Format de l'expression cron

Cron standard à 5 champs : `minute hour day-of-month month day-of-week`

| Champ | Valeurs | Exemple |
|-------|--------|---------|
| Minute | 0–59 | `0` = à la minute 0 |
| Heure | 0–23 | `*` = toutes les heures |
| Jour du mois | 1–31 | `*` = tous les jours |
| Mois | 1–12 | `*` = tous les mois |
| Jour de la semaine | 0–7 (0 et 7 = dimanche) | `*` = tous les jours |

**Exemples courants :**

- `0 * * * *` – toutes les heures
- `0 0 * * *` – quotidiennement à minuit
- `*/15 * * * *` – toutes les 15 minutes
- `0 9 * * 1-5` – en semaine à 9h00

## Exemple

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Désactiver un nœud](./disable-node.md) – Arrêter un Trigger cron après une condition
- [Activer un nœud](./enable-node.md) – Redémarrer un Trigger cron désactivé

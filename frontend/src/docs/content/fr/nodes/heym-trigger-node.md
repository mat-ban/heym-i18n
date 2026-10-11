# Heym Trigger

Le nœud **Heym Trigger** démarre un workflow lorsque Heym lui-même publie un événement de plateforme. Il s'agit d'un nœud Trigger sans entrée, destiné à automatiser Heym avec Heym : pistes d'audit des modifications, annonces de déploiement et synthèses de santé de l'instance.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Identifiant | Aucun requis |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `eventNames` | Tableau de chaînes | Les événements auxquels s'abonner. Laisser vide pour recevoir tous les événements. |

## Événements

| Événement | Publié lorsque | Portée |
|-------|----------------|-------|
| `heym.started` | La plateforme Heym démarre | À l'échelle de l'instance : chaque abonné le reçoit |
| `workflow.created` | Un workflow est créé | Uniquement les abonnés du propriétaire du workflow |
| `workflow.updated` | Un workflow est enregistré | Uniquement les abonnés du propriétaire du workflow |
| `workflow.deleted` | Un workflow est supprimé | Uniquement les abonnés du propriétaire du workflow |

Les widgets du tableau de bord sont stockés en interne sous forme de workflows, mais ils ne produisent jamais d'événements `workflow.*`.

## La livraison est regroupée par lots

Heym distribue les événements toutes les cinq secondes. **Chaque événement réclamé lors d'une même passe de distribution arrive dans une seule exécution de workflow**, sous forme de tableau.

- Créez deux workflows à moins de cinq secondes d'intervalle → **une seule** exécution avec deux événements.
- Créez un workflow → **une seule** exécution avec un tableau d'un élément.

La structure ne change jamais, de sorte que les expressions en aval n'ont jamais à faire de branchement selon qu'un seul événement ou plusieurs sont arrivés. Lorsque vous devez agir une fois par événement, placez un nœud [Loop](./loop-node.md) sur `$nodeLabel.events`.

## Livraison exactly-once

Chaque événement est réclamé par nœud abonné via une contrainte de base de données unique avant d'être livré. Cela tient pour chaque worker uvicorn, chaque conteneur et chaque machine : exécuter Heym sur deux serveurs ne livre pas un événement deux fois. Si une réclamation ne peut pas être enregistrée, l'événement n'est pas livré du tout — la conception échoue en mode fermé plutôt que de se déclencher deux fois.

Deux nœuds `heymTrigger` différents abonnés au même événement le reçoivent chacun une fois ; ils n'entrent pas en concurrence pour celui-ci.

## La fenêtre de distribution

Le distributeur ne considère que les événements publiés au cours des **cinq dernières minutes**. Les événements plus anciens restent dans le journal pour inspection mais ne sont jamais livrés. Cela borne ce qui se produit après une indisponibilité : redémarrer Heym après une heure hors ligne ne rejoue rien, au lieu de déclencher une heure d'événements en attente d'un coup.

Les événements sont conservés pendant **7 jours**, puis supprimés.

## Champs de sortie

| Expression | Description |
|------------|-------------|
| `$nodeLabel.events` | Tableau d'objets d'événement, du plus ancien au plus récent. Toujours un tableau. |
| `$nodeLabel.events[0].id` | UUID de l'événement |
| `$nodeLabel.events[0].name` | Nom de l'événement, par exemple `workflow.created` |
| `$nodeLabel.events[0].payload` | Corps de l'événement |
| `$nodeLabel.events[0].workflow_id` | Id du workflow concerné, ou `null` pour `heym.started` |
| `$nodeLabel.events[0].created_at` | Horodatage ISO de la publication de l'événement |
| `$nodeLabel.count` | Nombre d'événements dans ce lot |
| `$nodeLabel.triggered_at` | Horodatage ISO de l'exécution du workflow |

### Structures de payload

`workflow.created`, `workflow.updated`, `workflow.deleted` :

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started` :

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` porte le nom capturé juste avant la suppression, étant donné que la ligne du workflow a disparu au moment où vous lisez l'événement.

## Exemple de workflow

**Piste d'audit des modifications de workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** avec le label `platformEvents`, abonné à `workflow.created`, `workflow.updated`, `workflow.deleted`
- Nœud **Heym** avec `getWorkflow` et `heymWorkflowId` défini sur `$platformEvents.events[0].workflow_id`
- Message **Slack** : `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Remarques

- `heym.started` se déclenche **une fois par démarrage de plateforme**, et non une fois par worker, bien que Heym exécute huit workers par conteneur. Les conteneurs démarrés à plus de cinq minutes d'intervalle publient chacun un événement.
- Les exécutions déclenchées de cette manière apparaissent dans l'historique avec `trigger_source = "heym_event"`.
- Définissez **Events** sur aucun plutôt que de lister les quatre, si vous souhaitez récupérer automatiquement les types d'événements ajoutés dans les versions futures.

## Voir aussi

- [Heym](./heym-node.md) – Lire les workflows et l'historique des exécutions
- [Triggers](../reference/triggers.md) – Vue d'ensemble de tous les points d'entrée de workflow
- [Loop](./loop-node.md) – Agir une fois par événement dans un lot

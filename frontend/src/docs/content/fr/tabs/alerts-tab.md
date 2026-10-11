# Onglet Alertes

L'onglet **Alertes** permet de définir des conditions de seuil sur une fenêtre temporelle et d'être averti lorsqu'elles sont franchies. Heym enregistre déjà les résultats d'exécution, la durée des exécutions et les dépenses LLM, mais il ne les communique jamais spontanément. Une alerte est la manière de le lui demander.

Chaque alerte est évaluée sur une **fenêtre temporelle** que vous choisissez, jamais sur un événement isolé. Une exécution en échec est du bruit. Douze exécutions en échec en dix minutes constituent un incident.

## Types d'alerte

| Type | La question à laquelle il répond | Provenance du chiffre |
|---|---|---|
| **Seuil d'erreur** | Cette tâche a-t-elle échoué plus de N fois dans la fenêtre ? | Lignes de l'[Historique des exécutions](../reference/execution-history.md) avec un statut d'erreur |
| **Durée de Workflow** | Les exécutions sont-elles devenues plus lentes que prévu dans la fenêtre ? | Temps d'exécution, agrégé en max, moyenne ou 95e percentile |
| **Coût en Tokens / USD** | Les dépenses ont-elles dépassé un budget dans la fenêtre ? | [Traces LLM](./traces-tab.md) plus la table des coûts LLM |
| **Nombre d'exécutions** | Cette tâche s'est-elle exécutée bien plus souvent que prévu ? | Nombre de lignes de l'historique des exécutions |

### Seuil d'erreur

Compte les exécutions en échec sur la fenêtre et se déclenche lorsque le compte atteint votre seuil. Comme il compte sur une fenêtre plutôt que de s'accrocher à chaque échec, une erreur transitoire isolée ne vous alertera pas.

### Durée de Workflow

Mesure la durée d'exécution dans la fenêtre. Choisissez **max** (l'exécution la plus lente), **moyenne** ou **p95**. La valeur p95 utilise le même calcul de percentile que l'[onglet Analytique](./analytics-tab.md), de sorte que l'alerte et le graphique de latence ne se contredisent jamais sur la même fenêtre.

**Nombre minimum d'exécutions dans la fenêtre** garantit la pertinence. L'exécution la plus lente dans une fenêtre presque vide n'est que cette seule exécution ; fixer un minimum de, disons, 3 empêche l'alerte de se déclencher sur du bruit.

### Coût en Tokens / USD

Additionne les dépenses LLM sur la fenêtre, soit en total de tokens, soit en dollars US. Les montants en dollars sont résolus via la même table de tarification que celle utilisée par l'[onglet Traces](./traces-tab.md) et la [Table des coûts LLM](./datatable-tab.md#llm-cost-table-system-table), de sorte qu'une alerte de coût et la page des coûts concordent toujours.

Lorsque la portée couvre tous vos workflows, cela inclut les appels LLM effectués en dehors d'un Workflow, tels que ceux de l'[onglet Chat](./chat-tab.md) et de l'[Assistant IA](../reference/ai-assistant.md). L'usage des agents de codage (Codex, OpenCode) n'est pas inclus.

Les modèles sans ligne de tarification sont signalés dans le contexte de l'alerte comme non tarifés plutôt que silencieusement comptés comme zéro.

### Nombre d'exécutions

Compte les exécutions de tout statut dans la fenêtre. C'est celle qui détecte un Trigger défaillant : un Workflow qui s'exécute normalement 20 fois par heure se met soudain à s'exécuter 2 000 fois. L'enregistrement de déclenchement inclut une répartition par source de Trigger, car c'est généralement la réponse à « pourquoi cela s'est-il produit ».

## Portée

Une alerte surveille soit **un Workflow**, soit **tous vos Workflows**.

« Tous vos Workflows » désigne chaque Workflow auquel le propriétaire de l'alerte peut accéder. Cela ne signifie délibérément pas chaque Workflow de l'instance Heym : les alertes peuvent être partagées, et partager une alerte ne doit pas donner à quelqu'un des chiffres agrégés pour des Workflows qu'il ne peut pas ouvrir.

## L'assistant

La création d'une alerte se déroule en cinq étapes.

1. **Type** — choisissez l'un des quatre ci-dessus.
2. **Portée** — un Workflow, ou tous.
3. **Condition** — la fenêtre temporelle, plus les champs de seuil propres à ce type.
4. **Réponse** — ce qui s'exécute au déclenchement, et à quelle fréquence continuer à vous avertir.
5. **Vérification** — nommez-la, et consultez le backtest.

### Le backtest

L'étape de Vérification répond à la question qui compte vraiment avant d'enregistrer : *au cours des dernières 24 heures, combien de fois cette alerte se serait-elle déclenchée ?*

Elle indique le nombre de déclenchements et la valeur observée la plus élevée par rapport à votre seuil. Si elle indique que la condition se serait déclenchée 400 fois, vous corrigez le seuil avant d'enregistrer plutôt qu'après avoir été alerté. Vous pouvez étendre la période d'analyse à 3 ou 7 jours.

## Rédaction assistée par IA

En haut de la première étape se trouve un champ où vous décrivez ce que vous souhaitez en langage naturel :

> Prévenez-moi si la synchronisation des factures échoue plus de 5 fois en 10 minutes

Heym transforme cela en une définition d'alerte, remplit chaque étape qu'il peut, et avance avec les champs remplis par l'IA signalés, afin que vous confirmiez plutôt que de ressaisir. Une demande complète vous amène directement à la Vérification.

**Une demande partielle vous fait tout de même progresser.** Indiquez seulement « prévenez-moi si ça échoue 5 fois » et vous obtenez une alerte de seuil d'erreur avec le compte renseigné, des valeurs par défaut pour le reste, et l'assistant s'ouvre sur la première étape qui requiert encore votre intervention : en l'occurrence la Portée, car aucun Workflow n'a été nommé. Une note en haut indique ce qui reste à décider. Elle ne bloque jamais Suivant ni Créer.

Il en va de même lorsque le modèle nomme un Workflow auquel vous n'avez pas accès, ou renvoie une condition avec des champs manquants. Les parties pertinentes sont conservées, le reste revient aux valeurs par défaut de ce type d'alerte, et vous ajustez à partir de là. Rien ici ne contourne la validation : les règles propres à l'assistant et l'API revérifient tous deux l'alerte lors de l'enregistrement.

## Comportement de répétition

Une fois qu'une alerte se déclenche, elle entre dans un état déclenché. La suite dépend de votre choix à l'étape 4.

- **Notifier une seule fois, jusqu'à la résolution** (par défaut) — l'alerte se déclenche une fois, puis reste silencieuse tant que la condition est remplie. Lorsque la métrique repasse sous le seuil, l'alerte revient à l'état OK et peut à nouveau se déclencher. La résolution est un changement d'état, non un événement : elle ne crée pas d'enregistrement de déclenchement et n'exécute pas le workflow de notification.
- **Continuer à notifier à intervalle régulier** — l'alerte se déclenche à nouveau toutes les N minutes tant que la condition est remplie.

Ce comportement par défaut existe parce qu'un workflow défaillant vérifié toutes les 60 secondes produirait sinon 60 déclenchements par heure, ce qui conduit immanquablement à désactiver les alertes.

## Exécuter un workflow au déclenchement

L'étape 4 propose trois réponses à la question « que doit-il se passer lorsque l'alerte se déclenche ? » :

- **Créer et assigner un nouveau workflow** (par défaut) — l'enregistrement de l'alerte crée également un workflow nommé *« &lt;nom de l'alerte&gt; notification »* et le lie. Il est livré avec un nœud d'entrée dont les champs correspondent exactement au payload ci-dessous, de sorte que `$alert.body.observed_value` et les autres champs se résolvent immédiatement ; il ne reste plus qu'à attacher le nœud qui délivre le message. Le bouton **Go to workflow** sur la carte de l'alerte permet de l'ouvrir. C'est le comportement par défaut car une alerte qui se déclenche dans le vide passe facilement inaperçue.
- **Choisir un workflow existant** — exécuter un workflow déjà construit.
- **Ne rien faire** — le déclenchement est tout de même enregistré dans l'onglet, mais rien n'est exécuté.

Le payload de l'alerte arrive en tant que corps d'entrée de ce workflow :

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Quel workflow a produit le chiffre

`workflows` est le seul endroit où un workflow apparaît. Cette liste recense chaque workflow ayant contribué à la mesure, chacun avec sa propre `value` — le nombre d'erreurs, le nombre d'exécutions, l'exécution la plus lente en millisecondes ou les dépenses de ce workflow, selon le type d'alerte. La liste est triée par `value`, de la plus élevée à la plus faible, de sorte que `workflows[0]` désigne le principal responsable.

Il s'agit **toujours d'un tableau** : à un seul élément dans le cas d'une portée limitée à un workflow, à plusieurs éléments dans le cas de « tous mes workflows », et vide plutôt que null lorsqu'aucun workflow n'est imputable. Un workflow de notification peut donc le parcourir sans vérification de structure.

Il n'existe délibérément pas de `workflow_id` au singulier. Ce champ décrivait la portée de l'alerte plutôt que la métrique ; il valait donc `null` dans le cas d'une portée système, qui est précisément la situation où la question « quel workflow ? » importe le plus. `observed_value` reste l'agrégat auquel le seuil a été comparé ; les champs `value` par workflow expliquent son origine.

C'est ainsi que les alertes atteignent Slack, l'e-mail, Telegram ou tout autre canal : avec les [nœuds](../reference/node-types.md) dont vous disposez déjà, plutôt qu'avec un système de notification distinct.

Une alerte ne peut pas notifier le workflow qu'elle surveille. Cela créerait une boucle, de manière particulièrement évidente pour une alerte sur le nombre d'exécutions, où chaque notification vient alimenter le compteur qu'elle mesure.

Les exécutions de notification sont des exécutions ordinaires : elles apparaissent donc dans l'[historique des exécutions](../reference/execution-history.md) comme n'importe quelle autre exécution. Un workflow de notification qui échoue est consigné sur le déclenchement, mais n'empêche jamais l'enregistrement du déclenchement lui-même.

Un workflow de notification s'exécute en tant que propriétaire de l'alerte, avec ses identifiants et ses variables globales, exactement comme s'il l'avait exécuté lui-même. Choisir un workflow qu'une autre personne a partagé avec vous n'emprunte pas les identifiants de cette personne. Si le propriétaire perd l'accès au workflow de notification, le déclenchement est tout de même enregistré, mais l'exécution de notification est ignorée.

## Historique des déclenchements

Sous la liste des alertes se trouve l'historique des déclenchements : ce qui s'est déclenché, quand, la valeur observée par rapport au seuil, la fenêtre exacte évaluée et le résultat de la notification.

Acquitter un déclenchement marque la ligne et fait passer le badge de l'alerte de **Firing** à **Acknowledged**. Il s'agit d'une indication vous concernant, vous, et non concernant l'alerte : la condition est toujours remplie, et l'alerte revient d'elle-même à **OK** lorsque la métrique repasse sous le seuil.

Chaque enregistrement conserve le détail des contributions au moment du déclenchement : identifiants des exécutions en échec et messages d'erreur, dépenses par modèle ou répartition par source de trigger. C'est délibéré. La fenêtre est écoulée, et la recalculer ultérieurement peut donner un résultat différent.

Les enregistrements de déclenchement sont conservés pendant 90 jours.

## Interroger le Chat à propos des alertes

L'onglet [Chat](./chat-tab.md) peut répondre à vos questions sur vos alertes :

- « Quelles alertes ai-je ? »
- « Y a-t-il une alerte sur le workflow de facturation ? »
- « Pourquoi l'alerte de coût s'est-elle déclenchée ? »
- « Quand ceci s'est-il déclenché pour la dernière fois ? »

Pour une question du type « pourquoi s'est-elle déclenchée ? », le Chat cite la valeur observée réelle, le seuil et la fenêtre temporelle issus de l'enregistrement du déclenchement, ainsi que le détail des contributions.

## Partage

Les alertes peuvent être partagées avec des utilisateurs individuels ou avec des [équipes](./teams-tab.md). Les personnes avec qui vous partagez une alerte peuvent la voir ainsi que son historique de déclenchements. Seul le propriétaire peut la modifier, la mettre en pause, la supprimer ou la repartager.

### Lorsque l'accès au workflow est supprimé

Une alerte sur un seul workflow continue de lire les métriques d'exécution de ce workflow. Ainsi, la suppression de l'accès d'une personne au workflow détermine également le sort de ses alertes sur celui-ci :

- **La suppression d'un partage utilisateur ou équipe** demande au propriétaire du workflow s'il faut également arrêter les alertes de cet utilisateur ou de cette équipe sur le workflow. L'arrêt est l'option par défaut. Les alertes arrêtées sont mises en pause, et non supprimées, et chacune est enregistrée sous `alert.disable_on_access_revoke` dans le [journal d'audit](../reference/audit.md).
- **La suppression d'un membre d'équipe ou la suppression d'une équipe** arrête toujours les alertes concernées, car la personne effectuant cette modification n'est pas nécessairement le propriétaire du workflow.
- Une alerte n'est arrêtée que lorsque son propriétaire n'a aucun autre chemin d'accès au workflow, tel qu'un partage direct ou une autre équipe.
- La reprise ou le test d'une alerte en pause vérifie à nouveau l'accès du propriétaire. Ainsi, une alerte arrêtée ne peut être réactivée ni utilisée pour lire les métriques du workflow sans accès. Appuyer sur **Reprendre** sans accès affiche une notification expliquant que le propriétaire du workflow doit d'abord le partager à nouveau.

## Gestion des alertes

- **Pause / Reprendre** — une alerte en pause n'est jamais évaluée. La reprise la vérifie immédiatement plutôt que d'attendre le prochain intervalle.
- **Modifier** — les modifications sont validées dans leur ensemble, de sorte qu'une modification partielle ne peut pas laisser l'alerte dans un état invalide.
- **Supprimer** — supprime l'alerte et son historique de déclenchement.

## Voir aussi

- [Onglet Analytics](./analytics-tab.md) — les graphiques à partir desquels ces seuils sont établis
- [Onglet Traces](./traces-tab.md) — l'origine des chiffres de coût LLM
- [Historique des exécutions](../reference/execution-history.md) — les exécutions que mesurent les alertes d'erreur, de durée et de nombre
- [Onglet Chat](./chat-tab.md) — interroger les alertes en langage naturel
- [Équipes](./teams-tab.md) — partager des alertes avec une équipe

# Heym

Le nœud **Heym** lit les données propres à Heym : les workflows auxquels vous avez accès, la structure d'un workflow et son historique d'exécution. C'est ainsi que vous construisez des méta-workflows — inventaires d'instances, synthèses d'exécutions et rapports de santé sur Heym lui-même.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Opérations | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Identifiant | Aucun requis |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `heymOperation` | Select | Lecture à effectuer |
| `heymWorkflowId` | UUID | Définissez-le sur `all` pour `getExecutionHistory` afin de lire tous les workflows accessibles. |
| `heymLimit` | String | Nombre maximal de lignes à renvoyer. **Laissez vide ou saisissez `0` pour tout renvoyer** — c'est la valeur par défaut. Compatible avec les expressions. |
| `heymStatus` | String | Filtre de statut facultatif pour `getExecutionHistory`. Compatible avec les expressions. |
| `heymSinceDays` | String | Fenêtre de recherche facultative en jours pour `getExecutionHistory`. Compatible avec les expressions. |

Le sélecteur de workflow est une liste déroulante avec recherche qui répertorie tous les workflows auxquels vous avez accès. Pour {GEH}, son premier élément est **{AW}**. Pour {GEH}, son premier élément est **{AW}**.

## Périmètre d'accès

Les résultats sont limités au **propriétaire du workflow dans lequel réside le nœud** — et non à la personne ayant lancé l'exécution. L'ensemble visible est constitué :

- des workflows dont le propriétaire est titulaire,
- des workflows partagés directement avec le propriétaire,
- des workflows partagés avec une équipe à laquelle le propriétaire appartient.

Le cadrage par propriétaire est ce qui permet au nœud de se comporter de manière identique, que l'exécution ait été lancée manuellement, par cron, depuis un portail ou par un événement de la plateforme. Un cadrage par acteur ne renverrait rien à chaque exécution non supervisée. C'est la même règle que Heym applique déjà aux identifiants et aux variables globales.

Un workflow auquel vous n'avez pas accès et un workflow inexistant produisent le même message d'erreur, de sorte que le nœud ne peut pas servir à sonder des identifiants de workflow.

## Opérations

### List Workflows

Renvoie tous les workflows accessibles au propriétaire, les plus récemment mis à jour en premier.

| Expression | Description |
|------------|-------------|
| `$nodeLabel.workflows` | Tableau de résumés de workflows |
| `$nodeLabel.workflows[0].id` | UUID du workflow |
| `$nodeLabel.workflows[0].name` | Nom du workflow |
| `$nodeLabel.workflows[0].description` | Description, ou `null` |
| `$nodeLabel.workflows[0].active` | Indique si le workflow est actif |
| `$nodeLabel.workflows[0].folder_id` | UUID du dossier, ou `null` |
| `$nodeLabel.workflows[0].updated_at` | Horodatage ISO de la dernière sauvegarde |
| `$nodeLabel.workflows[0].node_count` | Nombre de nœuds contenus dans le workflow |
| `$nodeLabel.total` | Nombre total accessible **avant** application de la limite |

`total` correspond délibérément au nombre sans limite, afin que `$inventory.total` continue de rapporter la taille réelle même lorsque vous plafonnez les lignes renvoyées. Vider le champ **Limit**, ou le définir à `0`, renvoie tous les workflows — c'est la valeur par défaut.

### Get Workflow

Renvoie l'identité et la forme d'un workflow.

| Expression | Description |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identité du workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Métadonnées du workflow |
| `$nodeLabel.node_count` | Nombre de nœuds |
| `$nodeLabel.nodes` | Tableau de `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Tableau de `{ id, source, target, sourceHandle, targetHandle }` |

`data` correspond à la **configuration complète du nœud** — chaque champ tel qu'il a été sauvegardé. C'est ce qui rend l'audit possible : vous ne pouvez pas analyser un workflow à la recherche d'une clé API que quelqu'un aurait collée dans un champ si le nœud refuse d'afficher ce champ.

Cela n'accorde aucun accès que l'appelant ne possédait pas déjà. Le nœud est limité aux workflows que le propriétaire peut de toute façon ouvrir dans l'éditeur, et les secrets d'identifiants stockés ne s'y trouvent toujours pas : les données de nœud ne contiennent que les **ids** d'identifiants, tandis que les secrets eux-mêmes résident chiffrés dans la table des identifiants.

### Détection de secrets codés en dur

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Fournissez `$detail.nodes` à l'agent et demandez-lui de signaler toute valeur de `data` qui ressemble à une clé ou un token actif. Les champs à surveiller sont ceux en texte libre — `curl` sur les nœuds HTTP, `userMessage` et `systemInstruction` sur les nœuds LLM et Agent, ainsi que les corps d'outils Python — car un id d'identifiant est un UUID inoffensif, mais un `sk-…` collé ne l'est pas.
### Obtenir l'historique des exécutions

Renvoie les entrées de l'historique des exécutions pour un workflow, de la plus récente à la plus ancienne.

| Expression | Description |
|------------|-------------|
| `$nodeLabel.executions` | Tableau des entrées de l'historique |
| `$nodeLabel.executions[0].id` | UUID de l'exécution |
| `$nodeLabel.executions[0].status` | `success`, `error`, etc. |
| `$nodeLabel.executions[0].started_at` | Horodatage ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Durée réelle |
| `$nodeLabel.executions[0].trigger_source` | Ce qui a démarré l'exécution, par exemple `cron` ou `heym_event` |
| `$nodeLabel.executions[0].recovered` | Indique si l'exécution a été récupérée après un crash |
| `$nodeLabel.executions[0].inputs` | Ce que l'exécution a reçu - le payload du trigger ou l'entrée de l'appelant |
| `$nodeLabel.executions[0].outputs` | La sortie du workflow pour cette exécution |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Le workflow auquel appartient l'historique, ou `null` avec **{AW}** |
u `null` avec **{AW}** |
| `$nodeLabel.total` | Nombre total d'exécutions correspondantes **avant** la limite |
| `$nodeLabe| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Avec **{AW}**, le workflow auquel appartient chaque exécution |
l.by_status` | Comptages indexés par statut, par exemple `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Début de la fenêtre, ou `null` pour l'historique complet |

Les entrées contiennent à la fois `inputs` et `outputs` - ce que l'exécution a reçu et ce qu'elle a renvoyé - mais jamais `node_results` : la trace par nœud est la colonne la plus volumineuse de la table et écraserait tout ce qui se trouve en aval. Récupérez une exécution unique via l'API lorsque vous avez besoin de la trace complète.

`total` et `by_status` décrivent toujours l'**intégralité** de l'historique correspondant, même lorsque **Limit** plafonne les entrées renvoyées — vous pouvez ainsi récupérer les cinq exécutions les plus récentes et tout de même rapporter un décompte précis des échecs.

Laissez **Since (days)** vide pour couvrir l'ensemble, **Status filter** vide pour inclure tous les statuts, et **Limit** vide ou à `0` pour renvoyer toutes les entrées.

## Exemple de workflow

**Récapitulatif quotidien des instances**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` étiqueté `inventory`
- **Loop** sur `$inventory.workflows`
- **Heym** `getExecutionHistory` avec `heymWorkflowId` défini sur l'`id` de l'élément de la boucle, `heymSinceDays` à `1` et `heymLimit` à `5`
- **LLM** transforme les exécutions collectées et les comptages de statuts en un résumé lisible

## Remarques

- Aucun identifiant n'est nécessaire ; le nœud lit la même base de données que celle sur laquelle Heym s'exécute.
- **Limit** est le même champ pour les deux opérations de liste, et il signifie la même chose dans les deux cas : vide ou `0` renvoie tout.
- Le nœud accepte une entrée normale et peut être attaché à un nœud Agent en tant qu'outil, afin qu'un agent puisse répondre à des questions sur votre instance Heym — ou l'auditer.
- Les payloads de `getWorkflow` augmentent avec le workflow : les longs prompts et les corps d'outils Python voyagent tous dans `data`.
- Associez-le au [Heym Trigger](./heym-trigger-node.md) pour réagir aux changements de workflow au moment où ils se produisent, plutôt que d'interroger selon une planification.

## Voir aussi

- [Heym Trigger](./heym-trigger-node.md) – Démarrer un workflow à partir d'événements de la plateforme
- [Execute](./execute-node.md) – Exécuter un autre workflow plutôt que de le décrire
- [Loop](./loop-node.md) – Itérer sur la liste de workflows renvoyée

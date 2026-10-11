# Organisation des Workflows

Heym vous permet d'organiser les workflows dans des dossiers, de créer des sous-dossiers et de planifier la suppression des workflows. Consultez l'[onglet Workflows](../tabs/workflows-tab.md) pour un aperçu de l'interface.

## Dossiers et sous-dossiers

Les dossiers forment une arborescence. Chaque dossier possède :

- **Name** – Nom d'affichage
- **Parent** – `parent_id` pointe vers un autre dossier ; `null` signifie racine
- **Workflows** – Les workflows peuvent être déplacés dans des dossiers via `folder_id`

### API

| Endpoint | Objectif |
|----------|---------|
| `GET /folders` | Dossiers racine uniquement |
| `GET /folders/tree` | Arborescence complète (enfants + workflows) |
| `GET /folders/{id}` | Dossier unique avec son contenu |
| `POST /folders` | Créer un dossier (`parent_id` facultatif) |
| `PUT /folders/{id}` | Mettre à jour le nom ou `parent_id` |
| `DELETE /folders/{id}` | Supprimer un dossier (en cascade) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Déplacer un workflow dans un dossier |
| `DELETE /folders/workflows/{workflow_id}/folder` | Retirer un workflow d'un dossier |
| `GET /folders/{id}/export` | Télécharger le dossier et tous ses sous-dossiers au format ZIP |

### Structure de l'arborescence

La réponse de l'arborescence inclut `children` et `workflows` pour chaque dossier. Les workflows partagés peuvent apparaître dans un dossier via `WorkflowShare.folder_id`.

## Partage de workflows

Ouvrez **Share** dans l'éditeur de workflow pour inviter des utilisateurs par e-mail ou partager avec une [équipe](./teams.md). Chaque invitation et chaque partage d'équipe est associé à une permission :

| Permission | Ce que le collaborateur peut faire |
|------------|------------------------------------|
| **Read** | Ouvrir le workflow, l'inspecter, consulter l'historique des exécutions et l'exécuter. L'éditeur s'ouvre en mode lecture seule : l'enregistrement est désactivé et le canvas ne peut pas être modifié. |
| **Write** | Tout ce que permet Read, plus la modification du canvas, des paramètres, du document d'analyse et de la mémoire de l'agent. |

La permission est affichée à côté de chaque entrée dans la boîte de dialogue Share et peut être modifiée à tout moment depuis cette liste déroulante, sans retirer puis rajouter le partage. Lorsqu'un utilisateur accède à un workflow par plusieurs chemins (un partage direct et une ou plusieurs équipes), la permission la plus **élevée** prévaut. Les partages existants avant l'introduction des permissions sont en **Write**, et les clients API qui omettent `permission` obtiennent également **Write**.

Les actions réservées au propriétaire ne dépendent jamais de la permission : la suppression d'un workflow, la restauration ou l'effacement de versions, la suppression de l'historique, la gestion des partages et les [paramètres réservés au propriétaire](#paramètres-réservés-au-propriétaire) ci-dessous restent au propriétaire même pour les collaborateurs en **Write**. Un collaborateur en **Read** qui envoie une modification via l'API (`PUT /api/workflows/{id}`, la note d'analyse, la mémoire de l'agent, la purge du cache) ou via l'AI Assistant reçoit un `403` avec `You have read-only access to this workflow`.

Partager un workflow donne accès au canvas, à l'historique des exécutions et au document d'analyse. Cela ne partage **pas** automatiquement :

- Les **Identifiants** référencés par les nœuds du workflow
- Les **sous-workflows** appelés par les nœuds [Execute](../nodes/execute-node.md) ou les agents

Les destinataires doivent se voir partager ces identifiants et workflows enfants séparément (mêmes utilisateurs ou équipes). Partagez les identifiants depuis l'[onglet Identifiants](../tabs/credentials-tab.md) ; consultez [Partage d'identifiants](./credentials-sharing.md). Partagez chaque sous-workflow depuis la boîte de dialogue de partage de son propre éditeur.

### Paramètres réservés au propriétaire

L'intégralité de la configuration **Run with cURL** reste au propriétaire après le partage. Les collaborateurs peuvent toujours ouvrir la boîte de dialogue et copier la commande générée, mais les contrôles sont en lecture seule.

La modification de l'un de ces éléments par un non-propriétaire est rejetée avec un `403` :

- **Authentication** (`auth_type`) et **Header Key** (`auth_header_key`)
- Le mode **Request Body** (`webhook_body_mode`) et **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) et **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) se comporte différemment : il est entièrement masqué aux collaborateurs, et l'écriture d'un collaborateur est ignorée plutôt que rejetée. L'éditeur affiche le champ masqué, de sorte qu'un `403` à cet endroit casserait un enregistrement ordinaire plutôt que de signaler une attaque.

L'authentification est la raison pour laquelle ce bloc est réservé au propriétaire : `Anonymous` permet à des appelants non authentifiés d'exécuter le workflow, et une exécution sans appelant connecté résout les identifiants et les variables globales en tant que **propriétaire**, et non en tant qu'appelant. Le reste du bloc constitue le contrat de requête publié et les contrôles de coût du propriétaire, c'est pourquoi il suit le même régime.

**On error, run workflow** (`error_workflow_id`) dans le panneau **Properties** au niveau du workflow est réservé au propriétaire pour la même raison : le [workflow d'erreur](./features.md#error-workflow) s'exécute avec les identifiants et les variables globales de l'exécution ayant échoué, qui appartiennent au propriétaire pour les exécutions déclenchées et anonymes. Les collaborateurs voient ce paramètre en lecture seule, et l'ajout, le remplacement ou la suppression de celui-ci par un non-propriétaire est rejeté avec un `403`.

La modification du canvas, du nom et de la description n'est pas affectée.
### Tokens d'exécution

Un collaborateur peut générer un token d'exécution pour un workflow partagé avec lui. L'exécution est attribuée à **celui qui a généré le token**, elle utilise donc les identifiants et les variables globales de cet utilisateur, et non ceux du propriétaire. Seul un appel véritablement anonyme — `auth_type: anonymous` sans appelant — s'exécute dans le contexte du propriétaire.

## Planifié pour suppression

Les workflows peuvent être planifiés pour suppression au lieu d'être retirés immédiatement.

- **Champ** : `scheduled_for_deletion` (datetime nullable)
- **Comportement** : lorsqu'il est défini, le workflow passe à `folder_id = null` et apparaît dans la section « Planifié pour suppression ».

### API

| Endpoint | Objectif |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Définir `scheduled_for_deletion`, effacer `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Effacer `scheduled_for_deletion` (restaurer) |

### UI

- **Glisser vers la corbeille** – Déposez les workflows dans la zone « Planifié pour suppression » pour les planifier
- **Restaurer** – Retirer de la planification
- **Supprimer immédiatement** – Icône de corbeille pour une suppression définitive

### Logique de nettoyage

Une tâche cron s'exécute quotidiennement à **23:59** (fuseau horaire configuré). Un workflow n'est supprimé que lorsque :

- **Tous les nœuds d'entrée** (nœuds sans arêtes entrantes, à l'exclusion de sticky/errorHandler) ont `active === false`

Si un nœud d'entrée est encore actif, le workflow est conservé jusqu'à la prochaine exécution.

## UI du tableau de bord

- **Lignes de dossier** – Nouveau dossier, arborescence récursive avec développement/réduction. Chaque dossier comporte une
  description facultative sous son nom et un badge comptant les workflows qu'il contient, sous-dossiers
  inclus.
- **Actions de dossier** – Nouveau sous-dossier, Renommer, Changer l'icône, Télécharger au format ZIP et Supprimer figurent en ligne
  sur chaque ligne de dossier ; le menu contextuel (clic droit) propose le même ensemble, et les téléphones affichent un unique
  bouton de menu.
- **Zone principale** – Workflows racine (sans dossier, non planifiés) et Planifié pour suppression
- **Aperçu du dépôt sur dossier** – Le glissement d'un workflow met en évidence le dossier ou sous-dossier exact et
  affiche son chemin complet dans un aperçu au format carte. Un dossier réduit se développe après un bref survol.
- **Retour de glissement stable** – La carte source utilise un fantôme de glissement, et la cible de dépôt active reste
  sélectionnée lors du défilement ou du passage sur des contrôles au sein du même dossier.
- **Vérification de destination** – Le dossier actuel est affiché comme **Déjà dans le dossier** et n'accepte
  pas un déplacement redondant.
- **Autres zones de dépôt** – La racine et « Planifié pour suppression » se mettent en évidence lorsqu'elles peuvent accepter le
  workflow glissé.
- **Dépôt ZIP** – Déposez un fichier ZIP sur la zone des workflows pour importer une structure de dossiers au niveau racine

## Voir aussi

- [Onglet Workflows](../tabs/workflows-tab.md) – Créer et gérer des workflows
- [Partage d'identifiants](./credentials-sharing.md) – Partager des identifiants avec les collaborateurs d'un workflow
- [Équipes](./teams.md) – Partager des workflows et des identifiants avec des équipes
- [Concepts fondamentaux](../getting-started/core-concepts.md) – Workflows, nœuds et exécution
- [Structure des workflows](./workflow-structure.md) – Format JSON des workflows
- [Triggers](./triggers.md) – Nœuds d'entrée et points d'entrée

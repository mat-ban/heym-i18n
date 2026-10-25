# Nœud GitHub

Le nœud **GitHub** ajoute des opérations REST GitHub natives à un workflow, de manière similaire aux nœuds GitHub multi-opérations que vous connaissez peut-être dans des outils comme n8n.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | GitHub |
| Sortie | `$nodeLabel.*` |

## Opérations prises en charge

Le nœud propose actuellement 40 actions :

| Ressource | Actions |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Identifiant

Créez un identifiant **GitHub** dans l'[onglet Identifiants](../tabs/credentials-tab.md) avec :

- Un token d'accès personnel
- Une URL de base complète de l'API REST (facultative) pour GitHub Enterprise Server

Laissez l'URL de base vide pour GitHub.com. Les PAT à granularité fine sont recommandés.

Pour GitHub Enterprise Server, saisissez l'endpoint REST API complet incluant `/api/v3`, par exemple
`https://github.example.com/api/v3`. Ne saisissez pas uniquement la racine de l'interface web
(`https://github.example.com`).

Si vous utilisez GitHub Enterprise Server et modifiez ultérieurement l'identifiant pour renouveler le token, laisser
`base_url` vide préserve l'endpoint Enterprise existant. Ne saisissez une nouvelle URL que si vous souhaitez
modifier cet endpoint.

## Champs courants

La plupart des opérations utilisent :

- **Owner** – Propriétaire du dépôt, nom de l'organisation ou nom d'utilisateur
- **Repository** – Nom du dépôt

`List Organization Repositories` ne requiert que **Owner** (le nom de l'organisation) et n'utilise pas le champ repository.

`List User Repositories` ne requiert que **Owner** (le nom d'utilisateur) et n'utilise pas le champ repository.

`Get User Repositories` reprend l'action User → Get Repositories de n8n. `Get User Issues` renvoie
par défaut les issues assignées à l'utilisateur GitHub authentifié. Définissez **Mentioned Filter** sur une valeur
non vide pour renvoyer à la place les issues mentionnant l'utilisateur authentifié. Cette action prend également en charge
les filtres state, labels, updated-since, sort, direction et per-page. `Invite User` requiert une
organisation et une adresse e-mail et n'utilise ni Owner ni Repository.

## Repository

Les opérations Repository incluent les métadonnées, le contenu de licence détecté, le profil de santé communautaire et
les statistiques de trafic. `List Popular Paths for Repository` et
`List Top Referrers for Repository` renvoient les principales entrées de trafic GitHub des 14 derniers jours et
requièrent un accès push d'administration au dépôt.

`List Issues` prend en charge les filtres facultatifs assignee, creator, mentioned user, labels séparés par des virgules,
updated-since timestamp, sort et direction. `List Pull Requests` prend en charge les contrôles state, sort,
direction et per-page.

`Get Repository Issues` et `Get Repository Pull Requests` exposent les mêmes API que leurs équivalents List
sous des noms d'actions Repository explicites compatibles n8n.

### Récupérer les métadonnées du dépôt

`Get Repository` stocke la réponse complète de GitHub dans `$github.repository` et expose également
`$github.full_name`, `$github.default_branch`, `$github.private` et `$github.url`.

Le payload du dépôt inclut généralement :

- Identité et propriété : ID, nom, nom complet, description, owner et visibilité
- État du dépôt : private, fork, archived, disabled et default branch
- URLs : page GitHub, API, clone, SSH et URLs Git
- Activité et taille : horodatages de création, de mise à jour et de push, taille, stars, watchers, forks, subscribers et open issues
- Fonctionnalités : issues, projects, wiki, Pages, discussions, topics, language et homepage
- Licence, paramètres de merge, permissions de l'appelant, paramètres de sécurité et métadonnées fork parent/source lorsqu'elles sont disponibles

Certains champs administratifs, de permission, de merge et de sécurité dépendent des permissions de dépôt
de l'identifiant.

Exemple :

- Owner : `heymrun`
- Repository : `heym`

## Issues

Les opérations Issue prennent en charge les champs title/body et des champs facultatifs de type tableau JSON pour les labels et les assignees.

`List Issues` renvoie uniquement les issues du dépôt. Les pull requests sont exclues ; utilisez `List Pull Requests` pour les résultats PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```
### Sémantique des champs de Edit Issue

Pour `Edit Issue`, seuls les champs que vous définissez explicitement sont envoyés à GitHub :

- **State** – Choisissez `Don't change`, `Open` ou `Closed`. Laissez non défini pour conserver l'état actuel.
- **State Reason** – Définissez éventuellement `Completed`, `Not Planned`, `Duplicate` ou `Reopened`.
- **Title / Body** – Laissez vide pour conserver la valeur actuelle.
- **Labels / Assignees** – Laissez le champ vide pour conserver la valeur actuelle. Utilisez `[]` pour effacer tous les labels ou assignees. Utilisez un tableau JSON tel que `["bug"]` pour les remplacer.

`Edit Issue` nécessite au moins un champ à modifier lors de l'exécution. Si vous ne fournissez qu'un numéro d'issue, l'exécution échoue avec une erreur de validation provenant de la couche API GitHub.

## Lock Issue

`Lock Issue` accepte un **Lock reason** facultatif. Lorsqu'il est fourni, il doit correspondre à l'une des valeurs prises en charge par GitHub :

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Laissez la raison vide pour verrouiller sans raison spécifique.

## Pull Requests

Create PR nécessite :

- Title
- Head branch
- Base branch
- Body facultatif
- Mode draft facultatif

## Pull Request Reviews

Les opérations de review correspondent à l'API de pull request review de GitHub :

| Opération | Champs requis | Champs facultatifs |
|-----------|-----------------|-----------------|
| `Create Review` | Numéro de pull request, event | Body, commit ID |
| `Get Review` | Numéro de pull request, review ID | — |
| `List Reviews` | Numéro de pull request | Per page |
| `Update Review` | Numéro de pull request, review ID, body | — |

`Create Review` prend en charge `Approve`, `Request Changes`, `Comment` et `Pending`.
Le body est requis pour `Request Changes` et `Comment`. Lorsque Commit ID est vide, GitHub
examine le dernier commit de la pull request.

## Releases

| Opération | Champs requis à l'exécution | Souvent facultatifs |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` peut définir explicitement `draft` / `prerelease` sur `true` ou `false`.

## Workflows

Les opérations Workflow prennent en charge :

- Le listage des workflows d'un dépôt
- L'obtention d'un workflow par ID numérique ou par nom de fichier de workflow
- L'activation ou la désactivation d'un workflow
- La lecture de l'utilisation facturable des workflows par système d'exploitation du runner
- Le dispatch d'un workflow avec une ref ou une branche plus un objet JSON inputs facultatif

GitHub est en cours de fermeture de l'endpoint `Get Workflow Usage`. Les Workflows utilisant
cette opération devront peut-être migrer lorsque GitHub supprimera l'endpoint.

`Dispatch Workflow` accepte les deux formes de réponse GitHub : l'ancienne `204 No Content` et la plus récente
`200` contenant `workflow_run_id`, `run_url` et `html_url`.

`Dispatch Workflow and Wait` dispatche le workflow et interroge l'exécution jusqu'à ce que son statut soit
`completed`. Configurez le timeout et l'intervalle d'interrogation en secondes. Heym utilise
`workflow_run_id` lorsque GitHub renvoie la réponse `200` plus récente. Pour la réponse traditionnelle `204 No
Content`, Heym découvre l'exécution `workflow_dispatch` nouvellement créée pour le workflow et la ref sélectionnés, puis attend cette exécution.

## File Contents

`Get File` lit un fichier de dépôt via l'API contents de GitHub et décode le contenu texte lorsqu'il est disponible. Les fichiers binaires et le contenu non UTF-8 peuvent renvoyer des métadonnées sans champ `content` décodé.

`List Files` renvoie les entrées de répertoire depuis l'API contents du dépôt pour un chemin de dossier donné et une ref facultative. Laissez **Directory Path** vide pour lister la racine du dépôt.

`Create or Update File` écrit du contenu texte à un chemin de dépôt en utilisant :

- File path
- Commit message
- File content
- Branche facultative

`Delete File` supprime un chemin de dépôt en utilisant un commit message et une branche facultative. Si le fichier existe, Heym récupère automatiquement le SHA actuel avant de le supprimer.

Si le fichier existe déjà, Heym récupère automatiquement le SHA actuel avant de le mettre à jour.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` et `Get User Repositories` prennent en charge
**Per Page** (1–100). Heym demande une page de résultats ; il n'existe pas de champ `page` pour récupérer
des pages supplémentaires dans la même opération.

### Return all pages

Activez **Return all pages** pour qu'une exécution parcoure toutes les pages, en commençant à **Cursor** s'il est défini. Chaque requête demande 100 éléments, quelle que soit la valeur de **Per Page**. Le nœud s'arrête après environ 1 000 éléments (ou 100 requêtes) : les objets issue pèsent environ 6 Ko chacun, une limite plus élevée produirait des sorties de nœud très volumineuses. S'il s'arrête plus tôt, il renvoie ce qu'il a obtenu avec `has_more: true` et un `next_cursor` au lieu de lever une erreur, et vous pouvez continuer en transmettant ce curseur à l'exécution suivante. L'arrêt du workflow ou l'atteinte de son délai d'expiration interrompt la récupération entre deux pages.

## Sortie

La forme exacte dépend de l'opération sélectionnée. Les champs courants incluent :

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Remplacez `github` par le libellé de votre nœud.

## Remarques

- Les labels et les assignees doivent être des tableaux JSON valides lorsqu'ils sont fournis.
- Les inputs de dispatch de Workflow doivent être un objet JSON valide lorsqu'ils sont fournis.
- `Edit Issue` utilise `state` uniquement lorsque vous le définissez explicitement ; laissez-le non défini pour conserver l'état actuel de l'issue.
- Les permissions de l'API GitHub dépendent des scopes du token ou des permissions fines de repository que vous accordez.

## Voir aussi

- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants GitHub
- [Intégrations tierces](../reference/integrations.md) – Configuration des identifiants GitHub et `base_url` Enterprise
- [Nœud Agent](./agent-node.md) – Utiliser les identifiants GitHub avec `@modelcontextprotocol/server-github`
- [Types de nœuds](../reference/node-types.md) – Catalogue complet des nœuds

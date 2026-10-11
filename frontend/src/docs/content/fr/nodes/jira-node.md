# Nœud Jira

Le nœud **Jira** connecte les workflows à l'API REST Jira pour l'automatisation des projets, tickets, commentaires, pièces jointes, utilisateurs, notifications et transitions. L'opération par défaut est **Search Issues**.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Jira (Cloud email/token API ou Data Center nom d'utilisateur/mot de passe, URL de base, mode de déploiement, version d'API REST facultative) |
| Sortie | `$nodeLabel.*` |

## Identifiant

Créez un identifiant **Jira** dans l'[onglet Identifiants](../tabs/credentials-tab.md). Les clés de configuration stockées sont `email`, `api_token`, `base_url`, `deployment` et, en option, `api_version`. Pour Jira Cloud, `email` stocke l'adresse e-mail du compte Atlassian et `api_token` stocke le token API Atlassian. Pour Jira Data Center / Server, ces mêmes clés stockent le nom d'utilisateur et le mot de passe pour l'authentification Basic. Consultez [Intégrations tierces](../reference/integrations.md#jira) pour les étapes de configuration.

| Champ | Clé de configuration | Description |
| --- | --- | --- |
| Jira Email / Username | `email` | Adresse e-mail du compte Atlassian pour Jira Cloud, ou nom d'utilisateur Jira Data Center / Server |
| API Token / Password | `api_token` | Token API Atlassian pour Jira Cloud, ou mot de passe Jira Data Center / Server pour l'authentification Basic |
| Base URL | `base_url` | URL du site Jira, par exemple `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` pour Jira Cloud ou `data_center` pour Jira Data Center / Server |
| REST API Version | `api_version` | Valeur par défaut : `3` pour Jira Cloud. Data Center / Server utilise l'API REST v2 |

Les tokens d'accès personnels et l'authentification Bearer pour Data Center / Server ne sont pas encore pris en charge par l'identifiant Jira.

Utilisez **Test Connection** pour vérifier l'identifiant auprès de l'utilisateur Jira actuel.

## Opérations

| Opération | Champs requis | Sortie |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At (facultatifs) | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At (facultatifs) | `issues`, `count`, `pagination` |
| Get Issue | Issue Key ou ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key ou ID et au moins un champ modifié | `issue`, `key` |
| Delete Issue | Issue Key ou ID | `deleted` |
| Get Issue Changelog | Issue Key ou ID ; Limit, Start At (facultatifs) | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key ou ID, Subject, Text Body | `notified` |
| List Comments | Issue Key ou ID ; Limit, Start At (facultatifs) | `comments`, `count`, `pagination` |
| Create Comment | Issue Key ou ID, Comment Body | `comment` |
| Get Comment | Issue Key ou ID, Comment ID | `comment` |
| Update Comment | Issue Key ou ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key ou ID, Comment ID | `deleted` |
| Add Attachment | Issue Key ou ID, Filename, contenu Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID ; Include Binary (facultatif) | `attachment` |
| List Attachments | Issue Key ou ID ; Limit, Start At, Include Binary (facultatifs) | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key ou ID | `transitions`, `count` |
| Transition Issue | Issue Key ou ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Les champs texte compatibles avec les expressions prennent en charge les [expressions](../reference/expression-dsl.md) telles que `$input.text`. `jiraIncludeBinary` est un commutateur booléen qui ne prend pas en charge les expressions, mais il peut être marqué comme fourni par l'agent lorsque le nœud Jira est attaché à une poignée d'outil Agent.
## Émission et mise à jour des champs

- **Project Key** est la clé courte du projet, telle que `ENG`. Utilisez List Projects pour découvrir les clés.
- **Issue Key or ID** accepte des clés telles que `ENG-123` ou des ID numériques d'issue. Utilisez Search Issues ou List Projects pour découvrir les valeurs.
- **Transition ID** provient de List Transitions. Chaque objet de transition inclut un champ `id`.
- **Comment ID** et **Attachment ID** proviennent de List Comments, List Attachments ou des réponses précédentes de création/récupération.
- **Account ID / Username** correspond à la valeur `accountId` de Jira Cloud ou au nom d'utilisateur de Jira Data Center / Server. Get Myself ou Get User peuvent vous aider à le découvrir.
- La **description** de l'issue et le texte du **body** d'un commentaire sont envoyés au format Atlassian Document Format sur l'API REST v3 ; lorsque le déploiement des identifiants est Data Center / Server, ils sont envoyés en texte brut. En v3, les caractères de nouvelle ligne deviennent des paragraphes distincts.
- **Get Issue Changelog** utilise l'endpoint paginé de changelog de Jira Cloud. Pour Data Center / Server, il lit les données de changelog étendues de l'issue et applique l'offset/limit configuré aux historiques retournés.
- Sur **Update Issue**, laissez les champs optionnels vides pour préserver leurs valeurs actuelles.
- Définissez **Description** ou **Assignee Account ID / Username** sur `null` lors de la mise à jour pour effacer ces champs. Les labels ne peuvent pas être effacés avec `null`.
- **Recipients JSON** sur Notify Issue a pour valeur par défaut `{"assignee":true}` lorsqu'il est omis. Les clés courantes incluent `assignee`, `reporter`, `watchers` et `voters` (par exemple `{"assignee":true,"watchers":true}`).
- **Add Attachment** accepte du contenu base64 brut ou une data URL et est limité par le paramètre de taille de fichier de la plateforme (99 Mo par défaut).

## Pagination

- **Search Issues** utilise la pagination par curseur via `jiraNextPageToken` pour Jira Cloud. Lisez `pagination.nextPageToken` de l'exécution précédente et transmettez-le au nœud Search Issues suivant.
- **Search Issues** utilise la pagination par offset via `jiraStartAt` pour Jira Data Center / Server. Lisez `pagination.startAt`, `pagination.maxResults` et `pagination.total` pour calculer la page suivante.
- **List Projects**, **Get Issue Changelog**, **List Comments** et **List Attachments** utilisent la pagination par offset avec `jiraLimit` et `jiraStartAt`. Les résultats paginés retournent `pagination.startAt`, `pagination.maxResults`, `pagination.total` et `pagination.isLast`.
- **List Attachments** récupère d'abord toutes les pièces jointes de l'issue, puis découpe le résultat côté client. Les champs de pagination décrivent toujours la page retournée, mais les issues volumineuses peuvent entraîner un coût de récupération supplémentaire.
- **List Transitions** n'utilise pas la pagination.
## Champs clés

| Champ | Utilisé par | Remarques |
| --- | --- | --- |
| `credentialId` | Toutes les opérations | UUID de l'identifiant Jira détenu |
| `jiraOperation` | Toutes les opérations | Valeur par défaut : `searchIssues` |
| `jiraProjectKey` | Create Issue | Clé de projet telle que `ENG` |
| `jiraIssueKey` | Opérations sur les tickets, commentaires, pièces jointes, notifications et transitions | Clé de ticket telle que `ENG-123` ou ID numérique du ticket |
| `jiraIssueType` | Create Issue | Valeur par défaut : `Task` |
| `jiraIssueTypeId` | Create Issue | ID de type de ticket facultatif ; remplace `jiraIssueType` lorsqu'il est défini |
| `jiraSummary` | Create/Update Issue | Requis pour Create Issue |
| `jiraDescription` | Create/Update Issue | Envoyé au format ADF sur REST API v3 ou en texte brut sur REST API v2 ; utilisez `null` lors d'une mise à jour pour effacer la description |
| `jiraJql` | Search Issues | Valeur par défaut : `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Tableau JSON facultatif ou champs de ticket séparés par des virgules ; par défaut `key`, `summary`, `status`, `assignee` et `issuetype` lorsque vide |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId Jira Cloud ou nom d'utilisateur Data Center / Server ; utilisez `null` lors d'une mise à jour pour effacer l'assigné |
| `jiraLabels` | Create/Update Issue | Tableau JSON ou texte séparé par des virgules |
| `jiraCommentBody` | Create/Update Comment | Envoyé au format ADF sur REST API v3 ou en texte brut sur REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID du commentaire Jira |
| `jiraTransitionId` | Transition Issue | À découvrir avec List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID de la pièce jointe Jira |
| `jiraAttachmentFilename` | Add Attachment | Nom du fichier téléversé |
| `jiraAttachmentBase64` | Add Attachment | Contenu base64 brut ou data URL ; soumis à la limite de taille de fichier |
| `jiraAttachmentMimeType` | Add Attachment | Type MIME facultatif ; déduit du nom de fichier lorsqu'il est vide |
| `jiraIncludeBinary` | Get/List Attachment | Bascule booléenne ; ajoute `content_base64` lorsqu'elle est activée |
| `jiraNotifySubject` | Notify Issue | Objet de notification requis |
| `jiraNotifyTextBody` | Notify Issue | Corps de notification en texte brut requis |
| `jiraNotifyHtmlBody` | Notify Issue | Corps HTML facultatif |
| `jiraNotifyTo` | Notify Issue | Destinataires au format JSON ; par défaut `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId Jira Cloud ou nom d'utilisateur Data Center / Server |
| `jiraUserEmail` | Create User | Adresse e-mail du nouvel utilisateur |
| `jiraUsername` | Create User | Nom d'utilisateur Data Center / Server facultatif ; utilise `jiraUserEmail` par défaut |
| `jiraUserDisplayName` | Create User | Nom d'affichage facultatif |
| `jiraUserProducts` | Create User | Tableau JSON ou clés de produits séparées par des virgules ; Jira Cloud uniquement |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Valeur par défaut : `50` ; plage 1–100 |
| `jiraStartAt` | Search Issues sur Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Index de départ de la pagination par offset |
| `jiraNextPageToken` | Search Issues sur Jira Cloud | Token de curseur issu d'une réponse de recherche précédente |

## Exemples

Créer un ticket à partir d'une entrée en amont :

- Operation : `createIssue`
- Project Key : `ENG`
- Issue Type : `Task`
- Summary : `$input.title`
- Description : `$input.description`
- Labels : `["automation"]`

Mettre à jour un ticket et effacer l'assigné :

- Operation : `updateIssue`
- Issue Key or ID : `ENG-123`
- Summary : `$input.title`
- Assignee Account ID / Username : `null`

Rechercher des tickets avec des champs personnalisés et une pagination par curseur :

- Operation : `searchIssues`
- JQL : `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields : `["key","summary","status"]`
- Limit : `25`
- Next Page Token : `$searchJira.pagination.nextPageToken`

Rechercher des tickets sur Data Center avec une pagination par offset :

- Operation : `searchIssues`
- JQL : `project = ENG ORDER BY updated DESC`
- Limit : `25`
- Start At : `25`

Effectuer une transition sur un ticket après avoir listé les transitions disponibles :

- Operation : `listTransitions`
- Issue Key or ID : `ENG-123`
- Exécutez ensuite **Transition Issue** avec Transition ID : `$listTransitions.transitions[0].id`

Notifier les observateurs d'une mise à jour de ticket :

- Operation : `notifyIssue`
- Issue Key or ID : `ENG-123`
- Subject : `Issue updated`
- Text Body : `$input.text`
- Recipients JSON : `{"assignee":true,"watchers":true}`
## Sortie

Chaque opération réussie définit :

- `$jira.success`
- `$jira.operation`

**Get Myself** expose `user`.

**Les opérations de liste paginée** exposent `count`, un champ de collection et `pagination` :

| Opération | Clé de collection | Forme de pagination |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud : `{ maxResults, nextPageToken, isLast }` ; Data Center : `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** expose `transitions` et `count` sans pagination.

**Les mutations et lectures d'issues** exposent le payload de l'issue Jira ainsi que `key` le cas échéant.

**Comment** get/create/update exposent `comment` ; delete expose `deleted`.

**Transition Issue** expose `transition` sous la forme `{ transitionId }`, ainsi que l'`issue` rafraîchie et `key`.

**Attachment add** expose `attachments` et `count`. **Get Attachment** expose `attachment` ; **List Attachments** expose `attachments`, `count` et `pagination`. Lorsque **Include Binary** est activé, chaque objet attachment peut inclure `content_base64`. Delete expose `deleted`.

**User** get/create exposent `user` ; delete expose `deleted`.

**Notify Issue** expose `notified`.

Modèles d'accès courants :

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Voir aussi

- [Onglet Identifiants](../tabs/credentials-tab.md)
- [Intégrations tierces](../reference/integrations.md#jira)
- [Types de nœuds](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)

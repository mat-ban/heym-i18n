# Nœud Linear

Le nœud **Linear** connecte les workflows à l'API GraphQL de Linear pour l'automatisation des tickets et des espaces de travail.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Identifiant | Clé API personnelle Linear ou OAuth2 |
| Sortie | `$nodeLabel.*` |

## Identifiant

Créez un identifiant **Linear** dans l'[onglet Identifiants](../tabs/credentials-tab.md). Choisissez un mode
d'authentification :

**Clé API personnelle**

1. Dans Linear, ouvrez **Settings → Security & Access → Personal API keys**.
2. Créez une clé avec accès à l'espace de travail que vous souhaitez automatiser.
3. Collez la clé dans un nouvel identifiant Linear dans Heym et utilisez **Test Connection** pour la vérifier.

**OAuth2**

1. Créez une application OAuth Linear.
2. Enregistrez `{FRONTEND_URL}/api/credentials/linear/oauth/callback` comme URI de redirection.
3. Dans Heym, choisissez **OAuth2**, saisissez le Client ID et le Client Secret, puis cliquez sur **Connect**.

Les clés API personnelles et les tokens OAuth agissent en tant qu'utilisateur qui les a créés ou autorisés.

## Opérations

| Opération | Champs requis | Sortie |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit ; After Cursor facultatif | `teams`, `count`, `pageInfo` |
| List Projects | Limit ; After Cursor facultatif | `projects`, `count`, `pageInfo` |
| List Issues | Limit ; Team ID, Project ID, After Cursor facultatifs | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit ; After Cursor facultatif | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID ou identifiant tel que `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID ou identifiant et au moins un champ modifié | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID ou identifiant | `deleted` |
| Add Issue Link | Issue ID ou identifiant, Link URL | `link` |
| Create Comment | Issue ID ou identifiant, Comment Body | `comment` |
| List Comments | Issue ID ou identifiant, Limit ; After Cursor facultatif | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Tous les champs texte prennent en charge les [expressions](../reference/expression-dsl.md).

## Champs de ticket

- **Team ID** et **Project ID** sont des UUID Linear. Utilisez List Teams ou List Projects pour les découvrir.
- **State ID** est l'UUID de l'état de workflow utilisé lors de la création ou de la mise à jour d'un ticket. Utilisez List Workflow States pour le découvrir.
- **Assignee ID** est un UUID d'utilisateur Linear. Utilisez List Team Members pour le découvrir.
- **Priority** accepte les valeurs `0` à `4` : aucune priorité, urgente, élevée, normale et faible.
- Laissez les champs de mise à jour facultatifs vides pour conserver leurs valeurs actuelles.
- Définissez un champ de mise à jour sur `null` pour effacer la description, le projet, l'assigné ou l'état.
- **Link URL** ajoute un lien de pièce jointe externe à un ticket.
- **Comment ID** est l'UUID Linear d'un commentaire existant. Utilisez List Comments pour le découvrir.
- **Parent Comment ID** répond à un commentaire Linear existant lors de la création d'un commentaire.

## Pagination

Les opérations de liste peuvent soit renvoyer une seule page, soit récupérer automatiquement toutes les pages :

- Laissez **Return All** désactivé pour utiliser `Limit` et `After Cursor` manuellement.
- Activez **Return All** pour suivre les curseurs Linear côté serveur, jusqu'à 10 000 résultats.

Les résultats paginés renvoient `pageInfo.hasNextPage` et `pageInfo.endCursor`. Transmettez le curseur dans
**After Cursor** lors de l'exécution suivante du nœud pour récupérer la page suivante lorsque **Return All** est désactivé.

## Exemples

Créer un ticket à partir d'une entrée en amont :

- Operation : `Create Issue`
- Team ID : `team UUID`
- Title : `$input.title`
- Description : `$input.description`
- Priority : `2`

Ajouter un commentaire à un ticket créé :

- Operation : `Create Comment`
- Issue ID : `$createLinearIssue.issue.id`
- Comment Body : `$input.comment`
- Parent Comment ID : facultatif, lors d'une réponse à un autre commentaire

Résoudre un fil de commentaires :

- Operation : `Resolve Comment`
- Comment ID : `$listComments.comments[0].id`

Ajouter un lien externe à un ticket :

- Operation : `Add Issue Link`
- Issue ID : `$createLinearIssue.issue.id`
- Link URL : `$input.url`

Parcourir les membres d'une équipe par pagination :

- Operation : `List Team Members`
- Team ID : `$listTeams.teams[0].id`
- Limit : `50`
- After Cursor : `$listTeamMembers.pageInfo.endCursor` lors de l'exécution suivante lorsque `hasNextPage` est vrai

Découvrir les State ID de workflow avant de mettre à jour un ticket :

- Operation : `List Workflow States`
- Team ID : `$listTeams.teams[0].id`
- Utilisez ensuite `$listStates.states[0].id` comme **State ID** dans **Update Issue**
## Sortie

Chaque opération réussie définit :

- `$linear.success`
- `$linear.operation`

Les opérations de liste exposent également `count` et, le cas échéant, `pageInfo`. Les opérations sur les tickets exposent le payload complet du ticket Linear ainsi que des champs pratiques tels que `identifier` et `url`.
Les mutations de commentaires exposent le payload complet `comment`, à l'exception de Delete Comment, qui expose `deleted` et `entityId`.

## Voir aussi

- [Onglet Identifiants](../tabs/credentials-tab.md)
- [Types de nœuds](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)

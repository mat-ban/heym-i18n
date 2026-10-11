# Nœud Sentry

Utilisez le nœud Sentry pour automatiser les opérations sur les organisations, projets, équipes, issues, événements et releases Sentry depuis un workflow.

## Identifiant

Créez un identifiant **Sentry** avec un token d'authentification. Laissez l'URL de base vide pour Sentry SaaS, ou définissez l'URL racine pour une instance Sentry auto-hébergée.

## Opérations

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` et `createOrganization` ne sont pas exposées car Sentry ne documente pas d'endpoints REST publics pour celles-ci.

## Champs communs

| Champ | Description |
| --- | --- |
| Identifiant | Identifiant Sentry à utiliser |
| Opération | Action Sentry à exécuter |
| Organization Slug | Slug de l'organisation Sentry pour la mise à jour d'organisation et les opérations sur les projets, équipes, issues, événements et releases |
| Project Slug | Slug du projet pour les opérations get/update/delete de projet et les opérations sur les événements ; slug ou ID du projet pour les filtres d'issues |
| Team Slug | Slug de l'équipe pour la création de projet et les opérations update/delete d'équipe |
| Issue ID | ID de l'issue pour les opérations get/update/delete d'issue |
| Event ID | ID de l'événement pour les opérations de recherche d'événement |
| Release Version | Version de la release pour les opérations get/update/delete de release |
| Name | Nom du projet ou de l'équipe pour les opérations de création |
| Slug | Slug optionnel du projet ou de l'équipe pour les opérations de création |
| Platform | Plateforme Sentry optionnelle pour la création de projet |
| Status / Assigned To | Champs de mise à jour d'issue. Au moins l'un des deux est requis pour `updateIssue` |
| Query | Requête de recherche Sentry. Omettez-la pour les issues non résolues, ou définissez-la sur une chaîne vide pour récupérer toutes les issues |
| Limit | Limite de résultats pour les opérations de liste, plafonnée à 1 000 résultats au total |
| Release Projects JSON | Tableau JSON de slugs de projets pour la création de release |
| Release Refs JSON | Tableau JSON d'objets repository/commit pour la création de release |
| Payload JSON | Objet JSON pour les opérations de mise à jour d'organisation, projet, release et équipe |

## Exemples

Lister les issues non résolues :

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

Résoudre une issue :

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Supprimer une issue :

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Créer une release :

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Mettre à jour un projet :

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Sorties

Les opérations de liste renvoient `success`, `operation`, `count`, ainsi que la collection correspondante telle que `organizations`, `projects`, `teams`, `issues`, `events` ou `releases`. Les opérations sur une ressource unique renvoient `organization`, `issue`, `event`, `release`, `project` ou `team`. Les opérations de suppression renvoient la clé de ressource correspondante avec `deleted: true` et les champs d'identification.

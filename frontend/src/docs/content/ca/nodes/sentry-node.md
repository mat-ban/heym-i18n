# Node Sentry

Utilitzeu el node Sentry per automatitzar les operacions d'organització, projecte, equip, incidència, esdeveniment i versió de Sentry des d'un workflow.

## Credencial

Creeu una credencial **Sentry** amb un token d'autenticació. Deixeu el camp Base URL buit per a Sentry SaaS, o establiu l'URL arrel per a una instància de Sentry autoallotjada.

## Operacions

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` i `createOrganization` no s'exposen perquè Sentry no documenta endpoints REST públics per a aquestes operacions.

## Camps comuns

| Camp | Descripció |
| --- | --- |
| Credential | Credencial de Sentry a utilitzar |
| Operation | Acció de Sentry a executar |
| Organization Slug | Slug de l'organització de Sentry per a l'actualització d'organització i les operacions de projecte, equip, incidència, esdeveniment i versió |
| Project Slug | Slug del projecte per a les operacions d'obtenció/actualització/supressió de projecte i d'esdeveniments; slug o ID del projecte per als filtres d'incidències |
| Team Slug | Slug de l'equip per a la creació de projectes i les operacions d'actualització/supressió d'equips |
| Issue ID | ID de la incidència per a les operacions d'obtenció/actualització/supressió d'incidències |
| Event ID | ID de l'esdeveniment per a les operacions de consulta d'esdeveniments |
| Release Version | Versió de la release per a les operacions d'obtenció/actualització/supressió de releases |
| Name | Nom del projecte o de l'equip per a les operacions de creació |
| Slug | Slug opcional del projecte o de l'equip per a les operacions de creació |
| Platform | Plataforma opcional de Sentry per a la creació de projectes |
| Status / Assigned To | Camps d'actualització d'incidències. Cal com a mínim un per a `updateIssue` |
| Query | Consulta de cerca de Sentry. Ometeu-la per a incidències no resoltes, o establiu-la a una cadena buida per obtenir totes les incidències |
| Limit | Límit de resultats per a les operacions de llistat, amb un màxim de 1.000 resultats totals |
| Release Projects JSON | Array JSON de slugs de projectes per a la creació de releases |
| Release Refs JSON | Array JSON d'objectes de repositori/commit per a la creació de releases |
| Payload JSON | Objecte JSON per a les operacions d'actualització d'organització, projecte, release i equip |

## Exemples

Llistar incidències no resoltes:

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

Resoldre una incidència:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Suprimir una incidència:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Crear una release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Actualitzar un projecte:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Sortides

Les operacions de llistat retornen `success`, `operation`, `count` i la col·lecció pertinent, com ara `organizations`, `projects`, `teams`, `issues`, `events` o `releases`. Les operacions sobre un recurs individual retornen `organization`, `issue`, `event`, `release`, `project` o `team`. Les operacions de supressió retornen la clau del recurs pertinent amb `deleted: true` i els camps identificatius.
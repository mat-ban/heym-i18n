# Sentry-node

Gebruik de Sentry-node om Sentry-organisatie-, project-, team-, issue-, event- en release-operaties vanuit een workflow te automatiseren.

## Referentie

Maak een **Sentry**-referentie met een auth-token. Laat de Base URL leeg voor Sentry SaaS, of stel de root-URL in voor een zelfgehoste Sentry-instantie.

## Operaties

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` en `createOrganization` worden niet aangeboden omdat Sentry hiervoor geen publieke REST-endpoints documenteert.

## Algemene velden

| Veld | Beschrijving |
| --- | --- |
| Referentie | Te gebruiken Sentry-referentie |
| Operatie | Uit te voeren Sentry-actie |
| Organization Slug | Sentry-organisatieslug voor organisatie-updates en project-, team-, issue-, event- en release-operaties |
| Project Slug | Projectslug voor project get/update/delete en event-operaties; projectslug of -ID voor issue-filters |
| Team Slug | Teamslug voor projectaanmaak en team update/delete-operaties |
| Issue ID | Issue-ID voor issue get/update/delete-operaties |
| Event ID | Event-ID voor event-opzoekoperaties |
| Release Version | Releaseversie voor release get/update/delete-operaties |
| Naam | Project- of teamnaam voor aanmaakoperaties |
| Slug | Optionele project- of teamslug voor aanmaakoperaties |
| Platform | Optioneel Sentry-platform voor projectaanmaak |
| Status / Assigned To | Issue-updatevelden. Ten minste één is vereist voor `updateIssue` |
| Query | Sentry-zoekopdracht. Laat deze weg voor niet-opgeloste issues, of stel deze in op een lege string om alle issues op te halen |
| Limiet | Resultaatlimiet voor lijstoperaties, beperkt tot 1.000 resultaten in totaal |
| Release Projects JSON | JSON-array van projectslugs voor releaseaanmaak |
| Release Refs JSON | JSON-array van repository/commit-objecten voor releaseaanmaak |
| Payload JSON | JSON-object voor update-operaties op organisatie, project, release en team |

## Voorbeelden

Niet-opgeloste issues weergeven:

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

Een issue oplossen:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Een issue verwijderen:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Een release aanmaken:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Een project bijwerken:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Uitvoer

Lijstoperaties retourneren `success`, `operation`, `count` en de relevante collectie, zoals `organizations`, `projects`, `teams`, `issues`, `events` of `releases`. Operaties op één resource retourneren `organization`, `issue`, `event`, `release`, `project` of `team`. Verwijderoperaties retourneren de relevante resourcesleutel met `deleted: true` en identificerende velden.

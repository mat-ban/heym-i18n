# Sentry Node

Brug Sentry-noden til at automatisere Sentry-organisationer, projekter, teams, issues, events og release-operationer fra et workflow.

## Legitimationsoplysninger

Opret en **Sentry**-legitimationsoplysning med en auth-token. Lad Base URL være tom for Sentry SaaS, eller angiv rod-URL'en for en selvhostet Sentry-instans.

## Operationer

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` og `createOrganization` er ikke tilgængelige, da Sentry ikke dokumenterer offentlige REST-endpoints for disse.

## Fælles Felter

| Felt | Beskrivelse |
| --- | --- |
| Legitimationsoplysninger | Sentry-legitimationsoplysning der skal anvendes |
| Operation | Sentry-handling der skal udføres |
| Organization Slug | Sentry-organisationsslug til organisationsopdatering samt projekt-, team-, issue-, event- og release-operationer |
| Project Slug | Projekt-slug til projekthentning/opdatering/sletning og event-operationer; projekt-slug eller ID til issue-filtre |
| Team Slug | Team-slug til projektoprettelse samt teamopdatering/sletning |
| Issue ID | Issue-ID til issuehentning/opdatering/sletning |
| Event ID | Event-ID til eventopslag |
| Release Version | Release-version til releasehentning/opdatering/sletning |
| Navn | Projekt- eller teamnavn til oprettelsesoperationer |
| Slug | Valgfri projekt- eller team-slug til oprettelsesoperationer |
| Platform | Valgfri Sentry-platform til projektoprettelse |
| Status / Tildelt til | Issue-opdateringsfelter. Mindst et påkrævet til `updateIssue` |
| Forespørgsel | Sentry-søgeforespørgsel. Udelades for uafgjorte issues, eller angiv som tom streng for at hente alle issues |
| Grænse | Resultatgrænse til listeoperationer, maksimalt 1.000 samlede resultater |
| Release Projects JSON | JSON-array af projekt-slugs til releaseoprettelse |
| Release Refs JSON | JSON-array af repository/commit-objekter til releaseoprettelse |
| Payload JSON | JSON-objekt til organisations-, projekt-, release- og teamopdateringer |

## Eksempler

Liste over uafgjorte issues:

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

Afslut et issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Slet et issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Opret en release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Opdater et projekt:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Outputs

Listeoperationer returnerer `success`, `operation`, `count` samt den relevante samling såsom `organizations`, `projects`, `teams`, `issues`, `events` eller `releases`. Enkeltressource-operationer returnerer `organization`, `issue`, `event`, `release`, `project` eller `team`. Sletningsoperationer returnerer den relevante ressource-nøgle med `deleted: true` og identificerende felter.

# Sentry-nod

Använd Sentry-noden för att automatisera Sentry-åtgärder för organisationer, projekt, team, ärenden, händelser och releaser från en workflow.

## Autentiseringsuppgifter

Skapa en **Sentry**-autentiseringsuppgift med en autentiseringstoken. Lämna Base URL tomt för Sentry SaaS, eller ange rot-URL:en för en egenhostad Sentry-instans.

## Åtgärder

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` och `createOrganization` är inte tillgängliga eftersom Sentry inte dokumenterar publika REST-endpoints för dem.

## Gemensamma fält

| Fält | Beskrivning |
| --- | --- |
| Credential | Sentry-autentiseringsuppgift som ska användas |
| Operation | Sentry-åtgärd som ska köras |
| Organization Slug | Sentry-organisationens slug för organisationsuppdatering samt åtgärder för projekt, team, ärenden, händelser och releaser |
| Project Slug | Projektets slug för get/update/delete av projekt samt händelseåtgärder; projektets slug eller ID för ärendefilter |
| Team Slug | Teamets slug för projektskapande samt update/delete av team |
| Issue ID | Ärendets ID för get/update/delete av ärenden |
| Event ID | Händelsens ID för uppslagning av händelser |
| Release Version | Releasens version för get/update/delete av releaser |
| Name | Projektets eller teamets namn för skapandeåtgärder |
| Slug | Valfri slug för projekt eller team vid skapandeåtgärder |
| Platform | Valfri Sentry-plattform för projektskapande |
| Status / Assigned To | Fält för ärendeuppdatering. Minst ett krävs för `updateIssue` |
| Query | Sentry-sökfråga. Utelämna den för oåtgärdade ärenden, eller ange en tom sträng för att hämta alla ärenden |
| Limit | Resultatgräns för liståtgärder, max 1 000 resultat totalt |
| Release Projects JSON | JSON-array med projekt-slugs för releaseskapande |
| Release Refs JSON | JSON-array med repository/commit-objekt för releaseskapande |
| Payload JSON | JSON-objekt för update av organisation, projekt, release och team |

## Exempel

Lista oåtgärdade ärenden:

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

Markera ett ärende som åtgärdat:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Ta bort ett ärende:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Skapa en release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Uppdatera ett projekt:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Utdata

Liståtgärder returnerar `success`, `operation`, `count` samt relevant samling såsom `organizations`, `projects`, `teams`, `issues`, `events` eller `releases`. Åtgärder för enskilda resurser returnerar `organization`, `issue`, `event`, `release`, `project` eller `team`. Borttagningsåtgärder returnerar relevant resursnyckel med `deleted: true` och identifierande fält.

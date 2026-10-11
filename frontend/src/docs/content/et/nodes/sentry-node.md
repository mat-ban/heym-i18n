# Sentry node

Kasutage Sentry node'i, et automatiseerida Sentry organisatsiooni, projekti, meeskonna, issue'de, sündmuste ja release'ide toiminguid workflow'st.

## Mandaat

Looge **Sentry** mandaat autentimistokeniga. Jätke Base URL tühjaks Sentry SaaS-i jaoks või määrake juur-URL isemajutatud Sentry instantsi jaoks.

## Toimingud

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` ja `createOrganization` ei ole välja toodud, kuna Sentry ei dokumenteeri nende jaoks avalikke REST endpoint'e.

## Ühised väljad

| Väli | Kirjeldus |
| --- | --- |
| Credential | Kasutatav Sentry mandaat |
| Operation | Käivitatav Sentry toiming |
| Organization Slug | Sentry organisatsiooni slug organisatsiooni uuendamiseks ning projekti, meeskonna, issue, sündmuse ja release'i toiminguteks |
| Project Slug | Projekti slug projekti get/update/delete ja sündmuse toiminguteks; projekti slug või ID issue filtrite jaoks |
| Team Slug | Meeskonna slug projekti loomiseks ning meeskonna update/delete toiminguteks |
| Issue ID | Issue ID issue get/update/delete toiminguteks |
| Event ID | Sündmuse ID sündmuse otsingu toiminguteks |
| Release Version | Release'i versioon release'i get/update/delete toiminguteks |
| Name | Projekti või meeskonna nimi loomise toiminguteks |
| Slug | Valikuline projekti või meeskonna slug loomise toiminguteks |
| Platform | Valikuline Sentry platvorm projekti loomiseks |
| Status / Assigned To | Issue uuendamise väljad. Vähemalt üks on nõutud `updateIssue` jaoks |
| Query | Sentry otsingupäring. Jätke see lahendamata issue'de jaoks välja või määrake tühjaks stringiks, et hankida kõik issue'd |
| Limit | Tulemuste limiit loendi toiminguteks, ülempiiriks 1000 tulemust kokku |
| Release Projects JSON | JSON-massiiv projekti slug'idest release'i loomiseks |
| Release Refs JSON | JSON-massiiv repositooriumi/commiti objektidest release'i loomiseks |
| Payload JSON | JSON-objekt organisatsiooni, projekti, release'i ja meeskonna uuendamise toiminguteks |

## Näited

Lahendamata issue'de loetlemine:

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

Issue lahendamine:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Issue kustutamine:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Release'i loomine:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Projekti uuendamine:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Väljundid

Loendi toimingud tagastavad `success`, `operation`, `count` ja asjakohase kollektsiooni nagu `organizations`, `projects`, `teams`, `issues`, `events` või `releases`. Üksiku ressursi toimingud tagastavad `organization`, `issue`, `event`, `release`, `project` või `team`. Kustutamise toimingud tagastavad asjakohase ressursi võtme koos `deleted: true` ja identifitseerivate väljadega.

# Sentry mezgls

Izmantojiet Sentry mezglu, lai automatizētu Sentry organizācijas, projekta, komandas, problēmu, notikumu un laidienu darbības no workflow.

## Akreditācijas dati

Izveidojiet **Sentry** akreditācijas datus ar auth token. Atstājiet Base URL tukšu Sentry SaaS videi vai norādiet saknes URL pašmitinātai Sentry instancei.

## Darbības

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` un `createOrganization` nav pieejamas, jo Sentry nedokumentē publiskus REST endpoint tiem.

## Kopīgie lauki

| Lauks | Apraksts |
| --- | --- |
| Credential | Izmantojamie Sentry akreditācijas dati |
| Operation | Izpildāmā Sentry darbība |
| Organization Slug | Sentry organizācijas slug organizācijas atjaunināšanai un projekta, komandas, problēmas, notikuma un laidiena darbībām |
| Project Slug | Projekta slug projekta iegūšanas/atjaunināšanas/dzēšanas un notikuma darbībām; projekta slug vai ID problēmu filtriem |
| Team Slug | Komandas slug projekta izveides un komandas atjaunināšanas/dzēšanas darbībām |
| Issue ID | Problēmas ID problēmas iegūšanas/atjaunināšanas/dzēšanas darbībām |
| Event ID | Notikuma ID notikuma meklēšanas darbībām |
| Release Version | Laidiena versija laidiena iegūšanas/atjaunināšanas/dzēšanas darbībām |
| Name | Projekta vai komandas nosaukums izveides darbībām |
| Slug | Neobligāts projekta vai komandas slug izveides darbībām |
| Platform | Neobligāta Sentry platforma projekta izveidei |
| Status / Assigned To | Problēmas atjaunināšanas lauki. Vismaz viens ir nepieciešams `updateIssue` darbībai |
| Query | Sentry meklēšanas vaicājums. Izlaidiet to neatrisinātām problēmām vai iestatiet to uz tukšu virkni, lai iegūtu visas problēmas |
| Limit | Rezultātu ierobežojums saraksta darbībām, maksimāli 1000 rezultāti kopā |
| Release Projects JSON | JSON masīvs ar projekta slug laidiena izveidei |
| Release Refs JSON | JSON masīvs ar repozitorija/commit objektiem laidiena izveidei |
| Payload JSON | JSON objekts organizācijas, projekta, laidiena un komandas atjaunināšanas darbībām |

## Piemēri

Uzskaitīt neatrisinātās problēmas:

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

Atrisināt problēmu:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Dzēst problēmu:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Izveidot laidienu:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Atjaunināt projektu:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Izvades

Saraksta darbības atgriež `success`, `operation`, `count` un attiecīgo kolekciju, piemēram, `organizations`, `projects`, `teams`, `issues`, `events` vai `releases`. Viena resursa darbības atgriež `organization`, `issue`, `event`, `release`, `project` vai `team`. Dzēšanas darbības atgriež attiecīgo resursa atslēgu ar `deleted: true` un identificējošiem laukiem.

# Sentry csomópont

A Sentry csomópont segítségével automatizálhatja a Sentry szervezeti, projekt-, csapat-, issue-, esemény- és kiadási műveleteit egy workflow-ból.

## Hitelesítési adatok

Hozzon létre egy **Sentry** hitelesítési adatot egy auth tokennel. A Base URL mezőt hagyja üresen Sentry SaaS esetén, vagy adja meg a root URL-t egy saját üzemeltetésű Sentry példányhoz.

## Műveletek

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

A `createIssue` és a `createOrganization` műveletek nem érhetők el, mivel a Sentry nem dokumentál nyilvános REST endpointokat ezekhez.

## Általános mezők

| Mező | Leírás |
| --- | --- |
| Credential | A használandó Sentry hitelesítési adat |
| Operation | A futtatandó Sentry művelet |
| Organization Slug | Sentry szervezet slug a szervezetfrissítéshez, valamint a projekt-, csapat-, issue-, esemény- és kiadási műveletekhez |
| Project Slug | Projekt slug a projekt get/update/delete és eseményműveletekhez; projekt slug vagy ID az issue-szűrőkhöz |
| Team Slug | Csapat slug a projekt létrehozásához, valamint a csapat update/delete műveletekhez |
| Issue ID | Issue ID az issue get/update/delete műveletekhez |
| Event ID | Esemény ID az eseménykeresési műveletekhez |
| Release Version | Kiadási verzió a release get/update/delete műveletekhez |
| Name | Projekt- vagy csapatnév a létrehozási műveletekhez |
| Slug | Opcionális projekt- vagy csapat slug a létrehozási műveletekhez |
| Platform | Opcionális Sentry platform a projekt létrehozásához |
| Status / Assigned To | Issue frissítési mezők. Az `updateIssue` művelethez legalább az egyik megadása kötelező |
| Query | Sentry keresési lekérdezés. Hagyja ki a megoldatlan issue-khoz, vagy állítsa üres stringre az összes issue lekéréséhez |
| Limit | Eredménylimit a listaműveletekhez, legfeljebb 1 000 összesített találat |
| Release Projects JSON | Projekt slugok JSON tömbje a kiadás létrehozásához |
| Release Refs JSON | Repository/commit objektumok JSON tömbje a kiadás létrehozásához |
| Payload JSON | JSON objektum a szervezet-, projekt-, kiadás- és csapatfrissítési műveletekhez |

## Példák

Megoldatlan issue-k listázása:

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

Issue megoldása:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Issue törlése:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Kiadás létrehozása:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Projekt frissítése:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Kimenetelek

A listaműveletek a `success`, `operation`, `count` értékeket, valamint a megfelelő gyűjteményt adják vissza, például `organizations`, `projects`, `teams`, `issues`, `events` vagy `releases`. Az egyes erőforrásokra vonatkozó műveletek az `organization`, `issue`, `event`, `release`, `project` vagy `team` értéket adják vissza. A törlési műveletek a megfelelő erőforráskulcsot adják vissza `deleted: true` értékkel és az azonosító mezőkkel.

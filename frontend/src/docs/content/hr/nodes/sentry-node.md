# Sentry čvor

Koristite Sentry čvor za automatizaciju Sentry operacija nad organizacijama, projektima, timovima, problemima (issues), događajima (events) i izdanjima (releases) unutar workflowa.

## Vjerodajnice

Izradite **Sentry** vjerodajnicu s auth tokenom. Ostavite Base URL praznim za Sentry SaaS ili postavite korijenski URL za self-hosted Sentry instancu.

## Operacije

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` i `createOrganization` nisu izložene jer Sentry ne dokumentira javne REST endpointe za njih.

## Uobičajena polja

| Polje | Opis |
| --- | --- |
| Credential | Sentry vjerodajnica koju treba koristiti |
| Operation | Sentry radnja koju treba izvršiti |
| Organization Slug | Sentry slug organizacije za ažuriranje organizacije te operacije nad projektima, timovima, problemima, događajima i izdanjima |
| Project Slug | Slug projekta za get/update/delete operacije nad projektima i operacije nad događajima; slug ili ID projekta za filtre problema |
| Team Slug | Slug tima za stvaranje projekta te update/delete operacije nad timovima |
| Issue ID | ID problema za get/update/delete operacije nad problemima |
| Event ID | ID događaja za operacije pretraživanja događaja |
| Release Version | Verzija izdanja za get/update/delete operacije nad izdanjima |
| Name | Naziv projekta ili tima za create operacije |
| Slug | Neobavezni slug projekta ili tima za create operacije |
| Platform | Neobavezna Sentry platforma za stvaranje projekta |
| Status / Assigned To | Polja za ažuriranje problema. Za `updateIssue` potrebno je barem jedno |
| Query | Sentry upit za pretraživanje. Izostavite ga za neriješene probleme ili postavite na prazan string za dohvat svih problema |
| Limit | Ograničenje rezultata za list operacije, najviše 1.000 ukupnih rezultata |
| Release Projects JSON | JSON polje slugova projekata za stvaranje izdanja |
| Release Refs JSON | JSON polje objekata repozitorija/commita za stvaranje izdanja |
| Payload JSON | JSON objekt za update operacije nad organizacijom, projektom, izdanjem i timom |

## Primjeri

Popis neriješenih problema:

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

Riješite problem:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Izbrišite problem:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Stvorite izdanje:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Ažurirajte projekt:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Izlazi

List operacije vraćaju `success`, `operation`, `count` i odgovarajuću kolekciju poput `organizations`, `projects`, `teams`, `issues`, `events` ili `releases`. Operacije nad pojedinačnim resursima vraćaju `organization`, `issue`, `event`, `release`, `project` ili `team`. Delete operacije vraćaju odgovarajući ključ resursa s `deleted: true` i poljima za identifikaciju.

# Sentry Vozlišče

Uporabite Sentry vozlišče za avtomatizacijo operacij organizacije, projekta, ekipe, težave, dogodka in izdaje Sentry iz workflow-a.

## Poverilnica

Ustvarite **Sentry** poverilnico z avtentikacijskim tokenom. Pustite Base URL prazen za Sentry SaaS ali nastavite osnovni URL za samostojno gostovan Sentry instanco.

## Operacije

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` in `createOrganization` nista na voljo, ker Sentry ne dokumentira javnih REST endpointov zanje.

## Skupna Polja

| Polje | Opis |
| --- | --- |
| Poverilnica | Sentry poverilnica, ki jo želite uporabiti |
| Operacija | Sentry akcija, ki jo želite izvesti |
| Organization Slug | Sentry organization slug za posodobitev organizacije ter operacije projekta, ekipe, težave, dogodka in izdaje |
| Project Slug | Project slug za pridobitev/posodobitev/izbris projekta in operacije dogodkov; project slug ali ID za filtre težav |
| Team Slug | Team slug za ustvarjanje projekta in posodobitev/izbris ekipe |
| Issue ID | Issue ID za pridobitev/posodobitev/izbris težav |
| Event ID | Event ID za operacije iskanja dogodkov |
| Release Version | Izdajna različica za pridobitev/posodobitev/izbris izdaje |
| Ime | Ime projekta ali ekipe za operacije ustvarjanja |
| Slug | Neobvezni project ali team slug za operacije ustvarjanja |
| Platforma | Neobvezna Sentry platforma za ustvarjanje projekta |
| Status / Dodeljeno | Polja za posodobitev težave. Vsaj eno je obvezno za `updateIssue` |
| Poizvedba | Sentry iskalna poizvedba. Izpustite jo za nerešene težave ali jo nastavite na prazno, da pridobite vse težave |
| Omejitev | Omejitev rezultatov za operacije seznama, omejena na 1.000 skupnih rezultatov |
| Release Projects JSON | JSON tabela project slugov za ustvarjanje izdaje |
| Release Refs JSON | JSON tabela objektov repozitorija/commit za ustvarjanje izdaje |
| Payload JSON | JSON objekt za posodobitev organizacije, projekta, izdaje in ekipe |

## Primeri

Seznam nerešenih težav:

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

Reševanje težave:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Izbris težave:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Ustvarjanje izdaje:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Posodobitev projekta:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Izhodi

Operacije seznama vrnejo `success`, `operation`, `count` in ustrezno zbirko, kot so `organizations`, `projects`, `teams`, `issues`, `events` ali `releases`. Operacije za en vir vrnejo `organization`, `issue`, `event`, `release`, `project` ali `team`. Operacije za izbris vrnejo ustrezno ključno vrednost vira z `deleted: true` in identifikacijskimi polji.

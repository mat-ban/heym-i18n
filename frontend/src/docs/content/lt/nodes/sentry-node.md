# Sentry mazgas

Naudokite Sentry mazgą, kad automatizuotumėte Sentry organizacijos, projekto, komandos, problemos, įvykio ir leidimo operacijas iš workflow.

## Kredencialas

Sukurkite **Sentry** kredencialą su autentifikavimo token. Palikite Base URL tuščią Sentry SaaS atveju arba nustatykite šaknies URL savarankiškai talpinamam Sentry instance.

## Operacijos

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` ir `createOrganization` nėra atskleisti, nes Sentry neskelbia viešųjų REST endpoint'ų jiems.

## Bendri laukai

| Laukas | Aprašymas |
| --- | --- |
| Kredencialas | Naudojama Sentry kredencialas |
| Operacija | Vykdoma Sentry veiksmas |
| Organizacijos Slug | Sentry organizacijos slug organizacijos atnaujinimui ir projekto, komandos, problemos, įvykio bei leidimo operacijoms |
| Projekto Slug | Projekto slug projekto gauti/atnaujinti/ištrinti ir įvykio operacijoms; projekto slug arba ID problemų filtrams |
| Komandos Slug | Komandos slug projekto kūrimo ir komandos atnaujinimo/ištrynimo operacijoms |
| Problemos ID | Problemos ID problemos gauti/atnaujinti/ištrinti operacijoms |
| Įvykio ID | Įvykio ID įvykio paieškos operacijoms |
| Leidimo Versija | Leidimo versija leidimo gauti/atnaujinti/ištrinti operacijoms |
| Pavadinimas | Projekto arba komandos pavadinimas kūrimo operacijoms |
| Slug | Pasirinktinė projekto arba komandos slug kūrimo operacijoms |
| Platforma | Pasirinktinė Sentry platforma projekto kūrimui |
| Statusas / Priskirta | Problemos atnaujinimo laukai. Bent vienas yra privalomas `updateIssue` operacijai |
| Užklausa | Sentry paieškos užklausa. Praleiskite ją neišspręstoms problemoms arba nustatykite kaip tuščią eilutę, kad gautumėte visas problemas |
| Limitas | Rezultatų limitas sąrašų operacijoms, ribojamas iki 1,000 bendrų rezultatų |
| Leidimo Projektai JSON | JSON masyvas su projekto slug'ais leidimo kūrimui |
| Leidimo Refs JSON | JSON masyvas su saugyklos/įsipareigojimo objektais leidimo kūrimui |
| Payload JSON | JSON objektas organizacijos, projekto, leidimo ir komandos operacijų atnaujinimui |

## Pavyzdžiai

Išvardyti neišspręstas problemas:

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

Išspręsti problemą:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Ištrinti problemą:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Sukurti leidimą:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Atnaujinti projektą:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Išvestys

Sąrašų operacijos grąžina `success`, `operation`, `count` ir atitinkamą kolekciją, tokią kaip `organizations`, `projects`, `teams`, `issues`, `events` arba `releases`. Vieno ištekliaus operacijos grąžina `organization`, `issue`, `event`, `release`, `project` arba `team`. Ištrynimo operacijos grąžina atitinkamą ištekliaus raktą su `deleted: true` ir identifikuojančiais laukais.

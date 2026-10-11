# Sentry-solmu

Käytä Sentry-solmun avulla Sentry-organisaatioiden, -projektien, -tiimien, -ongelmien, -tapahtumien ja -julkaisujen automatisointia workflowissa.

## Tunnistetiedot

Luo **Sentry**-tunnistetiedot auth-tokenilla. Jätä Base URL -kenttä tyhjäksi Sentry SaaS -käyttöön tai aseta juuriosoite omassa ympäristössä hostatulle Sentry-instanssille.

## Toiminnot

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` ja `createOrganization` eivät ole käytettävissä, koska Sentry ei dokumentoi niille julkisia REST-endpointteja.

## Yleiset kentät

| Kenttä | Kuvaus |
| --- | --- |
| Tunnistetiedot | Käytettävät Sentry-tunnistetiedot |
| Toiminto | Suoritettava Sentry-toiminto |
| Organisaation slug | Sentry-organisaation slug organisaation päivityksille sekä projektien, tiimien, ongelmien, tapahtumien ja julkaisujen toiminnoille |
| Projektin slug | Projektin slug projektin hakemiselle/päivitykselle/poistolle sekä tapahtumien toiminnoille; projektin slug tai ID ongelmien suodatuksissa |
| Tiimin slug | Tiimin slug projektin luonnille ja tiimin päivitykselle/poistolle |
| Ongelman ID | Ongelman ID ongelman hakemiselle/päivitykselle/poistolle |
| Tapahtuman ID | Tapahtuman ID tapahtuman hakemiselle |
| Julkaisun versio | Julkaisun versio julkaisun hakemiselle/päivitykselle/poistolle |
| Nimi | Projektin tai tiimin nimi luontitoiminnoissa |
| Slug | Valinnainen projektin tai tiimin slug luontitoiminnoissa |
| Alusta | Valinnainen Sentry-alusta projektin luonnille |
| Tila / Vastuuhenkilö | Ongelman päivityskentät. Vähintään yksi vaaditaan `updateIssue`-toiminnossa |
| Hakulauseke | Sentry-hakulauseke. Jätä tyhjäksi ratkaisemattomien ongelmien hakemiselle tai aseta tyhjäksi hakeaksesi kaikki ongelmat |
| Rajaus | Tulosten enimmäismäärä listausoperaatioissa, enintään 1 000 tulosta |
| Julkaisun projektit JSON | JSON-taulukko projektien slugeista julkaisun luontia varten |
| Julkaisun viitteet JSON | JSON-taulukko repository/commit-objekteista julkaisun luontia varten |
| Payload JSON | JSON-objekti organisaation, projektin, julkaisun ja tiimin päivitystoiminnoille |

## Esimerkkejä

Listaa ratkaisemattomat ongelmat:

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

Merkitse ongelma ratkaistuksi:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Poista ongelma:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Luo julkaisu:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Päivitä projekti:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Tulokset

Listausoperaatiot palauttavat `success`, `operation`, `count` sekä asiaankuuluvan kokoelman kuten `organizations`, `projects`, `teams`, `issues`, `events` tai `releases`. Yksittäisten resurssien operaatiot palauttavat `organization`, `issue`, `event`, `release`, `project` tai `team`. Poisto-operaatiot palauttavat asiaankuuluvan resurssiavaimen kentällä `deleted: true` sekä tunnistuskentät.

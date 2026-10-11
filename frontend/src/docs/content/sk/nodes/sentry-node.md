# Uzol Sentry

Uzol Sentry použite na automatizáciu operácií s organizáciami, projektmi, tímami, problémami, udalosťami a vydaniami Sentry z workflowu.

## Prihlasovacie údaje

Vytvorte prihlasovacie údaje typu **Sentry** s autentifikačným tokenom. Pre Sentry SaaS ponechajte Base URL prázdnu, alebo nastavte koreňovú URL pre self-hosted inštanciu Sentry.

## Operácie

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Operácie `createIssue` a `createOrganization` nie sú dostupné, pretože Sentry pre ne nedokumentuje verejné REST endpointy.

## Spoločné polia

| Pole | Popis |
| --- | --- |
| Credential | Prihlasovacie údaje Sentry, ktoré sa majú použiť |
| Operation | Akcia Sentry, ktorá sa má spustiť |
| Organization Slug | Slug organizácie Sentry pre aktualizáciu organizácie a operácie s projektmi, tímami, problémami, udalosťami a vydaniami |
| Project Slug | Slug projektu pre operácie get/update/delete projektu a operácie s udalosťami; slug alebo ID projektu pre filtre problémov |
| Team Slug | Slug tímu pre vytvorenie projektu a operácie update/delete tímu |
| Issue ID | ID problému pre operácie get/update/delete problému |
| Event ID | ID udalosti pre operácie vyhľadávania udalostí |
| Release Version | Verzia vydania pre operácie get/update/delete vydania |
| Name | Názov projektu alebo tímu pre operácie vytvorenia |
| Slug | Voliteľný slug projektu alebo tímu pre operácie vytvorenia |
| Platform | Voliteľná platforma Sentry pre vytvorenie projektu |
| Status / Assigned To | Polia aktualizácie problému. Pre `updateIssue` je vyžadované aspoň jedno z nich |
| Query | Vyhľadávací dopyt Sentry. Vynechajte ho pre nevyriešené problémy, alebo nastavte prázdny reťazec na získanie všetkých problémov |
| Limit | Limit výsledkov pre operácie zoznamu, obmedzený na 1 000 celkových výsledkov |
| Release Projects JSON | JSON pole slugov projektov pre vytvorenie vydania |
| Release Refs JSON | JSON pole objektov repozitár/commit pre vytvorenie vydania |
| Payload JSON | JSON objekt pre operácie update organizácie, projektu, vydania a tímu |

## Príklady

Zoznam nevyriešených problémov:

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

Vyriešenie problému:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Odstránenie problému:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Vytvorenie vydania:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Aktualizácia projektu:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Výstupy

Operácie zoznamu vracajú `success`, `operation`, `count` a príslušnú kolekciu, ako napríklad `organizations`, `projects`, `teams`, `issues`, `events` alebo `releases`. Operácie s jedným zdrojom vracajú `organization`, `issue`, `event`, `release`, `project` alebo `team`. Operácie odstránenia vracajú príslušný kľúč zdroja s `deleted: true` a identifikačnými poľami.

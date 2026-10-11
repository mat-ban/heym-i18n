# Uzel Sentry

Uzel Sentry slouží k automatizaci operací s organizacemi, projekty, týmy, issues, událostmi a releasy v Sentry přímo z workflow.

## Přihlašovací údaje

Vytvořte přihlašovací údaje typu **Sentry** s autentizačním tokenem. Pro Sentry SaaS ponechte Base URL prázdnou, případně nastavte kořenovou URL pro self-hosted instanci Sentry.

## Operace

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Operace `createIssue` a `createOrganization` nejsou dostupné, protože Sentry pro ně nedokumentuje veřejné REST endpointy.

## Společná pole

| Pole | Popis |
| --- | --- |
| Credential | Přihlašovací údaje Sentry, které se mají použít |
| Operation | Akce Sentry, která se má spustit |
| Organization Slug | Slug organizace Sentry pro aktualizaci organizace a operace s projekty, týmy, issues, událostmi a releasy |
| Project Slug | Slug projektu pro operace get/update/delete projektu a operace s událostmi; slug nebo ID projektu pro filtry issues |
| Team Slug | Slug týmu pro vytvoření projektu a operace update/delete týmu |
| Issue ID | ID issue pro operace get/update/delete issue |
| Event ID | ID události pro operace vyhledávání událostí |
| Release Version | Verze release pro operace get/update/delete release |
| Name | Název projektu nebo týmu pro operace vytvoření |
| Slug | Volitelný slug projektu nebo týmu pro operace vytvoření |
| Platform | Volitelná platforma Sentry pro vytvoření projektu |
| Status / Assigned To | Pole pro aktualizaci issue. Pro `updateIssue` je vyžadováno alespoň jedno z nich |
| Query | Vyhledávací dotaz Sentry. Ponechte prázdné pro nevyřešené issues, případně nastavte prázdný řetězec pro načtení všech issues |
| Limit | Limit výsledků pro operace výpisu, maximálně 1 000 výsledků celkem |
| Release Projects JSON | JSON pole slugů projektů pro vytvoření release |
| Release Refs JSON | JSON pole objektů repozitář/commit pro vytvoření release |
| Payload JSON | JSON objekt pro operace update organizace, projektu, release a týmu |

## Příklady

Výpis nevyřešených issues:

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

Vyřešení issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Smazání issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Vytvoření release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Aktualizace projektu:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Výstupy

Operace výpisu vracejí `success`, `operation`, `count` a příslušnou kolekci, jako jsou `organizations`, `projects`, `teams`, `issues`, `events` nebo `releases`. Operace s jedním zdrojem vracejí `organization`, `issue`, `event`, `release`, `project` nebo `team`. Operace mazání vracejí příslušný klíč zdroje s `deleted: true` a identifikačními poli.

# Węzeł Sentry

Węzeł Sentry służy do automatyzacji operacji na organizacjach, projektach, zespołach, zgłoszeniach, zdarzeniach i wydaniach Sentry z poziomu workflow.

## Dane logowania

Należy utworzyć dane logowania **Sentry** z tokenem uwierzytelniającym. Pole Base URL należy pozostawić puste dla Sentry SaaS lub ustawić adres URL katalogu głównego dla samodzielnie hostowanej instancji Sentry.

## Operacje

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Operacje `createIssue` oraz `createOrganization` nie są udostępniane, ponieważ Sentry nie dokumentuje publicznych endpointów REST dla tych operacji.

## Pola wspólne

| Pole | Opis |
| --- | --- |
| Credential | Dane logowania Sentry do użycia |
| Operation | Akcja Sentry do wykonania |
| Organization Slug | Slug organizacji Sentry dla aktualizacji organizacji oraz operacji na projektach, zespołach, zgłoszeniach, zdarzeniach i wydaniach |
| Project Slug | Slug projektu dla operacji get/update/delete projektu oraz operacji na zdarzeniach; slug lub ID projektu dla filtrów zgłoszeń |
| Team Slug | Slug zespołu dla tworzenia projektu oraz operacji update/delete zespołu |
| Issue ID | ID zgłoszenia dla operacji get/update/delete zgłoszenia |
| Event ID | ID zdarzenia dla operacji wyszukiwania zdarzeń |
| Release Version | Wersja wydania dla operacji get/update/delete wydania |
| Name | Nazwa projektu lub zespołu dla operacji tworzenia |
| Slug | Opcjonalny slug projektu lub zespołu dla operacji tworzenia |
| Platform | Opcjonalna platforma Sentry dla tworzenia projektu |
| Status / Assigned To | Pola aktualizacji zgłoszenia. Dla operacji `updateIssue` wymagane jest co najmniej jedno z nich |
| Query | Zapytanie wyszukiwania Sentry. Należy je pominąć dla nierozwiązanych zgłoszeń lub ustawić jako pusty ciąg znaków, aby pobrać wszystkie zgłoszenia |
| Limit | Limit wyników dla operacji listowania, ograniczony do łącznie 1 000 wyników |
| Release Projects JSON | Tablica JSON slugów projektów dla tworzenia wydania |
| Release Refs JSON | Tablica JSON obiektów repozytorium/commita dla tworzenia wydania |
| Payload JSON | Obiekt JSON dla operacji update organizacji, projektu, wydania i zespołu |

## Przykłady

Listowanie nierozwiązanych zgłoszeń:

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

Rozwiązywanie zgłoszenia:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Usuwanie zgłoszenia:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Tworzenie wydania:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Aktualizacja projektu:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Dane wyjściowe

Operacje listowania zwracają `success`, `operation`, `count` oraz odpowiednią kolekcję, taką jak `organizations`, `projects`, `teams`, `issues`, `events` lub `releases`. Operacje na pojedynczych zasobach zwracają `organization`, `issue`, `event`, `release`, `project` lub `team`. Operacje usuwania zwracają odpowiedni klucz zasobu z wartością `deleted: true` oraz polami identyfikującymi.

# Sentry node

Използвайте Sentry node, за да автоматизирате операциите с организации, проекти, екипи, проблеми, събития и releases в Sentry от workflow.

## Удостоверение

Създайте **Sentry** удостоверение с auth token. Оставете Base URL празен за Sentry SaaS или задайте root URL за самостоятелно хоствана Sentry инстанция.

## Операции

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` и `createOrganization` не са налични, тъй като Sentry не документира публични REST endpoints за тях.

## Общи полета

| Поле | Описание |
| --- | --- |
| Credential | Sentry удостоверение за използване |
| Operation | Sentry действие за изпълнение |
| Organization Slug | Sentry organization slug за обновяване на организация и операции с проекти, екипи, проблеми, събития и releases |
| Project Slug | Project slug за get/update/delete на проект и операции със събития; project slug или ID за филтри на проблеми |
| Team Slug | Team slug за създаване на проект и операции за update/delete на екип |
| Issue ID | Issue ID за операции get/update/delete на проблем |
| Event ID | Event ID за операции за търсене на събитие |
| Release Version | Release version за операции get/update/delete на release |
| Name | Име на проект или екип за операции за създаване |
| Slug | Опционален project или team slug за операции за създаване |
| Platform | Опционална Sentry платформа за създаване на проект |
| Status / Assigned To | Полета за обновяване на проблем. Поне едно е задължително за `updateIssue` |
| Query | Sentry search query. Пропуснете го за неразрешени проблеми или го задайте като празен низ, за да извлечете всички проблеми |
| Limit | Лимит за резултати при операции за списък, ограничен до 1 000 общо резултата |
| Release Projects JSON | JSON масив от project slugs за създаване на release |
| Release Refs JSON | JSON масив от repository/commit обекти за създаване на release |
| Payload JSON | JSON обект за операции за обновяване на организация, проект, release и екип |

## Примери

Списък с неразрешени проблеми:

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

Разрешаване на проблем:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Изтриване на проблем:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Създаване на release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Обновяване на проект:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Изходи

Операциите за списък връщат `success`, `operation`, `count` и съответната колекция, като например `organizations`, `projects`, `teams`, `issues`, `events` или `releases`. Операциите с единичен ресурс връщат `organization`, `issue`, `event`, `release`, `project` или `team`. Операциите за изтриване връщат съответния ключ на ресурса със `deleted: true` и идентифициращи полета.

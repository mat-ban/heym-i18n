# Вузол Sentry

Використовуйте вузол Sentry для автоматизації операцій з організаціями, проєктами, командами, інцидентами, подіями та релізами Sentry у межах workflow.

## Облікові дані

Створіть облікові дані **Sentry** з auth token. Залиште Base URL порожнім для Sentry SaaS або вкажіть кореневу URL-адресу для самостійно розгорнутого екземпляра Sentry.

## Операції

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

Операції `createIssue` та `createOrganization` не представлені, оскільки Sentry не документує публічних REST endpoint для них.

## Спільні поля

| Поле | Опис |
| --- | --- |
| Credential | Облікові дані Sentry для використання |
| Operation | Дія Sentry для виконання |
| Organization Slug | Slug організації Sentry для оновлення організації та операцій з проєктами, командами, інцидентами, подіями й релізами |
| Project Slug | Slug проєкту для операцій отримання/оновлення/видалення проєкту та операцій з подіями; slug або ID проєкту для фільтрів інцидентів |
| Team Slug | Slug команди для створення проєкту та операцій оновлення/видалення команди |
| Issue ID | ID інциденту для операцій отримання/оновлення/видалення інциденту |
| Event ID | ID події для операцій пошуку подій |
| Release Version | Версія релізу для операцій отримання/оновлення/видалення релізу |
| Name | Назва проєкту або команди для операцій створення |
| Slug | Необов'язковий slug проєкту або команди для операцій створення |
| Platform | Необов'язкова платформа Sentry для створення проєкту |
| Status / Assigned To | Поля оновлення інциденту. Принаймні одне є обов'язковим для `updateIssue` |
| Query | Пошуковий запит Sentry. Пропустіть його для невирішених інцидентів або встановіть порожній рядок, щоб отримати всі інциденти |
| Limit | Обмеження результатів для операцій списку, максимум 1 000 результатів |
| Release Projects JSON | JSON-масив slug проєктів для створення релізу |
| Release Refs JSON | JSON-масив об'єктів репозиторій/коміт для створення релізу |
| Payload JSON | JSON-об'єкт для операцій оновлення організації, проєкту, релізу та команди |

## Приклади

Отримання списку невирішених інцидентів:

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

Вирішення інциденту:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Видалення інциденту:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Створення релізу:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Оновлення проєкту:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Виходи

Операції списку повертають `success`, `operation`, `count` та відповідну колекцію, як-от `organizations`, `projects`, `teams`, `issues`, `events` або `releases`. Операції з одним ресурсом повертають `organization`, `issue`, `event`, `release`, `project` або `team`. Операції видалення повертають відповідний ключ ресурсу з `deleted: true` та ідентифікувальними полями.

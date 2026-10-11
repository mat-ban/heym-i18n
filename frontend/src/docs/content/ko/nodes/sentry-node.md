# Sentry

Sentry 노드를 사용하면 Workflow에서 Sentry 조직, 프로젝트, 팀, 이슈, 이벤트 및 릴리스 작업을 자동화할 수 있습니다.

## Credential

인증 Token이 포함된 **Sentry** Credential을 생성하십시오. Sentry SaaS의 경우 Base URL을 비워 두고, 자체 호스팅 Sentry 인스턴스의 경우 루트 URL을 설정하십시오.

## Operations

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue`와 `createOrganization`은 Sentry에서 공개 REST Endpoint를 문서화하지 않았기 때문에 제공되지 않습니다.

## Common Fields

| Field | Description |
| --- | --- |
| Credential | 사용할 Sentry Credential |
| Operation | 실행할 Sentry 작업 |
| Organization Slug | 조직 업데이트 및 프로젝트, 팀, 이슈, 이벤트, 릴리스 작업에 사용할 Sentry 조직 Slug |
| Project Slug | 프로젝트 get/update/delete 및 이벤트 작업에 사용할 프로젝트 Slug, 이슈 필터의 경우 프로젝트 Slug 또는 ID |
| Team Slug | 프로젝트 생성 및 팀 update/delete 작업에 사용할 팀 Slug |
| Issue ID | 이슈 get/update/delete 작업에 사용할 이슈 ID |
| Event ID | 이벤트 조회 작업에 사용할 이벤트 ID |
| Release Version | 릴리스 get/update/delete 작업에 사용할 릴리스 버전 |
| Name | 생성 작업에 사용할 프로젝트 또는 팀 이름 |
| Slug | 생성 작업에 사용할 선택적 프로젝트 또는 팀 Slug |
| Platform | 프로젝트 생성 시 사용할 선택적 Sentry 플랫폼 |
| Status / Assigned To | 이슈 업데이트 필드. `updateIssue`의 경우 최소 하나 이상 필요합니다 |
| Query | Sentry 검색 쿼리. 미해결 이슈의 경우 생략하거나, 모든 이슈를 가져오려면 빈 문자열로 설정하십시오 |
| Limit | 목록 작업의 결과 제한으로, 최대 총 1,000개 결과로 제한됩니다 |
| Release Projects JSON | 릴리스 생성에 사용할 프로젝트 Slug의 JSON 배열 |
| Release Refs JSON | 릴리스 생성에 사용할 repository/commit 객체의 JSON 배열 |
| Payload JSON | 조직, 프로젝트, 릴리스, 팀 업데이트 작업에 사용할 JSON 객체 |

## Examples

미해결 이슈 목록 조회:

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

이슈 해결:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

이슈 삭제:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

릴리스 생성:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

프로젝트 업데이트:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Outputs

목록 작업은 `success`, `operation`, `count` 및 `organizations`, `projects`, `teams`, `issues`, `events`, `releases`와 같은 관련 컬렉션을 반환합니다. 단일 리소스 작업은 `organization`, `issue`, `event`, `release`, `project` 또는 `team`을 반환합니다. 삭제 작업은 `deleted: true`와 식별 필드가 포함된 관련 리소스 키를 반환합니다.

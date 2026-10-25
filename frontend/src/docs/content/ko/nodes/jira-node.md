# Jira

**Jira** 노드는 프로젝트, 이슈, 댓글, 첨부 파일, 사용자, 알림, 전환 자동화를 위해 Workflow를 Jira REST API에 연결합니다. 기본 작업은 **Search Issues**입니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | Jira (Cloud 이메일/API token, Data Center 사용자 이름/비밀번호 또는 personal access token, base URL, 배포 모드, 선택적 REST API 버전) |
| 출력 | `$nodeLabel.*` |

## Credential

[Credentials Tab](../tabs/credentials-tab.md)에서 **Jira** credential을 생성하십시오. 저장되는 config 키는 `email`, `api_token`, `base_url`, `deployment`, `auth_mode`, 그리고 선택적 `api_version`입니다. Jira Cloud의 경우 `email`에는 Atlassian 계정 이메일이, `api_token`에는 Atlassian API token이 저장됩니다. Jira Data Center / Server의 경우 동일한 키에 Basic 인증 사용자 이름과 비밀번호가 저장됩니다 또는 `auth_mode: pat`인 경우 `api_token`은 Bearer 토큰으로 전송되는 personal access token을 저장하며 `email`은 사용되지 않습니다. 설정 단계는 [Third-Party Integrations](../reference/integrations.md#jira)를 참조하십시오.

| 필드 | Config 키 | 설명 |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud Atlassian 계정 이메일 또는 Jira Data Center / Server 사용자 이름 |
| 인증 | `auth_mode` | `basic` (기본값) 또는 `pat` (Data Center / Server 전용) |
| API Token / Password / Personal Access Token | `api_token` | Jira Cloud Atlassian API token, Jira Data Center / Server Basic 인증 비밀번호, 또는 `pat` 모드의 Data Center personal access token |
| Base URL | `base_url` | Jira 사이트 URL, 예: `https://your-domain.atlassian.net` |
| Deployment | `deployment` | Jira Cloud의 경우 `cloud`, Jira Data Center / Server의 경우 `data_center` |
| REST API Version | `api_version` | Jira Cloud의 경우 기본값은 `3`입니다. Data Center / Server는 REST API v2를 사용합니다 |

Personal access token은 Jira Data Center / Server 8.14 이상이 필요합니다. 인증 방법을 전환하면 저장된 보안 정보가 지워지므로 전환할 때 새 비밀번호 또는 토큰을 입력하십시오.

**Test Connection**을 사용하여 현재 Jira 사용자에 대해 credential을 검증하십시오.

## 작업

| 작업 | 필수 필드 | 출력 |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | 선택적 Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | 선택적 JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key 또는 ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key 또는 ID 및 최소 하나의 변경된 필드 | `issue`, `key` |
| Delete Issue | Issue Key 또는 ID | `deleted` |
| Get Issue Changelog | Issue Key 또는 ID; 선택적 Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key 또는 ID, Subject, Text Body | `notified` |
| List Comments | Issue Key 또는 ID; 선택적 Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key 또는 ID, Comment Body | `comment` |
| Get Comment | Issue Key 또는 ID, Comment ID | `comment` |
| Update Comment | Issue Key 또는 ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key 또는 ID, Comment ID | `deleted` |
| Add Attachment | Issue Key 또는 ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; 선택적 Include Binary | `attachment` |
| List Attachments | Issue Key 또는 ID; 선택적 Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key 또는 ID | `transitions`, `count` |
| Transition Issue | Issue Key 또는 ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

표현식을 지원하는 텍스트 필드는 `$input.text`와 같은 [expressions](../reference/expression-dsl.md)를 지원합니다. `jiraIncludeBinary`는 boolean 토글이며 표현식을 지원하지 않지만, Jira 노드가 Agent tool handle에 연결된 경우 agent-provided로 표시할 수 있습니다.

## 이슈 및 업데이트 필드

- **Project Key**는 `ENG`와 같은 짧은 프로젝트 키입니다. List Projects를 사용하여 키를 확인하십시오.
- **Issue Key 또는 ID**는 `ENG-123`과 같은 키 또는 숫자 이슈 ID를 허용합니다. Search Issues 또는 List Projects를 사용하여 값을 확인하십시오.
- **Transition ID**는 List Transitions에서 가져옵니다. 각 transition 객체에는 `id` 필드가 포함됩니다.
- **Comment ID**와 **Attachment ID**는 List Comments, List Attachments 또는 이전 create/get 응답에서 가져옵니다.
- **Account ID / Username**은 Jira Cloud `accountId` 값 또는 Jira Data Center / Server 사용자 이름입니다. Get Myself 또는 Get User를 통해 확인할 수 있습니다.
- 이슈 **description**과 댓글 **body** 텍스트는 REST API v3에서 Atlassian Document Format으로 전송됩니다. credential deployment가 Data Center / Server인 경우 일반 텍스트로 전송됩니다. v3에서는 줄바꿈 문자가 별도의 단락이 됩니다.
- **Get Issue Changelog**는 Jira Cloud의 페이지네이션된 changelog endpoint를 사용합니다. Data Center / Server의 경우 확장된 이슈 changelog 데이터를 읽고 반환된 histories에 구성된 offset/limit을 적용합니다.
- **Update Issue**에서 선택적 필드를 비워 두면 현재 값이 유지됩니다.
- 업데이트 시 **Description** 또는 **Assignee Account ID / Username**을 `null`로 설정하면 해당 필드가 지워집니다. Labels는 `null`로 지울 수 없습니다.
- Notify Issue의 **Recipients JSON**은 생략 시 기본값이 `{"assignee":true}`입니다. 일반적인 키에는 `assignee`, `reporter`, `watchers`, `voters`가 있습니다 (예: `{"assignee":true,"watchers":true}`).
- **Add Attachment**는 raw base64 또는 data URL 콘텐츠를 허용하며 플랫폼 파일 크기 설정(기본 99 MB)에 의해 제한됩니다.
## 페이지네이션

- **Search Issues**는 Jira Cloud의 경우 `jiraNextPageToken`을 통한 커서 페이지네이션을 사용합니다. 이전 실행에서 `pagination.nextPageToken`을 읽어 다음 Search Issues 노드로 전달하십시오.
- **Search Issues**는 Jira Data Center / Server의 경우 `jiraStartAt`을 통한 오프셋 페이지네이션을 사용합니다. `pagination.startAt`, `pagination.maxResults`, `pagination.total`을 읽어 다음 페이지를 계산하십시오.
- **List Projects**, **Get Issue Changelog**, **List Comments**, **List Attachments**는 `jiraLimit`과 `jiraStartAt`을 사용하는 오프셋 페이지네이션을 사용합니다. 페이지 결과는 `pagination.startAt`, `pagination.maxResults`, `pagination.total`, `pagination.isLast`를 반환합니다.
- **List Attachments**는 이슈의 모든 첨부 파일을 먼저 가져온 후 클라이언트 측에서 결과를 슬라이스합니다. 페이지네이션 필드는 여전히 반환된 페이지를 설명하지만, 이슈가 클 경우 추가 fetch 비용이 발생할 수 있습니다.
- **List Transitions**는 페이지네이션을 사용하지 않습니다.

## 주요 필드

| 필드 | 사용처 | 비고 |
| --- | --- | --- |
| `credentialId` | 모든 작업 | 소유한 Jira credential UUID |
| `jiraOperation` | 모든 작업 | 기본값은 `searchIssues` |
| `jiraProjectKey` | Create Issue | `ENG`와 같은 프로젝트 키 |
| `jiraIssueKey` | 이슈, 댓글, 첨부 파일, 알림, 전환 작업 | `ENG-123`과 같은 이슈 키 또는 숫자 이슈 ID |
| `jiraIssueType` | Create Issue | 기본값은 `Task` |
| `jiraIssueTypeId` | Create Issue | 선택적 이슈 유형 ID; 설정 시 `jiraIssueType`을 재정의합니다 |
| `jiraSummary` | Create/Update Issue | Create Issue 시 필수 |
| `jiraDescription` | Create/Update Issue | REST API v3에서는 ADF로, REST API v2에서는 일반 텍스트로 전송됩니다; 업데이트 시 설명을 지우려면 `null`을 사용하십시오 |
| `jiraJql` | Search Issues | 기본값은 `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | 선택적 JSON 배열 또는 쉼표로 구분된 이슈 필드; 비어 있으면 기본값은 `key`, `summary`, `status`, `assignee`, `issuetype`입니다 |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId 또는 Data Center / Server 사용자 이름; 업데이트 시 담당자를 지우려면 `null`을 사용하십시오 |
| `jiraLabels` | Create/Update Issue | JSON 배열 또는 쉼표로 구분된 텍스트 |
| `jiraCommentBody` | Create/Update Comment | REST API v3에서는 ADF로, REST API v2에서는 일반 텍스트로 전송됩니다 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira 댓글 ID |
| `jiraTransitionId` | Transition Issue | List Transitions로 확인하십시오 |
| `jiraAttachmentId` | Get/Delete Attachment | Jira 첨부 파일 ID |
| `jiraAttachmentFilename` | Add Attachment | 업로드된 파일 이름 |
| `jiraAttachmentBase64` | Add Attachment | 원시 base64 또는 data URL 콘텐츠; 파일 크기 제한이 적용됩니다 |
| `jiraAttachmentMimeType` | Add Attachment | 선택적 MIME 유형; 비어 있으면 파일 이름에서 추론됩니다 |
| `jiraIncludeBinary` | Get/List Attachment | Boolean 토글; 활성화하면 `content_base64`가 추가됩니다 |
| `jiraNotifySubject` | Notify Issue | 필수 알림 제목 |
| `jiraNotifyTextBody` | Notify Issue | 필수 일반 텍스트 알림 본문 |
| `jiraNotifyHtmlBody` | Notify Issue | 선택적 HTML 본문 |
| `jiraNotifyTo` | Notify Issue | 수신자 JSON; 기본값은 `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId 또는 Data Center / Server 사용자 이름 |
| `jiraUserEmail` | Create User | 새 사용자 이메일 주소 |
| `jiraUsername` | Create User | 선택적 Data Center / Server 사용자 이름; 비어 있으면 `jiraUserEmail`로 대체됩니다 |
| `jiraUserDisplayName` | Create User | 선택적 표시 이름 |
| `jiraUserProducts` | Create User | JSON 배열 또는 쉼표로 구분된 제품 키; Jira Cloud 전용 |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | 기본값은 `50`; 범위 1–100 |
| `jiraStartAt` | Search Issues on Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | 오프셋 페이지네이션 시작 인덱스 |
| `jiraNextPageToken` | Search Issues on Jira Cloud | 이전 검색 응답의 커서 토큰 |

## 예시

업스트림 입력에서 이슈를 생성합니다:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

이슈를 업데이트하고 담당자를 지웁니다:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

사용자 정의 필드와 커서 페이지네이션으로 이슈를 검색합니다:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

오프셋 페이지네이션으로 Data Center에서 이슈를 검색합니다:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

사용 가능한 전환을 나열한 후 이슈를 전환합니다:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- 그런 다음 Transition ID: `$listTransitions.transitions[0].id`로 **Transition Issue**를 실행합니다

이슈 업데이트에 대해 watcher에게 알립니다:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## 출력

모든 성공적인 작업은 다음을 설정합니다:

- `$jira.success`
- `$jira.operation`

**Get Myself**는 `user`를 노출합니다.

**Paginated list 작업**은 `count`, 컬렉션 필드, 그리고 `pagination`을 노출합니다:

| 작업 | 컬렉션 키 | Pagination 형태 |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions**는 pagination 없이 `transitions`와 `count`를 노출합니다.

**Issue 변경 및 조회**는 Jira issue payload와 해당되는 경우 `key`를 노출합니다.

**Comment** get/create/update는 `comment`를 노출하며, delete는 `deleted`를 노출합니다.

**Transition Issue**는 `transition`을 `{ transitionId }` 형태로 노출하며, 갱신된 `issue`와 `key`도 함께 노출합니다.

**Attachment add**는 `attachments`와 `count`를 노출합니다. **Get Attachment**는 `attachment`를 노출하며, **List Attachments**는 `attachments`, `count`, `pagination`을 노출합니다. **Include Binary**가 활성화된 경우 각 attachment 객체에 `content_base64`가 포함될 수 있습니다. Delete는 `deleted`를 노출합니다.

**User** get/create는 `user`를 노출하며, delete는 `deleted`를 노출합니다.

**Notify Issue**는 `notified`를 노출합니다.

일반적인 접근 패턴:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## 관련 항목

- [Credentials 탭](../tabs/credentials-tab.md)
- [서드파티 통합](../reference/integrations.md#jira)
- [노드 유형](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)

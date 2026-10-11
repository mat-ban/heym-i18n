# Linear

**Linear** 노드는 Workflow를 Linear GraphQL API에 연결하여 이슈 및 워크스페이스 자동화를 수행합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | Linear personal API key 또는 OAuth2 |
| 출력 | `$nodeLabel.*` |

## Credential

[Credentials Tab](../tabs/credentials-tab.md)에서 **Linear** credential을 생성하십시오. 다음 중 하나의 인증 모드를 선택하십시오:

**Personal API key**

1. Linear에서 **Settings → Security & Access → Personal API keys**를 여십시오.
2. 자동화하려는 워크스페이스에 대한 접근 권한이 있는 키를 생성하십시오.
3. Heym에서 새 Linear credential에 키를 붙여넣고 **Test Connection**으로 검증하십시오.

**OAuth2**

1. Linear OAuth 애플리케이션을 생성하십시오.
2. `{FRONTEND_URL}/api/credentials/linear/oauth/callback`을 redirect URI로 등록하십시오.
3. Heym에서 **OAuth2**를 선택하고 Client ID와 Client Secret을 입력한 후 **Connect**를 클릭하십시오.

Personal API key와 OAuth token은 이를 생성하거나 인가한 사용자로서 동작합니다.

## Operations

| Operation | 필수 필드 | 출력 |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; 선택 사항 After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; 선택 사항 After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; 선택 사항 Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; 선택 사항 After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID 또는 `ENG-123`과 같은 identifier | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID 또는 identifier 및 최소 하나의 변경 필드 | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID 또는 identifier | `deleted` |
| Add Issue Link | Issue ID 또는 identifier, Link URL | `link` |
| Create Comment | Issue ID 또는 identifier, Comment Body | `comment` |
| List Comments | Issue ID 또는 identifier, Limit; 선택 사항 After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

모든 텍스트 필드는 [expressions](../reference/expression-dsl.md)을 지원합니다.

## Issue 필드

- **Team ID**와 **Project ID**는 Linear UUID입니다. List Teams 또는 List Projects를 사용하여 확인하십시오.
- **State ID**는 이슈를 생성하거나 업데이트할 때 사용되는 workflow-state UUID입니다. List Workflow States를 사용하여 확인하십시오.
- **Assignee ID**는 Linear 사용자 UUID입니다. List Team Members를 사용하여 확인하십시오.
- **Priority**는 `0`부터 `4`까지 허용합니다: no priority, urgent, high, normal, low.
- 선택적 업데이트 필드를 비워 두면 현재 값이 유지됩니다.
- 업데이트 필드를 `null`로 설정하면 description, project, assignee 또는 state를 지웁니다.
- **Link URL**은 이슈에 외부 첨부 링크를 추가합니다.
- **Comment ID**는 기존 댓글의 Linear UUID입니다. List Comments를 사용하여 확인하십시오.
- **Parent Comment ID**는 댓글을 생성할 때 기존 Linear 댓글에 답글을 답니다.

## Pagination

List operations는 한 페이지를 반환하거나 모든 페이지를 자동으로 가져올 수 있습니다:

- **Return All**을 끄면 `Limit`과 `After Cursor`를 수동으로 사용합니다.
- **Return All**을 켜면 Linear cursor를 서버 측에서 따라가며 최대 10,000개의 결과를 가져옵니다.

페이지 단위 결과는 `pageInfo.hasNextPage`와 `pageInfo.endCursor`를 반환합니다. **Return All**이 꺼져 있을 때 다음 페이지를 가져오려면 다음 노드 실행 시 cursor를 **After Cursor**에 전달하십시오.

## 예시

업스트림 입력으로 이슈 생성:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

생성된 이슈에 댓글 추가:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: 선택 사항, 다른 댓글에 답글을 달 때 사용

댓글 스레드 해결:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

이슈에 외부 링크 추가:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

팀 멤버 페이지네이션:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `hasNextPage`가 true일 때 다음 실행에서 `$listTeamMembers.pageInfo.endCursor`

이슈를 업데이트하기 전에 workflow state ID 확인:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- 그런 다음 **Update Issue**에서 `$listStates.states[0].id`를 **State ID**로 사용

## 출력

모든 성공적인 operation은 다음을 설정합니다:

- `$linear.success`
- `$linear.operation`

List operations는 또한 `count`를 노출하며, 해당되는 경우 `pageInfo`도 노출합니다. Issue operations는
완전한 Linear issue payload와 `identifier`, `url`과 같은 편의 필드를 노출합니다.
Comment mutations는 완전한 `comment` payload를 노출하며, Delete Comment는 예외적으로
`deleted`와 `entityId`를 노출합니다.

## 관련 항목

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)

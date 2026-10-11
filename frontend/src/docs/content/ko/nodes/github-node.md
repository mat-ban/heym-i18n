# GitHub

**GitHub** 노드는 워크플로우에 네이티브 GitHub REST 작업을 추가하며, n8n과 같은 도구에서 볼 수 있는 다중 작업 GitHub 노드와 유사합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | GitHub |
| 출력 | `$nodeLabel.*` |

## 지원되는 작업

이 노드는 현재 40개의 액션을 제공합니다:

| 리소스 | 액션 |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credential

[Credentials 탭](../tabs/credentials-tab.md)에서 **GitHub** credential을 생성하십시오. 다음 항목이 필요합니다:

- personal access token
- GitHub Enterprise Server용 선택적 전체 REST API base URL

GitHub.com의 경우 base URL을 비워 두십시오. Fine-grained PAT를 권장합니다.

GitHub Enterprise Server의 경우 `/api/v3`를 포함한 전체 REST API endpoint를 입력하십시오. 예:
`https://github.example.com/api/v3`. 웹 UI 루트만 입력하지 마십시오
(`https://github.example.com`).

GitHub Enterprise Server를 사용 중이며 나중에 credential을 편집하여 token을 교체하는 경우,
`base_url`을 비워 두면 기존 Enterprise endpoint가 유지됩니다. 해당 endpoint를 변경하려는
경우에만 새 URL을 입력하십시오.

## 공통 필드

대부분의 작업에서 다음을 사용합니다:

- **Owner** – Repository 소유자, organization 이름 또는 사용자 이름
- **Repository** – Repository 이름

`List Organization Repositories`는 **Owner**(organization 이름)만 필요로 하며 repository 필드를 사용하지 않습니다.

`List User Repositories`는 **Owner**(사용자 이름)만 필요로 하며 repository 필드를 사용하지 않습니다.

`Get User Repositories`는 n8n의 User → Get Repositories 액션을 그대로 반영합니다. `Get User Issues`는
기본적으로 인증된 GitHub 사용자에게 할당된 issue를 반환합니다. **Mentioned Filter**를 비어 있지 않은
값으로 설정하면 대신 인증된 사용자를 멘션하는 issue를 반환합니다. 또한 state, labels,
updated-since, sort, direction, per-page 필터를 지원합니다. `Invite User`는 organization과
이메일 주소를 필요로 하며 Owner 또는 Repository를 사용하지 않습니다.

## Repository

Repository 작업에는 메타데이터, 감지된 license 내용, 커뮤니티 health profile, 트래픽 인사이트가
포함됩니다. `List Popular Paths for Repository`와
`List Top Referrers for Repository`는 최근 14일간의 GitHub 상위 트래픽 항목을 반환하며
repository administration push 권한이 필요합니다.

`List Issues`는 선택적 assignee, creator, mentioned user, 쉼표로 구분된 labels,
updated-since 타임스탬프, sort, direction 필터를 지원합니다. `List Pull Requests`는 state, sort,
direction, per-page 제어를 지원합니다.

`Get Repository Issues`와 `Get Repository Pull Requests`는 명시적인 n8n 호환 repository 액션 이름으로
해당 List 대응 작업과 동일한 API를 노출합니다.

### Get Repository 메타데이터

`Get Repository`는 GitHub의 전체 응답을 `$github.repository`에 저장하며
`$github.full_name`, `$github.default_branch`, `$github.private`, `$github.url`도 노출합니다.

repository payload에는 일반적으로 다음이 포함됩니다:

- ID 및 소유권: ID, name, full name, description, owner, visibility
- Repository 상태: private, fork, archived, disabled, default branch
- URL: GitHub 페이지, API, clone, SSH, Git URL
- 활동 및 크기: 생성, 업데이트, push 타임스탬프, size, stars, watchers, forks, subscribers, open issues
- 기능: issues, projects, wiki, Pages, discussions, topics, language, homepage
- License, merge 설정, caller 권한, 보안 설정, 사용 가능한 경우 fork parent/source 메타데이터

일부 관리, 권한, merge, 보안 필드는 credential의 repository 권한에 따라 달라집니다.

예:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue 작업은 title/body 필드와 labels 및 assignees용 선택적 JSON 배열 필드를 지원합니다.

`List Issues`는 repository issue만 반환합니다. Pull request는 제외됩니다. PR 결과에는 `List Pull Requests`를 사용하십시오.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Edit Issue 필드 의미

`Edit Issue`의 경우 명시적으로 설정한 필드만 GitHub로 전송됩니다:

- **State** – `Don't change`, `Open`, `Closed` 중에서 선택합니다. 현재 state를 유지하려면 설정하지 마십시오.
- **State Reason** – 선택적으로 `Completed`, `Not Planned`, `Duplicate`, `Reopened`를 설정합니다.
- **Title / Body** – 현재 값을 유지하려면 비워 두십시오.
- **Labels / Assignees** – 현재 값을 유지하려면 필드를 비워 두십시오. 모든 labels 또는 assignees를 지우려면 `[]`를 사용하십시오. `["bug"]`와 같은 JSON 배열을 사용하여 교체하십시오.

`Edit Issue`는 런타임에 최소 하나의 필드 변경이 필요합니다. issue 번호만 제공하면 GitHub API 계층의 유효성 검사 오류로 실행이 실패합니다.
## Lock Issue

`Lock Issue`는 선택적 **Lock reason**을 받습니다. 제공하는 경우 GitHub에서 지원하는 값 중 하나여야 합니다:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

특정 사유 없이 잠그려면 사유를 비워 두십시오.

## Pull Requests

PR 생성에는 다음이 필요합니다:

- Title
- Head branch
- Base branch
- 선택적 body
- 선택적 draft 모드

## Pull Request Reviews

Review 작업은 GitHub의 pull request review API와 일치합니다:

| Operation | Required fields | Optional fields |
|-----------|-----------------|-----------------|
| `Create Review` | Pull request number, event | Body, commit ID |
| `Get Review` | Pull request number, review ID | — |
| `List Reviews` | Pull request number | Per page |
| `Update Review` | Pull request number, review ID, body | — |

`Create Review`는 `Approve`, `Request Changes`, `Comment`, `Pending`을 지원합니다.
`Request Changes`와 `Comment`에는 body가 필요합니다. Commit ID가 비어 있으면 GitHub는
pull request의 최신 commit을 리뷰합니다.

## Releases

| Operation | Required fields at runtime | Commonly optional |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release`는 `draft` / `prerelease`를 `true` 또는 `false`로 명시적으로 설정할 수 있습니다.

## Workflows

Workflow 작업은 다음을 지원합니다:

- 저장소 workflow 목록 조회
- 숫자 ID 또는 workflow 파일 이름으로 workflow 가져오기
- workflow 활성화 또는 비활성화
- runner 운영 체제별 청구 가능한 workflow 사용량 조회
- ref 또는 branch와 선택적 JSON inputs 객체로 workflow 디스패치

GitHub는 `Get Workflow Usage` endpoint를 종료하는 과정에 있습니다. 이 작업을 사용하는
Workflow는 GitHub가 endpoint를 제거할 때 마이그레이션이 필요할 수 있습니다.

`Dispatch Workflow`는 두 가지 GitHub 응답 형식을 모두 허용합니다: 레거시 `204 No Content`와
`workflow_run_id`, `run_url`, `html_url`을 포함하는 최신 `200` 응답입니다.

`Dispatch Workflow and Wait`는 workflow를 디스패치하고 해당 run의 상태가 `completed`가
될 때까지 폴링합니다. timeout과 polling interval을 초 단위로 구성하십시오. Heym은 GitHub가
최신 `200` 응답을 반환할 때 `workflow_run_id`를 사용합니다. 전통적인 `204 No Content`
응답의 경우, Heym은 선택한 workflow와 ref에 대해 새로 생성된 `workflow_dispatch` run을
검색한 다음 해당 run을 기다립니다.

## File Contents

`Get File`은 GitHub의 contents API를 통해 저장소 파일을 읽고 사용 가능한 경우 텍스트 콘텐츠를 디코딩합니다. 바이너리 파일과 비 UTF-8 콘텐츠는 디코딩된 `content` 필드 없이 메타데이터를 반환할 수 있습니다.

`List Files`는 주어진 폴더 경로와 선택적 ref에 대해 저장소 contents API에서 디렉터리 항목을 반환합니다. 저장소 루트를 나열하려면 **Directory Path**를 비워 두십시오.

`Create or Update File`은 다음을 사용하여 저장소 경로에 텍스트 콘텐츠를 씁니다:

- File path
- Commit message
- File content
- 선택적 branch

`Delete File`은 commit message와 선택적 branch를 사용하여 저장소 경로를 제거합니다. 파일이 존재하면 Heym은 삭제하기 전에 현재 SHA를 자동으로 가져옵니다.

파일이 이미 존재하면 Heym은 업데이트하기 전에 현재 SHA를 자동으로 가져옵니다.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories`, `Get User Repositories`는
**Per Page**(1–100)를 지원합니다. Heym은 결과 한 페이지를 요청합니다. 동일한 작업에서
추가 페이지를 가져오기 위한 `page` 필드는 없습니다.

## Output

정확한 형태는 선택한 작업에 따라 달라집니다. 일반적인 필드는 다음과 같습니다:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

`github`를 노드 레이블로 바꾸십시오.

## Notes

- Labels와 assignees는 제공하는 경우 유효한 JSON 배열이어야 합니다.
- Workflow dispatch inputs는 제공하는 경우 유효한 JSON 객체여야 합니다.
- `Edit Issue`는 명시적으로 설정한 경우에만 `state`를 사용합니다. 현재 issue 상태를 유지하려면 설정하지 마십시오.
- GitHub API 권한은 부여한 token scope 또는 세분화된 저장소 권한에 따라 달라집니다.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – GitHub credential 추가 및 관리
- [Third-Party Integrations](../reference/integrations.md) – GitHub credential 설정 및 Enterprise `base_url`
- [Agent Node](./agent-node.md) – `@modelcontextprotocol/server-github`와 함께 GitHub credential 사용
- [Node Types](../reference/node-types.md) – 전체 노드 카탈로그

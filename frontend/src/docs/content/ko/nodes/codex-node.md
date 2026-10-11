# Codex

**Codex** 노드는 격리된 Heym 워크스페이스에서 GitHub 리포지토리를 대상으로 OpenAI Codex CLI를 실행합니다. 이 노드는 테스트 수정, 파일 편집, 패치 생성, 초안 Pull Request 생성 등의 코딩 작업을 위해 설계되었습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1, 그리고 `question` |
| Credential | Codex access token + GitHub |
| 출력 | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## 인증

**OpenAI Codex** credential은 두 가지 인증 모드를 지원합니다:

| 모드 | 설명 |
|------|-------------|
| **Sign in with ChatGPT** (권장) | ChatGPT Plus/Pro 구독을 사용하는 OAuth (PKCE) 로그인 방식이므로 실행 시 토큰당 API 비용이 **발생하지 않습니다**. Credential 대화상자에서 **Sign in with ChatGPT**를 클릭하고 브라우저에서 인증한 다음, `localhost:1455` 리다이렉트 URL을 다시 Heym에 붙여넣으십시오. Heym은 생성된 토큰 번들을 저장하고 만료 시 자동으로 갱신합니다. |
| **Access token** | 로컬 Codex runner에서만 사용되는 ChatGPT/Codex `access_token`을 붙여넣습니다. |

Codex credential에는 API 키를 사용할 수 없습니다. 이 노드는 클라우드 Codex 작업을 제출하지 않으며, Heym 런타임 내부에서 리포지토리를 clone하고 ChatGPT 토큰 번들을 격리된 `auth.json`에 기록하거나 `CODEX_ACCESS_TOKEN`을 전달하는 방식으로 Codex 프로세스에만 제공하며, 토큰을 `$credentials`에 노출하지 않습니다.

또한 이 노드는 비공개 리포지토리 clone, 작업 브랜치 push, 초안 Pull Request 생성을 위해 **GitHub** credential이 필요합니다.

Docker 배포 환경에서 Heym은 동일한 Heym 이미지의 형제 컨테이너 내부에서 Codex를 실행합니다(별도의 GHCR 이미지가 아님). 해당 컨테이너는 Codex 워크스페이스 볼륨만 마운트하며, Codex 자체의 bubblewrap sandbox가 네임스페이스와 새로운 `/proc`을 생성하도록 허용합니다. Runner는 `SYS_ADMIN`, unconfined seccomp 및 AppArmor, 그리고 `systempaths=unconfined`(Docker Engine 25+)를 추가합니다. 마지막 플래그가 없으면 모든 명령이 실행 전에 `bwrap: Can't mount proc on /newroot/proc: Operation not permitted` 오류와 함께 실패합니다.

OpenAI 참고 자료:

- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex models](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex non-interactive mode](https://developers.openai.com/codex/noninteractive)
- [Codex pricing](https://developers.openai.com/codex/pricing)

## 필드

| 필드 | 설명 |
|-------|-------------|
| Codex Credential | OpenAI Codex credential (ChatGPT 로그인 또는 `access_token`) |
| GitHub Credential | 리포지토리 접근에 사용되는 GitHub PAT credential |
| Repository URL | HTTPS GitHub 리포지토리 URL |
| Base Branch | Codex 실행 전에 clone할 브랜치, 기본값 `main` |
| Model | 선택적 Codex 모델(편집 가능한 드롭다운, 예: `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); 비워두면 Codex의 기본값 사용 |
| Reasoning Effort | Codex 추론 깊이: `low`, `medium`, `high`, `xhigh` (Extra High), `max`, 또는 `ultra` (기본값 `medium`) |
| Task Prompt | Codex에 전달할 코딩 작업; `$input.text`와 같은 표현식 지원 |
| Publish Mode | 변경 사항 전달 방식(아래 표 참조) |
| Branch Name | PR/commit 모드에서 사용할 작업 브랜치, 기본값 `codex/$executionId` |
| Timeout | Codex 최대 실행 시간(초) |

## Publish 모드

| 모드 | 동작 |
|------|--------------|
| `diff_only` | 로컬에서 파일을 편집하고 패치와 변경된 파일을 반환합니다. 아무것도 push하지 않습니다. |
| `draft_pr` | 브랜치에 commit하고 push한 뒤 초안 Pull Request를 생성합니다. |
| `open_pr` | 브랜치에 commit하고 push한 뒤 리뷰 준비된(초안이 아닌) Pull Request를 생성합니다. |
| `commit_push` | 브랜치에 commit하고 push하며, Pull Request는 생성하지 않습니다. |
| `direct_commit` | 별도 브랜치나 PR 없이 base 브랜치에 직접 commit하고 push합니다. |
| `open_or_update_pr` | 에이전트의 기존 열린 PR이 있으면 업데이트합니다 — 브랜치 이름이 다르더라도 runner가 작성자 + base로 찾습니다 — 없으면 새로 생성합니다. 재실행 및 "열린 PR 업데이트" 지시에 가장 적합합니다. |
| `update_existing_pr` | 기존 브랜치/PR에 commit을 추가하며, 아직 없으면 새로 생성합니다. |
| `patch_artifact` | diff를 다운로드 가능한 파일로 저장하고 `patchUrl`을 반환합니다. 아무것도 push하지 않습니다. |

## 출력

| 키 | 설명 |
|-----|-------------|
| `status` | `completed` 또는 `needs_input` |
| `summary` | Codex의 요약 |
| `validation` | Codex가 보고한 검증 노트, 테스트 또는 검사 |
| `diff` | 파일이 변경된 경우의 Git 패치 |
| `changedFiles` | 변경된 파일 경로 |
| `threadId` | 사용 가능한 경우 Codex 스레드/세션 id |
| `branchName` | 작업 브랜치 이름 |
| `pullRequestUrl` | `draft_pr`, `open_pr`, `open_or_update_pr`, `update_existing_pr` 모드에서의 PR URL |
| `pushedBranch` | commit/PR 모드에서 push된 브랜치 |
| `patchUrl` | `patch_artifact` 모드에서 diff의 다운로드 링크 |
| `usage` | 사용 가능한 경우 Codex CLI가 보고한 사용 메타데이터 |
## Pull Request의 UI 스크린샷

UI/프론트엔드 작업의 경우, Codex는 PNG 스크린샷을 `frontend/.e2e-artifacts/`와 같이 gitignore된 경로에 저장해야 합니다(소스 코드 내에 저장하지 않음). 프론트엔드 의존성이 누락된 경우, Codex는 `bun install`(또는 npm/pnpm install)을 실행하고 UI 캡처만을 목적으로 단기 preview/`bun run dev`를 시작할 수 있습니다. Heym은 해당 이미지들을 `<branch>-…` 형식의 이름을 가진 asset으로 단일 공유 GitHub **prerelease**(`codex-pr-assets`)에 업로드한 후, **pull request가 열리기 전에** PR 설명에 이미지를 삽입합니다. 따라서 새 PR은 스크린샷이 이미 포함된 상태로 생성됩니다(기존 PR은 제자리에서 업데이트됨). Codex는 또한 의미 있는 `pull_request_title`을 설정해야 합니다(`Done.`과 같은 placeholder는 절대 사용하지 않음).

Codex는 때때로 작업 도중에 턴을 종료하는 경우가 있습니다("…Now let me take a screenshot"). 이 경우 스크린샷이 캡처되기 전에 실행이 종료됩니다. 이를 방지하기 위해 runner prompt는 최종 결과 **이전에** 스크린샷을 캡처하도록 요구하며, 만약 실행이 게시 가능한 요약 없이 종료되거나 UI 변경이 있음에도 스크린샷이 없는 경우, Heym은 동일한 workspace에서 Codex 패스를 한 번 더 실행하여 마무리합니다. 그 이후에도 UI 변경에 스크린샷이 없는 경우, PR 본문에 가시적인 메모가 추가되어 이러한 누락이 결코 묵과되지 않도록 합니다.

## GitHub에 게시되는 내용

귀하의 **Task Prompt**는 비공개 입력이며 PR 콘텐츠가 아닙니다. 게시되는 것은 단 두 가지입니다: 코드 변경이 무엇을 하는지 설명하는 `## Change Summary`와, 스크린샷이 캡처된 경우의 `## Screenshots` 섹션입니다. PR 제목은 변경 요약만을 기반으로 도출됩니다.

Runner prompt는 이 정책을 명시하며, Heym은 실행 후에도 이를 강제합니다: 무엇이든 커밋되거나 pull request로 열리기 전에, 요약, PR 본문, 커밋 메시지에서 prompt-echo 섹션(`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …)과 task prompt에서 그대로 복사된 모든 단락을 제거합니다. `Both pass. Let me do a final review:`와 같은 단계 서술 또한 PR 제목이나 커밋 제목으로 허용되지 않습니다.

## 후속 질문

Codex가 누락된 요구사항이나 제품 결정이 필요한 경우, `needs_input`을 반환합니다. Heym은 실행을 일시 중지하고 `question` 출력 핸들을 노출합니다. 이 핸들을 알림 브랜치(예: Slack 또는 Send Email)에 연결하여 리뷰어에게 공개 후속 링크를 전송하십시오.

리뷰어가 답변하면, Heym은 저장된 workspace 메타데이터로부터 동일한 실행 스냅샷과 Codex 스레드를 재개합니다.

## 에이전트 도구로서의 사용

Codex 노드는 **AI Agent** 노드의 tool 핸들에 연결되어 에이전트가 코딩 작업을 위임할 수 있도록 합니다. 노드에서 credential, GitHub credential, repository를 구성한 다음, **Task Prompt**(및 선택적으로 **Repository URL**)를 에이전트 제공 토글로 표시하여 에이전트가 호출 시점에 이를 제공하도록 하십시오. Codex가 도구로 실행될 때, `needs_input` 결과는 workflow를 일시 중지하는 대신 에이전트에게 인라인으로 반환되므로, 에이전트는 요청을 개선하고 Codex를 다시 호출할 수 있습니다.

## 예시

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## 관련 항목

- [GitHub 노드](./github-node.md)
- [Agent 노드](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials 공유](../reference/credentials-sharing.md)
- [노드 유형](../reference/node-types.md)

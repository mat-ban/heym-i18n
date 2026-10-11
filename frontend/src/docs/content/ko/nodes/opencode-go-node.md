# OpenCode Go

**OpenCode Go** 노드는 격리되고 강화된 Heym 컨테이너 내에서 GitHub 리포지토리를 대상으로 [OpenCode](https://opencode.ai) CLI(Go)를 실행합니다. Codex 노드와 마찬가지로 테스트 수정, 파일 편집, 패치 생성, Pull Request 생성 등의 코딩 작업을 위해 설계되었으나, OpenAI Codex 대신 프로바이더에 종속되지 않는 **OpenCode Go** 모델 게이트웨이를 사용합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | OpenCode Go API key + GitHub |
| 출력 | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## 인증

**OpenCode Go** credential은 OpenCode Go 게이트웨이 **API key**([opencode.ai/go](https://opencode.ai/go)에서 발급)와 선택적 **Gateway Base URL**(기본값 `https://opencode.ai/zen/go/v1`, 자체 호스팅 또는 프록시 게이트웨이인 경우에만 재정의)을 저장합니다.

또한 이 노드는 프라이빗 리포지토리 복제, 작업 브랜치 푸시, Pull Request 생성을 위해 **GitHub** credential이 필요합니다. GitHub token은 **샌드박스 컨테이너 내부에 절대 배치되지 않습니다**. Heym이 모든 git 및 GitHub 작업을 호스트에서 수행하므로, 생성된 코드가 푸시 자격 증명을 유출할 수 없습니다.

## 격리 및 보안

실행 격리는 Codex 노드와 동일하게 `HEYM_OPENCODE_CLI_COMMAND`로 선택됩니다.

- **로컬 개발(`run.sh`)** 에서는 기본값 `opencode`로 유지되므로, OpenCode가 복제된 워크스페이스를 대상으로 호스트 서브프로세스로 실행됩니다. Docker가 필요하지 않으며 추가 플래그도 없습니다.
- **Docker 배포(`deploy.sh` 및 단일 GHCR 이미지)** 에서는 이를 `/usr/local/bin/heym-opencode-docker`로 설정합니다. 이는 OpenCode 워크스페이스 명명 볼륨을 공유하는 **강화된 일회용 형제 컨테이너** 내부에서 `opencode run`을 실행하는 래퍼입니다.

강화된 러너 컨테이너는 모든 Linux capability를 제거하고, `no-new-privileges`를 설정하며, 읽기 전용 루트와 tmpfs `/tmp`를 사용하고, pid/memory/CPU 제한을 적용합니다. 네트워크 이그레스는 허용됩니다(OpenCode가 모델 게이트웨이에 접근해야 함). **GitHub token은 컨테이너 내부에 절대 배치되지 않습니다**. 모든 git 및 GitHub 작업은 호스트 측에서 실행되므로, OpenCode API key와 리포지토리 파일만 내부에 존재합니다.

OpenCode는 디스크의 파일만 편집하며, 모든 git/GitHub 작업은 Heym이 담당합니다.

## 모델

OpenCode Go의 모델 목록은 자주 변경되므로, **Model** 필드는 게이트웨이의 모델 목록(`GET https://opencode.ai/zen/go/v1/models`)에서 실시간으로 채워지며 검색 가능한 드롭다운으로 표시됩니다. 실시간 목록을 사용할 수 없는 경우 내장 폴백 목록이 사용됩니다. 모델 id는 `opencode-go/<model>` 형식을 사용합니다(예: `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`). `opencode-go`는 Go 게이트웨이에 대한 OpenCode CLI의 프로바이더 id입니다. 러너 기본값(`opencode-go/kimi-k3`)을 사용하려면 필드를 비워 두십시오. 이전 `opencode/<model>` 형식으로 저장된 모델 id는 실행 시 자동으로 재작성됩니다.

## 필드

| 필드 | 설명 |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go credential(게이트웨이 API key) |
| GitHub Credential | 리포지토리 접근에 사용되는 GitHub PAT credential |
| Repository URL | HTTPS GitHub 리포지토리 URL, 표현식 지원 |
| Base Branch | OpenCode 실행 전 복제할 브랜치, 기본값 `main` |
| Model | OpenCode Go 모델(실시간 검색 가능 드롭다운, `opencode-go/<model>`), 비워 두면 러너 기본값 사용 |
| Reasoning Variant | 선택 사항, 추론 강도를 지원하는 모델에 대해 `opencode run --variant`로 매핑됨 |
| Task Prompt | OpenCode용 코딩 작업, `$input.text`와 같은 표현식 지원 |
| Publish Mode | 변경 사항 전달 방식(아래 표 참조) |
| Branch Name | PR/commit 모드의 작업 브랜치, 기본값 `opencode/$executionId` |
| Timeout | OpenCode 최대 실행 시간(초) |

## Publish 모드

| 모드 | 동작 |
|------|--------------|
| `diff_only` | 파일을 로컬에서 편집하고 패치와 변경된 파일을 반환합니다. 아무것도 푸시되지 않습니다. |
| `draft_pr` | 브랜치에 커밋하고 푸시한 뒤 draft Pull Request를 생성합니다. |
| `open_pr` | 브랜치에 커밋하고 푸시한 뒤 리뷰 준비된(비 draft) Pull Request를 생성합니다. |
| `commit_push` | 브랜치에 커밋하고 푸시하며, Pull Request는 생성하지 않습니다. |
| `direct_commit` | 별도 브랜치나 PR 없이 베이스 브랜치에 직접 커밋하고 푸시합니다. |
| `open_or_update_pr` | 에이전트의 기존 열린 PR이 있으면 업데이트합니다(브랜치 이름이 다르더라도 러너가 작성자 + 베이스로 찾음). 없으면 새로 생성합니다. 재실행 및 "열린 PR 업데이트" 지시에 가장 적합합니다. |
| `update_existing_pr` | 기존 브랜치/PR에 커밋을 추가하며, 아직 없으면 새로 생성합니다. |
| `patch_artifact` | diff를 다운로드 가능한 파일로 저장하고 `patchUrl`을 반환합니다. 아무것도 푸시되지 않습니다. |

## 출력

| 키 | 설명 |
|-----|-------------|
| `status` | 항상 `completed`(OpenCode Go 노드는 입력을 위해 일시 중지되지 않음) |
| `summary` | OpenCode의 최종 메시지 |
| `validation` | 보고된 경우의 검증 노트 |
| `diff` | 파일이 변경된 경우의 Git 패치 |
| `changedFiles` | 변경된 파일 경로 |
| `branchName` | 작업 브랜치 이름 |
| `pullRequestUrl` | `draft_pr`, `open_pr`, `open_or_update_pr`, `update_existing_pr` 모드에서의 PR URL |
| `pushedBranch` | commit/PR 모드에서 푸시된 브랜치 |
| `patchUrl` | `patch_artifact` 모드에서 diff의 다운로드 링크 |
## Pull Request의 UI 스크린샷

UI/프론트엔드 작업의 경우, OpenCode는 PNG 스크린샷을 `frontend/.e2e-artifacts/`와 같이 gitignore된 경로에 저장해야 합니다(소스 코드 내에 저장하지 않음). 프론트엔드 의존성이 누락된 경우, runner prompt는 UI 캡처만을 목적으로 한 제한적 패키지 설치(예: `bun install`)와 단기 preview/`bun run dev` 실행을 허용합니다. Heym은 해당 이미지들을 단일 공유 GitHub **prerelease**(`opencode-pr-assets`)에 `<branch>-…` 형식의 asset 이름으로 업로드한 뒤, **pull request가 열리기 전에** PR description에 삽입합니다. 따라서 새 PR은 스크린샷을 이미 포함한 상태로 생성됩니다(기존 PR은 제자리에서 업데이트됩니다).

OpenCode는 또한 `PR_TITLE: …` 라인으로 마무리하도록 지시받는데, 이는 Heym이 `Done.`과 같은 placeholder 대신 의미 있는 제목으로 pull request를 열 수 있게 하기 위함입니다.

OpenCode는 때때로 작업 도중에 턴을 종료합니다("…Now let me take a screenshot"). 이 경우 스크린샷이 캡처되기 전에 실행이 종료될 수 있습니다. 이를 방지하기 위해 runner prompt는 최종 메시지 **이전에** 스크린샷을 캡처하도록 요구하며, 그럼에도 실행이 게시 가능한 요약 없이 종료되거나 UI 변경이 있으나 스크린샷이 없는 경우, Heym은 동일한 workspace에서 OpenCode를 한 번 더 실행하여 마무리합니다. 그 이후에도 UI 변경에 스크린샷이 없으면 PR 본문에 가시적인 주석이 추가되어, 누락이 조용히 넘어가지 않도록 합니다.

## GitHub에 게시되는 항목

귀하의 **Task Prompt**는 비공개 입력이며 PR 콘텐츠가 아닙니다. 게시되는 것은 단 두 가지입니다: 코드 변경이 무엇을 하는지 설명하는 `## Change Summary`와, 스크린샷이 캡처된 경우의 `## Screenshots` 섹션입니다. PR 제목은 변경 요약만으로부터 도출됩니다.

runner prompt는 이 정책을 명시하며, Heym은 실행 후에도 이를 강제합니다: 무엇이든 커밋되거나 pull request로 열리기 전에, 요약, PR 본문, 커밋 메시지에서 prompt-echo 섹션(`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …)과 task prompt에서 그대로 복사된 모든 단락을 제거합니다.

Heym은 에이전트의 메시지 중 `## Change Summary` 섹션을 읽어들이며, 마지막으로 말한 내용을 그대로 사용하지 않습니다. 이는 OpenCode가 단계별로 메시지를 출력하고 마지막 메시지가 실행 중간의 논평인 경우가 많기 때문입니다. 단계 서술(`Both pass. Let me do a final review:`) 또한 PR 제목이나 커밋 제목으로 거부됩니다. 실행이 사용 가능한 변경 요약을 생성하지 못하면, pull request는 논평을 게시하는 대신 변경된 파일 목록을 나열하는 것으로 대체됩니다.

## 에이전트 도구로서

OpenCode Go 노드는 **AI Agent** 노드의 tool handle에 연결되어 에이전트가 코딩 작업을 위임할 수 있게 합니다. 노드에서 credential, GitHub credential, repository를 구성한 다음, **Task Prompt**(그리고 선택적으로 **Repository URL**)를 agent-provided 토글로 표시하여 에이전트가 호출 시점에 이를 제공하도록 하십시오.

## 예시

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## 관련 항목

- [Codex 노드](./codex-node.md)
- [GitHub 노드](./github-node.md)
- [Agent 노드](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Credentials 공유](../reference/credentials-sharing.md)
- [노드 유형](../reference/node-types.md)

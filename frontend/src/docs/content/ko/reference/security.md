# 보안

Heym 플랫폼의 보안 관행 및 구성입니다.

## 비밀번호 정책

등록 시 및 비밀번호 변경 시 모든 비밀번호는 다음 요구 사항을 충족해야 합니다:

| 규칙 | 요구 사항 |
|------|-------------|
| 최소 길이 | 8자 |
| 대문자 | 최소 하나의 대문자 (A–Z) |
| 소문자 | 최소 하나의 소문자 (a–z) |
| 숫자 | 최소 하나의 숫자 (0–9) |

이러한 규칙은 프론트엔드와 백엔드(Pydantic validator) 양쪽에서 강제됩니다. 규칙을 준수하지 않는 비밀번호가 포함된 요청은 데이터베이스 쓰기가 발생하기 전에 `422 Unprocessable Entity` 응답과 함께 거부됩니다.

**유효한 비밀번호 예시:** `MyWorkflow7!`

## 세션 관리

- Access Token은 `localStorage`가 아닌 **HttpOnly** 쿠키에 저장됩니다. 이를 통해 JavaScript( XSS Payload 포함)가 Token을 읽는 것을 방지합니다.
- Refresh Token은 `/api/auth/refresh` 경로로 범위가 제한되며 다른 Endpoint로 전송될 수 없습니다.
- 각 `/api/auth/refresh` 호출은 Refresh Token을 **회전**시킵니다: 이전 Token은 즉시 폐기되고 새 Token이 발급됩니다. 사용된 Refresh Token을 재사용하면 `401`이 반환됩니다.

## 속도 제한

다음 Endpoint는 IP별로 속도가 제한됩니다:

| Endpoint | 제한 | 차단 기간 |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15분 |
| `POST /api/auth/register` | 5 req / 60 s | 10분 |
| `POST /register` (OAuth 클라이언트) | 5 req / 60 s | 10분 |
| Portal 로그인 | 3회 시도 | 24시간 |

`REDIS_URL`이 구성된 경우 속도 제한은 모든 백엔드 워커 간에 공유됩니다. 구성되지 않은 경우 제한은 워커 프로세스별로 적용됩니다.

## 자격 증명 암호화

[Credentials](../tabs/credentials-tab.md) 패널에 저장된 모든 API 키, Webhook URL 및 Bearer Token은 데이터베이스에 기록되기 전에 AES-256(Fernet)을 사용하여 저장 시 암호화됩니다. 키는 `ENCRYPTION_KEY` 환경 변수에서 파생됩니다. `run.sh` 및 `deploy.sh` 스크립트는 값이 비어 있을 때 강력한 값을 자동으로 생성합니다. 애플리케이션은 `ENCRYPTION_KEY`가 비어 있거나 알려진 자리 표시자로 남아 있는 경우 시작을 거부합니다.

## MCP API Key

MCP API Key는 `/api/mcp/sse` Endpoint에 연결하는 외부 MCP 클라이언트를 인증하는 데 사용됩니다. SSE 연결이 설정되면 실제 API Key 대신 단기(1시간) 세션 Token이 발급되어 메시지 Endpoint URL에 포함되므로, 서버 액세스 로그에 Key가 나타나는 것을 방지합니다. 설정은 [MCP Tab](../tabs/mcp-tab.md)을 참조하십시오.

## OAuth / PKCE

MCP 클라이언트에 사용되는 OAuth 2.0 인증 서버는 PKCE(`S256`)와 함께 `authorization_code` 그랜트만 지원합니다. 동의 양식은 10분 동안 유효한 HMAC-SHA256 CSRF Token을 사용합니다. 동의 페이지에 표시되는 모든 값은 HTML 이스케이프 처리됩니다.

## Execution Token

[Execution Token](./execution-tokens.md)은 외부 시스템에서 Workflow의 실행 Endpoint를 호출하기 위한 범위 지정 JWT입니다. 사용자 세션 Token과 달리 다음과 같은 특징이 있습니다:

- **단일 Workflow 범위** — Token은 다른 Workflow에 대해서는 거부됩니다.
- **독립적 폐기 가능** — Token을 폐기해도 발급한 사용자의 세션에는 영향을 미치지 않습니다.
- **단기 또는 장기 유효** — 60초에서 10년까지 TTL을 선택할 수 있습니다.

Token은 동일한 애플리케이션 시크릿(`SECRET_KEY`)으로 서명되며 모든 요청에서 서명, 만료, `wid` 클레임 일치 및 폐기 상태가 확인됩니다. 설정 및 API 참조는 [Execution Tokens](./execution-tokens.md)를 참조하십시오.

## 콘텐츠 안전

LLM 및 Agent 노드에서 [Guardrails](./guardrails.md)를 사용하여 안전하지 않거나 정책을 위반하는 사용자 메시지가 모델에 도달하기 전에 차단하십시오. Guardrails는 구성 가능한 민감도 수준과 함께 아홉 가지 콘텐츠 카테고리(폭력, 혐오 발언, 성적 콘텐츠 등)를 지원합니다.

## Python 도구 샌드박스

[Agent 노드](../nodes/agent-node.md)의 사용자 정의 Python 도구는 신뢰할 수 없는 코드를 실행합니다. 기본적으로 Heym은 각 도구를 다음과 같은 강화된 일회용 Docker 컨테이너 내에서 실행합니다:

- 네트워크 액세스 없음,
- 작은 `tmpfs` 작업 디렉터리가 있는 읽기 전용 루트 파일 시스템,
- 모든 Linux 기능이 제거되고 `no-new-privileges`가 설정된 비루트 사용자,
- 엄격한 CPU, 메모리 및 PID 제한, 그리고
- **Docker 소켓**이 마운트되지 않아 도구가 호스트 Docker 데몬에 접근할 수 없습니다.

실행 백엔드는 `HEYM_PYTHON_TOOL_SANDBOX` 환경 변수로 제어됩니다:

| 값 | 동작 |
|-------|----------|
| `auto` (기본값) | 강화된 Docker 컨테이너에서 실행합니다. Docker를 사용할 수 없는 경우 실행은 **fail closed** 방식으로 실패합니다 — OS 격리 없이 신뢰할 수 없는 코드를 조용히 실행하지 않습니다. |
| `docker` | `auto`와 동일하지만 폴백하지 않습니다. |
| `subprocess` | 가져오기 허용 목록으로 보호되는 로컬 인프로세스 서브프로세스에서 실행합니다. 이는 **보안 경계가 아니며** 신뢰할 수 있는 코드 또는 로컬 개발용으로만 사용됩니다. `run.sh`는 네이티브 개발을 위해 이를 선택합니다. |

`HEYM_PYTHON_TOOL_IMAGE`를 설정하여 샌드박스 이미지를 고정하십시오. 비어 있는 경우 Heym은 실행 중인 백엔드 이미지를 자동 감지합니다. 인프로세스 제한(가져오기 허용 목록과 속성 및 내부 검사 필터링)은 심층 방어로 적용되지만, 컨테이너가 실제 격리 경계입니다 — 다중 사용자 및 프로덕션 배포에서는 기본 `auto`(또는 `docker`) 모드를 유지하십시오.

## Skill Sandbox

[Agent 노드](../nodes/agent-node.md)에 연결된 Python 스킬 또한 신뢰할 수 없는 코드를 실행합니다. 스킬은 공유된 Workflow나 `everyone` 가시성 템플릿 내부에 그대로 포함되어 전달될 수 있으므로, 스킬은 Python 도구와 **동일한** `HEYM_PYTHON_TOOL_SANDBOX` 스위치를 통해 실행되며 같은 방식으로 fail closed됩니다. 스킬 컨테이너는 동일하게 강화됩니다(비루트, 모든 capability 제거, `no-new-privileges`, 읽기 전용 루트 파일시스템, CPU/메모리/PID 제한, 그리고 **Docker 소켓 없음**). 다만 스킬이 정당하게 필요로 하는 두 가지 사항 때문에 의도적인 차이가 있습니다:

- **네트워크 이그레스가 허용됩니다** (스킬은 API를 호출하고 `uv`를 통해 자체 의존성을 설치합니다), 그리고
- **쓰기 가능한 워크스페이스가 마운트됩니다** — 스킬이 출력 파일을 생성하고 Heym Drive 파일을 읽을 수 있도록 하기 위함입니다.

워크스페이스는 Codex 러너가 사용하는 것과 동일한 명명된 Docker 볼륨(`heym-codex-workspaces`, `/app/data/codex-workspaces`에 마운트됨)을 통해 일회성 형제 컨테이너와 공유됩니다. 이번 실행의 자체 하위 디렉터리만 실행별 `volume-subpath`를 통해 형제 컨테이너에 마운트되므로, 하나의 스킬이 다른 실행이나 Codex의 워크스페이스 데이터를 절대 볼 수 없습니다. Docker Compose 스택은 항상 이 볼륨을 마운트합니다. 단일 컨테이너 `docker run`은 Python 스킬과 Codex 모두를 위해 `-v heym-codex-workspaces:/app/data/codex-workspaces`를 포함해야 합니다. `auto`/`docker` 모드에서 볼륨이 없으면 스킬 실행은 백엔드에서 실행되는 대신 **fail closed**됩니다. 실행별 하위 경로 마운트는 **Docker Engine 25.0 이상**을 요구하므로, 구버전 엔진은 업그레이드하거나 `HEYM_PYTHON_TOOL_SANDBOX=subprocess`로 신뢰할 수 있는 스킬을 실행해야 합니다.

비밀이 아닌 이식 가능한 환경 변수(프록시 및 CA 번들 설정, 로케일)만 컨테이너로 전달됩니다. 데이터베이스 URL, `SECRET_KEY`/`ENCRYPTION_KEY`, 프로바이더 API 키, OAuth 시크릿은 허용 목록에 의해 차단됩니다. 스킬 파일 경로는 워크스페이스 내부에 머물도록 검증되며, 출력 디렉터리에 심어진 심볼릭 링크(`_hitl_request.json` 센티넬 포함)는 절대 따라가지 않습니다. 필요 시 `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS`, `HEYM_SKILL_USER`로 기본값을 재정의하십시오.

도구와 마찬가지로, `subprocess` 모드는 백엔드 프로세스에서 스킬을 실행하며 **보안 경계가 아닙니다** — 신뢰할 수 있는 단일 사용자 또는 로컬 개발 환경에서만 사용하십시오(`run.sh`는 네이티브 개발을 위해 이를 선택합니다).

## Code Node Sandbox

[Code 노드](../nodes/code-node.md)는 임의의 사용자 Python과 임의의 서드파티 의존성을 함께 실행하므로, 세 가지 샌드박스 중 가장 엄격하며 유일하게 **탈출구가 없는** 샌드박스입니다. 샌드박스 모드 변수를 읽지 않고, `subprocess` 모드가 없으며, 접근 가능한 Docker 데몬이 없으면 fail closed됩니다. 백엔드 프로세스에서 사용자 코드를 실행하는 것으로 절대 폴백하지 않습니다.

실행은 하나 또는 두 개의 일회성 컨테이너로 이루어지며, 둘 모두 도구 및 스킬 샌드박스와 동일하게 강화됩니다(비루트, 모든 capability 제거, `no-new-privileges`, 읽기 전용 루트 파일시스템, CPU/메모리/PID 제한, 그리고 **Docker 소켓 없음**):

- `requirements.txt`가 비어 있으면, **`--network none`인 단일 컨테이너**가 코드를 실행합니다. 러너는 컨테이너의 stdin Payload로 도착하므로 아무것도 마운트되지 않습니다.
- 의존성이 있으면, 첫 번째 컨테이너가 네트워크 접근으로 실행별 `.deps` 디렉터리에 의존성을 설치하고, 두 번째 컨테이너가 해당 하위 트리를 **읽기 전용**으로 마운트하여 코드를 실행합니다. 실행 컨테이너는 노드의 `codeAllowNetwork` 옵션이 켜져 있지 않으면 네트워크가 없습니다.

의존성은 `uv`로 설치되고, `pip`로 재시도되며, 실행 간에 절대 캐시되지 않습니다. 백엔드가 컨테이너에서 실행될 때, 실행별 디렉터리는 스킬 샌드박스가 사용하는 동일한 `heym-codex-workspaces` 볼륨에 위치하며, 실행별 `volume-subpath`를 통해 마운트되어 한 실행이 다른 실행의 파일을 절대 볼 수 없습니다. 이 형태는 **Docker Engine 25.0 이상**을 요구합니다. 네이티브 백엔드(`./run.sh`)는 그러한 볼륨이 없으며 필요하지도 않습니다 — 실행별 디렉터리는 형제 컨테이너에 직접 바인드 마운트되는 로컬 임시 경로입니다. 어느 경우든 디렉터리는 결과와 무관하게 매 실행 후 삭제됩니다.

비밀이 아닌 이식 가능한 환경 변수만 컨테이너로 전달됩니다 — 프록시 설정, CA 번들, 로케일로, 이는 의존성 설치가 기업 프록시 뒤에서 PyPI에 접근하는 데 필요합니다. 데이터베이스 URL, `SECRET_KEY`/`ENCRYPTION_KEY`, 프로바이더 API 키, OAuth 시크릿은 허용 목록에 의해 차단되므로, 새로운 백엔드 시크릿은 누군가 차단 목록을 갱신할 때까지 유출되는 대신 기본적으로 제거됩니다. 백엔드의 `HOME`은 샌드박스 자체의 쓰기 가능한 경로를 절대 재정의하지 않습니다.

**Format** 버튼은 동일한 샌드박스를 사용합니다. Ruff는 소스를 실행하는 대신 파싱하고 재작성하지만, 백엔드 호스트에서 실행하면 신뢰할 수 없는 파일에 백엔드의 전체 환경을 상속하는 프로세스를 부여하게 되므로, 동일한 제한과 동일한 허용 목록 환경을 가진 자체 일회성 `--network none` 컨테이너를 사용합니다. 호스트에서 포맷팅하는 대신 Docker 없이는 fail closed됩니다.

샌드박스 제한은 환경 변수가 아닌 상수입니다 — 512 MB 메모리, CPU 1개, 프로세스 256개, 설치 타임아웃 120초, 실행 타임아웃 60초입니다. 이미지는 기존 `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` 체인에서 해석되며, 노드는 자체적인 구성을 도입하지 않습니다.

## 관련 문서

- [실행 및 배포](../getting-started/running-and-deployment.md) – 시작 시 `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER`, `HEYM_PYTHON_TOOL_SANDBOX`를 구성합니다
- [Code 노드](../nodes/code-node.md) – 자체 의존성을 갖춘 샌드박스 Python 실행
- [Agent 노드](../nodes/agent-node.md) – 샌드박스에서 실행되는 사용자 정의 Python 도구
- [Execution Tokens](./execution-tokens.md) – 외부 시스템에서 Workflow를 호출하기 위한 범위 지정 JWT
- [Guardrails](./guardrails.md) – LLM 및 Agent 노드에서 안전하지 않은 콘텐츠를 차단합니다
- [설정](./user-settings.md) – 비밀번호를 변경합니다
- [Credentials 탭](../tabs/credentials-tab.md) – API 키를 관리합니다
- [MCP 탭](../tabs/mcp-tab.md) – MCP API 키 및 OAuth 클라이언트
- [Portal](./portal.md) – 공개 채팅 Portal 접근 제어

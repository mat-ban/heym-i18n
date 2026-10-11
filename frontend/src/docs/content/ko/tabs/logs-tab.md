# Logs 탭

**Logs** 탭은 Heym 스택의 Docker 컨테이너 로그를 표시합니다. 디버깅, 모니터링, 문제 해결에 사용하십시오. Workflow 실행 로그(노드 결과, 출력)의 경우 workflow 편집기의 Debug 패널을 사용하십시오. 자세한 내용은 [Canvas Features](../reference/canvas-features.md#execution-logs)를 참조하십시오.

Docker 기반 로그는 자체 호스팅 배포에서 기본적으로 비활성화되어 있습니다. 이를 활성화하려면 `DOCKER_LOGS_ENABLED=true`를 설정하고, `DOCKER_LOGS_ALLOWED_EMAILS`를 Docker 로그에 접근이 허용된 신뢰할 수 있는 사용자 이메일의 쉼표로 구분된 목록으로 설정한 후, `/var/run/docker.sock`이 backend 컨테이너에 마운트되어 있는지 확인하십시오. 기본 Docker Compose 서비스와 직접 `docker run` 예제에는 Docker 기반 MCP stdio 도구를 위한 해당 마운트가 포함되어 있습니다. Docker socket 신뢰 경계를 수용하는 경우에만 이를 유지하십시오.

등록이 열려 있는 경우, Docker 로그를 활성화하기 전에 신뢰할 수 있는 admin 계정을 생성하거나 `ALLOW_REGISTER=false`를 유지하십시오. 그렇지 않으면 검증되지 않은 자체 등록이 허용 목록에 있는 이메일을 차지할 수 있습니다.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Logs 데모 시청</a></p>

## 컨테이너 선택

- **All Containers** – backend, frontend, PostgreSQL의 통합 로그
- **Backend** – `heym-backend` 컨테이너
- **Frontend** – `heym-frontend` 컨테이너
- **PostgreSQL** – `heym-postgres` 컨테이너

## 로그 레벨 필터

- **All** – 모든 로그 레벨 표시
- **INFO** – INFO 이상
- **WARNING** – 경고 및 오류
- **ERROR** – 오류만
- **DEBUG** – Debug 이상

## 검색

- 텍스트 검색으로 로그 필터링
- 일치 항목은 로그 출력에서 강조 표시됩니다

## 기능

- **Auto scroll** – 새 로그가 도착하면 하단으로 스크롤
- **Stream** – 실시간으로 로그 스트리밍(지원되는 경우)
- **Copy** – 로그를 클립보드에 복사
- **Download** – 로그를 파일로 다운로드

## 사용 사례

- Workflow 실행 실패 디버깅
- API 요청/응답 로그 검사
- 데이터베이스 쿼리 모니터링
- 시작 및 상태 메시지 확인

## 관련 항목

- [Canvas Features](../reference/canvas-features.md) – workflow Debug 패널의 실행 로그
- [Traces Tab](./traces-tab.md) – LLM trace 검사
- [Analytics Tab](./analytics-tab.md) – 실행 지표
- [Workflows Tab](./workflows-tab.md) – Workflow 관리
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간결한 페이지 가이드

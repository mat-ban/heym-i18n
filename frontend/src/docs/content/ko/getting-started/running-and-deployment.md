# 실행 및 배포

Heym은 서로 다른 환경을 위한 두 가지 스크립트를 제공합니다. `run.sh`는 로컬 개발용이며, `deploy.sh`는 Docker Compose를 사용하는 프로덕션 배포용입니다.

> **동영상 안내:** [2분 이내에 로컬에서 Heym 설정하기](https://www.youtube.com/watch?v=P6YvlupUboU) — 저장소를 복제하고, PostgreSQL을 시작하고, 필수 환경 변수를 입력한 뒤 로컬 인스턴스에서 첫 번째 계정을 생성하십시오.

## 사전 요구 사항

두 스크립트 모두 다음 도구가 설치되어 있어야 합니다:

| 도구 | 용도 |
|------|---------|
| [Docker](https://docs.docker.com/get-docker/) | 데이터베이스 컨테이너(개발) 및 전체 스택(프로덕션) |
| [uv](https://github.com/astral-sh/uv) | 백엔드용 Python 패키지 관리자 |
| [bun](https://bun.sh) | 프런트엔드용 JavaScript 런타임 |

## 환경 설정

`run.sh`와 `deploy.sh`는 모두 프로젝트 루트의 `.env` 파일을 읽습니다. 파일이 존재하지 않으면 스크립트가 `.env.example`을 기반으로 자동으로 생성합니다 — 로컬 개발과 프로덕션 모두에서 마찬가지입니다.

`SECRET_KEY`와 `ENCRYPTION_KEY`는 `.env.example`에서 빈 값으로 제공됩니다. 둘 중 하나라도 비어 있으면 `run.sh`와 `deploy.sh`가 암호학적으로 강력한 값을 자동으로 생성하여 `.env`에 다시 기록하므로, 새로 설정할 때 수동으로 키를 다룰 필요가 없습니다. 기존 `.env`에 여전히 레거시 `ENCRYPTION_KEY` 자리 표시자(`change_this_to_a_random_32_byte_hex_value`)가 포함되어 있으면, 스크립트는 이를 덮어쓰지 않고 명시적인 오류와 함께 중단됩니다 — 해당 키를 교체하면 이전에 암호화된 자격 증명을 읽을 수 없게 되기 때문입니다. 백엔드 자체도 두 키 중 하나라도 비어 있거나 알려진 자리 표시자로 남아 있으면 시작을 거부합니다.

파일을 수동으로 생성하려면(선택 사항 — 스크립트가 대신 수행합니다):

```bash
cp .env.example .env
```

주요 환경 변수:

지원되는 모든 변수, 기본값, 프로덕션 관련 참고 사항은 [환경 변수](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)를 참조하십시오.

| 변수 | 설명 |
|----------|-------------|
| `SECRET_KEY` | **필수.** JWT 서명 시크릿. 비어 있으면 `run.sh`/`deploy.sh`가 자동 생성합니다. |
| `ENCRYPTION_KEY` | **필수.** 자격 증명 암호화 키. 비어 있으면 `run.sh`/`deploy.sh`가 자동 생성합니다. |
| `DATABASE_URL` | 선택적 데이터베이스 연결 문자열 재정의. 비어 있으면 Heym이 `POSTGRES_*` 설정으로부터 이를 구성합니다. |
| `BACKEND_PORT` | 백엔드 API 포트 — 기본값은 `10105` |
| `FRONTEND_PORT` | 프런트엔드 포트 — 기본값은 `4017` |
| `FRONTEND_URL` | **프로덕션에서 필수.** 앱의 공개 URL(스킴 + 호스트, 예: `https://heym.example.com`). OAuth 리디렉션 URI(Google Sheets, BigQuery, Notion 등)와 백그라운드 실행이 생성하는 리뷰, Codex 후속 조치 및 파일 링크에 사용되며, 사용자가 브라우저에서 사용하는 URL과 일치해야 합니다. Cluster에서는 모든 인스턴스에 동일한 값을 설정하십시오. |
| `ALLOW_REGISTER` | 사용자 등록 개방 여부(프로덕션에서는 `false`, 개발에서는 `true`). 관리자 계정이 생성된 후에만 `false`로 전환하십시오 — 최초 사용자 부트스트랩이 없으므로, 빈 데이터베이스와 비활성화된 등록 상태에서는 계정을 생성할 방법이 없습니다. |
| `DOCKER_LOGS_ENABLED` | `true`로 설정하면 Docker 기반 Logs 탭 접근을 활성화합니다. Docker 소켓 접근도 필요합니다 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true`일 때 Docker 로그에 접근할 수 있는 신뢰할 수 있는 사용자 이메일의 쉼표 구분 목록 |
| `REQUEST_BODY_MAX_SIZE_MB` | endpoint 핸들러가 실행되기 전에 허용되는 최대 HTTP 요청 본문 크기. 기본값은 `100`이며, 멀티파트 오버헤드를 위한 여유를 두기 위해 `FILE_MAX_SIZE_MB`보다 1MB 큽니다 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 사용자 정의 Python 도구의 실행 방식: `auto`(기본값 — 강화된 격리 Docker 컨테이너, Docker를 사용할 수 없으면 fail closed), `docker`(동일하지만 폴백하지 않음), 또는 `subprocess`(프로세스 내 로컬 폴백, 보안 경계가 아니며 신뢰/개발 환경 전용). `run.sh`는 네이티브 개발을 위해 `subprocess`를 설정합니다. [보안](../reference/security.md#python-tool-sandbox)을 참조하십시오. |
| `HEYM_PYTHON_TOOL_IMAGE` | Python 도구 Docker 샌드박스에 사용되는 이미지. 비어 있으면 실행 중인 백엔드 이미지를 자동 감지합니다. |

데이터베이스 연결 기본값(`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`)은 [환경 변수](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) 및 `.env.example`에 문서화되어 있습니다.

---

## 개발: `run.sh`

`run.sh`는 데이터베이스(Docker 컨테이너로 실행), FastAPI 백엔드, Vite 개발 서버의 세 가지 서비스를 단일 명령으로 로컬에서 시작합니다.

```bash
./run.sh
```

**단계별 수행 작업:**

1. `docker`, `bun`, `uv`가 사용 가능한지 확인합니다
2. `.env`가 없으면 `.env.example`에서 생성하고, `SECRET_KEY`와 `ENCRYPTION_KEY`가 비어 있으면 무작위로 생성합니다
3. 포트 `6543`에서 데이터베이스 Docker 컨테이너를 시작(또는 생성)하며, 데이터를 호스트 디렉터리가 아닌 `heym-postgres-data` Docker 볼륨에 저장합니다
4. `uv sync`를 통해 Python 의존성을 설치합니다
5. Alembic 데이터베이스 마이그레이션을 실행합니다(`alembic upgrade head`)
6. 백엔드 및 프론트엔드 포트가 사용 중이면 해제합니다
7. `--reload` 옵션으로 FastAPI 백엔드를 시작합니다(코드 변경 시 핫 리로드)
8. `bun install`을 통해 프론트엔드 의존성을 설치합니다
9. Vite 개발 서버를 시작합니다

**옵션:**

| 플래그 | 설명 |
|------|-------------|
| *(없음)* | 디버그 로깅이 활성화된 상태로 시작합니다(`LOG_LEVEL=DEBUG`) |
| `--no-debug` | 기본 로그 레벨로 시작합니다(디버그 출력 없음) |
| `--help` | 사용 정보를 표시합니다 |

**서비스 주소(개발):**

| 서비스 | 주소 |
|---------|---------|
| 프론트엔드 | `FRONTEND_PORT`의 `localhost` (기본값: 4017) |
| 백엔드 API | `BACKEND_PORT`의 `localhost` (기본값: 10105) |
| 대화형 API 문서 | `localhost:10105/docs` |
| 데이터베이스 | `localhost:6543` |

`Ctrl+C`를 눌러 모든 서비스를 정상적으로 중지하십시오.

---

## 종단 간 테스트: `run_e2e.sh`

프론트엔드 Playwright 스위트는 실제 Vue 애플리케이션, FastAPI 백엔드, 그리고 격리된 PostgreSQL 데이터베이스에 대해 실행됩니다:

```bash
./run_e2e.sh
```

이 스위트는 핵심 경로에 대한 스모크 및 회귀 테스트 스위트이며, 제품 전체를 망라하는 완전한 커버리지는 아닙니다. 인증, 핵심 Workflow 라이프사이클 및 실행, 선택된 대시보드 리소스, 공개 라우트, 그리고 모킹된 HITL 리뷰 UI를 다룹니다. 프로바이더 통합, 모든 노드 유형, 공유/권한 매트릭스, 그리고 전체 HITL 재개 실행은 주로 백엔드 테스트에서 다루거나 전용 통합 환경이 필요합니다.

각 실행은 자체적인 임시 PostgreSQL 16 컨테이너, 무작위로 할당된 데이터베이스/백엔드/프론트엔드 포트, 인증 상태, 테스트 결과, HTML 리포트를 갖습니다. 이를 통해 여러 `run_e2e.sh` 프로세스가 상태를 공유하거나 아티팩트를 덮어쓰지 않고 동시에 실행될 수 있습니다. 스크립트는 실행이 완료되면 데이터베이스 컨테이너를 제거하고 아티팩트 디렉터리와 리포트 경로를 출력합니다.

유용한 명령:

```bash
./run_e2e.sh --ui         # Interactive Playwright runner with an isolated database
cd frontend
bun run test:e2e:report   # Open the most recently completed local run
```

직접 `bun run test:e2e` 및 `bun run test:e2e:ui`를 실행하려면 명시적인 `DATABASE_URL`이 필요하므로, 로컬 개발 데이터베이스에 대해 조용히 시작되지 않도록 합니다. 일반적인 로컬 실행에는 `./run_e2e.sh`를 사용하십시오.

`./check.sh`는 E2E 스위트 없이 lint, typecheck, formatting, 백엔드 테스트를 실행하여 기본 로컬 검사 경로를 빠르게 유지합니다. Playwright E2E 테스트는 `./run_e2e.sh`로 별도로 실행하십시오. Pull request는 항상 GitHub Actions에서 Chromium E2E 스위트를 실행하며, 실패 시 trace, 스크린샷, 비디오, HTML 리포트를 보존합니다.

---

## 프로덕션: `deploy.sh`

`deploy.sh`는 Docker Compose를 사용하여 전체 스택을 빌드하고 실행합니다. 데이터베이스, 백엔드, 프론트엔드의 세 가지 서비스가 모두 컨테이너로 실행됩니다. 백엔드 entrypoint는 서버를 8개의 worker로 시작하기 전에 마이그레이션을 자동으로 실행합니다.

**최초 배포 (빌드 + 시작):**

```bash
./deploy.sh
```

이는 무중단 배포를 수행합니다. 기존 컨테이너가 계속 실행되는 동안 이미지를 먼저 빌드한 다음, 새 버전으로 교체합니다.

**사용 가능한 명령어:**

| 명령어 | 설명 |
|---------|-------------|
| `./deploy.sh` | 이미지를 빌드하고 모든 서비스를 시작/업데이트합니다 |
| `./deploy.sh --status` | 컨테이너 상태를 표시합니다 |
| `./deploy.sh --logs` | 모든 컨테이너의 로그를 스트리밍합니다 |
| `./deploy.sh --restart` | 모든 컨테이너를 재시작합니다 |
| `./deploy.sh --down` | 모든 컨테이너를 중지하고 제거합니다 |
| `./deploy.sh --migrate-pgdata` | 일회성 마이그레이션: 기존 `data/postgres` 디렉터리를 `heym-postgres-data` Docker 볼륨으로 복사하고 인덱스를 재구축합니다 |
| `./deploy.sh --help` | 사용 정보를 표시합니다 |

**데이터베이스 저장소: 호스트 디렉터리가 아닌 Docker named volume을 사용합니다.**

Compose는 PostgreSQL을 `heym-postgres-data` Docker 볼륨에 저장합니다. 이전 버전에서는 호스트 디렉터리 `./data/postgres`를 bind mount 방식으로 사용했습니다. macOS(virtiofs) 및 Windows/WSL2에서의 호스트 bind mount는 PostgreSQL이 요구하는 `fsync` 및 파일 닫기 보장을 제공하지 못합니다. 이러한 환경의 Cluster는 WAL 세그먼트에서 `PANIC: could not close file … Input/output error`가 발생하며 시간이 지남에 따라 손상됩니다. Linux bind mount는 영향을 받지 않았지만, 이제 모든 플랫폼에서 동일한 레이아웃을 사용합니다.

여전히 `./data/postgres`에 데이터가 있는 배포를 업그레이드하는 것은 일회성 단계입니다. `./deploy.sh`가 이를 감지하면 빌드 전에 중지하고 먼저 마이그레이션할 것을 요청합니다:

```bash
./deploy.sh --migrate-pgdata   # stop services, copy into the volume, rebuild indexes
./deploy.sh                    # deploy as usual
```

**마이그레이션은 인덱스도 재구축합니다.** 복사는 바이트 단위로 이루어지므로, 이전 bind mount로 인해 발생한 인덱스 손상도 함께 이동합니다. 따라서 `--migrate-pgdata`는 새 볼륨에서 `postgres` 서비스만 단독으로 시작하고, 이에 대해 `reindexdb`를 실행한 후, 나머지 스택이 올라오기 전에 다시 중지합니다. 이는 중요한데, 이러한 종류의 손상은 인덱스 항목이 힙의 끝을 넘어선 위치를 가리키도록 남기기 때문입니다. 이러한 상태는 `pg_amcheck`가 정상으로 보고하므로, 검사를 통과했다고 해서 테이블이 건강하다는 증거가 되지 않습니다. REINDEX는 해당 항목을 복구하지만, 이전 파일 시스템이 이미 잃어버린 힙 페이지는 복원할 수 없습니다. 크고 건강한 것으로 알려진 데이터베이스에서는 `./deploy.sh --migrate-pgdata --skip-reindex`로 재구축을 건너뛸 수 있습니다.

복사는 비파괴적입니다. `./data/postgres`는 백업으로 그대로 유지되며, 마이그레이션은 이미 데이터베이스가 들어 있는 볼륨을 덮어쓰지 않습니다. 어느 단계에서든 실패하면 새 볼륨이 제거되므로, 절반만 마이그레이션된 Cluster가 실수로 배포되는 일은 결코 없습니다. Workflow가 온전한지 확인한 후 이전 디렉터리를 삭제하십시오. `postgres` 컨테이너에도 동일한 보호 장치가 적용되므로, 수동으로 `docker compose up`을 실행해도 데이터 위에 빈 데이터베이스가 조용히 초기화되지 않습니다. 새로 설치하는 경우에는 아무런 조치가 필요하지 않습니다.

**서비스 주소 (프로덕션):**

프론트엔드 컨테이너는 `FRONTEND_PORT`(기본값: 4017)에 노출됩니다. 백엔드 API는 `/api` 경로 아래에서 제공되며, 프론트엔드 컨테이너를 통해 프록시됩니다. 따라서 프로덕션에서는 공개적으로 노출되는 포트가 하나뿐입니다.

**컨테이너 개요:**

| 컨테이너 | 설명 |
|-----------|-------------|
| `heym-db` | 관계형 데이터베이스 |
| `heym-backend` | FastAPI API 서버 (8개의 worker, `backend/Dockerfile`에서 빌드됨) |
| `heym-frontend` | 빌드된 Vue 앱을 제공하는 프론트엔드 preview 컨테이너 (`frontend/Dockerfile`에서 빌드됨) |

**버전 업데이트 배지:**

앱 헤더에는 실행 중인 Docker 빌드 버전이 표시됩니다. 해당 버전이 최신 Heym GitHub 릴리스보다 뒤처져 있으면, 버전 옆에 보라색 **Update** 배지가 나타납니다. 버전이나 배지를 클릭하면 Heym GitHub 릴리스 페이지가 열립니다.

---

## 사전 빌드된 이미지: `docker run`

앱을 로컬에서 빌드하지 않으려면, 게시된 컨테이너 이미지를 가져와 직접 실행할 수 있습니다.

이 이미지는 프런트엔드와 백엔드를 하나의 컨테이너에서 함께 시작합니다. PostgreSQL은 여전히 외부에 있지만, `.env.example`에서 `DATABASE_URL` 또는 `POSTGRES_*` 변수 중 하나를 제공할 수 있습니다.

> **데이터베이스를 Docker 명명된 볼륨에 저장하십시오.** 릴리스 이미지에는 데이터베이스가 포함되어 있지 않으므로, `DATABASE_URL` 뒤의 PostgreSQL은 직접 실행해야 합니다. 호스트 경로 대신 `-v heym-postgres-data:/var/lib/postgresql/data`로 마운트하십시오. macOS(virtiofs)와 Windows/WSL2에서는 바인드 마운트된 PostgreSQL 데이터 디렉터리가 데이터베이스가 요구하는 `fsync` 보장을 준수하지 않아 시간이 지나면 cluster가 손상됩니다.

> **벡터 저장소 백엔드.** `run.sh`와 `deploy.sh`는 공식 `postgres:16` 이미지를 실행하고 시작 시 `postgresql-16-pgvector` 패키지를 자동 설치하므로, **Postgres (pgvector) RAG 백엔드**가 데이터 변경 없이 바로 작동합니다. 그러나 사전 빌드된 단일 컨테이너 이미지는 **사용자가** 제공하는 PostgreSQL에 연결합니다. 해당 데이터베이스는 Postgres 백엔드를 사용하려면 `vector` 확장을 지원해야 합니다. Heym은 자체적으로 관리하지 않는 데이터베이스에 pgvector를 설치할 수 없습니다. 이것이 없으면 시작 마이그레이션이 pgvector 테이블을 정상적으로 건너뜁니다. 배포는 여전히 성공하고, Qdrant RAG는 계속 작동하며, Postgres 벡터 저장소를 생성하거나 업로드하면 pgvector가 활성화될 때까지 명확한 "backend unavailable" 메시지를 반환합니다.

**직접 이미지 실행 시에는 키를 직접 설정하십시오.** `run.sh`/`deploy.sh`와 달리, 사전 빌드된 이미지는 키를 자동 생성하지 않습니다. `cp .env.example .env` 후 두 개의 빈 키를 채우십시오(제자리에서 교체하면 중복 항목을 피할 수 있습니다):

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **파일 및 플러그인 마운트를 절대 경로로 만드십시오.** `FILE_STORAGE_DIR`과 `HEYM_PLUGINS_DIR`은 기본적으로 상대 경로 `./data/files`와 `data/plugins`로 설정되며, 릴리스 이미지는 `/app/backend`에서 백엔드를 시작합니다. 상대 경로로 두면 `/app/backend/data/files`와 `/app/backend/data/plugins`로 해석되므로, 위의 두 바인드 마운트는 아무것도 받지 못하고 컨테이너가 교체될 때 업로드가 손실됩니다. `-e` 플래그는 `.env.example`이 `--env-file`을 통해 제공하는 상대 값을 재정의합니다. 명령줄 `-e`가 `--env-file`보다 우선하기 때문입니다. Compose(`./deploy.sh`)는 이것이 필요하지 않습니다. 해당 이미지는 `/app`에서 백엔드를 실행하며, 여기서는 상대 기본값이 이미 마운트에 도달합니다.

> **Docker 소켓 접근.** `/var/run/docker.sock`을 마운트하면 백엔드가 호스트 Docker 데몬을 광범위하게 제어할 수 있습니다. 기본 Docker Compose 서비스와 직접 `docker run` 예제는 `docker` 명령을 실행하는 Docker 기반 MCP stdio 도구를 위해 이를 포함합니다. Logs 탭은 여전히 `DOCKER_LOGS_ENABLED=true`와 신뢰할 수 있는 사용자 이메일의 쉼표로 구분된 목록이 있는 `DOCKER_LOGS_ALLOWED_EMAILS`를 필요로 합니다. Docker 로그를 활성화하기 전에 신뢰할 수 있는 관리자 계정을 생성하거나, `ALLOW_REGISTER=false`를 유지하여 검증되지 않은 자체 등록이 허용 목록에 있는 이메일을 차지할 수 없도록 하십시오. 사용자 정의 Python 도구는 이 소켓을 받지 **않습니다**. 이들은 Docker 소켓이 없는 별도의 강화된 컨테이너에서 실행됩니다. [Security](../reference/security.md#python-tool-sandbox)를 참조하십시오.

> **Codex runner.** Codex 노드는 Codex의 Linux 샌드박스가 네임스페이스를 생성할 수 있도록 동일한 `ghcr.io/heymrun/heym` 이미지를 형제 runner 컨테이너(`--entrypoint codex`)로 사용합니다. 직접 이미지 설정에서 Codex Workflow를 원한다면 `heym-codex-workspaces` 볼륨 마운트를 유지하십시오. runner는 Docker 소켓이나 백엔드 시크릿을 받지 않습니다.

> **OpenCode Go runner.** OpenCode Go 노드는 동일한 이미지를 강화된 형제 runner(`--entrypoint opencode`)로 사용하며 `heym-opencode-workspaces`를 공유합니다. 직접 이미지 설정에서 OpenCode Workflow를 원한다면 해당 볼륨 마운트를 유지하십시오. runner는 Docker 소켓이나 GitHub Token을 받지 않습니다.

> **Skill 샌드박스.** Agent 노드의 Python skill은 `heym-codex-workspaces` 볼륨을 공유하는 강화된 형제 컨테이너에서 실행되므로, Codex뿐만 아니라 skill을 위해서도 해당 볼륨 마운트를 유지하십시오. 각 실행은 격리된 실행별 하위 경로를 받으며, 형제 컨테이너는 Docker 소켓이나 백엔드 시크릿을 받지 않습니다. 이는 **Docker Engine 25.0+**가 필요합니다. 이전 엔진이나 볼륨이 없으면 `HEYM_PYTHON_TOOL_SANDBOX=auto`는 fail closed 방식으로 실패합니다. 신뢰할 수 있는 단일 사용자 설정에만 `HEYM_PYTHON_TOOL_SANDBOX=subprocess`를 설정하십시오. [Security](../reference/security.md#skill-sandbox)를 참조하십시오.

> **Playwright에는 `--shm-size 2g`가 필요합니다.** Docker는 컨테이너에 64 MB의 `/dev/shm`을 할당하며, Chromium은 이 용량에서 렌더러가 충돌합니다. 단계 기반 Playwright 노드는 이 컨테이너 내부에서 Chromium을 하위 프로세스로 실행하므로, 이 제한은 이 컨테이너의 제한입니다. 사용자 정의 `playwrightCode`는 자체적으로 설정하는 형제 컨테이너에서 실행됩니다. `docker-compose.yml`은 이미 `shm_size: "2gb"`를 선언하고 있으므로 `run.sh`와 `deploy.sh`는 영향을 받지 않습니다. 일반 `docker run`만 이 플래그가 필요합니다.

> **Playwright Run Code.** 사용자 정의 Playwright Python에는 `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED=true`와 위의 Docker 소켓 마운트가 필요합니다. 릴리스 이미지는 GHCR 레이아웃(`/app/backend/.venv`)을 위해 `HEYM_PLAYWRIGHT_SANDBOX_IMAGE` / `HEYM_PLAYWRIGHT_SANDBOX_PYTHON`을 설정합니다. Compose `./deploy.sh`는 샌드박스 이미지를 기본값으로 `heym-backend:local`로 설정합니다. 샌드박스 컨테이너 내부의 Chromium 실행 인수에는 `--no-sandbox`를 유지하십시오.

**직접 이미지 실행을 위한 최소 환경 변수:**

| 변수 | 필수 여부 | 목적 |
|----------|----------|---------|
| `DATABASE_URL` | 선택 사항 | 전체 PostgreSQL 연결 문자열 재정의 |
| `POSTGRES_HOST` | `DATABASE_URL`이 비어 있는 경우 필수 | PostgreSQL 호스트 |
| `POSTGRES_PORT` | `DATABASE_URL`이 비어 있는 경우 필수 | PostgreSQL 포트 |
| `POSTGRES_USER` | `DATABASE_URL`이 비어 있는 경우 필수 | PostgreSQL 사용자 이름 |
| `POSTGRES_PASSWORD` | `DATABASE_URL`이 비어 있는 경우 필수 | PostgreSQL 비밀번호 |
| `POSTGRES_DB` | `DATABASE_URL`이 비어 있는 경우 필수 | PostgreSQL 데이터베이스 이름 |
| `SECRET_KEY` | 필수 | JWT 서명 시크릿 |
| `ENCRYPTION_KEY` | 필수 | 자격 증명 암호화 키 |
| `FRONTEND_URL` | 권장 | 공개 브라우저 URL, 특히 OAuth 콜백용 |
| `CORS_ORIGINS` | 권장 | 허용된 브라우저 오리진 |
| `FILE_STORAGE_DIR` | 권장 | 해당 경로를 마운트할 때 절대 경로 `/app/data/files`로 설정하십시오. 상대 경로 `./data/files` 기본값은 이 이미지의 `/app/backend` 아래에서 확인되어 마운트를 놓칩니다 |
| `ALLOW_REGISTER` | 권장 | 공개 가입이 의도되지 않은 경우 프로덕션에서 `false`로 설정하되, 관리자 계정이 존재한 이후에만 설정하십시오. 최초 사용자 부트스트랩은 없습니다 |
| `DOCKER_LOGS_ENABLED` | 선택 사항 | Logs 탭이 Docker 소켓 접근을 사용하도록 허용하려면 `true`로 설정하십시오 |
| `DOCKER_LOGS_ALLOWED_EMAILS` | `DOCKER_LOGS_ENABLED=true`인 경우 필수 | Docker 로그 접근이 허용된 신뢰할 수 있는 사용자 이메일의 쉼표로 구분된 목록 |
| `HEYM_PLUGINS_ENABLED` | 선택 사항 | 플러그인 하위 시스템(zip으로 설치된 사용자 정의 노드)을 활성화하려면 `true`로 설정하십시오. 기본값은 비활성화 |
| `HEYM_PLUGIN_ADMIN_EMAILS` | `HEYM_PLUGINS_ENABLED=true`인 경우 필수 | 플러그인 설치/제거가 허용된 운영자 이메일의 쉼표로 구분된 목록 |
| `HEYM_PLUGINS_DIR` | 선택 사항 | 플러그인 파일이 저장되는 위치. 해당 경로를 마운트할 때 절대 경로 `/app/data/plugins`로 설정하십시오. 상대 경로 `data/plugins` 기본값은 이 이미지의 `/app/backend` 아래에서 확인되어 마운트를 놓칩니다 |
| `HEYM_PYTHON_TOOL_SANDBOX` | 선택 사항 | Python 도구 격리 모드. 기본값은 `auto`(강화된 Docker 샌드박스, fail closed). [Security](../reference/security.md#python-tool-sandbox)를 참조하십시오 |
| `HEYM_PYTHON_TOOL_IMAGE` | 선택 사항 | Python 도구 샌드박스 이미지 재정의. 비어 있으면 백엔드 이미지를 자동 감지합니다 |
| `HEYM_CODEX_DOCKER_WORKSPACE_VOLUME` | 선택 사항 | 형제 Codex 러너 컨테이너에서 사용하는 Docker 볼륨. Docker 배포에서 기본값은 `heym-codex-workspaces`입니다 |
| `HEYM_CODEX_NETWORK_ACCESS` | 선택 사항 | Codex의 샌드박스 명령이 파일/의존성을 다운로드하도록 허용합니다. Docker 배포에서는 기본적으로 활성화됩니다 |
| `HEYM_OPENCODE_DOCKER_WORKSPACE_VOLUME` | 선택 사항 | 형제 OpenCode 러너 컨테이너에서 사용하는 Docker 볼륨. Docker 배포에서 기본값은 `heym-opencode-workspaces`입니다 |

**참고:**

- 이미지는 포트 `4017`을 노출합니다
- 백엔드는 내부에 유지되며 `/api` 아래에서 프록시됩니다
- `POSTGRES_HOST=localhost`인 경우, 릴리스 이미지는 필요할 때 이를 `host.docker.internal`로 자동 재작성하여 동일한 `.env`가 macOS Docker/Desktop 도구의 호스트 수준 PostgreSQL 컨테이너와 함께 작동하도록 합니다
- Drive 업로드와 스킬 생성 파일이 컨테이너 재시작 후에도 유지되도록 하려면 `data/files` 마운트를 유지하십시오
- **플러그인:** 활성화하려면 `HEYM_PLUGINS_ENABLED=true`와 `HEYM_PLUGIN_ADMIN_EMAILS`를 설정하고, 설치된 플러그인 파일이 컨테이너 재생성 후에도 유지되도록 `data/plugins`를 마운트하십시오. 플러그인 메타데이터는 PostgreSQL에 저장되므로 이 또한 유지됩니다. 플러그인이 선언한 pip `dependencies`는 설치 시점에 컨테이너에 설치됩니다. 이미지 파일 시스템은 임시적이므로, 설치된 모든 플러그인에 대해 **시작 시 자동으로 재설치**됩니다(릴리스 이미지의 `uv` venv는 쓰기 가능하므로 단일 컨테이너 이미지에서도 작동합니다)

### 기존 데이터베이스를 명명된 볼륨으로 이동

`./deploy.sh --migrate-pgdata`는 Compose 스택만 인식합니다. 자체 PostgreSQL 컨테이너에 대해 릴리스 이미지를 실행하고 해당 컨테이너가 호스트 디렉터리를 바인드 마운트하는 경우, 직접 마이그레이션하십시오.

먼저 데이터베이스 컨테이너가 무엇을 사용하는지 확인하십시오:

```bash
docker inspect <your-postgres-container> | grep -A8 Mounts
```

`"Type"`이 `bind`로 표시되면 명명된 볼륨으로 이동하십시오:

```bash
# 1. Stop the database. Heym can stay down for this.
docker stop <your-postgres-container>
docker rm <your-postgres-container>

# 2. Copy the data directory into a named volume. Give each instance its own

# 이 Docker 호스트가 둘 이상의 Heym 배포를 실행하는 경우 볼륨 이름을 지정하십시오.
docker volume create heym-postgres-data
docker run --rm \
  -v "/path/to/your/data/postgres:/legacy:ro" \
  -v heym-postgres-data:/pgdata \
  --entrypoint sh <your-postgres-image> -c 'cp -a /legacy/. /pgdata/'

# 3. 볼륨에서 PostgreSQL을 다시 시작하되, 이전에 사용하던 플래그를 재사용하고
#    bind mount만 교체하십시오.
docker run -d --name <your-postgres-container> --restart always \
  ... your original -e / -p / --network flags ... \
  -v heym-postgres-data:/var/lib/postgresql/data \
  <your-postgres-image>

# 4. 연결이 허용되면 인덱스를 재구성하십시오.
docker exec <your-postgres-container> reindexdb -U <user> -d <database>
```

**2단계와 3단계에서는 `postgres:16`이 아닌 자체 이미지를 사용하십시오.** 데이터베이스가 `pgvector/pgvector:pg16` 또는 다른 변형을 실행하는 경우, 복사된 Cluster를 기본 이미지로 시작하면 해당 이미지가 기대하는 확장 라이브러리가 없어 실패할 수 있습니다.

이 절차는 원본 데이터 디렉터리를 건드리지 않으므로 롤백 경로로 그대로 남습니다. 마이그레이션된 데이터베이스가 Workflow를 정상적으로 처리하는 것을 확인한 후에만 삭제하십시오. 4단계가 중요한 이유는 Compose 마이그레이션에서와 같습니다. 즉, 복사본은 기존의 인덱스 손상을 그대로 가져가기 때문입니다.

---

## 둘 이상의 인스턴스 실행

지금까지 설명한 모든 내용은 단일 Heym 인스턴스를 배포합니다. 하나의 머신으로 충분하지 않게 되면, 두 번째 인스턴스를 동일한 PostgreSQL 데이터베이스에 연결하십시오. 그러면 해당 인스턴스가 worker로 참여합니다. 즉, 백그라운드 실행 — Cron, Webhook, MCP 도구 호출, 채팅 Trigger — 이 **Settings → Instances**에서 설정한 비율에 따라 인스턴스 간에 분배됩니다.

인스턴스들은 서로 통신하지 않습니다. Postgres가 작업을 전달하므로 worker는 열린 포트나 메인 인스턴스로의 경로가 필요하지 않으며, 메시지 브로커도 관여하지 않습니다. 로컬 디스크에 접근하는 작업 — Drive 파일, 코딩 에이전트 워크스페이스, 설치된 플러그인 — 은 항상 메인 인스턴스에서 실행되므로 파일 시스템을 통해 공유할 필요가 없습니다.

Cluster가 대신 강제할 수 없는 두 가지 규칙이 있습니다. 모든 인스턴스는 동일한 `SECRET_KEY`와 `ENCRYPTION_KEY`를 사용해야 하며, ingress는 메인 인스턴스만을 가리켜야 합니다. 두 규칙 모두 배치 규칙 및 비율 선택 방법과 함께 [Load Distribution](../reference/cluster.md)에서 설명합니다.

> 이는 고가용성이 아닌 부하 분산입니다. 메인 인스턴스는 ingress, 파일 스토리지, 에디터에 대한 단일 장애 지점으로 남습니다.

## 일반적인 Workflow

**최초 설정:**

```bash
./run.sh          # development — creates .env from .env.example and generates SECRET_KEY/ENCRYPTION_KEY automatically
# or
./deploy.sh       # production — same automatic .env and key generation
```

미리 빌드된 `docker run` 이미지의 경우, 먼저 키를 수동으로 생성하십시오(위의 **Prebuilt Image** 섹션을 참조하십시오).

**코드 변경 후 프로덕션 업데이트:**

```bash
git pull
./deploy.sh       # rebuilds images, zero-downtime swap
```

**프로덕션 로그 확인:**

```bash
./deploy.sh --logs
```

**프로덕션 서비스 중지:**

```bash
./deploy.sh --down
```

---

## 관련 문서

- [Introduction](./introduction.md) – 플랫폼 개요
- [Quick Start](./quick-start.md) – 첫 번째 Workflow 구축
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 전체 구성 참조
- [Security](../reference/security.md) – JWT, 암호화, CORS 설정
- [Load Distribution](../reference/cluster.md) – 하나의 데이터베이스에 대해 여러 인스턴스 실행

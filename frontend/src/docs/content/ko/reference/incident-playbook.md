# Heym Incident Playbook (L0)

이 플레이북을 사용하여 Heym 장애를 확인하고, 사용자 영향을 평가하며, 심각도(severity)를 선택하고, 올바른 복구 절차와 담당자에게 신속하게 도달하십시오.

세부 절차: [Heym Runbook (L1)](./operations-runbook.md)

최종 검토일: 2026-11-10. 범위: Docker Compose 또는 Kubernetes 환경의 자체 호스팅 Heym, 단일 인스턴스 또는 Cluster.

## 배포 인수인계 (Deployment handover)

온콜(on-call) 근무 시 이 문서를 사용하기 전에 각 환경별로 이 표를 작성하십시오. 이름, URL, 용량 목표 및 복구 목표는 배포 환경에 따라 다릅니다. 저장소의 예시는 프로덕션 인벤토리가 아닙니다.

| 항목 | 배포 환경 값 |
| --- | --- |
| 환경 및 Heym 공개 URL | `<environment>`, `<public-url>` |
| 플랫폼 온콜 담당자 및 대행자 | `<rotation-or-contact>`, `<backup-contact>` |
| 장애 대응 채널 및 이슈 추적 시스템 | `<channel>`, `<tracker-url>` |
| 데이터베이스 온콜 담당자 및 데이터베이스 식별자 | `<contact>`, `<database-id>` |
| 인프라, 네트워크, 스토리지 담당자 | `<contacts>` |
| 릴리스 담당자 및 배포 시스템 | `<contact>`, `<deployment-url>` |
| 애플리케이션 오류, 지연 시간, 가용성 대시보드 | `<dashboard-url>` |
| 호스트 또는 Pod CPU, 메모리, 디스크, 재시작 대시보드 | `<dashboard-url>` |
| PostgreSQL 연결, 잠금, 디스크, 복제 대시보드 | `<dashboard-url>` |
| 로그 및 선택적 OTel Trace 백엔드 | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose 프로젝트/파일 또는 Kubernetes 컨텍스트/네임스페이스 | `<exact-target>` |
| Main, Worker, 데이터베이스, 스토리지 위치 | `<services-or-deployments>`, `<storage-ids>` |
| 승인된 스모크 Workflow 및 예상 결과 | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| 데이터베이스 및 파일 백업 절차, 최신 복구 테스트 | `<procedure-url>`, `<test-date>` |
| 목표 복구 시간 및 목표 복구 시점 (RTO, RPO) | `<RTO>`, `<RPO>` |

연락처와 대시보드 링크는 배포 환경의 접근이 제한된 운영 복사본에 보관하십시오. 증거 자료에는 자격 증명이나 Workflow Payload 대신 ID, 타임스탬프, 개수, 정제된 오류가 포함되어야 합니다.

## 플랫폼 인벤토리

| 구성 요소 | 책임 | 장애 시 영향 |
| --- | --- | --- |
| 프론트엔드 및 Main 백엔드 | UI, API, MCP, Portal, 대화형 실행 | 공개 라우트와 Main 프로세스를 별도로 확인 |
| PostgreSQL | 애플리케이션 상태, 실행 레지스트리, Run Queue, 동시성 슬롯, 조율, 알림 | 데이터베이스 중단 시 요청 처리와 백그라운드 실행이 모두 중단될 수 있음 |
| Worker 인스턴스 (Cluster 모드 활성화 시) | 큐에 대기 중인 적격 백그라운드 실행 처리 | 정상적인 Worker가 Main의 공개 Endpoint를 대체할 수 없음 |
| 선출된 Leader 프로세스 | Cron, 알림 평가, 백그라운드 조율 | 호환 가능한 Worker가 Leader가 될 수 있음(역할이 Main으로 변경되는 것은 아님) |
| Main의 영구 스토리지 | Drive 파일, 설치된 플러그인, Coding-Agent 작업 공간 | Main과 함께 스토리지를 복구해야 함(Ingress를 Worker로 라우팅해도 복구되지 않음) |
| 각 실행 인스턴스의 Sandbox 백엔드 | 격리된 실행을 위한 Docker 컨테이너 또는 Kubernetes Pod | Sandbox 백엔드 장애는 UI가 작동하더라도 선택된 노드에 영향을 줄 수 있음 |
| Workflow 종속성 | 모델 제공업체, MCP 서버, 외부 API, 데이터 저장소, 메시징 서비스 | 단일 종속성 장애인지 전체 플랫폼 장애인지 확인 |
| 선택적 OTel Collector | 내보낸 Workflow, 노드, Agent 도구 Span | 내보낸 Trace 누락만으로 실행 실패를 단정할 수 없음 |

Heym의 내장 Run Queue는 PostgreSQL을 사용합니다. Redis, RabbitMQ, 벡터 저장소는 Workflow 종속성이 될 수 있지만, 내장 큐의 필수 서비스는 아닙니다.

`GET /api/health`는 프로세스 상태와 버전만 보고합니다. PostgreSQL, 큐, Leader 선출, Sandbox 용량, 자격 증명 동기화는 테스트하지 않습니다. 정상(초록색) 응답은 단일 검사일 뿐이며 엔드투엔드 준비 상태를 보장하지 않습니다.

## 초기 5분 대응

| 단계 | 조치 | 결정 또는 증거 |
| --- | --- | --- |
| 1 | 알림을 확인하고 환경, 서비스, 시작 시간을 검증 | UTC 타임스탬프와 가장 최근의 릴리스/구성 변경 사항 기록 |
| 2 | 공개 UI 및 `/api/health`를 확인한 다음 직접 Main 백엔드 확인 | 직접 백엔드는 정상인데 공개 접근이 실패하면 라우팅 또는 프론트엔드 문제 가능성 |
| 3 | PostgreSQL 연결성 및 연결 풀 부하 확인 | 애플리케이션 서비스를 재시작하기 전에 데이터베이스 장애를 L1으로 라우팅 |
| 4 | 컨테이너/Pod 상태, CPU, 메모리, 스토리지 및 최근 오류 확인 | 인프라 장애, 과부하, 특정 Workflow 장애 분리 |
| 5 | Cluster 모드에서 **설정 > 인스턴스**, 큐 상태, Leader 증거 확인 | Main 유실, 오프라인/불일치 Worker 또는 Main 전용 작업 확인 |
| 6 | 심각도를 할당하고 라우팅 테이블에서 완화 조치 1개 시작 | P1/P2의 경우 즉시 이슈를 생성하고 관련 담당자 소집 |
| 7 | 안전한 프로덕션 모드 스모크 Workflow 실행을 확인하고 복구 모니터링 | 큐 대기 시간(Queue Age), 오류, 리소스 개선 확인 후 다음 업데이트 시간 설정 |

릴리스와 장애가 겹치는 경우, [잘못된 배포 또는 구성 회귀](./operations-runbook.md#bad-deployment-or-configuration-regression) 문서를 확인하십시오. 롤백 전에 스키마 호환성을 검토하십시오.

## 심각도 및 대응 기준

다음은 초기 대응 목표입니다. 배포 환경의 장애 정책 및 비즈니스 영향도가 더 엄격한 경우 해당 기준을 적용하십시오.

| 심각도 | 사례 | 대응 |
| --- | --- | --- |
| P1 | 모든 사용자에 대해 Main 사용 불가, 데이터베이스 중단 또는 쓰기 실패, 광범위한 실행 실패, 중요 인테이크 중단 | 즉각적인 완화, 장애 기록, 플랫폼 및 종속성 온콜 소집 |
| P2 | 백로그 증가, Worker 용량 손실, 연결 고갈 임박, 공유 용량을 저하시키는 단일 Workflow, 반복적인 OOM | 즉시 완화 시작, 15분 이내 격리 목표, 장애 기록 |
| P3 | 격리된 Workflow/제공업체 장애, 플랫폼의 정상 용량 내 제한된 영향 | Workflow 또는 종속성 담당자 추적, 온콜 메모 기록 |
| P4 | 정보성 신호, 예상된 용량 추세, 검증된 오탐 | 확인, 문서화, 필요 시 모니터링 조정 |

## 신호별 L1 라우팅

알림 링크를 구성할 때 이 상대 앵커를 사용하십시오. 모니터링 서비스에 절대 URL이 필요한 경우 호스팅된 운영 복사본의 위치를 접두사로 추가하십시오.

| 신호 | 시작 위치 |
| --- | --- |
| UI/API 사용 불가, 공용 5xx, 프로세스 헬스체크 실패 | [UI 또는 API 중단](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL 연결 불가, 연결 거부, 쓰기 실패 | [데이터베이스 중단](./operations-runbook.md#postgresql-down-or-not-writable) |
| 클라이언트 초과, 풀 타임아웃, 잠금 대기, 활성 연결 급증 | [데이터베이스 연결 및 잠금](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| 통제된 백엔드/Worker 재시작 필요 | [서비스 재시작](./operations-runbook.md#controlled-service-restart) |
| 실행 횟수, 총 소요 시간, Token, CPU 또는 메모리 급증 | [가장 많은 리소스를 소비하는 Workflow](./operations-runbook.md#most-resource-consuming-workflows) |
| 큐 증가, 실행 대기 중이거나 중단된 것으로 보임 | [큐 백로그](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| 오프라인/불일치 인스턴스, 유휴 Worker, 스케줄러 또는 분배 문제 | [Cluster 확인](./operations-runbook.md#cluster-mode-checks) |
| Worker는 정상이나 Main 인스턴스 유실 | [Main 인스턴스 사용 불가](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook 오류, MCP/Portal 장애, SSE 연결 끊김 | [Ingress 및 실행 Endpoint](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, 디스크 가득 참, Persistent Volume 장애 | [컨테이너, Pod 또는 스토리지 문제](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| 이미지, 환경 또는 스키마 변경 후 오류 증가 | [잘못된 배포](./operations-runbook.md#bad-deployment-or-configuration-regression) |
| Agent/LLM/MCP 제공업체 오류, 429, 자격 증명 실패 | [모델 또는 통합 장애](./operations-runbook.md#model-credential-or-integration-failure) |
| Code/Playwright/Skill/Coding-Agent Sandbox 장애 | [Sandbox 장애](./operations-runbook.md#sandbox-failure) |
| 복구가 목표를 달성할 수 없음, 데이터베이스 또는 파일 유실 | [복구 및 재해 대응](./operations-runbook.md#recovery-and-disaster-response) |

## 에스컬레이션

| 발견 사항 | 소집 대상 | 제공 정보 |
| --- | --- | --- |
| 여러 인터페이스 또는 Workflow에 영향 | 플랫폼 온콜 및 인시던트 리드 | 환경, 범위, 시작 시간, 완화 조치, 다음 업데이트 시간 |
| 데이터베이스 사용 불가, 포화, 잠금 또는 디스크 부족 | 데이터베이스 온콜 | 데이터베이스 ID, 연결 수, 블로킹 PID, 정제된 오류, 스토리지 상태 |
| Pod/노드 장애, 스토리지 마운트 실패, Sandbox 용량 부족 | 인프라/스토리지 담당자 | 컨텍스트, 네임스페이스, 워크로드, Pod 이벤트, 리소스 부하 |
| 직접 백엔드는 정상이나 공개 라우트 실패 | 네트워크/Ingress 담당자 | 영향받는 라우트, 상태 코드, 지연 시간, 백엔드 비교 |
| 단일 Workflow가 부하를 독점하거나 단독 실패 | Workflow 담당자 | Workflow/실행 ID, Trigger 소스, 속도, 시간대, 임시 제한 |
| 연관된 배포/구성 변경 | 릴리스 담당자 | 실행 중인 이미지 다이제스트, 배포 시간, 스키마 리비전, 마지막 정상 버전 |
| 제공업체 쿼터/인증/가용성 문제 | 자격 증명 또는 통합 담당자 | 제공업체, 모델/서비스, 상태 코드, 안전한 경우 요청 ID(비밀값 제외) |

초기 완화 조치 후에도 P1/P2 영향이 지속되면 이미 수집된 증거를 바탕으로 즉시 에스컬레이션하십시오. 완전한 근본 원인 분석을 기다리지 마십시오.

## 장애 발생 시 예상 동작

| 장애 | 계속 유지될 수 있는 기능 | 초기 조치 |
| --- | --- | --- |
| PostgreSQL 사용 불가 | 정적 프론트엔드는 계속 로드될 수 있음 | 데이터베이스 경로 복구(모든 애플리케이션 인스턴스를 재시작하지 마십시오) |
| Main 사용 불가, Worker 정상 | 호환 가능한 Worker가 Leader가 된 경우 적격 백그라운드 작업 및 스케줄링 지속 가능 | 영구 스토리지와 함께 Main 복구(공개 UI/API/MCP/Portal은 사용 불가 상태 유지) |
| Worker 사용 불가 | 재할당 시 다른 적격 인스턴스가 큐 작업을 인계 | 트래픽을 추가하기 전에 배치, 예비 용량, 복구 상태 확인 |
| 중단된 실행 | 복구 가능한 적격 실행은 처음부터 한 번 재시작될 수 있음 | 수동 재실행 전에 자동 복구 및 외부 부작용 확인 |
| Main 전용 워크로드 과부하 | Worker가 유휴 상태로 유지될 수 있음 | 위반 인테이크를 줄이거나 Main 용량 증설(가중치 변경으로 고정 작업을 이동할 수 없음) |
| 내부 알림 사용 불가 | 외부 가동 시간/DB/인프라 모니터링은 계속 작동 가능 | Heym 외부 모니터링 사용(Heym 알림은 동일한 DB 및 스케줄러에 의존함) |
| Sandbox 또는 제공업체 사용 불가 | 해당 종속성이 없는 Workflow는 정상 작동 가능 | 영향받는 Workflow를 격리하고 종속성 복구 |

## 복구 및 장애 종료

1. 공개 접근, 데이터베이스 접근, 의도한 인스턴스 적격성 및 안전한 프로덕션 모드 스모크 Workflow를 확인합니다. 에디터 테스트로는 Worker 디스패치를 증명할 수 없습니다.
2. 최소 10분 동안 안정적인 오류율, 지연 시간, 리소스 사용량 및 감소하는 큐 대기 시간(Queue Age)을 관찰합니다. 또한 예정된 다음 중요 스케줄 작업 또는 합의된 동등한 스모크 검사를 모니터링합니다.
3. 실패, 복구, 건너뜀, 만료 및 대기 중인 실행에 대해 Workflow 담당자와 대조 확인합니다. 재실행 전에 외부 부작용을 확인하십시오.
4. 임시 Trigger 일시 중지, 제한, Worker 가중치를 점진적으로 복원합니다. 남아 있는 모든 제한에 담당자와 만료 시간을 할당합니다.
5. 영향도, UTC 타임라인, 조치 사항, 증거, 잔존 위험을 반영하여 장애 기록을 업데이트합니다. P1/P2에 대해 근본 원인 검토를 할당하고 절차가 누락된 경우 두 문서를 모두 업데이트합니다.

## 관련 운영 참조

- [L1 명령 설정 및 확인](./operations-runbook.md#command-setup)
- [실행 및 배포](../getting-started/running-and-deployment.md)
- [부하 분산](./cluster.md)
- [Kubernetes 배포](../getting-started/kubernetes.md)
- [보안 및 키 교체](./security.md)

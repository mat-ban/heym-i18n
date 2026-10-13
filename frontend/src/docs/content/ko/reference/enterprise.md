# Enterprise

Heym 플랫폼을 위한 상용 라이선스, 전문 지원 및 배포 서비스입니다.

## 개요

Heym은 소스 공개(source-available) 라이선스에 따라 무료로 사용 및 셀프 호스팅할 수 있습니다. 상용 라이선스, 프로덕션급 배포 지원 또는 전담 지원이 필요한 조직을 위해 Enterprise 플랜은 Heym 팀의 직접적인 서비스를 제공합니다.

| 서비스 | 설명 |
|---------|-------------|
| **프로덕션 에이전트 지원** | 아키텍처 검토, 에이전트 및 Workflow 설계 가이드, 에이전트를 프로덕션으로 전환하기 위한 직접 지원 |
| **도구 교육** | Workflow 편집기, AI 노드, 에이전트 및 통합을 다루는 팀 온보딩 세션 및 교육 |
| **Heym Q&A** | 플랫폼 관련 질문, 모범 사례 및 문제 해결을 위한 Heym 엔지니어링 팀 직접 접근 |
| **Kubernetes 배포** | 다중 워커 노드 구성, 사이드카 컨테이너, 스케일링 전략 및 Cluster 구성 지원 |
| **솔루션 컨설팅** | 통합 계획 및 아키텍처 권장 사항을 포함한 특정 사용 사례에 맞춘 커스텀 솔루션 설계 |
| **우선 지원 및 SLA** | 보장된 응답 시간 및 우선적 이슈 해결 |
| **커스텀 개발** | 조직의 요구 사항에 맞춘 기능 개발 및 수정 |

## Heym Work

[Heym Work](./heym-work.md)는 Heym 위에서 실행되는 비즈니스 팀용 인터페이스입니다. 사용자가 업무를 설명하고 몇 가지 질문에 답하면 테스트된 Workflow를 받고, 맞춤 제작된 페이지에서 작업하며, 싱글 사인온(SSO), Owner·Editor·Viewer 역할, 그리고 모든 실행에 기록되는 이름과 함께 검토에 응답할 수 있습니다. 자체 라이선스로 Heym 옆에서 함께 실행되며 **Settings → Heym Work**에서 연결할 수 있습니다. 자세한 내용 확인 및 체험판 신청은 [heym.run/enterprise](https://heym.run/enterprise)에서 가능합니다.

## 프로덕션 에이전트 지원

Heym 팀은 비즈니스 프로세스를 위한 에이전트와 Workflow를 설계, 구축 및 강화하는 데 도움을 드립니다. 여기에는 요구 사항 검토, 노드 구성 권장, 그리고 Workflow가 안정성, 관찰 가능성 및 거버넌스 모범 사례를 따르도록 보장하는 작업이 포함됩니다.

지원 범위는 [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Cron](../nodes/cron-node.md) Trigger를 비롯한 모든 노드 유형은 물론, [멀티 에이전트 오케스트레이션](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) 체크포인트, 브랜치 간 [병렬 실행](./parallel-execution.md)과 같은 고급 패턴까지 포함합니다.

## 도구 교육

팀의 기술 수준과 사용 사례에 맞춘 실습 교육 세션:

- Workflow 편집기 및 [캔버스 기능](./canvas-features.md)
- AI 기반 노드: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [에이전트 아키텍처](./agent-architecture.md) 및 멀티 에이전트 오케스트레이션
- [Credentials](./credentials.md) 관리 및 [서드파티 통합](./integrations.md)
- [Trigger](./triggers.md), [Webhook](./webhooks.md) 및 [Cron](../nodes/cron-node.md)을 통한 스케줄링
- [Expression DSL](./expression-dsl.md) 및 [전역 변수](./global-variables.md)
- [Teams](./teams.md) 협업 및 [Credentials 공유](./credentials-sharing.md)
- 고객 대면 채팅 인터페이스를 위한 [Portal](./portal.md) 배포
- AI Workflow 관찰 가능성을 위한 [Traces](../tabs/traces-tab.md) 및 [Evals](../tabs/evals-tab.md)

## Kubernetes 배포

표준 [실행 및 배포](../getting-started/running-and-deployment.md) 가이드는 단일 서버 프로덕션 구성을 위한 Docker Compose를 다룹니다. Enterprise 고객은 고가용성 및 수평적 스케일링을 위한 프로덕션 Kubernetes 배포 지원을 받으실 수 있습니다:

- **다중 워커 노드** — 중복성과 로드 밸런싱을 위해 Heym 백엔드 워커를 여러 Kubernetes 노드에 분산
- **사이드카 컨테이너** — 로그 수집, 모니터링 에이전트, 서비스 메시(Istio, Linkerd) 및 시크릿 주입(Vault)을 위한 사이드카 패턴 구성
- **리소스 계획** — CPU 및 메모리 requests/limits, pod disruption budget 및 horizontal pod autoscaling 정책
- **네트워킹** — Ingress 컨트롤러 구성, TLS 종료 및 백엔드, 프론트엔드, 데이터베이스 pod 간 내부 서비스 통신
- **영구 스토리지** — 적절한 StorageClass 및 백업 전략을 통한 데이터베이스 및 벡터 스토어 볼륨 프로비저닝
- **모니터링** — 컨테이너 메트릭, 로그 및 알림을 위한 Prometheus, Grafana 또는 기존 관찰 가능성 스택과의 통합

## 솔루션 컨설팅

모든 조직은 서로 다른 시스템과 제약 조건에 대해 에이전트를 운영합니다. Heym 팀은 다음과 같은 컨설팅을 제공합니다:

- Heym이 특정 사용 사례에 적합한지 평가
- 엔드투엔드 에이전트 및 Workflow 아키텍처 설계
- 기존 인프라 및 서드파티 서비스와의 통합 계획
- 복잡한 Workflow 디버깅 및 프로덕션 이슈 해결
- n8n, Zapier, Make.com과 같은 도구에서 기존 Workflow 마이그레이션

## 문의

라이선스 문의, 가격 또는 도입 상담 일정 예약은 **enterprise@heym.run**으로 Enterprise 팀에 연락하십시오.

## 관련 문서

- [실행 및 배포](../getting-started/running-and-deployment.md) — Docker Compose를 사용한 프로덕션 배포
- [보안](./security.md) — 플랫폼 보안 관행 및 구성
- [병렬 실행](./parallel-execution.md) — 다중 워커 실행 모델
- [Teams](./teams.md) — 팀 협업 및 리소스 공유
- [전체 기능 세트](./features.md) — Heym 기능의 전체 개요
- [Heym Work](./heym-work.md) — 비즈니스 팀을 위한 인터페이스 및 연결 방법

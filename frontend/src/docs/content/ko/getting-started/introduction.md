# 소개

**에이전트 시스템을 구축하십시오. 자신 있게 실행하십시오.**

Heym은 프로덕션 환경에서 AI 에이전트를 실행하고 관리하기 위한 인프라입니다. 에이전트를 오케스트레이션하고, 비즈니스 프로세스를 자동화하며, 모든 실행을 검사하고, 인간이 통제권을 유지하도록 합니다. Heym을 자체 인프라에 배포하십시오.

Heym에서 Workflow는 에이전트, 결정적 단계, 도구, 데이터가 함께 작동하는 방식을 정의합니다. 런타임은 해당 그래프를 실행하고, 모든 실행을 기록하며, 요청한 지점에서 인간 검토를 위해 일시 중지합니다. 시각적 캔버스는 Workflow를 구축하고 검사하는 공간이며, 동일한 Workflow는 API, 스케줄, 이벤트 Trigger, MCP 클라이언트, Portal 채팅에서도 실행됩니다. 제품 사이트는 [heym.run](https://heym.run)을 방문하시고, 에이전트 라이프사이클의 각 단계에서 Heym이 처리하는 내용은 [Why Heym](./why-heym.md)을 참조하십시오.

## 수행할 수 있는 작업

- **구축** – [Workflows](../tabs/workflows-tab.md) 탭의 [캔버스](../reference/canvas-features.md)에서 에이전트와 결정적 단계를 구성하거나, [AI Assistant](../reference/ai-assistant.md)에게 설명하거나, [Templates](../tabs/templates-tab.md)에서 시작하십시오
- **오케스트레이션** – [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [RAG](../nodes/rag-node.md) 노드, [하위 에이전트](../reference/agent-architecture.md), MCP 도구, 그리고 HTTP, Slack, 이메일과 같은 [integrations](../reference/integrations.md)을 조정하며, 의존성이 허용하는 경우 [병렬 실행](../reference/parallel-execution.md)을 활용하십시오
- **실행** – [webhooks](../reference/webhooks.md), [Cron](../nodes/cron-node.md) 스케줄, 이벤트 [triggers](../reference/triggers.md)에서 Workflow를 시작하며, 노드별 재시도, [오류 처리](../nodes/error-handler-node.md), 인스턴스 간 [부하 분산](../reference/cluster.md)을 지원합니다
- **관찰** – [실행 기록](../reference/execution-history.md), 토큰 비용이 포함된 [LLM traces](../tabs/traces-tab.md), [analytics](../tabs/analytics-tab.md), [alerts](../tabs/alerts-tab.md)를 검사하고 [OpenTelemetry](../reference/opentelemetry.md) traces를 내보내십시오
- **평가** – [Evals](../tabs/evals-tab.md) 탭에서 예상 출력에 대해 Prompt와 모델을 테스트하십시오
- **통제** – [인간 검토](../reference/human-in-the-loop.md)를 위해 에이전트를 일시 중지하고, [guardrails](../reference/guardrails.md)로 안전하지 않은 콘텐츠를 차단하며, [credentials](../tabs/credentials-tab.md), [teams](../reference/teams.md), [single sign-on](../reference/sso.md), [감사 추적](../reference/audit.md)으로 접근을 관리하십시오
- **노출** – Workflow를 REST 및 [SSE streaming](../reference/sse-streaming.md)으로, [MCP](../tabs/mcp-tab.md) 도구로, 최종 사용자를 위한 [Portal](../reference/portal.md) 채팅 인터페이스로 제공하십시오. [Chat](../tabs/chat-tab.md) 탭을 사용하여 모델을 직접 테스트하십시오
- **Heym과 채팅** – 문서의 [Chat with Heym](../reference/chat-with-heym.md) 대화상자에서 페이지를 인식하는 제품 관련 질문을 하십시오

## 핵심 개념

- **Workflows** – 노드와 엣지로 구성된 방향성 그래프입니다. [Workflows](../tabs/workflows-tab.md) 탭에서 관리하십시오. [Workflow Structure](../reference/workflow-structure.md)를 참조하십시오.
- **Nodes** – 처리 단위입니다([Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md) 등). [Node Types](../reference/node-types.md)를 참조하십시오.
- **Edges** – 실행 흐름을 정의하는 연결입니다
- **Credentials** – [Credentials](../tabs/credentials-tab.md) 탭에 저장되며 노드에서 참조되는 API 키와 시크릿입니다.
- **Variables** – [Variables](../tabs/global-variables-tab.md) 탭의 영구 키-값 데이터로, `$global.variableName`을 통해 접근할 수 있습니다. [Global Variables](../reference/global-variables.md)를 참조하십시오.
- **Expressions** – `$input` 및 `$nodeName.field`로 상위 데이터를 참조합니다. [Expression DSL](../reference/expression-dsl.md)을 참조하십시오.

## 관련 항목

- [Why Heym](./why-heym.md) – 에이전트 라이프사이클의 각 단계에서 Heym이 처리하는 내용
- [Quick Start](./quick-start.md) – 첫 번째 Workflow 구축
- [Running & Deployment](./running-and-deployment.md) – `run.sh`로 로컬에서 시작하거나 `deploy.sh`로 배포
- [AI Assistant](../reference/ai-assistant.md) – 자연어로 Workflow 생성
- [Chat with Heym](../reference/chat-with-heym.md) – 문서를 읽는 동안 후속 질문하기
- [Core Concepts](./core-concepts.md) – Workflow, 노드, 실행 흐름
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow 및 폴더 관리
- [Credentials Tab](../tabs/credentials-tab.md) – 노드용 API 키 추가

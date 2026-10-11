# 병렬 실행

Heym은 서로 의존성이 없는 노드들을 병렬로 실행하며, 여러 Workflow 실행이 동시에 수행되는 것을 허용합니다.

## 단일 실행 내에서

### DAG 기반 스케줄링

실행기는 방향성 비순환 그래프(DAG)를 사용하여 노드들을 **실행 레벨**별로 그룹화합니다:

1. **레벨 0** – 진입 간선이 없는 노드(시작 노드)
2. **레벨 N** – 상위 의존성이 모두 레벨 0..N-1에 속하는 노드

같은 레벨의 노드들은 서로 의존성이 없으며 병렬로 실행됩니다.

### 스레드 풀

- **공유 풀**: 노드 실행을 위한 `ThreadPoolExecutor(max_workers=8)`
- **스케줄링**: `wait(..., return_when=FIRST_COMPLETED)` – 노드가 완료되는 즉시 하위 노드가 스케줄링됩니다
- **스레드 안전**: 노드 출력은 잠금(`store_node_output`)을 사용하여 저장됩니다

### Orchestrator 서브 에이전트

Orchestrator 에이전트가 한 턴에서 여러 개의 `call_sub_agent` 도구 호출을 반환하면, 이들은 병렬로 실행됩니다. [Agent 아키텍처](./agent-architecture.md)를 참조하십시오.

### Merge 노드

[Merge](../nodes/merge-node.md) 노드는 여러 병렬 분기의 출력을 결합합니다. 결과를 명시적으로 결합해야 할 때 사용하십시오. 그렇지 않으면 병렬 분기가 각각 별도의 출력 노드에서 종료될 수 있습니다.

### 루프

루프 반복은 **순차적으로** 실행됩니다. 루프 본문 노드는 반복마다 다시 스케줄링됩니다.

### 조기 반환

`allowDownstream`을 가진 출력 노드는 조기에 반환할 수 있습니다. 나머지 하위 작업은 백그라운드에서 실행됩니다.

## 동시 Workflow 실행

- **Workflow별 잠금 없음** – 여러 요청이 동일한 Workflow를 동시에 실행할 수 있습니다
- **비동기 API** – FastAPI 엔드포인트는 `asyncio.to_thread(execute_workflow)`를 사용하여 이벤트 루프가 응답성을 유지합니다
- **격리** – 각 실행은 자체 `WorkflowExecutor` 인스턴스와 상태를 가집니다

Workflow를 실행하는 Trigger([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor)는 각각 `execute_workflow`를 독립적으로 호출합니다.

## 스트리밍

스트리밍은 동일한 병렬 모델을 사용하지만 노드가 완료될 때 이벤트를 발생시킵니다. Editor와 Portal 채팅 UI는 실시간 진행 상황을 위해 내부적으로 스트리밍을 사용하며, Webhook 사용자는 이제 [SSE 스트리밍](./sse-streaming.md) 실행 엔드포인트를 통해 동일한 이벤트 스트림을 선택적으로 사용할 수 있습니다.

## 관련 문서

- [Heym을 선택하는 이유](../getting-started/why-heym.md) – Heym 런타임의 병렬 DAG 실행
- [Workflow 구조](./workflow-structure.md) – 노드, 간선, 실행 흐름
- [핵심 개념](../getting-started/core-concepts.md) – 실행 흐름 개요
- [노드 유형](./node-types.md) – [Merge](../nodes/merge-node.md) 노드 및 기타 유형
- [Trigger](./triggers.md) – 실행을 트리거하는 진입점
- [SSE 스트리밍](./sse-streaming.md) – `/execute/stream`의 이벤트 스트림 형식

# Workflow 구조

Workflow는 노드와 엣지로 구성된 JSON 형식으로 저장됩니다. 사용 가능한 노드 유형은 [Node Types](./node-types.md)를, `data` 필드의 표현식 구문은 [Expression DSL](./expression-dsl.md)을 참조하십시오.

## Workflow 객체

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## 노드 객체

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### Agent 노드 `data` (영구 메모리)

[Agent](../nodes/agent-node.md) 노드는 캔버스 노드별로 선택적 지식 그래프를 지원합니다:

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | `true`인 경우, 저장된 그래프를 시스템 Prompt에 로드하고 성공적인 실행 후 새로운 사실을 병합합니다 |
| `memoryShares` | array (선택 사항) | 다른 Agent에게 이 노드의 메모리 그래프 접근 권한을 부여합니다 (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). [Agent Persistent Memory](./agent-persistent-memory.md)를 참조하십시오. |

예시:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

API 경로, 에디터 동작, 추출 의미론에 대해서는 [Agent Persistent Memory](./agent-persistent-memory.md)를 참조하십시오.

## 엣지 객체

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## 노드 유형

일반적인 `type` 값: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md) 등이 있습니다. 전체 목록: [Node Types](./node-types.md). 동일한 실행 레벨의 노드는 [병렬](./parallel-execution.md)로 실행됩니다.

## 에디터 레이아웃

각 노드는 데스크톱 캔버스 레이아웃을 위한 `position.x`와 `position.y`를 가집니다. 768px 브레이크포인트 미만의 화면에서 에디터는 자유 형식 Vue Flow 캔버스를 전체 화면의 들여쓰기된 Workflow 트리로 대체합니다. 트리는 연결된 실행 경로를 따르며, 병렬 분기를 표시하고, 데스크톱 에디터와 동일한 노드 레이블, 아이콘, 최신 실행 상태를 사용합니다.

노드를 탭하여 선택하십시오. 기록된 실행 결과가 있는 경우, 입력, 출력, 오류 탭이 포함된 전체 화면 상세 정보가 열립니다. 모바일 하단 내비게이션은 **Nodes**, **Properties**, **Run**, **More**를 제공하며, 헤더는 저장, 기록, 검색, 설정, 공유 작업을 유지합니다. 데스크톱은 계속해서 자유 형식 Vue Flow 캔버스와 사이드 패널을 사용합니다.

모바일 Nodes 탭에서 **Add node**를 사용하여 노드 라이브러리를 검색하십시오. 일반 노드는 추가된 직후 연결 시트를 엽니다: 앵커 노드를 선택하고 **After**, **Before**, 또는 **Parallel** 분기로 배치하십시오. 편집 모드에서 기존 일반 노드를 탭하면 현재 연결이 선택된 동일한 시트가 열립니다. Trigger 노드는 일반 입력을 받지 않으므로 독립적으로 유지됩니다. 편집 컨트롤은 선택한 노드에 대한 제거 작업도 제공합니다. 실행 상세 정보에는 인접 노드 결과가 사용 가능한 경우 이전 및 다음 화살표가 포함됩니다. AI Assistant는 활성 에디터 탭을 변경하지 않고 모바일 트리 위에 하단 시트로 열립니다.

## 관련 항목

- [Node Types](./node-types.md) – 모든 노드 유형 및 설명
- [Canvas Features](./canvas-features.md) – 에디터 기능 (데이터 핀, 실행 로그, 활성화/비활성화, 하위 Workflow로 추출)
- [Download & Import](./download-import.md) – Workflow를 JSON으로 내보내기 및 가져오기
- [Agent Node](../nodes/agent-node.md) – Agent 노드 `data` 구조
- [Agent Persistent Memory](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares`, 메모리 그래프 API
- [Expression DSL](./expression-dsl.md) – `userMessage`, `condition`, `$vars`, `$global` 등의 구문
- [Parallel Execution](./parallel-execution.md) – 노드가 병렬로 실행되는 방식
- [Triggers](./triggers.md) – 시작 노드 및 진입점
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow 생성 및 관리

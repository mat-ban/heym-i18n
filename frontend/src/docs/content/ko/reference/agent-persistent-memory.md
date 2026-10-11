# Agent 영구 메모리

Agent 노드는 데이터베이스에 저장되는 **노드별 지식 그래프**를 유지할 수 있습니다. 이 그래프는 엔터티(유형 및 속성 포함)와 이들 간의 관계로 구성됩니다. 활성화하면 Heym은 매 실행 시(그래프가 비어 있지 않은 경우) **해당 그래프의 요약을 시스템 프롬프트에 주입**합니다. 실행이 성공적으로 완료되면 **LLM 추출 작업**이 백그라운드에서 대화에서 얻은 새로운 사실을 그래프에 병합합니다.

Sub-agent와 orchestrator는 기본적으로 각각 **자신의 캔버스 노드**에 연결된 그래프를 사용합니다. 또한 소유한 **다른 Workflow**의 에이전트를 포함하여 **다른 에이전트에게 이 노드의 그래프에 대한 읽기 또는 읽기/쓰기 권한을 부여**할 수 있습니다. 자세한 내용은 [다른 에이전트와 공유](#sharing-with-other-agents)를 참조하십시오.

## 활성화

| Parameter | Type | Description |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | `true`인 경우 이 노드의 그래프를 시스템 프롬프트에 로드하고 이 노드의 그래프에 대한 실행 후 추출을 예약합니다 |
| `memoryShares` | array (optional) | 다른 에이전트 노드에게 **이** 노드의 메모리 그래프에 대한 접근 권한을 부여합니다. [공유](#sharing-with-other-agents)를 참조하십시오 |

Agent 노드 속성(**Persistent memory (graph)**)에서 활성화할 수 있습니다. 메모리가 활성화된 경우(또는 모델이 표시된 경우) 노드의 분홍색 **brain** 아이콘을 클릭하면 그래프 편집기가 열립니다.

## 그래프 편집기

이 대화 상자는 엔터티를 애니메이션화된 force-directed 그래프로 렌더링합니다. 연결 수에 따라 크기가 결정되는 색상 원과 엔터티 유형별 클러스터링, 그리고 편집 및 탐색 기능(fit view, tidy layout, 키보드 단축키)을 제공합니다. 노드와 엣지를 **수동으로 추가, 편집, 삭제**할 수 있으며, 엔터티가 많은 그래프를 위해 Source/Target 관계 선택기는 검색 가능합니다. 노드를 선택하면 나가는 연결과 들어오는 연결이 표시되며, 각각을 클릭하여 해당 노드로 이동할 수 있습니다. 변경 사항은 **이** 에이전트의 그래프(brain을 연 캔버스 노드의 그래프)에만 적용됩니다.

## 다른 에이전트와 공유

메모리 그래프 대화 상자의 **Share memory with other agents**를 사용하면 런타임에 이 그래프를 사용할 수 있는 **peer**를 연결할 수 있습니다:

1. **Workflow**를 선택합니다(편집기에서 열 수 있는 모든 Workflow).
2. 해당 Workflow에서 **agent** 노드를 선택합니다.
3. **Read only** 또는 **Read & write**를 설정합니다.

| Permission | Effect |
|------------|--------|
| Read only | **peer** 에이전트가 실행될 때 이 그래프가 peer의 시스템 프롬프트에 병합됩니다(엔터티가 있는 경우). peer의 실행에서 이 그래프로의 추출은 수행되지 않습니다. |
| Read & write | 프롬프트 동작은 read와 동일하며, **성공적인** peer 완료 후 일반적인 메모리 추출이 peer 실행의 credential을 사용하여 **이(소유자) 그래프에 병합**될 수도 있습니다. |

Peer는 소유자 노드별로 `memoryShares` 항목으로 저장되며 `peerWorkflowId`와 `peerCanvasNodeId`(그리고 `permission`)를 포함합니다. 이전 Workflow에서는 **동일한** Workflow 내의 peer에 대해 `peerWorkflowId`가 생략될 수 있으며, 편집기는 이를 현재 Workflow로 간주합니다.

**Cross-workflow 공유**는 소유한 Workflow를 스캔하여 런타임에 해석됩니다. 인증된 사용자 컨텍스트가 없는 실행은 **현재** Workflow의 JSON(동일 캔버스)에 정의된 공유만 해석합니다.

## 런타임 동작

### 자체 그래프 (`persistentMemoryEnabled`)

1. **LLM 호출 전** — 그래프에 엔터티가 있는 경우, 이전 실행에서 얻은 사실임을 설명하는 블록이 시스템 지침에 추가됩니다(불완전할 수 있으며, 충돌 시 현재 사용자 메시지가 우선합니다).
2. **성공적인 완료 후** — 백그라운드 작업이 모델(에이전트 실행과 동일한 credential)에 구조화된 JSON(엔터티 + 관계)을 요청합니다. 해당 payload는 데이터베이스에 병합됩니다(일부 유형, 예를 들어 employment-style 엣지의 경우 중복 제거 및 관계 정리가 적용됩니다).

### 공유 그래프를 수신하는 peer

에이전트가 실행되면 시스템은 `memoryShares`가 이 실행의 Workflow와 캔버스 노드를 가리키는 **소유자** 노드(가능한 경우 소유한 모든 Workflow에서)를 찾습니다. 각 일치 항목에 대해 해당 소유자의 그래프가 시스템 프롬프트에 **shared memory** 섹션으로 추가됩니다. **Read & write** peer는 추가로 실행이 성공하면 **소유자** Workflow/그래프에 대한 추출 대상을 예약합니다.

실행이 오류로 종료되거나 HITL pending 상태로 끝나는 경우 추출은 **실행되지 않습니다**.

## Workflow JSON (`data` 필드)

다른 설정과 마찬가지로 agent 노드에 저장됩니다:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission`은 `"read"` 또는 `"write"`입니다. 공유가 없으면 `memoryShares`를 생략하거나 `[]`를 사용하십시오.

전체 노드 객체 형태는 [Workflow Structure](./workflow-structure.md)를 참조하십시오.

## 관련 항목

- [Agent Node](../nodes/agent-node.md) — 전체 agent 구성
- [Agent Architecture](./agent-architecture.md) — Orchestrator, sub-agent, 도구
- [Workflow Structure](./workflow-structure.md) — JSON Workflow 형식
- [Canvas Features](./canvas-features.md) — Brain 컨트롤 및 그래프 대화 상자
- [Traces tab](../tabs/traces-tab.md) — LLM 요청/응답 관측성

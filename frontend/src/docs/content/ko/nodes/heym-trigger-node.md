# Heym Trigger

**Heym Trigger** 노드는 Heym 자체가 플랫폼 이벤트를 발행할 때 Workflow를 시작합니다. 이는 Heym으로 Heym을 자동화하기 위한 제로 입력 Trigger 노드로, 변경 감사 추적, 배포 공지, 인스턴스 상태 요약 등에 활용됩니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 0 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Credential | 필요 없음 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `eventNames` | 문자열 배열 | 구독할 이벤트를 지정합니다. 비워 두면 모든 이벤트를 수신합니다. |

## 이벤트

| 이벤트 | 발행 시점 | 범위 |
|-------|----------------|-------|
| `heym.started` | Heym 플랫폼이 시작될 때 | 인스턴스 전체: 모든 구독자가 수신 |
| `workflow.created` | Workflow가 생성될 때 | 해당 Workflow 소유자의 구독자만 |
| `workflow.updated` | Workflow가 저장될 때 | 해당 Workflow 소유자의 구독자만 |
| `workflow.deleted` | Workflow가 삭제될 때 | 해당 Workflow 소유자의 구독자만 |

대시보드 위젯은 내부적으로 Workflow로 저장되지만, `workflow.*` 이벤트를 생성하지는 않습니다.

## 전달은 배치 단위로 이루어집니다

Heym은 5초마다 이벤트를 발송합니다. **한 번의 발송 주기에서 수집된 모든 이벤트는 단일 Workflow 실행으로 배열 형태로 도착합니다.**

- 5초 이내에 두 개의 Workflow를 생성 → 두 개의 이벤트를 담은 **하나의** 실행
- Workflow 하나를 생성 → 한 개 요소의 배열을 담은 **하나의** 실행

형태는 절대 바뀌지 않으므로, 다운스트림 표현식은 이벤트가 하나 도착했는지 여러 개 도착했는지 분기할 필요가 없습니다. 이벤트마다 한 번씩 동작해야 할 경우 `$nodeLabel.events` 위에 [Loop](./loop-node.md) 노드를 배치하십시오.

## 정확히 한 번 전달(Exactly-Once Delivery)

각 이벤트는 전달되기 전에 고유한 데이터베이스 제약 조건을 통해 구독 노드별로 수집(claim)됩니다. 이는 모든 uvicorn worker, 모든 컨테이너, 모든 머신에 걸쳐 유지됩니다. 즉, 두 서버에서 Heym을 실행해도 이벤트가 두 번 전달되지 않습니다. 수집 기록을 남길 수 없으면 이벤트는 아예 전달되지 않습니다. 이 설계는 두 번 발화하기보다는 안전하게 실패(fail closed)하도록 되어 있습니다.

동일한 이벤트를 구독하는 두 개의 서로 다른 `heymTrigger` 노드는 각각 한 번씩 수신하며, 서로 경쟁하지 않습니다.

## 발송 윈도우

디스패처는 **최근 5분 이내**에 발행된 이벤트만 고려합니다. 더 오래된 이벤트는 로그에 남아 조회할 수 있지만 절대 전달되지 않습니다. 이는 다운타임 이후의 동작을 제한합니다. 즉, 한 시간 동안 오프라인이었다가 Heym을 다시 시작해도 한 시간 분량의 백로그가 한꺼번에 발화되지 않고 아무것도 재생되지 않습니다.

이벤트는 **7일** 동안 보관된 후 삭제됩니다.

## 출력 필드

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.events` | 이벤트 객체의 배열, 오래된 것부터 정렬. 항상 배열입니다. |
| `$nodeLabel.events[0].id` | 이벤트 UUID |
| `$nodeLabel.events[0].name` | 이벤트 이름, 예: `workflow.created` |
| `$nodeLabel.events[0].payload` | 이벤트 본문 |
| `$nodeLabel.events[0].workflow_id` | 대상 Workflow id, `heym.started`의 경우 `null` |
| `$nodeLabel.events[0].created_at` | 이벤트가 발행된 시각의 ISO 타임스탬프 |
| `$nodeLabel.count` | 이번 배치의 이벤트 개수 |
| `$nodeLabel.triggered_at` | Workflow 실행 시각의 ISO 타임스탬프 |

### Payload 형태

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted`는 이벤트를 읽는 시점에는 Workflow 행이 이미 사라져 있으므로, 삭제 직전에 캡처된 이름을 담고 있습니다.

## 예제 Workflow

**Workflow 변경 감사 추적**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** 레이블 `platformEvents`, `workflow.created`, `workflow.updated`, `workflow.deleted`를 구독
- **Heym** 노드에서 `getWorkflow`와 `heymWorkflowId`를 `$platformEvents.events[0].workflow_id`로 설정
- **Slack** 메시지: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## 참고 사항

- `heym.started`는 Heym이 컨테이너당 8개의 worker를 실행함에도 불구하고 worker마다가 아니라 **플랫폼 시작당 한 번** 발화합니다. 5분 이상 차이를 두고 시작한 컨테이너는 각각 하나의 이벤트를 발행합니다.
- 이 방식으로 트리거된 실행은 이력에 `trigger_source = "heym_event"`로 나타납니다.
- 향후 버전에서 추가되는 이벤트 타입을 자동으로 수신하려면, 네 가지를 모두 나열하는 대신 **Events**를 비워 두십시오.

## 관련 항목

- [Heym](./heym-node.md) – Workflow 및 실행 이력 조회
- [Triggers](../reference/triggers.md) – 모든 Workflow 진입점 개요
- [Loop](./loop-node.md) – 배치 내 이벤트마다 한 번씩 동작

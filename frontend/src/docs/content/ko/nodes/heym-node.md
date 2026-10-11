# Heym

**Heym** 노드는 Heym 자체의 데이터를 읽습니다. 접근 가능한 Workflow, 특정 Workflow의 구조, 그리고 해당 Workflow의 실행 이력을 조회할 수 있습니다. 이를 통해 메타 Workflow — 인스턴스 인벤토리, 실행 다이제스트, Heym 자체에 대한 상태 보고서 — 를 구축할 수 있습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Operations | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credential | 필요하지 않음 |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `heymOperation` | Select | 수행할 읽기 작업 |
| `heymWorkflowId` | UUID | 대상 Workflow. `getWorkflow`와 `getExecutionHistory`에서 필수입니다. 표현식 사용 가능. |
| `heymLimit` | String | 반환할 최대 행 수. **비워 두거나 `0`을 입력하면 전부 반환합니다** — 이것이 기본값입니다. 표현식 사용 가능. |
| `heymStatus` | String | `getExecutionHistory`에 대한 선택적 상태 필터. 표현식 사용 가능. |
| `heymSinceDays` | String | `getExecutionHistory`에 대한 선택적 조회 기간(일 단위). 표현식 사용 가능. |

Workflow 선택기는 접근 가능한 모든 Workflow를 나열하는 검색 가능한 드롭다운입니다.

## 접근 범위

결과는 실행을 시작한 주체가 아니라 **해당 노드가 속한 Workflow의 소유자**를 기준으로 범위가 지정됩니다. 표시되는 집합은 다음과 같습니다:

- 소유자가 소유한 Workflow,
- 소유자에게 직접 공유된 Workflow,
- 소유자가 속한 팀에 공유된 Workflow.

소유자 기준 범위 지정은 수동 실행, Cron 실행, 포털 실행, 플랫폼 이벤트 실행 등 어떤 방식으로 실행되더라도 노드가 동일하게 동작하도록 만드는 핵심입니다. 실행 주체 기준으로 범위를 지정하면 무인 실행 시마다 아무것도 반환되지 않을 것입니다. 이는 Heym이 이미 Credential과 전역 변수에 적용하고 있는 것과 동일한 규칙입니다.

접근할 수 없는 Workflow와 존재하지 않는 Workflow는 동일한 오류 메시지를 생성하므로, 이 노드를 사용해 Workflow id를 탐색할 수는 없습니다.

## Operations

### List Workflows

소유자가 접근할 수 있는 모든 Workflow를 최근 업데이트 순으로 반환합니다.

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow 요약의 배열 |
| `$nodeLabel.workflows[0].id` | Workflow UUID |
| `$nodeLabel.workflows[0].name` | Workflow 이름 |
| `$nodeLabel.workflows[0].description` | 설명 또는 `null` |
| `$nodeLabel.workflows[0].active` | Workflow의 활성화 여부 |
| `$nodeLabel.workflows[0].folder_id` | 폴더 UUID 또는 `null` |
| `$nodeLabel.workflows[0].updated_at` | 마지막 저장 시각의 ISO 타임스탬프 |
| `$nodeLabel.workflows[0].node_count` | Workflow에 포함된 노드 수 |
| `$nodeLabel.total` | Limit이 적용되기 **전**의 전체 접근 가능 개수 |

`total`은 의도적으로 제한 없는 개수이므로, 반환되는 행 수를 제한하더라도 `$inventory.total`은 여전히 실제 크기를 보고합니다. **Limit**을 비우거나 `0`으로 설정하면 모든 Workflow를 반환합니다 — 이것이 기본값입니다.

### Get Workflow

하나의 Workflow의 식별 정보와 구조를 반환합니다.

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflow 식별 정보 |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflow 메타데이터 |
| `$nodeLabel.node_count` | 노드 수 |
| `$nodeLabel.nodes` | `{ id, type, label, position, data }`의 배열 |
| `$nodeLabel.edges` | `{ id, source, target, sourceHandle, targetHandle }`의 배열 |

`data`는 **전체 노드 구성**입니다 — 저장된 그대로의 모든 필드입니다. 이것이 감사를 가능하게 합니다: 노드가 필드를 표시하지 않는다면 누군가 필드에 붙여 넣은 API key를 Workflow에서 스캔할 수 없습니다.

이것은 호출자가 이미 가지고 있지 않은 접근 권한을 부여하지 않습니다. 이 노드는 소유자가 어차피 에디터에서 열 수 있는 Workflow로 범위가 지정되며, 저장된 Credential 비밀 정보는 여전히 포함되지 않습니다: 노드 데이터에는 Credential **id**만 담기고, 비밀 정보 자체는 Credential 테이블에 암호화되어 저장됩니다.

### 하드코딩된 비밀 정보 스캔

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

에이전트에 `$detail.nodes`를 제공하고, 실제 key나 Token처럼 보이는 `data` 값을 표시하도록 요청하십시오. 주의해야 할 필드는 자유 텍스트 필드입니다 — HTTP 노드의 `curl`, LLM 및 Agent 노드의 `userMessage`와 `systemInstruction`, 그리고 Python 도구 본문 — Credential id는 무해한 UUID이지만, 붙여 넣은 `sk-…`는 그렇지 않기 때문입니다.
### 실행 기록 가져오기

하나의 Workflow에 대한 실행 기록 항목을 최신순으로 반환합니다.

| 표현식 | 설명 |
|------------|-------------|
| `$nodeLabel.executions` | 기록 항목의 배열 |
| `$nodeLabel.executions[0].id` | 실행 UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` 등 |
| `$nodeLabel.executions[0].started_at` | ISO 타임스탬프 |
| `$nodeLabel.executions[0].execution_time_ms` | 실제 경과 시간 |
| `$nodeLabel.executions[0].trigger_source` | 실행을 시작한 원인, 예를 들어 `cron` 또는 `heym_event` |
| `$nodeLabel.executions[0].recovered` | 크래시 이후 실행이 복구되었는지 여부 |
| `$nodeLabel.executions[0].inputs` | 실행이 받은 것 - Trigger Payload 또는 호출자의 입력 |
| `$nodeLabel.executions[0].outputs` | 해당 실행에 대한 Workflow의 출력 |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | 기록이 속한 Workflow |
| `$nodeLabel.total` | Limit **이전**의 일치하는 총 실행 수 |
| `$nodeLabel.by_status` | 상태별로 집계된 개수, 예를 들어 `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | 조회 기간의 시작, 전체 기록인 경우 `null` |

항목에는 실행이 받은 것과 응답한 것, 즉 `inputs`와 `outputs`가 모두 포함되지만 `node_results`는 절대 포함되지 않습니다. 노드별 추적은 테이블에서 가장 큰 컬럼이며 다운스트림의 모든 것을 압도할 수 있기 때문입니다. 전체 추적이 필요할 때는 API를 통해 단일 실행을 가져오십시오.

`total`과 `by_status`는 **Limit**이 반환되는 항목 수를 제한하더라도 항상 일치하는 **전체** 기록을 나타냅니다. 따라서 가장 최근 실행 다섯 개를 가져오면서도 정확한 실패 횟수를 보고할 수 있습니다.

**Since (days)** 를 비워 두면 모든 기간을 포함하고, **Status filter** 를 비워 두면 모든 상태를 포함하며, **Limit** 을 비워 두거나 `0`으로 설정하면 모든 항목을 반환합니다.

## 예제 Workflow

**일일 인스턴스 다이제스트**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows`에 `inventory` 라벨 지정
- `$inventory.workflows`에 대한 **Loop**
- **Heym** `getExecutionHistory`에 `heymWorkflowId`를 루프 항목의 `id`로, `heymSinceDays`를 `1`로, `heymLimit`을 `5`로 설정
- **LLM**이 수집된 실행과 상태 개수를 읽기 쉬운 요약으로 변환

## 참고 사항

- Credential은 필요하지 않습니다. 이 노드는 Heym이 실행되는 동일한 데이터베이스를 읽습니다.
- **Limit**은 두 목록 작업 모두에서 동일한 필드이며, 두 경우 모두 같은 의미입니다. 비워 두거나 `0`이면 모든 항목을 반환합니다.
- 이 노드는 일반 입력을 받으며 Agent 노드에 도구로 연결할 수 있으므로, 에이전트가 Heym 인스턴스에 대한 질문에 답하거나 감사할 수 있습니다.
- `getWorkflow` Payload는 Workflow가 커질수록 함께 커집니다. 긴 Prompt와 Python 도구 본문이 모두 `data` 안에 포함되어 전달됩니다.
- 일정에 따라 폴링하는 대신 Workflow 변경이 발생할 때 반응하려면 [Heym Trigger](./heym-trigger-node.md)와 함께 사용하십시오.

## 관련 항목

- [Heym Trigger](./heym-trigger-node.md) – 플랫폼 이벤트로부터 Workflow 시작
- [Execute](./execute-node.md) – Workflow를 설명하는 대신 실행
- [Loop](./loop-node.md) – 반환된 Workflow 목록을 순회

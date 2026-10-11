# 실행 기록

실행 기록은 Workflow 실행을 기록합니다: 입력, 출력, 노드 결과, 상태, 그리고 Trigger 소스입니다. 이를 활용하여 활성 프로덕션 실행을 모니터링하고, 과거 실행을 검사하며, 실패를 디버깅하거나, **Bring to Canvas**를 통해 동일한 입력으로 재실행할 수 있습니다.

## 개요

각 실행은 다음을 저장합니다:

| 필드 | 설명 |
|-------|-------------|
| **Inputs** | 요청 본문 또는 실행 입력 (예: Input 노드의 `text`) |
| **Outputs** | Workflow 수준 출력 |
| **Node results** | 노드별 출력, 상태, 실행 시간 |
| **Status** | `success`, `error`, `pending`, `skipped`, 또는 `failed` ([Crash Recovery](#crash-recovery) 참조) |
| **trigger_source** | 실행이 Trigger된 방식 ([Triggers](./triggers.md) 참조) |

## 기록 접근

| 위치 | 범위 |
|----------|-------|
| **Editor** 툴바 | 현재 Workflow만 |
| **Docs** 뷰 헤더 | 현재 Workflow만 |
| **Dashboard** 헤더 (Chat 탭) | 모든 Workflow + chat/assistant 실행 |
| **Evals** 뷰 헤더 | 모든 Workflow + chat/assistant 실행 |

**History** 버튼(시계 아이콘)을 클릭하여 대화 상자를 여십시오.

## Workflow별 기록 vs 전체 기록

- **Workflow별** (Editor, Docs): 열려 있는 Workflow의 실행을 표시합니다. **Clear history**를 사용하여 해당 Workflow의 실행만 제거하십시오.
- **전체 기록** (Dashboard, Evals): 모든 Workflow 및 chat/assistant 세션에 걸친 실행을 표시합니다. 범위는 Workflow 접근 권한과 일치합니다: 소유한 Workflow, 직접 공유받은 Workflow, 소속된 팀에 공유된 Workflow입니다. **Clear all history**를 사용하여 소유한 모든 기록을 제거하십시오. 공유 Workflow의 기록은 유지됩니다.

## Bring to Canvas

**Bring to Canvas**는 선택한 실행의 입력과 노드 출력을 현재 Workflow에 로드합니다.

### 로드되는 항목

- **Inputs** → 실행 입력 패널 (예: Input 노드의 `text`, 또는 사용자 정의 필드)
- **Node results** → 실행 결과 패널이 노드별 과거 출력을 표시합니다
- **Execution result** → 실행의 상태, 출력, 타이밍

### 컨텍스트별 동작

- **Editor 내** (Workflow별 기록): 열려 있는 Workflow에 즉시 적용되고 대화 상자가 닫힙니다.
- **전체 기록에서** (Dashboard/Evals): Workflow 편집기로 이동한 후, 편집기가 로드될 때 데이터를 적용합니다. Workflow 실행에만 사용 가능하며, chat/assistant 실행에는 사용할 수 없습니다.

### 실행 딥 링크

`/workflows/{workflowId}/{executionId}`에서 Workflow를 열면 해당 실행이 자동으로 캔버스에 로드됩니다 — 실행을 선택하고 **Bring to Canvas**를 선택하는 것과 동일합니다. 이를 통해 특정 과거 실행을 URL로 공유할 수 있습니다. 실행을 찾을 수 없는 경우(잘못되었거나 삭제된 id), 편집기는 일반 Workflow 로드로 대체됩니다.

### 사용 사례

- 동일한 입력으로 Workflow 재실행
- 입력과 노드 출력을 검사하여 실패한 실행 디버깅
- 실행 간 출력 비교

## Execution Highlights

라이브 실행 후 — 또는 **Bring to Canvas** 후 — **Canvas 우측 상단**에 닫을 수 있는 **Execution Highlights** 팝업이 나타납니다. 이는 *각 노드가 무엇을 생성했는지*를 실행 순서대로 위에서 아래로 나열하여 빠르게 확인할 수 있는 방법입니다. **✕**로 닫으십시오; 다음 실행 시 다시 열립니다.

### 표시되는 항목

| 기록 | 소스 | 자동? |
|--------|--------|-------|
| **Input** | 실행의 입력 파라미터 (input/trigger 노드) | 예 |
| **Output** | 출력 노드의 결과 — 또는 출력 노드가 없는 경우 마지막 노드의 메시지 | 예 |
| **Agent / LLM** | 각 agent 또는 LLM 노드의 출력 | 예 |
| **Output** | **Highlight Node Output**이 활성화된 기타 모든 노드 | 선택 |

이미 자동으로 하이라이트되는 노드(input / output / last / agent / llm)는 토글을 함께 활성화하더라도 두 번 표시되지 않습니다.

### 각 기록

- 처음 **250자**까지 `Node — message…` 형식으로 표시합니다; 행을 클릭하면 확장되어 **전체 메시지를 Markdown으로** 렌더링하며, **Copy** 버튼이 있습니다.
- 여러 번 실행된 노드(예: 루프 내부)는 `‹ i / N ›` 선택자와 함께 `Node (N)`으로 표시됩니다 — 확인할 실행을 선택하십시오; 각 노드의 선택자는 독립적입니다.

### Highlight Node Output

**Agent와 LLM을 제외한** 모든 노드는 속성 패널에 **Highlight Node Output** 체크박스가 있습니다 (기본값 꺼짐). 이를 활성화하면 해당 노드의 출력이 팝업에 추가됩니다. 캔버스에서 하이라이트된 노드에는 작은 ✦ 배지가 나타납니다. [workflow DSL](./expression-dsl.md)에서 이는 노드 데이터 필드 `"highlight": true`입니다 (기본값 `false`).

### 대시보드에서

Workflow를 실행한 Dashboard 위젯 카드는 카드 헤더에 ✦ **Execution highlights** 버튼을 표시합니다; 이를 클릭하면 해당 위젯 실행에 대한 동일한 팝업이 열리며, 위젯이 그린 출력이 주요 기록으로 표시됩니다.

## 실행 중인 실행

두 기록 대화상자 모두 목록 상단, 과거 실행 이전에 **현재 실행 중인 실행**을 표시합니다.

- 회전 표시기와 **Running** 레이블이 시작 시간과 함께 나타납니다
- **Open live**를 클릭하면 실행을 다시 시작하지 않고 편집기를 해당 실행에 연결합니다
- 캔버스는 먼저 이미 완료된 노드를 복원한 다음, SSE를 통해 `node_start`, `node_complete` 및 최종 실행 이벤트를 수신합니다
- 현재 노드는 캔버스에서 맥동하고, 다운스트림 노드는 대기 중 애니메이션을 유지하며, Debug 패널은 결과가 도착하는 대로 각각을 추가합니다—편집기에서 시작한 실행과 동일합니다
- **Cancel**을 클릭하면 실행이 즉시 중지됩니다
- 어느 대화상자(Editor 또는 Dashboard)에서든 취소하면 해당 Workflow에 대해 열려 있는 모든 캔버스 탭의 활성 SSE 스트림도 닫히므로, 편집기 상태가 깔끔하게 초기화됩니다
- 취소 후 실행 중 항목은 다음 새로 고침 시 사라집니다. **Refresh**를 눌러 목록을 수동으로 갱신하십시오
- 이미 완료된 실행을 취소하는 경우, 해당 요청은 아무 동작도 하지 않습니다

라이브 URL은 `/workflows/{workflowId}/{executionId}`입니다. 관찰자는 읽기 전용입니다. 편집기를 나가면 해당 브라우저 탭의 연결만 끊기며 Workflow는 절대 중지되지 않습니다. 활성 스냅샷은 PostgreSQL을 통해 공유되므로, Trigger와 편집기 요청이 서로 다른 백엔드 워커에 도달하더라도 실행을 여는 것은 여전히 작동합니다.

## 크래시 복구

Workflow가 실행 중일 때 서버가 재시작되면(배포, 컨테이너 재시작 또는 크래시), 해당 실행의 워커는 실행 도중 중지됩니다. Heym은 이러한 중단된 실행을 **Running** 상태로 방치하지 않고 자동으로 복구합니다.

- 다음 시작 시, 선출된 리더 프로세스가 고아 실행을 감지합니다 — 정상 재시작의 경우 즉시, 하드 크래시의 경우 약 60초 이내에(하트비트가 명확히 중단된 후) 감지합니다.
- 복구된 실행은 현재 Workflow 정의를 사용하여 **동일한 입력으로 처음부터 다시 실행**됩니다(중지된 지점에서 재개되지 않음). 완료 시 정상적인 종료 항목(예: `success`)을 기록하므로, 기록에는 해당 실행이 완료된 것으로 표시됩니다.
- 실행은 **한 번** 재시도됩니다. 복구 시도도 중단되거나 그 사이에 Workflow가 삭제된 경우, 해당 항목은 `failed`로 기록됩니다.
- 이는 단일 컨테이너와 다중 워커 배포 모두에서 동일하게 작동합니다. 리더만 복구를 수행하므로, 실행이 서로 다른 워커에 의해 두 번 복구되는 일은 없습니다.

### 자동 복구 토글

편집기의 **Execution Log**(실행) 패널에는 Workflow별로 **Auto-recover** 체크박스가 있으며, **기본적으로 켜져 있습니다**.

- **On**: 이 Workflow의 중단된 실행은 위에서 설명한 대로 다시 실행됩니다.
- **Off**: 중단된 실행은 다시 실행되지 않으며 `skipped` 상태로 기록됩니다.

> 하위 Workflow 실행은 독립적으로 복구되지 않습니다 — 복구된 상위 실행에 의해 다시 구동됩니다. 자체 재전달 기능이 있는 Trigger(RabbitMQ, scheduled/cron, IMAP)도 재시작 시 재전달할 수 있으므로, 복구된 실행이 간혹 두 번 실행될 수 있습니다.

## 대기 중인 사람 검토

[Human-in-the-Loop](./human-in-the-loop.md) 승인을 위해 일시 중지된 실행은 즉시 `pending` 상태로 기록에 작성됩니다.

- 대기 중인 Agent 노드는 `reviewUrl`, `draftText`, `expiresAt`을 포함한 검토 Payload를 저장합니다
- Agent의 `review` 핸들에 연결된 모든 노드도 사람이 응답하기 전에 실행될 수 있으며, 해당 노드 결과는 동일한 pending 기록 항목에 저장됩니다
- 기록 대화상자는 소유자가 복사하거나 열 수 있도록 검토 링크를 표시합니다
- 기록 대화상자와 편집기 Debug 패널은 실행이 재개된 후 최종 사람 결정을 표시합니다
- 검토자가 초안을 수락, 편집 또는 거부하면, 동일한 기록 항목이 최종 실행 결과로 업데이트됩니다
- 동일한 실행이 HITL을 위해 두 번 이상 일시 중지되는 경우, 기록 항목은 동일하게 유지되지만 각 체크포인트는 자체 일회성 검토 링크를 갖습니다

이는 포털 실행 및 계속 진행하기 전에 몇 시간 또는 며칠을 대기할 수 있는 장기 실행 Workflow에 특히 유용합니다.

## 복사

Inputs 또는 Outputs 옆의 **Copy**를 사용하여 JSON을 클립보드에 복사하십시오.

## 기록 지우기

- **Workflow별**: Editor 기록 대화상자에서 **Clear history**를 클릭하여 현재 Workflow의 실행을 제거합니다.
- **전체 기록**: Dashboard/Evals 기록 대화상자에서 **Clear all history**를 클릭하여 소유한 모든 실행 기록을 제거합니다. 공유 Workflow의 실행은 유지됩니다. 이 작업은 되돌릴 수 없습니다.

## 실행 타임라인 세부 정보

편집기의 **Execution Log**가 열려 있을 때, 타이머 버튼을 클릭하면 실행 타임라인이 표시됩니다. 스팬을 선택하면 행 영역을 대체하는 인라인 세부 정보 검사기가 열립니다. 선택한 단계의 상태, 기간, 시도 횟수, 재시도 정보, 오류, trace ID 및 간결한 출력 미리보기를 표시합니다. 객체 및 배열 출력은 Debug 패널의 나머지 부분과 동일한 `JsonTree` 뷰어를 사용하며, 스칼라 값은 텍스트 미리보기를 사용합니다. 단계가 이미지(Playwright 스크린샷, 생성된 이미지, 이미지 파일)를 출력하는 경우, 출력 위에 썸네일로 나타나며 JSON은 원시 base64 대신 짧은 자리 표시자를 표시합니다. 썸네일을 클릭하면 라이트박스에서 열립니다. 화살표 버튼 또는 ←/→ 키로 실행 내 모든 이미지를 순차적으로 탐색할 수 있으며, `2 / 5`와 같은 카운터가 표시됩니다. trace ID를 사용할 수 있는 경우 LLM 및 Agent 스팬에 대해 **Open trace**를 사용하십시오.

## 모바일 노드 상세 정보

휴대폰에서 편집기는 자유형 캔버스 대신 전체 화면 Workflow 트리를 표시합니다. 기록된 결과가 있는 트리 노드를 탭하면 해당 실행이 전체 화면 상세 정보로 열립니다. 이 보기는 **Input Data**, **Output Data**, **Errors** 탭을 각각 제공합니다. 출력 탭은 기록된 결과를 표시하고 **Copy Output**을 제공하며, 입력 탭은 선택한 노드의 구성을 보여주고, 오류 탭은 노드가 실패했을 때 기록된 오류를 보여줍니다. **Back to workflow** 또는 닫기 버튼을 사용하여 트리로 돌아가십시오.

캔버스와 대시보드 기록 대화 상자는 실행 컨트롤을 한 행에 유지하고, 사용 가능한 태그 및 인스턴스 필터를 반응형 그리드에 배치합니다. 해당 필터 메뉴는 동일한 인앱 선택기를 사용하므로 선택된 체크 표시가 모든 옵션 레이블과 일관된 여백과 기준선을 유지합니다.

## 관련 항목

- [Triggers](./triggers.md) – Workflow가 시작되는 방식입니다. 기록은 `trigger_source`를 기록합니다([Board](../tabs/board-tab.md) 카드 이동 및 후속 작업으로 시작된 실행의 경우 `board` 포함).
- [Human-in-the-Loop](./human-in-the-loop.md) – 대기 중인 검토 URL 및 재개 동작
- [Edit History](./edit-history.md) – Workflow 저장에 대한 버전 관리(되돌리기, 비교)
- [Quick Start](../getting-started/quick-start.md) – 첫 번째 Workflow를 빌드하고 실행합니다
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow를 생성하고 관리합니다

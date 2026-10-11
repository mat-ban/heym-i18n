# Workflow 구성

Heym을 사용하면 Workflow를 폴더로 구성하고, 하위 폴더를 만들고, Workflow를 삭제 예약할 수 있습니다. UI 개요는 [Workflows 탭](../tabs/workflows-tab.md)을 참조하십시오.

## 폴더 및 하위 폴더

폴더는 트리 구조를 형성합니다. 각 폴더는 다음을 가집니다:

- **Name** – 표시 이름
- **Parent** – `parent_id`는 다른 폴더를 가리킵니다. `null`은 루트를 의미합니다
- **Workflows** – Workflow는 `folder_id`를 통해 폴더로 이동할 수 있습니다

### API

| Endpoint | Purpose |
|----------|---------|
| `GET /folders` | 루트 폴더만 |
| `GET /folders/tree` | 전체 트리 (하위 폴더 + Workflow) |
| `GET /folders/{id}` | 콘텐츠를 포함한 단일 폴더 |
| `POST /folders` | 폴더 생성 (`parent_id` 선택 사항) |
| `PUT /folders/{id}` | 이름 또는 `parent_id` 업데이트 |
| `DELETE /folders/{id}` | 폴더 삭제 (cascade) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Workflow를 폴더로 이동 |
| `DELETE /folders/workflows/{workflow_id}/folder` | 폴더에서 Workflow 제거 |
| `GET /folders/{id}/export` | 폴더 + 모든 하위 폴더를 ZIP으로 다운로드 |

### 트리 구조

트리 응답은 폴더별로 `children`과 `workflows`를 포함합니다. 공유된 Workflow는 `WorkflowShare.folder_id`를 통해 폴더에 나타날 수 있습니다.

## Workflow 공유

Workflow 편집기에서 **Share**를 열어 이메일로 사용자를 초대하거나 [team](./teams.md)과 공유하십시오. 모든 초대와 모든 team 공유에는 권한이 부여됩니다:

| 권한 | 협업자가 할 수 있는 작업 |
|------------|------------------------------|
| **Read** | Workflow를 열고, 검사하고, 실행 이력을 보고, 실행할 수 있습니다. 편집기는 읽기 전용 모드로 열립니다: Save가 비활성화되고 캔버스를 변경할 수 없습니다. |
| **Write** | Read가 허용하는 모든 작업에 더해 캔버스, 설정, 분석 문서, 에이전트 메모리를 편집할 수 있습니다. |

권한은 Share 대화 상자의 모든 항목 옆에 표시되며, 공유를 제거하고 다시 추가하지 않고도 해당 드롭다운에서 언제든지 변경할 수 있습니다. 사용자가 여러 경로(직접 공유 및 하나 이상의 team)를 통해 Workflow에 접근하는 경우 **가장 높은** 권한이 적용됩니다. 권한이 도입되기 전에 존재했던 공유는 **Write**이며, `permission`을 생략하는 API 클라이언트도 **Write**를 받습니다.

소유자 전용 작업은 권한에 관계없이 항상 소유자에게 귀속됩니다: Workflow 삭제, 버전 되돌리기 또는 초기화, 이력 초기화, 공유 관리, 그리고 아래의 [소유자 전용 설정](#owner-only-settings)은 **Write** 협업자에게도 소유자에게 남아 있습니다. API(`PUT /api/workflows/{id}`, 분석 노트, 에이전트 메모리, 캐시 초기화) 또는 AI Assistant를 통해 편집을 전송하는 **Read** 협업자는 `You have read-only access to this workflow`와 함께 `403`을 받습니다.

Workflow를 공유하면 캔버스, 실행 이력, 분석 문서에 대한 접근 권한이 부여됩니다. 다음은 자동으로 공유되지 **않습니다**:

- Workflow의 노드에서 참조하는 **Credentials**
- [Execute](../nodes/execute-node.md) 노드 또는 에이전트가 호출하는 **하위 Workflow**

수신자는 해당 Credentials와 하위 Workflow를 별도로(동일한 사용자 또는 team과) 공유받아야 합니다. [Credentials 탭](../tabs/credentials-tab.md)에서 Credentials를 공유하십시오. [Credentials Sharing](./credentials-sharing.md)을 참조하십시오. 각 하위 Workflow는 자체 편집기의 공유 대화 상자에서 공유하십시오.

### 소유자 전용 설정

**Run with cURL** 구성 전체는 공유 후에도 소유자에게 남아 있습니다. 협업자는 여전히 대화 상자를 열고 생성된 명령을 복사할 수 있지만, 컨트롤은 읽기 전용입니다.

비소유자가 다음 중 하나를 변경하면 `403`과 함께 거부됩니다:

- **Authentication** (`auth_type`) 및 **Header Key** (`auth_header_key`)
- **Request Body** 모드 (`webhook_body_mode`) 및 **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) 및 **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`)는 다르게 동작합니다: 협업자에게 완전히 숨겨지며, 협업자의 쓰기는 거부되지 않고 무시됩니다. 편집기는 해당 필드를 마스킹하여 렌더링하므로, 여기서 `403`이 발생하면 공격을 알리는 대신 일반 저장이 중단됩니다.

이 블록이 소유자 전용인 이유는 인증 때문입니다: `Anonymous`는 인증되지 않은 호출자가 Workflow를 실행할 수 있게 하며, 로그인한 호출자가 없는 실행은 호출자가 아닌 **소유자**로서 Credentials와 전역 변수를 확인합니다. 블록의 나머지 부분은 게시된 요청 계약과 소유자의 비용 제어이므로 함께 이동합니다.

Workflow 수준 **Properties** 패널의 **On error, run workflow** (`error_workflow_id`)도 같은 이유로 소유자 전용입니다: [error workflow](./features.md#error-workflow)는 실패한 실행의 Credentials와 전역 변수로 실행되며, 이는 트리거된 실행과 익명 실행의 경우 소유자의 것입니다. 협업자는 해당 설정을 읽기 전용으로 보며, 비소유자가 추가, 교체 또는 초기화하면 `403`과 함께 거부됩니다.

캔버스, 이름, 설명 편집은 영향을 받지 않습니다.

### 실행 Token

협업자는 자신과 공유된 Workflow에 대해 실행 Token을 발급할 수 있습니다. 실행은 **Token을 발급한 사람**에게 귀속되므로, 소유자가 아닌 해당 사용자의 Credentials와 전역 변수를 사용합니다. 진정한 익명 호출 — 호출자가 없는 `auth_type: anonymous` — 만 소유자의 컨텍스트에서 실행됩니다.

## 삭제 예약

Workflow는 즉시 제거하는 대신 삭제 예약할 수 있습니다.

- **Field**: `scheduled_for_deletion` (nullable datetime)
- **Behavior**: 설정되면 Workflow는 `folder_id = null`로 이동하고 "Scheduled for Deletion" 섹션에 나타납니다.
### API

| Endpoint | Purpose |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` 설정, `folder_id` 초기화 |
| `DELETE /workflows/{id}/schedule-deletion` | `scheduled_for_deletion` 초기화 (복원) |

### UI

- **Drag to trash** – Workflow를 "Scheduled for Deletion" 영역으로 드롭하여 삭제 예약
- **Restore** – 예약에서 제거
- **Delete immediately** – 영구 삭제를 위한 휴지통 아이콘

### Cleanup Logic

Cron job이 매일 **23:59** (설정된 시간대)에 실행됩니다. Workflow는 다음 조건을 충족할 때만 삭제됩니다:

- **모든 시작 노드** (들어오는 엣지가 없는 노드, sticky/errorHandler 제외)의 `active === false`

시작 노드가 하나라도 여전히 활성 상태이면, Workflow는 다음 실행까지 유지됩니다.

## Dashboard UI

- **Folder rows** – New Folder, 확장/축소가 가능한 재귀적 폴더 트리. 각 폴더는 이름 아래에
  선택적 설명과 해당 폴더가 보유한 Workflow 수(하위 폴더 포함)를 나타내는 배지를 표시합니다.
- **Folder actions** – New Subfolder, Rename, Change icon, Download as ZIP, Delete가 모든 폴더
  행에 인라인으로 표시됩니다. 우클릭 컨텍스트 메뉴에서도 동일한 기능을 제공하며, 모바일에서는
  단일 메뉴 버튼으로 표시됩니다.
- **Main area** – 루트 Workflow (폴더 없음, 예약되지 않음) 및 Scheduled for Deletion
- **Folder drop preview** – Workflow를 드래그하면 정확한 폴더 또는 하위 폴더가 강조되고
  카드 크기의 미리보기에 전체 경로가 표시됩니다. 접힌 폴더는 짧은 호버 후 확장됩니다.
- **Stable drag feedback** – 소스 카드는 드래그 고스트를 사용하며, 활성 드롭 대상은 스크롤
  중이나 동일 폴더 내 컨트롤을 넘을 때도 선택 상태를 유지합니다.
- **Destination check** – 현재 폴더는 **Already in Folder**로 표시되며 중복 이동을
  허용하지 않습니다.
- **Other drop zones** – Root 및 "Scheduled for Deletion"은 드래그된 Workflow를 수락할 수
  있을 때 강조됩니다.
- **ZIP drop** – ZIP 파일을 Workflow 영역에 드롭하면 루트 레벨에서 폴더 구조를 가져옵니다

## Related

- [Workflows Tab](../tabs/workflows-tab.md) – Workflow 생성 및 관리
- [Credentials Sharing](./credentials-sharing.md) – Workflow 협업자와 credential 공유
- [Teams](./teams.md) – 팀과 Workflow 및 credential 공유
- [Core Concepts](../getting-started/core-concepts.md) – Workflow, 노드, 실행
- [Workflow Structure](./workflow-structure.md) – Workflow의 JSON 형식
- [Triggers](./triggers.md) – 시작 노드 및 진입점

# Workflows 탭

**Workflows** 탭은 기본 대시보드 화면입니다. Workflow 목록, 폴더 구조를 표시하며, Workflow를 생성, 편집, 정리할 수 있습니다.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Workflows 데모 시청</a></p>

## 채팅 시작

Workflow 목록 위에는 이름으로 인사하며 무엇을 자동화하고 싶은지 묻는 채팅 상자가 있습니다. Prompt를 입력하고, 선택적으로 파일 하나를 첨부한 뒤, 원하는 credential과 모델을 선택하십시오. 두 드롭다운 모두 검색 가능하며 [AI defaults](../reference/user-settings.md)에서 시작합니다.

전송하면 새 대화가 생성되고 [Chat 탭](./chat-tab.md)에서 열리며, 여기서 응답이 스트리밍됩니다. 지원되는 첨부 파일은 텍스트 파일, 이미지, PDF이며, 채팅 작성기와 동일하게 메시지당 하나씩 첨부할 수 있습니다.

아직 LLM credential이 없다면, 상자에 [Credentials 탭](./credentials-tab.md)으로 가는 링크가 표시되며 전송이 비활성화됩니다.

**x**를 클릭하여 상자를 숨기십시오. 그러면 Workflows 제목 옆에 **Ask AI** 버튼이 나타나며 이를 다시 불러올 수 있습니다. 이 선택은 브라우저에 기억됩니다.

## Workflow 목록

목록은 2분할 화면입니다. 왼쪽에는 Workflow와 폴더가, 오른쪽에는 선택한 Workflow의 미리보기가 표시됩니다.

- 각 행에는 Workflow 아이콘, 이름, 설명, 마지막 업데이트 시각, 그리고 [상태 칩](#workflow-status)이 표시됩니다
- Workflow는 루트 또는 폴더 안에 있을 수 있으며, 고정된 Workflow는 상단의 별도 **Pinned** 그룹에 나타납니다
- 행을 **클릭**하면 선택되고 오른쪽에 미리보기가 로드됩니다
- 행을 **더블클릭**하거나 포커스된 상태에서 **Enter**를 누르면 [에디터](../getting-started/quick-start.md)에서 열립니다
- **Ctrl+클릭**(또는 **Cmd+클릭**)을 사용하면 새 탭에서 열립니다
- 모든 행의 오른쪽에는 편집, 복사, 고정, 삭제 액션이 있습니다. 휴대폰에서는 이름이 전체 너비를 유지하도록 숨겨지며, 해당 환경에서는 행을 **길게 누르면** 액션 시트가 열립니다
- 자주 사용하는 Workflow를 [Quick Drawer](../reference/quick-drawer.md)에 고정하면 Workflows 탭 및 기타 내부 페이지에서 빠르게 실행할 수 있습니다

## Workflow 미리보기

Workflow를 선택하면 목록 옆의 미리보기 패널이 채워집니다. 1280px보다 좁은 화면에서는 동일한 패널이 화면 하단에서 시트 형태로 열립니다.

패널에는 다음이 표시됩니다.

- Workflow 이름, 생성자와 생성 시각, 마지막 편집 시각
- **Open Workflow** – 에디터에서 Workflow를 엽니다
- **Run Now** – [Quick Drawer](../reference/quick-drawer.md)에서 Workflow를 열며, 목록을 벗어나지 않고 입력값을 채우고 실행을 시작할 수 있습니다
- **Description** – Workflow 설명
- **Trigger Configuration** – cron Workflow의 경우 스케줄, 이벤트 Workflow의 경우 수신 Trigger입니다. HTTP를 통해 호출되는 Workflow는 원시 Endpoint와 인증 설명 대신 **Copy cURL** 버튼을 표시합니다. 이 버튼은 올바른 URL, 헤더, 인증 플레이스홀더, 그리고 Workflow의 입력 필드로 구성된 본문을 포함한 완전한 요청을 복사합니다. Workflow가 [portal](../reference/portal.md)을 게시하는 경우, 해당 공개 채팅 링크도 여기에 나타납니다
- **Last Run Details** – 가장 최근 실행의 결과와 소요 시간, 또는 Workflow가 실행된 적이 없다는 안내
- **Workflow Steps & Sub-agents** – 실행 순서대로 나열된 노드로, 각각 모델, 작업 또는 스케줄과 활성 여부를 나타내는 점이 표시됩니다. 단계를 선택하면 해당 노드가 속성 패널이 열린 상태로 에디터에서 열립니다

패널은 스크롤하는 동안 목록 옆에 고정되어, 긴 Workflow 목록에서도 읽기 편하게 유지됩니다.

## 인스턴스 관리

`HEYM_ADMIN_EMAILS`에 등록된 계정은 공유나 소유권 이전 없이도 인스턴스의 모든 Workflow를 나열하고, 열고, 편집하고, 실행 기록을 조회하고, 삭제할 수 있습니다. 이 설정은 쉼표로 구분된 이메일 주소 목록이며, 대소문자를 구분하지 않고 일치시킵니다. 목록이 비어 있으면 아무에게도 이 접근 권한이 부여되지 않습니다. 변경 후에는 백엔드를 재시작하십시오.

관리자는 Workflow 목록에서 소유자의 이메일을 확인할 수 있으며 해당 주소로 검색할 수 있습니다. Workflow를 선택하면 미리보기에서 **Instance administration**을 열 수 있습니다:

1. **Pause triggers**는 Cron 노드를 포함한 Workflow에만 표시됩니다. 이는 일반적인 버전 지정 저장을 통해 해당 Workflow의 Cron 및 기타 자동 Trigger 노드를 비활성화합니다. 기존 실행은 완료될 수 있습니다. 수동, API, portal, sub-workflow 호출은 계속 사용할 수 있으며, 이 작업은 Workflow 전체의 실행 잠금이 아닙니다.
2. 일시 중지된 동안 버튼은 **Resume triggers**로 변경되며, 페이지를 새로 고친 후에도 마찬가지입니다. Resume은 관리자가 일시 중지한 Trigger를 다시 활성화하고, 이미 비활성화되어 있던 Trigger는 변경하지 않습니다. 저장된 관리자 일시 중지 상태가 없는 이전의 일시 중지된 Workflow의 경우, Resume은 해당 자동 Trigger를 활성화합니다.
3. 실행이 정리된 후 Workflow 행의 **Delete workflow** 작업을 사용하십시오. 실행 중이거나 대기 중이거나 검토 대기 중인 작업이 남아 있으면 삭제는 충돌을 반환합니다. 예약 삭제에도 동일한 검사가 적용됩니다.

삭제하기 전에 Trigger를 일시 중지하고 기존 실행이 완료되도록 하십시오. 일시 중지 시점에 이미 디스패치된 Trigger는 여전히 완료될 수 있습니다. Workflow를 더 이상 호출할 수 없어야 하는 경우에는 삭제를 사용하십시오.

소유자 전용 Webhook secret 및 인증 설정은 기존의 보호를 유지합니다. 관리는 소유권을 이전하거나 소유자의 자격 증명 레코드를 공유하지 않습니다. 관리자의 일시 중지, 재개, 삭제, 예약 작업은 [audit trail](../reference/audit.md)에 작업을 수행한 관리자와 Workflow 소유자와 함께 나타납니다.

## Workflow 상태

모든 행에는 Workflow의 Trigger 노드, 실시간 실행 상태, 그리고 Trigger 노드가 없는 Workflow의 경우 가장 최근 실행이 어떻게 시작되었는지에서 파생된 상태 칩이 표시됩니다:

| 상태 | 의미 |
| --- | --- |
| **Running** | 현재 Workflow에 진행 중인 실행이 있습니다 |
| **Scheduled** | 활성 [cron](../nodes/cron-node.md) Trigger가 있습니다 |
| **Listening** | Slack, Telegram, IMAP, WebSocket Trigger 등 활성 이벤트 Trigger가 있습니다 |
| **Paused** | Trigger 노드가 있지만 모두 비활성화되어 있습니다 |
| **API** | Trigger 노드가 없으며 마지막 실행이 execute Endpoint에 대한 HTTP 호출로 이루어졌습니다 |
| **SubWorker** | Trigger 노드가 없으며 마지막 실행이 상위 Workflow에 의해 sub-workflow로 이루어졌습니다 |
| **Portal** | Trigger 노드가 없으며 마지막 실행이 해당 [portal](../reference/portal.md)에서 이루어졌습니다 |
| **WEB** | Trigger 노드가 없으며 유일한 터미널이 [HTML output mapper](../nodes/html-output-mapper-node.md)이므로 호출 시 렌더링된 웹 페이지를 반환합니다 |
| **Manual** | Trigger 노드가 없으며 실행된 적이 없거나 마지막 실행이 다른 곳에서 시작되었습니다 |
| **Remove Scheduled** | [삭제 예약](../reference/workflow-organization.md)되어 있습니다 |

API, SubWorker, Portal 칩은 Workflow의 [execution history](./logs-tab.md)에서 가장 최근 항목 하나를 읽으므로, 두 가지 방식으로 호출되는 Workflow는 마지막으로 호출된 방식을 표시합니다. **WEB**은 대신 그래프에서 결정되므로 이 세 가지보다 우선합니다: 페이지를 제공하는 Workflow는 HTTP로 호출된 후에도 WEB으로 표시됩니다. Trigger 노드는 항상 이 모든 것보다 우선합니다: 누군가 HTTP로도 호출하는 cron Workflow는 **Scheduled**로 유지됩니다.

검색 필드 옆의 **Status** 드롭다운을 사용하여 하나의 상태만 표시하십시오. 드롭다운에는 현재 각 상태와 일치하는 Workflow 수가 나열됩니다. 상태 필터는 폴더 내부까지 적용됩니다: 일치하는 항목이 있는 폴더는 자동으로 펼쳐지고, 일치하는 항목이 없는 폴더는 필터를 해제할 때까지 숨겨집니다.

## 활성 Workflow

데스크톱에서 상단 툴바의 원형 배지는 현재 실행 중인 Workflow 수를 표시하며 10초마다 자동으로 새로 고쳐집니다. 0이 아닌 배지를 클릭하면 활성 Workflow 목록이 열리며, 스크롤하기 전까지 최대 4개의 행을 표시합니다. Workflow 이름을 선택하면 편집기가 해당 실행의 라이브 뷰에 연결됩니다. 0 배지는 정보 제공용이며 열 수 없고, 배지는 모바일 화면에서 숨겨집니다.

## 검색

**Status** 옆의 Workflow 검색 필드를 사용하거나 **Ctrl+F**(또는 **Cmd+F**)를 눌러 제목이나 설명으로 Workflow를 필터링하십시오. 폴더 내부의 일치하는 Workflow는 해당 폴더 분기가 펼쳐진 상태로 표시됩니다. **Escape**를 눌러 검색을 지우십시오.

## 폴더

- Workflow를 [폴더 및 하위 폴더](../reference/workflow-organization.md)로 구성하십시오
- **New Folder** 버튼으로 폴더를 생성하며, 각 폴더에 이름과 선택적 설명을 지정하면 목록에서 이름 아래에 표시됩니다
- 각 폴더 행에는 하위 폴더를 포함한 Workflow 개수가 표시되며, 새 하위 폴더 생성, 이름 변경, 아이콘 변경, ZIP으로 다운로드, 삭제 작업도 함께 제공됩니다. 휴대폰에서는 대신 단일 메뉴 버튼이 표시됩니다
- Workflow를 폴더나 하위 폴더 위로 드래그하면 카드 크기의 대상 미리보기가 나타납니다. 강조 표시된
  미리보기는 드롭하기 전에 전체 폴더 경로를 보여주며, 접힌 폴더 위에 잠시 머무르면 폴더가
  잠깐 펼쳐져 중첩된 폴더에 접근할 수 있습니다.
- Workflow를 폴더 간에 또는 루트로 드래그하십시오. 드래그 중인 카드는 고스트로 계속 표시되며,
  스크롤하는 동안 활성 대상이 계속 강조 표시됩니다.
- Workflow를 현재 폴더에 다시 드롭하는 것은 비활성화되며 **Already in Folder**로 표시됩니다.
- 이름 변경 작업이나 마우스 오른쪽 버튼 컨텍스트 메뉴에서 폴더 이름을 바꾸거나 설명을 변경하십시오

## Workflow 생성

1. **New Workflow**를 클릭합니다
2. 이름과 선택적 설명을 입력합니다
3. Workflow가 편집기에서 열립니다

## 가져오기

JSON Workflow 파일을 Workflow 영역으로 드래그 앤 드롭하여 새 Workflow를 생성하십시오. 가져온 노드와 엣지가 Workflow 생성에 사용되며, 이름은 JSON의 `name` 필드나 파일 이름에서 가져옵니다. JSON 형식과 가져오기 옵션은 [다운로드 및 가져오기](../reference/download-import.md)를 참조하십시오.

## 공유

편집기에서 Workflow를 열고 **Share**를 클릭하여 이메일로 사용자를 초대하거나 [팀](./teams-tab.md)과 공유하십시오. 각 사용자나 팀에 대해 **Read**(보기 및 실행) 또는 **Write**(편집도 가능)를 선택하고, 나중에 항목 옆의 드롭다운에서 변경할 수 있습니다. Credential과 하위 Workflow는 자동으로 공유되지 않으므로, 동일한 사용자나 팀과 별도로 공유하십시오. [Workflow 구성](../reference/workflow-organization.md#sharing-workflows) 및 [Credential 공유](../reference/credentials-sharing.md)를 참조하십시오.

## 편집 및 삭제

- **Edit** – 행의 편집 작업에서 Workflow 이름과 설명을 변경합니다
- **Delete** – Workflow는 [삭제 예약](../reference/workflow-organization.md)되며, 영구 삭제 전에 휴지통 영역으로 이동합니다

## 동시 편집

저장 시 편집의 기반이 된 리비전을 함께 전송하며, 그 사이에 Workflow가 변경된 경우 — 예를 들어 팀원이 저장했거나 동일한 Workflow를 두 번째 탭에서 열어둔 경우 — 서버가 쓰기를 거부합니다. 그러면 Heym은 두 가지 선택지가 있는 **Stale Workflow Detected** 대화 상자를 표시합니다:

- **Cancel** – 저장하지 않은 변경 사항을 편집기에 유지하여 다른 탭에서 다시 로드하고 조정할 수 있습니다
- **Override** – 그대로 저장하여 다른 사람의 버전을 덮어씁니다

Workflow를 **실행**하면 먼저 저장되므로 동일한 검사를 거칩니다. Workflow가 그 사이에 변경된 경우, 실행은 조용히 덮어쓰지 않고 대화 상자에서 일시 중지됩니다: **Override and Run**은 사용자의 버전을 저장하고 실행을 시작하며, **Cancel Run**은 둘 다 취소하고 편집 내용을 그대로 유지합니다.

이 검사는 저장 요청 자체의 일부이므로 추가 왕복 비용이 들지 않으며, 저장이 검사를 빠져나갈 수 있는 창이 존재하지 않습니다. 앱의 다른 곳에서 발생한 본인의 변경 — 이름 변경, 설정 변경, 속성 패널 토글 — 은 충돌로 간주되지 않습니다.

## 명령 팔레트

**Ctrl+K**(또는 **Cmd+K**)를 눌러 명령 팔레트를 여십시오. 다음을 수행할 수 있습니다:
- 이름으로 Workflow 검색
- 모든 [대시보드 탭](./credentials-tab.md)으로 이동
- 최근 Workflow 열기

## 관련 항목

- [빠른 시작](../getting-started/quick-start.md) – 첫 Workflow 만들기
- [Workflow 구성](../reference/workflow-organization.md) – 폴더, 하위 폴더, 예약 삭제
- [Workflow 구조](../reference/workflow-structure.md) – Workflow의 JSON 형식
- [다운로드 및 가져오기](../reference/download-import.md) – Workflow를 JSON으로 내보내기 및 가져오기
- [Portal](../reference/portal.md) – Workflow를 공개 채팅 UI로 노출
- [Board](./board-tab.md) – 컬럼 체인을 통해 칸반 카드에서 Workflow 실행
- [핵심 개념](../getting-started/core-concepts.md) – Workflow, 노드, 실행
- [실행 기록](../reference/execution-history.md) – 과거 실행 보기 및 Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 대시보드, 문서 및 기타 비편집기 페이지에서 Workflow 고정 및 실행
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간단한 페이지 가이드

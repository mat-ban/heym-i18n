# Dashboard

**Dashboard** 탭은 차트 위젯의 그리드를 구성하는 Grafana 스타일의 공간입니다. 각 위젯은 자체적인 숨겨진 Heym Workflow의 출력으로부터 렌더링되므로, Workflow에서 생성할 수 있는 모든 데이터 — 데이터베이스 쿼리, API 호출, RAG 조회, LLM 출력 — 을 차트로 만들 수 있습니다. 여러 개의 Dashboard를 유지하고 각각을 개인 또는 팀과 공유할 수 있습니다.

## Dashboards

모든 사용자는 탭을 처음 열 때 생성되는 하나의 Dashboard로 시작합니다. 탭 상단의 Dashboard 선택기를 사용하여 Dashboard 간에 전환하고, 옆의 **+** 를 사용하여 새 Dashboard를 생성하십시오. 선택기에는 본인의 Dashboard가 먼저 나열되고, 그다음에 공유받은 Dashboard가 공유한 사람의 이름과 함께 표시됩니다.

탭은 마지막으로 사용한 Dashboard를 다시 열며, 주소 표시줄에는 열려 있는 Dashboard(`?tab=dashboard&dashboard=<id>`)가 포함되므로, 링크를 통해 해당 Dashboard에 접근 권한이 있는 사람이라면 누구나 정확히 그 Dashboard를 열 수 있습니다.

설정 버튼(소유자 전용)은 Dashboard의 이름을 변경하고, [상세 페이지](#detail-pages)로서 허용할 레코드 형식을 지정하며, 공유를 관리하고 삭제합니다. Dashboard를 삭제하면 해당 위젯과 그 Workflow도 함께 제거됩니다. 본인의 Dashboard는 항상 최소 하나가 유지되므로, 마지막 하나는 삭제할 수 없습니다.

## Widgets

위젯은 그리드 위의 단일 차트입니다. 지원되는 차트 유형은 다음과 같습니다:

- **Bar** (세로 또는 가로)
- **Line**
- **Area** (채워진 추세, 다중 시리즈 지원)
- **Pie**
- **Table** (스크롤 가능; 열 머리글을 클릭하면 오름차순으로 정렬되고 다시 클릭하면 내림차순으로 정렬됩니다. 한 열을 [상태 칩](../nodes/chart-output-node.md#status-chips)으로 렌더링할 수 있고, 한 열에는 새 탭에서 URL을 여는 [링크 버튼](../nodes/chart-output-node.md#link-buttons)을 포함할 수 있으며, 행을 클릭하여 [상세 페이지](#sang-se-pei-ji)를 열 수 있습니다)
- **Numeric** (선택적 단위가 있는 단일 KPI 값)
- **Gauge** (최소–최대 범위에 대한 단일 값, 예: 백분율)
- **Scatter** (상관관계 도표를 위한 X/Y 포인트)
- **Proportion** (백분율 범례와 함께 비율로 분할된 하나의 막대, 예: 언어별 분석)
- **Bar gauge** (빨강→초록 그라디언트와 값이 있는 행당 하나의 가로 게이지, 예: 여유 디스크 공간)
- **Text** (markdown 메시지, 예: "Last execution at 19:47"과 같은 상태 메모. markdown이 정적인 경우 [interactive checkboxes](../nodes/chart-output-node.md#interactive-task-lists)를 지원하며, 사용자 지정 또는 내림차순 번호 매기기를 위한 [explicit numbered lists](../nodes/chart-output-node.md#numbered-lists)도 지원합니다)
- **HITL** (대기 중인 human review. 헤더에 `1/n pending`이 표시됩니다. Workflow 이름을 클릭하면 캔버스에서 해당 실행이 열립니다. **Approve**, **Request changes**, **Reject** 로 처리합니다. 위젯 제목 옆의 기록 아이콘은 이 페이지의 기록 대화상자에서 해당 실행을 엽니다. 이 위젯은 업스트림 행을 사용하지 않으며, 각 사용자는 자신의 큐를 봅니다. 대신 해당 Workflow를 열 수 있는 모든 사람을 위해 단일 Workflow의 검토를 표시할 수도 있습니다. [HITL 위젯](#hitl-wi-jes)을 참조하세요)

차트 외에도 **Run a workflow** 위젯은 대시보드에서 바로 사용자의 Workflow 중 하나를 실행합니다. 드롭된 파일, 입력 필드 또는 Run 버튼으로 실행할 수 있습니다([실행 위젯](#run-widgets) 참조).

각 위젯은 탭을 열 때 데이터를 비동기적으로 로드하므로, 차트가 채워지는 동안에도 페이지가 반응성을 유지합니다.

## Adding a widget

1. **Add widget** 을 클릭하고 제목을 지정한 후 차트 유형을 선택하십시오. 선택기 아래에서 대화상자는 해당 차트 유형의 예시를 샘플 데이터와 함께 그려주고 예상하는 행의 이름을 표시하므로, 아무것도 만들기 전에 유형을 비교할 수 있습니다.
2. 위젯이 Workflow 편집기에서 시작 그래프와 함께 열립니다: 행을 생성하는 [Set](../nodes/set-node.md) 노드가 [Chart Output](../nodes/chart-output-node.md) 노드에 연결되어 있습니다. Set 노드를 원하는 데이터 소스로 교체하십시오. **HITL** 위젯은 Chart Output 노드만으로 구성되며, 대기 중인 review를 읽고 데이터 소스가 필요하지 않습니다.
3. **Chart Output** 에 공급하는 노드가 행의 배열을 생성하도록 Workflow를 구성한 다음, Chart Output 노드의 필드 매핑(레이블 필드, 값 필드 등)을 설정하십시오.
4. 저장하고 Dashboard 탭으로 돌아오면 위젯이 렌더링됩니다.

**Run a workflow** 위젯의 경우, 대신 실행할 Workflow를 선택하세요. 선택기에 위젯이 각 Workflow를 어떻게 실행할지 표시됩니다. 위젯이 그리드에 바로 추가되며 새로 만들 Workflow는 없습니다.

위젯을 더블 클릭하거나 편집 버튼을 사용하여 언제든지 해당 Workflow를 다시 열 수 있습니다. 위젯 헤더의 **Clone widget** 을 사용하면 위젯과 그 전체 Workflow를 모두 복제할 수 있습니다. 복사본은 원본 아래에 배치되고 **(Copy)** 로 레이블이 지정되므로 독립적으로 편집할 수 있습니다.

## HITL 위젯

새로운 HITL 위젯은 자신의 큐에서 대기 중인 모든 검토를 표시합니다. 하나의 Workflow 검토만 표시하려면 위젯의 **설정**을 엽니다:

1. **Workflow**에서 해당 Workflow를 선택합니다. 목록에는 열 수 있는 Workflow(자신이 소유하거나 자신 또는 팀과 공유된 Workflow) 중 사람을 기다리는 단계가 있는 Workflow(사람 검토가 포함된 Agent 또는 Slack 승인, 버튼, 양식 단계)가 포함됩니다. 옆에 있는 아이콘을 클릭하면 해당 Workflow가 새 탭에서 열립니다.
2. Workflow에 이러한 단계가 하나만 있는 경우 자동으로 선택됩니다. 여러 개가 있는 경우 **Select agent**는 노드 이름별로 목록을 표시하며 **All agents**가 맨 위에 표시됩니다. Slack 단계에는 **(Slack)** 표시가 붙습니다.
3. 저장합니다. 헤더의 `1/n pending`은 해당 검토만 계산합니다. 자신의 큐를 다시 표시하려면 **모든 Workflow**를 선택합니다.

캔버스의 Chart Output 노드 속성에서도 동일한 선택을 할 수 있습니다. **AI로 세부 조정**을 사용하여 지정할 수도 있고(”송장 승인만 표시”), Workflow 이름을 지정하는 새 위젯 설명에서도 설정할 수 있습니다. 모든 변경 사항은 Workflow 편집이므로 Edit History에 표시됩니다.

- **검토를 볼 수 있는 사람.** Workflow로 필터링된 위젯은 해당 Workflow를 열 수 있는 모든 사람에게 해당 Workflow의 검토를 표시하며, Workflow를 실행할 수 있는 것과 마찬가지로 위젯에서 승인, 변경 요청 또는 거부를 수행할 수 있습니다. 필터링되지 않은 위젯은 각 사용자에게 자신의 큐를 표시합니다.
- **위젯을 볼 수 있는 사람.** 선택한 Workflow를 열 수 없는 사용자는 공유된 대시보드에서도 위젯을 전혀 볼 수 없습니다. 대시보드 소유자가 액세스 권한을 잃거나 Workflow가 삭제되면 소유자에게 ”You no longer have access to the workflow this widget shows”라는 메시지가 표시되며 **설정**에서 다른 항목을 선택할 수 있습니다.
- **액세스 가능한 항목만 선택 가능.** 열 수 없는 Workflow는 설정에서든 캔버스에서든 AI를 통해서든 위젯을 저장할 때 거부됩니다.

## 상세 페이지

테이블 위젯은 행을 다른 Dashboard에 연결할 수 있으며, 연결된 Dashboard는 모든 고객, 청구서 또는 티켓을 처리하는 상세 페이지 역할을 합니다.

1. 테이블 위젯의 **Settings**를 열고 **Row link** 아래에서 연결할 Dashboard를 선택합니다.
2. 행을 식별하는 값이 들어 있는 열인 **Record column**(예: `id`)을 입력하고, 선택적으로 행의 이름을 나타내는 **Label column**(예: `name`)을 입력합니다.
3. 저장합니다. 행을 클릭하면(또는 포커스를 맞춘 뒤 Enter를 누르면) `?record=<value>&label=<name>`과 함께 연결된 Dashboard가 열립니다.

상세 Dashboard에서 모든 위젯 Workflow는 해당 값을 `$page.record`로 읽으며([Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord) 참조), 페이지의 그리드 위에는 레코드를 지우는 버튼과 함께 `Dashboard / <label>`이 표시됩니다. 뒤로 가기를 누르면 원래 왔던 테이블로 돌아갑니다.

- **열 수 있는 사용자.** 행은 연결된 Dashboard를 열 수 있는 권한이 있는 조회자에게만 클릭 가능하게 표시됩니다. 다른 사용자에게는 링크가 없는 동일한 테이블이 보입니다.
- **레코드 형식.** 레코드는 URL에서 전달되므로 상세 Dashboard가 허용할 형식을 결정합니다. 설정의 **Detail page records**는 ID(문자, 숫자, `-`, `_`, `.` 조합으로 최대 128자, 기본값), 숫자, UUID 또는 이메일 주소 중 하나입니다. 그 외의 값은 위젯이 실행되기 전에 거부되며, 위젯에는 "This page does not accept that record"가 표시됩니다.
- **여전히 소유자 권한으로 실행.** 상세 페이지에서도 위젯은 Dashboard 소유자 권한으로 실행됩니다. 빌더는 노드가 값을 이스케이프(escape) 처리하는 위치에만 `$page.record`를 전달해야 하며, 쿼리 텍스트에 직접 삽입해서는 안 됩니다.
- **캐싱.** 각 위젯은 위젯과 동일한 유효 기간(TTL) 동안 레코드별로 차트를 캐시하며, 가장 최근에 사용된 50개의 레코드를 유지합니다.

## 실행 위젯

**Run a workflow** 위젯은 사용자의 Workflow 중 하나를 실행하고 상태, 실행 시간 및 출력 결과를 보여줍니다. 표시되는 내용은 Workflow가 받는 입력에 따라 달라집니다.

- **파일.** [File Upload Trigger](../nodes/file-upload-trigger-node.md)로 시작하는 Workflow의 경우, 파일을 위젯에 드롭하면(또는 클릭하여 선택하면) 위젯이 트리거의 일회용 업로드 링크를 통해 파일을 업로드합니다. 위젯은 트리거가 허용하는 파일 형식과 크기를 표시하며, 허용되지 않는 파일은 업로드 전에 거부합니다. Workflow가 Text Input 노드로도 시작하는 경우 드롭 영역 옆에 해당 입력 필드를 함께 표시합니다. 파일을 선택하고 필드를 채운 뒤 **Run**을 누르면 두 가지가 모두 전송됩니다. 입력값은 위젯이 발급한 업로드 링크와 함께 전달되므로 공유된 업로드 링크로는 이를 설정할 수 없습니다.
- **입력 필드.** Text Input 노드로 시작하는 Workflow의 경우, 위젯에 기본값과 함께 입력 필드가 표시되며 **Run**을 누르면 입력한 값으로 Workflow가 실행됩니다. Workflow에 없는 필드의 값은 무시됩니다.
- **없음.** 입력이 없는 Workflow에는 **Run** 버튼이 표시됩니다.

결과의 **Wrap** 버튼은 상자 안에서 긴 출력 줄을 자동 줄바꿈합니다. 출력의 JSON 레이아웃을 그대로 읽으려면 이 옵션을 끄세요.

- 차트를 새로고침할 수 있는 것처럼 Dashboard를 열 수 있는 사람이라면 누구나 위젯을 실행할 수 있습니다. Workflow에 대한 접근 권한은 Dashboard 소유자를 따릅니다. 위젯을 추가하려면 사용자와 소유자 모두가 실행할 수 있는 Workflow가 필요하며, 실행 자체는 일반 업로드 링크처럼 Workflow 소유자의 credential을 사용합니다.
- 실행 결과는 페이지를 떠날 때까지 본인의 화면에만 유지되며, 다른 조회자는 사용자의 파일, 입력값 또는 결과를 볼 수 없습니다. 실행 내역은 `dashboard` 트리거와 함께 실행 기록에 나타납니다.
- Dashboard 공유는 Workflow 자체에 대한 접근 권한을 부여하지 않습니다. **Edit workflow**는 이미 접근 권한이 있는 사람에게만 열리며, **Fine-tune with AI**는 제공되지 않습니다.
- 파일 실행은 모든 File Upload Trigger 실행과 마찬가지로 업로드된 파일이 저장되는 메인 인스턴스에서 실행됩니다.

## Generating a widget with AI

**AI** 를 클릭하고 원하는 지표를 설명한 후(예: "workflow success rate over the last 30 days as a bar chart"), LLM credential과 모델을 선택하십시오. Heym은 Chart Output 노드로 끝나는 완전한 위젯 Workflow를 생성하여 그리드에 추가합니다. 차트 유형별 예시 Prompt는 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)을 참조하십시오.

위젯에는 요청 언어로 ”미해결 사건”과 같은 한두 단어의 짧은 제목이 지정됩니다. 제목에는 데이터 테이블의 ID가 포함되지 않습니다. 모델이 문장으로 위젯 이름을 지정하면 Heym은 첫 몇 단어를 유지합니다.

위젯 API는 AI 없이도 **카운트 카드**를 만들 수 있습니다. `count_column` 및 `count_value`가 지정된 데이터 테이블(`data_table_id`)의 `text` 위젯은 해당 값을 가진 행 수를 표시하며, 위젯 제목에 해당 값이 표시됩니다. Heym Work는 데이터 테이블로 생성된 페이지를 상태당 하나의 카운트 카드로 시작합니다.

위젯의 **Fine-tune with AI** 버튼을 사용하여 새로운 지시로 기존 위젯을 수정하십시오. 각 AI fine-tune은 이전 Workflow를 위젯의 **Edit History** 에 스냅샷으로 저장하므로, Workflow 편집기에서 변경 사항을 검토하거나 롤백할 수 있습니다.

## Editing the layout

**Edit** 를 토글하여 편집 모드로 진입하면, 12열 그리드에서 위젯을 드래그하고 크기를 조정할 수 있습니다. 레이아웃 변경 사항은 자동으로 저장됩니다. 위젯 제목은 위젯 헤더에서 인라인으로 편집할 수 있습니다.

## Caching and refresh

각 위젯은 마지막으로 계산된 데이터를 서버에 구성 가능한 TTL(time-to-live) 동안 캐시합니다. 캐시가 신선한 동안에는 Dashboard를 다시 열어도 Workflow를 재실행하는 대신 저장된 결과를 제공합니다. 캐시는 데이터가 재계산될 때마다 제자리에서 교체되며(위젯당 하나의 캐시, 그리고 [상세 페이지](#detail-pages)의 레코드당 하나의 캐시), 위젯의 Workflow를 편집하면 자동으로 무효화됩니다.

위젯의 **Refresh** 버튼(또는 도구 모음의 **Refresh**)을 사용하여 캐시를 우회하고 즉시 재계산하십시오.

## 공유

소유자는 설정에서 개별 사용자(이메일 기준) 또는 자신이 속한 [team](teams-tab.md)과 대시보드를 공유할 수 있습니다. 각 공유는 **Read** 또는 **Write**이며, 누군가 개인 공유와 team 공유를 모두 보유한 경우 더 강한 권한이 적용됩니다.

| 작업 | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| 위젯 조회, 새로고침, 자동 새로고침 사용 | ✓ | ✓ | ✓ |
| 상세 페이지 열기, 실행 위젯 실행 | ✓ | ✓ | ✓ |
| 위젯 추가, 복제, 삭제, 이름 변경 및 크기 조정; AI 생성 및 미세 조정; 체크리스트 항목 체크 | ✓ | ✓ | |
| 편집기에서 위젯의 Workflow 열기 | ✓ | ✓ | |
| 대시보드 이름 변경 또는 삭제, 레코드 형식 설정, 공유 관리 | ✓ | | |

**위젯은 항상 대시보드 소유자로서 실행됩니다.** 누가 보고 있든, 위젯은 소유자의 자격 증명과 전역 변수를 사용하며, 그 실행은 소유자의 실행 기록과 trace에 나타납니다. 따라서 팀원은 그 뒤에 있는 계정에 대한 접근 없이 동일한 데이터를 볼 수 있으며, 모든 조회자는 위젯당 하나의 캐시된 결과를 공유합니다. Write 협업자가 추가하거나 복제한 위젯도 마찬가지로 소유자에게 귀속됩니다.

이로 인해 **Write**는 Workflow를 편집용으로 공유하는 것과 동일한 신뢰를 수반합니다. Write 접근 권한이 있는 협업자는 자신의 자격 증명으로 실행되는 내용을 변경할 수 있습니다. 따라서 자신의 Workflow를 편집하도록 허용할 사람에게만 이 권한을 부여하십시오. 협업자가 Workflow 편집기에서 시작한 테스트 실행은 여느 공유 Workflow와 마찬가지로 자신의 자격 증명을 사용합니다. 대시보드 자체만 소유자로서 실행됩니다. **Read**는 위젯 Workflow에 대한 접근 권한을 부여하지 않으며, 읽기 전용 조회자는 차트 자체는 받지만 그 뒤의 노드별 실행 세부 정보는 받지 못합니다.

공유를 제거하거나 Write에서 Read로 낮추면 즉시 적용됩니다.

## 관련 항목

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — 내장 실행 지표(사용자가 직접 만든 대시보드와는 다름)
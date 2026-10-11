# Dashboard

**Dashboard** 탭은 차트 위젯의 그리드를 구성하는 Grafana 스타일의 공간입니다. 각 위젯은 자체적인 숨겨진 Heym Workflow의 출력으로부터 렌더링되므로, Workflow에서 생성할 수 있는 모든 데이터 — 데이터베이스 쿼리, API 호출, RAG 조회, LLM 출력 — 을 차트로 만들 수 있습니다. 여러 개의 Dashboard를 유지하고 각각을 개인 또는 팀과 공유할 수 있습니다.

## Dashboards

모든 사용자는 탭을 처음 열 때 생성되는 하나의 Dashboard로 시작합니다. 탭 상단의 Dashboard 선택기를 사용하여 Dashboard 간에 전환하고, 옆의 **+** 를 사용하여 새 Dashboard를 생성하십시오. 선택기에는 본인의 Dashboard가 먼저 나열되고, 그다음에 공유받은 Dashboard가 공유한 사람의 이름과 함께 표시됩니다.

탭은 마지막으로 사용한 Dashboard를 다시 열며, 주소 표시줄에는 열려 있는 Dashboard(`?tab=dashboard&dashboard=<id>`)가 포함되므로, 링크를 통해 해당 Dashboard에 접근 권한이 있는 사람이라면 누구나 정확히 그 Dashboard를 열 수 있습니다.

설정 버튼(소유자 전용)은 Dashboard의 이름을 변경하고, 공유를 관리하며, 삭제합니다. Dashboard를 삭제하면 해당 위젯과 그 Workflow도 함께 제거됩니다. 본인의 Dashboard는 항상 최소 하나가 유지되므로, 마지막 하나는 삭제할 수 없습니다.

## Widgets

위젯은 그리드 위의 단일 차트입니다. 지원되는 차트 유형은 다음과 같습니다:

- **Bar** (세로 또는 가로)
- **Line**
- **Area** (채워진 추세, 다중 시리즈 지원)
- **Pie**
- **Table** (스크롤 가능)
- **Numeric** (선택적 단위가 있는 단일 KPI 값)
- **Gauge** (최소–최대 범위에 대한 단일 값, 예: 백분율)
- **Scatter** (상관관계 도표를 위한 X/Y 포인트)
- **Proportion** (백분율 범례와 함께 비율로 분할된 하나의 막대, 예: 언어별 분석)
- **Bar gauge** (빨강→초록 그라디언트와 값이 있는 행당 하나의 가로 게이지, 예: 여유 디스크 공간)
- **Text** (markdown 메시지, 예: "Last execution at 19:47"과 같은 상태 메모. markdown이 정적인 경우 [interactive checkboxes](../nodes/chart-output-node.md#interactive-task-lists)를 지원하며, 사용자 지정 또는 내림차순 번호 매기기를 위한 [explicit numbered lists](../nodes/chart-output-node.md#numbered-lists)도 지원합니다)
- **HITL** (대기 중인 human review. 헤더에 `1/n pending`이 표시됩니다. Workflow 이름을 클릭하면 캔버스에서 해당 실행이 열립니다. **Approve**, **Request changes**, **Reject** 로 처리합니다. 위젯 제목 옆의 기록 아이콘은 이 페이지의 기록 대화상자에서 해당 실행을 엽니다. 이 위젯은 업스트림 행을 사용하지 않으며, 각 사용자는 자신의 큐를 봅니다)

각 위젯은 탭을 열 때 데이터를 비동기적으로 로드하므로, 차트가 채워지는 동안에도 페이지가 반응성을 유지합니다.

## Adding a widget

1. **Add widget** 을 클릭하고 제목을 지정한 후 차트 유형을 선택하십시오. 선택기 아래에서 대화상자는 해당 차트 유형의 예시를 샘플 데이터와 함께 그려주고 예상하는 행의 이름을 표시하므로, 아무것도 만들기 전에 유형을 비교할 수 있습니다.
2. 위젯이 Workflow 편집기에서 시작 그래프와 함께 열립니다: 행을 생성하는 [Set](../nodes/set-node.md) 노드가 [Chart Output](../nodes/chart-output-node.md) 노드에 연결되어 있습니다. Set 노드를 원하는 데이터 소스로 교체하십시오. **HITL** 위젯은 Chart Output 노드만으로 구성되며, 대기 중인 review를 읽고 데이터 소스가 필요하지 않습니다.
3. **Chart Output** 에 공급하는 노드가 행의 배열을 생성하도록 Workflow를 구성한 다음, Chart Output 노드의 필드 매핑(레이블 필드, 값 필드 등)을 설정하십시오.
4. 저장하고 Dashboard 탭으로 돌아오면 위젯이 렌더링됩니다.

위젯을 더블 클릭하거나 편집 버튼을 사용하여 언제든지 해당 Workflow를 다시 열 수 있습니다. 위젯 헤더의 **Clone widget** 을 사용하면 위젯과 그 전체 Workflow를 모두 복제할 수 있습니다. 복사본은 원본 아래에 배치되고 **(Copy)** 로 레이블이 지정되므로 독립적으로 편집할 수 있습니다.

## Generating a widget with AI

**AI** 를 클릭하고 원하는 지표를 설명한 후(예: "workflow success rate over the last 30 days as a bar chart"), LLM credential과 모델을 선택하십시오. Heym은 Chart Output 노드로 끝나는 완전한 위젯 Workflow를 생성하여 그리드에 추가합니다. 차트 유형별 예시 Prompt는 [Chart Output](../nodes/chart-output-node.md#example-ai-prompts)을 참조하십시오.

위젯의 **Fine-tune with AI** 버튼을 사용하여 새로운 지시로 기존 위젯을 수정하십시오. 각 AI fine-tune은 이전 Workflow를 위젯의 **Edit History** 에 스냅샷으로 저장하므로, Workflow 편집기에서 변경 사항을 검토하거나 롤백할 수 있습니다.

## Editing the layout

**Edit** 를 토글하여 편집 모드로 진입하면, 12열 그리드에서 위젯을 드래그하고 크기를 조정할 수 있습니다. 레이아웃 변경 사항은 자동으로 저장됩니다. 위젯 제목은 위젯 헤더에서 인라인으로 편집할 수 있습니다.

## Caching and refresh

각 위젯은 마지막으로 계산된 데이터를 서버에 구성 가능한 TTL(time-to-live) 동안 캐시합니다. 캐시가 신선한 동안에는 Dashboard를 다시 열어도 Workflow를 재실행하는 대신 저장된 결과를 제공합니다. 캐시는 데이터가 재계산될 때마다 제자리에서 교체되며(위젯당 하나의 캐시), 위젯의 Workflow를 편집하면 자동으로 무효화됩니다.

위젯의 **Refresh** 버튼(또는 도구 모음의 **Refresh**)을 사용하여 캐시를 우회하고 즉시 재계산하십시오.

## 공유

소유자는 설정에서 개별 사용자(이메일 기준) 또는 자신이 속한 [team](teams-tab.md)과 대시보드를 공유할 수 있습니다. 각 공유는 **Read** 또는 **Write**이며, 누군가 개인 공유와 team 공유를 모두 보유한 경우 더 강한 권한이 적용됩니다.

| 작업 | Owner | Write | Read |
|--------|:-----:|:-----:|:----:|
| 위젯 조회, 새로고침, 자동 새로고침 사용 | ✓ | ✓ | ✓ |
| 위젯 추가, 복제, 삭제, 이름 변경 및 크기 조정; AI 생성 및 미세 조정; 체크리스트 항목 체크 | ✓ | ✓ | |
| 편집기에서 위젯의 Workflow 열기 | ✓ | ✓ | |
| 대시보드 이름 변경 또는 삭제, 공유 관리 | ✓ | | |

**위젯은 항상 대시보드 소유자로서 실행됩니다.** 누가 보고 있든, 위젯은 소유자의 자격 증명과 전역 변수를 사용하며, 그 실행은 소유자의 실행 기록과 trace에 나타납니다. 따라서 팀원은 그 뒤에 있는 계정에 대한 접근 없이 동일한 데이터를 볼 수 있으며, 모든 조회자는 위젯당 하나의 캐시된 결과를 공유합니다. Write 협업자가 추가하거나 복제한 위젯도 마찬가지로 소유자에게 귀속됩니다.

이로 인해 **Write**는 Workflow를 편집용으로 공유하는 것과 동일한 신뢰를 수반합니다. Write 접근 권한이 있는 협업자는 자신의 자격 증명으로 실행되는 내용을 변경할 수 있습니다. 따라서 자신의 Workflow를 편집하도록 허용할 사람에게만 이 권한을 부여하십시오. 협업자가 Workflow 편집기에서 시작한 테스트 실행은 여느 공유 Workflow와 마찬가지로 자신의 자격 증명을 사용합니다. 대시보드 자체만 소유자로서 실행됩니다. **Read**는 위젯 Workflow에 대한 접근 권한을 부여하지 않으며, 읽기 전용 조회자는 차트 자체는 받지만 그 뒤의 노드별 실행 세부 정보는 받지 못합니다.

공유를 제거하거나 Write에서 Read로 낮추면 즉시 적용됩니다.

## 관련 항목

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — 내장 실행 지표(사용자가 직접 만든 대시보드와는 다름)

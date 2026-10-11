# 키보드 단축키

Heym은 Workflow 편집기와 캔버스 전반에 걸쳐 키보드 단축키를 제공하여 일반적인 작업을 빠르게 수행할 수 있도록 합니다.

## 전역 편집기 단축키

이 단축키들은 Workflow 편집기의 어느 위치에서나 활성화됩니다.

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Command Palette 열기 |
| `Ctrl + I` / `Cmd + I` | [AI Assistant](./ai-assistant.md) 패널 토글 (입력 중에도 작동) |
| `Ctrl + Enter` / `Cmd + Enter` | 현재 Workflow 실행 |
| `Ctrl + S` / `Cmd + S` | Workflow 저장 |
| `Ctrl + Z` / `Cmd + Z` | 실행 취소 |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | 다시 실행 |
| `Ctrl + Y` / `Cmd + Y` | 다시 실행 (대체) |
| `Escape` | 열려 있는 오버레이, 대화 상자 및 패널 닫기 |

## 캔버스 단축키

이 단축키들은 캔버스에 포커스가 있을 때(텍스트 입력이 활성화되지 않은 상태) 적용됩니다.

### 선택 및 탐색

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + A` / `Cmd + A` | 모든 노드 선택 |
| `Shift` (길게 누름) | 드래그하여 여러 노드 선택 |
| `Ctrl` / `Cmd` (길게 누름) | 클릭하여 개별 노드를 선택 항목에 추가 |
| `Escape` | 모든 노드 선택 해제, 인라인 노드 검색 닫기 |

### 노드 편집

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + C` / `Cmd + C` | 선택한 노드 복사 |
| `Ctrl + X` / `Cmd + X` | 선택한 노드 잘라내기 |
| `Ctrl + V` / `Cmd + V` | 노드 붙여넣기 |
| `Delete` 또는 `Backspace` | 선택한 노드 및/또는 엣지 삭제 |
| `D` | 선택한 노드 활성화/비활성화 토글 |
| `P` | 선택한 노드의 고정된 데이터 토글 |

### 인라인 노드 검색

캔버스에서 인쇄 가능한 문자를 입력하면(텍스트 입력에 포커스가 없는 경우) 인라인 노드 검색 팝업이 열립니다. 입력한 문자가 검색 쿼리의 첫 번째 문자가 됩니다.

| 단축키 | 동작 |
|----------|--------|
| 인쇄 가능한 문자 | 인라인 노드 검색을 열고 입력 시작 |
| `Backspace` | 검색 쿼리에서 마지막 문자 제거 |
| `Escape` | 인라인 노드 검색 닫기 |

## Command Palette (`Ctrl + K`)

Command Palette는 편집기, 대시보드, 문서 및 evals 뷰에서 사용할 수 있습니다. 키보드에서 손을 떼지 않고도 Workflow, 탭 및 문서 페이지로 빠르게 이동할 수 있습니다.

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + K` / `Cmd + K` | Command Palette 열기 |
| `↑` / `↓` | 결과 목록 탐색 |
| `Tab` / `Shift + Tab` | 결과 목록 탐색 |
| `Enter` | 선택한 항목 열기 |
| `Escape` | 팔레트 닫기 |

## 대시보드 단축키

이 단축키들은 다른 텍스트 입력이 활성화되지 않은 상태에서 Workflows 탭에서 활성화됩니다.

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + F` / `Cmd + F` | Workflow 검색에 포커스 |
| `Escape` | 텍스트가 있는 경우 Workflow 검색 지우기 |

## 속성 패널 단축키

이 단축키들은 노드가 선택되고 속성 패널이 열려 있는 동안 활성화됩니다.

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + Shift + O` / `Cmd + Shift + O` | 연결된 하위 Workflow를 새 탭에서 열기 (Execute 노드 전용) |

## Evaluate 대화 상자 단축키

이 단축키들은 Evaluate 대화 상자가 열려 있는 동안 활성화됩니다.

| 단축키 | 동작 |
|----------|--------|
| `Ctrl + Enter` / `Cmd + Enter` | 표현식 적용 및 대화 상자 닫기 |
| `Ctrl + Z` / `Cmd + Z` | 표현식 편집기에서 변경 사항 실행 취소 |
| `Ctrl + Shift + Z` / `Cmd + Shift + Z` | 표현식 편집기에서 변경 사항 다시 실행 |
| `Ctrl + Y` / `Cmd + Y` | 표현식 편집기에서 변경 사항 다시 실행 (대체) |

## 기록 및 트레이스 단축키

이 단축키들은 Execution History 대화 상자 및 Traces 패널에서 사용할 수 있습니다.

| 단축키 | 동작 |
|----------|--------|
| `S` | 항목을 필터링하기 위해 검색 입력 토글 |

## 관련 항목

- [캔버스 기능](./canvas-features.md) – 데이터 고정, 활성화/비활성화, 하위 Workflow로 추출
- [Workflow 구조](./workflow-structure.md) – 노드 및 엣지 형식
- [Execute 노드](../nodes/execute-node.md) – 하위 Workflow 호출 (`Ctrl + Shift + O`)
- [빠른 시작](../getting-started/quick-start.md) – 첫 번째 Workflow 구축

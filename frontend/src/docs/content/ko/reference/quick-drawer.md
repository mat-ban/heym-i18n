# Quick Drawer

**Quick Drawer**는 Workflow를 빠르게 실행할 수 있는 오른쪽 사이드 패널입니다. 대시보드의 [Workflows 탭](../tabs/workflows-tab.md), Docs, Evals 등 인증된 페이지에서 표시됩니다.

## 접근

- 화면 오른쪽 중앙 가장자리에 고정된 **Quick / Workflows** 트리거를 클릭하십시오
- [Contextual Showcase](./contextual-showcase.md)도 사용 가능한 경우, 해당 **Page Guide** 트리거가 Quick Workflows 위에 위치합니다
- Drawer는 오른쪽에서 열리며, 현재 페이지를 왼쪽으로 이동시키면서 미세하게 축소합니다
- 모바일에서는 Quick Drawer가 숨겨집니다
- Workflow 편집기, 로그인/회원가입, 포털, HITL 리뷰 페이지에서는 Drawer가 표시되지 않습니다

## Workflow 검색

Drawer 상단의 필터 필드를 사용하여 다음 기준으로 Workflow를 검색할 수 있습니다:

- Workflow 이름
- Workflow 설명

검색은 대소문자를 구분하지 않으며, 목록이 즉시 갱신됩니다.

## 고정된 Workflow

Workflow를 고정하면 Drawer 상단에 유지됩니다.

- 고정된 Workflow는 전체 목록 위의 별도 섹션에 표시됩니다
- 새로 고정한 항목은 맨 위에 추가됩니다
- 고정 순서는 브라우저 저장소에 보존되어 새로고침 후에도 유지됩니다

## Workflow 실행

Workflow를 선택하면 입력 폼이 열립니다.

- 입력 필드는 Drawer 순서대로 세로로 표시됩니다
- **Run Workflow**를 클릭하여 선택한 Workflow를 실행하십시오
- **Stop Workflow**를 클릭하여 Drawer에서 실행 중인 실행을 취소하십시오
- Input 필드가 없는 Workflow도 바로 실행할 수 있습니다

Drawer는 다른 Heym 실행 화면과 동일한 Workflow 실행 API를 사용하므로, 출력과 런타임 동작이 일관되게 유지됩니다.

Drawer에서 실행을 중지하면 해당 Workflow 실행의 진행 중인 Playwright 브라우저 작업을 포함하여 활성 백엔드 실행도 함께 취소됩니다.

## 진행 상황 및 결과

실행을 시작하면 Drawer에 다음이 표시됩니다:

- 노드가 시작되고 완료될 때의 스트리밍 단계 진행 상황
- 최종 상태: `success`, `error`, 또는 `pending`
- 간결한 JSON 패널의 최종 출력
- `Quick Drawer` 태그가 지정된 History 항목

`pending`은 Workflow가 사람의 리뷰와 같은 후속 작업을 기다리고 있음을 의미합니다.

## 브라우저 저장소

Quick Drawer는 개인 설정을 `localStorage`에 저장합니다:

- 고정된 Workflow ID
- 마지막으로 선택한 Workflow

이 버전에서 Drawer는 입력 값을 **저장하지 않습니다**.

## 범위

Quick Drawer는 의도적으로 가벼운 실행 화면입니다.

- 포함: 검색, 고정, 선택, 입력, 실행, 진행, 결과
- 제외: Workflow 생성, 편집, 폴더 관리, 캔버스 작업

## 관련 문서

- [Workflows 탭](../tabs/workflows-tab.md) – 기본 Workflow 목록, 폴더, 관리
- [Quick Start](../getting-started/quick-start.md) – 첫 Workflow 빌드 및 실행
- [Execution History](./execution-history.md) – 과거 실행 검토
- [Webhooks](./webhooks.md) – HTTP를 통한 Workflow 트리거
- [Contextual Showcase](./contextual-showcase.md) – Quick Drawer를 보완하는 페이지 수준 가이드 레일

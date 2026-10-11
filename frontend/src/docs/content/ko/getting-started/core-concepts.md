# 핵심 개념

## Workflow

Workflow는 **엣지**로 연결된 [**노드**](../reference/node-types.md)들의 방향성 그래프입니다. [Workflows](../tabs/workflows-tab.md) 탭에서 Workflow를 관리합니다. [폴더](../reference/workflow-organization.md)로 구성할 수 있습니다. 실행은 [Trigger 노드](../reference/triggers.md)([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md))에서 시작하여 처리 노드를 거쳐 [Output](../nodes/output-node.md) 노드로 흐릅니다. JSON 형식은 [Workflow 구조](../reference/workflow-structure.md)를 참조하십시오. Workflow를 [Template](../tabs/templates-tab.md)으로 저장하고 공유하여 여러 프로젝트에서 재사용할 수 있습니다. Workflow는 [Board](../tabs/board-tab.md)에서도 실행할 수 있으며, 여기서 칸반 카드가 카드의 전체 컨텍스트와 함께 컬럼의 Workflow 체인을 Trigger합니다.

## 노드

각 노드는 다음을 가집니다:

- **Type** – 동작을 결정합니다 (예: `llm`, `condition`, `http`)
- **Data** – 구성 (모델, Prompt, URL 등)
- **Inputs/Outputs** – 다른 노드와 연결하기 위한 핸들

전체 목록은 [노드 유형](../reference/node-types.md)을 참조하십시오.

## 엣지

엣지는 소스 노드의 출력 핸들을 대상 노드의 입력 핸들에 연결합니다. 실행 중에 데이터가 엣지를 따라 흐릅니다.

## 실행 흐름

1. **Trigger** – Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger 또는 [WebSocket Trigger](../nodes/websocket-trigger-node.md) 노드가 실행을 시작합니다 ([Trigger](../reference/triggers.md) 참조)
2. **Downstream** – 각 노드는 연결된 업스트림 노드로부터 출력을 받습니다. [병렬 실행](../reference/parallel-execution.md)은 독립적인 노드들을 동시에 실행합니다
3. **표현식** – 노드는 `$nodeLabel.field`를 통해 업스트림 데이터를 참조합니다. [Expression DSL](../reference/expression-dsl.md)을 참조하십시오.
4. **Output** – [Output](../nodes/output-node.md) 노드가 최종 결과를 생성합니다

## 표현식 참조

Input 노드의 데이터에는 `$input`을 사용하고, 모든 업스트림 노드에는 `$nodeLabel.field`를 사용합니다. 예: `$llm.text`는 "llm"이라는 레이블이 지정된 노드의 `text` 필드를 참조합니다. 전체 구문: [Expression DSL](../reference/expression-dsl.md). 표현식을 편집할 때 실시간 백엔드 미리보기가 있는 더 큰 편집기를 사용하려면 [표현식 평가 대화상자](../reference/expression-evaluation-dialog.md)를 사용하십시오.

## 관련 항목

- [빠른 시작](./quick-start.md) – 첫 번째 Workflow 만들기
- [캔버스 기능](../reference/canvas-features.md) – 데이터 핀, 실행 로그, 활성화/비활성화, 하위 Workflow로 추출
- [AI Assistant](../reference/ai-assistant.md) – 자연어로 Workflow 생성
- [노드 유형](../reference/node-types.md) – 사용 가능한 모든 노드
- [Expression DSL](../reference/expression-dsl.md) – 표현식에서 데이터 참조하기
- [표현식 평가 대화상자](../reference/expression-evaluation-dialog.md) – 실시간 백엔드 미리보기가 있는 확장 가능한 편집기
- [Workflows 탭](../tabs/workflows-tab.md) – Workflow 및 폴더 관리
- [Workflow 구성](../reference/workflow-organization.md) – 폴더 및 예약 삭제
- [Trigger](../reference/triggers.md) – Workflow의 진입점
- [Webhook](../reference/webhooks.md) – HTTP Webhook Trigger (TTL, 캐시, 속도 제한)
- [병렬 실행](../reference/parallel-execution.md) – 노드가 병렬로 실행되는 방식

# 빠른 시작

몇 분 안에 첫 번째 Heym Workflow를 실행해 보십시오.

아직 Heym을 실행하지 않으셨다면 [실행 및 배포](./running-and-deployment.md)를 참조하시거나, 다음 동영상 안내를 따라 하십시오: [2분 이내에 로컬에서 Heym 설정하기](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Workflow 생성

1. [Workflows](../tabs/workflows-tab.md) 탭으로 이동합니다
2. **New Workflow**를 클릭합니다
3. Workflow의 이름을 지정합니다 (예: "Hello World")

## 2. 노드 추가

1. 왼쪽의 **Nodes** 패널을 엽니다
2. [Input](../nodes/input-node.md) 노드를 캔버스로 드래그합니다
3. [LLM](../nodes/llm-node.md) 노드를 드래그하여 Input에 연결합니다
4. [Output](../nodes/output-node.md) 노드를 드래그하여 LLM에 연결합니다

```
[Input] --> [LLM] --> [Output]
```

사용 가능한 모든 노드는 [노드 유형](../reference/node-types.md)을 참조하십시오.

## 3. 구성

- **Input**: 기본값을 설정하거나 사용자 입력을 위해 비워 둡니다 ([Input 노드](../nodes/input-node.md) 참조)
- **LLM**: [credential](../tabs/credentials-tab.md)과 모델을 선택하고, 시스템 지시를 추가한 뒤 `userMessage`를 `$input.text`로 설정합니다 ([LLM 노드](../nodes/llm-node.md) 참조)
- **Output**: `message`를 `$llm.text`로 설정하여 LLM 응답을 전달합니다 ([Output 노드](../nodes/output-node.md) 참조)

`$input.text`와 `$llm.text`에는 [Expression DSL](../reference/expression-dsl.md) 구문을 사용하십시오. 표현식 필드의 확장 버튼을 클릭하면 실시간 백엔드 미리보기가 제공되는 [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md)가 열립니다.

## 4. 실행

**Run**을 클릭하거나, `Ctrl + Enter`를 누르거나, 디버그 패널을 사용하여 실행합니다. Workflow는 Input 노드에서 시작하여 연결된 노드를 거쳐 Output까지 실행됩니다. Workflow를 실행하는 다른 방법([webhook](../reference/webhooks.md), portal, cron 등)은 [Triggers](../reference/triggers.md)를 참조하십시오.

**History**(툴바)에서 과거 실행을 확인하고 **Bring to Canvas**를 사용하여 동일한 입력으로 다시 실행할 수 있습니다.

Docs, Evals 및 기타 비캔버스 내부 페이지에서는 [Quick Drawer](../reference/quick-drawer.md)를 사용하여 편집기로 돌아가지 않고도 고정된 Workflow를 선택하여 실행할 수 있습니다.

문서를 읽는 중에 빌드 전에 명확한 설명이 필요하다면, Docs 헤더에서 [Chat with Heym](../reference/chat-with-heym.md)을 열어 페이지 인식 질문을 할 수 있습니다.

또는 Debug 패널에서 [AI Assistant](../reference/ai-assistant.md)를 사용하여 자연어로 Workflow를 생성할 수 있습니다. 원하는 내용을 설명하면 AI가 노드와 엣지를 생성합니다.

이미 다른 도구에서 자동화를 구축하고 계십니까? [Migrate to Heym](./migrate-to-heym.md)은 n8n, Flowise, Dify, Langflow, sim.ai 또는 Activepieces Workflow를 가져올 수 있는 Heym Workflow로 변환합니다.

## 관련 항목

- [핵심 개념](./core-concepts.md) – Workflow, 노드 및 실행 흐름
- [Migrate to Heym](./migrate-to-heym.md) – AI를 사용하여 n8n, Flowise, Dify, Langflow, sim.ai 또는 Activepieces Workflow를 Heym으로 변환
- [실행 및 배포](./running-and-deployment.md) – `run.sh`로 로컬에서 시작하거나 `deploy.sh`로 배포
- [환경 변수](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 전체 구성 참조
- [설정](../reference/user-settings.md) – 이름, User Rules 및 비밀번호 구성
- [캔버스 기능](../reference/canvas-features.md) – Data pin, 실행 로그, 활성화/비활성화, 하위 Workflow로 추출
- [키보드 단축키](../reference/keyboard-shortcuts.md) – 캔버스 및 편집기 단축키
- [Expression DSL](../reference/expression-dsl.md) – 노드 구성에서 데이터 참조
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – 실시간 백엔드 미리보기가 있는 확장 가능한 편집기
- [Triggers](../reference/triggers.md) – 모든 Workflow 진입점 ([webhook](../reference/webhooks.md), portal, cron 등)
- [실행 기록](../reference/execution-history.md) – 과거 실행 확인 및 Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – 비캔버스 페이지에서 고정된 Workflow 실행
- [Chat with Heym](../reference/chat-with-heym.md) – Docs 헤더에서 상황에 맞는 질문하기
- [Workflows 탭](../tabs/workflows-tab.md) – Workflow 생성 및 관리
- [Credentials 탭](../tabs/credentials-tab.md) – LLM 노드용 API 키 추가
- [AI Assistant](../reference/ai-assistant.md) – 자연어로 Workflow 생성

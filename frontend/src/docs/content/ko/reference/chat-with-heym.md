# Heym과 채팅

Heym과 대화하기는 문서 헤더에서 사용할 수 있는 페이지 인식 어시스턴트입니다. 중앙 대화 상자에서 열리며, LLM credential과 모델을 선택할 수 있고, 현재 문서 페이지를 첫 번째 컨텍스트로 삼아 질문에 답변합니다.

## 대화 상자 열기

1. `/docs` 아래의 아무 페이지나 엽니다
2. 헤더에서 **Chat with Heym**을 클릭합니다
3. [credential](../tabs/credentials-tab.md)과 모델을 선택합니다
4. 페이지 또는 플랫폼에 대해 질문합니다

화면이 작을 때는 트리거가 아이콘만 표시되며, 화면이 클 때는 전체 레이블이 표시됩니다.

## 사용하는 컨텍스트

- 현재 열려 있는 docs 경로가 컨텍스트 가이던스로 요청에 주입됩니다
- 백엔드는 기존 dashboard chat endpoint와 문서 검색 도구를 그대로 사용합니다
- 동일한 chat 백엔드가 재사용되므로 계정 수준의 [User Rules](./user-settings.md)가 계속 적용됩니다
- dashboard chat과 마찬가지로 최종 답변 전에 실시간 준비 단계가 어시스턴트 버블에 스트리밍됩니다
- [Chat 탭](../tabs/chat-tab.md)과 동일하게 명확화 질문이 카드로 표시됩니다. Workflow 요청에 credential이 필요하면 카드에서 하나를 선택하거나 생성할 수 있습니다. 데이터 테이블이 필요하면 보유한 테이블 중 하나를 선택하거나 같은 방식으로 새로 만들 수 있습니다.

특정 문서에서 대화 상자를 열면 활성 docs 경로를 보여주는 작은 배지가 표시되어 어느 페이지가 우선되는지 확인할 수 있습니다.

## 세션 동작

- 대화 상자가 마운트되어 있는 동안 credential과 모델 선택이 유지됩니다
- 메시지 기록은 세션에만 유지되며 대화 상자를 닫으면 지워집니다
- 배경 클릭, `Escape`, 닫기 버튼 모두 세션을 초기화합니다
- **Stop**은 현재 스트리밍 응답을 중단합니다
- 대화 상자는 의도적으로 넓고 고정된 크기이며, 전체 화면 전환 기능은 제공하지 않습니다

## 사용 시기

- 노드 또는 reference 페이지를 읽는 중에 후속 질문을 할 때
- 문서를 벗어나지 않고 기능 차이를 명확히 할 때
- 에디터를 열기 전에 적합한 문서를 찾을 때

Workflow를 직접 구축하거나 수정하려면 에디터 측 [AI Assistant](./ai-assistant.md)를 대신 사용하십시오.

## 관련 항목

- [AI Assistant](./ai-assistant.md) – Workflow 구축을 위한 에디터 채팅
- [Credentials 탭](../tabs/credentials-tab.md) – 대화 상자에서 사용하는 LLM credential 추가
- [Settings](./user-settings.md) – AI 표면에 적용되는 전역 User Rules
- [Quick Start](../getting-started/quick-start.md) – 첫 Workflow 워크스루

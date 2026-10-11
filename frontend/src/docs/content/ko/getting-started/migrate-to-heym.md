# Heym으로 마이그레이션

다른 도구에서 이미 Workflow를 운영하고 계십니까? **AI Convert**가 이를 Heym Workflow로 변환해 드립니다. n8n, Flowise, Dify, Langflow, sim.ai 또는 Activepieces의 Workflow를 붙여넣거나, 원하는 내용을 설명하기만 하면 Heym이 이에 상응하는 Workflow를 라이브 캔버스 위에 생성하여 다운로드 및 가져오기가 가능하도록 합니다.

**[heym.run/convert](https://heym.run/convert)** 에서 열거나, 사이트 헤더의 **✨ AI Convert** 버튼을 사용하십시오.

## 작동 방식

1. **소스 도구 선택** (선택 사항) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces 중에서 선택하거나 *Auto*로 두십시오.
2. **Workflow 제공** — 현재 사용 중인 도구에서 내보낸 JSON을 붙여넣거나, 원하는 자동화에 대한 설명을 평문으로 작성하십시오.
3. **생성** — Heym이 결과를 캔버스에 스트리밍하며, 노드와 연결이 생성되는 대로 그려냅니다.
4. 생성된 Workflow를 JSON으로 **다운로드하거나 복사**하십시오.
5. **Heym으로 가져오기** — [Download & Import](../reference/download-import.md) 흐름을 사용하여 JSON을 캔버스에 붙여넣은 후 실행하십시오.

변환 시 캔버스에 해당 Workflow가 Heym에 의해 생성되었음을 표시하는 작은 *Sticky Note*가 추가됩니다. 원하실 때 언제든지 삭제하십시오.

## 제공되는 결과

변환기는 소스 개념을 Heym의 네이티브 노드로 매핑합니다 — Trigger, [LLM](../nodes/llm-node.md) 단계, [HTTP](../nodes/http-node.md) 호출, [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md) 액션, [Loop](../nodes/loop-node.md), [Condition](../nodes/condition-node.md), 그리고 [Output](../nodes/output-node.md) 등입니다. 캔버스에서 결과를 검토하고, [Credentials](../reference/credentials.md)를 연결한 후, 소스 도구에서 다르게 표현된 부분을 조정하십시오.

> AI Convert는 시작점일 뿐, 1:1 이식이 보장되지는 않습니다. 프로덕션에서 실행하기 전에 항상 생성된 Workflow를 검토하십시오.

## 참고 사항

- **AI 기반:** 변환은 대규모 언어 모델에 의해 생성되므로 실행마다 결과가 달라질 수 있습니다. 첫 결과가 만족스럽지 않으면 다시 생성하십시오.
- **입력 크기:** 붙여넣거나 입력하는 내용은 약 **25,000 tokens**로 제한됩니다. 매우 큰 내보내기 파일은 변환 전에 축소하십시오.
- **Rate limits:** 모든 사용자가 도구를 이용할 수 있도록, 방문자당 요청은 **분당 1회, 시간당 5회, 일당 10회**로 제한됩니다.
- **안전성:** 요청은 검사되며, Workflow 구축 요청만 처리됩니다.

## 다음 단계

- 캔버스가 처음이십니까? [Quick Start](./quick-start.md)부터 시작하십시오.
- 가져오기 방식은 [Download & Import](../reference/download-import.md)에서 알아보십시오.
- Heym을 셀프 호스팅하십니까? 전체 구성 참조는 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)를 확인하십시오.
- 앱 내 [AI Assistant](../reference/ai-assistant.md)를 사용하여 처음부터 구축하십시오.

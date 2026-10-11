# Evals 탭

**Evals** 탭은 `/evals`에 위치한 별도의 페이지입니다. 이를 통해 평가 스위트를 생성하고, 테스트 케이스를 정의하며, [Agent](../nodes/agent-node.md) Workflow에 대한 평가를 실행할 수 있습니다.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Evals 데모 시청</a></p>

## 접근

- 대시보드 탭 바에서 **Evals**를 클릭합니다
- 또는 `/evals`로 이동합니다
- 또는 **Ctrl+K** (Cmd+K)를 사용하여 명령 팔레트에서 "Evals"를 선택합니다

## Eval 스위트

- **스위트 생성** – 이름과 설명이 포함된 스위트를 정의합니다
- **Workflow 선택** – 평가할 Workflow를 선택합니다
- **Credential 선택** – Workflow 실행을 위한 API key입니다
- **System Prompt** – 왼쪽 패널에서 스위트 수준의 system prompt를 직접 편집합니다
- **Prompt 최적화** – LLM에게 현재 system prompt 개선을 요청합니다

## 테스트 케이스

- 입력 prompt와 예상 출력이 포함된 테스트 케이스를 추가합니다
- 각 케이스는 비교를 위한 사용자 정의 예상 값을 가질 수 있습니다
- 스위트에서 케이스를 편집하거나 삭제합니다
- **테스트 데이터 생성** – 선택한 credential/model을 사용하여 스위트 prompt로부터 테스트 케이스를 자동 생성합니다

## 평가 실행

- **하나 이상의 모델 선택** – 하나의 평가에서 여러 모델에 대해 동일한 스위트를 실행합니다
- **채점 방식** – `Exact Match`, `Contains`, 또는 `LLM-as-Judge`를 선택합니다
- **Judge** – `LLM-as-Judge`의 경우, 선택적으로 OpenAI, OpenAI 호환 (Custom), Gemini (Google) 또는 [Decision Model](../nodes/decision-node.md) credential을 선택하고 judge의 모델(예: `gpt-4o-mini` 또는 `jev-latest`)을 입력하여 독립적인 judge로 채점합니다
- **테스트당 실행 횟수** – 하나의 실행에서 각 테스트 케이스를 여러 번 반복합니다
- **Temperature** – 모델 temperature를 설정합니다 (`Exact Match` 및 `Contains`)
- **Reasoning effort** – reasoning 모델의 reasoning effort를 설정합니다 (`Exact Match` 및 `Contains`)

### LLM-as-Judge

Judge를 사용하면, 각 모델은 스위트 prompt만으로 테스트 입력에 답변하고, judge는 답변이 예상 출력과 얼마나 일치하는지를 0에서 100까지 평가합니다:

- **모델 judge** (OpenAI, OpenAI 호환 또는 Gemini)는 질문, 예상 출력, 답변을 읽고 한 줄의 이유와 함께 점수를 반환합니다. Temperature `0`으로 실행되며, reasoning 모델의 경우 `low` reasoning effort로 실행되므로 동일한 답변은 동일한 판정을 받습니다.
- **Decision model judge**는 *Completely off*부터 *Fully matches*까지 5단계 루브릭으로 답변을 평가합니다. 점수는 해당 루브릭에서 확률 가중치가 적용된 위치이므로, 모델이 작성한 숫자가 아니라 모델이 계산한 분포에서 나옵니다.

셀의 hover card는 judge의 이유를 표시하며, decision model의 경우 레벨, 점수 및 신뢰도를 표시합니다. Latency와 tokens는 테스트 대상 모델을 나타내며, judge 자체의 호출은 **Evals** 소스 아래 [Traces](./traces-tab.md)에 나타납니다. 모델 선택기는 Model Router credential을 제외합니다. Eval은 특정 모델을 비교하기 때문입니다.

Judge가 없으면 각 모델은 단일 요청에서 자체 답변을 생성하고 채점합니다.

이 모드에서는 Temperature와 reasoning effort가 숨겨지며, 실행은 고정 설정을 사용합니다: 표준 모델의 경우 temperature `0.7`, reasoning 모델의 경우 `medium` reasoning effort (자체 답변을 채점할 때는 `low`)입니다.

## 결과

- 테스트 케이스별 통과/실패를 확인합니다
- 실제 출력과 예상 출력을 검사합니다
- 실행에 여러 모델이 포함된 경우 모델별 출력을 나란히 비교합니다
- 과거 평가의 실행 기록을 검토합니다. `LLM-as-Judge` 실행은 기록 목록에 judge 모델을 표시합니다
- 결과 패널에서 과거 실행을 열고 저장된 prompt/입력/출력 스냅샷을 검사합니다
- 과거 실행을 열면 해당 채점 방식과 judge가 왼쪽 패널에 로드되므로, **Re-Run Evals**는 동일한 평가를 반복합니다
- **Export**는 `judge_credential_id`와 `judge_model`을 포함하여 실행을 JSON으로 다운로드합니다

## 벤치마크 매트릭스 아이디어

Agent Workflow를 위한 벤치마크 매트릭스를 구축할 때는, HITL 시나리오를 엣지 케이스로 취급하는 대신 일급 케이스로 포함하십시오.

- 세 가지 리뷰 결정을 모두 포함합니다: `accepted`, `edited`, `refused`
- editor 실행, portal, curl/webhook, cron-triggered 실행 등 여러 Trigger 소스를 포함합니다
- 하나의 agent 실행이 두 번 이상 일시 중지되는 반복 리뷰 시나리오를 추가합니다
- agent의 `review` 출력에 연결된 알림 분기를 검증합니다
- 거부 이후의 다운스트림 동작을 검증합니다. 특히 이후 노드가 `$agent.decision`을 기준으로 분기하는 경우 중요합니다

## 관련 항목

- [Why Heym](../getting-started/why-heym.md) – Agent 라이프사이클의 테스트 단계로서의 Evals
- [Agent Node](../nodes/agent-node.md) – 평가 대상 Workflow
- [Credentials 탭](./credentials-tab.md) – Eval 실행을 위한 Credential
- [Traces 탭](./traces-tab.md) – 상세 trace 검사
- [Workflows 탭](./workflows-tab.md) – 평가할 Workflow 생성
- [실행 기록](../reference/execution-history.md) – 과거 실행 확인 (헤더의 History 버튼)
- [Contextual Showcase](../reference/contextual-showcase.md) – evals 페이지에서 사용 가능한 간략한 페이지 가이드

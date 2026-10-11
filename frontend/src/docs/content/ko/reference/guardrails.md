# Guardrails

Guardrails를 사용하면 안전하지 않거나 원치 않는 사용자 메시지가 [LLM](../nodes/llm-node.md) 또는 [Agent](../nodes/agent-node.md) 노드에 도달하기 전에 차단할 수 있습니다. 메시지가 차단된 카테고리와 일치하면 노드는 실행되는 대신 오류를 발생시키며, 이는 [Error Handler](../nodes/error-handler-node.md) 노드로 포착할 수 있습니다.

## Guardrails 활성화

**LLM** 또는 **AI Agent** 노드의 Properties 패널을 열고 **Enable Guardrails** 토글(방패 아이콘)로 스크롤하십시오. 체크박스를 선택하면 구성 섹션이 표시됩니다.

## Guardrail Credential 및 Model

Guardrails가 활성화되면 콘텐츠 안전을 위한 **credential과 model**을 **반드시** 선택해야 합니다. Guardrail 검사는 노드에서 선택한 credential과 model을 사용하며, 대체(fallback)나 환경 변수는 사용되지 않습니다. 안정적인 콘텐츠 필터링을 위해 OpenAI 또는 Google credential을 사용하십시오. 특히 기본 모델이 guardrails를 지원하지 않거나 API 오류(예: 404)를 반환할 수 있는 사용자 지정 provider(예: Zhipu, GLM)를 사용하는 경우에 그러합니다.

Guardrail Credential과 Guardrail Model이 모두 선택되기 전까지는 Workflow를 실행할 수 없습니다.

## 차단 카테고리

차단할 카테고리를 하나 이상 선택하십시오. 선택된 카테고리 중 하나라도 일치하는 메시지는 거부됩니다.

| 카테고리 | 차단 대상 |
|---|---|
| **Violence** | 폭력적, 위협적 또는 신체적 위해를 가하는 콘텐츠 |
| **Hate Speech** | 차별, 인종주의 또는 편협한 내용 |
| **Sexual Content** | 노골적인 성적 콘텐츠 또는 시나리오 |
| **NSFW / Profanity** | 모든 언어의 저속한 표현, 욕설, 노골적인 비하 발언 및 성인 은어 |
| **Self-Harm** | 자살, 자해 또는 관련 콘텐츠 |
| **Harassment** | 인신공격, 모욕, 괴롭힘 또는 협박 |
| **Illegal Activity** | 불법 행위를 저지르기 위한 지침 |
| **Political Extremism** | 극단주의적 정치 콘텐츠 또는 폭력적 선전 |
| **Spam / Phishing** | 스팸, 피싱 또는 사회공학적 공격 |
| **Personal Data Request** | 사적 정보 또는 개인 식별 정보의 요구 |
| **Prompt Injection** | 시스템 지침을 무력화하려는 시도, 악성 Prompt 주입 또는 모델 동작 조작 시도 |

## 민감도

**Sensitivity** 설정은 위반 사항이 얼마나 엄격하게 감지되는지를 제어합니다.

| 수준 | 동작 |
|---|---|
| **Low** | 경계선상의 모호한 사례까지도 표시합니다 |
| **Medium** *(기본값)* | 명백한 위반을 표시하고 경계선상의 사례는 무시합니다 |
| **High** | 극단적이고 명백한 위반만 표시합니다 |

## 감지 방식

감지는 **선택된 guardrail credential과 model**을 사용합니다.

- **OpenAI credentials** — 기본적으로 지원하는 다섯 가지 카테고리(Violence, Hate Speech, Sexual Content, Self-Harm, Harassment)에 대해 [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)(무료, 빠름, token 사용 없음)를 사용합니다. 나머지 카테고리는 선택된 guardrail model을 사용한 LLM 분류 호출로 검사합니다.
- **Google / 사용자 지정 credentials** — 모든 카테고리가 선택된 guardrail credential과 model을 사용한 LLM 분류 호출로 검사됩니다.

기본 모델이 404 또는 기타 API 오류를 반환할 수 있는 사용자 지정 provider(예: Zhipu, Cerebras)를 사용하는 경우, guardrails용으로 **OpenAI 또는 Google credential**을 선택하십시오.

## 오류 형식

Guardrail이 트리거되면 노드는 다음 메시지와 함께 오류를 발생시킵니다.

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

노드 결과의 `output`에는 `guardrail_violated_categories`(위반된 카테고리 레이블의 배열)도 포함되므로 Debug Panel과 Execution History에서 "Blocked by: X, Y"를 명확하게 표시할 수 있습니다.

Guardrails가 발동되었을 때 Workflow를 대체 분기로 라우팅하려면 노드의 **Continue on error** 옵션(또는 [Error Handler](../nodes/error-handler-node.md))을 사용하십시오.

## 예제 Workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## 참고 사항

- **재시도 없음**: Guardrail 위반은 의도적인 차단이며, 노드에 "Retry on failure"가 활성화되어 있더라도 절대 재시도되지 않습니다.
- 데이터베이스 마이그레이션은 필요하지 않습니다. Guardrail 설정은 다른 노드 데이터와 함께 Workflow의 노드 JSON에 저장됩니다.
- Guardrails는 원시 템플릿이 아닌 해석된 **사용자 메시지**(템플릿 표현식이 평가된 후)를 검사합니다.
- Guardrails가 활성화된 상태에서 **카테고리를 선택하지 않으면** 비활성화한 것과 동일하며, 검사가 수행되지 않습니다.
- **Low** 민감도에서는 LLM 분류가 항상 실행됩니다(최상의 다국어 지원). OpenAI credentials는 추가로 Moderation API를 실행합니다.
- **Medium/High** 민감도에서 OpenAI credentials는 기본 지원 카테고리에 Moderation API를 사용하고 나머지는 LLM 분류를 사용합니다. Google/사용자 지정 credentials는 항상 LLM 분류를 사용합니다.
- LLM 분류는 **언어에 구애받지 않으며**, 터키어, 아랍어, 러시아어, 스페인어 및 기타 언어의 위반 사항을 감지합니다.

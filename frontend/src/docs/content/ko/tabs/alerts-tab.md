# Alerts 탭

**Alerts** 탭에서는 시간 범위(time window)에 대한 임계값 조건을 정의하고, 해당 조건이 충족될 때 알림을 받을 수 있습니다. Heym은 이미 실행 결과, 실행 시간, LLM 비용을 기록하고 있지만, 이를 먼저 알려주지는 않습니다. 알림은 이를 요청하는 방법입니다.

모든 알림은 선택한 **시간 범위**에 걸쳐 평가되며, 단일 이벤트에 대해서는 평가되지 않습니다. 한 번의 실패한 실행은 노이즈에 불과합니다. 10분 동안 12번의 실패한 실행은 인시던트입니다.

## 알림 유형

| 유형 | 답하는 질문 | 수치의 출처 |
|---|---|---|
| **Error threshold** | 시간 범위 내에서 N번 이상 실패했습니까? | 오류 상태의 [Execution history](../reference/execution-history.md) 행 |
| **Workflow duration** | 시간 범위 내에서 실행이 예상보다 느려졌습니까? | 실행 시간을 max, average, 또는 95th percentile로 집계 |
| **Token / USD cost** | 시간 범위 내에서 지출이 예산을 초과했습니까? | [LLM traces](./traces-tab.md) 및 LLM cost 테이블 |
| **Execution count** | 예상보다 훨씬 자주 실행되었습니까? | Execution history 행 수 |

### Error threshold

시간 범위 내의 실패한 실행을 집계하여 임계값에 도달하면 발동합니다. 각 실패를 후킹하는 대신 시간 범위에 걸쳐 집계하므로, 일시적인 단일 오류로는 알림이 발송되지 않습니다.

### Workflow duration

시간 범위 내의 실행 시간을 측정합니다. **max**(가장 느린 실행), **average**, 또는 **p95** 중에서 선택하십시오. p95 수치는 [Analytics tab](./analytics-tab.md)과 동일한 백분위수 계산을 사용하므로, 알림과 지연 시간 차트가 동일한 시간 범위에 대해 불일치하는 일이 없습니다.

**Minimum runs in the window**는 이를 정확하게 유지합니다. 거의 비어 있는 시간 범위에서 가장 느린 실행은 그저 그 한 번의 실행일 뿐이므로, 최소값을 예를 들어 3으로 설정하면 노이즈로 인한 알림 발동을 막을 수 있습니다.

### Token / USD cost

시간 범위 내의 LLM 지출을 총 토큰 또는 미국 달러로 합산합니다. 달러 금액은 [Traces tab](./traces-tab.md)과 [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)이 사용하는 것과 동일한 가격 테이블을 통해 산출되므로, 비용 알림과 비용 페이지가 항상 일치합니다.

범위가 모든 Workflow인 경우, [Chat tab](./chat-tab.md) 및 [AI Assistant](../reference/ai-assistant.md)와 같이 Workflow 외부에서 이루어진 LLM 호출도 포함됩니다. 코딩 에이전트 사용(Codex, OpenCode)은 포함되지 않습니다.

가격 행이 없는 모델은 조용히 0으로 집계되는 대신, 알림의 컨텍스트에 unpriced로 보고됩니다.

### Execution count

시간 범위 내의 모든 상태의 실행을 집계합니다. 이는 잘못된 Trigger를 잡아내는 유형입니다. 평소 시간당 20번 실행되던 Workflow가 갑자기 2,000번 실행되는 경우입니다. 발동 기록에는 Trigger 소스별 분석이 포함되는데, 이는 보통 "왜 이런 일이 발생했는가"에 대한 답이기 때문입니다.

## Scope

알림은 **하나의 Workflow** 또는 **모든 Workflow**를 감시합니다.

"모든 Workflow"는 알림 소유자가 접근할 수 있는 모든 Workflow를 의미합니다. 이는 의도적으로 Heym 인스턴스의 모든 Workflow를 의미하지 않습니다. 알림은 공유될 수 있으며, 알림을 공유한다고 해서 열 수 없는 Workflow의 집계 수치를 누군가에게 제공해서는 안 되기 때문입니다.

## 마법사

알림 생성은 다섯 단계를 거칩니다.

1. **Type** — 위의 네 가지 중 하나를 선택합니다.
2. **Scope** — 하나의 Workflow 또는 전체.
3. **Condition** — 시간 범위와 해당 유형의 임계값 필드입니다.
4. **Response** — 발동 시 실행되는 항목과 알림을 계속 받을 빈도입니다.
5. **Review** — 이름을 지정하고 백테스트를 확인합니다.

### 백테스트

Review 단계는 저장하기 전에 실제로 중요한 질문에 답합니다. *지난 24시간 동안 이 알림이 몇 번 발동했을까?*

발동 횟수와 임계값 대비 관측된 최고값을 보고합니다. 조건이 400번 발동했을 것이라고 표시되면, 알림을 받은 후가 아니라 저장하기 전에 임계값을 수정할 수 있습니다. 조회 기간을 3일 또는 7일로 늘릴 수 있습니다.

## AI 초안 작성

첫 번째 단계 상단에는 원하는 내용을 자연어로 설명하는 상자가 있습니다.

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym은 이를 알림 정의로 변환하고, 채울 수 있는 모든 단계를 채우며, AI가 채운 필드를 표시한 상태로 앞으로 이동하므로 다시 입력하는 대신 확인만 하면 됩니다. 완전한 요청은 Review 단계로 바로 이동합니다.

**부분적인 요청도 앞으로 나아가게 합니다.** "warn me if it fails 5 times"라고만 입력하면, 횟수가 채워진 error threshold 알림과 나머지에 대한 기본값이 생성되며, 마법사는 여전히 사용자가 필요한 첫 번째 단계에서 열립니다. 이 경우 Workflow가 지정되지 않았으므로 Scope입니다. 상단의 안내가 결정해야 할 남은 사항을 알려줍니다. Next 또는 Create를 차단하지는 않습니다.

모델이 접근할 수 없는 Workflow를 지정하거나 필드가 누락된 조건을 반환하는 경우에도 마찬가지입니다. 합리적인 부분은 유지되고, 나머지는 해당 알림 유형의 기본값으로 대체되며, 거기서부터 조정하면 됩니다. 여기서 검증을 우회하는 것은 없습니다. 마법사 자체의 규칙과 API 모두 저장 시 알림을 다시 확인합니다.

## 반복 동작

Alert가 한 번 발화하면 Trigger된 상태에 들어갑니다. 그다음에 무슨 일이 일어날지는 4단계에서 선택하시면 됩니다.

- **복구될 때까지 한 번만 알림** (기본값) — 한 번 발화한 후 조건이 유지되는 동안 조용히 있습니다. 메트릭이 임계값 아래로 다시 떨어지면 Alert는 OK로 돌아가고 다시 발화할 수 있게 됩니다. 복구는 이벤트가 아니라 상태 변화입니다. 즉, 발화 기록을 생성하지 않고 notify Workflow를 실행하지도 않습니다.
- **일정 간격으로 계속 알림** — 조건이 유지되는 한 N분마다 다시 발화합니다.

기본값이 존재하는 이유는 60초마다 확인하는 고장 난 Workflow가 시간당 60번의 발화를 생성하게 되어, 결국 Alert가 음소거되는 결과로 이어지기 때문입니다.

## 발화 시 Workflow 실행

4단계에서는 "이것이 발화할 때 무슨 일이 일어나야 하는가"에 대한 세 가지 답을 제공합니다.

- **새 Workflow 생성 및 할당** (기본값) — Alert를 저장하면 *"&lt;alert name&gt; notification"* 이라는 Workflow도 생성되어 연결됩니다. 이 Workflow는 아래 Payload와 정확히 동일한 필드를 가진 input 노드와 함께 제공되므로, `$alert.body.observed_value` 및 나머지 값이 즉시 해석되며 메시지를 전달하는 노드만 연결하시면 됩니다. Alert 카드의 **Go to workflow**를 누르면 해당 Workflow가 열립니다. 아무것도 없는 곳으로 발화하는 Alert는 놓치기 쉬우므로 이것이 기본값입니다.
- **기존 Workflow 선택** — 이미 만들어 둔 것을 실행합니다.
- **아무것도 하지 않음** — 발화는 여전히 탭에 기록되지만, 아무것도 실행하지 않을 뿐입니다.

Alert Payload는 해당 Workflow의 input body로 전달됩니다.

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### 어떤 Workflow가 이 수치를 만들어냈는가

`workflows`는 Workflow가 나타나는 유일한 위치입니다. 이 필드는 해당 측정에 기여한 모든 Workflow를 나열하며, 각 항목은 자체 `value`를 가집니다. 이 값은 Alert 유형에 따라 해당 Workflow의 오류 수, 실행 수, 가장 느린 실행 시간(밀리초), 또는 지출액입니다. 목록은 `value` 기준 내림차순으로 정렬되므로, `workflows[0]`이 가장 문제가 심한 대상입니다.

이 필드는 **항상 배열**입니다. 단일 Workflow 범위에서는 요소가 하나이고, "all my workflows"에서는 여러 개이며, 귀속할 대상이 없을 때는 null이 아니라 빈 배열입니다. notify Workflow는 형태 검사 없이 이를 순회할 수 있습니다.

단수형 `workflow_id`는 의도적으로 존재하지 않습니다. 이 필드는 메트릭이 아니라 Alert의 범위를 설명했기 때문에 system 범위에서는 `null`이었고, 이는 "어떤 Workflow인가?"가 가장 중요한 바로 그 경우입니다. `observed_value`는 임계값과 비교된 집계값으로 남아 있으며, Workflow별 `value` 필드가 그것이 어디에서 왔는지 설명합니다.

이것이 Alert가 Slack, 이메일, Telegram 또는 그 밖의 어디로든 도달하는 방식입니다. 별도의 알림 시스템이 아니라, 이미 가지고 있는 [노드](../reference/node-types.md)를 사용합니다.

Alert는 자신이 감시하는 Workflow에 알림을 보낼 수 없습니다. 이는 루프가 되며, 각 알림이 측정 대상인 카운트에 더해지는 실행 횟수 Alert에서 가장 명백합니다.

Notify 실행은 일반적인 실행이므로, 다른 실행과 마찬가지로 [실행 기록](../reference/execution-history.md)에 나타납니다. 실패한 notify Workflow는 발화에 기록되지만, 발화 자체가 기록되는 것을 막지는 않습니다.

Notify Workflow는 Alert 소유자로서 그들의 자격 증명과 전역 변수로 실행되며, 마치 그들이 직접 실행한 것과 정확히 같습니다. 다른 사람이 공유한 Workflow를 선택해도 그 사람의 자격 증명을 빌리지는 않습니다. 소유자가 notify Workflow에 대한 접근 권한을 잃으면 발화는 여전히 기록되지만 notify 실행은 건너뜁니다.

## 발화 기록

Alert 목록 아래에는 발화 기록이 있습니다. 무엇이 발화했는지, 언제 발화했는지, 임계값 대비 관측값, 평가된 정확한 기간, 그리고 notify 결과를 보여줍니다.

발화를 확인 처리하면 해당 행이 표시되고 Alert의 배지가 **Firing**에서 **Acknowledged**로 바뀝니다. 이는 Alert가 아니라 사용자에 대한 진술입니다. 조건은 여전히 유지되며, 메트릭이 임계값 아래로 다시 떨어지면 Alert는 스스로 **OK**로 돌아갑니다.

각 기록은 발화한 순간의 기여 세부 정보를 저장합니다. 실패한 실행 id와 오류 메시지, 모델별 지출, 또는 Trigger 소스 분석 등입니다. 이는 의도된 동작입니다. 기간이 지나갔고, 나중에 다시 계산하면 다른 답이 나올 수 있기 때문입니다.

발화 기록은 90일 동안 보관됩니다.

## Chat에 Alert 질문하기

[Chat 탭](./chat-tab.md)은 Alert에 관한 질문에 답할 수 있습니다.

- "내 Alert에는 어떤 것들이 있나요?"
- "invoice Workflow에 Alert가 있나요?"
- "cost Alert는 왜 발화했나요?"
- "이것이 마지막으로 Trigger된 게 언제인가요?"

"왜 발화했나요"라는 질문에 대해 Chat은 발화 기록에서 실제 관측값, 임계값, 시간 기간을 기여 세부 정보와 함께 인용합니다.

## 공유

Alert는 개별 사용자 또는 [팀](./teams-tab.md)과 공유할 수 있습니다. 공유받은 사람은 Alert와 그 발화 기록을 볼 수 있습니다. 편집, 일시 중지, 삭제 또는 재공유는 소유자만 할 수 있습니다.

### Workflow 접근 권한이 제거된 경우

단일 Workflow에 대한 알림은 해당 Workflow의 실행 지표를 계속 읽으므로, 누군가의 Workflow 접근 권한을 제거하면 해당 Workflow에 대한 그들의 알림 처리 방식도 함께 결정됩니다:

- **사용자 또는 팀 공유 제거** 시 Workflow 소유자에게 해당 사용자 또는 팀의 Workflow 알림도 중지할지 묻습니다. 중지가 기본값입니다. 중지된 알림은 삭제되지 않고 일시 중지되며, 각각은 [감사 로그](../reference/audit.md)에 `alert.disable_on_access_revoke`로 기록됩니다.
- **팀 구성원 제거 또는 팀 삭제** 시에는 영향을 받는 알림이 항상 중지됩니다. 해당 변경을 수행하는 사람이 반드시 Workflow 소유자라고 볼 수 없기 때문입니다.
- 알림은 해당 소유자가 직접 공유나 다른 팀 등 Workflow에 접근할 다른 경로가 없을 때만 중지됩니다.
- 일시 중지된 알림을 재개하거나 테스트하면 소유자의 접근 권한을 다시 확인하므로, 중지된 알림은 접근 권한 없이 다시 켜거나 Workflow의 지표를 읽는 데 사용할 수 없습니다. 접근 권한 없이 **Resume**을 누르면 Workflow 소유자가 먼저 다시 공유해야 한다는 설명이 담긴 알림이 표시됩니다.

## 알림 관리

- **Pause / Resume** — 일시 중지된 알림은 절대 평가되지 않습니다. 재개하면 다음 주기를 기다리지 않고 즉시 확인합니다.
- **Edit** — 변경 사항은 전체 단위로 검증되므로, 부분 편집으로 인해 알림이 유효하지 않은 상태로 남을 수 없습니다.
- **Delete** — 알림과 해당 발동 이력을 제거합니다.

## 함께 보기

- [Analytics 탭](./analytics-tab.md) — 이 임계값들이 도출되는 차트
- [Traces 탭](./traces-tab.md) — LLM 비용 수치의 출처
- [Execution History](../reference/execution-history.md) — 오류, 기간, 횟수 알림이 측정하는 실행
- [Chat 탭](./chat-tab.md) — 자연어로 알림 쿼리하기
- [Teams](./teams-tab.md) — 팀과 알림 공유하기

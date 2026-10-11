# Workflow 분석

**Workflow Analysis**는 워크플로우당 하나의 공유·편집 가능한 Markdown 문서를 보관하는 좌측 패널입니다. 이를 사용하여 워크플로우가 수행하는 작업을 설명하고 개선 아이디어를 기록할 수 있으며, AI가 초안을 생성하도록 할 수도 있습니다.

이 문서는 공유됩니다. 워크플로우에 접근할 수 있는 모든 사람이 읽고 편집할 수 있습니다. 문서는 워크플로우와 함께 저장되며, 워크플로우가 삭제되면 자동으로 삭제됩니다.

## 패널 열기

1. 에디터에서 워크플로우를 엽니다.
2. 에디터 툴바에서 **Analyze**(Sparkles 아이콘)를 클릭합니다.
3. 패널이 좌측에 열립니다. 패널이 열려 있는 동안 노드 팔레트(좌측 패널)는 접히며, 노드 팔레트를 다시 열면 분석 패널이 닫힙니다.

이 패널은 저장된 워크플로우에서만 사용할 수 있습니다. 아직 저장되지 않은 새 워크플로우에서는 먼저 저장하십시오.

## 문서

패널에는 **Edit**(연필) 및 **Preview**(눈) 버튼으로 전환되는 두 가지 보기가 있는 단일 Markdown 문서가 표시됩니다.

| 보기 | 용도 |
|------|---------|
| **Edit** | 일반 Markdown 에디터(textarea)입니다. |
| **Preview** | 렌더링된 Markdown입니다. |

헤더에는 **마지막으로 편집한 사람**과 시각이 표시됩니다.

### 저장

**Save**를 클릭하여 변경 사항을 저장합니다. Save는 저장되지 않은 편집 내용이 있을 때만 활성화됩니다.

문서가 공유되므로 저장은 낙관적 동시성(optimistic concurrency)을 사용합니다.

- 패널을 연 이후 다른 사람이 더 새로운 버전을 저장했다면, 저장이 거부되고 다른 편집자의 이름이 표시된 경고가 나타납니다.
- 이때 **Reload (discard mine)**을 선택하여 서버 버전을 가져오거나, **Overwrite**를 선택하여 자신의 버전으로 강제 저장할 수 있습니다.

## AI Analysis

패널 상단에서 LLM **Credential**과 **Model**을 선택합니다(모델 목록은 선택한 credential에서 로드됩니다 — [Credentials](../tabs/credentials-tab.md) 참조). 그런 다음 분석을 실행합니다.

- **Analyze my workflow** — 문서가 비어 있을 때 표시됩니다. AI가 생성한 Markdown 보고서를 저장되지 않은 초안으로 에디터에 직접 스트리밍합니다. 검토하고 편집한 뒤 **Save**하십시오.
- **Reanalyze** — 문서에 이미 내용이 있을 때 표시됩니다. 새로운 보고서를 별도의 **preview**로 스트리밍하며, 현재 문서는 그대로 유지됩니다. **Accept**를 선택하면 에디터 내용을 새 분석으로 교체하고, **Discard**를 선택하면 기존 내용을 유지합니다.

두 작업 모두 먼저 **워크플로우를 실행**하고(유효하고 실행 가능한 경우) 실행 결과를 분석 Prompt에 포함하므로, 보고서는 워크플로우가 실제로 어떻게 동작하는지를 반영합니다. 워크플로우를 실행할 수 없는 경우에는 정적 구조를 기반으로 분석을 진행합니다.

생성된 보고서는 순서대로 세 개의 섹션을 다룹니다. **Improvement areas**(구체적인 제안, 워크플로우가 credential, 사용자 입력, 외부 요청 또는 데이터 노출을 다루는 경우 항상 **security** 관점 포함), 워크플로우의 **Purpose**, 그리고 **What it does**(노드를 단계별로 살펴보는 설명)입니다.

**Improvement areas** 섹션은 항상 네 가지 명시적 점검을 수행합니다.

1. **Error coverage** — 캔버스에 [Error Handler](../nodes/error-handler-node.md) 노드가 없고 error workflow도 구성되지 않은 경우, 보고서는 이를 지적하고 오류 처리를 추가할 것을 권장합니다.
2. **Time saved** — 실행당 절감 시간 추정치가 설정되지 않은 경우, 보고서는 [Analytics](../tabs/analytics-tab.md)의 **Time Saved** 지표가 채워질 수 있도록 이를 구성할 것을 권장합니다.
3. **Network nodes** — 네트워크 호출을 수행하는 노드(예: [HTTP](../nodes/http-node.md) 및 통합 노드)에 대해, 보고서는 해당 노드에 노드별 오류 처리(재시도 및/또는 continue-on-error)를 권장합니다.
4. **Alerts** — 워크플로우에 구성된 [alerts](../tabs/alerts-tab.md)가 없는 경우, 보고서는 프로덕션 배포 전에 알림을 설정할 것을 권장합니다.

### Properties에서 Run Analyzer 실행

워크플로우에 캔버스 상의 노드는 있지만 분석 문서가 아직 없는 경우, 워크플로우 수준 [Properties](./canvas-features.md) 패널(노드가 선택되지 않았을 때 표시됨)에 **Run Analyzer** 버튼이 나타납니다. 이 버튼은 Workflow Analysis 패널을 열어 credential과 모델을 선택하고 보고서를 생성할 수 있게 합니다.

각 분석 실행은 [Traces](../tabs/traces-tab.md)에 **Workflow Analysis** 소스로 기록됩니다.

LLM credential이 구성되지 않은 경우 Analyze 버튼이 비활성화됩니다 — [Credentials Tab](../tabs/credentials-tab.md)에서 추가하십시오.

## Related

- [AI Assistant](./ai-assistant.md) — 자연어로 워크플로우 노드를 생성하거나 수정합니다.
- [Sticky Note](../nodes/sticky-note-node.md) — 캔버스에 직접 고정하는 짧은 메모용입니다.

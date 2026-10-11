# Traces 탭

**Traces** 탭은 LLM 실행 trace를 표시합니다. 요청/응답 Payload, 타이밍, 도구 호출을 검사하고 [Agent](../nodes/agent-node.md) 및 [LLM](../reference/node-types.md) 노드 동작을 디버깅할 수 있으며, 임의의 시간 범위에 걸친 집계 지표(호출, Token, 비용, 지연 시간, 오류율)도 확인할 수 있습니다.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Traces 데모 시청</a></p>

## 통계 헤더

페이지 상단에는 trace 목록 위에 통계 요약이 표시되며, 선택한 시간 범위와 기타 활성 필터를 기준으로 계산됩니다:

- **KPI 카드** – 총 호출 수, 총 Token, 총 비용(USD), 평균 지연 시간, 오류 %
- **모델별 Token** – 모델별 Token 볼륨을 나타내는 도넛 차트
- **모델별 비용** – 모델별 USD 지출을 나타내는 도넛 차트. 가격이 설정되지 않은 모델은 [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table)로 연결되는 "Configure pricing" 링크를 표시합니다
- **시간별 호출** – 버킷별 성공 대 실패 호출을 나타내는 누적 영역 차트(5분 / 1시간 / 6시간 / 1일, 범위에 따라 자동 선택)
- **가격 미설정 모델 알림** – 일부 trace된 모델에 가격 행이 없을 때 차트 아래에 표시되며, LLM Cost Table로 연결됩니다

## 시간 범위

필터 바 상단의 단일 **Time range** 선택기가 통계 헤더와 trace 목록을 모두 제어합니다. 선택 항목: Last 1 hour, Last 24 hours, Last 7 days(기본값), Last 30 days, All time. 범위를 변경하면 페이지네이션이 초기화되고 차트와 목록이 함께 다시 로드됩니다.

## Trace 목록

- 선택한 시간 범위 내 최근 trace의 페이지네이션된 목록
- 각 trace는 Workflow, 노드, credential, 타임스탬프, 소요 시간을 표시합니다
- trace를 클릭하면 상세 보기가 열립니다
- 상세 대화상자 내에서 **Prev / Next**를 사용하면 대화상자를 닫지 않고 trace 간을 이동할 수 있습니다

## 필터링

- **Time range** – 1h / 24h / 7d / 30d / All; 차트와 목록을 함께 필터링합니다
- **Credential** – 사용된 credential(API key)로 필터링합니다
- **Source** – Workflow 또는 실행 소스로 필터링합니다
- **Search** – 모델, Workflow, credential 또는 노드 레이블로 검색합니다
- **Refresh** – 현재 trace 페이지를 다시 로드합니다

## Trace 상세

trace를 열면:

- **Steps** – trace를 순서가 있는 체인으로 읽는 위에서 아래로의 타임라인: System → User → Assistant → Tool → Answer. 각 단계는 접을 수 있으며, 하나를 펼치면 읽기 쉬운 상세 정보(메시지 텍스트 또는 도구의 인수와 결과)와 해당 단계의 JSON이 표시됩니다. MCP 호출과 JSON-RPC Payload를 포함한 모든 이벤트 유형의 JSON 콘텐츠는 기본적으로 펼칠 수 있는 트리로 열리며, 첫 번째 레벨이 펼쳐집니다. **Tree / Raw**를 사용하여 포맷된 구조와 원본 텍스트 간을 전환할 수 있습니다. 잘못된 형식의 JSON은 일반 텍스트로 계속 표시됩니다. 도구 단계는 소요 시간과 해당되는 경우 MCP/Skill 배지를 표시하며, 도구 호출 상태가 설정된 경우 pending / timeout / cancelled 배지도 표시합니다. Answer 단계는 집계된 `tool_metrics` 배지(상태별 호출 수와 총 도구 소요 시간)를 표시할 수 있습니다. Dashboard Chat 메시지와 라우팅된 agent가 그러하듯 trace가 각 모델 호출을 기록하면, 호출이 요청한 도구 앞에 **LLM** 단계가 위치하며, **Duration Breakdown**은 모든 모델 호출, 도구, 라우팅 결정을 하나의 타임라인에 펼쳐 놓습니다. Dashboard Chat 메시지는 도구 라운드가 몇 번이든 단일 trace입니다. 메시지 체인이 없는 trace(예: 이미지 생성)는 최소한의 Request → Response 타임라인을 표시합니다.
- **Request** – LLM으로 전송된 전체 요청 Payload, **Tree / Raw** JSON 보기 제공
- **Response** – 도구 호출이 있는 경우 이를 포함한 모델 응답, **Tree / Raw** JSON 보기 제공
- **Tool metrics** – 응답에 존재하는 경우, 도구 호출 수(`success` / `error` / `pending` / `timeout` / `cancelled`)와 총 도구 소요 시간의 간결한 요약
- **Timing breakdown** – 성능 분석을 위한 `llm_ms`, `tools_ms`, `mcp_list_ms`
- **Tool calls** – 도구 이름, 인수, 결과, 상태, 경과 시간
- **Skills included** – 요청에서 모델에 전달된 Skill
- **Go to Workflow** – trace 상세 대화상자에서 관련 Workflow로 직접 이동합니다

## 복사 및 내보내기

- 요청 또는 응답 JSON을 클립보드에 복사합니다. 복사는 항상 활성 보기에 관계없이 완전한 원본 Payload를 사용합니다
- 디버깅 또는 지원팀과의 공유에 사용합니다

## 유지 관리

- **Clear All** – 확인 후 저장된 모든 trace를 삭제합니다
- 페이지네이션 컨트롤은 현재 표시 범위를 보여줍니다(예: `1-25 of 240`)

## 관련 항목

- [Why Heym](../getting-started/why-heym.md) – agent 라이프사이클 전반에 걸친 LLM 관측 가능성
- [Agent Node](../nodes/agent-node.md) – 도구 호출 기능이 있는 Agent 노드
- [Node Types](../reference/node-types.md) – LLM 및 Agent 노드
- [Credentials Tab](./credentials-tab.md) – trace에 사용된 credential
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Workflow, 노드, Agent 도구 span에 대한 옵트인 OTel 내보내기
- [DataTable Tab](./datatable-tab.md) – 비용 차트에서 사용하는 LLM Cost Table을 호스팅합니다
- [Contextual Showcase](../reference/contextual-showcase.md) – 대시보드 화면을 위한 간결한 페이지 가이드

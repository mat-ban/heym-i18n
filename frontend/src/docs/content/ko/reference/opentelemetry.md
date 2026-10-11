# OpenTelemetry Tracing

Heym은 모든 Workflow 실행, 노드 실행 및 Agent 도구 호출에 대해 [OpenTelemetry](https://opentelemetry.io/) trace를 내보낼 수 있습니다. 각 실행은 루트 span과 함께 노드 및 Agent 도구별 자식 span을 생성하므로, 어떤 단계가 실패했는지, 얼마나 걸렸는지, 무엇을 호출했는지, 무엇이 반환되었는지 확인할 수 있습니다. Span은 OTLP/HTTP를 통해 Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic 또는 Grafana Cloud와 같은 호환 백엔드로 내보내집니다.

Tracing은 **기본적으로 비활성화**되어 있습니다. 비활성화 상태에서는 측정 가능한 오버헤드가 없으며 span도 생성되지 않습니다.

## Tracing 활성화

백엔드에서 다음 환경 변수를 설정한 후 재시작하십시오:

전체 환경 변수 목록은 [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md)를 참조하십시오.

| 변수 | 기본값 | 설명 |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | 마스터 스위치입니다. Tracing을 활성화하려면 `true`로 설정하십시오. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | OTLP/HTTP 기본 Endpoint입니다. 예를 들어 `http://collector:4318`입니다. Heym은 `<endpoint>/v1/traces`로 span을 전송합니다. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Exporter 인증을 위한 쉼표로 구분된 `key=value` 헤더입니다. 예를 들어 `authorization=Bearer <token>`입니다. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | `service.name` 리소스 속성입니다. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | `0.0`과 `1.0` 사이의 Head 샘플링 비율로, parent-based sampler와 함께 적용됩니다. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | `true`인 경우, 잘린 노드 입력 및 출력 Payload를 노드 span에 첨부합니다. 개인정보 보호를 위해 기본적으로 비활성화되어 있습니다. |

최소 예시:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

앱의 **Settings → Observability**에서 활성 구성을 확인할 수 있습니다(헤더의 아바타에서 열 수 있습니다). 해당 패널은 읽기 전용이며 Exporter 시크릿을 표시하지 않습니다.

## 추적 대상

### Workflow 루트 span

이름: `heym.workflow.execute`

| 속성 | 설명 |
|-----------|-------------|
| `heym.workflow.id` | Workflow UUID입니다. |
| `heym.node.count` | Workflow의 노드 수입니다. |
| `heym.workflow.test_mode` | 테스트 실행인 경우 `true`입니다. |
| `heym.sub_workflow.depth` | Sub-workflow로 호출될 때의 중첩 깊이입니다. |
| `heym.workflow.status` | 실행의 최종 상태입니다. 실패한 실행은 span 상태를 `ERROR`로 설정합니다. |

### 노드 span

이름: `heym.node.execute`이며, Workflow span의 자식으로 생성됩니다.

| 속성 | 설명 |
|-----------|-------------|
| `heym.node.id` | 노드 id입니다. |
| `heym.node.type` | 노드 유형입니다. 예를 들어 `agent`, `llm`, `http`입니다. |
| `heym.node.label` | 캔버스에 표시되는 노드 레이블입니다. |
| `heym.node.status` | `success` 또는 `error`입니다. 오류는 span 상태를 `ERROR`로 설정합니다. |
| `heym.node.duration_ms` | 노드 실행 시간(밀리초)입니다. |
| `heym.llm.model` | 사용 가능한 경우 LLM 및 Agent 노드의 모델 이름입니다. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | 사용 가능한 경우 LLM 및 Agent 노드의 Token 사용량입니다. |

Workflow 컨텍스트가 워커 스레드로 전파되므로, 노드가 병렬로 실행되더라도 노드 span은 Workflow span 아래에 올바르게 중첩됩니다.

### Agent 도구 span

이름: `heym.agent.tool.execute`이며, 활성 Agent 노드 span 아래에 생성됩니다.

| 속성 | 설명 |
|-----------|-------------|
| `heym.agent.tool.name` | 모델이 선택한 도구 이름입니다. |
| `heym.agent.tool.call_id` | 사용 가능한 경우 Provider tool-call id입니다. |
| `heym.agent.tool.source` | `node_tool`, `mcp`, `skill` 또는 `sub_workflow`와 같은 도구 소스입니다. |
| `heym.agent.tool.mcp_server` | 해당되는 경우 MCP 서버 레이블입니다. |
| `heym.agent.tool.iteration` | Agent tool-loop 반복 횟수입니다. |
| `heym.agent.tool.args_bytes` | 직렬화된 도구 인수의 UTF-8 크기입니다. |
| `heym.agent.tool.result_bytes` | 직렬화된 도구 결과의 UTF-8 크기입니다. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` 또는 `cancelled`입니다. 도구 오류는 span 상태를 `ERROR`로 설정합니다. |

원시 도구 인수 및 결과는 기본적으로 span에 첨부되지 않습니다.

## Agent 도구 Payload 안전성

영속화된 Agent 관측성 Payload는 코드에서 마스킹 및 잘림 처리됩니다(문자열당 `4096`자, 깊이 `6`, LLM trace 쓰기당 총 `32768`자). 전체 trace 예산은 도구 레코드에 걸쳐 분배되므로, 초기의 큰 결과가 이후 호출의 식별 정보와 라이프사이클 상태를 가릴 수 없습니다. 크기가 제한된 `_generated_files` 다운로드 메타데이터는 대용량 skill 출력과 별도로 예약됩니다:

- trace 저장소에 기록된 `_hitl_pending` 사본을 포함한 LLM trace `request` / `response` 도구 섹션
- 실행 이력에 표시되는 Agent 결과 `tool_calls` 레코드
- 동일한 크기 제한된 정제 레코드를 재사용하는 Live Debug 패널 도구 결과 이벤트

실시간 도구 실행, 모델에 바인딩된 도구 메시지 및 메모리 내 HITL 재개 상태(`_hitl_pending.agent_state.messages` / `tool_arguments`)는 원본 값을 유지하므로 재개 및 정확한 인수 매칭이 여전히 작동합니다. 저장된 관측성 사본만 정제됩니다.

## Trace Context 전파

Heym은 [W3C Trace Context](https://www.w3.org/TR/trace-context/) 표준을 따르므로 서비스 경계를 넘어서도 trace가 연결된 상태로 유지됩니다.

- **인바운드 Webhook:** 수신 요청에 `traceparent` 헤더가 포함된 경우, Workflow 실행은 해당 trace의 자식으로 기록됩니다. 이를 통해 Heym 실행을 이를 Trigger한 업스트림 시스템과 연결할 수 있습니다.
- **아웃바운드 HTTP:** HTTP 노드는 자신이 수행하는 요청에 `traceparent`를 주입하므로, 다운스트림 서비스가 동일한 trace를 이어갈 수 있습니다.
- **하위 Workflow:** 하위 Workflow 실행은 이를 호출한 노드의 자식으로 설정되어, 하나의 trace 내에서 호출 계층 구조가 보존됩니다.

인바운드 컨텍스트가 없는 Trigger(예: Cron, IMAP, RabbitMQ, WebSocket)는 실행마다 새로운 trace를 시작합니다.

## 안정성

- 느리거나 연결할 수 없는 collector는 Workflow 실행을 절대 차단하지 않습니다. Span은 배치 처리되어 백그라운드에서 내보내집니다.
- 추적 초기화에 실패한 경우(예: 잘못된 Endpoint), 백엔드는 시작에 실패하는 대신 오류를 로그에 기록하고 추적을 비활성화한 상태로 계속 진행합니다.
- OTLP 인증 헤더는 환경 변수에서만 읽습니다. 이들은 데이터베이스에 저장되지 않으며 상태 API에서 반환되지도 않습니다.

## 관련 항목

- [Settings](./user-settings.md) – 추적 상태를 표시하는 Observability 탭
- [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – 전체 구성 참조
- [Triggers](./triggers.md) – Webhook을 포함하여 Workflow가 시작되는 방식
- [Execution History](./execution-history.md) – Heym의 내장 실행별 이력 보기
- [HTTP](../nodes/http-node.md) – 다운스트림 호출로 trace 컨텍스트를 전파하는 노드

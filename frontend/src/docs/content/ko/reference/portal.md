# Portal

**Portal**은 Heym Workflow를 공개 채팅 스타일 UI로 노출합니다. 최종 사용자는 Heym에 로그인하지 않고도 URL을 통해 Workflow를 실행할 수 있습니다.

## 주요 기능

- **공개 URL**: `/chat/{slug}` (예: `/chat/my-workflow`)
- **채팅 인터페이스**: 사용자는 채팅 UI(메시지, 입력, 응답)를 통해 상호작용합니다
- **선택적 인증**: Portal 사용자가 구성된 경우 로그인이 필요하며, 그렇지 않으면 Portal은 공개됩니다
- **스트리밍**: 실행 중 실시간 노드 진행 상황 표시(활성화된 경우)
- **실행 중지**: 사용자는 채팅 하단에서 진행 중인 Portal 실행을 중지할 수 있으며, 서버 측에서도 활성 Workflow 실행이 취소됩니다
- **파일 업로드**: 입력 필드별 선택적 파일 업로드(텍스트, 이미지 등)
- **Human review 핸드오프**: Agent가 승인을 위해 일시 중지하면 Portal 실행에서 [HITL review 링크](./human-in-the-loop.md)를 표시할 수 있습니다
- **이미지 표시**: 이미지가 포함된 Workflow 출력(예: LLM 이미지 생성 또는 Playwright 스크린샷)은 채팅에서 썸네일로 표시됩니다. 이미지를 클릭하면 전체 화면 뷰어가 열리며, **Esc**를 누르거나 기기의 뒤로 가기 버튼을 사용하여 닫을 수 있습니다

## Workflow 구성

| 설정 | 설명 |
|---------|-------------|
| `portal_enabled` | 이 Workflow에 대해 Portal 활성화 |
| `portal_slug` | URL slug (예: `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | 스트리밍 실행 사용 |
| `portal_file_upload_enabled` | 파일 업로드 허용 |
| `portal_file_config` | 필드별 파일 구성(유형, 제한) |

편집기에서 구성합니다: Workflow 헤더의 **Portal** 버튼을 클릭하면 Portal 설정 대화상자가 열립니다.

## 흐름

1. **Info**: `GET /api/portal/{slug}/info` – Workflow 메타데이터 및 입력 필드 반환(인증 불필요)
2. **Login** (필요한 경우): `POST /api/portal/{slug}/login` – 세션 Token 반환
3. **Execute**: `POST /api/portal/{slug}/execute` – Portal 채팅 UI가 이를 호출합니다(또는 활성화된 경우 내부적으로 스트리밍 변형을 호출). 최종 사용자는 API를 직접 호출하는 것이 아니라 채팅 인터페이스를 통해 상호작용합니다.
4. **Stop**: `POST /api/portal/{slug}/executions/{execution_id}/cancel` – 사용자가 활성 Portal 실행 중 **Stop**을 누를 때 요청됩니다

## Portal 실행에서의 HITL

Portal Workflow가 [Human-in-the-Loop](./human-in-the-loop.md)가 활성화된 [Agent 노드](../nodes/agent-node.md)에 도달하면, Portal 응답은 비어 있는 대신 review 링크를 표시합니다.

- Workflow 실행 상태가 `pending`이 됩니다
- Portal 채팅에 review URL이 표시됩니다
- Agent의 `review` 출력 핸들에 연결된 모든 노드는 즉시 Slack, 이메일 또는 기타 채널로 알릴 수 있습니다
- 검토자는 로그인하지 않고 `/review/{token}`에서 결정을 완료합니다
- 검토 후 Workflow는 저장된 스냅샷에서 재개됩니다

이를 통해 공개 채팅 흐름과 비공개 Human 승인 단계를 결합할 수 있습니다.

## 입력 필드

입력 필드는 [Input](../nodes/input-node.md) 노드에서 가져옵니다. API는 `textInput` 유형의 시작 노드와 해당 `inputFields`를 추출합니다. 실행은 일반 실행과 동일한 엔진을 사용하며, 입력은 `body.inputs` 및 다중 턴 흐름을 위한 `conversation_history`로 전달됩니다.

## 인증 및 세션

- **WorkflowPortalUser**: Workflow별 사용자 이름/비밀번호(인증이 활성화된 경우)
- **마지막 사용자 제거**: 포털이 활성화된 상태에서 마지막 포털 사용자를 삭제하면 포털이 다시 공개 상태로 전환됩니다. 설정 대화상자에서 먼저 확인을 요청합니다
- **PortalSession**: TTL 168시간의 세션 Token
- **속도 제한**: 로그인 3회 실패 → Workflow+IP별 24시간 차단
- 만료된 세션은 Cron 작업으로 정리됩니다

## 구성 UI

**WebPortalSettingsDialog** 탭:

1. **General**: Portal 활성화, slug 설정, Portal URL 복사
2. **Users**: Portal 사용자 추가/제거(사용자 이름/비밀번호)
3. **Options**: 스트림 모드, 파일 업로드, 입력 필드 보기

## 관련 문서

- [Why Heym](../getting-started/why-heym.md) – 프로덕션 환경에서 Agent를 위한 채팅 표면으로서의 Portal
- [Workflows Tab](../tabs/workflows-tab.md) – Workflow 생성 및 Portal 활성화
- [Human-in-the-Loop](./human-in-the-loop.md) – 대기 중인 Agent 출력에 대한 공개 review 페이지
- [Triggers](./triggers.md) – 진입점으로서의 Portal
- [Node Types](./node-types.md) – Portal 입력을 위한 [Input](../nodes/input-node.md)
- [Workflow Structure](./workflow-structure.md) – 노드와 엣지

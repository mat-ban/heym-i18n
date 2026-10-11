# 실행 Token

Execution Token은 단일 Workflow의 execute 및 stream Endpoint에 대한 접근을 부여하는 범위 지정된 JWT입니다. 이를 통해 장기 유지되는 사용자 세션 Token을 노출하지 않고도 외부 시스템에서 Workflow를 호출할 수 있습니다.

## Execution Token을 사용하는 이유

Workflow의 인증이 **JWT**로 설정된 경우, Endpoint는 일반적으로 유효한 사용자 세션을 요구합니다. Execution Token을 사용하면 다음이 가능합니다:

- 계정 자격 증명을 공유하지 않고도 외부 스크립트, CI 파이프라인 또는 통합에 호출 가능한 Token을 공유할 수 있습니다.
- 노출 범위 제한 — Token은 하나의 특정 Workflow에만 유효합니다.
- 비밀번호를 변경하거나 세션 Token을 교체하지 않고도 즉시 접근을 취소할 수 있습니다.
- 단기 Token(분 또는 시간 단위)과 장기 Token(최대 10년) 중에서 선택할 수 있습니다.

## Token 생성

편집기에서 **Run with cURL** 대화상자를 엽니다(우측 상단 툴바). Workflow 인증이 **JWT Token**으로 설정된 경우, 대화상자에 Token 관리자가 표시됩니다:

1. **Short-lived** 또는 **Long-lived (10yr)** 를 선택합니다.
2. 단기 Token의 경우, 지속 시간을 초 단위로 입력합니다(최소 60).
3. **+ New Token** 을 클릭합니다.

Token은 즉시 생성되어 목록에 추가되고 자동으로 선택되므로 cURL 명령이 이를 포함하도록 업데이트됩니다.

## Token 목록

각 Token 행에는 다음이 표시됩니다:

| Column | Description |
|--------|-------------|
| Created | 생성 타임스탬프 |
| Status | **Expires:** 날짜, **Expired** 또는 **Revoked** |
| Eye icon | Token 값 표시 여부 전환 |
| Revoke button | Token을 취소로 표시(되돌릴 수 없음) |

활성 상태(만료되지 않고 취소되지 않은) 행을 클릭하여 선택합니다. 선택된 Token은 cURL 명령 미리보기에 포함됩니다.

만료 및 취소된 Token은 목록에 계속 표시되지만 선택할 수는 없습니다.

## Token 사용

목록에서 Token 값을 복사하고(눈 아이콘을 클릭하여 표시) `Bearer` Token으로 포함합니다:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

대화상자에서 Token을 선택한 상태로 **Copy cURL** 을 사용하면 Token이 이미 명령에 포함되어 있으므로 수동으로 대체할 필요가 없습니다.

## Token 범위 지정

각 Token은 다음 JWT 클레임을 포함합니다:

| Claim | Value |
|-------|-------|
| `sub` | Token 생성자의 사용자 ID |
| `wid` | Workflow UUID — 다른 Workflow에 대해서는 Token이 거부됩니다 |
| `scope` | `workflow:execute` — 사용자 세션 Token과 구별합니다 |
| `jti` | 취소 조회에 사용되는 고유 Token ID |
| `exp` | 만료 타임스탬프 |

백엔드는 모든 요청에서 이들 모두를 확인합니다: 서명 유효성, 만료 여부, `wid` 일치 여부, 그리고 `jti`가 취소되지 않았는지 여부입니다.

## 취소

Token 옆의 취소(원형 슬래시) 버튼을 클릭하여 취소합니다. 취소는 즉시 적용됩니다 — 해당 Token을 사용하는 후속 요청은 `401`을 반환합니다. Token 행은 **Revoked** 라벨과 함께 목록에 계속 표시됩니다.

취소 해제는 없습니다. 접근을 복원해야 하는 경우 새 Token을 생성하십시오.

## API

Token 관리 Endpoint는 일반 세션으로 인증됩니다.

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Token 생성 |
| `GET` | `/api/workflows/{id}/execution-tokens` | 이 Workflow에 대한 본인의 Token 목록 조회 |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Token 취소 |

**생성 요청 본문:**

```json
{ "ttl_seconds": 900 }
```

**생성 응답:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

`token` 필드는 생성 시 한 번만 반환됩니다. 즉시 저장하십시오. 후속 `GET` 요청은 동일한 행을 반환하지만, 언제든지 cURL 대화상자에서 이를 표시할 수도 있습니다.

## 가시성 범위

각 사용자는 자신이 생성한 Token만 볼 수 있습니다. 공유 Workflow에 접근 권한이 있는 팀 구성원은 서로의 Token을 볼 수 없습니다.

## 관련 문서

- [Webhooks](./webhooks.md) — HTTP Trigger Endpoint 및 cURL 대화상자
- [Security](./security.md) — 세션 관리 및 인증 개요
- [SSE Streaming](./sse-streaming.md) — 스트리밍 Endpoint와 함께 Execution Token 사용

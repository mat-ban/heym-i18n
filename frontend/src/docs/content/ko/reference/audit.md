# 감사 로깅

Heym은 보안과 관련된 모든 작업에 대해 감사 로그 한 줄을 기록합니다. 누가, 무엇에 대해, 무엇을 했는지, 그리고 성공했는지 여부입니다. 로그는 요청 액세스 로그와 함께 `winston.audit` 로거를 통해 백엔드의 표준 출력으로 전송되며, **Logs** 탭이나 `docker logs`로 확인할 수 있습니다.

감사 로깅은 **항상 켜져 있습니다**. 활성화할 것도, 설정할 환경 변수도 없습니다.

## 로그 형식

하나의 작업은 정확히 하나의 독립적인 로그 줄을 생성합니다:

```
2026-08-25 14:02:11 INFO [winston.audit] audit action=credential.delete outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="OpenAI Prod" credential_type=openai
```

모든 줄에는 다음 필드가 포함됩니다:

| 필드 | 설명 |
|-------|-------------|
| `action` | 발생한 작업으로, `resource.verb` 형식입니다 — 아래 표를 참조하십시오. |
| `outcome` | `success`, `failure`, 또는 `denied`입니다. |
| `actor_id` | 작업을 수행한 사용자의 UUID입니다. 아무도 인증되지 않은 경우에만 생략됩니다. |
| `actor_email` | 해당 사용자의 이메일입니다. 로그인 실패 시에는 확인된 계정이 아니라 시도된 주소입니다. |
| `target` | 작업 대상 객체로, `type:uuid` 형식입니다. |
| `target_name` | 해당 객체의 사람이 읽을 수 있는 이름이며, 공백이 포함된 경우 따옴표로 묶입니다. |

이어서 작업별 필드가 따라옵니다 — 예를 들어 `credential_type`, `imported`, `grantee_email`, `team_name` 등입니다. 공백, 따옴표, 또는 `=`가 포함된 값은 따옴표로 묶이며, 256자를 초과하는 값은 `...(truncated)` 표시와 함께 잘립니다.

## 로그 읽기

감사 로거는 요청 로거의 자식이므로, 둘 다 동일한 스트림에 도달하면서도 분리 가능한 상태로 유지됩니다:

```bash
# Only audit lines, no access-log noise
docker logs heym-backend 2>&1 | grep '\[winston.audit\]'

# Everything one user did
docker logs heym-backend 2>&1 | grep 'actor_email=alex@example.com'

# Failed logins and refused access
docker logs heym-backend 2>&1 | grep -E 'outcome=(failure|denied)'

# Everything that touched one credential
docker logs heym-backend 2>&1 | grep 'target=credential:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43'
```

앱에서는 **Logs** 탭이 동일한 컨테이너 출력을 읽습니다. 이는 `DOCKER_LOGS_ENABLED`와 `DOCKER_LOGS_ALLOWED_EMAILS` 허용 목록에 의해 제어됩니다.

## 기록되는 항목

모든 상태 변경이 기록됩니다. 읽기는 읽기 자체가 민감한 행위인 경우에만 기록됩니다 — Workflow의 실행 이력 조회, Credential 열기, 파일 다운로드 등입니다. 일반적인 목록 및 상세 조회는 감사되지 않습니다. 액세스 로그가 이미 요청이 발생했음을 기록하고 있으며, 모든 `GET`을 감사하면 중요한 로그 줄이 묻히게 됩니다. 유일한 예외는 로그인한 사용자가 앱에서 어디로 이동했는지를 기록하는 [페이지 뷰](#page-views)입니다.

### 인증

| 작업 | 비고 |
|--------|-------|
| `auth.register` | 등록이 비활성화되었거나 비밀번호 로그인이 꺼져 있을 때(`reason=password_login_disabled`) `outcome=denied`, 이메일이 이미 사용 중일 때 `failure`입니다. |
| `auth.login` | `outcome=failure`는 시도된 주소와 이메일이 알려지지 않았는지 또는 비밀번호가 잘못되었는지를 기록합니다. |
| `auth.logout` | actor는 refresh cookie에서 확인되므로, cookie 없이 로그아웃하면 신원 없이 기록됩니다. |
| `auth.token_refresh` | `reason=refresh_token_replayed_or_revoked`와 함께 `outcome=denied` — 경보를 울릴 가치가 있는 Token 도난 신호입니다. |
| `auth.password_change` | 현재 비밀번호가 잘못된 경우 `outcome=failure`입니다. |
| `auth.sso_login` | Single sign-on입니다. `outcome=failure`는 provider 응답이 거부된 이유를 담고, `denied`는 `email_not_verified`, `domain_not_allowed`, 또는 `provisioning_disabled`를 담습니다. |
| `sso_settings.update` | 관리자가 [SSO](./sso.md) 구성을 변경했습니다. `enabled`와 `password_login_disabled`를 기록하며, client secret은 절대 기록하지 않습니다. |
| `sso_settings.test` | 관리자가 SSO 연결 테스트를 실행했습니다. |

### 페이지 뷰

`page.view`는 로그인한 사용자가 웹 앱에서 페이지를 열 때마다 `path` 필드에 URL 경로와 함께 기록됩니다:

```
2026-10-29 09:14:02 INFO [winston.audit] audit action=page.view outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com path="/?tab=traces"
```

경로는 앱 내부 라우트입니다. 대시보드 탭은 그 일부이며(`/?tab=traces`), `/workflows/<id>`와 같이 열려 있는 대상을 지정하는 ID도 마찬가지입니다. 페이지를 식별하는 쿼리 매개변수의 짧은 목록만 유지되고(`tab`, `dashboard`, `board`, `suite`, `workflowId`, `traceId`), 쿼리 문자열의 다른 모든 항목과 전체 조각은 삭제됩니다. `/review/<token>`과 같이 링크에 비밀이 포함된 페이지는 비밀 대신 자리 표시자 `:token`으로 기록됩니다.

브라우저가 경로를 보고하므로 `page.view` 라인은 사용자가 이동했다고 보고한 위치를 보여줍니다. 서버가 해당 페이지를 반환했음을 증명하지는 않습니다. 로그인 페이지 방문 및 로그아웃 상태에서 열린 링크는 연결된 사용자가 없으므로 기록되지 않습니다.

### Workflows

`workflow.create` · `workflow.update` · `workflow.delete` · `workflow.version_revert` · `workflow.run` · `workflow.history_view` · `workflow.history_clear` · `workflow.share_add` · `workflow.share_remove` · `workflow.team_share_add` · `workflow.team_share_remove` · `workflow.execution_token_create` · `workflow.execution_token_revoke`

`workflow.run`은 API(편집기의 실행 버튼, 세션이 있는 execute 엔드포인트, API 키 또는 웹훅, 채팅 포털 및 MCP 도구)를 통해 실행이 시작될 때 기록됩니다. 누가, 어떻게 시작했는지, 어떻게 끝났는지를 기록합니다:

```
[winston.audit] audit action=workflow.run outcome=success actor_id=8f2c1b04-3d5a-4f21-9c7e-1a2b3c4d5e6f actor_email=alex@example.com target=workflow:3a91d7e2-55c8-4b19-b0a1-9e8d7c6b5a43 target_name="Invoice triage" status=success trigger_source=Canvas execution_id=c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e0f duration_ms=1235 test_run=true
```

`execution_id`는 해당 라인을 실행 이력의 실행과 연결합니다. 실행이 `error`, `cancelled` 또는 `timeout`으로 끝난 경우 `outcome`은 `failure`입니다. 사람의 검토를 위해 일시 중지되었거나 동시성 큐에 보관된 실행은 `status=pending` 또는 `status=queued`가 있는 `success` 라인입니다. 익명 웹훅이나 포털 방문자와 같이 로그인한 사용자가 없는 호출에는 `actor_id` 또는 `actor_email`이 없습니다. 입력과 출력은 절대 기록되지 않습니다.

일정, 트리거 노드, 큐 또는 이벤트에 의해 시작된 실행은 감사 라인이 아닙니다. 이를 요구한 인스턴스에서 실행되며 트리거 소스 및 이를 실행한 인스턴스와 함께 실행 이력에 기록됩니다.

`workflow.history_view`는 누군가가 워크플로의 실행 이력을 열 때 기록됩니다. 캔버스나 목록에서 워크플로의 최신 실행을 보여주는 간단한 조회는 감사되지 않습니다.


`workflow.history_view`는 협업자가 다른 사람의 실행 이력을 읽을 때 `owned=false`를 기록합니다. `workflow.delete`는 협업자가 삭제를 시도할 때 `reason=not_owner`와 함께 `outcome=denied`를 기록합니다.

### Credentials

`credential.create` · `credential.update` · `credential.delete` · `credential.detail_view` · `credential.share_add` · `credential.share_remove` · `credential.team_share_add` · `credential.team_share_remove`

`credential.detail_view`는 Credential을 열면 복호화가 수행되기 때문에 감사됩니다. 조회 실패 시 `outcome=denied`가 기록되며, 이는 credential-id 열거 시도의 모습입니다.
### 기타 리소스

| 리소스 | 액션 |
|----------|---------|
| Variables | `variable.create` · `update` · `delete` · `bulk_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Vector stores | `vector_store.create` · `update` · `delete` · `clone` · `upload` · `item_delete` · `items_delete_by_source` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Alerts | `alert.create` · `update` · `delete` · `event_acknowledge` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` · `disable_on_access_revoke` |
| Data tables | `data_table.create` · `update` · `delete` · `clone` · `row_create` · `row_update` · `row_delete` · `rows_clear` · `rows_bulk_create` · `import_csv` · `export_csv` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Dashboards | `dashboard.create` · `update` · `delete` · `widget_create` · `widget_delete` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Boards | `board.create` · `update` · `delete` · `column_create` · `column_update` · `column_delete` · `column_empty` · `card_create` · `card_update` · `card_delete` · `card_move` · `card_run` · `share_add` · `share_remove` · `team_share_add` · `team_share_remove` |
| Drive | `drive.upload` · `download` · `delete` · `delete_all` · `bulk_delete` · `share_create` · `share_revoke` · `team_sharing_update` · `bulk_team_sharing_update` |
| Teams | `team.create` · `update` · `delete` · `member_add` · `member_remove` |
| Folders | `folder.create` · `update` · `delete` · `workflow_move` |

Bulk 작업은 행마다 한 번이 아니라 요청당 한 번, 건수와 함께 기록됩니다. 5,000개 행의 CSV 가져오기는 `imported`, `rejected`, `total`을 포함하는 하나의 `data_table.import_csv` 라인을 생성합니다.

## Secrets는 절대 기록되지 않습니다

감사 라인은 식별자, 이름, 건수를 기록합니다. 자격 증명의 내용, 변수 값, 비밀번호, Token은 절대 기록하지 않습니다.

이를 강제하는 두 가지 장치가 있습니다. 호출 지점은 안전한 필드만 전달하도록 작성되며, 감사 헬퍼는 백스톱으로서 민감 정보를 마스킹합니다. 이름에 `password`, `secret`, `token`, `api_key`, `value`, `authorization`, `cookie` 또는 이와 유사한 문자열이 포함된 모든 필드는 라인이 생성되기 전에 `***`로 대체됩니다. 과도한 마스킹은 의도된 것입니다. 도움이 되지 않는 라인이 자격 증명 유출보다 낫습니다.

Secret이 해당 레코드에 실제로 관련이 있는 경우에는 그 형태만 기록됩니다. 파일 공유는 `password_protected=true`를 기록하며, 비밀번호는 절대 기록하지 않습니다.

## Heym Work

Heym과 함께 Heym Work를 실행하면 Work는 동일한 Winston 형식으로 자체 컨테이너의 stdout에 감사 라인을 출력합니다:

```bash
docker logs heym-work 2>&1 | grep '[winston.audit]'
```

Work는 페이지, 보드 및 레코드에 대한 사용자 작업을 기록합니다:

| 작업 | 의미 |
|---|---|
| `page.create`, `page.update`, `page.delete` | 대시보드 페이지 및 레이아웃 변경 |
| `board.column_create`, `board.column_move`, `board.column_delete` | Kanban 열 레이아웃 변경 |
| `card.create`, `card.move`, `card.archive`, `card.delete` | 카드 수명 주기 이벤트 |
| `record.create`, `record.update`, `record.delete` | Work를 통한 데이터 테이블 레코드 변경 |
| `chat.message` | Work 어시스턴트에게 전송된 사용자 프롬프트 |
| `export.csv`, `export.json` | 데이터 내보내기 |

각 라인은 Heym 감사 라인과 동일한 `actor_id`, `actor_email`, `timestamp` 및 `outcome` 필드를 포함하므로 로그 수집기는 단일 파이프라인으로 두 로그를 모두 구문 분석할 수 있습니다.

## 보존

**감사 라인은 컨테이너의 로그 출력이 유지되는 동안에만 존재합니다.** 데이터베이스에 기록되지 않습니다. 백엔드 컨테이너를 다시 생성하면 해당 로그는 폐기됩니다.

재배포 후에도 유지되는 감사 이력을 원한다면, 다른 컨테이너 로그와 마찬가지로 컨테이너의 stdout을 영구적인 위치로 전송하십시오. 로그 드라이버, 사이드카 수집기 또는 플랫폼의 로그 집계를 사용할 수 있습니다.

## 기여자를 위한 안내

감사 라인을 남기는 데는 한 번의 호출이면 충분합니다.

```python
from app.services.audit_log import audit

audit(
    action="credential.delete",
    actor=current_user,
    target_type="credential",
    target_id=credential.id,
    target_name=credential.name,
)
```

이 헬퍼는 동기식이며, 데이터베이스에 접근하지 않고, 자체 오류를 삼키므로 감사 호출이 요청을 실패시키거나 지연시킬 수 없습니다.

감사 호출을 추가할 때의 세 가지 규칙은 다음과 같습니다.

1. **액션 이름을 snake_case로 `resource.verb` 형식으로 지정하십시오.** `backend/tests/test_audit_log.py`는 `app/api/` 아래의 모든 `audit()` 호출을 순회하며, 형식에 맞지 않는 이름과 모든 호출 지점을 잃은 커버된 리소스에 대해 빌드를 실패시킵니다.

2. **반드시 존재하는 속성만 읽으십시오.** 헬퍼의 `try/except`는 헬퍼 자체의 본문을 보호할 뿐, 전달하는 표현식을 보호하지 않습니다. `target_name=workflow.name`에서의 `AttributeError`는 `audit()`이 실행되기 전에 호출 지점에서 발생하여 요청을 중단시킵니다. 선택적 속성이나 지연 로딩 속성이 아니라 ORM 컬럼과 로컬 변수를 읽으십시오.

3. **삭제 전에 삭제를 기록하십시오.** `db.delete(row)` 이후에는 기록하려는 이름과 id가 사라졌을 수 있습니다. 호출을 그 위에 배치하십시오.

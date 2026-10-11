# Supabase

**Supabase** 노드는 Supabase 프로젝트의 PostgREST API에서 노출된 테이블을 읽고 변경합니다. HTTP 요청을 직접 작성하지 않고도 SQL 기반 애플리케이션 상태에 Workflow가 접근해야 할 때 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | Supabase |
| 출력 | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 Supabase credential |
| `supabaseOperation` | string | 작업: `select`, `insert`, `update`, `upsert`, `delete` 중 하나 |
| `supabaseSchema` | expression | 스키마 이름. 비어 있으면 노드는 credential의 기본 스키마를 사용하고, 그다음 `public`을 사용합니다. |
| `supabaseTable` | expression | 조회하거나 변경할 단순 테이블 이름. 스키마는 여기가 아니라 `supabaseSchema`에 지정하십시오. |
| `supabaseSelectColumns` | expression | `select`를 위한 쉼표로 구분된 PostgREST select 목록 (기본값 `*`) |
| `supabaseFilter` | expression | JSON 필터 객체. 정확한 일치뿐 아니라 연산자 객체와 논리 그룹을 지원합니다. 예: `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}`, `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | `select`에서 반환할 최대 행 수 (`0` = 서버 측 페이지네이션으로 일치하는 모든 행을 가져옴, 음수 값은 `100`으로 대체됨) |
| `supabaseOrderBy` | expression | `select`에서 정렬할 선택적 컬럼 |
| `supabaseAscending` | boolean | `true`이면 오름차순, `false`이면 내림차순 정렬 |
| `supabaseRowsInputMode` | string | `insert`/`upsert`용: `raw` JSON 배열 모드 또는 단일 업스트림 입력을 자동으로 매핑하는 `auto` |
| `supabaseDataInputMode` | string | `update`용: `raw` JSON 객체 모드 또는 단일 업스트림 입력을 자동으로 매핑하는 `auto` |
| `supabaseIgnoredInputFields` | string | 입력 데이터를 자동 매핑할 때 제외할 선택적 쉼표 구분 필드 이름 |
| `supabaseRows` | expression | `insert`와 `upsert`를 위한 행 객체의 JSON 배열 |
| `supabaseOnConflict` | expression | `upsert`를 위한 선택적 쉼표 구분 충돌 대상 컬럼. 예: `id` 또는 `tenant_id,email` |
| `supabaseData` | expression | `update`를 위한 갱신할 컬럼 값의 JSON 객체 |

## Credential 설정

[Credentials 탭](../tabs/credentials-tab.md)에서 **Supabase** credential을 생성하고 다음을 입력하십시오:

1. **Project URL**, 예: `https://your-project.supabase.co`
2. 이 Workflow가 사용해야 하는 테이블에 접근할 수 있는 **API key**
3. 선택적 **기본 스키마** (기본값은 `public`)

노드는 `/rest/v1/<table>`의 Supabase PostgREST endpoint와 통신합니다.
`supabaseTable`에는 `users` 또는 `profiles`와 같이 테이블 이름만 지정하십시오. `schema.table`, `rpc/...` 또는 기타 API 경로를 여기에 전달하지 마십시오.

유효한 Supabase credential을 선택하면 편집기에서 PostgREST OpenAPI 메타데이터로부터 노출된 테이블과 테이블 컬럼을 직접 검색할 수 있습니다. **discovered tables** 드롭다운으로 테이블을 선택하고 **Select Columns** 아래의 **column chips**로 select 목록을 빠르게 작성하십시오.

## 작업

| 작업 | 필수 필드 | 설명 |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | 선택적 정확한 일치 필터, limit, 정렬을 사용하여 행 읽기 |
| `insert` | `supabaseTable`, `supabaseRows` 또는 자동 매핑 입력 | 하나 이상의 행 삽입 |
| `update` | `supabaseTable`, `supabaseData` 또는 자동 매핑 입력, `supabaseFilter` | 필터와 일치하는 행 갱신 |
| `upsert` | `supabaseTable`, `supabaseRows` 또는 자동 매핑 입력 | Supabase upsert 시맨틱을 사용하여 행 삽입 또는 병합. 명시적 충돌 대상이 필요할 때 `supabaseOnConflict`를 사용하십시오. |
| `delete` | `supabaseTable`, `supabaseFilter` | 필터와 일치하는 행 삭제 |

## 필터 구문

`supabaseFilter`는 구조화된 JSON을 PostgREST 쿼리 파라미터로 컴파일합니다.

- 정확한 일치: `{"status":"active"}`
- 비교: `{"created_at":{"gte":"2026-01-01"}}`
- 멤버십: `{"status":{"in":["active","paused"]}}`
- 패턴 일치: `{"email":{"ilike":"*@example.com"}}`
- 논리 OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- 논리 AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

동일한 필드에 여러 연산자를 적용할 때는 논리 그룹을 사용하는 것이 좋습니다:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## 페이지네이션

`select`는 이제 PostgREST에 대해 진정한 서버 측 페이지네이션을 수행합니다.

- `supabaseLimit: "0"`은 일치하는 모든 행을 페이지 단위로 가져옵니다
- 1000을 초과하는 `supabaseLimit` 값은 자동으로 여러 요청으로 분할됩니다
- 결과는 하나의 `.rows` 배열로 병합되며 `.count`는 일치하는 총 행 수를 유지합니다

큰 테이블을 읽을 때는 페이지 경계를 예측 가능하게 유지하기 위해 안정적인 `supabaseOrderBy`를 설정하십시오.

## 입력 자동 매핑

`insert`, `upsert`, `update`의 경우, 단일 업스트림 노드가 이미 작성하려는 형태를 출력한다면 노드를 **Auto-map input**으로 전환하십시오.

- 단일 객체는 하나의 행 또는 하나의 update payload가 됩니다
- 객체 배열은 `insert` / `upsert`를 위한 여러 행이 됩니다
- `rows` 배열을 가진 업스트림 객체는 해당 배열을 그대로 재사용합니다
- `supabaseIgnoredInputFields`를 사용하면 `id`, `created_at`, `success` 같은 필드를 제외할 수 있습니다
## 출력 참조

| 출력 필드 | 타입 | 설명 |
|-------------|------|-------------|
| `.rows` | array | 반환된 행 객체 |
| `.count` | number | 반환되거나 영향을 받은 행 수 |
| `.success` | boolean | 작업 성공 여부 |

## 예제 – 활성 사용자 선택

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

출력 접근: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## 예제 – 프로필 행 Upsert

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## 관련 항목

- [노드 타입](../reference/node-types.md) – 모든 노드 타입 개요
- [Credentials 탭](../tabs/credentials-tab.md) – Supabase credentials 추가
- [서드파티 통합](../reference/integrations.md) – 통합 credential 설정

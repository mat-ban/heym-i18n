# BigQuery

**BigQuery** 노드는 BigQuery REST API v2를 통해 SQL 쿼리를 실행하고 Google BigQuery 데이터셋에 행을 삽입합니다. 대규모 분석 데이터셋을 쿼리하거나 Workflow 데이터에서 테이블로 행을 스트리밍하는 데 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | BigQuery (OAuth2) |
| Output | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 BigQuery credential |
| `bqOperation` | string | 작업: `query` 또는 `insertRows` |
| `bqProjectId` | expression | Google Cloud 프로젝트 ID (예: `my-gcp-project`) |
| `bqQuery` | expression | SQL 쿼리 문자열. `query`에 필수입니다. |
| `bqMaxResults` | string | `query`가 반환하는 최대 행 수 (기본값 `1000`). |
| `bqDatasetId` | expression | 데이터셋 ID (예: `my_dataset`). `insertRows`에 필수입니다. |
| `bqTableId` | expression | 테이블 ID (예: `my_table`). `insertRows`에 필수입니다. |
| `bqRowsInputMode` | `raw` \| `selective` | `insertRows`용: **Raw** = 전체 JSON 배열, **Selective** = 단일 행을 키-값 필드 쌍으로 지정. |
| `bqRows` | expression | raw 모드용 행 객체의 JSON 배열 (예: `[{"col": "$input.value"}]`). |
| `bqMappings` | array | selective 모드용 키-값 쌍. 각 키는 컬럼 이름이며, 각 값은 표현식입니다. |

## Credential 설정

BigQuery는 **OAuth2 "Bring Your Own App"** 모델을 사용합니다. 사용자가 직접 Google Cloud OAuth2 credential을 제공합니다.

**백엔드 구성:** Heym 백엔드의 **`FRONTEND_URL`** 을 앱의 공개 URL(사용자가 브라우저에 입력하는 주소)로 설정하십시오. 예: `https://your-heym-domain`. OAuth redirect URI는 항상 `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`입니다.

1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs**로 이동하여 **BigQuery API**를 활성화하십시오.
2. **Credentials** → **Create Credentials** → **OAuth client ID** → **Web application**을 선택하십시오.
3. **Authorized redirect URIs**에 정확히 다음을 추가하십시오: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. **Client ID**와 **Client Secret**을 복사하십시오.
5. Heym Dashboard → **Credentials** → **New** → **BigQuery (OAuth2)** 를 선택하십시오.
6. Client ID, Client Secret, 이름을 입력한 후 **Connect**를 클릭하여 브라우저 팝업에서 OAuth2 동의를 완료하십시오.

Token은 백그라운드에서 자동으로 갱신되므로 수동 Token 관리가 필요하지 않습니다.

## 작업

| 작업 | 필수 필드 | 설명 |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | SQL 쿼리를 실행하고 행을 반환합니다 |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows 또는 bqMappings | streaming insertAll API를 통해 하나 이상의 행을 삽입합니다 |

## 출력 참조

| 작업 | 출력 필드 | 타입 | 설명 |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | 행 객체의 배열 (컬럼 이름 → 값) |
| `query` | `.total` | number | 반환된 행 수 |
| `query` | `.schema` | array | 테이블 스키마 필드 |
| `insertRows` | `.insertedCount` | number | 성공적으로 삽입된 행 수 |
| `insertRows` | `.errors` | array | 행별 삽입 오류 (전체 성공 시 비어 있음) |

## 예제 – 쿼리 실행

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

출력 접근: `$getUsers.rows` (행 객체의 배열), `$getUsers.rows[0].email`, `$getUsers.total`.

## 예제 – 행 삽입

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Credentials Tab](../tabs/credentials-tab.md) – BigQuery OAuth2 credential 추가
- [Google Sheets](./google-sheets-node.md) – 스프레드시트 데이터를 위한 유사한 OAuth2 패턴
- [Third-Party Integrations](../reference/integrations.md) – Integration credential 설정

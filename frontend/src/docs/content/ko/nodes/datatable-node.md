# DataTable

**DataTable** 노드는 Heym DataTable에서 데이터를 읽고, 쓰고, 관리합니다. 외부 자격 증명 없이 자체 구조화 스토리지에 대한 CRUD 작업에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `dataTableId` | UUID | [DataTable 탭](../tabs/datatable-tab.md)에서 선택한 DataTable |
| `dataTableOperation` | string | 작업: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | 행 UUID (getById, update, remove에 사용) |
| `dataTableData` | JSON string | 컬럼 값: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | 필터 (find/upsert/count). `find`와 `count`는 연산자 `{"age": {"$gt": 18}}`를 지원하며, `upsert`는 정확히 일치하는 값 `{"column_name": "value"}`을 사용합니다 |
| `dataTableSort` | string | 정렬 기준 컬럼, 내림차순은 접두사 `-` 사용 |
| `dataTableLimit` | number | 반환할 최대 행 수 (기본값: 100) |

## 작업

| 작업 | 필수 필드 | 설명 |
|-----------|----------------|-------------|
| `find` | dataTableId | 선택적 연산자 필터와 선택적 정렬/제한을 사용하여 일치하는 행을 찾습니다 |
| `getAll` | dataTableId | 선택적 정렬/제한을 사용하여 모든 행을 가져옵니다 |
| `count` | dataTableId | 선택적 연산자 필터와 일치하는 행 수를 셉니다 (데이터베이스에서 계산되며 숫자만 반환합니다) |
| `getById` | dataTableId, dataTableRowId | UUID로 단일 행을 가져옵니다 |
| `insert` | dataTableId, dataTableData | 새 행을 삽입합니다 |
| `update` | dataTableId, dataTableRowId, dataTableData | 행을 업데이트합니다 (데이터를 병합합니다) |
| `remove` | dataTableId, dataTableRowId | 행을 삭제합니다 |
| `upsert` | dataTableId, dataTableFilter, dataTableData | 일치하는 항목이 있으면 업데이트하고, 없으면 삽입합니다 |

## 예제 - 행 찾기

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## 예제 - 행 삽입

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## 예제 - 행 개수 세기

`getAll` → If/Else → Map 대신, 단일 노드에서 조건과 일치하는 행 수를 셉니다.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

결과는 `$activeAdults.count`로 사용할 수 있습니다. 필터가 비어 있거나 생략되면 모든 행을 셉니다.

### find 및 count 필터 연산자

`find` 또는 `count` 필터에서 일반 값은 같음을 의미하며, 객체 값은 연산자를 적용합니다:

| 연산자 | 의미 |
|----------|---------|
| `$eq` (또는 일반 값) | 같음 |
| `$ne` | 같지 않음 |
| `$gt`, `$gte`, `$lt`, `$lte` | 크기/작기 비교 (`number` 타입으로 지정된 컬럼은 숫자, 그 외에는 텍스트) |
| `$contains` | 대소문자를 구분하지 않는 부분 문자열 일치 |
| `$in` | 값이 주어진 배열에 포함됨 |

여러 연산자를 조합한 예: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. 알 수 없는 연산자는 무시됩니다. `upsert` 필터는 업데이트할 행을 찾기 위해 여전히 정확히 일치하는 값을 사용합니다.

행 메타데이터인 `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by`로도 필터링할 수 있으며, 이들은 데이터 내부가 아닌 실제 컬럼으로 저장됩니다. 날짜의 경우 범위 비교를 위해 전체 값을 전달하거나(예: `{"created_at": {"$gt": "2026-06-04"}}`), 부분 텍스트 일치를 위해 `$contains`를 사용하십시오(예: `{"created_at": {"$contains": "2026-06-04"}}`). 사용자 정의 컬럼 중 하나가 메타데이터 필드와 같은 이름인 경우, 데이터 컬럼이 우선합니다.

## 출력 접근

- `$nodeLabel.success` - 불리언 성공 상태
- `$nodeLabel.rows` - 행 배열 (find, getAll)
- `$nodeLabel.row` - 단일 행 객체 (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - 특정 컬럼 값에 접근
- `$nodeLabel.count` - 행 수 (find/getAll의 경우 반환된 행 수, count의 경우 일치하는 전체 행 수)
- `$nodeLabel.id` - 행 UUID (insert, update, remove)
- `$nodeLabel.found` - 불리언 (getById)
- `$nodeLabel.operation` - 작업 이름 (예: `count`, upsert의 경우 `insert`/`update`)

## 자격 증명 불필요

외부 통합과 달리, DataTable은 Heym의 내부 데이터베이스에서 작동합니다. 워크플로우 소유자의 접근 권한이 자동으로 확인됩니다.

## AI Assistant로 빌드

[AI Assistant](../reference/ai-assistant.md#data-tables) 또는 [Chat](../tabs/chat-tab.md)이 이 노드를 빌드할 때, 사용자와 함께 테이블을 선택하거나 생성하고 테이블의 정확한 컬럼 이름을 `dataTableData`와 `dataTableFilter`에 작성합니다.

## 관련 항목

- [DataTable 탭](../tabs/datatable-tab.md) - 테이블 생성 및 관리
- [Grist 노드](./grist-node.md) - 외부 스프레드시트 통합
- [Expression DSL](../reference/expression-dsl.md) - 동적 값에 대한 표현식 구문

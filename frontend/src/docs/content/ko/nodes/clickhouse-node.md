# ClickHouse

**ClickHouse** 노드는 HTTP 인터페이스를 통해 외부 [ClickHouse](https://clickhouse.com/) 데이터베이스에 대해 CRUD, count, raw SQL 작업을 실행합니다. 이를 사용하여 Workflow에서 ClickHouse 테이블에 이벤트를 기록하거나, 분석 데이터를 읽거나 집계하거나, HTTP 요청을 직접 작성하지 않고 임의의 SQL을 실행할 수 있습니다.

## Overview

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | ClickHouse |
| Output | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 ClickHouse credential |
| `clickhouseOperation` | string | 작업: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` 중 하나 |
| `clickhouseTable` | expression | 단순 테이블 이름. `query`를 제외한 모든 작업에서 필수입니다. |
| `clickhouseQuery` | expression | `query`를 위한 raw SQL. `SELECT`/`SHOW`/`DESCRIBE`는 행을 반환하며, 그 외 구문은 명령으로 실행됩니다. |
| `clickhouseFilter` | expression | 동등 필터의 JSON 객체, 예: `{"status":"active"}`. `find`, `count`, `update`, `remove`에서 사용됩니다. 값은 parameterized됩니다. |
| `clickhouseLimit` | string | `find` / `getAll`의 최대 행 수 (`0` = 무제한, LIMIT 절 없음). 기본값 `100`. |
| `clickhouseSort` | expression | `find`를 위한 선택적 `column` 또는 `column ASC\|DESC` |
| `clickhouseRowId` | expression | `getById`에서 테이블의 `id` 컬럼과 매칭되는 값 |
| `clickhouseInputMode` | string | `insert`/`upsert`용: `raw` JSON 배열 모드 또는 `selective` 키/값 필드 모드 |
| `clickhouseData` | expression | `insert`/`upsert`용 행 객체의 JSON 배열, 또는 `update`용 컬럼 값의 JSON 객체 |
| `clickhouseMappings` | array | `clickhouseInputMode`가 `selective`일 때 사용되는 `{key, value}` 쌍 |

## Credential Setup

[Credentials tab](../tabs/credentials-tab.md)에서 **ClickHouse** credential을 생성하고 다음을 설정하십시오:

1. **Host** — 스킴을 제외한 HTTP 호스트, 예: `your-instance.clickhouse.cloud`
2. **Port** — HTTP 인터페이스 포트 (HTTPS는 `8443`, HTTP는 `8123`)
3. **Username** / **Password** — 기본값은 `default`이며 비밀번호는 비어 있습니다
4. **Database** — 기본값은 `default`
5. **Secure** — HTTPS용으로 활성화 (ClickHouse Cloud)

노드는 공식 `clickhouse-connect` HTTP 클라이언트를 통해 연결합니다. 저장하기 전에 credential 대화상자의 **Test connection**을 사용하여 연결 가능 여부를 확인하십시오.

## Operations

| Operation | Required Fields | Description |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | raw SQL 실행. `SELECT`는 `{rows, count}`를 반환하며, 그 외 구문은 `{result}`를 반환합니다. |
| `find` | `clickhouseTable` | 선택적 동등 필터, 정렬, limit을 사용하여 행 읽기 |
| `getAll` | `clickhouseTable` | 필터 없이 limit까지 행 읽기 |
| `count` | `clickhouseTable` | 선택적으로 필터링하여 행 수 계산 |
| `getById` | `clickhouseTable`, `clickhouseRowId` | `id` 컬럼으로 단일 행 읽기 |
| `insert` | `clickhouseTable`, `clickhouseData` 또는 mappings | 하나 이상의 행 삽입 |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | `ALTER TABLE ... UPDATE`를 통해 일치하는 행 업데이트 |
| `remove` | `clickhouseTable`, `clickhouseFilter` | `DELETE FROM`을 통해 일치하는 행 삭제 |
| `upsert` | `clickhouseTable`, `clickhouseData` 또는 mappings | 행 삽입 (`ReplacingMergeTree` 테이블을 가정) |

## Filter Syntax

`clickhouseFilter`는 컬럼 동등 비교의 평면 JSON 객체입니다. 값은 바인딩된 쿼리 파라미터로 전송되므로 injection에 안전합니다.

```json
{ "status": "active", "tenant_id": 42 }
```

이는 `WHERE status = {…:String} AND tenant_id = {…:Int64}`로 컴파일됩니다. 필터 빌더에서는 동등 비교만 지원됩니다 — 범위, 조인, 집계에는 raw SQL과 함께 `query` 작업을 사용하십시오.

## Input Modes (insert / upsert)

- **JSON array** (`raw`): `clickhouseData`에 행 객체의 JSON 배열을 제공합니다. 특정 행에서 누락된 키는 `NULL`로 삽입됩니다. 컬럼 집합은 모든 행의 키 합집합입니다.
- **Key-value** (`selective`): credential과 테이블을 선택하면 에디터가 테이블 컬럼을 검색하여 컬럼당 하나의 값 필드를 생성합니다. 실행당 하나의 행이 삽입되며, 각 값은 표현식을 지원합니다.

## Mutations and ClickHouse Semantics

ClickHouse는 OLAP 데이터베이스이므로 행 수준 쓰기는 OLTP 저장소와 다르게 동작합니다:

- **`update`**는 `ALTER TABLE … UPDATE`를, **`remove`**는 `DELETE FROM`을 실행합니다. 둘 다 **비동기 mutation**입니다 — 최종적으로 적용되며 상대적으로 비용이 많이 듭니다. 빈번한 단일 행 mutation보다 일괄 쓰기를 선호하십시오.
- **`upsert`**는 `INSERT`를 수행합니다. 키 기반 병합 동작을 얻으려면 테이블을 `ReplacingMergeTree` 엔진으로 구성하십시오.
- **`getById`**는 테이블에 `id` 컬럼이 있다고 가정합니다.
- `update`와 `remove`는 전체 테이블 mutation을 방지하기 위해 비어 있지 않은 `clickhouseFilter`가 필요합니다.

## Output Reference

| Output field | Type | Description |
|-------------|------|-------------|
| `.rows` | array | 반환된 행 객체 (`query` SELECT, `find`, `getAll`) |
| `.count` | number | 행 수 (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | 단일 행 또는 `null` (`getById`) |
| `.result` | string | SELECT가 아닌 `query`의 명령 요약 |
| `.success` | boolean | 작업 성공 여부 |
## 예제 – 이벤트 삽입

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## 예제 – 활성 사용자 수 집계

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

출력 접근: `$activeCount.count`.

## 예제 – 일일 보고서 쿼리

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

출력 접근: `$dailyReport.rows`, `$dailyReport.count`.

## 관련 문서

- [노드 유형](../reference/node-types.md) – 모든 노드 유형 개요
- [Credentials 탭](../tabs/credentials-tab.md) – ClickHouse 자격 증명 추가
- [서드파티 통합](../reference/integrations.md) – 통합 자격 증명 설정

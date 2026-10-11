# Grist

**Grist** 노드는 Grist 스프레드시트의 데이터를 읽고, 쓰고, 관리합니다. CRUD 작업, 배치 업데이트, 스프레드시트 자동화에 사용하십시오.

## 개요

| 속성 | 값 |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)의 Grist credential |
| `gristOperation` | string | 작업: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | 문서 ID (Grist URL에서 확인) |
| `gristTableId` | expression | 테이블 ID |
| `gristRecordId` | expression | 레코드 ID (단일 레코드 작업) |
| `gristRecordData` | JSON string | create/update용 필드 값. 레이블이 아닌 **컬럼 ID**(예: `User_Name`)를 사용하십시오. |
| `gristRecordsData` | JSON string | 배치 작업용 레코드 배열 |
| `gristFilter` | JSON string | 필터: `{"Column_ID": [values]}` |
| `gristSort` | string | 정렬: `Column_ID` 또는 `-Column_ID` (내림차순) |
| `gristLimit` | number | 최대 레코드 수 (기본값: 100) |

## 컬럼 ID vs 레이블

`gristRecordData`와 필터에는 표시 레이블이 아닌 **컬럼 ID**(밑줄 사용, 예: `User_Name`)를 사용하십시오. 컬럼 ID를 확인하려면 `listColumns`를 사용하십시오.

## 예제 – 레코드 조회

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## 예제 – 레코드 생성

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## 관련 항목

- [Node Types](../reference/node-types.md) – 모든 노드 타입 개요
- [Credentials Tab](../tabs/credentials-tab.md) – Grist API key 추가
- [Third-Party Integrations](../reference/integrations.md#grist) – Grist credential 설정

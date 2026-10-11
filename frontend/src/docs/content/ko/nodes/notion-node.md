# Notion

**Notion** 노드는 Notion API를 통해 데이터베이스, 데이터 소스, 페이지, 블록을 관리합니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| Credential | 내부 통합 Token 또는 Notion OAuth |
| API 버전 | `2026-03-11` |

Notion의 데이터베이스 스타일 컬렉션은 최신 API 버전에서 **데이터 소스 ID**를 사용합니다. 노드를 실행하기 전에 Workflow에 필요한 모든 페이지 또는 데이터 소스를 통합에 공유하십시오.
리소스 필드는 원시 Notion ID 또는 전체 Notion URL을 허용합니다. URL은 API 요청 전에 내장된 리소스 ID로 정규화됩니다.

## 작업

| 작업 | 필수 필드 | 주요 출력 |
|-----------|-----------------|-------------|
| Search | 선택적 query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID 또는 Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, Properties/Icon/Cover 중 하나 | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | `parent`를 포함한 Database 요청 | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, 비어 있지 않은 Database 요청 | `.database`, `.id`, `.url` |
| Create Data Source | `parent`와 비어 있지 않은 `properties`를 포함한 Data Source 요청 | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, 비어 있지 않은 Data Source 요청 | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block 또는 Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update 객체 | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block 또는 Page ID, Children | `.results`, `.count` |

모든 작업은 `.success`와 `.operation`도 함께 반환합니다.

## JSON 필드

Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon, Cover 필드는 Notion API JSON을 허용합니다. JSON 문자열 내부의 표현식은 요청 전에 해석됩니다. 필드는 `$input.database`, `$input.properties`, `$input.children`과 같이 필요한 객체 또는 배열로 직접 해석되는 단일 표현식일 수도 있습니다.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

페이지 또는 블록 콘텐츠의 경우 Children은 Notion 블록 객체의 배열입니다:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## 데이터베이스와 데이터 소스

최신 Notion API에서 **데이터베이스**는 컨테이너이고, **데이터 소스**는 속성 스키마와 쿼리 가능한 행을 보유합니다. Retrieve Database는 데이터베이스의 `data_sources` 목록을 반환합니다. 해당 ID 중 하나를 Retrieve Data Source 또는 Query Data Source와 함께 사용하십시오.

Create Database는 Notion의 Create a database Endpoint에서 제공하는 완전한 요청 객체를 허용합니다. 이 객체는 `parent`를 반드시 포함해야 하며, `title`, `description`, `is_inline`, `initial_data_source`, `icon`, `cover`를 포함할 수 있습니다. 예를 들어:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database는 `parent`, `title`, `description`, `is_inline`, `icon`, `cover`, `in_trash`, `is_locked`를 포함한 update Endpoint의 요청 객체를 허용합니다. Database ID 필드는 원시 ID, 전체 Notion URL 또는 표현식을 허용합니다.

Create Page properties 객체를 구성하기 전에 **Retrieve Data Source**를 사용하여 데이터 소스의 `properties` 스키마를 가져오십시오. **Create Data Source**는 parent database 객체와 비어 있지 않은 `properties` 스키마를 필요로 합니다. **Update Data Source**는 해당 Notion Endpoint에서 지원하는 비어 있지 않은 요청 객체를 허용합니다.

예를 들어, 기존 데이터베이스 내에 데이터 소스를 생성합니다:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Data Source 및 Parent Page 선택기는 짧은 디바운스와 cursor 기반 **Load more** 페이지네이션을 통한 서버 측 검색을 지원합니다. Notion에서 새 리소스를 공유한 후에는 **Refresh**를 사용하십시오. **Use expression**으로 전환하여 표현식, 원시 ID 또는 URL을 입력할 수 있습니다.

`{"property":"object","value":"database"}`를 사용하는 이전 튜토리얼의 Search 필터는 최신 `data_source` 값으로 변환됩니다. 새 Workflow에서는 `data_source` 또는 `page`를 직접 사용하십시오.

Append Blocks는 **Start**, **End**, **After Block** 위치를 지원합니다. Create Page와 Append Blocks는 Notion의 요청당 제한을 충족하기 위해 100개를 초과하는 최상위 children을 순서가 지정된 요청으로 자동 분할합니다.

속도 제한 요청(`429` 또는 `529`)은 최대 세 번 재시도됩니다. Heym은 Notion의 `Retry-After` 헤더를 준수하며, 각 대기를 최대 10초로 제한하고 무작위 지터를 추가합니다. Notion 요청은 페이지와 Workflow 노드 전반에 걸쳐 프로세스 전역 HTTP 연결 풀을 공유합니다.
## Notion API 제한 사항

- 단일 rich-text `text.content` 값은 최대 2,000자까지 포함할 수 있습니다. 더 긴 텍스트는 여러 개의 rich-text 객체로 분할하십시오.
- Notion은 요청당 최상위 블록 자식을 100개로 제한합니다. Heym은 더 큰 Children 배열을 배치 처리하지만, 각 개별 블록은 여전히 Notion의 Payload 제한을 충족해야 합니다.
- API는 한 요청에서 최대 두 단계의 중첩 블록 자식만 허용합니다. 더 깊은 구조는 후속 Append Blocks 작업으로 생성하십시오.
- 요청 Payload는 최대 1,000개의 블록 요소와 전체 500 KB로 제한됩니다.

## 페이지네이션

Search, Query Data Source, Get Block Children은 1에서 100 사이의 페이지 크기와 선택적 시작 커서를 허용합니다. 페이지 크기를 `0`으로 설정하면 커서를 자동으로 따라가며 모든 결과를 병합합니다(노드의 10,000개 결과 안전 제한까지).

## Credential 설정

Credential 대화 상자에서 두 가지 설정 중 하나를 선택하십시오(**Internal token** 또는 **OAuth**):

- **Internal token:** 내부 integration을 생성하고 해당 token을 Heym에 복사한 다음, 필요한 각 페이지 또는 data source를 integration과 공유하십시오. **Test Connection**을 사용하여 접근 권한을 확인하십시오.
- **OAuth:** 공개 Notion integration을 생성하고 Notion에 `{FRONTEND_URL}/api/credentials/notion/oauth/callback`을 등록하십시오. Heym credential 대화 상자에서 **OAuth**를 선택하고 integration의 Client ID와 Client Secret을 입력한 다음, **Connect**를 클릭하여 workspace를 인증하십시오. Secret은 credential과 함께 암호화되어 저장되며 OAuth state나 환경 구성에 포함되지 않습니다. 인증 후 credential은 연결된 workspace 이름(`connected (Workspace Name)`)을 표시합니다. 대기 중인 OAuth credential은 `Not connected`를 표시합니다.

편집 중에 internal token 필드를 비워 두면 저장된 token이 유지됩니다.

사용자 정의 [HTTP](../nodes/http-node.md) 요청의 경우, `$credentials.YourNotionCredential`은 Notion 노드가 사용하는 것과 동일한 bearer token(internal token 또는 OAuth access token)으로 확인됩니다.

## API 버전 참고 사항

Heym은 Notion 요청을 API 버전 `2026-03-11`로 고정합니다. 이 버전은 다음을 사용합니다:

- 레거시 database-query 경로 대신 `data_source_id` 부모 및 `/data_sources` Endpoint
- 페이지 휴지통/복원 작업에 `archived` 대신 `in_trash`
- Append Block Children에 `position` 객체(`start`, `end`, `after_block`)

이전 Notion 자동화 예제를 마이그레이션할 때:

- database 부모/쿼리 참조를 **Retrieve Database** 또는 편집기 data-source 선택기에서 가져온 data source ID로 교체하십시오
- `archived: true`를 `in_trash: true`로 교체하십시오
- append `after` 파라미터를 노드의 **Append Position** 필드로 교체하십시오

여전히 객체 값 `database`를 사용하는 검색 필터는 자동으로 `data_source`로 정규화됩니다.

## 관련 항목

- [Credentials](../reference/credentials.md)
- [Third-Party Integrations](../reference/integrations.md)
- [Node Types](../reference/node-types.md)

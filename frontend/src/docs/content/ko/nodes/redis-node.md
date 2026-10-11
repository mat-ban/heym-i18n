# Redis

**Redis** 노드는 Redis 작업(set, get, 키 존재 여부 확인, delete)을 수행합니다. 캐싱, 속도 제한(rate limiting), 키-값 저장소로 활용할 수 있습니다.

## 개요

| 속성 | 값 |
|----------|-------|
| 입력 | 1 |
| 출력 | 1 |
| 출력값 | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## 파라미터

| 파라미터 | 타입 | 설명 |
|-----------|------|-------------|
| `credentialId` | UUID | [Credentials](../tabs/credentials-tab.md)에서 발급받은 Redis credential |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | 작업 유형 |
| `redisKey` | expression | Redis 키 (표현식 지원) |
| `redisValue` | expression | set 작업에 사용할 값 |
| `redisTtl` | number | TTL(초 단위, set 전용, 선택 사항) |

## 작업

| 작업 | 필수 항목 | 출력 |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## 예시 – 캐시

```json
{
  "type": "redis",
  "data": {
    "label": "cacheResponse",
    "credentialId": "redis-credential-uuid",
    "redisOperation": "set",
    "redisKey": "cache:$userInput.body.userId",
    "redisValue": "$apiResponse.body",
    "redisTtl": 3600
  }
}
```

## 예시 – Get

```json
{
  "type": "redis",
  "data": {
    "label": "getCache",
    "credentialId": "redis-credential-uuid",
    "redisOperation": "get",
    "redisKey": "cache:$userInput.body.userId"
  }
}
```

## 관련 문서

- [Node Types](../reference/node-types.md) – 모든 노드 유형 개요
- [Credentials Tab](../tabs/credentials-tab.md) – Redis credential 추가
- [Third-Party Integrations](../reference/integrations.md#redis) – Redis credential 설정
- [Credentials Sharing](../reference/credentials-sharing.md) – credential 공유

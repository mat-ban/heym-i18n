# Redis

O nó **Redis** executa operações no Redis: set, get, verificação de existência de chave e exclusão. Utilize-o para caching, rate limiting e armazenamento de chave-valor.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial Redis em [Credentials](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipo de operação |
| `redisKey` | expression | Chave Redis (suporta expressões) |
| `redisValue` | expression | Valor para a operação set |
| `redisTtl` | number | TTL em segundos (apenas para set, opcional) |

## Operações

| Operação | Obrigatório | Saída |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Exemplo – Cache

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

## Exemplo – Get

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

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Credentials Tab](../tabs/credentials-tab.md) – Adicionar credenciais Redis
- [Third-Party Integrations](../reference/integrations.md#redis) – Configuração de credencial Redis
- [Credentials Sharing](../reference/credentials-sharing.md) – Compartilhar credenciais

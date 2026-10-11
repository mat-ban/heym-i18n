# Redis

O nó **Redis** executa operações Redis: definir, obter, verificar a existência de chave e excluir. Utilize-o para cache, limitação de taxa e armazenamento de chave-valor.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Saída | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial Redis em [Credenciais](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Tipo de operação |
| `redisKey` | expression | Chave Redis (suporta expressões) |
| `redisValue` | expression | Valor para a operação set |
| `redisTtl` | number | TTL em segundos (apenas set, opcional) |

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

- [Tipos de nó](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Aba Credenciais](../tabs/credentials-tab.md) – Adicionar credenciais Redis
- [Integrações de terceiros](../reference/integrations.md#redis) – Configuração de credenciais Redis
- [Compartilhamento de credenciais](../reference/credentials-sharing.md) – Compartilhar credenciais
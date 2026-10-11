# Redis

Le nœud **Redis** exécute des opérations Redis : set, get, vérification de l'existence d'une clé et suppression. Utilisez-le pour la mise en cache, la limitation de débit et le stockage clé-valeur.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.value`, `$nodeLabel.success`, `$nodeLabel.exists`, `$nodeLabel.deleted` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant Redis depuis [Identifiants](../tabs/credentials-tab.md) |
| `redisOperation` | `"set"` \| `"get"` \| `"hasKey"` \| `"deleteKey"` | Type d'opération |
| `redisKey` | expression | Clé Redis (prend en charge les expressions) |
| `redisValue` | expression | Valeur pour l'opération set |
| `redisTtl` | number | TTL en secondes (set uniquement, facultatif) |

## Opérations

| Opération | Requis | Sortie |
|-----------|----------|--------|
| `set` | key, value | `success`, `key`, `ttl` |
| `get` | key | `value`, `exists`, `key` |
| `hasKey` | key | `exists`, `key` |
| `deleteKey` | key | `deleted`, `key` |

## Exemple – Cache

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

## Exemple – Get

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

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des identifiants Redis
- [Intégrations tierces](../reference/integrations.md#redis) – Configuration des identifiants Redis
- [Partage d'identifiants](../reference/credentials-sharing.md) – Partager des identifiants

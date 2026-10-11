# Throw Error

Le nœud **Throw Error** arrête immédiatement l'exécution du workflow et renvoie une réponse d'erreur avec un code de statut HTTP personnalisé. Utilisez-le pour les échecs de validation, les accès non autorisés ou d'autres conditions d'erreur.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 0 |
| Sortie | Le workflow s'arrête ; une réponse d'erreur est renvoyée à l'appelant |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `errorMessage` | expression | Message d'erreur (prend en charge les expressions) |
| `httpStatusCode` | number | Code de statut HTTP (ex. 400, 401, 403, 404, 429, 500) |

## Codes de statut courants

| Code | Cas d'usage |
|------|----------|
| 400 | Bad Request (entrée invalide) |
| 401 | Unauthorized (authentification requise) |
| 403 | Forbidden (accès refusé) |
| 404 | Not Found (ressource manquante) |
| 422 | Unprocessable Entity (erreur de validation) |
| 429 | Too Many Requests (limite de débit) |
| 500 | Internal Server Error |

## Exemple

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Utilisez-le avec [Condition](./condition-node.md) pour valider l'entrée et ne lever une erreur que si elle est invalide :
- Condition vraie → continuer vers Output
- Condition fausse → Throw Error

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Condition Node](./condition-node.md) – Valider avant de lever une erreur
- [Error Handler](./error-handler-node.md) – Intercepter les erreurs provenant d'autres nœuds

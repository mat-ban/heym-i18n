# Error Handler

Le nœud **Error Handler** intercepte les erreurs provenant de n'importe quel nœud du workflow. Lorsqu'il est présent, il s'exécute automatiquement dès qu'un nœud échoue. Aucune connexion entrante n'est nécessaire : il est déclenché par le moteur du workflow.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 (déclenché en cas d'erreur) |
| Sorties | 1 |
| Sortie | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `message` | expression | Facultatif. Valeur par défaut : `$error.message` |

## Contexte d'erreur

Lorsque l'Error Handler s'exécute, les champs suivants sont disponibles :

| Champ | Description |
|-------|-------------|
| `$errorHandler.error` | Chaîne du message d'erreur |
| `$errorHandler.errorNode` | Label du nœud qui a échoué |
| `$errorHandler.errorNodeType` | Type du nœud en échec |
| `$errorHandler.timestamp` | Moment où l'erreur s'est produite |

## Cas d'usage

- Envoyer des notifications [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou [Send Email](./send-email-node.md) en cas d'échec
- Journaliser les erreurs vers des systèmes externes
- Renvoyer une réponse d'erreur personnalisée via [Output](./output-node.md)

Un seul Error Handler par workflow.

## Exemple

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Connectez-le à Output pour une réponse d'erreur personnalisée :
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Ou connectez-le à Slack pour les notifications :
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Telegram Node](./telegram-node.md) – Notifier en cas d'erreur
- [Slack Node](./slack-node.md) – Notifier en cas d'erreur
- [Send Email Node](./send-email-node.md) – Alertes par e-mail
- [Throw Error Node](./throw-error-node.md) – Erreurs intentionnelles

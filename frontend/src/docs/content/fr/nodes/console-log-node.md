# Console Log

Le nœud **Console Log** journalise une valeur dans la console du backend (serveur). Utilisez-le pour le débogage et l'inspection pendant le développement.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | Transmet l'entrée |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `logMessage` | expression | Valeur à journaliser. Prend en charge les [expressions](../reference/expression-dsl.md). |

## Exemple

```json
{
  "type": "consoleLog",
  "data": {
    "label": "debugOutput",
    "logMessage": "$userInput.body"
  }
}
```

La sortie apparaît dans les logs du serveur (par exemple la sortie du terminal lors de l'exécution de `uvicorn`).

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Logs Tab](../tabs/logs-tab.md) – Consulter les logs de l'application

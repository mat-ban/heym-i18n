# Execute

Le nœud **Execute** appelle un autre workflow (sous-workflow) et lui transmet une entrée. Utilisez-le pour de la logique réutilisable, et non pour de la transformation de données — utilisez [Set](./set-node.md) pour cela.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `executeWorkflowId` | UUID | ID du workflow à exécuter |
| `executeInput` | expression | Entrée unique (pour les workflows disposant d'un seul champ d'entrée) |
| `executeInputMappings` | array | `{ key, value }` pour plusieurs entrées. `key` = nom du champ d'entrée du workflow cible. |
| `executeDoNotWait` | boolean | Lorsque `true`, dispatche le sous-workflow en arrière-plan sans attendre. Sortie : `{ "status": "dispatched", "workflow_id": "..." }`. Valeur par défaut : `false`. |

## Format de réponse

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Ne pas attendre

Lorsque `executeDoNotWait: true`, le nœud dispatche le sous-workflow vers un thread en arrière-plan et retourne immédiatement :

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Le workflow parent passe au nœud suivant sans attendre. L'enregistrement d'exécution du sous-workflow est écrit dans la trace de manière asynchrone lorsqu'il se termine. Utilisez cette option lorsque le résultat du sous-workflow n'est pas nécessaire en aval.

## Entrée unique

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Entrées multiples

Lorsque le workflow cible dispose de plusieurs champs d'entrée, utilisez `executeInputMappings` :
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

La `key` doit correspondre aux clés `inputFields` du nœud [Input](./input-node.md) du workflow cible.

## Voir aussi

- [Fonctionnalités du Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow pour créer des nœuds Execute à partir des nœuds sélectionnés
- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Input](./input-node.md) – Champs d'entrée du workflow cible
- [Nœud Set](./set-node.md) – Transformation de données (et non appels de workflow)

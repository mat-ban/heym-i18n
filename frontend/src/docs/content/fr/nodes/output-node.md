# Output

Le nœud **Output** est le point de terminaison du Workflow qui renvoie la réponse à l'appelant. Référencez toujours le nœud précédent par son label — n'utilisez jamais `$input`.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 (facultatif, pour le post-traitement asynchrone) |
| Sortie | Renvoie `message` à l'appelant |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `message` | expression | Valeur de sortie. **Doit** référencer le nœud précédent : `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Si true, les nœuds situés après l'output s'exécutent de manière asynchrone après l'envoi de la réponse |

## Utilisation comme outil d'Agent

Lorsqu'un nœud Output est connecté à un [Nœud Agent](./agent-node.md) en tant qu'outil de nœud sur le canvas, le champ `message` peut être marqué comme **fourni par l'agent** à l'aide de l'icône bot. L'agent fournit alors le message lorsqu'il appelle l'outil. Si le nœud Output n'est pas connecté en tant qu'outil d'agent, l'icône bot est masquée.

## Règle essentielle

**N'utilisez jamais `$input` dans le nœud output.** Utilisez toujours le label du nœud précédent :

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (où `processData` est le label du nœud précédent)

## Post-traitement asynchrone

Lorsque `allowDownstream: true`, la réponse est renvoyée immédiatement. Les nœuds connectés après l'output s'exécutent en arrière-plan (par exemple, notifications Slack, journalisation). Comme la branche aval peut se terminer plus tard, une défaillance en aval peut faire passer le statut d'exécution enregistré à `error` après que la réponse anticipée a déjà été renvoyée ; l'historique et les analyses finaux reflètent ce résultat ultérieur.

## Exemple

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Exemple – Avec asynchrone

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Connectez ensuite un nœud [Telegram](./telegram-node.md), [Slack](./slack-node.md) ou autre après l'output pour des notifications fire-and-forget.

## Voir aussi

- [Mappeur de sortie JSON](./json-output-mapper-node.md) – Corps JSON racine sans encapsulation `result` lorsqu'il est le seul terminal
- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [DSL d'expression](../reference/expression-dsl.md) – Référencement de la sortie d'un nœud
- [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct pour le message
- [Structure du Workflow](../reference/workflow-structure.md) – Format JSON

# Set

Le nœud **Set** transforme et mappe les données d'entrée vers une sortie personnalisée. Utilisez-le pour la mise en majuscules, l'extraction de sous-chaînes, la concaténation, la génération de nombres aléatoires et toute autre transformation de données—mais pas pour appeler des workflows (utilisez [Execute](./execute-node.md) pour cela).

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.keyName` pour chaque clé de mapping |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `mappings` | array | Paires clé-valeur. Chacune : `{ key, value }` où `value` est une [expression](../reference/expression-dsl.md) |

## Utilisation comme outil d'agent

Lorsqu'un nœud Set est connecté à un [Nœud Agent](./agent-node.md) en tant qu'outil de canvas, chaque valeur de mapping peut être marquée comme **fournie par l'agent** à l'aide de l'icône bot. Les valeurs de mapping marquées deviennent des paramètres d'outil que l'agent renseigne à l'exécution. Les mappings non marqués restent figés dans la configuration du nœud.

L'icône bot n'apparaît que lorsque le nœud Set est connecté à la poignée des outils d'un agent. Un nœud Set autonome n'affiche pas les contrôles de type « fourni par l'agent ».

## Règles d'expression

- Référencez les nœuds précédents : `$nodeName.text`, `$nodeName.body.field`
- Utilisez les fonctions : `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` exclut `b` ; renvoie une erreur si `a > b`.
- Un seul `$` au début de l'expression—jamais à l'intérieur des parenthèses
- Accédez à la sortie par clé : `$setNode.randomNumber`, `$setNode.text`

## Exemple

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Les nœuds en aval y accèdent via `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Voir aussi

- [Mappeur de sortie JSON](./json-output-mapper-node.md) – Mappings identiques ; seul terminal renvoyant le JSON racine pour les webhooks/exécutions
- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Execute](./execute-node.md) – Appeler des workflows (et non transformer des données)
- [Expression DSL](../reference/expression-dsl.md) – Fonctions et syntaxe
- [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct et navigation Précédent/Suivant pour les mappings

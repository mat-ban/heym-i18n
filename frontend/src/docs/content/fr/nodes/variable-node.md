# Variable

Le nœud **Variable** définit ou met à jour une variable accessible depuis n'importe quel nœud via `$vars.variableName` (locale au workflow) ou `$global.variableName` (persistante). Utilisez-le pour les compteurs, les listes accumulées et l'état partagé à travers le workflow.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.value`, ou accès via `$vars.variableName` / `$global.variableName` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `variableName` | string | Nom de la variable (utilisé comme `$vars.variableName` ou `$global.variableName`). Évitez les [noms réservés](../reference/expression-dsl.md). |
| `variableValue` | expression | Valeur à définir. Prend en charge les expressions. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Conversion de type (par défaut : auto) |
| `isGlobal` | boolean | Lorsque `true`, stocke dans le [Global Variable Store](../reference/global-variables.md) (persistant, limité à l'utilisateur). Lorsque `false` ou omis, locale au workflow (en mémoire). |

## Variables de type tableau

Initialisez les tableaux avec `$array()` ou `$array("a", "b")` dans un nœud Variable avant d'utiliser `.add()` :

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Ajoutez ensuite des éléments (sans `$` à l'intérieur des parenthèses) :

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Règle critique

**N'utilisez jamais `$` à l'intérieur des parenthèses de méthode :**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – casse l'expression

## Exemple – Compteur

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Loop](./loop-node.md) – Collecter des éléments avec Variable dans le corps de la boucle
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, noms réservés
- [Variables globales](../reference/global-variables.md) – Variables persistantes avec `isGlobal`

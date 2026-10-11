# Condition

Le nœud **Condition** oriente le workflow selon une expression if/else. Il dirige l'exécution vers le chemin true ou false en fonction du résultat.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 2 (true, false) |
| Sortie | Transmet l'entrée vers la branche choisie |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `condition` | expression | Expression de type JavaScript (ex. `$input.text.length > 0`) |

## Poignées de connexion (Edge Handles)

- **Poignée source `true`** – lorsque la condition est évaluée comme vraie (truthy)
- **Poignée source `false`** – lorsque la condition est évaluée comme fausse (falsy)

## Opérateurs d'expression

Prend en charge : `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, etc. Consultez la [Expression DSL](../reference/expression-dsl.md).

## Exemple

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Connectez les edges avec `sourceHandle: "true"` ou `sourceHandle: "false"` pour router vers différentes branches.

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Switch Node](./switch-node.md) – Routage multi-directionnel par valeur
- [Expression DSL](../reference/expression-dsl.md) – Syntaxe des conditions
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct pour la condition

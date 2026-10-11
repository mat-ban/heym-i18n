# Loop

Le nœud **Loop** itère sur un tableau, en exécutant les nœuds en aval pour chaque élément. Une back-connection depuis le dernier nœud du corps de l'itération est requise pour avancer.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 2 (par défaut + loop back) |
| Sorties | 2 (loop, done) |
| Sortie | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `arrayExpression` | expression | Expression qui se résout en un tableau (ex. `$input.items`) |

## Poignées de connexion

- **Source `loop`** – Se connecte aux nœuds qui traitent chaque élément (s'exécute à chaque itération)
- **Source `done`** – Se connecte aux nœuds qui s'exécutent une fois toutes les itérations terminées
- **Cible default** – Reçoit les données initiales contenant le tableau
- **Cible `loop`** – Reçoit la back-connection depuis le dernier nœud du corps de l'itération

## Contexte de la boucle (dans le corps de l'itération)

- `$loopNode.item` – Élément courant
- `$loopNode.index` – Index basé sur 0
- `$loopNode.total` – Nombre total d'éléments
- `$loopNode.isFirst` – Booléen
- `$loopNode.isLast` – Booléen

## Règles critiques

1. **Back-connection requise :** Le dernier nœud du corps de l'itération DOIT se reconnecter à la poignée d'entrée `loop` de la boucle.
2. **Aucune sortie dans le corps de la boucle :** Les nœuds [Output](./output-node.md) sont interdits à l'intérieur du corps de la boucle. Utilisez [Set](./set-node.md) ou [Variable](./variable-node.md) pour les résultats intermédiaires.
3. **Aucun résultat automatique :** La boucle ne collecte pas les résultats. Utilisez des nœuds Variable avec `$array()` et `.add()` pour accumuler.

## Exemple

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flux : loop → nœud de traitement → (retour à loop) → loop → branche done → output.

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Variable](./variable-node.md) – Collecter des éléments dans une boucle
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, méthodes de tableau

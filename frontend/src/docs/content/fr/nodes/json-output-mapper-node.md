# Mappeur de sortie JSON

Le nœud **Mappeur de sortie JSON** construit un objet JSON à partir de [mappings](./set-node.md) clé/valeur (même modèle que [Set](./set-node.md)). Utilisez-le lorsque les appelants doivent recevoir un **corps JSON brut** à la racine de la réponse.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 0 (sink) |
| Sortie d'exécution | Objet construit à partir de `mappings` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `mappings` | array | Entrées `{ "key": "fieldName", "value": "expression" }` (identiques à Set) |

## Utilisation comme outil d'agent

Non pris en charge. Ce nœud est un sink terminal, il ne peut donc pas être rattaché à une poignée d'outils d'un [Nœud Agent](./agent-node.md). Utilisez un nœud [Set](./set-node.md) lorsqu'un agent doit façonner des valeurs en cours de conversation.

## Comportement Webhook et exécution

Lorsque ce nœud est la **seule** sortie terminale du workflow, les **outputs** de l'exécution correspondent à l'objet mappé lui-même : les clés issues de `mappings` apparaissent au **niveau supérieur** du JSON. Il n'y a **aucun** wrapper externe indexé par le label du nœud et **aucun** objet `{ "result": ... }` (contrairement au nœud [Output](./output-node.md)).

Si plusieurs nœuds terminaux produisent des sorties (par exemple [Output](./output-node.md) plus le mappeur de sortie JSON, ou plusieurs branches), Heym utilise la forme habituelle : chaque terminal est indexé par son `label`.

## Restriction de boucle

Même règle que pour [Output](./output-node.md) : ne placez pas ce nœud à l'intérieur d'une branche d'itération de boucle—uniquement après la branche `done` de la boucle. Voir [Loop](./loop-node.md).

## Exemple

```json
{
  "type": "jsonOutputMapper",
  "data": {
    "label": "apiPayload",
    "mappings": [
      { "key": "message", "value": "$llm.text" },
      { "key": "ok", "value": "true" }
    ]
  }
}
```

## Voir aussi

- [Set](./set-node.md) – Même mécanique de mapping pour les transformations intermédiaires
- [Output](./output-node.md) – Réponse basée sur un message ou un schéma avec wrapper `result`
- [Node Types](../reference/node-types.md) – Tous les types de nœuds
- [Workflow Structure](../reference/workflow-structure.md) – Format JSON de workflow
- [Webhooks](../reference/webhooks.md) – Endpoint d'exécution et réponses

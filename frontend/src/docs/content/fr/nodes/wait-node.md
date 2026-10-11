# Wait

Le nœud **Wait** suspend l'exécution du workflow pendant une durée spécifiée. Utilisez-le pour la limitation de débit, les actions différées ou les intervalles de polling.

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
| `duration` | number | Délai en millisecondes (ex. 1000 = 1 seconde). L'éditeur accepte une valeur de 1 à 900000 (15 minutes) |

## Exemple

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Voir aussi

- [Types de nœuds](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Nœud Loop](./loop-node.md) – Utilisez Wait à l'intérieur des boucles pour la limitation de débit

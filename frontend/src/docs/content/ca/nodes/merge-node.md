# Merge

El node **Merge** espera múltiples entrades paral·leles i les combina en una única sortida. Utilitzeu-lo quan necessiteu unir resultats de branques paral·leles abans de continuar.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | n (configurable) |
| Sortides | 1 |
| Sortida | `$nodeLabel.merged` – objecte amb les entrades de cada branca |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `inputCount` | number | Nombre d'entrades a esperar (per defecte: 2) |

## Quan utilitzar-lo

- Utilitzeu-lo quan necessiteu **combinar** o **unir** resultats de branques paral·leles
- **No** l'utilitzeu per a workflows paral·lels que acaben amb nodes [Output](./output-node.md) separats
- Cada branca d'entrada contribueix a la sortida combinada

## Exemple

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Connecteu múltiples branques al node merge. El node espera totes les entrades abans de produir la sortida.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Parallel Execution](../reference/parallel-execution.md) – Com s'executen les branques paral·leles
- [Workflow Structure](../reference/workflow-structure.md) – Edges i handles
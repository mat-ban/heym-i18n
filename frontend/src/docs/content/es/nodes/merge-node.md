# Merge

El nodo **Merge** espera múltiples entradas paralelas y las combina en una única salida. Utilícelo cuando necesite unir resultados de ramas paralelas antes de continuar.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | n (configurable) |
| Salidas | 1 |
| Salida | `$nodeLabel.merged` – objeto con las entradas de cada rama |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `inputCount` | number | Número de entradas que se deben esperar (predeterminado: 2) |

## Cuándo utilizarlo

- Utilícelo cuando necesite **combinar** o **unir** resultados de ramas paralelas
- **No** lo utilice para workflows paralelos que terminan con nodos [Output](./output-node.md) separados
- Cada rama de entrada contribuye a la salida combinada

## Ejemplo

```json
{
  "type": "merge",
  "data": {
    "label": "combineResults",
    "inputCount": 2
  }
}
```

Conecte múltiples ramas al nodo merge. El nodo espera todas las entradas antes de producir la salida.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Ejecución paralela](../reference/parallel-execution.md) – Cómo se ejecutan las ramas paralelas
- [Estructura del workflow](../reference/workflow-structure.md) – Edges y handles
# Switch

El nodo **Switch** enruta la ejecución hacia diferentes rutas basándose en la coincidencia de un valor con distintos casos. Admite N casos más un caso predeterminado.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | n (una por caso + predeterminada) |
| Salida | Transfiere la entrada a la rama coincidente |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `expression` | expression | Valor a evaluar (ej.: `$input.category`) |
| `cases` | string[] | Valores de caso a comparar (ej.: `["case1", "case2", "case3"]`) |

## Handles de conexión

- Cada caso obtiene un handle de origen (índice 0, 1, 2, …)
- Handle predeterminado para valores que no coinciden

## Ejemplo

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Conecte las aristas con `sourceHandle` establecido al índice del caso (0, 1, 2) o al handle predeterminado para valores que no coinciden.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Condition](./condition-node.md) – Bifurcación if/else
- [DSL de expresiones](../reference/expression-dsl.md) – Sintaxis de expresiones
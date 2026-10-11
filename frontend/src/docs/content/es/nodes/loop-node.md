# Loop

El nodo **Loop** itera sobre un array, ejecutando los nodos posteriores para cada elemento. Requiere una retroconexión desde el último nodo del cuerpo de iteración para avanzar.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 2 (predeterminada + retorno del loop) |
| Salidas | 2 (loop, done) |
| Salida | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `arrayExpression` | expression | Expresión que se resuelve en un array (ej.: `$input.items`) |

## Handles de conexión

- **Origen `loop`** – Conecta con los nodos que procesan cada elemento (se ejecuta por iteración)
- **Origen `done`** – Conecta con los nodos que se ejecutan después de completar todas las iteraciones
- **Destino predeterminado** – Recibe los datos iniciales que contienen el array
- **Destino `loop`** – Recibe la retroconexión desde el último nodo del cuerpo de iteración

## Contexto del loop (en el cuerpo de iteración)

- `$loopNode.item` – Elemento actual
- `$loopNode.index` – Índice basado en 0
- `$loopNode.total` – Total de elementos
- `$loopNode.isFirst` – Booleano
- `$loopNode.isLast` – Booleano

## Reglas críticas

1. **Retroconexión obligatoria:** El último nodo del cuerpo de iteración DEBE conectarse de vuelta al handle de entrada `loop` del loop.
2. **Sin salida en el cuerpo del loop:** Los nodos [Output](./output-node.md) están prohibidos dentro del cuerpo del loop. Utilice [Set](./set-node.md) o [Variable](./variable-node.md) para resultados intermedios.
3. **Sin resultados automáticos:** El loop no recopila resultados. Utilice nodos Variable con `$array()` y `.add()` para acumular.

## Ejemplo

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flujo: loop → nodo de procesamiento → (retorno al loop) → loop → rama done → salida.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Variable](./variable-node.md) – Recopilar elementos en un loop
- [DSL de expresiones](../reference/expression-dsl.md) – `item`, `index`, métodos de array
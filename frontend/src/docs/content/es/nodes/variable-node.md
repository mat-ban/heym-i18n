# Variable

El nodo **Variable** establece o actualiza una variable accesible desde cualquier nodo mediante `$vars.variableName` (local del workflow) o `$global.variableName` (persistente). Utilícelo para contadores, listas acumuladas y estado compartido a lo largo del workflow.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.value`, o acceda mediante `$vars.variableName` / `$global.variableName` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `variableName` | string | Nombre de la variable (utilizado como `$vars.variableName` o `$global.variableName`). Evite los [nombres reservados](../reference/expression-dsl.md). |
| `variableValue` | expression | Valor a establecer. Admite expresiones. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Conversión de tipo (predeterminado: auto) |
| `isGlobal` | boolean | Cuando es `true`, almacena en el [Global Variable Store](../reference/global-variables.md) (persistente, con alcance de usuario). Cuando es `false` u omitido, es local del workflow (en memoria). |

## Variables de tipo array

Inicialice los arrays con `$array()` o `$array("a", "b")` en un nodo Variable antes de utilizar `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

A continuación, agregue elementos (sin `$` dentro de los paréntesis):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Regla crítica

**Nunca utilice `$` dentro de los paréntesis de un método:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – rompe la expresión

## Ejemplo – Contador

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

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Loop](./loop-node.md) – Recopile elementos con Variable en el cuerpo del bucle
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, nombres reservados
- [Variables globales](../reference/global-variables.md) – Variables persistentes con `isGlobal`
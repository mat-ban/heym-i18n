# Set

El nodo **Set** transforma y asigna los datos de entrada a una salida personalizada. Utilícelo para mayúsculas, subcadenas, concatenación, números aleatorios y cualquier transformación de datos; no para invocar workflows (para eso, use [Execute](./execute-node.md)).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.keyName` para cada clave de asignación |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `mappings` | array | Pares clave-valor. Cada uno: `{ key, value }` donde `value` es una [expresión](../reference/expression-dsl.md) |

## Uso como herramienta de Agent

Cuando un nodo Set se conecta a un [Nodo Agent](./agent-node.md) como herramienta del canvas, cada valor de asignación puede marcarse como **proporcionado por el agente** con el icono del bot. Los valores de asignación marcados se convierten en parámetros de la herramienta que el agente completa en tiempo de ejecución. Las asignaciones no marcadas permanecen fijas en la configuración del nodo.

El icono del bot aparece solo cuando el nodo Set está conectado al handle de herramientas de un agente. Un nodo Set independiente no muestra los controles de proporcionado por el agente.

## Reglas de expresiones

- Referencie nodos anteriores: `$nodeName.text`, `$nodeName.body.field`
- Use funciones: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- `$range(a,b)` excluye `b`; devuelve un error si `a > b`.
- Solo un `$` al inicio de la expresión, nunca dentro de los paréntesis
- Acceda a la salida por clave: `$setNode.randomNumber`, `$setNode.text`

## Ejemplo

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Los nodos posteriores acceden mediante `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Relacionado

- [Asignador de salida JSON](./json-output-mapper-node.md) – Mismas asignaciones; el único terminal devuelve el JSON raíz para webhooks/ejecuciones
- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Execute](./execute-node.md) – Invocar workflows (no transformación de datos)
- [DSL de expresiones](../reference/expression-dsl.md) – Funciones y sintaxis
- [Diálogo de evaluación de expresiones](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend y Anterior/Siguiente para las asignaciones
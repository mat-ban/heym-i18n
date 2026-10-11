# Mapeador de salida JSON

El nodo **Mapeador de salida JSON** construye un objeto JSON a partir de [mapeos](./set-node.md) de clave/valor (el mismo modelo que [Set](./set-node.md)). Úselo cuando los invocadores deban recibir un **cuerpo JSON plano** en la raíz de la respuesta.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 0 (sumidero) |
| Salida en tiempo de ejecución | Objeto construido a partir de `mappings` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `mappings` | array | Entradas `{ "key": "fieldName", "value": "expression" }` (igual que Set) |

## Uso como herramienta de Agent

No compatible. Este nodo es un sumidero terminal, por lo que no se puede adjuntar al handle de herramientas de un [Nodo Agent](./agent-node.md). Utilice un nodo [Set](./set-node.md) cuando un agente necesite dar forma a valores durante la conversación.

## Comportamiento con Webhook y en ejecución

Cuando este nodo es la **única** salida terminal del workflow, las **salidas** de la ejecución son el propio objeto mapeado: las claves de `mappings` aparecen en el **nivel superior** del JSON. **No** existe una clave contenedora externa con la etiqueta del nodo ni un objeto `{ "result": ... }` (a diferencia del nodo [Output](./output-node.md)).

Si varios nodos terminales producen salidas (por ejemplo, [Output](./output-node.md) más el Mapeador de salida JSON, o varias ramas), Heym utiliza la forma habitual: cada terminal se identifica mediante su `label`.

## Restricción de bucle

La misma regla que en [Output](./output-node.md): no coloque este nodo dentro de una rama de iteración de un bucle; solo después de la rama `done` del bucle. Consulte [Loop](./loop-node.md).

## Ejemplo

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

## Relacionados

- [Set](./set-node.md) – La misma mecánica de mapeo para transformaciones intermedias
- [Output](./output-node.md) – Respuesta basada en mensaje o esquema con envoltura `result`
- [Tipos de nodos](../reference/node-types.md) – Todos los tipos de nodos
- [Estructura del workflow](../reference/workflow-structure.md) – Formato JSON del workflow
- [Webhooks](../reference/webhooks.md) – Endpoint de ejecución y respuestas
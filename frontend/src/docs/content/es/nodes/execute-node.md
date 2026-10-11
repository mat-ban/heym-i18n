# Execute

El nodo **Execute** llama a otro workflow (sub-workflow) y le pasa la entrada. Úselo para lógica reutilizable, no para transformación de datos; para eso utilice [Set](./set-node.md).

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `executeWorkflowId` | UUID | ID del workflow a ejecutar |
| `executeInput` | expression | Entrada única (para workflows con un solo campo de entrada) |
| `executeInputMappings` | array | `{ key, value }` para múltiples entradas. `key` = nombre del campo de entrada del workflow destino. |
| `executeDoNotWait` | boolean | Cuando es `true`, despacha el sub-workflow en segundo plano sin esperar. Salida: `{ "status": "dispatched", "workflow_id": "..." }`. Valor predeterminado: `false`. |

## Formato de respuesta

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## No esperar

Cuando `executeDoNotWait: true`, el nodo despacha el sub-workflow a un hilo en segundo plano y devuelve inmediatamente:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

El workflow padre continúa al siguiente nodo sin esperar. El registro de ejecución del sub-workflow se escribe en la traza de forma asíncrona cuando finaliza. Utilice esta opción cuando el resultado del sub-workflow no se necesite en las etapas posteriores.

## Entrada única

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Múltiples entradas

Cuando el workflow destino tiene múltiples campos de entrada, utilice `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

El `key` debe coincidir con las claves `inputFields` del nodo [Input](./input-node.md) del workflow destino.

## Relacionado

- [Canvas Features](../reference/canvas-features.md) – Extract to Sub-Workflow para crear nodos Execute a partir de los nodos seleccionados
- [Node Types](../reference/node-types.md) – Descripción general de todos los tipos de nodo
- [Input Node](./input-node.md) – Campos de entrada del workflow destino
- [Set Node](./set-node.md) – Transformación de datos (no llamadas a workflows)
# Output

El nodo **Output** es el endpoint del workflow que devuelve la respuesta al invocador. Siempre haga referencia al nodo anterior por su label—nunca utilice `$input`.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 (opcional, para post-procesamiento asíncrono) |
| Output | Devuelve `message` al invocador |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `message` | expression | Valor de salida. **Debe** hacer referencia al nodo anterior: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Si es true, los nodos posteriores al output se ejecutan de forma asíncrona después de enviar la respuesta |

## Uso como herramienta de Agent

Cuando un nodo Output se conecta a un [Nodo Agent](./agent-node.md) como herramienta del canvas, el campo `message` puede marcarse como **proporcionado por el agente** con el icono del bot. El agente entonces proporciona el mensaje cuando invoca la herramienta. Si el nodo Output no está conectado como herramienta del agente, el icono del bot permanece oculto.

## Regla crítica

**Nunca utilice `$input` en el nodo output.** Siempre utilice el label del nodo anterior:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (donde `processData` es el label del nodo anterior)

## Post-procesamiento asíncrono

Cuando `allowDownstream: true`, la respuesta se devuelve inmediatamente. Los nodos conectados después del output se ejecutan en segundo plano (por ejemplo, notificaciones de Slack, logging). Dado que la cola downstream puede finalizar más tarde, un fallo downstream puede cambiar el estado de la ejecución registrada a `error` después de que ya se haya devuelto la respuesta temprana; el historial final y las analíticas reflejan ese resultado posterior.

## Ejemplo

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Ejemplo – Con asincronía

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

A continuación, conecte un nodo [Telegram](./telegram-node.md), [Slack](./slack-node.md) u otro después del output para notificaciones fire-and-forget.

## Relacionado

- [Mapeador de salida JSON](./json-output-mapper-node.md) – Cuerpo JSON raíz sin envoltura `result` cuando es el único terminal
- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [DSL de expresiones](../reference/expression-dsl.md) – Referencia a la salida de nodos
- [Diálogo de evaluación de expresiones](../reference/expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend para message
- [Estructura del workflow](../reference/workflow-structure.md) – Formato JSON
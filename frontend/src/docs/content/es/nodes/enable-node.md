# Nodo Enable

El **Nodo Enable** vuelve a activar otro nodo. Cuando se ejecuta, establece el `active` del nodo de destino en `true` y persiste el cambio. Es la contraparte de [Nodo Disable](./disable-node.md): utilícelo para reactivar un trigger [Cron](./cron-node.md) o cualquier nodo que se haya desactivado.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `targetNodeLabel` | string | Label del nodo que se va a activar (ej.: `hourlyCheck`) |

## Comportamiento

- El destino se guarda como activo, de modo que las ejecuciones y los triggers futuros lo ven. Un trigger Cron reactivado se dispara de nuevo en su siguiente hora programada.
- Si el destino se encuentra aguas abajo del Nodo Enable y aún no se ha ejecutado, también se ejecuta en la ejecución actual.
- Activar un nodo que ya está activo no cambia nada; la salida sigue informando `enabled: true`.
- El nodo falla con un error cuando `targetNodeLabel` está vacío o ningún nodo tiene ese label.

## Caso de uso

Inicie un trigger [Cron](./cron-node.md) bajo demanda. Guarde el nodo Cron desactivado y asigne al workflow un segundo punto de entrada, como un trigger [Input](./input-node.md). Una solicitud a ese punto de entrada ejecuta el Nodo Enable y el Cron comienza a dispararse.

Un trigger desactivado nunca inicia una ejecución por sí mismo, por lo que el Nodo Enable debe situarse detrás de un punto de entrada que pueda ejecutarse.

## Ejemplo

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flujo: Input → Nodo Enable (destino: cron) → Output. El nodo Cron `hourlyCheck` se guarda como desactivado en el mismo workflow y ejecuta su propia rama de comprobación HTTP una vez activado.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Disable](./disable-node.md) – Desactivar un nodo desde dentro de un workflow
- [Nodo Cron](./cron-node.md) – Trigger que se va a activar
- [Nodo Condition](./condition-node.md) – Bifurcar antes de activar
- [Funciones del Canvas](../reference/canvas-features.md) – Activar o desactivar un nodo manualmente
# Deshabilitar Nodo

El nodo **Deshabilitar Nodo** deshabilita permanentemente otro nodo en el workflow. Cuando se ejecuta, establece el `active` del nodo objetivo en `false` y persiste el cambio. Utilícelo para operaciones puntuales, como detener un trigger Cron una vez cumplida una condición.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `targetNodeLabel` | string | Etiqueta del nodo que se va a deshabilitar (ej.: `hourlyCheck`) |

## Caso de uso

Deshabilitar un trigger [Cron](./cron-node.md) una vez cumplida una condición, de modo que deje de ejecutarse en futuras ejecuciones del workflow. Vuelva a activarlo más adelante con [Habilitar Nodo](./enable-node.md).

## Ejemplo

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flujo: Cron → Verificación HTTP → Condición (¿estado completado?) → si es verdadero: Deshabilitar Nodo (objetivo: cron) → Salida.

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Habilitar Nodo](./enable-node.md) – Volver a activar un nodo deshabilitado
- [Nodo Cron](./cron-node.md) – Trigger que se va a deshabilitar
- [Nodo Condition](./condition-node.md) – Bifurcación antes de deshabilitar
# Wait

El nodo **Wait** pausa la ejecución del workflow durante una duración especificada. Utilícelo para limitar la tasa de peticiones, retrasar acciones o establecer intervalos de sondeo.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Salida | Pasa la entrada tal cual |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `duration` | number | Retardo en milisegundos (p. ej. 1000 = 1 segundo). El editor acepta de 1 a 900000 (15 minutos) |

## Ejemplo

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Nodo Loop](./loop-node.md) – Utilice Wait dentro de bucles para limitar la tasa de peticiones
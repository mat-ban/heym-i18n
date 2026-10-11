# Cron

El nodo **Cron** activa un workflow según una programación mediante una expresión cron. No se requiere entrada del usuario: el workflow se ejecuta automáticamente en los momentos especificados.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 0 |
| Salidas | 1 |
| Salida | Evento de Trigger (sin payload) |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `cronExpression` | string | Expresión cron (ej.: `0 * * * *` para cada hora) |

## Formato de expresión cron

Cron estándar de 5 campos: `minuto hora día-del-mes mes día-de-la-semana`

| Campo | Valores | Ejemplo |
|-------|--------|---------|
| Minuto | 0–59 | `0` = en el minuto 0 |
| Hora | 0–23 | `*` = cada hora |
| Día del mes | 1–31 | `*` = cada día |
| Mes | 1–12 | `*` = cada mes |
| Día de la semana | 0–7 (0 y 7 = domingo) | `*` = cada día |

**Ejemplos comunes:**

- `0 * * * *` – cada hora
- `0 0 * * *` – diariamente a medianoche
- `*/15 * * * *` – cada 15 minutos
- `0 9 * * 1-5` – días laborables a las 9:00

## Ejemplo

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Relacionado

- [Tipos de nodos](../reference/node-types.md) – Descripción general de todos los tipos de nodos
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Nodo Disable](./disable-node.md) – Detener un Trigger cron tras una condición
- [Nodo Enable](./enable-node.md) – Iniciar de nuevo un Trigger cron deshabilitado
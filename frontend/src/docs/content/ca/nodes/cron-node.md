# Cron

El node **Cron** activa un workflow segons una programació mitjançant una expressió cron. No cal cap entrada de l'usuari: el workflow s'executa automàticament en els moments especificats.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 0 |
| Sortides | 1 |
| Sortida | Esdeveniment de trigger (sense payload) |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `cronExpression` | string | Expressió cron (p. ex. `0 * * * *` per cada hora) |

## Format de l'expressió cron

Cron estàndard de 5 camps: `minute hour day-of-month month day-of-week`

| Camp | Valors | Exemple |
|-------|--------|---------|
| Minut | 0–59 | `0` = al minut 0 |
| Hora | 0–23 | `*` = cada hora |
| Dia del mes | 1–31 | `*` = cada dia |
| Mes | 1–12 | `*` = cada mes |
| Dia de la setmana | 0–7 (0 i 7 = diumenge) | `*` = cada dia |

**Exemples habituals:**

- `0 * * * *` – cada hora
- `0 0 * * *` – diàriament a mitjanit
- `*/15 * * * *` – cada 15 minuts
- `0 9 * * 1-5` – dies feiners a les 9:00

## Exemple

```json
{
  "type": "cron",
  "data": {
    "label": "hourlyCheck",
    "cronExpression": "0 * * * *"
  }
}
```

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Triggers](../reference/triggers.md) – Cron, Input, RabbitMQ
- [Disable Node](./disable-node.md) – Aturar un trigger cron després d'una condició
- [Enable Node](./enable-node.md) – Tornar a iniciar un trigger cron desactivat
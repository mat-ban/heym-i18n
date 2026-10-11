# Wait

El node **Wait** posa en pausa l'execució del workflow durant una durada especificada. Utilitzeu-lo per a la limitació de velocitat, accions ajornades o intervals d'enquestació.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | Reenvia l'entrada |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `duration` | number | Retard en mil·lisegons (p. ex. 1000 = 1 segon). L'editor accepta d'1 a 900000 (15 minuts) |

## Exemple

```json
{
  "type": "wait",
  "data": {
    "label": "delayOneSecond",
    "duration": 1000
  }
}
```

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Loop Node](./loop-node.md) – Utilitzeu Wait dins de bucles per a la limitació de velocitat
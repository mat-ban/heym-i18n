# Node Disable

El node **Disable Node** desactiva permanentment un altre node del workflow. Quan s'executa, estableix l'`active` del node objectiu a `false` i persisteix el canvi. Utilitzeu-lo per a operacions puntuals, com ara aturar un trigger de tipus cron un cop s'ha complert una condició.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `targetNodeLabel` | string | Etiqueta del node que es vol desactivar (p. ex. `hourlyCheck`) |

## Cas d'ús

Desactiveu un trigger de tipus [Cron](./cron-node.md) un cop s'hagi complert una condició, de manera que ja no s'executi en futures execucions del workflow. Torneu-lo a activar més endavant amb [Enable Node](./enable-node.md).

## Exemple

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux: Cron → comprovació HTTP → Condition (estat complet?) → si és cert: Disable Node (objectiu: cron) → Sortida.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Enable Node](./enable-node.md) – Torna a activar un node desactivat
- [Cron Node](./cron-node.md) – Trigger que es vol desactivar
- [Condition Node](./condition-node.md) – Branca abans de desactivar
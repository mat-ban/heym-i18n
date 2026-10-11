# Node Enable

El node **Enable Node** torna a activar un altre node. Quan s'executa, estableix el camp `active` del node objectiu a `true` i persisteix el canvi. És la contrapartida de [Disable Node](./disable-node.md): utilitzeu-lo per tornar a armar un trigger [Cron](./cron-node.md) o qualsevol node que s'hagi desactivat.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Paràmetres

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `label` | string | Identificador del node (camelCase) |
| `targetNodeLabel` | string | Etiqueta del node que cal activar (p. ex. `hourlyCheck`) |

## Comportament

- L'objectiu es desa com a actiu, de manera que les execucions i els triggers futurs el veuran. Un trigger Cron reactivat s'executa de nou a la seva propera hora programada.
- Si l'objectiu es troba aigües avall del node Enable Node i encara no s'ha executat, també s'executa en l'execució actual.
- Activar un node que ja està actiu no canvia res; la sortida continua reportant `enabled: true`.
- El node falla amb un error quan `targetNodeLabel` és buit o cap node té aquesta etiqueta.

## Cas d'ús

Inicieu un trigger [Cron](./cron-node.md) sota demanda. Deseu el node Cron desactivat i proporcioneu al workflow un segon punt d'entrada, com ara un trigger [Input](./input-node.md). Una sol·licitud a aquest punt d'entrada executa el node Enable Node i el Cron comença a executar-se.

Un trigger desactivat mai no inicia una execució per si sol, de manera que el node Enable Node ha de situar-se darrere d'un punt d'entrada que pugui executar-se.

## Exemple

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Flux: Input → Enable Node (objectiu: cron) → Output. El node Cron `hourlyCheck` es desa com a desactivat al mateix workflow i executa la seva pròpia branca de comprovació HTTP un cop activat.

## Relacionat

- [Node Types](../reference/node-types.md) – Visió general de tots els tipus de node
- [Disable Node](./disable-node.md) – Desactiveu un node des de dins d'un workflow
- [Cron Node](./cron-node.md) – Trigger que cal activar
- [Condition Node](./condition-node.md) – Bifurqueu abans d'activar
- [Canvas Features](../reference/canvas-features.md) – Activeu o desactiveu un node manualment
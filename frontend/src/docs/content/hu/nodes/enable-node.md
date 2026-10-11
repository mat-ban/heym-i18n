# Csomópont engedélyezése

Az **Csomópont engedélyezése** csomópont újra bekapcsol egy másik csomópontot. Végrehajtáskor a célcsomópont `active` értékét `true`-ra állítja, és elmenti a módosítást. Ez a [Csomópont letiltása](./disable-node.md) ellentéte: ezzel lehet újra aktiválni egy [Cron](./cron-node.md) triggert vagy bármely csomópontot, amelyet korábban kikapcsoltak.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `targetNodeLabel` | string | Az engedélyezni kívánt csomópont címkéje (pl. `hourlyCheck`) |

## Működés

- A cél aktívként kerül mentésre, így a jövőbeli futtatások és triggerek látják azt. Az újra engedélyezett Cron trigger a következő ütemezett időpontban ismét aktiválódik.
- Ha a cél a Csomópont engedélyezése csomópont alatt helyezkedik el, és még nem futott le, akkor az aktuális végrehajtásban is lefut.
- Egy már aktív csomópont engedélyezése nem változtat semmit; a kimenet továbbra is `enabled: true` értéket jelent.
- A csomópont hibával meghiúsul, ha a `targetNodeLabel` üres, vagy nincs ilyen címkével rendelkező csomópont.

## Használati eset

Indítson el egy [Cron](./cron-node.md) triggert igény szerint. Mentse a Cron csomópontot kikapcsolt állapotban, és adjon a workflow-nak egy második belépési pontot, például egy [Input](./input-node.md) triggert. A belépési pontra érkező kérés lefuttatja a Csomópont engedélyezése csomópontot, és a Cron elkezd aktiválódni.

A kikapcsolt trigger önmagában soha nem indít futtatást, ezért a Csomópont engedélyezése csomópontnak olyan belépési pont mögött kell elhelyezkednie, amely képes futni.

## Példa

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Folyamat: Input → Csomópont engedélyezése (cél: cron) → Output. A `hourlyCheck` Cron csomópont letiltottként van mentve ugyanabban a workflow-ban, és az engedélyezés után lefuttatja a saját HTTP-ellenőrzési ágát.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Csomópont letiltása](./disable-node.md) – Csomópont kikapcsolása egy workflow-n belülről
- [Cron csomópont](./cron-node.md) – Az engedélyezni kívánt trigger
- [Feltétel csomópont](./condition-node.md) – Elágazás az engedélyezés előtt
- [Vászon funkciók](../reference/canvas-features.md) – Csomópont kézi engedélyezése vagy letiltása

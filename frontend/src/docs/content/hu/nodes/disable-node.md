# Csomópont letiltása

A **Csomópont letiltása** csomópont véglegesen letilt egy másik csomópontot a workflow-ban. Végrehajtáskor a célcsomópont `active` értékét `false`-ra állítja, és tartósítja a változtatást. Egyedi műveletekhez használható, például egy Cron trigger leállításához, miután egy feltétel teljesült.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `targetNodeLabel` | string | A letiltandó csomópont címkéje (pl. `hourlyCheck`) |

## Használati eset

Tiltson le egy [Cron](./cron-node.md) triggert, miután egy feltétel teljesült, hogy a jövőbeli workflow-futtatásokban már ne fusson le. Később a [Csomópont engedélyezése](./enable-node.md) csomóponttal kapcsolhatja vissza.

## Példa

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Folyamat: Cron → HTTP-ellenőrzés → Feltétel (státusz kész?) → ha igaz: Csomópont letiltása (cél: cron) → Kimenet.

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Csomópont engedélyezése](./enable-node.md) – Egy letiltott csomópont visszakapcsolása
- [Cron csomópont](./cron-node.md) – A letiltandó trigger
- [Feltétel csomópont](./condition-node.md) – Elágazás a letiltás előtt

# Išjungti mazgą

**Išjungti mazgą** mazgas nuolat išjungia kitą mazgą darbo eigoje. Jis nustato tikslinio mazgo `active` reikšmę į `false` ir išsaugo šį pakeitimą. Naudokite jį vienkartinėms operacijoms, pavyzdžiui, sustabdant cron trigger'į, kai yra įvykdyta tam tikra sąlyga.

## Apžvalga

| Ypatybė | Reikšmė |
|---------|---------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `targetNodeLabel` | string | Išjungiamo mazgo etiketė (pvz., `hourlyCheck`) |

## Naudojimo atvejis

Išjunkite [Cron](./cron-node.md) trigger'į, kai yra įvykdyta tam tikra sąlyga, kad jis nebeveiktų būsimose darbo eigos vykdymuose. Vėliau jį vėl įjunkite su [Enable Node](./enable-node.md).

## Pavyzdys

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Srautas: Cron → HTTP tikrinimas → Sąlyga (statusas baigtas?) → jei tiesa: Išjungti mazgą (tikslas: cron) → Išvestis.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Enable Node](./enable-node.md) – Įjungti išjungtą mazgą
- [Cron Node](./cron-node.md) – Trigger'is, kurį reikia išjungti
- [Condition Node](./condition-node.md) – Šaka prieš išjungiant

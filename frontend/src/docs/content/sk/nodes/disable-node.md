# Uzol Disable Node

Uzol **Disable Node** natrvalo deaktivuje iný uzol vo workflow. Pri spustení nastaví cieľovému uzlu `active` na `false` a zmenu uloží. Použite ho na jednorazové operácie, ako je zastavenie cron triggera po splnení podmienky.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `targetNodeLabel` | string | Label uzla, ktorý sa má deaktivovať (napr. `hourlyCheck`) |

## Prípad použitia

Deaktivujte [Cron](./cron-node.md) trigger po splnení podmienky, aby sa už nespúšťal v budúcich spusteniach workflow. Neskôr ho môžete opäť zapnúť pomocou [Enable Node](./enable-node.md).

## Príklad

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Cron → HTTP kontrola → Condition (stav dokončený?) → ak true: Disable Node (cieľ: cron) → Výstup.

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Enable Node](./enable-node.md) – Opätovné zapnutie deaktivovaného uzla
- [Cron Node](./cron-node.md) – Trigger na deaktiváciu
- [Condition Node](./condition-node.md) – Vetvenie pred deaktiváciou

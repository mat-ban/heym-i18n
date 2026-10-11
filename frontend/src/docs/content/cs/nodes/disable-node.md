# Uzel Deaktivace

Uzel **Deaktivace** trvale deaktivuje jiný uzel ve workflow. Při spuštění nastaví cílovému uzlu vlastnost `active` na `false` a tuto změnu uloží. Použijte jej pro jednorázové operace, jako je zastavení cron triggeru po splnění podmínky.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `targetNodeLabel` | string | Označení uzlu, který má být deaktivován (např. `hourlyCheck`) |

## Případ použití

Deaktivujte [Cron](./cron-node.md) trigger po splnění podmínky, aby se již nespouštěl při budoucích spuštěních workflow. Později jej můžete znovu zapnout pomocí uzlu [Aktivace](./enable-node.md).

## Příklad

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Cron → HTTP kontrola → Podmínka (stav dokončeno?) → pokud true: Deaktivace (cíl: cron) → Výstup.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Aktivace](./enable-node.md) – Opětovné zapnutí deaktivovaného uzlu
- [Uzel Cron](./cron-node.md) – Trigger k deaktivaci
- [Uzel Podmínka](./condition-node.md) – Větev před deaktivací

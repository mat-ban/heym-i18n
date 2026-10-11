# Uzol Enable Node

Uzol **Enable Node** opätovne zapína iný uzol. Pri spustení nastaví cieľovému uzlu hodnotu `active` na `true` a zmenu uloží. Je náprotivkom uzla [Disable Node](./disable-node.md): použite ho na opätovné aktivovanie [Cron](./cron-node.md) triggera alebo akéhokoľvek uzla, ktorý bol vypnutý.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `targetNodeLabel` | string | Label uzla, ktorý sa má zapnúť (napr. `hourlyCheck`) |

## Správanie

- Cieľ sa uloží ako aktívny, takže ho budúce spustenia a triggery uvidia. Opätovne zapnutý Cron trigger sa znova spustí v najbližšom naplánovanom čase.
- Ak sa cieľ nachádza pod uzla Enable Node a ešte nebol spustený, spustí sa aj v aktuálnom spustení.
- Zapnutie uzla, ktorý je už aktívny, nič nemení; výstup stále hlási `enabled: true`.
- Uzol zlyhá s chybou, keď je `targetNodeLabel` prázdny alebo žiadny uzol nemá tento label.

## Prípad použitia

Spustite [Cron](./cron-node.md) trigger na požiadanie. Uložte Cron uzol vypnutý a dajte workflowu druhý vstupný bod, napríklad [Input](./input-node.md) trigger. Požiadavka na tento vstupný bod spustí uzol Enable Node a Cron začne odpaľovať.

Vypnutý trigger sám o sebe nikdy nespustí beh, takže uzol Enable Node musí byť za vstupným bodom, ktorý sa dá spustiť.

## Príklad

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Input → Enable Node (cieľ: cron) → Output. Cron uzol `hourlyCheck` je v tom istom workflowe uložený ako vypnutý a po zapnutí spustí svoju vlastnú vetvu s HTTP kontrolou.

## Súvisiace

- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Disable Node](./disable-node.md) – Vypnutie uzla zvnútra workflowu
- [Cron Node](./cron-node.md) – Trigger na zapnutie
- [Condition Node](./condition-node.md) – Vetvenie pred zapnutím
- [Canvas Features](../reference/canvas-features.md) – Ručné zapnutie alebo vypnutie uzla

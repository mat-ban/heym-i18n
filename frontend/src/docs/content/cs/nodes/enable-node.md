# Uzel Enable Node

Uzel **Enable Node** znovu zapíná jiný uzel. Při spuštění nastaví cílovému uzlu vlastnost `active` na hodnotu `true` a tuto změnu uloží. Jedná se o protějšek uzlu [Disable Node](./disable-node.md): slouží k opětovné aktivaci [Cron](./cron-node.md) triggeru nebo jakéhokoli uzlu, který byl vypnut.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.targetNode`, `$nodeLabel.enabled` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `targetNodeLabel` | string | Popisek uzlu, který má být zapnut (např. `hourlyCheck`) |

## Chování

- Cíl je uložen jako aktivní, takže jej uvidí budoucí spuštění i triggery. Znovu zapnutý Cron trigger se opět spustí ve svém příštím naplánovaném čase.
- Pokud se cíl nachází níže v toku za uzlem Enable Node a ještě nebyl spuštěn, spustí se také v rámci aktuálního spuštění.
- Zapnutí uzlu, který je již aktivní, nic nezmění; výstup přesto hlásí `enabled: true`.
- Uzel selže s chybou, pokud je `targetNodeLabel` prázdný nebo žádný uzel takový popisek nemá.

## Případ použití

Spuštění [Cron](./cron-node.md) triggeru na vyžádání. Uložte uzel Cron ve vypnutém stavu a přidejte do workflow druhý vstupní bod, například [Input](./input-node.md) trigger. Požadavek na tento vstupní bod spustí uzel Enable Node a Cron začne odpalovat.

Vypnutý trigger sám o sobě nikdy nezahájí spuštění, proto musí být uzel Enable Node umístěn za vstupním bodem, který může běžet.

## Příklad

```json
{
  "type": "enableNode",
  "data": {
    "label": "startCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Tok: Input → Enable Node (cíl: cron) → Output. Uzel Cron `hourlyCheck` je v rámci stejného workflow uložen jako vypnutý a po zapnutí spustí svou vlastní větev s HTTP kontrolou.

## Související

- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Disable Node](./disable-node.md) – Vypnutí uzlu zevnitř workflow
- [Cron Node](./cron-node.md) – Trigger k zapnutí
- [Condition Node](./condition-node.md) – Větvení před zapnutím
- [Canvas Features](../reference/canvas-features.md) – Ruční zapnutí nebo vypnutí uzlu

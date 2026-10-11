# Loop

De **Loop**-node itereert over een array en voert voor elk item de downstream-nodes uit. Er is een terugkoppeling vereist vanaf de laatste node in de iteratie-body om verder te gaan.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 2 (standaard + loop-terugkoppeling) |
| Uitvoer | 2 (loop, done) |
| Uitvoer | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `arrayExpression` | expression | Expressie die resulteert in een array (bijv. `$input.items`) |

## Edge-handles

- **Bron `loop`** – Verbindt met nodes die elk item verwerken (wordt per iteratie uitgevoerd)
- **Bron `done`** – Verbindt met nodes die worden uitgevoerd nadat alle iteraties zijn voltooid
- **Doel standaard** – Ontvangt initiële gegevens die de array bevatten
- **Doel `loop`** – Ontvangt de terugkoppeling vanaf de laatste node van de iteratie-body

## Loop-context (in de iteratie-body)

- `$loopNode.item` – Huidig item
- `$loopNode.index` – 0-gebaseerde index
- `$loopNode.total` – Totaal aantal items
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritieke regels

1. **Terugkoppeling vereist:** De laatste node in de iteratie-body MOET terugverbinden met de `loop`-invoerhandle van de loop.
2. **Geen uitvoer in de loop-body:** [Output](./output-node.md)-nodes zijn verboden binnen de loop-body. Gebruik [Set](./set-node.md) of [Variable](./variable-node.md) voor tussentijdse resultaten.
3. **Geen automatische resultaten:** De loop verzamelt geen resultaten. Gebruik Variable-nodes met `$array()` en `.add()` om te accumuleren.

## Voorbeeld

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Stroom: loop → verwerkings-node → (terug naar loop) → loop → done-tak → uitvoer.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Variable-node](./variable-node.md) – Items verzamelen in een loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, array-methoden

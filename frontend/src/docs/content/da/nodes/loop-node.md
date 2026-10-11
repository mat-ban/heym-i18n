# Loop

**Loop**-noden itererer over et array og udfører efterfølgende noder for hvert enkelt element. Kræver en tilbageforbindelse fra den sidste node i iterationskroppen for at fortsætte.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 2 (standard + loop-tilbage) |
| Outputs | 2 (loop, færdig) |
| Output | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `arrayExpression` | expression | Udtryk der evalueres til et array (f.eks. `$input.items`) |

## Edge-håndtag

- **Kilde `loop`** – Forbinder til noder der behandler hvert element (kører per iteration)
- **Kilde `done`** – Forbinder til noder der kører efter alle iterationer er fuldført
- **Mål standard** – Modtager startdata indeholdende arrayet
- **Mål `loop`** – Modtager tilbageforbindelse fra den sidste node i iterationskroppen

## Loop-kontekst (i iterationskrop)

- `$loopNode.item` – Aktuelt element
- `$loopNode.index` – 0-baseret indeks
- `$loopNode.total` – Samlet antal elementer
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Kritisk regler

1. **Tilbageforbindelse påkrævet:** Den sidste node i iterationskroppen SKAL forbinde tilbage til loop'ens `loop`-inputhåndtag.
2. **Ingen output i loop-krop:** [Output](./output-node.md)-noder er forbudt inde i loop-kroppen. Brug [Set](./set-node.md) eller [Variable](./variable-node.md) til mellemliggende resultater.
3. **Ingen automatiske resultater:** Loop'en indsamler ikke resultater. Brug Variable-noder med `$array()` og `.add()` til akkumulering.

## Eksempel

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Flow: loop → proces-node → (tilbage til loop) → loop → færdig-gren → output.

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Variable-node](./variable-node.md) – Indsaml elementer i en loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, array-metoder

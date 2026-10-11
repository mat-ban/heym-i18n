# Condition

**Condition**-noden forgrener workflowet baseret på et if/else-udtryk. Dirigerer til den sande eller falske gren afhængigt af resultatet.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 2 (true, false) |
| Output | Videregiver input til den valgte gren |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `condition` | udtryk | JavaScript-lignende udtryk (f.eks. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – når betingelsen evalueres til sand
- **Source handle `false`** – når betingelsen evalueres til falsk

## Udtryksoperatorer

Understøtter: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, osv. Se [Expression DSL](../reference/expression-dsl.md).

## Eksempel

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Forbind kanter med `sourceHandle: "true"` eller `sourceHandle: "false"` for at dirigere til forskellige grene.

## Relateret

- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Switch Node](./switch-node.md) – Flervejsrouting baseret på værdi
- [Expression DSL](../reference/expression-dsl.md) – Betingelsessyntaks
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-prøveversion til betingelser

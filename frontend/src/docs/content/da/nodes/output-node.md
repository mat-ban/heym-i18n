# Output

**Output**-noden er workflowets endpoint, der returnerer svaret til kaldende part. Der skal altid refereres til den foregående node via label—`$input` må aldrig anvendes.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 (valgfri, til asynkron efterbehandling) |
| Output | Returnerer `message` til kaldende part |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `message` | expression | Outputværdi. **Skal** referere til foregående node: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Hvis true, køres noder efter output asynkront efter respons er sendt |

## Brug som agentværktøj

Når en Output-node er forbundet til en [Agent Node](./agent-node.md) som canvas-nodeværktøj, kan `message`-feltet markeres som **agent-leveret** med bot-ikonet. Agenten leverer så beskeden, når den kalder værktøjet. Hvis Output-noden ikke er forbundet som agentværktøj, skjules bot-ikonet.

## Kritisk regel

**`$input` må aldrig bruges i output-noden.** Brug altid den foregående nodes label:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (hvor `processData` er den foregående nodes label)

## Asynkron efterbehandling

Når `allowDownstream: true` er sat, returneres responsen med det samme. Noder forbundet efter output køres i baggrunden (f.eks. Slack-notifikationer, logging). Da den efterfølgende hale kan afsluttes senere, kan en fejl i denne kæde ændre den registrerede kørselsstatus til `error` efter den tidlige respons allerede er returneret; den endelige historik og analyse afspejler dette senere udfald.

## Eksempel

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Eksempel – Med asynkron

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text",
    "allowDownstream": true
  }
}
```

Herefter kan en [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- eller anden node forbindes efter output for fire-and-forget-notifikationer.

## Relateret

- [JSON output mapper](./json-output-mapper-node.md) – Rod-JSON-krop uden `result`-indpakning når den er eneste terminal
- [Node-typer](../reference/node-types.md) – Oversigt over alle nodetyper
- [Expression DSL](../reference/expression-dsl.md) – Referering til node-output
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-preview for besked
- [Workflow-struktur](../reference/workflow-structure.md) – JSON-format

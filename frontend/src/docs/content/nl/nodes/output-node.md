# Output

De **Output**-node is het workflow-eindpunt dat de respons aan de aanroeper retourneert. Verwijs altijd naar de voorgaande node via het label—gebruik nooit `$input`.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 (optioneel, voor asynchrone naverwerking) |
| Output | Retourneert `message` aan de aanroeper |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `message` | expression | Uitvoerwaarde. **Moet** verwijzen naar de voorgaande node: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Indien true, worden nodes na de output asynchroon uitgevoerd nadat de respons is verzonden |

## Gebruik als agent-tool

Wanneer een Output-node is verbonden met een [Agent Node](./agent-node.md) als canvas-node-tool, kan het veld `message` worden gemarkeerd als **agent-provided** met het bot-pictogram. De agent levert dan het bericht wanneer deze de tool aanroept. Als de Output-node niet als agent-tool is verbonden, is het bot-pictogram verborgen.

## Kritieke regel

**Gebruik nooit `$input` in de output-node.** Gebruik altijd het label van de voorgaande node:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (waarbij `processData` het label van de voorgaande node is)

## Asynchrone naverwerking

Wanneer `allowDownstream: true`, wordt de respons onmiddellijk geretourneerd. Nodes die na de output zijn verbonden, worden op de achtergrond uitgevoerd (bijv. Slack-meldingen, logging). Omdat de downstream-staart later kan voltooien, kan een downstream-fout de geregistreerde uitvoeringsstatus naar `error` wijzigen nadat de vroege respons al is geretourneerd; de uiteindelijke geschiedenis en analytics weerspiegelen die latere uitkomst.

## Voorbeeld

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Voorbeeld – Met async

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

Verbind vervolgens een [Telegram](./telegram-node.md), [Slack](./slack-node.md) of andere node na de output voor fire-and-forget-meldingen.

## Gerelateerd

- [JSON output mapper](./json-output-mapper-node.md) – Root-JSON-body zonder `result`-omhulling wanneer deze de enige terminal is
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Expression DSL](../reference/expression-dsl.md) – Verwijzen naar node-output
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview voor message
- [Workflow Structure](../reference/workflow-structure.md) – JSON-formaat

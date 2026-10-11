# Output

**Output**-noden är workflowets slutpunkt som returnerar svaret till anroparen. Referera alltid till föregående nod via etikett – använd aldrig `$input`.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 (valfritt, för asynkron efterbearbetning) |
| Utdata | Returnerar `message` till anroparen |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `message` | expression | Utdata-värde. **Måste** referera till föregående nod: `$previousNodeLabel.field` |
| `allowDownstream` | boolean | Om true körs noder efter output asynkront efter att svaret har skickats |

## Användning som agent-verktyg

När en Output-nod är ansluten till en [Agent-nod](./agent-node.md) som ett canvas-nodverktyg kan fältet `message` markeras som **agent-tillhandahållet** med botikonen. Agenten tillhandahåller då meddelandet när verktyget anropas. Om Output-noden inte är ansluten som ett agent-verktyg döljs botikonen.

## Kritisk regel

**Använd aldrig `$input` i output-noden.** Använd alltid föregående nods etikett:

- ❌ `"message": "$input.text"`
- ✅ `"message": "$processData.text"` (där `processData` är föregående nods etikett)

## Asynkron efterbearbetning

När `allowDownstream: true` returneras svaret omedelbart. Noder som är anslutna efter output körs i bakgrunden (t.ex. Slack-aviseringar, loggning). Eftersom den nedströms svansen kan slutföras senare kan ett nedströms fel ändra den registrerade körningsstatusen till `error` efter att det tidiga svaret redan har returnerats; den slutliga historiken och analysen återspeglar det senare utfallet.

## Exempel

```json
{
  "type": "output",
  "data": {
    "label": "apiResponse",
    "message": "$generateResponse.text"
  }
}
```

## Exempel – Med asynkron

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

Anslut sedan en [Telegram](./telegram-node.md)-, [Slack](./slack-node.md)- eller annan nod efter output för fire-and-forget-aviseringar.

## Relaterat

- [JSON output mapper](./json-output-mapper-node.md) – Root JSON-body utan `result`-omslutning när den är ensam terminal
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Expression DSL](../reference/expression-dsl.md) – Referera till nodutdata
- [Dialog för utvärdering av uttryck](../reference/expression-evaluation-dialog.md) – Expanderbar editor med live-förhandsvisning från backend för message
- [Workflow-struktur](../reference/workflow-structure.md) – JSON-format

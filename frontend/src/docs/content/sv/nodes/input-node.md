# Input

**Input**-noden är ingångspunkten för workflows som tar emot data från användaren eller API-anroparen. Den stöder ett eller flera inmatningsfält och exponerar förfrågningsmetadata (headers, query-parametrar).

## Översikt

| Egenskap | Värde |
|----------|-------|
| Ingångar | 0 |
| Utgångar | 1 |
| Utdata | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `value` | string | Standardvärde för enskild textinmatning (valfritt) |
| `inputFields` | array | Definitioner av inmatningsfält. Varje: `{ key, defaultValue? }` |

### Inmatningsfält

| Fält | Typ | Beskrivning |
|------|-----|-------------|
| `key` | string | Fältnyckel (t.ex. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Standardvärde om inget anges (valfritt) |

## Åtkomst till indata

**Body-fält** (använd alltid `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – textfält
- `$userInput.body.imageUrl` – bild-URL
- `$userInput.body.userId` – med standardvärde om konfigurerat
- `$userInput.body.event.user.id` – nästlad JSON från Generic webhook-läge

**Förfrågningsmetadata** (vid körning via API):

- `$userInput.headers` – alla headers (nycklar i gemener)
- `$userInput.headers.authorization` – specifik header
- `$userInput.query` – query-parametrar
- `$userInput.query.param1` – specifik query-parameter

## Filinmatning i körningspanelen

I editorns **Run**-flik (Defined webhook-läge) stöder varje inmatningsfält drag-and-drop samt en inline-bilagakontroll (längst ned till höger i fältet):

- **Textfiler** (`.txt`, `.md`, `.json`, `.csv` och liknande) läses som ren text.
- **Bilder** (JPEG, PNG, GIF, WebP) lagras som en `data:`-URL (base64) i fältets värde — använd fältnycklar som `imageUrl` eller `base64` när efterföljande noder förväntar sig bilddata.
- **PDF**-filer konverteras till extraherad text (max 5 MB fil, 100k tecken innehåll).

En fil per fält. Textområdet kan fortfarande redigeras efter att en fil har laddats. Generic webhook-läge (rå JSON-body) visar inte filkontroller per fält.

## Inmatningsfält kontra Generic webhooks

`inputFields` beskriver fortfarande förväntade indata för editorformulär i defined-läge, mappning av sub-workflows och andra metadatadrivna ytor.

När en workflow använder **Generic** webhook-body-läge omformas inte den inkommande HTTP-bodyn utifrån `inputFields`. Istället skickas den råa JSON-payloaden vidare till `$nodeLabel.body`, och kontrollerna för att lägga till/ta bort fält i Input-noden döljs i nodpanelen.

## Exempel

**Enkel inmatning (standard):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Flera inmatningar:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Relaterat

- [Node Types](../reference/node-types.md) – Översikt över alla nodtyper
- [Triggers](../reference/triggers.md) – Ingångspunkter (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referera till `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Exponera workflows som chat-gränssnitt
- [Webhooks](../reference/webhooks.md) – HTTP-trigger för workflows

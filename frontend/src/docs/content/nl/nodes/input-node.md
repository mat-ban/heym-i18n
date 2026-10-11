# Input

De **Input**-node is het toegangspunt voor workflows die gegevens ontvangen van de gebruiker of de API-aanroeper. De node ondersteunt één of meerdere invoervelden en stelt metadata van het verzoek beschikbaar (headers, query-parameters).

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `value` | string | Standaardwaarde voor één tekstinvoer (optioneel) |
| `inputFields` | array | Definities van invoervelden. Elk: `{ key, defaultValue? }` |

### Invoervelden

| Veld | Type | Beschrijving |
|-------|------|-------------|
| `key` | string | Veldnaam (bijv. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Standaardwaarde indien niet opgegeven (optioneel) |

## Toegang tot invoergegevens

**Body-velden** (gebruik altijd `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – tekstveld
- `$userInput.body.imageUrl` – afbeeldings-URL
- `$userInput.body.userId` – met standaardwaarde indien geconfigureerd
- `$userInput.body.event.user.id` – geneste JSON uit Generic webhook-modus

**Metadata van het verzoek** (bij uitvoering via API):

- `$userInput.headers` – alle headers (namen in kleine letters)
- `$userInput.headers.authorization` – specifieke header
- `$userInput.query` – query-parameters
- `$userInput.query.param1` – specifieke query-parameter

## Bestandsinvoer in het Run-paneel

In het tabblad **Run** van de editor (Defined webhook-modus) ondersteunt elk invoerveld drag-and-drop en een inline bijlageregeling (rechtsonder in het veld):

- **Tekstbestanden** (`.txt`, `.md`, `.json`, `.csv` en vergelijkbaar) worden als platte tekst gelezen.
- **Afbeeldingen** (JPEG, PNG, GIF, WebP) worden opgeslagen als een `data:`-URL (base64) in de veldwaarde — gebruik veldnamen zoals `imageUrl` of `base64` wanneer downstream-nodes afbeeldingsgegevens verwachten.
- **PDF**-bestanden worden geconverteerd naar geëxtraheerde tekst (max. 5 MB bestand, 100k tekens aan inhoud).

Eén bestand per veld. De tekstarea kan nog steeds worden bewerkt nadat een bestand is geladen. De Generic webhook-modus (raw JSON-body) toont geen bestandsregelingen per veld.

## Invoervelden versus Generic webhooks

`inputFields` beschrijven nog steeds de verwachte invoer voor formulieren in de editor in defined-modus, sub-workflow-mapping en andere metadata-gestuurde oppervlakken.

Wanneer een workflow de **Generic** webhook-body-modus gebruikt, wordt de inkomende HTTP-body niet hervormd op basis van `inputFields`. In plaats daarvan wordt de raw JSON-payload doorgegeven aan `$nodeLabel.body`, en de regelingen voor het toevoegen/verwijderen van velden van de Input-node worden verborgen in het node-paneel.

## Voorbeelden

**Enkele invoer (standaard):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Meerdere invoervelden:**

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

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Triggers](../reference/triggers.md) – Toegangspunten (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Verwijzen naar `$nodeLabel.body`, `$nodeLabel.query`
- [Portaal](../reference/portal.md) – Workflows beschikbaar stellen als chat-UIs
- [Webhooks](../reference/webhooks.md) – HTTP-trigger voor workflows

# LLM

De **LLM**-node verwerkt tekst met een taalmodel of genereert afbeeldingen. De node ondersteunt tekstgeneratie, vision (afbeeldingsinvoer), afbeeldingsgeneratie, gestructureerde JSON-uitvoer en provider-native **Batch API**-uitvoering voor ondersteunde tekstmodellen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1, plus optioneel `batchStatus` wanneer batchmodus is ingeschakeld |
| Uitvoer | `$nodeLabel.text` (tekst), `$nodeLabel.image` (afbeelding), of batchresultaatvelden zoals `$nodeLabel.results` |

## Parameters

### Referentie & Model

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-referentie uit [Referenties](../tabs/credentials-tab.md) |
| `model` | string | Modelnaam (bijv. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` voor afbeeldingen) |
| `fallbackCredentialId` | UUID (optioneel) | Fallback-referentie wanneer de primaire faalt |
| `fallbackModel` | string (optioneel) | Fallback-model wanneer de primaire faalt |

Als de primaire referentie of het model een fout retourneert, probeert de node automatisch opnieuw met de fallback-referentie en het fallback-model voordat de node faalt.

Heym controleert ook de **batchmogelijkheid** van de geselecteerde referentie en het model. Batchmodus is beschikbaar voor:

- OpenAI-referenties
- Aangepaste / OpenAI-compatibele referenties waarvan het endpoint de vereiste `/v1/files`- en `/v1/batches`-API's beschikbaar stelt

Als de geselecteerde provider of het model batchuitvoering niet ondersteunt, toont het Eigenschappen-paneel dat direct en wordt de schakelaar uitgeschakeld.

### Prompts (tekstmodus)

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `systemInstruction` | string | Systeem-prompt. Ondersteunt [expressies](../reference/expression-dsl.md). |
| `userMessage` | string | Gebruikersbericht. Standaard: `$input.text` |
| `temperature` | number | 0.0–2.0 (standaard: 0.7) |
| `maxTokens` | number | Maximaal aantal tokens in het antwoord (optioneel) |
| `requestTimeoutSeconds` | number | Maximaal aantal seconden om op het modelantwoord te wachten voordat een time-out optreedt (standaard: 60). Verhoog deze waarde voor langzame of zelf-gehoste providers (LiteLLM, vLLM, lokale modellen). |

### Afbeelding & Uitvoer

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Tekst- of afbeeldingsgeneratie |
| `imageInputEnabled` | boolean | Afbeelding toevoegen aan gebruikersbericht (vision) |
| `imageInput` | expressie | Base64 data-URL of afbeeldings-URL |
| `jsonOutputEnabled` | boolean | Gestructureerde JSON-uitvoer |
| `jsonOutputSchema` | string | JSON Schema voor gestructureerde uitvoer |
| `extraBodyEnabled` | boolean | Providerspecifieke requestparameters verzenden (standaard: `false`) |
| `extraBody` | string | JSON-object dat wordt samengevoegd met de API-requestbody |

### Reasoning-modellen (o1, o3)

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Inschakelen voor reasoning-modellen |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Redeneerdiepte |

### Batchmodus

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Gebruik de provider-native Batch API in plaats van uitvoering per afzonderlijk request |

Batchmodus is alleen beschikbaar op de **LLM**-node. Deze is **niet** van toepassing op de [Agent-node](./agent-node.md).

Wanneer batchmodus is ingeschakeld:

- moet `outputType` `text` blijven
- moet `imageInputEnabled` `false` blijven
- moet `userMessage` resulteren in een **array**
- moet elk array-item resulteren in een string of primitieve waarde

Typische voorbeelden:

- `$input.items.map("item.text")`
- `$vars.promptList`

Als de expressie resulteert in een enkele string in plaats van een array, mislukt de uitvoering met een validatiefout voordat de provideraanroep start.

## Batch Status-vertakking

Wanneer batchmodus is ingeschakeld, biedt de LLM-node een tweede uitvoerhandle: `batchStatus`.

Gebruik die vertakking voor meldingen, logging, Slack-berichten of neveneffecten terwijl de batch nog wordt uitgevoerd. De vertakking wordt geactiveerd telkens wanneer de providerstatus wezenlijk verandert, inclusief genormaliseerde statussen zoals:

- `pending`
- `processing`
- `completed`
- `failed`

De payload van de statusvertakking is beschikbaar als `$input` in downstream-nodes en bevat:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Voorbeeld-edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Voorbeeld statusmapper:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Vorm van batchresultaat

Bij succesvolle afronding bevat de hoofd-uitvoer van de LLM-node:

- `$nodeLabel.text` – samengevoegde succesvolle teksten
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – resultaten per item in de oorspronkelijke volgorde
- `$nodeLabel.usage`

Elk item in `$nodeLabel.results` bevat velden zoals:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Wanneer **JSON-uitvoer** samen met batchmodus is ingeschakeld, parseert Heym elk succesvol item afzonderlijk. Geparseerde objecten worden per item beschikbaar gesteld en verzameld op `parsedResults`.
## Responses API

Een selectievakje **Use Responses API** leidt de aanroep van de node via de
[Responses API](https://platform.openai.com/docs/api-reference/responses) in plaats van Chat
Completions. Het staat standaard uit, en de node gedraagt zich in beide gevallen hetzelfde: dezelfde prompts,
hetzelfde JSON-uitvoerschema, dezelfde resultaatvorm.

Het werkt met een OpenAI-referentie, en met een aangepaste referentie waarvan de gateway het
endpoint ondersteunt, zodat een zelf-gehoste of via een proxy lopende opstelling het ook kan gebruiken. Met een Google-referentie blijft het uitgeschakeld, en het kan niet worden gecombineerd met [Batch mode](#batch-status-branch) - het nodepaneel geeft aan
waar een gegeven referentie staat voordat u iets uitvoert.

Als het endpoint tijdens de uitvoering niet beschikbaar blijkt te zijn, mislukt de node met een bericht dat de
oorzaak benoemt in plaats van stilzwijgend terug te vallen, zodat een node die is geconfigureerd voor de Responses API altijd daarop draait. Om bewust terug te vallen op een andere referentie of model, gebruikt u de velden **Fallback Credential** en **Fallback Model**; zij erven dit selectievakje, dus een fallback-referentie moet ook het endpoint ondersteunen.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Wanneer u [Input](./input-node.md) gebruikt voor de prompt, gebruik dan `$userPrompt.body.text` in `userMessage`

## JSON Output

Wanneer `jsonOutputEnabled` true is, retourneert de LLM JSON die overeenkomt met het schema. Toegang tot velden via `$nodeLabel.fieldName`.

## Extra Body

Sommige providers accepteren verzoekparameters die de standaard OpenAI-compatibele velden niet
dekken, zoals het uitschakelen van de thinking-modus van een model. Vink **Send extra request body** aan in de node-
eigenschappen en voer een JSON-object in. Het wordt samengevoegd in elk API-verzoek dat deze node doet.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Standaard uitgeschakeld.** Met het selectievakje uit wordt niets extra's verzonden.
- Moet een JSON-**object** zijn. Een array, een scalair of misvormde tekst laat de node mislukken met
  `Invalid extra body JSON` in plaats van stilzwijgend te worden genegeerd.
- De knop **Format** naast het selectievakje herformatteert de JSON, en wordt rood met de tekst
  `Invalid` wanneer de tekst niet kan worden geparseerd.
- Toegepast op de hoofdcompletion, de fallback-modelpoging en batch mode-verzoeken.
  **Niet** toegepast op image generation of op guardrail-controles, die een andere verzoek-
  vorm en een apart model gebruiken.
- `$`-expressies worden opgelost vóór het parseren, dus `{"max_tokens": $prev.limit}` werkt. Omdat
  dit tekstuele substitutie is, levert een opgeloste waarde die een dubbele aanhalingsteken of een nieuwe regel bevat
  ongeldige JSON op en mislukt de node.

## Example – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Example – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Example – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Schakel **Guardrails** in bij de node-eigenschappen om onveilige gebruikersberichten te blokkeren vóór de LLM-aanroep. Zie [Guardrails](../reference/guardrails.md) voor de volledige referentie.

## Related

- [Agent Node](./agent-node.md) – LLM met tool calling
- [Why Heym](../getting-started/why-heym.md) – Waar LLM-stappen passen in de agent-levenscyclus
- [Guardrails](../reference/guardrails.md) – Blokkeer onveilige inhoudscategorieën
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
- [Expression DSL](../reference/expression-dsl.md) – Gegevens refereren in prompts
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Uitbreidbare editor met live backend-preview voor prompts
- [Credentials Tab](../tabs/credentials-tab.md) – LLM API-sleutels toevoegen
- [Quick Start](../getting-started/quick-start.md) – Basis LLM-workflow

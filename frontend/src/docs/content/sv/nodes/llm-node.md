# LLM

Noden **LLM** bearbetar text med en språkmodell eller genererar bilder. Den stöder textgenerering, vision (bildinmatning), bildgenerering, strukturerad JSON-utdata samt leverantörsspecifik körning via **Batch API** för textmodeller som stöder detta.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Ingångar | 1 |
| Utgångar | 1, plus valfri `batchStatus` när batchläge är aktiverat |
| Utdata | `$nodeLabel.text` (text), `$nodeLabel.image` (bild) eller batchresultatfält såsom `$nodeLabel.results` |

## Parametrar

### Autentiseringsuppgifter och modell

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | LLM-autentiseringsuppgift från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `model` | string | Modellnamn (t.ex. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` för bilder) |
| `fallbackCredentialId` | UUID (valfritt) | Reservautentiseringsuppgift när den primära misslyckas |
| `fallbackModel` | string (valfritt) | Reservmodell när den primära misslyckas |

Om den primära autentiseringsuppgiften eller modellen returnerar ett fel försöker noden automatiskt igen med reservautentiseringsuppgiften och reservmodellen innan den misslyckas.

Heym kontrollerar även **batchkapacitet** utifrån den valda autentiseringsuppgiften och modellen. Batchläge är tillgängligt för:

- OpenAI-autentiseringsuppgifter
- Anpassade / OpenAI-kompatibla autentiseringsuppgifter vars endpoint exponerar de nödvändiga API:erna `/v1/files` och `/v1/batches`

Om den valda leverantören eller modellen inte stöder batchkörning visas detta direkt i panelen Egenskaper och växlingsknappen inaktiveras.

### Prompts (textläge)

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `systemInstruction` | string | Systemprompt. Stöder [uttryck](../reference/expression-dsl.md). |
| `userMessage` | string | Användarmeddelande. Standard: `$input.text` |
| `temperature` | number | 0,0–2,0 (standard: 0,7) |
| `maxTokens` | number | Maximalt antal svars-tokens (valfritt) |
| `requestTimeoutSeconds` | number | Maximalt antal sekunder att vänta på modellens svar innan timeout (standard: 60). Höj värdet för långsamma eller egenhostade leverantörer (LiteLLM, vLLM, lokala modeller). |

### Bild och utdata

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `outputType` | `"text"` \| `"image"` | Text- eller bildgenerering |
| `imageInputEnabled` | boolean | Inkludera bild med användarmeddelandet (vision) |
| `imageInput` | expression | Base64-data-URL eller bild-URL |
| `jsonOutputEnabled` | boolean | Strukturerad JSON-utdata |
| `jsonOutputSchema` | string | JSON Schema för strukturerad utdata |
| `extraBodyEnabled` | boolean | Skicka leverantörsspecifika begäranparametrar (standard: `false`) |
| `extraBody` | string | JSON-objekt som sammanfogas med API-begärans body |

### Resonerande modeller (o1, o3)

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `isReasoningModel` | boolean | Aktivera för resonerande modeller |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Resonemangsdjup |

### Batchläge

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `batchModeEnabled` | boolean | Använd leverantörens inbyggda Batch API i stället för körning med enskilda begäranden |

Batchläge är endast tillgängligt på noden **LLM**. Det gäller **inte** för [Agent-noden](./agent-node.md).

När batchläge är aktiverat:

- `outputType` måste förbli `text`
- `imageInputEnabled` måste förbli `false`
- `userMessage` måste utvärderas till en **array**
- varje arrayelement måste utvärderas till ett strängvärde eller primitivt värde

Typiska exempel:

- `$input.items.map("item.text")`
- `$vars.promptList`

Om uttrycket utvärderas till en enskild sträng i stället för en array misslyckas körningen med ett valideringsfel innan leverantörsanropet startar.

## Gren för batchstatus

När batchläge är aktiverat exponerar LLM-noden ett andra utgångshandtag: `batchStatus`.

Använd den grenen för aviseringar, loggning, Slack-meddelanden eller sidoeffekter medan batchen fortfarande körs. Grenen utlöses när leverantörens status förändras på ett betydande sätt, inklusive normaliserade tillstånd såsom:

- `pending`
- `processing`
- `completed`
- `failed`

Statusgrenens payload är tillgänglig som `$input` i nedströmsnoder och innehåller:

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

Exempel på kant:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Exempel på statusmappning:

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

## Batchresultatets struktur

Vid lyckad körning innehåller LLM:ens huvudutdata:

- `$nodeLabel.text` – sammanfogade lyckade texter
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – resultat per objekt i ursprunglig ordning
- `$nodeLabel.usage`

Varje objekt i `$nodeLabel.results` innehåller fält såsom:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

När **JSON-utdata** är aktiverat tillsammans med batchläge tolkar Heym varje lyckat objekt separat. Tolkade objekt exponeras per objekt och samlas i `parsedResults`.
## Responses API

En kryssruta för **Use Responses API** dirigerar nodens anrop genom
[Responses API](https://platform.openai.com/docs/api-reference/responses) i stället för Chat
Completions. Den är avstängd som standard, och noden beter sig likadant oavsett: samma prompts,
samma JSON-utdataschema, samma resultatform.

Den fungerar med en OpenAI-autentiseringsuppgift, och med en anpassad autentiseringsuppgift vars gateway stöder endpointen, så en självhostad eller proxad konfiguration kan också använda den. Med en Google-autentiseringsuppgift förblir den inaktiverad, och den kan inte kombineras med [Batch-läge](#batch-status-branch) – nodpanelen anger var en given autentiseringsuppgift står innan något körs.

Om endpointen visar sig vara otillgänglig vid körning misslyckas noden med ett meddelande som anger orsaken i stället för att tyst falla tillbaka, så en nod som konfigurerats för Responses API körs alltid på den. För att avsiktligt falla tillbaka till en annan autentiseringsuppgift eller modell används fälten **Fallback Credential** och **Fallback Model**; de ärver denna kryssruta, så en fallback-autentiseringsuppgift måste också stödja endpointen.

## Bildgenerering

- **Modeller:** `nanobanana`, `gemini-2.0-flash-exp`
- **Utdata:** `$nodeLabel.image` (base64-data-URL)
- Vid användning av [Input](./input-node.md) för prompten används `$userPrompt.body.text` i `userMessage`

## JSON-utdata

När `jsonOutputEnabled` är true returnerar LLM JSON som matchar schemat. Fält nås via `$nodeLabel.fieldName`.

## Extra Body

Vissa leverantörer accepterar förfrågningsparametrar som de standardiserade OpenAI-kompatibla fälten inte täcker, till exempel att inaktivera en modells tankeläge. Markera **Send extra request body** i nodegenskaperna och ange ett JSON-objekt. Det sammanfogas i varje API-förfrågan som denna nod gör.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Avstängd som standard.** Med kryssrutan av skickas inget extra.
- Måste vara ett JSON-**objekt**. En array, en skalär eller felaktig text får noden att misslyckas med `Invalid extra body JSON` i stället för att tyst ignoreras.
- Knappen **Format** bredvid kryssrutan formaterar om JSON och blir röd med texten `Invalid` när texten inte kan tolkas.
- Tillämpas på huvudkompletteringen, fallback-modellförsöket och batch-lägesförfrågningar.
  **Inte** tillämpat på bildgenerering eller på guardrail-kontroller, som använder en annan förfrågningsform och en separat modell.
- `$`-uttryck löses upp före tolkning, så `{"max_tokens": $prev.limit}` fungerar. Eftersom detta är textuell substitution producerar ett upplöst värde som innehåller ett dubbelt citattecken eller en ny rad ogiltig JSON och får noden att misslyckas.

## Exempel – Text

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

## Exempel – Batch-text

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

## Exempel – Bildgenerering

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

Aktivera **Guardrails** i nodegenskaperna för att blockera osäkra användarmeddelanden före LLM-anropet. Se [Guardrails](../reference/guardrails.md) för den fullständiga referensen.

## Relaterat

- [Agent-nod](./agent-node.md) – LLM med verktygsanrop
- [Varför Heym](../getting-started/why-heym.md) – Var LLM-steg passar in i agentlivscykeln
- [Guardrails](../reference/guardrails.md) – Blockera osäkra innehållskategorier
- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Expression DSL](../reference/expression-dsl.md) – Referera till data i prompts
- [Dialog för uttrycksutvärdering](../reference/expression-evaluation-dialog.md) – Expanderbar redigerare med live-förhandsvisning från backend för prompts
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till LLM-API-nycklar
- [Snabbstart](../getting-started/quick-start.md) – Grundläggande LLM-workflow

# LLM

**LLM**-noden behandler tekst med en sprogmodel eller genererer billeder. Den understøtter tekstgenerering, vision (billedinput), billedgenerering, struktureret JSON-output og provider-specifik **Batch API**-kørsel for understøttede tekstmodeller.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1, plus valgfri `batchStatus` når batch-tilstand er aktiveret |
| Output | `$nodeLabel.text` (tekst), `$nodeLabel.image` (billede), eller batch-resultatfelter som `$nodeLabel.results` |

## Parametre

### Legitimationsoplysninger & Model

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-legitimationsoplysninger fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `model` | string | Modelnavn (f.eks. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` for billeder) |
| `fallbackCredentialId` | UUID (valgfri) | Fallback-legitimationsoplysninger ved primær fejl |
| `fallbackModel` | string (valgfri) | Fallback-model ved primær fejl |

Hvis de primære legitimationsoplysninger eller model returnerer en fejl, forsøger noden automatisk med fallback-legitimationsoplysninger og model før den fejler.

Heym kontrollerer også **batch-kapacitet** fra de valgte legitimationsoplysninger og model. Batch-tilstand er tilgængelig for:

- OpenAI-legitimationsoplysninger
- Brugerdefinerede / OpenAI-kompatible legitimationsoplysninger, hvis endpoint eksponerer de nødvendige `/v1/files` og `/v1/batches` API'er

Hvis den valgte provider eller model ikke understøtter batch-kørsel, vises dette direkte i egenskabs-panelet, og til/fra-knappen deaktiveres.

### Prompts (teksttilstand)

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `systemInstruction` | string | System-prompt. Understøtter [udtryk](../reference/expression-dsl.md). |
| `userMessage` | string | Brugerbesked. Standard: `$input.text` |
| `temperature` | tal | 0.0–2.0 (standard: 0.7) |
| `maxTokens` | tal | Maksimalt antal respons-tokens (valgfri) |
| `requestTimeoutSeconds` | tal | Maksimal ventetid i sekunder før timeout (standard: 60). Øg denne for langsomme eller selvhostede providers (LiteLLM, vLLM, lokale modeller). |

### Billede & Output

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Tekst- eller billedgenerering |
| `imageInputEnabled` | boolean | Inkluder billede med brugerbesked (vision) |
| `imageInput` | udtryk | Base64 data-URL eller billed-URL |
| `jsonOutputEnabled` | boolean | Struktureret JSON-output |
| `jsonOutputSchema` | string | JSON Schema for struktureret output |
| `extraBodyEnabled` | boolean | Send provider-specifikke anmodningsparametre (standard: `false`) |
| `extraBody` | string | JSON-objekt flettet ind i API-anmodningens body |

### Ræsonneringsmodeller (o1, o3)

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Aktiver for ræsonneringsmodeller |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Ræsonneringsdybde |

### Batch-tilstand

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Brug provider-specifik Batch API i stedet for enkeltanmodningskørsel |

Batch-tilstand er kun tilgængelig på **LLM**-noden. Den gælder **ikke** for [Agent Node](./agent-node.md).

Når batch-tilstand er aktiveret:

- `outputType` skal forblive `text`
- `imageInputEnabled` skal forblive `false`
- `userMessage` skal resultere i en **array**
- hvert array-element skal resultere i en streng eller primitiv værdi

Typiske eksempler:

- `$input.items.map("item.text")`
- `$vars.promptList`

Hvis udtrykket resulterer i en enkelt streng i stedet for en array, fejler kørslen med en valideringsfejl før provider-kaldet starter.

## Batch Status-gren

Når batch-tilstand er aktiveret, eksponerer LLM-noden et andet output-handle: `batchStatus`.

Brug denne gren til notifikationer, logning, Slack-beskeder eller sideeffekter mens batchen stadig kører. Grenen udløses hver gang provider-status ændrer sig markant, inklusive normaliserede tilstande som:

- `pending`
- `processing`
- `completed`
- `failed`

Statusgrenens payload er tilgængelig som `$input` i nedstrøms noder og inkluderer:

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

Eksempel på edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Eksempel på status-mapper:

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

## Batch-resultatform

Ved vellykket afslutning indeholder det primære LLM-output:

- `$nodeLabel.text` – sammenkædede vellykkede tekster
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – per-element resultater i original rækkefølge
- `$nodeLabel.usage`

Hvert element i `$nodeLabel.results` inkluderer felter som:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Når **JSON-output** er aktiveret sammen med batch-tilstand, parser Heym hvert vellykket element separat. Parsede objekter eksponeres per element og samles på `parsedResults`.
## Responses API

En **Brug Responses API** afkrydsningsboks dirigerer nodens kald gennem
[Responses API](https://platform.openai.com/docs/api-reference/responses) i stedet for Chat
Completions. Den er som standard deaktiveret, og noden opfører sig ens uanset valg: samme prompts,
samme JSON-outputskema, samme resultatform.

Den fungerer med en OpenAI-legitimationsoplysning og med en brugerdefineret legitimationsoplysning, hvis gateway understøtter endpointet, så en selvhostet eller proxybaseret opsætning også kan bruge den. Med en Google-legitimationsoplysning forbliver den deaktiveret, og den kan ikke kombineres med [Batch-tilstand](#batch-status-branch) - nodepanelet viser, hvor en given legitimationsoplysning står, før der køres noget.

Hvis endpointet viser sig at være utilgængeligt under kørsel, fejler noden med en besked, der nævner årsagen, i stedet for stille at falde tilbage, så en node konfigureret til Responses API altid kører på den. For bevidst at falde tilbage til en anden legitimationsoplysning eller model, anvendes felterne **Fallback Credential** og **Fallback Model**; de arver denne afkrydsningsboks, så en fallback-legitimationsoplysning også skal understøtte endpointet.

## Billedgenerering

- **Modeller:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data-URL)
- Ved brug af [Input](./input-node.md) til prompten anvendes `$userPrompt.body.text` i `userMessage`

## JSON-output

Når `jsonOutputEnabled` er sand, returnerer LLM JSON, der matcher skemaet. Adgang til felter sker via `$nodeLabel.fieldName`.

## Ekstra krop

Nogle udbydere accepterer anmodningsparametre, som de standard OpenAI-kompatible felter ikke dækker, såsom deaktivering af en models tænketilstand. Marker **Send ekstra anmodningskrop** i nodeegenskaberne og indtast et JSON-objekt. Det flettes ind i hver API-anmodning, som denne node foretager.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Deaktiveret som standard.** Når afkrydsningsboksen er frakrydset, sendes intet ekstra.
- Skal være et JSON-**objekt**. Et array, en skalar eller malformateret tekst får noden til at fejle med
  `Invalid extra body JSON` i stedet for at blive stille droppet.
- Knappen **Format** ved siden af afkrydsningsboksen reformatterer JSON'en og bliver rød med
  `Invalid`, når teksten ikke kan parses.
- Anvendes på hovedfuldførelsen, forsøget med fallback-modellen og batchtilstandsanmodninger.
  **Anvendes ikke** på billedgenerering eller guardrail-tjek, som bruger en anden anmodningsform
  og en separat model.
- `$`-udtryk løses før parsing, så `{"max_tokens": $prev.limit}` virker. Da dette er tekstsubstitution,
  vil en løst værdi, der indeholder et anførselstegn eller en linjeskift, producere ugyldig JSON og få noden til at fejle.

## Eksempel – Tekst

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

## Eksempel – Batch-tekst

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

## Eksempel – Billedgenerering

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

Aktivér **Guardrails** i nodeegenskaberne for at blokere usikre brugerbeskeder før LLM-kaldet. Se [Guardrails](../reference/guardrails.md) for den fulde reference.

## Relateret

- [Agent Node](./agent-node.md) – LLM med tool calling
- [Why Heym](../getting-started/why-heym.md) – Hvor LLM-trinnet passer ind i agentens livscyklus
- [Guardrails](../reference/guardrails.md) – Bloker usikre indholdskategorier
- [Node Types](../reference/node-types.md) – Oversigt over alle nodetyper
- [Expression DSL](../reference/expression-dsl.md) – Referering af data i prompts
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Udvidelig editor med live backend-preview til prompts
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj LLM API-nøgler
- [Quick Start](../getting-started/quick-start.md) – Grundlæggende LLM-workflow

# LLM

**LLM** mezgls apstrādā tekstu ar valodas modeli vai ģenerē attēlus. Tas atbalsta teksta ģenerēšanu, redzi (attēla ievadi), attēlu ģenerēšanu, strukturētu JSON izvadi un pakalpojumu sniedzēja native **Batch API** izpildi atbalstītajiem teksta modeļiem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1, kā arī neobligāts `batchStatus`, ja ir iespējots batch režīms |
| Izvade | `$nodeLabel.text` (teksts), `$nodeLabel.image` (attēls) vai batch rezultāta lauki, piemēram, `$nodeLabel.results` |

## Parametri

### Akreditācijas dati un modelis

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | LLM akreditācijas dati no [Akreditācijas dati](../tabs/credentials-tab.md) |
| `model` | string | Modeļa nosaukums (piem., `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` attēliem) |
| `fallbackCredentialId` | UUID (neobligāts) | Rezerves akreditācijas dati, ja primārie neizdodas |
| `fallbackModel` | string (neobligāts) | Rezerves modelis, ja primārais neizdodas |

Ja primārie akreditācijas dati vai modelis atgriež kļūdu, mezgls automātiski mēģina vēlreiz ar rezerves akreditācijas datiem un modeli pirms kļūmes.

Heym arī pārbauda **batch iespēju** no atlasītajiem akreditācijas datiem un modeļa. Batch režīms ir pieejams:

- OpenAI akreditācijas datiem
- Pielāgotiem / OpenAI saderīgiem akreditācijas datiem, kuru endpoint atklāj nepieciešamos `/v1/files` un `/v1/batches` API

Ja atlasītais pakalpojumu sniedzējs vai modelis neatbalsta batch izpildi, rekvizītu panelis to parāda tieši un atspējo pārslēgu.

### Prompt (teksta režīms)

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `systemInstruction` | string | Sistēmas prompt. Atbalsta [izteiksmes](../reference/expression-dsl.md). |
| `userMessage` | string | Lietotāja ziņojums. Noklusējums: `$input.text` |
| `temperature` | number | 0.0–2.0 (noklusējums: 0.7) |
| `maxTokens` | number | Maksimālais atbildes token skaits (neobligāts) |
| `requestTimeoutSeconds` | number | Maksimālais sekunžu skaits, cik gaidīt modeļa atbildi pirms noildzes (noklusējums: 60). Palieliniet to lēniem vai pašmitinātiem pakalpojumu sniedzējiem (LiteLLM, vLLM, lokālie modeļi). |

### Attēls un izvade

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Teksta vai attēla ģenerēšana |
| `imageInputEnabled` | boolean | Iekļaut attēlu ar lietotāja ziņojumu (redze) |
| `imageInput` | expression | Base64 data URL vai attēla URL |
| `jsonOutputEnabled` | boolean | Strukturēta JSON izvade |
| `jsonOutputSchema` | string | JSON Schema strukturētai izvadei |
| `extraBodyEnabled` | boolean | Sūtīt pakalpojumu sniedzēja specifiskus pieprasījuma parametrus (noklusējums: `false`) |
| `extraBody` | string | JSON objekts, kas sapludināts API pieprasījuma pamattekstā |

### Spriešanas modeļi (o1, o3)

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Iespējot spriešanas modeļiem |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Spriešanas dziļums |

### Batch režīms

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Izmantot pakalpojumu sniedzēja native Batch API, nevis vienreizēja pieprasījuma izpildi |

Batch režīms ir pieejams tikai **LLM** mezglā. Tas **neattiecas** uz [Agent mezglu](./agent-node.md).

Kad batch režīms ir iespējots:

- `outputType` ir jāpaliek `text`
- `imageInputEnabled` ir jāpaliek `false`
- `userMessage` ir jāatrisina uz **masīvu**
- katram masīva elementam ir jāatrisinās uz virkni vai primitīvu vērtību

Tipiski piemēri:

- `$input.items.map("item.text")`
- `$vars.promptList`

Ja izteiksme atrisinās uz vienu virkni, nevis masīvu, izpilde neizdodas ar validācijas kļūdu pirms pakalpojumu sniedzēja izsaukuma sākuma.

## Batch statusa atzars

Kad batch režīms ir iespējots, LLM mezgls atklāj otru izvades rokturi: `batchStatus`.

Izmantojiet šo atzaru paziņojumiem, žurnālēšanai, Slack ziņojumiem vai blakusefektiem, kamēr batch joprojām darbojas. Atzars aktivizējas ikreiz, kad pakalpojumu sniedzēja statuss nozīmīgi mainās, tostarp normalizētos stāvokļos, piemēram:

- `pending`
- `processing`
- `completed`
- `failed`

Statusa atzara payload ir pieejams kā `$input` lejupstraumes mezglos un ietver:

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

Piemēra šķautne:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Piemēra statusa kartētājs:

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

## Batch rezultāta forma

Pēc veiksmīgas pabeigšanas galvenā LLM izvade satur:

- `$nodeLabel.text` – apvienoti veiksmīgie teksti
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – katra elementa rezultāti sākotnējā secībā
- `$nodeLabel.usage`

Katrs elements `$nodeLabel.results` ietver laukus, piemēram:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Kad **JSON izvade** ir iespējota kopā ar batch režīmu, Heym parsē katru veiksmīgo elementu atsevišķi. Parsētie objekti tiek atklāti katram elementam un apkopoti `parsedResults`.
## Responses API

**Use Responses API** izvēles rūtiņa novirza mezgla izsaukumu caur
[Responses API](https://platform.openai.com/docs/api-reference/responses), nevis Chat
Completions. Pēc noklusējuma tā ir izslēgta, un mezgls darbojas vienādi abos gadījumos: tie paši prompti,
tā pati JSON izvades shēma, tā pati rezultāta struktūra.

Tā darbojas ar OpenAI akreditācijas datiem un ar pielāgotiem akreditācijas datiem, kuru gateway atbalsta
endpoint, tāpēc arī pašmitināts vai starpniekservera risinājums to var izmantot. Ar Google akreditācijas datiem tā paliek
atspējota, un to nevar apvienot ar [Batch mode](#batch-status-branch) — mezgla panelis norāda,
kāds ir konkrēto akreditācijas datu statuss, pirms Jūs kaut ko palaižat.

Ja izpildes laikā endpoint izrādās nepieejams, mezgls neizdodas ar ziņojumu, kas nosauc
cēloni, nevis klusi pārslēdzas atpakaļ, tāpēc mezgls, kas konfigurēts Responses API, vienmēr
darbojas ar to. Lai apzināti pārslēgtos uz citiem akreditācijas datiem vai modeli, izmantojiet **Fallback
Credential** un **Fallback Model** laukus; tie pārmanto šo izvēles rūtiņu, tāpēc arī rezerves akreditācijas datiem
ir jāatbalsta endpoint.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Izmantojot [Input](./input-node.md) promptam, `userMessage` laukā izmantojiet `$userPrompt.body.text`

## JSON Output

Kad `jsonOutputEnabled` ir true, LLM atgriež JSON, kas atbilst shēmai. Piekļūstiet laukiem, izmantojot `$nodeLabel.fieldName`.

## Extra Body

Daži pakalpojumu sniedzēji pieņem pieprasījuma parametrus, ko standarta OpenAI saderīgie lauki
nenosedz, piemēram, modeļa domāšanas režīma atspējošanu. Mezgla
rekvizītos atzīmējiet **Send extra request body** un ievadiet JSON objektu. Tas tiek apvienots katrā API pieprasījumā, ko šis mezgls veic.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Pēc noklusējuma atspējots.** Kad izvēles rūtiņa ir izslēgta, nekas papildu netiek sūtīts.
- Jābūt JSON **objektam**. Masīvs, skalārs vai nepareizi formatēts teksts liek mezglam neizdoties ar
  `Invalid extra body JSON`, nevis tiek klusi ignorēts.
- Poga **Format** blakus izvēles rūtiņai pārformatē JSON un kļūst sarkana ar uzrakstu
  `Invalid`, kad tekstu nav iespējams parsēt.
- Tiek piemērots galvenajai completion, rezerves modeļa mēģinājumam un batch mode pieprasījumiem.
  **Netiek** piemērots attēlu ģenerēšanai vai guardrail pārbaudēm, kas izmanto citu pieprasījuma
  formu un atsevišķu modeli.
- `$` izteiksmes tiek atrisinātas pirms parsēšanas, tāpēc `{"max_tokens": $prev.limit}` darbojas. Tā kā
  šī ir teksta aizstāšana, atrisināta vērtība, kas satur pēdiņu vai jaunu rindu,
  rada nederīgu JSON un liek mezglam neizdoties.

## Piemērs – Text

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

## Piemērs – Batch text

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

## Piemērs – Image generation

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

Mezgla rekvizītos iespējojiet **Guardrails**, lai bloķētu nedrošus lietotāja ziņojumus pirms LLM izsaukuma. Pilnu uzziņu skatiet [Guardrails](../reference/guardrails.md).

## Saistītie

- [Agent Node](./agent-node.md) – LLM ar rīku izsaukšanu
- [Why Heym](../getting-started/why-heym.md) – Kur LLM soļi iekļaujas aģenta dzīves ciklā
- [Guardrails](../reference/guardrails.md) – Bloķējiet nedrošu satura kategorijas
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Expression DSL](../reference/expression-dsl.md) – Datu atsaukšana promptos
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Paplašināms redaktors ar tiešu backend priekšskatījumu promptiem
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienojiet LLM API atslēgas
- [Quick Start](../getting-started/quick-start.md) – Pamata LLM workflow

# LLM

**LLM** mazgas apdoro tekstą su kalbos modeliu arba generuoja vaizdus. Jis palaiko teksto generavimą, viziją (vaizdo įvestį), vaizdų generavimą, struktūrizuotą JSON išvestį ir tiekėjo natyvią **Batch API** vykdymą palaikomiems teksto modeliams.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1, plius neprivalomas `batchStatus`, kai įjungtas partijų režimas |
| Išvestis | `$nodeLabel.text` (tekstas), `$nodeLabel.image` (vaizdas) arba partijų rezultatų laukai, tokie kaip `$nodeLabel.results` |

## Parametrai

### Kredencialai ir modelis

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | LLM kredencialas iš [Kredencialų](../tabs/credentials-tab.md) |
| `model` | string | Modelio pavadinimas (pvz., `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` vaizdams) |
| `fallbackCredentialId` | UUID (neprivalomas) | Atsarginis kredencialas, kai pirminis nepavyksta |
| `fallbackModel` | string (neprivalomas) | Atsarginis modelis, kai pirminis nepavyksta |

Jei pirminis kredencialas arba modelis grąžina klaidą, mazgas automatiškai bando su atsarginiu kredencialu ir modeliu prieš nepavykstant.

Heym taip pat tikrina **partijų galimybes** iš pasirinkto kredencialo ir modelio. Partijų režimas yra prieinamas:

- OpenAI kredencialams
- Pasirinktiniems / OpenAI suderinamiems kredencialams, kurių galinis taškas atskleidžia reikiamus `/v1/files` ir `/v1/batches` API

Jei pasirinktas tiekėjas arba modelis nepalaiko partijų vykdymo, Ypatybių skydelyje tai rodomas tiesiogiai ir išjungiamas perjungiklis.

### Promptai (teksto režimas)

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `systemInstruction` | string | Sistemos promptas. Palaiko [išraiškas](../reference/expression-dsl.md). |
| `userMessage` | string | Vartotojo žinutė. Numatyta: `$input.text` |
| `temperature` | number | 0.0–2.0 (numatyta: 0.7) |
| `maxTokens` | number | Maksimalus atsakymo tokenų skaičius (neprivalomas) |
| `requestTimeoutSeconds` | number | Maksimalus sekundžių skaičius, kurį reikia laukti modelio atsakymo prieš pasibaigiant laikui (numatyta: 60). Padidinkite jį lėtiems arba savarankiškai talpinamiems tiekėjams (LiteLLM, vLLM, vietiniai modeliai). |

### Vaizdas ir išvestis

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `outputType` | `"text"` \| `"image"` | Teksto arba vaizdo generavimas |
| `imageInputEnabled` | boolean | Įtraukti vaizdą su vartotojo žinute (vizija) |
| `imageInput` | expression | Base64 duomenų URL arba vaizdo URL |
| `jsonOutputEnabled` | boolean | Struktūrizuota JSON išvestis |
| `jsonOutputSchema` | string | JSON schema struktūrizuotai išvestiai |
| `extraBodyEnabled` | boolean | Siųsti tiekėjo specifinius užklausos parametrus (numatyta: `false`) |
| `extraBody` | string | JSON objektas, sujungtas į API užklausos kūną |

### Mąstymo modeliai (o1, o3)

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `isReasoningModel` | boolean | Įjungti mąstymo modeliams |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Mąstymo gylis |

### Partijų režimas

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `batchModeEnabled` | boolean | Naudoti tiekėjo natyvią Batch API vietoj vienos užklausos vykdymo |

Partijų režimas yra prieinamas tik **LLM** mazge. Jis **netaikomas** [Agent Node](./agent-node.md).

Kai partijų režimas yra įjungtas:

- `outputType` turi likti `text`
- `imageInputEnabled` turi likti `false`
- `userMessage` turi būti išspręstas į **masyvą**
- kiekvienas masyvo elementas turi būti išspręstas į eilutę arba pirminę vertę

Tipiniai pavyzdžiai:

- `$input.items.map("item.text")`
- `$vars.promptList`

Jei išraiška išsprendžiama į vieną eilutę vietoj masyvo, vykdymas nepavyksta su validacijos klaida prieš pradedant tiekėjo skambutį.

## Partijų statuso šaka

Kai partijų režimas yra įjungtas, LLM mazgas atskleidžia antrą išvesties rankeną: `batchStatus`.

Naudokite šią šaką pranešimams, žurnalams, Slack žinutėms ar šalutinėms pasekmėms, kol partija vis dar vykdoma. Šaka aktyvuojama, kai tiekėjo statusas reikšmingai pasikeičia, įskaitant normalizuotas būsenas, tokias kaip:

- `pending`
- `processing`
- `completed`
- `failed`

Statuso šakos payload yra prieinamas kaip `$input` žemiau esančiuose mazguose ir apima:

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

Pavyzdys:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Pavyzdys statuso žemėlapio:

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

## Partijų rezultatų struktūra

Sėkmingai užbaigus, pagrindinė LLM išvestis apima:

- `$nodeLabel.text` – sujungti sėkmingi tekstai
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – rezultatų pagal elementus pradiniu tvarkos
- `$nodeLabel.usage`

Kiekvienas elementas `$nodeLabel.results` apima laukus, tokius kaip:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Kai **JSON išvestis** yra įjungta kartu su partijų režimu, Heym analizuoja kiekvieną sėkmingą elementą atskirai. Išanalizuoti objektai yra atskleisti pagal elementus ir surinkti `parsedResults`.
## Responses API

**Naudoti Responses API** žymės langelis nukreipia mazgo užklausą per [Responses API](https://platform.openai.com/docs/api-reference/responses) vietoj Chat Completions. Pagal numatytuosius nustatymus jis yra išjungtas, o mazgas elgiasi taip pat abiem atvejais: tie patys promptai, tas pats JSON išvesties schema, tas pats rezultato formatas.

Jis veikia su OpenAI kredencialu ir su individualiu kredencialu, kurio vartai palaiko endpoint'ą, todėl savarankiškai talpinama arba per proxy nustatyta sistema taip pat gali jį naudoti. Naudojant Google kredencialą, jis lieka išjungtas, ir jo negalima derinti su [Batch mode](#batch-status-branch) - mazgo skydelyje nurodoma, kokia yra konkretaus kredencialo būsena prieš vykdant bet kokią užklausą.

Jei endpoint'as pasirodo esantis neprieinamas vykdymo metu, mazgas nepavyksta su pranešimu, nurodančiu priežastį, o ne tyliai grįžta atgal, todėl mazgas, sukonfigūruotas naudojant Responses API, visada veikia pagal jį. Norint sąmoningai grįžti prie kito kredencialo ar modelio, naudokite **Fallback Credential** ir **Fallback Model** laukus; jie paveldi šį žymės langelį, todėl atsarginis kredencialas taip pat turi palaikyti endpoint'ą.

## Vaizdų generavimas

- **Modeliai:** `nanobanana`, `gemini-2.0-flash-exp`
- **Išvestis:** `$nodeLabel.image` (base64 duomenų URL)
- Naudojant [Input](./input-node.md) promptui, naudokite `$userPrompt.body.text` `userMessage` lauke.

## JSON Išvestis

Kai `jsonOutputEnabled` yra tiesa, LLM grąžina JSON, atitinkantį schemą. Pasiekite laukus per `$nodeLabel.fieldName`.

## Papildomas kūnas

Kai kurie tiekėjai priima užklausos parametrus, kurių standartiniai OpenAI suderinami laukai neapima, pavyzdžiui, modelio mąstymo režimo išjungimą. Pažymėkite **Siųsti papildomą užklausos kūną** mazgo savybėse ir įveskite JSON objektą. Jis sujungs kiekvieną API užklausą, kurią šis mazgas atlieka.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Pagal numatytuosius nustatymus išjungtas.** Kai žymės langelis išjungtas, nieko papildomo nesiunčiama.
- Turi būti JSON **objektas**. Masyvas, skalaras ar netinkamas tekstas sukels mazgo nesėkmę su `Invalid extra body JSON`, o ne bus tyliai atmestas.
- **Format** mygtukas šalia žymės langelio performatuoja JSON ir paraudonuoja, kai tekstas nesuformatuotas.
- Taikoma pagrindinei užbaigimui, atsarginio modelio bandymui ir partijų režimo užklausoms. **Netaikoma** vaizdų generavimui ar saugos patikroms, kurios naudoja kitokią užklausos struktūrą ir atskirą modelį.
- `$` išraiškos yra išsprendžiamos prieš analizę, todėl `{"max_tokens": $prev.limit}` veikia. Kadangi tai yra tekstinė pakaitinė, išspręstas vertė, turinti dvigubą kabutę ar naują eilutę, sukuria netinkamą JSON ir sukelia mazgo nesėkmę.

## Pavyzdys – Tekstas

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "Jūs esate naudingas asistentas.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Pavyzdys – Partijos tekstas

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
        "variableValue": "$array(\"Apibendrinkite šią sąskaitą\", \"Parengti sekimo el. laišką\", \"Klasifikuoti sąskaitos būseną\")"
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
        "systemInstruction": "Atsakykite į kiekvieną punktą trumpai.",
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

## Pavyzdys – Vaizdų generavimas

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

## Saugos priemonės

Įjunkite **Guardrails** mazgo savybėse, kad blokuotumėte nesaugias vartotojo žinutes prieš LLM užklausą. Žr. [Guardrails](../reference/guardrails.md) pilnai nuorodai.

## Susiję

- [Agent Node](./agent-node.md) – LLM su įrankių kvietimu
- [Kodėl Heym](../getting-started/why-heym.md) – Kur LLM žingsniai tinka agento gyvavimo cikle
- [Guardrails](../reference/guardrails.md) – Blokuoti nesaugias turinio kategorijas
- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Expression DSL](../reference/expression-dsl.md) – Duomenų nuorodų naudojimas promptuose
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Išplečiamas redaktorius su gyvu backend peržiūra promptams
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti LLM API raktus
- [Quick Start](../getting-started/quick-start.md) – Pagrindinis LLM workflow

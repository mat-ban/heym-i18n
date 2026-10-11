# LLM

**LLM**-sõlm töötleb teksti keelemudeliga või genereerib pilte. See toetab tekstigeneratsiooni, nägemist (pildisisend), pildigeneratsiooni, struktureeritud JSON-väljundit ja teenusepakkuja natiivset **Batch API** täitmist toetatud tekstimudelite puhul.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1, pluss valikuline `batchStatus`, kui batch-režiim on lubatud |
| Väljund | `$nodeLabel.text` (tekst), `$nodeLabel.image` (pilt) või batch-tulemuse väljad nagu `$nodeLabel.results` |

## Parameetrid

### Mandaat ja mudel

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `model` | string | Mudeli nimi (nt `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` piltide jaoks) |
| `fallbackCredentialId` | UUID (valikuline) | Varumandaat, kui esmane ebaõnnestub |
| `fallbackModel` | string (valikuline) | Varumudel, kui esmane ebaõnnestub |

Kui esmane mandaat või mudel tagastab vea, proovib sõlm enne ebaõnnestumist automaatselt uuesti varumandaadi ja -mudeliga.

Heym kontrollib ka **batch-võimekust** valitud mandaadi ja mudeli põhjal. Batch-režiim on saadaval järgmistele:

- OpenAI mandaadid
- Kohandatud / OpenAI-ga ühilduvad mandaadid, mille endpoint pakub nõutavaid `/v1/files` ja `/v1/batches` API-sid

Kui valitud teenusepakkuja või mudel ei toeta batch-täitmist, näitab Properties-paneel seda otse ja keelab lüliti.

### Promptid (tekstirežiim)

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `systemInstruction` | string | Süsteemi prompt. Toetab [avaldised](../reference/expression-dsl.md). |
| `userMessage` | string | Kasutaja sõnum. Vaikeväärtus: `$input.text` |
| `temperature` | number | 0.0–2.0 (vaikeväärtus: 0.7) |
| `maxTokens` | number | Vastuse maksimaalne tokenite arv (valikuline) |
| `requestTimeoutSeconds` | number | Maksimaalne sekundite arv mudeli vastuse ootamiseks enne aegumist (vaikeväärtus: 60). Suurendage seda aeglaste või isemajutatud teenusepakkujate puhul (LiteLLM, vLLM, kohalikud mudelid). |

### Pilt ja väljund

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Teksti- või pildigeneratsioon |
| `imageInputEnabled` | boolean | Lisa pilt kasutaja sõnumile (nägemine) |
| `imageInput` | expression | Base64 andme-URL või pildi URL |
| `jsonOutputEnabled` | boolean | Struktureeritud JSON-väljund |
| `jsonOutputSchema` | string | JSON Schema struktureeritud väljundi jaoks |
| `extraBodyEnabled` | boolean | Saada teenusepakkuja-spetsiifilised päringuparameetrid (vaikeväärtus: `false`) |
| `extraBody` | string | JSON-objekt, mis liidetakse API päringu kehaga |

### Arutlusmudelid (o1, o3)

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Luba arutlusmudelite jaoks |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Arutluse sügavus |

### Batch-režiim

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Kasuta teenusepakkuja natiivset Batch API-t üksikpäringu täitmise asemel |

Batch-režiim on saadaval ainult **LLM**-sõlmel. See **ei** kehti [Agent-sõlme](./agent-node.md) puhul.

Kui batch-režiim on lubatud:

- `outputType` peab jääma `text`
- `imageInputEnabled` peab jääma `false`
- `userMessage` peab lahenema **massiiviks**
- iga massiivi element peab lahenema stringiks või primitiivseks väärtuseks

Tüüpilised näited:

- `$input.items.map("item.text")`
- `$vars.promptList`

Kui avaldis laheneb üksikuks stringiks massiivi asemel, ebaõnnestub käivitus valideerimisveaga enne teenusepakkuja kutse algust.

## Batch-oleku haru

Kui batch-režiim on lubatud, pakub LLM-sõlm teist väljundkäepidet: `batchStatus`.

Kasutage seda haru teavituste, logimise, Slack-sõnumite või kõrvalmõjude jaoks, kui batch veel töötab. Haru käivitub alati, kui teenusepakkuja olek oluliselt muutub, sealhulgas normaliseeritud olekud nagu:

- `pending`
- `processing`
- `completed`
- `failed`

Oleku haru payload on kättesaadav kui `$input` alluvates sõlmedes ja sisaldab:

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

Näidis-serv:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Näidis-oleku vastendaja:

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

## Batch-tulemuse kuju

Eduka lõpetamise korral sisaldab peamine LLM-väljund:

- `$nodeLabel.text` – ühendatud edukad tekstid
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – üksuse kaupa tulemused algses järjekorras
- `$nodeLabel.usage`

Iga element `$nodeLabel.results`-is sisaldab välju nagu:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Kui **JSON-väljund** on lubatud koos batch-režiimiga, parsib Heym iga eduka üksuse eraldi. Parsitud objektid on esitatud üksuse kaupa ja kogutud `parsedResults`-ile.
## Responses API

Märkeruut **Use Responses API** suunab sõlme päringu läbi
[Responses API](https://platform.openai.com/docs/api-reference/responses), mitte Chat
Completionsi kaudu. See on vaikimisi välja lülitatud ja sõlm käitub mõlemal juhul ühtemoodi: samad promptid,
sama JSON-väljundiskeem, sama tulemuse kuju.

See töötab OpenAI mandaadiga ja kohandatud mandaadiga, mille gateway toetab
endpointi, seega ka isemajutatud või puhverserveri kaudu seadistatud lahendus saab seda kasutada. Google'i mandaadiga jääb see
keelatuks ja seda ei saa kombineerida [Batch mode](#batch-status-branch) režiimiga – sõlme paneel näitab,
millises seisus antud mandaat on, enne kui midagi käivitate.

Kui endpoint osutub käitusajal kättesaamatuks, siis sõlm ebaõnnestub põhjuse nimetava teatega,
mitte ei lülitu vaikselt tagasi, seega Responses API jaoks konfigureeritud sõlm töötab alati
selle peal. Et teadlikult teisele mandaadile või mudelile tagasi lülituda, kasutage välju **Fallback
Credential** ja **Fallback Model**; need pärandavad selle märkeruudu, seega ka fallback-mandaat
peab endpointi toetama.

## Pildi genereerimine

- **Mudelid:** `nanobanana`, `gemini-2.0-flash-exp`
- **Väljund:** `$nodeLabel.image` (base64 andme-URL)
- Kui kasutate prompti jaoks [Input](./input-node.md) sõlme, kasutage `userMessage` väljal `$userPrompt.body.text`

## JSON-väljund

Kui `jsonOutputEnabled` on true, tagastab LLM skeemile vastava JSON-i. Juurdepääs väljadele `$nodeLabel.fieldName` kaudu.

## Extra Body

Mõned pakkujad aktsepteerivad päringu parameetreid, mida standardsed OpenAI-ga ühilduvad väljad ei
hõlma, näiteks mudeli mõtlemisrežiimi keelamine. Märkige sõlme
atribuutides **Send extra request body** ja sisestage JSON-objekt. See ühendatakse igasse API-päringusse, mille see sõlm teeb.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Vaikimisi välja lülitatud.** Märkeruut väljas ei saadeta midagi lisa.
- Peab olema JSON-**objekt**. Massiiv, skalaar või vigane tekst põhjustab sõlme ebaõnnestumise
  veateatega `Invalid extra body JSON`, mitte ei jäeta seda vaikselt kõrvale.
- Märkeruudu kõrval olev nupp **Format** vormindab JSON-i ümber ja muutub punaseks, näidates
  `Invalid`, kui tekst ei ole parsitav.
- Rakendatakse põhilisele lõpetamisele, fallback-mudeli katsele ja batch mode päringutele.
  **Ei** rakendata pildi genereerimisele ega guardrail-kontrollidele, mis kasutavad erinevat päringu
  kuju ja eraldi mudelit.
- `$` avaldised lahendatakse enne parsimist, seega `{"max_tokens": $prev.limit}` töötab. Kuna
  see on tekstiline asendus, siis lahendatud väärtus, mis sisaldab jutumärki või reavahetust,
  tekitab vigase JSON-i ja sõlm ebaõnnestub.

## Näide – Tekst

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

## Näide – Batch-tekst

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

## Näide – Pildi genereerimine

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

Lubage sõlme atribuutides **Guardrails**, et blokeerida ebaturvalised kasutajateated enne LLM-i kutset. Täieliku viite leiate jaotisest [Guardrails](../reference/guardrails.md).

## Seotud

- [Agent Node](./agent-node.md) – LLM tööriistade kutsumisega
- [Why Heym](../getting-started/why-heym.md) – Kuhu LLM-i sammud agentide elutsüklis kuuluvad
- [Guardrails](../reference/guardrails.md) – Blokeerige ebaturvaliste sisu kategooriad
- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Expression DSL](../reference/expression-dsl.md) – Andmetele viitamine promptides
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Laiendatav redaktor, millel on promptide jaoks reaalajas backend-eelvaade
- [Credentials Tab](../tabs/credentials-tab.md) – LLM-i API-võtmete lisamine
- [Quick Start](../getting-started/quick-start.md) – Põhiline LLM workflow

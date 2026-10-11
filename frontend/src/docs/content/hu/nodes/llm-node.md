# LLM

Az **LLM** csomópont szöveget dolgoz fel nyelvi modellel, vagy képeket generál. Támogatja a szöveggenerálást, a látást (képbemenet), a képgenerálást, a strukturált JSON kimenetet, valamint a szolgáltató natív **Batch API** végrehajtását a támogatott szövegmodellek esetében.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1, valamint opcionális `batchStatus`, ha a batch mód engedélyezett |
| Kimenet | `$nodeLabel.text` (szöveg), `$nodeLabel.image` (kép) vagy batch eredmény mezők, például `$nodeLabel.results` |

## Paraméterek

### Hitelesítési adatok és modell

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | LLM hitelesítési adatok a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `model` | string | Modell neve (pl. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` képekhez) |
| `fallbackCredentialId` | UUID (opcionális) | Tartalék hitelesítési adatok, ha az elsődleges meghiúsul |
| `fallbackModel` | string (opcionális) | Tartalék modell, ha az elsődleges meghiúsul |

Ha az elsődleges hitelesítési adatok vagy modell hibát ad vissza, a csomópont automatikusan újrapróbálkozik a tartalék hitelesítési adatokkal és modellel, mielőtt meghiúsulna.

A Heym a kiválasztott hitelesítési adatokból és modellből a **batch képességet** is ellenőrzi. A batch mód az alábbiakhoz érhető el:

- OpenAI hitelesítési adatok
- Egyedi / OpenAI-kompatibilis hitelesítési adatok, amelyeknek az endpointja biztosítja a szükséges `/v1/files` és `/v1/batches` API-kat

Ha a kiválasztott szolgáltató vagy modell nem támogatja a batch végrehajtást, a Tulajdonságok panel ezt közvetlenül jelzi, és letiltja a kapcsolót.

### Promptok (szöveg mód)

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt. Támogatja a [kifejezéseket](../reference/expression-dsl.md). |
| `userMessage` | string | Felhasználói üzenet. Alapértelmezett: `$input.text` |
| `temperature` | number | 0.0–2.0 (alapértelmezett: 0.7) |
| `maxTokens` | number | Válasz tokenek maximális száma (opcionális) |
| `requestTimeoutSeconds` | number | A modell válaszára való várakozás maximális másodpercei az időtúllépés előtt (alapértelmezett: 60). Növelje lassú vagy saját üzemeltetésű szolgáltatók (LiteLLM, vLLM, helyi modellek) esetén. |

### Kép és kimenet

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Szöveg- vagy képgenerálás |
| `imageInputEnabled` | boolean | Kép csatolása a felhasználói üzenethez (látás) |
| `imageInput` | expression | Base64 data URL vagy kép URL |
| `jsonOutputEnabled` | boolean | Strukturált JSON kimenet |
| `jsonOutputSchema` | string | JSON Schema a strukturált kimenethez |
| `extraBodyEnabled` | boolean | Szolgáltató-specifikus kérés paraméterek küldése (alapértelmezett: `false`) |
| `extraBody` | string | Az API kérés törzsébe egyesített JSON objektum |

### Reasoning modellek (o1, o3)

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Engedélyezés reasoning modellekhez |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning mélység |

### Batch mód

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | A szolgáltató natív Batch API-jának használata egyedi kérés végrehajtás helyett |

A batch mód csak az **LLM** csomóponton érhető el. **Nem** vonatkozik az [Agent csomópontra](./agent-node.md).

Ha a batch mód engedélyezett:

- az `outputType` értéke `text` kell maradjon
- az `imageInputEnabled` értéke `false` kell maradjon
- a `userMessage` értékének **tömbként** kell feloldódnia
- a tömb minden elemének string vagy primitív értékké kell feloldódnia

Tipikus példák:

- `$input.items.map("item.text")`
- `$vars.promptList`

Ha a kifejezés egyetlen stringgé oldódik fel tömb helyett, a futtatás érvényesítési hibával meghiúsul, mielőtt a szolgáltató hívása elkezdődne.

## Batch állapot ág

Ha a batch mód engedélyezett, az LLM csomópont egy második kimeneti fogantyút tesz elérhetővé: `batchStatus`.

Ezt az ágat használja értesítésekhez, naplózáshoz, Slack üzenetekhez vagy mellékhatásokhoz, amíg a batch még fut. Az ág akkor aktiválódik, amikor a szolgáltató állapota érdemben megváltozik, beleértve a normalizált állapotokat, például:

- `pending`
- `processing`
- `completed`
- `failed`

Az állapot ág payloadja `$input` néven érhető el a downstream csomópontokban, és a következőket tartalmazza:

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

Példa él:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Példa állapot mapper:

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

## Batch eredmény alakja

Sikeres befejezés esetén a fő LLM kimenet a következőket tartalmazza:

- `$nodeLabel.text` – összefűzött sikeres szövegek
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – elemenkénti eredmények eredeti sorrendben
- `$nodeLabel.usage`

A `$nodeLabel.results` minden eleme olyan mezőket tartalmaz, mint:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Ha a **JSON kimenet** a batch móddal együtt engedélyezett, a Heym minden sikeres elemet külön dolgoz fel. A feldolgozott objektumok elemenként érhetők el, és a `parsedResults` gyűjteményben gyűjtve vannak.
## Responses API

A **Use Responses API** jelölőnégyzet a csomópont hívását a
[Responses API](https://platform.openai.com/docs/api-reference/responses) felé irányítja a Chat
Completions helyett. Alapértelmezés szerint ki van kapcsolva, és a csomópont mindkét esetben
ugyanúgy viselkedik: ugyanazok a promptok, ugyanaz a JSON kimeneti séma, ugyanaz az
eredményforma.

OpenAI hitelesítési adatokkal működik, valamint olyan egyéni hitelesítési adatokkal, amelyeknek
az átjárója támogatja az endpointot, így egy saját üzemeltetésű vagy proxyn keresztüli beállítás
is használhatja. Google hitelesítési adatokkal letiltva marad, és nem kombinálható a
[Batch mode](#batch-status-branch) funkcióval – a csomópont panelje a futtatás előtt jelzi, hogy
egy adott hitelesítési adat hol áll.

Ha az endpoint futásidőben elérhetetlennek bizonyul, a csomópont egy az okot megnevező üzenettel
meghiúsul, ahelyett hogy csendben visszaesne, így a Responses API-ra konfigurált csomópont mindig
azon fut. A más hitelesítési adatra vagy modellre való szándékos visszaeséshez használja a
**Fallback Credential** és **Fallback Model** mezőket; ezek öröklik ezt a jelölőnégyzetet, így a
fallback hitelesítési adatoknak is támogatniuk kell az endpointot.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Amikor a prompthoz az [Input](./input-node.md) csomópontot használja, a `userMessage` mezőben a `$userPrompt.body.text` kifejezést adja meg

## JSON Output

Amikor a `jsonOutputEnabled` értéke true, az LLM a sémának megfelelő JSON-t ad vissza. A mezőket a `$nodeLabel.fieldName` segítségével érheti el.

## Extra Body

Egyes szolgáltatók olyan kérési paramétereket fogadnak el, amelyeket a szabványos
OpenAI-kompatibilis mezők nem fednek le, például egy modell gondolkodási módjának letiltását.
Jelölje be a **Send extra request body** opciót a csomópont tulajdonságai között, és adjon meg
egy JSON objektumot. Ez beolvad a csomópont minden API-kérésébe.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Alapértelmezés szerint letiltva.** Kikapcsolt jelölőnégyzet esetén semmi extra nem kerül elküldésre.
- JSON **objektumnak** kell lennie. Egy tömb, skalár vagy hibás formátumú szöveg a csomópontot
  `Invalid extra body JSON` hibával buktatja el, ahelyett hogy csendben elvetné.
- A jelölőnégyzet melletti **Format** gomb újraformázza a JSON-t, és pirosra vált `Invalid`
  felirattal, amikor a szöveg nem elemezhető.
- A fő completionre, a fallback modellkísérletre és a batch mode kérésekre is alkalmazódik.
  **Nem** alkalmazódik a képgenerálásra vagy a guardrail-ellenőrzésekre, amelyek eltérő
  kérésformát és külön modellt használnak.
- A `$` kifejezések az elemzés előtt kiértékelődnek, így a `{"max_tokens": $prev.limit}` működik.
  Mivel ez szöveges helyettesítés, egy kiértékelt érték, amely idézőjelet vagy sortörést
  tartalmaz, érvénytelen JSON-t eredményez, és a csomópont meghiúsul.

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

Engedélyezze a **Guardrails** opciót a csomópont tulajdonságai között, hogy az LLM hívás előtt
blokkolja a nem biztonságos felhasználói üzeneteket. A teljes referenciáért lásd a
[Guardrails](../reference/guardrails.md) oldalt.

## Related

- [Agent Node](./agent-node.md) – LLM eszközhívással
- [Why Heym](../getting-started/why-heym.md) – Hol illeszkednek az LLM lépések az ügynök életciklusába
- [Guardrails](../reference/guardrails.md) – Nem biztonságos tartalomkategóriák blokkolása
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Expression DSL](../reference/expression-dsl.md) – Adatokra való hivatkozás promptokban
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Bővíthető szerkesztő élő backend előnézettel a promptokhoz
- [Credentials Tab](../tabs/credentials-tab.md) – LLM API-kulcsok hozzáadása
- [Quick Start](../getting-started/quick-start.md) – Alapvető LLM workflow

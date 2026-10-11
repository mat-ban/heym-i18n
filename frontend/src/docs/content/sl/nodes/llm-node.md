# LLM

Vozlišče **LLM** obdeluje besedilo z jezikovnim modelom ali generira slike. Podpira generacijo besedila, vizijo (vhodne slike), generacijo slik, strukturiran JSON izhod in izvajanje **Batch API** za podprte besedilne modele.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 1 |
| Izhodi | 1, plus opcionalni `batchStatus`, ko je omogočen način serijskega izvajanja |
| Izhod | `$nodeLabel.text` (besedilo), `$nodeLabel.image` (slika) ali polja rezultatov serije, kot so `$nodeLabel.results` |

## Parametri

### Poverilnice in model

| Parameter | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | LLM poverilnica iz [Poverilnic](../tabs/credentials-tab.md) |
| `model` | niz | Ime modela (npr. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` za slike) |
| `fallbackCredentialId` | UUID (opcijsko) | Poverilnica za rezervno uporabo, ko primarna ne uspe |
| `fallbackModel` | niz (opcijsko) | Rezervni model, ko primarni ne uspe |

Če primarna poverilnica ali model vrne napako, vozlišče samodejno poskusi z rezervno poverilnico in modelom, preden se izvede neuspeh.

Heym prav tako preveri **možnost serijskega izvajanja** iz izbrane poverilnice in modela. Način serijskega izvajanja je na voljo za:

- OpenAI poverilnice
- Prilagojene / OpenAI-ustrezne poverilnice, katerih endpoint izpostavlja zahtevane API-je `/v1/files` in `/v1/batches`

Če izbrani ponudnik ali model ne podpira serijskega izvajanja, se to neposredno prikaže v plošči lastnosti in onemogoči preklop.

### Pozivi (besedilni način)

| Parameter | Tip | Opis |
|-----------|-----|------|
| `systemInstruction` | niz | Sistemskega poziv. Podpira [izraze](../reference/expression-dsl.md). |
| `userMessage` | niz | Sporočilo uporabnika. Privzeto: `$input.text` |
| `temperature` | število | 0.0–2.0 (privzeto: 0.7) |
| `maxTokens` | število | Maksimalno število tokenov v odgovoru (opcijsko) |
| `requestTimeoutSeconds` | število | Maksimalno število sekund za čakanje na odgovor modela pred časovno omejitvijo (privzeto: 60). Povečajte ga za počasne ali samostojno gostovane ponudnike (LiteLLM, vLLM, lokalni modeli). |

### Slika in izhod

| Parameter | Tip | Opis |
|-----------|-----|------|
| `outputType` | `"text"` \| `"image"` | Generacija besedila ali slike |
| `imageInputEnabled` | boolean | Vključite sliko z uporabniškim sporočilom (vizija) |
| `imageInput` | izraz | Base64 podatkovni URL ali URL slike |
| `jsonOutputEnabled` | boolean | Strukturiran JSON izhod |
| `jsonOutputSchema` | niz | JSON shema za strukturiran izhod |
| `extraBodyEnabled` | boolean | Pošljite specifične parametre zahtevka ponudnika (privzeto: `false`) |
| `extraBody` | niz | JSON objekt, združen v telo API zahtevka |

### Modeli razmišljanja (o1, o3)

| Parameter | Tip | Opis |
|-----------|-----|------|
| `isReasoningModel` | boolean | Omogočite za modele razmišljanja |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Globina razmišljanja |

### Način serijskega izvajanja

| Parameter | Tip | Opis |
|-----------|-----|------|
| `batchModeEnabled` | boolean | Uporabite ponudnikov **Batch API** namesto izvajanja posameznih zahtevkov |

Način serijskega izvajanja je na voljo samo na vozlišču **LLM**. Ne velja za [Agent Node](./agent-node.md).

Ko je način serijskega izvajanja omogočen:

- `outputType` mora ostati `text`
- `imageInputEnabled` mora ostati `false`
- `userMessage` mora biti rešeno v **niz**
- vsak element niza mora biti rešitev v niz ali primitivno vrednost

Tipični primeri:

- `$input.items.map("item.text")`
- `$vars.promptList`

Če se izraz reši v en sam niz namesto v niz, se izvajanje konča z napako validacije, preden se začne klic ponudnika.

## Veja statusa serije

Ko je način serijskega izvajanja omogočen, vozlišče LLM izpostavi drugi izhodni ročaj: `batchStatus`.

Uporabite to vejo za obvestila, beleženje, Slack sporočila ali stranske učinke, medtem ko serija še vedno teče. Veja se sproži, kadar se status ponudnika pomembno spremeni, vključno z normaliziranimi stanji, kot so:

- `pending`
- `processing`
- `completed`
- `failed`

Payload statusne veje je na voljo kot `$input` znotraj spodnjih vozlišč in vključuje:

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

Primer robne povezave:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Primer mapperja statusa:

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

## Oblika rezultatov serije

Ob uspešnem zaključku glavni izhod LLM vsebuje:

- `$nodeLabel.text` – združena uspešna besedila
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – rezultati po elementih v prvotnem vrstnem redu
- `$nodeLabel.usage`

Vsak element v `$nodeLabel.results` vključuje polja, kot so:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Ko je **JSON izhod** omogočen skupaj z načinom serijskega izvajanja, Heym ločeno analizira vsak uspešen element. Analizirani objekti so izpostavljeni po elementu in zbrani v `parsedResults`.
## API za odgovore

Checkbox **Uporabi API za odgovore** usmeri klic vozlišča skozi
[API za odgovore](https://platform.openai.com/docs/api-reference/responses) namesto Chat
Completions. Privzeto je izklopljen, vozlišče pa se obnaša enako v obeh primerih: enaki prompti,
enaka JSON izhodna shema, enaka oblika rezultatov.

Deluje z OpenAI poverilnico in s prilagojeno poverilnico, katere prehod podpira
endpoint, tako da ga lahko uporabljate tudi v samostojni ali posredovani nastavitvi. Z Google poverilnico ostane
izklopljen in ga ni mogoče kombinirati z [Batch mode](#batch-status-branch) - plošča vozlišča prikazuje,
kako je določena poverilnica nastavljena, preden izvedete karkoli.

Če se izkaže, da je endpoint med izvajanjem nedostopen, vozlišče ne uspe z obvestilom, ki navaja
vzrok, namesto da bi tiho preklopilo, tako da vozlišče, konfigurirano za API za odgovore, vedno
deluje na njem. Za namerno preklapljanje na drugo poverilnico ali model uporabite polji **Fallback
Credential** in **Fallback Model**; ta dedujeta to checkbox, tako da mora tudi poverilnica za preklop
podpirati endpoint.

## Generiranje slik

- **Modeli:** `nanobanana`, `gemini-2.0-flash-exp`
- **Izhod:** `$nodeLabel.image` (base64 podatkovni URL)
- Ko uporabljate [Vhod](./input-node.md) za prompt, uporabite `$userPrompt.body.text` v `userMessage`

## JSON izhod

Ko je `jsonOutputEnabled` nastavljen na true, LLM vrne JSON, ki ustreza shemi. Dostopajte do polj preko `$nodeLabel.fieldName`.

## Dodatno telo

Nekateri ponudniki sprejemajo parametre zahtevka, ki jih standardna polja, združljiva z OpenAI, ne pokrivajo, kot je onemogočanje načina razmišljanja modela. Označite **Pošlji dodatno telo zahtevka** v lastnostih vozlišča in vnesite JSON objekt. Ta se združi v vsak API zahtevek, ki ga to vozlišče izvede.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Privzeto izklopljeno.** Ko je checkbox izklopljen, se ne pošlje nič dodatnega.
- Mora biti JSON **objekt**. Polje, skalar ali napačno oblikovan tekst povzroči napako vozlišča z
  `Invalid extra body JSON`, namesto da bi bil tiho zavržen.
- Gumb **Format** poleg checkboxa preoblikuje JSON in postane rdeč, ko prebere
  `Invalid`, ko besedilo ne more biti razčlenjeno.
- Uporablja se za glavno dokončanje, poskus modela za preklop in zahteve v načinu serijskega izvajanja.
  **Ne** uporablja se za generiranje slik ali za preverjanje varnostnih mehanizmov, ki uporabljajo drugačno obliko zahtevka in ločen model.
- `$` izrazi se razrešijo pred razčlenjevanjem, tako da `{"max_tokens": $prev.limit}` deluje. Ker
  gre za tekstovno zamenjavo, razrešena vrednost, ki vsebuje dvojni narekovaj ali novo vrstico,
  ustvari neveljaven JSON in povzroči napako vozlišča.

## Primer – Besedilo

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "Ste koristni asistent.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Primer – Serijsko besedilo

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
        "variableValue": "$array(\"Povzemite to fakturo\", \"Napišite e-pošto za nadaljevanje\", \"Razvrstite status fakture\")"
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
        "systemInstruction": "Na vsako točko odgovorite kratko.",
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

## Primer – Generiranje slik

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

## Varnostni mehanizmi

Omogočite **Varnostne mehanizme** v lastnostih vozlišča, da blokirate nevarna uporabniška sporočila pred klicem LLM. Oglejte si [Varnostni mehanizmi](../reference/guardrails.md) za celotno referenco.

## Sorodno

- [Agent Node](./agent-node.md) – LLM z klicem orodij
- [Zakaj Heym](../getting-started/why-heym.md) – Kje se koraki LLM ujemajo v življenjskem ciklu agenta
- [Varnostni mehanizmi](../reference/guardrails.md) – Blokirajte nevarne kategorije vsebine
- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Izrazni DSL](../reference/expression-dsl.md) – Referenciranje podatkov v promptih
- [Dialog za oceno izrazov](../reference/expression-evaluation-dialog.md) – Razširljiv urejevalnik z vnaprej prikazanim ozadjem za prompt
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte LLM API ključe
- [Hiter začetek](../getting-started/quick-start.md) – Osnovni workflow LLM

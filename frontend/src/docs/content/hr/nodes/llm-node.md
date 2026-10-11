# LLM

**LLM** čvor obrađuje tekst s modelom jezika ili generira slike. Podržava generaciju teksta, viziju (ulaz slike), generaciju slika, strukturirani JSON izlaz i izvršavanje **Batch API**-ja specifičnog za pružatelja za podržane tekstualne modele.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1, plus opcionalni `batchStatus` kada je omogućeno batch način rada |
| Izlaz | `$nodeLabel.text` (tekst), `$nodeLabel.image` (slika) ili polja rezultata batch-a kao što su `$nodeLabel.results` |

## Parametri

### Vjerodajnice i model

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | LLM vjerodajnica iz [Vjerodajnica](../tabs/credentials-tab.md) |
| `model` | string | Ime modela (npr. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` za slike) |
| `fallbackCredentialId` | UUID (opcionalno) | Vjerodajnica za rezervu kada primarna ne uspije |
| `fallbackModel` | string (opcionalno) | Model za rezervu kada primarni ne uspije |

Ako primarna vjerodajnica ili model vrate grešku, čvor automatski ponavlja s rezervnom vjerodajnicom i modelom prije nego što ne uspije.

Heym također provjerava **batch mogućnost** odabrane vjerodajnice i modela. Batch način rada dostupan je za:

- OpenAI vjerodajnice
- Prilagođene / OpenAI-kompatibilne vjerodajnice čiji endpoint izlaže potrebne `/v1/files` i `/v1/batches` API-je

Ako odabrani pružatelj ili model ne podržava batch izvršavanje, panel Svojstva to izravno prikazuje i onemogućava prekidač.

### Upiti (tekstualni način)

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `systemInstruction` | string | Sustavni upit. Podržava [izraze](../reference/expression-dsl.md). |
| `userMessage` | string | Poruka korisnika. Zadano: `$input.text` |
| `temperature` | number | 0.0–2.0 (zadano: 0.7) |
| `maxTokens` | number | Maksimalni broj tokena u odgovoru (opcionalno) |
| `requestTimeoutSeconds` | number | Maksimalno vrijeme čekanja na odgovor modela prije isteka (zadano: 60). Povećajte za spore ili samostalno hostane pružatelje (LiteLLM, vLLM, lokalni modeli). |

### Slika i izlaz

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generacija teksta ili slike |
| `imageInputEnabled` | boolean | Uključite sliku s porukom korisnika (vizija) |
| `imageInput` | expression | Base64 podaci URL-a ili URL slike |
| `jsonOutputEnabled` | boolean | Strukturirani JSON izlaz |
| `jsonOutputSchema` | string | JSON shema za strukturirani izlaz |
| `extraBodyEnabled` | boolean | Pošaljite specifične parametre zahtjeva za pružatelja (zadano: `false`) |
| `extraBody` | string | JSON objekt koji se spaja u tijelo API zahtjeva |

### Modeli razmišljanja (o1, o3)

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Omogućite za modele razmišljanja |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Dubina razmišljanja |

### Batch način rada

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Koristite pružateljski Batch API umjesto izvršavanja pojedinačnih zahtjeva |

Batch način rada dostupan je samo na **LLM** čvoru. Ne primjenjuje se na [Agent Node](./agent-node.md).

Kada je batch način rada omogućen:

- `outputType` mora ostati `text`
- `imageInputEnabled` mora ostati `false`
- `userMessage` mora se razriješiti u **niz**
- svaki element niza mora se razriješiti u string ili primitivnu vrijednost

Tipični primjeri:

- `$input.items.map("item.text")`
- `$vars.promptList`

Ako se izraz razriješi u jedan string umjesto u niz, izvršavanje ne uspije s greškom validacije prije nego što poziv pružatelju započne.

## Batch Status Grana

Kada je batch način rada omogućen, LLM čvor izlaže drugi izlazni rukohvat: `batchStatus`.

Koristite tu granu za obavijesti, logiranje, Slack poruke ili nuspojave dok je batch još uvijek u tijeku. Grana se aktivira svaki put kada se status pružatelja značajno promijeni, uključujući normalizirane statuse kao što su:

- `pending`
- `processing`
- `completed`
- `failed`

Payload statusne grane dostupan je kao `$input` unutar nizvodnih čvorova i uključuje:

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

Primjer grane:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Primjer mappera statusa:

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

## Oblik rezultata batch-a

Pri uspješnom završetku, glavni LLM izlaz sadrži:

- `$nodeLabel.text` – spojeni uspješni tekstovi
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – rezultati po stavci u izvornom redoslijedu
- `$nodeLabel.usage`

Svaka stavka u `$nodeLabel.results` uključuje polja kao što su:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Kada je **JSON izlaz** omogućen zajedno s batch načinom rada, Heym analizira svaku uspješnu stavku posebno. Analizirani objekti izlažu se po stavci i prikupljaju na `parsedResults`.
## Responses API

Checkbox **Koristi Responses API** usmjerava poziv čvora kroz
[Responses API](https://platform.openai.com/docs/api-reference/responses) umjesto Chat
Completions. Zadano je isključeno, a čvor se ponaša isto u oba slučaja: isti prompti,
isti JSON izlazni shema, isti oblik rezultata.

Radi s OpenAI vjerodajnicom, kao i s prilagođenom vjerodajnicom čija pristupna točka podržava
endpoint, tako da se može koristiti i u samostalnom ili posredničkom postavku. S Google
vjerodajnicom ostaje onemogućeno, i ne može se kombinirati s [Batch mode](#batch-status-branch) - panel čvora prikazuje
gdje se određena vjerodajnica nalazi prije nego što pokrenete bilo što.

Ako se ispostavi da je endpoint nedostupan tijekom izvođenja, čvor ne uspijeva s porukom koja
navodi uzrok umjesto da tiho padne, tako da čvor konfiguriran za Responses API uvijek
radi na njemu. Da biste namjerno prešli na drugu vjerodajnicu ili model, koristite polja **Fallback
Credential** i **Fallback Model**; ona nasljeđuju ovu oznaku, tako da i fallback vjerodajnica
mora podržavati endpoint.

## Generiranje slika

- **Modeli:** `nanobanana`, `gemini-2.0-flash-exp`
- **Izlaz:** `$nodeLabel.image` (base64 data URL)
- Kada koristite [Input](./input-node.md) za prompt, koristite `$userPrompt.body.text` u `userMessage`

## JSON izlaz

Kada je `jsonOutputEnabled` postavljen na true, LLM vraća JSON koji odgovara shemi. Pristupite poljima putem `$nodeLabel.fieldName`.

## Dodatno tijelo

Neki pružatelji prihvaćaju parametre zahtjeva koje standardna OpenAI-kompatibilna polja ne pokrivaju, poput onemogućavanja načina razmišljanja modela. Označite **Pošaljite dodatno tijelo zahtjeva** u svojstvima čvora i unesite JSON objekt. On se spaja u svaki API zahtjev koji ovaj čvor pravi.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Zadano onemogućeno.** Kada je oznaka isključena, ništa dodatno se ne šalje.
- Mora biti JSON **objekt**. Niz, skalar ili neispravan tekst uzrokuje neuspjeh čvora s
  `Invalid extra body JSON` umjesto da bude tiho odbačen.
- **Format** gumb pored oznake ponovo formatira JSON i postaje crven s natpisom
  `Invalid` kada tekst ne može biti analiziran.
- Primjenjuje se na glavno izvršavanje, pokušaj fallback modela i zahtjeve u batch modu.
  **Ne** primjenjuje se na generiranje slika ili na provjere sigurnosnih mjera, koje koriste drugačiji oblik zahtjeva i odvojen model.
- `$` izrazi se rješavaju prije analize, tako da `{"max_tokens": $prev.limit}` radi. Budući da
  se radi o tekstualnoj zamjeni, riješena vrijednost koja sadrži dvostruki navodnik ili novi redak
  proizvodi neispravan JSON i uzrokuje neuspjeh čvora.

## Primjer – Tekst

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "Vi ste korisni asistent.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Primjer – Batch tekst

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
        "variableValue": "$array(\"Sažmi ovu fakturu\", \"Napiši e-mail za praćenje\", \"Klasificiraj status fakture\")"
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
        "systemInstruction": "Odgovorite na svaku stavku sažeto.",
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

## Primjer – Generiranje slika

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

## Sigurnosne mjere

Omogućite **Sigurnosne mjere** u svojstvima čvora kako biste blokirali nesigurne korisničke poruke prije poziva LLM-a. Pogledajte [Sigurnosne mjere](../reference/guardrails.md) za potpuni pregled.

## Povezano

- [Agent Node](./agent-node.md) – LLM s pozivanjem alata
- [Zašto Heym](../getting-started/why-heym.md) – Gdje koraci LLM-a odgovaraju životnom ciklusu agenta
- [Sigurnosne mjere](../reference/guardrails.md) – Blokiranje nesigurnih kategorija sadržaja
- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Expression DSL](../reference/expression-dsl.md) – Referenciranje podataka u promptima
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Proširivi uređivač s pregledom u stvarnom vremenu za prompt
- [Credentials Tab](../tabs/credentials-tab.md) – Dodavanje LLM API ključeva
- [Brzi početak](../getting-started/quick-start.md) – Osnovni LLM workflow

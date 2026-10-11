# LLM

Nodul **LLM** procesează text cu un model lingvistic sau generează imagini. Acesta acceptă generare de text, vision (intrare imagine), generare de imagini, ieșire JSON structurată și execuție prin **Batch API** nativă a furnizorului pentru modelele text acceptate.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1, plus `batchStatus` opțional când modul batch este activat |
| Ieșire | `$nodeLabel.text` (text), `$nodeLabel.image` (imagine) sau câmpuri ale rezultatului batch precum `$nodeLabel.results` |

## Parametri

### Acreditări și model

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare LLM din [Acreditări](../tabs/credentials-tab.md) |
| `model` | string | Numele modelului (de ex. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` pentru imagini) |
| `fallbackCredentialId` | UUID (opțional) | Acreditare de rezervă când cea principală eșuează |
| `fallbackModel` | string (opțional) | Model de rezervă când cel principal eșuează |

Dacă acreditarea sau modelul principal returnează o eroare, nodul reîncearcă automat cu acreditarea și modelul de rezervă înainte de a eșua.

Heym verifică de asemenea **capacitatea batch** din acreditarea și modelul selectate. Modul batch este disponibil pentru:

- Acreditări OpenAI
- Acreditări personalizate / compatibile cu OpenAI al căror endpoint expune API-urile necesare `/v1/files` și `/v1/batches`

Dacă furnizorul sau modelul selectat nu acceptă execuția batch, panoul Properties afișează acest lucru direct și dezactivează comutatorul.

### Prompt-uri (mod text)

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistem. Acceptă [expresii](../reference/expression-dsl.md). |
| `userMessage` | string | Mesajul utilizatorului. Implicit: `$input.text` |
| `temperature` | number | 0.0–2.0 (implicit: 0.7) |
| `maxTokens` | number | Numărul maxim de token-uri pentru răspuns (opțional) |
| `requestTimeoutSeconds` | number | Numărul maxim de secunde de așteptare pentru răspunsul modelului înainte de expirare (implicit: 60). Măriți-l pentru furnizori lenți sau găzduiți local (LiteLLM, vLLM, modele locale). |

### Imagine și ieșire

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generare de text sau imagine |
| `imageInputEnabled` | boolean | Include imaginea împreună cu mesajul utilizatorului (vision) |
| `imageInput` | expression | URL de tip data Base64 sau URL de imagine |
| `jsonOutputEnabled` | boolean | Ieșire JSON structurată |
| `jsonOutputSchema` | string | JSON Schema pentru ieșire structurată |
| `extraBodyEnabled` | boolean | Trimite parametri de cerere specifici furnizorului (implicit: `false`) |
| `extraBody` | string | Obiect JSON îmbinat în corpul cererii API |

### Modele de raționament (o1, o3)

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Activați pentru modelele de raționament |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Adâncimea raționamentului |

### Modul batch

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Utilizați Batch API nativă a furnizorului în locul execuției cu o singură cerere |

Modul batch este disponibil doar pe nodul **LLM**. Acesta **nu** se aplică pentru [Nodul Agent](./agent-node.md).

Când modul batch este activat:

- `outputType` trebuie să rămână `text`
- `imageInputEnabled` trebuie să rămână `false`
- `userMessage` trebuie să se rezolve la un **array**
- fiecare element al array-ului trebuie să se rezolve la un string sau la o valoare primitivă

Exemple tipice:

- `$input.items.map("item.text")`
- `$vars.promptList`

Dacă expresia se rezolvă la un singur string în loc de un array, execuția eșuează cu o eroare de validare înainte de începerea apelului către furnizor.

## Ramura Batch Status

Când modul batch este activat, nodul LLM expune un al doilea handle de ieșire: `batchStatus`.

Utilizați acea ramură pentru notificări, jurnalizare, mesaje Slack sau efecte secundare în timp ce batch-ul este încă în execuție. Ramura se declanșează ori de câte ori starea furnizorului se schimbă semnificativ, inclusiv stări normalizate precum:

- `pending`
- `processing`
- `completed`
- `failed`

Payload-ul ramurii de status este disponibil ca `$input` în nodurile din aval și include:

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

Exemplu de muchie:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Exemplu de mapper de status:

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

## Structura rezultatului batch

La finalizarea cu succes, ieșirea principală a LLM conține:

- `$nodeLabel.text` – textele de succes concatenate
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – rezultatele per element în ordinea originală
- `$nodeLabel.usage`

Fiecare element din `$nodeLabel.results` include câmpuri precum:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Când **ieșirea JSON** este activată împreună cu modul batch, Heym analizează fiecare element de succes separat. Obiectele analizate sunt expuse per element și colectate în `parsedResults`.
## API Responses

O casetă de selectare **Use Responses API** direcționează apelul nodului prin
[Responses API](https://platform.openai.com/docs/api-reference/responses) în loc de Chat
Completions. Este dezactivată implicit, iar nodul se comportă la fel în ambele cazuri: aceleași prompt-uri,
aceeași schemă de ieșire JSON, aceeași formă a rezultatului.

Funcționează cu o acreditare OpenAI și cu o acreditare personalizată al cărei gateway acceptă
endpoint-ul, astfel încât o configurare self-hosted sau prin proxy o poate utiliza și ea. Cu o
acreditare Google rămâne dezactivată și nu poate fi combinată cu [Batch mode](#batch-status-branch) - panoul nodului indică
situația unei acreditări date înainte de a rula orice.

Dacă endpoint-ul se dovedește a fi indisponibil la momentul rulării, nodul eșuează cu un mesaj care numește
cauza, în loc să facă o revenire silențioasă, astfel încât un nod configurat pentru Responses API rulează întotdeauna
pe acesta. Pentru a reveni deliberat la o altă acreditare sau un alt model, utilizați câmpurile **Fallback
Credential** și **Fallback Model**; acestea moștenesc această casetă de selectare, astfel încât o acreditare de rezervă
trebuie să accepte și ea endpoint-ul.

## Generare de imagini

- **Modele:** `nanobanana`, `gemini-2.0-flash-exp`
- **Ieșire:** `$nodeLabel.image` (URL de date base64)
- Când se utilizează [Input](./input-node.md) pentru prompt, folosiți `$userPrompt.body.text` în `userMessage`

## Ieșire JSON

Când `jsonOutputEnabled` este true, LLM-ul returnează JSON conform schemei. Accesați câmpurile prin `$nodeLabel.fieldName`.

## Extra Body

Unii furnizori acceptă parametri de cerere pe care câmpurile standard compatibile cu OpenAI nu le
acoperă, cum ar fi dezactivarea modului de gândire al unui model. Bifați **Send extra request body** în
proprietățile nodului și introduceți un obiect JSON. Acesta este îmbinat în fiecare cerere API pe care o face acest nod.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Dezactivat implicit.** Cu caseta de selectare debifată, nu se trimite nimic suplimentar.
- Trebuie să fie un **obiect** JSON. Un array, o valoare scalară sau un text malformat face nodul să eșueze cu
  `Invalid extra body JSON`, în loc să fie eliminat silențios.
- Butonul **Format** de lângă caseta de selectare reformatează JSON-ul și devine roșu afișând
  `Invalid` atunci când textul nu poate fi analizat.
- Aplicat completării principale, încercării modelului de rezervă și cererilor în modul batch.
  **Nu** se aplică generării de imagini sau verificărilor guardrail, care folosesc o formă de cerere
  diferită și un model separat.
- Expresiile `$` sunt rezolvate înainte de analiză, astfel încât `{"max_tokens": $prev.limit}` funcționează. Deoarece
  aceasta este o substituție textuală, o valoare rezolvată care conține un ghilimel dublu sau o linie nouă
  produce JSON invalid și face nodul să eșueze.

## Exemplu – Text

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

## Exemplu – Text batch

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

## Exemplu – Generare de imagini

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

Activați **Guardrails** în proprietățile nodului pentru a bloca mesajele de utilizator nesigure înainte de apelul LLM. Consultați [Guardrails](../reference/guardrails.md) pentru referința completă.

## Asociate

- [Nod Agent](./agent-node.md) – LLM cu apelare de unelte
- [De ce Heym](../getting-started/why-heym.md) – Unde se încadrează pașii LLM în ciclul de viață al agentului
- [Guardrails](../reference/guardrails.md) – Blocați categoriile de conținut nesigur
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Expression DSL](../reference/expression-dsl.md) – Referirea datelor în prompt-uri
- [Dialogul de evaluare a expresiilor](../reference/expression-evaluation-dialog.md) – Editor extensibil cu previzualizare live în backend pentru prompt-uri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați chei API LLM
- [Pornire rapidă](../getting-started/quick-start.md) – Workflow LLM de bază

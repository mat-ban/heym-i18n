# LLM

Il nodo **LLM** elabora testo con un modello linguistico oppure genera immagini. Supporta la generazione di testo, la visione (input immagine), la generazione di immagini, l'output JSON strutturato e l'esecuzione tramite **Batch API** nativa del provider per i modelli di testo supportati.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1, più l'opzionale `batchStatus` quando la modalità batch è abilitata |
| Output | `$nodeLabel.text` (testo), `$nodeLabel.image` (immagine) oppure campi del risultato batch come `$nodeLabel.results` |

## Parametri

### Credenziale e modello

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale LLM da [Credenziali](../tabs/credentials-tab.md) |
| `model` | string | Nome del modello (es. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` per le immagini) |
| `fallbackCredentialId` | UUID (opzionale) | Credenziale di fallback quando quella primaria non funziona |
| `fallbackModel` | string (opzionale) | Modello di fallback quando quello primario non funziona |

Se la credenziale o il modello primario restituisce un errore, il nodo ritenta automaticamente con la credenziale e il modello di fallback prima di fallire.

Heym verifica inoltre la **capacità batch** della credenziale e del modello selezionati. La modalità batch è disponibile per:

- Credenziali OpenAI
- Credenziali personalizzate / compatibili con OpenAI il cui endpoint espone le API `/v1/files` e `/v1/batches` richieste

Se il provider o il modello selezionati non supportano l'esecuzione batch, il pannello delle proprietà lo indica direttamente e disabilita l'interruttore.

### Prompt (modalità testo)

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt di sistema. Supporta le [espressioni](../reference/expression-dsl.md). |
| `userMessage` | string | Messaggio utente. Predefinito: `$input.text` |
| `temperature` | number | 0.0–2.0 (predefinito: 0.7) |
| `maxTokens` | number | Numero massimo di token della risposta (opzionale) |
| `requestTimeoutSeconds` | number | Numero massimo di secondi di attesa per la risposta del modello prima del timeout (predefinito: 60). Aumentarlo per provider lenti o self-hosted (LiteLLM, vLLM, modelli locali). |

### Immagine e output

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generazione di testo o di immagine |
| `imageInputEnabled` | boolean | Includere un'immagine con il messaggio utente (visione) |
| `imageInput` | expression | Data URL Base64 oppure URL dell'immagine |
| `jsonOutputEnabled` | boolean | Output JSON strutturato |
| `jsonOutputSchema` | string | JSON Schema per l'output strutturato |
| `extraBodyEnabled` | boolean | Inviare parametri di richiesta specifici del provider (predefinito: `false`) |
| `extraBody` | string | Oggetto JSON unito al corpo della richiesta API |

### Modelli di ragionamento (o1, o3)

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Abilitare per i modelli di ragionamento |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profondità del ragionamento |

### Modalità batch

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Usare la Batch API nativa del provider invece dell'esecuzione a richiesta singola |

La modalità batch è disponibile solo sul nodo **LLM**. **Non** si applica al [Nodo Agent](./agent-node.md).

Quando la modalità batch è abilitata:

- `outputType` deve rimanere `text`
- `imageInputEnabled` deve rimanere `false`
- `userMessage` deve risolversi in un **array**
- ogni elemento dell'array deve risolversi in una stringa o in un valore primitivo

Esempi tipici:

- `$input.items.map("item.text")`
- `$vars.promptList`

Se l'espressione si risolve in una singola stringa anziché in un array, l'esecuzione fallisce con un errore di validazione prima che inizi la chiamata al provider.

## Ramo Batch Status

Quando la modalità batch è abilitata, il nodo LLM espone un secondo handle di output: `batchStatus`.

Utilizzare quel ramo per notifiche, logging, messaggi Slack o effetti collaterali mentre il batch è ancora in esecuzione. Il ramo si attiva ogni volta che lo stato del provider cambia in modo significativo, inclusi stati normalizzati come:

- `pending`
- `processing`
- `completed`
- `failed`

Il payload del ramo di stato è disponibile come `$input` all'interno dei nodi a valle e include:

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

Esempio di edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Esempio di mapper di stato:

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
## Struttura del risultato batch

Al completamento con esito positivo, l'output principale dell'LLM contiene:

- `$nodeLabel.text` – testi riusciti concatenati
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – risultati per singolo elemento nell'ordine originale
- `$nodeLabel.usage`

Ogni elemento in `$nodeLabel.results` include campi quali:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Quando l'**output JSON** è abilitato insieme alla modalità batch, Heym analizza separatamente ogni elemento riuscito. Gli oggetti analizzati sono esposti per singolo elemento e raccolti in `parsedResults`.

## Responses API

Una casella di controllo **Use Responses API** indirizza la chiamata del nodo attraverso la
[Responses API](https://platform.openai.com/docs/api-reference/responses) anziché Chat
Completions. È disattivata per impostazione predefinita e il nodo si comporta allo stesso modo in entrambi i casi: gli stessi prompt,
lo stesso schema di output JSON, la stessa struttura del risultato.

Funziona con una credenziale OpenAI e con una credenziale personalizzata il cui gateway supporta
l'endpoint, pertanto anche una configurazione self-hosted o con proxy può utilizzarla. Con una credenziale Google rimane
disabilitata e non può essere combinata con la [modalità Batch](#batch-status-branch) - il pannello del nodo indica
lo stato di una determinata credenziale prima di eseguire qualsiasi operazione.

Se l'endpoint risulta non disponibile in fase di esecuzione, il nodo fallisce con un messaggio che ne indica la
causa anziché effettuare un fallback silenzioso, pertanto un nodo configurato per la Responses API opera sempre su di essa. Per effettuare deliberatamente il fallback a un'altra credenziale o a un altro modello, utilizzare i campi **Fallback
Credential** e **Fallback Model**; essi ereditano questa casella di controllo, pertanto anche una credenziale di fallback
deve supportare l'endpoint.

## Generazione di immagini

- **Modelli:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (data URL base64)
- Quando si utilizza [Input](./input-node.md) per il prompt, usare `$userPrompt.body.text` in `userMessage`

## Output JSON

Quando `jsonOutputEnabled` è true, l'LLM restituisce JSON conforme allo schema. Accedere ai campi tramite `$nodeLabel.fieldName`.

## Extra Body

Alcuni provider accettano parametri di richiesta che i campi standard compatibili con OpenAI non
coprono, come la disattivazione della modalità di ragionamento di un modello. Selezionare **Send extra request body** nelle proprietà
del nodo e inserire un oggetto JSON. Esso viene unito a ogni richiesta API effettuata da questo nodo.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Disattivato per impostazione predefinita.** Con la casella di controllo deselezionata, non viene inviato nulla di aggiuntivo.
- Deve essere un **oggetto** JSON. Un array, uno scalare o un testo malformato fanno fallire il nodo con
  `Invalid extra body JSON` anziché essere ignorati silenziosamente.
- Il pulsante **Format** accanto alla casella di controllo riformatta il JSON e diventa rosso con la dicitura
  `Invalid` quando il testo non è analizzabile.
- Applicato al completamento principale, al tentativo con modello di fallback e alle richieste in modalità batch.
  **Non** applicato alla generazione di immagini né ai controlli di guardrail, che utilizzano una struttura di richiesta
  diversa e un modello separato.
- Le espressioni `$` vengono risolte prima dell'analisi, pertanto `{"max_tokens": $prev.limit}` funziona. Poiché
  si tratta di sostituzione testuale, un valore risolto contenente un doppio apice o un carattere di nuova riga
  produce JSON non valido e fa fallire il nodo.

## Esempio – Testo

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
## Esempio – Testo in batch

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

## Esempio – Generazione di immagini

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

Abilitare **Guardrails** nelle proprietà del nodo per bloccare i messaggi utente non sicuri prima della chiamata al LLM. Per il riferimento completo, consultare [Guardrails](../reference/guardrails.md).

## Correlati

- [Nodo Agent](./agent-node.md) – LLM con tool calling
- [Perché Heym](../getting-started/why-heym.md) – Dove si collocano i passaggi LLM nel ciclo di vita dell'agente
- [Guardrails](../reference/guardrails.md) – Bloccare le categorie di contenuti non sicuri
- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Expression DSL](../reference/expression-dsl.md) – Riferimento ai dati nei prompt
- [Finestra di valutazione delle espressioni](../reference/expression-evaluation-dialog.md) – Editor espandibile con anteprima backend in tempo reale per i prompt
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere le chiavi API del LLM
- [Avvio rapido](../getting-started/quick-start.md) – Workflow LLM di base

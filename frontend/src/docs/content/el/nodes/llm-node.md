# LLM

Ο **node** **LLM** επεξεργάζεται κείμενο με ένα γλωσσικό μοντέλο ή παράγει εικόνες. Υποστηρίζει παραγωγή κειμένου, όραση (είσοδος εικόνας), παραγωγή εικόνας, δομημένη έξοδο JSON και εκτέλεση μέσω του εγγενούς **Batch API** του παρόχου για υποστηριζόμενα μοντέλα κειμένου.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1, συν προαιρετικό `batchStatus` όταν είναι ενεργοποιημένη η λειτουργία batch |
| Έξοδος | `$nodeLabel.text` (κείμενο), `$nodeLabel.image` (εικόνα) ή πεδία αποτελέσματος batch όπως `$nodeLabel.results` |

## Παράμετροι

### Διαπιστευτήριο & Μοντέλο

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο LLM από τα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `model` | string | Όνομα μοντέλου (π.χ. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` για εικόνες) |
| `fallbackCredentialId` | UUID (προαιρετικό) | Εφεδρικό διαπιστευτήριο όταν αποτυγχάνει το κύριο |
| `fallbackModel` | string (προαιρετικό) | Εφεδρικό μοντέλο όταν αποτυγχάνει το κύριο |

Εάν το κύριο διαπιστευτήριο ή μοντέλο επιστρέψει σφάλμα, ο node επαναλαμβάνει αυτόματα με το εφεδρικό διαπιστευτήριο και μοντέλο προτού αποτύχει.

Το Heym ελέγχει επίσης τη **δυνατότητα batch** από το επιλεγμένο διαπιστευτήριο και μοντέλο. Η λειτουργία batch είναι διαθέσιμη για:

- Διαπιστευτήρια OpenAI
- Προσαρμοσμένα / συμβατά με OpenAI διαπιστευτήρια των οποίων το endpoint εκθέτει τα απαιτούμενα API `/v1/files` και `/v1/batches`

Εάν ο επιλεγμένος πάροχος ή μοντέλο δεν υποστηρίζει εκτέλεση batch, ο πίνακας Ιδιοτήτων το εμφανίζει άμεσα και απενεργοποιεί τον διακόπτη.

### Prompts (λειτουργία κειμένου)

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `systemInstruction` | string | System prompt. Υποστηρίζει [εκφράσεις](../reference/expression-dsl.md). |
| `userMessage` | string | Μήνυμα χρήστη. Προεπιλογή: `$input.text` |
| `temperature` | number | 0.0–2.0 (προεπιλογή: 0.7) |
| `maxTokens` | number | Μέγιστος αριθμός tokens απόκρισης (προαιρετικό) |
| `requestTimeoutSeconds` | number | Μέγιστος αριθμός δευτερολέπτων αναμονής για την απόκριση του μοντέλου πριν από το timeout (προεπιλογή: 60). Αυξήστε το για αργούς ή self-hosted παρόχους (LiteLLM, vLLM, τοπικά μοντέλα). |

### Εικόνα & Έξοδος

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Παραγωγή κειμένου ή εικόνας |
| `imageInputEnabled` | boolean | Συμπερίληψη εικόνας με το μήνυμα χρήστη (όραση) |
| `imageInput` | expression | Base64 data URL ή URL εικόνας |
| `jsonOutputEnabled` | boolean | Δομημένη έξοδος JSON |
| `jsonOutputSchema` | string | JSON Schema για δομημένη έξοδο |
| `extraBodyEnabled` | boolean | Αποστολή παραμέτρων αιτήματος ειδικών για τον πάροχο (προεπιλογή: `false`) |
| `extraBody` | string | Αντικείμενο JSON που συγχωνεύεται στο σώμα του αιτήματος API |

### Μοντέλα συλλογισμού (o1, o3)

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Ενεργοποίηση για μοντέλα συλλογισμού |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Βάθος συλλογισμού |

### Λειτουργία Batch

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Χρήση του εγγενούς Batch API του παρόχου αντί για εκτέλεση μεμονωμένου αιτήματος |

Η λειτουργία batch είναι διαθέσιμη μόνο στον node **LLM**. **Δεν** εφαρμόζεται στον [Agent Node](./agent-node.md).

Όταν είναι ενεργοποιημένη η λειτουργία batch:

- Το `outputType` πρέπει να παραμένει `text`
- Το `imageInputEnabled` πρέπει να παραμένει `false`
- Το `userMessage` πρέπει να επιλύεται σε **array**
- κάθε στοιχείο του array πρέπει να επιλύεται σε string ή πρωταρχική τιμή

Τυπικά παραδείγματα:

- `$input.items.map("item.text")`
- `$vars.promptList`

Εάν η έκφραση επιλυθεί σε ένα μόνο string αντί για array, η εκτέλεση αποτυγχάνει με σφάλμα επικύρωσης προτού ξεκινήσει η κλήση στον πάροχο.

## Διακλάδωση Κατάστασης Batch

Όταν είναι ενεργοποιημένη η λειτουργία batch, ο node LLM εκθέτει ένα δεύτερο handle εξόδου: `batchStatus`.

Χρησιμοποιήστε αυτή τη διακλάδωση για ειδοποιήσεις, καταγραφή, μηνύματα Slack ή παρενέργειες ενώ το batch εκτελείται ακόμη. Η διακλάδωση ενεργοποιείται κάθε φορά που η κατάσταση του παρόχου αλλάζει ουσιαστικά, συμπεριλαμβανομένων κανονικοποιημένων καταστάσεων όπως:

- `pending`
- `processing`
- `completed`
- `failed`

Το payload της διακλάδωσης κατάστασης είναι διαθέσιμο ως `$input` εντός των downstream nodes και περιλαμβάνει:

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

Παράδειγμα edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Παράδειγμα status mapper:

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

## Δομή Αποτελέσματος Batch

Με την επιτυχή ολοκλήρωση, η κύρια έξοδος του LLM περιέχει:

- `$nodeLabel.text` – συνενωμένα επιτυχή κείμενα
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – αποτελέσματα ανά στοιχείο με την αρχική σειρά
- `$nodeLabel.usage`

Κάθε στοιχείο στο `$nodeLabel.results` περιλαμβάνει πεδία όπως:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Όταν είναι ενεργοποιημένη η **έξοδος JSON** μαζί με τη λειτουργία batch, το Heym αναλύει κάθε επιτυχές στοιχείο ξεχωριστά. Τα αναλυμένα αντικείμενα εκτίθενται ανά στοιχείο και συλλέγονται στο `parsedResults`.
## Responses API

Ένα πλαίσιο ελέγχου **Use Responses API** δρομολογεί την κλήση του node μέσω του
[Responses API](https://platform.openai.com/docs/api-reference/responses) αντί για Chat
Completions. Είναι απενεργοποιημένο από προεπιλογή και το node συμπεριφέρεται το ίδιο και στις δύο περιπτώσεις: τα ίδια prompts,
το ίδιο σχήμα εξόδου JSON, το ίδιο σχήμα αποτελέσματος.

Λειτουργεί με ένα διαπιστευτήριο OpenAI, καθώς και με ένα προσαρμοσμένο διαπιστευτήριο του οποίου το gateway υποστηρίζει το
endpoint, ώστε μια self-hosted ή proxied εγκατάσταση να μπορεί επίσης να το χρησιμοποιήσει. Με ένα διαπιστευτήριο Google παραμένει
απενεργοποιημένο και δεν μπορεί να συνδυαστεί με τη [Batch mode](#batch-status-branch) - το πάνελ του node αναφέρει
πού βρίσκεται ένα δεδομένο διαπιστευτήριο προτού εκτελέσετε οτιδήποτε.

Εάν το endpoint αποδειχθεί μη διαθέσιμο κατά τον χρόνο εκτέλεσης, το node αποτυγχάνει με μήνυμα που αναφέρει την
αιτία αντί να κάνει σιωπηλά fallback, ώστε ένα node που έχει ρυθμιστεί για το Responses API να εκτελείται πάντα
σε αυτό. Για να κάνετε fallback σε άλλο διαπιστευτήριο ή μοντέλο σκόπιμα, χρησιμοποιήστε τα πεδία **Fallback
Credential** και **Fallback Model**· κληρονομούν αυτό το πλαίσιο ελέγχου, επομένως ένα διαπιστευτήριο fallback
πρέπει επίσης να υποστηρίζει το endpoint.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Όταν χρησιμοποιείτε το [Input](./input-node.md) για το prompt, χρησιμοποιήστε το `$userPrompt.body.text` στο `userMessage`

## JSON Output

Όταν το `jsonOutputEnabled` είναι true, το LLM επιστρέφει JSON που αντιστοιχεί στο schema. Πρόσβαση στα πεδία μέσω `$nodeLabel.fieldName`.

## Extra Body

Ορισμένοι providers δέχονται παραμέτρους αιτήματος που τα τυπικά πεδία συμβατά με OpenAI δεν
καλύπτουν, όπως η απενεργοποίηση της λειτουργίας σκέψης ενός μοντέλου. Επιλέξτε **Send extra request body** στις ιδιότητες
του node και εισαγάγετε ένα αντικείμενο JSON. Συγχωνεύεται σε κάθε αίτημα API που κάνει αυτό το node.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Απενεργοποιημένο από προεπιλογή.** Με το πλαίσιο ελέγχου ανενεργό, δεν αποστέλλεται τίποτα επιπλέον.
- Πρέπει να είναι ένα **αντικείμενο** JSON. Ένας πίνακας, μια κλιμακωτή τιμή ή κακοσχηματισμένο κείμενο προκαλεί αποτυχία του node με
  `Invalid extra body JSON` αντί να απορρίπτεται σιωπηλά.
- Το κουμπί **Format** δίπλα στο πλαίσιο ελέγχου επαναμορφοποιεί το JSON και γίνεται κόκκινο διαβάζοντας
  `Invalid` όταν το κείμενο δεν μπορεί να αναλυθεί.
- Εφαρμόζεται στην κύρια ολοκλήρωση, στην προσπάθεια του μοντέλου fallback και στα αιτήματα batch mode.
  **Δεν** εφαρμόζεται στη δημιουργία εικόνων ή στους ελέγχους guardrail, που χρησιμοποιούν διαφορετικό σχήμα
  αιτήματος και ξεχωριστό μοντέλο.
- Οι εκφράσεις `$` επιλύονται πριν από την ανάλυση, επομένως το `{"max_tokens": $prev.limit}` λειτουργεί. Επειδή
  πρόκειται για κειμενική αντικατάσταση, μια επιλυμένη τιμή που περιέχει διπλό εισαγωγικό ή αλλαγή γραμμής
  παράγει μη έγκυρο JSON και προκαλεί αποτυχία του node.

## Παράδειγμα – Κείμενο

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

## Παράδειγμα – Batch text

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

## Παράδειγμα – Δημιουργία εικόνας

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

Ενεργοποιήστε το **Guardrails** στις ιδιότητες του node για να αποκλείσετε μη ασφαλή μηνύματα χρήστη πριν από την κλήση του LLM. Ανατρέξτε στο [Guardrails](../reference/guardrails.md) για την πλήρη αναφορά.

## Σχετικά

- [Agent Node](./agent-node.md) – LLM με tool calling
- [Why Heym](../getting-started/why-heym.md) – Πού ταιριάζουν τα βήματα LLM στον κύκλο ζωής του agent
- [Guardrails](../reference/guardrails.md) – Αποκλεισμός μη ασφαλών κατηγοριών περιεχομένου
- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Expression DSL](../reference/expression-dsl.md) – Αναφορά δεδομένων σε prompts
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Επεκτάσιμος editor με ζωντανή προεπισκόπηση backend για prompts
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη κλειδιών LLM API
- [Quick Start](../getting-started/quick-start.md) – Βασικό workflow LLM

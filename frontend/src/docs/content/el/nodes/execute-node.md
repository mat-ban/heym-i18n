# Εκτέλεση

Ο κόμβος **Εκτέλεση** καλεί ένα άλλο workflow (υπο-workflow) και του μεταβιβάζει είσοδο. Χρησιμοποιήστε τον για επαναχρησιμοποιήσιμη λογική, όχι για μετασχηματισμό δεδομένων—για αυτό χρησιμοποιήστε τον κόμβο [Set](./set-node.md).

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.outputs.output.result`, `$nodeLabel.status`, `$nodeLabel.workflow_id` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `executeWorkflowId` | UUID | ID του workflow προς εκτέλεση |
| `executeInput` | expression | Μεμονωμένη είσοδος (για workflows με ένα πεδίο εισόδου) |
| `executeInputMappings` | array | `{ key, value }` για πολλαπλές εισόδους. `key` = όνομα πεδίου εισόδου του workflow-στόχου. |
| `executeDoNotWait` | boolean | Όταν είναι `true`, αποστέλλει το υπο-workflow στο παρασκήνιο χωρίς αναμονή. Έξοδος: `{ "status": "dispatched", "workflow_id": "..." }`. Προεπιλογή: `false`. |

## Μορφή Απόκρισης

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": {
    "output": { "result": "the output value" }
  },
  "execution_time_ms": 1297.63
}
```

## Χωρίς Αναμονή

Όταν `executeDoNotWait: true`, ο κόμβος αποστέλλει το υπο-workflow σε νήμα παρασκηνίου και επιστρέφει αμέσως:

```json
{
  "status": "dispatched",
  "workflow_id": "uuid"
}
```

Το γονικό workflow συνεχίζει στον επόμενο κόμβο χωρίς αναμονή. Η εγγραφή εκτέλεσης του υπο-workflow γράφεται στο trace ασύγχρονα όταν ολοκληρωθεί. Χρησιμοποιήστε το όταν το αποτέλεσμα του υπο-workflow δεν είναι απαραίτητο στη συνέχεια.

## Μεμονωμένη Είσοδος

```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInput": "$userInput.body.text"
  }
}
```

## Πολλαπλές Είσοδοι

Όταν το workflow-στόχος έχει πολλαπλά πεδία εισόδου, χρησιμοποιήστε το `executeInputMappings`:
```json
{
  "type": "execute",
  "data": {
    "label": "callWorkflow",
    "executeWorkflowId": "workflow-uuid",
    "executeInputMappings": [
      {"key": "text", "value": "$userInput.body.prompt"},
      {"key": "imageUrl", "value": "$userInput.body.image"}
    ]
  }
}
```

Το `key` πρέπει να αντιστοιχεί στα κλειδιά `inputFields` του [Input](./input-node.md) του workflow-στόχου.

## Σχετικά

- [Δυνατότητες Canvas](../reference/canvas-features.md) – Extract to Sub-Workflow για τη δημιουργία κόμβων Εκτέλεση από επιλεγμένους κόμβους
- [Τύποι Κόμβων](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Κόμβος Input](./input-node.md) – Πεδία εισόδου του workflow-στόχου
- [Κόμβος Set](./set-node.md) – Μετασχηματισμός δεδομένων (όχι κλήσεις workflow)

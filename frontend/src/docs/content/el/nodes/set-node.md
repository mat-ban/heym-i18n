# Set

Ο node **Set** μετασχηματίζει και αντιστοιχίζει δεδομένα εισόδου σε προσαρμοσμένη έξοδο. Χρησιμοποιήστε τον για κεφαλαία, substring, συνένωση, τυχαίους αριθμούς και οποιονδήποτε μετασχηματισμό δεδομένων—όχι για κλήση workflows (για αυτό χρησιμοποιήστε το [Execute](./execute-node.md)).

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.keyName` για κάθε κλειδί αντιστοίχισης |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `mappings` | array | Ζεύγη κλειδιού-τιμής. Κάθε ένα: `{ key, value }` όπου το `value` είναι μια [έκφραση](../reference/expression-dsl.md) |

## Χρήση εργαλείου Agent

Όταν ένας node Set είναι συνδεδεμένος σε έναν [Agent Node](./agent-node.md) ως εργαλείο node στον καμβά, κάθε τιμή αντιστοίχισης μπορεί να επισημανθεί ως **παρεχόμενη από τον agent** με το εικονίδιο bot. Οι επισημασμένες τιμές αντιστοίχισης γίνονται παράμετροι εργαλείου που ο agent συμπληρώνει κατά τον χρόνο εκτέλεσης. Οι μη επισημασμένες αντιστοιχίσεις παραμένουν σταθερές στη διαμόρφωση του node.

Το εικονίδιο bot εμφανίζεται μόνο όταν ο node Set είναι συνδεδεμένος στη λαβή εργαλείων ενός agent. Ένας μεμονωμένος node Set δεν εμφανίζει στοιχεία ελέγχου παρεχόμενων από τον agent.

## Κανόνες Έκφρασης

- Αναφορά προηγούμενων nodes: `$nodeName.text`, `$nodeName.body.field`
- Χρήση συναρτήσεων: `$randomInt(1, 10)`, `$range(1, 5)`, `$now.format('HH:mm')`
- Το `$range(a,b)` εξαιρεί το b· σε περίπτωση `a > b` επιστρέφει σφάλμα.
- Μόνο ένα `$` στην αρχή της έκφρασης—ποτέ μέσα σε παρενθέσεις
- Πρόσβαση στην έξοδο ανά κλειδί: `$setNode.randomNumber`, `$setNode.text`

## Παράδειγμα

```json
{
  "type": "set",
  "data": {
    "label": "transformData",
    "mappings": [
      { "key": "text", "value": "$userInput.body.text.upper()" },
      { "key": "firstChar", "value": "$userInput.body.text.substring(0, 1)" },
      { "key": "randomNum", "value": "$randomInt(1, 10)" },
      { "key": "rangeArr", "value": "$range(1, 5)" }
    ]
  }
}
```

Οι επόμενοι nodes έχουν πρόσβαση μέσω `$transformData.text`, `$transformData.firstChar`, `$transformData.randomNum`, `$transformData.rangeArr`.

## Σχετικά

- [JSON output mapper](./json-output-mapper-node.md) – Ίδιες αντιστοιχίσεις· ο μοναδικός terminal επιστρέφει root JSON για webhooks/runs
- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Execute Node](./execute-node.md) – Κλήση workflows (όχι μετασχηματισμός δεδομένων)
- [Expression DSL](../reference/expression-dsl.md) – Συναρτήσεις και σύνταξη
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Επεκτάσιμος editor με ζωντανή προεπισκόπηση backend και Prev/Next για αντιστοιχίσεις

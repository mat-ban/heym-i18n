# Error Handler

Ο κόμβος **Error Handler** συλλαμβάνει σφάλματα από οποιονδήποτε κόμβο στο workflow. Όταν υπάρχει, εκτελείται αυτόματα όταν αποτύχει οποιοσδήποτε κόμβος. Δεν απαιτούνται εισερχόμενες συνδέσεις—ενεργοποιείται από τη μηχανή του workflow.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 (ενεργοποιείται σε σφάλμα) |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.error`, `$nodeLabel.errorNode`, `$nodeLabel.errorNodeType`, `$nodeLabel.timestamp` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `message` | expression | Προαιρετικό. Προεπιλογή: `$error.message` |

## Πλαίσιο Σφάλματος

Όταν εκτελείται ο error handler, τα παρακάτω πεδία είναι διαθέσιμα:

| Πεδίο | Περιγραφή |
|-------|-------------|
| `$errorHandler.error` | Συμβολοσειρά μηνύματος σφάλματος |
| `$errorHandler.errorNode` | Ετικέτα του κόμβου που απέτυχε |
| `$errorHandler.errorNodeType` | Τύπος του κόμβου που απέτυχε |
| `$errorHandler.timestamp` | Πότε συνέβη το σφάλμα |

## Περιπτώσεις Χρήσης

- Αποστολή ειδοποιήσεων [Telegram](./telegram-node.md), [Slack](./slack-node.md) ή [Send Email](./send-email-node.md) σε αποτυχία
- Καταγραφή σφαλμάτων σε εξωτερικά συστήματα
- Επιστροφή προσαρμοσμένης απόκρισης σφάλματος μέσω [Output](./output-node.md)

Μόνο ένας Error Handler ανά workflow.

## Παράδειγμα

```json
{
  "type": "errorHandler",
  "data": {
    "label": "catchErrors"
  }
}
```

Σύνδεση με Output για προσαρμοσμένη απόκριση σφάλματος:
```json
{"message": "Error: $errorHandler.error at $errorHandler.errorNode"}
```

Ή σύνδεση με Slack για ειδοποιήσεις:
```json
{"message": "Workflow failed: $errorHandler.error in $errorHandler.errorNode"}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Telegram Node](./telegram-node.md) – Ειδοποίηση σε σφάλμα
- [Slack Node](./slack-node.md) – Ειδοποίηση σε σφάλμα
- [Send Email Node](./send-email-node.md) – Ειδοποιήσεις email
- [Throw Error Node](./throw-error-node.md) – Σκόπιμα σφάλματα

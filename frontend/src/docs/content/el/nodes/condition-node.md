# Condition

Ο node **Condition** διακλαδώνει το workflow με βάση μια έκφραση if/else. Δρομολογεί προς τη διαδρομή true ή false ανάλογα με το αποτέλεσμα.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 2 (true, false) |
| Έξοδος | Διοχετεύει την είσοδο στον επιλεγμένο κλάδο |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `condition` | expression | Έκφραση τύπου JavaScript (π.χ. `$input.text.length > 0`) |

## Edge Handles

- **Source handle `true`** – όταν η συνθήκη αξιολογείται ως truthy
- **Source handle `false`** – όταν η συνθήκη αξιολογείται ως falsy

## Τελεστές Έκφρασης

Υποστηρίζει: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`, `.length`, `.contains()`, κ.λπ. Ανατρέξτε στο [Expression DSL](../reference/expression-dsl.md).

## Παράδειγμα

```json
{
  "type": "condition",
  "data": {
    "label": "checkInput",
    "condition": "$userInput.body.text.length > 0"
  }
}
```

Συνδέστε edges με `sourceHandle: "true"` ή `sourceHandle: "false"` για δρομολόγηση σε διαφορετικούς κλάδους.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Switch Node](./switch-node.md) – Δρομολόγηση πολλαπλών κατευθύνσεων βάσει τιμής
- [Expression DSL](../reference/expression-dsl.md) – Σύνταξη συνθηκών
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Επεκτάσιμος editor με ζωντανή προεπισκόπηση backend για τη συνθήκη

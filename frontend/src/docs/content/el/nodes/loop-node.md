# Loop

Ο κόμβος **Loop** επαναλαμβάνει (iterates) έναν πίνακα, εκτελώντας τους επόμενους κόμβους για κάθε στοιχείο. Απαιτείται back-connection από τον τελευταίο κόμβο του σώματος της επανάληψης για να προχωρήσει.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 2 (default + loop back) |
| Έξοδοι | 2 (loop, done) |
| Έξοδος | `$nodeLabel.item`, `$nodeLabel.index`, `$nodeLabel.total`, `$nodeLabel.isFirst`, `$nodeLabel.isLast` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `arrayExpression` | expression | Έκφραση που επιλύεται σε έναν πίνακα (π.χ. `$input.items`) |

## Edge Handles

- **Source `loop`** – Συνδέεται με κόμβους που επεξεργάζονται κάθε στοιχείο (εκτελείται ανά επανάληψη)
- **Source `done`** – Συνδέεται με κόμβους που εκτελούνται αφού ολοκληρωθούν όλες οι επαναλήψεις
- **Target default** – Λαμβάνει τα αρχικά δεδομένα που περιέχουν τον πίνακα
- **Target `loop`** – Λαμβάνει το back-connection από τον τελευταίο κόμβο του σώματος της επανάληψης

## Loop Context (στο σώμα της επανάληψης)

- `$loopNode.item` – Τρέχον στοιχείο
- `$loopNode.index` – Δείκτης με βάση το 0
- `$loopNode.total` – Σύνολο στοιχείων
- `$loopNode.isFirst` – Boolean
- `$loopNode.isLast` – Boolean

## Κρίσιμοι Κανόνες

1. **Απαιτείται back-connection:** Ο τελευταίος κόμβος στο σώμα της επανάληψης ΠΡΕΠΕΙ να συνδεθεί πίσω στο `loop` input handle του loop.
2. **Χωρίς έξοδο στο σώμα του loop:** Οι κόμβοι [Output](./output-node.md) απαγορεύονται μέσα στο σώμα του loop. Χρησιμοποιήστε [Set](./set-node.md) ή [Variable](./variable-node.md) για ενδιάμεσα αποτελέσματα.
3. **Χωρίς αυτόματα αποτελέσματα:** Το loop δεν συλλέγει αποτελέσματα. Χρησιμοποιήστε κόμβους Variable με `$array()` και `.add()` για συσσώρευση.

## Παράδειγμα

```json
{
  "type": "loop",
  "data": {
    "label": "processItems",
    "arrayExpression": "$httpResponse.body.items"
  }
}
```

Ροή: loop → process node → (back to loop) → loop → done branch → output.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Variable Node](./variable-node.md) – Συλλογή στοιχείων σε ένα loop
- [Expression DSL](../reference/expression-dsl.md) – `item`, `index`, array methods

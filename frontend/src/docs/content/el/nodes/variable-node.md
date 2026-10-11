# Μεταβλητή

Ο node **Μεταβλητή** ορίζει ή ενημερώνει μια μεταβλητή προσβάσιμη από οποιονδήποτε node μέσω `$vars.variableName` (τοπική στο workflow) ή `$global.variableName` (μόνιμη). Χρησιμοποιήστε την για μετρητές, συσσωρευμένες λίστες και κοινόχρηστη κατάσταση σε ολόκληρο το workflow.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.value`, ή πρόσβαση μέσω `$vars.variableName` / `$global.variableName` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `variableName` | string | Όνομα μεταβλητής (χρησιμοποιείται ως `$vars.variableName` ή `$global.variableName`). Αποφύγετε τα [δεσμευμένα ονόματα](../reference/expression-dsl.md). |
| `variableValue` | expression | Τιμή προς ορισμό. Υποστηρίζει εκφράσεις. |
| `variableType` | `"auto"` \| `"string"` \| `"number"` \| `"boolean"` \| `"array"` \| `"object"` | Μετατροπή τύπου (προεπιλογή: auto) |
| `isGlobal` | boolean | Όταν είναι `true`, αποθηκεύεται στο [Global Variable Store](../reference/global-variables.md) (μόνιμο, ανά χρήστη). Όταν είναι `false` ή παραλείπεται, τοπικό στο workflow (στη μνήμη). |

## Μεταβλητές Πίνακα

Αρχικοποιήστε πίνακες με `$array()` ή `$array("a", "b")` σε έναν node Μεταβλητής πριν χρησιμοποιήσετε το `.add()`:

```json
{"variableName": "items", "variableValue": "$array()", "variableType": "array"}
```

Στη συνέχεια προσθέστε στοιχεία (χωρίς `$` μέσα στις παρενθέσεις):

```json
{"variableName": "items", "variableValue": "$vars.items.add(loopNode.item)", "variableType": "array"}
```

## Κρίσιμος Κανόνας

**Μην χρησιμοποιείτε ποτέ `$` μέσα στις παρενθέσεις μεθόδων:**

- ✅ `$vars.myArray.add(previousNode.text)`
- ❌ `$vars.myArray.add($previousNode.text)` – σπάει την έκφραση

## Παράδειγμα – Μετρητής

```json
{
  "type": "variable",
  "data": {
    "label": "incrementCounter",
    "variableName": "counter",
    "variableValue": "$vars.counter + 1",
    "variableType": "number"
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Loop Node](./loop-node.md) – Συλλογή στοιχείων με Μεταβλητή στο σώμα του loop
- [Expression DSL](../reference/expression-dsl.md) – `$vars`, `$global`, δεσμευμένα ονόματα
- [Global Variables](../reference/global-variables.md) – Μόνιμες μεταβλητές με `isGlobal`

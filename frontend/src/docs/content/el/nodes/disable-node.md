# Απενεργοποίηση Node

Ο κόμβος **Disable Node** απενεργοποιεί μόνιμα έναν άλλο κόμβο στο workflow. Κατά την εκτέλεσή του, ορίζει το `active` του κόμβου-στόχου σε `false` και διατηρεί την αλλαγή. Χρησιμοποιήστε τον για μεμονωμένες ενέργειες, όπως τη διακοπή ενός trigger cron αφού ικανοποιηθεί μια συνθήκη.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.targetNode`, `$nodeLabel.disabled` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `targetNodeLabel` | string | Ετικέτα του κόμβου προς απενεργοποίηση (π.χ. `hourlyCheck`) |

## Περίπτωση χρήσης

Απενεργοποιήστε ένα trigger [Cron](./cron-node.md) αφού ικανοποιηθεί μια συνθήκη, ώστε να μην εκτελείται πλέον σε μελλοντικές εκτελέσεις του workflow. Ενεργοποιήστε το ξανά αργότερα με τον κόμβο [Enable Node](./enable-node.md).

## Παράδειγμα

```json
{
  "type": "disableNode",
  "data": {
    "label": "stopCron",
    "targetNodeLabel": "hourlyCheck"
  }
}
```

Ροή: Cron → HTTP check → Condition (status complete?) → if true: Disable Node (target: cron) → Output.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Enable Node](./enable-node.md) – Επανενεργοποίηση ενός απενεργοποιημένου κόμβου
- [Cron Node](./cron-node.md) – Trigger προς απενεργοποίηση
- [Condition Node](./condition-node.md) – Διακλάδωση πριν την απενεργοποίηση

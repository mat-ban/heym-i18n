# Switch

Ο **node** Switch δρομολογεί την εκτέλεση σε διαφορετικές διαδρομές με βάση την αντιστοίχιση μιας τιμής με περιπτώσεις (cases). Υποστηρίζει N περιπτώσεις συν μια προεπιλεγμένη (default).

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | n (μία ανά περίπτωση + default) |
| Έξοδος | Διοχετεύει την είσοδο στον αντίστοιχο κλάδο |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό node (camelCase) |
| `expression` | expression | Τιμή προς αξιολόγηση (π.χ. `$input.category`) |
| `cases` | string[] | Τιμές περιπτώσεων προς αντιστοίχιση (π.χ. `["case1", "case2", "case3"]`) |

## Edge Handles

- Κάθε περίπτωση αποκτά ένα source handle (δείκτης 0, 1, 2, …)
- Default handle για τιμές που δεν αντιστοιχίζονται

## Παράδειγμα

```json
{
  "type": "switch",
  "data": {
    "label": "routeByCategory",
    "expression": "$classifier.category",
    "cases": ["sales", "support", "billing"]
  }
}
```

Συνδέστε edges με το `sourceHandle` ορισμένο στον δείκτη της περίπτωσης (0, 1, 2) ή στο default handle για τιμές που δεν αντιστοιχίζονται.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Condition Node](./condition-node.md) – Διακλάδωση If/else
- [Expression DSL](../reference/expression-dsl.md) – Σύνταξη εκφράσεων

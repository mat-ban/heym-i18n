# Sticky Note

Ο κόμβος **Sticky Note** προσθέτει εμπλουτισμένες σημειώσεις markdown στον καμβά. Δεν εκτελείται—χρησιμοποιήστε τον για τεκμηρίωση, οδηγίες, εικόνες αναφοράς ή σημειώσεις workflow.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 |
| Έξοδοι | 0 |
| Έξοδος | N/A (δεν εκτελείται) |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `stickyTitle` | string | Τίτλος εμφάνισης που προβάλλεται στο επάνω μέρος του sticky note. |
| `stickyColor` | string | Χρώμα φόντου: `yellow`, `sky`, `emerald`, `rose`, `violet` ή `zinc`. |
| `note` | string | Περιεχόμενο Markdown. Κάντε διπλό κλικ για επεξεργασία στον καμβά. Υποστηρίζει συνδέσμους και markdown εικόνων όπως `![Alt](https://example.com/image.png)`. |

## Παράδειγμα

```json
{
  "type": "sticky",
  "data": {
    "label": "workflowNotes",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Workflow Organization](../reference/workflow-organization.md) – Οργάνωση workflows

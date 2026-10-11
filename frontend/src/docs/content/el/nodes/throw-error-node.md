# Throw Error

Ο κόμβος **Throw Error** σταματά αμέσως την εκτέλεση του workflow και επιστρέφει μια απόκριση σφάλματος με προσαρμοσμένο κωδικό κατάστασης HTTP. Χρησιμοποιήστε τον για αποτυχίες επικύρωσης, μη εξουσιοδοτημένη πρόσβαση ή άλλες συνθήκες σφάλματος.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 0 |
| Έξοδος | Το workflow σταματά· απόκριση σφάλματος επιστρέφεται στον καλούντα |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `label` | string | Αναγνωριστικό κόμβου (camelCase) |
| `errorMessage` | expression | Μήνυμα σφάλματος (υποστηρίζει εκφράσεις) |
| `httpStatusCode` | number | Κωδικός κατάστασης HTTP (π.χ. 400, 401, 403, 404, 429, 500) |

## Συνήθεις Κωδικοί Κατάστασης

| Κωδικός | Περίπτωση χρήσης |
|------|----------|
| 400 | Bad Request (μη έγκυρη είσοδος) |
| 401 | Unauthorized (απαιτείται έλεγχος ταυτότητας) |
| 403 | Forbidden (άρνηση πρόσβασης) |
| 404 | Not Found (λείπει ο πόρος) |
| 422 | Unprocessable Entity (σφάλμα επικύρωσης) |
| 429 | Too Many Requests (όριο ρυθμού) |
| 500 | Internal Server Error |

## Παράδειγμα

```json
{
  "type": "throwError",
  "data": {
    "label": "validationError",
    "errorMessage": "Text input is required",
    "httpStatusCode": 400
  }
}
```

Χρησιμοποιήστε το με τον κόμβο [Condition](./condition-node.md) για να επικυρώσετε την είσοδο και να πετάξετε σφάλμα μόνο όταν είναι μη έγκυρη:
- Condition true → συνέχεια στο Output
- Condition false → Throw Error

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Condition Node](./condition-node.md) – Επικύρωση πριν από το throw
- [Error Handler](./error-handler-node.md) – Σύλληψη σφαλμάτων από άλλους κόμβους

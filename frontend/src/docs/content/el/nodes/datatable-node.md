# DataTable

Ο κόμβος **DataTable** διαβάζει, εγγράφει και διαχειρίζεται δεδομένα σε Heym DataTables. Χρησιμοποιήστε τον για λειτουργίες CRUD σε δομημένη αποθήκευση πρώτου μέρους, χωρίς εξωτερικά διαπιστευτήρια.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.rows`, `$nodeLabel.row`, `$nodeLabel.success`, `$nodeLabel.id` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `dataTableId` | UUID | DataTable από την [καρτέλα DataTable](../tabs/datatable-tab.md) |
| `dataTableOperation` | string | Λειτουργία: `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove`, `upsert` |
| `dataTableRowId` | expression | UUID γραμμής (για getById, update, remove) |
| `dataTableData` | JSON string | Τιμές στηλών: `{"column_name": "value"}` |
| `dataTableFilter` | JSON string | Φίλτρο (find/upsert/count). Τα `find` και `count` υποστηρίζουν τελεστές `{"age": {"$gt": 18}}`; το `upsert` χρησιμοποιεί ακριβή αντιστοίχιση `{"column_name": "value"}` |
| `dataTableSort` | string | Στήλη ταξινόμησης, πρόθεμα `-` για φθίνουσα σειρά |
| `dataTableLimit` | number | Μέγιστος αριθμός γραμμών που επιστρέφονται (προεπιλογή: 100) |

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|----------------|-------------|
| `find` | dataTableId | Εύρεση γραμμών που ταιριάζουν με προαιρετικό φίλτρο τελεστών, με προαιρετική ταξινόμηση/όριο |
| `getAll` | dataTableId | Λήψη όλων των γραμμών με προαιρετική ταξινόμηση/όριο |
| `count` | dataTableId | Καταμέτρηση γραμμών που ταιριάζουν με προαιρετικό φίλτρο τελεστών (καταμετράται στη βάση δεδομένων; επιστρέφει μόνο έναν αριθμό) |
| `getById` | dataTableId, dataTableRowId | Λήψη μίας γραμμής με UUID |
| `insert` | dataTableId, dataTableData | Εισαγωγή νέας γραμμής |
| `update` | dataTableId, dataTableRowId, dataTableData | Ενημέρωση γραμμής (συγχώνευση δεδομένων) |
| `remove` | dataTableId, dataTableRowId | Διαγραφή γραμμής |
| `upsert` | dataTableId, dataTableFilter, dataTableData | Ενημέρωση εάν βρεθεί αντιστοίχιση, διαφορετικά εισαγωγή |

## Παράδειγμα - Εύρεση Γραμμών

```json
{
  "type": "dataTable",
  "data": {
    "label": "findActive",
    "dataTableId": "table-uuid",
    "dataTableOperation": "find",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gte\": 18}, \"created_at\": {\"$contains\": \"2026-06\"}}",
    "dataTableSort": "-created_at",
    "dataTableLimit": 50
  }
}
```

## Παράδειγμα - Εισαγωγή Γραμμής

```json
{
  "type": "dataTable",
  "data": {
    "label": "addUser",
    "dataTableId": "table-uuid",
    "dataTableOperation": "insert",
    "dataTableData": "{\"name\": \"$start.text\", \"status\": \"pending\"}"
  }
}
```

## Παράδειγμα - Καταμέτρηση Γραμμών

Καταμέτρηση γραμμών που ταιριάζουν με μια συνθήκη σε έναν μόνο κόμβο, αντί για `getAll` → If/Else → Map.

```json
{
  "type": "dataTable",
  "data": {
    "label": "activeAdults",
    "dataTableId": "table-uuid",
    "dataTableOperation": "count",
    "dataTableFilter": "{\"status\": \"active\", \"age\": {\"$gt\": 18}}"
  }
}
```

Το αποτέλεσμα είναι διαθέσιμο ως `$activeAdults.count`. Ένα κενό ή παραλειπόμενο φίλτρο καταμετρά κάθε γραμμή.

### Τελεστές φίλτρου find και count

Σε ένα φίλτρο `find` ή `count`, μια απλή τιμή σημαίνει ισότητα; μια τιμή αντικειμένου εφαρμόζει έναν τελεστή:

| Τελεστής | Σημασία |
|----------|---------|
| `$eq` (ή μια απλή τιμή) | Ίσο με |
| `$ne` | Διάφορο του |
| `$gt`, `$gte`, `$lt`, `$lte` | Συγκρίσεις μεγαλύτερο/μικρότερο (αριθμητικές για στήλες τύπου `number`, διαφορετικά κείμενο) |
| `$contains` | Αντιστοίχιση υποσυμβολοσειράς χωρίς διάκριση πεζών-κεφαλαίων |
| `$in` | Η τιμή βρίσκεται στον δεδομένο πίνακα |

Παράδειγμα συνδυασμού πολλών: `{"status": "active", "age": {"$gte": 18}, "plan": {"$in": ["pro", "team"]}, "name": {"$contains": "jo"}}`. Οι άγνωστοι τελεστές αγνοούνται. Τα φίλτρα `upsert` εξακολουθούν να χρησιμοποιούν τιμές ακριβούς αντιστοίχισης για να βρουν τη γραμμή προς ενημέρωση.

Μπορείτε επίσης να φιλτράρετε με βάση τα μεταδεδομένα γραμμής — `id`, `table_id`, `created_at`, `updated_at`, `created_by`, `updated_by` — τα οποία είναι αποθηκευμένα ως πραγματικές στήλες και όχι μέσα στα δεδομένα σας. Για ημερομηνίες, περάστε μια πλήρη τιμή για συγκρίσεις εύρους (π.χ. `{"created_at": {"$gt": "2026-06-04"}}`) ή χρησιμοποιήστε `$contains` για μερική αντιστοίχιση κειμένου (π.χ. `{"created_at": {"$contains": "2026-06-04"}}`). Εάν μία από τις δικές σας στήλες έχει το ίδιο όνομα με ένα πεδίο μεταδεδομένων, η στήλη δεδομένων υπερισχύει.

## Πρόσβαση στην Έξοδο

- `$nodeLabel.success` - Κατάσταση επιτυχίας Boolean
- `$nodeLabel.rows` - Πίνακας γραμμών (find, getAll)
- `$nodeLabel.row` - Αντικείμενο μίας γραμμής (getById, insert, update, upsert)
- `$nodeLabel.row.data.column_name` - Πρόσβαση σε συγκεκριμένη τιμή στήλης
- `$nodeLabel.count` - Αριθμός γραμμών (γραμμές που επιστρέφονται για find/getAll; σύνολο γραμμών που ταιριάζουν για count)
- `$nodeLabel.id` - UUID γραμμής (insert, update, remove)
- `$nodeLabel.found` - Boolean (getById)
- `$nodeLabel.operation` - Όνομα λειτουργίας (π.χ. `count`; `insert`/`update` για upsert)

## Δεν Απαιτούνται Διαπιστευτήρια

Σε αντίθεση με τις εξωτερικές ενσωματώσεις, το DataTable λειτουργεί στην εσωτερική βάση δεδομένων του Heym. Τα δικαιώματα πρόσβασης του κατόχου του workflow ελέγχονται αυτόματα.

## Δημιουργία από τον AI Assistant

Όταν ο [AI Assistant](../reference/ai-assistant.md#data-tables) ή το [Chat](../tabs/chat-tab.md) δημιουργεί αυτόν τον κόμβο, επιλέγει ή δημιουργεί τον πίνακα μαζί σας και γράφει τα ακριβή ονόματα στηλών του πίνακα στα `dataTableData` και `dataTableFilter`.

## Σχετικά

- [Καρτέλα DataTable](../tabs/datatable-tab.md) - Δημιουργία και διαχείριση πινάκων
- [Κόμβος Grist](./grist-node.md) - Ενσωμάτωση εξωτερικού υπολογιστικού φύλλου
- [Expression DSL](../reference/expression-dsl.md) - Σύνταξη εκφράσεων για δυναμικές τιμές

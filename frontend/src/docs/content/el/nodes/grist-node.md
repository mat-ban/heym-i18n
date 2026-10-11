# Grist

Ο κόμβος **Grist** διαβάζει, εγγράφει και διαχειρίζεται δεδομένα σε υπολογιστικά φύλλα Grist. Χρησιμοποιήστε τον για λειτουργίες CRUD, μαζικές ενημερώσεις και αυτοματοποίηση υπολογιστικών φύλλων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Grist από την [καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) |
| `gristOperation` | string | Λειτουργία: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Αναγνωριστικό εγγράφου (από το URL του Grist) |
| `gristTableId` | expression | Αναγνωριστικό πίνακα |
| `gristRecordId` | expression | Αναγνωριστικό εγγραφής (λειτουργίες μεμονωμένης εγγραφής) |
| `gristRecordData` | JSON string | Τιμές πεδίων για δημιουργία/ενημέρωση. Χρησιμοποιήστε **column IDs** (π.χ. `User_Name`), όχι ετικέτες. |
| `gristRecordsData` | JSON string | Πίνακας εγγραφών για μαζικές λειτουργίες |
| `gristFilter` | JSON string | Φίλτρο: `{"Column_ID": [values]}` |
| `gristSort` | string | Ταξινόμηση: `Column_ID` ή `-Column_ID` (φθίνουσα) |
| `gristLimit` | number | Μέγιστος αριθμός εγγραφών (προεπιλογή: 100) |

## Column IDs vs Labels

Χρησιμοποιήστε **column IDs** (με κάτω παύλες, π.χ. `User_Name`) στο `gristRecordData` και στα φίλτρα, όχι ετικέτες εμφάνισης. Χρησιμοποιήστε το `listColumns` για να ανακαλύψετε τα column IDs.

## Παράδειγμα – Get Records

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Παράδειγμα – Create Record

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη κλειδιού API Grist
- [Third-Party Integrations](../reference/integrations.md#grist) – Ρύθμιση διαπιστευτηρίου Grist

# BigQuery

Ο κόμβος **BigQuery** εκτελεί SQL queries και εισάγει γραμμές σε σύνολα δεδομένων του Google BigQuery μέσω του BigQuery REST API v2. Χρησιμοποιήστε τον για να υποβάλλετε ερωτήματα σε μεγάλα αναλυτικά σύνολα δεδομένων ή να μεταδίδετε γραμμές σε πίνακες από δεδομένα του workflow.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | BigQuery (OAuth2) |
| Έξοδος | `$nodeLabel.rows`, `$nodeLabel.total`, `$nodeLabel.schema`, `$nodeLabel.insertedCount`, `$nodeLabel.errors` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο BigQuery από την καρτέλα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `bqOperation` | string | Λειτουργία: `query` ή `insertRows` |
| `bqProjectId` | expression | Αναγνωριστικό έργου Google Cloud (π.χ. `my-gcp-project`) |
| `bqQuery` | expression | Συμβολοσειρά SQL query. Απαιτείται για `query`. |
| `bqMaxResults` | string | Μέγιστος αριθμός γραμμών που επιστρέφονται από `query` (προεπιλογή `1000`). |
| `bqDatasetId` | expression | Αναγνωριστικό συνόλου δεδομένων (π.χ. `my_dataset`). Απαιτείται για `insertRows`. |
| `bqTableId` | expression | Αναγνωριστικό πίνακα (π.χ. `my_table`). Απαιτείται για `insertRows`. |
| `bqRowsInputMode` | `raw` \| `selective` | Για `insertRows`: **Raw** = πλήρης πίνακας JSON; **Selective** = μία γραμμή ως ζεύγη πεδίων κλειδιού-τιμής. |
| `bqRows` | expression | Πίνακας JSON αντικειμένων γραμμής για λειτουργία raw (π.χ. `[{"col": "$input.value"}]`). |
| `bqMappings` | array | Ζεύγη κλειδιού-τιμής για λειτουργία selective. Κάθε κλειδί είναι όνομα στήλης; κάθε τιμή είναι έκφραση. |

## Ρύθμιση Διαπιστευτηρίου

Το BigQuery χρησιμοποιεί μοντέλο **OAuth2 "Bring Your Own App"**. Παρέχετε τα δικά σας διαπιστευτήρια OAuth2 του Google Cloud.

**Διαμόρφωση backend:** Ορίστε το **`FRONTEND_URL`** στο backend του Heym στη δημόσια διεύθυνση URL της εφαρμογής (τη διεύθυνση που πληκτρολογούν οι χρήστες στον περιηγητή), π.χ. `https://your-heym-domain`. Το OAuth redirect URI είναι πάντα `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.

1. Μεταβείτε στο [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ενεργοποιήστε το **BigQuery API**.
2. Μεταβείτε στο **Credentials** → **Create Credentials** → **OAuth client ID** → επιλέξτε **Web application**.
3. Στο **Authorized redirect URIs**, προσθέστε ακριβώς: `{your FRONTEND_URL}/api/credentials/bigquery/oauth/callback`.
4. Αντιγράψτε το **Client ID** και το **Client Secret**.
5. Στο Heym Dashboard → **Credentials** → **New** → επιλέξτε **BigQuery (OAuth2)**.
6. Εισαγάγετε το Client ID, το Client Secret και ένα όνομα, και έπειτα κάντε κλικ στο **Connect** για να ολοκληρώσετε τη συγκατάθεση OAuth2 σε αναδυόμενο παράθυρο του περιηγητή.

Τα token ανανεώνονται αυτόματα στο παρασκήνιο — δεν απαιτείται χειροκίνητη διαχείριση token.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|-----------------|-------------|
| `query` | bqProjectId, bqQuery | Εκτελεί ένα SQL query και επιστρέφει γραμμές |
| `insertRows` | bqProjectId, bqDatasetId, bqTableId, bqRows ή bqMappings | Εισάγει μία ή περισσότερες γραμμές μέσω του streaming insertAll API |

## Αναφορά Εξόδου

| Λειτουργία | Πεδίο εξόδου | Τύπος | Περιγραφή |
|-----------|-------------|------|-------------|
| `query` | `.rows` | array | Πίνακας αντικειμένων γραμμής (όνομα στήλης → τιμή) |
| `query` | `.total` | number | Αριθμός γραμμών που επιστράφηκαν |
| `query` | `.schema` | array | Πεδία σχήματος πίνακα |
| `insertRows` | `.insertedCount` | number | Αριθμός γραμμών που εισήχθησαν επιτυχώς |
| `insertRows` | `.errors` | array | Σφάλματα εισαγωγής ανά γραμμή (κενό σε πλήρη επιτυχία) |

## Παράδειγμα – Εκτέλεση Query

```json
{
  "type": "bigquery",
  "data": {
    "label": "getUsers",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "query",
    "bqProjectId": "my-gcp-project",
    "bqQuery": "SELECT id, name, email FROM `my_dataset.users` WHERE active = TRUE LIMIT 100",
    "bqMaxResults": "100"
  }
}
```

Πρόσβαση στην έξοδο: `$getUsers.rows` (πίνακας αντικειμένων γραμμής), `$getUsers.rows[0].email`, `$getUsers.total`.

## Παράδειγμα – Εισαγωγή Γραμμής

```json
{
  "type": "bigquery",
  "data": {
    "label": "logEvent",
    "credentialId": "bigquery-credential-uuid",
    "bqOperation": "insertRows",
    "bqProjectId": "my-gcp-project",
    "bqDatasetId": "analytics",
    "bqTableId": "events",
    "bqRowsInputMode": "selective",
    "bqMappings": [
      { "key": "event_name", "value": "$input.eventName" },
      { "key": "user_id", "value": "$input.userId" },
      { "key": "timestamp", "value": "$input.timestamp" }
    ]
  }
}
```

## Σχετικά

- [Τύποι Κόμβων](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίου BigQuery OAuth2
- [Google Sheets](./google-sheets-node.md) – Παρόμοιο μοτίβο OAuth2 για δεδομένα υπολογιστικών φύλλων
- [Ενσωματώσεις Τρίτων](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων ενσωμάτωσης

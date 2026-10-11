# Supabase

Ο κόμβος **Supabase** διαβάζει και τροποποιεί πίνακες που εκτίθενται από το PostgREST API ενός έργου Supabase. Χρησιμοποιήστε τον όταν θέλετε πρόσβαση workflow σε κατάσταση εφαρμογής που υποστηρίζεται από SQL, χωρίς να γράφετε χειροκίνητα αιτήματα HTTP.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Supabase |
| Έξοδος | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.success` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Supabase από τα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `supabaseOperation` | string | Λειτουργία: `select`, `insert`, `update`, `upsert` ή `delete` |
| `supabaseSchema` | expression | Όνομα schema. Αν είναι κενό, ο κόμβος χρησιμοποιεί το προεπιλεγμένο schema του διαπιστευτηρίου και έπειτα το `public`. |
| `supabaseTable` | expression | Απλό όνομα πίνακα για ανάκτηση ή τροποποίηση. Τοποθετήστε το schema στο `supabaseSchema`, όχι εδώ. |
| `supabaseSelectColumns` | expression | Λίστα επιλογής PostgREST χωρισμένη με κόμματα για το `select` (προεπιλογή `*`) |
| `supabaseFilter` | expression | Αντικείμενο φίλτρου JSON. Υποστηρίζει ακριβείς αντιστοιχίσεις καθώς και αντικείμενα τελεστών και λογικές ομάδες, π.χ. `{"id":123}`, `{"created_at":{"gte":"2026-01-01"}}` ή `{"or":[{"status":"active"},{"score":{"gte":10}}]}` |
| `supabaseLimit` | string | Μέγιστος αριθμός γραμμών προς επιστροφή για το `select` (`0` = ανάκτηση όλων των αντιστοιχιζόμενων γραμμών με σελιδοποίηση από την πλευρά του διακομιστή, οι αρνητικές τιμές επιστρέφουν στο `100`) |
| `supabaseOrderBy` | expression | Προαιρετική στήλη για ταξινόμηση στο `select` |
| `supabaseAscending` | boolean | Αύξουσα ταξινόμηση όταν είναι `true`, φθίνουσα όταν είναι `false` |
| `supabaseRowsInputMode` | string | Για `insert`/`upsert`: λειτουργία `raw` JSON array ή `auto` για αυτόματη αντιστοίχιση της μονής ανάντη εισόδου |
| `supabaseDataInputMode` | string | Για `update`: λειτουργία `raw` JSON object ή `auto` για αυτόματη αντιστοίχιση της μονής ανάντη εισόδου |
| `supabaseIgnoredInputFields` | string | Προαιρετικά ονόματα πεδίων χωρισμένα με κόμματα προς παράλειψη κατά την αυτόματη αντιστοίχιση δεδομένων εισόδου |
| `supabaseRows` | expression | JSON array από αντικείμενα γραμμών για `insert` και `upsert` |
| `supabaseOnConflict` | expression | Προαιρετικές στήλες-στόχοι σύγκρουσης χωρισμένες με κόμματα για `upsert`, για παράδειγμα `id` ή `tenant_id,email` |
| `supabaseData` | expression | JSON object με ενημερωμένες τιμές στηλών για `update` |

## Ρύθμιση Διαπιστευτηρίου

Δημιουργήστε ένα διαπιστευτήριο **Supabase** στην [καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) με:

1. Το **Project URL** σας, για παράδειγμα `https://your-project.supabase.co`
2. Ένα **API key** με πρόσβαση στους πίνακες που θα χρησιμοποιεί αυτό το workflow
3. Ένα προαιρετικό **προεπιλεγμένο schema** (προεπιλογή `public`)

Ο κόμβος επικοινωνεί με το endpoint PostgREST της Supabase στο `/rest/v1/<table>`.
Χρησιμοποιήστε το `supabaseTable` μόνο για τον πίνακα, όπως `users` ή `profiles`. Μην περνάτε `schema.table`, `rpc/...` ή άλλες διαδρομές API εκεί.

Όταν έχει επιλεγεί ένα έγκυρο διαπιστευτήριο Supabase, ο editor μπορεί να ανακαλύψει τους εκτεθειμένους πίνακες και τις στήλες τους
απευθείας από τα μεταδεδομένα OpenAPI του PostgREST. Χρησιμοποιήστε το αναπτυσσόμενο μενού **discovered tables** για να
επιλέξετε έναν πίνακα και τα **column chips** κάτω από το **Select Columns** για να δημιουργήσετε γρήγορα μια λίστα επιλογής.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|-----------------|-------------|
| `select` | `supabaseTable` | Ανάκτηση γραμμών με προαιρετικά φίλτρα ακριβούς αντιστοίχισης, όριο και ταξινόμηση |
| `insert` | `supabaseTable`, `supabaseRows` ή αυτόματη αντιστοίχιση εισόδου | Εισαγωγή μίας ή περισσότερων γραμμών |
| `update` | `supabaseTable`, `supabaseData` ή αυτόματη αντιστοίχιση εισόδου, `supabaseFilter` | Ενημέρωση γραμμών που αντιστοιχούν στο φίλτρο |
| `upsert` | `supabaseTable`, `supabaseRows` ή αυτόματη αντιστοίχιση εισόδου | Εισαγωγή ή συγχώνευση γραμμών χρησιμοποιώντας τη σημασιολογία upsert της Supabase. Χρησιμοποιήστε το `supabaseOnConflict` όταν χρειάζεστε ρητό στόχο σύγκρουσης. |
| `delete` | `supabaseTable`, `supabaseFilter` | Διαγραφή γραμμών που αντιστοιχούν στο φίλτρο |

## Σύνταξη Φίλτρου

Το `supabaseFilter` μεταγλωττίζει δομημένο JSON σε παραμέτρους query του PostgREST.

- Ακριβής αντιστοίχιση: `{"status":"active"}`
- Σύγκριση: `{"created_at":{"gte":"2026-01-01"}}`
- Συμμετοχή σε σύνολο: `{"status":{"in":["active","paused"]}}`
- Αντιστοίχιση μοτίβου: `{"email":{"ilike":"*@example.com"}}`
- Λογικό OR: `{"or":[{"status":"active"},{"score":{"gte":10}}]}`
- Λογικό AND: `{"and":[{"score":{"gte":10}},{"score":{"lt":100}}]}`

Για πολλαπλούς τελεστές στο ίδιο πεδίο, προτιμήστε μια λογική ομάδα:

```json
{
  "and": [
    { "score": { "gte": 10 } },
    { "score": { "lt": 100 } }
  ]
}
```

## Σελιδοποίηση

Το `select` εκτελεί πλέον πραγματική σελιδοποίηση από την πλευρά του διακομιστή στο PostgREST.

- Το `supabaseLimit: "0"` ανακτά όλες τις αντιστοιχιζόμενες γραμμές σελίδα προς σελίδα
- Τιμές `supabaseLimit` άνω του 1000 κατανέμονται αυτόματα σε πολλαπλά αιτήματα
- Τα αποτελέσματα συγχωνεύονται πίσω σε έναν πίνακα `.rows` και το `.count` παραμένει ο συνολικός αριθμός αντιστοιχιζόμενων γραμμών

Κατά την ανάγνωση μεγάλων πινάκων, ορίστε ένα σταθερό `supabaseOrderBy` για να διατηρούνται τα όρια σελίδων προβλέψιμα.

## Αυτόματη Αντιστοίχιση Εισόδου

Για `insert`, `upsert` και `update`, μεταβείτε τον κόμβο σε **Auto-map input** όταν ο μονός
ανάντη κόμβος παράγει ήδη τη μορφή που θέλετε να εγγράψετε.

- Ένα μεμονωμένο αντικείμενο γίνεται μία γραμμή ή ένα payload ενημέρωσης
- Ένας πίνακας αντικειμένων γίνεται πολλές γραμμές για `insert` / `upsert`
- Ένα ανάντη αντικείμενο με πίνακα `rows` επαναχρησιμοποιεί απευθείας αυτόν τον πίνακα
- Το `supabaseIgnoredInputFields` σας επιτρέπει να παραλείψετε πεδία όπως `id`, `created_at` ή `success`
## Αναφορά Εξόδου

| Πεδίο εξόδου | Τύπος | Περιγραφή |
|-------------|------|-------------|
| `.rows` | array | Επιστρεφόμενα αντικείμενα γραμμών |
| `.count` | number | Αριθμός επιστρεφόμενων ή επηρεαζόμενων γραμμών |
| `.success` | boolean | Εάν η λειτουργία ολοκληρώθηκε με επιτυχία |

## Παράδειγμα – Επιλογή Ενεργών Χρηστών

```json
{
  "type": "supabase",
  "data": {
    "label": "activeUsers",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "select",
    "supabaseSchema": "public",
    "supabaseTable": "users",
    "supabaseSelectColumns": "id,email,status",
    "supabaseFilter": "{\"status\":\"active\"}",
    "supabaseLimit": "100",
    "supabaseOrderBy": "created_at",
    "supabaseAscending": false
  }
}
```

Πρόσβαση στην έξοδο: `$activeUsers.rows`, `$activeUsers.rows[0].email`, `$activeUsers.count`.

## Παράδειγμα – Upsert Γραμμής Προφίλ

```json
{
  "type": "supabase",
  "data": {
    "label": "saveProfile",
    "credentialId": "supabase-credential-uuid",
    "supabaseOperation": "upsert",
    "supabaseSchema": "public",
    "supabaseTable": "profiles",
    "supabaseRows": "[{\"id\": \"$input.userId\", \"display_name\": \"$input.name\"}]",
    "supabaseOnConflict": "id"
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίων Supabase
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων ενσωμάτωσης

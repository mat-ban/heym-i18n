# ClickHouse

Ο κόμβος **ClickHouse** εκτελεί λειτουργίες CRUD, μέτρησης και ακατέργαστου SQL έναντι εξωτερικής βάσης δεδομένων [ClickHouse](https://clickhouse.com/) μέσω της διεπαφής HTTP της. Χρησιμοποιήστε τον για να εγγράφετε συμβάντα σε έναν πίνακα ClickHouse από ένα workflow, να διαβάζετε ή να συγκεντρώνετε δεδομένα αναλυτικών στοιχείων ή να εκτελείτε αυθαίρετο SQL — χωρίς να συντάσσετε χειροκίνητα αιτήματα HTTP.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | ClickHouse |
| Έξοδος | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο ClickHouse από τα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Λειτουργία: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` ή `upsert` |
| `clickhouseTable` | expression | Απλό όνομα πίνακα. Απαιτείται για κάθε λειτουργία εκτός από την `query`. |
| `clickhouseQuery` | expression | Ακατέργαστο SQL για την `query`. Τα `SELECT`/`SHOW`/`DESCRIBE` επιστρέφουν γραμμές· άλλες εντολές εκτελούνται ως commands. |
| `clickhouseFilter` | expression | Αντικείμενο JSON με φίλτρα ισότητας, π.χ. `{"status":"active"}`. Χρησιμοποιείται από τις `find`, `count`, `update` και `remove`. Οι τιμές παραμετροποιούνται. |
| `clickhouseLimit` | string | Μέγιστος αριθμός γραμμών για `find` / `getAll` (`0` = χωρίς όριο, χωρίς ρήτρα LIMIT). Προεπιλογή `100`. |
| `clickhouseSort` | expression | Προαιρετικό `column` ή `column ASC\|DESC` για την `find` |
| `clickhouseRowId` | expression | Τιμή που αντιστοιχίζεται στη στήλη `id` του πίνακα για την `getById` |
| `clickhouseInputMode` | string | Για `insert`/`upsert`: λειτουργία `raw` με πίνακα JSON ή λειτουργία `selective` με πεδία key/value |
| `clickhouseData` | expression | Πίνακας JSON με αντικείμενα γραμμών για `insert`/`upsert` ή αντικείμενο JSON με τιμές στηλών για `update` |
| `clickhouseMappings` | array | Ζεύγη `{key, value}` που χρησιμοποιούνται όταν το `clickhouseInputMode` είναι `selective` |

## Ρύθμιση Διαπιστευτηρίου

Δημιουργήστε ένα διαπιστευτήριο **ClickHouse** στην [καρτέλα Διαπιστευτήρια](../tabs/credentials-tab.md) με:

1. **Host** — ο host HTTP χωρίς scheme, για παράδειγμα `your-instance.clickhouse.cloud`
2. **Port** — η θύρα της διεπαφής HTTP (`8443` για HTTPS, `8123` για HTTP)
3. **Username** / **Password** — προεπιλογή `default` με κενό password
4. **Database** — προεπιλογή `default`
5. **Secure** — ενεργοποιήστε για HTTPS (ClickHouse Cloud)

Ο κόμβος συνδέεται μέσω του επίσημου HTTP client `clickhouse-connect`. Χρησιμοποιήστε το **Test connection** στο παράθυρο διαλόγου του διαπιστευτηρίου για να επαληθεύσετε τη συνδεσιμότητα πριν από την αποθήκευση.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Εκτέλεση ακατέργαστου SQL. Το `SELECT` επιστρέφει `{rows, count}`· άλλες εντολές επιστρέφουν `{result}`. |
| `find` | `clickhouseTable` | Ανάγνωση γραμμών με προαιρετικά φίλτρα ισότητας, ταξινόμηση και όριο |
| `getAll` | `clickhouseTable` | Ανάγνωση γραμμών έως το όριο χωρίς φίλτρο |
| `count` | `clickhouseTable` | Μέτρηση γραμμών, προαιρετικά με φίλτρο |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Ανάγνωση μίας γραμμής με βάση τη στήλη `id` |
| `insert` | `clickhouseTable`, `clickhouseData` ή mappings | Εισαγωγή μίας ή περισσότερων γραμμών |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Ενημέρωση γραμμών που ταιριάζουν μέσω `ALTER TABLE ... UPDATE` |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Διαγραφή γραμμών που ταιριάζουν μέσω `DELETE FROM` |
| `upsert` | `clickhouseTable`, `clickhouseData` ή mappings | Εισαγωγή γραμμών (προϋποθέτει πίνακα `ReplacingMergeTree`) |

## Σύνταξη Φίλτρου

Το `clickhouseFilter` είναι ένα επίπεδο αντικείμενο JSON με ελέγχους ισότητας στηλών. Οι τιμές αποστέλλονται ως δεσμευμένες παράμετροι query, επομένως είναι ασφαλείς έναντι injection.

```json
{ "status": "active", "tenant_id": 42 }
```

Αυτό μεταγλωττίζεται σε `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Μόνο η ισότητα υποστηρίζεται στον builder φίλτρων — για εύρη τιμών, joins ή συγκεντρώσεις, χρησιμοποιήστε τη λειτουργία `query` με ακατέργαστο SQL.

## Λειτουργίες Εισόδου (insert / upsert)

- **Πίνακας JSON** (`raw`): παρέχετε έναν πίνακα JSON με αντικείμενα γραμμών στο `clickhouseData`. Τα κλειδιά που λείπουν από μια δεδομένη γραμμή εισάγονται ως `NULL`. Το σύνολο στηλών είναι η ένωση των κλειδιών σε όλες τις γραμμές.
- **Key-value** (`selective`): αφού επιλέξετε διαπιστευτήριο και πίνακα, ο editor ανακαλύπτει τις στήλες του πίνακα και δημιουργεί ένα πεδίο τιμής ανά στήλη. Μία γραμμή εισάγεται ανά εκτέλεση· κάθε τιμή υποστηρίζει εκφράσεις.

## Μεταλλάξεις και Σημασιολογία του ClickHouse

Το ClickHouse είναι βάση δεδομένων OLAP, επομένως οι εγγραφές σε επίπεδο γραμμής συμπεριφέρονται διαφορετικά από ένα OLTP σύστημα:

- Η **`update`** εκδίδει `ALTER TABLE … UPDATE` και η **`remove`** εκδίδει `DELETE FROM`. Και οι δύο είναι **ασύγχρονες μεταλλάξεις** — εφαρμόζονται τελικά και είναι σχετικά δαπανηρές. Προτιμήστε ομαδοποιημένες εγγραφές αντί για συχνές μεταλλάξεις μεμονωμένων γραμμών.
- Η **`upsert`** εκτελεί `INSERT`. Για συμπεριφορά merge-on-key, βασίστε τον πίνακα σε μηχανισμό `ReplacingMergeTree`.
- Η **`getById`** προϋποθέτει ότι ο πίνακας έχει στήλη `id`.
- Οι `update` και `remove` απαιτούν μη κενό `clickhouseFilter` για την αποφυγή μεταλλάξεων ολόκληρου του πίνακα.

## Αναφορά Εξόδου

| Πεδίο εξόδου | Τύπος | Περιγραφή |
|-------------|------|-------------|
| `.rows` | array | Αντικείμενα γραμμών που επιστράφηκαν (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Αριθμός γραμμών (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Μεμονωμένη γραμμή ή `null` (`getById`) |
| `.result` | string | Σύνοψη εντολής για `query` που δεν είναι SELECT |
| `.success` | boolean | Εάν η λειτουργία ολοκληρώθηκε επιτυχώς |
## Παράδειγμα – Εισαγωγή συμβάντος

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```

## Παράδειγμα – Καταμέτρηση ενεργών χρηστών

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Πρόσβαση στην έξοδο: `$activeCount.count`.

## Παράδειγμα – Ερώτημα ημερήσιας αναφοράς

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Πρόσβαση στην έξοδο: `$dailyReport.rows`, `$dailyReport.count`.

## Σχετικά

- [Τύποι κόμβων](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Καρτέλα διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίων ClickHouse
- [Ενσωματώσεις τρίτων](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων ενσωμάτωσης

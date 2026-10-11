# Κόμβος Amazon S3

Ο κόμβος Amazon S3 διαβάζει και εγγράφει αντικείμενα στο [Amazon S3](https://aws.amazon.com/s3/).

## Υποστηριζόμενες λειτουργίες

- `Create Bucket`: Δημιουργεί ένα bucket στην περιοχή (region) των διαπιστευτηρίων.
- `Delete Bucket`: Διαγράφει ένα κενό bucket.
- `List Buckets`: Εμφανίζει τα buckets που είναι ορατά στα διαπιστευτήρια.
- `Create Folder`: Δημιουργεί ένα κενό σημάδι φακέλου (κλειδί μηδενικού μήκους που τελειώνει με `/`).
- `Delete Folder`: Διαγράφει όλα τα αντικείμενα κάτω από ένα πρόθεμα φακέλου (συμπεριλαμβανομένων των ένθετων κλειδιών).
- `Get All in Folder`: Εμφανίζει όλα τα μεταδεδομένα αντικειμένων κάτω από ένα πρόθεμα φακέλου (σελιδοποίηση από την πλευρά του διακομιστή).
- `Upload Object`: Εγγράφει ένα payload κειμένου σε ένα bucket/key.
- `Get Object`: Κατεβάζει ένα αντικείμενο και επιστρέφει είτε αποκωδικοποιημένο κείμενο είτε περιεχόμενο base64.
- `Copy Object`: Αντιγράφει ένα αντικείμενο σε άλλο κλειδί ή bucket.
- `List Objects`: Εμφανίζει τα μεταδεδομένα αντικειμένων κάτω από ένα πρόθεμα (μία σελίδα, έως 1000 κλειδιά· υποστηρίζει continuation tokens).
- `Delete Object`: Διαγράφει ένα μεμονωμένο αντικείμενο με βάση το κλειδί του.

## Ρύθμιση διαπιστευτηρίων

Δημιουργήστε ένα διαπιστευτήριο `Amazon S3` στην καρτέλα Διαπιστευτήρια με:

- Access Key ID
- Secret Access Key
- Region
- Προαιρετικό Session Token (για προσωρινά διαπιστευτήρια AWS STS)

## Κοινά πεδία

- `Bucket`: Όνομα του bucket προορισμού (bucket προορισμού για λειτουργίες αντιγραφής).
- `Object Key`: Κλειδί αντικειμένου τύπου διαδρομής, όπως `reports/daily.json`.
- `Folder Path`: Πρόθεμα για λειτουργίες φακέλου (για παράδειγμα `docs/archive`).
- `Source Bucket`: Προαιρετικό bucket προέλευσης για αντιγραφή· προεπιλέγεται το bucket προορισμού.
- `Source Object Key`: Κλειδί προέλευσης για λειτουργίες αντιγραφής.
- `Prefix`: Χρησιμοποιείται από λειτουργίες λίστας για τον περιορισμό των αποτελεσμάτων.
- `Continuation Token`: Προαιρετικό token από προηγούμενη απάντηση λίστας για τη λήψη της επόμενης σελίδας.
- `Max Keys`: Μέγεθος σελίδας για το List Objects (1–1000).
- `Include Binary`: Όταν είναι ενεργοποιημένο στο Get Object, επιστρέφει `body_base64` αντί για `body_text`.
- `Body`: Περιεχόμενο κειμένου προς μεταφόρτωση.
- `Content Type`: Προαιρετικός τύπος MIME για τα μεταφορτωμένα αντικείμενα.

## Παραδείγματα εξόδου

### Create Bucket

- `${label}.success`
- `${label}.bucket`
- `${label}.region`

### Delete Bucket

- `${label}.success`
- `${label}.bucket`

### List Buckets

- `${label}.buckets`
- `${label}.count`
- `${label}.buckets[0].name`

### Create Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.etag`

### Delete Folder

- `${label}.success`
- `${label}.bucket`
- `${label}.folder`
- `${label}.deleted_count`
- `${label}.deleted_keys`

### Get All in Folder

- `${label}.folder`
- `${label}.count`
- `${label}.objects`
- `${label}.objects[0].key`

### Upload Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### Get Object

- `${label}.content_type`
- `${label}.content_length`
- `${label}.body_text`
- `${label}.body_base64`

### Copy Object

- `${label}.source_bucket`
- `${label}.source_key`
- `${label}.bucket`
- `${label}.key`
- `${label}.etag`

### List Objects

- `${label}.objects`
- `${label}.count`
- `${label}.truncated`
- `${label}.next_continuation_token`
- `${label}.objects[0].key`

### Delete Object

- `${label}.success`
- `${label}.bucket`
- `${label}.key`
- `${label}.delete_marker`

## Σημειώσεις

- Το `Upload Object` μεταφορτώνει προς το παρόν περιεχόμενο κειμένου UTF-8.
- Το `Get Object` μπορεί να επιστρέψει base64 για δυαδικά αρχεία ενεργοποιώντας την επιλογή binary.
- Το `Create Bucket` χρησιμοποιεί την περιοχή (region) των διαπιστευτηρίων και απαιτεί `s3:CreateBucket`.
- Το `Delete Bucket` απαιτεί το bucket να είναι κενό και χρειάζεται `s3:DeleteBucket`.
- Το `List Buckets` απαιτεί `s3:ListAllMyBuckets`.
- Το `Create Folder` μεταφορτώνει ένα σημάδι αντικειμένου μηδενικού μήκους· το S3 δεν έχει εγγενή τύπο καταλόγου.
- Το `Delete Folder` αφαιρεί κάθε αντικείμενο του οποίου το κλειδί ξεκινά με το πρόθεμα του φακέλου· χρησιμοποιήστε το με προσοχή.
- Το `Get All in Folder` πραγματοποιεί αυτόματη σελιδοποίηση μέσω του προθέματος έως ότου επιστραφούν όλα τα αντικείμενα.
- Το `List Objects` επιστρέφει μία σελίδα (έως 1000 κλειδιά). Όταν το `truncated` είναι true, περάστε το `next_continuation_token` στο πεδίο Continuation Token της επόμενης κλήσης.
- Το `Copy Object` απαιτεί `s3:GetObject` στην προέλευση και `s3:PutObject` στον προορισμό.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Credentials](../reference/credentials.md) – Τύποι διαπιστευτηρίων και χρήση
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίων Amazon S3

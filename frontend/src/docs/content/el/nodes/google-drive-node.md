# Google Drive

Ο **node** **Google Drive** καταγράφει, πραγματοποιεί λήψη, ενημερώνει και διαγράφει αρχεία και φακέλους στο Google Drive μέσω OAuth2. Μπορεί επίσης να αντιγράψει ένα αρχείο του Drive απευθείας στο [Heym Drive](./drive-node.md) με μία μόνο λειτουργία.

> **Αυτός δεν είναι ο node [Drive](./drive-node.md).** Εκείνος ο node είναι το *Heym Drive* — ο εσωτερικός χώρος αποθήκευσης αρχείων του Heym. Αυτός ο node επικοινωνεί με το Google Drive. Η λειτουργία `syncToHeymDrive` είναι η γέφυρα μεταξύ των δύο.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Google Drive (OAuth2) |
| Έξοδος | `$nodeLabel.files`, `$nodeLabel.content_base64`, `$nodeLabel.download_url`, `$nodeLabel.status` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Google Drive από τα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `gdOperation` | string | Λειτουργία: `listFolderFiles`, `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`, `removeFolder` |
| `gdFolderId` | expression | ID φακέλου ή πλήρες URL φακέλου του Drive. Χρησιμοποιείται από τις `listFolderFiles` και `removeFolder`. Κενό σημαίνει τη ρίζα του Drive. |
| `gdFileId` | expression | ID αρχείου ή πλήρες URL αρχείου Drive/Docs. Χρησιμοποιείται από τις `downloadFile`, `syncToHeymDrive`, `updateFile`, `removeFile`. |
| `gdMaxResults` | expression | Για τη `listFolderFiles`: μέγιστος αριθμός αρχείων προς επιστροφή (προεπιλογή 100). Κενό ή `0` φορτώνει ολόκληρο τον φάκελο μέσω σελιδοποίησης. Κάθε καταγεγραμμένο αρχείο περιλαμβάνει `size_bytes` όταν το Drive αναφέρει μέγεθος. |
| `gdQuery` | expression | Για τη `listFolderFiles`: πρόσθετο query του Drive που συνδυάζεται με AND με το φίλτρο φακέλου, π.χ. `mimeType='application/pdf'`. |
| `gdIncludeTrashed` | boolean | Για τη `listFolderFiles`: συμπερίληψη αρχείων στον κάδο απορριμμάτων. Προεπιλογή false. |
| `gdExportFormat` | string | Για τις `downloadFile` / `syncToHeymDrive`: `pdf`, `docx`, `xlsx`, `pptx`, `csv`, `txt`. Κενό σημαίνει αυτόματη επιλογή. Αγνοείται για κανονικά αρχεία. |
| `gdFilename` | expression | Για τη `syncToHeymDrive`: παράκαμψη του ονόματος αρχείου που αποθηκεύεται στο Heym Drive. |
| `gdBase64Content` | expression | Για τη `updateFile`: συμβολοσειρά base64 ή URL `data:` που αντικαθιστά το περιεχόμενο του αρχείου. |
| `gdNewName` | expression | Για τη `updateFile`: νέο όνομα αρχείου (μετονομασία). |
| `gdNewParentId` | expression | Για τη `updateFile`: ID ή URL φακέλου προορισμού (μετακίνηση). |
| `gdPermanentDelete` | boolean | Για τις `removeFile` / `removeFolder`: όταν είναι false (προεπιλογή) το στοιχείο μετακινείται στον κάδο απορριμμάτων και είναι ανακτήσιμο· όταν είναι true καταστρέφεται. |

## IDs Αρχείων και Φακέλων

Τα `gdFileId`, `gdFolderId` και `gdNewParentId` δέχονται είτε το **γυμνό ID** είτε ένα **πλήρες URL** — το Heym εξάγει το ID αυτόματα. Όλα τα παρακάτω λειτουργούν:

- `https://drive.google.com/file/d/1AbCdEf/view`
- `https://drive.google.com/drive/folders/1FolderXyz`
- `https://docs.google.com/document/d/1DocId/edit`
- `https://drive.google.com/open?id=1AbCdEf`
- `1AbCdEf`

## Google Docs, Sheets και Slides

Τα εγγενή έγγραφα της Google **δεν έχουν λήψιμα bytes**. Είναι εγγραφές στους διακομιστές της Google, όχι αρχεία — το Drive API επιστρέφει `403 Only files with binary content can be downloaded` εάν ζητηθεί το ακατέργαστο περιεχόμενό τους.

Οι `downloadFile` και `syncToHeymDrive` τα εντοπίζουν αυτόματα και αντ' αυτού πραγματοποιούν **export**, ώστε καμία λειτουργία να μην αποτυγχάνει απλώς και μόνο επειδή ο στόχος είναι ένα Google Doc:

| Προέλευση | Προεπιλεγμένο export |
|--------|----------------|
| Google Docs | PDF |
| Google Sheets | XLSX |
| Google Slides | PPTX |
| Οποιοσδήποτε άλλος εγγενής τύπος Google | PDF |

Ορίστε τη **Μορφή Export** για να παρακάμψετε τον στόχο. Η ρύθμιση αγνοείται για κανονικά ανεβασμένα αρχεία, τα οποία πραγματοποιούν πάντα λήψη ως έχουν.

## Λειτουργίες

| Λειτουργία | Απαιτείται | Περιγραφή |
|-----------|----------|-------------|
| `listFolderFiles` | — (κενός φάκελος = ρίζα) | Καταγραφή αρχείων σε έναν φάκελο, με προαιρετικό φίλτρο query |
| `downloadFile` | `gdFileId` | Λήψη bytes αρχείου ως base64, με αυτόματο export των εγγενών εγγράφων |
| `syncToHeymDrive` | `gdFileId` | Λήψη από το Google Drive και αποθήκευση του αποτελέσματος στο Heym Drive |
| `updateFile` | `gdFileId` + τουλάχιστον ένα από περιεχόμενο / όνομα / γονέας | Αντικατάσταση περιεχομένου, μετονομασία ή/και μετακίνηση |
| `removeFile` | `gdFileId` | Μετακίνηση στον κάδο απορριμμάτων (προεπιλογή) ή οριστική διαγραφή αρχείου |
| `removeFolder` | `gdFolderId` | Μετακίνηση στον κάδο απορριμμάτων (προεπιλογή) ή οριστική διαγραφή φακέλου και των περιεχομένων του |

### Η διαγραφή είναι ανακτήσιμη από προεπιλογή

Οι `removeFile` και `removeFolder` μετακινούν το στοιχείο στον **κάδο απορριμμάτων του Google Drive**, όπου μπορεί να ανακτηθεί. Αυτή είναι η ασφαλής προεπιλογή για κάτι που μπορεί να εκτελείται σε χρονοδιάγραμμα ή εντός ενός [Loop](./loop-node.md).

Η ενεργοποίηση της **Οριστικής διαγραφής** καταστρέφει το στοιχείο χωρίς δυνατότητα ανάκτησης. Για τη `removeFolder`, αυτό καταστρέφει επίσης όλα τα περιεχόμενα του φακέλου.

Ο node ελέγχει επίσης τον τύπο του στόχου: η `removeFile` αρνείται έναν φάκελο και η `removeFolder` αρνείται ένα αρχείο, ώστε ένα λανθασμένο ID να μην μπορεί να διαγράψει σιωπηλά το λάθος στοιχείο.

### Η updateFile αφήνει τα κενά πεδία ως έχουν

Η `updateFile` είναι ενημέρωση, όχι αντικατάσταση. Συμπληρώστε οποιονδήποτε συνδυασμό περιεχομένου, νέου ονόματος και νέου φακέλου — ό,τι αφήσετε κενό δεν τροποποιείται. Απαιτείται τουλάχιστον ένα από τα τρία.
## Ρύθμιση Διαπιστευτηρίων

Το Google Drive χρησιμοποιεί ένα μοντέλο **OAuth2 "Bring Your Own App"**. Παρέχετε τα δικά σας διαπιστευτήρια OAuth2 του Google Cloud.

> **Αυτό το διαπιστευτήριο παρέχει πλήρη πρόσβαση στο Drive.** Το Heym ζητά το scope `https://www.googleapis.com/auth/drive`, επειδή ο node λειτουργεί σε αρχεία που σας ανήκουν ήδη. Το στενότερο scope `drive.file` βλέπει μόνο τα αρχεία που δημιούργησε η ίδια η εφαρμογή, γεγονός που θα καθιστούσε αδύνατη την καταγραφή, την ενημέρωση και τη διαγραφή των υπαρχόντων αρχείων σας. Ανατρέξτε στην ενότητα [Κοινή χρήση διαπιστευτηρίων](../reference/credentials-sharing.md) πριν μοιραστείτε αυτό το διαπιστευτήριο με μια ομάδα.

**Διαμόρφωση backend:** Ορίστε τη μεταβλητή **`FRONTEND_URL`** στο backend του Heym στη δημόσια διεύθυνση URL της εφαρμογής. Το OAuth redirect URI είναι πάντα `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` — προκύπτει αποκλειστικά από αυτή τη ρύθμιση και όχι από headers αιτημάτων.

1. Μεταβείτε στο [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ενεργοποιήστε το **Google Drive API**.
2. Μεταβείτε στο **Credentials** → **Create Credentials** → **OAuth client ID** → επιλέξτε **Web application**.
3. Στην ενότητα **Authorized redirect URIs**, προσθέστε ακριβώς `{your FRONTEND_URL}/api/credentials/google-drive/oauth/callback`.
4. Αντιγράψτε το **Client ID** και το **Client Secret**.
5. Στο Heym: **Dashboard → Credentials → New → Google Drive (OAuth2)**, επικολλήστε και τις δύο τιμές και έπειτα κάντε κλικ στο **Connect** και εγκρίνετε την πρόσβαση στο αναδυόμενο παράθυρο.

## Έξοδος

### listFolderFiles

```json
{
  "status": "success",
  "operation": "listFolderFiles",
  "folder_id": "1FolderXyz",
  "count": 2,
  "files": [
    {
      "id": "1AbC",
      "name": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 20481,
      "modified_time": "2026-07-01T10:00:00.000Z",
      "web_view_link": "https://drive.google.com/file/d/1AbC/view",
      "is_folder": false
    }
  ]
}
```

Το `size_bytes` είναι `null` για φακέλους και για αρχεία εγγενή της Google, τα οποία δεν αναφέρουν μέγεθος.

### downloadFile

```json
{
  "status": "success",
  "operation": "downloadFile",
  "id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "export_format": "pdf",
  "content_base64": "JVBERi0xLjQ..."
}
```

Για ένα κανονικό αρχείο, το `exported` είναι `false` και το `export_format` είναι `null`.

### syncToHeymDrive

```json
{
  "status": "success",
  "operation": "syncToHeymDrive",
  "id": "9f1c2b3d-0000-4000-8000-000000000001",
  "google_file_id": "1AbC",
  "filename": "Notes.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "exported": true,
  "download_url": "https://your-heym-domain/api/files/dl/TOKEN"
}
```

Το `id` είναι το νέο αναγνωριστικό αρχείου του **Heym Drive**, διακριτό από το `google_file_id`.

### updateFile

```json
{
  "status": "success",
  "operation": "updateFile",
  "id": "1AbC",
  "name": "renamed.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 20481,
  "modified_time": "2026-07-27T10:00:00.000Z",
  "updated": ["content", "name"]
}
```

### removeFile / removeFolder

```json
{
  "status": "success",
  "operation": "removeFile",
  "id": "1AbC",
  "name": "report.pdf",
  "deleted": "trashed"
}
```

Το `deleted` είναι `"trashed"` ή `"permanent"`.

## Παράδειγμα: δημιουργία αντιγράφου ασφαλείας ενός φακέλου του Drive στο Heym Drive

1. **[Cron](./cron-node.md)** — εκτέλεση καθημερινά.
2. **Google Drive** — `listFolderFiles` στον φάκελο προέλευσης, με το `gdQuery` ορισμένο σε `mimeType='application/pdf'` εάν επιθυμείτε μόνο PDF.
3. **[Loop](./loop-node.md)** — επανάληψη στο `$ListReports.files`.
4. **Google Drive** — `syncToHeymDrive` με το `gdFileId` ορισμένο σε `$BackupLoop.item.id` και το `gdFilename` ορισμένο σε `$BackupLoop.item.name`.
5. **[Slack](./slack-node.md)** — ανάρτηση σύνοψης των στοιχείων που δημιουργήθηκαν ως αντίγραφα ασφαλείας.

## Σημειώσεις

- Κάθε πεδίο κειμένου δέχεται εκφράσεις `$`, επομένως τα IDs και τα ονόματα αρχείων μπορούν να προέρχονται από προηγούμενους nodes.
- Τα κοινόχρηστα drives υποστηρίζονται — ο node ορίζει το `supportsAllDrives` σε κάθε αίτημα.
- Το μέγεθος των λήψεων ελέγχεται βάσει της ρύθμισης `FILE_MAX_SIZE_MB` του backend.
- Συνδέστε αυτόν τον node στην είσοδο εργαλείου ενός node [Agent](./agent-node.md) και χρησιμοποιήστε το εικονίδιο bot σε οποιοδήποτε πεδίο, ώστε ο agent να το συμπληρώνει κατά τον χρόνο εκτέλεσης.

## Δείτε επίσης

- [Drive (Heym Drive)](./drive-node.md)
- [Google Sheets](./google-sheets-node.md)
- [Loop](./loop-node.md)
- [Διαπιστευτήρια](../reference/credentials.md)
- [Κοινή χρήση διαπιστευτηρίων](../reference/credentials-sharing.md)

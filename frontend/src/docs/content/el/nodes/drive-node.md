# Κόμβος Drive

Ο κόμβος **Drive** διαχειρίζεται αρχεία που δημιουργούνται από skills απευθείας μέσα σε ένα workflow. Χρησιμοποιήστε τον για να ανακτήσετε αρχεία, να κάνετε λήψη αρχείων από εξωτερικά URLs, να τα διαγράψετε, να τα μοιραστείτε ή να άρετε τον διαμοιρασμό τους με τις ομάδες σας, ή να ενημερώσετε τους περιορισμούς πρόσβασής τους (password, λήξη, όριο λήψεων) προγραμματιστικά.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.files`, `$nodeLabel.status`, `$nodeLabel.file_id`, `$nodeLabel.download_url` (ποικίλλει ανά λειτουργία) |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `driveOperation` | string | Λειτουργία: `get`, `getAll`, `downloadUrl`, `save`, `delete`, `setPassword`, `setTtl`, `setMaxDownloads`, `shareWithMyTeams`, `unshareWithMyTeams` |
| `driveFileId` | expression / select | UUID του αρχείου Drive προς διαχείριση (όλες οι λειτουργίες εκτός από `getAll`, `downloadUrl` και `save`) |
| `driveLimit` | number | Μέγιστος αριθμός αρχείων προς επιστροφή (μόνο για `getAll`; κενό σημαίνει χωρίς όριο) |
| `driveSourceUrl` | expression | URL προς ανάκτηση και αποθήκευση στο Drive (μόνο για `downloadUrl`) |
| `driveFilename` | expression | Πλήρες όνομα αρχείου συμπεριλαμβανομένης της επέκτασης (μόνο για `save`, π.χ. `1.mp3`) |
| `driveBase64Content` | expression | Ακατέργαστο string base64 ή data URL προς αποκωδικοποίηση και αποθήκευση (μόνο για `save`) |
| `driveIncludeBinary` | boolean | Συμπερίληψη του περιεχομένου του αρχείου ως base64 στην έξοδο (μόνο για `get`) |
| `drivePassword` | expression | Password προς ορισμό στο access token (μόνο για `setPassword`) |
| `driveTtlHours` | number | Ώρες μέχρι τη λήξη του συνδέσμου λήψης (μόνο για `setTtl`) |
| `driveMaxDownloads` | number | Μέγιστος επιτρεπόμενος αριθμός λήψεων (μόνο για `setMaxDownloads`) |

## Λήψη του File ID

Όταν ένα skill δημιουργεί αρχεία, η έξοδος περιλαμβάνει έναν πίνακα `_generated_files`. Κάθε καταχώρηση περιλαμβάνει ένα πεδίο `id`:

```json
{
  "_generated_files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 45231,
      "download_url": "https://your-domain.com/api/files/dl/abc123..."
    }
  ]
}
```

Ανατρέξτε στο file ID με: `$agentLabel._generated_files[0].id`

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|----------------|-------------|
| `get` | driveFileId | Ανάκτηση μεταδεδομένων αρχείου (και προαιρετικά δυαδικού περιεχομένου) από το Drive |
| `getAll` | κανένα | Λίστα αρχείων Drive που ανήκουν στον χρήστη και είναι κοινόχρηστα με την ομάδα, με μεταδεδομένα όπως όνομα αρχείου, MIME type, μέγεθος, πηγή και download URL |
| `downloadUrl` | driveSourceUrl | Ανάκτηση αρχείου από εξωτερικό URL και αποθήκευσή του στο Drive |
| `save` | driveFilename, driveBase64Content | Αποκωδικοποίηση περιεχομένου base64 και αποθήκευσή του ως αρχείο Drive |
| `delete` | driveFileId | Διαγραφή του αρχείου και όλων των access tokens του από τον δίσκο και τη βάση δεδομένων |
| `setPassword` | driveFileId, drivePassword | Αντικατάσταση του προεπιλεγμένου δημόσιου token με ένα προστατευμένο με password |
| `setTtl` | driveFileId, driveTtlHours | Αντικατάσταση του προεπιλεγμένου δημόσιου token με ένα που λήγει μετά από N ώρες |
| `setMaxDownloads` | driveFileId, driveMaxDownloads | Αντικατάσταση του προεπιλεγμένου δημόσιου token με ένα περιορισμένο σε N λήψεις |
| `shareWithMyTeams` | driveFileId | Διαμοιρασμός του αρχείου με δικαιώματα ανάγνωσης με όλες τις ομάδες στις οποίες ανήκει αυτή τη στιγμή ο κάτοχος του workflow |
| `unshareWithMyTeams` | driveFileId | Αφαίρεση όλων των διαμοιρασμών ομάδας από το αρχείο |

> **Σημείωση:** Οι λειτουργίες `set*` διαγράφουν το προεπιλεγμένο (χωρίς περιορισμούς) δημόσιο token και δημιουργούν ένα νέο με τον καθορισμένο περιορισμό. Το ενημερωμένο `download_url` περιλαμβάνεται στην έξοδο.
> **Διαμοιρασμός ομάδας:** Η `shareWithMyTeams` δημιουργεί ρητούς διαμοιρασμούς για τις τρέχουσες ομάδες του κατόχου. Μελλοντικές ομάδες δεν προστίθενται αυτόματα εκτός εάν η λειτουργία εκτελεστεί ξανά. Η `unshareWithMyTeams` αφαιρεί όλους τους διαμοιρασμούς ομάδας από το αρχείο.

## Παράδειγμα — Λήψη Αρχείου από URL

```json
{
  "type": "drive",
  "data": {
    "label": "fetchReport",
    "driveOperation": "downloadUrl",
    "driveSourceUrl": "https://example.com/reports/q1.pdf"
  }
}
```

Ανατρέξτε στο αποθηκευμένο αρχείο στη συνέχεια του workflow: `$fetchReport.id`, `$fetchReport.download_url`

Το όνομα αρχείου λαμβάνεται από την κεφαλίδα απόκρισης `Content-Disposition`· εάν απουσιάζει, προκύπτει από τη διαδρομή του URL.

## Παράδειγμα — Αποθήκευση Εισόδου Base64 στο Drive

Χρησιμοποιήστε το όταν ένας κόμβος εισόδου κειμένου (ή οποιοσδήποτε ανάντη κόμβος) παρέχει περιεχόμενο αρχείου base64:

```json
{
  "type": "drive",
  "data": {
    "label": "saveAudio",
    "driveOperation": "save",
    "driveFilename": "$userInput.body.filename",
    "driveBase64Content": "$userInput.body.base64"
  }
}
```

Ανατρέξτε στο αποθηκευμένο αρχείο στη συνέχεια του workflow: `$saveAudio.id`, `$saveAudio.download_url`

Το `driveBase64Content` δέχεται ένα ακατέργαστο string base64 ή ένα data URL `data:...;base64,...`. Ο MIME type συνάγεται από την επέκταση του ονόματος αρχείου.

## Παράδειγμα — Λήψη Αρχείου και Χρήση Δυαδικού Περιεχομένου σε Vision LLM

```json
{
  "type": "drive",
  "data": {
    "label": "fetchImage",
    "driveOperation": "get",
    "driveFileId": "550e8400-e29b-41d4-a716-446655440000",
    "driveIncludeBinary": true
  }
}
```

Ανατρέξτε στο περιεχόμενο base64 στη συνέχεια του workflow: `$fetchImage.file_base64`

Οι εικόνες που επιστρέφονται μέσω του `file_base64` εμφανίζονται ενσωματωμένες στον πίνακα εντοπισμού σφαλμάτων όταν εκτελείτε το workflow.

## Παράδειγμα — Λίστα Αρχείων Drive

```json
{
  "type": "drive",
  "data": {
    "label": "listFiles",
    "driveOperation": "getAll",
    "driveLimit": 50
  }
}
```

Ανατρέξτε στο πρώτο αρχείο που επιστρέφεται στη συνέχεια του workflow: `$listFiles.files[0].filename`, `$listFiles.files[0].size_bytes`
## Παράδειγμα — Διαγραφή αρχείου μετά την επεξεργασία

```json
{
  "type": "drive",
  "data": {
    "label": "cleanup",
    "driveOperation": "delete",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Παράδειγμα — Ορισμός κωδικού πρόσβασης σε παραγόμενο αρχείο

```json
{
  "type": "drive",
  "data": {
    "label": "protectFile",
    "driveOperation": "setPassword",
    "driveFileId": "$generateReport._generated_files[0].id",
    "drivePassword": "$input.password"
  }
}
```

## Παράδειγμα — Ορισμός λήξης (TTL)

```json
{
  "type": "drive",
  "data": {
    "label": "expireFile",
    "driveOperation": "setTtl",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveTtlHours": 24
  }
}
```

## Παράδειγμα — Περιορισμός λήψεων

```json
{
  "type": "drive",
  "data": {
    "label": "limitDownloads",
    "driveOperation": "setMaxDownloads",
    "driveFileId": "$generateReport._generated_files[0].id",
    "driveMaxDownloads": 3
  }
}
```

## Παράδειγμα — Κοινοποίηση με τις ομάδες μου

```json
{
  "type": "drive",
  "data": {
    "label": "shareReport",
    "driveOperation": "shareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

Τα μέλη της ομάδας μπορούν να προβάλλουν και να λαμβάνουν το αρχείο από το Drive και να χρησιμοποιούν λειτουργίες ανάγνωσης σε workflows. Δεν μπορούν να διαγράψουν, να κοινοποιήσουν εκ νέου ή να αλλάξουν τους περιορισμούς του δημόσιου συνδέσμου.

## Παράδειγμα — Ακύρωση κοινοποίησης από τις ομάδες μου

```json
{
  "type": "drive",
  "data": {
    "label": "unshareReport",
    "driveOperation": "unshareWithMyTeams",
    "driveFileId": "$generateReport._generated_files[0].id"
  }
}
```

## Μετατροπή αρχείου

Η μετατροπή μορφότυπου μεταφέρθηκε στον node [Converter](./converter-node.md). Αποθηκεύστε ή ανακτήστε το αρχείο με το Drive και, στη συνέχεια, παραδώστε το id του σε έναν node converter:

```json
{
  "type": "converter",
  "data": {
    "label": "convertDoc",
    "conversion": "fileConvert",
    "converterFileId": "$reportAgent._generated_files[0].id",
    "converterTargetFormat": "pdf"
  }
}
```

Το αρχικό αρχείο διατηρείται και το μετατρεπόμενο αρχείο αποθηκεύεται ως νέο αρχείο στο Drive.

## Πρόσβαση εξόδου

**get:**
- `$nodeLabel.id` — UUID του αρχείου
- `$nodeLabel.filename` — όνομα αρχείου
- `$nodeLabel.mime_type` — τύπος MIME (π.χ. `image/png`)
- `$nodeLabel.size_bytes` — μέγεθος αρχείου σε bytes
- `$nodeLabel.download_url` — δημόσιο URL λήψης
- `$nodeLabel.file_base64` — περιεχόμενο αρχείου κωδικοποιημένο σε base64 (μόνο όταν είναι ενεργοποιημένη η επιλογή **Include binary content**)

**getAll:**
- `$nodeLabel.files` — Πίνακας αντικειμένων μεταδεδομένων αρχείων
- `$nodeLabel.count` — Αριθμός αρχείων που επιστράφηκαν
- `$nodeLabel.files[0].id` — UUID του αρχείου
- `$nodeLabel.files[0].filename` — Όνομα αρχείου
- `$nodeLabel.files[0].mime_type` — Τύπος MIME
- `$nodeLabel.files[0].size_bytes` — Μέγεθος αρχείου σε bytes
- `$nodeLabel.files[0].download_url` — Δημόσιο URL λήψης όταν υπάρχει δημόσιο token
- `$nodeLabel.files[0].metadata` — Αποθηκευμένο αντικείμενο μεταδεδομένων
- `$nodeLabel.files[0].created_at` — Χρονική σήμανση δημιουργίας αρχείου

**downloadUrl:**
- `$nodeLabel.id` — UUID του νέου αποθηκευμένου αρχείου
- `$nodeLabel.filename` — όνομα αρχείου (από `Content-Disposition` ή διαδρομή URL)
- `$nodeLabel.mime_type` — τύπος MIME που εντοπίστηκε από την απόκριση ή την επέκταση αρχείου
- `$nodeLabel.size_bytes` — μέγεθος αρχείου σε bytes
- `$nodeLabel.download_url` — URL λήψης από το Drive για το αποθηκευμένο αρχείο

**delete:**
- `$nodeLabel.status` — `"deleted"`
- `$nodeLabel.file_id` — UUID του διαγραμμένου αρχείου

**setPassword / setTtl / setMaxDownloads:**
- `$nodeLabel.status` — `"updated"`
- `$nodeLabel.file_id` — UUID του αρχείου
- `$nodeLabel.download_url` — Νέο URL token πρόσβασης με τον περιορισμό που εφαρμόστηκε

**shareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID του αρχείου
- `$nodeLabel.shared_team_count` — Αριθμός κοινοποιήσεων σε ομάδες μετά τη λειτουργία

**unshareWithMyTeams:**
- `$nodeLabel.status` — `"success"`
- `$nodeLabel.file_id` — UUID του αρχείου
- `$nodeLabel.shared_team_count` — `0` μετά τη λειτουργία

## Κυριότητα

Οι λειτουργίες που προορίζονται αποκλειστικά για τον κάτοχο απαιτούν το αρχείο να ανήκει στον κάτοχο του workflow. Οι λειτουργίες ανάγνωσης (`get`, `getAll`) μπορούν επίσης να έχουν πρόσβαση σε αρχεία που έχουν κοινοποιηθεί στον κάτοχο του workflow μέσω ομάδας.

## Σχετικά

- [File Generation](../reference/file-generation.md) - Πώς οι δεξιότητες παράγουν αρχεία και η έξοδος `_generated_files`
- [Drive Tab](../reference/drive.md) - Οπτική διαχείριση αρχείων στον πίνακα ελέγχου
- [Agent Node](./agent-node.md) - Εκτελεί δεξιότητες που παράγουν αρχεία
- [Converter Node](./converter-node.md) - Μετατροπή ενός αποθηκευμένου αρχείου σε άλλο μορφότυπο ή OCR σε κείμενο
- [Expression DSL](../reference/expression-dsl.md) - Σύνταξη εκφράσεων για δυναμικές τιμές

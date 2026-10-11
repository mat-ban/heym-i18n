# Google Sheets

Ο κόμβος **Google Sheets** διαβάζει, εγγράφει και διαχειρίζεται δεδομένα σε υπολογιστικά φύλλα Google Sheets μέσω OAuth2. Χρησιμοποιήστε τον για να αυτοματοποιήσετε ροές εργασίας υπολογιστικών φύλλων — ανάγνωση αναφορών, καταγραφή αποτελεσμάτων, ενημέρωση ιχνηλατών και άλλα.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Διαπιστευτήριο | Google Sheets (OAuth2) |
| Έξοδος | `$nodeLabel.values`, `$nodeLabel.updatedRange`, `$nodeLabel.sheets`, `$nodeLabel.success` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Google Sheets από τα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `gsOperation` | string | Λειτουργία: `readRange`, `appendRows`, `updateRange`, `clearRange`, `getSheetInfo` |
| `gsSpreadsheetId` | expression | ID υπολογιστικού φύλλου ή πλήρες URL Google Sheets |
| `gsSheetName` | expression | Όνομα καρτέλας φύλλου (π.χ. `Sheet1`). Δεν απαιτείται για `getSheetInfo`. |
| `gsStartRow` | expression | Για `readRange`: πρώτη γραμμή δεδομένων με βάση το 1 (με `gsHasHeader`, η γραμμή 1 είναι η κεφαλίδα). |
| `gsMaxRows` | expression | Για `readRange`: μέγιστος αριθμός γραμμών δεδομένων (0 = όλες). |
| `gsHasHeader` | boolean | Για `readRange`: όταν είναι true, η γραμμή 1 αντιμετωπίζεται ως ονόματα στηλών. |
| `gsUpdateRow` | expression | Μόνο για `updateRange`: αριθμός γραμμής φύλλου με βάση το 1 προς ενημέρωση (στήλες A–Z)· αν δεν οριστεί, χρησιμοποιείται το `gsStartRow`. Δεν είναι batchUpdate — ένα PUT του values API. |
| `gsRange` | expression | Εύρος σε σημειογραφία A1 (π.χ. `A1:D100`). Παλαιότερα παραδείγματα· ο επεξεργαστής χρησιμοποιεί πεδία γραμμών για ανάγνωση/ενημέρωση. |
| `gsKeepHeader` | boolean | Μόνο για `clearRange`: όταν είναι true, η γραμμή 1 διατηρείται και οι γραμμές δεδομένων από κάτω εκκαθαρίζονται (στήλες A–Z). |
| `gsAppendPlacement` | `append` \| `prepend` | Μόνο για `appendRows`: **Bottom** προσθέτει μετά την τελευταία γραμμή με δεδομένα· **Top** εισάγει νέες γραμμές ακριβώς κάτω από τη γραμμή 1 (μετατοπίζει τα δεδομένα προς τα κάτω). |
| `gsValuesInputMode` | `raw` \| `selective` | Για `appendRows` / `updateRange`: **Raw** = πλήρης συστοιχία JSON· **Selective** = μία γραμμή φύλλου, μόνο πεδία στηλών (χωρίς ετικέτες A1). |
| `gsValuesSelectiveCols` | string | Λειτουργία Selective: αριθμός στηλών (A–Z). |
| `gsValues` | expression | Δισδιάστατη συστοιχία JSON τιμών (π.χ. `[["Name","Age"],["Alice",30]]`). Απαιτείται για `appendRows`, `updateRange`. |

## ID Υπολογιστικού Φύλλου

Το πεδίο `gsSpreadsheetId` δέχεται είτε το **γυμνό ID** (τη μεγάλη αλφαριθμητική συμβολοσειρά μεταξύ `/d/` και `/edit` σε ένα URL Google Sheets) είτε το **πλήρες URL** — το Heym εξάγει το ID αυτόματα.

## Ρύθμιση Διαπιστευτηρίου

Το Google Sheets χρησιμοποιεί μοντέλο **OAuth2 "Bring Your Own App"**. Παρέχετε τα δικά σας διαπιστευτήρια OAuth2 του Google Cloud.

**Διαμόρφωση backend:** Ορίστε το **`FRONTEND_URL`** στο backend του Heym στη δημόσια διεύθυνση URL της εφαρμογής (τη διεύθυνση που πληκτρολογούν οι χρήστες στον περιηγητή), π.χ. `https://your-heym-domain`. Το URI ανακατεύθυνσης OAuth είναι πάντα `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` — προκύπτει μόνο από αυτή τη ρύθμιση, όχι από κεφαλίδες αιτημάτων.

1. Μεταβείτε στο [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Enable APIs** → ενεργοποιήστε το **Google Sheets API**.
2. Μεταβείτε στα **Credentials** → **Create Credentials** → **OAuth client ID** → επιλέξτε **Web application**.
3. Στα **Authorized redirect URIs**, προσθέστε ακριβώς: `{your FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` (για παράδειγμα `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`).
4. Αντιγράψτε το **Client ID** και το **Client Secret**.
5. Στο Heym Dashboard → **Credentials** → **New** → επιλέξτε **Google Sheets (OAuth2)**.
6. Εισαγάγετε το Client ID, το Client Secret και ένα όνομα, και έπειτα κάντε κλικ στο **Connect** για να ολοκληρώσετε τη συγκατάθεση OAuth2 σε αναδυόμενο παράθυρο του περιηγητή.

Τα token ανανεώνονται αυτόματα στο παρασκήνιο — δεν απαιτείται χειροκίνητη διαχείριση token.

## Λειτουργίες

| Λειτουργία | Απαιτούμενα Πεδία | Περιγραφή |
|-----------|-----------------|-------------|
| `readRange` | gsSpreadsheetId, gsSheetName, gsStartRow, gsMaxRows, gsHasHeader | Ανάγνωση τιμών κελιών (A–Z)· προαιρετικό `gsRange` σε παλαιότερες ροές εργασίας |
| `appendRows` | gsSpreadsheetId, gsSheetName, gsValues | Προσθήκη γραμμών στο κάτω μέρος (`gsAppendPlacement` append) ή κάτω από τη γραμμή 1 (`prepend`) |
| `updateRange` | gsSpreadsheetId, gsSheetName, gsUpdateRow, gsValues | Αντικατάσταση γραμμής(-ών) ξεκινώντας από το `gsUpdateRow` (A–Z)· η πολυγραμμική JSON εγγράφει διαδοχικές γραμμές |
| `clearRange` | gsSpreadsheetId, gsSheetName | Εκκαθάριση όλων των τιμών στις στήλες A–Z για την καρτέλα· το προαιρετικό `gsKeepHeader` διατηρεί την πρώτη γραμμή |
| `getSheetInfo` | gsSpreadsheetId | Λήψη τίτλου υπολογιστικού φύλλου και λίστας καρτελών φύλλου |

## Αναφορά Εξόδου

| Λειτουργία | Πεδίο εξόδου | Τύπος | Περιγραφή |
|-----------|-------------|------|-------------|
| `readRange` | `.rows` | array | Αντικείμενα γραμμών: κλειδιά στηλών (ονόματα κεφαλίδων ή A, B, …) συν **`rowIndex`** (γραμμή φύλλου με βάση το 1) |
| `readRange` | `.total` | number | Αριθμός γραμμών δεδομένων που επιστράφηκαν |
| `appendRows` | `.updatedRange` | string | Εύρος που γράφτηκε |
| `appendRows` | `.updates` | number | Αριθμός γραμμών που προστέθηκαν |
| `updateRange` | `.updatedRange` | string | Εύρος που γράφτηκε |
| `updateRange` | `.updatedCells` | number | Αριθμός κελιών που ενημερώθηκαν |
| `clearRange` | `.clearedRange` | string | Εύρος που εκκαθαρίστηκε |
| `getSheetInfo` | `.title` | string | Τίτλος υπολογιστικού φύλλου |
| `getSheetInfo` | `.sheets` | array | Λίστα αντικειμένων `{sheetId, title}` |

Όλες οι λειτουργίες περιλαμβάνουν `success: true` και `operation: "<name>"` στην έξοδο.
## Παράδειγμα – Ανάγνωση ενός εύρους

```json
{
  "type": "googleSheets",
  "data": {
    "label": "readReport",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "readRange",
    "gsSpreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
    "gsSheetName": "Sheet1",
    "gsRange": "A1:D100"
  }
}
```

Πρόσβαση στην έξοδο: `$readReport.rows[0]` (αντικείμενο πρώτης γραμμής δεδομένων), `$readReport.rows[0].Name` (στήλη βάσει κεφαλίδας), `$readReport.rows[0].rowIndex` (γραμμή φύλλου με βάση το 1).

## Παράδειγμα – Προσθήκη γραμμής από την είσοδο

```json
{
  "type": "googleSheets",
  "data": {
    "label": "logEntry",
    "credentialId": "google-sheets-credential-uuid",
    "gsOperation": "appendRows",
    "gsSpreadsheetId": "$input.spreadsheetUrl",
    "gsSheetName": "Log",
    "gsValues": "[[\"$input.name\", \"$input.email\", \"$input.timestamp\"]]"
  }
}
```

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων κόμβων
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίου Google Sheets OAuth2
- [Third-Party Integrations](../reference/integrations.md#google-sheets-oauth2) – Ρύθμιση διαπιστευτηρίου Google Sheets

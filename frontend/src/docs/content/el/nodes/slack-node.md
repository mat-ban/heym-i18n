# Slack

Ο **node** Slack στέλνει ένα μήνυμα σε ένα κανάλι Slack μέσω ενός Incoming Webhook. Χρησιμοποιήστε τον για ειδοποιήσεις, alerts και αναφορά σφαλμάτων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | Διέρχεται η είσοδος |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο Slack (webhook URL) από [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `message` | expression | Κείμενο μηνύματος. Υποστηρίζει [expressions](../reference/expression-dsl.md). |

## Ρύθμιση

1. Δημιουργήστε ένα Incoming Webhook στον χώρο εργασίας σας στο Slack
2. Προσθέστε ένα διαπιστευτήριο Slack στην καρτέλα Διαπιστευτήρια με το webhook URL
3. Αναφέρετε το διαπιστευτήριο στον node

## Παράδειγμα

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Χρησιμοποιήστε το με τον [Error Handler](./error-handler-node.md) για ειδοποιήσεις αποτυχίας:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Ασφάλεια εξερχόμενης κίνησης

- Το webhook URL που είναι αποθηκευμένο στο διαπιστευτήριο πρέπει να χρησιμοποιεί `http://` ή `https://` και να επιλύεται μόνο σε δημόσιες διευθύνσεις. Προορισμοί loopback, private, link-local, multicast και cloud-metadata αποκλείονται.
- Το Heym επικυρώνει τις επιλυμένες διευθύνσεις και καθηλώνει τον στόχο της σύνδεσης πριν από την αποστολή, ώστε μια απάντηση DNS να μην μπορεί να μετακινήσει το αίτημα σε εσωτερική διεύθυνση μετά τον έλεγχο. Οι proxies περιβάλλοντος απενεργοποιούνται όσο ο έλεγχος είναι ενεργός και οι ανακατευθύνσεις δεν ακολουθούνται.
- Αναπτύξεις που στέλνουν σε εσωτερικό webhook receiver μπορούν να ορίσουν `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` σε μια αξιόπιστη self-hosted instance. Διατηρήστε την προεπιλεγμένη τιμή σε hosted ή multi-tenant αναπτύξεις.

**Σημείωση αναβάθμισης για την v0.0.109:** αυτός ο έλεγχος είναι νέος για το Slack. Ένα διαπιστευτήριο του οποίου το webhook URL δείχνει σε loopback ή ιδιωτική διεύθυνση απορρίπτεται, εκτός εάν είναι ενεργοποιημένη η παραπάνω ρύθμιση.

## Σχετικά

- [Node Types](../reference/node-types.md) – Επισκόπηση όλων των τύπων node
- [Error Handler](./error-handler-node.md) – Αποστολή Slack σε αποτυχία workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη Slack webhook

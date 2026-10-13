# Αποστολή Email

Ο node **Αποστολή Email** στέλνει emails μέσω SMTP. Χρησιμοποιήστε τον για ειδοποιήσεις, alerts και transactional emails.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 1 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.status`, `$nodeLabel.to`, `$nodeLabel.cc`, `$nodeLabel.bcc`, `$nodeLabel.subject`, `$nodeLabel.attachment_count` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο SMTP από την καρτέλα [Διαπιστευτήρια](../tabs/credentials-tab.md) |
| `to` | expression | Παραλήπτης(-ες). Διαχωρισμένοι με κόμμα για πολλαπλούς. |
| `cc` | expression | Παραλήπτης(-ες) με κοινοποίηση (carbon-copy). Διαχωρισμένοι με κόμμα για πολλαπλούς. |
| `bcc` | expression | Παραλήπτης(-ες) με κρυφή κοινοποίηση (blind carbon-copy). Διαχωρισμένοι με κόμμα για πολλαπλούς. Κρυμμένοι από τους άλλους παραλήπτες. |
| `subject` | expression | Θέμα email |
| `emailBody` | expression | Περιεχόμενο σώματος email |
| `attachments` | expression | IDs αρχείων από το [Drive](./drive-node.md), διαχωρισμένα με κόμμα, προς επισύναψη. Μόνο αρχεία που ανήκουν στον κάτοχο του workflow ή είναι κοινόχρηστα με μία από τις ομάδες του μπορούν να επισυναφθούν. |

## Συνημμένα

Επισυνάψτε αρχεία από το [Drive](./drive-node.md) σας περνώντας ένα ή περισσότερα IDs αρχείων του Drive στο πεδίο `attachments`. Χρησιμοποιήστε μια έκφραση `$` για να αναφερθείτε στην έξοδο `id` ενός ανάντη node του Drive (για παράδειγμα `$drive.id`), ή παραθέστε στατικά IDs διαχωρισμένα με κόμματα. Κάθε ID επιλύεται στο πεδίο του κατόχου του workflow· ένα μη έγκυρο ή μη προσβάσιμο ID προκαλεί αποτυχία του node αντί να σταλεί μερικό email.

## Ρύθμιση

Προσθέστε ένα διαπιστευτήριο SMTP με server, port, email και password. Ο ορατός αποστολέας είναι το προαιρετικό πεδίο **From** του διαπιστευτηρίου· αν το From είναι κενό, η αποστολή γίνεται ως το όνομα χρήστη. Συνήθεις SMTP servers:

- Gmail: `smtp.gmail.com`, port 587 (Απαιτείται App Password)
- Outlook: `smtp.office365.com`, port 587

## Παράδειγμα

```json
{
  "type": "sendEmail",
  "data": {
    "label": "notifyUser",
    "credentialId": "smtp-credential-uuid",
    "to": "$userInput.body.email",
    "cc": "manager@example.com",
    "bcc": "audit@example.com",
    "subject": "Your request has been processed",
    "emailBody": "Hello,\n\nYour request for $userInput.body.text has been completed.",
    "attachments": "$drive.id"
  }
}
```

Η τιμή `attachments` παραπάνω αναφέρεται σε ένα ανάντη node [Drive](./drive-node.md) με ετικέτα `drive`, επισυνάπτοντας το αρχείο που παρήγαγε.

## Σχετικά

- [Τύποι Nodes](../reference/node-types.md) – Επισκόπηση όλων των τύπων nodes
- [Error Handler](./error-handler-node.md) – Αποστολή email σε περίπτωση αποτυχίας
- [Καρτέλα Διαπιστευτηρίων](../tabs/credentials-tab.md) – Προσθήκη διαπιστευτηρίων SMTP
- [Ενσωματώσεις Τρίτων](../reference/integrations.md#smtp-email) – Ρύθμιση παρόχου SMTP (Gmail, Outlook, Mailgun, SendGrid)

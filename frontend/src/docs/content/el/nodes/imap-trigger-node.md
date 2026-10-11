# IMAP Trigger

Ο κόμβος **IMAP Trigger** πραγματοποιεί δημοσκόπηση σε ένα γραμματοκιβώτιο email σε σταθερό διάστημα και εκκινεί ένα workflow μία φορά για κάθε νεοεντοπισμένο μήνυμα. Πρόκειται για έναν trigger node μηδενικής εισόδου, σχεδιασμένο για αυτοματοποίηση εισερχόμενων email, όπως διαλογή αιτημάτων υποστήριξης, παρακολούθηση κοινόχρηστων γραμματοκιβωτίων και γραμματοκιβώτια εγκρίσεων.

## Επισκόπηση

| Ιδιότητα | Τιμή |
|----------|-------|
| Είσοδοι | 0 |
| Έξοδοι | 1 |
| Έξοδος | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Παράμετροι

| Παράμετρος | Τύπος | Περιγραφή |
|-----------|------|-------------|
| `credentialId` | UUID | Διαπιστευτήριο `imap` που περιέχει server, login, mailbox και ρυθμίσεις SSL |
| `pollIntervalMinutes` | Integer | Πόσο συχνά το Heym ελέγχει το γραμματοκιβώτιο για νέα email |

## Οδηγός Ρύθμισης

### 1. Δημιουργία Διαπιστευτηρίου `imap`

1. Μεταβείτε στις **Settings → Credentials → New Credential**
2. Επιλέξτε τύπο **IMAP Email Inbox**
3. Εισαγάγετε:
   - **IMAP Host** (για παράδειγμα `imap.gmail.com`)
   - **IMAP Port** (`993` για SSL/TLS στους περισσότερους παρόχους)
   - **Username / Email**
   - **Password / App Password**
   - Προαιρετικό **Mailbox** (προεπιλογή: `INBOX`)
4. Αφήστε την επιλογή **Use SSL / TLS** ενεργοποιημένη, εκτός εάν ο mail server σας απαιτεί ρητά IMAP χωρίς SSL
5. Αποθηκεύστε το διαπιστευτήριο

### 2. Προσθήκη του Κόμβου στο Workflow σας

1. Σύρετε τον **IMAP Trigger** στον καμβά
2. Επιλέξτε τον κόμβο για να ανοίξει ο πίνακας Properties
3. Επιλέξτε το διαπιστευτήριο `imap` σας
4. Ορίστε το **Poll Interval (Minutes)** με ακέραια τιμή, όπως `1`, `5` ή `15`

## Σημασιολογία Trigger

- Η πρώτη δημοσκόπηση καθορίζει μια βάση του τρέχοντος περιεχομένου του γραμματοκιβωτίου και **δεν** αναπαράγει παλαιότερα email.
- Οι επόμενες δημοσκοπήσεις ενεργοποιούν μία φορά ανά μήνυμα του οποίου το IMAP UID είναι νεότερο από τον αποθηκευμένο δείκτη.
- Εάν το `UIDVALIDITY` του γραμματοκιβωτίου αλλάξει, το Heym επαναφέρει τον δείκτη και καθορίζει εκ νέου βάση, για να αποφευχθεί η διπλή επεξεργασία.
- Κάθε νέο email εκκινεί ξεχωριστή εκτέλεση workflow με `trigger_source = "imap"`.

## Πεδία Εξόδου

Αφού ενεργοποιηθεί ο κόμβος, οι downstream κόμβοι μπορούν να έχουν πρόσβαση σε:

| Έκφραση | Περιγραφή |
|------------|-------------|
| `$nodeLabel.email` | Πλήρες αναλυμένο payload email |
| `$nodeLabel.email.subject` | Αποκωδικοποιημένο θέμα |
| `$nodeLabel.email.from` | Ακατέργαστη κεφαλίδα `From` |
| `$nodeLabel.email.fromAddresses` | Αναλυμένη λίστα αποστολέων |
| `$nodeLabel.email.toAddresses` | Αναλυμένη λίστα παραληπτών |
| `$nodeLabel.email.ccAddresses` | Αναλυμένη λίστα CC |
| `$nodeLabel.email.replyToAddresses` | Αναλυμένη λίστα reply-to |
| `$nodeLabel.email.text` | Σώμα απλού κειμένου |
| `$nodeLabel.email.html` | Σώμα HTML |
| `$nodeLabel.email.attachments` | Πίνακας μεταδεδομένων συνημμένων (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Αποκωδικοποιημένο αντικείμενο κεφαλίδων |
| `$nodeLabel.email.uid` | IMAP UID για αποδιπλοποίηση ή καταγραφή |
| `$nodeLabel.triggered_by` | Ετικέτα πηγής trigger (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Αναγνωριστικό κόμβου στον καμβά που εντόπισε το email |
| `$nodeLabel.triggered_at` | Χρονική σήμανση ISO για την εκτέλεση του workflow |

## Παράδειγμα Workflow

**Εισερχόμενο email υποστήριξης → σύνοψη → δρομολόγηση**

```
imapTrigger → llm → condition → slack / sendEmail
```

- Ετικέτα **IMAP Trigger**: `supportInbox`
- Μήνυμα χρήστη **LLM**: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Σημειώσεις

- Πολλοί πάροχοι απαιτούν **app password** για πρόσβαση IMAP αντί για τον κύριο κωδικό πρόσβασης του λογαριασμού σας.
- Τα περιεχόμενα των συνημμένων δεν εισάγονται στην είσοδο του workflow· περιλαμβάνονται μόνο τα μεταδεδομένα των συνημμένων.
- Χρησιμοποιήστε τους [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ή [DataTable](./datatable-node.md) downstream για δρομολόγηση ή καταγραφή νέων email.

## Σχετικά

- [Triggers](../reference/triggers.md) – Επισκόπηση όλων των σημείων εισόδου workflow
- [Third-Party Integrations](../reference/integrations.md) – Ρύθμιση διαπιστευτηρίου IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Προσθήκη και διαχείριση διαπιστευτηρίων `imap`
- [Send Email](./send-email-node.md) – Απάντηση ή προώθηση εισερχόμενων μηνυμάτων
